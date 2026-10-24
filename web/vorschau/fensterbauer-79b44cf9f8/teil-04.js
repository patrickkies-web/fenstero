/* Pakete: Auswahl steuert die große Vorschau */
(function () {
  var pk = document.querySelector('.pk'); if (!pk) return;
  var namen = ['EEZI Essential', 'EEZI Essential Plus', 'EEZI Signature'];
  var texte = ['eeziframes-Design mit Ihrem Namen, unten der Hinweis „Powered by EEZIframes“.',
               'Ihr Logo, Ihre Firmenfarbe, bis zu 6 Fotos Ihres Betriebs und eine eigene Startseite.',
               'Wie Essential Plus, ohne eeziframes-Hinweis. Dazu ein Dashboard mit Einladungslinks und Fortschritt.'];
  var vtext = pk.querySelector('[data-vorschau-text]');
  var karten = pk.querySelectorAll('.pk-karte'), tabs = pk.querySelectorAll('.pk-tab');
  var mocks = pk.querySelectorAll('.mock'), name = pk.querySelector('[data-paket-name]');
  var tablist = pk.querySelector('.pk-tabs'), aktiv = 0, adresse = pk.querySelector('[data-adresse]');
  function waehle(i, fokus) {
    aktiv = i;
    karten.forEach(function (k, n) {
      k.classList.toggle('ist-aktiv', n === i);
      k.querySelector('.pk-wahl').setAttribute('aria-pressed', String(n === i));
    });
    tabs.forEach(function (t, n) { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
    if (fokus) tabs[i].focus();
    tablist.style.setProperty('--i', i);
    mocks.forEach(function (m, n) { m.classList.toggle('ist-aktiv', n === i); });
    pk.querySelectorAll('.pins').forEach(function (p) { p.classList.toggle('ist-aktiv', +p.dataset.paket === i); });
    adresse.textContent = mocks[i].getAttribute('data-adresse');
    name.textContent = namen[i];
    if (vtext) vtext.textContent = texte[i];
  }
  karten.forEach(function (k) {
    k.addEventListener('click', function (e) {
      if (e.target.closest('.pk-cta')) return;
      waehle(+k.dataset.paket);
    });
  });
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { waehle(+t.dataset.paket); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); waehle((aktiv + 1) % 3, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); waehle((aktiv + 2) % 3, true); }
    });
  });
  waehle(1);
  var ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (!ruhig && 'IntersectionObserver' in window) {
    pk.classList.add('wartet');
    new IntersectionObserver(function (e, o) {
      if (!e[0].isIntersecting) return;
      pk.classList.remove('wartet'); o.disconnect();
    }, { rootMargin: '0px 0px -15% 0px' }).observe(pk);
  }
})();

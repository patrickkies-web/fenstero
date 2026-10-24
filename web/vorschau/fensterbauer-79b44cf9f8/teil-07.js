/* Einladung: erscheint, wenn das Prinzip erklärt ist („Ihre Adresse“ gesehen), lädt zum Ausprobieren ein,
   wechselt ab den Paketen zu „Paket anfragen“, verschwindet am Formular und an der Fußzeile. */
(function () {
  var bar = document.querySelector('.dock'); if (!bar) return;
  var weg = document.querySelector('.weg'), hero = document.getElementById('hero'), probierKarte = document.querySelector('.probieren');
  var pakete = document.getElementById('pakete'), anfrage = document.getElementById('bestellen'), fuss = document.querySelector('.fuss');
  var zu = false; try { zu = sessionStorage.getItem('einladung-zu') === '1'; } catch (e) {}
  var gesehen = false, tick = false, erstes = true;
  function setzen(ph) {
    if (bar.dataset.phase === ph) return;
    bar.dataset.phase = ph;
    bar.setAttribute('aria-hidden', String(ph === 'aus'));
    bar.querySelectorAll('.dock-phase').forEach(function (p) {
      var an = p.classList.contains('dock-' + ph);
      p.setAttribute('aria-hidden', String(!an));
      p.querySelectorAll('a, button').forEach(function (k) { k.tabIndex = an ? 0 : -1; });
    });
    if (ph === 'testen' && erstes) { erstes = false; bar.classList.add('lockt'); setTimeout(function () { bar.classList.remove('lockt'); }, 3600); }
  }
  function pruefen() {
    tick = false;
    var vh = innerHeight;
    if (weg && weg.getBoundingClientRect().bottom < vh * 0.55) gesehen = true;
    var heroDa = hero.getBoundingClientRect().bottom > vh * 0.3;
    var schluss = document.getElementById('abschluss');
    var imBlick = function (el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.top < vh * 0.85 && r.bottom > 0; };
    var ende = imBlick(anfrage) || imBlick(schluss);
    var fussDa = fuss.getBoundingClientRect().top < vh;
    var beiPaketen = pakete.getBoundingClientRect().top < vh * 0.5;
    var pr = probierKarte ? probierKarte.getBoundingClientRect() : null;
    var karteDa = pr && pr.top < vh && pr.bottom > 0;
    var ph = 'aus';
    if (!heroDa && !ende && !fussDa) {
      if (beiPaketen) ph = 'anfragen';
      else if (gesehen && !zu && !karteDa) ph = 'testen';
    }
    setzen(ph);
  }
  bar.querySelector('.dock-zu').addEventListener('click', function () {
    zu = true; try { sessionStorage.setItem('einladung-zu', '1'); } catch (e) {}
    pruefen();
  });
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(pruefen); } }, { passive: true });
  addEventListener('resize', pruefen);
  pruefen();
})();

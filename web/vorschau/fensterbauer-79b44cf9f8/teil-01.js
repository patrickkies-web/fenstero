(function () {
  var mq = function (q) { try { return matchMedia(q).matches; } catch (e) { return false; } };
  var ruhig = mq('(prefers-reduced-motion: reduce)');
  var feinZeiger = mq('(hover: hover) and (pointer: fine)');
  var buehne = document.getElementById('hero');
  var motiv = buehne.querySelector('.motiv');
  document.addEventListener('touchstart', function () {}, { passive: true }); // :active auf iOS

  function zaehle(el, bis, ms) {
    if (ruhig) { el.textContent = bis.toLocaleString('de-DE'); return; }
    var start = null;
    function schritt(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / ms), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(bis * e).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(schritt);
    }
    requestAnimationFrame(schritt);
  }

  /* ---- Punkte-Welle ---- */
  var info = buehne.querySelector('.beweis');
  var cv = buehne.querySelector('.punkte'), ctx = cv.getContext('2d');
  var W = 0, H = 0, sichtbar = true, laeuft = false;
  var zg = { x: -9999, y: -9999 }, zgIst = { x: -9999, y: -9999 };
  buehne.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    zg.x = e.clientX - r.left; zg.y = e.clientY - r.top;
    if (zgIst.x < -5000) { zgIst.x = zg.x; zgIst.y = zg.y; }
  });
  buehne.addEventListener('pointerleave', function () { zg.x = -9999; zg.y = -9999; });
  function groesse() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function welle(t) {
    ctx.clearRect(0, 0, W, H);
    if (zg.x > -5000) { zgIst.x += (zg.x - zgIst.x) * 0.12; zgIst.y += (zg.y - zgIst.y) * 0.12; }
    else { zgIst.x = -9999; zgIst.y = -9999; }
    var RAD = 0, RAD2 = 0; /* Punkte reagieren nicht auf den Zeiger: nichts lenkt vom Knopf ab */
    var breit = W >= 1000;
    var COLS = breit ? 72 : 40, ROWS = breit ? 26 : 20;
    var cx = W * (breit ? 0.34 : 0.5), cy = H * (breit ? 0.6 : 0.5);
    var spanX = W * (breit ? 1.1 : 1.5), spanY = H * (breit ? 0.42 : 0.3), amp = breit ? 46 : 28;
    for (var r = 0; r < ROWS; r++) {
      var z = r / (ROWS - 1), tiefe = 0.3 + 0.7 * z;
      for (var c = 0; c < COLS; c++) {
        var x = c / (COLS - 1) - 0.5;
        var y = Math.sin(x * 7 + t * 0.0007 + z * 3) * Math.cos(z * 4.5 - t * 0.0005) * amp;
        var sx = cx + x * spanX * tiefe;
        var sy = cy + (z * z - 0.25) * spanY - y * tiefe;
        var s = 0.7 + 1.3 * z;
        var a = 0.04 + 0.26 * z * (0.6 + 0.4 * Math.sin(x * 9 + t * 0.001));
        var dx = sx - zgIst.x, dy = sy - zgIst.y, d2 = dx * dx + dy * dy;
        if (d2 < RAD2) { var f = 1 - d2 / RAD2; f *= f; sy -= f * 28; s += f * 1.6; a += f * 0.5; }
        ctx.fillStyle = 'rgba(243,242,238,' + Math.min(1, a).toFixed(3) + ')';
        ctx.fillRect(sx, sy, s, s);
      }
    }
  }
  function schleife(t) {
    if (!sichtbar || document.hidden) { laeuft = false; return; }
    welle(t);
    requestAnimationFrame(schleife);
  }
  function starten() { if (!laeuft && !ruhig) { laeuft = true; requestAnimationFrame(schleife); } }
  groesse();
  welle(0);
  if ('ResizeObserver' in window) new ResizeObserver(function () { groesse(); welle(performance.now()); }).observe(cv);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; if (sichtbar) starten(); }).observe(buehne);
  }
  document.addEventListener('visibilitychange', starten);
  starten();

  if (ruhig) return;

  /* ---- Tiefe mit dem Mauszeiger (gefedert) ---- */
  if (feinZeiger) {
    var ebenen = [
      { el: motiv.querySelector('.motiv-ebene'), k: -14 },
      { el: buehne.querySelector('.riesenwort'), k: 10 },
      { el: info, k: 6 },
      { el: cv, k: 6 }
    ];
    var ziel = { x: 0, y: 0 }, ist = { x: 0, y: 0 };
    buehne.addEventListener('pointermove', function (e) {
      var r = buehne.getBoundingClientRect();
      ziel.x = (e.clientX - r.left) / r.width - 0.5;
      ziel.y = (e.clientY - r.top) / r.height - 0.5;
    });
    buehne.addEventListener('pointerleave', function () { ziel.x = 0; ziel.y = 0; });
    (function feder() {
      ist.x += (ziel.x - ist.x) * 0.07;
      ist.y += (ziel.y - ist.y) * 0.07;
      ebenen.forEach(function (l) {
        l.el.style.translate = (ist.x * l.k).toFixed(2) + 'px ' + (ist.y * l.k * 0.6).toFixed(2) + 'px';
      });
      requestAnimationFrame(feder);
    })();

    /* Magnet-Knopf */
    document.querySelectorAll('[data-magnet]').forEach(function (k) {
      var mz = { x: 0, y: 0 }, mi = { x: 0, y: 0 }, aktivM = false;
      k.addEventListener('pointermove', function (e) {
        var r = k.getBoundingClientRect();
        mz.x = (e.clientX - r.left - r.width / 2) * 0.18;
        mz.y = (e.clientY - r.top - r.height / 2) * 0.3;
        if (!aktivM) { aktivM = true; requestAnimationFrame(magnet); }
      });
      k.addEventListener('pointerleave', function () { mz.x = 0; mz.y = 0; });
      function magnet() {
        mi.x += (mz.x - mi.x) * 0.15; mi.y += (mz.y - mi.y) * 0.15;
        k.style.translate = mi.x.toFixed(2) + 'px ' + mi.y.toFixed(2) + 'px';
        if (Math.abs(mi.x - mz.x) + Math.abs(mi.y - mz.y) > 0.05 || mz.x || mz.y) requestAnimationFrame(magnet);
        else { aktivM = false; k.style.translate = ''; }
      }
    });
  }

  /* ---- Scroll: nur sanfte Parallaxe der Szene, Text bleibt ruhig lesbar ---- */
  var tick = false;
  function rollen() {
    tick = false;
    motiv.style.translate = '0 ' + (Math.min(window.scrollY, buehne.offsetHeight) * 0.18).toFixed(1) + 'px';
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(rollen); } }, { passive: true });

})();

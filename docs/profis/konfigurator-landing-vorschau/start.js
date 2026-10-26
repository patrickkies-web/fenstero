/* Landingpage eines Konfigurators (Vorschau Design-DNA): Vorhang ohne Sprung, Leiste beim Hochscrollen, Fokus unter dem Vorhang.
   Die Bausteine selbst startet dna/bundle.js. Keine Funktion für Besucher: Ziele der Knöpfe setzt erst die Instanz (VORLAGE.md). */
(function () {
  'use strict';
  var w = window, d = document;

  /* Vorhang ohne Sprung: Die Szenen rechnen mit der größten Bildschirmhöhe dieser Ausrichtung, damit die ein- und ausfahrende
     Adressleiste des Browsers die klebende Kante nicht verschiebt (bundle.js liest innerHeight bei jedem resize) */
  (function () {
    var hoechste = w.innerHeight, breite = w.innerWidth, merker;
    try { Object.defineProperty(w, 'innerHeight', { configurable: true, get: function () { return hoechste; } }); } catch (e) { return; }
    w.addEventListener('resize', function () {
      clearTimeout(merker);
      merker = setTimeout(function () {
        var h = w.document.documentElement.clientHeight, b = w.innerWidth;
        if (b !== breite) { breite = b; hoechste = h; } else if (h > hoechste) { hoechste = h; }
      }, 150);
    });
  })();

  /* Leiste: verschwindet beim Lesen, kommt nach 24 px Hochscrollen zurück, nie über dem Kopf der Seite */
  var leiste = d.querySelector('.ez-leiste'), kopf = d.querySelector('.ez-kopf');
  if (leiste) {
    var letzte = w.scrollY || 0, hoch = 0, runter = 0, geplant = false, grenze = 160;
    var messeGrenze = function () { if (kopf) grenze = kopf.getBoundingClientRect().bottom + (w.scrollY || 0); };
    messeGrenze(); w.addEventListener('resize', messeGrenze); w.addEventListener('load', messeGrenze);
    var pruefe = function () {
      geplant = false;
      var y = w.scrollY || 0;
      if (y < letzte) { hoch += letzte - y; runter = 0; } else if (y > letzte) { runter += y - letzte; if (runter > 24) hoch = 0; }
      leiste.classList.toggle('ist-da', y > grenze && hoch > 24);
      letzte = y;
    };
    w.addEventListener('scroll', function () { if (!geplant) { geplant = true; w.requestAnimationFrame(pruefe); } }, { passive: true });
  }

  /* Knöpfe ohne Ziel (Vorlage): kein Sprung an den Seitenanfang */
  d.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href="#"]') : null;
    if (a) e.preventDefault();
  });

  /* Fokus unter dem Vorhang: liegt das fokussierte Element verdeckt, in die Mitte holen (WCAG 2.4.11) */
  d.addEventListener('focusin', function (e) {
    var el = e.target; if (!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect(); if (!r.width) return;
    var x = Math.min(Math.max(r.left + r.width / 2, 0), w.innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), w.innerHeight - 1);
    var oben = d.elementFromPoint(x, y);
    if (oben && !el.contains(oben) && !oben.contains(el)) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
})();

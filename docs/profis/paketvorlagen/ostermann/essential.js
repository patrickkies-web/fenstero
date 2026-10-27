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

  /* Vorhang neu ordnen, sobald eine Szene ihre Höhe ändert (Zustand, Etiketten, Schrift, Bilder); bundle.js ordnet nur bei load
     und resize. Ohne das klebt eine gewachsene Szene zu früh, und ihr Ende (z. B. die Pille der Bereit-Karte) kommt nie ins Bild. */
  if ('ResizeObserver' in w) {
    var ordnen = false, hoehen = new w.ResizeObserver(function () {
      if (ordnen) return; ordnen = true;
      w.requestAnimationFrame(function () { ordnen = false; w.dispatchEvent(new Event('resize')); });
    });
    Array.prototype.forEach.call(d.querySelectorAll('.dna-szene'), function (s) { hoehen.observe(s); });
  }

  /* Leiste: verschwindet beim Lesen, kommt nach 24 px Hochscrollen zurück, nie über dem Kopf der Seite */
  var leiste = d.querySelector('.ez-leiste'), kopf = d.querySelector('.ez-kopf');
  if (leiste) {
    var letzte = w.scrollY || 0, hoch = 0, runter = 0, geplant = false, grenze = 160;
    /* Grenze: erst wenn der Kopf wirklich verdeckt ist. Die erste Szene klebt (Vorhang), ihr Kopf bleibt sichtbar, bis die zweite
       Szene ihn überdeckt; ohne Kleben verschwindet er beim Scrollen */
    var messeGrenze = function () {
      var s1 = d.querySelector('.dna-szene'); if (!kopf || !s1) return;
      var unten = kopf.getBoundingClientRect().bottom + (w.scrollY || 0) - (s1.getBoundingClientRect().top + (w.scrollY || 0));
      var steht = Math.min(0, w.innerHeight - s1.offsetHeight);
      grenze = unten <= -steht ? unten : s1.offsetHeight - steht - unten;
      var ml = d.querySelector('.ez-ml'); if (ml) grenze += ml.offsetHeight; /* Muster-Leiste der Vorlage liegt darüber */
    };
    /* Schmale Leiste (Wunsch des Inhabers, 27.10.2026): Statt ganz zu verschwinden, zieht sich die Leiste beim Herunterscrollen auf
       ihren Knopf zusammen. Gemessen wird das Rechteck der Pille in der Leiste; der Zuschnitt liegt als Variable an der Leiste selbst. */
    var knopf = leiste.querySelector('.dna-pille');
    var messeKnopf = function () {
      if (!knopf) return;
      var l = leiste.getBoundingClientRect(), k = knopf.getBoundingClientRect();
      leiste.style.setProperty('--schmal', 'inset(' + Math.round(k.top - l.top) + 'px ' + Math.round(l.right - k.right) + 'px ' +
        Math.round(l.bottom - k.bottom) + 'px ' + Math.round(k.left - l.left) + 'px round 999px)');
    };
    var messe = function () { messeGrenze(); messeKnopf(); };
    messe(); w.addEventListener('resize', messe); w.addEventListener('load', messe);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(messeKnopf);
    var pruefe = function () {
      geplant = false;
      var y = w.scrollY || 0;
      if (y < letzte) { hoch += letzte - y; runter = 0; } else if (y > letzte) { runter += y - letzte; if (runter > 24) hoch = 0; }
      var unten = y > grenze, ganz = unten && hoch > 24;
      leiste.classList.toggle('ist-da', ganz);
      leiste.classList.toggle('ist-schmal', unten && !ganz);
      letzte = y;
    };
    w.addEventListener('scroll', function () { if (!geplant) { geplant = true; w.requestAnimationFrame(pruefe); } }, { passive: true });
  }

  /* Hero: Auftritt auch dann, wenn die Pille unter der Falz liegt (Safari-Leisten), statt erst beim Scrollen */
  var heroAuftritt = function () {
    w.requestAnimationFrame(function () { w.requestAnimationFrame(function () {
      Array.prototype.forEach.call(d.querySelectorAll('.ez-hero [data-dna-auftritt]'), function (el) { el.classList.add('ist-da'); });
    }); });
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', heroAuftritt); else heroAuftritt();

  /* Safari auf iOS setzt :active (Druckfeedback) nur mit einem Lauscher für touchstart */
  d.addEventListener('touchstart', function () {}, { passive: true });

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

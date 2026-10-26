/* Landingpage eines Konfigurators, Paket Essential Plus (Vorschau Design-DNA): Vorhang ohne Sprung, Leiste beim Hochscrollen, Fokus
   unter dem Vorhang, Schalter der Muster-Ebene. Die Bausteine selbst startet dna/bundle.js. Keine Funktion für Besucher: Ziele der
   Knöpfe setzt erst die Instanz. */
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
    var messeGrenze = function () {
      var s1 = d.querySelector('.dna-szene'); if (!kopf || !s1) return;
      var unten = kopf.getBoundingClientRect().bottom + (w.scrollY || 0) - (s1.getBoundingClientRect().top + (w.scrollY || 0));
      var steht = Math.min(0, w.innerHeight - s1.offsetHeight);
      grenze = unten <= -steht ? unten : s1.offsetHeight - steht - unten;
    };
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

  /* Hero: Auftritt auch dann, wenn die Pille unter der Falz liegt (Safari-Leisten), statt erst beim Scrollen */
  var heroAuftritt = function () {
    w.requestAnimationFrame(function () { w.requestAnimationFrame(function () {
      Array.prototype.forEach.call(d.querySelectorAll('.ez-hero [data-dna-auftritt]'), function (el) { el.classList.add('ist-da'); });
    }); });
  };
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', heroAuftritt); else heroAuftritt();

  /* Muster-Ebene: Etiketten an allem, was im Paket dem Betrieb gehört; der Zustand bleibt auf diesem Gerät (nur eine Vorliebe) */
  var schalter = d.getElementById('muster-schalter'), wurzel = d.querySelector('.ez');
  if (schalter && wurzel) {
    var setze = function (an) { wurzel.classList.toggle('ist-muster', an); schalter.setAttribute('aria-pressed', an ? 'true' : 'false'); };
    try { if (w.localStorage.getItem('ez-muster') === 'aus') setze(false); } catch (e) {}
    schalter.addEventListener('click', function () {
      var an = schalter.getAttribute('aria-pressed') !== 'true';
      setze(an);
      try { w.localStorage.setItem('ez-muster', an ? 'an' : 'aus'); } catch (e) {}
    });
  }

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

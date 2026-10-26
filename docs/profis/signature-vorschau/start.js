/* Landingpage eines Konfigurators, Paket Signature (Vorschau Design-DNA): Vorhang ohne Sprung, Leiste beim Hochscrollen, Fokus
   unter dem Vorhang, Schalter der Muster-Ebene, Umschalter der zwei Zustände (Website-Besucher, persönlicher Einladungslink).
   Die Bausteine selbst startet dna/bundle.js. Keine Funktion für Besucher: Ziele der Knöpfe setzt erst die Instanz. */
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

  /* Zustand der Vorlage (nur Signature): Website-Besucher oder persönlicher Einladungslink, als echte Radios in der Muster-Leiste.
     Beim echten Betrieb liefert der Server genau einen Zustand und die Leiste fehlt. Die Wahl antwortet sofort (Radio gewählt),
     der Hero-Text geht in 160 ms aus und tauscht beim Ende des Ausblendens (Rückfall-Uhr 240 ms), dann 220 ms ein; bei „weniger
     Bewegung“ sofort. Der Zustand bleibt auf diesem Gerät (nur eine Vorliebe) */
  var wurzel = d.querySelector('.ez'), heroText = d.querySelector('.ez-hero__text');
  var radios = Array.prototype.slice.call(d.querySelectorAll('.ez-modus input[name="ez-modus"]'));
  if (wurzel && heroText && radios.length) {
    var modusUhr = null, ziel = wurzel.getAttribute('data-modus');
    var markiere = function (m) { radios.forEach(function (r) { r.checked = r.value === m; }); };
    var tausche = function () {
      clearTimeout(modusUhr); modusUhr = null;
      if (!wurzel.classList.contains('ist-wechsel')) return;
      wurzel.setAttribute('data-modus', ziel); wurzel.classList.remove('ist-wechsel');
    };
    heroText.addEventListener('transitionend', function (e) { if (e.target === heroText && e.propertyName === 'opacity') tausche(); });
    try { if (w.localStorage.getItem('ez-modus') === 'einladung') { ziel = 'einladung'; wurzel.setAttribute('data-modus', ziel); markiere(ziel); } } catch (e) {}
    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        if (!r.checked || r.value === ziel) return;
        ziel = r.value;
        wurzel.classList.add('ist-geschaltet');
        try { w.localStorage.setItem('ez-modus', ziel); } catch (e) {}
        if (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) { wurzel.setAttribute('data-modus', ziel); return; }
        clearTimeout(modusUhr);
        wurzel.classList.add('ist-wechsel');
        modusUhr = setTimeout(tausche, 240);
      });
    });
  }

  /* Muster-Ebene: Etiketten an allem, was im Paket dem Betrieb gehört; der Zustand bleibt auf diesem Gerät (nur eine Vorliebe) */
  var schalter = d.getElementById('muster-schalter');
  if (schalter && wurzel) {
    var setze = function (an) { wurzel.classList.toggle('ist-muster', an); schalter.setAttribute('aria-pressed', an ? 'true' : 'false'); };
    try { if (w.localStorage.getItem('ez-muster') === 'an') setze(true); } catch (e) {}
    schalter.addEventListener('click', function () {
      var an = schalter.getAttribute('aria-pressed') !== 'true';
      setze(an);
      try { w.localStorage.setItem('ez-muster', an ? 'an' : 'aus'); } catch (e) {}
    });
  }

  /* Safari auf iOS setzt :active (Druckfeedback) nur mit einem Lauscher für touchstart */
  d.addEventListener('touchstart', function () {}, { passive: true });

  /* Knöpfe ohne Ziel (Vorlage): kein Sprung an den Seitenanfang, dafür eine Rückmeldung je Ziel (220 ms auf, 160 ms ab, 4 s) */
  var ZIELE = {
    'ziel.konfigurator': 'Muster: Hier startet der Konfigurator unter Ihrer Domain.',
    'ziel.dashboard': 'Muster: Hier melden sich Ihre Mitarbeiter im Dashboard unter Ihrer Domain an.',
    'firma.telefon': 'Muster: Hier wählt das Telefon Ihre Nummer.',
    'firma.karte': 'Muster: Hier öffnet sich die Anfahrt zu Ihrem Betrieb.',
    'firma.website': 'Muster: Hier geht es zu Ihrer Website.',
    'recht.impressum': 'Muster: Hier steht Ihr Impressum, aus Ihren Angaben erstellt.',
    'recht.datenschutz': 'Muster: Hier steht die Datenschutzerklärung Ihres Konfigurators.'
  };
  var toast = d.querySelector('.ez-toast'), toastUhr;
  d.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href="#"]') : null;
    if (!a) return;
    e.preventDefault();
    if (!toast) return;
    toast.textContent = ZIELE[a.getAttribute('data-vorlage')] || 'Muster: Dieses Ziel setzen Sie beim Einrichten.';
    toast.classList.add('ist-da'); clearTimeout(toastUhr);
    toastUhr = setTimeout(function () { toast.classList.remove('ist-da'); }, 4000);
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

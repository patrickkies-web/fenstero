/* Fensterino · gemeinsame Bausteine für App und Portal
   - KI-Auswertung der Fotos über /api/ki (Cloudflare Function), erst nach Einwilligung
   - Pilot-Hinweis im Portal
   - Logo (weißes Fenster auf Schwarz, der Flügel kippt kurz)
   - Rückmeldungen (Markieren, Einrasten, Haken, Maßlinien, Puls), Scroll-Reveal und Scroll-Bindung
   - Lottie-Zeichen in Tokenfarben, Haptik
   Hier stehen keine geheimen Schlüssel. */
(function () {
  'use strict';
  var C = window.KONFIG = Object.assign({ marke: 'Fensterino', pilot: true, ki: '/api/ki', impressum: '/impressum/', datenschutz: '/datenschutz/', preise: { aufmass: 7.99, projekt: 9, frei: 3, abo: { grund: 49, inkl: 10, extra: 5 }, plus: 79, mwst: true } }, window.KONFIG || {});
  var mem = {};
  function get(k) { try { return window.localStorage.getItem(k); } catch (e) { return mem[k] || null; } }
  function put(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { mem[k] = v; } }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fehler(code) { var e = new Error(code); e.code = code; return e; }

  /* ---------- KI: gleiche Schnittstelle wie bisher (limits, json) ---------- */
  var bereitP = null;
  function bereit() {
    if (!bereitP) {
      bereitP = !C.ki ? Promise.resolve(false) : fetch(C.ki, { headers: { accept: 'application/json' }, cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return !!(j && j.bereit); })
        .catch(function () { return false; });
    }
    return bereitP;
  }

  /* Einwilligung: „Ja“ bleibt gespeichert, „Nein“ gilt bis zum Neuladen */
  var KEY = 'aufmass.ki.einwilligung', sitzung = null, frageP = null;
  function einwilligung() {
    if (get(KEY) === 'ja') return Promise.resolve(true);
    if (sitzung !== null) return Promise.resolve(sitzung);
    if (!frageP) frageP = frage().then(function (ok) { sitzung = ok; if (ok) put(KEY, 'ja'); frageP = null; return ok; });
    return frageP;
  }
  function frage() {
    return new Promise(function (resolve) {
      var bg = el('div', 'fx-bg');
      var box = el('div', 'fx-dialog',
        '<h2 id="fx-t">Fotos von der KI auswerten lassen?</h2>' +
        '<p>Die KI erkennt auf deinen Fotos Rahmen, Glas, Material und mehr und trägt es fürs Aufmaß ein. Dafür werden die Fotos verkleinert an unseren Dienstleister Anthropic (USA) übertragen und dort ausgewertet. Fensterino speichert deine Fotos nicht.</p>' +
        '<p class="fx-klein">Ohne KI geht es auch, dann fehlen nur die Zusatzinfos aus den Fotos. Mehr dazu in der <a href="' + C.datenschutz + '" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>' +
        '<div class="fx-knoepfe"><button type="button" class="fx-ja">Ja, auswerten</button><button type="button" class="fx-nein">Ohne KI weiter</button></div>');
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-labelledby', 'fx-t');
      var vorher = document.activeElement;
      function fertig(ok) {
        bg.remove(); box.remove();
        document.removeEventListener('keydown', taste, true);
        try { if (vorher && vorher.focus) vorher.focus(); } catch (e) { /* ok */ }
        resolve(ok);
      }
      function taste(e) {
        if (e.key === 'Escape') { e.preventDefault(); fertig(false); return; }
        if (e.key === 'Tab') { /* Fokus im Dialog halten */
          var f = box.querySelectorAll('a, button'), first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      box.querySelector('.fx-ja').addEventListener('click', function () { fertig(true); });
      box.querySelector('.fx-nein').addEventListener('click', function () { fertig(false); });
      document.addEventListener('keydown', taste, true);
      document.body.appendChild(bg);
      document.body.appendChild(box);
      box.querySelector('.fx-ja').focus();
    });
  }

  function base64(blob) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { var s = String(fr.result || ''); resolve(s.slice(s.indexOf(',') + 1)); };
      fr.onerror = function () { reject(fehler('image_rejected')); };
      fr.readAsDataURL(blob);
    });
  }

  var sample = {
    limits: function () { return bereit().then(function (ok) { return { images: ok }; }); },
    /* prompt bleibt ungenutzt: die Aufträge an die KI liegen auf dem Server, damit /api/ki nur Fenster auswertet */
    json: function (prompt, o) {
      o = o || {};
      return einwilligung().then(function (ok) {
        if (!ok) throw fehler('not_granted');
        if (o.signal && o.signal.aborted) throw fehler('cancelled');
        return base64(o.images);
      }).then(function (bild) {
        var url = C.ki + '?aufgabe=' + (o.aufgabe === 'struktur' ? 'struktur' : 'fakten') + '&seite=' + (o.seite === 'out' ? 'out' : 'in');
        return fetch(url, { method: 'POST', headers: { 'content-type': 'text/plain', accept: 'application/json' }, body: bild, signal: o.signal });
      }).then(function (r) {
        return r.json().catch(function () { return null; }).then(function (j) {
          if (r.ok && j && j.ok) return j.daten;
          throw fehler((j && j.fehler) || (r.status === 429 ? 'rate_limited' : 'error'));
        });
      }, function (e) {
        if (e && e.code) throw e;
        if (e && e.name === 'AbortError') throw fehler('cancelled');
        throw fehler('error');
      });
    }
  };
  window.FotoKI = { verbinden: function () { return bereit().then(function (ok) { return ok ? sample : null; }); } };

  /* ---------- Logo: ein Fenster, dessen Flügel kurz kippt ----------
     Logo.svg(px) liefert das Zeichen. Beim Laden kippt der rechte untere Flügel einmal auf und wieder zu,
     danach bei Berührung oder Mauszeiger erneut. Wer weniger Bewegung eingestellt hat, sieht es ruhig. */
  var LOGO_INNEN = '<rect class="fi-kachel" width="64" height="64" rx="16" fill="#000"/><rect x="13" y="8" width="38" height="46" rx="3" fill="#fff"/><rect x="17.5" y="12.5" width="13" height="16" rx="1.2" fill="#000"/><rect x="33.5" y="12.5" width="13" height="16" rx="1.2" fill="#000"/><rect x="17.5" y="32" width="13" height="17.5" rx="1.2" fill="#000"/><rect x="33.5" y="32" width="13" height="17.5" rx="1.2" fill="#000"/><g class="fi-fluegel"><rect x="34.5" y="33" width="11" height="15.5" rx="1" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M36 35.5v3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g><rect x="9" y="55" width="46" height="3.5" rx="1.75" fill="#fff"/><rect x=".75" y=".75" width="62.5" height="62.5" rx="15.4" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.5"/>';
  window.Logo = {
    svg: function (px) { var s = String(px || 32); return '<svg class="fi-logo" viewBox="0 0 64 64" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + LOGO_INNEN + '</svg>'; },
    bewegen: function (ziel) {
      var liste = ziel && ziel.classList && ziel.classList.contains('fi-logo') ? [ziel] : (ziel || document).querySelectorAll('.fi-logo');
      Array.prototype.forEach.call(liste, function (l) {
        if (l.classList.contains('kippt')) return;
        l.classList.add('kippt');
        setTimeout(function () { l.classList.remove('kippt'); }, 1900);
      });
    }
  };
  window.Logo.klopfen = window.Logo.bewegen;
  function ersteBewegung() { setTimeout(function () { window.Logo.bewegen(document.querySelector('.hdr, .top, .side, .kopf') || document); }, 700); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ersteBewegung); else ersteBewegung();
  function beiBeruehrung(e) { var l = e.target && e.target.closest ? e.target.closest('.fi-logo') : null; if (l) window.Logo.bewegen(l); }
  document.addEventListener('pointerdown', beiBeruehrung, true);
  document.addEventListener('mouseover', beiBeruehrung, true);

  /* ---------- Rückmeldung: was sich gerade geändert hat, zeigt sich am Objekt ----------
     Feier.markieren(el)   ein Ring läuft kurz um das Element, das neu ist (Karte, Eintrag, Projekt)
     Feier.einrasten(el)   eine Zahl oder Überschrift setzt sich (kurzes Nachfedern aus 1,06)
     Feier.haken(el)       ein Haken wird gezogen (SVG-Pfad mit Klasse .tick oder Element mit .fx-haken)
     Feier.linien(stage)   die Maßlinien am 3-D-Modell zeichnen sich nacheinander
     Feier.puls(el)        ein Ring läuft aus dem Element heraus
     Ruhig, wenn das Gerät „weniger Bewegung“ eingestellt hat. Mehr gibt es nicht. */
  function ruhig() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  function neu(el, cls, ms) { if (!el || ruhig()) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(function () { el.classList.remove(cls); }, ms || 1200); }
  window.Feier = {
    markieren: function (ziel) { neu(ziel, 'fx-mark', 1200); },
    einrasten: function (ziel) { neu(ziel, 'fx-einrasten', 400); },
    haken: function (ziel) { if (!ziel) return; var svg = ziel.tagName === 'svg' ? ziel : ziel.querySelector('svg'); if (svg) neu(svg, 'fx-haken', 900); },
    linien: function (stage) {
      if (!stage || ruhig()) return;
      var dims = Array.prototype.slice.call(stage.querySelectorAll('.w3d-dim'));
      dims.forEach(function (d, i) { d.style.setProperty('--dd', (i * 90) + 'ms'); d.classList.remove('is-drawing'); void d.offsetWidth; d.classList.add('is-drawing'); });
      setTimeout(function () { dims.forEach(function (d) { d.classList.remove('is-drawing'); d.style.removeProperty('--dd'); }); }, 900 + dims.length * 90);
    },
    puls: function (ziel) { neu(ziel, 'fx-puls', 1000); }
  };

  /* ---------- Scroll-Reveal: Blöcke erscheinen, wenn sie ins Bild kommen ----------
     Reveal.auf(elemente, wurzel): setzt .rev und beobachtet; ohne Beobachter oder bei „weniger Bewegung“ sofort sichtbar. */
  var io = null;
  window.Reveal = {
    auf: function (liste, wurzel) {
      var arr = Array.prototype.slice.call(liste || []);
      if (!arr.length) return;
      if (ruhig() || !('IntersectionObserver' in window)) { arr.forEach(function (e) { e.classList.add('rev', 'in'); }); return; }
      if (!io || (wurzel && io.root !== wurzel)) { if (io) io.disconnect(); io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { root: wurzel || null, rootMargin: '0px 0px 40px 0px', threshold: 0.05 }); }
      /* gestaffelt nur, was jetzt schon im Bild ist; was erst beim Scrollen kommt, erscheint ohne Wartezeit */
      var grenze = wurzel ? wurzel.getBoundingClientRect().bottom : window.innerHeight, k = 0;
      arr.forEach(function (e) { var sichtbar = e.getBoundingClientRect().top < grenze; e.classList.add('rev'); e.style.setProperty('--rv', String(sichtbar ? Math.min(k++, 8) : 0)); io.observe(e); });
    }
  };

  /* ---------- Lottie: gezeichnete Bewegtbilder in den Farben der Oberfläche ----------
     Die Dateien liegen in /assets/lottie/*.json (aus Code erzeugt, Marker-Farben = helle Tokens). Vor dem Abspielen werden die
     Marker gegen die aktuellen Tokens getauscht, so stimmen sie auch im dunklen Modus. Gespielt wird nur, was im Bild ist;
     bei „weniger Bewegung“ steht das Endbild. Spieler: vendor/lottie_light.min.js (SVG, ohne Ausdrücke, MIT).
     Lottie.auf(wurzel)            alle [data-lottie="name"] darin starten (data-loop="1" für Schleifen)
     Lottie.spielen(el, name, o)   ein Element gezielt; o.loop, o.langsam (Geschwindigkeit) */
  var LOTTIE_MARKER = { ink: [20, 20, 20], paper: [243, 242, 238], surface2: [236, 235, 230], mo: [194, 65, 12], el: [29, 78, 216], ok: [21, 115, 58] };
  var lottieDaten = {}, lottieIO = null;
  /* Ablage der Dateien neben dieser Datei (assets/lottie/), damit es auch unter einem anderen Pfad läuft */
  var LOTTIE_BASE = (function () { try { var sc = document.currentScript; return sc && sc.src ? new URL('lottie/', sc.src).href : '/assets/lottie/'; } catch (e) { return '/assets/lottie/'; } })();
  function tokenFarbe(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim(), m = /^#([0-9a-f]{6})$/i.exec(v);
    if (!m) return null;
    return [parseInt(m[1].slice(0, 2), 16) / 255, parseInt(m[1].slice(2, 4), 16) / 255, parseInt(m[1].slice(4, 6), 16) / 255];
  }
  function lottieEinfaerben(daten) {
    var tausch = [];
    Object.keys(LOTTIE_MARKER).forEach(function (k) { var zu = tokenFarbe(k); if (zu) tausch.push([LOTTIE_MARKER[k].map(function (c) { return c / 255; }), zu]); });
    function nah(a, b) { return Math.abs(a[0] - b[0]) < 0.004 && Math.abs(a[1] - b[1]) < 0.004 && Math.abs(a[2] - b[2]) < 0.004; }
    (function geh(o) {
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(geh); return; }
      if ((o.ty === 'st' || o.ty === 'fl') && o.c && o.c.a === 0 && Array.isArray(o.c.k)) {
        for (var i = 0; i < tausch.length; i++) if (nah(o.c.k, tausch[i][0])) { o.c.k = tausch[i][1].concat([o.c.k[3] == null ? 1 : o.c.k[3]]); break; }
      }
      Object.keys(o).forEach(function (k) { if (k !== 'c') geh(o[k]); });
    })(daten);
    return daten;
  }
  function lottieLaden(name) {
    if (!lottieDaten[name]) lottieDaten[name] = fetch(LOTTIE_BASE + name + '.json', { cache: 'force-cache' }).then(function (r) { if (!r.ok) throw new Error('lottie ' + r.status); return r.json(); });
    return lottieDaten[name];
  }
  var lottieWartend = [];
  function lottieSpaeter() {
    /* der Spieler lädt mit defer; was vorher gerendert wurde, startet, sobald er da ist */
    var sc = document.querySelector('script[src*="lottie_light"]');
    if (sc && !sc.__lottieHorcht) { sc.__lottieHorcht = true; sc.addEventListener('load', function () { var w = lottieWartend; lottieWartend = []; w.forEach(function (x) { lottieSpielen(x[0], x[1], x[2]); }); }); }
  }
  function lottieSpielen(ziel, name, o) {
    o = o || {};
    if (!ziel || ziel.getAttribute('data-lottie-an') === '1') return Promise.resolve(null);
    if (!window.lottie) { lottieWartend.push([ziel, name, o]); lottieSpaeter(); return Promise.resolve(null); }
    ziel.setAttribute('data-lottie-an', '1');
    return lottieLaden(name).then(function (roh) {
      if (!document.body.contains(ziel)) return null;
      var daten = lottieEinfaerben(JSON.parse(JSON.stringify(roh)));
      var still = ziel.querySelector('.lottie-still'); if (still) still.remove();
      ziel.classList.add('lottie');
      var an = window.lottie.loadAnimation({ container: ziel, renderer: 'svg', loop: !!o.loop, autoplay: false, animationData: daten, rendererSettings: { progressiveLoad: false, hideOnTransparent: true } });
      if (o.langsam) an.setSpeed(o.langsam);
      ziel._lottie = an;
      if (ruhig()) { an.goToAndStop(Math.max(0, an.totalFrames - 1), true); return an; }
      /* nur spielen, wenn es im Bild ist; Schleifen pausieren außerhalb */
      if ('IntersectionObserver' in window) {
        if (!lottieIO) lottieIO = new IntersectionObserver(function (es) { es.forEach(function (e) { var a = e.target._lottie; if (!a) return; if (e.isIntersecting) { if (a.isPaused && !(a.__fertig)) a.play(); } else if (!a.isPaused) a.pause(); }); }, { threshold: 0.2 });
        lottieIO.observe(ziel);
      } else an.play();
      if (!o.loop) an.addEventListener('complete', function () { an.__fertig = true; });
      return an;
    }).catch(function () { ziel.removeAttribute('data-lottie-an'); return null; });
  }
  window.Lottie = {
    spielen: lottieSpielen,
    auf: function (wurzel) {
      Array.prototype.forEach.call((wurzel || document).querySelectorAll('[data-lottie]'), function (e) {
        lottieSpielen(e, e.getAttribute('data-lottie'), { loop: e.getAttribute('data-loop') === '1', langsam: parseFloat(e.getAttribute('data-tempo') || '') || 0 });
      });
    },
    bereit: function () { return !!window.lottie; }
  };

  /* ---------- Haptik: ein kurzes Tippen am Gerät, wo etwas einrastet ----------
     Haptik.tick()     leicht: Taste, Auswahl, Einrasten
     Haptik.ok()       zweimal kurz: ein Schritt ist fertig
     Haptik.fehler()   ein längerer Stoß: Eingabe abgelehnt
     Android über navigator.vibrate; iOS kennt dafür nur den Schalter (input type=checkbox switch), der beim Umlegen klickt.
     Nur bei Berührung (pointer: coarse), nie bei „weniger Bewegung“, abschaltbar: localStorage aufmass.haptik = aus. */
  var hapSchalter = null, hapLabel = null, hapKannSwitch = false;
  function hapAn() { try { if (get('aufmass.haptik') === 'aus') return false; } catch (e) { /* ok */ } if (ruhig()) return false; try { return matchMedia('(pointer: coarse)').matches; } catch (e) { return false; } }
  function hapiOS() {
    if (hapSchalter) return true;
    try {
      var t = document.createElement('input'); t.type = 'checkbox'; t.setAttribute('switch', '');
      hapKannSwitch = 'switch' in t;
      if (!hapKannSwitch) return false;
      hapLabel = document.createElement('label'); hapLabel.setAttribute('aria-hidden', 'true'); hapLabel.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
      hapSchalter = t; t.tabIndex = -1; hapLabel.appendChild(t); document.body.appendChild(hapLabel);
      return true;
    } catch (e) { return false; }
  }
  function hapPuls(muster) {
    if (!hapAn()) return false;
    /* nur nach einer echten Berührung: ohne Nutzeraktivierung blockt der Browser und meldet es in der Konsole */
    try { if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return false; } catch (e) { /* ok */ }
    if (navigator.vibrate) { try { return !!navigator.vibrate(muster); } catch (e) { return false; } }
    if (hapiOS()) { try { hapLabel.click(); return true; } catch (e) { return false; } }
    return false;
  }
  window.Haptik = {
    tick: function () { return hapPuls(8); },
    ok: function () { return hapPuls([10, 40, 14]); },
    fehler: function () { return hapPuls([36]); },
    an: hapAn
  };

  /* ---------- Scroll: ein Wert von 0 bis 1, während ein Element durchs Bild wandert ----------
     Scroll.binden(el, fn, o)  ruft fn(p) mit p = 0 (Element kommt unten herein) … 1 (Element verlässt oben) auf;
     o.von / o.bis verschieben die Spanne (Anteile der Fensterhöhe), o.wurzel = scrollender Behälter (sonst das Fenster).
     Bei „weniger Bewegung“ einmal fn(0.5). Läuft über requestAnimationFrame, nur wenn sich etwas bewegt hat. */
  var scrollBindungen = [], scrollTick = false;
  function scrollRechnen() {
    scrollTick = false;
    scrollBindungen = scrollBindungen.filter(function (b) { return document.body.contains(b.el); });
    scrollBindungen.forEach(function (b) {
      var r = b.el.getBoundingClientRect(), hoehe = b.wurzel ? b.wurzel.clientHeight : window.innerHeight, oben = b.wurzel ? b.wurzel.getBoundingClientRect().top : 0;
      var start = hoehe * (b.von == null ? 1 : b.von), ende = -r.height + hoehe * (b.bis == null ? 0 : b.bis);
      var p = (start - (r.top - oben)) / (start - ende);
      p = Math.max(0, Math.min(1, p));
      if (Math.abs(p - b.p) > 0.0005) { b.p = p; try { b.fn(p); } catch (e) { /* ok */ } }
    });
  }
  function scrollAnstoss() { if (!scrollTick) { scrollTick = true; requestAnimationFrame(scrollRechnen); } }
  window.addEventListener('scroll', scrollAnstoss, { passive: true, capture: true });
  window.addEventListener('resize', scrollAnstoss);
  window.Scroll = {
    binden: function (el, fn, o) {
      if (!el) return;
      o = o || {};
      if (ruhig()) { try { fn(0.5); } catch (e) { /* ok */ } return; }
      scrollBindungen.push({ el: el, fn: fn, von: o.von, bis: o.bis, wurzel: o.wurzel || null, p: -1 });
      scrollAnstoss();
    },
    anstossen: scrollAnstoss
  };

  /* ---------- Pilot-Hinweis im Portal ---------- */
  function pilotHinweis() {
    if (!C.pilot || document.body.getAttribute('data-seite') !== 'portal' || get('aufmass.pilot.zu') === '1') return;
    var bar = el('div', 'fx-pilot', '<p><b>Pilotphase:</b> Der Bereich für Betriebe zeigt Beispieldaten, nichts wird berechnet, alles bleibt in Ihrem Browser. Echt funktionieren schon Aufmaß-Links, Code-Eingang, Nachbesserung und PDF-Export.</p>' +
      '<button type="button" class="mehr">Mehr</button><button type="button" class="zu" aria-label="Hinweis schließen"><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>');
    bar.setAttribute('role', 'note');
    bar.querySelector('button.zu').addEventListener('click', function () { put('aufmass.pilot.zu', '1'); bar.remove(); });
    /* am Telefon zwei Zeilen, „Mehr“ klappt auf */
    bar.querySelector('button.mehr').addEventListener('click', function () { bar.classList.add('offen'); });
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pilotHinweis); else pilotHinweis();
})();

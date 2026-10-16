/* eeziframes · gemeinsame Bausteine für App und Portal
   - KI-Auswertung der Fotos über /api/ki (Cloudflare Function), erst nach Einwilligung: die Einbausituation, eine Anfrage je Foto
   - Pilot-Hinweis im Portal
   - Logo (weißes Fenster auf Schwarz, der Flügel kippt kurz)
   - Rückmeldungen (Markieren, Einrasten, Haken, Maßlinien, Puls), Scroll-Reveal und Scroll-Bindung
   - Lottie-Zeichen in Tokenfarben, Haptik
   Hier stehen keine geheimen Schlüssel. */
(function () {
  'use strict';
  /* Mit JavaScript übernimmt die App; die Textfassung für Suchmaschinen und KI-Assistenten (.vorab) bleibt verborgen */
  document.documentElement.classList.add('js');
  var C = window.KONFIG =Object.assign({ marke: 'eeziframes', pilot: true, ki: '/api/ki', impressum: '/impressum/', datenschutz: '/datenschutz/', preise: { aufmass: 7.99, projekt: 9, frei: 3, abo: { grund: 49, inkl: 10, extra: 5 }, plus: 79, mwst: true } }, window.KONFIG || {});
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
        '<p>Die KI liest auf deinen Fotos die Einbausituation: Rollladenkasten, Laibung, Fensterbänke, Fassade und was dein Fensterbauer sonst noch wissen muss. Dafür werden die Fotos verkleinert an unseren Dienstleister Anthropic übertragen und dort ausgewertet (Anthropic Ireland, Ltd.; verarbeitet auch in den USA). eeziframes speichert deine Fotos nicht; Anthropic nutzt sie nicht zum Training und löscht sie nach eigenen Angaben spätestens nach 30 Tagen.</p>' +
        '<p class="fx-klein">Ohne KI geht es auch, dann fehlen nur die Zusatzinfos aus den Fotos. Deine Einwilligung kannst du jederzeit widerrufen: unten in der App über „KI-Einwilligung widerrufen“. Mehr dazu in der <a href="' + C.datenschutz + '" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>' +
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
        var url = C.ki + '?aufgabe=' + (o.aufgabe === 'wand' ? 'wand' : 'einbau') + '&seite=' + (o.seite === 'out' ? 'out' : 'in');
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
  window.FotoKI = {
    verbinden: function () { return bereit().then(function (ok) { return ok ? sample : null; }); },
    /* Einwilligung erteilt (gespeichert)? Widerrufen: gilt sofort, beim nächsten Foto fragt die App wieder */
    eingewilligt: function () { return get(KEY) === 'ja'; },
    widerrufen: function () { try { window.localStorage.removeItem(KEY); } catch (e) { /* ohne Speicher */ } delete mem[KEY]; sitzung = null; }
  };

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
  /* ---------- Marke: eeziframes, immer klein ----------
     Marke.wort()     Wortmarke: „eezi“ in Black, „frames“ in Medium, gleiche Farbe, kein Abstand
     Marke.klein(s)   für HTML, das in Versalien stehen kann (Eyebrows): die Marke und „eezi“ bleiben klein
     translate="no", damit automatische Übersetzer den Namen nicht anfassen. */
  window.Marke = {
    name: 'eeziframes',
    wort: function () { return '<span class="wm" translate="no"><b>eezi</b>frames</span>'; },
    klein: function (s) { return String(s).replace(/eeziframes|eezi/g, function (m) { return '<span class="mk" translate="no">' + m + '</span>'; }); }
  };
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
    var bar = el('div', 'fx-pilot', '<p><b>Pilotphase:</b> Im Bereich für Betriebe wird nichts berechnet, Konto und Projekte bleiben in Ihrem Browser. Echt funktionieren schon Aufmaß-Links, Code-Eingang, Nachbesserung und PDF-Export. Zum Kennenlernen gibt es die Tour.</p>' +
      '<button type="button" class="mehr">Mehr</button><button type="button" class="zu" aria-label="Hinweis schließen"><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>');
    bar.setAttribute('role', 'note');
    bar.querySelector('button.zu').addEventListener('click', function () { put('aufmass.pilot.zu', '1'); bar.remove(); });
    /* am Telefon zwei Zeilen, „Mehr“ klappt auf */
    bar.querySelector('button.mehr').addEventListener('click', function () { bar.classList.add('offen'); });
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pilotHinweis); else pilotHinweis();
})();

/* ---------- Farbtext: eine eingetippte Farbe verstehen ----------
   Erkennt RAL-Classic-Nummern (mit oder ohne „RAL“), RAL-Namen („Schwarzgrau“), DB 701 bis 703, Eloxal, Holzdekore,
   Farbwörter („Messing“, „Sand“) und Hex-Werte (#383E42). Liefert { hex, bg, name, code, key, holz } oder null.
   Die Farbwerte sind Bildschirm-Näherungen; das echte Ergebnis zeigt ein Farbmuster. */
(function () {
  'use strict';
  var RAL = ('1000 Grünbeige CDBA88|1001 Beige D0B084|1002 Sandgelb D2AA6D|1003 Signalgelb F9A800|1004 Goldgelb E49E00|1005 Honiggelb CB8E00|1006 Maisgelb E29000|1007 Narzissengelb E88C00|1011 Braunbeige AF804F|1012 Zitronengelb DDAF27|1013 Perlweiß E3D9C6|1014 Elfenbein DDC49A|1015 Hellelfenbein E6D2B5|1016 Schwefelgelb F1DD38|1017 Safrangelb F6A950|1018 Zinkgelb FACA30|1019 Graubeige A48F7A|1020 Olivgelb A08F65|1021 Rapsgelb F6B600|1023 Verkehrsgelb F7B500|1024 Ockergelb BA8F4C|1026 Leuchtgelb FFFF00|1027 Currygelb A77F0E|1028 Melonengelb FF9B00|1032 Ginstergelb E2A300|1033 Dahliengelb F99A1C|1034 Pastellgelb EB9C52|1035 Perlbeige 908370|1036 Perlgold 80643F|1037 Sonnengelb F09200|' +
    '2000 Gelborange DA6E00|2001 Rotorange BA481B|2002 Blutorange BF3922|2003 Pastellorange F67828|2004 Reinorange E25303|2005 Leuchtorange FF4D06|2007 Leuchthellorange FFB200|2008 Hellrotorange ED6B21|2009 Verkehrsorange DE5307|2010 Signalorange D05D28|2011 Tieforange E26E0E|2012 Lachsorange D5654D|2013 Perlorange 923E25|2017 RAL Orange FC5500|' +
    '3000 Feuerrot A72920|3001 Signalrot 9B2423|3002 Karminrot 9B2321|3003 Rubinrot 861A22|3004 Purpurrot 6B1C23|3005 Weinrot 59191F|3007 Schwarzrot 3E2022|3009 Oxidrot 6D342D|3011 Braunrot 782423|3012 Beigerot C5856D|3013 Tomatenrot 972E25|3014 Altrosa CB7375|3015 Hellrosa D8A0A6|3016 Korallenrot A63D30|3017 Rosé CA555D|3018 Erdbeerrot C63F4A|3020 Verkehrsrot BB1E10|3022 Lachsrot CF6955|3024 Leuchtrot FF2D21|3026 Leuchthellrot FF2A1B|3027 Himbeerrot AB273C|3028 Reinrot CC2C24|3031 Orientrot A63437|3032 Perlrubinrot 701D24|3033 Perlrosa A53A2E|' +
    '4001 Rotlila 816183|4002 Rotviolett 8D3C4B|4003 Erikaviolett C4618C|4004 Bordeauxviolett 651E38|4005 Blaulila 76689A|4006 Verkehrspurpur 903373|4007 Purpurviolett 47243C|4008 Signalviolett 844C82|4009 Pastellviolett 9D8692|4010 Telemagenta BC4077|4011 Perlviolett 6E6387|4012 Perlbrombeer 6B6B7F|' +
    '5000 Violettblau 2A4362|5001 Grünblau 1F4764|5002 Ultramarinblau 2B2C7C|5003 Saphirblau 2A3756|5004 Schwarzblau 1D1F2A|5005 Signalblau 154889|5007 Brillantblau 41678D|5008 Graublau 313C48|5009 Azurblau 2E5978|5010 Enzianblau 13447C|5011 Stahlblau 232C3F|5012 Lichtblau 3481B8|5013 Kobaltblau 232D53|5014 Taubenblau 6C7C98|5015 Himmelblau 2874B2|5017 Verkehrsblau 0E518D|5018 Türkisblau 21888F|5019 Capriblau 1A5784|5020 Ozeanblau 0B4151|5021 Wasserblau 07737A|5022 Nachtblau 2F2A5A|5023 Fernblau 4D668E|5024 Pastellblau 6A93B0|5025 Perlenzian 296478|5026 Perlnachtblau 102C54|' +
    '6000 Patinagrün 3C7460|6001 Smaragdgrün 366735|6002 Laubgrün 325928|6003 Olivgrün 50533C|6004 Blaugrün 024442|6005 Moosgrün 114232|6006 Grauoliv 3C392E|6007 Flaschengrün 2C3222|6008 Braungrün 37342A|6009 Tannengrün 27352A|6010 Grasgrün 4D6F39|6011 Resedagrün 6C7C59|6012 Schwarzgrün 303D3A|6013 Schilfgrün 7D765A|6014 Gelboliv 474135|6015 Schwarzoliv 3D3D36|6016 Türkisgrün 00694C|6017 Maigrün 587F40|6018 Gelbgrün 61993B|6019 Weißgrün B9CEAC|6020 Chromoxidgrün 37422F|6021 Blassgrün 8A9977|6022 Braunoliv 3A3327|6024 Verkehrsgrün 008351|6025 Farngrün 5E6E3B|6026 Opalgrün 005F4E|6027 Lichtgrün 7EBAB5|6028 Kieferngrün 315442|6029 Minzgrün 006F3D|6032 Signalgrün 237F52|6033 Minttürkis 46877F|6034 Pastelltürkis 7AACAC|6035 Perlgrün 194D25|6036 Perlopalgrün 04574B|6037 Reingrün 008B29|6038 Leuchtgrün 00B51A|6039 Fasergrün B3C43E|' +
    '7000 Fehgrau 7A888E|7001 Silbergrau 8C969D|7002 Olivgrau 817863|7003 Moosgrau 7A7669|7004 Signalgrau 9B9B9B|7005 Mausgrau 6C6E6B|7006 Beigegrau 766A5E|7008 Khakigrau 745E3D|7009 Grüngrau 5D6058|7010 Zeltgrau 585C56|7011 Eisengrau 52595D|7012 Basaltgrau 575D5E|7013 Braungrau 575044|7015 Schiefergrau 4F5358|7016 Anthrazitgrau 383E42|7021 Schwarzgrau 2F3234|7022 Umbragrau 4C4A44|7023 Betongrau 808076|7024 Graphitgrau 45494E|7026 Granitgrau 374345|7030 Steingrau 928E85|7031 Blaugrau 5B686D|7032 Kieselgrau B5B0A1|7033 Zementgrau 7F8274|7034 Gelbgrau 92886F|7035 Lichtgrau C5C7C4|7036 Platingrau 979392|7037 Staubgrau 7A7B7A|7038 Achatgrau B0B0A9|7039 Quarzgrau 6B665E|7040 Fenstergrau 989EA1|7042 Verkehrsgrau A 8E9291|7043 Verkehrsgrau B 4F5250|7044 Seidengrau B7B3A8|7045 Telegrau 1 8D9295|7046 Telegrau 2 7E868A|7047 Telegrau 4 C8C8C7|7048 Perlmausgrau 817B73|' +
    '8000 Grünbraun 89693F|8001 Ockerbraun 9D622B|8002 Signalbraun 794D3E|8003 Lehmbraun 7E4B27|8004 Kupferbraun 8D4931|8007 Rehbraun 70462B|8008 Olivbraun 724A25|8011 Nussbraun 5A3826|8012 Rotbraun 66332B|8014 Sepiabraun 4A3526|8015 Kastanienbraun 5E2F26|8016 Mahagonibraun 4C2B20|8017 Schokoladenbraun 442F29|8019 Graubraun 3D3635|8022 Schwarzbraun 1A1718|8023 Orangebraun A45729|8024 Beigebraun 795038|8025 Blassbraun 755847|8028 Terrabraun 513A2A|8029 Perlkupfer 7F4031|' +
    '9001 Cremeweiß E9E0D2|9002 Grauweiß D7D5CB|9003 Signalweiß ECECE7|9004 Signalschwarz 2B2B2C|9005 Tiefschwarz 0E0E10|9006 Weißaluminium A1A1A0|9007 Graualuminium 878581|9010 Reinweiß F1ECE1|9011 Graphitschwarz 27292B|9012 Reinraumweiß F8F2E1|9016 Verkehrsweiß F1F0EA|9017 Verkehrsschwarz 2A292A|9018 Papyrusweiß C8CBC4|9022 Perlhellgrau 858583|9023 Perldunkelgrau 797B7A').split('|');
  /* Weitere Angaben aus dem Fensterbau: [Suchwörter, Anzeigename, Farbe, Schlüssel der App, Holz] */
  var EXTRA = [
    [['db 701', 'db701'], 'DB 701 Eisenglimmer hell', '8E9192'], [['db 702', 'db702'], 'DB 702 Eisenglimmer', '7C8083'], [['db 703', 'db703', 'eisenglimmer'], 'DB 703 Eisenglimmer dunkel', '545A5E'],
    [['eloxal', 'eloxiert', 'e6 ev1', 'ev1', 'alu natur'], 'Aluminium natur eloxiert (E6/EV1)', 'B8BABA'],
    [['golden oak', 'goldeneiche', 'golden eiche'], 'Golden Oak', 'B5732F', 'goak', 1], [['nussbaum', 'nuss'], 'Nussbaum', '6B4428', 'nuss', 1], [['eiche hell', 'eiche'], 'Eiche hell', 'C9A46B', 'eiche', 1], [['mahagoni'], 'Mahagoni', '6F2F22', 'mahag', 1],
    [['winchester'], 'Winchester', 'A8774C', '', 1], [['sheffield oak', 'sheffield'], 'Sheffield Oak', 'B9AB95', '', 1], [['douglasie'], 'Douglasie', 'B8834F', '', 1], [['siena noce', 'siena'], 'Siena Noce', '6F4B2E', '', 1], [['macore'], 'Macoré', '7B3F2B', '', 1], [['bergkiefer', 'kiefer'], 'Bergkiefer', 'C99A62', '', 1], [['eiche dunkel'], 'Eiche dunkel', '6B4A2C', '', 1], [['teak'], 'Teak', '8B5A2B', '', 1], [['oregon'], 'Oregon', 'B77C45', '', 1], [['holz'], 'Holzton', '9C6B3E', '', 1],
    [['weiss', 'weis'], 'Weiß', 'F3F2EE'], [['schwarz'], 'Schwarz', '151617'], [['grau'], 'Grau', '8A8D8F'], [['hellgrau'], 'Hellgrau', 'C5C7C4'], [['dunkelgrau'], 'Dunkelgrau', '45494E'], [['anthrazit'], 'Anthrazit', '383E42'],
    [['silber', 'silbern'], 'Silber', 'C9CCD0'], [['alu', 'aluminium'], 'Aluminium', 'A1A1A0'], [['edelstahl', 'inox'], 'Edelstahl', 'B4B8BC'], [['titan'], 'Titan', '8B8D8F'], [['gold', 'golden'], 'Gold', 'C8A24A'], [['messing'], 'Messing', 'B5A26A'],
    [['bronze'], 'Bronze', '8A6A48'], [['kupfer'], 'Kupfer', 'B87333'], [['champagner'], 'Champagner', 'D3C3A3'], [['creme', 'cremeweiss'], 'Creme', 'E9E0D2'], [['beige'], 'Beige', 'D0B084'], [['sand'], 'Sand', 'D2BC94'], [['taupe'], 'Taupe', '8B7D6B'],
    [['braun'], 'Braun', '5A4030'], [['dunkelbraun'], 'Dunkelbraun', '3B2A20'], [['rot'], 'Rot', 'A72920'], [['bordeaux'], 'Bordeaux', '651E38'], [['gruen'], 'Grün', '114232'], [['oliv'], 'Oliv', '50533C'], [['salbei'], 'Salbei', '7F9A7C'],
    [['blau'], 'Blau', '232C3F'], [['petrol'], 'Petrol', '1F5F6A'], [['tuerkis'], 'Türkis', '21888F'], [['gelb'], 'Gelb', 'F7B500'], [['orange'], 'Orange', 'E25303'], [['rosa'], 'Rosa', 'D8A0A6'], [['lila', 'violett'], 'Violett', '76689A'], [['terracotta', 'terrakotta'], 'Terracotta', 'B56A48']
  ];
  var falt = function (t) { return String(t || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/é/g, 'e').replace(/[^a-z0-9#]+/g, ' ').trim(); };
  var tab = {}, namen = [];
  RAL.forEach(function (z) { var m = /^(\d{4}) (.+) ([0-9A-F]{6})$/.exec(z); if (!m) return; tab[m[1]] = { code: m[1], name: m[2], hex: '#' + m[3] }; namen.push([falt(m[2]), m[1]]); });
  function mischen(hex, ziel, t) {
    var a = parseInt(hex.slice(1), 16), b = parseInt(ziel.slice(1), 16), k = function (sh) { return Math.round(((a >> sh) & 255) + ((((b >> sh) & 255) - ((a >> sh) & 255)) * t)); };
    return '#' + [16, 8, 0].map(function (sh) { return ('0' + k(sh).toString(16)).slice(-2); }).join('');
  }
  function holzBg(hex) { var h1 = mischen(hex, '#ffffff', 0.1), d = mischen(hex, '#000000', 0.12), m = mischen(hex, '#ffffff', 0.04); return 'repeating-linear-gradient(100deg, ' + hex + ' 0px, ' + h1 + ' 3px, ' + d + ' 6px, ' + m + ' 9px)'; }
  function aus(hex, name, code, key, holz) { hex = hex.toLowerCase(); return { hex: hex, bg: holz ? holzBg(hex) : hex, name: name, code: code || '', key: key || code || '', holz: !!holz }; }
  function lesen(text) {
    var roh = String(text || '').trim(); if (!roh) return null;
    var f = falt(roh), m;
    /* Hex: mit # oder mit Buchstaben a–f, 3 oder 6 Stellen */
    m = /(^|\s)#?([0-9a-f]{6}|[0-9a-f]{3})(\s|$)/.exec(f);
    if (m && (/#/.test(f) || (/[a-f]/.test(m[2]) && /\d/.test(m[2]))) && !/^db\b/.test(f)) { var hx = m[2].length === 3 ? m[2].replace(/(.)/g, '$1$1') : m[2]; return aus('#' + hx, 'Farbe #' + hx.toUpperCase(), ''); }
    /* DB 701–703 */
    m = /\bdb ?(70[123])\b/.exec(f); if (m) { var e = EXTRA[+m[1] - 701]; return aus('#' + e[2], e[1], ''); }
    /* RAL-Nummer, auch ohne „RAL“ */
    m = /(?:^|[^0-9])([1-9]\d{3})(?![0-9])/.exec(f); if (m && tab[m[1]]) { var r = tab[m[1]]; return aus(r.hex, 'RAL ' + r.code + ' ' + r.name, r.code); }
    /* Namen: genau, dann enthalten (das längste passende Wort gewinnt) */
    var best = null, len = 0, gut = function (wort, treffer) { if (wort.length > len) { best = treffer; len = wort.length; } };
    namen.forEach(function (n) { if (n[0] === f) gut(n[0] + '    ', function () { var r = tab[n[1]]; return aus(r.hex, 'RAL ' + r.code + ' ' + r.name, r.code); }); });
    EXTRA.forEach(function (e) { e[0].forEach(function (w) { if (w === f) gut(w + '   ', function () { return aus('#' + e[2], e[1], '', e[3], e[4]); }); }); });
    if (!best) {
      namen.forEach(function (n) { if (n[0].length >= 5 && (f.indexOf(n[0]) >= 0)) gut(n[0], function () { var r = tab[n[1]]; return aus(r.hex, 'RAL ' + r.code + ' ' + r.name, r.code); }); });
      EXTRA.forEach(function (e) { e[0].forEach(function (w) { if (w.length >= 3 && new RegExp('(^| )' + w + '( |$)').test(f)) gut(w, function () { return aus('#' + e[2], e[1], '', e[3], e[4]); }); }); });
    }
    return best ? best() : null;
  }
  window.Farbtext = { lesen: lesen, mischen: mischen, ral: tab };
})();

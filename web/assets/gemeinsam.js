/* Klopfan · gemeinsame Bausteine für App und Portal
   - KI-Auswertung der Fotos über /api/ki (Cloudflare Function), erst nach Einwilligung
   - Pilot-Hinweis im Portal
   - Logo (weiße Faust auf Schwarz, die anklopft) mit Klopf-Bewegung
   - Feier (Konfetti, Puls) und Scroll-Reveal
   Hier stehen keine geheimen Schlüssel. */
(function () {
  'use strict';
  var C = window.KONFIG = Object.assign({ marke: 'Klopfan', pilot: true, ki: '/api/ki', impressum: '/impressum/', datenschutz: '/datenschutz/' }, window.KONFIG || {});
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
        '<p>Die KI erkennt auf deinen Fotos Rahmen, Glas, Material und mehr und trägt es fürs Aufmaß ein. Dafür werden die Fotos verkleinert an unseren Dienstleister Anthropic (USA) übertragen und dort ausgewertet. Klopfan speichert deine Fotos nicht.</p>' +
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

  /* ---------- Logo: die Faust klopft an ----------
     Logo.svg(px) liefert das Zeichen. Beim Laden klopft die Faust einmal (zweimal tock), die Kachel zittert,
     danach bei Berührung oder Mauszeiger erneut. Wer weniger Bewegung eingestellt hat, sieht es ruhig. */
  var LOGO_INNEN = '<rect class="kl-kachel" width="64" height="64" rx="16" fill="#000"/><clipPath id="kl-clip"><rect width="64" height="64" rx="16"/></clipPath><g clip-path="url(#kl-clip)"><g class="kl-hand"><path fill="#fff" d="M23 64V52C23 49 19.5 46.5 16 43.5C10.5 39 9 32 12 27C14 23.5 19 23.5 20.5 26.5C22.5 21 29 19 32 22.5C34 18.5 41 18 43 22C46 18.5 52 19.5 53 24C57.5 22 61.5 26.5 60 31C60.5 36 58.5 41 55.5 44.5C53 48 49 50 45 52V64Z"/><path d="M15 31c6 1 10 6 10 13" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round"/></g></g><path class="kl-welle" d="M43 5l2.5 8.5M55 5l-3 8M61 15l-7 3.5M62 26l-7-1" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x=".75" y=".75" width="62.5" height="62.5" rx="15.4" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.5"/>';
  window.Logo = {
    svg: function (px) { var s = String(px || 32); return '<svg class="kl-logo" viewBox="0 0 64 64" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + LOGO_INNEN + '</svg>'; },
    klopfen: function (ziel) {
      var liste = ziel && ziel.classList && ziel.classList.contains('kl-logo') ? [ziel] : (ziel || document).querySelectorAll('.kl-logo');
      Array.prototype.forEach.call(liste, function (l) {
        if (l.classList.contains('klopft')) return;
        l.classList.add('klopft');
        setTimeout(function () { l.classList.remove('klopft'); }, 1500);
      });
    }
  };
  function ersterKlopfer() { setTimeout(function () { window.Logo.klopfen(document.querySelector('.hdr, .top, .side, .kopf') || document); }, 700); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ersterKlopfer); else ersterKlopfer();
  function klopfBeiBeruehrung(e) { var l = e.target && e.target.closest ? e.target.closest('.kl-logo') : null; if (l) window.Logo.klopfen(l); }
  document.addEventListener('pointerdown', klopfBeiBeruehrung, true);
  document.addEventListener('mouseover', klopfBeiBeruehrung, true);

  /* ---------- Feier: kleine Belohnungen nach erledigten Schritten ----------
     Feier.konfetti(el)  bunte Schnipsel aus einem Element heraus (oder aus der Bildmitte)
     Feier.puls(el)      ein kurzer Puls um ein Element
     Ruhig, wenn das Gerät „weniger Bewegung“ eingestellt hat. */
  function ruhig() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  var FARBEN = ['#0071e3', '#d4502b', '#1f7a3d', '#f5b942', '#5e5ce6', '#ff7a59'];
  window.Feier = {
    konfetti: function (ziel, o) {
      o = o || {};
      if (ruhig()) return;
      var r = ziel && ziel.getBoundingClientRect ? ziel.getBoundingClientRect() : null;
      var x = r ? r.left + r.width / 2 : window.innerWidth / 2, y = r ? r.top + r.height / 2 : window.innerHeight * 0.35;
      if (r && (r.width === 0 || r.bottom < 0 || r.top > window.innerHeight)) { x = window.innerWidth / 2; y = window.innerHeight * 0.35; }
      var n = o.n || 28, wrap = el('div', 'fx-konfetti');
      wrap.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < n; i++) {
        var p = document.createElement('i');
        var winkel = -Math.PI / 2 + (Math.random() - 0.5) * (o.breit ? 2.6 : 1.9), kraft = 60 + Math.random() * (o.kraft || 120);
        var dx = Math.cos(winkel) * kraft, dyu = Math.sin(winkel) * kraft, dyd = dyu + 90 + Math.random() * 110;
        var w = 5 + Math.random() * 6, h = 4 + Math.random() * 7, rund = Math.random() < 0.35;
        p.style.cssText = 'left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;--dx:' + dx.toFixed(0) + 'px;--dyu:' + dyu.toFixed(0) + 'px;--dyd:' + dyd.toFixed(0) + 'px;--rot:' + (Math.random() * 720 - 360).toFixed(0) + 'deg;--dur:' + (900 + Math.random() * 500).toFixed(0) + 'ms;--delay:' + (Math.random() * 120).toFixed(0) + 'ms;background:' + FARBEN[i % FARBEN.length] + ';width:' + w.toFixed(1) + 'px;height:' + (rund ? w : h).toFixed(1) + 'px;border-radius:' + (rund ? '50%' : '2px');
        wrap.appendChild(p);
      }
      document.body.appendChild(wrap);
      setTimeout(function () { wrap.remove(); }, 1700);
    },
    puls: function (ziel) {
      if (!ziel || ruhig()) return;
      ziel.classList.remove('fx-puls'); void ziel.offsetWidth; ziel.classList.add('fx-puls');
      setTimeout(function () { ziel.classList.remove('fx-puls'); }, 1000);
    }
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
      arr.forEach(function (e, i) { e.classList.add('rev'); e.style.setProperty('--rv', String(Math.min(i, 8))); io.observe(e); });
    }
  };

  /* ---------- Pilot-Hinweis im Portal ---------- */
  function pilotHinweis() {
    if (!C.pilot || document.body.getAttribute('data-seite') !== 'portal' || get('aufmass.pilot.zu') === '1') return;
    var bar = el('div', 'fx-pilot', '<p><b>Pilotphase:</b> Das Portal zeigt Beispieldaten, nichts wird berechnet, alles bleibt in Ihrem Browser. Echt funktionieren schon Kundenlinks, Code-Eingang und PDF-Export.</p>' +
      '<button type="button" aria-label="Hinweis schließen"><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>');
    bar.setAttribute('role', 'note');
    bar.querySelector('button').addEventListener('click', function () { put('aufmass.pilot.zu', '1'); bar.remove(); });
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pilotHinweis); else pilotHinweis();
})();

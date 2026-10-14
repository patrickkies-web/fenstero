/* Klopfan · gemeinsame Bausteine für App und Portal
   - KI-Auswertung der Fotos über /api/ki (Cloudflare Function), erst nach Einwilligung
   - Pilot-Hinweis im Portal
   - Logo (Hand, die anklopft) mit Klopf-Bewegung
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

  /* ---------- Logo: eine Hand klopft an ----------
     Logo.svg(px) liefert das Zeichen. Beim Laden klopft die Hand einmal (zweimal tock), die Tür zittert,
     danach bei Berührung oder Mauszeiger erneut. Wer weniger Bewegung eingestellt hat, sieht es ruhig. */
  var LOGO_INNEN = '<rect width="64" height="64" rx="16" fill="#E4572E"/><g class="kl-hand"><path d="M8 27C14 23 22 21 29 21.5C31 17.5 38 17 39.5 21.5C44 22 46 26 43 29.5C46.5 30.5 46.5 36 43 38C45.5 39.5 44.5 44.5 40 45.5C32 48 20 46.5 8 41.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 21.5C31 24 35 25 39 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><path class="kl-tuer" d="M50 14v36" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/><g class="kl-welle" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".6"><path d="M53.5 25.5a9 9 0 0 1 0 13"/><path d="M57 22a14 14 0 0 1 0 20"/></g>';
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

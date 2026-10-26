/* Konfigurator, Schritt 1 „Was planst du?“: Element wählen (Radiogruppe der Kacheln, Wischen, Pfeiltasten), die Stelle (ersetzen oder
   neue Öffnung), Erklärungen aus den Begriffen der App. Nur Rückmeldung und Zustand, kein Auftritt (DNA, Abschnitt 9); Element, Schatten,
   Punkt und Etikett wechseln im selben Frame, nur das Licht gleitet nach; Tastatur ohne Übergang. */
(function () {
  'use strict';
  var d = document;
  var app = d.getElementById('app'); if (!app) return;
  var ruhig = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };

  /* Texte der App: OPT.art (Name, Kurzbeschreibung), GLOSS (Begriff), Renderings aus dem 3-D-Modell; Bindestriche in Namen geschützt */
  var ART = {
    fenster: { name: 'Fenster', sub: 'Dreh, Kipp, fest', bild: 'bilder/fenster.webp', w: 380, h: 536, tuer: false,
      was: 'Ein Fenster geht auf wie gewohnt, mit Drehen und Kippen. Unsicher? Wähle, was heute eingebaut ist; dein Fensterbauer zeigt dir im Angebot, welche Alternativen es gibt.' },
    balkon: { name: 'Balkontür', sub: 'geht auf wie ein Fenster', bild: 'bilder/balkon.webp', w: 209, h: 527, tuer: true,
      was: 'Eine Tür, die aufgeht wie ein Fenster: drehen zum Durchgehen, kippen zum Lüften. Unten sitzt eine Schwelle statt der Fensterbank.' },
    fest: { name: 'Festverglasung', sub: 'großflächig, ohne Griff', bild: 'bilder/fest.webp', w: 552, h: 557, tuer: false,
      was: 'Glas direkt im Blendrahmen, ohne Flügel und ohne Griff. Dadurch schmalere Ansichten, mehr Licht und weniger Kosten. Zum Lüften braucht es daneben ein Fenster, das aufgeht.' },
    hst: { name: 'Hebe-Schiebe‑Tür', sub: 'bodentief, schiebt', bild: 'bilder/hst.webp', w: 526, h: 565, tuer: true,
      was: 'Eine bodentiefe Tür, bei der ein großer Flügel per Hebegriff angehoben und zur Seite geschoben wird. Die Öffnung bleibt frei, nichts schwenkt in den Raum.' },
    psk: { name: 'PSK‑Tür', sub: 'schiebt und kippt, meist günstiger', bild: 'bilder/psk.webp', w: 403, h: 551, tuer: true,
      was: 'Parallel-Schiebe-Kipp: Der Flügel kippt zum Lüften. Zum Öffnen stellt er sich parallel ab und schiebt sich vor das feste Teil.' },
    fsw: { name: 'Faltschiebewand', sub: 'ganz zu öffnen', bild: 'bilder/fsw.webp', w: 595, h: 493, tuer: 'wand',
      was: 'Mehrere Flügel hängen in einer Laufschiene und falten sich wie eine Ziehharmonika zu einem Paket an der Seite. So öffnet sich die ganze Wand.' }
  };
  var STELLE = {
    ersatz: '<b>Dort ist schon eins.</b> Das neue kommt in dieselbe Öffnung. Soll sie größer werden, etwa für eine Tür, wähle „Neue Öffnung“.',
    neu: '<span class="ez-punkt" aria-hidden="true"></span><b>Dort war noch keins, oder die Öffnung wird größer.</b> Du fotografierst die Wand und ziehst das neue Element auf dem Foto an seinen Platz. Die Maße sind Wunschmaße; Sturz und Statik prüft der Fachbetrieb vor dem Durchbruch.'
  };
  var REIHE = ['fenster', 'balkon', 'fest', 'hst', 'psk', 'fsw'];
  var art = 'fenster', lauf = 0;
  var $ = function (id) { return d.getElementById(id); };
  var buehne = $('buehne'), objekt = $('objekt'), bild = $('bild'), rahmen = $('neu-rahmen'), rahmenRect = rahmen.querySelector('rect');
  var punkt = $('anker-punkt'), linie = $('anker-linie'), anker = $('anker'), etikett = $('etikett'), etText = etikett.querySelector('.ez-etikett__text');
  var was = $('was'), wasText = $('was-text');
  var kacheln = Array.prototype.slice.call(app.querySelectorAll('.ez-kachel'));

  /* Lage des Elements aus den bekannten Maßen (Bild steht mittig unten im Kasten), ohne auf das Laden zu warten: Punkt an der rechten
     oberen Ecke, Linie zum Etikett, Licht und Schatten mittig, Rahmen um die ganze Standfläche */
  function lageSetzen(k) {
    var a = ART[k || art], s = buehne.getBoundingClientRect(), o = objekt.getBoundingClientRect();
    var sc = Math.min(o.width / a.w, o.height / a.h), bw = a.w * sc, bh = a.h * sc;
    var bl = o.left + (o.width - bw) / 2, bt = o.bottom - bh;
    var px = (bl + bw * .9 - s.left) / s.width * 100, py = (bt + bh * .14 - s.top) / s.height * 100;
    punkt.style.setProperty('--px', px.toFixed(2) + '%'); punkt.style.setProperty('--py', py.toFixed(2) + '%');
    var et = etikett.querySelector('.dna-etikett').getBoundingClientRect();
    var ex = (et.left - s.left + 2) / s.width * 100, ey = (et.top - s.top + et.height / 2) / s.height * 100;
    linie.setAttribute('x1', px.toFixed(2)); linie.setAttribute('y1', py.toFixed(2)); linie.setAttribute('x2', ex.toFixed(2)); linie.setAttribute('y2', ey.toFixed(2));
    var mitte = bl + bw / 2 - s.left;
    buehne.style.setProperty('--licht-x', (mitte - 120) + 'px');
    objekt.style.setProperty('--schatten-x', (bl + bw / 2 - (o.left + o.width / 2)) + 'px');
    var rw = Math.round(bw + 12), rh = Math.round(bh + 12);
    rahmen.style.left = (bl - o.left - 6) + 'px'; rahmen.style.top = (bt - o.top - 6) + 'px';
    rahmen.setAttribute('width', rw); rahmen.setAttribute('height', rh); rahmen.setAttribute('viewBox', '0 0 ' + rw + ' ' + rh);
    rahmenRect.setAttribute('width', rw - 1.5); rahmenRect.setAttribute('height', rh - 1.5);
  }
  window.addEventListener('resize', function () { lageSetzen(); });

  function kachelnSetzen(k) {
    kacheln.forEach(function (b) { var ist = b.getAttribute('data-art') === k; b.setAttribute('aria-checked', String(ist)); b.tabIndex = ist ? 0 : -1; });
  }
  function umschalterText(a) { $('stelle-ersatz').textContent = a.tuer === true ? 'Tür ersetzen' : a.tuer === 'wand' ? 'Wand ersetzen' : 'Fenster ersetzen'; }

  /* Element setzen: richtung −1/1 für den Versatz in Wischrichtung, sofort = ohne Übergang (Tastatur, weniger Bewegung) */
  function setzeArt(k, richtung, sofort) {
    var alt = art; art = k; var a = ART[k], nr = ++lauf;
    app.setAttribute('data-art', k); kachelnSetzen(k); umschalterText(a);
    buehne.setAttribute('aria-label', 'Gewähltes Element: ' + a.name + '. Wischen oder Pfeiltasten wechseln das Element.');
    was.setAttribute('aria-label', 'Was ist das: ' + a.name + '?');
    var offen = !wasText.hidden; wasText.textContent = a.was; wasText.hidden = !offen;
    if (alt === k) { lageSetzen(k); return; }
    var zeigen = function () {
      if (nr !== lauf) return;
      $('et-name').textContent = a.name; $('et-sub').textContent = a.sub;
      bild.width = a.w; bild.height = a.h;
      lageSetzen(k);
      objekt.classList.remove('wechselt'); etText.classList.remove('wechselt'); anker.classList.remove('wechselt');
    };
    var animiert = !sofort && !ruhig();
    objekt.style.setProperty('--d', richtung || (REIHE.indexOf(k) > REIHE.indexOf(alt) ? 1 : -1));
    if (animiert) { objekt.classList.add('wechselt'); etText.classList.add('wechselt'); anker.classList.add('wechselt'); void objekt.offsetWidth; }
    bild.src = a.bild;
    var weiter = function () { if (animiert) requestAnimationFrame(zeigen); else zeigen(); };
    if (bild.decode) bild.decode().then(weiter, weiter); else weiter();
  }
  function nachbar(r, sofort) { setzeArt(REIHE[(REIHE.indexOf(art) + r + REIHE.length) % REIHE.length], r, sofort); }

  /* Kacheln: Radiogruppe mit Pfeiltasten; Tastatur und Vorlesen wechseln ohne Übergang */
  kacheln.forEach(function (b) { b.addEventListener('click', function (e) { setzeArt(b.getAttribute('data-art'), 0, e.detail === 0); }); });
  $('bento').addEventListener('keydown', function (e) {
    var r = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
    if (!r) return; e.preventDefault(); nachbar(r, true);
    var z = app.querySelector('.ez-kachel[data-art="' + art + '"]'); if (z) z.focus({ preventScroll: true });
  });

  /* Begriff am Etikett: bleibt beim Vergleichen offen, der Text wechselt mit dem Element */
  was.addEventListener('click', function () { var auf = wasText.hidden; wasText.hidden = !auf; was.setAttribute('aria-expanded', String(auf)); requestAnimationFrame(function () { lageSetzen(); }); });
  /* Bogen über dem Inhalt (Erklärungen, „Ohne Foto“): Kacheln und Pille bleiben stehen; dahinter ist alles gesperrt (inert); Esc, Grund, × und
     leise Pillen schließen; Fokus geht auf × und zurück zum Auslöser */
  var offenerBogen = null;
  function sperren(bogen, auf) { var folie = bogen.parentNode; Array.prototype.forEach.call(folie.children, function (el) { if (el !== bogen) { if ('inert' in el) el.inert = auf; else if (auf) el.setAttribute('aria-hidden', 'true'); else el.removeAttribute('aria-hidden'); } }); }
  function bogenZeigen(bogen, knopf, auf) {
    var blatt = bogen.querySelector('.ez-bogen__blatt');
    if (auf) { offenerBogen = { bogen: bogen, knopf: knopf }; bogen.hidden = false; sperren(bogen, true); void bogen.offsetWidth; bogen.classList.add('ist-da'); if (knopf) knopf.setAttribute('aria-expanded', 'true'); bogen.querySelector('.ez-rund--zu').focus({ preventScroll: true }); }
    else {
      offenerBogen = null; bogen.classList.remove('ist-da'); if (knopf) knopf.setAttribute('aria-expanded', 'false'); sperren(bogen, false);
      var fertig = function () { bogen.hidden = true; blatt.removeEventListener('transitionend', fertig); clearTimeout(t); };
      var t = setTimeout(fertig, 170); if (ruhig()) fertig(); else blatt.addEventListener('transitionend', fertig);
      if (knopf) knopf.focus({ preventScroll: true });
    }
  }
  function bogenBinden(bogen, knopf) {
    if (knopf) knopf.addEventListener('click', function () { bogenZeigen(bogen, knopf, bogen.hidden); });
    bogen.querySelectorAll('[data-schliessen]').forEach(function (b) { b.addEventListener('click', function () { bogenZeigen(bogen, knopf, false); }); });
    bogen.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var z = bogen.querySelectorAll('button'), erstes = z[0], letztes = z[z.length - 1];
      if (e.shiftKey && d.activeElement === erstes) { e.preventDefault(); letztes.focus(); } else if (!e.shiftKey && d.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
    });
  }
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && offenerBogen) bogenZeigen(offenerBogen.bogen, offenerBogen.knopf, false); });
  var bogenErkl = $('erkl'), erklKnopf = $('erkl-knopf');
  bogenBinden(bogenErkl, erklKnopf);

  /* Wischen auf der Bühne: ein Finger, Zeiger wird gefangen, ab 48 px oder einem schnellen Wisch zum Nachbarn in Wischrichtung; senkrecht bleibt Scrollen */
  var w0 = null;
  buehne.addEventListener('pointerdown', function (e) { if (!e.isPrimary || w0 || e.target.closest('button')) return; w0 = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() }; try { buehne.setPointerCapture(e.pointerId); } catch (x) {} });
  function wischEnde(e) {
    if (!w0 || e.pointerId !== w0.id) return;
    var dx = e.clientX - w0.x, dy = e.clientY - w0.y, v = Math.abs(dx) / Math.max(1, performance.now() - w0.t), abbruch = e.type === 'pointercancel'; w0 = null;
    try { buehne.releasePointerCapture(e.pointerId); } catch (x) {}
    if (abbruch || Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < 48 && !(v > .5 && Math.abs(dx) > 24)) return;
    nachbar(dx < 0 ? 1 : -1);
  }
  buehne.addEventListener('pointerup', wischEnde); buehne.addEventListener('pointercancel', wischEnde);
  buehne.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); nachbar(e.key === 'ArrowRight' ? 1 : -1, true);
  });

  /* Die Stelle: Radiogruppe aus zwei Tasten; der Satz darunter kommt aus den Begriffen der App und wird vorgelesen */
  var stellen = Array.prototype.slice.call(app.querySelectorAll('[data-stelle]'));
  function sichtbarHalten(el) {
    requestAnimationFrame(function () {
      var r = el.getBoundingClientRect(), fuss = app.querySelector('.ez-fuss'), oben = fuss ? fuss.getBoundingClientRect().top : window.innerHeight;
      if (r.bottom > oben - 12) { var ziel = app.scrollHeight > app.clientHeight ? app : window; ziel.scrollBy({ top: r.bottom - oben + 24, behavior: ruhig() ? 'auto' : 'smooth' }); }
    });
  }
  function setzeStelle(k, fokus) {
    app.setAttribute('data-stelle', k);
    stellen.forEach(function (x) { var ist = x.getAttribute('data-stelle') === k; x.setAttribute('aria-checked', String(ist)); x.tabIndex = ist ? 0 : -1; if (ist && fokus) x.focus({ preventScroll: true }); });
    $('stelle-text').innerHTML = STELLE[k];
    lageSetzen(); sichtbarHalten($('stelle-text'));
  }
  stellen.forEach(function (b) { b.addEventListener('click', function () { setzeStelle(b.getAttribute('data-stelle')); }); });
  $('stelle').addEventListener('keydown', function (e) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return;
    e.preventDefault(); setzeStelle(app.getAttribute('data-stelle') === 'neu' ? 'ersatz' : 'neu', true);
  });

  /* Folien: Start und Fotos; Wechsel 260 ms seitlich, bei weniger Bewegung sofort; Fokus auf die Überschrift der neuen Folie */
  var folien = {}; Array.prototype.forEach.call(app.querySelectorAll('.ez-folie'), function (s) { folien[s.getAttribute('data-folie')] = s; });
  function zeigeFolie(name, richtung) {
    Object.keys(folien).forEach(function (k) { var s = folien[k]; s.hidden = k !== name; s.classList.remove('kommt', 'zurueck'); });
    var s = folien[name]; app.setAttribute('data-folie', name);
    if (richtung && !ruhig()) { void s.offsetWidth; s.classList.add('kommt'); if (richtung < 0) s.classList.add('zurueck'); }
    if (app.scrollHeight > app.clientHeight) app.scrollTop = 0; window.scrollTo(0, 0);
    var h = s.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (name === 'fotos') fotoTexte(); else requestAnimationFrame(function () { lageSetzen(); });
    Array.prototype.forEach.call(d.querySelectorAll('.ez-notiz__folie'), function (n) { n.hidden = n.getAttribute('data-fuer') !== name; });
  }
  Array.prototype.forEach.call(d.querySelectorAll('.ez-notiz__folie'), function (n) { n.hidden = n.getAttribute('data-fuer') !== 'start'; });
  $('weiter').addEventListener('click', function () { zeigeFolie('fotos', 1); });
  app.querySelectorAll('[data-zurueck]').forEach(function (b) { b.addEventListener('click', function () { zeigeFolie('start', -1); }); });

  /* ---------- Folie 2: Fotos ---------- */
  var fotoBuehne = $('foto-buehne'), fotoBild = $('foto-bild'), fotoChip = $('foto-chip'), kiAnker = $('ki-anker');
  var fotos = { in: null, out: null }, BEISPIEL = { in: 'bilder/wand-innen.webp', out: 'bilder/haus-aussen.webp' };
  var fotoTipp = $('foto-tipp'), fotoI = $('foto-i');
  bogenBinden($('ki-erkl'), fotoI);
  function fotoTexte() {
    var a = ART[art], neu = app.getAttribute('data-stelle') === 'neu';
    var ding = a.tuer === true ? 'die Tür' : a.tuer === 'wand' ? 'die Wand' : art === 'fest' ? 'die Verglasung' : 'das Fenster';
    $('foto-h1').innerHTML = neu ? 'Fotografiere <em>die Stelle.</em>' : 'Fotografiere <em>' + ding + '.</em>';
    $('foto-unterzeile').textContent = neu ? 'Einmal von innen, einmal von außen: die ganze Wand, an die das neue Element soll.' : 'Einmal von innen, einmal von außen. Du musst nichts eintippen.';
    $('foto-karte-text').textContent = neu ? 'Danach zeichnest du das Element auf dem Foto ein. Die KI liest Wand, Leitungen und Fassade.' : 'Die KI liest daraus die Einbausituation für deinen Fensterbauer: Rollladenkasten, Laibung, Fensterbänke, Fassade.';
    fotoTipp.querySelector('span').innerHTML = 'Handy <b>gerade</b> halten, ' + (neu ? 'die ganze Stelle' : ding + ' ganz') + ' im Bild, etwas Wand drumherum.';
    $('foto-weiter').firstChild.textContent = (neu ? 'Weiter zum Einzeichnen' : 'Weiter zum Messen') + ' ';
  }
  function fotoStand() {
    var n = (fotos.in ? 1 : 0) + (fotos.out ? 1 : 0); $('fotos-stand').textContent = n + ' von 2';
  }
  /* Ein Foto kommt an (Kamera, Datei oder Beispiel): Platz füllt sich, die Bühne zeigt es, beim Beispiel folgen die Befunde der KI als Etiketten */
  var kiLauf = 0, BEISPIEL_CHIP = '<b>Beispiel</b> · so sieht ein gutes Foto aus';
  function buehneZeigen(seite) {
    if (!seite || !fotos[seite]) { fotoBild.src = BEISPIEL.in; fotoBuehne.setAttribute('data-stand', 'beispiel'); fotoChip.innerHTML = BEISPIEL_CHIP; kiAnker.hidden = true; kiAnker.classList.remove('ist-da'); return; }
    fotoBild.src = fotos[seite].url; fotoBuehne.setAttribute('data-stand', 'foto');
    fotoChip.innerHTML = (seite === 'in' ? '<b>Von innen</b>' : '<b>Von außen</b>') + (fotos[seite].beispiel ? ' · Beispiel' : '') + ' · KI fertig';
    var zeigen = fotos[seite].beispiel && seite === 'in'; kiAnker.hidden = !zeigen; kiAnker.classList.toggle('ist-da', zeigen);
  }
  function fotoSetzen(seite, url, beispiel) {
    fotos[seite] = { url: url, beispiel: !!beispiel };
    var slot = app.querySelector('.ez-slot[data-seite="' + seite + '"]'), img = slot.querySelector('img'), chip = slot.querySelector('.ez-slot__chip');
    img.src = url; img.hidden = false; img.alt = (seite === 'in' ? 'Von innen' : 'Von außen') + (beispiel ? ', Beispiel' : ''); slot.classList.add('ist-voll'); slot.querySelector('.ez-slot__weg').hidden = false;
    chip.hidden = false; chip.classList.remove('ist-fertig'); chip.textContent = 'KI liest';
    fotoBild.src = url; fotoBuehne.setAttribute('data-stand', 'foto');
    fotoChip.innerHTML = (seite === 'in' ? '<b>Von innen</b>' : '<b>Von außen</b>') + (beispiel ? ' · Beispiel' : '') + ' · KI liest';
    kiAnker.hidden = true; kiAnker.classList.remove('ist-da');
    var nr = ++kiLauf;
    setTimeout(function () {
      if (nr !== kiLauf) return;
      chip.classList.add('ist-fertig'); chip.textContent = 'KI fertig';
      fotoChip.innerHTML = (seite === 'in' ? '<b>Von innen</b>' : '<b>Von außen</b>') + (beispiel ? ' · Beispiel' : '') + ' · KI fertig';
      if (beispiel && seite === 'in') { kiAnker.hidden = false; requestAnimationFrame(function () { kiAnker.classList.add('ist-da'); }); }
    }, ruhig() ? 0 : 1200);
    fotoStand();
  }
  app.querySelectorAll('.ez-slot input').forEach(function (inp) {
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { fotoSetzen(inp.closest('.ez-slot').getAttribute('data-seite'), r.result, false); }; r.readAsDataURL(f);
    });
  });
  $('beispiel-laden').addEventListener('click', function () { fotoSetzen('out', BEISPIEL.out, true); setTimeout(function () { fotoSetzen('in', BEISPIEL.in, true); }, ruhig() ? 0 : 1500); });
  /* Ein voller Platz zeigt sein Foto auf der Bühne (in der App öffnet er die Großansicht); nur der leere Platz startet die Kamera */
  app.querySelectorAll('.ez-slot').forEach(function (slot) { slot.addEventListener('click', function (e) {
    var seite = slot.getAttribute('data-seite'); if (!fotos[seite]) return; e.preventDefault(); buehneZeigen(seite);
  }); });
  /* Foto entfernen: Platz wird wieder leer, die Bühne zeigt das andere Foto oder wieder das Beispiel */
  function fotoWeg(seite) {
    var slot = app.querySelector('.ez-slot[data-seite="' + seite + '"]'), img = slot.querySelector('img');
    fotos[seite] = null; kiLauf++; img.hidden = true; img.removeAttribute('src'); slot.classList.remove('ist-voll');
    slot.querySelector('.ez-slot__chip').hidden = true; slot.querySelector('.ez-slot__weg').hidden = true;
    fotoStand(); var andere = seite === 'in' ? 'out' : 'in'; buehneZeigen(fotos[andere] ? andere : null);
    status((seite === 'in' ? 'Foto von innen' : 'Foto von außen') + ' entfernt.'); slot.querySelector('input').focus({ preventScroll: true });
  }
  app.querySelectorAll('.ez-slot__weg').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fotoWeg(b.closest('.ez-slot').getAttribute('data-seite')); }); });
  /* Die Bühne mit dem Beispiel öffnet die Kamera für innen */
  fotoBuehne.addEventListener('click', function () { if (fotoBuehne.getAttribute('data-stand') === 'beispiel') $('foto-in').click(); });
  /* „Weiter“: ohne Foto erst der Bogen; „Foto machen“ öffnet die Kamera für innen */
  var bogenOhne = $('ohne-foto'), fotoWeiter = $('foto-weiter');
  bogenBinden(bogenOhne, null);
  function status(t) { var live = d.getElementById('ez-live'); if (!live) { live = d.createElement('p'); live.id = 'ez-live'; live.setAttribute('role', 'status'); live.className = 'ez-unsichtbar'; d.body.appendChild(live); } live.textContent = t; }
  fotoWeiter.addEventListener('click', function () { if (!fotos.in && !fotos.out) bogenZeigen(bogenOhne, fotoWeiter, true); else status('In der App geht es jetzt zum Messen.'); });
  $('ohne-foto-machen').addEventListener('click', function () { bogenZeigen(bogenOhne, fotoWeiter, false); $('foto-in').click(); });
  $('ohne-foto-weiter').addEventListener('click', function () { bogenZeigen(bogenOhne, fotoWeiter, false); status('In der App geht es jetzt ohne Foto zum Messen.'); });
  fotoStand();

  setzeArt('fenster');
  if (bild.complete) lageSetzen(); else bild.addEventListener('load', function () { lageSetzen(); }, { once: true });
  window.addEventListener('load', function () { REIHE.forEach(function (k) { var i = new Image(); i.src = ART[k].bild; }); });
})();

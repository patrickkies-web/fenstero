/* Konfigurator, Schritt 1 „Was planst du?“: Element wählen (Kacheln, Wischen, Pfeiltasten, runde Knöpfe), die Stelle (ersetzen oder
   neue Öffnung), Erklärungen aus den Begriffen der App. Nur Rückmeldung und Zustand, kein Auftritt (DNA, Abschnitt 9). */
(function () {
  'use strict';
  var d = document;
  var app = d.getElementById('app'); if (!app) return;
  var ruhig = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };

  /* Texte der App: OPT.art (Name, Kurzbeschreibung), GLOSS (Begriff), Renderings aus dem 3-D-Modell */
  var ART = {
    fenster: { name: 'Fenster', sub: 'Dreh, Kipp, fest', bild: 'bilder/fenster.webp', w: 380, h: 536,
      was: 'Ein Fenster geht auf wie gewohnt, mit Drehen und Kippen. Unsicher? Wähle, was heute eingebaut ist; dein Fensterbauer zeigt dir im Angebot, welche Alternativen es gibt.' },
    balkon: { name: 'Balkontür', sub: 'geht auf wie ein Fenster', bild: 'bilder/balkon.webp', w: 209, h: 527,
      was: 'Eine Tür, die aufgeht wie ein Fenster: drehen zum Durchgehen, kippen zum Lüften. Unten sitzt eine Schwelle statt der Fensterbank.' },
    fest: { name: 'Festverglasung', sub: 'großflächig, ohne Griff', bild: 'bilder/fest.webp', w: 552, h: 557,
      was: 'Glas direkt im Blendrahmen, ohne Flügel und ohne Griff. Dadurch schmalere Ansichten, mehr Licht und weniger Kosten. Zum Lüften braucht es daneben ein Fenster, das aufgeht.' },
    hst: { name: 'Hebe-Schiebe-Tür', sub: 'bodentief, schiebt', bild: 'bilder/hst.webp', w: 526, h: 565,
      was: 'Eine bodentiefe Tür, bei der ein großer Flügel per Hebegriff angehoben und zur Seite geschoben wird. Die Öffnung bleibt frei, nichts schwenkt in den Raum.' },
    psk: { name: 'PSK-Tür', sub: 'schiebt und kippt, meist günstiger', bild: 'bilder/psk.webp', w: 403, h: 551,
      was: 'Parallel-Schiebe-Kipp: Der Flügel kippt zum Lüften. Zum Öffnen stellt er sich parallel ab und schiebt sich vor das feste Teil.' },
    fsw: { name: 'Faltschiebewand', sub: 'ganz zu öffnen', bild: 'bilder/fsw.webp', w: 595, h: 493,
      was: 'Mehrere Flügel hängen in einer Laufschiene und falten sich wie eine Ziehharmonika zu einem Paket an der Seite. So öffnet sich die ganze Wand.' }
  };
  var STELLE = {
    ersatz: '<b>Dort ist schon eins.</b> Das neue kommt in die bestehende Öffnung. Soll sie größer werden, etwa für eine Tür, wähle „Neue Öffnung“.',
    neu: '<span class="ez-punkt" aria-hidden="true"></span><b>Dort war noch keins, oder die Öffnung wird größer.</b> Du fotografierst die Wand und ziehst das neue Element auf dem Foto an seinen Platz. Die Maße sind Wunschmaße; Sturz und Statik prüft der Fachbetrieb vor dem Durchbruch.'
  };
  var REIHE = ['fenster', 'balkon', 'fest', 'hst', 'psk', 'fsw'];
  var art = 'fenster';
  var $ = function (id) { return d.getElementById(id); };
  var buehne = $('buehne'), objekt = $('objekt'), bild = $('bild'), rahmen = objekt.querySelector('.ez-neu-rahmen');
  var punkt = $('anker-punkt'), linie = $('anker-linie'), etikett = $('etikett'), etText = etikett.querySelector('.ez-etikett__text');
  var was = $('was'), wasText = $('was-text');

  /* Anker, Licht und Rahmen folgen dem sichtbaren Element: Punkt an der rechten oberen Ecke, Linie zum Etikett, Licht und Schatten mittig */
  function lageSetzen() {
    if (!bild.complete || !bild.naturalWidth) return;
    var b = bild.getBoundingClientRect(), s = buehne.getBoundingClientRect(), o = objekt.getBoundingClientRect();
    var px = (b.right - s.left - b.width * .1) / s.width * 100, py = (b.top - s.top + b.height * .14) / s.height * 100;
    punkt.style.setProperty('--px', px.toFixed(2) + '%'); punkt.style.setProperty('--py', py.toFixed(2) + '%');
    var et = etikett.querySelector('.dna-etikett').getBoundingClientRect();
    var ex = (et.left - s.left + 2) / s.width * 100, ey = (et.top - s.top + et.height / 2) / s.height * 100;
    linie.setAttribute('x1', px.toFixed(2)); linie.setAttribute('y1', py.toFixed(2)); linie.setAttribute('x2', ex.toFixed(2)); linie.setAttribute('y2', ey.toFixed(2));
    var mitte = b.left + b.width / 2 - s.left;
    buehne.style.setProperty('--licht-x', (mitte - 120) + 'px');
    objekt.style.setProperty('--schatten-x', (b.left + b.width / 2 - (o.left + o.width / 2)) + 'px');
    rahmen.style.left = (b.left - o.left - 6) + 'px'; rahmen.style.top = (b.top - o.top - 6) + 'px';
    rahmen.style.width = (b.width + 12) + 'px'; rahmen.style.height = (b.height * .92 + 6) + 'px';
  }
  bild.addEventListener('load', lageSetzen);
  window.addEventListener('resize', lageSetzen);

  function setzeArt(k, richtung) {
    var alt = art; art = k; var a = ART[k];
    app.setAttribute('data-art', k);
    app.querySelectorAll('.ez-kachel').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-art') === k)); });
    if (alt !== k) {
      objekt.style.setProperty('--d', richtung || (REIHE.indexOf(k) > REIHE.indexOf(alt) ? 1 : -1));
      if (!ruhig()) { objekt.classList.add('wechselt'); etText.classList.add('wechselt'); void objekt.offsetWidth; }
      bild.width = a.w; bild.height = a.h; bild.src = a.bild;
      requestAnimationFrame(function () { objekt.classList.remove('wechselt'); etText.classList.remove('wechselt'); });
    }
    $('et-name').textContent = a.name; $('et-sub').textContent = a.sub; $('art-wert').textContent = a.name;
    buehne.setAttribute('aria-label', 'Gewähltes Element: ' + a.name + '. Wischen, Pfeiltasten oder die runden Knöpfe wechseln das Element.');
    was.setAttribute('aria-label', 'Was ist das: ' + a.name + '?'); was.setAttribute('aria-expanded', 'false');
    wasText.hidden = true; wasText.textContent = a.was;
    setTimeout(lageSetzen, 30);
  }
  function nachbar(r) { setzeArt(REIHE[(REIHE.indexOf(art) + r + REIHE.length) % REIHE.length], r); }
  app.querySelectorAll('.ez-kachel').forEach(function (b) { b.addEventListener('click', function () { setzeArt(b.getAttribute('data-art')); }); });
  $('naechstes-element').addEventListener('click', function () { nachbar(1); });
  $('zurueck-element').addEventListener('click', function () { nachbar(-1); });

  /* Erklärungen: der i-Knopf am Etikett zeigt den Begriff unter den Kacheln, das i an der Frage die Übersicht; beides bleibt über dem Fuß */
  function sichtbarHalten(el) {
    requestAnimationFrame(function () {
      var r = el.getBoundingClientRect(), fuss = app.querySelector('.ez-fuss'), oben = fuss ? fuss.getBoundingClientRect().top : window.innerHeight;
      if (r.bottom > oben - 12) { var ziel = app.scrollHeight > app.clientHeight ? app : window; ziel.scrollBy({ top: r.bottom - oben + 24, behavior: ruhig() ? 'auto' : 'smooth' }); }
    });
  }
  was.addEventListener('click', function () { var auf = wasText.hidden; wasText.hidden = !auf; was.setAttribute('aria-expanded', String(auf)); if (auf) sichtbarHalten(wasText); });
  $('erkl-knopf').addEventListener('click', function () { var e = $('erkl'), auf = e.hidden; e.hidden = !auf; this.setAttribute('aria-expanded', String(auf)); if (auf) sichtbarHalten(e); setTimeout(lageSetzen, 0); });

  /* Wischen auf der Bühne: ab 48 px oder einem schnellen Wisch zum Nachbarn, in Wischrichtung; senkrecht bleibt Scrollen */
  var w0 = null;
  buehne.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; w0 = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  buehne.addEventListener('pointerup', function (e) {
    if (!w0) return; var dx = e.clientX - w0.x, dy = e.clientY - w0.y, v = Math.abs(dx) / Math.max(1, performance.now() - w0.t); w0 = null;
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < 48 && !(v > .5 && Math.abs(dx) > 24)) return;
    nachbar(dx < 0 ? 1 : -1);
  });
  buehne.addEventListener('pointercancel', function () { w0 = null; });
  buehne.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); nachbar(e.key === 'ArrowRight' ? 1 : -1);
  });

  /* Die Stelle: Fenster ersetzen oder neue Öffnung; der Satz darunter kommt aus den Begriffen der App */
  app.querySelectorAll('[data-stelle]').forEach(function (b) { b.addEventListener('click', function () {
    var k = b.getAttribute('data-stelle');
    app.setAttribute('data-stelle', k);
    app.querySelectorAll('[data-stelle]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    $('stelle-text').innerHTML = STELLE[k];
    lageSetzen(); sichtbarHalten($('stelle-text'));
  }); });

  /* Vorschau: „Weiter“ hat kein Ziel; eine Statuszeile sagt, was die App täte */
  $('weiter').addEventListener('click', function () {
    var live = d.getElementById('ez-live'); if (!live) { live = d.createElement('p'); live.id = 'ez-live'; live.setAttribute('role', 'status'); live.className = 'ez-unsichtbar'; d.body.appendChild(live); }
    live.textContent = 'In der App geht es jetzt zu den Fotos.';
  });

  setzeArt('fenster');
})();

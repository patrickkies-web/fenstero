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
    fenster: { name: 'Fenster', sub: 'Dreh, Kipp, fest', bild: 'bilder/fenster.webp', w: 379, h: 536, tuer: false,
      was: 'Ein Fenster geht auf wie gewohnt, mit Drehen und Kippen. Unsicher? Wähle, was heute eingebaut ist; dein Fensterbauer zeigt dir im Angebot, welche Alternativen es gibt.' },
    balkon: { name: 'Balkontür', sub: 'geht auf wie ein Fenster', bild: 'bilder/balkon.webp', w: 208, h: 525, tuer: true,
      was: 'Eine Tür, die aufgeht wie ein Fenster: drehen zum Durchgehen, kippen zum Lüften. Unten sitzt eine Schwelle statt der Fensterbank.' },
    fest: { name: 'Festverglasung', sub: 'großflächig, ohne Griff', bild: 'bilder/fest.webp', w: 552, h: 557, tuer: false,
      was: 'Glas direkt im Blendrahmen, ohne Flügel und ohne Griff. Dadurch schmalere Ansichten, mehr Licht und weniger Kosten. Zum Lüften braucht es daneben ein Fenster, das aufgeht.' },
    hst: { name: 'Hebe-Schiebe‑Tür', sub: 'bodentief, schiebt', bild: 'bilder/hst.webp', w: 526, h: 564, tuer: true,
      was: 'Eine bodentiefe Tür, bei der ein großer Flügel per Hebegriff angehoben und zur Seite geschoben wird. Die Öffnung bleibt frei, nichts schwenkt in den Raum.' },
    psk: { name: 'PSK‑Tür', sub: 'schiebt und kippt, meist günstiger', bild: 'bilder/psk.webp', w: 404, h: 549, tuer: true,
      was: 'Parallel-Schiebe-Kipp: Der Flügel kippt zum Lüften. Zum Öffnen stellt er sich parallel ab und schiebt sich vor das feste Teil.' },
    fsw: { name: 'Faltschiebewand', sub: 'ganz zu öffnen', bild: 'bilder/fsw.webp', w: 595, h: 492, tuer: 'wand',
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
    if (!s.width || !s.height || !o.width) return; /* Folie verborgen oder Bild noch ohne Maße: nichts rechnen */
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
  /* Tastatur löst nie Gleiten aus (Bewegung 4): die letzte Eingabe merken, Taste setzt, Zeiger löscht. Nach jedem Wechsel sind Pille und
     Kacheln 450 ms taub für Zeigerklicks, damit ein Doppeltipp nicht die Pille der nächsten Folie trifft (UX 1); Tastatur geht durch. */
  var tastaturZuletzt = false, wechselBis = 0;
  d.addEventListener('keydown', function (e) { if (!e.ctrlKey && !e.metaKey && !e.altKey) tastaturZuletzt = true; }, true);
  d.addEventListener('pointerdown', function () { tastaturZuletzt = false; }, true);
  app.addEventListener('click', function (e) {
    if (e.detail === 0 || Date.now() >= wechselBis) return;
    if (e.target.closest && e.target.closest('.ez-fuss button, .ez-fuss a, .ez-ab-kachel, .dna-pille')) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  function zeigeFolie(name, richtung) {
    Object.keys(folien).forEach(function (k) { var s = folien[k]; s.hidden = k !== name; s.classList.remove('kommt', 'zurueck'); });
    var s = folien[name]; app.setAttribute('data-folie', name); wechselBis = Date.now() + 450;
    /* Wer in der Vorschau direkt zu einer späteren Folie springt (ezVorschau.zeigeFolie), bekommt Beispielmaße statt „NaN“ (Zeichen, nebenbei) */
    if (['start', 'fotos', 'messen'].indexOf(name) < 0 && !(mess.werte.hm > 0 && mess.werte.wb > 0)) beispielMasse();
    app.scrollTop = 0; window.scrollTo(0, 0);
    var h = s.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (name === 'fotos') { fotoTexte(); [messBild, messBildFront].forEach(function (img, p) { if (img.getAttribute('src') !== bildSrc(p)) img.src = bildSrc(p); }); } else if (name === 'messen') messZeigen(); else if (name === 'ergebnis') { if (ergBild.getAttribute('src') !== ergSrc(ergZoom > 1)) ergBild.src = ergSrc(ergZoom > 1); var zn = (window.ezVorschau || {}).ergVon === 'fertig' ? 'Zurück: Fenster' : 'Zurück zu den Rändern'; ['erg-zurueck'].forEach(function (id) { $(id).setAttribute('aria-label', zn); }); s.querySelector('[data-erg-zurueck]').setAttribute('aria-label', zn); requestAnimationFrame(function () { ergBreite = app.clientWidth; ergSetzen(); }); } else requestAnimationFrame(function () { lageSetzen(); });
    Array.prototype.forEach.call(d.querySelectorAll('.ez-notiz__folie'), function (n) { n.hidden = n.getAttribute('data-fuer') !== name; });
    /* erst den Zustand setzen, dann einfahren: Stationen und Chips stehen schon, wenn die Folie kommt (Bewegung 10) */
    if (folienZeigen[name]) folienZeigen[name](richtung);
    if (richtung && !ruhig() && !tastaturZuletzt && app.getAttribute('data-folie') === name) { void s.offsetWidth; s.classList.add('kommt'); if (richtung < 0) s.classList.add('zurueck'); }
  }
  var hinweisT = 0;
  function hinweis(t) {
    var f = folien[app.getAttribute('data-folie')], fuss = f && f.querySelector('.ez-fuss'); status(t); if (!fuss) return;
    var el = fuss.querySelector('.ez-ab-toast'); if (!el) { el = d.createElement('p'); el.className = 'ez-ab-toast'; el.setAttribute('aria-hidden', 'true'); el.hidden = true; fuss.insertBefore(el, fuss.firstChild); }
    clearTimeout(hinweisT); el.textContent = t; el.hidden = false; el.classList.remove('geht');
    hinweisT = setTimeout(function () { el.classList.add('geht'); hinweisT = setTimeout(function () { el.hidden = true; }, ruhig() ? 0 : 150); }, 2400);
  }
  app.addEventListener('click', function (e) {
    var k = e.target.closest && e.target.closest('.ez-kopf__knopf, .ez-notiz, .ez-notizknopf'); if (!k || k.hasAttribute('data-eigen')) return;
    hinweis('Vorschau: In der App öffnet sich hier ' + (k.classList.contains('ez-kopf__knopf--zeichen') ? 'das Verzeichnis der Begriffe.' : k.classList.contains('ez-kopf__knopf') ? 'die Übersicht deines Projekts mit allen Fenstern.' : 'die Notiz zu diesem Fenster.'));
  });
  /* Weitere Folien (eigene Dateien) melden sich hier an; zeigeFolie ruft beim Zeigen ihre Funktion */
  var folienZeigen = {};
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
  function status(t) { var gl = d.getElementById('mess-gross-live'); if (gl && gl.closest('dialog[open]')) { gl.textContent = t; return; } var live = d.getElementById('ez-live'); if (!live) { live = d.createElement('p'); live.id = 'ez-live'; live.setAttribute('role', 'status'); live.className = 'ez-unsichtbar'; d.body.appendChild(live); } live.textContent = t; }
  /* „Diesen Hinweis nicht mehr anzeigen“: angehakt geht „Weiter“ ohne Foto direkt weiter. Die App merkt es sich im Gerät (aufmass.ohnefoto.zu);
     die Vorschau nur bis zum Neuladen, damit der Hinweis beim nächsten Öffnen wieder zu sehen ist */
  var ohneFotoZu = false, ohneZuKasten = $('ohne-foto-zu');
  ohneZuKasten.addEventListener('change', function () { ohneFotoZu = ohneZuKasten.checked; });
  fotoWeiter.addEventListener('click', function () {
    if (fotos.in || fotos.out || ohneFotoZu) return zumMessen();
    bogenZeigen(bogenOhne, fotoWeiter, true);
  });
  $('ohne-foto-machen').addEventListener('click', function () { bogenZeigen(bogenOhne, fotoWeiter, false); $('foto-in').click(); });
  $('ohne-foto-weiter').addEventListener('click', function () { bogenZeigen(bogenOhne, fotoWeiter, false); zumMessen(); });
  /* Neue Öffnung: In der App folgt das Einzeichnen (noch nicht überarbeitet); beim Ersatz Schritt 3 „Messen“ */
  function zumMessen() { if (app.getAttribute('data-stelle') === 'neu') return status('In der App geht es jetzt zum Einzeichnen.'); zeigeFolie('messen', 1); }
  fotoStand();

  /* ---------- Folie 3: Messen ----------
     Ablauf, Texte und Prüfungen aus der App (MESS, checkValue, cmFrage, UEBLICH in web/assets/app.js); Gestaltung nach der DNA:
     kein Zwischenschritt, die Tasten stehen offen, „Weiter“ prüft, speichert und geht zum nächsten Maß. Die Linienlagen kommen aus dem
     3-D-Modell der App (Enden der aktiven Maßlinie je Element und Maß, in Pixeln des Bildes, 2148 × 1400). */
  var MESS_LAGE = {"fenster":[[1060.8,240.5,1060.8,1134.7],[1105.8,264.5,1105.8,1133.6],[667.0,702.3,1480.0,702.3],[689.4,721.5,1459.2,721.5]],"balkon":[[1060.8,240.5,1060.8,1134.7],[1087.8,249.7,1087.8,1139.5],[880.8,702.3,1266.6,702.3],[891.0,710.7,1257.0,710.7]],"fest":[[1060.8,240.5,1060.8,1134.7],[1111.8,257.4,1111.8,1131.1],[514.8,702.3,1632.6,702.3],[540.0,716.4,1608.0,716.4]],"hst":[[1060.8,240.5,1060.8,1134.7],[1086.5,249.0,1086.5,1140.1],[348.6,702.3,1799.4,702.3],[365.4,710.1,1782.6,710.1]],"psk":[[1060.8,240.5,1060.8,1134.7],[1087.8,249.7,1087.8,1139.5],[641.4,702.3,1506.6,702.3],[655.2,710.7,1492.8,710.7]],"fsw":[[1060.8,240.5,1060.8,1134.7],[1086.5,249.0,1086.5,1140.1],[348.6,702.3,1799.4,702.3],[365.4,710.1,1782.6,710.1]]};
  var MESS_RAHMEN = {"fenster":[[731.7,243.6,1408.8,1134.7],[665.4,237.0,1482.6,1167.6]],"balkon":[[902.8,243.6,1222.2,1134.7],[880.8,237.0,1266.6,1167.6]],"fest":[[615.3,243.6,1542.3,1134.7],[514.8,237.0,1632.6,1167.6]],"hst":[[489.4,243.6,1693.5,1134.7],[348.6,237.0,1799.4,1167.6]],"psk":[[713.2,243.6,1429.8,1134.7],[641.4,237.0,1506.6,1167.6]],"fsw":[[489.4,243.6,1693.5,1134.7],[348.6,237.0,1799.4,1167.6]]};
  /* Ränder (Schritt 4) aus demselben Modell: Höhe links und rechts schräg, Breite oben und unten von vorn; „Passt.“ zeigt alle sechs
     Maße der Öffnung von vorn (Breite oben, Mitte, unten; Höhe links, Mitte, rechts). Erzeugt mit werkzeuge/lage-rand.mjs und rand-daten.py */
  var RAND_LAGE = {"fenster":[[746.7,214.0,753.6,1109.1],[1421.0,269.8,1414.4,1215.3],[667.0,260.7,1480.0,260.7],[667.0,1143.9,1480.0,1143.9]],"balkon":[[913.2,231.3,916.2,1135.2],[1212.0,256.5,1209.3,1182.0],[880.8,251.7,1267.2,251.7],[880.8,1153.5,1266.6,1153.5]],"fest":[[631.8,208.2,640.5,1091.1],[1524.0,282.0,1514.4,1231.5],[513.0,264.3,1634.4,264.3],[514.2,1140.9,1633.8,1140.9]],"hst":[[493.8,196.5,505.8,1069.2],[1688.7,295.5,1675.2,1257.6],[347.4,251.1,1800.6,251.1],[347.4,1154.1,1800.0,1154.1]],"psk":[[720.6,215.4,728.1,1104.9],[1421.4,273.6,1414.5,1215.6],[640.8,251.7,1507.2,251.7],[640.8,1153.5,1507.2,1153.5]],"fsw":[[493.8,196.5,505.8,1069.2],[1688.7,295.5,1675.2,1257.6],[347.4,251.1,1800.6,251.1],[347.4,1154.1,1800.0,1154.1]]};
  var PASST_LAGE = {"fenster":[[667.0,260.7,1480.0,260.7],[667.0,702.3,1480.0,702.3],[667.0,1143.9,1480.0,1143.9],[668.5,237.0,668.5,1167.6],[1074.0,237.0,1074.0,1167.6],[1478.5,237.0,1478.5,1167.6]],"balkon":[[880.8,251.7,1267.2,251.7],[880.8,702.3,1266.6,702.3],[880.8,1153.5,1266.6,1153.5],[895.5,237.0,895.5,1167.6],[1074.0,237.0,1074.0,1167.6],[1253.1,237.0,1253.1,1167.6]],"fest":[[513.0,264.3,1634.4,264.3],[514.8,702.3,1632.6,702.3],[514.2,1140.9,1633.8,1140.9],[542.1,237.0,542.1,1167.6],[1074.0,237.0,1074.0,1167.6],[1607.1,237.0,1607.1,1167.6]],"hst":[[347.4,251.1,1800.6,251.1],[348.6,702.3,1799.4,702.3],[347.4,1154.1,1800.0,1154.1],[362.1,237.0,362.1,1167.6],[1074.0,237.0,1074.0,1167.6],[1786.5,237.0,1786.5,1167.6]],"psk":[[640.8,251.7,1507.2,251.7],[641.4,702.3,1506.6,702.3],[640.8,1153.5,1507.2,1153.5],[656.1,237.0,656.1,1167.6],[1074.0,237.0,1074.0,1167.6],[1492.5,237.0,1492.5,1167.6]],"fsw":[[347.4,251.1,1800.6,251.1],[348.6,702.3,1799.4,702.3],[347.4,1154.1,1800.0,1154.1],[362.1,237.0,362.1,1167.6],[1074.0,237.0,1074.0,1167.6],[1786.5,237.0,1786.5,1167.6]]};
  var MESS = [
    { k: 'hm', g: 'oeffnung-hoehe', wer: 'mo', r: 'v', sub: 'Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zur Fensterbank.', subTuer: 'Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zum fertigen Fußboden.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'], chip: 'nicht' },
    { k: 'h', g: 'element-hoehe', wer: 'el', r: 'v', sub: 'Senkrecht in der Mitte: der feste Rahmen, von seiner Außenkante oben bis unten.', subTuer: 'Senkrecht in der Mitte: der feste Rahmen samt Schwelle, von Außenkante oben bis unten.', enden: ['Rahmen außen', 'Rahmen außen'], endenTuer: ['Rahmen außen', 'Unterkante Schwelle'], chip: 'samt' },
    { k: 'wm', g: 'oeffnung-breite', wer: 'mo', r: 'h', sub: 'Von innen, waagerecht auf halber Höhe: von Mauer zu Mauer.', enden: ['Mauer', 'Mauer'], chip: 'nicht' },
    { k: 'w', g: 'element-breite', wer: 'el', r: 'h', sub: 'Waagerecht auf halber Höhe: der feste Rahmen, von Außenkante zu Außenkante.', enden: ['Rahmen außen', 'Rahmen außen'], chip: 'samt' }
  ];
  /* Schritt 4: die Ränder der Öffnung (REST und checkRest der App); „Hier auch … gemessen?“ speichert das Maß der Mitte für diesen Rand */
  var RAND = [
    { k: 'hl', g: 'raender', wer: 'mo', r: 'v', rand: 'links', sub: 'Senkrecht, dicht an der linken Mauer. Alte Häuser sind selten im Winkel.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'], chip: 'nicht' },
    { k: 'hr', g: 'raender', wer: 'mo', r: 'v', rand: 'rechts', sub: 'Senkrecht, dicht an der rechten Mauer.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'], chip: 'nicht' },
    { k: 'wt', g: 'raender', wer: 'mo', r: 'h', rand: 'oben', sub: 'Waagerecht, dicht unter der Oberkante der Öffnung.', enden: ['Mauer', 'Mauer'], chip: 'nicht' },
    { k: 'wb', g: 'raender', wer: 'mo', r: 'h', rand: 'unten', sub: 'Waagerecht, dicht über der Fensterbank.', enden: ['Mauer', 'Mauer'], chip: 'nicht' }
  ];
  var UEBLICH = { fenster: { v: [500, 2400, 1250], h: [400, 3000, 1100] }, balkon: { v: [1900, 2600, 2150], h: [700, 1400, 900] }, fest: { v: [300, 3000, 1250], h: [300, 4000, 1500] }, hst: { v: [2000, 2700, 2250], h: [2000, 6000, 3500] }, psk: { v: [1900, 2600, 2150], h: [1400, 3500, 2000] }, fsw: { v: [2000, 2700, 2250], h: [1800, 6000, 3500] } };
  var MESS_GLOSS = {
    'oeffnung-hoehe': { t: 'Wie messe ich die Maueröffnung senkrecht?', x: ['Die Maueröffnung ist das Loch in der Wand, in dem dein Fenster sitzt. Senkrecht misst du sie in der Mitte: von der Oberkante der Öffnung, also der Unterseite von Sturz oder Rollladenkasten, bis hinunter auf die Fensterbank.', 'Halte den Zollstock dabei an die Wand der Laibung, nicht an den Fensterrahmen. Der Rahmen sitzt meist ein Stück weiter innen, das Maß wäre zu klein.'], tipp: 'Liegt innen eine Fensterbank aus Stein, misst du bis auf ihre Oberfläche. Wie sie eingebaut ist, sieht dein Fensterbauer auf dem Foto.' },
    'element-hoehe': { t: 'Wie messe ich das Fensterelement senkrecht?', x: ['Das Element ist dein bestehendes Fenster samt Rahmen. Senkrecht misst du es in der Mitte, von der Oberkante bis zur Unterkante des Rahmens, so weit du ihn siehst.', 'Bei einer Tür gilt dasselbe bis hinunter auf die Schwelle. Rollladenkasten, Fensterbank und Putz gehören nicht dazu.'], tipp: 'Verdeckt Putz oder eine Leiste einen Teil des Rahmens, miss bis zur sichtbaren Kante und schreib es in die Notiz. Den Rest klärt das Feinaufmaß.' },
    'oeffnung-breite': { t: 'Wie messe ich die Maueröffnung waagerecht?', x: ['Waagerecht misst du die Öffnung auf halber Höhe: von der linken Laibung bis zur rechten, also von Wand zu Wand.', 'Liegen dort Fliesen oder eine Verkleidung, zählt die fertige Oberfläche. Halte den Zollstock gerade, nicht schräg nach oben oder unten.'], tipp: 'Reicht der Zollstock nicht, miss das letzte Stück mit einem zweiten Zollstock oder einem Maßband und zähl beide Werte zusammen.' },
    'element-breite': { t: 'Wie messe ich das Fensterelement waagerecht?', x: ['Das Element misst du auf halber Höhe von der linken bis zur rechten sichtbaren Außenkante des Rahmens. Bei zwei oder drei Flügeln gehört alles dazu, auch die Pfosten dazwischen.', 'Das Maß ist meist ein paar Zentimeter kleiner als die Öffnung. Ist es größer, hast du die Öffnung wahrscheinlich am Rahmen statt an der Laibung gemessen.'], tipp: 'Die App warnt dich, wenn das Element größer ist als die Öffnung oder auffällig klein. Dann lohnt ein zweiter Blick mit dem Zollstock.' },
    raender: { t: 'Warum messe ich auch die Ränder?', x: ['Kaum eine Öffnung ist ganz gerade. Darum misst du die Höhe zusätzlich dicht an der linken und an der rechten Laibung, die Breite dicht unter der Oberkante und dicht über der Fensterbank.', 'Von den drei Maßen je Richtung zählt das kleinste, so wie es der Fensterbauer auch macht. Weichen die Werte stark ab, ist die Öffnung außer Winkel, und er plant dafür etwas mehr Fuge ein.'], tipp: 'Miss jeden Rand wirklich. Zeigt der Zollstock dasselbe wie in der Mitte, tippst du auf „Hier auch … gemessen?“. Abweichungen ab einem Millimeter bitte genau eintragen, genau die braucht dein Fensterbauer.' }
  };
  /* satz 0: die vier Maße (Schritt 3), satz 1: die vier Ränder (Schritt 4); passt: Übersicht „Passt.“ nach dem letzten Rand */
  var mess = { satz: 0, i: 0, cur: '', werte: {}, entwurf: {}, gleich: {}, gleichOk: false, msg: null, cmLive: false, ack: false, ersetzen: false, passt: false, gespeichert: 0, sperre: false, mmOk: 0 }, cmTimer = 0;
  var messBuehne = $('mess-buehne'), messBild = $('mess-bild'), messFeld = $('mess-feld'), messZahl = $('mess-zahl'), messZeile = $('mess-zeile'), messWeiterKnopf = $('mess-weiter');
  var tausend = function (v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var num = function (t) { return parseInt(String(t || '').replace(/[^\d]/g, ''), 10) || 0; };
  var tuer = function () { return !!ART[art].tuer; };
  var ueblich = function (r) { return (UEBLICH[art] || UEBLICH.fenster)[r]; };
  var satzVon = function (z) { return z ? RAND : MESS; };
  /* Beispielmaße je Element wie in den Renderings der App (werkzeuge/render-ergebnis.mjs): Mitte, dann Ränder */
  var BEISPIEL_MASSE = { fenster: [1410, 1350, 1240, 1180, 1405, 1408, 1238, 1236], balkon: [2150, 2110, 900, 860, 2148, 2146, 898, 897], fest: [1250, 1210, 1500, 1450, 1248, 1246, 1498, 1497], hst: [2250, 2210, 3500, 3440, 2248, 2246, 3498, 3497], psk: [2150, 2110, 2000, 1950, 2148, 2146, 1998, 1997], fsw: [2250, 2210, 3500, 3440, 2248, 2246, 3498, 3497] };
  function beispielMasse() { var b = BEISPIEL_MASSE[art] || BEISPIEL_MASSE.fenster; MESS.concat(RAND).forEach(function (x, i) { if (!(mess.werte[x.k] > 0)) mess.werte[x.k] = b[i]; }); }
  var schritt = function () { return satzVon(mess.satz)[mess.i]; };
  var lageVon = function (i) { return (mess.satz ? RAND_LAGE : MESS_LAGE)[art][i]; };
  var wortVon = function () { return mess.satz ? 'Rand' : 'Maß'; };
  function messTitel(st) {
    if (st.rand) return (st.r === 'v' ? 'Höhe ' : 'Breite ') + '<em>' + st.rand + '.</em>';
    var ding = st.wer === 'mo' ? 'der Öffnung' : tuer() ? 'der Tür' : art === 'fest' ? 'des Elements' : 'des Fensters';
    var t = ding.split(' ');
    return (st.r === 'v' ? 'Höhe ' : 'Breite ') + '<em>' + t[0] + '</em> ' + t[1] + '.';
  }
  /* Prüfungen der App: Millimeter, Zentimeter-Verdacht, Spanne, Element gegen Öffnung */
  function pruefe(v, st) {
    /* Ränder: checkRest der App, verglichen mit dem Maß in der Mitte derselben Richtung */
    if (st.rand) {
      var ref = mess.werte[st.r === 'v' ? 'hm' : 'wm'];
      if (!v) return { ok: false, msg: 'Bitte das Maß eintragen oder „Hier auch … gemessen?“ antippen.' };
      if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10 };
      if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen.' };
      if (ref && Math.abs(v - ref) > 60) return { ok: true, warn: Math.abs(v - ref) + '\u00a0mm anders als in der Mitte. Bitte einmal nachmessen.' };
      return { ok: true };
    }
    if (!v) return { ok: false, msg: 'Bitte das Maß in Millimetern eintragen.' };
    if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10 };
    if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen, zum Beispiel 1.230.' };
    if (st.wer === 'el') {
      var o = mess.werte[st.r === 'v' ? 'hm' : 'wm'];
      if (o && v > o + 30) return { ok: true, warn: 'Größer als die Öffnung. Rahmen außen messen oder Maß\u00a0' + (st.r === 'v' ? 1 : 3) + ' (' + tausend(o) + '\u00a0mm) prüfen.' };
      if (o && v < o * 0.6) return { ok: true, warn: 'Sehr klein für diese Öffnung. Bis zur Außenkante des Rahmens messen.' };
    }
    return { ok: true };
  }
  var NB = ' ';
  /* Zentimeter-Verdacht wie in der App; ein bestätigtes Millimetermaß („Nein, 400 mm“) fragt nicht noch einmal */
  var cmFrage = function (v, r) { var u = ueblich(r); if (mess.mmOk && mess.mmOk === v) return false; return v > 0 && v * 10 <= 6000 && ((v < 250 && v * 10 >= 250) || (v < u[0] && v * 10 >= u[0])); };
  /* Bühne, Fassung „große Bühne“ nach dem Gremium (Wunsch des Inhabers, 27.10.2026: mehr Bildfläche, Anfang und Ende deutlich, auch beim
     ersten Mal und für Ältere). Das Bild ist das 3-D-Modell der Wünsche (WebGL, gleiche Materialien und gleiches Licht) in hoher Auflösung,
     zwei Ansichten je Element: schräg wie in den Wünschen für die senkrechten Maße 1 und 2, frontal (Ansicht „front“ der App) für die
     waagerechten Maße 3 und 4, damit die Linie waagerecht steht. Eine feste Kamera je Paar zeigt immer die ganze Öffnung mit Sturz,
     beiden Laibungen und Bank: Öffnung und Rahmen bleiben im selben Maßstab, beim zweiten Maß eines Paares steht das erste blass daneben.
     An beiden Enden zeigt ein Lupen-Etikett genau die Stelle vergrößert, die Zahl steht auf der Linie, „Groß ansehen“ oder ein Tipp aufs
     Bild öffnet die Großansicht. Feld und Etiketten suchen sich eine Lage, die kein Ende, keinen Chip und keinen Knopf verdeckt. */
  var BILD = { w: 2148, h: 1400 }, messSvg = $('mess-linie'), messChip = folien.messen.querySelector('.ez-buehne--mess .ez-glaschip'), messBreite = 0;
  var messNeben = $('mess-neben'), messBildFront = $('mess-bild-front'), messGrossKnopf = $('mess-gross-auf'), grossOffen = false, blendT = 0;
  var hoeheProbe = d.createElement('div'); hoeheProbe.setAttribute('aria-hidden', 'true'); hoeheProbe.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
  d.body.appendChild(hoeheProbe);
  function messPlatzReservieren() {
    /* Titel und Unterzeile aller vier Maße einmal messen und die größte Höhe festhalten: zwischen den Maßen springt nichts */
    var h1 = $('mess-h1'), uz = $('mess-unterzeile'), alt = mess.i, mh = 0, mu = 0;
    h1.style.minHeight = ''; uz.style.minHeight = '';
    MESS.concat(RAND).forEach(function (st) { h1.innerHTML = messTitel(st); uz.textContent = tuer() && st.subTuer ? st.subTuer : st.sub; mh = Math.max(mh, h1.offsetHeight); mu = Math.max(mu, uz.offsetHeight); });
    mess.i = alt; h1.style.minHeight = mh + 'px'; uz.style.minHeight = mu + 'px';
  }
  function messHoeheSetzen() {
    if (grossOffen) return;
    var appR = app.getBoundingClientRect(), H = window.innerWidth >= 760 ? Math.min(hoeheProbe.offsetHeight || window.innerHeight, app.clientHeight || window.innerHeight) : (hoeheProbe.offsetHeight || window.innerHeight);
    var bR = messBuehne.getBoundingClientRect(), kR = folien.messen.querySelector(mess.passt ? '.ez-karte--passt' : '.ez-karte--tasten').getBoundingClientRect(), fH = folien.messen.querySelector('.ez-fuss').offsetHeight;
    var oben = bR.top - appR.top + (app.scrollHeight > app.clientHeight + 2 ? app.scrollTop : 0), rest = kR.bottom - bR.bottom;
    var S = Math.max(112, Math.min(380, Math.floor(H - oben - rest - fH - 6)));
    messBuehne.style.height = S + 'px';
  }
  function schneidet(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function endeText(t) { var i = t.indexOf(' '); return i < 0 ? '<b>' + t + '</b>' : '<b>' + t.slice(0, i) + '</b>' + t.slice(i); }
  var paar = function () { return mess.i < 2 ? 0 : 1; };
  var bildSrc = function (p) { return 'bilder/mess/' + art + (p ? '-front' : '') + '.webp'; };
  /* Feste Kamera je Paar: die ganze Öffnung (Sturz bis Bank, Laibung bis Laibung) füllt 80 Prozent der Höhe oder 86 Prozent der Breite
     (Großansicht 84 und 90); senkrecht steht sie etwas links der Mitte (rechts die Etiketten), waagerecht etwas unter der Mitte (oben die
     Etiketten). Ist die Bühne flacher als das Bild, bleibt die Öffnung ganz, und das Bild läuft an den Seiten in die Wand aus. */
  function kamera(W, S, box, p, gross) {
    var klein = !gross && S < 200;
    var bw = box[2] - box[0], bh = box[3] - box[1], k = Math.min((gross ? 0.84 : 0.8) * S / bh, (gross ? 0.9 : 0.86) * W / bw);
    var cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, zx = p || klein ? W * 0.5 : W * 0.44, zy = S * 0.5;
    var iw = BILD.w * k, ih = BILD.h * k, tx = zx - cx * k, ty = zy - cy * k;
    if (iw >= W) tx = Math.min(0, Math.max(W - iw, tx)); else tx = (W - iw) / 2 + Math.max(-(W - iw) / 2, Math.min((W - iw) / 2, tx - (W - iw) / 2));
    if (ih >= S) ty = Math.min(0, Math.max(S - ih, ty));
    return { k: k, tx: tx, ty: ty };
  }
  /* Ränder senkrecht (Höhe links und rechts): die Kamera stellt die Linie selbst auf 45 Prozent der Breite (Großansicht Mitte), die Öffnung
     läuft zur einen Seite weiter. So stehen die Lupen rechts der Linie frei von Chip und „Groß ansehen“, auch an der linken Laibung. */
  function kameraRand(W, S, box, l, gross) {
    var bh = box[3] - box[1], k = (gross ? 0.8 : 0.74) * S / bh, lx = (l[0] + l[2]) / 2, cy = (box[1] + box[3]) / 2;
    var tx = W * (gross ? 0.5 : 0.45) - lx * k, ty = S * 0.5 - cy * k, iw = BILD.w * k, ih = BILD.h * k;
    if (iw >= W) tx = Math.min(0, Math.max(W - iw, tx));
    if (ih >= S) ty = Math.min(0, Math.max(S - ih, ty));
    return { k: k, tx: tx, ty: ty };
  }
  /* Kamerawechsel auf demselben Bild (Rand 1 → 2, Rand 3 → 4, Rand 4 → „Passt.“): Bild und blasse Mitte gleiten in 200 ms von der alten
     Lage in die neue, nur über transform (Bewegung 2); per Tastatur und bei weniger Bewegung springt es wie bisher */
  function bildGleiten(img, K, W, zieht) {
    var alt = img._K, b = img.style;
    bildSetzen(img, K, W); img._K = { k: K.k, tx: K.tx, ty: K.ty };
    if (!alt || !zieht || ruhig() || !img.classList.contains('ist-an') || !img.animate) return false;
    var s = alt.k / K.k; if (Math.abs(alt.tx - K.tx) < 1 && Math.abs(alt.ty - K.ty) < 1 && Math.abs(s - 1) < 0.002) return false;
    var kurve = { duration: 200, easing: 'cubic-bezier(.77,0,.175,1)' };
    img.animate([{ transformOrigin: '0 0', transform: 'translate(' + (alt.tx - K.tx).toFixed(1) + 'px,' + (alt.ty - K.ty).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')' }, { transformOrigin: '0 0', transform: 'none' }], kurve);
    [messNeben, passtSvg].forEach(function (sv) { if (sv && sv.animate && sv.style.display !== 'none') sv.animate([{ transformOrigin: '0 0', transform: 'translate(' + (alt.tx - K.tx * s).toFixed(1) + 'px,' + (alt.ty - K.ty * s).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')' }, { transformOrigin: '0 0', transform: 'none' }], kurve); });
    return true;
  }
  function bildSetzen(img, K, W) {
    var b = img.style; b.left = K.tx.toFixed(1) + 'px'; b.top = K.ty.toFixed(1) + 'px'; b.width = (BILD.w * K.k).toFixed(1) + 'px'; b.height = (BILD.h * K.k).toFixed(1) + 'px';
    img.classList.toggle('ist-schmal', BILD.w * K.k < W - 1);
  }
  /* Lupe: dasselbe Bild 2,6-fach (Großansicht 2,2-fach) genau um das Linienende, darin die Strichmarke und das Stück Linie nach innen */
  function lupeSetzen(ende, p, nachInnen, K, r, src, winkel) {
    var lupe = ende.querySelector('.ez-lupe__bild'), D = lupe.offsetWidth || 52, kL = K.k * (grossOffen ? 2.2 : 2.6);
    var ix = (p[0] - K.tx) / K.k, iy = (p[1] - K.ty) / K.k;
    lupe.style.backgroundImage = 'url("' + src + '")';
    lupe.style.backgroundSize = (BILD.w * kL).toFixed(1) + 'px ' + (BILD.h * kL).toFixed(1) + 'px';
    lupe.style.backgroundPosition = (D / 2 - ix * kL).toFixed(1) + 'px ' + (D / 2 - iy * kL).toFixed(1) + 'px';
    var z = ende.querySelectorAll('.ez-lupe__marke line'), e = r === 'v' ? [50, nachInnen > 0 ? 100 : 0] : [nachInnen > 0 ? 100 : 0, 50], w = (winkel || 0) * Math.PI / 180, q = r === 'v' ? [50 - 20 * Math.cos(w), 50 - 20 * Math.sin(w), 50 + 20 * Math.cos(w), 50 + 20 * Math.sin(w)] : [50, 30, 50, 70];
    [z[0], z[2]].forEach(function (ln) { ln.setAttribute('x1', 50); ln.setAttribute('y1', 50); ln.setAttribute('x2', e[0]); ln.setAttribute('y2', e[1]); });
    [z[1], z[3]].forEach(function (ln) { ln.setAttribute('x1', q[0]); ln.setAttribute('y1', q[1]); ln.setAttribute('x2', q[2]); ln.setAttribute('y2', q[3]); });
  }
  var linieSetzen = function (ln, A, B) { ln.setAttribute('x1', A[0].toFixed(1)); ln.setAttribute('y1', A[1].toFixed(1)); ln.setAttribute('x2', B[0].toFixed(1)); ln.setAttribute('y2', B[1].toFixed(1)); };
  function messBuehneSetzen(zieht) {
    if (mess.passt) return passtBuehneSetzen(zieht);
    var st = schritt(), l = lageVon(mess.i), gross = grossOffen, p = paar();
    messBuehne.setAttribute('data-wer', st.wer); messBuehne.setAttribute('data-r', st.r);
    var img = p ? messBildFront : messBild, alt = p ? messBild : messBildFront, src = bildSrc(p);
    if (img.getAttribute('src') !== src) img.src = src;
    if (alt.getAttribute('src') !== bildSrc(1 - p)) alt.src = bildSrc(1 - p);
    var W = messBuehne.clientWidth || 390, S = messBuehne.clientHeight || 280, rand = 8;
    messBuehne.classList.toggle('ist-klein', !gross && S < 200);
    var K = mess.satz && st.r === 'v' ? kameraRand(W, S, MESS_RAHMEN[art][p], l, gross) : kamera(W, S, MESS_RAHMEN[art][p], p, gross);
    /* Breite unten: die Linie rückt hoch, so weit das Bild reicht; liegt sie danach im unteren Drittel, wandert „Groß ansehen“ nach oben
       rechts, damit die Zahl unter oder auf der Linie Platz hat */
    var tief = false;
    if (mess.satz && st.r === 'h' && mess.i === 2 && !gross) { var lo = Math.min(l[1], l[3]) * K.k + K.ty; if (lo < 64) K.ty = Math.min(0, K.ty + (64 - lo)); }
    if (mess.satz && st.r === 'h' && mess.i === 3 && !gross) { var ly = Math.max(l[1], l[3]) * K.k + K.ty, ziel = S - 74; if (ly > ziel) K.ty = Math.max(S - BILD.h * K.k, K.ty - (ly - ziel)); tief = Math.max(l[1], l[3]) * K.k + K.ty > S * 0.62; }
    messBuehne.classList.toggle('knopf-oben', tief);
    var gleitet = bildGleiten(img, K, W, zieht && img.classList.contains('ist-an'));
    /* Wechsel der Ansicht (Maß 2 → 3 und zurück): die neue blendet in 220 ms über die alte, die Linie beginnt nach 120 ms */
    var blenden = !img.classList.contains('ist-an') && zieht && !ruhig();
    clearTimeout(blendT); img.classList.toggle('blendet', blenden); alt.classList.toggle('blendet', blenden);
    img.classList.add('ist-an'); alt.classList.remove('ist-an');
    if (blenden) blendT = setTimeout(function () { img.classList.remove('blendet'); alt.classList.remove('blendet'); }, 240);
    /* die blasse Mitte erscheint mit ihrem Bild, nicht über dem alten (Bewegung 1) */
    if (blenden && messNeben.animate) messNeben.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' });
    messBuehne.style.setProperty('--verz', gleitet ? '160ms' : blenden ? '60ms' : '0ms');
    var P = function (x, y) { return [x * K.k + K.tx, y * K.k + K.ty]; }, A = P(l[0], l[1]), B = P(l[2], l[3]);
    [messSvg, messNeben].forEach(function (sv) { sv.setAttribute('viewBox', '0 0 ' + W + ' ' + S); sv.style.width = W + 'px'; sv.style.height = S + 'px'; });
    Array.prototype.forEach.call(messSvg.querySelectorAll('.ez-mass__halo, .ez-mass__linie'), function (ln) { linieSetzen(ln, A, B); });
    /* Beim Rahmenmaß steht die Öffnung desselben Paares blass daneben: der Rahmen liegt sichtbar innen. Bei den Rändern steht das Maß
       der Mitte blass daneben: dort wurde schon gemessen, am Rand kommt dasselbe oder ein wenig anderes heraus */
    var geist = $('mess-geist'), gq = mess.satz ? MESS_LAGE[art][st.r === 'v' ? 0 : 2] : mess.i % 2 ? lageVon(mess.i - 1) : null;
    if (gq) {
      var g = gq, G1 = P(g[0], g[1]), G2 = P(g[2], g[3]), gl = geist.querySelectorAll('line');
      if (st.r === 'h' && !mess.satz) { G1[1] -= 9; G2[1] -= 9; }
      var kap = function (q) { return st.r === 'v' ? [[q[0] - 5, q[1]], [q[0] + 5, q[1]]] : [[q[0], q[1] - 5], [q[0], q[1] + 5]]; };
      linieSetzen(gl[0], G1, G2); linieSetzen(gl[1], G1, G2);
      [[gl[2], gl[3], G1], [gl[4], gl[5], G2]].forEach(function (t) { var k = kap(t[2]); linieSetzen(t[0], k[0], k[1]); linieSetzen(t[1], k[0], k[1]); });
      geist.style.display = '';
    } else geist.style.display = 'none';
    /* Strichelung passend zur Länge: an beiden Strichmarken ein voller Strich */
    var lang = Math.hypot(B[0] - A[0], B[1] - A[1]), nStr = Math.max(2, Math.round((lang + 4) / 10)), strich = (lang - (nStr - 1) * 4) / nStr;
    messSvg.style.setProperty('--strich', strich.toFixed(2) + 'px');
    messSvg.style.setProperty('--a', (st.r === 'v' ? A[1] / S : A[0] / W) * 100 + '%'); messSvg.style.setProperty('--b', (st.r === 'v' ? B[1] / S : B[0] / W) * 100 + '%');
    var wA = st.r === 'v' && !p ? 4.4 : 0, wB = st.r === 'v' && !p && !tuer() ? 9.2 : 0;
    var ka = $('mess-kappe-a'), kb = $('mess-kappe-b'); ka.style.left = A[0] + 'px'; ka.style.top = A[1] + 'px'; kb.style.left = B[0] + 'px'; kb.style.top = B[1] + 'px'; ka.style.rotate = wA + 'deg'; kb.style.rotate = wB + 'deg';
    var en = tuer() && st.endenTuer ? st.endenTuer : st.enden, ea = $('mess-ende-a'), eb = $('mess-ende-b');
    ea.querySelector('.ez-mass__text').innerHTML = endeText(en[0]); eb.querySelector('.ez-mass__text').innerHTML = endeText(en[1]);
    var sR = messBuehne.getBoundingClientRect(), endKast = function (q) { return { x: q[0] - 9, y: q[1] - 9, w: 18, h: 18, g: 6 }; };
    var kastVon = function (el) { var c = el.getBoundingClientRect(); return { x: c.left - sR.left - 4, y: c.top - sR.top - 4, w: c.width + 8, h: c.height + 8 }; };
    var hin;
    /* Kandidaten der Reihe nach; einer, dessen Lage x = null liefert, passt nicht in die Bühne und fällt aus */
    function legen(el, kand, breite) {
      var w = Math.max(el.offsetWidth, breite || 0), h = el.offsetHeight, wahl = null, best = null;
      for (var i = 0; i < kand.length; i++) {
        var k = kand[i], x = k.x(w); if (x === null) continue;
        var r = { x: Math.max(rand, Math.min(W - rand - w, x)), y: Math.max(rand, Math.min(S - rand - h, k.y(h))), w: w, h: h };
        var ue = hin.reduce(function (sum, o) { var a = Math.min(r.x + r.w, o.x + o.w) - Math.max(r.x, o.x), b = Math.min(r.y + r.h, o.y + o.h) - Math.max(r.y, o.y); return sum + (a > 0 && b > 0 ? a * b * (o.g || 1) : 0); }, 0);
        if (!ue) { wahl = { r: r, k: k, n: i }; break; }
        if (!best || ue < best.ue) best = { r: r, k: k, n: i, ue: ue };
      }
      if (!wahl && best) wahl = best;
      if (!wahl) { var k0 = kand[0]; wahl = { r: { x: rand, y: Math.max(rand, Math.min(S - rand - h, k0.y(h))), w: w, h: h }, k: k0, n: 0 }; }
      hin.push(wahl.r); return wahl;
    }
    /* Lupen-Etiketten: senkrecht rechts der Linie auf Höhe der Enden (sonst links, gespiegelt); waagerecht über den Enden, nach außen,
       die Lupe genau über dem Ende (passt es nicht, nach innen); geht es nur mit kurzem Schritt-Chip, fällt „· Messen“ weg */
    var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, R = 0;
    function endenLegen() {
      var lagen = [];
      [[ea, A], [eb, B]].forEach(function (q) {
        var el = q[0], x = q[1][0], y = q[1][1], gegen = q[1] === A ? B : A, innen = st.r === 'v' ? (gegen[1] > y ? 1 : -1) : (gegen[0] > x ? 1 : -1);
        var pad = 4; R = (el.querySelector('.ez-lupe').offsetWidth || 52) / 2;
        var aussen = function (w) { var v = innen > 0 ? x + pad + R - w : x - pad - R; return v < rand - 14 || v + w > W - rand + 14 ? null : v; };
        var innenX = function (w) { return innen > 0 ? x - pad - R : x + pad + R - w; };
        var rechtsK = { x: function () { return x + 16; }, y: function (h) { return y - h / 2; }, sp: false }, linksK = { x: function (w) { var v = x - 16 - w; return mess.satz && mess.i === 0 && v < rand ? null : v; }, y: function (h) { return y - h / 2; }, sp: true };
        var kand = st.r === 'v'
          ? (mess.satz && mess.i === 0 ? [linksK, rechtsK] : [rechtsK, linksK]).concat([{ x: function () { return x + 16; }, y: function (h) { return innen > 0 ? y + 6 : y - 6 - h; }, sp: false }])
          : [{ x: aussen, y: function (h) { return y - 16 - h; }, sp: innen > 0 }, { x: innenX, y: function (h) { return y - 16 - h; }, sp: innen < 0 },
             { x: function (w) { var v = lagen.length ? lagen[0].g.r : null; return innen < 0 && v ? Math.max(x - pad - R, v.x + v.w + 2) : null; }, y: function (h) { return y - 16 - h; }, sp: false },
             { x: aussen, y: function () { return y + 16; }, sp: innen > 0 }, { x: innenX, y: function () { return y + 16; }, sp: innen < 0 }];
        var g = legen(el, kand); g.r.g = 3; lagen.push({ el: el, g: g, p: q[1], innen: innen });
      });
      return lagen;
    }
    var lagen, versuch;
    for (versuch = 0; versuch < 2; versuch++) {
      messChip.classList.toggle('ist-kurz', versuch > 0);
      hin = [kastVon(messChip), endKast(A), endKast(B)]; if (!gross) hin.push(kastVon(messGrossKnopf));
      lagen = endenLegen();
      if (!lagen.some(function (q) { return q.g.n > 0; }) && !schneidet(kastVon(messChip), endKast(A)) && !schneidet(kastVon(messChip), endKast(B))) break;
    }
    lagen.forEach(function (q, n) {
      var r = q.g.r; q.el.style.left = Math.round(r.x) + 'px'; q.el.style.top = Math.round(r.y) + 'px'; q.el.classList.toggle('ist-gespiegelt', q.g.k.sp);
      lupeSetzen(q.el, q.p, q.innen, K, st.r, src, n ? wB : wA);
      /* Lupe und Ende verbinden, wenn sie nicht direkt am Ende sitzt */
      var lr = q.el.querySelector('.ez-lupe').getBoundingClientRect(), cx = lr.left - sR.left + lr.width / 2, cy = lr.top - sR.top + lr.height / 2, ab = Math.hypot(q.p[0] - cx, q.p[1] - cy);
      var fz = [$(n ? 'mess-fuehrung-b' : 'mess-fuehrung-a'), $(n ? 'mess-fuehrung-b-halo' : 'mess-fuehrung-a-halo')], versatz = st.r === 'v' ? Math.abs(cy - q.p[1]) : Math.abs(cx - q.p[0]);
      fz.forEach(function (f) {
        if (versatz > 12 && ab > R + 12) { linieSetzen(f, [q.p[0] + (cx - q.p[0]) / ab * 9, q.p[1] + (cy - q.p[1]) / ab * 9], [cx + (q.p[0] - cx) / ab * (R + 2), cy + (q.p[1] - cy) / ab * (R + 2)]); f.style.display = ''; }
        else f.style.display = 'none';
      });
    });
    /* Die Zahl auf der Linie, mittig wie die Maßzahl einer Zeichnung; Anker an der Linie, damit sie beim Tippen zur Seite wächst und nicht
       wandert. Geprüft mit der größten Breite (fünf Ziffern, „mm“, Haken); ist kein Platz, links neben der Linie oder unter ihr. */
    var FB = Math.max(gross ? 210 : S < 200 ? 160 : 176, messFeld.offsetWidth), unten = Math.max(A[1], B[1]), oben = Math.min(A[1], B[1]), knopfOben = gross ? S : S - 54;
    var f = st.r === 'v'
      ? legen(messFeld, [{ x: function (w) { return mx - w / 2; }, y: function (h) { return my - h / 2; }, anker: function () { return [mx, '-50%']; } },
          { x: function (w) { return mx - 14 - w; }, y: function (h) { return Math.min(my - h / 2, knopfOben - 4 - h); }, anker: function () { return [mx - 14, '-100%']; } },
          { x: function () { return mx + 14; }, y: function (h) { return my - h / 2; }, anker: function () { return [mx + 14, '0']; } }], FB)
      : legen(messFeld, [{ x: function (w) { return mx - w / 2; }, y: function () { return unten + 10; }, anker: function () { return [mx, '-50%']; } },
          { x: function (w) { var kn = gross ? null : kastVon(messGrossKnopf); return kn ? Math.max(mx - w / 2, kn.x + kn.w + 4) : mx - w / 2; }, y: function () { return unten + 10; }, anker: function (r) { return [r.x, '0']; } },
          { x: function (w) { return mx - w / 2; }, y: function () { return Math.max.apply(null, lagen.map(function (q) { return q.g.r.y + q.g.r.h; })) + 12; }, anker: function () { return [mx, '-50%']; } },
          { x: function (w) { var kn = gross ? null : kastVon(messGrossKnopf); return kn && kn.w ? Math.min(mx - w / 2, kn.x - 4 - w) : null; }, y: function () { return Math.max.apply(null, lagen.map(function (q) { return q.g.r.y + q.g.r.h; })) + 8; }, anker: function (r) { return [r.x, '0']; } },
          { x: function (w) { return mx - w / 2; }, y: function (h) { return oben - 14 - h; }, anker: function () { return [mx, '-50%']; } },
          { x: function (w) { return mx - w / 2; }, y: function (h) { return my - h / 2; }, anker: function () { return [mx, '-50%']; } }], FB);
    var an = f.k.anker(f.r), links = an[1] === '-100%' ? an[0] - FB : an[1] === '-50%' ? an[0] - FB / 2 : an[0];
    if (links < rand || links + FB > W - rand) an = [f.r.x, '0'];
    messFeld.style.left = Math.round(an[0]) + 'px'; messFeld.style.top = Math.round(f.r.y) + 'px'; messFeld.style.setProperty('--fx', an[1]);
    $('mess-bildtext').textContent = 'Modell: ' + (st.wer === 'mo' ? 'Maueröffnung' : ART[art].name.replace('‑', '-')) + (p ? ', von vorn' : '') + ', gemessen wird ' + (st.r === 'v' ? 'senkrecht' : 'waagerecht') + ' von „' + en[0] + '“ bis „' + en[1] + '“. Lupen zeigen beide Enden vergrößert.';
    /* Die Linie zieht sich von Ende zu Ende (nach einem Wechsel der Ansicht 120 ms später) */
    messBuehne.classList.remove('zieht');
    if (zieht && !ruhig()) { void messBuehne.offsetWidth; messBuehne.classList.add('zieht'); }
  }
  function messFeldSetzen() {
    var st = schritt(), v = num(mess.cur), leer = !mess.cur, ohne = leer && !!mess.satz;
    messZahl.textContent = ohne ? '' : tausend(leer ? ueblich(st.r)[2] : v);
    messFeld.classList.toggle('is-leer', leer); messFeld.classList.toggle('ist-ohne', ohne);
    messFeld.classList.toggle('is-fehler', !!(mess.msg && (mess.msg.cls === 'fehler' || mess.msg.cls === 'warn')) || v > 6000);
    $('mess-wert').textContent = v ? 'Im Feld: ' + tausend(v) + ' Millimeter' : 'Feld leer';
  }
  /* Kopfsatz einer Meldung fett, der Rest leise; die Texte selbst sind die der App */
  function zweiStufen(t) { var m = t.match(/^(.+?[.)]\.?)\s+(.+)$/); return m ? '<b>' + m[1] + '</b>' + m[2] : '<b>' + t + '</b>'; }
  /* Die Zeile über den Tasten (feste Höhe, die Tasten springen nicht): oben der Hinweis zum Anlegen, darunter Umrechnung oder das
     zuletzt gespeicherte Maß; an ihrer Stelle die Rückfrage, die Warnung („Stimmt so“ klein) oder der Fehler. Die Pille trägt dann die
     sichere Antwort: „Ja, 1.410 mm“ bei Zentimetern, „Korrigieren“ bei einer Warnung. Vorgelesen wird über status(), nicht die Zeile. */
  var pilleArt = 'weiter', pilleSperre = 0, halteT = 0, taubT = 0, gleichBis = 0;
  /* Nach einer Rückfrage oder Warnung ist die Pille kurz taub; solange drückt sie auch nicht sichtbar */
  function taub(ms) { pilleSperre = ms ? Date.now() + ms : 0; clearTimeout(taubT); messWeiterKnopf.classList.toggle('ist-taub', !!ms); if (ms) taubT = setTimeout(function () { messWeiterKnopf.classList.remove('ist-taub'); }, ms); }
  function cmJetzt() { var st = schritt(), v = num(mess.cur), m = mess.msg; return m && m.cm ? m.cm / 10 : (!m && mess.cmLive && cmFrage(v, st.r) ? v : 0); }
  function messZeileSetzen() {
    var st = schritt(), v = num(mess.cur), m = mess.msg, cm = cmJetzt(), html, hinweis = false, warn = false;
    var tipp = '<b class="ez-zeile__hinweis">' + (st.chip === 'nicht' ? 'Nicht am Rahmen messen' : 'Rahmen außen, nicht Flügel') + '</b>';
    var ref = mess.satz ? mess.werte[st.r === 'v' ? 'hm' : 'wm'] : 0, bsp = ref || ueblich(st.r)[2], vorher = mess.i ? mess.werte[satzVon(mess.satz)[mess.i - 1].k] : 0;
    var weg = mess.i < 3 ? 'Weiter zu ' + wortVon() + NB + (mess.i + 2) + '.' : mess.satz ? 'Weiter zur Übersicht.' : 'Weiter zu den Rändern.';
    if (mess.gespeichert) html = '<p class="ez-zeile__text"><b>Gespeichert: ' + tausend(mess.gespeichert) + NB + 'mm</b>' + weg + '</p>';
    else if (m && m.cls === 'warn') { hinweis = warn = true; html = '<p class="ez-zeile__text">' + zweiStufen(m.text) + '</p><button type="button" class="ez-zeile__knopf" id="mess-stimmt">Stimmt so</button>'; }
    else if (cm) { hinweis = true; html = '<p class="ez-zeile__text"><b>Zollstock zeigt ' + cm + NB + 'cm?</b>Bei ' + cm + ',5' + NB + 'cm: ' + tausend(cm * 10 + 5) + ' tippen</p>' + (cm >= 250 ? '<button type="button" class="ez-zeile__knopf" id="mess-nein">Nein, ' + tausend(cm) + NB + 'mm</button>' : ''); }
    else if (m && m.cls === 'fehler') { hinweis = true; html = '<p class="ez-zeile__text">' + zweiStufen(m.text) + '</p>'; }
    else if (v > 6000) { hinweis = true; html = '<p class="ez-zeile__text"><b>Höchstens 6.000' + NB + 'mm.</b>Bitte in Millimetern.</p>'; }
    else if (ref && !mess.cur) html = '<button type="button" class="ez-zeile__gleich' + (Date.now() < gleichBis && !ruhig() ? ' ist-spaet' : '') + '" id="mess-gleich" data-v="' + ref + '"><i aria-hidden="true"></i>Hier auch ' + tausend(ref) + NB + 'mm gemessen?<small>' + String(ref / 10).replace('.', ',') + NB + 'cm</small></button>';
    else if (v && mess.ersetzen) html = '<p class="ez-zeile__text">' + tipp + 'Bisher: ' + tausend(v) + NB + 'mm. Tippen ersetzt das Maß.</p>';
    else if (v >= 250) html = '<p class="ez-zeile__text ez-zeile__text--wert"><b>=' + NB + String(Math.round(v) / 10).replace('.', ',') + NB + 'cm</b><span class="ez-zeile__leise">' + (st.chip === 'nicht' ? 'Nicht am Rahmen messen' : 'Rahmen außen, nicht Flügel') + '</span></p>';
    else if (vorher) html = '<p class="ez-zeile__text">' + tipp + wortVon() + NB + mess.i + ' gespeichert: ' + tausend(vorher) + NB + 'mm</p>';
    else html = '<p class="ez-zeile__text">' + tipp + 'In Millimetern: ' + String(bsp / 10).replace('.', ',') + NB + 'cm = ' + tausend(bsp) + NB + 'mm</p>';
    var hKey = html.replace(' ist-spaet', ''); if (messZeile._h !== hKey) { messZeile._h = hKey; messZeile.innerHTML = html; }
    messZeile.classList.toggle('ist-hinweis', hinweis); messZeile.classList.toggle('ist-warnung', warn); messZeile.setAttribute('data-wer', st.wer);
    messBuehne.classList.toggle('ist-warn', warn);
    pilleSetzen(cm ? 'ja' : warn ? 'korr' : 'weiter', cm);
  }
  /* Knöpfe der Zeile einmal per Delegation gebunden (kein doppelter Aufruf) */
  messZeile.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button'); if (!t || mess.sperre) return;
    if (t.id === 'mess-stimmt') { messWeiterKnopf.focus({ preventScroll: true }); if (mess.msg && mess.msg.alle) mess.gleichOk = true; mess.ack = true; messWeiter(e.detail === 0); }
    else if (t.id === 'mess-gleich') { if (Date.now() < gleichBis) return; gleichBis = Date.now() + 1050; messWeiterKnopf.focus({ preventScroll: true }); mess.cur = t.getAttribute('data-v'); mess.ack = true; mess.msg = null; mess.gleich[schritt().k] = true; messFeldSetzen(); messWeiter(e.detail === 0); }
    else if (t.id === 'mess-nein') { messWeiterKnopf.focus({ preventScroll: true }); mess.mmOk = num(mess.cur); mess.cmLive = false; mess.msg = null; messWeiter(e.detail === 0); }
  });
  function pilleSetzen(artNeu, cm) {
    var label = artNeu === 'ja' ? 'Ja, ' + tausend(cm * 10) + NB + 'mm' : artNeu === 'korr' ? (mess.msg && mess.msg.alle ? 'Nachmessen' : 'Korrigieren') : mess.passt ? 'Weiter zum Ergebnis' : mess.i < 3 ? 'Weiter zu ' + wortVon() + NB + (mess.i + 2) : mess.satz ? 'Fertig' : 'Weiter zu den Rändern';
    var wort = messWeiterKnopf.querySelector('.ez-weiter__wort'), neu = artNeu !== pilleArt;
    pilleArt = artNeu; messWeiterKnopf.setAttribute('data-cm', cm ? cm * 10 : ''); messWeiterKnopf.setAttribute('data-art', artNeu);
    if (wort.textContent !== label) wort.textContent = label;
    /* Neue Bedeutung sichtbar machen: das Wort blendet in 160 ms ein (nicht bei weniger Bewegung) */
    if (neu && !ruhig() && wort.animate) wort.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  function pilleTippen(ausTastatur) {
    if (Date.now() < pilleSperre || mess.sperre) return;
    if (mess.passt) return ergVorladen(function () { zeigeFolie('ergebnis', 1); });
    if (pilleArt === 'ja') { mess.cur = messWeiterKnopf.getAttribute('data-cm'); mess.msg = null; mess.cmLive = false; return messWeiter(ausTastatur); }
    if (pilleArt === 'korr' && mess.msg && mess.msg.alle) { mess.msg = null; mess.ack = false; RAND.forEach(function (x) { mess.gleich[x.k] = false; }); mess.i = 0; mess.cur = String(mess.werte[schritt().k]); mess.ersetzen = true; taub(450); messAlles(!ausTastatur); status('Rand 1 von 4: ' + messTitelText() + ' Bitte nachmessen; Tippen ersetzt das Maß.'); return; }
    if (pilleArt === 'korr') { mess.cur = ''; mess.msg = null; mess.ack = false; taub(450); messFeldSetzen(); messZeileSetzen(); status('Feld geleert. Bitte neu messen und eintippen.'); return; }
    messWeiter(ausTastatur);
  }
  function messFussSetzen() {
    var st = schritt(), nr = mess.satz ? 4 : 3;
    var zur = mess.passt || (mess.i && mess.satz) ? 'Voriger Rand' : mess.i ? 'Voriges Maß' : mess.satz ? 'Zurück zum Messen' : 'Zurück zu den Fotos';
    $('mess-zurueck').setAttribute('aria-label', zur); folien.messen.querySelector('[data-mess-zurueck]').setAttribute('aria-label', zur);
    $('mess-l').textContent = wortVon() + NB + (mess.i + 1) + NB + 'von' + NB + '4';
    Array.prototype.forEach.call($('mess-kapseln').children, function (k, n) { k.className = n < mess.i || mess.passt ? 'ist-fertig' : n === mess.i ? 'ist-dran' : ''; });
    /* Schritt 3 „Messen“ und Schritt 4 „Ränder“ teilen sich die Folie; Chip, Ring und Notiz zeigen, wo man steht */
    $('mess-chip-text').textContent = 'Schritt' + NB + nr + ' von' + NB + '6'; $('mess-chip-ring').style.setProperty('--anteil', (nr / 6).toFixed(3));
    folien.messen.setAttribute('aria-label', mess.satz ? 'Schritt 4 von 6: Ränder' : 'Schritt 3 von 6: Messen');
    notizZeigen(mess.satz ? 'raender' : 'messen');
    var pw = mess.passt ? passtWerte() : null, unter = pw ? (pw.dev > 10 ? 'Bis ' + pw.dev + NB + 'mm außer Winkel. Das kleinste Maß zählt.' : 'Deine Öffnung ist gerade.') : tuer() && st.subTuer ? st.subTuer : st.sub;
    $('mess-h1').innerHTML = pw ? 'Passt.' : messTitel(st); $('mess-gross-titel').innerHTML = messTitel(st);
    $('mess-unterzeile').textContent = unter; $('mess-gross-unter').textContent = tuer() && st.subTuer ? st.subTuer : st.sub;
    var gl = MESS_GLOSS[st.g]; $('mess-erkl-titel').textContent = gl.t;
    $('mess-erkl-text').innerHTML = gl.x.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '<p class="ez-bogen__tipp"><b>Tipp:</b> ' + gl.tipp + '</p>';
  }
  /* erst die Zahl setzen, dann die Bühne: die Lage des Feldes rechnet mit seiner echten Breite */
  function messAlles(zieht) { messFussSetzen(); messFeldSetzen(); messBuehneSetzen(zieht); messZeileSetzen(); }
  var messTitelText = function () { return $('mess-h1').textContent; };
  function messZeigen() {
    /* beide Ansichten vorab laden und dekodieren, damit der Wechsel zu Maß 3 nicht auf das Bild wartet */
    [messBild, messBildFront].forEach(function (img, p) { if (img.getAttribute('src') !== bildSrc(p)) img.src = bildSrc(p); if (img.decode) img.decode().catch(function () {}); });
    requestAnimationFrame(function () { messPlatzReservieren(); messFussSetzen(); messHoeheSetzen(); messBreite = app.clientWidth; messHoehe = hoeheProbe.offsetHeight; messAlles(false); });
  }
  /* Halten nach dem Speichern beenden und zum nächsten Maß (auch wenn schon die nächste Ziffer kommt) */
  function naechstes(ausTastatur) {
    clearTimeout(halteT); if (!mess.sperre) return;
    mess.gespeichert = 0; mess.sperre = false; messFeld.classList.remove('ist-gespeichert');
    if (mess.i === 3 && mess.satz) return passtZeigen(ausTastatur);
    /* nach Maß 4 geht es ohne Halt zu den Rändern (Schritt 4), wie in der App mit „Weiter zu den Rändern“ */
    var neuerSatz = mess.i === 3; if (neuerSatz) { mess.satz = 1; mess.i = 0; } else mess.i++;
    var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : (mess.entwurf[schritt().k] || ''); mess.ersetzen = !!w; mess.mmOk = 0;
    messAlles(!ausTastatur);
    status((neuerSatz ? 'Schritt 4 von 6, Ränder. ' : '') + wortVon() + ' ' + (mess.i + 1) + ' von 4: ' + messTitelText() + ' ' + $('mess-unterzeile').textContent);
  }
  /* Tippen: die Ziffer steht sofort im Feld; nach einer Pause von 0,8 s fragt die Zeile nach Zentimetern (wie in der App, auch in der ruhigen Fassung) */
  function messTaste(t, ausTastatur) {
    if (mess.sperre) naechstes(ausTastatur);
    if (mess.passt) return;
    if (mess.satz) mess.gleich[schritt().k] = false;
    if (t === 'del') { if (mess.ersetzen) { mess.cur = ''; mess.ersetzen = false; } else mess.cur = mess.cur.slice(0, -1); }
    else { if (mess.ersetzen) { mess.cur = ''; mess.ersetzen = false; } if (mess.cur.length < 5 && !(mess.cur === '' && t === '0')) mess.cur += t; }
    /* Eine neue Ziffer ist eine bewusste Eingabe: die Sperre gegen den Doppeltipp fällt */
    mess.msg = null; mess.ack = false; mess.cmLive = false; clearTimeout(cmTimer); taub(0);
    var v = num(mess.cur);
    if (cmFrage(v, schritt().r)) cmTimer = setTimeout(function () { mess.cmLive = true; taub(450); messZeileSetzen(); status('Zollstock zeigt ' + v + ' Zentimeter? Dann Ja, ' + tausend(v * 10) + ' Millimeter.'); }, 800);
    messFeldSetzen(); messZeileSetzen();
  }
  /* Weiter: prüfen, speichern, die gespeicherte Zahl kurz zeigen (0,35 s, auch in der ruhigen Fassung), dann das nächste Maß */
  function messWeiter(ausTastatur) {
    if (mess.sperre) return;
    var st = schritt(), v = num(mess.cur), chk = pruefe(v, st);
    if (mess.mmOk && mess.mmOk === v && chk.cm) chk = { ok: true };
    /* Rückfrage oder Warnung nach „Weiter“: die Pille bekommt eine neue Bedeutung und ist 0,45 s taub, damit ein Doppeltipp sie nicht auslöst */
    if (!chk.ok) { mess.msg = chk.cm ? { cm: chk.cm } : { cls: 'fehler', text: chk.msg }; taub(450); messFeldSetzen(); messZeileSetzen(); status(chk.cm ? 'Zollstock zeigt ' + chk.cm / 10 + ' Zentimeter? Dann Ja, ' + tausend(chk.cm) + ' Millimeter.' : chk.msg); return; }
    if (chk.warn && !mess.ack) { mess.msg = { cls: 'warn', text: chk.warn }; taub(450); messFeldSetzen(); messZeileSetzen(); status(chk.warn + ' Korrigieren oder Stimmt so.'); return; }
    /* Fensterbauer (Gremium, Muss): alle vier Ränder genau wie die Mitte übernommen ist selten; einmal fragen, bevor „Passt.“ kommt */
    if (mess.satz && mess.i === 3 && !mess.gleichOk && RAND.every(function (x) { return mess.gleich[x.k]; })) {
      mess.msg = { cls: 'warn', alle: true, text: 'Alle vier genau wie die Mitte? Das ist selten. Bitte einmal nachmessen.' }; mess.werte[st.k] = v; taub(450); messFeldSetzen(); messZeileSetzen(); status(mess.msg.text + ' Nachmessen oder Stimmt so.'); return;
    }
    mess.werte[st.k] = v; delete mess.entwurf[st.k]; mess.msg = null; mess.ack = false; mess.cmLive = false; clearTimeout(cmTimer);
    $('mess-kapseln').children[mess.i].className = 'ist-fertig';
    mess.cur = String(v); mess.gespeichert = v; mess.sperre = true; messFeld.classList.add('ist-gespeichert'); messFeldSetzen(); messZeileSetzen();
    status('Gespeichert: ' + tausend(v) + ' Millimeter.');
    halteT = setTimeout(function () { naechstes(ausTastatur); }, 350);
  }
  function messZurueck(e) {
    var tastatur = !!(e && e.detail === 0);
    if (mess.sperre) naechstes(true);
    clearTimeout(cmTimer); mess.msg = null; mess.ack = false; mess.cmLive = false;
    if (mess.passt) return passtVerlassen(tastatur);
    if (mess.i === 0 && !mess.satz) return zeigeFolie('fotos', -1);
    /* ein getipptes, noch nicht gespeichertes Maß bleibt als Entwurf stehen */
    if (mess.cur && !mess.ersetzen) mess.entwurf[schritt().k] = mess.cur;
    if (mess.i === 0) { mess.satz = 0; mess.i = 3; } else mess.i--;
    var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : ''; mess.ersetzen = !!w; mess.mmOk = 0; messAlles(!tastatur);
    status(wortVon() + ' ' + (mess.i + 1) + ' von 4: ' + messTitelText() + (w ? ' Bisher ' + tausend(w) + ' Millimeter, Tippen ersetzt das Maß.' : ' ' + $('mess-unterzeile').textContent));
  }
  /* „Passt.“ nach dem vierten Rand (wie in der App): das Modell von vorn mit allen sechs Maßen der Öffnung; die kleinsten je Richtung
     stehen kräftig mit ihrem Wert (sie zählen), die übrigen blass. Auf der Karte das Maß, das zählt, das Element mit Rahmen und je Richtung
     die drei Messungen als Kapselreihe; die Längen sind überhöht wie in der App (das kleinste 56 Prozent, das größte voll) */
  function notizZeigen(name) { Array.prototype.forEach.call(d.querySelectorAll('.ez-notiz__folie'), function (n) { n.hidden = n.getAttribute('data-fuer') !== name; }); }
  function passtWerte() {
    var W = mess.werte, br = [W.wt, W.wm, W.wb], ho = [W.hl, W.hm, W.hr];
    var moW = Math.min.apply(null, br), moH = Math.min.apply(null, ho);
    return { br: br, ho: ho, moW: moW, moH: moH, dev: Math.max(Math.max.apply(null, br) - moW, Math.max.apply(null, ho) - moH), elW: W.w, elH: W.h };
  }
  var passtSvg = $('mess-passt');
  function passtBuehneSetzen(zieht) {
    var W = messBuehne.clientWidth || 390, S = messBuehne.clientHeight || 280, K = kamera(W, S, MESS_RAHMEN[art][1], 1, false), pw = passtWerte();
    bildGleiten(messBildFront, K, W, zieht); messBildFront.classList.add('ist-an'); messBild.classList.remove('ist-an'); messBildFront.classList.remove('blendet'); messBild.classList.remove('blendet');
    messBuehne.setAttribute('data-wer', 'mo'); messBuehne.classList.remove('ist-klein', 'ist-warn', 'zieht');
    passtSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + S); passtSvg.style.width = W + 'px'; passtSvg.style.height = S + 'px';
    var P = function (x, y) { return [x * K.k + K.tx, y * K.k + K.ty]; }, werte = pw.br.concat(pw.ho), gruppen = passtSvg.querySelectorAll('g');
    var schild = [$('passt-schild-b'), $('passt-schild-h')], gesetzt = [false, false], ecken = PASST_LAGE[art].map(function (l) { return [P(l[0], l[1]), P(l[2], l[3])]; });
    PASST_LAGE[art].forEach(function (l, n) {
      var A = ecken[n][0], B = ecken[n][1], r = n < 3 ? 0 : 1, min = r ? pw.moH : pw.moW, zaehlt = werte[n] === min, g = gruppen[n];
      g.classList.toggle('ist-zaehlt', zaehlt); g.style.setProperty('--n', n);
      linieSetzen(g.querySelector('.ez-passt__halo'), A, B); linieSetzen(g.querySelector('.ez-passt__linie'), A, B);
      /* Kappen wie bei den Rändern: 14 px für das Maß, das zählt, 10 px blass (Zeichen 6 und 7); Strichelung passend zur Länge, an beiden
         Enden ein voller Strich */
      var hk = (zaehlt ? 14 : 10) / 2, kap = function (q) { return r ? [[q[0] - hk, q[1]], [q[0] + hk, q[1]]] : [[q[0], q[1] - hk], [q[0], q[1] + hk]]; }, kl = g.querySelectorAll('.ez-passt__kappe, .ez-passt__kappe-halo');
      Array.prototype.forEach.call(kl, function (ln, i) { var k = kap(i % 2 ? B : A); linieSetzen(ln, k[0], k[1]); });
      var lang = Math.hypot(B[0] - A[0], B[1] - A[1]), luecke = 4, soll = zaehlt ? 6 : 4, nStr = Math.max(2, Math.round((lang + luecke) / (soll + luecke)));
      g.style.setProperty('--strich', ((lang - (nStr - 1) * luecke) / nStr).toFixed(2) + 'px');
      if (!zaehlt || gesetzt[r]) return;
      gesetzt[r] = true; var sc = schild[r]; sc.querySelector('b').textContent = tausend(min);
      /* Das Schild steht auf seiner Linie, aber nie auf einer Linie der anderen Richtung (Zeichen 6): 27, 73, 15 oder 85 Prozent */
      var w = sc.offsetWidth, h = sc.offsetHeight, quer = ecken.filter(function (e, m) { return (m < 3 ? 0 : 1) !== r; }), lage = null;
      [0.27, 0.73, 0.15, 0.85, 0.5].some(function (t) {
        var x = r ? A[0] - w / 2 : A[0] + (B[0] - A[0]) * t - w / 2, y = r ? A[1] + (B[1] - A[1]) * t - h / 2 : A[1] - h / 2;
        x = Math.max(8, Math.min(W - 8 - w, x)); y = Math.max(8, Math.min(S - 8 - h, y)); lage = lage || [x, y];
        var frei = !quer.some(function (e) { return r ? (e[0][1] > y - 4 && e[0][1] < y + h + 4) : (e[0][0] > x - 4 && e[0][0] < x + w + 4); });
        if (frei) lage = [x, y]; return frei;
      });
      sc.style.left = Math.round(lage[0]) + 'px'; sc.style.top = Math.round(lage[1]) + 'px';
    });
    $('mess-bildtext').textContent = 'Modell von vorn mit allen sechs Maßen der Öffnung. Es zählt das kleinste: Breite ' + tausend(pw.moW) + ' Millimeter, Höhe ' + tausend(pw.moH) + ' Millimeter.';
    passtSvg.classList.remove('zieht'); if (zieht && !ruhig()) { void passtSvg.getBoundingClientRect(); passtSvg.classList.add('zieht'); }
  }
  function passtSpalte(id, reihen) {
    var vs = reihen.map(function (x) { return x[1]; }), lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs);
    $(id).innerHTML = reihen.map(function (x, i) {
      return '<p class="ez-passt__reihe' + (hi > lo && vs[i] === lo ? ' ist-klein' : '') + '" style="--l:' + (hi > lo ? Math.round(56 + 44 * (vs[i] - lo) / (hi - lo)) : 100) + '%;--n:' + i + '"><span>' + x[0] + '</span><i></i><b>' + tausend(vs[i]) + '</b></p>';
    }).join('');
  }
  function passtKarteSetzen() {
    var pw = passtWerte();
    $('passt-zahl').textContent = tausend(pw.moW) + ' × ' + tausend(pw.moH);
    $('passt-el-name').textContent = artNameVon() + ' mit Rahmen'; $('passt-el').textContent = tausend(pw.elW) + ' × ' + tausend(pw.elH);
    passtSpalte('passt-breite', [['oben', pw.br[0]], ['Mitte', pw.br[1]], ['unten', pw.br[2]]]);
    passtSpalte('passt-hoehe', [['links', pw.ho[0]], ['Mitte', pw.ho[1]], ['rechts', pw.ho[2]]]);
    $('passt-fuss').textContent = pw.dev ? 'Höchstens ' + pw.dev + NB + 'mm Unterschied, überhöht gezeichnet.' : 'Alle drei Maße sind gleich.';
  }
  var passtKarte = folien.messen.querySelector('.ez-karte--passt');
  function passtZeigen(ausTastatur) {
    mess.passt = true; mess.cur = ''; mess.ersetzen = false; mess.msg = null;
    folien.messen.classList.add('ist-passt'); passtKarteSetzen();
    messFussSetzen(); messHoeheSetzen(); messBuehneSetzen(!ausTastatur); pilleSetzen('weiter'); if (!ausTastatur) taub(450);
    passtKarte.classList.remove('kommt'); if (!ausTastatur && !ruhig()) { void passtKarte.offsetWidth; passtKarte.classList.add('kommt'); }
    ergVorladen();
    var pw = passtWerte(); status('Passt. ' + $('mess-unterzeile').textContent + ' Maueröffnung ' + tausend(pw.moW) + ' mal ' + tausend(pw.moH) + ' Millimeter.');
  }
  function passtVerlassen(tastatur) {
    mess.passt = false; folien.messen.classList.remove('ist-passt'); passtKarte.classList.remove('kommt');
    mess.i = 3; var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : ''; mess.ersetzen = !!w; mess.mmOk = 0;
    messFussSetzen(); messHoeheSetzen(); messAlles(!tastatur);
    status('Rand 4 von 4: ' + messTitelText() + (w ? ' Bisher ' + tausend(w) + ' Millimeter, Tippen ersetzt das Maß.' : ''));
  }
  /* Großansicht: „Groß ansehen“ oder ein Tipp aufs Bild zeigt dieselbe Bühne bildschirmfüllend, mit Frage und Anleitung. Schließen nur
     mit ×, Esc oder „Zurück zum Eintippen“ (ein Tipp aufs Bild schließt nicht: Doppeltipp und genaues Hinsehen werfen nicht heraus).
     Am Schreibtisch liegt sie genau auf dem Bildschirm des Geräts; ein Platzhalter hält die Folie dahinter ruhig. */
  var gross = $('mess-gross'), grossPlatz = $('mess-gross-platz'), buehneHeim = messBuehne.parentNode, buehneVor = messBuehne.nextElementSibling, platzhalter = d.createElement('div');
  platzhalter.setAttribute('aria-hidden', 'true');
  function grossRechteck() {
    var aR = app.getBoundingClientRect(), aufGeraet = aR.width < window.innerWidth - 40;
    gross.style.cssText = aufGeraet ? 'left:' + aR.left + 'px;top:' + aR.top + 'px;width:' + aR.width + 'px;height:' + aR.height + 'px;border-radius:' + getComputedStyle(app).borderTopLeftRadius : '';
  }
  function grossAuf(tastatur) {
    if (grossOffen || !gross.showModal || mess.passt) return;
    if (mess.sperre) naechstes(true);
    grossOffen = true; grossRechteck();
    platzhalter.style.height = messBuehne.offsetHeight + 'px'; buehneHeim.insertBefore(platzhalter, messBuehne);
    grossPlatz.appendChild(messBuehne); messBuehne.classList.add('ist-gross'); messBuehne.classList.remove('zieht');
    gross.classList.remove('kommt'); gross.showModal(); messBuehneSetzen(false);
    /* Auftritt erst nach dem Rechnen der Lagen (sonst rechnet es im skalierten Zustand); Tastatur ohne Auftritt */
    if (!tastatur && !ruhig()) requestAnimationFrame(function () { gross.classList.add('kommt'); });
    status('Großansicht: ' + messTitelText() + ' Schließen mit Escape oder „Zurück zum Eintippen“.');
  }
  function grossZu() {
    if (!grossOffen) return;
    grossOffen = false; gross.classList.remove('kommt'); if (gross.open) gross.close();
    buehneHeim.insertBefore(messBuehne, platzhalter); if (platzhalter.parentNode) platzhalter.parentNode.removeChild(platzhalter);
    messBuehne.classList.remove('ist-gross');
    messHoeheSetzen(); messBuehneSetzen(false);
    messWeiterKnopf.focus({ preventScroll: true });
  }
  messBuehne.addEventListener('click', function (e) { if (grossOffen || mess.passt || folien.messen.hidden || (e.target.closest && e.target.closest('#mess-feld'))) return; grossAuf(e.detail === 0); });
  gross.addEventListener('cancel', function (e) { e.preventDefault(); grossZu(); });
  gross.addEventListener('close', grossZu);
  gross.querySelectorAll('[data-gross-zu]').forEach(function (b) { b.addEventListener('click', grossZu); });
  /* Tasten: Druck sichtbar per Klasse (Touch zeigt :active unzuverlässig), keine Fokusübernahme bei Mausklick (Enter heißt am Rechner „Weiter“) */
  var tastenFeld = folien.messen.querySelector('.ez-tasten'), gedrueckt = null;
  function loslassen() { if (gedrueckt) { gedrueckt.classList.remove('ist-gedrueckt'); gedrueckt = null; } }
  tastenFeld.addEventListener('pointerdown', function (e) { var k = e.target.closest('.ez-taste[data-taste]'); tastenFeld.classList.remove('ist-tastatur'); loslassen(); if (k) { gedrueckt = k; k.classList.add('ist-gedrueckt'); } });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { tastenFeld.addEventListener(n, loslassen); });
  tastenFeld.addEventListener('mousedown', function (e) { if (e.target.closest('.ez-taste')) e.preventDefault(); });
  folien.messen.querySelectorAll('.ez-taste[data-taste]').forEach(function (b) { b.addEventListener('click', function () { messTaste(b.getAttribute('data-taste')); }); });
  messWeiterKnopf.addEventListener('click', function (e) { pilleTippen(e.detail === 0); });
  $('mess-zurueck').addEventListener('click', messZurueck);
  folien.messen.querySelector('[data-mess-zurueck]').addEventListener('click', messZurueck);
  bogenBinden($('mess-erkl'), $('mess-i'));
  /* Tastatur am Rechner: Ziffern, Rücktaste, Eingabe (wie die Pille); die passende Taste drückt sichtbar mit, ohne Übergang */
  d.addEventListener('keydown', function (e) {
    if (folien.messen.hidden || offenerBogen || grossOffen || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    var taste = /^[0-9]$/.test(e.key) ? e.key : e.key === 'Backspace' ? 'del' : null;
    if (taste) { e.preventDefault(); tastenFeld.classList.add('ist-tastatur'); loslassen(); gedrueckt = tastenFeld.querySelector('[data-taste="' + taste + '"]'); if (gedrueckt) gedrueckt.classList.add('ist-gedrueckt'); messTaste(taste, true); }
    else if (e.key === 'Enter' && (!t || !t.closest || !t.closest('button, a'))) { e.preventDefault(); if (!e.repeat) pilleTippen(true); }
  });
  d.addEventListener('keyup', function () { if (tastenFeld.classList.contains('ist-tastatur')) loslassen(); });
  /* Größe: gebündelt; neu gerechnet wird bei anderer Breite oder anderer kleiner Bildschirmhöhe (100svh, die Adressleiste ändert sie
     nicht), in der Großansicht auch deren Rechteck am Schreibtisch */
  var groesseRaf = 0, messHoehe = 0;
  window.addEventListener('resize', function () {
    if (folien.messen.hidden || groesseRaf) return;
    groesseRaf = requestAnimationFrame(function () {
      groesseRaf = 0; var b = app.clientWidth, h = hoeheProbe.offsetHeight;
      if (b === messBreite && h === messHoehe && !grossOffen) return; messBreite = b; messHoehe = h;
      if (grossOffen) grossRechteck(); else { messPlatzReservieren(); messFussSetzen(); messHoeheSetzen(); }
      messBuehneSetzen(false);
    });
  });

  /* ---------- Folie 5: Ergebnis ----------
     Werte, Texte und Prüfungen aus SCREENS.ergebnis der App. Das Modell ist dasselbe in der Ansicht „result“ der App (WebGL, Faktor 6),
     die vier Maße stehen wie dort als Linien am Modell: Öffnung Koralle gestrichelt links und oben außen, Element Violett innen; der Wert
     hängt an seiner Linie (G9). Darunter je Wert eine Anthrazit-Kachel mit ihrem Hinweis („kleinstes von 3“, „sichtbar mit Rahmen“), dann
     „Maße gegen Foto“ (nur mit KI-Befund), „Aus deinen Fotos“ und „Falls zur Hand“ auf Weiß. Die Lagen erzeugt werkzeuge/render-ergebnis.mjs. */
  var ERG_LAGE = {"fenster":{"hm":[719,360,719,1400],"wm":[719,360,1619,379],"eh":[1622.6,408.6,1613.4,1448.2],"ew":[770.9,1388.4,1613.4,1448.2]},"balkon":{"hm":[866,360,866,1416],"wm":[866,360,1286,368],"eh":[1291.7,381.4,1288.5,1439.3],"ew":[886.6,1410.1,1288.5,1439.3]},"fest":{"hm":[733,391,733,1355],"wm":[733,391,1876,418],"eh":[1880.4,437.8,1868.1,1417.4],"ew":[778.8,1341.9,1868.1,1417.4]},"hst":{"hm":[733,508,733,1247],"wm":[733,508,1875,541],"eh":[1872.3,543.9,1861.8,1315.5],"ew":[747.0,1243.4,1861.8,1315.5]},"psk":{"hm":[724,368,724,1399],"wm":[724,368,1676,380],"eh":[1676.7,387.6,1667.0,1457.8],"ew":[750.6,1393.0,1667.0,1457.8]},"fsw":{"hm":[734,502,734,1244],"wm":[734,502,1875,536],"eh":[1872.3,543.9,1861.8,1315.5],"ew":[747.0,1243.4,1861.8,1315.5]}};
  var ERG_BILD = { w: 2148, h: 1800 }, ergBuehne = $('erg-buehne'), ergBild = $('erg-bild'), ergLinien = $('erg-linien'), ergBreite = 0, massOk = false, ergZoom = 1;
  var artNameVon = function () { return tuer() ? 'Tür' : art === 'fest' ? 'Festverglasung' : 'Fenster'; };
  var elNameVon = function () { return tuer() ? 'Türelement' : art === 'fest' ? 'Element' : 'Fensterelement'; };
  function ergWerte() { var pw = passtWerte(); return { moW: pw.moW, moH: pw.moH, elW: pw.elW, elH: pw.elH, dev: pw.dev, hm: pw.moH, wm: pw.moW, eh: pw.elH, ew: pw.elW }; }
  /* Kamera: die vier Linien mit Platz für ihre Werte (links und oben außen) füllen die Bühne; das Bild bleibt an den Rändern in der Wand */
  function ergKamera(W, S, L) {
    var xs = [], ys = []; Object.keys(L).forEach(function (k) { xs.push(L[k][0], L[k][2]); ys.push(L[k][1], L[k][3]); });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys), bw = x1 - x0, bh = y1 - y0;
    /* links neben der Höhe der Öffnung braucht ihr Wert etwa 100 px: breite Elemente werden dafür etwas kleiner und rücken nach rechts */
    /* oben der Schritt-Chip (bis 48 px), unten „Zum Drehen ziehen“ und die Rundknöpfe (62 px): das Modell steht dazwischen, damit kein Wert
       unter einem Knopf liegt (Zeichen 1, UX) */
    var k = Math.min((S - 110) / bh, 0.66 * W / bw, (W - 116) / bw), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    var tx = W * 0.54 - cx * k, ty = 48 + (S - 110) / 2 - cy * k;
    if (x0 * k + tx < 104) tx = 104 - x0 * k;
    /* Zoom der App (− und +): um die Mitte der Bühne, das Bild bleibt in der Bühne */
    if (ergZoom > 1) { tx = W / 2 - (W / 2 - tx) * ergZoom; ty = S / 2 - (S / 2 - ty) * ergZoom; k *= ergZoom; }
    var iw = ERG_BILD.w * k, ih = ERG_BILD.h * k;
    tx = iw >= W ? Math.min(0, Math.max(W - iw, tx)) : (W - iw) / 2; ty = ih >= S ? Math.min(0, Math.max(S - ih, ty)) : (S - ih) / 2;
    return { k: k, tx: tx, ty: ty };
  }
  /* Frontend 1: Standardbild 1320 px (deckt 360 bis 412 px bei Pixeldichte 3), die 2148-px-Fassung erst ab dem ersten „+“; vor dem
     Wechsel ins Ergebnis wird das Bild geladen und dekodiert (höchstens 150 ms warten), damit das Modell im ersten Bild der Folie steht */
  function ergSrc(gross) { return 'bilder/ergebnis/' + art + (gross ? '-gross' : '') + '.webp'; }
  var ergVorab = null;
  function ergVorladen(weiter) {
    var fertig = false, los = function () { if (fertig) return; fertig = true; if (weiter) weiter(); };
    if (!ergVorab || ergVorab._src !== ergSrc(false)) { ergVorab = new Image(); ergVorab.decoding = 'async'; ergVorab._src = ergSrc(false); ergVorab.src = ergVorab._src; ergVorab._decode = ergVorab.decode ? ergVorab.decode().catch(function () {}) : null; }
    if (!weiter) return;
    if (ergVorab.complete && ergVorab.naturalWidth) return los();
    if (ergVorab._decode) ergVorab._decode.then(los); setTimeout(los, 150);
  }
  function ergBuehneSetzen() {
    var L = ERG_LAGE[art]; if (!L) return;
    var W = ergBuehne.clientWidth || 390, S = ergBuehne.clientHeight || 260, K = ergKamera(W, S, L), v = ergWerte();
    var src = ergSrc(ergZoom > 1); if (ergBild.getAttribute('src') !== src) ergBild.src = src;
    var b = ergBild.style; b.left = K.tx.toFixed(1) + 'px'; b.top = K.ty.toFixed(1) + 'px'; b.width = (ERG_BILD.w * K.k).toFixed(1) + 'px'; b.height = (ERG_BILD.h * K.k).toFixed(1) + 'px';
    ergLinien.setAttribute('viewBox', '0 0 ' + W + ' ' + S); ergLinien.style.width = W + 'px'; ergLinien.style.height = S + 'px';
    var P = function (x, y) { return [x * K.k + K.tx, y * K.k + K.ty]; }, chip = ergBuehne.querySelector('.ez-glaschip'), cR = { x: chip.offsetLeft - 4, y: chip.offsetTop - 4, w: chip.offsetWidth + 8, h: chip.offsetHeight + 8 };
    /* Werte ohne Überdeckung: je Wert Lagen der Reihe nach, die erste freie gilt (frei von Chip, anderen Werten und Linienenden) */
    var belegt = [cR], enden = [], kn = ergBuehne.querySelector('.ez-erg__knoepfe'), dr = $('erg-drehen');
    if (kn) belegt.push({ x: kn.offsetLeft - 4, y: kn.offsetTop - 4, w: kn.offsetWidth + 8, h: kn.offsetHeight + 8 });
    if (dr && !dr.hidden) belegt.push({ x: dr.offsetLeft - 4, y: dr.offsetTop - 4, w: dr.offsetWidth + 8, h: dr.offsetHeight + 8 });
    var lagen = {};
    ['hm', 'wm', 'eh', 'ew'].forEach(function (k) {
      var l = L[k], A = P(l[0], l[1]), B = P(l[2], l[3]), senk = Math.abs(B[1] - A[1]) > Math.abs(B[0] - A[0]), g = ergLinien.querySelector('g[data-k="' + k + '"]'), ln = g.querySelectorAll('line');
      linieSetzen(ln[0], A, B); linieSetzen(ln[1], A, B);
      var kap = function (q) { return senk ? [[q[0] - 7, q[1]], [q[0] + 7, q[1]]] : [[q[0], q[1] - 7], [q[0], q[1] + 7]]; }, ka = kap(A), kb = kap(B);
      linieSetzen(ln[2], ka[0], ka[1]); linieSetzen(ln[3], ka[0], ka[1]); linieSetzen(ln[4], kb[0], kb[1]); linieSetzen(ln[5], kb[0], kb[1]);
      enden.push({ x: A[0] - 8, y: A[1] - 8, w: 16, h: 16 }, { x: B[0] - 8, y: B[1] - 8, w: 16, h: 16 });
      lagen[k] = { A: A, B: B };
    });
    ['hm', 'wm', 'eh', 'ew'].forEach(function (k) {
      var el = ergBuehne.querySelector('.ez-erg__wert[data-k="' + k + '"]'); el.querySelector('b').textContent = tausend(v[k]);
      var A = lagen[k].A, B = lagen[k].B, w = el.offsetWidth, h = el.offsetHeight, mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, oben = Math.min(A[1], B[1]), unten = Math.max(A[1], B[1]);
      var kand = k === 'hm' ? [[A[0] - 10 - w, my - h / 2], [A[0] - 10 - w, oben + (unten - oben) * 0.3 - h / 2], [A[0] + 10, my - h / 2], [A[0] + 10, oben + (unten - oben) * 0.3 - h / 2]]
        : k === 'eh' ? [[A[0] + 10, my - h / 2], [A[0] + 10, oben + (unten - oben) * 0.3 - h / 2], [A[0] - 10 - w, my - h / 2], [A[0] - 10 - w, oben + (unten - oben) * 0.3 - h / 2]]
        : k === 'wm' ? [[mx - w / 2, oben - 10 - h], [mx - w / 2, unten + 10], [mx + 10, unten + 10]]
        : [[mx - w / 2, unten + 10], [mx - w / 2, oben - 10 - h], [kn ? Math.min(mx - w / 2, kn.offsetLeft - 12 - w) : mx - w / 2, oben - 10 - h], [mx - w - 10, unten + 10], [mx + 10, oben - 10 - h]];
      var wahl = null;
      kand.forEach(function (c) {
        if (wahl) return;
        var r = { x: c[0], y: c[1], w: w, h: h };
        if (r.x < 8 || r.y < 8 || r.x + w > W - 8 || r.y + h > S - 8) return;
        if (belegt.concat(enden).some(function (o) { return schneidet(r, o); })) return;
        wahl = r;
      });
      if (!wahl) wahl = { x: Math.max(8, Math.min(W - 8 - w, kand[0][0])), y: Math.max(8, Math.min(S - 8 - h, kand[0][1])), w: w, h: h };
      belegt.push({ x: wahl.x - 4, y: wahl.y - 4, w: w + 8, h: h + 8 });
      el.style.left = Math.round(wahl.x) + 'px'; el.style.top = Math.round(wahl.y) + 'px';
    });
    $('erg-bildtext').textContent = 'Modell mit den vier Maßen: Maueröffnung ' + tausend(v.moW) + ' mal ' + tausend(v.moH) + ' Millimeter, ' + elNameVon() + ' ' + tausend(v.elW) + ' mal ' + tausend(v.elH) + ' Millimeter.';
  }
  var ERG_GLOSS = {
    rahmenmass: { t: 'Maueröffnung oder Fensterelement?', x: ['Die Maueröffnung ist das Loch in der Wand, gemessen von Laibung zu Laibung. Das Fensterelement ist das Fenster selbst mit seinem Rahmen, so wie du es siehst.', 'Beides brauchst du fürs Angebot. Das neue Fenster wird etwas kleiner als die Öffnung, damit Platz für Dämmung und Abdichtung bleibt. Das Bestellmaß legt dein Fensterbauer beim Feinaufmaß fest.'], tipp: 'Für die Öffnung hältst du den Zollstock an die Wand der Laibung, für das Element an die äußere Kante des Rahmens. Beides misst du in der Mitte.' },
    bruestung: { t: 'Was ist die Brüstungshöhe?', x: ['Die Brüstungshöhe ist der Abstand vom fertigen Fußboden bis zur Unterkante der Fensteröffnung, also bis zur Fensterbank. Gemessen wird innen, vom Boden, auf dem du stehst.', 'Sie ist wichtig für die Sicherheit: Liegt die Brüstung im Obergeschoss unter 80 cm, braucht das Fenster meist eine Absturzsicherung. Bei bodentiefen Fenstern ist die Brüstung null.'], tipp: 'Kommt noch ein neuer Bodenbelag, wird die Brüstung um dessen Dicke niedriger. Schreib das in die Notiz.' },
    laibung: { t: 'Was ist die Laibung?', x: ['Die Laibung ist die seitliche Wandfläche in der Fensteröffnung, also die Tiefe der Wand rund um das Fenster. Innen heißt sie Innenlaibung, außen Außenlaibung.', 'Ihre Tiefe misst du innen vom Fensterrahmen bis zur Wandoberfläche im Raum. Sie bestimmt zum Beispiel, wie tief die neue Fensterbank wird und wie viel nach dem Einbau verputzt werden muss.'], tipp: 'Kennst du die Tiefe nicht, lass das Feld leer. Die KI schätzt sie aus dem Innenfoto, und beim Feinaufmaß wird sie ohnehin gemessen.' }
  };
  var ergErkl = $('erg-erkl');
  bogenBinden(ergErkl, null);
  folien.ergebnis.querySelectorAll('[data-gloss]').forEach(function (b) { b.addEventListener('click', function () {
    var gl = ERG_GLOSS[b.getAttribute('data-gloss')]; $('erg-erkl-titel').textContent = gl.t;
    $('erg-erkl-text').innerHTML = gl.x.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '<p class="ez-bogen__tipp"><b>Tipp:</b> ' + gl.tipp + '</p>';
    bogenZeigen(ergErkl, b, true);
  }); });
  /* Maße gegen das Foto (AW.massPruef): nur mit einem Seitenverhältnis aus der KI; in der Vorschau hat es nur das Beispielfoto (etwa 1,22) */
  function massPruef(v) {
    if (massOk || !fotos.in || !fotos.in.beispiel || !kiFertig()) return null;
    var rm = v.elW / v.elH, rk = 1.22, lm = Math.log(rm), lk = Math.log(rk), ab = Math.abs(lm - lk);
    if (ab <= 0.25) return null;
    if (Math.abs(lm + lk) < 0.12 && Math.abs(lk) > 0.12) return { typ: 'tausch', rk: rk };
    return ab > 0.3 ? { typ: 'abweichung', rk: rk } : null;
  }
  var kiFertig = function () { var c = app.querySelector('.ez-slot[data-seite="in"] .ez-slot__chip'); return !!(c && c.classList.contains('ist-fertig')); };
  function ergSetzen() {
    var v = ergWerte(), an = artNameVon();
    folien.ergebnis.querySelectorAll('[data-zahl]').forEach(function (b) { b.textContent = tausend(v[b.getAttribute('data-zahl')]); });
    folien.ergebnis.querySelector('[data-lab="el"]').textContent = an + ' mit Rahmen';
    $('erg-unterzeile').textContent = 'Maueröffnung und ' + elNameVon() + ', so wie der Fensterbauer sie fürs Angebot braucht.';
    var wk = $('erg-winkel'); wk.hidden = !(v.dev > 10); wk.textContent = 'Bis ' + v.dev + NB + 'mm außer Winkel, alle sechs Einzelmaße stehen im Aufmaßblatt.';
    var mp = massPruef(v), pr = $('erg-pruef'); pr.hidden = !mp;
    if (mp) {
      $('erg-pruef-text').textContent = mp.typ === 'tausch' ? 'Auf dem Foto ist ' + (tuer() ? 'die Tür' : 'das Fenster') + ' eher ' + (mp.rk < 1 ? 'hoch als breit' : 'breit als hoch') + ', deine Maße sagen das Gegenteil. Breite und Höhe vertauscht?' : 'Das Foto wirkt anders proportioniert als deine Maße. Bitte miss noch einmal nach.';
      $('erg-nach').textContent = mp.typ === 'tausch' ? 'Tauschen' : 'Nachmessen'; $('erg-nach').setAttribute('data-typ', mp.typ);
    }
    var ki = $('erg-ki'); ki.hidden = !(fotos.in && fotos.in.beispiel && kiFertig());
    $('erg-weiter-wort').textContent = tuer() ? 'Weiter: Wunschtür' : 'Weiter: Wünsche';
    ergBuehneSetzen();
  }
  $('erg-ok').addEventListener('click', function () { massOk = true; $('erg-pruef').hidden = true; $('erg-weiter').focus({ preventScroll: true }); status('Maße bestätigt.'); });
  $('erg-nach').addEventListener('click', function () {
    if ($('erg-nach').getAttribute('data-typ') === 'tausch') { var W = mess.werte, a = W.w; W.w = W.h; W.h = a; ergSetzen(); status('Breite und Höhe getauscht'); return; }
    /* Nachmessen: zurück zu Maß 1 (die App setzt das Messen auf den Anfang) */
    mess.satz = 0; mess.i = 0; mess.passt = false; folien.messen.classList.remove('ist-passt'); mess.cur = String(mess.werte.hm || ''); mess.ersetzen = !!mess.werte.hm; zeigeFolie('messen', -1);
  });
  /* Falls zur Hand: Feld mit Tasten der App (− und + in 10 bzw. 5 mm), leer bleibt erlaubt */
  folien.ergebnis.querySelectorAll('[data-bump]').forEach(function (b) { b.addEventListener('click', function () {
    var inp = $('erg-' + b.getAttribute('data-bump')), n = Math.max(0, num(inp.value) + Number(b.getAttribute('data-v')));
    inp.value = n ? tausend(n) : ''; status(inp.labels && inp.labels[0] ? inp.labels[0].textContent + ': ' + (n ? tausend(n) + ' Millimeter' : 'leer') : '');
  }); });
  folien.ergebnis.querySelectorAll('.ez-erg__eingabe input').forEach(function (inp) { inp.addEventListener('input', function () { var n = num(inp.value); inp.value = n ? tausend(Math.min(n, 99999)) : ''; }); });
  /* Ansicht wie in der App: − und + zoomen (1 bis 2), das Zahnrad ist „Haus: Fassade und Farbe“, Ziehen dreht in der App das Modell */
  folien.ergebnis.querySelectorAll('[data-zoom]').forEach(function (b) { b.addEventListener('click', function () {
    ergZoom = Math.max(1, Math.min(2, ergZoom + 0.25 * Number(b.getAttribute('data-zoom'))));
    folien.ergebnis.querySelector('[data-zoom="-1"]').disabled = ergZoom <= 1; folien.ergebnis.querySelector('[data-zoom="1"]').disabled = ergZoom >= 2;
    ergBuehneSetzen(); status(ergZoom > 1 ? 'Modell ' + Math.round(ergZoom * 100) + ' Prozent' : 'Modell ganz');
  }); });
  $('erg-haus').addEventListener('click', function () { status('In der App wählst du hier Fassade und Farbe der Hauswand.'); });
  var dreh = null;
  ergBuehne.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; dreh = e.clientX; });
  ergBuehne.addEventListener('pointerup', function (e) { if (dreh != null && Math.abs(e.clientX - dreh) > 12) { $('erg-drehen').hidden = true; status('In der App dreht sich das Modell mit dem Finger; die Vorschau zeigt ein Standbild.'); } dreh = null; });
  /* Zurück führt dorthin, woher man kam: von „Gespeichert“ (Maße ändern) wieder dorthin, sonst zu den Rändern (wie einstiegHier der App) */
  function ergZurueck() { var api = window.ezVorschau || {}, von = api.ergVon; api.ergVon = ''; if (von && folien[von]) zeigeFolie(von, -1); else zeigeFolie('messen', -1); }
  $('erg-zurueck').addEventListener('click', ergZurueck); folien.ergebnis.querySelector('[data-erg-zurueck]').addEventListener('click', ergZurueck);
  $('erg-weiter').addEventListener('click', function () { if (folien.wuensche) zeigeFolie('wuensche', 1); else status('In der App geht es jetzt zu den Wünschen.'); });
  window.addEventListener('resize', function () { if (folien.ergebnis.hidden) return; if (app.clientWidth !== ergBreite) { ergBreite = app.clientWidth; ergBuehneSetzen(); } });

  /* Schnittstelle für die Folien in eigenen Dateien (wuensche.js, abschluss.js): nur lesen und Folien wechseln, kein Zugriff auf den Zustand */
  window.ezVorschau = {
    zeigeFolie: zeigeFolie, status: function (t) { status(t); }, ruhig: ruhig, tausend: tausend, num: num, tastatur: function () { return tastaturZuletzt; },
    bogenBinden: bogenBinden, bogenZeigen: bogenZeigen,
    anmelden: function (name, zeigen) { folien[name] = app.querySelector('.ez-folie[data-folie="' + name + '"]'); if (zeigen) folienZeigen[name] = zeigen; },
    art: function () { return art; }, artName: function () { return artNameVon(); }, elName: function () { return elNameVon(); }, istTuer: function () { return tuer(); },
    elementName: function () { return ART[art].name; },
    werte: function () { return ergWerte(); },
    masse: function () { return Object.assign({}, mess.werte); },
    fotos: function () { return { in: !!fotos.in, out: !!fotos.out, beispiel: !!(fotos.in && fotos.in.beispiel), kiFertig: kiFertig() }; },
    fenster: {}
  };
  setzeArt('fenster');
  if (bild.complete) lageSetzen(); else bild.addEventListener('load', function () { lageSetzen(); }, { once: true });
  window.addEventListener('load', function () { REIHE.forEach(function (k) { var i = new Image(); i.src = ART[k].bild; }); });
})();

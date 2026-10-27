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
    if (name === 'fotos') fotoTexte(); else if (name === 'messen') messZeigen(); else requestAnimationFrame(function () { lageSetzen(); });
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
     3-D-Modell der App (Enden der aktiven Maßlinie je Element und Maß, in Prozent der Bühne). */
  var MESS_LAGE = {"fenster":[[49.37,16.29,49.37,83.57],[51.49,18.57,51.49,82.43],[33.8,47.3,65.87,53.4],[36.73,47.96,67.08,53.79]],"balkon":[[49.37,16.29,49.37,83.57],[50.66,17.17,50.66,82.87],[41.83,48.84,57.11,51.75],[43.47,48.99,58.01,51.78]],"fest":[[49.37,16.29,49.37,83.57],[51.81,17.79,51.81,82.26],[28.32,46.25,72.14,54.63],[31.54,46.47,73.64,54.5]],"hst":[[49.37,16.29,49.37,83.57],[50.58,17.13,50.58,82.92],[22.4,45.11,79.23,55.94],[24.12,45.31,79.83,55.92]],"psk":[[49.37,16.29,49.37,83.57],[50.66,17.17,50.66,82.87],[32.92,47.11,66.85,53.62],[34.64,47.3,67.61,53.6]],"fsw":[[49.37,16.29,49.37,83.57],[50.58,17.13,50.58,82.92],[22.4,45.11,79.23,55.94],[24.12,45.31,79.83,55.92]]};
  var MESS = [
    { k: 'hm', g: 'oeffnung-hoehe', wer: 'mo', r: 'v', sub: 'Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zur Fensterbank.', subTuer: 'Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zum fertigen Fußboden.', enden: ['Oberkante der Öffnung', 'Fensterbank innen'], endenTuer: ['Oberkante der Öffnung', 'Fußboden innen'], chip: 'nicht' },
    { k: 'h', g: 'element-hoehe', wer: 'el', r: 'v', sub: 'Senkrecht in der Mitte: der feste Rahmen, von seiner Außenkante oben bis unten.', subTuer: 'Senkrecht in der Mitte: der feste Rahmen samt Schwelle, von Außenkante oben bis unten.', enden: ['Rahmen außen', 'Rahmen außen'], endenTuer: ['Rahmen außen', 'Unterkante Schwelle'], chip: 'samt' },
    { k: 'wm', g: 'oeffnung-breite', wer: 'mo', r: 'h', sub: 'Von innen, waagerecht auf halber Höhe: von Mauer zu Mauer.', enden: ['Mauer', 'Mauer'], chip: 'nicht' },
    { k: 'w', g: 'element-breite', wer: 'el', r: 'h', sub: 'Waagerecht auf halber Höhe: der feste Rahmen, von Außenkante zu Außenkante.', enden: ['Rahmen außen', 'Rahmen außen'], chip: 'samt' }
  ];
  var UEBLICH = { fenster: { v: [500, 2400, 1250], h: [400, 3000, 1100] }, balkon: { v: [1900, 2600, 2150], h: [700, 1400, 900] }, fest: { v: [300, 3000, 1250], h: [300, 4000, 1500] }, hst: { v: [2000, 2700, 2250], h: [2000, 6000, 3500] }, psk: { v: [1900, 2600, 2150], h: [1400, 3500, 2000] }, fsw: { v: [2000, 2700, 2250], h: [1800, 6000, 3500] } };
  var MESS_GLOSS = {
    'oeffnung-hoehe': { t: 'Wie messe ich die Maueröffnung senkrecht?', x: ['Die Maueröffnung ist das Loch in der Wand, in dem dein Fenster sitzt. Senkrecht misst du sie in der Mitte: von der Oberkante der Öffnung, also der Unterseite von Sturz oder Rollladenkasten, bis hinunter auf die Fensterbank.', 'Halte den Zollstock dabei an die Wand der Laibung, nicht an den Fensterrahmen. Der Rahmen sitzt meist ein Stück weiter innen, das Maß wäre zu klein.'], tipp: 'Liegt innen eine Fensterbank aus Stein, misst du bis auf ihre Oberfläche. Wie sie eingebaut ist, sieht dein Fensterbauer auf dem Foto.' },
    'element-hoehe': { t: 'Wie messe ich das Fensterelement senkrecht?', x: ['Das Element ist dein bestehendes Fenster samt Rahmen. Senkrecht misst du es in der Mitte, von der Oberkante bis zur Unterkante des Rahmens, so weit du ihn siehst.', 'Bei einer Tür gilt dasselbe bis hinunter auf die Schwelle. Rollladenkasten, Fensterbank und Putz gehören nicht dazu.'], tipp: 'Verdeckt Putz oder eine Leiste einen Teil des Rahmens, miss bis zur sichtbaren Kante und schreib es in die Notiz. Den Rest klärt das Feinaufmaß.' },
    'oeffnung-breite': { t: 'Wie messe ich die Maueröffnung waagerecht?', x: ['Waagerecht misst du die Öffnung auf halber Höhe: von der linken Laibung bis zur rechten, also von Wand zu Wand.', 'Liegen dort Fliesen oder eine Verkleidung, zählt die fertige Oberfläche. Halte den Zollstock gerade, nicht schräg nach oben oder unten.'], tipp: 'Reicht der Zollstock nicht, miss das letzte Stück mit einem zweiten Zollstock oder einem Maßband und zähl beide Werte zusammen.' },
    'element-breite': { t: 'Wie messe ich das Fensterelement waagerecht?', x: ['Das Element misst du auf halber Höhe von der linken bis zur rechten sichtbaren Außenkante des Rahmens. Bei zwei oder drei Flügeln gehört alles dazu, auch die Pfosten dazwischen.', 'Das Maß ist meist ein paar Zentimeter kleiner als die Öffnung. Ist es größer, hast du die Öffnung wahrscheinlich am Rahmen statt an der Laibung gemessen.'], tipp: 'Die App warnt dich, wenn das Element größer ist als die Öffnung oder auffällig klein. Dann lohnt ein zweiter Blick mit dem Zollstock.' }
  };
  var mess = { i: 0, cur: '', werte: {}, msg: null, cmLive: false, ack: false, ersetzen: false, fertig: false }, cmTimer = 0;
  var messBuehne = $('mess-buehne'), messBild = $('mess-bild'), messFeld = $('mess-feld'), messZahl = $('mess-zahl'), messZeile = $('mess-zeile'), messWeiterKnopf = $('mess-weiter');
  var tausend = function (v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var num = function (t) { return parseInt(String(t || '').replace(/[^\d]/g, ''), 10) || 0; };
  var tuer = function () { return !!ART[art].tuer; };
  var ueblich = function (r) { return (UEBLICH[art] || UEBLICH.fenster)[r]; };
  var schritt = function () { return MESS[mess.i]; };
  function messTitel(st) {
    var ding = st.wer === 'mo' ? 'der Öffnung' : tuer() ? 'der Tür' : art === 'fest' ? 'des Elements' : 'des Fensters';
    return (st.r === 'v' ? 'Höhe' : 'Breite') + ' <em>' + ding + '.</em>';
  }
  /* Prüfungen der App: Millimeter, Zentimeter-Verdacht, Spanne, Element gegen Öffnung */
  function pruefe(v, st) {
    if (!v) return { ok: false, msg: 'Bitte das Maß in Millimetern eintragen.' };
    if (v < 250 && v * 10 >= 250 && v * 10 <= 6000) return { ok: false, cm: v * 10 };
    if (v < 250 || v > 6000) return { ok: false, msg: 'Das passt nicht zu einem Fenster. Bitte in Millimetern messen, zum Beispiel 1.230.' };
    if (st.wer === 'el') {
      var o = mess.werte[st.r === 'v' ? 'hm' : 'wm'];
      if (o && v > o + 30) return { ok: true, warn: 'Größer als die Öffnung (' + tausend(o) + '\u00a0mm). Die Öffnung an der Mauer messen, nicht am Rahmen.' };
      if (o && v < o * 0.6) return { ok: true, warn: 'Sehr klein für diese Öffnung. Bis zur Außenkante des Rahmens messen.' };
    }
    return { ok: true };
  }
  var cmFrage = function (v, r) { var u = ueblich(r); return v > 0 && v * 10 <= 6000 && ((v < 250 && v * 10 >= 250) || (v < u[0] && v * 10 >= u[0])); };
  /* Bühne: Bild, Linie, Strichmarken, Enden und Feld für das aktuelle Maß */
  function messBuehneSetzen(zieht) {
    var st = schritt(), l = MESS_LAGE[art][mess.i], x1 = l[0], y1 = l[1], x2 = l[2], y2 = l[3];
    messBuehne.setAttribute('data-wer', st.wer); messBuehne.setAttribute('data-r', st.r);
    var src = 'bilder/mess/' + art + '-' + (mess.i + 1) + '.webp';
    if (messBild.getAttribute('src') !== src) {
      /* erst dekodieren, dann tauschen: das Modell ist je Element in allen vier Bildern dasselbe, es blendet nicht ab */
      var neu = new Image(); neu.src = src; var nr = (messBild._nr = (messBild._nr || 0) + 1);
      (neu.decode ? neu.decode() : Promise.resolve()).catch(function () {}).then(function () { if (messBild._nr === nr) messBild.src = src; });
    }
    messBild.alt = '';
    Array.prototype.forEach.call(messBuehne.querySelectorAll('.ez-mass line'), function (ln) { ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', x2); ln.setAttribute('y2', y2); });
    var ka = $('mess-kappe-a'), kb = $('mess-kappe-b'); ka.style.left = x1 + '%'; ka.style.top = y1 + '%'; kb.style.left = x2 + '%'; kb.style.top = y2 + '%';
    var en = tuer() && st.endenTuer ? st.endenTuer : st.enden, ea = $('mess-ende-a'), eb = $('mess-ende-b');
    ea.firstChild.textContent = en[0]; eb.firstChild.textContent = en[1];
    var W = messBuehne.clientWidth || 358, H = messBuehne.clientHeight || 230, rand = 8;
    function legen(el, px, py, seite) {
      var w = el.offsetWidth, h = el.offsetHeight, x, y;
      if (st.r === 'v') {
        x = px + 10; y = seite === 'a' ? py + 6 : py - 6 - h;          // rechts neben dem Ende, nach innen versetzt
        if (x + w > W - rand) x = px - 10 - w >= rand ? px - 10 - w : W - rand - w; // kein Platz rechts: links davon, sonst an den Rand
      } else {
        y = py - h / 2;
        x = seite === 'a' ? px - 10 - w : px + 10;                      // nach außen
        if (x < rand || x + w > W - rand) { x = Math.max(rand, Math.min(W - rand - w, px - w / 2)); y = py + 12; } // zu eng: unter das Ende
      }
      el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
    }
    legen(ea, x1 / 100 * W, y1 / 100 * H, 'a'); legen(eb, x2 / 100 * W, y2 / 100 * H, 'b');
    var mx = (x1 + x2) / 2 / 100 * W, my = (y1 + y2) / 2 / 100 * H;
    if (st.r === 'h') my -= 36;                                         // waagerecht: das Feld steht über der Linie
    messFeld.style.left = Math.round(mx) + 'px'; messFeld.style.top = Math.round(my) + 'px';
    $('mess-hinweis').lastChild.textContent = st.chip === 'nicht' ? 'Nicht am Rahmen messen' : 'Rahmen außen, nicht Flügel';
    $('mess-bildtext').textContent = 'Modell: ' + (st.wer === 'mo' ? 'Maueröffnung' : ART[art].name.replace('‑', '-')) + ', gemessen wird ' + (st.r === 'v' ? 'senkrecht' : 'waagerecht') + ' von „' + en[0] + '“ bis „' + en[1] + '“.';
    if (zieht && !ruhig()) { messBuehne.classList.remove('zieht'); void messBuehne.offsetWidth; messBuehne.classList.add('zieht'); }
  }
  function messFeldSetzen() {
    var st = schritt(), v = num(mess.cur), leer = !mess.cur;
    messZahl.textContent = leer ? 'z. B. ' + tausend(ueblich(st.r)[2]) : tausend(v);
    messFeld.classList.toggle('is-leer', leer);
    messFeld.classList.toggle('is-fehler', !!(mess.msg && mess.msg.cls === 'fehler'));
    $('mess-wert').textContent = v ? tausend(v) + ' Millimeter' : '';
  }
  /* Die Zeile über den Tasten: Umrechnung, Rückfrage, Warnung oder Fehler; ihre Höhe steht fest, damit die Tasten nicht springen */
  function messZeileSetzen() {
    var st = schritt(), v = num(mess.cur), m = mess.msg, cm = m && m.cm ? m.cm / 10 : (!m && mess.cmLive && cmFrage(v, st.r) ? v : 0), html = '', hinweis = false;
    if (mess.fertig) html = '<p class="ez-zeile__text"><b>Alle vier Maße stehen.</b>In der App folgen jetzt die Ränder.</p>';
    else if (m && m.cls === 'warn') { hinweis = true; html = '<p class="ez-zeile__text">' + m.text + '</p><button type="button" class="ez-zeile__knopf" id="mess-korr">Korrigieren</button>'; }
    else if (cm) html = '<p class="ez-zeile__text"><b>Zollstock zeigt ' + cm + ' cm?</b>Bei ' + cm + ',5 cm: ' + cm + '5 tippen</p><button type="button" class="ez-zeile__knopf" id="mess-cm" data-v="' + cm * 10 + '">Ja, ' + tausend(cm * 10) + ' mm</button>';
    else if (m && m.cls === 'fehler') { hinweis = true; html = '<p class="ez-zeile__text">' + m.text + '</p>'; }
    else if (v > 6000) { hinweis = true; html = '<p class="ez-zeile__text">Höchstens 6.000 mm. Bitte in Millimetern.</p>'; }
    else if (v && mess.ersetzen) html = '<p class="ez-zeile__text">Bisher: <b class="inline">' + tausend(v) + ' mm</b>. Tippen ersetzt das Maß.</p>';
    else if (v >= 250) html = '<p class="ez-zeile__text">= ' + String(Math.round(v) / 10).replace('.', ',') + ' cm</p>';
    else html = '<p class="ez-zeile__text">In Millimetern: 125 cm = 1.250 mm</p>';
    if (messZeile._h !== html) { messZeile._h = html; messZeile.innerHTML = html; }
    messZeile.classList.toggle('ist-hinweis', hinweis);
    var korr = $('mess-korr'); if (korr) korr.addEventListener('click', function () { mess.cur = ''; mess.msg = null; mess.ack = false; messFeldSetzen(); messZeileSetzen(); messFussSetzen(); var t = folien.messen.querySelector('.ez-taste[data-taste="1"]'); if (t) t.focus({ preventScroll: true }); });
    messZeile.classList.toggle('ist-warnung', !!(m && m.cls === 'warn'));
    var cmKnopf = $('mess-cm'); if (cmKnopf) cmKnopf.addEventListener('click', function () { mess.cur = cmKnopf.getAttribute('data-v'); mess.msg = null; mess.cmLive = false; messWeiter(true); });
  }
  function messFussSetzen() {
    var st = schritt(), label = mess.msg && mess.msg.cls === 'warn' ? 'Stimmt so, weiter' : mess.i < 3 ? 'Weiter zu Maß ' + (mess.i + 2) : 'Weiter zu den Rändern';
    messWeiterKnopf.firstChild.textContent = label + ' ';
    var zur = mess.i ? 'Voriges Maß' : 'Zurück zu den Fotos';
    $('mess-zurueck').setAttribute('aria-label', zur); folien.messen.querySelector('[data-mess-zurueck]').setAttribute('aria-label', zur);
    $('mess-l').textContent = 'Maß ' + (mess.i + 1) + ' von 4';
    Array.prototype.forEach.call($('mess-kapseln').children, function (k, n) { k.className = n < mess.i || (mess.fertig && n === 3) ? 'ist-fertig' : n === mess.i ? 'ist-dran' : ''; });
    $('mess-h1').innerHTML = messTitel(st);
    $('mess-unterzeile').textContent = tuer() && st.subTuer ? st.subTuer : st.sub;
    var gl = MESS_GLOSS[st.g]; $('mess-erkl-titel').textContent = gl.t;
    $('mess-erkl-text').innerHTML = gl.x.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '<p class="ez-bogen__tipp"><b>Tipp:</b> ' + gl.tipp + '</p>';
  }
  function messAlles(zieht) { messBuehneSetzen(zieht); messFeldSetzen(); messZeileSetzen(); messFussSetzen(); }
  function messZeigen() {
    MESS.forEach(function (st, n) { var i = new Image(); i.src = 'bilder/mess/' + art + '-' + (n + 1) + '.webp'; });
    requestAnimationFrame(function () { messAlles(false); });
  }
  /* Tippen: die Ziffer steht sofort im Feld; nach einer Pause von 0,8 s fragt die Zeile nach Zentimetern (wie in der App) */
  function messTaste(t) {
    if (mess.fertig) { mess.fertig = false; }
    if (t === 'del') { if (mess.ersetzen) { mess.cur = ''; mess.ersetzen = false; } else mess.cur = mess.cur.slice(0, -1); }
    else { if (mess.ersetzen) { mess.cur = ''; mess.ersetzen = false; } if (mess.cur.length < 5 && !(mess.cur === '' && t === '0')) mess.cur += t; }
    mess.msg = null; mess.ack = false; mess.cmLive = false; clearTimeout(cmTimer);
    var v = num(mess.cur); if (cmFrage(v, schritt().r)) cmTimer = setTimeout(function () { mess.cmLive = true; messZeileSetzen(); }, ruhig() ? 0 : 800);
    messFeldSetzen(); messZeileSetzen(); messFussSetzen();
  }
  /* Weiter: prüfen, speichern, nächstes Maß; eine Warnung braucht ein zweites „Weiter“ („Stimmt so, weiter“) */
  function messWeiter(ausCm) {
    var st = schritt(), v = num(mess.cur), chk = pruefe(v, st);
    if (mess.fertig) return status('In der App geht es jetzt zu den Rändern.');
    if (!chk.ok) { mess.msg = chk.cm ? { cm: chk.cm } : { cls: 'fehler', text: chk.msg }; messFeldSetzen(); messZeileSetzen(); messFussSetzen(); status(chk.cm ? 'Zollstock zeigt ' + chk.cm / 10 + ' Zentimeter?' : chk.msg); return; }
    if (chk.warn && !mess.ack) { mess.msg = { cls: 'warn', text: chk.warn }; mess.ack = true; messFeldSetzen(); messZeileSetzen(); messFussSetzen(); status(chk.warn); return; }
    mess.werte[st.k] = v; mess.msg = null; mess.ack = false; mess.cmLive = false; clearTimeout(cmTimer);
    if (mess.i < 3) { mess.i++; var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : ''; mess.ersetzen = !!w; messAlles(true); status('Gespeichert. Maß ' + (mess.i + 1) + ' von 4.'); }
    else { mess.fertig = true; mess.cur = String(v); messFeldSetzen(); messZeileSetzen(); messFussSetzen(); status('Alle vier Maße stehen. In der App folgen jetzt die Ränder.'); }
  }
  function messZurueck() {
    clearTimeout(cmTimer); mess.msg = null; mess.ack = false; mess.cmLive = false;
    if (mess.fertig) mess.fertig = false;
    if (mess.i === 0) return zeigeFolie('fotos', -1);
    mess.i--; var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : ''; mess.ersetzen = !!w; messAlles(true);
  }
  folien.messen.querySelectorAll('.ez-taste[data-taste]').forEach(function (b) { b.addEventListener('click', function () { messTaste(b.getAttribute('data-taste')); }); });
  messWeiterKnopf.addEventListener('click', function () { messWeiter(false); });
  $('mess-zurueck').addEventListener('click', messZurueck);
  folien.messen.querySelector('[data-mess-zurueck]').addEventListener('click', messZurueck);
  bogenBinden($('mess-erkl'), $('mess-i'));
  /* Tastatur am Rechner: Ziffern, Rücktaste, Eingabe; ohne Übergang, nur solange die Folie offen und kein Bogen da ist */
  d.addEventListener('keydown', function (e) {
    if (folien.messen.hidden || offenerBogen || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); messTaste(e.key); }
    else if (e.key === 'Backspace') { e.preventDefault(); messTaste('del'); }
    else if (e.key === 'Enter' && (!t || !t.closest || !t.closest('button, a'))) { e.preventDefault(); messWeiter(false); }
  });
  window.addEventListener('resize', function () { if (!folien.messen.hidden) messBuehneSetzen(false); });

  setzeArt('fenster');
  if (bild.complete) lageSetzen(); else bild.addEventListener('load', function () { lageSetzen(); }, { once: true });
  window.addEventListener('load', function () { REIHE.forEach(function (k) { var i = new Image(); i.src = ART[k].bild; }); });
})();

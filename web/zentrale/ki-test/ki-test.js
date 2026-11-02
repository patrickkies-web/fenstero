/* KI-Test in der Zentrale (vorübergehend, functions/api/kitest.js): rechnet die Testbilder bei Cloudflare und setzt das Ergebnis wie die
   App nur in den Fensterflächen ins Originalfoto (Ausschnitt 600/250, 650 × 650 Pixel; Flächen um 24 % vergrößert). */
(function () {
  'use strict';
  var TESTS = [
    { modell: '9b', art: 'montage', titel: 'Cloudflare-KI 1: großes Modell, Fenster grob eingesetzt als Vorlage', unter: 'Modell bei Cloudflare: FLUX.2 klein 9B · rund 1,7 Cent' },
    { modell: '9b', art: 'markiert', titel: 'Cloudflare-KI 2: großes Modell, Öffnungen nur markiert', unter: 'Modell bei Cloudflare: FLUX.2 klein 9B · rund 1,7 Cent' },
    { modell: '4b', art: 'markiert', titel: 'Cloudflare-KI 3: kleines Modell, Öffnungen nur markiert', unter: 'Modell bei Cloudflare: FLUX.2 klein 4B · günstiger' },
    { modell: 'sd', art: 'maske', titel: 'Cloudflare-KI 4: Stable Diffusion (kein FLUX)', unter: 'älteres Modell bei Cloudflare, malt die Öffnungen ohne Vorlage der Fenster neu' }
  ];
  var A = { x: 600, y: 250, s: 650 };
  var BOXEN = [[1050, 405, 1120, 542], [738, 643, 852, 807]];
  var start = document.getElementById('start'), anm = document.getElementById('anmeldung'), liste = document.getElementById('ergebnisse');
  var haus = new Image(); haus.src = 'haus.jpg';

  function laden(img) { return new Promise(function (ok, nein) { if (img.complete && img.naturalWidth) return ok(img); img.onload = function () { ok(img); }; img.onerror = nein; }); }
  function einsetzen(roh) {
    return Promise.all([laden(haus), laden(roh)]).then(function () {
      var c = document.createElement('canvas'); c.width = A.s; c.height = A.s;
      var g = c.getContext('2d');
      g.drawImage(haus, A.x, A.y, A.s, A.s, 0, 0, A.s, A.s);
      BOXEN.forEach(function (b) {
        var w = b[2] - b[0], h = b[3] - b[1], dx = w * 0.12, dy = h * 0.12;
        g.save(); g.beginPath(); g.rect(b[0] - A.x - dx, b[1] - A.y - dy, w + 2 * dx, h + 2 * dy); g.clip();
        g.drawImage(roh, 0, 0, roh.naturalWidth, roh.naturalHeight, 0, 0, A.s, A.s); g.restore();
      });
      return c.toDataURL('image/jpeg', 0.9);
    });
  }
  function karte(t) {
    var k = document.createElement('section'); k.className = 'karte';
    k.innerHTML = '<h2></h2><p class="unter"></p><p class="status">Wartet …</p>';
    k.querySelector('h2').textContent = t.titel; k.querySelector('.unter').textContent = t.unter;
    liste.appendChild(k); return k;
  }
  function rechnen(t, k) {
    var st = k.querySelector('.status'); st.textContent = 'Cloudflare rechnet …'; st.className = 'status';
    return fetch('/api/zentrale/ki-test', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json', 'x-zentrale': '1' }, body: JSON.stringify({ modell: t.modell, art: t.art }) })
      .then(function (r) { return r.json().catch(function () { return { ok: false, fehler: 'Antwort ' + r.status }; }); })
      .then(function (j) {
        if (!j || !j.ok) { st.textContent = 'Fehler: ' + ((j && (j.fehler || j.error || j.meldung)) || 'unbekannt'); st.className = 'status fehler'; return; }
        var roh = new Image(); roh.src = j.bild; roh.alt = 'Rohbild der KI';
        return einsetzen(roh).then(function (url) {
          st.textContent = 'Fertig in ' + String(j.sekunden).replace('.', ',') + ' Sekunden'; st.className = 'status ok';
          var bild = new Image(); bild.src = url; bild.alt = t.titel + ', eingesetzt wie in der App'; bild.width = 650; bild.height = 650;
          k.appendChild(bild);
          var d = document.createElement('details'); d.className = 'roh'; d.innerHTML = '<summary>Rohbild der KI ansehen</summary>'; d.appendChild(roh);
          k.appendChild(d);
        });
      })
      .catch(function (e) { st.textContent = 'Fehler: ' + (e && e.message || e); st.className = 'status fehler'; });
  }
  start.addEventListener('click', function () {
    start.disabled = true; liste.innerHTML = '';
    var karten = TESTS.map(karte), kette = Promise.resolve();
    TESTS.forEach(function (t, i) { kette = kette.then(function () { return rechnen(t, karten[i]); }); });
    kette.then(function () { start.disabled = false; start.textContent = 'Nochmal rechnen'; document.getElementById('vergleich').hidden = false; });
  });
  fetch('/api/inhaber/stand', { credentials: 'same-origin', headers: { accept: 'application/json' } })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (j && j.angemeldet) { anm.textContent = 'Angemeldet. Vier Tests, je etwa 10 bis 20 Sekunden.'; start.disabled = false; }
      else { anm.innerHTML = 'Bitte zuerst in der <a href="/zentrale/">Zentrale anmelden</a> und dann diese Seite neu laden.'; }
    })
    .catch(function () { anm.textContent = 'Die Anmeldung ließ sich nicht prüfen. Seite neu laden.'; });
})();

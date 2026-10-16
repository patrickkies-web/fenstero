/* eeziframes · Rechner für das Bestellmaß im Ratgeber (/ratgeber/bestellmass-fenster/)
   Rechnet nur im Browser, schickt nichts weg. Werte: Mindestfugenbreiten je Seite für Kunststofffenster ohne Mauerwerksanschlag
   (stumpfer Anschlag) nach den Einbaurichtlinien eines Profilherstellers, dieselben wie in der Tabelle auf der Seite.
   Ohne JavaScript bleibt die Tabelle; mit Mauerwerksanschlag oder für Holz und Aluminium rechnet der Rechner bewusst nicht. */
(function () {
  'use strict';
  var form = document.getElementById('rechner'), aus = document.getElementById('rechner-ergebnis');
  if (!form || !aus) return;
  /* bis Länge (mm): Fuge je Seite (mm) */
  var FUGE = { weiss: [[1500, 10], [2500, 15], [3500, 20], [4500, 25]], farbig: [[1500, 15], [2500, 20], [3500, 25], [4500, 30]] };
  var fuge = function (laenge, art) { var z = FUGE[art].filter(function (x) { return laenge <= x[0]; })[0]; return z ? z[1] : null; };
  var zahl = function (v) { var n = parseInt(String(v || '').replace(/\D/g, ''), 10); return isNaN(n) ? 0 : n; };
  var tausend = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  function zeile(text, stark) { var p = document.createElement(stark ? 'b' : 'span'); p.textContent = text; return p; }
  function zeigen(teile) {
    while (aus.firstChild) aus.removeChild(aus.firstChild);
    teile.forEach(function (t, i) { if (i) aus.appendChild(document.createElement('br')); aus.appendChild(t); });
  }
  function rechnen() {
    var b = zahl(form.elements.b.value), h = zahl(form.elements.h.value), art = form.elements.art.value, anschlag = form.elements.anschlag.value;
    if (art === 'anders') return zeigen([zeile('Für Holz- und Alufenster nennen die Hersteller eigene Werte, meist 10 bis 25 mm je Seite. Das Bestellmaß rechnet dein Fensterbauer.')]);
    if (anschlag === 'mit') return zeigen([zeile('Mit Mauerwerksanschlag greift der Rahmen hinter den Anschlag; dann rechnet der Fensterbauer anders. Schick ihm ein Foto von außen, er legt das Bestellmaß beim Feinaufmaß fest.')]);
    if (!b || !h) return zeigen([zeile('Breite und Höhe der Öffnung in Millimetern eingeben, jeweils das kleinste von drei Maßen.')]);
    if (b < 300 || h < 300) return zeigen([zeile('Bitte in Millimetern eingeben, zum Beispiel 1230 statt 123.')]);
    var fb = fuge(b, art), fh = fuge(h, art);
    if (fb === null || fh === null) return zeigen([zeile('Über 4,5 m Länge nennt die Tabelle keinen Wert. Das klärt der Fensterbauer.')]);
    zeigen([
      zeile('Bestellmaß etwa ' + tausend(b - 2 * fb) + ' × ' + tausend(h - 2 * fh) + ' mm', true),
      zeile('Fuge ' + fb + ' mm links und rechts, ' + fh + ' mm oben und unten.'),
      zeile('Kommt unten ein Fensterbankanschlussprofil dazu, wird die Höhe um dessen Maß kleiner. Das genaue Maß legt der Fensterbauer nach seinem Feinaufmaß fest.')
    ]);
  }
  form.addEventListener('input', rechnen);
  form.addEventListener('change', rechnen);
  form.addEventListener('submit', function (e) { e.preventDefault(); rechnen(); });
  rechnen();
})();

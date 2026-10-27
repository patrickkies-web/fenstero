/* Messen, Ränder und „Passt.“ im Look der Design-DNA (27.10.2026)
   Die Folie „Messen“ der Vorschau (docs/profis/konfigurator-start-vorschau/, vom Inhaber gesehen; große Bühne mit fester Kamera je Maß,
   Lupen an beiden Enden, Zahl auf der Linie, Großansicht, Zifferntasten offen, „Weiter“ prüft, speichert und geht zum nächsten Maß,
   danach die vier Ränder und „Passt.“). Ablauf, Texte und Prüfungen sind die der App (MESS, REST, checkValue, checkRest, cmFrage,
   UEBLICH); die Linienlagen kommen aus dem 3-D-Modell der App (Pixel der Renderings in web/bilder/konfigurator/mess/, 2148 × 1400).
   Regel des Inhabers: beim Messen kein 3-D, sondern eine feste Ansicht je Element.
   app.js zeichnet die Hülle (SCREENS.messen und SCREENS.rest mit html()) und ruft nach jedem Zeichnen binden(); der Zustand (Maß, Entwurf,
   „Hier auch …“) bleibt dabei erhalten. Werte, Schritt und Wege gehen über die Funktionen in o zurück an die App. */
(function () {
  'use strict';
  var d = document;
  var ruhig = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var aktuell = null, zustand = null, hoehe = null;
  /* eine Probe für die kleine Bildschirmhöhe (100svh), einmal im Dokument */
  function probe() {
    if (hoehe && d.body.contains(hoehe)) return hoehe;
    hoehe = d.createElement('div'); hoehe.setAttribute('aria-hidden', 'true'); hoehe.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
    d.body.appendChild(hoehe); return hoehe;
  }
  d.addEventListener('keydown', function (e) { if (aktuell) aktuell.taste(e); });
  d.addEventListener('keyup', function (e) { if (aktuell) aktuell.tasteHoch(e); });
  window.addEventListener('resize', function () { if (aktuell) aktuell.groesse(); });
  /* Systemtastatur: der sichtbare Bereich wird kleiner; die Pille steht dann über der Tastatur (Telefone) */
  if (window.visualViewport) ['resize', 'scroll'].forEach(function (n) { window.visualViewport.addEventListener(n, function () { if (aktuell && aktuell.tastatur) aktuell.tastatur(); }); });

  var PFEIL_L = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3 5 8l5 5"/></svg>';
  /* Hülle: Kopf, Notiz und Rechtliches kommen aus der App (o.kopf, o.notiz, o.recht) */
  function html(o) {
    return '<div class="ez md-insel" data-theme="dunkel"><section class="ez-folie" data-folie="messen" id="md-folie" aria-label="' + (o.satz ? 'Schritt 4 von 6: Ränder' : 'Schritt 3 von 6: Messen') + '">' + o.kopf +
      '<figure class="ez-buehne ez-buehne--mess" id="mess-buehne" data-wer="mo" data-r="v">' +
      '<img class="ez-mess__bild ist-an" id="mess-bild" width="2148" height="1400" alt="" decoding="async" draggable="false">' +
      '<img class="ez-mess__bild" id="mess-bild-front" width="2148" height="1400" alt="" decoding="async" draggable="false">' +
      '<span class="ez-buehne__kante" aria-hidden="true"></span>' +
      '<span class="ez-glaschip"><i class="ez-ring" id="mess-chip-ring" style="--anteil:.5" aria-hidden="true"></i><span id="mess-chip-text">Schritt&nbsp;3 von&nbsp;6</span></span>' +
      '<div class="md-titel"><h1 id="mess-h1" tabindex="-1"></h1><button type="button" class="ez-i" id="mess-i" data-act="gloss" data-k="' + o.g + '" aria-label="Wo genau messen?"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="4" r="1.3"/><rect x="7" y="6.5" width="2" height="6.5" rx="1"/></svg></button></div>' +
      '<svg class="ez-mass" id="mess-linie" viewBox="0 0 390 280" preserveAspectRatio="none" aria-hidden="true"><line class="ez-mass__halo" x1="164" y1="28" x2="164" y2="252"/><line class="ez-mass__linie" x1="164" y1="28" x2="164" y2="252"/></svg>' +
      '<svg class="ez-mass-neben" id="mess-neben" viewBox="0 0 390 280" preserveAspectRatio="none" aria-hidden="true"><g class="ez-geist" id="mess-geist"><line class="ez-geist__halo"/><line class="ez-geist__linie"/><line class="ez-geist__halo"/><line class="ez-geist__kappe"/><line class="ez-geist__halo"/><line class="ez-geist__kappe"/></g><line class="ez-mass__fuehrung-halo" id="mess-fuehrung-a-halo"/><line class="ez-mass__fuehrung" id="mess-fuehrung-a"/><line class="ez-mass__fuehrung-halo" id="mess-fuehrung-b-halo"/><line class="ez-mass__fuehrung" id="mess-fuehrung-b"/></svg>' +
      '<svg class="ez-passt-linien" id="mess-passt" viewBox="0 0 390 280" preserveAspectRatio="none" aria-hidden="true"><g><line class="ez-passt__halo"/><line class="ez-passt__linie"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe"/><line class="ez-passt__kappe"/></g><g><line class="ez-passt__halo"/><line class="ez-passt__linie"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe"/><line class="ez-passt__kappe"/></g><g><line class="ez-passt__halo"/><line class="ez-passt__linie"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe"/><line class="ez-passt__kappe"/></g><g><line class="ez-passt__halo"/><line class="ez-passt__linie"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe"/><line class="ez-passt__kappe"/></g><g><line class="ez-passt__halo"/><line class="ez-passt__linie"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe"/><line class="ez-passt__kappe"/></g><g><line class="ez-passt__halo"/><line class="ez-passt__linie"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe-halo"/><line class="ez-passt__kappe"/><line class="ez-passt__kappe"/></g></svg>' +
      '<span class="ez-passt__schild" id="passt-schild-b" aria-hidden="true"><b>1.236</b><small>mm</small></span><span class="ez-passt__schild" id="passt-schild-h" aria-hidden="true"><b>1.405</b><small>mm</small></span>' +
      '<span class="ez-mass__kappe" id="mess-kappe-a" aria-hidden="true"></span><span class="ez-mass__kappe" id="mess-kappe-b" aria-hidden="true"></span>' +
      '<span class="ez-mass__ende" id="mess-ende-a" aria-hidden="true"><span class="ez-lupe"><i class="ez-lupe__bild"></i><svg class="ez-lupe__marke" viewBox="0 0 100 100" preserveAspectRatio="none"><line class="ez-lupe__halo"/><line class="ez-lupe__halo"/><line class="ez-lupe__linie"/><line class="ez-lupe__kappe"/></svg></span><span class="ez-mass__text"><b>Oberkante</b> der Öffnung</span></span>' +
      '<span class="ez-mass__ende" id="mess-ende-b" aria-hidden="true"><span class="ez-lupe"><i class="ez-lupe__bild"></i><svg class="ez-lupe__marke" viewBox="0 0 100 100" preserveAspectRatio="none"><line class="ez-lupe__halo"/><line class="ez-lupe__halo"/><line class="ez-lupe__linie"/><line class="ez-lupe__kappe"/></svg></span><span class="ez-mass__text"><b>Fensterbank</b> innen</span></span>' +
      '<button type="button" class="ez-gross-auf" id="mess-gross-auf" aria-haspopup="dialog"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 3h4v4M7 15H3v-4M15 3l-5 5M3 15l5-5"/></svg>Groß ansehen</button>' +
      '<label class="md-wert is-leer" id="mess-feld"><i class="ez-mass__marke" aria-hidden="true"></i><span class="md-wert__zb" aria-hidden="true">z.&nbsp;B.</span><input class="md-wert__eingabe" id="mess-eingabe" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" maxlength="6" aria-labelledby="mess-h1" aria-describedby="mess-unterzeile mess-wert"><small aria-hidden="true">mm</small><svg aria-hidden="true" class="ez-mass__haken" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5l2.6 2.6L11 4.6"/></svg></label>' +
      '<figcaption class="ez-unsichtbar" id="mess-bildtext">Modell: Maueröffnung, gemessen wird senkrecht in der Mitte von der Oberkante der Öffnung bis zur Fensterbank innen.</figcaption>' +
      '</figure>' +
      '<div class="md-unter"><p class="ez-unterzeile" id="mess-unterzeile"></p>' + o.notiz + '</div>' +
      '<div class="ez-karte ez-karte--tasten" data-theme="hell">' +
      '<div class="ez-block__kopf"><span class="dna-label" id="mess-l">Maß&nbsp;1&nbsp;von&nbsp;4</span><span class="ez-kapseln" id="mess-kapseln" aria-hidden="true"><i class="ist-dran"></i><i></i><i></i><i></i></span></div>' +
      '<div class="ez-zeile" id="mess-zeile"><p class="ez-zeile__text"><b class="ez-zeile__hinweis">Nicht am Rahmen messen</b>In Millimetern: 125&nbsp;cm = 1.250&nbsp;mm</p></div>' +
      '<span class="ez-unsichtbar" id="mess-wert" aria-live="polite"></span>' +
      '</div>' +
      '<div class="ez-karte ez-karte--passt" data-theme="hell">' +
      '<div class="ez-block__kopf"><span class="dna-label">Maueröffnung · Breite × Höhe</span><span class="ez-passt__haken" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5l2.6 2.6L11 4.6"/></svg></span></div>' +
      '<p class="ez-passt__zahl"><b id="passt-zahl">1.236 × 1.405</b><small>mm</small></p>' +
      '<p class="ez-passt__el"><span id="passt-el-name">Fenster mit Rahmen</span><b id="passt-el">1.180 × 1.350</b><small>mm</small></p>' +
      '<h2 class="ez-passt__titel">Dreimal gemessen, das kleinste zählt</h2>' +
      '<div class="ez-passt__spalten">' +
      '<div class="ez-passt__sp"><p class="ez-passt__lab">Breite</p><div id="passt-breite"></div></div>' +
      '<div class="ez-passt__sp"><p class="ez-passt__lab">Höhe</p><div id="passt-hoehe"></div></div>' +
      '</div>' +
      '<p class="ez-passt__fuss" id="passt-fuss">Höchstens 5&nbsp;mm Unterschied, überhöht gezeichnet.</p>' +
      '</div>' +
      '<div class="lg-fuss"><button type="button" class="lg-zurueck" id="mess-zurueck" aria-label="Zurück zu den Fotos">' + PFEIL_L + '</button>' +
      '<button type="button" class="dna-pille lg-weiter" id="mess-weiter" aria-describedby="mess-wert"><span class="ez-weiter__wort">Weiter zu Maß&nbsp;2</span> <span class="dna-pille__pfeil"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4"/></svg></span></button></div>' +
      o.recht +
      '<dialog class="ez-gross" id="mess-gross" aria-labelledby="mess-gross-titel" aria-describedby="mess-gross-unter">' +
      '<div class="ez-gross__kopf">' +
      '<div><p class="ez-gross__titel" id="mess-gross-titel">Höhe <em>der</em> Öffnung.</p><p class="ez-gross__unter" id="mess-gross-unter">Von innen, senkrecht in der Mitte: von der Oberkante der Öffnung bis zur Fensterbank.</p></div>' +
      '<button type="button" class="ez-rund ez-rund--zu" aria-label="Großansicht schließen" data-gross-zu><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>' +
      '</div>' +
      '<div class="ez-gross__platz" id="mess-gross-platz"></div>' +
      '<div class="ez-gross__fuss"><button type="button" class="dna-pille" data-gross-zu>Zurück zum Eintippen</button></div>' +
      '<p class="ez-unsichtbar" role="status" id="mess-gross-live"></p>' +
      '</dialog>' +
      '<p class="ez-unsichtbar" id="md-live" role="status" aria-live="polite"></p></section></div>';
  }

  /* Nach jedem Zeichnen: Zustand aus der App übernehmen (Schritt, Werte, getipptes Maß) und die Folie neu verdrahten */
  function binden(wurzel, o) {
    if (!wurzel) { aktuell = null; return; }
    var neu = !zustand || zustand.wid !== o.wid;
    if (neu) zustand = { wid: o.wid, satz: 0, i: 0, cur: '', werte: {}, entwurf: {}, gleich: {}, gleichOk: false, msg: null, cmLive: false, ack: false, ersetzen: false, passt: false, gespeichert: 0, sperre: false, mmOk: 0 };
    var z = zustand, anders = neu || z.satz !== o.satz || z.i !== o.i || z.passt !== o.passt;
    z.satz = o.satz; z.i = o.i; z.passt = o.passt; z.werte = o.werte(); z.gespeichert = 0; z.sperre = false;
    if (anders) {
      var k = (o.satz ? ['hl', 'hr', 'wt', 'wb'] : ['hm', 'h', 'wm', 'w'])[o.i] || '';
      var w = z.werte[k]; z.msg = null; z.ack = false; z.cmLive = false; z.mmOk = 0;
      if (o.passt) { z.cur = ''; z.ersetzen = false; }
      else if (o.cur && String(o.cur) !== String(w || '')) { z.cur = String(o.cur); z.ersetzen = false; }
      else { z.cur = w ? String(w) : (z.entwurf[k] || ''); z.ersetzen = !!w; }
    }
    aktuell = aufbauen(wurzel, o, z);
  }

  function aufbauen(wurzel, o, zustand) {
    var $ = function (id) { return d.getElementById(id); };
    var app = o.scroll || d.scrollingElement, folien = { messen: wurzel }, art = o.art;
    function status(t) { var gl = d.getElementById('mess-gross-live'); if (gl && gl.closest('dialog[open]')) { gl.textContent = t; return; } var l = $('md-live'); if (l) l.textContent = t; }
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
  /* satz 0: die vier Maße (Schritt 3), satz 1: die vier Ränder (Schritt 4); passt: Übersicht „Passt.“ nach dem letzten Rand */
  var mess = zustand, cmTimer = 0;
  var da = function () { return d.body.contains(folien.messen); };
  var messBuehne = $('mess-buehne'), messBild = $('mess-bild'), messFeld = $('mess-feld'), eingabe = $('mess-eingabe'), messZeile = $('mess-zeile'), messWeiterKnopf = $('mess-weiter');
  var tausend = function (v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  var num = function (t) { return parseInt(String(t || '').replace(/[^\d]/g, ''), 10) || 0; };
  var tuer = function () { return !!o.tuer; };
  var ueblich = function (r) { return (UEBLICH[art] || UEBLICH.fenster)[r]; };
  var satzVon = function (z) { return z ? RAND : MESS; };
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
  var hoeheProbe = probe();
  function messPlatzReservieren() {
    /* Titel und Unterzeile aller vier Maße einmal messen und die größte Höhe festhalten: zwischen den Maßen springt nichts */
    var h1 = $('mess-h1'), uz = $('mess-unterzeile'), alt = mess.i, mh = 0, mu = 0;
    h1.style.minHeight = ''; uz.style.minHeight = '';
    MESS.concat(RAND).forEach(function (st) { h1.innerHTML = messTitel(st); uz.textContent = tuer() && st.subTuer ? st.subTuer : st.sub; mh = Math.max(mh, h1.offsetHeight); mu = Math.max(mu, uz.offsetHeight); });
    mess.i = alt; h1.style.minHeight = mh + 'px'; uz.style.minHeight = mu + 'px';
  }
  /* Die Höhe der Bühne steht im CSS (wie Folie 1, Wunsch des Inhabers 27.10.2026); eine alte Höhe aus dem Stil fällt weg */
  function messHoeheSetzen() { if (!grossOffen) messBuehne.style.height = ''; }
  /* Platz, den Überschrift (oben) und Wert-Chip (unten) in der Bühne belegen; die Öffnung steht dazwischen */
  function reserve(S) {
    var sR = messBuehne.getBoundingClientRect(), t = messBuehne.querySelector('.md-titel'), o = 12, u = 12;
    if (t && t.offsetParent && !grossOffen) o = Math.max(o, t.getBoundingClientRect().bottom - sR.top + 10);
    if (messFeld && messFeld.offsetParent) u = Math.max(u, sR.bottom - messFeld.getBoundingClientRect().top + 12);
    return { o: Math.min(o, S * 0.4), u: Math.min(u, S * 0.3) };
  }
  function schneidet(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function endeText(t) { var i = t.indexOf(' '); return i < 0 ? '<b>' + t + '</b>' : '<b>' + t.slice(0, i) + '</b>' + t.slice(i); }
  var paar = function () { return mess.i < 2 ? 0 : 1; };
  var bildSrc = function (p) { return '/bilder/konfigurator/mess/' + art + (p ? '-front' : '') + '.webp'; };
  /* Feste Kamera je Paar: die ganze Öffnung (Sturz bis Bank, Laibung bis Laibung) füllt 80 Prozent der Höhe oder 86 Prozent der Breite
     (Großansicht 84 und 90); senkrecht steht sie etwas links der Mitte (rechts die Etiketten), waagerecht etwas unter der Mitte (oben die
     Etiketten). Ist die Bühne flacher als das Bild, bleibt die Öffnung ganz, und das Bild läuft an den Seiten in die Wand aus. */
  function kamera(W, S, box, p, gross) {
    var R = reserve(S), H = S - R.o - R.u, klein = !gross && H < 200;
    var bw = box[2] - box[0], bh = box[3] - box[1], k = Math.min((gross ? 0.9 : 0.88) * H / bh, (gross ? 0.9 : 0.86) * W / bw);
    var cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, zx = p || klein ? W * 0.5 : W * 0.44, zy = R.o + H / 2;
    var iw = BILD.w * k, ih = BILD.h * k, tx = zx - cx * k, ty = zy - cy * k;
    if (iw >= W) tx = Math.min(0, Math.max(W - iw, tx)); else tx = (W - iw) / 2 + Math.max(-(W - iw) / 2, Math.min((W - iw) / 2, tx - (W - iw) / 2));
    if (ih >= S) ty = Math.min(0, Math.max(S - ih, ty));
    return { k: k, tx: tx, ty: ty };
  }
  /* Ränder senkrecht (Höhe links und rechts): die Kamera stellt die Linie selbst auf 45 Prozent der Breite (Großansicht Mitte), die Öffnung
     läuft zur einen Seite weiter. So stehen die Lupen rechts der Linie frei von Chip und „Groß ansehen“, auch an der linken Laibung. */
  function kameraRand(W, S, box, l, gross) {
    var R = reserve(S), H = S - R.o - R.u, bh = box[3] - box[1], k = (gross ? 0.86 : 0.8) * H / bh, lx = (l[0] + l[2]) / 2, cy = (box[1] + box[3]) / 2;
    var tx = W * (gross ? 0.5 : 0.45) - lx * k, ty = R.o + H / 2 - cy * k, iw = BILD.w * k, ih = BILD.h * k;
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
      hin = [kastVon(messChip), endKast(A), endKast(B), kastVon(messFeld)]; if (!gross) { hin.push(kastVon(messGrossKnopf)); hin.push(kastVon(messBuehne.querySelector('.md-titel'))); }
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
    $('mess-bildtext').textContent = 'Modell: ' + (st.wer === 'mo' ? 'Maueröffnung' : o.artName) + (p ? ', von vorn' : '') + ', gemessen wird ' + (st.r === 'v' ? 'senkrecht' : 'waagerecht') + ' von „' + en[0] + '“ bis „' + en[1] + '“. Lupen zeigen beide Enden vergrößert.';
    /* Die Linie zieht sich von Ende zu Ende (nach einem Wechsel der Ansicht 120 ms später) */
    messBuehne.classList.remove('zieht');
    if (zieht && !ruhig()) { void messBuehne.offsetWidth; messBuehne.classList.add('zieht'); }
  }
  function messFeldSetzen() {
    var st = schritt(), v = num(mess.cur), leer = !mess.cur, ohne = leer && !!mess.satz;
    var anzeige = leer ? '' : tausend(v), bisher = d.activeElement === eingabe && mess.ersetzen && !leer;
    if (bisher) { eingabe.placeholder = anzeige; anzeige = ''; }
    else eingabe.placeholder = ohne ? '' : tausend(ueblich(st.r)[2]);
    if (eingabe.value !== anzeige) { eingabe.value = anzeige; if (d.activeElement === eingabe) try { eingabe.setSelectionRange(anzeige.length, anzeige.length); } catch (e) {} }
    messFeld.classList.toggle('is-leer', leer && !bisher); messFeld.classList.toggle('ist-ohne', ohne);
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
    /* Die Pille erscheint erst, wenn ein Wert im Feld steht (Wunsch des Inhabers, 27.10.2026); Rückfragen und „Passt.“ tragen sie immer */
    messWeiterKnopf.classList.toggle('ist-weg', !(mess.passt || artNeu !== 'weiter' || !!mess.cur || mess.sperre));
    /* Neue Bedeutung sichtbar machen: das Wort blendet in 160 ms ein (nicht bei weniger Bewegung) */
    if (neu && !ruhig() && wort.animate) wort.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  function pilleTippen(ausTastatur) {
    if (Date.now() < pilleSperre || mess.sperre) return;
    if (mess.passt) return o.zumErgebnis();
    if (pilleArt === 'ja') { mess.cur = messWeiterKnopf.getAttribute('data-cm'); mess.msg = null; mess.cmLive = false; return messWeiter(ausTastatur); }
    if (pilleArt === 'korr' && mess.msg && mess.msg.alle) { mess.msg = null; mess.ack = false; RAND.forEach(function (x) { mess.gleich[x.k] = false; }); mess.i = 0; o.schritt(mess.satz, mess.i); mess.cur = String(mess.werte[schritt().k]); mess.ersetzen = true; taub(450); messAlles(!ausTastatur); o.sync(mess); status('Rand 1 von 4: ' + messTitelText() + ' Bitte nachmessen; Tippen ersetzt das Maß.'); return; }
    if (pilleArt === 'korr') { mess.cur = ''; mess.msg = null; mess.ack = false; taub(450); messFeldSetzen(); messZeileSetzen(); status('Feld geleert. Bitte neu messen und eintippen.'); return; }
    messWeiter(ausTastatur);
  }
  function messFussSetzen() {
    var st = schritt(), nr = mess.satz ? 4 : 3;
    var zur = mess.passt || (mess.i && mess.satz) ? 'Voriger Rand' : mess.i ? 'Voriges Maß' : mess.satz ? 'Zurück zum Messen' : 'Zurück zu den Fotos';
    $('mess-zurueck').setAttribute('aria-label', zur); var kz = folien.messen.querySelector('.lg-kopf-zurueck'); if (kz) kz.setAttribute('aria-label', zur);
    $('mess-l').textContent = wortVon() + NB + (mess.i + 1) + NB + 'von' + NB + '4';
    Array.prototype.forEach.call($('mess-kapseln').children, function (k, n) { k.className = n < mess.i || mess.passt ? 'ist-fertig' : n === mess.i ? 'ist-dran' : ''; });
    /* Schritt 3 „Messen“ und Schritt 4 „Ränder“ teilen sich die Folie; Chip, Ring und Notiz zeigen, wo man steht */
    $('mess-chip-text').textContent = 'Schritt' + NB + nr + ' von' + NB + '6'; $('mess-chip-ring').style.setProperty('--anteil', (nr / 6).toFixed(3));
    folien.messen.setAttribute('aria-label', mess.satz ? 'Schritt 4 von 6: Ränder' : 'Schritt 3 von 6: Messen');
    var pw = mess.passt ? passtWerte() : null, unter = pw ? (pw.dev > 10 ? 'Bis ' + pw.dev + NB + 'mm außer Winkel. Das kleinste Maß zählt.' : 'Deine Öffnung ist gerade.') : tuer() && st.subTuer ? st.subTuer : st.sub;
    $('mess-h1').innerHTML = pw ? 'Passt.' : messTitel(st); $('mess-gross-titel').innerHTML = messTitel(st);
    $('mess-unterzeile').textContent = unter; $('mess-gross-unter').textContent = tuer() && st.subTuer ? st.subTuer : st.sub;
    /* das i öffnet die Erklärung der App zum Maß, das dran ist (GLOSS) */
    var mi = $('mess-i'); if (mi) { mi.setAttribute('data-k', st.g); mi.setAttribute('aria-label', 'Wo genau messen?'); }
  }
  /* erst die Zahl setzen, dann die Bühne: die Lage des Feldes rechnet mit seiner echten Breite */
  function messAlles(zieht) { messFussSetzen(); messFeldSetzen(); messBuehneSetzen(zieht); messZeileSetzen(); }
  var messTitelText = function () { return $('mess-h1').textContent; };
  function messZeigen() {
    /* beide Ansichten vorab laden und dekodieren, damit der Wechsel zu Maß 3 nicht auf das Bild wartet */
    [messBild, messBildFront].forEach(function (img, p) { if (img.getAttribute('src') !== bildSrc(p)) img.src = bildSrc(p); if (img.decode) img.decode().catch(function () {}); });
    requestAnimationFrame(function () { if (!da()) return; messPlatzReservieren(); messFussSetzen(); messHoeheSetzen(); messBreite = app.clientWidth; messHoehe = hoeheProbe.offsetHeight; messAlles(false); });
  }
  /* Halten nach dem Speichern beenden und zum nächsten Maß (auch wenn schon die nächste Ziffer kommt) */
  function naechstes(ausTastatur) {
    clearTimeout(halteT); if (!mess.sperre || !da()) return;
    mess.gespeichert = 0; mess.sperre = false; messFeld.classList.remove('ist-gespeichert');
    if (mess.i === 3 && mess.satz) return passtZeigen(ausTastatur);
    /* nach Maß 4 geht es ohne Halt zu den Rändern (Schritt 4), wie in der App mit „Weiter zu den Rändern“ */
    var neuerSatz = mess.i === 3; if (neuerSatz) return o.zuRaendern();
    mess.i++; o.schritt(mess.satz, mess.i);
    var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : (mess.entwurf[schritt().k] || ''); mess.ersetzen = !!w; mess.mmOk = 0;
    messAlles(!ausTastatur); o.sync(mess);
    status((neuerSatz ? 'Schritt 4 von 6, Ränder. ' : '') + wortVon() + ' ' + (mess.i + 1) + ' von 4: ' + messTitelText() + ' ' + $('mess-unterzeile').textContent);
  }
  /* Tippen: die Ziffer steht sofort im Feld; nach einer Pause von 0,8 s fragt die Zeile nach Zentimetern (wie in der App, auch in der ruhigen Fassung) */
  function messTaste(t, ausTastatur) {
    if (mess.sperre) naechstes(ausTastatur);
    if (mess.passt) return;
    if (mess.satz) mess.gleich[schritt().k] = false;
    if (t === 'del') { if (mess.ersetzen) { mess.cur = ''; mess.ersetzen = false; } else mess.cur = mess.cur.slice(0, -1); }
    else { if (mess.ersetzen) { mess.cur = ''; mess.ersetzen = false; } if (mess.cur.length < 5 && !(mess.cur === '' && t === '0')) mess.cur += t; }
    neueEingabe();
  }
  /* Das Feld unter dem Element ist ein echtes Eingabefeld: Antippen holt die Systemtastatur, nur Ziffern zählen (höchstens fünf) */
  function feldGetippt() {
    if (mess.sperre) naechstes(true);
    if (mess.passt) return;
    if (mess.satz) mess.gleich[schritt().k] = false;
    mess.ersetzen = false; mess.cur = eingabe.value.replace(/[^\d]/g, '').replace(/^0+/, '').slice(0, 5);
    neueEingabe();
  }
  function neueEingabe() {
    /* Eine neue Ziffer ist eine bewusste Eingabe: die Sperre gegen den Doppeltipp fällt */
    mess.msg = null; mess.ack = false; mess.cmLive = false; clearTimeout(cmTimer); taub(0); o.sync(mess);
    var v = num(mess.cur);
    if (cmFrage(v, schritt().r)) cmTimer = setTimeout(function () { if (!da()) return; mess.cmLive = true; taub(450); messZeileSetzen(); status('Zollstock zeigt ' + v + ' Zentimeter? Dann Ja, ' + tausend(v * 10) + ' Millimeter.'); }, 800);
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
      mess.msg = { cls: 'warn', alle: true, text: 'Alle vier genau wie die Mitte? Das ist selten. Bitte einmal nachmessen.' }; mess.werte[st.k] = v; o.speichern(st.k, v); taub(450); messFeldSetzen(); messZeileSetzen(); status(mess.msg.text + ' Nachmessen oder Stimmt so.'); return;
    }
    mess.werte[st.k] = v; o.speichern(st.k, v); delete mess.entwurf[st.k]; mess.msg = null; mess.ack = false; mess.cmLive = false; clearTimeout(cmTimer);
    $('mess-kapseln').children[mess.i].className = 'ist-fertig';
    mess.cur = String(v); mess.gespeichert = v; mess.sperre = true; messFeld.classList.add('ist-gespeichert'); messFeldSetzen(); messZeileSetzen();
    status('Gespeichert: ' + tausend(v) + ' Millimeter.');
    if (d.activeElement === eingabe && grob()) eingabe.blur();
    halteT = setTimeout(function () { naechstes(ausTastatur); }, 350);
  }
  function messZurueck(e) {
    var tastatur = !!(e && e.detail === 0);
    if (mess.sperre) naechstes(true);
    clearTimeout(cmTimer); mess.msg = null; mess.ack = false; mess.cmLive = false;
    if (mess.passt) return passtVerlassen(tastatur);
    /* ein getipptes, noch nicht gespeichertes Maß bleibt als Entwurf stehen */
    if (mess.cur && !mess.ersetzen) mess.entwurf[schritt().k] = mess.cur;
    if (mess.i === 0 && !mess.satz) return o.zurFotos();
    if (mess.i === 0) return o.zumMessen();
    mess.i--; o.schritt(mess.satz, mess.i);
    var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : ''; mess.ersetzen = !!w; mess.mmOk = 0; messAlles(!tastatur); o.sync(mess);
    status(wortVon() + ' ' + (mess.i + 1) + ' von 4: ' + messTitelText() + (w ? ' Bisher ' + tausend(w) + ' Millimeter, Tippen ersetzt das Maß.' : ' ' + $('mess-unterzeile').textContent));
  }
  /* „Passt.“ nach dem vierten Rand (wie in der App): das Modell von vorn mit allen sechs Maßen der Öffnung; die kleinsten je Richtung
     stehen kräftig mit ihrem Wert (sie zählen), die übrigen blass. Auf der Karte das Maß, das zählt, das Element mit Rahmen und je Richtung
     die drei Messungen als Kapselreihe; die Längen sind überhöht wie in der App (das kleinste 56 Prozent, das größte voll) */
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
    $('passt-el-name').textContent = o.artName + ' mit Rahmen'; $('passt-el').textContent = tausend(pw.elW) + ' × ' + tausend(pw.elH);
    passtSpalte('passt-breite', [['oben', pw.br[0]], ['Mitte', pw.br[1]], ['unten', pw.br[2]]]);
    passtSpalte('passt-hoehe', [['links', pw.ho[0]], ['Mitte', pw.ho[1]], ['rechts', pw.ho[2]]]);
    $('passt-fuss').textContent = pw.dev ? 'Höchstens ' + pw.dev + NB + 'mm Unterschied, überhöht gezeichnet.' : 'Alle drei Maße sind gleich.';
  }
  var passtKarte = folien.messen.querySelector('.ez-karte--passt');
  function passtZeigen(ausTastatur) {
    mess.passt = true; mess.cur = ''; mess.ersetzen = false; mess.msg = null; o.passtSetzen(true); o.sync(mess);
    folien.messen.classList.add('ist-passt'); passtKarteSetzen();
    messFussSetzen(); messHoeheSetzen(); messBuehneSetzen(!ausTastatur); pilleSetzen('weiter'); if (!ausTastatur) taub(450);
    passtKarte.classList.remove('kommt'); if (!ausTastatur && !ruhig()) { void passtKarte.offsetWidth; passtKarte.classList.add('kommt'); }
    var pw = passtWerte(); status('Passt. ' + $('mess-unterzeile').textContent + ' Maueröffnung ' + tausend(pw.moW) + ' mal ' + tausend(pw.moH) + ' Millimeter.');
  }
  function passtVerlassen(tastatur) {
    mess.passt = false; folien.messen.classList.remove('ist-passt'); passtKarte.classList.remove('kommt'); o.passtSetzen(false);
    mess.i = 3; var w = mess.werte[schritt().k]; mess.cur = w ? String(w) : ''; mess.ersetzen = !!w; mess.mmOk = 0; o.sync(mess);
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
    if (!mess.passt) eingabe.focus({ preventScroll: true }); else messWeiterKnopf.focus({ preventScroll: true });
  }
  messBuehne.addEventListener('click', function (e) { if (grossOffen || mess.passt || (e.target.closest && e.target.closest('#mess-feld'))) return; grossAuf(e.detail === 0); });
  gross.addEventListener('cancel', function (e) { e.preventDefault(); grossZu(); });
  gross.addEventListener('close', grossZu);
  gross.querySelectorAll('[data-gross-zu]').forEach(function (b) { b.addEventListener('click', grossZu); });
  /* Feld: Systemtastatur mit Ziffern; Eingabe (Android „Weiter“, am Rechner Enter) wie die Pille; ein gespeichertes Maß ist beim
     Antippen markiert, Tippen ersetzt es */
  var grob = function () { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); };
  eingabe.addEventListener('input', feldGetippt);
  eingabe.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (!e.repeat) pilleTippen(true); } });
  eingabe.addEventListener('focus', function () { messFeld.classList.add('ist-aktiv'); if (mess.ersetzen && mess.cur) messFeldSetzen(); });
  eingabe.addEventListener('blur', function () { messFeld.classList.remove('ist-aktiv'); if (mess.ersetzen) messFeldSetzen(); tastaturLage(); });
  /* Offene Systemtastatur (Telefon): die Pille steht direkt über ihr, das Feld bleibt darüber sichtbar */
  var fussEl = folien.messen.querySelector('.lg-fuss');
  function tastaturLage() {
    var vv = window.visualViewport; if (!fussEl) return;
    var offen = !!vv && d.activeElement === eingabe && window.innerHeight - vv.height > 120;
    folien.messen.classList.toggle('tastatur-offen', offen); fussEl.style.transform = '';
    if (!offen) return;
    var r = fussEl.getBoundingClientRect(), dy = vv.offsetTop + vv.height - r.bottom;
    if (dy < -1) fussEl.style.transform = 'translateY(' + Math.round(dy) + 'px)';
    var fr = fussEl.getBoundingClientRect(), ir = messFeld.getBoundingClientRect(), platz = fr.top - 10 - ir.bottom;
    if (platz < 0) app.scrollTop += Math.ceil(-platz);
  }
  messWeiterKnopf.addEventListener('click', function (e) { pilleTippen(e.detail === 0); });
  $('mess-zurueck').addEventListener('click', messZurueck);
  /* Tastatur am Rechner: Ziffern, Rücktaste, Eingabe (wie die Pille); die passende Taste drückt sichtbar mit, ohne Übergang */
  var aufTaste = function (e) {
    if (!d.body.contains(folien.messen) || d.querySelector('.sheet[aria-modal="true"], .sheet-bg') || grossOffen || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    var taste = /^[0-9]$/.test(e.key) ? e.key : e.key === 'Backspace' ? 'del' : null;
    if (taste) { e.preventDefault(); messTaste(taste, true); eingabe.focus({ preventScroll: true }); }
    else if (e.key === 'Enter' && (!t || !t.closest || !t.closest('button, a'))) { e.preventDefault(); if (!e.repeat) pilleTippen(true); }
  };
  var aufTasteHoch = function () {};
  /* Größe: gebündelt; neu gerechnet wird bei anderer Breite oder anderer kleiner Bildschirmhöhe (100svh, die Adressleiste ändert sie
     nicht), in der Großansicht auch deren Rechteck am Schreibtisch */
  var groesseRaf = 0, messHoehe = 0;
  var aufGroesse = function () {
    if (!d.body.contains(folien.messen) || groesseRaf) return;
    groesseRaf = requestAnimationFrame(function () {
      groesseRaf = 0; var b = app.clientWidth, h = hoeheProbe.offsetHeight;
      if (b === messBreite && h === messHoehe && !grossOffen) return; messBreite = b; messHoehe = h;
      if (grossOffen) grossRechteck(); else { messPlatzReservieren(); messFussSetzen(); messHoeheSetzen(); }
      messBuehneSetzen(false);
    });
  };

    /* Startbild: Texte sofort (Vorlesen, Prüfungen), Lagen im nächsten Bild; „Passt.“ ohne Auftritt wiederherstellen */
    messFussSetzen(); messFeldSetzen(); messZeileSetzen();
    if (mess.passt) {
      folien.messen.classList.add('ist-passt'); passtKarteSetzen();
      [messBild, messBildFront].forEach(function (img, p) { if (img.getAttribute('src') !== bildSrc(p)) img.src = bildSrc(p); });
      requestAnimationFrame(function () { if (!da()) return; messFussSetzen(); messHoeheSetzen(); messBreite = app.clientWidth; messHoehe = hoeheProbe.offsetHeight; messBuehneSetzen(false); pilleSetzen('weiter'); });
    } else messZeigen();
    return {
      taste: aufTaste, tasteHoch: aufTasteHoch, groesse: aufGroesse, tastatur: tastaturLage,
      zurueck: function (tastatur) { messZurueck(tastatur ? { detail: 0 } : null); }
    };
  }

  window.MessenDna = {
    html: html, binden: binden,
    zurueck: function (tastatur) { if (aktuell) aktuell.zurueck(tastatur); },
    vergessen: function () { zustand = null; }
  };
})();

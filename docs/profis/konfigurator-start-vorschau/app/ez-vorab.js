/* Bühnenfenster: Anfragen der App an ihren Server (/api/...) beantwortet die Vorschau selbst mit „nicht da“ (Pilotphase ohne Server),
   damit nichts ins Leere geht; die KI-Auswertung ist aus. Keine Änderung an der App. */
(function () {
  var f0 = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (u, o) {
    var p = String(u && u.url ? u.url : u);
    if (/^\/api\//.test(p) || /^https?:/.test(p) && p.indexOf(location.origin) !== 0) return Promise.resolve(new Response('{"ok":false}', { status: 503, headers: { 'content-type': 'application/json' } }));
    return f0(u, o);
  };
  window.addEventListener('DOMContentLoaded', function () { if (window.KONFIG) window.KONFIG.ki = ''; });
  /* Eigener Speicher: Online liegt die Vorschau auf demselben Ursprung wie die App (eeziframes.com). Die App im Bühnenfenster liest und
     schreibt deshalb nur einen Speicher im Arbeitsspeicher, nie die Projekte, Entwürfe und Fotos des Geräts. */
  function speicher() {
    var m = {};
    return { getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; }, setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }, clear: function () { m = {}; }, key: function (i) { return Object.keys(m)[i] || null; }, get length() { return Object.keys(m).length; } };
  }
  try { Object.defineProperty(window, 'localStorage', { configurable: true, value: speicher() }); Object.defineProperty(window, 'sessionStorage', { configurable: true, value: speicher() }); Object.defineProperty(window, 'indexedDB', { configurable: true, value: undefined }); }
  catch (e) { /* Lässt der Browser den Speicher nicht ersetzen, lädt die App hier gar nicht; die Wünsche zeigen dann ihre Bilder */ window.stop(); return; }
  /* Bilder der App stehen mit absolutem Pfad im Markup (/bilder/…); in der Vorschau (data-pfade="relativ") liegen sie unter app/bilder/.
     Die Pfade werden beim Einsetzen umgeschrieben, die App selbst bleibt unverändert; online gelten die Pfade der Website. Das Startfoto
     der App (179 KB) ist hier nie zu sehen und wird nicht geladen (Vorlagen-Abgleich, FE 3). */
  var relativ = document.currentScript && document.currentScript.getAttribute('data-pfade') === 'relativ';
  var ih = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (ih && ih.set) Object.defineProperty(Element.prototype, 'innerHTML', { configurable: true, get: ih.get, set: function (v) { ih.set.call(this, typeof v === 'string' ? (v = v.replace(/(["'(=])\/?bilder\/foto\/app-start\.webp/g, '$1data:,'), relativ ? v.replace(/(["'(=])\/(bilder|assets)\//g, '$1$2/') : v) : v); } });
})();

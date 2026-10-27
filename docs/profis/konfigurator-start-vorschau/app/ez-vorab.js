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
  /* Bilder der App stehen mit absolutem Pfad im Markup (/bilder/…); im Bühnenfenster liegen sie unter app/bilder/. Die Pfade werden
     beim Einsetzen umgeschrieben, die App selbst bleibt unverändert. */
  var ih = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  if (ih && ih.set) Object.defineProperty(Element.prototype, 'innerHTML', { configurable: true, get: ih.get, set: function (v) { ih.set.call(this, typeof v === 'string' ? v.replace(/(["'(=])\/(bilder|assets)\//g, '$1$2/') : v); } });
})();

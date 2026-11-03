'use strict';
/* eeziframes · Schritte zählen, ohne Cookie und ohne Kennung (Inhaber, 3.11.2026; Server functions/api/schritt.js, Konzept
   docs/konzepte/2026-11-03-schritte-messen.md). Die Seite meldet, welche Folie oder Szene sie zum ersten Mal zeigt, wie lange die vorige
   ungefähr zu sehen war (drei Stufen), wo jemand Hilfe braucht und welche Folie beim Verlassen zuletzt zu sehen war. Was schon gemeldet
   ist, merkt sie sich nur im Arbeitsspeicher dieses Tabs (kein Cookie, kein localStorage, keine Nummer); nach dem Neuladen zählt es neu.
   Mit „Global Privacy Control“ oder „Do Not Track“ meldet sie nichts. Gesendet wird mit navigator.sendBeacon an die eigene Adresse. */
(function () {
  /* aus: mit Global Privacy Control oder Do Not Track, oder wenn web/config.js schritte: false setzt (Schalter für die rechtliche Prüfung) */
  const AUS = (window.KONFIG && window.KONFIG.schritte === false) || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1';
  const gemeldet = new Set();
  let letzte = '', strang = '', seit = 0, herkunft = null, ausGemeldet = false;
  /* grobe Herkunft des Tabs aus der Adresse, von der er kam (der Browser kennt sie ohnehin), und Anzeigen-Merkmalen in der eigenen Adresse */
  function herkunftKlasse() {
    if (herkunft) return herkunft;
    let h = 'direkt';
    try {
      const q = new URLSearchParams(location.search);
      if (['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'utm_source', 'utm_medium', 'utm_campaign'].some((k) => q.has(k))) h = 'anzeige';
      else if (document.referrer) {
        const r = new URL(document.referrer);
        if (r.host !== location.host) h = 'extern';
        else if (r.pathname === '/' || r.pathname === '/index.html') h = 'startseite';
        else if (r.pathname.indexOf('/ratgeber') === 0) h = 'ratgeber';
        else if (r.pathname.indexOf('/fuer-fensterbauer') === 0) h = 'fensterbauer';
        else h = 'intern';
      }
    } catch (e) { /* bleibt direkt */ }
    return (herkunft = h);
  }
  const stufe = (ms) => (ms < 30000 ? 'k' : ms < 120000 ? 'm' : 'l');
  function senden(o) {
    if (AUS) return;
    try {
      const text = new URLSearchParams(o).toString();
      if (navigator.sendBeacon && navigator.sendBeacon('/api/schritt', new Blob([text], { type: 'application/x-www-form-urlencoded' }))) return;
      fetch('/api/schritt', { method: 'POST', body: text, keepalive: true, credentials: 'same-origin', headers: { 'content-type': 'application/x-www-form-urlencoded' } }).catch(() => {});
    } catch (e) { /* dann zählt es eben nicht */ }
  }
  /* s: Strang (W, K, L, P), n: Name der Folie oder Szene; m: Merkmal (vorschau) */
  function schritt(s, n, m) {
    if (!s || !n) return;
    const jetzt = Date.now(), o = { s: s }, k = s + '|' + n;
    if (!gemeldet.has(k)) { gemeldet.add(k); o.n = n; o.h = herkunftKlasse(); if (m) o.m = m; }
    /* Verweildauer der vorigen Folie, einmal je Folie */
    if (letzte && strang === s && letzte !== n && !gemeldet.has('dauer|' + s + '|' + letzte)) { gemeldet.add('dauer|' + s + '|' + letzte); o.v = letzte; o.d = stufe(jetzt - seit); }
    if (letzte !== n || strang !== s) { letzte = n; strang = s; seit = jetzt; ausGemeldet = false; }
    if (o.n || o.v) senden(o);
  }
  /* Zeichen für Mühe auf der aktuellen Folie: hilfe, zurueck, weissnicht, fehler (je Folie und Art einmal) */
  function zeichen(art) {
    if (!letzte) return;
    const k = 'zeichen|' + strang + '|' + letzte + '|' + art; if (gemeldet.has(k)) return; gemeldet.add(k);
    senden({ s: strang, v: letzte, z: art });
  }
  /* letzte Folie beim Verlassen (auch beim Neuladen und beim Wechsel zur Kasse; die Zentrale sagt das dazu) */
  addEventListener('pagehide', () => { if (letzte && !ausGemeldet) { ausGemeldet = true; senden({ s: strang, a: letzte }); } });
  window.EzSchritt = { schritt: schritt, zeichen: zeichen, aus: AUS };
})();

/* eeziframes · Ratgeber in der Design-DNA (28.10.2026). Ohne dieses Skript steht alles und scrollt normal; mit ihm:
   1. html.ez-js (Leiste und Vorhang nur mit JavaScript),
   2. Leiste: die Kopfzeile geht beim Herunterscrollen weg und kommt beim Hochscrollen zurück (24 px Hysterese in beide Richtungen,
      Grenze einmal beim Laden gemessen); Sprünge (Inhaltsverzeichnis, Belegnummern, Bild auf) setzen den Zustand ohne Gleiten,
   3. Vorhang: Einstieg und Lesen bleiben stehen, sobald ihr Ende unten ankommt (top aus der größten Bildschirmhöhe der Ausrichtung,
      gemessen an einer 100lvh-Sonde, neu bei jeder Größenänderung der Szenen; top steht direkt am Element),
   4. „Auf dieser Seite“: der Abschnitt im Blick bekommt aria-current und den violetten Punkt (gerechnet nur, wenn ein Zwischentitel
      die Linie kreuzt),
   5. Fokus unter dem Vorhang (Tab und Umschalt+Tab, Bildschirmleser): liegt das Ziel unter einer anderen Szene, rückt die Seite
      ohne Gleiten so weit zurück, dass es frei steht (WCAG 2.4.11),
   6. Druck auf dem iPhone: ein leerer passiver touchstart, damit :active sofort greift,
   7. Szenen: das Lesen klebt erst eine Bildschirmhöhe vor seinem Ende (ist-vorhang), eine zur Hälfte überholte Szene wird nicht mehr
      gezeichnet (ist-verdeckt), gelesen wird vor dem Schreiben,
   8. Drucken: die Antworten der Fragen stehen im Druck.
   Tastatur und Sprungmarken lösen kein Gleiten aus. */
(function () {
  var d = document, h = d.documentElement;
  h.classList.add('ez-js');

  function los() {
    var kopf = d.querySelector('.rg-kopf');
    var szenen = [].slice.call(d.querySelectorAll('.rg-hero, .rg-text'));
    d.body.addEventListener('touchstart', function () {}, { passive: true });

    /* Vorhang: größte Bildschirmhöhe je Ausrichtung (die Sonde misst 100lvh, also mit eingeklappter Adressleiste) */
    var sonde = d.createElement('div'), hoehe = 0, ausrichtung = '';
    sonde.className = 'rg-hoehe'; sonde.setAttribute('aria-hidden', 'true');
    d.body.appendChild(sonde);
    function vorhang() {
      var neu = innerWidth > innerHeight ? 'quer' : 'hoch';
      if (neu !== ausrichtung) { ausrichtung = neu; hoehe = 0; }
      hoehe = Math.max(hoehe, innerHeight, sonde.offsetHeight);
      var oben = szenen.map(function (s) { return Math.min(0, hoehe - s.offsetHeight) + 'px'; });
      szenen.forEach(function (s, i) { if (s.style.top !== oben[i]) s.style.top = oben[i]; });
    }
    vorhang();
    addEventListener('resize', vorhang);
    if (window.ResizeObserver) { var ro = new ResizeObserver(vorhang); szenen.concat(sonde).forEach(function (s) { ro.observe(s); }); }
    else { addEventListener('load', vorhang); if (d.fonts && d.fonts.ready) d.fonts.ready.then(vorhang); }

    /* Leiste */
    var grenze = kopf ? kopf.offsetTop + kopf.offsetHeight : 0, letzte = scrollY, wende = scrollY, runter = true;
    function leiste(y, sprung) {
      if (!kopf) return;
      var weg = kopf.classList.contains('ist-weg'), glas = kopf.classList.contains('ist-glas');
      if (y <= grenze) { weg = false; glas = false; wende = y; runter = true; }
      else {
        if (y > letzte && !runter) { runter = true; wende = letzte; }
        else if (y < letzte && runter) { runter = false; wende = letzte; }
        if (runter && y - wende > 24) weg = true;
        if (!runter && wende - y > 24) { glas = true; weg = false; }
      }
      if (weg === kopf.classList.contains('ist-weg') && glas === kopf.classList.contains('ist-glas')) return;
      kopf.classList.toggle('ohne-gleiten', !!sprung);
      kopf.classList.toggle('ist-weg', weg);
      kopf.classList.toggle('ist-glas', glas);
    }
    /* Sprungmarken (Inhaltsverzeichnis, Brotkrumen, Tastatur) lassen die Leiste weg, damit sie das Ziel nicht verdeckt */
    addEventListener('hashchange', function () {
      if (!kopf || scrollY <= grenze) return;
      kopf.classList.add('ohne-gleiten', 'ist-weg', 'ist-glas');
      runter = true; wende = letzte = scrollY;
      abschnitt();
    });

    /* Abschnitt im Blick: die Linie liegt bei 32 % der Höhe; gerechnet wird nur, wenn ein Zwischentitel sie kreuzt */
    var links = [].slice.call(d.querySelectorAll('.rg-inhalt a[href^="#"]'));
    var ziele = links.map(function (a) { return d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); });
    var aktiv = -1;
    function abschnitt() {
      if (!links.length) return;
      var linie = innerHeight * 0.32, i = -1;
      for (var k = 0; k < ziele.length; k++) { if (ziele[k] && ziele[k].getBoundingClientRect().top <= linie) i = k; }
      if (i === aktiv) return;
      if (aktiv >= 0) links[aktiv].removeAttribute('aria-current');
      if (i >= 0) links[i].setAttribute('aria-current', 'true');
      aktiv = i;
    }
    if (links.length && window.IntersectionObserver) {
      var io = new IntersectionObserver(abschnitt, { rootMargin: '0px 0px -68% 0px' });
      ziele.forEach(function (z) { if (z) io.observe(z); });
    }

    /* Szenen: erst alle Maße lesen, dann die Klassen schreiben */
    var held = d.querySelector('.rg-hero'), lesen = d.querySelector('.rg-text'), ende = d.querySelector('.rg-ende');
    function szenenLage() {
      var H = innerHeight, t = lesen && lesen.getBoundingClientRect(), e = ende && ende.getBoundingClientRect();
      return { heldZu: !!t && t.top < -H / 2, vorhang: !!t && t.bottom < 2 * H, lesenZu: !!e && e.top < -H / 2 };
    }
    function szenenSetzen(z) {
      if (held) held.classList.toggle('ist-verdeckt', z.heldZu);
      if (lesen) { lesen.classList.toggle('ist-vorhang', z.vorhang); lesen.classList.toggle('ist-verdeckt', z.lesenZu); }
    }

    var geplant = false;
    addEventListener('scroll', function () {
      if (geplant) return;
      geplant = true;
      requestAnimationFrame(function () {
        geplant = false;
        var y = scrollY, z = szenenLage();
        if (!window.IntersectionObserver) abschnitt();
        szenenSetzen(z);
        leiste(y, Math.abs(y - letzte) > innerHeight * 0.8);
        letzte = y;
      });
    }, { passive: true });
    abschnitt();
    szenenSetzen(szenenLage());

    /* Drucken: geschlossene Fragen für den Druck öffnen und danach wieder schließen */
    addEventListener('beforeprint', function () { [].forEach.call(d.querySelectorAll('details.rg-frage:not([open])'), function (x) { x.open = true; x.setAttribute('data-druck', ''); }); });
    addEventListener('afterprint', function () { [].forEach.call(d.querySelectorAll('details[data-druck]'), function (x) { x.open = false; x.removeAttribute('data-druck'); }); });

    /* Fokus unter dem Vorhang: das Ziel liegt im Bild, aber eine andere Szene (oder der Fuß) liegt darüber */
    d.addEventListener('focusin', function (e) {
      var el = e.target;
      if (!el || !el.getBoundingClientRect || (kopf && kopf.contains(el))) return;
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var x = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
      var oben = d.elementFromPoint(x, y);
      if (!oben || el.contains(oben) || oben.contains(el)) return;
      var deck = oben.closest('.rg-szene, .rg-fuss');
      if (!deck || deck.contains(el)) return;
      scrollBy({ top: -(r.bottom + 32 - deck.getBoundingClientRect().top), behavior: 'auto' });
    });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', los); else los();
})();

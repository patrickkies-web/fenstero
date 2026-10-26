/* Startseite, Ansicht Hauseigentümer, nach der Design-DNA (seit 26.10.2026; Vorschau und Protokoll: docs/profis/startseite-dna-vorschau/,
   docs/profis/2026-10-26-startseite-dna.md). portal.js setzt in SCREENS.landing (Ansicht Hauseigentümer) einen leeren Halter #startseite
   und ruft nach jedem Aufbau Startseite.auf(halter, daten). Der Inhalt steht einmal gebaut im Schatten-DOM eines Halters, der über
   alle Aufbauten erhalten bleibt (Szenen, Beobachter und Bildlauf laufen weiter); ein neuer leerer Halter wird durch ihn ersetzt.
   Markup: <template id="startseite-dna"> in index.html; Gestaltung: startseite-dna.css (tokens, bundle, start der Vorschau, :root und
   body als :host); Bausteine: dna-bundle.js (Design-DNA, DNA.start(wurzel)); Schriften Outfit und Doto in /fonts/fonts.css.
   Daten: app (Einstieg in die App), appLabel („Jetzt konfigurieren“ bzw. „Aufmaß fortsetzen“), preis (Aufmaßblatt), einf (Satz zum
   Einführungspreis oder leer), zuBetrieb (Wechsel zur Ansicht Fensterbauer). */
(function () {
  'use strict';
  const CSS = '/assets/startseite-dna.css';
  const w = window, doc = document;
  const reduziert = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const gemeinsam = typeof CSSStyleSheet === 'function' && 'replaceSync' in CSSStyleSheet.prototype && 'adoptedStyleSheets' in Document.prototype;
  let laden = null, blatt = null, halterFest = null, wurzel = null;

  function stil() {
    if (!laden) laden = fetch(CSS, { credentials: 'same-origin' }).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
      .then((t) => { blatt = new CSSStyleSheet(); blatt.replaceSync(t); return blatt; }).catch(() => { laden = null; return null; });
    return laden;
  }

  /* Vorhang ohne Sprung: Solange die Startseite steht, rechnen die Szenen mit der größten Bildschirmhöhe dieser Ausrichtung, damit die
     ein- und ausfahrende Adressleiste die klebende Kante nicht verschiebt (dna-bundle.js liest innerHeight bei jedem resize). Sonst gilt
     die echte Höhe. */
  (function () {
    const echt = Object.getOwnPropertyDescriptor(w, 'innerHeight') || Object.getOwnPropertyDescriptor(Window.prototype, 'innerHeight');
    if (!echt || !echt.get) return;
    const lies = () => echt.get.call(w);
    let hoechste = lies(), breite = w.innerWidth, merker;
    try { Object.defineProperty(w, 'innerHeight', { configurable: true, get: () => (halterFest && halterFest.isConnected ? Math.max(hoechste, lies()) : lies()) }); } catch (e) { return; }
    w.addEventListener('resize', () => {
      clearTimeout(merker);
      merker = setTimeout(() => { const h = lies(), b = w.innerWidth; if (b !== breite) { breite = b; hoechste = h; } else if (h > hoechste) hoechste = h; }, 150);
    });
  })();

  function daten(root, d) {
    /* Einstieg in die App: Ziel aus portal.js; mit angefangenem Aufmaß heißen alle Einstiege „Aufmaß fortsetzen“, sonst wie gestaltet */
    root.querySelectorAll('a[href="/app/#ausmessen"], a[data-ez-app]').forEach((a) => {
      const t = Array.from(a.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!a.hasAttribute('data-ez-app')) a.setAttribute('data-ez-app', t ? t.textContent.trim() : '');
      a.setAttribute('href', d.app);
      if (t) t.textContent = (d.weiter ? d.appLabel : a.getAttribute('data-ez-app')) + (/\s$/.test(t.textContent) ? ' ' : '');
    });
    const weiter = root.querySelector('[data-ez="weiter"]');
    if (weiter) { weiter.hidden = !d.weiter; weiter.textContent = d.weiter ? 'Dein Aufmaß ist angefangen: ' + d.weiter + ' Fenster erfasst, gespeichert in diesem Browser.' : ''; }
    const preis = root.querySelector('[data-ez="preis"]'), zahl = root.querySelector('[data-ez="preiszahl"]');
    if (preis && d.preis) preis.textContent = d.preis.replace(' ', ' ');
    if (zahl && d.preis) zahl.textContent = d.preis.replace(/\s*€\s*$/, '');
    const einf = root.querySelector('[data-ez="einf"]'), badge = root.querySelector('[data-ez="einf-badge"]');
    if (einf) { einf.hidden = !d.einf; if (d.einf) einf.textContent = d.einf.replace(/^Einführungspreis\s*/, '').replace(/ (€|\d{4})/g, ' $1'); }
    if (badge) badge.hidden = !d.einf;
  }

  function beleben(root, d) {
    if (w.DNA && w.DNA.start) w.DNA.start(root);

    /* Leiste: verschwindet beim Lesen, kommt nach 24 px Hochscrollen zurück, nie über dem Kopf der Seite */
    const leiste = root.querySelector('.ez-leiste'), kopf = root.querySelector('.ez-kopf');
    if (leiste) {
      let letzte = w.scrollY || 0, hoch = 0, runter = 0, geplant = false, grenze = 160;
      const messeGrenze = () => { if (kopf && halterFest && halterFest.isConnected) grenze = kopf.getBoundingClientRect().bottom + (w.scrollY || 0); };
      messeGrenze(); w.addEventListener('resize', messeGrenze); w.addEventListener('load', messeGrenze);
      const pruefe = () => {
        geplant = false;
        if (!halterFest || !halterFest.isConnected) return;
        const y = w.scrollY || 0;
        if (y < letzte) { hoch += letzte - y; runter = 0; } else if (y > letzte) { runter += y - letzte; if (runter > 24) hoch = 0; }
        leiste.classList.toggle('ist-da', y > grenze && hoch > 24);
        letzte = y;
      };
      w.addEventListener('scroll', () => { if (!geplant) { geplant = true; w.requestAnimationFrame(pruefe); } }, { passive: true });
    }

    /* Stationen: die Stufe in der Bildschirmmitte ist „aktiv“, davor „fertig“, danach „offen“ */
    const stufen = Array.from(root.querySelectorAll('.ez-stufe')), stationen = Array.from(root.querySelectorAll('.ez-schritte li'));
    const setze = (aktiv) => stationen.forEach((li, i) => li.setAttribute('data-zustand', i < aktiv ? 'fertig' : i === aktiv ? 'aktiv' : 'offen'));
    if (stufen.length && stationen.length && 'IntersectionObserver' in w) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setze(stufen.indexOf(e.target)); }), { rootMargin: '-38% 0px -42% 0px', threshold: 0 });
      stufen.forEach((s) => io.observe(s));
    }

    /* Sprungmarken im Schatten-DOM: der Browser findet die Ziele nicht selbst, und Hashes steuern auf der Startseite die Ansicht.
       Stationen gleiten in die Mitte (bei „weniger Bewegung“ und Tastatur sofort); /#fensterbauer wechselt die Ansicht (portal.js). */
    root.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a || e.defaultPrevented) return;
      const href = a.getAttribute('href') || '', sofort = reduziert || e.detail === 0;
      if (href === '/#fensterbauer' && d.zuBetrieb) { e.preventDefault(); d.zuBetrieb(); return; }
      if (href === '#hauseigentuemer' || href === '/#hauseigentuemer') { e.preventDefault(); w.scrollTo({ top: 0, behavior: sofort ? 'auto' : 'smooth' }); return; }
      if (href.charAt(0) !== '#') return;
      const ziel = root.getElementById(href.slice(1)); if (!ziel) return;
      e.preventDefault();
      const i = stationen.findIndex((li) => li.contains(a));
      ziel.scrollIntoView({ behavior: sofort ? 'auto' : 'smooth', block: i >= 0 ? 'center' : 'start' });
      if (a.classList.contains('ez-skip')) { if (!ziel.hasAttribute('tabindex')) ziel.setAttribute('tabindex', '-1'); ziel.focus({ preventScroll: true }); }
    });

    /* Fokus unter dem Vorhang: liegt das fokussierte Element verdeckt, in die Mitte holen (WCAG 2.4.11) */
    root.addEventListener('focusin', (e) => {
      const el = e.target; if (!el || !el.getBoundingClientRect) return;
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const x = Math.min(Math.max(r.left + r.width / 2, 0), w.innerWidth - 1), y = Math.min(Math.max(r.top + r.height / 2, 0), w.innerHeight - 1);
      const oben = root.elementFromPoint(x, y);
      if (oben && !el.contains(oben) && !oben.contains(el)) el.scrollIntoView({ behavior: 'auto', block: 'center' });
    });
  }

  function auf(halter, d) {
    if (!halter) return;
    /* schon gebaut: den neuen leeren Halter durch den bestehenden ersetzen, nur die Daten nachziehen */
    if (halterFest && halter !== halterFest) { halter.replaceWith(halterFest); daten(wurzel, d); return; }
    if (halter.shadowRoot) return;
    const vorlage = doc.getElementById('startseite-dna'); if (!vorlage) return;
    halterFest = halter;
    wurzel = halter.attachShadow({ mode: 'open' });
    wurzel.appendChild(vorlage.content.cloneNode(true));
    daten(wurzel, d);
    /* Bausteine erst starten, wenn die Gestaltung steht: Szenen und Leiste messen beim Start */
    const los = () => { halter.style.visibility = ''; beleben(wurzel, d); };
    const perLink = () => { const l = doc.createElement('link'); l.rel = 'stylesheet'; l.href = CSS; l.onload = l.onerror = los; wurzel.prepend(l); };
    if (gemeinsam && blatt) { wurzel.adoptedStyleSheets = [blatt]; los(); }
    else { halter.style.visibility = 'hidden'; if (gemeinsam) stil().then((s) => { if (s) { wurzel.adoptedStyleSheets = [s]; los(); } else perLink(); }); else perLink(); }
  }

  if (gemeinsam) stil(); // früh laden, damit der erste Aufbau nicht wartet
  w.Startseite = { auf: auf };
})();

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

  /* Vom Besucher gewählte Rahmenfarbe im Hero (Schlüssel aus ral.js, null bis zum ersten Tipp); die Pille „Kostenlos losplanen“ nimmt
     sie mit in die App, die sie als Rahmenfarbe außen des ersten Fensters setzt (Vertrag mit app.js: /app/?farbe=<schlüssel>#ausmessen) */
  let farbe = null, letzteDaten = null;
  const losZiel = (f) => '/app/?farbe=' + encodeURIComponent(f) + '#ausmessen';
  function losPille(root, d) {
    const a = root.querySelector('a[data-ez="los"]'); if (!a) return;
    const t = Array.from(a.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
    /* angefangenes Aufmaß: fortsetzen statt neu beginnen (die Farbe überschriebe sonst das erste Fenster des Aufmaßes) */
    /* ohne gewählte Farbe ohne Vorgabe: das Fenster, das gerade im Hero steht, ist kein Wunsch des Besuchers */
    a.setAttribute('href', d && d.weiter ? d.app : farbe ? losZiel(farbe) : (d && d.app) || '/app/#ausmessen');
    if (t) t.textContent = (d && d.weiter ? d.appLabel : 'Kostenlos losplanen') + ' ';
  }

  function daten(root, d) {
    letzteDaten = d;
    losPille(root, d);
    /* Einstieg in die App: Ziel aus portal.js; mit angefangenem Aufmaß heißen alle Einstiege „Aufmaß fortsetzen“, sonst wie gestaltet */
    root.querySelectorAll('a[href="/app/#ausmessen"]:not([data-ez="los"]), a[data-ez-app]:not([data-ez="los"])').forEach((a) => {
      const t = Array.from(a.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!a.hasAttribute('data-ez-app')) a.setAttribute('data-ez-app', t ? t.textContent.trim() : '');
      a.setAttribute('href', d.app);
      if (t) t.textContent = (d.weiter ? d.appLabel : a.getAttribute('data-ez-app')) + (/\s$/.test(t.textContent) ? ' ' : '');
    });
    const weiter = root.querySelector('[data-ez="weiter"]');
    if (weiter) { weiter.hidden = !d.weiter; weiter.textContent = d.weiter ? 'Dein Aufmaß ist angefangen: ' + d.weiter + ' Fenster erfasst, gespeichert in diesem Browser.' : ''; }
    const zahl = root.querySelector('[data-ez="preiszahl"]');
    if (d.preis) root.querySelectorAll('[data-ez="preis"]').forEach((p) => { p.textContent = d.preis.replace(' ', '\u00a0'); });
    if (zahl && d.preis) zahl.textContent = d.preis.replace(/\s*€\s*$/, '');
    const einf = root.querySelector('[data-ez="einf"]'), badge = root.querySelector('[data-ez="einf-badge"]');
    if (einf) { einf.hidden = !d.einf; if (d.einf) einf.textContent = d.einf.replace(/^Einführungspreis\s*/, '').replace(/ (€|\d{4})/g, ' $1'); }
    if (badge) badge.hidden = !d.einf;
  }

  /* Vorhang: Eine Szene, die höher ist als der Bildschirm, klebt erst, wenn ihr Ende unten angekommen ist (--dna-szene-oben). dna-bundle.js
     setzt das nur für Szenen im Dokument, nicht im Schatten-DOM; ohne den Versatz bliebe der untere Teil hoher Szenen unerreichbar. */
  let ordneSzenen = () => {};
  function vorhang(root) {
    const szenen = Array.from(root.querySelectorAll('.dna-szene'));
    if (!szenen.length) return;
    ordneSzenen = () => {
      if (!halterFest || !halterFest.isConnected) return;
      const h = w.innerHeight || 0;
      szenen.forEach((s) => s.style.setProperty('--dna-szene-oben', Math.min(0, h - s.offsetHeight) + 'px'));
    };
    ordneSzenen();
    w.addEventListener('resize', ordneSzenen); w.addEventListener('load', ordneSzenen);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(ordneSzenen);
    if ('ResizeObserver' in w) { const ro = new ResizeObserver(ordneSzenen); szenen.forEach((s) => ro.observe(s)); }
  }

  /* ---------- Dreh-Betrachter im Hero ----------
     Drei Fenster aus dem 3-D-Modell der App wechseln sich ab (Inhaber, 29.10.2026): grau mit Raffstore, weiß mit Sprossen, weiß
     dreiteilig mit Rollladen (data-modelle; Bildfolgen je Modell und Farbe von scripts/hero-fenster.mjs, ein Raster aus data-bilder
     Blickwinkeln in data-spalten Spalten, von data-von Grad in Schritten von data-schritt Grad). Zuerst steht der Ruhewinkel des ersten
     Fensters als eigenes Bild (LCP); nach dem Laden kommt seine Folge dazu, dann pendelt es langsam. Alle TAKT ms kommt das nächste
     Fenster. Solange jemand dreht (Finger, Maus, Tastatur) oder die Maus darüber steht, bleibt es; nach dem Loslassen kommt das nächste.
     Die Farbe wählt der Besucher frei, sie gilt dann für alle drei und bleibt; bis dahin zeigt jedes seine Vorgabe. Zwei Ebenen blenden
     zwischen benachbarten Winkeln über, damit das Drehen ohne Stufen läuft. Bei „weniger Bewegung“ weder Pendeln noch Wechsel von
     selbst, nach dem Loslassen nur ein Überblenden. Außerhalb des Bildschirms und im Hintergrund-Tab steht alles. */
  const BILDER = '/bilder/start/fenster/';
  function dreh(root) {
    const el = root.querySelector('[data-ez="dreh"]'); if (!el) return;
    const flaeche = el.querySelector('.ez-dreh__fenster'), modellEl = el.querySelector('.ez-dreh__modell'), ruhe = el.querySelector('.ez-dreh__ruhe'), lagen = Array.from(el.querySelectorAll('.ez-dreh__bild'));
    const knoepfe = Array.from(root.querySelectorAll('.ez-farbe[data-farbe]')), gruppe = root.querySelector('.ez-farben'), nameEl = el.querySelector('[data-ez="modellname"]');
    const N = +el.dataset.bilder || 1, SP = +el.dataset.spalten || 1, ZE = Math.ceil(N / SP), RUHE = +el.dataset.ruhe || 0, VON = +el.dataset.von || 0, SCHRITT = +el.dataset.schritt || 1;
    const MITTE = (N - 1) / 2, AMP = Math.max(0, MITTE - 0.6), DAUER = 10000, BLENDE = 1400, TAKT = 7000, NACH_LOS = 900;
    const klemme = (v) => Math.min(N - 1, Math.max(0, v));
    let MODELLE = []; try { MODELLE = JSON.parse(el.dataset.modelle || '[]'); } catch (e) { MODELLE = []; }
    if (!flaeche || !modellEl || !ruhe || lagen.length < 2 || N < 2 || !MODELLE.length) return;
    let mi = Math.max(0, MODELLE.findIndex((m) => m.k === el.dataset.modell));
    const farbeVon = (m) => farbe || m.f, schl = (m) => m.k + '-' + farbeVon(m);
    let schluessel = schl(MODELLE[mi]);
    const skala = el.querySelector('.ez-dreh__skala'), striche = [];
    if (skala && !skala.children.length) for (let i = 0; i < N; i++) { const s = doc.createElement('span'); if (Math.abs(VON + i * SCHRITT) < SCHRITT / 2) s.className = 'ist-mitte'; skala.appendChild(s); }
    if (skala) striche.push(...skala.children);

    let pos = RUHE, folge = null, gestoppt = reduziert, sichtbar = true, raf = 0, ziehen = null, t0 = 0, phase = 0, blendeAb = 0, blendeVon = RUHE;
    let altI = -1, altF = -1, altK = -1, uhr = 0, ueber = false, fokus = false, wechselt = false, zwingend = false;
    const geladen = {}, laden = {}, sparen = !!(navigator.connection && navigator.connection.saveData);
    const feld = (i) => (SP > 1 ? (i % SP) / (SP - 1) * 100 : 0) + '% ' + (ZE > 1 ? Math.floor(i / SP) / (ZE - 1) * 100 : 0) + '%';
    function wert(k) {
      const g = Math.round(VON + k * SCHRITT);
      flaeche.setAttribute('aria-valuenow', String(g));
      flaeche.setAttribute('aria-valuetext', g === 0 ? 'Blick von vorn' : 'Blick von ' + (g < 0 ? 'rechts' : 'links') + ', ' + Math.abs(g) + ' Grad');
    }
    function zeige() {
      const p = klemme(pos), i = Math.floor(p), f = Math.round((p - i) * 24) / 24;
      if (folge) {
        if (i !== altI) { lagen[0].style.backgroundPosition = feld(i); lagen[1].style.backgroundPosition = feld(Math.min(N - 1, i + 1)); altI = i; }
        if (f !== altF) { lagen[1].style.opacity = String(f); altF = f; }
      }
      const k = Math.round(p);
      if (k !== altK) { if (striche[altK]) striche[altK].classList.remove('ist-da'); if (striche[k]) striche[k].classList.add('ist-da'); altK = k; wert(k); }
    }
    function setzeFolge(k, url) {
      lagen.forEach((l, i) => { l.style.backgroundImage = 'url("' + url + '")'; l.style.opacity = i ? '0' : '1'; });
      altI = -1; altF = -1; folge = k; el.classList.add('ist-folge'); zeige(); weiter();
    }
    function lade(k) {
      if (!laden[k]) laden[k] = new Promise((ok, nein) => {
        const im = new Image(); im.decoding = 'async';
        im.onload = () => { const fertig = () => { geladen[k] = im.src; ok(im.src); }; if (im.decode) im.decode().then(fertig, fertig); else fertig(); };
        im.onerror = () => { delete laden[k]; nein(new Error('Bildfolge ' + k)); };
        im.src = BILDER + k + '.webp';
      });
      return laden[k];
    }
    const nimm = (k) => lade(k).then((url) => { if (schluessel === k && folge !== k) setzeFolge(k, url); }, () => { /* ohne Folge bleibt das Ruhebild */ });
    /* das nächste Fenster vorab: erst sein Ruhebild, dann seine Folge (nicht bei „Daten sparen“) */
    function vorab() {
      if (MODELLE.length < 2) return;
      const k = schl(MODELLE[(mi + 1) % MODELLE.length]), im = new Image(); im.decoding = 'async'; im.src = BILDER + k + '-ruhe.webp';
      if (!sparen) lade(k).catch(() => {});
    }

    /* Pendeln: Sinus um die Mitte; beim Start und nach einer Pause blendet die Bewegung aus dem Stand weich ein */
    const laeuft = () => !!folge && !gestoppt && !wechselt && sichtbar && !doc.hidden && !ziehen && !!(halterFest && halterFest.isConnected);
    function weiter() {
      if (raf || !laeuft()) return;
      const s = AMP ? Math.max(-1, Math.min(1, (pos - MITTE) / AMP)) : 0;
      phase = Math.asin(s); t0 = performance.now(); blendeAb = t0; blendeVon = pos;
      raf = w.requestAnimationFrame(schritt);
    }
    function schritt(t) {
      raf = 0; if (!laeuft()) return;
      const ziel = MITTE + AMP * Math.sin(phase + (t - t0) / DAUER * 2 * Math.PI), b = Math.min(1, (t - blendeAb) / BLENDE), e = b * b * (3 - 2 * b);
      pos = blendeVon + (ziel - blendeVon) * e; zeige();
      raf = w.requestAnimationFrame(schritt);
    }
    function halt() { gestoppt = true; el.classList.add('ist-bedient'); if (raf) { w.cancelAnimationFrame(raf); raf = 0; } }

    /* Wechsel: von selbst alle TAKT ms (nicht bei „weniger Bewegung“), nach dem Loslassen nach NACH_LOS ms (auch bei „weniger Bewegung“,
       dann nur überblendet); während jemand dreht, die Maus darüber steht oder der Regler den Fokus hat, wartet der Wechsel von selbst,
       der nach dem Loslassen nur, solange gedreht wird */
    function planen(ms, muss) {
      w.clearTimeout(uhr); uhr = 0; zwingend = !!muss;
      if (MODELLE.length < 2 || (reduziert && !muss)) return;
      uhr = w.setTimeout(takt, ms == null ? TAKT : ms);
    }
    function takt() {
      uhr = 0;
      if (ziehen || (!zwingend && (fokus || ueber)) || !sichtbar || doc.hidden || wechselt || !(halterFest && halterFest.isConnected)) { uhr = w.setTimeout(takt, 1200); return; }
      wechsle();
    }
    function beschrifte() {
      const m = MODELLE[mi], f = farbeVon(m), b = knoepfe.find((x) => x.dataset.farbe === f);
      const name = b ? b.textContent.split(',')[0].trim() : f, code = b ? (b.textContent.split(',')[1] || '').trim() : '';
      knoepfe.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const nm = root.querySelector('[data-ez="farbname"]'), cd = root.querySelector('[data-ez="farbcode"]');
      if (nm) nm.textContent = name; if (cd) cd.textContent = code;
      if (nameEl) nameEl.textContent = m.n || '';
      flaeche.setAttribute('aria-label', 'Fenster drehen: ' + (m.n ? m.n + ', ' : '') + 'Rahmen außen ' + name);
      el.dataset.modell = m.k; el.dataset.farbe = f;
    }
    function wechsle() {
      if (wechselt || MODELLE.length < 2) return;
      const ni = (mi + 1) % MODELLE.length, k = schl(MODELLE[ni]);
      wechselt = true; zwingend = false; w.clearTimeout(uhr); uhr = 0;
      if (raf) { w.cancelAnimationFrame(raf); raf = 0; }
      const bild = new Image(); bild.decoding = 'async'; bild.src = BILDER + k + '-ruhe.webp';
      const bereit = (bild.decode ? bild.decode() : Promise.resolve()).catch(() => {});
      const kann = typeof modellEl.animate === 'function';
      const aus = reduziert || !kann ? null : modellEl.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px) scale(.965)' }], { duration: 220, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' });
      Promise.all([aus ? aus.finished.catch(() => {}) : null, bereit]).then(() => {
        mi = ni; schluessel = k; pos = RUHE; gestoppt = reduziert;
        folge = null; el.classList.remove('ist-folge'); lagen.forEach((l) => { l.style.opacity = '0'; });
        ruhe.src = BILDER + k + '-ruhe.webp'; altI = -1; altF = -1; altK = -1; beschrifte(); zeige();
        if (kann) modellEl.getAnimations().forEach((a) => a.cancel());
        const ein = kann ? modellEl.animate(reduziert ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(-6px) scale(1.035)' }, { opacity: 1, transform: 'none' }], { duration: reduziert ? 200 : 460, easing: 'cubic-bezier(.22,1,.36,1)' }) : null;
        const fertig = () => { wechselt = false; if (geladen[k]) { setzeFolge(k, geladen[k]); vorab(); } else nimm(k).then(vorab); planen(); };
        if (ein) ein.finished.then(fertig, fertig); else fertig();
      });
    }
    if ('IntersectionObserver' in w) new IntersectionObserver((es) => { es.forEach((e) => { sichtbar = e.isIntersecting; }); weiter(); }, { threshold: 0.15 }).observe(el);
    doc.addEventListener('visibilitychange', weiter);
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') ueber = true; });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') ueber = false; });

    /* Ziehen: erst ab 6 px waagerecht, sonst gehört die Geste dem Scrollen; nur der erste Finger zählt */
    flaeche.addEventListener('pointerdown', (e) => {
      if (ziehen || wechselt || (e.pointerType === 'mouse' && e.button !== 0)) return;
      ziehen = { id: e.pointerId, x: e.clientX, y: e.clientY, p: pos, an: false };
      if (!folge) nimm(schluessel);
    });
    flaeche.addEventListener('pointermove', (e) => {
      if (!ziehen || e.pointerId !== ziehen.id) return;
      const dx = e.clientX - ziehen.x, dy = e.clientY - ziehen.y;
      if (!ziehen.an) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { ziehen = null; weiter(); return; }
        if (Math.abs(dx) < 6) return;
        ziehen.an = true; ziehen.x = e.clientX; halt(); flaeche.classList.add('ist-gezogen');
        try { flaeche.setPointerCapture(e.pointerId); } catch (x) { /* schon losgelassen */ }
      }
      pos = klemme(ziehen.p + (e.clientX - ziehen.x) / Math.max(6, flaeche.clientWidth / 16)); zeige();
    });
    const loslassen = (e) => {
      if (!ziehen || e.pointerId !== ziehen.id) return;
      const war = ziehen.an; ziehen = null; flaeche.classList.remove('ist-gezogen');
      if (!war) { weiter(); return; }
      /* nach dem Loslassen kommt das nächste Fenster (Inhaber: „wenn er loslässt, switcht ein anderes an die Stelle“) */
      planen(NACH_LOS, true);
      /* bis dahin auf den nächsten Blickwinkel einrasten (160 ms), damit kein Zwischenbild aus zwei Winkeln stehen bleibt */
      const von = pos, nach = Math.round(pos), a = performance.now();
      if (reduziert || von === nach) { pos = nach; zeige(); return; }
      const rast = (t) => { const b = Math.min(1, (t - a) / 160); pos = von + (nach - von) * (1 - Math.pow(1 - b, 3)); zeige(); if (b < 1 && !ziehen && !wechselt) w.requestAnimationFrame(rast); };
      w.requestAnimationFrame(rast);
    };
    flaeche.addEventListener('pointerup', loslassen); flaeche.addEventListener('pointercancel', loslassen);
    flaeche.addEventListener('lostpointercapture', loslassen);
    flaeche.addEventListener('dragstart', (e) => e.preventDefault());
    /* Tastatur: sofort, ohne Gleiten; solange der Regler den Fokus hat, bleibt das Fenster */
    flaeche.addEventListener('focus', () => { if (flaeche.matches(':focus-visible')) { fokus = true; halt(); } });
    flaeche.addEventListener('blur', () => { if (fokus) { fokus = false; planen(); } });
    flaeche.addEventListener('keydown', (e) => {
      const k = Math.round(pos), z = { ArrowRight: k + 1, ArrowUp: k + 1, ArrowLeft: k - 1, ArrowDown: k - 1, PageUp: k + 4, PageDown: k - 4, Home: 0, End: N - 1 }[e.key];
      if (z == null) return;
      e.preventDefault(); fokus = true; halt(); if (!folge) nimm(schluessel);
      pos = klemme(z); zeige();
    });

    /* Farbfelder: ein Tipp, und der Rahmen wechselt; die Farbe gilt ab dann für alle Fenster. Ist die Folge noch nicht da, steht ihr
       Ruhebild, bis sie geladen ist. Danach wieder die volle Zeit bis zum nächsten Fenster */
    function waehle(f) {
      if (!f || f === farbeVon(MODELLE[mi]) && farbe) return;
      farbe = f; beschrifte(); losPille(root, letzteDaten);
      const k = schl(MODELLE[mi]); schluessel = k;
      if (!wechselt) {
        if (geladen[k]) setzeFolge(k, geladen[k]);
        else { folge = null; el.classList.remove('ist-folge'); if (raf) { w.cancelAnimationFrame(raf); raf = 0; } ruhe.src = BILDER + k + '-ruhe.webp'; pos = RUHE; zeige(); nimm(k); }
      }
      planen();
    }
    /* erste Berührung der Farbfelder: die angetippte Farbe des aktuellen Fensters zuerst, die übrigen Farben danach nacheinander */
    let vorFarben = false;
    const farbenVorab = (e) => {
      if (vorFarben || sparen) return; vorFarben = true;
      const b = e && e.target && e.target.closest ? e.target.closest('.ez-farbe') : null, zuerst = b ? b.dataset.farbe : farbeVon(MODELLE[mi]), m = MODELLE[mi];
      knoepfe.map((x) => x.dataset.farbe).filter((f) => f !== zuerst).reduce((p, f) => p.then(() => lade(m.k + '-' + f)).catch(() => {}), lade(m.k + '-' + zuerst).catch(() => {}));
    };
    knoepfe.forEach((x) => x.addEventListener('click', () => waehle(x.dataset.farbe)));
    if (gruppe) { gruppe.addEventListener('pointerdown', farbenVorab, { passive: true }); gruppe.addEventListener('focusin', farbenVorab); }

    /* erstes Bild sofort (im Markup, mit Maßen), die Folge des ersten Fensters nach dem Laden der Seite, dann das nächste vorab */
    beschrifte(); zeige();
    const nachLaden = () => { nimm(schluessel).then(() => w.setTimeout(vorab, 1500)); planen(); };
    if (doc.readyState === 'complete') nachLaden(); else w.addEventListener('load', nachLaden, { once: true });
  }

  /* ---------- Schritt 1: Fenster für Fenster einplanen (Hausfoto des Inhabers) ----------
     Die Fenster des Hauses werden nacheinander als geplant markiert, das Etikett steht am aktuellen Fenster („Fenster 2 von 5 · geplant“).
     Ein Durchlauf dauert gut 7 s; er läuft nur, solange das Bild zu sehen ist, und höchstens dreimal, danach bleibt das Endbild stehen.
     Bei „weniger Bewegung“ steht sofort das Endbild: alle Fenster geplant. */
  function fassade(root) {
    const el = root.querySelector('[data-ez="fassade"]'); if (!el) return;
    const fenster = Array.from(el.querySelectorAll('.ez-fassade__f')), etikett = el.querySelector('.ez-fassade__etikett'), nr = el.querySelector('[data-ez="fassade-n"]'), n = fenster.length;
    if (!n || !etikett) return;
    let k = n, runde = 0, uhr = 0, sichtbar = false;
    function platziere() {
      const f = fenster[Math.max(0, k - 1)], b = el.getBoundingClientRect(), r = f.getBoundingClientRect(), e = (etikett.firstElementChild || etikett).getBoundingClientRect();
      if (!b.width || !e.width) return;
      const halb = e.width / 2 + 8, x = Math.min(b.width - halb, Math.max(halb, r.left - b.left + r.width / 2)), oben = r.top - b.top - e.height - 12 >= 6;
      etikett.style.left = x + 'px'; etikett.style.top = (oben ? r.top - b.top : r.bottom - b.top + e.height + 24) + 'px';
    }
    function setze(neu, sanft) {
      k = neu;
      fenster.forEach((f, i) => f.setAttribute('data-zustand', i < k - 1 ? 'geplant' : i === k - 1 ? 'aktiv' : 'offen'));
      if (k === n && !sanft) fenster[n - 1].setAttribute('data-zustand', 'geplant');
      if (!k) { etikett.classList.add('ist-weg'); return; }
      const text = 'Fenster ' + k + ' von ' + n;
      if (!sanft || reduziert) { if (nr) nr.textContent = text; platziere(); etikett.classList.remove('ist-weg'); return; }
      etikett.classList.add('ist-weg');
      w.setTimeout(() => { if (nr) nr.textContent = text; platziere(); etikett.classList.remove('ist-weg'); }, 130);
    }
    function takt() {
      uhr = 0; if (!sichtbar || !(halterFest && halterFest.isConnected)) return;
      if (k >= n) { runde++; if (runde > 3) { setze(n, false); return; } setze(0, true); uhr = w.setTimeout(takt, 700); return; }
      setze(k + 1, true);
      uhr = w.setTimeout(takt, k >= n ? 2600 : 1000);
    }
    setze(n, false);
    w.addEventListener('resize', () => platziere());
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => platziere());
    if (reduziert) return;
    if ('IntersectionObserver' in w) new IntersectionObserver((es) => es.forEach((e) => {
      sichtbar = e.isIntersecting;
      if (sichtbar && !uhr && runde <= 3) uhr = w.setTimeout(takt, 500);
      if (!sichtbar && uhr) { w.clearTimeout(uhr); uhr = 0; }
    }), { threshold: 0.5 }).observe(el);
  }

  function beleben(root, d) {
    if (w.DNA && w.DNA.start) w.DNA.start(root);
    vorhang(root);
    dreh(root);
    fassade(root);

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
       Stationen gleiten in die Mitte (bei „weniger Bewegung“ und Tastatur sofort); /fensterbauer wechselt die Ansicht (portal.js). */
    root.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a || e.defaultPrevented) return;
      const href = a.getAttribute('href') || '', sofort = reduziert || e.detail === 0;
      if ((href === '/fensterbauer' || href === '/#fensterbauer') && d.zuBetrieb) { e.preventDefault(); d.zuBetrieb(); return; }
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
    if (halterFest && halter !== halterFest) { halter.replaceWith(halterFest); daten(wurzel, d); ordneSzenen(); return; }
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

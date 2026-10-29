/* Abschluss-Folien des Konfigurators (nach Schritt 6 „Wünsche“): Gespeichert, Fürs Angebot 1–3, Aufmaßblatt, Kasse, Freigeschaltet, Teilen.
   Ablauf, Texte, Prüfungen und Fehlertexte aus web/assets/app.js (SCREENS.fertig, anfrage, anfrage2, anfrage3, teilen, konto, kasse, gekauft;
   Aktionen setp, bumpp, k-start, k-next, k-buy, teil-copy, teil-mark), Weg ohne Betrieb in der Pilotphase (ohne Server: Kasse als Testkauf).
   Preis und Einführungspreis wie web/config.js (preise.aufmass 7,99 €, mwst, einfuehrung bis 17. November, danach 12,99 €; der Text wie
   Abrechnung.einfText in modell.js); Stand der AGB wie functions/api/recht.js (AGB_STAND 2026-10-18). Nutzt nur window.ezVorschau aus start.js. */
(function () {
  'use strict';
  var E = window.ezVorschau, d = document; if (!E) return;
  var $ = function (id) { return d.getElementById(id); };
  var NB = ' ';

  /* ---------- Werte der App ---------- */
  var PREIS = 7.99, MWST = true, EINF = { ende: '2026-11-17T23:00:00Z', bis: '17. November', danach: 12.99 }, GRENZE_FREI_TAGE = 7;
  var euro = function (n) { return n.toFixed(2).replace('.', ',') + NB + '€'; };
  var einfText = function () { return Date.now() < Date.parse(EINF.ende) ? 'Einführungspreis bis ' + EINF.bis + ', danach ' + euro(EINF.danach) : ''; };
  /* Daten wie Blatt und Kasse: „3. November“ mit geschütztem Leerzeichen (Typografie 2) */
  var datumKurz = function (ms) { try { return new Date(ms).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' }).replace(' ', NB); } catch (e) { return ''; } };
  var ART_LABEL = { fenster: 'Fenster', balkon: 'Balkon- oder Terrassentür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür', fsw: 'Faltschiebewand' };
  var LAB = {
    gebaeude: { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Eigentumswohnung', denkmal: 'Denkmalschutz' },
    zeit: { asap: 'So bald wie möglich', '3m': 'In 1 bis 3 Monaten', '6m': 'In 3 bis 6 Monaten', '12m': 'Später, erst Angebote' },
    budget: { b1: 'bis 5.000 €', b2: '5.000 bis 10.000 €', b3: '10.000 bis 20.000 €', b4: 'über 20.000 €', b0: 'Weiß ich noch nicht' }
  };
  /* Was der gewählte Förderweg bedeutet (FOERD_HINWEIS der App) und die Zahl dazu auf der Bühne */
  var FOERD_HINWEIS = {
    bafa: '15 % Zuschuss vom BAFA. Ein Energieeffizienz-Experte begleitet den Antrag, gestellt wird er vor Beginn der Arbeiten; den Vertrag erst mit Förderklausel unterschreiben. Die Fenster müssen gut dämmen (Uw höchstens 0,95). Dein Fensterbauer plant das ein.',
    steuer: '20 % der Kosten über drei Jahre von der Steuer abziehen, wenn du selbst im Haus wohnst und es älter als zehn Jahre ist. Dein Fensterbauer stellt die Bescheinigung aus; die Fenster müssen gut dämmen (Uw höchstens 0,95).',
    offen: 'Dein Fensterbauer zeigt dir beide Wege: Zuschuss vom BAFA oder Steuerbonus. Für den Zuschuss muss der Antrag vor Beginn gestellt sein.'
  };
  /* Förderung als Zahl nur mit Bedingung (Veto im Gremium: keine Zusage ohne Bedingung) */
  var FOERD_ZAHL = { bafa: ['15', 'Zuschuss vom BAFA, nur unter Bedingungen'], steuer: ['20', 'Steuerbonus über drei Jahre, nur unter Bedingungen'] };
  /* Erklärungen (GLOSS der App) */
  var GLOSS = {
    angaben: { t: 'Wozu die Angaben zum Haus?', x: ['Gebäude und Baujahr helfen deinem Fensterbauer, das Richtige anzubieten: Im Altbau ist mehr zu erwarten, im Baudenkmal gelten eigene Regeln. Aus der Zahl aller Fenster ergibt sich, ob ein Lüftungskonzept nötig wird.', 'Zeit, Budget und Förderung zeigen ihm, wie er planen soll. Alles ist freiwillig.'], tipp: 'Bist du unsicher, wähle die nächstliegende Antwort. Dein Fensterbauer fragt ohnehin noch einmal nach.' },
    gebaeude: { t: 'Warum spielt die Art des Gebäudes eine Rolle?', x: ['In einer Eigentumswohnung gehören die Fenster meist zum Gemeinschaftseigentum. Dann muss die Eigentümerversammlung dem Tausch zustimmen, oft auch Farbe und Teilung.', 'Steht das Haus unter Denkmalschutz, braucht der Tausch eine Genehmigung. Material, Sprossen und Farbe können vorgeschrieben sein.'], tipp: 'Kläre die Zustimmung, bevor du Angebote einholst. Dann weißt du, was überhaupt geht.' },
    baujahr: { t: 'Wozu das Baujahr?', x: ['Am Baujahr erkennt dein Fensterbauer, was ihn erwartet: In älteren Häusern sind Öffnungen oft nicht im Winkel, Rollladenkästen schlecht gedämmt und Wände anders aufgebaut.', 'Für den Steuerbonus muss das Haus älter als zehn Jahre sein. Fensterbänke aus Faserzement, verbaut bis 1993, werden vor dem Ausbau auf Asbest geprüft.'], tipp: 'Kennst du das Jahr nicht genau, reicht die Spanne. Oft steht es im Kaufvertrag oder in der Bauakte.' },
    lueftung: { t: 'Brauche ich ein Lüftungskonzept?', x: ['Neue Fenster sind sehr dicht. Wird mehr als ein Drittel der Fenster getauscht, ist nach der Norm DIN 1946-6 ein Lüftungskonzept erforderlich. Es zeigt, ob zusätzlich gelüftet werden muss, damit kein Schimmel entsteht.', 'Oft reichen kleine Lüfter im Fensterfalz. Um das Konzept kümmert sich dein Fensterbauer.'], tipp: 'Lüfter im Fensterfalz arbeiten ohne Strom und fallen kaum auf. Frag danach, wenn ein Konzept nötig wird.' },
    echt: { t: 'Was ist eine glasteilende Sprosse?', x: ['Das klassische Original: Jedes Feld hat seine eigene Scheibe, die Sprosse trägt das Glas. Sehr authentisch und im Denkmalschutz oft gefordert.', 'Dafür teurer, mit mehr Rahmenanteil und etwas schlechterer Dämmung, weil jede kleine Scheibe einen eigenen Rand hat.'], tipp: 'Im Baudenkmal vorher bei der Denkmalbehörde fragen, welche Sprosse sie verlangt.' },
    zeitraum: { t: 'Wann soll es losgehen?', x: ['Fenster werden nach dem Feinaufmaß einzeln gefertigt. Bis zum Einbau vergehen meist einige Wochen, in der Saison auch mehr.', 'Mit deinem Zeitraum plant der Fensterbauer Termin und Lieferung. Willst du erst Angebote vergleichen, wähle „Später, erst Angebote“.'], tipp: 'Für den Zuschuss vom BAFA muss der Antrag vor Beginn gestellt sein. Plane dafür ein paar Wochen ein.' },
    budget: { t: 'Warum fragt die App nach dem Budget?', x: ['Mit deinem Budget kann der Fensterbauer gezielt anbieten: wo es sich lohnt, mehr auszugeben, und wo die einfache Lösung reicht.', 'Die Angabe ist freiwillig und bindet dich nicht. „Weiß ich noch nicht“ ist eine gute Antwort, wenn du erst Preise kennenlernen willst.'], tipp: 'Denk an das Drumherum: Fensterbänke, Rollläden, Putz und Entsorgung machen einen spürbaren Teil des Preises aus.' },
    foerderung: { t: 'BAFA-Zuschuss oder Steuerbonus?', x: ['BAFA: 15 % Zuschuss für neue Fenster und Außentüren. Ein Energieeffizienz-Experte muss den Antrag begleiten, gestellt wird er vor Beginn der Arbeiten. Den Vertrag erst mit Förderklausel unterschreiben.', 'Steuerbonus: 20 % der Kosten über drei Jahre von der Steuer abziehen, für selbst bewohnte Häuser, die älter als zehn Jahre sind. Der Fachbetrieb stellt eine Bescheinigung nach amtlichem Muster aus.', 'Beides gilt nur, wenn die Fenster gut dämmen: Uw höchstens 0,95, mit Einbruchschutz RC2 oder barrierearmer Schwelle höchstens 1,1. Für dieselben Fenster gibt es nur eins von beiden.'], tipp: 'Unterschreibe keinen Vertrag, bevor der Förderweg geklärt ist. Ein zu früh unterschriebener Vertrag kann dich den Zuschuss kosten.' },
    kontakt: { t: 'Wozu die Kontaktdaten?', x: ['Sie stehen oben auf deinem Aufmaßblatt, damit sich der Fensterbauer mit dem Angebot bei dir melden kann. Das Blatt bekommt nur, wem du es gibst.', 'Alles ist freiwillig. Ohne Kontaktdaten gibst du sie dem Fensterbauer eben selbst mit.'], tipp: 'Eine Handynummer und die Zeit, zu der du gut erreichbar bist, sparen viel Hin und Her.' }
  };

  /* ---------- Zustand (PROJ0 und kauf() der App) ---------- */
  var proj = { gebaeude: 'efh', baujahr: '', total: '', zeit: '3m', budget: 'b0', foerdweg: '', name: '', ort: '', tel: '', mail: '', erreich: '' };
  var kauf = { mail: '', pay: '', bedingungen: false, widerruf: false, paid: false, when: 0, err: {} };
  var teil = { betrieb: 0 }, t0 = 0;
  /* Was die Wünsche liefern (ezVorschau.fenster): Name aus der Lage, Anzahl; Rückfall der App: „Fenster“, 1 Stück */
  var F = function () { return E.fenster || {}; };
  var fName = function () { return String(F().name || '').trim() || 'Fenster'; };
  var fAnzahl = function () { return Math.max(1, E.num(F().anzahl) || 1); };
  var w = function () { var v = E.werte() || {}; ['moW', 'moH', 'elW', 'elH'].forEach(function (k) { if (!(v[k] > 0 && isFinite(v[k]))) v[k] = 0; }); return v; };
  var zahl = function (v) { return v ? E.tausend(v) : '–'; };
  var zu = function (v) { return v ? E.tausend(v).replace(/\d/g, '•') : '•.•••'; };

  /* ---------- Hilfen ---------- */
  var folien = {};
  ['fertig', 'anfrage', 'anfrage2', 'anfrage3', 'blatt', 'konto', 'kasse', 'gekauft', 'teilen'].forEach(function (n) { folien[n] = d.querySelector('.ez-folie[data-folie="' + n + '"]'); });
  var GRUPPE = { fertig: 'fertig', anfrage: 'anfrage', anfrage2: 'anfrage', anfrage3: 'anfrage', blatt: 'blatt', konto: 'blatt', kasse: 'blatt', gekauft: 'blatt', teilen: 'blatt' };
  var setze = function (f, sel, t) { Array.prototype.forEach.call(f.querySelectorAll('[data-ab="' + sel + '"]'), function (e) { e.textContent = t; }); };
  var toastT = 0;
  function toast(f, t) {
    var el = f.querySelector('.ez-ab-toast'); if (!el) return E.status(t);
    clearTimeout(toastT); el.textContent = t; el.hidden = false; el.classList.remove('geht'); E.status(t);
    toastT = setTimeout(function () { el.classList.add('geht'); toastT = setTimeout(function () { el.hidden = true; }, E.ruhig() ? 0 : 170); }, 2400);
  }
  var wohin = function (name, r) { if (d.querySelector('.ez-folie[data-folie="' + name + '"]')) { E.zeigeFolie(name, r); return true; } return false; };

  /* Erklärungen: je Folie ein Bogen, gefüllt aus GLOSS */
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ab .ez-bogen'), function (b) { E.bogenBinden(b, null); });
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ab [data-ab-gloss]'), function (k) {
    k.addEventListener('click', function () {
      var g = GLOSS[k.getAttribute('data-ab-gloss')], b = k.closest('.ez-folie').querySelector('.ez-bogen'); if (!g || !b) return;
      b.querySelector('.ez-bogen__titel').textContent = g.t;
      b.querySelector('.ez-ab-erkl-text').innerHTML = g.x.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '<p class="ez-bogen__tipp"><b>Tipp:</b> ' + g.tipp + '</p>';
      E.bogenZeigen(b, k, true);
    });
  });

  /* Auswahl (Chips der App, eine Antwort, kein Abwählen) */
  function wahlSetzen(f) { Array.prototype.forEach.call(f.querySelectorAll('[data-ab-wahl]'), function (g) { var k = g.getAttribute('data-ab-wahl'), v = k === 'pay' ? kauf.pay : proj[k]; Array.prototype.forEach.call(g.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === String(v))); }); }); }
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ab [data-ab-wahl]'), function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var k = g.getAttribute('data-ab-wahl'), v = b.getAttribute('data-v'), f = g.closest('.ez-folie');
      if (k === 'pay') { kauf.pay = v; delete kauf.err.pay; } else proj[k] = v;
      wahlSetzen(f); var n = f.getAttribute('data-folie');
      if (n === 'anfrage') hausSetzen(false); else if (n === 'anfrage2') zeitSetzen(); else if (n === 'anfrage3') papiereSetzen(); else if (n === 'kasse') fehlerSetzen();
    });
  });

  /* ---------- Das Aufmaßblatt auf der Bühne (blattVorschau der App; offen = freigeschaltet) ---------- */
  function papierSetzen(root, offen) {
    var p = root.querySelector('.ez-ab-papier'); if (!p) return;
    var v = w(), q = function (k) { return p.querySelector('[data-p="' + k + '"]'); }, n = fAnzahl();
    q('name').textContent = proj.name.trim() || 'Dein Aufmaß';
    var teile = [proj.ort, proj.tel, proj.mail].map(function (t) { return String(t || '').trim(); }).filter(Boolean);
    q('kontakt').innerHTML = teile.length ? '' : '<i class="ez-ab-leer" style="--b:38%"></i><i class="ez-ab-leer" style="--b:30%"></i>';
    if (teile.length) q('kontakt').textContent = teile.join(' · ');
    q('meta').textContent = '1 Position · ' + n + (n === 1 ? ' Element' : ' Elemente') + ' · ' + LAB.gebaeude[proj.gebaeude];
    q('raum').textContent = fName();
    q('mo').textContent = offen ? zahl(v.moW) + ' × ' + zahl(v.moH) : zu(v.moW) + ' × ' + zu(v.moH);
    q('el').textContent = offen ? zahl(v.elW) + ' × ' + zahl(v.elH) : zu(v.elW) + ' × ' + zu(v.elH);
    q('mob').textContent = offen ? zahl(v.moW) : zu(v.moW); q('moh').textContent = offen ? zahl(v.moH) : zu(v.moH);
  }
  function papiereSetzen() { ['anfrage3', 'blatt', 'konto', 'kasse', 'gekauft', 'teilen'].forEach(function (n) { papierSetzen(folien[n], n === 'gekauft' || n === 'teilen'); }); }

  /* ---------- Gespeichert ---------- */
  function fertigZeigen() {
    var f = folien.fertig, art = E.art(), n = fAnzahl(), o = F().offen;
    if (!t0) t0 = Date.now();
    setze(f, 'name', fName()); setze(f, 'pos', '1'); setze(f, 'anzahl-fenster', '1');
    /* Stand wie fensterStatus der App; die Zahl offener Wünsche liefern die Wünsche (ezVorschau.fenster.offen) */
    setze(f, 'stand', ART_LABEL[art] + (n > 1 ? ' · ' + n + ' Stück' : '') + ' · ' + (o > 0 ? 'Maße vollständig, ' + o + (o === 1 ? ' Wunsch offen' : ' Wünsche offen') : 'Vollständig'));
    setze(f, 'bis', datumKurz(t0 + GRENZE_FREI_TAGE * 864e5));
    /* Das Modell der Wünsche (Ansicht „result“, bilder/ergebnis/); fehlt das Bild, das Rendering aus Schritt 1 */
    var m = $('ab-modell'), src = 'bilder/ergebnis/' + art + '.webp';
    if (m.getAttribute('src') !== src) { m.classList.remove('ist-objekt'); m.onerror = function () { m.onerror = null; m.src = 'bilder/' + art + '.webp'; m.classList.add('ist-objekt'); }; m.src = src; }
    $('ab-modell-text').textContent = 'Das Modell: ' + ART_LABEL[art] + ', ' + fName() + ', gespeichert als Position 1.';
  }
  $('ab-neu').addEventListener('click', function () { if (!wohin('start', 1)) toast(folien.fertig, 'Vorschau: In der App beginnt jetzt ein weiteres Fenster mit Schritt 1.'); });
  Array.prototype.forEach.call(folien.fertig.querySelectorAll('[data-ab-akt]'), function (b) {
    b.addEventListener('click', function () {
      var a = b.getAttribute('data-ab-akt'), f = folien.fertig;
      if (a === 'masse') { E.ergVon = 'fertig'; wohin('ergebnis', -1); }
      else if (a === 'wuensche') { if (!wohin('wuensche', -1)) toast(f, 'Vorschau: In der App öffnen sich jetzt die Wünsche dieses Fensters.'); }
      else if (a === 'kopie') toast(f, 'Kopiert, Maße prüfen. Vorschau: In der App geht es mit „' + fName() + ' (Kopie)“ zum Ergebnis.');
      else if (a === 'weg') toast(f, 'Vorschau: Die App löscht das Fenster jetzt und zeigt die Liste („Fenster gelöscht“).');
    });
  });
  Array.prototype.forEach.call(folien.fertig.querySelectorAll('[data-ab-kapitel]'), function (b) {
    b.addEventListener('click', function () { (E.fenster || {}).sprung = b.getAttribute('data-ab-kapitel'); if (!wohin('wuensche', -1)) toast(folien.fertig, 'Vorschau: In der App öffnen sich die Wünsche beim Kapitel „' + b.textContent + '“.'); });
  });
  $('ab-alle').addEventListener('click', function () { toast(folien.fertig, 'Vorschau: In der App öffnet sich hier die Liste deiner Fenster.'); });
  $('ab-fertig-weiter').addEventListener('click', function () { E.zeigeFolie('anfrage', 1); });
  /* Mehr erfahren in den Hinweisen: Trefferfläche 44 px über ::after (UX 9), Klick wie bisher */
  /* Gremium K (Muss): die drei Seiten „Fürs Angebot“ sind freiwillig, „Überspringen“ führt direkt zum Aufmaßblatt (Vorschlag, in der App neu) */
  d.querySelectorAll('[data-ab-ueberspringen]').forEach(function (b) { b.addEventListener('click', function () { E.zeigeFolie(kauf.paid ? 'teilen' : 'blatt', 1); }); });

  /* ---------- Fürs Angebot 1: Haus ---------- */
  var kapseln = $('ab-kapseln'), kapselnVorher = 0;
  function hausSetzen(fuellt) {
    var f = folien.anfrage, n = fAnzahl(), t = E.num(proj.total), ueber = t && n > t / 3, h = '', i;
    setze(f, 'getauscht', String(n)); setze(f, 'von', t ? 'von ' + t : 'getauscht');
    setze(f, 'satz', 'Du tauschst ' + n + ' davon.'); $('ab-tausch').textContent = 'Du tauschst ' + n + ' davon.';
    /* je Fenster eine Kapsel (bis 40, darüber anteilig); ohne Gesamtzahl eine schraffierte Kapsel: noch offen */
    if (t) { var zeig = Math.min(t, 40), g = Math.max(1, Math.round(Math.min(n, t) / t * zeig)); for (i = 0; i < zeig; i++) h += '<i' + (i < g ? ' class="ist-getauscht"' : '') + ' style="--n:' + i + '"></i>'; if (t >= 3) h += '<span class="ez-ab-drittel" style="left:calc(' + (100 / 3).toFixed(3) + '% - 1px)"><span>⅓</span></span>'; }
    else { for (i = 0; i < Math.min(n, 12); i++) h += '<i class="ist-getauscht" style="--n:' + i + '"></i>'; h += '<i class="ist-offen" style="--n:' + i + '"></i>'; }
    kapseln.innerHTML = h; kapseln.classList.toggle('ist-ueber', !!ueber);
    kapseln.classList.remove('fuellt'); if (fuellt && !E.ruhig()) { void kapseln.offsetWidth; kapseln.classList.add('fuellt'); }
    else if (!E.ruhig()) Array.prototype.forEach.call(kapseln.querySelectorAll('i'), function (k, i) { if (i >= kapselnVorher) k.classList.add('ist-neu'); });
    kapselnVorher = kapseln.querySelectorAll('i').length;
    setze(f, 'geb', LAB.gebaeude[proj.gebaeude]);
    var bj = f.querySelector('[data-ab="bj"]'); bj.hidden = !proj.baujahr; bj.textContent = proj.baujahr ? 'Baujahr ' + proj.baujahr : '';
    setze(f, 'bildtext-haus', 'Du tauschst ' + n + (t ? ' von ' + t + ' Fenstern' : ' Fenster') + '. ' + LAB.gebaeude[proj.gebaeude] + (proj.baujahr ? ', Baujahr ' + proj.baujahr : '') + '.');
    $('ab-denkmal').hidden = proj.gebaeude !== 'denkmal';
    var lu = $('ab-lueftung'); lu.hidden = !ueber;
    if (ueber) lu.innerHTML = 'Du tauschst ' + n + ' von ' + t + ' Fenstern, mehr als ein Drittel. Dann ist ein Lüftungskonzept nach DIN 1946-6 erforderlich; darum kümmert sich dein Fensterbauer. <button type="button" class="ez-ab-mehr" data-ab-gloss2="lueftung">Mehr erfahren</button>';
    var ti = $('ab-total'); if (d.activeElement !== ti) ti.value = proj.total;
  }
  $('ab-lueftung').addEventListener('click', function (e) { var b = e.target.closest('[data-ab-gloss2]'); if (b) folien.anfrage.querySelector('[data-ab-gloss="lueftung"]').click(); });
  Array.prototype.forEach.call(folien.anfrage.querySelectorAll('[data-ab-bump]'), function (b) {
    b.addEventListener('click', function () { proj.total = String(Math.max(1, Math.min(999, E.num(proj.total) + Number(b.getAttribute('data-ab-bump'))))); hausSetzen(false); E.status('Fenster im ganzen Haus: ' + proj.total); });
  });
  $('ab-total').addEventListener('input', function () { var z = this.value.replace(/\D/g, '').slice(0, 3); if (z !== this.value) this.value = z; proj.total = z && Number(z) > 0 ? String(Math.min(999, Number(z))) : ''; hausSetzen(false); });
  $('ab-anfrage-weiter').addEventListener('click', function () { E.zeigeFolie('anfrage2', 1); });

  /* ---------- Fürs Angebot 2: Zeit und Budget ---------- */
  function zeitSetzen() {
    var f = folien.anfrage2, fw = proj.foerdweg;
    Array.prototype.forEach.call(f.querySelectorAll('.ez-ab-station'), function (s) { s.classList.toggle('ist-dran', s.getAttribute('data-v') === proj.zeit); });
    var fz = FOERD_ZAHL[fw], fe = f.querySelector('[data-ab="foerd"]'); fe.hidden = !fz;
    if (fz) { setze(f, 'foerd-zahl', fz[0]); setze(f, 'foerd-text', fz[1]); }
    var bi = ['b1', 'b2', 'b3', 'b4'].indexOf(proj.budget);
    Array.prototype.forEach.call(f.querySelectorAll('.ez-ab-budget__reihe i'), function (k, i) { k.classList.toggle('ist-voll', bi >= 0 && i !== bi); k.classList.toggle('ist-dran', i === bi); });
    setze(f, 'budget-text', LAB.budget[proj.budget]);
    var h = $('ab-foerd-hinweis'); h.hidden = !FOERD_HINWEIS[fw]; h.textContent = FOERD_HINWEIS[fw] || '';
    setze(f, 'bildtext-zeit', 'Zeitraum: ' + LAB.zeit[proj.zeit] + '. Budget: ' + LAB.budget[proj.budget] + '.' + (fz ? ' Förderung: ' + fz[0] + ' Prozent, ' + fz[1] + '.' : ''));
  }
  $('ab-anfrage2-weiter').addEventListener('click', function () { E.zeigeFolie('anfrage3', 1); });

  /* ---------- Fürs Angebot 3: Kontakt (steht oben auf dem Blatt) ---------- */
  Array.prototype.forEach.call(folien.anfrage3.querySelectorAll('[data-ab-p]'), function (inp) {
    inp.addEventListener('input', function () { proj[inp.getAttribute('data-ab-p')] = inp.value; papierSetzen(folien.anfrage3, false); });
  });
  $('ab-anfrage3-weiter').addEventListener('click', function () { E.zeigeFolie(kauf.paid ? 'teilen' : 'blatt', 1); });

  /* ---------- Aufmaßblatt vor dem Freischalten ---------- */
  function blattZeigen() {
    var f = folien.blatt, n = fAnzahl();
    setze(f, 'blatt-satz', n + ' Fenster, alle acht Handmaße, die Auswertung der Fotos, deine Wünsche.');
    setze(f, 'preis', PREIS.toFixed(2).replace('.', ',')); setze(f, 'preis-mwst', 'einmalig' + (MWST ? ', inkl. MwSt.' : '')); setze(f, 'einf', einfText());
    $('ab-freischalten-wort').textContent = 'Freischalten · ' + euro(PREIS);
    papierSetzen(f, false);
  }
  /* k-start der App ohne Server: schon frei → Teilen, E-Mail bekannt → Kasse, sonst erst die E-Mail */
  $('ab-freischalten').addEventListener('click', function () { if (kauf.paid) E.zeigeFolie('teilen', 1); else if (kauf.mail) kasseOeffnen(); else E.zeigeFolie('konto', 1); });

  /* ---------- Kasse, Schritt 1: E-Mail ---------- */
  var MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function kontoSetzen() {
    var m = $('ab-k-mail'), t = String(m.value || '').trim(), et = folien.konto.querySelector('.ez-ab-etikett');
    setze(folien.konto, 'mail-text', t || 'name@beispiel.de'); et.classList.toggle('ist-leer', !t);
    var e = kauf.err.mail, fe = $('ab-k-mail-fehler'); fe.hidden = !e; fe.textContent = e || '';
    $('ab-k-mail-feld').classList.toggle('ist-fehler', !!e); if (e) m.setAttribute('aria-invalid', 'true'); else m.removeAttribute('aria-invalid');
  }
  $('ab-k-mail').addEventListener('input', function () { kauf.mail = this.value; if (kauf.err.mail && MAIL_RE.test(this.value.trim())) delete kauf.err.mail; kontoSetzen(); });
  $('ab-konto-weiter').addEventListener('click', function () {
    kauf.err = {}; if (!MAIL_RE.test(String(kauf.mail || '').trim())) kauf.err.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
    if (kauf.err.mail) { kontoSetzen(); $('ab-k-mail').focus(); E.status(kauf.err.mail); return; }
    kauf.mail = kauf.mail.trim(); kasseOeffnen();
  });

  /* ---------- Kasse, Schritt 2: Bezahlen (Testkauf) ---------- */
  /* Die Haken gelten nur für diesen einen Kauf: beim Betreten der Kasse sind sie leer (kasseOeffnen der App) */
  function kasseOeffnen() { kauf.bedingungen = false; kauf.widerruf = false; kauf.err = {}; $('ab-agb').checked = false; $('ab-widerruf').checked = false; E.zeigeFolie('kasse', 1); }
  function kasseSetzen() {
    var f = folien.kasse, n = fAnzahl();
    setze(f, 'mail-text', kauf.mail); setze(f, 'preis', PREIS.toFixed(2).replace('.', ',')); setze(f, 'einf', einfText());
    setze(f, 'anzahl-text', n + ' Fenster'); setze(f, 'mwst', euro(PREIS - PREIS / 1.19));
    wahlSetzen(f); fehlerSetzen(); papierSetzen(f, false);
  }
  function fehlerSetzen() {
    [['pay', 'ab-pay-fehler', folien.kasse.querySelector('[data-ab-wahl="pay"]')], ['bedingungen', 'ab-agb-fehler', $('ab-agb').closest('.ez-ab-haken')], ['widerruf', 'ab-widerruf-fehler', $('ab-widerruf').closest('.ez-ab-haken')]].forEach(function (z) {
      var e = kauf.err[z[0]], p = $(z[1]); p.hidden = !e; p.textContent = e || ''; z[2].classList.toggle('ist-fehler', !!e);
      var inp = z[2].querySelector('input'); if (inp) { if (e) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); }
    });
  }
  $('ab-agb').addEventListener('change', function () { kauf.bedingungen = this.checked; if (this.checked) delete kauf.err.bedingungen; fehlerSetzen(); });
  $('ab-widerruf').addEventListener('change', function () { kauf.widerruf = this.checked; if (this.checked) delete kauf.err.widerruf; fehlerSetzen(); });
  $('ab-kaufen').addEventListener('click', function (ev) {
    kauf.err = {};
    if (!kauf.pay) kauf.err.pay = 'Bitte eine Zahlungsart wählen.';
    if (!kauf.bedingungen) kauf.err.bedingungen = 'Bitte stimme den AGB zu.';
    if (!kauf.widerruf) kauf.err.widerruf = 'Für die sofortige Lieferung brauchen wir deine Zustimmung.';
    if (Object.keys(kauf.err).length) {
      fehlerSetzen(); var erst = !kauf.pay ? folien.kasse.querySelector('[data-ab-wahl="pay"] button') : !kauf.bedingungen ? $('ab-agb') : $('ab-widerruf');
      erst.focus({ preventScroll: true }); if (erst.scrollIntoView) erst.scrollIntoView({ block: 'center', behavior: E.ruhig() || ev.detail === 0 ? 'auto' : 'smooth' });
      E.status(Object.keys(kauf.err).map(function (k) { return kauf.err[k]; }).join(' ')); return;
    }
    kauf.paid = true; kauf.when = Date.now(); E.zeigeFolie('gekauft', 1);
  });

  /* ---------- Freigeschaltet ---------- */
  function gekauftZeigen(r) {
    var f = folien.gekauft, b = f.querySelector('.ez-buehne--blatt'), ok = f.querySelector('.ez-ab-okmark');
    setze(f, 'rechnung-satz', kauf.mail ? ' Die Rechnung kommt an ' + kauf.mail + '.' : ''); setze(f, 'anzahl-text', fAnzahl() + ' Fenster');
    papierSetzen(f, true);
    /* der eine inszenierte Moment: Haken zeichnet sich, die Maße rasten aufs Blatt (nur beim Hinkommen, nicht bei weniger Bewegung) */
    b.classList.remove('oeffnet'); ok.classList.remove('zeichnet');
    if (r && !E.ruhig()) { void b.offsetWidth; b.classList.add('oeffnet'); ok.classList.add('zeichnet'); }
  }
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ab [data-ab-akt="pdf"], .ez-ab [data-ab-akt="laden"]'), function (b) {
    b.addEventListener('click', function () { toast(b.closest('.ez-folie'), b.getAttribute('data-ab-akt') === 'pdf' ? 'Vorschau: In der App öffnet sich jetzt das Teilen mit der PDF.' : 'Vorschau: In der App lädt jetzt die PDF deines Aufmaßblatts.'); });
  });
  $('ab-gekauft-weiter').addEventListener('click', function () { E.zeigeFolie('teilen', 1); });

  /* ---------- Teilen ---------- */
  /* Code im Format der App (packProject: „AM1.“ und Base64url), Inhalt aus den Daten dieser Vorschau */
  function code() {
    var v = w(), json = JSON.stringify({ v: 1, b: '', p: proj, w: [{ art: E.art(), name: fName(), anzahl: fAnzahl(), moW: v.moW, moH: v.moH, elW: v.elW, elH: v.elH }], t: kauf.when || Date.now() });
    var bytes = new TextEncoder().encode(json), bin = ''; for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return 'AM1.' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function teilenSetzen() {
    var f = folien.teilen, c = code(), n = fAnzahl();
    var msg = 'Hallo, hier ist mein Fenster-Aufmaß aus eeziframes (' + n + ' Fenster): alle Maße, die Auswertung der Fotos und meine Wünsche. Den Code bitte bei eeziframes unter „Code vom Kunden einfügen“ einsetzen. Noch kein Zugang? Kostenlos anmelden, die ersten 3 Projekte sind frei: https://eeziframes.com/\n\n' + c;
    $('ab-code').value = c; $('ab-wa').href = 'https://wa.me/?text=' + encodeURIComponent(msg); $('ab-em').href = 'mailto:?subject=' + encodeURIComponent('Mein Fenster-Aufmaß') + '&body=' + encodeURIComponent(msg);
    setze(f, 'teil-stand', teil.betrieb ? 'Unterwegs zu deinem Fensterbauer. Du kannst das Blatt jederzeit weiteren Betrieben geben, es gehört dir.' : 'Freigeschaltet, für dieses Projekt. Gib es dem Fensterbauer, von dem du ein Angebot möchtest, gern auch mehreren.');
    $('ab-weg').classList.toggle('ist-erledigt', !!teil.betrieb); setze(f, 'weg-label', teil.betrieb ? 'Erledigt' : 'Schritt 1');
    setze(f, 'rechnung-unterwegs', kauf.paid && kauf.mail ? ' Die Rechnung ist an ' + kauf.mail + ' unterwegs.' : '');
    papierSetzen(f, true);
  }
  function teilMark() { if (teil.betrieb) return; teil.betrieb = 1; teilenSetzen(); }
  $('ab-pdf').addEventListener('click', function () { teilMark(); toast(folien.teilen, 'Vorschau: In der App öffnet sich jetzt das Teilen mit der PDF für deinen Fensterbauer.'); });
  ['ab-wa', 'ab-em'].forEach(function (id) { $(id).addEventListener('click', teilMark); });
  folien.teilen.querySelector('[data-ab-akt="copy"]').addEventListener('click', function () {
    var c = $('ab-code').value, ok = function () { teilMark(); toast(folien.teilen, 'Code kopiert'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c).then(ok, function () { $('ab-code').select(); ok(); }); else { $('ab-code').select(); ok(); }
  });
  $('ab-projekt').addEventListener('click', function () { toast(folien.teilen, 'Vorschau: In der App geht es zurück zu deinem Projekt mit allen Fenstern.'); });
  $('ab-code').addEventListener('focus', function () { this.select(); });

  /* ---------- Rückwege (Kopf und Fuß): wie die App, wo die Vorschau das Ziel hat ---------- */
  var ZURUECK = { anfrage: 'fertig', anfrage2: 'anfrage', anfrage3: 'anfrage2', blatt: 'anfrage3', konto: 'blatt', kasse: 'konto', teilen: 'anfrage3' };
  Array.prototype.forEach.call(d.querySelectorAll('.ez-ab [data-ab-zurueck]'), function (b) {
    b.addEventListener('click', function () { var f = b.closest('.ez-folie'), n = f.getAttribute('data-folie'); if (ZURUECK[n]) E.zeigeFolie(ZURUECK[n], -1); else toast(f, 'Vorschau: In der App öffnet sich hier die Liste deiner Fenster.'); });
  });

  /* ---------- Anmelden: beim Zeigen füllen, die Notiz der Gruppe zeigen ---------- */
  var ZEIGEN = {
    fertig: fertigZeigen, anfrage: function (r) { kapselnVorher = 0; hausSetzen(!!r); }, anfrage2: zeitSetzen, anfrage3: function () { Array.prototype.forEach.call(folien.anfrage3.querySelectorAll('[data-ab-p]'), function (i) { i.value = proj[i.getAttribute('data-ab-p')]; }); papierSetzen(folien.anfrage3, false); },
    blatt: function () { if (kauf.paid) return E.zeigeFolie('teilen'); blattZeigen(); }, konto: function () { if (!kauf.mail && proj.mail.trim()) kauf.mail = proj.mail.trim(); $('ab-k-mail').value = kauf.mail; kontoSetzen(); }, kasse: kasseSetzen, gekauft: gekauftZeigen, teilen: teilenSetzen
  };
  Object.keys(folien).forEach(function (n) {
    if (!folien[n]) return;
    E.anmelden(n, function (r) {
      wahlSetzen(folien[n]); ZEIGEN[n](r);
      Array.prototype.forEach.call(d.querySelectorAll('.ez-notiz__folie'), function (z) { z.hidden = z.getAttribute('data-fuer') !== GRUPPE[n]; });
    });
  });
})();

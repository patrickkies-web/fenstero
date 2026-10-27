/* eeziframes · Bestellung einer Landingpage mit Konfigurator (/bestellen/), Stationen aus Auftrag.stationen(paket):
   Paket → Konto (Code per E-Mail, zugleich die Registrierung) → Ihr Betrieb → Adresse → Auftritt (nur mit eigener Gestaltung) → Bestellen.
   Adresse der Seite: #<paket>[/<auftrag>/<station>]. Ab dem Konto liegt der Auftrag als Entwurf auf dem Server; jede Eingabe wird nach
   kurzer Pause gespeichert (auch mit Lücken), geprüft wird beim Weitergehen und beim Bestellen (Auftrag.pruefen, Server prüft erneut).
   Der Weg „Schnell“ fragt im Auftritt nur Logo, Website und Hinweise; Texte, Farben und Bilder übernimmt der Inhaber.
   Rahmen nach DNA Abschnitt 9: Kopf, Stationen-Band, Bühne (Vorschau der eigenen Seite), Frage, weiße Karten, Fuß mit der einen Pille.
   Ändern nach der Zahlung (aus dem Kundenbereich): #<paket>/<auftrag>/<betrieb|adresse|auftritt> eines bezahlten Auftrags zeigt nur diese
   Stationen; gespeichert wird erst mit „Speichern“ (vollständig geprüft), danach zurück in den Kundenbereich. */
(function () {
  'use strict';
  const U = window.AuftragUI, A = window.Auftrag, P = window.Pakete, h = U.h;
  const wurzel = document.getElementById('app');
  const S = { paket: 'plus', weg: 'ausfuehrlich', station: 'paket', auftrag: null, angaben: A.leer(), ich: null, stand: null, mail: '', codeGeschickt: false, adresse: null, start: true, aendern: false };
  const ANGABEN = ['betrieb', 'adresse', 'auftritt'];
  let schmutzig = {}, speicherT = 0, speicherLauf = null, adresseT = 0, statusEl = null, vorschau = null;

  const m = () => P.merkmale(S.paket) || {};
  const liste = () => A.stationen(S.paket).filter((x) => !S.aendern || ANGABEN.indexOf(x.k) >= 0);
  const index = (k) => liste().findIndex((s) => s.k === k);
  const angemeldet = () => !!(S.ich && S.ich.angemeldet);
  const kurz = U.kurzname;
  const vorZahlung = (a) => ['entwurf', 'angefragt'].indexOf(a.stand) >= 0 && ['bezahlt', 'laeuft'].indexOf((a.zahlung || {}).status) < 0;
  const mehrere = (l, n) => { const out = (Array.isArray(l) ? l.slice(0, n) : []); while (out.length < n) out.push(''); return out; };

  /* ---------- Adresse der Seite ---------- */
  function hashLesen() {
    const t = location.hash.replace(/^#/, '').split('/');
    const r = { paket: P.gueltig(t[0]) ? t[0] : '', id: '', station: '' };
    if (t[1] && /^[0-9a-z-]{8,}$/i.test(t[1])) { r.id = t[1]; r.station = t[2] || ''; }
    return r;
  }
  function hashSetzen(ersetzen) {
    const t = '#' + S.paket + (S.auftrag ? '/' + S.auftrag.id + '/' + S.station : '');
    if (location.hash === t) return;
    if (ersetzen) history.replaceState(null, '', t); else history.pushState(null, '', t);
  }

  /* ---------- Auftrag laden und speichern ---------- */
  function laden(a) {
    S.auftrag = a; S.paket = a.paket; S.weg = a.weg || 'ausfuehrlich';
    const l = A.leer(), g = a.angaben || {};
    ['betrieb', 'adresse', 'auftritt'].forEach((t) => { l[t] = Object.assign(l[t], g[t] || {}); });
    l.adresse.domains = mehrere(l.adresse.domains, 3); l.adresse.eingang = mehrere(l.adresse.eingang, 3);
    l.adresse.team = mehrere(l.adresse.team, Math.max(1, l.adresse.team.filter(Boolean).length));
    l.auftritt.farben = mehrere(l.auftritt.farben, Math.max(1, l.auftritt.farben.filter(Boolean).length));
    S.angaben = l;
  }
  function geaendert(teil) {
    schmutzig[teil] = true; vorschauSetzen();
    if (S.aendern) { status('Noch nicht gespeichert'); return; }
    clearTimeout(speicherT); speicherT = setTimeout(() => speichern().catch(() => null), 900);
    status('Wird gespeichert …');
  }
  function koerper(teile) { const b = { angaben: {} }; teile.forEach((t) => { b.angaben[t] = S.angaben[t]; }); return b; }
  async function speichern() {
    clearTimeout(speicherT);
    if (!S.auftrag) return null;
    if (speicherLauf) { await speicherLauf.catch(() => null); }
    const teile = Object.keys(schmutzig); if (!teile.length) return null;
    schmutzig = {};
    speicherLauf = U.api('PATCH', '/api/auftrag/' + S.auftrag.id, koerper(teile))
      .then((r) => { S.auftrag = r.auftrag; status('Automatisch gespeichert'); return r; })
      .catch((e) => { teile.forEach((t) => { schmutzig[t] = true; }); status('Nicht gespeichert. ' + e.message); throw e; })
      .finally(() => { speicherLauf = null; });
    return speicherLauf;
  }
  addEventListener('pagehide', () => {
    if (!S.auftrag || S.aendern || !Object.keys(schmutzig).length) return;
    try { fetch('/api/auftrag/' + S.auftrag.id, { method: 'PATCH', keepalive: true, credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(koerper(Object.keys(schmutzig))) }); } catch (e) { /* beim nächsten Besuch steht der letzte gespeicherte Stand */ }
  });
  function status(t) { if (statusEl) statusEl.textContent = t; }

  /* ---------- Gerüst ---------- */
  function render(o) {
    o = o || {};
    const l = liste(), i = Math.max(0, index(S.station)), mitBuehne = S.station !== 'paket';
    const k = document.getElementById('kopf'); if (k) k.replaceWith(kopfBauen());
    U.leeren(wurzel);
    const teil = STATIONEN[S.station]();
    const buehne = h('aside', { class: 'a-r-buehne', 'aria-label': 'So sieht Ihre Seite aus' });
    if (mitBuehne) buehne.appendChild(buehneBauen());
    const main = h('main', { class: 'a-raster ' + (mitBuehne ? 'zwei' : 'eins') + (S.station === 'konto' ? ' telefon-ohne' : '') + (S.station === 'paket' ? ' aktion-oben' : ''), id: 'inhalt' },
      h('div', { class: 'a-r-band' }, U.stationen(l, i)), buehne,
      h('div', { class: 'a-r-frage' }, teil.frage), h('div', { class: 'a-r-inhalt' }, teil.inhalt), h('div', { class: 'a-r-fuss a-fuss' }, teil.fuss),
      teil.nach ? h('div', { class: 'a-r-nach' }, teil.nach) : null);
    wurzel.appendChild(main);
    wurzel.appendChild(h('p', { class: 'a-recht' }, h('a', { href: '/impressum/', text: 'Impressum' }), h('a', { href: '/datenschutz/', text: 'Datenschutz' }), h('a', { href: '/konfigurator-bedingungen/', text: 'Paketbedingungen' })));
    vorschauSetzen();
    if (!o.stehen) { window.scrollTo(0, 0); if (!S.start) { const t = main.querySelector('h1'); if (t) t.focus({ preventScroll: true }); } }
    S.start = false;
  }
  function kopfBauen() {
    const i = index(S.station), rechts = [];
    if (angemeldet()) rechts.push(h('span', { class: 'a-wer', text: S.ich.mail }));
    rechts.push(U.ring('Kundenbereich', { href: '/konto/', class: 'klein' }));
    const konto = S.auftrag ? '/konto/#auftrag/' + S.auftrag.id : '/konto/';
    const k = U.kopf({ zurueck: S.aendern ? konto : i > 0 ? () => zurueck() : '/fuer-fensterbauer/#pakete', zurueckLabel: S.aendern ? 'Zurück zum Kundenbereich' : i > 0 ? 'Zurück zu ' + liste()[i - 1].t : 'Zurück zur Seite für Fensterbauer', zusatz: S.aendern ? 'Angaben ändern' : 'Bestellung', rechts: rechts });
    k.id = 'kopf';
    return k;
  }
  function zeigen(k, ersetzen) {
    if (index(k) < 0) k = 'paket';
    if (index(k) > index('konto') && !S.auftrag) k = angemeldet() ? 'paket' : 'konto';
    if (k === 'konto' && angemeldet() && S.auftrag) k = 'betrieb';
    S.station = k; hashSetzen(ersetzen); render();
  }
  function zurueck() {
    const i = index(S.station); if (i <= 0) return;
    let z = liste()[i - 1].k; if (z === 'konto' && angemeldet()) z = 'paket';
    speichern().catch(() => null); zeigen(z);
  }
  function fuss(text, onWeiter, o) {
    o = o || {};
    if (S.aendern && ANGABEN.indexOf(S.station) >= 0) {
      const teil = S.station, knopf = U.pille('Speichern', { on: { click: () => { if (!U.wartet(knopf)) aenderungSpeichern(teil, knopf); } } });
      return [U.rund('zurueck', 'Ohne Speichern zurück zum Kundenbereich', { class: 'gross', href: '/konto/#auftrag/' + S.auftrag.id }), knopf];
    }
    const i = index(S.station), knopf = U.pille(text, { on: { click: () => { if (!U.wartet(knopf)) onWeiter(knopf); } } });
    return [o.grund ? h('p', { class: 'a-hinweis a-grund', text: o.grund }) : null, i > 0 ? U.rund('zurueck', 'Zurück', { class: 'gross', on: { click: zurueck } }) : null, knopf];
  }
  function formular(inhalt, onSenden) { return h('form', { novalidate: true, on: { submit: (e) => { e.preventDefault(); onSenden(); } } }, inhalt, h('button', { type: 'submit', hidden: true, tabindex: '-1', 'aria-hidden': 'true' })); }

  /* ---------- Bühne: Vorschau der eigenen Seite ---------- */
  function dateiUrl(d) { return d && /^image\/(png|jpeg|webp|svg\+xml)$/.test(d.typ) ? '/api/auftrag/' + S.auftrag.id + '/datei/' + d.id : ''; }
  const datei = (platz) => (S.auftrag && S.auftrag.dateien || []).filter((d) => d.platz === platz).pop() || null;
  function adresseText() {
    const ad = S.angaben.adresse;
    if (!m().domain) return ad.name ? A.unteradresse(ad.name).name + '.' + A.BASIS : '';
    return (ad.domains || []).map((x) => A.domain(x)).filter((r) => r.ok).map((r) => r.host)[0] || '';
  }
  function buehneBauen() {
    vorschau = U.vorschau();
    const pr = P.preis(S.paket);
    statusEl = h('span', { 'aria-live': 'polite', text: S.auftrag ? 'Automatisch gespeichert' : '' });
    return h('div', { class: 'a-buehne' }, h('div', { class: 'a-buehne-in' }, vorschau.el,
      h('div', { class: 'a-buehne-zeile' }, h('span', null, h('b', { style: 'color:var(--weiss);font-weight:500', text: kurz(S.paket) }), ' · ' + U.euro(pr.monat) + ' im Monat'), statusEl)));
  }
  function vorschauSetzen() {
    if (!vorschau) return;
    const b = S.angaben.betrieb, t = S.angaben.auftritt;
    vorschau.setzen({ paket: S.paket, adresse: adresseText(), name: b.name || b.firma, ort: b.ort, region: b.region, ap: b.ap, rolle: b.rolle, ueberschrift: t.ueberschrift, einleitung: t.einleitung, einladung: t.einladung,
      farbe: A.farbe(t.farben[0]), logo: dateiUrl(datei('logo')), portrait: dateiUrl(datei('portrait')), buehne: dateiUrl(datei('buehne')) });
  }

  /* ---------- Anreiz zum nächsten Paket ---------- */
  function anreiz() {
    const n = A.naechstes(S.paket); if (!n || !vorZahlungAuftrag()) return null;
    const l = n.dazu.slice(0, 4);
    return U.kachel([h('p', { class: 'a-label-klein', style: 'margin:0' }, U.chip('Mit ' + kurz(n.paket))),
      h('h3', { text: 'Für ' + U.euro(n.monat) + ' mehr im Monat' }),
      h('ul', null, l.map((a) => h('li', { text: a.titel + (a.k === 'farben' || a.k === 'fotos' ? ': ' + a.text : '') }))),
      h('p', { class: 'a-preis-dazu' }, h('b', { text: '+' + U.euro(n.monat) }), 'netto im Monat, ' + (n.einrichtung > 0 ? U.euro(n.einrichtung) + ' mehr Einrichtung' : 'Einrichtung nicht teurer')),
      U.rund('pfeil', 'Zu ' + kurz(n.paket) + ' wechseln', { class: 'voll gross', on: { click: (e) => paketWechseln(n.paket, e.currentTarget) } })], 'leucht a-anreiz');
  }
  const vorZahlungAuftrag = () => !S.auftrag || vorZahlung(S.auftrag);
  async function paketWechseln(p, knopf) {
    if (!S.auftrag) { S.paket = p; render({ stehen: true }); return; }
    U.warten(knopf, true);
    try {
      await speichern().catch(() => null);
      const r = await U.api('PATCH', '/api/auftrag/' + S.auftrag.id, { paket: p });
      S.auftrag = r.auftrag; S.paket = p;
      U.toast('Gewechselt zu ' + P.PAKETE[p].name);
      zeigen(index(S.station) >= 0 ? S.station : 'betrieb', true);
    } catch (e) { U.toast(e.message); U.warten(knopf, false); }
  }

  /* ---------- Stationen ---------- */
  const STATIONEN = {};

  /* Paket */
  /* Hinweis auf eeziframes offen nennen (Gremium der Fensterbauer, 27.10.2026) */
  const hinweis = (p) => { const k = (P.merkmale(p) || {}).kennzeichnung; return k === 'keine' ? 'Ohne Hinweis auf eeziframes' : 'Mit Hinweis auf eeziframes: ' + P.MERKMALE.kennzeichnung.werte[k]; };
  function punkte(p) {
    const i = P.LISTE.indexOf(p);
    if (i === 0) return ['Ihre Adresse: ihr-name.eeziframes.com', 'Konfigurator mit Ihrem Namen, Ort und Ansprechperson', 'Jede Anfrage als Aufmaßblatt-PDF per E-Mail', hinweis(p)];
    const out = ['Alles aus ' + kurz(P.LISTE[i - 1]) + ', dazu:']; let gruppe = false;
    A.naechstes(P.LISTE[i - 1]).dazu.forEach((a) => {
      if (a.k === 'ohneHinweis') return;
      if (['logo', 'fotos', 'portrait', 'texte'].indexOf(a.k) >= 0) { if (!gruppe) { out.push('Ihr Logo, Ihre Fotos und Texte'); gruppe = true; } }
      else out.push(a.k === 'domain' ? 'Ihre eigene Domain, bis ' + P.DOMAIN_JAHR + ' € netto im Jahr inklusive' : a.k === 'farben' ? a.text.charAt(0).toUpperCase() + a.text.slice(1) : a.titel);
    });
    out.push(hinweis(p));
    return out;
  }
  STATIONEN.paket = function () {
    /* Das gewählte Paket steht immer im ersten Bildschirm: Umschalter mit Preis unter der Frage, am Telefon nur die gewählte Karte
       (Gremium 27.10.2026: „Weiter mit Plus“ bei sichtbarer, nicht gewählter Essential-Karte war eine versteckte Vorauswahl) */
    const wahl = U.segment(P.LISTE.map((p) => ({ w: p, t: [h('span', { text: kurz(p) }), h('small', { text: U.euro(P.preis(p).monat) + ' im Monat' })] })), S.paket, (p) => paketWaehlen(p), 'Paket wählen');
    wahl.classList.add('a-paketwahl');
    const karten = h('div', { class: 'a-pakete' });
    P.LISTE.forEach((p) => {
      const pr = P.preis(p), an = p === S.paket;
      const wahl = h('button', { type: 'button', class: 'a-paket-wahl', 'aria-pressed': String(an), on: { click: () => paketWaehlen(p) } }, h('span', { class: 'a-paket-name', text: P.PAKETE[p].name }), h('span', { class: 'a-paket-punkt', 'aria-hidden': 'true' }));
      karten.appendChild(h('div', { class: 'a-paket' + (an ? ' an' : ''), 'data-paket': p },
        h('div', { class: 'a-paket-bild' }, h('img', { src: '/bilder/fensterbauer-dna/paket-' + p + '.webp', alt: '', width: '960', height: '600', decoding: 'async' }), U.chip('Beispiel: Fensterbau Brandt')),
        h('div', { class: 'a-paket-text' }, h('div', { class: 'a-paket-kopf' }, wahl),
          h('p', { class: 'a-preis' }, h('b', { text: String(pr.monat) }), h('span', { text: '€ im Monat, netto' })),
          h('p', { class: 'a-paket-neben', text: '+ ' + U.euro(pr.einrichtung) + ' Einrichtung einmalig, netto' }),
          h('p', { class: 'a-paket-neben', text: P.kiText(p) + ' netto' }),
          h('ul', { class: 'a-punkte' }, punkte(p).map((t, j) => h('li', { class: j === 0 && p !== 'essential' ? 'kopf' : '', text: t }))),
          h('a', { class: 'a-link a-paket-beispiel', href: '/vorschau/paket-beispiel/' + p + '.html', target: '_blank', rel: 'noopener' }, 'Beispielseite ansehen', U.icon('aussen')))));
    });
    /* Was beim Betrieb ankommt, vor dem Kauf ansehen (Gremium der Fensterbauer: Musteraufmaßblatt und Mess-Schritt zeigen) */
    const blatt = U.karte('So kommt eine Anfrage bei Ihnen an', 'Aufmaßblatt als PDF per E-Mail', h('div', { class: 'a-blatt-muster' },
      h('a', { class: 'a-blatt-bild', href: '/bilder/fensterbauer-dna/blatt.webp', target: '_blank', rel: 'noopener', 'aria-label': 'Muster-Aufmaßblatt groß ansehen' }, h('img', { src: '/bilder/fensterbauer-dna/blatt.webp', alt: 'Muster-Aufmaßblatt: Familie Weber bei Fensterbau Brandt, vier Positionen mit Öffnung, Element und Bestellmaß', width: '920', height: '872', loading: 'lazy', decoding: 'async' })),
      h('div', null, h('p', { text: 'Mit Maßen, Fotos, Einbausituation und Wünschen. Die Maße nimmt Ihr Kunde selbst (Kundenmaß); das Feinaufmaß machen Sie vor Ort, bevor Sie bestellen.' }),
        h('div', { class: 'a-knoepfe', style: 'margin-top:8px' }, h('a', { class: 'a-link', href: '/fuer-fensterbauer/#stufe-2', target: '_blank', rel: 'noopener' }, 'So misst Ihr Kunde', U.icon('aussen')), h('a', { class: 'a-link', href: '/bilder/fensterbauer-dna/blatt.webp', target: '_blank', rel: 'noopener' }, 'Muster-Aufmaßblatt', U.icon('aussen'))))));
    const inhalt = [karten, blatt];
    if (A.gestaltet(m())) {
      const text = h('p', { text: wegText(S.weg) });
      inhalt.push(U.kachel([h('h2', { text: 'Wie viel möchten Sie selbst angeben?' }), h('div', { style: 'margin-top:14px' }, U.segment([{ w: 'schnell', t: 'Schnell' }, { w: 'ausfuehrlich', t: 'Ausführlich' }], S.weg, (w) => { S.weg = w; text.textContent = wegText(w); wegSpeichern(); }, 'Weg wählen')), text], 'a-wegkachel'));
    }
    if (angemeldet() && !S.auftrag) {
      const offen = (S.ich.auftraege || []).filter(vorZahlung);
      if (offen.length) inhalt.push(U.karte('Angefangene Bestellungen', 'Machen Sie dort weiter, wo Sie aufgehört haben', h('div', { class: 'a-offen' }, offen.map((a) =>
        h('div', { class: 'a-offen-zeile' }, h('span', null, h('b', { text: a.paketName }), ' · ' + (a.angaben.betrieb && a.angaben.betrieb.firma || a.nr) + ' · ' + U.datum(a.updated_at)), U.ring('Weiter', { class: 'klein', on: { click: () => { laden(a); zeigen(ersteOffene()); } } }))))));
    }
    inhalt.push(h('p', { class: 'a-fusszeile' }, U.aenderbar('Paket und Angaben lassen sich bis zur Zahlung jederzeit ändern. Alle Preise netto' + (S.stand && S.stand.mwst === false ? '.' : ' zzgl. 19 % USt.') + (P.VORLAEUFIG ? ' Vorläufige Preise.' : '') +
      ' Eine KI-Auswertung ist ein Foto, meist zwei je Fenster. Zum Schutz vor Missbrauch wertet die KI im Monat höchstens das Doppelte des Kontingents aus, danach geht es ohne KI-Befund weiter.')));
    return { frage: U.frage('Welches Paket *passt zu Ihnen?*', 'Drei Stufen, ein Konfigurator. Wählen Sie, wie viel von Ihrer Marke auf der Seite steht.', wahl), inhalt: inhalt, fuss: fuss('Weiter mit ' + kurz(S.paket) + ' · ' + U.euro(P.preis(S.paket).monat), (k) => paketWeiter(k)) };
  };
  const wegText = (w) => w === 'schnell' ? 'Sie nennen nur das Nötigste und Ihr Logo. Texte, Farben und Bilder übernehmen wir von Ihrer Website oder klären sie im Telefonat.' : 'Sie geben Logo, Farben, Fotos und Texte selbst vor. Was noch fehlt, reichen Sie später im Kundenbereich nach.';
  function paketWaehlen(p) {
    if (p === S.paket) return;
    if (S.auftrag) { paketWechseln(p, null); return; }
    S.paket = p; hashSetzen(true); render({ stehen: true });
    const k = wurzel.querySelector('[data-paket="' + p + '"] .a-paket-wahl'); if (k) k.focus({ preventScroll: true });
  }
  function wegSpeichern() { if (S.auftrag) U.api('PATCH', '/api/auftrag/' + S.auftrag.id, { weg: S.weg }).then((r) => { S.auftrag = r.auftrag; }).catch((e) => U.toast(e.message)); }
  async function paketWeiter(knopf) {
    if (!angemeldet()) { zeigen('konto'); return; }
    U.warten(knopf, true);
    try {
      if (S.auftrag) { if (S.auftrag.paket !== S.paket || S.auftrag.weg !== S.weg) { const r = await U.api('PATCH', '/api/auftrag/' + S.auftrag.id, { paket: S.paket, weg: S.weg }); S.auftrag = r.auftrag; } }
      else await neuAnlegen();
      zeigen('betrieb');
    } catch (e) { U.toast(e.message); U.warten(knopf, false); }
  }
  async function neuAnlegen() {
    const r = await U.api('POST', '/api/auftrag/neu', { paket: S.paket, weg: S.weg });
    laden(r.auftrag);
    if (!S.angaben.adresse.name && !m().domain) S.angaben.adresse.name = A.vorschlag(S.angaben.betrieb.firma) || '';
    (S.ich.auftraege = S.ich.auftraege || []).unshift(r.auftrag);
  }
  function ersteOffene() {
    const t = A.offen(S.angaben, m(), S.weg);
    return t || (A.gestaltet(m()) ? 'auftritt' : 'bestellen');
  }

  /* Konto: Code per E-Mail */
  STATIONEN.konto = function () {
    const mail = U.feld({ k: 'mail', label: 'Ihre E-Mail-Adresse', typ: 'email', auto: 'email', wert: S.mail, platzhalter: 'name@ihr-betrieb.de', onInput: (v) => { S.mail = v.trim(); } });
    const teile = [mail];
    let code = null;
    if (S.codeGeschickt) {
      mail.eingabe.readOnly = true;
      code = U.feld({ k: 'code', label: 'Code aus der E-Mail', modus: 'numeric', auto: 'one-time-code', max: 7, roh: true, platzhalter: '123 456', hilfe: 'Wir haben den Code an ' + S.mail + ' geschickt. Er gilt 15 Minuten. Keine Mail? Bitte auch im Spam-Ordner nachsehen.' });
      teile.push(code, h('div', { class: 'a-knoepfe', style: 'padding:4px 0 14px' }, U.ring('Neuen Code schicken', { class: 'klein', on: { click: (e) => codeSchicken(e.currentTarget) } }), U.ring('Andere Adresse', { class: 'klein', on: { click: () => { S.codeGeschickt = false; render({ stehen: true }); } } })));
    }
    const k = U.karte(null, null, formular(teile, () => kontoWeiter(knopf)));
    const hinweis = S.auftrag === null && hashLesen().id ? h('p', { class: 'a-hinweis', style: 'margin:0 0 12px', text: 'Bitte melden Sie sich an, um Ihre Bestellung fortzusetzen.' }) : null;
    const f = fuss(S.codeGeschickt ? 'Anmelden' : 'Code schicken', (b) => kontoWeiter(b));
    const knopf = f[f.length - 1];
    setTimeout(() => { const e = (code || mail).eingabe; if (e && !S.start) e.focus({ preventScroll: true }); }, 30);
    return { frage: U.frage('Ihr Konto *für Bestellung und Kundenbereich.*', 'Wir schicken Ihnen einen Code per E-Mail, ein Passwort brauchen Sie nicht. Mit dieser Adresse melden Sie sich später auch im Kundenbereich an.'), inhalt: [hinweis, k], fuss: f };
  };
  function kontoWeiter(knopf) { if (U.wartet(knopf)) return; if (S.codeGeschickt) anmelden(knopf); else codeSchicken(knopf); }
  async function codeSchicken(knopf) {
    const f = wurzel.querySelector('[data-k="mail"]');
    if (!A.mailOk(S.mail)) { U.fehlerSetzen(f, 'Bitte eine gültige E-Mail-Adresse eingeben.'); U.zuFeld(f); return; }
    U.fehlerSetzen(f, ''); U.warten(knopf, true);
    try { await U.api('POST', '/api/auftrag/code', { mail: S.mail }); S.codeGeschickt = true; render({ stehen: true }); U.toast('Code ist unterwegs'); }
    catch (e) { U.fehlerSetzen(f, e.message); U.warten(knopf, false); }
  }
  async function anmelden(knopf) {
    const f = wurzel.querySelector('[data-k="code"]'), code = f.eingabe.value.replace(/\D/g, '');
    if (code.length !== 6) { U.fehlerSetzen(f, 'Bitte den sechsstelligen Code eingeben.'); U.zuFeld(f); return; }
    U.fehlerSetzen(f, ''); U.warten(knopf, true);
    try {
      await U.api('POST', '/api/auftrag/anmelden', { mail: S.mail, code: code });
      S.ich = await U.api('GET', '/api/auftrag/ich');
      const id = hashLesen().id, alt = id && (S.ich.auftraege || []).find((a) => a.id === id);
      if (alt && !vorZahlung(alt)) { location.href = '/konto/#auftrag/' + alt.id; return; }
      if (alt) laden(alt); else await neuAnlegen();
      zeigen(alt ? ersteOffene() : 'betrieb', true);
    } catch (e) {
      U.warten(knopf, false);
      if (e.daten && e.daten.neu) { S.codeGeschickt = false; render({ stehen: true }); U.toast(e.message); return; }
      U.fehlerSetzen(f, e.message);
    }
  }

  /* Ihr Betrieb */
  const RECHTSFORMEN = ['Einzelunternehmen', 'e. K.', 'GbR', 'OHG', 'KG', 'GmbH', 'GmbH & Co. KG', 'UG (haftungsbeschränkt)', 'AG'];
  const FORM_RE = /\s*,?\s*(GmbH\s*&\s*Co\.?\s*KG|GmbH|UG\s*\(haftungsbeschränkt\)|UG|e\.\s?K\.?|OHG|KG|GbR|AG)\s*$/i;
  function betriebFeld(o) {
    const b = S.angaben.betrieb;
    return U.feld(Object.assign({ wert: b[o.k], max: A.GRENZEN[o.k], onInput: (v) => { b[o.k] = v; U.fehlerSetzen(wurzel.querySelector('[data-k="' + o.k + '"]'), ''); geaendert('betrieb'); } }, o));
  }
  STATIONEN.betrieb = function () {
    const b = S.angaben.betrieb;
    const schnell = S.weg === 'schnell' && A.gestaltet(m()), spaeter = schnell ? 'klären wir im Telefonat, falls offen' : '';
    const firma = betriebFeld({ k: 'firma', label: 'Unternehmen, wie auf Ihren Rechnungen', platzhalter: 'Fensterbau Brandt GmbH', auto: 'organization',
      onBlur: (v) => {
        const nameF = wurzel.querySelector('[data-k="name"]'), formF = wurzel.querySelector('[data-k="rechtsform"]'), form = FORM_RE.exec(v);
        if (!b.name && v.trim()) { b.name = v.replace(FORM_RE, '').trim(); nameF.eingabe.value = b.name; geaendert('betrieb'); }
        if (!b.rechtsform && form) { const t = RECHTSFORMEN.find((r) => r.replace(/[\s.]/g, '').toLowerCase() === form[1].replace(/[\s.]/g, '').toLowerCase()); if (t) { b.rechtsform = t; formF.eingabe.value = t; geaendert('betrieb'); } }
      } });
    const seite = U.karte('Auf Ihrer Seite', 'Das sehen Ihre Kunden', [
      firma,
      betriebFeld({ k: 'name', label: 'Name auf der Seite', platzhalter: 'Fensterbau Brandt', hilfe: 'Kurz und so, wie Ihre Kunden Sie nennen.' }),
      betriebFeld({ k: 'region', label: 'Einzugsgebiet', platzhalter: 'Köln und Umgebung', optional: true }),
      h('div', { class: 'a-zwei' },
        betriebFeld({ k: 'ap', label: 'Ansprechperson', platzhalter: 'Petra Brandt', auto: 'name' }),
        betriebFeld({ k: 'rolle', label: 'Rolle', platzhalter: 'Geschäftsführung', optional: true }),
        betriebFeld({ k: 'tel', label: 'Telefon', typ: 'tel', auto: 'tel', platzhalter: '0221 123 45 67' }),
        betriebFeld({ k: 'mail', label: 'E-Mail für Ihre Kunden', typ: 'email', auto: 'email', platzhalter: 'info@ihr-betrieb.de' })),
      betriebFeld({ k: 'erreichbar', label: 'Erreichbar', platzhalter: 'Mo bis Fr, 8 bis 17 Uhr', optional: true }),
      betriebFeld({ k: 'web', label: 'Ihre bisherige Website', typ: 'url', modus: 'url', platzhalter: 'www.ihr-betrieb.de', optional: true, hilfe: 'Haben Sie schon eine? Dann übernehmen wir auf Wunsch Texte, Farben und Bilder von dort.' })
    ]);
    const optional = ['register', 'ust', 'kammer', 'beruf'];
    const mehr = h('details', { class: 'a-mehr', open: optional.some((k) => b[k]) || null }, h('summary', null, 'Register, USt-IdNr., Kammer und Beruf', h('span', { class: 'a-optional', text: 'falls vorhanden' })),
      betriebFeld({ k: 'register', label: 'Registergericht und Nummer', platzhalter: 'Amtsgericht Köln, HRB 12345', optional: true }),
      betriebFeld({ k: 'ust', label: 'USt-IdNr.', platzhalter: 'DE123456789', optional: true, auto: 'off' }),
      betriebFeld({ k: 'kammer', label: 'Kammer', platzhalter: 'Handwerkskammer zu Köln', optional: true }),
      betriebFeld({ k: 'beruf', label: 'Berufsbezeichnung', platzhalter: 'Tischlermeister, verliehen in Deutschland', optional: true }));
    const impressum = U.karte('Impressum und Rechnung', 'Pflichtangaben für Ihre Seite', [
      betriebFeld({ k: 'strasse', label: 'Straße und Hausnummer', auto: 'street-address', platzhalter: 'Werkstattweg 12' }),
      h('div', { class: 'a-plz' }, betriebFeld({ k: 'plz', label: 'PLZ', modus: 'numeric', auto: 'postal-code', platzhalter: '50667', max: 5 }), betriebFeld({ k: 'ort', label: 'Ort', auto: 'address-level2', platzhalter: 'Köln' })),
      betriebFeld({ k: 'bundesland', label: 'Bundesland', optional: schnell, hilfe: spaeter, optionen: Object.keys(A.BUNDESLAENDER).map((k) => [k, A.BUNDESLAENDER[k]]) }),
      h('div', { class: 'a-zwei' },
        betriebFeld({ k: 'rechtsform', label: 'Rechtsform', optional: schnell, vorschlaege: RECHTSFORMEN, platzhalter: 'GmbH' }),
        betriebFeld({ k: 'vertretung', label: 'Vertreten durch', optional: schnell, hilfe: spaeter, platzhalter: 'Petra Brandt, Geschäftsführerin' })),
      mehr
    ]);
    return { frage: U.frage('Ihr Betrieb, *so wie er auf der Seite steht.*', null, U.aenderbar()), inhalt: formular([seite, impressum], () => teilWeiter('betrieb')), fuss: fuss('Weiter', () => teilWeiter('betrieb')) };
  };
  /* Nach der Zahlung: Teil vollständig prüfen, speichern, zurück in den Kundenbereich */
  async function aenderungSpeichern(teil, knopf) {
    const r = A[teil](S.angaben[teil], m(), S.weg);
    const erstes = U.fehlerZeigen(wurzel.querySelector('.a-r-inhalt'), r.fehler);
    if (erstes) { const d = erstes.closest('details'); if (d) d.open = true; U.zuFeld(erstes); return; }
    U.warten(knopf, true);
    try {
      const teile = Object.keys(schmutzig).concat([teil]).filter((x, i, l) => l.indexOf(x) === i);
      await U.api('PATCH', '/api/auftrag/' + S.auftrag.id, koerper(teile)); schmutzig = {};
      location.href = '/konto/#auftrag/' + S.auftrag.id + '/gespeichert';
    } catch (e) { U.warten(knopf, false); const f = U.fehlerZeigen(wurzel.querySelector('.a-r-inhalt'), (e.daten && e.daten.felder) || {}, teil); if (f) U.zuFeld(f); U.toast(e.message); }
  }

  /* Teil prüfen, speichern, weiter; bei Fehlern das erste Feld zeigen */
  async function teilWeiter(teil, knopf) {
    const r = A[teil](S.angaben[teil], m(), S.weg);
    const erstes = U.fehlerZeigen(wurzel.querySelector('.a-r-inhalt'), r.fehler);
    if (erstes) { const d = erstes.closest('details'); if (d) d.open = true; U.zuFeld(erstes); U.toast(Object.keys(r.fehler).length === 1 ? 'Eine Angabe fehlt noch' : Object.keys(r.fehler).length + ' Angaben fehlen noch'); return; }
    if (teil === 'adresse' && !m().domain && S.adresse && S.adresse.name === A.unteradresse(S.angaben.adresse.name).name && !S.adresse.frei) { const f = wurzel.querySelector('[data-k="name"]'); U.fehlerSetzen(f, S.adresse.text); U.zuFeld(f); return; }
    schmutzig[teil] = true;
    try { await speichern(); } catch (e) { U.toast(e.message); return; }
    const l = liste(); zeigen(l[index(S.station) + 1].k);
  }

  /* Mehrere Werte (Wunsch-Domains, Adressen für Anfragen, Team): ein Feld, weitere auf Knopfdruck bis max */
  function mehrfach(o) {
    const ad = S.angaben.adresse, box = h('div');
    let anzahl = Math.max(o.min || 1, ad[o.feld].reduce((n, x, i) => (x ? i + 1 : n), 0));
    const zeichnen = (fokus) => {
      U.leeren(box);
      for (let i = 0; i < anzahl; i++) {
        while (ad[o.feld].length <= i) ad[o.feld].push('');
        box.appendChild(U.feld(Object.assign({ k: o.feld + '.' + i, wert: ad[o.feld][i], label: o.titel(i), optional: o.optional(i), platzhalter: o.platzhalter ? o.platzhalter(i) : '', typ: o.typ || 'text', modus: o.modus || null, auto: o.auto && i === 0 ? o.auto : 'off',
          onInput: (v) => { ad[o.feld][i] = v.trim(); U.fehlerSetzen(wurzel.querySelector('[data-k="' + o.feld + '.' + i + '"]'), ''); geaendert('adresse'); } })));
      }
      if (anzahl < o.max) box.appendChild(h('div', { style: 'padding:2px 0 12px' }, U.ring(o.weitere, { class: 'klein', on: { click: () => { anzahl++; zeichnen(true); } } }, )));
      if (fokus) { const e = box.querySelectorAll('input'); e[e.length - 1].focus(); }
    };
    zeichnen();
    return box;
  }

  /* Adresse */
  STATIONEN.adresse = function () {
    const ad = S.angaben.adresse, mm = m(), inhalt = [];
    if (!mm.domain) {
      if (!ad.name) ad.name = A.vorschlag(S.angaben.betrieb.firma || S.angaben.betrieb.name) || '';
      const stand = h('p', { class: 'a-adresse-stand', 'aria-live': 'polite' });
      const f = U.feld({ k: 'name', label: 'Ihr Name', wert: ad.name, endung: '.' + A.BASIS, platzhalter: 'fensterbau-brandt', auto: 'off', max: 40, hilfe: 'Kleinbuchstaben, Ziffern und Bindestriche. Ihre Seite läuft dann unter genau dieser Adresse.',
        onInput: (v) => { ad.name = v; U.fehlerSetzen(f, ''); geaendert('adresse'); adressePruefen(stand); } });
      f.appendChild(stand);
      inhalt.push(U.karte('Ihre Adresse bei eeziframes', null, f));
      setTimeout(() => adressePruefen(stand, true), 0);
    } else {
      const neu = ad.art !== 'eigene', felder = h('div');
      const zeichnen = () => {
        U.leeren(felder);
        if (ad.art !== 'eigene') {
          const v = A.vorschlag(S.angaben.betrieb.name || S.angaben.betrieb.firma);
          felder.appendChild(mehrfach({ feld: 'domains', max: A.GRENZEN.domains, titel: (i) => (i === 0 ? 'Wunsch-Domain' : (i + 1) + '. Wahl'), optional: (i) => i > 0, platzhalter: (i) => (i === 0 ? (v || 'fensterbau-brandt') + '.de' : ''), modus: 'url', weitere: 'Weitere Wunsch-Domain' }));
          felder.appendChild(U.haken({ text: 'Schlagen Sie mir passende Namen vor', an: ad.vorschlaege, onChange: (x) => { ad.vorschlaege = x; geaendert('adresse'); } }));
          felder.appendChild(h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Wir registrieren die Domain für Sie, sobald sie frei ist. Eine Domain bis ' + P.DOMAIN_JAHR + ' € netto im Jahr ist im Paket enthalten (Paketbedingungen § 6).' }));
        } else {
          felder.appendChild(U.feld({ k: 'domains.0', label: 'Ihre Domain oder Unteradresse', wert: ad.domains[0], platzhalter: 'fenster.ihr-betrieb.de', modus: 'url', auto: 'off', hilfe: 'Eine Domain, die Ihnen schon gehört, binden wir nach Absprache an (Paketbedingungen § 6 Abs. 3). Am einfachsten ist eine Unteradresse wie fenster.ihr-betrieb.de; den Eintrag bei Ihrem Anbieter erklären wir Ihnen.',
            onInput: (x) => { ad.domains[0] = x; U.fehlerSetzen(wurzel.querySelector('[data-k="domains.0"]'), ''); geaendert('adresse'); } }));
        }
        felder.appendChild(h('p', { class: 'a-fehler', 'data-k': 'domains', hidden: true }));
      };
      zeichnen();
      const web = S.angaben.betrieb.web;
      inhalt.push(U.karte('Ihre Domain', null, [h('div', { style: 'padding:8px 0 4px' }, U.segment([{ w: 'neu', t: 'Neue Domain' }, { w: 'eigene', t: 'Meine Domain' }], neu ? 'neu' : 'eigene', (w) => { ad.art = w; geaendert('adresse'); zeichnen(); }, 'Art der Domain')), felder,
        web ? h('p', { class: 'a-hinweis', style: 'padding:0 0 16px;color:var(--schwarz)', text: 'Ihre Website ' + web.replace(/^https?:\/\//, '').replace(/\/$/, '') + ' bleibt, wie sie ist. Von dort verlinken Sie auf Ihre neue Seite; den Knopf „Fenster planen“ dafür finden Sie nach dem Livegang im Kundenbereich.' }) : null]));
    }
    inhalt.push(U.karte('Wohin gehen die Anfragen?', 'Als Aufmaßblatt-PDF per E-Mail', [
      mehrfach({ feld: 'eingang', max: A.GRENZEN.eingang, titel: (i) => (i === 0 ? 'E-Mail für Anfragen' : (i + 1) + '. Adresse'), optional: (i) => i > 0, typ: 'email', auto: 'email', weitere: 'Weitere Adresse' }),
      h('p', { class: 'a-fehler', 'data-k': 'eingang', hidden: true }),
      h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Jede Adresse bestätigen Sie einmal über einen Link in einer E-Mail, bevor dort Anfragen ankommen.' })]));
    if (mm.dashboard) {
      const n = Number(mm.zugaenge) || 5;
      inhalt.push(U.karte('Ihr Team im Dashboard', 'bis zu ' + n + ' Zugänge', [mehrfach({ feld: 'team', max: n, titel: (i) => 'Zugang ' + (i + 1), optional: () => true, typ: 'email', platzhalter: (i) => (i === 0 ? 'kollegin@ihr-betrieb.de' : ''), weitere: 'Weitere Person' }),
        h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Diese Personen sehen im Dashboard die Planungen Ihrer Kunden und verschicken persönliche Einladungen.' })]));
    }
    if (!mm.domain) inhalt.push(anreiz());
    return { frage: U.frage(mm.domain ? 'Unter welcher Domain *soll Ihre Seite laufen?*' : 'Unter welchem Namen *finden Ihre Kunden Sie?*', null, U.aenderbar()), inhalt: formular(inhalt, () => teilWeiter('adresse')), fuss: fuss('Weiter', () => teilWeiter('adresse')) };
  };
  function adressePruefen(stand, sofort) {
    clearTimeout(adresseT);
    const r = A.unteradresse(S.angaben.adresse.name);
    U.leeren(stand);
    if (!r.ok) { if (S.angaben.adresse.name) stand.appendChild(U.chip(r.fehler, 'hinweis')); S.adresse = null; return; }
    adresseT = setTimeout(async () => {
      try {
        const x = await U.api('POST', '/api/auftrag/adresse', { name: r.name, id: S.auftrag ? S.auftrag.id : '' });
        if (A.unteradresse(S.angaben.adresse.name).name !== x.name) return;
        S.adresse = x; U.leeren(stand); stand.appendChild(U.chip(x.text, x.frei ? 'aktiv' : 'hinweis'));
      } catch (e) { /* Prüfung beim Bestellen */ }
    }, sofort ? 0 : 450);
  }

  /* Auftritt */
  function auftrittFeld(o) {
    const t = S.angaben.auftritt;
    return U.feld(Object.assign({ wert: t[o.k], max: A.GRENZEN[o.k], zaehlen: true, optional: true, onInput: (v) => { t[o.k] = v; geaendert('auftritt'); } }, o));
  }
  const TYPEN = { logo: 'image/png,image/jpeg,image/webp,image/svg+xml,application/pdf', weitere: 'image/png,image/jpeg,image/webp,application/pdf' };
  function platz(k, titel, cls) {
    const d = datei(k), url = dateiUrl(d);
    const el = h('div', { class: 'a-platz ' + (cls || '') + (d ? ' voll' : ''), 'data-platz': k });
    if (d && url) el.appendChild(h('img', { src: url, alt: titel, decoding: 'async' }));
    else if (d) el.appendChild(h('span', { class: 'a-platz-pdf', text: 'PDF' }));
    const input = h('input', { type: 'file', accept: TYPEN[k] || 'image/png,image/jpeg,image/webp', 'aria-label': (d ? titel + ' ersetzen' : titel + ' hochladen') });
    input.addEventListener('change', () => { if (input.files[0]) hochladen(k, input.files[0], el, titel, cls); });
    el.appendChild(h('label', { class: 'a-platz-wahl' }, input, h('b', null, U.icon(d ? 'stift' : 'hoch'), d ? 'Ersetzen' : titel)));
    if (d) el.appendChild(h('button', { type: 'button', class: 'a-weg', 'aria-label': titel + ' entfernen', on: { click: () => entfernen(d, el, titel, cls) } }, U.icon('x')));
    return el;
  }
  async function hochladen(k, f, el, titel, cls) {
    el.classList.add('laedt');
    try {
      const x = await U.vorbereiten(f, k);
      const r = await U.api('POST', '/api/auftrag/' + S.auftrag.id + '/datei', { platz: k, name: x.name, daten: x.daten });
      S.auftrag = r.auftrag; const neu = platz(k, titel, cls); el.replaceWith(neu); vorschauSetzen(); status('Automatisch gespeichert');
      const i = neu.querySelector('input'); if (i) i.focus({ preventScroll: true });
    } catch (e) { el.classList.remove('laedt'); U.toast(e.message); }
  }
  async function entfernen(d, el, titel, cls) {
    try { const r = await U.api('DELETE', '/api/auftrag/' + S.auftrag.id + '/datei/' + d.id); S.auftrag = r.auftrag; const neu = platz(d.platz, titel, cls); el.replaceWith(neu); vorschauSetzen(); const i = neu.querySelector('input'); if (i) i.focus({ preventScroll: true }); }
    catch (e) { U.toast(e.message); }
  }
  function farben() {
    const t = S.angaben.auftritt, wrap = h('div', { class: 'a-farben' });
    const zeichnen = () => {
      U.leeren(wrap);
      t.farben.forEach((c, i) => {
        const wahl = h('input', { type: 'color', 'aria-label': 'Farbe ' + (i + 1) + ' wählen' }); wahl.value = A.farbe(c) || '#897efc';
        const text = h('input', { type: 'text', placeholder: '#rrggbb', maxlength: '7', spellcheck: 'false', autocapitalize: 'off', 'aria-label': 'Farbe ' + (i + 1) + ' als Hex-Wert' }); text.value = c || '';
        const setzen = () => { t.farben[i] = text.value.trim(); geaendert('auftritt'); };
        wahl.addEventListener('input', () => { text.value = wahl.value; setzen(); });
        text.addEventListener('input', () => { const f = A.farbe(text.value); if (f) wahl.value = f; setzen(); });
        wrap.appendChild(h('div', { class: 'a-farbe' + (c ? '' : ' leer'), 'data-k': 'farben.' + i }, wahl, text));
      });
      if (t.farben.length < A.GRENZEN.farben) wrap.appendChild(U.rund('plus', 'Weitere Farbe', { on: { click: () => { t.farben.push(''); zeichnen(); const e = wrap.querySelectorAll('input[type=text]'); e[e.length - 1].focus(); } } }));
    };
    zeichnen();
    return h('div', { class: 'a-feld' }, h('span', { class: 'a-label' }, h('span', { text: 'Ihre Farben' }), h('span', { class: 'a-optional', text: 'bis zu 3' })), wrap,
      U.haken({ text: 'Farben aus meinem Logo oder meiner Website übernehmen', an: t.farbenWebsite, onChange: (x) => { t.farbenWebsite = x; geaendert('auftritt'); } }));
  }
  STATIONEN.auftritt = function () {
    const t = S.angaben.auftritt, mm = m(), b = S.angaben.betrieb, inhalt = [];
    const wegWahl = U.segment([{ w: 'schnell', t: 'Schnell' }, { w: 'ausfuehrlich', t: 'Ausführlich' }], S.weg, (w) => { S.weg = w; wegSpeichern(); render({ stehen: true }); }, 'Weg wählen', true);
    inhalt.push(h('div', { class: 'a-wegwahl' }, wegWahl, h('p', { class: 'a-hilfe', style: 'color:var(--silbergrau)', text: wegText(S.weg) })));
    const logo = U.karte('Ihr Logo', 'PNG, SVG, JPEG oder PDF', h('div', { class: 'a-datei-zeile', style: 'padding:6px 0 16px' }, platz('logo', 'Logo', 'a-logo-platz'), h('p', { class: 'a-hilfe', text: 'Am besten als SVG oder PNG mit transparentem Hintergrund. Es steht im Kopf Ihrer Seite und im Aufmaßblatt.' })));
    if (S.weg === 'schnell') {
      inhalt.push(logo);
      const webF = b.web ? null : U.feld({ k: 'web', label: 'Ihre bisherige Website', typ: 'url', modus: 'url', optional: true, platzhalter: 'www.ihr-betrieb.de', wert: b.web, onInput: (v) => { b.web = v; geaendert('betrieb'); } });
      inhalt.push(U.karte('Von Ihrer Website', null, [webF, U.haken({ text: b.web ? 'Texte, Farben und Bilder von ' + b.web.replace(/^https?:\/\//, '').replace(/\/$/, '') + ' übernehmen' : 'Texte, Farben und Bilder von meiner Website übernehmen', an: t.ausWebsite, onChange: (x) => { t.ausWebsite = x; geaendert('auftritt'); } }),
        h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Wir nehmen nur, was zu Ihrem Betrieb gehört, und zeigen Ihnen alles in der Vorschau, bevor die Seite online geht.' })]));
    } else {
      inhalt.push(U.karte('Logo und Farben', null, [h('div', { class: 'a-datei-zeile', style: 'padding:6px 0 10px' }, platz('logo', 'Logo', 'a-logo-platz'), h('p', { class: 'a-hilfe', text: 'Am besten als SVG oder PNG mit transparentem Hintergrund.' })), farben(),
        h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: mm.farbwelt === 'voll' ? 'Mit ' + kurz(S.paket) + ' steht die ganze Seite in Ihren Farben.' : 'Mit ' + kurz(S.paket) + ' steht die Seite zur Hälfte in Ihren Farben: Knöpfe, Akzente und eine Kachel.' })]));
      inhalt.push(U.karte('Fotos Ihres Betriebs', 'ein großes Bild oben, fünf kleinere darunter', [h('div', { class: 'a-fotos' }, A.FOTO_PLAETZE.map((f) => platz(f.k, f.titel))),
        h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Querformat, gern mit Tageslicht. Leere Plätze füllen wir mit passenden Bildern, bis Sie eigene nachreichen.' })]));
      inhalt.push(U.karte('Porträt', b.ap ? 'Foto von ' + b.ap : 'Foto der Ansprechperson', h('div', { class: 'a-datei-zeile', style: 'padding:6px 0 16px' }, platz('portrait', 'Porträt', 'a-portrait-platz'), h('p', { class: 'a-hilfe', text: 'Steht neben Ihrem Namen, statt der Initialen. Ein freundliches Foto mit ruhigem Hintergrund.' }))));
      const texte = [auftrittFeld({ k: 'ueberschrift', label: 'Überschrift', platzhalter: 'Fenster, Türen und Montage aus einer Hand.' }),
        auftrittFeld({ k: 'einleitung', label: 'Einleitung', zeilen: 3, platzhalter: 'Beratung, Aufmaß und Einbau in Köln und Umgebung. Mit dem Konfigurator beginnen Sie zu Hause, den Rest übernehmen wir.' }),
        auftrittFeld({ k: 'leistungTitel', label: 'Ihre Leistungen in einem Satz', platzhalter: 'Fenster, Haustüren und Rollläden für Alt- und Neubau' }),
        auftrittFeld({ k: 'leistungText', label: 'Was Sie besonders macht', zeilen: 3, platzhalter: 'Eigene Montage-Teams, Aufmaß vor Ort und ein fester Ansprechpartner von der Planung bis zum Einbau.' })];
      if (mm.einladungslinks) texte.push(auftrittFeld({ k: 'einladung', label: 'Text Ihrer persönlichen Einladung', zeilen: 4, platzhalter: 'Für Ihr Angebot brauche ich die Maße Ihrer Fenster. Messen Sie in Ruhe selbst, danach melde ich mich.' }));
      texte.push(h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Leer gelassen? Dann schreiben wir die Texte und Sie sehen sie in der Vorschau.' }));
      inhalt.push(U.karte('Ihre Texte', null, texte));
    }
    inhalt.push(U.karte('Was uns wichtig ist', null, auftrittFeld({ k: 'notiz', label: 'Hinweise für uns', zeilen: 4, zaehlen: false, platzhalter: 'z. B. bitte nur Holz-Alu-Fenster zeigen, kein Rollladen-Thema, Fotos schicke ich nächste Woche.' })));
    inhalt.push(anreiz());
    return { frage: U.frage(S.weg === 'schnell' ? 'Ihr Logo, *den Rest übernehmen wir.*' : 'Ihr Auftritt, *in Ihren Farben und Bildern.*', null, U.aenderbar('Fotos, Farben und Texte können Sie jederzeit im Kundenbereich nachreichen.')), inhalt: formular(inhalt, () => teilWeiter('auftritt')), fuss: fuss('Weiter', () => teilWeiter('auftritt')) };
  };

  /* Bestellen */
  STATIONEN.bestellen = function () {
    const mm = m(), pr = P.preis(S.paket), b = S.angaben.betrieb, ad = S.angaben.adresse, t = S.angaben.auftritt, st = S.stand || {};
    const mwst = st.mwst !== false, kasse = !!(st.verkauf && st.verkauf.kasse);
    const p = A.pruefen(S.angaben, mm, null, S.weg), inhalt = [];
    if (!p.ok) {
      const je = {}; Object.keys(p.fehler).forEach((k) => { const s = k.split('.')[0]; je[s] = (je[s] || 0) + 1; });
      inhalt.push(U.kachel([h('h2', { text: 'Es fehlen noch Angaben' }), h('div', { class: 'a-luecken' }, Object.keys(je).map((s) => h('div', { class: 'a-offen-zeile' }, h('span', null, h('b', { text: (liste().find((x) => x.k === s) || {}).t || s }), ': ' + (je[s] === 1 ? 'eine Angabe' : je[s] + ' Angaben')), U.ring('Ergänzen', { class: 'klein', on: { click: () => { zeigen(s); setTimeout(() => { const f = U.fehlerZeigen(wurzel.querySelector('.a-r-inhalt'), A[s](S.angaben[s], mm, S.weg).fehler); U.zuFeld(f); }, 60); } } }))))], 'a-luecke'));
    }
    const brutto = (n) => U.euro(Math.round(n * 119) / 100), grau = 'color:var(--silbergrau);font-size:14px';
    /* Preis mit allem, was Thomas und Petra vermisst haben: netto, heute brutto, Monat, KI, Storno (Gremium 27.10.2026) */
    inhalt.push(U.kachel([h('p', { class: 'a-label-klein', style: 'margin:0 0 10px' }, U.chip(P.PAKETE[S.paket].name, 'aktiv')),
      h('div', { class: 'a-summe' }, h('span', { class: 'gross' }, String(pr.einrichtung), h('small', { text: '€ Einrichtung, netto' })), h('span', { style: grau, text: kasse ? 'heute, einmalig' : 'einmalig' })),
      mwst ? h('p', { class: 'a-heute' }, h('b', { text: (kasse ? 'Heute bei Stripe: ' : 'Mit Umsatzsteuer: ') + brutto(pr.einrichtung) }), ' inkl. 19 % USt.') : h('p', { style: grau, text: 'Kein Ausweis der Umsatzsteuer nach § 19 UStG.' }),
      h('p', { text: 'Danach ' + U.euro(pr.monat) + ' netto im Monat' + (mwst ? ' (' + brutto(pr.monat) + ' inkl. USt.)' : '') + ', erst ab dem Tag, an dem Ihre Seite live geht. Ohne Mindestlaufzeit, kündbar zum Monatsende.' }),
      h('p', { style: grau, text: P.kiText(S.paket) + ' netto, mit der Monatsrechnung.' }),
      h('p', { style: grau, text: 'Bis wir mit der Einrichtung beginnen, stornieren Sie im Kundenbereich kostenlos; die Einrichtung erstatten wir dann vollständig.' })], 'leucht'));
    /* Zustimmung direkt unter dem Preis, je Haken ein Satz in Alltagsdeutsch; die Zeile über der Pille zählt, was fehlt */
    const zu = S.auftrag && S.auftrag.zustimmung || {};
    const stand = st.standText || st.stand || '';
    const zaehlen = () => {
      const g = wurzel.querySelector('.a-fuss .a-grund'); if (!g) return;
      const n = ['unternehmer', 'agb', 'avv'].filter((k) => { const e = wurzel.querySelector('[data-k="' + k + '"] input'); return !(e && e.checked); }).length;
      g.textContent = n ? (n === 1 ? 'Noch ein Häkchen setzen' : 'Noch ' + n + ' Häkchen setzen') : (kasse ? 'Weiter zur Zahlung bei Stripe' : 'Unverbindlich, ohne Zahlung');
      g.classList.toggle('offen', !!n);
    };
    const satz = (t) => h('small', { class: 'a-haken-satz', text: t });
    inhalt.push(U.karte('Ihre Zustimmung', null, h('div', { style: 'padding:2px 0 8px' },
      U.haken({ k: 'unternehmer', an: zu.unternehmer, onChange: zaehlen, text: ['Ich bestelle als Unternehmer (§ 14 BGB), nicht als Verbraucher.', satz('Also für einen Betrieb, nicht privat. Ein Widerrufsrecht wie beim Kauf als Privatperson gibt es deshalb nicht.')] }),
      U.haken({ k: 'agb', an: zu.agb && zu.agb === st.stand, onChange: zaehlen, text: ['Ich stimme den ', h('a', { href: '/konfigurator-bedingungen/', target: '_blank', rel: 'noopener', text: 'Paketbedingungen' }), stand ? ' (Fassung vom ' + stand + ')' : '', ' zu.', satz('Darin stehen Preise, Laufzeit, Storno und Kündigung.')] }),
      U.haken({ k: 'avv', an: zu.avv, onChange: zaehlen, text: ['Ich schließe den ', h('a', { href: '/konfigurator-bedingungen/#avv', target: '_blank', rel: 'noopener', text: 'Vertrag zur Auftragsverarbeitung' }), ' ab.', satz('Er regelt, wie wir die Daten Ihrer Kunden in Ihrem Auftrag verarbeiten.')] }))));
    if (!S.stand) inhalt.push(h('p', { class: 'a-hinweis', text: 'Die Bestellung ist gerade nicht erreichbar. Bitte laden Sie die Seite gleich noch einmal.' }));
    /* Nach der Pille: wie es weitergeht und die Zusammenfassung zum Prüfen */
    const nach = [];
    const rueck = U.feld({ k: 'rueckruf', label: 'Wann dürfen wir Sie anrufen?', optional: true, wert: b.rueckruf, max: A.GRENZEN.rueckruf, platzhalter: 'werktags ab 16 Uhr', onInput: (v) => { b.rueckruf = v; geaendert('betrieb'); } });
    nach.push(U.karte('So geht es weiter', null, [h('ol', { class: 'a-schritte' },
      h('li', null, h('b', { text: kasse ? 'Einrichtung bezahlen' : 'Unverbindlich anfragen' }), kasse ? 'bei Stripe, unserem Zahlungsdienst, per Karte oder SEPA-Lastschrift. Ihr Zahlungsmittel bleibt für das Monatsabo hinterlegt; abgebucht wird es erst ab dem Livegang.' : 'Unsere Kasse öffnet in Kürze. Wir melden uns, sobald Sie bezahlen können.'),
      h('li', null, h('b', { text: 'Wir rufen Sie an' }), 'zu Ihrer Wunschzeit, sichern die Domain und bauen Ihre Seite.'),
      h('li', null, h('b', { text: 'Vorschau ansehen' }), 'Sie bekommen einen Link, geben frei oder nennen uns Ihre Änderungen.'),
      h('li', null, h('b', { text: 'Live' }), 'Ihre Seite geht online, ab dann läuft das Monatsabo.')), rueck]));
    const abschnitt = (titel, station, zeilen) => h('div', { class: 'a-abschnitt' }, h('div', { class: 'a-karte-kopf' }, h('h3', { text: titel }), U.ring('Ändern', { class: 'klein', on: { click: () => zeigen(station) } })),
      h('dl', { class: 'a-kv' }, zeilen.filter(Boolean).map((z) => [h('dt', { text: z[0] }), h('dd', null, z[1] || '–')])));
    const neueDomain = mm.domain && ad.art !== 'eigene';
    const ab = [abschnitt('Ihr Betrieb', 'betrieb', [['Unternehmen', b.rechtsform && b.firma.toLowerCase().replace(/[\s.]/g, '').indexOf(b.rechtsform.toLowerCase().replace(/[\s.]/g, '')) < 0 ? b.firma + ', ' + b.rechtsform : b.firma], ['Auf der Seite', b.name], ['Ansprechperson', [b.ap, b.rolle].filter(Boolean).join(', ')], ['Kontakt', [b.tel, b.mail].filter(Boolean).join(' · ')], ['Anschrift', [b.strasse, [b.plz, b.ort].filter(Boolean).join(' ')].filter(Boolean).join(', ')], b.web ? ['Bisherige Website', b.web.replace(/^https?:\/\//, '').replace(/\/$/, '') + ', bleibt, wie sie ist'] : null]),
      abschnitt('Adresse', 'adresse', [[neueDomain ? 'Neue Domain' : 'Ihre Seite', (adresseText() || (ad.vorschlaege ? 'Vorschläge von uns' : '')) + (neueDomain ? ', wir registrieren sie (bis ' + P.DOMAIN_JAHR + ' € netto im Jahr inklusive)' : mm.domain ? ', Ihre Domain, Anbindung nach Absprache' : '')], ['Anfragen an', ad.eingang.filter(Boolean).join(', ')], mm.dashboard ? ['Team', ad.team.filter(Boolean).join(', ') || 'später'] : null])];
    if (A.gestaltet(mm)) {
      const fotos = A.FOTO_PLAETZE.filter((f) => datei(f.k)).length, sw = h('span', { class: 'a-swatches' }, t.farben.map(A.farbe).filter(Boolean).map((c) => h('i', { style: 'background:' + c })));
      ab.push(abschnitt('Auftritt', 'auftritt', [['Angaben', S.weg === 'schnell' ? 'Das Nötigste, den Rest übernehmen wir' : 'Ausführlich, Sie geben alles selbst vor'], ['Logo', datei('logo') ? 'hochgeladen' : 'reichen Sie später nach'], S.weg === 'schnell' ? ['Website', t.ausWebsite ? 'Texte, Farben und Bilder übernehmen' : '–'] : ['Farben', t.farben.some(A.farbe) ? sw : (t.farbenWebsite ? 'aus Logo oder Website' : 'wählen wir mit Ihnen')], S.weg === 'schnell' ? null : ['Fotos', fotos + ' von 6' + (fotos < 6 ? ', den Rest füllen wir mit passenden Bildern' : '')], S.weg === 'schnell' ? null : ['Texte', [t.ueberschrift, t.einleitung, t.leistungTitel, t.leistungText].filter(Boolean).length + ' von 4' + (t.ueberschrift ? '' : ', den Rest schreiben wir')]]));
    }
    nach.push(U.karte('Ihre Angaben', 'zum Prüfen', ab));
    setTimeout(zaehlen, 0);
    return { frage: U.frage('Alles da? *Dann bestellen Sie.*', null), inhalt: inhalt, fuss: fuss(kasse ? 'Kostenpflichtig bestellen' : 'Unverbindlich anfragen', (k) => bestellen(k), { grund: kasse ? 'Weiter zur Zahlung bei Stripe' : 'Unverbindlich, ohne Zahlung' }), nach: nach };
  };
  async function bestellen(knopf) {
    if (!S.stand) { U.toast('Bitte die Seite neu laden.'); return; }
    const box = wurzel.querySelector('.a-r-inhalt'), wert = (k) => { const e = box.querySelector('[data-k="' + k + '"] input'); return !!(e && e.checked); };
    const z = { unternehmer: wert('unternehmer'), agb: wert('agb') ? S.stand.stand : '', avv: wert('avv') };
    const p = A.pruefen(S.angaben, m(), null, S.weg);
    if (!p.ok) { const s = Object.keys(p.fehler)[0].split('.')[0]; zeigen(s); setTimeout(() => U.zuFeld(U.fehlerZeigen(wurzel.querySelector('.a-r-inhalt'), A[s](S.angaben[s], m(), S.weg).fehler)), 60); U.toast('Es fehlen noch Angaben'); return; }
    const r = A.zustimmung(z, S.stand.stand);
    const erstes = U.fehlerZeigen(box, r.fehler);
    if (erstes) { U.zuFeld(erstes); return; }
    U.warten(knopf, true);
    try {
      await speichern();
      const x = await U.api('POST', '/api/auftrag/' + S.auftrag.id + '/bestellen', { zustimmung: z });
      if (x.url) { location.href = x.url; return; }
      if (x.angefragt) { S.auftrag = x.auftrag; angefragt(); }
    } catch (e) {
      U.warten(knopf, false);
      const d = e.daten || {};
      if (d.neuLaden) { S.stand = await U.api('GET', '/api/auftrag/stand').catch(() => S.stand); render({ stehen: true }); U.toast(e.message); return; }
      if (d.station && d.station !== 'bestellen' && index(d.station) >= 0) { zeigen(d.station); setTimeout(() => U.zuFeld(U.fehlerZeigen(wurzel.querySelector('.a-r-inhalt'), d.felder || {}, d.station)), 60); }
      else if (d.felder) U.fehlerZeigen(box, d.felder, 'zustimmung');
      U.toast(e.message);
    }
  }
  function angefragt() {
    U.leeren(wurzel);
    wurzel.appendChild(h('main', { class: 'a-raster eins', id: 'inhalt' }, h('div', { class: 'a-r-frage' }, U.frage('Danke. *Ihre Anfrage ist bei uns.*', 'Unsere Kasse öffnet in Kürze. Wir melden uns per E-Mail, sobald Sie bezahlen können; bis dahin ist nichts verbindlich. Ihre Angaben bleiben im Kundenbereich gespeichert.')),
      h('div', { class: 'a-r-fuss a-fuss' }, U.pille('Zum Kundenbereich', { href: '/konto/#auftrag/' + S.auftrag.id }))));
    const t = wurzel.querySelector('h1'); if (t) t.focus();
  }

  /* ---------- Start ---------- */
  addEventListener('popstate', () => {
    const x = hashLesen();
    if (x.paket && !S.auftrag) S.paket = x.paket;
    if (x.station && index(x.station) >= 0 && (S.auftrag || index(x.station) <= index('konto'))) { S.station = x.station; render(); }
    else if (!x.id) { S.station = 'paket'; render(); }
  });
  async function start() {
    const x = hashLesen();
    if (x.paket) S.paket = x.paket;
    render();
    const [stand, ich] = await Promise.all([U.api('GET', '/api/auftrag/stand').catch(() => null), U.api('GET', '/api/auftrag/ich').catch(() => ({ angemeldet: false }))]);
    S.stand = stand; S.ich = ich;
    if (x.id) {
      const a = angemeldet() && (ich.auftraege || []).find((y) => y.id === x.id);
      if (a && !vorZahlung(a)) {
        if (ANGABEN.indexOf(x.station) < 0 || ['beendet', 'storniert'].indexOf(a.stand) >= 0) { location.replace('/konto/#auftrag/' + a.id); return; }
        S.aendern = true; laden(a); S.station = x.station; render(); return;
      }
      if (a) { laden(a); zeigen(x.station && index(x.station) >= 0 ? x.station : ersteOffene(), true); return; }
      if (!angemeldet()) { S.station = 'konto'; render(); return; }
    }
    render({ stehen: true });
  }
  start();
})();

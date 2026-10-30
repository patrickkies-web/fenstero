/* eeziframes · Bereich für Fensterbauer (/konto/): ein Bereich für zwei Dinge, Anfragen von Hauseigentümern aus der Vermittlung und die
   Aufträge der Konfigurator-Pakete (Wunsch des Inhabers, 30.10.2026).
   Anfragen (Server functions/api/vermittlung-partner.js): Zugang über den Link aus der Mail (#zugang/<token>, Vorschau ohne Anmeldung,
   dann Anmeldung per Code und Annehmen), eine Anfrage (#anfrage/<id>) mit dem Aufmaßblatt als Objekt, Echtheit, Eckdaten, Freischalten
   (erstes Aufmaß kostenlos, danach 29 € zzgl. USt über die Kasse von Stripe; Rückkehr /konto/?kasse=<session>#anfrage/<id>), danach
   Kontakt des Kunden und Aufmaßblatt als PDF; Register-Eintrag des Betriebs und Bereitschaft als Partner (Partnerbedingungen).
   Aufträge (Server functions/auftrag/): Übersicht, ein Auftrag mit Stand, Vorschau, Freigabe, Nachrichten, Angaben (Ändern über die
   Stationen der Bestellung, /bestellen/#<paket>/<id>/<station>), Paket und Wechsel, Zahlung und Rechnungen (Kundenportal von Stripe),
   Verlauf, Storno bis Arbeitsbeginn (Paketbedingungen § 7 Abs. 2). Adresse: #auftrag/<id>; Rückkehr aus der Kasse:
   /konto/?kasse=<session>#auftrag/<id>. Anmeldung per Code für beides (functions/auftrag/index.js); das Konto entsteht mit dem ersten
   Code. Rahmen wie die Bestellung (auftrag.css), die Stile der Anfragen in konto-anfragen.css (Präfix a-an-). */
(function () {
  'use strict';
  const U = window.AuftragUI, A = window.Auftrag, P = window.Pakete, h = U.h;
  const wurzel = document.getElementById('app');
  /* anfragen: Antwort von GET /api/konto/anfragen (betriebe, anfragen, preis, fassung, kasse, erstesFrei) oder null, wenn die
     Vermittlung nicht eingerichtet ist; ktx: Zugangs-Kontext für die Anmeldung über den Link (#zugang/<token>); ansicht: was gerade steht */
  const S = { ich: null, stand: null, mail: '', codeGeschickt: false, auftrag: null, nachrichten: null, start: true, anfragen: null, ktx: null, ansicht: null };
  const kurz = U.kurzname;
  const vorZahlung = (a) => ['entwurf', 'angefragt'].indexOf(a.stand) >= 0;
  const zuEnde = (a) => ['beendet', 'storniert'].indexOf(a.stand) >= 0;
  const LEISTUNGEN = ['Kunststoff', 'Holz', 'Holz-Alu', 'Alu', 'Haustüren', 'Rollläden', 'Insektenschutz'];
  const ohnePlz = (ort) => String(ort || '').replace(/^\d{5}\s*/, '');
  const PARTNER_LINK = () => h('a', { href: '/partnerbedingungen/', target: '_blank', rel: 'noopener', text: 'Partnerbedingungen' });

  /* ---------- Gerüst ---------- */
  function kopf(zurueck) {
    const rechts = [];
    if (S.ich && S.ich.angemeldet) { rechts.push(h('span', { class: 'a-wer', text: S.ich.mail })); rechts.push(U.ring('Abmelden', { class: 'klein', on: { click: abmelden } })); }
    const k = U.kopf({ zurueck: zurueck || '/fuer-fensterbauer/', zurueckLabel: zurueck ? 'Zur Übersicht' : 'Zur Seite für Fensterbauer', zusatz: 'Für Fensterbauer', rechts: rechts });
    k.id = 'kopf';
    const alt = document.getElementById('kopf'); if (alt) alt.replaceWith(k);
  }
  /* o: { band, buehne, frage, inhalt, fuss, nach, stehen, aktionUnten }. Die Pille steht unter der Frage (aktion-oben), bei
     aktionUnten unter dem Inhalt (die Handlung unter dem, was man bestätigt); nach kommt nach dem Fuß (Raster-Bereich „nach“) */
  function seite(o) {
    U.leeren(wurzel);
    const main = h('main', { class: 'a-raster ' + (o.aktionUnten ? 'a-an-unten ' : 'aktion-oben ') + (o.buehne ? 'zwei' : 'eins'), id: 'inhalt' },
      h('div', { class: 'a-r-band' }, o.band || null), h('aside', { class: 'a-r-buehne', 'aria-label': o.buehneLabel || 'Ihre Seite' }, o.buehne || null),
      h('div', { class: 'a-r-frage' }, o.frage), h('div', { class: 'a-r-inhalt' }, o.inhalt || null), o.fuss ? h('div', { class: 'a-r-fuss a-fuss' }, o.fuss) : null,
      o.nach ? h('div', { class: 'a-r-nach' }, o.nach) : null);
    wurzel.appendChild(main);
    wurzel.appendChild(h('p', { class: 'a-recht' }, h('a', { href: '/impressum/', text: 'Impressum' }), h('a', { href: '/datenschutz/', text: 'Datenschutz' }), h('a', { href: '/konfigurator-bedingungen/', text: 'Paketbedingungen' }), h('a', { href: '/partnerbedingungen/', text: 'Partnerbedingungen' })));
    if (!o.stehen) { window.scrollTo(0, 0); if (!S.start) { const t = main.querySelector('h1'); if (t) t.focus({ preventScroll: true }); } }
    if (!o.ladend) S.start = false; /* eine Ladeansicht zählt nicht als erste Seite: die echte bekommt beim Start keinen Fokusring */
  }

  /* ---------- Anmeldung ----------
     Ohne Kontext die Anmeldeseite des Bereichs; mit S.ktx (Zugang über den Link) steht darüber die Vorschau der Anfrage: Aufmaßblatt auf
     der Bühne, Echtheit und Eckdaten, darunter die Anmeldung mit der Adresse, an die der Zugang ging (voll, wenn die Sitzung passt,
     sonst maskiert als Hinweis). Passt die angemeldete Adresse nicht, steht statt des Formulars der Hinweis mit „Mit anderer Adresse anmelden“. */
  function anmeldung() {
    const k = S.ktx;
    kopf();
    if (k && k.angemeldet && !k.passt) {
      seite({ buehne: blattObjekt(k.vorschau, { gesperrt: true }), buehneLabel: 'Die Anfrage', frage: U.frage(anfrageTitel(k.vorschau), 'Den Zugang zu dieser Anfrage haben wir an eine andere E-Mail-Adresse geschickt.'),
        inhalt: [echtheitKarte(k.vorschau), eckdatenKarte(k.vorschau), U.karte('Andere Adresse', null, h('p', null, 'Sie sind als ', h('b', { text: S.ich.mail }), ' angemeldet. Den Zugang haben wir an ', h('b', { text: k.mail }), ' geschickt. Melden Sie sich mit dieser Adresse an, dann ist die Anfrage in Ihrem Bereich.'), { class: 'a-karte a-an-hinweiskarte' })],
        fuss: [U.pille('Mit anderer Adresse anmelden', { on: { click: (e) => andereAdresse(e.currentTarget) } })], aktionUnten: true });
      return;
    }
    const hinweis = k && !S.codeGeschickt ? (k.mailVoll ? 'An diese Adresse haben wir den Zugang geschickt.' : 'Den Zugang haben wir an ' + k.mail + ' geschickt. Bitte melden Sie sich mit dieser Adresse an.') : null;
    const mail = U.feld({ k: 'mail', label: 'Ihre E-Mail-Adresse', typ: 'email', auto: 'email', wert: S.mail, platzhalter: 'name@ihr-betrieb.de', hilfe: hinweis, onInput: (v) => { S.mail = v.trim(); } });
    const teile = [mail]; let code = null;
    if (S.codeGeschickt) {
      mail.eingabe.readOnly = true;
      code = U.feld({ k: 'code', label: 'Code aus der E-Mail', modus: 'numeric', auto: 'one-time-code', max: 7, roh: true, platzhalter: '123 456', hilfe: 'Wir haben den Code an ' + S.mail + ' geschickt. Er gilt 15 Minuten.' });
      teile.push(code, h('div', { class: 'a-knoepfe', style: 'padding:4px 0 14px' }, U.ring('Neuen Code schicken', { class: 'klein', on: { click: (e) => codeSchicken(e.currentTarget) } }), U.ring('Andere Adresse', { class: 'klein', on: { click: () => { S.codeGeschickt = false; anmeldung(); } } })));
    }
    const knopf = U.pille(S.codeGeschickt ? 'Anmelden' : 'Code schicken', { on: { click: () => weiter() } });
    const weiter = () => { if (U.wartet(knopf)) return; if (S.codeGeschickt) anmelden(knopf); else codeSchicken(knopf); };
    const formular = h('form', { novalidate: true, on: { submit: (e) => { e.preventDefault(); weiter(); } } }, teile, h('button', { type: 'submit', hidden: true, tabindex: '-1', 'aria-hidden': 'true' }));
    if (k) {
      /* Zugang über den Link: erst die Anfrage, dann die Anmeldung; die Pille steht unter dem Formular */
      const v = k.vorschau, p = k.preis || {};
      seite({ buehne: blattObjekt(v, { gesperrt: true }), buehneLabel: 'Die Anfrage', frage: U.frage(anfrageTitel(v), 'Melden Sie sich an, um die Anfrage freizuschalten. ' + (k.erstesFrei ? 'Ihr erstes Aufmaß über eeziframes ist kostenlos.' : 'Jedes Aufmaß kostet ' + (p.text || '29 € zzgl. USt') + ', fällig erst beim Freischalten.')),
        inhalt: [echtheitKarte(v), eckdatenKarte(v), U.karte('Anmelden mit Code', 'Ein Passwort brauchen Sie nicht', formular)], fuss: [knopf], stehen: !!S.codeGeschickt, aktionUnten: true });
    } else {
      const frage = U.frage('Für Fensterbauer: Anfragen von Hauseigentümern und Ihr Konfigurator-Paket. *Anmelden mit Code.*', 'Geben Sie Ihre E-Mail-Adresse ein. Wir schicken Ihnen einen Code, ein Passwort brauchen Sie nicht.');
      frage.classList.add('a-an-anmeldefrage');
      seite({ frage: frage, inhalt: [U.karte(null, null, formular),
        h('p', { class: 'a-fusszeile' }, U.aenderbar('Noch kein Konto? Es entsteht mit dem ersten Code, den Sie anfordern.'), ' ', h('a', { class: 'a-link', href: '/fuer-fensterbauer/', text: 'Zur Seite für Fensterbauer' }))],
        fuss: [knopf], stehen: !!S.codeGeschickt });
    }
    setTimeout(() => { const e = (code || mail).eingabe; if (e && S.codeGeschickt) e.focus({ preventScroll: true }); }, 30);
  }
  /* Angemeldet mit einer Adresse, an die der Zugang nicht ging: abmelden und mit der richtigen Adresse neu anmelden */
  async function andereAdresse(knopf) {
    if (U.wartet(knopf)) return; U.warten(knopf, true);
    await U.api('POST', '/api/auftrag/abmelden', {}).catch(() => null);
    S.ich = { angemeldet: false }; S.anfragen = null; S.codeGeschickt = false; S.mail = '';
    if (S.ktx) { S.ktx.angemeldet = false; S.ktx.passt = false; S.ktx.mailVoll = ''; }
    anmeldung();
  }
  async function codeSchicken(knopf) {
    const f = wurzel.querySelector('[data-k="mail"]');
    if (!A.mailOk(S.mail)) { U.fehlerSetzen(f, 'Bitte eine gültige E-Mail-Adresse eingeben.'); U.zuFeld(f); return; }
    U.warten(knopf, true);
    try { await U.api('POST', '/api/auftrag/code', { mail: S.mail }); S.codeGeschickt = true; anmeldung(); U.toast('Code ist unterwegs'); }
    catch (e) { U.warten(knopf, false); U.fehlerSetzen(f, e.message); }
  }
  async function anmelden(knopf) {
    const f = wurzel.querySelector('[data-k="code"]'), code = f.eingabe.value.replace(/\D/g, '');
    if (code.length !== 6) { U.fehlerSetzen(f, 'Bitte den sechsstelligen Code eingeben.'); U.zuFeld(f); return; }
    U.warten(knopf, true);
    try { await U.api('POST', '/api/auftrag/anmelden', { mail: S.mail, code: code }); S.ich = await U.api('GET', '/api/auftrag/ich'); await anfragenLaden(); route(); }
    catch (e) { U.warten(knopf, false); if (e.daten && e.daten.neu) { S.codeGeschickt = false; anmeldung(); U.toast(e.message); return; } U.fehlerSetzen(f, e.message); }
  }
  async function abmelden() { await U.api('POST', '/api/auftrag/abmelden', {}).catch(() => null); S.ich = { angemeldet: false }; S.anfragen = null; S.codeGeschickt = false; S.ktx = null; if (location.hash) location.hash = ''; else anmeldung(); }

  /* ---------- Übersicht ----------
     Für beide Seiten gleichwertig (Wunsch des Inhabers, 30.10.2026): die Kachel „Anfragen“ (Zahl als Held, die letzten Anfragen als
     Zeilen mit Ort, Datum und Stand), die Kachel „Ihre Seite mit Konfigurator“ (Aufträge als Zeilen; ohne Auftrag eine ruhige Einladung
     zu den Paketen) und der Betrieb im Register als kleine Karte. Kein Vorwurf „Noch keine Bestellung“. */
  function uebersicht(o) {
    o = o || {};
    kopf();
    S.ansicht = { art: 'uebersicht' };
    const l = S.ich.auftraege || [], an = !!S.anfragen, liste = anfragenListe(), b = betriebe()[0] || null;
    const offen = liste.filter((x) => x.stand !== 'frei'), frei = liste.filter((x) => x.stand === 'frei');
    const inhalt = [];
    if (an) inhalt.push(anfragenKachel(liste, offen, frei));
    inhalt.push(seiteKachel(l));
    if (an) inhalt.push(betriebKarte(b));
    /* die eine Handlung: die neueste offene Anfrage, sonst der nächste Schritt als Partner, sonst Bestellung oder Konfigurator ausprobieren */
    let pille;
    if (offen.length) pille = U.pille('Anfrage aus ' + ohnePlz(offen[0].ort) + ' öffnen', { href: '#anfrage/' + offen[0].id });
    else if (an && !b) pille = U.pille('Als Betrieb eintragen', { on: { click: () => betriebBearbeiten(null) } });
    else if (an && !(b.partner || {}).bereit) pille = U.pille('Bereitschaft erklären', { on: { click: () => partnerErklaeren(b) } });
    else if (l.length) pille = U.pille('Neue Bestellung', { href: '/bestellen/' });
    else pille = U.pille('Konfigurator ausprobieren', { href: '/app/?ausprobieren=signature&direkt' });
    seite({ frage: U.frage('Ihr Bereich *für Anfragen und Ihre Seite.*', 'Anfragen von Hauseigentümern aus Ihrer Umgebung und Ihr Konfigurator-Paket, an einem Ort.'), inhalt: inhalt, fuss: [pille], stehen: o.stehen });
  }
  function anfragenKachel(liste, offen, frei) {
    const teile = [h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Anfragen' }), offen.length ? U.chip(offen.length === 1 ? '1 zum Freischalten' : offen.length + ' zum Freischalten', 'hinweis') : null)];
    teile.push(h('div', { class: 'a-an-kennzahl' }, h('b', null, String(liste.length), h('small', { text: liste.length === 1 ? 'Anfrage' : 'Anfragen' })),
      h('span', { text: liste.length ? (frei.length ? frei.length + ' freigeschaltet' : 'noch keine freigeschaltet') + (offen.length ? ' · ' + offen.length + (offen.length > 1 ? ' warten' : ' wartet') + ' auf Sie' : '') : 'Partner bekommen neue Anfragen aus ihrer Umgebung direkt hier, mit Eckdaten und Echtheitsprofil.' })));
    if (liste.length) {
      const ol = h('ul', { class: 'a-an-zeilen' });
      const zeichnen = (n) => { U.leeren(ol); liste.slice(0, n).forEach((x) => ol.appendChild(h('li', null, anfrageZeile(x)))); };
      zeichnen(5); teile.push(ol);
      if (liste.length > 5) teile.push(h('div', { class: 'a-knoepfe' }, U.ring('Alle ' + liste.length + ' Anfragen', { class: 'klein', on: { click: (e) => { zeichnen(liste.length); e.currentTarget.remove(); } } })));
    }
    return U.kachel(teile, 'a-an-kachel a-an-anfragen');
  }
  function anfrageZeile(x) {
    const e = x.echtheit || {}, frei = x.stand === 'frei';
    return h('a', { class: 'a-an-zeile', href: '#anfrage/' + x.id }, h('span', null, h('b', { text: frei && x.kunde && x.kunde.name ? x.kunde.name + ' · ' + ohnePlz(x.ort) : ohnePlz(x.ort) }),
      h('small', { text: [U.datum(x.eingang), x.nr, e.fenster ? e.fenster + ' Fenster' : ''].filter(Boolean).join(' · ') })), U.chip(frei ? 'Freigeschaltet' : 'Freischalten', frei ? 'aktiv' : 'hinweis'));
  }
  function seiteKachel(l) {
    const teile = [h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Ihre Seite mit Konfigurator' }), l.length ? U.chip(l.length === 1 ? '1 Auftrag' : l.length + ' Aufträge', 'leise') : null)];
    if (!l.length) {
      teile.push(h('p', { text: 'Anfragen in dieser Qualität auch von Ihrer eigenen Website: Ihre Kunden planen zu Hause, Sie bekommen jede Anfrage mit Aufmaßblatt. Pakete ab ' + U.euro(minMonat()) + ' im Monat.' }));
      teile.push(h('div', { class: 'a-knoepfe' }, U.ring('Pakete ansehen', { href: '/fuer-fensterbauer/#pakete' })));
    } else teile.push(h('ul', { class: 'a-an-zeilen' }, l.map((a) => h('li', null, auftragZeile(a)))));
    return U.kachel(teile, 'a-an-kachel a-an-seite');
  }
  function auftragZeile(a) {
    const b = (a.angaben || {}).betrieb || {};
    return h('a', { class: 'a-an-zeile a-auftrag-kachel', href: '#auftrag/' + a.id }, h('span', null, h('b', { text: b.name || b.firma || 'Ohne Namen' }),
      h('small', { text: [a.paketName, a.adresse || 'Adresse folgt', a.nr, a.ungelesen ? a.ungelesen + ' neue Nachricht' + (a.ungelesen > 1 ? 'en' : '') : ''].filter(Boolean).join(' · ') })), U.chip(A.STAND_TITEL[a.stand], a.stand === 'live' ? 'aktiv' : 'leise'));
  }
  const minMonat = () => Math.min.apply(null, P.LISTE.map((p) => P.preis(p).monat));

  /* ---------- Ein Auftrag ---------- */
  const dateiUrl = (a, d) => (d && /^image\/(png|jpeg|webp|svg\+xml)$/.test(d.typ) ? '/api/auftrag/' + a.id + '/datei/' + d.id : '');
  const datei = (a, platz) => (a.dateien || []).filter((d) => d.platz === platz).pop() || null;
  function buehne(a) {
    const v = U.vorschau(), g = a.angaben || {}, b = g.betrieb || {}, t = g.auftritt || {};
    v.setzen({ paket: a.paket, adresse: a.adresse, live: ['live', 'pausiert'].indexOf(a.stand) >= 0, name: b.name || b.firma, ort: b.ort, region: b.region, ap: b.ap, rolle: b.rolle, ueberschrift: t.ueberschrift, einleitung: t.einleitung, einladung: t.einladung,
      farbe: A.farbe((t.farben || [])[0]), logo: dateiUrl(a, datei(a, 'logo')), portrait: dateiUrl(a, datei(a, 'portrait')), buehne: dateiUrl(a, datei(a, 'buehne')) });
    return h('div', { class: 'a-buehne' }, h('div', { class: 'a-buehne-in' }, v.el, h('div', { class: 'a-buehne-zeile' }, h('span', null, h('b', { style: 'color:var(--weiss);font-weight:500', text: kurz(a.paket) }), ' · ' + a.nr), U.chip(A.STAND_TITEL[a.stand], a.stand === 'live' ? 'aktiv' : 'leise'))));
  }
  function offeneStation(a) {
    return A.offen(a.angaben, P.merkmale(a.paket) || {}, a.weg) || 'bestellen';
  }
  /* Nach der Zahlung: was beim Einrichten der Seite noch fehlt (Wunsch des Inhabers, 27.10.2026: vor der Kasse nur das Nötigste, alles
     Weitere hier), je mit der Station, die es zeigt: Impressum; bei „Selbst angeben“ Logo, Fotos und Texte; bei Signature das Team */
  function einrichten(a) {
    const m = P.merkmale(a.paket) || {}, g = a.angaben || {}, t = g.auftritt || {}, ad = g.adresse || {}, out = [];
    if (!A.betrieb(g.betrieb, m, a.weg).ok) out.push({ station: 'betrieb', text: 'die Angaben für Ihr Impressum' });
    if (A.gestaltet(m) && a.weg !== 'schnell') {
      if (m.logo && !datei(a, 'logo')) out.push({ station: 'auftritt', text: 'Ihr Logo' });
      if (m.fotos && !A.FOTO_PLAETZE.some((f) => datei(a, f.k))) out.push({ station: 'auftritt', text: 'Fotos Ihres Betriebs' });
      if (!t.ueberschrift && !t.einleitung) out.push({ station: 'auftritt', text: 'Ihre Texte' });
    }
    if (m.dashboard && !(ad.team || []).some(Boolean)) out.push({ station: 'adresse', text: 'die Zugänge für Ihr Team' });
    return out;
  }
  const aufzaehlen = (l) => (l.length > 1 ? l.slice(0, -1).join(', ') + ' und ' + l[l.length - 1] : l[0] || '');
  /* Frage, Satz und die eine Handlung je Stand */
  function lage(a) {
    const z = a.zahlung || {}, v = a.vorschau || {}, b = (a.angaben || {}).betrieb || {}, kasse = !!(S.stand && S.stand.verkauf && S.stand.verkauf.kasse);
    const weiter = '/bestellen/#' + a.paket + '/' + a.id + '/' + offeneStation(a);
    switch (a.stand) {
      case 'entwurf':
        if (z.status === 'laeuft') return { t: 'Ihre Lastschrift *ist unterwegs.*', p: 'SEPA-Lastschriften brauchen ein paar Werktage. Sobald der Betrag da ist, beginnen wir und schreiben Ihnen.' };
        return { t: 'Ihre Bestellung *ist noch offen.*', p: z.status === 'fehlgeschlagen' ? 'Die Lastschrift ist leider nicht durchgegangen. Bitte bezahlen Sie noch einmal, gern auch mit Karte.' : z.status === 'kasse' ? 'Die Zahlung ist noch nicht abgeschlossen. Sie können jederzeit weitermachen.' : 'Bis zur Bestellung fehlen noch ein paar Schritte. Alles bisher Eingegebene ist gespeichert.', pille: U.pille('Bestellung fortsetzen', { href: weiter }) };
      case 'angefragt':
        return kasse ? { t: 'Die Kasse ist offen. *Jetzt verbindlich bestellen?*', p: 'Ihre Angaben sind gespeichert. Prüfen Sie sie kurz und bezahlen Sie die Einrichtung.', pille: U.pille('Zur Bestellung', { href: '/bestellen/#' + a.paket + '/' + a.id + '/bestellen' }) }
          : { t: 'Ihre Anfrage *ist bei uns.*', p: 'Unsere Kasse öffnet in Kürze. Wir melden uns per E-Mail, sobald Sie bezahlen können; bis dahin ist nichts verbindlich.' };
      case 'bezahlt': {
        const e = einrichten(a), anruf = 'Wir rufen Sie ' + (b.rueckruf ? '„' + b.rueckruf + '“' : 'zu Ihrer Wunschzeit') + ' an und sichern Ihre Adresse. Bis wir beginnen, können Sie kostenlos stornieren.';
        if (e.length) return { t: 'Danke. *Jetzt richten Sie Ihre Seite ein.*', p: 'Es fehlen noch ' + aufzaehlen(e.map((x) => x.text)) + '. ' + anruf, pille: U.pille('Seite einrichten', { href: '/bestellen/#' + a.paket + '/' + a.id + '/' + e[0].station }) };
        return { t: 'Danke. *Wir beginnen mit Ihrer Seite.*', p: anruf };
      }
      case 'in_arbeit': {
        if (v.aenderung) return { t: 'Wir arbeiten *Ihre Änderungen ein.*', p: 'Danach bekommen Sie einen neuen Link zur Vorschau.' };
        const e = einrichten(a);
        return { t: 'Wir bauen *Ihre Seite.*', p: 'Sobald es eine Vorschau gibt, schicken wir Ihnen den Link per E-Mail.' + (e.length ? ' Bis dahin fehlen uns noch ' + aufzaehlen(e.map((x) => x.text)) + '.' : ' Fotos und Texte können Sie bis dahin unten ergänzen.'),
          pille: e.length ? U.pille('Seite einrichten', { href: '/bestellen/#' + a.paket + '/' + a.id + '/' + e[0].station }) : null };
      }
      case 'vorschau':
        if (v.freigabe) return { t: 'Freigegeben. *Wir schalten Ihre Seite live.*', p: 'Danke für Ihre Freigabe. Sobald die Seite online ist, bekommen Sie eine E-Mail.' };
        /* erst ansehen, dann freigeben: die Pille öffnet die Vorschau, Freigeben steht als Ring daneben (Gremium 27.10.2026) */
        return { t: 'Ihre Vorschau *ist fertig.*', p: 'Sehen Sie sich Ihre Seite in Ruhe an. Passt alles, geben Sie sie frei; sonst schreiben Sie uns, was wir ändern sollen.' + (v.frist ? ' Bitte bis ' + U.datum(v.frist) + ': Nennen Sie bis dahin keinen Mangel, gilt die Einrichtung als abgenommen (Paketbedingungen § 5 Abs. 5).' : ''), pille: v.link ? U.pille('Vorschau öffnen', { href: v.link, target: '_blank', rel: 'noopener' }) : U.pille('Freigeben', { on: { click: (e) => freigeben(a, e.currentTarget) } }) };
      case 'live':
        if ((a.abo || {}).status === 'zahlung_offen') return { t: 'Ihr Monatsbeitrag *ist offen.*', p: 'Die Abbuchung hat nicht geklappt. Bitte prüfen Sie Ihr Zahlungsmittel; ist die Zahlung ' + (a.fristen || {}).kulanzTage + ' Tage nach dem ersten Versuch nicht da, pausieren wir Ihre Seite.', pille: U.pille('Zahlungsmittel prüfen', { on: { click: (e) => portal(e.currentTarget) } }) };
        return { t: 'Ihre Seite *ist live.*', p: 'Ihre Kunden planen jetzt unter ' + (a.adresse || 'Ihrer Adresse') + '. Jede Anfrage kommt als Aufmaßblatt-PDF per E-Mail.', pille: v.live ? U.pille('Seite öffnen', { href: v.live, target: '_blank', rel: 'noopener' }) : null };
      case 'pausiert':
        if (a.sperre === 'zahlung') return { t: 'Ihre Seite *ist pausiert.*', p: 'Ihr Monatsbeitrag ist offen. Sobald die Zahlung da ist, ist Ihre Seite wieder online. Nach ' + (a.fristen || {}).pauseMaxTage + ' Tagen Pause endet der Vertrag.', pille: U.pille('Zahlungsmittel prüfen', { on: { click: (e) => portal(e.currentTarget) } }) };
        return { t: 'Ihre Seite *ist pausiert.*', p: 'Ihre Kunden sehen in dieser Zeit Ihre Kontaktdaten. Schreiben Sie uns, wenn Sie Fragen haben.' };
      case 'beendet': return { t: 'Ihr Vertrag *ist beendet.*', p: 'Ihre Seite ist offline. Danke, dass Sie eeziframes genutzt haben.' };
      case 'storniert': return { t: 'Bestellung *storniert.*', p: z.erstattet ? 'Die Einrichtung haben wir auf Ihr Zahlungsmittel erstattet.' : 'Diese Bestellung ist storniert.' };
      default: return { t: A.STAND_TITEL[a.stand] || a.stand, p: '' };
    }
  }

  function zeigen(a, o) {
    o = o || {};
    S.auftrag = a;
    const mehrere = (S.ich.auftraege || []).length > 1;
    kopf(mehrere ? '#' : null);
    const l = lage(a), inhalt = [];
    const v = a.vorschau || {};

    if (a.stand === 'vorschau' && !v.freigabe) inhalt.push(U.kachel([h('h2', { text: 'Ihre Vorschau' }), h('p', { text: 'Der Link zeigt Ihre Seite genau so, wie sie online gehen soll. Danach geben Sie frei oder schreiben uns Ihre Änderungen.' }),
      h('div', { class: 'a-knoepfe', style: 'margin-top:16px' }, v.link ? U.ring('Freigeben', { on: { click: (e) => freigeben(a, e.currentTarget) } }) : null, U.ring('Änderungen wünschen', { on: { click: () => aendernWuenschen(a) } }))], 'leucht'));
    if (a.stand === 'live' && v.live) inhalt.push(knopfKarte(a));
    if (!zuEnde(a)) inhalt.push(angabenKarte(a));
    inhalt.push(paketKachel(a));
    if (!vorZahlung(a) && !zuEnde(a)) inhalt.push(kiKarte(a));
    if (!vorZahlung(a) || a.stand === 'angefragt') inhalt.push(nachrichtenKachel(a));
    if (!vorZahlung(a)) inhalt.push(zahlungKarte(a));
    inhalt.push(verlaufKarte(a));
    const gefahr = gefahrZeile(a); if (gefahr) inhalt.push(gefahr);

    seite({ band: vorZahlung(a) || zuEnde(a) ? h('p', { class: 'a-band-text', text: a.nr + ' · ' + A.STAND_TITEL[a.stand] }) : U.leiste(a), buehne: buehne(a), frage: U.frage(l.t, l.p), inhalt: inhalt, fuss: l.pille ? [l.pille] : null, stehen: o.stehen });
    if (!vorZahlung(a) || a.stand === 'angefragt') nachrichtenLaden(a);
  }

  /* Angaben: drei Zeilen mit „Ändern“ (Stationen der Bestellung) */
  function angabenKarte(a) {
    const g = a.angaben || {}, b = g.betrieb || {}, ad = g.adresse || {}, t = g.auftritt || {}, m = P.merkmale(a.paket) || {};
    /* nach der Zahlung: „Ergänzen“, wo beim Einrichten noch etwas fehlt; vor der Zahlung gibt es nur Betrieb und Adresse */
    const vor = vorZahlung(a), e = vor ? [] : einrichten(a), fehlt = (st) => e.some((x) => x.station === st);
    const zeile = (titel, text, station) => h('div', { class: 'a-offen-zeile' }, h('span', null, h('b', { text: titel }), h('br'), h('span', { style: 'color:var(--textgrau)', text: text || '–' })),
      U.ring(fehlt(station) ? 'Ergänzen' : 'Ändern', { class: 'klein', href: '/bestellen/#' + a.paket + '/' + a.id + '/' + station, 'aria-label': titel + (fehlt(station) ? ' ergänzen' : ' ändern') }));
    const fotos = A.FOTO_PLAETZE.filter((f) => datei(a, f.k)).length;
    const zeilen = [zeile('Ihr Betrieb', [b.name || b.firma, b.ort, b.ap].filter(Boolean).join(' · ') + (vor ? '' : fehlt('betrieb') ? ' · Impressum fehlt noch' : ' · Impressum vollständig'), 'betrieb'),
      zeile('Adresse und Anfragen', [a.adresse || (ad.vorschlaege ? 'Vorschläge von uns' : ''), (ad.eingang || []).filter(Boolean).join(', '), !vor && m.dashboard ? ((ad.team || []).filter(Boolean).length ? (ad.team || []).filter(Boolean).length + ' im Team' : 'Team fehlt noch') : ''].filter(Boolean).join(' · '), 'adresse')];
    if (A.gestaltet(m) && !vor && a.weg === 'schnell') zeilen.push(zeile('Auftritt', ['Wir schlagen Ihre Seite vor', datei(a, 'logo') ? 'Logo da' : 'Logo gern nachreichen'].join(' · '), 'auftritt'));
    else if (A.gestaltet(m) && !vor) zeilen.push(zeile('Auftritt', [datei(a, 'logo') ? 'Logo da' : 'Logo fehlt', fotos + ' von 6 Fotos', (t.farben || []).some(A.farbe) ? 'Farben da' : (t.farbenWebsite ? 'Farben von der Website' : 'Farben folgen'), t.ueberschrift ? 'Texte da' : 'Texte schreiben wir'].join(' · '), 'auftritt'));
    return U.karte('Ihre Angaben', a.geaendert ? 'Geändert am ' + U.datum(a.geaendert) : null, [h('div', { class: 'a-offen' }, zeilen),
      vorZahlung(a) ? null : h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Jede Änderung sehen wir sofort; wir melden uns, sobald sie auf Ihrer Seite ist.' })]);
  }

  /* KI-Auswertungen: wie viel vom Kontingent dieses Monats genutzt ist (Kapselreihe, 20 Stäbchen je 5 %), weitere freischalten oder
     beenden (Paketbedingungen § 2 Abs. 2, § 4 Abs. 4). Lädt nach; bis dahin steht die Karte mit dem Kontingent. */
  const tausend = (n) => P.tausend(n);
  function kapseln(anteil, art) {
    const voll = Math.max(0, Math.min(20, Math.round(anteil * 20)));
    return h('div', { class: 'a-kapseln' + (art ? ' ' + art : ''), 'aria-hidden': 'true' }, Array.from({ length: 20 }, (_, i) => h('i', { class: i < voll ? 'an' : '', style: '--i:' + i })));
  }
  const reihe = (k, wert, max, text, art, mehr) => h('div', { class: 'a-ki-reihe' + (mehr ? ' ' + mehr : ''), role: 'meter', 'aria-label': art ? 'Weitere KI-Auswertungen' : 'KI-Auswertungen im Kontingent', 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(Math.min(wert, max)), 'aria-valuetext': text }, kapseln(wert / max, art));
  const bisText = (k) => U.datum(k.bis + 'T12:00:00Z');
  const deckel = (k) => 'höchstens ' + tausend(k.kontingent) + ' weitere, also höchstens ' + U.euro(k.hoechstCent / 100) + ' netto im Monat' + (k.hoechstBruttoCent ? ' (' + U.euro(k.hoechstBruttoCent / 100) + ' mit MwSt.)' : '');
  function kiKarte(a) {
    const karte = U.kachel([h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'KI-Auswertungen' })), h('p', { class: 'a-neben', text: 'Wird geladen …' })], 'a-ki');
    U.api('GET', '/api/auftrag/' + a.id + '/ki').then((r) => karte.replaceWith(kiInhalt(a, r.ki))).catch(() => { const p = karte.querySelector('.a-neben'); if (p) p.textContent = 'Der Stand lässt sich gerade nicht laden.'; });
    return karte;
  }
  /* Zahl höchstens 100 %: Was darüber liegt, zeigt die zweite Reihe als „weitere“ (Gremium 27.10.2026: „130 %“ las sich wie ein überzogenes Konto) */
  function kiInhalt(a, k, neu) {
    const pause = !k.frei && k.genutzt >= k.kontingent, oben = k.frei && k.genutzt >= k.obergrenze, bis = bisText(k);
    const teile = [h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'KI-Auswertungen' }), U.chip(k.monat, 'aktiv'))];
    if (k.verknuepft) {
      const inkl = Math.min(k.genutzt, k.kontingent);
      teile.push(h('div', { class: 'a-ki-zahl' }, h('b', null, String(Math.min(100, k.prozent)), h('small', { text: '%' })),
        h('span', { text: tausend(inkl) + ' von ' + tausend(k.kontingent) + ' Fotos ausgewertet · ' + (k.mehr ? tausend(k.mehr) + '\u00a0weitere' : 'je\u00a0Fenster\u00a0meist\u00a0zwei') })));
      teile.push(reihe(k, k.genutzt, k.kontingent, tausend(inkl) + ' von ' + tausend(k.kontingent) + ' Fotos ausgewertet'));
      if (k.frei || k.mehr) teile.push(h('div', { class: 'a-ki-weitere' }, reihe(k, k.mehr, k.kontingent, tausend(k.mehr) + ' von höchstens ' + tausend(k.kontingent) + ' weiteren', 'mehr', neu ? 'neu' : ''),
        h('p', { class: 'a-ki-mehr' }, h('b', { text: '+' + tausend(k.mehr) + ' weitere' }), ' · bisher ' + U.euro(k.mehrCent / 100) + ' netto, höchstens\u00a0' + U.euro(k.hoechstCent / 100) + '\u00a0netto')));
    } else teile.push(h('p', { class: 'a-ki-satz', text: tausend(k.kontingent) + ' KI-Auswertungen im Monat sind inklusive, eine je Foto, je Fenster meist zwei. ' + (['live', 'pausiert'].indexOf(a.stand) >= 0 ? 'Der Zähler läuft, sobald wir Ihren Konfigurator mit diesem Auftrag verbunden haben.' : 'Der Zähler startet, sobald Ihre Seite live ist.') }));
    const kern = k.frei ? 'Freigeschaltet' + (k.frei_seit ? ' seit ' + U.datum(k.frei_seit) : '') + ', gilt jeden Monat, bis Sie es beenden.'
      : pause ? 'Die KI pausiert bis ' + bis + '. Ihr Konfigurator läuft weiter.' : 'Bei 100 % pausiert nur die KI bis ' + bis + '. Ihr Konfigurator läuft weiter.';
    const rest = k.frei ? (oben ? 'Die ' + tausend(k.kontingent) + ' weiteren sind erreicht; die KI pausiert bis ' + bis + ', Ihr Konfigurator läuft weiter.'
      : 'Über ' + tausend(k.kontingent) + ' hinaus kostet jedes Foto ' + U.euro(k.preis) + ' netto, mit der nächsten Monatsrechnung; Sie zahlen nur, was genutzt wird. Nach ' + tausend(k.kontingent) + ' weiteren pausiert die KI bis zum Monatsende.')
      : 'Ihre Kunden planen und senden weiter, nur ohne KI-Befund. Bei 80 und 100 % bekommen Sie eine E-Mail.';
    if (k.verknuepft || k.frei) teile.push(h('p', { class: 'a-ki-satz' }, h('b', { text: kern }), ' ' + rest));
    teile.push(h('div', { class: 'a-ki-handlung' }, U.ring(k.frei ? 'Weitere Auswertungen beenden' : 'Weitere Auswertungen freischalten', { on: { click: () => kiUmschalten(a, k) } }),
      h('p', { text: k.frei ? 'Ihr Konfigurator bleibt an; danach entstehen keine weiteren Kosten.' : U.euro(k.preis) + ' je weiteres Foto, netto · ' + deckel(k) })));
    if ((k.abgerechnet || []).some((x) => x.mehr)) teile.push(h('ul', { class: 'a-ki-liste' }, k.abgerechnet.filter((x) => x.mehr).map((x) => h('li', null, h('b', { text: x.text }), ' ' + tausend(x.mehr) + ' weitere, ' + U.euro(x.cent / 100) + ' netto' + (x.offen ? ' (folgt)' : '')))));
    return U.kachel(teile, 'a-ki leucht');
  }
  /* Bestätigung: Preis als Zahl, Deckel, Dauer der Freischaltung, beim Beenden die Folgen (Gremium 27.10.2026, Vetos G, K, F) */
  function kiUmschalten(a, k) {
    const an = !k.frei, ja = U.pille(an ? 'Freischalten' : 'Beenden'), nein = U.ring('Abbrechen');
    const preis = U.euro(k.preis), zahl = preis.replace(/[\s\u00a0\u202f]*€$/, '');
    const inhalt = an ? [
      h('div', { class: 'a-ki-preis' }, h('b', null, zahl, h('small', { text: '€' })), h('span', { text: 'je weiteres Foto, netto · ' + deckel(k) })),
      h('p', { text: 'Über das Kontingent von ' + tausend(k.kontingent) + ' Fotos hinaus läuft die KI weiter. Sie zahlen nur, was genutzt wird, mit der nächsten Monatsrechnung. Nach ' + tausend(k.kontingent) + ' weiteren pausiert die KI bis zum Monatsende.' }),
      h('p', { class: 'a-ki-kern', text: 'Gilt ab sofort, auch in den nächsten Monaten, bis Sie es auf dieser Karte beenden.' })]
      : [h('p', { text: 'Ab sofort entstehen keine weiteren Kosten. Die KI pausiert, sobald das Kontingent von ' + tausend(k.kontingent) + ' erreicht ist' + (k.genutzt >= k.kontingent ? ', in diesem Monat also gleich' : '') + '. Ihr Konfigurator bleibt an.' + (k.mehr ? ' Die ' + tausend(k.mehr) + ' weiteren dieses Monats (' + U.euro(k.mehrCent / 100) + ' netto) kommen mit der nächsten Rechnung.' : '') })];
    const zu = U.blatt({ titel: an ? 'Weitere Auswertungen freischalten?' : 'Weitere Auswertungen beenden?', inhalt: inhalt, knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => {
      if (ja.dataset.wartet) return; ja.dataset.wartet = '1';
      try {
        const r = await U.api('POST', '/api/auftrag/' + a.id + '/ki', { frei: an });
        const alt = wurzel.querySelector('.a-ki'); if (alt) alt.replaceWith(kiInhalt(a, r.ki, an));
        zu(); U.toast(an ? 'Weitere Auswertungen freigeschaltet' : 'Weitere Auswertungen beendet');
      } catch (e) { delete ja.dataset.wartet; U.toast(e.message); }
    });
  }

  /* Paket: was frei ist, was mit dem nächsten Paket dazukommt, Wechsel anfragen */
  function paketKachel(a) {
    const pr = a.preise || P.preis(a.paket), n = A.naechstes(a.paket), w = a.wechsel;
    const liste = h('ul', { class: 'a-punkte a-anpassbar' }, A.anpassbar(a.paket).map((x) => h('li', { class: x.frei ? '' : 'zu' }, h('span', null, h('b', { text: x.titel }), ' ', h('span', { class: 'a-neben', text: x.text })), x.frei ? null : U.chip('ab ' + kurz(x.ab), 'leise'))));
    const teile = [h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Ihr Paket' }), U.chip(P.PAKETE[a.paket].name, 'aktiv')),
      h('p', null, U.euro(pr.monat) + ' netto im Monat' + (a.stand === 'live' ? '' : ' ab Livegang') + ', Einrichtung ' + U.euro(pr.einrichtung) + ' netto.'),
      h('p', { class: 'a-neben', style: 'margin-top:4px' }, P.tausend((P.merkmale(a.paket) || {}).kiMonat) + ' KI-Auswertungen im Monat inklusive, jede weitere ' + U.euro(pr.ki != null ? pr.ki : P.preis(a.paket).ki) + ' netto. Eine Auswertung ist ein Foto; den Stand sehen Sie unten.'), liste];
    if (n && !zuEnde(a)) {
      if (vorZahlung(a)) teile.push(h('div', { class: 'a-knoepfe', style: 'margin-top:14px' }, U.ring('Paket wechseln', { href: '/bestellen/#' + a.paket + '/' + a.id + '/paket' })));
      else if (w && w.paket) teile.push(h('p', { class: 'a-hinweis', style: 'margin-top:14px', text: 'Wechsel zu ' + P.PAKETE[w.paket].name + ' angefragt am ' + U.datum(w.zeit) + '. Wir melden uns.' }));
      else teile.push(h('div', { class: 'a-innen a-anreiz' }, h('p', { class: 'a-label-klein', style: 'margin:0' }, U.chip('Mit ' + kurz(n.paket))), h('h3', { text: 'Für ' + U.euro(n.monat) + ' mehr im Monat' }),
        h('ul', null, n.dazu.slice(0, 4).map((x) => h('li', { text: x.titel }))), h('p', { class: 'a-preis-dazu' }, n.einrichtung > 0 ? 'Einmalig ' + U.euro(n.einrichtung) + ' netto Differenz der Einrichtung' : 'Ohne weitere Einrichtungsgebühr'),
        U.rund('pfeil', 'Wechsel zu ' + kurz(n.paket) + ' anfragen', { class: 'voll gross', on: { click: (e) => wechselAnfragen(a, n, e.currentTarget) } })));
    }
    return U.kachel(teile, 'a-paket-kachel');
  }

  /* Knopf für die eigene Website (nach dem Livegang) */
  function knopfKarte(a) {
    const t = (a.angaben || {}).auftritt || {}, m = P.merkmale(a.paket) || {}, farbe = m.gestaltung === 'eigen' && A.farbe((t.farben || [])[0]) || '#07090a';
    const code = '<a href="' + a.vorschau.live + '" style="display:inline-block;padding:14px 24px;border-radius:999px;background:' + farbe + ';color:' + U.aufFarbe(farbe) + ';font:600 16px/1 system-ui,sans-serif;text-decoration:none">Fenster planen</a>';
    const pre = h('pre', { class: 'a-code', text: code });
    return U.karte('Knopf für Ihre Website', 'Zum Einfügen in Ihre Seite', [h('div', { style: 'padding:10px 0 12px' }, h('span', { class: 'a-knopf-muster', style: 'background:' + farbe + ';color:' + U.aufFarbe(farbe), text: 'Fenster planen' })), pre,
      h('div', { class: 'a-knoepfe', style: 'padding:10px 0 16px' }, U.ring([U.icon('kopie'), ' Code kopieren'], { class: 'klein', on: { click: () => kopieren(code) } }))]);
  }
  function kopieren(text) {
    const ok = () => U.toast('Kopiert');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, () => U.toast('Bitte den Code markieren und kopieren.'));
    else U.toast('Bitte den Code markieren und kopieren.');
  }

  /* Nachrichten */
  let nachrichtenListe = null;
  function nachrichtenKachel(a) {
    nachrichtenListe = h('ol', { class: 'a-nachrichten', 'aria-live': 'polite' }, h('li', { class: 'a-nachricht', text: 'Wird geladen …' }));
    const feld = h('textarea', { rows: '3', maxlength: String(A.GRENZEN.nachricht), placeholder: 'Ihre Nachricht an uns', 'aria-label': 'Ihre Nachricht' });
    const knopf = U.ring('Senden', { on: { click: () => senden() } });
    async function senden() {
      const text = feld.value.trim(); if (text.length < 2 || U.wartet(knopf)) return;
      knopf.setAttribute('aria-disabled', 'true'); knopf.dataset.wartet = '1';
      try { const r = await U.api('POST', '/api/auftrag/' + a.id + '/nachrichten', { text: text }); feld.value = ''; (S.nachrichten = S.nachrichten || []).push(r.nachricht); nachrichtenZeigen(); }
      catch (e) { U.toast(e.message); }
      knopf.removeAttribute('aria-disabled'); delete knopf.dataset.wartet;
    }
    return U.kachel([h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Nachrichten' }), h('small', { style: 'color:var(--silbergrau)', text: 'Antwort auch per E-Mail' })), nachrichtenListe,
      h('div', { class: 'a-schreiben' }, h('div', { class: 'a-flaeche dunkel' }, feld), knopf)], 'a-nachrichten-kachel');
  }
  async function nachrichtenLaden(a) {
    try { const r = await U.api('GET', '/api/auftrag/' + a.id + '/nachrichten'); if (S.auftrag !== a) return; S.nachrichten = r.nachrichten; nachrichtenZeigen(); }
    catch (e) { if (nachrichtenListe) { U.leeren(nachrichtenListe); nachrichtenListe.appendChild(h('li', { class: 'a-nachricht', text: e.message })); } }
  }
  function nachrichtenZeigen() {
    if (!nachrichtenListe) return;
    U.leeren(nachrichtenListe);
    const l = S.nachrichten || [];
    if (!l.length) nachrichtenListe.appendChild(h('li', { class: 'a-nachricht leer', text: 'Noch keine Nachrichten. Fragen zu Ihrer Seite? Schreiben Sie uns einfach.' }));
    l.forEach((n) => nachrichtenListe.appendChild(h('li', { class: 'a-nachricht' + (n.von === 'kunde' ? ' eigene' : '') }, h('small', { text: (n.von === 'kunde' ? 'Sie' : 'eeziframes') + ' · ' + U.zeit(n.zeit) }), n.text)));
    nachrichtenListe.scrollTop = nachrichtenListe.scrollHeight;
  }

  /* Zahlung und Rechnungen */
  function zahlungKarte(a) {
    const z = a.zahlung || {}, ab = a.abo || {};
    const ABO = { aktiv: 'aktiv', zahlung_offen: 'Abbuchung offen', beendet: 'beendet' };
    const netto = (a.preise || P.preis(a.paket) || {}).einrichtung;
    const zeilen = [['Einrichtung', z.status === 'bezahlt' ? U.euro((z.betrag_cent || 0) / 100) + ' inkl. USt. (' + U.euro(netto) + ' netto), bezahlt am ' + U.datum(z.bezahlt_am) + (z.erstattet ? ', erstattet' : '') : (z.status === 'laeuft' ? 'Lastschrift unterwegs' : 'offen')],
      ['Monatsabo', ab.status ? (ABO[ab.status] || ab.status) + (ab.seit ? ' seit ' + U.datum(ab.seit) : '') : 'beginnt mit dem Livegang'], ab.bis && ab.status === 'aktiv' ? ['Nächste Abbuchung', U.datum(ab.bis)] : null].filter(Boolean);
    return U.karte('Zahlung und Rechnungen', null, [h('dl', { class: 'a-kv' }, zeilen.map((x) => [h('dt', { text: x[0] }), h('dd', { text: x[1] })])),
      h('div', { class: 'a-knoepfe', style: 'padding:6px 0 16px' }, U.ring('Rechnungen und Zahlungsmittel', { class: 'klein', on: { click: (e) => portal(e.currentTarget) } }))]);
  }
  async function portal(knopf) {
    if (U.wartet(knopf)) return; knopf.dataset.wartet = '1';
    try { const r = await mitFrisch(() => U.api('POST', '/api/auftrag/portal', {})); location.href = r.url; } catch (e) { delete knopf.dataset.wartet; U.toast(e.message); }
  }
  /* Storno und Kundenportal verlangen eine frische Anmeldung (Server: 401 mit frisch): Code an die eigene Adresse, dann noch einmal */
  async function mitFrisch(fn) {
    try { return await fn(); } catch (e) { if (!(e.daten && e.daten.frisch)) throw e; await neuBestaetigen(); return fn(); }
  }
  function neuBestaetigen() {
    return new Promise((ok, nein) => {
      U.api('POST', '/api/auftrag/code', { mail: S.ich.mail }).catch((e) => U.toast(e.message));
      const code = U.feld({ k: 'code', label: 'Code aus der E-Mail', modus: 'numeric', auto: 'one-time-code', max: 7 });
      const ja = U.pille('Bestätigen'), abb = U.ring('Abbrechen');
      const zu = U.blatt({ titel: 'Kurz bestätigen', text: 'Für diesen Schritt brauchen wir einen frischen Code. Wir haben ihn an ' + S.ich.mail + ' geschickt.', inhalt: h('div', { class: 'a-karte', style: 'margin-bottom:4px' }, code), knoepfe: [ja, abb] });
      abb.addEventListener('click', () => { zu(); nein(new Error('Abgebrochen.')); });
      ja.addEventListener('click', async () => {
        if (U.wartet(ja)) return; U.warten(ja, true);
        try { await U.api('POST', '/api/auftrag/anmelden', { mail: S.ich.mail, code: code.eingabe.value.replace(/\D/g, '') }); zu(); ok(); }
        catch (e) { U.warten(ja, false); U.fehlerSetzen(code, e.message); }
      });
    });
  }

  /* Verlauf */
  function verlaufKarte(a) {
    const l = (a.verlauf || []).slice().reverse();
    const ol = h('ol', { class: 'a-verlauf' });
    const zeichnen = (n) => { U.leeren(ol); l.slice(0, n).forEach((x) => ol.appendChild(h('li', null, h('small', { text: U.zeit(x.zeit) }), x.text))); };
    zeichnen(5);
    return U.karte('Verlauf', null, [ol, l.length > 5 ? h('div', { style: 'padding:0 0 14px' }, U.ring('Alles zeigen', { class: 'klein', on: { click: (e) => { zeichnen(l.length); e.currentTarget.remove(); } } })) : null]);
  }

  /* Storno, Verwerfen, Kündigen */
  function gefahrZeile(a) {
    if (a.stand === 'bezahlt') return h('div', { class: 'a-knoepfe a-gefahr' }, U.ring('Bestellung stornieren', { class: 'gefahr klein', on: { click: () => stornieren(a) } }));
    if (vorZahlung(a) && ['laeuft'].indexOf((a.zahlung || {}).status) < 0) return h('div', { class: 'a-knoepfe a-gefahr' }, U.ring('Bestellung verwerfen', { class: 'gefahr klein', on: { click: () => verwerfen(a) } }));
    if (a.stand === 'live' || a.stand === 'pausiert') return h('p', { class: 'a-fusszeile' }, U.aenderbar('Kündigen können Sie jederzeit zum Ende des laufenden Abrechnungsmonats (er beginnt am Tag des Livegangs), unter „Rechnungen und Zahlungsmittel“ oder per Nachricht.'));
    return null;
  }
  function bestaetigen(titel, text, knopfText, fn, gefahr) {
    const ja = gefahr ? U.ring(knopfText, { class: 'gefahr' }) : U.pille(knopfText), nein = U.ring('Abbrechen');
    const zu = U.blatt({ titel: titel, text: text, knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => { if (ja.dataset.wartet) return; ja.dataset.wartet = '1'; try { await fn(); zu(); } catch (e) { delete ja.dataset.wartet; U.toast(e.message); } });
  }
  function stornieren(a) {
    bestaetigen('Bestellung stornieren?', 'Wir haben noch nicht begonnen. Die Einrichtung erstatten wir vollständig auf Ihr Zahlungsmittel.', 'Ja, stornieren', async () => {
      const r = await mitFrisch(() => U.api('POST', '/api/auftrag/' + a.id + '/stornieren', {})); ersetzen(r.auftrag); zeigen(r.auftrag); U.toast('Storniert');
    }, true);
  }
  function verwerfen(a) {
    bestaetigen('Bestellung verwerfen?', 'Ihre Angaben und Dateien zu dieser Bestellung werden gelöscht.', 'Ja, verwerfen', async () => {
      await U.api('POST', '/api/auftrag/' + a.id + '/verwerfen', {}); S.ich.auftraege = S.ich.auftraege.filter((x) => x.id !== a.id); location.hash = ''; route(); U.toast('Verworfen');
    }, true);
  }
  /* Was dem Kunden vor der Freigabe noch fehlt (Logo, Fotos, Porträt je Paket); leer, wenn alles da ist */
  function fehltNoch(a) {
    const m = P.merkmale(a.paket) || {}, out = [];
    if (m.logo && !datei(a, 'logo')) out.push('Ihr Logo');
    const fotos = m.fotos ? A.FOTO_PLAETZE.filter((f) => !datei(a, f.k)).length : 0;
    if (fotos) out.push(fotos === 1 ? 'ein Foto Ihres Betriebs' : fotos + ' Fotos Ihres Betriebs');
    if (m.startansicht && !datei(a, 'portrait')) out.push('Ihr Porträt');
    return out;
  }
  function freigeben(a, knopf) {
    const fehlt = fehltNoch(a);
    const text = (fehlt.length ? 'Es fehlen noch ' + fehlt.join(', ').replace(/, ([^,]*)$/, ' und $1') + '. An diesen Stellen zeigt Ihre Seite dann unsere Platzhalter-Bilder, bis Sie nachreichen. ' : '') +
      'Danach schalten wir Ihre Seite live; ab dem Livegang läuft Ihr Monatsabo. Kleinigkeiten können Sie auch danach noch ändern.';
    bestaetigen('Vorschau freigeben?', text, fehlt.length ? 'Trotzdem freigeben' : 'Freigeben', async () => {
      const r = await U.api('POST', '/api/auftrag/' + a.id + '/freigabe', { aktion: 'freigeben' }); ersetzen(r.auftrag); zeigen(r.auftrag); U.toast('Freigegeben');
    });
  }
  function aendernWuenschen(a) {
    const feld = h('textarea', { rows: '5', maxlength: String(A.GRENZEN.nachricht), placeholder: 'z. B. Das Foto oben bitte tauschen, und in der Einleitung „Rollläden“ ergänzen.', 'aria-label': 'Was sollen wir ändern?' });
    const ja = U.ring('Änderungen senden'), nein = U.ring('Abbrechen');
    const zu = U.blatt({ titel: 'Was sollen wir ändern?', text: 'Schreiben Sie es so konkret wie möglich. Wir bauen es ein und schicken Ihnen einen neuen Link.', inhalt: h('div', { class: 'a-flaeche dunkel' }, feld), knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => {
      if (feld.value.trim().length < 3) { feld.focus(); U.toast('Bitte kurz beschreiben, was wir ändern sollen.'); return; }
      try { const r = await U.api('POST', '/api/auftrag/' + a.id + '/freigabe', { aktion: 'aendern', text: feld.value }); zu(); ersetzen(r.auftrag); zeigen(r.auftrag); U.toast('Gesendet'); } catch (e) { U.toast(e.message); }
    });
  }
  function wechselAnfragen(a, n) {
    bestaetigen('Zu ' + P.PAKETE[n.paket].name + ' wechseln?', (n.einrichtung > 0 ? 'Fällig wird die Differenz der Einrichtung (' + U.euro(n.einrichtung) + ' netto)' : 'Eine weitere Einrichtungsgebühr fällt nicht an') + ', der neue Monatspreis (' + U.euro(P.preis(n.paket).monat) + ' netto) gilt ab dem Wechsel (Paketbedingungen § 7 Abs. 3). Wir melden uns und richten alles ein.', 'Wechsel anfragen', async () => {
      await U.api('POST', '/api/auftrag/' + a.id + '/wechsel', { paket: n.paket }); a.wechsel = { paket: n.paket, zeit: new Date().toISOString() }; zeigen(a, { stehen: true }); U.toast('Angefragt');
    });
  }
  function ersetzen(neu) { const l = S.ich.auftraege || []; const i = l.findIndex((x) => x.id === neu.id); if (i >= 0) l[i] = Object.assign(l[i], neu); }

  /* ========== Anfragen der Vermittlung (functions/api/vermittlung-partner.js) ========== */
  async function anfragenLaden() {
    if (!S.ich || !S.ich.angemeldet) { S.anfragen = null; return null; }
    try { S.anfragen = await U.api('GET', '/api/konto/anfragen'); } catch (e) { S.anfragen = null; }
    return S.anfragen;
  }
  const anfragenListe = () => (S.anfragen && S.anfragen.anfragen) || [];
  const betriebe = () => (S.anfragen && S.anfragen.betriebe) || [];
  const info = () => (S.anfragen ? { preis: S.anfragen.preis, fassung: S.anfragen.fassung, kasse: S.anfragen.kasse, erstesFrei: S.anfragen.erstesFrei } : null);
  function anfrageErsetzen(a) { if (!S.anfragen || !a) return; const l = S.anfragen.anfragen; const i = l.findIndex((x) => x.id === a.id); if (i >= 0) l[i] = a; else l.unshift(a); }
  function betriebErsetzen(b) { if (!S.anfragen || !b) return; const l = S.anfragen.betriebe; const i = l.findIndex((x) => x.id === b.id); if (i >= 0) l[i] = b; else l.push(b); }
  const pdfUrl = (a) => '/api/konto/anfragen/' + encodeURIComponent(a.id) + '/pdf';
  const preisText = (p) => (p && p.text) || '29 € zzgl. USt';
  /* Was gerade steht, noch einmal zeichnen (nach Register, Bereitschaft) */
  function neuZeichnen() {
    const v = S.ansicht || {};
    if (v.art === 'anfrage') { const a = anfragenListe().find((x) => x.id === v.id); if (a && info()) { anfrageZeigen(a, info(), { stehen: true }); return; } }
    if (v.art === 'uebersicht') { uebersicht({ stehen: true }); return; }
  }
  /* „Anfrage aus Herzebrock-Clarholz. 4 Fenster, in 1 bis 3 Monaten.“ */
  function anfrageTitel(a) {
    const e = a.echtheit || {}, start = (a.eckZeilen || []).find((z) => z[0] === 'Start'), teile = [];
    if (e.fenster) teile.push(e.fenster + ' Fenster');
    if (start && start[1]) teile.push(start[1].charAt(0).toLowerCase() + start[1].slice(1));
    return 'Anfrage aus ' + ohnePlz(a.ort) + '.' + (teile.length ? ' *' + teile.join(', ') + '.*' : '');
  }

  /* ---------- Zugang über den Link (#zugang/<token>): ohne Anmeldung die Vorschau, dann anmelden und annehmen ---------- */
  let zugangLauf = 0;
  async function zugang(token) {
    const lauf = ++zugangLauf;
    if (!S.ktx || S.ktx.token !== token) { kopf(); seite({ frage: U.frage('Ihre Anfrage *wird geladen …*', null), ladend: true }); }
    let r;
    try { r = await U.api('GET', '/api/anfrage/' + encodeURIComponent(token)); }
    catch (e) {
      if (lauf !== zugangLauf) return;
      S.ktx = null; kopf();
      seite({ frage: U.frage('Dieser Link *gilt nicht mehr.*', e.message), fuss: [U.pille(S.ich && S.ich.angemeldet ? 'Zur Übersicht' : 'Zur Anmeldung', { on: { click: () => { history.replaceState(null, '', location.pathname); route(); } } })] });
      return;
    }
    if (lauf !== zugangLauf) return;
    if (r.angemeldet && r.passt) {
      /* die Sitzung passt zur Adresse des Zugangs: annehmen und die Anfrage öffnen */
      try {
        const an = await U.api('POST', '/api/anfrage/' + encodeURIComponent(token) + '/annehmen', {});
        await anfragenLaden(); S.ktx = null;
        location.hash = '#anfrage/' + an.id;
        return;
      } catch (e) {
        if (e.status !== 403) U.toast(e.message);
        r.passt = false; r.mailVoll = ''; if (e.daten && e.daten.mail) r.mail = e.daten.mail;
      }
    }
    if (r.mailVoll) S.mail = r.mailVoll; else if (!S.mail) S.mail = '';
    S.ktx = { token: token, vorschau: r.vorschau, mail: r.mail, mailVoll: r.mailVoll || '', angemeldet: !!r.angemeldet, passt: !!r.passt, preis: r.preis, erstesFrei: !!r.erstesFrei };
    anmeldung();
  }

  /* ---------- Eine Anfrage (#anfrage/<id>) ---------- */
  let anfrageLauf = 0;
  async function anfrage(id) {
    const lauf = ++anfrageLauf, bekannt = anfragenListe().find((x) => x.id === id);
    if (bekannt && info()) anfrageZeigen(bekannt, info());
    else { kopf('#'); seite({ frage: U.frage('Anfrage *wird geladen …*', null), ladend: true }); }
    try {
      const r = await U.api('GET', '/api/konto/anfragen/' + encodeURIComponent(id));
      if (lauf !== anfrageLauf) return;
      if (!S.anfragen) S.anfragen = { betriebe: [], anfragen: [] };
      Object.assign(S.anfragen, { preis: r.preis, fassung: r.fassung, kasse: r.kasse, erstesFrei: r.erstesFrei });
      anfrageErsetzen(r.anfrage);
      if (!bekannt || JSON.stringify(bekannt) !== JSON.stringify(r.anfrage)) anfrageZeigen(r.anfrage, info(), { stehen: !!bekannt });
    } catch (e) {
      if (lauf !== anfrageLauf) return;
      U.toast(e.message); history.replaceState(null, '', location.pathname); uebersicht();
    }
  }
  /* Bühne: das Aufmaßblatt als Objekt; Frage; vor dem Freischalten Echtheit, Eckdaten und die Karte mit Preis und Häkchen, die Pille
     darunter; danach der Kontakt des Kunden, die Pille „Aufmaßblatt (PDF)“ und der Ring „Herunterladen“. Darunter die drei Kacheln. */
  function anfrageZeigen(a, inf, o) {
    o = o || {}; inf = inf || {};
    S.ansicht = { art: 'anfrage', id: a.id };
    kopf('#');
    const frei = a.stand === 'frei', p = inf.preis || {}, fuss = [], inhalt = [];
    let text;
    if (!frei) {
      text = 'Schalten Sie die Anfrage frei, dann sehen Sie Name und Telefonnummer des Kunden und bekommen das Aufmaßblatt als PDF. ' + (inf.erstesFrei ? 'Ihr erstes Aufmaß über eeziframes ist kostenlos.' : 'Dieses Aufmaß kostet ' + preisText(p) + (p.brutto ? ' (' + U.euro(p.brutto) + ' mit USt)' : '') + ', fällig jetzt beim Freischalten.');
      inhalt.push(echtheitKarte(a), eckdatenKarte(a), freischaltKarte(a, inf));
      const pille = U.pille(inf.erstesFrei ? 'Kostenlos freischalten' : 'Für ' + preisText(p) + ' freischalten', { on: { click: (e) => freischalten(a, inf, e.currentTarget) } });
      fuss.push(h('p', { class: 'a-hinweis a-grund', text: inf.erstesFrei ? 'Kostenlos, ohne weitere Verpflichtung' : 'Weiter zur Zahlung bei Stripe, mit Karte' }), pille);
    } else {
      const f = a.frei || {};
      text = 'Freigeschaltet am ' + U.datum(f.zeit) + (f.art === 'frei' ? ', kostenlos als Ihr erstes Aufmaß' : f.cent ? ', ' + U.euro(f.cent / 100) + ' zzgl. USt' : '') + '. Der Kunde weiß, dass Sie sein Aufmaß haben, und rechnet mit Ihrem Anruf.';
      inhalt.push(kontaktKarte(a), echtheitKarte(a), eckdatenKarte(a));
      if (a.pdf) fuss.push(U.pille('Aufmaßblatt (PDF)', { href: pdfUrl(a), target: '_blank', rel: 'noopener' }), U.ring('Herunterladen', { href: pdfUrl(a) + '?laden=1', download: 'Aufmassblatt-' + a.nr + '.pdf' }));
      else fuss.push(h('p', { class: 'a-hinweis a-grund offen', text: 'Das Aufmaßblatt dieser Anfrage gibt es nicht mehr.' }), U.pille('Zur Übersicht', { href: '#' }));
    }
    seite({ band: h('p', { class: 'a-band-text a-an-band' }, h('span', { text: a.nr + ' · Eingang ' + U.datum(a.eingang) }), a.echtheit && a.echtheit.gewaehlt ? U.chip('Vom Kunden gewählt', 'leise') : null),
      buehne: blattObjekt(a), buehneLabel: 'Das Aufmaßblatt', frage: U.frage(anfrageTitel(a), text), inhalt: inhalt, fuss: fuss, nach: dreiKacheln(inf), aktionUnten: true, stehen: o.stehen });
  }
  /* Das Aufmaßblatt als Papier auf der Bühne (G4): Nummer, wer, die Zahl der Fenster als Held (G3), die Positionen schraffiert, solange
     nicht freigeschaltet (G1), das Schloss als schwarze Kapsel; frei: der Name des Kunden und der runde Knopf zum PDF auf der Kante (G13) */
  function blattObjekt(a, o) {
    o = o || {};
    const frei = a.stand === 'frei' && !o.gesperrt, e = a.echtheit || {}, k = a.kunde || {};
    const n = Math.max(3, Math.min(7, Number(e.elemente || e.fenster) || 3));
    const zeilen = a.eckZeilen || [], z = (t) => { const x = zeilen.find((y) => y[0] === t); return x ? x[1] : ''; };
    const meta = [e.elemente ? e.elemente + ' Element' + (e.elemente === 1 ? '' : 'e') : '', z('Gebäude'), z('Baujahr') ? 'Baujahr ' + z('Baujahr') : ''].filter(Boolean).join(' · ');
    const papier = h('div', { class: 'a-an-papier' + (frei ? ' frei' : '') },
      h('div', { class: 'a-an-papier-kopf' }, h('span', { text: 'Aufmaßblatt' }), h('span', { text: a.nr })),
      h('b', { class: 'a-an-papier-wer', text: frei && k.name ? k.name : 'Hauseigentümer aus ' + ohnePlz(a.ort) }),
      e.fenster ? h('div', { class: 'a-an-papier-zahl' }, h('b', null, String(e.fenster), h('small', { text: 'Fenster' })), meta ? h('span', { text: meta }) : null) : h('div', { class: 'a-an-papier-zahl' }, h('span', { text: meta || a.ort })),
      h('ol', { class: 'a-an-positionen' + (frei ? ' offen' : ''), 'aria-hidden': 'true' }, Array.from({ length: n }, () => h('li', null, h('i'), h('i')))),
      frei ? null : h('span', { class: 'a-an-schloss' }, U.icon('schloss'), 'Kontakt und PDF nach dem Freischalten'),
      frei && a.pdf ? U.rund('pfeil', 'Aufmaßblatt als PDF öffnen', { class: 'voll gross a-an-papier-knopf', href: pdfUrl(a), target: '_blank', rel: 'noopener' }) : null);
    return h('div', { class: 'a-an-buehne' }, papier,
      h('div', { class: 'a-buehne-zeile' }, h('span', { text: 'Eingang ' + U.datum(a.eingang) }), U.chip(frei ? 'Freigeschaltet' : 'Zum Freischalten', frei ? 'aktiv' : 'leise')));
  }
  /* Website ohne Schema und Schrägstrich am Ende, wie man sie liest */
  const webText = (w) => String(w || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const betriebMeta = (b) => [[b.plz, b.ort].filter(Boolean).join(' '), b.strasse, b.tel, webText(b.web)].filter(Boolean).join(' · ');
  const chipMit = (zeichen, text, art) => h('span', { class: 'a-chip' + (art ? ' ' + art : '') }, zeichen ? U.icon(zeichen) : null, text);
  function echtheitKarte(a) {
    const e = a.echtheit || {}, n = e.anBetriebe || 0;
    const chips = [e.nummer ? chipMit('haken', 'Telefonnummer per Code bestätigt') : chipMit(null, 'Telefonnummer nicht bestätigt', 'hinweis'),
      e.einwilligung ? chipMit('haken', 'Einwilligung des Kunden') : null,
      chipMit(null, n <= 1 ? 'Ging nur an Sie' : 'Ging an ' + n + ' Betriebe', 'leise'), e.gewaehlt ? chipMit(null, 'Vom Kunden gewählt', 'leise') : null];
    return U.karte('Echtheit', null, [h('div', { class: 'a-an-chips' }, chips),
      h('p', { class: 'a-an-karte-text', text: 'Die Telefonnummer prüfen wir in jedem Fall mit einem Code beim Kunden; Name, Ort und Eckdaten gibt er selbst an. Hinter jeder Anfrage steht ein echter Mensch.' })]);
  }
  function eckdatenKarte(a) {
    const zeilen = (a.eckZeilen || []).slice(); zeilen.push(['Ort', a.ort], ['Eingang', U.zeit(a.eingang)]);
    return U.karte('Eckdaten', a.nr, h('dl', { class: 'a-kv' }, zeilen.map((x) => [h('dt', { text: x[0] }), h('dd', { text: x[1] })])));
  }
  /* Preis als Zahl, das Pflicht-Häkchen zu den Partnerbedingungen; die Pille steht darunter im Fuß */
  function freischaltKarte(a, inf) {
    const p = inf.preis || {}, frei = !!inf.erstesFrei;
    const preis = h('div', { class: 'a-an-preis' }, h('b', null, frei ? '0' : String(p.netto != null ? p.netto : 29), h('small', { text: frei ? '€ · Ihr erstes Aufmaß' : '€ zzgl. USt' })),
      h('span', { text: frei ? 'Kostenlos, als erstes Aufmaß über eeziframes. Jedes weitere ' + preisText(p) + ', erst fällig beim Freischalten.' : (p.brutto ? U.euro(p.brutto) + ' mit USt, ' : '') + 'Zahlung per Karte bei Stripe, die Rechnung kommt per E-Mail. Danach sind Kontakt und Aufmaßblatt sofort offen.' }));
    const haken = U.haken({ k: 'zustimmung', text: ['Ich akzeptiere die ', PARTNER_LINK(), ' (erstes Aufmaß kostenlos, danach ' + preisText(p) + ' je freigeschaltetem Aufmaß).'], onChange: (an) => grundSetzen(an ? null : 'Bitte die Partnerbedingungen bestätigen', !an) });
    return U.karte('Freischalten', frei ? 'Ihr erstes Aufmaß' : 'Je freigeschaltetem Aufmaß', [preis, haken, h('p', { class: 'a-hilfe', text: 'Sie sehen dann Name und Telefonnummer des Kunden und bekommen das Aufmaßblatt als PDF.' })], { class: 'a-karte a-an-freischalten' });
  }
  function grundSetzen(text, offen) {
    const g = wurzel.querySelector('.a-fuss .a-grund'); if (!g) return;
    if (text) g.textContent = text; else g.textContent = g.dataset.ruhig || g.textContent;
    if (!g.dataset.ruhig && !offen) g.dataset.ruhig = g.textContent;
    g.classList.toggle('offen', !!offen);
  }
  async function freischalten(a, inf, knopf) {
    if (U.wartet(knopf)) return;
    const hk = wurzel.querySelector('[data-k="zustimmung"]');
    if (!(hk && hk.eingabe && hk.eingabe.checked)) { U.fehlerZeigen(wurzel, { zustimmung: 'Bitte bestätigen Sie die Partnerbedingungen.' }); grundSetzen('Bitte die Partnerbedingungen bestätigen', true); U.zuFeld(hk); return; }
    U.warten(knopf, true);
    try {
      const r = await U.api('POST', '/api/konto/anfragen/' + encodeURIComponent(a.id) + '/freischalten', { zustimmung: true });
      if (r.kasse) { location.href = r.kasse; return; }
      anfrageErsetzen(r.anfrage); if (S.anfragen) S.anfragen.erstesFrei = false;
      anfrageZeigen(r.anfrage, Object.assign({}, inf, { erstesFrei: false }));
      U.toast(r.schon ? 'Diese Anfrage war schon freigeschaltet.' : 'Freigeschaltet. Kontakt und Aufmaßblatt sind offen.');
    } catch (e) {
      U.warten(knopf, false);
      if (e.daten && e.daten.feld === 'zustimmung') { U.fehlerZeigen(wurzel, { zustimmung: e.message }); grundSetzen(e.message, true); U.zuFeld(hk); return; }
      U.toast(e.message);
    }
  }
  /* Nach dem Freischalten: Name, Telefon groß als tel:-Link (a-anruf aus auftrag.css), E-Mail, erreichbar, Ort; Zweckbindung und Löschdatum */
  function kontaktKarte(a) {
    const k = a.kunde || {}, f = a.frei || {};
    const tel = String(k.tel || '').replace(/[^\d+]/g, '');
    const zeilen = [k.mail ? ['E-Mail', h('a', { href: 'mailto:' + k.mail, text: k.mail })] : null, k.erreich ? ['Erreichbar', k.erreich] : null, ['Ort', k.ort || a.ort]].filter(Boolean);
    return U.karte('Kontakt des Kunden', f.zeit ? 'Freigeschaltet am ' + U.datum(f.zeit) : null, [h('b', { class: 'a-an-name', text: k.name || 'Ohne Namen' }),
      tel ? h('a', { class: 'a-anruf', href: 'tel:' + tel }, h('i', null, U.icon('telefon')), h('span', null, h('b', { text: k.anzeige || k.tel }), h('small', { text: (a.echtheit && a.echtheit.nummer ? 'Per Code bestätigt' : 'Nicht bestätigt') + (k.erreich ? ' · am besten ' + k.erreich.toLowerCase() : '') }))) : null,
      h('dl', { class: 'a-kv' }, zeilen.map((x) => [h('dt', { text: x[0] }), h('dd', null, x[1])])),
      h('p', { class: 'a-an-zweck' }, h('b', { text: 'Nur für diese Anfrage.' }), ' Der Kunde hat eingewilligt, dass wir seine Angaben für diese Anfrage an Sie weitergeben. Bitte nutzen Sie sie nur dafür, nicht für Werbung und nicht für Dritte.',
        a.einwilligung ? [' Sein Wortlaut: ', h('q', { text: a.einwilligung })] : null, a.loeschenAm ? ' Wir löschen die Anfrage am ' + U.datum(a.loeschenAm) + '.' : '')], { class: 'a-karte a-an-kontakt' });
  }

  /* ---------- Die drei Kacheln: Register und Bereitschaft, Echtheit, Konfigurator für die eigene Website ---------- */
  /* Unter der Anfrage: der eigene Betrieb mit der Bereitschaft (Partner) und das Angebot der Pakete. Die Echtheit steht schon als weiße
     Karte in der Anfrage, deshalb hier nicht noch einmal (Doppelung, 30.10.2026). */
  function dreiKacheln(inf) {
    return h('div', { class: 'a-an-drei' }, registerKachel(inf), konfiguratorKachel());
  }
  function registerKachel(inf) {
    const b = betriebe()[0] || null, p = (inf || {}).preis || (S.anfragen || {}).preis || {};
    const teile = [h('div', { class: 'a-karte-kopf' }, h('h2', { text: b ? b.name : 'Register und Bereitschaft' }), b ? U.chip(b.standText || b.stand, b.stand === 'partner' ? 'aktiv' : 'leise') : null),
      h('p', { text: 'Partner stehen bei Kunden in ihrer Umgebung auf Platz 1 und 2 und bekommen neue Anfragen direkt hier.' }),
      h('p', { text: 'Das erste Aufmaß ist kostenlos, jedes weitere ' + preisText(p) + ', erst fällig beim Freischalten.' })];
    if (b) teile.push(h('p', { class: 'a-an-meta', text: betriebMeta(b) }), (b.leistungen || []).length ? h('p', { class: 'a-an-meta', text: b.leistungen.join(', ') }) : null);
    teile.push(schalter(b), h('div', { class: 'a-knoepfe' }, U.ring(b ? 'Angaben ändern' : 'Als Betrieb eintragen', { on: { click: () => betriebBearbeiten(b) } })));
    return U.kachel(teile, 'a-an-kachel a-an-register');
  }
  function konfiguratorKachel() {
    return U.kachel([h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Konfigurator für Ihre Website' })),
      h('p', { text: 'Anfragen in dieser Qualität auch von Ihrer eigenen Website: Ihre Kunden planen zu Hause, Sie bekommen jede Anfrage mit Aufmaßblatt. Pakete ab ' + U.euro(minMonat()) + ' im Monat.' }),
      h('div', { class: 'a-knoepfe' }, U.ring('Pakete ansehen', { href: '/fuer-fensterbauer/#pakete' }))], 'a-an-kachel');
  }
  /* Der Betrieb als kleine Karte in der Übersicht */
  function betriebKarte(b) {
    if (!b) return U.karte('Ihr Betrieb', 'Noch nicht eingetragen', [h('p', { class: 'a-an-karte-text', text: 'Im Register stehen Sie bei Kunden in Ihrer Umgebung; als Partner auf Platz 1 und 2, neue Anfragen kommen direkt hierher.' }),
      h('div', { class: 'a-knoepfe', style: 'padding:0 0 16px' }, U.ring('Als Betrieb eintragen', { class: 'klein', on: { click: () => betriebBearbeiten(null) } }))]);
    return U.karte(b.name, U.chip(b.standText || b.stand, b.stand === 'partner' ? 'aktiv' : 'leise'), [h('p', { class: 'a-an-karte-text', text: [betriebMeta(b), (b.leistungen || []).join(', ')].filter(Boolean).join(' · ') }),
      schalter(b), h('div', { class: 'a-knoepfe', style: 'padding:8px 0 16px' }, U.ring('Angaben ändern', { class: 'klein', on: { click: () => betriebBearbeiten(b) } }))]);
  }
  /* Schalter „Bereitschaft erklären“: an öffnet das Blatt mit dem Pflicht-Häkchen, aus die Rückfrage; ohne Betrieb zuerst das Eintragen */
  function schalter(b) {
    const an = !!(b && b.partner && b.partner.bereit);
    const s = h('button', { type: 'button', class: 'a-an-schalter', role: 'switch', 'aria-checked': String(an) }, h('i', { 'aria-hidden': 'true' }),
      h('span', null, h('b', { text: 'Bereitschaft erklären' }), h('small', { text: an ? 'Ich möchte Anfragen aus meiner Umgebung erhalten · Partner seit ' + U.datum(b.partner.seit) : b ? 'Ich möchte Anfragen aus meiner Umgebung erhalten' : 'Zuerst den Betrieb eintragen, dann Anfragen aus der Umgebung erhalten' })));
    s.addEventListener('click', () => { if (!b) betriebBearbeiten(null); else if (an) partnerZurueck(b); else partnerErklaeren(b); });
    return s;
  }
  function partnerErklaeren(b) {
    const p = (S.anfragen || {}).preis || {};
    const haken = U.haken({ k: 'zustimmung', text: ['Ich akzeptiere die ', PARTNER_LINK(), ' (erstes Aufmaß kostenlos, danach ' + preisText(p) + ' je freigeschaltetem Aufmaß).'] });
    const karte = h('div', { class: 'a-karte a-an-blatt-haken' }, haken);
    const ja = U.pille('Bereitschaft erklären'), nein = U.ring('Abbrechen');
    const zu = U.blatt({ titel: 'Bereitschaft erklären?', text: 'Partner stehen bei Kunden in ihrer Umgebung auf Platz 1 und 2 und bekommen neue Anfragen direkt hier. Das erste Aufmaß ist kostenlos, jedes weitere ' + preisText(p) + ', erst fällig beim Freischalten. Zurücknehmen können Sie die Bereitschaft jederzeit.', inhalt: karte, knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => {
      if (U.wartet(ja)) return;
      if (!haken[0].eingabe.checked) { U.fehlerZeigen(karte, { zustimmung: 'Bitte bestätigen Sie die Partnerbedingungen.' }); return; }
      U.warten(ja, true);
      try { const r = await U.api('POST', '/api/konto/partner', { betrieb: b.id, bereit: true, zustimmung: true }); betriebErsetzen(r.betrieb); zu(); neuZeichnen(); U.toast('Bereitschaft erklärt. Sie stehen jetzt vorn.'); }
      catch (e) { U.warten(ja, false); if (e.daten && e.daten.feld === 'zustimmung') U.fehlerZeigen(karte, { zustimmung: e.message }); else if (e.daten && e.daten.feld === 'plz') { zu(); betriebBearbeiten(b, e.message); } else U.toast(e.message); }
    });
  }
  function partnerZurueck(b) {
    bestaetigen('Bereitschaft zurücknehmen?', 'Sie stehen dann nicht mehr auf Platz 1 und 2 und bekommen keine neuen Anfragen aus Ihrer Umgebung. Offene und freigeschaltete Anfragen bleiben in Ihrem Bereich.', 'Zurücknehmen', async () => {
      const r = await U.api('POST', '/api/konto/partner', { betrieb: b.id, bereit: false }); betriebErsetzen(r.betrieb); neuZeichnen(); U.toast('Bereitschaft zurückgenommen');
    });
  }
  /* Eintragen oder Ändern des eigenen Betriebs: Name, Ort, PLZ, Straße, Telefon, Website, Leistungen als Kapseln */
  function betriebBearbeiten(b, hinweis) {
    b = b || {};
    const gewaehlt = new Set(b.leistungen || []);
    const felder = [U.feld({ k: 'name', label: 'Name des Betriebs', wert: b.name, platzhalter: 'Fensterbau Brandt', auto: 'organization' }),
      h('div', { class: 'a-zwei', style: 'display:grid' }, U.feld({ k: 'plz', label: 'Postleitzahl', wert: b.plz, platzhalter: '33442', modus: 'numeric', max: 5, auto: 'postal-code' }), U.feld({ k: 'ort', label: 'Ort', wert: b.ort, platzhalter: 'Herzebrock-Clarholz', auto: 'address-level2' })),
      U.feld({ k: 'strasse', label: 'Straße und Hausnummer', wert: b.strasse, platzhalter: 'Gartenstraße 12', optional: true, auto: 'street-address' }),
      U.feld({ k: 'tel', label: 'Telefon', typ: 'tel', wert: b.tel, platzhalter: '05245 123456', optional: true, auto: 'tel' }),
      U.feld({ k: 'web', label: 'Website', typ: 'url', wert: b.web, platzhalter: 'www.fensterbau-brandt.de', optional: true, auto: 'url' })];
    const wahl = h('div', { class: 'a-wahl', role: 'group', 'aria-label': 'Leistungen' }, LEISTUNGEN.map((l) => { const k = h('button', { type: 'button', 'aria-pressed': String(gewaehlt.has(l)), text: l }); k.addEventListener('click', () => { const an = !gewaehlt.has(l); if (an) gewaehlt.add(l); else gewaehlt.delete(l); k.setAttribute('aria-pressed', String(an)); }); return k; }));
    const karte = h('div', { class: 'a-karte a-an-formular' }, felder, h('p', { class: 'a-label', text: 'Leistungen' }), wahl);
    const ja = U.pille(b.id ? 'Speichern' : 'Eintragen'), nein = U.ring('Abbrechen');
    const senden = async () => {
      if (U.wartet(ja)) return;
      const w = (k) => karte.querySelector('[data-k="' + k + '"] input').value.trim();
      const daten = { name: w('name'), ort: w('ort'), plz: w('plz'), strasse: w('strasse'), tel: w('tel'), web: w('web'), leistungen: LEISTUNGEN.filter((l) => gewaehlt.has(l)) };
      if (b.id) daten.betrieb = b.id;
      U.fehlerZeigen(karte, {});
      U.warten(ja, true);
      try { const r = await U.api('POST', '/api/konto/betrieb', daten); betriebErsetzen(r.betrieb); zu(); neuZeichnen(); U.toast(b.id ? 'Gespeichert' : 'Eingetragen. Jetzt können Sie Ihre Bereitschaft erklären.'); }
      catch (e) {
        U.warten(ja, false);
        const f = (e.daten && e.daten.felder) || (e.daten && e.daten.feld ? { [e.daten.feld]: e.message } : null);
        if (f) { const erstes = U.fehlerZeigen(karte, f); if (erstes) U.zuFeld(erstes); } else U.toast(e.message);
      }
    };
    const zu = U.blatt({ titel: b.id ? 'Angaben zum Betrieb' : 'Als Betrieb eintragen', text: hinweis || (b.id ? null : 'Mit dem Eintrag stehen Sie im Register von eeziframes: Kunden in Ihrer Umgebung sehen Ihren Betrieb, als Partner auf Platz 1 und 2.'),
      inhalt: h('form', { novalidate: true, on: { submit: (e) => { e.preventDefault(); senden(); } } }, karte, h('button', { type: 'submit', hidden: true, tabindex: '-1', 'aria-hidden': 'true' })), knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', senden);
  }

  /* ---------- Weiche ---------- */
  function route() {
    const z = /^#zugang\/([A-Za-z0-9_.-]{20,600})$/.exec(location.hash);
    if (z) { zugang(z[1]); return; }
    S.ktx = null;
    if (!S.ich || !S.ich.angemeldet) { anmeldung(); return; }
    const an = /^#anfrage\/([0-9a-z-]{8,})$/i.exec(location.hash);
    if (an) { anfrage(an[1]); return; }
    const m = /^#auftrag\/([0-9a-z-]{8,})(?:\/(gespeichert))?$/i.exec(location.hash);
    const l = S.ich.auftraege || [];
    if (m) {
      const a = l.find((x) => x.id === m[1]);
      if (a) { zeigen(a); if (m[2]) { history.replaceState(null, '', '#auftrag/' + a.id); U.toast('Gespeichert'); } return; }
      history.replaceState(null, '', location.pathname);
    }
    /* ein Auftrag und keine Anfragen: gleich öffnen */
    if (l.length === 1 && !anfragenListe().length && !location.hash) { history.replaceState(null, '', '#auftrag/' + l[0].id); zeigen(l[0]); return; }
    uebersicht();
  }
  addEventListener('hashchange', () => { if (S.ich) route(); });

  async function start() {
    const q = new URLSearchParams(location.search), session = q.get('kasse');
    const [stand, ich] = await Promise.all([U.api('GET', '/api/auftrag/stand').catch(() => null), U.api('GET', '/api/auftrag/ich').catch(() => ({ angemeldet: false }))]);
    S.stand = stand; S.ich = ich;
    if (ich.angemeldet) await anfragenLaden();
    if (session && ich.angemeldet) {
      const mA = /^#anfrage\/([0-9a-z-]{8,})/i.exec(location.hash), m = /^#auftrag\/([0-9a-z-]{8,})/i.exec(location.hash);
      history.replaceState(null, '', location.pathname + location.hash);
      if (mA) {
        /* Rückkehr aus der Kasse eines Aufmaßes: Zahlung prüfen, die Anfrage ist dann freigeschaltet */
        try {
          const r = await U.api('GET', '/api/konto/anfragen/' + encodeURIComponent(mA[1]) + '/kasse?session=' + encodeURIComponent(session));
          if (!S.anfragen) S.anfragen = { betriebe: [], anfragen: [] };
          anfrageErsetzen(r.anfrage); if (r.bezahlt) S.anfragen.erstesFrei = false;
          U.toast(r.bezahlt ? 'Danke, Ihre Zahlung ist da. Die Anfrage ist freigeschaltet.' : 'Die Zahlung ist noch nicht abgeschlossen.');
        } catch (e) { U.toast(e.message); }
      } else if (m) {
        try {
          const r = await U.api('GET', '/api/auftrag/' + m[1] + '/kasse?session=' + encodeURIComponent(session));
          ersetzen(r.auftrag);
          U.toast(r.bezahlt ? 'Danke, Ihre Zahlung ist da.' : r.laeuft ? 'Danke, Ihre Lastschrift ist unterwegs.' : 'Die Zahlung ist noch nicht abgeschlossen.');
        } catch (e) { U.toast(e.message); }
      }
    }
    route();
  }
  start();
})();

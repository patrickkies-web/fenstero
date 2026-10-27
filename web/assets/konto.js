/* eeziframes · Kundenbereich der Fensterbauer (/konto/): Anmeldung per Code, Übersicht der Aufträge, ein Auftrag mit Stand, Vorschau,
   Freigabe, Nachrichten, Angaben (Ändern über die Stationen der Bestellung, /bestellen/#<paket>/<id>/<station>), Paket und Wechsel,
   Zahlung und Rechnungen (Kundenportal von Stripe), Verlauf, Storno bis Arbeitsbeginn (Paketbedingungen § 7 Abs. 2).
   Adresse: #auftrag/<id>; Rückkehr aus der Kasse: /konto/?kasse=<session>#auftrag/<id>. Rahmen wie die Bestellung (auftrag.css). */
(function () {
  'use strict';
  const U = window.AuftragUI, A = window.Auftrag, P = window.Pakete, h = U.h;
  const wurzel = document.getElementById('app');
  const S = { ich: null, stand: null, mail: '', codeGeschickt: false, auftrag: null, nachrichten: null, start: true };
  const kurz = U.kurzname;
  const vorZahlung = (a) => ['entwurf', 'angefragt'].indexOf(a.stand) >= 0;
  const zuEnde = (a) => ['beendet', 'storniert'].indexOf(a.stand) >= 0;

  /* ---------- Gerüst ---------- */
  function kopf(zurueck) {
    const rechts = [];
    if (S.ich && S.ich.angemeldet) { rechts.push(h('span', { class: 'a-wer', text: S.ich.mail })); rechts.push(U.ring('Abmelden', { class: 'klein', on: { click: abmelden } })); }
    const k = U.kopf({ zurueck: zurueck || '/fuer-fensterbauer/', zurueckLabel: zurueck ? 'Zur Übersicht' : 'Zur Seite für Fensterbauer', zusatz: 'Kundenbereich', rechts: rechts });
    k.id = 'kopf';
    const alt = document.getElementById('kopf'); if (alt) alt.replaceWith(k);
  }
  function seite(o) {
    U.leeren(wurzel);
    const main = h('main', { class: 'a-raster aktion-oben ' + (o.buehne ? 'zwei' : 'eins'), id: 'inhalt' },
      h('div', { class: 'a-r-band' }, o.band || null), h('aside', { class: 'a-r-buehne', 'aria-label': 'Ihre Seite' }, o.buehne || null),
      h('div', { class: 'a-r-frage' }, o.frage), h('div', { class: 'a-r-inhalt' }, o.inhalt || null), o.fuss ? h('div', { class: 'a-r-fuss a-fuss' }, o.fuss) : null);
    wurzel.appendChild(main);
    wurzel.appendChild(h('p', { class: 'a-recht' }, h('a', { href: '/impressum/', text: 'Impressum' }), h('a', { href: '/datenschutz/', text: 'Datenschutz' }), h('a', { href: '/konfigurator-bedingungen/', text: 'Paketbedingungen' })));
    if (!o.stehen) { window.scrollTo(0, 0); if (!S.start) { const t = main.querySelector('h1'); if (t) t.focus({ preventScroll: true }); } }
    S.start = false;
  }

  /* ---------- Anmeldung ---------- */
  function anmeldung() {
    kopf();
    const mail = U.feld({ k: 'mail', label: 'Ihre E-Mail-Adresse', typ: 'email', auto: 'email', wert: S.mail, platzhalter: 'name@ihr-betrieb.de', onInput: (v) => { S.mail = v.trim(); } });
    const teile = [mail]; let code = null;
    if (S.codeGeschickt) {
      mail.eingabe.readOnly = true;
      code = U.feld({ k: 'code', label: 'Code aus der E-Mail', modus: 'numeric', auto: 'one-time-code', max: 7, platzhalter: '123 456', hilfe: 'Wir haben den Code an ' + S.mail + ' geschickt. Er gilt 15 Minuten.' });
      teile.push(code, h('div', { class: 'a-knoepfe', style: 'padding:4px 0 14px' }, U.ring('Neuen Code schicken', { class: 'klein', on: { click: (e) => codeSchicken(e.currentTarget) } }), U.ring('Andere Adresse', { class: 'klein', on: { click: () => { S.codeGeschickt = false; anmeldung(); } } })));
    }
    const knopf = U.pille(S.codeGeschickt ? 'Anmelden' : 'Code schicken', { on: { click: () => weiter() } });
    const weiter = () => { if (U.wartet(knopf)) return; if (S.codeGeschickt) anmelden(knopf); else codeSchicken(knopf); };
    seite({ frage: U.frage('Ihr Kundenbereich. *Anmelden mit Code.*', 'Geben Sie die E-Mail-Adresse ein, mit der Sie bestellt haben. Wir schicken Ihnen einen Code, ein Passwort brauchen Sie nicht.'),
      inhalt: [U.karte(null, null, h('form', { novalidate: true, on: { submit: (e) => { e.preventDefault(); weiter(); } } }, teile, h('button', { type: 'submit', hidden: true, tabindex: '-1', 'aria-hidden': 'true' }))),
        h('p', { class: 'a-fusszeile' }, U.aenderbar('Noch kein Konto? Es entsteht mit Ihrer ersten Bestellung.'), ' ', h('a', { class: 'a-link', href: '/bestellen/', text: 'Zur Bestellung' }))],
      fuss: [knopf], stehen: !!S.codeGeschickt });
    setTimeout(() => { const e = (code || mail).eingabe; if (e && S.codeGeschickt) e.focus({ preventScroll: true }); }, 30);
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
    try { await U.api('POST', '/api/auftrag/anmelden', { mail: S.mail, code: code }); S.ich = await U.api('GET', '/api/auftrag/ich'); route(); }
    catch (e) { U.warten(knopf, false); if (e.daten && e.daten.neu) { S.codeGeschickt = false; anmeldung(); U.toast(e.message); return; } U.fehlerSetzen(f, e.message); }
  }
  async function abmelden() { await U.api('POST', '/api/auftrag/abmelden', {}).catch(() => null); S.ich = { angemeldet: false }; S.codeGeschickt = false; location.hash = ''; anmeldung(); }

  /* ---------- Übersicht ---------- */
  function uebersicht() {
    kopf();
    const l = S.ich.auftraege || [];
    if (!l.length) {
      seite({ frage: U.frage('Noch keine Bestellung. *Welches Paket passt zu Ihnen?*', 'Ihre Landingpage mit Konfigurator: Paket wählen, Angaben machen, bestellen.'), fuss: [U.pille('Paket wählen', { href: '/bestellen/' })] });
      return;
    }
    const inhalt = l.map((a) => {
      const b = (a.angaben || {}).betrieb || {};
      return U.kachel([h('div', { class: 'a-karte-kopf' }, h('h2', { text: b.name || b.firma || 'Ohne Namen' }), U.chip(A.STAND_TITEL[a.stand], a.stand === 'live' ? 'aktiv' : 'leise')),
        h('p', { text: a.paketName + ' · ' + (a.adresse || 'Adresse folgt') + ' · ' + a.nr }),
        vorZahlung(a) || zuEnde(a) ? null : h('div', { style: 'margin-top:16px' }, U.leiste(a)),
        h('div', { class: 'a-knoepfe', style: 'margin-top:16px' }, U.ring(a.ungelesen ? 'Öffnen · ' + a.ungelesen + ' neue Nachricht' + (a.ungelesen > 1 ? 'en' : '') : 'Öffnen', { href: '#auftrag/' + a.id }))], 'a-auftrag-kachel');
    });
    seite({ frage: U.frage('Ihre Aufträge', null), inhalt: inhalt, fuss: [U.pille('Neue Bestellung', { href: '/bestellen/' })] });
  }

  /* ---------- Ein Auftrag ---------- */
  const dateiUrl = (a, d) => (d && /^image\/(png|jpeg|webp|svg\+xml)$/.test(d.typ) ? '/api/auftrag/' + a.id + '/datei/' + d.id : '');
  const datei = (a, platz) => (a.dateien || []).filter((d) => d.platz === platz).pop() || null;
  function buehne(a) {
    const v = U.vorschau(), g = a.angaben || {}, b = g.betrieb || {}, t = g.auftritt || {};
    v.setzen({ paket: a.paket, adresse: a.adresse, name: b.name || b.firma, ort: b.ort, region: b.region, ap: b.ap, rolle: b.rolle, ueberschrift: t.ueberschrift, einleitung: t.einleitung, einladung: t.einladung,
      farbe: A.farbe((t.farben || [])[0]), logo: dateiUrl(a, datei(a, 'logo')), portrait: dateiUrl(a, datei(a, 'portrait')), buehne: dateiUrl(a, datei(a, 'buehne')) });
    return h('div', { class: 'a-buehne' }, h('div', { class: 'a-buehne-in' }, v.el, h('div', { class: 'a-buehne-zeile' }, h('span', null, h('b', { style: 'color:var(--weiss);font-weight:500', text: kurz(a.paket) }), ' · ' + a.nr), U.chip(A.STAND_TITEL[a.stand], a.stand === 'live' ? 'aktiv' : 'leise'))));
  }
  function offeneStation(a) {
    const m = P.merkmale(a.paket) || {};
    if (A.pruefen(a.angaben, m).ok) return 'bestellen';
    return A.offen(a.angaben, m) || (A.gestaltet(m) ? 'auftritt' : 'bestellen');
  }
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
      case 'bezahlt':
        return { t: 'Danke. *Wir beginnen mit Ihrer Seite.*', p: 'Wir rufen Sie ' + (b.rueckruf ? '„' + b.rueckruf + '“' : 'zu Ihrer Wunschzeit') + ' an und sichern Ihre Adresse. Bis wir beginnen, können Sie kostenlos stornieren.' };
      case 'in_arbeit':
        return v.aenderung ? { t: 'Wir arbeiten *Ihre Änderungen ein.*', p: 'Danach bekommen Sie einen neuen Link zur Vorschau.' } : { t: 'Wir bauen *Ihre Seite.*', p: 'Sobald es eine Vorschau gibt, schicken wir Ihnen den Link per E-Mail. Fotos und Texte können Sie bis dahin unten ergänzen.' };
      case 'vorschau':
        if (v.freigabe) return { t: 'Freigegeben. *Wir schalten Ihre Seite live.*', p: 'Danke für Ihre Freigabe. Sobald die Seite online ist, bekommen Sie eine E-Mail.' };
        return { t: 'Ihre Vorschau *ist fertig.*', p: 'Sehen Sie sich Ihre Seite in Ruhe an. Passt alles, geben Sie sie frei; sonst schreiben Sie uns, was wir ändern sollen.', pille: U.pille('Freigeben', { on: { click: (e) => freigeben(a, e.currentTarget) } }) };
      case 'live':
        return { t: 'Ihre Seite *ist live.*', p: 'Ihre Kunden planen jetzt unter ' + (a.adresse || 'Ihrer Adresse') + '. Jede Anfrage kommt als Aufmaßblatt-PDF per E-Mail.', pille: v.live ? U.pille('Seite öffnen', { href: v.live, target: '_blank', rel: 'noopener' }) : null };
      case 'pausiert': return { t: 'Ihre Seite *ist pausiert.*', p: 'Ihre Kunden sehen in dieser Zeit Ihre Kontaktdaten. Schreiben Sie uns, wenn Sie Fragen haben.' };
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

    if (a.stand === 'vorschau' && !v.freigabe) inhalt.push(U.kachel([h('h2', { text: 'Ihre Vorschau' }), h('p', { text: 'Der Link zeigt Ihre Seite genau so, wie sie online gehen soll.' }),
      h('div', { class: 'a-knoepfe', style: 'margin-top:16px' }, v.link ? U.ring(['Vorschau öffnen ', U.icon('aussen')], { href: v.link, target: '_blank', rel: 'noopener' }) : null, U.ring('Änderungen wünschen', { on: { click: () => aendernWuenschen(a) } }))], 'leucht'));
    if (a.stand === 'live' && v.live) inhalt.push(knopfKarte(a));
    if (!zuEnde(a)) inhalt.push(angabenKarte(a));
    inhalt.push(paketKachel(a));
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
    const zeile = (titel, text, station) => h('div', { class: 'a-offen-zeile' }, h('span', null, h('b', { text: titel }), h('br'), h('span', { style: 'color:var(--textgrau)', text: text || '–' })),
      U.ring('Ändern', { class: 'klein', href: '/bestellen/#' + a.paket + '/' + a.id + '/' + station, 'aria-label': titel + ' ändern' }));
    const fotos = A.FOTO_PLAETZE.filter((f) => datei(a, f.k)).length;
    const zeilen = [zeile('Ihr Betrieb', [b.name || b.firma, b.ort, b.ap].filter(Boolean).join(' · '), 'betrieb'),
      zeile('Adresse und Anfragen', [a.adresse || (ad.vorschlaege ? 'Vorschläge von uns' : ''), (ad.eingang || []).filter(Boolean).join(', ')].filter(Boolean).join(' · '), 'adresse')];
    if (A.gestaltet(m)) zeilen.push(zeile('Auftritt', [datei(a, 'logo') ? 'Logo da' : 'Logo fehlt', fotos + ' von 6 Fotos', (t.farben || []).some(A.farbe) ? 'Farben da' : (t.farbenWebsite ? 'Farben von der Website' : 'Farben folgen'), t.ueberschrift ? 'Texte da' : 'Texte schreiben wir'].join(' · '), 'auftritt'));
    return U.karte('Ihre Angaben', a.geaendert ? 'Geändert am ' + U.datum(a.geaendert) : null, [h('div', { class: 'a-offen' }, zeilen),
      vorZahlung(a) ? null : h('p', { class: 'a-hilfe', style: 'padding:0 0 14px', text: 'Jede Änderung sehen wir sofort; wir melden uns, sobald sie auf Ihrer Seite ist.' })]);
  }

  /* Paket: was frei ist, was mit dem nächsten Paket dazukommt, Wechsel anfragen */
  function paketKachel(a) {
    const pr = a.preise || P.preis(a.paket), n = A.naechstes(a.paket), w = a.wechsel;
    const liste = h('ul', { class: 'a-punkte a-anpassbar' }, A.anpassbar(a.paket).map((x) => h('li', { class: x.frei ? '' : 'zu' }, h('span', null, h('b', { text: x.titel }), ' ', h('span', { class: 'a-neben', text: x.text })), x.frei ? null : U.chip('ab ' + kurz(x.ab), 'leise'))));
    const teile = [h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Ihr Paket' }), U.chip(P.PAKETE[a.paket].name, 'aktiv')),
      h('p', null, U.euro(pr.monat) + ' im Monat' + (a.stand === 'live' ? '' : ' ab Livegang') + ', Einrichtung ' + U.euro(pr.einrichtung) + ' (netto).'), liste];
    if (n && !zuEnde(a)) {
      if (vorZahlung(a)) teile.push(h('div', { class: 'a-knoepfe', style: 'margin-top:14px' }, U.ring('Paket wechseln', { href: '/bestellen/#' + a.paket + '/' + a.id + '/paket' })));
      else if (w && w.paket) teile.push(h('p', { class: 'a-hinweis', style: 'margin-top:14px', text: 'Wechsel zu ' + P.PAKETE[w.paket].name + ' angefragt am ' + U.datum(w.zeit) + '. Wir melden uns.' }));
      else teile.push(h('div', { class: 'a-innen a-anreiz' }, h('p', { class: 'a-label-klein', style: 'margin:0' }, U.chip('Mit ' + kurz(n.paket))), h('h3', { text: 'Für ' + U.euro(n.monat) + ' mehr im Monat' }),
        h('ul', null, n.dazu.slice(0, 4).map((x) => h('li', { text: x.titel }))), h('p', { class: 'a-preis-dazu' }, 'Einmalig ' + U.euro(n.einrichtung) + ' Differenz der Einrichtung'),
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
    const zeilen = [['Einrichtung', z.status === 'bezahlt' ? U.euro((z.betrag_cent || 0) / 100) + ' bezahlt am ' + U.datum(z.bezahlt_am) + (z.erstattet ? ', erstattet' : '') : (z.status === 'laeuft' ? 'Lastschrift unterwegs' : 'offen')],
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
    if (a.stand === 'live' || a.stand === 'pausiert') return h('p', { class: 'a-fusszeile' }, U.aenderbar('Kündigen können Sie jederzeit zum Monatsende, unter „Rechnungen und Zahlungsmittel“ oder per Nachricht.'));
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
  function freigeben(a, knopf) {
    bestaetigen('Vorschau freigeben?', 'Danach schalten wir Ihre Seite live; ab dem Livegang läuft Ihr Monatsabo. Kleinigkeiten können Sie auch danach noch ändern.', 'Freigeben', async () => {
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
    bestaetigen('Zu ' + P.PAKETE[n.paket].name + ' wechseln?', 'Fällig wird die Differenz der Einrichtung (' + U.euro(n.einrichtung) + ' netto), der neue Monatspreis gilt ab dem Wechsel (Paketbedingungen § 7 Abs. 3). Wir melden uns und richten alles ein.', 'Wechsel anfragen', async () => {
      await U.api('POST', '/api/auftrag/' + a.id + '/wechsel', { paket: n.paket }); a.wechsel = { paket: n.paket, zeit: new Date().toISOString() }; zeigen(a, { stehen: true }); U.toast('Angefragt');
    });
  }
  function ersetzen(neu) { const l = S.ich.auftraege || []; const i = l.findIndex((x) => x.id === neu.id); if (i >= 0) l[i] = Object.assign(l[i], neu); }

  /* ---------- Weiche ---------- */
  function route() {
    if (!S.ich || !S.ich.angemeldet) { anmeldung(); return; }
    const m = /^#auftrag\/([0-9a-z-]{8,})(?:\/(gespeichert))?$/i.exec(location.hash);
    const l = S.ich.auftraege || [];
    if (m) {
      const a = l.find((x) => x.id === m[1]);
      if (a) { zeigen(a); if (m[2]) { history.replaceState(null, '', '#auftrag/' + a.id); U.toast('Gespeichert'); } return; }
      history.replaceState(null, '', location.pathname);
    }
    if (l.length === 1 && !location.hash) { history.replaceState(null, '', '#auftrag/' + l[0].id); zeigen(l[0]); return; }
    uebersicht();
  }
  addEventListener('hashchange', () => { if (S.ich) route(); });

  async function start() {
    const q = new URLSearchParams(location.search), session = q.get('kasse');
    const [stand, ich] = await Promise.all([U.api('GET', '/api/auftrag/stand').catch(() => null), U.api('GET', '/api/auftrag/ich').catch(() => ({ angemeldet: false }))]);
    S.stand = stand; S.ich = ich;
    if (session && ich.angemeldet) {
      const m = /^#auftrag\/([0-9a-z-]{8,})/i.exec(location.hash);
      history.replaceState(null, '', location.pathname + location.hash);
      if (m) {
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

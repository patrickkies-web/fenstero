/* eeziframes · Zentrale des Inhabers (/zentrale/): Eingang aller Aufträge und je Auftrag alles, was er zum Bauen der Landingpage braucht.
   Anmeldung mit ZENTRALE_PASSWORT (und ZENTRALE_2FA, falls eingetragen). Eingang: Kennzahlen aus den echten Aufträgen (zu tun, live,
   Monatsumsatz der laufenden Abos), Filter, Zeilen mit Stand, nächstem Schritt und Hinweisen (geändert, Nachrichten, Wechsel).
   Auftrag (#auftrag/<id>): der nächste Schritt als Pille (Seite beginnen, Vorschau bereitstellen, Live schalten), Prompt für Claude zum
   Kopieren, Material (Logo, Porträt, Fotos zum Herunterladen, Farben, Texte, Website), Betrieb und Impressum, Adresse und Anfragen,
   Nachrichten, interne Notiz, Zahlung und Abo, Verlauf, weitere Übergänge (Auftrag.UEBERGAENGE). Server: functions/auftrag/ (INHABER). */
(function () {
  'use strict';
  const U = window.AuftragUI, A = window.Auftrag, P = window.Pakete, h = U.h;
  const wurzel = document.getElementById('app');
  const S = { stand: null, liste: null, filter: 'tun', auftrag: null, start: true };
  const kurz = U.kurzname;
  const WARTEN = ['Kunde füllt aus', 'Warten auf Freigabe', ''];
  const zuTun = (a) => WARTEN.indexOf(a.naechster || '') < 0 || a.ungelesen > 0 || a.geaendert || !!a.wechsel;
  const FILTER = [
    { k: 'tun', t: 'Zu tun', f: zuTun },
    { k: 'arbeit', t: 'In Arbeit', f: (a) => ['bezahlt', 'in_arbeit'].indexOf(a.stand) >= 0 },
    { k: 'vorschau', t: 'Vorschau', f: (a) => a.stand === 'vorschau' },
    { k: 'live', t: 'Live', f: (a) => ['live', 'pausiert'].indexOf(a.stand) >= 0 },
    { k: 'offen', t: 'Entwürfe', f: (a) => ['entwurf', 'angefragt'].indexOf(a.stand) >= 0 },
    { k: 'alle', t: 'Alle', f: () => true }
  ];

  /* ---------- Gerüst ---------- */
  function kopf(zurueck) {
    const rechts = S.stand && S.stand.angemeldet ? [U.ring('Abmelden', { class: 'klein', on: { click: abmelden } })] : [];
    const k = U.kopf({ zurueck: zurueck || null, zurueckLabel: 'Zum Eingang', zusatz: 'Zentrale', rechts: rechts });
    k.id = 'kopf';
    const alt = document.getElementById('kopf'); if (alt) alt.replaceWith(k);
  }
  function seite(o) {
    U.leeren(wurzel);
    const main = h('main', { class: 'a-raster aktion-oben ' + (o.buehne ? 'zwei' : 'eins'), id: 'inhalt' },
      h('div', { class: 'a-r-band' }, o.band || null), h('aside', { class: 'a-r-buehne', 'aria-label': 'Seite des Kunden' }, o.buehne || null),
      h('div', { class: 'a-r-frage' }, o.frage), h('div', { class: 'a-r-inhalt' }, o.inhalt || null), o.fuss ? h('div', { class: 'a-r-fuss a-fuss' }, o.fuss) : null);
    wurzel.appendChild(main);
    if (!o.stehen) { window.scrollTo(0, 0); if (!S.start) { const t = main.querySelector('h1'); if (t) t.focus({ preventScroll: true }); } }
    S.start = false;
  }
  const kv = (zeilen) => h('dl', { class: 'a-kv' }, zeilen.filter((z) => z && z[1] != null && z[1] !== '').map((z) => [h('dt', { text: z[0] }), h('dd', null, z[1] == null || z[1] === '' ? '–' : z[1])]));
  function kopieren(text, was) {
    const ok = () => U.toast((was || 'Text') + ' kopiert');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, () => U.toast('Bitte markieren und kopieren.'));
    else U.toast('Bitte markieren und kopieren.');
  }

  /* ---------- Anmeldung ---------- */
  function anmeldung() {
    kopf();
    const st = S.stand || {};
    if (!st.eingerichtet) {
      seite({ frage: U.frage('Zentrale. *Noch nicht eingerichtet.*', st.grund === 'zu_kurz' ? 'ZENTRALE_PASSWORT ist kürzer als 12 Zeichen.' : st.grund === '2fa_ungueltig' ? 'ZENTRALE_2FA ist kein gültiger Schlüssel (Base32).' : 'Bitte ZENTRALE_PASSWORT (ab 12 Zeichen) bei Cloudflare als Secret eintragen, siehe docs/ZENTRALE.md.') });
      return;
    }
    const pw = U.feld({ k: 'passwort', label: 'Passwort', typ: 'password', auto: 'current-password' });
    const code = st.zweiterFaktor ? U.feld({ k: 'code', label: 'Code aus der Authenticator-App', modus: 'numeric', auto: 'one-time-code', max: 7 }) : null;
    const knopf = U.pille('Anmelden', { on: { click: () => los() } });
    async function los() {
      if (U.wartet(knopf)) return;
      U.warten(knopf, true);
      try { await U.api('POST', '/api/inhaber/anmelden', { passwort: pw.eingabe.value, code: code ? code.eingabe.value : '' }); S.stand.angemeldet = true; await eingangLaden(); route(); }
      catch (e) { U.warten(knopf, false); U.fehlerSetzen(code || pw, e.message); }
    }
    seite({ frage: U.frage('Zentrale. *Nur für den Inhaber.*', 'Hier kommen alle Bestellungen an, mit allem, was Sie für die Landingpage brauchen.'),
      inhalt: U.karte(null, null, h('form', { novalidate: true, on: { submit: (e) => { e.preventDefault(); los(); } } }, pw, code, h('button', { type: 'submit', hidden: true, tabindex: '-1', 'aria-hidden': 'true' }))), fuss: [knopf] });
    setTimeout(() => pw.eingabe.focus(), 30);
  }
  async function abmelden() { await U.api('POST', '/api/inhaber/abmelden', {}).catch(() => null); S.stand.angemeldet = false; location.hash = ''; anmeldung(); }

  /* ---------- Eingang ---------- */
  async function eingangLaden() { const r = await U.api('GET', '/api/inhaber/auftraege'); S.liste = r.auftraege; S.kasse = r.kasse || null; }
  function eingang(o) {
    kopf();
    const l = S.liste || [], tun = l.filter(zuTun), live = l.filter((a) => a.stand === 'live');
    const umsatz = live.reduce((s, a) => s + (Number(a.monat) || 0), 0);
    const zahlen = U.kachel([h('p', { class: 'a-label-klein', style: 'margin:0' }, U.chip('Eingang', 'aktiv')),
      h('div', { class: 'a-zahlen' },
        h('div', { class: 'a-zahl gross' }, h('b', { text: String(tun.length) }), h('span', { text: tun.length === 1 ? 'Auftrag wartet auf Sie' : 'Aufträge warten auf Sie' })),
        h('div', { class: 'a-zahl' }, h('b', { text: String(live.length) }), h('span', { text: 'live' })),
        h('div', { class: 'a-zahl' }, h('b', { text: U.euro(umsatz) }), h('span', { text: 'im Monat aus laufenden Abos, netto' })))], 'leucht a-zahlen-kachel');
    const filter = h('div', { class: 'a-filter', role: 'group', 'aria-label': 'Filter' }, FILTER.map((f) => {
      const n = l.filter(f.f).length;
      return h('button', { type: 'button', 'aria-pressed': String(S.filter === f.k), on: { click: () => { S.filter = f.k; eingang({ stehen: true }); } } }, f.t, h('span', { class: 'a-zaehler', text: String(n) }));
    }));
    const auswahl = l.filter((FILTER.find((f) => f.k === S.filter) || FILTER[0]).f);
    const zeilen = auswahl.length ? h('ol', { class: 'a-eingang' }, auswahl.map(zeile)) : h('p', { class: 'a-leer', text: S.filter === 'tun' ? 'Nichts zu tun. Neue Bestellungen erscheinen hier, dazu eine E-Mail an Sie.' : 'Keine Aufträge in dieser Ansicht.' });
    seite({ frage: U.frage(tun.length ? 'Eingang. *' + (tun.length === 1 ? 'Ein Auftrag' : tun.length + ' Aufträge') + ' für Sie.*' : 'Eingang. *Alles erledigt.*', null), inhalt: [zahlen, kasseKarte(), filter, U.karte(null, null, zeilen, { class: 'a-karte a-eingang-karte' })], stehen: o && o.stehen });
  }
  /* Paket-Kasse: offen (mit Modus) oder zu, mit den Gründen vom Server; Bestellungen enden sonst als unverbindliche Anfrage */
  const MODUS = { test: 'Stripe im Testmodus, ohne echtes Geld', live: 'Stripe mit echtem Geld', attrappe: 'Attrappe ohne Stripe' };
  function kasseKarte() {
    const k = S.kasse; if (!k) return null;
    if (k.kasse) return h('p', { class: 'a-hinweis a-kasse', style: 'margin:0 0 4px' }, U.chip('Kasse offen', 'aktiv'), ' ' + (MODUS[k.modus] || '') + '. Bestellungen gehen bis zur Zahlung.');
    return U.kachel([h('p', { class: 'a-label-klein', style: 'margin:0' }, U.chip('Kasse zu', 'hinweis')), h('h2', { text: 'Bestellungen enden gerade als Anfrage' }),
      h('ul', { class: 'a-gruende' }, k.gruende.map((g) => h('li', { text: g }))),
      h('p', { class: 'a-hinweis', style: 'margin:8px 0 0;color:var(--silbergrau)', text: 'Zum Testen genügt der Testschlüssel von Stripe (sk_test_…): damit ist die Kasse immer offen. Mit echtem Schlüssel öffnet sie erst, wenn alles oben erledigt ist.' })], 'a-kasse-zu');
  }
  function zeile(a) {
    const hinweise = [];
    if (a.geaendert) hinweise.push(U.chip('geändert', 'hinweis'));
    if (a.ungelesen) hinweise.push(U.chip(a.ungelesen + ' Nachricht' + (a.ungelesen > 1 ? 'en' : ''), 'hinweis'));
    if (a.wechsel) hinweise.push(U.chip('Wechsel zu ' + kurz(a.wechsel.paket), 'hinweis'));
    if (a.freigabe && a.stand === 'vorschau') hinweise.push(U.chip('freigegeben', 'aktiv'));
    return h('li', null, h('a', { class: 'a-eingang-zeile', href: '#auftrag/' + a.id },
      h('span', { class: 'a-ez-haupt' }, h('b', { text: a.name || a.firma || 'Ohne Namen' }), h('span', { class: 'a-ez-neben', text: [kurz(a.paket), a.nr, a.ort, a.adresse].filter(Boolean).join(' · ') })),
      h('span', { class: 'a-ez-stand' }, a.naechster ? h('span', { class: 'a-ez-schritt', text: a.naechster }) : null, h('span', { class: 'a-ez-chips' }, U.chip(A.STAND_TITEL[a.stand], a.stand === 'live' ? 'aktiv' : 'leise'), hinweise)),
      h('span', { class: 'a-ez-zeit', text: U.datum(a.updated_at) })));
  }

  /* ---------- Ein Auftrag ---------- */
  async function auftragLaden(id) {
    const r = await U.api('GET', '/api/inhaber/auftraege/' + id);
    S.auftrag = Object.assign(r.auftrag, { prompt: r.prompt, nachrichten: r.nachrichten, paketStand: r.stand, kiStand: r.ki || null, kasse: r.kasse || null }); if (r.kasse) S.kasse = r.kasse;
    if (r.auftrag.geaendert && r.auftrag.geaendert > (r.auftrag.gesehen || '')) U.api('POST', '/api/inhaber/auftraege/' + id + '/gesehen', {}).catch(() => null);
    const e = (S.liste || []).find((x) => x.id === id); if (e) { e.ungelesen = 0; e.geaendert = false; }
    return S.auftrag;
  }
  const dateiUrl = (a, d, laden) => '/api/inhaber/auftraege/' + a.id + '/datei/' + d.id + (laden ? '?laden=1' : '');
  const bild = (d) => d && /^image\/(png|jpeg|webp|svg\+xml)$/.test(d.typ);
  const datei = (a, platz) => (a.dateien || []).filter((d) => d.platz === platz).pop() || null;
  function buehne(a) {
    const v = U.vorschau(), g = a.angaben || {}, b = g.betrieb || {}, t = g.auftritt || {}, url = (k) => { const d = datei(a, k); return bild(d) ? dateiUrl(a, d) : ''; };
    v.setzen({ paket: a.paket, adresse: a.adresse, name: b.name || b.firma, ort: b.ort, region: b.region, ap: b.ap, rolle: b.rolle, ueberschrift: t.ueberschrift, einleitung: t.einleitung, einladung: t.einladung, farbe: A.farbe((t.farben || [])[0]), logo: url('logo'), portrait: url('portrait'), buehne: url('buehne') });
    return h('div', { class: 'a-buehne' }, h('div', { class: 'a-buehne-in' }, v.el, h('div', { class: 'a-buehne-zeile' }, h('span', null, h('b', { style: 'color:var(--weiss);font-weight:500', text: kurz(a.paket) }), ' · ' + a.nr), U.chip(A.STAND_TITEL[a.stand], a.stand === 'live' ? 'aktiv' : 'leise'))));
  }
  /* Nächster Schritt: Pille mit Blatt */
  function schritt(a) {
    const v = a.vorschau || {};
    if (a.stand === 'angefragt' && (a.kasse || S.kasse || {}).kasse) return { titel: 'Zur Zahlung einladen', einladen: true };
    if (a.stand === 'bezahlt') return { titel: 'Seite beginnen', nach: 'in_arbeit', text: 'Der Kunde bekommt eine E-Mail „Wir bauen Ihre Seite“. Danach ist kein kostenloser Storno mehr möglich.' };
    if (a.stand === 'in_arbeit') return { titel: v.aenderung ? 'Neue Vorschau bereitstellen' : 'Vorschau bereitstellen', nach: 'vorschau', link: 'Link zur Vorschau', text: 'Der Kunde bekommt den Link per E-Mail und gibt im Kundenbereich frei oder wünscht Änderungen.' };
    const live = (titel, vorab) => ({ titel: titel, nach: 'live', link: 'Adresse der fertigen Seite', vorschlag: a.adresse && a.adresse.indexOf('.') > 0 && !/Vorschlag/.test(a.adresse) ? 'https://' + a.adresse + '/' : '', text: vorab + 'Das Monatsabo startet jetzt (' + U.euro((a.preise || {}).monat || 0) + ' netto im Monat), der Kunde bekommt eine E-Mail mit dem Link.' });
    if (a.stand === 'vorschau' && v.freigabe) return live('Live schalten', '');
    /* Keine Antwort auf die Vorschau: Frist zur Freigabe (Paketbedingungen § 5 Abs. 5, § 640 Abs. 2 BGB); danach gilt die Einrichtung als abgenommen */
    if (a.stand === 'vorschau' && v.frist && Date.parse(v.frist) < Date.now()) return live('Live schalten (Frist abgelaufen)', 'Die Frist zur Freigabe ist am ' + U.datum(v.frist) + ' abgelaufen. Hat der Kunde bis dahin keinen Mangel genannt, gilt die Einrichtung als abgenommen (Paketbedingungen § 5 Abs. 5). ');
    if (a.stand === 'vorschau' && !v.frist) return { titel: 'Frist zur Freigabe setzen', frist: true };
    if (a.stand === 'pausiert') return { titel: 'Wieder live schalten', nach: 'live', link: 'Adresse der Seite', vorschlag: v.live || '', text: 'Die Seite ist wieder erreichbar.' };
    return null;
  }
  /* Anfrage zur Zahlung einladen: Mail mit Link auf „Bestellen“, Satz an den Kunden freiwillig */
  function einladenBlatt(a) {
    const text = U.feld({ k: 'text', label: 'Satz an den Kunden', optional: true, zeilen: 3, max: 600, platzhalter: 'z. B. Danke für Ihre Geduld, ab heute können Sie bestellen.' });
    const ja = U.pille('Einladung senden'), nein = U.ring('Abbrechen');
    const zu = U.blatt({ titel: 'Zur Zahlung einladen?', text: 'Der Kunde bekommt eine E-Mail mit dem Link zur Bestellung. Dort prüft er seine Angaben, stimmt zu und bezahlt die Einrichtung.', inhalt: h('div', { class: 'a-karte', style: 'margin:0 0 4px' }, text), knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => {
      if (U.wartet(ja)) return; U.warten(ja, true);
      try { await U.api('POST', '/api/inhaber/auftraege/' + a.id + '/zahlung-einladen', { text: text.eingabe.value }); zu(); U.toast('Einladung gesendet'); zeigen(await auftragLaden(a.id), { stehen: true }); }
      catch (e) { U.warten(ja, false); U.fehlerSetzen(text, e.message); }
    });
  }
  /* Frist zur Freigabe: Mail an den Kunden mit 14 Tagen Frist und dem Hinweis auf die Abnahme (Paketbedingungen § 5 Abs. 5) */
  function fristBlatt(a) {
    const text = U.feld({ k: 'text', label: 'Satz an den Kunden', optional: true, zeilen: 3, max: 600, platzhalter: 'z. B. Wir haben Sie telefonisch nicht erreicht.' });
    const ja = U.pille('Frist setzen'), nein = U.ring('Abbrechen');
    const zu = U.blatt({ titel: 'Frist zur Freigabe setzen?', text: 'Der Kunde bekommt eine E-Mail: Er gibt die Vorschau innerhalb von 14 Tagen frei oder nennt Änderungswünsche. Nennt er bis dahin keinen Mangel, gilt die Einrichtung als abgenommen, und Sie dürfen live schalten.', inhalt: h('div', { class: 'a-karte', style: 'margin:0 0 4px' }, text), knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => {
      if (U.wartet(ja)) return; U.warten(ja, true);
      try { await U.api('POST', '/api/inhaber/auftraege/' + a.id + '/freigabe-frist', { text: text.eingabe.value }); zu(); U.toast('Frist gesetzt'); zeigen(await auftragLaden(a.id), { stehen: true }); }
      catch (e) { U.warten(ja, false); U.fehlerSetzen(text, e.message); }
    });
  }
  function standBlatt(a, s) {
    const link = s.link ? U.feld({ k: 'link', label: s.link, typ: 'url', modus: 'url', wert: s.vorschlag || '', platzhalter: 'https://' }) : null;
    const text = U.feld({ k: 'text', label: 'Satz an den Kunden', optional: true, zeilen: 3, max: 600, platzhalter: s.nach === 'storniert' ? 'z. B. Wie besprochen erstatten wir die Einrichtung.' : '' });
    const mail = U.haken({ text: 'Kunden per E-Mail benachrichtigen', an: true });
    const sofort = s.nach === 'beendet' ? U.haken({ text: 'Sofort beenden (sonst zum Ende des bezahlten Monats)', an: false }) : null;
    const ja = s.gefahr ? U.ring(s.titel, { class: 'gefahr' }) : U.pille(s.titel), nein = U.ring('Abbrechen');
    const karte = h('div', { class: 'a-karte', style: 'margin:0 0 4px' }, link, text, h('div', { style: 'padding:4px 0 8px' }, mail, sofort));
    const zu = U.blatt({ titel: s.titel + '?', text: s.text, inhalt: karte, knoepfe: [ja, nein] });
    nein.addEventListener('click', zu);
    ja.addEventListener('click', async () => {
      if (U.wartet(ja)) return;
      if (link && !A.webAdresse(link.eingabe.value)) { U.fehlerSetzen(link, 'Bitte einen Link wie https://… eintragen.'); link.eingabe.focus(); return; }
      U.warten(ja, true);
      try {
        const x = await U.api('POST', '/api/inhaber/auftraege/' + a.id + '/stand', { stand: s.nach, link: link ? link.eingabe.value.trim() : '', text: text.eingabe.value, mail: mail.eingabe.checked, sofort: sofort ? sofort.eingabe.checked : false });
        zu(); U.toast(x.hinweis || A.STAND_TITEL[s.nach]); await eingangLaden(); zeigen(await auftragLaden(a.id), { stehen: true });
      } catch (e) { U.warten(ja, false); if (link && e.daten && e.daten.felder && e.daten.felder.link) U.fehlerSetzen(link, e.daten.felder.link); else U.toast(e.message); }
    });
  }
  const WEITERE = {
    in_arbeit: { titel: 'Zurück in Arbeit', text: 'Zum Beispiel für einen neuen Vorschau-Link.' },
    entwurf: { titel: 'Zurück in den Entwurf', text: 'Der Kunde kann die Bestellung dann wieder bearbeiten.' },
    pausiert: { titel: 'Pausieren', text: 'Die Seite zeigt in dieser Zeit nur die Kontaktdaten des Betriebs. Das Abo läuft weiter.' },
    beendet: { titel: 'Vertrag beenden', text: 'Das Monatsabo endet, die Seite geht offline.', gefahr: true },
    storniert: { titel: 'Stornieren', text: 'Eine bezahlte Einrichtung wird über Stripe vollständig erstattet.', gefahr: true }
  };

  function zeigen(a, o) {
    o = o || {};
    S.auftrag = a;
    kopf('#');
    const g = a.angaben || {}, b = g.betrieb || {}, ad = g.adresse || {}, t = g.auftritt || {}, m = P.merkmale(a.paket) || {}, v = a.vorschau || {}, z = a.zahlung || {}, ab = a.abo || {};
    const s = schritt(a), inhalt = [];

    /* Hinweise oben */
    const hin = [];
    if (a.geaendert && a.geaendert > (a.gesehen || '')) hin.push('Der Kunde hat seine Angaben am ' + U.zeit(a.geaendert) + ' geändert (Verlauf unten).');
    if (a.wechsel) hin.push('Wechsel zu ' + P.PAKETE[a.wechsel.paket].name + ' angefragt am ' + U.datum(a.wechsel.zeit) + '. Differenz der Einrichtung und neuen Monatspreis mit dem Kunden klären.');
    if (v.aenderung && a.stand === 'in_arbeit') hin.push('Änderungswunsch vom ' + U.datum(v.aenderung.zeit) + ': „' + v.aenderung.text + '“');
    if (v.freigabe && a.stand === 'vorschau') hin.push('Vorschau am ' + U.zeit(v.freigabe.zeit) + ' freigegeben.');
    else if (v.frist && a.stand === 'vorschau') hin.push('Frist zur Freigabe gesetzt, läuft bis ' + U.datum(v.frist) + '. Danach dürfen Sie live schalten, wenn der Kunde keinen Mangel nennt.');
    const kst = a.kasse || S.kasse;
    if (a.stand === 'angefragt') hin.push(kst && kst.kasse ? 'Unverbindlich angefragt, als die Kasse zu war. Jetzt ist sie offen (' + (MODUS[kst.modus] || '') + '): Laden Sie den Kunden zur Zahlung ein; er bekommt einen Link zur Bestellung und bezahlt dort.'
      : 'Unverbindlich angefragt. Die Kasse ist zu' + (kst && kst.gruende && kst.gruende.length ? ': ' + kst.gruende.join('; ') : '') + '. Sobald sie offen ist, laden Sie den Kunden hier zur Zahlung ein.');
    if (hin.length) inhalt.push(U.kachel(hin.map((x) => h('p', { class: 'a-hinweis', style: 'margin:6px 0;color:var(--weiss)', text: x })), 'a-hinweise'));

    /* Prompt */
    const pre = h('pre', { class: 'a-code a-prompt', text: a.prompt || '' });
    inhalt.push(U.karte('Prompt für die Landingpage', 'Für Claude, mit allen Angaben', [pre, h('div', { class: 'a-knoepfe', style: 'padding:10px 0 16px' }, U.ring([U.icon('kopie'), ' Prompt kopieren'], { class: 'klein', on: { click: () => kopieren(a.prompt, 'Prompt') } }))]));

    /* Material */
    if (A.gestaltet(m) || (a.dateien || []).length) inhalt.push(material(a));

    /* Betrieb, Adresse */
    inhalt.push(U.karte('Betrieb und Impressum', null, kv([['Unternehmen', b.firma], ['Auf der Seite', b.name], ['Einzugsgebiet', b.region], ['Ansprechperson', [b.ap, b.rolle].filter(Boolean).join(', ')], ['Telefon', b.tel], ['E-Mail', b.mail], ['Erreichbar', b.erreichbar],
      ['Website', b.web ? h('a', { href: b.web, target: '_blank', rel: 'noopener noreferrer', text: b.web }) : ''], ['Anschrift', [b.strasse, [b.plz, b.ort].filter(Boolean).join(' ')].filter(Boolean).join(', ')], ['Bundesland', A.BUNDESLAENDER[b.bundesland]],
      ['Rechtsform', b.rechtsform], ['Vertreten durch', b.vertretung], ['Register', b.register], ['USt-IdNr.', b.ust], ['Kammer', b.kammer], ['Beruf', b.beruf], ['Schlichtung', b.schlichtung], ['Datenschutzbeauftragter', b.dsb], ['Anruf', b.rueckruf]])));
    inhalt.push(U.karte('Adresse und Anfragen', null, kv([['Adresse', a.adresse], m.domain ? ['Domain', ad.art === 'eigene' ? 'gehört dem Kunden, nach Absprache anbinden (§ 6 Abs. 3)' : 'neu registrieren, bis 25 € netto im Jahr'] : null, m.domain && (ad.domains || []).length > 1 ? ['Weitere Wünsche', ad.domains.slice(1).join(', ')] : null,
      ad.vorschlaege ? ['Vorschläge', 'erwünscht'] : null, ['Anfragen an', (ad.eingang || []).join(', ')], m.dashboard ? ['Team', (ad.team || []).filter(Boolean).join(', ')] : null])));

    /* Nachrichten, Notiz */
    inhalt.push(nachrichten(a));
    const notiz = h('textarea', { rows: '4', maxlength: '4000', 'aria-label': 'Interne Notiz', placeholder: 'Nur für Sie: Telefonat, Absprachen, Domain gekauft am …' }); notiz.value = a.notiz || '';
    inhalt.push(U.karte('Interne Notiz', 'sieht der Kunde nicht', [h('div', { class: 'a-flaeche' }, notiz), h('div', { class: 'a-knoepfe', style: 'padding:10px 0 16px' }, U.ring('Notiz speichern', { class: 'klein', on: { click: async () => { try { await U.api('POST', '/api/inhaber/auftraege/' + a.id + '/notiz', { text: notiz.value }); a.notiz = notiz.value; U.toast('Notiz gespeichert'); } catch (e) { U.toast(e.message); } } } }))]));

    /* KI-Kontingent: Verbrauch des Monats, Freischaltung des Kunden, Abrechnungen; Konfigurator von Hand verknüpfen */
    const ks = a.kiStand;
    if (ks && !['entwurf', 'angefragt', 'storniert'].includes(a.stand)) {
      const host = U.feld({ k: 'host', label: ks.verknuepft ? 'Anderer Konfigurator' : 'Konfigurator verknüpfen', platzhalter: 'fensterbau-brandt.de', optional: ks.verknuepft, hilfe: 'Adresse des Konfigurators; beim Live-Schalten geschieht das über die Adresse der Seite.' });
      const verknuepfen = U.ring('Verknüpfen', { class: 'klein', on: { click: async () => {
        try { await U.api('POST', '/api/inhaber/auftraege/' + a.id + '/instanz', { host: host.eingabe.value.trim() }); U.toast('Verknüpft'); zeigen(await auftragLaden(a.id), { stehen: true }); }
        catch (e) { U.fehlerSetzen(host, (e.daten && e.daten.felder && e.daten.felder.host) || e.message); } } } });
      inhalt.push(U.karte('KI-Auswertungen', ks.monat, [kv([
        ['Konfigurator', ks.verknuepft ? ks.host : 'nicht verknüpft (Zähler und Abrechnung fehlen)'],
        ks.verknuepft ? ['Genutzt', (ks.mehr ? P.tausend(ks.kontingent) + ' von ' + P.tausend(ks.kontingent) + ' + ' + P.tausend(ks.mehr) + ' weitere' : P.tausend(ks.genutzt) + ' von ' + P.tausend(ks.kontingent)) + ' (' + ks.prozent + '\u00a0%)'] : null,
        ['Weitere', ks.frei ? 'freigeschaltet seit ' + U.datum(ks.frei_seit) + ' bis zum Beenden; im Monat ' + P.tausend(ks.kontingent) + '\u00a0+\u00a0' + P.tausend(ks.obergrenze - ks.kontingent) + ' weitere' : 'nicht freigeschaltet: Pause bei 100 %'],
        ks.mehr ? ['Bisher weitere', P.tausend(ks.mehr) + ' · ' + U.euro(ks.mehrCent / 100) + ' netto'] : null,
        ['Abgerechnet', (ks.abgerechnet || []).filter((x) => x.mehr).map((x) => x.text + ': ' + P.tausend(x.mehr) + ' weitere, ' + U.euro(x.cent / 100) + (x.offen ? ' (von Hand abrechnen)' : ' (Stripe ' + (x.posten || '–') + ')')).join(' · ') || 'noch nichts']]),
        host, h('div', { class: 'a-knoepfe', style: 'padding:0 0 16px' }, verknuepfen)]));
    }

    /* Zahlung, Kunde, Verlauf */
    const ZI = a.zahlungIntern || {};
    inhalt.push(U.karte('Zahlung und Abo', null, kv([['Einrichtung', z.status === 'bezahlt' ? U.euro((z.betrag_cent || 0) / 100) + ' brutto, bezahlt am ' + U.datum(z.bezahlt_am) + (z.erstattet ? ', erstattet' : '') : (z.status || 'offen')], ['Preise', U.euro((a.preise || {}).einrichtung || 0) + ' Einrichtung, ' + U.euro((a.preise || {}).monat || 0) + ' im Monat, netto (Preisstand ' + ((a.preise || {}).stand ? U.datum((a.preise || {}).stand) : '–') + ')'],
      ['KI-Auswertungen', P.tausend((P.merkmale(a.paket) || {}).kiMonat) + ' im Monat inklusive, jede weitere ' + U.euro((a.preise || {}).ki != null ? a.preise.ki : P.preis(a.paket).ki) + ' netto, nur mit Freischaltung des Kunden; abgerechnet am Monatsanfang als Posten im Stripe-Abo (Karte „KI-Auswertungen“)'],
      ['Monatsabo', ab.status ? ab.status + (ab.seit ? ' seit ' + U.datum(ab.seit) : '') + (ab.bis ? ', bezahlt bis ' + U.datum(ab.bis) : '') : 'startet mit „Live schalten“'], ['Stripe', [ZI.kunde, ZI.intent, ab.id].filter(Boolean).join(' · ')],
      ['Zustimmung', a.zustimmung ? 'Unternehmer, Paketbedingungen vom ' + U.datum(a.zustimmung.agb) + ', AV-Vertrag, am ' + U.zeit(a.zustimmung.zeit) : '']])));
    const k = a.kunde || {};
    inhalt.push(U.karte('Kunde', null, kv([['E-Mail', k.mail ? h('a', { href: 'mailto:' + k.mail, text: k.mail }) : ''], ['Konto seit', U.datum(k.seit)], ['Zuletzt angemeldet', k.angemeldet_am ? U.zeit(k.angemeldet_am) : '']])));
    const vl = h('ol', { class: 'a-verlauf' }, (a.verlauf || []).slice().reverse().map((x) => h('li', null, h('small', { text: U.zeit(x.zeit) + ' · ' + ({ kunde: 'Kunde', inhaber: 'Sie', system: 'System' }[x.von] || x.von) }), x.text)));
    inhalt.push(U.karte('Verlauf', null, vl));

    /* Weitere Übergänge */
    const weitere = Object.keys(A.UEBERGAENGE[a.stand] || {}).filter((n) => A.uebergang(a.stand, n, 'inhaber') && (!s || n !== s.nach) && WEITERE[n]);
    if (weitere.length) inhalt.push(h('div', { class: 'a-knoepfe a-gefahr' }, weitere.map((n) => U.ring(WEITERE[n].titel, { class: 'klein' + (WEITERE[n].gefahr ? ' gefahr' : ''), on: { click: () => standBlatt(a, Object.assign({ nach: n }, WEITERE[n])) } }))));

    const titel = (b.name || b.firma || 'Ohne Namen') + (a.naechster ? '. *' + a.naechster + '.*' : '');
    seite({ band: h('p', { class: 'a-band-text', text: a.nr + ' · ' + P.PAKETE[a.paket].name + (A.gestaltet(P.merkmale(a.paket) || {}) ? ' · ' + (a.weg === 'schnell' ? 'Seite vorschlagen' : 'Selbst angeben') : '') + ' · bestellt ' + (z.bezahlt_am ? U.datum(z.bezahlt_am) : 'noch nicht') }), buehne: buehne(a),
      frage: U.frage(titel, null), inhalt: inhalt, fuss: s ? [U.pille(s.titel, { on: { click: () => (s.einladen ? einladenBlatt(a) : s.frist ? fristBlatt(a) : standBlatt(a, s)) } })] : null, stehen: o.stehen });
    const liste = wurzel.querySelector('.a-nachrichten'); if (liste) liste.scrollTop = liste.scrollHeight;
  }

  function material(a) {
    const g = a.angaben || {}, t = g.auftritt || {}, b = g.betrieb || {};
    const platz = (k, titel, cls) => {
      const d = datei(a, k);
      if (!d) return h('div', { class: 'a-platz ' + (cls || '') }, h('span', { class: 'a-platz-wahl' }, h('b', { text: titel + ' fehlt' })));
      return h('div', { class: 'a-platz voll ' + (cls || '') }, bild(d) ? h('img', { src: dateiUrl(a, d), alt: titel, decoding: 'async' }) : h('span', { class: 'a-platz-pdf', text: 'PDF' }),
        h('a', { class: 'a-platz-wahl', href: dateiUrl(a, d, true), download: d.name || titel, 'aria-label': titel + ' herunterladen' }, h('b', null, U.icon('laden'), titel)));
    };
    const weitere = (a.dateien || []).filter((d) => d.platz === 'weitere');
    const farben = (t.farben || []).map(A.farbe).filter(Boolean);
    return U.karte('Material', !A.gestaltet(P.merkmale(a.paket) || {}) ? 'Dateien aus der Bestellung' : a.weg === 'schnell' ? 'Seite vorschlagen: Texte und Bilder übernehmen Sie' : 'Selbst angeben: Material kommt vom Kunden', [
      h('div', { class: 'a-datei-zeile', style: 'padding:8px 0 4px;gap:10px' }, platz('logo', 'Logo', 'a-logo-platz'), platz('portrait', 'Porträt', 'a-portrait-platz')),
      h('div', { class: 'a-fotos' }, A.FOTO_PLAETZE.map((f) => platz(f.k, f.titel))),
      weitere.length ? h('ul', { class: 'a-dateiliste' }, weitere.map((d) => h('li', null, h('a', { href: dateiUrl(a, d, true), download: d.name, text: d.name })))) : null,
      kv([['Farben', farben.length ? h('span', { class: 'a-farbwerte' }, farben.map((c) => h('button', { type: 'button', class: 'a-farbwert', on: { click: () => kopieren(c, c) } }, h('i', { style: 'background:' + c }), c))) : (t.farbenWebsite ? 'aus Logo oder Website übernehmen' : '')],
        t.farbenWebsite && farben.length ? ['Farben', 'auch aus Logo oder Website'] : null, ['Website', b.web ? h('a', { href: b.web, target: '_blank', rel: 'noopener noreferrer', text: b.web + (t.ausWebsite ? ' (Texte, Farben, Bilder übernehmen)' : '') }) : ''],
        ['Überschrift', t.ueberschrift], ['Einleitung', t.einleitung], ['Leistungen', t.leistungTitel], ['Was sie besonders macht', t.leistungText], P.merkmale(a.paket).einladungslinks ? ['Einladungstext', t.einladung] : null, ['Hinweise des Kunden', t.notiz]])
    ]);
  }

  function nachrichten(a) {
    const liste = h('ol', { class: 'a-nachrichten' });
    const zeichnen = () => { U.leeren(liste); const l = a.nachrichten || []; if (!l.length) liste.appendChild(h('li', { class: 'a-nachricht leer', text: 'Noch keine Nachrichten.' })); l.forEach((n) => liste.appendChild(h('li', { class: 'a-nachricht' + (n.von === 'inhaber' ? ' eigene' : '') }, h('small', { text: (n.von === 'inhaber' ? 'Sie' : 'Kunde') + ' · ' + U.zeit(n.zeit) }), n.text))); liste.scrollTop = liste.scrollHeight; };
    zeichnen();
    const feld = h('textarea', { rows: '3', maxlength: String(A.GRENZEN.nachricht), placeholder: 'Antwort an den Kunden (geht auch per E-Mail raus)', 'aria-label': 'Antwort an den Kunden' });
    const knopf = U.ring('Senden', { on: { click: async () => {
      const text = feld.value.trim(); if (text.length < 2 || knopf.dataset.wartet) return; knopf.dataset.wartet = '1';
      try { const r = await U.api('POST', '/api/inhaber/auftraege/' + a.id + '/nachricht', { text: text }); feld.value = ''; (a.nachrichten = a.nachrichten || []).push(r.nachricht); zeichnen(); } catch (e) { U.toast(e.message); }
      delete knopf.dataset.wartet;
    } } });
    return U.kachel([h('div', { class: 'a-karte-kopf' }, h('h2', { text: 'Nachrichten' })), liste, h('div', { class: 'a-schreiben' }, h('div', { class: 'a-flaeche dunkel' }, feld), knopf)], 'a-nachrichten-kachel');
  }

  /* ---------- Weiche ---------- */
  async function route() {
    if (!S.stand || !S.stand.angemeldet) { anmeldung(); return; }
    const m = /^#auftrag\/([0-9a-z-]{8,})$/i.exec(location.hash);
    if (m) {
      try { zeigen(await auftragLaden(m[1])); } catch (e) { if (e.status === 401) { S.stand.angemeldet = false; anmeldung(); return; } U.toast(e.message); history.replaceState(null, '', location.pathname); eingang(); }
      return;
    }
    if (!S.liste) await eingangLaden().catch((e) => { if (e.status === 401) S.stand.angemeldet = false; });
    if (!S.stand.angemeldet) { anmeldung(); return; }
    eingang();
  }
  addEventListener('hashchange', () => { if (!location.hash) eingangLaden().then(() => route(), () => route()); else route(); });
  async function start() {
    S.stand = await U.api('GET', '/api/inhaber/stand').catch(() => ({ eingerichtet: false, grund: 'fehlt' }));
    route();
  }
  start();
})();

/* eeziframes · Zentrale des Inhabers (/zentrale/): Eingang aller Aufträge und je Auftrag alles, was er zum Bauen der Landingpage braucht.
   Anmeldung mit ZENTRALE_PASSWORT (und ZENTRALE_2FA, falls eingetragen). Eingang: Kennzahlen aus den echten Aufträgen (zu tun, live,
   Monatsumsatz der laufenden Abos), Filter, Zeilen mit Stand, nächstem Schritt und Hinweisen (geändert, Nachrichten, Wechsel).
   Auftrag (#auftrag/<id>): der nächste Schritt als Pille (Seite beginnen, Vorschau bereitstellen, Live schalten), Prompt für Claude zum
   Kopieren, Material (Logo, Porträt, Fotos zum Herunterladen, Farben, Texte, Website), Betrieb und Impressum, Adresse und Anfragen,
   Nachrichten, interne Notiz, Zahlung und Abo, Verlauf, weitere Übergänge (Auftrag.UEBERGAENGE). Server: functions/auftrag/ (INHABER).
   Vermittlung (#vermittlung, #vermittlung/<id>; Umschalter „Aufträge | Vermittlung“ oben im Eingang mit der Zahl der neuen): Anfragen der
   Hauseigentümer an bis zu drei Fensterbetriebe; je Betrieb Anruf-Knopf, Ergebnis des Anrufs, Notiz und, wenn er will, „Aufmaß schicken“
   nur mit dem Häkchen der Zustimmung im Gespräch. Server: functions/api/vermittlung.js, docs/VERMITTLUNG.md Abschnitt 10. */
(function () {
  'use strict';
  const U = window.AuftragUI, A = window.Auftrag, P = window.Pakete, h = U.h;
  const wurzel = document.getElementById('app');
  const S = { stand: null, liste: null, filter: 'tun', auftrag: null, start: true, vliste: null, vneu: 0, vfilter: 'offen', vermittlung: null };
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
  function kopf(zurueck, label) {
    const rechts = S.stand && S.stand.angemeldet ? [U.ring('Abmelden', { class: 'klein', on: { click: abmelden } })] : [];
    const k = U.kopf({ zurueck: zurueck || null, zurueckLabel: label || 'Zum Eingang', zusatz: 'Zentrale', rechts: rechts });
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
  async function eingangLaden() { const [r] = await Promise.all([U.api('GET', '/api/inhaber/auftraege'), vermittlungenLaden().catch(() => null)]); S.liste = r.auftraege; S.kasse = r.kasse || null; }
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
    seite({ band: umschalter('auftraege'), frage: U.frage(tun.length ? 'Eingang. *' + (tun.length === 1 ? 'Ein Auftrag' : tun.length + ' Aufträge') + ' für Sie.*' : 'Eingang. *Alles erledigt.*', null), inhalt: [zahlen, kasseKarte(), filter, U.karte(null, null, zeilen, { class: 'a-karte a-eingang-karte' })], stehen: o && o.stehen });
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

  /* ---------- Vermittlung (docs/VERMITTLUNG.md, Abschnitt 10) ----------
     Der Kunde hat bis zu drei Betriebe gewählt; Sie rufen an und schicken das Aufmaß nur an die, die im Gespräch zustimmen (das Häkchen
     ist Pflicht, die Zeit steht im Verlauf). Telefon und Website der Betriebe sieht nur die Zentrale, nie die App. */
  const V_STAND = { neu: 'Neu', in_arbeit: 'In Arbeit', vermittelt: 'Vermittelt', kein_betrieb: 'Kein Betrieb', erledigt: 'Erledigt' };
  const V_STATUS = { offen: 'Noch nicht angerufen', nicht_erreicht: 'Nicht erreicht', will: 'Will', will_nicht: 'Will nicht' };
  const V_OFFEN = ['neu', 'in_arbeit'];
  const VFILTER = [
    { k: 'offen', t: 'Offen', f: (v) => V_OFFEN.indexOf(v.stand) >= 0 },
    { k: 'vermittelt', t: 'Vermittelt', f: (v) => v.stand === 'vermittelt' },
    { k: 'alle', t: 'Alle', f: () => true }
  ];
  const telHref = (tel) => 'tel:' + String(tel || '').replace(/[^\d+]/g, '');
  const vpfad = (v) => '/api/inhaber/vermittlungen/' + v.id;
  async function vermittlungenLaden() { const r = await U.api('GET', '/api/inhaber/vermittlungen'); S.vliste = r.vermittlungen || []; S.vneu = r.neu || 0; return r; }
  async function vermittlungLaden(id) { const r = await U.api('GET', '/api/inhaber/vermittlungen/' + id); S.vermittlung = r.vermittlung; return r.vermittlung; }
  /* Umschalter oben im Eingang: zwei echte Links, aktiv mit Füllung und Punkt, bei der Vermittlung die Zahl der neuen */
  function umschalter(aktiv) {
    const n = S.vneu || 0;
    const link = (k, href, text, zahl) => h('a', { href: href, 'aria-current': k === aktiv ? 'page' : null, 'aria-label': zahl ? text + ', ' + zahl + ' neu' : null }, h('span', { text: text }), zahl ? h('span', { class: 'a-umschalter-zahl', 'aria-hidden': 'true', text: String(zahl) }) : null);
    return h('nav', { class: 'a-umschalter', 'aria-label': 'Bereich der Zentrale' }, link('auftraege', '#', 'Aufträge', 0), link('vermittlung', '#vermittlung', 'Vermittlung', n));
  }
  function vermittlungen(o) {
    kopf();
    const l = S.vliste || [], neu = l.filter((v) => v.stand === 'neu').length;
    const anrufe = l.filter((v) => V_OFFEN.indexOf(v.stand) >= 0).reduce((s, v) => s + (v.offen || 0), 0), verm = l.filter((v) => v.stand === 'vermittelt').length;
    const zahlen = U.kachel([h('p', { class: 'a-label-klein', style: 'margin:0' }, U.chip('Vermittlung', 'aktiv')),
      h('div', { class: 'a-zahlen' },
        h('div', { class: 'a-zahl gross' }, h('b', { text: String(neu) }), h('span', { text: neu === 1 ? 'neue Anfrage' : 'neue Anfragen' })),
        h('div', { class: 'a-zahl' }, h('b', { text: String(anrufe) }), h('span', { text: anrufe === 1 ? 'Anruf offen' : 'Anrufe offen' })),
        h('div', { class: 'a-zahl' }, h('b', { text: String(verm) }), h('span', { text: 'vermittelt' })))], 'leucht a-zahlen-kachel');
    const filter = h('div', { class: 'a-filter', role: 'group', 'aria-label': 'Filter' }, VFILTER.map((f) => h('button', { type: 'button', 'aria-pressed': String(S.vfilter === f.k), on: { click: () => { S.vfilter = f.k; vermittlungen({ stehen: true }); } } }, f.t, h('span', { class: 'a-zaehler', text: String(l.filter(f.f).length) }))));
    const auswahl = l.filter((VFILTER.find((f) => f.k === S.vfilter) || VFILTER[0]).f);
    const zeilen = auswahl.length ? h('ol', { class: 'a-eingang' }, auswahl.map(vzeile)) : h('p', { class: 'a-leer', text: S.vfilter === 'offen' ? 'Keine offenen Anfragen. Neue kommen hier an, dazu eine E-Mail an Sie mit dem Aufmaßblatt.' : 'Keine Anfragen in dieser Ansicht.' });
    seite({ band: umschalter('vermittlung'), frage: U.frage(neu ? 'Vermittlung. *' + (neu === 1 ? 'Eine neue Anfrage' : neu + ' neue Anfragen') + '.*' : 'Vermittlung. *Nichts Neues.*', null),
      inhalt: [zahlen, filter, U.karte(null, null, zeilen, { class: 'a-karte a-eingang-karte' })], stehen: o && o.stehen });
  }
  function vzeile(v) {
    const chips = [U.chip(V_STAND[v.stand] || v.stand, v.stand === 'neu' ? 'hinweis' : v.stand === 'vermittelt' ? 'aktiv' : 'leise'), U.chip(v.bestaetigt ? 'Nummer bestätigt' : 'Nummer nicht bestätigt', v.bestaetigt ? 'leise' : 'hinweis')];
    if (v.offen && V_OFFEN.indexOf(v.stand) >= 0) chips.push(U.chip(v.offen + (v.offen === 1 ? ' Anruf offen' : ' Anrufe offen'), 'hinweis'));
    if (v.gesendet) chips.push(U.chip('an ' + v.gesendet + (v.gesendet === 1 ? ' Betrieb' : ' Betriebe'), 'aktiv'));
    return h('li', null, h('a', { class: 'a-eingang-zeile', href: '#vermittlung/' + v.id },
      h('span', { class: 'a-ez-haupt' }, h('b', { text: v.name || 'Ohne Namen' }), h('span', { class: 'a-ez-neben', text: [v.nr, (v.plz + ' ' + v.ort).trim(), v.anzeige, v.gewaehlt ? v.gewaehlt + (v.gewaehlt === 1 ? ' Betrieb gewählt' : ' Betriebe gewählt') : 'Betrieb für mich suchen'].filter(Boolean).join(' · ') })),
      h('span', { class: 'a-ez-stand' }, h('span', { class: 'a-ez-chips' }, chips)),
      h('span', { class: 'a-ez-zeit', text: U.zeit(v.created_at) })));
  }
  /* Großer Anruf-Knopf (tel:): Ring mit Hörer im schwarzen Kreis; die eine volle Pille bleibt unten der nächste Anruf */
  function anrufKnopf(tel, anzeige, was) {
    if (!tel) return h('p', { class: 'a-hilfe', style: 'padding:6px 0 10px', text: 'Keine Telefonnummer bekannt.' });
    return h('a', { class: 'a-anruf', href: telHref(tel), 'aria-label': was + ': ' + anzeige }, h('i', null, U.icon('telefon')), h('span', null, h('b', { text: anzeige }), h('small', { text: was })));
  }
  function vermittlungZeigen(v, o) {
    o = o || {};
    S.vermittlung = v;
    kopf('#vermittlung', 'Zur Vermittlung');
    const k = v.kunde || {}, ew = v.einwilligung || {}, inhalt = [];
    const neuLaden = async (r, text) => { if (text) U.toast(text); vermittlungZeigen(r.vermittlung, { stehen: true }); vermittlungenLaden().catch(() => null); };
    /* Hinweis oben: Recht (Mail an Betriebe nur nach Zustimmung im Gespräch) und Frist */
    inhalt.push(U.kachel([h('p', { class: 'a-hinweis', style: 'margin:0;color:var(--weiss)', text: (v.betriebe || []).length ? 'Rufen Sie die Betriebe an. Das Aufmaß geht per E-Mail nur an die, die im Gespräch zustimmen; höchstens drei.' : 'Der Kunde möchte, dass Sie einen Betrieb für ihn finden. Tragen Sie unten Betriebe ein und rufen Sie an.' }),
      h('p', { class: 'a-hinweis', style: 'margin:8px 0 0;color:var(--silbergrau)', text: 'Anfrage und Aufmaßblatt werden am ' + U.datum(v.loeschenAm) + ' gelöscht (180 Tage nach dem Eingang).' })], 'a-hinweise'));
    /* Kunde */
    inhalt.push(U.karte('Kunde', v.bestaetigt ? 'Nummer per Code bestätigt' : 'Nummer nicht bestätigt', [
      anrufKnopf(k.tel, k.anzeige || k.tel, 'Kunde anrufen'),
      kv([['Name', k.name], ['E-Mail', k.mail ? h('a', { href: 'mailto:' + k.mail, text: k.mail }) : 'keine angegeben'], ['Erreichbar', k.erreich], ['Ort', (v.plz + ' ' + (k.ort || '')).trim()],
        ['Einwilligung', ew.zeit ? 'Fassung ' + (ew.fassung || '–') + ', ' + U.zeit(ew.zeit) + (ew.netz ? ', Netz ' + ew.netz : '') : '']]),
      ew.text ? h('details', { class: 'a-mehr' }, h('summary', { text: 'Wortlaut der Einwilligung' }), h('p', { class: 'a-hilfe', style: 'padding:0 0 14px;white-space:pre-wrap', text: ew.text })) : null]));
    /* Eckdaten und Aufmaßblatt */
    inhalt.push(U.karte('Eckdaten', v.aufmassZeichen ? 'Aufmaß im Blatt' : null, [kv(v.eckZeilen || []),
      h('div', { class: 'a-knoepfe', style: 'padding:10px 0 16px' }, v.pdf ? U.ring([U.icon('aussen'), ' Aufmaßblatt (PDF)'], { href: vpfad(v) + '/pdf', target: '_blank', rel: 'noopener', class: 'klein a-pdf' }) : h('p', { class: 'a-hilfe', text: 'Das Aufmaßblatt ist nicht mehr da.' }))]));
    /* Betriebe */
    const gesendet = (v.betriebe || []).filter((x) => x.gesendet).length;
    (v.betriebe || []).forEach((x) => inhalt.push(betriebKarte(v, x, gesendet, neuLaden)));
    inhalt.push(neuBetriebKarte(v, neuLaden));
    /* Stand und Notiz */
    const staende = h('div', { class: 'a-wahl', role: 'group', 'aria-label': 'Stand der Vermittlung' }, Object.keys(V_STAND).map((s) => h('button', { type: 'button', 'aria-pressed': String(v.stand === s), on: { click: async () => {
      try { neuLaden(await U.api('POST', vpfad(v) + '/stand', { stand: s }), 'Stand: ' + V_STAND[s]); } catch (e) { U.toast(e.message); } } } }, V_STAND[s])));
    inhalt.push(U.karte('Stand der Vermittlung', null, staende));
    const notiz = h('textarea', { rows: '4', maxlength: '4000', 'aria-label': 'Interne Notiz', placeholder: 'Nur für Sie: Absprachen, Rückrufe, Ergebnis …' }); notiz.value = v.notiz || '';
    inhalt.push(U.karte('Interne Notiz', 'sieht niemand außer Ihnen', [h('div', { class: 'a-flaeche' }, notiz), h('div', { class: 'a-knoepfe', style: 'padding:10px 0 16px' }, U.ring('Notiz speichern', { class: 'klein', on: { click: async () => { try { await U.api('POST', vpfad(v) + '/notiz', { text: notiz.value }); v.notiz = notiz.value; U.toast('Notiz gespeichert'); } catch (e) { U.toast(e.message); } } } }))]));
    inhalt.push(U.karte('Verlauf', null, h('ol', { class: 'a-verlauf' }, (v.verlauf || []).slice().reverse().map((x) => h('li', null, h('small', { text: U.zeit(x.zeit) + ' · ' + ({ kunde: 'Kunde', inhaber: 'Sie', system: 'System' }[x.von] || x.von) }), x.text)))));
    /* die eine Pille: der nächste Anruf (sonst der Kunde) */
    const naechster = (v.betriebe || []).find((x) => (x.status === 'offen' || x.status === 'nicht_erreicht') && x.tel);
    const pille = naechster ? U.pille('Anrufen: ' + naechster.name, { href: telHref(naechster.tel) }) : k.tel ? U.pille('Kunde anrufen', { href: telHref(k.tel) }) : null;
    const offen = v.offen || 0;
    seite({ band: h('p', { class: 'a-band-text', text: v.nr + ' · eingegangen ' + U.zeit(v.created_at) }), frage: U.frage((k.name || 'Ohne Namen') + ' aus ' + (k.ort || v.plz) + '. *' + (offen && V_OFFEN.indexOf(v.stand) >= 0 ? (offen === 1 ? 'Ein Anruf offen' : offen + ' Anrufe offen') : V_STAND[v.stand] || '') + '.*', null),
      inhalt: inhalt, fuss: pille ? [pille] : null, stehen: o.stehen });
  }
  function betriebKarte(v, x, gesendet, neuLaden) {
    const k = v.kunde || {}, art = x.gesendet ? 'aktiv' : x.status === 'will' ? 'aktiv' : x.status === 'nicht_erreicht' ? 'hinweis' : 'leise';
    const teile = [anrufKnopf(x.tel, x.tel, 'Betrieb anrufen'),
      kv([['Ort', [x.ort, x.km != null ? x.km + ' km' : ''].filter(Boolean).join(' · ')], ['Leistungen', (x.leistungen || []).join(', ')], ['Website', x.web ? h('a', { href: x.web, target: '_blank', rel: 'noopener noreferrer', text: x.web.replace(/^https?:\/\//, '').replace(/\/$/, '') }) : ''], ['Straße', x.strasse],
        ['Herkunft', x.quelle === 'inhaber' ? 'von Ihnen eingetragen' : x.gewaehlt ? 'vom Kunden gewählt' : ''], x.gesendet ? ['Aufmaß', 'geschickt am ' + U.zeit(x.gesendet.zeit) + ' an ' + x.gesendet.mail + ' (Zustimmung ' + U.zeit(x.gesendet.zustimmung) + ')'] : null])];
    /* Ergebnis des Anrufs */
    teile.push(h('div', { class: 'a-feld' }, h('span', { class: 'a-label', text: 'Ergebnis des Anrufs' }), U.segment([{ w: 'nicht_erreicht', t: 'Nicht erreicht' }, { w: 'will', t: 'Will' }, { w: 'will_nicht', t: 'Will nicht' }], x.status, async (w) => {
      try { neuLaden(await U.api('POST', vpfad(v) + '/betrieb', { bid: x.id, status: w }), x.name + ': ' + V_STATUS[w]); } catch (e) { U.toast(e.message); }
    }, 'Ergebnis des Anrufs bei ' + x.name)));
    const notiz = h('textarea', { rows: '2', maxlength: '1000', 'aria-label': 'Notiz zu ' + x.name, placeholder: 'z. B. Rückruf Montag ab 8 Uhr' }); notiz.value = x.notiz || '';
    notiz.addEventListener('change', async () => { try { await U.api('POST', vpfad(v) + '/betrieb', { bid: x.id, notiz: notiz.value }); x.notiz = notiz.value; U.toast('Notiz gespeichert'); } catch (e) { U.toast(e.message); } });
    teile.push(h('div', { class: 'a-feld a-notiz-betrieb' }, h('span', { class: 'a-label', text: 'Notiz' }), h('div', { class: 'a-flaeche' }, notiz)));
    /* Will: E-Mail, Häkchen der Zustimmung, Aufmaß schicken (höchstens drei Betriebe) */
    if (x.status === 'will' && !x.gesendet && gesendet >= 3) teile.push(h('p', { class: 'a-hilfe', style: 'padding:4px 0 16px', text: 'Das Aufmaß ging schon an drei Betriebe; mehr sind nicht erlaubt.' }));
    else if (x.status === 'will') {
      const mail = U.feld({ k: 'mail', label: 'E-Mail des Betriebs', typ: 'email', modus: 'email', wert: x.mail || '', platzhalter: 'info@betrieb.de', max: 120 });
      const zu = U.haken({ k: 'zustimmung', text: 'Hat im Gespräch zugestimmt, dass wir die Anfrage per Mail schicken', an: false });
      const kunde = k.mail ? U.haken({ text: 'Kunden per E-Mail sagen, dass ' + x.name + ' sein Aufmaß hat', an: true }) : null;
      const knopf = U.ring(x.gesendet ? 'Noch einmal schicken' : 'Aufmaß schicken', { class: 'a-senden' });
      const teil = h('div', { class: 'a-senden-teil' }, mail, zu, kunde, h('div', { class: 'a-knoepfe', style: 'padding:6px 0 16px' }, knopf));
      knopf.addEventListener('click', async () => {
        if (knopf.dataset.wartet) return;
        const f = {}, adr = mail.eingabe.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(adr)) f.mail = 'Bitte die E-Mail-Adresse des Betriebs eintragen.';
        if (!zu[0].eingabe.checked) f.zustimmung = 'Ohne Zustimmung im Gespräch geht keine Mail an den Betrieb.';
        const erstes = U.fehlerZeigen(teil, f); if (erstes) { U.zuFeld(erstes); return; }
        knopf.dataset.wartet = '1'; knopf.setAttribute('aria-disabled', 'true');
        try { neuLaden(await U.api('POST', vpfad(v) + '/senden', { bid: x.id, mail: adr, zustimmung: true, kunde: !!(kunde && kunde.eingabe.checked) }), 'Aufmaß an ' + x.name + ' geschickt'); }
        catch (e) { delete knopf.dataset.wartet; knopf.removeAttribute('aria-disabled'); if (e.daten && e.daten.felder) U.fehlerZeigen(teil, e.daten.felder); U.toast(e.message); }
      });
      teile.push(teil);
    }
    return U.karte(x.name, U.chip(x.gesendet ? 'Aufmaß geschickt' : V_STATUS[x.status] || x.status, art), teile, { class: 'a-karte a-betrieb', 'data-bid': x.id });
  }
  /* Weiteren Betrieb eintragen (selbst gefunden oder vom Kunden genannt) */
  function neuBetriebKarte(v, neuLaden) {
    const name = U.feld({ k: 'name', label: 'Name des Betriebs', platzhalter: 'Tischlerei Muster', max: 80 });
    const ort = U.feld({ k: 'ort', label: 'Ort', optional: true, platzhalter: 'Gütersloh', max: 60 });
    const tel = U.feld({ k: 'tel', label: 'Telefon', typ: 'tel', modus: 'tel', optional: true, platzhalter: '05241 123456', max: 40 });
    const web = U.feld({ k: 'web', label: 'Website', typ: 'url', modus: 'url', optional: true, platzhalter: 'www.betrieb.de', max: 200 });
    const knopf = U.ring('Betrieb eintragen', { class: 'klein' });
    const bereich = h('div', null, name, ort, tel, web, h('div', { class: 'a-knoepfe', style: 'padding:6px 0 16px' }, knopf));
    knopf.addEventListener('click', async () => {
      if (knopf.dataset.wartet) return;
      if (name.eingabe.value.trim().length < 2) { U.fehlerSetzen(name, 'Bitte den Namen des Betriebs eintragen.'); name.eingabe.focus(); return; }
      knopf.dataset.wartet = '1';
      try { neuLaden(await U.api('POST', vpfad(v) + '/betrieb-neu', { name: name.eingabe.value, ort: ort.eingabe.value, tel: tel.eingabe.value, web: web.eingabe.value }), 'Betrieb eingetragen'); }
      catch (e) { delete knopf.dataset.wartet; if (e.daten && e.daten.felder) U.zuFeld(U.fehlerZeigen(bereich, e.daten.felder)); else U.toast(e.message); }
    });
    return U.karte(null, null, h('details', { class: 'a-mehr a-neu-betrieb' }, h('summary', { text: 'Weiteren Betrieb eintragen' }), bereich));
  }

  /* ---------- Weiche ---------- */
  async function route() {
    if (!S.stand || !S.stand.angemeldet) { anmeldung(); return; }
    const mv = /^#vermittlung\/([0-9a-z-]{8,})$/i.exec(location.hash);
    if (mv) {
      try { vermittlungZeigen(await vermittlungLaden(mv[1])); } catch (e) { if (e.status === 401) { S.stand.angemeldet = false; anmeldung(); return; } U.toast(e.message); location.hash = '#vermittlung'; }
      return;
    }
    if (location.hash === '#vermittlung') {
      try { await vermittlungenLaden(); } catch (e) { if (e.status === 401) { S.stand.angemeldet = false; anmeldung(); return; } S.vliste = S.vliste || []; U.toast(e.message); }
      vermittlungen();
      return;
    }
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

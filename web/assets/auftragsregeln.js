/* eeziframes · Regeln der Aufträge (Bestellung einer Landingpage mit Konfigurator in einem der Pakete aus pakete.js)
   Eine Stelle für Browser (window.Auftrag: /bestellen/, /konto/, /zentrale/) und Server (globalThis.Auftrag, functions/auftrag/):
   Stationen der Bestellung je Paket, Felder mit Grenzen und Prüfung, Plätze für Dateien, Stand eines Auftrags und seine Übergänge,
   was ein Paket auf der Landingpage veränderbar macht. Merkmale und Preise kommen nur aus pakete.js (Pakete.merkmale, Pakete.preis);
   hier wird nie ein Paketname verglichen.
   Was veränderbar ist, folgt den Vorlagen der Pakete (docs/profis/{essential,plus,signature}-vorschau/, Beispiel Fensterbau Brandt):
   alle Pakete Name, Ort, Ansprechperson, Kontakt und Anschrift; ab eigener Gestaltung Logo, Farben, Porträt, Überschrift, Einleitung,
   Leistungen, sechs Fotos (Bühne und fünf Kacheln); mit Einladungslinks der Einladungstext, mit Dashboard die Zugänge des Teams.
   API: STAND, STAND_TITEL, LEISTE, uebergang(von, nach), stationen(paket), FOTO_PLAETZE, PLAETZE, GRENZEN, leer(), betrieb(d, m, weg),
        adresse(d, m), auftritt(d, m), zustimmung(d, stand), pruefen(angaben, m, teile, weg), offen(angaben, m, weg), unteradresse(s),
        unteradresseVon(host), vorschlag(firma), domain(s), farbe(s), anpassbar(paket), naechstes(paket), verkauf({ offen, live, bereit }),
        mailOk(s), telOk(s) */
(function (root) {
  'use strict';
  const P = () => root.Pakete;

  /* ---------- Stand eines Auftrags ----------
     entwurf: der Kunde füllt aus · angefragt: unverbindlich angefragt (Kasse noch zu) · bezahlt: Einrichtung bezahlt, Auftrag im Eingang
     in_arbeit: der Inhaber baut die Seite · vorschau: Link zur Vorschau, der Kunde gibt frei oder wünscht Änderungen · live: Seite und
     Konfigurator laufen, das Monatsabo läuft · pausiert, beendet, storniert */
  const STAND = ['entwurf', 'angefragt', 'bezahlt', 'in_arbeit', 'vorschau', 'live', 'pausiert', 'beendet', 'storniert'];
  const STAND_TITEL = { entwurf: 'Entwurf', angefragt: 'Angefragt', bezahlt: 'Bestellt', in_arbeit: 'In Arbeit', vorschau: 'Vorschau', live: 'Live', pausiert: 'Pausiert', beendet: 'Beendet', storniert: 'Storniert' };
  /* Die vier Stationen im Kundenbereich und in der Zentrale */
  const LEISTE = [{ stand: 'bezahlt', titel: 'Bestellt' }, { stand: 'in_arbeit', titel: 'In Arbeit' }, { stand: 'vorschau', titel: 'Vorschau' }, { stand: 'live', titel: 'Live' }];
  /* wer: kunde, inhaber, system (Zahlung, Tageslauf) */
  const UEBERGAENGE = {
    entwurf: { angefragt: ['kunde'], bezahlt: ['system'], storniert: ['kunde', 'system'] },
    angefragt: { bezahlt: ['system'], entwurf: ['kunde', 'inhaber'], storniert: ['kunde', 'inhaber', 'system'] },
    bezahlt: { in_arbeit: ['inhaber'], storniert: ['inhaber', 'kunde'] },
    in_arbeit: { vorschau: ['inhaber'], storniert: ['inhaber'] },
    vorschau: { in_arbeit: ['inhaber', 'kunde'], live: ['inhaber'], storniert: ['inhaber'] },
    live: { pausiert: ['inhaber', 'system'], beendet: ['inhaber', 'system'] },
    pausiert: { live: ['inhaber', 'system'], beendet: ['inhaber', 'system'] },
    beendet: {}, storniert: {}
  };
  const uebergang = (von, nach, wer) => { const u = (UEBERGAENGE[von] || {})[nach]; return !!u && (!wer || u.indexOf(wer) >= 0); };

  /* ---------- Grenzen ---------- */
  const GRENZEN = {
    firma: 100, name: 60, ort: 60, region: 80, strasse: 100, mail: 120, tel: 40, web: 200, ap: 80, rolle: 60, erreichbar: 200,
    rechtsform: 60, vertretung: 200, register: 120, kammer: 120, beruf: 120, rueckruf: 120,
    domains: 3, eingang: 3, farben: 3,
    ueberschrift: 60, einleitung: 220, leistungTitel: 80, leistungText: 260, einladung: 320, notiz: 1500,
    dateiBytes: 4000000, logoBytes: 2000000, dateienJeAuftrag: 16, nachricht: 2000, offeneEntwuerfe: 3
  };

  /* ---------- Plätze für Dateien ----------
     Fotos wie in den Vorlagen: die Bühne oben und fünf Kacheln im Raster (pakete.js: fotos = 6). Porträt der Ansprechperson und Logo
     nur mit eigener Gestaltung (Essential zeigt Initialen und den Namen als Text). „weitere“: was der Kunde sonst schicken will. */
  const FOTO_PLAETZE = [
    { k: 'buehne', titel: 'Bühne', hilfe: 'Das große Bild oben: ein Fenster im Licht, Ihre Ausstellung oder ein fertiges Projekt' },
    { k: 'werkstatt', titel: 'Werkstatt', hilfe: 'Fertigung oder Lager' },
    { k: 'montage', titel: 'Montage', hilfe: 'Ihr Team beim Einbau' },
    { k: 'team', titel: 'Team', hilfe: 'Die Menschen, die beim Kunden klingeln' },
    { k: 'ausstellung', titel: 'Ausstellung', hilfe: 'Ihr Ausstellungsraum oder Muster' },
    { k: 'referenz', titel: 'Referenz', hilfe: 'Ein Haus oder eine Straße mit Ihren Fenstern' }
  ];
  const BILD = ['image/jpeg', 'image/png', 'image/webp'];
  const PLAETZE = {
    logo: { titel: 'Logo', typen: BILD.concat(['image/svg+xml', 'application/pdf']), max: GRENZEN.logoBytes, mehrere: false },
    portrait: { titel: 'Porträt', typen: BILD, max: GRENZEN.dateiBytes, mehrere: false },
    weitere: { titel: 'Weitere Dateien', typen: BILD.concat(['application/pdf']), max: GRENZEN.dateiBytes, mehrere: true }
  };
  FOTO_PLAETZE.forEach((f) => { PLAETZE[f.k] = { titel: f.titel, typen: BILD, max: GRENZEN.dateiBytes, mehrere: false, foto: true }; });

  /* ---------- Werkzeuge ---------- */
  const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
  const lang = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, n);
  const mailOk = (m) => /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(String(m || '')) && !/\.(invalid|example)$/i.test(String(m || ''));
  const telOk = (t) => String(t || '').replace(/\D/g, '').length >= 6;
  const ergebnis = (wert, fehler) => ({ ok: !Object.keys(fehler).length, wert: wert, fehler: fehler });
  const zuLang = (d, k, f) => { if (String(d[k] == null ? '' : d[k]).length > GRENZEN[k]) f[k] = 'Höchstens ' + GRENZEN[k] + ' Zeichen.'; };
  function webAdresse(s) {
    const t = String(s || '').trim(); if (!t) return '';
    try { const u = new URL(/^https?:\/\//i.test(t) ? t : 'https://' + t); return /^https?:$/.test(u.protocol) && /\.[a-z]{2,}$/i.test(u.hostname) ? u.href.slice(0, GRENZEN.web) : null; } catch (e) { return null; }
  }

  /* ---------- Adressen ----------
     Essential läuft unter <name>.eeziframes.com (pakete.js: domain false); ab Plus unter einer eigenen Domain, die der Inhaber kauft. */
  const BASIS = 'eeziframes.com';
  /* Namen, die nie ein Kunde bekommt (eigene Dienste, Verwechslungsgefahr); demo-* gehört den Beispielen */
  const RESERVIERT = ['www', 'app', 'api', 'admin', 'zentrale', 'inhaber', 'konto', 'kunde', 'kunden', 'bestellen', 'partner', 'betrieb', 'mail', 'post', 'smtp', 'imap',
    'pop', 'ftp', 'cdn', 'static', 'assets', 'status', 'hilfe', 'support', 'blog', 'shop', 'test', 'dev', 'staging', 'vorschau', 'beispiel', 'eeziframes', 'eezi',
    'login', 'anmelden', 'dashboard', 'info', 'kontakt', 'presse', 'news', 'docs', 'rechnung', 'rechnungen', 'konfigurator', 'fenster', 'fensterbau'];
  function unteradresse(s) {
    let t = String(s == null ? '' : s).trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/[/?#].*$/, '').replace(/\.eeziframes\.com\.?$/, '');
    t = t.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[\s_.&+]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!t) return { ok: false, name: '', host: '', fehler: 'Bitte einen Namen wie fensterbau-mustermann eingeben.' };
    if (t.length < 3) return { ok: false, name: t, host: '', fehler: 'Bitte mindestens 3 Zeichen.' };
    if (t.length > 40) return { ok: false, name: t.slice(0, 40), host: '', fehler: 'Höchstens 40 Zeichen.' };
    if (/^demo-|^xn--/.test(t) || RESERVIERT.indexOf(t) >= 0) return { ok: false, name: t, host: '', fehler: t + ' ist reserviert. Bitte einen anderen Namen wählen.' };
    return { ok: true, name: t, host: t + '.' + BASIS, fehler: '' };
  }
  /* Name eines Hosts unter eeziframes.com, wenn er als Adresse eines Kunden in Frage kommt ('' sonst) */
  const unteradresseVon = (host) => { const m = /^([a-z0-9-]+)\.eeziframes\.com$/.exec(String(host || '').toLowerCase()); if (!m) return ''; const r = unteradresse(m[1]); return r.ok && r.name === m[1] ? r.name : ''; };
  /* Vorschlag aus dem Firmennamen: ohne Rechtsform, Umlaute ausgeschrieben */
  function vorschlag(firma) {
    const t = String(firma || '').toLowerCase().replace(/\b(gmbh\s*&\s*co\.?\s*kg|gmbh|mbh|ug|haftungsbeschränkt|kg|ohg|gbr|ag|e\.\s?k\.?|e\.\s?v\.?|inh\.?|inhaber(in)?)(?=\s|$|[.,)])/g, ' ').replace(/[()]/g, ' ');
    const r = unteradresse(t); return r.ok ? r.name : '';
  }
  const DOMAIN = /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(xn--[a-z0-9-]{2,59}|[a-z]{2,24})$/;
  function domain(s) {
    let t = String(s == null ? '' : s).trim().toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, '').replace(/[/?#].*$/, '').replace(/:\d*$/, '').replace(/\.$/, '');
    if (!t) return { ok: false, host: '', fehler: 'Bitte eine Domain wie fenster-mustermann.de eingeben.' };
    if (/[\s@]/.test(t)) return { ok: false, host: t, fehler: t + ' ist keine Domain.' };
    try { t = new URL('https://' + t).hostname; } catch (e) { return { ok: false, host: t, fehler: t + ' ist keine Domain.' }; }
    t = t.replace(/^www\./, '');
    if (!DOMAIN.test(t)) return { ok: false, host: t, fehler: t + ' ist keine gültige Domain.' };
    if (/(^|\.)eeziframes\.(com|de)$/.test(t)) return { ok: false, host: t, fehler: 'Adressen von eeziframes gibt es im Paket Essential; hier bitte Ihre eigene Domain.' };
    if (/(^|\.)(workers\.dev|pages\.dev|localhost|invalid|example|test)$/.test(t)) return { ok: false, host: t, fehler: t + ' ist keine öffentliche Domain.' };
    return { ok: true, host: t, fehler: '' };
  }
  const farbe = (s) => { const h = String(s || '').trim().toLowerCase(); return /^#[0-9a-f]{6}$/.test(h) ? h : ''; };

  /* ---------- Bundesländer (Impressum, Aufsichtsbehörde im Datenschutz) ---------- */
  const BUNDESLAENDER = {
    BW: 'Baden-Württemberg', BY: 'Bayern', BE: 'Berlin', BB: 'Brandenburg', HB: 'Bremen', HH: 'Hamburg', HE: 'Hessen', MV: 'Mecklenburg-Vorpommern',
    NI: 'Niedersachsen', NW: 'Nordrhein-Westfalen', RP: 'Rheinland-Pfalz', SL: 'Saarland', SN: 'Sachsen', ST: 'Sachsen-Anhalt', SH: 'Schleswig-Holstein', TH: 'Thüringen'
  };

  /* ---------- Leere Angaben (Formular und neuer Auftrag) ---------- */
  const leer = () => ({
    betrieb: { firma: '', name: '', ort: '', region: '', strasse: '', plz: '', bundesland: '', tel: '', mail: '', web: '', ap: '', rolle: '', erreichbar: '', rechtsform: '', vertretung: '', register: '', ust: '', kammer: '', beruf: '', rueckruf: '' },
    adresse: { name: '', art: 'neu', domains: ['', '', ''], vorschlaege: false, eingang: ['', '', ''], team: [''] },
    auftritt: { farben: [''], farbenWebsite: false, ausWebsite: false, ueberschrift: '', einleitung: '', leistungTitel: '', leistungText: '', einladung: '', notiz: '' }
  });

  /* ---------- Prüfung je Teil: (daten) → { ok, wert (bereinigt), fehler: { feld: 'Satz' } } ---------- */
  /* weg 'schnell': Rechtsform, Vertretung und Bundesland klären wir im Telefonat (Gremium der Fensterbauer, 27.10.2026) */
  function betrieb(d, m, weg) {
    d = d && typeof d === 'object' ? d : {};
    const schnell = weg === 'schnell';
    const w = {
      firma: kurz(d.firma, GRENZEN.firma), name: kurz(d.name, GRENZEN.name), ort: kurz(d.ort, GRENZEN.ort), region: kurz(d.region, GRENZEN.region),
      strasse: kurz(d.strasse, GRENZEN.strasse), plz: String(d.plz || '').replace(/\s/g, '').slice(0, 5), bundesland: Object.prototype.hasOwnProperty.call(BUNDESLAENDER, d.bundesland) ? d.bundesland : '',
      tel: kurz(d.tel, GRENZEN.tel), mail: kurz(d.mail, GRENZEN.mail).toLowerCase(), web: webAdresse(d.web), ap: kurz(d.ap, GRENZEN.ap), rolle: kurz(d.rolle, GRENZEN.rolle),
      erreichbar: kurz(d.erreichbar, GRENZEN.erreichbar), rechtsform: kurz(d.rechtsform, GRENZEN.rechtsform), vertretung: kurz(d.vertretung, GRENZEN.vertretung),
      register: kurz(d.register, GRENZEN.register), ust: String(d.ust || '').replace(/\s/g, '').toUpperCase().slice(0, 11), kammer: kurz(d.kammer, GRENZEN.kammer), beruf: kurz(d.beruf, GRENZEN.beruf),
      rueckruf: kurz(d.rueckruf, GRENZEN.rueckruf)
    };
    const f = {};
    if (w.firma.length < 2) f.firma = 'Bitte den Namen des Unternehmens eingeben, wie er auf Ihren Rechnungen steht.';
    if (w.name.length < 2) f.name = 'Bitte den Namen nennen, der auf Ihrer Seite stehen soll.';
    if (w.ort.length < 2) f.ort = 'Bitte den Ort nennen, für den Sie werben.';
    if (w.strasse.length < 3) f.strasse = 'Bitte Straße und Hausnummer eingeben.';
    if (!/^\d{5}$/.test(w.plz)) f.plz = 'Bitte eine fünfstellige Postleitzahl eingeben.';
    if (!w.bundesland && !schnell) f.bundesland = 'Bitte das Bundesland wählen.';
    if (!telOk(w.tel)) f.tel = 'Bitte eine Telefonnummer mit mindestens 6 Ziffern eingeben.';
    if (!mailOk(w.mail)) f.mail = 'Bitte die E-Mail-Adresse nennen, unter der Ihre Kunden Sie erreichen.';
    if (w.web === null) { f.web = 'Diese Adresse lässt sich nicht öffnen.'; w.web = ''; }
    if (w.ap.length < 2) f.ap = 'Bitte die Ansprechperson nennen, die auf der Seite steht.';
    if (!w.rechtsform && !schnell) f.rechtsform = 'Bitte die Rechtsform angeben (z. B. GmbH, Einzelunternehmen).';
    if (w.vertretung.length < 2 && !schnell) f.vertretung = 'Bitte angeben, wer das Unternehmen vertritt.';
    if (w.ust && !/^DE\d{9}$/.test(w.ust)) f.ust = 'Die USt-IdNr. beginnt mit DE und hat 9 Ziffern.';
    ['firma', 'name', 'ort', 'region', 'erreichbar', 'vertretung'].forEach((k) => zuLang(d, k, f));
    return ergebnis(w, f);
  }
  /* m: Merkmale des Pakets (Pakete.merkmale) */
  function adresse(d, m) {
    d = d && typeof d === 'object' ? d : {}; m = m || {};
    const f = {}, w = { name: '', art: 'neu', domains: [], vorschlaege: false, eingang: [], team: [] };
    if (m.domain) {
      (Array.isArray(d.domains) ? d.domains : []).slice(0, GRENZEN.domains + 2).forEach((s, i) => {
        if (!String(s || '').trim()) return;
        const r = domain(s); if (!r.ok) f['domains.' + i] = r.fehler; else if (w.domains.indexOf(r.host) < 0) w.domains.push(r.host);
      });
      /* art: neu = wir registrieren eine Domain nach Wunsch (Paketbedingungen § 6 Abs. 1); eigene = eine Domain, die dem Kunden schon
         gehört, binden wir nach Absprache an (§ 6 Abs. 3), dann genau eine Adresse und keine Vorschläge */
      w.art = d.art === 'eigene' ? 'eigene' : 'neu';
      w.domains = w.domains.slice(0, w.art === 'eigene' ? 1 : GRENZEN.domains); w.vorschlaege = w.art === 'neu' && !!d.vorschlaege;
      if (!w.domains.length && !w.vorschlaege && !Object.keys(f).length) f.domains = w.art === 'eigene' ? 'Bitte Ihre Domain oder die gewünschte Unteradresse nennen, z. B. fenster.ihre-firma.de.' : 'Bitte eine Wunsch-Domain nennen oder „Schlagen Sie mir Namen vor“ wählen.';
    } else {
      const r = unteradresse(d.name); w.name = r.name;
      if (!r.ok) f.name = r.fehler;
    }
    const liste = (v, max, feld) => { const out = []; (Array.isArray(v) ? v : []).slice(0, max + 2).forEach((x, i) => { const a = String(x || '').trim().toLowerCase(); if (!a) return; if (!mailOk(a)) f[feld + '.' + i] = 'Bitte eine gültige E-Mail-Adresse eingeben.'; else if (out.indexOf(a) < 0) out.push(a); }); return out.slice(0, max); };
    w.eingang = liste(d.eingang, GRENZEN.eingang, 'eingang');
    if (!w.eingang.length && !Object.keys(f).some((k) => /^eingang\./.test(k))) f.eingang = 'Bitte mindestens eine Adresse für die Anfragen Ihrer Kunden nennen.';
    if (m.dashboard) w.team = liste(d.team, Number(m.zugaenge) || 0, 'team');
    return ergebnis(w, f);
  }
  function auftritt(d, m) {
    d = d && typeof d === 'object' ? d : {}; m = m || {};
    const f = {}, farben = [];
    (Array.isArray(d.farben) ? d.farben : []).forEach((c, i) => { const s = String(c || '').trim(); if (!s) return; const h = farbe(s); if (!h) f['farben.' + i] = 'Bitte eine Farbe als #rrggbb angeben.'; else if (farben.indexOf(h) < 0) farben.push(h); });
    const w = { farben: farben.slice(0, GRENZEN.farben), farbenWebsite: !!d.farbenWebsite, ausWebsite: !!d.ausWebsite, ueberschrift: kurz(d.ueberschrift, GRENZEN.ueberschrift), einleitung: lang(d.einleitung, GRENZEN.einleitung),
      leistungTitel: kurz(d.leistungTitel, GRENZEN.leistungTitel), leistungText: lang(d.leistungText, GRENZEN.leistungText), einladung: m.einladungslinks ? lang(d.einladung, GRENZEN.einladung) : '', notiz: lang(d.notiz, GRENZEN.notiz) };
    ['ueberschrift', 'einleitung', 'leistungTitel', 'leistungText', 'einladung', 'notiz'].forEach((k) => zuLang(d, k, f));
    return ergebnis(w, f);
  }
  /* Häkchen vor „Kostenpflichtig bestellen“: Unternehmer (§ 14 BGB), Paketbedingungen in der Fassung stand, AV-Vertrag */
  function zustimmung(d, stand) {
    d = d && typeof d === 'object' ? d : {};
    const f = {};
    if (d.unternehmer !== true) f.unternehmer = 'Bitte bestätigen, dass Sie als Unternehmer bestellen.';
    if (d.agb !== stand) f.agb = 'Bitte den Paketbedingungen in der aktuellen Fassung zustimmen.';
    if (d.avv !== true) f.avv = 'Bitte dem Vertrag zur Auftragsverarbeitung zustimmen.';
    return ergebnis({ unternehmer: d.unternehmer === true, agb: d.agb === stand ? stand : '', avv: d.avv === true }, f);
  }

  /* ---------- Stationen der Bestellung je Paket ----------
     Ohne eigene Gestaltung (Essential) entfällt „Auftritt“: Die Seite steht im eeziframes-Design mit Namen, Ort und Ansprechperson. */
  const gestaltet = (m) => !!(m && (m.logo || m.farbe || m.fotos || m.startansicht));
  function stationen(paket) {
    const m = P().merkmale(paket) || {}, l = [{ k: 'paket', t: 'Paket' }, { k: 'konto', t: 'Konto' }, { k: 'betrieb', t: 'Ihr Betrieb' }, { k: 'adresse', t: 'Adresse' }];
    if (gestaltet(m)) l.push({ k: 'auftritt', t: 'Auftritt' });
    l.push({ k: 'bestellen', t: 'Bestellen' });
    return l;
  }
  /* Ganze Angaben prüfen; teile: nur diese Teile (sonst alle, die das Paket hat); weg: 'schnell' fragt im Betrieb weniger (betrieb) */
  function pruefen(angaben, m, teile, weg) {
    angaben = angaben || {};
    const t = teile || ['betrieb', 'adresse'].concat(gestaltet(m) ? ['auftritt'] : []);
    const fn = { betrieb: betrieb, adresse: adresse, auftritt: auftritt }, fehler = {}, wert = {};
    t.forEach((k) => { const r = fn[k](angaben[k], m, k === 'betrieb' ? weg : undefined); wert[k] = r.wert; Object.keys(r.fehler).forEach((x) => { fehler[k + '.' + x] = r.fehler[x]; }); });
    return ergebnis(wert, fehler);
  }
  /* Erster Teil mit Lücken ('' wenn alles da ist) */
  function offen(angaben, m, weg) {
    const t = ['betrieb', 'adresse'];
    for (let i = 0; i < t.length; i++) if (!pruefen(angaben, m, [t[i]], weg).ok) return t[i];
    return '';
  }

  /* ---------- Was ein Paket auf der Landingpage veränderbar macht ----------
     Für Kundenbereich (frei, gesperrt mit dem Paket, in dem es dazukommt) und für die Anreize in der Bestellung. */
  const ANPASSBAR = [
    { k: 'name', titel: 'Name, Ort und Ansprechperson', text: 'stehen oben und im Kontakt', hat: () => true },
    { k: 'adresse', titel: 'Adresse', text: (m) => (m.domain ? 'Ihre eigene Domain' : 'Ihr Name unter eeziframes.com'), hat: () => true },
    { k: 'domain', titel: 'Eigene Domain', text: 'z. B. fenster-mustermann.de statt …eeziframes.com', hat: (m) => !!m.domain },
    { k: 'logo', titel: 'Ihr Logo', text: 'im Kopf der Seite und im Aufmaßblatt', hat: (m) => !!m.logo },
    { k: 'farben', titel: 'Ihre Farben', text: (m) => (m.farbwelt === 'voll' ? 'die ganze Seite in Ihren Farben' : 'zur Hälfte in Ihren Farben'), hat: (m) => !!m.farbe },
    { k: 'fotos', titel: 'Fotos Ihres Betriebs', text: (m) => 'ein großes Bild oben, ' + Math.max(0, (Number(m.fotos) || 6) - 1) + ' kleinere darunter', hat: (m) => (Number(m.fotos) || 0) > 0 },
    { k: 'portrait', titel: 'Porträt der Ansprechperson', text: 'statt der Initialen', hat: (m) => !!m.startansicht },
    { k: 'texte', titel: 'Ihre Texte', text: 'Überschrift, Einleitung, Leistungen', hat: (m) => !!m.startansicht },
    { k: 'suche', titel: 'In Suchmaschinen', text: 'Ihre Startseite wird gefunden', hat: (m) => m.indexierung === 'start' },
    { k: 'einladung', titel: 'Persönliche Einladungen', text: 'Ihre Kunden planen unter ihrem Namen, mit Ihrem Einladungstext', hat: (m) => !!m.einladungslinks },
    { k: 'team', titel: 'Dashboard für Ihr Team', text: (m) => 'bis zu ' + (Number(m.zugaenge) || 5) + ' Zugänge, Fortschritt Ihrer Kunden', hat: (m) => !!m.dashboard },
    { k: 'ohneHinweis', titel: 'Ohne Hinweis auf eeziframes', text: 'auch im Aufmaßblatt', hat: (m) => m.kennzeichnung === 'keine' }
  ];
  /* [{ k, titel, text, frei, ab }]: ab = Paket, in dem es dazukommt ('' wenn frei) */
  function anpassbar(paket) {
    const liste = P().LISTE, m = P().merkmale(paket) || {};
    return ANPASSBAR.filter((a) => a.k !== 'adresse').map((a) => {
      const frei = !!a.hat(m), ab = frei ? '' : (liste.find((p) => a.hat(P().merkmale(p) || {})) || '');
      const mt = frei ? m : (P().merkmale(ab) || m);
      return { k: a.k, titel: a.titel, text: typeof a.text === 'function' ? a.text(mt) : a.text, frei: frei, ab: ab };
    });
  }
  /* Nächstes Paket über diesem und was es dazubringt (für den Anreiz). einrichtung: was beim Wechsel einmalig dazukommt, nie weniger als 0
     (ist die Einrichtung des größeren Pakets günstiger, erstatten wir nichts, Paketbedingungen § 7 Abs. 3) */
  function naechstes(paket) {
    const l = P().LISTE, i = l.indexOf(paket); if (i < 0 || i >= l.length - 1) return null;
    const p = l[i + 1], vorher = anpassbar(paket), dazu = anpassbar(p).filter((a) => { const v = vorher.find((x) => x.k === a.k) || {}; return a.frei && (!v.frei || v.text !== a.text); });
    return { paket: p, name: P().PAKETE[p].name, monat: P().preis(p).monat - P().preis(paket).monat, einrichtung: Math.max(0, P().preis(p).einrichtung - P().preis(paket).einrichtung), dazu: dazu };
  }

  /* ---------- Verkauf: Kasse offen? ----------
     offen: Variable PAKETE_OFFEN; live: Stripe im Live-Modus; bereit: Paketbedingungen ohne Platzhalter, Mail, Steuer (recht.js).
     Im Test- und Attrappenmodus ist die Kasse offen, damit sich alles prüfen lässt; mit echtem Geld erst mit offen und bereit. */
  const verkauf = (o) => { o = o || {}; const offen = !!o.offen; return { offen: offen, vorlaeufig: !!(P() && P().VORLAEUFIG), kasse: !o.live || (offen && o.bereit !== false) }; };

  const A = {
    STAND: STAND, STAND_TITEL: STAND_TITEL, LEISTE: LEISTE, UEBERGAENGE: UEBERGAENGE, GRENZEN: GRENZEN, FOTO_PLAETZE: FOTO_PLAETZE, PLAETZE: PLAETZE,
    BUNDESLAENDER: BUNDESLAENDER, RESERVIERT: RESERVIERT, BASIS: BASIS,
    uebergang: uebergang, stationen: stationen, gestaltet: gestaltet, leer: leer, betrieb: betrieb, adresse: adresse, auftritt: auftritt, zustimmung: zustimmung,
    pruefen: pruefen, offen: offen, unteradresse: unteradresse, unteradresseVon: unteradresseVon, vorschlag: vorschlag, domain: domain, farbe: farbe,
    anpassbar: anpassbar, naechstes: naechstes, verkauf: verkauf, mailOk: mailOk, telOk: telOk, webAdresse: webAdresse
  };
  const frieren = (o) => { Object.keys(o).forEach((k) => { if (o[k] && typeof o[k] === 'object') frieren(o[k]); }); return Object.freeze(o); };
  frieren(STAND); frieren(STAND_TITEL); frieren(LEISTE); frieren(UEBERGAENGE); frieren(GRENZEN); frieren(FOTO_PLAETZE); frieren(PLAETZE); frieren(BUNDESLAENDER); frieren(RESERVIERT);
  root.Auftrag = A;
  if (typeof module === 'object' && module.exports) module.exports = A;
})(typeof globalThis !== 'undefined' ? globalThis : this);

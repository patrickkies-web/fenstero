/* eeziframes · Regeln der Konfigurator-Instanzen: Zustände, Übergänge, Fristen und Grenzen, Feldregeln der Bestellung
   Die einzige Stelle dafür (Bauplan §2.7, §2.8; docs/INSTANZEN.md). Läuft im Browser (window.Instanzregeln: Kundenkonto /partner/,
   Zentrale) und auf dem Server (globalThis.Instanzregeln, wie modell.js). Merkmale je Paket stehen in pakete.js, nicht hier.
   API:
     darf(status, bereich, { vorschau, feld })   einzige Abfrage der Status-Matrix (MATRIX)
     seite(status, { vorschau })                 Antwort auf die Startseite: { code: 200|503|410, art }
     anfrageArt(status, { vorschau })            'website' | 'test' | null (Endkunde darf nicht senden)
     FRISTEN, GRENZEN                            Vorschläge bis zur Antwort des Inhabers (Bauplan §5.3)
     bestellung.*                                Statusleiste, Übergänge, Feldregeln des Bestellformulars (Browser = Server)
     instanz.*                                   Übergänge der Instanz, Status zur Bestellung
     verkauf({ offen, live, bereit })            Verkaufsseite und Paket-Kasse (Variable PAKETE_OFFEN)
     host(s, o), farbe(hex), akzent(hex), kontrast(a, b), BUNDESLAENDER */
(function (root) {
  'use strict';
  const frieren = (o) => { Object.keys(o).forEach((k) => { if (o[k] && typeof o[k] === 'object') frieren(o[k]); }); return Object.freeze(o); };

  /* ---------- Status der Instanz und was darin offen ist (§2.7) ---------- */
  const STATUS = ['einrichtung', 'aktiv', 'pausiert', 'beendet'];
  /* Bereiche: seite (/), recht (Impressum, Datenschutz), schreiben (Endkunde: start, entwurf, foto, aufmass, fortschritt), link (Link
     lesen), ki, dashboardLesen, dashboardSchreiben, einladen, export.
     Zellen: true | false | Liste der erlaubten Felder (nur diese dürfen geschrieben werden). Zeile 'vorschau' = einrichtung mit
     gültigem Vorschau-Cookie (__Host-vorschau). */
  const BEREICHE = ['seite', 'recht', 'schreiben', 'link', 'ki', 'dashboardLesen', 'dashboardSchreiben', 'einladen', 'export'];
  const ZEILEN = ['einrichtung', 'vorschau', 'aktiv', 'pausiert', 'beendet'];
  const MATRIX = {
    einrichtung: { seite: false, recht: true, schreiben: false, link: false, ki: false, dashboardLesen: true, dashboardSchreiben: ['profil'], einladen: false, export: true },
    vorschau: { seite: true, recht: true, schreiben: true, link: true, ki: true, dashboardLesen: true, dashboardSchreiben: ['profil'], einladen: false, export: true },
    aktiv: { seite: true, recht: true, schreiben: true, link: true, ki: true, dashboardLesen: true, dashboardSchreiben: true, einladen: true, export: true },
    pausiert: { seite: false, recht: true, schreiben: false, link: false, ki: false, dashboardLesen: true, dashboardSchreiben: ['klaer', 'stage', 'memo', 'seen'], einladen: false, export: true },
    beendet: { seite: false, recht: true, schreiben: false, link: false, ki: false, dashboardLesen: false, dashboardSchreiben: false, einladen: false, export: true }
  };
  /* Startseite je Zeile: 200 (vorschau mit Band „Vorschau“), 503 neutral „in Vorbereitung“, 503 mit Name und Kontakt, 410 neutral */
  const SEITE = {
    einrichtung: { code: 503, art: 'vorbereitung' },
    vorschau: { code: 200, art: 'vorschau' },
    aktiv: { code: 200, art: '' },
    pausiert: { code: 503, art: 'pausiert' },
    beendet: { code: 410, art: 'beendet' }
  };
  const zeile = (status, o) => (status === 'einrichtung' && o && o.vorschau ? 'vorschau' : STATUS.indexOf(status) >= 0 ? status : '');
  /* Die einzige Abfrage der Matrix; unbekannter Status oder Bereich: nein. Felder-Zellen: nur mit o.feld aus der Liste ja */
  function darf(status, bereich, o) {
    const z = MATRIX[zeile(status, o)]; if (!z || !Object.prototype.hasOwnProperty.call(z, bereich)) return false;
    const c = z[bereich];
    if (Array.isArray(c)) return !!(o && o.feld) && (Array.isArray(o.feld) ? o.feld.length > 0 && o.feld.every((f) => c.indexOf(f) >= 0) : c.indexOf(o.feld) >= 0);
    return c === true;
  }
  /* Welche Felder in diesem Zustand geschrieben werden dürfen: null = alle, [] = keine, sonst die Liste */
  function felder(status, bereich, o) {
    const z = MATRIX[zeile(status, o)]; const c = z ? z[bereich] : false;
    return c === true ? null : Array.isArray(c) ? c.slice() : [];
  }
  const seite = (status, o) => Object.assign({}, SEITE[zeile(status, o)] || SEITE.beendet);
  /* Sendet ein Endkunde, ist es in der Vorschau eine Testanfrage (Betreff „[Test]“, nicht gezählt, nach FRISTEN.testTage weg) */
  const anfrageArt = (status, o) => (!darf(status, 'schreiben', o) ? null : zeile(status, o) === 'vorschau' ? 'test' : 'website');

  /* ---------- Fristen und Grenzen (Vorschläge, Bauplan §5.3) ---------- */
  const FRISTEN = {
    kulanzTage: 14, pauseMaxTage: 60, loeschenNachEndeTage: 30, entwurfLeerStunden: 24, entwurfStillTage: 30,
    unzustellbarTage: 60, testTage: 1, vorschauTage: 30, fotosSignatureTage: 365, bestellEntwurfTage: 30,
    nachrichtenJahre: 3, belegeJahre: 8, freigabeErinnerung: [3, 7], frischMinuten: 15, sitzungTage: 14, domainWarnTage: 30,
    empfaengerTage: 14, rueckrufWerktage: 10, einladungErinnernTage: 3, versandVersuche: 8, versandMaxTage: 3, versandErsterMinuten: 10
  };
  const GRENZEN = {
    anfragenIpTag: 10, testJeTag: 10, fotosJeFenster: 2, fotosZusatz: 4, kiJeCode: 60, fotoTagInstanz: 1500, otpFehlerMailTag: 10,
    dateienBestellung: 12, dateiBytes: 1000000, summeBestellung: 10000000, nachrichtenStunde: 20, eingangMails: 3,
    pdfBudget: 5000000, anhangMax: 7000000, startsTagInstanzHart: 5000,
    domains: 3, farben: 3, titel: 80, begruessung: 400, notiz: 1500, nachricht: 2000, fenster: 50
  };

  /* ---------- Bestellung: Statusleiste, Abo-Zustand, Übergänge (§2.8) ---------- */
  const B_STATUS = ['offen', 'bezahlt', 'einrichtung', 'domain', 'freigabe', 'live', 'pausiert', 'beendet', 'storniert'];
  /* Die sechs Schritte der Statusleiste beim Partner, in denselben Worten wie auf der Verkaufsseite */
  const LEISTE = [
    { status: 'offen', titel: 'Bestellt' }, { status: 'bezahlt', titel: 'Bezahlt' }, { status: 'einrichtung', titel: 'In Einrichtung' },
    { status: 'domain', titel: 'Domain gesichert' }, { status: 'freigabe', titel: 'Zur Freigabe' }, { status: 'live', titel: 'Live' }
  ];
  const B_TITEL = { offen: 'Bestellt', bezahlt: 'Bezahlt', einrichtung: 'In Einrichtung', domain: 'Domain gesichert', freigabe: 'Zur Freigabe', live: 'Live', pausiert: 'Pausiert', beendet: 'Beendet', storniert: 'Storniert' };
  const ABO_STATUS = ['', 'aktiv', 'zahlung_offen', 'gekuendigt', 'ausgesetzt', 'beendet'];
  const ABO_TITEL = { '': 'Noch nicht gestartet', aktiv: 'Aktiv', zahlung_offen: 'Zahlung offen', gekuendigt: 'Gekündigt', ausgesetzt: 'Pausiert', beendet: 'Beendet' };
  /* Übergänge: wer = stripe (Zahlung über einrichtungUebernehmen), system (Tageslauf, Webhook), partner, inhaber; vermerk: Pflicht */
  const UEBERGAENGE = [
    { von: 'offen', nach: 'bezahlt', wer: ['stripe'] },
    { von: 'offen', nach: 'storniert', wer: ['partner', 'inhaber', 'system'] },
    { von: 'bezahlt', nach: 'einrichtung', wer: ['inhaber'] },
    { von: 'bezahlt', nach: 'storniert', wer: ['partner', 'inhaber'] },
    { von: 'einrichtung', nach: 'domain', wer: ['inhaber'] },
    { von: 'domain', nach: 'freigabe', wer: ['inhaber'] },
    { von: 'freigabe', nach: 'einrichtung', wer: ['inhaber'], vermerk: true },
    { von: 'freigabe', nach: 'domain', wer: ['inhaber'], vermerk: true },
    { von: 'freigabe', nach: 'live', wer: ['inhaber'] },
    { von: 'live', nach: 'pausiert', wer: ['system', 'inhaber'] },
    { von: 'pausiert', nach: 'live', wer: ['system', 'inhaber'] },
    { von: 'pausiert', nach: 'beendet', wer: ['system', 'inhaber'] },
    { von: 'live', nach: 'beendet', wer: ['inhaber'], vermerk: true },
    { von: 'einrichtung', nach: 'storniert', wer: ['inhaber'], vermerk: true },
    { von: 'domain', nach: 'storniert', wer: ['inhaber'], vermerk: true },
    { von: 'freigabe', nach: 'storniert', wer: ['inhaber'], vermerk: true }
  ];
  /* null = nicht erlaubt (409), sonst { vermerk: bool } */
  function uebergang(von, nach, wer) {
    const u = UEBERGAENGE.find((x) => x.von === von && x.nach === nach);
    if (!u || (wer && u.wer.indexOf(wer) < 0)) return null;
    return { vermerk: !!u.vermerk };
  }
  /* Status der Instanz zur Bestellung: bis Live in Einrichtung, storniert = beendet */
  const instanzStatusFuer = (b) => ({ live: 'aktiv', pausiert: 'pausiert', beendet: 'beendet', storniert: 'beendet' })[b] || 'einrichtung';
  /* Übergänge der Instanz (verwalten.instanzStatus) */
  const I_UEBERGAENGE = { einrichtung: ['aktiv', 'beendet'], aktiv: ['pausiert', 'beendet'], pausiert: ['aktiv', 'beendet'], beendet: [] };
  const instanzUebergang = (von, nach) => !!(I_UEBERGAENGE[von] && I_UEBERGAENGE[von].indexOf(nach) >= 0);

  /* ---------- Verkauf (Variable PAKETE_OFFEN, Entscheidung vom 22.10.2026) ----------
     Ohne PAKETE_OFFEN=1 zeigt die Verkaufsseite die Pakete mit „vorläufige Preise“ und statt „Paket bestellen“ ein Anfrageformular
     („Bestellung bald möglich“); die Paket-Kasse bleibt im Live-Modus von Stripe zu. Im Test- und Attrappenmodus ist die Kasse offen,
     damit sich alles prüfen lässt. bereit: Paketbedingungen ohne Platzhalter (recht.js, paketVerkaufStand) */
  function verkauf(o) {
    o = o || {};
    const offen = !!o.offen;
    return { offen: offen, vorlaeufig: !offen, bestellen: offen, kasse: !o.live || (offen && o.bereit !== false) };
  }

  /* ---------- Domains: Normalisierung und Prüfung (Bestellformular, Zentrale, verwalten.js) ---------- */
  const DOMAIN = /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(xn--[a-z0-9-]{2,59}|[a-z]{2,24})$/;
  /* „HTTPS://WWW.Brandt-Fenster.App/x“ → „brandt-fenster.app“; IDN → Punycode; ungültig: '' */
  function hostNorm(s) {
    let t = String(s == null ? '' : s).trim().toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, '').replace(/[/?#].*$/, '').replace(/:\d*$/, '').replace(/\.$/, '');
    if (!t || /[\s@]/.test(t)) return '';
    try { t = new URL('https://' + t).hostname; } catch (e) { return ''; }
    return t.replace(/^www\./, '');
  }
  /* o.demo: demo-*.eeziframes.com erlaubt (Demo-Instanzen der Verkaufsseite); o.lokal: *.localhost erlaubt (nur Prüfung) */
  function host(s, o) {
    o = o || {};
    const h = hostNorm(s);
    if (!h) return { ok: false, host: '', fehler: 'Bitte eine Domain wie ihr-name-fenster.de eingeben.' };
    if (o.lokal && /^[a-z0-9-]+(\.[a-z0-9-]+)*\.localhost$/.test(h)) return { ok: true, host: h };
    if (!DOMAIN.test(h)) return { ok: false, host: h, fehler: h + ' ist keine gültige Domain.' };
    if (/(^|\.)eeziframes\.(com|de)$/.test(h) && !(o.demo && /^demo-[a-z0-9-]+\.eeziframes\.com$/.test(h))) return { ok: false, host: h, fehler: 'Adressen von eeziframes sind nicht möglich.' };
    if (/(^|\.)(workers\.dev|pages\.dev|localhost|invalid|example|test)$/.test(h)) return { ok: false, host: h, fehler: h + ' ist keine öffentliche Domain.' };
    return { ok: true, host: h };
  }

  /* ---------- Farben: Hex und Kontrast (WCAG 2.1) ---------- */
  const HEX = /^#[0-9a-f]{6}$/;
  /* Firmenfarbe als --accent: mindestens 4,5:1 gegen den dunklen Grund #161616 */
  const AKZENT_GRUND = '#161616', AKZENT_KONTRAST = 4.5;
  function leucht(hex) {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function kontrast(a, b) {
    a = String(a || '').toLowerCase(); b = String(b || '').toLowerCase();
    if (!HEX.test(a) || !HEX.test(b)) return 0;
    const x = leucht(a), y = leucht(b);
    return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
  }
  function farbe(hex) {
    const h = String(hex || '').trim().toLowerCase();
    if (!HEX.test(h)) return { ok: false, farbe: '', kontrast: 0, fehler: 'Bitte eine Farbe als #rrggbb angeben.' };
    const k = kontrast(h, AKZENT_GRUND);
    return k >= AKZENT_KONTRAST ? { ok: true, farbe: h, kontrast: k } : { ok: false, farbe: h, kontrast: k, fehler: 'Diese Farbe ist auf dunklem Grund zu schwach (Kontrast ' + String(k).replace('.', ',') + ':1, nötig 4,5:1).' };
  }
  /* Vorschlag für eine zu dunkle Firmenfarbe: in kleinen Schritten mit Weiß mischen, bis der Kontrast reicht ('' bei ungültiger Farbe) */
  function akzent(hex) {
    let h = String(hex || '').trim().toLowerCase(); if (!HEX.test(h)) return '';
    const rgb = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    for (let t = 0; t <= 1.0001 && kontrast(h, AKZENT_GRUND) < AKZENT_KONTRAST; t += 0.05) h = '#' + rgb.map((v) => Math.round(v + (255 - v) * t).toString(16).padStart(2, '0')).join('');
    return h;
  }

  /* ---------- Bundesländer (Impressum, Aufsichtsbehörde im Datenschutz) ---------- */
  const BUNDESLAENDER = {
    BW: 'Baden-Württemberg', BY: 'Bayern', BE: 'Berlin', BB: 'Brandenburg', HB: 'Bremen', HH: 'Hamburg', HE: 'Hessen', MV: 'Mecklenburg-Vorpommern',
    NI: 'Niedersachsen', NW: 'Nordrhein-Westfalen', RP: 'Rheinland-Pfalz', SL: 'Saarland', SN: 'Sachsen', ST: 'Sachsen-Anhalt', SH: 'Schleswig-Holstein', TH: 'Thüringen'
  };

  /* ---------- Feldregeln des Bestellformulars (eine Prüffunktion für Browser und Server) ----------
     Jede Funktion: (daten) → { ok, wert (bereinigt), fehler: { feld: 'Satz' } } */
  const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
  const mailOk = (m) => /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(String(m || '')) && !/\.invalid$/i.test(String(m || ''));
  const telOk = (t) => String(t || '').replace(/\D/g, '').length >= 6;
  function webAdresse(s) {
    const t = String(s || '').trim(); if (!t) return '';
    try { const u = new URL(/^https?:\/\//i.test(t) ? t : 'https://' + t); return /^https?:$/.test(u.protocol) && /\./.test(u.hostname) ? u.href.slice(0, 200) : null; } catch (e) { return null; }
  }
  const ergebnis = (wert, fehler) => ({ ok: !Object.keys(fehler).length, wert: wert, fehler: fehler });
  const ZEITEN = []; for (let m = 6 * 60; m <= 20 * 60; m += 30) ZEITEN.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'));
  const TAGE = ['mo', 'di', 'mi', 'do', 'fr', 'sa'];

  function erreichbarkeit(e) {
    e = e && typeof e === 'object' ? e : {};
    const tage = Array.from(new Set((Array.isArray(e.tage) ? e.tage : []).map(String))).filter((t) => TAGE.indexOf(t) >= 0);
    const von = ZEITEN.indexOf(String(e.von || '')) >= 0 ? String(e.von) : '', bis = ZEITEN.indexOf(String(e.bis || '')) >= 0 ? String(e.bis) : '';
    const kanal = ['telefon', 'mail', 'egal'].indexOf(e.kanal) >= 0 ? e.kanal : 'egal';
    const f = {};
    if (!tage.length) f.tage = 'Bitte mindestens einen Tag wählen.';
    if (!von || !bis || von >= bis) f.zeit = 'Bitte eine Zeit von … bis … wählen (zwischen 6 und 20 Uhr).';
    return ergebnis({ tage: TAGE.filter((t) => tage.indexOf(t) >= 0), von: von, bis: bis, kanal: kanal, hinweis: kurz(e.hinweis, 200) }, f);
  }
  function firma(d) {
    d = d && typeof d === 'object' ? d : {};
    const w = {
      firma: kurz(d.firma, 100), strasse: kurz(d.strasse, 100), plz: String(d.plz || '').replace(/\s/g, '').slice(0, 5), ort: kurz(d.ort, 80), land: 'DE',
      bundesland: Object.prototype.hasOwnProperty.call(BUNDESLAENDER, d.bundesland) ? d.bundesland : '',
      ust: String(d.ust || '').replace(/\s/g, '').toUpperCase().slice(0, 11), web: webAdresse(d.web), ap: kurz(d.ap, 80), rolle: kurz(d.rolle, 80), tel: kurz(d.tel, 40),
      rechtsform: kurz(d.rechtsform, 60), vertretung: kurz(d.vertretung, 200), register: kurz(d.register, 120), kammer: kurz(d.kammer, 120), beruf: kurz(d.beruf, 120),
      schlichtung: kurz(d.schlichtung, 300), dsb: kurz(d.dsb, 200)
    };
    const f = {};
    if (w.firma.length < 2) f.firma = 'Bitte den Namen des Unternehmens eingeben.';
    if (w.strasse.length < 3) f.strasse = 'Bitte Straße und Hausnummer eingeben.';
    if (!/^\d{5}$/.test(w.plz)) f.plz = 'Bitte eine fünfstellige Postleitzahl eingeben.';
    if (w.ort.length < 2) f.ort = 'Bitte den Ort eingeben.';
    if (!w.bundesland) f.bundesland = 'Bitte das Bundesland wählen.';
    if (w.ust && !/^DE\d{9}$/.test(w.ust)) f.ust = 'Die USt-IdNr. beginnt mit DE und hat 9 Ziffern.';
    if (w.web === null) { f.web = 'Diese Adresse lässt sich nicht öffnen.'; w.web = ''; }
    if (w.ap.length < 2) f.ap = 'Bitte einen Ansprechpartner nennen.';
    if (!telOk(w.tel)) f.tel = 'Bitte eine Telefonnummer mit mindestens 6 Ziffern eingeben.';
    if (!w.rechtsform) f.rechtsform = 'Bitte die Rechtsform angeben (z. B. GmbH, Einzelunternehmen).';
    if (w.vertretung.length < 2) f.vertretung = 'Bitte angeben, wer das Unternehmen vertritt (Inhaber oder Geschäftsführer).';
    const e = erreichbarkeit(d.erreichbar); w.erreichbar = e.wert;
    Object.keys(e.fehler).forEach((k) => { f['erreichbar.' + k] = e.fehler[k]; });
    return ergebnis(w, f);
  }
  /* m: Merkmale des Pakets (Pakete.merkmale); Zugänge nur mit m.dashboard, höchstens m.zugaenge */
  function konfigurator(d, m) {
    d = d && typeof d === 'object' ? d : {};
    const domains = [], f = {};
    (Array.isArray(d.domains) ? d.domains : []).slice(0, GRENZEN.domains + 2).forEach((s, i) => {
      if (!String(s || '').trim()) return;
      const r = host(s);
      if (!r.ok) f['domains.' + i] = r.fehler; else if (domains.indexOf(r.host) < 0) domains.push(r.host);
    });
    if (domains.length > GRENZEN.domains) f.domains = 'Höchstens ' + GRENZEN.domains + ' Wunsch-Domains.';
    const vorschlaege = !!d.vorschlaege;
    if (!domains.length && !vorschlaege) f.domains = 'Bitte mindestens eine Wunsch-Domain nennen oder „Bitte schlagen Sie mir Namen vor“ wählen.';
    const liste = (v, max, feld) => { const out = []; (Array.isArray(v) ? v : []).forEach((x, i) => { const a = String(x || '').trim().toLowerCase(); if (!a) return; if (!mailOk(a)) f[feld + '.' + i] = 'Bitte eine gültige E-Mail-Adresse eingeben.'; else if (out.indexOf(a) < 0) out.push(a); }); if (out.length > max) f[feld] = 'Höchstens ' + max + ' Adressen.'; return out.slice(0, max); };
    const eingang = liste(d.eingang, GRENZEN.eingangMails, 'eingang');
    if (!eingang.length) f.eingang = 'Bitte mindestens eine Adresse für die Anfragen nennen.';
    const maxZ = m && m.dashboard ? Number(m.zugaenge) || 0 : 0;
    const zugang = maxZ ? liste(d.zugang, maxZ, 'zugang') : [];
    if (maxZ && !zugang.length) f.zugang = 'Bitte mindestens eine Adresse für den Zugang zum Dashboard nennen.';
    const w = { name: kurz(d.name, 60), domains: domains.slice(0, GRENZEN.domains), vorschlaege: vorschlaege, eingang: eingang, zugang: zugang, impressum: webAdresse(d.impressum) || '' };
    if (w.name.length < 2) f.name = 'Bitte den Namen nennen, der im Konfigurator stehen soll.';
    return ergebnis(w, f);
  }
  function gestaltung(d) {
    d = d && typeof d === 'object' ? d : {};
    const f = {}, farben = [];
    (Array.isArray(d.farben) ? d.farben : []).forEach((c, i) => { const h = String(c || '').trim().toLowerCase(); if (!h) return; if (!HEX.test(h)) f['farben.' + i] = 'Bitte eine Farbe als #rrggbb angeben.'; else if (farben.indexOf(h) < 0) farben.push(h); });
    if (farben.length > GRENZEN.farben) f.farben = 'Höchstens ' + GRENZEN.farben + ' Farben.';
    const w = { farben: farben.slice(0, GRENZEN.farben), titel: kurz(d.titel, GRENZEN.titel), begruessung: String(d.begruessung == null ? '' : d.begruessung).replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, '').trim().slice(0, GRENZEN.begruessung), notiz: String(d.notiz == null ? '' : d.notiz).replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, '').trim().slice(0, GRENZEN.notiz), logoFolgt: !!d.logoFolgt };
    if (String(d.titel || '').length > GRENZEN.titel) f.titel = 'Höchstens ' + GRENZEN.titel + ' Zeichen.';
    if (String(d.begruessung || '').length > GRENZEN.begruessung) f.begruessung = 'Höchstens ' + GRENZEN.begruessung + ' Zeichen.';
    if (String(d.notiz || '').length > GRENZEN.notiz) f.notiz = 'Höchstens ' + GRENZEN.notiz + ' Zeichen.';
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
  /* Ganze Bestellung: wunsch = { firma, konfigurator, gestaltung }; m = Merkmale; gestaltung nur, wenn das Paket sie hat */
  function vollstaendig(wunsch, m, stand, zust) {
    wunsch = wunsch || {};
    const teile = { firma: firma(wunsch.firma), konfigurator: konfigurator(wunsch.konfigurator, m) };
    if (m && (m.logo || m.farbe || m.fotos || m.startansicht)) teile.gestaltung = gestaltung(wunsch.gestaltung);
    if (zust !== undefined) teile.zustimmung = zustimmung(zust, stand);
    const fehler = {};
    Object.keys(teile).forEach((t) => Object.keys(teile[t].fehler).forEach((k) => { fehler[t + '.' + k] = teile[t].fehler[k]; }));
    const wert = {}; Object.keys(teile).forEach((t) => { wert[t] = teile[t].wert; });
    return ergebnis(wert, fehler);
  }

  const R = {
    STATUS: STATUS, BEREICHE: BEREICHE, ZEILEN: ZEILEN, MATRIX: MATRIX, SEITE: SEITE, FRISTEN: FRISTEN, GRENZEN: GRENZEN,
    darf: darf, felder: felder, seite: seite, anfrageArt: anfrageArt,
    bestellung: {
      STATUS: B_STATUS, TITEL: B_TITEL, LEISTE: LEISTE, ABO_STATUS: ABO_STATUS, ABO_TITEL: ABO_TITEL, UEBERGAENGE: UEBERGAENGE,
      uebergang: uebergang, firma: firma, konfigurator: konfigurator, gestaltung: gestaltung, erreichbarkeit: erreichbarkeit, zustimmung: zustimmung, vollstaendig: vollstaendig
    },
    instanz: { UEBERGAENGE: I_UEBERGAENGE, uebergang: instanzUebergang, statusFuer: instanzStatusFuer },
    verkauf: verkauf, host: host, hostNorm: hostNorm, farbe: farbe, kontrast: kontrast, akzent: akzent, AKZENT_GRUND: AKZENT_GRUND, AKZENT_KONTRAST: AKZENT_KONTRAST,
    BUNDESLAENDER: BUNDESLAENDER, mailOk: mailOk, telOk: telOk
  };
  frieren(MATRIX); frieren(SEITE); frieren(FRISTEN); frieren(GRENZEN); frieren(LEISTE); frieren(UEBERGAENGE); frieren(I_UEBERGAENGE); frieren(BUNDESLAENDER);
  root.Instanzregeln = R;
  if (typeof module === 'object' && module.exports) module.exports = R;
})(typeof globalThis !== 'undefined' ? globalThis : this);

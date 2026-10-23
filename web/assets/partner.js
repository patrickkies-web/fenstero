/* eeziframes · Kundenkonto der Fensteranbieter (/partner/): Bestellformular und Konto bis Live und darüber hinaus
   Server: functions/api/partner.js (Routen /api/partner/…), Regeln für Felder, Status und Fristen: web/assets/instanzregeln.js (dieselbe
   Prüfung wie auf dem Server), Pakete und Preise: web/assets/pakete.js. Die Anmeldung ist ein Cookie, das kein Skript lesen kann
   (Sitzung „partner“); im Browser liegt kein Token. Gemerkt wird hier nur, was noch nicht gespeichert ist (Formular je Bestellung).
   Seiten über den Anker:
     #bestellen/<paket>[/<id>]   Bestellformular: Paket · E-Mail · Unternehmen · Konfigurator · (Gestaltung) · Prüfen und bestellen
     #bestellung/<id>            Konto einer Bestellung: Statusleiste bzw. Abo-Karte, nächste Aktion, Wünsche, Nachrichten, Rückruf, Rechnungen
     #bestellung/<id>/wuensche   Wünsche ergänzen (Gestaltung, bis zur Freigabe)
     #uebersicht, #firma, #anmelden
   Rückkehr aus der Kasse: /partner/?kasse=<session>#bestellung/<id>. */
(function () {
  'use strict';
  var P = window.Pakete, R = window.Instanzregeln, RB = R.bestellung;
  var wurzel = document.getElementById('p');
  var S = { stand: null, konto: null, route: { art: '' }, schritt: 0, f: null, fehler: {}, meldung: '', laedt: false, sendet: false, domain: {}, dialog: null, danke: null, nachrichten: null, rechnungen: null, vorschau: {}, rueckrufOffen: false, eingangOffen: false, codeGesendet: false, mail: '', code: '' };

  /* ---------- Werkzeuge ---------- */
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var euro = function (n) { n = Number(n) || 0; return (Number.isInteger(n) ? n.toLocaleString('de-DE') : n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + ' €'; };
  var euroCent = function (c) { return (Number(c || 0) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; };
  var datum = function (iso) { if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }); };
  var kurzDatum = function (iso) { if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Berlin' }); };
  var wann = function (iso) { if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }); };
  var tagText = function (t) { var d = new Date(t + 'T12:00:00Z'); return isNaN(d) ? t : d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }); };
  var kopie = function (o) { return JSON.parse(JSON.stringify(o)); };
  var merk = function (k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ohne Speicher */ } return null; };
  var LOGO = function (px) { return window.Logo ? window.Logo.svg(px) : ''; };
  var WM = function () { return window.Marke ? window.Marke.wort() : '<span class="wm" translate="no"><b>eezi</b>frames</span>'; };
  var ruhig = function () { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  var status = function (t) { var el = document.getElementById('p-status'); if (el) { el.textContent = ''; setTimeout(function () { el.textContent = t; }, 30); } };
  var toastZeit = null;
  function toast(t) { var el = document.getElementById('p-toast'); if (!el) { el = document.createElement('div'); el.id = 'p-toast'; el.className = 'p-toast'; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el); } el.textContent = t; el.classList.add('an'); status(t); clearTimeout(toastZeit); toastZeit = setTimeout(function () { el.classList.remove('an'); }, 3000); }
  var mwst = function () { return !S.stand || S.stand.mwst !== 0; };
  var paketName = function (p) { return P.PAKETE[p] ? P.PAKETE[p].name : ''; };
  var gestaltet = function (m) { return !!(m && (m.logo || m.farbe || m.fotos || m.startansicht)); };

  /* ---------- Server ---------- */
  function fehler(text, extra) { var e = new Error(text); if (extra) Object.keys(extra).forEach(function (k) { e[k] = extra[k]; }); return e; }
  async function api(pfad, body, methode, nochmal) {
    var init = { method: methode || (body ? 'POST' : 'GET'), headers: { accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store' };
    if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); }
    var r; try { r = await fetch(pfad, init); } catch (e) { throw fehler('Keine Verbindung. Bitte prüfen Sie Ihr Netz und versuchen Sie es noch einmal.'); }
    var j = await r.json().catch(function () { return null; });
    if (r.status === 401 && j && j.frisch && !nochmal) { await frischAnmelden(); return api(pfad, body, methode, true); }
    if (r.status === 401 && j && j.anmelden) { S.konto = { angemeldet: false }; throw fehler('Bitte melden Sie sich neu an.', { anmelden: true, status: 401 }); }
    if (!r.ok || !j || j.ok === false) throw fehler((j && j.fehler) || 'Der Server antwortet gerade nicht. Bitte gleich noch einmal.', { status: r.status, felder: j && j.felder, daten: j });
    return j;
  }
  async function kontoLaden() { S.konto = await api('/api/partner'); return S.konto; }
  var bestellung = function (id) { return ((S.konto && S.konto.bestellungen) || []).find(function (b) { return b.id === id; }) || null; };
  function bestellungSetzen(b) { if (!b || !S.konto) return; var l = S.konto.bestellungen || (S.konto.bestellungen = []), i = l.findIndex(function (x) { return x.id === b.id; }); if (i >= 0) l[i] = b; else l.unshift(b); }

  /* ---------- Route ---------- */
  function routeLesen() {
    var h = decodeURIComponent(location.hash.replace(/^#/, '')), t = h.split('/');
    if (t[0] === 'bestellen') return { art: 'bestellen', paket: P.gueltig(t[1]) ? t[1] : '', id: t[2] || '' };
    if (t[0] === 'bestellung' && t[1]) return { art: t[2] === 'wuensche' ? 'wuensche' : 'bestellung', id: t[1] };
    if (['uebersicht', 'firma', 'anmelden'].indexOf(t[0]) >= 0) return { art: t[0] };
    return { art: '' };
  }
  function gehe(hash) { if (location.hash === '#' + hash) { neuRoute(); } else location.hash = hash; }
  function ersetzeHash(hash) { try { history.replaceState(null, '', location.pathname + location.search + '#' + hash); } catch (e) { location.hash = hash; } }

  /* ---------- Formular: Entwurf je Bestellung (bis zum Speichern nur hier, danach vom Server) ---------- */
  var ZEITEN = []; for (var mi = 6 * 60; mi <= 20 * 60; mi += 30) ZEITEN.push(String(Math.floor(mi / 60)).padStart(2, '0') + ':' + String(mi % 60).padStart(2, '0'));
  var TAGE = [['mo', 'Mo'], ['di', 'Di'], ['mi', 'Mi'], ['do', 'Do'], ['fr', 'Fr'], ['sa', 'Sa']];
  function leeresFormular() {
    return { paket: '', firma: { firma: '', rechtsform: '', strasse: '', plz: '', ort: '', bundesland: '', ust: '', web: '', ap: '', rolle: '', tel: '', vertretung: '', register: '', kammer: '', beruf: '', erreichbar: { tage: [], von: '', bis: '', kanal: 'telefon', hinweis: '' } },
      konfigurator: { name: '', domains: ['', '', ''], vorschlaege: false, eingang: ['', '', ''], zugang: [''], impressum: '' },
      gestaltung: { farben: [''], titel: '', begruessung: '', notiz: '', logoFolgt: false }, zustimmung: { unternehmer: false, agb: '', avv: false } };
  }
  var formSchluessel = function () { return 'eezi.partner.formular.' + (S.route.id || 'neu'); };
  var formMerken = function () { if (S.f) merk(formSchluessel(), { f: S.f, schritt: S.schritt }); };
  /* Formular aus Server-Daten und gemerkter Eingabe zusammensetzen */
  function formularFuer(b) {
    var f = leeresFormular(), k = S.konto || {}, p = k.partner;
    f.paket = (b && b.paket) || S.route.paket || (merk('eezi.partner.entwurf') || {}).paket || '';
    if (p) { Object.keys(f.firma).forEach(function (x) { if (x === 'firma') f.firma.firma = p.firma; else if (p.daten && p.daten[x] != null && x !== 'erreichbar') f.firma[x] = p.daten[x]; }); if (p.daten && p.daten.erreichbar) f.firma.erreichbar = Object.assign(f.firma.erreichbar, kopie(p.daten.erreichbar)); }
    var mail = (k.mail || '').toLowerCase();
    f.konfigurator.name = (p && p.firma) || ''; f.konfigurator.eingang[0] = mail; f.konfigurator.zugang[0] = mail;
    if (b && b.wunsch) {
      var w = b.wunsch.konfigurator, g = b.wunsch.gestaltung;
      if (w) { f.konfigurator.name = w.name || f.konfigurator.name; f.konfigurator.vorschlaege = !!w.vorschlaege; f.konfigurator.impressum = w.impressum || ''; [0, 1, 2].forEach(function (i) { f.konfigurator.domains[i] = (w.domains || [])[i] || ''; f.konfigurator.eingang[i] = (w.eingang || [])[i] || ''; }); f.konfigurator.zugang = (w.zugang && w.zugang.length ? w.zugang.slice() : f.konfigurator.zugang); }
      if (g) { f.gestaltung = Object.assign(f.gestaltung, kopie(g)); if (!f.gestaltung.farben || !f.gestaltung.farben.length) f.gestaltung.farben = ['']; }
    }
    /* gemerkte Eingabe darüber legen, aber nur, was ausgefüllt ist (eine vor der Anmeldung leere Adresse überschreibt nicht die Vorbelegung) */
    var mischen = function (ziel, quelle) { Object.keys(quelle || {}).forEach(function (x) { var v = quelle[x]; if (x === 'tage') { if (Array.isArray(v) && v.length) ziel[x] = v.slice(); } else if (v && typeof v === 'object' && ziel[x] && typeof ziel[x] === 'object') mischen(ziel[x], v); else if (v !== '' && v !== null && v !== undefined && v !== false) ziel[x] = v; }); };
    var alt = merk(formSchluessel());
    if (alt && alt.f) { ['firma', 'konfigurator', 'gestaltung'].forEach(function (t) { if (alt.f[t]) mischen(f[t], alt.f[t]); }); if (!b && alt.f.paket) f.paket = alt.f.paket; }
    f.zustimmung = { unternehmer: false, agb: '', avv: false };
    return f;
  }
  function wertSetzen(pfad, wert) { var t = pfad.split('.'), o = S.f; for (var i = 0; i < t.length - 1; i++) { var k = /^\d+$/.test(t[i]) ? Number(t[i]) : t[i]; if (o[k] == null) o[k] = /^\d+$/.test(t[i + 1]) ? [] : {}; o = o[k]; } o[/^\d+$/.test(t[t.length - 1]) ? Number(t[t.length - 1]) : t[t.length - 1]] = wert; }
  function wertLesen(pfad) { return pfad.split('.').reduce(function (o, k) { return o == null ? undefined : o[/^\d+$/.test(k) ? Number(k) : k]; }, S.f); }

  /* ---------- Bausteine ---------- */
  var fid = function (k) { return 'f-' + k.replace(/[^a-z0-9]+/gi, '-'); };
  var fehlerZu = function (k) { return S.fehler[k] || ''; };
  function feld(k, label, o) {
    o = o || {}; var v = wertLesen(k), f = fehlerZu(o.fehler || k), id = fid(k);
    var attr = ' id="' + id + '" data-f="' + esc(k) + '"' + (f ? ' aria-invalid="true" aria-describedby="' + id + '-e"' : (o.hilfe ? ' aria-describedby="' + id + '-h"' : '')) + (o.auto ? ' autocomplete="' + o.auto + '"' : '') + (o.pflicht ? ' required' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') + (o.platz ? ' placeholder="' + esc(o.platz) + '"' : '') + (o.modus ? ' inputmode="' + o.modus + '"' : '');
    var eingabe = o.text ? '<textarea' + attr + ' rows="' + (o.zeilen || 4) + '">' + esc(v || '') + '</textarea>'
      : o.wahl ? '<select' + attr + '>' + o.wahl.map(function (w) { return '<option value="' + esc(w[0]) + '"' + (String(v || '') === String(w[0]) ? ' selected' : '') + '>' + esc(w[1]) + '</option>'; }).join('') + '</select>'
        : '<input type="' + (o.typ || 'text') + '"' + attr + ' value="' + esc(v || '') + '">';
    if (o.knopf) eingabe = '<div class="p-zeile">' + eingabe + o.knopf + '</div>';
    return '<div class="p-f' + (f ? ' fehlt' : '') + (o.breit ? ' breit' : '') + '"><label for="' + id + '">' + esc(label) + (o.pflicht ? '' : ' <span class="p-neben" style="font-weight:500">(optional)</span>') + '</label>' + eingabe +
      (o.hilfe ? '<small id="' + id + '-h">' + o.hilfe + '</small>' : '') + (o.nach || '') + (f ? '<p class="p-fehler" id="' + id + '-e">' + esc(f) + '</p>' : '') + '</div>';
  }
  function kopf(rechts) {
    var k = S.konto;
    return '<header class="p-kopf"><a class="p-marke" href="' + (k && k.angemeldet ? '#uebersicht' : '/fuer-fensterbauer/') + '" aria-label="eeziframes Kundenkonto">' + LOGO(32) + '<span>' + WM() + '<small>Kundenkonto</small></span></a>' +
      '<div class="p-kopf-r">' + (rechts || '') + (k && k.angemeldet ? '<span class="p-wer">' + esc(k.mail) + '</span><button type="button" class="btn ghost small" data-a="abmelden">Abmelden</button>' : '') + '</div></header>';
  }
  var fuss = function () { return '<footer class="p-fuss"><a href="/fuer-fensterbauer/">Pakete</a><a href="/konfigurator-bedingungen/" target="_blank" rel="noopener">Paketbedingungen</a><a href="/datenschutz/">Datenschutz</a><a href="/impressum/">Impressum</a></footer>'; };
  var hauptknopf = function (text, a, extra) { return '<button type="button" class="btn primary" data-a="' + a + '"' + (extra || '') + (S.sendet ? ' disabled' : '') + '>' + (S.sendet ? '<span class="spin" aria-hidden="true"></span>' : '') + esc(text) + '<span class="pf" aria-hidden="true"></span></button>'; };
  var meldung = function () { return S.meldung ? '<p class="p-fehlerliste" role="alert">' + esc(S.meldung) + '</p>' : ''; };
  function seite(inhalt, schmal) { wurzel.innerHTML = kopf() + '<main class="p-seite' + (schmal ? ' p-schmal' : '') + '">' + inhalt + '</main>' + fuss() + (S.dialog ? dialogHtml() : ''); }
  function fokusTitel() { var h = wurzel.querySelector('.p-titel'); if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: false }); } catch (e) { h.focus(); } } }

  /* ---------- Anmelden (eigener Bildschirm und Schritt „E-Mail“ im Formular) ---------- */
  function anmeldeForm(imFormular) {
    var f1 = fehlerZu('mail'), f2 = fehlerZu('code');
    return '<form class="p-form" data-form="anmelden" novalidate>' +
      '<div class="p-f' + (f1 ? ' fehlt' : '') + '"><label for="f-mail">E-Mail-Adresse</label><input type="email" id="f-mail" data-x="mail" autocomplete="email" inputmode="email" value="' + esc(S.mail) + '"' + (S.codeGesendet ? ' readonly' : '') + (f1 ? ' aria-invalid="true" aria-describedby="f-mail-e"' : '') + '>' + (f1 ? '<p class="p-fehler" id="f-mail-e">' + esc(f1) + '</p>' : '') + '</div>' +
      (S.codeGesendet ? '<div class="p-f' + (f2 ? ' fehlt' : '') + '"><label for="f-code">Code aus der E-Mail</label><input type="text" id="f-code" data-x="code" autocomplete="one-time-code" inputmode="numeric" maxlength="10" value="' + esc(S.code) + '"' + (f2 ? ' aria-invalid="true" aria-describedby="f-code-e"' : ' aria-describedby="f-code-h"') + '><small id="f-code-h">Wir haben ihn an ' + esc(S.mail) + ' geschickt. Er gilt eine Stunde.</small>' + (f2 ? '<p class="p-fehler" id="f-code-e">' + esc(f2) + '</p>' : '') + '</div>' : '') +
      meldung() +
      '<div class="p-knoepfe stapel">' + (S.codeGesendet ? '<button type="button" class="p-link" data-a="code-neu">Andere Adresse oder neuer Code</button>' : (imFormular ? '<button type="button" class="btn ghost" data-a="zurueck">Zurück</button>' : '')) +
      (S.codeGesendet ? hauptknopf('Bestätigen', 'code-pruefen') : hauptknopf('Code schicken', 'code-senden')) + '</div></form>';
  }
  function anmeldenSeite() {
    seite('<div class="p-kopfblock"><p class="eyebrow kicker">Konfigurator-Pakete</p><h1 class="p-titel">Ihr <span class="ak">Kundenkonto</span>.</h1><p class="p-lead">Hier begleiten Sie Ihren Konfigurator von der Bestellung bis Live: Status, Nachrichten, Rückruf und Rechnungen. Anmelden geht mit einem Code per E-Mail, ohne Passwort.</p></div>' +
      '<section class="p-karte">' + anmeldeForm(false) + '</section><p class="p-neben">Noch kein Paket? <a class="p-link" href="#bestellen">Paket wählen und bestellen</a></p>', true);
  }
  async function codeSenden() {
    var mail = String(S.mail || '').trim().toLowerCase(); S.fehler = {}; S.meldung = '';
    if (!R.mailOk(mail)) { S.fehler.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return neuZeichnen(true); }
    S.sendet = true; neuZeichnen();
    try { await api('/api/partner/anmelden', { mail: mail }); S.mail = mail; S.codeGesendet = true; S.code = ''; status('Code verschickt an ' + mail); } catch (e) { S.meldung = e.message; }
    S.sendet = false; neuZeichnen(); var c = document.getElementById('f-code'); if (c) c.focus();
  }
  async function codePruefen(danach) {
    S.fehler = {}; S.meldung = '';
    if (!/^\d{6,10}$/.test(String(S.code || '').replace(/\s/g, ''))) { S.fehler.code = 'Bitte den Code aus der E-Mail eingeben (6 bis 10 Ziffern).'; return neuZeichnen(true); }
    S.sendet = true; neuZeichnen();
    try { await api('/api/partner/bestaetigen', { mail: S.mail, code: String(S.code).replace(/\s/g, '') }); S.codeGesendet = false; S.code = ''; await kontoLaden(); S.sendet = false; status('Angemeldet'); if (danach) return danach(); return neuRoute(); }
    catch (e) { S.sendet = false; if (e.status === 401) S.fehler.code = e.message; else S.meldung = e.message; neuZeichnen(true); }
  }

  /* ---------- Frische Anmeldung für Geld-Aktionen ---------- */
  var frischWarten = null;
  function frischAnmelden() {
    return new Promise(function (ja, nein) {
      S.mail = (S.konto && S.konto.mail) || S.mail; S.codeGesendet = false; S.code = ''; S.fehler = {}; S.meldung = '';
      frischWarten = { ja: ja, nein: nein };
      S.dialog = { art: 'frisch' }; neuZeichnen();
      codeSenden().then(function () { var c = document.getElementById('f-code'); if (c) c.focus(); });
    });
  }

  /* ---------- Bestellformular ---------- */
  function schritte(paket) {
    var m = P.merkmale(paket) || {}, l = [{ k: 'paket', t: 'Paket' }, { k: 'mail', t: 'E-Mail' }, { k: 'firma', t: 'Unternehmen' }, { k: 'konfigurator', t: 'Konfigurator' }];
    if (gestaltet(m)) l.push({ k: 'gestaltung', t: 'Gestaltung' });
    l.push({ k: 'pruefen', t: 'Bestellen' });
    return l;
  }
  var TITEL = { paket: 'Ihr <span class="ak">Paket</span>.', mail: 'E-Mail <span class="ak">bestätigen</span>.', firma: 'Ihr <span class="ak">Unternehmen</span>.', konfigurator: 'Ihr <span class="ak">Konfigurator</span>.', gestaltung: 'Ihre <span class="ak">Gestaltung</span>.', pruefen: 'Prüfen und <span class="ak">bestellen</span>.' };
  var LEAD = {
    paket: 'Ihr eigener Fenster-Konfigurator unter Ihrer Domain, in Ihrem Namen. Die Einrichtung zahlen Sie vorab, das Monatsabo beginnt erst, wenn Ihr Konfigurator live ist.',
    mail: 'Wir schicken Ihnen einen Code. Ein Passwort brauchen Sie nicht; mit dieser Adresse melden Sie sich später im Kundenkonto an.',
    firma: 'Für Rechnung und Rückruf und für das Impressum Ihres Konfigurators. Das Angebot gilt nur für Unternehmer.',
    konfigurator: 'Wie er heißt, unter welcher Adresse er laufen soll und wohin die Anfragen Ihrer Kunden gehen.',
    gestaltung: 'Logo, Farben, Fotos und Texte. Was noch fehlt, können Sie bis zur Freigabe nachreichen.',
    pruefen: 'Bitte prüfen Sie Ihre Angaben. Mit „Kostenpflichtig bestellen“ geht es zur Zahlung der Einrichtung bei Stripe.'
  };
  var steuerSatz = function () { return mwst() ? 'zzgl. 19 % MwSt.' : 'ohne Umsatzsteuer (§ 19 UStG)'; };
  var unternehmerSatz = function () { return 'Angebot nur für Unternehmer, alle Preise netto ' + (mwst() ? 'zzgl. 19 % MwSt.' : 'ohne Umsatzsteuer (§ 19 UStG).'); };
  var KENNZEICHNUNG = { deutlich: 'Mit „Powered by EEZIframes“ in der App', dezent: 'Kleiner Hinweis auf eeziframes im Fuß', keine: 'Ohne Hinweis auf eeziframes' };
  var vorlaeufigHinweis = function () { return S.stand && S.stand.verkauf && S.stand.verkauf.vorlaeufig ? '<p class="p-hinweis warn"><b>Vorläufige Preise.</b> Die Preise stehen noch nicht endgültig fest; es gilt der Preis, den Sie beim Bestellen sehen.</p>' : ''; };

  function leiste(liste, aktuell) {
    return '<ol class="p-leiste formular" aria-label="Schritte der Bestellung">' + liste.map(function (s, i) {
      return '<li class="' + (i < aktuell ? 'erledigt' : '') + '"' + (i === aktuell ? ' aria-current="step"' : '') + '><span class="n" data-nr="' + (i + 1) + '">' + esc((i + 1) + ' ' + s.t) + '</span></li>';
    }).join('') + '</ol>';
  }
  function paketKarte(p) {
    var m = P.PAKETE[p], gew = S.f.paket === p, z = ['domain', 'konfigurator', 'eingangMail', 'logo', 'farbe', 'startansicht', 'dashboard', 'einladungslinks'];
    var zeilen = z.map(function (k) { var M = P.MERKMALE[k], an = !!m[k]; return '<li class="' + (an ? '' : 'weg') + '">' + esc(M.titel) + '</li>'; }).join('') + '<li class="info">' + esc(KENNZEICHNUNG[m.kennzeichnung] || '') + '</li>';
    return '<button type="button" class="p-paket" data-a="paket" data-v="' + p + '" aria-pressed="' + gew + '"><span class="name">' + esc(m.name) + '</span><span class="preis">' + euro(m.preis.monat) + ' <small>im Monat netto</small></span><span class="p-neben">Einrichtung einmalig ' + euro(m.preis.einrichtung) + ' netto</span><ul>' + zeilen + '</ul></button>';
  }
  function schrittPaket() {
    return '<div class="p-pakete" role="group" aria-label="Paket wählen">' + P.LISTE.map(paketKarte).join('') + '</div>' + (fehlerZu('paket') ? '<p class="p-fehler" role="alert">' + esc(fehlerZu('paket')) + '</p>' : '') +
      '<p class="p-neben">' + esc(unternehmerSatz()) + ' Das Monatsabo beginnt mit dem Livegang und ist monatlich kündbar.</p>' + vorlaeufigHinweis();
  }
  function schrittFirma() {
    var bl = [['', 'Bitte wählen']].concat(Object.keys(R.BUNDESLAENDER).map(function (k) { return [k, R.BUNDESLAENDER[k]]; }));
    var e = S.f.firma.erreichbar || {}, zeitWahl = [['', '–']].concat(ZEITEN.map(function (z) { return [z, z + ' Uhr']; }));
    var tageF = fehlerZu('erreichbar.tage'), zeitF = fehlerZu('erreichbar.zeit');
    return '<form class="p-form" data-form="firma" novalidate>' +
      '<fieldset class="p-gruppe"><legend>Unternehmen</legend><div class="p-zwei">' +
      feld('firma.firma', 'Name des Unternehmens', { pflicht: true, auto: 'organization', max: 100, breit: true, fehler: 'firma' }) +
      feld('firma.rechtsform', 'Rechtsform', { pflicht: true, max: 60, platz: 'z. B. GmbH, Einzelunternehmen', fehler: 'rechtsform' }) +
      feld('firma.bundesland', 'Bundesland', { pflicht: true, wahl: bl, fehler: 'bundesland' }) +
      feld('firma.strasse', 'Straße und Hausnummer', { pflicht: true, auto: 'street-address', max: 100, breit: true, fehler: 'strasse' }) +
      '<div class="p-plz breit">' + feld('firma.plz', 'PLZ', { pflicht: true, auto: 'postal-code', modus: 'numeric', max: 5, fehler: 'plz' }) + feld('firma.ort', 'Ort', { pflicht: true, auto: 'address-level2', max: 80, fehler: 'ort' }) + '</div>' +
      feld('firma.ust', 'USt-IdNr.', { platz: 'DE123456789', max: 14, fehler: 'ust' }) + feld('firma.web', 'Website', { typ: 'url', auto: 'url', platz: 'ihr-betrieb.de', max: 200, fehler: 'web' }) +
      '</div></fieldset>' +
      '<fieldset class="p-gruppe"><legend>Ansprechpartner</legend><div class="p-zwei">' +
      feld('firma.ap', 'Vor- und Nachname', { pflicht: true, auto: 'name', max: 80, fehler: 'ap' }) + feld('firma.rolle', 'Funktion', { max: 80, platz: 'z. B. Inhaber', fehler: 'rolle' }) +
      feld('firma.tel', 'Telefon', { pflicht: true, typ: 'tel', auto: 'tel', max: 40, fehler: 'tel' }) + '</div></fieldset>' +
      '<fieldset class="p-gruppe"><legend>Erreichbarkeit<small>Wann dürfen wir Sie anrufen, etwa um die Domain abzustimmen?</small></legend>' +
      '<div class="p-f' + (tageF ? ' fehlt' : '') + '"><span class="p-label" id="l-tage">Tage</span><div class="p-tage" role="group" aria-labelledby="l-tage"' + (tageF ? ' aria-describedby="f-erreichbar-tage-e"' : '') + '>' + TAGE.map(function (t) { var an = (e.tage || []).indexOf(t[0]) >= 0; return '<button type="button" class="chip" id="' + (t[0] === 'mo' ? 'f-erreichbar-tage' : 'f-tag-' + t[0]) + '" data-a="tag" data-v="' + t[0] + '" aria-pressed="' + an + '">' + t[1] + '</button>'; }).join('') + '</div>' + (tageF ? '<p class="p-fehler" id="f-erreichbar-tage-e">' + esc(tageF) + '</p>' : '') + '</div>' +
      '<div class="p-zwei">' + feld('firma.erreichbar.von', 'Von', { pflicht: true, wahl: zeitWahl, fehler: 'erreichbar.zeit' }).replace(/<p class="p-fehler"[^]*?<\/p>/, '') + feld('firma.erreichbar.bis', 'Bis', { pflicht: true, wahl: zeitWahl, fehler: 'erreichbar.zeit' }) + '</div>' +
      '<div class="p-f"><span class="p-label" id="l-kanal">Am liebsten</span><div class="seg" role="group" aria-labelledby="l-kanal">' + [['telefon', 'Telefon'], ['mail', 'E-Mail'], ['egal', 'Egal']].map(function (k) { return '<button type="button" data-a="kanal" data-v="' + k[0] + '" aria-pressed="' + (e.kanal === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div></div>' +
      feld('firma.erreichbar.hinweis', 'Hinweis zur Erreichbarkeit', { max: 200, platz: 'z. B. mittwochs nur vormittags' }) + '</fieldset>' +
      '<fieldset class="p-gruppe"><legend>Angaben für das Impressum<small>Ihr Konfigurator braucht ein eigenes Impressum; wir setzen es aus diesen Angaben.</small></legend><div class="p-zwei">' +
      feld('firma.vertretung', 'Vertreten durch', { pflicht: true, max: 200, platz: 'Inhaber bzw. Geschäftsführer', breit: true, fehler: 'vertretung' }) +
      feld('firma.register', 'Registergericht und Nummer', { max: 120, platz: 'z. B. Amtsgericht Köln, HRB 12345', fehler: 'register' }) + feld('firma.kammer', 'Kammer', { max: 120, platz: 'z. B. Handwerkskammer zu Köln', fehler: 'kammer' }) +
      feld('firma.beruf', 'Berufsbezeichnung', { max: 120, platz: 'z. B. Tischler, verliehen in Deutschland', breit: true, fehler: 'beruf' }) + '</div></fieldset></form>';
  }
  function schrittKonfigurator() {
    var m = P.merkmale(S.f.paket) || {}, k = S.f.konfigurator;
    var domain = function (i) {
      var d = S.domain[i];
      return feld('konfigurator.domains.' + i, (i + 1) + '. Wunsch-Domain', { pflicht: i === 0 && !k.vorschlaege, platz: i ? '' : 'ihr-name-fenster.de', max: 120, modus: 'url', fehler: 'domains.' + i,
        knopf: '<button type="button" class="btn soft small" data-a="domain" data-v="' + i + '">Prüfen</button>',
        nach: '<p class="p-domain-ergebnis' + (d ? ' ' + esc(d.stand) : '') + '" id="f-dom-' + i + '-erg" aria-live="polite">' + (d ? esc(d.text) : '') + '</p>' });
    };
    var zugaenge = '';
    if (m.dashboard) {
      var n = Math.min(Number(m.zugaenge) || 1, Math.max(1, (k.zugang || []).filter(Boolean).length + 1));
      zugaenge = '<fieldset class="p-gruppe"><legend>Zugänge zum Dashboard<small>Wer sich unter Ihrer Domain anmelden darf (bis zu ' + m.zugaenge + ' Adressen). Jede Adresse bestätigt ihren Zugang per Link.</small></legend>' +
        Array.from({ length: n }, function (_, i) { return feld('konfigurator.zugang.' + i, (i + 1) + '. Zugang', { pflicht: i === 0, typ: 'email', auto: 'email', max: 120, fehler: 'zugang.' + i }); }).join('') + (fehlerZu('zugang') ? '<p class="p-fehler">' + esc(fehlerZu('zugang')) + '</p>' : '') +
        (n < (Number(m.zugaenge) || 1) ? '<p><button type="button" class="p-link" data-a="zugang-mehr">Weitere Adresse</button></p>' : '') + '</fieldset>';
    }
    return '<form class="p-form" data-form="konfigurator" novalidate>' +
      '<fieldset class="p-gruppe"><legend>Name</legend>' + feld('konfigurator.name', 'Name im Konfigurator', { pflicht: true, max: 60, hilfe: 'So heißt der Konfigurator für Ihre Kunden, meist der Name Ihres Betriebs.', fehler: 'name' }) + '</fieldset>' +
      '<fieldset class="p-gruppe"><legend>Wunsch-Domains<small>In der Reihenfolge Ihrer Wünsche. Wir sichern die Domain für Sie; „Prüfen“ ist unverbindlich.</small></legend>' + [0, 1, 2].map(domain).join('') +
      (fehlerZu('domains') ? '<p class="p-fehler" role="alert">' + esc(fehlerZu('domains')) + '</p>' : '') +
      '<label class="p-check"><input type="checkbox" data-c="konfigurator.vorschlaege"' + (k.vorschlaege ? ' checked' : '') + '><span>Bitte schlagen Sie mir Namen vor.</span></label></fieldset>' +
      '<fieldset class="p-gruppe"><legend>Anfragen an<small>Jede Anfrage Ihrer Kunden kommt mit dem Aufmaßblatt als PDF an diese Adressen. Jede Adresse bestätigt sich einmal per Link.</small></legend>' +
      [0, 1, 2].map(function (i) { return feld('konfigurator.eingang.' + i, (i + 1) + '. Adresse', { pflicht: i === 0, typ: 'email', auto: i ? 'off' : 'email', max: 120, fehler: 'eingang.' + i }); }).join('') + (fehlerZu('eingang') ? '<p class="p-fehler">' + esc(fehlerZu('eingang')) + '</p>' : '') + '</fieldset>' +
      zugaenge +
      '<fieldset class="p-gruppe"><legend>Impressum Ihrer Website</legend>' + feld('konfigurator.impressum', 'Link zu Ihrem Impressum', { typ: 'url', max: 200, platz: 'https://ihr-betrieb.de/impressum', fehler: 'impressum' }) + '</fieldset></form>';
  }
  var DATEI_ARTEN = { logo: { name: 'Logo', accept: 'image/png,image/jpeg,image/webp,image/svg+xml,.svg' }, druck: { name: 'Druckvorlage (PDF)', accept: 'application/pdf,.pdf,image/svg+xml,.svg' }, foto: { name: 'Foto', accept: 'image/jpeg,image/png,image/webp' }, ap: { name: 'Foto des Ansprechpartners', accept: 'image/jpeg,image/png,image/webp' } };
  function dateiListe(b, art) {
    var l = ((b && b.dateien) || []).filter(function (d) { return d.art === art; });
    if (!l.length) return '';
    return '<ul class="p-dateien">' + l.map(function (d) {
      var bild = /^image\/(png|jpeg|webp)$/.test(d.typ), url = S.vorschau[d.id];
      return '<li class="p-datei">' + (bild && url ? '<img class="bild" src="' + esc(url) + '" alt="">' : '<span class="bild" aria-hidden="true">' + esc((d.typ.split('/')[1] || '').replace('svg+xml', 'SVG').toUpperCase().slice(0, 4)) + '</span>') +
        '<span class="t"><b>' + esc(d.name) + '</b><small>' + Math.max(1, Math.round(d.bytes / 1024)) + ' KB</small></span><button type="button" class="btn ghost small" data-a="datei-weg" data-v="' + esc(d.id) + '" aria-label="' + esc(d.name) + ' entfernen">Entfernen</button></li>';
    }).join('') + '</ul>';
  }
  function hochladen(art, mehrere, label) {
    return '<span class="p-hochladen"><span class="btn soft small" aria-hidden="true">' + esc(label) + '</span><input type="file" data-datei="' + art + '" accept="' + DATEI_ARTEN[art].accept + '"' + (mehrere ? ' multiple' : '') + ' aria-label="' + esc(label + ': ' + DATEI_ARTEN[art].name) + '"></span>';
  }
  function schrittGestaltung(b) {
    var m = P.merkmale(S.f.paket) || {}, g = S.f.gestaltung, teile = [];
    var hoch = S.hochladen ? '<p class="p-neben" role="status"><span class="spin" aria-hidden="true" style="display:inline-block;vertical-align:-3px;margin-right:8px"></span>' + esc(S.hochladen) + '</p>' : '';
    if (m.logo) teile.push('<fieldset class="p-gruppe"><legend>Logo<small>PNG, JPEG, WebP oder SVG bis 1 MB. Eine PDF-Datei nehmen wir als Druckvorlage.</small></legend>' + dateiListe(b, 'logo') + '<div class="p-knoepfe">' + hochladen('logo', false, 'Logo hochladen') + hochladen('druck', false, 'Druckvorlage (PDF)') + '</div>' + dateiListe(b, 'druck') +
      (fehlerZu('datei.logo') ? '<p class="p-fehler" role="alert">' + esc(fehlerZu('datei.logo')) + '</p>' : '') + '<label class="p-check"><input type="checkbox" data-c="gestaltung.logoFolgt"' + (g.logoFolgt ? ' checked' : '') + '><span>Das Logo reiche ich nach.</span></label></fieldset>');
    if (m.farbe) teile.push('<fieldset class="p-gruppe"><legend>Farben<small>Bis zu drei Unternehmensfarben. Die erste wird die Akzentfarbe; ist sie auf dunklem Grund zu schwach, hellen wir sie auf.</small></legend>' +
      g.farben.map(function (c, i) { var f = fehlerZu('farben.' + i), hex = /^#[0-9a-f]{6}$/i.test(c) ? c : '#8fd694'; return '<div class="p-f' + (f ? ' fehlt' : '') + '"><label for="' + fid('gestaltung.farben.' + i) + '">' + (i + 1) + '. Farbe</label><div class="p-farbe"><input type="color" data-farbe="' + i + '" value="' + esc(hex.toLowerCase()) + '" aria-label="' + (i + 1) + '. Farbe wählen"><input type="text" id="' + fid('gestaltung.farben.' + i) + '" data-f="gestaltung.farben.' + i + '" value="' + esc(c) + '" placeholder="#0071e3" maxlength="7"' + (f ? ' aria-invalid="true"' : '') + '></div>' + (f ? '<p class="p-fehler">' + esc(f) + '</p>' : '') + '</div>'; }).join('') +
      (g.farben.length < R.GRENZEN.farben ? '<p><button type="button" class="p-link" data-a="farbe-mehr">Weitere Farbe</button></p>' : '') + '</fieldset>');
    if (m.fotos) teile.push('<fieldset class="p-gruppe"><legend>Fotos Ihres Betriebs<small>Bis zu ' + m.fotos + ' Fotos für die Startseite (Team, Werkstatt, Referenzen). Große Fotos verkleinern wir vor dem Hochladen.</small></legend>' + dateiListe(b, 'foto') + '<div class="p-knoepfe">' + hochladen('foto', true, 'Fotos hochladen') + '</div></fieldset>');
    if (m.startansicht) teile.push('<fieldset class="p-gruppe"><legend>Startseite</legend>' + feld('gestaltung.titel', 'Überschrift', { max: R.GRENZEN.titel, platz: 'z. B. Ihre neuen Fenster, in Minuten geplant', fehler: 'titel' }) +
      feld('gestaltung.begruessung', 'Begrüßung', { text: true, zeilen: 3, max: R.GRENZEN.begruessung, platz: 'Ein paar Sätze an Ihre Kunden', fehler: 'begruessung' }) +
      '<div class="p-f"><span class="p-label">Foto des Ansprechpartners</span>' + dateiListe(b, 'ap') + '<div class="p-knoepfe">' + hochladen('ap', false, 'Foto hochladen') + '</div></div></fieldset>');
    teile.push('<fieldset class="p-gruppe"><legend>Notizen</legend>' + feld('gestaltung.notiz', 'Was wir sonst wissen sollten', { text: true, zeilen: 4, max: R.GRENZEN.notiz, fehler: 'notiz' }) + '</fieldset>');
    return '<form class="p-form" data-form="gestaltung" novalidate>' + hoch + teile.join('') + '</form>';
  }
  function zusammenfassung(b, schrittIndex) {
    var f = S.f, fi = f.firma, k = f.konfigurator, g = f.gestaltung, m = P.merkmale(f.paket) || {}, e = fi.erreichbar || {};
    var aendern = function (k2) { var i = schrittIndex(k2); return i >= 0 ? '<button type="button" class="p-link" data-a="schritt" data-v="' + i + '">Ändern</button>' : ''; };
    var block = function (titel, k2, paare) { return '<section class="p-karte"><div class="p-block-kopf"><h2 class="p-h3">' + esc(titel) + '</h2>' + aendern(k2) + '</div><dl class="p-kv">' + paare.filter(Boolean).map(function (p) { return '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1] || '–') + '</dd>'; }).join('') + '</dl></section>'; };
    var tage = (e.tage || []).map(function (t) { return (TAGE.find(function (x) { return x[0] === t; }) || [t, t])[1]; }).join(', ');
    return block('Paket', 'paket', [['Paket', paketName(f.paket)], ['Einrichtung', euro(P.preis(f.paket).einrichtung) + ' netto, einmalig, vorab'], ['Monatlich', euro(P.preis(f.paket).monat) + ' netto, ab dem Livegang']]) +
      block('Unternehmen', 'firma', [['Firma', fi.firma + (fi.rechtsform && fi.firma.toLowerCase().indexOf(fi.rechtsform.toLowerCase()) < 0 ? ' (' + fi.rechtsform + ')' : '')], ['Anschrift', fi.strasse + ', ' + fi.plz + ' ' + fi.ort], ['Ansprechpartner', fi.ap + (fi.rolle ? ', ' + fi.rolle : '')], ['Telefon', fi.tel], ['Erreichbar', tage ? tage + ', ' + e.von + '–' + e.bis + ' Uhr' : ''], ['Vertreten durch', fi.vertretung], fi.ust ? ['USt-IdNr.', fi.ust] : null]) +
      block('Konfigurator', 'konfigurator', [['Name', k.name], ['Wunsch-Domains', k.domains.filter(Boolean).join(', ') || (k.vorschlaege ? 'Bitte Vorschläge' : '')], ['Anfragen an', k.eingang.filter(Boolean).join(', ')], m.dashboard ? ['Zugänge', (k.zugang || []).filter(Boolean).join(', ')] : null]) +
      (gestaltet(m) ? block('Gestaltung', 'gestaltung', [m.logo ? ['Logo', ((b && b.dateien) || []).some(function (d) { return d.art === 'logo'; }) ? 'hochgeladen' : g.logoFolgt ? 'folgt' : 'noch keins'] : null, m.farbe ? ['Farben', (g.farben || []).filter(Boolean).join(', ')] : null, m.fotos ? ['Fotos', String(((b && b.dateien) || []).filter(function (d) { return d.art === 'foto'; }).length)] : null, m.startansicht ? ['Überschrift', g.titel] : null]) : '');
  }
  function schrittPruefen(b, schrittIndex) {
    var f = S.f, pr = P.preis(f.paket), z = f.zustimmung, v = (S.stand && S.stand.verkauf) || {}, stand = (S.stand && S.stand.stand) || '';
    var brutto = mwst() ? Math.round(pr.einrichtung * 100) + Math.round(pr.einrichtung * 100 * 0.19) : Math.round(pr.einrichtung * 100);
    var check = function (k, html) { var fe = fehlerZu(k); return '<label class="p-check' + (fe ? ' fehlt' : '') + '" id="' + fid('zustimmung.' + k) + '-l"><input type="checkbox" id="' + fid('zustimmung.' + k) + '" data-c="zustimmung.' + k + '"' + (z[k] ? ' checked' : '') + (fe ? ' aria-invalid="true" aria-describedby="' + fid('zustimmung.' + k) + '-e"' : '') + '><span>' + html + (fe ? '<span class="p-fehler" id="' + fid('zustimmung.' + k) + '-e" style="display:block;margin-top:4px">' + esc(fe) + '</span>' : '') + '</span></label>'; };
    return zusammenfassung(b, schrittIndex) +
      '<section class="p-preis" aria-label="Kosten"><span class="p-label">Heute einmalig</span><span class="gross num">' + euro(pr.einrichtung) + ' <small>netto ' + esc(steuerSatz()) + '</small></span><span class="p-neben">' + (mwst() ? 'Zu zahlen: ' + euroCent(brutto) + ' inkl. MwSt. · ' : '') + 'monatlich ' + euro(pr.monat) + ' netto ab dem Livegang, monatlich kündbar.</span></section>' + vorlaeufigHinweis() +
      '<form class="p-form" data-form="pruefen" novalidate>' +
      check('unternehmer', 'Ich bestelle als <b>Unternehmer</b> (§ 14 BGB) für mein Unternehmen.') +
      check('agb', 'Ich stimme den <a href="/konfigurator-bedingungen/" target="_blank" rel="noopener">Paketbedingungen</a> zu (Stand ' + esc(S.stand ? S.stand.standText : stand) + ').') +
      check('avv', 'Ich schließe den <a href="/konfigurator-bedingungen/#avv" target="_blank" rel="noopener">Vertrag zur Auftragsverarbeitung</a> (Anlage der Paketbedingungen) ab.') +
      (v.kasse === false ? '<p class="p-hinweis warn"><b>Bestellung bald möglich.</b> Ihre Angaben sind gespeichert. Fragen Sie unverbindlich an, dann melden wir uns, sobald Sie bestellen können.</p>' : '<p class="p-neben">Sie bezahlen bei Stripe mit Karte oder SEPA-Lastschrift. Die Karte bestätigt sofort; eine Lastschrift braucht 2 bis 5 Werktage. Die Eingangsbestätigung mit den Paketbedingungen kommt sofort per E-Mail.</p>') + '</form>';
  }
  function formularSeite() {
    var b = S.route.id ? bestellung(S.route.id) : null, liste = schritte(S.f.paket || 'essential'), i = Math.min(S.schritt, liste.length - 1), s = liste[i];
    var schrittIndex = function (k) { return liste.findIndex(function (x) { return x.k === k; }); };
    var inhalt = s.k === 'paket' ? schrittPaket() : s.k === 'mail' ? anmeldeForm(true) : s.k === 'firma' ? schrittFirma() : s.k === 'konfigurator' ? schrittKonfigurator() : s.k === 'gestaltung' ? schrittGestaltung(b) : schrittPruefen(b, schrittIndex);
    var weiter = s.k === 'mail' ? '' : s.k === 'pruefen' ? (S.stand && S.stand.verkauf && S.stand.verkauf.kasse === false ? hauptknopf('Unverbindlich anfragen', 'anfragen') : hauptknopf('Kostenpflichtig bestellen', 'kasse')) : hauptknopf('Weiter', 'weiter');
    var fehlerZahl = Object.keys(S.fehler).length;
    seite('<div class="p-kopfblock"><p class="eyebrow kicker">' + (b ? 'Bestellung ' + esc(b.nr) : 'Paket bestellen') + (S.f.paket ? ' · ' + esc(paketName(S.f.paket)) : '') + '</p>' + leiste(liste, i) +
      '<h1 class="p-titel">' + TITEL[s.k] + '</h1><p class="p-lead">' + esc(LEAD[s.k]) + '</p></div>' +
      (fehlerZahl && s.k !== 'mail' ? '<p class="p-fehlerliste" role="alert">' + (fehlerZahl === 1 ? 'Bitte prüfen Sie das markierte Feld.' : 'Bitte prüfen Sie die ' + fehlerZahl + ' markierten Felder.') + '</p>' : '') +
      (s.k !== 'mail' ? meldung() : '') + inhalt +
      (s.k !== 'mail' ? '<div class="p-knoepfe ende stapel">' + (i > 0 ? '<button type="button" class="btn ghost" data-a="zurueck">Zurück</button>' : '<a class="btn ghost" href="/fuer-fensterbauer/">Abbrechen</a>') + weiter + '</div>' : ''), true);
  }
  /* Nächster offener Schritt: Anmeldung, Unternehmen, Konfigurator, Gestaltung, sonst Prüfen */
  function ersterOffenerSchritt(b) {
    var liste = schritte(S.f.paket || 'essential'), idx = function (k) { return liste.findIndex(function (x) { return x.k === k; }); };
    if (!S.f.paket) return 0;
    if (!S.konto || !S.konto.angemeldet) return idx('mail');
    if (!S.konto.partner || !RB.firma(S.f.firma).ok) return idx('firma');
    var m = P.merkmale(S.f.paket);
    if (!b || !RB.konfigurator(S.f.konfigurator, m).ok) return idx('konfigurator');
    if (gestaltet(m) && !(b.wunsch && b.wunsch.gestaltung)) return idx('gestaltung');
    return idx('pruefen');
  }
  function schrittTitel() { var l = schritte(S.f.paket || 'essential'); return l[Math.min(S.schritt, l.length - 1)]; }
  /* Fehler des Servers (konfigurator.domains.0 …) in Feldfehler dieses Schritts übersetzen */
  function serverFehler(e, praefix) {
    S.fehler = {};
    if (e.felder) Object.keys(e.felder).forEach(function (k) { S.fehler[praefix && k.indexOf(praefix + '.') === 0 ? k.slice(praefix.length + 1) : k] = e.felder[k]; });
    if (!Object.keys(S.fehler).length) S.meldung = e.message;
  }
  function zeigeFehler() {
    neuZeichnen(true);
    var form = wurzel.querySelector('.p-form'); if (form && !ruhig()) { form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake'); }
    if (window.Haptik) window.Haptik.fehler();
    var erstes = wurzel.querySelector('[aria-invalid="true"]'); if (erstes) erstes.focus();
    status('Bitte die markierten Felder prüfen.');
  }
  async function weiter() {
    var s = schrittTitel(), m = P.merkmale(S.f.paket) || {}; S.fehler = {}; S.meldung = '';
    if (s.k === 'paket') {
      if (!P.gueltig(S.f.paket)) { S.fehler.paket = 'Bitte ein Paket wählen.'; return zeigeFehler(); }
      merk('eezi.partner.entwurf', { paket: S.f.paket });
      var b0 = S.route.id ? bestellung(S.route.id) : null;
      if (b0 && b0.status === 'offen' && b0.paket !== S.f.paket) { try { S.sendet = true; neuZeichnen(); bestellungSetzen((await api('/api/partner/bestellungen/' + b0.id, { paket: S.f.paket }, 'PATCH')).bestellung); } catch (e) { S.sendet = false; S.meldung = e.message; return neuZeichnen(); } S.sendet = false; }
      S.schritt = ersterOffenerSchritt(b0); if (S.schritt === 0) S.schritt = 1; formMerken(); return neuZeichnen(false, true);
    }
    if (s.k === 'firma') {
      var r = RB.firma(S.f.firma);
      if (!r.ok) { S.fehler = r.fehler; return zeigeFehler(); }
      S.sendet = true; neuZeichnen();
      try { var j = await api('/api/partner/firma', S.f.firma); S.konto.partner = j.partner; if (!S.f.konfigurator.name) S.f.konfigurator.name = j.partner.firma; } catch (e) { S.sendet = false; serverFehler(e); return zeigeFehler(); }
      S.sendet = false; S.schritt++; formMerken(); toast('Gespeichert'); return neuZeichnen(false, true);
    }
    if (s.k === 'konfigurator') {
      var rk = RB.konfigurator(S.f.konfigurator, m);
      if (!rk.ok) { S.fehler = rk.fehler; return zeigeFehler(); }
      S.sendet = true; neuZeichnen();
      try {
        var jb = S.route.id ? await api('/api/partner/bestellungen/' + S.route.id, { konfigurator: S.f.konfigurator }, 'PATCH') : await api('/api/partner/bestellungen', { paket: S.f.paket, konfigurator: S.f.konfigurator });
        bestellungSetzen(jb.bestellung);
        /* die bereinigten Werte des Servers übernehmen (Domains klein, ohne www., Punycode) */
        var wk = (jb.bestellung.wunsch || {}).konfigurator || {};
        [0, 1, 2].forEach(function (i) { S.f.konfigurator.domains[i] = (wk.domains || [])[i] || ''; S.f.konfigurator.eingang[i] = (wk.eingang || [])[i] || ''; });
        if (wk.zugang && wk.zugang.length) S.f.konfigurator.zugang = wk.zugang.slice();
        if (!S.route.id) { merk(formSchluessel(), null); S.route.id = jb.bestellung.id; ersetzeHash('bestellen/' + S.f.paket + '/' + jb.bestellung.id); }
      } catch (e) { S.sendet = false; serverFehler(e, 'konfigurator'); return zeigeFehler(); }
      S.sendet = false; S.schritt++; formMerken(); toast('Gespeichert'); return neuZeichnen(false, true);
    }
    if (s.k === 'gestaltung') {
      var rg = RB.gestaltung(S.f.gestaltung);
      if (!rg.ok) { S.fehler = rg.fehler; return zeigeFehler(); }
      S.sendet = true; neuZeichnen();
      try { bestellungSetzen((await api('/api/partner/bestellungen/' + S.route.id, { gestaltung: S.f.gestaltung }, 'PATCH')).bestellung); } catch (e) { S.sendet = false; serverFehler(e, 'gestaltung'); return zeigeFehler(); }
      S.sendet = false; S.schritt++; formMerken(); toast('Gespeichert'); return neuZeichnen(false, true);
    }
  }
  async function kasse() {
    var z = RB.zustimmung({ unternehmer: S.f.zustimmung.unternehmer, agb: S.f.zustimmung.agb ? S.stand.stand : '', avv: S.f.zustimmung.avv }, S.stand.stand); S.fehler = {}; S.meldung = '';
    if (!z.ok) { S.fehler = z.fehler; return zeigeFehler(); }
    S.sendet = true; neuZeichnen();
    try { var j = await api('/api/partner/bestellungen/' + S.route.id + '/kasse', { zustimmung: { unternehmer: true, agb: S.stand.stand, avv: true } }); formMerken(); status('Weiter zur Zahlung'); location.assign(j.url); }
    catch (e) {
      S.sendet = false;
      if (e.daten && e.daten.neuLaden) { S.stand = await api('/api/partner/stand'); S.f.zustimmung.agb = false; S.meldung = e.message; return neuZeichnen(); }
      if (e.daten && e.daten.bald) { S.stand.verkauf.kasse = false; S.meldung = e.message; return neuZeichnen(); }
      if (e.felder) { var schritt = (e.daten && e.daten.schritt) || ''; var liste = schritte(S.f.paket), i = liste.findIndex(function (x) { return x.k === schritt; }); serverFehler(e, schritt); if (i >= 0 && schritt !== 'zustimmung') S.schritt = i; return zeigeFehler(); }
      S.meldung = e.message; neuZeichnen();
    }
  }
  async function anfragen() {
    S.sendet = true; neuZeichnen();
    try { await api('/api/partner/bestellungen/' + S.route.id + '/anfragen', {}); S.sendet = false; toast('Danke, wir melden uns.'); gehe('bestellung/' + S.route.id); } catch (e) { S.sendet = false; S.meldung = e.message; neuZeichnen(); }
  }
  async function domainPruefen(i) {
    var w = String(S.f.konfigurator.domains[i] || '').trim(), h = R.host(w);
    if (!h.ok) { S.domain[i] = { stand: 'vergeben', text: h.fehler }; return neuZeichnen(); }
    S.f.konfigurator.domains[i] = h.host; S.domain[i] = { stand: '', text: 'wird geprüft …' }; neuZeichnen();
    try { var j = await api('/api/partner/domain-pruefen', { domain: h.host }); S.domain[i] = { stand: j.stand, text: j.text }; } catch (e) { S.domain[i] = { stand: '', text: e.message }; }
    neuZeichnen(); var x = document.getElementById(fid('konfigurator.domains.' + i)); if (x) x.focus();
  }

  /* ---------- Dateien: verkleinern (Canvas), hochladen, als blob: zeigen ---------- */
  function lesenAlsBase64(blob) { return new Promise(function (ja, nein) { var r = new FileReader(); r.onload = function () { ja(String(r.result).replace(/^data:[^,]*,/, '')); }; r.onerror = nein; r.readAsDataURL(blob); }); }
  function verkleinern(file, maxPx, typ, q) {
    return new Promise(function (ja, nein) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () { var f = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.naturalWidth * f)); c.height = Math.max(1, Math.round(img.naturalHeight * f)); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob(function (b) { if (b) ja(b); else nein(new Error('Bild nicht lesbar')); }, typ, q); };
      img.onerror = function () { URL.revokeObjectURL(url); nein(new Error('Bild nicht lesbar')); };
      img.src = url;
    });
  }
  async function dateiVorbereiten(file, art) {
    var MAX = R.GRENZEN.dateiBytes, raster = /^image\/(png|jpeg|webp)$/.test(file.type);
    if (art === 'foto' && raster && (file.size > MAX || file.type !== 'image/jpeg')) return verkleinern(file, 2000, 'image/jpeg', 0.85);
    if (art === 'ap' && raster) return file.size > 300000 ? verkleinern(file, 600, 'image/jpeg', 0.85) : file;
    if (art === 'logo' && raster && file.size > MAX) { var b = await verkleinern(file, 1600, 'image/png'); return b.size > MAX ? verkleinern(file, 1600, 'image/jpeg', 0.9) : b; }
    if (file.size > MAX) throw new Error(file.name + ' ist größer als 1 MB. Bitte schicken Sie die Datei als Nachricht oder per E-Mail.');
    return file;
  }
  async function dateienHochladen(art, files) {
    if (!S.route.id) return;
    S.fehler = {}; S.meldung = '';
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      S.hochladen = file.name + ' wird hochgeladen …'; neuZeichnen();
      try {
        var blob = await dateiVorbereiten(file, art), daten = await lesenAlsBase64(blob);
        var j = await api('/api/partner/bestellungen/' + S.route.id + '/datei', { art: art, name: file.name, daten: daten });
        bestellungSetzen(j.bestellung); await vorschauLaden(j.bestellung);
      } catch (e) { S.fehler['datei.logo'] = e.message; S.meldung = e.message; break; }
    }
    S.hochladen = ''; neuZeichnen(); if (!S.meldung) toast(files.length > 1 ? 'Dateien hochgeladen' : 'Datei hochgeladen');
  }
  async function vorschauLaden(b) {
    var offen = ((b && b.dateien) || []).filter(function (d) { return /^image\/(png|jpeg|webp)$/.test(d.typ) && !S.vorschau[d.id]; });
    for (var i = 0; i < offen.length; i++) {
      try { var r = await fetch('/api/partner/bestellungen/' + b.id + '/datei/' + offen[i].id, { credentials: 'same-origin', cache: 'no-store' }); if (r.ok) S.vorschau[offen[i].id] = URL.createObjectURL(await r.blob()); } catch (e) { /* ohne Vorschau */ }
    }
  }

  /* ---------- Konto einer Bestellung ---------- */
  var LEISTE_INDEX = function (st) { return RB.LEISTE.findIndex(function (x) { return x.status === st; }); };
  function verlaufDatum(b, st) { var e = (b.verlauf || []).filter(function (x) { return x.status === st; }).pop(); return e ? kurzDatum(e.zeit) : ''; }
  function statusleiste(b) {
    var akt = LEISTE_INDEX(b.status);
    return '<ol class="p-leiste p-verlauf" aria-label="Bestellverlauf">' + RB.LEISTE.map(function (s, i) {
      var erledigt = i < akt || (i === akt && b.status === 'live'), aktuell = i === akt;
      return '<li class="' + (erledigt ? 'erledigt' : '') + '"' + (aktuell ? ' aria-current="step"' : '') + '><span class="n"><span class="haken" aria-hidden="true"></span>' + esc(s.titel) + (erledigt && !aktuell ? '<span class="p-sr"> (erledigt)</span>' : '') + '</span><span class="d">' + esc(i <= akt ? verlaufDatum(b, s.status) : '') + '</span></li>';
    }).join('') + '</ol>';
  }
  function zahlungText(b) {
    var z = b.zahlung || {};
    if (z.status === 'laeuft') return 'Zahlung in Bearbeitung (Lastschrift, meist 2 bis 5 Werktage).';
    if (z.status === 'fehlgeschlagen') return 'Die Zahlung ist fehlgeschlagen. Bitte erneut bezahlen, gern mit Karte.';
    if (z.status === 'kasse') return 'Zahlung offen: Die Einrichtung ist noch nicht bezahlt.';
    return 'Ihre Bestellung ist noch nicht abgeschlossen.';
  }
  function hauptaktion(b) {
    var a = b.abo || {}, inst = b.instanz, v = b.vorschau || {};
    switch (b.status) {
      case 'offen': return { text: zahlungText(b), knopf: (b.zahlung || {}).status === 'laeuft' ? '' : hauptknopf((b.zahlung || {}).status === 'fehlgeschlagen' ? 'Erneut bezahlen' : (b.zahlung || {}).status === 'kasse' ? 'Jetzt bezahlen' : 'Bestellung fortsetzen', 'fortsetzen') };
      case 'bezahlt': return { text: 'Die Einrichtung ist bezahlt. Wir melden uns innerhalb eines Werktags zu Ihrer Wunschzeit.', knopf: S.konto.rueckruf ? '' : hauptknopf('Rückruf anfordern', 'rueckruf-auf') };
      case 'einrichtung': case 'domain': return { text: b.status === 'domain' ? 'Ihre Domain ist gesichert' + (inst && inst.host ? ': ' + inst.host : '') + '. Als Nächstes gestalten wir Ihren Konfigurator und schicken Ihnen eine Vorschau.' : 'Wir richten Ihren Konfigurator ein. Logo, Fotos und Texte können Sie bis zur Freigabe ergänzen.', knopf: gestaltet(P.merkmale(b.paket)) ? hauptknopf('Wünsche ergänzen', 'wuensche') : (S.konto.rueckruf ? '' : hauptknopf('Rückruf anfordern', 'rueckruf-auf')) };
      case 'freigabe': return { text: v.freigabe && v.freigabe.version === v.version ? 'Danke für Ihre Freigabe. Wir schalten Ihren Konfigurator jetzt live.' : 'Ihr Konfigurator ist fertig. Bitte sehen Sie ihn sich an und geben Sie ihn frei, oder sagen Sie uns, was wir ändern sollen.', knopf: v.freigabe && v.freigabe.version === v.version ? '' : (v.link ? '<a class="btn ghost" href="' + esc(v.link) + '" target="_blank" rel="noopener">Vorschau ansehen</a>' : '') + hauptknopf('Freigeben', 'freigeben') + '<button type="button" class="btn ghost" data-a="aendern">Änderung wünschen</button>' };
      case 'live': {
        /* Kulanzfrist läuft: die offene Rechnung ist die nächste Aktion (Cream), der Konfigurator wird ein Ring-Knopf */
        var offen = b.abo_status === 'zahlung_offen', rechnung = !offen ? '' : a.offeneRechnung ? '<a class="btn primary" href="' + esc(a.offeneRechnung) + '" target="_blank" rel="noopener">Offene Rechnung bezahlen<span class="pf" aria-hidden="true"></span></a>' : (S.konto.partner || {}).stripe ? hauptknopf('Im Kundenportal bezahlen', 'portal') : '';
        return { titel: offen ? 'Zahlung offen' : '', text: offen ? 'Die Abbuchung für Ihr Abo hat nicht geklappt. Bitte bezahlen Sie die offene Rechnung' + (a.kulanz_bis ? ' bis ' + datum(a.kulanz_bis) : '') + ', sonst pausieren wir Ihren Konfigurator' + (inst && inst.host ? ' unter ' + inst.host : '') + '.' : 'Ihr Konfigurator ist live' + (inst && inst.host ? ' unter ' + inst.host : '') + '.',
          knopf: rechnung + (inst && inst.host ? '<a class="btn ' + (offen ? 'ghost' : 'primary') + '" href="https://' + esc(inst.host) + '/" target="_blank" rel="noopener">Konfigurator öffnen' + (offen ? '' : '<span class="pf" aria-hidden="true"></span>') + '</a>' + (inst.dashboard ? '<a class="btn ghost" href="https://' + esc(inst.host) + '/betrieb/" target="_blank" rel="noopener">Zum Dashboard</a>' : '') : '') };
      }
      case 'pausiert': return { text: 'Ihr Konfigurator ist pausiert' + (a.kulanz_bis ? ' (Zahlung offen)' : '') + '. Ihre Kunden sehen in dieser Zeit nur Ihre Kontaktdaten.', knopf: a.offeneRechnung ? '<a class="btn primary" href="' + esc(a.offeneRechnung) + '" target="_blank" rel="noopener">Offene Rechnung bezahlen<span class="pf" aria-hidden="true"></span></a>' : '' };
      case 'beendet': return { text: 'Ihr Konfigurator ist beendet' + (b.ende_am ? ' (seit ' + datum(b.ende_am) + ')' : '') + '.', knopf: '' };
      case 'storniert': return { text: 'Diese Bestellung ist storniert.' + ((b.zahlung || {}).erstattet_cent ? ' Die Einrichtungsgebühr erstatten wir auf Ihr Zahlungsmittel.' : ''), knopf: '' };
      default: return { text: '', knopf: '' };
    }
  }
  function aboKarte(b) {
    var a = b.abo || {}, t = RB.ABO_TITEL[b.abo_status] || '', zeilen = [];
    if (b.abo_status === 'zahlung_offen' && a.kulanz_bis) zeilen.push('Bitte bis ' + datum(a.kulanz_bis) + ' bezahlen, sonst pausieren wir den Konfigurator.');
    if (b.abo_status === 'gekuendigt' && a.ende) zeilen.push('Gekündigt zum ' + datum(a.ende) + '.');
    if (b.abo_status === 'aktiv' && a.bis) zeilen.push('Nächste Abbuchung am ' + datum(a.bis) + '.');
    if (a.monat) zeilen.push(paketName(b.paket) + ': ' + euro(a.monat) + ' netto im Monat.');
    /* Wechsel nach unten ist vorgemerkt und wirkt erst zum Periodenende (Befund 10) */
    if (a.wechsel && a.wechsel.paket) zeilen.push('Wechsel zu ' + paketName(a.wechsel.paket) + (a.wechsel.ab ? ' ab ' + datum(a.wechsel.ab) : ' zum Ende des Abrechnungsmonats') + '.');
    return '<section class="p-karte" aria-labelledby="h-abo"><h2 class="p-h2" id="h-abo">Abo</h2><div class="p-abo"><span class="zustand">' + esc(b.abo_status === 'zahlung_offen' ? 'Zahlung offen' : t) + '</span>' + zeilen.map(function (z) { return '<p class="p-neben">' + esc(z) + '</p>'; }).join('') + '</div>' +
      (b.abo_status === 'zahlung_offen' && a.offeneRechnung && ['live', 'pausiert'].indexOf(b.status) < 0 ? '<p><a class="p-link" href="' + esc(a.offeneRechnung) + '" target="_blank" rel="noopener">Offene Rechnung bezahlen</a></p>' : '') + '</section>'; // live und pausiert: Hauptknopf der Seite
  }
  function wunschKarte(b) {
    var w = b.wunsch || {}, k = w.konfigurator || {}, g = w.gestaltung || {}, m = P.merkmale(b.paket) || {}, ergaenzbar = ['bezahlt', 'einrichtung', 'domain', 'freigabe'].indexOf(b.status) >= 0;
    var paare = [['Name', k.name], ['Wunsch-Domains', (k.domains || []).join(', ') || (k.vorschlaege ? 'Bitte Vorschläge' : '')], ['Anfragen an', (k.eingang || []).join(', ')], m.dashboard ? ['Zugänge', (k.zugang || []).join(', ')] : null, m.farbe ? ['Farben', (g.farben || []).join(', ')] : null, m.startansicht ? ['Überschrift', g.titel] : null, ['Dateien', String((b.dateien || []).length)]].filter(Boolean);
    return '<section class="p-karte" aria-labelledby="h-wunsch"><div class="p-block-kopf"><h2 class="p-h2" id="h-wunsch">Ihre Wünsche</h2>' + (ergaenzbar && gestaltet(m) ? '<button type="button" class="p-link" data-a="wuensche">Ergänzen</button>' : '') + '</div><dl class="p-kv">' + paare.map(function (p) { return '<dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1] || '–') + '</dd>'; }).join('') + '</dl>' +
      (['bezahlt', 'einrichtung', 'domain', 'freigabe', 'live', 'pausiert'].indexOf(b.status) >= 0 ? eingangBlock(b) : '') + '</section>';
  }
  function eingangBlock(b) {
    var liste = b.instanz ? b.instanz.eingang : ((b.wunsch || {}).konfigurator || {}).eingang || [];
    var zeilen = (liste || []).map(function (x) { return typeof x === 'string' ? { mail: x, bestaetigt: null } : x; });
    if (!S.eingangOffen) return '<div class="p-block-kopf"><span class="p-label">Empfänger der Anfragen</span><button type="button" class="p-link" data-a="eingang-auf">Ändern</button></div>' + (b.instanz ? '<ul class="p-dateien">' + zeilen.map(function (x) { return '<li class="p-datei"><span class="t"><b>' + esc(x.mail) + '</b><small>' + (x.bestaetigt ? 'bestätigt' : 'Bestätigung offen') + '</small></span></li>'; }).join('') + '</ul>' : '');
    var werte = S.eingangWerte || zeilen.map(function (x) { return x.mail; });
    return '<form class="p-form" data-form="eingang" novalidate><span class="p-label">Empfänger der Anfragen</span>' + [0, 1, 2].map(function (i) { var f = fehlerZu('eingang.' + i); return '<div class="p-f' + (f ? ' fehlt' : '') + '"><label for="f-eing-' + i + '">' + (i + 1) + '. Adresse</label><input type="email" id="f-eing-' + i + '" data-eingang="' + i + '" value="' + esc(werte[i] || '') + '"' + (f ? ' aria-invalid="true"' : '') + '>' + (f ? '<p class="p-fehler">' + esc(f) + '</p>' : '') + '</div>'; }).join('') +
      '<p class="p-neben">Neue Adressen bekommen einen Link zur Bestätigung; erst danach gehen Anfragen an sie.</p><div class="p-knoepfe"><button type="button" class="btn soft" data-a="eingang-speichern">Speichern</button><button type="button" class="p-link" data-a="eingang-zu">Abbrechen</button></div></form>';
  }
  function nachrichtenKarte(b) {
    var l = (S.nachrichten || []).slice().reverse(), f = fehlerZu('nachricht');
    return '<section class="p-karte" id="nachrichten" aria-labelledby="h-nachr"><h2 class="p-h2" id="h-nachr">Nachrichten</h2>' +
      (l.length ? '<ol class="p-nachrichten">' + l.map(function (n) { return '<li class="p-nachricht' + (n.von === 'partner' ? ' eigene' : '') + (n.von !== 'partner' && !n.gelesen ? ' neu' : '') + '"><span class="wer">' + (n.von === 'partner' ? 'Sie' : n.von === 'system' ? 'eeziframes (automatisch)' : 'eeziframes') + ' · ' + esc(wann(n.zeit)) + '</span>' + esc(n.art === 'rueckruf' && n.rueckruf ? 'Rückruf gewünscht: ' + tagText(n.rueckruf.tag) + ', ' + n.rueckruf.fenster.replace('-', '–') + ' Uhr' + (n.text ? ' · ' + n.text : '') : n.text) + '</li>'; }).join('') + '</ol>' : '<p class="p-neben">Noch keine Nachrichten. Schreiben Sie uns, wir antworten per E-Mail und hier.</p>') +
      '<form class="p-form" data-form="nachricht" novalidate><div class="p-f' + (f ? ' fehlt' : '') + '"><label for="f-nachricht">Ihre Nachricht</label><textarea id="f-nachricht" data-x="nachricht" maxlength="' + R.GRENZEN.nachricht + '" rows="3"' + (f ? ' aria-invalid="true" aria-describedby="f-nachricht-e"' : '') + '>' + esc(S.nachricht || '') + '</textarea>' + (f ? '<p class="p-fehler" id="f-nachricht-e">' + esc(f) + '</p>' : '') + '</div><div class="p-knoepfe"><button type="button" class="btn soft" data-a="senden"' + (S.sendetN ? ' disabled' : '') + '>Senden</button></div></form></section>';
  }
  function rueckrufKarte(b) {
    var r = S.konto.rueckruf, st = S.stand || {};
    if (r) return '<section class="p-karte" aria-labelledby="h-rr"><h2 class="p-h2" id="h-rr">Rückruf</h2><p class="p-text">Wir rufen Sie an: <b>' + esc(tagText(r.rueckruf.tag)) + ', ' + esc(r.rueckruf.fenster.replace('-', '–')) + ' Uhr</b> unter ' + esc(r.rueckruf.tel) + '.</p><div class="p-knoepfe"><button type="button" class="p-link" data-a="rueckruf-weg" data-v="' + esc(r.id) + '">Zurückziehen</button></div></section>';
    /* Steht „Rückruf anfordern“ schon als Hauptknopf der Seite, bleibt hier nur der Text, sonst stünde der Knopf doppelt (Befund 14) */
    var imHaupt = !!b && /data-a="rueckruf-auf"/.test(hauptaktion(b).knopf || '');
    if (!S.rueckrufOffen) return '<section class="p-karte" aria-labelledby="h-rr"><h2 class="p-h2" id="h-rr">Rückruf</h2><p class="p-neben">Lieber sprechen? ' + (imHaupt ? 'Über „Rückruf anfordern“ oben wählen Sie' : 'Wählen Sie') + ' einen Werktag und ein Zeitfenster, wir rufen Sie an.</p>' + (imHaupt ? '' : '<div class="p-knoepfe"><button type="button" class="btn ghost" data-a="rueckruf-auf">Rückruf anfordern</button></div>') + '</section>';
    var w = S.rr || {}, fe = function (k) { return fehlerZu('rr.' + k); };
    return '<section class="p-karte" aria-labelledby="h-rr"><h2 class="p-h2" id="h-rr">Rückruf anfordern</h2><form class="p-form" data-form="rueckruf" novalidate>' +
      '<div class="p-f' + (fe('tag') ? ' fehlt' : '') + '"><label for="f-rr-tag">Tag</label><select id="f-rr-tag" data-rr="tag">' + (st.werktage || []).map(function (t) { return '<option value="' + t + '"' + (w.tag === t ? ' selected' : '') + '>' + esc(tagText(t)) + '</option>'; }).join('') + '</select>' + (fe('tag') ? '<p class="p-fehler">' + esc(fe('tag')) + '</p>' : '') + '</div>' +
      '<div class="p-f' + (fe('fenster') ? ' fehlt' : '') + '"><label for="f-rr-fenster">Zeitfenster</label><select id="f-rr-fenster" data-rr="fenster">' + (st.fenster || []).map(function (t) { return '<option value="' + t + '"' + (w.fenster === t ? ' selected' : '') + '>' + t.replace('-', '–') + ' Uhr</option>'; }).join('') + '</select></div>' +
      '<div class="p-f' + (fe('tel') ? ' fehlt' : '') + '"><label for="f-rr-tel">Telefon</label><input type="tel" id="f-rr-tel" data-rr="tel" autocomplete="tel" value="' + esc(w.tel != null ? w.tel : ((S.konto.partner || {}).daten || {}).tel || '') + '">' + (fe('tel') ? '<p class="p-fehler">' + esc(fe('tel')) + '</p>' : '') + '</div>' +
      '<div class="p-f"><label for="f-rr-thema">Thema</label><select id="f-rr-thema" data-rr="thema">' + (st.themen || []).map(function (t) { return '<option' + (w.thema === t ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') + '</select></div>' +
      '<div class="p-f"><label for="f-rr-text">Worum geht es? <span class="p-neben" style="font-weight:500">(optional)</span></label><input type="text" id="f-rr-text" data-rr="text" maxlength="500" value="' + esc(w.text || '') + '"></div>' +
      '<div class="p-knoepfe"><button type="button" class="btn soft" data-a="rueckruf-senden">Rückruf anfordern</button><button type="button" class="p-link" data-a="rueckruf-zu">Abbrechen</button></div></form></section>';
  }
  function rechnungenKarte() {
    var l = S.rechnungen, p = S.konto.partner || {};
    return '<section class="p-karte" id="konto" aria-labelledby="h-re"><h2 class="p-h2" id="h-re">Rechnungen und Zahlung</h2>' +
      (l === null ? '<p class="p-neben">Rechnungen werden geladen …</p>' : l.length ? '<ul class="p-rechnungen">' + l.map(function (r) { return '<li><span class="nr">' + esc(r.nr) + '</span><span class="p-neben">' + esc(kurzDatum(r.datum)) + '</span><span class="num">' + euro(r.betrag) + '</span><span class="badge ' + (r.status === 'bezahlt' ? 'ok' : r.status === 'offen' ? 'warn' : '') + '">' + esc(r.status) + '</span>' + (r.url ? '<a class="p-link" href="' + esc(r.url) + '" target="_blank" rel="noopener">Ansehen</a>' : '') + (r.pdf ? '<a class="p-link" href="' + esc(r.pdf) + '" target="_blank" rel="noopener">PDF</a>' : '') + '</li>'; }).join('') + '</ul>' : '<p class="p-neben">Noch keine Rechnungen. Die Rechnung über die Einrichtung schickt Ihnen Stripe nach der Zahlung.</p>') +
      (p.stripe ? '<div class="p-knoepfe"><button type="button" class="btn ghost" data-a="portal">Kundenportal öffnen</button></div><p class="p-neben">Zahlungsmittel ändern, alle Rechnungen, Kündigung: im Kundenportal unseres Zahlungsdienstes Stripe.</p>' : '') + '</section>';
  }
  function firmaKarte() {
    var p = S.konto.partner; if (!p) return '';
    var d = p.daten || {};
    return '<section class="p-karte" aria-labelledby="h-fi"><div class="p-block-kopf"><h2 class="p-h2" id="h-fi">Unternehmen</h2><a class="p-link" href="#firma">Ändern</a></div><dl class="p-kv"><dt>Firma</dt><dd>' + esc(p.firma) + '</dd><dt>Anschrift</dt><dd>' + esc([d.strasse, (d.plz || '') + ' ' + (d.ort || '')].filter(Boolean).join(', ')) + '</dd><dt>Ansprechpartner</dt><dd>' + esc(d.ap) + '</dd><dt>Telefon</dt><dd>' + esc(d.tel) + '</dd></dl></section>';
  }
  function schnipselKarte(b) {
    if (!b.schnipsel) return '';
    return '<section class="p-karte" aria-labelledby="h-sn"><h2 class="p-h2" id="h-sn">Auf Ihrer Website verlinken</h2><p class="p-neben">Diesen Knopf „Fenster planen“ in Ihrer Firmenfarbe bauen Sie in Ihre Website ein: HTML-Code kopieren und an der passenden Stelle einfügen.</p><label class="p-sr" for="f-schnipsel">Verlinkung zum Kopieren</label><textarea class="p-schnipsel" id="f-schnipsel" readonly rows="4">' + esc(b.schnipsel) + '</textarea><div class="p-knoepfe"><button type="button" class="btn ghost small" data-a="kopieren">Kopieren</button></div></section>';
  }
  function paketwechselKarte(b) {
    if (['live', 'pausiert', 'einrichtung', 'domain', 'freigabe', 'bezahlt'].indexOf(b.status) < 0) return '';
    var andere = P.LISTE.filter(function (x) { return x !== b.paket; }), w = (b.abo || {}).wechsel;
    /* nach unten wirkt der Wechsel erst zum Periodenende (Befund 10); ein vorgemerkter Wechsel steht hier und in der Abo-Karte */
    return '<section class="p-karte" aria-labelledby="h-pw"><h2 class="p-h2" id="h-pw">Paket wechseln</h2><p class="p-neben">Wir stellen um und melden uns mit den Kosten; nach oben wird die Differenz der Einrichtung fällig, nach unten wirkt der Wechsel zum Ende des Abrechnungsmonats.</p>' +
      (w && w.paket ? '<p class="p-neben">Vorgemerkt: Wechsel zu ' + esc(paketName(w.paket)) + (w.ab ? ' ab ' + esc(datum(w.ab)) : '') + '.</p>' : '') + '<form class="p-form" data-form="paketwechsel" novalidate><div class="p-f"><label for="f-pw">Neues Paket</label><select id="f-pw" data-x="paketNeu">' + andere.map(function (x) { return '<option value="' + x + '"' + (S.paketNeu === x ? ' selected' : '') + '>' + esc(paketName(x) + ' · ' + euro(P.preis(x).monat) + ' im Monat') + '</option>'; }).join('') + '</select></div><div class="p-knoepfe"><button type="button" class="btn ghost" data-a="paketwechsel">Wechsel anfragen</button></div></form></section>';
  }
  function bestellungSeite() {
    var b = bestellung(S.route.id);
    if (!b) return seite('<h1 class="p-titel">Diese Bestellung gibt es <span class="ak">nicht</span>.</h1><p class="p-text"><a class="p-link" href="#uebersicht">Zur Übersicht</a></p>', true);
    var h = hauptaktion(b), nachLive = ['live', 'pausiert', 'beendet'].indexOf(b.status) >= 0 && b.abo && b.abo.laeuft, ende = ['beendet', 'storniert'].indexOf(b.status) >= 0;
    var hinweis = b.status === 'pausiert' || ende ? '<p class="p-hinweis warn"><b>' + esc(RB.TITEL[b.status]) + '.</b> ' + esc(h.text) + '</p>' : '';
    var storno = b.status === 'offen' && (b.zahlung || {}).status !== 'laeuft' ? '<button type="button" class="p-link gefahr" data-a="storno">Bestellung verwerfen</button>' : b.status === 'bezahlt' ? '<button type="button" class="p-link gefahr" data-a="storno">Bestellung stornieren</button>' : '';
    seite('<div class="p-kopfblock"><p class="eyebrow kicker">Bestellung ' + esc(b.nr) + ' · ' + esc(paketName(b.paket)) + '</p><h1 class="p-titel">Ihr <span class="ak">Konfigurator</span>.</h1>' +
      (nachLive || ende ? '' : statusleiste(b)) + '</div>' + meldung() + hinweis +
      '<div class="p-raster zwei"><div class="p-spalte">' +
      (ende || b.status === 'pausiert' ? '' : '<section class="p-karte hi" aria-labelledby="h-jetzt"><h2 class="p-h2" id="h-jetzt">' + esc(h.titel || (b.status === 'live' ? 'Live' : RB.TITEL[b.status])) + '</h2><p class="p-text">' + esc(h.text) + '</p>' + (h.knopf ? '<div class="p-knoepfe">' + h.knopf + '</div>' : '') + '</section>') +
      (nachLive ? aboKarte(b) : '') + (b.status === 'pausiert' && h.knopf ? '<div class="p-knoepfe">' + h.knopf + '</div>' : '') + schnipselKarte(b) + nachrichtenKarte(b) + wunschKarte(b) +
      '</div><div class="p-spalte">' + rueckrufKarte(b) + rechnungenKarte() + firmaKarte() + paketwechselKarte(b) +
      '<section class="p-karte" aria-labelledby="h-pk"><h2 class="p-h3" id="h-pk">' + esc(paketName(b.paket)) + '</h2><p class="p-neben">Einrichtung ' + euro((b.preise || {}).einrichtung) + ' netto' + ((b.zahlung || {}).status === 'bezahlt' ? ', bezahlt' : '') + ' · monatlich ' + euro((b.abo || {}).monat || (b.preise || {}).monat) + ' netto ab dem Livegang' + (b.zustimmung ? ' · Paketbedingungen vom ' + esc(datum(b.zustimmung.stand)) : '') + '</p>' + (storno ? '<div>' + storno + '</div>' : '') + '</section>' +
      '</div></div>');
  }
  function uebersichtSeite() {
    var l = (S.konto && S.konto.bestellungen) || [];
    seite('<div class="p-kopfblock"><p class="eyebrow kicker">Kundenkonto</p><h1 class="p-titel">Ihre <span class="ak">Bestellungen</span>.</h1>' + (S.konto.betrieb ? '<p class="p-neben">Mit dieser Adresse haben Sie auch ein Konto im <a class="p-link" href="/#fensterbauer">Betriebsbereich</a>; beides bleibt getrennt.</p>' : '') + '</div>' +
      (l.length ? '<div class="p-uebersicht">' + l.map(function (b) { return '<a class="p-bestellkarte" href="#bestellung/' + esc(b.id) + '"><span class="eyebrow">' + esc(b.nr) + '</span><span class="p-h3">' + esc(paketName(b.paket)) + '</span><span class="badge ' + (b.status === 'live' ? 'ok' : ['pausiert', 'storniert', 'beendet'].indexOf(b.status) >= 0 ? 'warn' : 'acc') + '">' + esc(RB.TITEL[b.status]) + '</span>' + (b.instanz && b.instanz.host ? '<span class="p-neben">' + esc(b.instanz.host) + '</span>' : '') + '</a>'; }).join('') + '</div>' : '<p class="p-text">Sie haben noch keine Bestellung.</p>') +
      '<div class="p-knoepfe">' + hauptknopf(l.length ? 'Weiteres Paket bestellen' : 'Paket wählen', 'neu') + '</div>', false);
  }
  function firmaSeite() {
    seite('<div class="p-kopfblock"><p class="eyebrow kicker">Kundenkonto</p><h1 class="p-titel">Ihr <span class="ak">Unternehmen</span>.</h1><p class="p-lead">Änderungen gelten auch für Ihre künftigen Rechnungen.</p></div>' + meldung() + schrittFirma() +
      '<div class="p-knoepfe ende stapel"><a class="btn ghost" href="#uebersicht">Zurück</a>' + hauptknopf('Speichern', 'firma-speichern') + '</div>', true);
  }
  function wuenscheSeite() {
    var b = bestellung(S.route.id);
    if (!b) return bestellungSeite();
    seite('<div class="p-kopfblock"><p class="eyebrow kicker">Bestellung ' + esc(b.nr) + '</p><h1 class="p-titel">Wünsche <span class="ak">ergänzen</span>.</h1><p class="p-lead">Bis zur Freigabe nehmen wir Logo, Fotos, Farben und Texte gern noch an.</p></div>' + meldung() + schrittGestaltung(b) +
      '<div class="p-knoepfe ende stapel"><a class="btn ghost" href="#bestellung/' + esc(b.id) + '">Zurück</a>' + hauptknopf('Speichern', 'wuensche-speichern') + '</div>', true);
  }
  function dankeSeite() {
    var d = S.danke || {}, b = bestellung(S.route.id);
    var titel = d.bezahlt ? 'Danke, die Einrichtung ist <span class="ak">bezahlt</span>.' : d.laeuft ? 'Danke, Ihre Lastschrift ist <span class="ak">unterwegs</span>.' : 'Die Zahlung ist noch <span class="ak">offen</span>.';
    var text = d.bezahlt ? 'Wir melden uns innerhalb eines Werktags zu Ihrer Wunschzeit. Die Rechnung schickt Ihnen Stripe per E-Mail.' : d.laeuft ? 'Das dauert meist 2 bis 5 Werktage. Sobald sie gutgeschrieben ist, beginnen wir mit der Einrichtung und melden uns.' : (d.fehler || 'Sie können die Zahlung jederzeit im Kundenkonto abschließen.');
    seite('<section class="p-karte p-danke">' + (d.bezahlt ? '<div class="okmark-l" data-lottie="fertig" aria-hidden="true"></div>' : '') + '<p class="eyebrow kicker">' + (b ? 'Bestellung ' + esc(b.nr) : 'Bestellung') + '</p><h1 class="p-titel">' + titel + '</h1><p class="p-text">' + esc(text) + '</p><div class="p-knoepfe">' + hauptknopf('Zum Kundenkonto', 'konto') + '</div></section>', true);
    if (window.Lottie && d.bezahlt) setTimeout(function () { window.Lottie.auf(wurzel); }, 50);
  }

  /* ---------- Dialoge ---------- */
  function dialogHtml() {
    var d = S.dialog, inhalt = '';
    if (d.art === 'frisch') inhalt = '<h2 id="dlg-t">Bitte kurz bestätigen</h2><p class="p-text">Für Zahlungen und Rechnungen fragen wir zur Sicherheit einen neuen Code ab.</p>' + anmeldeForm(false).replace('data-form="anmelden"', 'data-form="frisch"') + '<button type="button" class="p-link" data-a="dialog-zu">Abbrechen</button>';
    if (d.art === 'freigeben') inhalt = '<h2 id="dlg-t">Konfigurator freigeben?</h2><p class="p-text">Mit dem Livegang beginnt Ihr Abo: ' + esc(euro(d.monat)) + ' netto im Monat, monatlich kündbar.</p><div class="p-knoepfe stapel"><button type="button" class="btn ghost" data-a="dialog-zu">Abbrechen</button>' + hauptknopf('Freigeben', 'freigeben-ok') + '</div>';
    if (d.art === 'aendern') inhalt = '<h2 id="dlg-t">Was sollen wir ändern?</h2><div class="p-f' + (fehlerZu('text') ? ' fehlt' : '') + '"><label for="f-aend">Ihre Änderungswünsche</label><textarea id="f-aend" data-x="aenderung" rows="5" maxlength="' + R.GRENZEN.nachricht + '">' + esc(S.aenderung || '') + '</textarea>' + (fehlerZu('text') ? '<p class="p-fehler">' + esc(fehlerZu('text')) + '</p>' : '') + '</div><div class="p-knoepfe stapel"><button type="button" class="btn ghost" data-a="dialog-zu">Abbrechen</button>' + hauptknopf('Senden', 'aendern-ok') + '</div>';
    if (d.art === 'storno') inhalt = '<h2 id="dlg-t">' + (d.bezahlt ? 'Bestellung stornieren?' : 'Bestellung verwerfen?') + '</h2><p class="p-text">' + (d.bezahlt ? 'Wir erstatten die Einrichtungsgebühr voll auf Ihr Zahlungsmittel; das dauert meist 5 bis 10 Tage. Zur Sicherheit fragen wir einen neuen Code ab.' : 'Ihre Angaben und Dateien zu dieser Bestellung werden verworfen.') + '</p>' + meldung() + '<div class="p-knoepfe stapel"><button type="button" class="btn ghost" data-a="dialog-zu">Behalten</button><button type="button" class="btn danger" data-a="storno-ok">' + (d.bezahlt ? 'Stornieren' : 'Verwerfen') + '</button></div>';
    return '<div class="p-blatt-bg" data-a="dialog-zu"></div><div class="p-blatt" role="dialog" aria-modal="true" aria-labelledby="dlg-t">' + inhalt + '</div>';
  }

  /* ---------- Zeichnen ---------- */
  function neuZeichnen(fehlerFokus, schrittWechsel) {
    var r = S.route, k = S.konto, aktiv = document.activeElement, aktivId = aktiv && aktiv.id;
    if (!k) return;
    if (r.art === 'danke') dankeSeite();
    else if (r.art === 'bestellen') formularSeite();
    else if (!k.angemeldet) anmeldenSeite();
    else if (r.art === 'bestellung') bestellungSeite();
    else if (r.art === 'wuensche') wuenscheSeite();
    else if (r.art === 'firma') firmaSeite();
    else uebersichtSeite();
    if (schrittWechsel) { fokusTitel(); if (!ruhig()) window.scrollTo(0, 0); var h1 = wurzel.querySelector('.p-titel'); status(r.art === 'bestellen' && S.f ? 'Schritt ' + (S.schritt + 1) + ': ' + ((schrittTitel() || {}).t || '') : (h1 ? h1.textContent : '')); return; }
    if (S.dialog) { var d = wurzel.querySelector('.p-blatt input:not([readonly]), .p-blatt textarea, .p-blatt .btn.primary, .p-blatt .btn'); if (d && (!aktivId || !document.getElementById(aktivId) || !wurzel.querySelector('.p-blatt #' + aktivId))) d.focus(); else if (aktivId && document.getElementById(aktivId)) document.getElementById(aktivId).focus(); return; }
    if (!fehlerFokus && aktivId && document.getElementById(aktivId)) { try { document.getElementById(aktivId).focus({ preventScroll: true }); } catch (e) { /* ok */ } }
  }

  async function neuRoute() {
    S.route = routeLesen(); S.fehler = {}; S.meldung = ''; S.dialog = null; S.rueckrufOffen = false; S.eingangOffen = false;
    var r = S.route, k = S.konto;
    if (r.art === 'bestellen') {
      var b = r.id ? bestellung(r.id) : null;
      if (r.id && (!b || b.status !== 'offen')) { gehe('bestellung/' + r.id); return; }
      S.f = formularFuer(b);
      if (r.paket && !b) S.f.paket = r.paket;
      /* Neue Bestellung: zuerst das Paket mit Preis (vorgewählt); nach dem Neuladen der gemerkte Schritt. Angefangene Bestellung: der
         nächste offene Schritt (oder der gemerkte, wenn er davor liegt) */
      var gemerkt = merk(formSchluessel()), offenBis = ersterOffenerSchritt(b);
      S.schritt = b ? offenBis : 0;
      if (gemerkt && typeof gemerkt.schritt === 'number' && gemerkt.schritt > 0 && (!b || gemerkt.schritt < S.schritt)) S.schritt = Math.min(gemerkt.schritt, offenBis);
      if (!S.f.paket) S.schritt = 0;
      if (S.schritt === 1 && k.angemeldet) S.schritt = 2;
      if (b) await vorschauLaden(b);
      neuZeichnen(false, true); return;
    }
    if (!k.angemeldet) { S.mail = S.mail || ''; neuZeichnen(false, true); return; }
    if (r.art === '' || r.art === 'anmelden') {
      var l = k.bestellungen || [];
      if (l.length === 1) { ersetzeHash('bestellung/' + l[0].id); S.route = routeLesen(); }
      else if (!l.length) { ersetzeHash('bestellen'); return neuRoute(); }
      else { ersetzeHash('uebersicht'); S.route = routeLesen(); }
    }
    if (S.route.art === 'firma') { S.f = formularFuer(null); }
    if (S.route.art === 'wuensche') { var bw = bestellung(S.route.id); S.f = formularFuer(bw); await vorschauLaden(bw); }
    if (S.route.art === 'bestellung') { S.nachrichten = null; S.rechnungen = null; neuZeichnen(false, true); kontoNachladen(S.route.id); return; }
    neuZeichnen(false, true);
  }
  async function kontoNachladen(id) {
    try { var j = await api('/api/partner/nachrichten'); S.nachrichten = j.nachrichten; } catch (e) { S.nachrichten = []; }
    try { var r = await api('/api/partner/rechnungen'); S.rechnungen = r.rechnungen; } catch (e) { S.rechnungen = []; }
    if (S.route.art === 'bestellung' && S.route.id === id) neuZeichnen();
    if ((S.nachrichten || []).some(function (n) { return n.von !== 'partner' && !n.gelesen; })) api('/api/partner/nachrichten/gelesen', {}).catch(function () { return null; });
  }

  /* ---------- Aktionen ---------- */
  var AKTIONEN = {
    abmelden: async function () { try { await api('/api/partner/abmelden', {}); } catch (e) { /* trotzdem */ } S.konto = { angemeldet: false }; S.mail = ''; location.hash = 'anmelden'; neuRoute(); },
    'code-senden': function () { return codeSenden(); },
    'code-pruefen': function () {
      if (S.dialog && S.dialog.art === 'frisch') return codePruefen(function () { S.dialog = null; var w = frischWarten; frischWarten = null; neuZeichnen(); if (w) w.ja(); });
      if (S.route.art === 'bestellen') return codePruefen(function () { S.f = formularFuer(S.route.id ? bestellung(S.route.id) : null); S.f.paket = S.f.paket || S.route.paket || (merk('eezi.partner.entwurf') || {}).paket || ''; S.schritt = ersterOffenerSchritt(S.route.id ? bestellung(S.route.id) : null); neuZeichnen(false, true); });
      return codePruefen();
    },
    'code-neu': function () { S.codeGesendet = false; S.code = ''; S.fehler = {}; neuZeichnen(); var m = document.getElementById('f-mail'); if (m) m.focus(); },
    paket: function (el) { S.f.paket = el.getAttribute('data-v'); delete S.fehler.paket; formMerken(); merk('eezi.partner.entwurf', { paket: S.f.paket }); if (window.Haptik) window.Haptik.tick(); neuZeichnen(); var x = wurzel.querySelector('[data-a="paket"][data-v="' + S.f.paket + '"]'); if (x) x.focus(); },
    weiter: function () { return weiter(); },
    zurueck: function () { var l = schritte(S.f.paket || 'essential'); S.fehler = {}; S.meldung = ''; S.schritt = Math.max(0, S.schritt - 1); if (l[S.schritt].k === 'mail' && S.konto.angemeldet) S.schritt = Math.max(0, S.schritt - 1); formMerken(); neuZeichnen(false, true); },
    schritt: function (el) { S.schritt = Number(el.getAttribute('data-v')) || 0; S.fehler = {}; formMerken(); neuZeichnen(false, true); },
    tag: function (el) { var t = el.getAttribute('data-v'), e = S.f.firma.erreichbar, i = e.tage.indexOf(t); if (i >= 0) e.tage.splice(i, 1); else e.tage.push(t); formMerken(); neuZeichnen(); var x = document.getElementById(t === 'mo' ? 'f-erreichbar-tage' : 'f-tag-' + t); if (x) x.focus(); },
    kanal: function (el) { S.f.firma.erreichbar.kanal = el.getAttribute('data-v'); formMerken(); neuZeichnen(); var x = wurzel.querySelector('[data-a="kanal"][data-v="' + S.f.firma.erreichbar.kanal + '"]'); if (x) x.focus(); },
    domain: function (el) { return domainPruefen(Number(el.getAttribute('data-v'))); },
    'zugang-mehr': function () { S.f.konfigurator.zugang.push(''); neuZeichnen(); var x = document.getElementById(fid('konfigurator.zugang.' + (S.f.konfigurator.zugang.length - 1))); if (x) x.focus(); },
    'farbe-mehr': function () { if (S.f.gestaltung.farben.length < R.GRENZEN.farben) S.f.gestaltung.farben.push(''); neuZeichnen(); },
    'datei-weg': async function (el) { var id = S.route.id; try { var j = await api('/api/partner/bestellungen/' + id + '/datei/' + el.getAttribute('data-v'), null, 'DELETE'); bestellungSetzen(j.bestellung); toast('Entfernt'); } catch (e) { S.meldung = e.message; } neuZeichnen(); },
    kasse: function () { return kasse(); },
    anfragen: function () { return anfragen(); },
    konto: function () { S.danke = null; try { history.replaceState(null, '', location.pathname + '#bestellung/' + S.route.id); } catch (e) { /* ok */ } neuRoute(); },
    neu: function () { gehe('bestellen'); },
    fortsetzen: function () { var b = bestellung(S.route.id); gehe('bestellen/' + b.paket + '/' + b.id); },
    wuensche: function () { gehe('bestellung/' + S.route.id + '/wuensche'); },
    'wuensche-speichern': async function () {
      var rg = RB.gestaltung(S.f.gestaltung); S.fehler = {}; S.meldung = '';
      if (!rg.ok) { S.fehler = rg.fehler; return zeigeFehler(); }
      S.sendet = true; neuZeichnen();
      try { bestellungSetzen((await api('/api/partner/bestellungen/' + S.route.id, { gestaltung: S.f.gestaltung }, 'PATCH')).bestellung); merk(formSchluessel(), null); S.sendet = false; toast('Gespeichert'); gehe('bestellung/' + S.route.id); } catch (e) { S.sendet = false; serverFehler(e, 'gestaltung'); zeigeFehler(); }
    },
    'firma-speichern': async function () {
      var r = RB.firma(S.f.firma); S.fehler = {}; S.meldung = '';
      if (!r.ok) { S.fehler = r.fehler; return zeigeFehler(); }
      S.sendet = true; neuZeichnen();
      try { S.konto.partner = (await api('/api/partner/firma', S.f.firma)).partner; merk(formSchluessel(), null); S.sendet = false; toast('Gespeichert'); gehe('uebersicht'); } catch (e) { S.sendet = false; serverFehler(e); zeigeFehler(); }
    },
    senden: async function () {
      var t = String(S.nachricht || '').trim(); S.fehler = {};
      if (!t) { S.fehler.nachricht = 'Bitte eine Nachricht schreiben.'; return neuZeichnen(true); }
      S.sendetN = true; neuZeichnen();
      try { var j = await api('/api/partner/nachrichten', { text: t, bestellung: S.route.id }); S.nachrichten = [j.nachricht].concat(S.nachrichten || []); S.nachricht = ''; toast('Nachricht gesendet'); } catch (e) { S.fehler.nachricht = e.message; }
      S.sendetN = false; neuZeichnen();
    },
    'rueckruf-auf': function () { S.rueckrufOffen = true; S.rr = { tag: (S.stand.werktage || [])[1] || (S.stand.werktage || [])[0], fenster: '10-12', thema: (S.stand.themen || [])[0] }; neuZeichnen(); var x = document.getElementById('f-rr-tag'); if (x) x.focus(); },
    'rueckruf-zu': function () { S.rueckrufOffen = false; S.fehler = {}; neuZeichnen(); },
    'rueckruf-senden': async function () {
      S.fehler = {}; var w = S.rr || {};
      if (!R.telOk(w.tel != null ? w.tel : ((S.konto.partner || {}).daten || {}).tel)) { S.fehler['rr.tel'] = 'Bitte eine Telefonnummer mit mindestens 6 Ziffern eingeben.'; return neuZeichnen(true); }
      try { var j = await api('/api/partner/rueckruf', { tag: w.tag, fenster: w.fenster, tel: w.tel != null ? w.tel : ((S.konto.partner || {}).daten || {}).tel, thema: w.thema, text: w.text, bestellung: S.route.id }); S.konto.rueckruf = j.rueckruf; S.rueckrufOffen = false; S.nachrichten = [j.rueckruf].concat(S.nachrichten || []); toast('Rückruf vorgemerkt'); }
      catch (e) { if (e.felder) Object.keys(e.felder).forEach(function (k) { S.fehler['rr.' + k] = e.felder[k]; }); else S.meldung = e.message; }
      neuZeichnen();
    },
    'rueckruf-weg': async function (el) { try { await api('/api/partner/rueckruf/' + el.getAttribute('data-v'), null, 'DELETE'); S.konto.rueckruf = null; toast('Rückrufwunsch zurückgezogen'); } catch (e) { S.meldung = e.message; } neuZeichnen(); },
    freigeben: function () { var b = bestellung(S.route.id); S.dialog = { art: 'freigeben', monat: (b.abo && b.abo.monat) || (b.preise || {}).monat }; neuZeichnen(); },
    'freigeben-ok': async function () {
      var b = bestellung(S.route.id); S.sendet = true; neuZeichnen();
      try { bestellungSetzen((await api('/api/partner/bestellungen/' + b.id + '/freigabe', { aktion: 'freigeben', version: b.vorschau.version })).bestellung); S.dialog = null; toast('Freigegeben. Danke!'); } catch (e) { S.dialog = null; S.meldung = e.message; }
      S.sendet = false; neuZeichnen();
    },
    aendern: function () { S.dialog = { art: 'aendern' }; S.fehler = {}; neuZeichnen(); },
    'aendern-ok': async function () {
      var b = bestellung(S.route.id), t = String(S.aenderung || '').trim();
      if (t.length < 3) { S.fehler.text = 'Bitte beschreiben Sie kurz, was wir ändern sollen.'; return neuZeichnen(true); }
      S.sendet = true; neuZeichnen();
      try { bestellungSetzen((await api('/api/partner/bestellungen/' + b.id + '/freigabe', { aktion: 'aendern', version: b.vorschau.version, text: t })).bestellung); S.dialog = null; S.aenderung = ''; toast('Änderungswunsch gesendet'); kontoNachladen(b.id); } catch (e) { S.fehler.text = e.message; }
      S.sendet = false; neuZeichnen();
    },
    storno: function () { var b = bestellung(S.route.id); S.dialog = { art: 'storno', bezahlt: b.status === 'bezahlt' }; neuZeichnen(); },
    'storno-ok': async function () {
      var b = bestellung(S.route.id);
      try { var j = await api('/api/partner/bestellungen/' + b.id + '/stornieren', {}); bestellungSetzen(j.bestellung); S.dialog = null; toast(b.status === 'bezahlt' ? 'Storniert, die Erstattung läuft' : 'Bestellung verworfen'); merk('eezi.partner.formular.' + b.id, null); }
      catch (e) { S.meldung = e.message; }
      neuZeichnen();
    },
    'dialog-zu': function () { if (S.dialog && S.dialog.art === 'frisch' && frischWarten) { var w = frischWarten; frischWarten = null; w.nein(fehler('Abgebrochen.', { still: true })); } S.dialog = null; S.fehler = {}; S.meldung = ''; neuZeichnen(); },
    portal: async function () { try { var j = await api('/api/partner/portal', {}); location.assign(j.url); } catch (e) { if (!e.still) { S.meldung = e.message; neuZeichnen(); } } },
    'eingang-auf': function () { S.eingangOffen = true; S.eingangWerte = null; neuZeichnen(); var x = document.getElementById('f-eing-0'); if (x) x.focus(); },
    'eingang-zu': function () { S.eingangOffen = false; S.fehler = {}; neuZeichnen(); },
    'eingang-speichern': async function () {
      var b = bestellung(S.route.id), werte = [0, 1, 2].map(function (i) { var x = document.getElementById('f-eing-' + i); return x ? x.value.trim() : ''; }); S.eingangWerte = werte; S.fehler = {};
      try { var j = await api('/api/partner/bestellungen/' + b.id + '/eingang', { mails: werte }); bestellungSetzen(j.bestellung); S.eingangOffen = false; toast('Gespeichert. Neue Adressen bekommen einen Bestätigungslink.'); }
      catch (e) { if (e.felder) S.fehler = e.felder; else S.meldung = e.message; }
      neuZeichnen();
    },
    paketwechsel: async function () {
      var b = bestellung(S.route.id), neu = S.paketNeu || P.LISTE.filter(function (x) { return x !== b.paket; })[0];
      try { await api('/api/partner/bestellungen/' + b.id + '/paketwechsel', { paket: neu }); toast('Anfrage gesendet, wir melden uns.'); kontoNachladen(b.id); } catch (e) { S.meldung = e.message; neuZeichnen(); }
    },
    'neu-laden': function () { location.reload(); },
    kopieren: function () { var t = document.getElementById('f-schnipsel'); if (!t) return; t.select(); try { navigator.clipboard.writeText(t.value).then(function () { toast('Kopiert'); }, function () { document.execCommand('copy'); toast('Kopiert'); }); } catch (e) { document.execCommand('copy'); toast('Kopiert'); } }
  };

  /* ---------- Ereignisse ---------- */
  wurzel.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-a]'); if (!el || !wurzel.contains(el)) return;
    var a = el.getAttribute('data-a'); if (!AKTIONEN[a]) return;
    ev.preventDefault();
    Promise.resolve(AKTIONEN[a](el)).catch(function (e) { if (e && e.anmelden) { neuRoute(); return; } if (e && e.still) return; S.meldung = (e && e.message) || 'Da ist etwas schiefgegangen.'; neuZeichnen(); });
  });
  wurzel.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.hasAttribute('data-f')) {
      wertSetzen(t.getAttribute('data-f'), t.value); formMerken();
      /* eingetippte Farbe: das Farbfeld daneben zeigt sie gleich mit */
      var fm = /^gestaltung\.farben\.(\d)$/.exec(t.getAttribute('data-f')), wahl = fm && document.querySelector('input[data-farbe="' + fm[1] + '"]');
      if (wahl && /^#[0-9a-f]{6}$/i.test(t.value.trim())) wahl.value = t.value.trim().toLowerCase();
    }
    else if (t.hasAttribute('data-farbe')) { var i = Number(t.getAttribute('data-farbe')); S.f.gestaltung.farben[i] = t.value; var x = document.getElementById(fid('gestaltung.farben.' + i)); if (x) x.value = t.value; formMerken(); }
    else if (t.hasAttribute('data-x')) { var k = t.getAttribute('data-x'); S[k] = t.value; }
    else if (t.hasAttribute('data-rr')) { S.rr = S.rr || {}; S.rr[t.getAttribute('data-rr')] = t.value; }
  });
  wurzel.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.hasAttribute('data-c')) { wertSetzen(t.getAttribute('data-c'), t.checked); formMerken(); var k = t.getAttribute('data-c').split('.').pop(); if (S.fehler[k] && t.checked) { delete S.fehler[k]; } }
    else if (t.hasAttribute('data-f') && t.tagName === 'SELECT') { wertSetzen(t.getAttribute('data-f'), t.value); formMerken(); }
    else if (t.hasAttribute('data-rr')) { S.rr = S.rr || {}; S.rr[t.getAttribute('data-rr')] = t.value; }
    else if (t.hasAttribute('data-x') && t.tagName === 'SELECT') S[t.getAttribute('data-x')] = t.value;
    else if (t.hasAttribute('data-datei') && t.files && t.files.length) { var art = t.getAttribute('data-datei'), files = Array.prototype.slice.call(t.files); t.value = ''; dateienHochladen(art, files); }
  });
  wurzel.addEventListener('submit', function (ev) { ev.preventDefault(); });
  wurzel.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && S.dialog) { AKTIONEN['dialog-zu'](); return; }
    if (ev.key !== 'Enter' || ev.target.tagName === 'TEXTAREA' || ev.target.tagName === 'BUTTON' || ev.target.tagName === 'A') return;
    var form = ev.target.closest('form'); if (!form || ev.target.type === 'checkbox') return;
    var art = form.getAttribute('data-form');
    var knopf = S.dialog ? wurzel.querySelector('.p-blatt .btn.primary') : form.querySelector('.btn.primary') || (['firma', 'konfigurator', 'gestaltung', 'pruefen'].indexOf(art) >= 0 ? wurzel.querySelector('main > .p-knoepfe .btn.primary') : form.querySelector('.btn'));
    if (knopf) { ev.preventDefault(); knopf.click(); }
  });
  window.addEventListener('hashchange', function () { if (S.konto) neuRoute(); });

  /* ---------- Start ---------- */
  async function start() {
    try { S.stand = await api('/api/partner/stand'); await kontoLaden(); }
    catch (e) { wurzel.innerHTML = kopf() + '<main class="p-seite p-schmal"><h1 class="p-titel">Gerade nicht <span class="ak">erreichbar</span>.</h1><p class="p-text">' + esc(e.message) + '</p><p><button type="button" class="btn primary" data-a="neu-laden">Neu laden</button></p></main>'; return; }
    var q = new URLSearchParams(location.search), sess = q.get('kasse');
    S.route = routeLesen();
    if (sess && S.route.art === 'bestellung' && S.konto.angemeldet) {
      S.route.art = 'danke';
      try { var j = await api('/api/partner/bestellungen/' + S.route.id + '/kasse/pruefen?session=' + encodeURIComponent(sess)); bestellungSetzen(j.bestellung); S.danke = { bezahlt: j.bezahlt, laeuft: j.laeuft }; if (j.bezahlt && window.Haptik) window.Haptik.ok(); merk('eezi.partner.formular.' + S.route.id, null); merk('eezi.partner.entwurf', null); }
      catch (e) { S.danke = { fehler: e.message }; }
      try { history.replaceState(null, '', location.pathname + '#bestellung/' + S.route.id); } catch (e) { /* ok */ }
      neuZeichnen(false, true); return;
    }
    if (q.get('portal')) { try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* ok */ } }
    if (location.hash === '#konto') ersetzeHash('');
    neuRoute();
  }
  start();
})();

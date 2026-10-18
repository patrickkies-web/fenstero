/* eeziframes · Zentrale des Inhabers (Oberfläche). Daten kommen nur nach der Anmeldung von /api/zentrale/… (functions/api/zentrale.js).
   Die Sitzung ist ein Cookie, das kein Skript lesen kann; jede Anfrage trägt x-zentrale: 1. Nichts wird im Browser gespeichert.
   Seiten über den Anker: #uebersicht, #betriebe, #betrieb/<id>, #kaeufe, #statistik, #protokoll, #einstellungen.
   Übersicht, Betriebe, ein Betrieb, Käufe und Statistik zeigen einen Zeitraum (S.zeitraum, für alle Seiten derselbe). */
(function () {
  'use strict';
  var wurzel = document.getElementById('z');
  var S = { status: null, seite: 'uebersicht', id: '', daten: {}, laedt: false, fehler: '', dialog: null, toast: '', suche: '', filter: 'alle', sortierung: 'neu', zeitraum: { art: '30', von: '', bis: '' }, zrFrei: false, zrFehler: '', einblick: {}, protokollArt: '', kaufSuche: '', zweiFaktor: null, anmeldungen: null, anmeldenFehler: '', sendet: false };

  /* ---------- Werkzeuge ---------- */
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var zahl = function (n) { return (Number(n) || 0).toLocaleString('de-DE'); };
  var euro = function (n) { n = Number(n) || 0; return (Number.isInteger(n) ? n.toLocaleString('de-DE') : n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + '\u00a0€'; };
  var wann = function (iso) { if (!iso) return '–'; var d = new Date(iso); return isNaN(d) ? esc(iso) : d.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }); };
  var datum = function (iso) { if (!iso) return '–'; var d = new Date(iso); return isNaN(d) ? esc(iso) : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Berlin' }); };
  var vor = function (iso) {
    if (!iso) return '–'; var t = Date.parse(iso); if (isNaN(t)) return esc(iso);
    var m = Math.round((Date.now() - t) / 60000);
    if (m < 2) return 'gerade eben'; if (m < 60) return 'vor ' + m + ' Minuten';
    var h = Math.round(m / 60); if (h < 24) return 'vor ' + h + (h === 1 ? ' Stunde' : ' Stunden');
    var d = Math.round(h / 24); if (d < 45) return 'vor ' + d + (d === 1 ? ' Tag' : ' Tagen');
    return 'am ' + datum(iso);
  };
  var nW = function (n, eins, viele) { return zahl(n) + ' ' + (n === 1 ? eins : viele); };
  var TARIF = { service: 'Start', abo: 'Abo 10', plus: 'Plus' };
  var STATUS = { erstellt: 'angelegt', gesendet: 'verschickt', geoeffnet: 'geöffnet', arbeit: 'misst gerade', eingegangen: 'Aufmaß da', abgelaufen: 'abgelaufen', deaktiviert: 'deaktiviert' };
  var PHASE = { neu: 'neu', angebot: 'Angebot', termin: 'Termin', auftrag: 'Auftrag', verloren: 'verloren' };
  var laender = null; try { laender = new Intl.DisplayNames(['de'], { type: 'region' }); } catch (e) { laender = null; }
  var landName = function (c) { if (!c || c === '??') return 'unbekannt'; try { return (laender && laender.of(c)) || c; } catch (e) { return c; } };
  var LOGO = '<svg viewBox="0 0 64 64" aria-hidden="true" class="z-logo"><rect class="fi-kachel" width="64" height="64" rx="10" fill="#000"/><g class="fi-licht" fill="#fff"><path class="fi-decke" d="M26.4 12.2 44.4 19.7 56.3 15.3 42 6.6Z"/><path class="fi-fenster" d="M45 22 57 17.6V41.9L45 39.8Z"/><path class="fi-strahl" d="M44.2 41 55.9 43.3 11.7 64H10A10 10 0 0 1 0 54Z"/></g><rect class="fi-rand" x=".5" y=".5" width="63" height="63" rx="9.5" fill="none" stroke="#000" stroke-opacity=".1"/></svg>';
  var MARKE = '<a class="z-marke" href="#uebersicht">' + LOGO + '<span><span class="wm" translate="no"><b>eezi</b>frames</span><small>Zentrale</small></span></a>';

  async function api(pfad, body, roh) {
    var init = { method: body ? 'POST' : 'GET', headers: { accept: 'application/json', 'x-zentrale': '1' }, credentials: 'same-origin', cache: 'no-store' };
    if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); }
    var r = await fetch(pfad, init);
    if (roh && r.ok) return r;
    var j = await r.json().catch(function () { return null; });
    if (r.status === 401 && j && j.abgemeldet) { S.status = Object.assign({}, S.status || {}, { angemeldet: false }); S.anmeldenFehler = 'Die Sitzung ist abgelaufen. Bitte neu anmelden.'; S.dialog = null; render(); var e0 = new Error('Bitte neu anmelden.'); e0.still = true; throw e0; }
    if (!r.ok || !j || j.ok === false) { var e = new Error((j && j.fehler) || 'Der Server antwortet gerade nicht.'); e.status = r.status; throw e; }
    return j;
  }
  var toastZeit = null;
  function toast(t) { S.toast = t; var el = document.getElementById('z-toast'); if (el) { el.textContent = t; el.classList.add('an'); } clearTimeout(toastZeit); toastZeit = setTimeout(function () { S.toast = ''; var x = document.getElementById('z-toast'); if (x) x.classList.remove('an'); }, 3200); }
  async function herunterladen(pfad, vorschlag, body) {
    var r = await api(pfad, body || null, true), blob = await r.blob(), cd = r.headers.get('content-disposition') || '', m = /filename="([^"]+)"/.exec(cd);
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = m ? m[1] : vorschlag; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------- Bausteine ---------- */
  var badge = function (text, ton) { return '<span class="badge' + (ton ? ' ' + ton : '') + '">' + esc(text) + '</span>'; };
  var stat = function (titel, wert, unter, ton) { return '<div class="stat' + (ton ? ' tone-' + ton : '') + '"><small>' + esc(titel) + '</small><b class="num">' + wert + '</b>' + (unter ? '<span>' + unter + '</span>' : '') + '</div>'; };
  var kv = function (paare) { return '<dl class="z-kv">' + paare.filter(Boolean).map(function (p) { return '<dt>' + esc(p[0]) + '</dt><dd>' + p[1] + '</dd>'; }).join('') + '</dl>'; };
  var leer = function (titel, text) { return '<div class="z-leer"><b>' + esc(titel) + '</b>' + (text ? '<span>' + text + '</span>' : '') + '</div>'; };
  var aussen = function (href, text) { return href && /^https:\/\//.test(href) ? '<a class="z-a" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(text) + '</a>' : '–'; };
  var kopf = function (titel, unter, rechts) { return '<header class="z-kopf"><div><h1 class="z-h">' + esc(titel) + '</h1>' + (unter ? '<p class="z-unter">' + unter + '</p>' : '') + '</div>' + (rechts ? '<div class="z-kopf-r">' + rechts + '</div>' : '') + '</header>'; };
  /* Balken: eine Reihe, gleiche Skala, Zahl über dem höchsten, Achse mit Anfang und Ende; Werte stehen zusätzlich im title */
  function balken(reihe, opt) {
    opt = opt || {}; var max = Math.max.apply(null, reihe.map(function (x) { return x.wert; }).concat([opt.min || 1]));
    var n = reihe.length, b = 100 / n;
    var saeulen = reihe.map(function (x, i) {
      var h = x.wert ? Math.max(2, Math.round((x.wert / max) * 100)) : 0, h2 = x.wert2 ? Math.max(1, Math.round((x.wert2 / max) * 100)) : 0;
      return '<g><title>' + esc(x.titel + ': ' + zahl(x.wert) + (x.wert2 != null ? ' · ' + (opt.name2 || '') + ' ' + zahl(x.wert2) : '')) + '</title>' +
        '<rect x="' + (i * b + b * 0.14).toFixed(2) + '" y="' + (100 - h) + '" width="' + (b * 0.72).toFixed(2) + '" height="' + h + '" rx="0.6" class="' + (x.wert2 != null ? 'z-b2' : 'z-b1') + '"/>' +
        (x.wert2 != null ? '<rect x="' + (i * b + b * 0.14).toFixed(2) + '" y="' + (100 - h2) + '" width="' + (b * 0.72).toFixed(2) + '" height="' + h2 + '" rx="0.6" class="z-b1"/>' : '') + '</g>';
    }).join('');
    return '<figure class="z-chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="' + esc(opt.label || '') + '">' + saeulen + '</svg>' +
      '<figcaption class="z-achse"><span>' + esc(reihe.length ? reihe[0].kurz : '') + '</span><span>höchster Wert ' + zahl(max) + '</span><span>' + esc(reihe.length ? reihe[reihe.length - 1].kurz : '') + '</span></figcaption></figure>';
  }
  /* Rangliste mit Anteil als Balken */
  function rang(titel, liste, namen, leerText) {
    var summe = liste.reduce(function (s, x) { return s + x.n; }, 0) || 1;
    return '<section class="z-karte"><h2 class="z-h2">' + esc(titel) + '</h2>' + (liste.length ? '<ol class="z-rang">' + liste.slice(0, 10).map(function (x) {
      var anteil = Math.round((x.n / summe) * 100);
      return '<li><span class="z-rang-n">' + esc(namen ? namen(x) : x.name) + '</span><span class="z-rang-w num">' + zahl(x.n) + '<small>' + anteil + '\u00a0%</small></span><span class="z-rang-b" style="--w:' + Math.max(1, anteil) + '%"></span></li>';
    }).join('') + '</ol>' : '<p class="z-neben">' + esc(leerText || 'Noch keine Daten.') + '</p>') + '</section>';
  }
  /* Trichter: Stufen mit Anzahl und Anteil an der ersten Stufe */
  function trichter(titel, stufen, hinweis) {
    var erste = stufen.length ? stufen[0].n : 0;
    return '<section class="z-karte"><h2 class="z-h2">' + esc(titel) + '</h2><ol class="z-trichter">' + stufen.map(function (s, i) {
      var p = erste ? Math.round((s.n / erste) * 100) : 0, zeigen = i && erste && p <= 100; // Stufen, die keine Teilmenge sind, ohne Anteil
      return '<li><span class="z-rang-n">' + esc(s.name) + '</span><span class="z-rang-w num">' + zahl(s.n) + (zeigen ? '<small>' + p + '\u00a0%</small>' : '') + '</span><span class="z-rang-b" style="--w:' + (i ? Math.max(erste && s.n ? 1 : 0, Math.min(100, p)) : (erste ? 100 : 0)) + '%"></span></li>';
    }).join('') + '</ol>' + (hinweis ? '<p class="z-neben">' + hinweis + '</p>' : '') + '</section>';
  }

  /* ---------- Zeitraum der Auswertung: die letzten 7, 30 oder 90 Tage, 12 Monate, alles oder von einem Tag bis zu einem Tag ----------
     Der Server rechnet in deutschen Kalendertagen und meldet den Zeitraum zurück (zeitraum: von, bis, tage, einheit) */
  var ZEITRAUM = [['7', '7 Tage'], ['30', '30 Tage'], ['90', '90 Tage'], ['365', '12 Monate'], ['anfang', 'Gesamt'], ['frei', 'Von – bis']];
  var heuteBerlin = function () { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  var tagText = function (t) { return t ? datum(t + 'T12:00:00Z') : '–'; };
  var tagKurz = function (t) { return new Date(t + 'T12:00:00Z').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }); };
  var monatText = function (t) { return new Date(t + 'T12:00:00Z').toLocaleDateString('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' }); };
  var monatKurz = function (t) { return new Date(t + 'T12:00:00Z').toLocaleDateString('de-DE', { month: 'short', year: '2-digit', timeZone: 'UTC' }); };
  var JE = { tag: 'je Tag', woche: 'je Woche', monat: 'je Monat' };
  function zrQuery() { var z = S.zeitraum; return z.art === 'frei' ? 'von=' + z.von + '&bis=' + z.bis : z.art === 'anfang' ? 'von=anfang' : 'tage=' + z.art; }
  function zeitraumLeiste(zr) {
    var z = S.zeitraum, heute = heuteBerlin();
    var knoepfe = ZEITRAUM.map(function (t) { return '<button type="button" data-act="zeitraum" data-v="' + t[0] + '" aria-pressed="' + (S.zrFrei ? t[0] === 'frei' : z.art === t[0]) + '">' + t[1] + '</button>'; }).join('');
    var frei = S.zrFrei ? '<form class="z-zr-frei" data-form="zeitraum" novalidate><div class="f"><label for="z-von">Von</label><input id="z-von" name="von" type="date" max="' + heute + '" value="' + esc(z.von || (zr ? zr.von : '')) + '" required></div>' +
      '<div class="f"><label for="z-bis">Bis</label><input id="z-bis" name="bis" type="date" max="' + heute + '" value="' + esc(z.bis || (zr ? zr.bis : heute)) + '" required></div><button class="btn primary small" type="submit">Anwenden</button></form>' + (S.zrFehler ? '<p class="err" role="alert">' + esc(S.zrFehler) + '</p>' : '') : '';
    return '<section class="z-zeitraum" aria-label="Zeitraum der Auswertung"><div class="seg z-zr-seg" role="group" aria-label="Zeitraum">' + knoepfe + '</div>' + frei +
      (zr ? '<p class="z-neben">Ausgewertet: ' + tagText(zr.von) + ' bis ' + tagText(zr.bis) + ' (' + nW(zr.tage, 'Tag', 'Tage') + ')</p>' : '') + '</section>';
  }
  /* Neuer Zeitraum: alles, was davon abhängt, neu laden (die aktuelle Seite sofort, die anderen beim nächsten Besuch) */
  function zeitraumNeu() {
    Object.keys(S.daten).forEach(function (k) { if (/^(uebersicht|betriebe|betrieb:|kaeufe|statistik)/.test(k)) S.daten[k] = null; });
    laden(false);
  }
  /* Tageswerte der Statistik zu Wochen (ab Montag) oder Monaten zusammenfassen, wie der Server die Verläufe der Übersicht */
  var wochenStart = function (t) { var d = new Date(t + 'T12:00:00Z'); return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 864e5).toISOString().slice(0, 10); };
  function gruppiert(reihe, einheit) {
    if (einheit === 'tag') return reihe.map(function (x) { return { wert: x.aufrufe, wert2: x.besuche, titel: tagText(x.tag) + ' Seitenaufrufe', kurz: tagKurz(x.tag) }; });
    var out = [], je = {};
    reihe.forEach(function (x) {
      var start = einheit === 'monat' ? x.tag.slice(0, 7) + '-01' : wochenStart(x.tag), e = je[start];
      if (!e) { e = je[start] = { start: start, aufrufe: 0, besuche: 0 }; out.push(e); }
      e.aufrufe += x.aufrufe; e.besuche += x.besuche;
    });
    return out.map(function (e) { return { wert: e.aufrufe, wert2: e.besuche, titel: (einheit === 'monat' ? monatText(e.start) : 'Woche ab ' + tagText(e.start)) + ' Seitenaufrufe', kurz: einheit === 'monat' ? monatKurz(e.start) : tagKurz(e.start) }; });
  }

  /* ---------- Anmeldung ---------- */
  function seiteAnmelden() {
    var st = S.status || {};
    var inhalt;
    if (!st.eingerichtet) {
      inhalt = '<h1 class="z-h">Zentrale</h1><p class="z-text">' + (st.grund === '2fa_ungueltig' ? 'Die Zentrale ist geschlossen.' : 'Die Zentrale ist noch nicht eingerichtet. Sie öffnet sich, sobald bei Cloudflare ein Passwort hinterlegt ist:') + '</p>' +
        (st.grund === 'zu_kurz' ? '<p class="z-hinweis bad">Das eingetragene Passwort ist kürzer als 12 Zeichen. Bitte ein längeres eintragen.</p>' : '') +
        (st.grund === '2fa_ungueltig' ? '<p class="z-hinweis bad">ZENTRALE_2FA ist eingetragen, aber kein gültiger Schlüssel. Deshalb bleibt die Zentrale zu. Bei Cloudflare ZENTRALE_2FA löschen, anmelden und unter Einstellungen neu einrichten.</p>' : '') +
        '<ol class="z-schritte"><li>Cloudflare öffnen: Workers &amp; Pages → <b>fenstero</b> → Settings → Variables and Secrets.</li><li>„Add“ wählen, Typ <b>Secret</b>, Name <code>ZENTRALE_PASSWORT</code>, als Wert ein Passwort mit mindestens 12 Zeichen (besser 20 und mehr).</li><li>„Deploy“ drücken und diese Seite neu laden.</li></ol>';
    } else {
      inhalt = '<h1 class="z-h">Zentrale</h1><p class="z-text">Nur für den Inhaber. Jede Anmeldung steht im Protokoll.</p>' +
        '<form class="z-form" data-form="anmelden" novalidate>' +
        '<div class="f"><label for="z-pw">Passwort</label><input id="z-pw" name="passwort" type="password" autocomplete="current-password" required></div>' +
        (st.zweiFaktor ? '<div class="f"><label for="z-code">Code aus der Authenticator-App</label><input id="z-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required></div>' : '') +
        (S.anmeldenFehler ? '<p class="err" role="alert">' + esc(S.anmeldenFehler) + '</p>' : '') +
        '<button class="btn primary" type="submit"' + (S.sendet ? ' disabled' : '') + '>' + (S.sendet ? 'Wird geprüft …' : 'Anmelden') + '</button></form>';
    }
    return '<main class="z-login"><div class="z-login-karte">' + MARKE + inhalt + '</div></main>';
  }

  /* ---------- Rahmen ---------- */
  var NAV = [['uebersicht', 'Übersicht'], ['betriebe', 'Betriebe'], ['kaeufe', 'Käufe'], ['statistik', 'Statistik'], ['protokoll', 'Protokoll'], ['einstellungen', 'Einstellungen']];
  function rahmen(inhalt) {
    var aktiv = S.seite === 'betrieb' ? 'betriebe' : S.seite;
    return '<div class="z-app"><aside class="z-seite">' + MARKE + '<nav class="z-nav" aria-label="Bereiche">' + NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (n[0] === aktiv ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('') + '</nav>' +
      '<button class="btn ghost small z-ab" data-act="abmelden" type="button">Abmelden</button></aside>' +
      '<main class="z-haupt" id="z-haupt">' + inhalt + '</main></div>' + dialog() + '<div class="z-toast' + (S.toast ? ' an' : '') + '" id="z-toast" role="status" aria-live="polite">' + esc(S.toast) + '</div>';
  }
  function ladeHinweis() { return '<div class="z-laden"><span class="spin dark"></span> Wird geladen …</div>'; }
  function fehlerKarte() { return '<div class="z-hinweis bad" role="alert">' + esc(S.fehler) + ' <button class="link" data-act="neu-laden" type="button">Noch einmal</button></div>'; }

  /* ---------- Übersicht ---------- */
  function seiteUebersicht() {
    var d = S.daten.uebersicht; if (!d) return kopf('Übersicht') + zeitraumLeiste() + (S.fehler ? fehlerKarte() : ladeHinweis());
    var k = d.kpi, v = d.verlauf || [], web = d.web, zr = d.zeitraum, je = JE[zr.einheit];
    var titelVon = function (x) { return zr.einheit === 'tag' ? tagText(x.start) : zr.einheit === 'woche' ? 'Woche ab ' + tagText(x.start) : monatText(x.start); };
    var kurzVon = function (x) { return zr.einheit === 'monat' ? monatKurz(x.start) : tagKurz(x.start); };
    var hinweise = (d.hinweise || []).map(function (h) { return '<li class="z-hinweis ' + esc(h.art) + '"><span>' + esc(h.text) + '</span>' + (h.ziel ? '<a class="z-a" href="#' + esc(h.ziel) + '">Ansehen</a>' : '') + '</li>'; }).join('');
    var summe = function (f) { return v.reduce(function (s, x) { return s + x[f]; }, 0); };
    var mini = function (titel, feld) { return '<section class="z-karte"><h2 class="z-h2">' + esc(titel) + '</h2><p class="z-neben">' + zahl(summe(feld)) + ' im Zeitraum, ' + je + '</p>' + balken(v.map(function (x) { return { wert: x[feld], titel: titelVon(x), kurz: kurzVon(x) }; }), { label: titel + ' ' + je }) + '</section>'; };
    return kopf('Übersicht', 'Stand ' + wann(new Date().toISOString()), '<button class="btn soft small" data-act="neu-laden" type="button">Aktualisieren</button>') +
      (hinweise ? '<ul class="z-hinweise">' + hinweise + '</ul>' : '') + zeitraumLeiste(zr) +
      '<div class="z-stats">' +
      stat('Betriebe', zahl(k.betriebe), (k.neu ? '+' + zahl(k.neu) + ' neu im Zeitraum' : 'keine neuen im Zeitraum') + (k.gesperrt ? ' · ' + zahl(k.gesperrt) + ' gesperrt' : '')) +
      stat('Aktiv im Zeitraum', zahl(k.aktiv), k.betriebe ? Math.round((k.aktiv / k.betriebe) * 100) + '\u00a0% der Betriebe' : '–') +
      stat('Projekte angelegt', zahl(k.projekte), nW(k.verschickt, 'Link', 'Links') + ' verschickt, ' + zahl(k.geoeffnet) + ' geöffnet') +
      stat('Aufmaße eingegangen', zahl(k.aufmasse), nW(k.positionen, 'Position', 'Positionen') + ', ' + nW(k.fotos, 'Foto', 'Fotos'), 'ok') +
      stat('Aufträge der Betriebe', zahl(k.auftraege), zahl(k.angebote) + ' Angebote offen, aus Projekten des Zeitraums (laut Betrieb)') +
      stat('Abos, monatlich', euro(k.mrr), 'Stand heute · Abo 10: ' + zahl(k.tarife.abo) + ' · Plus: ' + zahl(k.tarife.plus) + (k.mwst ? ' · netto' : '')) +
      stat('Umsatz Betriebe', euro(k.umsatzBetriebe), euro(k.bezahltBetriebe) + ' bezahlt · ' + euro(k.offenBetriebe) + ' noch nicht berechnet') +
      stat('Aufmaßblätter verkauft', zahl(k.kaeufe), euro(k.umsatzKaeufe) + ' brutto' + (k.kunden != null ? ' · ' + nW(k.kunden, 'Hauseigentümer hat', 'Hauseigentümer haben') + ' ein Aufmaß gesichert' : '')) +
      stat('Besuche der Website', web ? zahl(web.besuche) : '–', web ? zahl(web.aufrufe) + ' Seitenaufrufe' : 'Statistik noch nicht eingerichtet') +
      '</div>' +
      '<div class="z-raster3">' + mini('Registrierungen', 'registrierungen') + mini('Aufmaße eingegangen', 'aufmasse') + mini('Aufmaßblätter verkauft', 'kaeufe') + '</div>' +
      (web ? '<section class="z-karte"><h2 class="z-h2">Website</h2><p class="z-neben"><span class="z-leg z-leg1"></span>Besuche <span class="z-leg z-leg2"></span>Seitenaufrufe ' + je + ' · häufigste Herkunft: ' + (web.herkunft.length ? web.herkunft.slice(0, 3).map(function (h) { return esc(h.name) + ' (' + zahl(h.n) + ')'; }).join(', ') : 'noch keine') + '</p>' + balken(v.map(function (x) { return { wert: x.aufrufe, wert2: x.besuche, titel: titelVon(x) + ' Seitenaufrufe', kurz: kurzVon(x) }; }), { label: 'Besuche und Seitenaufrufe ' + je, name2: 'Besuche' }) + '</section>' : '') +
      '<section class="z-karte"><h2 class="z-h2">Letzte Vorgänge im Zeitraum</h2>' + ((d.aktivitaet || []).length ? '<ul class="z-liste">' + d.aktivitaet.map(function (x) { return '<li><span class="badge ' + (x.art === 'kauf' ? 'acc' : x.art === 'aufmass' ? 'ok' : '') + '">' + ({ registrierung: 'Registrierung', aufmass: 'Aufmaß', kauf: 'Kauf' }[x.art] || x.art) + '</span><span class="z-liste-t">' + (x.betrieb ? '<a class="z-a" href="#betrieb/' + esc(x.betrieb) + '">' + esc(x.text) + '</a>' : esc(x.text)) + '</span><span class="z-neben">' + vor(x.zeit) + '</span></li>'; }).join('') + '</ul>' : '<p class="z-neben">Im Zeitraum ist nichts passiert.</p>') + '</section>';
  }

  /* ---------- Betriebe ---------- */
  var FILTER = [['alle', 'Alle'], ['aktiv', 'Aktiv im Zeitraum'], ['neu', 'Neu im Zeitraum'], ['abo', 'Mit Abo'], ['ohnezahlung', 'Ohne Zahlungsart'], ['wartet', 'Aufmaß wartet'], ['gesperrt', 'Gesperrt'], ['doppelt', 'Doppelkonto-Verdacht']];
  function gefiltert(liste) {
    var q = S.suche.trim().toLowerCase();
    var out = liste.filter(function (b) {
      if (q && ![b.name, b.mail, b.kontaktMail, b.ap, b.tel, b.plz].join(' ').toLowerCase().includes(q)) return false;
      switch (S.filter) {
        case 'aktiv': return !!(b.z && b.z.aktiv);
        case 'neu': return !!(b.z && b.z.registriert);
        case 'abo': return b.tarif !== 'service';
        case 'ohnezahlung': return !b.zahlungsart;
        case 'wartet': return b.k.wartend > 0;
        case 'gesperrt': return !!b.gesperrt;
        case 'doppelt': return !!b.doppelt;
        default: return true;
      }
    });
    var sort = { neu: function (a, b) { return String(b.registriert).localeCompare(String(a.registriert)); }, aktiv: function (a, b) { return String(b.zuletzt).localeCompare(String(a.zuletzt)); }, aufmasse: function (a, b) { return b.z.aufmasse - a.z.aufmasse || b.z.projekte - a.z.projekte; }, umsatz: function (a, b) { return b.z.umsatz - a.z.umsatz; }, name: function (a, b) { return String(a.name).localeCompare(String(b.name), 'de'); } }[S.sortierung];
    return out.sort(sort);
  }
  function statusBadges(b) {
    return [b.gesperrt ? badge('gesperrt', 'bad') : '', b.doppelt ? badge('Doppelkonto?', 'warn') : '', b.k.wartend ? badge(b.k.wartend + ' wartet', 'warn') : '', b.k.fehlgeschlagen ? badge('Zahlung fehlgeschlagen', 'bad') : '', !b.zahlungsart && !b.gesperrt ? badge('ohne Zahlungsart') : ''].join(' ');
  }
  function seiteBetriebe() {
    var d = S.daten.betriebe; if (!d) return kopf('Betriebe') + zeitraumLeiste() + (S.fehler ? fehlerKarte() : ladeHinweis());
    var liste = gefiltert(d.betriebe);
    var zeilen = liste.map(function (b) {
      return '<tr data-href="#betrieb/' + esc(b.id) + '"><td data-k="Betrieb"><span><a class="z-zeile" href="#betrieb/' + esc(b.id) + '"><b>' + esc(b.name) + '</b><small>' + esc(b.mail) + (b.plz ? ' · ' + esc(b.plz) : '') + '</small></a></span></td>' +
        '<td data-k="Registriert"><span>' + datum(b.registriert) + '</span></td><td data-k="Zuletzt aktiv"><span>' + vor(b.zuletzt) + '</span></td><td data-k="Tarif"><span>' + esc(TARIF[b.tarif] || b.tarif) + '</span></td>' +
        '<td data-k="Projekte" class="num"><span>' + zahl(b.z.projekte) + '</span></td><td data-k="Aufmaße" class="num"><span>' + zahl(b.z.aufmasse) + '</span></td><td data-k="Umsatz" class="num"><span>' + euro(b.z.umsatz) + '</span></td><td data-k="Status"><span>' + (statusBadges(b) || '–') + '</span></td></tr>';
    }).join('');
    return kopf('Betriebe', nW(d.betriebe.length, 'Betrieb', 'Betriebe') + ' registriert' + (liste.length !== d.betriebe.length ? ', ' + zahl(liste.length) + ' angezeigt' : '') + ' · Projekte, Aufmaße und Umsatz im Zeitraum', '<button class="btn soft small" data-act="csv" type="button">Als Tabelle (CSV)</button>') +
      zeitraumLeiste(d.zeitraum) + '<div class="z-werkzeug"><div class="f z-suche"><label for="z-suche">Suchen</label><input id="z-suche" type="search" data-in="suche" value="' + esc(S.suche) + '" placeholder="Name, E-Mail, PLZ, Telefon" autocomplete="off"></div>' +
      '<div class="f"><label for="z-sort">Sortieren</label><select id="z-sort" data-in="sortierung">' + [['neu', 'Neueste zuerst'], ['aktiv', 'Zuletzt aktiv'], ['aufmasse', 'Meiste Aufmaße im Zeitraum'], ['umsatz', 'Höchster Umsatz im Zeitraum'], ['name', 'Name']].map(function (o) { return '<option value="' + o[0] + '"' + (S.sortierung === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="chips z-filter" role="group" aria-label="Filter">' + FILTER.map(function (f) { var n = gefilterteAnzahl(d.betriebe, f[0]); return '<button type="button" class="chip" data-act="filter" data-v="' + f[0] + '" aria-pressed="' + (S.filter === f[0]) + '">' + f[1] + ' <span class="z-n">' + zahl(n) + '</span></button>'; }).join('') + '</div>' +
      (liste.length ? '<div class="z-karte z-tabkarte"><table class="z-tab"><thead><tr><th>Betrieb</th><th>Registriert</th><th>Zuletzt aktiv</th><th>Tarif</th><th class="num">Projekte</th><th class="num">Aufmaße</th><th class="num">Umsatz</th><th>Status</th></tr></thead><tbody>' + zeilen + '</tbody></table></div>' : leer(d.betriebe.length ? 'Kein Betrieb passt zu Suche und Filter.' : 'Noch kein Betrieb registriert.', d.betriebe.length ? '' : 'Sobald sich ein Fensterbauer registriert, steht er hier.'));
  }
  function gefilterteAnzahl(liste, f) { var alt = S.filter, q = S.suche; S.filter = f; S.suche = ''; var n = gefiltert(liste).length; S.filter = alt; S.suche = q; return n; }

  /* ---------- Ein Betrieb ---------- */
  /* Eingeblendete Kundendaten (Einblick) über die Ansicht legen; Kennzahlen und was in den Zeitraum fällt, kommen aus der Ansicht */
  function mitEinblick(d0, e0) {
    var nachId = function (liste) { var m = {}; (liste || []).forEach(function (x) { m[x.id] = x; }); return m; }, ep = nachId(e0.projekte), eb = nachId(e0.buchungen);
    return Object.assign({}, d0, {
      einblick: true, nachrichten: e0.nachrichten, zwischenstaende: e0.zwischenstaende,
      projekte: d0.projekte.map(function (p) { return Object.assign({}, ep[p.id] || p, { drin: p.drin }); }),
      buchungen: d0.buchungen.map(function (b) { return Object.assign({}, eb[b.id] || b, { drin: b.drin }); })
    });
  }
  function seiteBetrieb() {
    var d0 = S.daten['betrieb:' + S.id], e0 = S.einblick[S.id];
    var zurueck = '<a class="z-a z-zurueck" href="#betriebe">← Alle Betriebe</a>';
    if (!d0) return zurueck + (S.fehler ? fehlerKarte() : ladeHinweis());
    var d = e0 ? mitEinblick(d0, e0) : d0, k = d.k, z = d.z, ein = !!d.einblick;
    var projekte = d.projekte.filter(function (p) { return p.drin; }), buchungen = d.buchungen.filter(function (b) { return b.drin; }), rechnungen = d.rechnungen.filter(function (r) { return r.drin; });
    var ausserhalb = function (n, eins, viele) { return n ? '<p class="z-neben">' + nW(n, eins, viele) + ' außerhalb des Zeitraums.</p>' : ''; };
    var badges = [badge(TARIF[d.tarif] || d.tarif, d.tarif === 'service' ? '' : 'acc'), d.gesperrt ? badge('gesperrt', 'bad') : '', d.doppelt ? badge('Doppelkonto-Verdacht', 'warn') : '', d.zahlungsart ? badge(d.zahlungsart.art, 'ok') : badge('keine Zahlungsart')].join(' ');
    var aktionen = '<div class="z-aktionen">' +
      '<button class="btn soft small" type="button" data-act="dlg" data-v="nachricht">Nachricht ins Konto</button>' +
      '<button class="btn soft small" type="button" data-act="dlg" data-v="gutschrift">Kostenlose Projekte</button>' +
      (d.doppelt ? '<button class="btn soft small" type="button" data-act="dlg" data-v="doppelkonto">Doppelkonto-Verdacht aufheben</button>' : '') +
      (d.tarif !== 'service' || d.stripe.abo ? '<button class="btn soft small" type="button" data-act="dlg" data-v="abo">Abo …</button>' : '') +
      (k.nochOffen > 0 && d.stripe.kunde && d.zahlungsart ? '<button class="btn soft small" type="button" data-act="dlg" data-v="abrechnen">Jetzt abrechnen</button>' : '') +
      '<button class="btn soft small" type="button" data-act="dlg" data-v="export">Daten exportieren</button>' +
      (d.gesperrt ? '<button class="btn soft small" type="button" data-act="dlg" data-v="entsperren">Entsperren</button>' : '<button class="btn soft small" type="button" data-act="dlg" data-v="sperren">Sperren</button>') +
      '<button class="btn danger small" type="button" data-act="dlg" data-v="loeschen">Konto löschen</button></div>';
    var quote = function (a, b) { return b ? Math.round((a / b) * 100) + '\u00a0%' : '–'; };
    var projektZeilen = projekte.map(function (p) {
      return '<tr><td data-k="Projekt"><span><b>' + esc(p.nr || '–') + '</b>' + (ein ? '<small>' + esc(p.kunde || '') + (p.kontakt ? ' · ' + esc(p.kontakt) : '') + '</small>' : '') + '</span></td>' +
        '<td data-k="Stand"><span>' + esc(STATUS[p.status] || p.status) + (p.gesperrt ? ' ' + badge('wartet auf Zahlungsart', 'warn') : '') + (p.nachbesserungOffen ? ' ' + badge('Nachbesserung offen') : '') + '</span></td>' +
        '<td data-k="Phase"><span>' + esc(PHASE[p.phase] || '–') + '</span></td><td data-k="Angelegt"><span>' + esc(p.angelegt || '–') + '</span></td>' +
        '<td data-k="Positionen" class="num"><span>' + (p.positionen ? zahl(p.positionen) : '–') + '</span></td><td data-k="Fotos" class="num"><span>' + (p.fotos ? zahl(p.fotos) : '–') + '</span></td><td data-k="Runde" class="num"><span>' + zahl(p.runde) + '</span></td></tr>' +
        (ein && (p.adresse || p.notiz || p.memo || (p.fenster && p.fenster.length)) ? '<tr class="z-unterzeile"><td colspan="7"><span><div class="z-einblick">' + kv([p.adresse ? ['Objekt', esc(p.adresse)] : null, p.notiz ? ['Notiz zum Projekt', esc(p.notiz)] : null, p.memo ? ['Vermerk des Betriebs', esc(p.memo)] : null, p.angaben && p.angaben.notiz ? ['Nachricht des Kunden', esc(p.angaben.notiz)] : null, p.fenster && p.fenster.length ? ['Aufmaß', p.fenster.map(function (f) { return esc((f.name || 'Fenster') + ', ' + f.art + (f.oeffnung ? ', Öffnung ' + f.oeffnung + ' mm' : '') + (f.element ? ', Element ' + f.element + ' mm' : '') + (f.anzahl > 1 ? ', ' + f.anzahl + ' Stück' : '')); }).join('<br>')] : null]) + '</div></span></td></tr>' : '');
    }).join('');
    var buchZeilen = buchungen.map(function (b) { return '<tr><td data-k="Wann"><span>' + esc(b.wann || b.monat) + '</span></td><td data-k="Buchung"><span>' + esc(b.text) + (b.hinweis ? '<small>' + esc(b.hinweis) + '</small>' : '') + '</span></td><td data-k="Betrag" class="num"><span>' + euro(b.betrag) + '</span></td><td data-k="Stand"><span>' + esc(b.status) + (b.rechnung ? ' · ' + esc(b.rechnung) : '') + '</span></td></tr>'; }).join('');
    var reZeilen = rechnungen.map(function (r) { return '<tr><td data-k="Rechnung"><span><b>' + esc(r.nr) + '</b></span></td><td data-k="Datum"><span>' + esc(r.datum) + '</span></td><td data-k="Betrag" class="num"><span>' + euro(r.betrag) + '</span></td><td data-k="Stand"><span>' + badge(r.status, r.status === 'bezahlt' ? 'ok' : r.status === 'fehlgeschlagen' ? 'bad' : '') + '</span></td><td data-k="Beleg"><span>' + aussen(r.url, 'Ansehen') + '</span></td></tr>'; }).join('');
    /* Kundenlinks in Arbeit (Zwischenstand): Zähler gegen Mehrfachnutzung, auffällige zuerst */
    var zw = (d.zwischenstaende || []).slice().sort(function (a, b) { return b.gruende.length - a.gruende.length || b.angelegt - a.angelegt; });
    var auffaellig = zw.filter(function (x) { return x.gruende.length; });
    var zwZeilen = zw.map(function (x) { return '<tr><td data-k="Projekt"><span><b>' + esc(x.nr || '–') + '</b>' + (ein && x.kunde ? '<small>' + esc(x.kunde) + '</small>' : '') + '</span></td><td data-k="Angelegt" class="num"><span>' + zahl(x.angelegt) + '</span></td><td data-k="Gelöscht" class="num"><span>' + zahl(x.geloescht) + '</span></td><td data-k="Fest" class="num"><span>' + zahl(x.fest) + '</span></td><td data-k="Stand"><span>' + (x.gesendet ? 'gesendet' : 'in Arbeit') + (x.gruende.length ? ' ' + badge('auffällig', 'warn') : '') + '</span></td></tr>' + (x.gruende.length ? '<tr class="z-unterzeile"><td colspan="5"><span>' + esc(x.gruende.join(', ')) + '</span></td></tr>' : ''); }).join('');
    var prot = (d.protokoll || []).map(function (e) { return '<li><span class="badge">' + esc(ART[e.art] || e.art) + '</span><span class="z-liste-t">' + esc(e.text) + '</span><span class="z-neben">' + wann(e.zeit) + '</span></li>'; }).join('');
    return zurueck + kopf(d.name, badges + ' <span class="z-neben">· PLZ ' + esc(d.plz || '–') + ' · registriert ' + datum(d.registriert) + '</span>') +
      (d.gesperrt ? '<div class="z-hinweis bad"><span><b>Gesperrt</b> seit ' + wann(d.gesperrt.seit) + '. Begründung (sieht der Betrieb beim Anmelden): ' + esc(d.gesperrt.grund) + '</span></div>' : '') +
      aktionen + zeitraumLeiste(d.zeitraum) +
      '<div class="z-stats">' + stat('Projekte angelegt', zahl(z.projekte), nW(z.verschickt, 'Link', 'Links') + ' verschickt, ' + zahl(z.geoeffnet) + ' vom Kunden geöffnet') +
      stat('Aufmaße eingegangen', zahl(z.aufmasse), nW(z.positionen, 'Position', 'Positionen') + ', ' + nW(z.fotos, 'Foto', 'Fotos') + (z.nachbesserungen ? ', ' + nW(z.nachbesserungen, 'Nachbesserung', 'Nachbesserungen') : ''), 'ok') +
      stat('Aufträge (laut Betrieb)', zahl(z.auftraege), zahl(z.angebote) + ' Angebote, ' + zahl(z.termine) + ' Termine, ' + zahl(z.verloren) + ' verloren, aus Projekten des Zeitraums') +
      stat('Umsatz mit uns', euro(z.umsatz), euro(z.bezahlt) + ' bezahlt · ' + euro(z.nochOffen) + ' noch nicht berechnet') +
      stat('Kostenlose Projekte', k.freiUebrig == null ? '–' : zahl(k.freiUebrig), k.freiUebrig == null ? 'im Abo nicht nötig' : 'übrig von ' + zahl(d.freiKontingent) + ', Stand heute') + '</div>' +
      trichter('Vom Projekt zum Auftrag', [{ name: 'Projekte angelegt', n: z.projekte }, { name: 'Link verschickt', n: z.verschickt }, { name: 'Link geöffnet', n: z.geoeffnet }, { name: 'Aufmaß eingegangen', n: z.mitAufmass }, { name: 'Auftrag (laut Betrieb)', n: z.auftraege }], 'Projekte, die im Zeitraum angelegt wurden, mit ihrem Stand von heute. Aufmaß je verschicktem Link: ' + quote(z.mitAufmass, z.verschickt) + '. Aufträge trägt der Betrieb selbst ein.') +
      '<div class="z-raster2"><section class="z-karte"><h2 class="z-h2">Stammdaten</h2>' + kv([['Ansprechpartner', esc(d.ap || '–')], ['E-Mail (Anmeldung)', '<a class="z-a" href="mailto:' + esc(d.mail) + '">' + esc(d.mail) + '</a>'], d.kontaktMail ? ['E-Mail (Kontakt)', '<a class="z-a" href="mailto:' + esc(d.kontaktMail) + '">' + esc(d.kontaktMail) + '</a>'] : null, ['Telefon', d.tel ? '<a class="z-a" href="tel:' + esc(String(d.tel).replace(/[^\d+]/g, '')) + '">' + esc(d.tel) + '</a>' : '–'], ['PLZ', esc(d.plz || '–')], ['Betrieb seit', esc(d.seit || '–')], ['Registriert', wann(d.registriert)], ['Letzte Anmeldung', d.angemeldet ? wann(d.angemeldet) + ' (' + nW(d.anmeldungen, 'Anmeldung', 'Anmeldungen') + ')' : '–'], ['Zuletzt aktiv', vor(d.zuletzt)], d.anmeldung ? ['E-Mail bestätigt', d.anmeldung.bestaetigt ? wann(d.anmeldung.bestaetigt) : 'nein'] : null]) + '</section>' +
      '<section class="z-karte"><h2 class="z-h2">Tarif und Zahlung</h2>' + kv([['Tarif', esc(TARIF[d.tarif] || d.tarif) + (d.wechsel ? ' · wechselt am ' + esc(d.wechsel.am) + ' zu ' + esc(TARIF[d.wechsel.zu] || d.wechsel.zu) : '')], ['Zahlungsart', d.zahlungsart ? esc(d.zahlungsart.art + ' ' + d.zahlungsart.text) + (d.zahlungsart.seit ? ' · seit ' + esc(d.zahlungsart.seit) : '') : 'keine'], ['Stripe-Kunde', d.stripe.kunde ? aussen(d.stripeLinks.kunde || '', d.stripe.kunde) : '–'], ['Abo bei Stripe', d.stripe.abo ? aussen(d.stripeLinks.abo || '', d.stripe.abo) : '–'], ['Kostenlose Projekte', zahl(d.freiGenutzt) + ' von ' + zahl(d.freiKontingent) + ' genutzt'], d.doppelt ? ['Doppelkonto-Verdacht', 'gleiche Telefonnummer oder gleicher Name wie ' + esc(d.doppelt)] : null, ['Ungelesene Mitteilungen', zahl(k.ungelesen)]]) + '</section></div>' +
      '<section class="z-karte z-tabkarte"><div class="z-karte-kopf"><h2 class="z-h2">Projekte</h2>' + (ein ? badge('Kundendaten eingeblendet', 'warn') + '<button class="btn soft small" type="button" data-act="einblick-aus">Wieder ausblenden</button>' : (d.projekte.length ? '<button class="btn soft small" type="button" data-act="dlg" data-v="einblick">Kundendaten einblenden</button>' : '')) + '</div>' +
      (ein ? '' : '<p class="z-neben">Die Kunden des Betriebs erscheinen nur als Projektnummer: Für diese Daten arbeitet eeziframes im Auftrag des Betriebs.</p>') +
      (projekte.length ? '<table class="z-tab"><thead><tr><th>Projekt</th><th>Stand</th><th>Phase</th><th>Angelegt</th><th class="num">Positionen</th><th class="num">Fotos</th><th class="num">Runde</th></tr></thead><tbody>' + projektZeilen + '</tbody></table>' : '<p class="z-neben">' + (d.projekte.length ? 'Im Zeitraum nichts an einem Projekt passiert.' : 'Noch kein Projekt.') + '</p>') +
      (projekte.length < d.projekte.length ? '<div class="z-karte-kopf">' + ausserhalb(d.projekte.length - projekte.length, 'weiteres Projekt liegt', 'weitere Projekte liegen') + (S.zeitraum.art !== 'anfang' ? '<button class="btn soft small" type="button" data-act="zeitraum" data-v="anfang">Gesamten Zeitraum zeigen</button>' : '') + '</div>' : '') + '</section>' +
      (zw.length ? '<section class="z-karte z-tabkarte"><h2 class="z-h2">Kundenlinks in Arbeit</h2><p class="z-neben">Zwischenstand der Kunden: angelegte Fenster (höchstens 50 je Aufmaß, gelöschte zählen mit) und Fenster, die nach vier Änderungen fest sind. Auffällig heißt: bitte prüfen, ob der Betrieb einen Link für mehrere Häuser nutzt; gesperrt wird nichts von selbst.</p>' + (auffaellig.length ? '<div class="z-hinweis warn"><span>' + esc(nW(auffaellig.length, 'Link ist', 'Links sind') + ' auffällig.') + '</span></div>' : '') + '<table class="z-tab"><thead><tr><th>Projekt</th><th class="num">Angelegt</th><th class="num">Gelöscht</th><th class="num">Fest</th><th>Stand</th></tr></thead><tbody>' + zwZeilen + '</tbody></table></section>' : '') +
      (ein && d.nachrichten && d.nachrichten.length ? '<section class="z-karte"><h2 class="z-h2">Mitteilungen im Konto</h2><ul class="z-liste">' + d.nachrichten.map(function (m) { return '<li><span class="z-liste-t"><b>' + esc(m.titel) + '</b> ' + esc(m.text || '') + '</span><span class="z-neben">' + esc(m.wann || '') + '</span></li>'; }).join('') + '</ul></section>' : '') +
      '<div class="z-raster2"><section class="z-karte z-tabkarte"><h2 class="z-h2">Buchungen</h2>' + (buchungen.length ? '<table class="z-tab"><thead><tr><th>Wann</th><th>Buchung</th><th class="num">Betrag</th><th>Stand</th></tr></thead><tbody>' + buchZeilen + '</tbody></table>' : '<p class="z-neben">' + (d.buchungen.length ? 'Keine Buchung im Zeitraum.' : 'Noch keine Buchung.') + '</p>') + ausserhalb(d.buchungen.length - buchungen.length, 'weitere Buchung liegt', 'weitere Buchungen liegen') + '</section>' +
      '<section class="z-karte z-tabkarte"><h2 class="z-h2">Rechnungen</h2>' + (rechnungen.length ? '<table class="z-tab"><thead><tr><th>Rechnung</th><th>Datum</th><th class="num">Betrag</th><th>Stand</th><th>Beleg</th></tr></thead><tbody>' + reZeilen + '</tbody></table>' : '<p class="z-neben">' + (d.rechnungen.length ? 'Keine Sammelrechnung im Zeitraum.' : 'Noch keine Sammelrechnung.') + '</p>') + ausserhalb(d.rechnungen.length - rechnungen.length, 'weitere Rechnung liegt', 'weitere Rechnungen liegen') + '</section></div>' +
      '<section class="z-karte"><h2 class="z-h2">Interne Notiz</h2><form class="z-form" data-form="notiz"><div class="f"><label for="z-notiz">Nur für dich. Gehört trotzdem zu den Daten des Betriebs (Auskunft, Export), also sachlich bleiben.</label><textarea id="z-notiz" name="text" maxlength="2000" rows="4">' + esc(d.notiz) + '</textarea>' + (d.notizZeit ? '<small>Zuletzt geändert ' + wann(d.notizZeit) + '</small>' : '') + '</div><button class="btn soft small" type="submit">Notiz speichern</button></form></section>' +
      '<section class="z-karte"><h2 class="z-h2">Eingriffe an diesem Konto</h2>' + (prot ? '<ul class="z-liste">' + prot + '</ul>' : d.protokoll === null ? '<p class="z-neben">Das Protokoll ist noch nicht eingerichtet (supabase/schema.sql erneut ausführen).</p>' : '<p class="z-neben">Noch keine.</p>') + '</section>';
  }

  /* ---------- Käufe ---------- */
  function seiteKaeufe() {
    var d = S.daten.kaeufe; if (!d) return kopf('Käufe') + zeitraumLeiste() + (S.fehler ? fehlerKarte() : ladeHinweis());
    var q = S.kaufSuche.trim().toLowerCase(), liste = d.kaeufe.filter(function (x) { return !q || (x.mail + ' ' + x.kennung).toLowerCase().includes(q); }), tage = d.zeitraum.tage || 1;
    return kopf('Käufe', 'Aufmaßblätter von Hauseigentümern' + (d.test ? ' · Stripe im Testmodus' : ''), d.stripe ? aussen(d.stripe, 'Zahlungen bei Stripe') : '') + zeitraumLeiste(d.zeitraum) +
      '<div class="z-stats">' + stat('Verkauft', zahl(d.summe.anzahl), euro(d.summe.umsatz) + ' brutto') + stat('Je Tag', (d.summe.anzahl / tage).toLocaleString('de-DE', { maximumFractionDigits: 1 }), euro(Math.round((d.summe.umsatz / tage) * 100) / 100) + ' brutto im Schnitt') + stat('Nicht abgeschlossen', zahl(d.summe.offen), 'Kasse geöffnet, nicht bezahlt (nach 30 Tagen gelöscht)') + '</div>' +
      '<div class="z-werkzeug"><div class="f z-suche"><label for="z-ksuche">Suchen</label><input id="z-ksuche" type="search" data-in="kaufSuche" value="' + esc(S.kaufSuche) + '" placeholder="E-Mail oder Kennung" autocomplete="off"></div></div>' +
      (liste.length ? '<div class="z-karte z-tabkarte"><table class="z-tab"><thead><tr><th>Zeit</th><th>E-Mail</th><th class="num">Betrag</th><th>Stand</th><th>Kennung</th></tr></thead><tbody>' + liste.map(function (x) { return '<tr><td data-k="Zeit"><span>' + wann(x.zeit) + '</span></td><td data-k="E-Mail"><span>' + esc(x.mail || '–') + '</span></td><td data-k="Betrag" class="num"><span>' + euro(x.betrag) + '</span></td><td data-k="Stand"><span>' + badge(x.status, x.status === 'bezahlt' ? 'ok' : '') + '</span></td><td data-k="Kennung"><span><code>' + esc(x.kennung || '–') + '</code></span></td></tr>'; }).join('') + '</tbody></table></div>' : leer(d.kaeufe.length ? 'Kein Kauf passt zur Suche.' : 'Im Zeitraum kein Aufmaßblatt verkauft.'));
  }

  /* ---------- Statistik ---------- */
  var DATEI = { '/robots.txt': 'robots.txt (Regeln für Suchmaschinen)', '/llms.txt': 'llms.txt (Kurzfassung für KI-Assistenten)', '/sitemap.xml': 'sitemap.xml' };
  function seiteStatistik() {
    var d = S.daten.statistik, wahl = zeitraumLeiste(d && d.zeitraum);
    if (!d) return kopf('Statistik', 'Ohne Cookies, nur Tagessummen') + wahl + (S.fehler ? fehlerKarte() : ladeHinweis());
    if (!d.tabelle) return kopf('Statistik', 'Ohne Cookies, nur Tagessummen') + wahl + '<div class="z-hinweis warn"><span>Die Statistik ist noch nicht eingerichtet. Einmal <code>supabase/schema.sql</code> im SQL-Editor von Supabase ausführen (die Datei lässt sich gefahrlos erneut ausführen). Danach zählt der Server mit.</span></div>';
    var e = d.ereignisse || {}, ev = function (n) { return e[n] || 0; }, seite = function (p) { var x = (d.seiten || []).find(function (s) { return s.schluessel === p; }); return x ? x.n : 0; };
    var einheit = d.zeitraum ? d.zeitraum.einheit : d.tage <= 62 ? 'tag' : d.tage <= 400 ? 'woche' : 'monat', reihe = gruppiert(d.reihe, einheit);
    return kopf('Statistik', 'Ohne Cookies, nur Tagessummen') + wahl +
      '<div class="z-stats">' + stat('Besuche', zahl(d.summe.besuche), 'Einstiege von außen') + stat('Seitenaufrufe', zahl(d.summe.aufrufe), d.summe.besuche ? (function (q) { return q.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + (q === 1 ? ' Seite' : ' Seiten') + ' je Besuch'; })(Math.round((d.summe.aufrufe / d.summe.besuche) * 10) / 10) : '–') + stat('Aufmaßblätter verkauft', zahl(ev('kauf')), zahl(ev('kasse')) + ' Kassen geöffnet') + stat('Aufmaße an Betriebe', zahl(ev('aufmass_gesendet')), zahl(ev('link_geoeffnet')) + ' Kundenlinks erstmals geöffnet') + stat('Registrierungen', zahl(ev('registrierung')), zahl(ev('anmeldecode')) + ' Anmelde-E-Mails angefordert') + stat('Zugriffe von Bots', zahl(d.summe.bots), 'Suchmaschinen, KI, Linkvorschauen') + '</div>' +
      '<section class="z-karte"><h2 class="z-h2">' + { tag: 'Je Tag', woche: 'Je Woche', monat: 'Je Monat' }[einheit] + '</h2><p class="z-neben"><span class="z-leg z-leg1"></span>Besuche <span class="z-leg z-leg2"></span>Seitenaufrufe</p>' + balken(reihe, { label: 'Besuche und Seitenaufrufe', name2: 'Besuche' }) + '</section>' +
      '<div class="z-raster2">' +
      trichter('Hauseigentümer', [{ name: 'App geöffnet', n: seite('/app/') }, { name: 'Kasse geöffnet', n: ev('kasse') }, { name: 'Aufmaßblatt gekauft', n: ev('kauf') }], 'App-Aufrufe zählen auch Kunden, die über den Link eines Betriebs kommen. Von der KI ausgewertet: ' + nW(ev('ki_foto'), 'Foto', 'Fotos') + '.') +
      trichter('Kunden der Betriebe', [{ name: 'Kundenlink erstmals geöffnet', n: ev('link_geoeffnet') }, { name: 'Aufmaß an den Betrieb gesendet', n: ev('aufmass_gesendet') }], 'Dazu ' + nW(ev('nachbesserung'), 'Nachbesserung', 'Nachbesserungen') + ' und ' + nW(ev('code_eingefuegt'), 'Aufmaß-Code', 'Aufmaß-Codes') + ', die Betriebe selbst eingefügt haben.') +
      trichter('Fensterbauer', [{ name: 'Seite für Fensterbauer', n: seite('/fuer-fensterbauer/') }, { name: 'Anmelde-E-Mail angefordert', n: ev('anmeldecode') }, { name: 'Registriert', n: ev('registrierung') }], 'Die Startseite (Ansicht Fensterbauer) zählt unter „Seiten“ mit. Danach: ' + nW(ev('projekt'), 'Projekt', 'Projekte') + ' angelegt.') +
      rang('Seiten', d.seiten) + rang('Einstiegsseiten', d.einstiege) + rang('Herkunft', d.herkunft) + rang('Geräte', d.geraet) + rang('Browser', d.browser) + rang('Systeme', d.system) +
      rang('Länder', d.land, function (x) { return landName(x.schluessel); }) + rang('Bots und Linkvorschauen', d.bots, null, 'Noch keine Bots gezählt.') + rang('Dateien für Maschinen', d.dateien, function (x) { return DATEI[x.schluessel] || x.name; }) +
      rang('Vorgänge', Object.keys(e).map(function (n) { return { name: EREIGNIS[n] || n, n: e[n] }; }).sort(function (a, b) { return b.n - a.n; })) +
      '</div><p class="z-neben z-fuss">Gezählt wird auf dem Server, während er eine Seite ausliefert: keine Cookies, kein Skript, keine IP-Adressen, keine Kennungen, nur Tagessummen. Besuche sind Aufrufe, die nicht von einer eigenen Seite kommen. Nicht gezählt: deine eigenen Aufrufe, solange du angemeldet bist, Aufrufe mit „Global Privacy Control“ oder „Do Not Track“, Vorab-Ladevorgänge, Bots (nur als Familie). Eindeutige Besucher werden bewusst nicht gezählt, dafür bräuchte es eine Kennung.</p>';
  }
  var EREIGNIS = { kasse: 'Kasse geöffnet (Aufmaßblatt)', kauf: 'Aufmaßblatt gekauft', ki_foto: 'Foto von der KI ausgewertet', aufmass_gesendet: 'Aufmaß an einen Betrieb gesendet', kunde_code: 'Hauseigentümer: Anmelde-E-Mail angefordert', kunde_gesichert: 'Hauseigentümer: Aufmaß gesichert', nachbesserung: 'Nachbesserung gesendet', link_geoeffnet: 'Kundenlink erstmals geöffnet', anmeldecode: 'Anmelde-E-Mail angefordert', anmeldung: 'Anmeldung eines Betriebs', anmeldung_ohne_betrieb: 'Anmeldung ohne Betrieb', registrierung: 'Registrierung', doppelkonto_verdacht: 'Registrierung mit Doppelkonto-Verdacht', projekt: 'Projekt angelegt', code_eingefuegt: 'Aufmaß-Code eingefügt', zahlungsart_kasse: 'Zahlungsart: Stripe geöffnet', abo_kasse: 'Abo: Stripe geöffnet', sammelrechnung: 'Sammelrechnung erstellt' };

  /* ---------- Protokoll ---------- */
  var ART = { widerruf: 'Widerruf', widerruf_bestaetigt: 'Eingangsbestätigung nachgeholt', anmeldung: 'Anmeldung', anmeldung_fehlgeschlagen: 'Anmeldung fehlgeschlagen', sperren: 'Gesperrt', entsperren: 'Entsperrt', loeschen: 'Gelöscht', export: 'Export', liste_export: 'Liste exportiert', einblick: 'Einblick', notiz: 'Notiz', gutschrift: 'Gutschrift', doppelkonto: 'Doppelkonto', nachricht: 'Nachricht', abo: 'Abo', abrechnung: 'Abrechnung', anmeldung_geloescht: 'Anmeldung gelöscht', aufraeumen: 'Aufgeräumt', code_falsch: 'Code falsch' };
  function seiteProtokoll() {
    var d = S.daten.protokoll;
    var wahl = '<div class="f z-art"><label for="z-part">Art</label><select id="z-part" data-in="protokollArt"><option value="">Alle</option>' + Object.keys(ART).map(function (a) { return '<option value="' + a + '"' + (S.protokollArt === a ? ' selected' : '') + '>' + ART[a] + '</option>'; }).join('') + '</select></div>';
    if (!d) return kopf('Protokoll', 'Anmeldungen und Eingriffe', wahl) + (S.fehler ? fehlerKarte() : ladeHinweis());
    if (!d.tabelle) return kopf('Protokoll', 'Anmeldungen und Eingriffe', wahl) + '<div class="z-hinweis warn"><span>Das Protokoll ist noch nicht eingerichtet. Einmal <code>supabase/schema.sql</code> im SQL-Editor von Supabase ausführen.</span></div>';
    var eintraege = d.eintraege.map(function (e) {
      var extra = e.daten && e.art === 'loeschen' ? '<details class="z-details"><summary>Löschnachweis</summary>' + kv([['Betrieb', esc(e.daten.betrieb || '')], ['Registriert', wann(e.daten.registriert)], ['Stripe-Kunde', esc(e.daten.stripe_kunde || '–')], ['Rechnungen', (e.daten.rechnungen || []).map(function (r) { return esc(r.nr + ' · ' + r.datum + ' · ' + euro(r.betrag) + ' · ' + r.status); }).join('<br>') || 'keine'], ['Nicht berechnet', euro(e.daten.nicht_berechnet || 0)]]) + '</details>' : '';
      return '<li><span class="badge' + (e.art === 'anmeldung_fehlgeschlagen' || e.art === 'code_falsch' || e.art === 'loeschen' || e.art === 'sperren' ? ' bad' : e.art === 'einblick' || e.art === 'export' || e.art === 'widerruf' ? ' warn' : '') + '">' + esc(ART[e.art] || e.art) + '</span><span class="z-liste-t">' + esc(e.text) + (e.daten && e.daten.betrieb && e.art !== 'loeschen' ? ' · ' + (e.betrieb ? '<a class="z-a" href="#betrieb/' + esc(e.betrieb) + '">' + esc(e.daten.betrieb) + '</a>' : esc(e.daten.betrieb)) : '') + (e.netz ? ' · ' + esc(e.netz) : '') + (e.daten && e.daten.geraet ? ' · ' + esc(e.daten.geraet) : '') + extra + '</span><span class="z-neben">' + wann(e.zeit) + '</span></li>';
    }).join('');
    return kopf('Protokoll', 'Anmeldungen (90 Tage) und Eingriffe (3 Jahre)', wahl) + (eintraege ? '<section class="z-karte"><ul class="z-liste">' + eintraege + '</ul>' + (d.weitere ? '<button class="btn soft small" type="button" data-act="mehr-protokoll">Ältere laden</button>' : '') + '</section>' : leer('Keine Einträge.'));
  }

  /* ---------- Einstellungen ---------- */
  function seiteEinstellungen() {
    var d = S.daten.einstellungen; if (!d) return kopf('Einstellungen') + (S.fehler ? fehlerKarte() : ladeHinweis());
    var di = d.dienste, an = function (b, ja, nein) { return b ? badge(ja || 'eingerichtet', 'ok') : badge(nein || 'fehlt', 'warn'); };
    var tab = function (b) { return b === null ? badge('ohne Datenbank') : b ? badge('eingerichtet', 'ok') : badge('schema.sql ausführen', 'warn'); };
    var zf = S.zweiFaktor;
    var zweiter = d.zentrale.zweiFaktor ? '<p class="z-text">' + badge('aktiv', 'ok') + ' Die Anmeldung braucht Passwort und Code. Neues Gerät: <code>ZENTRALE_2FA</code> bei Cloudflare ersetzen (hier neu erzeugen); abschalten: dort löschen.</p>' + (zf ? zweiFaktorEinrichten(zf) : '<button class="btn soft small" type="button" data-act="2fa-neu">Neuen Schlüssel erzeugen</button>')
      : '<p class="z-text">' + badge('nicht eingerichtet', 'warn') + ' Mit einem zweiten Faktor reicht ein erratenes Passwort nicht mehr. Nötig für den Einblick in Daten der Endkunden.</p>' + (d.zentrale.totpFehler ? '<p class="z-hinweis bad">ZENTRALE_2FA ist eingetragen, aber kein gültiger Schlüssel. Bitte hier neu erzeugen und ersetzen.</p>' : '') + (zf ? zweiFaktorEinrichten(zf) : '<button class="btn primary small" type="button" data-act="2fa-neu">Zweiten Faktor einrichten</button>');
    var anm = S.anmeldungen;
    return kopf('Einstellungen', 'Angemeldet bis ' + wann(new Date(d.zentrale.sitzungBis).toISOString())) +
      (d.hinweise && d.hinweise.length ? '<ul class="z-hinweise">' + d.hinweise.map(function (h) { return '<li class="z-hinweis bad"><span>' + esc(h) + '</span></li>'; }).join('') + '</ul>' : '') +
      '<div class="z-raster2"><section class="z-karte"><h2 class="z-h2">Dienste</h2>' + kv([['KI-Auswertung', an(di.ki)], ['Zahlungen (Stripe)', di.zahlung.attrappe ? badge('nachgestellt (Test)') : di.zahlung.an ? badge(di.zahlung.test ? 'Testmodus' : 'echtes Geld', di.zahlung.test ? 'warn' : 'ok') : badge('fehlt', 'warn')], ['Stripe-Webhook', di.zahlung.attrappe ? '–' : an(di.zahlung.webhook)], ['Datenbank', di.daten.an ? badge(di.daten.art === 'attrappe' ? 'nachgestellt (Test)' : 'Supabase', 'ok') : badge('fehlt', 'warn')], ['Statistik', tab(di.statistik)], ['Protokoll', tab(di.protokoll)], ['Suchmaschinen', d.indexierung ? badge('freigegeben', 'ok') : badge('gesperrt (Pilotphase)')]]) + '</section>' +
      '<section class="z-karte"><h2 class="z-h2">Preise</h2>' + kv([['Aufmaßblatt', euro(d.preise.aufmass) + ' brutto'], ['Start', d.preise.frei + ' Projekte frei, dann ' + euro(d.preise.projekt)], ['Abo 10', euro(d.preise.abo.grund) + ' im Monat, ' + d.preise.abo.inkl + ' inklusive, dann ' + euro(d.preise.abo.extra)], ['Plus', euro(d.preise.plus) + ' im Monat'], ['Umsatzsteuer', d.preise.mwst ? '19 %, Betriebe netto' : 'keine (Kleinunternehmer, § 19 UStG)']]) + '<p class="z-neben">Ändern über Variablen bei Cloudflare (PREIS_…, MWST), siehe docs/ONLINE-STELLEN.md.</p></section></div>' +
      '<section class="z-karte" id="z-2fa"><h2 class="z-h2">Zweiter Faktor</h2>' + zweiter + '</section>' +
      '<div class="z-raster2"><section class="z-karte"><h2 class="z-h2">Passwort</h2><p class="z-text">Ändern: bei Cloudflare <code>ZENTRALE_PASSWORT</code> ersetzen. Damit enden alle Sitzungen, auch auf anderen Geräten.</p><button class="btn soft small" type="button" data-act="abmelden">Abmelden</button></section>' +
      '<section class="z-karte"><h2 class="z-h2">Sammelrechnungen</h2><p class="z-text">Laufen von selbst am 1. und 15. jeden Monats. Hier lassen sie sich sofort für alle Betriebe mit offenen Buchungen erstellen.</p><button class="btn soft small" type="button" data-act="dlg" data-v="abrechnung"' + (di.zahlung.an ? '' : ' disabled') + '>Jetzt abrechnen</button></section></div>' +
      '<section class="z-karte z-tabkarte"><div class="z-karte-kopf"><h2 class="z-h2">Anmeldungen ohne Betrieb</h2>' + (anm ? '' : '<button class="btn soft small" type="button" data-act="anmeldungen">Anzeigen</button>') + '</div><p class="z-neben">E-Mail-Adressen, die sich angemeldet, aber weder einen Betrieb eingetragen noch ein Aufmaß gesichert haben. Nach 30 Tagen ohne Nutzung löscht der Server sie von selbst.</p>' +
      (anm ? (anm.attrappe ? '<p class="z-neben">Ohne Supabase gibt es keine eigenen Anmeldungen.</p>' : anm.liste.length ? '<table class="z-tab"><thead><tr><th>E-Mail</th><th>Angelegt</th><th>Zuletzt</th><th></th></tr></thead><tbody>' + anm.liste.map(function (u) { return '<tr><td data-k="E-Mail"><span>' + esc(u.mail) + '</span></td><td data-k="Angelegt"><span>' + wann(u.erstellt) + '</span></td><td data-k="Zuletzt"><span>' + (u.zuletzt ? vor(u.zuletzt) : '–') + '</span></td><td data-k=""><span><button class="btn danger small" type="button" data-act="anmeldung-loeschen" data-v="' + esc(u.id) + '">Löschen</button></span></td></tr>'; }).join('') + '</tbody></table>' : '<p class="z-neben">Keine.</p>') + (anm.kunden ? '<p class="z-neben">Nicht in der Liste: ' + nW(anm.kunden, 'Konto', 'Konten') + ' von Hauseigentümern mit gesichertem Aufmaß. Ihre E-Mail-Adressen zeigt die Zentrale nicht; das Konto löschen sie selbst in der App.</p>' : '') : '') + '</section>' +
      '<section class="z-karte"><h2 class="z-h2">Verknüpfungen</h2><p class="z-links">' + [aussen(d.links.cloudflare, 'Cloudflare: Worker fenstero'), d.links.stripe ? aussen(d.links.stripe, 'Stripe') : '', d.links.supabase ? aussen(d.links.supabase, 'Supabase') : '', '<a class="z-a" href="/datenschutz/">Datenschutzerklärung</a>'].filter(Boolean).join('') + '</p></section>';
  }

  /* ---------- Zweiter Faktor einrichten: Schlüssel im Browser erzeugen, QR-Code, Probe-Code, dann bei Cloudflare eintragen ---------- */
  var B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  function b32aus(bytes) { var bits = 0, wert = 0, out = ''; for (var i = 0; i < bytes.length; i++) { wert = (wert << 8) | bytes[i]; bits += 8; while (bits >= 5) { out += B32[(wert >>> (bits - 5)) & 31]; bits -= 5; } wert &= (1 << bits) - 1; } if (bits > 0) out += B32[(wert << (5 - bits)) & 31]; return out; }
  function b32ein(s) { var bits = 0, wert = 0, out = []; for (var i = 0; i < s.length; i++) { var j = B32.indexOf(s[i]); if (j < 0) continue; wert = ((wert << 5) | j) & 0xffffff; bits += 5; if (bits >= 8) { out.push((wert >>> (bits - 8)) & 255); bits -= 8; } } return new Uint8Array(out); }
  async function totp(geheim, schritt) {
    var key = await crypto.subtle.importKey('raw', b32ein(geheim), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    var msg = new Uint8Array(8), x = schritt; for (var i = 7; i >= 0; i--) { msg[i] = x % 256; x = Math.floor(x / 256); }
    var h = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg)), o = h[h.length - 1] & 15;
    return String((((h[o] & 127) * 16777216) + (h[o + 1] << 16) + (h[o + 2] << 8) + h[o + 3]) % 1000000).padStart(6, '0');
  }
  function qrSvg(text) {
    if (!window.qrcode) return '';
    var q = window.qrcode(0, 'M'); q.addData(text); q.make();
    var n = q.getModuleCount(), r = 4, pfad = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) pfad += 'M' + (x + r) + ' ' + (y + r) + 'h1v1h-1z';
    return '<svg class="z-qr" viewBox="0 0 ' + (n + 2 * r) + ' ' + (n + 2 * r) + '" role="img" aria-label="QR-Code für die Authenticator-App" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + pfad + '" fill="#000"/></svg>';
  }
  function zweiFaktorEinrichten(zf) {
    var schritt2 = zf.ok ? '<div class="z-hinweis ok"><span><b>Code stimmt.</b> Jetzt bei Cloudflare eintragen: Workers &amp; Pages → fenstero → Settings → Variables and Secrets → „Add“, Typ <b>Secret</b>, Name <code>ZENTRALE_2FA</code>, Wert: der Schlüssel oben. „Deploy“ drücken. Danach fragt die Anmeldung nach dem Code.</span></div>'
      : '<form class="z-form z-zeile2" data-form="2fa-probe"><div class="f"><label for="z-probe">Code aus der App zur Probe</label><input id="z-probe" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required></div><button class="btn primary small" type="submit">Prüfen</button></form>' + (zf.fehler ? '<p class="err" role="alert">' + esc(zf.fehler) + '</p>' : '');
    return '<ol class="z-schritte"><li>Eine Authenticator-App öffnen (zum Beispiel die von Apple in den Passwörtern, Google Authenticator, Microsoft Authenticator oder 1Password) und diesen QR-Code scannen.</li><li>Den sechsstelligen Code aus der App hier eingeben.</li><li>Den Schlüssel bei Cloudflare als Secret eintragen.</li></ol>' +
      '<div class="z-2fa"><div class="z-qr-box">' + (zf.qr || '<span class="z-neben">QR-Code wird erstellt …</span>') + '</div><div class="z-2fa-r"><div class="f"><label for="z-geheim">Schlüssel (Base32)</label><input id="z-geheim" readonly value="' + esc(zf.geheim) + '"></div><button class="btn soft small" type="button" data-act="2fa-kopieren">Schlüssel kopieren</button>' + schritt2 + '</div></div>' +
      '<p class="z-neben">Der Schlüssel entsteht in diesem Browser und wird nirgends gespeichert. Verlässt du die Seite vorher, einfach neu erzeugen.</p>';
  }
  function qrLaden() { return window.qrcode ? Promise.resolve() : new Promise(function (ok, nein) { var s = document.createElement('script'); s.src = '/vendor/qrcode.js'; s.onload = ok; s.onerror = nein; document.head.appendChild(s); }); }

  /* ---------- Dialoge ---------- */
  /* Frischer Code für heikle Schritte, wenn der zweite Faktor eingerichtet ist */
  function codeFeld() { return S.daten.zweiFaktor ? '<div class="f"><label for="d-code">Aktueller Code aus der Authenticator-App</label><input id="d-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required></div>' : ''; }
  function dialog() {
    var g = S.dialog; if (!g) return '';
    var d = S.daten['betrieb:' + S.id] || {}, titel = '', inhalt = '', knopf = '', gefahr = false;
    switch (g.art) {
      case 'sperren': titel = 'Betrieb sperren'; inhalt = '<p>Der Betrieb kommt nicht mehr in sein Konto, seine Kundenlinks ruhen. Daten und Abrechnung bleiben. Die Begründung sieht er beim Anmelden.</p><div class="f"><label for="d-grund">Begründung</label><textarea id="d-grund" name="grund" rows="3" maxlength="300" required placeholder="z. B. Zahlung trotz Mahnung offen"></textarea></div>'; knopf = 'Sperren'; gefahr = true; break;
      case 'entsperren': titel = 'Betrieb entsperren'; inhalt = '<p>Konto und Kundenlinks funktionieren wieder. Der Betrieb bekommt eine Mitteilung.</p><div class="f"><label for="d-text">Vermerk (optional)</label><input id="d-text" name="text" maxlength="300"></div>'; knopf = 'Entsperren'; break;
      case 'nachricht': titel = 'Nachricht ins Konto'; inhalt = '<p>Erscheint bei den Mitteilungen des Betriebs, absenderlos von eeziframes.</p><div class="f"><label for="d-titel">Betreff</label><input id="d-titel" name="titel" maxlength="80" required></div><div class="f"><label for="d-text">Text</label><textarea id="d-text" name="text" rows="4" maxlength="600" required></textarea></div>'; knopf = 'Senden'; break;
      case 'gutschrift': titel = 'Kostenlose Projekte gutschreiben'; inhalt = '<p>Gilt im Tarif Start. Wartende Aufmaße werden damit sofort freigeschaltet; der Betrieb bekommt eine Mitteilung.</p><div class="f"><label for="d-anzahl">Anzahl</label><select id="d-anzahl" name="anzahl">' + [1, 2, 3, 5, 10].map(function (n) { return '<option value="' + n + '"' + (n === 3 ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></div><div class="f"><label for="d-grund">Anlass (optional)</label><input id="d-grund" name="grund" maxlength="200" placeholder="z. B. Kulanz nach Störung"></div>'; knopf = 'Gutschreiben'; break;
      case 'doppelkonto': titel = 'Doppelkonto-Verdacht aufheben'; inhalt = '<p>Bei der Registrierung gab es schon einen Betrieb mit gleicher Telefonnummer oder gleichem Namen (' + esc(d.doppelt || '') + '), deshalb gab es keine kostenlosen Projekte. Aufheben, wenn es ein eigener Betrieb ist: Dann bekommt er die üblichen kostenlosen Projekte.</p>'; knopf = 'Verdacht aufheben'; break;
      case 'abo': titel = 'Abo'; inhalt = '<p>Zum Monatsende kündigen: wie wenn der Betrieb selbst kündigt, der laufende Monat bleibt. Sofort beenden: Stripe beendet das Abo jetzt, der Tarif ist sofort Start.</p><div class="seg" role="radiogroup" aria-label="Art"><button type="button" data-act="abo-art" data-v="kuendigen" aria-pressed="' + (g.abo !== 'beenden') + '">Zum Monatsende</button><button type="button" data-act="abo-art" data-v="beenden" aria-pressed="' + (g.abo === 'beenden') + '">Sofort beenden</button></div>'; knopf = g.abo === 'beenden' ? 'Abo sofort beenden' : 'Abo kündigen'; gefahr = g.abo === 'beenden'; break;
      case 'abrechnen': titel = 'Jetzt abrechnen'; inhalt = '<p>Die offenen Buchungen dieses Betriebs (' + euro((d.k || {}).nochOffen || 0) + ' netto) gehen jetzt als Sammelrechnung an Stripe und werden von seiner Zahlungsart eingezogen.</p>'; knopf = 'Abrechnen'; break;
      case 'abrechnung': titel = 'Sammelrechnungen jetzt erstellen'; inhalt = '<p>Für alle Betriebe mit offenen Buchungen und Zahlungsart entsteht jetzt eine Sammelrechnung bei Stripe. Doppelt berechnet wird nichts.</p>'; knopf = 'Jetzt abrechnen'; break;
      case 'einblick': titel = 'Kundendaten einblenden'; inhalt = '<p>Namen, Kontakte, Objekte und Aufmaße der Kunden dieses Betriebs. eeziframes verarbeitet sie im Auftrag des Betriebs: Einblick nur mit Anlass, etwa einer Support-Anfrage des Betriebs. Der Einblick steht mit Anlass im Protokoll.</p>' + (S.daten.zweiFaktor === false ? '<p class="z-hinweis warn">Dafür muss der zweite Faktor eingerichtet sein (Einstellungen).</p>' : '') + '<div class="f"><label for="d-grund">Anlass</label><input id="d-grund" name="grund" maxlength="300" required placeholder="z. B. Support-Anfrage des Betriebs vom 15.10."></div>' + codeFeld(); knopf = 'Einblenden'; break;
      case 'export': titel = 'Daten exportieren'; inhalt = '<p>Alle Daten dieses Kontos als JSON-Datei, für die Auskunft (Art. 15 DSGVO) oder zur Mitnahme (Art. 20): Stammdaten, Projekte mit den Daten der Kunden des Betriebs, Aufmaße, Buchungen, Rechnungen, Mitteilungen, interne Notiz und Eingriffe. Aufmaße, die noch auf eine Zahlungsart warten, nur als Umriss. Weil Kundendaten darin stehen: nur mit zweitem Faktor und Anlass, im Protokoll vermerkt.</p>' + (S.daten.zweiFaktor === false ? '<p class="z-hinweis warn">Dafür muss der zweite Faktor eingerichtet sein (Einstellungen).</p>' : '') + '<div class="f"><label for="d-grund">Anlass</label><input id="d-grund" name="grund" maxlength="300" required placeholder="z. B. Auskunftsersuchen des Betriebs vom 15.10."></div>' + codeFeld(); knopf = 'Exportieren'; break;
      case 'loeschen': titel = 'Konto endgültig löschen'; gefahr = true;
        inhalt = '<p>Das lässt sich nicht rückgängig machen:</p><ul class="z-punkte"><li>Ein laufendes Abo endet sofort.</li><li>Anmeldung, Konto, Projekte und Aufmaße werden gelöscht, auch die Daten der Kunden des Betriebs.</li>' + ((d.k || {}).nochOffen ? '<li>' + euro(d.k.nochOffen) + ' sind noch nicht berechnet und entfallen (vorher „Jetzt abrechnen“).</li>' : '') + '<li>Rechnungen bleiben bei Stripe (Aufbewahrungspflicht). Im Protokoll bleibt ein Löschnachweis: Name, Stripe-Kunde, Rechnungsnummern.</li></ul><p>Will der Betrieb seine Daten haben, vorher exportieren.</p><button class="btn soft small" type="button" data-act="dlg" data-v="export">Vorher exportieren</button>' +
          '<div class="f"><label for="d-best">Zur Bestätigung den Namen eintippen: ' + esc(d.name || '') + '</label><input id="d-best" name="bestaetigung" autocomplete="off" required></div><div class="f"><label for="d-grund">Anlass (optional, fürs Protokoll)</label><input id="d-grund" name="grund" maxlength="300" placeholder="z. B. Löschwunsch per E-Mail vom 15.10."></div>' + codeFeld();
        knopf = 'Endgültig löschen'; break;
      case 'anmeldung-loeschen': titel = 'Anmeldung löschen'; inhalt = '<p>Die E-Mail-Adresse wird aus der Anmeldung gelöscht. Zu ihr gehört kein Betrieb.</p>'; knopf = 'Löschen'; gefahr = true; break;
    }
    return '<div class="fx-bg" data-act="dlg-zu"></div><div class="fx-dialog z-dialog" role="dialog" aria-modal="true" aria-labelledby="d-titel-h"><h2 id="d-titel-h">' + esc(titel) + '</h2><form class="z-form" data-form="dialog" novalidate>' + inhalt +
      (g.fehler ? '<p class="err" role="alert">' + esc(g.fehler) + '</p>' : '') +
      '<div class="z-dialog-knoepfe"><button class="btn ' + (gefahr ? 'danger' : 'primary') + '" type="submit"' + (g.sendet ? ' disabled' : '') + '>' + (g.sendet ? 'Einen Moment …' : esc(knopf)) + '</button><button class="btn soft" type="button" data-act="dlg-zu">Abbrechen</button></div></form></div>';
  }
  async function dialogAbschicken(form) {
    var g = S.dialog, f = {}; Array.prototype.forEach.call(form.elements, function (el) { if (el.name) f[el.name] = el.value; });
    var basis = '/api/zentrale/betriebe/' + encodeURIComponent(S.id) + '/', r, mit = function (aktion) { return basis + aktion + '?' + zrQuery(); }; // Antwort im aktuellen Zeitraum
    g.sendet = true; g.fehler = ''; render();
    try {
      switch (g.art) {
        case 'sperren': r = await api(mit('sperren'), { grund: f.grund }); toast('Gesperrt.'); break;
        case 'entsperren': r = await api(mit('entsperren'), { text: f.text }); toast('Entsperrt.'); break;
        case 'nachricht': r = await api(mit('nachricht'), { titel: f.titel, text: f.text }); toast('Nachricht ist im Konto.'); break;
        case 'gutschrift': r = await api(mit('gutschrift'), { anzahl: +f.anzahl, grund: f.grund }); toast('Gutgeschrieben' + (r.freigeschaltet ? ', ' + nW(r.freigeschaltet, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : '') + '.'); break;
        case 'doppelkonto': r = await api(mit('doppelkonto'), {}); toast('Verdacht aufgehoben.'); break;
        case 'abo': r = await api(mit('abo'), { aktion: g.abo === 'beenden' ? 'beenden' : 'kuendigen' }); toast(g.abo === 'beenden' ? 'Abo beendet.' : 'Abo gekündigt.'); break;
        case 'abrechnen': r = await api(mit('abrechnen'), {}); toast(r.ergebnis && r.ergebnis.rechnungen ? 'Sammelrechnung erstellt.' : 'Nichts abzurechnen.'); break;
        case 'abrechnung': { const a = await api('/api/zentrale/abrechnung', {}); toast(nW(a.ergebnis.rechnungen || 0, 'Rechnung', 'Rechnungen') + ' erstellt' + (a.ergebnis.fehler ? ', ' + a.ergebnis.fehler + ' Fehler' + (a.ergebnis.meldung ? ' (zuletzt: ' + a.ergebnis.meldung + ')' : '') : '') + '.'); S.dialog = null; return render(); }
        case 'einblick': r = await api(mit('einblick'), { grund: f.grund, code: f.code || '' }); S.einblick[S.id] = r.betrieb; S.dialog = null; toast('Kundendaten eingeblendet. Im Protokoll vermerkt.'); return render();
        case 'export': await herunterladen(basis + 'export', 'eeziframes-export.json', { grund: f.grund, code: f.code || '' }); S.dialog = null; toast('Export wird gespeichert. Im Protokoll vermerkt.'); return render();
        case 'loeschen': { const l = await api(basis + 'loeschen', { bestaetigung: f.bestaetigung, grund: f.grund, code: f.code || '' }); S.dialog = null; delete S.daten['betrieb:' + S.id]; delete S.einblick[S.id]; S.daten.betriebe = null; S.daten.uebersicht = null; toast(l.geloescht + ' ist gelöscht.' + (l.nachweis === false ? ' Achtung: Der Löschnachweis ließ sich nicht ins Protokoll schreiben (supabase/schema.sql ausführen).' : l.stripeKunde ? ' Bei Stripe bleibt der Kunde mit den Rechnungen.' : '') + (l.anmeldungBleibt ? ' Die Anmeldung bleibt, weil zu ihr gesicherte Aufmaße eines Hauseigentümers gehören.' : '')); location.hash = '#betriebe'; return; }
        case 'anmeldung-loeschen': await api('/api/zentrale/anmeldungen/' + encodeURIComponent(g.v) + '/loeschen', {}); S.anmeldungen = await api('/api/zentrale/anmeldungen'); S.dialog = null; toast('Anmeldung gelöscht.'); return render();
      }
      if (r && r.betrieb) { S.daten['betrieb:' + S.id] = r.betrieb; delete S.einblick[S.id]; S.daten.betriebe = null; S.daten.uebersicht = null; }
      S.dialog = null; render();
    } catch (e) { if (e.still) return; g.sendet = false; g.fehler = e.message; render(); }
  }

  /* ---------- Laden je Seite ---------- */
  async function laden(neu) {
    S.fehler = '';
    var schluessel = { uebersicht: 'uebersicht', betriebe: 'betriebe', betrieb: 'betrieb:' + S.id, kaeufe: 'kaeufe', statistik: 'statistik', protokoll: 'protokoll', einstellungen: 'einstellungen' }[S.seite];
    var q = zrQuery(), mitZeitraum = ['uebersicht', 'betriebe', 'betrieb', 'kaeufe', 'statistik'].includes(S.seite);
    if (!neu && S.daten[schluessel]) return render();
    if (neu) S.daten[schluessel] = null;
    render();
    try {
      var pfad = { uebersicht: '/api/zentrale/uebersicht?' + q, betriebe: '/api/zentrale/betriebe?' + q, betrieb: '/api/zentrale/betriebe/' + encodeURIComponent(S.id) + '?' + q, kaeufe: '/api/zentrale/kaeufe?' + q, statistik: '/api/zentrale/statistik?' + q, protokoll: '/api/zentrale/protokoll' + (S.protokollArt ? '?art=' + encodeURIComponent(S.protokollArt) : ''), einstellungen: '/api/zentrale/einstellungen' }[S.seite];
      var j = await api(pfad);
      if (mitZeitraum && q !== zrQuery()) return; // der Zeitraum hat sich inzwischen geändert, die neuere Anfrage zählt
      if (S.seite === 'betrieb') { S.daten[schluessel] = j.betrieb; S.daten.zweiFaktor = j.zweiFaktor; } else S.daten[schluessel] = j;
    } catch (e) { if (e.still) return; S.fehler = e.message; }
    render();
  }
  function route() {
    var h = (location.hash || '#uebersicht').slice(1), teile = h.split('/');
    var seite = ['uebersicht', 'betriebe', 'betrieb', 'kaeufe', 'statistik', 'protokoll', 'einstellungen'].includes(teile[0]) ? teile[0] : 'uebersicht';
    if (seite === 'betrieb' && !teile[1]) seite = 'betriebe';
    if (seite !== S.seite || teile[1] !== S.id) { S.dialog = null; if (S.seite === 'betrieb' && S.id !== teile[1]) delete S.einblick[S.id]; }
    S.seite = seite; S.id = seite === 'betrieb' ? decodeURIComponent(teile[1]) : '';
    if (S.status && S.status.angemeldet) { laden(false); window.scrollTo(0, 0); } else render();
  }

  /* ---------- Zeichnen ---------- */
  function render() {
    var fokus = document.activeElement, fokusId = fokus && fokus.id, pos = fokus && typeof fokus.selectionStart === 'number' ? fokus.selectionStart : null;
    if (!S.status) { wurzel.innerHTML = '<main class="z-login"><div class="z-login-karte">' + MARKE + '<p class="z-text">' + (S.fehler ? esc(S.fehler) : 'Wird geladen …') + '</p></div></main>'; return; }
    if (!S.status.angemeldet) { wurzel.innerHTML = seiteAnmelden(); var pw = document.getElementById(S.status.zweiFaktor && S.anmeldenFehler && document.getElementById('z-code') ? 'z-code' : 'z-pw'); if (pw && !fokusId) pw.focus(); if (fokusId) { var f0 = document.getElementById(fokusId); if (f0) f0.focus(); } return; }
    var inhalt = { uebersicht: seiteUebersicht, betriebe: seiteBetriebe, betrieb: seiteBetrieb, kaeufe: seiteKaeufe, statistik: seiteStatistik, protokoll: seiteProtokoll, einstellungen: seiteEinstellungen }[S.seite]();
    wurzel.innerHTML = rahmen(inhalt);
    if (fokusId) { var f = document.getElementById(fokusId); if (f) { f.focus(); if (pos != null && typeof f.setSelectionRange === 'function' && f.type !== 'number' && f.type !== 'email') try { f.setSelectionRange(pos, pos); } catch (e) { /* ok */ } } }
    else if (S.dialog) { var erstes = document.querySelector('.z-dialog input:not([readonly]), .z-dialog textarea, .z-dialog select, .z-dialog button'); if (erstes) erstes.focus(); }
    document.title = ({ uebersicht: 'Übersicht', betriebe: 'Betriebe', betrieb: (S.daten['betrieb:' + S.id] || {}).name || 'Betrieb', kaeufe: 'Käufe', statistik: 'Statistik', protokoll: 'Protokoll', einstellungen: 'Einstellungen' }[S.seite] || 'Zentrale') + ' · Zentrale | eeziframes';
  }

  /* ---------- Bedienung ---------- */
  /* Ganze Zeile einer Tabelle führt zum Betrieb (der Name ist zusätzlich ein Link für Tastatur und Vorleser) */
  document.addEventListener('click', function (ev) {
    var tr = ev.target.closest('tr[data-href]'); if (!tr || ev.target.closest('a, button, input, select, textarea')) return;
    location.hash = tr.getAttribute('data-href');
  });
  document.addEventListener('click', async function (ev) {
    var el = ev.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act'), v = el.getAttribute('data-v');
    switch (act) {
      case 'abmelden': ev.preventDefault(); try { await fetch('/api/zentrale/abmelden', { method: 'POST', headers: { 'content-type': 'application/json', 'x-zentrale': '1' }, body: '{}' }); } catch (e) { /* ok */ } S.daten = {}; S.einblick = {}; S.zweiFaktor = null; S.anmeldungen = null; S.status = Object.assign({}, S.status, { angemeldet: false }); S.anmeldenFehler = ''; render(); return;
      case 'neu-laden': return laden(true);
      case 'filter': S.filter = v; return render();
      case 'zeitraum':
        S.zrFehler = '';
        if (v === 'frei') { S.zrFrei = true; render(); var von = document.getElementById('z-von'); if (von) von.focus(); return; }
        S.zrFrei = false; if (S.zeitraum.art === v) return render();
        S.zeitraum = { art: v, von: '', bis: '' }; return zeitraumNeu();
      case 'csv': try { await herunterladen('/api/zentrale/betriebe.csv?' + zrQuery(), 'eeziframes-betriebe.csv'); toast('Tabelle wird gespeichert.'); } catch (e) { if (!e.still) toast(e.message); } return;
      case 'dlg': S.dialog = { art: v, abo: 'kuendigen' }; return render();
      case 'abo-art': if (S.dialog) { S.dialog.abo = v; render(); } return;
      case 'dlg-zu': S.dialog = null; return render();
      case 'einblick-aus': delete S.einblick[S.id]; toast('Kundendaten ausgeblendet.'); return render();
      case 'mehr-protokoll': try { var d = S.daten.protokoll, j = await api('/api/zentrale/protokoll?von=' + (d.eintraege.length) + (S.protokollArt ? '&art=' + encodeURIComponent(S.protokollArt) : '')); d.eintraege = d.eintraege.concat(j.eintraege); d.weitere = j.weitere; render(); } catch (e) { if (!e.still) toast(e.message); } return;
      case 'anmeldungen': try { S.anmeldungen = await api('/api/zentrale/anmeldungen'); render(); } catch (e) { if (!e.still) toast(e.message); } return;
      case 'anmeldung-loeschen': S.dialog = { art: 'anmeldung-loeschen', v: v }; return render();
      case '2fa-neu': { var geheim = b32aus(crypto.getRandomValues(new Uint8Array(20))); S.zweiFaktor = { geheim: geheim, qr: '', ok: false }; render(); try { await qrLaden(); S.zweiFaktor.qr = qrSvg('otpauth://totp/eeziframes:Zentrale?secret=' + geheim + '&issuer=eeziframes&algorithm=SHA1&digits=6&period=30'); } catch (e) { S.zweiFaktor.qr = '<span class="z-neben">QR-Code ließ sich nicht laden. Den Schlüssel von Hand in die App eintragen.</span>'; } render(); var box = document.getElementById('z-2fa'); if (box) box.scrollIntoView({ block: 'start' }); return; }
      case '2fa-kopieren': try { await navigator.clipboard.writeText(S.zweiFaktor.geheim); toast('Schlüssel kopiert.'); } catch (e) { var i = document.getElementById('z-geheim'); if (i) { i.select(); } toast('Bitte den Schlüssel markieren und kopieren.'); } return;
    }
  });
  document.addEventListener('submit', async function (ev) {
    var form = ev.target.closest('[data-form]'); if (!form) return; ev.preventDefault();
    var art = form.getAttribute('data-form');
    if (art === 'anmelden') {
      var pw = form.elements.passwort.value, code = form.elements.code ? form.elements.code.value : '';
      if (!pw) { S.anmeldenFehler = 'Bitte das Passwort eingeben.'; return render(); }
      if (form.elements.code && !/^\d{6}$/.test(code.replace(/\s+/g, ''))) { S.anmeldenFehler = 'Bitte den sechsstelligen Code aus der App eingeben.'; return render(); }
      S.sendet = true; S.anmeldenFehler = ''; render();
      try {
        var r = await fetch('/api/zentrale/anmelden', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ passwort: pw, code: code }) });
        var j = await r.json().catch(function () { return null; });
        S.sendet = false;
        if (!r.ok || !j || !j.ok) { S.anmeldenFehler = (j && j.fehler) || 'Anmeldung nicht möglich.'; render(); var f1 = document.querySelector('.z-login-karte'); if (f1) { f1.classList.remove('shake'); void f1.offsetWidth; f1.classList.add('shake'); } return; }
        S.status = Object.assign({}, S.status, { angemeldet: true, bis: j.bis }); S.anmeldenFehler = ''; document.activeElement && document.activeElement.blur(); route();
      } catch (e) { S.sendet = false; S.anmeldenFehler = 'Keine Verbindung zum Server.'; render(); }
      return;
    }
    if (art === 'dialog') return dialogAbschicken(form);
    if (art === 'zeitraum') {
      var von = form.elements.von.value, bis = form.elements.bis.value, heute = heuteBerlin(), tag = /^\d{4}-\d{2}-\d{2}$/;
      if (!tag.test(von) || !tag.test(bis)) { S.zrFehler = 'Bitte beide Tage wählen.'; return render(); }
      if (von > bis) { var t = von; von = bis; bis = t; }
      if (bis > heute) bis = heute; if (von > heute) von = heute;
      S.zrFehler = ''; S.zeitraum = { art: 'frei', von: von, bis: bis }; document.activeElement && document.activeElement.blur(); return zeitraumNeu();
    }
    if (art === 'notiz') { try { var n = await api('/api/zentrale/betriebe/' + encodeURIComponent(S.id) + '/notiz?' + zrQuery(), { text: form.elements.text.value }); S.daten['betrieb:' + S.id] = n.betrieb; toast('Notiz gespeichert.'); document.activeElement && document.activeElement.blur(); render(); } catch (e) { if (!e.still) toast(e.message); } return; }
    if (art === '2fa-probe') {
      var zf = S.zweiFaktor, c = String(form.elements.code.value || '').replace(/\s+/g, ''), s = Math.floor(Date.now() / 30000), treffer = false;
      for (var d = -1; d <= 1 && !treffer; d++) if ((await totp(zf.geheim, s + d)) === c) treffer = true;
      zf.ok = treffer; zf.fehler = treffer ? '' : 'Der Code passt nicht. Uhrzeit des Telefons prüfen und den nächsten Code versuchen.'; render(); return;
    }
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target.closest('[data-in]'); if (!el) return;
    var f = el.getAttribute('data-in');
    if (f === 'suche') { S.suche = el.value; return render(); }
    if (f === 'kaufSuche') { S.kaufSuche = el.value; return render(); }
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target.closest('[data-in]'); if (!el) return;
    var f = el.getAttribute('data-in');
    if (f === 'sortierung') { S.sortierung = el.value; el.blur(); return render(); }
    if (f === 'protokollArt') { S.protokollArt = el.value; el.blur(); return laden(true); }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && S.dialog && !S.dialog.sendet) { S.dialog = null; render(); } });
  window.addEventListener('hashchange', route);

  /* ---------- Start ---------- */
  (async function start() {
    try { var r = await fetch('/api/zentrale/status', { headers: { accept: 'application/json' }, cache: 'no-store', credentials: 'same-origin' }); S.status = await r.json(); if (!r.ok || !S.status || !S.status.ok) throw new Error('Status'); }
    catch (e) { S.status = null; S.fehler = 'Der Server antwortet gerade nicht. Bitte später noch einmal.'; return render(); }
    route();
  })();
})();

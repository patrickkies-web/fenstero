/* eeziframes · Zentrale des Inhabers (Oberfläche). Daten kommen nur nach der Anmeldung von /api/zentrale/… (functions/api/zentrale.js).
   Die Sitzung ist ein Cookie, das kein Skript lesen kann; jede Anfrage trägt x-zentrale: 1. Nichts wird im Browser gespeichert.
   Seiten über den Anker: #uebersicht, #bestellungen, #bestellung/<id>, #instanzen, #instanz/<id>[/<bereich>], #betriebe, #betrieb/<id>,
   #kaeufe, #statistik, #anzeigen, #protokoll, #einstellungen. Bestellungen und Instanzen gehören zu den Konfigurator-Paketen
   (docs/INSTANZEN.md; Server: functions/api/zentrale-bestellungen.js, zentrale-instanzen.js, cloudflare.js).
   Übersicht, Betriebe, ein Betrieb, Käufe, Statistik und Anzeigen zeigen einen Zeitraum (S.zeitraum, für alle Seiten derselbe). */
(function () {
  'use strict';
  var wurzel = document.getElementById('z');
  var S = { status: null, seite: 'uebersicht', id: '', daten: {}, laedt: false, fehler: '', dialog: null, toast: '', suche: '', filter: 'alle', sortierung: 'neu', zeitraum: { art: '30', von: '', bis: '', vonZeit: '', bisZeit: '' }, zrFrei: false, zrFehler: '', link: { ziel: 'app', netz: 'instagram', kampagne: '' }, einblick: {}, protokollArt: '', kaufSuche: '', zweiFaktor: null, anmeldungen: null, anmeldenFehler: '', sendet: false, reiter: 'start', bfilter: 'handeln', aufgaben: null, cf: {}, bild: {}, frei: {} };

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
  var TARIF = { service: 'Start', abo: 'Abo 10', plus: 'Plus', instanz: 'Instanz' };
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
    if (!r.ok || !j || j.ok === false) { var e = new Error((j && j.fehler) || 'Der Server antwortet gerade nicht.'); e.status = r.status; e.extra = j || {}; throw e; }
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
    opt = opt || {}; var max = Math.max.apply(null, reihe.map(function (x) { return Math.max(x.wert, x.wert2 || 0); }).concat([opt.min || 1]));
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

  /* ---------- Zeitraum der Auswertung: die letzten 7, 30 oder 90 Tage, 12 Monate, alles oder von – bis (Tag, auf Wunsch mit Uhrzeit) ----------
     Der Server rechnet in deutscher Zeit und meldet den Zeitraum zurück (zeitraum: von, bis, vonZeit, bisZeit, start, ende, tage, einheit) */
  var ZEITRAUM = [['1', 'Heute'], ['7', '7 Tage'], ['30', '30 Tage'], ['90', '90 Tage'], ['365', '12 Monate'], ['anfang', 'Gesamt'], ['frei', 'Von – bis']];
  var heuteBerlin = function () { try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  var tagText = function (t) { return t ? datum(t + 'T12:00:00Z') : '–'; };
  var tagKurz = function (t) { return new Date(t + 'T12:00:00Z').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }); };
  var monatText = function (t) { return new Date(t + 'T12:00:00Z').toLocaleDateString('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' }); };
  var monatKurz = function (t) { return new Date(t + 'T12:00:00Z').toLocaleDateString('de-DE', { month: 'short', year: '2-digit', timeZone: 'UTC' }); };
  var JE = { tag: 'je Tag', woche: 'je Woche', monat: 'je Monat' };
  function zrQuery() { var z = S.zeitraum; return z.art === 'frei' ? 'von=' + z.von + (z.vonZeit ? 'T' + z.vonZeit : '') + '&bis=' + z.bis + (z.bisZeit ? 'T' + z.bisZeit : '') : z.art === 'anfang' ? 'von=anfang' : 'tage=' + z.art; }
  var mitUhr = function (zr) { return !!(zr && (zr.vonZeit || zr.bisZeit)); };
  /* „01.10.2026, 08:30 Uhr bis 18.10.2026 (18 Tage)“; bei weniger als zwei Tagen mit Uhrzeit die Dauer in Stunden */
  function zrText(zr) {
    var stunden = mitUhr(zr) ? Math.round((Date.parse(zr.ende) + 1 - Date.parse(zr.start)) / 36e5) : 0;
    return tagText(zr.von) + (zr.vonZeit ? ', ' + zr.vonZeit + ' Uhr' : '') + ' bis ' + tagText(zr.bis) + (zr.bisZeit ? ', ' + zr.bisZeit + ' Uhr' : '') + ' (' + (stunden && stunden < 48 ? nW(stunden, 'Stunde', 'Stunden') : nW(zr.tage, 'Tag', 'Tage')) + ')';
  }
  /* Die Ranglisten der Statistik kennen nur Summen je Tag (Stundenwerte nur für Besuche, Aufrufe und Vorgänge, Seite Anzeigen) */
  var ganzeTage = function (zr) { return mitUhr(zr) ? 'Die Website zählt nur ganze Tage: ' + tagText(zr.von) + ' bis ' + tagText(zr.bis) + '.' : ''; };
  function zeitraumLeiste(zr) {
    var z = S.zeitraum, heute = heuteBerlin();
    var knoepfe = ZEITRAUM.map(function (t) { return '<button type="button" data-act="zeitraum" data-v="' + t[0] + '" aria-pressed="' + (S.zrFrei ? t[0] === 'frei' : z.art === t[0]) + '">' + t[1] + '</button>'; }).join('');
    var feld = function (id, name, typ, titel, wert, extra) { return '<div class="f z-zr-' + typ + '"><label for="' + id + '">' + titel + '</label><input id="' + id + '" name="' + name + '" type="' + typ + '" value="' + esc(wert) + '"' + (extra || '') + '></div>'; };
    var frei = S.zrFrei ? '<form class="z-zr-frei" data-form="zeitraum" novalidate>' +
      '<div class="z-zr-paar">' + feld('z-von', 'von', 'date', 'Von Tag', z.von || (zr ? zr.von : ''), ' max="' + heute + '" required') + feld('z-von-zeit', 'vonZeit', 'time', 'Uhrzeit', z.vonZeit || (zr && zr.vonZeit) || '00:00') + '</div>' +
      '<div class="z-zr-paar">' + feld('z-bis', 'bis', 'date', 'Bis Tag', z.bis || (zr ? zr.bis : heute), ' max="' + heute + '" required') + feld('z-bis-zeit', 'bisZeit', 'time', 'Uhrzeit', z.bisZeit || (zr && zr.bisZeit) || '23:59') + '</div>' +
      '<button class="btn primary small" type="submit">Anwenden</button></form><p class="z-neben">Uhrzeit nach deutscher Zeit; 00:00 bis 23:59 heißt ganze Tage.</p>' + (S.zrFehler ? '<p class="err" role="alert">' + esc(S.zrFehler) + '</p>' : '') : '';
    return '<section class="z-zeitraum" aria-label="Zeitraum der Auswertung"><div class="seg z-zr-seg" role="group" aria-label="Zeitraum">' + knoepfe + '</div>' + frei +
      (zr ? '<p class="z-neben z-zr-text">Ausgewertet: ' + zrText(zr) + '</p>' : '') + '</section>';
  }
  /* Neuer Zeitraum: alles, was davon abhängt, neu laden (die aktuelle Seite sofort, die anderen beim nächsten Besuch) */
  function zeitraumNeu() {
    Object.keys(S.daten).forEach(function (k) { if (/^(uebersicht|betriebe|betrieb:|kaeufe|statistik|anzeigen)/.test(k)) S.daten[k] = null; });
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
  var NAV = [['uebersicht', 'Übersicht'], ['bestellungen', 'Bestellungen'], ['instanzen', 'Instanzen'], ['betriebe', 'Betriebe'], ['kaeufe', 'Käufe'], ['statistik', 'Statistik'], ['anzeigen', 'Anzeigen'], ['protokoll', 'Protokoll'], ['einstellungen', 'Einstellungen']];
  function rahmen(inhalt) {
    var aktiv = { betrieb: 'betriebe', bestellung: 'bestellungen', instanz: 'instanzen' }[S.seite] || S.seite, zu = S.aufgaben && S.aufgaben.anzahl;
    return '<div class="z-app"><aside class="z-seite">' + MARKE + '<nav class="z-nav" aria-label="Bereiche">' + NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (n[0] === aktiv ? ' aria-current="page"' : '') + '>' + n[1] + (n[0] === 'bestellungen' && zu ? '<span class="z-zahl" aria-label="' + zu + ' zu tun">' + zu + '</span>' : '') + '</a>'; }).join('') + '</nav>' +
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
    var pk = d.pakete, mitPaketen = !!(pk && (pk.live || pk.instanzen || pk.demos || pk.inEinrichtung || pk.offen)), aufg = d.aufgaben && d.aufgaben.liste ? d.aufgaben.liste : [];
    if (d.aufgaben) S.aufgaben = { anzahl: d.aufgaben.anzahl };
    var aufgaben = aufg.length ? '<section class="z-karte" aria-label="Aufgaben"><div class="z-karte-kopf"><h2 class="z-h2">Aufgaben</h2>' + badge(nW(d.aufgaben.anzahl, 'zu tun', 'zu tun'), d.aufgaben.anzahl ? 'warn' : 'ok') + '</div><ul class="z-hinweise">' + aufg.map(function (h) { return '<li class="z-hinweis ' + esc(h.art === 'aktion' ? 'info' : h.art) + '"><span>' + esc(h.text) + '</span>' + (h.ziel ? '<a class="z-a" href="#' + esc(h.ziel) + '">Öffnen</a>' : '') + '</li>'; }).join('') + '</ul></section>' : mitPaketen ? '<section class="z-karte" aria-label="Aufgaben"><h2 class="z-h2">Aufgaben</h2><p class="z-neben">Gerade nichts zu tun.</p></section>' : '';
    var summe = function (f) { return v.reduce(function (s, x) { return s + x[f]; }, 0); };
    var mini = function (titel, feld) { return '<section class="z-karte"><h2 class="z-h2">' + esc(titel) + '</h2><p class="z-neben">' + zahl(summe(feld)) + ' im Zeitraum, ' + je + '</p>' + balken(v.map(function (x) { return { wert: x[feld], titel: titelVon(x), kurz: kurzVon(x) }; }), { label: titel + ' ' + je }) + '</section>'; };
    return kopf('Übersicht', 'Stand ' + wann(new Date().toISOString()), '<button class="btn soft small" data-act="neu-laden" type="button">Aktualisieren</button>') +
      aufgaben + (hinweise ? '<ul class="z-hinweise">' + hinweise + '</ul>' : '') + zeitraumLeiste(zr) +
      '<div class="z-stats">' +
      stat('Betriebe', zahl(k.betriebe), (k.neu ? '+' + zahl(k.neu) + ' neu im Zeitraum' : 'keine neuen im Zeitraum') + (k.gesperrt ? ' · ' + zahl(k.gesperrt) + ' gesperrt' : '')) +
      stat('Aktiv im Zeitraum', zahl(k.aktiv), k.betriebe ? Math.round((k.aktiv / k.betriebe) * 100) + '\u00a0% der Betriebe' : '–') +
      stat('Projekte angelegt', zahl(k.projekte), nW(k.verschickt, 'Link', 'Links') + ' verschickt, ' + zahl(k.geoeffnet) + ' geöffnet') +
      stat('Aufmaße eingegangen', zahl(k.aufmasse), nW(k.positionen, 'Position', 'Positionen') + ', ' + nW(k.fotos, 'Foto', 'Fotos'), 'ok') +
      stat('Aufträge der Betriebe', zahl(k.auftraege), zahl(k.angebote) + ' Angebote offen, aus Projekten des Zeitraums (laut Betrieb)') +
      stat('Abos, monatlich', euro(k.mrr), 'Stand heute · Abo 10: ' + zahl(k.tarife.abo) + ' · Plus: ' + zahl(k.tarife.plus) + (k.mwst ? ' · netto' : '')) +
      stat('Umsatz Betriebe', euro(k.umsatzBetriebe), euro(k.bezahltBetriebe) + ' bezahlt · ' + euro(k.offenBetriebe) + ' noch nicht berechnet') +
      stat('Aufmaßblätter verkauft', zahl(k.kaeufe), euro(k.umsatzKaeufe) + ' brutto' + (k.kunden != null ? ' · ' + nW(k.kunden, 'Hauseigentümer hat', 'Hauseigentümer haben') + ' ein Aufmaß gesichert' : '')) +
      stat('Besuche der Website', web ? zahl(web.besuche) : '–', web ? zahl(web.aufrufe) + ' Seitenaufrufe' + (mitUhr(zr) ? ', ganze Tage' : '') : 'Statistik noch nicht eingerichtet') +
      (mitPaketen ? stat('Pakete live', zahl(pk.live), Object.keys(pk.je || {}).map(function (p) { return esc(paketName(p).replace(/^EEZI /, '')) + ' ' + zahl(pk.je[p]); }).join(' · ') + (pk.inEinrichtung ? ' · ' + zahl(pk.inEinrichtung) + ' in Einrichtung' : ''), 'ok') + stat('MRR Pakete', euro(pk.mrr), 'netto, laufende Abos der Konfigurator-Pakete; getrennt vom Abo der Betriebe') : '') +
      '</div>' +
      '<div class="z-raster3">' + mini('Registrierungen', 'registrierungen') + mini('Aufmaße eingegangen', 'aufmasse') + mini('Aufmaßblätter verkauft', 'kaeufe') + '</div>' +
      (web ? '<section class="z-karte"><h2 class="z-h2">Website</h2><p class="z-neben"><span class="z-leg z-leg1"></span>Besuche <span class="z-leg z-leg2"></span>Seitenaufrufe ' + je + ' · häufigste Herkunft: ' + (web.herkunft.length ? web.herkunft.slice(0, 3).map(function (h) { return esc(h.name) + ' (' + zahl(h.n) + ')'; }).join(', ') : 'noch keine') + (mitUhr(zr) ? ' · ' + ganzeTage(zr) : '') + '</p>' + balken(v.map(function (x) { return { wert: x.aufrufe, wert2: x.besuche, titel: titelVon(x) + ' Seitenaufrufe', kurz: kurzVon(x) }; }), { label: 'Besuche und Seitenaufrufe ' + je, name2: 'Besuche' }) + '</section>' : '') +
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
    return [b.instanz ? badge('Instanz', 'acc') : '', b.gesperrt ? badge('gesperrt', 'bad') : '', b.doppelt ? badge('Doppelkonto?', 'warn') : '', b.k.wartend ? badge(b.k.wartend + ' wartet', 'warn') : '', b.k.fehlgeschlagen ? badge('Zahlung fehlgeschlagen', 'bad') : '', !b.zahlungsart && !b.gesperrt ? badge('ohne Zahlungsart') : ''].join(' ');
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
    if (d.instanz) aktionen = '<div class="z-hinweis info"><span>Diese Betriebszeile gehört zu einer Konfigurator-Instanz (Paket). Verwaltet wird sie über die Instanz; löschen geht hier nicht.</span>' + (typeof d.instanz === 'string' ? '<a class="z-a" href="#instanz/' + esc(d.instanz) + '">Instanz öffnen</a>' : '') + '</div>';
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
    if (!d) return kopf('Statistik', 'Ohne Cookies, nur Summen je Tag') + wahl + (S.fehler ? fehlerKarte() : ladeHinweis());
    if (!d.tabelle) return kopf('Statistik', 'Ohne Cookies, nur Summen je Tag') + wahl + '<div class="z-hinweis warn"><span>Die Statistik ist noch nicht eingerichtet. Einmal <code>supabase/schema.sql</code> im SQL-Editor von Supabase ausführen (die Datei lässt sich gefahrlos erneut ausführen). Danach zählt der Server mit.</span></div>';
    var e = d.ereignisse || {}, ev = function (n) { return e[n] || 0; }, seite = function (p) { var x = (d.seiten || []).find(function (s) { return s.schluessel === p; }); return x ? x.n : 0; };
    var einheit = d.zeitraum ? d.zeitraum.einheit : d.tage <= 62 ? 'tag' : d.tage <= 400 ? 'woche' : 'monat', reihe = gruppiert(d.reihe, einheit);
    return kopf('Statistik', 'Ohne Cookies, nur Summen je Tag') + wahl + (mitUhr(d.zeitraum) ? '<div class="z-hinweis info"><span>' + esc(ganzeTage(d.zeitraum)) + ' Die Uhrzeit gilt hier nicht.</span></div>' : '') +
      '<div class="z-stats">' + stat('Besuche', zahl(d.summe.besuche), 'Einstiege von außen') + stat('Seitenaufrufe', zahl(d.summe.aufrufe), d.summe.besuche ? (function (q) { return q.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + (q === 1 ? ' Seite' : ' Seiten') + ' je Besuch'; })(Math.round((d.summe.aufrufe / d.summe.besuche) * 10) / 10) : '–') + stat('Aufmaßblätter verkauft', zahl(ev('kauf')), zahl(ev('kasse')) + ' Kassen geöffnet') + stat('Aufmaße an Betriebe', zahl(ev('aufmass_gesendet')), zahl(ev('link_geoeffnet')) + ' Kundenlinks erstmals geöffnet') + stat('Registrierungen', zahl(ev('registrierung')), zahl(ev('anmeldecode')) + ' Anmelde-E-Mails angefordert') + stat('Zugriffe von Bots', zahl(d.summe.bots), 'Suchmaschinen, KI, Linkvorschauen') + '</div>' +
      '<section class="z-karte"><h2 class="z-h2">' + { tag: 'Je Tag', woche: 'Je Woche', monat: 'Je Monat' }[einheit] + '</h2><p class="z-neben"><span class="z-leg z-leg1"></span>Besuche <span class="z-leg z-leg2"></span>Seitenaufrufe</p>' + balken(reihe, { label: 'Besuche und Seitenaufrufe', name2: 'Besuche' }) + '</section>' +
      '<div class="z-raster2">' +
      trichter('Hauseigentümer', [{ name: 'App geöffnet', n: seite('/app/') }, { name: 'Kasse geöffnet', n: ev('kasse') }, { name: 'Aufmaßblatt gekauft', n: ev('kauf') }], 'App-Aufrufe zählen auch Kunden, die über den Link eines Betriebs kommen. Von der KI ausgewertet: ' + nW(ev('ki_foto'), 'Foto', 'Fotos') + '.') +
      trichter('Kunden der Betriebe', [{ name: 'Kundenlink erstmals geöffnet', n: ev('link_geoeffnet') }, { name: 'Aufmaß an den Betrieb gesendet', n: ev('aufmass_gesendet') }], 'Dazu ' + nW(ev('nachbesserung'), 'Nachbesserung', 'Nachbesserungen') + ' und ' + nW(ev('code_eingefuegt'), 'Aufmaß-Code', 'Aufmaß-Codes') + ', die Betriebe selbst eingefügt haben.') +
      trichter('Fensterbauer', [{ name: 'Seite für Fensterbauer', n: seite('/fuer-fensterbauer/') }, { name: 'Anmelde-E-Mail angefordert', n: ev('anmeldecode') }, { name: 'Registriert', n: ev('registrierung') }], 'Die Startseite (Ansicht Fensterbauer) zählt unter „Seiten“ mit. Danach: ' + nW(ev('projekt'), 'Projekt', 'Projekte') + ' angelegt.') +
      rang('Seiten', d.seiten) + rang('Einstiegsseiten', d.einstiege) + rang('Herkunft', d.herkunft) + rang('Geräte', d.geraet) + rang('Browser', d.browser) + rang('Systeme', d.system) +
      rang('Länder', d.land, function (x) { return landName(x.schluessel); }) + rang('Bots und Linkvorschauen', d.bots, null, 'Noch keine Bots gezählt.') + rang('Dateien für Maschinen', d.dateien, function (x) { return DATEI[x.schluessel] || x.name; }) +
      rang('Vorgänge', Object.keys(e).map(function (n) { return { name: EREIGNIS[n] || n, n: e[n] }; }).sort(function (a, b) { return b.n - a.n; })) +
      '</div><p class="z-neben z-fuss">Gezählt wird auf dem Server, während er eine Seite ausliefert: keine Cookies, kein Skript, keine IP-Adressen, keine Kennungen, nur Summen je Tag (Besuche, Seitenaufrufe und Vorgänge auch je Stunde, siehe Anzeigen). Besuche sind Aufrufe, die nicht von einer eigenen Seite kommen. Nicht gezählt: deine eigenen Aufrufe, solange du angemeldet bist, Aufrufe mit „Global Privacy Control“ oder „Do Not Track“, Vorab-Ladevorgänge, Bots (nur als Familie). Eindeutige Besucher werden bewusst nicht gezählt, dafür bräuchte es eine Kennung.</p>';
  }
  var EREIGNIS = { kasse: 'Kasse geöffnet (Aufmaßblatt)', kauf: 'Aufmaßblatt gekauft', ki_foto: 'Foto von der KI ausgewertet', aufmass_gesendet: 'Aufmaß an einen Betrieb gesendet', kunde_code: 'Hauseigentümer: Anmelde-E-Mail angefordert', kunde_gesichert: 'Hauseigentümer: Aufmaß gesichert', nachbesserung: 'Nachbesserung gesendet', link_geoeffnet: 'Kundenlink erstmals geöffnet', anmeldecode: 'Anmelde-E-Mail angefordert', anmeldung: 'Anmeldung eines Betriebs', anmeldung_ohne_betrieb: 'Anmeldung ohne Betrieb', registrierung: 'Registrierung', doppelkonto_verdacht: 'Registrierung mit Doppelkonto-Verdacht', projekt: 'Projekt angelegt', code_eingefuegt: 'Aufmaß-Code eingefügt', zahlungsart_kasse: 'Zahlungsart: Stripe geöffnet', abo_kasse: 'Abo: Stripe geöffnet', sammelrechnung: 'Sammelrechnung erstellt' };

  /* ---------- Anzeigen: Wirkung von Werbeanzeigen (functions/api/zentrale.js, anzeigenAuswerten) ---------- */
  var ZIELE = [['app', 'App für Hauseigentümer', '/app/'], ['fensterbauer', 'Startseite für Fensterbauer', '/#fensterbauer'], ['info', 'Seite „Für Fensterbauer“', '/fuer-fensterbauer/']];
  var NETZ_WAHL = [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['google', 'Google'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube'], ['pinterest', 'Pinterest']];
  var META_PARAMETER = 'utm_source={{site_source_name}}&utm_medium=paid&utm_campaign={{campaign.name}}';
  var STUNDE_DE = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', hour: '2-digit', hourCycle: 'h23' });
  var stundeText = function (iso) { var p = {}; STUNDE_DE.formatToParts(new Date(iso)).forEach(function (x) { p[x.type] = x.value; }); return p.day + '.' + p.month + '. ' + p.hour + ' Uhr'; };
  var kampagneAus = function (s) { return String(s || '').trim().toLowerCase().replace(/ß/g, 'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40); };
  function anzeigenLink() {
    var z = ZIELE.find(function (x) { return x[0] === S.link.ziel; }) || ZIELE[0], k = kampagneAus(S.link.kampagne), teile = z[2].split('#');
    return location.origin + teile[0] + '?utm_source=' + S.link.netz + '&utm_medium=paid' + (k ? '&utm_campaign=' + k : '') + (teile[1] ? '#' + teile[1] : '');
  }
  var veraenderung = function (k) {
    if (k.vorher == null) return '–';
    if (!k.vorher) return k.wert ? 'neu' : '±0';
    var p = Math.round(((k.wert - k.vorher) / k.vorher) * 100); return p > 0 ? '+' + p + '\u00a0%' : p < 0 ? '−' + Math.abs(p) + '\u00a0%' : '±0';
  };
  function seiteAnzeigen() {
    var d = S.daten.anzeigen, aktual = '<button class="btn soft small" data-act="neu-laden" type="button">Aktualisieren</button>', unter = 'Wirkung deiner Werbung: Besuche je Stunde, Herkunft, Vorgänge';
    if (!d) return kopf('Anzeigen', unter, aktual) + zeitraumLeiste() + (S.fehler ? fehlerKarte() : ladeHinweis());
    if (!d.tabelle) return kopf('Anzeigen', unter, aktual) + zeitraumLeiste(d.zeitraum) + '<div class="z-hinweis warn"><span>Die Statistik ist noch nicht eingerichtet. Einmal <code>supabase/schema.sql</code> im SQL-Editor von Supabase ausführen.</span></div>' + anzeigenLinks();
    var kz = {}; d.kennzahlen.forEach(function (k) { kz[k.id] = k; });
    var werbung = Object.keys(d.werbung || {}).map(function (n) { return { name: EREIGNIS[n] || n, n: d.werbung[n] }; }).sort(function (a, b) { return b.n - a.n; }), ausAnzeigen = werbung.reduce(function (s, x) { return s + x.n; }, 0);
    var ab = d.stundenAb ? stundeText(d.stundenAb) : '', vorStunden = d.stundenwerte && d.stundenAb && Date.parse(d.fenster.start) < Date.parse(d.stundenAb);
    var hinweis = !d.stundenwerte ? '<div class="z-hinweis info"><span>Stundenwerte und den Vergleich gibt es für Zeiträume bis 31 Tage; hier zählen ganze Tage.</span></div>'
      : !d.stundenAb ? '<div class="z-hinweis info"><span>Stundenwerte zählt der Server ab jetzt. Sie erscheinen mit den ersten Besuchen; den Vergleich mit den Tagen davor gibt es nach und nach.</span></div>'
      : vorStunden ? '<div class="z-hinweis info"><span>Stundenwerte gibt es erst ab ' + esc(ab) + '. Besuche und Vorgänge davor fehlen hier; Käufe und Registrierungen sind vollständig.</span></div>' : '';
    var vgl = d.kennzahlen.map(function (k) {
      var f = function (v) { return v == null ? '–' : k.id === 'umsatz' ? euro(v) : (Number(v) || 0).toLocaleString('de-DE', { maximumFractionDigits: 1 }); };
      return '<tr><td data-k="Kennzahl"><span>' + esc(k.name) + (k.ausStunden && !k.mitStunden ? ' *' : '') + '</span></td><td data-k="Im Zeitraum" class="num"><span>' + f(k.wert) + '</span></td><td data-k="Vorher (Ø)" class="num"><span>' + f(k.vorher) + (k.vorher != null ? '<small>aus ' + nW(k.kopien, d.tageVersatz > 1 ? 'Zeitraum' : 'Tag', d.tageVersatz > 1 ? 'Zeiträumen' : 'Tagen') + '</small>' : '') + '</span></td><td data-k="Veränderung" class="num"><span>' + veraenderung(k) + '</span></td></tr>';
    }).join('');
    var vglText = d.tageVersatz > 1 ? 'Vorher: Durchschnitt der Zeiträume gleicher Länge direkt davor (bis 7 Tage zurück).' : 'Vorher: Durchschnitt derselben Uhrzeit an den 7 Tagen davor.';
    var e = d.verlauf.einheit, reihe = d.verlauf.reihe, titel = function (x) { return e === 'stunde' ? stundeText(x.start) : datum(x.start); }, kurz = function (x) { return e === 'stunde' ? stundeText(x.start) : datum(x.start).slice(0, 6); };
    var besuchsChart = balken(reihe.map(function (x) { return { wert: x.besuche, wert2: x.anzeigen == null ? null : x.anzeigen, titel: 'Besuche ' + titel(x), kurz: kurz(x) }; }), { label: 'Besuche und Besuche über Anzeigen ' + (e === 'stunde' ? 'je Stunde' : 'je Tag'), name2: 'über Anzeigen' });
    var vorgangsChart = reihe.some(function (x) { return x.schritte != null; }) ? balken(reihe.map(function (x) { return { wert: x.schritte || 0, wert2: x.abschluesse, titel: 'Schritte ' + titel(x), kurz: kurz(x) }; }), { label: 'Vorgänge ' + (e === 'stunde' ? 'je Stunde' : 'je Tag'), name2: 'Käufe und Registrierungen' }) : '';
    var profil = balken(d.profil.map(function (p) { return { wert: p.besuche, wert2: p.anzeigen, titel: 'Besuche ' + p.stunde + '–' + (p.stunde + 1) + ' Uhr', kurz: p.stunde + ' Uhr' }; }), { label: 'Besuche je Uhrzeit', name2: 'über Anzeigen' });
    return kopf('Anzeigen', unter, aktual) + zeitraumLeiste(d.zeitraum) + hinweis +
      '<div class="z-stats">' +
      stat('Besuche über Anzeigen', zahl(kz.anzeigen.wert), kz.besuche.wert ? Math.round((kz.anzeigen.wert / kz.besuche.wert) * 100) + '\u00a0% von ' + nW(kz.besuche.wert, 'Besuch', 'Besuchen') : 'noch keine Besuche', 'ok') +
      stat('Vorgänge aus Anzeigen', zahl(ausAnzeigen), werbung.length ? werbung.slice(0, 3).map(function (x) { return zahl(x.n) + ' × ' + esc(x.name); }).join(' · ') : 'Kasse, Anmeldung oder KI-Foto auf einer Seite aus einer Anzeige') +
      stat('Aufmaßblätter gekauft', zahl(kz.kauf.wert), euro(kz.umsatz.wert) + ' brutto' + (kz.kauf.vorher != null ? ' · vorher Ø ' + kz.kauf.vorher.toLocaleString('de-DE') : '')) +
      stat('Betriebe registriert', zahl(kz.registrierung.wert), nW(kz.anmeldecode.wert, 'Anmelde-E-Mail', 'Anmelde-E-Mails') + (kz.registrierung.vorher != null ? ' · vorher Ø ' + kz.registrierung.vorher.toLocaleString('de-DE') : '')) + '</div>' +
      '<section class="z-karte z-tabkarte"><h2 class="z-h2">Vergleich mit vorher</h2><p class="z-neben">' + vglText + (d.stundenwerte ? ' Besuche und Vorgänge zählen in vollen Stunden; Käufe (Zeitpunkt der Kasse) und Registrierungen auf die Minute.' : '') + '</p>' +
      '<table class="z-tab"><thead><tr><th>Kennzahl</th><th class="num">Im Zeitraum</th><th class="num">Vorher (Ø)</th><th class="num">Veränderung</th></tr></thead><tbody>' + vgl + '</tbody></table>' +
      (d.kennzahlen.some(function (k) { return k.ausStunden && !k.mitStunden; }) && d.stundenwerte ? '<p class="z-neben">* Der Zeitraum beginnt vor den ersten Stundenwerten, der Wert ist zu niedrig.</p>' : '') + (d.kennzahlen.some(function (k) { return k.ausStunden && k.vorher == null; }) && d.stundenwerte ? '<p class="z-neben">„–“: für die Tage davor gibt es noch keine Stundenwerte' + (ab ? ' (ab ' + esc(ab) + ')' : '') + '.</p>' : '') + '</section>' +
      '<section class="z-karte"><h2 class="z-h2">' + (e === 'stunde' ? 'Besuche je Stunde' : 'Besuche je Tag') + '</h2><p class="z-neben"><span class="z-leg z-leg1"></span>über Anzeigen <span class="z-leg z-leg2"></span>alle Besuche</p>' + besuchsChart + '</section>' +
      (vorgangsChart ? '<section class="z-karte"><h2 class="z-h2">' + (e === 'stunde' ? 'Vorgänge je Stunde' : 'Vorgänge je Tag') + '</h2><p class="z-neben"><span class="z-leg z-leg1"></span>Käufe und Registrierungen <span class="z-leg z-leg2"></span>Schritte davor (Kasse, Anmelde-E-Mail, KI-Foto)</p>' + vorgangsChart + '</section>' : '') +
      (d.stundenwerte ? '<section class="z-karte"><h2 class="z-h2">Besuche nach Uhrzeit</h2><p class="z-neben">Summe je Uhrzeit im Zeitraum: Wann kommen die Besucher, wann die aus Anzeigen?</p>' + profil + '</section>' : '') +
      '<div class="z-raster2">' + rang('Anzeigen nach Netz', d.anzeigen, null, 'Noch kein Besuch über einen Anzeigenlink.') + rang('Kampagnen', d.kampagnen, null, 'Noch keine Kampagne im Link.') + rang('Einstiegsseiten aus Anzeigen', d.anzeigeseiten, null, 'Noch keine.') + rang('Vorgänge aus Anzeigen', werbung, null, 'Noch keine.') + rang('Herkunft aller Besuche', d.herkunft) + '</div>' +
      anzeigenLinks() +
      '<p class="z-neben z-fuss">Gezählt wird ohne Cookies auf dem Server. Ein Besuch zählt als Anzeige, wenn der Link utm_medium=paid trägt (oder eine Klick-Kennung von Google, Microsoft, TikTok und anderen). Kasse, Anmelde-E-Mail, KI-Foto und Registrierung zählen als „aus Anzeigen“, wenn sie auf der Seite passieren, die über den Anzeigenlink geöffnet wurde. Käufe ordnet die Zentrale bewusst keiner Anzeige zu (dafür müsste die Herkunft mit der Zahlung gespeichert werden); ihre Wirkung zeigt der Vergleich. Wer in der App von Instagram oder Facebook surft, ohne dass der Link gekennzeichnet ist, erscheint unter Herkunft als „Instagram“ oder „Facebook“.</p>';
  }
  function anzeigenLinks() {
    var L = S.link, opt = function (liste, wert) { return liste.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === wert ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join(''); };
    return '<section class="z-karte"><h2 class="z-h2">Links für deine Anzeigen</h2><p class="z-text">Damit die Zentrale Besuche aus einer Anzeige erkennt, braucht der Link in der Anzeige ein Kennzeichen. Am besten führt er direkt dorthin, wo gekauft oder registriert wird: Dann zählen auch Kasse und Anmeldung als „aus Anzeigen“.</p>' +
      '<div class="z-werkzeug"><div class="f"><label for="z-l-ziel">Ziel</label><select id="z-l-ziel" data-in="linkZiel">' + opt(ZIELE, L.ziel) + '</select></div><div class="f"><label for="z-l-netz">Netz</label><select id="z-l-netz" data-in="linkNetz">' + opt(NETZ_WAHL, L.netz) + '</select></div>' +
      '<div class="f z-suche"><label for="z-l-kamp">Kampagne (optional)</label><input id="z-l-kamp" data-in="linkKampagne" value="' + esc(L.kampagne) + '" placeholder="z. B. herbst-hauseigentuemer" autocomplete="off" maxlength="60"></div></div>' +
      '<div class="f"><label for="z-l-url">Link für die Anzeige</label><input id="z-l-url" readonly value="' + esc(anzeigenLink()) + '"></div><button class="btn soft small" type="button" data-act="kopieren" data-v="z-l-url">Link kopieren</button>' +
      '<p class="z-text">Bei Meta (Instagram, Facebook) geht es auch für alle Anzeigen auf einmal: im Werbeanzeigenmanager bei der Anzeige unter „URL-Parameter“ das hier eintragen. Meta setzt Netz und Kampagnennamen dann selbst ein.</p>' +
      '<div class="f"><label for="z-l-meta">URL-Parameter für Meta</label><input id="z-l-meta" readonly value="' + esc(META_PARAMETER) + '"></div><button class="btn soft small" type="button" data-act="kopieren" data-v="z-l-meta">Parameter kopieren</button></section>';
  }

  /* ---------- Protokoll ---------- */
  var ART = { bestellung: 'Bestellung', instanz: 'Instanz', instanz_versand: 'Versand', instanz_domain: 'Domain', instanz_fotos: 'Fotos', widerruf: 'Widerruf', widerruf_bestaetigt: 'Eingangsbestätigung nachgeholt', anmeldung: 'Anmeldung', anmeldung_fehlgeschlagen: 'Anmeldung fehlgeschlagen', sperren: 'Gesperrt', entsperren: 'Entsperrt', loeschen: 'Gelöscht', export: 'Export', liste_export: 'Liste exportiert', einblick: 'Einblick', notiz: 'Notiz', gutschrift: 'Gutschrift', doppelkonto: 'Doppelkonto', nachricht: 'Nachricht', abo: 'Abo', abrechnung: 'Abrechnung', anmeldung_geloescht: 'Anmeldung gelöscht', aufraeumen: 'Aufgeräumt', code_falsch: 'Code falsch' };
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
      (d.pakete ? '<section class="z-karte"><h2 class="z-h2">Konfigurator-Pakete</h2>' + kv([['Verkauf', d.pakete.offen ? badge('offen (PAKETE_OFFEN=1)', 'ok') : badge('vorläufige Preise, Anfrageformular', 'warn')], ['Cloudflare (Domains)', d.pakete.cloudflare ? badge('verbunden', 'ok') : badge('von Hand (CF_API_TOKEN, CF_ACCOUNT_ID fehlen)', 'warn')], ['Sitzungen (Kundenkonto, Dashboard)', d.pakete.sitzung ? badge('eingerichtet', 'ok') : badge('SITZUNG_GEHEIMNIS fehlt', 'warn')], ['Absender der Anfragen', d.pakete.absender ? esc(d.pakete.absender) : badge('MAIL_ABSENDER_INSTANZ fehlt', 'warn')], ['Zustellung (Resend-Webhook)', d.pakete.webhook ? badge('eingerichtet', 'ok') : badge('RESEND_WEBHOOK_SECRET fehlt', 'warn')]]) + '<p class="z-neben">Einrichtung: Bauplan §4 und docs/INSTANZEN.md.</p></section>' : '') +
      '<section class="z-karte" id="z-2fa"><h2 class="z-h2">Zweiter Faktor</h2>' + zweiter + '</section>' +
      '<div class="z-raster2"><section class="z-karte"><h2 class="z-h2">Passwort</h2><p class="z-text">Ändern: bei Cloudflare <code>ZENTRALE_PASSWORT</code> ersetzen. Damit enden alle Sitzungen, auch auf anderen Geräten.</p><button class="btn soft small" type="button" data-act="abmelden">Abmelden</button></section>' +
      '<section class="z-karte"><h2 class="z-h2">Sammelrechnungen</h2><p class="z-text">Laufen von selbst am 1. und 15. jeden Monats. Hier lassen sie sich sofort für alle Betriebe mit offenen Buchungen erstellen.</p><button class="btn soft small" type="button" data-act="dlg" data-v="abrechnung"' + (di.zahlung.an ? '' : ' disabled') + '>Jetzt abrechnen</button></section></div>' +
      '<section class="z-karte z-tabkarte"><div class="z-karte-kopf"><h2 class="z-h2">Anmeldungen ohne Betrieb</h2>' + (anm ? '' : '<button class="btn soft small" type="button" data-act="anmeldungen">Anzeigen</button>') + '</div><p class="z-neben">E-Mail-Adressen, die sich angemeldet, aber weder einen Betrieb eingetragen noch ein Aufmaß gesichert haben. Nach 30 Tagen ohne Nutzung löscht der Server sie von selbst.</p>' +
      (anm ? (anm.attrappe ? '<p class="z-neben">Ohne Supabase gibt es keine eigenen Anmeldungen.</p>' : anm.liste.length ? '<table class="z-tab"><thead><tr><th>E-Mail</th><th>Angelegt</th><th>Zuletzt</th><th></th></tr></thead><tbody>' + anm.liste.map(function (u) { return '<tr><td data-k="E-Mail"><span>' + esc(u.mail) + '</span></td><td data-k="Angelegt"><span>' + wann(u.erstellt) + '</span></td><td data-k="Zuletzt"><span>' + (u.zuletzt ? vor(u.zuletzt) : '–') + '</span></td><td data-k=""><span><button class="btn danger small" type="button" data-act="anmeldung-loeschen" data-v="' + esc(u.id) + '">Löschen</button></span></td></tr>'; }).join('') + '</tbody></table>' : '<p class="z-neben">Keine.</p>') + (anm.kunden ? '<p class="z-neben">Nicht in der Liste: ' + nW(anm.kunden, 'Konto', 'Konten') + ' von Hauseigentümern mit gesichertem Aufmaß. Ihre E-Mail-Adressen zeigt die Zentrale nicht; das Konto löschen sie selbst in der App.</p>' : '') + (anm.pakete ? '<p class="z-neben">Ebenfalls nicht in der Liste: ' + nW(anm.pakete, 'Anmeldung', 'Anmeldungen') + ' von Kundenkonten der Konfigurator-Pakete und Dashboard-Zugängen. Sie bleiben, solange Konto oder Zugang bestehen.</p>' : '') : '') + '</section>' +
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

  /* =====================================================================================================================
     Konfigurator-Pakete (docs/INSTANZEN.md, Bauplan §3 C): Bestellungen, Instanzen, Domain, Gestaltung, Ampel „Live“, Betrieb.
     Der nächste Schritt einer Bestellung ist der Hauptknopf (eine Cream-Pille je Bildschirm), darunter steht, was fehlt. Alles, was
     entscheidet (Übergänge, Ampel, Fristen), rechnet der Server; die Oberfläche zeigt an und ruft auf. Bilder für die Gestaltung
     entstehen hier im Browser (Canvas): Logo als PNG bis 600 px, Icons 32/180/192/512, Vorschaubild 1200 × 630, Startbilder 16:9 mit
     1600 px als JPEG; ein SVG wird vorher zu einem Pixelbild, damit nie ein Skript aus einer Datei des Kunden ausgeliefert wird.
     ===================================================================================================================== */
  var PK = function () { return window.Pakete || null; }, IR = function () { return window.Instanzregeln || null; };
  var paketName = function (p) { var P = PK(); return P && P.PAKETE[p] ? P.PAKETE[p].name : (p || '–'); };
  var B_TON = { offen: '', bezahlt: 'acc', einrichtung: 'warn', domain: 'warn', freigabe: 'warn', live: 'ok', pausiert: 'bad', beendet: '', storniert: '' };
  var I_TITEL = { einrichtung: 'in Einrichtung', aktiv: 'live', pausiert: 'pausiert', beendet: 'beendet' }, I_TON = { einrichtung: 'warn', aktiv: 'ok', pausiert: 'bad', beendet: '' };
  var V_TON = { zugestellt: 'ok', gesendet: 'ok', offen: 'warn', bounce: 'bad', fehler: 'bad', beschwerde: 'bad' };
  var V_TITEL = { zugestellt: 'zugestellt', gesendet: 'gesendet', offen: 'offen', bounce: 'nicht zugestellt', fehler: 'Fehler', beschwerde: 'Beschwerde' };
  var ART_ANFRAGE = { website: 'Website', einladung: 'Einladung', test: 'Test', demo: 'Demo' };
  var bTitel = function (s) { var R = IR(); return (R && R.bestellung.TITEL[s]) || s; };
  var telLink = function (t) { return t ? '<a class="z-a" href="tel:' + esc(String(t).replace(/[^\d+]/g, '')) + '">' + esc(t) + '</a>' : '–'; };
  var mailLink = function (m) { return m ? '<a class="z-a" href="mailto:' + esc(m) + '">' + esc(m) + '</a>' : '–'; };
  var knopf = function (text, act, v, extra, ton) { return '<button class="btn ' + (ton || 'soft') + ' small" type="button" data-act="' + act + '"' + (v != null ? ' data-v="' + esc(v) + '"' : '') + (extra || '') + '>' + esc(text) + '</button>'; };
  var TAGE_DE = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa' }, KANAL = { telefon: 'am liebsten Telefon', mail: 'am liebsten E-Mail', egal: 'Telefon oder E-Mail' };
  var erreichText = function (e) { return e && e.tage && e.tage.length ? e.tage.map(function (t) { return TAGE_DE[t] || t; }).join(', ') + ' ' + (e.von || '') + '–' + (e.bis || '') + ' Uhr, ' + (KANAL[e.kanal] || KANAL.egal) + (e.hinweis ? ' (' + e.hinweis + ')' : '') : '–'; };

  /* Aufgaben: Zahl in der Navigation (nur das Abzeichen wird neu gezeichnet, nicht die Seite) */
  async function aufgabenLaden() {
    try { S.aufgaben = await api('/api/zentrale/aufgaben'); } catch (e) { return; }
    var a = document.querySelector('.z-nav a[href="#bestellungen"]'); if (!a) return;
    var z = a.querySelector('.z-zahl'), n = S.aufgaben.anzahl || 0;
    if (n && !z) { z = document.createElement('span'); z.className = 'z-zahl'; a.appendChild(z); }
    if (z) { if (n) { z.textContent = String(n); z.setAttribute('aria-label', n + ' zu tun'); } else z.remove(); }
  }
  /* Antworten der Aktionen übernehmen; Listen und Übersicht beim nächsten Besuch neu laden */
  function uebernehmen(r) {
    if (r && r.bestellung && r.bestellung.id) {
      S.daten['bestellung:' + r.bestellung.id] = r.bestellung;
      /* die Bestellung bringt ihre Instanz ohne Versandliste und Kennzahlen mit: die behält die Instanzseite */
      var ni = r.bestellung.instanz, alt = ni && S.daten['instanz:' + ni.id];
      if (alt) S.daten['instanz:' + ni.id] = Object.assign({}, ni, { versand: alt.versand, kennzahlen: alt.kennzahlen });
    }
    if (r && r.instanz && r.instanz.ampel) {
      S.daten['instanz:' + r.instanz.id] = r.instanz;
      if (!(r.bestellung && r.bestellung.id) && r.instanz.bestellung && r.instanz.bestellung.id) delete S.daten['bestellung:' + r.instanz.bestellung.id]; // beim nächsten Aufruf frisch
    }
    S.daten.bestellungen = null; S.daten.instanzen = null; S.daten.uebersicht = null; S.daten.betriebe = null;
  }
  /* Aktion mit Rückmeldung; verlangt der Server einen frischen Code (zweiter Faktor), fragt ein Dialog ihn ab und schickt erneut */
  async function aktion(pfad, body, erfolg, knopfEl) {
    if (knopfEl) knopfEl.disabled = true;
    try { var r = await api(pfad, body || {}); uebernehmen(r); if (erfolg) toast(typeof erfolg === 'function' ? erfolg(r) : erfolg); render(); aufgabenLaden(); return r; }
    catch (e) {
      if (knopfEl) knopfEl.disabled = false;
      if (e.still) return null;
      if (e.status === 403 && e.extra && e.extra.code) { S.dialog = { art: 'code', pfad: pfad, body: body || {}, erfolg: typeof erfolg === 'string' ? erfolg : '' }; render(); return null; }
      if (e.extra && e.extra.konflikte) { S.cf[S.id] = e.extra; render(); }
      toast(e.message); return null;
    }
  }

  /* ---------- Bausteine ---------- */
  function leiste(status) {
    var R = IR(); if (!R || status === 'storniert') return '';
    var L = R.bestellung.LEISTE, i = L.map(function (x) { return x.status; }).indexOf(status), nach = i < 0 ? L.length : i;
    return '<ol class="z-leiste" aria-label="Stand der Bestellung">' + L.map(function (x, j) { return '<li class="' + (j < nach || (status === 'live' && j === nach) ? 'fertig' : j === nach ? 'jetzt' : '') + '"' + (j === i ? ' aria-current="step"' : '') + '><span>' + esc(x.titel) + '</span></li>'; }).join('') + '</ol>';
  }
  function ampelKarte(a, titel) {
    if (!a) return '';
    return '<section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">' + esc(titel || 'Bereit für Live?') + '</h2>' + badge(a.bereit ? 'alles grün' : (a.fehlt.length === 1 ? '1 Punkt offen' : a.fehlt.length + ' Punkte offen'), a.bereit ? 'ok' : 'warn') + '</div><ul class="z-ampel">' +
      a.punkte.map(function (p) { return '<li class="' + (p.ok ? 'ok' : 'offen') + '"><span class="z-ampel-t">' + esc(p.text) + (p.hinweis ? '<small>' + esc(p.hinweis) + '</small>' : '') + '</span>' + badge(p.ok ? 'erledigt' : 'offen', p.ok ? 'ok' : 'warn') + '</li>'; }).join('') + '</ul></section>';
  }
  function hauptknopf(s, bid, iid) {
    if (!s) return '';
    var data = ' data-b="' + esc(bid || '') + '" data-i="' + esc(iid || '') + '"';
    var knoepfe = s.aktion ? '<button class="btn primary" type="button" data-act="schritt" data-v="' + esc(s.aktion) + '"' + data + '>' + esc(s.text) + '</button>' : '';
    if (s.neben === 'domain-gesichert') knoepfe += '<button class="btn soft small" type="button" data-act="schritt" data-v="domain-gesichert"' + data + '>Trotzdem „Domain gesichert“</button>';
    if (s.aktion === 'live') knoepfe += '<button class="btn soft small" type="button" data-act="schritt" data-v="vorschau"' + data + '>Vorschau erneut senden</button>';
    return '<section class="z-karte z-schritt" aria-label="Nächster Schritt"><p class="eyebrow">Nächster Schritt</p>' + (knoepfe ? '<div class="z-aktionen">' + knoepfe + '</div>' : '<p class="z-text">' + esc(s.text || 'Gerade nichts zu tun.') + '</p>') +
      (s.aenderung ? '<p class="z-hinweis warn"><span>Änderung gewünscht: ' + esc(s.aenderung) + '</span></p>' : '') +
      (s.aktion === 'live' && s.wartet && !s.aenderung ? '<p class="z-neben">Die Freigabe des Kunden steht noch aus. Live geht auch mit einem Vermerk (mindestens 10 Zeichen), etwa „Freigabe telefonisch am …“.</p>' : '') +
      (s.fehlt && s.fehlt.length ? '<div class="z-fehlt"><p class="z-neben">Was noch fehlt:</p><ul class="z-punkte">' + s.fehlt.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' : '') + '</section>';
  }

  /* ---------- Bestellungen ---------- */
  var B_FILTER = [['handeln', 'Zu tun'], ['alle', 'Alle'], ['offen', 'Bestellt'], ['einrichtung', 'In Einrichtung'], ['live', 'Live'], ['pausiert', 'Pausiert'], ['beendet', 'Beendet']];
  function bFilter(f, b) { switch (f) { case 'handeln': return b.handeln; case 'offen': return b.status === 'offen'; case 'einrichtung': return ['bezahlt', 'einrichtung', 'domain', 'freigabe'].indexOf(b.status) >= 0; case 'live': return b.status === 'live'; case 'pausiert': return b.status === 'pausiert'; case 'beendet': return b.status === 'beendet' || b.status === 'storniert'; default: return true; } }
  function rueckrufListe(rr, alle) {
    var liste = alle ? rr : rr.filter(function (n) { return n.faellig; });
    if (!liste.length) return '';
    return '<section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Rückrufe</h2>' + badge(nW(rr.filter(function (n) { return n.faellig; }).length, 'heute fällig', 'heute fällig'), rr.some(function (n) { return n.ueberfaellig; }) ? 'bad' : 'warn') + '</div><ul class="z-liste">' + liste.map(function (n) {
      var r = n.rueckruf || {};
      return '<li><span class="badge ' + (n.ueberfaellig ? 'bad' : n.faellig ? 'warn' : '') + '">' + (n.ueberfaellig ? 'überfällig' : n.faellig ? 'heute' : esc(String(r.tag || '').split('-').reverse().join('.'))) + '</span><span class="z-liste-t"><b>' + esc(n.firma || 'Partner') + '</b> · ' + esc(String(r.fenster || '').replace('-', '–')) + ' Uhr · ' + telLink(r.tel) + (r.thema ? ' · ' + esc(r.thema) : '') + (n.text && n.text !== r.thema ? '<br><span class="z-neben">' + esc(n.text) + '</span>' : '') + (n.bestellung ? ' · <a class="z-a" href="#bestellung/' + esc(n.bestellung) + '">Bestellung</a>' : '') + '</span>' + knopf('Erledigt', 'dlg', 'rueckruf', ' data-n="' + esc(n.id) + '"') + '</li>';
    }).join('') + '</ul></section>';
  }
  function seiteBestellungen() {
    var d = S.daten.bestellungen; if (!d) return kopf('Bestellungen') + (S.fehler ? fehlerKarte() : ladeHinweis());
    if (!d.tabelle) return kopf('Bestellungen') + '<div class="z-hinweis warn"><span>Die Tabellen der Konfigurator-Pakete fehlen noch: <code>supabase/schema.sql</code> erneut im SQL-Editor von Supabase ausführen.</span></div>';
    var liste = d.bestellungen.filter(function (b) { return bFilter(S.bfilter, b); });
    var zeilen = liste.map(function (b) {
      return '<tr data-href="#bestellung/' + esc(b.id) + '"><td data-k="Bestellung"><span><a class="z-zeile" href="#bestellung/' + esc(b.id) + '"><b>' + esc(b.firma || '–') + '</b><small>' + esc(b.nr) + ' · ' + esc(b.mail) + '</small></a></span></td>' +
        '<td data-k="Paket"><span>' + esc(paketName(b.paket)) + '</span></td><td data-k="Stand"><span>' + badge(b.statusTitel, B_TON[b.status]) + (b.aboTitel && b.status !== 'live' ? '' : b.abo_status && b.abo_status !== 'aktiv' ? ' ' + badge(b.aboTitel, b.abo_status === 'zahlung_offen' ? 'warn' : '') : '') + '</span></td>' +
        '<td data-k="Domain"><span>' + (b.domain ? esc(b.domain) + (b.domainWunsch ? ' <small>Wunsch</small>' : b.domainOk ? ' ' + badge('ok', 'ok') : ' ' + badge('prüfen', 'warn')) : '–') + '</span></td>' +
        '<td data-k="Nächster Schritt"><span>' + (b.handeln ? badge(b.schritt || 'ansehen', 'acc') : esc(b.schritt || '–')) + '</span></td><td data-k="Nachrichten" class="num"><span>' + (b.ungelesen ? badge(String(b.ungelesen), 'warn') : '–') + '</span></td><td data-k="Zuletzt"><span>' + vor(b.updated_at) + '</span></td></tr>';
    }).join('');
    return kopf('Bestellungen', nW(d.bestellungen.length, 'Bestellung', 'Bestellungen') + ' der Konfigurator-Pakete', '<button class="btn soft small" data-act="neu-laden" type="button">Aktualisieren</button>') +
      rueckrufListe(d.rueckrufe || [], true) +
      '<div class="chips z-filter" role="group" aria-label="Filter">' + B_FILTER.map(function (f) { return '<button type="button" class="chip" data-act="bfilter" data-v="' + f[0] + '" aria-pressed="' + (S.bfilter === f[0]) + '">' + f[1] + ' <span class="z-n">' + zahl(d.bestellungen.filter(function (b) { return bFilter(f[0], b); }).length) + '</span></button>'; }).join('') + '</div>' +
      (liste.length ? '<div class="z-karte z-tabkarte"><table class="z-tab"><thead><tr><th>Bestellung</th><th>Paket</th><th>Stand</th><th>Domain</th><th>Nächster Schritt</th><th class="num">Nachrichten</th><th>Zuletzt</th></tr></thead><tbody>' + zeilen + '</tbody></table></div>' : leer(d.bestellungen.length ? 'Nichts in diesem Filter.' : 'Noch keine Bestellung.', d.bestellungen.length ? '' : 'Bestellungen kommen über die Verkaufsseite und das Kundenkonto (/partner/).'));
  }
  /* „Wahrscheinlich frei“ fürs Gespräch vor dem Domainkauf (Schätzung über das DNS, serverseitig) */
  function freiBadge(bid, host) {
    var x = (S.frei[bid] || {})[String(host || '').toLowerCase().replace(/^www\./, '')];
    return x ? ' ' + badge(x.text, x.frei === true ? 'ok' : x.frei === false ? 'bad' : 'warn') : '';
  }
  function domainFreiForm(d, k) {
    if (['bezahlt', 'einrichtung', 'offen'].indexOf(d.status) < 0) return '';
    var wunsch = (k.domains || []).map(function (x) { return String(x).toLowerCase().replace(/^www\./, ''); }), extra = Object.keys(S.frei[d.id] || {}).filter(function (h) { return wunsch.indexOf(h) < 0; });
    return '<form class="z-form z-zeile2" data-form="b-frei"><div class="f"><label for="z-frei">Domain frei?</label><input id="z-frei" name="host" autocomplete="off" placeholder="' + esc((k.domains || [])[0] || 'ihr-name-fenster.de') + '"></div><button class="btn soft small" type="submit">Prüfen</button></form>' +
      (extra.length ? '<p class="z-neben">' + extra.map(function (h) { return esc(h) + freiBadge(d.id, h); }).join(' · ') + '</p>' : '') +
      '<p class="z-neben">' + (wunsch.length ? 'Leer lassen prüft die Wunsch-Domains. ' : '') + 'Eine Schätzung über das DNS; sicher ist erst der Kauf.</p>';
  }
  function seiteBestellung() {
    var d = S.daten['bestellung:' + S.id], zurueck = '<a class="z-a z-zurueck" href="#bestellungen">← Alle Bestellungen</a>';
    if (!d) return zurueck + (S.fehler ? fehlerKarte() : ladeHinweis());
    var p = d.partner || {}, pd = p.daten || {}, w = d.wunsch || {}, k = w.konfigurator || {}, g = w.gestaltung || {}, f = w.firma || {}, i = d.instanz, za = d.zahlung, ab = d.abo, v = d.vorschau || {};
    var titel = badge(paketName(d.paket), 'acc') + ' ' + badge(d.statusTitel, B_TON[d.status]) + (d.abo_status ? ' ' + badge('Abo: ' + d.aboTitel, d.abo_status === 'aktiv' ? 'ok' : d.abo_status === 'zahlung_offen' ? 'warn' : '') : '') + ' <span class="z-neben">· ' + esc(d.nr) + ' · bestellt ' + datum(d.created_at) + '</span>';
    var unternehmen = kv([['Firma', esc(p.firma || '–')], ['Ansprechpartner', esc((pd.ap || '–') + (pd.rolle ? ' (' + pd.rolle + ')' : ''))], ['Telefon', telLink(pd.tel)], ['E-Mail', mailLink(p.mail)], ['Erreichbar', esc(erreichText(pd.erreichbar)) + (d.erreichbar === true ? ' ' + badge('jetzt erreichbar', 'ok') : d.erreichbar === false ? ' ' + badge('gerade nicht') : '')],
      ['Anschrift', esc([pd.strasse, [pd.plz || p.plz, pd.ort].filter(Boolean).join(' ')].filter(Boolean).join(', ') || '–') + (pd.bundesland && IR() ? ' · ' + esc(IR().BUNDESLAENDER[pd.bundesland] || pd.bundesland) : '')], ['USt-IdNr.', esc(pd.ust || '–')], ['Website', pd.web ? aussen(/^https:/.test(pd.web) ? pd.web : 'https://' + String(pd.web).replace(/^https?:\/\//, ''), pd.web) : '–'],
      ['Impressum', esc([pd.rechtsform, pd.vertretung ? 'vertreten durch ' + pd.vertretung : '', pd.register, pd.kammer, pd.beruf].filter(Boolean).join(' · ') || '–')], pd.dup ? ['Hinweis', badge('mögliche Doppelbestellung: ' + pd.dup, 'warn')] : null, p.stripe ? ['Stripe-Kunde', aussen(d.kundeLink, p.stripe)] : null]);
    var dateien = (d.dateien || []).map(function (x) { return '<li><span class="badge">' + esc({ logo: 'Logo', foto: 'Foto', ap: 'Ansprechpartner', druck: 'Druckvorlage' }[x.art] || x.art) + '</span><span class="z-liste-t">' + esc(x.name) + ' <span class="z-neben">' + Math.round((x.bytes || 0) / 1024) + ' KB</span></span>' + knopf('Laden', 'datei', null, ' data-b="' + esc(d.id) + '" data-d="' + esc(x.id) + '" data-n="' + esc(x.name) + '"') + '</li>'; }).join('');
    var wuensche = kv([['Name im Konfigurator', esc(k.name || '–')], ['Wunsch-Domains', (k.domains || []).length ? k.domains.map(function (x) { return esc(x) + freiBadge(d.id, x); }).join(', ') : (k.vorschlaege ? 'bitte Vorschläge machen' : '–')], ['Anfragen an', (k.eingang || []).map(esc).join(', ') || '–'], (k.zugang || []).length ? ['Dashboard-Zugänge', k.zugang.map(esc).join(', ')] : null,
      (g.farben || []).length ? ['Farben', g.farben.map(function (c) { return '<span class="z-tupfen" style="--c:' + esc(c) + '"></span>' + esc(c); }).join(' ')] : null, g.titel ? ['Titel', esc(g.titel)] : null, g.begruessung ? ['Begrüßung', esc(g.begruessung)] : null, g.notiz ? ['Notiz', esc(g.notiz)] : null, g.logoFolgt ? ['Logo', 'kommt später'] : null, w.geaendert ? ['Ergänzt', wann(w.geaendert)] : null]);
    var instanz = i ? kv([['Instanz', '<a class="z-a" href="#instanz/' + esc(i.id) + '">' + esc(i.slug) + '</a> ' + badge(I_TITEL[i.status] || i.status, I_TON[i.status])], ['Domain', i.haupthost ? esc(i.haupthost) + ' ' + badge((i.hosts.find(function (h) { return h.haupt; }) || {}).pruefung && i.hosts.find(function (h) { return h.haupt; }).pruefung.ok ? 'geprüft' : 'nicht geprüft', (i.hosts.find(function (h) { return h.haupt; }) || {}).pruefung && i.hosts.find(function (h) { return h.haupt; }).pruefung.ok ? 'ok' : 'warn') : 'noch keine'],
      ['Gestaltung', i.marke && i.marke.v ? 'Fassung ' + esc(i.marke.v) + (i.marke.veroeffentlicht ? ' vom ' + datum(i.marke.veroeffentlicht) : '') : 'noch nicht veröffentlicht'], ['Vorschau', v.link ? '<input class="z-kopie" id="z-vlink" readonly value="' + esc(v.link) + '"> ' + knopf('Kopieren', 'kopieren', 'z-vlink') + '<small>Fassung ' + esc(v.version) + ', gesendet ' + wann(v.gesendet) + ', gilt bis ' + datum(v.bis) + '</small>' : 'noch nicht gesendet'],
      ['Freigabe', v.freigabe ? 'Fassung ' + esc(v.freigabe.version) + ' am ' + wann(v.freigabe.zeit) + (v.freigabe.version !== v.version ? ' ' + badge('ältere Fassung', 'warn') : ' ' + badge('freigegeben', 'ok')) : v.aenderung ? badge('Änderung gewünscht', 'warn') + ' ' + esc(v.aenderung.text || '') : '–']]) : '<p class="z-neben">Noch keine Instanz. Sie entsteht mit „Instanz anlegen“ und übernimmt Paket, Name, Empfänger, Zugänge, Impressumsangaben und die Wünsche zur Gestaltung.</p>';
    var abo = kv([['Einrichtung', za.betrag_cent ? euro(za.betrag_cent / 100) + ' brutto · ' + esc(za.status) + (za.zeit ? ' am ' + datum(za.zeit) : '') + (za.erstattet_cent ? ' · erstattet ' + euro(za.erstattet_cent / 100) : '') : esc(za.status || 'offen')], ['Zahlungsmittel', za.zahlungsmittel ? badge('hinterlegt', 'ok') : badge('keins')], za.link ? ['Zahlung bei Stripe', aussen(za.link, 'Öffnen')] : null,
      ['Abo', ab.laeuft ? esc(paketName(ab.paket)) + ' · ' + euro(ab.monat) + ' netto im Monat' + (ab.link ? ' · ' + aussen(ab.link, 'Stripe') : '') : 'startet beim Live-Schalten'], ab.seit ? ['Seit', datum(ab.seit) + (ab.bis ? ' · bezahlt bis ' + datum(ab.bis) : '')] : null, ab.kulanz_bis ? ['Kulanz bis', datum(ab.kulanz_bis)] : null, ab.kuendigt || ab.ende ? ['Endet', datum(ab.ende)] : null, ab.offeneRechnung ? ['Offene Rechnung', aussen(ab.offeneRechnung, 'Öffnen')] : null]);
    var aktivAbo = ab.laeuft && d.abo_status !== 'beendet', aboKnoepfe = [aktivAbo ? knopf('Kulanz verlängern', 'dlg', 'b-kulanz') : '', aktivAbo && !ab.kuendigt ? knopf('Zum Periodenende kündigen', 'dlg', 'b-kuendigen') : '', aktivAbo && ab.kuendigt ? knopf('Kündigung zurücknehmen', 'b-abo', 'zuruecknehmen') : '',
      d.status === 'pausiert' && !aktivAbo ? knopf('Abo neu starten', 'b-abo', 'neu') : '', ['beendet', 'storniert'].indexOf(d.status) < 0 ? knopf('Paket wechseln', 'dlg', 'b-paket') : '',
      ['bezahlt', 'erstattet'].indexOf(za.status) >= 0 && za.betrag_cent > (za.erstattet_cent || 0) ? knopf('Erstatten', 'dlg', 'b-erstatten') : '', aktivAbo ? knopf('Abo sofort beenden', 'dlg', 'b-beenden', null, 'danger') : ''].filter(Boolean).join('');
    var nachrichten = (d.nachrichten || []).map(function (n) { var r = n.rueckruf; return '<li><span class="badge' + (n.von === 'partner' && !n.gelesen ? ' warn' : n.von === 'inhaber' ? ' acc' : '') + '">' + esc(n.von === 'partner' ? ({ rueckruf: 'Rückruf', freigabe: 'Freigabe', aenderung: 'Änderung', frage: 'Frage' }[n.art] || 'Partner') : n.von === 'inhaber' ? 'Du' : 'System') + '</span><span class="z-liste-t">' + esc(n.text) + (r ? '<br><span class="z-neben">' + esc(String(r.tag || '').split('-').reverse().join('.') + ', ' + String(r.fenster || '').replace('-', '–') + ' Uhr, ' + (r.tel || '') + (r.erledigt ? ' · erledigt ' + (r.notiz || '') : '')) + '</span>' : '') + '</span><span class="z-neben">' + vor(n.zeit) + '</span></li>'; }).join('');
    var verlauf = (d.verlauf || []).map(function (x) { return '<li><span class="badge' + (x.art === 'hinweis' ? ' bad' : x.status ? ' acc' : '') + '">' + esc(x.art === 'hinweis' ? 'Hinweis' : x.status ? bTitel(x.status) : ({ partner: 'Partner', inhaber: 'Du', stripe: 'Stripe', system: 'System' }[x.von] || x.von || '–')) + '</span><span class="z-liste-t">' + esc(x.text || '') + (x.intern ? ' <small>intern</small>' : '') + '</span><span class="z-neben">' + wann(x.zeit) + '</span></li>'; }).join('');
    var statusMoeglich = (IR() ? IR().bestellung.UEBERGAENGE : []).filter(function (u) { return u.von === d.status && u.nach !== 'live' && u.wer.indexOf('inhaber') >= 0; });
    return zurueck + kopf(p.firma || d.nr, titel) + leiste(d.status) + hauptknopf(d.schritt, d.id, i ? i.id : '') + (d.ampel && ['domain', 'freigabe', 'einrichtung'].indexOf(d.status) >= 0 ? ampelKarte(d.ampel) : '') +
      '<div class="z-raster2"><section class="z-karte"><h2 class="z-h2">Unternehmen</h2>' + unternehmen + '</section><section class="z-karte"><h2 class="z-h2">Wünsche</h2>' + wuensche + (dateien ? '<ul class="z-liste">' + dateien + '</ul>' : '') + domainFreiForm(d, k) + '</section></div>' +
      '<div class="z-raster2"><section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Instanz</h2>' + (i ? '<a class="z-a" href="#instanz/' + esc(i.id) + '">Öffnen</a>' : '') + '</div>' + instanz + '</section>' +
      '<section class="z-karte"><h2 class="z-h2">Zahlung und Abo</h2>' + abo + (aboKnoepfe ? '<div class="z-aktionen">' + aboKnoepfe + '</div>' : '') + '</section></div>' +
      '<section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Nachrichten</h2>' + (d.ungelesen ? badge(d.ungelesen + ' neu', 'warn') : '') + '</div>' + (nachrichten ? '<ul class="z-liste">' + nachrichten + '</ul>' : '<p class="z-neben">Noch keine Nachricht.</p>') +
      '<form class="z-form" data-form="b-nachricht"><div class="f"><label for="z-bnachricht">Nachricht an ' + esc(p.firma || 'den Partner') + ' (geht auch per E-Mail)</label><textarea id="z-bnachricht" name="text" rows="3" maxlength="2000" required></textarea></div><button class="btn soft small" type="submit">Senden</button></form></section>' +
      '<div class="z-raster2"><section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Verlauf</h2>' + (statusMoeglich.length ? knopf('Status ändern …', 'dlg', 'b-status') : '') + '</div>' + (verlauf ? '<ul class="z-liste">' + verlauf + '</ul>' : '<p class="z-neben">Noch nichts.</p>') + '</section>' +
      '<section class="z-karte"><h2 class="z-h2">Interne Notiz</h2><form class="z-form" data-form="b-notiz"><div class="f"><label for="z-bnotiz">Nur für dich</label><textarea id="z-bnotiz" name="text" rows="4" maxlength="4000">' + esc(d.notiz || '') + '</textarea></div><button class="btn soft small" type="submit">Notiz speichern</button></form></section></div>';
  }

  /* ---------- Instanzen ---------- */
  function seiteInstanzen() {
    var d = S.daten.instanzen; if (!d) return kopf('Instanzen') + (S.fehler ? fehlerKarte() : ladeHinweis());
    if (!d.tabelle) return kopf('Instanzen') + '<div class="z-hinweis warn"><span>Die Tabellen der Instanzen fehlen noch: <code>supabase/schema.sql</code> erneut im SQL-Editor von Supabase ausführen.</span></div>';
    var zeilen = d.instanzen.map(function (i) {
      var kz = i.kennzahlen || {};
      return '<tr data-href="#instanz/' + esc(i.id) + '"><td data-k="Instanz"><span><a class="z-zeile" href="#instanz/' + esc(i.id) + '"><b>' + esc(i.name) + '</b><small>' + esc(i.slug) + (i.demo ? ' · Demo' : '') + '</small></a></span></td><td data-k="Paket"><span>' + esc(paketName(i.paket)) + '</span></td>' +
        '<td data-k="Stand"><span>' + badge(I_TITEL[i.status] || i.status, I_TON[i.status]) + '</span></td><td data-k="Domain"><span>' + (i.haupthost ? esc(i.haupthost) + ' ' + badge(i.domainOk ? 'ok' : 'prüfen', i.domainOk ? 'ok' : 'warn') : '–') + '</span></td>' +
        '<td data-k="Bestellung"><span>' + (i.bestellung ? '<a class="z-a" href="#bestellung/' + esc(i.bestellung.id) + '">' + esc(i.bestellung.nr) + '</a>' : (i.demo ? 'Demo' : '–')) + '</span></td><td data-k="Anfragen (30 Tage)" class="num"><span>' + zahl(kz.anfrage) + '</span></td><td data-k="Aufrufe (30 Tage)" class="num"><span>' + zahl(kz.aufruf) + '</span></td></tr>';
    }).join('');
    return kopf('Instanzen', nW(d.instanzen.length, 'Konfigurator', 'Konfiguratoren') + ' auf eigener Domain' + (d.cloudflare ? ' · Cloudflare verbunden' : ' · Domains von Hand (ohne CF_API_TOKEN)'), knopf('Demo anlegen', 'dlg', 'i-neu')) +
      (d.instanzen.length ? '<div class="z-karte z-tabkarte"><table class="z-tab"><thead><tr><th>Instanz</th><th>Paket</th><th>Stand</th><th>Domain</th><th>Bestellung</th><th class="num">Anfragen</th><th class="num">Aufrufe</th></tr></thead><tbody>' + zeilen + '</tbody></table><p class="z-neben">Anfragen und Aufrufe der letzten 30 Tage.</p></div>' : leer('Noch keine Instanz.', 'Instanzen entstehen aus bezahlten Bestellungen („Instanz anlegen“) oder als Demo für die Verkaufsseite.'));
  }
  var REITER = [['start', 'Übersicht'], ['domain', 'Domain'], ['gestaltung', 'Gestaltung'], ['recht', 'Recht und Empfänger'], ['betrieb', 'Betrieb']];
  function seiteInstanz() {
    var d = S.daten['instanz:' + S.id], zurueck = '<a class="z-a z-zurueck" href="#instanzen">← Alle Instanzen</a>';
    if (!d) return zurueck + (S.fehler ? fehlerKarte() : ladeHinweis());
    var r = REITER.some(function (x) { return x[0] === S.reiter; }) ? S.reiter : 'start';
    var titel = badge(paketName(d.paket), 'acc') + ' ' + badge(I_TITEL[d.status] || d.status, I_TON[d.status]) + (d.demo ? ' ' + badge('Demo') : '') + ' <span class="z-neben">· ' + esc(d.slug) + (d.bestellung ? ' · <a class="z-a" href="#bestellung/' + esc(d.bestellung.id) + '">' + esc(d.bestellung.nr) + '</a>' : '') + '</span>';
    var reiter = '<nav class="z-reiter" aria-label="Bereiche der Instanz">' + REITER.map(function (x) { return '<a href="#instanz/' + esc(d.id) + '/' + x[0] + '"' + (x[0] === r ? ' aria-current="page"' : '') + '>' + x[1] + '</a>'; }).join('') + '</nav>';
    var inhalt = { start: instanzStart, domain: instanzDomain, gestaltung: instanzGestaltung, recht: instanzRecht, betrieb: instanzBetrieb }[r](d);
    return zurueck + kopf(d.name || d.slug, titel, d.url ? '<a class="btn soft small" href="' + esc(d.url) + '" target="_blank" rel="noopener noreferrer">Öffnen</a>' : '') + reiter + inhalt;
  }
  function kennzahlKarten(kz) {
    if (!kz) return '';
    return '<div class="z-stats">' + stat('Aufrufe', zahl(kz.aufruf), 'Startseite, letzte 30 Tage') + stat('Planungen begonnen', zahl(kz.start), 'letzte 30 Tage') + stat('Anfragen', zahl(kz.anfrage), 'letzte 30 Tage', 'ok') + stat('KI-Auswertungen', zahl(kz.ki), 'letzte 30 Tage') + stat('Fotos', zahl(kz.foto), 'letzte 30 Tage') + '</div>';
  }
  function instanzStart(d) {
    var h = d.hosts.find(function (x) { return x.haupt; });
    var ohne = !d.bestellung && d.status === 'einrichtung' ? '<section class="z-karte z-schritt"><p class="eyebrow">Nächster Schritt</p><div class="z-aktionen"><button class="btn primary" type="button" data-act="i-live">Live schalten</button></div><p class="z-neben">Instanz ohne Bestellung (Demo): kein Abo, Anfragen gehen an MAIL_KONTAKT und verschwinden nach einem Tag.</p></section>' : '';
    return (d.schritt ? hauptknopf(d.schritt, d.bestellung.id, d.id) : ohne) + (d.status === 'einrichtung' ? ampelKarte(d.ampel) : '') +
      (d.pause_bis && d.status === 'pausiert' ? '<div class="z-hinweis bad"><span>Pausiert seit ' + datum(d.pause_seit) + ', längstens bis ' + datum(d.pause_bis) + '. Danach endet der Vertrag.</span></div>' : '') +
      kennzahlKarten(d.kennzahlen) +
      '<section class="z-karte"><h2 class="z-h2">Steckbrief</h2>' + kv([['Paket', esc(paketName(d.paket))], ['Stand', badge(I_TITEL[d.status] || d.status, I_TON[d.status])], ['Domain', h ? esc(h.host) + ' ' + badge(h.pruefung && h.pruefung.ok ? 'geprüft' : 'nicht geprüft', h.pruefung && h.pruefung.ok ? 'ok' : 'warn') : 'noch keine'], ['Gestaltung', d.marke && d.marke.v ? 'Fassung ' + esc(d.marke.v) : 'noch nicht veröffentlicht'],
        ['Anfragen an', d.eingang.mails.map(function (x) { return esc(x.mail) + (x.bestaetigt ? '' : ' (unbestätigt)'); }).join(', ') || '–'], d.m.dashboard ? ['Dashboard-Zugänge', String(d.zugang.length) + ' von ' + d.m.zugaenge] : null, ['Suchmaschinen', d.m.indexierung === 'start' ? (d.indexierung ? 'Startseite freigegeben' : 'gesperrt (Schalter unter Betrieb)') : 'nein (Paket)'], ['Angelegt', wann(d.created_at)]]) + '</section>';
  }
  function instanzDomain(d) {
    var cf = S.cf[d.id], wunsch = d.bestellung ? d.bestellung.domains : [];
    var hosts = d.hosts.map(function (h) {
      var p = h.pruefung || {}, reg = h.registrar || {}, data = ' data-h="' + esc(h.host) + '"';
      return '<section class="z-karte z-host"><div class="z-karte-kopf"><h2 class="z-h2">' + esc(h.host) + '</h2>' + (h.haupt ? badge('Hauptdomain', 'acc') : badge('leitet weiter')) + ' ' + (p.zeit ? badge(p.ok ? 'geprüft' : 'nicht erreichbar', p.ok ? 'ok' : 'bad') : badge('nicht geprüft', 'warn')) + '</div>' +
        kv([['Prüfung', p.zeit ? wann(p.zeit) + (p.manuell ? ' · im Browser bestätigt' : '') : 'noch nicht'], ['Antwort der Instanz', p.ping ? (p.ping.ok ? badge('ok', 'ok') : esc(p.ping.fehler || 'fehlt')) : '–'], ['DNS', p.dns ? (p.dns.lokal ? 'lokal (Testserver)' : p.dns.ok ? 'ok' + (p.dnsWww && !p.dnsWww.ok ? ', www fehlt' : '') : esc(p.dns.fehler || 'fehlt')) : '–'], p.api ? ['Cloudflare', p.api.ok ? badge('verbunden, Zertifikat aktiv', 'ok') : esc(p.api.fehler || 'unvollständig')] : null,
          ['Registrar', reg.anbieter ? esc(reg.anbieter === 'cloudflare' ? 'Cloudflare' : reg.anbieter) + (reg.ablauf ? ' · läuft bis ' + datum(reg.ablauf) : '') + (reg.anbieter === 'cloudflare' ? ' · Auto-Verlängerung ' + (reg.autoRenew ? 'an' : 'AUS') : '') + (reg.geloest ? ' · gelöst am ' + datum(reg.geloest) : '') : '–']]) +
        ((p.fehler || []).length && !p.ok ? '<ul class="z-punkte">' + p.fehler.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="z-aktionen">' + knopf('Prüfen', 'i-pruefen', null, data) + (d.cloudflare ? knopf('Mit Konfigurator verbinden', 'i-verbinden', null, data) : '') + (h.haupt ? '' : knopf('Zur Hauptdomain machen', 'i-haupt', null, data)) +
        '<a class="btn soft small" href="' + esc(h.url) + '" target="_blank" rel="noopener noreferrer">Öffnen</a>' + (!p.ok && p.zeit && !p.manuell ? knopf('Im Browser geprüft', 'i-manuell', null, data) : '') + ((reg.domain_ids && (reg.domain_ids.apex || reg.domain_ids.www)) && !reg.geloest ? knopf('Lösen', 'i-loesen', null, data, 'danger') : '') + knopf('Entfernen', 'i-entfernen', null, data, 'danger') + '</div>' +
        (h.haupt ? '<form class="z-form z-zeile2" data-form="i-registrar" data-h="' + esc(h.host) + '"><div class="f"><label for="z-reg-anb">Registriert bei</label><input id="z-reg-anb" name="anbieter" value="' + esc(reg.anbieter && reg.anbieter !== 'cloudflare' ? reg.anbieter : '') + '" placeholder="z. B. INWX"></div><div class="f"><label for="z-reg-ab">Läuft ab am</label><input id="z-reg-ab" name="ablauf" type="date" value="' + esc(String(reg.ablauf || '').slice(0, 10)) + '"></div><button class="btn soft small" type="submit">Merken</button></form><p class="z-neben">Nur für Domains, die nicht bei Cloudflare registriert sind: Die Zentrale warnt ' + ((IR() && IR().FRISTEN.domainWarnTage) || 30) + ' Tage vor dem Ablauf.</p>' : '') + '</section>';
    }).join('');
    var ergebnis = cf ? '<section class="z-karte"><h2 class="z-h2">Cloudflare</h2><ul class="z-punkte">' + (cf.schritte || []).map(function (s) { return '<li>' + (s.ok ? '' : '<b>Offen:</b> ') + esc(s.text) + '</li>'; }).join('') + '</ul>' +
      (cf.zone && cf.zone.status !== 'active' && cf.zone.nameserver && cf.zone.nameserver.length ? '<p class="z-text">Beim Domain-Anbieter eintragen: <code>' + cf.zone.nameserver.map(esc).join('</code> und <code>') + '</code></p>' : '') +
      '<div class="z-aktionen">' + (cf.schritt === 'zone' ? knopf('Zone anlegen', 'i-zone', null, ' data-h="' + esc(cf.host) + '"') : '') + (cf.schritt === 'konflikte' ? knopf('Einträge löschen und verbinden', 'i-verbinden', null, ' data-h="' + esc(cf.host) + '" data-loeschen="1"', 'danger') : '') + (cf.schritt === 'nameserver' ? knopf('Noch einmal versuchen', 'i-verbinden', null, ' data-h="' + esc(cf.host) + '"') : '') + '</div></section>' : '';
    var neu = '<section class="z-karte"><h2 class="z-h2">Domain eintragen</h2><form class="z-form z-zeile2" data-form="i-host"><div class="f"><label for="z-host">Domain (ohne www.)</label><input id="z-host" name="host" autocomplete="off" placeholder="ihr-name-fenster.de" required></div><button class="btn soft small" type="submit">Eintragen</button></form>' +
      (wunsch.length ? '<div class="chips" role="group" aria-label="Wunsch-Domains aus der Bestellung">' + wunsch.map(function (x) { return '<button type="button" class="chip" data-act="i-wunsch" data-v="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div><p class="z-neben">Wunsch-Domains aus der Bestellung, erste zuerst. Erst kaufen, dann eintragen.</p>' : '') +
      '<p class="z-neben">Die erste Domain wird Hauptdomain; weitere leiten auf sie um. www. leitet die Instanz selbst um.</p></section>';
    var anleitung = '<section class="z-karte"><h2 class="z-h2">' + (d.cloudflare ? 'Von Hand (falls nötig)' : 'Klick-Anleitung') + '</h2>' + (d.cloudflare ? '' : '<p class="z-neben">Ohne CF_API_TOKEN und CF_ACCOUNT_ID verbindet die Zentrale nicht selbst. So geht es im Dashboard von Cloudflare; danach hier „Prüfen“.</p>') + '<ol class="z-schritte">' + (d.anleitung || []).map(function (s) { return '<li><b>' + esc(s.titel) + ':</b> ' + esc(s.text) + '</li>'; }).join('') + '</ol></section>';
    return (d.hosts.length ? hosts : '') + ergebnis + neu + anleitung;
  }

  /* ---------- Gestaltung: Entwurf, Bilder, Vorschau, Veröffentlichen ---------- */
  function bildUrl(d, name) { return (S.bild[d.id] || {})[name] || ''; }
  async function bilderLaden(d) {
    var e = d.entwurf || d.marke || {}, b = e.bilder || {}, v = d.entwurf ? '' : (d.marke && d.marke.v ? '?v=' + d.marke.v : ''), namen = [b.logo].concat(b.start || []).filter(Boolean), cache = S.bild[d.id] = S.bild[d.id] || {}, neu = false;
    for (var j = 0; j < namen.length; j++) {
      var n = namen[j], schl = n + v; if (cache[n] && cache['_' + n] === schl) continue;
      try { var r = await api('/api/zentrale/instanzen/' + encodeURIComponent(d.id) + '/bild/' + encodeURIComponent(n) + v, null, true); var blob = await r.blob(); if (cache[n]) URL.revokeObjectURL(cache[n]); cache[n] = URL.createObjectURL(blob); cache['_' + n] = schl; neu = true; } catch (x) { /* fehlt */ }
    }
    if (neu && S.seite === 'instanz' && S.id === d.id) render();
  }
  /* Vorschau im Telefonrahmen: dieselbe Startseite wie in der App der Instanz (app.js instOpt, einladung.js o.instanz): Website-Besucher,
     Kennzeichnung, Startansicht und Fotos nach dem Paket, ohne eigene Fotos das Startbild von eeziframes; Bilder des Entwurfs als blob: */
  function vorschau(d) {
    var e = d.entwurf || d.marke || {}, m = d.m || {}, st = e.start || {}, P = d.profil || {}, ein = P.einladung || {}, bi = e.bilder || {};
    var logo = m.logo && bi.logo ? bildUrl(d, bi.logo) : '', bilder = m.fotos ? (bi.start || []).slice(0, m.fotos).map(function (n) { return bildUrl(d, n); }).filter(Boolean) : [];
    var farbe = m.farbe && /^#[0-9a-f]{6}$/i.test(e.farbe || '') ? e.farbe.toLowerCase() : '', akz = farbe && IR() ? IR().akzent(farbe) : '';
    var p = { logo: logo, grund: 'hell', col: farbe, gruss: { sie: m.startansicht ? ein.begruessung || '' : '', du: m.startansicht ? ein.begruessungDu || '' : '' }, ap: ein.ansprechpartner || P.ap || '', foto: ein.foto || '', tel: ein.telefonZeigen === false ? '' : (ein.telefon || P.tel || ''), mail: ein.mailZeigen ? (ein.mail || P.mail || '') : '', web: ein.web || '', ort: ein.ort || '', tiefe: ein.tiefe || '', std: ein.standard || '' };
    var inst = { kz: m.kennzeichnung, website: true, kopie: !!m.kopieKunde, start: m.startansicht ? { kicker: st.kicker || '', ueberschrift: st.ueberschrift || '', text: st.text || '' } : {}, bilder: bilder, standardBild: true };
    var html = ''; try { html = window.Einladung ? window.Einladung.html({ name: e.name || d.name, du: ein.anrede === 'du', p: p, vorschau: true, instanz: inst }) : ''; } catch (x) { html = ''; }
    return '<div class="ein-telefon z-telefon" style="' + (akz ? '--accent:' + esc(akz) + ';' : '') + '"><div class="ein-tel-kopf" aria-hidden="true">' + esc(d.haupthost || 'Vorschau') + '</div><div class="ein-tel-inhalt" tabindex="0" role="region" aria-label="Vorschau der Startseite">' + html + '</div></div>';
  }
  function bildSlot(d, name, titel) {
    var e = d.entwurf || d.marke || {}, bi = e.bilder || {}, datei = name === 'logo' ? bi.logo : (bi.start || []).filter(function (n) { return n.replace(/\.[a-z]+$/, '') === name; })[0], u = datei ? bildUrl(d, datei) : '';
    return '<div class="z-slot"><div class="z-slot-bild' + (name === 'logo' ? ' logo' : '') + '">' + (u ? '<img src="' + esc(u) + '" alt="' + esc(titel) + '">' : datei ? '<span class="z-neben">wird geladen</span>' : '<span class="z-neben">leer</span>') + '</div><div class="z-slot-k"><b>' + esc(titel) + '</b>' +
      '<label class="btn soft small z-datei">Datei wählen<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" data-in="i-bild" data-v="' + esc(name) + '"></label>' + (datei ? knopf('Entfernen', 'i-bild-weg', name) : '') + '</div></div>';
  }
  function instanzGestaltung(d) {
    var m = d.m || {}, e = d.entwurf || d.marke || {}, st = e.start || {}, P = d.profil || {}, ein = P.einladung || {}, mk = d.marke || {}, eigen = m.gestaltung === 'eigen';
    if (eigen && !S.bild[d.id + ':geladen']) { S.bild[d.id + ':geladen'] = true; setTimeout(function () { bilderLaden(d); }, 0); }
    var g = d.bestellung ? d.bestellung.gestaltung || {} : {}, dateien = d.bestellung ? (d.bestellung.dateien || []).filter(function (x) { return ['logo', 'foto', 'ap', 'druck'].indexOf(x.art) >= 0; }) : [];
    var gleich = JSON.stringify([e.name || '', e.titel || '', e.beschreibung || '', (e.farbe || '').toLowerCase(), e.start || {}, e.bilder || {}]) === JSON.stringify([mk.name || '', mk.titel || '', mk.beschreibung || '', (mk.farbe || '').toLowerCase(), mk.start || {}, mk.bilder || {}]);
    var stand = '<p class="z-text">' + (mk.v ? 'Veröffentlicht: Fassung ' + esc(mk.v) + (mk.veroeffentlicht ? ' vom ' + wann(mk.veroeffentlicht) : '') : 'Noch nicht veröffentlicht.') + (d.entwurf && !gleich ? ' ' + badge('Entwurf hat Änderungen', 'warn') : '') + '</p>';
    var fk = eigen && e.farbe && IR() ? IR().farbe(e.farbe) : null;
    var formular = '<form class="z-form" data-form="i-entwurf"><div class="f"><label for="z-g-name">Name im Konfigurator</label><input id="z-g-name" name="name" maxlength="80" value="' + esc(e.name || d.name) + '" required></div>' +
      (eigen ? '<div class="f"><label for="z-g-titel">Titel der Seite (Browser, Suchmaschinen)</label><input id="z-g-titel" name="titel" maxlength="80" value="' + esc(e.titel || '') + '" placeholder="Fenster planen und anfragen · ' + esc(e.name || d.name) + '"></div>' +
        '<div class="f"><label for="z-g-besch">Beschreibung (Suchmaschinen)</label><input id="z-g-besch" name="beschreibung" maxlength="300" value="' + esc(e.beschreibung || '') + '"></div>' +
        '<div class="f"><label for="z-g-farbe">Firmenfarbe (#rrggbb)</label><div class="z-farbe"><input id="z-g-farbe" name="farbe" maxlength="7" value="' + esc(e.farbe || '') + '" placeholder="#2f6f4f" pattern="#[0-9a-fA-F]{6}"><input type="color" aria-label="Farbe wählen" data-in="farbwahl" value="' + esc(/^#[0-9a-f]{6}$/i.test(e.farbe || '') ? e.farbe : '#8fd694') + '"></div>' +
        (fk ? '<small>' + (fk.ok ? 'Kontrast ' + String(fk.kontrast).replace('.', ',') + ':1 auf dunklem Grund, passt.' : esc(fk.fehler) + ' Angezeigt wird ' + esc(IR().akzent(e.farbe)) + '.') + '</small>' : '') + ((g.farben || []).length ? '<div class="chips">' + g.farben.map(function (c) { return '<button type="button" class="chip" data-act="i-farbe" data-v="' + esc(c) + '"><span class="z-tupfen" style="--c:' + esc(c) + '"></span>' + esc(c) + '</button>'; }).join('') + '</div>' : '') + '</div>' +
        (m.startansicht ? '<div class="f"><label for="z-g-kicker">Kicker der Startseite</label><input id="z-g-kicker" name="kicker" maxlength="60" value="' + esc(st.kicker || '') + '"></div><div class="f"><label for="z-g-ueber">Überschrift</label><input id="z-g-ueber" name="ueberschrift" maxlength="120" value="' + esc(st.ueberschrift || '') + '"></div><div class="f"><label for="z-g-text">Text</label><textarea id="z-g-text" name="text" rows="3" maxlength="400">' + esc(st.text || '') + '</textarea></div>' : '') : '<p class="z-neben">Essential: eeziframes-Design, der Name steht als Text. Logo, Farbe, Fotos und eigene Startseite gibt es ab Plus.</p>') +
      '<button class="btn soft small" type="submit">Entwurf speichern</button></form>';
    var bilder = eigen ? '<section class="z-karte"><h2 class="z-h2">Bilder</h2><div class="z-slots">' + bildSlot(d, 'logo', 'Logo') + Array.from({ length: Number(m.fotos) || 0 }, function (x, j) { return bildSlot(d, 'start-' + (j + 1), 'Foto ' + (j + 1)); }).join('') + '</div><p class="z-neben">Das Logo wird zu PNG (bis 600 px) samt App-Symbolen und Vorschaubild; Fotos werden 16:9 auf 1600 px zugeschnitten. SVG wird vorher zu einem Pixelbild.</p></section>' : '';
    var ausBestellung = eigen && dateien.length ? '<section class="z-karte"><h2 class="z-h2">Aus der Bestellung übernehmen</h2><ul class="z-liste">' + dateien.map(function (x) { return '<li><span class="badge">' + esc({ logo: 'Logo', foto: 'Foto', ap: 'Ansprechpartner', druck: 'Druckvorlage' }[x.art]) + '</span><span class="z-liste-t">' + esc(x.name) + '</span>' + (x.typ === 'application/pdf' ? knopf('Laden', 'datei', null, ' data-b="' + esc(d.bestellung.id) + '" data-d="' + esc(x.id) + '" data-n="' + esc(x.name) + '"') : knopf('Übernehmen', 'i-uebernehmen', null, ' data-d="' + esc(x.id) + '" data-art="' + esc(x.art) + '" data-typ="' + esc(x.typ) + '"')) + '</li>'; }).join('') + '</ul>' + (g.titel || g.begruessung || g.notiz ? kv([g.titel ? ['Titel', esc(g.titel)] : null, g.begruessung ? ['Begrüßung', esc(g.begruessung)] : null, g.notiz ? ['Notiz', esc(g.notiz)] : null]) : '') + '</section>' : '';
    var profil = '<section class="z-karte"><h2 class="z-h2">Ansprechpartner und Begrüßung</h2><form class="z-form" data-form="i-profil"><div class="f"><label for="z-p-ap">Ansprechpartner</label><input id="z-p-ap" name="ansprechpartner" maxlength="80" value="' + esc(ein.ansprechpartner || P.ap || '') + '"></div><div class="f"><label for="z-p-tel">Telefon (für Kunden)</label><input id="z-p-tel" name="telefon" maxlength="40" value="' + esc(ein.telefon || P.tel || '') + '"></div><div class="f"><label for="z-p-mail">E-Mail (für Kunden)</label><input id="z-p-mail" name="mail" type="email" maxlength="120" value="' + esc(ein.mail || P.mail || '') + '"></div>' +
      (m.startansicht ? '<div class="f"><label for="z-p-gruss">Begrüßung</label><textarea id="z-p-gruss" name="begruessung" rows="3" maxlength="400">' + esc(ein.begruessung || '') + '</textarea></div>' : '') + '<button class="btn soft small" type="submit">Speichern</button></form>' + (ein.foto ? '<p class="z-neben">Foto des Ansprechpartners ist hinterlegt.</p>' : '') + '</section>';
    return '<div class="z-gestaltung"><div class="z-gestaltung-l"><section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Gestaltung</h2><button class="btn primary small" type="button" data-act="i-veroeffentlichen">Veröffentlichen</button></div>' + stand + formular + '</section>' + bilder + ausBestellung + profil + '</div><div class="z-gestaltung-r"><p class="eyebrow">Vorschau des Entwurfs</p>' + vorschau(d) + '</div></div>';
  }
  /* Bilder im Browser: Datei → Bild → Leinwand → PNG/JPEG → Server */
  function ladeBlob(blob) { return new Promise(function (ja, nein) { var u = URL.createObjectURL(blob), i = new Image(); i.decoding = 'async'; i.onload = function () { ja(i); setTimeout(function () { URL.revokeObjectURL(u); }, 0); }; i.onerror = function () { URL.revokeObjectURL(u); nein(new Error('Diese Datei lässt sich nicht als Bild öffnen.')); }; i.src = u; }); }
  async function bildAus(blob, typ) {
    if (typ === 'image/svg+xml' || /svg/.test(blob.type || '')) {
      var text = await blob.text(), doc = new DOMParser().parseFromString(text, 'image/svg+xml'), s = doc.documentElement;
      if (!s || s.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) throw new Error('Dieses SVG lässt sich nicht lesen. Bitte als PNG.');
      var vb = String(s.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number), w0 = parseFloat(s.getAttribute('width')), h0 = parseFloat(s.getAttribute('height'));
      var w = vb.length === 4 && vb[2] > 0 ? vb[2] : w0 || 300, h = vb.length === 4 && vb[3] > 0 ? vb[3] : h0 || 150, f = 1200 / Math.max(w, h);
      s.setAttribute('width', String(Math.round(w * f))); s.setAttribute('height', String(Math.round(h * f))); if (!s.getAttribute('viewBox') && w0 && h0) s.setAttribute('viewBox', '0 0 ' + w0 + ' ' + h0);
      blob = new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
    }
    return ladeBlob(blob);
  }
  var leinwand = function (w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  var alsBlob = function (c, typ, q) { return new Promise(function (ja, nein) { c.toBlob(function (b) { if (b) ja(b); else nein(new Error('Das Bild ließ sich nicht erzeugen.')); }, typ, q); }); };
  var alsB64 = function (b) { return new Promise(function (ja, nein) { var r = new FileReader(); r.onload = function () { ja(String(r.result).replace(/^data:[^,]*,/, '')); }; r.onerror = function () { nein(new Error('Datei nicht lesbar.')); }; r.readAsDataURL(b); }); };
  /* sichtbarer Bereich (durchsichtige Ränder weg) */
  function sichtbar(img) {
    var W = img.naturalWidth || img.width, H = img.naturalHeight || img.height, a = Math.min(1, 1200 / Math.max(W, H)), c = leinwand(W * a, H * a), x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0, c.width, c.height);
    var px = x.getImageData(0, 0, c.width, c.height).data, x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (var y = 0; y < c.height; y++) for (var xx = 0; xx < c.width; xx++) if (px[(y * c.width + xx) * 4 + 3] > 12) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) throw new Error('Das Bild ist ganz durchsichtig.');
    return { sx: x0 / a, sy: y0 / a, sw: (x1 - x0 + 1) / a, sh: (y1 - y0 + 1) / a };
  }
  async function logoBilder(img, svg) {
    var r = sichtbar(img), s = Math.min(600 / r.sw, 600 / r.sh, svg ? Infinity : 1), out = [];
    var c = leinwand(r.sw * s, r.sh * s); c.getContext('2d').drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, c.width, c.height); out.push(['logo.png', await alsBlob(c, 'image/png')]);
    var feld = function (w, h, rand, grund) { var k = leinwand(w, h), x = k.getContext('2d'), f = Math.min((w - 2 * rand) / r.sw, (h - 2 * rand) / r.sh); x.fillStyle = grund; x.fillRect(0, 0, w, h); x.drawImage(img, r.sx, r.sy, r.sw, r.sh, (w - r.sw * f) / 2, (h - r.sh * f) / 2, r.sw * f, r.sh * f); return k; };
    for (var n of [32, 180, 192, 512]) out.push(['icon' + n + '.png', await alsBlob(feld(n, n, Math.round(n * 0.12), '#ffffff'), 'image/png')]);
    out.push(['og.png', await alsBlob(feld(1200, 630, 150, '#ffffff'), 'image/png')]);
    return out;
  }
  async function fotoBild(img) {
    var W = img.naturalWidth || img.width, H = img.naturalHeight || img.height, q = 16 / 9, sw = W, sh = H;
    if (W / H > q) sw = H * q; else sh = W / q;
    var w = Math.min(1600, Math.round(sw)), c = leinwand(w, w / q); c.getContext('2d').drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh, 0, 0, c.width, c.height);
    return alsBlob(c, 'image/jpeg', 0.8);
  }
  async function bildVerarbeiten(d, slot, blob, typ) {
    var iid = d.id, pfad = '/api/zentrale/instanzen/' + encodeURIComponent(iid) + '/bild', r = null;
    toast('Bild wird vorbereitet …');
    if (slot === 'ap') { var u = await window.Einladung.verkleinern(new File([blob], 'ap', { type: typ || blob.type }), 'foto'); var ein = Object.assign({}, (d.profil || {}).einladung || {}, { foto: u.url }); r = await api('/api/zentrale/instanzen/' + encodeURIComponent(iid) + '/profil', { einladung: ein }); }
    else {
      var img = await bildAus(blob, typ), liste = slot === 'logo' ? await logoBilder(img, typ === 'image/svg+xml') : [[slot + '.jpg', await fotoBild(img)]];
      for (var j = 0; j < liste.length; j++) r = await api(pfad, { name: liste[j][0], daten: await alsB64(liste[j][1]) });
      var c = S.bild[iid] || {}; liste.forEach(function (x) { delete c['_' + x[0]]; });
    }
    if (r) { uebernehmen(r); render(); if (r.instanz) bilderLaden(r.instanz); }
    toast(slot === 'logo' ? 'Logo, App-Symbole und Vorschaubild sind im Entwurf.' : slot === 'ap' ? 'Foto des Ansprechpartners gespeichert.' : 'Foto ist im Entwurf.');
  }

  /* ---------- Recht und Empfänger ---------- */
  function instanzRecht(d) {
    var r = d.recht || {}, st = d.rechtStand || { ok: false, fehlt: [] }, BL = IR() ? IR().BUNDESLAENDER : {};
    var feld = function (name, titel, wert, extra) { return '<div class="f"><label for="z-r-' + name + '">' + titel + '</label><input id="z-r-' + name + '" name="' + name + '" value="' + esc(wert || '') + '"' + (extra || '') + '></div>'; };
    var recht = '<section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Impressum</h2>' + badge(st.ok ? 'vollständig' : 'fehlt: ' + st.fehlt.join(', '), st.ok ? 'ok' : 'warn') + '</div>' + (r.quelle === 'bestellung' ? '<p class="z-neben">Aus der Bestellung übernommen. Bitte einmal prüfen und speichern; die E-Mail ist die Anmeldeadresse des Partners.</p>' : '') +
      '<form class="z-form" data-form="i-recht"><div class="z-formraster">' + feld('firma', 'Firma', r.firma) + feld('rechtsform', 'Rechtsform', r.rechtsform) + feld('vertretung', 'Vertreten durch', r.vertretung) + feld('strasse', 'Straße und Hausnummer', r.strasse) + feld('plz', 'PLZ', r.plz, ' inputmode="numeric" maxlength="5"') + feld('ort', 'Ort', r.ort) +
      '<div class="f"><label for="z-r-bundesland">Bundesland</label><select id="z-r-bundesland" name="bundesland"><option value="">–</option>' + Object.keys(BL).map(function (k) { return '<option value="' + k + '"' + (r.bundesland === k ? ' selected' : '') + '>' + esc(BL[k]) + '</option>'; }).join('') + '</select></div>' +
      feld('tel', 'Telefon', r.tel) + feld('mail', 'E-Mail', r.mail, ' type="email"') + feld('register', 'Registereintrag', r.register) + feld('ust', 'USt-IdNr.', r.ust) + feld('kammer', 'Kammer', r.kammer) + feld('beruf', 'Berufsbezeichnung', r.beruf) + '</div><button class="btn soft small" type="submit">Impressum speichern</button></form>' + (r.stand ? '<p class="z-neben">Stand ' + esc(r.stand) + '</p>' : '') + '</section>';
    var eingang = '<section class="z-karte"><h2 class="z-h2">Empfänger der Anfragen</h2><ul class="z-liste">' + d.eingang.mails.map(function (x) { return '<li>' + badge(x.bestaetigt ? 'bestätigt' : 'unbestätigt', x.bestaetigt ? 'ok' : 'warn') + '<span class="z-liste-t">' + esc(x.mail) + (x.bestaetigt ? ' <span class="z-neben">seit ' + datum(x.bestaetigt) + '</span>' : x.eingeladen ? ' <span class="z-neben">Link geschickt ' + vor(x.eingeladen) + '</span>' : '') + '</span>' + (x.bestaetigt ? '<span></span>' : knopf('Link erneut', 'i-eingang-erneut', x.mail)) + '</li>'; }).join('') + '</ul>' +
      '<form class="z-form" data-form="i-eingang"><div class="f"><label for="z-e-mails">Adressen, je Zeile eine (höchstens ' + ((IR() && IR().GRENZEN.eingangMails) || 3) + ')</label><textarea id="z-e-mails" name="mails" rows="3">' + esc(d.eingang.mails.map(function (x) { return x.mail; }).join('\n')) + '</textarea><small>Neue Adressen bekommen einen Bestätigungslink. Anfragen gehen nur an bestätigte Adressen.</small></div><button class="btn soft small" type="submit">Speichern</button></form></section>';
    var zugaenge = d.m.dashboard ? '<section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Dashboard-Zugänge</h2>' + badge(d.zugang.length + ' von ' + d.m.zugaenge) + '</div><ul class="z-liste">' + d.zugang.map(function (x) { return '<li>' + badge(x.aus ? 'aus' : x.bestaetigt ? 'bestätigt' : 'unbestätigt', x.aus ? '' : x.bestaetigt ? 'ok' : 'warn') + '<span class="z-liste-t">' + esc(x.mail) + (x.name ? ' · ' + esc(x.name) : '') + (x.zuletzt ? ' <span class="z-neben">zuletzt ' + vor(x.zuletzt) + '</span>' : '') + '</span><span class="z-aktionen">' + (x.bestaetigt ? '' : knopf('Link erneut', 'i-zugang', 'erneut', ' data-m="' + esc(x.mail) + '"')) + knopf(x.aus ? 'Einschalten' : 'Ausschalten', 'i-zugang', x.aus ? 'an' : 'aus', ' data-m="' + esc(x.mail) + '"') + knopf('Löschen', 'i-zugang', 'loeschen', ' data-m="' + esc(x.mail) + '"', 'danger') + '</span></li>'; }).join('') + '</ul>' +
      (d.zugang.length < d.m.zugaenge ? '<form class="z-form z-zeile2" data-form="i-zugang"><div class="f"><label for="z-z-mail">E-Mail</label><input id="z-z-mail" name="mail" type="email" required></div><div class="f"><label for="z-z-name">Name</label><input id="z-z-name" name="name" maxlength="80"></div><button class="btn soft small" type="submit">Zugang anlegen</button></form>' : '') + '<p class="z-neben">Anmeldung per E-Mail-Code unter /betrieb/ der Instanz; erst nach der Bestätigung per Link.</p></section>' : '';
    return recht + '<div class="z-raster2">' + eingang + (zugaenge || '<section class="z-karte"><h2 class="z-h2">Dashboard</h2><p class="z-neben">Dieses Paket hat kein Dashboard (ab Signature).</p></section>') + '</div>';
  }

  /* ---------- Betrieb ---------- */
  function instanzBetrieb(d) {
    var t = (d.ampel || {}).test || {};
    var test = '<section class="z-karte"><div class="z-karte-kopf"><h2 class="z-h2">Testanfrage</h2>' + (t.da ? badge(t.ok ? 'zugestellt' : (V_TITEL[t.status] || t.status || 'offen'), t.ok ? 'ok' : V_TON[t.status] || 'warn') : badge('noch keine', 'warn')) + '</div><p class="z-neben">Schickt eine Anfrage mit einem Beispielfenster an die bestätigten Empfänger (Betreff „[Test]“, nicht gezählt, nach einem Tag gelöscht).' + (t.ohneWebhook ? ' Ohne RESEND_WEBHOOK_SECRET zählt „gesendet“ als zugestellt.' : '') + '</p>' + knopf('Testanfrage senden', 'i-test') + '</section>';
    var zeilen = (d.versand || []).map(function (z) { return '<tr><td data-k="Anfrage"><span><b>' + esc(z.nr || z.code) + '</b><small>' + esc(ART_ANFRAGE[z.art] || z.art) + (z.runde > 1 ? ' · Runde ' + z.runde : '') + '</small></span></td><td data-k="Eingang"><span>' + wann(z.eingegangen) + '</span></td><td data-k="Versand"><span>' + badge(V_TITEL[z.status] || z.status || '–', V_TON[z.status]) + (z.versuche ? ' <small>' + z.versuche + ' Versuche</small>' : '') + (z.ohneFotos ? ' <small>ohne Fotos</small>' : '') + '</span></td><td data-k="Zugestellt"><span>' + (z.zugestellt ? wann(z.zugestellt) : '–') + '</span></td><td data-k=""><span>' + (z.eingegangen ? knopf('Erneut senden', 'i-erneut', z.code) : '') + '</span></td></tr>'; }).join('');
    var versand = '<section class="z-karte z-tabkarte"><h2 class="z-h2">Versand der Anfragen</h2><p class="z-neben">Nur Nummer und Stand: die Anfragen selbst gehören dem Betrieb.</p>' + (zeilen ? '<table class="z-tab"><thead><tr><th>Anfrage</th><th>Eingang</th><th>Versand</th><th>Zugestellt</th><th></th></tr></thead><tbody>' + zeilen + '</tbody></table>' : '<p class="z-neben">Noch keine Anfrage.</p>') + '</section>';
    var status = '<section class="z-karte"><h2 class="z-h2">Stand</h2>' + kv([['Stand', badge(I_TITEL[d.status] || d.status, I_TON[d.status])], d.pause_seit ? ['Pausiert seit', datum(d.pause_seit) + (d.pause_bis ? ', längstens bis ' + datum(d.pause_bis) : '')] : null, d.ende_am ? ['Beendet am', datum(d.ende_am) + ' (Daten werden ' + ((IR() && IR().FRISTEN.loeschenNachEndeTage) || 30) + ' Tage danach gelöscht)'] : null]) +
      '<div class="z-aktionen">' + (d.status === 'aktiv' ? knopf('Pausieren …', 'dlg', 'i-pausieren') : '') + (d.status === 'pausiert' ? knopf('Fortsetzen', 'i-fortsetzen') : '') + (d.status !== 'beendet' && (d.status !== 'einrichtung' || !d.bestellung) ? knopf('Beenden …', 'dlg', 'i-beenden', null, 'danger') : '') + (d.status === 'beendet' || d.demo ? knopf('Alle Daten jetzt löschen …', 'dlg', 'i-loeschen', null, 'danger') : '') + '</div></section>';
    var paket = '<section class="z-karte"><h2 class="z-h2">Paket</h2>' + kv([['Paket', esc(paketName(d.paket))], d.bestellung ? ['Abo', d.bestellung.abo.id ? euro(d.bestellung.abo.monat) + ' netto im Monat' : 'startet beim Live-Schalten'] : null]) + (d.status !== 'beendet' ? knopf('Paket wechseln …', 'dlg', 'i-paket') : '') + '<p class="z-neben">Merkmale folgen dem Paket sofort (Seite, App, Mails); der Preis des Abos wechselt mit.</p></section>';
    var schalter = '<section class="z-karte"><h2 class="z-h2">Schalter</h2><label class="z-schalter"><input type="checkbox" data-in="i-schalter" data-v="demo"' + (d.demo ? ' checked' : '') + '><span>Demo (Anfragen an MAIL_KONTAKT, nach einem Tag weg)</span></label>' + (d.m.indexierung === 'start' ? '<label class="z-schalter"><input type="checkbox" data-in="i-schalter" data-v="indexierung"' + (d.indexierung ? ' checked' : '') + '><span>Startseite für Suchmaschinen freigeben</span></label>' : '<p class="z-neben">Suchmaschinen: im Paket nicht vorgesehen.</p>') + '</section>';
    return kennzahlKarten(d.kennzahlen) + '<div class="z-raster2">' + test + status + '</div>' + versand + '<div class="z-raster2">' + paket + schalter + '</div>';
  }


  /* ---------- Dialoge der Konfigurator-Pakete ---------- */
  var PAKET_DIALOGE = ['rueckruf', 'b-live', 'b-status', 'b-kulanz', 'b-kuendigen', 'b-beenden', 'b-paket', 'b-erstatten', 'i-neu', 'i-pausieren', 'i-beenden', 'i-paket', 'i-loeschen', 'i-host-weg', 'i-loesen', 'code'];
  var zweiterFaktor = function () { var d = S.daten['instanz:' + S.id] || S.daten['bestellung:' + S.id] || {}; return !!d.zweiFaktor; };
  var codeFeld2 = function (immer) { return immer || zweiterFaktor() ? '<div class="f"><label for="d-code">Aktueller Code aus der Authenticator-App</label><input id="d-code" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required></div>' : ''; };
  var feldD = function (id, name, titel, extra, typ) { return '<div class="f"><label for="' + id + '">' + titel + '</label><input id="' + id + '" name="' + name + '"' + (typ ? ' type="' + typ + '"' : '') + (extra || '') + '></div>'; };
  var textD = function (id, name, titel, extra) { return '<div class="f"><label for="' + id + '">' + titel + '</label><textarea id="' + id + '" name="' + name + '" rows="3"' + (extra || '') + '></textarea></div>'; };
  var paketWahl = function (aktuell) { var P = PK(); return '<div class="f"><label for="d-paket">Neues Paket</label><select id="d-paket" name="paket">' + (P ? P.LISTE : []).filter(function (x) { return x !== aktuell; }).map(function (x) { return '<option value="' + x + '">' + esc(paketName(x)) + ' · ' + esc(P.preisText(x, 'monat')) + '</option>'; }).join('') + '</select></div><label class="z-schalter"><input type="checkbox" name="differenz" checked><span>Beim Wechsel nach oben: Differenz der Einrichtung auf die nächste Rechnung</span></label>'; };
  function paketDialog(g) {
    var b = S.daten['bestellung:' + (g.b || S.id)] || {}, i = S.daten['instanz:' + S.id] || {};
    switch (g.art) {
      case 'rueckruf': return { titel: 'Rückruf erledigt', inhalt: feldD('d-notiz', 'notiz', 'Notiz (optional)', ' maxlength="500" placeholder="z. B. Domain festgelegt"'), knopf: 'Erledigt' };
      case 'b-live': return { titel: 'Live schalten', inhalt: '<p>Die Instanz geht online, das Monatsabo startet mit dem hinterlegten Zahlungsmittel, und der Partner bekommt eine E-Mail mit dem Link für seine Website.</p>' + textD('d-vermerk', 'vermerk', g.wartet ? 'Vermerk (Pflicht ohne Freigabe im Kundenkonto, mindestens 10 Zeichen)' : 'Vermerk (optional)', ' maxlength="1000"' + (g.wartet ? ' required minlength="10" placeholder="z. B. Freigabe telefonisch am …"' : '')), knopf: 'Jetzt live schalten' };
      case 'b-status': { var R = IR(), u = (R ? R.bestellung.UEBERGAENGE : []).filter(function (x) { return x.von === b.status && x.nach !== 'live' && x.wer.indexOf('inhaber') >= 0; });
        return { titel: 'Status ändern', inhalt: '<p>Aktuell: ' + esc(bTitel(b.status)) + '. Der Partner bekommt zu jedem Wechsel eine E-Mail.</p><div class="f"><label for="d-nach">Neuer Status</label><select id="d-nach" name="nach">' + u.map(function (x) { return '<option value="' + x.nach + '">' + esc(bTitel(x.nach)) + (x.vermerk ? ' (mit Vermerk)' : '') + '</option>'; }).join('') + '</select></div>' + textD('d-text', 'text', 'Vermerk (bei Rücksprung und Storno Pflicht, mindestens 10 Zeichen)', ' maxlength="1000"') + ((b.zahlung || {}).status === 'bezahlt' ? '<label class="z-schalter"><input type="checkbox" name="erstatten"><span>Beim Stornieren die Einrichtung voll erstatten</span></label>' + codeFeld2() : ''), knopf: 'Status ändern', gefahr: true }; }
      case 'b-kulanz': return { titel: 'Kulanz verlängern', inhalt: '<p>Verschiebt das Pausieren bei offener Zahlung. Gilt ab heute bzw. ab dem bisherigen Ende der Kulanz.</p><div class="f"><label for="d-tage">Tage</label><select id="d-tage" name="tage"><option value="7">7</option><option value="14" selected>14</option><option value="30">30</option></select></div>', knopf: 'Verlängern' };
      case 'b-kuendigen': return { titel: 'Abo kündigen', inhalt: '<p>Das Abo endet zum Ende des bezahlten Zeitraums. Danach pausiert der Server die Instanz und löscht ihre Daten nach der Frist.</p>', knopf: 'Zum Periodenende kündigen', gefahr: true };
      case 'b-beenden': return { titel: 'Abo sofort beenden', inhalt: '<p>Stripe beendet das Abo jetzt; die Bestellung endet, die Instanz ist beendet. Die Daten werden nach ' + ((IR() && IR().FRISTEN.loeschenNachEndeTage) || 30) + ' Tagen gelöscht.</p>' + textD('d-text', 'text', 'Vermerk (mindestens 10 Zeichen)', ' maxlength="300" required minlength="10"') + codeFeld2(), knopf: 'Abo beenden', gefahr: true };
      case 'b-paket': return { titel: 'Paket wechseln', inhalt: '<p>Aktuell: ' + esc(paketName(b.paket)) + '. Die Merkmale gelten sofort; das Abo wechselt den Preis (nach oben anteilig, nach unten ohne Ausgleich).</p>' + paketWahl(b.paket), knopf: 'Paket wechseln' };
      case 'b-erstatten': return { titel: 'Einrichtung erstatten', inhalt: '<p>Bezahlt: ' + euro(((b.zahlung || {}).betrag_cent || 0) / 100) + (b.zahlung && b.zahlung.erstattet_cent ? ', schon erstattet ' + euro(b.zahlung.erstattet_cent / 100) : '') + '. Leer lassen für den ganzen Rest.</p>' + feldD('d-euro', 'euro', 'Betrag in Euro (optional)', ' inputmode="decimal" placeholder="z. B. 50"') + feldD('d-grund', 'grund', 'Grund', ' maxlength="200" required') + codeFeld2(), knopf: 'Erstatten', gefahr: true };
      case 'i-neu': { var P = PK(); return { titel: 'Demo-Instanz anlegen', inhalt: '<p>Eine Instanz ohne Bestellung für die Verkaufsseite: Impressum von eeziframes, Anfragen an MAIL_KONTAKT, nach einem Tag gelöscht. Danach eine Domain eintragen (z. B. demo-plus.eeziframes.com) und live schalten.</p><div class="f"><label for="d-ipaket">Paket</label><select id="d-ipaket" name="paket">' + (P ? P.LISTE : []).map(function (x) { return '<option value="' + x + '">' + esc(paketName(x)) + '</option>'; }).join('') + '</select></div>' + feldD('d-iname', 'name', 'Name im Konfigurator', ' maxlength="80" required placeholder="Fensterbau Muster"') + feldD('d-islug', 'slug', 'Kennung (a–z, 0–9, Bindestrich)', ' maxlength="40" required pattern="[a-z0-9-]{3,40}" placeholder="demo-plus"'), knopf: 'Anlegen' }; }
      case 'i-pausieren': { var bis = new Date(Date.now() + ((IR() && IR().FRISTEN.pauseMaxTage) || 60) * 864e5).toISOString().slice(0, 10); return { titel: 'Instanz pausieren', inhalt: '<p>Die Seite zeigt nur noch Name und Kontakt des Betriebs, ohne Formular.' + (i.bestellung ? ' Das Abo wird ausgesetzt.' : '') + ' Höchstens ' + ((IR() && IR().FRISTEN.pauseMaxTage) || 60) + ' Tage, danach endet der Vertrag.</p>' + feldD('d-grund', 'grund', 'Grund', ' maxlength="300" required') + feldD('d-bis', 'bis', 'Längstens bis', ' max="' + bis + '" value="' + bis + '"', 'date'), knopf: 'Pausieren', gefahr: true }; }
      case 'i-beenden': return { titel: 'Instanz beenden', inhalt: '<p>Die Seite antwortet nur noch mit „gibt es nicht mehr“' + (i.bestellung ? ', das Abo endet sofort' : '') + '. Die Daten werden nach ' + ((IR() && IR().FRISTEN.loeschenNachEndeTage) || 30) + ' Tagen gelöscht; die Domain wird gelöst.</p>' + textD('d-grund', 'grund', 'Vermerk (mindestens 10 Zeichen)', ' maxlength="300" required minlength="10"') + codeFeld2(), knopf: 'Beenden', gefahr: true };
      case 'i-paket': return { titel: 'Paket wechseln', inhalt: '<p>Aktuell: ' + esc(paketName(i.paket)) + '. Seite, App und Mails folgen sofort dem neuen Paket.</p>' + paketWahl(i.paket), knopf: 'Paket wechseln' };
      case 'i-loeschen': return { titel: 'Alle Daten löschen', inhalt: '<p>Anfragen, Zwischenstände, Fotos, Bilder der Marke, abgelegte Aufmaßblätter, Dateien der Bestellung, Anmeldungen der Zugänge, Domains und die Instanz selbst. Das lässt sich nicht rückgängig machen.</p>' + feldD('d-best', 'bestaetigung', 'Zur Bestätigung die Kennung eintippen: ' + esc(i.slug || ''), ' autocomplete="off" required') + codeFeld2(), knopf: 'Endgültig löschen', gefahr: true };
      case 'i-host-weg': return { titel: 'Domain entfernen', inhalt: '<p>' + esc(g.host) + ' gehört danach nicht mehr zu dieser Instanz. Am Worker hängt sie weiter, bis sie gelöst wird; Anfragen dorthin bekommen eine neutrale 404.</p>' + codeFeld2(), knopf: 'Entfernen', gefahr: true };
      case 'i-loesen': return { titel: 'Domain lösen', inhalt: '<p>' + esc(g.host) + ' und www.' + esc(g.host) + ' werden vom Konfigurator gelöst, die Auto-Verlängerung wird ausgeschaltet. Die Domain bleibt registriert, bis sie abläuft.</p>' + codeFeld2(), knopf: 'Lösen', gefahr: true };
      case 'code': return { titel: 'Code bestätigen', inhalt: '<p>Für diesen Schritt braucht es einen frischen Code aus der Authenticator-App.</p>' + codeFeld2(true), knopf: 'Bestätigen' };
      default: return { titel: '', inhalt: '', knopf: 'OK' };
    }
  }
  async function paketDialogAbschicken(g, f) {
    var enc = encodeURIComponent, bp = function (x) { return '/api/zentrale/bestellungen/' + enc(g.b || S.id) + x; }, ip = function (x) { return '/api/zentrale/instanzen/' + enc(S.id) + x; }, r = null, text = '';
    g.sendet = true; g.fehler = ''; render();
    try {
      switch (g.art) {
        case 'rueckruf': await api('/api/zentrale/rueckrufe/' + enc(g.n), { notiz: f.notiz || '' }); text = 'Rückruf erledigt.'; S.daten.bestellungen = null; break;
        case 'b-live': r = await api(bp('/live'), { vermerk: f.vermerk || '' }); text = 'Live. Das Abo läuft, der Partner hat die E-Mail mit dem Link.'; break;
        case 'b-status': r = await api(bp('/status'), { nach: f.nach, text: f.text || '', erstatten: !!f.erstatten, code: f.code || '' }); text = 'Status: ' + bTitel(f.nach) + '.'; break;
        case 'b-kulanz': r = await api(bp('/abo'), { aktion: 'kulanz', tage: +f.tage }); text = 'Kulanz verlängert.'; break;
        case 'b-kuendigen': r = await api(bp('/abo'), { aktion: 'kuendigen' }); text = 'Abo zum Periodenende gekündigt.'; break;
        case 'b-beenden': r = await api(bp('/abo'), { aktion: 'beenden', text: f.text || '', code: f.code || '' }); text = 'Abo beendet.'; break;
        case 'b-paket': r = await api(bp('/paket'), { paket: f.paket, differenz: !!f.differenz }); text = 'Paket gewechselt' + (r.wechsel && r.wechsel.posten ? ', Differenz auf der nächsten Rechnung' : '') + '.'; break;
        case 'b-erstatten': r = await api(bp('/erstatten'), { euro: f.euro || '', grund: f.grund || '', code: f.code || '' }); text = 'Erstattet: ' + euro((r.cent || 0) / 100) + '.'; break;
        case 'i-neu': r = await api('/api/zentrale/instanzen', { paket: f.paket, name: f.name, slug: f.slug, demo: true }); S.dialog = null; uebernehmen(r); toast('Demo-Instanz angelegt.'); location.hash = '#instanz/' + r.instanz.id + '/domain'; return;
        case 'i-pausieren': r = await api(ip('/status'), { aktion: 'pausieren', grund: f.grund || '', bis: f.bis || '' }); text = 'Pausiert.'; break;
        case 'i-beenden': r = await api(ip('/status'), { aktion: 'beenden', grund: f.grund || '', code: f.code || '' }); text = 'Beendet.'; break;
        case 'i-paket': r = await api(ip('/paket'), { paket: f.paket, differenz: !!f.differenz }); text = 'Paket gewechselt.'; break;
        case 'i-loeschen': r = await api(ip('/loeschen'), { bestaetigung: f.bestaetigung || '', code: f.code || '' }); S.dialog = null; delete S.daten['instanz:' + S.id]; S.daten.instanzen = null; toast(r.geloescht + ' ist mit allen Daten gelöscht.'); location.hash = '#instanzen'; aufgabenLaden(); return;
        case 'i-host-weg': r = await api(ip('/host/entfernen'), { host: g.host, code: f.code || '' }); text = 'Domain entfernt.'; break;
        case 'i-loesen': r = await api(ip('/domain/loesen'), { host: g.host, code: f.code || '' }); text = 'Domain gelöst' + (r.ergebnis && r.ergebnis.autoRenew === false ? ', Auto-Verlängerung aus' : '') + '.'; break;
        case 'code': r = await api(g.pfad, Object.assign({}, g.body, { code: f.code || '' })); if (r.ergebnis && g.body && g.body.host) S.cf[S.id] = Object.assign({ host: g.body.host }, r.ergebnis); text = g.erfolg || 'Erledigt.'; break;
      }
      if (r) uebernehmen(r);
      S.dialog = null; if (text) toast(text);
      if ((S.seite === 'instanz' && !(r && r.instanz && r.instanz.ampel)) || (S.seite === 'bestellung' && !(r && r.bestellung)) || S.seite === 'bestellungen') laden(true); else render();
      aufgabenLaden();
    } catch (e) { if (e.still) return; g.sendet = false; g.fehler = e.message; render(); }
  }

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
      default: { var x = paketDialog(g); titel = x.titel; inhalt = x.inhalt; knopf = x.knopf; gefahr = !!x.gefahr; }
    }
    return '<div class="fx-bg" data-act="dlg-zu"></div><div class="fx-dialog z-dialog" role="dialog" aria-modal="true" aria-labelledby="d-titel-h"><h2 id="d-titel-h">' + esc(titel) + '</h2><form class="z-form" data-form="dialog" novalidate>' + inhalt +
      (g.fehler ? '<p class="err" role="alert">' + esc(g.fehler) + '</p>' : '') +
      '<div class="z-dialog-knoepfe"><button class="btn ' + (gefahr ? 'danger' : 'primary') + '" type="submit"' + (g.sendet ? ' disabled' : '') + '>' + (g.sendet ? 'Einen Moment …' : esc(knopf)) + '</button><button class="btn soft" type="button" data-act="dlg-zu">Abbrechen</button></div></form></div>';
  }
  async function dialogAbschicken(form) {
    var g = S.dialog, f = {}; Array.prototype.forEach.call(form.elements, function (el) { if (el.name) f[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
    if (PAKET_DIALOGE.indexOf(g.art) >= 0) return paketDialogAbschicken(g, f);
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
    var schluessel = { uebersicht: 'uebersicht', bestellungen: 'bestellungen', bestellung: 'bestellung:' + S.id, instanzen: 'instanzen', instanz: 'instanz:' + S.id, betriebe: 'betriebe', betrieb: 'betrieb:' + S.id, kaeufe: 'kaeufe', statistik: 'statistik', anzeigen: 'anzeigen', protokoll: 'protokoll', einstellungen: 'einstellungen' }[S.seite];
    var q = zrQuery(), mitZeitraum = ['uebersicht', 'betriebe', 'betrieb', 'kaeufe', 'statistik', 'anzeigen'].includes(S.seite);
    if (!neu && S.daten[schluessel]) return render();
    if (neu) S.daten[schluessel] = null;
    render();
    try {
      var pfad = { uebersicht: '/api/zentrale/uebersicht?' + q, bestellungen: '/api/zentrale/bestellungen?filter=alle', bestellung: '/api/zentrale/bestellungen/' + encodeURIComponent(S.id), instanzen: '/api/zentrale/instanzen', instanz: '/api/zentrale/instanzen/' + encodeURIComponent(S.id), betriebe: '/api/zentrale/betriebe?' + q, betrieb: '/api/zentrale/betriebe/' + encodeURIComponent(S.id) + '?' + q, kaeufe: '/api/zentrale/kaeufe?' + q, statistik: '/api/zentrale/statistik?' + q, anzeigen: '/api/zentrale/anzeigen?' + q, protokoll: '/api/zentrale/protokoll' + (S.protokollArt ? '?art=' + encodeURIComponent(S.protokollArt) : ''), einstellungen: '/api/zentrale/einstellungen' }[S.seite];
      var j = await api(pfad);
      if (mitZeitraum && q !== zrQuery()) return; // der Zeitraum hat sich inzwischen geändert, die neuere Anfrage zählt
      if (S.seite === 'betrieb') { S.daten[schluessel] = j.betrieb; S.daten.zweiFaktor = j.zweiFaktor; }
      else if (S.seite === 'bestellung') { S.daten[schluessel] = j.bestellung; if (j.bestellung && j.bestellung.ungelesen) api('/api/zentrale/bestellungen/' + encodeURIComponent(j.bestellung.id) + '/gelesen', {}).then(aufgabenLaden).catch(function () { return null; }); }
      else if (S.seite === 'instanz') S.daten[schluessel] = j.instanz;
      else S.daten[schluessel] = j;
    } catch (e) { if (e.still) return; S.fehler = e.message; }
    render();
  }
  function route() {
    var h = (location.hash || '#uebersicht').slice(1), teile = h.split('/');
    var seite = ['uebersicht', 'bestellungen', 'bestellung', 'instanzen', 'instanz', 'betriebe', 'betrieb', 'kaeufe', 'statistik', 'anzeigen', 'protokoll', 'einstellungen'].includes(teile[0]) ? teile[0] : 'uebersicht';
    if (seite === 'betrieb' && !teile[1]) seite = 'betriebe';
    if (seite === 'bestellung' && !teile[1]) seite = 'bestellungen';
    if (seite === 'instanz' && !teile[1]) seite = 'instanzen';
    var reiterNeu = seite === 'instanz' ? (teile[2] || 'start') : 'start', nurReiter = seite === 'instanz' && S.seite === 'instanz' && teile[1] === S.id && reiterNeu !== S.reiter;
    S.reiter = reiterNeu;
    if (nurReiter) { S.dialog = null; render(); window.scrollTo(0, 0); return; }
    if (seite !== S.seite || teile[1] !== S.id) { S.dialog = null; if (S.seite === 'betrieb' && S.id !== teile[1]) delete S.einblick[S.id]; }
    S.seite = seite; S.id = ['betrieb', 'bestellung', 'instanz'].includes(seite) ? decodeURIComponent(teile[1]) : '';
    if (S.status && S.status.angemeldet) { laden(false); window.scrollTo(0, 0); } else render();
  }

  /* ---------- Zeichnen ---------- */
  function render() {
    var fokus = document.activeElement, fokusId = fokus && fokus.id, pos = fokus && typeof fokus.selectionStart === 'number' ? fokus.selectionStart : null;
    if (!S.status) { wurzel.innerHTML = '<main class="z-login"><div class="z-login-karte">' + MARKE + '<p class="z-text">' + (S.fehler ? esc(S.fehler) : 'Wird geladen …') + '</p></div></main>'; return; }
    if (!S.status.angemeldet) { wurzel.innerHTML = seiteAnmelden(); var pw = document.getElementById(S.status.zweiFaktor && S.anmeldenFehler && document.getElementById('z-code') ? 'z-code' : 'z-pw'); if (pw && !fokusId) pw.focus(); if (fokusId) { var f0 = document.getElementById(fokusId); if (f0) f0.focus(); } return; }
    var inhalt = { uebersicht: seiteUebersicht, bestellungen: seiteBestellungen, bestellung: seiteBestellung, instanzen: seiteInstanzen, instanz: seiteInstanz, betriebe: seiteBetriebe, betrieb: seiteBetrieb, kaeufe: seiteKaeufe, statistik: seiteStatistik, anzeigen: seiteAnzeigen, protokoll: seiteProtokoll, einstellungen: seiteEinstellungen }[S.seite]();
    wurzel.innerHTML = rahmen(inhalt);
    if (fokusId) { var f = document.getElementById(fokusId); if (f) { f.focus(); if (pos != null && typeof f.setSelectionRange === 'function' && f.type !== 'number' && f.type !== 'email') try { f.setSelectionRange(pos, pos); } catch (e) { /* ok */ } } }
    else if (S.dialog) { var erstes = document.querySelector('.z-dialog input:not([readonly]), .z-dialog textarea, .z-dialog select, .z-dialog button'); if (erstes) erstes.focus(); }
    document.title = ({ uebersicht: 'Übersicht', bestellungen: 'Bestellungen', bestellung: ((S.daten['bestellung:' + S.id] || {}).partner || {}).firma || 'Bestellung', instanzen: 'Instanzen', instanz: (S.daten['instanz:' + S.id] || {}).name || 'Instanz', betriebe: 'Betriebe', betrieb: (S.daten['betrieb:' + S.id] || {}).name || 'Betrieb', kaeufe: 'Käufe', statistik: 'Statistik', anzeigen: 'Anzeigen', protokoll: 'Protokoll', einstellungen: 'Einstellungen' }[S.seite] || 'Zentrale') + ' · Zentrale | eeziframes';
  }


  /* ---------- Bedienung der Konfigurator-Pakete ---------- */
  var ipfad = function (x) { return '/api/zentrale/instanzen/' + encodeURIComponent(S.id) + x; };
  var bpfad = function (bid, x) { return '/api/zentrale/bestellungen/' + encodeURIComponent(bid) + x; };
  async function schrittAusfuehren(v, el) {
    var bid = el.getAttribute('data-b'), iid = el.getAttribute('data-i');
    switch (v) {
      case 'einrichtung': return aktion(bpfad(bid, '/status'), { nach: 'einrichtung' }, 'Einrichtung begonnen. Der Partner hat eine E-Mail.', el);
      case 'instanz': return aktion(bpfad(bid, '/instanz'), {}, function (r) { return 'Instanz ' + r.instanz.slug + ' angelegt' + (r.einladungen ? ', ' + r.einladungen + (r.einladungen === 1 ? ' Bestätigungslink' : ' Bestätigungslinks') + ' verschickt' : '') + '.'; }, el);
      case 'domain': location.hash = '#instanz/' + iid + '/domain'; return;
      case 'gestaltung': location.hash = '#instanz/' + iid + '/gestaltung'; return;
      case 'domain-gesichert': return aktion(bpfad(bid, '/status'), { nach: 'domain' }, 'Domain gesichert. Der Partner hat eine E-Mail.', el);
      case 'vorschau': return aktion(bpfad(bid, '/vorschau'), {}, 'Die Vorschau ist beim Partner.', el);
      case 'live': { var b = S.daten['bestellung:' + bid], s0 = (b && b.schritt) || ((S.daten['instanz:' + S.id] || {}).schritt) || {}; S.dialog = { art: 'b-live', b: bid, wartet: !!s0.wartet }; return render(); }
      case 'fortsetzen': return aktion(bpfad(bid, '/abo'), { aktion: 'fortsetzen' }, 'Fortgesetzt.', el);
      case 'abo-neu': return aktion(bpfad(bid, '/abo'), { aktion: 'neu' }, 'Abo neu gestartet.', el);
    }
  }
  function entwurfAusForm(form) {
    var w = function (n) { var el = form.elements[n]; return el ? el.value : undefined; }, e = { name: w('name') };
    if (form.elements.titel) { e.titel = w('titel'); e.beschreibung = w('beschreibung'); e.farbe = String(w('farbe') || '').trim().toLowerCase(); }
    if (form.elements.kicker) e.start = { kicker: w('kicker'), ueberschrift: w('ueberschrift'), text: w('text') };
    return e;
  }
  function freierSlot(d) { var e = d.entwurf || d.marke || {}, da = ((e.bilder || {}).start || []).map(function (n) { return n.replace(/\.[a-z]+$/, ''); }); for (var j = 1; j <= (Number(d.m.fotos) || 0); j++) if (da.indexOf('start-' + j) < 0) return 'start-' + j; return ''; }
  async function paketKlick(act, v, el) {
    var h = el.getAttribute('data-h') || '', d = S.daten['instanz:' + S.id];
    switch (act) {
      case 'bfilter': S.bfilter = v; return render();
      case 'schritt': return schrittAusfuehren(v, el);
      case 'b-abo': return aktion(bpfad(S.id, '/abo'), { aktion: v }, v === 'neu' ? 'Abo neu gestartet.' : 'Kündigung zurückgenommen.', el);
      case 'datei': try { await herunterladen(bpfad(el.getAttribute('data-b'), '/datei/' + encodeURIComponent(el.getAttribute('data-d'))), el.getAttribute('data-n') || 'datei'); } catch (e) { if (!e.still) toast(e.message); } return;
      case 'i-pruefen': return aktion(ipfad('/domain/pruefen'), { host: h }, function (r) { return r.pruefung && r.pruefung.ok ? h + ': alles grün.' : h + ': noch nicht erreichbar.'; }, el);
      case 'i-manuell': return aktion(ipfad('/domain/pruefen'), { host: h, manuell: true }, 'Vermerkt: im Browser geprüft.', el);
      case 'i-verbinden': case 'i-zone': {
        var r = await aktion(ipfad(act === 'i-zone' ? '/domain/zone' : '/domain/verbinden'), { host: h, stoerendeLoeschen: el.getAttribute('data-loeschen') === '1' }, function (x) { return x.ergebnis && x.ergebnis.ok ? h + ' ist verbunden.' : act === 'i-zone' ? 'Zone ' + ((x.ergebnis || {}).zone || {}).name + ' angelegt.' : 'Noch nicht fertig, siehe Cloudflare.'; }, el);
        if (r && r.ergebnis) { S.cf[S.id] = Object.assign({ host: h }, r.ergebnis); render(); }
        return;
      }
      case 'i-haupt': return aktion(ipfad('/host/haupt'), { host: h }, 'Hauptdomain gesetzt.', el);
      case 'i-entfernen': S.dialog = { art: 'i-host-weg', host: h }; return render();
      case 'i-loesen': S.dialog = { art: 'i-loesen', host: h }; return render();
      case 'i-wunsch': { var f = document.getElementById('z-host'); if (f) { f.value = v; f.focus(); } return; }
      case 'i-farbe': { var ff = document.getElementById('z-g-farbe'); if (ff) { ff.value = v; ff.focus(); } return; }
      case 'i-veroeffentlichen': {
        var fm = document.querySelector('form[data-form="i-entwurf"]'); el.disabled = true;
        try { if (fm) uebernehmen(await api(ipfad('/entwurf'), { entwurf: entwurfAusForm(fm) })); } catch (e) { el.disabled = false; if (!e.still) toast(e.message); return; }
        return aktion(ipfad('/veroeffentlichen'), {}, function (x) { return 'Veröffentlicht: Fassung ' + x.v + '.'; }, el);
      }
      case 'i-bild-weg': return aktion(ipfad('/bild'), { name: v + (v === 'logo' ? '.png' : '.jpg'), entfernen: true }, 'Entfernt.', el);
      case 'i-uebernehmen': {
        if (!d || !d.bestellung) return;
        var art = el.getAttribute('data-art'), typ = el.getAttribute('data-typ'), slot = art === 'logo' ? 'logo' : art === 'ap' ? 'ap' : freierSlot(d);
        if (!slot) { toast('Alle Foto-Plätze sind belegt. Erst eines entfernen.'); return; }
        el.disabled = true;
        try { var rr = await api(bpfad(d.bestellung.id, '/datei/' + encodeURIComponent(el.getAttribute('data-d'))), null, true); await bildVerarbeiten(d, slot, await rr.blob(), typ); } catch (e) { if (!e.still) toast(e.message); }
        el.disabled = false; return;
      }
      case 'i-eingang-erneut': return aktion(ipfad('/eingang'), { erneut: v }, 'Der Bestätigungslink ist unterwegs.', el);
      case 'i-zugang': return aktion(ipfad('/zugang'), { aktion: v, mail: el.getAttribute('data-m') }, { erneut: 'Der Bestätigungslink ist unterwegs.', aus: 'Zugang ausgeschaltet.', an: 'Zugang eingeschaltet.', loeschen: 'Zugang gelöscht.' }[v], el);
      case 'i-test': return aktion(ipfad('/test'), {}, function (x) { return 'Testanfrage: ' + (V_TITEL[(x.test || {}).status] || (x.test || {}).status || 'offen') + '.'; }, el);
      case 'i-erneut': return aktion(ipfad('/anfragen/' + encodeURIComponent(v) + '/erneut'), {}, function (x) { return 'Erneut gesendet: ' + (V_TITEL[(x.versand || {}).status] || 'offen') + '.'; }, el);
      case 'i-live': return aktion(ipfad('/live'), {}, 'Die Instanz ist live.', el);
      case 'i-fortsetzen': return aktion(ipfad('/status'), { aktion: 'fortsetzen' }, 'Fortgesetzt.', el);
    }
    return false;
  }
  var PAKET_AKTE = ['bfilter', 'schritt', 'b-abo', 'datei', 'i-pruefen', 'i-manuell', 'i-verbinden', 'i-zone', 'i-haupt', 'i-entfernen', 'i-loesen', 'i-wunsch', 'i-farbe', 'i-veroeffentlichen', 'i-bild-weg', 'i-uebernehmen', 'i-eingang-erneut', 'i-zugang', 'i-test', 'i-erneut', 'i-live', 'i-fortsetzen'];
  async function paketFormular(art, form) {
    var w = function (n) { return form.elements[n] ? form.elements[n].value : ''; };
    switch (art) {
      case 'b-nachricht': { var r = await aktion(bpfad(S.id, '/nachricht'), { text: w('text') }, function (x) { return x.mail ? 'Gesendet, auch per E-Mail.' : 'Gespeichert; die E-Mail ging nicht raus.'; }); if (r) { var t = document.getElementById('z-bnachricht'); if (t) t.value = ''; } return true; }
      case 'b-notiz': await aktion(bpfad(S.id, '/notiz'), { text: w('text') }, 'Notiz gespeichert.'); return true;
      case 'b-frei': {
        var bid = S.id, knopfEl = form.querySelector('button[type="submit"]'); if (knopfEl) knopfEl.disabled = true;
        try { var rf = await api(bpfad(bid, '/domains/frei'), { host: w('host') }), m = S.frei[bid] = S.frei[bid] || {}; (rf.domains || []).forEach(function (x) { if (x.host) m[x.host] = x; }); render(); }
        catch (e) { if (!e.still) toast(e.message); }
        if (knopfEl) knopfEl.disabled = false; return true;
      }
      case 'i-host': { var r2 = await aktion(ipfad('/host'), { host: w('host') }, 'Domain eingetragen.'); if (r2) { var hf = document.getElementById('z-host'); if (hf) hf.value = ''; } return true; }
      case 'i-entwurf': await aktion(ipfad('/entwurf'), { entwurf: entwurfAusForm(form) }, 'Entwurf gespeichert.'); return true;
      case 'i-recht': { var rec = {}; ['firma', 'rechtsform', 'vertretung', 'strasse', 'plz', 'ort', 'bundesland', 'tel', 'mail', 'register', 'ust', 'kammer', 'beruf'].forEach(function (n) { rec[n] = w(n); }); await aktion(ipfad('/recht'), { recht: rec }, 'Impressum gespeichert.'); return true; }
      case 'i-eingang': await aktion(ipfad('/eingang'), { mails: w('mails').split(/[\s,;]+/).filter(Boolean) }, 'Empfänger gespeichert. Neue Adressen bekommen einen Bestätigungslink.'); return true;
      case 'i-zugang': await aktion(ipfad('/zugang'), { aktion: 'anlegen', mail: w('mail'), name: w('name') }, 'Zugang angelegt; der Bestätigungslink ist unterwegs.'); return true;
      case 'i-profil': { var d = S.daten['instanz:' + S.id] || {}, ein = Object.assign({}, (d.profil || {}).einladung || {}, { ansprechpartner: w('ansprechpartner'), telefon: w('telefon'), mail: w('mail') }); if (form.elements.begruessung) ein.begruessung = w('begruessung'); await aktion(ipfad('/profil'), { einladung: ein, ap: w('ansprechpartner'), tel: w('telefon'), mail: w('mail') }, 'Gespeichert.'); return true; }
      case 'i-registrar': await aktion(ipfad('/domain/registrar'), { host: form.getAttribute('data-h'), anbieter: w('anbieter'), ablauf: w('ablauf') }, 'Gemerkt.'); return true;
    }
    return false;
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
    if (PAKET_AKTE.indexOf(act) >= 0) { ev.preventDefault(); return paketKlick(act, v, el); }
    switch (act) {
      case 'abmelden': ev.preventDefault(); try { await fetch('/api/zentrale/abmelden', { method: 'POST', headers: { 'content-type': 'application/json', 'x-zentrale': '1' }, body: '{}' }); } catch (e) { /* ok */ } S.daten = {}; S.einblick = {}; S.aufgaben = null; S.cf = {}; Object.keys(S.bild).forEach(function (k) { var c = S.bild[k]; if (c && typeof c === 'object') Object.keys(c).forEach(function (n) { if (n.charAt(0) !== '_') URL.revokeObjectURL(c[n]); }); }); S.bild = {}; S.zweiFaktor = null; S.anmeldungen = null; S.status = Object.assign({}, S.status, { angemeldet: false }); S.anmeldenFehler = ''; render(); return;
      case 'neu-laden': return laden(true);
      case 'filter': S.filter = v; return render();
      case 'kopieren': { var feld = document.getElementById(v); if (!feld) return; try { await navigator.clipboard.writeText(feld.value); toast('Kopiert.'); } catch (e) { feld.select(); toast('Bitte markieren und kopieren.'); } return; }
      case 'zeitraum':
        S.zrFehler = '';
        if (v === 'frei') { S.zrFrei = true; render(); var von = document.getElementById('z-von'); if (von) von.focus(); return; }
        S.zrFrei = false; if (S.zeitraum.art === v) return render();
        S.zeitraum = { art: v, von: '', bis: '', vonZeit: '', bisZeit: '' }; return zeitraumNeu();
      case 'csv': try { await herunterladen('/api/zentrale/betriebe.csv?' + zrQuery(), 'eeziframes-betriebe.csv'); toast('Tabelle wird gespeichert.'); } catch (e) { if (!e.still) toast(e.message); } return;
      case 'dlg': S.dialog = { art: v, abo: 'kuendigen', n: el.getAttribute('data-n') || '' }; return render();
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
        S.status = Object.assign({}, S.status, { angemeldet: true, bis: j.bis }); S.anmeldenFehler = ''; document.activeElement && document.activeElement.blur(); route(); aufgabenLaden();
      } catch (e) { S.sendet = false; S.anmeldenFehler = 'Keine Verbindung zum Server.'; render(); }
      return;
    }
    if (art === 'dialog') return dialogAbschicken(form);
    if (await paketFormular(art, form)) return;
    if (art === 'zeitraum') {
      var tag = /^\d{4}-\d{2}-\d{2}$/, uhr = /^([01]\d|2[0-3]):[0-5]\d$/, heute = heuteBerlin();
      var a = { tag: form.elements.von.value, zeit: String(form.elements.vonZeit.value || '').slice(0, 5) || '00:00' }, b = { tag: form.elements.bis.value, zeit: String(form.elements.bisZeit.value || '').slice(0, 5) || '23:59' };
      if (!tag.test(a.tag) || !tag.test(b.tag)) { S.zrFehler = 'Bitte beide Tage wählen.'; return render(); }
      if (!uhr.test(a.zeit) || !uhr.test(b.zeit)) { S.zrFehler = 'Bitte die Uhrzeit als Stunden und Minuten eingeben, etwa 08:30.'; return render(); }
      if (a.tag > b.tag) { var t = a.tag; a.tag = b.tag; b.tag = t; } // vertauschte Tage: die Uhrzeiten bleiben bei Von und Bis
      if (a.tag === b.tag && a.zeit > b.zeit) { var u = a.zeit; a.zeit = b.zeit; b.zeit = u; }
      if (b.tag > heute) b = { tag: heute, zeit: '23:59' }; if (a.tag > heute) a = { tag: heute, zeit: '00:00' };
      S.zrFehler = ''; S.zeitraum = { art: 'frei', von: a.tag, bis: b.tag, vonZeit: a.zeit === '00:00' ? '' : a.zeit, bisZeit: b.zeit === '23:59' ? '' : b.zeit }; document.activeElement && document.activeElement.blur(); return zeitraumNeu();
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
    if (f === 'linkKampagne') { S.link.kampagne = el.value; return render(); }
    if (f === 'farbwahl') { var t = document.getElementById('z-g-farbe'); if (t) t.value = el.value; }
  });
  document.addEventListener('change', async function (ev) {
    var el = ev.target.closest('[data-in]'); if (!el) return;
    var f = el.getAttribute('data-in');
    if (f === 'sortierung') { S.sortierung = el.value; el.blur(); return render(); }
    if (f === 'protokollArt') { S.protokollArt = el.value; el.blur(); return laden(true); }
    if (f === 'linkZiel' || f === 'linkNetz') { S.link[f === 'linkZiel' ? 'ziel' : 'netz'] = el.value; return render(); }
    if (f === 'i-schalter') { var o = {}; o[el.getAttribute('data-v')] = el.checked; return aktion(ipfad('/schalter'), o, 'Gespeichert.'); }
    if (f === 'i-bild') { var datei = el.files && el.files[0], d = S.daten['instanz:' + S.id]; if (!datei || !d) return; el.disabled = true; try { await bildVerarbeiten(d, el.getAttribute('data-v'), datei, datei.type); } catch (e) { if (!e.still) toast(e.message); } el.disabled = false; el.value = ''; }
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && S.dialog && !S.dialog.sendet) { S.dialog = null; render(); } });
  window.addEventListener('hashchange', route);

  /* ---------- Start ---------- */
  (async function start() {
    try { var r = await fetch('/api/zentrale/status', { headers: { accept: 'application/json' }, cache: 'no-store', credentials: 'same-origin' }); S.status = await r.json(); if (!r.ok || !S.status || !S.status.ok) throw new Error('Status'); }
    catch (e) { S.status = null; S.fehler = 'Der Server antwortet gerade nicht. Bitte später noch einmal.'; return render(); }
    route(); if (S.status.angemeldet) aufgabenLaden();
  })();
})();

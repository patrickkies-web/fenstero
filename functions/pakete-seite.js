/* eeziframes · Konfigurator-Pakete auf eeziframes.com: Verkaufsseite /fuer-fensterbauer/, Paketbedingungen mit AV-Vertrag
   /konfigurator-bedingungen/ und der Absatz in llms.txt (Strang F, Bauplan §3 F; Vertrag docs/INSTANZEN.md).
   Haken in functions/seo.js: seite() gibt jede ausgelieferte Seite durch paketeSeite(html, url, env), llms() hängt paketeLlms() an,
   PAKETE_SEITEN kommen in die Sitemap (SEITEN).

   Bausteine: Zwischen <!--pakete:NAME--> und <!--/pakete:NAME--> steht in der Datei eine Fassung, die dieselbe Funktion ohne Variablen
   gebaut hat (Rückfall, lesbar auch ohne Worker); beim Ausliefern setzt paketeSeite() die Fassung für diese Umgebung ein. Preise,
   Merkmale und Fristen kommen nur aus web/assets/pakete.js und web/assets/instanzregeln.js (eine Stelle je Wahrheit), der Verkauf aus
   Instanzregeln.verkauf. Neu bauen nach einer Änderung an Paketen, Fristen oder Bausteinen:
     node scripts/bedingungen-pdf.mjs      schreibt die Bausteine in die Seiten und die PDFs der Paketbedingungen
   scripts/pruefen-instanzen/29.mjs prüft, dass Seiten und PDFs so gebaut sind.

   Verkauf: ohne PAKETE_OFFEN=1 zeigt die Seite „Vorläufige Preise“ und statt der Bestellknöpfe „Bestellung bald möglich“ mit dem
   Anfrageformular (POST /api/partner/frage, auch ohne JavaScript); die Paket-Kasse selbst sperrt partner.js. Mit PAKETE_OFFEN=1 führt
   jeder Bestellknopf auf /partner/#bestellen/<paket>. Live-Demos: mit PAKETE_DEMOS=1 Links auf https://demo-<paket>.eeziframes.com/
   (Demo-Instanzen, docs/INSTANZEN.md Teil 2), sonst der Weg in die App.
   Preise stehen mit schmalem geschütztem Leerzeichen (U+202F) vor „€“: Die Ersetzungen nach dem Einführungspreis der Hauseigentümer
   (seo.js, nachEinfuehrung) greifen nur bei Leerzeichen und &nbsp; und lassen die Paketpreise in Ruhe. */
import '../web/assets/pakete.js';
import '../web/assets/instanzregeln.js';
import { konfig, live } from './api/umgebung.js';
import { PAKET_STAND, paketPdfs, standText } from './api/recht.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const NB = ' ';
const zahl = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(2).replace('.', ','));
/* 29 → „29 €“ mit schmalem geschütztem Leerzeichen */
export const geld = (n) => zahl(n) + NB + '€';
const kurzname = (p) => String(P().PAKETE[p].name).replace(/^EEZI\s+/, '');
/* Das empfohlene Paket ist das mittlere der Liste (Cream-Knopf, Rand) */
const EMPFOHLEN = 1;

/* Herkunft für absolute Adressen im JSON-LD (wie basis() in seo.js; seo.js importiert diese Datei, deshalb hier nachgebaut) */
const LOKAL = /^(localhost|127\.\d+\.\d+\.\d+|\[::1\])$/i;
export const basisVon = (env, url) => (!url ? '' : env && env.KANONISCH ? String(env.KANONISCH).replace(/\/+$/, '') : (LOKAL.test(url.hostname) ? url.protocol : 'https:') + '//' + url.host.replace(/^www\./i, ''));

/* Verkauf in dieser Umgebung: { offen, bestellen, vorlaeufig, mwst, demos } (bestellen nur mit PAKETE_OFFEN=1) */
export function verkaufFuer(env) {
  const e = env || {}, k = konfig(e), v = R().verkauf({ offen: k.paketeOffen, live: live(k) });
  return { offen: !!v.offen, bestellen: !!v.bestellen, vorlaeufig: !!(v.vorlaeufig || P().VORLAEUFIG), mwst: k.preise.mwst !== false, demos: String(e.PAKETE_DEMOS || '').trim() === '1' };
}
const steuerText = (v) => (v.mwst ? 'netto zzgl. MwSt.' : 'ohne Ausweis der Umsatzsteuer (§ 19 UStG)');

/* ---------- Merkmale lesbar ---------- */
export function wertText(schluessel, m) {
  const d = P().MERKMALE[schluessel], v = m[schluessel];
  if (!d) return String(v);
  if (d.art === 'janein') return v ? 'ja' : 'nein';
  if (d.art === 'zahl') return v ? String(v) : 'nein';
  if (d.art === 'tage') return v ? v + ' Tage' : 'nein';
  if (d.art === 'wahl') return (d.werte && d.werte[v]) || String(v);
  if (d.art === 'aufbewahrung') return v === 'vertrag' ? 'für die Vertragsdauer' : v + ' Tage nach Zustellung';
  if (d.art === 'preis') return geld(v.monat) + ' im Monat, ' + geld(v.einrichtung) + ' Einrichtung';
  return String(v);
}
/* Satz unter dem Paketnamen, aus den Merkmalen (nie aus dem Namen des Pakets) */
function kurzText(m) {
  if (m.dashboard) return 'Ganz Ihre Marke, dazu Ihr Dashboard mit persönlichen Einladungslinks und Fortschritt.';
  if (m.gestaltung === 'eigen') return 'Ihr Konfigurator in Ihrem Design: Logo, Firmenfarbe, Fotos und eigene Startseite.';
  return 'Der volle Konfigurator unter Ihrer Domain, im eeziframes-Design mit Ihrem Namen.';
}
/* Die wichtigsten Punkte eines Pakets für die Karte */
function punkte(m) {
  const M = P().MERKMALE, out = [];
  if (m.domain) out.push('Unter Ihrer eigenen Domain, z. B. ihr-name-fenster.de');
  if (m.konfigurator) out.push(M.konfigurator.text);
  if (m.eingangMail) out.push('Jede Anfrage als Aufmaßblatt-PDF per E-Mail');
  if (m.gestaltung === 'eigen') {
    const teile = [m.logo ? 'Ihr Logo' : '', m.farbe ? 'Ihre Firmenfarbe' : '', m.fotos ? 'bis zu ' + m.fotos + ' Fotos Ihres Betriebs' : '', m.startansicht ? 'eigene Startseite' : ''].filter(Boolean);
    out.push('In Ihrem Design: ' + teile.join(', '));
  } else out.push(M.gestaltung.werte[m.gestaltung]);
  /* Der neutrale Absender ist nach Bauplan §4 optional (zweite Domain): ehrlich „sobald eingerichtet“, bis dahin kommt die Mail vom Konfigurator-Postfach */
  out.push(m.kennzeichnung === 'keine' ? 'Ohne Hinweis auf eeziframes für Ihre Kunden, auch im Aufmaßblatt' + (m.absender === 'neutral' ? '; E-Mails an Sie von einem neutralen Absender, sobald eingerichtet' : '') : 'Hinweis auf eeziframes: ' + M.kennzeichnung.werte[m.kennzeichnung]);
  if (m.indexierung === 'start') out.push('Startseite in Suchmaschinen');
  if (m.dashboard) out.push('Dashboard unter Ihrer Domain mit ' + m.zugaenge + ' Zugängen');
  if (m.einladungslinks) out.push('Persönliche Einladungslinks für Ihre Kunden');
  if (m.fortschritt) out.push('Fortschritt sehen: eingeladen, in Bearbeitung, eingereicht');
  if (m.pdfAblage) out.push('Aufmaßblätter jederzeit im Dashboard');
  return out;
}

/* ---------- Bausteine ---------- */
/* Hinweis über den Paketkarten: vorläufige Preise und Verkaufsstand */
function hinweis(v) {
  if (!v.vorlaeufig && v.bestellen) return '';
  return '\n  <p class="vk-hinweis"><b>' + (v.vorlaeufig ? 'Vorläufige Preise.' : 'Bestellung bald möglich.') + '</b> ' +
    (v.vorlaeufig ? 'Die Preise stehen noch nicht endgültig fest; es gilt der Preis, den Sie beim Bestellen sehen, und er bleibt für Ihren Vertrag fest.' : '') +
    (v.bestellen ? '' : (v.vorlaeufig ? ' ' : '') + 'Die Bestellung schalten wir in Kürze frei; fragen Sie gern schon jetzt <a href="#bestellen">unverbindlich an</a>.') + '</p>';
}
function karten(o, v) {
  const liste = P().LISTE;
  const karte = (p, i) => {
    const m = P().merkmale(p), pr = P().preis(p), emp = i === EMPFOHLEN;
    const knopf = v.bestellen
      ? '<a class="btn ' + (emp ? 'primary' : 'ghost') + '" href="/partner/#bestellen/' + p + '">' + esc(kurzname(p)) + ' bestellen</a>'
      : '<a class="btn ' + (emp ? 'primary' : 'ghost') + '" href="#bestellen" data-paket="' + p + '">' + esc(kurzname(p)) + ' anfragen</a>';
    return '\n    <article class="vk-paket' + (emp ? ' vk-empfohlen' : '') + '" id="paket-' + p + '" aria-labelledby="paket-' + p + '-name">' +
      (emp ? '<p class="vk-marke">Beliebt</p>' : '') +
      '<h3 class="vk-name" id="paket-' + p + '-name">' + esc(P().PAKETE[p].name) + '</h3>' +
      '<p class="vk-kurz">' + esc(kurzText(m)) + '</p>' +
      '<p class="vk-preis"><b>' + geld(pr.monat) + '</b> im Monat</p>' +
      '<p class="vk-einr">dazu ' + geld(pr.einrichtung) + ' Einrichtung, einmalig vorab</p>' +
      '<p class="vk-steuer">' + steuerText(v) + ' · nur für Unternehmer</p>' +
      '<ul class="vk-liste">' + punkte(m).map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>' + knopf + '</article>';
  };
  return hinweis(v) + '\n  <div class="vk-pakete">' + liste.map(karte).join('') + '\n  </div>\n  ';
}
/* Vergleich aller Merkmale mit vergleich: true (Beschriftung aus MERKMALE) */
function vergleich(o, v) {
  const liste = P().LISTE, M = P().MERKMALE, ms = liste.map((p) => P().merkmale(p));
  const kopf = '<thead><tr><th>Merkmal</th>' + liste.map((p) => '<th>' + esc(kurzname(p)) + '</th>').join('') + '</tr></thead>';
  const zeile = (titel, werte) => '<tr><td>' + esc(titel) + '</td>' + werte.map((w, i) => '<td data-k="' + esc(kurzname(liste[i])) + '">' + w + '</td>').join('') + '</tr>';
  const zeilen = [zeile('Monatlich, ' + (v.mwst ? 'netto' : 'ohne USt.'), ms.map((m) => geld(m.preis.monat))), zeile('Einrichtung, einmalig vorab', ms.map((m) => geld(m.preis.einrichtung)))];
  Object.keys(M).forEach((s) => { if (M[s].vergleich && s !== 'preis') zeilen.push(zeile(M[s].titel, ms.map((m) => esc(wertText(s, m))))); });
  return '\n  <table class="rg-tab vk-vergleich">' + kopf + '<tbody>' + zeilen.join('') + '</tbody></table>\n  <p class="rg-klein">Alle Preise ' + steuerText(v) + ', nur für Unternehmer.' + (v.vorlaeufig ? ' Vorläufige Preise.' : '') + '</p>\n  ';
}
/* Ablauf von der Bestellung bis Live: die sechs Schritte der Statusleiste im Kundenkonto, in denselben Worten */
const ABLAUF = {
  offen: 'Sie wählen Ihr Paket und geben Firma, Wunsch-Domain und die E-Mail-Adressen für Ihre Anfragen an. Die Eingangsbestätigung mit den Paketbedingungen als PDF kommt sofort.',
  bezahlt: 'Sie zahlen die Einrichtungsgebühr vorab bei Stripe, per Karte oder SEPA-Lastschrift. Danach legen wir los.',
  einrichtung: 'Wir rufen Sie zu Ihrer Wunschzeit an, legen Ihren Konfigurator an, und Sie bestätigen die Adressen, an die Ihre Anfragen gehen.',
  domain: 'Wir sichern Ihre Domain und verbinden sie mit Ihrem Konfigurator, samt Zertifikat und Schutz vor gefälschten E-Mails.',
  freigabe: 'Sie sehen Ihren Konfigurator vorab über einen Vorschau-Link, schicken eine Testanfrage und geben ihn im Kundenkonto frei oder wünschen Änderungen.',
  live: 'Ihr Konfigurator ist öffentlich. Ab jetzt läuft das Monatsabo, und Sie bekommen einen Knopf „Fenster planen“ für Ihre Website.'
};
function ablauf() {
  return '\n  <ol class="rg-schritte">' + R().bestellung.LEISTE.map((s) => '\n    <li><b>' + esc(s.titel) + '</b>' + esc(ABLAUF[s.status] || '') + '</li>').join('') + '\n  </ol>\n  ';
}
function demos(o, v) {
  if (v.demos) {
    return '\n  <p>So sieht der Konfigurator bei Ihren Kunden aus, je Paket mit einem erfundenen Betrieb. Anfragen dort gehen an uns und verschwinden nach einem Tag.</p>\n  <div class="rg-karten">' +
      P().LISTE.map((p) => '<a class="rg-karte" href="https://demo-' + p + '.eeziframes.com/" rel="noopener"><b>Demo ' + esc(P().PAKETE[p].name) + '</b><span>' + esc(kurzText(P().merkmale(p))) + '</span></a>').join('') + '</div>\n  ';
  }
  return '\n  <p>Die Live-Demos je Paket schalten wir in Kürze frei. Bis dahin probieren Sie den Konfigurator selbst aus: Es ist dieselbe App, mit der Hauseigentümer auf eeziframes.com ihre Fenster planen. Unter Ihrer Domain trägt sie Ihren Namen, zeigt keine Preise und schickt jede Anfrage an Sie.</p>\n  <div class="rg-karten"><a class="rg-karte" href="/app/"><b>Konfigurator ausprobieren</b><span>Ein Fenster planen, mit Fotos, Maßen und 3-D-Modell; ohne Konto.</span></a></div>\n  ';
}
function formular() {
  const optionen = '<option value="">Noch offen</option>' + P().LISTE.map((p) => '<option value="' + p + '">' + esc(P().PAKETE[p].name) + '</option>').join('');
  return '\n  <form class="vk-form" method="post" action="/api/partner/frage" data-vk-frage>' +
    '\n    <div class="vk-felder">' +
    '<label class="vk-feld"><span>Ihr Name</span><input name="name" autocomplete="name" required minlength="2" maxlength="80"></label>' +
    '<label class="vk-feld"><span>Firma <i>(freiwillig)</i></span><input name="firma" autocomplete="organization" maxlength="100"></label>' +
    '<label class="vk-feld"><span>E-Mail</span><input name="mail" type="email" autocomplete="email" required maxlength="120"></label>' +
    '<label class="vk-feld"><span>Telefon <i>(freiwillig)</i></span><input name="tel" type="tel" autocomplete="tel" maxlength="40"></label>' +
    '<label class="vk-feld vk-breit"><span>Paket</span><select name="paket">' + optionen + '</select></label>' +
    '<label class="vk-feld vk-breit"><span>Ihre Frage oder Ihr Wunsch</span><textarea name="text" rows="4" required minlength="3" maxlength="2000"></textarea></label>' +
    '</div>' +
    '\n    <div class="vk-fax" aria-hidden="true"><label>Fax <input name="fax" tabindex="-1" autocomplete="off"></label></div>' +
    '\n    <p class="rg-klein">Wir nutzen Ihre Angaben nur, um Ihnen zu antworten (<a href="/datenschutz/#pakete">Datenschutz</a>).</p>' +
    '\n    <button class="btn primary" type="submit">Frage senden<span class="pf" aria-hidden="true"></span></button>' +
    '\n    <p class="vk-meldung" role="status" aria-live="polite"></p>' +
    '\n  </form>';
}
function bestellen(o, v) {
  if (v.bestellen) {
    return '\n  <p>Wählen Sie Ihr Paket. Im Kundenkonto geben Sie Ihre Angaben ein, stimmen den <a href="/konfigurator-bedingungen/">Paketbedingungen</a> zu und bezahlen die Einrichtung bei Stripe; die Eingangsbestätigung kommt sofort per E-Mail.</p>\n  <div class="vk-knoepfe">' +
      P().LISTE.map((p, i) => '<a class="btn ' + (i === EMPFOHLEN ? 'primary' : 'ghost') + '" href="/partner/#bestellen/' + p + '">' + esc(P().PAKETE[p].name) + ' bestellen</a>').join('') +
      '</div>\n  <p class="rg-klein">Schon bestellt? <a href="/partner/">Zum Kundenkonto</a></p>\n  <h3 id="frage">Vorher eine Frage?</h3>\n  <p>Schreiben Sie uns; wir antworten in der Regel innerhalb eines Werktags, gern auch am Telefon.</p>' + formular() + '\n  ';
  }
  return '\n  <div class="vk-bald"><p class="eyebrow">Bestellung bald möglich</p><p>Die Pakete sind fertig, die Bestellung schalten wir in Kürze frei. Schreiben Sie uns, welches Paket Sie interessiert, oder stellen Sie Ihre Frage: Wir antworten in der Regel innerhalb eines Werktags und melden uns, sobald Sie bestellen können. Unverbindlich und kostenlos.</p></div>\n  <h3 id="frage">Paket unverbindlich anfragen</h3>' + formular() + '\n  ';
}
/* JSON-LD der Verkaufsseite: die drei Pakete als Angebote, netto (valueAddedTaxIncluded: false) */
function ld(o, v) {
  const b = o.base || '', liste = P().LISTE;
  const angebot = (p) => {
    const pr = P().preis(p), m = P().merkmale(p);
    const spez = (name, betrag, monat) => Object.assign({ '@type': 'UnitPriceSpecification', name: name, price: betrag.toFixed(2), priceCurrency: 'EUR', valueAddedTaxIncluded: false }, monat ? { billingDuration: 'P1M' } : {});
    return { '@type': 'Offer', name: P().PAKETE[p].name, description: kurzText(m) + ' Nur für Unternehmer, Preise netto' + (v.mwst ? ' zzgl. MwSt.' : '') + (v.vorlaeufig ? ', vorläufig' : '') + '.', price: pr.monat.toFixed(2), priceCurrency: 'EUR',
      availability: v.bestellen ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      priceSpecification: [spez('Monatlich', pr.monat, true), spez('Einrichtung, einmalig', pr.einrichtung, false)] };
  };
  const knoten = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', '@id': b + '/fuer-fensterbauer/#konfigurator', name: 'eeziframes Fenster-Konfigurator für Fensteranbieter', url: b + '/fuer-fensterbauer/',
    applicationCategory: 'BusinessApplication', applicationSubCategory: 'Fenster-Konfigurator unter der eigenen Domain', operatingSystem: 'Webbrowser', inLanguage: 'de-DE',
    description: 'Eigener Fenster-Konfigurator für Fensterbauer und Fensterhändler unter der eigenen Domain: Kunden planen ihre Fenster mit 3-D-Modell, Fotos und KI, der Betrieb bekommt jede Anfrage als Aufmaßblatt-PDF per E-Mail.',
    publisher: { '@type': 'Organization', name: 'eeziframes', url: b + '/' }, offers: liste.map(angebot) };
  return '<script type="application/ld+json">' + JSON.stringify(knoten).replace(/</g, '\\u003c') + '</script>';
}
/* Paketbedingungen: Leistungen je Paket (alle Merkmale außer Name und Preis) */
function leistungen() {
  const liste = P().LISTE, M = P().MERKMALE, ms = liste.map((p) => P().merkmale(p));
  const kopf = '<thead><tr><th>Leistung</th>' + liste.map((p) => '<th>' + esc(P().PAKETE[p].name) + '</th>').join('') + '</tr></thead>';
  const zeilen = Object.keys(M).filter((s) => s !== 'name' && s !== 'preis').map((s) => '<tr><td>' + esc(M[s].titel) + (M[s].text ? '<br><span class="klein">' + esc(M[s].text) + '</span>' : '') + '</td>' +
    ms.map((m, i) => '<td data-k="' + esc(P().PAKETE[liste[i]].name) + '">' + esc(wertText(s, m)) + '</td>').join('') + '</tr>');
  return '\n  <div class="tabelle"><table>' + kopf + '<tbody>' + zeilen.join('') + '</tbody></table></div>\n  ';
}
/* AV-Vertrag: Speicher- und Löschfristen je Paket (aus pakete.js und instanzregeln.js) */
export function fristenZeilen() {
  const F = R().FRISTEN, liste = P().LISTE, ms = liste.map((p) => P().merkmale(p));
  const je = (f) => ms.map(f);
  return [
    ['Gesendete Anfragen (Aufmaß, Kontakt, Aufmaßblatt)', je((m) => (m.aufbewahrung === 'vertrag' ? 'bis zum Vertragsende' : m.aufbewahrung + ' Tage nach bestätigter Zustellung der E-Mail'))],
    ['Originalfotos der Anfragen', je((m) => (m.aufbewahrung === 'vertrag' ? F.fotosSignatureTage + ' Tage nach dem Eingang' : 'mit der Anfrage'))],
    ['Link auf die Originalfotos in der E-Mail', je((m) => (m.fotoLinkTage ? m.fotoLinkTage + ' Tage gültig' : 'kein Link'))],
    ['Anfrage, deren E-Mail nie zugestellt wurde', je(() => F.unzustellbarTage + ' Tage nach dem Eingang')],
    ['Begonnene Planung ohne Fenster', je(() => F.entwurfLeerStunden + ' Stunden')],
    ['Begonnene Planung mit Fenster, nicht gesendet', je(() => F.entwurfStillTage + ' Tage nach der letzten Änderung')],
    ['Testanfragen (Vorschau, Demo)', je(() => F.testTage + (F.testTage === 1 ? ' Tag' : ' Tage'))],
    ['Alle Daten der Instanz nach Vertragsende', je(() => F.loeschenNachEndeTage + ' Tage nach dem Ende')],
    ['Sicherungskopien der Datenbank', je(() => '7 Tage (rollierend)')]
  ];
}
function fristen() {
  const liste = P().LISTE;
  const kopf = '<thead><tr><th>Daten</th>' + liste.map((p) => '<th>' + esc(P().PAKETE[p].name) + '</th>').join('') + '</tr></thead>';
  return '\n  <div class="tabelle"><table>' + kopf + '<tbody>' + fristenZeilen().map(([t, w]) => '<tr><td>' + esc(t) + '</td>' + w.map((x, i) => '<td data-k="' + esc(P().PAKETE[liste[i]].name) + '">' + esc(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>\n  ';
}
/* Einzelne Frist im Fließtext: <!--pakete:f-kulanzTage-->14<!--/pakete:f-kulanzTage--> */
const frist = (name) => { const s = name.slice(2), F = R().FRISTEN; return Object.prototype.hasOwnProperty.call(F, s) ? esc(F[s]) : ''; };
const stand = () => esc(standText(PAKET_STAND));
/* Links auf die PDFs der Fassung PAKET_STAND (scripts/bedingungen-pdf.mjs) */
const pdfs = () => paketPdfs().map((p, i) => '<a href="' + esc(p) + '">' + (i ? 'Vertrag zur Auftragsverarbeitung' : 'Paketbedingungen') + '</a>').join(' · ');

const BLOECKE = { karten: karten, vergleich: vergleich, ablauf: ablauf, demos: demos, bestellen: bestellen, ld: ld, leistungen: leistungen, fristen: fristen, stand: stand, pdfs: pdfs };

/* Alle Bausteine einer Seite einsetzen. o: { env, base } (base: Herkunft für absolute Adressen; '' in den Dateien) */
export function bausteineEinsetzen(html, o) {
  o = o || {};
  const v = verkaufFuer(o.env);
  return html.replace(/<!--pakete:([a-zA-Z0-9-]+)-->[\s\S]*?<!--\/pakete:\1-->/g, (alles, name) => {
    const neu = BLOECKE[name] ? BLOECKE[name](o, v) : /^f-/.test(name) ? frist(name) : null;
    return neu === null ? alles : '<!--pakete:' + name + '-->' + neu + '<!--/pakete:' + name + '-->';
  });
}
/* Fassung für die Datei in web/ (ohne Variablen, relative Adressen) */
export const bauen = (html) => bausteineEinsetzen(html, { env: {}, base: '' });

/* ---------- Haken für seo.js ---------- */
export const PAKETE_SEITEN = [{ pfad: '/konfigurator-bedingungen/', prio: '0.3', stand: PAKET_STAND }];

export function paketeSeite(html, url, env) {
  if (typeof html !== 'string' || html.indexOf('<!--pakete:') < 0) return html;
  try { return bausteineEinsetzen(html, { env: env || {}, base: basisVon(env, url) }); } catch (e) { console.log('pakete-seite: ' + (e && e.message)); return html; }
}

/* Absatz für llms.txt: Pakete mit Preisen aus pakete.js, Ablauf, Links */
export function paketeLlms(origin, env) {
  const v = verkaufFuer(env), liste = P().LISTE, u = (pfad) => origin + pfad;
  const eur = (n) => zahl(n) + ' €';
  const zeile = (p) => { const m = P().merkmale(p), pr = P().preis(p); return P().PAKETE[p].name + ': ' + eur(pr.monat) + ' im Monat, dazu ' + eur(pr.einrichtung) + ' Einrichtung (' + kurzText(m).replace(/\.$/, '') + ')'; };
  return [
    '## Konfigurator-Pakete für Fensteranbieter',
    '',
    '- Eigener Fenster-Konfigurator unter der eigenen Domain eines Fensterbauers oder Fensterhändlers (z. B. ihr-name-fenster.de), ohne eigene Programmierung: Interessenten planen ihre Fenster selbst (3-D-Modell, KI-Auswertung der Fotos mit Einwilligung, Klärungsliste, Zeichnung), jede Anfrage kommt als Aufmaßblatt-PDF per E-Mail beim Betrieb an. eeziframes richtet den Konfigurator ein und betreibt ihn.',
    '- Drei Pakete, nur für Unternehmer, Preise ' + (v.mwst ? 'netto zuzüglich Mehrwertsteuer' : 'ohne Ausweis der Umsatzsteuer') + (v.vorlaeufig ? ' (vorläufig)' : '') + ': ' + liste.map(zeile).join('; ') + '.',
    '- Ablauf: ' + R().bestellung.LEISTE.map((s) => s.titel).join(' → ') + '; meist 3 bis 5 Werktage nach der Zahlung. Die Einrichtung wird vorab bezahlt, das Monatsabo beginnt mit dem Livegang.' + (v.bestellen ? '' : ' Die Bestellung wird in Kürze freigeschaltet; bis dahin unverbindliche Anfrage über die Seite.'),
    '- [Für Fensterbauer: Pakete, Ablauf, Bestellung](' + u('/fuer-fensterbauer/') + '): Idee, Vergleich der Pakete, häufige Fragen',
    '- [Paketbedingungen und AV-Vertrag](' + u('/konfigurator-bedingungen/') + '): Fassung vom ' + standText(PAKET_STAND) + ', Entwurf zur anwaltlichen Prüfung'
  ].join('\n');
}

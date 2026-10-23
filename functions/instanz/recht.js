/* eeziframes · Impressum und Datenschutzerklärung einer Instanz (Strang F, Bauplan §3 F.3; Vertrag docs/INSTANZEN.md)
   Feste Exportnamen:
     impressumSeite(inst) → HTML-Dokument   datenschutzSeite(inst) → HTML-Dokument   rechtVollstaendig(recht) → { ok, fehlt: [Feld …] }
     AUFSICHT (Datenschutz-Aufsichtsbehörden der 16 Länder), aufsichtFuer(bundesland), speicherFristen(m), VORLAGE
   inst: ctx.instanz (docs/INSTANZEN.md), gebraucht werden name, recht, m (Merkmale), kontakt.
   instanzen.recht: { firma, rechtsform, vertretung, strasse, plz, ort, land, tel, mail, register, ust, kammer, beruf, bundesland, stand }
   Regeln:
   - Verantwortlich für die Anfragen ist der Betrieb; der technische Dienstleister (eeziframes) ist sein Auftragsverarbeiter. Bei
     rechtNennung 'name' (Essential, Plus) steht er mit Namen und Anschrift da, bei 'kategorie' (Signature) nur als „technischer
     Dienstleister“; die Unterauftragnehmer stehen in jedem Paket mit Namen da (AV-Vertrag § 8, EuGH C-154/21). Auf Signature-Instanzen
     erscheint „eeziframes“ nirgends.
   - Fristen kommen nur aus web/assets/pakete.js (aufbewahrung, fotoLinkTage, dashboard, einladungslinks) und
     web/assets/instanzregeln.js (FRISTEN), dieselben wie im AV-Vertrag (functions/pakete-seite.js fristenZeilen).
   - Alle Werte laufen durch esc().
   - VORLAGE: Fassung der Vorlage. Solange sie nicht anwaltlich geprüft ist (geprueft: false), steht unter beiden Seiten sichtbar
     „Vorlage vom …, anwaltliche Prüfung ausstehend“ (Bauplan §5.3 F4); nach der Prüfung geprueft: true und den Stand setzen. */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import { ANBIETER } from '../api/anbieter.js';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const R = () => globalThis.Instanzregeln;

export const VORLAGE = { stand: '2026-10-23', geprueft: false };
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const datum = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? Number(m[3]) + '. ' + MONATE[Number(m[2]) - 1] + ' ' + m[1] : String(iso || ''); };

/* Datenschutz-Aufsichtsbehörden für nicht-öffentliche Stellen, je Land (Sitz des Betriebs). Anschriften vor dem Start prüfen
   (docs/INSTANZEN.md, Teil 2); die Bezeichnung steht ohne Artikel, weil er mit der Person wechselt. */
export const AUFSICHT = {
  BW: { name: 'Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg', anschrift: 'Lautenschlagerstraße 20, 70173 Stuttgart', web: 'https://www.baden-wuerttemberg.datenschutz.de/' },
  BY: { name: 'Bayerisches Landesamt für Datenschutzaufsicht', anschrift: 'Promenade 18, 91522 Ansbach', web: 'https://www.lda.bayern.de/' },
  BE: { name: 'Berliner Beauftragte für Datenschutz und Informationsfreiheit', anschrift: 'Alt-Moabit 59–61, 10555 Berlin', web: 'https://www.datenschutz-berlin.de/' },
  BB: { name: 'Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg', anschrift: 'Stahnsdorfer Damm 77, 14532 Kleinmachnow', web: 'https://www.lda.brandenburg.de/' },
  HB: { name: 'Landesbeauftragte für Datenschutz und Informationsfreiheit der Freien Hansestadt Bremen', anschrift: 'Arndtstraße 1, 27570 Bremerhaven', web: 'https://www.datenschutz.bremen.de/' },
  HH: { name: 'Hamburgische Beauftragte für Datenschutz und Informationsfreiheit', anschrift: 'Ludwig-Erhard-Straße 22, 20459 Hamburg', web: 'https://datenschutz-hamburg.de/' },
  HE: { name: 'Hessische Beauftragte für Datenschutz und Informationsfreiheit', anschrift: 'Gustav-Stresemann-Ring 1, 65189 Wiesbaden', web: 'https://datenschutz.hessen.de/' },
  MV: { name: 'Landesbeauftragte für Datenschutz und Informationsfreiheit Mecklenburg-Vorpommern', anschrift: 'Werderstraße 74a, 19055 Schwerin', web: 'https://www.datenschutz-mv.de/' },
  NI: { name: 'Landesbeauftragte für den Datenschutz Niedersachsen', anschrift: 'Prinzenstraße 5, 30159 Hannover', web: 'https://www.lfd.niedersachsen.de/' },
  NW: { name: 'Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen', anschrift: 'Kavalleriestraße 2–4, 40213 Düsseldorf', web: 'https://www.ldi.nrw.de/' },
  RP: { name: 'Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz', anschrift: 'Hintere Bleiche 34, 55116 Mainz', web: 'https://www.datenschutz.rlp.de/' },
  SL: { name: 'Unabhängiges Datenschutzzentrum Saarland', anschrift: 'Fritz-Dobisch-Straße 12, 66111 Saarbrücken', web: 'https://www.datenschutz.saarland.de/' },
  SN: { name: 'Sächsische Datenschutz- und Transparenzbeauftragte', anschrift: 'Devrientstraße 5, 01067 Dresden', web: 'https://www.datenschutz.sachsen.de/' },
  ST: { name: 'Landesbeauftragte für den Datenschutz Sachsen-Anhalt', anschrift: 'Otto-von-Guericke-Straße 34a, 39104 Magdeburg', web: 'https://datenschutz.sachsen-anhalt.de/' },
  SH: { name: 'Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein', anschrift: 'Holstenstraße 98, 24103 Kiel', web: 'https://www.datenschutzzentrum.de/' },
  TH: { name: 'Thüringer Landesbeauftragte für den Datenschutz und die Informationsfreiheit', anschrift: 'Häßlerstraße 8, 99096 Erfurt', web: 'https://www.tlfdi.de/' }
};
export const aufsichtFuer = (bl) => (Object.prototype.hasOwnProperty.call(AUFSICHT, bl) ? AUFSICHT[bl] : null);

/* Unterauftragnehmer des technischen Dienstleisters (wie im AV-Vertrag, /konfigurator-bedingungen/#avv-unterauftragnehmer) */
const UNTER = [
  ['Cloudflare, Inc., San Francisco, USA', 'Auslieferung der Seiten, Server-Programm, Zwischenspeicher, Domain und DNS', 'weltweit verteilt; EU-US Data Privacy Framework (Art. 45 DSGVO), ergänzend Standardvertragsklauseln'],
  ['Supabase Inc., USA (Server in Frankfurt am Main)', 'Datenbank, Ablage der Fotos und Aufmaßblätter', 'Frankfurt am Main (EU); Standardvertragsklauseln für Zugriffe aus Drittländern (Support)'],
  ['Plus Five Five, Inc. (Resend), 2261 Market Street #5039, San Francisco, CA 94114, USA', 'Versand der E-Mails mit Ihrer Anfrage, Zustellprotokolle (30 Tage)', 'USA; EU-US Data Privacy Framework (Art. 45 DSGVO), ergänzend Standardvertragsklauseln'],
  ['Anthropic Ireland, Limited, Dublin, Irland', 'KI-Auswertung der Fotos, nur mit Ihrer Einwilligung; keine Nutzung zum Training, Löschung spätestens nach 30 Tagen', 'Irland und USA; Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO)']
];

/* Pflichtangaben nach § 5 DDG, soweit für jeden Betrieb nötig (Register, USt-IdNr., Kammer nur, wenn vorhanden) */
const PFLICHT = [['firma', 'Firma'], ['rechtsform', 'Rechtsform'], ['vertretung', 'Vertretungsberechtigte Person'], ['strasse', 'Straße'], ['plz', 'Postleitzahl'], ['ort', 'Ort'], ['tel', 'Telefon'], ['mail', 'E-Mail'], ['bundesland', 'Bundesland']];
export function rechtVollstaendig(recht) {
  const r = recht || {}, fehlt = PFLICHT.filter(([k]) => !String(r[k] || '').trim()).map(([, t]) => t);
  if (r.mail && !R().mailOk(r.mail)) fehlt.push('gültige E-Mail');
  return { ok: !fehlt.length, fehlt: fehlt };
}

/* ---------- Seite ---------- */
function seite(inst, titel, inhalt) {
  const name = (inst && inst.name) || '';
  return '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(titel + (name ? ' · ' + name : '')) + '</title>\n<meta name="robots" content="noindex">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="stylesheet" href="/fonts/fonts.css">\n' +
    '<style>:root{color-scheme:dark}body{margin:0;background:#161616;color:#f3f2ee;font:500 17px/1.6 Inter,system-ui,sans-serif}main{max-width:760px;margin:0 auto;padding:32px 16px 64px}' +
    'h1{font-size:32px;line-height:1.15;font-weight:800;letter-spacing:-.02em;margin:8px 0 24px}h2{font-size:20px;line-height:1.3;font-weight:800;margin:32px 0 8px}p,address,li{margin:0 0 12px;color:#c9c8c3;font-style:normal}ul{padding-left:20px;margin:0 0 12px}' +
    'a{color:#f3f2ee;text-underline-offset:2px}.klein{font-size:13px;color:#93928d}.karte{border:2px solid #2b2b2b;border-radius:24px;padding:16px 20px;background:#1f1f1f;margin:0 0 16px}.karte p:last-child{margin:0}' +
    'nav{display:flex;flex-wrap:wrap;gap:4px 16px}nav a{font-size:15px;min-height:44px;display:inline-flex;align-items:center}' +
    '.tabelle{overflow-x:auto;margin:0 0 16px;border:2px solid #2b2b2b;border-radius:16px;background:#1f1f1f}table{width:100%;border-collapse:collapse;font-size:15px;line-height:1.45}' +
    'th,td{padding:10px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #2b2b2b;color:#c9c8c3}tr:last-child td{border-bottom:0}th{font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#93928d}' +
    '@media (max-width:600px){h1{font-size:28px}table,tbody,tr,td{display:block}thead{display:none}tr{padding:10px 12px;border-bottom:1px solid #2b2b2b}td{padding:0;border:0}td+td{margin-top:4px}td[data-k]::before{content:attr(data-k);display:block;font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#93928d}}' +
    '</style>\n</head>\n<body>\n<main>\n<nav aria-label="Rechtliches"><a href="/">Zur Startseite</a><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a></nav>\n' + inhalt +
    '\n<p class="klein">' + (VORLAGE.geprueft ? 'Fassung vom ' + esc(datum(VORLAGE.stand)) : 'Vorlage vom ' + esc(datum(VORLAGE.stand)) + ', anwaltliche Prüfung ausstehend') + '</p>\n</main>\n</body>\n</html>\n';
}
const zeile = (label, wert) => (String(wert || '').trim() ? '<p>' + esc(label) + ': ' + esc(wert) + '</p>\n' : '');
const firmaVon = (inst) => { const r = (inst && inst.recht) || {}; return [r.firma || (inst && inst.name) || '', r.rechtsform && !String(r.firma || '').includes(r.rechtsform) ? r.rechtsform : ''].filter(Boolean).join(' '); };
const anschrift = (r) => [r.strasse, [r.plz, r.ort].filter(Boolean).join(' ')].filter((x) => String(x || '').trim());
const telLink = (tel) => '<a href="tel:' + esc(String(tel).replace(/[^\d+]/g, '')) + '">' + esc(tel) + '</a>';
const mailLink = (mail) => '<a href="mailto:' + esc(mail) + '">' + esc(mail) + '</a>';
const tabelle = (kopf, zeilen) => '<div class="tabelle"><table><thead><tr>' + kopf.map((k) => '<th>' + esc(k) + '</th>').join('') + '</tr></thead><tbody>' +
  zeilen.map((z) => '<tr>' + z.map((c, i) => '<td' + (i ? ' data-k="' + esc(kopf[i]) + '"' : '') + '>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>\n';

/* ---------- Impressum (§ 5 DDG) ---------- */
export function impressumSeite(inst) {
  const r = (inst && inst.recht) || {}, firma = firmaVon(inst);
  const bl = r.bundesland && R().BUNDESLAENDER[r.bundesland] ? R().BUNDESLAENDER[r.bundesland] : '';
  const tel = String(r.tel || '').trim(), mail = String(r.mail || '').trim();
  const inhalt = '<p class="klein">Angaben nach § 5 DDG</p>\n<h1>Impressum</h1>\n' +
    '<div class="karte"><address><strong>' + esc(firma) + '</strong><br>' + anschrift(r).map(esc).join('<br>') + '<br>' + esc(r.land === 'AT' ? 'Österreich' : 'Deutschland') + '</address></div>\n' +
    (r.vertretung ? '<h2>Vertreten durch</h2>\n<p>' + esc(r.vertretung) + '</p>\n' : '') +
    '<h2>Kontakt</h2>\n<p>' + (tel ? 'Telefon: ' + telLink(tel) + (mail ? '<br>' : '') : '') + (mail ? 'E-Mail: ' + mailLink(mail) : '') + '</p>\n' +
    (r.register ? '<h2>Registereintrag</h2>\n<p>' + esc(r.register) + '</p>\n' : '') +
    (r.ust ? '<h2>Umsatzsteuer</h2>\n<p>Umsatzsteuer-Identifikationsnummer nach § 27a UStG: ' + esc(r.ust) + '</p>\n' : '') +
    (r.kammer || r.beruf ? '<h2>Berufsangaben</h2>\n' + zeile('Zuständige Kammer', r.kammer) + zeile('Berufsbezeichnung', r.beruf ? r.beruf + ' (verliehen in Deutschland)' : '') +
      (r.kammer && /handwerk/i.test(r.kammer) ? '<p>Berufsrechtliche Regelung: Gesetz zur Ordnung des Handwerks (Handwerksordnung), nachzulesen unter <a href="https://www.gesetze-im-internet.de/hwo/">gesetze-im-internet.de/hwo</a>.</p>\n' : '') : '') +
    (bl ? '<p class="klein">Sitz: ' + esc(bl) + '</p>\n' : '') +
    (r.stand ? '<p class="klein">Stand der Angaben: ' + esc(datum(r.stand)) + '</p>\n' : '');
  return seite(inst, 'Impressum', inhalt);
}

/* ---------- Speicherfristen dieser Instanz (aus pakete.js und instanzregeln.js) ---------- */
export function speicherFristen(m) {
  const F = R().FRISTEN, tage = (n) => n + (Number(n) === 1 ? ' Tag' : ' Tage');
  const z = [
    ['Begonnene Planung ohne Fenster', F.entwurfLeerStunden + ' Stunden nach dem Beginn'],
    ['Begonnene Planung, nicht gesendet (samt Fotos)', tage(F.entwurfStillTage) + ' nach der letzten Änderung'],
    ['Gesendete Anfrage auf dem Server (Planung, Kontakt, Fotos, Aufmaßblatt)', m.aufbewahrung === 'vertrag'
      ? 'solange dieser Konfigurator betrieben wird; die Originalfotos ' + tage(F.fotosSignatureTage) + ' nach dem Eingang'
      : tage(m.aufbewahrung) + ' nachdem die E-Mail an uns zugestellt wurde'],
    ['Anfrage, deren E-Mail uns nicht erreicht', 'höchstens ' + tage(F.unzustellbarTage) + ' nach dem Eingang']
  ];
  if (Number(m.fotoLinkTage) > 0) z.push(['Link auf die Originalfotos in unserer E-Mail', tage(m.fotoLinkTage) + ' gültig']);
  z.push(['Ihre Anfrage in unserem Postfach', 'solange wir sie für Angebot und Auftrag brauchen und gesetzliche Pflichten es verlangen']);
  z.push(['Alle Daten dieses Konfigurators, wenn wir ihn nicht mehr betreiben', tage(F.loeschenNachEndeTage) + ' nach dem Ende']);
  z.push(['Sicherungskopien der Datenbank', '7 Tage (rollierend)']);
  return z;
}

/* ---------- Datenschutzerklärung ---------- */
export function datenschutzSeite(inst) {
  const r = (inst && inst.recht) || {}, m = (inst && inst.m) || {}, F = R().FRISTEN, name = firmaVon(inst);
  const kategorie = m.rechtNennung === 'kategorie';
  const tel = String(r.tel || (inst && inst.kontakt && inst.kontakt.tel) || '').trim(), mail = String(r.mail || (inst && inst.kontakt && inst.kontakt.mail) || '').trim();
  const dl = kategorie ? 'unser technischer Dienstleister' : 'eeziframes (' + ANBIETER.name + ', ' + ANBIETER.strasse + ', ' + ANBIETER.ort + ')';
  const dlKurz = kategorie ? 'unser technischer Dienstleister' : 'eeziframes';
  const aufsicht = aufsichtFuer(r.bundesland), land = R().BUNDESLAENDER[r.bundesland] || '';
  const vertrag = m.aufbewahrung === 'vertrag';
  let n = 0; const h = (t, id) => '<h2' + (id ? ' id="' + id + '"' : '') + '>' + (++n) + '. ' + esc(t) + '</h2>\n';

  const inhalt = '<h1>Datenschutzerklärung</h1>\n' +
    '<div class="karte"><p><strong>Kurz gesagt:</strong> Hier planen Sie Ihre Fenster und schicken uns eine Anfrage. Was Sie eingeben, nutzen wir nur, um Ihre Anfrage zu beantworten und Ihnen ein Angebot zu machen. ' +
      'Den Konfigurator betreibt ' + esc(dlKurz) + ' in unserem Auftrag. Fotos werden nur mit Ihrer Einwilligung per KI ausgewertet. Es gibt keine Werbung, kein Tracking und keine Cookies für Analyse.</p></div>\n' +

    h('Verantwortlich', 'verantwortlich') +
    '<p>' + esc(name) + (anschrift(r).length ? ', ' + anschrift(r).map(esc).join(', ') : '') + (r.vertretung ? ', vertreten durch ' + esc(r.vertretung) : '') + '<br>' +
      (tel ? 'Telefon: ' + telLink(tel) + (mail ? ', ' : '') : '') + (mail ? 'E-Mail: ' + mailLink(mail) : '') + '</p>\n' +
    '<p>Weitere Angaben stehen im <a href="/impressum/">Impressum</a>. An diese Adresse wenden Sie sich auch mit allen Fragen zum Datenschutz.</p>\n' +

    h('Aufruf dieser Seiten', 'aufruf') +
    '<p>Beim Aufruf verarbeitet unser Hosting-Dienstleister Cloudflare technisch notwendige Daten wie IP-Adresse, Zeitpunkt, aufgerufene Adresse und Browser-Kennung, um die Seiten auszuliefern und vor Angriffen zu schützen. Zugriffsprotokolle mit IP-Adressen werden nicht gespeichert. Gegen Missbrauch zählt der Server kurzzeitig, wie viele Anfragen von einem Anschluss kommen; diese Zählung liegt nur im Arbeitsspeicher und verfällt spätestens nach einem Tag. Wie oft der Konfigurator aufgerufen und genutzt wird, zählt der Server nur als Summe je Tag, ohne Cookies und ohne Angaben zu Personen. Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren Auslieferung (Art. 6 Abs. 1 lit. f DSGVO).</p>\n' +

    h('Speicherung in Ihrem Browser und Cookies', 'browser') +
    '<p>Der Konfigurator speichert Ihre Planung im lokalen Speicher Ihres Browsers (localStorage), Ihre Fotos verkleinert in einer Datenbank Ihres Browsers (IndexedDB), damit nichts verloren geht, wenn Sie die Seite neu laden. Das ist für den Dienst, den Sie nutzen, unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. b DSGVO). Sie löschen diese Daten, indem Sie in Ihrem Browser die Website-Daten für diese Seite entfernen.</p>\n' +
    '<p>Cookies für Werbung, Tracking oder Analyse gibt es nicht. Technisch notwendige Cookies gibt es nur in zwei Fällen: <code>__Host-vorschau</code>, wenn wir eine Vorschau des Konfigurators über einen Vorschau-Link öffnen (höchstens ' + esc(F.vorschauTage) + ' Tage)' +
      (m.dashboard ? ', und <code>__Host-betrieb</code> für die Anmeldung unserer Mitarbeiter im geschützten Bereich (höchstens ' + esc(F.sitzungTage) + ' Tage)' : '') + '. Beide sind nur über HTTPS erreichbar und für Skripte nicht lesbar (§ 25 Abs. 2 Nr. 2 TDDDG). ' +
      'Zum Schutz vor Angriffen kann Cloudflare in Ausnahmefällen eigene, technisch notwendige Cookies setzen (<code>__cf_bm</code>, <code>cf_clearance</code>, in der Regel 30 Minuten).</p>\n' +

    h('Ihre Planung und Ihre Anfrage', 'anfrage') +
    '<p>Damit Sie jederzeit weitermachen können, auch auf einem anderen Gerät, und damit Ihre Anfrage vollständig bei uns ankommt, speichert der Server Ihre Planung (Fenster, Maße, Wünsche, Notizen, Angaben zum Haus) und Ihre Fotos schon während der Planung. ' +
      'Wenn Sie auf „Senden“ tippen, kommen Ihre Kontaktangaben dazu (Name, Telefon oder E-Mail, auf Wunsch die Zeit, zu der Sie am besten erreichbar sind, und die Adresse des Objekts). Wir bekommen die Anfrage als E-Mail mit dem Aufmaßblatt als PDF; antworten wir darauf, geht die Antwort direkt an Sie. ' +
      'Nach dem Senden können Sie Ihre Anfrage als PDF behalten; diese Kopie entsteht in Ihrem Browser.</p>\n' +
    '<p>Rechtsgrundlage ist die Anbahnung eines Vertrags mit Ihnen (Art. 6 Abs. 1 lit. b DSGVO). Ihre Angaben sind freiwillig; ohne Kontaktangaben können wir Ihnen nicht antworten.</p>\n' +
    (m.einladungslinks ? '<p><strong>Persönliche Einladung.</strong> Laden wir Sie mit einem persönlichen Link ein, legen wir dafür Ihren Namen und Ihre Kontaktangaben an. Wir sehen dann, ob Sie den Link geöffnet haben und wie weit Ihre Planung ist (eingeladen, in Bearbeitung, eingereicht), Ihre Angaben und Fotos aber erst, wenn Sie senden. Rechtsgrundlage ist ebenfalls Art. 6 Abs. 1 lit. b DSGVO.</p>\n' : '') +

    h('Fotos und KI-Auswertung (freiwillig)', 'ki') +
    '<p>Wenn Sie ausdrücklich einwilligen, werden Ihre Fotos durch eine KI ausgewertet, damit wir die Einbausituation besser einschätzen können (etwa Rollladenkasten, Anschlag, Fensterbank). Dafür gehen die Fotos an Anthropic (Anthropic Ireland, Limited, Dublin, Irland). Anthropic nutzt sie nicht zum Training und löscht sie spätestens nach 30 Tagen. ' +
      'Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen, im Konfigurator oder mit einer Nachricht an uns; ohne Einwilligung planen Sie ganz normal weiter.</p>\n' +

    h('Dienstleister und Empfänger', 'empfaenger') +
    '<p>Den Konfigurator betreibt ' + esc(dl) + ' als unser Auftragsverarbeiter (Art. 28 DSGVO): Er stellt die Seiten bereit, speichert Planungen und Anfragen und schickt sie uns, nur nach unseren Weisungen und nach einem Vertrag zur Auftragsverarbeitung. ' +
      'Dabei setzt er diese Unterauftragnehmer ein:</p>\n' +
    tabelle(['Unterauftragnehmer', 'Leistung', 'Ort und Garantien'], UNTER) +
    '<p>Daten aus diesem Konfigurator gehen an niemanden sonst. Wir verkaufen sie nicht und nutzen sie nicht für Werbung.</p>\n' +

    h('Speicherdauer', 'speicherdauer') +
    '<p>Wir löschen Ihre Daten, sobald sie für den Zweck nicht mehr gebraucht werden. Auf dem Server des Konfigurators gelten diese Fristen:</p>\n' +
    tabelle(['Daten', 'Frist'], speicherFristen(m)) +
    (vertrag ? '<p>Unsere Mitarbeiter sehen Ihre Anfrage im geschützten Bereich, bis wir sie dort löschen; die Originalfotos löscht der Server nach der genannten Frist von selbst.</p>\n' : '') +
    '<p>Kommt ein Auftrag zustande, bewahren wir Angebot, Vertrag und Rechnung so lange auf, wie es Handels- und Steuerrecht verlangen (in der Regel sechs bis acht Jahre, § 257 HGB, § 147 AO).</p>\n' +

    h('Ihre Rechte', 'rechte') +
    '<p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine Einwilligung können Sie jederzeit widerrufen (Art. 7 Abs. 3). Schreiben Sie uns dazu an die Adresse oben.</p>\n' +
    '<div class="karte"><p><strong>Widerspruchsrecht (Art. 21 DSGVO).</strong> Verarbeitungen, die auf unserem berechtigten Interesse beruhen (Art. 6 Abs. 1 lit. f DSGVO), etwa der Schutz vor Missbrauch, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.</p></div>\n' +
    '<p>Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), insbesondere in dem Mitgliedstaat, in dem Sie wohnen oder arbeiten. ' +
      (aufsicht ? 'Für uns zuständig ist: ' + esc(aufsicht.name) + ', ' + esc(aufsicht.anschrift) + ', <a href="' + esc(aufsicht.web) + '">' + esc(aufsicht.web.replace(/^https:\/\//, '').replace(/\/$/, '')) + '</a>' + (land ? ' (' + esc(land) + ')' : '') + '.' : 'Für uns zuständig ist die Aufsichtsbehörde des Landes, in dem wir unseren Sitz haben.') + '</p>\n' +
    '<p>Automatisierte Entscheidungen im Sinne von Art. 22 DSGVO treffen wir nicht.</p>\n';
  return seite(inst, 'Datenschutz', inhalt);
}

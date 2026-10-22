/* eeziframes · Impressum und Datenschutz einer Instanz (Strang F baut die Datenschutzerklärung aus; Bauplan §3 F.3)
   Aus dem Fundament (S0): ein funktionierendes Impressum aus den Feldern in instanzen.recht und ein vorläufiger Datenschutzhinweis.
   Feste Exportnamen:
     impressumSeite(inst) → HTML-Dokument   datenschutzSeite(inst) → HTML-Dokument   rechtVollstaendig(recht) → { ok, fehlt: [Feld …] }
   inst: ctx.instanz (docs/INSTANZEN.md), gebraucht werden name, recht, m (Merkmale), kontakt.
   instanzen.recht: { firma, rechtsform, vertretung, strasse, plz, ort, land, tel, mail, register, ust, kammer, beruf, bundesland, stand }
   Alle Werte laufen durch esc(). Bei rechtNennung 'kategorie' (Signature) steht eeziframes nirgends, nur „technischer Dienstleister“. */
import '../../web/assets/instanzregeln.js';
import { ANBIETER } from '../api/anbieter.js';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const R = () => globalThis.Instanzregeln;

/* Pflichtangaben nach § 5 DDG, soweit für jeden Betrieb nötig (Register, USt-IdNr., Kammer nur, wenn vorhanden) */
const PFLICHT = [['firma', 'Firma'], ['rechtsform', 'Rechtsform'], ['vertretung', 'Vertretungsberechtigte Person'], ['strasse', 'Straße'], ['plz', 'Postleitzahl'], ['ort', 'Ort'], ['tel', 'Telefon'], ['mail', 'E-Mail'], ['bundesland', 'Bundesland']];
export function rechtVollstaendig(recht) {
  const r = recht || {}, fehlt = PFLICHT.filter(([k]) => !String(r[k] || '').trim()).map(([, t]) => t);
  if (r.mail && !R().mailOk(r.mail)) fehlt.push('gültige E-Mail');
  return { ok: !fehlt.length, fehlt: fehlt };
}

function seite(inst, titel, inhalt) {
  const name = (inst && inst.name) || '';
  return '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    '<title>' + esc(titel + (name ? ' · ' + name : '')) + '</title>\n<meta name="robots" content="noindex">\n<link rel="stylesheet" href="/fonts/fonts.css">\n' +
    '<style>:root{color-scheme:dark}body{margin:0;background:#161616;color:#f3f2ee;font:500 17px/1.6 Inter,system-ui,sans-serif}main{max-width:720px;margin:0 auto;padding:32px 16px 64px}' +
    'h1{font-size:32px;font-weight:800;margin:8px 0 24px}h2{font-size:20px;font-weight:800;margin:32px 0 8px}p,address{margin:0 0 12px;color:#c9c8c3;font-style:normal}' +
    'a{color:#f3f2ee}.klein{font-size:13px;color:#93928d}.karte{border:2px solid #2b2b2b;border-radius:24px;padding:16px 20px;background:#1f1f1f}nav a{margin-right:16px;font-size:15px}</style>\n' +
    '</head>\n<body>\n<main>\n<nav><a href="/">Zur Startseite</a><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a></nav>\n' + inhalt + '\n</main>\n</body>\n</html>\n';
}
const zeile = (label, wert) => (String(wert || '').trim() ? '<p>' + esc(label) + ': ' + esc(wert) + '</p>' : '');

export function impressumSeite(inst) {
  const r = (inst && inst.recht) || {}, firma = [r.firma || (inst && inst.name) || '', r.rechtsform && !String(r.firma || '').includes(r.rechtsform) ? r.rechtsform : ''].filter(Boolean).join(' ');
  const bl = r.bundesland && R().BUNDESLAENDER[r.bundesland] ? R().BUNDESLAENDER[r.bundesland] : '';
  const tel = String(r.tel || '').trim(), mail = String(r.mail || '').trim();
  const inhalt = '<p class="klein">Angaben nach § 5 DDG</p>\n<h1>Impressum</h1>\n' +
    '<div class="karte"><address><strong>' + esc(firma) + '</strong><br>' + esc(r.strasse || '') + '<br>' + esc([r.plz, r.ort].filter(Boolean).join(' ')) + '<br>' + esc(r.land === 'AT' ? 'Österreich' : 'Deutschland') + '</address></div>\n' +
    (r.vertretung ? '<h2>Vertreten durch</h2>\n<p>' + esc(r.vertretung) + '</p>\n' : '') +
    '<h2>Kontakt</h2>\n<p>' + (tel ? 'Telefon: <a href="tel:' + esc(tel.replace(/[^\d+]/g, '')) + '">' + esc(tel) + '</a><br>' : '') + (mail ? 'E-Mail: <a href="mailto:' + esc(mail) + '">' + esc(mail) + '</a>' : '') + '</p>\n' +
    (r.register ? '<h2>Registereintrag</h2>\n<p>' + esc(r.register) + '</p>\n' : '') +
    (r.ust ? '<h2>Umsatzsteuer</h2>\n<p>Umsatzsteuer-Identifikationsnummer nach § 27a UStG: ' + esc(r.ust) + '</p>\n' : '') +
    (r.kammer || r.beruf ? '<h2>Berufsangaben</h2>\n' + zeile('Zuständige Kammer', r.kammer) + zeile('Berufsbezeichnung', r.beruf ? r.beruf + ' (verliehen in Deutschland)' : '') : '') +
    (bl ? '<p class="klein">Sitz: ' + esc(bl) + '</p>\n' : '') +
    (r.stand ? '<p class="klein">Stand: ' + esc(r.stand) + '</p>\n' : '');
  return seite(inst, 'Impressum', inhalt);
}

/* Vorläufig (Strang F ersetzt sie durch die vollständige Erklärung mit Empfängern, Fristen, Rechten und Aufsichtsbehörde) */
export function datenschutzSeite(inst) {
  const r = (inst && inst.recht) || {}, m = (inst && inst.m) || {}, name = r.firma || (inst && inst.name) || '';
  const dienstleister = m.rechtNennung === 'kategorie' ? 'unseren technischen Dienstleister für diesen Konfigurator' : 'eeziframes (' + ANBIETER.name + ', ' + ANBIETER.ort.replace(/^\d{5}\s*/, '') + ') als technischen Dienstleister für diesen Konfigurator';
  const inhalt = '<h1>Datenschutz</h1>\n' +
    '<h2>Verantwortlich</h2>\n<p>' + esc(name) + ', ' + esc([r.strasse, [r.plz, r.ort].filter(Boolean).join(' ')].filter(Boolean).join(', ')) + (r.mail ? ', <a href="mailto:' + esc(r.mail) + '">' + esc(r.mail) + '</a>' : '') + '</p>\n' +
    '<h2>Ihre Anfrage</h2>\n<p>Wenn Sie hier Fenster planen und eine Anfrage senden, verarbeiten wir Ihre Angaben (Kontakt, Fenster, Maße, Fotos und Notizen), um Ihre Anfrage zu beantworten und Ihnen ein Angebot zu machen (Art. 6 Abs. 1 lit. b DSGVO). Die Auswertung von Fotos mit KI geschieht nur mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können.</p>\n' +
    '<p>Dafür setzen wir ' + esc(dienstleister) + ' und dessen Unterauftragnehmer für Betrieb, Speicherung, E-Mail-Versand und KI-Auswertung ein.</p>\n' +
    '<h2>Ihre Rechte</h2>\n<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Schreiben Sie uns dazu an die oben genannte Adresse.</p>\n' +
    '<p class="klein">Vorläufige Fassung. Die vollständige Datenschutzerklärung folgt.</p>\n';
  return seite(inst, 'Datenschutz', inhalt);
}

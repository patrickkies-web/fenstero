/* eeziframes · Mails der Vermittlung (docs/VERMITTLUNG.md, Abschnitt 10). Versand über post.js; hier nur Text und Rahmen (rahmen aus
   functions/auftrag/mails.js: weiße Karte, Systemschrift, eine schwarze Pille, Impressum im Fuß, kein Tracking).
   - inhaberMail: neue Anfrage an MAIL_KONTAKT, mit Aufmaßblatt im Anhang, Kunde, Eckdaten und den gewählten Betrieben samt Telefon
     (tel:-Link), Website und km, Link zur Zentrale
   - eingangMail: Bestätigung an den Kunden (Du-Form, ohne Aufmaßblatt)
   - betriebMail: an einen Betrieb, der im Gespräch zugestimmt hat (Sie-Form, sachlich, keine Werbung): seit 30.10.2026 ohne Anhang und
     ohne Kontaktdaten des Kunden, nur der Link in den Bereich für Fensterbauer (Inhaber: „die Daten von den Kunden nicht per E-Mail“)
   - kundeMail: freie Nachricht des Inhabers an den Kunden aus der Zentrale (Betreff und Text vom Inhaber, Du-Form, mit Anfragenummer)
   - freigeschaltetMail: an den Kunden, wenn ein Betrieb sein Aufmaß freigeschaltet hat (Du-Form; nur auf Wunsch des Inhabers) */
import { esc } from './post.js';
import { rahmen } from '../auftrag/mails.js';

const SCHRIFT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const absatz = (t) => '<p style="margin:0 0 14px;font:400 16px/1.55 ' + SCHRIFT + ';color:#3a3a3d">' + t + '</p>';
const titel2 = (t) => '<h2 style="margin:22px 0 4px;font:600 17px/1.3 ' + SCHRIFT + ';color:#07090a">' + esc(t) + '</h2>';
const pille = (url, t) => '<a href="' + esc(url) + '" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#07090a;color:#ffffff;font:600 15px/1 ' + SCHRIFT + ';text-decoration:none">' + esc(t) + '</a>';
const link = (href, t) => '<a href="' + esc(href) + '" style="color:#07090a">' + esc(t) + '</a>';
/* Tabelle: [Etikett, Wert als fertiges HTML] (Werte vorher mit esc oder link bauen) */
const zeilen = (paare) => '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:6px 0 14px">' + paare.filter(Boolean).map((p) =>
  '<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #ececef;font:400 14px/1.4 ' + SCHRIFT + ';color:#6b676c;width:38%;vertical-align:top">' + esc(p[0]) + '</td><td style="padding:8px 0;border-top:1px solid #ececef;font:500 14px/1.4 ' + SCHRIFT + ';color:#07090a;vertical-align:top">' + (p[1] || '–') + '</td></tr>').join('') + '</table>';
const NUR_INHABER = 'Nur für den Inhaber von eeziframes.';

/* Texte zu den Kürzeln der App (web/assets/app.js, Wahlen gebaeude, zeit, budget, foerdweg, erreich) */
const TEXTE = {
  gebaeude: { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Eigentumswohnung', denkmal: 'Denkmalschutz' },
  zeit: { asap: 'So bald wie möglich', '3m': 'In 1 bis 3 Monaten', '6m': 'In 3 bis 6 Monaten', '12m': 'Später, erst Angebote' },
  budget: { b1: 'bis 5.000 €', b2: '5.000 bis 10.000 €', b3: '10.000 bis 20.000 €', b4: 'über 20.000 €', b0: 'Weiß ich noch nicht' },
  foerdweg: { bafa: 'BAFA-Zuschuss', steuer: 'Steuerbonus', keine: 'Keine', offen: 'Noch offen' },
  erreich: { vm: 'Vormittags', nm: 'Nachmittags', ab: 'Abends' }
};
export const wert = (art, v) => { const s = String(v == null ? '' : v); return (TEXTE[art] || {})[s] || s; };
export const erreichText = (v) => (Array.isArray(v) ? v : String(v || '').split(/\s*,\s*/)).filter(Boolean).map((x) => wert('erreich', x)).join(', ');
/* Eckdaten als Zeilen [Etikett, Text] für Mails und Zentrale */
export function eckZeilen(e) {
  e = e || {};
  return [['Fenster', e.fenster ? String(e.fenster) : ''], ['Elemente', e.elemente ? String(e.elemente) : ''], ['Gebäude', wert('gebaeude', e.gebaeude)], ['Baujahr', e.baujahr ? String(e.baujahr) : ''],
    ['Start', wert('zeit', e.zeit)], ['Budget', wert('budget', e.budget)], ['Förderung', wert('foerdweg', e.foerdweg)]].filter((z) => z[1]);
}
export const telHref = (tel) => 'tel:' + String(tel || '').replace(/[^\d+]/g, '');
const telLink = (tel, anzeige) => (tel ? link(telHref(tel), anzeige || tel) : '–');
const leistungenText = (b) => (b.leistungen || []).join(', ');
const namenListe = (l) => (l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' und ' + l[l.length - 1]);

export function inhaberMail(v, o) {
  const k = v.kunde || {}, b = v.betriebe || [];
  const betriebe = b.length ? b.map((x) => zeilen([['Betrieb', '<b>' + esc(x.name) + '</b>'], ['Ort', esc(x.ort + (x.km != null ? ' · ' + x.km + ' km' : ''))], ['Telefon', telLink(x.tel)], ['Website', x.web ? link(x.web, x.web.replace(/^https?:\/\//, '').replace(/\/$/, '')) : '–'], x.strasse ? ['Straße', esc(x.strasse)] : null, ['Leistungen', esc(leistungenText(x))]])).join('')
    : absatz(esc('Kein Betrieb gewählt: „Betrieb für mich suchen“. Bitte einen Fensterfachbetrieb in der Nähe finden und anrufen.'));
  return { betreff: 'Neue Vermittlung ' + v.nr + ': ' + (k.name || '') + ', ' + v.plz + ' ' + (k.ort || ''), html: rahmen('Neue Vermittlung',
    absatz(esc(b.length ? 'Der Kunde hat ' + (b.length === 1 ? 'einen Betrieb' : b.length + ' Betriebe') + ' gewählt. Rufen Sie an und schicken Sie das Aufmaßblatt (Anhang) nur an die, die im Gespräch zustimmen; das geht in der Zentrale.' : 'Der Kunde möchte, dass wir einen Betrieb für ihn finden. Das Aufmaßblatt hängt an.')) +
    titel2('Kunde') + zeilen([['Anfrage', esc(v.nr)], ['Name', esc(k.name)], ['Telefon', telLink(k.tel, k.anzeige) + esc(v.bestaetigt ? ' (per Code bestätigt)' : ' (nicht bestätigt)')], ['E-Mail', k.mail ? link('mailto:' + k.mail, k.mail) : ''], ['Erreichbar', esc(erreichText(k.erreich))], ['Ort', esc(v.plz + ' ' + (k.ort || ''))]]) +
    titel2('Eckdaten') + zeilen(eckZeilen(v.eckdaten).map((z) => [z[0], esc(z[1])])) +
    titel2(b.length ? 'Gewählte Betriebe' : 'Betriebe') + betriebe +
    '<p style="margin:18px 0 0">' + pille(o.zentrale, 'In der Zentrale öffnen') + '</p>', NUR_INHABER) };
}

export function eingangMail(v) {
  const k = v.kunde || {}, namen = (v.betriebe || []).map((b) => b.name);
  const satz = namen.length ? 'Wir fragen bei ' + namenListe(namen) + ' an und schicken dein Aufmaß an die, die ein Angebot machen möchten; sie melden sich dann bei dir.'
    : 'Wir suchen bis zu fünf passende Fensterbetriebe in deiner Nähe und schicken dein Aufmaß an die, die ein Angebot machen möchten; sie melden sich dann bei dir.';
  return { betreff: 'Deine Anfrage ist da (' + v.nr + ')', html: rahmen('Danke, deine Anfrage ist da', absatz(esc('Hallo ' + (k.name || '') + ',')) + absatz(esc(satz)) +
    absatz(esc('Dein Aufmaßblatt hängt als PDF an, für deine Unterlagen. Die Angebote der Betriebe beruhen auf denselben Maßen und sind direkt vergleichbar.')) +
    absatz(esc('Wir melden uns bei dir unter ' + (k.anzeige || 'deiner Nummer') + ', falls wir noch etwas wissen müssen. Fragen? Antworte einfach auf diese E-Mail.')) +
    zeilen([['Anfrage', esc(v.nr)], ['Ort', esc(v.plz + ' ' + (k.ort || ''))], namen.length ? ['Betriebe', esc(namen.join(', '))] : null])) };
}

/* o: { link (Zugang im Bereich für Fensterbauer), bis (ISO, solange der Link gilt), preis (Text, z. B. „29 € zzgl. USt“), erstesFrei } */
export function betriebMail(v, b, o) {
  o = o || {};
  const k = v.kunde || {}, ort = v.plz + ' ' + (k.ort || ''), e = v.eckdaten || {}, bis = o.bis ? new Date(o.bis).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  return { betreff: 'Anfrage aus ' + (k.ort || v.plz) + ': Fenster (' + v.nr + ')', html: rahmen('Anfrage eines Hauseigentümers aus ' + (k.ort || v.plz),
    absatz(esc('Guten Tag,')) + absatz(esc('wie eben am Telefon besprochen, liegt die Anfrage eines Hauseigentümers aus ' + ort + ' für Sie bereit' + (e.fenster ? ': ' + e.fenster + (e.fenster === 1 ? ' Fenster' : ' Fenster') + (e.gebaeude ? ', ' + wert('gebaeude', e.gebaeude) : '') + (e.zeit ? ', ' + wert('zeit', e.zeit).toLowerCase() : '') : '') + '.')) +
    absatz(esc('Kontaktdaten und Aufmaßblatt sehen Sie in Ihrem Bereich bei eeziframes. Dort bestätigen Sie einmal kurz Ihre E-Mail-Adresse mit einem Code; so bleiben die Daten des Kunden geschützt.')) +
    (o.link ? '<p style="margin:18px 0 22px">' + pille(o.link, 'Anfrage ansehen') + '</p>' : '') +
    titel2('Eckdaten') + zeilen(eckZeilen(v.eckdaten).map((z) => [z[0], esc(z[1])]).concat([['Telefonnummer', esc(v.bestaetigt ? 'vom Kunden per Code bestätigt' : 'nicht bestätigt')], ['Ort', esc(ort)]])) +
    absatz(esc((o.erstesFrei ? 'Ihr erstes Aufmaß über eeziframes ist kostenlos. ' : '') + 'Jedes weitere Aufmaß kostet ' + (o.preis || '29 € zzgl. USt') + ' und wird erst fällig, wenn Sie es freischalten.' + (bis ? ' Der Link gilt bis zum ' + bis + '.' : ''))) +
    absatz(esc('Der Kunde hat eingewilligt, dass wir seine Angaben für diese Anfrage an Sie weitergeben. Bitte nutzen Sie sie nur dafür.')) +
    absatz(esc('Vermittelt von eeziframes (Anfrage ' + v.nr + ').'))) };
}
/* Freie Nachricht des Inhabers an den Kunden (Zentrale, Abschnitt Kunde): Betreff und Absätze so, wie er sie schreibt */
export function kundeMail(v, o) {
  const k = v.kunde || {}, betreff = String(o.betreff || 'Zu deiner Anfrage ' + v.nr).trim(), text = String(o.text || '').trim();
  const absaetze = text.split(/\n{2,}/).map((t) => absatz(esc(t).replace(/\n/g, '<br>'))).join('');
  return { betreff: betreff, html: rahmen(betreff, absatz(esc('Hallo ' + (k.name || '') + ',').replace(' ,', ',')) + absaetze + absatz(esc('Fragen? Antworte einfach auf diese E-Mail.')) + zeilen([['Anfrage', esc(v.nr)]])) };
}
/* An den Kunden, wenn ein Betrieb sein Aufmaß freigeschaltet hat */
export function freigeschaltetMail(v, b) {
  const k = v.kunde || {};
  return { betreff: b.name + ' hat dein Aufmaß (' + v.nr + ')', html: rahmen(b.name + ' hat dein Aufmaß', absatz(esc('Hallo ' + (k.name || '') + ',').replace(' ,', ',')) +
    absatz(esc(b.name + ' aus ' + (b.ort || 'deiner Nähe') + ' hat dein Aufmaß gerade abgerufen und meldet sich bei dir' + (k.anzeige ? ', meist telefonisch unter ' + k.anzeige : '') + '.')) +
    zeilen([['Betrieb', esc(b.name)], ['Ort', esc(b.ort || '')], b.web ? ['Website', link(b.web, b.web.replace(/^https?:\/\//, '').replace(/\/$/, ''))] : null]) +
    absatz(esc('Fragen? Antworte einfach auf diese E-Mail.'))) };
}


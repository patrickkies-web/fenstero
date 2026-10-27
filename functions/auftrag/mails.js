/* eeziframes · Mails der Aufträge: Anmeldecode, Bestellbestätigung (mit Paketbedingungen und AV-Vertrag als PDF), Meldung an den Inhaber,
   Stand des Auftrags und neue Nachrichten. Versand über post.js (Resend oder MAIL_ATTRAPPE); hier nur Text und Rahmen.
   Rahmen: weiße Karte auf hellem Grund, Systemschrift (Mailprogramme laden keine eigenen Schriften), eine schwarze Pille als Handlung,
   Violett nur als Zustand. Kein Bild, kein nachgeladener Inhalt, kein Tracking. */
import { esc } from '../api/post.js';

const SCHRIFT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const pille = (url, text) => '<a href="' + esc(url) + '" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#07090a;color:#ffffff;font:600 15px/1 ' + SCHRIFT + ';text-decoration:none">' + esc(text) + '</a>';
const absatz = (t) => '<p style="margin:0 0 14px;font:400 16px/1.55 ' + SCHRIFT + ';color:#3a3a3d">' + t + '</p>';
const zeilen = (paare) => '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:6px 0 18px">' + paare.filter(Boolean).map((p) =>
  '<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #ececef;font:400 14px/1.4 ' + SCHRIFT + ';color:#6b676c;width:42%;vertical-align:top">' + esc(p[0]) + '</td><td style="padding:8px 0;border-top:1px solid #ececef;font:500 14px/1.4 ' + SCHRIFT + ';color:#07090a;vertical-align:top">' + esc(p[1] || '–') + '</td></tr>').join('') + '</table>';

export function rahmen(titel, inhalt, fuss) {
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light"><title>' + esc(titel) + '</title></head>' +
    '<body style="margin:0;padding:0;background:#f2f2f4"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#f2f2f4"><tr><td align="center" style="padding:28px 14px">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:24px"><tr><td style="padding:30px 26px 26px">' +
    '<p style="margin:0 0 22px;font:400 17px/1 ' + SCHRIFT + ';color:#07090a;letter-spacing:-.01em"><b style="font-weight:800">eezi</b>frames</p>' +
    '<h1 style="margin:0 0 16px;font:600 24px/1.2 ' + SCHRIFT + ';color:#07090a;letter-spacing:-.02em">' + esc(titel) + '</h1>' + inhalt +
    '</td></tr></table><p style="margin:18px 0 0;font:400 12px/1.5 ' + SCHRIFT + ';color:#6b676c;max-width:520px">' + (fuss || 'eeziframes · Konfigurator für Ihre Website') + '</p></td></tr></table></body></html>';
}

export function codeMail(code) {
  const c = String(code).replace(/(\d{3})(\d{3})/, '$1 $2');
  return { betreff: 'Ihr Code: ' + c, html: rahmen('Ihr Code für eeziframes', absatz('Geben Sie diesen Code auf der Seite ein, um sich anzumelden. Er gilt 15 Minuten.') +
    '<p style="margin:6px 0 18px;font:300 40px/1 ' + SCHRIFT + ';letter-spacing:.06em;color:#07090a">' + esc(c) + '</p>' + absatz('Sie haben keinen Code angefordert? Dann können Sie diese Mail einfach löschen.')) };
}

/* Bestätigung an den Kunden direkt nach dem Bestellen (mit beiden PDFs als Anhang, dauerhafter Datenträger) */
export function bestelltMail(a, o) {
  const b = (a.angaben || {}).betrieb || {}, pr = a.preise || {};
  return { betreff: 'Ihre Bestellung ' + a.nr + ': ' + o.paketName, html: rahmen('Danke für Ihre Bestellung', absatz('Wir haben Ihre Bestellung erhalten und beginnen mit Ihrer Seite, sobald die Einrichtung bezahlt ist. Den Stand sehen Sie jederzeit in Ihrem Kundenbereich.') +
    zeilen([['Bestellung', a.nr], ['Paket', o.paketName], ['Unternehmen', b.firma], ['Adresse', o.adresse], ['Einrichtung', o.einrichtung], ['Monatlich ab Livegang', o.monat], o.ki ? ['KI-Auswertungen', o.ki] : null, ['Paketbedingungen', 'Fassung vom ' + o.stand]].filter(Boolean)) +
    absatz('Die Paketbedingungen und den Vertrag zur Auftragsverarbeitung finden Sie als PDF im Anhang.') + '<p style="margin:8px 0 0">' + pille(o.konto, 'Zum Kundenbereich') + '</p>') };
}

export function inhaberNeuMail(a, o) {
  const b = (a.angaben || {}).betrieb || {};
  return { betreff: (o.angefragt ? 'Neue Anfrage ' : 'Neue Bestellung ') + a.nr + ': ' + (b.firma || '') + ' · ' + o.paketName, html: rahmen(o.angefragt ? 'Neue Anfrage' : 'Neue Bestellung',
    zeilen([['Auftrag', a.nr], ['Paket', o.paketName], ['Weg', a.weg === 'schnell' ? 'Schnell (Sie übernehmen Texte und Bilder)' : 'Ausführlich'], ['Unternehmen', b.firma], ['Ansprechperson', b.ap], ['Telefon', b.tel], ['Website', b.web], ['Adresse', o.adresse], ['Zahlung', o.angefragt ? 'Kasse noch zu, unverbindlich angefragt' : 'Einrichtung bezahlt']]) +
    '<p style="margin:8px 0 0">' + pille(o.zentrale, 'In der Zentrale öffnen') + '</p>', 'Nur für den Inhaber von eeziframes.') };
}

const STAND_TEXT = {
  bezahlt: ['Ihre Zahlung ist da', 'Danke, die Einrichtung ist bezahlt. Damit ist Ihr Vertrag geschlossen. Wir rufen Sie zu Ihrer Wunschzeit an und beginnen mit Ihrer Seite. Bis wir beginnen, können Sie die Bestellung im Kundenbereich kostenlos stornieren.'],
  in_arbeit: ['Wir bauen Ihre Seite', 'Ihre Bestellung ist bezahlt, wir haben mit Ihrer Seite begonnen. Sobald es eine Vorschau gibt, melden wir uns.'],
  vorschau: ['Ihre Vorschau ist fertig', 'Ihre Seite ist fertig zum Ansehen. Bitte geben Sie sie im Kundenbereich frei oder schreiben Sie uns, was wir ändern sollen.'],
  live: ['Ihre Seite ist live', 'Ihre Seite und Ihr Konfigurator sind online. Ab heute läuft Ihr Monatsabo. Den Knopf „Fenster planen“ für Ihre Website finden Sie im Kundenbereich.'],
  pausiert: ['Ihre Seite ist pausiert', 'Ihre Seite ist gerade pausiert. Ihre Kunden sehen in dieser Zeit Ihre Kontaktdaten. Melden Sie sich gern bei uns.'],
  beendet: ['Ihr Vertrag ist beendet', 'Ihre Seite ist offline. Danke, dass Sie eeziframes genutzt haben.'],
  storniert: ['Ihre Bestellung ist storniert', 'Ihre Bestellung ist storniert. Eine bereits bezahlte Einrichtung erstatten wir auf Ihr Zahlungsmittel.']
};
export function standMail(a, stand, o) {
  const t = STAND_TEXT[stand]; if (!t) return null;
  const link = stand === 'vorschau' && o.vorschau ? '<p style="margin:0 0 14px">' + pille(o.vorschau, 'Vorschau ansehen') + '</p>' : stand === 'live' && o.live ? '<p style="margin:0 0 14px">' + pille(o.live, 'Seite öffnen') + '</p>' : '';
  return { betreff: t[0] + ' (' + a.nr + ')', html: rahmen(t[0], absatz(esc(t[1])) + (o.text ? absatz(esc(o.text)) : '') + link + absatz('<a href="' + esc(o.konto) + '" style="color:#07090a">Zum Kundenbereich</a>')) };
}

export function nachrichtMail(a, text, o) {
  return { betreff: (o.anInhaber ? 'Nachricht von ' + (((a.angaben || {}).betrieb || {}).firma || 'einem Kunden') : 'Neue Nachricht von eeziframes') + ' (' + a.nr + ')',
    html: rahmen(o.anInhaber ? 'Neue Nachricht' : 'Neue Nachricht von eeziframes', '<div style="margin:0 0 18px;padding:14px 16px;border-radius:16px;background:#f2f2f4;font:400 15px/1.55 ' + SCHRIFT + ';color:#07090a;white-space:pre-wrap">' + esc(text) + '</div>' +
      '<p style="margin:0">' + pille(o.link, o.anInhaber ? 'In der Zentrale antworten' : 'Im Kundenbereich antworten') + '</p>', o.anInhaber ? 'Nur für den Inhaber von eeziframes.' : '') };
}

/* Frage ohne Konto von der Seite für Fensterbauer (an den Inhaber; Antwort geht an die genannte Adresse, die nicht bestätigt ist) */
export function frageMail(f) {
  return { betreff: 'Frage zu den Paketen: ' + (f.firma || f.name), html: rahmen('Frage zu den Paketen', zeilen([['Name', f.name], ['Firma', f.firma], ['E-Mail', f.mail + ' (nicht bestätigt)'], ['Telefon', f.tel], ['Paket', f.paket]]) +
    '<div style="margin:0 0 6px;padding:14px 16px;border-radius:16px;background:#f2f2f4;font:400 15px/1.55 ' + SCHRIFT + ';color:#07090a;white-space:pre-wrap">' + esc(f.text) + '</div>', 'Nur für den Inhaber von eeziframes. Antworten Sie direkt auf diese E-Mail.') };
}


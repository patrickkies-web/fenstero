/* eeziframes · E-Mails des Servers über die API von Brevo (Sendinblue SAS, Paris; Daten in der EU):
   - Vertragsbestätigung nach dem Kauf des Aufmaßblatts, mit den AGB samt Widerrufsbelehrung in der Fassung beim Kauf (§ 312f BGB;
     ohne sie erlischt das Widerrufsrecht bei digitalen Inhalten nicht)
   - Eingangsbestätigung eines Widerrufs über die Widerrufsfunktion (§ 356a BGB) und eine Kopie an den Betreiber
   Variablen bei Cloudflare: MAIL_API_KEY (Secret, Schlüssel aus Brevo → SMTP & API → API-Schlüssel), MAIL_ABSENDER (Text, bei Brevo
   bestätigte Absenderadresse, z. B. kontakt@eeziframes.com), MAIL_KONTAKT (Text, optional: Postfach für Kopien, sonst MAIL_ABSENDER).
   Ohne Schlüssel verschickt der Server nichts (postDienst liefert null). MAIL_ATTRAPPE=1 merkt sich die Mails nur (lokale Prüfung). */
import { ANBIETER } from './anbieter.js';

const BREVO = 'https://api.brevo.com/v3/smtp/email';
export const attrappePost = [];
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const mailOk = (m) => /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(String(m || ''));

/* Datum und Uhrzeit in deutscher Zeit, z. B. „16. Oktober 2026, 18:42:07 Uhr“ */
export function zeitText(d) {
  const t = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d || new Date());
  const w = (typ) => (t.find((x) => x.type === typ) || {}).value || '';
  return w('day') + '. ' + w('month') + ' ' + w('year') + ', ' + w('hour') + ':' + w('minute') + ':' + w('second') + ' Uhr';
}

/* Rahmen jeder Mail: schlicht, ohne Bilder und ohne Zählpixel */
export function mailRahmen(titel, inhalt, kontakt) {
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>' + esc(titel) + '</title></head>' +
    '<body style="margin:0;padding:24px;background:#f5f5f7;color:#1d1d1f;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55">' +
    '<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px">' + inhalt +
    '<p style="margin-top:28px;font-size:13px;color:#6e6e73">eeziframes · ' + esc(ANBIETER.name) + ' · ' + esc(ANBIETER.strasse) + ' · ' + esc(ANBIETER.ort) + (kontakt ? ' · ' + esc(kontakt) : '') + '</p>' +
    '</div></body></html>';
}

export function postDienst(k) {
  const p = k && k.post;
  if (!p) return null;
  return {
    art: p.attrappe ? 'attrappe' : 'brevo',
    absender: p.absender,
    kontakt: p.kontakt,
    /* m: { an, name?, betreff, html, antwortAn? } → { ok, id } ; wirft nicht, Fehler stehen im Log */
    async senden(m) {
      if (!mailOk(m.an)) return { ok: false, grund: 'empfaenger' };
      if (p.attrappe) {
        attrappePost.push({ an: m.an, betreff: m.betreff, html: m.html, antwortAn: m.antwortAn || '', zeit: new Date().toISOString() });
        while (attrappePost.length > 50) attrappePost.shift();
        return { ok: true, id: 'attrappe-' + attrappePost.length };
      }
      try {
        const r = await fetch(BREVO, {
          method: 'POST',
          headers: { 'api-key': p.key, 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ sender: { name: 'eeziframes', email: p.absender }, to: [m.name ? { email: m.an, name: String(m.name).slice(0, 120) } : { email: m.an }], replyTo: m.antwortAn && mailOk(m.antwortAn) ? { email: m.antwortAn } : undefined, subject: m.betreff, htmlContent: m.html })
        });
        if (!r.ok) { console.log('Mail nicht gesendet', r.status, (await r.text().catch(() => '')).slice(0, 200)); return { ok: false, status: r.status }; }
        const j = await r.json().catch(() => ({}));
        return { ok: true, id: j.messageId || '' };
      } catch (e) {
        console.log('Mail nicht gesendet', String(e).slice(0, 160));
        return { ok: false };
      }
    }
  };
}

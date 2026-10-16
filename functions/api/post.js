/* eeziframes · E-Mails des Servers über die API von Resend (Plus Five Five, Inc., San Francisco; Versand über die Region der Domain,
   etwa eu-west-1). Öffnungs- und Klickmessung ist bei Resend für jede Domain von Haus aus aus; so bleibt es (Datenschutzerklärung,
   Abschnitt 9). Der Server verschickt:
   - Vertragsbestätigung nach dem Kauf des Aufmaßblatts, mit den AGB samt Widerrufsbelehrung in der Fassung beim Kauf (§ 312f BGB;
     ohne sie erlischt das Widerrufsrecht bei digitalen Inhalten nicht)
   - Eingangsbestätigung eines Widerrufs über die Widerrufsfunktion (§ 356a BGB) und eine Kopie an den Betreiber
   Variablen bei Cloudflare: MAIL_API_KEY (Secret, Schlüssel re_… aus Resend → API Keys), MAIL_ABSENDER (Text, Adresse der bei Resend
   bestätigten Domain, z. B. kontakt@eeziframes.com), MAIL_KONTAKT (Text, optional: Postfach für Kopien, sonst MAIL_ABSENDER).
   Ohne Schlüssel verschickt der Server nichts (postDienst liefert null). MAIL_ATTRAPPE=1 merkt sich die Mails nur (lokale Prüfung).
   Resend verlangt eine Kopfzeile User-Agent (sonst 403, Fehler 1010); Cloudflare setzt keine von selbst. */
import { ANBIETER } from './anbieter.js';
import { ZEICHEN_CID, ZEICHEN_PNG } from './marke.js';

const RESEND = 'https://api.resend.com/emails';
export const attrappePost = [];
/* nur für die Prüfung: Störung des Mailversands nachstellen (GET /api/test/post?stoerung=1) */
export const attrappeAus = { an: false };
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const mailOk = (m) => /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(String(m || ''));

/* Datum und Uhrzeit in deutscher Zeit, z. B. „16. Oktober 2026, 18:42:07 Uhr“ */
export function zeitText(d) {
  const t = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d || new Date());
  const w = (typ) => (t.find((x) => x.type === typ) || {}).value || '';
  return w('day') + '. ' + w('month') + ' ' + w('year') + ', ' + w('hour') + ':' + w('minute') + ':' + w('second') + ' Uhr';
}

/* Rahmen jeder Mail: oben das Zeichen mit der Wortmarke. Das Zeichen reist als eingebettetes Bild mit der Mail (cid, siehe senden),
   es wird nicht von einem Server nachgeladen; keine Zählpixel, keine Klickmessung */
export const ZEICHEN_KOPF = '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse"><tr>' +
  '<td style="padding:0 10px 0 0;vertical-align:middle"><img src="cid:' + ZEICHEN_CID + '" width="32" height="32" alt="" style="display:block;border:0"></td>' +
  '<td style="vertical-align:middle;font-size:20px;line-height:1;color:#1d1d1f"><b style="font-weight:900">eezi</b>frames</td></tr></table>';
export function mailRahmen(titel, inhalt, kontakt) {
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>' + esc(titel) + '</title></head>' +
    '<body style="margin:0;padding:24px;background:#f5f5f7;color:#1d1d1f;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55">' +
    '<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px">' + ZEICHEN_KOPF + inhalt +
    '<p style="margin-top:28px;font-size:13px;color:#6e6e73">eeziframes · ' + esc(ANBIETER.name) + ' · ' + esc(ANBIETER.strasse) + ' · ' + esc(ANBIETER.ort) + (kontakt ? ' · ' + esc(kontakt) : '') + '</p>' +
    '</div></body></html>';
}

export function postDienst(k) {
  const p = k && k.post;
  if (!p) return null;
  return {
    art: p.attrappe ? 'attrappe' : 'resend',
    absender: p.absender,
    kontakt: p.kontakt,
    /* m: { an, name?, betreff, html, antwortAn? } → { ok, id } ; wirft nicht. Ins Log kommen nur Status und Fehlercode von Resend,
       keine Adressen und keine Inhalte. Steht das Zeichen im Text (mailRahmen), geht es als eingebettetes Bild mit. */
    async senden(m) {
      if (!mailOk(m.an)) return { ok: false, grund: 'empfaenger' };
      const bilder = String(m.html || '').includes('cid:' + ZEICHEN_CID) ? [{ filename: 'eeziframes.png', content: ZEICHEN_PNG, content_type: 'image/png', content_id: ZEICHEN_CID }] : undefined;
      if (p.attrappe) {
        if (attrappeAus.an) return { ok: false, status: 503 };
        attrappePost.push({ an: m.an, betreff: m.betreff, html: m.html, antwortAn: m.antwortAn || '', bilder: (bilder || []).map((b) => b.content_id), zeit: new Date().toISOString() });
        while (attrappePost.length > 50) attrappePost.shift();
        return { ok: true, id: 'attrappe-' + attrappePost.length };
      }
      try {
        const r = await fetch(RESEND, {
          method: 'POST',
          headers: { authorization: 'Bearer ' + p.key, 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'eeziframes-server/1.0' },
          body: JSON.stringify({ from: 'eeziframes <' + p.absender + '>', to: [m.an], reply_to: m.antwortAn && mailOk(m.antwortAn) ? m.antwortAn : undefined, subject: m.betreff, html: m.html, attachments: bilder })
        });
        if (!r.ok) { const j = await r.json().catch(() => ({})); console.log('Mail nicht gesendet', r.status, String((j && (j.name || j.error)) || '').slice(0, 60)); return { ok: false, status: r.status }; }
        const j = await r.json().catch(() => ({}));
        return { ok: true, id: j.id || '' };
      } catch (e) {
        console.log('Mail nicht gesendet', String(e && e.name ? e.name : 'Fehler').slice(0, 60));
        return { ok: false };
      }
    }
  };
}

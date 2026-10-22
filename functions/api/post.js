/* eeziframes · E-Mails des Servers über die API von Resend (Plus Five Five, Inc., San Francisco; Versand über die Region der Domain,
   etwa eu-west-1). Öffnungs- und Klickmessung ist bei Resend für jede Domain von Haus aus aus; so bleibt es (Datenschutzerklärung,
   Abschnitt 9). Der Server verschickt:
   - Vertragsbestätigung nach dem Kauf des Aufmaßblatts, mit den AGB samt Widerrufsbelehrung in der Fassung beim Kauf (§ 312f BGB;
     ohne sie erlischt das Widerrufsrecht bei digitalen Inhalten nicht)
   - Eingangsbestätigung eines Widerrufs über die Widerrufsfunktion (§ 356a BGB) und eine Kopie an den Betreiber
   Variablen bei Cloudflare: MAIL_API_KEY (Secret, Schlüssel re_… aus Resend → API Keys), MAIL_ABSENDER (Text, Adresse der bei Resend
   bestätigten Domain, hier ask@eeziframes.com), MAIL_KONTAKT (Text, optional: Postfach für Kopien und Antwortadresse, sonst die Adresse
   aus anbieter.js, wie im Impressum).
   Ohne Schlüssel verschickt der Server nichts (postDienst liefert null). MAIL_ATTRAPPE=1 merkt sich die Mails nur (lokale Prüfung).
   Resend verlangt eine Kopfzeile User-Agent (sonst 403, Fehler 1010); Cloudflare setzt keine von selbst.
   Für die Konfigurator-Instanzen (docs/INSTANZEN.md) nimmt senden() zusätzlich Anhänge (PDF des Aufmaßblatts, eingebettete Logos),
   einen eigenen Absender mit Anzeigenamen und einen Idempotenz-Schlüssel (Resend verschickt dieselbe Mail dann nur einmal). Empfänger
   auf .invalid (Platzhalteradressen der Instanz-Betriebszeilen) bekommen nie Post. */
import { ANBIETER } from './anbieter.js';
import { ZEICHEN_CID, ZEICHEN_PNG } from './marke.js';

const RESEND = 'https://api.resend.com/emails';
export const attrappePost = [];
/* nur für die Prüfung: Störung des Mailversands nachstellen (GET /api/test/post?stoerung=1) */
export const attrappeAus = { an: false };
const attrappeZaehler = { n: 0 };
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
/* o.marke: null (Rahmen von eeziframes, wie bisher) · { name, logoCid, dezent } (Marke eines Betriebs: Logo als eingebettetes Bild mit
   dieser content_id, sonst der Name; dezent: Fußzeile „Konfigurator von eeziframes“, sonst ohne eeziframes) · 'neutral' (ohne Marke,
   ohne eeziframes). Das Logo hängt der Aufrufer als Anhang mit content_id an (senden, anhaenge). */
export function mailRahmen(titel, inhalt, kontakt, o) {
  const marke = o && o.marke;
  const kopf = !marke ? ZEICHEN_KOPF
    : marke === 'neutral' ? ''
      : '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse"><tr><td style="vertical-align:middle;font-size:20px;line-height:1.2;color:#1d1d1f">' +
        (marke.logoCid ? '<img src="cid:' + esc(marke.logoCid) + '" height="40" alt="' + esc(marke.name || '') + '" style="display:block;border:0;max-width:240px;height:40px">' : '<b style="font-weight:800">' + esc(marke.name || '') + '</b>') + '</td></tr></table>';
  const fuss = !marke ? 'eeziframes · ' + esc(ANBIETER.name) + ' · ' + esc(ANBIETER.strasse) + ' · ' + esc(ANBIETER.ort) + (kontakt ? ' · ' + esc(kontakt) : '')
    : [marke !== 'neutral' && marke.name ? esc(marke.name) : '', kontakt ? esc(kontakt) : '', marke !== 'neutral' && marke.dezent ? 'Konfigurator von eeziframes' : ''].filter(Boolean).join(' · ');
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>' + esc(titel) + '</title></head>' +
    '<body style="margin:0;padding:24px;background:#f5f5f7;color:#1d1d1f;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55">' +
    '<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px">' + kopf + inhalt +
    (fuss ? '<p style="margin-top:28px;font-size:13px;color:#6e6e73">' + fuss + '</p>' : '') +
    '</div></body></html>';
}
/* Empfänger: eine Adresse oder eine Liste (höchstens 50); alle gültig und keine auf .invalid */
const empfaenger = (an) => (Array.isArray(an) ? an : [an]).map((x) => String(x || '').trim());
const ungueltig = (a) => /\.invalid$/i.test(a);
/* Anzeigename ohne Zeichen, die die Kopfzeile From brechen */
const anzeige = (n) => String(n || '').replace(/[\u0000-\u001f\u007f"<>\\,;:@]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
/* Anhänge: { filename, content (Base64), content_type?, content_id? } */
function anhaengePruefen(liste) {
  if (liste == null) return [];
  if (!Array.isArray(liste) || liste.length > 20) return null;
  const out = [];
  for (const a of liste) {
    if (!a || typeof a.content !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(a.content) || !String(a.filename || '').trim()) return null;
    out.push({ filename: String(a.filename).replace(/[\u0000-\u001f\u007f/\\"]/g, '_').slice(0, 120), content: a.content, content_type: a.content_type || undefined, content_id: a.content_id || undefined });
  }
  return out;
}
const groesse = (b64) => Math.floor(b64.length * 3 / 4) - (/==$/.test(b64) ? 2 : /=$/.test(b64) ? 1 : 0);

export function postDienst(k) {
  const p = k && k.post;
  if (!p) return null;
  return {
    art: p.attrappe ? 'attrappe' : 'resend',
    absender: p.absender,
    kontakt: p.kontakt,
    /* m: { an (Adresse oder Liste), name?, betreff, html, antwortAn?, anhaenge?: [{ filename, content (Base64), content_type?, content_id? }],
       von?: { name, adresse }, idempotenz? } → { ok, id } ; wirft nicht. Ins Log kommen nur Status und Fehlercode von Resend, keine
       Adressen und keine Inhalte. Steht das Zeichen im Text (mailRahmen), geht es als eingebettetes Bild mit. */
    async senden(m) {
      const an = empfaenger(m.an);
      if (!an.length || an.length > 50 || !an.every(mailOk)) return { ok: false, grund: 'empfaenger' };
      if (an.some(ungueltig)) return { ok: false, grund: 'invalid' };
      const extra = anhaengePruefen(m.anhaenge); if (!extra) return { ok: false, grund: 'anhang' };
      const vonAdresse = m.von && m.von.adresse && mailOk(m.von.adresse) && !ungueltig(m.von.adresse) ? String(m.von.adresse).trim() : p.absender;
      const vonName = m.von && m.von.name ? anzeige(m.von.name) : 'eeziframes';
      const bilder = String(m.html || '').includes('cid:' + ZEICHEN_CID) ? [{ filename: 'eeziframes.png', content: ZEICHEN_PNG, content_type: 'image/png', content_id: ZEICHEN_CID }] : [];
      const anhang = bilder.concat(extra);
      const idem = m.idempotenz ? String(m.idempotenz).replace(/[^A-Za-z0-9._:-]/g, '').slice(0, 256) : '';
      if (p.attrappe) {
        if (attrappeAus.an) return { ok: false, status: 503 };
        /* Idempotenz wie bei Resend: derselbe Schlüssel innerhalb von 24 Stunden verschickt nichts erneut */
        const schon = idem ? attrappePost.find((x) => x.idempotenz === idem) : null;
        if (schon) return { ok: true, id: schon.id, wiederholt: true };
        const id = 'attrappe-' + (++attrappeZaehler.n);
        attrappePost.push({ id: id, an: an.length === 1 ? an[0] : an, betreff: m.betreff, html: m.html, antwortAn: m.antwortAn || '', bilder: bilder.map((b) => b.content_id),
          anhaenge: extra.map((a) => ({ name: a.filename, typ: a.content_type || '', bytes: groesse(a.content), cid: a.content_id || '' })), anhangDaten: extra.map((a) => a.content),
          von: { name: vonName, adresse: vonAdresse }, idempotenz: idem, zeit: new Date().toISOString() });
        while (attrappePost.length > 50) attrappePost.shift();
        return { ok: true, id: id };
      }
      try {
        const kopf = { authorization: 'Bearer ' + p.key, 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'eeziframes-server/1.0' };
        if (idem) kopf['idempotency-key'] = idem;
        const r = await fetch(RESEND, {
          method: 'POST',
          headers: kopf,
          body: JSON.stringify({ from: vonName + ' <' + vonAdresse + '>', to: an, reply_to: m.antwortAn && mailOk(m.antwortAn) ? m.antwortAn : undefined, subject: m.betreff, html: m.html, attachments: anhang.length ? anhang : undefined })
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

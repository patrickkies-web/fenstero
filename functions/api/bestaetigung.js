/* eeziframes · Vertragsbestätigung nach dem Kauf des Aufmaßblatts (§ 312f BGB), per E-Mail über post.js.
   Enthält Anbieter, Leistung, Preis, Zeitpunkt, die Zustimmung zum sofortigen Beginn samt Kenntnis vom Erlöschen des Widerrufsrechts
   und die AGB mit Widerrufsbelehrung und Muster-Widerrufsformular in der Fassung beim Kauf (gelesen aus /agb/, eine Quelle für Seite und
   Mail). Erst mit dieser Bestätigung erlischt das Widerrufsrecht bei digitalen Inhalten (§ 356 BGB). Verschickt wird einmal je Kauf:
   beim ersten Wechsel einer Zahlung auf „bezahlt“ (Rückkehr aus der Kasse oder Webhook, zahlung.js). */
import { ANBIETER } from './anbieter.js';
import { postDienst, mailOk, esc, zeitText, mailRahmen } from './post.js';

const euro = (n) => Number(n).toFixed(2).replace('.', ',') + ' €';
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';

/* Die AGB, wie sie gerade auf der Website stehen: Inhalt von <main>, ohne Skripte und Klassen, Links absolut */
async function agbFassung(ctx) {
  try {
    const env = ctx.env || {}, origin = ctx.url.origin;
    if (!env.ASSETS || !env.ASSETS.fetch) return '';
    const r = await env.ASSETS.fetch(new Request(origin + '/agb/'));
    if (!r.ok) return '';
    const m = (await r.text()).match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (!m) return '';
    return m[1].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/ (class|id|aria-[a-z]+)="[^"]*"/g, '').replace(/href="\//g, 'href="' + origin + '/');
  } catch (e) {
    return '';
  }
}

export async function kaufBestaetigen(ctx, kauf) {
  const pd = postDienst(ctx.k);
  if (!pd || !kauf || !mailOk(kauf.mail)) return false;
  const preis = kauf.betragCent ? kauf.betragCent / 100 : ctx.k.preise.aufmass;
  const steuer = ctx.k.preise.mwst ? 'darin 19 % Umsatzsteuer' : 'umsatzsteuerfrei nach § 19 UStG';
  const agb = await agbFassung(ctx), origin = ctx.url.origin;
  const zeile = (a, b) => '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">' + a + '</td><td style="padding:4px 0">' + b + '</td></tr>';
  const html = mailRahmen('Vertragsbestätigung',
    absatz('Guten Tag,') +
    absatz('vielen Dank für Ihren Kauf. Hiermit bestätigen wir Ihren Vertrag über das Aufmaßblatt.') +
    '<table style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' +
    zeile('Anbieter', esc(ANBIETER.name) + ', ' + esc(ANBIETER.strasse) + ', ' + esc(ANBIETER.ort) + ', E-Mail: ' + esc(pd.kontakt)) +
    zeile('Leistung', 'eeziframes Aufmaßblatt als PDF (digitaler Inhalt) für das Aufmaß mit der Kennung ' + esc(kauf.kennung)) +
    zeile('Preis', esc(euro(preis)) + ', ' + esc(steuer)) +
    zeile('Gekauft am', esc(zeitText(kauf.zeit ? new Date(kauf.zeit) : new Date()))) +
    zeile('Zahlung', 'über Stripe; die Rechnung erhalten Sie von Stripe per E-Mail') + '</table>' +
    absatz('<b>Ihre Zustimmung beim Kauf:</b> Sie haben ausdrücklich zugestimmt, dass wir vor Ablauf der Widerrufsfrist mit der Bereitstellung des Aufmaßblatts beginnen, und bestätigt, dass Sie wissen, dass Sie durch diese Zustimmung mit Beginn der Bereitstellung Ihr Widerrufsrecht verlieren.') +
    absatz('Ihr Aufmaßblatt ist in der App freigeschaltet, auf jedem Gerät, auf dem Sie sich mit dieser E-Mail-Adresse anmelden: <a href="' + origin + '/app/">' + esc(origin.replace(/^https?:\/\//, '')) + '/app/</a>') +
    (agb
      ? absatz('Unten finden Sie unsere Allgemeinen Geschäftsbedingungen mit Widerrufsbelehrung und Muster-Widerrufsformular in der Fassung, die bei Ihrem Kauf galt.') + '<hr style="border:0;border-top:1px solid #d2d2d7;margin:20px 0">' + '<div style="font-size:14px">' + agb + '</div>'
      : absatz('Unsere Allgemeinen Geschäftsbedingungen mit Widerrufsbelehrung finden Sie unter <a href="' + origin + '/agb/">' + esc(origin.replace(/^https?:\/\//, '')) + '/agb/</a>.')),
    pd.kontakt);
  const r = await pd.senden({ an: kauf.mail, betreff: 'Ihr Kauf bei eeziframes: Vertragsbestätigung', html: html, antwortAn: pd.kontakt });
  if (!r.ok) console.log('Vertragsbestätigung nicht gesendet', kauf.kennung);
  return r.ok;
}

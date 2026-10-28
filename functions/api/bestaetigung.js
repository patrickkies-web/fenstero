/* eeziframes · Vertragsbestätigung nach dem Kauf des Aufmaßblatts (§ 312f BGB), per E-Mail über post.js.
   Enthält Anbieter (mit Telefon, sobald eingetragen), Leistung, Preis, Zeitpunkt, die Zustimmung an der Kasse im Wortlaut samt
   Zeitpunkt und die AGB mit Widerrufsbelehrung und Muster-Widerrufsformular in der Fassung beim Kauf (gelesen aus /agb/, eine Quelle
   für Seite und Mail). Erst mit dieser Bestätigung auf einem dauerhaften Datenträger erlischt das Widerrufsrecht bei digitalen Inhalten
   (§ 356 Abs. 6 BGB); ein Link auf die AGB genügt dafür nicht. Darum:
   - Lassen sich die AGB nicht lesen, geht keine Mail mit bloßem Link raus; der tägliche Lauf versucht es erneut.
   - Steht auf /agb/ inzwischen ein anderer Stand als beim Kauf, schickt der Lauf nichts automatisch (die Zentrale zeigt den Kauf an).
   - Jede zugestellte Bestätigung steht mit Zeitpunkt in der Zahlung (bestaetigt_am), jeder Fehlversuch zählt mit (versuche).
   Verschickt wird beim ersten Wechsel einer Zahlung auf „bezahlt“ (zahlung.js) und, falls das scheitert, im täglichen Lauf
   (bestaetigungenNachholen, router.js → geplant). */
import { ANBIETER } from './anbieter.js';
import { postDienst, mailOk, esc, zeitText, mailRahmen } from './post.js';
import { AGB_STAND, ZUSTIMMUNG, standText } from './recht.js';
import { VERSUCHE } from './speicher.js';
import { basis, HAUPTADRESSE } from '../seo.js';

const TAG = 24 * 60 * 60 * 1000;
const euro = (n) => Number(n).toFixed(2).replace('.', ',') + ' €';
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
/* Adresse der Website für Links in der Mail: die Hauptadresse (KANONISCH), im Cron ohne Anfrage ebenso */
const herkunft = (ctx) => (ctx.url ? basis(ctx.env, ctx.url) : String((ctx.env && ctx.env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, ''));

/* Die AGB, wie sie gerade auf der Website stehen: Inhalt von <main>, ohne Skripte und Klassen, Links absolut, dazu ihr Stand */
export async function agbFassung(env, origin) {
  try {
    if (!env || !env.ASSETS || !env.ASSETS.fetch) return null;
    const r = await env.ASSETS.fetch(new Request(origin + '/agb/'));
    if (!r.ok) return null;
    const t = await r.text(), m = t.match(/<main[^>]*>([\s\S]*?)<\/main>/), st = t.match(/<meta name="stand" content="([^"]+)"/);
    if (!m || !/id="widerrufsbelehrung"/.test(m[1])) return null;
    return { stand: st ? st[1] : '', html: m[1].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/ (class|id|aria-[a-z]+|data-[a-z-]+)="[^"]*"/g, '').replace(/href="\//g, 'href="' + origin + '/') };
  } catch (e) {
    return null;
  }
}

/* kauf: { session, mail, kennung, betragCent, zustimmung: { agb, text, zeit }, zeit, versuche } → true, wenn zugestellt.
   ctx: { k, env, url?, sp? } (aus einer Anfrage oder dem täglichen Lauf) */
export async function kaufBestaetigen(ctx, kauf) {
  const pd = postDienst(ctx.k), sp = ctx.sp, origin = herkunft(ctx);
  const merken = async (patch) => { if (sp && sp.zahlungAendern && kauf && kauf.session) { try { await sp.zahlungAendern(kauf.session, patch); } catch (e) { console.log('Vertragsbestätigung nicht vermerkt', String(e).slice(0, 120)); } } };
  const fehlschlag = async (grund, aufgeben) => { console.log('Vertragsbestätigung nicht gesendet:', grund, kauf && kauf.kennung); await merken({ versuche: aufgeben ? VERSUCHE : ((kauf && kauf.versuche) || 0) + 1 }); return false; };
  if (!kauf || !mailOk(kauf.mail)) return fehlschlag('keine E-Mail-Adresse', true);
  if (!pd) return fehlschlag('kein Mailversand eingerichtet');
  const z = kauf.zustimmung && kauf.zustimmung.text ? kauf.zustimmung : { agb: AGB_STAND, text: ZUSTIMMUNG, zeit: '' };
  const agb = await agbFassung(ctx.env, origin);
  if (!agb) return fehlschlag('AGB nicht lesbar');
  if (z.agb && agb.stand && agb.stand !== z.agb) return fehlschlag('AGB seit dem Kauf geändert (' + z.agb + ' → ' + agb.stand + '), bitte von Hand bestätigen', true);
  const preis = kauf.betragCent ? kauf.betragCent / 100 : ctx.k.preise.aufmass;
  const steuer = ctx.k.preise.mwst ? 'darin 19 % Umsatzsteuer' : 'umsatzsteuerfrei nach § 19 UStG';
  const zeile = (a, b) => '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">' + a + '</td><td style="padding:4px 0">' + b + '</td></tr>';
  const html = mailRahmen('Vertragsbestätigung',
    absatz('Guten Tag,') +
    absatz('vielen Dank für Ihren Kauf. Hiermit bestätigen wir Ihren Vertrag über das Aufmaßblatt.') +
    '<table style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' +
    zeile('Anbieter', esc(ANBIETER.name) + ', ' + esc(ANBIETER.strasse) + ', ' + esc(ANBIETER.ort) + (ANBIETER.telefon ? ', Telefon: ' + esc(ANBIETER.telefon) : '') + ', E-Mail: ' + esc(pd.kontakt)) +
    zeile('Leistung', 'eeziframes Aufmaßblatt als PDF (digitaler Inhalt) für das Aufmaß mit der Kennung ' + esc(kauf.kennung)) +
    zeile('Preis', esc(euro(preis)) + ', ' + esc(steuer)) +
    zeile('Gekauft am', esc(zeitText(kauf.zeit ? new Date(kauf.zeit) : new Date()))) +
    zeile('Zahlung', 'über Stripe; die Rechnung erhalten Sie von Stripe per E-Mail') + '</table>' +
    absatz('<b>Ihre Zustimmung beim Kauf</b>' + (z.zeit ? ' (' + esc(zeitText(new Date(z.zeit))) + ')' : '') + ': Auf der Kassenseite haben Sie diesen Satz angehakt: „' + esc(z.text) + '“ Mit der Bereitstellung des Aufmaßblatts und dieser Bestätigung erlischt Ihr Widerrufsrecht deshalb (§ 356 Abs. 5 BGB).') +
    absatz('Ihr Aufmaßblatt ist in der App freigeschaltet, auf jedem Gerät, auf dem Sie sich mit dieser E-Mail-Adresse anmelden: <a href="' + origin + '/app/">' + esc(origin.replace(/^https?:\/\//, '')) + '/app/</a>') +
    absatz('Unten finden Sie unsere Allgemeinen Geschäftsbedingungen (Stand ' + esc(standText(agb.stand || z.agb || AGB_STAND)) + ') mit Widerrufsbelehrung und Muster-Widerrufsformular in der Fassung, die bei Ihrem Kauf galt.') +
    '<hr style="border:0;border-top:1px solid #d2d2d7;margin:20px 0"><div style="font-size:14px">' + agb.html + '</div>',
    pd.kontakt);
  const r = await pd.senden({ an: kauf.mail, betreff: 'Ihr Kauf bei eeziframes: Vertragsbestätigung', html: html, antwortAn: pd.kontakt });
  if (!r.ok) return fehlschlag('Mailversand gescheitert');
  await merken({ bestaetigt_am: new Date().toISOString() });
  return true;
}

/* Täglicher Lauf: Vertragsbestätigungen nachholen, die nicht zugestellt wurden (höchstens 20 je Lauf, nur Käufe der letzten 60 Tage,
   frühestens 30 Minuten nach der Zahlung, damit kein Versand doppelt läuft) */
export async function bestaetigungenNachholen(k, sp, env) {
  if (!sp || !sp.zahlungenUnbestaetigt) return { ok: true, nachgeholt: 0 };
  const liste = await sp.zahlungenUnbestaetigt(new Date(Date.now() - 60 * TAG).toISOString());
  if (!liste) return { ok: false, grund: 'Spalten fehlen (schema.sql)' };
  let nachgeholt = 0, fehler = 0;
  for (const z of liste.slice(0, 20)) {
    if (Date.now() - (Date.parse(z.bezahlt_am || z.created_at || '') || 0) < 30 * 60 * 1000) continue;
    const ok = await kaufBestaetigen({ k: k, env: env, sp: sp }, { session: z.stripe_session, mail: z.mail, kennung: z.kennung, betragCent: z.betrag_cent, zustimmung: z.daten && z.daten.zustimmung, zeit: z.bezahlt_am || z.created_at, versuche: z.versuche || 0 });
    if (ok) nachgeholt++; else fehler++;
  }
  return { ok: !fehler, nachgeholt: nachgeholt, fehler: fehler, offen: liste.length - nachgeholt };
}

/* eeziframes · E-Mails an Betriebe (Strang S6): „Aufmaß eingegangen“ sofort nach dem Eingang und einmal eine Erinnerung an offene
   Links, je nach den Schaltern unter „Mein Betrieb · Benachrichtigungen“ (prefs.mail, prefs.remind; ohne Angabe an).
   Versand über post.js (Resend), nur wenn der Mailversand eingerichtet ist; sonst passiert nichts, und der Betriebsbereich sagt das
   statt der Schalter. Inhalt so knapp wie möglich: Kunde, Projektnummer, Anzahl der Positionen und ein Link zum Projekt
   (/#projekt-<id>, öffnet nach der Anmeldung genau dieses Projekt); keine Maße, keine Fotos, keine Zählpixel.
   Gesperrte Betriebe (Zentrale) bekommen nichts. Die Datenschutzerklärung nennt diese Mails als „Hinweise zum Konto“ (Abschnitt 9).
   Konfigurator-Instanzen (Betriebszeile mit daten.instanz) bekommen hier nichts: Ihre Anfragen kommen mit PDF über functions/api/eingang.js
   an die bestätigten Eingangsadressen (nie an die Platzhalteradresse der Betriebszeile), Erinnerungen an Einladungen schickt dashboard.js. */
import { postDienst, mailOk, esc, mailRahmen } from './post.js';
import { basis, HAUPTADRESSE } from '../seo.js';

const X = () => globalThis.Abrechnung;
const TAG = 24 * 60 * 60 * 1000;
/* Erinnerung frühestens 3 Tage nach dem Anlegen des Projekts (der Link geht meist am selben Tag raus), höchstens einmal je Projekt */
export const ERINNERUNG_TAGE = 3;
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const knopf = (href, text) => '<p style="margin:18px 0 6px"><a href="' + esc(href) + '" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#161616;color:#f1f0ea;font-weight:700;text-decoration:none">' + esc(text) + '</a></p>';
const herkunft = (ctx) => (ctx && ctx.url ? basis(ctx.env, ctx.url) : String((ctx && ctx.env && ctx.env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, ''));
const anAdresse = (row) => { const a = (row && row.daten) || {}; return mailOk(a.mail) ? a.mail : mailOk(row && row.mail) ? row.mail : ''; };
const gesperrt = (row) => !!(row && row.daten && row.daten.verwaltung && row.daten.verwaltung.sperre);
const projektLink = (origin, l) => origin + '/#projekt-' + encodeURIComponent(l.id);

/* Sofort nach dem Eingang (POST /api/aufmass): r ist das Ergebnis von importCode (l, art, locked) */
export async function eingangMelden(ctx, row, r, nb) {
  const pd = postDienst(ctx.k), a = (row && row.daten) || {}, l = r && r.l, an = anAdresse(row);
  if (a.instanz) return false; // Instanzen: eingang.js (eingangVerarbeiten)
  if (!pd || !l || !an || gesperrt(row) || (a.prefs || {}).mail === false) return false;
  const origin = herkunft(ctx), am = l.aufmass || {}, n = (am.windows || []).length;
  const was = nb ? 'Nachbesserung' : 'Aufmaß';
  const html = mailRahmen(was + ' eingegangen',
    absatz('Guten Tag' + (a.ap ? ' ' + esc(String(a.ap).split(' ')[0]) : '') + ',') +
    absatz(esc(l.kunde || 'Ihr Kunde') + ' hat ' + (nb ? 'die Nachbesserung' : 'das Aufmaß') + ' für Projekt ' + esc(l.nr || '') + ' geschickt: ' + esc(X().nW(n, 'Position', 'Positionen')) + (am.fotos ? ', ' + esc(X().nW(am.fotos, 'Foto', 'Fotos')) : '') + '.') +
    (r.locked ? absatz('<b>Noch gesperrt:</b> Ihre kostenlosen Projekte sind verbraucht. Mit einer Zahlungsart sehen Sie das Aufmaß sofort.') : nb ? absatz('Die Nachbesserung kostet nichts.') : '') +
    knopf(projektLink(origin, l), 'Projekt öffnen') +
    absatz('<span style="font-size:13px;color:#6e6e73">Diese E-Mail können Sie im Betriebsbereich unter „Mein Betrieb · Benachrichtigungen“ abschalten.</span>'),
    pd.kontakt);
  const res = await pd.senden({ an: an, betreff: was + ' eingegangen: ' + String(l.kunde || 'Kunde').slice(0, 60) + (l.nr ? ' · ' + l.nr : ''), html: html, antwortAn: pd.kontakt });
  return !!(res && res.ok);
}

/* Projekte, an die erinnert werden sollte: Link verschickt oder geöffnet, aber noch kein Maß; angelegt vor mindestens 3 Tagen; Link noch
   offen; noch nicht erinnert */
export function offeneZumErinnern(a, now) {
  now = now || Date.now();
  return ((a && a.links) || []).filter((l) => {
    if (!l || l.erinnert || !['gesendet', 'geoeffnet'].includes(l.status) || (l.progress || 0) > 0) return false;
    if (X().linkZu(l, now)) return false;
    const d = X().parseDE(l.created); if (!d) return false;
    return now - (d.getTime() - TAG + 1000) >= ERINNERUNG_TAGE * TAG;
  });
}

/* Täglicher Lauf (router.js → geplant): je Betrieb höchstens eine Mail mit allen offenen Projekten, danach gilt jedes als erinnert */
export async function erinnerungenSenden(k, sp, env, now) {
  const pd = postDienst(k);
  if (!pd || !sp || !sp.betriebeAlle) return { ok: true, gesendet: 0 };
  now = now || Date.now();
  const origin = String((env && env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, '');
  let gesendet = 0, fehler = 0;
  for (const row of await sp.betriebeAlle()) {
    const a = row.daten || {}, an = anAdresse(row);
    if (a.instanz || !an || gesperrt(row) || (a.prefs || {}).remind === false) continue; // Instanzen: einladungenErinnern (dashboard.js)
    const offen = offeneZumErinnern(a, now);
    if (!offen.length) continue;
    const zeilen = offen.slice(0, 20).map((l) => '<li style="margin:0 0 6px"><a href="' + esc(projektLink(origin, l)) + '" style="color:#161616;font-weight:700">' + esc(l.kunde || 'Kunde') + '</a>' + (l.nr ? ' · ' + esc(l.nr) : '') + ' · ' + (l.status === 'geoeffnet' ? 'Link geöffnet, noch kein Maß' : 'Link verschickt, noch nicht geöffnet') + (l.expires ? ' · gültig bis ' + esc(l.expires) : '') + '</li>').join('');
    const html = mailRahmen('Offene Aufmaß-Links',
      absatz('Guten Tag' + (a.ap ? ' ' + esc(String(a.ap).split(' ')[0]) : '') + ',') +
      absatz(offen.length === 1 ? 'ein Kunde hat seit ' + ERINNERUNG_TAGE + ' Tagen noch nicht gemessen:' : offen.length + ' Kunden haben seit ' + ERINNERUNG_TAGE + ' Tagen noch nicht gemessen:') +
      '<ul style="margin:0 0 14px;padding-left:20px">' + zeilen + '</ul>' +
      absatz('Ein kurzer Anruf oder eine Nachricht hilft oft. Im Projekt können Sie den Link erneut schicken.') +
      absatz('<span style="font-size:13px;color:#6e6e73">Wir erinnern je Projekt nur einmal. Abschalten können Sie das im Betriebsbereich unter „Mein Betrieb · Benachrichtigungen“.</span>'),
      pd.kontakt);
    const r = await pd.senden({ an: an, betreff: offen.length === 1 ? 'Erinnerung: ' + String(offen[0].kunde || 'Ein Kunde').slice(0, 60) + ' hat noch nicht gemessen' : 'Erinnerung: ' + offen.length + ' Kunden haben noch nicht gemessen', html: html, antwortAn: pd.kontakt });
    if (!r || !r.ok) { fehler++; continue; }
    const ids = new Set(offen.map((l) => l.id)), heute = X().datum(now);
    try { await sp.betriebAendern(row.id, (a2) => { (a2.links || []).forEach((l) => { if (ids.has(l.id)) l.erinnert = heute; }); return true; }); gesendet++; } catch (e) { fehler++; }
  }
  return { ok: true, gesendet: gesendet, fehler: fehler };
}

/* eeziframes · Stand der Rechtstexte und Wortlaut der Zustimmungen: eine Quelle für Server, App (über /api/status) und Prüfung.
   - AGB_STAND gehört zum „Stand“ auf /agb/ (<meta name="stand">), NB_STAND zu /nutzungsbedingungen/; scripts/pruefen.mjs prüft das.
     Ändert sich der Text der AGB, bekommt er hier einen neuen Stand: Die Kasse zeigt ihn, der Server nimmt nur Käufe mit genau diesem
     Stand an und speichert ihn mit dem Kauf (zahlungen.daten, Metadaten der Stripe-Kasse). Ebenso die Registrierung der Betriebe.
   - ZUSTIMMUNG ist der Haken an der Kasse: ausdrückliche Zustimmung zum Beginn vor Ablauf der Widerrufsfrist und Kenntnis vom Verlust
     des Widerrufsrechts (§ 356 Abs. 6 BGB). Die Vertragsbestätigung und die Stripe-Rechnung zitieren ihn wörtlich.
   - verkaufStand(): Was vor dem Verkauf mit echtem Geld fehlt. Im Live-Modus von Stripe (sk_live_…) nimmt die Kasse erst an, wenn
     der Mailversand steht (Vertragsbestätigung, Eingangsbestätigung eines Widerrufs), die Umsatzsteuer ausdrücklich festgelegt ist,
     Konten laufen und in den Rechtstexten keine Platzhalter mehr stehen (E-Mail-Adresse, Telefonnummer). /api/status zeigt das. */
import { VORLAGE } from '../instanz/recht.js';

export const AGB_STAND = '2026-10-18';
/* Paketbedingungen der Konfigurator-Pakete mit Anlage AV-Vertrag (/konfigurator-bedingungen/, Strang F), Fassung beim Bestellen: Das
   Bestellformular zeigt sie, der Server nimmt nur Bestellungen mit genau diesem Stand an und speichert ihn an der Bestellung
   (bestellungen.zustimmung, Metadaten der Stripe-Kasse). Die Fassung als PDF liegt unter /konfigurator-bedingungen/paketbedingungen-<STAND>.pdf
   bzw. av-vertrag-<STAND>.pdf und geht mit der Eingangsbestätigung an den Fensteranbieter. */
export const PAKET_STAND = '2026-10-27';
export const NB_STAND = '2026-10-18';
export const ZUSTIMMUNG = 'Ich stimme ausdrücklich zu, dass eeziframes (Patrick Kies) vor Ablauf der Widerrufsfrist mit der Bereitstellung des Aufmaßblatts beginnt. Mir ist bekannt, dass ich durch diese Zustimmung mit Beginn der Bereitstellung mein Widerrufsrecht verliere.';

const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
/* 2026-10-16 → „16. Oktober 2026“ */
export function standText(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  return m ? Number(m[3]) + '. ' + MONATE[Number(m[2]) - 1] + ' ' + m[1] : String(iso || '');
}

/* Platzhalter in den Rechtstexten (<mark class="ph">[…]</mark>): je Ursprung fünf Minuten gemerkt */
const SEITEN = ['/impressum/', '/agb/', '/datenschutz/', '/widerruf/', '/nutzungsbedingungen/'];
const merk = new Map();
/* Prüfung: gemerkte Ergebnisse vergessen (ein Abschnitt kann sonst den nächsten mit echten Seiten statt seiner Attrappe versorgen) */
export const rechtstexteVergessen = () => merk.clear();
/* seiten: andere Seitenliste (Paket-Kasse, paketVerkaufStand); ohne Angabe die Seiten des B2C-Kaufs */
export async function rechtstexteFertig(env, origin, seiten) {
  if (!env || !env.ASSETS || !env.ASSETS.fetch) return { ok: true, ungeprueft: true }; // ohne Dateien (Prüfung im Speicher) nichts zu lesen
  const liste = seiten || SEITEN, schluessel = seiten ? origin + '|' + liste.join(',') : origin;
  const m = merk.get(schluessel);
  if (m && m.bis > Date.now()) return m.r;
  let r;
  try {
    const fehlt = new Set();
    for (const p of liste) {
      const a = await env.ASSETS.fetch(new Request(origin + p));
      if (!a.ok) { fehlt.add('Seite ' + p + ' fehlt'); continue; }
      const t = await a.text();
      (t.match(/<mark class="ph">\[([^\]<]{1,60})\]<\/mark>/g) || []).forEach((x) => fehlt.add(x.replace(/<[^>]+>/g, '').replace(/^\[|\]$/g, '').replace(/ folgt$/, '')));
    }
    r = { ok: !fehlt.size, fehlt: Array.from(fehlt) };
  } catch (e) { r = { ok: false, fehlt: ['Rechtstexte nicht lesbar'] }; }
  merk.set(schluessel, { r: r, bis: Date.now() + 5 * 60 * 1000 });
  return r;
}

/* Was vor dem Verkauf fehlt. mitKonten: Ergebnis von kontenDa() (true, false oder undefined bei Störung) */
export async function verkaufStand(k, env, origin, mitKonten) {
  const fehlt = [];
  if (!k.post || k.post.attrappe) fehlt.push('E-Mail-Versand (MAIL_API_KEY und MAIL_ABSENDER)');
  if (!k.mwstGesetzt) fehlt.push('Umsatzsteuer festlegen (MWST=0 für Kleinunternehmer oder MWST=19)');
  if (!mitKonten) fehlt.push('Datenbank mit Konten (Supabase, supabase/schema.sql)');
  const t = await rechtstexteFertig(env, origin);
  if (!t.ok) fehlt.push('Angaben in den Rechtstexten: ' + t.fehlt.join(', '));
  return { bereit: !fehlt.length, live: !!(k.stripe && !k.stripe.test), fehlt: fehlt };
}

/* Was vor dem Verkauf der Konfigurator-Pakete mit echtem Geld fehlt (wie verkaufStand, eigene Seitenliste: Ein Platzhalter in den
   Paketbedingungen schließt nur die Paket-Kasse, nie den Kauf der Hauseigentümer). Dazu die Paketbedingungen und der AV-Vertrag als PDF
   in der Fassung PAKET_STAND (gehen mit der Eingangsbestätigung raus) und das Geheimnis für die Sitzungen im Kundenkonto;
   dazu die anwaltlich geprüfte Vorlage für Impressum und Datenschutz der Instanzen (VORLAGE in functions/instanz/recht.js; Bauplan §4: Die Kasse
   bleibt zu, bis auch sie geprüft ist; die Live-Ampel der Instanzen zeigt das nur als Hinweis).
   Ob verkauft wird, entscheidet zusätzlich PAKETE_OFFEN (Instanzregeln.verkauf); im Test- und Attrappenmodus bleibt die Kasse offen. */
export const PAKET_SEITEN = ['/konfigurator-bedingungen/', '/impressum/', '/datenschutz/'];
export const paketPdfs = () => ['/konfigurator-bedingungen/paketbedingungen-' + PAKET_STAND + '.pdf', '/konfigurator-bedingungen/av-vertrag-' + PAKET_STAND + '.pdf'];
export async function paketVerkaufStand(k, env, origin) {
  const fehlt = [];
  if (!k.post || k.post.attrappe) fehlt.push('E-Mail-Versand (MAIL_API_KEY und MAIL_ABSENDER)');
  if (!k.mwstGesetzt) fehlt.push('Umsatzsteuer festlegen (MWST=0 für Kleinunternehmer oder MWST=19)');
  if (!k.daten) fehlt.push('Datenbank (Supabase, supabase/schema.sql)');
  if (!k.sitzung || !k.sitzung.geheimnis || k.sitzung.attrappe) fehlt.push('Geheimnis für die Sitzungen (SITZUNG_GEHEIMNIS)');
  if (!VORLAGE.geprueft) fehlt.push('Vorlage für Impressum und Datenschutz der Instanzen anwaltlich prüfen (functions/instanz/recht.js, VORLAGE)');
  const t = await rechtstexteFertig(env, origin, PAKET_SEITEN);
  if (!t.ok) fehlt.push('Angaben in den Paketbedingungen: ' + t.fehlt.join(', '));
  if (env && env.ASSETS && env.ASSETS.fetch) {
    for (const p of paketPdfs()) { let da = false; try { da = (await env.ASSETS.fetch(new Request(origin + p))).status === 200; } catch (e) { da = false; } if (!da) fehlt.push('PDF fehlt: ' + p); }
  }
  return { bereit: !fehlt.length, live: !!(k.stripe && !k.stripe.test), offen: !!k.paketeOffen, fehlt: fehlt };
}

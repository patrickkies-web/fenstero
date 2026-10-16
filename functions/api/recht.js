/* eeziframes · Stand der Rechtstexte und Wortlaut der Zustimmungen: eine Quelle für Server, App (über /api/status) und Prüfung.
   - AGB_STAND gehört zum „Stand“ auf /agb/ (<meta name="stand">), NB_STAND zu /nutzungsbedingungen/; scripts/pruefen.mjs prüft das.
     Ändert sich der Text der AGB, bekommt er hier einen neuen Stand: Die Kasse zeigt ihn, der Server nimmt nur Käufe mit genau diesem
     Stand an und speichert ihn mit dem Kauf (zahlungen.daten, Metadaten der Stripe-Kasse). Ebenso die Registrierung der Betriebe.
   - ZUSTIMMUNG ist der Haken an der Kasse: ausdrückliche Zustimmung zum Beginn vor Ablauf der Widerrufsfrist und Kenntnis vom Verlust
     des Widerrufsrechts (§ 356 Abs. 6 BGB). Die Vertragsbestätigung und die Stripe-Rechnung zitieren ihn wörtlich.
   - verkaufStand(): Was vor dem Verkauf mit echtem Geld fehlt. Im Live-Modus von Stripe (sk_live_…) nimmt die Kasse erst an, wenn
     der Mailversand steht (Vertragsbestätigung, Eingangsbestätigung eines Widerrufs), die Umsatzsteuer ausdrücklich festgelegt ist,
     Konten laufen und in den Rechtstexten keine Platzhalter mehr stehen (E-Mail-Adresse, Telefonnummer). /api/status zeigt das. */
export const AGB_STAND = '2026-10-16';
export const NB_STAND = '2026-10-16';
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
export async function rechtstexteFertig(env, origin) {
  if (!env || !env.ASSETS || !env.ASSETS.fetch) return { ok: true, ungeprueft: true }; // ohne Dateien (Prüfung im Speicher) nichts zu lesen
  const m = merk.get(origin);
  if (m && m.bis > Date.now()) return m.r;
  let r;
  try {
    const fehlt = new Set();
    for (const p of SEITEN) {
      const a = await env.ASSETS.fetch(new Request(origin + p));
      if (!a.ok) { fehlt.add('Seite ' + p + ' fehlt'); continue; }
      const t = await a.text();
      (t.match(/<mark class="ph">\[([^\]<]{1,60})\]<\/mark>/g) || []).forEach((x) => fehlt.add(x.replace(/<[^>]+>/g, '').replace(/^\[|\]$/g, '').replace(/ folgt$/, '')));
    }
    r = { ok: !fehlt.size, fehlt: Array.from(fehlt) };
  } catch (e) { r = { ok: false, fehlt: ['Rechtstexte nicht lesbar'] }; }
  merk.set(origin, { r: r, bis: Date.now() + 5 * 60 * 1000 });
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

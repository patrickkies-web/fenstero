/* eeziframes · Geld der Aufträge über Stripe (REST, stripe.js) oder die Attrappe (ZAHLUNG_ATTRAPPE=1 ohne Schlüssel)
   - Einrichtung beim Bestellen: Checkout (Karte oder SEPA-Lastschrift), Betrag aus pakete.js netto zzgl. Steuersatz, Rechnung von
     Stripe, Zahlungsmittel bleibt für das Abo hinterlegt. Metadaten art: 'auftrag', auftrag: <id> (zahlung.js leitet die Ereignisse her).
   - Monatsabo ab Live: Preis über lookup_key je Paket und Betrag (eine Preisänderung in pakete.js legt einen neuen Preis an, laufende
     Abos behalten ihren), Steuersatz wie oben.
   - Kundenportal (Rechnungen, Zahlungsmittel, Kündigung), Erstattung der Einrichtung beim Storno.
   API: kasse(ctx, a, kunde, o) → { id, url } · kassePruefen(ctx, session) → { bezahlt, laeuft, kunde, betragCent, intent }
        aboStarten(ctx, a, kunde) → { id, status, bis } · aboBeenden(ctx, a, sofort) · portal(ctx, kunde, zurueck) → url ·
        erstatten(ctx, a) → { ok } · mitStripe(k) */
import { ApiFehler, zufall } from '../api/umgebung.js';
import { stripe } from '../api/stripe.js';

const P = () => globalThis.Pakete;
const cent = (euro) => Math.round(Number(euro || 0) * 100);
export const mitStripe = (k) => !!k.stripe;
const attrappe = (k) => !k.stripe && !!k.zahlungAttrappe;
const pruefe = (k) => { if (!k.stripe && !k.zahlungAttrappe) throw new ApiFehler('Die Zahlung ist hier noch nicht eingerichtet (STRIPE_SECRET_KEY).', 503); };

/* Steuersatz 19 % zzgl. (Nettopreise für Unternehmer); ohne Umsatzsteuer (MWST=0) keiner. Einmal je Instanz gesucht oder angelegt. */
const merk = new Map();
async function steuersatz(ctx, s) {
  if (!mwst(ctx)) return '';
  const schluessel = ctx.k.stripe.key.slice(-10) + ':auftrag-mwst19';
  if (!merk.has(schluessel)) merk.set(schluessel, (async () => {
    const l = await s.get('/tax_rates', { active: true, inclusive: false, limit: 100 });
    const da = (l.data || []).find((t) => t.metadata && t.metadata.eeziframes === 'auftrag-mwst19' && Number(t.percentage) === 19);
    if (da) return da.id;
    return (await s.post('/tax_rates', { display_name: 'USt.', description: 'Umsatzsteuer 19 % zzgl.', percentage: 19, inclusive: false, country: 'DE', jurisdiction: 'DE', metadata: { eeziframes: 'auftrag-mwst19' } })).id;
  })().catch((e) => { merk.delete(schluessel); throw e; }));
  return merk.get(schluessel);
}
export const mwst = (ctx) => String((ctx.env || {}).MWST == null ? '19' : ctx.env.MWST).trim() !== '0';

/* Stripe-Kunde des Fensterbauers (einer je Kunde, Name und Anschrift aus dem Betrieb für die Rechnung) */
async function stripeKunde(ctx, s, a, kunde) {
  const b = (a.angaben || {}).betrieb || {};
  const daten = { email: kunde.mail, name: b.firma || kunde.mail, address: { line1: b.strasse || '', postal_code: b.plz || '', city: b.ort || '', country: 'DE' }, preferred_locales: ['de'], metadata: { eeziframes_kunde: kunde.id } };
  if (kunde.stripe) { await s.post('/customers/' + kunde.stripe, daten).catch(() => null); return kunde.stripe; }
  const c = await s.post('/customers', daten, { idem: 'auftrag-kunde-' + kunde.id });
  return c.id;
}

export async function kasse(ctx, a, kunde, o) {
  pruefe(ctx.k);
  const pr = a.preise || P().preis(a.paket), name = (P().PAKETE[a.paket] || {}).name || a.paket;
  if (attrappe(ctx.k)) { const id = 'test_' + zufall(10); return { id: id, url: o.zurueck.replace('{SESSION}', id), kunde: 'cus_test_' + zufall(6) }; }
  const s = stripe(ctx.k), [kid, steuer] = await Promise.all([stripeKunde(ctx, s, a, kunde), steuersatz(ctx, s)]);
  const posten = { quantity: 1, price_data: { currency: 'eur', unit_amount: cent(pr.einrichtung), product_data: { name: 'Einrichtung ' + name, description: 'Landingpage mit Konfigurator, einmalig (Auftrag ' + a.nr + ')' } } };
  if (steuer) posten.tax_rates = [steuer];
  const sess = await s.post('/checkout/sessions', {
    mode: 'payment', locale: 'de', customer: kid, line_items: [posten], payment_method_types: ['card', 'sepa_debit'],
    payment_intent_data: { setup_future_usage: 'off_session', metadata: { art: 'auftrag', auftrag: a.id, nr: a.nr } },
    invoice_creation: { enabled: true, invoice_data: { description: 'Einrichtung ' + name + ' · Auftrag ' + a.nr, metadata: { art: 'auftrag', auftrag: a.id } } },
    customer_update: { address: 'auto', name: 'auto' }, success_url: o.zurueck.replace('{SESSION}', '{CHECKOUT_SESSION_ID}'), cancel_url: o.abbruch,
    metadata: { art: 'auftrag', auftrag: a.id, nr: a.nr, paket: a.paket, agb: (a.zustimmung || {}).agb || '' }, client_reference_id: a.id
  }, { idem: 'auftrag-kasse-' + a.id + '-' + (a.version || 0) });
  return { id: sess.id, url: sess.url, kunde: kid };
}

/* Ergebnis einer Kasse: bezahlt (Karte), laeuft (SEPA unterwegs) */
export async function kassePruefen(ctx, session) {
  pruefe(ctx.k);
  if (attrappe(ctx.k)) return { bezahlt: /^test_/.test(session), laeuft: false, kunde: '', betragCent: 0, intent: '' };
  const s = stripe(ctx.k), x = await s.get('/checkout/sessions/' + encodeURIComponent(session), { 'expand[]': 'payment_intent' });
  const pi = x.payment_intent && typeof x.payment_intent === 'object' ? x.payment_intent : null;
  return { bezahlt: x.payment_status === 'paid', laeuft: x.status === 'complete' && x.payment_status === 'unpaid', kunde: x.customer || '', betragCent: x.amount_total || 0, intent: pi ? pi.id : (x.payment_intent || ''), zahlungsmittel: pi ? pi.payment_method || '' : '', auftrag: (x.metadata || {}).auftrag || '' };
}

/* Monatsabo ab Live: Preis über lookup_key, Zahlungsmittel aus der Einrichtung */
export async function aboStarten(ctx, a, kunde) {
  pruefe(ctx.k);
  const monat = (a.preise || P().preis(a.paket)).monat, name = (P().PAKETE[a.paket] || {}).name || a.paket;
  if (attrappe(ctx.k)) { const bis = new Date(Date.now() + 30 * 864e5).toISOString(); return { id: 'sub_test_' + zufall(8), status: 'aktiv', bis: bis }; }
  const s = stripe(ctx.k), key = 'eezi-auftrag-' + a.paket + '-' + cent(monat);
  const l = await s.get('/prices', { 'lookup_keys[]': key, active: true, limit: 1 });
  const preis = (l.data && l.data[0]) ? l.data[0].id : (await s.post('/prices', { currency: 'eur', unit_amount: cent(monat), recurring: { interval: 'month' }, lookup_key: key, product_data: { name: 'Monatsabo ' + name } })).id;
  const steuer = await steuersatz(ctx, s), z = a.zahlung || {};
  const sub = await s.post('/subscriptions', { customer: kunde.stripe || z.kunde, items: [{ price: preis }], default_tax_rates: steuer ? [steuer] : undefined, default_payment_method: z.zahlungsmittel || undefined, collection_method: 'charge_automatically', metadata: { art: 'auftrag', auftrag: a.id, nr: a.nr }, payment_behavior: 'allow_incomplete' }, { idem: 'auftrag-abo-' + a.id });
  const ende = (sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end) || sub.current_period_end || 0;
  return { id: sub.id, status: sub.status === 'active' || sub.status === 'trialing' ? 'aktiv' : sub.status, bis: ende ? new Date(ende * 1000).toISOString() : '' };
}
export async function aboBeenden(ctx, a, sofort) {
  const id = (a.abo || {}).id; if (!id) return { ok: true, ohne: true };
  if (attrappe(ctx.k) || /^sub_test_/.test(id)) return { ok: true };
  const s = stripe(ctx.k);
  if (sofort) await s.del('/subscriptions/' + id); else await s.post('/subscriptions/' + id, { cancel_at_period_end: true });
  return { ok: true };
}
/* Kundenportal mit eigener Konfiguration (einmal je Konto gesucht oder angelegt): Rechnungen, Zahlungsmittel, Rechnungsangaben,
   Kündigung zum Ende des bezahlten Monats (Paketbedingungen § 7 Abs. 1) */
async function portalKonfiguration(ctx, s) {
  const schluessel = ctx.k.stripe.key.slice(-10) + ':portal-auftrag-v1';
  if (!merk.has(schluessel)) merk.set(schluessel, (async () => {
    const l = await s.get('/billing_portal/configurations', { active: true, limit: 100 });
    const da = (l.data || []).find((c) => c.metadata && c.metadata.eeziframes === 'auftrag-v1');
    if (da) return da.id;
    return (await s.post('/billing_portal/configurations', { business_profile: { headline: 'eeziframes: Rechnungen, Zahlung und Abo Ihrer Seite' }, features: { invoice_history: { enabled: true }, payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ['email', 'address', 'name', 'tax_id'] }, subscription_cancel: { enabled: true, mode: 'at_period_end', proration_behavior: 'none' } }, metadata: { eeziframes: 'auftrag-v1' } }, { idem: 'eeziframes-portal-auftrag-v1' })).id;
  })().catch((e) => { merk.delete(schluessel); throw e; }));
  return merk.get(schluessel);
}
export async function portal(ctx, kunde, zurueck) {
  pruefe(ctx.k);
  if (attrappe(ctx.k)) return zurueck;
  if (!kunde.stripe) throw new ApiFehler('Rechnungen gibt es nach der ersten Zahlung.', 409);
  const s = stripe(ctx.k);
  return (await s.post('/billing_portal/sessions', { customer: kunde.stripe, return_url: zurueck, locale: 'de', configuration: await portalKonfiguration(ctx, s) })).url;
}
/* Einrichtung voll erstatten (Storno vor Beginn der Arbeit) */
export async function erstatten(ctx, a) {
  const z = a.zahlung || {};
  if (z.status !== 'bezahlt') return { ok: true, ohne: true };
  if (attrappe(ctx.k) || /^test_/.test(z.session || '')) return { ok: true, cent: z.betrag_cent || 0 };
  if (!z.intent) throw new ApiFehler('Zur Zahlung fehlt die Kennung bei Stripe; bitte im Stripe-Dashboard erstatten.', 409);
  const r = await stripe(ctx.k).post('/refunds', { payment_intent: z.intent, metadata: { art: 'auftrag', auftrag: a.id } }, { idem: 'auftrag-erstattung-' + a.id });
  return { ok: true, cent: r.amount || 0 };
}

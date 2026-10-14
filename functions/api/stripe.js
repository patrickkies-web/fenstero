/* Fensterino · Stripe über die REST-Schnittstelle (ohne SDK, läuft im Cloudflare Worker).
   Alles, was Karten oder Kontodaten berührt, passiert auf von Stripe gehosteten Seiten (Checkout): Bezahlen des Aufmaßblatts,
   Zahlungsart hinterlegen (mode=setup), Abo abschließen (mode=subscription). Unsere Seiten sehen nie eine Kartennummer.
   Attrappe (ZAHLUNG_ATTRAPPE=1): Rückkehr-Adressen mit test_-Kennungen, ohne Stripe. */
import { ApiFehler, hmac, hex, zufall } from './umgebung.js';

const VERSION = '2024-06-20';
function flach(obj, prefix, out) {
  out = out || [];
  Object.keys(obj).forEach((k) => {
    const v = obj[k], key = prefix ? prefix + '[' + k + ']' : k;
    if (v === undefined || v === null || v === '') return;
    if (Array.isArray(v)) v.forEach((x, i) => { if (typeof x === 'object') flach(x, key + '[' + i + ']', out); else out.push([key + '[' + i + ']', x]); });
    else if (typeof v === 'object') flach(v, key, out);
    else out.push([key, v]);
  });
  return out;
}
const form = (obj) => flach(obj).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v))).join('&');

export function stripe(k) {
  if (!k.stripe) return null;
  const auth = 'Basic ' + btoa(k.stripe.key + ':');
  async function call(method, pfad, params) {
    const r = await fetch('https://api.stripe.com/v1' + pfad, { method: method, headers: { Authorization: auth, 'content-type': 'application/x-www-form-urlencoded', 'Stripe-Version': VERSION }, body: params ? form(params) : undefined });
    let data = null; try { data = await r.json(); } catch (e) { data = null; }
    if (!r.ok) { const msg = data && data.error && data.error.message ? data.error.message : 'Stripe antwortet nicht (' + r.status + ')'; console.log('Stripe-Fehler', pfad, msg.slice(0, 200)); throw new ApiFehler('Zahlungsdienst: ' + msg, 502); }
    return data;
  }
  return { post: (p, params) => call('POST', p, params), get: (p, params) => call('GET', p + (params ? '?' + form(params) : '')), del: (p) => call('DELETE', p) };
}

/* Webhook-Unterschrift: Stripe-Signature: t=…,v1=…; Nutzlast = t + "." + Rohtext, HMAC-SHA256 mit dem Webhook-Geheimnis */
export async function webhookEcht(k, roh, kopf) {
  if (!k.stripe || !k.stripe.webhook) return false;
  const teile = {}; String(kopf || '').split(',').forEach((p) => { const i = p.indexOf('='); if (i > 0) { const key = p.slice(0, i).trim(); (teile[key] = teile[key] || []).push(p.slice(i + 1).trim()); } });
  const t = teile.t && teile.t[0], v1 = teile.v1 || [];
  if (!t || !v1.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const soll = hex(await hmac(k.stripe.webhook, t + '.' + roh));
  return v1.some((v) => v.length === soll.length && v.split('').every((ch, i) => ch === soll[i]));
}

const label = (pm) => {
  if (!pm) return { type: 'Zahlungsart', label: 'hinterlegt' };
  if (pm.type === 'sepa_debit') return { type: 'SEPA-Lastschrift', label: (pm.sepa_debit.country || 'DE') + ' •••• ' + pm.sepa_debit.last4 };
  if (pm.type === 'card') return { type: 'Karte', label: (pm.card.brand || 'Karte') + ' •••• ' + pm.card.last4 };
  return { type: pm.type, label: 'hinterlegt' };
};

/* ---------- Was der Rest des Servers braucht ---------- */
export function zahlungsdienst(k) {
  const s = stripe(k);
  if (!s && !k.zahlungAttrappe) return null;
  const testId = (prefix) => prefix + '_' + zufall(9);
  return {
    art: s ? 'stripe' : 'attrappe',
    /* Aufmaßblatt kaufen: Rückkehr nach /app/?bezahlt=<session> */
    async aufmassKasse(o) {
      if (!s) return { id: testId('test'), url: o.zurueck + (o.zurueck.includes('?') ? '&' : '?') + 'bezahlt=' + testId('test') + '&kennung=' + encodeURIComponent(o.kennung) };
      const posten = k.stripe.preisAufmass ? { price: k.stripe.preisAufmass, quantity: 1 } : { quantity: 1, price_data: { currency: 'eur', unit_amount: Math.round(k.preise.aufmass * 100), tax_behavior: k.stripe.steuerInkl ? 'inclusive' : undefined, product_data: { name: 'Fensterino Aufmaßblatt', description: 'Ihr Fenster-Aufmaß als PDF: alle Maße, Fotoauswertung, Wünsche, mit Code für den Fensterbauer' } } };
      if (k.stripe.steuerInkl) posten.tax_rates = [k.stripe.steuerInkl];
      const sess = await s.post('/checkout/sessions', { mode: 'payment', locale: 'de', customer_email: o.mail, client_reference_id: o.kennung, success_url: o.zurueck + (o.zurueck.includes('?') ? '&' : '?') + 'bezahlt={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, line_items: [posten], invoice_creation: { enabled: true }, payment_intent_data: { description: 'Fensterino Aufmaßblatt ' + o.kennung }, metadata: { art: 'aufmass', kennung: o.kennung } });
      return { id: sess.id, url: sess.url };
    },
    /* Ist die Kasse bezahlt? Liefert Kennung und E-Mail zurück */
    async kasseGeprueft(session) {
      if (!s) return session.startsWith('test_') ? { bezahlt: true, kennung: '', mail: '', betragCent: Math.round(k.preise.aufmass * 100) } : { bezahlt: false };
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session));
      return { bezahlt: sess.payment_status === 'paid', kennung: (sess.metadata && sess.metadata.kennung) || sess.client_reference_id || '', mail: (sess.customer_details && sess.customer_details.email) || sess.customer_email || '', betragCent: sess.amount_total || 0, mode: sess.mode, subscription: sess.subscription || '', setupIntent: sess.setup_intent || '', customer: sess.customer || '' };
    },
    async kundeAnlegen(o) {
      if (!s) return 'cus_test_' + zufall(6);
      const c = await s.post('/customers', { email: o.mail, name: o.name, description: 'Fensterino Betrieb ' + o.id, metadata: { betrieb: o.id }, preferred_locales: ['de'] });
      return c.id;
    },
    /* Zahlungsart hinterlegen (SEPA oder Karte) auf der Stripe-Seite; Rückkehr nach /?zahlungsart=<session> */
    async zahlungsartKasse(o) {
      if (!s) return { url: o.zurueck + '?zahlungsart=' + testId('test') };
      const sess = await s.post('/checkout/sessions', { mode: 'setup', locale: 'de', customer: o.customer, payment_method_types: ['sepa_debit', 'card'], success_url: o.zurueck + '?zahlungsart={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, metadata: { art: 'zahlungsart', betrieb: o.id } });
      return { url: sess.url };
    },
    /* Nach der Rückkehr: die hinterlegte Zahlungsart lesen und als Standard für Rechnungen setzen */
    async zahlungsartUebernehmen(session) {
      if (!s) return session.startsWith('test_') ? { type: 'SEPA-Lastschrift', label: 'DE •••• 0000 (Test)' } : null;
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['setup_intent.payment_method'] });
      const pm = sess.setup_intent && sess.setup_intent.payment_method; if (!pm || !sess.customer) return null;
      await s.post('/customers/' + sess.customer, { invoice_settings: { default_payment_method: pm.id } });
      return label(pm);
    },
    /* Abo abschließen: Rückkehr nach /?abo=<session>; Plan steht in den Metadaten */
    async aboKasse(o) {
      if (!s) return { url: o.zurueck + '?abo=' + testId('test') + '&plan=' + o.plan };
      const preis = o.plan === 'plus' ? k.stripe.preisPlus : k.stripe.preisAbo;
      if (!preis) throw new ApiFehler('Für ' + (o.plan === 'plus' ? 'Plus' : 'Abo 10') + ' ist bei Stripe noch keine Preis-ID eingetragen (STRIPE_PRICE_' + (o.plan === 'plus' ? 'PLUS' : 'ABO') + ').', 503);
      const sess = await s.post('/checkout/sessions', { mode: 'subscription', locale: 'de', customer: o.customer, line_items: [{ price: preis, quantity: 1 }], success_url: o.zurueck + '?abo={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, subscription_data: { metadata: { betrieb: o.id, plan: o.plan }, default_tax_rates: k.stripe.steuer ? [k.stripe.steuer] : undefined }, metadata: { art: 'abo', betrieb: o.id, plan: o.plan } });
      return { url: sess.url };
    },
    /* Nach der Rückkehr: Abo-Kennung und die dabei hinterlegte Zahlungsart */
    async aboUebernehmen(session, planAttrappe) {
      if (!s) return session.startsWith('test_') ? { subscription: 'sub_test_' + zufall(6), plan: planAttrappe || 'abo', pay: { type: 'SEPA-Lastschrift', label: 'DE •••• 0000 (Test)' } } : null;
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['subscription.default_payment_method'] });
      if (!sess.subscription || sess.status !== 'complete') return null;
      const sub = sess.subscription, pm = sub.default_payment_method;
      if (pm && sess.customer) await s.post('/customers/' + sess.customer, { invoice_settings: { default_payment_method: pm.id } });
      return { subscription: sub.id, plan: (sub.metadata && sub.metadata.plan) || (sess.metadata && sess.metadata.plan) || 'abo', pay: pm ? label(pm) : null, bis: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null };
    },
    /* Bestehendes Abo auf einen anderen Plan umstellen (sofort, anteilig) oder zum Periodenende kündigen bzw. Kündigung zurücknehmen */
    async aboAendern(subscription, plan) {
      if (!s) return true;
      const preis = plan === 'plus' ? k.stripe.preisPlus : k.stripe.preisAbo;
      if (!preis) throw new ApiFehler('Preis-ID für ' + plan + ' fehlt (STRIPE_PRICE_' + plan.toUpperCase() + ').', 503);
      const sub = await s.get('/subscriptions/' + subscription);
      const item = sub.items && sub.items.data && sub.items.data[0];
      await s.post('/subscriptions/' + subscription, { cancel_at_period_end: false, proration_behavior: 'create_prorations', items: [{ id: item ? item.id : undefined, price: preis }], metadata: { plan: plan } });
      return true;
    },
    async aboKuendigen(subscription, zurueck) {
      if (!s) return true;
      await s.post('/subscriptions/' + subscription, { cancel_at_period_end: !zurueck });
      return true;
    },
    /* Sammelrechnung für offene Projektbuchungen eines Betriebs: Posten anlegen, Rechnung erstellen und abschließen (Stripe zieht ein) */
    async rechnung(o) {
      if (!s) return { nr: 'RE-TEST-' + zufall(3).toUpperCase(), id: 'in_test_' + zufall(6) };
      for (const p of o.posten) await s.post('/invoiceitems', { customer: o.customer, amount: Math.round(p.betrag * 100), currency: 'eur', description: p.text, tax_rates: k.stripe.steuer ? [k.stripe.steuer] : undefined });
      const inv = await s.post('/invoices', { customer: o.customer, collection_method: 'charge_automatically', auto_advance: true, description: 'Fensterino: Projekte mit eingegangenem Aufmaß', metadata: { betrieb: o.id } });
      const fin = await s.post('/invoices/' + inv.id + '/finalize');
      return { nr: fin.number || fin.id, id: fin.id, betrag: (fin.total || 0) / 100 };
    }
  };
}

/* eeziframes · Stripe über die REST-Schnittstelle (ohne SDK, läuft im Cloudflare Worker).
   Alles, was Karten oder Kontodaten berührt, passiert auf von Stripe gehosteten Seiten (Checkout): Bezahlen des Aufmaßblatts,
   Zahlungsart hinterlegen (mode=setup), Abo abschließen (mode=subscription). Unsere Seiten sehen nie eine Kartennummer.
   Einzurichten sind nur der Geheimschlüssel und das Webhook-Geheimnis: Die Preise für Abo 10 und Plus und die Steuersätze legt der
   Server beim ersten Bedarf selbst bei Stripe an und findet sie danach wieder (Preise über lookup_key, Steuersätze über Metadaten).
   Eingetragene IDs (STRIPE_PRICE_…, STRIPE_TAX_RATE…) haben Vorrang. MWST=0 (Kleinunternehmer): keine Steuersätze, dafür der
   Hinweis nach § 19 UStG auf jeder Rechnung.
   API-Version fest 2024-06-20. Webhooks: Snapshot-Ereignisse kommen in der Version, die beim Ziel in Stripe eingestellt ist (konten.js
   liest alte und neue Form); bei Thin-Ereignissen holt der Server das Objekt selbst, dann in dieser Version (zahlung.js).
   Attrappe (ZAHLUNG_ATTRAPPE=1): Rückkehr-Adressen mit test_-Kennungen, ohne Stripe. */
import { ApiFehler, hmac, hex, zufall } from './umgebung.js';

const VERSION = '2024-06-20';
/* Nur für die Kasse des Aufmaßblatts: excluded_payment_method_types gibt es erst in neueren Versionen (in dieser Version fehlt
   dafür payment_method_types, das die Kasse nicht nutzt). Ausgeschlossen sind Zahlarten, die erst nach Tagen bestätigen
   (SEPA-Lastschrift, Überweisung): Das Blatt wird sofort geliefert. */
const VERSION_KASSE = '2026-09-30.endive';
const SPAETER = ['sepa_debit', 'customer_balance', 'sofort'];
export const KLEINUNTERNEHMER = 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';

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
  /* o.version: abweichende API-Version für diese eine Anfrage; o.idem: Idempotency-Key (Stripe legt bei Wiederholung nichts doppelt an) */
  async function call(method, pfad, params, o) {
    o = o || {};
    const headers = { Authorization: auth, 'content-type': 'application/x-www-form-urlencoded', 'Stripe-Version': o.version || VERSION };
    if (o.idem) headers['Idempotency-Key'] = o.idem;
    const r = await fetch('https://api.stripe.com/v1' + pfad, { method: method, headers: headers, body: params ? form(params) : undefined });
    let data = null; try { data = await r.json(); } catch (e) { data = null; }
    if (!r.ok) { const msg = data && data.error && data.error.message ? data.error.message : 'Stripe antwortet nicht (' + r.status + ')'; console.log('Stripe-Fehler', method, pfad, msg.slice(0, 200)); throw new ApiFehler('Zahlungsdienst: ' + msg, 502); }
    return data;
  }
  return { post: (p, params, o) => call('POST', p, params, o), get: (p, params) => call('GET', p + (params ? '?' + form(params) : '')), del: (p) => call('DELETE', p) };
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
  if (!pm) return { type: 'Zahlungsart', label: 'bei Stripe hinterlegt' };
  if (pm.type === 'sepa_debit') return { type: 'SEPA-Lastschrift', label: (pm.sepa_debit.country || 'DE') + ' •••• ' + pm.sepa_debit.last4 };
  if (pm.type === 'card') return { type: 'Karte', label: (pm.card.brand || 'Karte') + ' •••• ' + pm.card.last4 };
  if (pm.type === 'paypal') return { type: 'PayPal', label: (pm.paypal && pm.paypal.payer_email) || 'verbunden' };
  return { type: pm.type, label: 'hinterlegt' };
};
const idVon = (v) => (v && typeof v === 'object' ? v.id : v) || '';
const LAUFEND = ['active', 'trialing', 'past_due']; // Abo läuft (past_due: Zahlung wird noch versucht)

/* Einmal gefundene Preise und Steuersätze je Instanz merken (Schlüsselende trennt Test- und Live-Modus) */
const merk = new Map();
function einmal(schluessel, fn) {
  if (!merk.has(schluessel)) merk.set(schluessel, fn().catch((e) => { merk.delete(schluessel); throw e; }));
  return merk.get(schluessel);
}

/* ---------- Was der Rest des Servers braucht ---------- */
export function zahlungsdienst(k) {
  const s = stripe(k);
  if (!s && !k.zahlungAttrappe) return null;
  const testId = (prefix) => prefix + '_' + zufall(9);
  const konto = s ? k.stripe.key.slice(-10) : '';
  /* Steuersatz 19 %: inklusiv für das Aufmaßblatt (Bruttopreis), exklusiv für Betriebe (Nettopreise); leer ohne Umsatzsteuer */
  function steuersatz(inklusiv) {
    if (!k.preise.mwst) return Promise.resolve('');
    const fest = inklusiv ? k.stripe.steuerInkl : k.stripe.steuer; if (fest) return Promise.resolve(fest);
    const kenn = inklusiv ? 'mwst19-inkl' : 'mwst19';
    return einmal(konto + ':' + kenn, async () => {
      const liste = await s.get('/tax_rates', { active: true, inclusive: inklusiv, limit: 100 });
      const da = (liste.data || []).find((t) => t.metadata && t.metadata.eeziframes === kenn && t.inclusive === inklusiv && Number(t.percentage) === 19);
      if (da) return da.id;
      const neu = await s.post('/tax_rates', { display_name: 'MwSt.', description: 'Umsatzsteuer 19 %' + (inklusiv ? ', im Preis enthalten (Aufmaßblatt)' : ', zzgl. (Betriebe)'), percentage: 19, inclusive: inklusiv, country: 'DE', jurisdiction: 'DE', tax_type: 'vat', metadata: { eeziframes: kenn } }, { idem: 'eeziframes-' + kenn + '-v1' });
      return neu.id;
    });
  }
  /* Monatspreis für Abo 10 oder Plus; der lookup_key enthält den Betrag, eine Preisänderung (PREIS_ABO, PREIS_PLUS) legt also einen neuen Preis an */
  function preis(plan) {
    const fest = plan === 'plus' ? k.stripe.preisPlus : k.stripe.preisAbo; if (fest) return Promise.resolve(fest);
    const cent = Math.round((plan === 'plus' ? k.preise.plus : k.preise.abo.grund) * 100), lookup = 'eeziframes_' + plan + '_' + cent + '_eur_monat';
    return einmal(konto + ':' + lookup, async () => {
      const liste = await s.get('/prices', { lookup_keys: [lookup], active: true, limit: 1 });
      if (liste.data && liste.data[0]) return liste.data[0].id;
      const name = plan === 'plus' ? 'eeziframes Plus' : 'eeziframes Abo 10';
      const neu = await s.post('/prices', { currency: 'eur', unit_amount: cent, recurring: { interval: 'month' }, lookup_key: lookup, tax_behavior: 'exclusive', nickname: name + ', monatlich', product_data: { name: name, metadata: { eeziframes: plan } }, metadata: { eeziframes: plan } }, { idem: 'eeziframes-' + lookup });
      return neu.id;
    });
  }
  return {
    art: s ? 'stripe' : 'attrappe',
    /* Aufmaßblatt kaufen: Rückkehr nach /app/?bezahlt=<session> */
    async aufmassKasse(o) {
      if (!s) { const id = testId('test'); return { id: id, url: o.zurueck + (o.zurueck.includes('?') ? '&' : '?') + 'bezahlt=' + id + '&kennung=' + encodeURIComponent(o.kennung) }; }
      const steuer = await steuersatz(true);
      const posten = k.stripe.preisAufmass ? { price: k.stripe.preisAufmass, quantity: 1 } : { quantity: 1, price_data: { currency: 'eur', unit_amount: Math.round(k.preise.aufmass * 100), tax_behavior: steuer ? 'inclusive' : undefined, product_data: { name: 'eeziframes Aufmaßblatt', description: 'Ihr Fenster-Aufmaß als PDF: alle Maße, Fotoauswertung, Wünsche, mit Code für den Fensterbauer' } } };
      if (steuer) posten.tax_rates = [steuer];
      const sess = await s.post('/checkout/sessions', { mode: 'payment', locale: 'de', customer_email: o.mail, client_reference_id: o.kennung, success_url: o.zurueck + (o.zurueck.includes('?') ? '&' : '?') + 'bezahlt={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, line_items: [posten], excluded_payment_method_types: SPAETER, invoice_creation: { enabled: true, invoice_data: k.preise.mwst ? undefined : { footer: KLEINUNTERNEHMER } }, payment_intent_data: { description: 'eeziframes Aufmaßblatt ' + o.kennung }, metadata: { art: 'aufmass', kennung: o.kennung } }, { version: VERSION_KASSE });
      return { id: sess.id, url: sess.url };
    },
    /* Ist die Kasse bezahlt? Liefert Kennung und E-Mail zurück. wartet: abgeschlossen, aber die Zahlung ist noch unterwegs */
    async kasseGeprueft(session) {
      if (!s) return session.startsWith('test_') ? { bezahlt: true, kennung: '', mail: '', betragCent: Math.round(k.preise.aufmass * 100) } : { bezahlt: false, wartet: session.startsWith('wartet_') };
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['payment_intent'] });
      if (sess.mode !== 'payment' || !sess.metadata || sess.metadata.art !== 'aufmass') return { bezahlt: false }; // nur Kassen für das Aufmaßblatt
      const pi = sess.payment_intent && typeof sess.payment_intent === 'object' ? sess.payment_intent : null;
      return { bezahlt: sess.payment_status === 'paid', wartet: sess.status === 'complete' && sess.payment_status === 'unpaid' && (!pi || pi.status === 'processing' || pi.status === 'requires_action'), kennung: (sess.metadata && sess.metadata.kennung) || sess.client_reference_id || '', mail: (sess.customer_details && sess.customer_details.email) || sess.customer_email || '', betragCent: sess.amount_total || 0, mode: sess.mode, subscription: idVon(sess.subscription), setupIntent: idVon(sess.setup_intent), customer: idVon(sess.customer) };
    },
    async kundeAnlegen(o) {
      if (!s) return 'cus_test_' + zufall(6);
      const c = await s.post('/customers', { email: o.mail, name: o.name, description: 'eeziframes Betrieb ' + o.id, metadata: { betrieb: o.id }, preferred_locales: ['de'], invoice_settings: k.preise.mwst ? undefined : { footer: KLEINUNTERNEHMER } }, { idem: 'eeziframes-kunde-' + o.id });
      return c.id;
    },
    /* Zahlungsart hinterlegen (SEPA oder Karte) auf der Stripe-Seite; Rückkehr nach /?zahlungsart=<session> */
    async zahlungsartKasse(o) {
      if (!s) return { url: o.zurueck + '?zahlungsart=' + testId('test') };
      const sess = await s.post('/checkout/sessions', { mode: 'setup', locale: 'de', customer: o.customer, payment_method_types: ['sepa_debit', 'card'], success_url: o.zurueck + '?zahlungsart={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, metadata: { art: 'zahlungsart', betrieb: o.id } });
      return { url: sess.url };
    },
    /* Nach der Rückkehr oder per Webhook: die hinterlegte Zahlungsart lesen (schreibt nichts). betrieb: aus den Metadaten der Kasse,
       null = unbekannt (Attrappe); created: wann die Kasse angelegt wurde, damit eine spät zugestellte ältere Kasse nichts überschreibt */
    async zahlungsartLesen(session) {
      if (!s) return session.startsWith('test_') ? { pay: { type: 'SEPA-Lastschrift', label: 'DE •••• 0000 (Test)' }, pm: '', customer: '', betrieb: null, created: Math.floor(Date.now() / 1000) } : null;
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['setup_intent.payment_method'] });
      const pm = sess.setup_intent && sess.setup_intent.payment_method, customer = idVon(sess.customer);
      if (sess.mode !== 'setup' || !sess.metadata || sess.metadata.art !== 'zahlungsart' || sess.status !== 'complete' || !pm || typeof pm !== 'object' || !customer) return null;
      return { pay: label(pm), pm: pm.id, customer: customer, betrieb: sess.metadata.betrieb || '', created: sess.created || 0 };
    },
    /* Zahlungsart als Standard setzen: für Rechnungen des Kunden und, falls angegeben, für sein laufendes Abo
       (Stripe zieht Abos von der Zahlungsart des Abos ein, nicht vom Standard des Kunden) */
    async standardZahlungsart(customer, pm, subscription) {
      if (!s || !customer || !pm) return;
      await s.post('/customers/' + customer, { invoice_settings: { default_payment_method: pm } });
      if (subscription) await s.post('/subscriptions/' + subscription, { default_payment_method: pm });
    },
    /* Läuft dieses Abo bei Stripe noch? */
    async aboLaeuft(subscription) {
      if (!s || !subscription) return false;
      try { return LAUFEND.includes((await s.get('/subscriptions/' + subscription)).status); } catch (e) { return false; }
    },
    /* Abo abschließen: Rückkehr nach /?abo=<session>; Plan steht in den Metadaten */
    async aboKasse(o) {
      if (!s) return { url: o.zurueck + '?abo=' + testId('test') + '&plan=' + o.plan };
      /* Läuft bei Stripe schon ein Abo (etwa weil eine Rückmeldung verloren ging), wird es übernommen statt ein zweites abgeschlossen */
      const abos = await s.get('/subscriptions', { customer: o.customer, status: 'all', limit: 10 });
      const laufend = (abos.data || []).find((x) => LAUFEND.includes(x.status));
      if (laufend) return { vorhanden: laufend.id };
      /* Nur eine offene Abo-Kasse je Betrieb: zwei bezahlte Kassen ergäben zwei Abos */
      const offen = await s.get('/checkout/sessions', { customer: o.customer, status: 'open', limit: 10 });
      for (const alt of (offen.data || []).filter((x) => x.mode === 'subscription')) { try { await s.post('/checkout/sessions/' + alt.id + '/expire'); } catch (e) { /* schon abgeschlossen oder verfallen */ } }
      const [preisId, steuer] = await Promise.all([preis(o.plan), steuersatz(false)]);
      const sess = await s.post('/checkout/sessions', { mode: 'subscription', locale: 'de', customer: o.customer, line_items: [{ price: preisId, quantity: 1 }], success_url: o.zurueck + '?abo={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, subscription_data: { metadata: { betrieb: o.id, plan: o.plan }, default_tax_rates: steuer ? [steuer] : undefined }, metadata: { art: 'abo', betrieb: o.id, plan: o.plan } });
      return { url: sess.url };
    },
    /* Nach der Rückkehr oder per Webhook: Abo-Kennung, Plan und die dabei hinterlegte Zahlungsart (schreibt nichts).
       Nur ein laufendes Abo zählt: Eine spät zugestellte Kasse eines inzwischen beendeten Abos ändert nichts mehr.
       Der Plan kommt vom Abo selbst (bei einem Wechsel wird er dort mitgeändert), sonst aus der Kasse.
       Läuft die erste Zahlung noch (SEPA), ist das Abo trotzdem aktiv: Betriebe zahlen nachträglich, wie bei der Sammelrechnung;
       scheitert die Zahlung, mahnt Stripe und beendet das Abo am Ende (customer.subscription.deleted). */
    async aboLesen(session, planAttrappe) {
      if (!s) return session.startsWith('test_') ? { session: session, subscription: 'sub_test_' + zufall(6), plan: planAttrappe || 'abo', pay: { type: 'SEPA-Lastschrift', label: 'DE •••• 0000 (Test)' }, pm: '', customer: '', betrieb: null, created: Math.floor(Date.now() / 1000), bezahlt: false } : null;
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['subscription.default_payment_method'] });
      const sub = sess.subscription && typeof sess.subscription === 'object' ? sess.subscription : null, customer = idVon(sess.customer);
      if (sess.mode !== 'subscription' || !sess.metadata || sess.metadata.art !== 'abo' || sess.status !== 'complete' || !sub || !LAUFEND.includes(sub.status)) return null;
      const pm = sub.default_payment_method && typeof sub.default_payment_method === 'object' ? sub.default_payment_method : null;
      const ende = sub.current_period_end || (sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end) || 0;
      const plan = ['abo', 'plus'].includes(sub.metadata && sub.metadata.plan) ? sub.metadata.plan : ['abo', 'plus'].includes(sess.metadata.plan) ? sess.metadata.plan : 'abo';
      return { session: session, subscription: sub.id, plan: plan, pay: pm ? label(pm) : null, pm: pm ? pm.id : '', customer: customer, betrieb: sess.metadata.betrieb || '', created: sess.created || 0, bezahlt: sess.payment_status === 'paid', bis: ende ? new Date(ende * 1000) : null };
    },
    /* Bestehendes Abo auf einen anderen Plan umstellen (sofort, anteilig) oder zum Periodenende kündigen bzw. Kündigung zurücknehmen */
    async aboAendern(subscription, plan) {
      if (!s) return true;
      const [preisId, steuer] = await Promise.all([preis(plan), steuersatz(false)]);
      const sub = await s.get('/subscriptions/' + subscription);
      const item = sub.items && sub.items.data && sub.items.data[0];
      await s.post('/subscriptions/' + subscription, { cancel_at_period_end: false, proration_behavior: 'create_prorations', items: [{ id: item ? item.id : undefined, price: preisId }], default_tax_rates: steuer ? [steuer] : undefined, metadata: { plan: plan } });
      return true;
    },
    async aboKuendigen(subscription, zurueck) {
      if (!s) return true;
      await s.post('/subscriptions/' + subscription, { cancel_at_period_end: !zurueck });
      return true;
    },
    /* Abo sofort beenden (Zentrale: Konto löschen oder „sofort beenden“); ein schon beendetes Abo zählt als erledigt */
    async aboBeenden(subscription) {
      if (!s || !subscription) return true;
      try { await s.del('/subscriptions/' + encodeURIComponent(subscription)); } catch (e) { if (/no such subscription|already (been )?cancel|canceled subscription/i.test(String(e && e.message))) return true; throw e; }
      return true;
    },
    /* Objekt zu einem Thin-Ereignis holen: related_object.url aus dem unterschriebenen Ereignis, nur die Arten, die der Webhook braucht */
    async objekt(url) {
      if (!s || !/^\/v1\/(checkout\/sessions|invoices|subscriptions)\/[A-Za-z0-9_]+$/.test(String(url || ''))) return null;
      return s.get(String(url).slice(3));
    },
    /* Sammelrechnung für offene Projektbuchungen eines Betriebs (o.posten: { buchung, betrag, text }).
       1. Was Stripe schon auf einer abgeschlossenen Rechnung hat (früherer Lauf, danach Speichern fehlgeschlagen), wird nicht noch einmal
          berechnet, sondern als „schon“ zurückgegeben; die Buchungs-Kennung steht in den Metadaten jedes Postens.
       2. Neue Rechnung als Entwurf ohne fremde offene Posten, die Posten direkt daran, dann abschließen; Stripe zieht ein.
          Geht unterwegs etwas schief, werden Posten und Entwurf wieder gelöscht. Höchstens 250 Posten je Rechnung (Grenze bei Stripe). */
    async rechnung(o) {
      if (!s) return { neu: { nr: 'RE-TEST-' + zufall(3).toUpperCase(), id: 'in_test_' + zufall(6), buchungen: o.posten.map((p) => p.buchung) }, schon: [] };
      const offen = new Set(o.posten.map((p) => p.buchung)), schon = new Map(), liegen = [];
      let nach = '';
      for (let seite = 0; seite < 5; seite++) {
        const vorher = await s.get('/invoiceitems', { customer: o.customer, limit: 100, starting_after: nach || undefined, expand: ['data.invoice'] });
        (vorher.data || []).forEach((it) => {
          const b = it.metadata && it.metadata.buchung, inv = it.invoice && typeof it.invoice === 'object' ? it.invoice : null;
          /* Unsere Posten entstehen nur direkt an einem Entwurf; einer ohne Rechnung stammt aus einem gelöschten Entwurf und käme sonst
             auf die nächste Abo-Rechnung: weg damit */
          if (!inv) { if (b && it.metadata.betrieb === o.id) liegen.push(it.id); return; }
          if (!b || !offen.has(b) || !['open', 'paid', 'uncollectible'].includes(inv.status)) return; // Entwurf oder storniert: zählt nicht
          offen.delete(b);
          const r = schon.get(inv.id) || { nr: inv.number || inv.id, id: inv.id, betrag: (inv.total || 0) / 100, url: inv.hosted_invoice_url || '', status: inv.status === 'paid' ? 'bezahlt' : 'offen', buchungen: [] };
          r.buchungen.push(b); schon.set(inv.id, r);
        });
        if (!vorher.has_more || !(vorher.data || []).length) break;
        nach = vorher.data[vorher.data.length - 1].id;
      }
      for (const id of liegen) await s.del('/invoiceitems/' + id);
      const posten = o.posten.filter((p) => offen.has(p.buchung)).slice(0, 250);
      if (!posten.length) return { neu: null, schon: Array.from(schon.values()) };
      const steuer = await steuersatz(false);
      const inv = await s.post('/invoices', { customer: o.customer, currency: 'eur', collection_method: 'charge_automatically', auto_advance: false, pending_invoice_items_behavior: 'exclude', description: 'eeziframes: Projekte mit eingegangenem Aufmaß', footer: k.preise.mwst ? undefined : KLEINUNTERNEHMER, metadata: { betrieb: o.id, art: 'sammelrechnung' } });
      try {
        for (const p of posten) await s.post('/invoiceitems', { customer: o.customer, invoice: inv.id, amount: Math.round(p.betrag * 100), currency: 'eur', description: p.text, tax_rates: steuer ? [steuer] : undefined, metadata: { betrieb: o.id, buchung: p.buchung } }, { idem: 'eeziframes-' + inv.id + '-' + p.buchung });
        const fin = await s.post('/invoices/' + inv.id + '/finalize', { auto_advance: true });
        return { neu: { nr: fin.number || fin.id, id: fin.id, betrag: (fin.total || 0) / 100, url: fin.hosted_invoice_url || '', status: fin.status === 'paid' ? 'bezahlt' : 'offen', buchungen: posten.map((p) => p.buchung) }, schon: Array.from(schon.values()) };
      } catch (e) {
        /* Aufräumen: alle Posten am Entwurf löschen (auch solche, deren Antwort verloren ging), dann den Entwurf. Klappt das nicht,
           bleibt der Entwurf stehen: Er wird nie eingezogen (auto_advance aus), und seine Posten hängen nicht frei herum. */
        try {
          for (let runde = 0; runde < 5; runde++) {
            const dran = await s.get('/invoiceitems', { invoice: inv.id, limit: 100 });
            if (!(dran.data || []).length) break;
            for (const it of dran.data) await s.del('/invoiceitems/' + it.id);
          }
          if (((await s.get('/invoiceitems', { invoice: inv.id, limit: 1 })).data || []).length) throw new Error('Posten übrig');
          await s.del('/invoices/' + inv.id);
        } catch (e2) { console.log('Entwurf bleibt liegen', inv.id); }
        throw e;
      }
    }
  };
}

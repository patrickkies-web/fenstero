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
import { AGB_STAND, ZUSTIMMUNG, standText } from './recht.js';
import '../../web/assets/pakete.js'; // Konfigurator-Pakete: Namen und Monatspreise (globalThis.Pakete)

const VERSION = '2024-06-20';
export const KLEINUNTERNEHMER = 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';
/* steht auf der Rechnung des Aufmaßblatts (dauerhafter Datenträger), zusätzlich zur Vertragsbestätigung per E-Mail (bestaetigung.js):
   der Haken an der Kasse im Wortlaut und die AGB-Fassung */
export const rechnungsText = (z, origin) => 'Ihre Zustimmung beim Kauf: „' + ((z && z.text) || ZUSTIMMUNG) + '“ Es gelten unsere AGB, Stand ' + standText((z && z.agb) || AGB_STAND) + ': ' + origin + '/agb/';

/* LEER: ein Feld ausdrücklich leeren (Stripe nimmt „feld=“ als Löschen, z. B. pause_collection beim Fortsetzen eines Abos) */
export const LEER = Symbol('leer');
function flach(obj, prefix, out) {
  out = out || [];
  Object.keys(obj).forEach((k) => {
    const v = obj[k], key = prefix ? prefix + '[' + k + ']' : k;
    if (v === LEER) { out.push([key, '']); return; }
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
    if (!r.ok) { const msg = data && data.error && data.error.message ? data.error.message : 'Stripe antwortet nicht (' + r.status + ')'; console.log('Stripe-Fehler', method, pfad, msg.slice(0, 200)); throw new ApiFehler('Zahlungsdienst: ' + msg, 502, { stripeStatus: r.status }); }
    /* Stripe kennzeichnet eine wiederholte Antwort auf denselben Idempotency-Key (Idempotent-Replayed: true) */
    if (data && typeof data === 'object' && r.headers && r.headers.get('idempotent-replayed') === 'true') Object.defineProperty(data, '_wiederholt', { value: true });
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
/* Zustimmung an der Kasse aus den Metadaten einer Kasse (aufmassKasse); null bei älteren Kassen */
export const zustimmungAus = (md) => (md && md.agb ? { agb: md.agb, text: md.zustimmung || '', zeit: md.zustimmung_zeit || '' } : null);
/* Ende des laufenden Abrechnungsmonats eines Abos: bis API-Version 2025-02 am Abo, seither am Posten */
const periodenEnde = (sub) => { const t = (sub && (sub.current_period_end || (sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end))) || 0; return t ? new Date(t * 1000) : null; };

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
  return Object.assign({
    art: s ? 'stripe' : 'attrappe',
    /* Aufmaßblatt kaufen: Rückkehr nach /app/?bezahlt=<session>. Nur Zahlungsarten, die sofort bestätigen (ZAHLARTEN, umgebung.js):
       Das Blatt wird sofort geliefert. Der Zahlknopf heißt „Bezahlen“ (submit_type pay). Die Zustimmung an der Kasse (o.zustimmung:
       AGB-Stand, Wortlaut, Zeitpunkt) steht in den Metadaten der Kasse und auf der Rechnung, auch ohne Datenbank nachweisbar. */
    async aufmassKasse(o) {
      if (!s) { const id = testId('test'); return { id: id, url: o.zurueck + (o.zurueck.includes('?') ? '&' : '?') + 'bezahlt=' + id + '&kennung=' + encodeURIComponent(o.kennung) }; }
      const steuer = await steuersatz(true), z = o.zustimmung || {};
      const posten = k.stripe.preisAufmass ? { price: k.stripe.preisAufmass, quantity: 1 } : { quantity: 1, price_data: { currency: 'eur', unit_amount: Math.round(k.preise.aufmass * 100), tax_behavior: steuer ? 'inclusive' : undefined, product_data: { name: 'eeziframes Aufmaßblatt', description: 'Ihr Fenster-Aufmaß als PDF: alle Maße, Fotoauswertung, Wünsche, mit Code für den Fensterbauer' } } };
      if (steuer) posten.tax_rates = [steuer];
      const sess = await s.post('/checkout/sessions', { mode: 'payment', locale: 'de', submit_type: 'pay', customer_email: o.mail, client_reference_id: o.kennung, success_url: o.zurueck + (o.zurueck.includes('?') ? '&' : '?') + 'bezahlt={CHECKOUT_SESSION_ID}', cancel_url: o.zurueck, line_items: [posten], payment_method_types: k.zahlarten || ['card'], invoice_creation: { enabled: true, invoice_data: Object.assign({ description: rechnungsText(z, new URL(o.zurueck).origin) }, k.preise.mwst ? {} : { footer: KLEINUNTERNEHMER }) }, payment_intent_data: { description: 'eeziframes Aufmaßblatt ' + o.kennung }, metadata: Object.assign({ art: 'aufmass', kennung: o.kennung }, o.nutzer ? { nutzer: o.nutzer } : {}, z.agb ? { agb: z.agb, zustimmung: String(z.text || '').slice(0, 500), zustimmung_zeit: z.zeit || '' } : {}) });
      return { id: sess.id, url: sess.url };
    },
    /* Ist die Kasse bezahlt? Liefert Kennung, E-Mail und die Zustimmung an der Kasse zurück. wartet: abgeschlossen, aber die Zahlung
       ist noch unterwegs */
    async kasseGeprueft(session) {
      if (!s) return session.startsWith('test_') ? { bezahlt: true, kennung: '', mail: '', betragCent: Math.round(k.preise.aufmass * 100) } : { bezahlt: false, wartet: session.startsWith('wartet_') };
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['payment_intent'] });
      if (sess.mode !== 'payment' || !sess.metadata || sess.metadata.art !== 'aufmass') return { bezahlt: false }; // nur Kassen für das Aufmaßblatt
      const pi = sess.payment_intent && typeof sess.payment_intent === 'object' ? sess.payment_intent : null, md = sess.metadata || {};
      return { bezahlt: sess.payment_status === 'paid', wartet: sess.status === 'complete' && sess.payment_status === 'unpaid' && (!pi || pi.status === 'processing' || pi.status === 'requires_action'), kennung: md.kennung || sess.client_reference_id || '', mail: (sess.customer_details && sess.customer_details.email) || sess.customer_email || '', betragCent: sess.amount_total || 0, zustimmung: zustimmungAus(md), mode: sess.mode, subscription: idVon(sess.subscription), setupIntent: idVon(sess.setup_intent), customer: idVon(sess.customer) };
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
    /* Bestehendes Abo auf einen anderen Plan umstellen. Nach oben (Abo 10 → Plus): sofort, den Unterschied rechnet Stripe anteilig für
       den Rest des laufenden Abrechnungsmonats ab (nächste Rechnung). Nach unten (o.ohneAusgleich): der Preis wechselt ohne Ausgleich,
       der Monat ist schon bezahlt, die nächste Rechnung kommt zum kleineren Preis; bis zum Periodenende gilt im Konto der bisherige
       Tarif (konten.js). Rückgabe: Ende des laufenden Abrechnungsmonats (Date) oder null (Attrappe) */
    async aboAendern(subscription, plan, o) {
      if (!s) return null;
      const [preisId, steuer] = await Promise.all([preis(plan), steuersatz(false)]);
      const sub = await s.get('/subscriptions/' + subscription);
      const item = sub.items && sub.items.data && sub.items.data[0];
      const neu = await s.post('/subscriptions/' + subscription, { cancel_at_period_end: false, proration_behavior: o && o.ohneAusgleich ? 'none' : 'create_prorations', items: [{ id: item ? item.id : undefined, price: preisId }], default_tax_rates: steuer ? [steuer] : undefined, metadata: { plan: plan } });
      return periodenEnde(neu);
    },
    /* Zum Ende des laufenden Abrechnungsmonats kündigen bzw. die Kündigung zurücknehmen. Rückgabe: Periodenende (Date) oder null */
    async aboKuendigen(subscription, zurueck) {
      if (!s) return null;
      const neu = await s.post('/subscriptions/' + subscription, { cancel_at_period_end: !zurueck });
      return periodenEnde(neu);
    },
    /* Abo sofort beenden (Zentrale: Konto löschen oder „sofort beenden“); ein schon beendetes Abo zählt als erledigt */
    async aboBeenden(subscription) {
      if (!s || !subscription) return true;
      try { await s.del('/subscriptions/' + encodeURIComponent(subscription)); } catch (e) { if (/no such subscription|already (been )?cancel|canceled subscription/i.test(String(e && e.message))) return true; throw e; }
      return true;
    },
    /* Alle laufenden Abos eines Stripe-Kunden sofort beenden und seine offenen Kassen verfallen lassen (Konto löschen, „sofort beenden“):
       auch ein zweites Abo aus einem Wettlauf zweier Kassen und eine noch offene Abo-Kasse, die sonst nach dem Löschen bezahlt würde.
       Rückgabe: die beendeten Abos */
    async kundeAbosBeenden(customer, auchDieses, nurAboKassen) {
      if (!s) return auchDieses ? [auchDieses] : [];
      const ids = new Set(auchDieses ? [auchDieses] : []);
      if (customer) {
        /* Zuerst die offenen Kassen verfallen lassen, damit nach dem Auflisten keine mehr zu einem neuen Abo wird */
        const offen = await s.get('/checkout/sessions', { customer: customer, status: 'open', limit: 100 });
        for (const k2 of (offen.data || []).filter((x) => !nurAboKassen || x.mode === 'subscription')) {
          try { await s.post('/checkout/sessions/' + k2.id + '/expire'); } catch (e) { if (!/status|expire|complete|open/i.test(String(e && e.message))) throw e; } // schon abgeschlossen oder verfallen
        }
        let nach = '';
        for (let seite = 0; seite < 5; seite++) {
          const abos = await s.get('/subscriptions', { customer: customer, status: 'all', limit: 100, starting_after: nach || undefined });
          (abos.data || []).filter((x) => LAUFEND.includes(x.status) || ['incomplete', 'unpaid', 'paused'].includes(x.status)).forEach((x) => ids.add(x.id));
          if (!abos.has_more || !(abos.data || []).length) break;
          nach = abos.data[abos.data.length - 1].id;
        }
      }
      for (const id of ids) await this.aboBeenden(id);
      return Array.from(ids);
    },
    /* Objekt zu einem Thin-Ereignis holen: related_object.url aus dem unterschriebenen Ereignis, nur die Arten, die der Webhook braucht */
    async objekt(url) {
      if (!s || !/^\/v1\/(checkout\/sessions|invoices|subscriptions|disputes)\/[A-Za-z0-9_]+$/.test(String(url || ''))) return null;
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
      /* Zwei Läufe zur selben Zeit (Cron und „jetzt abrechnen“ in der Zentrale): Der Idempotency-Key je Betrieb, Buchungen und Tag gibt
         beiden denselben Entwurf. Nur der Lauf, der ihn angelegt hat, füllt und schließt ihn ab; der andere bricht ohne Wirkung ab, und
         eine schon abgeschlossene Rechnung zählt als „schon“. Als berechnet gelten nur Buchungen, deren Posten wirklich auf der
         Rechnung stehen. Wurde der Entwurf nach einem Fehler gelöscht, geht es mit einem Schlüssel weiter, der an genau diesem
         Entwurf hängt: So treffen sich auch dann zwei gleichzeitige Läufe wieder beim selben neuen Entwurf. */
      const satz = posten.map((p) => p.buchung).sort().join(','), tag = new Date().toISOString().slice(0, 10).replace(/\D/g, '');
      const idem = 'eeziframes-re-' + o.id + '-' + satz.split('').reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36) + '-' + posten.length + '-' + tag;
      const daten = { customer: o.customer, currency: 'eur', collection_method: 'charge_automatically', auto_advance: false, pending_invoice_items_behavior: 'exclude', description: 'eeziframes: Projekte mit eingegangenem Aufmaß', footer: k.preise.mwst ? undefined : KLEINUNTERNEHMER, metadata: { betrieb: o.id, art: 'sammelrechnung' } };
      const ergebnis = (r, b) => ({ nr: r.number || r.id, id: r.id, betrag: (r.total || 0) / 100, url: r.hosted_invoice_url || '', status: r.status === 'paid' ? 'bezahlt' : 'offen', buchungen: b });
      const drauf = async (invId) => { const b = []; let nach2 = ''; for (let i = 0; i < 5; i++) { const l = await s.get('/invoiceitems', { invoice: invId, limit: 100, starting_after: nach2 || undefined }); (l.data || []).forEach((it) => { if (it.metadata && it.metadata.buchung) b.push(it.metadata.buchung); }); if (!l.has_more || !(l.data || []).length) break; nach2 = l.data[l.data.length - 1].id; } return b; };
      let inv = null;
      for (let schluessel = idem, versuch = 0; ; versuch++) {
        inv = await s.post('/invoices', daten, { idem: schluessel });
        if (!inv._wiederholt) break;
        let stand = null;
        try { stand = await s.get('/invoices/' + inv.id); } catch (e) { if (!/no such invoice/i.test(String(e && e.message))) throw e; }
        if (stand && stand.deleted) stand = null;
        if (stand && stand.status === 'draft') throw new ApiFehler('Ein anderer Abrechnungslauf arbeitet gerade an dieser Rechnung. Bitte später noch einmal.', 409);
        if (stand && stand.status !== 'void') return { neu: null, schon: Array.from(schon.values()).concat([ergebnis(stand, await drauf(stand.id))]) };
        if (versuch >= 5) throw new ApiFehler('Die Sammelrechnung ließ sich heute mehrmals nicht anlegen. Bitte später noch einmal.', 409);
        schluessel = idem + '-' + inv.id; // gelöscht oder storniert: neuer Entwurf, für alle Läufe unter demselben Schlüssel
      }
      try {
        for (const p of posten) await s.post('/invoiceitems', { customer: o.customer, invoice: inv.id, amount: Math.round(p.betrag * 100), currency: 'eur', description: p.text, tax_rates: steuer ? [steuer] : undefined, metadata: { betrieb: o.id, buchung: p.buchung } }, { idem: 'eeziframes-' + inv.id + '-' + p.buchung });
        const fin = await s.post('/invoices/' + inv.id + '/finalize', { auto_advance: true });
        return { neu: ergebnis(fin, await drauf(fin.id)), schon: Array.from(schon.values()) };
      } catch (e) {
        /* Ein anderer Lauf nutzt gerade dieselben Schlüssel: alles ihm überlassen, nichts aufräumen */
        if (/in-progress request|another in-progress/i.test(String(e && e.message))) throw e;
        /* Schon abgeschlossen (etwa durch einen anderen Lauf): nichts ist schiefgegangen, als „schon“ melden */
        try { const st2 = await s.get('/invoices/' + inv.id); if (st2 && st2.status && !['draft', 'void'].includes(st2.status)) return { neu: null, schon: Array.from(schon.values()).concat([ergebnis(st2, await drauf(st2.id))]) }; } catch (e3) { /* weiter mit Aufräumen */ }
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
  }, paketDienst(k, s, steuersatz, einmal, konto));
}

/* ===================== Konfigurator-Pakete (Strang D: functions/api/bestellung.js, functions/api/partner.js) =====================
   Kunde je Fensteranbieter (partner.stripe_customer), Einrichtungsgebühr vorab per Checkout (mode=payment, Karte oder SEPA-Lastschrift,
   Zahlungsmittel für das Abo gespeichert: setup_future_usage=off_session), Monatsabo erst beim Live-Schalten (POST /subscriptions,
   off_session), Rechnungen und Zahlungsmittel über das Kundenportal von Stripe.
   Jedes Stripe-Objekt der Pakete trägt metadata.art (einrichtung, paket) und nie metadata.betrieb: stripeEreignis (konten.js) und die
   Sammelrechnung (rechnung oben) sehen sie so nie; den Webhook leitet zahlung.js über paketObjekt (bestellung.js) hierher.
   Preise kommen nur aus web/assets/pakete.js (Monatspreis über lookup_key mit Betrag, Einrichtung als Betrag je Kasse).
   Attrappe (ZAHLUNG_ATTRAPPE=1, ohne Stripe): Kassen mit test_-Kennungen gelten als bezahlt; was zu einer Kasse gehört (Bestellung,
   Partner, Kunde, Betrag), merkt sich der Server im Speicher, damit die Bindung an die Bestellung auch hier geprüft wird. */
const paketAttrappe = { kassen: new Map(), abos: new Map(), rechnungen: new Map() };
const TAG_S = 86400;
const kurzHash = (s) => String(s).split('').reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36);
/* Betrag der Einrichtung in Cent wie Stripe ihn rechnet: netto, exklusive Steuer je Posten gerundet */
export const einrichtungBrutto = (preise) => { const cent = Math.round(Number((preise || {}).einrichtung || 0) * 100), m = Number((preise || {}).mwst || 0); return cent + (m ? Math.round(cent * m / 100) : 0); };
const rechnungKurz = (inv) => ({ id: inv.id, nr: inv.number || inv.id, datum: inv.created ? new Date(inv.created * 1000).toISOString() : '', betrag: (inv.total != null ? inv.total : inv.amount_due || 0) / 100, status: inv.status === 'paid' ? 'bezahlt' : inv.status === 'open' ? 'offen' : inv.status === 'void' ? 'storniert' : inv.status === 'uncollectible' ? 'uneinbringlich' : 'entwurf', url: inv.hosted_invoice_url || '', pdf: inv.invoice_pdf || '' });
const rechnungMerk = new Map();

function paketDienst(k, s, steuersatz, einmalFn, konto) {
  const P = () => globalThis.Pakete;
  const testId = (prefix) => prefix + '_' + zufall(9);
  /* Monatspreis eines Pakets; der lookup_key enthält den Betrag, eine Preisänderung in pakete.js legt also einen neuen Preis an */
  function paketPreis(paket) {
    const p = P().preis(paket); if (!p) throw new ApiFehler('Unbekanntes Paket.', 400);
    const cent = Math.round(p.monat * 100), lookup = 'eeziframes_paket_' + paket + '_' + cent + '_eur_monat';
    return einmalFn(konto + ':' + lookup, async () => {
      const liste = await s.get('/prices', { lookup_keys: [lookup], active: true, limit: 1 });
      if (liste.data && liste.data[0]) return liste.data[0].id;
      const name = P().PAKETE[paket].name;
      const neu = await s.post('/prices', { currency: 'eur', unit_amount: cent, recurring: { interval: 'month' }, lookup_key: lookup, tax_behavior: 'exclusive', nickname: name + ', monatlich', product_data: { name: name, metadata: { eeziframes: 'paket_' + paket } }, metadata: { eeziframes: 'paket_' + paket } }, { idem: 'eeziframes-' + lookup });
      return neu.id;
    });
  }
  /* Ende des laufenden Abrechnungsmonats (bis API-Version 2025-02 am Abo, seither am Posten) */
  const bisVon = (sub) => { const d = periodenEnde(sub); return d ? d.toISOString() : null; };
  const aboKurz = (sub) => sub ? { id: sub.id, status: sub.status, kuendigt: !!sub.cancel_at_period_end, bis: bisVon(sub), pausiert: !!(sub.pause_collection && sub.pause_collection.behavior), metadata: sub.metadata || {}, preis: (((sub.items || {}).data || [])[0] || {}).price ? sub.items.data[0].price.id : '' } : null;
  return {
    /* Stripe-Kunde des Partners anlegen bzw. nachziehen (Name, Anschrift, Telefon, Rechnungsadresse; USt-IdNr. beim Anlegen).
       p: Zeile aus partner. Rückgabe: Kennung des Kunden */
    async paketKunde(p) {
      if (!s) return p.stripe_customer || 'cus_test_' + zufall(6);
      const d = p.daten || {}, mail = d.rechnungMail || p.mail;
      const daten = { email: mail, name: p.firma, phone: d.tel || undefined, address: { line1: d.strasse || undefined, postal_code: d.plz || p.plz || undefined, city: d.ort || undefined, country: 'DE' }, preferred_locales: ['de'], invoice_settings: k.preise.mwst ? undefined : { footer: KLEINUNTERNEHMER }, metadata: { art: 'paket', partner: p.id } };
      if (p.stripe_customer) { await s.post('/customers/' + encodeURIComponent(p.stripe_customer), daten); return p.stripe_customer; }
      if (d.ust && /^DE\d{9}$/.test(d.ust)) daten.tax_id_data = [{ type: 'eu_vat', value: d.ust }];
      const c = await s.post('/customers', daten, { idem: 'eeziframes-partner-' + p.id + '-' + kurzHash(JSON.stringify([mail, p.firma, d.ust || ''])) });
      return c.id;
    },
    /* Kasse für die Einrichtungsgebühr. o: { customer, bestellung: { id, nr, paket }, partner, preise, origin, stand }.
       Der Preis kommt nur aus dem Preisstand der Bestellung (pakete.js), nie vom Browser. Rückgabe: { id, url } */
    async einrichtungKasse(o) {
      const b = o.bestellung, preise = o.preise, zurueckOk = o.origin + '/partner/?kasse={CHECKOUT_SESSION_ID}#bestellung/' + b.id, zurueckAb = o.origin + '/partner/#bestellung/' + b.id;
      if (!s) {
        const id = testId('test');
        paketAttrappe.kassen.set(id, { bestellung: b.id, partner: o.partner, customer: o.customer, paket: b.paket, stand: o.stand, betrag: einrichtungBrutto(preise), pm: 'pm_test_' + zufall(6), pi: 'pi_test_' + zufall(6), created: Math.floor(Date.now() / 1000) });
        return { id: id, url: zurueckOk.replace('{CHECKOUT_SESSION_ID}', id) };
      }
      const steuer = preise.mwst ? await steuersatz(false) : '', name = P().PAKETE[b.paket].name, euro = (n) => P().euro(n).replace(' €', ' €');
      const md = { art: 'einrichtung', bestellung: b.id, partner: o.partner, paket: b.paket, stand: o.stand };
      const sess = await s.post('/checkout/sessions', {
        mode: 'payment', locale: 'de', submit_type: 'pay', customer: o.customer, customer_update: { address: 'auto', name: 'auto' },
        payment_method_types: ['card', 'sepa_debit'],
        line_items: [{ quantity: 1, tax_rates: steuer ? [steuer] : undefined, price_data: { currency: 'eur', unit_amount: Math.round(preise.einrichtung * 100), tax_behavior: 'exclusive', product_data: { name: 'Einrichtung ' + name, description: 'Einrichtung Ihres Fensterkonfigurators auf eigener Domain (Bestellung ' + b.nr + ')' } } }],
        payment_intent_data: { setup_future_usage: 'off_session', description: 'Einrichtung ' + name + ', Bestellung ' + b.nr, metadata: { art: 'einrichtung', bestellung: b.id, partner: o.partner } },
        invoice_creation: { enabled: true, invoice_data: { description: 'Bestellung ' + b.nr + ': ' + name + ', Einrichtung. Monatlich ' + euro(preise.monat) + ' netto ab dem Livegang.', footer: preise.mwst ? undefined : KLEINUNTERNEHMER, metadata: { art: 'einrichtung', bestellung: b.id } } },
        custom_text: { submit: { message: 'Es gelten die Paketbedingungen (Stand ' + standText(o.stand) + ') mit dem Vertrag zur Auftragsverarbeitung, denen Sie zugestimmt haben.' } },
        success_url: zurueckOk, cancel_url: zurueckAb, metadata: md
      });
      return { id: sess.id, url: sess.url };
    },
    /* Kasse der Einrichtung lesen (schreibt nichts). null: keine Einrichtungskasse (andere Art, unbekannt).
       { bezahlt, laeuft, fehlgeschlagen, bestellung, partner, paket, stand, pi, pm, betrag, customer, rechnung, created } */
    async einrichtungLesen(session) {
      if (!s) {
        const e = paketAttrappe.kassen.get(String(session || ''));
        if (!e) return null;
        const bezahlt = /^test_/.test(session);
        if (bezahlt && e.customer && !e.rechnung) { e.rechnung = 'in_test_' + zufall(6); const l = paketAttrappe.rechnungen.get(e.customer) || []; l.unshift({ id: e.rechnung, nr: 'RE-TEST-' + String(l.length + 1).padStart(4, '0'), datum: new Date().toISOString(), betrag: e.betrag / 100, status: 'bezahlt', url: '', pdf: '' }); paketAttrappe.rechnungen.set(e.customer, l); }
        return { bezahlt: bezahlt, laeuft: /^wartet_/.test(session), fehlgeschlagen: /^fehl_/.test(session), bestellung: e.bestellung, partner: e.partner, paket: e.paket, stand: e.stand, pi: e.pi, pm: e.pm, betrag: e.betrag, customer: e.customer, rechnung: e.rechnung || '', created: e.created };
      }
      const sess = await s.get('/checkout/sessions/' + encodeURIComponent(session), { expand: ['payment_intent'] });
      const md = sess.metadata || {};
      if (sess.mode !== 'payment' || md.art !== 'einrichtung') return null;
      const pi = sess.payment_intent && typeof sess.payment_intent === 'object' ? sess.payment_intent : null;
      return { bezahlt: sess.payment_status === 'paid', laeuft: sess.status === 'complete' && sess.payment_status === 'unpaid' && (!pi || pi.status === 'processing'), fehlgeschlagen: !!(pi && pi.status === 'requires_payment_method' && sess.status === 'complete'),
        bestellung: md.bestellung || '', partner: md.partner || '', paket: md.paket || '', stand: md.stand || '', pi: pi ? pi.id : idVon(sess.payment_intent), pm: pi ? idVon(pi.payment_method) : '', betrag: sess.amount_total || 0, customer: idVon(sess.customer), rechnung: idVon(sess.invoice), created: sess.created || 0 };
    },
    /* Eine offene Kasse verfallen lassen (neue Kasse derselben Bestellung); schon abgeschlossen oder verfallen zählt als erledigt */
    async einrichtungAblaufen(session) {
      if (!s || !session) { paketAttrappe.kassen.delete(String(session || '')); return true; }
      try { await s.post('/checkout/sessions/' + encodeURIComponent(session) + '/expire'); } catch (e) { /* nicht mehr offen */ }
      return true;
    },
    /* Monatsabo beim Live-Schalten: mit dem gespeicherten Zahlungsmittel, ohne den Kunden (off_session). Läuft für diese Bestellung
       schon ein Abo, wird es übernommen (Doppelklick, verlorene Antwort). o: { customer, paket, pm, bestellung, partner, n }.
       Rückgabe: { id, status, bis, offeneRechnung, laeuft, vorhanden } */
    async paketAboStarten(o) {
      if (!s) {
        for (const a of paketAttrappe.abos.values()) if (a.bestellung === o.bestellung && a.status === 'active') return Object.assign({ vorhanden: true }, a);
        const id = 'sub_test_' + zufall(6), a = { id: id, status: 'active', bis: new Date(Date.now() + 30 * TAG_S * 1000).toISOString(), offeneRechnung: '', laeuft: false, bestellung: o.bestellung, paket: o.paket };
        paketAttrappe.abos.set(id, a); return Object.assign({}, a);
      }
      const liste = await s.get('/subscriptions', { customer: o.customer, status: 'all', limit: 100 });
      const da = (liste.data || []).find((x) => x.metadata && x.metadata.bestellung === o.bestellung && (LAUFEND.includes(x.status) || x.status === 'incomplete'));
      if (da) return { id: da.id, status: da.status, bis: bisVon(da), offeneRechnung: '', laeuft: false, vorhanden: true };
      const [preisId, steuer] = await Promise.all([paketPreis(o.paket), k.preise.mwst ? steuersatz(false) : Promise.resolve('')]);
      const sub = await s.post('/subscriptions', { customer: o.customer, items: [{ price: preisId }], default_payment_method: o.pm || undefined, default_tax_rates: steuer ? [steuer] : undefined, off_session: true, payment_behavior: 'allow_incomplete', metadata: { art: 'paket', bestellung: o.bestellung, partner: o.partner, paket: o.paket }, expand: ['latest_invoice.payment_intent'] }, { idem: 'eeziframes-paketabo-' + o.bestellung + '-' + (o.n || 1) });
      const inv = sub.latest_invoice && typeof sub.latest_invoice === 'object' ? sub.latest_invoice : null, pi = inv && inv.payment_intent && typeof inv.payment_intent === 'object' ? inv.payment_intent : null;
      return { id: sub.id, status: sub.status, bis: bisVon(sub), offeneRechnung: sub.status === 'incomplete' && inv ? inv.hosted_invoice_url || '' : '', laeuft: !!(pi && pi.status === 'processing'), vorhanden: false };
    },
    /* Abo lesen (Abgleich im Tageslauf): { id, status, kuendigt, bis, pausiert, metadata, preis } oder null */
    async paketAboLesen(sub) {
      if (!s) { const a = paketAttrappe.abos.get(String(sub || '')); return a ? { id: a.id, status: a.status, kuendigt: !!a.kuendigt, bis: a.bis, pausiert: !!a.pausiert, metadata: { art: 'paket', bestellung: a.bestellung, paket: a.paket }, preis: '' } : null; }
      try { return aboKurz(await s.get('/subscriptions/' + encodeURIComponent(sub))); } catch (e) { if (/no such subscription/i.test(String(e && e.message))) return null; throw e; }
    },
    /* Abo ändern. o: { paket, oben } (Preis des Pakets; nach oben sofort mit anteiliger Berechnung, nach unten ohne Ausgleich: der
       laufende Monat ist bezahlt, die nächste Rechnung kommt zum kleineren Preis) · { kuendigen } / { zuruecknehmen } (zum Ende des
       Abrechnungsmonats) · { aussetzen } / { fortsetzen } (Einzug ruht, pause_collection). Rückgabe: { id, status, kuendigt, bis, pausiert } */
    async paketAboAendern(sub, o) {
      o = o || {};
      if (!s) {
        const a = paketAttrappe.abos.get(String(sub || '')) || { id: sub, status: 'active', bis: null };
        if (o.paket) a.paket = o.paket; if (o.kuendigen) a.kuendigt = true; if (o.zuruecknehmen) a.kuendigt = false; if (o.aussetzen) a.pausiert = true; if (o.fortsetzen) a.pausiert = false;
        if (a.id) paketAttrappe.abos.set(a.id, a);
        return { id: a.id, status: a.status, kuendigt: !!a.kuendigt, bis: a.bis || null, pausiert: !!a.pausiert };
      }
      const daten = {};
      if (o.paket) {
        const [preisId, alt] = await Promise.all([paketPreis(o.paket), s.get('/subscriptions/' + encodeURIComponent(sub))]);
        const item = alt.items && alt.items.data && alt.items.data[0];
        Object.assign(daten, { items: [{ id: item ? item.id : undefined, price: preisId }], proration_behavior: o.oben ? 'create_prorations' : 'none', metadata: { paket: o.paket } });
      }
      if (o.kuendigen) daten.cancel_at_period_end = true;
      if (o.zuruecknehmen) daten.cancel_at_period_end = false;
      if (o.aussetzen) daten.pause_collection = { behavior: 'void' };
      if (o.fortsetzen) daten.pause_collection = LEER;
      return aboKurz(await s.post('/subscriptions/' + encodeURIComponent(sub), daten));
    },
    /* Abo sofort beenden (Pause länger als erlaubt, Ende durch den Inhaber); schon beendet zählt als erledigt */
    async paketAboBeenden(sub) {
      if (!s) { const a = paketAttrappe.abos.get(String(sub || '')); if (a) a.status = 'canceled'; return true; }
      return this.aboBeenden(sub);
    },
    /* Einzelner Posten auf die nächste Rechnung des Kunden (Differenz der Einrichtung beim Wechsel nach oben). o: { customer, cent,
       text, bestellung, schluessel } */
    async paketPosten(o) {
      if (!s) return { id: 'ii_test_' + zufall(6) };
      const steuer = k.preise.mwst ? await steuersatz(false) : '';
      return s.post('/invoiceitems', { customer: o.customer, amount: o.cent, currency: 'eur', description: o.text, tax_rates: steuer ? [steuer] : undefined, metadata: { art: 'paket', bestellung: o.bestellung } }, { idem: 'eeziframes-paketposten-' + o.bestellung + '-' + o.schluessel });
    },
    /* Rechnungen eines Kunden, nur lesend (fünf Minuten gemerkt); Stripe bewahrt sie auf */
    async paketRechnungen(customer) {
      if (!customer) return [];
      if (!s) return (paketAttrappe.rechnungen.get(customer) || []).slice();
      const m = rechnungMerk.get(customer); if (m && m.bis > Date.now()) return m.liste.slice();
      const r = await s.get('/invoices', { customer: customer, limit: 24 });
      const liste = (r.data || []).filter((x) => x.status !== 'draft').map(rechnungKurz);
      rechnungMerk.set(customer, { liste: liste, bis: Date.now() + 5 * 60 * 1000 }); if (rechnungMerk.size > 500) rechnungMerk.clear();
      return liste.slice();
    },
    /* Erstattung einer Einrichtung (voll oder cent); je Bestellung und Betrag nur einmal */
    async erstatten(pi, cent, bestellung) {
      if (!s) return { id: 're_test_' + zufall(6), status: 'succeeded', betrag: cent || null };
      const r = await s.post('/refunds', { payment_intent: pi, amount: cent || undefined, metadata: { art: 'einrichtung', bestellung: bestellung } }, { idem: 'eeziframes-erstattung-' + bestellung + '-' + (cent || 'voll') });
      return { id: r.id, status: r.status, betrag: r.amount || null };
    },
    /* Kundenportal von Stripe: Rechnungen, Zahlungsmittel, Kündigung zum Ende des Abrechnungsmonats. Die Konfiguration legt der Server
       einmal selbst an (Metadaten eeziframes=paket-v1). Rückgabe: { url } */
    async kundenportal(customer, zurueck) {
      if (!s) return { url: zurueck + (zurueck.includes('?') ? '&' : '?') + 'portal=test' };
      const konf = await einmalFn(konto + ':portal-paket-v1', async () => {
        const liste = await s.get('/billing_portal/configurations', { active: true, limit: 100 });
        const da = (liste.data || []).find((c) => c.metadata && c.metadata.eeziframes === 'paket-v1');
        if (da) return da.id;
        const neu = await s.post('/billing_portal/configurations', { business_profile: { headline: 'eeziframes: Rechnungen, Zahlung und Abo Ihres Konfigurators' }, features: { invoice_history: { enabled: true }, payment_method_update: { enabled: true }, customer_update: { enabled: true, allowed_updates: ['email', 'address', 'name', 'tax_id'] }, subscription_cancel: { enabled: true, mode: 'at_period_end', proration_behavior: 'none' } }, metadata: { eeziframes: 'paket-v1' } }, { idem: 'eeziframes-portal-paket-v1' });
        return neu.id;
      });
      const sess = await s.post('/billing_portal/sessions', { customer: customer, return_url: zurueck, configuration: konf, locale: 'de' });
      return { url: sess.url };
    }
  };
}

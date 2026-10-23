// eeziframes · Stripe nachgestellt für die Prüfung (scripts/pruefen.mjs, Abschnitt 11)
//
// Fängt fetch an https://api.stripe.com ab, hält Kunden, Preise, Steuersätze, Kassen, Abos, Rechnungen und Posten im Speicher und
// protokolliert jede Anfrage (Methode, Pfad, API-Version, Idempotency-Key, Parameter als Objekt). Nachgebildet sind nur die Regeln,
// auf die es hier ankommt, so wie Stripe sie dokumentiert:
//   - Rechnung anlegen: offene Posten des Kunden kommen nur mit pending_invoice_items_behavior=include dazu (Standard: exclude)
//   - Posten mit invoice=… hängen an genau diesem Entwurf; an abgeschlossene Rechnungen geht nichts mehr
//   - Entwurf löschen: seine Posten werden wieder offen (die vorsichtige Annahme; der Server muss sie selbst löschen)
//   - Abschließen mit Guthaben des Kunden (balance < 0): die Rechnung ist sofort bezahlt
//   - Abos haben einen Status; nur laufende zählen. Listen mit has_more und starting_after
//   - Idempotency-Key: dieselbe Anfrage noch einmal liefert dasselbe Objekt; läuft sie noch, antwortet Stripe mit 409
//   - Steuersätze: exklusiv kommt die Steuer dazu, inklusiv steckt sie im Betrag
//   - Konfigurator-Pakete (Abschnitt 27): Kunden mit Anschrift und USt-IdNr., Kassen mit setup_future_usage (die Zahlung hinterlässt
//     ein Zahlungsmittel und mit invoice_creation eine bezahlte Rechnung), Abos per POST /subscriptions mit default_payment_method
//     und pause_collection, Erstattungen, Rechnungen je Kunde, Kundenportal (Konfiguration und Sitzung)
// webhook(…) baut ein unterschriebenes Ereignis wie Stripe (Stripe-Signature: t=…,v1=HMAC-SHA256).
import { createHmac } from 'node:crypto';

export function stripeNachstellen() {
  const echt = globalThis.fetch, log = [];
  const db = { kunden: new Map(), preise: [], steuern: [], kassen: new Map(), abos: new Map(), rechnungen: new Map(), posten: new Map(), idem: new Map(), zahlarten: new Map(), erstattungen: [], portale: [], portalSitzungen: [] };
  let nr = 0, fehlerBei = null, rechnungNr = 0, aboStatusNeu = null;
  const neueId = (p) => p + '_test_' + String(++nr).padStart(6, '0');
  const lesen = (text) => {
    const out = {};
    for (const teil of String(text || '').split('&').filter(Boolean)) {
      const i = teil.indexOf('='), k = decodeURIComponent(teil.slice(0, i).replace(/\+/g, ' ')), v = decodeURIComponent(teil.slice(i + 1).replace(/\+/g, ' '));
      const pfad = k.replace(/\]/g, '').split('[');
      let o = out;
      pfad.forEach((p, j) => { if (j === pfad.length - 1) o[p] = v; else o = o[p] = o[p] || (/^\d+$/.test(pfad[j + 1]) ? [] : {}); });
    }
    return out;
  };
  const antwort = (status, obj) => new Response(JSON.stringify(obj), { status: status, headers: { 'content-type': 'application/json' } });
  const fehler = (status, text) => antwort(status, { error: { type: 'invalid_request_error', message: text } });
  const liste = (data) => ({ object: 'list', data: data, has_more: false });
  const kopie = (o) => JSON.parse(JSON.stringify(o));
  const zahl = (v) => Number(v || 0);
  /* Rechnungssumme wie Stripe: exklusive Steuer kommt dazu, inklusive steckt drin */
  function summe(inv) {
    let total = 0;
    for (const it of db.posten.values()) {
      if (it.invoice !== inv.id) continue;
      total += it.amount;
      (it.tax_rates || []).forEach((t) => { if (!t.inclusive) total += Math.round(it.amount * t.percentage / 100); });
    }
    return total;
  }
  const rechnungSicht = (inv) => Object.assign(kopie(inv), { total: inv.total != null && !Array.from(db.posten.values()).some((it) => it.invoice === inv.id) ? inv.total : summe(inv), lines: { data: Array.from(db.posten.values()).filter((it) => it.invoice === inv.id).map(kopie) } });
  const pm = (art) => { const z = art === 'card' ? { id: neueId('pm'), object: 'payment_method', type: 'card', card: { brand: 'visa', last4: '4242' } } : { id: neueId('pm'), object: 'payment_method', type: 'sepa_debit', sepa_debit: { country: 'DE', last4: '3000' } }; db.zahlarten.set(z.id, z); return z; };

  function behandeln(method, pfad, p, kopf) {
    let m;
    /* Steuersätze */
    if (method === 'POST' && pfad === '/tax_rates') { const t = { id: neueId('txr'), object: 'tax_rate', active: true, display_name: p.display_name, description: p.description || null, percentage: zahl(p.percentage), inclusive: p.inclusive === 'true', country: p.country || null, jurisdiction: p.jurisdiction || null, tax_type: p.tax_type || null, metadata: p.metadata || {} }; db.steuern.push(t); return antwort(200, t); }
    if (method === 'GET' && pfad === '/tax_rates') return antwort(200, liste(db.steuern.filter((t) => (p.active === undefined || String(t.active) === p.active) && (p.inclusive === undefined || String(t.inclusive) === p.inclusive)).slice(0, zahl(p.limit) || 10)));
    /* Preise (mit Produkt aus product_data) */
    if (method === 'POST' && pfad === '/prices') {
      if (p.lookup_key && db.preise.some((x) => x.lookup_key === p.lookup_key)) return fehler(400, 'A price (' + db.preise.find((x) => x.lookup_key === p.lookup_key).id + ') already uses that lookup key.');
      const pr = { id: neueId('price'), object: 'price', active: true, currency: p.currency, unit_amount: zahl(p.unit_amount), recurring: p.recurring ? { interval: p.recurring.interval } : null, lookup_key: p.lookup_key || null, tax_behavior: p.tax_behavior || 'unspecified', nickname: p.nickname || null, product: p.product || neueId('prod'), product_data: p.product_data || null, metadata: p.metadata || {} };
      db.preise.push(pr); return antwort(200, pr);
    }
    if (method === 'GET' && pfad === '/prices') { const keys = p.lookup_keys ? Object.values(p.lookup_keys) : null; return antwort(200, liste(db.preise.filter((x) => (!keys || keys.includes(x.lookup_key)) && (p.active === undefined || String(x.active) === p.active)).slice(0, zahl(p.limit) || 10))); }
    /* Kunden */
    if (method === 'POST' && pfad === '/customers') { const c = { id: neueId('cus'), object: 'customer', email: p.email, name: p.name, description: p.description, phone: p.phone || null, address: p.address || null, tax_ids: p.tax_id_data ? Object.values(p.tax_id_data) : [], metadata: p.metadata || {}, preferred_locales: p.preferred_locales ? Object.values(p.preferred_locales) : [], invoice_settings: Object.assign({ default_payment_method: null, footer: null }, p.invoice_settings || {}), balance: 0 }; db.kunden.set(c.id, c); return antwort(200, c); }
    if (method === 'POST' && (m = /^\/customers\/([^/]+)$/.exec(pfad))) { const c = db.kunden.get(m[1]); if (!c) return fehler(404, 'No such customer: ' + m[1]); if (p.invoice_settings) Object.assign(c.invoice_settings, p.invoice_settings); ['email', 'name', 'phone', 'address'].forEach((k) => { if (p[k] !== undefined) c[k] = p[k]; }); if (p.metadata) Object.assign(c.metadata, p.metadata); return antwort(200, c); }
    /* Kassen */
    if (method === 'POST' && pfad === '/checkout/sessions') {
      if (p.customer && !db.kunden.has(p.customer)) return fehler(400, 'No such customer: ' + p.customer);
      (p.line_items || []).forEach((li) => { if (li.price && !db.preise.some((x) => x.id === li.price)) throw new Error('Preis fehlt: ' + li.price); (li.tax_rates || []).forEach((t) => { if (!db.steuern.some((x) => x.id === t)) throw new Error('Steuersatz fehlt: ' + t); }); });
      const id = neueId('cs');
      const k = { id: id, object: 'checkout.session', created: Math.floor(Date.now() / 1000) + nr, mode: p.mode, status: 'open', payment_status: p.mode === 'setup' ? 'no_payment_required' : 'unpaid', customer: p.customer || null, customer_email: p.customer_email || null, customer_details: null, client_reference_id: p.client_reference_id || null, metadata: p.metadata || {}, amount_total: null, url: 'https://checkout.stripe.com/c/pay/' + id, success_url: p.success_url, cancel_url: p.cancel_url, payment_intent: null, setup_intent: null, subscription: null, _p: p };
      db.kassen.set(id, k); return antwort(200, Object.assign({}, k, { _p: undefined }));
    }
    if (method === 'GET' && pfad === '/checkout/sessions') return antwort(200, liste(Array.from(db.kassen.values()).filter((k) => (!p.customer || k.customer === p.customer) && (!p.status || k.status === p.status)).reverse().slice(0, zahl(p.limit) || 10).map((k) => Object.assign({}, k, { _p: undefined }))));
    if (method === 'POST' && (m = /^\/checkout\/sessions\/([^/]+)\/expire$/.exec(pfad))) { const k = db.kassen.get(m[1]); if (!k) return fehler(404, 'No such checkout.session: ' + m[1]); if (k.status !== 'open') return fehler(400, 'Only Checkout Sessions with a status in ["open"] can be expired.'); k.status = 'expired'; return antwort(200, Object.assign({}, k, { _p: undefined })); }
    if (method === 'GET' && (m = /^\/checkout\/sessions\/([^/]+)$/.exec(pfad))) {
      const k = db.kassen.get(m[1]); if (!k) return fehler(404, 'No such checkout.session: ' + m[1]);
      const ex = p.expand ? Object.values(p.expand) : [], out = kopie(Object.assign({}, k, { _p: undefined }));
      if (out.payment_intent && !ex.includes('payment_intent')) out.payment_intent = out.payment_intent.id;
      if (out.setup_intent && !ex.includes('setup_intent.payment_method')) out.setup_intent = out.setup_intent.id;
      if (out.subscription) { const s = kopie(db.abos.get(out.subscription)); out.subscription = ex.includes('subscription.default_payment_method') ? s : s.id; }
      return antwort(200, out);
    }
    /* Abos */
    if (method === 'GET' && pfad === '/subscriptions') { const st = p.status || 'active'; return antwort(200, liste(Array.from(db.abos.values()).filter((x) => (!p.customer || x.customer === p.customer) && (st === 'all' || x.status === st)).slice(0, zahl(p.limit) || 10).map((x) => Object.assign(kopie(x), { default_payment_method: x.default_payment_method ? x.default_payment_method.id : null })))); }
    if (method === 'GET' && (m = /^\/subscriptions\/([^/]+)$/.exec(pfad))) { const s = db.abos.get(m[1]); if (!s) return fehler(404, 'No such subscription: ' + m[1]); const out = kopie(s); out.default_payment_method = s.default_payment_method ? s.default_payment_method.id : null; return antwort(200, out); }
    if (method === 'POST' && (m = /^\/subscriptions\/([^/]+)$/.exec(pfad))) {
      const s = db.abos.get(m[1]); if (!s) return fehler(404, 'No such subscription: ' + m[1]);
      if (p.cancel_at_period_end !== undefined) s.cancel_at_period_end = p.cancel_at_period_end === 'true';
      if (p.items) Object.values(p.items).forEach((it) => { const item = s.items.data.find((x) => x.id === it.id); if (!item) throw new Error('Abo-Posten fehlt: ' + it.id); item.price = kopie(db.preise.find((x) => x.id === it.price)); });
      if (p.metadata) Object.assign(s.metadata, p.metadata);
      if (p.default_payment_method) { const z = db.zahlarten.get(p.default_payment_method); if (!z) return fehler(400, 'No such PaymentMethod: ' + p.default_payment_method); s.default_payment_method = kopie(z); }
      if (p.default_tax_rates) s.default_tax_rates = Object.values(p.default_tax_rates);
      if (p.pause_collection !== undefined) s.pause_collection = p.pause_collection && typeof p.pause_collection === 'object' ? { behavior: p.pause_collection.behavior } : null;
      if (p.proration_behavior) s._proration = p.proration_behavior;
      return antwort(200, s);
    }
    if (method === 'POST' && pfad === '/subscriptions') {
      if (!db.kunden.has(p.customer)) return fehler(400, 'No such customer: ' + p.customer);
      const posten = p.items ? Object.values(p.items) : [], preis = posten[0] && db.preise.find((x) => x.id === posten[0].price);
      if (!preis) return fehler(400, 'No such price: ' + (posten[0] && posten[0].price));
      const zahlart = p.default_payment_method ? db.zahlarten.get(p.default_payment_method) : null;
      if (p.default_payment_method && !zahlart) return fehler(400, 'No such PaymentMethod: ' + p.default_payment_method);
      const ende = Math.floor(Date.now() / 1000) + 30 * 86400, status = aboStatusNeu || 'active';
      const inv = { id: neueId('in'), object: 'invoice', customer: p.customer, status: status === 'active' ? 'paid' : 'open', number: 'EEZI-' + String(++rechnungNr).padStart(4, '0'), currency: 'eur', total: preis.unit_amount, hosted_invoice_url: 'https://invoice.stripe.com/i/' + nr, metadata: {}, created: Math.floor(Date.now() / 1000) };
      db.rechnungen.set(inv.id, inv);
      const sub = { id: neueId('sub'), object: 'subscription', customer: p.customer, status: status, cancel_at_period_end: false, pause_collection: null, metadata: p.metadata || {}, default_tax_rates: p.default_tax_rates ? Object.values(p.default_tax_rates) : [], default_payment_method: zahlart ? kopie(zahlart) : null, current_period_end: ende, off_session: p.off_session === 'true', payment_behavior: p.payment_behavior || null, items: { data: [{ id: neueId('si'), price: kopie(preis), current_period_end: ende }] }, latest_invoice: inv.id };
      db.abos.set(sub.id, sub);
      const out = Object.assign(kopie(sub), { default_payment_method: zahlart ? zahlart.id : null });
      if (p.expand && Object.values(p.expand).includes('latest_invoice.payment_intent')) out.latest_invoice = Object.assign(kopie(inv), { payment_intent: { id: neueId('pi'), object: 'payment_intent', status: status === 'active' ? 'succeeded' : 'requires_action' } });
      return antwort(200, out);
    }
    if (method === 'DELETE' && (m = /^\/subscriptions\/([^/]+)$/.exec(pfad))) { const s = db.abos.get(m[1]); if (!s) return fehler(404, 'No such subscription: ' + m[1]); if (s.status === 'canceled') return fehler(400, 'This subscription has already been canceled.'); s.status = 'canceled'; return antwort(200, kopie(s)); }
    /* Erstattungen, Rechnungen je Kunde, Kundenportal */
    if (method === 'POST' && pfad === '/refunds') { const r = { id: neueId('re'), object: 'refund', payment_intent: p.payment_intent, amount: p.amount ? zahl(p.amount) : null, status: 'succeeded', metadata: p.metadata || {} }; db.erstattungen.push(r); return antwort(200, r); }
    if (method === 'GET' && pfad === '/invoices') return antwort(200, liste(Array.from(db.rechnungen.values()).filter((x) => (!p.customer || x.customer === p.customer)).reverse().slice(0, zahl(p.limit) || 10).map((x) => rechnungSicht(Object.assign({}, x, { _p: undefined })))));
    if (method === 'GET' && pfad === '/billing_portal/configurations') return antwort(200, liste(db.portale.filter((x) => p.active === undefined || String(x.active) === p.active)));
    if (method === 'POST' && pfad === '/billing_portal/configurations') { const c = { id: neueId('bpc'), object: 'billing_portal.configuration', active: true, features: p.features || {}, business_profile: p.business_profile || {}, metadata: p.metadata || {} }; db.portale.push(c); return antwort(200, c); }
    if (method === 'POST' && pfad === '/billing_portal/sessions') { if (!db.kunden.has(p.customer)) return fehler(400, 'No such customer: ' + p.customer); if (p.configuration && !db.portale.some((x) => x.id === p.configuration)) return fehler(400, 'No such configuration: ' + p.configuration); const se = { id: neueId('bps'), object: 'billing_portal.session', customer: p.customer, configuration: p.configuration || null, return_url: p.return_url, url: 'https://billing.stripe.com/p/session/' + nr }; db.portalSitzungen.push(se); return antwort(200, se); }
    /* Rechnungen und Posten */
    if (method === 'POST' && pfad === '/invoices') {
      if (!db.kunden.has(p.customer)) return fehler(400, 'No such customer: ' + p.customer);
      const inv = { id: neueId('in'), object: 'invoice', customer: p.customer, status: 'draft', number: null, currency: p.currency || 'eur', collection_method: p.collection_method, auto_advance: p.auto_advance === 'true', description: p.description || null, footer: p.footer || null, metadata: p.metadata || {}, hosted_invoice_url: null, created: Math.floor(Date.now() / 1000), _p: p };
      db.rechnungen.set(inv.id, inv);
      if (p.pending_invoice_items_behavior === 'include') for (const it of db.posten.values()) if (it.customer === p.customer && !it.invoice) it.invoice = inv.id;
      return antwort(200, rechnungSicht(Object.assign({}, inv, { _p: undefined })));
    }
    if (method === 'GET' && (m = /^\/invoices\/([^/]+)$/.exec(pfad))) { const inv = db.rechnungen.get(m[1]); if (!inv) return fehler(404, 'No such invoice: ' + m[1]); return antwort(200, rechnungSicht(Object.assign({}, inv, { _p: undefined }))); }
    if (method === 'POST' && (m = /^\/invoices\/([^/]+)\/finalize$/.exec(pfad))) {
      const inv = db.rechnungen.get(m[1]); if (!inv) return fehler(404, 'No such invoice: ' + m[1]); if (inv.status !== 'draft') return fehler(400, 'This invoice is already finalized.');
      inv.status = 'open'; inv.number = 'EEZI-' + String(++rechnungNr).padStart(4, '0'); inv.hosted_invoice_url = 'https://invoice.stripe.com/i/' + inv.id; if (p.auto_advance !== undefined) inv.auto_advance = p.auto_advance === 'true';
      const kunde = db.kunden.get(inv.customer), total = summe(inv);
      if (kunde && kunde.balance < 0 && -kunde.balance >= total) { kunde.balance += total; inv.status = 'paid'; }
      return antwort(200, rechnungSicht(Object.assign({}, inv, { _p: undefined })));
    }
    if (method === 'DELETE' && (m = /^\/invoices\/([^/]+)$/.exec(pfad))) {
      const inv = db.rechnungen.get(m[1]); if (!inv) return fehler(404, 'No such invoice: ' + m[1]); if (inv.status !== 'draft') return fehler(400, 'You can only delete draft invoices.');
      db.rechnungen.delete(inv.id); for (const it of db.posten.values()) if (it.invoice === inv.id) it.invoice = null;
      return antwort(200, { id: inv.id, object: 'invoice', deleted: true });
    }
    if (method === 'POST' && pfad === '/invoiceitems') {
      if (!db.kunden.has(p.customer)) return fehler(400, 'No such customer: ' + p.customer);
      if (p.invoice) { const inv = db.rechnungen.get(p.invoice); if (!inv) return fehler(404, 'No such invoice: ' + p.invoice); if (inv.status !== 'draft') return fehler(400, 'You can only add invoice items to draft invoices.'); }
      const tax = (p.tax_rates ? Object.values(p.tax_rates) : []).map((t) => { const x = db.steuern.find((y) => y.id === t); if (!x) throw new Error('Steuersatz fehlt: ' + t); return kopie(x); });
      const it = { id: neueId('ii'), object: 'invoiceitem', customer: p.customer, invoice: p.invoice || null, amount: zahl(p.amount), currency: p.currency, description: p.description || null, metadata: p.metadata || {}, tax_rates: tax };
      db.posten.set(it.id, it); return antwort(200, it);
    }
    if (method === 'GET' && pfad === '/invoiceitems') {
      const ex = p.expand ? Object.values(p.expand) : [];
      let alle = Array.from(db.posten.values()).filter((it) => (!p.customer || it.customer === p.customer) && (!p.invoice || it.invoice === p.invoice)).reverse();
      if (p.starting_after) alle = alle.slice(alle.findIndex((it) => it.id === p.starting_after) + 1);
      const n = zahl(p.limit) || 10, data = alle.slice(0, n).map((it) => { const o = kopie(it); if (o.invoice && ex.includes('data.invoice')) o.invoice = rechnungSicht(Object.assign({}, db.rechnungen.get(o.invoice), { _p: undefined })); return o; });
      return antwort(200, Object.assign(liste(data), { has_more: alle.length > n }));
    }
    if (method === 'DELETE' && (m = /^\/invoiceitems\/([^/]+)$/.exec(pfad))) {
      const it = db.posten.get(m[1]); if (!it) return fehler(404, 'No such invoiceitem: ' + m[1]); const inv = it.invoice && db.rechnungen.get(it.invoice);
      if (inv && inv.status !== 'draft') return fehler(400, 'Invoice items on finalized invoices cannot be deleted.');
      db.posten.delete(it.id); return antwort(200, { id: it.id, object: 'invoiceitem', deleted: true });
    }
    return fehler(404, 'Nicht nachgestellt: ' + method + ' ' + pfad);
  }

  globalThis.fetch = async (url, init) => {
    const u = new URL(typeof url === 'string' ? url : url.url);
    if (u.hostname !== 'api.stripe.com') return echt(url, init);
    init = init || {};
    const method = init.method || 'GET', pfad = u.pathname.replace(/^\/v1/, ''), kopf = init.headers || {};
    const p = method === 'GET' ? lesen(u.search.slice(1)) : lesen(init.body);
    const eintrag = { method: method, pfad: pfad, version: kopf['Stripe-Version'], idem: kopf['Idempotency-Key'] || '', auth: kopf.Authorization || '', p: p, roh: method === 'GET' ? u.search.slice(1) : String(init.body || '') };
    log.push(eintrag);
    if (fehlerBei && fehlerBei(eintrag)) return fehler(400, 'Nachgestellter Fehler bei ' + method + ' ' + pfad);
    if (eintrag.idem && db.idem.has(eintrag.idem)) { const alt = db.idem.get(eintrag.idem); if (alt.roh !== eintrag.roh) return fehler(400, 'Keys for idempotent requests can only be used with the same parameters they were first used with.'); if (alt.laeuft) return fehler(409, 'There is currently another in-progress request using this Idempotent Key (that probably means you submitted twice, and the other request is still going through). Please try again later.'); return new Response(alt.text, { status: alt.status, headers: { 'content-type': 'application/json', 'idempotent-replayed': 'true' } }); }
    if (eintrag.idem) db.idem.set(eintrag.idem, { roh: eintrag.roh, laeuft: true }); // wie bei Stripe: dieselbe Anfrage noch unterwegs → 409
    const r = behandeln(method, pfad, p, kopf), text = await r.text();
    if (eintrag.idem) db.idem.set(eintrag.idem, { roh: eintrag.roh, text: text, status: r.status });
    return new Response(text, { status: r.status, headers: { 'content-type': 'application/json' } });
  };

  return {
    log: log, db: db,
    aus() { globalThis.fetch = echt; },
    fehlerBei(fn) { fehlerBei = fn || null; },
    /* Kasse abschließen, als hätte der Kunde bei Stripe bezahlt bzw. eine Zahlungsart hinterlegt.
       o.zahlung: 'paid' (Standard), 'processing' (z. B. SEPA unterwegs), o.art: 'sepa_debit' | 'card' */
    abschliessen(id, o) {
      o = o || {}; const k = db.kassen.get(id); if (!k) throw new Error('Kasse fehlt: ' + id);
      k.status = 'complete'; k.customer_details = { email: k.customer_email || (k.customer && db.kunden.get(k.customer).email) || null };
      if (k.mode === 'payment') {
        const li = k._p.line_items[0], netto = li.price_data ? zahl(li.price_data.unit_amount) : (db.preise.find((x) => x.id === li.price) || {}).unit_amount;
        /* exklusive Steuer kommt dazu (Einrichtung der Pakete), inklusive steckt im Betrag (Aufmaßblatt) */
        const steuer = (li.tax_rates ? Object.values(li.tax_rates) : []).map((t) => db.steuern.find((x) => x.id === t)).filter((t) => t && !t.inclusive).reduce((sum, t) => sum + Math.round(netto * t.percentage / 100), 0);
        const betrag = o.betrag != null ? o.betrag : netto + steuer;
        k.amount_total = betrag; k.payment_status = o.zahlung === 'processing' ? 'unpaid' : 'paid';
        const zahlart = (k._p.payment_intent_data && k._p.payment_intent_data.setup_future_usage) || o.art ? pm(o.art || 'card') : null;
        k.payment_intent = { id: neueId('pi'), object: 'payment_intent', status: o.zahlung === 'processing' ? 'processing' : 'succeeded', payment_method: zahlart ? zahlart.id : null, customer: k.customer, metadata: (k._p.payment_intent_data || {}).metadata || {} };
        if (k._p.invoice_creation && k._p.invoice_creation.enabled === 'true' && k.payment_status === 'paid' && (k._p.metadata || {}).art === 'einrichtung') { const inv = { id: neueId('in'), object: 'invoice', customer: k.customer, status: 'paid', number: 'EEZI-' + String(++rechnungNr).padStart(4, '0'), currency: 'eur', total: betrag, hosted_invoice_url: 'https://invoice.stripe.com/i/' + nr, invoice_pdf: 'https://pay.stripe.com/invoice/' + nr + '/pdf', metadata: (k._p.invoice_creation.invoice_data || {}).metadata || {}, created: Math.floor(Date.now() / 1000) }; db.rechnungen.set(inv.id, inv); k.invoice = inv.id; }
      }
      if (k.mode === 'setup') k.setup_intent = { id: neueId('seti'), object: 'setup_intent', status: 'succeeded', payment_method: pm(o.art) };
      if (k.mode === 'subscription') {
        const li = k._p.line_items[0], preis = db.preise.find((x) => x.id === li.price), ende = Math.floor(Date.now() / 1000) + 30 * 86400;
        const sub = { id: neueId('sub'), object: 'subscription', customer: k.customer, status: o.abo || 'active', cancel_at_period_end: false, metadata: (k._p.subscription_data || {}).metadata || {}, default_tax_rates: ((k._p.subscription_data || {}).default_tax_rates ? Object.values(k._p.subscription_data.default_tax_rates) : []), default_payment_method: pm(o.art), current_period_end: ende, items: { data: [{ id: neueId('si'), price: kopie(preis), current_period_end: ende }] } };
        db.abos.set(sub.id, sub); k.subscription = sub.id; k.payment_status = o.zahlung === 'processing' ? 'unpaid' : 'paid';
      }
      return kopie(Object.assign({}, k, { _p: undefined, subscription: k.subscription, setup_intent: k.setup_intent ? k.setup_intent.id : null, payment_intent: k.payment_intent ? k.payment_intent.id : null }));
    },
    /* Lastschrift unterwegs → gutgeschrieben (checkout.session.async_payment_succeeded) bzw. zurückgegeben (…_failed) */
    zahlungEingang(id, o) {
      o = o || {}; const k = db.kassen.get(id); if (!k || !k.payment_intent) throw new Error('Kasse ohne Zahlung: ' + id);
      if (o.fehl) { k.payment_intent.status = 'requires_payment_method'; return kopie(Object.assign({}, k, { _p: undefined, payment_intent: k.payment_intent.id })); }
      k.payment_status = 'paid'; k.payment_intent.status = 'succeeded';
      return kopie(Object.assign({}, k, { _p: undefined, payment_intent: k.payment_intent.id }));
    },
    /* Status neuer Abos (POST /subscriptions): null = active, sonst z. B. 'incomplete' (3-D-Secure nötig) */
    aboStatus(st) { aboStatusNeu = st || null; },
    /* Abo bei Stripe beenden (wie nach Kündigung oder erfolglosem Mahnen) */
    aboBeenden(id) { const sub = db.abos.get(id); if (!sub) throw new Error('Abo fehlt: ' + id); sub.status = 'canceled'; return kopie(sub); },
    /* Guthaben eines Kunden (in Cent), etwa aus einer anteiligen Gutschrift */
    guthaben(id, cent) { const c = db.kunden.get(id); if (!c) throw new Error('Kunde fehlt: ' + id); c.balance -= cent; },
    /* Kasse samt Zeitpunkt, um eine ältere Kasse nachzustellen */
    zeitpunkt(id, sekunden) { const k = db.kassen.get(id); if (!k) throw new Error('Kasse fehlt: ' + id); k.created = sekunden; },
    /* Thin-Ereignis (Ereignisziel mit Format „Thin“): nur Typ und Verweis auf das Objekt, gleiche Unterschrift */
    thin(geheimnis, typ, art, objektId, id) {
      const pfade = { invoice: '/v1/invoices/', subscription: '/v1/subscriptions/', 'checkout.session': '/v1/checkout/sessions/' };
      const roh = JSON.stringify({ id: id || neueId('evt'), object: 'v2.core.event', type: 'v1.' + typ, created: new Date().toISOString(), livemode: false, related_object: { id: objektId, type: art, url: pfade[art] + objektId } });
      const t = Math.floor(Date.now() / 1000), sig = createHmac('sha256', geheimnis).update(t + '.' + roh).digest('hex');
      return { roh: roh, kopf: 't=' + t + ',v1=' + sig };
    },
    /* Ereignis mit gültiger Unterschrift, wie Stripe es an den Webhook schickt */
    webhook(geheimnis, typ, objekt, id) {
      const roh = JSON.stringify({ id: id || neueId('evt'), object: 'event', type: typ, api_version: '2026-09-30.endive', created: Math.floor(Date.now() / 1000), data: { object: objekt } });
      const t = Math.floor(Date.now() / 1000), sig = createHmac('sha256', geheimnis).update(t + '.' + roh).digest('hex');
      return { roh: roh, kopf: 't=' + t + ',v1=' + sig };
    }
  };
}

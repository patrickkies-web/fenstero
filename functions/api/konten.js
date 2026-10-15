/* eeziframes · Konten der Betriebe auf dem Server: Anmeldung, Registrierung, Projekte, Eingang von Aufmaßen, Tarif, Zahlungsart, Sammelrechnung.
   Die Regeln (Zählung, Buchung, Nachbesserung) stehen in web/assets/modell.js und sind dieselben wie im Browser; hier führt sie der Server aus,
   deshalb kann ein Browser sie nicht umgehen. Das Konto eines Betriebs ist ein JSON-Dokument (siehe speicher.js). */
import '../../web/assets/modell.js';
import { ApiFehler, erlaubt, ip } from './umgebung.js';
import { codeSenden, codePruefen, erneuern, nutzer } from './auth.js';

const X = () => globalThis.Abrechnung;
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const jahr = () => new Date().getFullYear();
const FARBEN = ['#0071e3', '#1f7a3d', '#a85a00', '#6e3fc2', '#0b7285', '#b3261e'];

function melden(a, n) { (a.notif = a.notif || []).unshift(Object.assign({ when: X().stamp(), new: true }, n)); if (a.notif.length > 200) a.notif.length = 200; }
/* Was der Browser bekommt: Konto wie im Betriebsbereich, dazu Firmendaten und ob Stripe eingerichtet ist.
   Gesperrte Aufmaße (kostenpflichtig, noch keine Zahlungsart) verlassen den Server nur als Umriss: Anzahl der Positionen und Fotos, keine Maße. */
export function sicht(row) {
  const a = row.daten || {};
  const links = (a.links || []).map((l) => {
    if (!l.locked || !l.aufmass) return l;
    const am = l.aufmass;
    return Object.assign({}, l, { aufmass: { windows: (am.windows || []).map(() => X().fromApp({ name: 'Gesperrt' })), proj: {}, fotos: am.fotos || 0, elemente: am.elemente || 0, gesperrt: true }, vorher: [] });
  });
  return { id: row.id, company: { id: 'srv', name: row.name, plz: row.plz || '', since: a.since || jahr(), col: a.col || FARBEN[0] }, acc: Object.assign({}, a, { links: links }), stripe: { kunde: !!row.stripe_customer, abo: !!row.stripe_subscription } };
}
async function angemeldet(ctx) {
  const auth = ctx.request.headers.get('authorization') || '', token = auth.replace(/^Bearer\s+/i, '');
  const n = await nutzer(ctx.k, token); if (!n) throw new ApiFehler('Bitte neu anmelden.', 401);
  ctx.nutzer = n; ctx.row = await ctx.sp.betriebNachAuth(n.id);
  return n;
}
async function mitBetrieb(ctx) { await angemeldet(ctx); if (!ctx.row) throw new ApiFehler('Zu dieser Anmeldung gibt es noch keinen Betrieb. Bitte registrieren.', 404); return ctx.row; }
/* Konto ändern: Zeit anwenden, Änderung ausführen, speichern, Sicht zurückgeben */
async function aendern(ctx, fn) {
  const out = await ctx.sp.betriebAendern(ctx.row.id, async (a, row) => { const t = X().tickKonto(a); t.notifs.forEach((n) => melden(a, n)); const r = await fn(a, row); return r; });
  const row = await ctx.sp.betriebHolen(ctx.row.id);
  return Object.assign({ ok: true, konto: sicht(row) }, out || {});
}
async function stripeKunde(ctx) {
  if (ctx.row.stripe_customer) return ctx.row.stripe_customer;
  const a = ctx.row.daten || {}, id = await ctx.zd.kundeAnlegen({ id: ctx.row.id, mail: ctx.row.mail, name: ctx.row.name });
  await ctx.sp.betriebFelder(ctx.row.id, { stripe_customer: id }); ctx.row.stripe_customer = id; return id;
}
const zurueck = (ctx) => ctx.url.origin + '/';

export const KONTO = {
  /* --- Anmeldung --- */
  'POST /api/konto/anmelden': async (ctx) => {
    if (!erlaubt('otp:' + ip(ctx.request), 8, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    return codeSenden(ctx.k, ctx.sp, ctx.body.mail);
  },
  'POST /api/konto/bestaetigen': async (ctx) => {
    if (!erlaubt('otpv:' + ip(ctx.request), 15, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const s = await codePruefen(ctx.k, ctx.sp, ctx.body.mail, ctx.body.code);
    const row = await ctx.sp.betriebNachAuth(s.nutzer.id);
    if (row) { const t = X().tickKonto(row.daten || {}); if (t.dirty) await ctx.sp.betriebAendern(row.id, (a) => { X().tickKonto(a).notifs.forEach((n) => melden(a, n)); }); }
    const frisch = row ? await ctx.sp.betriebHolen(row.id) : null;
    return { ok: true, token: s.token, refresh: s.refresh, mail: s.nutzer.mail, konto: frisch ? sicht(frisch) : null };
  },
  'POST /api/konto/erneuern': async (ctx) => { const s = await erneuern(ctx.k, ctx.body.refresh); if (!s) throw new ApiFehler('Bitte neu anmelden.', 401); return { ok: true, token: s.token, refresh: s.refresh, mail: s.nutzer.mail }; },
  'POST /api/konto/registrieren': async (ctx) => {
    const n = await angemeldet(ctx); if (ctx.row) return { ok: true, konto: sicht(ctx.row), schon: true };
    const b = ctx.body || {}, firma = str(b.firma, 80), ap = str(b.ap, 80), tel = str(b.tel, 40), plz = str(b.plz, 5), col = FARBEN.includes(b.col) ? b.col : FARBEN[0];
    if (firma.length < 2) throw new ApiFehler('Bitte den Namen des Betriebs eingeben.');
    if (ap.length < 2) throw new ApiFehler('Bitte einen Ansprechpartner eingeben.');
    if (tel.replace(/\D/g, '').length < 6) throw new ApiFehler('Bitte eine Telefonnummer eingeben.');
    if (!/^\d{5}$/.test(plz)) throw new ApiFehler('Bitte eine fünfstellige Postleitzahl eingeben.');
    if (!b.agb) throw new ApiFehler('Bitte den Nutzungsbedingungen zustimmen.');
    const telN = X().normTel(tel), nameN = X().normFirma(firma);
    const dups = await ctx.sp.betriebeDup({ tel: telN.length >= 6 ? telN : '', name: nameN.length >= 4 ? nameN : '', plz: plz.slice(0, 2) });
    const dup = dups && dups.length ? dups[0] : null;
    const a = { name: firma, plz: plz, col: col, since: jahr(), konto: 'service', pay: null, ap: ap, mail: n.mail, tel: tel, abzug: { seite: 15, oben: 15 }, prefs: { mail: true, remind: true }, rechnungen: [], links: [], book: [], freeUsed: 0, notif: [] };
    if (dup) { a.freeQuota = 0; a.dupOf = dup.name; }
    melden(a, { t: 'Willkommen bei eeziframes', s: dup ? 'Für ' + dup.name + ' gibt es schon ein Konto, die kostenlosen Projekte wurden dort genutzt. Ab dem ersten Aufmaß brauchen Sie eine Zahlungsart.' : 'Legen Sie Ihr erstes Projekt an oder laden Sie gleich mehrere Kunden ein. Die ersten ' + X().preise().frei + ' Projekte sind kostenlos.', to: ['links'] });
    const row = await ctx.sp.betriebAnlegen({ auth_user: n.id, mail: n.mail, name: firma, plz: plz, tel_norm: telN, name_norm: nameN, daten: a });
    return { ok: true, konto: sicht(row) };
  },
  /* --- Konto lesen und pflegen --- */
  'GET /api/konto': async (ctx) => { await mitBetrieb(ctx); return aendern(ctx, () => ({})); },
  'PATCH /api/konto': async (ctx) => {
    await mitBetrieb(ctx); const b = ctx.body || {};
    return aendern(ctx, (a) => {
      if (b.ap !== undefined) a.ap = str(b.ap, 80); if (b.tel !== undefined) a.tel = str(b.tel, 40); if (b.mail !== undefined && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(b.mail))) a.mail = str(b.mail, 120).toLowerCase();
      if (b.abzug) { a.abzug = { seite: Math.max(0, Math.min(60, parseInt(b.abzug.seite, 10) || 0)), oben: Math.max(0, Math.min(60, parseInt(b.abzug.oben, 10) || 0)) }; }
      if (b.prefs) { a.prefs = a.prefs || {}; Object.keys(b.prefs).slice(0, 10).forEach((k2) => { a.prefs[k2] = !!b.prefs[k2]; }); }
      if (b.gelesen) (a.notif || []).forEach((n) => { n.new = false; });
      if (b.gelesenIndex !== undefined && a.notif && a.notif[+b.gelesenIndex]) a.notif[+b.gelesenIndex].new = false;
    });
  },
  /* --- Projekte --- */
  'POST /api/konto/projekte': async (ctx) => {
    await mitBetrieb(ctx);
    return aendern(ctx, (a) => { const r = X().neuesProjekt(a, ctx.body || {}); if (!r.ok) throw new ApiFehler(r.msg); return { id: r.l.id }; });
  },
  'POST /api/konto/projekte/liste': async (ctx) => {
    await mitBetrieb(ctx);
    return aendern(ctx, (a) => { const neu = X().listeProjekte(a, (ctx.body || {}).text, !!(ctx.body || {}).du); if (!neu.length) throw new ApiFehler('Keine gültige Zeile gefunden. Beispiel: Familie Weber, 0171 2345678'); return { n: neu.length }; });
  },
  'PATCH /api/konto/projekte/:id': async (ctx) => {
    await mitBetrieb(ctx);
    return aendern(ctx, (a) => { const l = (a.links || []).find((x) => x.id === ctx.params.id); const r = X().projektAendern(l, ctx.body || {}); if (!r.ok) throw new ApiFehler(r.msg); return { msg: r.msg || '' }; });
  },
  'POST /api/konto/import': async (ctx) => {
    await mitBetrieb(ctx); const o = X().unpack((ctx.body || {}).code);
    if (!o) throw new ApiFehler('Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.');
    return aendern(ctx, (a) => { const r = X().importCode(a, o); if (r.notif) melden(a, r.notif); return { eingang: { ok: r.ok, art: r.art, msg: r.msg, feier: r.feier || '', id: r.l ? r.l.id : '', locked: !!r.locked } }; });
  },
  /* --- Tarif --- */
  'POST /api/konto/plan': async (ctx) => {
    await mitBetrieb(ctx); const plan = ['service', 'abo', 'plus'].includes((ctx.body || {}).plan) ? ctx.body.plan : 'service', a0 = ctx.row.daten || {}, alt = X().konto(a0);
    const hoch = X().RANG[plan] > X().RANG[alt];
    if (hoch && plan !== 'service') {
      if (ctx.row.stripe_subscription) { await ctx.zd.aboAendern(ctx.row.stripe_subscription, plan); return aendern(ctx, (a) => ({ ergebnis: X().planWechsel(a, plan) })); }
      const customer = await stripeKunde(ctx);
      const kasse = await ctx.zd.aboKasse({ id: ctx.row.id, customer: customer, plan: plan, zurueck: zurueck(ctx) });
      return { ok: true, url: kasse.url };
    }
    if (plan === 'service' && ctx.row.stripe_subscription) await ctx.zd.aboKuendigen(ctx.row.stripe_subscription, false);
    if (plan === alt && a0.downgrade && ctx.row.stripe_subscription) await ctx.zd.aboKuendigen(ctx.row.stripe_subscription, true);
    if (plan !== 'service' && !hoch && plan !== alt && ctx.row.stripe_subscription) { await ctx.zd.aboAendern(ctx.row.stripe_subscription, plan); }
    return aendern(ctx, (a) => ({ ergebnis: X().planWechsel(a, plan) }));
  },
  'GET /api/konto/plan/pruefen': async (ctx) => {
    await mitBetrieb(ctx); const session = str(ctx.url.searchParams.get('session'), 120), planA = str(ctx.url.searchParams.get('plan'), 10);
    const r = await ctx.zd.aboUebernehmen(session, planA); if (!r) throw new ApiFehler('Das Abo wurde nicht abgeschlossen.', 402);
    await ctx.sp.betriebFelder(ctx.row.id, { stripe_subscription: r.subscription });
    return aendern(ctx, (a) => { if (r.pay && !a.pay) a.pay = Object.assign({ when: X().stamp() }, r.pay); const w = X().planWechsel(a, r.plan); melden(a, { t: X().planName(r.plan) + ' aktiv', s: w.msg, to: ['abrechnung'] }); return { ergebnis: w }; });
  },
  /* --- Zahlungsart --- */
  'POST /api/konto/zahlungsart': async (ctx) => {
    await mitBetrieb(ctx); const customer = await stripeKunde(ctx);
    const kasse = await ctx.zd.zahlungsartKasse({ id: ctx.row.id, customer: customer, zurueck: zurueck(ctx) });
    return { ok: true, url: kasse.url };
  },
  'GET /api/konto/zahlungsart/pruefen': async (ctx) => {
    await mitBetrieb(ctx); const session = str(ctx.url.searchParams.get('session'), 120);
    const pay = await ctx.zd.zahlungsartUebernehmen(session); if (!pay) throw new ApiFehler('Keine Zahlungsart hinterlegt.', 402);
    return aendern(ctx, (a) => { a.pay = Object.assign({ when: X().stamp() }, pay); const n = X().unlockWaiting(a); if (n) melden(a, { t: X().nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet', s: 'Zahlungsart hinterlegt, die wartenden Aufmaße sind jetzt sichtbar.', to: ['links'] }); return { n: n }; });
  },
  /* --- Aus der App: Link prüfen, Fortschritt melden, Aufmaß direkt senden (ohne Anmeldung, der Link-Code ist der Schlüssel) --- */
  'GET /api/link/:code': async (ctx) => {
    const code = str(ctx.params.code, 12).toLowerCase(); if (!/^[a-z0-9]{3,12}$/.test(code)) throw new ApiFehler('Kein gültiger Link.', 404);
    const row = await ctx.sp.betriebNachCode(code); if (!row) throw new ApiFehler('Diesen Link gibt es nicht.', 404);
    const l = (row.daten.links || []).find((x) => x.code === code), a = row.daten;
    return { ok: true, betrieb: row.name, kunde: l.kunde || '', status: l.status, runde: l.nb && l.nb.offen ? l.nb.runde : (l.runde || 1), hinweis: l.nb && l.nb.offen ? l.nb.hinweis || '' : '', du: !!l.du, expires: l.expires || '', ap: a.ap || '' };
  },
  'POST /api/link/:code/fortschritt': async (ctx) => {
    const code = str(ctx.params.code, 12).toLowerCase(); const row = await ctx.sp.betriebNachCode(code); if (!row) throw new ApiFehler('Diesen Link gibt es nicht.', 404);
    if (!erlaubt('fort:' + code, 60, 10 * 60 * 1000)) return { ok: true };
    const b = ctx.body || {};
    await ctx.sp.betriebAendern(row.id, (a) => { const l = (a.links || []).find((x) => x.code === code); if (X().fortschritt(l, b.stufe, b.k) && b.stufe === 'geoeffnet') melden(a, { t: l.kunde + ' hat den Link geöffnet', s: 'Projekt ' + (l.nr || '') + ', noch keine Maße eingetragen.', to: ['link', l.id] }); });
    return { ok: true };
  },
  'POST /api/aufmass': async (ctx) => {
    const o = ctx.body || {}; if (!o || !Array.isArray(o.w) || !o.b) throw new ApiFehler('Kein Aufmaß im Versand.');
    if (!erlaubt('am:' + ip(ctx.request), 30, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Sendungen. Bitte gleich noch einmal.', 429);
    const code = str(o.b, 12).toLowerCase(); const row = await ctx.sp.betriebNachCode(code); if (!row) throw new ApiFehler('Dieser Link gehört zu keinem Projekt mehr.', 404);
    o.v = 1; o.b = code;
    const r = await ctx.sp.betriebAendern(row.id, (a) => { const t = X().tickKonto(a); t.notifs.forEach((n) => melden(a, n)); const res = X().importCode(a, o, undefined, 'App'); if (res.notif) melden(a, res.notif); return res; });
    if (!r.ok) throw new ApiFehler(r.art === 'schon' ? 'Dieses Aufmaß ist schon angekommen.' : r.art === 'doppelt' ? 'Dieses Aufmaß ist schon da.' : r.msg, r.art === 'schon' || r.art === 'doppelt' ? 409 : 400);
    return { ok: true, betrieb: row.name, runde: r.l ? r.l.runde || 1 : 1, nachbesserung: r.art === 'nb' || r.art === 'nb-neu' };
  }
};

/* Alle zwei Wochen (Cron): offene Projektbuchungen je Betrieb als Sammelrechnung bei Stripe anlegen; Abos rechnet Stripe selbst ab */
export async function abrechnungslauf(k, sp, zd) {
  if (!sp || !zd) return { ok: false, grund: 'kein Speicher oder Zahlungsdienst' };
  const rows = await sp.betriebeMitKunde(); let n = 0;
  for (const row of rows) {
    const offen = ((row.daten || {}).book || []).filter((b) => b.kind === 'aufmass' && b.status === 'offen' && b.betrag > 0);
    if (!offen.length || !(row.daten || {}).pay) continue;
    const re = await zd.rechnung({ id: row.id, customer: row.stripe_customer, posten: offen.map((b) => ({ betrag: b.betrag, text: b.text + ' · ' + (b.sub || '') })) });
    await sp.betriebAendern(row.id, (a) => {
      (a.book || []).forEach((b) => { if (offen.some((o) => o.id === b.id)) { b.status = 'berechnet'; b.rechnung = re.nr; } });
      (a.rechnungen = a.rechnungen || []).unshift({ nr: re.nr, id: re.id, datum: X().datum(), betrag: re.betrag != null ? re.betrag : offen.reduce((s, b) => s + b.betrag, 0), pos: offen.length, status: 'offen' });
      melden(a, { t: 'Sammelrechnung ' + re.nr, s: X().nW(offen.length, 'Projekt', 'Projekte') + ', wird von Ihrer Zahlungsart eingezogen.', to: ['abrechnung'] });
    });
    n++;
  }
  return { ok: true, rechnungen: n };
}
/* Stripe meldet: Rechnung bezahlt (Sammelrechnung oder Abo), Zahlung fehlgeschlagen, Abo beendet.
   Der Betrieb steht in den Metadaten: bei Sammelrechnungen auf der Rechnung, bei Abo-Rechnungen auf dem Abo (subscription_details). */
const betriebVon = (obj) => (obj.metadata && obj.metadata.betrieb) || (obj.subscription_details && obj.subscription_details.metadata && obj.subscription_details.metadata.betrieb) || '';
export async function stripeEreignis(sp, ev) {
  const typ = ev.type, obj = ev.data && ev.data.object ? ev.data.object : {}, id = betriebVon(obj);
  if (!id) return false;
  if (typ === 'invoice.paid') {
    const abo = !!obj.subscription, monat = X().monthKey(obj.created ? obj.created * 1000 : Date.now());
    await sp.betriebAendern(id, (a) => {
      (a.rechnungen || []).forEach((r) => { if (r.id === obj.id || r.nr === obj.number) r.status = 'bezahlt'; });
      (a.book || []).forEach((b) => { if (b.rechnung && b.rechnung === obj.number) b.status = 'bezahlt'; if (abo && (b.kind === 'abo' || b.kind === 'plus') && b.month === monat) b.status = 'bezahlt'; });
    });
    return true;
  }
  if (typ === 'customer.subscription.deleted') {
    await sp.betriebAendern(id, (a) => { if (X().konto(a) !== 'service') { a.konto = 'service'; a.downgrade = null; melden(a, { t: 'Abo beendet', s: 'Ihr Tarif ist jetzt Start: ' + X().preise().projekt + ' € je Projekt mit eingegangenem Aufmaß.', to: ['abrechnung'] }); } });
    await sp.betriebFelder(id, { stripe_subscription: null });
    return true;
  }
  if (typ === 'invoice.payment_failed') {
    await sp.betriebAendern(id, (a) => { melden(a, { t: 'Zahlung fehlgeschlagen', s: 'Eine Rechnung konnte nicht eingezogen werden. Bitte prüfen Sie Ihre Zahlungsart.', to: ['abrechnung'] }); });
    return true;
  }
  return false;
}

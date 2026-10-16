/* eeziframes · Konten der Betriebe auf dem Server: Anmeldung, Registrierung, Projekte, Eingang von Aufmaßen, Tarif, Zahlungsart, Sammelrechnung.
   Die Regeln (Zählung, Buchung, Nachbesserung) stehen in web/assets/modell.js und sind dieselben wie im Browser; hier führt sie der Server aus,
   deshalb kann ein Browser sie nicht umgehen. Das Konto eines Betriebs ist ein JSON-Dokument (siehe speicher.js). */
import '../../web/assets/modell.js';
import { ApiFehler, erlaubt, quelle, linkBremse, linkUnbekannt } from './umgebung.js';
import { GRENZEN, zuText, langerCode, kennung, ohneBild, metaMischen, zeitKappen } from './entwurf.js';
import { codeSenden, codePruefen, erneuern, nutzer } from './auth.js';

const X = () => globalThis.Abrechnung;
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const jahr = () => new Date().getFullYear();
const FARBEN = ['#0071e3', '#1f7a3d', '#a85a00', '#6e3fc2', '#0b7285', '#b3261e'];

export function melden(a, n) { (a.notif = a.notif || []).unshift(Object.assign({ when: X().stamp(), new: true }, n)); if (a.notif.length > 200) a.notif.length = 200; }
/* Was der Browser bekommt: Konto wie im Betriebsbereich, dazu Firmendaten und ob Stripe eingerichtet ist.
   Gesperrte Aufmaße (kostenpflichtig, noch keine Zahlungsart) verlassen den Server nur als Umriss: Anzahl der Positionen und Fotos, keine Maße.
   Was die Zentrale am Konto vermerkt (verwaltung: Sperre, interne Notiz, Verlauf), bleibt auf dem Server; der Datenexport enthält es. */
export function sicht(row) {
  const a = row.daten || {};
  const links = (a.links || []).map((l) => {
    if (!l.locked || !l.aufmass) return l;
    const am = l.aufmass;
    return Object.assign({}, l, { aufmass: { windows: (am.windows || []).map(() => X().fromApp({ name: 'Gesperrt' })), proj: {}, fotos: am.fotos || 0, elemente: am.elemente || 0, gesperrt: true }, vorher: [] });
  });
  return { id: row.id, company: { id: 'srv', name: row.name, plz: row.plz || '', since: a.since || jahr(), col: a.col || FARBEN[0] }, acc: Object.assign({}, a, { links: links, verwaltung: undefined }), stripe: { kunde: !!row.stripe_customer, abo: !!row.stripe_subscription } };
}
/* Von der Zentrale gesperrt: kein Zugang zum Konto, die Kundenlinks ruhen. Die Begründung sieht nur, wer sich mit Code oder Link
   als Inhaber des Kontos ausgewiesen hat. */
export const sperreVon = (row) => (row && row.daten && row.daten.verwaltung && row.daten.verwaltung.sperre) || null;
const LINK_RUHT = 'Dieser Link ist zurzeit nicht aktiv. Bitte beim Fensterbauer nachfragen.';
function sperrFehler(row) {
  const g = String((sperreVon(row) || {}).grund || '').trim();
  return new ApiFehler('Ihr Zugang zu eeziframes ist gesperrt' + (g ? '. Begründung: ' + g + (/[.!?]$/.test(g) ? '' : '.') : '.') + ' Wenn Sie widersprechen möchten, schreiben Sie uns (Kontakt im Impressum).', 403, { gesperrt: true });
}
async function angemeldet(ctx) {
  const auth = ctx.request.headers.get('authorization') || '', token = auth.replace(/^Bearer\s+/i, '');
  const n = await nutzer(ctx.k, token); if (!n) throw new ApiFehler('Bitte neu anmelden.', 401);
  ctx.nutzer = n; ctx.row = await ctx.sp.betriebNachAuth(n.id);
  if (sperreVon(ctx.row)) throw sperrFehler(ctx.row);
  return n;
}
async function mitBetrieb(ctx) { await angemeldet(ctx); if (!ctx.row) throw new ApiFehler('Zu dieser Anmeldung gibt es noch keinen Betrieb. Bitte registrieren.', 404); return ctx.row; }
const zaehlen = (ctx, s) => { if (ctx.zaehlen) ctx.zaehlen(s); };
/* Nach Code oder Link: Konto prüfen (Sperre), Zeit anwenden, Anmeldung vermerken (für die Zentrale: letzte Anmeldung, Anzahl) */
async function anmeldungFertig(ctx, uid) {
  const row = await ctx.sp.betriebNachAuth(uid);
  if (row && sperreVon(row)) throw sperrFehler(row);
  if (row) await ctx.sp.betriebAendern(row.id, (a) => { X().tickKonto(a).notifs.forEach((m) => melden(a, m)); a.angemeldet = new Date().toISOString(); a.anmeldungen = (a.anmeldungen || 0) + 1; });
  zaehlen(ctx, row ? 'ereignis:anmeldung' : 'ereignis:anmeldung_ohne_betrieb');
  return row ? await ctx.sp.betriebHolen(row.id) : null;
}
/* Konto ändern: Zeit anwenden, Änderung ausführen, speichern, Sicht zurückgeben; „zuletzt“ ist die letzte Aktivität für die Zentrale */
async function aendern(ctx, fn) {
  const out = await ctx.sp.betriebAendern(ctx.row.id, async (a, row) => { const t = X().tickKonto(a); t.notifs.forEach((n) => melden(a, n)); a.zuletzt = new Date().toISOString(); const r = await fn(a, row); return r; });
  const row = await ctx.sp.betriebHolen(ctx.row.id);
  return Object.assign({ ok: true, konto: sicht(row) }, out || {});
}
async function stripeKunde(ctx) {
  if (ctx.row.stripe_customer) return ctx.row.stripe_customer;
  const a = ctx.row.daten || {}, id = await ctx.zd.kundeAnlegen({ id: ctx.row.id, mail: ctx.row.mail, name: ctx.row.name });
  await ctx.sp.betriebFelder(ctx.row.id, { stripe_customer: id }); ctx.row.stripe_customer = id; return id;
}
const zurueck = (ctx) => ctx.url.origin + '/';
/* Kassen von Stripe übernehmen. Rückkehr des Betriebs und Webhook können in beliebiger Reihenfolge und auch gleichzeitig ankommen,
   Stripe stellt Webhooks nach Fehlern erneut zu, auch Stunden später. Darum:
   - Eine Kasse gehört zu genau einem Betrieb (Metadaten) und zählt je Betrieb nur einmal.
   - Eine ältere Kasse überschreibt keine neuere (Zeitpunkt der Kasse), auch nicht die Standard-Zahlungsart bei Stripe.
   - Gezählt und geschrieben wird erst nach der Prüfung, mit erneuter Prüfung im Speichervorgang (betriebAendern liest frisch). */
const gehoert = (r, row) => r.betrieb === null || r.betrieb === row.id; // null: Attrappe ohne Metadaten
const neuer = (merk, session, created) => !merk || (merk.session !== session && (!merk.at || !created || created >= merk.at));
function zahlungsartMerken(a, r, session) {
  const merk = a.pay ? { session: a.pay.session, at: a.pay.sessionAt } : null;
  if (a.pay && a.pay.session === session) return { n: a.pay.frei || 0 };
  if (!neuer(merk, session, r.created)) return { n: 0, alt: true };
  a.pay = Object.assign({ when: X().stamp(), session: session, sessionAt: r.created || 0 }, r.pay);
  const n = X().unlockWaiting(a); a.pay.frei = n;
  if (n) melden(a, { t: X().nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet', s: 'Zahlungsart hinterlegt, die wartenden Aufmaße sind jetzt sichtbar.', to: ['links'] });
  return { n: n };
}
const payMerk = (a) => (a.pay ? { session: a.pay.session, at: a.pay.sessionAt } : null);
async function zahlungsartUebernehmen(sp, zd, row, r, session) {
  if (neuer(payMerk(row.daten || {}), session, r.created)) await zd.standardZahlungsart(r.customer, r.pm, row.stripe_subscription || '');
  return sp.betriebAendern(row.id, (a) => zahlungsartMerken(a, r, session));
}
/* Die bei der Abo-Kasse angegebene Zahlungsart wird auch Standard für Sammelrechnungen, wenn sie die neueste ist */
function aboMerken(a, r) {
  const fertig = { art: 'aktiv', msg: X().planName(r.plan) + ' aktiv' };
  if (a.aboSitzung && a.aboSitzung.id === r.session) return fertig;
  if (r.pay && neuer(payMerk(a), r.session, r.created)) a.pay = Object.assign({ when: X().stamp(), session: r.session, sessionAt: r.created || 0 }, r.pay);
  if (!a.pay) a.pay = Object.assign({ when: X().stamp() }, r.pay || { type: 'Zahlungsart', label: 'bei Stripe hinterlegt' });
  if (r.bezahlt && !(a.aboBezahlt >= X().monthKey())) a.aboBezahlt = X().monthKey(); // erste Monatszahlung schon da: Buchung entsteht als bezahlt
  a.aboSitzung = { id: r.session, at: r.created || 0 };
  const w = X().planWechsel(a, r.plan);
  if (w.art === 'aktiv') melden(a, { t: X().planName(r.plan) + ' aktiv', s: w.msg, to: ['abrechnung'] });
  return w.art === 'gleich' ? Object.assign({}, w, fertig) : w;
}
async function aboUebernehmen(sp, zd, row, r) {
  const a0 = row.daten || {};
  if (a0.aboSitzung && a0.aboSitzung.id === r.session) return { art: 'aktiv', msg: X().planName(r.plan) + ' aktiv' }; // schon übernommen
  /* Ein anderes, noch laufendes Abo im Konto wird nicht stillschweigend ersetzt (zwei Abos zugleich: nur bei einem Wettlauf zweier Kassen) */
  if (row.stripe_subscription && row.stripe_subscription !== r.subscription && (await zd.aboLaeuft(row.stripe_subscription))) {
    console.log('Zweites laufendes Abo', row.id, r.subscription, 'neben', row.stripe_subscription);
    await sp.betriebAendern(row.id, (a) => { melden(a, { t: 'Zweites Abo bei Stripe', s: 'Für Ihren Betrieb laufen zwei Abos. Bitte melden Sie sich bei uns, wir erstatten das doppelte.', to: ['abrechnung'] }); });
    return { art: 'doppelt', msg: 'Für Ihren Betrieb läuft schon ein Abo. Bitte melden Sie sich bei uns.' };
  }
  if (row.stripe_subscription !== r.subscription) await sp.betriebFelder(row.id, { stripe_subscription: r.subscription });
  if (r.pay && neuer(payMerk(a0), r.session, r.created)) await zd.standardZahlungsart(r.customer, r.pm);
  return sp.betriebAendern(row.id, (a) => aboMerken(a, r));
}

export const KONTO = {
  /* --- Anmeldung --- */
  'POST /api/konto/anmelden': async (ctx) => {
    if (!erlaubt('otp:' + quelle(ctx.request), 8, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const r = await codeSenden(ctx.k, ctx.sp, ctx.body.mail, zurueck(ctx));
    zaehlen(ctx, 'ereignis:anmeldecode');
    return r;
  },
  /* Anmeldelink aus der E-Mail: Supabase leitet mit #access_token=…&refresh_token=… auf die Startseite, portal.js schickt beides her */
  'POST /api/konto/sitzung': async (ctx) => {
    if (!erlaubt('otpv:' + quelle(ctx.request), 15, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const b = ctx.body || {}, token = str(b.token, 4000), refresh = str(b.refresh, 400);
    const n = await nutzer(ctx.k, token); if (!n) throw new ApiFehler('Der Anmeldelink ist abgelaufen oder schon benutzt. Bitte fordern Sie einen neuen an.', 401);
    const frisch = await anmeldungFertig(ctx, n.id);
    return { ok: true, token: token, refresh: refresh, mail: n.mail, konto: frisch ? sicht(frisch) : null };
  },
  'POST /api/konto/bestaetigen': async (ctx) => {
    if (!erlaubt('otpv:' + quelle(ctx.request), 15, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const s = await codePruefen(ctx.k, ctx.sp, ctx.body.mail, ctx.body.code);
    const frisch = await anmeldungFertig(ctx, s.nutzer.id);
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
    a.zuletzt = a.angemeldet = new Date().toISOString(); a.anmeldungen = 1;
    const row = await ctx.sp.betriebAnlegen({ auth_user: n.id, mail: n.mail, name: firma, plz: plz, tel_norm: telN, name_norm: nameN, daten: a });
    zaehlen(ctx, dup ? ['ereignis:registrierung', 'ereignis:doppelkonto_verdacht'] : 'ereignis:registrierung');
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
    const out = await aendern(ctx, (a) => { const r = X().neuesProjekt(a, ctx.body || {}); if (!r.ok) throw new ApiFehler(r.msg); return { id: r.l.id }; });
    zaehlen(ctx, 'ereignis:projekt');
    return out;
  },
  'POST /api/konto/projekte/liste': async (ctx) => {
    await mitBetrieb(ctx);
    const out = await aendern(ctx, (a) => { const neu = X().listeProjekte(a, (ctx.body || {}).text, !!(ctx.body || {}).du); if (!neu.length) throw new ApiFehler('Keine gültige Zeile gefunden. Beispiel: Familie Weber, 0171 2345678'); return { n: neu.length }; });
    zaehlen(ctx, new Array(out.n).fill('ereignis:projekt'));
    return out;
  },
  'PATCH /api/konto/projekte/:id': async (ctx) => {
    await mitBetrieb(ctx);
    return aendern(ctx, (a) => { const l = (a.links || []).find((x) => x.id === ctx.params.id); const r = X().projektAendern(l, ctx.body || {}); if (!r.ok) throw new ApiFehler(r.msg); return { msg: r.msg || '' }; });
  },
  'POST /api/konto/import': async (ctx) => {
    await mitBetrieb(ctx); const o = X().unpack((ctx.body || {}).code);
    if (!o) throw new ApiFehler('Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.');
    const out = await aendern(ctx, (a) => { const r = X().importCode(a, o); if (r.notif) melden(a, r.notif); return { eingang: { ok: r.ok, art: r.art, msg: r.msg, feier: r.feier || '', id: r.l ? r.l.id : '', locked: !!r.locked } }; });
    if (out.eingang.ok) zaehlen(ctx, 'ereignis:code_eingefuegt');
    return out;
  },
  /* --- Tarif --- */
  'POST /api/konto/plan': async (ctx) => {
    await mitBetrieb(ctx); const plan = ['service', 'abo', 'plus'].includes((ctx.body || {}).plan) ? ctx.body.plan : 'service', a0 = ctx.row.daten || {}, alt = X().konto(a0);
    const hoch = X().RANG[plan] > X().RANG[alt];
    if (hoch && plan !== 'service') {
      if (ctx.row.stripe_subscription) { await ctx.zd.aboAendern(ctx.row.stripe_subscription, plan); return aendern(ctx, (a) => ({ ergebnis: X().planWechsel(a, plan) })); }
      const customer = await stripeKunde(ctx);
      const kasse = await ctx.zd.aboKasse({ id: ctx.row.id, customer: customer, plan: plan, zurueck: zurueck(ctx) });
      if (kasse.vorhanden) { // bei Stripe läuft schon ein Abo dieses Betriebs: übernehmen und umstellen, kein zweites
        await ctx.sp.betriebFelder(ctx.row.id, { stripe_subscription: kasse.vorhanden }); await ctx.zd.aboAendern(kasse.vorhanden, plan);
        return aendern(ctx, (a) => { if (!a.pay) a.pay = { when: X().stamp(), type: 'Zahlungsart', label: 'bei Stripe hinterlegt' }; return { ergebnis: X().planWechsel(a, plan) }; });
      }
      zaehlen(ctx, 'ereignis:abo_kasse');
      return { ok: true, url: kasse.url };
    }
    if (plan === 'service' && ctx.row.stripe_subscription) await ctx.zd.aboKuendigen(ctx.row.stripe_subscription, false);
    if (plan === alt && a0.downgrade && ctx.row.stripe_subscription) await ctx.zd.aboKuendigen(ctx.row.stripe_subscription, true);
    if (plan !== 'service' && !hoch && plan !== alt && ctx.row.stripe_subscription) { await ctx.zd.aboAendern(ctx.row.stripe_subscription, plan); }
    return aendern(ctx, (a) => ({ ergebnis: X().planWechsel(a, plan) }));
  },
  'GET /api/konto/plan/pruefen': async (ctx) => {
    await mitBetrieb(ctx); const session = str(ctx.url.searchParams.get('session'), 120), planA = str(ctx.url.searchParams.get('plan'), 10);
    const r = await ctx.zd.aboLesen(session, planA); if (!r) throw new ApiFehler('Das Abo wurde nicht abgeschlossen.', 402);
    if (!gehoert(r, ctx.row)) throw new ApiFehler('Dieses Abo gehört zu einem anderen Konto.', 403);
    const ergebnis = await aboUebernehmen(ctx.sp, ctx.zd, ctx.row, r);
    return aendern(ctx, () => ({ ergebnis: ergebnis }));
  },
  /* --- Zahlungsart --- */
  'POST /api/konto/zahlungsart': async (ctx) => {
    await mitBetrieb(ctx); const customer = await stripeKunde(ctx);
    const kasse = await ctx.zd.zahlungsartKasse({ id: ctx.row.id, customer: customer, zurueck: zurueck(ctx) });
    zaehlen(ctx, 'ereignis:zahlungsart_kasse');
    return { ok: true, url: kasse.url };
  },
  'GET /api/konto/zahlungsart/pruefen': async (ctx) => {
    await mitBetrieb(ctx); const session = str(ctx.url.searchParams.get('session'), 120);
    const r = await ctx.zd.zahlungsartLesen(session); if (!r) throw new ApiFehler('Keine Zahlungsart hinterlegt.', 402);
    if (!gehoert(r, ctx.row)) throw new ApiFehler('Diese Zahlungsart gehört zu einem anderen Konto.', 403);
    const out = await zahlungsartUebernehmen(ctx.sp, ctx.zd, ctx.row, r, session);
    return aendern(ctx, () => out);
  },
  /* --- Aus der App: Link prüfen, Fortschritt melden, Aufmaß direkt senden (ohne Anmeldung, der Link-Code ist der Schlüssel) --- */
  'GET /api/link/:code': async (ctx) => {
    linkBremse(ctx.request);
    const code = str(ctx.params.code, 12).toLowerCase(); if (!/^[a-z0-9]{3,12}$/.test(code)) throw linkUnbekannt(ctx.request, 'Kein gültiger Link.');
    const row = await ctx.sp.betriebNachCode(code); if (!row) throw linkUnbekannt(ctx.request);
    if (sperreVon(row)) throw new ApiFehler(LINK_RUHT, 404);
    const l = (row.daten.links || []).find((x) => x.code === code), a = row.daten;
    /* zu: abgelaufen (auch wenn die Zeit noch nicht angewendet wurde), deaktiviert oder schon eingegangen */
    const zu = X().linkZu(l), status = zu === 'abgelaufen' ? 'abgelaufen' : l.status;
    return { ok: true, betrieb: row.name, kunde: l.kunde || '', status: status, zu: zu, zuText: zu ? zuText(zu, row.name) : '', runde: l.nb && l.nb.offen ? l.nb.runde : (l.runde || 1), seit: l.eingegangenAt || 0, hinweis: l.nb && l.nb.offen ? l.nb.hinweis || '' : '', du: !!l.du, expires: l.expires || '', ap: a.ap || '', grenzen: GRENZEN };
  },
  /* Geöffnet: der Betrieb bekommt einen Hinweis; beim ersten Öffnen beginnen die 60 Tage, die der Kunde Zeit hat */
  'POST /api/link/:code/fortschritt': async (ctx) => {
    linkBremse(ctx.request);
    const code = str(ctx.params.code, 12).toLowerCase(); const row = await ctx.sp.betriebNachCode(code); if (!row) throw linkUnbekannt(ctx.request);
    if (!erlaubt('fort:' + code, 60, 10 * 60 * 1000) || sperreVon(row)) return { ok: true };
    const b = ctx.body || {};
    let expires = '';
    const neu = await ctx.sp.betriebAendern(row.id, (a) => { const l = (a.links || []).find((x) => x.code === code); const r = X().fortschritt(l, b.stufe, b.k); if (l) expires = l.expires || ''; if (r === 'geoeffnet') { melden(a, { t: l.kunde + ' hat den Link geöffnet', s: 'Projekt ' + (l.nr || '') + ', noch keine Maße eingetragen.', to: ['link', l.id] }); return true; } return false; });
    if (neu) zaehlen(ctx, 'ereignis:link_geoeffnet');
    return { ok: true, expires: expires };
  },
  'POST /api/aufmass': async (ctx) => {
    const o = ctx.body || {}; if (!o || !Array.isArray(o.w) || !o.b) throw new ApiFehler('Kein Aufmaß im Versand.');
    if (!erlaubt('am:' + quelle(ctx.request), 30, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Sendungen. Bitte gleich noch einmal.', 429);
    const code = str(o.b, 12).toLowerCase(); const row = await ctx.sp.betriebNachCode(code); if (!row) throw new ApiFehler('Dieser Link gehört zu keinem Projekt mehr.', 404);
    if (sperreVon(row)) throw new ApiFehler(LINK_RUHT, 404);
    /* Abgelaufene oder deaktivierte Links nehmen nichts mehr an (der Betrieb kann verlängern); höchstens 50 Fenster je Aufmaß */
    const zu = X().linkZu((row.daten.links || []).find((x) => x.code === code));
    if (zu === 'abgelaufen' || zu === 'deaktiviert') throw new ApiFehler(zuText(zu, row.name), 410, { zu: zu });
    if (o.w.length > GRENZEN.fenster) throw new ApiFehler('Ein Aufmaß umfasst höchstens ' + GRENZEN.fenster + ' Fenster.', 400);
    /* Kennungen und Zähler der Fenster (wm, gleiche Reihenfolge wie w) gehören nicht ins Aufmaß des Betriebs; mit ihnen prüft der
       Server die Grenze gegen den Zwischenstand und hält ihn auf dem gesendeten Stand (für eine spätere Nachbesserung auf einem
       anderen Gerät) */
    const jetzt = Date.now(), wm = Array.isArray(o.wm) && o.wm.length === o.w.length ? o.wm.map((x) => ({ wid: kennung(x), t0: Number(x && x.t0) || 0, aend: Number(x && x.aend) || 0, ts: zeitKappen(x && x.ts, jetzt) })) : null, standB = zeitKappen(o.stand, jetzt);
    delete o.wm; delete o.stand;
    const zw = langerCode(code) && ctx.sp.entwurfHolen ? await ctx.sp.entwurfHolen(code).catch(() => undefined) : undefined;
    if (zw && Object.keys((zw.meta || {}).fenster || {}).length && (!wm || wm.some((x) => !x.wid))) throw new ApiFehler('Bitte die Seite neu laden und noch einmal senden.', 400); // ohne Kennungen ließe sich die Grenze umgehen
    if (zw && wm) { const ids = new Set(Object.keys((zw.meta || {}).fenster || {})); wm.forEach((x) => { if (x.wid) ids.add(x.wid); }); if (Math.max(ids.size, Number((zw.meta || {}).angelegt) || 0) > GRENZEN.fenster) throw new ApiFehler('Ein Aufmaß umfasst höchstens ' + GRENZEN.fenster + ' Fenster, gelöschte zählen mit.', 400); }
    o.v = 1; o.b = code;
    const r = await ctx.sp.betriebAendern(row.id, (a) => { const t = X().tickKonto(a); t.notifs.forEach((n) => melden(a, n)); const res = X().importCode(a, o, undefined, 'App'); if (res.notif) melden(a, res.notif); return res; });
    if (!r.ok) throw new ApiFehler(r.art === 'schon' ? 'Dieses Aufmaß ist schon angekommen.' : r.art === 'doppelt' ? 'Dieses Aufmaß ist schon da.' : r.msg, r.art === 'schon' || r.art === 'doppelt' ? 409 : 400, r.art === 'schon' && r.l && X().linkZu(r.l) === 'eingegangen' ? { zu: 'eingegangen', runde: r.l.runde || 1, seit: r.l.eingegangenAt || 0 } : undefined); // schon da: die App zeigt „schon erledigt“
    const nb = r.art === 'nb' || r.art === 'nb-neu';
    zaehlen(ctx, nb ? 'ereignis:nachbesserung' : 'ereignis:aufmass_gesendet');
    /* Zwischenstand als gesendet vermerken (für die Zentrale und das Aufräumen) und auf den gesendeten Stand bringen, außer bei einer
       Teil-Nachbesserung (m); fehlt die Tabelle, ist das egal */
    if (ctx.sp.entwurfAendern && langerCode(code)) ctx.waitUntil(ctx.sp.entwurfAendern(code, row.id, (e) => {
      if (!e.version && !wm) return false;
      if (wm && !o.m) {
        /* Inhalt nur ersetzen, wenn der Zwischenstand älter ist als der gesendete (die App gleicht vorher ab; neuer ist er nur, wenn ein
           anderes Gerät danach weitergemacht hat) */
        if ((Number(e.stand) || 0) < standB || !((e.daten || {}).windows || []).length) { e.daten = { windows: o.w.map((w, i) => Object.assign(ohneBild(w), wm[i])), proj: o.p || {} }; e.stand = Math.max(Number(e.stand) || 0, standB); }
        e.meta = metaMischen(e.meta || {}, wm, 0, jetzt);
      }
      e.meta = Object.assign({}, e.meta || {}, { gesendet: r.l ? r.l.runde || 1 : 1, gesendetAm: new Date().toISOString() });
      return true;
    }).catch(() => false));
    return { ok: true, betrieb: row.name, runde: r.l ? r.l.runde || 1 : 1, nachbesserung: nb };
  }
};

/* Alle zwei Wochen (Cron): offene Projektbuchungen je Betrieb als Sammelrechnung bei Stripe anlegen; Abos rechnet Stripe selbst ab.
   Ein Fehler bei einem Betrieb hält die anderen nicht auf. Was Stripe schon berechnet hat (Speichern danach fehlgeschlagen), wird nur nachgetragen.
   nurId: nur dieser Betrieb (Zentrale, „jetzt abrechnen“). */
export async function abrechnungslauf(k, sp, zd, nurId) {
  if (!sp || !zd) return { ok: false, grund: 'kein Speicher oder Zahlungsdienst' };
  const rows = nurId ? [await sp.betriebHolen(nurId)].filter((r) => r && r.stripe_customer) : await sp.betriebeMitKunde(); let n = 0, fehler = 0, meldung = '';
  for (const row of rows) {
    const offen = ((row.daten || {}).book || []).filter((b) => b.kind === 'aufmass' && b.status === 'offen' && b.betrag > 0);
    if (!offen.length || !(row.daten || {}).pay) continue;
    try {
      const re = await zd.rechnung({ id: row.id, customer: row.stripe_customer, posten: offen.map((b) => ({ buchung: b.id, betrag: b.betrag, text: b.text + (b.sub ? ' · ' + b.sub : '') })) });
      const alle = (re.schon || []).concat(re.neu ? [Object.assign({ neu: true, status: 'offen' }, re.neu)] : []).filter((r) => (r.buchungen || []).length);
      if (!alle.length) continue;
      await sp.betriebAendern(row.id, (a) => {
        alle.forEach((r) => {
          const teil = (a.book || []).filter((b) => r.buchungen.includes(b.id) && b.status === 'offen');
          teil.forEach((b) => { b.status = r.status === 'bezahlt' ? 'bezahlt' : 'berechnet'; b.rechnung = r.nr; });
          if ((a.rechnungen || []).some((x) => x.id === r.id)) return;
          (a.rechnungen = a.rechnungen || []).unshift({ nr: r.nr, id: r.id, datum: X().datum(), betrag: r.betrag != null ? r.betrag : teil.reduce((s, b) => s + b.betrag, 0), pos: r.buchungen.length, status: r.status, url: r.url || '' });
          if (r.neu) melden(a, { t: 'Sammelrechnung ' + r.nr, s: X().nW(r.buchungen.length, 'Projekt', 'Projekte') + ', wird von Ihrer Zahlungsart eingezogen.', to: ['abrechnung'] });
        });
      });
      if (re.neu) n++;
    } catch (e) {
      const text = String(e && e.message ? e.message : e);
      fehler++; console.log('Sammelrechnung fehlgeschlagen', row.id, text.slice(0, 200));
      /* für die Zentrale: der letzte Grund, Stripes „noch unterwegs“ auf Deutsch */
      meldung = /in-progress request|another in-progress/i.test(text) ? 'Ein anderer Abrechnungslauf arbeitet gerade an dieser Rechnung. Bitte später noch einmal.' : text.slice(0, 200);
    }
  }
  return { ok: !fehler, rechnungen: n, fehler: fehler, meldung: meldung };
}
/* Stripe meldet: Kasse abgeschlossen (Zahlungsart, Abo), Rechnung bezahlt (Sammelrechnung oder Abo), Zahlung fehlgeschlagen, Abo beendet.
   Der Betrieb steht in den Metadaten: bei Kassen und Sammelrechnungen auf dem Objekt selbst, bei Abo-Rechnungen auf dem Abo.
   Webhooks kommen in der API-Version, die beim Ziel in Stripe eingestellt ist: Bis 2025-02 stehen die Abo-Angaben einer Rechnung in
   subscription und subscription_details, seit 2025-03-31 unter parent.subscription_details. Beide Formen werden gelesen. */
const aboAngaben = (obj) => obj.subscription_details || (obj.parent && obj.parent.subscription_details) || null;
const idVon = (v) => (v && typeof v === 'object' ? v.id : v) || '';
export const aboVon = (obj) => idVon(obj.subscription) || idVon((aboAngaben(obj) || {}).subscription);
export const betriebVon = (obj) => (obj.metadata && obj.metadata.betrieb) || ((aboAngaben(obj) || {}).metadata || {}).betrieb || '';
export async function stripeEreignis(sp, ev, zd) {
  const typ = ev.type, obj = ev.data && ev.data.object ? ev.data.object : {}, id = betriebVon(obj);
  if (!id) return false;
  const row = await sp.betriebHolen(id); if (!row) return false; // z. B. ein gelöschtes Testkonto: nichts zu tun, Stripe bekommt trotzdem 200
  /* Kasse abgeschlossen, auch wenn der Betrieb danach das Fenster schließt, statt zurückzukehren (gleiche Wege wie die Rückkehr) */
  if (typ === 'checkout.session.completed' && obj.mode === 'setup' && zd) {
    const r = await zd.zahlungsartLesen(obj.id); if (!r || !gehoert(r, row)) return false;
    await zahlungsartUebernehmen(sp, zd, row, r, obj.id);
    return true;
  }
  if (typ === 'checkout.session.completed' && obj.mode === 'subscription' && zd) {
    const r = await zd.aboLesen(obj.id); if (!r || !gehoert(r, row)) return false;
    await aboUebernehmen(sp, zd, row, r);
    return true;
  }
  if (typ === 'invoice.paid') {
    const abo = !!aboVon(obj), monat = X().monthKey(obj.created ? obj.created * 1000 : Date.now());
    /* Eine Sammelrechnung, die bei uns noch nicht eingetragen ist (der Lauf speichert gerade): 503, Stripe stellt später erneut zu */
    if (!abo && obj.metadata && obj.metadata.art === 'sammelrechnung' && !((row.daten || {}).rechnungen || []).some((r) => r.id === obj.id)) throw new ApiFehler('Sammelrechnung noch nicht eingetragen, bitte später erneut.', 503);
    await sp.betriebAendern(id, (a) => {
      if (abo && !(a.aboBezahlt >= monat)) a.aboBezahlt = monat; // Monatsbeträge bis hierhin bezahlt, auch solche, die erst danach gebucht werden
      (a.rechnungen || []).forEach((r) => { if (r.id === obj.id || r.nr === obj.number) r.status = 'bezahlt'; });
      (a.book || []).forEach((b) => { if (b.rechnung && b.rechnung === obj.number) b.status = 'bezahlt'; if (abo && (b.kind === 'abo' || b.kind === 'plus') && b.month <= monat) b.status = 'bezahlt'; });
    });
    return true;
  }
  if (typ === 'customer.subscription.deleted') {
    if (row.stripe_subscription && row.stripe_subscription !== obj.id) return false; // ein altes Abo; das aktuelle läuft weiter
    await sp.betriebAendern(id, (a) => { if (X().konto(a) !== 'service') { a.konto = 'service'; a.downgrade = null; melden(a, { t: 'Abo beendet', s: 'Ihr Tarif ist jetzt Start: ' + X().preise().projekt + ' € je Projekt mit eingegangenem Aufmaß.', to: ['abrechnung'] }); } });
    await sp.betriebFelder(id, { stripe_subscription: null });
    return true;
  }
  if (typ === 'invoice.payment_failed') {
    await sp.betriebAendern(id, (a) => {
      (a.rechnungen || []).forEach((r) => { if ((r.id === obj.id || r.nr === obj.number) && r.status !== 'bezahlt') r.status = 'fehlgeschlagen'; });
      melden(a, { t: 'Zahlung fehlgeschlagen', s: 'Eine Rechnung konnte nicht eingezogen werden. Bitte prüfen Sie Ihre Zahlungsart.', to: ['abrechnung'] });
    });
    return true;
  }
  return false;
}

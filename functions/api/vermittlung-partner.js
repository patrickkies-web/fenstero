/* eeziframes · Bereich für Fensterbauer in der Vermittlung (docs/VERMITTLUNG.md, Abschnitt 13; Auftrag des Inhabers, 30.10.2026)
   Der Betrieb bekommt kein Aufmaßblatt mehr per Mail, sondern einen Link in den Kundenbereich /konto/ (derselbe wie für die Pakete,
   Anmeldung per Code an die E-Mail-Adresse, functions/auftrag/index.js). Dort sieht er die Anfrage zuerst als Vorschau (Ort, Eckdaten,
   Echtheit: Nummer per Code bestätigt), schaltet sie frei (das erste Aufmaß kostenlos, jedes weitere PREIS_NETTO € zzgl. USt über Stripe)
   und hat dann Kontakt und Aufmaßblatt. Er kann sich ins Register eintragen und seine Bereitschaft erklären (Partner: steht bei Kunden in
   seiner Umgebung auf Platz 1 und 2, vermittlung-register.js).
   Routen:
     GET  /api/anfrage/:token                 ohne Anmeldung: Vorschau der Anfrage, an welche Adresse der Zugang ging (maskiert), ob die
                                              Sitzung dazu passt → { ok, vorschau, mail, angemeldet, passt }
     POST /api/anfrage/:token/annehmen        Sitzung kunde mit derselben Adresse: Register mit dem Konto verknüpfen, Zugang als geöffnet
                                              merken → { ok, id, betrieb }
     GET  /api/konto/anfragen                 → { ok, betriebe: [Register-Einträge des Kontos], anfragen: [Vorschauen], preis, fassung, kasse }
     GET  /api/konto/anfragen/:id             → { ok, anfrage } (Vorschau; freigeschaltet: dazu kunde und pdf)
     GET  /api/konto/anfragen/:id/pdf         Aufmaßblatt, nur freigeschaltet
     POST /api/konto/anfragen/:id/freischalten { zustimmung: true } → { ok, frei: true, anfrage } (erstes kostenlos) oder { ok, kasse: url }
     GET  /api/konto/anfragen/:id/kasse?session= Rückkehr von Stripe → { ok, bezahlt, anfrage }
     POST /api/konto/partner { betrieb, bereit, zustimmung } Bereitschaft erklären oder zurücknehmen → { ok, betrieb }
     POST /api/konto/betrieb { betrieb?, name, ort, plz, strasse, tel, web, leistungen } eigenen Eintrag anlegen oder ändern → { ok, betrieb }
   Zugang: ein unterschriebenes Token (sitzung.js, Zweck vzugang, 180 Tage wie die Aufbewahrung) mit Anfrage, Betrieb und Adresse; gespeichert
   wird in der Anfrage x.zugang = { zeit, mail, geoeffnet, konto } und x.freischaltung = { zeit, art: 'frei'|'bezahlt', cent, session }.
   Webhook (zahlung.js): zugangBezahlt(ctx, session) für eine Kasse mit metadata.art 'vermittlung', falls der Betrieb nicht zurückkehrt. */
import { ApiFehler, erlaubt, quelle, zufall } from './umgebung.js';
import { sitzungLesen, sitzungPflicht, tokenSignieren, tokenPruefen } from './sitzung.js';
import { postDienst, mailOk } from './post.js';
import { ablage } from './fotos.js';
import { stripe } from './stripe.js';
import { steuersatz, stripeKundeFuer, kassePruefen, mwst, attrappe as zahlungAttrappe, pruefe as zahlungPruefen, mitStripe } from '../auftrag/zahlung.js';
import { daten as kundenDaten } from '../auftrag/daten.js';
import { vermittlungDaten } from './vermittlung-daten.js';
import { registerFuer, registerMerken, zeileAus, STAENDE_BETRIEB, telNorm, webHost, mailHost } from './vermittlung-register.js';
import { eckZeilen, erreichText, freigeschaltetMail } from './vermittlung-mails.js';
import { betriebId, LEISTUNGEN } from './vermittlung-suche.js';
import { PARTNER_STAND } from './recht.js';

export const PREIS_NETTO = 29;
export const PREIS_CENT = PREIS_NETTO * 100;
export const ZUGANG_TAGE = 180;
const TAG = 864e5, MIN = 60000;
const ZEIT = () => new Date().toISOString();
const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const maskMail = (m) => { const [a, b] = String(m || '').split('@'); return a && b ? a.slice(0, 2) + '•••@' + b : ''; };
const verlauf = (z, von, text) => { (z.verlauf = z.verlauf || []).push({ zeit: ZEIT(), von: von, text: text }); if (z.verlauf.length > 200) z.verlauf = z.verlauf.slice(-200); };

/* Preis für die App und den Bereich: netto, brutto nach MWST */
export const preisInfo = (ctx) => ({ netto: PREIS_NETTO, mwst: mwst(ctx), brutto: mwst(ctx) ? Math.round(PREIS_NETTO * 119) / 100 : PREIS_NETTO, text: PREIS_NETTO + ' € ' + (mwst(ctx) ? 'zzgl. USt' : 'ohne USt') });
export const zugangToken = (k, v, x, mail) => tokenSignieren(k, 'vzugang', { v: v.id, b: x.id, m: mail }, ZUGANG_TAGE * 86400);
export const zugangLink = (origin, token) => origin + '/konto/#zugang/' + token;

/* ---------- Sichten ---------- */
/* Vorschau einer Anfrage für den Betrieb x: ohne Namen und Kontakt, mit Echtheitsprofil; freigeschaltet mit Kunde und Aufmaßblatt */
export function vorschau(v, x, o) {
  const k = v.kunde || {}, e = v.eckdaten || {}, f = x.freischaltung || null, z = x.zugang || {};
  const out = {
    id: v.id, nr: v.nr, betrieb: { id: x.id, name: x.name, ort: x.ort || '' }, eingang: v.created_at, plz: v.plz, ort: (v.plz + ' ' + (k.ort || '')).trim(),
    eckdaten: e, eckZeilen: eckZeilen(e), echtheit: { nummer: !!v.bestaetigt, einwilligung: !!(v.einwilligung || {}).zeit, fenster: e.fenster || 0, elemente: e.elemente || 0, anBetriebe: (v.betriebe || []).filter((y) => y.gesendet || y.zugang).length, gewaehlt: !!x.gewaehlt },
    zugang: z.zeit || (x.gesendet ? x.gesendet.zeit : ''), geoeffnet: z.geoeffnet || '', loeschenAm: new Date(Date.parse(v.created_at) + ZUGANG_TAGE * TAG).toISOString(),
    frei: f ? { zeit: f.zeit, art: f.art, cent: f.cent || 0 } : null, stand: f ? 'frei' : 'vorschau'
  };
  if (f || (o && o.voll)) Object.assign(out, { kunde: { name: k.name || '', tel: k.tel || '', anzeige: k.anzeige || k.tel || '', mail: k.mail || '', erreich: erreichText(k.erreich), ort: (v.plz + ' ' + (k.ort || '')).trim() }, pdf: !!(v.pdf && v.pdf.pfad), einwilligung: (v.einwilligung || {}).text || '' });
  return out;
}
/* Register-Eintrag, wie der Betrieb ihn sieht */
export const registerSicht = (r) => ({ id: r.id, name: r.name, ort: r.ort, konten: (r.konto ? 1 : 0) + (r.konten || []).length, plz: r.plz || '', strasse: r.strasse || '', tel: r.tel || '', web: r.web || '', leistungen: r.leistungen || [], stand: r.stand, standText: STAENDE_BETRIEB[r.stand] || r.stand,
  partner: { bereit: !!(r.partner && r.partner.bereit), seit: (r.partner || {}).seit || '', fassung: (r.partner || {}).fassung || '' }, zaehler: r.zaehler || {}, quelle: r.quelle || '' });

/* ---------- Helfer ---------- */
function vd(ctx) { const d = vermittlungDaten(ctx.k); if (!d) throw new ApiFehler('Die Vermittlung ist hier noch nicht eingerichtet.', 503); return d; }
async function kundeVon(ctx) { const s = await sitzungPflicht(ctx, 'kunde'); const kd = kundenDaten(ctx.k); const k = kd ? await kd.kundeHolen(s.sub) : null; if (!k) throw new ApiFehler('Bitte neu anmelden.', 401, { anmelden: true }); return k; }
async function tokenDaten(ctx) {
  const t = String(ctx.params.token || ''); if (!/^[A-Za-z0-9_.-]{20,600}$/.test(t)) throw new ApiFehler('Dieser Link ist ungültig.', 400);
  if (!erlaubt('vzugang:' + quelle(ctx.request), 60, 10 * MIN)) throw new ApiFehler('Zu viele Aufrufe. Bitte gleich noch einmal.', 429);
  const p = await tokenPruefen(ctx.k, 'vzugang', t);
  if (!p || !p.v || !p.b) throw new ApiFehler('Dieser Link ist abgelaufen oder ungültig. Bitte wenden Sie sich an eeziframes.', 410);
  const d = vd(ctx), v = await d.holen(p.v); if (!v) throw new ApiFehler('Diese Anfrage gibt es nicht mehr (gelöscht nach ' + ZUGANG_TAGE + ' Tagen).', 410);
  const x = (v.betriebe || []).find((y) => y.id === p.b); if (!x || !(x.zugang || x.gesendet)) throw new ApiFehler('Zu diesem Link gibt es keinen Zugang mehr.', 410);
  return { d: d, v: v, x: x, mail: String(p.m || (x.zugang || {}).mail || x.mail || '').toLowerCase() };
}
/* Betriebe des Kontos im Register und die Anfrage mit dem Betrieb, der zu diesem Konto gehört */
async function betriebeDesKontos(d, kunde) { return (await d.betriebeNachKonto(kunde.id)).filter(Boolean); }
function eigenerBetrieb(v, kunde, rows) {
  const ids = new Set(); rows.forEach((r) => { ids.add(r.id); (r.aliase || []).forEach((a) => ids.add(a)); });
  return (v.betriebe || []).find((x) => (x.zugang && x.zugang.konto === kunde.id) || ((x.zugang || x.gesendet) && (ids.has(x.register || '') || ids.has(x.id)))) || null;
}
async function eigeneAnfrage(ctx, d, kunde) {
  const v = await d.holen(String(ctx.params.id || '')); if (!v) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
  const rows = await betriebeDesKontos(d, kunde), x = eigenerBetrieb(v, kunde, rows);
  if (!x) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
  return { v: v, x: x, rows: rows };
}
/* Das erste Aufmaß ist kostenlos: solange kein Betrieb des Kontos eines freigeschaltet hat */
/* Das erste Aufmaß ist je Betrieb kostenlos, nicht je E-Mail-Adresse oder Konto (Wunsch des Inhabers, 30.10.2026: Mitarbeiter desselben
   Betriebs nennen verschiedene Adressen). Geprüft wird deshalb auf mehreren Ebenen, und jede Ebene zählt: (1) der Betrieb der Anfrage
   (Register-Eintrag samt Aliasen), (2) alle Betriebe, die mit dem Konto verbunden sind (konto und konten), (3) Betriebe mit derselben
   Telefonnummer oder Website wie einer davon, (4) der Betrieb, dessen Website zur Domain der E-Mail-Adresse passt (nicht bei Freemail),
   (5) Betriebe, an deren Adresse schon ein Zugang ging. Hat einer dieser Einträge ein freigeschaltetes Aufmaß, kostet das nächste. */
const erstesFrei = (rows) => !rows.some((r) => ((r.zaehler || {}).frei || 0) + ((r.zaehler || {}).bezahlt || 0) > 0);
async function rundum(d, o) {
  const rows = [], da = new Set();
  const nimm = (r) => { if (r && !da.has(r.id)) { da.add(r.id); rows.push(r); } };
  (o.rows || []).forEach(nimm);
  if (o.bid) nimm(await d.betriebHolen(o.bid));
  const mail = String(o.mail || '').toLowerCase();
  if (mail) (await d.betriebeNachMail(mail)).forEach(nimm);
  const host = mailHost(mail); if (host) nimm(await d.betriebNachKontakt('', host));
  for (const r of rows.slice()) { if (r.tel_norm || r.web_host) nimm(await d.betriebNachKontakt(r.tel_norm || '', r.web_host || '')); }
  return rows;
}
export async function erstesFreiFuer(d, mail, bid) { return erstesFrei(await rundum(d, { mail: mail, bid: bid })); }

/* Freischalten festhalten (kostenlos oder bezahlt), Register nachführen, Kunden auf Wunsch per Mail sagen, wer sein Aufmaß hat */
async function freischalten(ctx, d, v, x, art, zahlung) {
  const zeit = ZEIT();
  const z = await d.aendern(v.id, (z) => {
    const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false;
    if (y.freischaltung) return false;
    y.freischaltung = Object.assign({ zeit: zeit, art: art, cent: art === 'bezahlt' ? PREIS_CENT : 0 }, zahlung || {});
    if (!y.status || y.status === 'offen' || y.status === 'nicht_erreicht') { y.status = 'will'; y.status_zeit = zeit; }
    verlauf(z, 'betrieb', y.name + ' hat das Aufmaß freigeschaltet (' + (art === 'frei' ? 'kostenlos, erstes Aufmaß' : (PREIS_CENT / 100) + ' € netto bezahlt') + ')');
    if (['neu', 'in_arbeit', 'kein_betrieb'].indexOf(z.stand) >= 0) z.stand = 'vermittelt';
  });
  if (z === false) { const v2 = await d.holen(v.id); return { v: v2, x: (v2.betriebe || []).find((w) => w.id === x.id) || x }; }
  const y = (z.betriebe || []).find((w) => w.id === x.id);
  await registerMerken(d, z, y, 'Aufmaß freigeschaltet, ' + (art === 'frei' ? 'kostenlos' : 'bezahlt'));
  const post = postDienst(ctx.k), kundeMailAdr = (z.kunde || {}).mail;
  if (post && kundeMailAdr) { const m = freigeschaltetMail(z, y); ctx.waitUntil(post.senden({ an: kundeMailAdr, betreff: m.betreff, html: m.html, antwortAn: post.kontakt, idempotenz: 'vermittlung-frei-' + z.id + '-' + y.id }).catch(() => false)); }
  if (ctx.zaehlen) ctx.zaehlen(art === 'frei' ? 'ereignis:vermittlung_frei' : 'ereignis:vermittlung_bezahlt');
  return { v: z, x: y };
}

/* Kasse bei Stripe für ein Aufmaß: Karte (SEPA wäre tagelang unterwegs, das Aufmaß soll sofort offen sein), Rechnung von Stripe,
   Steuersatz wie bei den Paketen (netto zzgl. 19 %), Metadaten art 'vermittlung' */
async function kasse(ctx, kunde, v, x, row) {
  zahlungPruefen(ctx.k);
  const zurueck = ctx.url.origin + '/konto/?kasse={SESSION}#anfrage/' + v.id, abbruch = ctx.url.origin + '/konto/#anfrage/' + v.id;
  if (zahlungAttrappe(ctx.k)) { const id = 'test_' + zufall(10); return { id: id, url: zurueck.replace('{SESSION}', id) }; }
  const s = stripe(ctx.k), [kid, steuer] = await Promise.all([stripeKundeFuer(ctx, s, kunde, { name: row.name, strasse: row.strasse, plz: row.plz, ort: row.ort }), steuersatz(ctx, s)]);
  if (kid && kid !== kunde.stripe) { const kd = kundenDaten(ctx.k); if (kd) await kd.kundeAendern(kunde.id, { stripe: kid }).catch(() => null); }
  const posten = { quantity: 1, price_data: { currency: 'eur', unit_amount: PREIS_CENT, product_data: { name: 'Vermitteltes Aufmaß ' + v.nr, description: 'Anfrage eines Hauseigentümers aus ' + v.plz + ' ' + ((v.kunde || {}).ort || '') + ': Kontakt und Aufmaßblatt (Partnerbedingungen ' + PARTNER_STAND + ')' } } };
  if (steuer) posten.tax_rates = [steuer];
  const sess = await s.post('/checkout/sessions', {
    mode: 'payment', locale: 'de', customer: kid, line_items: [posten], payment_method_types: ['card'],
    payment_intent_data: { metadata: { art: 'vermittlung', vermittlung: v.id, betrieb: x.id, nr: v.nr } },
    invoice_creation: { enabled: true, invoice_data: { description: 'Vermitteltes Aufmaß ' + v.nr + ' · eeziframes', metadata: { art: 'vermittlung', vermittlung: v.id, betrieb: x.id } } },
    customer_update: { address: 'auto', name: 'auto' }, success_url: zurueck.replace('{SESSION}', '{CHECKOUT_SESSION_ID}'), cancel_url: abbruch,
    metadata: { art: 'vermittlung', vermittlung: v.id, betrieb: x.id, register: row.id, nr: v.nr, fassung: PARTNER_STAND, kunde: kunde.id }, client_reference_id: v.id + ':' + x.id
  }, { idem: 'vermittlung-kasse-' + v.id + '-' + x.id + '-' + Math.floor(Date.now() / (30 * MIN)) });
  return { id: sess.id, url: sess.url };
}
/* Webhook: eine bezahlte Kasse der Vermittlung festhalten, falls der Betrieb nicht zurückgekehrt ist */
export async function zugangBezahlt(ctx, obj) {
  const md = (obj && obj.metadata) || {}; if (md.art !== 'vermittlung' || !md.vermittlung || !md.betrieb || obj.payment_status !== 'paid') return false;
  const d = vermittlungDaten(ctx.k); if (!d) return false;
  const v = await d.holen(md.vermittlung); if (!v) return false;
  const x = (v.betriebe || []).find((y) => y.id === md.betrieb); if (!x || x.freischaltung) return false;
  await freischalten(ctx, d, v, x, 'bezahlt', { session: obj.id, cent: obj.amount_total || PREIS_CENT, intent: typeof obj.payment_intent === 'string' ? obj.payment_intent : '' });
  return true;
}

/* ---------- Routen ---------- */
const kassenStand = (ctx) => !!(mitStripe(ctx.k) || zahlungAttrappe(ctx.k));
const antwortListe = async (ctx, d, kunde) => {
  const rows = await betriebeDesKontos(d, kunde), ids = new Set(); const liste = [], ebenen = await rundum(d, { rows: rows, mail: kunde.mail });
  rows.forEach((r) => (r.anfragen || []).forEach((a) => { if (a.zugang) ids.add(a.id); }));
  for (const id of ids) { const v = await d.holen(id); if (!v) continue; const x = eigenerBetrieb(v, kunde, rows); if (x) liste.push(vorschau(v, x)); }
  liste.sort((a, b) => (a.eingang < b.eingang ? 1 : -1));
  return { ok: true, betriebe: rows.map(registerSicht), anfragen: liste, preis: preisInfo(ctx), fassung: PARTNER_STAND, kasse: kassenStand(ctx), erstesFrei: erstesFrei(ebenen) };
};
export const PARTNER = {
  'GET /api/anfrage/:token': async (ctx) => {
    const { d, v, x, mail } = await tokenDaten(ctx);
    const s = await sitzungLesen(ctx, 'kunde'), passt = !!(s && String(s.mail || '').toLowerCase() === mail);
    return { ok: true, vorschau: vorschau(v, x), mail: maskMail(mail), mailVoll: passt ? mail : '', angemeldet: !!s, passt: passt, preis: preisInfo(ctx), fassung: PARTNER_STAND, erstesFrei: await erstesFreiFuer(d, mail, x.register || x.id) };
  },
  'POST /api/anfrage/:token/annehmen': async (ctx) => {
    const { d, v, x, mail } = await tokenDaten(ctx), kunde = await kundeVon(ctx);
    if (String(kunde.mail || '').toLowerCase() !== mail) throw new ApiFehler('Bitte melden Sie sich mit der E-Mail-Adresse an, an die wir den Zugang geschickt haben (' + maskMail(mail) + ').', 403, { mail: maskMail(mail) });
    const r = await registerFuer(d, x, x.quelle);
    /* Der Zugang ging von der Zentrale an genau diese Adresse (am Telefon geklärt): ein weiteres Konto desselben Betriebs wird hinzugefügt,
       etwa ein zweiter Mitarbeiter; alle Konten teilen sich das eine kostenlose Aufmaß des Betriebs */
    if (!r.konto) await d.betriebAendern(r.id, (z) => { z.konto = kunde.id; if (!z.mail) z.mail = mail; if (z.stand === 'neu') z.stand = 'kontakt'; verlauf(z, 'betrieb', 'Konto verbunden (' + mail + ')'); });
    else if (r.konto !== kunde.id && !(r.konten || []).includes(kunde.id)) await d.betriebAendern(r.id, (z) => { z.konten = (z.konten || []).concat([kunde.id]).slice(0, 20); if (z.stand === 'neu') z.stand = 'kontakt'; verlauf(z, 'betrieb', 'Weiteres Konto verbunden (' + mail + ')'); });
    const z = await d.aendern(v.id, (z) => { const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false; y.zugang = Object.assign({ zeit: (y.gesendet || {}).zeit || ZEIT(), mail: mail }, y.zugang || {}, { konto: kunde.id, geoeffnet: (y.zugang || {}).geoeffnet || ZEIT() }); if (!(y.zugang || {}).geoeffnet_gemerkt) { verlauf(z, 'betrieb', y.name + ' hat den Zugang geöffnet'); y.zugang.geoeffnet_gemerkt = true; } });
    const y = (z.betriebe || []).find((w) => w.id === x.id);
    await registerMerken(d, z, y, 'Zugang geöffnet');
    return { ok: true, id: v.id, betrieb: x.id };
  },
  'GET /api/konto/anfragen': async (ctx) => { const kunde = await kundeVon(ctx); return antwortListe(ctx, vd(ctx), kunde); },
  'GET /api/konto/anfragen/:id': async (ctx) => {
    const kunde = await kundeVon(ctx), d = vd(ctx), { v, x, rows } = await eigeneAnfrage(ctx, d, kunde);
    return { ok: true, anfrage: vorschau(v, x), preis: preisInfo(ctx), fassung: PARTNER_STAND, kasse: kassenStand(ctx), erstesFrei: erstesFrei(await rundum(d, { rows: rows, bid: x.register || x.id, mail: kunde.mail })) };
  },
  'GET /api/konto/anfragen/:id/pdf': async (ctx) => {
    const kunde = await kundeVon(ctx), d = vd(ctx), { v, x } = await eigeneAnfrage(ctx, d, kunde);
    if (!x.freischaltung) throw new ApiFehler('Bitte schalten Sie das Aufmaß zuerst frei.', 402);
    const ab = ablage(ctx.k, 'vermittlung'), bytes = v.pdf && v.pdf.pfad && ab ? await ab.holen(v.pdf.pfad) : null;
    if (!bytes) throw new ApiFehler('Das Aufmaßblatt gibt es nicht mehr.', 404);
    return new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': (ctx.url.searchParams.get('laden') === '1' ? 'attachment' : 'inline') + '; filename="Aufmassblatt-' + v.nr + '.pdf"', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'x-robots-tag': 'noindex' } });
  },
  'POST /api/konto/anfragen/:id/freischalten': async (ctx) => {
    const kunde = await kundeVon(ctx), d = vd(ctx), { v, x, rows } = await eigeneAnfrage(ctx, d, kunde), b = ctx.body || {};
    if (x.freischaltung) return { ok: true, frei: true, anfrage: vorschau(v, x), schon: true };
    if (b.zustimmung !== true) throw new ApiFehler('Bitte bestätigen Sie die Partnerbedingungen.', 400, { feld: 'zustimmung' });
    if (!(v.pdf && v.pdf.pfad)) throw new ApiFehler('Das Aufmaßblatt dieser Anfrage gibt es nicht mehr.', 410);
    const row = rows.find((r) => r.id === x.id || (r.aliase || []).includes(x.id)) || rows[0] || (await registerFuer(d, x, x.quelle));
    if (erstesFrei(await rundum(d, { rows: rows, bid: x.register || x.id, mail: kunde.mail }))) { const r = await freischalten(ctx, d, v, x, 'frei', { fassung: PARTNER_STAND }); return { ok: true, frei: true, anfrage: vorschau(r.v, r.x) }; }
    const k = await kasse(ctx, kunde, v, x, row);
    await d.aendern(v.id, (z) => { const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false; y.kasse = { session: k.id, zeit: ZEIT(), fassung: PARTNER_STAND }; });
    return { ok: true, kasse: k.url, session: k.id };
  },
  'GET /api/konto/anfragen/:id/kasse': async (ctx) => {
    const kunde = await kundeVon(ctx), d = vd(ctx), { v, x } = await eigeneAnfrage(ctx, d, kunde), session = String(ctx.url.searchParams.get('session') || '');
    if (x.freischaltung) return { ok: true, bezahlt: true, anfrage: vorschau(v, x) };
    if (!session || !(x.kasse && x.kasse.session === session)) throw new ApiFehler('Diese Kasse gehört nicht zu dieser Anfrage.', 400);
    const z = await kassePruefen(ctx, session);
    if (!z.bezahlt) return { ok: true, bezahlt: false, anfrage: vorschau(v, x) };
    const r = await freischalten(ctx, d, v, x, 'bezahlt', { session: session, cent: z.betragCent || PREIS_CENT, intent: z.intent || '' });
    return { ok: true, bezahlt: true, anfrage: vorschau(r.v, r.x) };
  },
  /* Bereitschaft erklären (Partner: Platz 1 und 2 bei Kunden in der Umgebung, Partnerbedingungen) oder zurücknehmen */
  'POST /api/konto/partner': async (ctx) => {
    const kunde = await kundeVon(ctx), d = vd(ctx), b = ctx.body || {}, rows = await betriebeDesKontos(d, kunde);
    const r = rows.find((x) => x.id === String(b.betrieb || '')) || rows[0]; if (!r) throw new ApiFehler('Bitte tragen Sie zuerst Ihren Betrieb ein.', 404);
    const bereit = b.bereit === true;
    if (bereit && b.zustimmung !== true) throw new ApiFehler('Bitte bestätigen Sie die Partnerbedingungen.', 400, { feld: 'zustimmung' });
    if (bereit && !r.plz && !r.ort) throw new ApiFehler('Bitte tragen Sie Postleitzahl und Ort Ihres Betriebs ein, damit Kunden in Ihrer Umgebung Sie finden.', 400, { feld: 'plz' });
    const z = await d.betriebAendern(r.id, (z) => {
      z.partner = bereit ? { bereit: true, seit: (z.partner || {}).seit || ZEIT(), fassung: PARTNER_STAND, zeit: ZEIT(), netz: '' } : Object.assign({}, z.partner || {}, { bereit: false, bis: ZEIT() });
      if (bereit) z.stand = 'partner'; else if (z.stand === 'partner') z.stand = 'pausiert';
      verlauf(z, 'betrieb', bereit ? 'Bereitschaft erklärt (Partnerbedingungen ' + PARTNER_STAND + ')' : 'Bereitschaft zurückgenommen');
    });
    return { ok: true, betrieb: registerSicht(z) };
  },
  /* Eigenen Betrieb eintragen (Register, ohne Anfrage) oder die eigenen Angaben ändern */
  'POST /api/konto/betrieb': async (ctx) => {
    const kunde = await kundeVon(ctx), d = vd(ctx), b = ctx.body || {}, f = {};
    const name = kurz(b.name, 80), ort = kurz(b.ort, 60), plz = kurz(b.plz, 5), strasse = kurz(b.strasse, 80), tel = kurz(b.tel, 40), web = kurz(b.web, 200);
    const leistungen = (Array.isArray(b.leistungen) ? b.leistungen : []).map((x) => kurz(x, 30)).filter((x) => LEISTUNGEN.includes(x)).slice(0, 10);
    if (name.length < 2) f.name = 'Bitte den Namen des Betriebs eintragen.';
    if (plz && !/^\d{5}$/.test(plz)) f.plz = 'Bitte eine fünfstellige Postleitzahl.';
    if (!ort && !plz) f.ort = 'Bitte Ort oder Postleitzahl eintragen.';
    if (web && !webHost(web)) f.web = 'Bitte eine Website wie www.betrieb.de eintragen.';
    if (Object.keys(f).length) throw new ApiFehler(Object.values(f)[0], 400, { felder: f, feld: Object.keys(f)[0] });
    const rows = await betriebeDesKontos(d, kunde), eigener = rows.find((x) => x.id === String(b.betrieb || '')) || (b.betrieb ? null : rows[0]);
    if (b.betrieb && !eigener) throw new ApiFehler('Diesen Betrieb gibt es in Ihrem Konto nicht.', 404);
    const felder = { name: name, ort: ort, plz: plz, strasse: strasse, tel: tel, web: web, tel_norm: telNorm(tel), web_host: webHost(web), leistungen: leistungen };
    let z;
    if (eigener) z = await d.betriebAendern(eigener.id, (z) => { Object.assign(z, felder); verlauf(z, 'betrieb', 'Angaben geändert'); });
    else {
      /* gibt es den Betrieb schon (aus Anfragen, Kennung, Nummer oder Website), wird der Eintrag mit dem Konto verbunden statt doppelt angelegt */
      const id = await betriebId(name, ort || plz), da = (await d.betriebHolen(id)) || (await d.betriebNachKontakt(telNorm(tel), webHost(web)));
      if (da && da.konto && da.konto !== kunde.id && !(da.konten || []).includes(kunde.id)) throw new ApiFehler('Dieser Betrieb ist schon mit einem anderen Konto verbunden. Lassen Sie sich von eeziframes einen Zugang an Ihre Adresse schicken; damit wird Ihr Konto dem Betrieb hinzugefügt.', 409);
      if (da) z = await d.betriebAendern(da.id, (z) => { Object.assign(z, felder, { konto: kunde.id, mail: kunde.mail }); if (z.stand === 'neu') z.stand = 'kontakt'; verlauf(z, 'betrieb', 'Konto verbunden und Angaben ergänzt (' + kunde.mail + ')'); });
      else z = await d.betriebSetzen(Object.assign(zeileAus(Object.assign({ id: id }, felder), { quelle: 'register', stand: 'kontakt', konto: kunde.id, mail: kunde.mail }), { verlauf: [{ zeit: ZEIT(), von: 'betrieb', text: 'Eingetragen im Bereich für Fensterbauer (' + kunde.mail + ')' }] }));
    }
    return { ok: true, betrieb: registerSicht(z) };
  }
};

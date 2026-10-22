/* eeziframes · Zentrale: Bestellungen der Konfigurator-Pakete, Rückrufe, Nachrichten der Partner, Aufgabenliste (Strang C, Bauplan §3 C.1,
   C.2, C.5, C.6; entwurf-bestellung §7). Der nächste Schritt ist der Hauptknopf: Einrichtung beginnen → Instanz anlegen → Domain verbinden
   → Domain gesichert → Gestaltung veröffentlichen → Vorschau senden → Live schalten; darunter steht, was fehlt (Ampel aus
   zentrale-instanzen.js). Statuswechsel, Abo, Paketwechsel und Erstattung laufen nur über functions/api/bestellung.js (Strang D),
   die Instanz nur über functions/instanz/verwalten.js (Strang A). Zugang wie die übrige Zentrale.

   Routen:
     GET  /api/zentrale/aufgaben                      Aufgabenliste (Übersicht, Zahl in der Navigation)
     GET  /api/zentrale/bestellungen?filter=          Liste mit Zählern je Filter, Rückrufe (heute und überfällig zuerst), ungelesene Nachrichten
     GET  /api/zentrale/bestellungen/:id              Bestellung mit Partner, Nachrichten, Verlauf, Instanz, nächstem Schritt und Ampel
     POST /api/zentrale/bestellungen/:id/status       { nach, text, erstatten }   Einrichtung beginnen, Domain gesichert, Rücksprung, Storno
     POST /api/zentrale/bestellungen/:id/instanz      Instanz aus der Bestellung anlegen (idempotent), Bestätigungsmails an die Empfänger
     POST /api/zentrale/bestellungen/:id/vorschau     Vorschau-Link (30 Tage) an den Partner, Status „Zur Freigabe“
     POST /api/zentrale/bestellungen/:id/live         { vermerk }   nur mit grüner Ampel: Abo, Instanz aktiv, Mail mit Schnipsel
     POST /api/zentrale/bestellungen/:id/abo          { aktion, tage, text }   kuendigen | zuruecknehmen | beenden | aussetzen | fortsetzen | kulanz | neu
     POST /api/zentrale/bestellungen/:id/paket        { paket, differenz }
     POST /api/zentrale/bestellungen/:id/erstatten    { cent, grund, code }
     POST /api/zentrale/bestellungen/:id/nachricht    { text }   Nachricht an den Partner (mit Mail)
     POST /api/zentrale/bestellungen/:id/domains/frei { host? }   Wunsch-Domains (oder eine weitere) „wahrscheinlich frei“?
     POST /api/zentrale/bestellungen/:id/notiz        { text }   interne Notiz
     POST /api/zentrale/bestellungen/:id/gelesen      Nachrichten des Partners als gelesen markieren
     GET  /api/zentrale/bestellungen/:id/datei/:did   Upload der Bestellung (wie im Kundenkonto: Bilder inline, SVG und PDF als Download)
     POST /api/zentrale/rueckrufe/:nid                { notiz }   Rückruf erledigt
   Export für die Übersicht (zentrale.js): aufgabenListe(ctx), paketeKennzahlen(ctx) */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import { ApiFehler, jetztAus } from './umgebung.js';
import { esc } from './post.js';
import { zugang, daten, protokoll } from './zentrale.js';
import * as V from '../instanz/verwalten.js';
import { uebergang, aboSteuern, paketWechseln, erstatten, dateiAntwort, paketVon, partnerMail, herkunft } from './bestellung.js';
import { instanzSicht, ampel, schrittVon, mitCode, merkmaleVon, jeEintrag } from './zentrale-instanzen.js';
import { tagBerlin } from './statistik.js';
import { domainFrei } from './cloudflare.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const RB = () => globalThis.Instanzregeln.bestellung;
const TAG = 864e5;
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n || 200);
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const knopf = (href, t) => '<p style="margin:20px 0"><a href="' + esc(href) + '" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#161616;color:#ffffff;font-weight:700;text-decoration:none">' + esc(t) + '</a></p>';
const jetztIso = (ctx) => new Date(jetztAus(ctx.env)).toISOString();
const stripeLink = (k, art, id) => (k.stripe && id ? 'https://dashboard.stripe.com/' + (k.stripe.test ? 'test/' : '') + art + '/' + encodeURIComponent(id) : '');

/* Je Bestellung nacheinander (Doppelklick auf „Instanz anlegen“ legt nur eine an) */
const ketten = new Map();
function nacheinander(schl, fn) {
  const vorher = ketten.get(schl) || Promise.resolve(), lauf = vorher.then(() => fn()), ende = lauf.then(() => null, () => null);
  ketten.set(schl, ende); ende.then(() => { if (ketten.get(schl) === ende) ketten.delete(schl); });
  return lauf;
}
async function holen(ctx, id) {
  const b = await daten(ctx).bestellungHolen(String(id || ''));
  if (b === undefined) throw new ApiFehler('Die Datenbank kennt die Bestellungen noch nicht (supabase/schema.sql erneut ausführen).', 503);
  if (!b) throw new ApiFehler('Diese Bestellung gibt es nicht.', 404);
  return b;
}
const prot = (ctx, b, text, extra) => protokoll(ctx.sp, 'bestellung', null, text, Object.assign({ bestellung: b.id, nr: b.nr, partner: b.partner }, extra || {}));

/* ---------- Instanz aus der Bestellung (Bauplan C.2, Vertrag „Stand nach Welle 1“) ---------- */
const UML = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
const slugAus = (s) => String(s || '').toLowerCase().replace(/[äöüß]/g, (c) => UML[c]).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 34).replace(/-+$/, '');
async function instanzAusBestellung(ctx, id, o) {
  o = o || {};
  return nacheinander('i:' + id, async () => {
    const sp = ctx.sp, b = await holen(ctx, id);
    if (b.instanz) { const i0 = await sp.instanzHolen(b.instanz); if (i0) return { schon: true, instanz: i0, einladungen: [] }; }
    if (!['einrichtung', 'domain', 'freigabe'].includes(b.status)) throw new ApiFehler('Die Instanz entsteht mit „Einrichtung beginnen“ (Status ' + (RB().TITEL[b.status] || b.status) + ').', 409);
    const p = await sp.partnerHolen(b.partner); if (!p) throw new ApiFehler('Den Partner dieser Bestellung gibt es nicht mehr.', 409);
    const pd = p.daten || {}, w = b.wunsch || {}, k = w.konfigurator || {}, g = w.gestaltung || {}, f = Object.assign({}, pd, w.firma || {});
    const paket = paketVon(b), m = P().merkmale(paket), name = str(k.name || p.firma, 80);
    const recht = { firma: str(f.firma || p.firma, 120), rechtsform: str(f.rechtsform, 60), vertretung: str(f.vertretung, 200), strasse: str(f.strasse, 120), plz: str(f.plz || p.plz, 10), ort: str(f.ort, 80), land: 'DE',
      tel: str(f.tel, 40), mail: String(p.mail || '').toLowerCase(), register: str(f.register, 160), ust: str(f.ust, 14), kammer: str(f.kammer, 160), beruf: str(f.beruf, 160), bundesland: R().BUNDESLAENDER[f.bundesland] ? f.bundesland : '', stand: tagBerlin(), quelle: 'bestellung' };
    const farbe = m.farbe && /^#[0-9a-f]{6}$/i.test(String((g.farben || [])[0] || '')) ? String(g.farben[0]).toLowerCase() : '';
    const entwurf = { name: name, titel: m.startansicht ? str(g.titel, R().GRENZEN.titel) : '', beschreibung: '', farbe: farbe, start: { kicker: '', ueberschrift: m.startansicht ? str(g.titel, 120) : '', text: '' }, bilder: {} };
    const betriebDaten = { ap: str(pd.ap, 80), tel: str(pd.tel, 40), mail: String((k.eingang || [])[0] || p.mail || '').toLowerCase(),
      einladung: { ansprechpartner: str(pd.ap, 80), telefon: str(pd.tel, 40), telefonZeigen: true, mail: String((k.eingang || [])[0] || '').toLowerCase(), mailZeigen: false, web: pd.web || '', ort: str(pd.ort, 60), begruessung: m.startansicht ? String(g.begruessung || '').slice(0, 400) : '' } };
    let slug = slugAus(o.slug || name) || 'instanz'; if (slug.length < 3) slug = (slug + '-fenster').slice(0, 34);
    let i = null;
    for (let n = 1; n <= 20 && !i; n++) {
      const s = n === 1 ? slug : slug.slice(0, 34) + '-' + n;
      try { i = await V.instanzAnlegen(ctx, { slug: s, paket: paket, name: name, plz: recht.plz || null, partner: p.id, bestellung: b.id, eingang: k.eingang || [], zugang: m.dashboard ? (k.zugang || []).map((x) => ({ mail: x, name: '' })) : [], recht: recht, entwurf: entwurf, betriebDaten: betriebDaten }); }
      catch (e) { if (!(e instanceof ApiFehler && e.status === 409 && e.extra && e.extra.grund === 'slug_vergeben')) throw e; }
    }
    if (!i) throw new ApiFehler('Keine freie Kennung gefunden. Bitte eine eigene angeben.', 409);
    if (m.gestaltung !== 'eigen') await V.markeVeroeffentlichen(ctx, i.id); // Essential: der Name als Text, sofort veröffentlicht
    await sp.bestellungAendern(b.id, (z) => { z.instanz = i.id; (z.verlauf = z.verlauf || []).push({ zeit: jetztIso(ctx), von: 'inhaber', intern: true, text: 'Instanz ' + i.slug + ' angelegt; Bestätigungslinks an ' + (i.einladungen || []).length + ' Adressen' }); });
    await prot(ctx, b, 'Instanz ' + i.slug + ' aus der Bestellung angelegt', { instanz: i.id });
    return { schon: false, instanz: await sp.instanzHolen(i.id), einladungen: i.einladungen || [] };
  });
}

/* ---------- Sicht ---------- */
const partnerKurz = (p) => (p ? { id: p.id, firma: p.firma, mail: p.mail, plz: p.plz || '', daten: p.daten || {}, stripe: p.stripe_customer || '', seit: p.created_at } : null);
const nachrichtSicht = (n) => ({ id: n.id, von: n.von, art: n.art, text: n.text, bestellung: n.bestellung || null, rueckruf: n.rueckruf || null, zeit: n.created_at, gelesen: !!n.gelesen_at });
/* Rückruf: erreichbar jetzt? (Erreichbarkeit des Partners, deutsche Zeit) */
const BERLIN = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
function jetztErreichbar(e, t) {
  if (!e || !Array.isArray(e.tage) || !e.tage.length) return null;
  const p = {}; BERLIN.formatToParts(new Date(t)).forEach((x) => { p[x.type] = x.value; });
  const tag = { Mon: 'mo', Tue: 'di', Wed: 'mi', Thu: 'do', Fri: 'fr', Sat: 'sa', Sun: 'so' }[p.weekday], uhr = p.hour + ':' + p.minute;
  return e.tage.includes(tag) && uhr >= (e.von || '00:00') && uhr < (e.bis || '24:00');
}
async function bestellungSicht(ctx, b) {
  const sp = ctx.sp, [p, i, nachrichten] = await Promise.all([sp.partnerHolen(b.partner).catch(() => null), b.instanz ? sp.instanzHolen(b.instanz).catch(() => null) : null, sp.nachrichtenVon(b.partner, { anzahl: 200 }).catch(() => [])]);
  const hosts = i ? (await sp.hostsVon(i.id)) || [] : [], a = i ? await ampel(ctx, i, b, hosts) : null;
  const za = b.zahlung || {}, ab = b.abo || {};
  return {
    id: b.id, nr: b.nr, status: b.status, statusTitel: RB().TITEL[b.status] || b.status, abo_status: b.abo_status, aboTitel: RB().ABO_TITEL[b.abo_status] || '', paket: i ? i.paket : paketVon(b), paket_bestellt: b.paket_bestellt,
    preise: b.preise || {}, wunsch: b.wunsch || {}, dateien: (b.dateien || []).map((d) => ({ id: d.id, art: d.art, name: d.name, typ: d.typ, bytes: d.bytes, zeit: d.zeit })),
    zahlung: { status: za.status || '', betrag_cent: za.betrag_cent || 0, erstattet_cent: za.erstattet_cent || 0, zeit: za.zeit || '', zahlungsmittel: !!za.pm, rechnung: za.rechnung || '', link: stripeLink(ctx.k, 'payments', za.pi) },
    abo: { laeuft: !!ab.id, paket: ab.paket || '', monat: ab.monat || 0, seit: ab.seit || '', bis: ab.bis || '', kulanz_bis: ab.kulanz_bis || '', ende: ab.ende || '', kuendigt: !!ab.kuendigt, offeneRechnung: ab.offeneRechnung || '', grund: ab.grund || '', link: stripeLink(ctx.k, 'subscriptions', ab.id) },
    vorschau: b.vorschau || {}, zustimmung: b.zustimmung || {}, verlauf: (b.verlauf || []).slice().reverse().slice(0, 100), notiz: b.notiz || '',
    created_at: b.created_at, updated_at: b.updated_at, bezahlt_am: b.bezahlt_am, live_am: b.live_am, pause_seit: b.pause_seit, ende_am: b.ende_am,
    partner: partnerKurz(p), kundeLink: p && p.stripe_customer ? stripeLink(ctx.k, 'customers', p.stripe_customer) : '', erreichbar: p ? jetztErreichbar((p.daten || {}).erreichbar, jetztAus(ctx.env)) : null,
    nachrichten: (nachrichten || []).map(nachrichtSicht), ungelesen: (nachrichten || []).filter((n) => n.von === 'partner' && !n.gelesen_at && n.art !== 'rueckruf').length,
    instanz: i ? await instanzSicht(ctx, i, { ohneVersand: true, ohneKennzahlen: true }) : null,
    ampel: a, schritt: schrittVon(b, i, hosts, a), zweiFaktor: !!ctx.k.zentrale.totp
  };
}

/* ---------- Aufgabenliste (Übersicht) ---------- */
function rueckrufTag(n) { return (n.rueckruf && n.rueckruf.tag) || ''; }
export async function aufgabenListe(ctx) {
  const sp = ctx.sp; if (!sp || !sp.bestellungenListe) return { tabelle: false, anzahl: 0, liste: [] };
  const [alle, partner, rueckrufe] = await Promise.all([sp.bestellungenListe({}).catch(() => undefined), sp.partnerAlle().catch(() => undefined), sp.rueckrufeOffen ? sp.rueckrufeOffen().catch(() => []) : []]);
  if (alle === undefined) return { tabelle: false, anzahl: 0, liste: [] };
  const pm = new Map((partner || []).map((p) => [p.id, p])), firma = (id) => (pm.get(id) || {}).firma || 'Partner', jetzt = jetztAus(ctx.env), heute = tagBerlin(new Date(jetzt)), liste = [];
  /* Rückrufe heute und überfällig zuerst */
  (rueckrufe || []).filter((n) => rueckrufTag(n) && rueckrufTag(n) <= heute).forEach((n) => { const r = n.rueckruf || {}; liste.push({ art: rueckrufTag(n) < heute ? 'bad' : 'warn', gruppe: 'rueckruf', text: 'Rückruf ' + (rueckrufTag(n) < heute ? 'überfällig (' + r.tag.split('-').reverse().join('.') + ')' : 'heute') + ' ' + String(r.fenster || '').replace('-', '–') + ' Uhr: ' + firma(n.partner) + ', ' + (r.tel || '') + (r.thema ? ' · ' + r.thema : ''), ziel: n.bestellung ? 'bestellung/' + n.bestellung : 'bestellungen', nid: n.id }); });
  for (const b of alle) {
    const v = b.vorschau || {}, a = b.abo || {}, f = firma(b.partner), ziel = 'bestellung/' + b.id;
    if (b.status === 'bezahlt') liste.push({ art: 'aktion', gruppe: 'bestellung', text: 'Bezahlt: ' + f + ' (' + b.nr + '). Einrichtung beginnen.', ziel: ziel });
    else if (b.status === 'einrichtung' && !b.instanz) liste.push({ art: 'aktion', gruppe: 'bestellung', text: 'Instanz anlegen: ' + f + ' (' + b.nr + ').', ziel: ziel });
    else if (b.status === 'einrichtung') liste.push({ art: 'info', gruppe: 'bestellung', text: 'In Einrichtung: ' + f + ' (' + b.nr + '). Domain verbinden und prüfen.', ziel: ziel });
    else if (b.status === 'domain') liste.push({ art: 'info', gruppe: 'bestellung', text: 'Domain gesichert: ' + f + ' (' + b.nr + '). Gestalten und Vorschau senden.', ziel: ziel });
    else if (b.status === 'freigabe') {
      const frei = v.freigabe && v.freigabe.version === v.version, aend = v.aenderung && v.aenderung.version === v.version && !frei, tage = v.gesendet ? Math.floor((jetzt - Date.parse(v.gesendet)) / TAG) : 0;
      liste.push(frei ? { art: 'aktion', gruppe: 'bestellung', text: 'Freigabe erteilt: ' + f + ' (' + b.nr + '). Live schalten.', ziel: ziel } : aend ? { art: 'warn', gruppe: 'bestellung', text: 'Änderung gewünscht: ' + f + ' (' + b.nr + ').', ziel: ziel } : { art: tage >= 7 ? 'warn' : 'info', gruppe: 'bestellung', text: 'Wartet auf Freigabe: ' + f + ' (' + b.nr + ')' + (tage ? ', seit ' + tage + (tage === 1 ? ' Tag' : ' Tagen') : '') + '.', ziel: ziel });
    }
    if (b.abo_status === 'zahlung_offen') liste.push({ art: 'warn', gruppe: 'bestellung', text: 'Zahlung offen: ' + f + (a.kulanz_bis ? ' (Kulanz bis ' + new Date(a.kulanz_bis).toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }) + ')' : '') + '.', ziel: ziel });
    if (b.status === 'pausiert' && (b.abo_status === 'beendet' || !a.id)) liste.push({ art: 'warn', gruppe: 'bestellung', text: 'Pausiert ohne Abo: ' + f + ' (' + b.nr + '). Abo neu starten oder beenden.', ziel: ziel });
    (b.verlauf || []).filter((x) => x && x.art === 'hinweis' && !x.erledigt && Date.parse(x.zeit || '') > jetzt - 7 * TAG).slice(-2).forEach((x) => liste.push({ art: 'bad', gruppe: 'hinweis', text: f + ' (' + b.nr + '): ' + x.text, ziel: ziel }));
  }
  /* ungelesene Nachrichten der Partner */
  const neu = await jeEintrag((partner || []).slice(0, 200), async (p) => ((await sp.nachrichtenVon(p.id, { anzahl: 50 }).catch(() => [])) || []).filter((x) => x.von === 'partner' && !x.gelesen_at && x.art !== 'rueckruf'));
  for (const [j, p] of (partner || []).slice(0, 200).entries()) {
    const n = neu[j] || [];
    if (n.length) liste.push({ art: 'info', gruppe: 'nachricht', text: (n.length === 1 ? 'Neue Nachricht' : n.length + ' neue Nachrichten') + ' von ' + p.firma + (n[0].art === 'freigabe' ? ' (Freigabe)' : n[0].art === 'aenderung' ? ' (Änderung gewünscht)' : ''), ziel: n[0].bestellung ? 'bestellung/' + n[0].bestellung : 'bestellungen' });
  }
  /* Versand und Domains der Instanzen (Hinweise der letzten 7 Tage aus dem Protokoll) */
  const seit = new Date(jetzt - 7 * TAG).toISOString();
  for (const art of ['instanz_versand', 'instanz_domain']) {
    const e = (await sp.protokollLesen({ art: art, seit: seit, anzahl: 20 }).catch(() => null)) || [];
    e.filter((x) => /nicht|Beschwerde|läuft|Bounce/i.test(x.text || '')).slice(0, 5).forEach((x) => liste.push({ art: art === 'instanz_domain' ? 'warn' : 'bad', gruppe: art === 'instanz_domain' ? 'domain' : 'versand', text: x.text, ziel: (x.daten && x.daten.instanz) ? 'instanz/' + x.daten.instanz : 'instanzen' }));
  }
  const handeln = liste.filter((x) => x.art !== 'info' || x.gruppe === 'nachricht').length;
  return { tabelle: true, anzahl: handeln, liste: liste.slice(0, 40) };
}
/* KPI der Pakete für die Übersicht, getrennt vom bisherigen MRR */
export async function paketeKennzahlen(ctx) {
  const sp = ctx.sp; if (!sp || !sp.bestellungenListe) return null;
  const [alle, inst] = await Promise.all([sp.bestellungenListe({}).catch(() => undefined), sp.instanzenAlle ? sp.instanzenAlle().catch(() => undefined) : undefined]);
  if (alle === undefined) return null;
  const laufend = alle.filter((b) => ['aktiv', 'zahlung_offen', 'gekuendigt'].includes(b.abo_status) && ['live', 'pausiert'].includes(b.status));
  const je = {}; P().LISTE.forEach((p) => { je[p] = 0; }); alle.filter((b) => b.status === 'live').forEach((b) => { const p = (b.abo && b.abo.paket) || b.paket_bestellt; if (je[p] != null) je[p]++; });
  return {
    live: alle.filter((b) => b.status === 'live').length, je: je, mrr: Math.round(laufend.reduce((s, b) => s + (Number((b.abo || {}).monat) || Number((b.preise || {}).monat) || 0), 0) * 100) / 100,
    inEinrichtung: alle.filter((b) => ['bezahlt', 'einrichtung', 'domain', 'freigabe'].includes(b.status)).length, offen: alle.filter((b) => b.status === 'offen').length,
    instanzen: Array.isArray(inst) ? inst.filter((i) => !i.demo).length : 0, demos: Array.isArray(inst) ? inst.filter((i) => i.demo).length : 0
  };
}

/* ---------- Liste ---------- */
const FILTER = {
  handeln: (b, x) => x.handeln, alle: () => true, offen: (b) => b.status === 'offen', einrichtung: (b) => ['bezahlt', 'einrichtung', 'domain', 'freigabe'].includes(b.status),
  live: (b) => b.status === 'live', pausiert: (b) => b.status === 'pausiert', beendet: (b) => ['beendet', 'storniert'].includes(b.status)
};
export const ZENTRALE_BESTELLUNGEN = {
  'GET /api/zentrale/aufgaben': async (ctx) => { await zugang(ctx); daten(ctx); return Object.assign({ ok: true }, await aufgabenListe(ctx)); },
  'GET /api/zentrale/bestellungen': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx);
    const alle = await sp.bestellungenListe({}).catch(() => undefined);
    if (alle === undefined) return { ok: true, tabelle: false, bestellungen: [], rueckrufe: [], zaehler: {} };
    const [partner, rueckrufe] = await Promise.all([sp.partnerAlle().catch(() => []), sp.rueckrufeOffen ? sp.rueckrufeOffen().catch(() => []) : []]);
    const pm = new Map((partner || []).map((p) => [p.id, p])), ungelesen = new Map(), heute = tagBerlin(new Date(jetztAus(ctx.env)));
    await jeEintrag((partner || []).slice(0, 200), async (p) => { const n = ((await sp.nachrichtenVon(p.id, { anzahl: 50 }).catch(() => [])) || []).filter((x) => x.von === 'partner' && !x.gelesen_at && x.art !== 'rueckruf').length; if (n) ungelesen.set(p.id, n); });
    const inst = new Map((((await sp.instanzenAlle().catch(() => [])) || [])).map((i) => [i.id, i])), teil = alle.slice(0, 500);
    const hostListen = await jeEintrag(teil, async (b) => (b.instanz && inst.has(b.instanz) ? (await sp.hostsVon(b.instanz).catch(() => [])) || [] : []));
    const zeilen = [];
    for (const [j, b] of teil.entries()) {
      const i = b.instanz ? inst.get(b.instanz) || null : null, hosts = hostListen[j], h = hosts.find((x) => x.haupt);
      const s = schrittVon(b, i, hosts, null), v = b.vorschau || {}, frei = b.status === 'freigabe' && v.freigabe && v.freigabe.version === v.version;
      const handeln = ['bezahlt'].includes(b.status) || (b.status === 'einrichtung' && !b.instanz) || frei || (b.status === 'freigabe' && v.aenderung && v.aenderung.version === v.version && !frei) || b.abo_status === 'zahlung_offen' || (b.status === 'pausiert' && (b.abo_status === 'beendet' || !(b.abo || {}).id)) || (b.verlauf || []).some((x) => x && x.art === 'hinweis' && Date.parse(x.zeit || '') > jetztAus(ctx.env) - 7 * TAG) || ungelesen.has(b.partner);
      const p = pm.get(b.partner) || {};
      zeilen.push({ id: b.id, nr: b.nr, firma: p.firma || '', mail: p.mail || '', paket: i ? i.paket : paketVon(b), status: b.status, statusTitel: RB().TITEL[b.status] || b.status, abo_status: b.abo_status, aboTitel: b.abo_status ? RB().ABO_TITEL[b.abo_status] : '',
        domain: h ? h.host : ((b.wunsch || {}).konfigurator || {}).domains ? (((b.wunsch || {}).konfigurator || {}).domains[0] || '') : '', domainOk: !!(h && h.pruefung && h.pruefung.ok), domainWunsch: !h, schritt: s.text, ungelesen: ungelesen.get(b.partner) || 0, handeln: !!handeln, updated_at: b.updated_at, created_at: b.created_at });
    }
    const zaehler = {}; Object.keys(FILTER).forEach((f) => { zaehler[f] = alle.filter((b, j) => zeilen[j] && FILTER[f](b, zeilen[j])).length; });
    const filter = FILTER[ctx.url.searchParams.get('filter')] ? ctx.url.searchParams.get('filter') : 'alle';
    const rr = (rueckrufe || []).map((n) => Object.assign(nachrichtSicht(n), { firma: (pm.get(n.partner) || {}).firma || '', faellig: rueckrufTag(n) && rueckrufTag(n) <= heute, ueberfaellig: rueckrufTag(n) && rueckrufTag(n) < heute })).sort((x, y) => String(rueckrufTag(x)).localeCompare(String(rueckrufTag(y))) || String((x.rueckruf || {}).fenster).localeCompare(String((y.rueckruf || {}).fenster)));
    return { ok: true, tabelle: true, filter: filter, zaehler: zaehler, bestellungen: zeilen.filter((z, j) => FILTER[filter](alle[j], z)), rueckrufe: rr, heute: heute };
  },
  'GET /api/zentrale/bestellungen/:id': async (ctx) => { await zugang(ctx); return { ok: true, bestellung: await bestellungSicht(ctx, await holen(ctx, ctx.params.id)) }; },
  'POST /api/zentrale/bestellungen/:id/status': async (ctx) => {
    await zugang(ctx); const b = await holen(ctx, ctx.params.id), body = ctx.body || {}, nach = String(body.nach || ''), text = str(body.text, 1000);
    if (nach === 'live') throw new ApiFehler('Live geht nur über „Live schalten“ (prüft die Ampel und startet das Abo).', 400);
    if (nach === 'storniert' && body.erstatten && (b.zahlung || {}).status === 'bezahlt') { await mitCode(ctx, 'erstatten'); await erstatten(ctx, b.id, { wer: 'inhaber', grund: text || 'Storno' }); }
    await uebergang(ctx, b.id, nach, { wer: 'inhaber', text: text });
    return { ok: true, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/instanz': async (ctx) => {
    await zugang(ctx); daten(ctx);
    const r = await instanzAusBestellung(ctx, ctx.params.id, { slug: str((ctx.body || {}).slug, 40) });
    return { ok: true, schon: r.schon, instanz: { id: r.instanz.id, slug: r.instanz.slug }, einladungen: (r.einladungen || []).length, bestellung: await bestellungSicht(ctx, await holen(ctx, ctx.params.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/vorschau': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), b = await holen(ctx, ctx.params.id);
    if (!['domain', 'freigabe'].includes(b.status)) throw new ApiFehler('Die Vorschau kommt nach „Domain gesichert“.', 409);
    let i = b.instanz ? await sp.instanzHolen(b.instanz) : null; if (!i) throw new ApiFehler('Erst die Instanz anlegen.', 409, { fehlt: 'instanz' });
    if (!((await sp.hostsVon(i.id)) || []).some((h) => h.haupt)) throw new ApiFehler('Erst eine Domain eintragen: Der Vorschau-Link zeigt auf sie.', 409, { fehlt: 'domain' });
    const m = merkmaleVon(i);
    if (!(Number((i.marke || {}).v) >= 1)) { if (m.gestaltung === 'eigen') throw new ApiFehler('Erst die Gestaltung veröffentlichen: Die Vorschau zeigt die veröffentlichte Fassung.', 409, { fehlt: 'gestaltung' }); await V.markeVeroeffentlichen(ctx, i.id); i = await sp.instanzHolen(i.id); }
    const v = Number(i.marke.v), t = await V.vorschauToken(ctx, i.id, v), zeit = jetztIso(ctx), erneut = b.status === 'freigabe';
    const neu = await sp.bestellungAendern(b.id, (z) => { z.vorschau = Object.assign({}, z.vorschau, { version: v, bis: t.bis, gesendet: zeit, link: t.url, erinnert: [] }); (z.verlauf = z.verlauf || []).push({ zeit: zeit, von: 'inhaber', text: 'Vorschau (Fassung ' + v + ') gesendet' }); });
    if (!erneut) await uebergang(ctx, b.id, 'freigabe', { wer: 'inhaber', text: 'Vorschau gesendet' });
    else {
      const p = await sp.partnerHolen(b.partner);
      if (p) await partnerMail(ctx, p, 'Neue Vorschau Ihres Konfigurators', absatz('Guten Tag' + (p.daten && p.daten.ap ? ' ' + esc(p.daten.ap) : '') + ',') + absatz('wir haben Ihren Konfigurator überarbeitet. Bitte sehen Sie sich die neue Vorschau an und geben Sie sie in Ihrem Kundenkonto frei, oder sagen Sie uns, was wir noch ändern sollen.') + knopf(t.url, 'Vorschau ansehen') + knopf(herkunft(ctx) + '/partner/#bestellung/' + b.id, 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-vorschau-' + v + '-' + (neu.verlauf || []).length }).catch(() => false);
    }
    await prot(ctx, b, 'Vorschau (Fassung ' + v + ') gesendet', { instanz: i.id });
    return { ok: true, link: t.url, bis: t.bis, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/live': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), b = await holen(ctx, ctx.params.id), vermerk = str((ctx.body || {}).vermerk, 1000);
    if (b.status !== 'freigabe') throw new ApiFehler('Live schalten geht aus „Zur Freigabe“ (jetzt: ' + (RB().TITEL[b.status] || b.status) + ').', 409);
    const i = b.instanz ? await sp.instanzHolen(b.instanz) : null; if (!i) throw new ApiFehler('Erst die Instanz anlegen.', 409, { fehlt: ['instanz'] });
    const a = await ampel(ctx, i, b, (await sp.hostsVon(i.id)) || []);
    const fehlt = a.punkte.filter((p) => !p.ok && !(p.vermerk && vermerk.length >= 10));
    if (fehlt.length) throw new ApiFehler('Noch nicht bereit: ' + fehlt.map((p) => p.text).join(', ') + '.', 409, { fehlt: fehlt.map((p) => p.id) });
    const v = b.vorschau || {}, frei = v.freigabe && v.freigabe.version === v.version;
    await uebergang(ctx, b.id, 'live', { wer: 'inhaber', text: frei ? (vermerk || 'Freigabe im Kundenkonto') : vermerk });
    return { ok: true, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/abo': async (ctx) => {
    await zugang(ctx); const b = await holen(ctx, ctx.params.id), body = ctx.body || {}, aktion = String(body.aktion || '');
    if (!['kuendigen', 'zuruecknehmen', 'beenden', 'aussetzen', 'fortsetzen', 'kulanz', 'neu'].includes(aktion)) throw new ApiFehler('Unbekannte Aktion.', 400);
    if (aktion === 'beenden') await mitCode(ctx, 'abo');
    await aboSteuern(ctx, b.id, aktion, { tage: body.tage, text: str(body.text, 300), wer: 'inhaber' });
    return { ok: true, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/paket': async (ctx) => {
    await zugang(ctx); const b = await holen(ctx, ctx.params.id), body = ctx.body || {};
    if (!P().gueltig(body.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
    const r = await paketWechseln(ctx, b.id, body.paket, { differenz: !!body.differenz, wer: 'inhaber' });
    return { ok: true, wechsel: { paket: r.paket, posten: !!r.posten }, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/erstatten': async (ctx) => {
    await zugang(ctx); const b = await holen(ctx, ctx.params.id), body = ctx.body || {}, grund = str(body.grund, 200);
    if (grund.length < 5) throw new ApiFehler('Bitte einen Grund angeben.', 400, { feld: 'grund' });
    await mitCode(ctx, 'erstatten');
    const cent = body.euro != null && String(body.euro).trim() !== '' ? Math.round(Number(String(body.euro).replace(',', '.')) * 100) : null;
    if (cent != null && !(cent > 0)) throw new ApiFehler('Bitte einen Betrag angeben.', 400, { feld: 'euro' });
    const r = await erstatten(ctx, b.id, { cent: cent, grund: grund, wer: 'inhaber' });
    return { ok: true, cent: r.cent, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/nachricht': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), b = await holen(ctx, ctx.params.id), t = String((ctx.body || {}).text == null ? '' : ctx.body.text).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim();
    if (t.length < 2) throw new ApiFehler('Bitte eine Nachricht schreiben.', 400, { feld: 'text' });
    if (t.length > R().GRENZEN.nachricht) throw new ApiFehler('Höchstens ' + R().GRENZEN.nachricht + ' Zeichen.', 400, { feld: 'text' });
    const p = await sp.partnerHolen(b.partner); if (!p) throw new ApiFehler('Den Partner gibt es nicht mehr.', 409);
    await sp.nachrichtAnlegen({ partner: p.id, bestellung: b.id, von: 'inhaber', art: 'text', text: t });
    await sp.nachrichtenGelesen(p.id, 'inhaber').catch(() => 0);
    const r = await partnerMail(ctx, p, 'Neue Nachricht zu Ihrer Bestellung ' + b.nr, absatz('Guten Tag' + (p.daten && p.daten.ap ? ' ' + esc(p.daten.ap) : '') + ',') + absatz(esc(t).replace(/\n/g, '<br>')) + knopf(herkunft(ctx) + '/partner/#nachrichten', 'Im Kundenkonto antworten')).catch(() => ({ ok: false }));
    await prot(ctx, b, 'Nachricht an den Partner' + (r && r.ok ? '' : ' (Mail nicht gesendet)'));
    return { ok: true, mail: !!(r && r.ok), bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  /* Wunsch-Domains (oder eine weitere) auf „wahrscheinlich frei“ prüfen, fürs Gespräch vor dem Kauf */
  'POST /api/zentrale/bestellungen/:id/domains/frei': async (ctx) => {
    await zugang(ctx); const b = await holen(ctx, ctx.params.id), extra = String((ctx.body || {}).host || '').trim();
    const liste = extra ? [extra] : ((((b.wunsch || {}).konfigurator || {}).domains) || []);
    if (!liste.length) throw new ApiFehler('Keine Domain zum Prüfen.', 400);
    return { ok: true, domains: await domainFrei(liste) };
  },
  'POST /api/zentrale/bestellungen/:id/notiz': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), b = await holen(ctx, ctx.params.id), t = String((ctx.body || {}).text == null ? '' : ctx.body.text).slice(0, 4000);
    await sp.bestellungAendern(b.id, (z) => { z.notiz = t; });
    return { ok: true, bestellung: await bestellungSicht(ctx, await holen(ctx, b.id)) };
  },
  'POST /api/zentrale/bestellungen/:id/gelesen': async (ctx) => { await zugang(ctx); const b = await holen(ctx, ctx.params.id); return { ok: true, n: await ctx.sp.nachrichtenGelesen(b.partner, 'inhaber') }; },
  'GET /api/zentrale/bestellungen/:id/datei/:did': async (ctx) => { await zugang(ctx); return dateiAntwort(ctx.k, await holen(ctx, ctx.params.id), String(ctx.params.did || '')); },
  'POST /api/zentrale/rueckrufe/:nid': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), nid = String(ctx.params.nid || '');
    const n = ((await sp.rueckrufeOffen()) || []).find((x) => x.id === nid);
    if (!n) throw new ApiFehler('Diesen offenen Rückruf gibt es nicht (mehr).', 404);
    await sp.nachrichtAendern(n.id, { rueckruf: Object.assign({}, n.rueckruf || {}, { erledigt: jetztIso(ctx), notiz: str((ctx.body || {}).notiz, 500) }), gelesen_at: n.gelesen_at || jetztIso(ctx) });
    await protokoll(sp, 'bestellung', null, 'Rückruf erledigt', { partner: n.partner, bestellung: n.bestellung || null });
    return { ok: true };
  }
};

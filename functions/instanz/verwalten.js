/* eeziframes · Instanzen verwalten: anlegen, ändern, Status, Hosts, Marke, Empfänger, Vorschau, Cache, Löschen
   (Strang A, Bauplan §3 A.14; Aufrufer: Zentrale (C), Bestellung (D); Vertrag docs/INSTANZEN.md)
   Jede Änderung prüft, was sie darf (Paket nur über paketSetzen, also paketWechseln in bestellung.js; Status nur über instanzStatus
   nach Instanzregeln.instanz; Hosts nach Instanzregeln.host; Farben als Hex; Eingangsadressen höchstens GRENZEN.eingangMails, Zugänge
   höchstens m.zugaenge), leert danach die Zwischenspeicher der Hosts (L1 im Isolate, KV) und schreibt ins Protokoll der Zentrale.
   Neue Eingangs- und Zugangsadressen bekommen eine Mail mit Bestätigungslink (Token Zweck empfaenger, 14 Tage); Anfragen gehen nur an
   bestätigte Adressen (K1.9, E16).
   API: instanzAnlegen(ctx, p) · instanzAendern(ctx, id, fn) · instanzStatus(ctx, id, status, grund, o) · paketSetzen(ctx, id, paket, grund) ·
        hostSetzen(ctx, id, host, o) · hostEntfernen(ctx, id, host) · hauptSetzen(ctx, id, host) · markeVeroeffentlichen(ctx, id) ·
        bildAblegen(ctx, id, name, bytes, typ) · profilSetzen(ctx, id, einladung, o) · empfaengerEinladen(ctx, id, mail, art) ·
        empfaengerBestaetigen(ctx, id, mail, art) · vorschauToken(ctx, id, version) · cacheLeeren(ctx, id) · instanzDatenLoeschen(ctx, id) ·
        anmeldungGebraucht(sp, uid, o)
   ctx: { k, env, sp, url?, waitUntil? } wie in den Routen (router.js). */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import '../../web/assets/einladung.js';
import { ApiFehler } from '../api/umgebung.js';
import { tokenSignieren } from '../api/sitzung.js';
import { postDienst, mailRahmen, esc } from '../api/post.js';
import { ablage, fotosLinkLoeschen } from '../api/fotos.js';
import { anmeldungLoeschen } from '../api/auth.js';
import { entfernt } from '../api/eigene.js';
import { basis, HAUPTADRESSE } from '../seo.js';
import { cacheVergessen } from './mandant.js';
import { bildTyp } from '../api/blatt-server.js';
import { absender, rahmenMarke, instanzKontext } from '../api/eingang.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const EIN = () => globalThis.Einladung;
const TAG = 864e5;
const iso = (t) => new Date(t).toISOString();
const jetztVon = (ctx) => (ctx && ctx.k && ctx.k.jetzt) || Date.now();
const lokal = (url) => !!url && /(^|\.)localhost$|^127\./.test(url.hostname);

async function protokoll(ctx, betrieb, text, daten) {
  if (!ctx.sp || !ctx.sp.protokollSchreiben) return false;
  try { return await ctx.sp.protokollSchreiben({ art: 'instanz', betrieb: betrieb || null, text: String(text).slice(0, 300), daten: daten || {} }); } catch (e) { return false; }
}
async function holen(ctx, id) { const i = await ctx.sp.instanzHolen(id); if (!i) throw new ApiFehler('Diese Instanz gibt es nicht.', 404); return i; }

/* ---------- Prüfungen ---------- */
const mailNorm = (m) => String(m || '').trim().toLowerCase();
function mailListe(liste, max, feld) {
  const out = [];
  (Array.isArray(liste) ? liste : []).forEach((x) => {
    const e = typeof x === 'string' ? { mail: x } : Object.assign({}, x || {});
    e.mail = mailNorm(e.mail);
    if (!R().mailOk(e.mail)) throw new ApiFehler('Keine gültige E-Mail-Adresse: ' + (e.mail || '(leer)'), 400, { feld: feld });
    if (out.some((y) => y.mail === e.mail)) return;
    out.push(e);
  });
  if (out.length > max) throw new ApiFehler('Höchstens ' + max + ' Adressen.', 400, { feld: feld });
  return out;
}
function pruefen(z, alt, m) {
  if (alt && z.paket !== alt.paket) throw new ApiFehler('Das Paket wechselt nur über die Bestellung (paketWechseln).', 400);
  if (alt && z.status !== alt.status) throw new ApiFehler('Der Status wechselt nur über instanzStatus.', 400);
  if (!/^[a-z0-9-]{3,40}$/.test(String(z.slug || ''))) throw new ApiFehler('Die Kennung braucht 3 bis 40 Zeichen aus a–z, 0–9 und Bindestrich.', 400);
  const mk = z.marke && typeof z.marke === 'object' ? z.marke : {};
  [mk.farbe, z.entwurf && z.entwurf.farbe].forEach((f) => { if (f && !/^#[0-9a-f]{6}$/.test(String(f).toLowerCase())) throw new ApiFehler('Bitte eine Farbe als #rrggbb angeben.', 400, { feld: 'farbe' }); });
  const eg = z.eingang && typeof z.eingang === 'object' ? z.eingang : { mails: [] };
  eg.mails = mailListe(eg.mails, R().GRENZEN.eingangMails, 'eingang').map((e) => ({ mail: e.mail, bestaetigt: e.bestaetigt || null, eingeladen: e.eingeladen || null }));
  z.eingang = eg;
  const altZ = alt && Array.isArray(alt.zugang) ? alt.zugang.length : 0, maxZ = m && m.dashboard ? Number(m.zugaenge) || 0 : 0;
  const zg = mailListe(z.zugang, 50, 'zugang');
  if (zg.length > maxZ && zg.length > altZ) throw new ApiFehler('Dieses Paket hat höchstens ' + maxZ + ' Zugänge zum Dashboard.', 400, { feld: 'zugang' });
  z.zugang = zg.map((e) => Object.assign({ uid: null, name: '', rolle: 'team', bestaetigt: null, zuletzt: null, aus: false }, e));
}
/* Adressen, die neu sind (oder deren Bestätigung fehlt und noch nie eingeladen wurde): bekommen den Bestätigungslink */
const neueAdressen = (neu, alt) => (neu || []).filter((e) => !e.bestaetigt && !(alt || []).some((a) => a.mail === e.mail && (a.bestaetigt || a.eingeladen))).map((e) => e.mail);

/* ---------- Anlegen und Ändern ---------- */
export async function instanzAnlegen(ctx, p) {
  p = Object.assign({}, p || {});
  if (!P().gueltig(p.paket)) throw new ApiFehler('Unbekanntes Paket.', 400);
  const m = P().merkmale(p.paket);
  const z = { slug: String(p.slug || '').toLowerCase(), paket: p.paket, status: 'einrichtung', marke: {}, eingang: p.eingang && !Array.isArray(p.eingang) ? p.eingang : { mails: p.eingang || [] }, zugang: p.zugang || [] };
  pruefen(z, null, m);
  z.eingang.mails.forEach((e) => { e.bestaetigt = null; }); z.zugang.forEach((e) => { e.bestaetigt = null; e.uid = null; });
  if (p.entwurf && p.entwurf.farbe && !/^#[0-9a-f]{6}$/.test(String(p.entwurf.farbe).toLowerCase())) throw new ApiFehler('Bitte eine Farbe als #rrggbb angeben.', 400);
  const ein = EIN().einstellungen((p.betriebDaten || {}).einladung || {});
  const id = await ctx.sp.instanzAnlegen({ slug: z.slug, name: String(p.name || '').trim().slice(0, 80), plz: p.plz || null, paket: p.paket, partner: p.partner || null, bestellung: p.bestellung || null,
    eingang: z.eingang, zugang: z.zugang, recht: p.recht || {}, entwurf: p.entwurf === undefined ? null : p.entwurf, demo: !!p.demo,
    betriebDaten: Object.assign({}, p.betriebDaten || {}, { einladung: ein, since: (p.betriebDaten || {}).since || new Date(jetztVon(ctx)).getFullYear() }) });
  await protokoll(ctx, null, 'Instanz ' + z.slug + ' angelegt (' + P().PAKETE[p.paket].name + ')', { instanz: id });
  const einladungen = [];
  for (const mail of z.eingang.mails.map((e) => e.mail)) einladungen.push(await empfaengerEinladen(ctx, id, mail, 'eingang').catch((e) => ({ ok: false, fehler: e.message })));
  for (const mail of z.zugang.map((e) => e.mail)) einladungen.push(await empfaengerEinladen(ctx, id, mail, 'zugang').catch((e) => ({ ok: false, fehler: e.message })));
  const row = await ctx.sp.instanzHolen(id);
  return Object.assign({}, row, { einladungen: einladungen });
}

export async function instanzAendern(ctx, id, fn) {
  let alt = null, neu = [];
  const out = await ctx.sp.instanzAendern(id, async (z, a) => {
    alt = a; const r = await fn(z, a); if (r === false) return false;
    pruefen(z, a, P().merkmale(a.paket, a.abweichung));
    neu = neueAdressen(z.eingang.mails, (a.eingang || {}).mails).map((m) => [m, 'eingang']).concat(neueAdressen(z.zugang, a.zugang).map((m) => [m, 'zugang']));
    return r;
  });
  if (out === false) return false;
  await cacheLeeren(ctx, id);
  await protokoll(ctx, alt && alt.betrieb, 'Instanz ' + (alt ? alt.slug : id) + ' geändert', { instanz: id });
  for (const [mail, art] of neu) await empfaengerEinladen(ctx, id, mail, art).catch(() => false);
  return out;
}

/* Paket nur hier (Aufrufer: paketWechseln in functions/api/bestellung.js, der zugleich den Preis bei Stripe umstellt) */
export async function paketSetzen(ctx, id, paket, grund) {
  if (!P().gueltig(paket)) throw new ApiFehler('Unbekanntes Paket.', 400);
  let von = '';
  const out = await ctx.sp.instanzAendern(id, (z) => { von = z.paket; if (z.paket === paket) return false; z.paket = paket; });
  if (out === false) return await ctx.sp.instanzHolen(id);
  await cacheLeeren(ctx, id);
  await protokoll(ctx, out.betrieb, 'Paket ' + P().PAKETE[von].name + ' → ' + P().PAKETE[paket].name + (grund ? ' (' + grund + ')' : ''), { instanz: id, von: von, nach: paket });
  return out;
}

/* Status (Instanzregeln.instanz): pausiert mit pause_bis (höchstens pauseMaxTage), aktiv hebt die Pause auf, beendet setzt ende_am */
export async function instanzStatus(ctx, id, status, grund, o) {
  o = o || {};
  const jetzt = jetztVon(ctx), maxBis = jetzt + R().FRISTEN.pauseMaxTage * TAG;
  let von = '';
  const out = await ctx.sp.instanzAendern(id, (z) => {
    von = z.status;
    if (z.status === status) return false;
    if (!R().instanz.uebergang(z.status, status)) throw new ApiFehler('Von ' + z.status + ' nach ' + status + ' geht nicht.', 409);
    z.status = status;
    if (status === 'pausiert') { z.pause_seit = iso(jetzt); const bis = o.bis ? Date.parse(o.bis) : NaN; z.pause_bis = iso(Number.isNaN(bis) ? maxBis : Math.min(bis, maxBis)); }
    if (status === 'aktiv') { z.pause_seit = null; z.pause_bis = null; }
    if (status === 'beendet') z.ende_am = iso(jetzt);
  });
  if (out === false) return await ctx.sp.instanzHolen(id);
  await cacheLeeren(ctx, id);
  await protokoll(ctx, out.betrieb, 'Instanz ' + out.slug + ': ' + von + ' → ' + status + (grund ? ' (' + String(grund).slice(0, 200) + ')' : ''), { instanz: id, von: von, nach: status });
  return out;
}

/* ---------- Hosts ---------- */
export async function hostSetzen(ctx, id, host, o) {
  o = o || {};
  const i = await holen(ctx, id), r = R().host(host, { demo: !!i.demo, lokal: !!ctx.k.datenAttrappe });
  if (!r.ok) throw new ApiFehler(r.fehler, 400, { grund: 'host_ungueltig' });
  const hosts = (await ctx.sp.hostsVon(id)) || [], haupt = o.haupt !== undefined ? !!o.haupt : !hosts.some((h) => h.haupt);
  const row = await ctx.sp.hostAnlegen({ host: r.host, instanz: id, haupt: haupt, weg: o.weg === 'saas' ? 'saas' : 'zone', status: o.status || (haupt ? 'einrichtung' : 'umleiten'), registrar: o.registrar || {} });
  cacheVergessen(r.host); await kvLoeschen(ctx, [r.host]);
  await protokoll(ctx, i.betrieb, 'Domain ' + r.host + ' an Instanz ' + i.slug + (haupt ? ' (Hauptdomain)' : ''), { instanz: id, host: r.host });
  return row;
}
export async function hostEntfernen(ctx, id, host) {
  const i = await holen(ctx, id), h = String(host || '').toLowerCase();
  if (!((await ctx.sp.hostsVon(id)) || []).some((x) => x.host === h)) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
  await ctx.sp.hostLoeschen(h);
  cacheVergessen(h); await kvLoeschen(ctx, [h]);
  await protokoll(ctx, i.betrieb, 'Domain ' + h + ' von Instanz ' + i.slug + ' entfernt', { instanz: id, host: h });
  return { ok: true };
}
export async function hauptSetzen(ctx, id, host) {
  const i = await holen(ctx, id), h = String(host || '').toLowerCase(), hosts = (await ctx.sp.hostsVon(id)) || [];
  if (!hosts.some((x) => x.host === h)) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
  for (const x of hosts) if (x.haupt && x.host !== h) await ctx.sp.hostAendern(x.host, { haupt: false, status: 'umleiten' });
  await ctx.sp.hostAendern(h, { haupt: true, status: 'aktiv' });
  await cacheLeeren(ctx, id);
  await protokoll(ctx, i.betrieb, 'Hauptdomain von ' + i.slug + ': ' + h, { instanz: id, host: h });
  return (await ctx.sp.hostsVon(id)) || [];
}

/* ---------- Marke ---------- */
const BILD_NAME = /^(logo|icon32|icon180|icon192|icon512|og|ap|start-[1-6])\.(png|jpg|jpeg|webp)$/;
/* Bild für den Gestaltungsentwurf (Zentrale): instanz/<id>/entwurf/<name> im Bucket marke; entwurf.bilder nennt es */
export async function bildAblegen(ctx, id, name, bytes, typ) {
  name = String(name || '').toLowerCase();
  if (!BILD_NAME.test(name)) throw new ApiFehler('Unbekannter Bildname.', 400);
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []), echt = bildTyp(u);
  if (!echt || (typ && typ !== echt)) throw new ApiFehler('Nur PNG, JPEG oder WebP.', 400);
  const ab = ablage(ctx.k, 'marke'); if (!ab) throw new ApiFehler('Die Bildablage ist nicht eingerichtet.', 503);
  await holen(ctx, id);
  if (!(await ab.ablegen('instanz/' + id + '/entwurf/' + name, u, echt))) throw new ApiFehler('Das Bild ließ sich nicht ablegen (höchstens 2 MB).', 400);
  const schl = name.replace(/\.[a-z]+$/, '');
  await ctx.sp.instanzAendern(id, (z) => {
    const e = Object.assign({}, z.entwurf || {}), b = Object.assign({}, e.bilder || {});
    if (/^start-\d$/.test(schl)) { const s = (Array.isArray(b.start) ? b.start : []).filter((x) => x.replace(/\.[a-z]+$/, '') !== schl); s.push(name); b.start = s.sort(); } else b[schl] = name;
    e.bilder = b; z.entwurf = e;
  });
  return { ok: true, name: name, pfad: 'instanz/' + id + '/entwurf/' + name, typ: echt };
}
/* Entwurf der Gestaltung veröffentlichen: Bilder nach instanz/<id>/<v>/, marke = entwurf mit v + 1, Zwischenspeicher leer */
export async function markeVeroeffentlichen(ctx, id) {
  const i = await holen(ctx, id), e = i.entwurf && typeof i.entwurf === 'object' ? i.entwurf : null;
  if (!e) throw new ApiFehler('Es gibt keinen Entwurf der Gestaltung.', 409);
  const v = (Number((i.marke || {}).v) || 0) + 1, ab = ablage(ctx.k, 'marke'), b = e.bilder && typeof e.bilder === 'object' ? e.bilder : {}, bilder = {};
  const namen = Object.keys(b).filter((k) => k !== 'start' && BILD_NAME.test(String(b[k]))).map((k) => [k, b[k]]).concat((Array.isArray(b.start) ? b.start : []).filter((n) => BILD_NAME.test(String(n))).map((n) => ['start', n]));
  for (const [k, n] of namen) {
    if (!ab) break;
    const u = await ab.holen('instanz/' + id + '/entwurf/' + n);
    if (!u || !(await ab.ablegen('instanz/' + id + '/' + v + '/' + n, u, bildTyp(u)))) continue;
    if (k === 'start') (bilder.start = bilder.start || []).push(n); else bilder[k] = n;
  }
  const farbe = e.farbe && /^#[0-9a-f]{6}$/i.test(e.farbe) ? String(e.farbe).toLowerCase() : '';
  const st = e.start && typeof e.start === 'object' ? e.start : {};
  const marke = { name: String(e.name || (i.marke || {}).name || '').trim().slice(0, 80), titel: String(e.titel || '').slice(0, R().GRENZEN.titel), beschreibung: String(e.beschreibung || '').slice(0, 300), farbe: farbe, v: v, bilder: bilder,
    start: { kicker: String(st.kicker || '').slice(0, 60), ueberschrift: String(st.ueberschrift || '').slice(0, 120), text: String(st.text || '').slice(0, R().GRENZEN.begruessung) }, veroeffentlicht: iso(jetztVon(ctx)) };
  const out = await ctx.sp.instanzAendern(id, (z) => { z.marke = marke; });
  await cacheLeeren(ctx, id);
  await protokoll(ctx, i.betrieb, 'Gestaltung von ' + i.slug + ' veröffentlicht (Fassung ' + v + ')', { instanz: id, v: v });
  return out;
}
/* Profil der Startansicht in der Betriebszeile (Einladung.einstellungen), dazu Ansprechpartner, Telefon, E-Mail, Bestellmaß */
export async function profilSetzen(ctx, id, einladung, o) {
  o = o || {};
  const i = await holen(ctx, id), fehler = [], ein = EIN().einstellungen(einladung || {}, fehler);
  if (fehler.length) throw new ApiFehler(fehler[0], 400);
  await ctx.sp.betriebAendern(i.betrieb, (a) => {
    a.einladung = ein;
    ['ap', 'tel', 'mail'].forEach((f) => { if (o[f] !== undefined) a[f] = String(o[f] || '').trim().slice(0, 120); });
    if (o.abzug && typeof o.abzug === 'object') a.abzug = { seite: Math.max(0, Math.min(60, Number(o.abzug.seite) || 0)), oben: Math.max(0, Math.min(60, Number(o.abzug.oben) || 0)), unten: Math.max(0, Math.min(60, Number(o.abzug.unten) || 0)), untenT: Math.max(0, Math.min(60, Number(o.abzug.untenT) || 0)) };
  });
  await cacheLeeren(ctx, id);
  return { ok: true, einladung: ein };
}

/* ---------- Empfänger und Zugänge ---------- */
function hauptBasis(ctx) {
  if (ctx.url && !ctx.instanz) return basis(ctx.env, ctx.url);
  return String((ctx.env && ctx.env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, '');
}
export async function empfaengerEinladen(ctx, id, mail, art) {
  art = art === 'zugang' ? 'zugang' : 'eingang'; mail = mailNorm(mail);
  if (!R().mailOk(mail)) throw new ApiFehler('Keine gültige E-Mail-Adresse.', 400);
  const jetzt = jetztVon(ctx);
  /* Eintrag anlegen bzw. „eingeladen“ setzen */
  await ctx.sp.instanzAendern(id, (z) => {
    if (art === 'zugang') { const l = Array.isArray(z.zugang) ? z.zugang : []; let e = l.find((x) => x.mail === mail); if (!e) { e = { mail: mail, uid: null, name: '', rolle: 'team', bestaetigt: null, zuletzt: null, aus: false }; l.push(e); } e.eingeladen = iso(jetzt); z.zugang = l; }
    else { const eg = z.eingang && typeof z.eingang === 'object' ? z.eingang : { mails: [] }, l = Array.isArray(eg.mails) ? eg.mails : []; let e = l.find((x) => x.mail === mail); if (!e) { e = { mail: mail, bestaetigt: null }; l.push(e); } e.eingeladen = iso(jetzt); eg.mails = l; z.eingang = eg; }
  });
  const inst = await instanzKontext(ctx.sp, id), pd = postDienst(ctx.k);
  if (!inst || !pd) return { ok: true, gesendet: false };
  const t = await tokenSignieren(ctx.k, 'empfaenger', { i: id, m: mail, a: art }, R().FRISTEN.empfaengerTage * 86400);
  const link = hauptBasis(ctx) + '/api/instanz/bestaetigen?t=' + encodeURIComponent(t);
  const p = (s) => '<p style="margin:0 0 12px">' + s + '</p>';
  const was = art === 'zugang' ? 'sich mit dieser Adresse im Dashboard Ihres Fensterplaners anmelden können' : 'die Anfragen aus Ihrem Fensterplaner bekommen';
  const titel = 'Bitte bestätigen Sie Ihre E-Mail-Adresse';
  const html = mailRahmen(titel, p('Guten Tag,') + p('diese Adresse soll künftig ' + esc(was) + ' (' + esc(inst.name) + (inst.haupthost ? ', ' + esc(inst.haupthost) : '') + '). Bitte bestätigen Sie das mit einem Klick; vorher geht nichts an diese Adresse.') +
    '<p style="margin:18px 0 6px"><a href="' + esc(link) + '" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#161616;color:#f1f0ea;font-weight:700;text-decoration:none">Adresse bestätigen</a></p>' +
    p('<span style="font-size:13px;color:#6e6e73">Der Link gilt ' + R().FRISTEN.empfaengerTage + ' Tage. Haben Sie das nicht erwartet, ignorieren Sie diese E-Mail einfach.</span>'), '', { marke: rahmenMarke(inst) });
  const r = await pd.senden({ an: mail, betreff: (art === 'zugang' ? 'Zugang zum Dashboard bestätigen: ' : 'Adresse für Anfragen bestätigen: ') + inst.name, html: html, von: absender(ctx.k, inst) });
  return { ok: true, gesendet: !!(r && r.ok) };
}
export async function empfaengerBestaetigen(ctx, id, mail, art) {
  mail = mailNorm(mail); let gefunden = false, name = '';
  const jetzt = jetztVon(ctx);
  await ctx.sp.instanzAendern(id, (z) => {
    name = (z.marke && z.marke.name) || '';
    const l = art === 'zugang' ? (Array.isArray(z.zugang) ? z.zugang : []) : ((z.eingang || {}).mails || []), e = l.find((x) => x && x.mail === mail);
    if (!e) return false;
    gefunden = true; if (e.bestaetigt) return false;
    e.bestaetigt = iso(jetzt);
  }).catch(() => false);
  if (!gefunden) return { ok: false };
  if (!name) { const i = await ctx.sp.instanzHolen(id); const b = i ? await ctx.sp.betriebHolen(i.betrieb) : null; name = (b && b.name) || ''; }
  await cacheLeeren(ctx, id);
  return { ok: true, name: name };
}

/* ---------- Vorschau, Zwischenspeicher ---------- */
export async function vorschauToken(ctx, id, version) {
  const i = await holen(ctx, id), hosts = (await ctx.sp.hostsVon(id)) || [], h = (hosts.find((x) => x.haupt) || hosts[0] || {}).host || '';
  const token = await tokenSignieren(ctx.k, 'vorschau', { i: id, v: Number(version) || i.version }, R().FRISTEN.vorschauTage * 86400);
  const b = !h ? '' : lokal(ctx.url) ? ctx.url.protocol + '//' + h + (ctx.url.port ? ':' + ctx.url.port : '') : 'https://' + h;
  return { token: token, url: b ? b + '/?vorschau=' + encodeURIComponent(token) : '', bis: iso(jetztVon(ctx) + R().FRISTEN.vorschauTage * TAG) };
}
async function kvLoeschen(ctx, hosts) {
  const kv = ctx.env && ctx.env.INSTANZEN; if (!kv || typeof kv.delete !== 'function') return;
  for (const h of hosts) { try { await kv.delete('host:' + h); } catch (e) { /* weiter */ } }
}
export async function cacheLeeren(ctx, id) {
  const hosts = ((await ctx.sp.hostsVon(id)) || []).map((h) => h.host);
  hosts.forEach((h) => cacheVergessen(h));
  await kvLoeschen(ctx, hosts);
  return true;
}

/* ---------- Anmeldung noch gebraucht? ----------
   Eine Anmeldung (Supabase Auth) kann zugleich ein Betrieb des Altbestands, ein Partner (Kundenkonto), ein Zugang einer anderen Instanz
   oder ein Hauseigentümer-Konto mit gesicherten Aufmaßen sein (Tabelle eigene, B2C). Wer sie löscht, nimmt diesen Aufmaßen den Besitzer
   (eigene.nutzer: on delete set null), und der tägliche Lauf der Zentrale löscht sie dann. Es zählt nur, was lebt: mit Besitzer und ohne
   Löschmarke (wie lebt in zentrale.js). o.ohneInstanz: die Instanz, die gerade gelöscht wird; o.instanzen: alle Instanzen, falls schon
   gelesen. Antwortet die Datenbank bei den Aufmaßen nicht, gilt die Anmeldung im Zweifel als gebraucht. */
const lebt = (e) => !!(e && e.nutzer && !entfernt(e));
export async function anmeldungGebraucht(sp, uid, o) {
  o = o || {};
  if (!uid) return false;
  if (await sp.betriebNachAuth(uid)) return true;
  if (sp.partnerNachAuth && (await sp.partnerNachAuth(uid))) return true;
  const instanzen = o.instanzen || (await sp.instanzenAlle()) || [];
  if (instanzen.some((x) => x && x.id !== o.ohneInstanz && (Array.isArray(x.zugang) ? x.zugang : []).some((z) => z && z.uid === uid))) return true;
  if (sp.eigeneVonNutzer) {
    let eig; try { eig = await sp.eigeneVonNutzer(uid); } catch (e) { return true; }
    if (Array.isArray(eig) && eig.some(lebt)) return true;
  }
  return false;
}

/* ---------- Löschen (K1.12, feste Liste; Aufrufer: bestellungenLauf nach loeschenNachEndeTage, Zentrale) ----------
   anfragen und ihre Zwischenstände samt Fotos (link/<code>), Zwischenstände des Betriebs (virtuelle Links), Bucket marke instanz/<id>/,
   Bucket blatt instanz/<id>/, Dateien der Bestellung (partner/<partner>/<bestellung>/), Anmeldungen der Dashboard-Zugänge (wenn sonst
   ungenutzt, anmeldungGebraucht), KV-Schlüssel und Hosts, zuletzt Instanz und Betriebszeile */
export async function instanzDatenLoeschen(ctx, id) {
  const sp = ctx.sp, i = await sp.instanzHolen(id); if (!i) return { ok: true, schon: true };
  const out = { ok: true, anfragen: 0, entwuerfe: 0, anmeldungen: [], hosts: 0 };
  for (const a of (await sp.anfragenVonBetrieb(i.betrieb, { kopf: true })) || []) {
    await fotosLinkLoeschen(ctx.k, a.code); if (sp.entwurfLoeschen) await sp.entwurfLoeschen(a.code); await sp.anfrageLoeschen(a.code); out.anfragen++;
  }
  for (const e of (await sp.entwuerfeVonBetrieb(i.betrieb)) || []) { await fotosLinkLoeschen(ctx.k, e.code); await sp.entwurfLoeschen(e.code); out.entwuerfe++; }
  const marke = ablage(ctx.k, 'marke'), blatt = ablage(ctx.k, 'blatt'), best = ablage(ctx.k, 'bestellungen');
  try { if (marke) await marke.ordnerLoeschen('instanz/' + id); if (blatt) await blatt.ordnerLoeschen('instanz/' + id); if (best && i.partner && i.bestellung) await best.ordnerLoeschen('partner/' + i.partner + '/' + i.bestellung); } catch (e) { out.ok = false; }
  /* Anmeldungen der Zugänge, wenn sie zu keinem Betrieb, Partner, keiner anderen Instanz und keinem Hauseigentümer-Konto mit Aufmaßen gehören */
  const alle = (await sp.instanzenAlle()) || [];
  for (const z of Array.isArray(i.zugang) ? i.zugang : []) {
    if (!z || !z.uid) continue;
    if (await anmeldungGebraucht(sp, z.uid, { ohneInstanz: id, instanzen: alle })) continue;
    const r = await anmeldungLoeschen(ctx.k, z.uid).catch(() => ({ ok: false }));
    if (r.ok) out.anmeldungen.push(z.uid); else out.ok = false;
  }
  const hosts = ((await sp.hostsVon(id)) || []).map((h) => h.host);
  await kvLoeschen(ctx, hosts);
  for (const h of hosts) { await sp.hostLoeschen(h); cacheVergessen(h); out.hosts++; }
  await sp.instanzLoeschen(id);
  await protokoll(ctx, null, 'Instanz ' + i.slug + ' mit allen Daten gelöscht (' + out.anfragen + ' Anfragen, ' + out.entwuerfe + ' Zwischenstände)', { instanz: id });
  return out;
}

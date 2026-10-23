/* eeziframes · Zentrale: Instanzen einrichten und betreiben (Strang C, Bauplan §3 C.2–C.7; Verträge docs/INSTANZEN.md)
   Domain (cloudflare.js), Gestaltung mit Entwurf und Veröffentlichen, Recht, Empfänger und Zugänge, Testanfrage und Versandliste,
   Ampel „Live“, Pause, Fortsetzen, Beenden, Paketwechsel, Demo-Schalter, Kennzahlen aus inst:*. Jede Änderung an einer Instanz läuft über
   functions/instanz/verwalten.js (Strang A), Paket und Status einer Instanz mit Bestellung über functions/api/bestellung.js (Strang D):
   Diese Datei entscheidet nichts selbst, sie zeigt an und ruft auf. Zugang wie die übrige Zentrale (Cookie __Host-zentrale und
   Kopfzeile x-zentrale: 1); Domain-Aktionen und Beenden verlangen bei eingerichtetem zweitem Faktor einen frischen Code.
   Daten der Endkunden erscheinen hier nie: die Versandliste nennt nur Nummer, Art und Stand des Versands.

   Routen unter /api/zentrale/instanzen:
     GET  ''                       Liste mit Status, Paket, Domain, Bestellung, Kennzahlen der letzten 30 Tage
     POST ''                       Instanz ohne Bestellung anlegen (Demo der Verkaufsseite) { slug, paket, name, demo }
     GET  /:id                     alles für die Seite der Instanz (Sicht, Ampel, Domain, Versand, Kennzahlen)
     POST /:id/host, /:id/host/entfernen, /:id/host/haupt                       Domains (Format, eeziframes-Hosts, doppelt: Fehler)
     POST /:id/domain/verbinden | zone | pruefen | loesen | registrar           Cloudflare oder Klick-Anleitung, Prüfung
     POST /:id/entwurf · /:id/bild · GET /:id/bild/:name · POST /:id/veroeffentlichen · /:id/profil       Gestaltung
     POST /:id/recht · /:id/eingang · /:id/zugang                              Rechtsangaben, Empfänger, Dashboard-Zugänge
     POST /:id/test · /:id/anfragen/:code/erneut                              Testanfrage, erneut senden
     POST /:id/live · /:id/status · /:id/paket · /:id/schalter · /:id/loeschen    Betrieb
   Export für zentrale-bestellungen.js: instanzSicht, ampel, schrittVon, testStand, mitCode, merkmaleVon */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import { ApiFehler, jetztAus } from './umgebung.js';
import { zugang, daten, protokoll, frischerCode } from './zentrale.js';
import * as V from '../instanz/verwalten.js';
import { probeEingang, eingangErneut } from './eingang.js';
import { rechtVollstaendig, VORLAGE } from '../instanz/recht.js';
import { standText } from './recht.js';
import { cloudflareDienst, anleitung, domainVerbinden, zoneAnlegen, domainPruefen, domainLoesen } from './cloudflare.js';
import { paketWechseln, aboSteuern, uebergang } from './bestellung.js';
import { ablage } from './fotos.js';
import { bildTyp } from './blatt-server.js';
import { tagBerlin, tagPlus } from './statistik.js';
import { ANBIETER } from './anbieter.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const RB = () => globalThis.Instanzregeln.bestellung;
const TAG = 864e5;
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n || 200);
const text = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, '').trim().slice(0, n || 400);
const id8Von = (id) => String(id || '').replace(/-/g, '').slice(0, 8);
/* je Eintrag eine Abfrage, höchstens sechs gleichzeitig (so viele offene Verbindungen erlaubt ein Worker) */
export async function jeEintrag(liste, fn, n) {
  const out = new Array(liste.length); let i = 0;
  const arbeiter = async () => { while (i < liste.length) { const j = i++; out[j] = await fn(liste[j], j); } };
  await Promise.all(Array.from({ length: Math.min(n || 6, liste.length) }, arbeiter));
  return out;
}
export const merkmaleVon = (i) => P().merkmale(i.paket, i.abweichung) || {};
const lokal = (url) => !!url && /(^|\.)localhost$|^127\./.test(url.hostname);

/* Frischer Code für Domain-Aktionen und Beenden: ohne Code 403 (die Oberfläche fragt ihn ab), falscher Code 401 (zentrale.js) */
export async function mitCode(ctx, zweck) {
  if (!ctx.k.zentrale.totp) return;
  if (!String((ctx.body || {}).code || '').trim()) throw new ApiFehler('Bitte den aktuellen Code aus der Authenticator-App eingeben.', 403, { code: true });
  await frischerCode(ctx, zweck, false);
}
async function laden(ctx, id) {
  const i = await daten(ctx).instanzHolen(String(id || ''));
  if (i === undefined) throw new ApiFehler('Die Datenbank kennt die Instanzen noch nicht (supabase/schema.sql erneut ausführen).', 503);
  if (!i) throw new ApiFehler('Diese Instanz gibt es nicht.', 404);
  return i;
}
async function bestellungVon(ctx, i) { if (!i.bestellung) return null; try { return await ctx.sp.bestellungHolen(i.bestellung); } catch (e) { return null; } }

/* ---------- Testanfrage: Stand aus der Zeile (solange es sie gibt, 1 Tag), sonst der zuletzt gemerkte ---------- */
export async function testStand(ctx, i) {
  const t = Object.assign({}, ((i.eingang || {}).test) || {});
  if (!t.code) return { da: false, ok: false, status: '' };
  const z = await ctx.sp.anfrageHolen(t.code).catch(() => null), v = (z && z.versand) || null;
  if (v && v.status && v.status !== t.status) {
    t.status = v.status; if (v.zugestellt) t.zugestellt = v.zugestellt;
    await ctx.sp.instanzAendern(i.id, (x) => { const e = Object.assign({ mails: [] }, x.eingang); e.test = Object.assign({}, e.test, { status: t.status, zugestellt: t.zugestellt || null }); x.eingang = e; }).catch(() => false);
  }
  const ohneWebhook = !ctx.k.instanzen.webhook;
  return { da: true, code: t.code, zeit: t.zeit, status: t.status || '', ok: t.status === 'zugestellt' || (t.status === 'gesendet' && ohneWebhook), ohneWebhook: ohneWebhook };
}

/* ---------- Ampel „Live“ (Bauplan C.5): jede Vorbedingung sichtbar ---------- */
const markeGleich = (e, mk) => !e || JSON.stringify([e.name || '', e.titel || '', e.beschreibung || '', String(e.farbe || '').toLowerCase(), e.start || {}, e.bilder || {}]) === JSON.stringify([mk.name || '', mk.titel || '', mk.beschreibung || '', String(mk.farbe || '').toLowerCase(), mk.start || {}, mk.bilder || {}]);
export async function ampel(ctx, i, b, hosts) {
  const m = merkmaleVon(i), haupt = (hosts || []).find((h) => h.haupt), mk = i.marke || {}, v = (b && b.vorschau) || {};
  const recht = rechtVollstaendig(i.recht || {}), test = await testStand(ctx, i), zdStripe = !!(ctx.zd && ctx.zd.art === 'stripe'), kI = (ctx.k && ctx.k.instanzen) || {};
  const pruef = (haupt && haupt.pruefung) || {};
  const punkte = [
    b ? { id: 'bezahlt', text: 'Einrichtung bezahlt', ok: ['bezahlt'].includes((b.zahlung || {}).status), hinweis: (b.zahlung || {}).status === 'laeuft' ? 'Lastschrift unterwegs' : '' } : null,
    { id: 'domain', text: 'Domain verbunden und geprüft', ok: !!(haupt && pruef.ok), hinweis: !haupt ? 'noch keine Domain' : pruef.zeit ? (pruef.ok ? '' : (pruef.fehler || []).join('; ')) : 'noch nicht geprüft' },
    { id: 'recht', text: 'Rechtsangaben vollständig', ok: recht.ok, hinweis: recht.ok ? '' : 'fehlt: ' + recht.fehlt.join(', ') },
    { id: 'eingang', text: 'Eingangsadresse bestätigt', ok: ((i.eingang || {}).mails || []).some((x) => x && x.bestaetigt), hinweis: ((i.eingang || {}).mails || []).length ? 'Bestätigungslink noch nicht geklickt' : 'keine Adresse' },
    m.gestaltung === 'eigen' ? { id: 'gestaltung', text: 'Gestaltung veröffentlicht', ok: Number(mk.v) >= 1, hinweis: Number(mk.v) >= 1 ? (markeGleich(i.entwurf, mk) ? '' : 'Entwurf hat Änderungen, die noch nicht veröffentlicht sind') : 'noch nicht veröffentlicht' } : null,
    { id: 'test', text: 'Testanfrage zugestellt', ok: test.ok, hinweis: !test.da ? 'noch keine geschickt' : test.ok ? (test.ohneWebhook ? 'gesendet (ohne Zustellbestätigung, RESEND_WEBHOOK_SECRET fehlt)' : '') : 'Stand: ' + (test.status || 'offen') },
    b ? { id: 'freigabe', text: 'Freigabe der aktuellen Vorschau oder Vermerk', ok: !!(v.version && v.freigabe && v.freigabe.version === v.version && Number(v.version) === Number(mk.v)), vermerk: true, hinweis: !v.version ? 'Vorschau noch nicht gesendet' : Number(v.version) !== Number(mk.v) ? 'Vorschau zeigt Fassung ' + v.version + ', veröffentlicht ist ' + (mk.v || 0) + ': neu senden' : v.aenderung && v.aenderung.version === v.version && !(v.freigabe && v.freigabe.version === v.version) ? 'Änderung gewünscht' : !(v.freigabe && v.freigabe.version === v.version) ? 'wartet auf den Kunden' : '' } : null,
    b ? { id: 'zahlungsmittel', text: 'Zahlungsmittel für das Abo hinterlegt', ok: !!((b.zahlung || {}).pm) || !zdStripe, hinweis: (b.zahlung || {}).pm ? '' : zdStripe ? 'keins aus der Einrichtung' : 'Testmodus' } : null,
    m.dashboard ? { id: 'zugang', text: 'Dashboard-Zugang bestätigt', ok: (Array.isArray(i.zugang) ? i.zugang : []).some((x) => x && x.bestaetigt && !x.aus), hinweis: (i.zugang || []).length ? 'Bestätigungslink noch nicht geklickt' : 'kein Zugang' } : null,
    /* Hinweise, die Live nicht sperren (ok: true, warn: true; die Zentrale zeigt sie gelb mit „Hinweis“): Der neutrale Absender bei Signature ist
       nach Bauplan §4 optional (zweite Domain), die anwaltliche Prüfung der Rechtsvorlage sperrt nur die Paket-Kasse (paketVerkaufStand in recht.js) */
    m.absender === 'neutral' ? { id: 'absender', text: 'Neutraler Absender ohne eeziframes (MAIL_ABSENDER_NEUTRAL)', ok: true, warn: !kI.neutral, hinweis: kI.neutral ? '' : 'nicht eingerichtet; Mails an den Betrieb kommen von ' + (kI.absender || (ctx.k && ctx.k.post && ctx.k.post.absender) || 'MAIL_ABSENDER') } : null,
    !VORLAGE.geprueft ? { id: 'vorlage', text: 'Rechtsvorlage der Instanzen anwaltlich geprüft', ok: true, warn: true, hinweis: 'Vorlage vom ' + standText(VORLAGE.stand) + ', Prüfung ausstehend; die Paket-Kasse bleibt im Live-Modus zu' } : null
  ].filter(Boolean);
  punkte.forEach((p) => { if (p.ok && !p.warn && !/Entwurf hat|ohne Zustellbestätigung/.test(p.hinweis || '')) p.hinweis = ''; });
  return { punkte: punkte, bereit: punkte.every((p) => p.ok), fehlt: punkte.filter((p) => !p.ok).map((p) => p.id), test: test };
}

/* ---------- Nächster Schritt (Hauptknopf) ---------- */
export function schrittVon(b, i, hosts, a) {
  const haupt = (hosts || []).find((h) => h.haupt), m = i ? merkmaleVon(i) : P().merkmale((b.abo && P().gueltig(b.abo.paket)) ? b.abo.paket : b.paket_bestellt) || {}, v = b.vorschau || {}, mk = (i && i.marke) || {};
  const fehlt = a ? a.punkte.filter((p) => !p.ok).map((p) => p.text + (p.hinweis ? ' (' + p.hinweis + ')' : '')) : [];
  switch (b.status) {
    case 'offen': return { aktion: '', text: (b.zahlung || {}).status === 'laeuft' ? 'Lastschrift unterwegs' : 'Wartet auf die Zahlung', fehlt: [] };
    case 'bezahlt': return { aktion: 'einrichtung', text: 'Einrichtung beginnen', fehlt: [] };
    case 'einrichtung':
      if (!i) return { aktion: 'instanz', text: 'Instanz anlegen', fehlt: [] };
      if (!haupt) return { aktion: 'domain', text: 'Domain verbinden', fehlt: ['Noch keine Domain an der Instanz'] };
      if (!(haupt.pruefung || {}).ok) return { aktion: 'domain', text: 'Domain verbinden', fehlt: ['Domain-Prüfung noch nicht grün: ' + (((haupt.pruefung || {}).fehler || []).join('; ') || 'noch nicht geprüft')], neben: 'domain-gesichert' };
      return { aktion: 'domain-gesichert', text: 'Domain gesichert', fehlt: [] };
    case 'domain':
      if (m.gestaltung === 'eigen' && !(Number(mk.v) >= 1)) return { aktion: 'gestaltung', text: 'Gestaltung veröffentlichen', fehlt: ['Noch keine veröffentlichte Gestaltung'] };
      return { aktion: 'vorschau', text: 'Vorschau senden', fehlt: [] };
    case 'freigabe': {
      const frei = v.freigabe && v.freigabe.version === v.version && Number(v.version) === Number(mk.v);
      const aend = v.aenderung && v.aenderung.version === v.version && !frei;
      if (Number(v.version) !== Number(mk.v)) return { aktion: 'vorschau', text: 'Vorschau erneut senden', fehlt: ['Die Vorschau zeigt Fassung ' + (v.version || 0) + ', veröffentlicht ist ' + (mk.v || 0)] };
      return { aktion: 'live', text: 'Live schalten', fehlt: fehlt, bereit: !!(a && a.bereit), aenderung: aend ? v.aenderung.text || '' : '', wartet: !frei };
    }
    case 'pausiert': return { aktion: (b.abo_status === 'beendet' || !(b.abo && b.abo.id)) ? 'abo-neu' : 'fortsetzen', text: (b.abo_status === 'beendet' || !(b.abo && b.abo.id)) ? 'Abo neu starten' : 'Fortsetzen', fehlt: [] };
    default: return { aktion: '', text: '', fehlt: [] };
  }
}

/* ---------- Sicht einer Instanz für die Zentrale ---------- */
async function kennzahlen(sp, ids8, tage) {
  const out = {}; ids8.forEach((x) => { out[x] = { aufruf: 0, start: 0, anfrage: 0, ki: 0, foto: 0 }; });
  if (!sp.statistikAuswerten) return out;
  const bis = tagBerlin(), von = tagPlus(bis, -((tage || 30) - 1));
  const rows = await sp.statistikAuswerten(von, bis).catch(() => null);
  (rows || []).forEach((r) => { const m = /^inst:([0-9a-f]{8}):(aufruf|start|anfrage|ki|foto)$/.exec(r.schluessel || ''); if (m && !r.tag && out[m[1]]) out[m[1]][m[2]] += Number(r.anzahl) || 0; });
  return out;
}
const basisFuer = (ctx, host) => (!host ? '' : lokal(ctx.url) ? ctx.url.protocol + '//' + host + (ctx.url.port ? ':' + ctx.url.port : '') : 'https://' + host);
export async function instanzSicht(ctx, i, o) {
  o = o || {};
  const sp = ctx.sp, m = merkmaleVon(i);
  const [hosts, b, row, anfragen, kz] = await Promise.all([sp.hostsVon(i.id).then((x) => x || []), bestellungVon(ctx, i), sp.betriebHolen(i.betrieb).catch(() => null), o.ohneVersand ? null : sp.anfragenVonBetrieb(i.betrieb, { kopf: true }).catch(() => []), o.ohneKennzahlen ? null : kennzahlen(sp, [id8Von(i.id)])]);
  const haupt = hosts.find((h) => h.haupt), a = await ampel(ctx, i, b, hosts), d = (row && row.daten) || {};
  const wunsch = (b && b.wunsch) || {}, k = wunsch.konfigurator || {};
  return {
    id: i.id, id8: id8Von(i.id), slug: i.slug, paket: i.paket, paketName: (P().PAKETE[i.paket] || {}).name || i.paket, status: i.status, demo: !!i.demo, indexierung: !!i.indexierung,
    version: i.version, marke: i.marke || {}, entwurf: i.entwurf || null, abweichung: i.abweichung || {}, m: m,
    eingang: { mails: ((i.eingang || {}).mails || []).map((x) => ({ mail: x.mail, bestaetigt: x.bestaetigt || null, eingeladen: x.eingeladen || null })), absendername: (i.eingang || {}).absendername || '' },
    zugang: (Array.isArray(i.zugang) ? i.zugang : []).map((x) => ({ mail: x.mail, name: x.name || '', rolle: x.rolle || 'team', bestaetigt: x.bestaetigt || null, eingeladen: x.eingeladen || null, zuletzt: x.zuletzt || null, aus: !!x.aus, angemeldet: !!x.uid })),
    recht: i.recht || {}, rechtStand: rechtVollstaendig(i.recht || {}),
    profil: { einladung: d.einladung || {}, ap: d.ap || '', tel: d.tel || '', mail: d.mail || '' }, name: (i.marke && i.marke.name) || (row && row.name) || '',
    pause_seit: i.pause_seit || null, pause_bis: i.pause_bis || null, ende_am: i.ende_am || null, created_at: i.created_at, updated_at: i.updated_at, betrieb: i.betrieb,
    hosts: hosts.map((h) => ({ host: h.host, haupt: !!h.haupt, status: h.status, weg: h.weg, pruefung: h.pruefung || {}, registrar: h.registrar || {}, url: basisFuer(ctx, h.host) + '/' })),
    haupthost: haupt ? haupt.host : '', url: haupt ? basisFuer(ctx, haupt.host) + '/' : '',
    cloudflare: !!cloudflareDienst(ctx.k, ctx.env), anleitung: anleitung(haupt ? haupt.host : (k.domains || [])[0] || ''),
    bestellung: b ? { id: b.id, nr: b.nr, status: b.status, abo_status: b.abo_status, paket_bestellt: b.paket_bestellt, domains: k.domains || [], vorschlaege: !!k.vorschlaege, dateien: (b.dateien || []).map((x) => ({ id: x.id, art: x.art, name: x.name, typ: x.typ, bytes: x.bytes })), gestaltung: wunsch.gestaltung || {}, vorschau: b.vorschau || {}, abo: { id: !!(b.abo && b.abo.id), monat: (b.abo || {}).monat || 0 } } : null,
    ampel: a, schritt: b ? schrittVon(b, i, hosts, a) : null,
    versand: (anfragen || []).slice(0, 60).map((z) => { const v = z.versand || {}; return { code: z.code, nr: z.nr || '', art: z.art, eingegangen: z.eingegangen_at || null, status: v.status || '', versuche: v.versuche || 0, naechster: v.naechster || null, zugestellt: v.zugestellt || null, gesendet: v.gesendet || null, ohneFotos: !!v.ohneFotos, pdf: v.pdf || '', runde: v.runde || 1 }; }),
    kennzahlen: kz ? kz[id8Von(i.id)] : null,
    zweiFaktor: !!ctx.k.zentrale.totp
  };
}

/* ---------- Entwurf säubern (gleiche Form wie instanzen.marke; Bilder setzt nur bildAblegen) ---------- */
function entwurfAus(body, alt) {
  const e = body && typeof body === 'object' ? body : {}, a = alt && typeof alt === 'object' ? alt : {}, G = R().GRENZEN;
  const farbe = String(e.farbe === undefined ? a.farbe || '' : e.farbe || '').trim().toLowerCase();
  if (farbe && !/^#[0-9a-f]{6}$/.test(farbe)) throw new ApiFehler('Bitte eine Farbe als #rrggbb angeben.', 400, { feld: 'farbe' });
  const st = e.start && typeof e.start === 'object' ? e.start : a.start || {};
  return Object.assign({}, a, {
    name: str(e.name === undefined ? a.name : e.name, 80), titel: str(e.titel === undefined ? a.titel : e.titel, G.titel), beschreibung: str(e.beschreibung === undefined ? a.beschreibung : e.beschreibung, 300), farbe: farbe,
    start: { kicker: str(st.kicker, 60), ueberschrift: str(st.ueberschrift, 120), text: text(st.text, G.begruessung) }, bilder: a.bilder || {}
  });
}
const RECHT_FELDER = { firma: 120, rechtsform: 60, vertretung: 200, strasse: 120, plz: 10, ort: 80, land: 2, tel: 40, mail: 120, register: 160, ust: 14, kammer: 160, beruf: 160, bundesland: 2 };
function rechtAus(body, alt) {
  const r = body && typeof body === 'object' ? body : {}, out = Object.assign({}, alt || {});
  Object.keys(RECHT_FELDER).forEach((f) => { if (r[f] !== undefined) out[f] = str(r[f], RECHT_FELDER[f]); });
  out.mail = String(out.mail || '').toLowerCase(); out.land = out.land === 'AT' ? 'AT' : 'DE'; out.ust = String(out.ust || '').replace(/\s/g, '').toUpperCase();
  if (out.mail && !R().mailOk(out.mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse für das Impressum angeben.', 400, { feld: 'mail' });
  if (out.bundesland && !R().BUNDESLAENDER[out.bundesland]) throw new ApiFehler('Unbekanntes Bundesland.', 400, { feld: 'bundesland' });
  out.stand = tagBerlin(); delete out.quelle;
  return out;
}
/* Entwurf aus der veröffentlichten Marke beginnen: Werte und Bilder (instanz/<id>/<v>/… nach instanz/<id>/entwurf/…) */
async function entwurfBeginnen(ctx, i) {
  if (i.entwurf) return i;
  const mk = i.marke || {}, ab = ablage(ctx.k, 'marke'), bilder = {};
  const namen = Object.keys(mk.bilder || {}).filter((k) => k !== 'start').map((k) => [k, mk.bilder[k]]).concat(((mk.bilder || {}).start || []).map((n) => ['start', n]));
  for (const [k, n] of namen) {
    if (!ab || !mk.v || !/^[a-z0-9-]+\.(png|jpg|jpeg|webp)$/.test(String(n))) continue;
    const u = await ab.holen('instanz/' + i.id + '/' + mk.v + '/' + n).catch(() => null);
    if (!u || !(await ab.ablegen('instanz/' + i.id + '/entwurf/' + n, u, bildTyp(u)))) continue;
    if (k === 'start') (bilder.start = bilder.start || []).push(n); else bilder[k] = n;
  }
  await V.instanzAendern(ctx, i.id, (z) => { if (z.entwurf) return false; z.entwurf = Object.assign(entwurfAus({}, z.marke || {}), { bilder: bilder }); });
  return laden(ctx, i.id);
}
const b64Bytes = (s) => { const t = String(s || '').replace(/^data:[^,]*,/, ''); if (!/^[A-Za-z0-9+/]*={0,2}$/.test(t) || !t) throw new ApiFehler('Das Bild ist nicht lesbar.', 400); const bin = atob(t), u = new Uint8Array(bin.length); for (let j = 0; j < bin.length; j++) u[j] = bin.charCodeAt(j); return u; };

/* Status einer Instanz: mit Bestellung über bestellung.js (Abo und Bestellung folgen), ohne direkt (Demo) */
async function statusAendern(ctx, i, aktion, grund, bis) {
  const b = await bestellungVon(ctx, i);
  if (b) {
    if (aktion === 'pausieren') { if (b.abo && b.abo.id && b.abo_status !== 'beendet') await aboSteuern(ctx, b.id, 'aussetzen', { text: grund }); else await uebergang(ctx, b.id, 'pausiert', { wer: 'inhaber', text: grund, grund: 'inhaber' }); }
    else if (aktion === 'fortsetzen') { if (b.abo && b.abo.id && b.abo_status === 'ausgesetzt') await aboSteuern(ctx, b.id, 'fortsetzen', { text: grund }); else if (b.abo && b.abo.id && b.abo_status !== 'beendet') await uebergang(ctx, b.id, 'live', { wer: 'inhaber', text: grund || 'Fortgesetzt' }); else throw new ApiFehler('Das Abo läuft nicht mehr. Bitte in der Bestellung „Abo neu starten“.', 409, { fehlt: 'abo' }); }
    else if (aktion === 'beenden') { if (b.abo && b.abo.id && b.abo_status !== 'beendet') await aboSteuern(ctx, b.id, 'beenden', { text: grund }); else await uebergang(ctx, b.id, 'beendet', { wer: 'inhaber', text: grund }); }
  } else await V.instanzStatus(ctx, i.id, { pausieren: 'pausiert', fortsetzen: 'aktiv', beenden: 'beendet' }[aktion], grund, { bis: bis });
  if (aktion === 'pausieren' && bis) await V.instanzAendern(ctx, i.id, (z) => { const max = jetztAus(ctx.env) + R().FRISTEN.pauseMaxTage * TAG, t = Date.parse(bis); if (!isNaN(t)) z.pause_bis = new Date(Math.min(t, max)).toISOString(); });
}

const sichtNeu = async (ctx, id) => ({ ok: true, instanz: await instanzSicht(ctx, await laden(ctx, id)) });

export const ZENTRALE_INSTANZEN = {
  'GET /api/zentrale/instanzen': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx);
    const alle = await sp.instanzenAlle().catch(() => undefined);
    if (!Array.isArray(alle)) return { ok: true, tabelle: false, instanzen: [] };
    const kz = await kennzahlen(sp, alle.map((i) => id8Von(i.id)));
    const best = new Map((((await sp.bestellungenListe({}).catch(() => [])) || [])).map((b) => [b.id, b]));
    const liste = await jeEintrag(alle.slice(0, 500), async (i) => {
      const hosts = (await sp.hostsVon(i.id).catch(() => [])) || [], h = hosts.find((x) => x.haupt), b = i.bestellung ? best.get(i.bestellung) || null : null;
      return ({ id: i.id, id8: id8Von(i.id), slug: i.slug, name: (i.marke && i.marke.name) || i.slug, paket: i.paket, paketName: (P().PAKETE[i.paket] || {}).name || i.paket, status: i.status, demo: !!i.demo,
        haupthost: h ? h.host : '', domainOk: !!(h && h.pruefung && h.pruefung.ok), version: (i.marke || {}).v || 0, bestellung: b ? { id: b.id, nr: b.nr, status: b.status } : null, kennzahlen: kz[id8Von(i.id)], updated_at: i.updated_at });
    });
    return { ok: true, tabelle: true, instanzen: liste, cloudflare: !!cloudflareDienst(ctx.k, ctx.env) };
  },
  /* Instanz ohne Bestellung (Demo der Verkaufsseite, Bauplan §4): Anfragen gehen an MAIL_KONTAKT, nach einem Tag weg */
  'POST /api/zentrale/instanzen': async (ctx) => {
    await zugang(ctx); daten(ctx);
    const b = ctx.body || {}, paket = String(b.paket || ''), name = str(b.name, 80), slug = String(b.slug || '').trim().toLowerCase();
    if (!P().gueltig(paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400, { feld: 'paket' });
    if (name.length < 2) throw new ApiFehler('Bitte einen Namen angeben.', 400, { feld: 'name' });
    const demo = b.demo !== false, plz = ANBIETER.ort.slice(0, 5);
    const recht = demo ? { firma: ANBIETER.name, rechtsform: 'Einzelunternehmen', vertretung: ANBIETER.name, strasse: ANBIETER.strasse, plz: plz, ort: ANBIETER.ort.replace(/^\d{5}\s*/, ''), land: 'DE', tel: ANBIETER.telefon, mail: ANBIETER.mail, bundesland: 'NW', stand: tagBerlin() } : {};
    const i = await V.instanzAnlegen(ctx, { slug: slug, paket: paket, name: name, plz: plz, demo: demo, eingang: [], zugang: [], recht: recht, entwurf: { name: name }, betriebDaten: { ap: demo ? ANBIETER.name : '', tel: demo ? ANBIETER.telefon : '', mail: demo ? ANBIETER.mail : '' } });
    if (!merkmaleVon(i).logo) await V.markeVeroeffentlichen(ctx, i.id); // ohne eigene Gestaltung trägt die Marke nur den Namen
    await protokoll(ctx.sp, 'instanz', null, 'Instanz ' + i.slug + ' ohne Bestellung angelegt' + (demo ? ' (Demo)' : ''), { instanz: i.id });
    return sichtNeu(ctx, i.id);
  },
  'GET /api/zentrale/instanzen/:id': async (ctx) => { await zugang(ctx); return sichtNeu(ctx, ctx.params.id); },

  /* ---------- Domains ---------- */
  'POST /api/zentrale/instanzen/:id/host': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    await mitCode(ctx, 'domain');
    await V.hostSetzen(ctx, i.id, String(b.host || ''), b.haupt === undefined ? {} : { haupt: !!b.haupt });
    return sichtNeu(ctx, i.id);
  },
  'POST /api/zentrale/instanzen/:id/host/entfernen': async (ctx) => { await zugang(ctx); const i = await laden(ctx, ctx.params.id); await mitCode(ctx, 'domain'); await V.hostEntfernen(ctx, i.id, String((ctx.body || {}).host || '')); return sichtNeu(ctx, i.id); },
  'POST /api/zentrale/instanzen/:id/host/haupt': async (ctx) => { await zugang(ctx); const i = await laden(ctx, ctx.params.id); await mitCode(ctx, 'domain'); await V.hauptSetzen(ctx, i.id, String((ctx.body || {}).host || '')); return sichtNeu(ctx, i.id); },
  'POST /api/zentrale/instanzen/:id/domain/verbinden': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {}, host = String(b.host || '').toLowerCase();
    if (!((await ctx.sp.hostsVon(i.id)) || []).some((h) => h.host === host)) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
    await mitCode(ctx, 'domain');
    const r = await domainVerbinden(ctx, i, host, { zoneAnlegen: !!b.zoneAnlegen, stoerendeLoeschen: !!b.stoerendeLoeschen });
    const p = r.ok ? await domainPruefen(ctx, i, host) : null;
    await protokoll(ctx.sp, 'instanz', i.betrieb, 'Domain ' + host + ' über Cloudflare ' + (r.ok ? 'verbunden' : 'nicht verbunden (' + r.schritt + ')'), { instanz: i.id, host: host });
    return Object.assign(await sichtNeu(ctx, i.id), { ergebnis: r, pruefung: p });
  },
  'POST /api/zentrale/instanzen/:id/domain/zone': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), host = String((ctx.body || {}).host || '').toLowerCase();
    if (!((await ctx.sp.hostsVon(i.id)) || []).some((h) => h.host === host)) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
    await mitCode(ctx, 'domain');
    const r = await zoneAnlegen(ctx, i, host);
    await protokoll(ctx.sp, 'instanz', i.betrieb, 'Zone ' + r.zone.name + (r.neu ? ' angelegt' : ' gefunden'), { instanz: i.id, host: host });
    return Object.assign(await sichtNeu(ctx, i.id), { ergebnis: r });
  },
  'POST /api/zentrale/instanzen/:id/domain/pruefen': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    const p = await domainPruefen(ctx, i, String(b.host || '').toLowerCase(), { manuell: b.manuell === true });
    return Object.assign(await sichtNeu(ctx, i.id), { pruefung: p });
  },
  'POST /api/zentrale/instanzen/:id/domain/loesen': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), host = String((ctx.body || {}).host || '').toLowerCase();
    await mitCode(ctx, 'domain');
    const r = await domainLoesen(ctx, i, host);
    await protokoll(ctx.sp, 'instanz', i.betrieb, 'Domain ' + host + ' gelöst' + (r.autoRenew === false ? ', Auto-Verlängerung aus' : ''), { instanz: i.id, host: host });
    return Object.assign(await sichtNeu(ctx, i.id), { ergebnis: r });
  },
  /* Registrar von Hand (woanders gekaufte Domain): Anbieter und Ablaufdatum für die Warnung FRISTEN.domainWarnTage vorher */
  'POST /api/zentrale/instanzen/:id/domain/registrar': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {}, host = String(b.host || '').toLowerCase();
    const h = ((await ctx.sp.hostsVon(i.id)) || []).find((x) => x.host === host); if (!h) throw new ApiFehler('Diese Domain gehört nicht zu dieser Instanz.', 404);
    const ablauf = String(b.ablauf || ''); if (ablauf && !/^\d{4}-\d{2}-\d{2}$/.test(ablauf)) throw new ApiFehler('Bitte das Ablaufdatum als Tag angeben.', 400, { feld: 'ablauf' });
    await ctx.sp.hostAendern(host, { registrar: Object.assign({}, h.registrar || {}, { anbieter: str(b.anbieter, 60) || 'extern', ablauf: ablauf ? ablauf + 'T00:00:00Z' : null, autoRenew: !!b.autoRenew, gewarnt: null }) });
    return sichtNeu(ctx, i.id);
  },

  /* ---------- Gestaltung ---------- */
  'POST /api/zentrale/instanzen/:id/entwurf': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), m = merkmaleVon(i), e0 = (ctx.body || {}).entwurf || {};
    if (m.gestaltung !== 'eigen' && (e0.farbe || e0.titel || e0.start)) throw new ApiFehler('Dieses Paket hat keine eigene Gestaltung.', 409);
    await entwurfBeginnen(ctx, i);
    await V.instanzAendern(ctx, i.id, (z) => { z.entwurf = entwurfAus(e0, z.entwurf); });
    return sichtNeu(ctx, i.id);
  },
  'POST /api/zentrale/instanzen/:id/bild': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {}, m = merkmaleVon(i), name = String(b.name || '').toLowerCase();
    if (m.gestaltung !== 'eigen') throw new ApiFehler('Dieses Paket hat keine eigene Gestaltung.', 409);
    const schl = name.replace(/\.[a-z]+$/, '');
    if (/^start-(\d)$/.test(schl) && Number(schl.slice(6)) > (Number(m.fotos) || 0)) throw new ApiFehler('Dieses Paket hat höchstens ' + (Number(m.fotos) || 0) + ' Fotos.', 400);
    if (b.entfernen) {
      await entwurfBeginnen(ctx, i);
      await V.instanzAendern(ctx, i.id, (z) => { const e = Object.assign({}, z.entwurf || {}), bi = Object.assign({}, e.bilder || {}); if (/^start-\d$/.test(schl)) bi.start = (bi.start || []).filter((x) => x.replace(/\.[a-z]+$/, '') !== schl); else delete bi[schl]; e.bilder = bi; z.entwurf = e; });
      return sichtNeu(ctx, i.id);
    }
    const bytes = b64Bytes(b.daten);
    await entwurfBeginnen(ctx, i);
    await V.bildAblegen(ctx, i.id, name, bytes, bildTyp(bytes));
    return sichtNeu(ctx, i.id);
  },
  /* Bild des Entwurfs (oder der veröffentlichten Fassung) für die Vorschau in der Zentrale; nie als Seite, nie zwischengespeichert */
  'GET /api/zentrale/instanzen/:id/bild/:name': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), name = String(ctx.params.name || '').toLowerCase();
    if (!/^(logo|icon32|icon180|icon192|icon512|og|ap|start-[1-6])\.(png|jpg|jpeg|webp)$/.test(name)) throw new ApiFehler('Unbekanntes Bild.', 404);
    const ab = ablage(ctx.k, 'marke'); if (!ab) throw new ApiFehler('Die Bildablage ist nicht eingerichtet.', 503);
    const v = ctx.url.searchParams.get('v'), pfad = 'instanz/' + i.id + '/' + (v && /^\d{1,6}$/.test(v) ? v : 'entwurf') + '/' + name;
    const u = await ab.holen(pfad); if (!u) throw new ApiFehler('Dieses Bild gibt es nicht.', 404);
    return new Response(u, { status: 200, headers: { 'content-type': bildTyp(u) || 'application/octet-stream', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; sandbox" } });
  },
  'POST /api/zentrale/instanzen/:id/veroeffentlichen': async (ctx) => {
    await zugang(ctx); const i = await entwurfBeginnen(ctx, await laden(ctx, ctx.params.id));
    const r = await V.markeVeroeffentlichen(ctx, i.id);
    return Object.assign(await sichtNeu(ctx, i.id), { v: (r.marke || {}).v });
  },
  'POST /api/zentrale/instanzen/:id/profil': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    await V.profilSetzen(ctx, i.id, b.einladung || {}, { ap: b.ap, tel: b.tel, mail: b.mail });
    return sichtNeu(ctx, i.id);
  },

  /* ---------- Recht, Empfänger, Zugänge ---------- */
  'POST /api/zentrale/instanzen/:id/recht': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id);
    await V.instanzAendern(ctx, i.id, (z) => { z.recht = rechtAus((ctx.body || {}).recht, z.recht); });
    return sichtNeu(ctx, i.id);
  },
  /* { mails } setzt die Liste (bestätigte bleiben bestätigt, neue bekommen den Link); { erneut: mail } schickt den Link noch einmal */
  'POST /api/zentrale/instanzen/:id/eingang': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    if (b.erneut) { await V.empfaengerEinladen(ctx, i.id, String(b.erneut), 'eingang'); return sichtNeu(ctx, i.id); }
    const neu = (Array.isArray(b.mails) ? b.mails : []).map((x) => String(x || '').trim().toLowerCase()).filter(Boolean);
    if (!neu.length) throw new ApiFehler('Mindestens eine Adresse für die Anfragen.', 400, { feld: 'eingang' });
    await V.instanzAendern(ctx, i.id, (z) => { const e = Object.assign({ mails: [] }, z.eingang), alt = e.mails || []; e.mails = neu.map((mail) => alt.find((x) => x.mail === mail) || { mail: mail, bestaetigt: null, eingeladen: null }); z.eingang = e; });
    return sichtNeu(ctx, i.id);
  },
  'POST /api/zentrale/instanzen/:id/zugang': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {}, m = merkmaleVon(i), mail = String(b.mail || '').trim().toLowerCase(), aktion = String(b.aktion || '');
    if (!m.dashboard) throw new ApiFehler('Dieses Paket hat kein Dashboard.', 409);
    if (!R().mailOk(mail)) throw new ApiFehler('Keine gültige E-Mail-Adresse.', 400, { feld: 'mail' });
    if (aktion === 'erneut') { await V.empfaengerEinladen(ctx, i.id, mail, 'zugang'); return sichtNeu(ctx, i.id); }
    await V.instanzAendern(ctx, i.id, (z) => {
      const l = Array.isArray(z.zugang) ? z.zugang.slice() : [], e = l.find((x) => x.mail === mail);
      if (aktion === 'anlegen') { if (e) throw new ApiFehler('Diese Adresse hat schon einen Zugang.', 409); if (l.length >= (Number(m.zugaenge) || 0)) throw new ApiFehler('Dieses Paket hat höchstens ' + m.zugaenge + ' Zugänge.', 400); l.push({ mail: mail, name: str(b.name, 80), rolle: l.length ? 'team' : 'inhaber', uid: null, bestaetigt: null, zuletzt: null, aus: false }); }
      else if (!e) throw new ApiFehler('Diesen Zugang gibt es nicht.', 404);
      else if (aktion === 'aus' || aktion === 'an') e.aus = aktion === 'aus';
      else if (aktion === 'loeschen') l.splice(l.indexOf(e), 1);
      else throw new ApiFehler('Unbekannte Aktion.', 400);
      z.zugang = l;
    });
    return sichtNeu(ctx, i.id);
  },

  /* ---------- Testanfrage, Versand ---------- */
  'POST /api/zentrale/instanzen/:id/test': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id);
    if (!((i.eingang || {}).mails || []).some((x) => x.bestaetigt) && !i.demo) throw new ApiFehler('Erst eine Eingangsadresse bestätigen lassen: Anfragen gehen nur an bestätigte Adressen.', 409, { fehlt: 'eingang' });
    if (!((await ctx.sp.hostsVon(i.id)) || []).some((h) => h.haupt)) throw new ApiFehler('Erst eine Domain eintragen: Die Mail verlinkt auf die Instanz.', 409, { fehlt: 'domain' });
    const r = await probeEingang(ctx, i.id), v = r.versand || {};
    await ctx.sp.instanzAendern(i.id, (z) => { const e = Object.assign({ mails: [] }, z.eingang); e.test = { code: r.code, zeit: new Date(jetztAus(ctx.env)).toISOString(), status: v.status || '', zugestellt: v.zugestellt || null }; z.eingang = e; });
    await protokoll(ctx.sp, 'instanz', i.betrieb, 'Testanfrage an die Eingangsadressen von ' + i.slug + ' (' + (v.status || 'offen') + ')', { instanz: i.id, code: r.code });
    return Object.assign(await sichtNeu(ctx, i.id), { test: { code: r.code, status: v.status || '' } });
  },
  'POST /api/zentrale/instanzen/:id/anfragen/:code/erneut': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), code = String(ctx.params.code || '');
    const z = await ctx.sp.anfrageHolen(code); if (!z || z.instanz !== i.id) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
    const r = await eingangErneut(ctx, code);
    await protokoll(ctx.sp, 'instanz_versand', i.betrieb, 'Anfrage ' + (z.nr || code) + ' erneut gesendet (' + ((r.versand || {}).status || '') + ')', { instanz: i.id, code: code });
    return Object.assign(await sichtNeu(ctx, i.id), { versand: r.versand });
  },

  /* ---------- Betrieb ---------- */
  /* Live ohne Bestellung (Demo); mit Bestellung schaltet die Bestellung live (zentrale-bestellungen.js: Abo, Mail mit Schnipsel) */
  'POST /api/zentrale/instanzen/:id/live': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id);
    if (i.bestellung) throw new ApiFehler('Diese Instanz gehört zu einer Bestellung: bitte dort „Live schalten“ (startet das Abo).', 409, { bestellung: i.bestellung });
    const a = await ampel(ctx, i, null, (await ctx.sp.hostsVon(i.id)) || []);
    const fehlt = a.punkte.filter((p) => !p.ok && !(i.demo && ['eingang', 'test', 'zugang'].includes(p.id)));
    if (fehlt.length) throw new ApiFehler('Noch nicht bereit: ' + fehlt.map((p) => p.text).join(', ') + '.', 409, { fehlt: fehlt.map((p) => p.id) });
    await V.instanzStatus(ctx, i.id, 'aktiv', 'Live geschaltet (ohne Bestellung)');
    return sichtNeu(ctx, i.id);
  },
  'POST /api/zentrale/instanzen/:id/status': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {}, aktion = String(b.aktion || ''), grund = str(b.grund, 300);
    if (!['pausieren', 'fortsetzen', 'beenden'].includes(aktion)) throw new ApiFehler('Unbekannte Aktion.', 400);
    if (aktion !== 'fortsetzen' && grund.length < (aktion === 'beenden' ? 10 : 3)) throw new ApiFehler(aktion === 'beenden' ? 'Bitte einen Vermerk mit mindestens 10 Zeichen angeben.' : 'Bitte einen Grund angeben.', 400, { feld: 'grund' });
    if (aktion === 'beenden') await mitCode(ctx, 'beenden');
    const bis = b.bis && /^\d{4}-\d{2}-\d{2}$/.test(String(b.bis)) ? String(b.bis) + 'T23:59:59Z' : null;
    await statusAendern(ctx, i, aktion, grund, bis);
    await protokoll(ctx.sp, 'instanz', i.betrieb, 'Instanz ' + i.slug + ': ' + aktion + (grund ? ' (' + grund + ')' : ''), { instanz: i.id });
    return sichtNeu(ctx, i.id);
  },
  'POST /api/zentrale/instanzen/:id/paket': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    if (!P().gueltig(b.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
    const r = await paketWechseln(ctx, i.id, b.paket, { differenz: !!b.differenz, wer: 'inhaber' });
    return Object.assign(await sichtNeu(ctx, i.id), { wechsel: { paket: r.paket, posten: !!r.posten } });
  },
  'POST /api/zentrale/instanzen/:id/schalter': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    await V.instanzAendern(ctx, i.id, (z) => { if (typeof b.demo === 'boolean') z.demo = b.demo; if (typeof b.indexierung === 'boolean') z.indexierung = b.indexierung; });
    return sichtNeu(ctx, i.id);
  },
  /* Alle Daten jetzt löschen: nur beendete Instanzen und Demos (sonst der tägliche Lauf 30 Tage nach dem Ende) */
  'POST /api/zentrale/instanzen/:id/loeschen': async (ctx) => {
    await zugang(ctx); const i = await laden(ctx, ctx.params.id), b = ctx.body || {};
    if (i.status !== 'beendet' && !i.demo) throw new ApiFehler('Löschen geht erst nach dem Ende (oder bei einer Demo).', 409);
    if (String(b.bestaetigung || '').trim().toLowerCase() !== i.slug) throw new ApiFehler('Zur Bestätigung bitte die Kennung genau eintippen.', 400, { feld: 'bestaetigung' });
    await mitCode(ctx, 'loeschen');
    for (const h of (await ctx.sp.hostsVon(i.id)) || []) { const reg = h.registrar || {}; if (reg.domain_ids && (reg.domain_ids.apex || reg.domain_ids.www) && !reg.geloest) await domainLoesen(ctx, i, h.host).catch(() => false); }
    const r = await V.instanzDatenLoeschen(ctx, i.id);
    if (i.bestellung) await ctx.sp.bestellungAendern(i.bestellung, (z) => { (z.verlauf = z.verlauf || []).push({ zeit: new Date(jetztAus(ctx.env)).toISOString(), art: 'geloescht', von: 'inhaber', text: 'Instanzdaten von Hand gelöscht' }); }).catch(() => false);
    await protokoll(ctx.sp, 'instanz', null, 'Instanz ' + i.slug + ' von Hand gelöscht', { instanz: i.id, ergebnis: r });
    return { ok: true, geloescht: i.slug, ergebnis: r };
  }
};

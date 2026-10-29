/* eeziframes · Vermittlung „Angebote aus deiner Nähe“, Stufe 1 (docs/VERMITTLUNG.md, Abschnitt 10)
   Der Hauseigentümer plant in der App, wählt am Ende bis zu drei Fensterbetriebe aus seiner Nähe (von einer KI gesucht), bestätigt seine
   Telefonnummer per Code und schickt ab. Der Inhaber sieht die Anfrage in der Zentrale, ruft die Betriebe an und schickt das Aufmaßblatt
   per Mail nur an die, die im Gespräch zugestimmt haben (§ 7 UWG: keine Mail an einen Betrieb ohne Zustimmung).
   Öffentliche Routen (nur auf der Hauptdomain):
     POST /api/vermittlung/suche  { plz, ort }   → { ok, betriebe: [{ id, name, ort, km, leistungen }], umkreis, quelle }
                                                 quelle: 'ki' | 'zwischenspeicher' | 'attrappe' | 'keine'; Telefon, Website und Straße der
                                                 Betriebe bleiben auf dem Server (Zwischenspeicher je PLZ, 30 Tage)
     POST /api/vermittlung/code   { tel }        → { ok, kanal: 'sms'|'anruf', an: '0171 ••• 4567', token, attrappe? }
                                                 ohne Anbieter und ohne Attrappe { ok, ohneCode: true }
     POST /api/vermittlung/senden { kontakt, plz, betriebe, token, code, einwilligung, aufmass, eckdaten, pdf } → { ok, nr }
   Zentrale (Sitzung des Inhabers, wie /api/inhaber/auftraege):
     GET /api/inhaber/vermittlungen · GET …/:id · GET …/:id/pdf · POST …/:id/betrieb { bid, status, notiz }
     POST …/:id/betrieb-neu { name, ort, tel, web } · POST …/:id/senden { bid, mail, zustimmung: true, kunde } · POST …/:id/stand { stand }
     POST …/:id/notiz { text }
   /api/status: vermittlungStatus(k, env) → { an, suche, sms }. Tageslauf: vermittlungLauf(k) löscht Anfragen und Aufmaßblätter 180 Tage
   nach dem Eingang und abgelaufene Suchen. Teile: vermittlung-suche.js (KI), vermittlung-sms.js (Code), vermittlung-daten.js (Speicher),
   vermittlung-mails.js (Mails). Prüfung: scripts/pruefen-instanzen/31.mjs. */
import { ApiFehler, erlaubt, quelle, ip, netzKurz, hmac, hex, gleich } from './umgebung.js';
import { bremse, budget, budgetStand } from './bremse.js';
import { tokenSignieren, tokenPruefen, sitzungPflicht } from './sitzung.js';
import { postDienst, mailOk } from './post.js';
import { ablage } from './fotos.js';
import { alarmMail } from './ki.js';
import { vermittlungDaten } from './vermittlung-daten.js';
import { sucheArt, kiSuche, attrappeBetriebe, oeffentlich, ortText, betriebId, webText, UMKREIS, MODELL, ZEIT_MS } from './vermittlung-suche.js';
import { smsArt, smsDienst } from './vermittlung-sms.js';
import { inhaberMail, eingangMail, betriebMail, weitergabeMail, eckZeilen, erreichText } from './vermittlung-mails.js';

const MIN = 60000, TAG = 864e5;
export const AUFBEWAHRUNG_TAGE = 180;
const SUCHE_TAGE = 30, LEER_TAGE = 1, GRENZE_90 = 2, MAX_BETRIEBE_ZENTRALE = 12;
export const MAX_PDF = 10000000;
/* Größte Anfrage: das Aufmaßblatt als Base64 (bis 10 MB, also etwa 13,4 Mio. Zeichen) und das Aufmaß; der Verteiler (router.js) lässt
   für /api/vermittlung/senden so viel zu */
export const GROSS_VERMITTLUNG = '/api/vermittlung/senden';
export const MAX_VERMITTLUNG = 14500000;
const MAX_AUFMASS = 800000;
const AUFMASS = /^(AM1|ZF1|FE1|LM1)\.[A-Za-z0-9_-]{8,}$/;
export const STAENDE = { neu: 'Neu', in_arbeit: 'In Arbeit', vermittelt: 'Vermittelt', kein_betrieb: 'Kein Betrieb', erledigt: 'Erledigt' };
export const STATUS = { offen: 'Offen', nicht_erreicht: 'Nicht erreicht', will: 'Will', will_nicht: 'Will nicht' };
const TEL_FEHLER = 'Bitte prüfe deine Telefonnummer. Wir brauchen eine deutsche Handy- oder Festnetznummer mit Vorwahl.';
const ZEIT = () => new Date().toISOString();
const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const jetztVon = (ctx) => ctx.k.jetzt || Date.now();

/* ---------- Telefonnummer: nur deutsche Nummern, auf +49… normalisiert ----------
   Handy (015x, 016x, 017x) bekommt den Code per SMS, alles andere per Anruf. Abgelehnt: Ausland, Sonder- und Servicenummern
   (0137, 0180, 0700, 0800, 0900 …), falsche Länge und offensichtlicher Unsinn: die ganze Nummer nach der 0 als Folge (0123456789,
   0987654321) oder lauter gleiche Ziffern, dazu ein Anschluss aus einer einzigen Ziffer (0171 1111111). Dieselbe Regel wie vmTel in der
   App (web/assets/app.js), damit die App nur in Ausnahmen eine Nummer zurückbekommt (Antwort mit feld: 'tel'). */
const folge = (rest) => /^(\d)\1+$/.test(rest) || '1234567890123456'.includes(rest) || '9876543210987654'.includes(rest);
export function telefon(roh) {
  let s = String(roh == null ? '' : roh).trim();
  if (!s || s.length > 32 || /[^\d\s+()/.\-]/.test(s)) return null;
  let d = s.replace(/[\s()/.\-]/g, '');
  if (/^\+490/.test(d)) d = '+49' + d.slice(4);
  if (/^00490/.test(d)) d = '0049' + d.slice(5);
  let nat;
  if (d.startsWith('+49')) nat = '0' + d.slice(3);
  else if (d.startsWith('0049')) nat = '0' + d.slice(4);
  else if (d.startsWith('+') || d.startsWith('00')) return null;
  else nat = d;
  if (!/^0[1-9]\d+$/.test(nat)) return null;
  const mobil = /^01[567]\d/.test(nat);
  if (mobil ? nat.length < 11 || nat.length > 12 : nat.length < 7 || nat.length > 12) return null;
  if (!mobil && /^0(1|700|800|900|137|138|180|190)/.test(nat)) return null;
  if (folge(nat.slice(1)) || /^(\d)\1{6}$/.test(nat.slice(-7))) return null;
  /* Anzeige: die Gruppen, wie der Kunde sie getippt hat (mit 0 statt +49), sonst Vorwahl grob abgetrennt */
  let anzeige = s.replace(/\(0\)/g, ' ').replace(/[()/.\-]/g, ' ').replace(/^\s*(\+49|0049)\s*/, '0').replace(/\s+/g, ' ').trim();
  if (anzeige.replace(/\D/g, '') !== nat || !/\s/.test(anzeige)) anzeige = nat.slice(0, mobil ? 4 : 5) + ' ' + nat.slice(mobil ? 4 : 5);
  return { e164: '+49' + nat.slice(1), national: nat, anzeige: anzeige, an: nat.slice(0, 4) + ' ••• ' + nat.slice(-4), kanal: mobil ? 'sms' : 'anruf' };
}
const plzOk = (p) => /^\d{5}$/.test(p) && Number(p) >= 1000;

/* ---------- Stand ---------- */
const geheimnis = (k) => (k.sitzung && k.sitzung.geheimnis) || '';
/* an: Datenbank (oder Attrappe), Mailversand, Sitzungsgeheimnis (Code-Token) und Ablage für das Aufmaßblatt sind da */
export const vermittlungAn = (k) => !!(vermittlungDaten(k) && k.post && geheimnis(k) && ablage(k, 'vermittlung'));
export const vermittlungStatus = (k, env) => ({ an: vermittlungAn(k), suche: sucheArt(env), sms: smsArt(env) });
const tagMax = (env) => { const n = Number(env && env.VERMITTLUNG_SUCHE_TAG_MAX); return env && env.VERMITTLUNG_SUCHE_TAG_MAX !== undefined && env.VERMITTLUNG_SUCHE_TAG_MAX !== '' && Number.isFinite(n) ? Math.max(1, n) : 300; };
const kurzHash = async (k, s) => hex(await hmac(geheimnis(k) || 'ohne', s)).slice(0, 20);
const codeHash = async (k, tel, code) => hex(await hmac(geheimnis(k) || 'ohne', 'vcode|' + tel + '|' + code));
/* Zwischenspeicher: 30 Tage, eine leere Suche nur einen Tag */
function gueltig(s, jetzt) {
  const alter = jetzt - (Date.parse(s.created_at) || 0);
  return alter < ((s.betriebe || []).length ? SUCHE_TAGE : LEER_TAGE) * TAG;
}
const keine = (extra) => Object.assign({ ok: true, betriebe: [], umkreis: UMKREIS, quelle: 'keine' }, extra || {});

/* ---------- Suche ---------- */
async function suche(ctx) {
  const b = ctx.body || {}, plz = String(b.plz == null ? '' : b.plz).trim(), ort = ortText(b.ort), q = quelle(ctx.request);
  if (!plzOk(plz)) throw new ApiFehler('Bitte prüfe deine Postleitzahl.', 400, { feld: 'plz' });
  if (!erlaubt('vsuche:' + q, 20, 10 * MIN) || !(await bremse(ctx, 'START', 'vsuche:' + q))) throw new ApiFehler('Zu viele Anfragen. Bitte gleich noch einmal.', 429);
  const d = vermittlungDaten(ctx.k), jetzt = jetztVon(ctx);
  const alt = d ? await d.sucheHolen(plz).catch(() => null) : null;
  if (alt && gueltig(alt, jetzt)) return { ok: true, betriebe: (alt.betriebe || []).map(oeffentlich), umkreis: UMKREIS, quelle: 'zwischenspeicher' };
  const art = sucheArt(ctx.env);
  if (!art) return keine();
  /* neue Suchen kosten Geld: je Anschluss höchstens sechs in der Stunde, dazu das Tagesbudget über alle */
  if (!erlaubt('vsuche-neu:' + q, 6, 60 * MIN)) throw new ApiFehler('Zu viele Suchen. Bitte in einer Stunde noch einmal.', 429);
  const max = tagMax(ctx.env), bu = await budget(ctx, 'vsuche:tag', max, { alarm: Math.max(1, Math.floor(max * 0.8)) });
  if (bu.alarm) { const p = alarmMail(ctx.k, 'Vermittlung: 80 % der KI-Suchen des Tages', 'Heute sind schon ' + bu.stand + ' von höchstens ' + max + ' KI-Suchen nach Fensterbetrieben gelaufen (Variable VERMITTLUNG_SUCHE_TAG_MAX). Darüber zeigt die App bis Mitternacht keine Betriebe; Anfragen gehen als „Betrieb für mich suchen“ weiter.').catch(() => false); if (ctx.waitUntil) ctx.waitUntil(p); else await p; }
  if (!bu.ok) return keine({ grenze: 'tag' });
  const env = ctx.env || {};
  const r = art === 'attrappe' ? { ok: true, quelle: 'attrappe', betriebe: await attrappeBetriebe(), info: {} }
    : await kiSuche({ key: env.ANTHROPIC_API_KEY, modell: env.VERMITTLUNG_MODELL || MODELL, ms: Number(env.VERMITTLUNG_SUCHE_MS) || ZEIT_MS }, plz, ort);
  if (!r.ok) return keine();
  if (d) await d.sucheSetzen(plz, { ort: ort, quelle: r.quelle, betriebe: r.betriebe, info: r.info || {} }).catch(() => false);
  if (ctx.zaehlen) ctx.zaehlen('ereignis:vermittlung_suche');
  return { ok: true, betriebe: r.betriebe.map(oeffentlich), umkreis: UMKREIS, quelle: r.quelle };
}

/* ---------- Code ----------
   6 Ziffern, 10 Minuten; gespeichert wird nichts: Das Token trägt Nummer und HMAC des Codes, unterschrieben mit SITZUNG_GEHEIMNIS
   (sitzung.js, Zweck vcode). Höchstens 3 Codes je Nummer und Tag, Bremse je Anschluss; falsche Codes zählen je Token (höchstens 5). */
async function code(ctx) {
  const t = telefon((ctx.body || {}).tel), q = quelle(ctx.request);
  if (!t) throw new ApiFehler(TEL_FEHLER, 400, { feld: 'tel' });
  if (!(await bremse(ctx, 'OTP', 'vcode:' + q)) || !erlaubt('vcodeip:' + q, 12, 60 * MIN)) throw new ApiFehler('Zu viele Codes in kurzer Zeit. Bitte in ein paar Minuten noch einmal.', 429);
  const dienst = smsDienst(ctx.env);
  if (!dienst) return { ok: true, ohneCode: true, kanal: t.kanal, an: t.an };
  if (!vermittlungAn(ctx.k)) throw new ApiFehler('Die Vermittlung ist hier noch nicht eingerichtet.', 503);
  const bu = await budget(ctx, 'vcode:' + (await kurzHash(ctx.k, 'vtel|' + t.e164)), 3);
  if (!bu.ok) throw new ApiFehler('Für diese Nummer gab es heute schon drei Codes. Bitte versuch es morgen noch einmal.', 429, { feld: 'tel' });
  const c = dienst.art === 'attrappe' ? '123456' : String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
  const token = await tokenSignieren(ctx.k, 'vcode', { t: t.e164, h: await codeHash(ctx.k, t.e164, c) }, 600);
  if (dienst.art !== 'attrappe') { const r = await dienst.senden(t.e164, c, t.kanal); if (!r.ok) throw new ApiFehler(t.kanal === 'sms' ? 'Die SMS ging gerade nicht raus. Bitte gleich noch einmal.' : 'Der Anruf ging gerade nicht raus. Bitte gleich noch einmal.', 502); }
  return Object.assign({ ok: true, kanal: t.kanal, an: t.an, token: token }, dienst.art === 'attrappe' ? { attrappe: true } : {});
}
/* Code gegen das Token prüfen; ohne Anbieter (ohneCode) gilt die Anfrage als „Nummer nicht bestätigt“ */
async function codePruefen(ctx, t, b) {
  if (!smsDienst(ctx.env)) return { bestaetigt: false, tk: '' };
  const token = String(b.token || ''), c = String(b.code == null ? '' : b.code).replace(/\s/g, '');
  if (!token) throw new ApiFehler('Bitte bestätige deine Nummer mit dem Code.', 401, { feld: 'code', neu: true });
  const p = await tokenPruefen(ctx.k, 'vcode', token);
  if (!p) throw new ApiFehler('Der Code ist abgelaufen. Bitte fordere einen neuen an.', 401, { feld: 'code', neu: true, abgelaufen: true });
  if (p.t !== t.e164) throw new ApiFehler('Der Code gehört zu einer anderen Nummer. Bitte fordere einen neuen an.', 401, { feld: 'code', neu: true });
  const tk = await kurzHash(ctx.k, 'vtok|' + token);
  if ((await budgetStand(ctx, 'vfehl:' + tk)) >= 5) throw new ApiFehler('Zu viele falsche Versuche. Bitte fordere einen neuen Code an.', 401, { feld: 'code', neu: true });
  if (!/^\d{6}$/.test(c) || !(await gleich(p.h, await codeHash(ctx.k, t.e164, c)))) { await budget(ctx, 'vfehl:' + tk, Infinity); throw new ApiFehler('Der Code stimmt nicht. Bitte prüfe ihn noch einmal.', 401, { feld: 'code' }); }
  return { bestaetigt: true, tk: tk };
}

/* ---------- Senden ---------- */
function pdfAus(v) {
  const s = String(v == null ? '' : v).replace(/^data:[^,]*,/, '').replace(/\s+/g, '');
  if (s.length < 16 || s.length > Math.ceil(MAX_PDF / 3) * 4 + 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(s)) return null;
  let bin; try { bin = atob(s); } catch (e) { return null; }
  if (bin.length > MAX_PDF || bin.slice(0, 4) !== '%PDF') return null;
  const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes: bytes, b64: s };
}
const b64Aus = (u) => { let t = ''; for (let i = 0; i < u.length; i += 8192) t += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(t); };
const zahl = (v) => { const n = Math.round(Number(v)); return Number.isFinite(n) && n > 0 && n < 1000 ? n : null; };
function eckdatenAus(e) {
  e = e && typeof e === 'object' ? e : {};
  return { fenster: zahl(e.fenster), elemente: zahl(e.elemente), gebaeude: kurz(e.gebaeude, 40), baujahr: kurz(e.baujahr, 20), zeit: kurz(e.zeit, 40), budget: kurz(e.budget, 40), foerdweg: kurz(e.foerdweg, 40) };
}
const erreichAus = (v) => (Array.isArray(v) ? v.slice(0, 6).map((x) => kurz(x, 30)).filter(Boolean).join(', ') : kurz(v, 200));
const verlauf = (z, von, text) => { (z.verlauf = z.verlauf || []).push({ zeit: ZEIT(), von: von, text: text }); if (z.verlauf.length > 200) z.verlauf = z.verlauf.slice(-200); };

async function senden(ctx) {
  const b = ctx.body || {}, q = quelle(ctx.request);
  if (!(await bremse(ctx, 'FORM', 'vsenden:' + q)) || !erlaubt('vsenden:' + q, 20, 60 * MIN)) throw new ApiFehler('Zu viele Anfragen. Bitte in ein paar Minuten noch einmal.', 429);
  if (!vermittlungAn(ctx.k)) throw new ApiFehler('Die Vermittlung ist hier noch nicht eingerichtet.', 503);
  const d = vermittlungDaten(ctx.k), jetzt = jetztVon(ctx), ko = b.kontakt && typeof b.kontakt === 'object' ? b.kontakt : {}, f = {};
  /* Ort: die App schickt das Feld „PLZ und Ort“ ganz; die PLZ steht schon in plz und wird hier abgetrennt (Ort darf dann fehlen) */
  const name = kurz(ko.name, 80), ort = kurz(ko.ort, 80).replace(/^\d{5}[\s,·-]*/, '').replace(/[\s,·-]*\d{5}$/, '').slice(0, 60), mail = kurz(ko.mail, 120).toLowerCase(), plz = String(b.plz == null ? '' : b.plz).trim(), t = telefon(ko.tel);
  if (name.length < 2) f['kontakt.name'] = 'Bitte gib deinen Namen ein.';
  if (!plzOk(plz)) f.plz = 'Bitte prüfe deine Postleitzahl.';
  if (!t) f['kontakt.tel'] = TEL_FEHLER;
  if (mail && !mailOk(mail)) f['kontakt.mail'] = 'Bitte prüfe deine E-Mail-Adresse.';
  const ew = b.einwilligung && typeof b.einwilligung === 'object' ? b.einwilligung : {}, fassung = kurz(ew.fassung, 40), ewText = String(ew.text == null ? '' : ew.text).replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 3000);
  if (!fassung || ewText.length < 20) f.einwilligung = 'Bitte stimme zu, dass die Betriebe dein Aufmaß und deine Kontaktdaten bekommen.';
  const aufmass = String(b.aufmass == null ? '' : b.aufmass).trim();
  if (!AUFMASS.test(aufmass) || aufmass.length > MAX_AUFMASS) f.aufmass = 'Das Aufmaß fehlt. Bitte miss mindestens ein Fenster.';
  const ids = b.betriebe == null ? [] : Array.isArray(b.betriebe) ? b.betriebe : null;
  if (ids && ids.length > 3) f.betriebe = 'Bitte wähle höchstens drei Betriebe.';
  else if (!ids || ids.some((x) => typeof x !== 'string' || !/^b[0-9a-f]{12}$/.test(x)) || new Set(ids).size !== ids.length) f.betriebe = 'Die Auswahl der Betriebe stimmt so nicht. Bitte wähle sie noch einmal.';
  const pdf = pdfAus(b.pdf); if (!pdf) f.pdf = 'Das Aufmaßblatt fehlt oder ist zu groß (höchstens 10 MB).';
  const fk = Object.keys(f);
  /* feld: das erste Feld mit Fehler, wie die App es kennt (tel, name, mail, plz, einwilligung, aufmass, betriebe, pdf) */
  if (fk.length) throw new ApiFehler(fk.length === 1 ? f[fk[0]] : 'Bitte prüfe die markierten Angaben.', 400, { felder: f, feld: fk[0].replace(/^kontakt\./, '') });
  /* gewählte Betriebe aus dem Zwischenspeicher dieser PLZ (mit Telefon und Website für die Zentrale) */
  let gewaehlt = [], suchQuelle = '';
  if (ids.length) {
    const s = await d.sucheHolen(plz);
    gewaehlt = s && gueltig(s, jetzt) ? ids.map((id) => (s.betriebe || []).find((x) => x.id === id)) : [null];
    if (gewaehlt.some((x) => !x)) throw new ApiFehler('Die Auswahl der Betriebe ist nicht mehr aktuell. Bitte such sie noch einmal.', 409, { neuSuchen: true, feld: 'betriebe' });
    suchQuelle = s.quelle || '';
  }
  const c = await codePruefen(ctx, t, b);
  /* höchstens zwei Anfragen je Nummer in 90 Tagen; dasselbe Token zweimal (Doppelklick) liefert die erste Anfrage */
  const frueher = await d.vonTel(t.e164, new Date(jetzt - 90 * TAG).toISOString());
  const schon = c.tk ? frueher.find((x) => (x.meta || {}).token === c.tk) : null;
  if (schon) return { ok: true, nr: schon.nr, schon: true };
  if (frueher.length >= GRENZE_90) throw new ApiFehler('Mit dieser Nummer sind in den letzten 90 Tagen schon zwei Anfragen eingegangen. Mehr geht kostenlos nicht; schreib uns gern, wenn du noch Hilfe brauchst.', 429, { grenze: '90tage', feld: 'tel' });
  const id = uuid(), pfad = 'v/' + id + '.pdf', ab = ablage(ctx.k, 'vermittlung');
  if (!(await ab.ablegen(pfad, pdf.bytes, 'application/pdf'))) throw new ApiFehler('Das Aufmaßblatt ließ sich gerade nicht speichern. Bitte gleich noch einmal.', 502);
  let v;
  try {
    v = await d.anlegen({ id: id, tel: t.e164, plz: plz, stand: 'neu', kunde: { name: name, ort: ort, tel: t.e164, anzeige: t.anzeige, kanal: t.kanal, mail: mail, erreich: erreichAus(ko.erreich) },
      eckdaten: eckdatenAus(b.eckdaten), aufmass: aufmass, einwilligung: { fassung: fassung, text: ewText, zeit: ZEIT(), netz: netzKurz(ip(ctx.request)) },
      betriebe: gewaehlt.map((x) => ({ id: x.id, name: x.name, ort: x.ort, strasse: x.strasse || '', tel: x.tel || '', web: x.web || '', km: x.km, leistungen: x.leistungen || [], quelle: suchQuelle || 'ki', gewaehlt: true, status: 'offen', notiz: '', mail: '', zustimmung: '', gesendet: null })),
      bestaetigt: c.bestaetigt, pdf: { pfad: pfad, bytes: pdf.bytes.length }, verlauf: [{ zeit: ZEIT(), von: 'kunde', text: 'Anfrage eingegangen' + (gewaehlt.length ? ' für ' + gewaehlt.map((x) => x.name).join(', ') : ', Betrieb für mich suchen') + (c.bestaetigt ? '; Nummer per Code bestätigt' : '; Nummer nicht bestätigt (ohne Code)') }],
      notiz: '', meta: { token: c.tk } });
  } catch (e) { await ab.loeschen([pfad]).catch(() => false); throw e; }
  const post = postDienst(ctx.k), zentrale = ctx.url.origin + '/zentrale/#vermittlung/' + v.id;
  const m = inhaberMail(v, { zentrale: zentrale });
  ctx.waitUntil(post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: mail || undefined, anhaenge: [{ filename: 'Aufmassblatt-' + v.nr + '.pdf', content: pdf.b64, content_type: 'application/pdf' }], idempotenz: 'vermittlung-neu-' + v.id }).catch(() => false));
  if (mail) { const e = eingangMail(v); ctx.waitUntil(post.senden({ an: mail, betreff: e.betreff, html: e.html, antwortAn: post.kontakt, idempotenz: 'vermittlung-eingang-' + v.id }).catch(() => false)); }
  if (ctx.zaehlen) ctx.zaehlen('ereignis:vermittlung');
  return { ok: true, nr: v.nr };
}

/* ---------- Zentrale ---------- */
async function inhaberDaten(ctx) {
  await sitzungPflicht(ctx, 'inhaber');
  const d = vermittlungDaten(ctx.k); if (!d) throw new ApiFehler('Die Datenbank ist hier noch nicht eingerichtet (SUPABASE_URL, SUPABASE_SECRET_KEY).', 503);
  return d;
}
async function eine(ctx, d) {
  const id = String(ctx.params.id || '');
  const v = /^[0-9a-z-]{8,40}$/i.test(id) ? await d.holen(id) : null;
  if (!v) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
  return v;
}
const offen = (v) => (v.betriebe || []).filter((x) => x.status === 'offen' || x.status === 'nicht_erreicht').length;
function zeile(v) {
  const k = v.kunde || {}, l = v.betriebe || [];
  return { id: v.id, nr: v.nr, created_at: v.created_at, updated_at: v.updated_at, name: k.name || '', ort: k.ort || '', plz: v.plz, tel: k.tel || v.tel || '', anzeige: k.anzeige || '', bestaetigt: !!v.bestaetigt, stand: v.stand,
    betriebe: l.length, gewaehlt: l.filter((x) => x.gewaehlt).length, gesendet: l.filter((x) => x.gesendet).length, offen: offen(v), fenster: (v.eckdaten || {}).fenster || null };
}
function sicht(v) {
  const k = v.kunde || {};
  return Object.assign(zeile(v), {
    kunde: { name: k.name || '', ort: k.ort || '', tel: k.tel || '', anzeige: k.anzeige || '', kanal: k.kanal || '', mail: k.mail || '', erreich: erreichText(k.erreich) },
    eckdaten: v.eckdaten || {}, eckZeilen: eckZeilen(v.eckdaten), einwilligung: v.einwilligung || {}, aufmassZeichen: String(v.aufmass || '').length,
    betriebe: (v.betriebe || []).map((x) => ({ id: x.id, name: x.name, ort: x.ort || '', strasse: x.strasse || '', tel: x.tel || '', web: x.web || '', km: x.km == null ? null : x.km, leistungen: x.leistungen || [], quelle: x.quelle || '', gewaehlt: !!x.gewaehlt,
      status: x.status || 'offen', notiz: x.notiz || '', mail: x.mail || '', zustimmung: x.zustimmung || '', gesendet: x.gesendet || null })),
    pdf: !!(v.pdf && v.pdf.pfad), pdfBytes: (v.pdf || {}).bytes || 0, verlauf: (v.verlauf || []).slice(), notiz: v.notiz || '', loeschenAm: new Date(Date.parse(v.created_at) + AUFBEWAHRUNG_TAGE * TAG).toISOString()
  });
}
const statusAus = (s) => { const x = String(s == null ? '' : s).trim().toLowerCase().replace(/[\s-]+/g, '_'); return STATUS[x] ? x : null; };
function betriebVon(v, bid) { const x = (v.betriebe || []).find((y) => y.id === String(bid || '')); if (!x) throw new ApiFehler('Diesen Betrieb gibt es in dieser Anfrage nicht.', 404); return x; }

const INHABER = {
  'GET /api/inhaber/vermittlungen': async (ctx) => {
    const d = await inhaberDaten(ctx), l = await d.alle();
    return { ok: true, neu: l.filter((v) => v.stand === 'neu').length, vermittlungen: l.map(zeile) };
  },
  'GET /api/inhaber/vermittlungen/:id': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d);
    return { ok: true, vermittlung: sicht(v), staende: STAENDE, status: STATUS };
  },
  'GET /api/inhaber/vermittlungen/:id/pdf': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), ab = ablage(ctx.k, 'vermittlung');
    const bytes = v.pdf && v.pdf.pfad && ab ? await ab.holen(v.pdf.pfad) : null;
    if (!bytes) throw new ApiFehler('Das Aufmaßblatt gibt es nicht mehr.', 404);
    return new Response(bytes, { headers: { 'content-type': 'application/pdf', 'content-disposition': (ctx.url.searchParams.get('laden') === '1' ? 'attachment' : 'inline') + '; filename="Aufmassblatt-' + v.nr + '.pdf"', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'x-robots-tag': 'noindex, nofollow' } });
  },
  /* Ergebnis eines Anrufs (offen, nicht erreicht, will, will nicht) und Notiz je Betrieb; der erste Anruf setzt „neu“ auf „in Arbeit“ */
  'POST /api/inhaber/vermittlungen/:id/betrieb': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), b = ctx.body || {}, x = betriebVon(v, b.bid);
    const status = b.status === undefined ? undefined : statusAus(b.status), notiz = b.notiz === undefined ? undefined : String(b.notiz).slice(0, 1000);
    if (status === null) throw new ApiFehler('Unbekannter Status. Erlaubt: offen, nicht erreicht, will, will nicht.', 400, { felder: { status: 'Unbekannter Status.' } });
    const z = await d.aendern(v.id, (z) => {
      const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false;
      if (status !== undefined && status !== y.status) { y.status = status; y.status_zeit = ZEIT(); verlauf(z, 'inhaber', y.name + ': ' + STATUS[status]); if (z.stand === 'neu') z.stand = 'in_arbeit'; }
      if (notiz !== undefined) y.notiz = notiz;
    });
    if (z === false) throw new ApiFehler('Diesen Betrieb gibt es in dieser Anfrage nicht.', 404);
    return { ok: true, vermittlung: sicht(z) };
  },
  /* Weiteren Betrieb eintragen (selbst gefunden oder vom Kunden genannt) */
  'POST /api/inhaber/vermittlungen/:id/betrieb-neu': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), b = ctx.body || {}, f = {};
    const name = kurz(b.name, 80), ort = kurz(b.ort, 60), telRoh = kurz(b.tel, 40), t = telRoh ? telefon(telRoh) : null, webRoh = kurz(b.web, 200), web = webRoh ? webText(webRoh) : '';
    if (name.length < 2) f.name = 'Bitte den Namen des Betriebs eintragen.';
    if (telRoh && !t) f.tel = 'Bitte eine deutsche Telefonnummer mit Vorwahl eintragen.';
    if (webRoh && !web) f.web = 'Bitte eine Website wie https://… eintragen.';
    if (!telRoh && !webRoh) f.tel = 'Bitte Telefon oder Website eintragen.';
    if (Object.keys(f).length) throw new ApiFehler(Object.values(f)[0], 400, { felder: f });
    if ((v.betriebe || []).length >= MAX_BETRIEBE_ZENTRALE) throw new ApiFehler('Mehr als ' + MAX_BETRIEBE_ZENTRALE + ' Betriebe je Anfrage gehen nicht.', 409);
    const id = await betriebId(name, ort || '-');
    if ((v.betriebe || []).some((x) => x.id === id)) throw new ApiFehler('Diesen Betrieb gibt es in der Liste schon.', 409, { felder: { name: 'Gibt es schon.' } });
    const z = await d.aendern(v.id, (z) => {
      (z.betriebe = z.betriebe || []).push({ id: id, name: name, ort: ort, strasse: '', tel: t ? t.anzeige : '', web: web, km: null, leistungen: [], quelle: 'inhaber', gewaehlt: false, status: 'offen', notiz: '', mail: '', zustimmung: '', gesendet: null });
      verlauf(z, 'inhaber', 'Betrieb eingetragen: ' + name + (ort ? ', ' + ort : ''));
    });
    return { ok: true, vermittlung: sicht(z), bid: id };
  },
  /* Aufmaß an einen Betrieb: nur mit Zustimmung im Gespräch (Zeit steht im Verlauf), höchstens drei Betriebe; auf Wunsch eine Mail an den
     Kunden, welcher Betrieb sein Aufmaß hat */
  'POST /api/inhaber/vermittlungen/:id/senden': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), b = ctx.body || {}, x = betriebVon(v, b.bid), f = {};
    const mail = kurz(b.mail, 120).toLowerCase();
    if (b.zustimmung !== true) f.zustimmung = 'Bitte bestätigen Sie, dass der Betrieb im Gespräch zugestimmt hat.';
    if (!mailOk(mail)) f.mail = 'Bitte die E-Mail-Adresse des Betriebs eintragen.';
    if (Object.keys(f).length) throw new ApiFehler(Object.values(f)[0], 400, { felder: f });
    if ((v.betriebe || []).filter((y) => y.gesendet && y.id !== x.id).length >= 3) throw new ApiFehler('Das Aufmaß ging schon an drei Betriebe. Mehr sind nicht erlaubt.', 409);
    const post = postDienst(ctx.k), ab = ablage(ctx.k, 'vermittlung');
    if (!post) throw new ApiFehler('Der Mailversand ist hier noch nicht eingerichtet (MAIL_API_KEY).', 503);
    const bytes = v.pdf && v.pdf.pfad && ab ? await ab.holen(v.pdf.pfad) : null;
    if (!bytes) throw new ApiFehler('Das Aufmaßblatt gibt es nicht mehr.', 410);
    const zeit = ZEIT();
    await d.aendern(v.id, (z) => { const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false; y.zustimmung = zeit; y.mail = mail; if (y.status !== 'will') { y.status = 'will'; y.status_zeit = zeit; } verlauf(z, 'inhaber', 'Zustimmung im Gespräch: ' + y.name + ' möchte die Anfrage per E-Mail an ' + mail); });
    const m = betriebMail(v, x);
    const r = await post.senden({ an: mail, betreff: m.betreff, html: m.html, antwortAn: post.kontakt, anhaenge: [{ filename: 'Aufmassblatt-' + v.nr + '.pdf', content: b64Aus(bytes), content_type: 'application/pdf' }], idempotenz: 'vermittlung-betrieb-' + v.id + '-' + x.id + '-' + mail }).catch(() => ({ ok: false }));
    if (!r || !r.ok) throw new ApiFehler('Die E-Mail ließ sich gerade nicht senden. Bitte gleich noch einmal.', 502);
    const kundeMail = b.kunde === true && (v.kunde || {}).mail ? v.kunde.mail : '';
    const z2 = await d.aendern(v.id, (z) => {
      const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false;
      y.gesendet = { zeit: ZEIT(), mail: mail, zustimmung: zeit };
      verlauf(z, 'inhaber', 'Aufmaß an ' + y.name + ' geschickt (' + mail + ')' + (kundeMail ? '; Kunde per E-Mail informiert' : ''));
      if (['neu', 'in_arbeit', 'kein_betrieb'].indexOf(z.stand) >= 0) z.stand = 'vermittelt';
    });
    if (kundeMail) { const w = weitergabeMail(z2, x); ctx.waitUntil(post.senden({ an: kundeMail, betreff: w.betreff, html: w.html, antwortAn: post.kontakt, idempotenz: 'vermittlung-kunde-' + v.id + '-' + x.id }).catch(() => false)); }
    return { ok: true, vermittlung: sicht(z2) };
  },
  'POST /api/inhaber/vermittlungen/:id/stand': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), stand = String((ctx.body || {}).stand || '');
    if (!STAENDE[stand]) throw new ApiFehler('Unbekannter Stand.', 400);
    const z = stand === v.stand ? v : await d.aendern(v.id, (z) => { z.stand = stand; verlauf(z, 'inhaber', 'Stand: ' + STAENDE[stand]); });
    return { ok: true, vermittlung: sicht(z) };
  },
  'POST /api/inhaber/vermittlungen/:id/notiz': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), text = String((ctx.body || {}).text == null ? '' : ctx.body.text).slice(0, 4000);
    await d.aendern(v.id, (z) => { z.notiz = text; });
    return { ok: true };
  }
};
const OEFFENTLICH = { 'POST /api/vermittlung/suche': suche, 'POST /api/vermittlung/code': code, 'POST /api/vermittlung/senden': senden };
/* Nur auf der Hauptdomain (der Host einer Konfigurator-Instanz kennt diese Routen ohnehin nicht, functions/instanz/seiten.js) */
const nurHaupt = (fn) => (ctx) => { if (ctx.instanz) throw new ApiFehler('not_found', 404); return fn(ctx); };
export const VERMITTLUNG = Object.fromEntries(Object.entries(Object.assign({}, OEFFENTLICH, INHABER)).map(([k, fn]) => [k, nurHaupt(fn)]));

/* ---------- Tageslauf (router.js geplant): Anfrage und Aufmaßblatt 180 Tage nach dem Eingang löschen, alte Suchen weg ---------- */
export async function vermittlungLauf(k) {
  const d = vermittlungDaten(k); if (!d) return { ok: true, ohneDaten: true };
  const jetzt = k.jetzt || Date.now(), ab = ablage(k, 'vermittlung'), out = { ok: true, geloescht: 0, suchen: 0 };
  for (const v of await d.aelterAls(new Date(jetzt - AUFBEWAHRUNG_TAGE * TAG).toISOString())) {
    if (ab) await ab.loeschen([(v.pdf && v.pdf.pfad) || 'v/' + v.id + '.pdf']).catch(() => false);
    await d.loeschen(v.id); out.geloescht++;
  }
  out.suchen = await d.suchenAufraeumen(new Date(jetzt - SUCHE_TAGE * TAG).toISOString()).catch(() => 0);
  return out;
}

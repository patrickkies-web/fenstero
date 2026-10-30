/* eeziframes · Vermittlung „Angebote aus deiner Nähe“, Stufe 1 (docs/VERMITTLUNG.md, Abschnitt 10)
   Der Hauseigentümer plant in der App, wählt am Ende zwei bis fünf Fensterbetriebe aus seiner Nähe (von einer KI gesucht), bestätigt seine
   Telefonnummer per Code und schickt ab. Der Inhaber sieht die Anfrage in der Zentrale, ruft die Betriebe an und schickt das Aufmaßblatt
   per Mail nur an die, die im Gespräch zugestimmt haben (§ 7 UWG: keine Mail an einen Betrieb ohne Zustimmung).
   Öffentliche Routen (nur auf der Hauptdomain):
     POST /api/vermittlung/suche  { plz }        → { ok, betriebe: [{ id, name, ort, km, leistungen }], umkreis, quelle, plz, ort }
                                                 quelle: 'zwischenspeicher' | 'umgebung' | 'ki' | 'attrappe' | 'keine'; Telefon, Website
                                                 und Straße der Betriebe bleiben auf dem Server (Zwischenspeicher je PLZ, 30 Tage;
                                                 Vorrat 180 Tage); ort kommt aus der Tabelle der Postleitzahlen
   Sofort statt warten (Inhaber, 30.10.2026): Die Suche nimmt zuerst die gespeicherten Suchen aller PLZ im Umkreis von 25 km (eigene,
   die der Nachbarn und den Vorrat) und rechnet die Entfernung jedes Betriebs zum Kunden neu (vermittlung-ort.js); erst wenn das
   weniger als drei Betriebe ergibt, sucht die KI neu, knapp und schneller. Der Vorrat (vorratLauf, alle 10 Minuten) füllt ohne Kunden
   Suchen für Stützpunkte über ganz Deutschland, nur mit VERMITTLUNG_VORRAT (Suchen je Tag, Vorgabe 0 = aus).
     POST /api/vermittlung/code   { tel }        → { ok, kanal: 'sms'|'anruf', an: '0171 ••• 4567', token, attrappe? }
                                                 ohne Anbieter und ohne Attrappe { ok, ohneCode: true }
     POST /api/vermittlung/senden { kontakt, plz, betriebe, token, code, einwilligung, aufmass, eckdaten, pdf } → { ok, nr }
   Zentrale (Sitzung des Inhabers, wie /api/inhaber/auftraege):
     GET /api/inhaber/vermittlungen · GET …/:id · GET …/:id/pdf · POST …/:id/betrieb { bid, status, notiz }
     POST …/:id/betrieb-neu { name, ort, tel, web } · POST …/:id/senden { bid, mail, zustimmung: true, kunde } (seit 30.10.2026 „Zugang
     schicken“: Mail mit Link in den Bereich für Fensterbauer, kein Aufmaßblatt und keine Kontaktdaten mehr in der Mail) · POST …/:id/stand
     { stand } · POST …/:id/notiz { text } · POST …/:id/kunde-mail { betreff, text } (Nachricht an den Kunden)
     Register der Betriebe (Lexikon, vermittlung-register.js): GET /api/inhaber/betriebe · GET …/:id · POST …/:id { stand, notiz, mail, plz,
     bereit } · POST /api/inhaber/betriebe/neu-aufbauen · POST …/betriebe/:id/zusammenfuehren { mit } · POST …/vermittlungen/:id/betrieb-trennen { bid } · POST …/vermittlungen/:id/betrieb-zuordnen { bid, register } (Pflege, x.register) · POST /api/inhaber/vermittlung/alles-loeschen { bestaetigung: 'ALLES LÖSCHEN' }
     (Gefahrenbereich: Anfragen samt Aufmaßblättern, Register, Code-Zähler je Nummer; Suchen bleiben)
   Bereich für Fensterbauer (vermittlung-partner.js): GET /api/anfrage/:token, POST …/annehmen, GET /api/konto/anfragen[/:id[/pdf|/kasse]],
   POST /api/konto/anfragen/:id/freischalten, POST /api/konto/partner, POST /api/konto/betrieb. Partner stehen in der Suche vorn.
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
import { sucheArt, kiSuche, attrappeBetriebe, oeffentlich, betriebId, webText, UMKREIS, MAX_BETRIEBE, MODELL, ZEIT_MS } from './vermittlung-suche.js';
import { plzInfo, km as kmZwischen, umkreisPlz, betriebLage, vorratPlz } from './vermittlung-ort.js';
import { smsArt, smsDienst } from './vermittlung-sms.js';
import { inhaberMail, eingangMail, betriebMail, kundeMail, eckZeilen, erreichText } from './vermittlung-mails.js';
import { kaufNachweis } from './eigene.js';
import { registerMerken, registerFuer, registerNeuAufbauen, partnerVorn, STAENDE_BETRIEB, registerAuszug, registerTrennen, registerZuordnen, registerZusammenfuehren, telNorm, webHost } from './vermittlung-register.js';
import { PARTNER, zugangToken, zugangLink, preisInfo, erstesFreiFuer, ZUGANG_TAGE, registerSicht } from './vermittlung-partner.js';
import { daten as kundenDaten } from '../auftrag/daten.js';

const MIN = 60000, TAG = 864e5;
export const AUFBEWAHRUNG_TAGE = 180;
const SUCHE_TAGE = 30, LEER_TAGE = 1, VORRAT_TAGE = 180, NAH_KM = 25, SOFORT_AB = 3, GRENZE_90 = 2, MAX_BETRIEBE_ZENTRALE = 12;
/* Bis zu fünf Betriebe je Anfrage (Inhaber, 29.10.2026: „nicht beschränken, anfangen mit fünf“), mindestens zwei, wenn die Suche so
   viele gefunden hat (sonst gibt es nichts zu vergleichen); das Aufmaß geht höchstens an fünf und, wenn der Kunde gewählt hat, nur an die
   gewählten („Nur die Betriebe, die du auswählst. Sonst niemand.“) */
export const MAX_WAHL = 5, MIN_WAHL = 2;
const ZAHL = ['keinen', 'einen', 'zwei', 'drei', 'vier', 'fünf'];
const KENNUNG = /^[A-Za-z0-9_-]{6,40}$/;
/* Freischaltung des Aufmaßblatts in der App: derselbe Nachweis wie beim Kauf (eigene.js), mit der Anfrage statt der Stripe-Sitzung */
const freischaltung = async (k, kennung, nr, at) => (KENNUNG.test(kennung || '') ? { session: 'vermittlung:' + nr, token: await kaufNachweis(k, kennung, 'vermittlung:' + nr), at: at } : null);
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
/* an: eingeschaltet (VERMITTLUNG=an; lokal mit der Daten-Attrappe von selbst), Datenbank (oder Attrappe), Mailversand,
   Sitzungsgeheimnis (Code-Token) und Ablage für das Aufmaßblatt sind da. Der Schalter, weil online Datenbank, Mail und Sitzung schon
   laufen: ohne ihn ginge die Vermittlung beim Hochladen von selbst an, bevor die Tabellen (schema.sql), der SMS-Anbieter und die
   geprüften Rechtstexte da sind (Inhaber, 29.10.2026: online ja, Vermittlung erst auf sein Zeichen) */
export const vermittlungFrei = (k, env) => !!(k && k.datenAttrappe) || String((env && env.VERMITTLUNG) || '').trim().toLowerCase() === 'an';
export const vermittlungAn = (k, env) => !!(vermittlungFrei(k, env) && vermittlungDaten(k) && k.post && geheimnis(k) && ablage(k, 'vermittlung'));
export const vermittlungStatus = (k, env) => ({ an: vermittlungAn(k, env), suche: sucheArt(env), sms: smsArt(env) });
const tagMax = (env) => { const n = Number(env && env.VERMITTLUNG_SUCHE_TAG_MAX); return env && env.VERMITTLUNG_SUCHE_TAG_MAX !== undefined && env.VERMITTLUNG_SUCHE_TAG_MAX !== '' && Number.isFinite(n) ? Math.max(1, n) : 300; };
const kurzHash = async (k, s) => hex(await hmac(geheimnis(k) || 'ohne', s)).slice(0, 20);
const codeHash = async (k, tel, code) => hex(await hmac(geheimnis(k) || 'ohne', 'vcode|' + tel + '|' + code));
/* Zwischenspeicher: Suchen der Kunden 30 Tage, Vorrat 180 Tage; eine leere Suche einen Tag (im Vorrat 30, nach einem Fehler einen) */
function gueltig(s, jetzt) {
  const alter = jetzt - (Date.parse(s.created_at) || 0), i = s.info || {}, voll = (s.betriebe || []).length > 0;
  return alter < (voll ? (i.vorrat ? VORRAT_TAGE : SUCHE_TAGE) : i.vorrat && !i.fehler ? SUCHE_TAGE : LEER_TAGE) * TAG;
}

/* ---------- Suche ----------
   Betriebe für eine PLZ aus allen gültigen Suchen im Umkreis von NAH_KM: Entfernung jedes Betriebs zum Kunden neu aus seiner PLZ oder
   seinem Ort; ohne beides gilt in der eigenen Suche die Schätzung der KI, in einer Nachbarsuche höchstens Abstand der beiden PLZ plus
   die Schätzung. Nur bis UMKREIS km; ein Betrieb, der in mehreren Suchen steht (gleiche Kennung, Telefonnummer oder Website), zählt
   einmal mit der kürzesten Entfernung. neu: eine eben gelaufene Suche dieser PLZ (statt der gespeicherten).
   → { betriebe (alle, die nächsten zuerst, mit quelle), eigene (die gültige Suche dieser PLZ) } */
async function umgebung(d, plz, jetzt, neu) {
  const lage = plzInfo(plz), liste = lage ? umkreisPlz(plz, NAH_KM) : [plz];
  const zeilen = (d ? await d.suchenFuer(liste).catch(() => []) : []).filter((s) => gueltig(s, jetzt) && !(neu && s.plz === plz)).concat(neu ? [neu] : []);
  const eigene = zeilen.find((s) => s.plz === plz && !(s.info && s.info.fehler)) || null, roh = [];
  for (const s of zeilen) {
    const eigen = s.plz === plz, von = eigen ? null : plzInfo(s.plz);
    for (const b of s.betriebe || []) {
      const p = lage && (plzInfo(b.plz) || (!eigen && betriebLage(b, lage)));
      const e = p ? kmZwischen(lage, p) : eigen || !lage ? Number(b.km) : von ? kmZwischen(lage, von) + Number(b.km) : NaN;
      if (Number.isFinite(e) && e <= UMKREIS) roh.push(Object.assign({}, b, { km: Math.round(e), quelle: s.quelle || 'ki' }));
    }
  }
  roh.sort((a, b) => a.km - b.km || a.name.localeCompare(b.name, 'de'));
  const schon = new Set(), betriebe = [];
  for (const b of roh) {
    const host = String(b.web || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0], tel = String(b.tel || '').replace(/\D/g, '');
    const schluessel = [b.id, tel.length >= 6 ? 't' + tel : '', host ? 'w' + host : ''].filter(Boolean);
    if (schluessel.some((x) => schon.has(x))) continue;
    schluessel.forEach((x) => schon.add(x)); betriebe.push(b);
  }
  /* Partner (Register, Bereitschaft erklärt) auf Platz 1 und 2, vermittlung-register.js */
  return { betriebe: await partnerVorn(d, lage, betriebe), eigene: eigene };
}
/* Eine neue Suche: KI (schnell, wenn ein Kunde wartet) oder Attrappe */
const neueSuche = (env, art, plz, ort, schnell) => (art === 'attrappe' ? attrappeBetriebe().then((l) => ({ ok: true, quelle: 'attrappe', betriebe: l, info: {} }))
  : kiSuche({ key: env.ANTHROPIC_API_KEY, modell: env.VERMITTLUNG_MODELL || MODELL, ms: Number(env.VERMITTLUNG_SUCHE_MS) || ZEIT_MS, schnell: schnell }, plz, ort));

async function suche(ctx) {
  const b = ctx.body || {}, plz = String(b.plz == null ? '' : b.plz).trim(), q = quelle(ctx.request);
  if (!plzOk(plz)) throw new ApiFehler('Bitte prüfe deine Postleitzahl.', 400, { feld: 'plz' });
  if (!erlaubt('vsuche:' + q, 20, 10 * MIN) || !(await bremse(ctx, 'START', 'vsuche:' + q))) throw new ApiFehler('Zu viele Anfragen. Bitte gleich noch einmal.', 429);
  /* Ort aus der Tabelle (die App schickt nur die PLZ); eine PLZ, die es nicht gibt, sucht nicht (kein Geld für Tippfehler) */
  const lage = plzInfo(plz); if (!lage) throw new ApiFehler('Diese Postleitzahl kennen wir nicht. Bitte prüfe sie.', 400, { feld: 'plz' });
  const ort = lage.ort, d = vermittlungDaten(ctx.k), jetzt = jetztVon(ctx);
  const antwort = (l, woher, extra) => Object.assign({ ok: true, betriebe: l.slice(0, MAX_BETRIEBE).map(oeffentlich), umkreis: UMKREIS, quelle: l.length ? woher : 'keine', plz: plz, ort: ort }, extra || {});
  const u = await umgebung(d, plz, jetzt);
  if (u.eigene || u.betriebe.length >= SOFORT_AB) return antwort(u.betriebe, u.eigene ? 'zwischenspeicher' : 'umgebung');
  const art = sucheArt(ctx.env);
  if (!art) return antwort(u.betriebe, 'umgebung');
  /* neue Suchen kosten Geld: je Anschluss höchstens sechs in der Stunde, dazu das Tagesbudget über alle */
  if (!erlaubt('vsuche-neu:' + q, 6, 60 * MIN)) throw new ApiFehler('Zu viele Suchen. Bitte in einer Stunde noch einmal.', 429);
  const max = tagMax(ctx.env), bu = await budget(ctx, 'vsuche:tag', max, { alarm: Math.max(1, Math.floor(max * 0.8)) });
  if (bu.alarm) { const p = alarmMail(ctx.k, 'Vermittlung: 80 % der KI-Suchen des Tages', 'Heute sind schon ' + bu.stand + ' von höchstens ' + max + ' KI-Suchen nach Fensterbetrieben gelaufen (Variable VERMITTLUNG_SUCHE_TAG_MAX). Darüber zeigt die App bis Mitternacht nur Betriebe aus gespeicherten Suchen der Umgebung; ohne solche gehen Anfragen als „Betrieb für mich suchen“ weiter.').catch(() => false); if (ctx.waitUntil) ctx.waitUntil(p); else await p; }
  if (!bu.ok) return antwort(u.betriebe, 'umgebung', { grenze: 'tag' });
  const r = await neueSuche(ctx.env || {}, art, plz, ort, true);
  if (!r.ok) return antwort(u.betriebe, 'umgebung');
  const neu = { plz: plz, ort: ort, quelle: r.quelle, betriebe: r.betriebe, info: r.info || {} };
  if (d) await d.sucheSetzen(plz, neu).catch(() => false);
  if (ctx.zaehlen) ctx.zaehlen('ereignis:vermittlung_suche');
  return antwort((await umgebung(d, plz, jetzt, neu)).betriebe, r.quelle);
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
  if (!vermittlungAn(ctx.k, ctx.env)) throw new ApiFehler('Die Vermittlung ist hier noch nicht eingerichtet.', 503);
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
  if (!vermittlungAn(ctx.k, ctx.env)) throw new ApiFehler('Die Vermittlung ist hier noch nicht eingerichtet.', 503);
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
  if (ids && ids.length > MAX_WAHL) f.betriebe = 'Bitte wähle höchstens ' + ZAHL[MAX_WAHL] + ' Betriebe.';
  else if (!ids || ids.some((x) => typeof x !== 'string' || !/^b[0-9a-f]{12}$/.test(x)) || new Set(ids).size !== ids.length) f.betriebe = 'Die Auswahl der Betriebe stimmt so nicht. Bitte wähle sie noch einmal.';
  const pdf = pdfAus(b.pdf); if (!pdf) f.pdf = 'Das Aufmaßblatt fehlt oder ist zu groß (höchstens 10 MB).';
  const fk = Object.keys(f);
  /* feld: das erste Feld mit Fehler, wie die App es kennt (tel, name, mail, plz, einwilligung, aufmass, betriebe, pdf) */
  if (fk.length) throw new ApiFehler(fk.length === 1 ? f[fk[0]] : 'Bitte prüfe die markierten Angaben.', 400, { felder: f, feld: fk[0].replace(/^kontakt\./, '') });
  /* gewählte Betriebe aus den gültigen Suchen im Umkreis dieser PLZ, wie die Suche sie gezeigt hat (mit Telefon und Website für die Zentrale) */
  let gewaehlt = [];
  if (ids.length) {
    const l = (await umgebung(d, plz, jetzt)).betriebe;
    gewaehlt = ids.map((id) => l.find((x) => x.id === id));
    if (gewaehlt.some((x) => !x)) throw new ApiFehler('Die Auswahl der Betriebe ist nicht mehr aktuell. Bitte such sie noch einmal.', 409, { neuSuchen: true, feld: 'betriebe' });
    if (ids.length < Math.min(MIN_WAHL, l.length)) { const t = 'Bitte wähle mindestens ' + ZAHL[MIN_WAHL] + ' Betriebe, damit du vergleichen kannst.'; throw new ApiFehler(t, 400, { feld: 'betriebe', felder: { betriebe: t } }); }
  }
  const c = await codePruefen(ctx, t, b);
  /* höchstens zwei Anfragen je Nummer in 90 Tagen; dasselbe Token zweimal (Doppelklick) liefert die erste Anfrage */
  const frueher = await d.vonTel(t.e164, new Date(jetzt - 90 * TAG).toISOString());
  const schon = c.tk ? frueher.find((x) => (x.meta || {}).token === c.tk) : null;
  const kennung = String(b.kennung == null ? '' : b.kennung).trim();
  if (schon) return { ok: true, nr: schon.nr, schon: true, freischaltung: await freischaltung(ctx.k, kennung, schon.nr, Date.parse(schon.created_at) || Date.now()) };
  if (frueher.length >= GRENZE_90) throw new ApiFehler('Mit dieser Nummer sind in den letzten 90 Tagen schon zwei Anfragen eingegangen. Mehr geht kostenlos nicht; schreib uns gern, wenn du noch Hilfe brauchst.', 429, { grenze: '90tage', feld: 'tel' });
  const id = uuid(), pfad = 'v/' + id + '.pdf', ab = ablage(ctx.k, 'vermittlung');
  if (!(await ab.ablegen(pfad, pdf.bytes, 'application/pdf'))) throw new ApiFehler('Das Aufmaßblatt ließ sich gerade nicht speichern. Bitte gleich noch einmal.', 502);
  let v;
  try {
    v = await d.anlegen({ id: id, tel: t.e164, plz: plz, stand: 'neu', kunde: { name: name, ort: ort, tel: t.e164, anzeige: t.anzeige, kanal: t.kanal, mail: mail, erreich: erreichAus(ko.erreich) },
      eckdaten: eckdatenAus(b.eckdaten), aufmass: aufmass, einwilligung: { fassung: fassung, text: ewText, zeit: ZEIT(), netz: netzKurz(ip(ctx.request)) },
      betriebe: gewaehlt.map((x) => ({ id: x.id, name: x.name, ort: x.ort, strasse: x.strasse || '', tel: x.tel || '', web: x.web || '', km: x.km, leistungen: x.leistungen || [], quelle: x.quelle || 'ki', gewaehlt: true, status: 'offen', notiz: '', mail: '', zustimmung: '', gesendet: null })),
      bestaetigt: c.bestaetigt, pdf: { pfad: pfad, bytes: pdf.bytes.length }, verlauf: [{ zeit: ZEIT(), von: 'kunde', text: 'Anfrage eingegangen' + (gewaehlt.length ? ' für ' + gewaehlt.map((x) => x.name).join(', ') : ', Betrieb für mich suchen') + (c.bestaetigt ? '; Nummer per Code bestätigt' : '; Nummer nicht bestätigt (ohne Code)') }],
      notiz: '', meta: { token: c.tk, kennung: KENNUNG.test(kennung) ? kennung : '' } });
  } catch (e) { await ab.loeschen([pfad]).catch(() => false); throw e; }
  const post = postDienst(ctx.k), zentrale = ctx.url.origin + '/zentrale/#vermittlung/' + v.id;
  const m = inhaberMail(v, { zentrale: zentrale });
  ctx.waitUntil(post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: mail || undefined, anhaenge: [{ filename: 'Aufmassblatt-' + v.nr + '.pdf', content: pdf.b64, content_type: 'application/pdf' }], idempotenz: 'vermittlung-neu-' + v.id }).catch(() => false));
  /* Bestätigung an den Kunden mit seinem Aufmaßblatt: auf dem Gratis-Weg gehört es dazu (Nummer bestätigt, Anfrage an bis zu fünf Betriebe) */
  if (mail) { const e = eingangMail(v); ctx.waitUntil(post.senden({ an: mail, betreff: e.betreff, html: e.html, antwortAn: post.kontakt, anhaenge: [{ filename: 'Aufmassblatt-' + v.nr + '.pdf', content: pdf.b64, content_type: 'application/pdf' }], idempotenz: 'vermittlung-eingang-' + v.id }).catch(() => false)); }
  /* die gewählten Betriebe ins Register (Lexikon der Zentrale), im Hintergrund */
  ctx.waitUntil(Promise.all((v.betriebe || []).map((x) => registerMerken(d, v, x, 'Vom Kunden gewählt'))).catch(() => false));
  if (ctx.zaehlen) ctx.zaehlen('ereignis:vermittlung');
  return { ok: true, nr: v.nr, freischaltung: await freischaltung(ctx.k, kennung, v.nr, Date.now()) };
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
      status: x.status || 'offen', notiz: x.notiz || '', mail: x.mail || '', zustimmung: x.zustimmung || '', gesendet: x.gesendet || null, partner: !!x.partner,
      zugang: x.zugang ? { zeit: x.zugang.zeit, mail: x.zugang.mail, geoeffnet: x.zugang.geoeffnet || '', konto: !!x.zugang.konto } : null, freischaltung: x.freischaltung ? { zeit: x.freischaltung.zeit, art: x.freischaltung.art, cent: x.freischaltung.cent || 0 } : null })),
    pdf: !!(v.pdf && v.pdf.pfad), pdfBytes: (v.pdf || {}).bytes || 0, verlauf: (v.verlauf || []).slice(), notiz: v.notiz || '', nachrichten: (v.nachrichten || []).slice(), loeschenAm: new Date(Date.parse(v.created_at) + AUFBEWAHRUNG_TAGE * TAG).toISOString()
  });
}
const statusAus = (s) => { const x = String(s == null ? '' : s).trim().toLowerCase().replace(/[\s-]+/g, '_'); return STATUS[x] ? x : null; };
function betriebVon(v, bid) { const x = (v.betriebe || []).find((y) => y.id === String(bid || '')); if (!x) throw new ApiFehler('Diesen Betrieb gibt es in dieser Anfrage nicht.', 404); return x; }

/* Lexikon-Auszug je Betrieb der Anfrage (Register-Eintrag nach x.register, Kennung oder Alias) */
async function mitRegister(d, sv, v) {
  if (!d.betriebeHolen) return sv;
  try {
    const ids = Array.from(new Set((v.betriebe || []).flatMap((x) => [x.register, x.id].filter(Boolean))));
    const rows = ids.length ? await d.betriebeHolen(ids) : [];
    const finde = (x) => rows.find((r) => x.register && r.id === x.register) || rows.find((r) => r.id === x.id) || rows.find((r) => (r.aliase || []).includes(x.id)) || null;
    sv.betriebe.forEach((b) => { const x = (v.betriebe || []).find((y) => y.id === b.id); b.register = registerAuszug(finde(x || b), x || b); });
  } catch (e) { console.log('Register-Auszug', String(e && e.message ? e.message : e).slice(0, 160)); }
  return sv;
}
const INHABER = {
  'GET /api/inhaber/vermittlungen': async (ctx) => {
    const d = await inhaberDaten(ctx), l = await d.alle();
    return { ok: true, neu: l.filter((v) => v.stand === 'neu').length, vermittlungen: l.map(zeile) };
  },
  'GET /api/inhaber/vermittlungen/:id': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d);
    return { ok: true, vermittlung: await mitRegister(d, sicht(v), v), staende: STAENDE, status: STATUS };
  },
  /* Pflege des Registers aus der Anfrage heraus (Wunsch des Inhabers, 30.10.2026: „zwei unterschiedliche Fensterbau Schmidt“): trennen gibt dem
     Betrieb dieser Anfrage einen eigenen Eintrag, zuordnen hängt ihn an einen bestehenden; beides merkt sich die Anfrage in x.register */
  'POST /api/inhaber/vermittlungen/:id/betrieb-trennen': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), x = (v.betriebe || []).find((y) => y.id === String((ctx.body || {}).bid || ''));
    if (!x) throw new ApiFehler('Diesen Betrieb gibt es in der Anfrage nicht.', 404);
    const neu = await registerTrennen(d, v, x);
    const z = await d.aendern(v.id, (z) => { const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false; y.register = neu.id; verlauf(z, 'inhaber', x.name + ' als eigener Betrieb abgetrennt (Lexikon ' + neu.id + ')'); });
    return { ok: true, vermittlung: await mitRegister(d, sicht(z), z), register: neu.id };
  },
  'POST /api/inhaber/vermittlungen/:id/betrieb-zuordnen': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), b = ctx.body || {}, x = (v.betriebe || []).find((y) => y.id === String(b.bid || ''));
    if (!x) throw new ApiFehler('Diesen Betrieb gibt es in der Anfrage nicht.', 404);
    const ziel = await registerZuordnen(d, v, x, String(b.register || '')); if (!ziel) throw new ApiFehler('Diesen Eintrag gibt es im Register nicht.', 404);
    const z = await d.aendern(v.id, (z) => { const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false; y.register = ziel.id; verlauf(z, 'inhaber', x.name + ' dem Eintrag „' + ziel.name + '“ zugeordnet'); });
    return { ok: true, vermittlung: await mitRegister(d, sicht(z), z), register: ziel.id };
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
    if (status !== undefined && status !== x.status) await registerMerken(d, z, (z.betriebe || []).find((w) => w.id === x.id), 'Anruf: ' + STATUS[status]);
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
    if ((v.betriebe || []).some((x) => x.gewaehlt)) throw new ApiFehler('Der Kunde hat seine Betriebe selbst gewählt. Sein Aufmaß geht nur an diese, weitere Betriebe gibt es hier nicht.', 409);
    if ((v.betriebe || []).length >= MAX_BETRIEBE_ZENTRALE) throw new ApiFehler('Mehr als ' + MAX_BETRIEBE_ZENTRALE + ' Betriebe je Anfrage gehen nicht.', 409);
    const id = await betriebId(name, ort || '-');
    if ((v.betriebe || []).some((x) => x.id === id)) throw new ApiFehler('Diesen Betrieb gibt es in der Liste schon.', 409, { felder: { name: 'Gibt es schon.' } });
    const z = await d.aendern(v.id, (z) => {
      (z.betriebe = z.betriebe || []).push({ id: id, name: name, ort: ort, strasse: '', tel: t ? t.anzeige : '', web: web, km: null, leistungen: [], quelle: 'inhaber', gewaehlt: false, status: 'offen', notiz: '', mail: '', zustimmung: '', gesendet: null });
      verlauf(z, 'inhaber', 'Betrieb eingetragen: ' + name + (ort ? ', ' + ort : ''));
    });
    await registerMerken(d, z, (z.betriebe || []).find((w) => w.id === id), 'In der Zentrale zu einer Anfrage eingetragen');
    return { ok: true, vermittlung: sicht(z), bid: id };
  },
  /* Zugang an einen Betrieb (seit 30.10.2026 statt des Aufmaßblatts per Mail): nur mit Zustimmung im Gespräch (Zeit steht im Verlauf),
     höchstens MAX_WAHL Betriebe und, wenn der Kunde gewählt hat, nur an die gewählten. Die Mail trägt einen Link in den Bereich für
     Fensterbauer (Token, ZUGANG_TAGE); Kontaktdaten und Blatt sieht der Betrieb erst dort nach Code und Freischalten. Hat die Adresse schon
     ein Konto, ist die Anfrage dort sofort da. Auf Wunsch eine Mail an den Kunden, welcher Betrieb seine Anfrage hat */
  'POST /api/inhaber/vermittlungen/:id/senden': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), b = ctx.body || {}, x = betriebVon(v, b.bid), f = {};
    const mail = kurz(b.mail, 120).toLowerCase();
    if (b.zustimmung !== true) f.zustimmung = 'Bitte bestätigen Sie, dass der Betrieb im Gespräch zugestimmt hat.';
    if (!mailOk(mail)) f.mail = 'Bitte die E-Mail-Adresse des Betriebs eintragen.';
    if (Object.keys(f).length) throw new ApiFehler(Object.values(f)[0], 400, { felder: f });
    if ((v.betriebe || []).some((y) => y.gewaehlt) && !x.gewaehlt) throw new ApiFehler('Der Kunde hat andere Betriebe gewählt. Seine Anfrage geht nur an diese.', 409);
    if ((v.betriebe || []).filter((y) => y.gesendet && y.id !== x.id).length >= MAX_WAHL) throw new ApiFehler('Die Anfrage ging schon an ' + ZAHL[MAX_WAHL] + ' Betriebe. Mehr sind nicht erlaubt.', 409);
    const post = postDienst(ctx.k), ab = ablage(ctx.k, 'vermittlung');
    if (!post) throw new ApiFehler('Der Mailversand ist hier noch nicht eingerichtet (MAIL_API_KEY).', 503);
    if (!(v.pdf && v.pdf.pfad && ab)) throw new ApiFehler('Das Aufmaßblatt gibt es nicht mehr.', 410);
    const zeit = ZEIT();
    await d.aendern(v.id, (z) => { const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false; y.zustimmung = zeit; y.mail = mail; if (y.status !== 'will') { y.status = 'will'; y.status_zeit = zeit; } verlauf(z, 'inhaber', 'Zustimmung im Gespräch: ' + y.name + ' möchte die Anfrage (' + mail + ')'); });
    const token = await zugangToken(ctx.k, v, x, mail), link = zugangLink(ctx.url.origin, token), preis = preisInfo(ctx);
    const m = betriebMail(v, x, { link: link, bis: new Date(Date.parse(v.created_at) + ZUGANG_TAGE * TAG).toISOString(), preis: preis.text, erstesFrei: await erstesFreiFuer(d, mail, x.id) });
    const r = await post.senden({ an: mail, betreff: m.betreff, html: m.html, antwortAn: post.kontakt, idempotenz: 'vermittlung-zugang-' + v.id + '-' + x.id + '-' + mail + '-' + Math.floor(Date.now() / 60000) }).catch(() => null);
    if (!r || !r.ok) throw new ApiFehler('Die E-Mail ließ sich gerade nicht senden. Bitte gleich noch einmal.', 502);
    const kd = kundenDaten(ctx.k), konto = kd ? await kd.kundeNachMail(mail).catch(() => null) : null;
    /* den Kunden informiert der Server erst, wenn der Betrieb freischaltet (vermittlung-partner.js, freigeschaltetMail); das frühere Häkchen
       „Kunden per E-Mail sagen“ gibt es nicht mehr, eigene Nachrichten schreibt der Inhaber über kunde-mail */
    const z2 = await d.aendern(v.id, (z) => {
      const y = (z.betriebe || []).find((w) => w.id === x.id); if (!y) return false;
      y.gesendet = { zeit: ZEIT(), mail: mail, zustimmung: zeit, art: 'zugang' };
      y.zugang = Object.assign({ zeit: ZEIT(), mail: mail, geoeffnet: '' }, y.zugang || {}, konto ? { konto: konto.id } : {});
      verlauf(z, 'inhaber', 'Zugang an ' + y.name + ' geschickt (' + mail + ')' + (konto ? '; die Adresse hat schon ein Konto' : ''));
      if (['neu', 'in_arbeit', 'kein_betrieb'].indexOf(z.stand) >= 0) z.stand = 'vermittelt';
    });
    const y = (z2.betriebe || []).find((w) => w.id === x.id);
    const reg = await registerMerken(d, z2, y, 'Zugang geschickt an ' + mail);
    if (reg && konto && !reg.konto) await d.betriebAendern(reg.id, (z) => { z.konto = konto.id; if (!z.mail) z.mail = mail; }).catch(() => null);
    return { ok: true, vermittlung: sicht(z2) };
  },
  /* Nachricht des Inhabers an den Kunden (Abschnitt Kunde in der Zentrale): Betreff und Text frei, geht an die E-Mail des Kunden */
  'POST /api/inhaber/vermittlungen/:id/kunde-mail': async (ctx) => {
    const d = await inhaberDaten(ctx), v = await eine(ctx, d), b = ctx.body || {}, f = {};
    const betreff = kurz(b.betreff, 120), text = String(b.text == null ? '' : b.text).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 4000);
    if (!(v.kunde || {}).mail) throw new ApiFehler('Der Kunde hat keine E-Mail-Adresse angegeben. Bitte rufen Sie ihn an.', 409);
    if (betreff.length < 3) f.betreff = 'Bitte einen Betreff eintragen.';
    if (text.length < 5) f.text = 'Bitte einen Text eintragen.';
    if (Object.keys(f).length) throw new ApiFehler(Object.values(f)[0], 400, { felder: f });
    const post = postDienst(ctx.k); if (!post) throw new ApiFehler('Der Mailversand ist hier noch nicht eingerichtet (MAIL_API_KEY).', 503);
    const m = kundeMail(v, { betreff: betreff, text: text });
    const r = await post.senden({ an: v.kunde.mail, betreff: m.betreff, html: m.html, antwortAn: post.kontakt, idempotenz: 'vermittlung-kundemail-' + v.id + '-' + Date.now() }).catch(() => null);
    if (!r || !r.ok) throw new ApiFehler('Die E-Mail ließ sich gerade nicht senden. Bitte gleich noch einmal.', 502);
    const z = await d.aendern(v.id, (z) => { verlauf(z, 'inhaber', 'Nachricht an den Kunden: „' + betreff + '“'); (z.nachrichten = z.nachrichten || []).push({ zeit: ZEIT(), betreff: betreff, text: text }); if (z.nachrichten.length > 50) z.nachrichten = z.nachrichten.slice(-50); });
    return { ok: true, vermittlung: sicht(z) };
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
  },
  /* Register der Betriebe (Lexikon): Liste mit Zählern, ein Betrieb mit allen Anfragen und Ergebnissen, Stand und Notiz ändern */
  'GET /api/inhaber/betriebe': async (ctx) => {
    const d = await inhaberDaten(ctx), l = await d.betriebeAlle();
    return { ok: true, betriebe: l.map(registerZeile), staende: STAENDE_BETRIEB, preis: preisInfo(ctx) };
  },
  'GET /api/inhaber/betriebe/:id': async (ctx) => {
    const d = await inhaberDaten(ctx), r = await d.betriebHolen(String(ctx.params.id || '')); if (!r) throw new ApiFehler('Diesen Betrieb gibt es im Register nicht.', 404);
    /* zu jeder Anfrage der aktuelle Stand aus der Anfrage selbst */
    const anfragen = [];
    for (const a of (r.anfragen || []).slice().reverse()) { const v = await d.holen(a.id); const x = v ? (v.betriebe || []).find((y) => y.id === r.id || (r.aliase || []).includes(y.id)) : null; anfragen.push(Object.assign({}, a, v ? { stand: v.stand, kunde: (v.kunde || {}).name || '', fenster: (v.eckdaten || {}).fenster || null, status: x ? x.status : a.status, notiz: x ? x.notiz || '' : '', geloescht: false } : { geloescht: true })); }
    return { ok: true, betrieb: Object.assign(registerZeile(r), { strasse: r.strasse || '', mail: r.mail || '', notiz: r.notiz || '', verlauf: (r.verlauf || []).slice(), aliase: r.aliase || [], konto: !!r.konto, anfragen: anfragen }), staende: STAENDE_BETRIEB, status: STATUS, preis: preisInfo(ctx) };
  },
  'POST /api/inhaber/betriebe/:id': async (ctx) => {
    const d = await inhaberDaten(ctx), r = await d.betriebHolen(String(ctx.params.id || '')); if (!r) throw new ApiFehler('Diesen Betrieb gibt es im Register nicht.', 404);
    const b = ctx.body || {}, f = {};
    const stand = b.stand === undefined ? undefined : String(b.stand), notiz = b.notiz === undefined ? undefined : String(b.notiz).slice(0, 4000), mail = b.mail === undefined ? undefined : kurz(b.mail, 120).toLowerCase(), plz = b.plz === undefined ? undefined : kurz(b.plz, 5);
    const angaben = {}; ['name', 'ort', 'strasse', 'tel', 'web'].forEach((f) => { if (b[f] !== undefined) angaben[f] = kurz(b[f], f === 'web' ? 200 : 80); });
    if (angaben.name !== undefined && !angaben.name) f.name = 'Bitte den Namen des Betriebs eintragen.';
    if (angaben.web && !webHost(angaben.web)) f.web = 'Bitte eine Website wie www.betrieb.de eintragen.';
    if (stand !== undefined && !STAENDE_BETRIEB[stand]) f.stand = 'Unbekannter Stand.';
    if (mail !== undefined && mail && !mailOk(mail)) f.mail = 'Bitte eine gültige E-Mail-Adresse.';
    if (plz !== undefined && plz && !/^\d{5}$/.test(plz)) f.plz = 'Bitte eine fünfstellige Postleitzahl.';
    if (Object.keys(f).length) throw new ApiFehler(Object.values(f)[0], 400, { felder: f });
    const z = await d.betriebAendern(r.id, (z) => {
      if (stand !== undefined && stand !== z.stand) { z.stand = stand; if (stand === 'partner') z.partner = Object.assign({ seit: ZEIT(), fassung: 'inhaber' }, z.partner || {}, { bereit: true }); else if (z.partner && z.partner.bereit && stand !== 'partner') z.partner = Object.assign({}, z.partner, { bereit: false, bis: ZEIT() }); verlauf(z, 'inhaber', 'Stand: ' + STAENDE_BETRIEB[stand]); }
      if (notiz !== undefined) z.notiz = notiz;
      if (Object.keys(angaben).length) { Object.assign(z, angaben); z.tel_norm = telNorm(z.tel); z.web_host = webHost(z.web); verlauf(z, 'inhaber', 'Angaben geändert (' + Object.keys(angaben).join(', ') + ')'); }
      if (mail !== undefined) z.mail = mail;
      if (plz !== undefined) z.plz = plz;
    });
    return { ok: true, betrieb: registerZeile(z) };
  },
  'POST /api/inhaber/betriebe/:id/zusammenfuehren': async (ctx) => {
    const d = await inhaberDaten(ctx), z = await registerZusammenfuehren(d, String(ctx.params.id || ''), String((ctx.body || {}).mit || ''));
    if (!z) throw new ApiFehler('Einer der beiden Einträge fehlt, oder es ist derselbe.', 404);
    return { ok: true, betrieb: registerZeile(z) };
  },
  'POST /api/inhaber/betriebe/neu-aufbauen': async (ctx) => { const d = await inhaberDaten(ctx); return Object.assign({ ok: true }, await registerNeuAufbauen(d)); },
  /* Gefahrenbereich der Zentrale: alle Daten der Vermittlung löschen (Testdaten des Inhabers): Anfragen samt Aufmaßblättern, Register der
     Betriebe und die Zähler „drei Codes je Nummer und Tag“; damit fällt auch die Grenze „zwei Anfragen je Nummer in 90 Tagen“, die aus den
     Anfragen gerechnet wird. Die gespeicherten Suchen bleiben (sie kosten Geld und enthalten keine Kundendaten). Nur mit dem Wortlaut
     „ALLES LÖSCHEN“ im Feld bestaetigung. */
  'POST /api/inhaber/vermittlung/alles-loeschen': async (ctx) => {
    const d = await inhaberDaten(ctx), b = ctx.body || {};
    if (String(b.bestaetigung || '').trim() !== 'ALLES LÖSCHEN') throw new ApiFehler('Bitte zur Bestätigung „ALLES LÖSCHEN“ eintragen.', 400, { feld: 'bestaetigung' });
    const r = await d.allesLoeschen(), ab = ablage(ctx.k, 'vermittlung');
    if (ab && r.pfade.length) { for (let i = 0; i < r.pfade.length; i += 100) await ab.loeschen(r.pfade.slice(i, i + 100)).catch(() => false); }
    let zaehler = 0;
    if (ctx.sp && ctx.sp.zaehlerAltLoeschen) zaehler = await ctx.sp.zaehlerAltLoeschen('9999-12-31', 'budget:vcode:').catch(() => 0);
    return { ok: true, anfragen: r.anfragen, betriebe: r.betriebe, blaetter: r.pfade.length, zaehler: zaehler };
  }
};
/* Zeile des Registers für die Zentrale */
function registerZeile(r) {
  return Object.assign(registerSicht(r), { mail: r.mail || '', konto: !!r.konto, notizKurz: String(r.notiz || '').slice(0, 80), anfragenZahl: (r.anfragen || []).length, letzte: (r.anfragen || []).reduce((m, a) => (a.zeit > m ? a.zeit : m), ''), updated_at: r.updated_at, created_at: r.created_at });
}
const OEFFENTLICH = { 'POST /api/vermittlung/suche': suche, 'POST /api/vermittlung/code': code, 'POST /api/vermittlung/senden': senden };
/* Nur auf der Hauptdomain (der Host einer Konfigurator-Instanz kennt diese Routen ohnehin nicht, functions/instanz/seiten.js) */
const nurHaupt = (fn) => (ctx) => { if (ctx.instanz) throw new ApiFehler('not_found', 404); return fn(ctx); };
export const VERMITTLUNG = Object.fromEntries(Object.entries(Object.assign({}, OEFFENTLICH, INHABER, PARTNER)).map(([k, fn]) => [k, nurHaupt(fn)]));

/* ---------- Tageslauf (router.js geplant): Anfrage und Aufmaßblatt 180 Tage nach dem Eingang löschen, alte Suchen weg ---------- */
export async function vermittlungLauf(k) {
  const d = vermittlungDaten(k); if (!d) return { ok: true, ohneDaten: true };
  const jetzt = k.jetzt || Date.now(), ab = ablage(k, 'vermittlung'), out = { ok: true, geloescht: 0, suchen: 0 };
  for (const v of await d.aelterAls(new Date(jetzt - AUFBEWAHRUNG_TAGE * TAG).toISOString())) {
    if (ab) await ab.loeschen([(v.pdf && v.pdf.pfad) || 'v/' + v.id + '.pdf']).catch(() => false);
    await d.loeschen(v.id); out.geloescht++;
  }
  out.suchen = await d.suchenAufraeumen(new Date(jetzt - SUCHE_TAGE * TAG).toISOString(), new Date(jetzt - VORRAT_TAGE * TAG).toISOString()).catch(() => 0);
  return out;
}

/* ---------- Vorrat (router.js geplant, alle 10 Minuten) ----------
   Damit schon der erste Kunde einer Gegend sofort Betriebe sieht, sucht der Server ohne Kunden für die Stützpunkte (vermittlung-ort.js:
   jede PLZ höchstens 20 km von einem, dicht besiedelte zuerst) und speichert die Suche mit info.vorrat für 180 Tage. Je Lauf höchstens
   eine Suche (gründlich), am Tag höchstens VERMITTLUNG_VORRAT (Vorgabe 0 = aus; jede kostet wie eine Suche der Kunden). Ein Stützpunkt
   mit gültiger Suche (Vorrat oder Kunde) wird übersprungen; misslingt eine Suche, kommt der Stützpunkt nach einem Tag wieder dran. */
const vorratJeTag = (env) => { const n = Math.floor(Number(env && env.VERMITTLUNG_VORRAT)); return Number.isFinite(n) && n > 0 ? Math.min(n, 144) : 0; };
export async function vorratLauf(k, env, sp) {
  const n = vorratJeTag(env), art = sucheArt(env), d = vermittlungDaten(k);
  if (!n || !art || !d || !vermittlungFrei(k, env)) return { ok: true, aus: true };
  const jetzt = k.jetzt || Date.now(), stuetz = vorratPlz();
  const da = new Set((await d.suchenStand(stuetz)).filter((s) => gueltig(s, jetzt)).map((s) => s.plz));
  const plz = stuetz.find((p) => !da.has(p));
  if (!plz) return { ok: true, voll: stuetz.length };
  const bu = await budget({ env: env, sp: sp }, 'vvorrat:tag', n);
  if (!bu.ok) return { ok: true, grenze: n, offen: stuetz.length - da.size };
  const ort = plzInfo(plz).ort, r = await neueSuche(env, art, plz, ort, false);
  await d.sucheSetzen(plz, { ort: ort, quelle: r.ok ? r.quelle : 'keine', betriebe: r.ok ? r.betriebe : [], info: Object.assign({}, r.info || {}, { vorrat: true }, r.ok ? {} : { fehler: r.grund || 'fehler' }) });
  return { ok: r.ok, plz: plz, betriebe: r.ok ? r.betriebe.length : 0, offen: stuetz.length - da.size - 1 };
}

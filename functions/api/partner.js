/* eeziframes · Kundenkonto der Fensteranbieter auf eeziframes.com: /api/partner/… (Strang D, Bauplan §3 D; Vertrag docs/INSTANZEN.md)
   Bestellformular und Kundenkonto unter /partner/ (web/assets/partner.js). Nur auf der Hauptdomain; auf dem Host einer Instanz antwortet
   jede Route mit 404 wie eine unbekannte Adresse.

   Anmeldung per E-Mail-Code (Supabase Auth, auth.js), danach eine eigene Sitzung im Cookie __Host-partner (sitzung.js, Bereich „partner“):
   kein Supabase-Token im Browser, das Cookie gilt weder im Betriebsbereich (/api/konto, Bearer) noch auf einem anderen Host. Falsche Codes
   zählen je Adresse dauerhaft (budget „otpfehl:<sha256>“): nach GRENZEN.otpFehlerMailTag Fehlversuchen ist die Anmeldung bis Mitternacht
   gesperrt, und die Adresse bekommt einen Hinweis. Geld-Aktionen (Selbststorno mit Erstattung, Kundenportal von Stripe) verlangen eine
   frische Anmeldung (FRISTEN.frischMinuten), sonst 401 { frisch: true } und das Kundenkonto fragt einen neuen Code ab.

   Routen (alle JSON; Besitz jeder Bestellung wird geprüft, fremde antworten 404):
     POST /api/partner/anmelden { mail }                 Code schicken (Bremse RL_OTP je Anschluss)
     POST /api/partner/bestaetigen { mail, code }        Sitzung setzen; Antwort ohne Token
     POST /api/partner/abmelden
     GET  /api/partner/stand                             öffentlich: Verkauf (PAKETE_OFFEN), Fassung der Paketbedingungen, MwSt.
     GET  /api/partner                                   Sicht: Partner, Bestellungen, ungelesene Nachrichten (ohne Sitzung: angemeldet false)
     POST /api/partner/firma                             Unternehmen, Erreichbarkeit, Impressumsangaben (legt das Kundenkonto an)
     POST /api/partner/bestellungen { paket, konfigurator? }          Entwurf anlegen (höchstens 3 offene)
     PATCH /api/partner/bestellungen/:id { paket?, konfigurator?, gestaltung? }   Wünsche; nach der Zahlung nur Gestaltung bis zur Freigabe
     POST/GET/DELETE /api/partner/bestellungen/:id/datei[/:did]       Uploads (Typ aus der Dateisignatur, Bucket „bestellungen“)
     POST /api/partner/bestellungen/:id/kasse { zustimmung }          „Kostenpflichtig bestellen“: Eingangsbestätigung, Stripe Checkout
     GET  /api/partner/bestellungen/:id/kasse/pruefen?session=        Rückkehr aus der Kasse
     POST /api/partner/bestellungen/:id/anfragen                      Kasse noch zu (vor PAKETE_OFFEN, live): unverbindlich anfragen
     POST /api/partner/bestellungen/:id/stornieren                    offen: Entwurf verwerfen; bezahlt: Storno mit Erstattung (frisch)
     POST /api/partner/bestellungen/:id/freigabe { aktion, version, text }   Vorschau freigeben oder Änderung wünschen
     POST /api/partner/bestellungen/:id/eingang { mails }             Empfänger der Anfragen ändern (neue bestätigen per Link)
     POST /api/partner/bestellungen/:id/paketwechsel { paket, text }  Paketwechsel anfragen (wird eine Nachricht)
     GET  /api/partner/rechnungen · POST /api/partner/portal (frisch) Rechnungen lesen · Kundenportal von Stripe
     GET/POST /api/partner/nachrichten, POST …/gelesen                Nachrichten (20 je Stunde, je höchstens 2000 Zeichen)
     POST /api/partner/rueckruf · DELETE /api/partner/rueckruf/:nid   Rückruf (Werktag in den nächsten 10, Zeitfenster, einer offen)
     POST /api/partner/domain-pruefen { domain }                      unverbindlicher Hinweis: RDAP oder DNS (DoH)
     POST /api/partner/frage                                          Frage ohne Konto (Verkaufsseite), auch als Formular ohne
                                                                     JavaScript; Felder name, firma, mail, tel, paket, text; Honigtopf „fax“ */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import '../../web/assets/modell.js';
import { ApiFehler, json, erlaubt, quelle, ip, netzKurz, hex, live } from './umgebung.js';
import { codeSenden, codePruefen } from './auth.js';
import { sitzungSetzen, sitzungLesen, sitzungPflicht, sitzungLoeschen } from './sitzung.js';
import { bremse, budget, budgetStand } from './bremse.js';
import { PAKET_STAND, paketVerkaufStand, standText } from './recht.js';
import { postDienst, mailRahmen, esc, mailOk } from './post.js';
import { ablage } from './fotos.js';
import { SICHERHEIT, SPERRE } from '../seo.js';
import { empfaengerEinladen, cacheLeeren } from '../instanz/verwalten.js';
import { uebergang, einrichtungUebernehmen, erstatten, eingangBestaetigen, inhaberMail, partnerMail, dateiAntwort, dateiPfad, paketVon, herkunft, schnipsel, markenFarbe } from './bestellung.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const RB = () => globalThis.Instanzregeln.bestellung;
const TAG = 864e5;
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, n || 200);
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const zeilenTab = (z) => '<table role="presentation" style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' + z.filter(Boolean).map((x) => '<tr><td style="padding:4px 14px 4px 0;color:#6e6e73;vertical-align:top">' + esc(x[0]) + '</td><td style="padding:4px 0">' + x[1] + '</td></tr>').join('') + '</table>';
const ZEIT = (ctx) => new Date(ctx.k.jetzt || Date.now()).toISOString();
const sha = async (s) => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s)))));
const mailNorm = (m) => String(m || '').trim().toLowerCase();

/* ---------- Zugang ---------- */
/* Auf dem Host einer Instanz gibt es das Kundenkonto nicht (Positivliste der Instanz, Strang A; hier zur Sicherheit noch einmal) */
const nurHaupt = (ctx) => { if (ctx.instanz) throw new ApiFehler('not_found', 404); };
async function angemeldet(ctx, o) {
  nurHaupt(ctx);
  const s = await sitzungPflicht(ctx, 'partner', o);
  const p = await ctx.sp.partnerNachAuth(s.sub);
  if (p === undefined) throw new ApiFehler('Das Kundenkonto ist gerade nicht eingerichtet (supabase/schema.sql).', 503);
  ctx.sitzung = s; ctx.partner = p;
  return s;
}
async function mitPartner(ctx, o) {
  await angemeldet(ctx, o);
  if (!ctx.partner) throw new ApiFehler('Bitte zuerst die Angaben zu Ihrem Unternehmen ausfüllen.', 409, { firma: true });
  return ctx.partner;
}
async function eigene(ctx, id) {
  const b = await ctx.sp.bestellungHolen(String(id || ''));
  if (!b || b.partner !== ctx.partner.id) throw new ApiFehler('Diese Bestellung gibt es nicht.', 404);
  return b;
}
const merkmaleVon = (b) => P().merkmale(paketVon(b)) || {};
const gestaltet = (m) => !!(m && (m.logo || m.farbe || m.fotos || m.startansicht));
const BIS_FREIGABE = ['offen', 'bezahlt', 'einrichtung', 'domain', 'freigabe'];
const feldFehler = (fehler, text) => new ApiFehler(text || Object.values(fehler)[0] || 'Bitte die markierten Felder prüfen.', 400, { felder: fehler });

/* ---------- Sicht für den Browser (ohne interne Vermerke, ohne Kennungen von Zahlungsmitteln) ---------- */
function partnerSicht(p) {
  const d = p.daten || {};
  return { id: p.id, firma: p.firma, mail: p.mail, plz: p.plz || '', stripe: !!p.stripe_customer, daten: { strasse: d.strasse || '', plz: d.plz || p.plz || '', ort: d.ort || '', bundesland: d.bundesland || '', ust: d.ust || '', web: d.web || '', ap: d.ap || '', rolle: d.rolle || '', tel: d.tel || '', rechtsform: d.rechtsform || '', vertretung: d.vertretung || '', register: d.register || '', kammer: d.kammer || '', beruf: d.beruf || '', erreichbar: d.erreichbar || null } };
}
async function bestellungSicht(ctx, b) {
  const za = b.zahlung || {}, a = b.abo || {}, v = b.vorschau || {};
  let instanz = null;
  if (b.instanz) {
    try {
      const i = await ctx.sp.instanzHolen(b.instanz), hosts = (await ctx.sp.hostsVon(b.instanz)) || [], h = hosts.find((x) => x.haupt) || hosts[0];
      if (i) { const m = P().merkmale(i.paket, i.abweichung) || {}; instanz = { host: h ? h.host : '', status: i.status, paket: i.paket, dashboard: !!m.dashboard, eingang: ((i.eingang || {}).mails || []).map((x) => ({ mail: x.mail, bestaetigt: !!x.bestaetigt })) }; }
    } catch (e) { instanz = null; }
  }
  return {
    id: b.id, nr: b.nr, paket: instanz ? instanz.paket : paketVon(b), paket_bestellt: b.paket_bestellt, status: b.status, abo_status: b.abo_status, preise: b.preise || {},
    wunsch: b.wunsch || {}, dateien: (b.dateien || []).map((d) => ({ id: d.id, art: d.art, name: d.name, typ: d.typ, bytes: d.bytes, zeit: d.zeit })),
    zahlung: { status: za.status || '', betrag_cent: za.betrag_cent || 0, erstattet_cent: za.erstattet_cent || 0, zeit: za.zeit || '', zahlungsmittel: !!za.pm },
    abo: { seit: a.seit || '', bis: a.bis || '', kulanz_bis: a.kulanz_bis || '', ende: a.ende || '', offeneRechnung: a.offeneRechnung || '', kuendigt: !!a.kuendigt, paket: a.paket || '', monat: a.monat || 0, laeuft: !!a.id,
      /* vorgemerkter Wechsel nach unten (wirkt erst zum Periodenende, Befund 10): das Kundenkonto zeigt „Wechsel zu … ab …“ */
      wechsel: a.wechsel && a.wechsel.paket ? { paket: a.wechsel.paket, von: a.wechsel.von || '', ab: a.wechsel.ab || '' } : null },
    vorschau: { version: v.version || 0, bis: v.bis || '', link: v.link || '', gesendet: v.gesendet || '', freigabe: v.freigabe ? { version: v.freigabe.version, zeit: v.freigabe.zeit } : null, aenderung: v.aenderung ? { version: v.aenderung.version, zeit: v.aenderung.zeit } : null },
    zustimmung: b.zustimmung && b.zustimmung.zeit ? { stand: b.zustimmung.stand, zeit: b.zustimmung.zeit } : null,
    verlauf: (b.verlauf || []).filter((x) => x && !x.intern).map((x) => ({ zeit: x.zeit, status: x.status || '', text: x.text || '', von: x.von || '' })),
    instanz: instanz, schnipsel: instanz && instanz.host && b.status === 'live' ? schnipsel(instanz.host, { farbe: await markenFarbe(ctx, b) }) : '', // Knopf in der Firmenfarbe (Befund 18)
    created_at: b.created_at, bezahlt_am: b.bezahlt_am, live_am: b.live_am, pause_seit: b.pause_seit, ende_am: b.ende_am
  };
}
const nachrichtSicht = (n) => ({ id: n.id, von: n.von, art: n.art, text: n.text, bestellung: n.bestellung, rueckruf: n.rueckruf || null, zeit: n.created_at, gelesen: !!n.gelesen_at });
async function sicht(ctx, s) {
  const p = await ctx.sp.partnerNachAuth(s.sub);
  const liste = p ? (await ctx.sp.bestellungenVonPartner(p.id)) || [] : [];
  const nachrichten = p ? (await ctx.sp.nachrichtenVon(p.id, { anzahl: 200 })) || [] : [];
  let betrieb = false; try { betrieb = !!(await ctx.sp.betriebNachAuth(s.sub)); } catch (e) { betrieb = false; }
  const rueckruf = nachrichten.find((n) => n.art === 'rueckruf' && n.von === 'partner' && !(n.rueckruf && n.rueckruf.erledigt));
  return { ok: true, angemeldet: true, mail: s.mail, frisch: !!s.frisch, partner: p ? partnerSicht(p) : null, bestellungen: await Promise.all(liste.map((b) => bestellungSicht(ctx, b))),
    ungelesen: nachrichten.filter((n) => n.von !== 'partner' && !n.gelesen_at).length, rueckruf: rueckruf ? nachrichtSicht(rueckruf) : null, betrieb: betrieb };
}
/* Verkauf: ohne PAKETE_OFFEN vorläufige Preise und im Live-Modus von Stripe keine Kasse (Instanzregeln.verkauf) */
async function verkaufJetzt(ctx) {
  const istLive = live(ctx.k), stand = istLive ? await paketVerkaufStand(ctx.k, ctx.env, ctx.url.origin) : { bereit: true, fehlt: [] };
  return Object.assign(R().verkauf({ offen: ctx.k.paketeOffen, live: istLive, bereit: stand.bereit }), { fehlt: istLive ? stand.fehlt : [] });
}

/* ---------- Dateien: Typ nur aus der Signatur ---------- */
function signatur(bytes) {
  const b = bytes, t = (i, s) => s.split('').every((c, j) => b[i + j] === c.charCodeAt(0));
  if (b.length > 8 && b[0] === 0x89 && t(1, 'PNG') && b[4] === 0x0d && b[5] === 0x0a) return 'image/png';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 12 && t(0, 'RIFF') && t(8, 'WEBP')) return 'image/webp';
  if (b.length > 5 && t(0, '%PDF-')) return 'application/pdf';
  const kopf = new TextDecoder('utf-8', { fatal: false }).decode(b.subarray(0, 1024));
  if (!kopf.includes('\u0000') && /^﻿?\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(kopf)) return 'image/svg+xml';
  return '';
}
/* Was je Art angenommen wird und wie viele; Merkmal des Pakets, sonst gibt es die Art nicht */
const ARTEN = {
  logo: { typen: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'], max: () => 2, merkmal: (m) => m.logo, name: 'Logo' },
  druck: { typen: ['application/pdf', 'image/svg+xml'], max: () => 2, merkmal: (m) => m.logo, name: 'Druckvorlage' },
  foto: { typen: ['image/png', 'image/jpeg', 'image/webp'], max: (m) => Number(m.fotos) || 0, merkmal: (m) => Number(m.fotos) > 0, name: 'Foto' },
  ap: { typen: ['image/png', 'image/jpeg', 'image/webp'], max: () => 1, merkmal: (m) => m.startansicht, name: 'Foto des Ansprechpartners' }
};
const DATEI_NAME = (s) => str(s, 120).replace(/[\\/:*?"<>|]/g, '_').slice(0, 80) || 'datei';
function base64Bytes(s) {
  const t = String(s || '').replace(/^data:[^,]*,/, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(t) || !t) throw new ApiFehler('Die Datei ist nicht lesbar.', 400);
  const bin = atob(t), out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* ---------- Rückruf: Werktage (Mo–Fr) in deutscher Zeit, ab heute die nächsten zehn ---------- */
const FENSTER = ['08-10', '10-12', '12-14', '14-16', '16-18'];
const THEMEN = ['Bestellung und Bezahlung', 'Domain', 'Gestaltung', 'Vorschau und Freigabe', 'Abo und Rechnung', 'Sonstiges'];
function werktage(t, n) {
  const tag = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const out = []; let d = new Date(t);
  for (let i = 0; out.length < n && i < 30; i++, d = new Date(d.getTime() + TAG)) { const w = new Date(tag(d) + 'T12:00:00Z').getUTCDay(); if (w >= 1 && w <= 5) out.push(tag(d)); }
  return out;
}

/* ---------- Domain-Hinweis (unverbindlich): RDAP für Endungen aus dem IANA-Verzeichnis, sonst DNS über DoH ---------- */
const OHNE_RDAP = ['de', 'at', 'ch', 'eu'];
let rdapVerzeichnis = null;
const domainMerk = new Map();
async function holenMitZeit(url, init, ms) {
  const ab = new AbortController(), t = setTimeout(() => ab.abort(), ms || 4000);
  try { return await fetch(url, Object.assign({}, init || {}, { signal: ab.signal })); } finally { clearTimeout(t); }
}
async function rdapBasis(endung) {
  if (!rdapVerzeichnis || rdapVerzeichnis.bis < Date.now()) {
    try { const r = await holenMitZeit('https://data.iana.org/rdap/dns.json', { headers: { accept: 'application/json' } }); const j = r.ok ? await r.json() : null; rdapVerzeichnis = j && Array.isArray(j.services) ? { services: j.services, bis: Date.now() + TAG } : null; } catch (e) { rdapVerzeichnis = null; }
  }
  if (!rdapVerzeichnis) return '';
  const s = rdapVerzeichnis.services.find((x) => Array.isArray(x[0]) && x[0].includes(endung));
  const u = s && Array.isArray(s[1]) ? (s[1].find((x) => /^https:/.test(x)) || s[1][0]) : '';
  return u ? u.replace(/\/?$/, '/') : '';
}
async function domainPruefen(host) {
  const m = domainMerk.get(host); if (m && m.bis > Date.now()) return m.r;
  const endung = host.split('.').pop();
  let r = null;
  if (!OHNE_RDAP.includes(endung)) {
    const basisUrl = await rdapBasis(endung);
    if (basisUrl) { try { const a = await holenMitZeit(basisUrl + 'domain/' + encodeURIComponent(host), { headers: { accept: 'application/rdap+json' } }); if (a.status === 404) r = { stand: 'frei', quelle: 'rdap' }; else if (a.ok) r = { stand: 'vergeben', quelle: 'rdap' }; } catch (e) { r = null; } }
  }
  if (!r) {
    try {
      const a = await holenMitZeit('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(host) + '&type=NS', { headers: { accept: 'application/dns-json' } });
      const j = a.ok ? await a.json() : null;
      r = j && j.Status === 3 ? { stand: 'frei', quelle: 'dns' } : j && j.Status === 0 ? { stand: 'vergeben', quelle: 'dns' } : null;
    } catch (e) { r = null; }
  }
  r = r || { stand: 'unklar', quelle: '' };
  domainMerk.set(host, { r: r, bis: Date.now() + 3600 * 1000 }); if (domainMerk.size > 2000) domainMerk.clear();
  return r;
}
const DOMAIN_TEXT = { frei: 'wahrscheinlich frei', vergeben: 'schon vergeben', unklar: 'gerade nicht prüfbar' };

/* ---------- Frage ohne Konto (Verkaufsseite) ---------- */
/* Vorsatz im Kundenkonto: Das Formular prüft die Adresse nicht; wer sie kennt, könnte sich sonst als Partner ausgeben (Befund 8) */
const FRAGE_VORSATZ = 'Frage über das Formular ohne Anmeldung (Absender nicht bestätigt): ';
async function frageAnnehmen(ctx) {
  const b = ctx.body || {};
  if (!(await bremse(ctx, 'RL_FORM', 'frage:' + quelle(ctx.request)))) throw new ApiFehler('Zu viele Anfragen. Bitte in einer Minute noch einmal.', 429);
  if (str(b.fax, 200)) return { ok: true }; // Honigtopf: Menschen sehen dieses Feld nicht
  const f = {}, name = str(b.name, 80), firma = str(b.firma, 100), mail = mailNorm(b.mail).slice(0, 120), tel = str(b.tel, 40), text = String(b.text == null ? '' : b.text).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, 2000), paket = P().gueltig(b.paket) ? b.paket : '';
  if (name.length < 2) f.name = 'Bitte Ihren Namen eingeben.';
  if (!mailOk(mail) || /\.invalid$/i.test(mail)) f.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
  /* Die Frage ist auf der Seite für Fensterbauer freiwillig („Paket vormerken“): leer heißt Rückmeldung erbeten; ein, zwei Zeichen sind ein Versehen */
  if (text && text.length < 3) f.text = 'Bitte schreiben Sie kurz Ihre Frage.';
  const anliegen = text || (paket ? 'Bitte Paket vormerken und bei mir melden.' : 'Bitte melden Sie sich bei mir.');
  if (Object.keys(f).length) throw feldFehler(f);
  let gespeichert = false;
  /* nie von 'partner': Der Eintrag im Konto ist ein Hinweis des Systems, keine Nachricht des Partners (Zentrale: Badge „System“, Konto: „eeziframes (automatisch)“) */
  try { const p = await ctx.sp.partnerNachMail(mail); if (p) { await ctx.sp.nachrichtAnlegen({ partner: p.id, von: 'system', art: 'frage', text: FRAGE_VORSATZ + anliegen }); gespeichert = true; } } catch (e) { gespeichert = false; }
  const r = await inhaberMail(ctx, 'Frage zu den Paketen: ' + (firma || name), zeilenTab([['Name', esc(name)], ['Firma', esc(firma || '–')], ['E-Mail', esc(mail)], ['Telefon', esc(tel || '–')], ['Paket', esc(paket ? P().PAKETE[paket].name : '–')]]) + absatz(esc(anliegen).replace(/\n/g, '<br>')), mail);
  if (!(r && r.ok) && !gespeichert) throw new ApiFehler('Ihre Frage ließ sich gerade nicht übermitteln. Bitte schreiben Sie uns eine E-Mail (Adresse im Impressum).', 503);
  if (ctx.zaehlen) ctx.zaehlen('ereignis:paket_frage');
  return { ok: true };
}
function frageSeite(titel, inhalt, status) {
  const html = '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>' + esc(titel) + ' | eeziframes</title>' +
    '<link rel="stylesheet" href="/fonts/fonts.css"><link rel="stylesheet" href="/assets/gemeinsam.css"><link rel="stylesheet" href="/assets/partner.css"></head><body class="p-body"><main class="p-seite p-schmal"><p class="eyebrow kicker">Konfigurator-Pakete</p><h1 class="p-titel">' + esc(titel) + '</h1>' + inhalt + '<p><a class="btn primary" href="/fuer-fensterbauer/">Zurück zu den Paketen<span class="pf" aria-hidden="true"></span></a></p></main></body></html>';
  return new Response(html, { status: status || 200, headers: Object.assign({}, SICHERHEIT, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': SPERRE }) });
}

/* ---------- Nachrichten an den Inhaber ---------- */
async function nachrichtAnInhaber(ctx, p, b, betreff, text, extra) {
  return inhaberMail(ctx, betreff + ' · ' + p.firma, zeilenTab([['Firma', esc(p.firma)], ['Telefon', esc((p.daten || {}).tel || '')], ['E-Mail', esc(p.mail)], b ? ['Bestellung', esc(b.nr)] : null].concat(extra || [])) + (text ? absatz(esc(text).replace(/\n/g, '<br>')) : '') +
    absatz('<a href="' + esc(herkunft(ctx) + '/zentrale/' + (b ? '#bestellung/' + b.id : '#bestellungen')) + '">In der Zentrale öffnen</a>'), p.mail);
}
const nachrichtBremse = (ctx, p) => { if (!erlaubt('pnachricht:' + p.id, R().GRENZEN.nachrichtenStunde, 3600 * 1000)) throw new ApiFehler('Zu viele Nachrichten in kurzer Zeit. Bitte in einer Stunde noch einmal oder rufen Sie uns an.', 429); };

export const PARTNER = {
  /* ---------- Anmeldung ---------- */
  'POST /api/partner/anmelden': async (ctx) => {
    nurHaupt(ctx);
    const mail = mailNorm((ctx.body || {}).mail);
    if (!(await bremse(ctx, 'RL_OTP', 'partner:' + quelle(ctx.request)))) throw new ApiFehler('Zu viele Versuche. Bitte in einer Minute noch einmal.', 429);
    if (mailOk(mail) && (await budgetStand(ctx, 'otpfehl:' + (await sha(mail)))) >= R().GRENZEN.otpFehlerMailTag) throw new ApiFehler('Für diese Adresse wurde heute zu oft ein falscher Code eingegeben. Die Anmeldung ist bis Mitternacht gesperrt.', 429, { gesperrt: true });
    const r = await codeSenden(ctx.k, ctx.sp, mail, ctx.url.origin + '/partner/', true);
    if (ctx.zaehlen) ctx.zaehlen('ereignis:partner_code');
    return { ok: true, mail: r.mail };
  },
  'POST /api/partner/bestaetigen': async (ctx) => {
    nurHaupt(ctx);
    const b = ctx.body || {}, mail = mailNorm(b.mail);
    if (!erlaubt('potpv:' + quelle(ctx.request), 15, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const schluessel = 'otpfehl:' + (await sha(mail)), max = R().GRENZEN.otpFehlerMailTag;
    if (mailOk(mail) && (await budgetStand(ctx, schluessel)) >= max) throw new ApiFehler('Für diese Adresse wurde heute zu oft ein falscher Code eingegeben. Die Anmeldung ist bis Mitternacht gesperrt.', 429, { gesperrt: true });
    let s;
    try { s = await codePruefen(ctx.k, ctx.sp, mail, b.code); } catch (e) {
      if (e instanceof ApiFehler && e.status === 401 && mailOk(mail)) {
        const z = await budget(ctx, schluessel, max, { alarm: max });
        if (z.alarm) { const pd = postDienst(ctx.k); if (pd) ctx.waitUntil(pd.senden({ an: mail, betreff: 'Anmeldung gesperrt bis Mitternacht', html: mailRahmen('Anmeldung gesperrt bis Mitternacht', absatz('Guten Tag,') + absatz('für Ihr Kundenkonto bei eeziframes wurde heute ' + max + '-mal ein falscher Anmeldecode eingegeben. Zum Schutz Ihres Kontos ist die Anmeldung mit dieser Adresse bis Mitternacht gesperrt.') + absatz('Waren Sie das nicht, müssen Sie nichts tun: Ohne den Code aus Ihrem Postfach kommt niemand in Ihr Konto. Bei Fragen antworten Sie einfach auf diese E-Mail.'), pd.kontakt), antwortAn: pd.kontakt }).catch(() => false)); }
      }
      throw e;
    }
    /* Konto zur Anmeldung: über die Anmeldung, sonst über die Adresse (die Person hat sie gerade bewiesen) */
    let p = await ctx.sp.partnerNachAuth(s.nutzer.id);
    if (!p) { const q = await ctx.sp.partnerNachMail(s.nutzer.mail); if (q && q.auth_user !== s.nutzer.id) p = await ctx.sp.partnerAendern(q.id, (z) => { z.auth_user = s.nutzer.id; }); }
    if (p) await ctx.sp.partnerAendern(p.id, (z) => { const d = Object.assign({}, z.daten); d.angemeldet = ZEIT(ctx); d.anmeldungen = (Number(d.anmeldungen) || 0) + 1; z.daten = d; }).catch(() => false);
    let betrieb = false; try { betrieb = !!(await ctx.sp.betriebNachAuth(s.nutzer.id)); } catch (e) { betrieb = false; }
    const cookie = await sitzungSetzen(ctx, 'partner', { sub: s.nutzer.id, mail: s.nutzer.mail });
    if (ctx.zaehlen) ctx.zaehlen('ereignis:partner_anmeldung');
    return json({ ok: true, mail: s.nutzer.mail, partner: !!p, betrieb: betrieb }, 200, { 'set-cookie': cookie });
  },
  'POST /api/partner/abmelden': async (ctx) => { nurHaupt(ctx); return json({ ok: true }, 200, { 'set-cookie': sitzungLoeschen(ctx, 'partner') }); },

  /* ---------- Lesen ---------- */
  'GET /api/partner/stand': async (ctx) => {
    nurHaupt(ctx);
    const v = await verkaufJetzt(ctx);
    return { ok: true, verkauf: { offen: v.offen, vorlaeufig: v.vorlaeufig || P().VORLAEUFIG, bestellen: v.bestellen, kasse: v.kasse }, stand: PAKET_STAND, standText: standText(PAKET_STAND), mwst: ctx.k.preise.mwst ? 19 : 0, zahlung: !!ctx.zd, testmodus: !live(ctx.k), werktage: werktage(ctx.k.jetzt || Date.now(), R().FRISTEN.rueckrufWerktage), fenster: FENSTER, themen: THEMEN };
  },
  'GET /api/partner': async (ctx) => {
    nurHaupt(ctx);
    const s = await sitzungLesen(ctx, 'partner');
    if (!s) return { ok: true, angemeldet: false };
    return sicht(ctx, s);
  },

  /* ---------- Unternehmen ---------- */
  'POST /api/partner/firma': async (ctx) => {
    const s = await angemeldet(ctx);
    const r = RB().firma(ctx.body || {});
    if (!r.ok) throw feldFehler(r.fehler);
    const w = r.wert, X = globalThis.Abrechnung, nameNorm = X && X.normFirma ? X.normFirma(w.firma) : w.firma.toLowerCase();
    const daten = (alt) => Object.assign({}, alt || {}, { strasse: w.strasse, plz: w.plz, ort: w.ort, land: 'DE', bundesland: w.bundesland, ust: w.ust, web: w.web, ap: w.ap, rolle: w.rolle, tel: w.tel, rechtsform: w.rechtsform, vertretung: w.vertretung, register: w.register, kammer: w.kammer, beruf: w.beruf, erreichbar: w.erreichbar });
    let p = ctx.partner;
    if (!p) {
      let dup = '';
      try { const alle = (await ctx.sp.partnerAlle()) || []; const d = alle.find((x) => x.name_norm && x.name_norm === nameNorm && String(x.plz || '').slice(0, 2) === w.plz.slice(0, 2)); dup = d ? d.firma : ''; } catch (e) { dup = ''; }
      p = await ctx.sp.partnerAnlegen({ auth_user: s.sub, mail: s.mail, firma: w.firma, plz: w.plz, name_norm: nameNorm, daten: Object.assign(daten({}), { prefs: { mail: true }, seit: ZEIT(ctx), dup: dup || undefined }) });
      if (ctx.zaehlen) ctx.zaehlen('ereignis:partner_konto');
    } else {
      p = await ctx.sp.partnerAendern(p.id, (z) => { z.firma = w.firma; z.plz = w.plz; z.name_norm = nameNorm; z.daten = daten(z.daten); });
      if (p.stripe_customer && ctx.zd) { const q = p; ctx.waitUntil(ctx.zd.paketKunde(q).catch((e) => { console.log('Stripe-Kunde nicht nachgezogen', String(e && e.message).slice(0, 120)); return false; })); }
    }
    return { ok: true, partner: partnerSicht(p) };
  },

  /* ---------- Bestellung ---------- */
  'POST /api/partner/bestellungen': async (ctx) => {
    const p = await mitPartner(ctx), body = ctx.body || {};
    if (!P().gueltig(body.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
    const offen = ((await ctx.sp.bestellungenVonPartner(p.id)) || []).filter((b) => b.status === 'offen' && !['bezahlt', 'laeuft'].includes((b.zahlung || {}).status));
    if (offen.length >= 3) throw new ApiFehler('Sie haben schon drei offene Bestellungen. Bitte schließen Sie eine ab oder verwerfen Sie sie.', 409, { offen: offen.map((b) => b.id) });
    const m = P().merkmale(body.paket), wunsch = {};
    if (body.konfigurator) { const r = RB().konfigurator(body.konfigurator, m); if (!r.ok) throw feldFehler(Object.fromEntries(Object.entries(r.fehler).map(([k, v]) => ['konfigurator.' + k, v]))); wunsch.konfigurator = r.wert; }
    const b = await ctx.sp.bestellungAnlegen({ partner: p.id, paket_bestellt: body.paket, preise: P().preisStand(body.paket, ctx.k.preise.mwst), wunsch: wunsch, verlauf: [{ zeit: ZEIT(ctx), status: 'offen', von: 'partner', text: 'Bestellung begonnen' }] });
    if (ctx.zaehlen) ctx.zaehlen('ereignis:paket_entwurf');
    return { ok: true, bestellung: await bestellungSicht(ctx, b) };
  },
  'PATCH /api/partner/bestellungen/:id': async (ctx) => {
    await mitPartner(ctx);
    const b = await eigene(ctx, ctx.params.id), body = ctx.body || {}, za = b.zahlung || {};
    if (!BIS_FREIGABE.includes(b.status)) throw new ApiFehler('Diese Bestellung lässt sich nicht mehr ändern.', 409);
    const offen = b.status === 'offen' && !['bezahlt', 'laeuft'].includes(za.status);
    let paket = paketVon(b);
    if (body.paket !== undefined && body.paket !== paket) {
      if (!offen) throw new ApiFehler('Das Paket ändern wir nach der Zahlung gern auf Anfrage (Nachricht oder Rückruf).', 409);
      if (!P().gueltig(body.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
      paket = body.paket;
    }
    const m = P().merkmale(paket), fehler = {}, neu = {};
    if (body.konfigurator) {
      const alt = (b.wunsch || {}).konfigurator || {};
      const ein = offen ? body.konfigurator : Object.assign({}, alt, { eingang: Array.isArray(body.konfigurator.eingang) ? body.konfigurator.eingang : alt.eingang });
      const r = RB().konfigurator(ein, m); Object.entries(r.fehler).forEach(([k, v]) => { fehler['konfigurator.' + k] = v; }); neu.konfigurator = r.wert;
    }
    if (body.gestaltung) {
      if (!gestaltet(m)) throw new ApiFehler('Ihr Paket hat keine eigene Gestaltung.', 409);
      const r = RB().gestaltung(body.gestaltung); Object.entries(r.fehler).forEach(([k, v]) => { fehler['gestaltung.' + k] = v; }); neu.gestaltung = r.wert;
    }
    if (Object.keys(fehler).length) throw feldFehler(fehler);
    if (offen && za.session && za.status === 'kasse' && paket !== b.paket_bestellt) await ctx.zd.einrichtungAblaufen(za.session).catch(() => false);
    const t = ZEIT(ctx);
    const z2 = await ctx.sp.bestellungAendern(b.id, (z) => {
      if (!BIS_FREIGABE.includes(z.status)) return false;
      const w = Object.assign({}, z.wunsch);
      if (neu.konfigurator) w.konfigurator = neu.konfigurator;
      if (neu.gestaltung) w.gestaltung = neu.gestaltung;
      if (paket !== z.paket_bestellt && offen) { z.paket_bestellt = paket; z.preise = P().preisStand(paket, ctx.k.preise.mwst); if ((z.zahlung || {}).status === 'kasse') z.zahlung = Object.assign({}, z.zahlung, { status: '' }); }
      if (!offen) { w.geaendert = t; (z.verlauf = z.verlauf || []).push({ zeit: t, von: 'partner', text: 'Wünsche ergänzt' }); }
      z.wunsch = w;
    });
    if (z2 === false) throw new ApiFehler('Diese Bestellung lässt sich nicht mehr ändern.', 409);
    return { ok: true, bestellung: await bestellungSicht(ctx, z2) };
  },

  /* ---------- Uploads ---------- */
  'POST /api/partner/bestellungen/:id/datei': async (ctx) => {
    await mitPartner(ctx);
    const b = await eigene(ctx, ctx.params.id), body = ctx.body || {}, art = ARTEN[body.art], m = merkmaleVon(b), G = R().GRENZEN;
    if (!BIS_FREIGABE.includes(b.status)) throw new ApiFehler('Dateien nehmen wir bis zur Freigabe an; danach schicken Sie sie gern als Nachricht.', 409);
    if (!art || !art.merkmal(m)) throw new ApiFehler('Diese Datei passt nicht zu Ihrem Paket.', 400);
    const bytes = base64Bytes(body.daten);
    if (bytes.length > G.dateiBytes) throw new ApiFehler('Die Datei ist größer als 1 MB. Bitte verkleinern oder per Nachricht schicken.', 413);
    const typ = signatur(bytes);
    if (!typ || !art.typen.includes(typ)) throw new ApiFehler(art.name + ': erlaubt sind ' + art.typen.map((x) => ({ 'image/png': 'PNG', 'image/jpeg': 'JPEG', 'image/webp': 'WebP', 'image/svg+xml': 'SVG', 'application/pdf': 'PDF' })[x]).join(', ') + '.', 400);
    const dateien = b.dateien || [];
    if (dateien.length >= G.dateienBestellung) throw new ApiFehler('Höchstens ' + G.dateienBestellung + ' Dateien je Bestellung.', 400);
    if (dateien.filter((d) => d.art === body.art).length >= art.max(m)) throw new ApiFehler('Höchstens ' + art.max(m) + ' × ' + art.name + '.', 400);
    if (dateien.reduce((s, d) => s + (Number(d.bytes) || 0), 0) + bytes.length > G.summeBestellung) throw new ApiFehler('Zusammen höchstens 10 MB je Bestellung.', 413);
    const ab = ablage(ctx.k, 'bestellungen'); if (!ab) throw new ApiFehler('Die Ablage ist noch nicht eingerichtet.', 503);
    const d = { id: 'd' + Array.from(crypto.getRandomValues(new Uint8Array(9))).map((x) => 'abcdefghijklmnopqrstuvwxyz0123456789'[x % 36]).join(''), art: body.art, name: DATEI_NAME(body.name), typ: typ, bytes: bytes.length, zeit: ZEIT(ctx) };
    if (!(await ab.ablegen(dateiPfad(b, d), bytes, typ))) throw new ApiFehler('Die Datei ließ sich gerade nicht speichern. Bitte noch einmal.', 503);
    const z2 = await ctx.sp.bestellungAendern(b.id, (z) => { z.dateien = (z.dateien || []).concat([d]); if (z.status !== 'offen') z.wunsch = Object.assign({}, z.wunsch, { geaendert: d.zeit }); });
    return { ok: true, datei: { id: d.id, art: d.art, name: d.name, typ: d.typ, bytes: d.bytes, zeit: d.zeit }, bestellung: await bestellungSicht(ctx, z2) };
  },
  'GET /api/partner/bestellungen/:id/datei/:did': async (ctx) => { await mitPartner(ctx); return dateiAntwort(ctx.k, await eigene(ctx, ctx.params.id), ctx.params.did); },
  'DELETE /api/partner/bestellungen/:id/datei/:did': async (ctx) => {
    await mitPartner(ctx);
    const b = await eigene(ctx, ctx.params.id), d = (b.dateien || []).find((x) => x.id === ctx.params.did);
    if (!d) throw new ApiFehler('Diese Datei gibt es nicht.', 404);
    if (!BIS_FREIGABE.includes(b.status)) throw new ApiFehler('Diese Bestellung lässt sich nicht mehr ändern.', 409);
    const ab = ablage(ctx.k, 'bestellungen'); if (ab) await ab.loeschen([dateiPfad(b, d)]);
    const z2 = await ctx.sp.bestellungAendern(b.id, (z) => { z.dateien = (z.dateien || []).filter((x) => x.id !== d.id); });
    return { ok: true, bestellung: await bestellungSicht(ctx, z2) };
  },

  /* ---------- Kostenpflichtig bestellen: Eingangsbestätigung sofort, dann Stripe Checkout ---------- */
  'POST /api/partner/bestellungen/:id/kasse': async (ctx) => {
    const p = await mitPartner(ctx), b = await eigene(ctx, ctx.params.id), za = b.zahlung || {}, body = ctx.body || {}, zust = body.zustimmung || {};
    if (b.status !== 'offen' || za.status === 'bezahlt') throw new ApiFehler(b.status === 'storniert' ? 'Diese Bestellung ist storniert.' : 'Diese Bestellung ist schon bezahlt.', 409);
    if (za.status === 'laeuft') throw new ApiFehler('Ihre Lastschrift ist schon unterwegs; das dauert meist 2 bis 5 Werktage.', 409, { laeuft: true });
    if (zust.agb && zust.agb !== PAKET_STAND) throw new ApiFehler('Unsere Paketbedingungen haben sich gerade geändert. Bitte lesen Sie sie und stimmen Sie noch einmal zu.', 409, { neuLaden: true, stand: PAKET_STAND });
    const paket = paketVon(b), m = P().merkmale(paket), w = b.wunsch || {};
    const v = RB().vollstaendig({ firma: Object.assign({ firma: p.firma }, p.daten || {}), konfigurator: w.konfigurator, gestaltung: w.gestaltung }, m, PAKET_STAND, zust);
    if (!v.ok) { const erstes = Object.keys(v.fehler)[0] || ''; throw new ApiFehler(Object.values(v.fehler)[0] || 'Bitte die Angaben vervollständigen.', 400, { felder: v.fehler, schritt: erstes.split('.')[0] }); }
    if (!ctx.zd) throw new ApiFehler('Die Zahlung ist noch nicht eingerichtet.', 503);
    const vk = await verkaufJetzt(ctx);
    if (!vk.kasse) { console.log('Paket-Kasse zu:', (vk.fehlt || []).join('; ') || 'PAKETE_OFFEN fehlt'); throw new ApiFehler('Die Bestellung ist bald möglich. Ihre Angaben sind gespeichert; fragen Sie gern unverbindlich an, dann melden wir uns.', 503, { gesperrt: true, bald: true }); }
    if (!erlaubt('pkasse:' + p.id, 10, 3600 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in einer Stunde noch einmal oder schreiben Sie uns.', 429);
    const preise = P().preisStand(paket, ctx.k.preise.mwst);
    const customer = await ctx.zd.paketKunde(p);
    if (customer !== p.stripe_customer) await ctx.sp.partnerFelder(p.id, { stripe_customer: customer });
    if (za.session && za.status === 'kasse') await ctx.zd.einrichtungAblaufen(za.session).catch(() => false);
    const kasse = await ctx.zd.einrichtungKasse({ customer: customer, bestellung: { id: b.id, nr: b.nr, paket: paket }, partner: p.id, preise: preise, origin: ctx.url.origin, stand: PAKET_STAND });
    const t = ZEIT(ctx), erste = !(b.zustimmung && b.zustimmung.zeit);
    const z2 = await ctx.sp.bestellungAendern(b.id, (z) => {
      z.paket_bestellt = paket; z.preise = preise;
      z.zahlung = Object.assign({}, z.zahlung, { status: 'kasse', session: kasse.id });
      z.zustimmung = { stand: PAKET_STAND, unternehmer: true, agb: PAKET_STAND, avv: true, zeit: (z.zustimmung && z.zustimmung.zeit) || t, letzte: t, netz: netzKurz(ip(ctx.request)) };
      z.wunsch = Object.assign({}, z.wunsch, { firma: v.wert.firma });
      (z.verlauf = z.verlauf || []).push({ zeit: t, von: 'partner', text: erste ? 'Kostenpflichtig bestellt (Paketbedingungen und AV-Vertrag, Stand ' + PAKET_STAND + ')' : 'Zur Kasse' });
    });
    if (erste) { ctx.waitUntil(eingangBestaetigen(ctx, z2, Object.assign({}, p, { stripe_customer: customer })).catch((e) => { console.log('Eingangsbestätigung nicht gesendet', String(e && e.message).slice(0, 120)); return false; })); if (ctx.zaehlen) ctx.zaehlen('ereignis:paket_bestellt'); }
    return { ok: true, url: kasse.url };
  },
  'GET /api/partner/bestellungen/:id/kasse/pruefen': async (ctx) => {
    await mitPartner(ctx);
    const b = await eigene(ctx, ctx.params.id), session = str(ctx.url.searchParams.get('session'), 200);
    if (!session) throw new ApiFehler('Keine Zahlung angegeben.', 400);
    if (!ctx.zd) throw new ApiFehler('Die Zahlung ist noch nicht eingerichtet.', 503);
    const r = await ctx.zd.einrichtungLesen(session);
    if (!r) throw new ApiFehler('Diese Zahlung gibt es nicht.', 404);
    const e = await einrichtungUebernehmen(ctx, session, { r: r, bestellung: b.id, quelle: 'rueckkehr' });
    return { ok: true, bezahlt: !!e.bezahlt, laeuft: !!e.laeuft, fehlgeschlagen: !!e.fehlgeschlagen, status: e.status, bestellung: await bestellungSicht(ctx, e.bestellung || (await eigene(ctx, b.id))) };
  },
  'POST /api/partner/bestellungen/:id/anfragen': async (ctx) => {
    const p = await mitPartner(ctx), b = await eigene(ctx, ctx.params.id);
    nachrichtBremse(ctx, p);
    const text = str((ctx.body || {}).text, 2000) || 'Ich möchte ' + ((P().PAKETE[paketVon(b)] || {}).name || 'ein Paket') + ' bestellen. Bitte melden Sie sich, sobald die Bestellung möglich ist.';
    await ctx.sp.nachrichtAnlegen({ partner: p.id, bestellung: b.id, von: 'partner', art: 'frage', text: text });
    ctx.waitUntil(nachrichtAnInhaber(ctx, p, b, 'Anfrage zu einem Paket', text).catch(() => false));
    return { ok: true };
  },
  'POST /api/partner/bestellungen/:id/stornieren': async (ctx) => {
    await mitPartner(ctx);
    const b = await eigene(ctx, ctx.params.id), za = b.zahlung || {};
    if (b.status === 'offen') {
      if (za.status === 'laeuft') throw new ApiFehler('Ihre Lastschrift ist unterwegs. Bitte warten Sie sie ab oder schreiben Sie uns.', 409, { laeuft: true });
      if (za.session && za.status === 'kasse' && ctx.zd) await ctx.zd.einrichtungAblaufen(za.session).catch(() => false);
      const neu = await uebergang(ctx, b.id, 'storniert', { wer: 'partner', text: 'Entwurf verworfen', stumm: true });
      return { ok: true, bestellung: await bestellungSicht(ctx, neu) };
    }
    if (b.status === 'bezahlt') {
      await angemeldet(ctx, { frisch: true });
      await erstatten(ctx, b.id, { wer: 'partner', grund: 'Storno durch den Partner vor Beginn der Einrichtung' });
      const neu = await uebergang(ctx, b.id, 'storniert', { wer: 'partner', text: 'Storno vor Beginn der Einrichtung, volle Erstattung' });
      ctx.waitUntil(nachrichtAnInhaber(ctx, ctx.partner, neu, 'Storno mit Erstattung', 'Der Partner hat die bezahlte Bestellung vor Beginn der Einrichtung storniert. Die Einrichtungsgebühr wird voll erstattet.').catch(() => false));
      return { ok: true, bestellung: await bestellungSicht(ctx, neu) };
    }
    throw new ApiFehler('Nach Beginn der Einrichtung stornieren wir gern im Gespräch. Bitte schreiben Sie uns oder bitten Sie um einen Rückruf.', 409);
  },
  'POST /api/partner/bestellungen/:id/freigabe': async (ctx) => {
    const p = await mitPartner(ctx), b = await eigene(ctx, ctx.params.id), body = ctx.body || {}, v = b.vorschau || {};
    if (b.status !== 'freigabe' || !v.version) throw new ApiFehler('Zurzeit gibt es keine Vorschau zur Freigabe.', 409);
    if (Number(body.version) !== Number(v.version)) throw new ApiFehler('Inzwischen gibt es eine neuere Vorschau. Bitte sehen Sie sie sich an.', 409, { neuLaden: true });
    nachrichtBremse(ctx, p);
    const t = ZEIT(ctx);
    if (body.aktion === 'freigeben') {
      const neu = await ctx.sp.bestellungAendern(b.id, (z) => { z.vorschau = Object.assign({}, z.vorschau, { freigabe: { version: v.version, zeit: t, netz: netzKurz(ip(ctx.request)) } }); (z.verlauf = z.verlauf || []).push({ zeit: t, von: 'partner', text: 'Vorschau (Version ' + v.version + ') freigegeben' }); });
      await ctx.sp.nachrichtAnlegen({ partner: p.id, bestellung: b.id, von: 'partner', art: 'freigabe', text: 'Vorschau (Version ' + v.version + ') freigegeben.' });
      ctx.waitUntil(nachrichtAnInhaber(ctx, p, neu, 'Freigabe erteilt', 'Die Vorschau (Version ' + v.version + ') ist freigegeben. Nächster Schritt: Live schalten.').catch(() => false));
      return { ok: true, bestellung: await bestellungSicht(ctx, neu) };
    }
    if (body.aktion === 'aendern') {
      const text = str(body.text, R().GRENZEN.nachricht);
      if (text.length < 3) throw feldFehler({ text: 'Bitte beschreiben Sie kurz, was wir ändern sollen.' });
      const neu = await ctx.sp.bestellungAendern(b.id, (z) => { z.vorschau = Object.assign({}, z.vorschau, { aenderung: { version: v.version, text: text, zeit: t } }); (z.verlauf = z.verlauf || []).push({ zeit: t, von: 'partner', text: 'Änderung gewünscht' }); });
      await ctx.sp.nachrichtAnlegen({ partner: p.id, bestellung: b.id, von: 'partner', art: 'aenderung', text: text });
      ctx.waitUntil(nachrichtAnInhaber(ctx, p, neu, 'Änderung gewünscht', text).catch(() => false));
      return { ok: true, bestellung: await bestellungSicht(ctx, neu) };
    }
    throw new ApiFehler('Bitte freigeben oder eine Änderung beschreiben.', 400);
  },
  /* Empfänger der Anfragen: vor der Instanz nur der Wunsch; mit Instanz bekommt jede neue Adresse einen Bestätigungslink
     (verwalten.empfaengerEinladen, Strang A). Mindestens eine bestätigte Adresse bleibt, bis eine neue bestätigt ist. */
  'POST /api/partner/bestellungen/:id/eingang': async (ctx) => {
    const p = await mitPartner(ctx), b = await eigene(ctx, ctx.params.id), m = merkmaleVon(b);
    if (['storniert', 'beendet'].includes(b.status)) throw new ApiFehler('Diese Bestellung ist abgeschlossen.', 409);
    const alt = (b.wunsch || {}).konfigurator || {}, r = RB().konfigurator(Object.assign({}, alt, { eingang: (ctx.body || {}).mails }), m);
    const f = Object.fromEntries(Object.entries(r.fehler).filter(([k]) => /^eingang/.test(k)));
    if (Object.keys(f).length) throw feldFehler(f);
    const neuListe = r.wert.eingang;
    let ergebnis = neuListe.map((x) => ({ mail: x, bestaetigt: false }));
    if (b.instanz) {
      const inst = await ctx.sp.instanzHolen(b.instanz), vorher = ((inst && inst.eingang) || {}).mails || [];
      const bleibtBestaetigt = vorher.some((x) => x.bestaetigt && neuListe.includes(x.mail));
      if (vorher.some((x) => x.bestaetigt) && !bleibtBestaetigt) throw new ApiFehler('Mindestens eine bestätigte Adresse muss bleiben. Entfernen Sie die alte, sobald die neue bestätigt ist.', 409);
      /* entfernte Adressen weg, neue unbestätigt dazu; dann der Bestätigungslink je neuer Adresse (verwalten.js, Strang A) */
      const neue = neuListe.filter((x) => !vorher.some((y) => y.mail === x));
      await ctx.sp.instanzAendern(b.instanz, (z) => { const e = Object.assign({ mails: [] }, z.eingang); e.mails = (e.mails || []).filter((x) => neuListe.includes(x.mail)).concat(neue.map((m) => ({ mail: m, bestaetigt: null, eingeladen: null }))); z.eingang = e; });
      await cacheLeeren(ctx, b.instanz).catch(() => false); // entfernte Adressen bekommen ab sofort nichts mehr
      for (const mail of neue) { try { await empfaengerEinladen(ctx, b.instanz, mail, 'eingang'); } catch (e) { console.log('Empfänger noch nicht eingeladen (verwalten.empfaengerEinladen)', String(e && e.message).slice(0, 80)); } }
      const jetztI = await ctx.sp.instanzHolen(b.instanz);
      ergebnis = (((jetztI && jetztI.eingang) || {}).mails || []).map((x) => ({ mail: x.mail, bestaetigt: !!x.bestaetigt }));
    }
    const neu = await ctx.sp.bestellungAendern(b.id, (z) => { const w = Object.assign({}, z.wunsch); w.konfigurator = Object.assign({}, w.konfigurator, { eingang: neuListe }); w.geaendert = ZEIT(ctx); z.wunsch = w; (z.verlauf = z.verlauf || []).push({ zeit: ZEIT(ctx), von: 'partner', text: 'Empfänger der Anfragen geändert' }); });
    if (b.instanz) ctx.waitUntil(nachrichtAnInhaber(ctx, p, neu, 'Empfänger geändert', 'Neue Empfänger: ' + neuListe.join(', ')).catch(() => false));
    return { ok: true, eingang: ergebnis, bestellung: await bestellungSicht(ctx, neu) };
  },
  'POST /api/partner/bestellungen/:id/paketwechsel': async (ctx) => {
    const p = await mitPartner(ctx), b = await eigene(ctx, ctx.params.id), body = ctx.body || {};
    if (!P().gueltig(body.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
    nachrichtBremse(ctx, p);
    const alt = paketVon(b), text = 'Paketwechsel angefragt: ' + P().PAKETE[alt].name + ' → ' + P().PAKETE[body.paket].name + (str(body.text, 1000) ? '. ' + str(body.text, 1000) : '');
    await ctx.sp.nachrichtAnlegen({ partner: p.id, bestellung: b.id, von: 'partner', art: 'text', text: text });
    ctx.waitUntil(nachrichtAnInhaber(ctx, p, b, 'Paketwechsel angefragt', text).catch(() => false));
    return { ok: true };
  },

  /* ---------- Rechnungen und Kundenportal ---------- */
  'GET /api/partner/rechnungen': async (ctx) => {
    const p = await mitPartner(ctx);
    if (!p.stripe_customer || !ctx.zd) return { ok: true, rechnungen: [] };
    return { ok: true, rechnungen: await ctx.zd.paketRechnungen(p.stripe_customer) };
  },
  'POST /api/partner/portal': async (ctx) => {
    await angemeldet(ctx, { frisch: true });
    const p = ctx.partner;
    if (!p || !p.stripe_customer || !ctx.zd) throw new ApiFehler('Rechnungen und Zahlungsmittel gibt es nach der ersten Zahlung.', 409);
    return { ok: true, url: (await ctx.zd.kundenportal(p.stripe_customer, ctx.url.origin + '/partner/#konto')).url };
  },

  /* ---------- Nachrichten und Rückruf ---------- */
  'GET /api/partner/nachrichten': async (ctx) => {
    const p = await mitPartner(ctx), bid = str(ctx.url.searchParams.get('bestellung'), 60);
    return { ok: true, nachrichten: ((await ctx.sp.nachrichtenVon(p.id, { bestellung: bid || undefined, anzahl: 200 })) || []).map(nachrichtSicht) };
  },
  'POST /api/partner/nachrichten': async (ctx) => {
    const p = await mitPartner(ctx), body = ctx.body || {};
    const text = String(body.text == null ? '' : body.text).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim();
    if (!text) throw feldFehler({ text: 'Bitte eine Nachricht schreiben.' });
    if (text.length > R().GRENZEN.nachricht) throw feldFehler({ text: 'Höchstens ' + R().GRENZEN.nachricht + ' Zeichen.' });
    const b = body.bestellung ? await eigene(ctx, body.bestellung) : null;
    nachrichtBremse(ctx, p);
    const n = await ctx.sp.nachrichtAnlegen({ partner: p.id, bestellung: b ? b.id : null, von: 'partner', art: 'text', text: text });
    ctx.waitUntil(nachrichtAnInhaber(ctx, p, b, 'Neue Nachricht', text).catch(() => false));
    return { ok: true, nachricht: nachrichtSicht(n) };
  },
  'POST /api/partner/nachrichten/gelesen': async (ctx) => { const p = await mitPartner(ctx); return { ok: true, n: await ctx.sp.nachrichtenGelesen(p.id, 'partner') }; },
  'POST /api/partner/rueckruf': async (ctx) => {
    const p = await mitPartner(ctx), body = ctx.body || {}, f = {};
    const tage = werktage(ctx.k.jetzt || Date.now(), R().FRISTEN.rueckrufWerktage), tag = str(body.tag, 10), fenster = str(body.fenster, 5), tel = str(body.tel, 40) || (p.daten || {}).tel || '';
    const thema = THEMEN.includes(body.thema) ? body.thema : 'Sonstiges', text = str(body.text, 500);
    if (!tage.includes(tag)) f.tag = 'Bitte einen Werktag (Montag bis Freitag) in den nächsten ' + R().FRISTEN.rueckrufWerktage + ' Werktagen wählen.';
    if (!FENSTER.includes(fenster)) f.fenster = 'Bitte ein Zeitfenster wählen.';
    if (!R().telOk(tel)) f.tel = 'Bitte eine Telefonnummer mit mindestens 6 Ziffern eingeben.';
    if (Object.keys(f).length) throw feldFehler(f);
    const offen = ((await ctx.sp.nachrichtenVon(p.id, { anzahl: 200 })) || []).filter((n) => n.art === 'rueckruf' && n.von === 'partner' && !(n.rueckruf && n.rueckruf.erledigt));
    if (offen.length) throw new ApiFehler('Es gibt schon einen offenen Rückrufwunsch. Ändern Sie ihn, indem Sie ihn zurückziehen und neu anlegen.', 400, { offen: offen[0].id });
    const b = body.bestellung ? await eigene(ctx, body.bestellung) : null;
    nachrichtBremse(ctx, p);
    const n = await ctx.sp.nachrichtAnlegen({ partner: p.id, bestellung: b ? b.id : null, von: 'partner', art: 'rueckruf', text: text || thema, rueckruf: { tag: tag, fenster: fenster, tel: tel, thema: thema } });
    const wann = new Date(tag + 'T12:00:00Z').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) + ', ' + fenster.replace('-', '–') + ' Uhr';
    ctx.waitUntil(nachrichtAnInhaber(ctx, p, b, 'Rückruf gewünscht: ' + wann, text, [['Wann', esc(wann)], ['Telefon', esc(tel)], ['Thema', esc(thema)]]).catch(() => false));
    return { ok: true, rueckruf: nachrichtSicht(n) };
  },
  'DELETE /api/partner/rueckruf/:nid': async (ctx) => {
    const p = await mitPartner(ctx);
    const n = ((await ctx.sp.nachrichtenVon(p.id, { anzahl: 500 })) || []).find((x) => x.id === ctx.params.nid && x.art === 'rueckruf' && x.von === 'partner');
    if (!n) throw new ApiFehler('Diesen Rückrufwunsch gibt es nicht.', 404);
    if (n.rueckruf && n.rueckruf.erledigt) return { ok: true, schon: true };
    await ctx.sp.nachrichtAendern(n.id, { rueckruf: Object.assign({}, n.rueckruf, { erledigt: ZEIT(ctx), zurueckgezogen: true }) });
    return { ok: true };
  },

  /* ---------- Domain-Hinweis ---------- */
  'POST /api/partner/domain-pruefen': async (ctx) => {
    await angemeldet(ctx);
    if (!(await bremse(ctx, 'RL_FORM', 'domain:' + ctx.sitzung.sub))) throw new ApiFehler('Zu viele Abfragen. Bitte in einer Minute noch einmal.', 429);
    const h = R().host((ctx.body || {}).domain);
    if (!h.ok) throw feldFehler({ domain: h.fehler });
    const r = await domainPruefen(h.host);
    return { ok: true, host: h.host, stand: r.stand, quelle: r.quelle, text: h.host + ': ' + DOMAIN_TEXT[r.stand] + ' (unverbindlich, wir prüfen beim Kauf)' };
  },

  /* ---------- Frage ohne Konto ---------- */
  'POST /api/partner/frage': async (ctx) => {
    nurHaupt(ctx);
    if (!ctx.formular) return frageAnnehmen(ctx);
    try { await frageAnnehmen(ctx); return frageSeite('Danke, Ihre Frage ist da.', '<p class="p-text">Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.</p>'); } catch (e) {
      if (!(e instanceof ApiFehler)) throw e;
      const felder = e.extra && e.extra.felder ? Object.values(e.extra.felder) : [e.message];
      return frageSeite('Das hat noch nicht geklappt.', felder.map((t) => '<p class="p-fehler" role="alert">' + esc(t) + '</p>').join('') + '<p class="p-text">Bitte gehen Sie zurück und prüfen Sie Ihre Angaben.</p>', e.status);
    }
  }
};
/* für die Prüfung: Werktage des Rückrufs und Signatur der Dateien */
export const _pruefen = { werktage: werktage, signatur: signatur };

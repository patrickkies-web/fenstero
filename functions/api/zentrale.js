/* eeziframes · Zentrale des Inhabers: /zentrale/ (Oberfläche) und /api/zentrale/… (diese Datei).
   Zugang: Passwort aus dem Cloudflare-Secret ZENTRALE_PASSWORT (mindestens 12 Zeichen), auf Wunsch zusätzlich ein Code aus einer
   Authenticator-App (ZENTRALE_2FA). Nach der Anmeldung trägt der Browser ein Sitzungs-Cookie (__Host-zentrale: nur HTTPS, für
   Skripte unlesbar, nur von dieser Seite gesendet, 8 Stunden gültig), unterschrieben mit einem Schlüssel aus Passwort, zweitem
   Faktor und FREISCHALT_GEHEIMNIS: Wer das Passwort ändert, meldet damit jede Sitzung ab. Jede Anfrage braucht zusätzlich die
   Kopfzeile x-zentrale: 1 (kann eine fremde Seite nicht setzen). Bremse: 5 Versuche je 15 Minuten und IP-Adresse.

   Was die Zentrale zeigt und darf (Begründung: docs/ZENTRALE.md, Datenschutzerklärung Abschnitt 7):
   - Betriebe: Stammdaten, Tarif, Zahlungsart, Kennzahlen (Projekte, verschickte Links, eingegangene Aufmaße, Positionen, Aufträge,
     Umsatz), Buchungen und Rechnungen. Eigene Kunden der Betriebe (Hauseigentümer) erscheinen nur als Projektnummer: Für diese
     Daten ist eeziframes Auftragsverarbeiter. Einblick in Namen, Kontakt und Aufmaß und der Datenexport (der diese Daten enthält)
     gibt es nur mit Anlass, mit zweitem Faktor samt frischem Code und erst nach dem Eintrag im Protokoll (ohne Protokoll keine Daten).
     Löschen verlangt bei eingerichtetem zweitem Faktor ebenfalls einen frischen Code.
   - Eingriffe: sperren (der Betrieb sieht die Begründung beim Anmelden, seine Links ruhen), entsperren, interne Notiz, kostenlose
     Projekte gutschreiben, Doppelkonto-Verdacht aufheben, Nachricht ins Konto, Abo kündigen oder beenden, offene Buchungen
     abrechnen, Daten exportieren (Art. 15 und 20 DSGVO), Konto löschen (Abo endet sofort, Anmeldung und Konto werden gelöscht,
     ein knapper Löschnachweis bleibt im Protokoll; Rechnungen bewahrt Stripe für das Finanzamt auf).
   - Käufe des Aufmaßblatts, Anmeldungen ohne Betrieb, eigene Statistik (statistik.js), Protokoll, Einstellungen.
   Jeder Eingriff und jede Anmeldung landet im Protokoll (Tabelle protokoll; Anmeldungen 90 Tage, Eingriffe 3 Jahre, aufraeumen()). */
import '../../web/assets/modell.js';
import { ApiFehler, hmac, b64url, erlaubt, ip, netzKurz, anschluss, gleich, zufall } from './umgebung.js';
import { anmeldungLoeschen, anmeldungLesen, anmeldungenAlle } from './auth.js';
import { melden, abrechnungslauf, sicht } from './konten.js';
import { auswerten, tagBerlin, browserName, systemName, zaehlen } from './statistik.js';

const X = () => globalThis.Abrechnung;
const DAUER = 8 * 3600 * 1000;
const TAG = 864e5;
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const rund = (n) => Math.round((Number(n) || 0) * 100) / 100;
const KOPF = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };

/* ---------- Sitzung ---------- */
const schluessel = (k) => 'eeziframes-zentrale|' + k.zentrale.passwort + '|' + k.zentrale.totp + '|' + k.geheimnis;
const b64urlText = (s) => b64url(new TextEncoder().encode(s));
const textAusB64url = (s) => { const b = s.replace(/-/g, '+').replace(/_/g, '/'); return atob(b + '==='.slice((b.length + 3) % 4)); };
async function sitzungAusstellen(k) {
  const jetzt = Date.now(), nutz = b64urlText(JSON.stringify({ v: 1, iat: jetzt, exp: jetzt + DAUER, z: !!k.zentrale.totp, n: zufall(6) }));
  return nutz + '.' + b64url(await hmac(schluessel(k), nutz));
}
export async function sitzungPruefen(k, token) {
  if (!k.zentrale.passwort) return null;
  const teile = String(token || '').split('.');
  if (teile.length !== 2 || !teile[0] || !teile[1]) return null;
  if (!(await gleich(teile[1], b64url(await hmac(schluessel(k), teile[0]))))) return null;
  let p = null; try { p = JSON.parse(textAusB64url(teile[0])); } catch (e) { return null; }
  if (!p || p.v !== 1 || !(p.exp > Date.now()) || !(p.iat <= Date.now() + 60000)) return null;
  return p;
}
const cookieLesen = (request) => { const m = /(?:^|;\s*)__Host-zentrale=([^;\s]+)/.exec(request.headers.get('cookie') || ''); return m ? m[1] : ''; };
const cookieSetzen = (wert, sekunden) => '__Host-zentrale=' + wert + '; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=' + sekunden;
const antwort = (obj, status, extra) => new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({}, KOPF, extra || {}) });

async function zugang(ctx) {
  if (!ctx.k.zentrale.passwort) throw new ApiFehler('Die Zentrale ist noch nicht eingerichtet.', 503);
  if (ctx.request.headers.get('x-zentrale') !== '1') throw new ApiFehler('Nicht erlaubt.', 403);
  const p = await sitzungPruefen(ctx.k, cookieLesen(ctx.request));
  if (!p || beendet.has(p.n)) throw new ApiFehler('Bitte neu anmelden.', 401, { abgemeldet: true });
  ctx.zentrale = p;
  return p;
}
function daten(ctx) { if (!ctx.sp) throw new ApiFehler('Die Datenbank ist noch nicht verbunden (SUPABASE_URL, SUPABASE_SECRET_KEY bei Cloudflare).', 503); return ctx.sp; }
async function betriebLaden(ctx) {
  const id = str(ctx.params.id, 80); if (!/^[A-Za-z0-9-]{8,80}$/.test(id)) throw new ApiFehler('Unbekannter Betrieb.', 404);
  const row = await daten(ctx).betriebHolen(id); if (!row) throw new ApiFehler('Diesen Betrieb gibt es nicht (mehr).', 404);
  return row;
}

/* ---------- Zweiter Faktor (TOTP nach RFC 6238: SHA-1, 6 Ziffern, 30 Sekunden) ---------- */
function base32(s) { const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let bits = 0, wert = 0; const out = []; for (const c of s) { const i = A.indexOf(c); if (i < 0) continue; wert = ((wert << 5) | i) & 0xffffff; bits += 5; if (bits >= 8) { out.push((wert >>> (bits - 8)) & 255); bits -= 8; } } return new Uint8Array(out); }
export async function totpCode(geheim, schritt) {
  const key = await crypto.subtle.importKey('raw', base32(geheim), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const msg = new Uint8Array(8); let x = schritt; for (let i = 7; i >= 0; i--) { msg[i] = x % 256; x = Math.floor(x / 256); }
  const h = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg)), o = h[h.length - 1] & 15;
  const zahl = ((h[o] & 127) * 16777216) + (h[o + 1] << 16) + (h[o + 2] << 8) + h[o + 3];
  return String(zahl % 1000000).padStart(6, '0');
}
/* Ein Code gilt nur einmal, für die Anmeldung wie für heikle Schritte (je Instanz): Wer einen Anmeldecode abfängt, kann damit
   keinen Einblick und keinen Export auslösen */
const verbraucht = new Map();
async function totpPruefen(geheim, code) {
  code = String(code || '').replace(/\s+/g, ''); if (!/^\d{6}$/.test(code)) return false;
  const jetzt = Math.floor(Date.now() / 30000);
  for (const d of [0, -1, 1]) {
    if (await gleich(await totpCode(geheim, jetzt + d), code)) {
      if (verbraucht.get(code) === jetzt + d) return false;
      verbraucht.set(code, jetzt + d); if (verbraucht.size > 500) verbraucht.clear();
      return true;
    }
  }
  return false;
}
/* nur für die Prüfsuite: verbrauchte Codes vergessen, damit sie nicht 30 Sekunden auf den nächsten warten muss */
export function codesVergessen() { verbraucht.clear(); }
/* Heikle Schritte (Einblick in Endkundendaten, Export, Löschen) verlangen bei eingerichtetem zweitem Faktor einen frischen Code.
   Nach fünf falschen Codes endet die Sitzung (je Instanz); jeder Fehlversuch steht im Protokoll. */
const fehlStufe = new Map(), beendet = new Set();
async function frischerCode(ctx, zweck, pflicht) {
  const z = ctx.k.zentrale;
  if (!z.totp) { if (pflicht) throw new ApiFehler('Dafür ist der zweite Faktor nötig (Einstellungen → Zweiter Faktor).', 403); return; }
  if (await totpPruefen(z.totp, (ctx.body || {}).code)) return;
  const nonce = (ctx.zentrale && ctx.zentrale.n) || '?', n = (fehlStufe.get(nonce) || 0) + 1;
  fehlStufe.set(nonce, n); if (fehlStufe.size > 1000) fehlStufe.clear();
  await protokoll(ctx.sp, 'code_falsch', null, 'Falscher Code für ' + zweck + ' (' + n + '. Versuch dieser Sitzung)', { geraet: geraetVon(ctx.request) }, netzKurz(ip(ctx.request)));
  if (n >= 5) { beendet.add(nonce); throw new ApiFehler('Fünfmal ein falscher Code: Die Sitzung ist beendet. Bitte neu anmelden.', 401, { abgemeldet: true }); }
  throw new ApiFehler('Bitte den aktuellen Code aus der Authenticator-App eingeben. Jeder Code gilt nur einmal; nach der Anmeldung den nächsten abwarten.', 401);
}
/* Für Einblick und Export gilt: ohne Eintrag im Protokoll keine Daten */
async function protokollPflicht(sp, art, betrieb, text, extra) {
  if (!(await protokoll(sp, art, betrieb, text, extra))) throw new ApiFehler('Das Protokoll ist nicht erreichbar (supabase/schema.sql ausführen). Ohne Eintrag im Protokoll gibt es keinen Einblick und keinen Export.', 503);
}

/* ---------- Protokoll ---------- */
export async function protokoll(sp, art, betrieb, text, extra, netz) {
  if (!sp || !sp.protokollSchreiben) return false;
  try { return await sp.protokollSchreiben({ art: art, betrieb: betrieb || null, text: str(text, 300), daten: extra || {}, netz: netz || null }); } catch (e) { console.log('Protokoll nicht geschrieben', art, String((e && e.message) || e).slice(0, 120)); return false; }
}
let fehlUeber = 0;
const geraetVon = (request) => { const ua = request.headers.get('user-agent') || ''; return browserName(ua) + ' auf ' + systemName(ua); };

/* ---------- Kennzahlen eines Betriebs ---------- */
const sperreVon = (row) => ((row.daten || {}).verwaltung || {}).sperre || null;
const VERSCHICKT = ['gesendet', 'geoeffnet', 'arbeit', 'eingegangen'];
function kennzahlen(row) {
  const a = JSON.parse(JSON.stringify(row.daten || {})), links = (a.links || []).filter((l) => !l.demo), book = X().ledger(a);
  const ein = links.filter((l) => l.status === 'eingegangen'), am = (l) => l.aufmass || {};
  const n = (f) => links.filter(f).length, summe = (arr) => rund(arr.reduce((s, b) => s + (Number(b.betrag) || 0), 0));
  const kosten = book.filter((b) => Number(b.betrag) > 0);
  return {
    projekte: links.length,
    verschickt: n((l) => (l.log && l.log.gesendet) || VERSCHICKT.includes(l.status)),
    geoeffnet: n((l) => l.log && l.log.geoeffnet),
    aufmasse: ein.length,
    nachbesserungen: ein.reduce((s, l) => s + Math.max(0, (l.runde || 1) - 1), 0),
    positionen: ein.reduce((s, l) => s + (am(l).windows || []).length, 0),
    elemente: ein.reduce((s, l) => s + (Number(am(l).elemente) || 0), 0),
    fotos: ein.reduce((s, l) => s + (Number(am(l).fotos) || 0), 0),
    wartend: ein.filter((l) => l.locked).length,
    offen: n((l) => ['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)),
    abgelaufen: n((l) => l.status === 'abgelaufen'),
    angebote: n((l) => l.stage === 'angebot'), termine: n((l) => l.stage === 'termin'), auftraege: n((l) => l.stage === 'auftrag'), verloren: n((l) => l.stage === 'verloren'),
    umsatz: summe(kosten), bezahlt: summe(kosten.filter((b) => b.status === 'bezahlt')), berechnet: summe(kosten.filter((b) => b.status === 'berechnet')), nochOffen: summe(kosten.filter((b) => b.status === 'offen')),
    rechnungen: (a.rechnungen || []).length, fehlgeschlagen: (a.rechnungen || []).filter((r) => r.status === 'fehlgeschlagen').length,
    freiUebrig: X().konto(a) === 'service' ? X().freeLeft(a) : null,
    ungelesen: (a.notif || []).filter((x) => x.new).length
  };
}
function zeile(row) {
  const a = row.daten || {}, s = sperreVon(row);
  return {
    id: row.id, name: row.name, mail: row.mail, kontaktMail: a.mail && a.mail !== row.mail ? a.mail : '', ap: a.ap || '', tel: a.tel || '', plz: row.plz || '',
    registriert: row.created_at || '', zuletzt: a.zuletzt || row.updated_at || '', angemeldet: a.angemeldet || '', anmeldungen: a.anmeldungen || 0,
    tarif: X().konto(a), wechsel: a.downgrade ? { zu: a.downgrade.to, am: a.downgrade.at } : null,
    zahlungsart: a.pay ? { art: a.pay.type || 'Zahlungsart', text: a.pay.label || '', seit: a.pay.when || '' } : null,
    gesperrt: s ? { seit: s.seit, grund: s.grund } : null, doppelt: a.dupOf || '',
    stripe: { kunde: row.stripe_customer || '', abo: row.stripe_subscription || '' },
    k: kennzahlen(row)
  };
}
const stripeLink = (k, art, id) => (k.stripe && id ? 'https://dashboard.stripe.com/' + (k.stripe.test ? 'test/' : '') + art + '/' + encodeURIComponent(id) : '');
const fensterKurz = (w) => { const d = globalThis.AW.derive(w); return { name: w.name || '', etage: globalThis.AW.lab('etage', w.etage) || '', art: globalThis.AW.lab('art', w.art || 'fenster') || 'Fenster', anzahl: Number(w.anzahl) || 1, oeffnung: d.moW && d.moH ? d.moW + ' × ' + d.moH : '', element: d.elW && d.elH ? d.elW + ' × ' + d.elH : '' }; };
/* Projekte ohne Daten der Endkunden; mit einblick zusätzlich Name, Kontakt, Objekt, Notizen und das Aufmaß in Kurzform */
function projekte(a, einblick) {
  return (a.links || []).filter((l) => !l.demo).map((l) => {
    const am = l.aufmass || {}, log = l.log || {};
    const p = { id: l.id, nr: l.nr || '', status: l.status, phase: l.stage || '', angelegt: l.created || '', gueltig: l.expires || '', via: l.via || '', du: !!l.du, runde: l.runde || 1, gesperrt: !!l.locked, plan: l.plan || [], gebaeude: globalThis.AW.lab('gebaeude', l.geb) || '', positionen: (am.windows || []).length, elemente: Number(am.elemente) || 0, fotos: Number(am.fotos) || 0, verlauf: { erstellt: log.erstellt || '', gesendet: log.gesendet || '', geoeffnet: log.geoeffnet || '', arbeit: log.arbeit || '', eingegangen: log.eingegangen || '', nachbesserung: log.nachbesserung || '' }, nachbesserungOffen: !!(l.nb && l.nb.offen) };
    if (einblick) Object.assign(p, { kunde: l.kunde || '', kontakt: l.kontakt || '', adresse: l.adresse || '', notiz: l.note || '', memo: l.memo || '', nachricht: l.msg || '', angaben: am.proj || null, fenster: l.locked ? [] : (am.windows || []).map(fensterKurz) });
    return p;
  });
}
function buchungen(a, einblick) {
  const nr = new Map((a.links || []).map((l) => [l.id, l.nr]));
  return (X().ledger(JSON.parse(JSON.stringify(a)))).map((b) => {
    const ref = String(b.ref || ''), runde = ref.includes('#') ? ref.split('#')[1] : '';
    const text = b.kind === 'aufmass' && !einblick ? 'Aufmaß · ' + (nr.get(ref.split('#')[0]) || 'Projekt') + (runde ? ', anderes Aufmaß in Runde ' + runde : '') : b.text;
    return { id: b.id, art: b.kind, wann: b.when || '', monat: b.month || '', text: text, sub: b.kind === 'aufmass' ? '' : b.sub || '', betrag: Number(b.betrag) || 0, status: b.status, rechnung: b.rechnung || '', hinweis: b.badge || '' };
  });
}
/* ---------- Auffälligkeiten gegen Mehrfachnutzung: Hinweise zum Prüfen, keine automatische Sperre ----------
   Kundenlinks (Zwischenstand, entwurf.js): viele angelegte oder gelöschte Fenster, Grenze von 50 erreicht, Fenster nach vier
   Änderungen fest, lange nicht gesendet. Käufe des Aufmaßblatts: mehrere Käufe mit derselben E-Mail (vielleicht ein Betrieb, der die
   Variante für Hauseigentümer nutzt). */
function linkAuffaellig(e, l, jetzt) {
  const m = e.meta || {}, angelegt = Number(m.angelegt) || 0, aktuell = Number(m.aktuell) || 0, geloescht = Math.max(0, angelegt - aktuell);
  const fest = Object.values(m.fenster || {}).filter((f) => (Number(f.aend) || 0) >= 4).length, gruende = [];
  if (angelegt >= 50) gruende.push('Grenze von 50 Fenstern erreicht'); else if (angelegt >= 30) gruende.push(angelegt + ' Fenster angelegt');
  if (geloescht >= 10) gruende.push(geloescht + ' Fenster gelöscht');
  if (fest) gruende.push(X().nW(fest, 'Fenster', 'Fenster') + ' nach vier Änderungen fest');
  const tage = Math.floor((jetzt - (Date.parse(e.created_at || '') || jetzt)) / TAG);
  if (gruende.length && !m.gesendet && !(l && l.status === 'eingegangen') && tage >= 14) gruende.push('seit ' + tage + ' Tagen nicht gesendet');
  return { code: e.code, nr: l ? l.nr || '' : '', kunde: l ? l.kunde || '' : '', angelegt: angelegt, aktuell: aktuell, geloescht: geloescht, fest: fest, gesendet: !!m.gesendet, gruende: gruende };
}
function kaeufeAuffaellig(kaeufe) {
  const je = new Map();
  kaeufe.filter((x) => x.status === 'bezahlt' && x.mail).forEach((x) => { const k2 = String(x.mail).trim().toLowerCase(); je.set(k2, (je.get(k2) || 0) + 1); });
  return Array.from(je.entries()).filter((x) => x[1] >= 3).sort((x, y) => y[1] - x[1]).map((x) => ({ mail: x[0], anzahl: x[1] }));
}
async function detail(ctx, row, einblick) {
  const a = row.daten || {}, v = a.verwaltung || {};
  const [auth, eintraege, entwuerfe] = await Promise.all([anmeldungLesen(ctx.k, row.auth_user).catch(() => null), ctx.sp.protokollLesen({ betrieb: row.id, anzahl: 50 }).catch(() => null), ctx.sp.entwuerfeVonBetrieb ? ctx.sp.entwuerfeVonBetrieb(row.id).catch(() => null) : null]);
  const jetzt = Date.now(), links = new Map((a.links || []).map((l) => [l.code, l]));
  const zwischen = (entwuerfe || []).map((e) => linkAuffaellig(e, links.get(e.code), jetzt));
  return Object.assign(zeile(row), {
    zwischenstaende: zwischen.map((x) => ({ nr: x.nr, kunde: einblick ? x.kunde : '', angelegt: x.angelegt, aktuell: x.aktuell, geloescht: x.geloescht, fest: x.fest, gesendet: x.gesendet, gruende: x.gruende })),
    seit: a.since || '', farbe: a.col || '', abzug: a.abzug || null, freiKontingent: X().freeQuota(a), freiGenutzt: a.freeUsed || 0,
    notiz: v.notiz || '', notizZeit: v.notizZeit || '', verlauf: (v.verlauf || []).slice(0, 30),
    projekte: projekte(a, einblick), buchungen: buchungen(a, einblick),
    rechnungen: (a.rechnungen || []).map((r) => ({ nr: r.nr, datum: r.datum, betrag: r.betrag, positionen: r.pos, status: r.status, url: r.url || '' })),
    nachrichten: einblick ? (a.notif || []).slice(0, 30).map((m) => ({ titel: m.t, text: m.s, wann: m.when, neu: !!m.new })) : null,
    anmeldung: auth ? { erstellt: auth.erstellt, zuletzt: auth.zuletzt, bestaetigt: auth.bestaetigt } : null,
    stripeLinks: { kunde: stripeLink(ctx.k, 'customers', row.stripe_customer), abo: stripeLink(ctx.k, 'subscriptions', row.stripe_subscription) },
    protokoll: eintraege, einblick: !!einblick
  });
}
const aendernVerwaltung = (sp, id, fn) => sp.betriebAendern(id, (a, row) => { a.verwaltung = a.verwaltung || {}; const r = fn(a, a.verwaltung, row); a.verwaltung.verlauf = (a.verwaltung.verlauf || []).slice(0, 50); return r; });
const vermerk = (v, art, text) => { (v.verlauf = v.verlauf || []).unshift({ zeit: new Date().toISOString(), art: art, text: str(text, 300) }); };

/* ---------- CSV (Excel, deutsch): Semikolon, UTF-8 mit BOM, keine Formeln aus Eingaben ---------- */
const csvFeld = (v) => { let s = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
const datumDE = (iso) => { const d = iso ? new Date(iso) : null; return d && !isNaN(d) ? d.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }) : ''; };
const zahlDE = (n) => String(rund(n)).replace('.', ',');

/* ---------- Wochen für die Übersicht (Montag bis Sonntag, deutsche Zeit grob) ---------- */
function wochen(anzahl) {
  const heute = new Date(tagBerlin() + 'T00:00:00Z'), wt = (heute.getUTCDay() + 6) % 7, montag = new Date(heute.getTime() - wt * TAG), out = [];
  for (let i = anzahl - 1; i >= 0; i--) { const s = new Date(montag.getTime() - i * 7 * TAG); out.push({ von: s.getTime(), bis: s.getTime() + 7 * TAG, start: s.toISOString().slice(0, 10), registrierungen: 0, aufmasse: 0, kaeufe: 0, projekte: 0 }); }
  return out;
}
const inWoche = (liste, zeit, feld) => { if (!zeit) return; const t = typeof zeit === 'number' ? zeit : Date.parse(zeit); const w = liste.find((x) => t >= x.von - 2 * 3600 * 1000 && t < x.bis - 2 * 3600 * 1000); if (w) w[feld]++; };
const parseStempel = (s, jahrHint) => { const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s || '')); return m ? Date.UTC(+m[3], +m[2] - 1, +m[1], 12) : null; };

export const ZENTRALE = {
  /* Ohne Anmeldung: ob die Zentrale eingerichtet ist, ob ein zweiter Faktor gebraucht wird, ob schon eine Sitzung besteht */
  'GET /api/zentrale/status': async (ctx) => {
    const z = ctx.k.zentrale, p = z.passwort ? await sitzungPruefen(ctx.k, cookieLesen(ctx.request)) : null;
    return { ok: true, eingerichtet: !!z.passwort, grund: z.grund || '', zweiFaktor: !!z.totp, angemeldet: !!p, bis: p ? p.exp : 0 };
  },
  'POST /api/zentrale/anmelden': async (ctx) => {
    const z = ctx.k.zentrale; if (!z.passwort) throw new ApiFehler('Die Zentrale ist noch nicht eingerichtet.', 503);
    const adresse = ip(ctx.request), netz = netzKurz(adresse);
    if (!erlaubt('zentrale:' + anschluss(adresse), 5, 15 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in 15 Minuten noch einmal.', 429);
    const b = ctx.body || {}, pwOk = await gleich(String(b.passwort || '').trim(), z.passwort);
    const codeOk = !z.totp || (pwOk && (await totpPruefen(z.totp, b.code)));
    if (!pwOk || !codeOk) {
      await new Promise((r) => setTimeout(r, 400));
      /* Einzeln protokolliert werden höchstens 30 Fehlversuche je Stunde und Instanz, danach je 25 weitere ein Sammeleintrag:
         So füllt niemand das Protokoll, und es geht trotzdem kein Versuch unter */
      if (erlaubt('zentrale-protokoll', 30, 3600 * 1000)) await protokoll(ctx.sp, 'anmeldung_fehlgeschlagen', null, !pwOk ? 'Passwort falsch' : 'Code falsch', { geraet: geraetVon(ctx.request) }, netz);
      else if (++fehlUeber % 25 === 0) await protokoll(ctx.sp, 'anmeldung_fehlgeschlagen', null, '25 weitere Fehlversuche (zusammengefasst, letzter von ' + (netz || 'unbekannt') + ')', { zusammengefasst: 25 }, netz);
      throw new ApiFehler(z.totp ? 'Passwort oder Code stimmt nicht.' : 'Das Passwort stimmt nicht.', 401);
    }
    await protokoll(ctx.sp, 'anmeldung', null, z.totp ? 'mit zweitem Faktor' : 'nur mit Passwort', { geraet: geraetVon(ctx.request) }, netz);
    return antwort({ ok: true, bis: Date.now() + DAUER, zweiFaktor: !!z.totp }, 200, { 'set-cookie': cookieSetzen(await sitzungAusstellen(ctx.k), DAUER / 1000) });
  },
  'POST /api/zentrale/abmelden': async () => antwort({ ok: true }, 200, { 'set-cookie': cookieSetzen('', 0) }),

  /* Übersicht: Kennzahlen, zwölf Wochen, letzte Vorgänge, Hinweise */
  'GET /api/zentrale/uebersicht': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), k = ctx.k, jetzt = Date.now();
    const [rows, kaeufe, web, entwuerfe] = await Promise.all([sp.betriebeAlle(), sp.zahlungenAlle().catch(() => []), auswerten(sp, 30).catch(() => null), sp.entwuerfeAlle ? sp.entwuerfeAlle().catch(() => null) : null]);
    const z = rows.map(zeile), alter = (iso) => (iso ? (jetzt - Date.parse(iso)) / TAG : Infinity), summe = (f) => z.reduce((s, x) => s + (Number(f(x)) || 0), 0);
    const bez = kaeufe.filter((x) => x.status === 'bezahlt'), tarife = { service: 0, abo: 0, plus: 0 }; z.forEach((x) => { tarife[x.tarif] = (tarife[x.tarif] || 0) + 1; });
    const w = wochen(12), aktivitaet = [];
    rows.forEach((r) => {
      inWoche(w, r.created_at, 'registrierungen'); aktivitaet.push({ zeit: r.created_at, art: 'registrierung', text: r.name + ' hat sich registriert', betrieb: r.id });
      ((r.daten || {}).links || []).forEach((l) => {
        if (l.demo) return;
        const angelegt = parseStempel(l.created); if (angelegt) inWoche(w, angelegt, 'projekte');
        if (l.status === 'eingegangen' && l.eingegangenAt) { inWoche(w, l.eingegangenAt, 'aufmasse'); aktivitaet.push({ zeit: new Date(l.eingegangenAt).toISOString(), art: 'aufmass', text: 'Aufmaß bei ' + r.name + ' eingegangen (' + (l.nr || 'Projekt') + ', ' + X().nW(((l.aufmass || {}).windows || []).length, 'Position', 'Positionen') + ')', betrieb: r.id }); }
      });
    });
    bez.forEach((x) => { inWoche(w, x.created_at, 'kaeufe'); aktivitaet.push({ zeit: x.created_at, art: 'kauf', text: 'Aufmaßblatt gekauft (' + zahlDE((x.betrag_cent || 0) / 100) + ' €)' }); });
    const aufmasse30 = rows.reduce((s, r) => s + ((r.daten || {}).links || []).filter((l) => l.status === 'eingegangen' && l.eingegangenAt && jetzt - l.eingegangenAt <= 30 * TAG).length, 0);
    const hinweise = [];
    if (!k.zentrale.totp) hinweise.push({ art: 'warn', text: 'Zweiter Faktor fehlt: Die Zentrale ist nur mit dem Passwort geschützt. Einrichten unter Einstellungen.', ziel: 'einstellungen' });
    if (k.zentrale.totpFehler) hinweise.push({ art: 'bad', text: 'ZENTRALE_2FA ist kein gültiger Schlüssel (Base32). Die Anmeldung braucht deshalb keinen Code.', ziel: 'einstellungen' });
    if (web && web.tabelle === false) hinweise.push({ art: 'warn', text: 'Die Statistik ist noch nicht eingerichtet: supabase/schema.sql einmal im SQL-Editor von Supabase ausführen.', ziel: 'einstellungen' });
    if (k.stripe && k.stripe.test) hinweise.push({ art: 'info', text: 'Stripe läuft im Testmodus: Zahlungen sind nicht echt.' });
    if (!k.indexierung) hinweise.push({ art: 'info', text: 'Die Seite ist für Suchmaschinen noch gesperrt (Pilotphase, Variable INDEXIERUNG).' });
    k.hinweise.forEach((t) => hinweise.push({ art: 'bad', text: t, ziel: 'einstellungen' }));
    const fehl = z.filter((x) => x.k.fehlgeschlagen > 0); if (fehl.length) hinweise.push({ art: 'bad', text: X().nW(fehl.length, 'Betrieb hat', 'Betriebe haben') + ' eine fehlgeschlagene Zahlung.', ziel: 'betriebe' });
    const warten = z.filter((x) => x.k.wartend > 0); if (warten.length) hinweise.push({ art: 'info', text: X().nW(warten.length, 'Betrieb hat', 'Betriebe haben') + ' Aufmaße, die auf eine Zahlungsart warten.', ziel: 'betriebe' });
    /* Mehrfachnutzung: auffällige Kundenlinks (je Link ein Hinweis, höchstens fünf) und Käufer mit mehreren Aufmaßblättern */
    if (entwuerfe === null && k.supabase) hinweise.push({ art: 'warn', text: 'Der Zwischenspeicher für Kundenlinks ist noch nicht eingerichtet: supabase/schema.sql noch einmal im SQL-Editor von Supabase ausführen.', ziel: 'einstellungen' });
    const byId = new Map(rows.map((r) => [r.id, r]));
    const auff = (entwuerfe || []).map((e) => { const r = byId.get(e.betrieb), l = r ? ((r.daten || {}).links || []).find((x) => x.code === e.code) : null; return Object.assign(linkAuffaellig(e, l, jetzt), { betrieb: e.betrieb, name: r ? r.name : '' }); }).filter((x) => x.gruende.length);
    auff.slice(0, 5).forEach((x) => hinweise.push({ art: 'warn', text: 'Mehrfachnutzung prüfen: ' + (x.name || 'Betrieb') + ', Projekt ' + (x.nr || '?') + ': ' + x.gruende.join(', ') + '.', ziel: 'betrieb/' + x.betrieb }));
    if (auff.length > 5) hinweise.push({ art: 'warn', text: 'Dazu ' + X().nW(auff.length - 5, 'weiterer auffälliger Kundenlink', 'weitere auffällige Kundenlinks') + '.', ziel: 'betriebe' });
    kaeufeAuffaellig(kaeufe).slice(0, 3).forEach((x) => hinweise.push({ art: 'warn', text: x.mail + ' hat ' + x.anzahl + ' Aufmaßblätter gekauft: vielleicht ein Betrieb, der die Variante für Hauseigentümer nutzt.', ziel: 'kaeufe' }));
    return {
      ok: true,
      kpi: {
        betriebe: z.length, neu7: z.filter((x) => alter(x.registriert) <= 7).length, neu30: z.filter((x) => alter(x.registriert) <= 30).length, aktiv30: z.filter((x) => alter(x.zuletzt) <= 30).length,
        gesperrt: z.filter((x) => x.gesperrt).length, mitZahlungsart: z.filter((x) => x.zahlungsart).length, doppelt: z.filter((x) => x.doppelt).length, tarife: tarife,
        mrr: rund(tarife.abo * k.preise.abo.grund + tarife.plus * k.preise.plus), mwst: k.preise.mwst,
        projekte: summe((x) => x.k.projekte), verschickt: summe((x) => x.k.verschickt), geoeffnet: summe((x) => x.k.geoeffnet), aufmasse: summe((x) => x.k.aufmasse), aufmasse30: aufmasse30,
        positionen: summe((x) => x.k.positionen), fotos: summe((x) => x.k.fotos), auftraege: summe((x) => x.k.auftraege), angebote: summe((x) => x.k.angebote),
        umsatzBetriebe: rund(summe((x) => x.k.umsatz)), bezahltBetriebe: rund(summe((x) => x.k.bezahlt)), offenBetriebe: rund(summe((x) => x.k.nochOffen)), berechnetBetriebe: rund(summe((x) => x.k.berechnet)),
        kaeufe: bez.length, kaeufe30: bez.filter((x) => alter(x.created_at) <= 30).length, umsatzKaeufe: rund(bez.reduce((s, x) => s + (x.betrag_cent || 0), 0) / 100), umsatzKaeufe30: rund(bez.filter((x) => alter(x.created_at) <= 30).reduce((s, x) => s + (x.betrag_cent || 0), 0) / 100)
      },
      wochen: w.map((x) => ({ start: x.start, registrierungen: x.registrierungen, projekte: x.projekte, aufmasse: x.aufmasse, kaeufe: x.kaeufe })),
      web: web && web.tabelle ? { aufrufe30: web.summe.aufrufe, besuche30: web.summe.besuche, heute: web.reihe[web.reihe.length - 1], herkunft: web.herkunft.slice(0, 5), reihe: web.reihe } : null,
      aktivitaet: aktivitaet.filter((x) => x.zeit).sort((x, y) => String(y.zeit).localeCompare(String(x.zeit))).slice(0, 12),
      hinweise: hinweise
    };
  },

  /* Betriebe: Liste mit Kennzahlen (Filter und Suche macht die Oberfläche) */
  'GET /api/zentrale/betriebe': async (ctx) => { await zugang(ctx); const rows = await daten(ctx).betriebeAlle(); return { ok: true, betriebe: rows.map(zeile), preise: ctx.k.preise }; },
  'GET /api/zentrale/betriebe.csv': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), rows = await sp.betriebeAlle();
    const kopf = ['Betrieb', 'Ansprechpartner', 'E-Mail (Anmeldung)', 'E-Mail (Kontakt)', 'Telefon', 'PLZ', 'Registriert', 'Zuletzt aktiv', 'Tarif', 'Zahlungsart', 'Projekte', 'Links verschickt', 'Aufmaße eingegangen', 'Positionen', 'Aufträge', 'Umsatz netto (€)', 'davon bezahlt (€)', 'noch nicht berechnet (€)', 'Gesperrt', 'Doppelkonto-Verdacht'];
    const zeilen = rows.map(zeile).map((x) => [x.name, x.ap, x.mail, x.kontaktMail, x.tel, x.plz, datumDE(x.registriert), datumDE(x.zuletzt), X().planName(x.tarif), x.zahlungsart ? x.zahlungsart.art : '', x.k.projekte, x.k.verschickt, x.k.aufmasse, x.k.positionen, x.k.auftraege, zahlDE(x.k.umsatz), zahlDE(x.k.bezahlt), zahlDE(x.k.nochOffen), x.gesperrt ? 'ja' : '', x.doppelt ? 'ja (' + x.doppelt + ')' : '']);
    await protokoll(sp, 'liste_export', null, X().nW(rows.length, 'Betrieb', 'Betriebe') + ' als CSV');
    const text = '\ufeff' + [kopf].concat(zeilen).map((r) => r.map(csvFeld).join(';')).join('\r\n') + '\r\n';
    return new Response(text, { status: 200, headers: { 'content-type': 'text/csv; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'content-disposition': 'attachment; filename="eeziframes-betriebe-' + tagBerlin() + '.csv"' } });
  },
  'GET /api/zentrale/betriebe/:id': async (ctx) => { await zugang(ctx); const row = await betriebLaden(ctx); return { ok: true, betrieb: await detail(ctx, row, false), zweiFaktor: !!ctx.k.zentrale.totp }; },
  /* Einblick in die Daten der Endkunden: nur mit zweitem Faktor und Begründung, im Protokoll vermerkt */
  'POST /api/zentrale/betriebe/:id/einblick': async (ctx) => {
    await zugang(ctx);
    if (!ctx.k.zentrale.totp) throw new ApiFehler('Für den Einblick in Daten der Endkunden ist der zweite Faktor nötig (Einstellungen → Zweiter Faktor).', 403);
    const grund = str((ctx.body || {}).grund, 300); if (grund.length < 5) throw new ApiFehler('Bitte den Anlass angeben, etwa „Support-Anfrage des Betriebs vom …“.');
    const row = await betriebLaden(ctx);
    await frischerCode(ctx, 'einblick', true);
    await protokollPflicht(ctx.sp, 'einblick', row.id, grund, { betrieb: row.name });
    return { ok: true, betrieb: await detail(ctx, row, true) };
  },
  /* Datenexport für den Betrieb (Art. 15 und 20 DSGVO): enthält die Daten seiner Kunden, deshalb wie der Einblick nur mit zweitem
     Faktor, frischem Code und Anlass, und erst nach dem Eintrag im Protokoll. Gesperrte (noch nicht bezahlte) Aufmaße nur als Umriss. */
  'POST /api/zentrale/betriebe/:id/export': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), sp = ctx.sp, grund = str((ctx.body || {}).grund, 300);
    if (!ctx.k.zentrale.totp) throw new ApiFehler('Der Export enthält Daten der Kunden des Betriebs und braucht deshalb den zweiten Faktor (Einstellungen → Zweiter Faktor).', 403);
    if (grund.length < 5) throw new ApiFehler('Bitte den Anlass angeben, etwa „Auskunftsersuchen des Betriebs vom …“.');
    await frischerCode(ctx, 'export', true);
    const eintraege = ((await sp.protokollLesen({ betrieb: row.id, anzahl: 500 }).catch(() => null)) || []).filter((e) => !/^anmeldung/.test(e.art)).map((e) => ({ zeit: e.zeit, art: e.art, text: e.text }));
    await protokollPflicht(sp, 'export', row.id, grund, { betrieb: row.name });
    const daten = Object.assign({}, sicht(row).acc, { verwaltung: (row.daten || {}).verwaltung });
    const inhalt = { erstellt: new Date().toISOString(), hinweis: 'Alle bei eeziframes gespeicherten Daten dieses Kontos (Auskunft nach Art. 15 und Datenübertragbarkeit nach Art. 20 DSGVO). Aufmaße, die noch auf eine Zahlungsart warten, stehen wie im Konto nur als Umriss darin. Zahlungsdaten liegen bei Stripe; Rechnungen kommen von dort.', konto: { id: row.id, firma: row.name, mail: row.mail, plz: row.plz, registriert: row.created_at, geaendert: row.updated_at, stripe_kunde: row.stripe_customer || null, stripe_abo: row.stripe_subscription || null }, daten: daten, eingriffe: eintraege };
    const name = 'eeziframes-export-' + String(row.name || 'betrieb').toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) + '-' + tagBerlin() + '.json';
    return new Response(JSON.stringify(inhalt, null, 2), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'content-disposition': 'attachment; filename="' + name.replace(/[^\w.-]/g, '-') + '"' } });
  },
  'POST /api/zentrale/betriebe/:id/sperren': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), grund = str((ctx.body || {}).grund, 300);
    if (grund.length < 5) throw new ApiFehler('Bitte eine Begründung angeben. Der Betrieb sieht sie beim Anmelden.');
    await aendernVerwaltung(ctx.sp, row.id, (a, v) => { v.sperre = { seit: new Date().toISOString(), grund: grund }; vermerk(v, 'gesperrt', grund); });
    await protokoll(ctx.sp, 'sperren', row.id, grund, { betrieb: row.name });
    return { ok: true, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  'POST /api/zentrale/betriebe/:id/entsperren': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), text = str((ctx.body || {}).text, 300);
    await aendernVerwaltung(ctx.sp, row.id, (a, v) => { delete v.sperre; vermerk(v, 'entsperrt', text); melden(a, { t: 'Ihr Zugang ist wieder frei', s: 'Ihr Konto und Ihre Kundenlinks funktionieren wieder.', to: ['links'], von: 'eeziframes' }); });
    await protokoll(ctx.sp, 'entsperren', row.id, text || 'entsperrt', { betrieb: row.name });
    return { ok: true, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  'POST /api/zentrale/betriebe/:id/notiz': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), text = str((ctx.body || {}).text, 2000);
    await aendernVerwaltung(ctx.sp, row.id, (a, v) => { v.notiz = text; v.notizZeit = new Date().toISOString(); });
    await protokoll(ctx.sp, 'notiz', row.id, text ? 'Notiz geändert' : 'Notiz gelöscht', { betrieb: row.name });
    return { ok: true, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  /* Kostenlose Projekte gutschreiben (Kulanz): wartende Aufmaße werden damit sofort frei */
  'POST /api/zentrale/betriebe/:id/gutschrift': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), n = Math.max(1, Math.min(50, parseInt((ctx.body || {}).anzahl, 10) || 0)), grund = str((ctx.body || {}).grund, 200);
    const frei = await aendernVerwaltung(ctx.sp, row.id, (a, v) => {
      a.freeQuota = X().freeQuota(a) + n; const f = X().unlockWaiting(a);
      vermerk(v, 'gutschrift', n + ' kostenlose Projekte' + (grund ? ': ' + grund : ''));
      melden(a, { t: X().nW(n, 'kostenloses Projekt', 'kostenlose Projekte') + ' gutgeschrieben', s: f ? X().nW(f, 'wartendes Aufmaß ist', 'wartende Aufmaße sind') + ' jetzt freigeschaltet.' : (X().konto(a) === 'service' ? 'Sie gelten für Ihre nächsten Aufmaße im Tarif Start.' : 'Sie gelten, sobald Sie wieder im Tarif Start sind.'), to: ['abrechnung'], von: 'eeziframes' });
      return f;
    });
    await protokoll(ctx.sp, 'gutschrift', row.id, X().nW(n, 'kostenloses Projekt', 'kostenlose Projekte') + (grund ? ': ' + grund : ''), { betrieb: row.name, anzahl: n, freigeschaltet: frei });
    return { ok: true, freigeschaltet: frei, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  /* Doppelkonto-Verdacht aufheben: das Konto bekommt die üblichen kostenlosen Projekte */
  'POST /api/zentrale/betriebe/:id/doppelkonto': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx);
    if (!(row.daten || {}).dupOf) throw new ApiFehler('Für diesen Betrieb besteht kein Doppelkonto-Verdacht.');
    const frei = await aendernVerwaltung(ctx.sp, row.id, (a, v) => {
      const war = a.dupOf; delete a.dupOf; delete a.freeQuota; const f = X().unlockWaiting(a);
      vermerk(v, 'doppelkonto', 'Verdacht aufgehoben (war: ' + war + ')');
      melden(a, { t: 'Kostenlose Projekte freigeschaltet', s: 'Ihre ersten ' + X().preise().frei + ' Projekte sind kostenlos.' + (f ? ' ' + X().nW(f, 'wartendes Aufmaß ist', 'wartende Aufmaße sind') + ' jetzt sichtbar.' : ''), to: ['abrechnung'], von: 'eeziframes' });
      return f;
    });
    await protokoll(ctx.sp, 'doppelkonto', row.id, 'Doppelkonto-Verdacht aufgehoben', { betrieb: row.name, freigeschaltet: frei });
    return { ok: true, freigeschaltet: frei, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  /* Nachricht ins Konto des Betriebs (erscheint bei seinen Mitteilungen) */
  'POST /api/zentrale/betriebe/:id/nachricht': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), b = ctx.body || {}, titel = str(b.titel, 80), text = str(b.text, 600);
    if (titel.length < 3 || text.length < 3) throw new ApiFehler('Bitte Betreff und Text eingeben.');
    await aendernVerwaltung(ctx.sp, row.id, (a, v) => { melden(a, { t: titel, s: text, to: ['links'], von: 'eeziframes' }); vermerk(v, 'nachricht', titel); });
    await protokoll(ctx.sp, 'nachricht', row.id, titel, { betrieb: row.name });
    return { ok: true, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  /* Abo: zum Monatsende kündigen (wie der Betrieb selbst) oder sofort beenden */
  'POST /api/zentrale/betriebe/:id/abo': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), aktion = (ctx.body || {}).aktion === 'beenden' ? 'beenden' : 'kuendigen';
    if (!row.stripe_subscription && X().konto(row.daten || {}) === 'service') throw new ApiFehler('Dieser Betrieb hat kein Abo.');
    if ((row.stripe_subscription || row.stripe_customer) && !ctx.zd) throw new ApiFehler('Stripe ist nicht verbunden (STRIPE_SECRET_KEY).', 503);
    if (aktion === 'beenden') {
      if (ctx.zd) await ctx.zd.kundeAbosBeenden(row.stripe_customer, row.stripe_subscription, true); // nur Abo-Kassen verfallen lassen
      await ctx.sp.betriebFelder(row.id, { stripe_subscription: null });
      await aendernVerwaltung(ctx.sp, row.id, (a, v) => { a.konto = 'service'; a.downgrade = null; vermerk(v, 'abo', 'Abo sofort beendet'); melden(a, { t: 'Abo beendet', s: 'Ihr Tarif ist jetzt Start: ' + X().preise().projekt + ' € je Projekt mit eingegangenem Aufmaß.', to: ['abrechnung'], von: 'eeziframes' }); });
    } else {
      if (row.stripe_subscription) await ctx.zd.aboKuendigen(row.stripe_subscription, false);
      await aendernVerwaltung(ctx.sp, row.id, (a, v) => { const w = X().planWechsel(a, 'service'); vermerk(v, 'abo', 'Abo zum Monatsende gekündigt'); melden(a, { t: 'Abo gekündigt', s: w.msg || 'Ihr Abo endet zum Monatsende.', to: ['abrechnung'], von: 'eeziframes' }); });
    }
    await protokoll(ctx.sp, 'abo', row.id, aktion === 'beenden' ? 'Abo sofort beendet' : 'Abo zum Monatsende gekündigt', { betrieb: row.name, abo: row.stripe_subscription || '' });
    return { ok: true, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  /* Offene Buchungen dieses Betriebs jetzt als Sammelrechnung (sonst am 1. und 15.) */
  'POST /api/zentrale/betriebe/:id/abrechnen': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx);
    if (!ctx.zd) throw new ApiFehler('Stripe ist nicht verbunden (STRIPE_SECRET_KEY).', 503);
    const r = await abrechnungslauf(ctx.k, ctx.sp, ctx.zd, row.id);
    if (r.rechnungen) await zaehlen(ctx.k, ctx.sp, new Array(r.rechnungen).fill('ereignis:sammelrechnung'));
    await protokoll(ctx.sp, 'abrechnung', row.id, r.rechnungen ? 'Sammelrechnung erstellt' : r.fehler ? 'Abrechnung fehlgeschlagen' : 'nichts abzurechnen', { betrieb: row.name, ergebnis: r });
    if (r.fehler && !r.rechnungen) throw new ApiFehler('Abrechnung fehlgeschlagen' + (r.meldung ? ': ' + r.meldung : '. Die Buchungen bleiben offen.'), 502);
    return { ok: true, ergebnis: r, betrieb: await detail(ctx, await ctx.sp.betriebHolen(row.id), false) };
  },
  /* Konto löschen (Art. 17 DSGVO): Abo endet sofort, Anmeldung und Konto werden gelöscht, der Löschnachweis bleibt im Protokoll */
  'POST /api/zentrale/betriebe/:id/loeschen': async (ctx) => {
    await zugang(ctx); const row = await betriebLaden(ctx), b = ctx.body || {}, norm = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!row.name || norm(b.bestaetigung) !== norm(row.name)) throw new ApiFehler('Zur Bestätigung bitte den Namen des Betriebs genau eintippen.');
    await frischerCode(ctx, 'loeschen', false);
    const grund = str(b.grund, 300), a = row.daten || {};
    if ((row.stripe_subscription || row.stripe_customer) && !ctx.zd) throw new ApiFehler('Stripe ist nicht verbunden: laufende Abos ließen sich nicht beenden. Nichts wurde gelöscht.', 503);
    /* Reihenfolge: zuerst die Anmeldung (scheitert das, ist noch nichts passiert), dann Abos und offene Kassen bei Stripe, dann das Konto */
    const weg = await anmeldungLoeschen(ctx.k, row.auth_user);
    if (!weg.ok) throw new ApiFehler('Die Anmeldung bei Supabase ließ sich nicht löschen (' + weg.status + '). Nichts wurde gelöscht; bitte noch einmal versuchen.', 502);
    let abos = [];
    try { abos = ctx.zd ? await ctx.zd.kundeAbosBeenden(row.stripe_customer, row.stripe_subscription) : []; }
    catch (e) { throw new ApiFehler('Die Anmeldung ist gelöscht, aber Stripe hat die Abos nicht beendet (' + String(e.message || e).slice(0, 120) + '). Das Konto steht noch da; bitte noch einmal löschen.', 502); }
    const offen = rund((a.book || []).filter((x) => x.status === 'offen' && Number(x.betrag) > 0).reduce((s, x) => s + Number(x.betrag), 0));
    await ctx.sp.betriebLoeschen(row.id);
    const nachweis = await protokoll(ctx.sp, 'loeschen', row.id, 'Konto gelöscht' + (grund ? ': ' + grund : ''), { betrieb: row.name, registriert: row.created_at, stripe_kunde: row.stripe_customer || '', abos_beendet: abos, rechnungen: (a.rechnungen || []).map((r) => ({ nr: r.nr, datum: r.datum, betrag: r.betrag, status: r.status })), nicht_berechnet: offen });
    return { ok: true, geloescht: row.name, nichtBerechnet: offen, stripeKunde: row.stripe_customer || '', stripeLink: stripeLink(ctx.k, 'customers', row.stripe_customer), nachweis: nachweis };
  },

  /* Käufe des Aufmaßblatts (Hauseigentümer) */
  'GET /api/zentrale/kaeufe': async (ctx) => {
    await zugang(ctx); const z = await daten(ctx).zahlungenAlle(), jetzt = Date.now(), bez = z.filter((x) => x.status === 'bezahlt'), j30 = bez.filter((x) => jetzt - Date.parse(x.created_at) <= 30 * TAG);
    return { ok: true, kaeufe: z.slice(0, 1000).map((x) => ({ zeit: x.created_at, mail: x.mail || '', betrag: rund((x.betrag_cent || 0) / 100), status: x.status, kennung: x.kennung || '', sitzung: x.stripe_session })), summe: { anzahl: bez.length, umsatz: rund(bez.reduce((s, x) => s + (x.betrag_cent || 0), 0) / 100), anzahl30: j30.length, umsatz30: rund(j30.reduce((s, x) => s + (x.betrag_cent || 0), 0) / 100), offen: z.length - bez.length }, test: !!(ctx.k.stripe && ctx.k.stripe.test), stripe: ctx.k.stripe ? 'https://dashboard.stripe.com/' + (ctx.k.stripe.test ? 'test/' : '') + 'payments' : '' };
  },
  /* Anmeldungen ohne Betrieb: E-Mail bestätigt, Registrierung nicht abgeschlossen (werden nach 30 Tagen von selbst gelöscht) */
  'GET /api/zentrale/anmeldungen': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx);
    if (!ctx.k.supabase) return { ok: true, liste: [], attrappe: true };
    const [nutzer, rows] = await Promise.all([anmeldungenAlle(ctx.k), sp.betriebeAlle()]);
    if (!nutzer) throw new ApiFehler('Supabase Auth antwortet nicht.', 502);
    const mit = new Set(rows.map((r) => r.auth_user).filter(Boolean)), jetzt = Date.now();
    return { ok: true, liste: nutzer.filter((u) => !mit.has(u.id)).map((u) => Object.assign({}, u, { tage: Math.floor((jetzt - Date.parse(u.erstellt || new Date().toISOString())) / TAG) })).sort((x, y) => String(y.erstellt).localeCompare(String(x.erstellt))) };
  },
  'POST /api/zentrale/anmeldungen/:uid/loeschen': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), uid = str(ctx.params.uid, 80);
    if (!/^[0-9a-f-]{36}$/i.test(uid)) throw new ApiFehler('Unbekannte Anmeldung.', 404);
    if (await sp.betriebNachAuth(uid)) throw new ApiFehler('Zu dieser Anmeldung gehört ein Betrieb. Bitte den Betrieb löschen.');
    const r = await anmeldungLoeschen(ctx.k, uid); if (!r.ok) throw new ApiFehler('Supabase hat die Anmeldung nicht gelöscht (' + r.status + ').', 502);
    await protokoll(sp, 'anmeldung_geloescht', null, 'Anmeldung ohne Betrieb gelöscht', { nutzer: uid });
    return { ok: true };
  },

  'GET /api/zentrale/statistik': async (ctx) => { await zugang(ctx); return auswerten(daten(ctx), ctx.url.searchParams.get('tage')); },
  'GET /api/zentrale/protokoll': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx), von = Math.max(0, parseInt(ctx.url.searchParams.get('von'), 10) || 0), art = str(ctx.url.searchParams.get('art'), 40);
    const liste = await sp.protokollLesen({ von: von, anzahl: 100, art: /^[a-z_]+$/.test(art) ? art : '' });
    return liste === null ? { ok: true, tabelle: false, eintraege: [] } : { ok: true, tabelle: true, eintraege: liste, von: von, weitere: liste.length === 100 };
  },
  'GET /api/zentrale/einstellungen': async (ctx) => {
    const p = await zugang(ctx), k = ctx.k, s = k.stripe;
    let statistik = null, protokollTab = null;
    if (ctx.sp) {
      try { statistik = (await ctx.sp.statistikLesen(tagBerlin())) !== null; } catch (e) { statistik = false; }
      try { protokollTab = (await ctx.sp.protokollLesen({ anzahl: 1 })) !== null; } catch (e) { protokollTab = false; }
    }
    const projekt = k.supabase ? (/^https:\/\/([a-z0-9]+)\.supabase\.co$/.exec(k.supabase.url) || [])[1] || '' : '';
    return {
      ok: true,
      dienste: { ki: k.ki, zahlung: { an: k.zahlung, attrappe: k.zahlungAttrappe, test: !!(s && s.test), webhook: !!(s && s.webhook) }, daten: { an: k.daten, art: ctx.sp ? ctx.sp.art : '' }, statistik: statistik, protokoll: protokollTab },
      hinweise: k.hinweise, zentrale: { zweiFaktor: !!k.zentrale.totp, totpFehler: k.zentrale.totpFehler, sitzungBis: p.exp },
      preise: k.preise, indexierung: k.indexierung,
      links: { stripe: s ? 'https://dashboard.stripe.com/' + (s.test ? 'test/' : '') : '', supabase: projekt ? 'https://supabase.com/dashboard/project/' + projekt : '', cloudflare: 'https://dash.cloudflare.com/?to=/:account/workers/services/view/fenstero/production/settings' }
    };
  },
  /* Sammelrechnungen für alle Betriebe jetzt (sonst am 1. und 15. um 3 Uhr UTC) */
  'POST /api/zentrale/abrechnung': async (ctx) => {
    await zugang(ctx); const sp = daten(ctx); if (!ctx.zd) throw new ApiFehler('Stripe ist nicht verbunden (STRIPE_SECRET_KEY).', 503);
    const r = await abrechnungslauf(ctx.k, sp, ctx.zd);
    if (r.rechnungen) await zaehlen(ctx.k, sp, new Array(r.rechnungen).fill('ereignis:sammelrechnung'));
    await protokoll(sp, 'abrechnung', null, 'Abrechnungslauf von Hand: ' + X().nW(r.rechnungen || 0, 'Rechnung', 'Rechnungen') + (r.fehler ? ', ' + r.fehler + ' Fehler' : ''), { ergebnis: r });
    return { ok: true, ergebnis: r };
  }
};

/* Aufräumen (Cron in worker.js, mit dem Abrechnungslauf): Protokoll nach Frist, nicht abgeschlossene Käufe nach 30 Tagen,
   Anmeldungen ohne Betrieb nach 30 Tagen ohne Nutzung. Schlägt etwas fehl, wird nichts gelöscht und beim nächsten Lauf neu versucht. */
export async function aufraeumen(k, sp) {
  if (!sp) return { ok: false };
  const jetzt = Date.now(), out = { ok: true, protokoll: false, kassen: false, anmeldungen: 0, entwuerfe: 0 };
  try { out.protokoll = await sp.protokollAufraeumen(new Date(jetzt - 90 * TAG).toISOString(), new Date(jetzt - 3 * 365 * TAG).toISOString()); } catch (e) { out.ok = false; }
  try { out.kassen = await sp.zahlungenAufraeumen(new Date(jetzt - 30 * TAG).toISOString()); } catch (e) { out.ok = false; }
  if (k.supabase) {
    try {
      const [nutzer, rows] = await Promise.all([anmeldungenAlle(k), sp.betriebeAlle()]);
      if (nutzer && Array.isArray(rows)) {
        const mit = new Set(rows.map((r) => r.auth_user).filter(Boolean));
        for (const u of nutzer) {
          const zuletzt = Math.max(Date.parse(u.erstellt || '') || jetzt, Date.parse(u.zuletzt || '') || 0);
          if (mit.has(u.id) || jetzt - zuletzt < 30 * TAG || out.anmeldungen >= 20) continue; // höchstens 20 je Lauf (Grenze für Unteranfragen)
          if (await sp.betriebNachAuth(u.id)) continue; // frisch registriert, während der Lauf lief
          if ((await anmeldungLoeschen(k, u.id)).ok) out.anmeldungen++;
        }
      }
    } catch (e) { out.ok = false; }
  }
  /* Zwischenstände der Kundenlinks (entwurf.js): weg, wenn Betrieb oder Link weg sind; wenn der Link abgelaufen oder deaktiviert
     ist (30 Tage nach der letzten Änderung, so kann der Betrieb noch verlängern); wenn das Aufmaß eingegangen ist und keine
     Nachbesserung mehr möglich ist (30 Tage nach dem Eingang oder alle Runden genutzt); spätestens nach 180 Tagen ohne Änderung.
     Höchstens 200 je Lauf. */
  try {
    const liste = await sp.entwuerfeAlle();
    if (Array.isArray(liste) && liste.length) {
      const byId = new Map(((await sp.betriebeAlle()) || []).map((r) => [r.id, r]));
      for (const e of liste) {
        if (out.entwuerfe >= 200) break;
        const row = byId.get(e.betrieb), l = row ? ((row.daten || {}).links || []).find((x) => x.code === e.code) : null, still = jetzt - (Date.parse(e.updated_at || '') || jetzt);
        let weg = !row || !l || still > 180 * TAG;
        if (!weg) {
          const zu = X().linkZu(l, jetzt), ein = Number(l.eingegangenAt) || 0;
          if ((zu === 'abgelaufen' || zu === 'deaktiviert') && still > 30 * TAG) weg = true;
          if (zu === 'eingegangen' && ((l.runde || 1) > X().NB_MAX || (ein && jetzt - ein > X().NB_TAGE * TAG))) weg = true;
        }
        if (weg && (await sp.entwurfLoeschen(e.code))) out.entwuerfe++;
      }
    }
  } catch (e) { out.ok = false; }
  if (out.anmeldungen) await protokoll(sp, 'aufraeumen', null, X().nW(out.anmeldungen, 'Anmeldung', 'Anmeldungen') + ' ohne Betrieb gelöscht (30 Tage ungenutzt)');
  return out;
}

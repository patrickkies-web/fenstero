/* eeziframes · Einstellungen des Servers aus den Umgebungsvariablen (Cloudflare: Einstellungen → Variablen und Geheimnisse)

   Geheimnisse (Typ Secret):
     ANTHROPIC_API_KEY        KI-Auswertung der Fotos
     STRIPE_SECRET_KEY        Zahlungen (sk_test_… zum Testen, sk_live_… für echtes Geld; eingeschränkte Schlüssel rk_… gehen auch)
     STRIPE_WEBHOOK_SECRET    Unterschrift der Stripe-Webhooks (whsec_…), je Modus ein eigenes
     SUPABASE_URL             https://<projekt>.supabase.co
     SUPABASE_SECRET_KEY      geheimer Schlüssel sb_secret_… (nur hier, nie im Browser); alter Name SUPABASE_SERVICE_KEY,
                              dort geht auch noch der frühere service_role-Schlüssel (eyJ…, Supabase schafft ihn bis Ende 2026 ab)
     SUPABASE_PUBLISHABLE_KEY optional, sb_publishable_… (alter Name SUPABASE_ANON_KEY); ohne ihn nimmt die Anmeldung den geheimen
     FREISCHALT_GEHEIMNIS     beliebiger langer Zufallstext; unterschreibt die Freischalt-Nachweise für bezahlte Aufmaßblätter
     ZENTRALE_PASSWORT        Passwort der Zentrale des Inhabers (/zentrale/), mindestens 12 Zeichen; ohne bleibt die Zentrale zu
     ZENTRALE_2FA             optional, empfohlen: Schlüssel für eine Authenticator-App (Base32, erzeugt die Zentrale unter
                              Einstellungen → Zweiter Faktor); dann braucht die Anmeldung zusätzlich den sechsstelligen Code
     MAIL_API_KEY             E-Mails des Servers über Resend (post.js, Schlüssel re_…): Vertragsbestätigung nach dem Kauf,
                              Eingangsbestätigung eines Widerrufs

   Variablen (Typ Text):
     MAIL_ABSENDER            bei Resend bestätigte Absenderadresse, z. B. ask@eeziframes.com (Pflicht, wenn MAIL_API_KEY gesetzt ist)
     MAIL_KONTAKT             Postfach für Kopien an den Betreiber (eingegangene Widerrufe); ohne: die Adresse aus anbieter.js (wie im Impressum)
     MWST                     Pflicht vor dem Verkauf mit echtem Geld: 0 = Kleinunternehmerregelung (§ 19 UStG, keine Umsatzsteuer, Hinweis
                              auf jeder Rechnung), 19 = 19 % Umsatzsteuer. Ohne Angabe rechnet die Vorschau mit 19 %, die Kasse im Live-Modus
                              bleibt zu (recht.js), damit niemand versehentlich Umsatzsteuer ausweist, die er nicht schuldet (§ 14c UStG)
     ZAHLARTEN                Zahlungsarten an der Kasse des Aufmaßblatts, durch Komma getrennt: card (Karte, dazu Apple Pay und Google Pay
                              auf passenden Geräten), paypal, klarna; Standard card. Die App nennt sie vor dem Kauf (§ 312j Abs. 1 BGB);
                              in Stripe müssen sie unter Einstellungen → Zahlungsmethoden eingeschaltet sein
     PREIS_AUFMASS_CENT 799 · PREIS_PROJEKT 9 · FREI_PROJEKTE 3 · PREIS_ABO 49 · ABO_INKL 10 · PREIS_ABO_EXTRA 5 · PREIS_PLUS 79
                              (Einführungspreise bis 17.11.2026; ab 18.11.2026 ohne Angabe 1299, 69 und 119, siehe EINFUEHRUNG unten.
                              Wer PREIS_AUFMASS_CENT, PREIS_ABO oder PREIS_PLUS setzt, schaltet den Wechsel ab; /api/status weist darauf hin)
     JETZT                    nur für die Prüfung: Zeitpunkt (ISO), an dem der Server sich wähnt, etwa für den Einführungspreis
     Nur falls eigene Objekte in Stripe genutzt werden sollen; sonst legt der Server Preise und Steuersätze selbst an (stripe.js):
     STRIPE_PRICE_AUFMASS     Preis-ID des Aufmaßblatts (sonst wird der Betrag je Kauf gesetzt, PREIS_AUFMASS_CENT)
     STRIPE_PRICE_ABO         Preis-ID „Abo 10“ (monatlich)
     STRIPE_PRICE_PLUS        Preis-ID „Plus“ (monatlich)
     STRIPE_TAX_RATE          Steuersatz-ID 19 % exklusiv (Rechnungen an Betriebe)
     STRIPE_TAX_RATE_INKL     Steuersatz-ID 19 % inklusiv (Aufmaßblatt)
     STATISTIK_KAMPAGNEN      eigene Kampagnen-Namen für ?utm_source=…, durch Komma getrennt (bekannte wie newsletter, flyer, facebook
                              zählen ohnehin einzeln, alles andere als „Kampagne (andere)“), siehe functions/api/statistik.js
     ZAHLUNG_ATTRAPPE=1 / DATEN_ATTRAPPE=1 / MAIL_ATTRAPPE=1   nur lokal zum Testen: Stripe, Datenbank bzw. Mailversand werden nachgestellt */
import { ANBIETER } from './anbieter.js';

const num = (v, d) => { const n = Number(v); return v !== undefined && v !== '' && !isNaN(n) ? n : d; };
/* Rolle aus einem früheren Supabase-Schlüssel (JWT, eyJ…) lesen, ohne ihn zu prüfen: nur um anon und service_role zu unterscheiden */
function jwtRolle(t) { try { if (!/^eyJ/.test(t)) return ''; const m = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(atob(m + '==='.slice((m.length + 3) % 4))).role || ''; } catch (e) { return ''; } }
/* Neue Supabase-Schlüssel gehören nur in den Kopf apikey, nicht in Authorization (sie sind kein JWT) */
export const sbNeu = (schluessel) => /^sb_(secret|publishable)_/.test(String(schluessel || ''));
/* Einführungspreis zum Start: Käufe und Abschlüsse bis einschließlich 17. November 2026 (deutsche Zeit) zu den Startpreisen, ab
   18. November 0:00 Uhr gelten von selbst die regulären. Die Seiten nennen bis dahin beide (functions/seo.js tauscht die festen
   Texte am Stichtag, AGB und Nutzungsbedingungen nennen beide Zeiträume selbst); laufende Abos behalten bei Stripe ihren Preis */
export const EINFUEHRUNG = { bis: '2026-11-17', ende: '2026-11-17T23:00:00Z', vorher: { aufmass: 7.99, abo: 49, plus: 79 }, danach: { aufmass: 12.99, abo: 69, plus: 119 } };
export const jetztAus = (env) => { const t = env && env.JETZT ? Date.parse(env.JETZT) : NaN; return Number.isNaN(t) ? Date.now() : t; };
export const einfuehrungLaeuft = (env) => jetztAus(env) < Date.parse(EINFUEHRUNG.ende);
export function konfig(env) {
  env = env || {};
  const hinweise = []; // häufige Verwechslungen beim Eintragen, /api/status zeigt sie an (ohne Werte)
  const einf = einfuehrungLaeuft(env), eigenePreise = ['PREIS_AUFMASS_CENT', 'PREIS_ABO', 'PREIS_PLUS'].filter((n) => env[n] != null && String(env[n]).trim() !== '');
  const stufe = einf ? EINFUEHRUNG.vorher : EINFUEHRUNG.danach;
  if (einf && eigenePreise.length) hinweise.push(eigenePreise.join(', ') + ': gesetzt, deshalb gilt dieser Preis auch nach dem Einführungspreis (ab 18.11.2026). Für den Wechsel auf die regulären Preise die Variable löschen.');
  const schluessel = String(env.STRIPE_SECRET_KEY || '').trim();
  if (/^pk_/.test(schluessel)) hinweise.push('STRIPE_SECRET_KEY: Das ist der veröffentlichbare Schlüssel (pk_…). Gebraucht wird der Geheimschlüssel (sk_… oder rk_…).');
  const stripe = schluessel && !/^pk_/.test(schluessel) ? { key: schluessel, test: /^(sk|rk)_test_/.test(schluessel), webhook: String(env.STRIPE_WEBHOOK_SECRET || '').trim(), preisAufmass: env.STRIPE_PRICE_AUFMASS || '', preisAbo: env.STRIPE_PRICE_ABO || '', preisPlus: env.STRIPE_PRICE_PLUS || '', steuer: env.STRIPE_TAX_RATE || '', steuerInkl: env.STRIPE_TAX_RATE_INKL || '' } : null;
  if (stripe && stripe.webhook && !/^whsec_/.test(stripe.webhook)) hinweise.push('STRIPE_WEBHOOK_SECRET: beginnt nicht mit whsec_. Eingetragen gehört der Signatur-Geheimschlüssel des Ereignisziels.');
  /* Supabase: neue Schlüssel (sb_secret_…, sb_publishable_…) oder die früheren (eyJ…, service_role bzw. anon); die Adresse auch mit /rest/v1 am Ende */
  const sbUrl = String(env.SUPABASE_URL || '').trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
  const sbGeheim = String(env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_KEY || '').trim(), sbOffen = String(env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || '').trim();
  let sbOk = !!(sbUrl && sbGeheim);
  if (sbUrl && !sbGeheim) hinweise.push('Supabase: SUPABASE_SECRET_KEY fehlt noch.');
  if (sbGeheim && !sbUrl) hinweise.push('Supabase: SUPABASE_URL fehlt noch.');
  if (sbUrl && !/^https:\/\//.test(sbUrl)) hinweise.push('SUPABASE_URL: Erwartet wird die Adresse https://<projekt>.supabase.co.');
  if (/^sb_publishable_/.test(sbGeheim) || jwtRolle(sbGeheim) === 'anon') { hinweise.push('SUPABASE_SECRET_KEY: Das ist der öffentliche Schlüssel (sb_publishable_… bzw. anon). Gebraucht wird der geheime (sb_secret_… bzw. service_role).'); sbOk = false; }
  const supabase = sbOk ? { url: sbUrl, service: sbGeheim, anon: sbOffen || sbGeheim } : null;
  const zahlungAttrappe = env.ZAHLUNG_ATTRAPPE === '1', datenAttrappe = env.DATEN_ATTRAPPE === '1';
  /* Zentrale des Inhabers: offen nur mit einem Passwort ab 12 Zeichen; der zweite Faktor ist ein Base32-Schlüssel (TOTP, RFC 6238).
     Diese Angaben verlassen den Server nie, auch nicht als Hinweis in /api/status (die Zentrale meldet sich selbst unter /api/zentrale/status). */
  const zPw = String(env.ZENTRALE_PASSWORT || '').trim(), zTotp = String(env.ZENTRALE_2FA || '').replace(/[\s-]/g, '').replace(/=+$/, '').toUpperCase();
  const totpOk = /^[A-Z2-7]{16,128}$/.test(zTotp);
  /* Ein eingetragener, aber ungültiger zweiter Faktor schließt die Zentrale (lieber zu als nur mit Passwort offen) */
  const zentrale = { passwort: zPw.length >= 12 && !(zTotp && !totpOk) ? zPw : '', grund: !zPw ? 'fehlt' : zPw.length < 12 ? 'zu_kurz' : zTotp && !totpOk ? '2fa_ungueltig' : '', totp: totpOk ? zTotp : '', totpFehler: !!zTotp && !totpOk };
  /* Mailversand (post.js): Schlüssel als Secret, Absender als Text; ohne gültigen Absender verschickt der Server nichts */
  const mailKey = String(env.MAIL_API_KEY || '').trim(), mailAb = String(env.MAIL_ABSENDER || '').trim().toLowerCase(), mailKontakt = String(env.MAIL_KONTAKT || '').trim().toLowerCase();
  const adresse = (m) => /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/.test(m);
  if (mailKey && !/^re_/.test(mailKey)) hinweise.push('MAIL_API_KEY: beginnt nicht mit re_. Eingetragen gehört ein API-Schlüssel von Resend (API Keys → Create API Key).');
  if (mailKey && !adresse(mailAb)) hinweise.push('MAIL_ABSENDER: fehlt oder ist keine E-Mail-Adresse. Eingetragen gehört eine Adresse der bei Resend bestätigten Domain.');
  if (mailKontakt && !adresse(mailKontakt)) hinweise.push('MAIL_KONTAKT: ist keine E-Mail-Adresse.');
  /* Umsatzsteuer: nur 0 oder 19 gelten als festgelegt (1 als ältere Schreibweise für 19) */
  const mwstRoh = String(env.MWST == null ? '' : env.MWST).trim(), mwstGesetzt = ['0', '19', '1'].includes(mwstRoh);
  if (mwstRoh && !mwstGesetzt) hinweise.push('MWST: erlaubt sind 0 (Kleinunternehmerregelung, keine Umsatzsteuer) oder 19 (19 % Umsatzsteuer).');
  /* Zahlungsarten der Kasse des Aufmaßblatts: nur solche, die sofort bestätigen (das Blatt wird sofort geliefert) */
  const zRoh = String(env.ZAHLARTEN || 'card').split(',').map((z) => z.trim().toLowerCase()).filter(Boolean), zOk = zRoh.filter((z) => ZAHLARTEN_OK.includes(z));
  if (zRoh.some((z) => !ZAHLARTEN_OK.includes(z))) hinweise.push('ZAHLARTEN: erlaubt sind ' + ZAHLARTEN_OK.join(', ') + ' (durch Komma getrennt).');
  const zahlarten = zOk.length ? Array.from(new Set(zOk)) : ['card'];
  const mailAttrappe = env.MAIL_ATTRAPPE === '1' && !mailKey;
  const post = (mailKey && adresse(mailAb)) || mailAttrappe ? { key: mailKey, absender: mailAb || 'kontakt@eeziframes.invalid', kontakt: adresse(mailKontakt) ? mailKontakt : (ANBIETER.mail || mailAb || 'kontakt@eeziframes.invalid'), attrappe: mailAttrappe } : null;
  return {
    stripe: stripe, zahlungAttrappe: zahlungAttrappe, zahlung: !!(stripe || zahlungAttrappe),
    supabase: supabase, datenAttrappe: datenAttrappe, daten: !!(supabase || datenAttrappe),
    zentrale: zentrale, indexierung: String(env.INDEXIERUNG || '') === '1', post: post,
    ki: !!env.ANTHROPIC_API_KEY, mwstGesetzt: mwstGesetzt, zahlarten: zahlarten,
    geheimnis: env.FREISCHALT_GEHEIMNIS || env.STRIPE_SECRET_KEY || 'eeziframes-pilot', hinweise: hinweise,
    preise: { aufmass: num(env.PREIS_AUFMASS_CENT, Math.round(stufe.aufmass * 100)) / 100, projekt: num(env.PREIS_PROJEKT, 9), frei: num(env.FREI_PROJEKTE, 3), abo: { grund: num(env.PREIS_ABO, stufe.abo), inkl: num(env.ABO_INKL, 10), extra: num(env.PREIS_ABO_EXTRA, 5) }, plus: num(env.PREIS_PLUS, stufe.plus), mwst: mwstRoh !== '0' },
    /* solange er läuft und keine eigenen Preise gesetzt sind: Stichtag und Preise danach für die Hinweise in App und Betriebsbereich */
    einfuehrung: einf && !eigenePreise.length ? { bis: EINFUEHRUNG.bis, ende: EINFUEHRUNG.ende, danach: EINFUEHRUNG.danach } : null
  };
}
export const ZAHLARTEN_OK = ['card', 'paypal', 'klarna'];
/* Live-Modus von Stripe: echtes Geld (sk_live_…, rk_live_…) */
export const live = (k) => !!(k && k.stripe && !k.stripe.test);
export const json = (obj, status, extra) => new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }, extra || {}) });
export const fehler = (text, status) => json({ ok: false, fehler: text }, status || 400);
/* extra: zusätzliche Felder der Fehlerantwort, z. B. { gesperrt: true } */
export class ApiFehler extends Error { constructor(text, status, extra) { super(text); this.status = status || 400; this.extra = extra || null; } }
export const b64url = (bytes) => btoa(String.fromCharCode.apply(null, Array.from(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export async function hmac(geheimnis, text) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(geheimnis), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text)));
}
export const hex = (bytes) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
export const zufall = (n) => b64url(crypto.getRandomValues(new Uint8Array(n || 12)));
/* Bremse je IP-Adresse, nur im Arbeitsspeicher dieser Instanz */
const zaehler = new Map();
export function erlaubt(schluessel, max, fensterMs) {
  const jetzt = Date.now(), e = zaehler.get(schluessel), liste = (e ? e.t : []).filter((t) => jetzt - t < fensterMs);
  zaehler.delete(schluessel); // neu einreihen: vorn stehen dann die am längsten ruhenden Schlüssel
  if (liste.length >= max) { zaehler.set(schluessel, { t: liste, f: fensterMs }); return false; }
  liste.push(jetzt); zaehler.set(schluessel, { t: liste, f: fensterMs });
  if (zaehler.size > 5000) zaehlerKuerzen(zaehler, jetzt, schluessel);
  return true;
}
/* Zu viele Schlüssel: erst die abgelaufenen weg, dann die am längsten ruhenden bis auf 4000, nie alle (sonst ließe sich jede Bremse
   mit vielen Anfragen zurücksetzen). Die Schlüssel sind Anschlüsse (IPv6 je /64), viele davon hat nur, wer ohnehin viele Adressen hat. */
export function zaehlerKuerzen(m, jetzt, ausser) {
  for (const [k, v] of m) if (k !== ausser && !v.t.some((t) => jetzt - t < v.f)) m.delete(k);
  for (const k of m.keys()) { if (m.size <= 4000) break; if (k !== ausser) m.delete(k); }
}
/* Nur nachsehen, ob eine Bremse schon voll ist (zählt nichts); gezählt wird dann mit erlaubt(), etwa nur bei Fehlversuchen */
export function voll(schluessel, max, fensterMs) {
  const jetzt = Date.now();
  return ((zaehler.get(schluessel) || {}).t || []).filter((t) => jetzt - t < fensterMs).length >= max;
}
/* Kundenlinks ohne Anmeldung (der Code ist der Schlüssel): je Anschluss höchstens 240 Anfragen und 30 unbekannte Codes in
   10 Minuten, damit niemand Codes durchprobiert */
const ZEHN_MIN = 10 * 60 * 1000;
export function linkBremse(request) {
  const a = anschluss(ip(request));
  if (!erlaubt('lk:' + a, 240, ZEHN_MIN) || voll('lk404:' + a, 30, ZEHN_MIN)) throw new ApiFehler('Zu viele Anfragen. Bitte gleich noch einmal.', 429);
}
export function linkUnbekannt(request, text) { erlaubt('lk404:' + anschluss(ip(request)), 30, ZEHN_MIN); return new ApiFehler(text || 'Diesen Link gibt es nicht.', 404); }
export const ip = (request) => request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unbekannt';
/* Für Bremsen: der Anschluss statt der einzelnen Adresse (IPv6 je /64), sonst brächte jede neue Adresse aus demselben Netz frische Versuche */
export const quelle = (request) => anschluss(ip(request));
/* Gekürzte IP-Adresse fürs Protokoll der Zentrale: IPv4 auf /24, IPv6 auf /48 (der Anschluss ist so nicht mehr bestimmbar) */
export function netzKurz(adresse) {
  const a = String(adresse || '').split(',')[0].trim().replace(/^::ffff:(\d{1,3}(\.\d{1,3}){3})$/i, '$1');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(a)) return a.split('.').slice(0, 3).join('.') + '.0/24';
  if (a.includes(':')) { const t = a.split('::')[0].split(':').filter(Boolean).slice(0, 3); return t.length ? t.join(':') + '::/48' : ''; }
  return '';
}
/* Schlüssel für Bremsen je Anschluss: IPv4 die Adresse, IPv6 das /64-Netz (ein Anschluss hat dort viele Adressen) */
export function anschluss(adresse) {
  const a = String(adresse || '').split(',')[0].trim().replace(/^::ffff:(\d{1,3}(\.\d{1,3}){3})$/i, '$1');
  if (!a.includes(':')) return a;
  const [vorn, hinten] = a.split('::'), v = vorn ? vorn.split(':') : [], h = hinten !== undefined ? (hinten ? hinten.split(':') : []) : null;
  const voll = h === null ? v : v.concat(new Array(Math.max(0, 8 - v.length - h.length)).fill('0'), h);
  return voll.slice(0, 4).map((x) => x.toLowerCase().replace(/^0+(?=.)/, '')).join(':') + '::/64';
}
/* Vergleich zweier Geheimnisse in gleichbleibender Zeit (über ihre SHA-256-Werte, damit auch die Länge nichts verrät) */
export async function gleich(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(String(a))), crypto.subtle.digest('SHA-256', enc.encode(String(b)))]);
  const p = new Uint8Array(x), q = new Uint8Array(y); let d = 0;
  for (let i = 0; i < p.length; i++) d |= p[i] ^ q[i];
  return d === 0;
}

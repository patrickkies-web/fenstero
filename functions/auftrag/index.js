/* eeziframes · Aufträge: Bestellung einer Landingpage mit Konfigurator (Pakete aus pakete.js), Kundenbereich und Zentrale des Inhabers
   Seiten: /bestellen/ (Bestellung je Paket), /konto/ (Kundenbereich), /zentrale/ (Inhaber). Regeln: web/assets/auftragsregeln.js.
   Ablauf: Der Fensterbauer meldet sich mit einem Code per E-Mail an (das ist zugleich die Registrierung), füllt die Stationen aus und
   bestellt; die Einrichtung zahlt er bei Stripe. Der Auftrag liegt dann im Eingang der Zentrale. Der Inhaber baut die Landingpage aus der
   Vorlage des Pakets (der Knopf „Prompt kopieren“ fasst alle Angaben zusammen), stellt eine Vorschau bereit, der Kunde gibt frei, der
   Inhaber schaltet live, das Monatsabo startet. Alle Angaben bleiben im Kundenbereich änderbar; nach der Zahlung sieht der Inhaber
   jede Änderung als „geändert“ im Eingang.
   Routen (JSON; Besitz jedes Auftrags wird geprüft, fremde antworten 404):
     GET  /api/auftrag/stand                          öffentlich: Kasse offen?, Fassung der Paketbedingungen, MwSt.
     POST /api/auftrag/frage                          öffentlich: Frage von der Seite für Fensterbauer (auch als Formular)
     POST /api/auftrag/code { mail } · POST /api/auftrag/anmelden { mail, code } · POST /api/auftrag/abmelden
     GET  /api/auftrag/ich                            angemeldet?, Aufträge, ungelesene Nachrichten
     POST /api/auftrag/neu { paket, weg }             Entwurf anlegen (höchstens GRENZEN.offeneEntwuerfe)
     PATCH /api/auftrag/:id { paket?, weg?, angaben? } Angaben speichern (je Teil geprüft; vor der Zahlung auch mit Lücken, Antwort
                                                      nennt sie in fehler); Paket nur vor der Zahlung
     POST/GET/DELETE /api/auftrag/:id/datei[/:did]    Logo, Porträt, sechs Fotos, weitere Dateien
     POST /api/auftrag/adresse { name, id? }          Name unter eeziframes.com frei?
     POST /api/auftrag/:id/bestellen { zustimmung }   Kasse bei Stripe (oder unverbindlich anfragen, solange die Kasse zu ist)
     GET  /api/auftrag/:id/kasse?session=             Rückkehr aus der Kasse
     POST /api/auftrag/:id/freigabe { aktion, text }  Vorschau freigeben oder Änderungen wünschen
     GET/POST /api/auftrag/:id/nachrichten            Nachrichten mit dem Inhaber
     POST /api/auftrag/:id/wechsel { paket }          Paketwechsel anfragen (nach der Zahlung)
     POST /api/auftrag/:id/stornieren                 bezahlt, noch nicht begonnen: stornieren, Einrichtung zurück (§ 7 Abs. 2)
     POST /api/auftrag/:id/verwerfen                  Entwurf oder Anfrage löschen
     POST /api/auftrag/portal                         Kundenportal von Stripe (Rechnungen, Zahlungsmittel, Kündigung)
     GET  /api/inhaber/stand · POST /api/inhaber/anmelden { passwort, code } · POST /api/inhaber/abmelden
     GET  /api/inhaber/auftraege · GET /api/inhaber/auftraege/:id · GET /api/inhaber/auftraege/:id/datei/:did
     POST /api/inhaber/auftraege/:id/stand { stand, link?, text? } · …/nachricht { text } · …/notiz { text } · …/gesehen
   Webhook (über /api/zahlung/webhook): istAuftragEreignis(ev), auftragEreignis(ctx, ev). Tageslauf: auftraegeLauf(k). */
import '../../web/assets/pakete.js';
import '../../web/assets/auftragsregeln.js';
import '../../web/assets/instanzregeln.js';
import { ApiFehler, erlaubt, quelle, hmac, hex, gleich, zufall, live } from '../api/umgebung.js';
import { sitzungSetzen, sitzungLesen, sitzungPflicht, sitzungLoeschen } from '../api/sitzung.js';
import { postDienst, esc, mailOk as mailPruefen } from '../api/post.js';
import { ablage } from '../api/fotos.js';
import { PAKET_STAND, paketVerkaufStand, standText, paketPdfs } from '../api/recht.js';
import { daten } from './daten.js';
import { codeMail, bestelltMail, inhaberNeuMail, standMail, nachrichtMail, frageMail, rahmen } from './mails.js';
import { SICHERHEIT, SPERRE } from '../seo.js';
import { kasse, kassePruefen, aboStarten, aboBeenden, portal, erstatten, mwst } from './zahlung.js';

const P = () => globalThis.Pakete;
const AU = () => globalThis.Auftrag;
const G = () => globalThis.Auftrag.GRENZEN;
const ZEIT = () => new Date().toISOString();
const MIN = 60000;
const BEARBEITBAR = ['entwurf', 'angefragt', 'bezahlt', 'in_arbeit', 'vorschau', 'live', 'pausiert'];
const VOR_ZAHLUNG = ['entwurf', 'angefragt'];
const euro = (n) => { n = Number(n) || 0; return (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + ' €'; };
const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, n);

function db(ctx) { const d = daten(ctx.k); if (!d) throw new ApiFehler('Die Datenbank ist hier noch nicht eingerichtet (SUPABASE_URL, SUPABASE_SECRET_KEY).', 503); return d; }
const datei = (ctx) => ablage(ctx.k, 'auftraege');
const pd = (ctx) => postDienst(ctx.k);
const basis = (ctx) => ctx.url.origin;

/* ---------- Sicht für den Kunden ---------- */
function adresseText(a) {
  const ad = (a.angaben || {}).adresse || {}, m = P().merkmale(a.paket) || {};
  if (!m.domain) return ad.name ? ad.name + '.' + AU().BASIS : '';
  return (ad.domains || [])[0] || (ad.vorschlaege ? 'Vorschlag folgt' : '');
}
function sicht(a, o) {
  o = o || {};
  const z = a.zahlung || {}, v = a.vorschau || {};
  const s = {
    id: a.id, nr: a.nr, paket: a.paket, paketName: (P().PAKETE[a.paket] || {}).name || a.paket, weg: a.weg || 'ausfuehrlich', stand: a.stand,
    angaben: a.angaben || {}, dateien: (a.dateien || []).map((d) => ({ id: d.id, platz: d.platz, name: d.name, typ: d.typ, bytes: d.bytes, zeit: d.zeit })),
    preise: a.preise || null, adresse: adresseText(a), zustimmung: a.zustimmung || null,
    zahlung: { status: z.status || '', betrag_cent: z.betrag_cent || 0, bezahlt_am: z.bezahlt_am || '', erstattet: !!z.erstattet },
    abo: { status: (a.abo || {}).status || '', bis: (a.abo || {}).bis || '', seit: (a.abo || {}).seit || '' },
    vorschau: { link: v.link || '', seit: v.seit || '', freigabe: v.freigabe || null, aenderung: v.aenderung || null, live: v.live || '' },
    verlauf: (a.verlauf || []).map((x) => ({ zeit: x.zeit, stand: x.stand || '', von: x.von, text: x.text })), created_at: a.created_at, updated_at: a.updated_at,
    geaendert: a.angaben_geaendert || ''
  };
  if (o.inhaber) Object.assign(s, { kunde: o.kunde || null, notiz: a.notiz || '', gesehen: a.gesehen || '', zahlungIntern: { session: z.session || '', intent: z.intent || '', kunde: z.kunde || '' }, abo: Object.assign({}, a.abo || {}) });
  return s;
}
const verlauf = (z, eintrag) => { (z.verlauf = z.verlauf || []).push(Object.assign({ zeit: ZEIT() }, eintrag)); if (z.verlauf.length > 200) z.verlauf = z.verlauf.slice(-200); };

/* ---------- Anmeldung des Kunden per Code ----------
   Code: 6 Ziffern, 15 Minuten, gespeichert nur als HMAC (Adresse und Code), höchstens 5 Fehlversuche. Mit DATEN_ATTRAPPE gilt 123456. */
const codeHash = (ctx, mail, code) => hmac(ctx.k.sitzung.geheimnis || 'ohne', 'auftrag-code|' + mail + '|' + code).then(hex);
async function codeSchicken(ctx) {
  const mail = String((ctx.body || {}).mail || '').trim().toLowerCase();
  if (!AU().mailOk(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.', 400, { feld: 'mail' });
  if (!erlaubt('acode:' + mail, 5, 15 * MIN) || !erlaubt('acodeip:' + quelle(ctx.request), 20, 15 * MIN)) throw new ApiFehler('Zu viele Codes in kurzer Zeit. Bitte in ein paar Minuten noch einmal.', 429);
  const d = db(ctx), post = pd(ctx);
  if (!post && !ctx.k.datenAttrappe) throw new ApiFehler('Der Mailversand ist hier noch nicht eingerichtet (MAIL_API_KEY).', 503);
  const code = ctx.k.datenAttrappe ? '123456' : String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
  await d.codeSetzen(mail, { hash: await codeHash(ctx, mail, code), bis: new Date(Date.now() + 15 * MIN).toISOString(), fehl: 0 });
  if (post) { const m = codeMail(code); const r = await post.senden({ an: mail, betreff: m.betreff, html: m.html }); if (!r.ok && !ctx.k.datenAttrappe) throw new ApiFehler('Die Mail mit dem Code ging gerade nicht raus. Bitte gleich noch einmal.', 502); }
  return { ok: true };
}
async function anmelden(ctx) {
  const b = ctx.body || {}, mail = String(b.mail || '').trim().toLowerCase(), code = String(b.code || '').replace(/\s/g, '');
  if (!AU().mailOk(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.', 400, { feld: 'mail' });
  if (!/^\d{6}$/.test(code)) throw new ApiFehler('Bitte den sechsstelligen Code aus der E-Mail eingeben.', 400, { feld: 'code' });
  if (!erlaubt('aanm:' + quelle(ctx.request), 30, 15 * MIN)) throw new ApiFehler('Zu viele Versuche. Bitte in ein paar Minuten noch einmal.', 429);
  const d = db(ctx), c = await d.codeHolen(mail);
  if (!c || !(Date.parse(c.bis) > Date.now())) throw new ApiFehler('Der Code ist abgelaufen. Bitte einen neuen anfordern.', 401, { feld: 'code', neu: true });
  if (!(await gleich(c.hash, await codeHash(ctx, mail, code)))) {
    const n = await d.codeFehler(mail); if (n >= 5) await d.codeLoeschen(mail);
    throw new ApiFehler(n >= 5 ? 'Zu viele falsche Versuche. Bitte einen neuen Code anfordern.' : 'Der Code stimmt nicht. Bitte noch einmal prüfen.', 401, { feld: 'code', neu: n >= 5 });
  }
  await d.codeLoeschen(mail);
  let kunde = await d.kundeNachMail(mail);
  if (!kunde) kunde = await d.kundeAnlegen({ mail: mail });
  await d.kundeAendern(kunde.id, { angemeldet_am: ZEIT() }).catch(() => null);
  return new Response(JSON.stringify({ ok: true, mail: mail }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': await sitzungSetzen(ctx, 'kunde', { sub: kunde.id, mail: mail }) } });
}
/* Storno mit Erstattung und Kundenportal nur mit frischer Anmeldung (sitzung.js, FRISTEN.frischMinuten) */
async function frischPflicht(ctx) { const s = await sitzungPflicht(ctx, 'kunde'); if (!s.frisch) throw new ApiFehler('Bitte bestätigen Sie diesen Schritt mit einem neuen Code.', 401, { frisch: true }); }
async function kundeVon(ctx) { const s = await sitzungPflicht(ctx, 'kunde'); const k = await db(ctx).kundeHolen(s.sub); if (!k) throw new ApiFehler('Bitte neu anmelden.', 401, { anmelden: true }); return k; }
async function eigener(ctx, kunde) { const a = await db(ctx).auftragHolen(ctx.params.id); if (!a || a.kunde !== kunde.id) throw new ApiFehler('Diesen Auftrag gibt es nicht.', 404); return a; }

/* ---------- Dateien: Typ aus den ersten Bytes, nie aus dem Namen ---------- */
function typVon(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.length > 12 && String.fromCharCode.apply(null, b.slice(0, 4)) === 'RIFF' && String.fromCharCode.apply(null, b.slice(8, 12)) === 'WEBP') return 'image/webp';
  if (b.length > 4 && String.fromCharCode.apply(null, b.slice(0, 4)) === '%PDF') return 'application/pdf';
  const kopf = new TextDecoder().decode(b.slice(0, 600)).replace(/^﻿/, '').trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(kopf)) return 'image/svg+xml';
  return '';
}
const base64Bytes = (s) => { try { const t = atob(String(s || '').replace(/^data:[^,]*,/, '')); const b = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) b[i] = t.charCodeAt(i); return b; } catch (e) { return null; } };
const dateiPfad = (a, did) => 'auftrag/' + a.id + '/' + did;
function dateiAntwort(bytes, d, herunter) {
  const kopf = { 'content-type': d.typ, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox" };
  if (herunter || !/^image\/(png|jpeg|webp)$/.test(d.typ)) kopf['content-disposition'] = 'attachment; filename="' + String(d.name || 'datei').replace(/[^\w.\- äöüÄÖÜß]/g, '_') + '"';
  return new Response(bytes, { headers: kopf });
}

/* ---------- Verkauf ---------- */
async function verkaufStand(ctx) {
  const v = await paketVerkaufStand(ctx.k, ctx.env, basis(ctx)).catch(() => ({ bereit: false, fehlt: ['Prüfung fehlgeschlagen'] }));
  return AU().verkauf({ offen: ctx.k.paketeOffen, live: live(ctx.k), bereit: v.bereit });
}

/* ---------- Bezahlt festhalten (Rückkehr aus der Kasse und Webhook, auch beide zugleich; nur das erste Mal schickt Mails) ---------- */
async function bezahltFesthalten(ctx, a, r) {
  let erstes = false;
  const neu = await db(ctx).auftragAendern(a.id, (z) => {
    if ((z.zahlung || {}).status === 'bezahlt') return false;
    if (['entwurf', 'angefragt'].indexOf(z.stand) < 0) return false;
    z.zahlung = Object.assign({}, z.zahlung, { status: 'bezahlt', bezahlt_am: ZEIT(), betrag_cent: r.betragCent || (z.zahlung || {}).betrag_cent || Math.round(Number((z.preise || {}).einrichtung || 0) * (100 + Number((z.preise || {}).mwst || 0))), intent: r.intent || '', zahlungsmittel: r.zahlungsmittel || '', kunde: r.kunde || (z.zahlung || {}).kunde || '' });
    z.stand = 'bezahlt'; verlauf(z, { stand: 'bezahlt', von: 'system', text: 'Einrichtung bezahlt' }); erstes = true;
  });
  if (!erstes || !neu) return neu || (await db(ctx).auftragHolen(a.id));
  const kunde = await db(ctx).kundeHolen(neu.kunde);
  if (kunde && r.kunde && !kunde.stripe) await db(ctx).kundeAendern(kunde.id, { stripe: r.kunde }).catch(() => null);
  ctx.waitUntil(inhaberMelden(ctx, neu, false).catch(() => false));
  ctx.waitUntil(kundeMelden(ctx, neu, 'bezahlt', {}).catch(() => false));
  return neu;
}
async function bestaetigen(ctx, a, kunde) {
  const post = pd(ctx); if (!post) return false;
  const pr = a.preise || P().preis(a.paket), steuer = mwst(ctx) ? ' netto zzgl. 19 % USt.' : ' (ohne Umsatzsteuer)';
  const m = bestelltMail(a, { paketName: (P().PAKETE[a.paket] || {}).name, adresse: adresseText(a), einrichtung: euro(pr.einrichtung) + steuer, monat: euro(pr.monat) + steuer, stand: standText(PAKET_STAND), konto: basis(ctx) + '/konto/#auftrag/' + a.id });
  const anhaenge = [];
  for (const p of paketPdfs()) { try { const r = await ctx.env.ASSETS.fetch(new Request(basis(ctx) + p)); if (r.status === 200) { const b = new Uint8Array(await r.arrayBuffer()); let t = ''; for (let i = 0; i < b.length; i += 8192) t += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); anhaenge.push({ filename: p.split('/').pop(), content: btoa(t), content_type: 'application/pdf' }); } } catch (e) { /* ohne Anhang */ } }
  return post.senden({ an: kunde.mail, betreff: m.betreff, html: m.html, anhaenge: anhaenge, idempotenz: 'auftrag-bestellt-' + a.id });
}
async function inhaberMelden(ctx, a, angefragt) {
  const post = pd(ctx); if (!post) return false;
  const m = inhaberNeuMail(a, { paketName: (P().PAKETE[a.paket] || {}).name, adresse: adresseText(a), angefragt: angefragt, zentrale: basis(ctx) + '/zentrale/#auftrag/' + a.id });
  return post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, idempotenz: 'auftrag-neu-' + a.id + (angefragt ? '-a' : '') });
}
async function kundeMelden(ctx, a, stand, o) {
  const post = pd(ctx); if (!post) return false;
  const kunde = await db(ctx).kundeHolen(a.kunde); if (!kunde) return false;
  const m = standMail(a, stand, Object.assign({ konto: basis(ctx) + '/konto/#auftrag/' + a.id }, o || {})); if (!m) return false;
  return post.senden({ an: kunde.mail, betreff: m.betreff, html: m.html, antwortAn: post.kontakt });
}

/* ---------- Prompt für die Landingpage (Zentrale, „Prompt kopieren“) ---------- */
export function promptFuer(a, kunde) {
  const g = a.angaben || {}, b = g.betrieb || {}, ad = g.adresse || {}, t = g.auftritt || {}, m = P().merkmale(a.paket) || {}, name = (P().PAKETE[a.paket] || {}).name;
  const vorlage = { essential: 'essential', plus: 'plus', signature: 'signature' }[a.paket] || a.paket;
  const dat = (a.dateien || []), hat = (k) => dat.some((d) => d.platz === k);
  const fotos = AU().FOTO_PLAETZE.map((f) => f.titel + (hat(f.k) ? ' (da)' : ' (fehlt)')).join(', ');
  const z = [];
  z.push('Erstelle die Landingpage für Auftrag ' + a.nr + ' (' + name + ').');
  z.push('Vorlage: Paket-Vorlage ' + vorlage + ' (docs/profis/' + vorlage + '-vorschau/, Beispiel Fensterbau Brandt), gebaut mit docs/profis/werkzeuge/paketvorlagen.py als neuer Betrieb.');
  z.push('Betrieb: ' + (b.firma || '–') + ' · auf der Seite „' + (b.name || '–') + '“ · Ort ' + (b.ort || '–') + (b.region ? ' · Einzugsgebiet „' + b.region + '“' : ''));
  z.push('Ansprechperson: ' + (b.ap || '–') + (b.rolle ? ', ' + b.rolle : '') + ' · Telefon ' + (b.tel || '–') + ' · E-Mail ' + (b.mail || '–') + ' · Anschrift ' + [b.strasse, (b.plz || '') + ' ' + (b.ort || '')].filter(Boolean).join(', '));
  if (b.erreichbar) z.push('Erreichbarkeit: „' + b.erreichbar + '“');
  z.push('Adresse: ' + (m.domain ? (ad.art === 'eigene' ? 'Domain des Kunden, nach Absprache anbinden (Paketbedingungen § 6 Abs. 3): ' : 'neu registrieren (bis 25 € netto im Jahr): ') + ((ad.domains || []).join(', ') || 'Domain vorschlagen') + (ad.vorschlaege ? ' (Kunde wünscht Vorschläge)' : '') : (ad.name ? ad.name + '.eeziframes.com' : '–')));
  if (b.rueckruf) z.push('Anruf nach der Zahlung (Paketbedingungen § 5): „' + b.rueckruf + '“');
  if (b.web) z.push('Website des Kunden: ' + b.web + (a.weg === 'schnell' || t.ausWebsite ? ' — Texte, Bilder und Farben von dort übernehmen, wo unten etwas fehlt' : ''));
  z.push('Weg: ' + (a.weg === 'schnell' ? 'Schnell (der Kunde hat nur das Nötigste angegeben; Texte und Bildauswahl übernehme ich)' : 'Ausführlich'));
  if (AU().gestaltet(m)) {
    z.push('Farben: ' + ((t.farben || []).join(', ') || 'keine angegeben') + (t.farbenWebsite ? ' (von der Website übernehmen)' : '') + ' · Stufe: ' + (m.farbwelt === 'voll' ? 'ganze Seite in der Palette des Betriebs' : 'zur Hälfte in der Palette des Betriebs') + ' (Muster docs/profis/werkzeuge/farben-brandt.css)');
    z.push('Texte: Überschrift „' + (t.ueberschrift || '–') + '“; Einleitung „' + (t.einleitung || '–') + '“; Leistungen „' + (t.leistungTitel || '–') + '“ / „' + (t.leistungText || '–') + '“' + (m.einladungslinks ? '; Einladungstext „' + (t.einladung || '–') + '“' : ''));
    z.push('Dateien (in der Zentrale herunterladen): Logo ' + (hat('logo') ? 'da' : 'fehlt') + ' · Porträt ' + (hat('portrait') ? 'da' : 'fehlt') + ' · Fotos: ' + fotos + (hat('weitere') ? ' · weitere Dateien da' : ''));
  }
  if (m.dashboard) z.push('Team für das Dashboard: ' + ((ad.team || []).join(', ') || '–'));
  z.push('Anfragen gehen an: ' + ((ad.eingang || []).join(', ') || '–'));
  if (t.notiz) z.push('Hinweise des Kunden: ' + t.notiz);
  z.push('Impressum: ' + [b.firma, b.rechtsform, 'vertreten durch ' + (b.vertretung || '–'), b.register, b.ust ? 'USt-IdNr. ' + b.ust : '', b.kammer, b.beruf].filter(Boolean).join(' · ') + ' · Bundesland ' + (AU().BUNDESLAENDER[b.bundesland] || '–'));
  z.push('Kunde: ' + ((kunde && kunde.mail) || '–') + ' · Auftrag in der Zentrale: /zentrale/#auftrag/' + a.id);
  z.push('');
  z.push('Danach: Vorschau als Artifact, Link in der Zentrale unter „Vorschau“ eintragen. MASTER-ANHÄNGSEL anhängen.');
  return z.join('\n');
}

/* ---------- Frage ohne Konto (Seite für Fensterbauer, auch als Formular ohne JavaScript) ----------
   Felder: name, firma, mail, tel, paket, text; „fax“ ist ein Honigtopf (Menschen sehen das Feld nicht). Leere Frage heißt „bitte melden“. */
async function frageAnnehmen(ctx) {
  const b = ctx.body || {};
  if (!erlaubt('afrage:' + quelle(ctx.request), 5, MIN)) throw new ApiFehler('Zu viele Anfragen. Bitte in einer Minute noch einmal.', 429);
  if (kurz(b.fax, 200)) return { ok: true };
  const f = {}, name = kurz(b.name, 80), firma = kurz(b.firma, 100), mail = kurz(b.mail, 120).toLowerCase(), tel = kurz(b.tel, 40), paket = P().gueltig(b.paket) ? b.paket : '';
  const text = String(b.text == null ? '' : b.text).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').trim().slice(0, 2000);
  if (name.length < 2) f.name = 'Bitte Ihren Namen eingeben.';
  if (!mailPruefen(mail)) f.mail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
  if (text && text.length < 3) f.text = 'Bitte schreiben Sie kurz Ihre Frage.';
  if (Object.keys(f).length) throw new ApiFehler('Bitte prüfen Sie die markierten Felder.', 400, { felder: f });
  const post = pd(ctx); if (!post) throw new ApiFehler('Ihre Frage ließ sich gerade nicht übermitteln. Bitte schreiben Sie uns eine E-Mail (Adresse im Impressum).', 503);
  const m = frageMail({ name: name, firma: firma, mail: mail, tel: tel, paket: paket ? P().PAKETE[paket].name : '', text: text || (paket ? 'Bitte Paket vormerken und bei mir melden.' : 'Bitte melden Sie sich bei mir.') });
  const r = await post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: mail });
  if (!(r && r.ok)) throw new ApiFehler('Ihre Frage ließ sich gerade nicht übermitteln. Bitte schreiben Sie uns eine E-Mail (Adresse im Impressum).', 503);
  if (ctx.zaehlen) ctx.zaehlen('ereignis:paket_frage');
  return { ok: true };
}
/* Antwort für das Formular ohne JavaScript: eine schlichte Seite im Stil der Mails */
function frageSeite(titel, text, status) {
  const html = rahmen(titel, '<p style="margin:0 0 18px;font:400 16px/1.55 system-ui,sans-serif;color:#3a3a3d">' + text + '</p><p style="margin:0"><a href="/fuer-fensterbauer/" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#07090a;color:#fff;font:600 15px/1 system-ui,sans-serif;text-decoration:none">Zurück zur Seite für Fensterbauer</a></p>');
  return new Response(html, { status: status || 200, headers: Object.assign({}, SICHERHEIT, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': SPERRE }) });
}

/* ---------- Kunde ---------- */
const KUNDE = {
  'POST /api/auftrag/frage': async (ctx) => {
    if (!ctx.formular) return frageAnnehmen(ctx);
    try { await frageAnnehmen(ctx); return frageSeite('Danke, Ihre Frage ist da.', 'Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.'); }
    catch (e) {
      if (!(e instanceof ApiFehler)) throw e;
      const felder = e.extra && e.extra.felder ? Object.values(e.extra.felder) : [e.message];
      return frageSeite('Das hat noch nicht geklappt.', '<span role="alert">' + felder.map(esc).join('<br>') + '</span><br>Bitte gehen Sie zurück und prüfen Sie Ihre Angaben.', e.status);
    }
  },
  'GET /api/auftrag/stand': async (ctx) => {
    const v = await verkaufStand(ctx);
    return { ok: true, verkauf: v, stand: PAKET_STAND, standText: standText(PAKET_STAND), mwst: mwst(ctx), daten: !!daten(ctx.k), zahlung: !!(ctx.k.stripe || ctx.k.zahlungAttrappe) };
  },
  'POST /api/auftrag/code': codeSchicken,
  'POST /api/auftrag/anmelden': anmelden,
  'POST /api/auftrag/abmelden': async (ctx) => new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json; charset=utf-8', 'set-cookie': sitzungLoeschen(ctx, 'kunde') } }),
  'GET /api/auftrag/ich': async (ctx) => {
    const s = await sitzungLesen(ctx, 'kunde'); if (!s) return { ok: true, angemeldet: false };
    const d = db(ctx), kunde = await d.kundeHolen(s.sub); if (!kunde) return { ok: true, angemeldet: false };
    const l = await d.auftraegeVonKunde(kunde.id), ung = await d.ungelesen('inhaber').catch(() => ({}));
    return { ok: true, angemeldet: true, mail: kunde.mail, stripe: !!kunde.stripe, auftraege: l.map((a) => Object.assign(sicht(a), { ungelesen: ung[a.id] || 0 })) };
  },
  'POST /api/auftrag/neu': async (ctx) => {
    const kunde = await kundeVon(ctx), b = ctx.body || {};
    if (!P().gueltig(b.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
    const d = db(ctx), l = await d.auftraegeVonKunde(kunde.id);
    if (l.filter((a) => a.stand === 'entwurf').length >= G().offeneEntwuerfe) throw new ApiFehler('Sie haben schon ' + G().offeneEntwuerfe + ' angefangene Bestellungen. Bitte schließen Sie eine ab oder verwerfen Sie sie.', 409);
    /* Vorbelegung aus dem letzten Auftrag (Betrieb), sonst leer; Adresse für Anfragen: die Anmeldeadresse */
    const angaben = AU().leer(), alt = l.find((a) => a.angaben && a.angaben.betrieb);
    if (alt) angaben.betrieb = Object.assign(angaben.betrieb, alt.angaben.betrieb);
    angaben.adresse.eingang = [kunde.mail, '', ''];
    const a = await d.auftragAnlegen({ kunde: kunde.id, paket: b.paket, weg: b.weg === 'schnell' ? 'schnell' : 'ausfuehrlich', angaben: angaben, preise: Object.assign({ stand: P().PREIS_STAND, mwst: mwst(ctx) ? 19 : 0 }, P().preis(b.paket)), verlauf: [{ zeit: ZEIT(), stand: 'entwurf', von: 'kunde', text: 'Bestellung begonnen' }] });
    return { ok: true, auftrag: sicht(a) };
  },
  'PATCH /api/auftrag/:id': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), b = ctx.body || {}, d = db(ctx);
    if (BEARBEITBAR.indexOf(a.stand) < 0) throw new ApiFehler('Dieser Auftrag lässt sich nicht mehr ändern.', 409);
    const vorher = VOR_ZAHLUNG.indexOf(a.stand) >= 0;
    let paket = a.paket;
    if (b.paket !== undefined && b.paket !== a.paket) {
      if (!vorher) throw new ApiFehler('Nach der Zahlung wechseln wir das Paket gern auf Anfrage (Kundenbereich, „Paket wechseln“).', 409);
      if (!P().gueltig(b.paket)) throw new ApiFehler('Bitte ein Paket wählen.', 400);
      paket = b.paket;
    }
    const m = P().merkmale(paket), fehler = {}, neu = {};
    const g = b.angaben && typeof b.angaben === 'object' ? b.angaben : {};
    ['betrieb', 'adresse', 'auftritt'].forEach((t) => {
      if (!g[t]) return;
      if (t === 'auftritt' && !AU().gestaltet(m)) return;
      const r = AU()[t](g[t], m); Object.keys(r.fehler).forEach((x) => { fehler[t + '.' + x] = r.fehler[x]; }); neu[t] = r.wert;
    });
    /* Essential: Name unter eeziframes.com darf nicht schon einem anderen Auftrag gehören */
    if (neu.adresse && !m.domain && neu.adresse.name && (await d.adresseBelegt(neu.adresse.name, a.id))) fehler['adresse.name'] = neu.adresse.name + '.eeziframes.com ist schon vergeben. Bitte einen anderen Namen wählen.';
    /* Vor der Zahlung darf ein Entwurf Lücken haben (automatisches Speichern); geprüft wird beim Bestellen. Danach nur vollständig. */
    if (Object.keys(fehler).length && !vorher) throw new ApiFehler('Bitte prüfen Sie die markierten Felder.', 400, { felder: fehler });
    const z2 = await d.auftragAendern(a.id, (z) => {
      if (BEARBEITBAR.indexOf(z.stand) < 0) return false;
      z.angaben = Object.assign({}, z.angaben, neu);
      if (paket !== z.paket && VOR_ZAHLUNG.indexOf(z.stand) >= 0) { z.paket = paket; z.preise = Object.assign({ stand: P().PREIS_STAND, mwst: mwst(ctx) ? 19 : 0 }, P().preis(paket)); verlauf(z, { von: 'kunde', text: 'Paket gewechselt zu ' + P().PAKETE[paket].name }); }
      if (b.weg === 'schnell' || b.weg === 'ausfuehrlich') z.weg = b.weg;
      if (VOR_ZAHLUNG.indexOf(z.stand) < 0 && Object.keys(neu).length) { z.angaben_geaendert = ZEIT(); verlauf(z, { von: 'kunde', text: 'Angaben geändert: ' + Object.keys(neu).map((t) => ({ betrieb: 'Betrieb', adresse: 'Adresse', auftritt: 'Auftritt' })[t]).join(', ') }); }
      z.adresse = !m.domain && z.angaben.adresse && z.angaben.adresse.name && !fehler['adresse.name'] ? z.angaben.adresse.name : null;
    });
    if (z2 === false) throw new ApiFehler('Dieser Auftrag lässt sich nicht mehr ändern.', 409);
    return { ok: true, auftrag: sicht(z2), fehler: fehler };
  },
  'POST /api/auftrag/adresse': async (ctx) => {
    const r = AU().unteradresse((ctx.body || {}).name);
    if (!r.ok) return { ok: true, frei: false, name: r.name, host: '', text: r.fehler };
    if (!erlaubt('aadr:' + quelle(ctx.request), 60, 10 * MIN)) throw new ApiFehler('Zu viele Abfragen. Bitte gleich noch einmal.', 429);
    const belegt = await db(ctx).adresseBelegt(r.name, String((ctx.body || {}).id || ''));
    return { ok: true, frei: !belegt, name: r.name, host: r.host, text: belegt ? r.host + ' ist schon vergeben.' : r.host + ' ist frei.' };
  },

  /* Dateien */
  'POST /api/auftrag/:id/datei': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), b = ctx.body || {}, pl = AU().PLAETZE[b.platz], m = P().merkmale(a.paket) || {};
    if (!pl) throw new ApiFehler('Unbekannter Platz.', 400);
    if (b.platz !== 'weitere' && !AU().gestaltet(m)) throw new ApiFehler('Logo und Fotos gehören zu den Paketen mit eigener Gestaltung.', 409, { anreiz: true });
    if (BEARBEITBAR.indexOf(a.stand) < 0) throw new ApiFehler('Dieser Auftrag lässt sich nicht mehr ändern.', 409);
    if ((a.dateien || []).length >= G().dateienJeAuftrag && pl.mehrere) throw new ApiFehler('Höchstens ' + G().dateienJeAuftrag + ' Dateien. Bitte eine entfernen.', 409);
    const bytes = base64Bytes(b.daten); if (!bytes || !bytes.length) throw new ApiFehler('Die Datei kam nicht an. Bitte noch einmal.', 400);
    const typ = typVon(bytes);
    if (!typ || pl.typen.indexOf(typ) < 0) throw new ApiFehler(b.platz === 'logo' ? 'Bitte ein Logo als PNG, JPEG, WebP, SVG oder PDF.' : 'Bitte ein Foto als JPEG, PNG oder WebP.', 400);
    if (bytes.length > pl.max) throw new ApiFehler('Die Datei ist größer als ' + Math.round(pl.max / 1e6) + ' MB.', 413);
    const ab = datei(ctx); if (!ab) throw new ApiFehler('Die Dateiablage ist hier noch nicht eingerichtet.', 503);
    const did = 'd' + zufall(9).replace(/[^A-Za-z0-9]/g, '').toLowerCase().slice(0, 12);
    if (!(await ab.ablegen(dateiPfad(a, did), bytes, typ))) throw new ApiFehler('Die Datei ließ sich nicht ablegen. Bitte noch einmal.', 502);
    const alt = [];
    const z2 = await db(ctx).auftragAendern(a.id, (z) => {
      const l = (z.dateien || []).filter((x) => { if (!pl.mehrere && x.platz === b.platz) { alt.push(x.id); return false; } return true; });
      l.push({ id: did, platz: b.platz, name: kurz(b.name || pl.titel, 120), typ: typ, bytes: bytes.length, zeit: ZEIT() }); z.dateien = l;
      if (VOR_ZAHLUNG.indexOf(z.stand) < 0) { z.angaben_geaendert = ZEIT(); verlauf(z, { von: 'kunde', text: 'Datei: ' + pl.titel }); }
    });
    if (alt.length) ctx.waitUntil(ab.loeschen(alt.map((x) => dateiPfad(a, x))).catch(() => false));
    return { ok: true, auftrag: sicht(z2) };
  },
  'GET /api/auftrag/:id/datei/:did': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), d = (a.dateien || []).find((x) => x.id === ctx.params.did);
    if (!d) throw new ApiFehler('Diese Datei gibt es nicht.', 404);
    const bytes = await datei(ctx).holen(dateiPfad(a, d.id)); if (!bytes) throw new ApiFehler('Diese Datei gibt es nicht mehr.', 404);
    return dateiAntwort(bytes, d, ctx.url.searchParams.get('laden') === '1');
  },
  'DELETE /api/auftrag/:id/datei/:did': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde);
    if (BEARBEITBAR.indexOf(a.stand) < 0) throw new ApiFehler('Dieser Auftrag lässt sich nicht mehr ändern.', 409);
    const z2 = await db(ctx).auftragAendern(a.id, (z) => { const n = (z.dateien || []).length; z.dateien = (z.dateien || []).filter((x) => x.id !== ctx.params.did); if (z.dateien.length === n) return false; if (VOR_ZAHLUNG.indexOf(z.stand) < 0) z.angaben_geaendert = ZEIT(); });
    if (z2) ctx.waitUntil(datei(ctx).loeschen([dateiPfad(a, ctx.params.did)]).catch(() => false));
    return { ok: true, auftrag: sicht(z2 || a) };
  },

  /* Bestellen: alles prüfen, Preisstand festhalten, dann Kasse (oder Anfrage, solange die Kasse zu ist) */
  'POST /api/auftrag/:id/bestellen': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), d = db(ctx), m = P().merkmale(a.paket);
    if (VOR_ZAHLUNG.indexOf(a.stand) < 0) throw new ApiFehler('Dieser Auftrag ist schon bestellt.', 409);
    if ((a.zahlung || {}).status === 'laeuft') throw new ApiFehler('Ihre Lastschrift ist unterwegs. Wir melden uns, sobald sie da ist.', 409);
    const r = AU().pruefen(a.angaben, m);
    if (!r.ok) { const erster = Object.keys(r.fehler)[0].split('.')[0]; throw new ApiFehler('Es fehlen noch Angaben.', 400, { felder: r.fehler, station: erster }); }
    if (!m.domain && (await d.adresseBelegt(r.wert.adresse.name, a.id))) throw new ApiFehler(r.wert.adresse.name + '.eeziframes.com ist inzwischen vergeben. Bitte einen anderen Namen wählen.', 409, { felder: { 'adresse.name': 'Schon vergeben.' }, station: 'adresse' });
    const z = AU().zustimmung((ctx.body || {}).zustimmung, PAKET_STAND);
    if (!z.ok) {
      if ((ctx.body || {}).zustimmung && (ctx.body.zustimmung.agb) && ctx.body.zustimmung.agb !== PAKET_STAND) throw new ApiFehler('Die Paketbedingungen haben sich gerade geändert. Bitte lesen Sie sie und stimmen Sie noch einmal zu.', 409, { neuLaden: true });
      throw new ApiFehler('Bitte bestätigen Sie die drei Punkte.', 400, { felder: Object.fromEntries(Object.entries(z.fehler).map(([k, v]) => ['zustimmung.' + k, v])), station: 'bestellen' });
    }
    const v = await verkaufStand(ctx), zust = Object.assign({}, z.wert, { zeit: ZEIT() });
    if (!v.kasse) {
      const z2 = await d.auftragAendern(a.id, (x) => { x.zustimmung = zust; x.adresse = !m.domain ? r.wert.adresse.name : null; if (x.stand === 'entwurf') { x.stand = 'angefragt'; verlauf(x, { stand: 'angefragt', von: 'kunde', text: 'Unverbindlich angefragt (Kasse noch zu)' }); } });
      ctx.waitUntil(inhaberMelden(ctx, z2, true).catch(() => false));
      return { ok: true, angefragt: true, auftrag: sicht(z2) };
    }
    const k2 = await kasse(ctx, a, kunde, { zurueck: basis(ctx) + '/konto/?kasse={SESSION}#auftrag/' + a.id, abbruch: basis(ctx) + '/bestellen/#' + a.paket + '/' + a.id + '/bestellen' });
    const z2 = await d.auftragAendern(a.id, (x) => { x.zustimmung = zust; x.adresse = !m.domain ? r.wert.adresse.name : null; x.zahlung = Object.assign({}, x.zahlung, { status: 'kasse', session: k2.id, kunde: k2.kunde || (x.zahlung || {}).kunde || '' }); verlauf(x, { von: 'kunde', text: 'Kostenpflichtig bestellt (Paketbedingungen und AV-Vertrag, Stand ' + PAKET_STAND + ')' }); });
    if (kunde && k2.kunde && !kunde.stripe) await d.kundeAendern(kunde.id, { stripe: k2.kunde }).catch(() => null);
    ctx.waitUntil(bestaetigen(ctx, z2, kunde).catch(() => false));
    return { ok: true, url: k2.url };
  },
  'GET /api/auftrag/:id/kasse': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), session = String(ctx.url.searchParams.get('session') || '').slice(0, 200);
    if (!session || (a.zahlung || {}).session !== session) {
      if ((a.zahlung || {}).status === 'bezahlt') return { ok: true, bezahlt: true, auftrag: sicht(a) };
      throw new ApiFehler('Diese Zahlung gehört nicht zu diesem Auftrag.', 404);
    }
    const r = await kassePruefen(ctx, session);
    if (r.bezahlt) return { ok: true, bezahlt: true, auftrag: sicht(await bezahltFesthalten(ctx, a, r)) };
    if (r.laeuft) { const z2 = await db(ctx).auftragAendern(a.id, (z) => { if ((z.zahlung || {}).status === 'bezahlt') return false; z.zahlung = Object.assign({}, z.zahlung, { status: 'laeuft' }); }); return { ok: true, laeuft: true, auftrag: sicht(z2 || a) }; }
    return { ok: true, bezahlt: false, auftrag: sicht(a) };
  },
  'POST /api/auftrag/:id/freigabe': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), b = ctx.body || {}, d = db(ctx);
    if (a.stand !== 'vorschau') throw new ApiFehler('Gerade gibt es keine Vorschau zum Freigeben.', 409);
    const text = kurz(b.text, G().nachricht);
    if (b.aktion === 'aendern' && text.length < 3) throw new ApiFehler('Bitte schreiben Sie kurz, was wir ändern sollen.', 400, { felder: { text: 'Bitte beschreiben Sie Ihre Änderung.' } });
    const z2 = await d.auftragAendern(a.id, (z) => {
      if (z.stand !== 'vorschau') return false;
      if (b.aktion === 'freigeben') { z.vorschau = Object.assign({}, z.vorschau, { freigabe: { zeit: ZEIT(), link: (z.vorschau || {}).link || '' }, aenderung: null }); verlauf(z, { von: 'kunde', text: 'Vorschau freigegeben' }); }
      else { z.vorschau = Object.assign({}, z.vorschau, { aenderung: { zeit: ZEIT(), text: text }, freigabe: null }); z.stand = 'in_arbeit'; verlauf(z, { stand: 'in_arbeit', von: 'kunde', text: 'Änderungen gewünscht' }); }
    });
    if (z2 === false) throw new ApiFehler('Gerade gibt es keine Vorschau zum Freigeben.', 409);
    const nt = b.aktion === 'freigeben' ? 'Ich gebe die Vorschau frei.' : 'Bitte ändern: ' + text;
    await d.nachrichtAnlegen({ auftrag: a.id, von: 'kunde', text: nt });
    const post = pd(ctx); if (post) { const m = nachrichtMail(z2, nt, { anInhaber: true, link: basis(ctx) + '/zentrale/#auftrag/' + a.id }); ctx.waitUntil(post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: kunde.mail }).catch(() => false)); }
    return { ok: true, auftrag: sicht(z2) };
  },
  'GET /api/auftrag/:id/nachrichten': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), d = db(ctx), l = await d.nachrichtenVon(a.id);
    await d.nachrichtenGelesen(a.id, 'inhaber').catch(() => null);
    return { ok: true, nachrichten: l.map((n) => ({ id: n.id, von: n.von, text: n.text, zeit: n.created_at, gelesen: !!n.gelesen })) };
  },
  'POST /api/auftrag/:id/nachrichten': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), text = kurz((ctx.body || {}).text, G().nachricht);
    if (text.length < 2) throw new ApiFehler('Bitte eine Nachricht schreiben.', 400, { felder: { text: 'Bitte eine Nachricht schreiben.' } });
    if (!erlaubt('anachr:' + a.id, 20, 60 * MIN)) throw new ApiFehler('Viele Nachrichten in kurzer Zeit. Bitte etwas später noch einmal.', 429);
    const n = await db(ctx).nachrichtAnlegen({ auftrag: a.id, von: 'kunde', text: text });
    const post = pd(ctx); if (post) { const m = nachrichtMail(a, text, { anInhaber: true, link: basis(ctx) + '/zentrale/#auftrag/' + a.id }); ctx.waitUntil(post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: kunde.mail }).catch(() => false)); }
    return { ok: true, nachricht: { id: n.id, von: 'kunde', text: n.text, zeit: n.created_at, gelesen: false } };
  },
  'POST /api/auftrag/:id/wechsel': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), p = (ctx.body || {}).paket;
    if (!P().gueltig(p) || p === a.paket) throw new ApiFehler('Bitte ein anderes Paket wählen.', 400);
    if (VOR_ZAHLUNG.indexOf(a.stand) >= 0) throw new ApiFehler('Vor der Zahlung wechseln Sie das Paket direkt in der Bestellung.', 409);
    const text = 'Ich möchte zu ' + P().PAKETE[p].name + ' wechseln.' + ((ctx.body || {}).text ? ' ' + kurz(ctx.body.text, 500) : '');
    await db(ctx).nachrichtAnlegen({ auftrag: a.id, von: 'kunde', text: text });
    await db(ctx).auftragAendern(a.id, (z) => { z.wechsel = { paket: p, zeit: ZEIT() }; verlauf(z, { von: 'kunde', text: 'Paketwechsel angefragt: ' + P().PAKETE[p].name }); });
    const post = pd(ctx); if (post) { const m = nachrichtMail(a, text, { anInhaber: true, link: basis(ctx) + '/zentrale/#auftrag/' + a.id }); ctx.waitUntil(post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: kunde.mail }).catch(() => false)); }
    return { ok: true };
  },
  /* Storno durch den Kunden, solange wir noch nicht begonnen haben (Paketbedingungen § 7 Abs. 2): Einrichtung voll zurück */
  'POST /api/auftrag/:id/stornieren': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde), d = db(ctx);
    await frischPflicht(ctx);
    if (!AU().uebergang(a.stand, 'storniert', 'kunde') || VOR_ZAHLUNG.indexOf(a.stand) >= 0) throw new ApiFehler(a.stand === 'entwurf' || a.stand === 'angefragt' ? 'Eine offene Bestellung können Sie einfach verwerfen.' : 'Wir haben mit Ihrer Seite schon begonnen. Schreiben Sie uns bitte, wir finden eine Lösung.', 409);
    const erst = await erstatten(ctx, a);
    const z2 = await d.auftragAendern(a.id, (z) => {
      if (!AU().uebergang(z.stand, 'storniert', 'kunde')) return false;
      z.stand = 'storniert'; if (!erst.ohne) z.zahlung = Object.assign({}, z.zahlung, { erstattet: true, erstattet_cent: erst.cent || 0 });
      verlauf(z, { stand: 'storniert', von: 'kunde', text: 'Vom Kunden storniert, Einrichtung erstattet' });
    });
    if (z2 === false) throw new ApiFehler('Wir haben mit Ihrer Seite gerade begonnen. Schreiben Sie uns bitte.', 409);
    ctx.waitUntil(kundeMelden(ctx, z2, 'storniert', {}).catch(() => false));
    const post = pd(ctx); if (post) { const m = nachrichtMail(z2, 'Ich storniere meine Bestellung.', { anInhaber: true, link: basis(ctx) + '/zentrale/#auftrag/' + a.id }); ctx.waitUntil(post.senden({ an: post.kontakt, betreff: m.betreff, html: m.html, antwortAn: kunde.mail }).catch(() => false)); }
    return { ok: true, auftrag: sicht(z2) };
  },
  'POST /api/auftrag/:id/verwerfen': async (ctx) => {
    const kunde = await kundeVon(ctx), a = await eigener(ctx, kunde);
    if (VOR_ZAHLUNG.indexOf(a.stand) < 0 || ['laeuft', 'bezahlt'].indexOf((a.zahlung || {}).status) >= 0) throw new ApiFehler('Eine bezahlte Bestellung stornieren wir gern auf Nachricht.', 409);
    const ab = datei(ctx); if (ab) await ab.ordnerLoeschen('auftrag/' + a.id).catch(() => false);
    await db(ctx).auftragLoeschen(a.id);
    return { ok: true };
  },
  'POST /api/auftrag/portal': async (ctx) => {
    const kunde = await kundeVon(ctx);
    await frischPflicht(ctx);
    return { ok: true, url: await portal(ctx, kunde, basis(ctx) + '/konto/') };
  }
};

/* ---------- Inhaber ----------
   Anmeldung mit ZENTRALE_PASSWORT (ab 12 Zeichen) und, wenn eingetragen, dem zweiten Faktor ZENTRALE_2FA (TOTP, 6 Ziffern, 30 s). */
function base32(s) { const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let bits = '', out = []; String(s).replace(/=+$/, '').toUpperCase().split('').forEach((c) => { const v = A.indexOf(c); if (v >= 0) bits += v.toString(2).padStart(5, '0'); }); for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2)); return new Uint8Array(out); }
async function totp(geheim, schritt) {
  const key = await crypto.subtle.importKey('raw', base32(geheim), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const z = new Uint8Array(8); let n = schritt; for (let i = 7; i >= 0; i--) { z[i] = n & 0xff; n = Math.floor(n / 256); }
  const h = new Uint8Array(await crypto.subtle.sign('HMAC', key, z)), o = h[h.length - 1] & 0xf;
  return String((((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1000000).padStart(6, '0');
}
async function inhaberPflicht(ctx) { await sitzungPflicht(ctx, 'inhaber'); }
async function auftragFuerInhaber(ctx) { const a = await db(ctx).auftragHolen(ctx.params.id); if (!a) throw new ApiFehler('Diesen Auftrag gibt es nicht.', 404); return a; }
function naechster(a) {
  const v = a.vorschau || {};
  switch (a.stand) {
    case 'entwurf': return 'Kunde füllt aus';
    case 'angefragt': return 'Anfrage beantworten';
    case 'bezahlt': return 'Seite beginnen';
    case 'in_arbeit': return v.aenderung ? 'Änderungen einarbeiten' : 'Vorschau bereitstellen';
    case 'vorschau': return v.freigabe ? 'Live schalten' : 'Warten auf Freigabe';
    case 'live': return a.angaben_geaendert && a.angaben_geaendert > (a.gesehen || '') ? 'Änderungen ansehen' : '';
    default: return '';
  }
}
const INHABER = {
  'GET /api/inhaber/stand': async (ctx) => ({ ok: true, eingerichtet: !!ctx.k.zentrale.passwort, grund: ctx.k.zentrale.grund || '', zweiterFaktor: !!ctx.k.zentrale.totp, angemeldet: !!(await sitzungLesen(ctx, 'inhaber')) }),
  'POST /api/inhaber/anmelden': async (ctx) => {
    const z = ctx.k.zentrale, b = ctx.body || {};
    if (!z.passwort) throw new ApiFehler('Die Zentrale ist noch nicht eingerichtet (ZENTRALE_PASSWORT ab 12 Zeichen).', 503);
    if (!erlaubt('inhaber:' + quelle(ctx.request), 8, 15 * MIN)) throw new ApiFehler('Zu viele Versuche. Bitte in 15 Minuten noch einmal.', 429);
    const pwOk = await gleich(String(b.passwort || ''), z.passwort);
    let codeOk = true;
    if (z.totp) { const c = String(b.code || '').replace(/\s/g, ''), s = Math.floor(Date.now() / 30000); codeOk = /^\d{6}$/.test(c) && ((await totp(z.totp, s)) === c || (await totp(z.totp, s - 1)) === c || (await totp(z.totp, s + 1)) === c); }
    if (!pwOk || !codeOk) throw new ApiFehler(z.totp ? 'Passwort oder Code stimmt nicht.' : 'Das Passwort stimmt nicht.', 401);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': await sitzungSetzen(ctx, 'inhaber', { sub: 'inhaber', mail: '' }, 8) } });
  },
  'POST /api/inhaber/abmelden': async (ctx) => new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json; charset=utf-8', 'set-cookie': sitzungLoeschen(ctx, 'inhaber') } }),
  'GET /api/inhaber/auftraege': async (ctx) => {
    await inhaberPflicht(ctx);
    const d = db(ctx), l = await d.auftraegeAlle(), ung = await d.ungelesen('kunde').catch(() => ({}));
    return { ok: true, auftraege: l.map((a) => { const b = (a.angaben || {}).betrieb || {}; return { id: a.id, nr: a.nr, paket: a.paket, paketName: (P().PAKETE[a.paket] || {}).name, stand: a.stand, weg: a.weg, firma: b.firma || '', name: b.name || '', ort: b.ort || '', adresse: adresseText(a), web: b.web || '', created_at: a.created_at, updated_at: a.updated_at, bezahlt_am: (a.zahlung || {}).bezahlt_am || '', betrag_cent: (a.zahlung || {}).betrag_cent || 0, monat: (a.preise || {}).monat || 0, ungelesen: ung[a.id] || 0, geaendert: !!(a.angaben_geaendert && a.angaben_geaendert > (a.gesehen || '')), freigabe: !!((a.vorschau || {}).freigabe), naechster: naechster(a), dateien: (a.dateien || []).length, wechsel: a.wechsel || null }; }) };
  },
  'GET /api/inhaber/auftraege/:id': async (ctx) => {
    await inhaberPflicht(ctx);
    const d = db(ctx), a = await auftragFuerInhaber(ctx), kunde = await d.kundeHolen(a.kunde), l = await d.nachrichtenVon(a.id);
    await d.nachrichtenGelesen(a.id, 'kunde').catch(() => null);
    return { ok: true, auftrag: Object.assign(sicht(a, { inhaber: true, kunde: kunde ? { mail: kunde.mail, seit: kunde.created_at, angemeldet_am: kunde.angemeldet_am || '' } : null }), { naechster: naechster(a), wechsel: a.wechsel || null }), nachrichten: l.map((n) => ({ id: n.id, von: n.von, text: n.text, zeit: n.created_at })), prompt: promptFuer(a, kunde), stand: PAKET_STAND };
  },
  'GET /api/inhaber/auftraege/:id/datei/:did': async (ctx) => {
    await inhaberPflicht(ctx);
    const a = await auftragFuerInhaber(ctx), d = (a.dateien || []).find((x) => x.id === ctx.params.did);
    if (!d) throw new ApiFehler('Diese Datei gibt es nicht.', 404);
    const bytes = await datei(ctx).holen(dateiPfad(a, d.id)); if (!bytes) throw new ApiFehler('Diese Datei gibt es nicht mehr.', 404);
    return dateiAntwort(bytes, d, ctx.url.searchParams.get('laden') === '1');
  },
  'POST /api/inhaber/auftraege/:id/gesehen': async (ctx) => {
    await inhaberPflicht(ctx);
    const a = await auftragFuerInhaber(ctx); await db(ctx).auftragAendern(a.id, (z) => { z.gesehen = ZEIT(); });
    return { ok: true };
  },
  'POST /api/inhaber/auftraege/:id/stand': async (ctx) => {
    await inhaberPflicht(ctx);
    const a = await auftragFuerInhaber(ctx), b = ctx.body || {}, nach = String(b.stand || ''), d = db(ctx);
    if (!AU().uebergang(a.stand, nach, 'inhaber')) throw new ApiFehler('Von „' + AU().STAND_TITEL[a.stand] + '“ geht es nicht nach „' + (AU().STAND_TITEL[nach] || nach) + '“.', 409);
    const link = String(b.link || '').trim(), text = kurz(b.text, 600);
    if (nach === 'vorschau' && !AU().webAdresse(link)) throw new ApiFehler('Bitte den Link zur Vorschau eintragen.', 400, { felder: { link: 'Bitte einen Link wie https://… eintragen.' } });
    if (nach === 'live' && !AU().webAdresse(link)) throw new ApiFehler('Bitte die Adresse der fertigen Seite eintragen.', 400, { felder: { link: 'Bitte die Adresse wie https://… eintragen.' } });
    let abo = null, erstattung = null;
    if (nach === 'live' && !((a.abo || {}).id)) { const kunde = await d.kundeHolen(a.kunde); abo = await aboStarten(ctx, a, kunde || {}); }
    if (nach === 'storniert') erstattung = await erstatten(ctx, a);
    if (nach === 'beendet') await aboBeenden(ctx, a, !!b.sofort);
    const z2 = await d.auftragAendern(a.id, (z) => {
      if (!AU().uebergang(z.stand, nach, 'inhaber')) return false;
      z.stand = nach;
      if (nach === 'vorschau') z.vorschau = Object.assign({}, z.vorschau, { link: AU().webAdresse(link), seit: ZEIT(), freigabe: null, aenderung: null });
      if (nach === 'live') { z.vorschau = Object.assign({}, z.vorschau, { live: AU().webAdresse(link) }); if (abo) z.abo = Object.assign({}, z.abo, { id: abo.id, status: abo.status, bis: abo.bis, seit: ZEIT() }); }
      if (nach === 'storniert' && erstattung && !erstattung.ohne) z.zahlung = Object.assign({}, z.zahlung, { erstattet: true, erstattet_cent: erstattung.cent || 0 });
      if (nach === 'beendet') z.abo = Object.assign({}, z.abo, { status: 'beendet', ende: ZEIT() });
      verlauf(z, { stand: nach, von: 'inhaber', text: AU().STAND_TITEL[nach] + (text ? ': ' + text : '') });
    });
    if (z2 === false) throw new ApiFehler('Gerade gleichzeitig geändert. Bitte neu laden.', 409);
    if (b.mail !== false) ctx.waitUntil(kundeMelden(ctx, z2, nach, { vorschau: (z2.vorschau || {}).link, live: (z2.vorschau || {}).live, text: text }).catch(() => false));
    return { ok: true, auftrag: sicht(z2, { inhaber: true }) };
  },
  'POST /api/inhaber/auftraege/:id/nachricht': async (ctx) => {
    await inhaberPflicht(ctx);
    const a = await auftragFuerInhaber(ctx), text = kurz((ctx.body || {}).text, G().nachricht), d = db(ctx);
    if (text.length < 2) throw new ApiFehler('Bitte eine Nachricht schreiben.', 400, { felder: { text: 'Bitte eine Nachricht schreiben.' } });
    const n = await d.nachrichtAnlegen({ auftrag: a.id, von: 'inhaber', text: text });
    const kunde = await d.kundeHolen(a.kunde), post = pd(ctx);
    if (post && kunde) { const m = nachrichtMail(a, text, { anInhaber: false, link: basis(ctx) + '/konto/#auftrag/' + a.id }); ctx.waitUntil(post.senden({ an: kunde.mail, betreff: m.betreff, html: m.html, antwortAn: post.kontakt }).catch(() => false)); }
    return { ok: true, nachricht: { id: n.id, von: 'inhaber', text: n.text, zeit: n.created_at } };
  },
  'POST /api/inhaber/auftraege/:id/notiz': async (ctx) => {
    await inhaberPflicht(ctx);
    const a = await auftragFuerInhaber(ctx), text = String((ctx.body || {}).text || '').slice(0, 4000);
    await db(ctx).auftragAendern(a.id, (z) => { z.notiz = text; });
    return { ok: true };
  }
};
/* Nur auf der Hauptdomain; auf dem Host einer Konfigurator-Instanz gibt es keine Bestellung und keine Zentrale */
const nurHaupt = (fn) => (ctx) => { if (ctx.instanz) throw new ApiFehler('not_found', 404); return fn(ctx); };
export const AUFTRAG = Object.fromEntries(Object.entries(Object.assign({}, KUNDE, INHABER)).map(([k, fn]) => [k, nurHaupt(fn)]));
/* Größere Anfragen (Fotos als Base64) nur für das Hochladen */
export const GROSS = /^\/api\/auftrag\/[^/]+\/datei$/;

/* ---------- Stripe-Ereignisse der Aufträge (zahlung.js leitet sie hierher) ---------- */
const artVon = (o) => (o && o.metadata && o.metadata.art) || (o && o.subscription_details && o.subscription_details.metadata && o.subscription_details.metadata.art) || '';
export const istAuftragEreignis = (ev) => artVon(ev && ev.data && ev.data.object) === 'auftrag';
export async function auftragEreignis(ctx, ev) {
  const o = ev.data.object, d = daten(ctx.k); if (!d) return { ok: false };
  const id = (o.metadata && o.metadata.auftrag) || (o.subscription_details && o.subscription_details.metadata && o.subscription_details.metadata.auftrag) || '';
  const a = id ? await d.auftragHolen(id) : null; if (!a) return { ok: true, unbekannt: true };
  if ((ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded') && o.payment_status === 'paid') {
    await bezahltFesthalten(Object.assign({}, ctx, { url: ctx.url }), a, { betragCent: o.amount_total || 0, kunde: o.customer || '', intent: typeof o.payment_intent === 'string' ? o.payment_intent : (o.payment_intent || {}).id || '' });
  } else if (ev.type === 'checkout.session.completed' && o.payment_status === 'unpaid') {
    await d.auftragAendern(a.id, (z) => { if ((z.zahlung || {}).status === 'bezahlt') return false; z.zahlung = Object.assign({}, z.zahlung, { status: 'laeuft' }); });
  } else if (ev.type === 'checkout.session.async_payment_failed') {
    await d.auftragAendern(a.id, (z) => { if ((z.zahlung || {}).status === 'bezahlt') return false; z.zahlung = Object.assign({}, z.zahlung, { status: 'fehlgeschlagen' }); verlauf(z, { von: 'system', text: 'Lastschrift fehlgeschlagen' }); });
  } else if (ev.type === 'invoice.paid' || ev.type === 'invoice.payment_succeeded') {
    const ende = o.lines && o.lines.data && o.lines.data[0] && o.lines.data[0].period ? o.lines.data[0].period.end : 0;
    await d.auftragAendern(a.id, (z) => { z.abo = Object.assign({}, z.abo, { status: 'aktiv', bis: ende ? new Date(ende * 1000).toISOString() : (z.abo || {}).bis || '' }); });
  } else if (ev.type === 'invoice.payment_failed') {
    await d.auftragAendern(a.id, (z) => { z.abo = Object.assign({}, z.abo, { status: 'zahlung_offen' }); verlauf(z, { von: 'system', text: 'Abbuchung des Monatsabos fehlgeschlagen' }); });
  } else if (ev.type === 'customer.subscription.deleted') {
    await d.auftragAendern(a.id, (z) => { z.abo = Object.assign({}, z.abo, { status: 'beendet', ende: new Date().toISOString() }); verlauf(z, { von: 'system', text: 'Monatsabo bei Stripe beendet' }); });
  }
  return { ok: true };
}

/* ---------- Tageslauf: Fristen der Datenschutzerklärung (Abschnitt 9) aus Instanzregeln.FRISTEN, höchstens 50 Aufträge je Lauf ----------
   - nicht bezahlte Bestellungen (Entwurf, Anfrage) bestellEntwurfTage nach der letzten Änderung, samt Dateien
   - nach dem Vertragsende (beendet, storniert) die Dateien nach loeschenNachEndeTage, den Auftrag mit Nachrichten nach dem Ende des
     nachrichtenJahre. Jahres (Verjährung, §§ 195, 199 BGB; Rechnungen bewahrt Stripe auf)
   - Konten ohne Auftrag bestellEntwurfTage nach der letzten Anmeldung, abgelaufene Anmeldecodes nach einem Tag */
export async function auftraegeLauf(k) {
  const d = daten(k); if (!d) return { ok: true, ohneDaten: true };
  const F = globalThis.Instanzregeln.FRISTEN, jetzt = k.jetzt || Date.now(), TAG = 864e5, ab = ablage(k, 'auftraege'); // k.jetzt: Uhr des Servers (JETZT im Testserver)
  const out = { ok: true, entwuerfe: 0, dateien: 0, auftraege: 0, kunden: 0, codes: false };
  const ordnerWeg = async (a) => { if (ab) await ab.ordnerLoeschen('auftrag/' + a.id).catch(() => false); };
  const endeVon = (a) => { const e = (a.verlauf || []).filter((v) => v.stand === a.stand).pop(); return Date.parse((e && e.zeit) || a.updated_at) || jetzt; };
  const alle = await d.auftraegeAlle();
  for (const a of alle) {
    if (out.entwuerfe + out.dateien + out.auftraege >= 50) break;
    if (VOR_ZAHLUNG.indexOf(a.stand) >= 0) {
      if (Date.parse(a.updated_at) > jetzt - F.bestellEntwurfTage * TAG || ['kasse', 'laeuft', 'bezahlt'].indexOf((a.zahlung || {}).status) >= 0) continue;
      await ordnerWeg(a); await d.auftragLoeschen(a.id); a.weg = true; out.entwuerfe++; continue;
    }
    if (['beendet', 'storniert'].indexOf(a.stand) < 0) continue;
    const ende = endeVon(a);
    if (new Date(jetzt).getUTCFullYear() > new Date(ende).getUTCFullYear() + F.nachrichtenJahre) { await ordnerWeg(a); await d.auftragLoeschen(a.id); a.weg = true; out.auftraege++; continue; }
    if ((a.dateien || []).length && jetzt - ende > F.loeschenNachEndeTage * TAG) {
      await ordnerWeg(a);
      await d.auftragAendern(a.id, (z) => { z.dateien = []; verlauf(z, { von: 'system', text: 'Dateien nach dem Vertragsende gelöscht' }); }).catch(() => null);
      out.dateien++;
    }
  }
  const mit = new Set(alle.filter((a) => !a.weg).map((a) => a.kunde));
  for (const ku of await d.kundenAlle()) {
    if (out.kunden >= 50) break;
    if (mit.has(ku.id) || jetzt - (Date.parse(ku.angemeldet_am || ku.created_at) || jetzt) < F.bestellEntwurfTage * TAG) continue;
    if ((await d.auftraegeVonKunde(ku.id)).length) continue; // gerade bestellt
    await d.kundeLoeschen(ku.id); out.kunden++;
  }
  out.codes = await d.codesAufraeumen(new Date(jetzt - TAG).toISOString()).catch(() => false);
  return out;
}

/* eeziframes · Bestellungen der Konfigurator-Pakete: Statusmaschine, Zahlung der Einrichtung, Abo, Paketwechsel, Tageslauf, Mails
   (Strang D, Bauplan §3 D und §2.8; Zustände, Übergänge, Fristen in web/assets/instanzregeln.js; Preise in web/assets/pakete.js;
   Vertrag docs/INSTANZEN.md). Aufrufer: Kundenkonto (partner.js), Stripe-Webhook (zahlung.js, Weiche vor dem Kauf der Hauseigentümer),
   Zentrale (Strang C: Einrichtung beginnen, Live schalten, Abo steuern, Paket wechseln, Erstatten), täglicher Lauf (router.js).

   Feste Exportnamen (Vertrag):
     uebergang(ctx, id, nach, { wer, text })      einziger Weg für einen Statuswechsel; 409 bei nicht erlaubtem Übergang, Vermerk wo Pflicht
     einrichtungUebernehmen(ctx, session, o)       Zahlung der Einrichtung übernehmen (Rückkehr, Webhook, Abgleich; idempotent, genau ein
                                                   Wechsel auf „bezahlt“ und je eine Mail); nur mit Bindung an Bestellung, Partner und Kunde
     paketObjekt(ev) → bool                        gehört ein Stripe-Ereignis zu den Paketen (Metadaten art = einrichtung | paket | paket_zahlungsart)
     paketEreignis(ctx, ev)                        Stripe-Ereignis der Pakete verarbeiten
     aboStarten(ctx, id, { neu })                  Monatsabo beim Live-Schalten (idempotent: ein Abo je Bestellung)
     paketWechseln(ctx, id, paket, { differenz })  einzige Stelle, die instanzen.paket ändert, zusammen mit dem Preis des Abos
     aboSteuern(ctx, id, aktion, o)                kuendigen | zuruecknehmen | beenden | aussetzen | fortsetzen | kulanz | neu
     bestellungenLauf(k, sp, zd, env)              täglich: Kulanz → Pause → Ende → Löschung, Erinnerungen, Abgleich mit Stripe
     erstatten(ctx, id, { cent, grund })           Einrichtung ganz oder teilweise erstatten
   Dazu: paketVon(b) (Paket einer Bestellung vor der Instanz), istPaketEreignis(ctx, ev) (auch Rückbuchungen und Abo-Rechnungen ohne
   Metadaten), dateiAntwort(k, b, did) (Upload sicher ausliefern, auch für die Zentrale), eingangBestaetigen, partnerMail, inhaberMail.

   Grundsätze: Ein Statuswechsel läuft je Bestellung nacheinander (in diesem Isolate) und in der Datenbank mit Versionszähler; Mails und
   Zähler folgen nur dem Wechsel, der wirklich geschrieben wurde. Stripe-Objekte der Pakete tragen nie metadata.betrieb (Altbestand bleibt
   unberührt). Fristen rechnet die Uhr des Servers (JETZT in der Prüfung). Die Instanz selbst (Status, Löschen, Empfänger) gehört Strang A
   (functions/instanz/verwalten.js); fehlt dort noch etwas, bleibt die Bestellung trotzdem richtig und der Verlauf nennt den offenen Schritt. */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import { ApiFehler, jetztAus } from './umgebung.js';
import { postDienst, mailRahmen, esc, zeitText } from './post.js';
import { PAKET_STAND, paketPdfs, standText } from './recht.js';
import { einrichtungBrutto } from './stripe.js';
import { ablage } from './fotos.js';
import { protokoll } from './zentrale.js';
import { basis, HAUPTADRESSE } from '../seo.js';
import { instanzStatus, instanzDatenLoeschen, paketSetzen } from '../instanz/verwalten.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const RB = () => globalThis.Instanzregeln.bestellung;
const TAG = 864e5;
const jetzt = (ctx) => jetztAus(ctx && ctx.env);
const isoJetzt = (ctx) => new Date(jetzt(ctx)).toISOString();
const titel = (s) => RB().TITEL[s] || s;
const idVon = (v) => (v && typeof v === 'object' ? v.id : v) || '';
const euroText = (n) => P().euro(Number(n) || 0).replace(' €', ' €');
const datumText = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }); };
export const herkunft = (ctx) => (ctx && ctx.url ? basis(ctx.env, ctx.url) : String((ctx && ctx.env && ctx.env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, ''));

/* ---------- Je Bestellung nacheinander (Rückkehr und Webhook kommen oft gleichzeitig) ---------- */
const ketten = new Map();
function nacheinander(schluessel, fn) {
  const vorher = ketten.get(schluessel) || Promise.resolve();
  const lauf = vorher.then(() => fn());
  const ende = lauf.then(() => null, () => null);
  ketten.set(schluessel, ende);
  ende.then(() => { if (ketten.get(schluessel) === ende) ketten.delete(schluessel); });
  return lauf;
}
async function holen(ctx, id) {
  const b = await ctx.sp.bestellungHolen(id);
  if (b === undefined) throw new ApiFehler('Die Datenbank kennt die Bestellungen noch nicht (supabase/schema.sql erneut ausführen).', 503);
  if (!b) throw new ApiFehler('Diese Bestellung gibt es nicht.', 404);
  return b;
}
const eintrag = (ctx, e) => Object.assign({ zeit: isoJetzt(ctx) }, e);
const warte = (ctx, p) => { const q = Promise.resolve(p).catch((e) => { console.log('Bestellung: Nacharbeit fehlgeschlagen', String(e && e.message ? e.message : e).slice(0, 160)); return false; }); if (ctx.waitUntil) ctx.waitUntil(q); return q; };
const prot = (ctx, b, text, extra) => protokoll(ctx.sp, 'bestellung', null, text, Object.assign({ bestellung: b.id, nr: b.nr, partner: b.partner }, extra || {}));

/* Paket einer Bestellung: nach einem Wechsel vor dem Anlegen der Instanz das neue (abo.paket), sonst das bestellte. Die Instanz anlegen
   (Zentrale) nimmt dieses Paket; danach gilt nur noch instanzen.paket */
export const paketVon = (b) => (b && b.abo && P().gueltig(b.abo.paket) ? b.abo.paket : b ? b.paket_bestellt : '');
async function aktuellesPaket(ctx, b) {
  if (b.instanz) { try { const i = await ctx.sp.instanzHolen(b.instanz); if (i && P().gueltig(i.paket)) return i.paket; } catch (e) { /* Rückfall unten */ } }
  return paketVon(b);
}

/* ===================== Mails (Rahmen von eeziframes: der Fensteranbieter ist Kunde des Inhabers) ===================== */
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const knopf = (href, text) => '<p style="margin:20px 0"><a href="' + esc(href) + '" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#161616;color:#ffffff;font-weight:700;text-decoration:none">' + esc(text) + '</a></p>';
const tabelle = (zeilen) => '<table role="presentation" style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' + zeilen.filter(Boolean).map((z) => '<tr><td style="padding:4px 14px 4px 0;color:#6e6e73;vertical-align:top;white-space:nowrap">' + esc(z[0]) + '</td><td style="padding:4px 0">' + z[1] + '</td></tr>').join('') + '</table>';
const kontoLink = (ctx, b) => herkunft(ctx) + '/partner/#bestellung/' + (b ? b.id : '');
const zentraleLink = (ctx, b) => herkunft(ctx) + '/zentrale/#bestellung/' + b.id;
/* an den Fensteranbieter (Anmeldeadresse); antwortAn: das Postfach des Inhabers */
export async function partnerMail(ctx, p, betreff, inhalt, o) {
  const pd = postDienst(ctx.k); if (!pd || !p || !p.mail) return { ok: false, grund: 'ohne_post' };
  return pd.senden(Object.assign({ an: p.mail, betreff: betreff, html: mailRahmen(betreff, inhalt, pd.kontakt), antwortAn: pd.kontakt }, o || {}));
}
/* an den Inhaber (MAIL_KONTAKT); antwortAn: der Fensteranbieter */
export async function inhaberMail(ctx, betreff, inhalt, antwortAn, o) {
  const pd = postDienst(ctx.k); if (!pd || !pd.kontakt) return { ok: false, grund: 'ohne_post' };
  return pd.senden(Object.assign({ an: pd.kontakt, betreff: betreff, html: mailRahmen(betreff, inhalt, ''), antwortAn: antwortAn || '' }, o || {}));
}
const kontaktZeilen = (p) => {
  const d = (p && p.daten) || {}, e = d.erreichbar || {}, TAGE = { mo: 'Mo', di: 'Di', mi: 'Mi', do: 'Do', fr: 'Fr', sa: 'Sa' }, KANAL = { telefon: 'am liebsten Telefon', mail: 'am liebsten E-Mail', egal: 'Telefon oder E-Mail' };
  const erreichbar = e.tage && e.tage.length ? esc(e.tage.map((t) => TAGE[t] || t).join(', ') + ' ' + (e.von || '') + '–' + (e.bis || '') + ' Uhr, ' + (KANAL[e.kanal] || KANAL.egal) + (e.hinweis ? ' (' + e.hinweis + ')' : '')) : '–';
  return [['Firma', esc((p && p.firma) || '')], ['Ansprechpartner', esc(d.ap || '')], ['Telefon', esc(d.tel || '')], ['E-Mail', esc((p && p.mail) || '')], ['Erreichbar', erreichbar]];
};
async function partnerVon(ctx, b) { try { return await ctx.sp.partnerHolen(b.partner); } catch (e) { return null; } }

/* Texte je Statuswechsel an den Fensteranbieter (bezahlt hat eine eigene Mail, siehe einrichtungUebernehmen) */
function statusText(ctx, b, nach, text, host) {
  const name = P().PAKETE[paketVon(b)] ? P().PAKETE[paketVon(b)].name : '';
  switch (nach) {
    case 'einrichtung': return ['Wir richten Ihren Konfigurator ein', absatz('wir haben mit der Einrichtung Ihres Konfigurators (' + esc(name) + ') begonnen. Wir melden uns zur abgesprochenen Zeit, um die Domain festzulegen.')];
    case 'domain': return ['Ihre Domain ist gesichert', absatz('die Domain für Ihren Konfigurator ist gesichert' + (host ? ': <b>' + esc(host) + '</b>' : '') + '. Als Nächstes gestalten wir ihn und schicken Ihnen eine Vorschau.')];
    case 'freigabe': return ['Ihr Konfigurator ist zur Freigabe bereit', absatz('Ihr Konfigurator ist fertig eingerichtet. Bitte sehen Sie ihn sich in der Vorschau an und geben Sie ihn in Ihrem Kundenkonto frei, oder sagen Sie uns, was wir ändern sollen.') + (b.vorschau && b.vorschau.link ? knopf(b.vorschau.link, 'Vorschau ansehen') : '')];
    case 'live': return ['Ihr Konfigurator ist live', absatz('Ihr Konfigurator ist ab jetzt für Ihre Kunden erreichbar' + (host ? ' unter <b>https://' + esc(host) + '/</b>' : '') + '. Ab heute läuft Ihr Abo (' + esc(name) + ').') + (host ? absatz('So verlinken Sie ihn auf Ihrer Website:') + '<pre style="white-space:pre-wrap;font-size:13px;background:#f5f5f7;padding:12px;border-radius:8px">' + esc(schnipsel(host)) + '</pre>' : '')];
    case 'pausiert': return ['Ihr Konfigurator ist pausiert', absatz('Ihr Konfigurator ist pausiert' + (b.abo && b.abo.grund === 'zahlung' ? ', weil die Zahlung für Ihr Abo noch offen ist' : '') + '. Ihre Kunden sehen in dieser Zeit nur Ihre Kontaktdaten.') + (b.abo && b.abo.offeneRechnung ? knopf(b.abo.offeneRechnung, 'Offene Rechnung bezahlen') : '')];
    case 'beendet': return ['Ihr Konfigurator ist beendet', absatz('Ihr Konfigurator ist beendet. Die Daten Ihrer Kunden löschen wir nach ' + R().FRISTEN.loeschenNachEndeTage + ' Tagen; bis dahin können Sie sie über uns exportieren.')];
    case 'storniert': return ['Ihre Bestellung ist storniert', absatz('Ihre Bestellung ' + esc(b.nr) + ' ist storniert.' + (b.zahlung && (b.zahlung.status === 'erstattet' || b.zahlung.erstattet_cent) ? ' Die Einrichtungsgebühr erstatten wir auf Ihr Zahlungsmittel; das dauert meist 5 bis 10 Tage.' : ''))];
    default: return null;
  }
}
/* Verlinkungs-Schnipsel für die Website des Betriebs */
export const schnipsel = (host) => '<a href="https://' + host + '/" rel="noopener">Fenster online planen und anfragen</a>';
async function hauptHost(ctx, b) {
  if (!b.instanz || !ctx.sp.hostsVon) return '';
  try { const h = (await ctx.sp.hostsVon(b.instanz)) || []; const x = h.find((y) => y.haupt) || h[0]; return x ? x.host : ''; } catch (e) { return ''; }
}

/* ===================== Kleines PDF (Rückfall für die Anlagen der Eingangsbestätigung) =====================
   Die verbindlichen PDFs der Paketbedingungen und des AV-Vertrags erzeugt Strang F (scripts/bedingungen-pdf.mjs) unter
   /konfigurator-bedingungen/. Fehlen sie (Test, vor der Veröffentlichung), entsteht hier ein schlichtes Text-PDF mit Fassung und Link;
   im Live-Modus öffnet die Paket-Kasse ohnehin erst, wenn die echten PDFs da sind (recht.js paketVerkaufStand). */
const WIN = { '€': 128, '‚': 130, '„': 132, '…': 133, '–': 150, '—': 151, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, ' ': 160 };
const winAnsi = (t) => Array.from(String(t)).map((c) => { const n = c.charCodeAt(0); if (WIN[c]) return String.fromCharCode(WIN[c]); return n < 256 && n >= 32 ? c : n === 9 ? ' ' : '?'; }).join('');
const pdfText = (t) => winAnsi(t).replace(/[\\()]/g, (c) => '\\' + c);
function umbrechen(text, breite) {
  const zeilen = [];
  String(text).split('\n').forEach((absatzText) => {
    let z = '';
    absatzText.split(/\s+/).forEach((w) => { if (!w) return; if ((z + ' ' + w).trim().length > breite) { if (z) zeilen.push(z); z = w; } else z = (z + ' ' + w).trim(); });
    zeilen.push(z);
  });
  return zeilen;
}
export function einfachPdf(titelText, absaetze) {
  const zeilen = [{ t: titelText, f: 'F2', g: 16, abstand: 26 }];
  (absaetze || []).forEach((a) => {
    if (a && a.ueberschrift) zeilen.push({ t: '', f: 'F1', g: 6, abstand: 6 }, { t: a.ueberschrift, f: 'F2', g: 12, abstand: 18 });
    if (a && a.text != null) umbrechen(a.text, 92).forEach((z) => zeilen.push({ t: z, f: 'F1', g: 10.5, abstand: 15 }));
    zeilen.push({ t: '', f: 'F1', g: 6, abstand: 6 });
  });
  const seiten = []; let seite = [], y = 790;
  zeilen.forEach((z) => { if (y - z.abstand < 60) { seiten.push(seite); seite = []; y = 790; } seite.push({ t: z.t, f: z.f, g: z.g, y: y }); y -= z.abstand; });
  if (seite.length) seiten.push(seite);
  const obj = [], add = (s) => { obj.push(s); return obj.length; };
  add('<< /Type /Catalog /Pages 2 0 R >>');
  add(''); // Seitenbaum, unten gefüllt
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  add('<< /Title (' + pdfText(titelText) + ') /Producer (eeziframes) >>');
  const kinder = [];
  seiten.forEach((s, i) => {
    const strom = 'BT\n' + s.filter((z) => z.t).map((z) => '/' + z.f + ' ' + z.g + ' Tf 1 0 0 1 56 ' + z.y + ' Tm (' + pdfText(z.t) + ') Tj').join('\n') + '\n/F1 8 Tf 1 0 0 1 56 36 Tm (' + pdfText('Seite ' + (i + 1) + ' von ' + seiten.length) + ') Tj\nET';
    const inhalt = add('<< /Length ' + strom.length + ' >>\nstream\n' + strom + '\nendstream');
    kinder.push(add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + inhalt + ' 0 R >>'));
  });
  obj[1] = '<< /Type /Pages /Kids [' + kinder.map((k) => k + ' 0 R').join(' ') + '] /Count ' + kinder.length + ' >>';
  let out = '%PDF-1.4\n%âãÏÓ\n'; const offs = [];
  obj.forEach((o, i) => { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
  const xref = out.length;
  out += 'xref\n0 ' + (obj.length + 1) + '\n0000000000 65535 f \n' + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('') + 'trailer\n<< /Size ' + (obj.length + 1) + ' /Root 1 0 R /Info 5 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  const bytes = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
  return bytes;
}
const b64 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000))); return btoa(s); };

/* Anlagen der Eingangsbestätigung: Paketbedingungen und AV-Vertrag in der Fassung PAKET_STAND */
async function bedingungenPdfs(ctx) {
  const namen = ['Paketbedingungen', 'AV-Vertrag'], pfade = paketPdfs(), out = [];
  for (let i = 0; i < pfade.length; i++) {
    let bytes = null;
    try { if (ctx.env && ctx.env.ASSETS && ctx.url) { const r = await ctx.env.ASSETS.fetch(new Request(ctx.url.origin + pfade[i])); if (r.status === 200) { const b = new Uint8Array(await r.arrayBuffer()); if (b.length > 4 && String.fromCharCode(b[0], b[1], b[2], b[3]) === '%PDF') bytes = b; } } } catch (e) { bytes = null; }
    if (!bytes) bytes = einfachPdf(namen[i] + ' (Stand ' + standText(PAKET_STAND) + ')', [
      { text: 'eeziframes, Konfigurator-Pakete. Fassung vom ' + standText(PAKET_STAND) + '.' },
      { ueberschrift: 'Verbindlicher Wortlaut', text: 'Den vollständigen Wortlaut dieser Fassung finden Sie unter ' + herkunft(ctx) + '/konfigurator-bedingungen/' + (i ? '#avv' : '') + '. Sie haben ihm bei Ihrer Bestellung zugestimmt; diese Datei hält die Fassung fest.' }
    ]);
    out.push({ filename: namen[i].replace(/\s+/g, '-') + '-' + PAKET_STAND + '.pdf', content: b64(bytes), content_type: 'application/pdf' });
  }
  return out;
}

/* Eingangsbestätigung sofort beim Bestellen (§ 312i BGB): Bestellübersicht, Paketbedingungen und AV-Vertrag als PDF, Link auf die
   Fassung. Je Bestellung genau einmal (Idempotenz-Schlüssel), auch bei mehreren Klicks auf „Kostenpflichtig bestellen“. */
export async function eingangBestaetigen(ctx, b, p) {
  const w = b.wunsch || {}, k = w.konfigurator || {}, preise = b.preise || {}, name = (preise.name) || (P().PAKETE[b.paket_bestellt] || {}).name || '';
  const steuer = preise.mwst ? 'zzgl. ' + preise.mwst + ' % MwSt.' : 'ohne Umsatzsteuer (§ 19 UStG)';
  const inhalt = absatz('Guten Tag' + (p.daten && p.daten.ap ? ' ' + esc(p.daten.ap) : '') + ',') +
    absatz('vielen Dank für Ihre Bestellung. Sie ist bei uns eingegangen. Der Vertrag kommt zustande, sobald die Einrichtungsgebühr bezahlt ist; darüber schicken wir Ihnen eine eigene E-Mail.') +
    tabelle([['Bestellung', '<b>' + esc(b.nr) + '</b>'], ['Paket', esc(name)], ['Einrichtung', esc(euroText(preise.einrichtung)) + ' netto ' + esc(steuer) + ', einmalig, vorab'], ['Monatlich', esc(euroText(preise.monat)) + ' netto ' + esc(steuer) + ', ab dem Livegang'],
      ['Firma', esc(p.firma)], ['Name im Konfigurator', esc(k.name || '')], ['Wunsch-Domains', esc((k.domains || []).join(', ') || (k.vorschlaege ? 'bitte Vorschläge' : '–'))], ['Anfragen an', esc((k.eingang || []).join(', '))],
      ['Ihre Zustimmung', 'Paketbedingungen und AV-Vertrag, Stand ' + esc(standText(PAKET_STAND)) + ', am ' + esc(zeitText(new Date(jetzt(ctx))))]]) +
    absatz('Die Paketbedingungen und den Vertrag zur Auftragsverarbeitung in dieser Fassung finden Sie im Anhang und unter <a href="' + esc(herkunft(ctx)) + '/konfigurator-bedingungen/">' + esc(herkunft(ctx).replace(/^https?:\/\//, '')) + '/konfigurator-bedingungen/</a>.') +
    knopf(kontoLink(ctx, b), 'Zum Kundenkonto');
  return partnerMail(ctx, p, 'Eingangsbestätigung Ihrer Bestellung ' + b.nr, inhalt, { anhaenge: await bedingungenPdfs(ctx), idempotenz: 'bestellung-' + b.id + '-eingang' });
}

/* ===================== Hinweise für die Zentrale ===================== */
/* Ein Hinweis steht im Verlauf der Bestellung (intern, art „hinweis“), im Protokoll und als Mail beim Inhaber (je Text einmal) */
async function hinweisen(ctx, bid, text, extra) {
  let b = null;
  try { b = bid ? await ctx.sp.bestellungHolen(bid) : null; } catch (e) { b = null; }
  let neu = true;
  if (b) {
    try { const r = await ctx.sp.bestellungAendern(b.id, (z) => { if ((z.verlauf || []).some((v) => v.art === 'hinweis' && v.text === text)) return false; (z.verlauf = z.verlauf || []).push(eintrag(ctx, { art: 'hinweis', intern: true, von: 'system', text: text })); }); neu = r !== false; } catch (e) { /* weiter */ }
  }
  await protokoll(ctx.sp, 'bestellung', null, 'Hinweis: ' + text, Object.assign({ bestellung: bid || null, nr: b ? b.nr : '' }, extra || {}));
  if (neu) await inhaberMail(ctx, 'Hinweis zu ' + (b ? 'Bestellung ' + b.nr : 'einer Paket-Zahlung'), absatz(esc(text)) + (b ? knopf(zentraleLink(ctx, b), 'In der Zentrale ansehen') : '')).catch(() => false);
}

/* ===================== Statuswechsel ===================== */
const ZEITFELD = { bezahlt: 'bezahlt_am', live: 'live_am', pausiert: 'pause_seit', beendet: 'ende_am', storniert: 'ende_am' };
/* Freigabe der aktuellen Vorschau oder Vermerk; Zahlungsmittel aus der Einrichtung (sonst kann das Abo nicht abbuchen) */
function liveVorbedingungen(ctx, b, text) {
  const v = b.vorschau || {}, frei = v.freigabe && v.version && v.freigabe.version === v.version;
  if (!frei && text.length < 10) throw new ApiFehler('Live erst nach Freigabe der aktuellen Vorschau oder mit einem Vermerk (mindestens 10 Zeichen), z. B. „Freigabe telefonisch am …“.', 409, { fehlt: 'freigabe' });
  if (!(b.zahlung && b.zahlung.pm) && ctx.zd && ctx.zd.art === 'stripe') throw new ApiFehler('Es ist kein Zahlungsmittel hinterlegt; das Abo könnte nicht abbuchen.', 409, { fehlt: 'zahlungsmittel' });
}
/* Instanz folgt der Bestellung (verwalten.js, Strang A); geht das noch nicht, steht es im Verlauf */
async function instanzFolgen(ctx, b, grund) {
  if (!b.instanz) return true;
  const ziel = R().instanz.statusFuer(b.status);
  try { await instanzStatus(ctx, b.instanz, ziel, grund || ('Bestellung ' + titel(b.status))); return true; } catch (e) {
    try { await ctx.sp.bestellungAendern(b.id, (z) => { (z.verlauf = z.verlauf || []).push(eintrag(ctx, { art: 'hinweis', intern: true, von: 'system', text: 'Instanz noch auf „' + ziel + '“ setzen: ' + String(e && e.message ? e.message : e).slice(0, 120) })); }); } catch (e2) { /* weiter */ }
    return false;
  }
}
export async function uebergang(ctx, id, nach, o) {
  o = o || {};
  const wer = o.wer || 'inhaber', text = String(o.text || '').replace(/\s+/g, ' ').trim().slice(0, 1000);
  if (RB().STATUS.indexOf(nach) < 0) throw new ApiFehler('Unbekannter Status.', 400);
  if (nach === 'live') { const b0 = await holen(ctx, id); if (b0.status === 'freigabe') { liveVorbedingungen(ctx, b0, text); await aboStarten(ctx, id); } else if (!(b0.abo && b0.abo.id)) throw new ApiFehler('Das Abo läuft nicht; bitte zuerst neu starten.', 409, { fehlt: 'abo' }); }
  const b = await nacheinander('b:' + id, async () => {
    const b0 = await holen(ctx, id);
    const u = RB().uebergang(b0.status, nach, wer);
    if (!u) throw new ApiFehler('Von „' + titel(b0.status) + '“ geht es nicht nach „' + titel(nach) + '“.', 409, { von: b0.status, nach: nach });
    if (u.vermerk && text.length < 10) throw new ApiFehler('Bitte einen Vermerk mit mindestens 10 Zeichen angeben.', 400, { vermerk: true });
    if (nach === 'domain' && !b0.instanz && text.length < 10) throw new ApiFehler('„Domain gesichert“ erst mit angelegter Instanz und Domain, oder mit Vermerk (mindestens 10 Zeichen).', 409, { fehlt: 'instanz' });
    const t = isoJetzt(ctx);
    const neu = await ctx.sp.bestellungAendern(id, (z) => {
      if (z.status !== b0.status) return false;
      z.status = nach;
      if (ZEITFELD[nach]) z[ZEITFELD[nach]] = t;
      if (nach === 'live') { z.pause_seit = null; if (z.abo && z.abo.grund) z.abo = Object.assign({}, z.abo, { grund: '' }); }
      if (nach === 'pausiert' && o.grund) z.abo = Object.assign({}, z.abo, { grund: o.grund });
      (z.verlauf = z.verlauf || []).push(eintrag(ctx, { status: nach, von: wer, text: text }));
    });
    if (neu === false) throw new ApiFehler('Die Bestellung wurde gerade geändert. Bitte neu laden.', 409);
    return neu;
  });
  await instanzFolgen(ctx, b, text);
  const p = await partnerVon(ctx, b), host = await hauptHost(ctx, b), m = o.stumm ? null : statusText(ctx, b, nach, text, host);
  if (m && p) warte(ctx, partnerMail(ctx, p, m[0], absatz('Guten Tag' + (p.daten && p.daten.ap ? ' ' + esc(p.daten.ap) : '') + ',') + m[1] + knopf(kontoLink(ctx, b), 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-' + nach + '-' + (b.verlauf || []).length }));
  await prot(ctx, b, 'Status ' + titel(nach) + (text ? ': ' + text : ''), { von: wer });
  return b;
}

/* ===================== Zahlung der Einrichtung ===================== */
/* session: Stripe-Kasse; o: { bestellung: erwartete Kennung (Rückkehr, Route), quelle: rueckkehr | webhook | abgleich, r: schon gelesen }.
   Bindung (K1.8): metadata.bestellung = Bestellung, metadata.partner = Partner der Bestellung, customer = sein Stripe-Kunde, Betrag =
   Preisstand. Sonst 403 und ein Hinweis in der Zentrale. Bezahlt wird nur einmal: genau ein Wechsel, je eine Mail an Partner und Inhaber. */
export async function einrichtungUebernehmen(ctx, session, o) {
  o = o || {};
  const r = o.r || (await ctx.zd.einrichtungLesen(session));
  if (!r || !r.bestellung) throw new ApiFehler('Diese Zahlung gibt es nicht.', 404);
  const bid = o.bestellung || r.bestellung;
  if (r.bestellung !== bid) { await hinweisen(ctx, bid, 'Rückkehr aus einer Kasse, die zu einer anderen Bestellung gehört (Kasse ' + String(session).slice(0, 40) + ').', { session: session }); throw new ApiFehler('Diese Zahlung gehört nicht zu dieser Bestellung.', 403); }
  return nacheinander('b:' + bid, async () => {
    const b = await holen(ctx, bid);
    const p = await ctx.sp.partnerHolen(b.partner);
    const kundeFalsch = ctx.zd.art === 'stripe' && (!p || !p.stripe_customer || r.customer !== p.stripe_customer);
    if (r.partner !== b.partner || kundeFalsch) { await hinweisen(ctx, b.id, 'Zahlung mit fremdem Partner oder Stripe-Kunden (Kasse ' + String(session).slice(0, 40) + ').', { session: session }); throw new ApiFehler('Diese Zahlung gehört nicht zu dieser Bestellung.', 403); }
    const z0 = b.zahlung || {};
    if (z0.status === 'bezahlt') {
      if (z0.session && z0.session !== session && r.bezahlt) await hinweisen(ctx, b.id, 'Die Einrichtung wurde ein zweites Mal bezahlt (Kasse ' + String(session).slice(0, 40) + '): bitte erstatten.', { session: session });
      return { ok: true, bezahlt: true, schon: true, status: b.status, bestellung: b };
    }
    if (r.bezahlt) {
      const soll = einrichtungBrutto(b.preise);
      if (Number(r.betrag) !== soll) { await hinweisen(ctx, b.id, 'Bezahlter Betrag ' + (r.betrag / 100).toFixed(2) + ' € weicht vom Preisstand ' + (soll / 100).toFixed(2) + ' € ab; nicht als bezahlt übernommen.', { session: session }); throw new ApiFehler('Der bezahlte Betrag passt nicht zur Bestellung. Wir melden uns.', 403); }
      const t = isoJetzt(ctx), offen = b.status === 'offen';
      const neu = await ctx.sp.bestellungAendern(b.id, (z) => {
        if ((z.zahlung || {}).status === 'bezahlt') return false;
        z.zahlung = Object.assign({}, z.zahlung, { status: 'bezahlt', session: session, pi: r.pi || '', pm: r.pm || '', betrag_cent: r.betrag, rechnung: r.rechnung || '', zeit: t });
        if (z.status === 'offen') { z.status = 'bezahlt'; z.bezahlt_am = t; }
        (z.verlauf = z.verlauf || []).push(eintrag(ctx, { status: z.status === 'bezahlt' ? 'bezahlt' : undefined, von: 'stripe', text: 'Einrichtung bezahlt: ' + euroText(r.betrag / 100) + (o.quelle ? ' (' + o.quelle + ')' : '') }));
      });
      if (neu === false) { const b2 = await holen(ctx, b.id); return { ok: true, bezahlt: true, schon: true, status: b2.status, bestellung: b2 }; }
      if (!offen) await hinweisen(ctx, b.id, 'Zahlung der Einrichtung zu einer Bestellung im Status „' + titel(b.status) + '“ eingegangen: bitte prüfen und gegebenenfalls erstatten.', { session: session });
      if (ctx.zaehlen) ctx.zaehlen('ereignis:paket_bezahlt');
      if (r.customer && r.pm) warte(ctx, ctx.zd.standardZahlungsart(r.customer, r.pm));
      const name = (b.preise && b.preise.name) || '';
      warte(ctx, partnerMail(ctx, p, 'Bestellung ' + b.nr + ': Einrichtung bezahlt', absatz('Guten Tag' + (p.daten && p.daten.ap ? ' ' + esc(p.daten.ap) : '') + ',') +
        absatz('vielen Dank, die Einrichtungsgebühr für <b>' + esc(name) + '</b> ist bezahlt. Damit ist Ihre Bestellung ' + esc(b.nr) + ' verbindlich. Die Rechnung schickt Ihnen Stripe in einer eigenen E-Mail.') +
        absatz('So geht es weiter: Wir melden uns innerhalb eines Werktags zu Ihrer Wunschzeit, sichern die Domain, gestalten Ihren Konfigurator und schicken Ihnen eine Vorschau zur Freigabe. Ihr Monatsabo beginnt erst, wenn Ihr Konfigurator live geht.') +
        knopf(kontoLink(ctx, b), 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-bezahlt' }));
      warte(ctx, inhaberMail(ctx, 'Bestellung bezahlt: ' + (p.firma || '') + ' · ' + name, absatz('Die Einrichtung für Bestellung <b>' + esc(b.nr) + '</b> ist bezahlt (' + esc(euroText(r.betrag / 100)) + '). Nächster Schritt: Einrichtung beginnen.') + tabelle(kontaktZeilen(p)) + knopf(zentraleLink(ctx, b), 'In der Zentrale öffnen'), p.mail, { idempotenz: 'bestellung-' + b.id + '-bezahlt-inhaber' }));
      await prot(ctx, neu, 'Einrichtung bezahlt (' + (o.quelle || 'stripe') + ')');
      return { ok: true, bezahlt: true, erstes: true, status: neu.status, bestellung: neu };
    }
    if (r.laeuft && z0.status !== 'laeuft') {
      const neu = await ctx.sp.bestellungAendern(b.id, (z) => { if (['bezahlt', 'laeuft'].includes((z.zahlung || {}).status)) return false; z.zahlung = Object.assign({}, z.zahlung, { status: 'laeuft', session: session, pi: r.pi || (z.zahlung || {}).pi || '' }); (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: 'stripe', text: 'Lastschrift unterwegs' })); });
      if (neu !== false) warte(ctx, partnerMail(ctx, p, 'Bestellung ' + b.nr + ': Lastschrift ist unterwegs', absatz('vielen Dank. Ihre Lastschrift ist unterwegs; das dauert meist 2 bis 5 Werktage. Sobald sie gutgeschrieben ist, beginnen wir mit der Einrichtung und melden uns.') + knopf(kontoLink(ctx, b), 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-laeuft' }));
      return { ok: true, bezahlt: false, laeuft: true, status: b.status, bestellung: neu || b };
    }
    return { ok: true, bezahlt: false, laeuft: !!r.laeuft || z0.status === 'laeuft', fehlgeschlagen: !!r.fehlgeschlagen, status: b.status, bestellung: b };
  });
}
async function zahlungFehlgeschlagen(ctx, bid, session) {
  return nacheinander('b:' + bid, async () => {
    const b = await holen(ctx, bid);
    if ((b.zahlung || {}).status === 'bezahlt') return false;
    const neu = await ctx.sp.bestellungAendern(b.id, (z) => { z.zahlung = Object.assign({}, z.zahlung, { status: 'fehlgeschlagen', session: session || (z.zahlung || {}).session }); (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: 'stripe', text: 'Lastschrift zurückgegeben' })); });
    const p = await partnerVon(ctx, b);
    if (p) warte(ctx, partnerMail(ctx, p, 'Bestellung ' + b.nr + ': Lastschrift zurückgegeben', absatz('leider ist die Lastschrift für die Einrichtungsgebühr zurückgekommen. Bitte bezahlen Sie die Einrichtung erneut, gern auch mit Karte; sie bestätigt sofort.') + knopf(kontoLink(ctx, b), 'Erneut bezahlen'), { idempotenz: 'bestellung-' + b.id + '-fehl-' + String(session || '').slice(-12) }));
    return neu;
  });
}

/* ===================== Stripe-Ereignisse ===================== */
const PAKET_ARTEN = ['einrichtung', 'paket', 'paket_zahlungsart'];
const aboAngaben = (obj) => obj.subscription_details || (obj.parent && obj.parent.subscription_details) || null;
const aboVon = (obj) => idVon(obj.subscription) || idVon((aboAngaben(obj) || {}).subscription);
/* Gehört das Ereignis zu den Paketen? Nur über die Metadaten (art), nie über metadata.betrieb */
export function paketObjekt(ev) {
  const obj = (ev && ev.data && ev.data.object) || {}, md = obj.metadata || {};
  if (PAKET_ARTEN.includes(md.art)) return true;
  const sd = aboAngaben(obj);
  if (sd && sd.metadata && sd.metadata.art === 'paket') return true;
  const zeilen = obj.lines && obj.lines.data;
  return !!(Array.isArray(zeilen) && zeilen.some((l) => l && l.metadata && l.metadata.art === 'paket'));
}
/* Wie paketObjekt, dazu Rückbuchungen einer bekannten Zahlung und Abo-Ereignisse eines bekannten Paket-Abos (Ereignisse ohne Metadaten).
   Eine Störung der Datenbank zählt als „nein“: Das Ereignis geht dann den bisherigen Weg (der Altbestand ignoriert es), und der tägliche
   Abgleich holt die Bestellung nach. */
export async function istPaketEreignis(ctx, ev) {
  if (paketObjekt(ev)) return true;
  if (!ctx.sp || !ctx.sp.bestellungNachAbo) return false;
  const obj = (ev && ev.data && ev.data.object) || {}, typ = String(ev && ev.type || '');
  try {
    if (/^charge\.dispute\./.test(typ)) { const pi = idVon(obj.payment_intent); return !!(pi && (await ctx.sp.bestellungNachPi(pi))); }
    if (/^invoice\./.test(typ)) { const sub = aboVon(obj); return !!(sub && (await ctx.sp.bestellungNachAbo(sub))); }
    if (/^customer\.subscription\./.test(typ)) return !!(obj.id && (await ctx.sp.bestellungNachAbo(obj.id)));
  } catch (e) { return false; }
  return false;
}
const periodeBis = (obj) => { const l = obj.lines && obj.lines.data && obj.lines.data[0]; const t = (l && l.period && l.period.end) || obj.period_end || 0; return t ? new Date(t * 1000).toISOString() : null; };
const aboBis = (sub) => { const t = (sub && (sub.current_period_end || (sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end))) || 0; return t ? new Date(t * 1000).toISOString() : null; };

export async function paketEreignis(ctx, ev) {
  const typ = ev.type, obj = (ev.data && ev.data.object) || {}, md = obj.metadata || {};
  if (/^checkout\.session\./.test(typ)) {
    if (md.art !== 'einrichtung') return false;
    if (typ === 'checkout.session.async_payment_failed') return md.bestellung ? zahlungFehlgeschlagen(ctx, md.bestellung, obj.id) : false;
    if (typ === 'checkout.session.expired') {
      if (!md.bestellung) return false;
      return ctx.sp.bestellungAendern(md.bestellung, (z) => { const za = z.zahlung || {}; if (za.session !== obj.id || za.status !== 'kasse') return false; z.zahlung = Object.assign({}, za, { status: '' }); }).catch(() => false);
    }
    if (typ === 'checkout.session.completed' || typ === 'checkout.session.async_payment_succeeded') {
      const r = await ctx.zd.einrichtungLesen(obj.id).catch(() => null);
      if (!r) return false;
      try { return await einrichtungUebernehmen(ctx, obj.id, { r: r, quelle: 'webhook' }); } catch (e) { if (e instanceof ApiFehler && (e.status === 403 || e.status === 404)) return false; throw e; }
    }
    return false;
  }
  if (typ === 'invoice.paid' || typ === 'invoice.payment_succeeded') { const b = await ctx.sp.bestellungNachAbo(aboVon(obj)); return b ? aboBezahlt(ctx, b, obj) : false; }
  if (typ === 'invoice.payment_failed') { const b = await ctx.sp.bestellungNachAbo(aboVon(obj)); return b ? zahlungOffen(ctx, b, obj.hosted_invoice_url || '') : false; }
  if (typ === 'customer.subscription.updated') { const b = await ctx.sp.bestellungNachAbo(obj.id); return b ? aboAktualisieren(ctx, b, obj) : false; }
  if (typ === 'customer.subscription.deleted') { const b = await ctx.sp.bestellungNachAbo(obj.id); return b ? aboBeendet(ctx, b, 'stripe') : false; }
  if (/^charge\.dispute\./.test(typ)) {
    const b = await ctx.sp.bestellungNachPi(idVon(obj.payment_intent));
    if (!b) return false;
    await hinweisen(ctx, b.id, 'Rückbuchung (' + typ.replace('charge.dispute.', '') + ') über ' + ((obj.amount || 0) / 100).toFixed(2) + ' €' + (obj.reason ? ', Grund: ' + obj.reason : '') + '. Der Status bleibt; bitte entscheiden.', { dispute: obj.id || '' });
    return true;
  }
  return false;
}
/* Abo-Rechnung bezahlt: Abo aktiv, Kulanz vorbei; war die Bestellung wegen der Zahlung pausiert, geht sie wieder live */
async function aboBezahlt(ctx, b, obj) {
  let wieder = false;
  await nacheinander('b:' + b.id, async () => {
    const neu = await ctx.sp.bestellungAendern(b.id, (z) => {
      const a = Object.assign({}, z.abo || {});
      a.kulanz_bis = null; a.offeneRechnung = ''; a.bis = periodeBis(obj) || a.bis || null; a.bezahlt = isoJetzt(ctx);
      if (z.abo_status !== 'gekuendigt' && z.abo_status !== 'ausgesetzt') z.abo_status = 'aktiv';
      if (z.status === 'pausiert' && a.grund === 'zahlung') { z.status = 'live'; z.pause_seit = null; a.grund = ''; wieder = true; (z.verlauf = z.verlauf || []).push(eintrag(ctx, { status: 'live', von: 'stripe', text: 'Zahlung eingegangen, wieder live' })); }
      z.abo = a;
    });
    if (wieder) {
      await instanzFolgen(ctx, neu, 'Zahlung eingegangen');
      const p = await partnerVon(ctx, neu);
      if (p) warte(ctx, partnerMail(ctx, p, 'Zahlung eingegangen: Ihr Konfigurator ist wieder online', absatz('vielen Dank, die offene Zahlung ist eingegangen. Ihr Konfigurator ist wieder für Ihre Kunden erreichbar.') + knopf(kontoLink(ctx, neu), 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-wieder-' + String(obj.id || '').slice(-14) }));
    }
  });
  return true;
}
/* Abbuchung fehlgeschlagen: 14 Tage Kulanz ab dem ersten Fehlschlag (der Tageslauf pausiert danach), Mails an beide */
async function zahlungOffen(ctx, b, rechnung) {
  let erstes = false;
  const neu = await nacheinander('b:' + b.id, () => ctx.sp.bestellungAendern(b.id, (z) => {
    const a = Object.assign({}, z.abo || {});
    if (!a.kulanz_bis) { a.kulanz_bis = new Date(jetzt(ctx) + R().FRISTEN.kulanzTage * TAG).toISOString(); erstes = true; }
    if (rechnung) a.offeneRechnung = rechnung;
    z.abo = a; z.abo_status = 'zahlung_offen';
    if (erstes) (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: 'stripe', text: 'Abbuchung fehlgeschlagen, Kulanz bis ' + datumText(a.kulanz_bis) }));
  }));
  if (erstes && neu) {
    const p = await partnerVon(ctx, neu), bis = datumText(neu.abo.kulanz_bis);
    if (p) warte(ctx, partnerMail(ctx, p, 'Zahlung für Ihren Konfigurator offen', absatz('die Abbuchung für Ihr Abo hat leider nicht geklappt. Bitte bezahlen Sie die offene Rechnung bis zum ' + esc(bis) + '; danach müssten wir Ihren Konfigurator pausieren.') + (neu.abo.offeneRechnung ? knopf(neu.abo.offeneRechnung, 'Offene Rechnung bezahlen') : knopf(kontoLink(ctx, neu), 'Zum Kundenkonto')), { idempotenz: 'bestellung-' + b.id + '-offen-' + neu.abo.kulanz_bis.slice(0, 10) }));
    warte(ctx, inhaberMail(ctx, 'Zahlung offen: ' + ((p && p.firma) || neu.nr), absatz('Die Abbuchung für Bestellung ' + esc(neu.nr) + ' ist fehlgeschlagen. Kulanz bis ' + esc(bis) + ', danach pausiert der Server die Instanz.') + knopf(zentraleLink(ctx, neu), 'In der Zentrale öffnen'), p && p.mail));
  }
  return true;
}
async function aboAktualisieren(ctx, b, sub) {
  if (sub.status === 'canceled') return aboBeendet(ctx, b, 'stripe');
  let mail = '';
  const neu = await nacheinander('b:' + b.id, () => ctx.sp.bestellungAendern(b.id, (z) => {
    const a = Object.assign({}, z.abo || {}), vorher = z.abo_status;
    a.bis = aboBis(sub) || a.bis || null; a.kuendigt = !!sub.cancel_at_period_end;
    if (sub.metadata && P().gueltig(sub.metadata.paket)) a.paket = sub.metadata.paket;
    if (sub.pause_collection && sub.pause_collection.behavior) z.abo_status = 'ausgesetzt';
    else if (sub.cancel_at_period_end) { z.abo_status = 'gekuendigt'; a.ende = a.bis; if (vorher !== 'gekuendigt') mail = 'gekuendigt'; }
    else if (sub.status === 'incomplete_expired') { z.abo_status = 'zahlung_offen'; a.neuStarten = true; }
    else if (sub.status === 'past_due' || sub.status === 'unpaid') { z.abo_status = 'zahlung_offen'; if (!a.kulanz_bis) a.kulanz_bis = new Date(jetzt(ctx) + R().FRISTEN.kulanzTage * TAG).toISOString(); }
    else if (sub.status === 'active' || sub.status === 'trialing') { if (vorher === 'gekuendigt') mail = 'zurueck'; if (vorher !== 'zahlung_offen' || !a.kulanz_bis) z.abo_status = 'aktiv'; a.ende = null; a.neuStarten = false; }
    if (z.abo_status !== vorher) (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: 'stripe', text: 'Abo: ' + RB().ABO_TITEL[z.abo_status] + (z.abo_status === 'gekuendigt' && a.ende ? ' zum ' + datumText(a.ende) : '') }));
    z.abo = a;
  }));
  if (neu && neu.abo && neu.abo.neuStarten) await hinweisen(ctx, b.id, 'Die erste Abbuchung des Abos ist verfallen (incomplete_expired): bitte „Abo neu starten“.');
  if (mail && neu) {
    const p = await partnerVon(ctx, neu);
    if (p && mail === 'gekuendigt') { warte(ctx, partnerMail(ctx, p, 'Kündigung bestätigt', absatz('wir bestätigen die Kündigung Ihres Abos zum ' + esc(datumText(neu.abo.ende)) + '. Bis dahin bleibt Ihr Konfigurator online. Danach pausieren wir ihn und löschen die Daten Ihrer Kunden nach ' + R().FRISTEN.loeschenNachEndeTage + ' Tagen.') + knopf(kontoLink(ctx, neu), 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-kuendigung-' + String(neu.abo.ende || '').slice(0, 10) })); warte(ctx, inhaberMail(ctx, 'Kündigung: ' + p.firma, absatz('Bestellung ' + esc(neu.nr) + ' ist zum ' + esc(datumText(neu.abo.ende)) + ' gekündigt.') + knopf(zentraleLink(ctx, neu), 'In der Zentrale öffnen'), p.mail)); }
    if (p && mail === 'zurueck') warte(ctx, partnerMail(ctx, p, 'Kündigung zurückgenommen', absatz('Ihre Kündigung ist zurückgenommen; Ihr Abo läuft weiter.') + knopf(kontoLink(ctx, neu), 'Zum Kundenkonto')));
  }
  return true;
}
/* Abo bei Stripe beendet: nach einer Kündigung des Partners endet der Vertrag (beendet, Löschung nach 30 Tagen); sonst (Zahlungsausfall,
   Stripe hat nach allen Versuchen gekündigt) wird pausiert, Hinweis „Abo neu starten“, nach höchstens 60 Tagen Pause endet er */
async function aboBeendet(ctx, b, wer) {
  const b0 = await holen(ctx, b.id);
  if (b0.abo_status === 'beendet' && ['pausiert', 'beendet', 'storniert'].includes(b0.status)) return true;
  const gekuendigt = !!((b0.abo && b0.abo.kuendigt) || b0.abo_status === 'gekuendigt');
  await nacheinander('b:' + b.id, () => ctx.sp.bestellungAendern(b.id, (z) => { z.abo_status = 'beendet'; z.abo = Object.assign({}, z.abo, { ende: isoJetzt(ctx) }); (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: wer || 'stripe', text: 'Abo beendet' + (gekuendigt ? ' (Kündigung)' : '') })); }));
  if (b0.status === 'live') {
    if (gekuendigt) await uebergang(ctx, b.id, 'pausiert', { wer: 'system', text: 'Abo nach Kündigung beendet', grund: 'abo_beendet', stumm: true }).then(() => uebergang(ctx, b.id, 'beendet', { wer: 'system', text: 'Vertrag nach Kündigung beendet' }));
    else { await uebergang(ctx, b.id, 'pausiert', { wer: 'system', text: 'Abo bei Stripe beendet', grund: 'abo_beendet' }); await hinweisen(ctx, b.id, 'Das Abo ist bei Stripe beendet (nicht durch Kündigung): Instanz pausiert. Nach Zahlung „Abo neu starten“, sonst endet der Vertrag nach ' + R().FRISTEN.pauseMaxTage + ' Tagen Pause.'); }
  } else if (b0.status === 'pausiert' && gekuendigt) await uebergang(ctx, b.id, 'beendet', { wer: 'system', text: 'Vertrag nach Kündigung beendet' });
  return true;
}

/* ===================== Abo ===================== */
/* Monatsabo beim Live-Schalten (die Zentrale ruft es über uebergang(…, 'live') oder direkt): mit dem Zahlungsmittel aus der Einrichtung,
   ein Abo je Bestellung (läuft schon eins, bleibt es). o.neu: neu starten (nach incomplete_expired oder beendetem Abo) */
export async function aboStarten(ctx, id, o) {
  o = o || {};
  const r = await nacheinander('b:' + id, async () => {
    const b = await holen(ctx, id);
    if (!['freigabe', 'live', 'pausiert'].includes(b.status)) throw new ApiFehler('Das Abo startet erst mit dem Live-Schalten.', 409);
    const a0 = b.abo || {};
    if (a0.id && !o.neu) {
      const l = await ctx.zd.paketAboLesen(a0.id).catch(() => null);
      if (l && ['active', 'trialing', 'past_due', 'incomplete'].includes(l.status)) return { ok: true, schon: true, abo: a0, bestellung: b };
    }
    const p = await ctx.sp.partnerHolen(b.partner);
    if (!p || !p.stripe_customer) throw new ApiFehler('Zu diesem Partner gibt es keinen Stripe-Kunden.', 409, { fehlt: 'kunde' });
    if (!(b.zahlung && b.zahlung.pm) && ctx.zd.art === 'stripe') throw new ApiFehler('Es ist kein Zahlungsmittel hinterlegt; das Abo könnte nicht abbuchen.', 409, { fehlt: 'zahlungsmittel' });
    const paket = await aktuellesPaket(ctx, b), n = o.neu ? (Number(a0.n) || 1) + 1 : Number(a0.n) || 1;
    const r = await ctx.zd.paketAboStarten({ customer: p.stripe_customer, paket: paket, pm: (b.zahlung || {}).pm || '', bestellung: b.id, partner: b.partner, n: n });
    const offen = !!r.offeneRechnung, t = isoJetzt(ctx);
    const neu = await ctx.sp.bestellungAendern(b.id, (z) => {
      z.abo = { id: r.id, paket: paket, monat: P().preis(paket).monat, seit: (z.abo && z.abo.id === r.id && z.abo.seit) || t, bis: r.bis || null, n: n, kulanz_bis: offen ? new Date(jetzt(ctx) + R().FRISTEN.kulanzTage * TAG).toISOString() : null, offeneRechnung: r.offeneRechnung || '', geprueft: t, grund: (z.abo && z.abo.grund) || '' };
      z.abo_status = offen ? 'zahlung_offen' : 'aktiv';
      (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: 'system', text: (o.neu ? 'Abo neu gestartet' : r.vorhanden ? 'Abo übernommen' : 'Abo gestartet') + ' (' + P().PAKETE[paket].name + ', ' + euroText(P().preis(paket).monat) + ' netto im Monat)' }));
    });
    if (offen) warte(ctx, partnerMail(ctx, p, 'Bitte bestätigen Sie die Zahlung für Ihr Abo', absatz('Ihre Bank möchte die erste Abbuchung Ihres Abos bestätigt haben. Bitte bestätigen Sie sie über den Knopf; Ihr Konfigurator bleibt so lange online.') + knopf(r.offeneRechnung, 'Zahlung bestätigen'), { idempotenz: 'bestellung-' + b.id + '-abo-bestaetigen-' + n }));
    await prot(ctx, neu, 'Abo ' + (o.neu ? 'neu gestartet' : 'gestartet') + ' (' + r.id + ')');
    return { ok: true, abo: neu.abo, bestellung: neu, wiederLive: !!(o.neu && neu.status === 'pausiert' && !offen) };
  });
  /* nach dem Neustart wieder live (außerhalb der Reihe dieser Bestellung, sonst warteten beide aufeinander) */
  if (r.wiederLive) { r.bestellung = await uebergang(ctx, id, 'live', { wer: 'inhaber', text: 'Abo neu gestartet' }); }
  return r;
}

/* Paket wechseln: die einzige Stelle, die instanzen.paket ändert, zusammen mit dem Preis des Abos (Bauplan §2.1, E2). id: Bestellung
   oder Instanz. Nach oben sofort, Abo anteilig; mit o.differenz die Differenz der Einrichtung als Posten auf die nächste Rechnung (§5.3 F2).
   Nach unten ebenfalls sofort, das Abo ohne Ausgleich (der laufende Monat ist bezahlt). Vor der Instanz merkt sich die Bestellung das
   neue Paket (abo.paket, paketVon), solange sie offen ist, auch als bestelltes Paket mit neuem Preisstand. */
export async function paketWechseln(ctx, id, ziel, o) {
  o = o || {};
  if (!P().gueltig(ziel)) throw new ApiFehler('Unbekanntes Paket.', 400);
  let b = await ctx.sp.bestellungHolen(id);
  if (!b) {
    const inst = ctx.sp.instanzHolen ? await ctx.sp.instanzHolen(id) : null;
    if (inst && inst.bestellung) b = await ctx.sp.bestellungHolen(inst.bestellung);
    else if (inst) { await paketSetzen(ctx, inst.id, ziel, 'ohne Bestellung'); return { ok: true, paket: ziel }; }
  }
  if (!b) throw new ApiFehler('Diese Bestellung gibt es nicht.', 404);
  return nacheinander('b:' + b.id, async () => {
    b = await holen(ctx, b.id);
    if (['storniert', 'beendet'].includes(b.status)) throw new ApiFehler('Diese Bestellung ist ' + titel(b.status).toLowerCase() + '.', 409);
    const alt = await aktuellesPaket(ctx, b);
    if (alt === ziel) return { ok: true, paket: ziel, gleich: true };
    const pa = P().preis(alt), pn = P().preis(ziel), oben = pn.monat > pa.monat, unbezahlt = b.status === 'offen' && !['bezahlt', 'laeuft'].includes((b.zahlung || {}).status);
    if (b.instanz) await paketSetzen(ctx, b.instanz, ziel, 'Bestellung ' + (b.nr || b.id));
    let posten = false;
    if (b.abo && b.abo.id && b.abo_status !== 'beendet') await ctx.zd.paketAboAendern(b.abo.id, { paket: ziel, oben: oben });
    const p = await ctx.sp.partnerHolen(b.partner);
    if (oben && o.differenz && !unbezahlt && pn.einrichtung > pa.einrichtung && p && p.stripe_customer) { await ctx.zd.paketPosten({ customer: p.stripe_customer, cent: Math.round((pn.einrichtung - pa.einrichtung) * 100), text: 'Paketwechsel ' + P().PAKETE[alt].name + ' → ' + P().PAKETE[ziel].name + ': Differenz der Einrichtung', bestellung: b.id, schluessel: alt + '-' + ziel + '-' + ((b.verlauf || []).length) }); posten = true; }
    const neu = await ctx.sp.bestellungAendern(b.id, (z) => {
      if (unbezahlt) { z.paket_bestellt = ziel; z.preise = P().preisStand(ziel, ctx.k.preise.mwst); }
      z.abo = Object.assign({}, z.abo, { paket: ziel, monat: pn.monat });
      (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: o.wer || 'inhaber', text: 'Paket gewechselt: ' + P().PAKETE[alt].name + ' → ' + P().PAKETE[ziel].name + (posten ? ', Differenz der Einrichtung auf der nächsten Rechnung' : '') }));
    });
    if (p && !unbezahlt) warte(ctx, partnerMail(ctx, p, 'Ihr Paket: ' + P().PAKETE[ziel].name, absatz('Ihr Konfigurator läuft ab jetzt im Paket <b>' + esc(P().PAKETE[ziel].name) + '</b> (' + esc(euroText(pn.monat)) + ' netto im Monat' + (b.abo && b.abo.id ? ', ab der nächsten Abrechnung' : ', ab dem Livegang') + ').' + (posten ? ' Die Differenz der Einrichtungsgebühr (' + esc(euroText(pn.einrichtung - pa.einrichtung)) + ' netto) steht auf Ihrer nächsten Rechnung.' : '')) + knopf(kontoLink(ctx, neu), 'Zum Kundenkonto')));
    await prot(ctx, neu, 'Paket gewechselt: ' + alt + ' → ' + ziel);
    return { ok: true, paket: ziel, oben: oben, posten: posten, bestellung: neu };
  });
}

/* Abo steuern (Zentrale; kuendigen/zuruecknehmen auch das Kundenkonto ohne Kundenportal). o: { tage, text, wer } */
export async function aboSteuern(ctx, id, aktion, o) {
  o = o || {};
  const wer = o.wer || 'inhaber';
  if (aktion === 'neu') return aboStarten(ctx, id, { neu: true });
  const b = await holen(ctx, id), a = b.abo || {};
  if (aktion === 'kulanz') {
    const tage = Math.max(1, Math.min(30, Math.round(Number(o.tage) || 0)));
    const neu = await nacheinander('b:' + id, () => ctx.sp.bestellungAendern(id, (z) => { const ab = Object.assign({}, z.abo || {}), von = Math.max(jetzt(ctx), Date.parse(ab.kulanz_bis || '') || 0); ab.kulanz_bis = new Date(von + tage * TAG).toISOString(); z.abo = ab; (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: wer, text: 'Kulanz verlängert bis ' + datumText(ab.kulanz_bis) })); }));
    return { ok: true, bestellung: neu };
  }
  if (!a.id) throw new ApiFehler('Zu dieser Bestellung läuft kein Abo.', 409);
  if (aktion === 'kuendigen' || aktion === 'zuruecknehmen') {
    const r = await ctx.zd.paketAboAendern(a.id, aktion === 'kuendigen' ? { kuendigen: true } : { zuruecknehmen: true });
    const neu = await nacheinander('b:' + id, () => ctx.sp.bestellungAendern(id, (z) => { const ab = Object.assign({}, z.abo || {}); ab.kuendigt = aktion === 'kuendigen'; ab.ende = ab.kuendigt ? (r && r.bis) || ab.bis || null : null; if (r && r.bis) ab.bis = r.bis; z.abo = ab; if (z.abo_status !== 'beendet') z.abo_status = ab.kuendigt ? 'gekuendigt' : 'aktiv'; (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: wer, text: ab.kuendigt ? 'Abo gekündigt' + (ab.ende ? ' zum ' + datumText(ab.ende) : '') : 'Kündigung zurückgenommen' })); }));
    await prot(ctx, neu, aktion === 'kuendigen' ? 'Abo gekündigt' : 'Kündigung zurückgenommen', { von: wer });
    return { ok: true, bestellung: neu };
  }
  if (aktion === 'aussetzen') {
    await ctx.zd.paketAboAendern(a.id, { aussetzen: true });
    await nacheinander('b:' + id, () => ctx.sp.bestellungAendern(id, (z) => { z.abo_status = 'ausgesetzt'; }));
    if (b.status === 'live') await uebergang(ctx, id, 'pausiert', { wer: wer, text: o.text || 'Pausiert durch den Inhaber', grund: 'inhaber' });
    return { ok: true, bestellung: await holen(ctx, id) };
  }
  if (aktion === 'fortsetzen') {
    await ctx.zd.paketAboAendern(a.id, { fortsetzen: true });
    await nacheinander('b:' + id, () => ctx.sp.bestellungAendern(id, (z) => { z.abo_status = z.abo && z.abo.kulanz_bis ? 'zahlung_offen' : 'aktiv'; }));
    if (b.status === 'pausiert') await uebergang(ctx, id, 'live', { wer: wer, text: o.text || 'Fortgesetzt' });
    return { ok: true, bestellung: await holen(ctx, id) };
  }
  if (aktion === 'beenden') {
    if (b.status === 'live' && String(o.text || '').trim().length < 10) throw new ApiFehler('Bitte einen Vermerk mit mindestens 10 Zeichen angeben.', 400, { vermerk: true });
    await ctx.zd.paketAboBeenden(a.id);
    await nacheinander('b:' + id, () => ctx.sp.bestellungAendern(id, (z) => { z.abo_status = 'beendet'; z.abo = Object.assign({}, z.abo, { ende: isoJetzt(ctx) }); }));
    if (['live', 'pausiert'].includes(b.status)) await uebergang(ctx, id, 'beendet', { wer: wer, text: o.text || 'Abo beendet' });
    return { ok: true, bestellung: await holen(ctx, id) };
  }
  throw new ApiFehler('Unbekannte Aktion.', 400);
}

/* Einrichtung erstatten (voll ohne cent). Partner-Storno im Status „bezahlt“ erstattet voll (Vorschlag §5.3 F2) */
export async function erstatten(ctx, id, o) {
  o = o || {};
  return nacheinander('b:' + id, async () => {
    const b = await holen(ctx, id), z0 = b.zahlung || {};
    if (!['bezahlt', 'erstattet'].includes(z0.status) || !z0.pi) throw new ApiFehler('Zu dieser Bestellung gibt es keine bezahlte Einrichtung.', 409);
    const rest = (Number(z0.betrag_cent) || 0) - (Number(z0.erstattet_cent) || 0);
    const cent = o.cent == null ? rest : Math.round(Number(o.cent));
    if (!(cent > 0) || cent > rest) throw new ApiFehler('Der Betrag ist zu hoch oder null.', 400);
    const r = await ctx.zd.erstatten(z0.pi, cent === Number(z0.betrag_cent) ? null : cent, b.id);
    const neu = await ctx.sp.bestellungAendern(id, (z) => { const za = Object.assign({}, z.zahlung); za.erstattet_cent = (Number(za.erstattet_cent) || 0) + cent; za.erstattung = r.id; if (za.erstattet_cent >= (Number(za.betrag_cent) || 0)) za.status = 'erstattet'; z.zahlung = za; (z.verlauf = z.verlauf || []).push(eintrag(ctx, { von: o.wer || 'inhaber', text: 'Erstattet: ' + euroText(cent / 100) + (o.grund ? ' (' + String(o.grund).slice(0, 200) + ')' : '') })); });
    await prot(ctx, neu, 'Erstattung ' + (cent / 100).toFixed(2) + ' €', { von: o.wer || 'inhaber' });
    return { ok: true, cent: cent, bestellung: neu };
  });
}

/* ===================== Uploads der Bestellung sicher ausliefern (Kundenkonto und Zentrale) ===================== */
/* Bilder inline, SVG und PDF nur als Download; nie zwischenspeichern, nie als Seite deuten, ohne Skripte (CSP sandbox) */
export async function dateiAntwort(k, b, did) {
  const d = (b.dateien || []).find((x) => x && x.id === did);
  if (!d) throw new ApiFehler('Diese Datei gibt es nicht.', 404);
  const ab = ablage(k, 'bestellungen'); if (!ab) throw new ApiFehler('Ablage nicht eingerichtet.', 503);
  const bytes = await ab.holen(dateiPfad(b, d));
  if (!bytes) throw new ApiFehler('Diese Datei gibt es nicht mehr.', 404);
  const bild = /^image\/(png|jpeg|webp)$/.test(d.typ), name = String(d.name || 'datei').replace(/[^\w.\- äöüÄÖÜß]/g, '_').slice(0, 80);
  return new Response(bytes, { status: 200, headers: { 'content-type': d.typ, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'content-security-policy': "sandbox; default-src 'none'", 'content-disposition': (bild ? 'inline' : 'attachment') + "; filename=\"" + name.replace(/[^\x20-\x7e]/g, '_') + "\"; filename*=UTF-8''" + encodeURIComponent(name), 'x-robots-tag': 'noindex, nofollow' } });
}
const ENDUNG = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'application/pdf': 'pdf' };
export const dateiPfad = (b, d) => 'partner/' + b.partner + '/' + b.id + '/' + d.id + '.' + (ENDUNG[d.typ] || 'bin');
export async function dateienLoeschen(k, b) {
  const ab = ablage(k, 'bestellungen'); if (!ab) return false;
  try { return await ab.ordnerLoeschen('partner/' + b.partner + '/' + b.id); } catch (e) { return false; }
}

/* ===================== Täglicher Lauf (router.js, CRON_TAEGLICH) =====================
   Kulanz vorbei → pausiert · Pause länger als pauseMaxTage → Abo beenden, beendet · beendet + loeschenNachEndeTage → Instanzdaten und
   Dateien löschen · Freigabe-Erinnerungen nach 3 und 7 Tagen · unbezahlte Entwürfe: nach 3 Tagen einmal erinnern, nach 30 Tagen ohne
   Änderung löschen · Abgleich mit Stripe: offene Kassen der letzten 3 Tage, laufende Abos einmal je Woche. Höchstens 100 Bestellungen
   mit Handlungsbedarf je Lauf, Fehler je Bestellung einzeln. */
export async function bestellungenLauf(k, sp, zd, env) {
  if (!sp || !sp.bestellungenListe) return { ok: true, ohneDaten: true };
  const alle = await sp.bestellungenListe({});
  if (alle === undefined) return { ok: true, ohneTabelle: true };
  const offen = [], ctx = { k: k, env: env || {}, sp: sp, zd: zd, url: null, request: null, waitUntil: (p) => offen.push(Promise.resolve(p).catch(() => false)), zaehlen: null };
  const t = jetzt(ctx), F = R().FRISTEN, alt = (iso, tage) => !!iso && Date.parse(iso) + tage * TAG < t;
  const n = { pausiert: 0, beendet: 0, geloescht: 0, erinnert: 0, entwuerfe: 0, abgleich: 0, fehler: 0 };
  let bearbeitet = 0;
  for (const b of alle) {
    if (bearbeitet >= 100) break;
    try {
      const a = b.abo || {}, za = b.zahlung || {}, v = b.vorschau || {};
      if (b.status === 'live' && b.abo_status === 'zahlung_offen' && a.kulanz_bis && Date.parse(a.kulanz_bis) < t) { bearbeitet++; await uebergang(ctx, b.id, 'pausiert', { wer: 'system', text: 'Kulanz abgelaufen, Zahlung offen', grund: 'zahlung' }); n.pausiert++; continue; }
      if (b.status === 'pausiert' && alt(b.pause_seit, F.pauseMaxTage)) {
        bearbeitet++;
        if (a.id && b.abo_status !== 'beendet' && zd) { await zd.paketAboBeenden(a.id); await sp.bestellungAendern(b.id, (z) => { z.abo_status = 'beendet'; z.abo = Object.assign({}, z.abo, { ende: new Date(t).toISOString() }); }); }
        await uebergang(ctx, b.id, 'beendet', { wer: 'system', text: 'Pause länger als ' + F.pauseMaxTage + ' Tage' }); n.beendet++; continue;
      }
      if ((b.status === 'beendet' || (b.status === 'storniert' && b.instanz)) && alt(b.ende_am, F.loeschenNachEndeTage) && !(b.verlauf || []).some((x) => x.art === 'geloescht')) {
        bearbeitet++;
        let instanzWeg = !b.instanz;
        if (b.instanz) { try { await instanzDatenLoeschen(ctx, b.instanz); instanzWeg = true; } catch (e) { instanzWeg = false; } }
        await dateienLoeschen(k, b);
        await sp.bestellungAendern(b.id, (z) => { z.dateien = []; (z.verlauf = z.verlauf || []).push(eintrag(ctx, instanzWeg ? { art: 'geloescht', von: 'system', text: 'Instanzdaten und Dateien gelöscht (' + F.loeschenNachEndeTage + ' Tage nach Ende)' } : { art: 'hinweis', intern: true, von: 'system', text: 'Dateien gelöscht; Instanzdaten noch löschen (verwalten.instanzDatenLoeschen)' })); });
        n.geloescht++; continue;
      }
      if (b.status === 'freigabe' && v.gesendet && !(v.freigabe && v.freigabe.version === v.version)) {
        const stufe = F.freigabeErinnerung.filter((d) => alt(v.gesendet, d) && !(v.erinnert || []).includes(d)).pop();
        if (stufe) {
          bearbeitet++;
          const p = await sp.partnerHolen(b.partner);
          await sp.bestellungAendern(b.id, (z) => { const vo = Object.assign({}, z.vorschau); vo.erinnert = (vo.erinnert || []).concat(F.freigabeErinnerung.filter((d) => d <= stufe)); z.vorschau = vo; });
          if (p) ctx.waitUntil(partnerMail(ctx, p, 'Erinnerung: Ihr Konfigurator wartet auf Ihre Freigabe', absatz('Ihr Konfigurator ist fertig eingerichtet und wartet seit ' + stufe + ' Tagen auf Ihre Freigabe. Bitte sehen Sie sich die Vorschau an und geben Sie ihn frei, oder sagen Sie uns, was wir ändern sollen.') + (v.link ? knopf(v.link, 'Vorschau ansehen') : '') + knopf(kontoLink(ctx, b), 'Zum Kundenkonto'), { idempotenz: 'bestellung-' + b.id + '-erinnerung-' + v.version + '-' + stufe }));
          n.erinnert++; continue;
        }
      }
      if (b.status === 'offen' && !['bezahlt', 'laeuft'].includes(za.status)) {
        if (alt(b.updated_at, F.bestellEntwurfTage)) { bearbeitet++; if (za.session && za.status === 'kasse' && zd) await zd.einrichtungAblaufen(za.session).catch(() => false); await dateienLoeschen(k, b); await sp.bestellungLoeschen(b.id); await protokoll(sp, 'bestellung', null, 'Unbezahlter Entwurf nach ' + F.bestellEntwurfTage + ' Tagen gelöscht', { bestellung: b.id, nr: b.nr, partner: b.partner }); n.entwuerfe++; continue; }
        if (alt(b.created_at, 3) && !(b.verlauf || []).some((x) => x.art === 'erinnert') && za.status !== 'fehlgeschlagen') {
          bearbeitet++;
          const p = await sp.partnerHolen(b.partner);
          await sp.bestellungAendern(b.id, (z) => { (z.verlauf = z.verlauf || []).push(eintrag(ctx, { art: 'erinnert', intern: true, von: 'system', text: 'Erinnerung: Bestellung nicht abgeschlossen' })); });
          if (p) ctx.waitUntil(partnerMail(ctx, p, 'Ihre Bestellung ist noch nicht abgeschlossen', absatz('Sie haben begonnen, einen Konfigurator zu bestellen (' + esc(b.nr) + '). Ihre Angaben sind gespeichert; Sie können jederzeit weitermachen. Unbezahlte Bestellungen löschen wir nach ' + F.bestellEntwurfTage + ' Tagen ohne Änderung.') + knopf(kontoLink(ctx, b), 'Bestellung fortsetzen'), { idempotenz: 'bestellung-' + b.id + '-offen-erinnerung' }));
          n.erinnert++; continue;
        }
      }
      /* Abgleich: Kassen der letzten 3 Tage, deren Ergebnis noch fehlt (verlorener Webhook, Browser geschlossen) */
      if (b.status === 'offen' && za.session && ['kasse', 'laeuft'].includes(za.status) && !alt(b.updated_at, 3) && zd) {
        const r = await zd.einrichtungLesen(za.session).catch(() => null);
        if (r && (r.bezahlt || r.laeuft)) { bearbeitet++; await einrichtungUebernehmen(ctx, za.session, { r: r, bestellung: b.id, quelle: 'abgleich' }).catch(() => false); n.abgleich++; continue; }
      }
      /* Abo einmal je Woche mit Stripe abgleichen (Status, Paket der Instanz) */
      if (['live', 'pausiert'].includes(b.status) && a.id && b.abo_status !== 'beendet' && (!a.geprueft || alt(a.geprueft, 7)) && zd) {
        bearbeitet++;
        const l = await zd.paketAboLesen(a.id).catch(() => undefined);
        if (l === null || (l && l.status === 'canceled')) await aboBeendet(ctx, b, 'abgleich');
        else if (l) {
          await sp.bestellungAendern(b.id, (z) => { z.abo = Object.assign({}, z.abo, { geprueft: new Date(t).toISOString(), bis: l.bis || (z.abo || {}).bis || null }); });
          if (b.instanz) { const inst = await sp.instanzHolen(b.instanz).catch(() => null); if (inst && P().gueltig(inst.paket) && a.paket && inst.paket !== a.paket) { await zd.paketAboAendern(a.id, { paket: inst.paket, oben: false }); await sp.bestellungAendern(b.id, (z) => { z.abo = Object.assign({}, z.abo, { paket: inst.paket, monat: P().preis(inst.paket).monat }); (z.verlauf = z.verlauf || []).push(eintrag(ctx, { art: 'hinweis', intern: true, von: 'system', text: 'Abo-Preis an das Paket der Instanz angeglichen' })); }); } }
        }
        n.abgleich++; continue;
      }
    } catch (e) { n.fehler++; console.log('Bestellungslauf: Fehler bei', b.nr, String(e && e.message ? e.message : e).slice(0, 160)); }
  }
  await Promise.all(offen);
  return Object.assign({ ok: !n.fehler }, n);
}

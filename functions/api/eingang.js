/* eeziframes · Eingang der Anfragen einer Instanz: Mail mit PDF an den Betrieb, Nachholen, Resend-Webhook, Aufbewahrung
   (Strang A, Bauplan §3 A.7–A.11; Vertrag docs/INSTANZEN.md)
   Jede Anfrage steht mit ihrem Versand in anfragen.versand (im selben Schreibvorgang wie der Eingang, K2.4):
     { runde, status: offen|gesendet|zugestellt|bounce|beschwerde|fehler, versuche, naechster, n, id, bytes, ohneFotos, basis, gesendet,
       zugestellt, pdf: ''|baut|abgestuerzt|ok|nachholen|fehlt|aus, pdfVersuche, pdfGeht, vorab: { id, zeit }, lauf, grund }
   eingangVerarbeiten (Warteschlange, nach der Antwort, alle 10 Minuten) baut das Aufmaßblatt im Worker (blatt-server.js) und schickt die
   Mail an die bestätigten Eingangsadressen (Demo: MAIL_KONTAKT), Antwort an den Kunden, Anhang „Aufmass-<Nr>-<Kunde>.pdf“ bis 7 MB
   (darüber ohne Fotos). Idempotent: Runde und Status in der Zeile, „lauf“ als Sperre gegen zwei gleichzeitige Läufe, Idempotency-Key
   anfrage-<code>-<runde>-<n> bei Resend (n zählt die Sendungen derselben Runde: erneut senden, Bounce, Nachreichen des PDF).
   Scheitert das PDF (Fehler, oder die Rechenzeit des Gratis-Tarifs reicht nicht und Cloudflare bricht ab: dann steht pdf noch auf
   „baut“, wenn der nächste Lauf kommt), geht die Mail trotzdem raus, mit dem Aufmaß als Text und einem Link (Essential/Plus: Seite mit
   Anfrage und Fotos, Signature: Dashboard); das Blatt reicht der Zehn-Minuten-Lauf in einer zweiten Mail nach (höchstens zwei Versuche,
   Status bleibt so lange „offen“). Mail gescheitert: versuche + 1, nächster Versuch nach 10 min · 2^n, nach 8 Versuchen oder 3 Tagen
   „fehler“ mit Hinweis in der Zentrale und Mail an den Inhaber.
   API:
     eingangVerarbeiten(k, sp, code, runde) · versandNachholen(k, sp) · eingangErneut(ctx, code) · probeEingang(ctx, instanzId) ·
     anfragenAufraeumen(k, sp) · textPdf(titel, abschnitte) · eingangAnstossen(ctx, code, runde) · loeschenAbFuer(m, art, jetzt) ·
     instanzKontext(sp, id) · EINGANG (Routen: POST /api/post/webhook, Resend mit Svix-Signatur) */
import '../../web/assets/modell.js';
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import { ApiFehler, gleich } from './umgebung.js';
import { postDienst, mailRahmen, esc, mailOk } from './post.js';
import { ablage, linkOrdner, fotoIds, fotosLinkLoeschen } from './fotos.js';
import { tokenSignieren } from './sitzung.js';
import { blattBauen, logoLaden, base64 } from './blatt-server.js';
import { instanzAusZeile, pruefStoerung } from '../instanz/mandant.js';
import { pseudoKonto, stempelBerlin, datumBerlin, zeitenBerlin } from '../instanz/adapter.js';
export { textPdf } from './blatt-server.js';

const X = () => globalThis.Abrechnung;
const AW = () => globalThis.AW;
const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const MIN = 60000, TAG = 864e5;
export const PDF_VERSUCHE = 2;
const LAUF_MS = 2 * MIN; // so lange gilt ein laufender Versand als Sperre; danach als abgebrochen
const iso = (t) => new Date(t).toISOString();
const zeit = (s) => { const t = Date.parse(s || ''); return Number.isNaN(t) ? 0 : t; };
const jetztVon = (k) => (k && k.jetzt) || Date.now();
/* nur für die Prüfung (POST /api/instanz/test mit DATEN_ATTRAPPE): Fehler beim PDF nachstellen; 'fehler' wirft, 'abbruch' hält den Lauf an
   wie ein Abbruch durch Cloudflare (der Lauf endet ohne Rückschreiben) */
export const pruefPdf = { art: '' };

async function hinweis(sp, art, betrieb, text, daten) {
  if (!sp || !sp.protokollSchreiben) return false;
  try { return await sp.protokollSchreiben({ art: art, betrieb: betrieb || null, text: String(text).slice(0, 300), daten: daten || {} }); } catch (e) { return false; }
}

/* Aufbewahrung je Merkmal (E14): Test/Demo 1 Tag; Essential/Plus bis zur Zustellung höchstens unzustellbarTage (nach der Zustellung
   setzt der Webhook 30 Tage); Signature ('vertrag'): nach fotosSignatureTage nur die Fotos */
export function loeschenAbFuer(m, art, jetzt) {
  const F = R().FRISTEN;
  if (art === 'test' || art === 'demo') return iso(jetzt + F.testTage * TAG);
  if (m && m.aufbewahrung === 'vertrag') return iso(jetzt + F.fotosSignatureTage * TAG);
  return iso(jetzt + F.unzustellbarTage * TAG);
}

/* Instanz wie ctx.instanz, aus der Datenbank (Cron, Warteschlange): mit Haupthost, Abzug und Zugängen */
export async function instanzKontext(sp, id) {
  const i = await sp.instanzHolen(id); if (!i) return null;
  const b = (await sp.betriebHolen(i.betrieb)) || { daten: {} }, d = b.daten || {}, hosts = (await sp.hostsVon(id)) || [];
  const haupt = hosts.find((h) => h.haupt) || hosts[0] || null, roh = Object.assign({}, i); delete roh.entwurf; delete roh.zugang;
  const inst = instanzAusZeile({ host: haupt ? haupt.host : '', haupt: true, hostStatus: haupt ? haupt.status : '', haupthost: haupt ? haupt.host : '', instanz: roh,
    betrieb: { id: b.id || i.betrieb, name: b.name, plz: b.plz, einladung: d.einladung, ap: d.ap, tel: d.tel, mail: d.mail, du: d.du, sperre: (d.verwaltung || {}).sperre } }, haupt ? haupt.host : '');
  if (!inst) return null;
  inst.abzug = d.abzug; inst.zugang = Array.isArray(i.zugang) ? i.zugang : []; inst.partner = i.partner; inst.bestellung = i.bestellung;
  return inst;
}

/* ---------- Mail an den Betrieb ---------- */
const ABSENDERNAME = { deutlich: (n) => 'EEZIframes für ' + n, dezent: (n) => 'Konfigurator ' + n, keine: (n) => n + ' · Fensterplaner' };
export function absender(k, inst) {
  const m = inst.m || {}, f = ABSENDERNAME[m.mailKennzeichnung] || ABSENDERNAME.keine;
  const adresse = m.absender === 'neutral' ? k.instanzen.neutral || k.instanzen.absender : k.instanzen.absender;
  return { name: String(inst.eingang.absendername || f(inst.name)).slice(0, 80), adresse: adresse || '' };
}
export function rahmenMarke(inst, logoCid) {
  const m = inst.m || {};
  if (m.mailKennzeichnung === 'deutlich') return null;
  return m.mailKennzeichnung === 'dezent' ? { name: inst.name, logoCid: logoCid || '', dezent: true } : { name: inst.name, logoCid: logoCid || '' };
}
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const knopf = (href, text) => '<p style="margin:18px 0 6px"><a href="' + esc(href) + '" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#161616;color:#f1f0ea;font-weight:700;text-decoration:none">' + esc(text) + '</a></p>';
const telHref = (t) => { const d = String(t || '').replace(/[^\d+]/g, ''); return d.startsWith('+') ? d : d.startsWith('00') ? '+' + d.slice(2) : d.startsWith('0') ? '+49' + d.slice(1) : d; };
const dateiName = (s) => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'Kunde';
export const anhangName = (l) => 'Aufmass-' + dateiName(l.nr || 'Anfrage') + '-' + dateiName(l.kunde) + '.pdf';
/* Link für den Betrieb: Essential/Plus die Seite mit Anfrage und Originalfotos (Token Zweck fotos, fotoLinkTage), Signature das Dashboard */
async function betriebsLink(k, inst, z) {
  const v = z.versand || {}, basis = v.basis || 'https://' + inst.haupthost, l = z.daten || {};
  if (inst.m.dashboard) return { url: basis + '/betrieb/#projekt-' + encodeURIComponent(l.id || ''), text: 'Im Dashboard öffnen' };
  if (Number(inst.m.fotoLinkTage) > 0 && k.sitzung && k.sitzung.geheimnis) {
    const t = await tokenSignieren(k, 'fotos', { c: z.code, i: inst.id }, Number(inst.m.fotoLinkTage) * 86400);
    const fotos = fotoIds((l.aufmass || {}).windows).size;
    return { url: basis + '/api/instanz/fotos/' + z.code + '?t=' + encodeURIComponent(t), text: fotos ? 'Anfrage und Originalfotos ansehen (' + inst.m.fotoLinkTage + ' Tage)' : 'Anfrage ansehen (' + inst.m.fotoLinkTage + ' Tage)', fotos: true };
  }
  return null;
}
/* o: { pdf: 'anhang'|'folgt'|'fehlt'|'nachtrag', ohneFotos, link } */
export function mailInhalt(k, inst, z, o) {
  const l = z.daten || {}, am = l.aufmass || {}, pr = am.proj || {}, wins = am.windows || [], v = z.versand || {}, m = inst.m || {};
  const nb = (l.runde || 1) > 1 || (v.runde || 1) > 1, test = z.art === 'test';
  const kunde = String(l.kunde || pr.name || 'Ihr Kunde').slice(0, 60), pos = X().nW(wins.length, 'Position', 'Positionen'), nFotos = Number(am.fotos) || fotoIds(wins).size;
  const kl = AW().klaerung(wins, pr, l), offen = kl.filter((r) => !(l.klaer && l.klaer[r.id] && l.klaer[r.id].ok));
  const kontaktZeilen = [['Name', kunde], pr.tel ? ['Telefon', '<a href="tel:' + esc(telHref(pr.tel)) + '" style="color:#161616">' + esc(pr.tel) + '</a>', true] : null, pr.mail ? ['E-Mail', '<a href="mailto:' + esc(pr.mail) + '" style="color:#161616">' + esc(pr.mail) + '</a>', true] : null,
    AW().OPT.erreich[pr.erreich] ? ['Erreichbar', AW().OPT.erreich[pr.erreich]] : null, l.adresse || pr.ort ? ['Ort', l.adresse || pr.ort] : null, l.kontakt && !pr.tel && !pr.mail ? ['Kontakt', l.kontakt] : null].filter(Boolean);
  const tabelle = '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border-collapse:collapse">' + kontaktZeilen.map((r) => '<tr><td style="padding:3px 16px 3px 0;color:#6e6e73;vertical-align:top">' + esc(r[0]) + '</td><td style="padding:3px 0;font-weight:700">' + (r[2] ? r[1] : esc(r[1])) + '</td></tr>').join('') + '</table>';
  const was = o.pdf === 'nachtrag' ? 'Aufmaßblatt zur Anfrage' : nb ? 'Nachbesserung' : 'Neue Anfrage';
  const betreff = (test ? '[Test] ' : '') + was + ': ' + kunde + ' · ' + pos + (l.nr ? ' · ' + l.nr : '');
  const text = AW().aufmassText(l, { abzug: inst.abzug, fuss: m.mailKennzeichnung === 'keine' ? 'Vor der Fertigung Feinaufmaß vor Ort.' : undefined });
  const pdfSatz = o.pdf === 'anhang' ? 'Das Aufmaßblatt hängt als PDF an' + (o.ohneFotos ? ' (ohne Fotos, sonst wäre es für eine E-Mail zu groß)' : '') + '.'
    : o.pdf === 'nachtrag' ? 'Hier kommt das Aufmaßblatt als PDF zu der Anfrage, die schon bei Ihnen ist.'
      : o.pdf === 'folgt' ? 'Das Aufmaßblatt als PDF folgt in einer eigenen E-Mail. Alle Angaben stehen schon unten als Text.' : 'Alle Angaben stehen unten als Text.';
  const inhalt = (test ? absatz('<b>Testanfrage</b> aus der Einrichtung Ihres Fensterplaners. Sie wird nach einem Tag gelöscht.') : '') +
    absatz('Guten Tag,') +
    absatz(o.pdf === 'nachtrag' ? esc(pdfSatz) : esc(kunde) + (nb ? ' hat die Anfrage ' + esc(l.nr || '') + ' nachgebessert: ' : ' hat über Ihren Fensterplaner eine Anfrage geschickt: ') + esc(pos) + (nFotos ? ', ' + esc(X().nW(nFotos, 'Foto', 'Fotos')) : '') + (l.nr && !nb ? ', Nummer ' + esc(l.nr) : '') + '.') +
    (o.pdf === 'nachtrag' ? '' : tabelle) +
    (pr.notiz && o.pdf !== 'nachtrag' ? absatz('<b>Nachricht:</b> ' + esc(pr.notiz)) : '') +
    (offen.length && o.pdf !== 'nachtrag' ? absatz('<b>' + esc(X().nW(offen.length, 'Punkt', 'Punkte')) + ' mit dem Kunden zu klären</b>, zum Beispiel: ' + esc(offen.slice(0, 3).map((r) => r.k + ': ' + String(r.v).replace(/[\s.;:]+$/, '')).join('; ')) + (offen.length > 3 ? '; …' : '.')) : '') +
    (o.pdf === 'nachtrag' ? '' : absatz(esc(pdfSatz))) +
    (o.link ? knopf(o.link.url, o.link.text) : '') +
    (pr.mail && o.pdf !== 'nachtrag' ? absatz('<span style="font-size:13px;color:#6e6e73">Antworten Sie einfach auf diese E-Mail, sie geht direkt an ' + esc(kunde) + '.</span>') : '') +
    (o.pdf === 'nachtrag' ? '' : '<p style="margin:22px 0 6px;font-weight:700">Das Aufmaß als Text</p><pre style="margin:0;padding:12px;border-radius:8px;background:#f5f5f7;white-space:pre-wrap;word-break:break-word;font:13px/1.45 Menlo,Consolas,monospace;color:#1d1d1f">' + esc(text) + '</pre>');
  return { betreff: betreff, inhalt: inhalt, titel: was };
}

/* ---------- Versand einer Anfrage ---------- */
async function zeileSetzen(sp, code, fn) { try { return await sp.anfrageAendern(code, fn); } catch (e) { console.log('Versand nicht vermerkt', code, String(e && e.message ? e.message : e).slice(0, 120)); return false; } }
const naechsterNach = (jetzt, n, basisMin) => iso(jetzt + (basisMin || R().FRISTEN.versandErsterMinuten) * MIN * Math.pow(2, Math.max(0, n - 1)));

export async function eingangVerarbeiten(k, sp, code, runde, o) {
  o = o || {};
  const jetzt = jetztVon(k);
  const z0 = await sp.anfrageHolen(code);
  if (!z0 || !z0.eingegangen_at) return { ok: false, grund: 'fehlt' };
  const pd = postDienst(k); if (!pd) return { ok: false, grund: 'post' };
  /* Sperre setzen und entscheiden, ob das PDF gebaut wird (ein Schreibvorgang) */
  let abgestuerzt = false, mitPdf = false, grund = '';
  const gesperrt = await zeileSetzen(sp, code, (z) => {
    const v = z.versand || {};
    if (runde && v.runde !== runde) { grund = 'alt'; return false; }
    if (v.status !== 'offen') { grund = 'schon'; return false; }
    if (v.lauf && jetzt - zeit(v.lauf) < LAUF_MS && zeit(v.lauf) <= jetzt) { grund = 'laeuft'; return false; }
    abgestuerzt = v.pdf === 'baut';
    const pdfAn = k.instanzen.pdf;
    mitPdf = pdfAn && (v.pdfGeht || (v.pdfVersuche || 0) < PDF_VERSUCHE) && !(abgestuerzt && !v.vorab);
    v.lauf = iso(jetzt);
    if (abgestuerzt) v.pdf = 'abgestuerzt';
    if (mitPdf) { v.pdf = 'baut'; v.pdfVersuche = (v.pdfVersuche || 0) + 1; }
    z.versand = v;
    return true;
  });
  if (!gesperrt) return { ok: true, grund: grund || 'gesperrt' };
  const z = await sp.anfrageHolen(code), v = z.versand || {}, l = z.daten || {};
  const inst = await instanzKontext(sp, z.instanz);
  /* Ergebnis zurückschreiben und die Sperre lösen; _loeschenAb setzt die Aufbewahrung der Zeile */
  const ende = async (patch, ergebnis) => {
    const p = Object.assign({}, patch), la = p._loeschenAb; delete p._loeschenAb;
    await zeileSetzen(sp, code, (x) => { x.versand = Object.assign({}, x.versand || {}, p, { lauf: null }); if (la !== undefined) x.loeschen_ab = la; return true; });
    return ergebnis;
  };
  if (!inst) return ende({ status: 'fehler', grund: 'instanz' }, { ok: false, grund: 'instanz' });
  const demo = inst.demo || z.art === 'demo', an = demo ? [pd.kontakt] : inst.eingang.mails.map((x) => x.mail);
  if (!an.length) {
    await hinweis(sp, 'instanz_versand', inst.betrieb, 'Anfrage ' + (l.nr || code) + ' bei ' + inst.name + ': keine bestätigte Eingangsadresse, nicht verschickt', { code: code, instanz: inst.id });
    return ende({ status: 'fehler', grund: 'kein_empfaenger' }, { ok: false, grund: 'kein_empfaenger' });
  }
  /* PDF bauen (oder nicht) */
  let pdf = null, ohneFotos = !!v.ohneFotos, pdfFehler = '';
  if (mitPdf) {
    try {
      if (pruefPdf.art === 'abbruch' && k.datenAttrappe) return { ok: false, grund: 'abbruch' }; // wie ein Abbruch durch Cloudflare: nichts zurückschreiben
      if (pruefPdf.art === 'fehler' && k.datenAttrappe) throw new Error('PDF-Fehler (Prüfung)');
      let b = await blattBauen(k, inst, z, { ohneFotos: ohneFotos });
      if (b.bytes.length > R().GRENZEN.anhangMax && !ohneFotos) { ohneFotos = true; b = await blattBauen(k, inst, z, { ohneFotos: true }); }
      if (b.bytes.length > R().GRENZEN.anhangMax) throw new Error('PDF zu groß');
      pdf = b;
    } catch (e) { pdfFehler = String(e && e.message ? e.message : e).slice(0, 120); console.log('Aufmaßblatt nicht gebaut', code, pdfFehler); }
  }
  const nachholen = !pdf && k.instanzen.pdf && (v.pdfVersuche || 0) < PDF_VERSUCHE; // das Blatt kommt später in einer zweiten Mail
  /* Vorab-Mail schon da und das PDF klappt wieder nicht: weiter warten oder aufgeben */
  if (v.vorab && !pdf) {
    if (nachholen) return ende({ pdf: 'nachholen', naechster: naechsterNach(jetzt, (v.pdfVersuche || 0) + 1, 30) }, { ok: true, pdf: false, nachholen: true });
    await hinweis(sp, 'instanz_versand', inst.betrieb, 'Aufmaßblatt zu ' + (l.nr || code) + ' bei ' + inst.name + ' ließ sich nicht bauen; der Betrieb hat die Anfrage als Text', { code: code, grund: pdfFehler });
    return ende({ status: v.zugestellt ? 'zugestellt' : 'gesendet', pdf: 'fehlt', naechster: null, _loeschenAb: v.zugestellt ? undefined : nachSendung(k, inst, z, jetzt) }, { ok: true, pdf: false, aufgegeben: true });
  }
  /* Mail zusammenstellen */
  const nachtrag = !!(v.vorab && pdf), link = await betriebsLink(k, inst, z).catch(() => null);
  const logo = rahmenMarke(inst) ? await logoLaden(k, inst) : null, cid = logo ? 'logo-' + inst.id8 : '';
  const mi = mailInhalt(k, inst, z, { pdf: nachtrag ? 'nachtrag' : pdf ? 'anhang' : nachholen ? 'folgt' : 'fehlt', ohneFotos: ohneFotos, link: link });
  const anhaenge = [];
  if (logo) anhaenge.push({ filename: 'logo.' + (logo.typ === 'image/png' ? 'png' : logo.typ === 'image/webp' ? 'webp' : 'jpg'), content: base64(logo.bytes), content_type: logo.typ, content_id: cid });
  if (pdf) anhaenge.push({ filename: anhangName(l), content: base64(pdf.bytes), content_type: 'application/pdf' });
  const n = (v.n || 0) + (nachtrag ? 1 : 0);
  const pr = (l.aufmass || {}).proj || {}, antwortAn = mailOk(pr.mail) ? pr.mail : '';
  const res = await pd.senden({ an: an, betreff: mi.betreff, html: mailRahmen(mi.titel, mi.inhalt, '', { marke: rahmenMarke(inst, cid) }), antwortAn: antwortAn, anhaenge: anhaenge, von: absender(k, inst), idempotenz: 'anfrage-' + code + '-' + (v.runde || 1) + '-' + n });
  if (!res || !res.ok) {
    const versuche = (v.versuche || 0) + 1, zuAlt = jetzt - zeit(z.eingegangen_at) > R().FRISTEN.versandMaxTage * TAG;
    const patch = { versuche: versuche, naechster: naechsterNach(jetzt, versuche), grund: res && res.grund ? res.grund : 'post', n: n, pdf: pdf ? 'ok' : v.pdf === 'baut' ? '' : v.pdf, pdfGeht: !!(pdf || v.pdfGeht) };
    if (versuche >= R().FRISTEN.versandVersuche || zuAlt) {
      patch.status = 'fehler'; patch.naechster = null;
      await hinweis(sp, 'instanz_versand', inst.betrieb, 'Anfrage ' + (l.nr || code) + ' bei ' + inst.name + ' ließ sich nicht zustellen (' + versuche + ' Versuche)', { code: code, instanz: inst.id });
      const kopie = await pd.senden({ an: pd.kontakt, betreff: 'Anfrage nicht verschickt: ' + inst.name + ' · ' + (l.nr || code), html: mailRahmen('Anfrage nicht verschickt', absatz('Die Anfrage ' + esc(l.nr || code) + ' für ' + esc(inst.name) + ' (' + esc(inst.haupthost) + ') ließ sich nach ' + versuche + ' Versuchen nicht verschicken. In der Zentrale unter der Instanz lässt sie sich erneut senden.'), pd.kontakt) }).catch(() => null);
      patch.inhaberInformiert = !!(kopie && kopie.ok);
    }
    return ende(patch, { ok: false, grund: 'post', versuche: versuche });
  }
  /* Erfolg */
  const patch = { id: res.id || '', n: n, gesendet: iso(jetzt), naechster: null, grund: '', bytes: pdf ? pdf.bytes.length : 0, ohneFotos: ohneFotos, versuche: v.versuche || 0 };
  if (pdf) Object.assign(patch, { status: 'gesendet', pdf: 'ok', pdfGeht: true });
  else if (nachholen) Object.assign(patch, { status: 'offen', pdf: 'nachholen', vorab: { id: res.id || '', zeit: iso(jetzt) }, naechster: naechsterNach(jetzt, (v.pdfVersuche || 0) + 1, 30) });
  else Object.assign(patch, { status: 'gesendet', pdf: k.instanzen.pdf ? 'fehlt' : 'aus' });
  if (patch.status === 'gesendet') { const la = nachSendung(k, inst, z, jetzt); if (la !== undefined) patch._loeschenAb = la; }
  /* Signature: Aufmaßblatt ablegen (Unterlagen jederzeit) und im Dashboard melden */
  if (pdf && inst.m.pdfAblage) { const ab = ablage(k, 'blatt'); if (ab) { try { await ab.ablegen('instanz/' + inst.id + '/' + code + '-' + (v.runde || 1) + '.pdf', pdf.bytes, 'application/pdf'); patch.abgelegt = true; } catch (e) { patch.abgelegt = false; } } }
  if (inst.m.dashboard && !nachtrag && z.art !== 'test' && sp.betriebAendern) {
    try { await sp.betriebAendern(inst.betrieb, (a) => { a.notif = [{ when: stempelBerlin(jetzt), new: true, t: ((l.runde || 1) > 1 ? 'Nachbesserung: ' : 'Neue Anfrage: ') + (l.kunde || 'Kunde'), s: X().nW(((l.aufmass || {}).windows || []).length, 'Position', 'Positionen') + (l.nr ? ' · ' + l.nr : ''), to: ['link', l.id] }].concat(a.notif || []).slice(0, 200); }); } catch (e) { /* Meldung ist Zugabe */ }
  }
  return ende(patch, { ok: true, id: res.id, pdf: !!pdf, nachtrag: nachtrag, vorab: !pdf && nachholen });
}
/* Nach dem Senden: ohne Webhook von Resend gilt die Mail als zugestellt, dann beginnt die Aufbewahrung (Essential/Plus) */
function nachSendung(k, inst, z, jetzt) {
  if (z.art === 'test' || z.art === 'demo' || k.instanzen.webhook) return undefined;
  const t = inst.m.aufbewahrung;
  return typeof t === 'number' ? iso(jetzt + t * TAG) : undefined;
}

/* POST /api/aufmass (konten.js): Warteschlange EINGANG, ohne sie nach der Antwort im selben Aufruf */
export async function eingangAnstossen(ctx, code, runde) {
  const q = ctx.env && ctx.env.EINGANG;
  if (q && typeof q.send === 'function') { try { await q.send({ code: code, runde: runde }); return { ok: true, queue: true }; } catch (e) { console.log('Warteschlange nicht erreichbar', String(e && e.message ? e.message : e).slice(0, 100)); } }
  ctx.waitUntil(eingangVerarbeiten(ctx.k, ctx.sp, code, runde).catch((e) => { console.log('Eingang fehlgeschlagen', code, String(e && e.message ? e.message : e).slice(0, 160)); return false; }));
  return { ok: true, queue: false };
}

/* Alle 10 Minuten: fällige Versände; erst alles ohne PDF-Versuch, dann die mit PDF (bricht Cloudflare dabei ab, sind die anderen schon
   durch). Höchstens 5 PDF-Versuche je Lauf */
export async function versandNachholen(k, sp) {
  if (!sp || !sp.anfragenFaellig) return { ok: true, leer: true };
  const jetzt = jetztVon(k), liste = (await sp.anfragenFaellig(jetzt)) || [];
  const ohnePdf = (z) => { const v = z.versand || {}; return !k.instanzen.pdf || (v.pdf === 'baut' && !v.vorab) || (!v.pdfGeht && (v.pdfVersuche || 0) >= PDF_VERSUCHE); };
  const reihe = liste.filter(ohnePdf).concat(liste.filter((z) => !ohnePdf(z)).slice(0, 5));
  const out = { ok: true, faellig: liste.length, gesendet: 0, fehler: 0 };
  for (const z of reihe) {
    try { const r = await eingangVerarbeiten(k, sp, z.code, (z.versand || {}).runde); if (r && r.ok && r.id) out.gesendet++; else if (r && !r.ok) out.fehler++; } catch (e) { out.fehler++; }
  }
  return out;
}

/* Zentrale: „erneut senden“ (neue Sendung derselben Runde, mit PDF) */
export async function eingangErneut(ctx, code) {
  const z = await ctx.sp.anfrageHolen(code); if (!z || !z.eingegangen_at) throw new ApiFehler('Diese Anfrage gibt es nicht.', 404);
  await ctx.sp.anfrageAendern(code, (x) => { const v = x.versand || {}; x.versand = { runde: v.runde || 1, status: 'offen', versuche: 0, n: (v.n || 0) + 1, basis: v.basis, ohneFotos: !!v.ohneFotos, pdfGeht: !!v.pdfGeht, pdfVersuche: 0, erneut: iso(jetztVon(ctx.k)) }; });
  const r = await eingangVerarbeiten(ctx.k, ctx.sp, code, 0);
  return { ok: true, versand: (await ctx.sp.anfrageHolen(code)).versand, ergebnis: r };
}

/* Zentrale: Testanfrage an die Eingangsadressen (nicht gezählt, nach einem Tag weg) */
export async function probeEingang(ctx, instanzId) {
  const sp = ctx.sp, k = ctx.k, inst = await instanzKontext(sp, instanzId); if (!inst) throw new ApiFehler('Diese Instanz gibt es nicht.', 404);
  const row = await sp.betriebHolen(inst.betrieb), jetzt = jetztVon(k);
  let code = '';
  for (let i = 0; i < 5 && !code; i++) { const c = X().newCode(); if (!(await sp.anfrageHolen(c)) && !(await sp.entwurfHolen(c))) code = c; }
  if (!code) throw new ApiFehler('Kein freier Code, bitte noch einmal.', 503);
  const w = AW().mk({ name: 'Wohnzimmer', mo: { wt: 1232, wm: 1230, wb: 1231, hl: 1412, hm: 1410, hr: 1411 }, el: { w: 1200, h: 1380 }, teilung: '2', etage: 'eg' });
  const l = { id: X().newId('l'), code: code, nr: 'TEST-' + code.slice(0, 6).toUpperCase(), kunde: 'Testanfrage', kontakt: 'test@beispiel.de', adresse: inst.recht.ort || '', created: datumBerlin(jetzt), expires: '', status: 'arbeit', progress: 0, via: 'Test', art: 'test', instanz: true, log: { erstellt: stempelBerlin(jetzt) } };
  const a = pseudoKonto((row && row.daten) || {}, l);
  const r = X().importCode(a, { b: code, v: 1, w: [w], p: { name: 'Testanfrage', mail: 'test@beispiel.de', tel: '0221 000000', notiz: 'Testanfrage aus der Einrichtung. Sie wird nach einem Tag gelöscht.' } }, jetzt, 'Test');
  if (!r.ok) throw new ApiFehler('Testanfrage nicht angelegt: ' + r.msg, 500);
  zeitenBerlin(r.l, jetzt); // Eingangszeit in deutscher Zeit
  await sp.anfrageAnlegen({ code: code, instanz: inst.id, betrieb: inst.betrieb, lid: l.id, art: 'test', status: 'eingegangen', nr: l.nr, daten: a.links[0], versand: { runde: 1, status: 'offen', versuche: 0, n: 0, basis: ctx.url && /(^|\.)localhost$/.test(ctx.url.hostname) && inst.haupthost ? ctx.url.protocol + '//' + inst.haupthost + (ctx.url.port ? ':' + ctx.url.port : '') : 'https://' + inst.haupthost }, eingegangen_at: iso(jetzt), loeschen_ab: loeschenAbFuer(inst.m, 'test', jetzt) });
  const e = await eingangVerarbeiten(k, sp, code, 1);
  return { ok: true, code: code, ergebnis: e, versand: (await sp.anfrageHolen(code)).versand };
}

/* ---------- Aufbewahrung (täglich, E14, K1.4, K1.12) ---------- */
export async function anfragenAufraeumen(k, sp) {
  if (!sp || !sp.anfragenZuLoeschen) return { ok: true, leer: true };
  const jetzt = jetztVon(k), F = R().FRISTEN, out = { ok: true, anfragen: 0, fotos: 0, entwuerfe: 0, unzustellbar: 0 };
  const merk = new Map();
  const mVon = async (id) => { if (!merk.has(id)) { const i = await sp.instanzHolen(id).catch(() => null); merk.set(id, i ? P().merkmale(i.paket, i.abweichung) : null); } return merk.get(id); };
  const blatt = ablage(k, 'blatt');
  for (const z of (await sp.anfragenZuLoeschen(jetzt)) || []) {
    try {
      const m = await mVon(z.instanz), v = z.versand || {};
      if (m && m.aufbewahrung === 'vertrag' && z.art !== 'test' && z.art !== 'demo') {
        /* Signature: nach fotosSignatureTage nur die Fotos; Aufmaß und Blatt bleiben bis zum Vertragsende */
        await fotosLinkLoeschen(k, z.code);
        await sp.anfrageAendern(z.code, (x) => { x.loeschen_ab = null; x.daten = Object.assign({}, x.daten || {}, { fotosGeloescht: jetzt }); });
        out.fotos++; continue;
      }
      const nie = z.art !== 'test' && z.art !== 'demo' && v.status !== 'zugestellt' && !(v.status === 'gesendet' && !k.instanzen.webhook);
      if (nie) { out.unzustellbar++; await hinweis(sp, 'instanz_versand', z.betrieb, 'Anfrage ' + (z.nr || z.code) + ' wurde nie zugestellt und nach ' + F.unzustellbarTage + ' Tagen gelöscht', { code: z.code, status: v.status || '' }); }
      await fotosLinkLoeschen(k, z.code);
      if (sp.entwurfLoeschen) await sp.entwurfLoeschen(z.code);
      if (blatt) { try { const namen = await blatt.liste('instanz/' + z.instanz); const weg = namen.filter((n) => n.indexOf(z.code + '-') === 0).map((n) => 'instanz/' + z.instanz + '/' + n); if (weg.length) await blatt.loeschen(weg); } catch (e) { /* nächster Lauf */ } }
      await sp.anfrageLoeschen(z.code);
      out.anfragen++;
    } catch (e) { out.ok = false; }
  }
  /* Website-Entwürfe ohne Anfrage: ohne Fenster nach 24 Stunden, sonst nach 30 Tagen ohne Änderung, jeweils samt Fotos */
  try {
    for (const i of (await sp.instanzenAlle()) || []) {
      for (const e of (await sp.entwuerfeVonBetrieb(i.betrieb)) || []) {
        const mt = e.meta || {}; if (!mt.instanz || mt.gesendet) continue;
        const alter = jetzt - zeit(e.created_at), still = jetzt - zeit(e.updated_at || e.created_at), leer = !(Number(mt.aktuell) > 0);
        if ((leer && alter > F.entwurfLeerStunden * 3600000) || still > F.entwurfStillTage * TAG) {
          if (await sp.anfrageHolen(e.code)) continue;
          await fotosLinkLoeschen(k, e.code); await sp.entwurfLoeschen(e.code); out.entwuerfe++;
        }
      }
    }
  } catch (e) { out.ok = false; }
  return out;
}

/* ---------- Resend-Webhook (Svix-Signatur) ---------- */
function b64Bytes(s) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
async function svixPruefen(geheim, id, ts, signaturen, roh, jetzt) {
  if (!geheim || !id || !ts || !signaturen) return false;
  const t = Number(ts); if (!Number.isFinite(t) || Math.abs(jetzt / 1000 - t) > 300) return false;
  let schluessel; try { schluessel = b64Bytes(String(geheim).replace(/^whsec_/, '')); } catch (e) { return false; }
  const key = await crypto.subtle.importKey('raw', schluessel, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(id + '.' + ts + '.' + roh)));
  const soll = base64(sig);
  for (const teil of String(signaturen).split(' ')) { const [v, s] = teil.split(','); if (v === 'v1' && s && (await gleich(s, soll))) return true; }
  return false;
}
export { svixPruefen };
/* Prüfung: Störung der Datenbank beim Schreiben nachstellen (pruefStoerung.anfragen, nur mit der Daten-Attrappe) */
const gestoerterSpeicher = (sp) => Object.assign(Object.create(sp), { anfrageAendern: async () => { throw new Error('Störung der Datenbank (Prüfung)'); } });
/* Ein Ereignis von Resend verarbeiten: Zustellung, Bounce, Beschwerde, Verzögerung. Jeder Schritt ist wiederholbar (Abgleich über
   v.id === mailId), deshalb darf dasselbe Ereignis nach einem Fehler noch einmal kommen */
async function postEreignis(ctx, sp, ev) {
  const typ = String(ev.type || ''), mailId = String((ev.data || {}).email_id || '');
  const z = mailId ? await sp.anfrageNachMailId(mailId) : null;
  if (!z) return { ok: true, unbekannt: true };
  const k = ctx.k, jetzt = jetztVon(k), pd = postDienst(k);
  const inst = await instanzKontext(sp, z.instanz), m = (inst && inst.m) || {};
  if (typ === 'email.delivered') {
    await sp.anfrageAendern(z.code, (x) => {
      const v = x.versand || {}; if (v.id !== mailId) return false;
      v.zugestellt = iso(jetzt);
      if (v.status === 'gesendet' || v.status === 'bounce') v.status = 'zugestellt';
      if (v.status === 'zugestellt' && typeof m.aufbewahrung === 'number' && x.art !== 'test' && x.art !== 'demo') x.loeschen_ab = iso(jetzt + m.aufbewahrung * TAG);
      x.versand = v;
    });
    return { ok: true, status: 'zugestellt' };
  }
  if (typ === 'email.bounced') {
    let nochmal = false;
    await sp.anfrageAendern(z.code, (x) => {
      const v = x.versand || {}; if (v.id !== mailId) return false;
      if (!v.bounceNochmal) { nochmal = true; x.versand = { runde: v.runde || 1, status: 'offen', versuche: 0, n: (v.n || 0) + 1, basis: v.basis, ohneFotos: true, pdfGeht: !!v.pdfGeht, pdfVersuche: 0, bounce: iso(jetzt), bounceNochmal: true }; }
      else { v.status = 'bounce'; v.bounce = iso(jetzt); x.versand = v; }
    });
    await hinweis(sp, 'instanz_versand', z.betrieb, 'Anfrage ' + (z.nr || z.code) + (inst ? ' bei ' + inst.name : '') + ' kam nicht an (Bounce)' + (nochmal ? ', neuer Versuch ohne Fotos' : ''), { code: z.code, status: 'bounce' });
    if (pd) ctx.waitUntil(pd.senden({ an: pd.kontakt, betreff: 'Anfrage nicht zugestellt: ' + (inst ? inst.name : '') + ' · ' + (z.nr || z.code), html: mailRahmen('Anfrage nicht zugestellt', absatz('Die Mail zur Anfrage ' + esc(z.nr || z.code) + (inst ? ' an ' + esc(inst.name) + ' (' + esc(inst.haupthost) + ')' : '') + ' kam beim Empfänger nicht an. ' + (nochmal ? 'Der Server versucht es einmal ohne Fotos.' : 'Bitte die Eingangsadresse in der Zentrale prüfen.')), pd.kontakt) }).catch(() => false));
    return { ok: true, status: nochmal ? 'offen' : 'bounce', nochmal: nochmal };
  }
  if (typ === 'email.complained') {
    await sp.anfrageAendern(z.code, (x) => { const v = x.versand || {}; if (v.id !== mailId) return false; v.status = 'beschwerde'; v.beschwerde = iso(jetzt); x.versand = v; });
    await hinweis(sp, 'instanz_versand', z.betrieb, 'Beschwerde (Spam) zur Anfrage ' + (z.nr || z.code) + (inst ? ' bei ' + inst.name : ''), { code: z.code, status: 'beschwerde' });
    return { ok: true, status: 'beschwerde' };
  }
  if (typ === 'email.delivery_delayed') {
    await sp.anfrageAendern(z.code, (x) => { const v = x.versand || {}; if (v.id !== mailId) return false; v.verzoegert = iso(jetzt); x.versand = v; });
    return { ok: true, status: 'verzoegert' };
  }
  return { ok: true, ignoriert: typ };
}
export const EINGANG = {
  'POST /api/post/webhook': async (ctx) => {
    if (ctx.instanz) throw new ApiFehler('not_found', 404);
    const geheim = ctx.k.instanzen.webhook; if (!geheim) throw new ApiFehler('Nicht eingerichtet.', 503);
    const h = ctx.request.headers, id = h.get('svix-id') || '', ts = h.get('svix-timestamp') || '', sig = h.get('svix-signature') || '';
    if (!(await svixPruefen(geheim, id, ts, sig, ctx.roh || '', Date.now()))) throw new ApiFehler('Signatur ungültig.', 400);
    if (!ctx.sp) throw new ApiFehler('Nicht eingerichtet.', 503);
    /* Jedes Ereignis nur einmal; vermerkt wird es erst nach der Verarbeitung, wie beim Stripe-Webhook (zahlung.js): Scheitert das
       Schreiben (Datenbank kurz weg), antwortet der Server mit einem Fehler, Resend stellt später erneut zu, und die Wiederholung wird
       verarbeitet statt als doppelt abgewiesen. Sonst gingen Zustellung, Bounce oder Beschwerde verloren. */
    const ereignis = 'svix:' + id.slice(0, 100);
    if (await ctx.sp.ereignisBekannt(ereignis)) return { ok: true, doppelt: true };
    const out = await postEreignis(ctx, pruefStoerung.anfragen && ctx.k.datenAttrappe ? gestoerterSpeicher(ctx.sp) : ctx.sp, ctx.body || {});
    await ctx.sp.ereignisNeu(ereignis);
    return out;
  }
};

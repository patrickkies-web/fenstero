// eeziframes · Prüfabschnitt 26: Aufträge (docs/BESTELLUNG.md): Bestellung /bestellen/, Kundenbereich /konto/, Zentrale /zentrale/,
// Server functions/auftrag/ mit den Attrappen des Instanz-Testservers (Daten, Mail, Zahlung).
// Teil A über die API (Kopfzeile Host, eigene Cookies je Kunde):
//   26.1 Stand und Seiten (no-store, noindex, CSP) · 26.2 Anmeldung per Code (Cookie __Host-kunde, falscher Code, Bremse je Adresse)
//   · 26.3 Entwurf mit Lücken speichern, höchstens drei offene · 26.4 Name unter eeziframes.com (reserviert, frei, belegt)
//   · 26.5 Dateien (Typ aus den Bytes, Platz ersetzt, Essential ohne Fotos, SVG nur als Anhang mit Sandbox) · 26.6 Bestellen (Lücken mit
//   Station, Zustimmung, Kasse, Eingangsbestätigung mit beiden PDFs, Zahlung, Mails an Kunde und Inhaber) · 26.7 fremde Aufträge 404,
//   Zentrale nur angemeldet · 26.8 Zentrale: Eingang, Prompt, Stände bis Live mit Abo, Änderungswunsch, falsche Übergänge
//   · 26.9 Nachrichten in beide Richtungen · 26.10 Storno bis Arbeitsbeginn mit Erstattung · 26.11 Paketwechsel nach der Zahlung nur als
//   Anfrage · 26.12 Tageslauf (Fristen: Entwürfe, Konten ohne Auftrag) · 26.13 nicht auf dem Host einer Instanz
// Teil B im Browser (Telefon und Schreibtisch): die ganze Bestellung Plus von der Paketwahl bis zur Kasse, je Station genau eine volle
//   Pille, Ziele ab 44 px, kein Querscrollen, Fehler am Feld; Kundenbereich nach der Kasse; Zentrale mit „Seite beginnen“.
import fs from 'node:fs';
import path from 'node:path';

export const titel = 'Aufträge: Bestellung, Kundenbereich, Zentrale';
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a5f40000000049454e44ae426082', 'hex');
const SVG = Buffer.from('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script><rect width="10" height="10"/></svg>');

export default async function (h) {
  const { ok } = h, stempel = Date.now().toString(36);
  const kopf = (r, k) => String((r.headers || {})[k] || '');
  const keks = (r) => (r.cookies || []).map((c) => c.split(';')[0]).find((c) => /^__Host-(kunde|inhaber)=./.test(c)) || '';
  /* Kunde: eigene Sitzung, POST mit Herkunft (sonst lehnt die Sitzung ab) */
  async function kunde(mail, ip) {
    const k = { mail: mail, cookie: '' };
    k.api = (pfad, init) => h.api('localhost', pfad, Object.assign({ cookie: k.cookie, origin: true }, init || {}, { headers: Object.assign({ 'x-forwarded-for': ip }, (init || {}).headers || {}) }));
    await k.api('/api/auftrag/code', { body: { mail: mail } });
    const r = await k.api('/api/auftrag/anmelden', { body: { mail: mail, code: '123456' } });
    k.cookie = keks(r); k.anmeldung = r;
    return k;
  }
  const BETRIEB = { firma: 'Fensterbau Prüf GmbH', name: 'Fensterbau Prüf', ort: 'Köln', region: 'Köln und Umgebung', strasse: 'Werkstattweg 12', plz: '50667', bundesland: 'NW', tel: '0221 1234567', mail: 'info@pruef-fenster.de', web: 'www.pruef-fenster.de', ap: 'Petra Prüf', rolle: 'Geschäftsführung', rechtsform: 'GmbH', vertretung: 'Petra Prüf', rueckruf: 'werktags ab 16 Uhr' };

  /* ---------- 26.1 Stand und Seiten ---------- */
  const st = await h.api('localhost', '/api/auftrag/stand');
  const recht = await import(path.join(h.WURZEL, 'functions/api/recht.js'));
  ok(st.status === 200 && st.json.ok && st.json.verkauf.kasse === true && st.json.stand === recht.PAKET_STAND && st.json.daten && st.json.zahlung, '26.1 /api/auftrag/stand: Kasse offen (Attrappe, kein Live-Modus), Fassung der Paketbedingungen ' + recht.PAKET_STAND);
  for (const p of ['/bestellen/', '/konto/', '/zentrale/']) {
    const r = await h.api('localhost', p), csp = kopf(r, 'content-security-policy');
    ok(r.status === 200 && /no-store/.test(kopf(r, 'cache-control')) && /noindex/.test(kopf(r, 'x-robots-tag')) && /script-src 'self'/.test(csp) && !/<script>(?!\s*<\/script>)/.test(r.text) && /auftrag\.css/.test(r.text) && /fi-strahl/.test(r.text), '26.1 ' + p + ': ausgeliefert ohne Zwischenspeicher und Suchmaschinen, CSP ohne Inline-Skript, Stylesheet auftrag.css, Zeichen im Kopf');
  }

  /* ---------- 26.2 Anmeldung per Code ---------- */
  const falschMail = await h.api('localhost', '/api/auftrag/code', { body: { mail: 'kaputt' }, origin: true });
  const mailA = 'kunde-a-' + stempel + '@pruef-fenster.de', vorPost = (await h.post()).length;
  await h.api('localhost', '/api/auftrag/code', { body: { mail: mailA }, origin: true, headers: { 'x-forwarded-for': '10.26.0.1' } });
  const codeMail = (await h.post()).slice(vorPost).find((m) => m.an === mailA);
  const falsch = await h.api('localhost', '/api/auftrag/anmelden', { body: { mail: mailA, code: '000000' }, origin: true, headers: { 'x-forwarded-for': '10.26.0.1' } });
  const A = await kunde(mailA, '10.26.0.1');
  const setz = (A.anmeldung.cookies || []).join(' ');
  ok(falschMail.status === 400 && !!codeMail && /Ihr Code/.test(codeMail.betreff) && /123 456/.test(codeMail.html) && falsch.status === 401 && A.anmeldung.status === 200 && /^__Host-kunde=/.test(A.cookie) && /HttpOnly/i.test(setz) && /SameSite=Strict/i.test(setz) && /Secure/i.test(setz),
    '26.2 Anmeldung: ungültige Adresse 400, Code per Mail (in Gruppen lesbar), falscher Code 401, richtiger Code setzt __Host-kunde (HttpOnly, Secure, SameSite=Strict)');
  const ich = await A.api('/api/auftrag/ich');
  const ohneOrigin = await h.api('localhost', '/api/auftrag/neu', { body: { paket: 'plus' }, cookie: A.cookie });
  ok(ich.json.angemeldet === true && ich.json.mail === mailA && Array.isArray(ich.json.auftraege) && ohneOrigin.status >= 400, '26.2 /api/auftrag/ich kennt den Kunden; POST ohne Herkunft (fremde Seite) wird abgelehnt (' + ohneOrigin.status + ')');
  const brems = []; for (let i = 0; i < 7; i++) brems.push((await h.api('localhost', '/api/auftrag/code', { body: { mail: 'viel-' + stempel + '@pruef-fenster.de' }, origin: true, headers: { 'x-forwarded-for': '10.26.9.' + i } })).status);
  ok(brems.slice(0, 5).every((s) => s === 200) && brems.slice(5).every((s) => s === 429), '26.2 Bremse: fünf Codes je Adresse in 15 Minuten, danach 429 (' + brems.join(' ') + ')');

  /* ---------- 26.3 Entwurf ---------- */
  const neu = await A.api('/api/auftrag/neu', { body: { paket: 'plus', weg: 'ausfuehrlich' } }), a1 = neu.json.auftrag;
  const luecke = await A.api('/api/auftrag/' + a1.id, { method: 'PATCH', body: { angaben: { betrieb: { firma: 'Fensterbau Prüf GmbH' } } } });
  ok(neu.status === 200 && /^A-\d{4}-\d{4}$/.test(a1.nr) && a1.stand === 'entwurf' && a1.angaben.adresse.eingang[0] === mailA && a1.preise.monat === 39 && luecke.status === 200 && luecke.json.auftrag.angaben.betrieb.firma === 'Fensterbau Prüf GmbH' && !!luecke.json.fehler['betrieb.ort'],
    '26.3 Entwurf: Nummer A-JJJJ-NNNN, Preis aus pakete.js festgehalten, Anfragen-Adresse vorbelegt; Speichern mit Lücken geht (Fehler kommen mit)');
  const b2 = await A.api('/api/auftrag/neu', { body: { paket: 'essential' } }), b3 = await A.api('/api/auftrag/neu', { body: { paket: 'signature' } }), b4 = await A.api('/api/auftrag/neu', { body: { paket: 'plus' } });
  ok(b2.status === 200 && b3.status === 200 && b4.status === 409, '26.3 Höchstens drei offene Entwürfe je Kunde (der vierte: 409)');

  /* ---------- 26.4 Name unter eeziframes.com ---------- */
  const e1 = b2.json.auftrag;
  const res = await A.api('/api/auftrag/adresse', { body: { name: 'zentrale' } }), frei = await A.api('/api/auftrag/adresse', { body: { name: 'Fensterbau Prüf ' + stempel, id: e1.id } });
  ok(res.json.frei === false && /reserviert/.test(res.json.text) && frei.json.frei === true && frei.json.host === 'fensterbau-pruef-' + stempel + '.eeziframes.com', '26.4 Essential: reservierte Namen abgelehnt, freier Name als Unteradresse (Umlaute ausgeschrieben)');

  /* ---------- 26.5 Dateien ---------- */
  const up = (a, platz, buf, name) => A.api('/api/auftrag/' + a.id + '/datei', { body: { platz: platz, name: name || platz, daten: buf.toString('base64') } });
  const l1 = await up(a1, 'logo', PNG, 'logo.png'), l2 = await up(a1, 'logo', SVG, 'logo.svg'), txt = await up(a1, 'buehne', Buffer.from('kein Bild'), 'x.png'), fotoEss = await up(e1, 'buehne', PNG);
  const dateien = l2.json.auftrag.dateien.filter((d) => d.platz === 'logo');
  const svgHol = await A.api('/api/auftrag/' + a1.id + '/datei/' + dateien[0].id, { method: 'GET' });
  ok(l1.status === 200 && l2.status === 200 && dateien.length === 1 && dateien[0].typ === 'image/svg+xml' && txt.status === 400 && fotoEss.status === 409 && fotoEss.json.anreiz === true && svgHol.status === 200 && /attachment/.test(kopf(svgHol, 'content-disposition')) && /sandbox/.test(kopf(svgHol, 'content-security-policy')) && /nosniff/.test(kopf(svgHol, 'x-content-type-options')),
    '26.5 Dateien: Typ aus den Bytes, ein Logo ersetzt das vorige, Text als Bild abgelehnt, Essential ohne Fotos (Anreiz), SVG nur als Anhang mit Sandbox');
  const buehne = await up(a1, 'buehne', PNG, 'buehne.png');
  ok(buehne.status === 200 && buehne.json.auftrag.dateien.some((d) => d.platz === 'buehne' && d.typ === 'image/png'), '26.5 Foto für die Bühne abgelegt');

  /* ---------- 26.6 Bestellen ---------- */
  const zu = { unternehmer: true, agb: st.json.stand, avv: true };
  const ohne = await A.api('/api/auftrag/' + a1.id + '/bestellen', { body: { zustimmung: zu } });
  await A.api('/api/auftrag/' + a1.id, { method: 'PATCH', body: { angaben: { betrieb: BETRIEB, adresse: { art: 'neu', domains: ['fensterbau-pruef-' + stempel + '.de'], eingang: [mailA] }, auftritt: { farben: ['#1f6f78'], ueberschrift: 'Fenster aus Köln.', notiz: 'Bitte nur Holz zeigen.' } } } });
  const ohneHaken = await A.api('/api/auftrag/' + a1.id + '/bestellen', { body: { zustimmung: { unternehmer: true, agb: st.json.stand } } });
  const alteFassung = await A.api('/api/auftrag/' + a1.id + '/bestellen', { body: { zustimmung: Object.assign({}, zu, { agb: '2026-10-22' }) } });
  ok(ohne.status === 400 && ohne.json.station === 'betrieb' && !!ohne.json.felder['betrieb.ort'] && ohneHaken.status === 400 && !!ohneHaken.json.felder['zustimmung.avv'] && alteFassung.status === 409 && alteFassung.json.neuLaden === true,
    '26.6 Bestellen: Lücken nennen die Station, fehlende Zustimmung am Haken, eine alte Fassung der Paketbedingungen verlangt neues Laden');
  const vorBest = (await h.post()).length;
  const best = await A.api('/api/auftrag/' + a1.id + '/bestellen', { body: { zustimmung: zu } });
  await new Promise((r) => setTimeout(r, 400));
  const sess = best.json && best.json.url ? new URL(best.json.url, h.base()).searchParams.get('kasse') : '';
  const mails1 = (await h.post({ anhaenge: true })).slice(vorBest), bestaetigt = mails1.find((m) => m.an === mailA && /Ihre Bestellung/.test(m.betreff));
  ok(best.status === 200 && /^\/konto\/\?kasse=test_|\/konto\/\?kasse=test_/.test(best.json.url) && !!bestaetigt && (bestaetigt.anhaenge || []).length === 2 && (bestaetigt.anhaenge || []).every((x) => /\.pdf$/.test(x.name) && x.name.includes(st.json.stand) && x.bytes > 10000),
    '26.6 Kostenpflichtig bestellt: Kasse (Attrappe), Eingangsbestätigung an den Kunden mit Paketbedingungen und AV-Vertrag als PDF der Fassung ' + st.json.stand);
  const vorZahl = (await h.post()).length;
  const kasse = await A.api('/api/auftrag/' + a1.id + '/kasse?session=' + encodeURIComponent(sess), { method: 'GET' });
  const fremdeKasse = await A.api('/api/auftrag/' + a1.id + '/kasse?session=test_fremd', { method: 'GET' });
  await new Promise((r) => setTimeout(r, 300));
  const mails2 = (await h.post()).slice(vorZahl);
  ok(kasse.status === 200 && kasse.json.bezahlt === true && kasse.json.auftrag.stand === 'bezahlt' && kasse.json.auftrag.zahlung.betrag_cent === Math.round(199 * 119) && fremdeKasse.json.bezahlt === true && mails2.some((m) => m.an === mailA && /Ihre Zahlung ist da/.test(m.betreff)) && mails2.some((m) => m.an !== mailA && /Neue Bestellung/.test(m.betreff)),
    '26.6 Rückkehr aus der Kasse: bezahlt (199 € zzgl. 19 %), danach nur noch „bezahlt“ zurück; Mail „Ihre Zahlung ist da“ an den Kunden und „Neue Bestellung“ an den Inhaber');

  /* ---------- 26.7 Fremde Aufträge, Zentrale nur angemeldet ---------- */
  const B = await kunde('kunde-b-' + stempel + '@pruef-fenster.de', '10.26.0.2');
  const fremdLesen = await B.api('/api/auftrag/' + a1.id + '/datei/' + dateien[0].id, { method: 'GET' }), fremdAendern = await B.api('/api/auftrag/' + a1.id, { method: 'PATCH', body: { angaben: { betrieb: BETRIEB } } });
  const ohneZentrale = await h.api('localhost', '/api/inhaber/auftraege');
  ok(fremdLesen.status === 404 && fremdAendern.status === 404 && ohneZentrale.status === 401, '26.7 Ein anderer Kunde sieht und ändert fremde Aufträge nicht (404); die Zentrale antwortet nur angemeldet (401)');

  /* ---------- 26.8 Zentrale ---------- */
  const zFalsch = await h.api('localhost', '/api/inhaber/anmelden', { body: { passwort: 'falsch-falsch-falsch' }, origin: true, headers: { 'x-forwarded-for': '10.26.1.1' } });
  const zAn = await h.api('localhost', '/api/inhaber/anmelden', { body: { passwort: h.PASSWORT }, origin: true, headers: { 'x-forwarded-for': '10.26.1.1' } });
  const Z = { cookie: keks(zAn) };
  const zapi = (pfad, init) => h.api('localhost', pfad, Object.assign({ cookie: Z.cookie, origin: true }, init || {}));
  const liste = await zapi('/api/inhaber/auftraege'), zeile = (liste.json.auftraege || []).find((x) => x.id === a1.id);
  const det = await zapi('/api/inhaber/auftraege/' + a1.id);
  ok(zFalsch.status === 401 && /^__Host-inhaber=/.test(Z.cookie) && /Max-Age=28800/.test((zAn.cookies || []).join(' ')) && !!zeile && zeile.naechster === 'Seite beginnen' && zeile.firma === BETRIEB.firma && det.status === 200 && /Fensterbau Prüf GmbH/.test(det.json.prompt) && /docs\/profis\/plus-vorschau\//.test(det.json.prompt) && /werktags ab 16 Uhr/.test(det.json.prompt) && /Bitte nur Holz zeigen/.test(det.json.prompt) && det.json.auftrag.kunde.mail === mailA,
    '26.8 Zentrale: falsches Passwort 401, Sitzung __Host-inhaber für 8 Stunden; der Eingang zeigt den bezahlten Auftrag mit „Seite beginnen“, der Prompt fasst Betrieb, Vorlage, Anruf und Hinweise zusammen');
  const s1 = await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'in_arbeit' } });
  const ohneLink = await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'vorschau' } });
  const vorV = (await h.post()).length;
  const s2 = await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'vorschau', link: 'https://claude.ai/artifact/beispiel-' + stempel } });
  await new Promise((r) => setTimeout(r, 300));
  const vMail = (await h.post()).slice(vorV).find((m) => m.an === mailA && /Vorschau ist fertig/.test(m.betreff));
  const aend = await A.api('/api/auftrag/' + a1.id + '/freigabe', { body: { aktion: 'aendern', text: 'Bitte das Foto oben tauschen.' } });
  const sprung = await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'live', link: 'https://fensterbau-pruef.de/' } });
  await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'vorschau', link: 'https://claude.ai/artifact/beispiel-2-' + stempel } });
  const frei2 = await A.api('/api/auftrag/' + a1.id + '/freigabe', { body: { aktion: 'freigeben' } });
  const live = await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'live', link: 'https://fensterbau-pruef-' + stempel + '.de/' } });
  const zurueck = await zapi('/api/inhaber/auftraege/' + a1.id + '/stand', { body: { stand: 'vorschau', link: 'https://x.example/' } });
  ok(s1.json.auftrag.stand === 'in_arbeit' && ohneLink.status === 400 && s2.json.auftrag.stand === 'vorschau' && !!vMail && vMail.html.includes('beispiel-' + stempel) && aend.json.auftrag.stand === 'in_arbeit' && aend.json.auftrag.vorschau.aenderung.text === 'Bitte das Foto oben tauschen.' && sprung.status === 409 && frei2.json.auftrag.vorschau.freigabe && live.json.auftrag.stand === 'live' && live.json.auftrag.abo.status === 'aktiv' && zurueck.status === 409,
    '26.8 Stände: In Arbeit → Vorschau nur mit Link (Mail mit Link an den Kunden) → Änderungswunsch zurück in Arbeit → neue Vorschau → Freigabe → Live mit laufendem Abo; ein Sprung oder ein Schritt zurück aus Live: 409');

  /* ---------- 26.9 Nachrichten ---------- */
  await A.api('/api/auftrag/' + a1.id + '/nachrichten', { body: { text: 'Wann rufen Sie an?' } });
  const ung = ((await zapi('/api/inhaber/auftraege')).json.auftraege || []).find((x) => x.id === a1.id).ungelesen;
  const vorN = (await h.post()).length;
  await zapi('/api/inhaber/auftraege/' + a1.id + '/nachricht', { body: { text: 'Morgen um 16 Uhr.' } });
  await new Promise((r) => setTimeout(r, 300));
  const nMail = (await h.post()).slice(vorN).find((m) => m.an === mailA);
  const verlauf = await A.api('/api/auftrag/' + a1.id + '/nachrichten', { method: 'GET' });
  ok(ung >= 1 && !!nMail && /Morgen um 16 Uhr/.test(nMail.html) && verlauf.json.nachrichten.some((n) => n.von === 'inhaber' && n.text === 'Morgen um 16 Uhr.') && verlauf.json.nachrichten.some((n) => n.von === 'kunde'), '26.9 Nachrichten: der Inhaber sieht ungelesene im Eingang, seine Antwort geht per Mail an den Kunden und steht im Kundenbereich');

  /* ---------- 26.10 Storno bis Arbeitsbeginn ---------- */
  const c1 = (await B.api('/api/auftrag/neu', { body: { paket: 'essential' } })).json.auftrag;
  await B.api('/api/auftrag/' + c1.id, { method: 'PATCH', body: { angaben: { betrieb: Object.assign({}, BETRIEB, { firma: 'Storno GmbH' }), adresse: { name: 'storno-' + stempel, eingang: [B.mail] } } } });
  const cb = await B.api('/api/auftrag/' + c1.id + '/bestellen', { body: { zustimmung: zu } });
  await B.api('/api/auftrag/' + c1.id + '/kasse?session=' + new URL(cb.json.url, h.base()).searchParams.get('kasse'), { method: 'GET' });
  const belegt = await A.api('/api/auftrag/adresse', { body: { name: 'storno-' + stempel } });
  const storno = await B.api('/api/auftrag/' + c1.id + '/stornieren', { body: {} });
  const wiederFrei = await A.api('/api/auftrag/adresse', { body: { name: 'storno-' + stempel } });
  const spaet = await A.api('/api/auftrag/' + a1.id + '/stornieren', { body: {} });
  ok(belegt.json.frei === false && storno.status === 200 && storno.json.auftrag.stand === 'storniert' && storno.json.auftrag.zahlung.erstattet === true && wiederFrei.json.frei === true && spaet.status === 409,
    '26.10 Storno: bezahlt und noch nicht begonnen → storniert mit Erstattung, der Name unter eeziframes.com wird wieder frei; nach Arbeitsbeginn nicht mehr (409)');

  /* ---------- 26.11 Paketwechsel nach der Zahlung ---------- */
  const wechsel = await A.api('/api/auftrag/' + a1.id + '/wechsel', { body: { paket: 'signature' } }), direkt = await A.api('/api/auftrag/' + a1.id, { method: 'PATCH', body: { paket: 'signature' } });
  const det2 = await zapi('/api/inhaber/auftraege/' + a1.id);
  ok(wechsel.status === 200 && direkt.status === 409 && det2.json.auftrag.wechsel && det2.json.auftrag.wechsel.paket === 'signature' && det2.json.auftrag.paket === 'plus', '26.11 Nach der Zahlung: Paketwechsel nur als Anfrage (sichtbar in der Zentrale), direkt ändern geht nicht');
  const nachZahlung = await A.api('/api/auftrag/' + a1.id, { method: 'PATCH', body: { angaben: { betrieb: Object.assign({}, BETRIEB, { ort: '' }) } } });
  const geaendert = await A.api('/api/auftrag/' + a1.id, { method: 'PATCH', body: { angaben: { betrieb: Object.assign({}, BETRIEB, { tel: '0221 7654321' }) } } });
  const zeile2 = ((await zapi('/api/inhaber/auftraege')).json.auftraege || []).find((x) => x.id === a1.id);
  ok(nachZahlung.status === 400 && geaendert.status === 200 && zeile2.geaendert === true, '26.11 Nach der Zahlung nur vollständige Angaben; jede Änderung erscheint in der Zentrale als „geändert“');

  /* ---------- 26.12 Tageslauf (eigener Testserver: der Lauf mit vorgestellter Uhr soll die Instanzen der übrigen Abschnitte nicht berühren) ---------- */
  const s3 = await h.server({});
  const s3api = (k, pfad, init) => s3.api('localhost', pfad, Object.assign({ cookie: k.cookie, origin: true }, init || {}, { headers: { 'x-forwarded-for': '10.26.3.' + k.n } }));
  const s3kunde = async (n) => { const k = { n: n, cookie: '', mail: 'lauf-' + n + '-' + stempel + '@pruef-fenster.de' }; await s3api(k, '/api/auftrag/code', { body: { mail: k.mail } }); k.cookie = keks(await s3api(k, '/api/auftrag/anmelden', { body: { mail: k.mail, code: '123456' } })); return k; };
  const K1 = await s3kunde(1), K2 = await s3kunde(2);
  const d1 = (await s3api(K1, '/api/auftrag/neu', { body: { paket: 'plus' } })).json.auftrag, d2 = (await s3api(K1, '/api/auftrag/neu', { body: { paket: 'essential' } })).json.auftrag;
  await s3api(K1, '/api/auftrag/' + d1.id + '/datei', { body: { platz: 'logo', name: 'logo.png', daten: PNG.toString('base64') } });
  const vorLauf = (await s3.attrappe()).ablage.auftraege || [];
  await s3.uhr(31);
  const lauf = await s3.geplant('17 4 * * *');
  await s3.uhr(null);
  const nachLauf = (await s3.attrappe()).ablage.auftraege || [], k1ich = await s3api(K1, '/api/auftrag/ich'), k2ich = await s3api(K2, '/api/auftrag/ich');
  const auf = lauf && lauf.nachholen && lauf.nachholen.auftraege;
  ok(!!auf && auf.ok && auf.entwuerfe === 2 && auf.kunden >= 1 && vorLauf.some((x) => x.includes(d1.id)) && !nachLauf.some((x) => x.includes(d1.id)) && !k1ich.json.angemeldet && !k2ich.json.angemeldet && !!d2,
    '26.12 Tageslauf nach 31 Tagen: Entwürfe samt Dateien weg, danach die Konten ohne Auftrag (' + JSON.stringify(auf) + ')');

  /* ---------- 26.13 Nicht auf dem Host einer Instanz ---------- */
  const inst = await h.api('essential.localhost', '/api/auftrag/stand'), instZ = await h.api('plus.localhost', '/api/inhaber/stand');
  ok(inst.status === 404 && instZ.status === 404, '26.13 Bestellung und Zentrale gibt es nur auf der Hauptdomain, nicht auf dem Host einer Instanz');

  /* ---------- Teil B: im Browser ---------- */
  const bild = fs.readFileSync(path.join(h.WURZEL, 'web/bilder/fensterbauer-dna/modell-anthrazit.webp'));
  const tmp = path.join(h.WURZEL, '.pruef-26-bild.webp'); fs.writeFileSync(tmp, bild);
  const messen = (page) => page.evaluate(() => {
    const sicht = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight * 6; };
    const pillen = [...document.querySelectorAll('.a-pille')].filter((p) => sicht(p) && !p.closest('.a-blatt'));
    const klein = [...document.querySelectorAll('main a, main button, main input:not([type=file]):not([type=checkbox]):not([type=color]), main select, main textarea, .a-kopf a, .a-kopf button')].filter((e) => sicht(e) && !e.closest('.a-vorschau, .a-haken, p, .a-kv') && e.getBoundingClientRect().height < 43.5).map((e) => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().height));
    const schrift = [...document.querySelectorAll('main *')].filter((e) => sicht(e) && !e.closest('.a-vorschau') && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 13).map((e) => e.className + ' ' + getComputedStyle(e).fontSize);
    return { pillen: pillen.length, klein: klein.slice(0, 4), schrift: schrift.slice(0, 4), quer: document.scrollingElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll('h1').length };
  });
  for (const [name, opts] of [['Telefon', h.telefon], ['Schreibtisch', { viewport: { width: 1280, height: 900 }, locale: 'de-DE' }]]) {
    const c = await h.browser.newContext(opts), page = await h.neueSeite(c, h.base());
    const befund = [], mail = 'browser-' + name.length + '-' + stempel + '@pruef-fenster.de';
    const station = async (n) => { await page.waitForTimeout(450); const m = await messen(page); if (m.pillen !== 1 || m.klein.length || m.schrift.length || m.quer || m.h1 !== 1) befund.push(n + ': ' + JSON.stringify(m)); await h.foto(page, 'auftrag-' + n + '-' + (name === 'Telefon' ? 'telefon' : 'desktop')); };
    try {
      await page.goto(h.base() + '/bestellen/#plus', { waitUntil: 'networkidle' });
      await station('1-paket');
      await page.click('.a-fuss .a-pille'); await page.fill('[data-k="mail"] input', mail); await station('2-konto');
      await page.click('.a-fuss .a-pille'); await page.waitForSelector('[data-k="code"] input'); await page.fill('[data-k="code"] input', '123456');
      await page.click('.a-fuss .a-pille'); await page.waitForSelector('[data-k="firma"] input');
      await station('3-betrieb');
      await page.click('.a-fuss .a-pille'); await page.waitForTimeout(500);
      const fehlerZahl = await page.locator('.a-feld.fehlt').count(), fokus = await page.evaluate(() => !!document.activeElement.closest('.a-feld.fehlt'));
      for (const k of ['firma', 'ap', 'tel', 'mail', 'strasse', 'plz', 'ort', 'vertretung']) await page.fill('[data-k="' + k + '"] input', BETRIEB[k]);
      await page.locator('[data-k="firma"] input').blur(); await page.selectOption('[data-k="bundesland"] select', 'NW');
      const name1 = await page.inputValue('[data-k="name"] input'), form1 = await page.inputValue('[data-k="rechtsform"] input');
      await page.click('.a-fuss .a-pille'); await page.waitForSelector('[data-k="domains.0"] input');
      await station('4-adresse');
      await page.fill('[data-k="domains.0"] input', 'fensterbau-browser-' + stempel + '.de');
      await page.click('.a-fuss .a-pille'); await page.waitForSelector('[data-platz="buehne"] input[type=file]', { state: 'attached' });
      await page.setInputFiles('[data-platz="buehne"] input[type=file]', tmp); await page.waitForSelector('[data-platz="buehne"].voll', { timeout: 8000 });
      const vorschauBild = await page.evaluate(() => !!document.querySelector('.a-vorschau .a-vs-bild img'));
      await station('5-auftritt');
      await page.click('.a-fuss .a-pille'); await page.waitForSelector('[data-k="unternehmer"] input');
      await station('6-bestellen');
      await page.click('.a-fuss .a-pille'); await page.waitForTimeout(300);
      const hakenFehlen = await page.locator('.a-haken.fehlt').count();
      for (const k of ['unternehmer', 'agb', 'avv']) await page.check('[data-k="' + k + '"] input');
      await Promise.all([page.waitForURL(/\/konto\//, { timeout: 10000 }), page.click('.a-fuss .a-pille')]);
      await page.waitForSelector('.a-leiste li[aria-current="step"]', { timeout: 8000 });
      const konto = await page.evaluate(() => ({ suche: location.search, text: document.body.innerText }));
      await h.foto(page, 'auftrag-7-konto-' + (name === 'Telefon' ? 'telefon' : 'desktop'));
      ok(fehlerZahl >= 8 && fokus && name1 === 'Fensterbau Prüf' && form1 === 'GmbH' && vorschauBild && hakenFehlen === 3 && konto.suche === '' && /Wir beginnen mit Ihrer Seite/.test(konto.text),
        '26.B ' + name + ': Fehler am Feld mit Fokus, Name und Rechtsform aus der Firma, Foto erscheint in der Vorschau, Haken vor dem Bestellen, nach der Kasse der Kundenbereich mit „Wir beginnen mit Ihrer Seite“');
      ok(!befund.length, '26.B ' + name + ': je Station genau eine volle Pille, ein h1, Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen' + (befund.length ? ': ' + befund.join(' | ') : ''));
      /* Zentrale */
      const zc = await h.browser.newContext(opts), zp = await h.neueSeite(zc, h.base());
      await zp.goto(h.base() + '/zentrale/', { waitUntil: 'networkidle' });
      await zp.fill('[data-k="passwort"] input', h.PASSWORT); await zp.click('.a-fuss .a-pille'); await zp.waitForSelector('.a-eingang-zeile');
      await h.foto(zp, 'auftrag-8-zentrale-' + (name === 'Telefon' ? 'telefon' : 'desktop'));
      const ziel = zp.locator('.a-eingang-zeile').filter({ hasText: 'Seite beginnen' }).filter({ hasText: 'Fensterbau Prüf' }).first();
      await ziel.click(); await zp.waitForSelector('.a-prompt');
      const zm = await messen(zp);
      await zp.click('.a-fuss .a-pille'); await zp.waitForSelector('.a-blatt'); await zp.click('.a-blatt .a-pille'); await zp.waitForFunction(() => /In Arbeit/.test((document.querySelector('.a-buehne-zeile') || {}).textContent || ''), null, { timeout: 8000 });
      ok(zm.pillen === 1 && !zm.quer && !zm.klein.length, '26.B ' + name + ': Zentrale mit Eingang, Auftrag mit Prompt, eine Pille „Seite beginnen“ setzt den Stand auf „In Arbeit“' + (zm.klein.length || zm.quer ? ': ' + JSON.stringify(zm) : ''));
      h.sauber(zp, '26.B Zentrale (' + name + ') ohne Fehler und CSP-Verstöße');
      await zc.close();
    } catch (e) { ok(false, '26.B ' + name + ' läuft durch: ' + String(e && e.message || e).split('\n')[0]); }
    h.sauber(page, '26.B Bestellung und Kundenbereich (' + name + ') ohne Fehler und CSP-Verstöße');
    await c.close();
  }
  try { fs.unlinkSync(tmp); } catch (e) { /* weg */ }
}

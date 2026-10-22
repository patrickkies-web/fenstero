// eeziframes · Prüfabschnitt 24: Eingang der Anfragen einer Instanz (Strang A, Bauplan §3 A.7–A.11; docs/INSTANZEN.md)
// 24.1 Pflichtkontakt, Zeile, Nummern, doppelt · 24.2 Mail mit PDF je Paket · 24.3 Störung und Nachholen · 24.4 Warteschlange · 24.5 Resend-Webhook
// · 24.6 40 Fotos · 24.7 blatt.js ohne DOM · 24.8 Fotoseite · 24.9 Aufbewahrung · 24.10 erneut senden · 24.11 Nachbesserung · 24.12 Löschen
// · 24.13 PDF scheitert (Fehler, Abbruch durch Cloudflare, abgeschaltet): Mail mit Text und Link, Blatt nachgereicht
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { werkzeug } from './23.mjs';

export const titel = 'Eingang der Anfragen (Instanzen)';
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (h) => {
  const { ok } = h, W = h.WURZEL, T = werkzeug(h), I = h.instanzen, eezi = /eeziframes/i;
  const ordner = fs.mkdtempSync(path.join(os.tmpdir(), 'eezi-24-'));
  const pdfText = (b64) => { const f = path.join(ordner, crypto.randomUUID() + '.pdf'); fs.writeFileSync(f, Buffer.from(b64, 'base64')); try { return cp.execFileSync('pdftotext', ['-layout', f, '-']).toString('utf8'); } catch (e) { return ''; } };
  const pdfDaten = (m) => { const i = (m.anhaenge || []).findIndex((a) => a.typ === 'application/pdf'); return i >= 0 && m.anhangDaten ? m.anhangDaten[i] : ''; };
  const iso = () => new Date().toISOString();
  const umg = await import(pathToFileURL(path.join(W, 'functions/api/umgebung.js')).href);
  const GEHEIM = umg.konfig({ DATEN_ATTRAPPE: '1' }).instanzen.webhook;
  const webhook = async (ev, o) => {
    o = o || {}; const body = JSON.stringify(ev), id = o.id || 'msg_' + crypto.randomUUID(), ts = String(o.ts || Math.floor(Date.now() / 1000));
    const sig = 'v1,' + crypto.createHmac('sha256', Buffer.from(GEHEIM.replace(/^whsec_/, ''), 'base64')).update(id + '.' + ts + '.' + body).digest('base64');
    return h.api('localhost', '/api/post/webhook', { body: body, headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': ts, 'svix-signature': o.falsch ? 'v1,AAAA' + sig.slice(7) : sig } });
  };
  /* Anfrage mit einem Foto (kleine Fassung und Original) über die Website senden; wartet auf den Versand */
  const mitFoto = async (host, n, o) => {
    o = o || {};
    const s = await T.start(host); const code = s.json.code, fid = T.id(), w = T.fenster(0, { in: fid, out: T.id() });
    await T.entwurf(host, code, [w]);
    await h.api(host, '/api/link/' + code + '/foto/' + fid, { body: { bild: T.jpeg(n) }, origin: true, headers: T.ip() });
    await h.api(host, '/api/link/' + code + '/foto/' + fid + 'k', { body: { bild: T.jpeg(n + 1) }, origin: true, headers: T.ip() });
    const r = await T.senden(host, code, [w], o.p || T.kontakt(n));
    return { code: code, r: r, fid: fid };
  };

  /* ---------- 24.1 Kontakt Pflicht, Zeile, Nummern, doppelt ---------- */
  const s0 = await T.start(I.essential.host), w0 = [T.fenster(0)];
  await T.entwurf(I.essential.host, s0.json.code, w0);
  const ohne = await T.senden(I.essential.host, s0.json.code, w0, { name: 'X' }), nurName = await T.senden(I.essential.host, s0.json.code, w0, { name: 'Max Muster', tel: '12' });
  const e1 = await T.anfrage(I.essential.host, 1), p1 = await T.anfrage(I.plus.host, 2), e2 = await T.anfrage(I.essential.host, 3), e2b = await T.senden(I.essential.host, e2.code, e2.wins, T.kontakt(3));
  const z1 = await T.zeile(e1.code), z2 = await T.zeile(e2.code), zp = await T.zeile(p1.code), nrZ = (z) => Number(String(z && z.nr).split('-').pop());
  ok(ohne.status === 400 && ohne.json.kontakt === true && nurName.status === 400, '24.1 Ohne Name und gültige Telefonnummer oder E-Mail: 400');
  ok(e1.r.status === 200 && z1 && z1.code === e1.code && z1.instanz === I.essential.id && z1.art === 'website' && z1.status === 'eingegangen' && z1.daten.kunde === 'Familie Prüf 1' && z1.daten.code === e1.code && nrZ(z2) === nrZ(z1) + 1 && /^P-\d{4}-\d{3}$/.test(z1.nr) && zp && zp.instanz === I.plus.id && e1.r.json.nr === z1.nr && e2b.status === 409, '24.1 Mit Kontakt: Zeile mit genau diesem Code, kunde = Name, Nummern je Instanz fortlaufend (' + z1.nr + ', ' + z2.nr + '; Plus ' + (zp && zp.nr) + '), zweimal senden 409');

  /* ---------- 24.2 Mail mit PDF je Paket ---------- */
  await h.instanz('essential', { eingang: { mails: [{ mail: 'anfragen@essential.example', bestaetigt: iso(), eingeladen: iso() }, { mail: 'unbestaetigt@essential.example', bestaetigt: null, eingeladen: iso() }] } });
  const proPaket = {};
  for (const p of ['essential', 'plus', 'signature']) {
    const a = await mitFoto(I[p].host, 40 + Object.keys(proPaket).length * 3, { p: Object.assign(T.kontakt(50 + Object.keys(proPaket).length), { name: 'Familie Mail ' + p }) });
    const m = (await T.warteMail((x) => (x.betreff || '').startsWith('Neue Anfrage: Familie Mail ' + p), 10000, { anhaenge: true }))[0];
    proPaket[p] = { a: a, m: m, text: m ? pdfText(pdfDaten(m)) : '', roh: m ? Buffer.from(pdfDaten(m), 'base64').toString('latin1') : '' };
  }
  const E = proPaket.essential, Pp = proPaket.plus, Sg = proPaket.signature;
  ok(E.m && E.m.an === 'anfragen@essential.example' && Pp.m && Pp.m.an === 'anfragen@plus.example' && Sg.m && Sg.m.an === 'anfragen@signature.example', '24.2 Mail nur an bestätigte Eingangsadressen');
  const anhangOk = (x) => { const a = (x.m.anhaenge || []).find((y) => y.typ === 'application/pdf'); return a && a.bytes < 7000000 && /^Aufmass-P-\d{4}-\d{3}-Familie-Mail-/.test(a.name) && Buffer.from(pdfDaten(x.m), 'base64').slice(0, 4).toString() === '%PDF'; };
  ok([E, Pp, Sg].every(anhangOk), '24.2 Anhang „Aufmass-<Nr>-<Kunde>.pdf“, application/pdf, beginnt mit %PDF, unter 7 MB');
  ok([['essential', 'Fensterbau Amsel'], ['plus', 'Glaserei Fink'], ['signature', 'Fensterwerk Specht']].every(([p, n]) => proPaket[p].text.includes(n) && proPaket[p].text.includes('Familie Mail ' + p) && /zu kl(ä|a)ren/i.test(proPaket[p].text)), '24.2 PDF-Text mit Betrieb, Kunde und Klärungsliste');
  ok(/Aufmaß Ihres Kunden · übermittelt mit eeziframes/.test(E.text) && /eeziframes/.test(Pp.text) && !/Ihres Kunden · übermittelt/.test(Pp.text) && !eezi.test(Sg.text) && !eezi.test(Sg.roh), '24.2 Kennzeichnung im PDF: Essential Untertitel und Fuß, Plus nur Fuß, Signature nirgends (auch nicht als Autor oder Ersteller)');
  ok(E.m.html.includes('cid:eeziframes-zeichen') && E.m.von.name === 'EEZIframes für Fensterbau Amsel' && Pp.m.html.includes('Konfigurator von eeziframes') && !Pp.m.html.includes('cid:eeziframes-zeichen') && Pp.m.von.name === 'Konfigurator Glaserei Fink' && !eezi.test(Sg.m.html) && !eezi.test(Sg.m.betreff) && Sg.m.von.name === 'Fensterwerk Specht · Fensterplaner', '24.2 Kennzeichnung in Mail und Absendername je Paket (Signature ohne eeziframes)');
  ok([E, Pp, Sg].every((x) => x.m.antwortAn === 'pruef' + (x === E ? 50 : x === Pp ? 51 : 52) + '@beispiel.de' && !/gesperrt|Zahlungsart|kostenlos|€|Abo|Tarif/i.test(x.m.html) && /Das Aufmaß als Text/.test(x.m.html)), '24.2 Antwort an den Kunden, kein Sperr- oder Preistext, Aufmaß als Text in der Mail');
  ok(/\/api\/instanz\/fotos\/[a-z0-9]{10}\?t=/.test(E.m.html) && /\/api\/instanz\/fotos\//.test(Pp.m.html) && !/\/api\/instanz\/fotos\//.test(Sg.m.html) && Sg.m.html.includes(h.base('signature.localhost') + '/betrieb/#projekt-') && !E.m.html.includes('/betrieb/#projekt-'), '24.2 Fotolink nur Essential/Plus, Dashboard-Knopf nur Signature (' + h.base('signature.localhost') + '/betrieb/#projekt-…)');
  const ab1 = await h.attrappe();
  ok(ab1.ablage.blatt.includes('instanz/' + I.signature.id + '/' + Sg.a.code + '-1.pdf') && !ab1.ablage.blatt.some((x) => x.includes(E.a.code)), '24.2 Signature: Aufmaßblatt im Bucket blatt abgelegt (pdfAblage), Essential nicht');
  await h.instanz('essential', { eingang: { mails: [{ mail: 'anfragen@essential.example', bestaetigt: iso(), eingeladen: iso() }] } });

  /* ---------- 24.3 Störung des Mailversands ---------- */
  await h.api('localhost', '/api/test/post?stoerung=1');
  const g1 = await T.anfrage(I.essential.host, 60, { p: Object.assign(T.kontakt(60), { name: 'Familie Störung' }) });
  const g1z = await T.warteZeile(g1.code, (z) => (z.versand || {}).versuche === 1);
  await h.api('localhost', '/api/test/post?stoerung=0');
  const vorNach = (await h.post()).filter((m) => (m.betreff || '').includes('Familie Störung')).length;
  await h.uhr(0.01); await h.geplant('*/10 * * * *'); await h.geplant('*/10 * * * *');
  const nachNach = (await h.post()).filter((m) => (m.betreff || '').includes('Familie Störung')).length, g1n = await T.zeile(g1.code);
  await h.uhr(null);
  ok(g1z && g1z.versand.status === 'offen' && !!g1z.versand.naechster && vorNach === 0 && nachNach === 1 && g1n.versand.status === 'gesendet', '24.3 Störung: Versand bleibt offen mit nächstem Versuch; der Zehn-Minuten-Lauf schickt genau eine Mail');
  await h.api('localhost', '/api/test/post?stoerung=1');
  const g2 = await T.anfrage(I.essential.host, 61, { p: Object.assign(T.kontakt(61), { name: 'Familie Dauerstörung' }) });
  await T.warteZeile(g2.code, (z) => (z.versand || {}).versuche === 1);
  for (const t of [0.01, 0.03, 0.06, 0.12, 0.24, 0.47, 0.95]) { await h.uhr(t); await h.geplant('*/10 * * * *'); }
  const g2z = await T.zeile(g2.code);
  await h.api('localhost', '/api/test/post?stoerung=0'); await h.uhr(null);
  const prot = await (await h.zentrale()).api('/api/zentrale/protokoll?art=instanz_versand');
  ok(g2z.versand.status === 'fehler' && g2z.versand.versuche === 8 && (prot.json.eintraege || []).some((e) => e.text.includes(g2z.nr) && /nicht zustellen/.test(e.text)), '24.3 Nach 8 Versuchen „fehler“ mit Hinweis im Protokoll der Zentrale (' + g2z.versand.status + ', ' + g2z.versand.versuche + ')');

  /* ---------- 24.4 Warteschlange ---------- */
  const sq = await h.server({ QUEUE_ATTRAPPE: '1' }), Tq = werkzeug(h, sq);
  const q1 = await Tq.anfrage('essential.localhost', 70, { p: Object.assign(T.kontakt(70), { name: 'Familie Queue' }) });
  const qm = await Tq.warteMail((m) => (m.betreff || '').includes('Familie Queue'), 10000);
  const qa = await sq.attrappe();
  ok(q1.r.status === 200 && qm.length === 1 && (qa.queue || []).some((x) => x.body.code === q1.code && x.body.runde === 1), '24.4 Warteschlange (Attrappe): Nachricht { code, runde }, der Consumer schickt die Mail; ohne Warteschlange nach der Antwort (24.1–24.3)');

  /* ---------- 24.5 Resend-Webhook ---------- */
  const zE = await T.zeile(E.a.code), mailId = zE.versand.id;
  const falsch = await webhook({ type: 'email.delivered', data: { email_id: mailId } }, { falsch: true }), alt = await webhook({ type: 'email.delivered', data: { email_id: mailId } }, { ts: Math.floor(Date.now() / 1000) - 900 });
  const svixId = 'msg_' + crypto.randomUUID(), d1 = await webhook({ type: 'email.delivered', data: { email_id: mailId } }, { id: svixId }), d2 = await webhook({ type: 'email.delivered', data: { email_id: mailId } }, { id: svixId });
  const zE2 = await T.zeile(E.a.code), bis30 = Date.parse(zE2.loeschen_ab) - Date.now();
  ok(falsch.status === 400 && alt.status === 400 && d1.status === 200 && d1.json.status === 'zugestellt' && d2.json.doppelt === true && zE2.versand.status === 'zugestellt' && Math.abs(bis30 - 30 * 864e5) < 3600000, '24.5 Webhook: falsche Signatur oder alter Zeitstempel 400; delivered → zugestellt, Aufbewahrung 30 Tage ab Zustellung; doppelte svix-id nur einmal');
  const zP = await T.zeile(Pp.a.code), b1 = await webhook({ type: 'email.bounced', data: { email_id: zP.versand.id } }), zPb = await T.zeile(Pp.a.code);
  const bounceMail = await T.warteMail((m) => /Anfrage nicht zugestellt: Glaserei Fink/.test(m.betreff || ''), 3000);
  await h.geplant('*/10 * * * *');
  const zPn = await T.zeile(Pp.a.code), b2 = await webhook({ type: 'email.bounced', data: { email_id: zPn.versand.id } }), zPb2 = await T.zeile(Pp.a.code);
  const neuMail = (await h.post()).filter((m) => (m.betreff || '').startsWith('Neue Anfrage: Familie Mail plus'));
  ok(b1.json.nochmal === true && zPb.versand.status === 'offen' && zPb.versand.ohneFotos === true && bounceMail.length >= 1 && zPn.versand.status === 'gesendet' && zPn.versand.n === 1 && neuMail.length === 2 && b2.json.status === 'bounce' && zPb2.versand.status === 'bounce', '24.5 Webhook bounced: Hinweis, Mail an den Inhaber, einmal neuer Versuch ohne Fotos; beim zweiten Bounce bleibt „bounce“');
  const zS = await T.zeile(Sg.a.code), c1 = await webhook({ type: 'email.complained', data: { email_id: zS.versand.id } }), z1d = await T.zeile(e1.code), dl = await webhook({ type: 'email.delivery_delayed', data: { email_id: z1d.versand.id } });
  ok(c1.json.status === 'beschwerde' && (await T.zeile(Sg.a.code)).versand.status === 'beschwerde' && dl.json.status === 'verzoegert' && !!(await T.zeile(e1.code)).versand.verzoegert, '24.5 Webhook complained → beschwerde, delivery_delayed nur vermerkt');

  /* ---------- 24.6 40 Fotos ---------- */
  const seite = await h.neueSeite(await h.browser.newContext());
  const bilder = await seite.evaluate(() => Array.from({ length: 40 }, (_, i) => { const c = document.createElement('canvas'); c.width = 640; c.height = 480; const g = c.getContext('2d'); const v = g.createLinearGradient(0, 0, 640, 480); v.addColorStop(0, 'hsl(' + (i * 9) + ',45%,55%)'); v.addColorStop(1, '#e8e4dc'); g.fillStyle = v; g.fillRect(0, 0, 640, 480); g.fillStyle = '#222'; g.font = 'bold 120px sans-serif'; g.fillText(String(i + 1), 230, 280); g.strokeStyle = '#fff'; g.lineWidth = 12; g.strokeRect(120, 80, 400, 320); return c.toDataURL('image/jpeg', 0.7).split(',')[1]; }));
  await seite.close();
  const s40 = await T.start(I.plus.host), c40 = s40.json.code, w40 = Array.from({ length: 20 }, (_, i) => T.fenster(i, { in: T.id('i' + i), out: T.id('o' + i) }));
  await T.entwurf(I.plus.host, c40, w40);
  let hoch = 0;
  for (let i = 0; i < 20; i++) for (const [k, s] of [[0, 'in'], [1, 'out']]) { const r = await h.api(I.plus.host, '/api/link/' + c40 + '/foto/' + w40[i].bilder[s] + 'k', { body: { bild: bilder[2 * i + k] }, origin: true, headers: T.ip() }); if (r.status === 200) hoch++; }
  const r40 = await T.senden(I.plus.host, c40, w40, Object.assign(T.kontakt(80), { name: 'Familie Vierzig' }));
  const m40 = (await T.warteMail((m) => (m.betreff || '').includes('Familie Vierzig'), 20000, { anhaenge: true }))[0];
  const pdf40 = m40 ? Buffer.from(pdfDaten(m40), 'base64') : Buffer.alloc(0), bilderImPdf = (pdf40.toString('latin1').match(/\/Subtype \/Image/g) || []).length;
  ok(hoch === 40 && r40.status === 200 && pdf40.length > 0 && pdf40.length <= 5000000 && bilderImPdf >= 40 && !/weitere Fotos/.test(pdfText(pdfDaten(m40))), '24.6 40 Fotos: PDF ' + (pdf40.length / 1e6).toFixed(2) + ' MB (höchstens 5 MB) mit allen ' + bilderImPdf + ' kleinen Fotos');

  /* ---------- 24.7 blatt.js ohne DOM (vm wie im Worker), Datum in deutscher Zeit ---------- */
  const FIX = Date.parse('2026-10-22T23:30:00Z');
  const Echt = Date;
  class FixDate extends Echt { constructor(...a) { if (a.length) super(...a); else super(FIX); } static now() { return FIX; } }
  const kx = { navigator: { userAgent: 'Cloudflare-Workers', language: 'de' }, atob, btoa, TextEncoder, TextDecoder, URL, console, setTimeout, clearTimeout, crypto: globalThis.crypto, Date: FixDate, Intl };
  const ctx = vm.createContext(kx); vm.runInContext('globalThis.self = globalThis;', ctx);
  const lade = (rel) => vm.runInContext(fs.readFileSync(path.join(W, rel), 'utf8'), ctx, { filename: rel });
  let vmFehler = '';
  try { ['web/assets/ral.js', 'web/assets/modell.js', 'web/vendor/jspdf.umd.min.js', 'web/assets/blatt-schrift.js', 'web/assets/blatt.js'].forEach(lade); } catch (e) { vmFehler = e.message; }
  let vmPdf = null;
  if (!vmFehler) { try { vmPdf = vm.runInContext('Blatt.pdf({ variante: "betrieb", ausgabe: "bytes", fenster: [AW.mk({ name: "Bad", mo: { wm: 900, wt: 902, wb: 901, hm: 1200, hl: 1201, hr: 1199 } })], projekt: {}, kunde: { name: "Familie Sandbox" }, betrieb: { name: "Fenster Sandbox", nr: "P-2026-099" }, kennzeichnung: "keine", portalKurz: "fenster-sandbox.de" })', ctx); } catch (e) { vmFehler = e.message; } }
  const vmText = vmPdf ? pdfText(Buffer.from(vmPdf).toString('base64')) : '';
  ok(!vmFehler && typeof vm.runInContext('typeof window', ctx) === 'string' && vm.runInContext('typeof window', ctx) === 'undefined' && vmPdf && Buffer.from(vmPdf).slice(0, 4).toString() === '%PDF' && vmText.includes('23. Oktober 2026') && vmText.includes('Familie Sandbox') && !eezi.test(vmText), '24.7 blatt.js ohne window und document (vm wie im Worker): PDF als Bytes, Datum in deutscher Zeit (23:30 UTC → 23. Oktober)' + (vmFehler ? ': ' + vmFehler : ''));

  /* ---------- 24.8 Fotoseite ---------- */
  const href = ((E.m.html.match(/href="(http:\/\/essential\.localhost:\d+\/api\/instanz\/fotos\/[a-z0-9]{10}\?t=[^"]+)"/) || [])[1] || '').replace(/&amp;/g, '&');
  const pfad = href ? href.replace(/^http:\/\/[^/]+/, '') : '/api/instanz/fotos/x';
  const fsE = await h.api(I.essential.host, pfad), bildPfad = ((fsE.text.match(/src="(\/api\/instanz\/fotos\/[^"]+)"/) || [])[1] || '').replace(/&amp;/g, '&');
  const fsBild = bildPfad ? await h.api(I.essential.host, bildPfad) : { status: 0, headers: {} };
  const fsP = await h.api(I.plus.host, pfad), fsH = await h.api('localhost', pfad), fsS = await h.api(I.signature.host, pfad.replace(E.a.code, Sg.a.code));
  const vt = (await T.test({ verwalten: { fn: 'vorschauToken', args: [I.essential.id] } })).verwalten.token, fsZ = await h.api(I.essential.host, '/api/instanz/fotos/' + E.a.code + '?t=' + encodeURIComponent(vt));
  await h.uhr(15); const fsAlt = await h.api(I.essential.host, pfad); await h.uhr(null);
  await warte(300);
  const protF = await (await h.zentrale()).api('/api/zentrale/protokoll?art=instanz_fotos');
  ok(href && fsE.status === 200 && fsE.text.includes('Familie Mail essential') && fsBild.status === 200 && fsBild.headers['content-type'] === 'image/jpeg' && fsP.status === 403 && fsH.status === 404 && fsS.status === 404 && fsZ.status === 403 && fsAlt.status === 403 && (protF.json.eintraege || []).some((e) => e.daten && e.daten.code === E.a.code), '24.8 Fotoseite: mit Token 14 Tage (Seite mit Anfrage und Originalfotos), andere Instanz 403, Hauptdomain 404, Signature 404, falscher Zweck und abgelaufen 403, Abruf im Protokoll');

  /* ---------- 24.10 erneut senden ---------- */
  const vor10 = (await h.post()).filter((m) => (m.betreff || '').includes('Familie Prüf 1 ')).length, z10a = await T.zeile(e1.code);
  const er = (await T.test({ lauf: 'erneut', code: e1.code })).lauf;
  const nach10 = (await h.post()).filter((m) => (m.betreff || '').includes('Familie Prüf 1 '));
  ok(er.ok && er.versand.status === 'gesendet' && er.versand.n === (z10a.versand.n || 0) + 1 && nach10.length === vor10 + 1 && nach10[nach10.length - 1].idempotenz === 'anfrage-' + e1.code + '-1-' + er.versand.n, '24.10 eingangErneut: neue Sendung derselben Runde (Idempotenz …-1-' + er.versand.n + ')');

  /* ---------- 24.9 Aufbewahrung ---------- */
  const auf = (await h.saat({ instanzen: [{ slug: 'aufbewahrung', paket: 'essential', name: 'Aufbewahrung Fenster', plz: '50667' }, { slug: 'aufbew-sig', paket: 'signature', name: 'Aufbewahrung Signatur', plz: '50667' }] }));
  const A1 = auf.aufbewahrung, A2 = auf['aufbew-sig'];
  const probe = (await T.test({ lauf: 'probe', instanz: A1.id })).lauf;
  const dA = await mitFoto(A1.host, 90, { p: Object.assign(T.kontakt(90), { name: 'Familie Zugestellt' }) }), nA = await mitFoto(A1.host, 92, { p: Object.assign(T.kontakt(92), { name: 'Familie Nie' }) }), sA = await mitFoto(A2.host, 94, { p: Object.assign(T.kontakt(94), { name: 'Familie Signatur' }) });
  await T.warteZeile(dA.code, (z) => z.versand.status === 'gesendet'); await T.warteZeile(nA.code, (z) => z.versand.status === 'gesendet'); await T.warteZeile(sA.code, (z) => z.versand.status === 'gesendet');
  await webhook({ type: 'email.delivered', data: { email_id: (await T.zeile(dA.code)).versand.id } });
  const e0 = (await T.start(A1.host)).json.code, eW = (await T.start(A1.host)).json.code; await T.entwurf(A1.host, eW, [T.fenster(0)]);
  const da = async (code) => ({ zeile: !!(await T.zeile(code)), entwurf: (await h.attrappe()).entwuerfe.some((e) => e.code === code), fotos: (await h.attrappe()).ablage.fotos.some((p) => p.startsWith('link/' + code + '/')) });
  const lauf = async (tage) => { await h.uhr(tage); const r = (await T.test({ lauf: 'aufbewahrung' })).lauf; return r; };
  await lauf(1.5);
  const t15 = { probe: await da(probe.code), d: await da(dA.code), e0: await da(e0), eW: await da(eW) };
  await lauf(29); const t29 = { d: await da(dA.code) };
  await lauf(31); const t31 = { d: await da(dA.code), eW: await da(eW), n: await da(nA.code) };
  await lauf(61); const t61 = { n: await da(nA.code), s: await da(sA.code) };
  await lauf(366); const t366 = { s: await da(sA.code), sZ: await T.zeile(sA.code) };
  await h.uhr(null);
  const protA = await (await h.zentrale()).api('/api/zentrale/protokoll?art=instanz_versand');
  ok(!t15.probe.zeile && !t15.e0.entwurf && t15.eW.entwurf && t15.d.zeile && t29.d.zeile && t29.d.fotos, '24.9 Aufbewahrung: Testanfrage nach einem Tag weg, Website-Entwurf ohne Fenster nach 24 Stunden weg, mit Fenster bleibt er; zugestellte Anfrage bleibt bis Tag 30');
  ok(!t31.d.zeile && !t31.d.fotos && !t31.d.entwurf && !t31.eW.entwurf && t31.n.zeile && !t61.n.zeile && !t61.n.fotos && (protA.json.eintraege || []).some((e) => /nie zugestellt/.test(e.text) && e.text.includes((nA.r.json || {}).nr || '?')), '24.9 Essential: 30 Tage nach Zustellung samt Fotos und Zwischenstand gelöscht; Entwurf mit Fenster nach 30 Tagen still weg; nie zugestellt nach 60 Tagen mit Hinweis');
  ok(t61.s.zeile && t61.s.fotos && t366.s.zeile && !t366.s.fotos && !!(t366.sZ && t366.sZ.daten.fotosGeloescht), '24.9 Signature: Anfrage bleibt bis Vertragsende, Originalfotos nach 365 Tagen gelöscht');

  /* ---------- 24.11 Nachbesserung einer Einladung ---------- */
  const ein = (await T.test({ einladung: { instanz: I.signature.id, kunde: 'Familie Nachbessern' } })).einladung, wE = [T.fenster(0)];
  await T.entwurf(I.signature.host, ein.code, wE);
  const ein1 = await T.senden(I.signature.host, ein.code, wE, {});
  const ein1m = await T.warteMail((m) => (m.betreff || '').startsWith('Neue Anfrage: Familie Nachbessern'), 10000);
  await T.test({ nachbesserung: { code: ein.code, hinweis: 'Bitte das Maß prüfen' } });
  const wE2 = [Object.assign({}, wE[0], { ts: Date.now() + 5000, mo: { wt: 1250, wm: 1248, wb: 1249, hl: 1412, hm: 1410, hr: 1411 } })];
  const ein2 = await T.senden(I.signature.host, ein.code, wE2, {}, { runde: 2 });
  const ein2m = (await T.warteMail((m) => (m.betreff || '').startsWith('Nachbesserung: Familie Nachbessern'), 10000, { anhaenge: true }))[0];
  const ab11 = await h.attrappe();
  ok(ein1.status === 200 && ein1m.length === 1 && ein2.status === 200 && ein2.json.nachbesserung === true && ein2.json.runde === 2 && ein2m && (ein2m.anhaenge || []).some((a) => a.typ === 'application/pdf') && ab11.ablage.blatt.includes('instanz/' + I.signature.id + '/' + ein.code + '-2.pdf'), '24.11 Nachbesserung einer Einladung: Mail „Nachbesserung“ mit neuem PDF (Runde 2 abgelegt)');

  /* ---------- 24.12 instanzDatenLoeschen ---------- */
  const lo = (await h.saat({ instanzen: [{ slug: 'loeschprobe', paket: 'signature', name: 'Löschprobe Fenster', plz: '50667' }] })).loeschprobe;
  const uid = 'uid-loesch-' + Date.now().toString(36);
  await h.instanz('loeschprobe', { zugang: [{ mail: 'team@loeschprobe.example', uid: uid, name: 'Team', rolle: 'inhaber', bestaetigt: iso(), zuletzt: null, aus: false }] });
  const loA = await mitFoto(lo.host, 96, { p: Object.assign(T.kontakt(96), { name: 'Familie Löschen' }) }), loV = (await T.start(lo.host)).json.code;
  await T.warteZeile(loA.code, (z) => z.versand.status === 'gesendet');
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 0, 32, 0, 0, 0, 32, 8, 6, 0, 0, 0]), Buffer.alloc(40)]).toString('base64');
  await T.test({ verwalten: { fn: 'bildAblegen', args: [lo.id, 'logo.png', png] } }); await T.test({ verwalten: { fn: 'markeVeroeffentlichen', args: [lo.id] } });
  const vorL = await h.attrappe(), hatteMarke = vorL.ablage.marke.some((p) => p.startsWith('instanz/' + lo.id + '/')), hatteBlatt = vorL.ablage.blatt.some((p) => p.startsWith('instanz/' + lo.id + '/'));
  const res = (await T.test({ verwalten: { fn: 'instanzDatenLoeschen', args: [lo.id] } })).verwalten, nachL = await h.attrappe();
  const rest = ['marke', 'blatt', 'fotos'].flatMap((b) => nachL.ablage[b].filter((p) => p.startsWith('instanz/' + lo.id) || p.startsWith('link/' + loA.code) || p.startsWith('link/' + loV)));
  ok(hatteMarke && hatteBlatt && res.ok && res.anmeldungen.includes(uid) && !rest.length && !nachL.instanzen.some((i) => i.id === lo.id) && !nachL.hosts.some((x) => x.host === lo.host) && !nachL.anfragen.some((a) => a.code === loA.code) && !nachL.entwuerfe.some((e) => e.code === loV || e.code === loA.code) && !nachL.betriebe.some((b) => b.id === lo.betrieb) && (await h.api(lo.host, '/')).status === 404, '24.12 instanzDatenLoeschen: kein Pfad instanz/<id>, kein link/<code> der Instanz, Anfragen, Zwischenstände, Hosts, Instanz, Betriebszeile und Zugangs-Anmeldungen gelöscht' + (rest.length ? ' (übrig: ' + rest.join(', ') + ')' : ''));

  /* ---------- 24.13 PDF scheitert: Mail mit Text und Link, Blatt nachgereicht ---------- */
  await T.test({ stoerung: { pdf: 'fehler' } });
  const f1 = await mitFoto(I.essential.host, 100, { p: Object.assign(T.kontakt(100), { name: 'Familie Ohneblatt' }) });
  const f1m = (await T.warteMail((m) => (m.betreff || '').includes('Familie Ohneblatt'), 10000, { anhaenge: true }))[0];
  const f1z = await T.zeile(f1.code);
  await T.test({ stoerung: { pdf: '' } });
  await h.uhr(0.06); await h.geplant('*/10 * * * *'); await h.uhr(null);
  const f1n = (await h.post({ anhaenge: true })).filter((m) => (m.betreff || '').includes('Familie Ohneblatt')), f1z2 = await T.zeile(f1.code);
  ok(f1m && !(f1m.anhaenge || []).some((a) => a.typ === 'application/pdf') && /folgt in einer eigenen E-Mail/.test(f1m.html) && /Das Aufmaß als Text/.test(f1m.html) && /\/api\/instanz\/fotos\//.test(f1m.html) && f1z.versand.status === 'offen' && f1z.versand.pdf === 'nachholen' && !!f1z.versand.vorab, '24.13 PDF-Fehler: Mail geht trotzdem raus (Aufmaß als Text, Link), Versand bleibt offen für das Blatt');
  ok(f1n.length === 2 && /^Aufmaßblatt zur Anfrage: Familie Ohneblatt/.test(f1n[1].betreff) && (f1n[1].anhaenge || []).some((a) => a.typ === 'application/pdf') && f1z2.versand.status === 'gesendet' && f1z2.versand.pdf === 'ok', '24.13 Das Blatt kommt mit dem nächsten Lauf in einer zweiten Mail nach');
  await T.test({ stoerung: { pdf: 'abbruch' } });
  const f2 = await mitFoto(I.plus.host, 102, { p: Object.assign(T.kontakt(102), { name: 'Familie Abbruch' }) });
  const f2z = await T.warteZeile(f2.code, (z) => z.versand.pdf === 'baut');
  await T.test({ stoerung: { pdf: '' } });
  const f2vor = (await h.post()).filter((m) => (m.betreff || '').includes('Familie Abbruch')).length;
  await h.uhr(0.002); await h.geplant('*/10 * * * *');
  const f2m = (await h.post({ anhaenge: true })).filter((m) => (m.betreff || '').includes('Familie Abbruch')), f2z2 = await T.zeile(f2.code);
  await h.uhr(0.07); await h.geplant('*/10 * * * *'); await h.uhr(null);
  const f2n = (await h.post({ anhaenge: true })).filter((m) => (m.betreff || '').includes('Familie Abbruch')), f2z3 = await T.zeile(f2.code);
  ok(f2z && f2z.versand.pdf === 'baut' && f2vor === 0 && f2m.length === 1 && !(f2m[0].anhaenge || []).some((a) => a.typ === 'application/pdf') && f2z2.versand.status === 'offen' && f2n.length === 2 && (f2n[1].anhaenge || []).some((a) => a.typ === 'application/pdf') && f2z3.versand.status === 'gesendet', '24.13 Abbruch beim Bauen (wie die CPU-Grenze des Gratis-Tarifs): der nächste Lauf schickt sofort Text und Link, das Blatt kommt danach');
  await T.test({ stoerung: { pdf: 'fehler' } });
  const f3 = await mitFoto(I.essential.host, 104, { p: Object.assign(T.kontakt(104), { name: 'Familie Aufgegeben' }) });
  await T.warteZeile(f3.code, (z) => z.versand.pdf === 'nachholen');
  await h.uhr(0.06); await h.geplant('*/10 * * * *'); await h.uhr(null);
  await T.test({ stoerung: { pdf: '' } });
  const f3z = await T.zeile(f3.code), f3m = (await h.post()).filter((m) => (m.betreff || '').includes('Familie Aufgegeben'));
  ok(f3z.versand.status === 'gesendet' && f3z.versand.pdf === 'fehlt' && f3m.length === 1, '24.13 Klappt das Blatt auch beim zweiten Mal nicht: gesendet (als Text), Hinweis, keine weitere Mail');
  const sOhne = await h.server({ PDF_IM_WORKER: '0' }), To = werkzeug(h, sOhne);
  const f4 = await To.anfrage('essential.localhost', 106, { p: Object.assign(T.kontakt(106), { name: 'Familie Gratis' }) });
  const f4m = (await To.warteMail((m) => (m.betreff || '').includes('Familie Gratis'), 10000, { anhaenge: true }))[0], f4z = await To.warteZeile(f4.code, (z) => z.versand.status !== 'offen');
  ok(f4m && !(f4m.anhaenge || []).some((a) => a.typ === 'application/pdf') && /Alle Angaben stehen unten als Text/.test(f4m.html) && f4z.versand.status === 'gesendet' && f4z.versand.pdf === 'aus', '24.13 PDF_IM_WORKER=0 (Gratis-Tarif): Mail sofort mit Text und Link, ohne Versuch im Worker');
  fs.rmSync(ordner, { recursive: true, force: true });
  await warte(10);
};

/* eeziframes · API der Instanz-Hosts: Start eines virtuellen Links, Ping für die Domain-Prüfung, Bestätigung von Empfängern,
   Seite mit Anfrage und Originalfotos für Essential/Plus (Strang A, Bauplan §3 A.4, A.9; Vertrag docs/INSTANZEN.md)
     POST /api/instanz/start → { ok, code, betrieb, du, auftritt }   nur auf dem Host einer Instanz; Bremse RL_START je Anschluss, harte
                                                                    Grenze startsTagInstanzHart je Instanz und Tag; legt nur einen
                                                                    Zwischenstand mit meta.instanz an (keine Zeile in anfragen, E6)
     GET  /api/instanz/ping  → { ok, instanz: id8, version }         Prüfung der Domain (Zentrale), in jedem Status
     GET  /api/instanz/bestaetigen?t=                                Bestätigung einer Eingangs- oder Zugangsadresse (Token Zweck empfaenger,
                                                                    14 Tage), auf der Hauptdomain und auf dem Host der Instanz; Antwort: Seite
     GET  /api/instanz/fotos/:code?t=   GET …/fotos/:code/:id?t=     Anfrage und Originalfotos für den Betrieb (Token Zweck fotos,
                                                                    fotoLinkTage, nur auf dem Haupthost der Instanz, Abruf im Protokoll;
                                                                    Signature hat das Dashboard: 404)
     POST /api/instanz/test                                          nur lokal mit DATEN_ATTRAPPE und MAIL_ATTRAPPE: Prüfhilfen (Störungen
                                                                    nachstellen, Versand einer Anfrage ändern, Läufe und verwalten.js aufrufen) */
import '../../web/assets/modell.js';
import '../../web/assets/instanzregeln.js';
import { ApiFehler, quelle, json } from './umgebung.js';
import { bremse, budget } from './bremse.js';
import { tokenPruefen } from './sitzung.js';
import { ablage, linkOrdner, fotoIds, FOTO_ID } from './fotos.js';
import { SICHERHEIT, SPERRE } from '../seo.js';
import { instanzZaehlen, tagBerlin } from './statistik.js';
import { pruefStoerung } from '../instanz/mandant.js';
import * as verwalten from '../instanz/verwalten.js';
import { pruefPdf, eingangVerarbeiten, versandNachholen, anfragenAufraeumen, eingangErneut, probeEingang, instanzKontext } from './eingang.js';
import { pseudoKonto, zeitenBerlin } from '../instanz/adapter.js';

const X = () => globalThis.Abrechnung;
const AW = () => globalThis.AW;
const R = () => globalThis.Instanzregeln;
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function seite(titel, inhalt, status) {
  const h = new Headers({ 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'X-Robots-Tag': SPERRE, 'Referrer-Policy': 'no-referrer' });
  for (const [k, v] of Object.entries(SICHERHEIT)) if (k !== 'Referrer-Policy') h.set(k, v);
  const html = '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>' + esc(titel) + '</title>\n<meta name="robots" content="noindex">\n<link rel="stylesheet" href="/fonts/fonts.css">\n' +
    '<style>:root{color-scheme:dark}body{margin:0;background:#161616;color:#f3f2ee;font:500 17px/1.6 Inter,system-ui,sans-serif}main{max-width:880px;margin:0 auto;padding:32px 16px 64px}h1{font-size:28px;line-height:1.2;font-weight:800;margin:4px 0 16px}' +
    'p{margin:0 0 12px;color:#c9c8c3}.klein{font-size:13px;color:#93928d}a{color:#f3f2ee}pre{white-space:pre-wrap;word-break:break-word;background:#1f1f1f;border:2px solid #2b2b2b;border-radius:16px;padding:16px;font:13px/1.5 Menlo,Consolas,monospace;color:#e9e8e3}' +
    '.fotos{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin:16px 0 24px}.fotos figure{margin:0}.fotos img{width:100%;height:auto;border-radius:12px;display:block;background:#1f1f1f}.fotos figcaption{font-size:13px;color:#93928d;margin-top:4px}</style>\n</head>\n<body>\n<main>\n' + inhalt + '\n</main>\n</body>\n</html>\n';
  return new Response(html, { status: status || 200, headers: h });
}

/* Fotoseite: Token prüfen, Anfrage dieser Instanz laden */
async function fotoZugang(ctx) {
  const inst = ctx.instanz;
  if (!inst || !(Number(inst.m.fotoLinkTage) > 0)) throw new ApiFehler('not_found', 404);
  const code = String(ctx.params.code || '').toLowerCase(), d = await tokenPruefen(ctx.k, 'fotos', String(ctx.url.searchParams.get('t') || ''));
  if (!d || d.c !== code || d.i !== inst.id) return { fehler: 403 };
  const z = await ctx.sp.anfrageHolen(code);
  if (!z || z.instanz !== inst.id) throw new ApiFehler('not_found', 404);
  return { inst: inst, z: z, code: code };
}

export const INSTANZ_API = {
  'POST /api/instanz/start': async (ctx) => {
    const inst = ctx.instanz; if (!inst) throw new ApiFehler('not_found', 404);
    if (!R().darf(inst.status, 'schreiben', { vorschau: inst.vorschau })) throw new ApiFehler('Der Fensterplaner nimmt gerade keine Planungen an.', inst.status === 'beendet' ? 410 : 503);
    if (!(await bremse(ctx, 'START', quelle(ctx.request)))) throw new ApiFehler('Zu viele neue Planungen. Bitte gleich noch einmal.', 429);
    const b = await budget(ctx, 'inst:' + inst.id8 + ':start', R().GRENZEN.startsTagInstanzHart);
    if (!b.ok) throw new ApiFehler('Heute sind ungewöhnlich viele Planungen begonnen worden. Bitte morgen noch einmal oder direkt bei ' + inst.name + ' melden.', 429);
    let code = '', e = null;
    for (let i = 0; i < 5 && !e; i++) {
      code = X().newCode();
      if (await ctx.sp.anfrageHolen(code)) continue;
      e = await ctx.sp.entwurfAnlegen(code, inst.betrieb, { instanz: { id: inst.id, host: inst.haupthost, start: new Date().toISOString(), test: !!(inst.vorschau && inst.status === 'einrichtung') } });
      if (e === undefined) throw new ApiFehler('Der Zwischenspeicher ist noch nicht eingerichtet.', 503);
    }
    if (!e) throw new ApiFehler('Bitte gleich noch einmal.', 503);
    instanzZaehlen(ctx, inst, 'start');
    return { ok: true, code: code, betrieb: inst.name, du: !!inst.du, auftritt: inst.auftritt };
  },
  'GET /api/instanz/ping': async (ctx) => {
    const inst = ctx.instanz; if (!inst) throw new ApiFehler('not_found', 404);
    return json({ ok: true, instanz: inst.id8, version: inst.version }, 200, { 'cache-control': 'no-store' });
  },
  'GET /api/instanz/bestaetigen': async (ctx) => {
    const d = await tokenPruefen(ctx.k, 'empfaenger', String(ctx.url.searchParams.get('t') || ''));
    if (!d || !d.i || !d.m) return seite('Link abgelaufen', '<h1>Dieser Link gilt nicht mehr.</h1><p>Bestätigungslinks gelten 14 Tage. Bitte lassen Sie sich einen neuen schicken.</p>', 403);
    if (ctx.instanz && ctx.instanz.id !== d.i) return seite('Link ungültig', '<h1>Dieser Link gehört zu einer anderen Adresse.</h1>', 403);
    const r = await verwalten.empfaengerBestaetigen(ctx, d.i, d.m, d.a);
    if (!r.ok) return seite('Nicht eingetragen', '<h1>Diese Adresse ist nicht mehr eingetragen.</h1><p>' + esc(d.m) + ' steht nicht mehr in der Liste. Bitte wenden Sie sich an Ihren Ansprechpartner.</p>', 404);
    return seite('Adresse bestätigt', '<p class="klein">' + esc(r.name) + '</p><h1>Danke, Ihre Adresse ist bestätigt.</h1><p>' + esc(d.m) + (d.a === 'zugang' ? ' kann sich jetzt mit einem Code per E-Mail im Dashboard anmelden.' : ' bekommt ab jetzt die Anfragen aus dem Fensterplaner.') + '</p>');
  },
  'GET /api/instanz/fotos/:code': async (ctx) => {
    const zg = await fotoZugang(ctx);
    if (zg.fehler) return seite('Link abgelaufen', '<h1>Dieser Link gilt nicht mehr.</h1><p>Die Fotos einer Anfrage sind nur eine Zeit lang über den Link aus der E-Mail abrufbar.</p>', 403);
    const { inst, z, code } = zg, l = z.daten || {}, am = l.aufmass || {}, t = String(ctx.url.searchParams.get('t') || '');
    const liste = [];
    (am.windows || []).forEach((w, i) => { const b = (w && w.bilder) || {}; ['in', 'out'].forEach((s) => { if (FOTO_ID.test(String(b[s] || ''))) liste.push({ id: b[s], text: 'Pos. ' + (i + 1) + ' · ' + (w.name || 'Fenster') + ' · ' + (s === 'in' ? 'von innen' : 'von außen') }); }); });
    const da = new Set(Array.isArray(am.fotosDa) ? am.fotosDa : liste.map((x) => x.id));
    const fotos = l.fotosGeloescht ? '<p>Die Fotos dieser Anfrage sind gelöscht.</p>' : liste.filter((x) => da.has(x.id)).map((x) => '<figure><a href="/api/instanz/fotos/' + esc(code) + '/' + esc(x.id) + '?t=' + encodeURIComponent(t) + '"><img src="/api/instanz/fotos/' + esc(code) + '/' + esc(x.id) + '?t=' + encodeURIComponent(t) + '" alt="' + esc(x.text) + '" loading="lazy"></a><figcaption>' + esc(x.text) + '</figcaption></figure>').join('');
    ctx.waitUntil(ctx.sp.protokollSchreiben ? ctx.sp.protokollSchreiben({ art: 'instanz_fotos', betrieb: inst.betrieb, text: 'Seite der Anfrage ' + (l.nr || code) + ' mit Fotos abgerufen', daten: { code: code } }).catch(() => false) : Promise.resolve());
    const text = AW().aufmassText(l, { fuss: inst.m.kennzeichnung === 'keine' ? '' : undefined });
    return seite('Anfrage ' + (l.nr || '') + ' · ' + inst.name, '<p class="klein">' + esc(inst.name) + '</p><h1>Anfrage ' + esc(l.nr || '') + ': ' + esc(l.kunde || '') + '</h1>' +
      '<p>' + esc(X().nW((am.windows || []).length, 'Position', 'Positionen')) + (liste.length ? ', ' + esc(X().nW(liste.length, 'Foto', 'Fotos')) : '') + '. Die Originalfotos lassen sich antippen und speichern.</p>' +
      (fotos ? '<div class="fotos">' + fotos + '</div>' : '') + '<pre>' + esc(text) + '</pre>');
  },
  'GET /api/instanz/fotos/:code/:id': async (ctx) => {
    const zg = await fotoZugang(ctx);
    if (zg.fehler) throw new ApiFehler('Dieser Link gilt nicht mehr.', 403);
    const id = String(ctx.params.id || ''), am = (zg.z.daten || {}).aufmass || {};
    if (!FOTO_ID.test(id) || !fotoIds(am.windows).has(id)) throw new ApiFehler('Dieses Foto gibt es nicht.', 404);
    const ab = ablage(ctx.k); if (!ab) throw new ApiFehler('Fotos lassen sich gerade nicht laden.', 503);
    const u = await ab.holen(linkOrdner(zg.code) + '/' + id + '.jpg'); if (!u) throw new ApiFehler('Dieses Foto ist nicht angekommen.', 404);
    return new Response(u, { status: 200, headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; sandbox", 'content-disposition': 'inline; filename="' + id + '.jpg"' } });
  },
  /* Prüfhilfen: nur lokal (Daten- und Mail-Attrappe), nie im Netz */
  'POST /api/instanz/test': async (ctx) => {
    if (!ctx.k.datenAttrappe || !ctx.k.post || !ctx.k.post.attrappe) throw new ApiFehler('not_found', 404);
    const b = ctx.body || {}, out = { ok: true };
    if (b.stoerung) { if ('daten' in b.stoerung) pruefStoerung.an = !!b.stoerung.daten; if ('anfragen' in b.stoerung) pruefStoerung.anfragen = !!b.stoerung.anfragen; if ('pdf' in b.stoerung) pruefPdf.art = String(b.stoerung.pdf || ''); out.stoerung = { daten: pruefStoerung.an, anfragen: pruefStoerung.anfragen, pdf: pruefPdf.art }; }
    if (b.anfrage && b.anfrage.code) {
      await ctx.sp.anfrageAendern(String(b.anfrage.code), (z) => { if (b.anfrage.versand) z.versand = Object.assign({}, z.versand || {}, b.anfrage.versand); if ('loeschen_ab' in b.anfrage) z.loeschen_ab = b.anfrage.loeschen_ab; if ('eingegangen_at' in b.anfrage) z.eingegangen_at = b.anfrage.eingegangen_at; });
      out.anfrage = await ctx.sp.anfrageHolen(String(b.anfrage.code));
    }
    if (b.entwurf && b.entwurf.code) {
      await ctx.sp.entwurfAendern(String(b.entwurf.code), b.entwurf.betrieb || '', (e) => { if (b.entwurf.daten) e.daten = b.entwurf.daten; if (b.entwurf.meta) e.meta = Object.assign({}, e.meta || {}, b.entwurf.meta); return true; });
      out.entwurf = await ctx.sp.entwurfHolen(String(b.entwurf.code));
    }
    /* Einladung wie im Signature-Dashboard (Strang E) anlegen bzw. eine Nachbesserung anfragen, damit sich der Eingang prüfen lässt */
    if (b.einladung && b.einladung.instanz) {
      const inst = await instanzKontext(ctx.sp, String(b.einladung.instanz)); if (!inst) throw new ApiFehler('not_found', 404);
      const jetzt = ctx.k.jetzt || Date.now(), row = await ctx.sp.betriebHolen(inst.betrieb), a = pseudoKonto((row && row.daten) || {}, null), r = X().neuesProjekt(a, { kunde: b.einladung.kunde || 'Familie Einladung', days: 30, du: !!b.einladung.du, kontakt: b.einladung.kontakt || '' }, jetzt);
      if (!r.ok) throw new ApiFehler(r.msg, 400);
      const l = Object.assign(zeitenBerlin(r.l, jetzt), { nr: await ctx.sp.instanzNr(inst.id), instanz: true, status: 'gesendet' });
      await ctx.sp.anfrageAnlegen({ code: l.code, instanz: inst.id, betrieb: inst.betrieb, lid: l.id, art: 'einladung', status: l.status, nr: l.nr, daten: l, versand: {} });
      out.einladung = l;
    }
    if (b.nachbesserung && b.nachbesserung.code) {
      let msg = '';
      const jetzt = ctx.k.jetzt || Date.now();
      await ctx.sp.anfrageAendern(String(b.nachbesserung.code), (x) => { const a = pseudoKonto({}, x.daten), vorher = a.links[0].expires; const r = X().nbAnfragen(a.links[0], b.nachbesserung.hinweis || '', jetzt); msg = r.msg; if (!r.ok) return false; x.daten = zeitenBerlin(a.links[0], jetzt, { expiresVorher: vorher }); });
      out.nachbesserung = msg;
    }
    if (b.statistik) { const tag = tagBerlin(new Date(ctx.k.jetzt || Date.now())); out.statistik = ((await ctx.sp.statistikLesen(tag, tag)) || []).filter((r) => /^(inst|budget):/.test(r.schluessel)); }
    if (b.lauf === 'versand') out.lauf = await versandNachholen(ctx.k, ctx.sp);
    if (b.lauf === 'aufbewahrung') out.lauf = await anfragenAufraeumen(ctx.k, ctx.sp);
    if (b.lauf === 'eingang' && b.code) out.lauf = await eingangVerarbeiten(ctx.k, ctx.sp, String(b.code), Number(b.runde) || 0);
    if (b.lauf === 'erneut' && b.code) out.lauf = await eingangErneut(ctx, String(b.code));
    if (b.lauf === 'probe' && b.instanz) out.lauf = await probeEingang(ctx, String(b.instanz));
    if (b.verwalten && typeof b.verwalten === 'object') {
      const ERLAUBT = ['instanzAnlegen', 'instanzAendern', 'instanzStatus', 'hostSetzen', 'hostEntfernen', 'hauptSetzen', 'markeVeroeffentlichen', 'bildAblegen', 'empfaengerEinladen', 'vorschauToken', 'cacheLeeren', 'instanzDatenLoeschen', 'paketSetzen', 'profilSetzen'];
      const fn = String(b.verwalten.fn || ''); if (ERLAUBT.indexOf(fn) < 0) throw new ApiFehler('Unbekannt.', 400);
      const args = Array.isArray(b.verwalten.args) ? b.verwalten.args.slice() : [];
      if (fn === 'instanzAendern') { const patch = args[1] || {}; args[1] = (z) => { Object.assign(z, patch); }; }
      if (fn === 'bildAblegen' && typeof args[2] === 'string') { const bin = atob(args[2]); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); args[2] = u; }
      out.verwalten = await verwalten[fn].apply(null, [ctx].concat(args));
    }
    return out;
  }
};

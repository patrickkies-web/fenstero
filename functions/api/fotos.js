/* eeziframes · Fotos der Fenster: für den Fensterbauer und fürs eigene Aufmaß
   Der Kunde fotografiert jedes Fenster von innen und von außen. Die App verkleinert die Fotos (etwa 1,15 Megapixel, JPEG), legt sie
   auf dem Gerät ab (IndexedDB) und lädt sie mit dem gespeicherten Fenster hierher, sobald klar ist, wohin sie gehören:
   - Kundenlink: zum Link (link/<code>/<id>.jpg). Der Betrieb sieht sie mit dem eingegangenen Aufmaß, im Betriebsbereich und im
     Aufmaßblatt; vorher niemand, und bei einem gesperrten Aufmaß (noch keine Zahlungsart) auch er nicht.
   - eigenes Aufmaß mit Konto: ins Konto (konto/<nutzer>/<kennung>/<id>.jpg). So stehen sie auf jedem Gerät im Aufmaßblatt.
   Abgelegt wird bei Supabase Storage (Bucket „fotos“, privat, Region des Projekts), nur vom Server aus mit dem geheimen Schlüssel.
   Den Bucket legt der Server beim ersten Foto selbst an. Ohne Supabase gibt es keine Ablage (Attrappe zum Prüfen: DATEN_ATTRAPPE=1).
   Das Fenster nennt seine Fotos nur mit Kennung (w.bilder = { in, out }); die Bilder selbst stehen nie im Aufmaß, im Code oder in der
   Datenbank.
   Gelöscht wird (fotosLinkAufraeumen, fotosLinkLoeschen, fotosEigeneEntfernen, fotosEigenesLoeschen, fotosNutzerLoeschen):
   - beim Senden an den Betrieb die Fotos des Links, die kein Fenster des eingegangenen Aufmaßes mehr nennt (neu fotografiert,
     Fenster gelöscht)
   - mit dem Inhalt des Zwischenstands eines nicht gesendeten Links (Aufräumen, zentrale.js), mit dem Projekt und mit dem Konto des
     Betriebs
   - beim Betrieb 12 Monate nach dem Eingang des Aufmaßes (FOTO_TAGE; das Aufmaß selbst bleibt)
   - beim eigenen Aufmaß: einzelne Fotos, sobald sie nach einem Abgleich kein Fenster mehr nennt; alle mit dem Aufmaß, mit dem Konto
     und beim Aufräumen nach 12 Monaten ohne Änderung bzw. 3 Jahren
   Endpunkte (Foto als Base64 im JSON, wie bei /api/ki):
     POST /api/link/:code/foto/:id                  { bild }   Kunde, solange der Link offen ist
     GET  /api/konto/foto/:code/:id                            Betrieb: nur Fotos seines eingegangenen, nicht gesperrten Aufmaßes
     POST /api/kunde/aufmass/:kennung/foto/:id      { bild }   Hauseigentümer, angemeldet
     GET  /api/kunde/aufmass/:kennung/foto/:id                 Hauseigentümer, nur eigene */
import '../../web/assets/modell.js';
import { ApiFehler, erlaubt, quelle, linkBremse, linkUnbekannt, sbNeu } from './umgebung.js';
import { nutzer } from './auth.js';
import { langerCode } from './entwurf.js';
import '../../web/assets/instanzregeln.js';
import { linkAufloesen } from '../instanz/adapter.js';
import { bremse, budget } from './bremse.js';
import { instanzZaehlen } from './statistik.js';

const X = () => globalThis.Abrechnung;
/* Ablagen (private Buckets bei Supabase Storage, der Server legt sie beim ersten Gebrauch an). fotos: Fotos der Fenster (dazu die kleine
   Fassung <id>k, 640 px, für das Aufmaßblatt der Instanzen); marke: veröffentlichte Bilder einer Instanz (instanz/<id>/<v>/<name>);
   bestellungen: Uploads aus dem Bestellformular (partner/<partner>/<bestellung>/<datei>); blatt: abgelegte Aufmaßblätter (Signature,
   instanz/<id>/<code>-<runde>.pdf). Siehe docs/INSTANZEN.md */
export const ABLAGEN = {
  fotos: { bucket: 'fotos', typen: ['image/jpeg'], max: 1000000 },
  marke: { bucket: 'marke', typen: ['image/png', 'image/jpeg', 'image/webp'], max: 2000000 },
  bestellungen: { bucket: 'bestellungen', typen: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'], max: 1000000 },
  blatt: { bucket: 'blatt', typen: ['application/pdf'], max: 10000000 }
};
export const FOTO_MAX = 1000000;            // Bytes je Foto; die App schickt meist 0,2 bis 0,6 MB
export const FOTOS_JE_ABLAGE = 160;         // je Link bzw. je eigenem Aufmaß: 50 Fenster mit je zwei Fotos und neu fotografierte
export const FOTO_TAGE = 365;               // Fotos eines eingegangenen Aufmaßes beim Betrieb: 12 Monate nach dem Eingang
export const FOTO_ID = /^b[a-z0-9]{12,24}k?$/; // …k: kleine Fassung desselben Fotos (Instanzen)
const TAG = 864e5;
const ZU_GROSS = 'Dieses Foto lässt sich nicht übertragen.';
const attrappeDaten = new Map(), attrappeArten = { fotos: attrappeDaten };

/* Kennungen der Fotos, die die Fenster nennen */
export const fotoIds = (wins) => { const s = new Set(); (wins || []).forEach((w) => { const b = w && w.bilder; if (b && typeof b === 'object') ['in', 'out'].forEach((k) => { if (FOTO_ID.test(String(b[k] || ''))) s.add(b[k]); }); }); return s; };

/* ---------- Ablage: Supabase Storage oder Attrappe; art: fotos (Vorgabe) | marke | bestellungen | blatt ---------- */
export function ablage(k, art) {
  const a = ABLAGEN[art || 'fotos']; if (!a) throw new Error('Unbekannte Ablage ' + art);
  if (k.supabase) return supabaseAblage(k, a);
  if (k.datenAttrappe) return attrappeAblage(art || 'fotos', a);
  return null;
}
/* typ: Medientyp der Datei (Vorgabe: der erste erlaubte, bei Fotos image/jpeg); nicht erlaubte Typen und zu große Dateien legt die
   Ablage nicht ab (false) */
const passt = (a, bytes, typ) => { const n = bytes ? (bytes.byteLength != null ? bytes.byteLength : bytes.length) : 0; return a.typen.includes(typ) && n > 0 && n <= a.max; };
function attrappeAblage(art, a) {
  const daten = attrappeArten[art] || (attrappeArten[art] = new Map());
  const unter = (ordner) => String(ordner).replace(/\/?$/, '/');
  return {
    art: 'attrappe',
    async ablegen(pfad, bytes, typ) { if (!passt(a, bytes, typ || a.typen[0])) return false; daten.set(pfad, bytes); return true; },
    async holen(pfad) { return daten.get(pfad) || null; },
    async liste(ordner) { const p = unter(ordner); return Array.from(daten.keys()).filter((x) => x.startsWith(p) && !x.slice(p.length).includes('/')).map((x) => x.slice(p.length)); },
    async loeschen(pfade) { pfade.forEach((p) => daten.delete(p)); return true; },
    async ordnerLoeschen(ordner) { const p = unter(ordner); for (const x of Array.from(daten.keys())) if (x.startsWith(p)) daten.delete(x); return true; },
    /* nur für die Prüfung */
    alle: () => Array.from(daten.keys())
  };
}
function supabaseAblage(k, ab) {
  const BUCKET = ab.bucket;
  const basis = k.supabase.url + '/storage/v1/';
  const kopf = (extra) => { const h = Object.assign({ apikey: k.supabase.service }, extra || {}); if (!sbNeu(k.supabase.service)) h.Authorization = 'Bearer ' + k.supabase.service; return h; };
  const url = (p) => String(p).split('/').map(encodeURIComponent).join('/');
  let bucketDa = false;
  async function bucketAnlegen() {
    const r = await fetch(basis + 'bucket', { method: 'POST', headers: kopf({ 'content-type': 'application/json' }), body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false, file_size_limit: ab.max, allowed_mime_types: ab.typen }) });
    const t = await r.text().catch(() => '');
    if (r.ok || r.status === 409 || /already exists|duplicate/i.test(t)) { bucketDa = true; return true; }
    console.log('Fotoablage: Bucket nicht angelegt', r.status, t.slice(0, 160)); return false;
  }
  /* ein Ordner, eine Ebene: Dateien (mit id) und Unterordner (ohne id) */
  async function eintraege(ordner) {
    const out = [];
    for (let von = 0; von < 5000; von += 1000) {
      const r = await fetch(basis + 'object/list/' + BUCKET, { method: 'POST', headers: kopf({ 'content-type': 'application/json' }), body: JSON.stringify({ prefix: String(ordner).replace(/\/$/, ''), limit: 1000, offset: von, sortBy: { column: 'name', order: 'asc' } }) });
      if (!r.ok) { const t = await r.text().catch(() => ''); if (r.status === 404 || /not.?found/i.test(t)) return out; console.log('Fotoablage: Liste fehlgeschlagen', r.status, t.slice(0, 160)); throw new ApiFehler('Fotoablage antwortet nicht.', 502); }
      const teil = (await r.json().catch(() => [])) || [];
      out.push.apply(out, teil);
      if (teil.length < 1000) break;
    }
    return out;
  }
  const a = {
    art: 'supabase',
    async ablegen(pfad, bytes, typ) {
      typ = typ || ab.typen[0];
      if (!passt(ab, bytes, typ)) return false;
      for (let i = 0; i < 2; i++) {
        const r = await fetch(basis + 'object/' + BUCKET + '/' + url(pfad), { method: 'POST', headers: kopf({ 'content-type': typ, 'x-upsert': 'true', 'cache-control': 'max-age=31536000' }), body: bytes });
        if (r.ok) return true;
        const t = await r.text().catch(() => '');
        if (i === 0 && !bucketDa && /bucket/i.test(t) && /not.?found/i.test(t)) { if (await bucketAnlegen()) continue; }
        console.log('Fotoablage: Ablegen fehlgeschlagen', r.status, t.slice(0, 160));
        return false;
      }
      return false;
    },
    async holen(pfad) {
      const r = await fetch(basis + 'object/authenticated/' + BUCKET + '/' + url(pfad), { headers: kopf() });
      if (r.ok) return new Uint8Array(await r.arrayBuffer());
      const t = await r.text().catch(() => '');
      if (r.status === 404 || r.status === 400 || /not.?found/i.test(t)) return null; // Storage meldet „nicht da“ teils mit 400
      console.log('Fotoablage: Lesen fehlgeschlagen', r.status, t.slice(0, 160));
      throw new ApiFehler('Fotoablage antwortet nicht.', 502);
    },
    async liste(ordner) { return (await eintraege(ordner)).filter((e) => e && e.id).map((e) => e.name); },
    async loeschen(pfade) {
      for (let i = 0; i < pfade.length; i += 100) {
        const r = await fetch(basis + 'object/' + BUCKET, { method: 'DELETE', headers: kopf({ 'content-type': 'application/json' }), body: JSON.stringify({ prefixes: pfade.slice(i, i + 100) }) });
        if (!r.ok) { const t = await r.text().catch(() => ''); if (r.status === 404 || /not.?found/i.test(t)) continue; console.log('Fotoablage: Löschen fehlgeschlagen', r.status, t.slice(0, 160)); return false; }
        await r.text().catch(() => '');
      }
      return true;
    },
    /* Ordner samt Unterordnern (eigenes Aufmaß: konto/<nutzer>/<kennung>/…), höchstens zwei Ebenen tief */
    async ordnerLoeschen(ordner) {
      const o = String(ordner).replace(/\/$/, ''), pfade = [];
      for (const e of await eintraege(o)) {
        if (e.id) pfade.push(o + '/' + e.name);
        else for (const f of await eintraege(o + '/' + e.name)) if (f.id) pfade.push(o + '/' + e.name + '/' + f.name);
      }
      return pfade.length ? a.loeschen(pfade) : true;
    }
  };
  return a;
}

/* ---------- Pfade ---------- */
export const linkOrdner = (code) => 'link/' + code;
export const eigenerOrdner = (uid, kennung) => 'konto/' + uid + '/' + kennung;
const nutzerOrdner = (uid) => 'konto/' + uid;
const datei = (ordner, id) => ordner + '/' + id + '.jpg';

/* ---------- Löschen (Aufrufer: konten.js, eigene.js, zentrale.js); Fehler bleiben folgenlos, das Aufräumen versucht es wieder ---------- */
export async function fotosLinkLoeschen(k, code) { const ab = ablage(k); if (!ab || !code) return false; try { return await ab.ordnerLoeschen(linkOrdner(code)); } catch (e) { return false; } }
export async function fotosEigenesLoeschen(k, uid, kennung) { const ab = ablage(k); if (!ab || !uid || !kennung) return false; try { return await ab.ordnerLoeschen(eigenerOrdner(uid, kennung)); } catch (e) { return false; } }
export async function fotosNutzerLoeschen(k, uid) { const ab = ablage(k); if (!ab || !uid) return false; try { return await ab.ordnerLoeschen(nutzerOrdner(uid)); } catch (e) { return false; } }
/* Eigenes Aufmaß: einzelne Fotos, die nach dem Abgleich kein Fenster mehr nennt (neu fotografiert, Fenster gelöscht; eigene.js) */
export async function fotosEigeneEntfernen(k, uid, kennung, ids) { const ab = ablage(k); if (!ab || !uid || !kennung || !ids.length) return false; try { return await ab.loeschen(ids.filter((id) => FOTO_ID.test(id)).map((id) => datei(eigenerOrdner(uid, kennung), id))); } catch (e) { return false; } }
/* Nach dem Senden: was kein gesendetes Fenster nennt, ist überholt (neu fotografiert, Fenster gelöscht) */
export async function fotosLinkAufraeumen(k, code, behalten) {
  const ab = ablage(k); if (!ab || !code) return 0;
  try {
    const o = linkOrdner(code), weg = (await ab.liste(o)).filter((n) => !behalten.has(n.replace(/\.jpg$/, ''))).map((n) => o + '/' + n);
    if (weg.length) await ab.loeschen(weg);
    return weg.length;
  } catch (e) { return 0; }
}

/* ---------- Hilfen für die Endpunkte ---------- */
function bytesAus(ctx) {
  const b = String((ctx.body || {}).bild || '');
  if (b.length < 200 || b.length > Math.ceil(FOTO_MAX * 4 / 3) + 8 || !/^[A-Za-z0-9+/]+={0,2}$/.test(b)) throw new ApiFehler(ZU_GROSS, 400);
  const bin = atob(b), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  if (u.length > FOTO_MAX || u[0] !== 0xff || u[1] !== 0xd8 || u[2] !== 0xff) throw new ApiFehler(ZU_GROSS, 400); // nur JPEG
  return u;
}
function idVon(ctx) { const id = String(ctx.params.id || ''); if (!FOTO_ID.test(id)) throw new ApiFehler('Unbekanntes Foto.', 400); return id; }
function ablageVon(ctx) { const ab = ablage(ctx.k); if (!ab) throw new ApiFehler('Fotos lassen sich hier gerade nicht ablegen.', 503); return ab; }
/* höchstens FOTOS_JE_ABLAGE je Ordner; ein schon vorhandenes Foto darf ersetzt werden */
async function platzPruefen(ab, ordner, id) {
  const namen = await ab.liste(ordner);
  if (namen.length >= FOTOS_JE_ABLAGE && !namen.includes(id + '.jpg')) throw new ApiFehler('Zu diesem Aufmaß gibt es schon sehr viele Fotos. Bitte melde dich bei uns.', 409, { voll: true });
}
const bild = (u) => new Response(u, { status: 200, headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=86400', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; sandbox" } });
async function angemeldet(ctx, text) {
  const token = (ctx.request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const n = await nutzer(ctx.k, token); if (!n) throw new ApiFehler(text, 401, { anmelden: true });
  return n;
}
const linkCode = (ctx) => { const c = String(ctx.params.code || '').trim().toLowerCase(); if (!/^[a-z0-9]{3,12}$/.test(c)) throw linkUnbekannt(ctx.request, 'Kein gültiger Link.'); return c; };
const KENNUNG = /^[A-Za-z0-9_-]{6,40}$/;

export const FOTOS = {
  /* Kunde über den Link: solange der Link offen ist (auch während einer Nachbesserung), nicht nach dem Senden */
  'POST /api/link/:code/foto/:id': async (ctx) => {
    if (ctx.instanz) return fotoInstanz(ctx);
    linkBremse(ctx.request);
    if (!erlaubt('foto:' + quelle(ctx.request), 240, 10 * 60 * 1000)) throw new ApiFehler('Gerade kommen zu viele Fotos. Bitte gleich noch einmal.', 429);
    const code = linkCode(ctx), id = idVon(ctx), u = bytesAus(ctx);
    if (!langerCode(code)) throw new ApiFehler('Zu diesem Link lassen sich keine Fotos ablegen.', 400); // alte kurze Links haben keinen Zwischenstand, mit dem das Aufräumen die Fotos fände
    const row = await ctx.sp.betriebNachCode(code); if (!row) throw linkUnbekannt(ctx.request);
    const v = row.daten && row.daten.verwaltung; if (v && v.sperre) throw new ApiFehler('Dieser Link ist zurzeit nicht aktiv. Bitte beim Fensterbauer nachfragen.', 404);
    const l = (row.daten.links || []).find((x) => x.code === code); if (!l) throw linkUnbekannt(ctx.request);
    const zu = X().linkZu(l);
    if (zu) throw new ApiFehler(zu === 'eingegangen' ? 'Dein Aufmaß ist schon beim Fensterbauer.' : 'Dieser Link ist nicht mehr aktiv.', 410, { zu: zu });
    const ab = ablageVon(ctx), o = linkOrdner(code);
    await platzPruefen(ab, o, id);
    if (!(await ab.ablegen(datei(o, id), u))) throw new ApiFehler('Das Foto ließ sich gerade nicht ablegen. Bitte gleich noch einmal.', 502);
    if (ctx.zaehlen) ctx.zaehlen('ereignis:foto_link');
    return { ok: true };
  },
  /* Betrieb: nur Fotos, die sein eingegangenes Aufmaß nennt; gesperrt (kostenpflichtig, noch keine Zahlungsart) bleiben sie auf dem Server */
  'GET /api/konto/foto/:code/:id': async (ctx) => {
    const n = await angemeldet(ctx, 'Bitte neu anmelden.'), code = linkCode(ctx), id = idVon(ctx);
    const row = await ctx.sp.betriebNachAuth(n.id); if (!row) throw new ApiFehler('Zu dieser Anmeldung gibt es noch keinen Betrieb.', 404);
    if (row.daten && row.daten.verwaltung && row.daten.verwaltung.sperre) throw new ApiFehler('Ihr Zugang zu eeziframes ist gesperrt.', 403, { gesperrt: true });
    const l = ((row.daten || {}).links || []).find((x) => x.code === code);
    if (!l || !l.aufmass || !fotoIds(l.aufmass.windows).has(id)) throw new ApiFehler('Dieses Foto gibt es nicht.', 404);
    if (l.locked) throw new ApiFehler('Dieses Aufmaß ist noch gesperrt. Mit einer Zahlungsart sehen Sie es samt Fotos.', 402, { gesperrt: true });
    if (l.fotosGeloescht) throw new ApiFehler('Die Fotos wurden 12 Monate nach dem Eingang gelöscht.', 410);
    const u = await ablageVon(ctx).holen(datei(linkOrdner(code), id));
    if (!u) throw new ApiFehler('Dieses Foto ist nicht angekommen.', 404);
    return bild(u);
  },
  /* Hauseigentümer mit Konto: Fotos des eigenen Aufmaßes, auch bevor es zum ersten Mal gesichert ist (der Ordner gehört zur Anmeldung) */
  'POST /api/kunde/aufmass/:kennung/foto/:id': async (ctx) => {
    const n = await angemeldet(ctx, 'Bitte melde dich neu an.');
    if (!erlaubt('fotok:' + n.id, 240, 10 * 60 * 1000)) throw new ApiFehler('Gerade kommen zu viele Fotos. Bitte gleich noch einmal.', 429);
    const kennung = String(ctx.params.kennung || ''); if (!KENNUNG.test(kennung)) throw new ApiFehler('Unbekanntes Aufmaß.', 400);
    const id = idVon(ctx), u = bytesAus(ctx);
    const e = ctx.sp.eigenesHolen ? await ctx.sp.eigenesHolen(kennung) : null;
    if (e && e.nutzer && e.nutzer !== n.id) throw new ApiFehler('Dieses Aufmaß gehört zu einem anderen Konto.', 403, { fremd: true });
    if (e && e.meta && e.meta.entfernt) throw new ApiFehler('Dieses Aufmaß wurde gelöscht.', 410, { geloescht: true });
    const ab = ablageVon(ctx), o = eigenerOrdner(n.id, kennung);
    await platzPruefen(ab, o, id);
    if (!(await ab.ablegen(datei(o, id), u))) throw new ApiFehler('Das Foto ließ sich gerade nicht ablegen. Bitte gleich noch einmal.', 502);
    return { ok: true };
  },
  'GET /api/kunde/aufmass/:kennung/foto/:id': async (ctx) => {
    const n = await angemeldet(ctx, 'Bitte melde dich neu an.');
    const kennung = String(ctx.params.kennung || ''); if (!KENNUNG.test(kennung)) throw new ApiFehler('Unbekanntes Aufmaß.', 400);
    const u = await ablageVon(ctx).holen(datei(eigenerOrdner(n.id, kennung), idVon(ctx)));
    if (!u) throw new ApiFehler('Dieses Foto gibt es nicht.', 404);
    return bild(u);
  }
};

/* Konfigurator-Instanz (Strang A, Bauplan §3 A.5, K1.3): keine anonyme Ablage. Nur Kennungen, die ein gespeichertes Fenster des
   Zwischenstands nennt (dazu die kleine Fassung <id>k), erst ab einem gespeicherten Fenster, höchstens 2 × Fenster + 4 verschiedene
   Fotos je Code; je Instanz und Tag GRENZEN.fotoTagInstanz (Alarm ab 500), je Anschluss die Bremse RL_FOTO */
async function fotoInstanz(ctx) {
  const inst = ctx.instanz, G = globalThis.Instanzregeln.GRENZEN;
  linkBremse(ctx.request);
  if (!(await bremse(ctx, 'FOTO', quelle(ctx.request))) || !erlaubt('foto:' + quelle(ctx.request), 240, 10 * 60 * 1000)) throw new ApiFehler('Gerade kommen zu viele Fotos. Bitte gleich noch einmal.', 429);
  const id = idVon(ctx), u = bytesAus(ctx), aufl = await linkAufloesen(ctx, ctx.params.code), code = aufl.code;
  const zu = X().linkZu(aufl.l);
  if (zu) throw new ApiFehler(zu === 'eingegangen' ? 'Deine Anfrage ist schon angekommen.' : 'Dieser Link ist nicht mehr aktiv.', 410, { zu: zu });
  const e = aufl.entwurf || (await ctx.sp.entwurfHolen(code)), wins = (e && e.daten && Array.isArray(e.daten.windows)) ? e.daten.windows : [];
  if (!wins.length) throw new ApiFehler('Bitte das Fenster zuerst speichern, dann kommen die Fotos dazu.', 409, { ohneFenster: true });
  const ids = fotoIds(wins), grund = ids.has(id) ? id : /k$/.test(id) && ids.has(id.slice(0, -1)) ? id.slice(0, -1) : '';
  if (!grund) throw new ApiFehler('Dieses Foto gehört zu keinem gespeicherten Fenster.', 400);
  const ab = ablageVon(ctx), o = linkOrdner(code), namen = (await ab.liste(o)).map((n) => n.replace(/\.jpg$/, '')), da = new Set(namen);
  const klein = (n) => /k$/.test(n) && (da.has(n.slice(0, -1)) || ids.has(n.slice(0, -1)));
  const gruende = new Set(namen.filter((n) => !klein(n)));
  if (!gruende.has(grund) && gruende.size >= 2 * wins.length + G.fotosZusatz) throw new ApiFehler('Zu dieser Planung gibt es schon sehr viele Fotos.', 409, { voll: true });
  const b = await budget(ctx, 'inst:' + inst.id8 + ':foto', G.fotoTagInstanz, { alarm: 500 });
  if (!b.ok) throw new ApiFehler('Heute kommen ungewöhnlich viele Fotos. Bitte morgen noch einmal.', 429);
  if (!(await ab.ablegen(datei(o, id), u))) throw new ApiFehler('Das Foto ließ sich gerade nicht ablegen. Bitte gleich noch einmal.', 502);
  instanzZaehlen(ctx, inst, 'foto');
  return { ok: true };
}

/* Aufräumen (zentrale.js, täglich): Fotos eingegangener Aufmaße 12 Monate nach dem Eingang löschen, höchstens max Links je Lauf.
   Das Aufmaß selbst bleibt; am Link steht danach fotosGeloescht (der Betriebsbereich sagt es statt eines leeren Rahmens) */
export async function fotosAltLoeschen(k, sp, rows, jetzt, max) {
  if (!ablage(k)) return 0;
  let n = 0;
  for (const row of rows || []) {
    const alt = ((row.daten || {}).links || []).filter((l) => l.aufmass && !l.fotosGeloescht && Number(l.eingegangenAt) > 0 && jetzt - Number(l.eingegangenAt) > FOTO_TAGE * TAG && fotoIds(l.aufmass.windows).size);
    for (const l of alt) {
      if (n >= (max || 50)) return n;
      if (!(await fotosLinkLoeschen(k, l.code))) continue;
      await sp.betriebAendern(row.id, (a) => { const x = (a.links || []).find((y) => y.code === l.code); if (x) x.fotosGeloescht = jetzt; });
      n++;
    }
  }
  return n;
}

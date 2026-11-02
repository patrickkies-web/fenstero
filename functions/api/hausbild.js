/* eeziframes · Hausbild: „An meinem Haus ansehen“ (Inhaber, 2.11.2026)
   Der Kunde setzt seine gespeicherten Fenster im Editor auf ein Foto seines Hauses (web/assets/hausbild.js). Für die echte Vorschau
   schickt die App nur den Ausschnitt um alle Elemente:
     bild    das Foto ohne Fenster (JPEG, data-URL), wird bearbeitet
     lage    derselbe Ausschnitt mit den eingesetzten Fenstern (nur für die Attrappe; geht nicht an den Dienst, siehe auftrag())
     vorlagen je Fenster ein Bild aus dem 3-D-Modell, von außen (PNG oder JPEG), höchstens 8
     elemente [{ box: [oben, links, unten, rechts] auf 0–1000, vorlage: Index, art: 'ersetzen' | 'neu',
               daten: { farbe: '#rrggbb', fluegel, oberlicht, sprossen, tuer, sonne: 'raffstore' | 'rollladen' | 'screen' | '', glas: 'klar' | 'ornament' } }]
   Der Server schreibt daraus den Auftrag für FLUX 3 Image Klein bei Black Forest Labs (europäischer Zugang, Felder je Element nach
   docs.bfl.ai „Bounding boxes“) und gibt die Adresse zum Abholen zurück; die App fragt mit GET /api/hausbild?u=… nach, bis das Bild da
   ist (der Server holt es beim Dienst und gibt es als data-URL weiter). Die App setzt es nur innerhalb der
   Elementflächen ins Originalfoto zurück; was außerhalb liegt, bleibt Pixel für Pixel das Foto des Kunden.
   Kosten: 0,9 Cent je Bild (resolution 1k, Preisliste docs.bfl.ai, 1.11.2026). Nur der EU-Zugang, siehe unten. Ohne BFL_API_KEY: 503 (die App sagt „noch nicht
   verfügbar“). BFL_API_KEY=attrappe (lokal, KI_ATTRAPPE=1): Das Bild mit den eingesetzten Fenstern kommt unverändert zurück.
   Bremsen: 10 Bilder je 10 Minuten und Anschluss (Arbeitsspeicher), 20 je Anschluss und Tag (Prüfwert statt IP-Adresse in der Tabelle
   statistik, nach zwei Tagen gelöscht), HAUSBILD_TAG_MAX (Vorgabe 500) am Tag über alle Kunden. Foto und Ergebnis speichert der Server
   nicht; sie liegen nur im Browser des Kunden. Ohne den aktuellen Stand der Einwilligung (EINW_STAND) keine Übermittlung. */
import { erlaubt, quelle, konfig } from './umgebung.js';
import { speicher } from './speicher.js';
import { budget } from './bremse.js';

/* Nur der EU-Zugang (Datenschutzerklärung 5a, Prüfung 2.11.2026): Ist er gestört, gibt es keine KI-Vorschau; auf den weltweiten
   Zugang (Rechenzentren auch in den USA) weichen wir nicht aus. */
const ZUGANG = 'https://api.eu.bfl.ai/v1/';
/* Stand des Einwilligungstextes in der App (web/assets/hausbild.js, HB_EINW_STAND): ohne ihn keine Übermittlung (Nachweis Art. 7 Abs. 1) */
export const EINW_STAND = '2026-11-02b';
const MODELL = 'flux-3-image-klein'; // HAUSBILD_MODELL=flux-3-image nimmt das große Modell (etwa 5 Cent statt 0,9)
const MAX_BYTES = 6 * 1024 * 1024; // je Bild als base64
const antwort = (obj, status) => new Response(JSON.stringify(obj), { status: status || 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
const bildOk = (s) => typeof s === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s.slice(0, 64) + s.slice(-8)) && s.length < MAX_BYTES;
const roh = (s) => s.slice(s.indexOf(',') + 1);
const box = (b) => Array.isArray(b) && b.length === 4 && b.every((x) => Number.isFinite(x)) ? b.map((x) => Math.max(0, Math.min(1000, Math.round(x)))) : null;

/* Auftrag wie beim gelungenen ersten Test des Inhabers (2.11.2026): Bild 1 ist das saubere Foto und wird bearbeitet, ab Bild 2 je
   Fenster eine Vorlage. Je Element ein Feld (Ziel = die Maueröffnung, die der Kunde mit den Ecken markiert hat), das sein Fenster aus der
   Vorlage holt; die übrige Fassade bleibt. Das Foto mit den flach eingesetzten Fenstern geht NICHT als Quelle mit: Ein Feld mit dieser
   Quelle übernimmt die flachen Fenster, statt sie einzubauen (erste Fassung, Urteil des Inhabers: „einfach nur schräg eingesetzt“).
   Die Beschreibung je Fenster (Farbe, Flügel, Sprossen, Sonnenschutz, Glas) kommt aus den Daten des Fensters. */
const farbName = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '')); if (!m) return 'the colour of the reference';
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, l = 0.2126 * r + 0.7152 * g + 0.0722 * b, sat = Math.max(r, g, b) - Math.min(r, g, b);
  const name = l > 225 ? 'white' : l > 190 && sat < 30 ? 'light grey' : sat > 40 && r > g && g > b ? (l > 120 ? 'golden oak wood' : 'dark brown wood') : l < 45 ? 'black' : l < 95 ? 'anthracite grey' : 'grey';
  return name + ' (#' + m[1].toLowerCase() + ')';
};
export function beschreibung(e) {
  const d = e.daten || {}, teile = [];
  teile.push((d.tuer ? 'door' : 'window') + ' with a ' + farbName(d.farbe) + ' frame');
  if (d.fluegel > 1) teile.push(d.fluegel + ' sashes side by side'); else teile.push('one sash');
  if (d.oberlicht) teile.push('a transom light on top');
  if (d.sprossen) teile.push('glazing bars dividing the glass');
  if (d.sonne === 'raffstore') teile.push('an external venetian blind (raffstore) head box on top of the frame with guide rails');
  else if (d.sonne === 'rollladen') teile.push('a roller shutter box on top of the frame with guide rails');
  else if (d.sonne === 'screen') teile.push('a fabric screen box on top of the frame');
  teile.push(d.glas === 'ornament' ? 'obscured privacy glass' : 'clear insulating glass that reflects the sky and the surroundings, with a hint of the dark room behind, not frosted and not milky');
  return teile.join(', ');
}
export function auftrag(elemente) {
  const neu = elemente.some((e) => e.art === 'neu'), alt = elemente.some((e) => e.art !== 'neu');
  const namen = elemente.map((e, i) => '<window_' + (i + 1) + '>').join(', ');
  const text = 'Photorealistic architectural edit of <ref_image_0>, a photo of a house. Install the new windows ' + namen + ' into the wall at the marked places, as a professional window fitter would. ' +
    'Each box marks a masonry opening in the photo. ' +
    (alt ? 'If there is an old window or a bare opening, the new window replaces it completely; no part of an old frame remains. ' : '') +
    (neu ? 'If the wall is closed there, first cut a clean rectangular opening with plastered reveals and a lintel that match the facade. ' : '') +
    'Set the window frame back inside the opening, recessed behind the facade surface, so the reveals stay visible on the sides and on top, seen in exactly the perspective, angle and vanishing lines of this wall and this camera. ' +
    'Below the window a window sill with a small overhang and a drip edge. Cast the soft shadows of the lintel and the reveals onto the frame and the glass, following the direction of the sunlight in the photo. ' +
    'The glass reflects the real sky and the surroundings of this photo; the frame has the same light, colour temperature, sharpness and camera noise as the rest of the image. ' +
    'Keep the design of each window exactly as in its reference image: frame colour, number and division of sashes, glazing bars, handles and blind box. ' +
    'Only the marked boxes get new windows: every other opening, window or door in the photo stays exactly as it is, even if it is empty. ' +
    'Do not add, remove or change people, faces, text, logos or licence plates. ' +
    'Do not change anything outside the boxes: facade <facade_1>, roof, plants and sky stay exactly as they are.';
  const zeilen = elemente.map((e, i) => ({ id: 'window_' + (i + 1), from: 'ref_image_' + (e.vorlage + 1), src_bbox: [0, 0, 1000, 1000], tgt_bbox: e.box, desc: 'new ' + beschreibung(e) + ', built into the opening' }));
  zeilen.push({ id: 'facade_1', from: 'ref_image_0', src_bbox: [0, 0, 1000, 1000], tgt_bbox: [0, 0, 1000, 1000], desc: 'the existing house facade, unchanged outside the windows' });
  return text + ' ' + JSON.stringify(zeilen);
}

/* Anschluss als gekürzter Prüfwert mit dem Geheimnis des Servers, wie konten.js (anschlussWert) */
async function pruefwert(k, q) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String((k && k.geheimnis) || '') + '|hausbild|' + q));
  return Array.from(new Uint8Array(d)).slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join('');
}
async function bfl(env, pfad, daten) {
  const r = await fetch(pfad.indexOf('http') === 0 ? pfad : ZUGANG + pfad, { method: daten ? 'POST' : 'GET', headers: { 'x-key': env.BFL_API_KEY, accept: 'application/json', 'content-type': 'application/json' }, body: daten ? JSON.stringify(daten) : undefined });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { /* kein JSON */ }
  return { status: r.status, j: j };
}

export async function onRequestPost({ request, env }) {
  if (!env.BFL_API_KEY) return antwort({ ok: false, fehler: 'nicht_eingerichtet' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return antwort({ ok: false, fehler: 'forbidden' }, 403);
  const q = quelle(request);
  if (!erlaubt('hausbild:' + q, 10, 10 * 60 * 1000)) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  let d; try { d = await request.json(); } catch (e) { return antwort({ ok: false, fehler: 'bad_request' }, 400); }
  const vorlagen = Array.isArray(d && d.vorlagen) ? d.vorlagen.slice(0, 8) : [];
  const zahl = (v, max) => Math.max(0, Math.min(max, parseInt(v, 10) || 0));
  const daten = (x) => { x = x || {}; return { farbe: /^#[0-9a-f]{6}$/i.test(String(x.farbe || '')) ? x.farbe : '', fluegel: zahl(x.fluegel, 6), oberlicht: !!x.oberlicht, sprossen: !!x.sprossen, tuer: !!x.tuer, sonne: ['raffstore', 'rollladen', 'screen'].indexOf(x.sonne) >= 0 ? x.sonne : '', glas: x.glas === 'ornament' ? 'ornament' : 'klar' }; };
  const elemente = (Array.isArray(d && d.elemente) ? d.elemente : []).slice(0, 8).map((e) => ({ box: box(e && e.box), vorlage: Math.max(0, Math.min(vorlagen.length - 1, parseInt(e && e.vorlage, 10) || 0)), art: e && e.art === 'neu' ? 'neu' : 'ersetzen', daten: daten(e && e.daten) }));
  if (!bildOk(d && d.bild) || !vorlagen.length || !vorlagen.every(bildOk) || !elemente.length || elemente.some((e) => !e.box)) return antwort({ ok: false, fehler: 'bad_request' }, 400);
  if (!d || d.einwilligung !== EINW_STAND) return antwort({ ok: false, fehler: 'einwilligung' }, 400);
  /* Tagesgrenzen: je Anschluss als gekürzter Prüfwert mit Geheimnis (keine IP-Adresse in der Datenbank, nach zwei Tagen gelöscht:
     eingang.js) und über alle Kunden (Datenbank, sonst Arbeitsspeicher) */
  const ctx = { env: env, sp: null }; let k = {}; try { k = konfig(env); ctx.sp = speicher(k); } catch (e) { /* ohne Datenbank */ }
  const max = Math.max(1, parseInt(env.HAUSBILD_TAG_MAX, 10) || 500);
  if (!(await budget(ctx, 'hbanschluss:' + (await pruefwert(k, q)), 20)).ok || !(await budget(ctx, 'hausbild:tag', max)).ok) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'tag' }, 429);
  if (env.BFL_API_KEY === 'attrappe') return antwort({ ok: true, bild: bildOk(d.lage) ? d.lage : d.bild, attrappe: true, kosten: 0 }); // lokal: das Bild mit den eingesetzten Fenstern
  const modell = /^flux-3-image(-klein)?$/.test(String(env.HAUSBILD_MODELL || '')) ? env.HAUSBILD_MODELL : MODELL;
  const nutzlast = { prompt: auftrag(elemente), images: [roh(d.bild)].concat(vorlagen.map(roh)), resolution: '1k', output_format: 'jpeg' };
  let a;
  try { a = await bfl(env, modell, nutzlast); } catch (e) { a = { status: 502, j: null }; }
  if (a.status === 429) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  if (a.status !== 200 || !a.j || !ABHOLEN.test(String(a.j.polling_url || ''))) return antwort({ ok: false, fehler: 'dienst', status: a.status }, 502);
  /* nicht warten: die App holt das Ergebnis mit GET ab (bei Last braucht der Dienst auch einmal Minuten) */
  return antwort({ ok: true, warten: a.j.polling_url, kosten: a.j.cost != null ? a.j.cost : null });
}

/* Ergebnis abholen: GET /api/hausbild?u=<polling_url des Dienstes>. Nur Adressen des Dienstes (kein Abruf beliebiger Adressen über den
   Server), nur von der eigenen Seite. Antwort: { fertig: false } solange der Dienst rechnet, sonst das Bild als data-URL. */
const ABHOLEN = /^https:\/\/api\.eu[0-9]*\.bfl\.ai\/v1\/get_result\?id=[0-9a-f-]{36}$/; // nur EU-Rechenzentren
const LIEFERUNG = /^https:\/\/[a-z0-9.-]+\.bfl\.ai\//; // das fertige Bild nur vom Dienst selbst
export async function onRequestGet({ request, env }) {
  if (!env.BFL_API_KEY) return antwort({ ok: false, fehler: 'nicht_eingerichtet' }, 503);
  const url = new URL(request.url), u = url.searchParams.get('u') || '';
  if (request.headers.get('x-hausbild') !== '1' || (request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')) return antwort({ ok: false, fehler: 'forbidden' }, 403);
  if (!ABHOLEN.test(u)) return antwort({ ok: false, fehler: 'bad_request' }, 400);
  if (!erlaubt('hausbild-abholen:' + quelle(request), 400, 10 * 60 * 1000)) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  let e;
  try { e = await bfl(env, u); } catch (x) { return antwort({ ok: true, fertig: false }); }
  const st = e.j && e.j.status;
  if (!st || /^(Pending|Queued|Reasoning|Generating|Processing)$/i.test(st)) return antwort({ ok: true, fertig: false });
  if (st !== 'Ready' || !e.j.result || !e.j.result.sample) return antwort({ ok: false, fehler: /moderat|content/i.test(st) ? 'abgelehnt' : 'dienst', status: st }, 502);
  /* Das Bild liegt nur kurz beim Dienst: hier abholen und als data-URL weitergeben (die App lädt nichts von fremden Servern) */
  let b;
  if (!LIEFERUNG.test(String(e.j.result.sample))) return antwort({ ok: false, fehler: 'dienst' }, 502);
  try { const r = await fetch(e.j.result.sample); if (!r.ok) throw new Error(String(r.status)); b = new Uint8Array(await r.arrayBuffer()); } catch (x) { return antwort({ ok: false, fehler: 'dienst' }, 502); }
  let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return antwort({ ok: true, fertig: true, bild: 'data:image/jpeg;base64,' + btoa(s) });
}

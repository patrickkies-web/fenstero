/* eeziframes · Hausbild: „An meinem Haus ansehen“ (Inhaber, 2.11.2026)
   Der Kunde setzt seine gespeicherten Fenster im Editor auf ein Foto seines Hauses (web/assets/hausbild.js). Für die echte Vorschau
   schickt die App nur den Ausschnitt um alle Elemente:
     bild    das Foto ohne Fenster (JPEG, data-URL), wird bearbeitet
     lage    derselbe Ausschnitt mit den eingesetzten Fenstern in Lage und Winkel (JPEG)
     vorlagen je Fenster ein Bild aus dem 3-D-Modell, von außen (PNG oder JPEG), höchstens 8
     elemente [{ box: [oben, links, unten, rechts] auf 0–1000, vorlage: Index, art: 'ersetzen' | 'neu', name }]
   Der Server schreibt daraus den Auftrag für FLUX 3 Image Klein bei Black Forest Labs (europäischer Zugang, Felder je Element nach
   docs.bfl.ai „Bounding boxes“), wartet auf das Bild und gibt es als data-URL zurück. Die App setzt es nur innerhalb der
   Elementflächen ins Originalfoto zurück; was außerhalb liegt, bleibt Pixel für Pixel das Foto des Kunden.
   Kosten: 0,9 Cent je Bild (resolution 1k, Preisliste docs.bfl.ai, 1.11.2026). Zugang über HAUSBILD_ZUGANG (siehe unten). Ohne BFL_API_KEY: 503 (die App sagt „noch nicht
   verfügbar“). BFL_API_KEY=attrappe (lokal, KI_ATTRAPPE=1): Das Bild mit den eingesetzten Fenstern kommt unverändert zurück.
   Bremsen: 10 Bilder je 10 Minuten und Anschluss (Arbeitsspeicher), 20 je Anschluss und Tag, HAUSBILD_TAG_MAX (Vorgabe 500) am Tag
   über alle Kunden (Tabelle statistik). Gespeichert wird nichts: Foto und Ergebnis liegen nur im Browser des Kunden. */
import { erlaubt, quelle, konfig } from './umgebung.js';
import { speicher } from './speicher.js';
import { budget } from './bremse.js';

/* Zugang: HAUSBILD_ZUGANG = eu (Vorgabe, Rechenzentren in der EU), global, oder eu-dann-global (bei einem Ausfall des EU-Zugangs, 5xx,
   einmal über den weltweiten; dann gehört der weltweite Zugang auch in die Datenschutzerklärung) */
const ZUGANG = { eu: 'https://api.eu.bfl.ai/v1/', global: 'https://api.bfl.ai/v1/' };
const MODELL = 'flux-3-image-klein';
const MAX_BYTES = 6 * 1024 * 1024; // je Bild als base64
const antwort = (obj, status) => new Response(JSON.stringify(obj), { status: status || 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
const bildOk = (s) => typeof s === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s.slice(0, 64) + s.slice(-8)) && s.length < MAX_BYTES;
const roh = (s) => s.slice(s.indexOf(',') + 1);
const box = (b) => Array.isArray(b) && b.length === 4 && b.every((x) => Number.isFinite(x)) ? b.map((x) => Math.max(0, Math.min(1000, Math.round(x)))) : null;
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/* Auftrag: Bild 1 wird bearbeitet, Bild 2 zeigt Lage und Winkel, ab Bild 3 die Fenster selbst. Je Element ein Feld, das sein Fenster
   aus Bild 2 an derselben Stelle übernimmt; die übrige Fassade bleibt (Feld über das ganze Bild). */
export function auftrag(elemente, mitLage) {
  const neu = elemente.some((e) => e.art === 'neu'), alt = elemente.some((e) => e.art !== 'neu');
  const text = 'Photorealistic edit of <ref_image_0>, a daylight photo of a house facade. ' +
    (mitLage ? 'Image <ref_image_1> shows the same photo with the new windows roughly pasted in as flat cut-outs: it defines where each window goes, its size and its perspective. ' : '') +
    'Build each new window into the wall exactly at its place, as a real window would be installed: ' +
    (alt ? 'where an old window or door is, replace it completely, no part of the old frame may remain; ' : '') +
    (neu ? 'where the wall is closed, cut a clean opening with reveals and a window sill that match the facade; ' : '') +
    'follow the perspective and vanishing lines of the wall, add a realistic reveal depth, the shadow of the lintel and the sill, and match the daylight, colour temperature, sharpness and camera noise of the photo. ' +
    'Keep the design of every window exactly as in its reference image: frame colour, number and division of sashes, glazing bars, shutter or blind box, handles. ' +
    'Keep the facade <facade_1> and everything else exactly unchanged.';
  const zeilen = elemente.map((e, i) => ({
    id: 'window_' + (i + 1), from: mitLage ? 'ref_image_1' : 'ref_image_' + (e.vorlage + 1), src_bbox: mitLage ? e.box : [20, 20, 980, 980], tgt_bbox: e.box,
    desc: 'new window exactly as in ' + '<ref_image_' + (e.vorlage + (mitLage ? 2 : 1)) + '>' + (e.name ? ' (' + e.name + ')' : '') + ', built into the wall in the perspective of the facade'
  }));
  zeilen.push({ id: 'facade_1', from: 'ref_image_0', src_bbox: [0, 0, 1000, 1000], tgt_bbox: [0, 0, 1000, 1000], desc: 'the house facade, unchanged outside the windows' });
  return text + ' ' + JSON.stringify(zeilen);
}

async function bfl(env, pfad, daten, basis) {
  const r = await fetch(pfad.indexOf('http') === 0 ? pfad : (basis || ZUGANG.eu) + pfad, { method: daten ? 'POST' : 'GET', headers: { 'x-key': env.BFL_API_KEY, accept: 'application/json', 'content-type': 'application/json' }, body: daten ? JSON.stringify(daten) : undefined });
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
  const elemente = (Array.isArray(d && d.elemente) ? d.elemente : []).slice(0, 8).map((e) => ({ box: box(e && e.box), vorlage: Math.max(0, Math.min(vorlagen.length - 1, parseInt(e && e.vorlage, 10) || 0)), art: e && e.art === 'neu' ? 'neu' : 'ersetzen', name: String((e && e.name) || '').replace(/[^\p{L}\p{N} .,()-]/gu, '').slice(0, 40) }));
  if (!bildOk(d && d.bild) || (d.lage && !bildOk(d.lage)) || !vorlagen.length || !vorlagen.every(bildOk) || !elemente.length || elemente.some((e) => !e.box)) return antwort({ ok: false, fehler: 'bad_request' }, 400);
  /* Tagesgrenzen: je Anschluss und über alle Kunden (Datenbank, sonst Arbeitsspeicher) */
  const ctx = { env: env, sp: null }; try { ctx.sp = speicher(konfig(env)); } catch (e) { /* ohne Datenbank */ }
  const max = Math.max(1, parseInt(env.HAUSBILD_TAG_MAX, 10) || 500);
  if (!(await budget(ctx, 'hausbild:' + q, 20)).ok || !(await budget(ctx, 'hausbild:tag', max)).ok) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'tag' }, 429);
  if (env.BFL_API_KEY === 'attrappe') return antwort({ ok: true, bild: d.lage || d.bild, attrappe: true, kosten: 0 });
  const mitLage = !!d.lage;
  const nutzlast = { prompt: auftrag(elemente, mitLage), images: [roh(d.bild)].concat(mitLage ? [roh(d.lage)] : [], vorlagen.map(roh)), resolution: '1k', output_format: 'jpeg', safety_tolerance: 2 };
  const z = String(env.HAUSBILD_ZUGANG || 'eu').toLowerCase(), wege = z === 'global' ? [ZUGANG.global] : z === 'eu-dann-global' ? [ZUGANG.eu, ZUGANG.global] : [ZUGANG.eu];
  let a = null;
  for (const basis of wege) {
    try { a = await bfl(env, MODELL, nutzlast, basis); } catch (e) { a = { status: 502, j: null }; }
    if (a.status < 500) break;
  }
  if (a.status === 429) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  if (a.status !== 200 || !a.j || !a.j.polling_url) return antwort({ ok: false, fehler: 'dienst', status: a.status }, 502);
  /* höchstens etwa 50 Sekunden warten */
  let e = null;
  for (let i = 0; i < 40; i++) {
    await warte(i < 4 ? 1500 : 1200);
    try { e = await bfl(env, a.j.polling_url); } catch (x) { continue; }
    const st = e.j && e.j.status;
    if (st === 'Ready') break;
    if (st && !/^(Pending|Queued|Reasoning|Generating|Processing)$/i.test(st)) return antwort({ ok: false, fehler: /moderat|content/i.test(st) ? 'abgelehnt' : 'dienst', status: st }, 502);
  }
  const quelleUrl = e && e.j && e.j.status === 'Ready' && e.j.result && e.j.result.sample;
  if (!quelleUrl) return antwort({ ok: false, fehler: 'zeit' }, 504);
  /* Das Bild liegt nur kurz beim Dienst: hier abholen und als data-URL weitergeben (die App lädt nichts von fremden Servern) */
  let b;
  try { const r = await fetch(quelleUrl); if (!r.ok) throw new Error(String(r.status)); b = new Uint8Array(await r.arrayBuffer()); } catch (x) { return antwort({ ok: false, fehler: 'dienst' }, 502); }
  let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
  return antwort({ ok: true, bild: 'data:image/jpeg;base64,' + btoa(s), kosten: a.j.cost != null ? a.j.cost : null });
}

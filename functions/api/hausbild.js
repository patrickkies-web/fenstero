/* eeziframes · Hausbild: „An meinem Haus ansehen“ (Inhaber, 2.11.2026)
   Der Kunde setzt seine gespeicherten Fenster im Editor auf ein Foto seines Hauses (web/assets/hausbild.js). Für die echte Vorschau
   schickt die App nur den Ausschnitt um alle Elemente:
     bild    das Foto ohne Fenster (JPEG, data-URL), wird bearbeitet
     lage    derselbe Ausschnitt mit den eingesetzten Fenstern (nur für die Attrappe; geht nicht an den Dienst, siehe auftrag())
     vorlagen je Fenster ein Bild aus dem 3-D-Modell, von außen (PNG oder JPEG), höchstens 8
     elemente [{ box: [oben, links, unten, rechts] auf 0–1000, vorlage: Index, art: 'ersetzen' | 'neu',
               daten: { farbe: '#rrggbb', fluegel, oberlicht, sprossen, tuer, sonne: 'raffstore' | 'rollladen' | 'screen' | 'klappladen' | '', glas: 'klar' | 'ornament',
                        kasten: 'aufsatz' | 'vorbau' | 'unterputz', blende: 'fassade' | 'alu', behangFarbe, kastenFarbe, schienenFarbe, ladenFarbe: '#rrggbb' } }]
     format  [Breite, Höhe] des Ausschnitts in Pixeln (für das Seitenverhältnis des Ergebnisses)
   AKTUELL (Inhaber, 2.11.2026 abends): Cloudflare Workers AI mit FLUX.2 [klein] 9B, siehe cloudflare() unten. Das Folgende beschreibt den
   Weg über Black Forest Labs direkt, der im Code bleibt, aber aus ist (FREIGEGEBEN):
   Der Server schreibt daraus den Auftrag für FLUX 3 Image Klein bei Black Forest Labs (europäischer Zugang, Felder je Element nach
   docs.bfl.ai „Bounding boxes“) und gibt die Adresse zum Abholen zurück; die App fragt mit GET /api/hausbild?u=… nach, bis das Bild da
   ist (der Server holt es beim Dienst und gibt es als data-URL weiter). Die App setzt es nur innerhalb der
   Elementflächen ins Originalfoto zurück; was außerhalb liegt, bleibt Pixel für Pixel das Foto des Kunden.
   Kosten: 0,9 Cent je Bild (resolution 1k, Preisliste docs.bfl.ai, 1.11.2026). Nur der EU-Zugang, siehe unten. Ohne BFL_API_KEY: 503 (die App sagt „noch nicht
   verfügbar“). BFL_API_KEY=attrappe (lokal, KI_ATTRAPPE=1): Das Bild mit den eingesetzten Fenstern kommt unverändert zurück.
   Bremsen: 10 Bilder je 10 Minuten und Anschluss (Arbeitsspeicher), 25 je Anschluss und Tag (Prüfwert statt IP-Adresse in der Tabelle
   statistik, nach zwei Tagen gelöscht), HAUSBILD_TAG_MAX (Vorgabe 150) am Tag über alle Kunden. Foto und Ergebnis speichert der Server
   nicht; sie liegen nur im Browser des Kunden. Ohne den aktuellen Stand der Einwilligung (EINW_STAND) keine Übermittlung. */
import { erlaubt, quelle, konfig } from './umgebung.js';
import { speicher } from './speicher.js';
import { budget } from './bremse.js';

/* Welcher Weg rechnet (Inhaber, 2.11.2026 abends: „bau mir das auf meine Website“, über Cloudflare):
   - 'cloudflare': Workers AI (Binding AI in wrangler.jsonc), FLUX.2 [klein] 9B, laut Cloudflare „Cloudflare-hosted“: gerechnet auf
     Servern von Cloudflare, Black Forest Labs erhält nichts; Cloudflare nutzt Inhalte von Workers AI nicht zum Training
     (developers.cloudflare.com/workers-ai/platform/privacy/) und ist schon unser Auftragsverarbeiter (Datenschutzerklärung 2 und 5a).
     An, sobald das Binding besteht; HAUSBILD_FREI=0 bei Cloudflare schaltet die Vorschau ab.
   - 'bfl': Black Forest Labs direkt (FLUX 3, Felder je Fenster). Aus (FREIGEGEBEN), bis der Vertrag zur Auftragsverarbeitung und die
     Bestätigung „kein Training“ vorliegen (docs/recht/2026-11-02-black-forest-labs-anfrage.md); dann auch neue Rechtstexte.
   - 'attrappe': lokal mit KI_ATTRAPPE=1 (rechnet nicht, schickt nichts). */
const FREIGEGEBEN = false;
export const hausbildWeg = (env) => !env || env.HAUSBILD_FREI === '0' ? '' : env.BFL_API_KEY === 'attrappe' ? 'attrappe' : env.AI ? 'cloudflare'
  : FREIGEGEBEN && env.BFL_API_KEY && env.HAUSBILD_FREI === '1' ? 'bfl' : '';
export const hausbildFrei = (env) => !!hausbildWeg(env);
/* Cloudflare nimmt nur Eingabebilder unter 512 × 512 Pixel: Die App verkleinert darauf (/api/status meldet hausbildMax) */
export const CF_MAX = 508;
const CF_MODELL = '@cf/black-forest-labs/flux-2-klein-9b';

/* Nur der EU-Zugang (Datenschutzerklärung 5a, Prüfung 2.11.2026): Ist er gestört, gibt es keine KI-Vorschau; auf den weltweiten
   Zugang (Rechenzentren auch in den USA) weichen wir nicht aus. */
const ZUGANG = 'https://api.eu.bfl.ai/v1/';
/* Stand des Einwilligungstextes in der App (web/assets/hausbild.js, HB_EINW_STAND): ohne ihn keine Übermittlung (Nachweis Art. 7 Abs. 1) */
export const EINW_STAND = '2026-11-02c'; // c: Text für Cloudflare
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
  const name = l > 225 ? 'white' : l > 190 && sat < 30 ? 'light grey' : sat > 40 && r > g && g > b ? (l > 120 ? 'golden oak wood' : 'dark brown wood') : sat > 30 && g > r && g >= b ? (l < 90 ? 'dark green' : 'green') : sat > 30 && b > r && b > g ? (l < 90 ? 'dark blue' : 'blue') : sat > 40 && r > g && r > b ? 'red' : l < 45 ? 'black' : l < 95 ? 'anthracite grey' : 'grey'; // Farbton für Klappläden und Behang
  return name + ' (#' + m[1].toLowerCase() + ')';
};
export function beschreibung(e) {
  const d = e.daten || {}, teile = [];
  teile.push((d.tuer ? 'door' : 'window') + ' with a frame in ' + farbName(d.farbe));
  if (d.fluegel > 1) teile.push(d.fluegel + ' sashes side by side'); else teile.push('one sash');
  if (d.oberlicht) teile.push('a transom light on top');
  if (d.sprossen) teile.push('glazing bars dividing the glass');
  /* Sonnenschutz mit allem, was man von außen sieht (seit 4.11.2026): Kastenart, Blende, Farben von Behang, Kasten und Schienen; der
     Behang ist ganz hochgefahren, damit das Fenster frei bleibt. Klappläden stehen offen an der Wand. */
  const behang = { raffstore: 'external venetian blind (raffstore)', rollladen: 'roller shutter', screen: 'fabric sun screen' }[d.sonne];
  if (behang) {
    const schienen = ' guide rails in ' + farbName(d.schienenFarbe || d.kastenFarbe || d.behangFarbe) + ' run down both sides of the frame';
    const kasten = d.kasten === 'vorbau' ? 'a visible surface-mounted ' + behang + ' box (Vorbaukasten) fixed on the facade above the window, in ' + farbName(d.kastenFarbe || d.behangFarbe)
      : d.kasten === 'unterputz' ? 'a ' + behang + ' whose box is hidden inside the wall above the window, so no box is visible, only a narrow slot under the lintel'
      : d.blende === 'alu' ? 'a ' + behang + ' box on top of the frame, covered by a flat aluminium fascia panel in ' + farbName(d.kastenFarbe || d.behangFarbe) + ' flush with the facade'
      : 'a ' + behang + ' box on top of the frame, rendered over with plaster in the facade colour so it is not visible, only a narrow slot above the frame';
    teile.push(kasten + ';' + schienen + '; the ' + (d.sonne === 'raffstore' ? 'slats are' : d.sonne === 'screen' ? 'fabric is' : 'shutter curtain is') + ' in ' + farbName(d.behangFarbe) + ' and fully raised, so the window is uncovered');
  } else if (d.sonne === 'klappladen') teile.push('a pair of hinged wooden shutters in ' + farbName(d.ladenFarbe) + ', opened and fixed to the wall left and right of the window');
  teile.push(d.glas === 'ornament' ? 'obscured privacy glass' : 'clear insulating glass that reflects the sky and the surroundings, with a hint of the dark room behind, not frosted and not milky');
  return teile.join(', ');
}
/* Licht und Glas (Inhaber, 4.11.2026 abends: Einbau „megageil“, aber die Fenster „nicht mehr so detailreich … im Hinblick auf Licht,
   Einstrahlung“, „die Spiegelungen … passen nicht zu der Umgebung“). Beim Kürzen waren die Sätze zu Licht und Glas weggefallen, und „1:1
   wie die Vorlage“ ließ die KI das glatte Studioglas des 3-D-Bildes übernehmen. Deshalb: Form und Farben aus der Vorlage, Licht und Glas
   aus dem Foto. Kein Aufzählen der Merkmale; nur, wie echtes Glas und ein echter Rahmen in diesem Licht aussehen. */
export function lichtUndGlas(elemente, mehr) {
  const orn = elemente.some((e) => e.daten && e.daten.glas === 'ornament'), es = mehr ? 'them' : 'it';
  return 'Take only shape and colours from the reference, not its flat studio glass and studio light. ' +
    'Light ' + es + ' like the photo: same sun direction, colour temperature, sharpness and grain; lintel and reveals cast soft shadows onto frame and glass; ' +
    'frame edges, gaskets and handles catch the light with a slight sheen. ' +
    'The glass is real double glazing: it mirrors the sky and the surroundings in front of the house, bent by the perspective and slightly uneven, ' +
    'brighter at the top, darker below, with a faint hint of the dark room behind' + (orn ? '; obscured glass stays obscured' : '') + '; never flat blue, plain grey or a perfect mirror. ';
}
/* Kurzer Auftrag (Inhaber, 4.11.2026: „dass der Prompt nicht so groß ist … je länger der wird, umso weniger wird nachher in den Feinheiten
   aufgepasst“; das Element ist im Konfigurator gestaltet und liegt als Bild vor, es muss nur eins zu eins verbaut werden): kein Aufzählen
   der Merkmale mehr, nur Einbau 1:1 nach der Vorlage, in Größe, Proportion und Perspektive der Wand, und sonst nichts ändern. */
export function auftrag(elemente) {
  const neu = elemente.some((e) => e.art === 'neu'), namen = elemente.map((e, i) => '<window_' + (i + 1) + '>').join(', ');
  const text = 'Photorealistic edit of <ref_image_0>, a photo of a house. Build ' + namen + ' into the marked openings exactly as in their reference images, 1:1: ' +
    'same proportions, sashes, colours and blind box, nothing added or left out. Match the angle and perspective of the wall: frame set back in the opening, ' +
    'reveals visible, sill below. ' + lichtUndGlas(elemente, elemente.length > 1) + 'Old windows there are replaced completely' + (neu ? '; on a closed wall cut a matching opening' : '') + '. ' +
    'Change nothing else in the photo.';
  const zeilen = elemente.map((e, i) => ({ id: 'window_' + (i + 1), from: 'ref_image_' + (e.vorlage + 1), src_bbox: [0, 0, 1000, 1000], tgt_bbox: e.box, desc: 'the window from its reference image, 1:1' }));
  zeilen.push({ id: 'facade_1', from: 'ref_image_0', src_bbox: [0, 0, 1000, 1000], tgt_bbox: [0, 0, 1000, 1000], desc: 'the house, unchanged' });
  return text + ' ' + JSON.stringify(zeilen);
}

/* Auftrag für FLUX.2 [klein] bei Cloudflare: Bild 1 ist der Ausschnitt mit den flach eingesetzten Fenstern (lage), ab Bild 2 die Vorlagen
   aus dem 3-D-Modell. Seit 4.11.2026 kurz (Wunsch des Inhabers): Lage im Bild und die Nummer der Vorlage je Fenster, keine Merkmalsliste;
   die eingesetzten Fenster in Bild 1 zeigen Teilung und Farbe schon. Licht und Glas seit dem Abend wieder ausdrücklich (lichtUndGlas). */
function lageWort(b) {
  const cy = (b[0] + b[2]) / 2, cx = (b[1] + b[3]) / 2, v = cy < 380 ? 'upper' : cy > 620 ? 'lower' : '', h = cx < 380 ? 'left' : cx > 620 ? 'right' : '';
  return v && h ? v + ' ' + h : v || h || 'centre';
}
export function auftragCf(elemente, vorlagenZahl) {
  const neu = elemente.some((e) => e.art === 'neu'), mehr = elemente.length > 1;
  const je = elemente.map((e, i) => (mehr ? 'Window ' + (i + 1) + ' (' + lageWort(e.box) + ')' : 'The window') + (e.vorlage < vorlagenZahl ? ' is image ' + (e.vorlage + 2) : ' is as pasted') + '.').join(' ');
  return 'Photorealistic edit of image 1, a photo of a house. ' + (mehr ? 'The new windows are' : 'The new window is') + ' pasted flat into it as a placement guide. ' +
    'Build ' + (mehr ? 'each one' : 'it') + ' into the wall exactly as pasted, 1:1: same size, proportions, sashes, colours and blind box as its reference. ' + je + ' ' +
    'Match the angle and perspective of the wall: frame set back in the opening, reveals visible, sill below. ' + lichtUndGlas(elemente, mehr) +
    'Old windows there are replaced completely' + (neu ? '; on a closed wall cut a matching opening' : '') + '. Change nothing else in the photo.';
}
const zuBytes = (dataUrl) => { const t = atob(roh(dataUrl)), b = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) b[i] = t.charCodeAt(i); return b; };
/* Breite und Höhe eines JPEG oder PNG ohne Dekodieren (Cloudflare lehnt Bilder ab 512 Pixel ab; etwa von einer alten App-Fassung) */
export function masse(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return [(b[16] << 24 | b[17] << 16 | b[18] << 8 | b[19]) >>> 0, (b[20] << 24 | b[21] << 16 | b[22] << 8 | b[23]) >>> 0];
  for (let i = 2; i + 9 < b.length;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], l = b[i + 2] << 8 | b[i + 3];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b[i + 7] << 8 | b[i + 8], b[i + 5] << 8 | b[i + 6]];
    i += 2 + l;
  }
  return [0, 0];
}
async function cloudflare(env, t) {
  const { elemente, vorlagen } = t, bilder = [t.lage || t.bild].concat(vorlagen.slice(0, 3)).map(zuBytes);
  if (bilder.some((b) => { const [w, h] = masse(b); return !w || !h || w > 511 || h > 511; })) return { ok: false, fehler: 'neu_laden', status: 400 }; // Cloudflare: kleiner als 512
  const f = Array.isArray(t.format) ? t.format.map((x) => Math.max(1, parseInt(x, 10) || 1)) : [1, 1], r = f[0] / f[1];
  const r16 = (x) => Math.max(256, Math.min(1024, Math.round(x / 16) * 16));
  const breite = r >= 1 ? 1024 : r16(1024 * r), hoehe = r >= 1 ? r16(1024 / r) : 1024;
  const form = new FormData();
  form.append('prompt', auftragCf(elemente, Math.min(3, vorlagen.length)));
  bilder.forEach((b, i) => { const png = b[0] === 0x89; form.append('input_image_' + i, new Blob([b], { type: png ? 'image/png' : 'image/jpeg' }), 'bild-' + i + (png ? '.png' : '.jpg')); });
  form.append('width', String(breite));
  form.append('height', String(hoehe));
  const paket = new Response(form);
  let aus;
  try {
    aus = await env.AI.run(CF_MODELL, { multipart: { body: paket.body, contentType: paket.headers.get('content-type') } });
  } catch (e) {
    const t = String((e && e.message) || e);
    console.log('Hausbild Cloudflare: ' + t.slice(0, 200)); // nur die Meldung, keine Bilder, keine IP-Adresse
    if (/nsfw|safety|moderat|flagged|policy/i.test(t)) return { ok: false, fehler: 'abgelehnt', status: 502 };
    /* Tagesfreikontingent von Workers AI aufgebraucht (Plan Workers Free: danach Fehler bis 0 Uhr UTC) oder Last bei Cloudflare */
    if (/capacity|rate.?limit|too many|429|allocation|neurons|4006|upgrade/i.test(t)) return { ok: false, fehler: 'rate_limited', status: 429 };
    return { ok: false, fehler: 'dienst', status: 502 };
  }
  let bild = aus && aus.image;
  if (!bild && aus instanceof ReadableStream) { const b = new Uint8Array(await new Response(aus).arrayBuffer()); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); bild = btoa(s); }
  if (!bild || typeof bild !== 'string') { console.log('Hausbild Cloudflare: kein Bild'); return { ok: false, fehler: 'dienst', status: 502 }; }
  const typ = bild.startsWith('/9j/') ? 'image/jpeg' : bild.startsWith('UklGR') ? 'image/webp' : 'image/png';
  return { ok: true, bild: 'data:' + typ + ';base64,' + bild };
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

const zahl = (v, max) => Math.max(0, Math.min(max, parseInt(v, 10) || 0));
const daten = (x) => { x = x || {}; return { farbe: /^#[0-9a-f]{6}$/i.test(String(x.farbe || '')) ? x.farbe : '', fluegel: zahl(x.fluegel, 6), oberlicht: !!x.oberlicht, sprossen: !!x.sprossen, tuer: !!x.tuer, sonne: ['raffstore', 'rollladen', 'screen', 'klappladen'].indexOf(x.sonne) >= 0 ? x.sonne : '', glas: x.glas === 'ornament' ? 'ornament' : 'klar',
  kasten: ['aufsatz', 'vorbau', 'unterputz'].indexOf(x.kasten) >= 0 ? x.kasten : '', blende: ['fassade', 'alu'].indexOf(x.blende) >= 0 ? x.blende : '', behangFarbe: hex(x.behangFarbe), kastenFarbe: hex(x.kastenFarbe), schienenFarbe: hex(x.schienenFarbe), ladenFarbe: hex(x.ladenFarbe) }; };
const hex = (v) => (/^#[0-9a-f]{6}$/i.test(String(v || '')) ? String(v).toLowerCase() : '');
/* Ein Paket lesen: Ausschnitt (bild und/oder lage), Vorlagen, Elemente, Format; null, wenn etwas fehlt oder nicht passt */
function paketLesen(p, mitBild) {
  if (!p || typeof p !== 'object') return null;
  const vorlagen = Array.isArray(p.vorlagen) ? p.vorlagen.slice(0, 8) : [];
  const elemente = (Array.isArray(p.elemente) ? p.elemente : []).slice(0, 8).map((e) => ({ box: box(e && e.box), vorlage: Math.max(0, Math.min(vorlagen.length - 1, parseInt(e && e.vorlage, 10) || 0)), art: e && e.art === 'neu' ? 'neu' : 'ersetzen', daten: daten(e && e.daten) }));
  if ((mitBild ? !bildOk(p.bild) : !bildOk(p.lage)) || !vorlagen.length || !vorlagen.every(bildOk) || !elemente.length || elemente.some((e) => !e.box)) return null;
  return { bild: bildOk(p.bild) ? p.bild : null, lage: bildOk(p.lage) ? p.lage : null, vorlagen: vorlagen, elemente: elemente, format: p.format };
}
/* höchstens drei Aufträge gleichzeitig an Workers AI */
async function nacheinander(liste, fn, n) {
  const aus = new Array(liste.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, liste.length) }, async () => { while (i < liste.length) { const j = i++; aus[j] = await fn(liste[j]); } }));
  return aus;
}
/* POST /api/hausbild. Cloudflare: { teile: [{ lage, vorlagen, elemente, format }], einwilligung } mit je einem Fenster je Teil (so hält
   sich FLUX.2 [klein] an Flügel und Farbe, Vergleich 2.11.2026) → { ok, bilder: [data-URL | null] }. Black Forest Labs (aus): ein Paket
   { bild, lage, vorlagen, elemente } → { ok, warten }. */
export async function onRequestPost({ request, env }) {
  const weg = hausbildWeg(env);
  if (!weg) return antwort({ ok: false, fehler: 'nicht_eingerichtet' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return antwort({ ok: false, fehler: 'forbidden' }, 403);
  const q = quelle(request);
  if (!erlaubt('hausbild:' + q, 10, 10 * 60 * 1000)) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  let d; try { d = await request.json(); } catch (e) { return antwort({ ok: false, fehler: 'bad_request' }, 400); }
  const teile = Array.isArray(d && d.teile) ? d.teile.slice(0, 9).map((t) => paketLesen(t, false)) : null, eins = teile ? null : paketLesen(d, true);
  if (teile ? !teile.length || teile.length > 8 || teile.some((t) => !t) : !eins) return antwort({ ok: false, fehler: 'bad_request' }, 400);
  if (!d || d.einwilligung !== EINW_STAND) return antwort({ ok: false, fehler: 'einwilligung' }, 400);
  /* Tagesgrenzen: je Anschluss als gekürzter Prüfwert mit Geheimnis (keine IP-Adresse in der Datenbank, nach zwei Tagen gelöscht:
     eingang.js) und über alle Kunden (Datenbank, sonst Arbeitsspeicher); eine Vorschau zählt einmal, gleich wie viele Fenster */
  const ctx = { env: env, sp: null }; let k = {}; try { k = konfig(env); ctx.sp = speicher(k); } catch (e) { /* ohne Datenbank */ }
  /* Vorgaben seit 4.11.2026 (Funnel-Konzept docs/konzepte/2026-11-03-conversion-funnel.md, Fahrplan Punkt 1): 150 am Tag über alle Kunden
     (vorher 500), 25 je Anschluss und Tag (vorher 12; je Gerät 5 frei, 15 mit Konto, 25 mit gekauftem Aufmaßblatt, 50 auf dem kostenlosen Weg, die sich über Tage verteilen); die Variable HAUSBILD_TAG_MAX bei Cloudflare geht vor */
  const max = Math.max(1, parseInt(env.HAUSBILD_TAG_MAX, 10) || 150);
  if (!(await budget(ctx, 'hbanschluss:' + (await pruefwert(k, q)), 25)).ok || !(await budget(ctx, 'hausbild:tag', max)).ok) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'tag' }, 429);
  if (teile) {
    if (weg === 'attrappe') return antwort({ ok: true, bilder: teile.map((t) => t.lage), attrappe: true, kosten: 0 }); // lokal: die eingesetzten Fenster
    if (weg !== 'cloudflare') return antwort({ ok: false, fehler: 'bad_request' }, 400);
    const erg = await nacheinander(teile, (t) => cloudflare(env, t), 3);
    if (erg.every((e) => !e.ok)) return antwort({ ok: false, fehler: erg[0].fehler }, erg[0].status);
    return antwort({ ok: true, bilder: erg.map((e) => (e.ok ? e.bild : null)), kosten: null });
  }
  if (weg === 'attrappe') return antwort({ ok: true, bild: eins.lage || eins.bild, attrappe: true, kosten: 0 }); // lokal: das Bild mit den eingesetzten Fenstern
  if (weg === 'cloudflare') { const e = await cloudflare(env, eins); return e.ok ? antwort({ ok: true, bild: e.bild, kosten: null }) : antwort({ ok: false, fehler: e.fehler }, e.status); }
  const { elemente, vorlagen } = eins;
  const modell = /^flux-3-image(-klein)?$/.test(String(env.HAUSBILD_MODELL || '')) ? env.HAUSBILD_MODELL : MODELL;
  const nutzlast = { prompt: auftrag(elemente), images: [roh(eins.bild)].concat(vorlagen.map(roh)), resolution: '1k', output_format: 'jpeg' };
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
  if (!hausbildFrei(env)) return antwort({ ok: false, fehler: 'nicht_eingerichtet' }, 503);
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

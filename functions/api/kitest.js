/* eeziframes · KI-Test in der Zentrale (vorübergehend, Wunsch des Inhabers 2.11.2026): Rechnet das Beispielhaus des Inhabers mit
   FLUX.2 klein über Cloudflare Workers AI, damit er die echten Ergebnisse von Cloudflare neben „An meinem Haus ansehen“ (FLUX 3 bei
   Black Forest Labs) sieht. Oberfläche: /zentrale/ki-test/ (web/zentrale/ki-test/). Nur nach der Anmeldung in der Zentrale (Sitzung „inhaber“),
   nur mit den festen Testbildern aus web/zentrale/ki-test/, keine Kundenfotos. Nach dem Test wieder entfernen (diese Datei, die Zeile in
   router.js, den Ordner web/zentrale/ki-test/ und "ai" in wrangler.jsonc). Vergleich: docs/profis/2026-11-02-hausbild.md. */
import { ApiFehler, erlaubt } from './umgebung.js';
import { sitzungPflicht } from './sitzung.js';

const MODELLE = { '9b': '@cf/black-forest-labs/flux-2-klein-9b', '4b': '@cf/black-forest-labs/flux-2-klein-4b' };
const EINBAU = 'installed by a professional window fitter: each frame is set back inside its masonry opening, recessed behind the facade surface, ' +
  'so the plastered reveals stay visible on the sides and on top, seen in exactly the perspective, angle and vanishing lines of this wall and this camera. ' +
  'Below each window a window sill with a small overhang. Soft shadows of the lintel and the reveals fall onto the frame and the glass, following the direction of the sunlight in the photo. ' +
  'The glass reflects the real sky and surroundings of this photo; the frames have the same light, colour temperature, sharpness and noise as the rest of the image. ' +
  'Keep the design of each window exactly as in its reference: anthracite frame colour, number and division of sashes. ';
const REST = 'Every other opening stays exactly as it is, even if it is empty. Do not change anything else: facade, roof, plants, porch and sky stay exactly as they are.';
const AUFTRAG = {
  markiert: { haus: 'ein-markiert.jpg', text: 'Photorealistic architectural edit of image 1, a photo of a house. Replace the content inside the red frame with the two-sash window shown in image 2, ' +
    'and the content inside the blue frame with the single-sash window shown in image 3, ' + EINBAU + 'Remove the red and blue frames completely. ' + REST },
  montage: { haus: 'ein-montage.jpg', text: 'Photorealistic architectural edit of this photo of a house. Two new anthracite windows were roughly pasted flat into the masonry openings (upper right and lower left). ' +
    'Make them look really built in, ' + EINBAU + 'The empty opening at the upper left stays empty. ' + REST }
};

async function bild(ctx, name) {
  const r = await ctx.env.ASSETS.fetch(new Request(new URL('/zentrale/ki-test/' + name, ctx.url.origin)));
  if (!r.ok) throw new ApiFehler('Testbild fehlt: ' + name, 500);
  return new Blob([await r.arrayBuffer()], { type: 'image/jpeg' });
}
const base64 = (buf) => { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };

export const KI_TEST = {
  'POST /api/zentrale/ki-test': async (ctx) => {
    await sitzungPflicht(ctx, 'inhaber'); // dieselbe Anmeldung wie die Zentrale unter /zentrale/ (functions/auftrag/index.js)
    if (!ctx.env || !ctx.env.AI) throw new ApiFehler('Workers AI ist nicht verbunden („ai“ in wrangler.jsonc).', 503);
    if (!erlaubt('kitest', 30, 3600 * 1000)) throw new ApiFehler('Genug Tests für diese Stunde.', 429);
    const b = ctx.body || {}, modell = MODELLE[b.modell], auftrag = AUFTRAG[b.art];
    if (!modell || !auftrag) throw new ApiFehler('Unbekannter Test.', 400);
    const form = new FormData();
    form.append('prompt', auftrag.text);
    form.append('input_image_0', await bild(ctx, auftrag.haus), 'haus.jpg');
    form.append('input_image_1', await bild(ctx, 'ein-fenster-1.jpg'), 'fenster-1.jpg');
    form.append('input_image_2', await bild(ctx, 'ein-fenster-2.jpg'), 'fenster-2.jpg');
    form.append('width', '1024');
    form.append('height', '1024');
    const paket = new Response(form), t0 = Date.now();
    let aus;
    try {
      aus = await ctx.env.AI.run(modell, { multipart: { body: paket.body, contentType: paket.headers.get('content-type') } });
    } catch (e) {
      throw new ApiFehler('Cloudflare meldet: ' + String((e && e.message) || e).slice(0, 300), 502);
    }
    let roh = aus && aus.image;
    if (!roh && aus instanceof ReadableStream) roh = base64(await new Response(aus).arrayBuffer());
    if (!roh && aus instanceof ArrayBuffer) roh = base64(aus);
    if (!roh) throw new ApiFehler('Cloudflare hat kein Bild geliefert: ' + JSON.stringify(aus || null).slice(0, 300), 502);
    const typ = roh.startsWith('/9j/') ? 'image/jpeg' : roh.startsWith('UklGR') ? 'image/webp' : 'image/png';
    return { ok: true, modell: modell, art: b.art, sekunden: Math.round((Date.now() - t0) / 100) / 10, bild: 'data:' + typ + ';base64,' + roh };
  }
};

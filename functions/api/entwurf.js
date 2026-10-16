/* eeziframes · Zwischenstand eines Kundenlinks auf dem Server
   Der Kunde kommt über den Link seines Fensterbauers jederzeit zurück, auch auf einem anderen Gerät oder nachdem der Browser seinen
   Speicher geleert hat, und sieht seine Fenster. Gespeichert werden Fenster und Angaben zum Haus wie in der App, ohne Fotos und ohne
   das Bild der eingezeichneten Lage (die bleiben auf dem Gerät).
   Zugleich hält der Server die Zähler gegen Mehrfachnutzung, die ein geleerter Browserspeicher nicht zurücksetzt:
   - höchstens 50 angelegte Fenster je Aufmaß, gelöschte zählen mit (meta.angelegt, meta.fenster je Kennung)
   - je Fenster das erste Speichern (t0) und die Änderungen nach der ersten Woche (aend); nach vier solchen Änderungen ist das Fenster
     fest. Ändert sich ein Fenster nach der ersten Woche, ohne dass der Browser mitgezählt hat, zählt der Server selbst; ein festes
     Fenster behält seine alte Fassung.
   Zähler gehen nur nach oben (t0 nur nach vorne); der Browser übernimmt, was der Server zurückgibt.
   Zwei Geräte: Der neuere Stand gewinnt (stand = letzte Änderung im Browser), aber nichts geht verloren, was das andere Gerät nie
   gesehen hat: Ist der Browser neuer, bleiben Fenster stehen, die er nie hatte (bekannt = Kennungen, die er je hatte), also anderswo
   angelegt wurden; ist er älter, kommen seine Fenster dazu, die der Server noch nie gesehen hat. In beiden Fällen bekommt der Browser
   den zusammengeführten Stand zurück.
   Zu ist der Zwischenstand, wenn der Link abgelaufen, deaktiviert oder schon eingegangen ist (außer bei offener Nachbesserung).
   Bremsen: je Anschluss 240 Anfragen und 30 unbekannte Codes in 10 Minuten (umgebung.js). */
import '../../web/assets/modell.js';
import { ApiFehler, linkBremse, linkUnbekannt } from './umgebung.js';

const X = () => globalThis.Abrechnung;
export const GRENZEN = { fenster: 50, freiTage: 7, aenderungen: 4 };
const TAG = 864e5, MAX_JSON = 400000;
const LINK_RUHT = 'Dieser Link ist zurzeit nicht aktiv. Bitte beim Fensterbauer nachfragen.';

/* Fingerabdruck eines Fensters: alle Angaben in fester Reihenfolge, ohne Zähler und ohne das abgeleitete Bild der Lage
   (gleiche Regel wie fensterFp in web/assets/app.js) */
const stabil = (v) => (Array.isArray(v) ? '[' + v.map(stabil).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + stabil(v[k])).join(',') + '}' : JSON.stringify(v === undefined ? null : v));
export function fensterFp(w) {
  const o = Object.assign({}, w); delete o.wid; delete o.t0; delete o.aend;
  if (o.plan && typeof o.plan === 'object') { o.plan = Object.assign({}, o.plan); delete o.plan.bild; delete o.plan.bw; delete o.plan.bh; }
  return stabil(o);
}
const ohneBild = (w) => { const o = Object.assign({}, w); if (o.plan && typeof o.plan === 'object' && o.plan.bild) o.plan = Object.assign({}, o.plan, { bild: '' }); return o; };
const kennung = (w) => String((w && w.wid) || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);

export function grenzText() { return 'Ein Aufmaß umfasst höchstens ' + GRENZEN.fenster + ' Fenster, gelöschte zählen mit. Für ein weiteres Haus schickt dir dein Fensterbauer gern einen eigenen Link.'; }
export function zuText(zu, betriebName) {
  const bn = betriebName || 'deinem Fensterbauer';
  if (zu === 'abgelaufen') return 'Dieser Link ist abgelaufen. Bitte melde dich bei ' + bn + ', der Link lässt sich verlängern.';
  if (zu === 'deaktiviert') return 'Dieser Link wurde deaktiviert. Bitte melde dich bei ' + bn + '.';
  if (zu === 'eingegangen') return 'Dein Aufmaß ist schon bei ' + bn + '. Änderungen bitte direkt mit ' + bn + ' klären.';
  return 'Diesen Link gibt es nicht.';
}
/* Link zum Code finden; unbekannte Codes zählen für die Bremse */
export async function linkFinden(ctx) {
  linkBremse(ctx.request);
  const code = String(ctx.params.code || '').trim().toLowerCase();
  if (!/^[a-z0-9]{3,12}$/.test(code)) throw linkUnbekannt(ctx.request, 'Kein gültiger Link.');
  const row = await ctx.sp.betriebNachCode(code); if (!row) throw linkUnbekannt(ctx.request);
  const v = row.daten && row.daten.verwaltung; if (v && v.sperre) throw new ApiFehler(LINK_RUHT, 404);
  const l = (row.daten.links || []).find((x) => x.code === code); if (!l) throw linkUnbekannt(ctx.request);
  return { row: row, l: l, code: code };
}
/* Was der Browser von den Zählern sieht */
const metaSicht = (m) => { m = m || {}; const f = {}; Object.keys(m.fenster || {}).forEach((k) => { f[k] = { t0: m.fenster[k].t0, aend: m.fenster[k].aend || 0 }; }); return { angelegt: m.angelegt || 0, fenster: f }; };
/* Zähler zusammenführen: bekannte Fenster behalten das früheste erste Speichern und die meisten Änderungen; neue kommen dazu */
export function metaMischen(alt, fenster, angelegtBrowser, jetzt) {
  const m = { angelegt: Number(alt.angelegt) || 0, fenster: Object.assign({}, alt.fenster || {}), gesendet: alt.gesendet || 0 };
  fenster.forEach((w) => {
    const id = kennung(w); if (!id) return;
    const t0b = Number(w.t0) > 0 && Number(w.t0) <= jetzt + TAG ? Number(w.t0) : jetzt, vorher = m.fenster[id];
    m.fenster[id] = { t0: vorher ? Math.min(Number(vorher.t0) || jetzt, t0b) : Math.min(t0b, jetzt), aend: Math.max(vorher ? Number(vorher.aend) || 0 : 0, Math.min(99, Math.max(0, Number(w.aend) || 0))) };
  });
  m.angelegt = Math.max(m.angelegt, Math.min(999, Math.max(0, Number(angelegtBrowser) || 0)), Object.keys(m.fenster).length);
  m.aktuell = fenster.length;
  return m;
}
/* Änderungen nach der ersten Woche: hat der Browser nicht mitgezählt, zählt der Server; ein festes Fenster behält die alte Fassung */
export function aenderungenPruefen(alteFenster, neueFenster, metaAlt, jetzt) {
  const alt = new Map((alteFenster || []).filter((w) => kennung(w)).map((w) => [kennung(w), w])), zurueck = [];
  const out = neueFenster.map((w) => {
    const id = kennung(w), vorher = id ? alt.get(id) : null, m = id ? (metaAlt.fenster || {})[id] : null;
    if (!vorher || !m || jetzt - (Number(m.t0) || jetzt) < GRENZEN.freiTage * TAG || fensterFp(vorher) === fensterFp(w)) return w;
    const n = Number(m.aend) || 0;
    if (n >= GRENZEN.aenderungen) { zurueck.push(id); return Object.assign({}, vorher, { aend: n }); }
    return (Number(w.aend) || 0) > n ? w : Object.assign({}, w, { aend: n + 1 });
  });
  return { fenster: out, zurueck: zurueck };
}

export const ENTWURF = {
  'GET /api/link/:code/entwurf': async (ctx) => {
    const { row, l, code } = await linkFinden(ctx);
    const e = await ctx.sp.entwurfHolen(code), zu = X().linkZu(l);
    if (e === undefined) return { ok: true, aus: true, entwurf: null, meta: null, zu: zu, expires: l.expires || '', grenzen: GRENZEN };
    return { ok: true, entwurf: e ? { windows: (e.daten || {}).windows || [], proj: (e.daten || {}).proj || null, stand: Number(e.stand) || 0 } : null, meta: e ? metaSicht(e.meta) : null, zu: zu, zuText: zu ? zuText(zu, row.name) : '', expires: l.expires || '', grenzen: GRENZEN };
  },
  'POST /api/link/:code/entwurf': async (ctx) => {
    const { row, l, code } = await linkFinden(ctx);
    const zu = X().linkZu(l); if (zu) throw new ApiFehler(zuText(zu, row.name), 410, { zu: zu });
    const b = ctx.body || {}; if (!Array.isArray(b.windows)) throw new ApiFehler('Kein Zwischenstand im Versand.');
    if (b.windows.length > GRENZEN.fenster) throw new ApiFehler(grenzText(), 409, { grenze: true });
    const eingang = b.windows.filter((w) => w && typeof w === 'object' && !Array.isArray(w)).map(ohneBild), proj = b.proj && typeof b.proj === 'object' && !Array.isArray(b.proj) ? b.proj : {};
    if (JSON.stringify({ windows: eingang, proj: proj }).length > MAX_JSON) throw new ApiFehler('Der Zwischenstand ist zu groß.', 413);
    const jetzt = Date.now(), stand = Math.max(0, Math.min(jetzt + TAG, Number(b.stand) || 0));
    const bekannt = new Set((Array.isArray(b.bekannt) ? b.bekannt : []).map((x) => String(x).slice(0, 40)));
    let grenze = false, zurueck = [], zusammen = false;
    const res = await ctx.sp.entwurfAendern(code, row.id, (r) => {
      const metaAlt = r.meta || {}, alt = Array.isArray((r.daten || {}).windows) ? r.daten.windows : [], hierNeuer = stand >= (Number(r.stand) || 0);
      let fenster;
      if (hierNeuer) {
        const p = aenderungenPruefen(alt, eingang, metaAlt, jetzt), da = new Set(p.fenster.map(kennung));
        const fremd = alt.filter((w) => kennung(w) && !da.has(kennung(w)) && !bekannt.has(kennung(w))); // anderswo angelegt, hier nie gesehen
        fenster = p.fenster.concat(fremd); zurueck = p.zurueck; zusammen = fremd.length > 0;
      } else {
        const neu = eingang.filter((w) => kennung(w) && !(metaAlt.fenster || {})[kennung(w)] && !alt.some((x) => kennung(x) === kennung(w)));
        fenster = alt.concat(neu); zusammen = true; // der neuere Stand bleibt, Fenster, die der Server nie gesehen hat, kommen dazu
      }
      const meta = metaMischen(metaAlt, fenster, b.angelegt, jetzt);
      if (meta.angelegt > GRENZEN.fenster || fenster.length > GRENZEN.fenster) { grenze = true; return false; }
      r.meta = meta; r.daten = { windows: fenster, proj: hierNeuer ? proj : (r.daten || {}).proj || proj }; if (hierNeuer) r.stand = stand;
      return true;
    });
    if (res && res.fehlt) return { ok: true, aus: true };
    if (grenze) throw new ApiFehler(grenzText(), 409, { grenze: true });
    const e = res.row || {}, neuer = zusammen || (Number(e.stand) || 0) > stand || zurueck.length > 0;
    return { ok: true, stand: Number(e.stand) || 0, meta: metaSicht(e.meta), zurueck: zurueck, entwurf: neuer ? { windows: (e.daten || {}).windows || [], proj: (e.daten || {}).proj || null, stand: Number(e.stand) || 0 } : null };
  }
};

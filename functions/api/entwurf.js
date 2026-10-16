/* eeziframes · Zwischenstand eines Kundenlinks auf dem Server
   Der Kunde kommt über den Link seines Fensterbauers jederzeit zurück, auch auf einem anderen Gerät oder nachdem der Browser seinen
   Speicher geleert hat, und sieht seine Fenster. Gespeichert werden Fenster und Angaben zum Haus wie in der App, ohne Fotos und ohne
   das Bild der eingezeichneten Lage (die bleiben auf dem Gerät).
   Zugleich hält der Server die Zähler gegen Mehrfachnutzung, die ein geleerter Browserspeicher nicht zurücksetzt:
   - höchstens 50 angelegte Fenster je Aufmaß, gelöschte zählen mit (meta.angelegt, meta.fenster je Kennung)
   - je Fenster das erste Speichern (t0) und die Änderungen nach der ersten Woche (aend); nach vier solchen Änderungen ist das Fenster
     fest. Ändert sich ein Fenster nach der ersten Woche, ohne dass der Browser mitgezählt hat, zählt der Server selbst; ein festes
     Fenster behält seine alte Fassung. Während einer offenen Nachbesserung ändert der Kunde frei, darum hat der Betrieb gebeten.
   Zähler gehen nur nach oben (t0 nur nach vorne); der Browser übernimmt, was der Server zurückgibt.
   Zwei Geräte: zusammengeführt wird je Fenster (Kennung). Gibt es ein Fenster auf beiden Seiten, gewinnt das zuletzt gespeicherte (ts,
   bei Gleichstand der neuere Zwischenstand); ein Gerät mit altem Stand überschreibt also nichts, was ein anderes später geändert hat.
   Fenster, die der Server nie gesehen hat, kommen dazu; Fenster, die das Gerät nie hatte (bekannt = Kennungen, die es je hatte),
   bleiben stehen; was das Gerät kannte und nicht mehr schickt, hat es gelöscht. Die Angaben zum Haus: der neuere Zwischenstand.
   Weicht das Ergebnis vom Gerät ab, bekommt es den zusammengeführten Stand zurück.
   Hat das Aufräumen den Inhalt geleert (30 Tage nach Ablauf oder Deaktivierung, zentrale.js), bleiben die Zähler; verlängert der
   Betrieb den Link, darf ein Gerät die damals vorhandenen Fenster wiederherstellen (meta.geleertIds), bis es sie geschickt oder
   gelöscht hat.
   Zu (abgelaufen, deaktiviert, schon eingegangen ohne offene Nachbesserung): kein Inhalt mehr, keine Änderungen. Ältere Links mit
   fünfstelligem Code bekommen keinen Zwischenstand (zu leicht zu erraten); dort speichert die App nur im Browser.
   Bremsen: je Anschluss 240 Anfragen und 30 unbekannte Codes in 10 Minuten (umgebung.js). */
import '../../web/assets/modell.js';
import { ApiFehler, linkBremse, linkUnbekannt } from './umgebung.js';

const X = () => globalThis.Abrechnung;
export const GRENZEN = { fenster: 50, freiTage: 7, aenderungen: 4 };
const TAG = 864e5, MAX_JSON = 400000;
const LINK_RUHT = 'Dieser Link ist zurzeit nicht aktiv. Bitte beim Fensterbauer nachfragen.';
/* Zwischenstand nur für Links mit langem Code (seit Oktober 2026 zehn Zeichen) */
export const langerCode = (code) => String(code || '').length >= 10;

/* Fingerabdruck eines Fensters: alle Angaben in fester Reihenfolge, ohne Zähler und ohne das abgeleitete Bild der Lage
   (gleiche Regel wie fensterFp in web/assets/app.js) */
const stabil = (v) => (Array.isArray(v) ? '[' + v.map(stabil).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + stabil(v[k])).join(',') + '}' : JSON.stringify(v === undefined ? null : v));
export function fensterFp(w) {
  const o = Object.assign({}, w); delete o.wid; delete o.t0; delete o.aend; delete o.ts;
  if (o.plan && typeof o.plan === 'object') { o.plan = Object.assign({}, o.plan); delete o.plan.bild; delete o.plan.bw; delete o.plan.bh; }
  return stabil(o);
}
export const ohneBild = (w) => { const o = Object.assign({}, w); if (o.plan && typeof o.plan === 'object' && o.plan.bild) o.plan = Object.assign({}, o.plan, { bild: '' }); return o; };
export const kennung = (w) => String((w && w.wid) || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);

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
  const m = Object.assign({}, alt, { angelegt: Number(alt.angelegt) || 0, fenster: Object.assign({}, alt.fenster || {}) });
  fenster.forEach((w) => {
    const id = kennung(w); if (!id) return;
    const t0b = Number(w.t0) > 0 && Number(w.t0) <= jetzt + TAG ? Number(w.t0) : jetzt, vorher = m.fenster[id];
    m.fenster[id] = { t0: vorher ? Math.min(Number(vorher.t0) || jetzt, t0b) : Math.min(t0b, jetzt), aend: Math.max(vorher ? Number(vorher.aend) || 0 : 0, Math.min(99, Math.max(0, Number(w.aend) || 0))) };
  });
  m.angelegt = Math.max(m.angelegt, Math.min(999, Math.max(0, Number(angelegtBrowser) || 0)), Object.keys(m.fenster).length);
  m.aktuell = fenster.length;
  return m;
}
/* Je Fenster zusammenführen (Regeln oben). frei: offene Nachbesserung, dann zählt und sperrt nichts. wieder: Kennungen, die nach
   dem Leeren wiederhergestellt werden dürfen.
   Rückgabe: fenster (Ergebnis), zurueck (feste Fenster, deren Änderung nicht übernommen wurde), anders (Ergebnis weicht vom Gerät ab) */
export function zusammenfuehren(alt, eingang, metaAlt, bekannt, hierNeuer, jetzt, frei, wieder) {
  const altMap = new Map((alt || []).filter((w) => kennung(w)).map((w) => [kennung(w), w])), kennt = metaAlt.fenster || {}, zurueck = [], out = [];
  let anders = false;
  eingang.forEach((w) => {
    const id = kennung(w);
    if (!id) { out.push(w); return; }
    const vorher = altMap.get(id);
    if (!vorher) { if (kennt[id] && !(wieder && wieder.has(id))) { anders = true; return; } out.push(w); return; } // anderswo gelöscht bleibt gelöscht, Neues und Wiederhergestelltes kommt dazu
    altMap.delete(id);
    const tsG = Number(w.ts) || 0, tsS = Number(vorher.ts) || 0;
    if (!(tsG > tsS || (tsG === tsS && hierNeuer))) { if (fensterFp(vorher) !== fensterFp(w)) anders = true; out.push(vorher); return; } // später anderswo gespeichert
    if (fensterFp(vorher) === fensterFp(w)) { out.push(w); return; }
    const m = kennt[id];
    if (!frei && m && jetzt - (Number(m.t0) || jetzt) >= GRENZEN.freiTage * TAG) {
      const n = Number(m.aend) || 0;
      if (n >= GRENZEN.aenderungen) { zurueck.push(id); anders = true; out.push(Object.assign({}, vorher, { aend: n })); return; }
      out.push((Number(w.aend) || 0) > n ? w : Object.assign({}, w, { aend: n + 1 })); return; // hat der Browser nicht mitgezählt, zählt der Server
    }
    out.push(w);
  });
  altMap.forEach((w, id) => { if (bekannt.has(id)) return; out.push(w); anders = true; }); // anderswo angelegt, dieses Gerät kannte es nie
  return { fenster: out, zurueck: zurueck, anders: anders };
}

export const ENTWURF = {
  'GET /api/link/:code/entwurf': async (ctx) => {
    const { row, l, code } = await linkFinden(ctx);
    const zu = X().linkZu(l), basis = { ok: true, zu: zu, zuText: zu ? zuText(zu, row.name) : '', expires: l.expires || '', grenzen: GRENZEN };
    if (!langerCode(code)) return Object.assign(basis, { aus: true, entwurf: null, meta: null });
    /* Zu: kein Inhalt mehr, wer den Link hat (der Betrieb kann ihn deaktiviert haben, weil er an die falsche Person ging) */
    if (zu) return Object.assign(basis, { entwurf: null, meta: null });
    const e = await ctx.sp.entwurfHolen(code);
    if (e === undefined) return Object.assign(basis, { aus: true, entwurf: null, meta: null });
    return Object.assign(basis, { entwurf: e ? { windows: (e.daten || {}).windows || [], proj: (e.daten || {}).proj || null, stand: Number(e.stand) || 0, geleert: !!(e.meta && e.meta.geleert) } : null, meta: e ? metaSicht(e.meta) : null });
  },
  'POST /api/link/:code/entwurf': async (ctx) => {
    const { row, l, code } = await linkFinden(ctx);
    if (!langerCode(code)) return { ok: true, aus: true };
    const zu = X().linkZu(l); if (zu) throw new ApiFehler(zuText(zu, row.name), 410, { zu: zu });
    const b = ctx.body || {}; if (!Array.isArray(b.windows)) throw new ApiFehler('Kein Zwischenstand im Versand.');
    if (b.windows.length > GRENZEN.fenster) throw new ApiFehler(grenzText(), 409, { grenze: true });
    const eingang = b.windows.filter((w) => w && typeof w === 'object' && !Array.isArray(w)).map(ohneBild), proj = b.proj && typeof b.proj === 'object' && !Array.isArray(b.proj) ? b.proj : {};
    if (JSON.stringify({ windows: eingang, proj: proj }).length > MAX_JSON) throw new ApiFehler('Der Zwischenstand ist zu groß.', 413);
    const jetzt = Date.now(), stand = Math.max(0, Math.min(jetzt + TAG, Number(b.stand) || 0)), frei = !!(l.nb && l.nb.offen);
    const bekannt = new Set((Array.isArray(b.bekannt) ? b.bekannt : []).slice(0, 500).map((x) => String(x).slice(0, 40)));
    let grenze = false, zurueck = [], anders = false, hierNeuer = true;
    const res = await ctx.sp.entwurfAendern(code, row.id, (r) => {
      const metaAlt = r.meta || {}, alt = Array.isArray((r.daten || {}).windows) ? r.daten.windows : [];
      hierNeuer = stand >= (Number(r.stand) || 0);
      const wieder = new Set(metaAlt.geleert && Array.isArray(metaAlt.geleertIds) ? metaAlt.geleertIds : []);
      const z = zusammenfuehren(alt, eingang, metaAlt, bekannt, hierNeuer, jetzt, frei, wieder), meta = metaMischen(metaAlt, z.fenster, b.angelegt, jetzt);
      if (meta.angelegt > GRENZEN.fenster || z.fenster.length > GRENZEN.fenster) { grenze = true; return false; }
      if (metaAlt.geleert) { // wiederhergestellt oder auf diesem Gerät gelöscht: erledigt; was das Gerät nie hatte, darf ein anderes noch bringen
        const geschickt = new Set(eingang.map(kennung)), rest = Array.from(wieder).filter((id) => !geschickt.has(id) && !bekannt.has(id));
        if (rest.length) meta.geleertIds = rest; else { delete meta.geleert; delete meta.geleertIds; }
      }
      zurueck = z.zurueck; anders = z.anders;
      r.meta = meta; r.daten = { windows: z.fenster, proj: hierNeuer ? proj : (r.daten || {}).proj || proj }; r.stand = Math.max(Number(r.stand) || 0, stand);
      return true;
    });
    if (res && res.fehlt) return { ok: true, aus: true };
    if (grenze) throw new ApiFehler(grenzText(), 409, { grenze: true });
    const e = res.row || {}, zurueckGeben = anders || !hierNeuer || zurueck.length > 0;
    return { ok: true, stand: Number(e.stand) || 0, meta: metaSicht(e.meta), zurueck: zurueck, entwurf: zurueckGeben ? { windows: (e.daten || {}).windows || [], proj: (e.daten || {}).proj || null, stand: Number(e.stand) || 0 } : null };
  }
};

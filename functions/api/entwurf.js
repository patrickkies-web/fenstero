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
   Zwei Geräte: zusammengeführt wird je Fenster (Kennung). Gibt es ein Fenster auf beiden Seiten, gewinnt das zuletzt gespeicherte (ts;
   ohne Zeitpunkt auf beiden Seiten, also aus der Zeit davor, bleibt die Fassung des Servers); ein Gerät mit altem Stand überschreibt
   also nichts, was ein anderes später geändert hat. Fenster, die der Server nie gesehen hat, kommen dazu. Gelöscht wird mit Zeitpunkt
   (geloescht = Kennung → wann auf dem Gerät gelöscht): Ein Fenster, das anderswo danach noch gespeichert wurde, bleibt; umgekehrt
   kommt ein anderswo gelöschtes Fenster zurück, wenn ein Gerät es nach dem Löschen noch geändert hat (meta.geloescht), und zählt dann
   als Änderung. Fenster, die das Gerät nie hatte, bleiben stehen. Die Angaben zum Haus haben ihren eigenen Zeitpunkt (projTs), das
   zuletzt geänderte gewinnt; leere Angaben (nach dem Aufräumen) überschreiben nie welche vom Gerät.
   Zeitpunkte kommen von der Uhr des Geräts; die App gleicht sie mit der Zeit des Servers ab (jetzt in jeder Antwort), und der Server
   begrenzt sie auf seine Zeit plus fünf Minuten, damit eine vorgehende Uhr kein Fenster sperrt. Weicht das Ergebnis vom Gerät ab, bekommt es den zusammengeführten Stand zurück. Fenster ohne Kennung nimmt
   der Server nicht an (sie liefen an den Zählern vorbei).
   Hat das Aufräumen den Inhalt geleert (30 Tage nach Ablauf oder Deaktivierung, zentrale.js), bleiben die Zähler; verlängert der
   Betrieb den Link, darf ein Gerät die damals vorhandenen Fenster wiederherstellen (meta.geleertIds), bis es sie geschickt oder
   gelöscht hat.
   Zu (abgelaufen, deaktiviert, schon eingegangen ohne offene Nachbesserung): kein Inhalt mehr, keine Änderungen; die Antwort nennt
   Grund, Runde und Eingang, damit die App „schon erledigt“ richtig zeigt und eine spätere Nachbesserung erkennt. Ältere Links mit
   fünfstelligem Code bekommen keinen Zwischenstand (zu leicht zu erraten); dort speichert die App nur im Browser.
   Bremsen: je Anschluss 240 Anfragen und 30 unbekannte Codes in 10 Minuten (umgebung.js). */
import '../../web/assets/modell.js';
import { ApiFehler, linkBremse, linkUnbekannt } from './umgebung.js';

const X = () => globalThis.Abrechnung;
export const GRENZEN = { fenster: 50, freiTage: 7, aenderungen: 4 };
const TAG = 864e5, MAX_JSON = 400000;
/* Zeitpunkte von der Uhr des Geräts: höchstens fünf Minuten nach der Zeit des Servers */
export const TOLERANZ = 5 * 60 * 1000;
export const zeitKappen = (t, jetzt) => Math.max(0, Math.min((jetzt || Date.now()) + TOLERANZ, Number(t) || 0));
/* Die n neuesten Einträge eines Objekts Kennung → Zeitpunkt */
export const neueste = (o, n) => Object.fromEntries(Object.entries(o || {}).filter((e) => e[0] && Number(e[1]) > 0).sort((a, b) => b[1] - a[1]).slice(0, n));
const LINK_RUHT = 'Dieser Link ist zurzeit nicht aktiv. Bitte beim Fensterbauer nachfragen.';
/* Zwischenstand nur für Links mit langem Code (seit Oktober 2026 zehn Zeichen) */
export const langerCode = (code) => String(code || '').length >= 10;

/* Fingerabdruck eines Fensters: alle Angaben in fester Reihenfolge, ohne Zähler und ohne das abgeleitete Bild der Lage
   (gleiche Regel wie fensterFp in web/assets/app.js) */
export const stabil = (v) => (Array.isArray(v) ? '[' + v.map(stabil).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => JSON.stringify(k) + ':' + stabil(v[k])).join(',') + '}' : JSON.stringify(v === undefined ? null : v));
export function fensterFp(w) {
  const o = Object.assign({}, w); delete o.wid; delete o.t0; delete o.aend; delete o.ts;
  if (o.plan && typeof o.plan === 'object') { o.plan = Object.assign({}, o.plan); delete o.plan.bild; delete o.plan.bw; delete o.plan.bh; }
  return stabil(o);
}
/* Für die Zählung der Änderungen: ohne die Auswertung der Fotos und die Zahl der Fotos (gleiche Regel wie aenderungFp in app.js).
   Eine Auswertung, die nach dem Speichern ankommt, oder ein neues Foto ist keine Änderung des Kunden */
export function aenderungFp(w) { const o = Object.assign({}, w); delete o.ki; delete o.fotos; return fensterFp(o); }
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
/* Was der Browser vom Zwischenstand und von den Zählern sieht */
export const entwurfSicht = (e) => { const d = e.daten || {}; return { windows: d.windows || [], proj: d.proj || null, projTs: Number(d.projTs) || 0, stand: Number(e.stand) || 0, geleert: !!(e.meta && e.meta.geleert) }; };
export const metaSicht = (m) => { m = m || {}; const f = {}; Object.keys(m.fenster || {}).forEach((k) => { f[k] = { t0: m.fenster[k].t0, aend: m.fenster[k].aend || 0 }; }); return { angelegt: m.angelegt || 0, fenster: f }; };
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
   dem Leeren wiederhergestellt werden dürfen. geloescht: auf dem Gerät gelöschte Kennungen mit Zeitpunkt (null: ältere App, dann
   gilt als gelöscht, was das Gerät kannte und nicht mehr schickt). kaufAm: beim eigenen Aufmaß der Kauf des Aufmaßblatts; ab dann
   ist die freie Woche vorbei.
   Rückgabe: fenster (Ergebnis), zurueck (feste Fenster, deren Änderung nicht übernommen wurde), anders (Ergebnis weicht vom Gerät
   ab), weg (jetzt gelöschte Kennungen mit Zeitpunkt), zurueckGeholt (nach dem Löschen anderswo noch geändert) */
export function zusammenfuehren(alt, eingang, metaAlt, bekannt, hierNeuer, jetzt, frei, wieder, geloescht, kaufAm) {
  const altMap = new Map((alt || []).filter((w) => kennung(w)).map((w) => [kennung(w), w])), kennt = metaAlt.fenster || {}, warWeg = metaAlt.geloescht || {};
  const zurueck = [], out = [], weg = {}, zurueckGeholt = [];
  let anders = false;
  /* Änderung nach der ersten Woche: zählen; null, wenn das Fenster fest ist (dann gilt die Änderung nicht) */
  const gezaehlt = (w, id) => {
    const m = kennt[id];
    if (frei || !m || jetzt < Math.min((Number(m.t0) || jetzt) + GRENZEN.freiTage * TAG, Number(kaufAm) || Infinity)) return w; // nach dem Kauf zählt jede Änderung
    const n = Number(m.aend) || 0;
    if (n >= GRENZEN.aenderungen) return null;
    return (Number(w.aend) || 0) > n ? w : Object.assign({}, w, { aend: n + 1 }); // hat der Browser nicht mitgezählt, zählt der Server
  };
  eingang.forEach((w) => {
    const id = kennung(w);
    if (!id) return; // vorher abgewiesen
    const vorher = altMap.get(id);
    if (!vorher) {
      if (!kennt[id] || (wieder && wieder.has(id))) { out.push(w); return; } // neu, oder nach dem Leeren wiederhergestellt
      const tWeg = Number(warWeg[id]) || 0, z = tWeg && (Number(w.ts) || 0) > tWeg ? gezaehlt(w, id) : null;
      if (z) { out.push(z); zurueckGeholt.push(id); return; } // nach dem Löschen anderswo hier noch geändert: kommt zurück
      anders = true; return; // anderswo gelöscht bleibt gelöscht
    }
    altMap.delete(id);
    const tsG = Number(w.ts) || 0, tsS = Number(vorher.ts) || 0;
    if (!(tsG > tsS || (tsG === tsS && tsG > 0 && hierNeuer))) { if (fensterFp(vorher) !== fensterFp(w)) anders = true; out.push(vorher); return; } // anderswo später gespeichert
    if (fensterFp(vorher) === fensterFp(w)) { out.push(w); return; }
    if (aenderungFp(vorher) === aenderungFp(w)) { out.push(w); return; } // nur Auswertung oder Fotos neu: zählt nicht, gilt auch bei festen Fenstern
    const z = gezaehlt(w, id);
    if (!z) { zurueck.push(id); anders = true; out.push(Object.assign({}, vorher, { aend: Number(kennt[id].aend) || 0 })); return; }
    out.push(z);
  });
  altMap.forEach((w, id) => {
    if (geloescht) {
      const tDel = Number(geloescht[id]) || 0;
      if (tDel && tDel >= (Number(w.ts) || 0)) { weg[id] = tDel; return; } // hier gelöscht
      out.push(w); anders = true; return; // anderswo angelegt oder nach dem Löschen hier noch geändert
    }
    if (bekannt.has(id)) { weg[id] = jetzt; return; } // ältere App: was sie kannte und nicht mehr schickt, hat sie gelöscht
    out.push(w); anders = true;
  });
  return { fenster: out, zurueck: zurueck, anders: anders, weg: weg, zurueckGeholt: zurueckGeholt };
}

/* Eingang eines Geräts prüfen (Kundenlink und eigenes Aufmaß): Fenster ohne Bild der Lage, Zeitpunkte begrenzt, Kennung Pflicht */
const objekt = (x) => x && typeof x === 'object' && !Array.isArray(x);
export function eingangPruefen(b, jetzt, grenzMeldung) {
  if (!Array.isArray(b.windows)) throw new ApiFehler('Kein Zwischenstand im Versand.');
  if (b.windows.length > GRENZEN.fenster) throw new ApiFehler(grenzMeldung || grenzText(), 409, { grenze: true });
  const eingang = b.windows.filter(objekt).map((w) => Object.assign(ohneBild(w), { ts: zeitKappen(w.ts, jetzt) })), proj = objekt(b.proj) ? b.proj : {};
  if (eingang.some((w) => !kennung(w))) throw new ApiFehler('Ein Fenster hat keine Kennung. Bitte die Seite neu laden.', 400);
  if (JSON.stringify({ windows: eingang, proj: proj }).length > MAX_JSON) throw new ApiFehler('Der Zwischenstand ist zu groß.', 413);
  return {
    eingang: eingang, proj: proj, stand: zeitKappen(b.stand, jetzt), projTs: zeitKappen(b.projTs, jetzt), angelegt: b.angelegt,
    bekannt: new Set((Array.isArray(b.bekannt) ? b.bekannt : []).slice(0, 500).map((x) => String(x).slice(0, 40))),
    geloescht: objekt(b.geloescht) ? Object.fromEntries(Object.keys(b.geloescht).slice(0, 300).map((k) => [kennung({ wid: k }), zeitKappen(b.geloescht[k], jetzt)]).filter((x) => x[0] && x[1])) : null
  };
}
/* Eingang in den gespeicherten Stand r (daten, meta, stand) einarbeiten. frei: offene Nachbesserung; kaufAm: Kauf beim eigenen
   Aufmaß. Rückgabe { grenze } (dann r unverändert lassen) oder { zurueck, anders, hierNeuer }; r ist dann geändert */
export function eingangMischen(r, e, jetzt, frei, kaufAm) {
  const metaAlt = r.meta || {}, d = r.daten || {}, alt = Array.isArray(d.windows) ? d.windows : [];
  const hierNeuer = e.stand >= (Number(r.stand) || 0);
  const wieder = new Set(metaAlt.geleert && Array.isArray(metaAlt.geleertIds) ? metaAlt.geleertIds : []);
  const z = zusammenfuehren(alt, e.eingang, metaAlt, e.bekannt, hierNeuer, jetzt, frei, wieder, e.geloescht, kaufAm), meta = metaMischen(metaAlt, z.fenster, e.angelegt, jetzt);
  if (meta.angelegt > GRENZEN.fenster || z.fenster.length > GRENZEN.fenster) return { grenze: true };
  if (metaAlt.geleert) { // wiederhergestellt oder auf diesem Gerät gelöscht: erledigt; was das Gerät nie hatte, darf ein anderes noch bringen
    const geschickt = new Set(e.eingang.map(kennung)), rest = Array.from(wieder).filter((id) => !geschickt.has(id) && !e.bekannt.has(id) && !(e.geloescht && e.geloescht[id]));
    if (rest.length) meta.geleertIds = rest; else { delete meta.geleert; delete meta.geleertIds; }
  }
  const wegAlle = Object.assign({}, metaAlt.geloescht || {}, z.weg); z.zurueckGeholt.forEach((id) => { delete wegAlle[id]; });
  meta.geloescht = neueste(wegAlle, 300);
  /* Angaben zum Haus: das zuletzt geänderte gewinnt (ohne Zeitpunkte der neuere Zwischenstand); leere überschreiben nie */
  const projAlt = objekt(d.proj) ? d.proj : null, projTsAlt = Number(d.projTs) || 0, altLeer = !projAlt || !Object.keys(projAlt).length;
  const projHier = altLeer || !!metaAlt.geleert || (e.projTs || projTsAlt ? e.projTs > projTsAlt || (e.projTs === projTsAlt && hierNeuer) : hierNeuer);
  if (!projHier && stabil(projAlt) !== stabil(e.proj)) z.anders = true;
  r.meta = meta; r.daten = { windows: z.fenster, proj: projHier ? e.proj : projAlt, projTs: projHier ? e.projTs : projTsAlt }; r.stand = Math.max(Number(r.stand) || 0, e.stand);
  return { zurueck: z.zurueck, anders: z.anders, hierNeuer: hierNeuer };
}
/* Antwort an das Gerät: weicht das Ergebnis ab, der ganze Stand */
export function antwortNachMischen(row, m) {
  const zurueckGeben = m.anders || !m.hierNeuer || m.zurueck.length > 0;
  return { ok: true, stand: Number(row.stand) || 0, meta: metaSicht(row.meta), zurueck: m.zurueck, entwurf: zurueckGeben ? entwurfSicht(row) : null, jetzt: Date.now() };
}

export const ENTWURF = {
  'GET /api/link/:code/entwurf': async (ctx) => {
    const { row, l, code } = await linkFinden(ctx);
    const zu = X().linkZu(l), basis = { ok: true, zu: zu, zuText: zu ? zuText(zu, row.name) : '', expires: l.expires || '', grenzen: GRENZEN, runde: l.nb && l.nb.offen ? l.nb.runde : (l.runde || 1), seit: l.eingegangenAt || 0, jetzt: Date.now() }; // jetzt: damit die App eine falsch gehende Uhr ausgleicht
    if (!langerCode(code)) return Object.assign(basis, { aus: true, entwurf: null, meta: null });
    /* Zu: kein Inhalt mehr, wer den Link hat (der Betrieb kann ihn deaktiviert haben, weil er an die falsche Person ging) */
    if (zu) return Object.assign(basis, { entwurf: null, meta: null });
    const e = await ctx.sp.entwurfHolen(code);
    if (e === undefined) return Object.assign(basis, { aus: true, entwurf: null, meta: null });
    return Object.assign(basis, { entwurf: e ? entwurfSicht(e) : null, meta: e ? metaSicht(e.meta) : null });
  },
  'POST /api/link/:code/entwurf': async (ctx) => {
    const { row, l, code } = await linkFinden(ctx);
    if (!langerCode(code)) return { ok: true, aus: true };
    const zu = X().linkZu(l); if (zu) throw new ApiFehler(zuText(zu, row.name), 410, { zu: zu, runde: l.runde || 1, seit: l.eingegangenAt || 0 });
    const jetzt = Date.now(), e = eingangPruefen(ctx.body || {}, jetzt), frei = !!(l.nb && l.nb.offen);
    let m = null;
    const res = await ctx.sp.entwurfAendern(code, row.id, (r) => { m = eingangMischen(r, e, jetzt, frei, 0); return !m.grenze; });
    if (res && res.fehlt) return { ok: true, aus: true };
    if (m.grenze) throw new ApiFehler(grenzText(), 409, { grenze: true });
    return antwortNachMischen(res.row || {}, m);
  }
};

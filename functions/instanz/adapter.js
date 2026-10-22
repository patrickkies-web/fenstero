/* eeziframes · Link-Objekt der Instanzen in anfragen.daten und Pseudo-Konto, damit modell.js unverändert arbeitet
   (Strang A, Bauplan §2.5; Vertrag docs/INSTANZEN.md)
   Projekte einer Instanz stehen nicht in betriebe.daten.links (E1), sondern je Zeile in der Tabelle anfragen (daten = ein Link-Objekt wie
   betriebe.daten.links[]). Für die Regeln aus modell.js (importCode, fortschritt, projektAendern, nbAnfragen …) baut pseudoKonto ein
   Konto mit genau diesem einen Link; was die Regeln am Link ändern, schreibt linkAendern zurück, Buchungen des Pseudo-Kontos fallen weg
   (Instanzen rechnen nicht je Aufmaß ab). Website-Besucher haben bis zum Senden nur einen „virtuellen Link“: einen Zwischenstand
   (entwuerfe) mit meta.instanz, ohne Zeile in anfragen (E6).
     linkAufloesen(ctx, code) → { art: 'alt'|'anfrage'|'virtuell', row, l, anfrage?, entwurf? }
       Hauptdomain (ctx.instanz null): wie bisher über betriebNachCode; Betriebszeilen einer Instanz kennt die Hauptdomain nicht.
       Instanz-Host: nur zehnstellige Codes; eine Anfrage dieser Instanz ('anfrage') oder ein Zwischenstand mit meta.instanz.id dieser
       Instanz ('virtuell'); alles andere ist unbekannt (404, zählt für die Bremse wie bei Kundenlinks).
     linkAendern(ctx, aufl, fn, o) → Ergebnis von fn(a, l)
       'alt': betriebAendern wie bisher; 'anfrage': anfrageAendern mit Pseudo-Konto, o.zeile(z, r) darf die Zeile danach ergänzen
       (Versand, Eingang); Meldungen an den Betrieb (a.notif) nur mit Merkmal dashboard an die Betriebszeile; 'virtuell': fn auf einem
       Pseudo-Konto ohne Speichern (fortschritt meldet nichts).
     pseudoKonto(daten, l) → { konto: 'instanz', links: [l], book: [], notif: [], abzug, prefs, since } */
import '../../web/assets/modell.js';
import { ApiFehler, linkUnbekannt } from '../api/umgebung.js';

const X = () => globalThis.Abrechnung;
export function pseudoKonto(daten, l) {
  daten = daten || {};
  return { konto: 'instanz', links: l ? [l] : [], book: [], notif: [], abzug: daten.abzug, prefs: daten.prefs, since: daten.since };
}
const LINK_RUHT = 'Dieser Link ist zurzeit nicht aktiv. Bitte beim Fensterbauer nachfragen.';

/* Virtueller Link: wie ein frisch geöffneter Kundenlink, ohne Kunde und ohne Ablauf */
export const virtuellerLink = (code) => ({ code: code, status: 'arbeit', kunde: '', instanz: true, virtuell: true, progress: 0, log: {}, runde: 1 });

export async function linkAufloesen(ctx, code) {
  code = String(code || '').trim().toLowerCase();
  const inst = ctx.instanz;
  if (!inst) {
    if (!/^[a-z0-9]{3,12}$/.test(code)) throw linkUnbekannt(ctx.request, 'Kein gültiger Link.');
    const row = await ctx.sp.betriebNachCode(code);
    if (!row || (row.daten && row.daten.instanz)) throw linkUnbekannt(ctx.request);
    if (row.daten && row.daten.verwaltung && row.daten.verwaltung.sperre) throw new ApiFehler(LINK_RUHT, 404);
    const l = (row.daten.links || []).find((x) => x.code === code); if (!l) throw linkUnbekannt(ctx.request);
    return { art: 'alt', row: row, l: l, code: code };
  }
  if (!/^[a-z0-9]{10}$/.test(code)) throw linkUnbekannt(ctx.request, 'Kein gültiger Link.');
  const a = await ctx.sp.anfrageHolen(code);
  if (a) {
    if (a.instanz !== inst.id) throw linkUnbekannt(ctx.request);
    return { art: 'anfrage', row: { id: inst.betrieb, name: inst.name, daten: null }, l: a.daten || {}, anfrage: a, code: code };
  }
  const e = await ctx.sp.entwurfHolen(code);
  if (e && e.meta && e.meta.instanz && e.meta.instanz.id === inst.id && !e.meta.anfrageWeg) return { art: 'virtuell', row: { id: inst.betrieb, name: inst.name, daten: null }, l: virtuellerLink(code), entwurf: e, code: code };
  throw linkUnbekannt(ctx.request);
}

/* Profil der Betriebszeile (Abzug, Benachrichtigungen, seit) für das Pseudo-Konto, einmal je Anfrage gelesen */
async function betriebDaten(ctx) {
  if (ctx._betriebDaten !== undefined) return ctx._betriebDaten;
  const row = ctx.instanz && ctx.sp.betriebHolen ? await ctx.sp.betriebHolen(ctx.instanz.betrieb) : null;
  ctx._betriebDaten = (row && row.daten) || {};
  return ctx._betriebDaten;
}

export async function linkAendern(ctx, aufl, fn, o) {
  o = o || {};
  if (aufl.art === 'alt') return ctx.sp.betriebAendern(aufl.row.id, (a) => fn(a, (a.links || []).find((x) => x.code === aufl.code)));
  const daten = await betriebDaten(ctx);
  if (aufl.art === 'virtuell') { const a = pseudoKonto(daten, Object.assign({}, aufl.l)); return fn(a, a.links[0]); }
  let meldungen = [];
  const out = await ctx.sp.anfrageAendern(aufl.code, async (z) => {
    const a = pseudoKonto(daten, z.daten || {}), r = await fn(a, a.links[0]);
    if (r === false) return false;
    z.daten = a.links[0]; z.status = z.daten.status || z.status;
    meldungen = a.notif || [];
    if (o.zeile) o.zeile(z, r);
    return r === undefined ? true : r;
  });
  /* Meldungen an den Betrieb nur dort, wo er sie sieht (Signature-Dashboard) */
  if (meldungen.length && ctx.instanz && ctx.instanz.m && ctx.instanz.m.dashboard && ctx.sp.betriebAendern) {
    try { await ctx.sp.betriebAendern(ctx.instanz.betrieb, (a) => { a.notif = meldungen.concat(a.notif || []).slice(0, 200); }); } catch (e) { /* Meldung ist Zugabe */ }
  }
  return out;
}

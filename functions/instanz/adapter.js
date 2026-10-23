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
     linkAendern(ctx, aufl, fn, o) → Ergebnis von fn(a, l, jetzt)
       'alt': betriebAendern wie bisher; 'anfrage': anfrageAendern mit Pseudo-Konto, o.zeile(z, r) darf die Zeile danach ergänzen
       (Versand, Eingang); Meldungen an den Betrieb (a.notif) nur mit Merkmal dashboard an die Betriebszeile; 'virtuell': fn auf einem
       Pseudo-Konto ohne Speichern (fortschritt meldet nichts). jetzt (k.jetzt oder Date.now()) gibt fn an die Regeln aus modell.js
       weiter; was sie damit stempeln, schreibt linkAendern danach in deutsche Zeit um (zeitenBerlin).
     pseudoKonto(daten, l) → { konto: 'instanz', links: [l], book: [], notif: [], abzug, prefs, since }
     stempelBerlin(ms) → 'TT.MM., HH:MM' · datumBerlin(ms) → 'TT.MM.JJJJ' · datumBerlinPlus(ms, tage) · zeitenBerlin(l, jetzt, o)
       Zeitstempel der Instanz-Anfragen in deutscher Zeit (unten) */
import '../../web/assets/modell.js';
import { ApiFehler, linkUnbekannt } from '../api/umgebung.js';

const X = () => globalThis.Abrechnung;
const TAG = 864e5;
const jetztVon = (ctx) => (ctx && ctx.k && ctx.k.jetzt) || Date.now();

/* ---------- Zeit in deutscher Zeit ----------
   Der Worker rechnet in UTC; stamp() und datum() aus modell.js nehmen die Uhr des Rechners. Die Eingangszeit einer Anfrage stünde sonst im
   Aufmaßblatt, in der Mail und im Dashboard ein bis zwei Stunden falsch, kurz vor Mitternacht auch das Datum. Hier dieselben Formate
   ('TT.MM., HH:MM' bzw. 'TT.MM.JJJJ') in Europe/Berlin, nur für den Instanz-Zweig: Der Altbestand (Betriebskonten auf eeziframes.com)
   bleibt bei stamp() und datum(), das entscheidet der Inhaber. */
const TEILE = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const two = (n) => String(n).padStart(2, '0');
function teileBerlin(ms) {
  const t = {};
  TEILE.formatToParts(new Date(ms == null ? Date.now() : ms)).forEach((p) => { t[p.type] = p.value; });
  if (t.hour === '24') t.hour = '00'; // ältere ICU-Fassungen schreiben Mitternacht als 24
  return t;
}
export function stempelBerlin(ms) { const t = teileBerlin(ms); return t.day + '.' + t.month + '., ' + t.hour + ':' + t.minute; }
export function datumBerlin(ms) { const t = teileBerlin(ms); return t.day + '.' + t.month + '.' + t.year; }
/* Datum in tage Tagen, gerechnet auf dem Kalendertag in Berlin (wie dateIn in modell.js, nur in deutscher Zeit) */
export function datumBerlinPlus(ms, tage) {
  const t = teileBerlin(ms), d = new Date(Date.UTC(Number(t.year), Number(t.month) - 1, Number(t.day) + (Number(tage) || 0)));
  return two(d.getUTCDate()) + '.' + two(d.getUTCMonth() + 1) + '.' + d.getUTCFullYear();
}
/* Was modell.js an einem Link-Objekt (oder einer Meldung) gerade mit jetzt gestempelt hat, in deutsche Zeit umschreiben: log, nb, klaer,
   vorher, when, created, offenAm und ein gerade gesetztes expires. Erkannt wird, was dem Stempel bzw. Datum von jetzt in der Uhr des
   Workers entspricht; deshalb bekommen die Regeln aus modell.js im Instanz-Zweig immer dasselbe jetzt. o.expiresVorher: expires vor dem
   Aufruf (ein unverändertes Ablaufdatum bleibt, wie es ist) */
export function zeitenBerlin(l, jetzt, o) {
  o = o || {};
  if (!l || typeof l !== 'object') return l;
  const st = X().stamp(jetzt), dt = X().datum(jetzt), sB = stempelBerlin(jetzt), dB = datumBerlin(jetzt);
  const um = (obj, k) => { if (obj && typeof obj === 'object' && obj[k] === st) obj[k] = sB; };
  Object.keys(l.log || {}).forEach((k) => um(l.log, k));
  um(l.nb, 'when'); um(l.nb, 'fertig'); um(l, 'when');
  Object.keys(l.klaer || {}).forEach((id) => um(l.klaer[id], 'wann'));
  (Array.isArray(l.vorher) ? l.vorher : []).forEach((v) => um(v, 'when'));
  if (l.created === dt) l.created = dB;
  if (l.offenAm === dt) l.offenAm = dB;
  if (l.expires && l.expires !== o.expiresVorher) {
    const z = X().parseDE(l.expires), h = X().parseDE(dt), n = z && h ? Math.round((z.getTime() - h.getTime()) / TAG) : -1;
    if (n >= 0 && l.expires === X().dateIn(n, jetzt)) l.expires = datumBerlinPlus(jetzt, n);
  }
  return l;
}
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
  const daten = await betriebDaten(ctx), jetzt = jetztVon(ctx);
  if (aufl.art === 'virtuell') { const a = pseudoKonto(daten, Object.assign({}, aufl.l)); return fn(a, a.links[0], jetzt); }
  let meldungen = [];
  const out = await ctx.sp.anfrageAendern(aufl.code, async (z) => {
    const a = pseudoKonto(daten, z.daten || {}), vorher = (a.links[0] || {}).expires, r = await fn(a, a.links[0], jetzt);
    if (r === false) return false;
    zeitenBerlin(a.links[0], jetzt, { expiresVorher: vorher });
    z.daten = a.links[0]; z.status = z.daten.status || z.status;
    meldungen = (a.notif || []).map((n) => zeitenBerlin(n, jetzt));
    if (o.zeile) o.zeile(z, r);
    return r === undefined ? true : r;
  });
  /* Meldungen an den Betrieb nur dort, wo er sie sieht (Signature-Dashboard) */
  if (meldungen.length && ctx.instanz && ctx.instanz.m && ctx.instanz.m.dashboard && ctx.sp.betriebAendern) {
    try { await ctx.sp.betriebAendern(ctx.instanz.betrieb, (a) => { a.notif = meldungen.concat(a.notif || []).slice(0, 200); }); } catch (e) { /* Meldung ist Zugabe */ }
  }
  return out;
}

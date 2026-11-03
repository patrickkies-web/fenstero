/* eeziframes · Schritte in App und Startseite zählen (Inhaber, 3.11.2026: „wo die meisten Personen aussteigen“; Konzept
   docs/konzepte/2026-11-03-schritte-messen.md, Stufen 1 und 2)
   Die App ist eine einzige Adresse (/app/), ihre Folien wechseln im Browser; der Server sieht sie nur, wenn die Seite es meldet.
   web/assets/schritt.js schickt dazu ein kleines Signal (navigator.sendBeacon, POST /api/schritt, Formular-Text):
     s  Strang: W Website (Startseite), K eigenes Aufmaß, L Kundenlink eines Fensterbauers, P Führung
     n  Schritt, der in diesem Tab zum ersten Mal gezeigt wird (Folie, Szene oder Klick)
     h  grobe Herkunft des Tabs (startseite, ratgeber, fensterbauer, anzeige, extern, direkt, intern), nur zusammen mit n
     v  vorige Folie und d ihre Verweildauer als Stufe (k unter 30 s, m bis 2 min, l länger), einmal je Folie
     a  letzte Folie beim Verlassen der Seite (pagehide)
     z  Zeichen für Mühe auf der Folie v: hilfe (Begriffe, Erklärungen), zurueck, weissnicht, fehler (Maß-Rückfrage)
     m  Merkmal am Schritt n: vorschau (vorher eine KI-Vorschau am eigenen Haus gerechnet)
   Gezählt werden nur Tageszähler und Stundenzähler über statistik.js (Tabelle statistik: Tag, Schlüssel, Anzahl). Keine Kennung, kein
   Cookie, kein Browser-Speicher, keine IP-Adresse, kein Inhalt (keine Maße, keine Namen). Das Gerät wird wie bei den Seitenaufrufen aus
   der Browser-Kennung, die jede Anfrage ohnehin mitbringt, zu Telefon, Tablet oder Rechner verdichtet und dann vergessen.
   Nicht gezählt: Global Privacy Control oder Do Not Track, der angemeldete Inhaber, Bots, unbekannte Namen (feste Muster unten),
   Konfiguratoren der Fensterbauer (Instanzen; dort gilt die Datenschutzerklärung des Betriebs) und mehr als 60 Signale je Minute und
   Anschluss (Bremse, Schlüssel ohne Speicherung der Adresse). Rechtsgrundlage und Text: web/datenschutz/ (Eigene Statistik),
   Prüfmappe für die Anwälte docs/recht/2026-11-04-pruefmappe-tracking-funnel.md. */
import { konfig } from './umgebung.js';
import { speicher } from './speicher.js';
import { zaehlen, geraet, botFamilie, STRAENGE } from './statistik.js';
import { bremse } from './bremse.js';

export { STRAENGE };
/* Folien der App (S.screen, frage-<Frage>, fenster-<Zahl> beim zweiten bis fünften gespeicherten Fenster, hausbild-<Stand>, tour-<Schritt>) */
const APP = /^(home|liste|start|fotos|messen|planmasse|zeichnen|rest|ergebnis|frage-[a-zA-Z0-9]{1,24}|fertig|fenster-[2-5]|anfrage|anfrage2|anfrage3|weg|betriebe|vcode|angefragt|sichern|kasse|gekauft|teilen|blatt|datei|gesendet|meinkonto|konto|tour-[a-z]{2,12}|hausbild|hausbild-(foto|gesetzt|vorschau|ergebnis|grenze))$/;
/* Startseite: geöffnet, Szene erreicht (id der Szene), Klick in die App (Stelle) */
const WEB = /^(start|szene-[a-z0-9-]{2,24}|klick-[a-z0-9-]{2,24})$/;
export const HERKUNFT = ['startseite', 'ratgeber', 'fensterbauer', 'anzeige', 'extern', 'direkt', 'intern'];
export const ZEICHEN = ['hilfe', 'zurueck', 'weissnicht', 'fehler'];
export const STUFEN = { k: 'unter 30 s', m: '30 s bis 2 min', l: 'über 2 min' };
const MERKMALE = ['vorschau'];
export const gueltig = (s, n) => !!STRAENGE[s] && typeof n === 'string' && (s === 'W' ? WEB : APP).test(n);

/* Schlüssel zu einem Signal (leer: nichts zählen). Auch für die Prüfsuite exportiert. */
export function schluesselSchritt(f, ua) {
  const s = String(f.s || ''), out = [];
  if (!STRAENGE[s]) return out;
  const g = geraet(ua || '');
  if (f.n && gueltig(s, f.n)) {
    out.push('schritt:' + s + '|' + f.n, 'schrittg:' + s + '|' + g + '|' + f.n);
    if (HERKUNFT.includes(f.h)) out.push('schritth:' + s + '|' + f.h + '|' + f.n);
    if (MERKMALE.includes(f.m)) out.push('merkmal:' + s + '|' + f.n + '|' + f.m);
  }
  if (f.v && gueltig(s, f.v)) {
    if (STUFEN[f.d]) out.push('dauer:' + s + '|' + f.v + '|' + f.d);
    if (ZEICHEN.includes(f.z)) out.push('zeichen:' + s + '|' + f.v + '|' + f.z);
  }
  if (f.a && gueltig(s, f.a)) out.push('aus:' + s + '|' + f.a);
  return out.slice(0, 8);
}

export async function onRequestPost({ request, env, warte, inst }) {
  const leer = () => new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  if (inst) return leer(); // Konfiguratoren der Fensterbauer: nichts zählen
  if (env && String(env.SCHRITTE_AUS || '') === '1') return leer(); // Schalter bei Cloudflare: Meldungen annehmen, aber nichts zählen
  const h = request.headers;
  if (h.get('sec-gpc') === '1' || h.get('dnt') === '1') return leer();
  if (/(^|;\s*)__Host-(zentrale|inhaber)=/.test(h.get('cookie') || '')) return leer(); // der Inhaber selbst
  const ua = h.get('user-agent') || ''; if (botFamilie(ua)) return leer();
  const k = konfig(env); if (!k.daten) return leer();
  let text = ''; try { text = (await request.text()).slice(0, 600); } catch (e) { return leer(); }
  const q = new URLSearchParams(text), f = {}; for (const x of ['s', 'n', 'h', 'v', 'd', 'a', 'z', 'm']) f[x] = q.get(x) || '';
  const keys = schluesselSchritt(f, ua); if (!keys.length) return leer();
  /* Bremse je Anschluss (60 je Minute); die Adresse geht nur als Schlüssel in den Zähler der Bremse, nicht in die Statistik */
  const ip = h.get('cf-connecting-ip') || h.get('x-forwarded-for') || 'lokal';
  if (!(await bremse({ env: env }, 'RL_LINK', 'schritt:' + ip).catch(() => true))) return leer();
  const p = zaehlen(k, speicher(k), keys).catch(() => false);
  const w = warte ? warte(p) : p; if (w && typeof w.then === 'function') await w; // ohne waitUntil (lokal, Prüfsuite) erst zählen, dann antworten
  return leer();
}

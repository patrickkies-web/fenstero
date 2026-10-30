/* eeziframes · Orte für die Suche nach Fensterbetrieben: Postleitzahl → Mittelpunkt und Ort, Entfernung, Postleitzahlen im Umkreis, Lage
   eines Betriebs aus seiner PLZ oder seinem Ort. Daten: plz-de.js (GeoNames, CC BY 4.0, gebaut mit scripts/plz-tabelle.py).
   So findet die App sofort Betriebe (Inhaber, 30.10.2026: „ich will, dass der Nutzer sofort Betriebe findet … gerne auch die anliegenden
   Postleitzahlen“): Statt auf eine neue KI-Suche zu warten, nimmt der Server die gespeicherten Suchen der Postleitzahlen im Umkreis
   und den Vorrat (vermittlung.js) und rechnet die Entfernung jedes Betriebs zum Kunden neu.
   Rechenzeit: Die Tabelle wird beim ersten Aufruf in Zahlenfelder gelesen (sortiert nach PLZ, Suche halbierend, etwa 8 ms); Ortsnamen
   werden nur im Umkreis des Suchorts verglichen. */
import { PLZ_DATEN, VORRAT } from './plz-de.js';

let P = null, LA, LO, ORT, K1, K2;
function laden() {
  if (P) return;
  const z = PLZ_DATEN.split('|'), n = z.length;
  P = new Int32Array(n); LA = new Int32Array(n); LO = new Int32Array(n); ORT = new Array(n); K1 = new Array(n); K2 = new Array(n);
  for (let i = 0; i < n; i++) {
    const s = z[i], a = s.indexOf(','), b = s.indexOf(',', a + 1), c = s.indexOf(',', b + 1);
    P[i] = +s.slice(0, a); LA[i] = +s.slice(a + 1, b); LO[i] = +s.slice(b + 1, c); ORT[i] = s.slice(c + 1);
  }
}
const eintrag = (i) => ({ plz: String(P[i]).padStart(5, '0'), lat: LA[i] / 1000, lon: LO[i] / 1000, ort: ORT[i] });
const norm = (s) => String(s || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z]/g, '');
/* Postleitzahl → { plz, lat, lon, ort } oder null */
export function plzInfo(plz) {
  const s = String(plz == null ? '' : plz).trim(); if (!/^\d{5}$/.test(s)) return null;
  laden(); const x = +s; let lo = 0, hi = P.length - 1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (P[m] === x) return eintrag(m); if (P[m] < x) lo = m + 1; else hi = m - 1; }
  return null;
}
/* Luftlinie in km */
export function km(a, b) {
  const r = Math.PI / 180, dla = (b.lat - a.lat) * r, dlo = (b.lon - a.lon) * r;
  const h = Math.sin(dla / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dlo / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
}
/* Postleitzahlen im Umkreis von r km, die nächsten zuerst (die eigene vorn); in Deutschland reicht die ebene Näherung */
export function umkreisPlz(plz, r) {
  const m = plzInfo(plz); if (!m) return [];
  const kx = 111.32 * Math.cos(m.lat * Math.PI / 180), ky = 111.32, out = [];
  for (let i = 0; i < P.length; i++) {
    const dx = (LO[i] / 1000 - m.lon) * kx, dy = (LA[i] / 1000 - m.lat) * ky, d = Math.sqrt(dx * dx + dy * dy);
    if (d <= r) out.push([i, d]);
  }
  return out.sort((a, b) => a[1] - b[1]).map((x) => String(P[x[0]]).padStart(5, '0'));
}
/* Lage eines Betriebs: aus seiner PLZ, sonst aus seinem Ort (der nächste gleichnamige zum Suchort, höchstens 60 km), sonst null.
   Ein Ort passt mit seinem ganzen Namen oder seinem ersten Teil („Stuttgart Stuttgart-Mitte“ → „Stuttgart“); der ganze Name geht vor. */
export function betriebLage(b, nahe) {
  const p = plzInfo(b && b.plz); if (p) return p;
  const ort = String((b && b.ort) || ''), ganz = norm(ort), erst = norm(ort.split(/[\s-]/)[0]);
  if (!nahe || !ganz) return null;
  laden();
  const kx = 111.32 * Math.cos(nahe.lat * Math.PI / 180), ky = 111.32;
  let bg = -1, dg = 60, be = -1, de = 60;
  for (let i = 0; i < P.length; i++) {
    const dx = (LO[i] / 1000 - nahe.lon) * kx, dy = (LA[i] / 1000 - nahe.lat) * ky, d = Math.sqrt(dx * dx + dy * dy);
    if (d > 60) continue;
    if (K1[i] === undefined) { K1[i] = norm(ORT[i]); K2[i] = norm(ORT[i].split(' ')[0]); }
    if ((K1[i] === ganz || K2[i] === ganz) && d <= dg) { dg = d; bg = i; }
    else if ((K1[i] === erst || K2[i] === erst) && d <= de) { de = d; be = i; }
  }
  return bg >= 0 ? eintrag(bg) : be >= 0 ? eintrag(be) : null;
}
/* Stützpunkte des Vorrats, dicht besiedelte zuerst */
export const vorratPlz = () => VORRAT.split(',');

/* eeziframes · Link-Objekt der Instanzen in anfragen.daten und Pseudo-Konto, damit modell.js unverändert arbeitet
   (Strang A, Bauplan §2.5; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0); pseudoKonto ist schon fertig (reine Funktion). Feste Exportnamen:
     linkAufloesen(ctx, code) → { art: 'alt'|'anfrage'|'virtuell', row, l, anfrage?, entwurf? }
     linkAendern(ctx, aufl, fn)
     pseudoKonto(daten, l) → { konto: 'instanz', links: [l], book: [], notif: [], abzug, prefs, since } */
import { ApiFehler } from '../api/umgebung.js';
export async function linkAufloesen(ctx, code) { throw new ApiFehler('adapter.linkAufloesen: noch nicht gebaut (Strang A).', 501); }
export async function linkAendern(ctx, aufl, fn) { throw new ApiFehler('adapter.linkAendern: noch nicht gebaut (Strang A).', 501); }
export function pseudoKonto(daten, l) {
  daten = daten || {};
  return { konto: 'instanz', links: l ? [l] : [], book: [], notif: [], abzug: daten.abzug, prefs: daten.prefs, since: daten.since };
}

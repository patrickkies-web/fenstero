/* eeziframes · Instanzen verwalten: anlegen, ändern, Status, Hosts, Marke, Empfänger, Vorschau, Cache, Löschen
   (Strang A, Bauplan §3 A.14; Aufrufer: Zentrale (C), Bestellung (D); Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0). Feste Exportnamen und Signaturen:
     instanzAnlegen(ctx, p) · instanzAendern(ctx, id, fn) · instanzStatus(ctx, id, status, grund) · hostSetzen(ctx, id, host, o) ·
     hostEntfernen(ctx, id, host) · hauptSetzen(ctx, id, host) · markeVeroeffentlichen(ctx, id) · bildAblegen(ctx, id, name, bytes, typ) ·
     empfaengerEinladen(ctx, id, mail, art) · vorschauToken(ctx, id, version) · cacheLeeren(ctx, id) · instanzDatenLoeschen(ctx, id) */
import { ApiFehler } from '../api/umgebung.js';
const fehlt = (n) => { throw new ApiFehler('verwalten.' + n + ': noch nicht gebaut (Strang A).', 501); };
export async function instanzAnlegen(ctx, p) { return fehlt('instanzAnlegen'); }
export async function instanzAendern(ctx, id, fn) { return fehlt('instanzAendern'); }
export async function instanzStatus(ctx, id, status, grund) { return fehlt('instanzStatus'); }
export async function hostSetzen(ctx, id, host, o) { return fehlt('hostSetzen'); }
export async function hostEntfernen(ctx, id, host) { return fehlt('hostEntfernen'); }
export async function hauptSetzen(ctx, id, host) { return fehlt('hauptSetzen'); }
export async function markeVeroeffentlichen(ctx, id) { return fehlt('markeVeroeffentlichen'); }
export async function bildAblegen(ctx, id, name, bytes, typ) { return fehlt('bildAblegen'); }
export async function empfaengerEinladen(ctx, id, mail, art) { return fehlt('empfaengerEinladen'); }
export async function vorschauToken(ctx, id, version) { return fehlt('vorschauToken'); }
export async function cacheLeeren(ctx, id) { return true; } // ohne Cache nichts zu tun
export async function instanzDatenLoeschen(ctx, id) { return fehlt('instanzDatenLoeschen'); }

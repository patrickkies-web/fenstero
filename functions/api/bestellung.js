/* eeziframes · Bestellungen der Pakete: Statusmaschine, Zahlung der Einrichtung, Abo, Paketwechsel, Tageslauf
   (Strang D, Bauplan §3 D; Zustände und Übergänge in web/assets/instanzregeln.js; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0). paketObjekt sagt immer nein, damit die Stripe-Webhooks unverändert beim Altbestand landen; der
   Tageslauf tut noch nichts. Feste Exportnamen:
     uebergang(ctx, id, nach, { wer, text }) · einrichtungUebernehmen(ctx, session, o) · paketObjekt(ev) → bool · paketEreignis(ctx, ev) ·
     aboStarten(ctx, id) · paketWechseln(ctx, id, paket, { differenz }) · aboSteuern(ctx, id, aktion) · bestellungenLauf(k, sp, zd, env) ·
     erstatten(ctx, id, o) */
import { ApiFehler } from './umgebung.js';
const fehlt = (n) => { throw new ApiFehler('bestellung.' + n + ': noch nicht gebaut (Strang D).', 501); };
export async function uebergang(ctx, id, nach, o) { return fehlt('uebergang'); }
export async function einrichtungUebernehmen(ctx, session, o) { return fehlt('einrichtungUebernehmen'); }
export function paketObjekt(ev) { return false; }
export async function paketEreignis(ctx, ev) { return fehlt('paketEreignis'); }
export async function aboStarten(ctx, id) { return fehlt('aboStarten'); }
export async function paketWechseln(ctx, id, paket, o) { return fehlt('paketWechseln'); }
export async function aboSteuern(ctx, id, aktion) { return fehlt('aboSteuern'); }
export async function bestellungenLauf(k, sp, zd, env) { return { ok: true, leer: true }; }
export async function erstatten(ctx, id, o) { return fehlt('erstatten'); }

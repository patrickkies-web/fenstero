/* eeziframes · Signature-Dashboard unter https://<instanz>/betrieb/ (Strang E, Bauplan §3 E; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0). Die Routen hängt Strang E in konten.js ein (/api/konto… auf Instanz-Hosts); hier liegen die Bausteine.
   Feste Exportnamen:
     kontoVon(ctx) → { row, inst, zugang }   Betrieb immer aus dem Host, Sitzung über sitzung.js (Bereich 'betrieb')
     dashboardSicht(ctx, o)                  Sicht wie konten.js sicht() ohne Abrechnung
     mailCode(ctx, mail)                     Anmeldecode per Mail in der Marke der Instanz
     einladungenErinnern(k, sp, env)         täglich: offene Einladungen älter als FRISTEN.einladungErinnernTage
     DASHBOARD                               zusätzliche Routen, falls nötig (Vorrang haben die bestehenden) */
import { ApiFehler } from './umgebung.js';
const fehlt = (n) => { throw new ApiFehler('dashboard.' + n + ': noch nicht gebaut (Strang E).', 501); };
export async function kontoVon(ctx) { return fehlt('kontoVon'); }
export async function dashboardSicht(ctx, o) { return fehlt('dashboardSicht'); }
export async function mailCode(ctx, mail) { return fehlt('mailCode'); }
export async function einladungenErinnern(k, sp, env) { return { ok: true, leer: true }; }
export const DASHBOARD = {};

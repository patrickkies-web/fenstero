/* eeziframes · Eingang der Anfragen einer Instanz: Mail mit PDF an den Betrieb, Nachholen, Resend-Webhook, Aufbewahrung
   (Strang A, Bauplan §3 A.7–A.11; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0). Die Läufe der Cron-Weiche (router.js geplant) tun hier noch nichts. Feste Exportnamen:
     eingangVerarbeiten(k, sp, code, runde)   idempotent über versand.runde/status; Queue-Consumer und Rückfall ohne Queue
     versandNachholen(k, sp)                  alle 10 Minuten (CRON_ZEHN): fällige Versände (anfragenFaellig)
     eingangErneut(ctx, code)                 „erneut senden“ in der Zentrale
     probeEingang(ctx, instanzId)             Testanfrage aus der Zentrale
     anfragenAufraeumen(k, sp)                täglich: Fristen aus pakete.js/instanzregeln.js
     textPdf(titel, abschnitte)               aus blatt-server.js
     EINGANG                                  Routen: POST /api/post/webhook (Resend, Svix-Signatur) */
import { ApiFehler } from './umgebung.js';
export { textPdf } from './blatt-server.js';
const fehlt = (n) => { throw new ApiFehler('eingang.' + n + ': noch nicht gebaut (Strang A).', 501); };
export async function eingangVerarbeiten(k, sp, code, runde) { return fehlt('eingangVerarbeiten'); }
export async function versandNachholen(k, sp) { return { ok: true, leer: true }; }
export async function eingangErneut(ctx, code) { return fehlt('eingangErneut'); }
export async function probeEingang(ctx, instanzId) { return fehlt('probeEingang'); }
export async function anfragenAufraeumen(k, sp) { return { ok: true, leer: true }; }
export const EINGANG = {};

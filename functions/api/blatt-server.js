/* eeziframes · Aufmaßblatt als PDF im Worker (blatt.js ohne DOM, per import() geladen), PDF aus Text für Anhänge
   (Strang A, Bauplan §3 A.8; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0). Feste Exportnamen:
     blattFuerEingang(k, inst, z) → Uint8Array   Variante 'betrieb' mit kleinen Fotos, Budget GRENZEN.pdfBudget
     blattAnfrage(k, inst, z) → Uint8Array       Variante 'anfrage' (Kopie für den Endkunden in der Marke der Instanz)
     textPdf(titel, abschnitte) → Uint8Array     schlichtes PDF aus Text, z. B. Paketbedingungen im Anhang (Strang D) */
import { ApiFehler } from './umgebung.js';
const fehlt = (n) => { throw new ApiFehler('blatt-server.' + n + ': noch nicht gebaut (Strang A).', 501); };
export async function blattFuerEingang(k, inst, z) { return fehlt('blattFuerEingang'); }
export async function blattAnfrage(k, inst, z) { return fehlt('blattAnfrage'); }
export async function textPdf(titel, abschnitte) { return fehlt('textPdf'); }

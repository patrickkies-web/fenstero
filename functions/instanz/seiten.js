/* eeziframes · Auslieferung auf Instanz-Hosts: App mit ersetztem Kopf, /config.js, Icons, Manifest, /marke/…, Recht, robots, 404 neutral
   (Strang A, Bauplan §3 A.3; Vertrag window.KONFIG in docs/INSTANZEN.md)
   STUB aus dem Fundament (S0): liefert nichts aus (null), worker.js macht dann weiter wie bisher. Feste Exportnamen:
     ausliefern(request, env, ctx, inst)   Response oder null
     kopf(html, inst, env)                 <title>, description, og:*, theme-color, Icons, Manifest, --accent
     konfigJs(inst)                        Text von /config.js (JSON.stringify, < als <)
     icons(pfad, inst, env)                Favicon, Touch-Icon, OG-Bild, Manifest je icons-Merkmal
     robots(inst)                          robots.txt je Indexierung
     fehlerSeite(status, inst)             404/410/503 neutral bzw. mit Kontakt */
import { ApiFehler } from '../api/umgebung.js';
const fehlt = (n) => { throw new ApiFehler(n + ': noch nicht gebaut (Strang A).', 501); };
export async function ausliefern(request, env, ctx, inst) { return null; }
export function kopf(html, inst, env) { return fehlt('seiten.kopf'); }
export function konfigJs(inst) { return fehlt('seiten.konfigJs'); }
export async function icons(pfad, inst, env) { return fehlt('seiten.icons'); }
export function robots(inst) { return fehlt('seiten.robots'); }
export function fehlerSeite(status, inst) { return fehlt('seiten.fehlerSeite'); }

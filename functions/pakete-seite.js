/* eeziframes · Pakete auf der Verkaufsseite /fuer-fensterbauer/ und in llms.txt (Strang F, Bauplan §3 F.1)
   Haken in functions/seo.js: seite() gibt jede ausgelieferte Seite durch paketeSeite(html, url, env), llms() hängt paketeLlms() an,
   PAKETE_SEITEN kommen in die Sitemap (SEITEN). STUB aus dem Fundament (S0): ändert nichts.
   Verkauf nur mit PAKETE_OFFEN=1 (Instanzregeln.verkauf); sonst „vorläufige Preise“ und Anfrageformular statt Bestellung. */
export const PAKETE_SEITEN = [];
export function paketeSeite(html, url, env) { return html; }
export function paketeLlms(origin, env) { return ''; }

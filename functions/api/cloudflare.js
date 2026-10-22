/* eeziframes · Domains der Instanzen über die Cloudflare-API (Zone, Custom Domain, DNS-Schutz, Registrar) und tägliche Prüfung
   (Strang C, Bauplan §3 C.3; Token CF_API_TOKEN ohne Zugriff auf eeziframes.com, CF_ACCOUNT_ID)
   STUB aus dem Fundament (S0). Feste Exportnamen:
     cloudflareDienst(k, env) → Dienst | null (ohne Token: null, die Zentrale zeigt die Klick-Anleitung)
     instanzenPruefen(k, sp, env)            täglich: Ping, Ablaufwarnung, bei „beendet“ Custom Domain lösen */
export function cloudflareDienst(k, env) { return null; }
export async function instanzenPruefen(k, sp, env) { return { ok: true, leer: true }; }

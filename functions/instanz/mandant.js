/* eeziframes · Mandant: Host → Instanz (Strang A, Bauplan §3 A.2; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0): Bis Strang A baut, ist jeder Host die Hauptdomain und es gibt keine Instanz; eeziframes.com verhält sich
   unverändert. Feste Exportnamen:
     hostVon(request)            Host der Anfrage: klein, ohne Port, ohne www., IDN als Punycode; nie aus X-Forwarded-Host o. Ä.
     istHaupt(host, env)         eeziframes.com, www, KANONISCH, *.workers.dev, localhost, 127.*, [::1], HAUPT_HOSTS (ohne Datenbank)
     instanzVon(host, env, ctx)  ctx.instanz (Vertrag in docs/INSTANZEN.md) oder null; L1-Cache im Isolate, L2 KV INSTANZEN, L3 rpc/instanz_fuer_host
     auftritt(inst)              öffentliches Profil der Startansicht (wie Einladung.auftritt, freie Hex-Farbe)
     cacheVergessen(host)        L1-Eintrag eines Hosts verwerfen (verwalten.cacheLeeren) */
export function hostVon(request) {
  let h = '';
  try { h = new URL(request.url).hostname.toLowerCase(); } catch (e) { h = ''; }
  return h.replace(/^www\./, '').replace(/\.$/, '');
}
export function istHaupt(host, env) { return true; } // Stub: alles ist Hauptdomain
export async function instanzVon(host, env, ctx) { return null; } // Stub: keine Instanzen
export function auftritt(inst) { return null; }
export function cacheVergessen(host) { return true; }

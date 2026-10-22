/* eeziframes · Mandant: Host → Instanz (Strang A, Bauplan §3 A.2; Vertrag ctx.instanz in docs/INSTANZEN.md)
   Jeder Host, der nicht die Hauptdomain ist, gehört zu einer Konfigurator-Instanz (Tabelle instanz_hosts). Die Hauptdomain erkennt
   istHaupt() ohne Datenbank (E5): eeziframes.com samt www, der Host aus KANONISCH, …workers.dev, lokale Adressen und HAUPT_HOSTS.
   Zwischenspeicher (K2.19, E22):
     L1  Map im Isolate: ein Treffer gilt INSTANZ_CACHE_MS (Vorgabe 60 s), ein unbekannter Host 300 s; höchstens 2000 Einträge
     L2  KV-Namensraum INSTANZEN (falls gebunden, Schlüssel host:<host>): Spiegel des letzten bekannten Stands
     L3  rpc/instanz_fuer_host (Supabase) bzw. die Attrappe
   Antwortet die Datenbank nicht, gilt der letzte bekannte Stand weiter (L1, auch abgelaufen, sonst KV); erst ohne beides 503.
   Gibt es die Tabellen der Instanzen noch nicht (schema.sql nicht erneut ausgeführt) oder gar keine Datenbank, ist jeder Host die
   Hauptdomain wie bisher (Rückgabe undefined): So bleibt eine weitere Domain am Worker (etwa eeziframes.de) erreichbar, bis eingerichtet ist.
   API:
     hostVon(request)            Host: klein, ohne Port, ohne www., ohne Punkt am Ende, IDN als Punycode; nur aus der Adresse der Anfrage,
                                 nie aus X-Forwarded-Host oder ähnlichen Kopfzeilen
     istHaupt(host, env)         Hauptdomain ohne Datenbank
     instanzVon(host, env, ctx)  ctx.instanz (ohne vorschau) | null (unbekannter Host) | undefined (keine Instanzen eingerichtet)
                                 | { stoerung: true } (Datenbank weg, nichts bekannt)
     instanzAusZeile(t, host)    ctx.instanz aus dem Ergebnis von instanz_fuer_host
     auftritt(inst)              öffentliches Profil der Startansicht (Einladung.auftritt mit freier Hex-Farbe der Marke)
     cacheVergessen(host)        L1-Eintrag eines Hosts verwerfen (verwalten.cacheLeeren löscht dazu den KV-Schlüssel) */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import '../../web/assets/einladung.js';
import { konfig } from '../api/umgebung.js';
import { speicher } from '../api/speicher.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const EIN = () => globalThis.Einladung;

export function hostVon(request) {
  let h = '';
  try { h = new URL(request.url).hostname.toLowerCase(); } catch (e) { h = ''; }
  return h.replace(/\.$/, '').replace(/^www\./, '');
}
const LOKAL = /^(localhost|127(\.\d{1,3}){3}|\[::1\]|::1|0\.0\.0\.0)$/;
const hostAusAdresse = (s) => { try { return new URL(/^https?:\/\//i.test(String(s)) ? String(s) : 'https://' + String(s)).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) { return ''; } };
export function istHaupt(host, env) {
  const h = String(host || '').toLowerCase().replace(/^www\./, '');
  if (!h || LOKAL.test(h) || /\.workers\.dev$/.test(h)) return true;
  if (h === 'eeziframes.com' || h === 'eeziframes.de') return true;
  /* weitere eigene Adressen von eeziframes sind nie eine Instanz, außer den Demo-Instanzen der Verkaufsseite (demo-*.eeziframes.com) */
  if (/\.eeziframes\.(com|de)$/.test(h) && !/^demo-[a-z0-9-]+\.eeziframes\.com$/.test(h)) return true;
  if (env && env.KANONISCH && hostAusAdresse(env.KANONISCH) === h) return true;
  if (env && env.HAUPT_HOSTS && String(env.HAUPT_HOSTS).split(',').map((x) => hostAusAdresse(x.trim())).filter(Boolean).indexOf(h) >= 0) return true;
  return false;
}

/* ---------- L1 ---------- */
const L1 = new Map();
const MAX_L1 = 2000;
const cacheMs = (env) => { const n = Number(env && env.INSTANZ_CACHE_MS); return env && env.INSTANZ_CACHE_MS !== undefined && env.INSTANZ_CACHE_MS !== '' && !isNaN(n) ? Math.max(0, n) : 60000; };
function l1Setzen(host, wert, ttl) {
  L1.delete(host);
  L1.set(host, { wert: wert, bis: Date.now() + ttl });
  if (L1.size > MAX_L1) { for (const k of L1.keys()) { if (L1.size <= MAX_L1 * 0.9) break; L1.delete(k); } }
}
export function cacheVergessen(host) { if (host) L1.delete(String(host).toLowerCase().replace(/^www\./, '')); else L1.clear(); return true; }
/* nur für die Prüfung (Störung der Datenbank nachstellen, POST /api/instanz/test): */
export const pruefStoerung = { an: false };

async function kvLesen(env, host) {
  if (!env || !env.INSTANZEN || typeof env.INSTANZEN.get !== 'function') return null;
  try { const t = await env.INSTANZEN.get('host:' + host, 'json'); return t && t.instanz ? t : null; } catch (e) { return null; }
}
async function kvSchreiben(env, host, t, ctx) {
  if (!env || !env.INSTANZEN || typeof env.INSTANZEN.put !== 'function') return;
  const arbeit = (async () => {
    try {
      const alt = await env.INSTANZEN.get('host:' + host, 'json');
      if (alt && alt.instanz && t && t.instanz && alt.instanz.version === t.instanz.version && alt.instanz.status === t.instanz.status && alt.haupthost === t.haupthost) return;
      await env.INSTANZEN.put('host:' + host, JSON.stringify(t));
    } catch (e) { /* Spiegel ist nur Rückfall */ }
  })();
  if (ctx && ctx.waitUntil) ctx.waitUntil(arbeit); else await arbeit;
}

/* Rohdaten (Ergebnis von instanz_fuer_host) für einen Host: Objekt, null (unbekannt), undefined (keine Instanzen), { stoerung } */
async function roh(host, env, ctx) {
  const jetzt = Date.now(), e = L1.get(host);
  if (e && e.bis > jetzt) return e.wert;
  const k = konfig(env), sp = k.daten ? speicher(k) : null;
  if (!sp || !sp.instanzFuerHost) return undefined;
  let t;
  try {
    if (pruefStoerung.an && k.datenAttrappe) throw new Error('Störung (Prüfung)');
    t = await sp.instanzFuerHost(host);
  } catch (err) {
    if (e) return e.wert; // letzter bekannter Stand, auch abgelaufen
    const kv = await kvLesen(env, host);
    if (kv) return kv;
    console.log('Instanz nicht lesbar', host, String(err && err.message ? err.message : err).slice(0, 120));
    return { stoerung: true };
  }
  if (t === undefined) return undefined; // Tabellen fehlen: Hauptdomain wie bisher
  l1Setzen(host, t || null, t ? cacheMs(env) : Math.max(cacheMs(env), cacheMs(env) === 0 ? 0 : 300000));
  if (t) await kvSchreiben(env, host, t, ctx);
  return t || null;
}

export async function instanzVon(host, env, ctx) {
  host = String(host || '').toLowerCase().replace(/^www\./, '');
  const t = await roh(host, env, ctx);
  if (t === undefined || t === null) return t;
  if (t.stoerung) return t;
  return instanzAusZeile(t, host);
}

const id8Von = (id) => String(id || '').replace(/-/g, '').slice(0, 8);
export function instanzAusZeile(t, host) {
  const i = t.instanz || {}, b = t.betrieb || {}, m = P().merkmale(i.paket, i.abweichung);
  if (!m) return null;
  const marke = i.marke && typeof i.marke === 'object' ? i.marke : {};
  const ein = b.einladung && typeof b.einladung === 'object' ? b.einladung : {};
  const name = String(marke.name || b.name || '').trim() || 'Fensterplaner';
  const recht = i.recht && typeof i.recht === 'object' ? i.recht : {};
  const tel = String(ein.telefon || b.tel || recht.tel || '').trim(), mail = String(ein.mail || b.mail || recht.mail || '').trim();
  const eingang = i.eingang && typeof i.eingang === 'object' ? i.eingang : {};
  const inst = {
    id: i.id, id8: id8Von(i.id), slug: i.slug, betrieb: b.id || i.betrieb, host: host || t.host, haupt: !!t.haupt, hostStatus: t.hostStatus || '',
    haupthost: t.haupthost || t.host || host, status: i.status, paket: i.paket, m: m, version: Number(i.version) || 1, name: name,
    du: ein.anrede === 'du' || b.du === true, plz: b.plz || '', marke: marke, recht: recht,
    eingang: { mails: (Array.isArray(eingang.mails) ? eingang.mails : []).filter((x) => x && x.bestaetigt && R().mailOk(x.mail)).map((x) => ({ mail: String(x.mail).toLowerCase(), bestaetigt: x.bestaetigt })), absendername: eingang.absendername || '' },
    demo: !!i.demo, indexierung: !!i.indexierung, vorschau: false, kontakt: { tel: tel, mail: mail },
    pause_bis: i.pause_bis || null, ende_am: i.ende_am || null, gesperrt: !!b.sperre,
    profil: { einladung: ein, ap: b.ap || '', tel: b.tel || '', mail: b.mail || '' }
  };
  inst.auftritt = auftritt(inst);
  return inst;
}

/* Firmenfarbe der Marke als --accent: nur mit Merkmal farbe und gültiger Hex-Farbe; zu dunkle Farben werden aufgehellt (Kontrast) */
export function farbeVon(inst) {
  const f = inst && inst.m && inst.m.farbe ? String((inst.marke || {}).farbe || '').toLowerCase() : '';
  if (!/^#[0-9a-f]{6}$/.test(f)) return { farbe: '', akzent: '' };
  return { farbe: f, akzent: R().akzent(f) || '' };
}
export function auftritt(inst) {
  if (!inst) return null;
  const p = inst.profil || {}, a = EIN().auftritt({ einladung: p.einladung, ap: p.ap, tel: p.tel, mail: p.mail }, null);
  const f = farbeVon(inst);
  a.logo = ''; // das Logo der Instanz liegt unter /marke/<v>/… (KONFIG.instanz.logo), nicht als Data-URL im Profil
  if (f.farbe) a.col = f.farbe;
  if (!inst.m.startansicht) { a.gruss = { sie: '', du: '' }; }
  return a;
}

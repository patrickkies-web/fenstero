/* eeziframes · Bremsen und Budgets der Konfigurator-Instanzen (Bauplan E12, K1.2)
   bremse(ctx, name, schluessel) → true (weiter) | false (zu viele):
     über das Rate-Limiting-Binding von Cloudflare (env.RL_LINK, RL_START, RL_FOTO, RL_KI, RL_OTP, RL_FORM; wrangler.jsonc „ratelimits“),
     je Standort gezählt, ohne Speicher. Fehlt das Binding (lokal, oder nicht eingerichtet) oder antwortet es nicht, zählt die Bremse
     im Arbeitsspeicher dieser Instanz (erlaubt(), umgebung.js) mit denselben Grenzen.
   budget(ctx, schluessel, max, { alarm, monat }) → { ok, stand, alarm }:
     dauerhafter Zähler je Tag (oder je Monat) in der Tabelle statistik (Schlüssel budget:<schluessel>), z. B. KI-Auswertungen einer
     Instanz im Monat, Fehlversuche je Adresse am Tag. Jeder Aufruf zählt eins hoch; ok, solange der Stand höchstens max ist; alarm
     genau einmal, wenn der Stand die Alarmgrenze erreicht (dann eine Mail an den Inhaber schicken). Ohne Datenbank im Arbeitsspeicher.
   Der Tag ist der deutsche Kalendertag; mit JETZT (nur Prüfung) zählt die vorgestellte Uhr. */
import { erlaubt, jetztAus } from './umgebung.js';
import { tagBerlin } from './statistik.js';

/* Grenzen wie in wrangler.jsonc (limit je period Sekunden); gelten auch für den Rückfall im Arbeitsspeicher */
export const BREMSEN = {
  RL_LINK: { limit: 60, period: 60 },
  RL_START: { limit: 10, period: 60 },
  RL_FOTO: { limit: 60, period: 60 },
  RL_KI: { limit: 20, period: 60 },
  RL_OTP: { limit: 5, period: 60 },
  RL_FORM: { limit: 5, period: 60 }
};
const name = (n) => { const x = String(n || '').toUpperCase(); return x.startsWith('RL_') ? x : 'RL_' + x; };

export async function bremse(ctx, n, schluessel) {
  const rl = name(n), g = BREMSEN[rl]; if (!g) throw new Error('Unbekannte Bremse ' + rl);
  const key = String(schluessel == null ? '' : schluessel).slice(0, 200);
  const binding = ctx && ctx.env && ctx.env[rl];
  if (binding && typeof binding.limit === 'function') {
    try { const r = await binding.limit({ key: key }); return !!(r && r.success); } catch (e) { /* Binding antwortet nicht: Rückfall */ }
  }
  return erlaubt('rl:' + rl + ':' + key, g.limit, g.period * 1000);
}

const speicherZaehler = new Map();
export async function budget(ctx, schluessel, max, o) {
  o = o || {};
  const t = jetztAus(ctx && ctx.env), tag = tagBerlin(new Date(t)), periode = o.monat ? tag.slice(0, 8) + '01' : tag;
  const key = 'budget:' + String(schluessel).slice(0, 110);
  let stand;
  const sp = ctx && ctx.sp;
  if (sp && sp.zaehlerErhoehen) { try { stand = await sp.zaehlerErhoehen(periode, key, 1); } catch (e) { stand = undefined; } }
  if (stand === undefined || stand === null) {
    const k2 = periode + '|' + key; stand = (speicherZaehler.get(k2) || 0) + 1; speicherZaehler.set(k2, stand);
    if (speicherZaehler.size > 5000) speicherZaehler.clear();
  }
  return { ok: stand <= max, stand: stand, alarm: !!o.alarm && stand === o.alarm };
}
/* Monat als Periode 'JJJJ-MM-01' nach deutschem Kalender; versatz -1 = Vormonat (Abrechnung des KI-Kontingents) */
export function monatsPeriode(ms, versatz) {
  const t = tagBerlin(new Date(ms)); let j = Number(t.slice(0, 4)), m = Number(t.slice(5, 7)) + (versatz || 0);
  while (m < 1) { m += 12; j--; } while (m > 12) { m -= 12; j++; }
  return j + '-' + String(m).padStart(2, '0') + '-01';
}
/* Nur lesen, ohne zu zählen (Zentrale, Kundenbereich, Abrechnung); o.periode: ein bestimmter Tag oder Monat ('JJJJ-MM-01') */
export async function budgetStand(ctx, schluessel, o) {
  o = o || {};
  const t = jetztAus(ctx && ctx.env), tag = tagBerlin(new Date(t)), periode = o.periode || (o.monat ? tag.slice(0, 8) + '01' : tag), key = 'budget:' + String(schluessel).slice(0, 110);
  const sp = ctx && ctx.sp;
  if (sp && sp.zaehlerLesen) { try { const r = await sp.zaehlerLesen(periode, [key]); if (r) return r[key] || 0; } catch (e) { /* weiter */ } }
  return speicherZaehler.get(periode + '|' + key) || 0;
}

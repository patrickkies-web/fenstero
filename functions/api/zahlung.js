/* eeziframes · Das Aufmaßblatt des Hauseigentümers kaufen (7,99 €): Kasse bei Stripe, Prüfung nach der Rückkehr, Freischalt-Nachweis, Webhook.
   Der Nachweis ist eine Unterschrift (HMAC) über Kennung des Projekts und Stripe-Sitzung; die App erzeugt PDF und Code nur mit gültigem Nachweis.
   Ohne Datenbank funktioniert der Kauf zum Testen trotzdem (Stripe ist das Buch); mit Datenbank wird jede Zahlung zusätzlich festgehalten.
   Gibt es Konten für Hauseigentümer (eigene.js, Tabelle eigene), geht der Kauf nur mit Konto und nur für ein gesichertes Aufmaß dieses
   Kontos; die Rechnung geht an die E-Mail des Kontos, und der Kauf wird am Aufmaß vermerkt (auf jedem Gerät da, die freie Woche endet).
   Die Kasse nimmt nur an, wer an der Kasse den AGB in der geltenden Fassung und der sofortigen Bereitstellung zugestimmt hat (recht.js);
   beides steht mit Zeitpunkt in der Zahlung und in den Metadaten der Stripe-Kasse. Mit echtem Geld (Live-Modus) bleibt die Kasse zu,
   bis Mailversand, Umsatzsteuer, Konten und Rechtstexte stehen (verkaufStand).
   Beim ersten Wechsel auf „bezahlt“ geht die Vertragsbestätigung mit AGB und Widerrufsbelehrung per E-Mail raus (bestaetigung.js); klappt
   das nicht, holt der tägliche Lauf sie nach (bestaetigungenNachholen). */
import { ApiFehler, erlaubt, quelle, live } from './umgebung.js';
import { webhookEcht, zustimmungAus } from './stripe.js';
import { stripeEreignis } from './konten.js';
import { nutzer } from './auth.js';
import { kontenDa, eigenesBezahlt, kaufNachweis, entfernt } from './eigene.js';
import { kaufBestaetigen } from './bestaetigung.js';
import { AGB_STAND, ZUSTIMMUNG, verkaufStand } from './recht.js';
import { istPaketEreignis, paketEreignis } from './bestellung.js';

const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const kennungOk = (s) => /^[A-Za-z0-9_-]{6,40}$/.test(s);
export const nachweis = kaufNachweis;

/* Eine Zahlung ist bezahlt (Rückkehr aus der Kasse oder Webhook, auch beide zugleich): festhalten und, nur beim ersten Mal, zählen und
   die Vertragsbestätigung schicken. „Das erste Mal“ entscheidet die Datenbank (zahlungBezahlt ändert nur eine noch offene Zahlung). */
async function bezahltFesthalten(ctx, z) {
  const token = await nachweis(ctx.k, z.kennung, z.session), jetzt = new Date().toISOString();
  const erstes = await ctx.sp.zahlungBezahlt({ stripe_session: z.session, art: 'aufmass', kennung: z.kennung, mail: z.mail || '', betrag_cent: z.betragCent || 0, token: token, bezahlt_am: jetzt, daten: z.zustimmung ? { zustimmung: z.zustimmung } : {} });
  if (erstes) {
    if (ctx.zaehlen) ctx.zaehlen('ereignis:kauf');
    const row = await ctx.sp.zahlungHolen(z.session).catch(() => null);
    const zustimmung = (row && row.daten && row.daten.zustimmung) || z.zustimmung || null;
    ctx.waitUntil(kaufBestaetigen(ctx, { session: z.session, mail: z.mail || (row && row.mail) || '', kennung: z.kennung, betragCent: z.betragCent || (row && row.betrag_cent) || 0, zustimmung: zustimmung, zeit: jetzt }).catch(() => false));
  }
  return token;
}

export const ZAHLUNG = {
  'POST /api/zahlung/start': async (ctx) => {
    if (!erlaubt('kasse:' + quelle(ctx.request), 20, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte gleich noch einmal.', 429);
    const b = ctx.body || {}, kennung = str(b.kennung, 40);
    let mail = str(b.mail, 120).toLowerCase(), wer = '';
    if (!kennungOk(kennung)) throw new ApiFehler('Kennung des Projekts fehlt.');
    const mitKonten = ctx.sp ? await kontenDa(ctx.sp) : false;
    if (mitKonten === undefined) throw new ApiFehler('Die Kasse ist gerade nicht erreichbar. Bitte gleich noch einmal.', 503); // Datenbank gestört: nicht ohne Konto verkaufen
    /* Echtes Geld erst, wenn alles für Verträge mit Verbrauchern steht (recht.js); /api/status nennt, was fehlt */
    if (live(ctx.k)) {
      const v = await verkaufStand(ctx.k, ctx.env, ctx.url.origin, mitKonten);
      if (!v.bereit) { console.log('Kasse gesperrt, es fehlt:', v.fehlt.join('; ')); throw new ApiFehler('Der Kauf ist gerade nicht möglich. Bitte versuch es später noch einmal.', 503, { gesperrt: true }); }
    }
    if (mitKonten) {
      const n = await nutzer(ctx.k, (ctx.request.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''));
      if (!n) throw new ApiFehler('Bitte sichere dein Aufmaß zuerst mit deiner E-Mail-Adresse.', 401, { anmelden: true });
      const e = await ctx.sp.eigenesHolen(kennung);
      if (!e) throw new ApiFehler('Bitte sichere dein Aufmaß zuerst.', 409, { sichern: true });
      if (entfernt(e) && (!e.nutzer || e.nutzer === n.id)) throw new ApiFehler('Dieses Aufmaß wurde gelöscht.', 410, { geloescht: true });
      if (!e.nutzer) throw new ApiFehler('Bitte sichere dein Aufmaß zuerst.', 409, { sichern: true }); // ohne Besitzer: die App sichert es unter neuer Kennung
      if (e.nutzer !== n.id) throw new ApiFehler('Dieses Aufmaß gehört zu einem anderen Konto.', 403, { fremd: true });
      if (e.meta && e.meta.bezahlt && e.meta.bezahlt.session) return { ok: true, schon: true }; // schon freigeschaltet: kein zweiter Kauf
      mail = n.mail; wer = n.id;
    }
    /* Zustimmung an der Kasse: AGB in der geltenden Fassung und sofortige Bereitstellung, im Wortlaut, den die App gezeigt hat
       (geprüft nach Konto und Aufmaß: Ist es gelöscht oder schon gekauft, hilft keine Zustimmung) */
    if (b.agb !== AGB_STAND || b.zustimmung !== ZUSTIMMUNG) {
      if (!b.agb || !b.zustimmung) throw new ApiFehler('Bitte stimme den AGB und der sofortigen Bereitstellung zu.', 400, { zustimmung: true });
      throw new ApiFehler('Unsere AGB oder der Text zur Zustimmung haben sich gerade geändert. Bitte lies sie und stimme noch einmal zu.', 409, { neuLaden: true, recht: { agb: AGB_STAND, zustimmung: ZUSTIMMUNG } });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
    const zurueck = ctx.url.origin + '/app/', zustimmung = { agb: AGB_STAND, text: ZUSTIMMUNG, zeit: new Date().toISOString() };
    const kasse = await ctx.zd.aufmassKasse({ mail: mail, kennung: kennung, zurueck: zurueck, nutzer: wer, zustimmung: zustimmung });
    if (ctx.sp) { try { await ctx.sp.zahlungAnlegen({ stripe_session: kasse.id, art: 'aufmass', kennung: kennung, mail: mail, betrag_cent: Math.round(ctx.k.preise.aufmass * 100), status: 'offen', daten: { zustimmung: zustimmung } }); } catch (e) { console.log('Zahlung nicht vorgemerkt', String(e).slice(0, 120)); } }
    if (ctx.zaehlen) ctx.zaehlen('ereignis:kasse');
    return { ok: true, url: kasse.url };
  },
  'GET /api/zahlung/pruefen': async (ctx) => {
    const session = str(ctx.url.searchParams.get('session'), 120), kennungApp = str(ctx.url.searchParams.get('kennung'), 40);
    if (!session) throw new ApiFehler('Keine Zahlung angegeben.');
    const r = await ctx.zd.kasseGeprueft(session);
    if (!r.bezahlt) return { ok: false, bezahlt: false, wartet: !!r.wartet };
    const kennung = r.kennung || kennungApp; if (!kennungOk(kennung)) throw new ApiFehler('Zahlung gehört zu keinem Aufmaß.');
    let token = await nachweis(ctx.k, kennung, session);
    /* Festhalten gilt immer für das Aufmaß der Zahlung, auch wenn in diesem Browser gerade ein anderes offen ist (anderer Tab,
       gewechselt): Mit Konto ist der Kauf dann trotzdem am richtigen Aufmaß */
    if (ctx.sp) {
      try { token = await bezahltFesthalten(ctx, { session: session, kennung: kennung, mail: r.mail || '', betragCent: r.betragCent || 0, zustimmung: r.zustimmung || null }); } catch (e) { console.log('Zahlung nicht festgehalten', String(e).slice(0, 120)); }
      try { await eigenesBezahlt(ctx.sp, kennung, session, token); } catch (e) { console.log('Kauf nicht am Aufmaß vermerkt', String(e).slice(0, 120)); }
    }
    if (r.kennung && kennungApp && r.kennung !== kennungApp) return { ok: false, bezahlt: false, anderes: true, kennung: r.kennung }; // bezahlt, aber für ein anderes Aufmaß
    return { ok: true, bezahlt: true, kennung: kennung, token: token, mail: r.mail || '' };
  },
  /* Nachweis prüfen (z. B. auf einem anderen Gerät): Kennung + Sitzung + Nachweis */
  'GET /api/zahlung/nachweis': async (ctx) => {
    const kennung = str(ctx.url.searchParams.get('kennung'), 40), session = str(ctx.url.searchParams.get('session'), 120), token = str(ctx.url.searchParams.get('token'), 64);
    if (!kennungOk(kennung) || !session || !token) return { ok: false };
    return { ok: (await nachweis(ctx.k, kennung, session)) === token };
  },
  /* Webhook: Unterschrift prüfen, jedes Ereignis nur einmal verarbeiten. Als erledigt vermerkt wird es erst nach der Verarbeitung:
     Schlägt sie fehl (Datenbank kurz weg, Worker abgebrochen), antwortet der Server mit einem Fehler und Stripe stellt später erneut zu.
     Doppelt verarbeitet richtet keinen Schaden an, weil jeder Schritt wiederholbar ist (Kasse je Betrieb nur einmal, Status setzen).
     Beide Formate eines Ereignisziels bei Stripe gehen: Snapshot (das Objekt steckt im Ereignis) und Thin (Typ v1.… und ein Verweis;
     dann holt der Server das Objekt selbst und verarbeitet es wie ein Snapshot-Ereignis). */
  'POST /api/zahlung/webhook': async (ctx) => {
    const roh = ctx.roh || '';
    if (!(await webhookEcht(ctx.k, roh, ctx.request.headers.get('stripe-signature')))) throw new ApiFehler('Unterschrift ungültig.', 400);
    let ev = null; try { ev = JSON.parse(roh); } catch (e) { throw new ApiFehler('Kein Ereignis.'); }
    if (!ev || !ev.id || !ev.type) throw new ApiFehler('Kein Ereignis.');
    if (ctx.sp && (await ctx.sp.ereignisBekannt(ev.id))) return { ok: true, doppelt: true };
    if (ev.object === 'v2.core.event') {
      const ref = ev.related_object, voll = ref && ref.url ? await ctx.zd.objekt(ref.url) : null;
      ev = { id: ev.id, type: String(ev.type).replace(/^v1\./, ''), data: { object: voll || {} } };
    }
    const obj = ev.data && ev.data.object ? ev.data.object : {};
    /* Konfigurator-Pakete (bestellung.js): Objekte mit metadata.art einrichtung/paket, Abos und Rückbuchungen der Pakete; nie ein
       Betrieb oder ein Aufmaßblatt. Alles andere läuft unverändert weiter */
    if (await istPaketEreignis(ctx, ev)) { if (ctx.sp) await paketEreignis(ctx, ev); }
    else if ((ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded') && obj.mode === 'payment') {
      const kennung = (obj.metadata && obj.metadata.kennung) || obj.client_reference_id || '';
      const z = { session: obj.id, kennung: kennung, mail: (obj.customer_details && obj.customer_details.email) || obj.customer_email || '', betragCent: obj.amount_total || 0, zustimmung: zustimmungAus(obj.metadata) };
      if (kennungOk(kennung) && obj.payment_status === 'paid' && obj.metadata && obj.metadata.art === 'aufmass') {
        if (ctx.sp) { const token = await bezahltFesthalten(ctx, z); await eigenesBezahlt(ctx.sp, kennung, obj.id, token); }
        else ctx.waitUntil(kaufBestaetigen(ctx, z).catch(() => false)); // ohne Datenbank (nur zum Testen): einmal je Webhook-Zustellung
      }
    } else if (ctx.sp) await stripeEreignis(ctx.sp, ev, ctx.zd);
    if (ctx.sp) await ctx.sp.ereignisNeu(ev.id);
    return { ok: true };
  }
};

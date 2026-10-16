/* eeziframes · Das Aufmaßblatt des Hauseigentümers kaufen (7,99 €): Kasse bei Stripe, Prüfung nach der Rückkehr, Freischalt-Nachweis, Webhook.
   Der Nachweis ist eine Unterschrift (HMAC) über Kennung des Projekts und Stripe-Sitzung; die App erzeugt PDF und Code nur mit gültigem Nachweis.
   Ohne Datenbank funktioniert der Kauf trotzdem (Stripe ist das Buch); mit Datenbank wird jede Zahlung zusätzlich festgehalten.
   Gibt es Konten für Hauseigentümer (eigene.js, Tabelle eigene), geht der Kauf nur mit Konto und nur für ein gesichertes Aufmaß dieses
   Kontos; die Rechnung geht an die E-Mail des Kontos, und der Kauf wird am Aufmaß vermerkt (auf jedem Gerät da, die freie Woche endet). */
import { ApiFehler, erlaubt, quelle } from './umgebung.js';
import { webhookEcht } from './stripe.js';
import { stripeEreignis } from './konten.js';
import { nutzer } from './auth.js';
import { kontenDa, eigenesBezahlt, kaufNachweis, entfernt } from './eigene.js';

const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const kennungOk = (s) => /^[A-Za-z0-9_-]{6,40}$/.test(s);
export const nachweis = kaufNachweis;

export const ZAHLUNG = {
  'POST /api/zahlung/start': async (ctx) => {
    if (!erlaubt('kasse:' + quelle(ctx.request), 20, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte gleich noch einmal.', 429);
    const b = ctx.body || {}, kennung = str(b.kennung, 40);
    let mail = str(b.mail, 120).toLowerCase(), wer = '';
    if (!kennungOk(kennung)) throw new ApiFehler('Kennung des Projekts fehlt.');
    const mitKonten = ctx.sp ? await kontenDa(ctx.sp) : false;
    if (mitKonten === undefined) throw new ApiFehler('Die Kasse ist gerade nicht erreichbar. Bitte gleich noch einmal.', 503); // Datenbank gestört: nicht ohne Konto verkaufen
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
    const zurueck = ctx.url.origin + '/app/';
    const kasse = await ctx.zd.aufmassKasse({ mail: mail, kennung: kennung, zurueck: zurueck, nutzer: wer });
    if (ctx.sp) { try { await ctx.sp.zahlungAnlegen({ stripe_session: kasse.id, art: 'aufmass', kennung: kennung, mail: mail, betrag_cent: Math.round(ctx.k.preise.aufmass * 100), status: 'offen' }); } catch (e) { console.log('Zahlung nicht vorgemerkt', String(e).slice(0, 120)); } }
    if (ctx.zaehlen) ctx.zaehlen('ereignis:kasse');
    return { ok: true, url: kasse.url };
  },
  'GET /api/zahlung/pruefen': async (ctx) => {
    const session = str(ctx.url.searchParams.get('session'), 120), kennungApp = str(ctx.url.searchParams.get('kennung'), 40);
    if (!session) throw new ApiFehler('Keine Zahlung angegeben.');
    const r = await ctx.zd.kasseGeprueft(session);
    if (!r.bezahlt) return { ok: false, bezahlt: false, wartet: !!r.wartet };
    const kennung = r.kennung || kennungApp; if (!kennungOk(kennung)) throw new ApiFehler('Zahlung gehört zu keinem Aufmaß.');
    const token = await nachweis(ctx.k, kennung, session);
    /* Festhalten gilt immer für das Aufmaß der Zahlung, auch wenn in diesem Browser gerade ein anderes offen ist (anderer Tab,
       gewechselt): Mit Konto ist der Kauf dann trotzdem am richtigen Aufmaß */
    if (ctx.sp) { try { const vorher = await ctx.sp.zahlungHolen(session); if (vorher) await ctx.sp.zahlungAendern(session, { status: 'bezahlt', token: token, mail: r.mail || vorher.mail }); else await ctx.sp.zahlungAnlegen({ stripe_session: session, art: 'aufmass', kennung: kennung, mail: r.mail || '', betrag_cent: r.betragCent || 0, status: 'bezahlt', token: token }); if (ctx.zaehlen && (!vorher || vorher.status !== 'bezahlt')) ctx.zaehlen('ereignis:kauf'); } catch (e) { console.log('Zahlung nicht festgehalten', String(e).slice(0, 120)); }
      try { await eigenesBezahlt(ctx.sp, kennung, session, token); } catch (e) { console.log('Kauf nicht am Aufmaß vermerkt', String(e).slice(0, 120)); } }
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
    if ((ev.type === 'checkout.session.completed' || ev.type === 'checkout.session.async_payment_succeeded') && obj.mode === 'payment') {
      const kennung = (obj.metadata && obj.metadata.kennung) || obj.client_reference_id || '';
      if (ctx.sp && kennungOk(kennung) && obj.payment_status === 'paid' && obj.metadata && obj.metadata.art === 'aufmass') { const token = await nachweis(ctx.k, kennung, obj.id); const vorher = await ctx.sp.zahlungHolen(obj.id); if (vorher) await ctx.sp.zahlungAendern(obj.id, { status: 'bezahlt', token: token }); else await ctx.sp.zahlungAnlegen({ stripe_session: obj.id, art: 'aufmass', kennung: kennung, mail: (obj.customer_details && obj.customer_details.email) || '', betrag_cent: obj.amount_total || 0, status: 'bezahlt', token: token }); if (ctx.zaehlen && (!vorher || vorher.status !== 'bezahlt')) ctx.zaehlen('ereignis:kauf'); await eigenesBezahlt(ctx.sp, kennung, obj.id, token); }
    } else if (ctx.sp) await stripeEreignis(ctx.sp, ev, ctx.zd);
    if (ctx.sp) await ctx.sp.ereignisNeu(ev.id);
    return { ok: true };
  }
};

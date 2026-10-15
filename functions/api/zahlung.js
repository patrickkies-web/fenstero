/* eeziframes · Das Aufmaßblatt des Hauseigentümers kaufen (7,99 €): Kasse bei Stripe, Prüfung nach der Rückkehr, Freischalt-Nachweis, Webhook.
   Der Nachweis ist eine Unterschrift (HMAC) über Kennung des Projekts und Stripe-Sitzung; die App erzeugt PDF und Code nur mit gültigem Nachweis.
   Ohne Datenbank funktioniert der Kauf trotzdem (Stripe ist das Buch); mit Datenbank wird jede Zahlung zusätzlich festgehalten. */
import { ApiFehler, hmac, b64url, erlaubt, ip } from './umgebung.js';
import { webhookEcht } from './stripe.js';
import { stripeEreignis } from './konten.js';

const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const kennungOk = (s) => /^[A-Za-z0-9_-]{6,40}$/.test(s);
export async function nachweis(k, kennung, session) { return b64url(await hmac(k.geheimnis, 'aufmass.' + kennung + '.' + session)).slice(0, 32); }

export const ZAHLUNG = {
  'POST /api/zahlung/start': async (ctx) => {
    if (!erlaubt('kasse:' + ip(ctx.request), 20, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte gleich noch einmal.', 429);
    const b = ctx.body || {}, mail = str(b.mail, 120).toLowerCase(), kennung = str(b.kennung, 40);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
    if (!kennungOk(kennung)) throw new ApiFehler('Kennung des Projekts fehlt.');
    const zurueck = ctx.url.origin + '/app/';
    const kasse = await ctx.zd.aufmassKasse({ mail: mail, kennung: kennung, zurueck: zurueck });
    if (ctx.sp) { try { await ctx.sp.zahlungAnlegen({ stripe_session: kasse.id, art: 'aufmass', kennung: kennung, mail: mail, betrag_cent: Math.round(ctx.k.preise.aufmass * 100), status: 'offen' }); } catch (e) { console.log('Zahlung nicht vorgemerkt', String(e).slice(0, 120)); } }
    return { ok: true, url: kasse.url };
  },
  'GET /api/zahlung/pruefen': async (ctx) => {
    const session = str(ctx.url.searchParams.get('session'), 120), kennungApp = str(ctx.url.searchParams.get('kennung'), 40);
    if (!session) throw new ApiFehler('Keine Zahlung angegeben.');
    const r = await ctx.zd.kasseGeprueft(session);
    if (!r.bezahlt) return { ok: false, bezahlt: false, wartet: !!r.wartet };
    if (r.kennung && kennungApp && r.kennung !== kennungApp) return { ok: false, bezahlt: false }; // bezahlt, aber für ein anderes Projekt
    const kennung = r.kennung || kennungApp; if (!kennungOk(kennung)) throw new ApiFehler('Zahlung gehört zu keinem Aufmaß.');
    const token = await nachweis(ctx.k, kennung, session);
    if (ctx.sp) { try { const vorher = await ctx.sp.zahlungHolen(session); if (vorher) await ctx.sp.zahlungAendern(session, { status: 'bezahlt', token: token, mail: r.mail || vorher.mail }); else await ctx.sp.zahlungAnlegen({ stripe_session: session, art: 'aufmass', kennung: kennung, mail: r.mail || '', betrag_cent: r.betragCent || 0, status: 'bezahlt', token: token }); } catch (e) { console.log('Zahlung nicht festgehalten', String(e).slice(0, 120)); } }
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
      if (ctx.sp && kennungOk(kennung) && obj.payment_status === 'paid' && obj.metadata && obj.metadata.art === 'aufmass') { const token = await nachweis(ctx.k, kennung, obj.id); const vorher = await ctx.sp.zahlungHolen(obj.id); if (vorher) await ctx.sp.zahlungAendern(obj.id, { status: 'bezahlt', token: token }); else await ctx.sp.zahlungAnlegen({ stripe_session: obj.id, art: 'aufmass', kennung: kennung, mail: (obj.customer_details && obj.customer_details.email) || '', betrag_cent: obj.amount_total || 0, status: 'bezahlt', token: token }); }
    } else if (ctx.sp) await stripeEreignis(ctx.sp, ev, ctx.zd);
    if (ctx.sp) await ctx.sp.ereignisNeu(ev.id);
    return { ok: true };
  }
};

/* eeziframes · Konten für Hauseigentümer, die ohne Link eines Fensterbauers messen
   Gast: alles bleibt im Browser. Wer sein Aufmaß sichert (E-Mail und sechsstelliger Code, kein Passwort; Supabase Auth wie bei den
   Betrieben, auth.js), hat es auf dem Server und damit auf jedem Gerät. Zum Freischalten (Kauf des Aufmaßblatts, zahlung.js) ist das
   Konto Pflicht; der Kauf hängt dann am Aufmaß und ist auf jedem Gerät da. Je Konto höchstens 20 Aufmaße (eines je Haus), jedes mit
   seiner Kennung (dieselbe wie beim Kauf).
   Gespeichert und abgeglichen wird wie beim Kundenlink (entwurf.js): ohne Fotos und ohne das Bild der Lage, zusammengeführt je
   Fenster, mit den Zählern gegen Mehrfachnutzung (50 angelegte Fenster, je Fenster 7 Tage frei, danach 4 Änderungen). Mit dem Kauf
   endet die freie Woche, ab dann zählt jede gespeicherte Änderung (meta.bezahlt.at).
   Gelöscht wird in der App (ein Aufmaß, oder das Konto mit allen Aufmaßen) und beim Aufräumen (zentrale.js): ohne Änderung nach
   12 Monaten, freigeschaltete Aufmaße nach 3 Jahren. Was in der App gelöscht wird, verliert seinen Inhalt sofort; es bleibt eine
   Löschmarke (Kennung und Zeitpunkt, meta.entfernt, keine Angaben zur Person, nach dem Löschen des Kontos auch ohne Besitzer), damit
   ein anderes Gerät mit einer Kopie das Aufmaß nicht wieder anlegt (Antwort 410, die App nimmt ihre Kopie weg). Die Marke räumt das
   Aufräumen nach 12 Monaten weg. Fehlt die Tabelle noch (schema.sql nicht erneut ausgeführt), meldet /api/status konten: false, und
   die App bleibt beim Gast mit Kauf ohne Konto. */
import { ApiFehler, erlaubt, quelle, hmac, b64url } from './umgebung.js';
import { codeSenden, codePruefen, erneuern, nutzer, anmeldungLoeschen } from './auth.js';
import { GRENZEN, eingangPruefen, eingangMischen, antwortNachMischen, entwurfSicht, metaSicht } from './entwurf.js';

export const MAX_AUFMASSE = 20;
/* Freischalt-Nachweis eines gekauften Aufmaßblatts: Unterschrift über Kennung und Stripe-Sitzung (auch zahlung.js) */
export async function kaufNachweis(k, kennung, session) { return b64url(await hmac(k.geheimnis, 'aufmass.' + kennung + '.' + session)).slice(0, 32); }
const KENNUNG = /^[A-Za-z0-9_-]{6,40}$/;
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const zaehlen = (ctx, s) => { if (ctx.zaehlen) ctx.zaehlen(s); };
export const kaufAm = (meta) => (meta && meta.bezahlt ? Number(meta.bezahlt.at) || 0 : 0);
/* Löschmarke: das Aufmaß wurde in der App gelöscht (eigenesWeg), nur Kennung und Zeitpunkt sind übrig (meta.entfernt; nicht zu
   verwechseln mit meta.geloescht, den gelöschten Fenstern) */
export const entfernt = (r) => !!(r && r.meta && r.meta.entfernt);
const weg = () => new ApiFehler('Dieses Aufmaß wurde gelöscht.', 410, { geloescht: true });
/* Aufmaß ohne Besitzer (die Anmeldung wurde anders als über die App gelöscht): nicht übernehmen, die App sichert ihre Kopie unter neuer Kennung */
const verwaist = () => new ApiFehler('Dieses Aufmaß gehört zu keinem Konto mehr.', 409, { verwaist: true });
/* Der Kauf, wie ihn die App braucht (Nachweis für das Blatt auf jedem Gerät); nur für den Besitzer */
const bezahltSicht = (meta) => (meta && meta.bezahlt ? { session: meta.bezahlt.session || '', token: meta.bezahlt.token || '', at: Number(meta.bezahlt.at) || 0 } : null);
const kurz = (r) => ({ kennung: r.kennung, name: str(r.name, 60), fenster: Number((r.meta || {}).aktuell) || 0, bezahlt: !!(r.meta && r.meta.bezahlt), geaendert: r.updated_at || '', angelegt: r.created_at || '' });

/* Gibt es die Tabelle? Kurz gemerkt, damit /api/status nicht bei jedem Aufruf nachfragt. Eine Störung der Datenbank gilt nicht als
   „fehlt“ (sonst liefe die Kasse ohne Konto): dann bleibt der letzte bekannte Stand, ungemerkt; gab es noch keinen, undefined */
let da = { wert: false, bis: 0, je: false };
export async function kontenDa(sp) {
  if (!sp || !sp.eigeneDa) return false;
  if (da.bis > Date.now()) return da.wert;
  let wert = false; try { wert = await sp.eigeneDa(); } catch (e) { return da.je ? da.wert : undefined; }
  da = { wert: wert, bis: Date.now() + (wert ? 10 * 60000 : 60000), je: true };
  return wert;
}
async function kunde(ctx) {
  const token = (ctx.request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const n = await nutzer(ctx.k, token); if (!n) throw new ApiFehler('Bitte melde dich neu an.', 401, { anmelden: true });
  return n;
}
function kennungVon(ctx) { const k = str(ctx.params.kennung, 40); if (!KENNUNG.test(k)) throw new ApiFehler('Unbekanntes Aufmaß.', 400); return k; }
async function liste(ctx, n) { const rows = await ctx.sp.eigeneVonNutzer(n.id); return rows === null ? null : rows.map(kurz); }
const GRENZ_TEXT = 'Ein Aufmaß umfasst höchstens ' + GRENZEN.fenster + ' Fenster, gelöschte zählen mit. Für ein weiteres Haus beginnst du ein neues Aufmaß.';
const fremd = () => new ApiFehler('Dieses Aufmaß gehört zu einem anderen Konto.', 403, { fremd: true });
async function angemeldetAntwort(ctx, s) {
  const aufmasse = await liste(ctx, s.nutzer);
  return { ok: true, token: s.token, refresh: s.refresh, mail: s.nutzer.mail, aufmasse: aufmasse || [], aus: aufmasse === null };
}

/* Kauf vermerken (zahlung.js, nach der Prüfung oder dem Webhook): nur bei einem gesicherten Aufmaß, nur einmal. Ein Fehler der
   Datenbank geht an den Aufrufer (der Webhook antwortet dann mit Fehler, und Stripe stellt erneut zu) */
export async function eigenesBezahlt(sp, kennung, session, token) {
  if (!sp || !sp.eigenesAendern || !KENNUNG.test(String(kennung || ''))) return false;
  const r = await sp.eigenesAendern(kennung, null, (e) => {
    if (!e.version || entfernt(e)) return false; // nicht gesichert (Gast) oder gelöscht
    if (e.meta && e.meta.bezahlt && e.meta.bezahlt.session) return false;
    e.meta = Object.assign({}, e.meta || {}, { bezahlt: { session: session, token: token, at: Date.now() } });
    return true;
  });
  return !!(r && r.out);
}

export const EIGENE = {
  /* --- Anmelden: Code per E-Mail, dann Code oder Link --- */
  'POST /api/kunde/code': async (ctx) => {
    if (!erlaubt('otp:' + quelle(ctx.request), 8, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const r = await codeSenden(ctx.k, ctx.sp, (ctx.body || {}).mail, ctx.url.origin + '/app/');
    zaehlen(ctx, 'ereignis:kunde_code');
    return r;
  },
  'POST /api/kunde/anmelden': async (ctx) => {
    if (!erlaubt('otpv:' + quelle(ctx.request), 15, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const s = await codePruefen(ctx.k, ctx.sp, (ctx.body || {}).mail, (ctx.body || {}).code);
    return angemeldetAntwort(ctx, s);
  },
  /* Anmeldelink aus der E-Mail: Supabase leitet mit #access_token=…&refresh_token=… auf /app/, die App schickt beides her */
  'POST /api/kunde/sitzung': async (ctx) => {
    if (!erlaubt('otpv:' + quelle(ctx.request), 15, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
    const b = ctx.body || {}, token = str(b.token, 4000), refresh = str(b.refresh, 400);
    const n = await nutzer(ctx.k, token); if (!n) throw new ApiFehler('Der Anmeldelink ist abgelaufen oder schon benutzt. Bitte fordere einen neuen Code an.', 401);
    return angemeldetAntwort(ctx, { token: token, refresh: refresh, nutzer: n });
  },
  'POST /api/kunde/erneuern': async (ctx) => { const s = await erneuern(ctx.k, (ctx.body || {}).refresh); if (!s) throw new ApiFehler('Bitte melde dich neu an.', 401, { anmelden: true }); return { ok: true, token: s.token, refresh: s.refresh, mail: s.nutzer.mail }; },
  'GET /api/kunde/aufmasse': async (ctx) => {
    const n = await kunde(ctx), l = await liste(ctx, n);
    return { ok: true, mail: n.mail, aufmasse: l || [], aus: l === null, max: MAX_AUFMASSE };
  },
  /* --- Ein Aufmaß: lesen, abgleichen, löschen --- */
  'GET /api/kunde/aufmass/:kennung': async (ctx) => {
    const n = await kunde(ctx), k = kennungVon(ctx), e = await ctx.sp.eigenesHolen(k);
    if (e === undefined) return { ok: true, aus: true };
    if (e && e.nutzer && e.nutzer !== n.id) throw fremd();
    if (entfernt(e)) throw weg(); // auch ohne Besitzer (Konto gelöscht)
    if (e && !e.nutzer) throw verwaist();
    return { ok: true, entwurf: e ? entwurfSicht(e) : null, meta: e ? metaSicht(e.meta) : null, bezahlt: e ? bezahltSicht(e.meta) : null, grenzen: GRENZEN, jetzt: Date.now() };
  },
  'POST /api/kunde/aufmass/:kennung': async (ctx) => {
    const n = await kunde(ctx), k = kennungVon(ctx), jetzt = Date.now(), e = eingangPruefen(ctx.body || {}, jetzt, GRENZ_TEXT);
    const vorhanden = await ctx.sp.eigenesHolen(k);
    if (vorhanden === undefined) return { ok: true, aus: true };
    if (vorhanden && vorhanden.nutzer && vorhanden.nutzer !== n.id) throw fremd();
    if (entfernt(vorhanden)) throw weg();
    if (vorhanden && !vorhanden.nutzer) throw verwaist();
    if (!vorhanden) { const l = await ctx.sp.eigeneVonNutzer(n.id); if (l && l.length >= MAX_AUFMASSE) throw new ApiFehler('In einem Konto haben ' + MAX_AUFMASSE + ' Aufmaße Platz. Lösche ein altes, um dieses zu sichern.', 409, { voll: true }); }
    /* Ein vorher als Gast gekauftes Blatt (Nachweis aus diesem Browser) kommt mit ins Konto, wenn die Unterschrift stimmt */
    const b = ctx.body || {}, kauf = b.kauf && typeof b.kauf === 'object' ? { session: str(b.kauf.session, 120), token: str(b.kauf.token, 64) } : null;
    const kaufEcht = !!(kauf && kauf.session && kauf.token && (!vorhanden || !kaufAm(vorhanden.meta)) && (await kaufNachweis(ctx.k, k, kauf.session)) === kauf.token);
    let m = null, andere = false, ist_weg = false, ohne = false;
    const res = await ctx.sp.eigenesAendern(k, n.id, (r) => {
      if (r.nutzer && r.nutzer !== n.id) { andere = true; return false; }
      if (entfernt(r)) { ist_weg = true; return false; } // inzwischen gelöscht
      if (r.version && !r.nutzer) { ohne = true; return false; }
      m = eingangMischen(r, e, jetzt, false, kaufAm(r.meta));
      if (!m.grenze && kaufEcht && !kaufAm(r.meta)) r.meta = Object.assign({}, r.meta, { bezahlt: { session: kauf.session, token: kauf.token, at: jetzt } });
      return !m.grenze;
    });
    if (res && res.fehlt) return { ok: true, aus: true };
    if (andere) throw fremd();
    if (ist_weg) throw weg();
    if (ohne) throw verwaist();
    if (m && m.grenze) throw new ApiFehler(GRENZ_TEXT, 409, { grenze: true });
    if (!vorhanden) zaehlen(ctx, 'ereignis:kunde_gesichert');
    const row = res.row || {};
    return Object.assign(antwortNachMischen(row, m), { bezahlt: bezahltSicht(row.meta) });
  },
  /* Ein Aufmaß löschen: der Inhalt ist sofort weg, es bleibt die Löschmarke (siehe oben) */
  'POST /api/kunde/aufmass/:kennung/loeschen': async (ctx) => {
    const n = await kunde(ctx), k = kennungVon(ctx), e = await ctx.sp.eigenesHolen(k);
    if (e && e.nutzer !== n.id) throw fremd();
    if (e && !entfernt(e)) await ctx.sp.eigenesWeg(k);
    return { ok: true, aufmasse: (await liste(ctx, n)) || [] };
  },
  /* Konto löschen: alle Aufmaße (Löschmarken bleiben, ohne Besitzer, sobald die Anmeldung weg ist), dazu die Anmeldung, außer sie
     gehört auch zu einem Betrieb (dann bleibt sie für den Betrieb) */
  'POST /api/kunde/loeschen': async (ctx) => {
    const n = await kunde(ctx);
    await ctx.sp.eigeneWegVonNutzer(n.id);
    const betrieb = await ctx.sp.betriebNachAuth(n.id);
    const weg = betrieb ? { ok: false } : await anmeldungLoeschen(ctx.k, n.id);
    return { ok: true, anmeldungGeloescht: !betrieb && !!weg.ok };
  }
};

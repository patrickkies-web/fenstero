/* eeziframes · Signature-Dashboard unter https://<instanz>/betrieb/ (Strang E, Bauplan §3 E; Vertrag docs/INSTANZEN.md)
   Ein Betrieb mit dem Merkmal dashboard meldet sich auf dem Haupthost seiner Instanz an und arbeitet im bestehenden Betriebsbereich
   (web/assets/portal.js im Instanz-Modus, Hülle web/betrieb/index.html), ganz in seiner Marke. Die Routen /api/konto… bleiben dieselben;
   auf einem Instanz-Host leiten die Haken in konten.js und fotos.js hierher, auf der Hauptdomain läuft alles wie bisher.
   Grundsätze:
   - Anmeldung nur per E-Mail-Code (E15). Einen Code bekommen nur Adressen aus instanzen.zugang (bestätigt, nicht „aus“); alle anderen
     bekommen dieselbe Antwort ohne Mail. Den Code erzeugt Supabase (auth.js codeErzeugen), die Mail kommt in der Marke der Instanz
     (mailCode); Rückfall ist die Mail von Supabase. Nach dem Code eine Sitzung im Cookie __Host-betrieb (sitzung.js, gebunden an den
     Host), kein Token im Browser (K1.1). Falsche Codes zählen je Adresse dauerhaft (wie das Kundenkonto).
   - kontoVon: Der Betrieb kommt immer aus dem Host (ctx.instanz.betrieb), nie aus der Sitzung. Jeder Aufruf liest Zugänge, Paket und
     Status frisch: Ein entzogener Zugang, ein Paket ohne Dashboard oder ein neuer Status wirkt beim nächsten Aufruf.
   - Was in welchem Status geht, sagt nur Instanzregeln.darf (dashboardLesen, dashboardSchreiben mit Feldern, einladen, export).
   - Projekte stehen in der Tabelle anfragen (eine Zeile je Projekt, daten = Link-Objekt wie im Betriebsbereich); Regeln aus modell.js
     über das Pseudo-Konto (functions/instanz/adapter.js). Instanzen rechnen nie je Aufmaß ab: die Sicht hat keine Abrechnungsfelder.
   - GET /api/konto schreibt nie (E13); mit ?stand=<Stand der letzten Antwort> genügt { gleich: true }, solange sich nichts geändert hat.
   API:
     kontoVon(ctx, bereich) → { row, zeile, zugang, sitzung, m }   (wirft 401/403/404/409/410)
     dashboardSicht(ctx, o) → { id, company, acc, stripe: null, stand }
     mailCode(ctx, mail, code)                Anmeldecode per Mail in der Marke der Instanz
     einladungenErinnern(k, sp, env)          täglich: offene Einladungen älter als FRISTEN.einladungErinnernTage, einmal je Projekt
     umzugFuer(ctx, nutzer)                   Hauptdomain: Adresse eines Dashboard-Zugangs → https://<host>/betrieb/ (409 umzug)
     KONTO_INSTANZ                            die Antworten auf die Routen von konten.js für Instanz-Hosts
     kontoFoto(ctx)                           GET /api/konto/foto/:code/:id auf dem Instanz-Host (fotos.js)
     DASHBOARD                                zusätzliche Routen (nur Instanz-Hosts, sonst 404) */
import '../../web/assets/modell.js';
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import '../../web/assets/einladung.js';
import { ApiFehler, json, erlaubt, quelle, hex } from './umgebung.js';
import { codeSenden, codePruefen, codeErzeugen, nutzerAnlegen } from './auth.js';
import { sitzungSetzen, sitzungPflicht, sitzungLesen, sitzungLoeschen } from './sitzung.js';
import { bremse, budget, budgetStand } from './bremse.js';
import { postDienst, mailRahmen, esc, mailOk } from './post.js';
import { absender, rahmenMarke, instanzKontext } from './eingang.js';
import { linkAendern, pseudoKonto, zeitenBerlin, datumBerlin } from '../instanz/adapter.js';
import { profilSetzen } from '../instanz/verwalten.js';
import { ablage, linkOrdner, fotoIds, fotosLinkLoeschen, FOTO_ID } from './fotos.js';
import { HAUPTADRESSE } from '../seo.js';

const X = () => globalThis.Abrechnung;
const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
const EIN = () => globalThis.Einladung;
const TAG = 864e5, MIN = 60000;
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 200);
const mailNorm = (m) => String(m || '').trim().toLowerCase();
const sha = async (s) => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s)))));
const iso = (t) => new Date(t).toISOString();
const jetztVon = (ctx) => (ctx && ctx.k && ctx.k.jetzt) || Date.now();
const LOKAL = /(^|\.)localhost$/;
/* Adresse der Instanz: im Netz https://<haupthost>, lokal (Prüfung auf *.localhost) mit Protokoll und Port der Anfrage */
const basisVon = (host, url) => (url && (LOKAL.test(url.hostname) || /^127\./.test(url.hostname)) ? url.protocol + '//' + host + (url.port ? ':' + url.port : '') : 'https://' + host);
/* wie eine unbekannte Route im Router */
const nichtDa = () => new ApiFehler('not_found', 404);
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const merkmaleVon = (zeile) => (zeile ? P().merkmale(zeile.paket, zeile.abweichung) : null);
const zugangAktiv = (z) => !!(z && z.bestaetigt && !z.aus);

/* Nur auf dem Instanz-Host mit Merkmal dashboard (die Hauptdomain kennt diese Routen nicht) */
function nurInstanz(ctx) {
  const inst = ctx.instanz;
  if (!inst || !inst.m || !inst.m.dashboard) throw nichtDa();
  return inst;
}
/* Antwort, wenn der Status der Instanz den Bereich nicht erlaubt (Bauplan §2.7) */
function statusFehler(status, bereich) {
  if (status === 'beendet') return new ApiFehler('Ihr Fensterplaner ist beendet. Ihre Daten können Sie bis zur Löschung noch exportieren.', 410, { beendet: true, status: status });
  if (bereich === 'einladen') return new ApiFehler(status === 'pausiert' ? 'Ihr Fensterplaner ist pausiert. Neue Einladungen sind gerade nicht möglich.' : 'Einladungen sind ab dem Livegang Ihres Fensterplaners möglich.', 409, { status: status });
  if (status === 'pausiert') return new ApiFehler('Ihr Fensterplaner ist pausiert. Ansehen, PDF, Fotos und Export gehen; ändern lassen sich nur Stand, Notiz zum Stand und Klärungsliste.', 409, { status: status });
  return new ApiFehler('Das geht erst, wenn Ihr Fensterplaner live ist.', 409, { status: status });
}

/* ---------- Konto aus Host und Sitzung ---------- */
/* bereich: Bereich der Status-Matrix, der für diese Route gelten muss (dashboardLesen, export, …); ohne: nur angemeldet */
export async function kontoVon(ctx, bereich) {
  const inst = nurInstanz(ctx);
  const s = await sitzungPflicht(ctx, 'betrieb');
  const zeile = await ctx.sp.instanzHolen(inst.id);
  if (!zeile) throw nichtDa();
  const m = merkmaleVon(zeile);
  if (!m || !m.dashboard) throw new ApiFehler('Ihr Paket enthält kein Dashboard. Neue Anfragen kommen per E-Mail mit PDF.', 403, { paket: true, abmelden: true });
  const z = (Array.isArray(zeile.zugang) ? zeile.zugang : []).find((x) => x && x.uid === s.sub && x.mail === s.mail);
  if (!zugangAktiv(z)) throw new ApiFehler('Diese Anmeldung hat keinen Zugang mehr zu diesem Dashboard.', 403, { zugang: true, abmelden: true });
  const row = await ctx.sp.betriebHolen(inst.betrieb);
  if (!row) throw nichtDa();
  if (row.daten && row.daten.verwaltung && row.daten.verwaltung.sperre) throw new ApiFehler('Ihr Zugang ist zurzeit gesperrt. Bitte melden Sie sich bei Ihrem Einrichtungsservice.', 403, { gesperrt: true });
  if (bereich && !R().darf(zeile.status, bereich)) throw statusFehler(zeile.status, bereich);
  ctx.row = row; ctx.zeile = zeile; ctx.m = m; ctx.nutzer = { id: s.sub, mail: s.mail };
  return { row: row, zeile: zeile, zugang: z, sitzung: s, m: m };
}

/* ---------- Sicht ---------- */
/* Felder des Betriebskontos, die der Browser nie sieht: Abrechnung, Tarif, Stripe, Verwaltung der Zentrale, Rohdaten der Instanz */
const OHNE = ['book', 'rechnungen', 'pay', 'freeUsed', 'freeQuota', 'dupOf', 'downgrade', 'aboBezahlt', 'aboSitzung', 'bedingungen', 'verwaltung', 'instanz', 'konto', 'plan', 'links', 'logo', 'col', 'angemeldet', 'anmeldungen', 'zuletzt'];
const OFFEN = ['erstellt', 'gesendet', 'geoeffnet', 'arbeit'];
/* Die Testanfrage aus der Einrichtung (Zentrale, art test) gehört nur in die Vorschau: Nach dem Livegang zählt sie weder in der Liste noch
   in den Zählern mit und ist auch einzeln nicht mehr abrufbar (sie wird ohnehin nach einem Tag gelöscht) */
const sichtbar = (z, zeile) => !(z && z.art === 'test' && zeile && zeile.status !== 'einrichtung');
/* Zwischenstände des Betriebs (nur meta und Zeiten): Fortschritt der Einladungen, anonyme Zahl laufender Website-Planungen */
async function entwuerfe(ctx, betrieb) {
  if (!ctx.sp.entwuerfeVonBetrieb) return [];
  try { return (await ctx.sp.entwuerfeVonBetrieb(betrieb)) || []; } catch (e) { return []; }
}
const fensterZahl = (meta) => { const m = meta || {}; return Number.isFinite(Number(m.aktuell)) ? Number(m.aktuell) : Object.keys(m.fenster || {}).length; };
/* Stand für ?stand=: ändert sich, sobald sich an Projekten, Konto, Instanz oder Zwischenständen etwas tut */
async function standVon(ctx, row, zeile, ents) {
  const a = ctx.sp.anfragenStand ? await ctx.sp.anfragenStand(row.id).catch(() => null) : null;
  const e = ents.reduce((x, y) => (String(y.updated_at || '') > x ? String(y.updated_at || '') : x), '');
  return [a ? a.stand || '' : '', a ? a.anzahl || 0 : 0, row.version || 0, zeile.version || 0, zeile.status, ents.length, e].join('|');
}
/* Link-Objekt einer Zeile für den Browser: Abgelaufenes wie im Betriebsbereich, ohne die Zeit hier anzuwenden (GET schreibt nie) */
function linkAusZeile(z, jetzt, voll) {
  const l = Object.assign({}, z.daten || {});
  l.id = l.id || z.lid; l.code = z.code; l.nr = l.nr || z.nr || ''; l.art = z.art; l.instanz = true;
  if (z.art === 'test') l.test = true;
  if (OFFEN.includes(l.status)) { const d = X().parseDE(l.expires); if (d && jetzt > d.getTime()) l.status = 'abgelaufen'; }
  if (l.status === 'eingegangen' && !voll && !l.aufmass) l.nachladen = true; // Projektansicht lädt es über GET /api/konto/projekte/:id
  delete l.vorher; if (!voll) delete l.aufmass;
  return l;
}
export async function dashboardSicht(ctx, o) {
  o = o || {};
  const row = o.row || ctx.row, zeile = o.zeile || ctx.zeile, inst = ctx.instanz, m = o.m || ctx.m || inst.m, jetzt = jetztVon(ctx);
  const ents = await entwuerfe(ctx, row.id), stand = await standVon(ctx, row, zeile, ents);
  if (o.stand && o.stand === stand) return { gleich: true, stand: stand };
  /* eingereichte Projekte, die seit 30 Tagen unverändert sind, nur als Kopf (ohne Aufmaß); die Projektansicht lädt es nach */
  const seit = iso(jetzt - 30 * TAG);
  const [kopf, voll] = await Promise.all([ctx.sp.anfragenVonBetrieb(row.id, { kopf: true }), ctx.sp.anfragenVonBetrieb(row.id, { seit: seit })]);
  const vollNach = new Map((voll || []).map((z) => [z.code, z]));
  const codes = new Set();
  const nachCode = new Map(ents.map((e) => [e.code, e]));
  const links = (kopf || []).filter((z) => z.instanz === zeile.id && sichtbar(z, zeile)).sort((x, y) => String(y.created_at || '').localeCompare(String(x.created_at || ''))).map((z0) => {
    codes.add(z0.code);
    const z = vollNach.get(z0.code) || z0, l = linkAusZeile(z, jetzt, vollNach.has(z0.code));
    const e = nachCode.get(z0.code);
    if (e && OFFEN.includes(l.status) && m.fortschritt) l.fortschritt = { fenster: fensterZahl(e.meta), zuletzt: e.updated_at || '' };
    return l;
  });
  /* Website-Besucher, die gerade planen (anonym, nur die Zahl): Zwischenstände dieser Instanz ohne Projekt, in den letzten 24 Stunden */
  const grenze = iso(jetzt - TAG);
  const web = ents.filter((e) => e.meta && e.meta.instanz && e.meta.instanz.id === zeile.id && !codes.has(e.code) && !e.meta.gesendet && !e.meta.anfrageWeg && String(e.updated_at || '') >= grenze);
  const d = row.daten || {}, acc = {};
  Object.keys(d).forEach((k2) => { if (!OHNE.includes(k2)) acc[k2] = d[k2]; });
  const haupthost = inst.haupthost, basis = basisVon(haupthost, ctx.url), f = (zeile.marke || {}).farbe;
  acc.links = links;
  acc.notif = Array.isArray(d.notif) ? d.notif : [];
  acc.website = { laufend: web.length, fenster: web.reduce((s, e) => s + fensterZahl(e.meta), 0), zuletzt: web.reduce((x, e) => (String(e.updated_at || '') > x ? String(e.updated_at || '') : x), '') };
  acc.instanz = {
    name: inst.name, host: haupthost, basis: basis + '/', status: zeile.status, pauseBis: zeile.pause_bis || null, endeAm: zeile.ende_am || null, du: !!inst.du,
    kundenkonto: String((ctx.env && ctx.env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, '') + '/konto/',
    m: { dashboard: !!m.dashboard, einladungslinks: !!m.einladungslinks, fortschritt: !!m.fortschritt, pdfKennzeichnung: m.pdfKennzeichnung || 'keine' },
    darf: { lesen: R().darf(zeile.status, 'dashboardLesen'), schreiben: R().felder(zeile.status, 'dashboardSchreiben'), einladen: R().darf(zeile.status, 'einladen') && !!m.einladungslinks, export: R().darf(zeile.status, 'export') },
    zugang: (Array.isArray(zeile.zugang) ? zeile.zugang : []).filter((z) => z && !z.aus).map((z) => ({ mail: z.mail, name: z.name || '', rolle: z.rolle === 'inhaber' ? 'inhaber' : 'team', ich: !!(ctx.nutzer && z.uid === ctx.nutzer.id) })),
    eingang: (((zeile.eingang || {}).mails) || []).filter((x) => x && x.bestaetigt).map((x) => x.mail)
  };
  return { id: row.id, company: { id: 'srv', name: inst.name, plz: row.plz || inst.plz || '', since: d.since || new Date(jetzt).getFullYear(), col: /^#[0-9a-f]{6}$/i.test(String(f || '')) ? f : '' }, acc: acc, stripe: null, stand: stand };
}
/* Antwort nach einer Änderung: Betriebszeile frisch lesen (Meldungen an den Betrieb können sich mit geändert haben) */
async function antwortMitSicht(ctx, extra) {
  const row = await ctx.sp.betriebHolen(ctx.row.id).catch(() => null); if (row) ctx.row = row;
  return Object.assign({ ok: true, konto: await dashboardSicht(ctx) }, extra || {});
}

/* ---------- Anmeldung ---------- */
const FEHL_TEXT = 'Für diese Adresse wurde heute zu oft ein falscher Code eingegeben. Die Anmeldung ist bis Mitternacht gesperrt.';
async function codeAnfordern(ctx) {
  const inst = nurInstanz(ctx), mail = mailNorm((ctx.body || {}).mail);
  if (!mailOk(mail)) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
  if (!erlaubt('otp:' + quelle(ctx.request), 8, 10 * MIN) || !(await bremse(ctx, 'RL_OTP', 'betrieb:' + quelle(ctx.request)))) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
  if (!erlaubt('otpm:' + inst.id8 + ':' + mail, 5, 60 * MIN)) throw new ApiFehler('Für diese Adresse wurden gerade viele Codes angefordert. Bitte in einer Stunde noch einmal.', 429);
  if ((await budgetStand(ctx, 'otpfehl:' + (await sha(mail)))) >= R().GRENZEN.otpFehlerMailTag) throw new ApiFehler(FEHL_TEXT, 429, { gesperrt: true });
  const zeile = await ctx.sp.instanzHolen(inst.id), m = merkmaleVon(zeile);
  const z = zeile && m && m.dashboard ? (Array.isArray(zeile.zugang) ? zeile.zugang : []).find((x) => x && x.mail === mail) : null;
  /* ohne Zugang dieselbe Antwort, nur ohne Mail: So lässt sich nicht ausprobieren, wer einen Zugang hat; verschickt wird nach der Antwort */
  if (zugangAktiv(z)) {
    const arbeit = codeVerschicken(ctx, mail).catch((e) => { console.log('Anmeldecode Dashboard nicht verschickt', String(e && e.message ? e.message : e).slice(0, 120)); });
    if (ctx.waitUntil) ctx.waitUntil(arbeit); else await arbeit;
  }
  return { ok: true, mail: mail };
}
async function codeVerschicken(ctx, mail) {
  await nutzerAnlegen(ctx.k, ctx.sp, mail).catch(() => null);
  const code = await codeErzeugen(ctx.k, ctx.sp, mail).catch(() => null);
  if (code) { const r = await mailCode(ctx, mail, code); if (r && r.ok) return true; }
  /* Rückfall: die Mail von Supabase (Vorlage von eeziframes; Empfänger ist der Betrieb selbst, kein Endkunde), ohne Rücksprung-Adresse */
  await codeSenden(ctx.k, ctx.sp, mail, null, true);
  return true;
}
export async function mailCode(ctx, mail, code) {
  const inst = ctx.instanz, pd = postDienst(ctx.k);
  if (!pd || !inst) return { ok: false };
  const titel = 'Ihr Anmeldecode für ' + inst.name;
  const html = mailRahmen(titel, absatz('Guten Tag,') + absatz('mit diesem Code melden Sie sich im Dashboard von ' + esc(inst.name) + ' an:') +
    '<p style="margin:8px 0 18px;font-size:32px;line-height:1.2;font-weight:800;letter-spacing:6px">' + esc(code) + '</p>' +
    absatz('Der Code gilt eine Stunde. Geben Sie ihn auf ' + esc(inst.haupthost) + '/betrieb/ ein.') +
    absatz('<span style="font-size:13px;color:#6e6e73">Sie haben keinen Code angefordert? Dann ignorieren Sie diese E-Mail einfach; ohne den Code kommt niemand in Ihr Dashboard.</span>'), '', { marke: rahmenMarke(inst) });
  return pd.senden({ an: mail, betreff: titel, html: html, von: absender(ctx.k, inst) });
}
async function codeBestaetigen(ctx) {
  const inst = nurInstanz(ctx), b = ctx.body || {}, mail = mailNorm(b.mail);
  if (!erlaubt('otpv:' + quelle(ctx.request), 15, 10 * MIN)) throw new ApiFehler('Zu viele Versuche. Bitte in zehn Minuten noch einmal.', 429);
  const schluessel = 'otpfehl:' + (await sha(mail)), max = R().GRENZEN.otpFehlerMailTag;
  if (mailOk(mail) && (await budgetStand(ctx, schluessel)) >= max) throw new ApiFehler(FEHL_TEXT, 429, { gesperrt: true });
  let s;
  try { s = await codePruefen(ctx.k, ctx.sp, mail, b.code); } catch (e) {
    if (e instanceof ApiFehler && e.status === 401 && mailOk(mail)) {
      const z = await budget(ctx, schluessel, max, { alarm: max });
      if (z.alarm) { const w = sperrMail(ctx, mail, max).catch(() => false); if (ctx.waitUntil) ctx.waitUntil(w); }
    }
    throw e;
  }
  /* Zugang prüfen und die Anmeldung binden: Die Adresse hat der Code gerade bewiesen; eine früher gebundene, andere Anmeldung derselben
     Adresse (bei Supabase neu angelegt) wird ersetzt */
  const zeit = iso(jetztVon(ctx)), n = s.nutzer;
  let ok = false;
  const zeile0 = await ctx.sp.instanzHolen(inst.id), m = merkmaleVon(zeile0);
  if (zeile0 && m && m.dashboard) {
    await ctx.sp.instanzAendern(inst.id, (z) => {
      const l = Array.isArray(z.zugang) ? z.zugang : [], e = l.find((x) => x && x.mail === n.mail);
      if (!zugangAktiv(e)) return false;
      e.uid = n.id; e.zuletzt = zeit; z.zugang = l; ok = true;
    });
  }
  if (!ok) throw new ApiFehler('Diese Adresse hat keinen Zugang zu diesem Dashboard.', 403, { zugang: true });
  const cookie = await sitzungSetzen(ctx, 'betrieb', { sub: n.id, mail: n.mail });
  if (ctx.zaehlen) ctx.zaehlen(['ereignis:dashboard_anmeldung', 'inst:' + inst.id8 + ':login']); // Zähler je Instanz (statistik.js lässt inst: aus den eeziframes-Zahlen)
  /* Sicht wie nach einem Aufruf mit der neuen Sitzung */
  const zeile = await ctx.sp.instanzHolen(inst.id), row = await ctx.sp.betriebHolen(inst.betrieb);
  ctx.row = row; ctx.zeile = zeile; ctx.m = merkmaleVon(zeile); ctx.nutzer = { id: n.id, mail: n.mail };
  const konto = R().darf(zeile.status, 'dashboardLesen') ? await dashboardSicht(ctx) : null;
  return json({ ok: true, mail: n.mail, konto: konto, status: zeile.status }, 200, { 'set-cookie': cookie });
}

/* Nach GRENZEN.otpFehlerMailTag falschen Codes einmal am Tag eine Mail, aber nur an eine Adresse mit Zugang (sonst ließe sich damit
   jede Adresse anschreiben); neutral in der Marke der Instanz */
async function sperrMail(ctx, mail, max) {
  const inst = ctx.instanz, pd = postDienst(ctx.k), zeile = await ctx.sp.instanzHolen(inst.id);
  if (!pd || !zeile || !(Array.isArray(zeile.zugang) ? zeile.zugang : []).some((z) => z && z.mail === mail && zugangAktiv(z))) return false;
  const titel = 'Anmeldung gesperrt bis Mitternacht';
  return pd.senden({ an: mail, betreff: titel + ': ' + inst.name, von: absender(ctx.k, inst), html: mailRahmen(titel, absatz('Guten Tag,') +
    absatz('für das Dashboard von ' + esc(inst.name) + ' wurde mit Ihrer Adresse heute ' + max + '-mal ein falscher Anmeldecode eingegeben. Zum Schutz ist die Anmeldung mit dieser Adresse bis Mitternacht gesperrt.') +
    absatz('Waren Sie das nicht, müssen Sie nichts tun: Ohne den Code aus Ihrem Postfach kommt niemand in Ihr Dashboard.'), '', { marke: rahmenMarke(inst) }) });
}

/* ---------- Hauptdomain: eine Zugangsadresse ohne Betriebskonto gehört ins Dashboard ihrer Instanz (E5) ---------- */
export async function umzugFuer(ctx, nutzer) {
  if (ctx.instanz || !ctx.sp || !ctx.sp.instanzenAlle || !nutzer) return null;
  let alle; try { alle = await ctx.sp.instanzenAlle({ status: ['einrichtung', 'aktiv', 'pausiert', 'beendet'] }); } catch (e) { return null; }
  if (!Array.isArray(alle)) return null;
  const mail = mailNorm(nutzer.mail);
  for (const i of alle) {
    const m = merkmaleVon(i); if (!m || !m.dashboard) continue;
    if (!(Array.isArray(i.zugang) ? i.zugang : []).some((z) => z && !z.aus && (z.mail === mail || (z.uid && z.uid === nutzer.id)))) continue;
    const hosts = ctx.sp.hostsVon ? (await ctx.sp.hostsVon(i.id).catch(() => [])) || [] : [], h = hosts.find((x) => x.haupt) || hosts[0];
    if (h) return basisVon(h.host, ctx.url) + '/betrieb/';
  }
  return null;
}
export const umzugFehler = (url) => new ApiFehler('Ihr Dashboard liegt unter Ihrer eigenen Domain. Bitte melden Sie sich dort an.', 409, { umzug: url });

/* ---------- Projekte ---------- */
async function zeileZuProjekt(ctx, id) {
  const z = await ctx.sp.anfrageNachLid(ctx.row.id, String(id || ''));
  if (!z || z.instanz !== ctx.zeile.id || !sichtbar(z, ctx.zeile)) throw new ApiFehler('Projekt nicht gefunden.', 404);
  return z;
}
/* Neues Projekt (Einladung) als Zeile in anfragen: Nummer aus instanz_nr, Code einmalig über Anfragen und Zwischenstände */
async function einladungAnlegen(ctx, f) {
  const inst = ctx.instanz, row = ctx.row, jetzt = jetztVon(ctx);
  const a = pseudoKonto(row.daten || {}, null), r = X().neuesProjekt(a, f, jetzt);
  if (!r.ok) throw new ApiFehler(r.msg);
  const l = zeitenBerlin(r.l, jetzt); // Angelegt und Ablauf in deutscher Zeit (der Worker rechnet in UTC)
  l.nr = await ctx.sp.instanzNr(inst.id); l.host = inst.haupthost; l.art = 'einladung'; l.instanz = true;
  for (let i = 0; i < 6; i++) {
    const code = i ? X().newCode() : l.code;
    if (ctx.sp.entwurfHolen && (await ctx.sp.entwurfHolen(code).catch(() => null))) continue;
    l.code = code;
    try {
      await ctx.sp.anfrageAnlegen({ code: code, instanz: ctx.zeile.id, betrieb: row.id, lid: l.id, art: 'einladung', status: l.status, nr: l.nr, daten: l, versand: { basis: basisVon(inst.haupthost, ctx.url) } });
      return l;
    } catch (e) { if (!(e && e.status === 409)) throw e; }
  }
  throw new ApiFehler('Das Projekt ließ sich gerade nicht anlegen. Bitte noch einmal.', 503);
}
const einladenPruefen = (ctx) => {
  if (!ctx.m.einladungslinks) throw new ApiFehler('Ihr Paket enthält keine Einladungslinks.', 403, { paket: true });
  if (!R().darf(ctx.zeile.status, 'einladen')) throw statusFehler(ctx.zeile.status, 'einladen');
};
/* Felder einer Änderung am Projekt, wie sie die Status-Matrix kennt (pausiert: nur klaer, stage, memo, seen) */
const PROJEKT_FELDER = ['gesendet', 'via', 'du', 'days', 'verlaengern', 'stage', 'note', 'memo', 'klaer', 'msg', 'seen', 'deaktivieren', 'nb', 'nbZurueck'];
async function projektAendern(ctx) {
  await kontoVon(ctx, 'dashboardLesen');
  const b = ctx.body || {}, felder = Object.keys(b).filter((k2) => PROJEKT_FELDER.includes(k2) && b[k2] !== undefined && !(k2 === 'via' && b.gesendet));
  if (!felder.length) throw new ApiFehler('Nichts zu ändern.');
  if (!R().darf(ctx.zeile.status, 'dashboardSchreiben', { feld: felder })) throw statusFehler(ctx.zeile.status, 'dashboardSchreiben');
  const z = await zeileZuProjekt(ctx, ctx.params.id), p = {};
  felder.forEach((k2) => { p[k2] = b[k2]; }); if (p.gesendet) p.via = b.via;
  let msg = '';
  await linkAendern(ctx, { art: 'anfrage', code: z.code, l: z.daten || {}, anfrage: z }, (a, l, jz) => { const r = X().projektAendern(l, p, jz); if (!r.ok) throw new ApiFehler(r.msg); msg = r.msg || ''; });
  return antwortMitSicht(ctx, { msg: msg });
}
/* Anfrage löschen (Art. 17 DSGVO, Spam): Bestätigung mit der Projektnummer; Zeile, Fotos, Zwischenstand, abgelegte Blätter und
   Meldungen zum Projekt; im Protokoll nur Nummer und wer gelöscht hat, keine Kundendaten. Geht, solange das Dashboard lesbar ist. */
async function projektLoeschen(ctx) {
  await kontoVon(ctx, 'dashboardLesen');
  const z = await zeileZuProjekt(ctx, ctx.params.id), l = z.daten || {}, nr = String(z.nr || l.nr || '');
  if (!nr || str((ctx.body || {}).bestaetigung, 40).toUpperCase() !== nr.toUpperCase()) throw new ApiFehler('Bitte zur Bestätigung die Projektnummer ' + (nr || '') + ' eingeben.', 400, { feld: 'bestaetigung' });
  await ctx.sp.anfrageLoeschen(z.code);
  await fotosLinkLoeschen(ctx.k, z.code);
  if (ctx.sp.entwurfLoeschen) await ctx.sp.entwurfLoeschen(z.code).catch(() => false);
  const bl = ablage(ctx.k, 'blatt');
  if (bl) { const runden = Math.max(1, Number(l.runde) || 1, Number((z.versand || {}).runde) || 1) + 1, pfade = []; for (let i = 1; i <= runden; i++) pfade.push('instanz/' + ctx.zeile.id + '/' + z.code + '-' + i + '.pdf'); try { await bl.loeschen(pfade); } catch (e) { /* nichts abgelegt */ } }
  try { await ctx.sp.betriebAendern(ctx.row.id, (a) => { const vorher = (a.notif || []).length; a.notif = (a.notif || []).filter((n) => !(n && Array.isArray(n.to) && n.to[1] === l.id)); return a.notif.length !== vorher ? undefined : false; }); } catch (e) { /* Meldungen sind Zugabe */ }
  if (ctx.sp.protokollSchreiben) await ctx.sp.protokollSchreiben({ art: 'dashboard_projekt_geloescht', betrieb: ctx.row.id, text: 'Projekt ' + nr + ' im Dashboard gelöscht', daten: { instanz: ctx.zeile.id, nr: nr, art: z.art, durch: ctx.nutzer.mail } }).catch(() => false);
  return antwortMitSicht(ctx, { msg: 'Projekt ' + nr + ' gelöscht.' });
}
/* Alle Daten als JSON (Art. 20 DSGVO): Profil, Meldungen, Zugänge (ohne Kennungen der Anmeldung), Projekte mit Aufmaß */
async function exportieren(ctx) {
  await kontoVon(ctx, 'export');
  const row = ctx.row, zeile = ctx.zeile, inst = ctx.instanz, d = row.daten || {}, jetzt = jetztVon(ctx);
  const profil = {}; ['einladung', 'ap', 'tel', 'mail', 'abzug', 'prefs', 'since'].forEach((k2) => { if (d[k2] !== undefined) profil[k2] = d[k2]; });
  const projekte = ((await ctx.sp.anfragenVonBetrieb(row.id, {})) || []).filter((z) => z.instanz === zeile.id && sichtbar(z, zeile)).map((z) => ({ code: z.code, nr: z.nr || '', art: z.art, status: z.status, angelegt: z.created_at, eingegangen: z.eingegangen_at || null, projekt: z.daten || {} }));
  const daten = {
    export: 'Dashboard ' + inst.name, erstellt: iso(jetzt), domain: inst.haupthost,
    betrieb: { name: inst.name, plz: row.plz || '', profil: profil, meldungen: Array.isArray(d.notif) ? d.notif : [] },
    zugaenge: (Array.isArray(zeile.zugang) ? zeile.zugang : []).map((z) => ({ mail: z.mail, name: z.name || '', rolle: z.rolle || 'team', bestaetigt: z.bestaetigt || null, zuletzt: z.zuletzt || null, aus: !!z.aus })),
    eingang: (((zeile.eingang || {}).mails) || []).map((x) => ({ mail: x.mail, bestaetigt: x.bestaetigt || null })),
    projekte: projekte
  };
  const name = 'dashboard-export-' + String(zeile.slug || inst.id8).replace(/[^a-z0-9-]/g, '') + '-' + iso(jetzt).slice(0, 10) + '.json';
  return new Response(JSON.stringify(daten, null, 2), { status: 200, headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': 'attachment; filename="' + name + '"', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}

/* ---------- Antworten auf die Routen von konten.js für Instanz-Hosts (dort je ein Haken: if (ctx.instanz) …) ---------- */
export const KONTO_INSTANZ = {
  anmelden: codeAnfordern,
  bestaetigen: codeBestaetigen,
  /* nicht auf Instanz-Hosts: Anmeldelink, Erneuern (Sitzung im Cookie), Registrierung, Code vom Kunden, Tarif, Zahlungsart */
  gesperrt: async () => { throw nichtDa(); },
  lesen: async (ctx) => {
    /* ?start=1: erster Abruf beim Laden der Seite; ohne Sitzung kein Fehler, sondern { angemeldet: false } (dann die Anmeldung) */
    if (ctx.url.searchParams.get('start') === '1') { nurInstanz(ctx); if (!(await sitzungLesen(ctx, 'betrieb'))) return { ok: true, angemeldet: false }; }
    await kontoVon(ctx, 'dashboardLesen');
    const stand = str(ctx.url.searchParams.get('stand'), 200);
    const k2 = await dashboardSicht(ctx, { stand: stand });
    return k2.gleich ? { ok: true, gleich: true, stand: k2.stand } : { ok: true, konto: k2 };
  },
  /* Profil (Einladungsseite, Kontakt, Bestellmaß, Benachrichtigungen); Logo und Farbe pflegt der Einrichtungsservice in der Zentrale */
  aendern: async (ctx) => {
    await kontoVon(ctx, 'dashboardLesen');
    const b = ctx.body || {};
    if (b.logo !== undefined || b.col !== undefined) throw new ApiFehler('Logo und Farbe pflegt Ihr Einrichtungsservice.', 403, { marke: true });
    const profil = ['einladung', 'ap', 'tel', 'mail', 'abzug', 'prefs'].some((k2) => b[k2] !== undefined);
    if (profil && !R().darf(ctx.zeile.status, 'dashboardSchreiben', { feld: 'profil' })) throw statusFehler(ctx.zeile.status, 'dashboardSchreiben');
    if (b.mail !== undefined && !mailOk(String(b.mail).trim())) throw new ApiFehler('Bitte eine gültige E-Mail-Adresse eingeben.');
    if (['einladung', 'ap', 'tel', 'mail', 'abzug'].some((k2) => b[k2] !== undefined)) {
      const d = ctx.row.daten || {}, o = {};
      ['ap', 'tel'].forEach((k2) => { if (b[k2] !== undefined) o[k2] = str(b[k2], k2 === 'ap' ? 80 : 40); });
      if (b.mail !== undefined) o.mail = str(b.mail, 120).toLowerCase();
      if (b.abzug && typeof b.abzug === 'object') o.abzug = b.abzug;
      await profilSetzen(ctx, ctx.zeile.id, b.einladung !== undefined ? b.einladung : d.einladung || {}, o);
    }
    if (b.prefs || b.gelesen || b.gelesenIndex !== undefined) {
      await ctx.sp.betriebAendern(ctx.row.id, (a) => {
        if (b.prefs && typeof b.prefs === 'object') { a.prefs = a.prefs || {}; Object.keys(b.prefs).slice(0, 10).forEach((k2) => { a.prefs[k2] = !!b.prefs[k2]; }); }
        if (b.gelesen) (a.notif || []).forEach((n) => { n.new = false; });
        if (b.gelesenIndex !== undefined && a.notif && a.notif[+b.gelesenIndex]) a.notif[+b.gelesenIndex].new = false;
      });
    }
    ctx.row = await ctx.sp.betriebHolen(ctx.row.id);
    return antwortMitSicht(ctx);
  },
  projektNeu: async (ctx) => {
    await kontoVon(ctx, 'dashboardLesen'); einladenPruefen(ctx);
    const l = await einladungAnlegen(ctx, ctx.body || {});
    return antwortMitSicht(ctx, { id: l.id });
  },
  projektListe: async (ctx) => {
    await kontoVon(ctx, 'dashboardLesen'); einladenPruefen(ctx);
    const b = ctx.body || {}, a = pseudoKonto(ctx.row.daten || {}, null), roh = X().listeProjekte(a, b.text, !!b.du, jetztVon(ctx));
    if (!roh.length) throw new ApiFehler('Keine gültige Zeile gefunden. Beispiel: Familie Weber, 0171 2345678');
    let n = 0;
    for (const l0 of roh) { await einladungAnlegen(ctx, { kunde: l0.kunde, kontakt: l0.kontakt, plan: l0.plan, note: l0.note, days: l0.days, du: l0.du }); n++; }
    return antwortMitSicht(ctx, { n: n });
  },
  projektAendern: projektAendern
};

/* ---------- Fotos im Dashboard (fotos.js: GET /api/konto/foto/:code/:id auf dem Instanz-Host) ---------- */
export async function kontoFoto(ctx) {
  await kontoVon(ctx, 'dashboardLesen');
  const code = String(ctx.params.code || '').trim().toLowerCase(), id = String(ctx.params.id || '');
  if (!/^[a-z0-9]{10}$/.test(code) || !FOTO_ID.test(id)) throw new ApiFehler('Dieses Foto gibt es nicht.', 404);
  const z = await ctx.sp.anfrageHolen(code);
  if (!z || z.instanz !== ctx.zeile.id) throw new ApiFehler('Dieses Foto gibt es nicht.', 404);
  const l = z.daten || {}, ids = fotoIds((l.aufmass || {}).windows), basisId = id.replace(/k$/, '');
  if (!l.aufmass || !ids.has(basisId)) throw new ApiFehler('Dieses Foto gibt es nicht.', 404);
  if (l.fotosGeloescht) throw new ApiFehler('Die Fotos wurden 12 Monate nach dem Eingang gelöscht.', 410);
  const ab = ablage(ctx.k); if (!ab) throw new ApiFehler('Fotos lassen sich hier gerade nicht laden.', 503);
  const u = await ab.holen(linkOrdner(code) + '/' + id + '.jpg');
  if (!u) throw new ApiFehler('Dieses Foto ist nicht angekommen.', 404);
  return new Response(u, { status: 200, headers: { 'content-type': 'image/jpeg', 'cache-control': 'private, max-age=86400', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; sandbox" } });
}

/* ---------- Erinnerung an offene Einladungen (täglich, router.js geplant) ----------
   Je Instanz mit Dashboard höchstens eine Mail an die bestätigten Eingangsadressen: Einladungen, die verschickt oder geöffnet sind, an
   denen der Kunde aber seit FRISTEN.einladungErinnernTage nicht gemessen hat; je Projekt nur einmal (daten.erinnert). Neutral, mit
   Links ins Dashboard; abschaltbar unter „Betrieb · Benachrichtigungen“ (prefs.remind). */
export async function einladungenErinnern(k, sp, env) {
  const pd = postDienst(k);
  if (!pd || !sp || !sp.instanzenAlle || !sp.anfragenVonBetrieb) return { ok: true, gesendet: 0 };
  const jetzt = (k && k.jetzt) || Date.now(), tage = R().FRISTEN.einladungErinnernTage;
  let gesendet = 0, fehler = 0;
  for (const i of (await sp.instanzenAlle({ status: 'aktiv' })) || []) {
    const m = merkmaleVon(i); if (!m || !m.dashboard || !m.einladungslinks) continue;
    const inst = await instanzKontext(sp, i.id); if (!inst || !inst.eingang.mails.length || !inst.haupthost) continue;
    const row = await sp.betriebHolen(i.betrieb); if (((row && row.daten) || {}).prefs && row.daten.prefs.remind === false) continue;
    const offen = ((await sp.anfragenVonBetrieb(i.betrieb, { kopf: true })) || []).filter((z) => {
      const l = z.daten || {};
      if (z.instanz !== i.id || z.art !== 'einladung' || l.erinnert || !['gesendet', 'geoeffnet'].includes(l.status) || (l.progress || 0) > 0) return false;
      if (X().linkZu(l, jetzt)) return false;
      const t = Date.parse(z.created_at || ''); return !Number.isNaN(t) && jetzt - t >= tage * TAG;
    });
    if (!offen.length) continue;
    const basis = (offen[0].versand && offen[0].versand.basis) || 'https://' + inst.haupthost;
    const zeilen = offen.slice(0, 20).map((z) => { const l = z.daten || {}; return '<li style="margin:0 0 6px"><a href="' + esc(basis + '/betrieb/#projekt-' + encodeURIComponent(l.id || z.lid)) + '" style="color:#161616;font-weight:700">' + esc(l.kunde || 'Kunde') + '</a>' + (z.nr ? ' · ' + esc(z.nr) : '') + ' · ' + (l.status === 'geoeffnet' ? 'Link geöffnet, noch nichts geplant' : 'Link verschickt, noch nicht geöffnet') + '</li>'; }).join('');
    const titel = offen.length === 1 ? 'Erinnerung: ' + String((offen[0].daten || {}).kunde || 'Ein Kunde').slice(0, 60) + ' hat noch nicht geplant' : 'Erinnerung: ' + offen.length + ' Kunden haben noch nicht geplant';
    const html = mailRahmen(titel, absatz('Guten Tag,') + absatz(offen.length === 1 ? 'ein Kunde hat seit ' + tage + ' Tagen noch nicht geplant:' : offen.length + ' Kunden haben seit ' + tage + ' Tagen noch nicht geplant:') +
      '<ul style="margin:0 0 14px;padding-left:20px">' + zeilen + '</ul>' + absatz('Ein kurzer Anruf oder eine Nachricht hilft oft. Im Dashboard können Sie den Link erneut schicken.') +
      absatz('<span style="font-size:13px;color:#6e6e73">Wir erinnern je Projekt nur einmal. Abschalten können Sie das im Dashboard unter „Betrieb · Benachrichtigungen“.</span>'), '', { marke: rahmenMarke(inst) });
    let r = null; try { r = await pd.senden({ an: inst.eingang.mails.map((x) => x.mail), betreff: titel, html: html, von: absender(k, inst) }); } catch (e) { r = null; }
    if (!r || !r.ok) { fehler++; continue; }
    const heute = datumBerlin(jetzt);
    for (const z of offen) { try { await sp.anfrageAendern(z.code, (x) => { x.daten = Object.assign({}, x.daten || {}, { erinnert: heute }); }); } catch (e) { fehler++; } }
    gesendet++;
  }
  return { ok: true, gesendet: gesendet, fehler: fehler };
}

/* ---------- Zusätzliche Routen (nur Instanz-Hosts mit Dashboard; auf der Hauptdomain wie unbekannt) ---------- */
export const DASHBOARD = {
  'POST /api/konto/abmelden': async (ctx) => { nurInstanz(ctx); return json({ ok: true }, 200, { 'set-cookie': sitzungLoeschen(ctx, 'betrieb') }); },
  'GET /api/konto/export': exportieren,
  'GET /api/konto/projekte/:id': async (ctx) => {
    await kontoVon(ctx, 'dashboardLesen');
    const z = await zeileZuProjekt(ctx, ctx.params.id);
    return { ok: true, link: linkAusZeile(z, jetztVon(ctx), true) };
  },
  'POST /api/konto/projekte/:id/loeschen': projektLoeschen
};

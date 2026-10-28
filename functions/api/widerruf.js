/* eeziframes · Widerrufsfunktion nach § 356a BGB (gilt seit 19. Juni 2026)
   Auf jeder Seite führt „Vertrag widerrufen“ zu /widerruf/; dort schickt „Widerruf bestätigen“ die Erklärung hierher, mit JavaScript
   als JSON, ohne JavaScript als gewöhnliches Formular (dann antwortet der Server mit einer Seite im Aufbau von /widerruf/).
   Abgefragt wird nur, was das Gesetz vorsieht: Name, Angaben zum Vertrag, E-Mail-Adresse für die Eingangsbestätigung.
   Der Server hält den Eingang zuerst im Protokoll der Zentrale fest (Art „widerruf“, bis zum Ende des dritten Jahres nach dem Eingang),
   bestätigt ihn sofort per E-Mail (Inhalt, Datum und Uhrzeit; ausdrücklich ohne Prüfung der Wirksamkeit) und schickt dem Betreiber eine
   Kopie. Scheitert die Mail, zeigt die Seite die Bestätigung trotzdem, und der tägliche Lauf schickt die Eingangsbestätigung nach
   (widerrufeNachholen, vermerkt als „widerruf_bestaetigt“). Ließe sich der Widerruf weder speichern noch melden, schreibt der Server
   ihn ins Log (letzter Nachweis) und nennt dem Kunden die anderen Wege (E-Mail, Brief), statt ihn als angenommen anzuzeigen. */
import { ApiFehler, erlaubt, quelle } from './umgebung.js';
import { postDienst, mailOk, esc, zeitText, mailRahmen } from './post.js';
import { ANBIETER } from './anbieter.js';
import { SICHERHEIT, SPERRE } from '../seo.js';

const TAG = 24 * 60 * 60 * 1000;
const str = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';
const zeileM = (a, b) => '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">' + a + '</td><td style="padding:4px 0">' + b + '</td></tr>';

function bestaetigung(w, kontakt, spaeter) {
  return mailRahmen('Eingangsbestätigung Ihres Widerrufs',
    absatz('Guten Tag ' + esc(w.name) + ',') +
    absatz('Ihre Widerrufserklärung ist bei uns eingegangen.' + (spaeter ? ' Bitte entschuldigen Sie, dass diese Bestätigung wegen einer Störung unseres E-Mail-Versands erst jetzt kommt.' : '')) +
    '<table style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' +
    zeileM('Eingang', '<b>' + esc(w.wann) + '</b>') +
    zeileM('Erklärung', 'Hiermit widerrufe ich den folgenden Vertrag: ' + esc(w.vertrag)) +
    zeileM('Name', esc(w.name)) +
    zeileM('E-Mail', esc(w.mail)) + '</table>' +
    absatz('Diese E-Mail bestätigt nur den Eingang Ihrer Erklärung. Ob der Widerruf wirksam ist, prüfen wir und melden uns bei Ihnen.') +
    absatz('Bei Fragen antworten Sie einfach auf diese E-Mail.'), kontakt);
}

function kopie(w, bestaetigt, spaeter) {
  return mailRahmen('Widerruf eingegangen',
    absatz('Über die Widerrufsfunktion der Website ist ein Widerruf eingegangen' + (spaeter ? ' (Meldung nachgeholt nach einer Störung des Mailversands)' : '') + '. Bitte prüfen und dem Kunden antworten (Antworten geht direkt an ihn).') +
    '<table style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' +
    [['Eingang', w.wann], ['Name', w.name], ['E-Mail', w.mail], ['Vertrag', w.vertrag], ['Eingangsbestätigung', bestaetigt ? 'an den Kunden gesendet' : 'nicht gesendet, bitte selbst bestätigen']].map((z) => zeileM(z[0], esc(z[1]))).join('') + '</table>' +
    absatz('Der Eingang steht auch im Protokoll der Zentrale (Art „Widerruf“).'), '');
}

/* Den Widerruf annehmen: sichern, bestätigen, melden. Wirft ApiFehler bei fehlenden Angaben, Bremse oder Doppelausfall */
async function annehmen(ctx) {
  if (!erlaubt('widerruf:' + quelle(ctx.request), 6, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in ein paar Minuten noch einmal oder per E-Mail.', 429);
  const b = ctx.body || {}, name = str(b.name, 120), vertrag = str(b.vertrag, 600), mail = str(b.mail, 160).toLowerCase();
  const felder = {};
  if (!name) felder.name = 'Bitte Ihren Namen angeben.';
  if (!vertrag) felder.vertrag = 'Bitte angeben, welchen Vertrag Sie widerrufen.';
  if (!mailOk(mail)) felder.mail = 'Bitte eine gültige E-Mail-Adresse angeben, an die wir die Bestätigung schicken.';
  if (Object.keys(felder).length) throw new ApiFehler(Object.values(felder)[0], 400, { felder: felder });
  const jetzt = new Date(), w = { name: name, vertrag: vertrag, mail: mail, eingang: jetzt.toISOString(), wann: zeitText(jetzt) };
  const pd = postDienst(ctx.k), id = crypto.randomUUID();
  let protokoll = false, bestaetigt = false, gemeldet = false;
  if (pd) {
    bestaetigt = (await pd.senden({ an: mail, name: name, betreff: 'Eingangsbestätigung Ihres Widerrufs', html: bestaetigung(w, pd.kontakt), antwortAn: pd.kontakt })).ok;
    gemeldet = (await pd.senden({ an: pd.kontakt, betreff: 'Widerruf eingegangen: ' + name, html: kopie(w, bestaetigt), antwortAn: mail })).ok;
  }
  if (ctx.sp && ctx.sp.protokollSchreiben) {
    try { protokoll = await ctx.sp.protokollSchreiben({ id: id, art: 'widerruf', text: 'Widerruf von ' + name + ' (' + mail + '): ' + vertrag.slice(0, 300) + (bestaetigt ? '' : ' · Eingangsbestätigung noch offen'), daten: { name: name, mail: mail, vertrag: vertrag, eingang: w.eingang, bestaetigt: bestaetigt, gemeldet: gemeldet } }); } catch (e) { console.log('Widerruf nicht protokolliert', String(e).slice(0, 120)); }
  }
  /* Ohne Eintrag im Protokoll und ohne Kopie an den Betreiber bleibt nur das Log (Workers Logs, wenige Tage) als Nachweis */
  if (!protokoll && !gemeldet) console.log('Widerruf eingegangen' + (bestaetigt ? ', nur dem Kunden bestätigt' : ', weder gespeichert noch bestätigt'), JSON.stringify({ name: name, mail: mail, vertrag: vertrag, eingang: w.eingang }));
  if (!bestaetigt && !protokoll && !gemeldet) throw new ApiFehler('Die Online-Widerrufsfunktion ist gerade nicht erreichbar. Bitte widerrufen Sie per E-Mail oder Brief an die Adresse auf dieser Seite.', 503, { anders: true });
  if (ctx.zaehlen) ctx.zaehlen('ereignis:widerruf');
  return { ok: true, eingang: w.eingang, zeit: w.wann, bestaetigt: bestaetigt, an: bestaetigt ? mail : '', nachholen: !bestaetigt && protokoll, inhalt: { name: name, vertrag: vertrag, mail: mail } };
}

/* Antwort ohne JavaScript: die Seite /widerruf/ mit dem Ergebnis an Stelle des Formulars */
async function seite(ctx, inhalt, status) {
  let html = '';
  try { const r = ctx.env && ctx.env.ASSETS ? await ctx.env.ASSETS.fetch(new Request(ctx.url.origin + '/widerruf/')) : null; if (r && r.ok) html = await r.text(); } catch (e) { html = ''; }
  const main = '<main id="inhalt">\n' + inhalt + '\n</main>';
  html = html && /<main[^>]*>[\s\S]*?<\/main>/.test(html)
    ? html.replace(/<main[^>]*>[\s\S]*?<\/main>/, () => main).replace(/<script src="\/assets\/widerruf\.js"[^>]*><\/script>\n?/, '')
    : '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vertrag widerrufen · eeziframes</title><link rel="stylesheet" href="/assets/recht.css"></head><body>' + main + '</body></html>';
  return new Response(html, { status: status || 200, headers: Object.assign({}, SICHERHEIT, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': SPERRE }) });
}
const postText = (r) => r.bestaetigt ? 'Eine Eingangsbestätigung mit diesen Angaben haben wir an ' + esc(r.an) + ' geschickt.' : 'Die Eingangsbestätigung per E-Mail senden wir Ihnen, sobald unser E-Mail-Versand wieder erreichbar ist. Diese Seite können Sie zusätzlich speichern oder ausdrucken.';
function erfolgHtml(r) {
  return '  <p class="klein">Widerrufsfunktion</p>\n  <div id="widerruf-ok" class="karte ok" role="status">\n    <h1>Ihr Widerruf ist eingegangen.</h1>\n' +
    '    <p>Eingang: <strong>' + esc(r.zeit) + '</strong></p>\n    <p>Ihre Erklärung: Hiermit widerrufe ich den folgenden Vertrag: ' + esc(r.inhalt.vertrag) + '</p>\n' +
    '    <p>Name: ' + esc(r.inhalt.name) + ' · E-Mail: ' + esc(r.inhalt.mail) + '</p>\n    <p>' + postText(r) + '</p>\n' +
    '    <p class="klein">Diese Bestätigung sagt nur, dass Ihre Erklärung eingegangen ist. Ob der Widerruf wirksam ist, prüfen wir und melden uns bei Ihnen.</p>\n  </div>\n  <p><a href="/">Zur Startseite</a></p>';
}
function fehlerHtml(e) {
  const felder = e.extra && e.extra.felder ? Object.values(e.extra.felder) : [e.message];
  return '  <p class="klein">Widerrufsfunktion</p>\n  <h1>Vertrag widerrufen</h1>\n  <div class="karte" role="alert">\n' + felder.map((t) => '    <p class="fehler">' + esc(t) + '</p>\n').join('') +
    '    <p><a href="/widerruf/">Zurück zum Formular</a></p>\n  </div>\n' +
    '  <h2>Andere Wege</h2>\n  <p>Sie können auch per Brief an ' + esc(ANBIETER.name + ', ' + ANBIETER.strasse + ', ' + ANBIETER.ort) + ' oder per E-Mail an die Adresse im <a href="/impressum/">Impressum</a> widerrufen, zum Beispiel mit dem <a href="/agb/#widerrufsformular">Muster-Widerrufsformular</a>.</p>';
}

export const WIDERRUF = {
  'POST /api/widerruf': async (ctx) => {
    if (!ctx.formular) return annehmen(ctx);
    try { return await seite(ctx, erfolgHtml(await annehmen(ctx))); } catch (e) { if (e instanceof ApiFehler) return seite(ctx, fehlerHtml(e), e.status); throw e; }
  }
};

/* Täglicher Lauf: Eingangsbestätigungen nachholen, die wegen einer Störung des Mailversands nicht rausgingen (Widerrufe der letzten
   30 Tage, höchstens 20 je Lauf), samt der Kopie an den Betreiber, falls auch die fehlte */
export async function widerrufeNachholen(k, sp) {
  const pd = postDienst(k);
  if (!sp || !sp.protokollLesen || !pd) return { ok: true, nachgeholt: 0 };
  const seit = new Date(Date.now() - 30 * TAG).toISOString();
  const [ein, erledigt] = await Promise.all([sp.protokollLesen({ art: 'widerruf', seit: seit, anzahl: 500 }), sp.protokollLesen({ art: 'widerruf_bestaetigt', seit: seit, anzahl: 500 })]);
  if (!ein || !erledigt) return { ok: false, grund: 'Protokoll fehlt' };
  const fertig = new Set(erledigt.map((e) => e.daten && e.daten.zu).filter(Boolean));
  let nachgeholt = 0, fehler = 0;
  for (const e of ein) {
    const d = e.daten || {};
    if (d.bestaetigt || fertig.has(e.id) || !mailOk(d.mail)) continue;
    if (nachgeholt + fehler >= 20) break;
    const w = { name: d.name || '', vertrag: d.vertrag || '', mail: d.mail, eingang: d.eingang || e.zeit, wann: zeitText(new Date(d.eingang || e.zeit)) };
    const ok = (await pd.senden({ an: w.mail, name: w.name, betreff: 'Eingangsbestätigung Ihres Widerrufs', html: bestaetigung(w, pd.kontakt, true), antwortAn: pd.kontakt })).ok;
    if (!ok) { fehler++; continue; }
    if (!d.gemeldet) await pd.senden({ an: pd.kontakt, betreff: 'Widerruf eingegangen: ' + w.name, html: kopie(w, true, true), antwortAn: w.mail });
    await sp.protokollSchreiben({ art: 'widerruf_bestaetigt', text: 'Eingangsbestätigung nachgeholt an ' + w.mail, daten: { zu: e.id, an: w.mail, zeit: new Date().toISOString() } });
    nachgeholt++;
  }
  return { ok: !fehler, nachgeholt: nachgeholt, fehler: fehler };
}

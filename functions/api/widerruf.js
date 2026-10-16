/* eeziframes · Widerrufsfunktion nach § 356a BGB (gilt seit 19. Juni 2026)
   Auf jeder Seite führt „Vertrag widerrufen“ zu /widerruf/; dort schickt „Widerruf bestätigen“ die Erklärung hierher.
   Abgefragt wird nur, was das Gesetz vorsieht: Name, Angaben zum Vertrag, E-Mail-Adresse für die Eingangsbestätigung.
   Der Server bestätigt den Eingang sofort per E-Mail (Inhalt, Datum und Uhrzeit; ausdrücklich ohne Prüfung der Wirksamkeit),
   schickt dem Betreiber eine Kopie und hält den Eingang im Protokoll der Zentrale fest (Art „widerruf“, drei Jahre wie alle Eingriffe).
   Gibt es weder Mailversand noch Protokoll, nimmt er nichts an und nennt die anderen Wege (E-Mail, Brief), statt einen Widerruf zu verlieren. */
import { ApiFehler, erlaubt, quelle } from './umgebung.js';
import { postDienst, mailOk, esc, zeitText, mailRahmen } from './post.js';

const str = (v, n) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, n);
const absatz = (t) => '<p style="margin:0 0 12px">' + t + '</p>';

function bestaetigung(w, kontakt) {
  return mailRahmen('Eingangsbestätigung Ihres Widerrufs',
    absatz('Guten Tag ' + esc(w.name) + ',') +
    absatz('Ihre Widerrufserklärung ist bei uns eingegangen.') +
    '<table style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' +
    '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">Eingang</td><td style="padding:4px 0"><b>' + esc(w.wann) + '</b></td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">Erklärung</td><td style="padding:4px 0">Hiermit widerrufe ich den folgenden Vertrag: ' + esc(w.vertrag) + '</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">Name</td><td style="padding:4px 0">' + esc(w.name) + '</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">E-Mail</td><td style="padding:4px 0">' + esc(w.mail) + '</td></tr></table>' +
    absatz('Diese E-Mail bestätigt nur den Eingang Ihrer Erklärung. Ob der Widerruf wirksam ist, prüfen wir und melden uns bei Ihnen.') +
    absatz('Bei Fragen antworten Sie einfach auf diese E-Mail.'), kontakt);
}

function kopie(w, bestaetigt) {
  return mailRahmen('Widerruf eingegangen',
    absatz('Über die Widerrufsfunktion der Website ist ein Widerruf eingegangen. Bitte prüfen und dem Kunden antworten (Antworten geht direkt an ihn).') +
    '<table style="border-collapse:collapse;margin:0 0 16px;font-size:15px">' +
    [['Eingang', w.wann], ['Name', w.name], ['E-Mail', w.mail], ['Vertrag', w.vertrag], ['Eingangsbestätigung', bestaetigt ? 'an den Kunden gesendet' : 'nicht gesendet, bitte selbst bestätigen']]
      .map((z) => '<tr><td style="padding:4px 12px 4px 0;color:#6e6e73;vertical-align:top">' + z[0] + '</td><td style="padding:4px 0">' + esc(z[1]) + '</td></tr>').join('') + '</table>' +
    absatz('Der Eingang steht auch im Protokoll der Zentrale (Art „Widerruf“).'), '');
}

export const WIDERRUF = {
  'POST /api/widerruf': async (ctx) => {
    if (!erlaubt('widerruf:' + quelle(ctx.request), 6, 10 * 60 * 1000)) throw new ApiFehler('Zu viele Versuche. Bitte in ein paar Minuten noch einmal oder per E-Mail.', 429);
    const b = ctx.body || {}, name = str(b.name, 120), vertrag = str(b.vertrag, 600), mail = str(b.mail, 160).toLowerCase();
    const felder = {};
    if (!name) felder.name = 'Bitte Ihren Namen angeben.';
    if (!vertrag) felder.vertrag = 'Bitte angeben, welchen Vertrag Sie widerrufen.';
    if (!mailOk(mail)) felder.mail = 'Bitte eine gültige E-Mail-Adresse angeben, an die wir die Bestätigung schicken.';
    if (Object.keys(felder).length) throw new ApiFehler(Object.values(felder)[0], 400, { felder: felder });
    const jetzt = new Date(), w = { name: name, vertrag: vertrag, mail: mail, eingang: jetzt.toISOString(), wann: zeitText(jetzt) };
    const pd = postDienst(ctx.k);
    let protokoll = false, bestaetigt = false, gemeldet = false;
    if (ctx.sp && ctx.sp.protokollSchreiben) {
      try { protokoll = await ctx.sp.protokollSchreiben({ art: 'widerruf', text: 'Widerruf von ' + name + ' (' + mail + '): ' + vertrag.slice(0, 300), daten: { name: name, mail: mail, vertrag: vertrag, eingang: w.eingang } }); } catch (e) { console.log('Widerruf nicht protokolliert', String(e).slice(0, 120)); }
    }
    if (pd) {
      bestaetigt = (await pd.senden({ an: mail, name: name, betreff: 'Eingangsbestätigung Ihres Widerrufs', html: bestaetigung(w, pd.kontakt), antwortAn: pd.kontakt })).ok;
      gemeldet = (await pd.senden({ an: pd.kontakt, betreff: 'Widerruf eingegangen: ' + name, html: kopie(w, bestaetigt), antwortAn: mail })).ok;
    }
    if (!bestaetigt && !protokoll && !gemeldet) throw new ApiFehler('Die Online-Widerrufsfunktion ist gerade nicht erreichbar. Bitte widerrufen Sie per E-Mail oder Brief an die Adresse auf dieser Seite.', 503, { anders: true });
    if (!protokoll && !gemeldet) console.log('Widerruf eingegangen, nur bestätigt', JSON.stringify(w)); // letzter Nachweis für den Betreiber
    if (ctx.zaehlen) ctx.zaehlen('ereignis:widerruf');
    return { ok: true, eingang: w.eingang, zeit: w.wann, bestaetigt: bestaetigt, an: bestaetigt ? mail : '', inhalt: { name: name, vertrag: vertrag, mail: mail } };
  }
};

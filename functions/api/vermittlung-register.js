/* eeziframes · Register der Fensterbetriebe (docs/VERMITTLUNG.md, Abschnitt 13; Auftrag des Inhabers, 30.10.2026: „ein kleines Lexikon
   von Betrieben, mit denen ich bisher Informationen ausgetauscht habe“)
   Je Betrieb eine Zeile (Tabelle vermittlung_betriebe, vermittlung-daten.js): Kennung wie in den Anfragen (betriebId aus Name und Ort),
   Kontakt, Stand, Partner-Erklärung, Konto im Kundenbereich, Zähler und die Liste seiner Anfragen mit Ergebnis.
   - Doppelte: Die KI findet denselben Betrieb manchmal mit leicht anderem Namen oder Ort. Beim Eintragen zählt zuerst die Kennung, dann
     dieselbe Telefonnummer oder dieselbe Website (Inhaber: „in der Kombination mit dem Namen und der Adresse ist das ja schon sehr
     sicher“). Ein zweiter Treffer wird kein neuer Eintrag; seine Kennung kommt als Alias an den ersten.
   - Stand: neu (nur in Anfragen gesehen), kontakt (angerufen), partner (eingetragen, Bereitschaft erklärt), abgelehnt (will grundsätzlich
     keine Anfragen), pausiert (Partner, der gerade keine will). Nur neu → kontakt setzt der Server selbst; den Rest der Inhaber oder der
     Betrieb in seinem Bereich.
   - Zähler aus der Liste der Anfragen: anfragen, will, will_nicht, nicht_erreicht, zugaenge (Zugang geschickt), geoeffnet, frei
     (kostenlos freigeschaltet), bezahlt (gegen Geld), offen (Zugang da, noch nicht freigeschaltet).
   - partnerVorn: Partner im Umkreis stehen bei der Suche auf Platz 1 und 2 (Inhaber: „in den ersten zwei Positionen“), gekennzeichnet
     mit partner: true (die App zeigt „Partner“ und sagt, wonach sortiert ist; § 5b Abs. 2 UWG). Ein Partner mit Postleitzahl kommt auch in
     die Liste, wenn ihn keine Suche gefunden hat. */
import { plzInfo, km, betriebLage } from './vermittlung-ort.js';

export const STAENDE_BETRIEB = { neu: 'Neu', kontakt: 'Kontakt', partner: 'Partner', abgelehnt: 'Abgelehnt', pausiert: 'Pausiert' };
/* Freemail-Anbieter: die Domain einer solchen Adresse sagt nichts über den Betrieb (mehr-Ebenen-Prüfung des kostenlosen Aufmaßes) */
export const FREIMAIL = new Set(['gmail.com', 'googlemail.com', 'web.de', 'gmx.de', 'gmx.net', 'gmx.at', 'gmx.ch', 't-online.de', 'outlook.de', 'outlook.com', 'hotmail.de', 'hotmail.com', 'live.de', 'live.com', 'msn.com', 'yahoo.de', 'yahoo.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'aol.de', 'freenet.de', 'posteo.de', 'posteo.net', 'mail.de', 'online.de', 'arcor.de', 'protonmail.com', 'proton.me', 'mailbox.org', 'vodafone.de', 'unitybox.de', 'kabelmail.de', 'o2online.de', 'magenta.de', 'bluewin.ch', 'example.com']);
/* Domain einer E-Mail-Adresse als Website-Host des Betriebs (ohne www.), leer bei Freemail */
export function mailHost(mail) { const h = String(mail || '').toLowerCase().split('@')[1] || ''; return h && !FREIMAIL.has(h) ? h.replace(/^www\./, '') : ''; }
export const PARTNER_VORN = 2;
export const PARTNER_KM = 30;

const jetzt = () => new Date().toISOString();
const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
/* Telefonnummer nur Ziffern (führende 0 statt +49), Website nur der Host ohne www */
export function telNorm(t) { let d = String(t || '').replace(/\D/g, ''); if (d.startsWith('0049')) d = '0' + d.slice(4); else if (d.startsWith('49') && d.length > 10) d = '0' + d.slice(2); return d.length >= 6 ? d : ''; }
export function webHost(w) { const m = /^(?:https?:\/\/)?(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/i.exec(String(w || '').trim()); return m ? m[1].toLowerCase() : ''; }

/* Zeile des Registers aus einem Betrieb einer Anfrage (oder aus dem Eintrag eines Betriebs selbst) */
export function zeileAus(b, extra) {
  return Object.assign({
    id: b.id, name: kurz(b.name, 80), ort: kurz(b.ort, 60), plz: /^\d{5}$/.test(String(b.plz || '')) ? String(b.plz) : '', strasse: kurz(b.strasse, 80), tel: kurz(b.tel, 40), web: kurz(b.web, 200), mail: kurz(b.mail, 120).toLowerCase(),
    tel_norm: telNorm(b.tel), web_host: webHost(b.web), leistungen: Array.isArray(b.leistungen) ? b.leistungen.slice(0, 10) : [], quelle: b.quelle || 'ki', stand: 'neu', partner: {}, konto: null, konten: [],
    zaehler: {}, anfragen: [], aliase: [], notiz: '', verlauf: []
  }, extra || {});
}
const verlauf = (z, von, text) => { (z.verlauf = z.verlauf || []).push({ zeit: jetzt(), von: von, text: text }); if (z.verlauf.length > 200) z.verlauf = z.verlauf.slice(-200); };

/* Den Eintrag zu einem Betrieb finden (Kennung, Alias, Nummer, Website) oder anlegen; ein Treffer über Nummer oder Website bekommt die
   Kennung als Alias und, wo noch leer, die Angaben aus b */
export async function registerFuer(d, b, quelle) {
  /* b.register: der Inhaber hat den Betrieb dieser Anfrage von Hand einem Eintrag zugeordnet oder abgetrennt (Pflege in der Zentrale) */
  let r = b.register ? await d.betriebHolen(b.register) : null;
  if (!r) r = await d.betriebHolen(b.id);
  if (!r) {
    const tn = telNorm(b.tel), wh = webHost(b.web);
    if (tn || wh) r = await d.betriebNachKontakt(tn, wh);
    if (r && r.id !== b.id && !(r.aliase || []).includes(b.id)) {
      r = await d.betriebAendern(r.id, (z) => {
        z.aliase = (z.aliase || []).concat([b.id]);
        ['ort', 'plz', 'strasse', 'tel', 'web'].forEach((f) => { if (!z[f] && b[f]) z[f] = kurz(b[f], f === 'web' ? 200 : 80); });
        if (!(z.leistungen || []).length && Array.isArray(b.leistungen)) z.leistungen = b.leistungen.slice(0, 10);
        verlauf(z, 'system', 'Als ' + b.name + (b.ort ? ', ' + b.ort : '') + ' noch einmal gefunden (gleiche Nummer oder Website)');
      });
    }
  }
  if (!r) { const z = zeileAus(b, { quelle: quelle || b.quelle || 'ki' }); verlauf(z, 'system', 'Eingetragen aus ' + (quelle === 'register' ? 'dem Bereich für Fensterbauer' : quelle === 'inhaber' ? 'der Zentrale' : 'einer Anfrage')); r = await d.betriebSetzen(z); }
  return r;
}

/* Eintrag einer Anfrage in der Liste des Betriebs aus dem Stand in der Anfrage (v) und seinem Betrieb (x) ableiten */
export function anfrageEintrag(v, x) {
  const k = v.kunde || {}, f = x.freischaltung || null, z = x.zugang || null;
  return { id: v.id, nr: v.nr, zeit: v.created_at, ort: (v.plz + ' ' + (k.ort || '')).trim(), bid: x.id, mail: String((z && z.mail) || x.mail || '').toLowerCase(), gewaehlt: !!x.gewaehlt, status: x.status || 'offen', status_zeit: x.status_zeit || '',
    zugang: z ? z.zeit : (x.gesendet ? x.gesendet.zeit : ''), geoeffnet: z && z.geoeffnet ? z.geoeffnet : '', frei: f ? f.zeit : '', art: f ? f.art : '', cent: f ? f.cent || 0 : 0 };
}
export function zaehlen(l) {
  const n = (f) => l.filter(f).length;
  return { anfragen: l.length, will: n((a) => a.status === 'will'), will_nicht: n((a) => a.status === 'will_nicht'), nicht_erreicht: n((a) => a.status === 'nicht_erreicht'),
    zugaenge: n((a) => a.zugang), geoeffnet: n((a) => a.geoeffnet), frei: n((a) => a.art === 'frei'), bezahlt: n((a) => a.art === 'bezahlt'), offen: n((a) => a.zugang && !a.frei), umsatz_cent: l.reduce((s, a) => s + (a.cent || 0), 0) };
}
/* Nach jeder Änderung an einem Betrieb in einer Anfrage: Liste, Zähler und Stand des Registers nachführen (nie werfen, das Register ist
   Hilfsmittel; ein Fehler bleibt im Protokoll). text: Zeile für den Verlauf des Betriebs */
export async function registerMerken(d, v, x, text) {
  if (!d || !d.betriebHolen) return null;
  try {
    const r = await registerFuer(d, x, x.quelle);
    return await d.betriebAendern(r.id, (z) => {
      const e = anfrageEintrag(v, x), l = (z.anfragen || []).filter((a) => a.id !== v.id).concat([e]).sort((a, b) => (a.zeit < b.zeit ? -1 : 1)).slice(-200);
      z.anfragen = l; z.zaehler = zaehlen(l);
      if (z.stand === 'neu' && (e.status !== 'offen' || e.zugang)) z.stand = 'kontakt';
      if (x.mail && !z.mail) z.mail = String(x.mail).toLowerCase();
      if (text) verlauf(z, 'system', text + ' (' + v.nr + ')');
    });
  } catch (e) { console.log('Register der Betriebe', String(e && e.message ? e.message : e).slice(0, 160)); return null; }
}
/* Alle Betriebe aller Anfragen ins Register (Zentrale: „Register neu aufbauen“); Stand, Partner, Konto, Notiz und Mail bleiben */
export async function registerNeuAufbauen(d) {
  const alle = await d.alle(), out = { betriebe: 0, anfragen: alle.length };
  for (const z of alle) {
    const v = await d.holen(z.id); if (!v) continue;
    for (const x of v.betriebe || []) { await registerMerken(d, v, x); out.betriebe++; }
  }
  return out;
}

/* Partner im Umkreis nach vorn: höchstens PARTNER_VORN, die nächsten zuerst, dann die übrige Liste nach km. Ein Partner, den keine Suche
   gefunden hat, kommt aus dem Register dazu (Lage aus seiner Postleitzahl, sonst aus seinem Ort), wenn er innerhalb von PARTNER_KM liegt.
   lage: plzInfo des Kunden; liste: Betriebe nach km (umgebung in vermittlung.js). Nie werfen. */
export async function partnerVorn(d, lage, liste) {
  if (!d || !d.betriebePartner) return liste;
  let partner = [];
  try { partner = (await d.betriebePartner()).filter((r) => r.partner && r.partner.bereit); } catch (e) { return liste; }
  if (!partner.length) return liste;
  const ids = (r) => [r.id].concat(r.aliase || []);
  const passt = (r, b) => ids(r).includes(b.id) || (r.tel_norm && r.tel_norm === telNorm(b.tel)) || (r.web_host && r.web_host === webHost(b.web));
  const vorn = [], rest = liste.slice();
  for (const r of partner) {
    const i = rest.findIndex((b) => passt(r, b));
    if (i >= 0) { const b = rest.splice(i, 1)[0]; vorn.push(Object.assign({}, b, { partner: true, register: r.id })); continue; }
    if (!lage) continue;
    const p = plzInfo(r.plz) || betriebLage({ ort: r.ort }, lage); if (!p) continue;
    const e = km(lage, p); if (e > PARTNER_KM) continue;
    vorn.push({ id: r.id, name: r.name, ort: r.ort, plz: r.plz || '', strasse: r.strasse || '', tel: r.tel || '', web: r.web || '', km: Math.round(e), leistungen: (r.leistungen || []).slice(), quelle: 'partner', partner: true, register: r.id });
  }
  const nachKm = (a, b) => a.km - b.km || a.name.localeCompare(b.name, 'de');
  vorn.sort(nachKm);
  return vorn.slice(0, PARTNER_VORN).concat(vorn.slice(PARTNER_VORN).concat(rest).sort(nachKm));
}

/* ---------- Pflege durch den Inhaber (Zentrale) ---------- */
/* Auszug eines Eintrags für die Betriebskarte in der Anfrage: was der Inhaber vor dem Anruf wissen will */
export function registerAuszug(r, x) {
  if (!r) return null;
  const z = r.zaehler || {}, mails = Array.from(new Set([r.mail].concat((r.anfragen || []).map((a) => a.mail)).filter(Boolean)));
  return { id: r.id, name: r.name, ort: r.ort || '', stand: r.stand, standText: STAENDE_BETRIEB[r.stand] || r.stand, zaehler: z, konten: (r.konto ? 1 : 0) + (r.konten || []).length, mails: mails.slice(0, 6),
    notiz: String(r.notiz || '').slice(0, 200), aliase: (r.aliase || []).length, anfragen: (r.anfragen || []).length, partner: !!(r.partner || {}).bereit, genutzt: (z.frei || 0) + (z.bezahlt || 0) > 0,
    anders: !!x && r.id !== x.id && r.name !== x.name, zugeordnet: !!(x && x.register) };
}
/* Den Eintrag einer Anfrage aus einem Register-Eintrag nehmen und einem anderen geben (beide Zähler neu) */
async function eintragVerschieben(d, v, x, von, nach, text) {
  if (von && von.id !== nach.id) await d.betriebAendern(von.id, (z) => { z.anfragen = (z.anfragen || []).filter((a) => a.id !== v.id); z.zaehler = zaehlen(z.anfragen); verlauf(z, 'inhaber', text + ' (' + v.nr + ')'); });
  await d.betriebAendern(nach.id, (z) => { const e = anfrageEintrag(v, x), l = (z.anfragen || []).filter((a) => a.id !== v.id).concat([e]).sort((a, b) => (a.zeit < b.zeit ? -1 : 1)).slice(-200); z.anfragen = l; z.zaehler = zaehlen(l); if (z.stand === 'neu' && (e.status !== 'offen' || e.zugang)) z.stand = 'kontakt'; verlauf(z, 'inhaber', 'Anfrage ' + v.nr + ' zugeordnet'); });
}
/* Trennen: der Betrieb dieser Anfrage ist ein anderer als der im Eintrag (zwei „Fensterbau Schmidt“): neuer Eintrag mit eigener Kennung,
   die Anfrage merkt sich ihn in x.register. Liefert die neue Zeile. */
export async function registerTrennen(d, v, x) {
  const von = await registerFuer(d, x, x.quelle), id = x.id + '~' + Math.random().toString(36).slice(2, 6);
  const z = zeileAus(Object.assign({}, x, { id: id }), { quelle: 'inhaber' }); z.aliase = []; verlauf(z, 'inhaber', 'Abgetrennt von „' + von.name + '“ als eigener Betrieb (' + v.nr + ')');
  const neu = await d.betriebSetzen(z);
  await eintragVerschieben(d, v, x, von, neu, 'Anfrage als anderer Betrieb abgetrennt');
  return neu;
}
/* Zuordnen: der Betrieb dieser Anfrage gehört zu einem bestehenden Eintrag (anderer Name, gleiche Firma) */
export async function registerZuordnen(d, v, x, zielId) {
  const ziel = await d.betriebHolen(zielId); if (!ziel) return null;
  const von = await registerFuer(d, x, x.quelle);
  await eintragVerschieben(d, v, x, von, ziel, 'Anfrage einem anderen Eintrag zugeordnet');
  return ziel;
}
/* Zusammenführen: Eintrag „mit“ geht im Eintrag „id“ auf (Aliase, Anfragen, Konten, Kontakt, Notiz), „mit“ wird gelöscht */
export async function registerZusammenfuehren(d, id, mitId) {
  const r = await d.betriebHolen(id), m = await d.betriebHolen(mitId);
  if (!r || !m || r.id === m.id) return null;
  const z = await d.betriebAendern(r.id, (z) => {
    z.aliase = Array.from(new Set((z.aliase || []).concat([m.id], m.aliase || []).filter((a) => a !== z.id)));
    const da = new Set((z.anfragen || []).map((a) => a.id)); z.anfragen = (z.anfragen || []).concat((m.anfragen || []).filter((a) => !da.has(a.id))).sort((a, b) => (a.zeit < b.zeit ? -1 : 1)).slice(-200); z.zaehler = zaehlen(z.anfragen);
    const konten = new Set((z.konten || []).concat(m.konten || [], m.konto ? [m.konto] : [])); if (z.konto) konten.delete(z.konto); if (!z.konto && m.konto) { z.konto = m.konto; konten.delete(m.konto); } z.konten = Array.from(konten).slice(0, 20);
    ['mail', 'tel', 'web', 'strasse', 'plz', 'ort'].forEach((f) => { if (!z[f] && m[f]) z[f] = m[f]; }); z.tel_norm = telNorm(z.tel); z.web_host = webHost(z.web);
    if (!(z.leistungen || []).length) z.leistungen = m.leistungen || [];
    if (m.notiz) z.notiz = (z.notiz ? z.notiz + '\n' : '') + m.notiz;
    if (m.stand === 'partner' && z.stand !== 'partner') { z.stand = 'partner'; z.partner = m.partner || { bereit: true }; }
    verlauf(z, 'inhaber', '„' + m.name + (m.ort ? ', ' + m.ort : '') + '“ hier zusammengeführt (' + (m.anfragen || []).length + ' Anfragen)');
  });
  await d.betriebLoeschen(m.id);
  return z;
}

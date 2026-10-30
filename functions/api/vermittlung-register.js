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
    tel_norm: telNorm(b.tel), web_host: webHost(b.web), leistungen: Array.isArray(b.leistungen) ? b.leistungen.slice(0, 10) : [], quelle: b.quelle || 'ki', stand: 'neu', partner: {}, konto: null,
    zaehler: {}, anfragen: [], aliase: [], notiz: '', verlauf: []
  }, extra || {});
}
const verlauf = (z, von, text) => { (z.verlauf = z.verlauf || []).push({ zeit: jetzt(), von: von, text: text }); if (z.verlauf.length > 200) z.verlauf = z.verlauf.slice(-200); };

/* Den Eintrag zu einem Betrieb finden (Kennung, Alias, Nummer, Website) oder anlegen; ein Treffer über Nummer oder Website bekommt die
   Kennung als Alias und, wo noch leer, die Angaben aus b */
export async function registerFuer(d, b, quelle) {
  let r = await d.betriebHolen(b.id);
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
  return { id: v.id, nr: v.nr, zeit: v.created_at, ort: (v.plz + ' ' + (k.ort || '')).trim(), gewaehlt: !!x.gewaehlt, status: x.status || 'offen', status_zeit: x.status_zeit || '',
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

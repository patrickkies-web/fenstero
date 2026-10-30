/* eeziframes · KI-Suche nach Fensterbetrieben in der Nähe eines Kunden (docs/VERMITTLUNG.md, Abschnitt 10)
   Gesucht werden bis zu 8 Handwerksbetriebe im Umkreis von etwa 30 km, die Fenster liefern UND einbauen (Fensterbauer, Tischlereien mit
   Fensterbau, Fenster- und Türenbetriebe); keine Portale, Shops, Baumärkte, Hersteller ohne Montage.
   Weg: Messages-API von Anthropic mit dem serverseitigen Werkzeug Websuche (web_search_20260209, dynamische Filterung; Stand Skill
   claude-api 2026-10, geprüft gegen platform.claude.com am 29.10.2026). Modell claude-opus-5-5 (Vorgabe des Skills, Variable
   VERMITTLUNG_MODELL zum Abweichen), Ort als user_location (DE, Europe/Berlin). Zwei Gangarten: Wartet ein Kunde (keine gespeicherte Suche
   im Umkreis, vermittlung.js), sucht sie knapp (Aufwand low, höchstens 4 Suchen, schneller); für den Vorrat ohne Kunden gründlich (Aufwand
   medium, höchstens 6 Suchen). Rückfall
   bei einer Ablehnung über fallbacks "default" (Beta server-side-fallback-2026-07-01). Kosten: 10 $ je 1.000 Suchen plus Tokens
   (Opus 5.5: 4 $ je Million Eingabe, 20 $ je Million Ausgabe; Suchergebnisse zählen als Eingabe), grob 0,15 bis 0,35 $ je Suche.
   Die Antwort ist JSON im Text; sie wird robust gelesen, Unsinn verworfen (ohne Namen, Ort, Telefon und Website, Portale, mehr als 60 km),
   nach km sortiert, und jeder Betrieb bekommt eine stabile Kennung aus Name und Ort. Die PLZ des Betriebs (falls in der Quelle) dient dazu,
   seine Entfernung für Kunden in Nachbarorten neu zu rechnen (vermittlung-ort.js).
   pause_turn (die Suche läuft länger als die Schleife des Servers): die bisherige Antwort unverändert zurückschicken, höchstens zweimal,
   alles innerhalb von ZEIT_MS. Zeitüberschreitung, Ablehnung oder Fehler: { ok: false } (die Route antwortet dann mit quelle 'keine').
   Attrappe (KI_ATTRAPPE=1, lokaler Testserver): feste Liste erfundener Betriebe, darunter Fensterbau Brandt (Beispiel des Inhabers).
   An die App gehen nur id, name, ort, km, leistungen (oeffentlich); Telefon, Website und Straße bleiben auf dem Server. */

export const MODELL = 'claude-opus-5-5';
export const WERKZEUG = 'web_search_20260209';
export const UMKREIS = 30;
export const MAX_BETRIEBE = 8;
export const SUCHEN_JE_ANFRAGE = 6, SUCHEN_SCHNELL = 4;
export const ZEIT_MS = 80000;
export const LEISTUNGEN = ['Kunststoff', 'Holz', 'Holz-Alu', 'Alu', 'Haustüren', 'Rollläden', 'Insektenschutz'];
const API = 'https://api.anthropic.com/v1/messages';
const MAX_KM = 60;
/* Portale, Shops und Baumärkte: aus der Suche ausgeschlossen (bare Domains) und als Website eines Betriebs verworfen */
export const GESPERRT = ['myhammer.de', 'check24.de', 'aroundhome.de', 'blauarbeit.de', 'obi.de', 'hornbach.de', 'bauhaus.info', 'toom.de', 'hagebau.de', 'amazon.de', 'ebay.de', 'kleinanzeigen.de'];
const VERZEICHNIS = /(^|\.)(myhammer|check24|aroundhome|blauarbeit|obi|hornbach|bauhaus|toom|hagebau|amazon|ebay|kleinanzeigen|gelbeseiten|dasoertliche|dastelefonbuch|11880|werliefertwas|wlw|houzz|yelp|golocal|meinestadt|cylex|firmenwissen|northdata|branchenbuch|google|bing|wikipedia|fensterversand|fenster24|fensterblick|fensterhandel)\./i;
const PORTAL_NAME = /\b(my ?hammer|check ?24|aroundhome|blauarbeit|gelbe ?seiten|das ?örtliche|11880|wer liefert was|baumarkt|obi|hornbach|bauhaus|toom|hagebau|online-?shop|portal|vergleich)\b/i;
const UNSINN = /^(n\/?a|unbekannt|keine angabe|beispiel|muster|test|null|undefined|-+|…|\.\.\.)\b/i;

export const sucheArt = (env) => (env && (env.KI_ATTRAPPE === '1' || env.ANTHROPIC_API_KEY === 'attrappe') ? 'attrappe' : env && env.ANTHROPIC_API_KEY ? 'ki' : '');

const text = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
/* Ort fürs Werkzeug und den Auftrag: nur Buchstaben, Leerzeichen, Bindestrich, Punkt (die Eingabe des Kunden wird nie Anweisung) */
export const ortText = (v) => text(v, 60).replace(/[^A-Za-zÄÖÜäöüßéèáàâêîôûëïçÉÈÁÀ .\-]/g, '').replace(/\s+/g, ' ').trim();

/* Stabile Kennung je Betrieb: kurzer Hash aus Name und Ort (klein, ohne Leerzeichen) */
export async function betriebId(name, ort) {
  const s = (String(name) + '|' + String(ort)).toLowerCase().replace(/\s+/g, ' ').trim();
  const d = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
  return 'b' + Array.from(d.slice(0, 6)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function telText(v) {
  const s = text(v, 40).replace(/[^\d+ /()\-]/g, '').trim(), n = s.replace(/\D/g, '').length;
  return n >= 6 && n <= 15 ? s : '';
}
export function webText(v) {
  let s = text(v, 200); if (!s) return '';
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s.replace(/^\/+/, '');
  try {
    const u = new URL(s);
    if (!/^https?:$/.test(u.protocol) || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname) || VERZEICHNIS.test(u.hostname + '.')) return '';
    return u.protocol + '//' + u.hostname.toLowerCase() + (u.pathname && u.pathname !== '/' ? u.pathname.slice(0, 80) : '/');
  } catch (e) { return ''; }
}
const LEISTUNG_MUSTER = [['Holz-Alu', /holz[\s-]*alu/i], ['Kunststoff', /kunststoff|pvc/i], ['Holz', /^holz$|holzfenster/i], ['Alu', /^alu(minium)?$|alufenster|aluminiumfenster/i], ['Haustüren', /haust(ü|ue)r/i], ['Rollläden', /roll(l)?(ä|ae)d|rollladen|rolladen/i], ['Insektenschutz', /insekt|fliegengitter/i]];
function leistungenAus(v) {
  const roh = Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[,;/]/) : [], set = new Set();
  roh.slice(0, 20).forEach((x) => { const s = text(x, 40); for (const [name, re] of LEISTUNG_MUSTER) if (re.test(s)) { set.add(name); break; } });
  return LEISTUNGEN.filter((l) => set.has(l));
}

/* Rohliste aus der KI (oder der Attrappe) prüfen: Unsinn verwerfen, Doppelte weg, nach km sortiert, höchstens MAX_BETRIEBE */
export async function pruefen(liste) {
  const out = [], ids = new Set();
  for (const e of (Array.isArray(liste) ? liste : []).slice(0, 40)) {
    if (!e || typeof e !== 'object') continue;
    const name = text(e.name, 80), ort = text(e.ort, 60), km = Math.round(Number(e.km));
    if (name.length < 3 || UNSINN.test(name) || PORTAL_NAME.test(name) || ort.length < 2 || UNSINN.test(ort)) continue;
    if (e.km === '' || e.km == null || !Number.isFinite(km) || km < 0 || km > MAX_KM) continue;
    const tel = telText(e.tel), web = webText(e.web || e.website);
    if (!tel && !web) continue;
    const id = await betriebId(name, ort); if (ids.has(id)) continue; ids.add(id);
    const plz = text(e.plz, 10);
    out.push({ id: id, name: name, ort: ort, plz: /^\d{5}$/.test(plz) ? plz : '', strasse: text(e.strasse, 80), tel: tel, web: web, km: km, leistungen: leistungenAus(e.leistungen) });
  }
  return out.sort((a, b) => a.km - b.km || a.name.localeCompare(b.name, 'de')).slice(0, MAX_BETRIEBE);
}
/* Was die App sieht: ohne Telefon, Website, Straße */
export const oeffentlich = (b) => Object.assign({ id: b.id, name: b.name, ort: b.ort, km: b.km, leistungen: (b.leistungen || []).slice() }, b.partner ? { partner: true } : {});

/* JSON aus dem Antworttext: zuerst ein Codeblock, dann das größte Objekt bzw. die größte Liste; { betriebe: [...] } oder [...] */
export function jsonAus(t) {
  const s = String(t || ''), kandidaten = [];
  const f = /```(?:json)?\s*([\s\S]*?)```/i.exec(s); if (f) kandidaten.push(f[1]);
  const a = s.indexOf('{'), b = s.lastIndexOf('}'); if (a >= 0 && b > a) kandidaten.push(s.slice(a, b + 1));
  const c = s.indexOf('['), d = s.lastIndexOf(']'); if (c >= 0 && d > c) kandidaten.push(s.slice(c, d + 1));
  for (const k of kandidaten) {
    try { const j = JSON.parse(k); if (Array.isArray(j)) return j; if (j && Array.isArray(j.betriebe)) return j.betriebe; } catch (e) { /* nächster */ }
  }
  return null;
}

const SYSTEM = [
  'Du recherchierst für eeziframes, eine Vermittlung zwischen Hauseigentümern und Fensterfachbetrieben in Deutschland.',
  'Gesucht sind Handwerksbetriebe, die neue Fenster liefern UND selbst einbauen: Fensterbauer, Tischlereien oder Schreinereien mit Fensterbau, Fenster- und Türenbetriebe, Glasereien mit Fenstermontage.',
  'Nicht gesucht: Vermittlungsportale und Branchenverzeichnisse (zum Beispiel MyHammer, Check24, Aroundhome, Gelbe Seiten, Das Örtliche, 11880), Online-Shops, Baumärkte, Hersteller ohne eigene Montage, reine Händler, Rollladen- oder Glasbetriebe ohne Fenstereinbau.',
  'Arbeitsweise: Suche mit der Websuche nach Betrieben im Umkreis von etwa ' + UMKREIS + ' km um den Ort des Kunden. Übernimm nur Angaben, die in den Suchergebnissen stehen (Name, Postleitzahl, Ort, Straße, Telefon, Website). Erfinde nichts; fehlt eine Angabe, lass das Feld leer. "km" ist die geschätzte Luftlinie vom Ort des Kunden in ganzen Kilometern.',
  '"leistungen" nur aus dieser Liste und nur, was der Betrieb laut Quelle anbietet: ' + LEISTUNGEN.join(', ') + '.',
  'Höchstens ' + MAX_BETRIEBE + ' Betriebe, die nächsten zuerst.',
  'Antworte am Ende ausschließlich mit JSON in dieser Form, ohne Text davor oder danach:',
  '{"betriebe":[{"name":"Tischlerei Beispiel","plz":"33378","ort":"Rheda-Wiedenbrück","strasse":"Hauptstraße 1","tel":"05242 12345","web":"https://www.beispiel.de","km":12,"leistungen":["Kunststoff","Holz"]}]}',
  'Findest du keinen passenden Betrieb: {"betriebe":[]}'
].join('\n');

/* Anfrage an die Messages-API (Felder nach Skill claude-api); schnell: Kunde wartet (Aufwand low, 4 Suchen), sonst gründlich (Vorrat) */
export function anfrage(plz, ort, modell, schnell) {
  const lage = Object.assign({ type: 'approximate', country: 'DE', timezone: 'Europe/Berlin' }, ort ? { city: ort } : {});
  return {
    model: modell || MODELL, max_tokens: 16000, system: SYSTEM,
    messages: [{ role: 'user', content: 'Postleitzahl ' + plz + (ort ? ', Ort ' + ort : '') + ' (Deutschland). Suche Fensterbetriebe im Umkreis von etwa ' + UMKREIS + ' km.' }],
    tools: [{ type: WERKZEUG, name: 'web_search', max_uses: schnell ? SUCHEN_SCHNELL : SUCHEN_JE_ANFRAGE, blocked_domains: GESPERRT, user_location: lage }],
    output_config: { effort: schnell ? 'low' : 'medium' },
    fallbacks: 'default'
  };
}
/* o: { key, modell, ms, schnell, fetch } (fetch nur für die Prüfung austauschbar) */
export async function kiSuche(o, plz, ort) {
  const holen = o.fetch || fetch, ende = Date.now() + (o.ms || ZEIT_MS), body = anfrage(plz, ort, o.modell, !!o.schnell);
  const info = { suchen: 0, eingabe: 0, ausgabe: 0, runden: 0 };
  let bloecke = [], letzte = null;
  for (let runde = 0; runde < 3; runde++) {
    const rest = ende - Date.now(); if (rest <= 0) return { ok: false, grund: 'zeit', info: info };
    const ab = new AbortController(), uhr = setTimeout(() => ab.abort(), rest);
    const nachricht = runde ? Object.assign({}, body, { messages: body.messages.concat([{ role: 'assistant', content: bloecke }]) }) : body;
    let r, j = null;
    try {
      r = await holen(API, { method: 'POST', signal: ab.signal, headers: { 'x-api-key': o.key, 'anthropic-version': '2026-10-21', 'anthropic-beta': 'server-side-fallback-2026-07-01', 'content-type': 'application/json' }, body: JSON.stringify(nachricht) });
      j = await r.json().catch(() => null);
    } catch (e) { clearTimeout(uhr); return { ok: false, grund: ab.signal.aborted ? 'zeit' : 'netz', info: info }; }
    clearTimeout(uhr);
    if (!r.ok || !j) { console.log('Vermittlung: KI-Suche abgelehnt', r.status, String((j && j.error && j.error.type) || '').slice(0, 60)); return { ok: false, grund: 'api', info: info }; }
    const u = j.usage || {}; info.runden++; info.suchen += Number((u.server_tool_use || {}).web_search_requests) || 0; info.eingabe += Number(u.input_tokens) || 0; info.ausgabe += Number(u.output_tokens) || 0;
    if (j.stop_reason === 'refusal') return { ok: false, grund: 'abgelehnt', info: info };
    bloecke = bloecke.concat(Array.isArray(j.content) ? j.content : []); letzte = j;
    if (j.stop_reason !== 'pause_turn') break;
  }
  if (!letzte || letzte.stop_reason === 'pause_turn') return { ok: false, grund: 'pause', info: info };
  const textAus = (l) => l.filter((x) => x && x.type === 'text').map((x) => x.text || '').join('');
  const roh = jsonAus(textAus(letzte.content || [])) || jsonAus(textAus(bloecke));
  if (!roh) { console.log('Vermittlung: KI-Antwort ohne lesbares JSON', letzte.stop_reason); return { ok: false, grund: 'json', info: info }; }
  return { ok: true, quelle: 'ki', betriebe: await pruefen(roh), info: info };
}

/* Attrappe: erfundene Betriebe (keine Namen der Testbetriebe Amsel, Fink, Specht, Meise); Adressen und Nummern sind ausgedacht */
const ATTRAPPE = [
  { name: 'Fensterbau Brandt', ort: 'Herzebrock-Clarholz', strasse: 'Werkstattweg 7', tel: '05245 555010', web: 'https://fensterbau-brandt.example/', km: 3, leistungen: ['Kunststoff', 'Holz', 'Holz-Alu', 'Haustüren', 'Rollläden'] },
  { name: 'Tischlerei Lindholz', ort: 'Rheda-Wiedenbrück', strasse: 'Am Sägewerk 3', tel: '05242 555020', web: 'https://tischlerei-lindholz.example/', km: 8, leistungen: ['Holz', 'Holz-Alu', 'Haustüren'] },
  { name: 'Fensterwerk Emsblick', ort: 'Warendorf', strasse: 'Uferstraße 21', tel: '02581 555030', web: 'https://fensterwerk-emsblick.example/', km: 22, leistungen: ['Kunststoff', 'Alu', 'Rollläden', 'Insektenschutz'] },
  { name: 'Glas und Rahmen Nolte', ort: 'Gütersloh', strasse: 'Glaserweg 5', tel: '05241 555040', web: 'https://glas-rahmen-nolte.example/', km: 14, leistungen: ['Kunststoff', 'Holz'] },
  { name: 'Holzfenster Ebbinghaus', ort: 'Oelde', strasse: 'Lindenhof 2', tel: '02522 555050', web: 'https://holzfenster-ebbinghaus.example/', km: 13, leistungen: ['Holz', 'Holz-Alu'] },
  { name: 'Fenster und Türen Haverkamp', ort: 'Harsewinkel', strasse: 'Industriestraße 40', tel: '05247 555060', web: 'https://haverkamp-fenster.example/', km: 15, leistungen: ['Kunststoff', 'Alu', 'Haustüren', 'Insektenschutz'] },
  { name: 'Schreinerei Sörensen', ort: 'Beckum', strasse: 'Mühlenweg 11', tel: '02521 555070', web: '', km: 20, leistungen: ['Holz', 'Haustüren'] },
  { name: 'Kessler Fenstertechnik', ort: 'Bielefeld', strasse: 'Kalscheurer Weg 9', tel: '0521 5550808', web: 'https://kessler-fenstertechnik.example/', km: 27, leistungen: ['Kunststoff', 'Holz-Alu', 'Rollläden'] }
];
/* .example ist eine reservierte Domain; webText lässt sie als Website durch, damit die Zentrale einen Link zeigt */
export const attrappeBetriebe = () => pruefen(ATTRAPPE);

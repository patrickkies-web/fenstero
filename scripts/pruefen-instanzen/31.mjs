// eeziframes · Prüfabschnitt 31: Vermittlung „Angebote aus deiner Nähe“, Stufe 1 (docs/VERMITTLUNG.md, Abschnitt 10)
// Server functions/api/vermittlung.js (mit vermittlung-suche.js, -sms.js, -daten.js, -mails.js) und die Zentrale (web/assets/inhaber.js)
// mit den Attrappen des Instanz-Testservers (Daten, Mail, KI; SMS über DATEN_ATTRAPPE: Code 123456).
// Teil A über die API (Kopfzeile Host, je Anfrage ein eigener Anschluss, damit die Bremsen nur dort greifen, wo sie geprüft werden):
//   31.1 Stand in /api/status, nicht auf dem Host einer Instanz · 31.2 Suche (Attrappe, Zwischenspeicher, sofort aus der Umgebung, nur
//   öffentliche Felder, Bremse, Tagesbudget mit Alarm, ohne Schlüssel „keine“, Tabelle der Postleitzahlen, Vorrat), KI-Suche im Prozess gegen ein nachgestelltes fetch (Anfrage nach Skill claude-api,
//   pause_turn, Zeitlimit, Ablehnung, Unsinn verwerfen) · 31.3 Code (Attrappe, falsche Nummern, Festnetz per Anruf, Grenze je Nummer, Bremse
//   je Anschluss, ohne Anbieter „ohneCode“) · 31.4 Senden (alle Ablehnungen, Code, abgelaufenes Token, Fehlversuche, Mails an den Inhaber mit
//   PDF und an den Kunden mit, Freischaltung, Doppelklick, zwei Anfragen in 90 Tagen, ohne Code „nicht bestätigt“) · 31.5 Zentrale (nur angemeldet, Liste,
//   Detail mit Telefon und Website, PDF, Ergebnis der Anrufe, Betrieb neu, Zugang nur mit Zustimmung, höchstens fünf und nur die gewählten, Mail ohne
//   Kontaktdaten und ohne Anhang) · 31.7 Bereich für Fensterbauer und Register (Abschnitt 13: Vorschau über den Link, Konto per Code, Annehmen,
//   erstes Aufmaß kostenlos, zweites über die Kasse, Mail an den Kunden, Partner vorn in der Suche, Lexikon der Zentrale, Nachricht an den Kunden,
//   Rechtsseite Partnerbedingungen) · K Bereich für Fensterbauer im Browser (Zugang, Code, Freischalten, PDF, Partner; „Anmelden“ auf der
//   Seite für Fensterbauer) · 31.6 Tageslauf (nach 180 Tagen weg, mit dem Aufmaßblatt) · 31.8 Gefahrenbereich (alles der Vermittlung löschen).
// Teil B im Browser (Telefon 390 px und Schreibtisch): Zentrale mit Umschalter, Liste, Anfrage, Anruf-Knopf, „Will“, Senden nur mit Häkchen;
//   genau eine volle Pille, Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen, keine Konsolenfehler.
// Teil C (App, Folien weg, betriebe, vcode, angefragt): ergänzt die Sitzung, die die App baut; Platz unten am Ende markiert.
import path from 'node:path';
import fs from 'node:fs';
import net from 'node:net';
import { testserver } from './hilfe.mjs';

export const titel = 'Vermittlung: Suche, Code, Anfrage, Zentrale';
/* freier Port für den Server ohne Datenbank (h.server legt Instanzen an und braucht die Daten-Attrappe) */
const freierPort = () => new Promise((ja, nein) => { const s = net.createServer(); s.unref(); s.on('error', nein); s.listen(0, () => { const p = s.address().port; s.close(() => ja(p)); }); });
const PDF = Buffer.concat([Buffer.from('%PDF-1.4\n% eeziframes Prüfblatt der Vermittlung\n'), Buffer.alloc(4000, 0x20), Buffer.from('\n%%EOF\n')]);
const AUFMASS = 'AM1.' + Buffer.from(JSON.stringify({ v: 1, b: '', p: { gebaeude: 'efh' }, w: [{ id: 'w1', b: 1230, h: 1410 }], t: 1793000000000 })).toString('base64url');

export default async function (h) {
  const { ok } = h, stempel = Date.now().toString(36);
  let anschluss = 0;
  const neueIp = () => '10.31.' + (Math.floor(++anschluss / 200) % 250) + '.' + (anschluss % 200 + 1);
  const post = (pfad, body, x, srv) => (srv || h).api('localhost', pfad, { body: body, origin: true, headers: { 'x-forwarded-for': x || neueIp() } });
  const ids = async (srv) => new Set(((await (srv || h).post()) || []).map((m) => m.id));
  const neueMails = async (vor, srv) => ((await (srv || h).post({ anhaenge: true })) || []).filter((m) => !vor.has(m.id));
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const keks = (r) => (r.cookies || []).map((c) => c.split(';')[0]).find((c) => /^__Host-inhaber=./.test(c)) || '';
  const S = await import(path.join(h.WURZEL, 'functions/api/vermittlung-suche.js'));
  const { ANBIETER } = await import(path.join(h.WURZEL, 'functions/api/anbieter.js'));
  /* PLZ weit weg von 33442 (nimmt der App-Teil 31-app.mjs, der vorher läuft), damit die erste Suche neu ist und nicht aus der Umgebung kommt */
  const PLZ = '79098', PLZ_NAH = '79104', PLZ_FERN = '80331';
  const O = await import(path.join(h.WURZEL, 'functions/api/vermittlung-ort.js'));
  /* Stimme des Anrufs: „female“ oder „male“ allein (so im Cloudflare-Dashboard leicht eingetragen) wird zur deutschen Stimme, Unbekanntes zur Vorgabe */
  const SMS = await import(path.join(h.WURZEL, 'functions/api/vermittlung-sms.js'));
  const RECHT7 = await import(path.join(h.WURZEL, 'functions/api/recht.js'));
  const stimmen = ['female', 'Male', 'de-de-female', 'en-gb-male', '', 'weiblich'].map(SMS.stimmeName).join();
  ok(stimmen === 'de-de-female,de-de-male,de-de-female,en-gb-male,de-de-female,de-de-female' && /^<voice name="de-de-female">/.test(SMS.ansage('123456', 'female')), '31.0 Stimme des Anrufs: „female“ allein wird „de-de-female“, ungültige Werte die Vorgabe (' + stimmen + ')');

  /* ---------- 31.1 Stand ---------- */
  const st = await h.api('localhost', '/api/status'), vs = (st.json || {}).vermittlung || {};
  const fremd = await h.api('essential.localhost', '/api/vermittlung/suche', { body: { plz: PLZ }, origin: true });
  ok(vs.an === true && vs.suche === 'attrappe' && vs.sms === 'attrappe' && fremd.status === 404, '31.1 /api/status: vermittlung { an, suche: attrappe, sms: attrappe }; auf dem Host einer Instanz gibt es die Vermittlung nicht (' + fremd.status + ')');

  /* ---------- 31.2 Suche ---------- */
  const s0 = await post('/api/vermittlung/suche', { plz: '1234' }), sUnbekannt = await post('/api/vermittlung/suche', { plz: '05999' });
  const s1 = await post('/api/vermittlung/suche', { plz: PLZ });
  const s2 = await post('/api/vermittlung/suche', { plz: PLZ });
  const b1 = (s1.json || {}).betriebe || [], namen = b1.map((b) => b.name);
  ok(s0.status === 400 && s0.json.feld === 'plz' && sUnbekannt.status === 400 && sUnbekannt.json.feld === 'plz' && /kennen wir nicht/.test(sUnbekannt.json.fehler) && s1.status === 200 && s1.json.quelle === 'attrappe' && s1.json.umkreis === 30 && s1.json.ort === 'Freiburg im Breisgau' && s1.json.plz === PLZ && b1.length === 8 && namen[0] === 'Fensterbau Brandt' && b1.every((b, i) => i === 0 || b1[i - 1].km <= b.km) && !namen.some((n) => /Amsel|Fink|Specht|Meise/.test(n)),
    '31.2 Suche: nur die PLZ, fünfstellig und bekannt (sonst 400, ohne KI-Suche), Ort aus der Tabelle, Attrappe mit 8 erfundenen Betrieben nach km, Fensterbau Brandt vorn, keine Testbetriebe der Instanzen (' + namen.slice(0, 3).join(', ') + ' …)');
  const nurOeffentlich = (r) => (r.json.betriebe || []).every((b) => /^id,km,leistungen,name,ort(,partner)?$/.test(Object.keys(b).sort().join()) && /^b[0-9a-f]{12}$/.test(b.id)) && !/"(tel|web|strasse)"|https?:|\.example|5550101/.test(r.text);
  ok(s2.json.quelle === 'zwischenspeicher' && JSON.stringify(s2.json.betriebe) === JSON.stringify(s1.json.betriebe) && nurOeffentlich(s1) && nurOeffentlich(s2) && b1.every((b) => b.leistungen.every((l) => S.LEISTUNGEN.includes(l))),
    '31.2 Zweite Suche derselben PLZ aus dem Zwischenspeicher, gleiche Kennungen; an die App gehen nur id, name, ort, km, leistungen (kein Telefon, keine Website, keine Straße)');
  /* sofort aus der Umgebung: eine Nachbar-PLZ ohne eigene Suche nimmt die gespeicherten Suchen im Umkreis von 25 km, ohne neue KI-Suche */
  const t1 = Date.now(), sn = await post('/api/vermittlung/suche', { plz: PLZ_NAH }), dn = Date.now() - t1, bn = (sn.json || {}).betriebe || [];
  const abstand = O.km(O.plzInfo(PLZ), O.plzInfo(PLZ_NAH)), brandtNah = bn.find((b) => b.name === 'Fensterbau Brandt') || {};
  ok(sn.json.quelle === 'umgebung' && bn.length >= 5 && bn.every((b) => b.km <= 30) && bn.every((b, i) => i === 0 || bn[i - 1].km <= b.km) && brandtNah.km === Math.round(abstand + 3) && nurOeffentlich(sn) && dn < 1500,
    '31.2 Nachbar-PLZ ' + PLZ_NAH + ' sofort aus der Umgebung (' + dn + ' ms, ' + bn.length + ' Betriebe): ohne Lage des Betriebs höchstens Abstand der PLZ (' + abstand.toFixed(1) + ' km) plus Schätzung, nur bis 30 km');
  /* mit Lage: Betriebe rund um 33442 (App-Teil) für 33378 Rheda-Wiedenbrück aus ihrem Ort neu gerechnet */
  await post('/api/vermittlung/suche', { plz: '33442' });
  const sr = await post('/api/vermittlung/suche', { plz: '33378' }), br = (sr.json || {}).betriebe || [], lindR = br.find((b) => b.name === 'Tischlerei Lindholz') || {}, brandtR = br.find((b) => b.name === 'Fensterbau Brandt') || {};
  const erwartet = Math.round(O.km(O.plzInfo('33378'), O.betriebLage({ ort: 'Herzebrock-Clarholz' }, O.plzInfo('33378'))));
  ok(sr.json.quelle === 'umgebung' && sr.json.ort === 'Rheda-Wiedenbrück' && br[0] && br[0].name === 'Tischlerei Lindholz' && lindR.km === 0 && brandtR.km === erwartet && erwartet >= 5 && br.every((b) => b.km <= 30),
    '31.2 Entfernung aus dem Ort des Betriebs neu gerechnet: für 33378 steht Tischlerei Lindholz (Rheda-Wiedenbrück, 0 km) vorn, Fensterbau Brandt ' + brandtR.km + ' km statt 3 km (' + br.map((b) => b.name.split(' ').pop() + ' ' + b.km).join(', ') + ')');
  const tab = [O.plzInfo('96076'), O.plzInfo('10875'), O.plzInfo('33442'), O.vorratPlz()];
  ok(tab[0] === null && tab[1] && tab[1].ort === 'Berlin' && tab[2].ort === 'Herzebrock-Clarholz' && tab[3].length > 400 && tab[3].every((p) => { const i = O.plzInfo(p); return i && !/GmbH|AG\b|Bank|Versicherung|GEMA/.test(i.ort); }) && O.umkreisPlz('33442', 25)[0] === '33442',
    '31.2 Tabelle der Postleitzahlen (GeoNames): Großkunden-PLZ ohne Ort draußen oder mit dem Ort der Nachbarn („GEMA Geschäftsstelle“, „DaimlerChrysler …“ nicht), ' + tab[3].length + ' Stützpunkte des Vorrats');
  const bremsIp = neueIp(), brems = [];
  for (let i = 0; i < 12; i++) brems.push((await post('/api/vermittlung/suche', { plz: PLZ }, bremsIp)).status);
  ok(brems.slice(0, 10).every((s) => s === 200) && brems.slice(10).every((s) => s === 429), '31.2 Bremse je Anschluss: zehn Suchen in der Minute, danach 429 (' + brems.join(' ') + ')');

  /* KI-Suche im Prozess (vermittlung-suche.js) gegen ein nachgestelltes fetch: Anfrage nach Skill claude-api, pause_turn, Prüfung der Antwort */
  const ROH = [
    { name: 'MyHammer Fensterbauer Köln', ort: 'Köln', tel: '0221 1234567', web: 'https://www.myhammer.de/x', km: 3, leistungen: ['Kunststoff'] },
    { name: 'Tischlerei Prüfholz', plz: '33330', ort: 'Gütersloh', strasse: 'Holzweg 4', tel: '05241 998877', web: 'www.pruefholz.de', km: '12.4', leistungen: ['Holzfenster', 'Aluminium', 'Haustür', 'Rolladen', 'Quatsch'] },
    { name: 'Fenster Weit', ort: 'Hamburg', tel: '040 7364528', km: 280 },
    { name: 'Ohne Kontakt GmbH', ort: 'Rheda', km: 5 },
    { name: 'Tischlerei Prüfholz', ort: 'Gütersloh', tel: '05241 998877', km: 12 },
    { name: 'Glaserei Nah', plz: '5930', ort: 'Oelde', tel: '02522 4433', web: 'https://www.gelbeseiten.de/glaserei-nah', km: 7, leistungen: 'Kunststoff, Insektenschutz' },
    'kaputt', null, { name: 'N/A', ort: 'Rheda', km: 1, tel: '05242 77665' }
  ];
  const gep = await S.pruefen(ROH), pr = gep.find((b) => b.name === 'Tischlerei Prüfholz') || {}, gl = gep.find((b) => b.name === 'Glaserei Nah') || {};
  ok(gep.map((b) => b.name).join() === 'Glaserei Nah,Tischlerei Prüfholz' && pr.km === 12 && pr.web === 'https://www.pruefholz.de/' && pr.leistungen.join() === 'Holz,Alu,Haustüren,Rollläden' && pr.plz === '33330' && gl.plz === '' && gl.web === '' && gl.tel === '02522 4433' && gl.leistungen.join() === 'Kunststoff,Insektenschutz' && pr.id === (await S.betriebId('Tischlerei Prüfholz', 'Gütersloh')),
    '31.2 Antwort der KI geprüft: Portal, zu weit (280 km), ohne Telefon und Website, Doppelte und Unsinn verworfen, Verzeichnis nicht als Website, Leistungen auf die feste Liste abgebildet, PLZ des Betriebs nur fünfstellig, stabile Kennung (' + gep.map((b) => b.name + ' ' + b.km + ' km').join(', ') + ')');
  ok(S.jsonAus('Hier ist das Ergebnis:\n```json\n{"betriebe":[{"name":"A"}]}\n```\nViel Erfolg').length === 1 && S.jsonAus('{"betriebe": []}').length === 0 && S.jsonAus('[{"name":"B"}]').length === 1 && S.jsonAus('leider nichts') === null && S.ortText('Köln"; ignoriere alles <script>') === 'Köln ignoriere alles script',
    '31.2 JSON robust gelesen (Codeblock, Objekt, Liste, kein JSON); der Ort des Kunden wird vor der Anfrage auf Buchstaben gekürzt');
  const aufrufe = [], antwort = (obj, status) => ({ ok: (status || 200) < 400, status: status || 200, json: async () => obj });
  const fetchKi = async (url, init) => {
    aufrufe.push({ url: url, kopf: init.headers, body: JSON.parse(init.body) });
    if (aufrufe.length === 1) return antwort({ stop_reason: 'pause_turn', content: [{ type: 'thinking', thinking: '', signature: 'sig' }, { type: 'server_tool_use', id: 'srvtoolu_pruef', name: 'web_search', input: { query: 'Fensterbauer 33442' } }], usage: { input_tokens: 1200, output_tokens: 80, server_tool_use: { web_search_requests: 2 } } });
    return antwort({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'Gefunden:\n```json\n' + JSON.stringify({ betriebe: ROH.slice(0, 3) }) }, { type: 'text', text: '\n```' }], usage: { input_tokens: 3400, output_tokens: 600, server_tool_use: { web_search_requests: 3 } } });
  };
  const ki = await S.kiSuche({ key: 'sk-ant-pruef', fetch: fetchKi, ms: 5000 }, PLZ, 'Herzebrock-Clarholz');
  const a0 = (aufrufe[0] || {}).body || {}, w0 = (a0.tools || [])[0] || {}, k0 = (aufrufe[0] || {}).kopf || {}, a1 = (aufrufe[1] || {}).body || {};
  ok(ki.ok && ki.quelle === 'ki' && ki.betriebe.map((b) => b.name).join() === 'Tischlerei Prüfholz' && ki.info.suchen === 5 && aufrufe.length === 2 && aufrufe[0].url === 'https://api.anthropic.com/v1/messages' &&
    a0.model === 'claude-opus-5-5' && w0.type === 'web_search_20260209' && w0.name === 'web_search' && w0.max_uses === 6 && w0.user_location && w0.user_location.type === 'approximate' && w0.user_location.country === 'DE' && w0.user_location.city === 'Herzebrock-Clarholz' && w0.user_location.timezone === 'Europe/Berlin' &&
    (w0.blocked_domains || []).includes('myhammer.de') && a0.fallbacks === 'default' && k0['anthropic-beta'] === 'server-side-fallback-2026-07-01' && k0['x-api-key'] === 'sk-ant-pruef' && k0['anthropic-version'] === '2026-10-21' && a0.output_config && a0.output_config.effort === 'medium' && !('temperature' in a0) && !('thinking' in a0) && a0.max_tokens === 16000 &&
    (a1.messages || []).length === 2 && a1.messages[1].role === 'assistant' && a1.messages[1].content.length === 2 && a1.messages[1].content[1].id === 'srvtoolu_pruef',
    '31.2 KI-Suche: claude-opus-5-5 mit web_search_20260209 (max_uses 6, user_location DE, Portale gesperrt), Aufwand medium, fallbacks "default"; pause_turn schickt die Antwort unverändert zurück; nur Geprüftes kommt an (' + ki.betriebe.length + ' Betrieb, ' + ki.info.suchen + ' Suchen)');
  const schnell = S.anfrage('33442', 'Herzebrock-Clarholz', null, true), sw = schnell.tools[0];
  ok(sw.max_uses === 4 && schnell.output_config.effort === 'low' && schnell.model === 'claude-opus-5-5' && /"plz":"33378"/.test(schnell.system),
    '31.2 Wartet ein Kunde, sucht die KI knapp (Aufwand low, höchstens 4 Suchen); sie liefert die PLZ jedes Betriebs mit');
  const haengt = (url, init) => new Promise((ja, nein) => init.signal.addEventListener('abort', () => nein(Object.assign(new Error('abgebrochen'), { name: 'AbortError' }))));
  const t0 = Date.now(), zeit = await S.kiSuche({ key: 'k', fetch: haengt, ms: 300 }, PLZ, ''), dauer = Date.now() - t0;
  const abgelehnt = await S.kiSuche({ key: 'k', fetch: async () => antwort({ stop_reason: 'refusal', content: [], usage: {} }), ms: 2000 }, PLZ, '');
  const fehler = await S.kiSuche({ key: 'k', fetch: async () => antwort({ type: 'error', error: { type: 'overloaded_error' } }, 529), ms: 2000 }, PLZ, '');
  const ohneJson = await S.kiSuche({ key: 'k', fetch: async () => antwort({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'Ich habe leider nichts gefunden.' }], usage: {} }), ms: 2000 }, PLZ, '');
  ok(!zeit.ok && zeit.grund === 'zeit' && dauer < 2000 && !abgelehnt.ok && abgelehnt.grund === 'abgelehnt' && !fehler.ok && !ohneJson.ok && ohneJson.grund === 'json' && S.sucheArt({}) === '' && S.sucheArt({ ANTHROPIC_API_KEY: 'sk-ant-x' }) === 'ki' && S.sucheArt({ KI_ATTRAPPE: '1' }) === 'attrappe',
    '31.2 KI-Suche: Zeitlimit bricht ab (' + dauer + ' ms), Ablehnung, Überlastung und Antwort ohne JSON enden ohne Betriebe (die Route sagt dann quelle „keine“); ohne Schlüssel keine Suche');

  /* zweiter Server: Tagesbudget 2 mit Alarm bei 80 %, ohne SMS-Anbieter (Weg ohne Code) */
  const s3 = await h.server({ VERMITTLUNG_SUCHE_TAG_MAX: '2', SMS_ATTRAPPE: '0' });
  const vor3 = await ids(s3), bud = [];
  for (const p of ['50667', '80331', '20095']) bud.push((await post('/api/vermittlung/suche', { plz: p }, null, s3)).json);
  await warte(300);
  const alarm = (await neueMails(vor3, s3)).find((m) => /80 %/.test(m.betreff) && /Vermittlung/.test(m.betreff));
  ok(bud[0].quelle === 'attrappe' && bud[1].quelle === 'attrappe' && bud[2].quelle === 'keine' && bud[2].grenze === 'tag' && bud[2].betriebe.length === 0 && !!alarm && /VERMITTLUNG_SUCHE_TAG_MAX/.test(alarm.html),
    '31.2 Tagesbudget VERMITTLUNG_SUCHE_TAG_MAX: darüber quelle „keine“ (die App macht mit „Betrieb für mich suchen“ weiter), Mail an den Inhaber bei 80 %');
  /* Vorrat: alle 10 Minuten eine gründliche Suche für den nächsten Stützpunkt, höchstens VERMITTLUNG_VORRAT am Tag; ohne die Variable aus */
  const s5 = await h.server({ VERMITTLUNG_VORRAT: '2' }), vrl = [];
  for (let i = 0; i < 3; i++) vrl.push(((await s5.geplant('*/10 * * * *')) || {}).vorrat || {});
  const stz = O.vorratPlz(), nahVorrat = O.umkreisPlz(stz[0], 25).find((x) => x !== stz[0]);
  const tv = Date.now(), sv = (await post('/api/vermittlung/suche', { plz: nahVorrat }, null, s5)).json || {}, dv = Date.now() - tv;
  const vorratAus = ((await s3.geplant('*/10 * * * *')) || {}).vorrat || {};
  ok(vrl[0].plz === stz[0] && vrl[0].betriebe === 8 && vrl[1].plz === stz[1] && vrl[2].grenze === 2 && !vrl[2].plz && sv.quelle === 'umgebung' && (sv.betriebe || []).length >= 3 && vorratAus.aus === true,
    '31.2 Vorrat: je Lauf ein Stützpunkt (' + vrl.map((v) => v.plz || 'Grenze').join(', ') + '), am Tag höchstens VERMITTLUNG_VORRAT; ein Kunde nebenan (' + nahVorrat + ') findet sofort ' + (sv.betriebe || []).length + ' Betriebe (' + dv + ' ms); ohne Variable aus');
  /* dritter Server: ohne Datenbank, ohne Schlüssel, ohne SMS */
  const s4 = await testserver({ DATEN_ATTRAPPE: '0', KI_ATTRAPPE: '', ANTHROPIC_API_KEY: '', SMS_ATTRAPPE: '', SMS_API_KEY: '' }, freierPort);
  const st4 = (await s4.api('localhost', '/api/status')).json.vermittlung || {};
  const su4 = (await post('/api/vermittlung/suche', { plz: PLZ }, null, s4)).json || {};
  const co4 = (await post('/api/vermittlung/code', { tel: '0171 2894563' }, null, s4)).json || {};
  const se4 = await post('/api/vermittlung/senden', { plz: PLZ }, null, s4);
  ok(st4.an === false && st4.suche === '' && st4.sms === '' && su4.ok && su4.quelle === 'keine' && su4.betriebe.length === 0 && co4.ok && co4.ohneCode === true && !co4.token && se4.status === 503,
    '31.2/31.3 Ohne Schlüssel und Attrappe: Suche { betriebe: [], quelle: „keine“ }, Code { ohneCode: true }, ohne Datenbank kein Senden (503)');
  s4.stop();

  /* ---------- 31.3 Code ---------- */
  const TEL = '0171 2894563', TEL2 = '0160 9182736', FEST = '05241 739821';
  const falsch = [];
  for (const t of ['0123456789', '1111111', '0234567890', '0987654321', '+44 20 7946 0958', '0800 7364521', '0171 111 1111', 'abc', '']) falsch.push((await post('/api/vermittlung/code', { tel: t })).json || {});
  const c1 = (await post('/api/vermittlung/code', { tel: TEL })).json || {}, c2 = (await post('/api/vermittlung/code', { tel: '+49 (0)172 395 8461' })).json || {}, cf = (await post('/api/vermittlung/code', { tel: FEST })).json || {};
  ok(falsch.every((r) => r.ok === false && r.feld === 'tel') && c1.ok && c1.kanal === 'sms' && c1.an === '0171 ••• 4563' && c1.attrappe === true && typeof c1.token === 'string' && c1.token.length > 40 && c2.an === '0172 ••• 8461' && c2.kanal === 'sms' && cf.kanal === 'anruf' && cf.an === '0524 ••• 9821',
    '31.3 Code: Unsinn, Ausland und Sondernummern abgelehnt (feld tel); Handy per SMS, Festnetz per Anruf, +49 und (0) normalisiert, Nummer maskiert („0171 ••• 4563“), Attrappe');
  const grenze = []; for (let i = 0; i < 4; i++) grenze.push((await post('/api/vermittlung/code', { tel: TEL2 })).status);
  const otpIp = neueIp(), otp = [];
  for (const t of ['0151 2938475', '0152 3948576', '0157 4958672', '0162 5968371', '0163 6978254', '0170 7984632']) otp.push((await post('/api/vermittlung/code', { tel: t }, otpIp)).status);
  ok(grenze.join() === '200,200,200,429' && otp.slice(0, 5).every((s) => s === 200) && otp[5] === 429, '31.3 Höchstens drei Codes je Nummer und Tag (' + grenze.join(' ') + '), Bremse je Anschluss (' + otp.join(' ') + ')');

  /* ---------- 31.4 Senden ---------- */
  const bid = b1.map((b) => b.id), MAIL = 'erika-' + stempel + '@pruef-kunde.de';
  const code = async (tel) => ((await post('/api/vermittlung/code', { tel: tel })).json || {}).token;
  const anfrage = (o) => Object.assign({ kontakt: { name: 'Erika Prüfmann', ort: PLZ + ' Herzebrock-Clarholz', tel: TEL, mail: MAIL, erreich: ['vm', 'ab'] }, plz: PLZ, betriebe: bid.slice(0, 2), token: c1.token, code: '123456',
    einwilligung: { fassung: '2026-10-29', text: 'Ich möchte, dass Fensterbau Brandt und Tischlerei Lindholz mein Aufmaß und meine Kontaktdaten bekommen und mich für ein Angebot kontaktieren.' },
    aufmass: AUFMASS, eckdaten: { fenster: 4, elemente: 5, gebaeude: 'efh', baujahr: '1978', zeit: '3m', budget: 'b2', foerdweg: 'bafa' }, pdf: PDF.toString('base64'), kennung: 'pPruef' + stempel }, o || {});
  const mit = (k, v) => { const a = anfrage(); a.kontakt = Object.assign({}, a.kontakt, { [k]: v }); return a; };
  const faelle = [['kontakt.name', mit('name', 'A')], ['plz', anfrage({ plz: '1234' })], ['kontakt.tel', mit('tel', 'kaputt')], ['kontakt.mail', mit('mail', 'kaputt')], ['einwilligung', anfrage({ einwilligung: { fassung: '2026-10-29' } })],
    ['aufmass', anfrage({ aufmass: '' })], ['betriebe', anfrage({ betriebe: bid.slice(0, 6) })], ['betriebe', anfrage({ betriebe: bid.slice(0, 1) })], ['pdf', anfrage({ pdf: Buffer.from('Hallo, kein PDF').toString('base64') })], ['pdf', anfrage({ pdf: '' })]];
  const abl = [];
  for (const [feld, body] of faelle) { const r = await post('/api/vermittlung/senden', body); abl.push(r.status === 400 && !!(r.json.felder || {})[feld] && r.json.feld === feld.replace(/^kontakt\./, '') ? 'ok' : feld + ':' + r.status); }
  ok(abl.every((x) => x === 'ok'), '31.4 Senden: Name ab 2 Zeichen, PLZ, Telefon, E-Mail (falls angegeben), Einwilligung mit Fassung und Text, Aufmaß, zwei bis fünf Betriebe, PDF mit %PDF-Kopf; je Fehler das Feld in felder und feld (wie die App es liest: tel, name, mail …) (' + abl.filter((x) => x !== 'ok').join(' ') + ')');
  const gross = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(10200000, 0x20)]), zuGross = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(11200000, 0x20)]);
  const g1 = await post('/api/vermittlung/senden', anfrage({ pdf: gross.toString('base64') })), g2 = await post('/api/vermittlung/senden', anfrage({ pdf: zuGross.toString('base64') }));
  ok(g1.status === 400 && !!(g1.json.felder || {}).pdf && /10 MB/.test(g1.json.fehler) && g2.status === 413, '31.4 Aufmaßblatt über 10 MB: 400 am Feld pdf; über dem Grenzwert des Pfads 413 (' + g1.status + ', ' + g2.status + ')');
  const unbekannt = await post('/api/vermittlung/senden', anfrage({ betriebe: ['b000000000000'] })), anderePlz = await post('/api/vermittlung/senden', anfrage({ plz: PLZ_FERN }));
  ok(unbekannt.status === 409 && unbekannt.json.neuSuchen === true && anderePlz.status === 409, '31.4 Nur Betriebe aus den Suchen im Umkreis dieser PLZ (unbekannt oder PLZ weit weg: 409 neuSuchen)');
  const ohneToken = await post('/api/vermittlung/senden', anfrage({ token: '' })), falscherCode = await post('/api/vermittlung/senden', anfrage({ code: '000000' }));
  const fremdesToken = await post('/api/vermittlung/senden', anfrage({ token: cf.token })), kaputtesToken = await post('/api/vermittlung/senden', anfrage({ token: c1.token.slice(0, -3) + 'abc' }));
  ok(ohneToken.status === 401 && ohneToken.json.feld === 'code' && falscherCode.status === 401 && /stimmt nicht/.test(falscherCode.json.fehler) && fremdesToken.status === 401 && /anderen Nummer/.test(fremdesToken.json.fehler) && kaputtesToken.status === 401 && kaputtesToken.json.neu === true,
    '31.4 Code: ohne Token, falscher Code, Token einer anderen Nummer und verändertes Token abgelehnt (401 am Feld code)');
  const TALT = '0175 2938471', tAlt = await code(TALT);
  await h.uhr(0.0075); // 10,8 Minuten
  const abgelaufen = await post('/api/vermittlung/senden', Object.assign(mit('tel', TALT), { token: tAlt }));
  await h.uhr(null);
  const tFehl = await code('0176 3829461'), fehlv = [];
  for (let i = 0; i < 5; i++) fehlv.push((await post('/api/vermittlung/senden', Object.assign(mit('tel', '0176 3829461'), { token: tFehl, code: '65432' + i }))).status);
  const nachFehl = await post('/api/vermittlung/senden', Object.assign(mit('tel', '0176 3829461'), { token: tFehl }));
  ok(abgelaufen.status === 401 && abgelaufen.json.abgelaufen === true && fehlv.every((s) => s === 401) && nachFehl.status === 401 && /Zu viele falsche/.test(nachFehl.json.fehler), '31.4 Token nach 10 Minuten abgelaufen (401, neu anfordern); nach fünf falschen Codes gilt auch der richtige nicht mehr');
  /* Erfolg */
  const vor = await ids();
  const ok1 = await post('/api/vermittlung/senden', anfrage());
  await warte(400);
  const m1 = await neueMails(vor), nr1 = (ok1.json || {}).nr || '-';
  const anInhaber = m1.find((m) => /Neue Vermittlung/.test(m.betreff) && m.betreff.includes(nr1)), anKunde = m1.find((m) => m.an === MAIL);
  ok(ok1.status === 200 && /^V-\d{4}-\d{4}$/.test(nr1) && !!anInhaber && (anInhaber.anhaenge || []).length === 1 && anInhaber.anhaenge[0].typ === 'application/pdf' && anInhaber.anhaenge[0].bytes === PDF.length && /\.pdf$/.test(anInhaber.anhaenge[0].name) &&
    anInhaber.html.includes('tel:05245555010') && anInhaber.html.includes('fensterbau-brandt.example') && /\b3 km/.test(anInhaber.html) && anInhaber.html.includes('/zentrale/#vermittlung/') && anInhaber.html.includes('tel:+491712894563') && /per Code bestätigt/.test(anInhaber.html) && /Einfamilienhaus/.test(anInhaber.html),
    '31.4 Anfrage ' + nr1 + ' angenommen; Mail an den Inhaber mit Aufmaßblatt im Anhang, Kunde (tel:-Link, bestätigt), Eckdaten und den gewählten Betrieben samt Telefon, Website, km und Link zur Zentrale');
  ok(!!anKunde && (anKunde.anhaenge || []).length === 1 && anKunde.anhaenge[0].typ === 'application/pdf' && anKunde.anhaenge[0].bytes === PDF.length && /Dein Aufmaßblatt hängt als PDF an/.test(anKunde.html) && anKunde.html.includes('Wir fragen bei Fensterbau Brandt und Tischlerei Lindholz an und schicken dein Aufmaß an die, die ein Angebot machen möchten; sie melden sich dann bei dir.') && !/555010|fensterbau-brandt\.example/.test(anKunde.html),
    '31.4 Bestätigung an den Kunden in Du-Form mit seinem Aufmaßblatt (Gratis-Weg), ohne Telefon oder Website der Betriebe');
  const fs1 = (ok1.json || {}).freischaltung || {}, nw = await h.api('localhost', '/api/zahlung/nachweis?kennung=' + encodeURIComponent('pPruef' + stempel) + '&session=' + encodeURIComponent(fs1.session || '') + '&token=' + encodeURIComponent(fs1.token || ''));
  const nwFalsch = await h.api('localhost', '/api/zahlung/nachweis?kennung=' + encodeURIComponent('pAnders' + stempel) + '&session=' + encodeURIComponent(fs1.session || '') + '&token=' + encodeURIComponent(fs1.token || ''));
  ok(fs1.session === 'vermittlung:' + nr1 && !!fs1.token && (nw.json || {}).ok === true && (nwFalsch.json || {}).ok === false, '31.4 Freischaltung des Aufmaßblatts in der App: Nachweis wie beim Kauf, die Anfrage als Sitzung, nur für diese Kennung');
  const doppelt = await post('/api/vermittlung/senden', anfrage());
  const zweite = await post('/api/vermittlung/senden', anfrage({ token: await code(TEL), betriebe: bid.slice(2, 7) }));
  const dritte = await post('/api/vermittlung/senden', anfrage({ token: await code(TEL) }));
  ok(doppelt.status === 200 && doppelt.json.nr === nr1 && doppelt.json.schon === true && zweite.status === 200 && zweite.json.nr !== nr1 && dritte.status === 429 && /90 Tagen/.test(dritte.json.fehler) && dritte.json.grenze === '90tage',
    '31.4 Doppelklick mit demselben Token liefert dieselbe Anfrage; höchstens zwei Anfragen je Nummer in 90 Tagen (dritte: 429 „' + ((dritte.json || {}).fehler || '').slice(0, 60) + ' …“)');
  const vorOhne = await ids();
  const ohneMail = await post('/api/vermittlung/senden', Object.assign(anfrage({ betriebe: [], token: await code(FEST) }), { kontakt: { name: 'Bernd Festnetz', ort: 'Clarholz', tel: FEST } }));
  await warte(300);
  const mOhne = await neueMails(vorOhne);
  ok(ohneMail.status === 200 && mOhne.some((m) => /Neue Vermittlung/.test(m.betreff) && /Betrieb für mich suchen/.test(m.html)) && mOhne.filter((m) => !/Neue Vermittlung/.test(m.betreff)).length === 0, '31.4 Ohne E-Mail und ohne gewählten Betrieb („Betrieb für mich suchen“): angenommen, nur die Mail an den Inhaber');
  /* ohne SMS-Anbieter (dritter Server): Code { ohneCode }, Anfrage ohne Token gilt als „Nummer nicht bestätigt“ */
  const sb3 = (await post('/api/vermittlung/suche', { plz: PLZ, ort: 'Clarholz' }, null, s3)).json || {};
  const oc = (await post('/api/vermittlung/code', { tel: TEL }, null, s3)).json || {};
  const os = await post('/api/vermittlung/senden', anfrage({ token: '', code: '', betriebe: (sb3.betriebe || []).slice(0, 2).map((b) => b.id) }), null, s3);
  const z3 = keks(await post('/api/inhaber/anmelden', { passwort: h.PASSWORT }, null, s3));
  const l3 = ((await s3.api('localhost', '/api/inhaber/vermittlungen', { cookie: z3 })).json || {}).vermittlungen || [];
  ok(oc.ohneCode === true && !oc.token && os.status === 200 && l3.some((v) => v.nr === os.json.nr && v.bestaetigt === false), '31.4 Ohne SMS-Anbieter: ohneCode, Anfrage ohne Code angenommen und in der Zentrale als „Nummer nicht bestätigt“');

  /* ---------- 31.5 Zentrale ---------- */
  const ohneSitzung = await h.api('localhost', '/api/inhaber/vermittlungen'), ohneSitzungPost = await post('/api/inhaber/vermittlungen/x0000000-0000/stand', { stand: 'erledigt' });
  const Z = keks(await post('/api/inhaber/anmelden', { passwort: h.PASSWORT }));
  const zapi = (pfad, body) => h.api('localhost', pfad, body === undefined ? { cookie: Z } : { cookie: Z, body: body, origin: true });
  const liste = (await zapi('/api/inhaber/vermittlungen')).json || {}, zeile = (liste.vermittlungen || []).find((v) => v.nr === nr1) || {};
  ok(ohneSitzung.status === 401 && ohneSitzungPost.status === 401 && !!Z && zeile.bestaetigt === true && zeile.gewaehlt === 2 && zeile.offen === 2 && zeile.stand === 'neu' && zeile.name === 'Erika Prüfmann' && zeile.ort === 'Herzebrock-Clarholz' && liste.neu >= 3 && !/AM1\./.test(JSON.stringify(liste)),
    '31.5 Zentrale nur angemeldet (401); Liste mit Nr., Name, Ort (die PLZ aus dem Feld „PLZ und Ort“ abgetrennt), Nummer bestätigt, zwei gewählten Betrieben, zwei offenen Anrufen, Stand „neu“, Zahl der neuen (' + liste.neu + ')');
  const det = (await zapi('/api/inhaber/vermittlungen/' + zeile.id)).json || {}, v1 = det.vermittlung || {}, brandt = (v1.betriebe || [])[0] || {};
  ok(brandt.name === 'Fensterbau Brandt' && brandt.tel === '05245 555010' && brandt.web === 'https://fensterbau-brandt.example/' && brandt.strasse === 'Werkstattweg 7' && brandt.status === 'offen' && v1.kunde.tel === '+491712894563' && v1.kunde.anzeige === '0171 2894563' && v1.kunde.erreich === 'Vormittags, Abends' &&
    (v1.eckZeilen || []).some((z) => z[0] === 'Gebäude' && z[1] === 'Einfamilienhaus') && v1.einwilligung.fassung === '2026-10-29' && /^10\.31\.\d+\.0\/24$/.test(v1.einwilligung.netz) && !!v1.einwilligung.zeit && v1.pdf === true && v1.aufmassZeichen === AUFMASS.length,
    '31.5 Anfrage in der Zentrale: Betriebe mit Telefon, Website und Straße aus dem Zwischenspeicher, Kunde mit Nummer, Erreichbarkeit, Eckdaten als Text, Einwilligung mit Fassung, Zeit und gekürztem Netz');
  const pdf = await h.api('localhost', '/api/inhaber/vermittlungen/' + v1.id + '/pdf', { cookie: Z }), pdfLaden = await h.api('localhost', '/api/inhaber/vermittlungen/' + v1.id + '/pdf?laden=1', { cookie: Z }), pdfOhne = await h.api('localhost', '/api/inhaber/vermittlungen/' + v1.id + '/pdf');
  ok(pdf.status === 200 && /application\/pdf/.test(pdf.headers['content-type']) && Buffer.compare(pdf.buf, PDF) === 0 && /inline/.test(pdf.headers['content-disposition']) && /attachment/.test(pdfLaden.headers['content-disposition']) && /nosniff/.test(pdf.headers['x-content-type-options']) && pdfOhne.status === 401,
    '31.5 Aufmaßblatt (PDF) nur angemeldet, unverändert, zum Ansehen oder Herunterladen');
  const lind = (v1.betriebe || [])[1] || {}, P = '/api/inhaber/vermittlungen/' + v1.id;
  const st1 = (await zapi(P + '/betrieb', { bid: lind.id, status: 'will nicht', notiz: 'Keine Kapazität bis März' })).json || {}, stFalsch = await zapi(P + '/betrieb', { bid: lind.id, status: 'vielleicht' }), stFremd = await zapi(P + '/betrieb', { bid: 'b000000000000', status: 'will' });
  const lind2 = ((st1.vermittlung || {}).betriebe || [])[1] || {};
  ok(st1.ok && st1.vermittlung.stand === 'in_arbeit' && lind2.status === 'will_nicht' && lind2.notiz === 'Keine Kapazität bis März' && st1.vermittlung.verlauf.some((x) => /Tischlerei Lindholz: Will nicht/.test(x.text)) && stFalsch.status === 400 && stFremd.status === 404,
    '31.5 Ergebnis des Anrufs je Betrieb (will nicht) mit Notiz und Verlauf; der erste Anruf setzt „neu“ auf „in Arbeit“; unbekannter Status 400, fremder Betrieb 404');
  /* Weitere Betriebe nur, wenn der Kunde „Sucht ihr für mich aus“ gewählt hat; hat er gewählt, geht sein Aufmaß nur an seine */
  const neuGewaehlt = await zapi(P + '/betrieb-neu', { name: 'Tischlerei Prüfnachbar', ort: 'Oelde', tel: '02522 938271' });
  const zeile2 = (liste.vermittlungen || []).find((v) => v.nr === (ohneMail.json || {}).nr) || {}, P2 = '/api/inhaber/vermittlungen/' + zeile2.id;
  const neuFalsch = await zapi(P2 + '/betrieb-neu', { name: 'X' }), neu1 = (await zapi(P2 + '/betrieb-neu', { name: 'Tischlerei Prüfnachbar', ort: 'Oelde', tel: '02522 938271', web: 'www.pruefnachbar.de' })).json || {}, neuDoppelt = await zapi(P2 + '/betrieb-neu', { name: 'Tischlerei Prüfnachbar', ort: 'Oelde', tel: '02522 938271' });
  const nb = ((neu1.vermittlung || {}).betriebe || []).find((x) => x.id === neu1.bid) || {};
  ok(neuFalsch.status === 400 && neu1.ok && nb.quelle === 'inhaber' && nb.tel === '02522 938271' && nb.web === 'https://www.pruefnachbar.de/' && nb.status === 'offen' && neuDoppelt.status === 409 && neuGewaehlt.status === 409 && /selbst gewählt/.test((neuGewaehlt.json || {}).fehler || ''), '31.5 Weiteren Betrieb nur bei „Sucht ihr für mich aus“ (hat der Kunde gewählt: 409); Name Pflicht, Telefon und Website geprüft, doppelt 409');
  const ohneZu = await zapi(P + '/senden', { bid: brandt.id, mail: 'info@fensterbau-brandt.example' }), zuFalsch = await zapi(P + '/senden', { bid: brandt.id, mail: 'kaputt', zustimmung: true }), zuString = await zapi(P + '/senden', { bid: brandt.id, mail: 'info@fensterbau-brandt.example', zustimmung: 'ja' });
  ok(ohneZu.status === 400 && !!ohneZu.json.felder.zustimmung && zuFalsch.status === 400 && !!zuFalsch.json.felder.mail && zuString.status === 400, '31.5 Zugang an einen Betrieb nur mit zustimmung: true (Zustimmung im Gespräch) und gültiger E-Mail');
  const vorS = await ids();
  const ges = (await zapi(P + '/senden', { bid: brandt.id, mail: 'info@fensterbau-brandt.example', zustimmung: true, kunde: true })).json || {};
  await warte(300);
  const mS = await neueMails(vorS), anBetrieb = mS.find((m) => m.an === 'info@fensterbau-brandt.example'), anKunde2 = mS.find((m) => m.an === MAIL);
  const vb = ((ges.vermittlung || {}).betriebe || [])[0] || {}, vl = ((ges.vermittlung || {}).verlauf || []).map((x) => x.text).join(' | ');
  ok(ges.ok && ges.vermittlung.stand === 'vermittelt' && vb.status === 'will' && vb.gesendet && vb.gesendet.mail === 'info@fensterbau-brandt.example' && !!vb.gesendet.zustimmung && vb.zugang && vb.zugang.mail === 'info@fensterbau-brandt.example' && !vb.zugang.geoeffnet && !vb.freischaltung && /Zustimmung im Gespräch: Fensterbau Brandt/.test(vl) && /Zugang an Fensterbau Brandt geschickt/.test(vl),
    '31.5 Zugang an Fensterbau Brandt geschickt: Zustimmung mit Zeit im Verlauf, Zugang noch nicht geöffnet, nichts freigeschaltet, Stand „vermittelt“');
  const mailText = anBetrieb ? anBetrieb.html.replace(/<[^>]+>/g, ' ') : '';
  ok(!!anBetrieb && (anBetrieb.anhaenge || []).length === 0 && /Anfrage aus Herzebrock-Clarholz/.test(anBetrieb.betreff) && !/Erika|Prüfmann|2894563|pruef-kunde/.test(mailText) && /\/konto\/#zugang\/[A-Za-z0-9_.-]{20,}/.test(anBetrieb.html) && /Vermittelt von eeziframes/.test(anBetrieb.html) && anBetrieb.html.includes(ANBIETER.name) && /Sie /.test(anBetrieb.html) && !/\b(dein|dir|du)\b/i.test(mailText) && /Einfamilienhaus/.test(anBetrieb.html) && /per Code bestätigt/.test(mailText) && /erstes Aufmaß .* kostenlos/.test(mailText) && /29 € zzgl\. USt/.test(mailText) &&
    !anKunde2,
    '31.5 Mail an den Betrieb in Sie-Form ohne Anhang und ohne Kontaktdaten des Kunden: Link in den Bereich für Fensterbauer, Eckdaten, Nummer bestätigt, erstes Aufmaß kostenlos, 29 € zzgl. USt; an den Kunden geht beim Zugang keine Mail (erst beim Freischalten)');
  const s12 = await zapi(P + '/senden', { bid: lind.id, mail: 'info@tischlerei-lindholz.example', zustimmung: true });
  const nochmal = await zapi(P + '/senden', { bid: brandt.id, mail: 'angebot@fensterbau-brandt.example', zustimmung: true });
  /* „Sucht ihr für mich aus“: der Inhaber trägt fünf weitere ein; fünf bekommen das Aufmaß, der sechste nicht */
  const weitere = [];
  for (const [i, wort] of ['Zweiter', 'Dritter', 'Vierter', 'Fünfter', 'Sechster'].entries()) weitere.push((await zapi(P2 + '/betrieb-neu', { name: 'Fensterbau ' + wort, ort: 'Ennigerloh', tel: '02524 83726' + i })).json || {});
  const sAus = [await zapi(P2 + '/senden', { bid: nb.id, mail: 'info@pruefnachbar.example', zustimmung: true })];
  for (const x of weitere.slice(0, 4)) sAus.push(await zapi(P2 + '/senden', { bid: x.bid, mail: 'info@' + x.bid + '.example', zustimmung: true }));
  const zuViele = await zapi(P2 + '/senden', { bid: weitere[4].bid, mail: 'info@sechster.example', zustimmung: true });
  ok(s12.status === 200 && nochmal.status === 200 && sAus.every((r) => r.status === 200) && zuViele.status === 409 && /fünf Betriebe/.test(zuViele.json.fehler), '31.5 Höchstens fünf Betriebe bekommen den Zugang (der sechste: 409), bei eigener Wahl nur die gewählten; an einen schon belieferten geht es noch einmal (' + sAus.map((r) => r.status).join(' ') + ')');
  const stand = (await zapi(P + '/stand', { stand: 'erledigt' })).json || {}, standFalsch = await zapi(P + '/stand', { stand: 'weg' }), notiz = await zapi(P + '/notiz', { text: 'Kundin ruft Freitag zurück' });
  const det2 = ((await zapi(P)).json || {}).vermittlung || {};
  ok(stand.ok && stand.vermittlung.stand === 'erledigt' && standFalsch.status === 400 && notiz.status === 200 && det2.notiz === 'Kundin ruft Freitag zurück', '31.5 Stand der Vermittlung (erledigt; unbekannt 400) und interne Notiz');
  const nachher = await post('/api/vermittlung/suche', { plz: PLZ, ort: 'Herzebrock' });
  ok(nurOeffentlich(nachher) && nachher.json.quelle === 'zwischenspeicher', '31.5 Auch nach der Arbeit in der Zentrale sieht die App von den Betrieben nur id, name, ort, km, leistungen (und partner)');

  /* ---------- Teil B: Zentrale im Browser ---------- */
  const messen = (page) => page.evaluate(() => {
    const sicht = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const pillen = [...document.querySelectorAll('.a-pille')].filter((p) => sicht(p) && !p.closest('.a-blatt'));
    const klein = [...document.querySelectorAll('main a, main button, main summary, main input:not([type=file]):not([type=checkbox]), main select, main textarea, .a-kopf a, .a-kopf button')].filter((e) => sicht(e) && !e.closest('.a-haken, p, .a-kv') && e.getBoundingClientRect().height < 43.5).map((e) => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().height));
    const schrift = [...document.querySelectorAll('main *')].filter((e) => sicht(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 13).map((e) => e.className + ' ' + getComputedStyle(e).fontSize);
    return { pillen: pillen.length, pilleTel: pillen[0] ? (pillen[0].getAttribute('href') || '') : '', klein: klein.slice(0, 4), schrift: schrift.slice(0, 4), quer: document.scrollingElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll('h1').length };
  });
  const browserAnfrage = async (tel, name) => {
    const r = await post('/api/vermittlung/senden', anfrage({ token: await code(tel), kontakt: { name: name, ort: 'Herzebrock-Clarholz', tel: tel, mail: 'browser-' + stempel + '@pruef-kunde.de' } }));
    return (r.json || {}).nr;
  };
  for (const [name, opts, tel] of [['Telefon', h.telefon, '0172 8391746'], ['Schreibtisch', { viewport: { width: 1280, height: 900 }, locale: 'de-DE' }, '0173 9182634']]) {
    const nr = await browserAnfrage(tel, 'Browser ' + name), c = await h.browser.newContext(opts), page = await h.neueSeite(c, h.base()), befund = [];
    const pruefe = async (wo, pille) => { await page.waitForTimeout(350); const m = await messen(page); if ((pille && m.pillen !== 1) || m.klein.length || m.schrift.length || m.quer || m.h1 !== 1) befund.push(wo + ': ' + JSON.stringify(m)); await h.foto(page, 'vermittlung-' + wo + '-' + (name === 'Telefon' ? 'telefon' : 'desktop')); return m; };
    try {
      await page.goto(h.base() + '/zentrale/', { waitUntil: 'networkidle' });
      await page.fill('[data-k="passwort"] input', h.PASSWORT); await page.click('.a-fuss .a-pille'); await page.waitForSelector('.a-umschalter');
      const zahl = Number(await page.textContent('.a-umschalter-zahl').catch(() => '0'));
      await pruefe('1-eingang', false);
      await page.click('.a-umschalter a[href="#vermittlung"]'); await page.waitForSelector('.a-eingang-zeile[href^="#vermittlung/"]');
      const aktiv = await page.getAttribute('.a-umschalter a[href="#vermittlung"]', 'aria-current');
      await pruefe('2-liste', false);
      await page.locator('.a-eingang-zeile').filter({ hasText: nr }).first().click(); await page.waitForSelector('.a-anruf');
      const m3 = await pruefe('3-anfrage', true);
      const anruf = await page.$$eval('.a-anruf', (l) => l.map((a) => ({ href: a.getAttribute('href'), h: Math.round(a.getBoundingClientRect().height) })));
      const pdfHref = await page.getAttribute('a.a-pdf', 'href');
      const karte = page.locator('.a-betrieb').filter({ hasText: 'Fensterbau Brandt' }).first();
      await karte.locator('.a-segment button', { hasText: /^Will$/ }).click();
      await page.waitForSelector('.a-betrieb [data-k="mail"] input');
      const karte2 = page.locator('.a-betrieb').filter({ hasText: 'Fensterbau Brandt' }).first();
      await karte2.locator('[data-k="mail"] input').fill('info@fensterbau-brandt.example');
      await karte2.locator('.a-senden').click(); await page.waitForTimeout(300);
      const ohneHaken = await karte2.locator('.a-haken.fehlt').count();
      await pruefe('4-will', true);
      await karte2.locator('[data-k="zustimmung"] input').check();
      await karte2.locator('.a-senden').click();
      await page.waitForFunction(() => [...document.querySelectorAll('.a-betrieb')].some((k) => /Fensterbau Brandt/.test(k.textContent) && /Zugang geschickt/.test(k.textContent)), null, { timeout: 8000 });
      await pruefe('5-geschickt', true);
      const v = (((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []).find((x) => x.nr === nr) || {};
      ok(zahl >= 1 && aktiv === 'page' && m3.pillen === 1 && /^tel:\+?\d+$/.test(m3.pilleTel) && anruf.length >= 3 && anruf.every((a) => /^tel:\+?\d+$/.test(a.href) && a.h >= 44) && /\/pdf$/.test(pdfHref || '') && ohneHaken === 1 && v.gesendet === 1 && v.stand === 'vermittelt',
        '31.B ' + name + ': Umschalter mit der Zahl der neuen (' + zahl + '), Liste, Anfrage mit Anruf-Knöpfen (tel:, ab 44 px) und der Pille „Anrufen: …“, Aufmaßblatt (PDF); „Will“ öffnet E-Mail und Häkchen, ohne Häkchen geht nichts raus, mit Häkchen „Zugang geschickt“' +
        ' (' + JSON.stringify({ anruf: anruf.length, ohneHaken, gesendet: v.gesendet, stand: v.stand }) + ')');
      ok(!befund.length, '31.B ' + name + ': genau eine volle Pille je Anfrage, ein h1, Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen' + (befund.length ? ': ' + befund.join(' | ') : ''));
    } catch (e) { ok(false, '31.B ' + name + ' läuft durch: ' + String(e && e.message || e).split('\n')[0]); }
    h.sauber(page, '31.B Zentrale der Vermittlung (' + name + ') ohne Fehler und CSP-Verstöße');
    await c.close();
  }

  /* ---------- 31.7 Bereich für Fensterbauer und Register (docs/VERMITTLUNG.md, Abschnitt 13) ---------- */
  const VP = await import(path.join(h.WURZEL, 'functions/api/vermittlung-partner.js')), RE = await import(path.join(h.WURZEL, 'functions/api/vermittlung-register.js'));
  const BMAIL = 'zugang-' + stempel + '@pruef-betrieb.de';
  const anfrageNeu = async (tel, name, plz, betriebe) => { const r = await post('/api/vermittlung/senden', anfrage(Object.assign(betriebe ? { betriebe: betriebe } : {}, { token: await code(tel), plz: plz || PLZ, kontakt: { name: name, ort: (plz || PLZ) + ' Prüfort', tel: tel, mail: 'kunde-' + tel.replace(/\D/g, '') + '@pruef-kunde.de' } }))); return (r.json || {}).nr; };
  const vonNr = async (nr) => { const l = ((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []; const z = l.find((v) => v.nr === nr); return ((await zapi('/api/inhaber/vermittlungen/' + z.id)).json || {}).vermittlung; };
  const nr7 = await anfrageNeu('0176 4455667', 'Heike Zugang'), v7 = await vonNr(nr7), b7 = v7.betriebe.find((x) => x.name === 'Fensterbau Brandt'), P7 = '/api/inhaber/vermittlungen/' + v7.id;
  const vor7 = await ids();
  const z7 = (await zapi(P7 + '/senden', { bid: b7.id, mail: BMAIL, zustimmung: true })).json || {};
  await warte(200);
  const m7 = (await neueMails(vor7)).find((m) => m.an === BMAIL), token7 = m7 ? (/\/konto\/#zugang\/([A-Za-z0-9_.-]+)/.exec(m7.html) || [])[1] : '';
  const vs7 = (await h.api('localhost', '/api/anfrage/' + token7)).json || {}, vo = vs7.vorschau || {};
  const kaputt = await h.api('localhost', '/api/anfrage/' + String(token7).slice(0, -2) + 'xx'), kurz7 = await h.api('localhost', '/api/anfrage/abc');
  ok(z7.ok && !!token7 && vs7.ok && vo.nr === nr7 && vo.ort === PLZ + ' Prüfort' && vo.stand === 'vorschau' && vo.echtheit && vo.echtheit.nummer === true && vo.echtheit.fenster === 4 && !vo.kunde && !vo.pdf && vs7.mail === 'zu•••@pruef-betrieb.de' && !vs7.mailVoll && vs7.angemeldet === false && vs7.erstesFrei === true && vs7.preis && vs7.preis.netto === 29 && vs7.preis.brutto === 34.51 && vs7.fassung === RECHT7.PARTNER_STAND && kaputt.status === 410 && kurz7.status === 400 && !/Heike|4455667/.test(JSON.stringify(vs7)),
    '31.7 Vorschau über den Link ohne Anmeldung: Ort, Eckdaten, Echtheit (Nummer bestätigt), ohne Kunde und PDF, Adresse maskiert, erstes Aufmaß kostenlos, Preis 29 € netto / 34,51 € brutto; verändertes Token 410, Unsinn 400');
  /* Konto per Code (Kundenbereich) mit der Adresse des Zugangs; eine andere Adresse darf nicht annehmen */
  const kk = async (mail) => { await post('/api/auftrag/code', { mail: mail }); const r = await post('/api/auftrag/anmelden', { mail: mail, code: '123456' }); return (r.cookies || []).map((c) => c.split(';')[0]).find((c) => /^__Host-kunde=./.test(c)) || ''; };
  const KA = await kk('andere-' + stempel + '@pruef-betrieb.de'), KB = await kk(BMAIL);
  const kapi = (K) => (pfad, body) => h.api('localhost', pfad, body === undefined ? { cookie: K } : { cookie: K, body: body, origin: true });
  const ka = kapi(KA), kb = kapi(KB);
  const falsch7 = await ka('/api/anfrage/' + token7 + '/annehmen', {}), ohne7 = await post('/api/anfrage/' + token7 + '/annehmen', {});
  const an7 = (await kb('/api/anfrage/' + token7 + '/annehmen', {})).json || {}, vs8 = (await h.api('localhost', '/api/anfrage/' + token7, { cookie: KB })).json || {};
  const li7 = (await kb('/api/konto/anfragen')).json || {}, leer7 = (await ka('/api/konto/anfragen')).json || {};
  ok(falsch7.status === 403 && /zu•••@pruef-betrieb.de/.test(falsch7.json.fehler) && ohne7.status === 401 && an7.ok && an7.id === v7.id && an7.betrieb === b7.id && vs8.passt === true && vs8.mailVoll === BMAIL && li7.anfragen.length >= 1 && li7.anfragen[0].nr === nr7 && li7.anfragen[0].geoeffnet && li7.betriebe.length === 1 && li7.betriebe[0].name === 'Fensterbau Brandt' && li7.betriebe[0].stand === 'kontakt' && li7.erstesFrei === true && li7.kasse === true && leer7.anfragen.length === 0 && leer7.betriebe.length === 0,
    '31.7 Annehmen nur mit dem Konto der Adresse, an die der Zugang ging (fremdes Konto 403, ohne 401); danach steht die Anfrage im Konto (mit den früheren Zugängen des Betriebs), der Betrieb ist mit dem Konto verbunden, der Zugang gilt als geöffnet' +
    ' (' + JSON.stringify({ falsch: falsch7.status, ohne: ohne7.status, an: an7.ok, passt: vs8.passt, anfragen: li7.anfragen.length, betriebe: li7.betriebe.map((b) => b.name + ':' + b.stand), erstesFrei: li7.erstesFrei }) + ')');
  const fremd7 = await ka('/api/konto/anfragen/' + v7.id), pdfVor = await kb('/api/konto/anfragen/' + v7.id + '/pdf'), ohneZu7 = await kb('/api/konto/anfragen/' + v7.id + '/freischalten', {});
  const vorF = await ids();
  const frei7 = (await kb('/api/konto/anfragen/' + v7.id + '/freischalten', { zustimmung: true })).json || {}, a7 = frei7.anfrage || {};
  const pdfNach = await kb('/api/konto/anfragen/' + v7.id + '/pdf'), det7 = (await kb('/api/konto/anfragen/' + v7.id)).json || {};
  await warte(200);
  const mF = await neueMails(vorF), anKundeF = mF.find((m) => m.an === 'kunde-01764455667@pruef-kunde.de');
  const zv7 = await vonNr(nr7), zb7 = zv7.betriebe.find((x) => x.id === b7.id);
  ok(fremd7.status === 404 && pdfVor.status === 402 && ohneZu7.status === 400 && ohneZu7.json.feld === 'zustimmung' && frei7.ok && frei7.frei === true && a7.stand === 'frei' && a7.frei && a7.frei.art === 'frei' && a7.frei.cent === 0 && a7.kunde && a7.kunde.name === 'Heike Zugang' && /4455667/.test(a7.kunde.tel) && a7.pdf === true && pdfNach.status === 200 && /application\/pdf/.test(pdfNach.headers['content-type'] || '') && det7.erstesFrei === false && (det7.anfrage || {}).kunde && zb7.freischaltung && zb7.freischaltung.art === 'frei' && zb7.status === 'will' &&
    !!anKundeF && /Fensterbau Brandt hat dein Aufmaß/.test(anKundeF.betreff) && /abgerufen/.test(anKundeF.html.replace(/<[^>]+>/g, ' ')),
    '31.7 Erstes Aufmaß kostenlos freischalten (nur mit Zustimmung zu den Partnerbedingungen; fremdes Konto 404, PDF vorher 402): danach Kontakt des Kunden und PDF, die Zentrale sieht „kostenlos“, der Kunde bekommt eine Mail, wer sein Aufmaß abgerufen hat');
  /* zweite Anfrage an dieselbe Adresse: Konto ist schon verbunden, die Anfrage steht sofort im Konto; Freischalten kostet, Kasse der Attrappe */
  const nr8 = await anfrageNeu('0177 5566778', 'Gerd Zweiter'), v8 = await vonNr(nr8), b8 = v8.betriebe.find((x) => x.name === 'Fensterbau Brandt');
  const z8 = (await zapi('/api/inhaber/vermittlungen/' + v8.id + '/senden', { bid: b8.id, mail: BMAIL, zustimmung: true })).json || {}, zb8 = (z8.vermittlung || {}).betriebe.find((x) => x.id === b8.id) || {};
  const li8 = (await kb('/api/konto/anfragen')).json || {};
  const kasse8 = (await kb('/api/konto/anfragen/' + v8.id + '/freischalten', { zustimmung: true })).json || {};
  const falscheKasse = await kb('/api/konto/anfragen/' + v8.id + '/kasse?session=test_falsch'), bez8 = (await kb('/api/konto/anfragen/' + v8.id + '/kasse?session=' + encodeURIComponent(kasse8.session || ''))).json || {};
  const nochmal8 = (await kb('/api/konto/anfragen/' + v8.id + '/freischalten', { zustimmung: true })).json || {};
  ok(z8.ok && zb8.zugang && zb8.zugang.konto === true && li8.anfragen.length === li7.anfragen.length + 1 && li8.anfragen[0].nr === nr8 && li8.erstesFrei === false && kasse8.ok && !kasse8.frei && /^http.*\/konto\/\?kasse=test_[A-Za-z0-9_-]+#anfrage\//.test(kasse8.kasse || '') && falscheKasse.status === 400 && bez8.ok && bez8.bezahlt === true && bez8.anfrage.frei.art === 'bezahlt' && bez8.anfrage.frei.cent === 2900 && bez8.anfrage.kunde.name === 'Gerd Zweiter' && nochmal8.schon === true,
    '31.7 Zweites Aufmaß: Zugang landet sofort im verbundenen Konto, Freischalten führt zur Kasse (29 € netto), nach der Rückkehr bezahlt und offen; fremde Kasse 400, noch einmal freischalten ist unschädlich' +
    ' (' + JSON.stringify({ konto: (zb8.zugang || {}).konto, anfragen: li8.anfragen.length, kasse: kasse8.kasse, falsch: falscheKasse.status, bezahlt: bez8.bezahlt, frei: (bez8.anfrage || {}).frei, nochmal: nochmal8.schon }) + ')');
  /* Erstes Aufmaß je Betrieb, nicht je Adresse: ein zweiter Mitarbeiter von Brandt bekommt den Zugang an eine andere Adresse, darf annehmen
     (weiteres Konto des Betriebs statt 409) und zahlt, weil Brandt sein kostenloses Aufmaß schon hatte; Domain-Ebene: eine Adresse mit der
     Website-Domain von Brandt gilt auch für einen anderen Betrieb der Anfrage als „schon genutzt“ */
  const MAIL2 = 'meister-' + stempel + '@pruef-betrieb.de', nr9 = await anfrageNeu('0178 6677889', 'Zweiter Mitarbeiter'), v9 = await vonNr(nr9), b9 = v9.betriebe.find((x) => x.name === 'Fensterbau Brandt'), l9 = v9.betriebe.find((x) => x.name === 'Tischlerei Lindholz');
  const vor9 = await ids();
  await zapi('/api/inhaber/vermittlungen/' + v9.id + '/senden', { bid: b9.id, mail: MAIL2, zustimmung: true });
  await zapi('/api/inhaber/vermittlungen/' + v9.id + '/senden', { bid: l9.id, mail: 'buero@fensterbau-brandt.example', zustimmung: true }); await warte(200);
  const m9 = await neueMails(vor9), tok9 = (m) => (/\/konto\/#zugang\/([A-Za-z0-9_.-]+)/.exec((m || {}).html || '') || [])[1] || '';
  const token9 = tok9(m9.find((m) => m.an === MAIL2)), tokenD = tok9(m9.find((m) => m.an === 'buero@fensterbau-brandt.example'));
  const KC = await kk(MAIL2), kc = kapi(KC);
  const an9 = (await kc('/api/anfrage/' + token9 + '/annehmen', {})).json || {}, li9 = (await kc('/api/konto/anfragen')).json || {};
  const frei9 = (await kc('/api/konto/anfragen/' + v9.id + '/freischalten', { zustimmung: true })).json || {};
  const regB = ((await zapi('/api/inhaber/betriebe/' + b9.id)).json || {}).betrieb || {};
  const vsD = (await h.api('localhost', '/api/anfrage/' + tokenD)).json || {}, vsL = (await h.api('localhost', '/api/anfrage/' + token9)).json || {};
  ok(an9.ok && li9.betriebe.length === 1 && li9.betriebe[0].name === 'Fensterbau Brandt' && li9.betriebe[0].konten === 2 && li9.erstesFrei === false && frei9.ok && !frei9.frei && /\/konto\/\?kasse=/.test(frei9.kasse || '') && regB.konten === 2 &&
    vsD.ok && vsD.erstesFrei === false && vsL.ok && vsL.erstesFrei === false,
    '31.7 Erstes Aufmaß je Betrieb, auf mehreren Ebenen: zweiter Mitarbeiter mit anderer Adresse wird als weiteres Konto verbunden (kein 409), sieht denselben Betrieb und zahlt; eine Adresse mit der Website-Domain des Betriebs gilt auch bei einem anderen Betrieb als genutzt' +
    ' (' + JSON.stringify({ an: an9.ok, betriebe: li9.betriebe.map((b) => b.name + ':' + b.konten), erstesFrei: li9.erstesFrei, kasse: !!frei9.kasse, konten: regB.konten, domain: vsD.erstesFrei, zweiter: vsL.erstesFrei }) + ')');

  /* Partner: Bereitschaft erklären (mit Zustimmung), danach in der Suche vorn und gekennzeichnet; Register-Eintrag ohne Anfrage; eigene Angaben */
  const ohneBetrieb = await ka('/api/konto/partner', { bereit: true, zustimmung: true }), ohneZuP = await kb('/api/konto/partner', { betrieb: li8.betriebe[0].id, bereit: true });
  const partner7 = (await kb('/api/konto/partner', { betrieb: li8.betriebe[0].id, bereit: true, zustimmung: true })).json || {};
  const su7 = (await post('/api/vermittlung/suche', { plz: '33378' })).json || {}, erster = (su7.betriebe || [])[0] || {};
  const eigener7 = (await ka('/api/konto/betrieb', { name: 'Fensterwerk Prüfpartner', ort: 'Rheda-Wiedenbrück', plz: '33378', tel: '05242 998877', web: 'www.pruefpartner.de', leistungen: ['Holz', 'Quatsch', 'Alu'] })).json || {};
  const eigenerFalsch = await ka('/api/konto/betrieb', { name: 'X', plz: '123' });
  const partner2 = (await ka('/api/konto/partner', { betrieb: (eigener7.betrieb || {}).id, bereit: true, zustimmung: true })).json || {};
  const su8 = (await post('/api/vermittlung/suche', { plz: '33378' })).json || {}, zwei = (su8.betriebe || []).slice(0, 3);
  const zurueck7 = (await kb('/api/konto/partner', { betrieb: li8.betriebe[0].id, bereit: false })).json || {};
  const su9 = (await post('/api/vermittlung/suche', { plz: '33378' })).json || {};
  ok(ohneBetrieb.status === 404 && ohneZuP.status === 400 && partner7.ok && partner7.betrieb.stand === 'partner' && partner7.betrieb.partner.bereit === true && partner7.betrieb.partner.fassung === RECHT7.PARTNER_STAND && erster.name === 'Fensterbau Brandt' && erster.partner === true && (su7.betriebe || []).filter((b) => b.partner).length === 1 &&
    eigener7.ok && eigener7.betrieb.name === 'Fensterwerk Prüfpartner' && eigener7.betrieb.leistungen.join() === 'Holz,Alu' && eigenerFalsch.status === 400 && partner2.ok && partner2.betrieb.stand === 'partner' && zwei[0].name === 'Fensterwerk Prüfpartner' && zwei[0].partner === true && zwei[0].km === 0 && zwei[1].name === 'Fensterbau Brandt' && zwei[1].partner === true && !zwei[2].partner && (su8.betriebe || []).length <= 8 &&
    zurueck7.ok && zurueck7.betrieb.stand === 'pausiert' && zurueck7.betrieb.partner.bereit === false && (su9.betriebe || [])[0].name === 'Fensterwerk Prüfpartner' && !(su9.betriebe || []).some((b) => b.name === 'Fensterbau Brandt' && b.partner),
    '31.7 Partner: Bereitschaft nur mit Zustimmung und eigenem Betrieb; Partner stehen in der Suche auf Platz 1 und 2 mit partner: true (auch ein eingetragener Betrieb, den keine Suche kannte), zurückgenommen wieder nach Entfernung (' + zwei.map((b) => b.name + (b.partner ? '*' : '')).join(', ') + ')');
  /* Register in der Zentrale: Liste, Detail mit Anfragen und Ergebnissen, Stand und Notiz, neu aufbauen; Doppelte über die Nummer */
  const reg7 = (await zapi('/api/inhaber/betriebe')).json || {}, rBrandt = (reg7.betriebe || []).find((b) => b.name === 'Fensterbau Brandt') || {}, rNeu = (reg7.betriebe || []).find((b) => b.name === 'Fensterwerk Prüfpartner') || {};
  const rd7 = (await zapi('/api/inhaber/betriebe/' + rBrandt.id)).json || {}, rb = rd7.betrieb || {};
  const st7 = (await zapi('/api/inhaber/betriebe/' + rBrandt.id, { stand: 'abgelehnt', notiz: 'Will erst 2027 wieder', mail: 'neu@fensterbau-brandt.de' })).json || {}, stFalsch7 = await zapi('/api/inhaber/betriebe/' + rBrandt.id, { stand: 'weg' });
  const auf7 = (await zapi('/api/inhaber/betriebe/neu-aufbauen', {})).json || {}, rd2 = (await zapi('/api/inhaber/betriebe/' + rBrandt.id)).json || {};
  /* gleiche Nummer wie Fensterbau Brandt → Alias statt zweiter Eintrag; über eine Anfrage ohne Wahl des Kunden (sonst 409) */
  const nrD = (await post('/api/vermittlung/senden', anfrage({ betriebe: [], token: await code('0178 6677889'), kontakt: { name: 'Dora Doppelt', ort: PLZ + ' Prüfort', tel: '0178 6677889', mail: 'dora@pruef-kunde.de' } }))).json.nr, vD = await vonNr(nrD);
  const neuD = (await zapi('/api/inhaber/vermittlungen/' + vD.id + '/betrieb-neu', { name: 'Brandt Fenster GmbH', ort: 'Herzebrock', tel: '05245 555010' })).json || {};
  const regD = (await zapi('/api/inhaber/betriebe/' + (neuD.bid || 'x'))).json || {};
  ok(reg7.ok && reg7.betriebe.length >= 8 && reg7.staende.partner === 'Partner' && rBrandt.zaehler.frei === 1 && rBrandt.zaehler.bezahlt === 1 && rBrandt.zaehler.umsatz_cent === 2900 && rBrandt.zaehler.zugaenge >= 3 && rBrandt.konto === true && rNeu.stand === 'partner' && rNeu.quelle === 'register' &&
    rd7.ok && rb.anfragen.length >= 3 && rb.anfragen.some((a) => a.nr === nr7 && a.art === 'frei' && a.kunde === 'Heike Zugang') && rb.anfragen.some((a) => a.nr === nr8 && a.art === 'bezahlt' && a.cent === 2900) && rb.verlauf.length >= 3 &&
    st7.ok && st7.betrieb.stand === 'abgelehnt' && st7.betrieb.mail === 'neu@fensterbau-brandt.de' && stFalsch7.status === 400 && auf7.ok && auf7.betriebe >= 8 && rd2.betrieb.stand === 'abgelehnt' && rd2.betrieb.notiz === 'Will erst 2027 wieder' && rd2.betrieb.zaehler.bezahlt === 1 &&
    neuD.ok && regD.ok && regD.betrieb.id === rBrandt.id && regD.betrieb.aliase.includes(neuD.bid),
    '31.7 Lexikon der Zentrale: Liste mit Zählern (1 kostenlos, 1 bezahlt, 29 € Umsatz, Konto verbunden), Detail mit allen Anfragen und Ergebnissen, Stand/Notiz/Mail ändern (unbekannt 400), „neu aufbauen“ behält Stand und Notiz, ein Betrieb mit derselben Nummer wird Alias statt Doppeleintrag');
  /* Pflege des Registers aus der Anfrage (Inhaber, 30.10.2026): Auszug je Betrieb vor dem Anruf; „Dora Doppelt“ hat Brandt Fenster GmbH als Alias
     von Brandt. Trennen gibt ihr einen eigenen Eintrag (x.register), Zuordnen hängt sie wieder an Brandt, Zusammenführen lässt einen Eintrag im anderen
     aufgehen, Angaben lassen sich ändern. */
  const detD1 = ((await zapi('/api/inhaber/vermittlungen/' + vD.id)).json || {}).vermittlung || {}, xD1 = (detD1.betriebe || []).find((x) => x.id === neuD.bid) || {}, azD1 = xD1.register || {};
  const tr = (await zapi('/api/inhaber/vermittlungen/' + vD.id + '/betrieb-trennen', { bid: neuD.bid })).json || {}, xD2 = ((tr.vermittlung || {}).betriebe || []).find((x) => x.id === neuD.bid) || {}, azD2 = xD2.register || {};
  const rBrandtNachTr = ((await zapi('/api/inhaber/betriebe/' + rBrandt.id)).json || {}).betrieb || {}, rNeuTr = ((await zapi('/api/inhaber/betriebe/' + (tr.register || 'x'))).json || {}).betrieb || {};
  const zu = (await zapi('/api/inhaber/vermittlungen/' + vD.id + '/betrieb-zuordnen', { bid: neuD.bid, register: rBrandt.id })).json || {}, azD3 = ((((zu.vermittlung || {}).betriebe || []).find((x) => x.id === neuD.bid) || {}).register) || {};
  const zuFalschP = await zapi("/api/inhaber/vermittlungen/" + vD.id + "/betrieb-zuordnen", { bid: neuD.bid, register: "gibtsnicht" });
  const rBrandtNachZu = ((await zapi('/api/inhaber/betriebe/' + rBrandt.id)).json || {}).betrieb || {};
  const zs = (await zapi('/api/inhaber/betriebe/' + rBrandt.id + '/zusammenfuehren', { mit: tr.register })).json || {}, wegTr = await zapi('/api/inhaber/betriebe/' + (tr.register || 'x'));
  const rbZs = ((await zapi('/api/inhaber/betriebe/' + rBrandt.id)).json || {}).betrieb || {};
  const aend = (await zapi('/api/inhaber/betriebe/' + rBrandt.id, { strasse: 'Werkstattweg 7a', web: 'www.fensterbau-brandt.de' })).json || {}, aendFalsch = await zapi('/api/inhaber/betriebe/' + rBrandt.id, { name: '' });
  ok(azD1.id === rBrandt.id && azD1.anders === true && azD1.genutzt === true && azD1.konten >= 2 && azD1.mails.includes(BMAIL) && (azD1.zaehler || {}).frei === 1 && azD1.zugeordnet === false &&
    tr.ok && /~/.test(tr.register || '') && azD2.id === tr.register && azD2.zugeordnet === true && azD2.anders === false && azD2.genutzt === false && rNeuTr.name === 'Brandt Fenster GmbH' && (rNeuTr.zaehler || {}).anfragen === 1 && (rBrandtNachTr.zaehler || {}).anfragen === (rBrandt.zaehler.anfragen || 0) - 0 - (rBrandt.anfragen || rb.anfragen || []).filter((a) => a.nr === nrD).length &&
    zu.ok && azD3.id === rBrandt.id && zuFalschP.status === 404 && (rBrandtNachZu.anfragen || []).some((a) => a.nr === nrD) && zs.ok && (rbZs.aliase || []).includes(tr.register) && wegTr.status === 200 && ((wegTr.json || {}).betrieb || {}).id === rBrandt.id &&
    aend.ok && aend.betrieb.strasse === 'Werkstattweg 7a' && aend.betrieb.web === 'www.fensterbau-brandt.de' && aendFalsch.status === 400,
    '31.7 Pflege aus der Anfrage: Lexikon-Auszug je Betrieb (Eintrag, Zähler, Konten, E-Mails, „erstes Aufmaß genutzt“), „Anderer Betrieb“ trennt mit eigener Kennung, „Zuordnen“ hängt an einen Eintrag (unbekannt 404), Zusammenführen lässt den Eintrag aufgehen (seine Kennung führt als Alias zum Ziel), Angaben änderbar (leerer Name 400)' +
    ' (' + JSON.stringify({ auszug: { id: azD1.id === rBrandt.id, anders: azD1.anders, genutzt: azD1.genutzt, konten: azD1.konten }, trennen: tr.register, neu: (rNeuTr.zaehler || {}).anfragen, zu: azD3.id === rBrandt.id, zusammen: zs.ok, weg: wegTr.status, aend: aend.ok }) + ')');

  /* Nachricht an den Kunden aus der Zentrale */
  const vorK = await ids();
  const km1 = (await zapi(P7 + '/kunde-mail', { betreff: 'Kurz zum Stand', text: 'Hallo Heike,\n\nFensterbau Brandt hat dein Aufmaß und meldet sich diese Woche.\n\nViele Grüße' })).json || {};
  const kmLeer = await zapi(P7 + '/kunde-mail', { betreff: 'X', text: '' }), kmOhne = await zapi(P2 + '/kunde-mail', { betreff: 'Hallo', text: 'Der Kunde hat keine Mail.' });
  await warte(200);
  const mK = (await neueMails(vorK)).find((m) => m.an === 'kunde-01764455667@pruef-kunde.de' && m.betreff === 'Kurz zum Stand');
  ok(km1.ok && (km1.vermittlung.nachrichten || []).length === 1 && /Nachricht an den Kunden: „Kurz zum Stand“/.test((km1.vermittlung.verlauf || []).map((x) => x.text).join()) && kmLeer.status === 400 && kmOhne.status === 409 && !!mK && /meldet sich diese Woche/.test(mK.html) && /Anfrage/.test(mK.html) && mK.html.includes(nr7),
    '31.7 Nachricht an den Kunden aus der Zentrale: geht an seine E-Mail mit Anfragenummer, steht im Verlauf und in den Nachrichten; leer 400, Kunde ohne E-Mail 409');
  /* Rechtsseite Partnerbedingungen und die App: Etikett „Partner“ in der Liste */
  const pb = await h.api('localhost', '/partnerbedingungen/'), pbText = pb.text || '';
  ok(pb.status === 200 && /<h1>Partnerbedingungen für Fensterbetriebe<\/h1>/.test(pbText) && /29 € zuzüglich/.test(pbText) && /<nav class="recht-inhalt"/.test(pbText) && /Stand: 30\. Oktober 2026/.test(pbText) && new RegExp('name="stand" content="' + RECHT7.PARTNER_STAND + '"').test(pbText) && /\/partnerbedingungen\//.test((await h.api('localhost', '/impressum/')).text) && /Partnerbedingungen/.test((await h.api('localhost', '/datenschutz/')).text) && /als „Partner“ gekennzeichnet/.test((await h.api('localhost', '/agb/')).text),
    '31.7 Rechtsseite /partnerbedingungen/ (Stand ' + RECHT7.PARTNER_STAND + ', Inhaltsverzeichnis), im Impressum und Datenschutz verlinkt; die AGB nennen die Reihenfolge mit Partnern');
  /* die App zeigt Partner mit Etikett und sagt, wonach sortiert ist (Fensterwerk Prüfpartner ist Partner für 33378) */
  {
    const cA = await h.browser.newContext(Object.assign({}, h.telefon, { extraHTTPHeaders: { 'x-forwarded-for': '198.51.100.231' } })), pA = await h.neueSeite(cA, h.base());
    await pA.goto(h.base() + '/app/', { waitUntil: 'networkidle' });
    await pA.waitForFunction(() => typeof SERVER !== 'undefined' && !!SERVER.vermittlung, null, { timeout: 8000 }).catch(() => null);
    await pA.evaluate(() => { S.windows = demoProject(); S.proj = Object.assign({}, PROJ0, { total: 8, zeit: 'asap', budget: 'b2', ort: '' }); S.verm = null; vm().weg = 'A'; go('betriebe'); });
    await pA.waitForSelector('#vm-plz'); await pA.type('#vm-plz', '33378');
    await pA.waitForSelector('.vm-betrieb', { timeout: 8000 }).catch(() => null);
    const appP = await pA.evaluate(() => ({ erster: (document.querySelector('.vm-betrieb .vm-tx b') || {}).textContent || '', etikett: !!document.querySelector('.vm-betrieb:first-child .vm-partner'), partner: document.querySelectorAll('.vm-partner').length, satz: /Partnerbetriebe stehen oben/.test((document.querySelector('.vm-quelle') || {}).textContent || ''), farbe: getComputedStyle(document.querySelector('.vm-partner') || document.body).backgroundColor }));
    ok(/Fensterwerk Prüfpartner/.test(appP.erster) && appP.etikett && appP.partner === 1 && appP.satz && appP.farbe === 'rgb(60, 58, 102)', '31.7 App: der Partner steht oben mit Etikett „Partner“ in Indigo, die Quellenzeile nennt die Reihenfolge (' + JSON.stringify(appP) + ')');
    h.sauber(pA, '31.7 App mit Partner ohne Fehler');
    await cA.close();
  }
  ok(VP.PREIS_NETTO === 29 && VP.PREIS_CENT === 2900 && RE.PARTNER_VORN === 2 && RE.telNorm('+49 5245 555-010') === '05245555010' && RE.webHost('https://www.Pruef-Partner.de/kontakt') === 'pruef-partner.de' && RE.webHost('kaputt') === '', '31.7 Konstanten und Normalisierung: 29 € netto, zwei Partner vorn, Nummer und Website für Doppelte vereinheitlicht');

  /* Wie online: ohne BETRIEBSKONTO sperrt der Router das alte /api/konto… (410); die Routen des Bereichs müssen trotzdem gehen (Fehler vom 30.10.2026) */
  {
    const s6 = await h.server({ BETRIEBSKONTO: '0' }), M6 = 'ohne-schalter-' + stempel + '@pruef-betrieb.de';
    const ohneAnmeldung = await s6.api('localhost', '/api/konto/anfragen'), alt6 = await s6.api('localhost', '/api/konto/sitzung', { body: {}, origin: true });
    await s6.api('localhost', '/api/auftrag/code', { body: { mail: M6 }, origin: true });
    const an6 = await s6.api('localhost', '/api/auftrag/anmelden', { body: { mail: M6, code: '123456' }, origin: true });
    const K6 = (an6.cookies || []).map((c) => c.split(';')[0]).find((c) => /^__Host-kunde=./.test(c)) || '';
    const li6 = await s6.api('localhost', '/api/konto/anfragen', { cookie: K6 }), pa6 = await s6.api('localhost', '/api/konto/partner', { cookie: K6, body: { bereit: true, zustimmung: true }, origin: true });
    ok(ohneAnmeldung.status === 401 && alt6.status === 410 && an6.status === 200 && li6.status === 200 && (li6.json || {}).ok === true && Array.isArray(li6.json.anfragen) && pa6.status === 404,
      '31.7 Ohne BETRIEBSKONTO (wie online): /api/konto/anfragen und /api/konto/partner erreichbar (401 ohne, 200/404 mit Anmeldung per Code), das alte /api/konto/sitzung bleibt 410' +
      ' (' + JSON.stringify({ ohne: ohneAnmeldung.status, alt: alt6.status, anmelden: an6.status, liste: li6.status, partner: pa6.status }) + ')');
    s6.stop();
  }

  /* ---------- Teil K: Bereich für Fensterbauer im Browser (Zugang über den Link, Code, Freischalten, PDF, Übersicht, Partner) ---------- */
  const messenK = (page) => page.evaluate(() => {
    const sicht = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const pillen = [...document.querySelectorAll('.a-pille')].filter((p) => sicht(p) && !p.closest('.a-blatt'));
    const klein = [...document.querySelectorAll('main a, main button, main summary, main input:not([type=file]):not([type=checkbox]), .a-kopf a, .a-kopf button')].filter((e) => sicht(e) && !e.closest('.a-haken, p, .a-kv, .a-fuss-links, footer') && e.getBoundingClientRect().height < 43.5).map((e) => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().height));
    const schrift = [...document.querySelectorAll('main *')].filter((e) => sicht(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 13).map((e) => e.className + ' ' + getComputedStyle(e).fontSize);
    return { pillen: pillen.length, pille: pillen[0] ? pillen[0].textContent.trim() : '', klein: klein.slice(0, 4), schrift: schrift.slice(0, 4), quer: document.scrollingElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll('h1').length, text: document.body.innerText };
  });
  for (const [name, opts, tel, mailK, betriebK] of [['Telefon', h.telefon, '0174 5566771', 'konto-telefon-' + stempel + '@pruef-betrieb.de', 'Tischlerei Lindholz'], ['Schreibtisch', { viewport: { width: 1280, height: 900 }, locale: 'de-DE' }, '0175 6677882', 'konto-laptop-' + stempel + '@pruef-betrieb.de', 'Glas und Rahmen Nolte']]) {
    /* je Lauf ein anderer Betrieb: ein Betrieb hängt an genau einem Konto (sonst 409 beim Annehmen) */
    const suK = (await post('/api/vermittlung/suche', { plz: PLZ })).json || {}, idK = ((suK.betriebe || []).find((x) => x.name === betriebK) || {}).id;
    const nrK = await anfrageNeu(tel, 'Kunde ' + name, undefined, idK ? [idK, bid[0]] : undefined), vK = await vonNr(nrK), bK = vK.betriebe.find((x) => x.name === betriebK) || vK.betriebe[0];
    const vorK = await ids();
    await zapi('/api/inhaber/vermittlungen/' + vK.id + '/senden', { bid: bK.id, mail: mailK, zustimmung: true }); await warte(200);
    const mK = (await neueMails(vorK)).find((m) => m.an === mailK), tokenK = mK ? (/\/konto\/#zugang\/([A-Za-z0-9_.-]+)/.exec(mK.html) || [])[1] : '';
    const c = await h.browser.newContext(opts), page = await h.neueSeite(c, h.base()), befund = [], mess = {};
    const pruefeK = async (wo, pille) => { await page.waitForTimeout(350); const m = await messenK(page); mess[wo] = m; if (m.pillen !== (pille ? 1 : 0) || m.klein.length || m.schrift.length || m.quer || m.h1 !== 1) befund.push(wo + ': ' + JSON.stringify({ pillen: m.pillen, pille: m.pille, klein: m.klein, schrift: m.schrift, quer: m.quer, h1: m.h1 })); await h.foto(page, 'konto-' + wo + '-' + (name === 'Telefon' ? 'telefon' : 'desktop')); return m; };
    try {
      /* Zugang über den Link: Vorschau ohne Kunde, Anmeldung mit der Adresse aus dem Zugang */
      await page.goto(h.base() + '/konto/#zugang/' + tokenK, { waitUntil: 'networkidle' }); await page.waitForSelector('.a-an-papier', { timeout: 8000 });
      const m1 = await pruefeK('1-zugang', true);
      const ohneKunde = !new RegExp('Kunde ' + name + '|' + tel.replace(/\D/g, '').slice(-6)).test(m1.text.replace(/\D/g, '') + m1.text) && /Code bestätigt/.test(m1.text) && /Partnerbedingungen/.test(m1.text);
      if (!(await page.inputValue('[data-k="mail"] input'))) await page.fill('[data-k="mail"] input', mailK);
      await page.click('.a-fuss .a-pille'); await page.waitForSelector('[data-k="code"] input', { timeout: 8000 });
      await page.fill('[data-k="code"] input', '123456'); await page.click('.a-fuss .a-pille');
      await page.waitForURL(/#anfrage\//, { timeout: 10000 }); await page.waitForSelector('.a-an-freischalten', { timeout: 8000 });
      const m2 = await pruefeK('2-anfrage', true);
      /* Freischalten nur mit Zustimmung; das erste Aufmaß ist kostenlos */
      await page.click('.a-fuss .a-pille'); await page.waitForTimeout(400);
      const ohneHakenK = await page.locator('.a-haken.fehlt').count();
      await page.check('[data-k="zustimmung"] input'); await page.click('.a-fuss .a-pille');
      await page.waitForSelector('.a-an-kontakt', { timeout: 10000 });
      const m3 = await pruefeK('3-frei', true);
      const pdfHrefK = await page.getAttribute('.a-fuss .a-pille', 'href'), pdfK = await page.request.get(h.base() + pdfHrefK);
      const mitKunde = new RegExp('Kunde ' + name).test(m3.text) && /Nur für diese Anfrage/.test(m3.text) && /kostenlos/.test(m3.text);
      /* Übersicht: die Anfrage steht da, der Betrieb mit dem Schalter „Bereitschaft erklären“ */
      await page.click('#kopf .a-rund'); await page.waitForSelector('.a-an-anfragen', { timeout: 8000 });
      const m4 = await pruefeK('4-uebersicht', true);
      const schalterK = page.locator('.a-an-schalter[aria-checked="false"]').first(), hatSchalter = await schalterK.count();
      let partnerOk = false;
      if (hatSchalter) {
        await schalterK.click(); await page.waitForSelector('.a-blatt', { timeout: 5000 }); await page.waitForTimeout(300);
        await page.click('.a-blatt .a-pille'); await page.waitForTimeout(400);
        const fehltK = await page.locator('.a-blatt .a-haken.fehlt').count();
        await page.check('.a-blatt [data-k="zustimmung"] input'); await page.click('.a-blatt .a-pille'); await page.waitForSelector('.a-blatt', { state: 'detached', timeout: 8000 }); await page.waitForTimeout(400);
        partnerOk = fehltK === 1 && (await page.locator('.a-an-schalter[aria-checked="true"]').count()) === 1;
      }
      const regK = (await zapi('/api/inhaber/betriebe/' + bK.id)).json || {}, rK = regK.betrieb || {};
      ok(!!tokenK && ohneKunde && m2.pillen === 1 && /freischalten/i.test(m2.pille) && ohneHakenK === 1 && mitKunde && /\/pdf$/.test(pdfHrefK || '') && pdfK.status() === 200 && /application\/pdf/.test(pdfK.headers()['content-type'] || '') && /Freigeschaltet/.test(m4.text) && hatSchalter === 1 && partnerOk && rK.stand === 'partner' && rK.konto,
        '31.K ' + name + ': Zugang über den Link ohne Kunde („Code bestätigt“, Partnerbedingungen), Anmeldung per Code, Freischalten nur mit Häkchen, danach Kunde, „Nur für diese Anfrage“ und PDF (200); Übersicht mit „Freigeschaltet“, Bereitschaft nur mit Häkchen, danach Partner im Register' +
        ' (' + JSON.stringify({ ohneKunde, ohneHaken: ohneHakenK, pdf: pdfK.status(), schalter: hatSchalter, partnerOk, stand: rK.stand, konto: !!rK.konto }) + ')');
      ok(!befund.length, '31.K ' + name + ': genau eine volle Pille je Bildschirm, ein h1, Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen' + (befund.length ? ': ' + befund.join(' | ') : ''));
    } catch (e) { ok(false, '31.K ' + name + ' läuft durch: ' + String(e && e.message || e).split('\n')[0]); }
    h.sauber(page, '31.K Bereich für Fensterbauer (' + name + ') ohne Fehler und CSP-Verstöße');
    await c.close();
  }
  /* „Anmelden“ für Fensterbauer: Ring neben „Paket anfragen“ auf der Seite für Fensterbauer (auch in der Ansicht Fensterbauer der Startseite eingebettet) */
  {
    const c = await h.browser.newContext(h.telefon), page = await h.neueSeite(c, h.base());
    await page.goto(h.base() + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
    const an = await page.$$eval('a.ez-anmelden', (l) => l.filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; }).map((a) => ({ href: a.getAttribute('href'), h: Math.round(a.getBoundingClientRect().height), text: a.textContent.trim() })));
    const start = fs.readFileSync(path.join(h.WURZEL, 'web/fuer-fensterbauer/index.html'), 'utf8'), vorschau = fs.readFileSync(path.join(h.WURZEL, 'docs/profis/fensterbauer-vorschau/index.html'), 'utf8');
    ok(an.length === 1 && an[0].href === '/konto/' && an[0].h >= 44 && an[0].text === 'Anmelden' && /class="ez-anmelden"/.test(start) && /class="ez-anmelden"/.test(vorschau), '31.K Seite für Fensterbauer: Ring „Anmelden“ (44 px) führt in den Bereich /konto/, in Vorschau und Seite gleich (' + JSON.stringify(an) + ')');
    h.sauber(page, '31.K Seite für Fensterbauer mit „Anmelden“ ohne Fehler');
    await c.close();
  }

  /* ---------- 31.6 Tageslauf: nach 180 Tagen weg, mit dem Aufmaßblatt ---------- */
  const vorher = (((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []).length, blaetter = ((await h.attrappe()).ablage || {}).vermittlung || [];
  await h.uhr(179); const lauf179 = await h.geplant('17 4 * * *'); await h.uhr(null);
  const nach179 = (((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []).length;
  await h.uhr(181); const lauf181 = await h.geplant('17 4 * * *');
  const neuSuche = (await post('/api/vermittlung/suche', { plz: PLZ })).json || {};
  await h.uhr(null);
  const Z2 = keks(await post('/api/inhaber/anmelden', { passwort: h.PASSWORT }));
  const nach181 = (((await h.api('localhost', '/api/inhaber/vermittlungen', { cookie: Z2 })).json || {}).vermittlungen || []).length, blaetterNach = ((await h.attrappe()).ablage || {}).vermittlung || [];
  const v179 = ((lauf179 || {}).nachholen || {}).vermittlung || {}, v181 = ((lauf181 || {}).nachholen || {}).vermittlung || {};
  ok(vorher >= 5 && blaetter.length === vorher && v179.geloescht === 0 && nach179 === vorher && v181.geloescht === vorher && nach181 === 0 && blaetterNach.length === 0 && v179.suchen >= 1 && neuSuche.quelle === 'attrappe',
    '31.6 Tageslauf: nach 179 Tagen bleibt alles, nach 181 Tagen sind alle ' + vorher + ' Anfragen samt Aufmaßblatt gelöscht; Suchen älter als 30 Tage ebenso (neue Suche statt Zwischenspeicher)' + ' (' + JSON.stringify({ blaetter: blaetter.length, v179, nach179, v181, nach181, blaetterNach: blaetterNach.length, suche: neuSuche.quelle }) + ')');

  /* ---------- 31.8 Gefahrenbereich: alle Vermittlungsdaten löschen (Anfragen, Aufmaßblätter, Register, Code-Zähler je Nummer) ---------- */
  const TEL8 = '0179 8877665';
  const nr8g = await anfrageNeu(TEL8, 'Gudrun Gefahr'), vorG = (((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []).length, regG = (((await zapi('/api/inhaber/betriebe')).json || {}).betriebe || []).length;
  for (let i = 0; i < 2; i++) await post('/api/vermittlung/code', { tel: TEL8 });
  const vierter = await post('/api/vermittlung/code', { tel: TEL8 });
  const ohneWort = await zapi('/api/inhaber/vermittlung/alles-loeschen', { bestaetigung: 'alles löschen' }), weg = (await zapi('/api/inhaber/vermittlung/alles-loeschen', { bestaetigung: 'ALLES LÖSCHEN' })).json || {};
  const nachG = (((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []).length, regNach = (((await zapi('/api/inhaber/betriebe')).json || {}).betriebe || []).length;
  const blaetterG = (((await h.attrappe()).ablage || {}).vermittlung || []).length;
  const wiederCode = await post('/api/vermittlung/code', { tel: TEL8 }), wiederAnfrage = await anfrageNeu(TEL8, 'Gudrun Danach');
  const sucheBleibt = (await post('/api/vermittlung/suche', { plz: PLZ })).json || {};
  ok(!!nr8g && vorG >= 1 && regG >= 1 && vierter.status === 429 && ohneWort.status === 400 && ohneWort.json.feld === 'bestaetigung' && weg.ok && weg.anfragen === vorG && weg.betriebe === regG && weg.blaetter >= 1 && nachG === 0 && regNach === 0 && blaetterG === 0 && wiederCode.status === 200 && !!wiederAnfrage && sucheBleibt.quelle === 'zwischenspeicher',
    '31.8 Gefahrenbereich: nur mit „ALLES LÖSCHEN“ (sonst 400); danach keine Anfragen, keine Aufmaßblätter, kein Register, die Nummer darf wieder Codes und Anfragen (vorher 429 nach drei Codes), die Suchen bleiben' +
    ' (' + JSON.stringify({ vorher: vorG, register: regG, vierter: vierter.status, weg: weg, nachher: nachG, registerNach: regNach, blaetter: blaetterG, wiederCode: wiederCode.status, suche: sucheBleibt.quelle }) + ')');

  /* ---------- Teil C: App (Folien weg, betriebe, vcode, angefragt) ----------
     Platz für die Prüfungen der App: Die Sitzung, die die Folien in web/assets/app.js baut, ergänzt sie hier (Weg A bis „Angefragt“ mit
     Suche, Auswahl von zwei bis fünf, Einwilligung, Code 123456, senden; Weg B unverändert; ohne Server nur B). */
}

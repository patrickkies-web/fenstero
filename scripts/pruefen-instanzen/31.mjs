// eeziframes · Prüfabschnitt 31: Vermittlung „Angebote aus deiner Nähe“, Stufe 1 (docs/VERMITTLUNG.md, Abschnitt 10)
// Server functions/api/vermittlung.js (mit vermittlung-suche.js, -sms.js, -daten.js, -mails.js) und die Zentrale (web/assets/inhaber.js)
// mit den Attrappen des Instanz-Testservers (Daten, Mail, KI; SMS über DATEN_ATTRAPPE: Code 123456).
// Teil A über die API (Kopfzeile Host, je Anfrage ein eigener Anschluss, damit die Bremsen nur dort greifen, wo sie geprüft werden):
//   31.1 Stand in /api/status, nicht auf dem Host einer Instanz · 31.2 Suche (Attrappe, Zwischenspeicher, sofort aus der Umgebung, nur
//   öffentliche Felder, Bremse, Tagesbudget mit Alarm, ohne Schlüssel „keine“, Tabelle der Postleitzahlen, Vorrat), KI-Suche im Prozess gegen ein nachgestelltes fetch (Anfrage nach Skill claude-api,
//   pause_turn, Zeitlimit, Ablehnung, Unsinn verwerfen) · 31.3 Code (Attrappe, falsche Nummern, Festnetz per Anruf, Grenze je Nummer, Bremse
//   je Anschluss, ohne Anbieter „ohneCode“) · 31.4 Senden (alle Ablehnungen, Code, abgelaufenes Token, Fehlversuche, Mails an den Inhaber mit
//   PDF und an den Kunden mit, Freischaltung, Doppelklick, zwei Anfragen in 90 Tagen, ohne Code „nicht bestätigt“) · 31.5 Zentrale (nur angemeldet, Liste,
//   Detail mit Telefon und Website, PDF, Ergebnis der Anrufe, Betrieb neu, Senden nur mit Zustimmung, höchstens fünf und nur die gewählten, Mails) · 31.6 Tageslauf
//   (nach 180 Tagen weg, mit dem Aufmaßblatt).
// Teil B im Browser (Telefon 390 px und Schreibtisch): Zentrale mit Umschalter, Liste, Anfrage, Anruf-Knopf, „Will“, Senden nur mit Häkchen;
//   genau eine volle Pille, Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen, keine Konsolenfehler.
// Teil C (App, Folien weg, betriebe, vcode, angefragt): ergänzt die Sitzung, die die App baut; Platz unten am Ende markiert.
import path from 'node:path';
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
  const nurOeffentlich = (r) => (r.json.betriebe || []).every((b) => Object.keys(b).sort().join() === 'id,km,leistungen,name,ort' && /^b[0-9a-f]{12}$/.test(b.id)) && !/"(tel|web|strasse)"|https?:|\.example|5550101/.test(r.text);
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
  ok(ohneZu.status === 400 && !!ohneZu.json.felder.zustimmung && zuFalsch.status === 400 && !!zuFalsch.json.felder.mail && zuString.status === 400, '31.5 Aufmaß an einen Betrieb nur mit zustimmung: true (Zustimmung im Gespräch) und gültiger E-Mail');
  const vorS = await ids();
  const ges = (await zapi(P + '/senden', { bid: brandt.id, mail: 'info@fensterbau-brandt.example', zustimmung: true, kunde: true })).json || {};
  await warte(300);
  const mS = await neueMails(vorS), anBetrieb = mS.find((m) => m.an === 'info@fensterbau-brandt.example'), anKunde2 = mS.find((m) => m.an === MAIL);
  const vb = ((ges.vermittlung || {}).betriebe || [])[0] || {}, vl = ((ges.vermittlung || {}).verlauf || []).map((x) => x.text).join(' | ');
  ok(ges.ok && ges.vermittlung.stand === 'vermittelt' && vb.status === 'will' && vb.gesendet && vb.gesendet.mail === 'info@fensterbau-brandt.example' && !!vb.gesendet.zustimmung && /Zustimmung im Gespräch: Fensterbau Brandt/.test(vl) && /Aufmaß an Fensterbau Brandt geschickt/.test(vl),
    '31.5 Aufmaß an Fensterbau Brandt geschickt: Zustimmung mit Zeit im Verlauf, Stand „vermittelt“');
  ok(!!anBetrieb && (anBetrieb.anhaenge || []).length === 1 && anBetrieb.anhaenge[0].bytes === PDF.length && /Anfrage aus Herzebrock-Clarholz/.test(anBetrieb.betreff) && /Erika Prüfmann/.test(anBetrieb.html) && /tel:\+491712894563/.test(anBetrieb.html) && /Vermittelt von eeziframes/.test(anBetrieb.html) && anBetrieb.html.includes(ANBIETER.name) && /Sie /.test(anBetrieb.html) && !/\b(dein|dir|du)\b/i.test(anBetrieb.html.replace(/<[^>]+>/g, ' ')) && /Einfamilienhaus/.test(anBetrieb.html) &&
    !!anKunde2 && /Fensterbau Brandt hat dein Aufmaß/.test(anKunde2.betreff) && (anKunde2.anhaenge || []).length === 0,
    '31.5 Mail an den Betrieb in Sie-Form mit Aufmaßblatt, Kontakt und Eckdaten, „Vermittelt von eeziframes“ und Impressum; kurze Mail an den Kunden, wer sein Aufmaß hat');
  const s12 = await zapi(P + '/senden', { bid: lind.id, mail: 'info@tischlerei-lindholz.example', zustimmung: true });
  const nochmal = await zapi(P + '/senden', { bid: brandt.id, mail: 'angebot@fensterbau-brandt.example', zustimmung: true });
  /* „Sucht ihr für mich aus“: der Inhaber trägt fünf weitere ein; fünf bekommen das Aufmaß, der sechste nicht */
  const weitere = [];
  for (const [i, wort] of ['Zweiter', 'Dritter', 'Vierter', 'Fünfter', 'Sechster'].entries()) weitere.push((await zapi(P2 + '/betrieb-neu', { name: 'Fensterbau ' + wort, ort: 'Ennigerloh', tel: '02524 83726' + i })).json || {});
  const sAus = [await zapi(P2 + '/senden', { bid: nb.id, mail: 'info@pruefnachbar.example', zustimmung: true })];
  for (const x of weitere.slice(0, 4)) sAus.push(await zapi(P2 + '/senden', { bid: x.bid, mail: 'info@' + x.bid + '.example', zustimmung: true }));
  const zuViele = await zapi(P2 + '/senden', { bid: weitere[4].bid, mail: 'info@sechster.example', zustimmung: true });
  ok(s12.status === 200 && nochmal.status === 200 && sAus.every((r) => r.status === 200) && zuViele.status === 409 && /fünf Betriebe/.test(zuViele.json.fehler), '31.5 Höchstens fünf Betriebe bekommen das Aufmaß (der sechste: 409), bei eigener Wahl nur die gewählten; an einen schon belieferten geht es noch einmal (' + sAus.map((r) => r.status).join(' ') + ')');
  const stand = (await zapi(P + '/stand', { stand: 'erledigt' })).json || {}, standFalsch = await zapi(P + '/stand', { stand: 'weg' }), notiz = await zapi(P + '/notiz', { text: 'Kundin ruft Freitag zurück' });
  const det2 = ((await zapi(P)).json || {}).vermittlung || {};
  ok(stand.ok && stand.vermittlung.stand === 'erledigt' && standFalsch.status === 400 && notiz.status === 200 && det2.notiz === 'Kundin ruft Freitag zurück', '31.5 Stand der Vermittlung (erledigt; unbekannt 400) und interne Notiz');
  const nachher = await post('/api/vermittlung/suche', { plz: PLZ, ort: 'Herzebrock' });
  ok(nurOeffentlich(nachher) && nachher.json.quelle === 'zwischenspeicher', '31.5 Auch nach der Arbeit in der Zentrale sieht die App von den Betrieben nur id, name, ort, km, leistungen');

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
      await page.waitForFunction(() => [...document.querySelectorAll('.a-betrieb')].some((k) => /Fensterbau Brandt/.test(k.textContent) && /Aufmaß geschickt/.test(k.textContent)), null, { timeout: 8000 });
      await pruefe('5-geschickt', true);
      const v = (((await zapi('/api/inhaber/vermittlungen')).json || {}).vermittlungen || []).find((x) => x.nr === nr) || {};
      ok(zahl >= 1 && aktiv === 'page' && m3.pillen === 1 && /^tel:\+?\d+$/.test(m3.pilleTel) && anruf.length >= 3 && anruf.every((a) => /^tel:\+?\d+$/.test(a.href) && a.h >= 44) && /\/pdf$/.test(pdfHref || '') && ohneHaken === 1 && v.gesendet === 1 && v.stand === 'vermittelt',
        '31.B ' + name + ': Umschalter mit der Zahl der neuen (' + zahl + '), Liste, Anfrage mit Anruf-Knöpfen (tel:, ab 44 px) und der Pille „Anrufen: …“, Aufmaßblatt (PDF); „Will“ öffnet E-Mail und Häkchen, ohne Häkchen geht nichts raus, mit Häkchen „Aufmaß geschickt“' +
        ' (' + JSON.stringify({ anruf: anruf.length, ohneHaken, gesendet: v.gesendet, stand: v.stand }) + ')');
      ok(!befund.length, '31.B ' + name + ': genau eine volle Pille je Anfrage, ein h1, Ziele ab 44 px, Schrift ab 13 px, kein Querscrollen' + (befund.length ? ': ' + befund.join(' | ') : ''));
    } catch (e) { ok(false, '31.B ' + name + ' läuft durch: ' + String(e && e.message || e).split('\n')[0]); }
    h.sauber(page, '31.B Zentrale der Vermittlung (' + name + ') ohne Fehler und CSP-Verstöße');
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

  /* ---------- Teil C: App (Folien weg, betriebe, vcode, angefragt) ----------
     Platz für die Prüfungen der App: Die Sitzung, die die Folien in web/assets/app.js baut, ergänzt sie hier (Weg A bis „Angefragt“ mit
     Suche, Auswahl von zwei bis fünf, Einwilligung, Code 123456, senden; Weg B unverändert; ohne Server nur B). */
}

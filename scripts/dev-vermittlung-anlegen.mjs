// eeziframes · Testanfragen der Vermittlung auf einem laufenden lokalen Server anlegen (Daten-, KI-, SMS- und Mail-Attrappe), damit sich
// Zentrale (/zentrale/#vermittlung, Passwort ZENTRALE_PASSWORT) und der Bereich für Fensterbauer (/konto/) mit Inhalt ansehen lassen.
// Aufruf: node scripts/dev-vermittlung-anlegen.mjs [http://localhost:8795] [Anzahl]
// Je Anfrage: Suche zur PLZ (Attrappe: acht erfundene Betriebe um Herzebrock-Clarholz), Code (Attrappe 123456), Senden mit einem kleinen
// Prüf-PDF; die Kunden wechseln, damit die Grenze „zwei Anfragen je Nummer in 90 Tagen“ nicht greift.
const BASE = (process.argv[2] || 'http://localhost:8795').replace(/\/$/, ''), N = Math.max(1, Number(process.argv[3]) || 3);
const PDF = Buffer.concat([Buffer.from('%PDF-1.4\n% eeziframes Testblatt der Vermittlung\n'), Buffer.alloc(4000, 0x20), Buffer.from('\n%%EOF\n')]);
const AUFMASS = 'AM1.' + Buffer.from(JSON.stringify({ v: 1, b: '', p: { gebaeude: 'efh' }, w: [{ id: 'w1', b: 1230, h: 1410 }, { id: 'w2', b: 1010, h: 1210 }], t: Date.now() })).toString('base64url');
const KUNDEN = [
  { name: 'Erika Prüfmann', tel: '0171 2894563', mail: 'erika@pruef-kunde.example', ort: '33442 Herzebrock-Clarholz', plz: '33442', eck: { fenster: 4, elemente: 5, gebaeude: 'efh', baujahr: '1978', zeit: '3m', budget: 'b2', foerdweg: 'bafa' } },
  { name: 'Bernd Festnetz', tel: '05241 739821', mail: '', ort: '33330 Gütersloh', plz: '33330', eck: { fenster: 2, elemente: 2, gebaeude: 'rh', baujahr: '1995', zeit: 'asap', budget: 'b1', foerdweg: 'keine' } },
  { name: 'Sabine Muster', tel: '0160 9182736', mail: 'sabine@pruef-kunde.example', ort: '33378 Rheda-Wiedenbrück', plz: '33378', eck: { fenster: 7, elemente: 9, gebaeude: 'mfh', baujahr: '1962', zeit: '6m', budget: 'b3', foerdweg: 'steuer' } },
  { name: 'Tom Testmann', tel: '0152 3948576', mail: 'tom@pruef-kunde.example', ort: '59302 Oelde', plz: '59302', eck: { fenster: 3, elemente: 3, gebaeude: 'dh', baujahr: '2001', zeit: '12m', budget: 'b0', foerdweg: 'offen' } }
];
let ip = 10;
async function post(pfad, body) {
  const r = await fetch(BASE + pfad, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', origin: BASE, 'x-forwarded-for': '10.99.0.' + (++ip) }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({})); if (!r.ok || !j.ok) throw new Error(pfad + ': ' + r.status + ' ' + (j.fehler || JSON.stringify(j))); return j;
}
for (let i = 0; i < N; i++) {
  const k = KUNDEN[i % KUNDEN.length];
  const s = await post('/api/vermittlung/suche', { plz: k.plz }), ids = (s.betriebe || []).slice(0, 2 + (i % 3)).map((b) => b.id);
  const c = await post('/api/vermittlung/code', { tel: k.tel });
  const v = await post('/api/vermittlung/senden', { kontakt: { name: k.name, ort: k.ort, tel: k.tel, mail: k.mail, erreich: ['vm', 'ab'] }, plz: k.plz, betriebe: i % 4 === 3 ? [] : ids, token: c.token || '', code: c.ohneCode ? '' : '123456',
    einwilligung: { fassung: '2026-10-30', text: 'Ich bin einverstanden, dass eeziframes die gewählten Betriebe für mich anfragt und ihnen mein Aufmaß mit Namen, Ort, Telefonnummer und E-Mail-Adresse schickt. Sonst bekommt niemand meine Daten.' },
    aufmass: AUFMASS, eckdaten: k.eck, pdf: PDF.toString('base64'), kennung: 'pDev' + Date.now().toString(36) + i });
  console.log(v.nr, k.name, k.ort, ids.length ? ids.length + ' Betriebe gewählt' : 'Betrieb für mich suchen', (s.betriebe || []).slice(0, 2 + (i % 3)).map((b) => b.name).join(', '));
}
console.log('Fertig. Zentrale: ' + BASE + '/zentrale/#vermittlung');

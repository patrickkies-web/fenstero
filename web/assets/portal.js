'use strict';
/* Fenster-Modell (AW) und Abrechnungsregeln (X) kommen aus /assets/modell.js, gemeinsam mit dem Server */
const AW = window.AW, X = window.Abrechnung;
const P = () => X.preise();
const eur2 = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
/* ---------- Grundlagen ---------- */
/* Adressen aus der aktuellen Seite: läuft so auf pages.dev und auf der eigenen Domain */
const APP_URL = new URL('/app/', location.href).href;
const LOCAL = false;
const APP_OPEN = APP_URL;
const STORE = 'aufmass.portal.v1';
const LOGO = (px) => (window.Logo ? window.Logo.svg(px) : '');
const GEO = { '50667': [50.938, 6.957, 'Köln', 'Altstadt'], '50823': [50.951, 6.918, 'Köln', 'Ehrenfeld'], '51103': [50.934, 7.025, 'Köln', 'Kalk'], '50939': [50.918, 6.933, 'Köln', 'Sülz'], '53111': [50.737, 7.098, 'Bonn', 'Zentrum'], '53173': [50.700, 7.160, 'Bonn', 'Bad Godesberg'], '51373': [51.031, 6.988, 'Leverkusen', 'Wiesdorf'], '40213': [51.224, 6.776, 'Düsseldorf', 'Altstadt'], '51429': [50.985, 7.137, 'Bergisch Gladbach', 'Bensberg'], '50354': [50.871, 6.868, 'Hürth', 'Hermülheim'], '50259': [50.996, 6.806, 'Pulheim', 'Stadt'], '53840': [50.816, 7.149, 'Troisdorf', 'Mitte'], '50668': [50.950, 6.960, 'Köln', 'Neustadt-Nord'], '51063': [50.960, 7.000, 'Köln', 'Mülheim'] };
const BASE_COMPANIES = [
  { id: 'c1', plan: 'service', name: 'Fensterbau Brandt', plz: '50668', since: 1998, col: '#0071e3' },
  { id: 'c7', plan: 'service', name: 'Glaserei Vogt', plz: '50259', since: 1989, col: '#8a5a2b' }
];
/* ---------- Helfer ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const mm = (n) => (n ? Number(n).toLocaleString('de-DE') : '–');
function geo(plz) {
  if (GEO[plz]) return GEO[plz];
  const p = String(plz || ''), keys = Object.keys(GEO);
  const k = keys.find((g) => g.slice(0, 3) === p.slice(0, 3)) || keys.find((g) => g.slice(0, 2) === p.slice(0, 2)) || keys.find((g) => g[0] === p[0]);
  return k ? GEO[k] : GEO['50667'];
}
function km(a, b) { const A = geo(a), B = geo(b), r = Math.PI / 180, dLat = (B[0] - A[0]) * r, dLng = (B[1] - A[1]) * r, x = Math.sin(dLat / 2) ** 2 + Math.cos(A[0] * r) * Math.cos(B[0] * r) * Math.sin(dLng / 2) ** 2; return Math.round(6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))); }
const ort = (plz) => geo(plz)[2], teil = (plz) => (GEO[plz] ? GEO[plz][3] : '');
const lage = (plz) => ort(plz) + (teil(plz) ? '-' + teil(plz) : '');
const slug = (t) => String(t || '').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
const b64u = (t) => { try { return btoa(String.fromCharCode.apply(null, Array.from(new TextEncoder().encode(String(t || ''))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); } catch (e) { return ''; } };
const MATL = { kunststoff: 'Kunststoff', holz: 'Holz', holzalu: 'Holz-Alu', alu: 'Aluminium' };
const newCode = () => Math.random().toString(36).slice(2, 7).replace(/[^a-z0-9]/g, 'x').padEnd(5, '7');
const two = (n) => String(n).padStart(2, '0');
function stamp() { const d = new Date(); return 'heute, ' + two(d.getHours()) + ':' + two(d.getMinutes()); }
function dateIn(days) { const d = new Date(); d.setDate(d.getDate() + days); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); }
const parseDE = (s) => { const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s || '').trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1], 23, 59, 59) : null; };
const datumDE = (ts) => { const d = new Date(ts); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); };
const hashN = X.hashN;
/* ---------- Beispieldaten ---------- */
const nW = (n, one, many) => n + ' ' + (n === 1 ? one : many);
const KI = {
  wohnen: { chips: ['Kunststoff, weiß, vergilbt', '2-fach, vor 2000', 'Rollladenkasten innen', 'Heizkörper unter dem Fenster'], rows: [['Material', 'Kunststoff, weiß, vergilbt'], ['Verglasung', '2-fach, vermutlich vor 2000'], ['Rollladen', 'Kasten innen über dem Fenster, Gurtantrieb'], ['Fensterbank innen', 'Naturstein, etwa 25 cm tief'], ['Heizkörper', 'direkt unter dem Fenster'], ['Fassade', 'Putz, Außenanschlag etwa 3 cm']] },
  kueche: { chips: ['Kunststoff, weiß', '2-fach', 'Fliesenspiegel an der Laibung'], rows: [['Material', 'Kunststoff, weiß'], ['Verglasung', '2-fach'], ['Laibung innen', 'Fliesenspiegel bis an den Rahmen'], ['Fensterbank innen', 'Werzalit, weiß'], ['Hinweis', 'Arbeitsplatte unter dem Fenster, der Flügel muss darüber aufgehen']] },
  bad: { chips: ['Holz, weiß lackiert', 'Ornamentglas', 'Rahmen unten feucht'], rows: [['Material', 'Holz, weiß lackiert, Lack blättert unten'], ['Verglasung', 'Einfachglas, Ornament'], ['Laibung innen', 'gefliest'], ['Zustand', 'Rahmen unten feucht, Holz weich'], ['Hinweis', 'Fliesen an der Laibung werden beim Ausbau wahrscheinlich beschädigt']] },
  schlafen: { chips: ['Kunststoff, weiß', 'Rollladen vorhanden', 'Putzfassade'], rows: [['Material', 'Kunststoff, weiß'], ['Verglasung', '2-fach'], ['Rollladen', 'Kasten innen, Gurt, funktioniert'], ['Fassade', 'Putz']] },
  laden: { chips: ['Aluminium, dunkelgrau', 'Schaufenster', 'Klinkerfassade'], rows: [['Material', 'Aluminium, dunkelgrau'], ['Verglasung', '2-fach, Isolierglas'], ['Fassade', 'Klinker'], ['Hinweis', 'Festverglasung mit Beschriftung auf dem Glas']] },
  back: { chips: ['Aluminium', 'nur kippbar', 'kein Insektenschutz'], rows: [['Material', 'Aluminium'], ['Öffnung', 'nur kippbar'], ['Hinweis', 'Lebensmittelbetrieb: Insektenschutz einplanen']] }
};
const MOx = (w, h) => ({ wm: w, wt: w + 2, wb: w - 1, hm: h, hl: h + 2, hr: h - 1 });
function demoWins(set) {
  if (set === 'lindner') return [
    AW.mk({ name: 'Schaufenster links', etage: 'eg', mo: MOx(2030, 2240), el: { w: 2000, h: 2210 }, bru: 450, laib: 160, teilung: '1', sashes: [{ t: 'F', din: 'L' }], material: 'alu', fa: '7016', fi: '7016', gleich: true, glasfn: ['vsg'], fba: 'stein', fotos: 2, ki: KI.laden }),
    AW.mk({ name: 'Schaufenster rechts', etage: 'eg', mo: MOx(2030, 2240), el: { w: 2000, h: 2210 }, bru: 450, laib: 160, teilung: '1', sashes: [{ t: 'F', din: 'L' }], material: 'alu', fa: '7016', fi: '7016', gleich: true, glasfn: ['vsg'], fba: 'stein', fotos: 2, ki: KI.laden }),
    AW.mk({ name: 'Backstube', etage: 'eg', mo: MOx(1010, 810), el: { w: 980, h: 780 }, bru: 1450, laib: 160, teilung: '1', sashes: [{ t: 'K', din: 'L' }], material: 'alu', fa: '7016', fi: '9016', insekt: 'spann', fotos: 2, ki: KI.back })
  ];
  return [
    AW.mk({ name: 'Wohnzimmer', etage: 'eg', mo: MOx(1790, 1410), el: { w: 1760, h: 1385 }, bru: 620, laib: 140, teilung: '3', roll: 'aufsatz', antrieb: 'motor', insekt: 'spann', fbi: 'stein', fotos: 2, ki: KI.wohnen }),
    AW.mk({ name: 'Küche', etage: 'eg', mo: MOx(1260, 1440), el: { w: 1230, h: 1410 }, bru: 980, laib: 120, teilung: '2p', glasfn: ['vsg'], fbi: 'werzalit', fotos: 2, ki: KI.kueche }),
    AW.mk({ name: 'Bad', etage: 'og', mo: MOx(905, 1040), el: { w: 880, h: 1010 }, bru: 1320, laib: 120, teilung: '1', fa: '9016', glasfn: ['sicht'], orn: 'satinato', fbi: 'werzalit', fotos: 2, ki: KI.bad }),
    AW.mk({ name: 'Schlafzimmer', etage: 'og', anzahl: 2, mo: MOx(1260, 1440), el: { w: 1230, h: 1410 }, bru: 900, laib: 140, teilung: '2p', bars: [{ s: 0, d: 'v', p: 0.5 }, { s: 0, d: 'h', p: 0.5 }, { s: 1, d: 'v', p: 0.5 }, { s: 1, d: 'h', p: 0.5 }], spross: 'wiener', breite: 26, roll: 'behalten', fotos: 2, ki: KI.schlafen })
  ];
}
const projOf = (o) => Object.assign({ gebaeude: 'efh', baujahr: '1978', total: 9, zeit: '3m', budget: 'b3', foerd: false }, o);
const aufmassOf = X.aufmassOf;
function demoProjects(id) {
  if (id === 'c1') return [
    { id: 'l1', code: '7f3a9', nr: 'P-2026-031', kunde: 'Familie Weber', kontakt: '0171 234 56 78', adresse: 'Lindenstraße 14, 50823 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster', 'Rollläden'], note: 'Rollladen elektrisch gewünscht', created: '10.10.2026', expires: '24.10.2026', status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: '10.10., 09:12', gesendet: '10.10., 09:13', geoeffnet: '10.10., 18:40', arbeit: '10.10., 18:41', eingegangen: '10.10., 19:05' }, aufmass: aufmassOf(demoWins('weber'), projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' })), stage: 'angebot', memo: 'Angebot bis Freitag', seen: false },
    { id: 'l2', code: 'k2m8q', nr: 'P-2026-032', kunde: 'Herr Kaya', kontakt: 'kaya@beispiel.de', adresse: '51063 Köln-Mülheim', geb: 'etw', fz: '1 bis 2', plan: ['Fenster'], note: 'Wohnzimmer, vor dem Mieterwechsel', created: '12.10.2026', expires: '26.10.2026', status: 'arbeit', progress: 2, via: 'E-Mail', du: false, log: { erstellt: '12.10., 14:02', gesendet: '12.10., 14:03', geoeffnet: 'gestern, 19:20', arbeit: 'gestern, 19:22' } },
    { id: 'l3', code: 'p9x4t', nr: 'P-2026-033', kunde: 'Frau Schulze', kontakt: '0160 998 77 66', adresse: '50939 Köln-Sülz', geb: 'rh', fz: '6 bis 10', plan: ['Fenster', 'Haustür'], note: 'ganzes Haus, Rückruf nach 17 Uhr', created: 'heute', expires: dateIn(14), status: 'gesendet', progress: 0, via: 'SMS', du: false, log: { erstellt: 'heute, 08:30', gesendet: 'heute, 08:31' } }
  ];
  if (id === 'c7') return [
    { id: 'l4', code: 'v3n7r', nr: 'P-2026-007', kunde: 'Bäckerei Lindner', kontakt: '02238 12 34', adresse: 'Venloer Straße 3, 50259 Pulheim', geb: 'gewerbe', fz: '3 bis 5', plan: ['Fenster', 'Insektenschutz'], note: 'Ladenfront und Backstube', created: '08.10.2026', expires: '22.10.2026', status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: '08.10., 10:00', gesendet: '08.10., 10:01', geoeffnet: '08.10., 15:30', arbeit: '08.10., 15:31', eingegangen: '08.10., 16:02' }, aufmass: aufmassOf(demoWins('lindner'), projOf({ gebaeude: 'gewerbe', baujahr: '1965', total: 3, zeit: 'asap', budget: 'b2' })), stage: 'termin', memo: 'Feinaufmaß Dienstag 9 Uhr', seen: true },
    { id: 'l5', code: 'h6c2w', nr: 'P-2026-008', kunde: 'Familie Roth', kontakt: '0172 333 44 55', adresse: '50259 Pulheim', geb: 'dh', fz: '1 bis 2', plan: ['Fenster'], note: 'Kinderzimmer', created: 'gestern', expires: dateIn(13), status: 'geoeffnet', progress: 0, via: 'WhatsApp', du: true, log: { erstellt: 'gestern, 17:45', gesendet: 'gestern, 17:46', geoeffnet: 'heute, 07:58' } }
  ];
  return [];
}
function seed() {
  return {
    v: 5, role: null, screen: 'landing', sel: null, hist: [],
    acc: {
      c1: { plan: 'service', konto: 'service', pay: { type: 'SEPA-Firmenlastschrift', label: 'DE12 •••• •••• 4521', inhaber: 'Fensterbau Brandt', when: '01.09.2026' }, ap: 'Jens Brandt', mail: 'info@fensterbau-brandt.de', tel: '0221 123456', abzug: { seite: 15, oben: 15 }, prefs: { mail: true, remind: true }, rechnungen: [{ nr: 'RE-2026-0912', datum: '30.09.2026', betrag: 27, pos: 3, status: 'bezahlt' }], links: demoProjects('c1'), book: null, freeUsed: 0 },
      c7: { plan: 'service', konto: 'service', ap: 'Petra Vogt', mail: 'info@glaserei-vogt.de', tel: '02238 4711', abzug: { seite: 10, oben: 10 }, prefs: { mail: true, remind: true }, rechnungen: [], links: demoProjects('c7'), book: null, freeUsed: 0 }
    },
    cur: 'c1', myCompanies: [],
    logins: { 'info@fensterbau-brandt.de': { role: 'betrieb', id: 'c1' }, 'info@glaserei-vogt.de': { role: 'betrieb', id: 'c7' } },
    notif: {
      c1: [{ t: 'Herr Kaya misst gerade', s: 'Projekt P-2026-032: 2 von 4 Maßen eingetragen.', when: 'gestern, 19:22', new: true, to: ['link', 'l2'] }, { t: 'Aufmaß eingegangen: Familie Weber', s: '4 Positionen, 5 Elemente, 8 Fotos.', when: '10.10., 19:05', new: false, to: ['link', 'l1'] }],
      c7: [{ t: 'Familie Roth hat den Link geöffnet', s: 'Projekt P-2026-008, noch keine Maße eingetragen.', when: 'heute, 07:58', new: true, to: ['link', 'l5'] }, { t: 'Aufmaß eingegangen: Bäckerei Lindner', s: '3 Positionen mit 6 Fotos.', when: '08.10., 16:02', new: false, to: ['link', 'l4'] }]
    },
    reg: null, nl: null, lfilt: 'alle', sheet: null
  };
}

let S = seed();
try { const raw = localStorage.getItem(STORE); if (raw) { const o = JSON.parse(raw); if (o && o.v === 5 && o.acc) S = Object.assign(seed(), o, { sheet: null }); } } catch (e) { /* ohne Speicher weiter */ }
function save() { try { const o = Object.assign({}, S, { sheet: null }); ['justCreated', '_pop', '_focusErr', 'animNext', '_feier'].forEach((k) => delete o[k]); localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) { /* ok */ } }
/* ---------- Server (Stufe 2) ----------
   Meldet /api/status „daten“, liegt das Konto des Betriebs auf dem Server (Supabase) und Zahlungen laufen über Stripe.
   Die Demo-Betriebe bleiben lokal im Browser; das Server-Konto heißt hier 'srv'. Jede Änderung geht an die API, der Server rechnet und zählt. */
const Server = {
  id: 'srv', status: null, sitzung: null, laeuft: false, stripe: null,
  get an() { return !!(this.status && this.status.daten); },
  online() { return this.an && S.role === 'betrieb' && S.cur === this.id && !!this.sitzung; },
  lesen() { try { this.sitzung = JSON.parse(localStorage.getItem('aufmass.sitzung') || 'null'); } catch (e) { this.sitzung = null; } },
  merken(x) { this.sitzung = x; try { if (x) localStorage.setItem('aufmass.sitzung', JSON.stringify(x)); else localStorage.removeItem('aufmass.sitzung'); } catch (e) { /* ok */ } },
  async api(pfad, body, method) {
    const init = { method: method || (body ? 'POST' : 'GET'), headers: { accept: 'application/json' } };
    if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); }
    if (this.sitzung && this.sitzung.token) init.headers.authorization = 'Bearer ' + this.sitzung.token;
    let r = await fetch(pfad, init), j = await r.json().catch(() => null);
    if (r.status === 401 && this.sitzung && this.sitzung.refresh) {
      const e = await fetch('/api/konto/erneuern', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refresh: this.sitzung.refresh }) }).then((x) => x.json()).catch(() => null);
      if (e && e.ok) { this.merken(Object.assign({}, this.sitzung, { token: e.token, refresh: e.refresh })); init.headers.authorization = 'Bearer ' + e.token; r = await fetch(pfad, init); j = await r.json().catch(() => null); }
    }
    if (r.status === 401) { this.merken(null); if (S.cur === this.id) { S.role = null; nav('landing'); } }
    if (!r.ok || !j || j.ok === false) { const err = new Error(j && j.fehler ? j.fehler : 'Der Server antwortet gerade nicht.'); err.status = r.status; throw err; }
    return j;
  },
  uebernehmen(konto) {
    if (!konto || !konto.acc) return;
    S.acc[this.id] = konto.acc; S.notif[this.id] = konto.acc.notif || [];
    S.myCompanies = (S.myCompanies || []).filter((c) => c.id !== this.id).concat([konto.company]); this.stripe = konto.stripe || null;
  },
  async laden() { const r = await this.api('/api/konto'); this.uebernehmen(r.konto); return r.konto; },
  async start() {
    try { const r = await fetch('/api/status', { headers: { accept: 'application/json' }, cache: 'no-store' }); this.status = r.ok ? await r.json() : null; } catch (e) { this.status = null; }
    if (this.status && this.status.preise) X.setPreise(this.status.preise);
    if (!this.an) { if (S.cur === this.id) { S.cur = 'c1'; if (S.role) S.role = null; } return false; }
    this.lesen();
    if (this.sitzung) { try { await this.laden(); if (!S.role || S.cur === this.id) { S.role = 'betrieb'; S.cur = this.id; } } catch (e) { /* Sitzung abgelaufen: Startseite */ } }
    else if (S.cur === this.id) { S.role = null; S.cur = 'c1'; }
    await this.rueckkehr();
    return true;
  },
  /* Rückkehr von Stripe: ?zahlungsart=<Sitzung> oder ?abo=<Sitzung> */
  async rueckkehr() {
    const q = new URLSearchParams(location.search), z = q.get('zahlungsart'), ab = q.get('abo');
    if (!z && !ab) return;
    history.replaceState(null, '', location.pathname + location.hash);
    if (!this.sitzung) { toast('Bitte zuerst anmelden, dann wird die Zahlung zugeordnet.'); return; }
    try {
      if (z) { const r = await this.api('/api/konto/zahlungsart/pruefen?session=' + encodeURIComponent(z)); this.uebernehmen(r.konto); S.role = 'betrieb'; S.cur = this.id; S._feier = r.n ? 'frei' : ''; nav('abrechnung'); toast(r.n ? nW(r.n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : 'Zahlungsart hinterlegt'); }
      if (ab) { const r = await this.api('/api/konto/plan/pruefen?session=' + encodeURIComponent(ab) + '&plan=' + encodeURIComponent(q.get('plan') || '')); this.uebernehmen(r.konto); S.role = 'betrieb'; S.cur = this.id; S._feier = 'willkommen'; nav('abrechnung'); toast(r.ergebnis.msg); }
    } catch (e) { toast(e.message); }
  },
  async tu(fn) { if (this.laeuft) return; this.laeuft = true; try { return await fn(); } catch (e) { toast(e.message || 'Das hat nicht geklappt.'); } finally { this.laeuft = false; } },
  codeSenden(mail) { return this.tu(async () => { const sh = S.sheet; if (VAL.mail(mail) !== true) { sh.err = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return render(); } await this.api('/api/konto/anmelden', { mail: mail }); sh.schritt = 'code'; sh.mail = mail; sh.err = ''; sh.code = ''; render(); toast('Code ist unterwegs an ' + mail); }); },
  codePruefen(mail, code) { return this.tu(async () => { const sh = S.sheet; let r; try { r = await this.api('/api/konto/bestaetigen', { mail: mail, code: code }); } catch (e) { sh.err = e.message; return render(); } this.merken({ token: r.token, refresh: r.refresh, mail: r.mail }); if (r.konto) { this.uebernehmen(r.konto); S.sheet = null; S.reg = null; login('betrieb', this.id, 'Willkommen zurück, ' + String(r.konto.acc.ap || '').split(' ')[0]); } else { S.sheet = null; S.reg = { role: 'betrieb', path: 'service', step: 1, d: { mail: r.mail }, err: {}, server: true }; go('reg'); toast('Fast geschafft: noch Ihren Betrieb eintragen.'); } }); },
  registrieren(d) { return this.tu(async () => { const r = await this.api('/api/konto/registrieren', { firma: d.firma, ap: d.ap, tel: d.tel, plz: d.plz, col: d.col, agb: !!d.agb }); this.uebernehmen(r.konto); S.reg = null; S._feier = 'willkommen'; login('betrieb', this.id, 'Willkommen, ' + String(d.ap || '').trim().split(' ')[0]); }); },
  abmelden() { this.merken(null); delete S.acc[this.id]; delete S.notif[this.id]; S.myCompanies = (S.myCompanies || []).filter((c) => c.id !== this.id); S.cur = 'c1'; },
  projektAnlegen(n) { return this.tu(async () => { const r = await this.api('/api/konto/projekte', n); this.uebernehmen(r.konto); S.nl = null; S.justCreated = r.id; S._feier = 'projekt'; S.hist = S.hist.filter((h) => h[0] !== 'newlink'); S.screen = 'links'; go('link', r.id); setTimeout(() => { if (S.justCreated === r.id) S.justCreated = null; }, 6000); }); },
  listeAnlegen(text, du) { return this.tu(async () => { const r = await this.api('/api/konto/projekte/liste', { text: text, du: du }); this.uebernehmen(r.konto); S.sheet = null; S.lfilt = 'offen'; S._feier = 'willkommen'; nav('links'); toast(nW(r.n, 'Projekt angelegt', 'Projekte angelegt') + '. Jetzt die Links verschicken.'); }); },
  projekt(id, p) { if (!this.online()) return; this.api('/api/konto/projekte/' + encodeURIComponent(id), p, 'PATCH').then((r) => { this.uebernehmen(r.konto); }).catch((e) => toast(e.message)); },
  konto(p) { if (!this.online()) return; this.api('/api/konto', p, 'PATCH').then((r) => { this.uebernehmen(r.konto); }).catch((e) => toast(e.message)); },
  importieren(code) { return this.tu(async () => { const r = await this.api('/api/konto/import', { code: code }); this.uebernehmen(r.konto); const e = r.eingang; if (!e.ok) { if (e.id) { S.sheet = null; go('link', e.id); } else { const ta = document.getElementById('code-in'); if (ta) { ta.classList.add('bad'); ta.focus(); } } return toast(e.msg); } S.sheet = null; S.justCreated = null; S._feier = e.feier; go('link', e.id); toast(e.msg); }); },
  plan(k) { return this.tu(async () => { const r = await this.api('/api/konto/plan', { plan: k }); if (r.url) { toast('Weiter zu Stripe …'); location.href = r.url; return; } this.uebernehmen(r.konto); render(); toast(r.ergebnis.msg); }); },
  zahlungsart() { return this.tu(async () => { const r = await this.api('/api/konto/zahlungsart', {}); if (r.url) { toast('Weiter zu Stripe …'); location.href = r.url; } }); },
  async aktualisieren() { if (!this.online() || this.laeuft || S.sheet) return; try { const vorher = JSON.stringify(S.acc[this.id]); await this.laden(); if (JSON.stringify(S.acc[this.id]) !== vorher) refresh(); } catch (e) { /* ruhig */ } }
};
/* ---------- Konten ---------- */
function allCompanies() { return BASE_COMPANIES.concat(S.myCompanies || []); }
function comp(id) { return allCompanies().find((c) => c.id === id) || BASE_COMPANIES[0]; }
const A = () => S.acc[S.cur] || S.acc.c1;
const BC = () => comp(S.cur);
const acctId = () => S.cur;
const notifs = () => S.notif[acctId()] || (S.notif[acctId()] = []);
const newNotif = () => (S.role ? notifs().filter((n) => n.new).length : 0);
function notify(id, n) { (S.notif[id] = S.notif[id] || []).unshift(Object.assign({ when: stamp(), new: true }, n)); }
const dot = (t) => (/[.!?]$/.test(t) ? t : t + '.');
const receivedLinks = (a) => (a || A()).links.filter((l) => l.status === 'eingegangen' && !l.demo);
function linkCharge(a) { return ledger(a || A()).filter((b) => b.status === 'offen').reduce((s, b) => s + b.betrag, 0); }
/* ---------- Symbole ---------- */
const CHEV = '<svg class="chev" viewBox="0 0 8 14" aria-hidden="true"><path d="M1.5 1.5L6.5 7l-5 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const I = (d, w) => '<svg viewBox="0 0 24 24" width="' + (w || 22) + '" height="' + (w || 22) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ICONS = {
  home: I('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  list: I('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  people: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 19c.6-3.4 3.3-5 6.5-5s5.9 1.6 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.3c3 0 5.3 1.5 6 4.7"/>'),
  bell: I('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 20c.8-4 4-6 8-6s7.2 2 8 6"/>'),
  card: I('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 14h4"/>'),
  link: I('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  lock: I('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
  check: I('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  swap: I('<path d="M7 7h12l-3-3M17 17H5l3 3"/>'),
  copy: I('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'), dl: I('<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>'),
  mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  sms: I('<path d="M4 5h16v11H9l-5 4z"/>'),
  wa: I('<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>'),
  ext: I('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  play: I('<path d="M8 5l11 7-11 7z"/>'),
  folder: I('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  ruler: I('<path d="M4 16L16 4l4 4L8 20z"/><path d="M8 12l1.5 1.5M11 9l1.5 1.5M14 6l1.5 1.5"/>'),
  frame: I('<rect x="4" y="3" width="16" height="18" rx="1.5"/><rect x="7.5" y="6.5" width="9" height="11"/>'),
  camera: I('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  open: I('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M6.5 6l4 6-4 6M13.5 18l2.5-12 2.5 12"/>'),
  palette: I('<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-1.2-1-1.6-1-2.6 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>'),
  glass: I('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 9l4-4M8 14l9-9M12 19l5-5"/>'),
  shutter: I('<rect x="4" y="3" width="16" height="5" rx="1"/><path d="M5.5 8v12M18.5 8v12M5.5 11.5h13M5.5 15h13M5.5 18.5h13"/>'),
  sill: I('<path d="M6 4h12v12H6zM3 16h18v3.5H3z"/><path d="M12 4v12"/>'),
  nouser: I('<circle cx="10" cy="8" r="4"/><path d="M3 20c.7-3.6 3.6-5.5 7-5.5"/><path d="M15.5 15l5 5M20.5 15l-5 5"/>'),
  filelock: I('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><rect x="9" y="13" width="6" height="5" rx="1"/><path d="M10.5 13v-1.5a1.5 1.5 0 0 1 3 0V13"/>'),
  euro: I('<path d="M17.5 6.5a7 7 0 1 0 0 11M4.5 10.5h9M4.5 13.5h9"/>'),
  logout: I('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>'),
  send: I('<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>'),
  inbox: I('<path d="M4 4h16v16H4z"/><path d="M4 14h4l2 3h4l2-3h4"/>'),
  gift: I('<rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12"/><path d="M12 9c-3 0-5-1.2-5-3a2 2 0 0 1 4-.6C11.5 6.5 12 9 12 9zm0 0c3 0 5-1.2 5-3a2 2 0 0 0-4-.6C12.5 6.5 12 9 12 9z"/>'),
  coin: I('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18"/><circle cx="16.5" cy="15.5" r="1.3"/><path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4H18"/>'),
  pin: I('<path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>'),
  hand: I('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8.5a5.5 5.5 0 0 1-5.5 5.5H11a5 5 0 0 1-4.3-2.4L4.3 13.4A1.4 1.4 0 0 1 6.6 12L8 14"/>'),
  spark: I('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'),
  clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  flag: I('<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>'),
  win: '<svg viewBox="0 0 48 56" aria-hidden="true"><rect x="4" y="4" width="40" height="48" rx="2" fill="#fbfbfa" stroke="#1d1d1f" stroke-width="1.5"/><rect x="9" y="9" width="13" height="38" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1"/><rect x="26" y="9" width="13" height="38" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1"/></svg>'
};
const icon = (k, w) => ICONS[k].replace(/width="22" height="22"/, 'width="' + w + '" height="' + w + '"');
/* Radar: ein Mittelpunkt, Punkte drumherum im richtigen Abstand, optional ein Umkreis */
function sw(label, sub, on, act, v) { return '<div class="sw-row"><span class="t"><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><button type="button" class="switch" role="switch" aria-checked="' + !!on + '" aria-label="' + esc(label) + '" data-act="' + act + '" data-v="' + (v || '') + '"><span></span></button></div>'; }
const seg = (opts, cur, act, cls) => '<div class="seg' + (cls ? ' ' + cls : '') + '" role="tablist">' + opts.map((o) => '<button type="button" role="tab" data-act="' + act + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + esc(o[1]) + (o[2] ? ' <span class="n">' + o[2] + '</span>' : '') + '</button>').join('') + '</div>';
const empty = (title, text, btn, bild) => '<div class="empty">' + (bild ? '<span class="empty-l" data-lottie="' + bild + '" data-loop="1" aria-hidden="true"></span>' : '') + '<b>' + title + '</b><span>' + text + '</span>' + (btn || '') + '</div>';
/* Kennzahl-Kachel mit Farbton und Symbol; Zahlen zählen hoch, Text (z. B. ∞) steht einfach da */
function stat(tone, ico, label, value, sub, fmt) {
  const num = typeof value === 'number';
  return '<div class="stat tone-' + tone + '"><span class="stat-ic">' + icon(ico, 20) + '</span><small>' + esc(label) + '</small><b' + (num ? ' data-count="' + value + '" data-fmt="' + (fmt || 'int') + '"' : '') + '>' + (num ? (fmt === 'eur' ? eur(value) : String(value)) : esc(String(value))) + '</b><span>' + sub + '</span></div>';
}
/* Bis zu drei gezeichnete Fenster, leicht gefächert, der Rest als Zahl */
function winStack(wins, size) {
  const show = wins.slice(0, 3);
  return '<span class="winstack n' + show.length + '">' + show.map((w, i) => '<i style="--k: ' + i + '">' + AW.svg(w, size || 40) + '</i>').join('') + (wins.length > 3 ? '<em>+' + (wins.length - 3) + '</em>' : '') + '</span>';
}
/* Fortschrittsring: k von n */
function ring(k, n) {
  const r = 17, c = 2 * Math.PI * r, p = n ? Math.min(1, k / n) : 0;
  return '<span class="pring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="' + r + '"/><circle class="val" cx="22" cy="22" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p)).toFixed(1) + '"/></svg><b>' + k + '<small>/' + n + '</small></b></span>';
}
/* Vier Schrittpunkte: gesendet, geöffnet, misst, eingegangen */
function stepDots(l) {
  const idx = LORDER.indexOf(l.status), done = l.status === 'eingegangen', dead = ['abgelaufen', 'deaktiviert'].includes(l.status);
  return '<span class="pstep' + (dead ? ' dead' : '') + '">' + LORDER.slice(1).map((st, i) => { const j = i + 1; return '<i class="' + (done || j < idx ? 'done' : j === idx ? 'now' : '') + '" title="' + TLS[st] + '"></i>'; }).join('') + '</span>';
}
/* ---------- Navigation ---------- */
function go(screen, sel) { if (S.screen !== screen || S.sel !== sel) { S.hist.push([S.screen, S.sel]); if (S.hist.length > 25) S.hist.shift(); } S.screen = screen; if (sel !== undefined) S.sel = sel; S.sheet = null; render(); window.scrollTo(0, 0); }
function nav(screen, sel) { S.hist = []; S.screen = screen; if (sel !== undefined) S.sel = sel; S.sheet = null; render(); window.scrollTo(0, 0); }
function back() { if (S.screen === 'reg' && S.reg && S.reg.step > firstStep(S.reg)) { S.reg.err = {}; S.reg.step--; S.animNext = true; render(); window.scrollTo(0, 0); return; } const h = S.hist.pop(); if (!h) return nav(S.role && PARENT[S.screen] ? PARENT[S.screen] : home()); S.screen = h[0]; S.sel = h[1]; S.sheet = null; render(); window.scrollTo(0, 0); }
function home() { return S.role ? 'links' : 'landing'; }
function login(role, id, msg) { S.role = 'betrieb'; S.cur = id; S.sheet = null; S.reg = null; nav(home()); toast(msg || ('Angemeldet als ' + BC().name)); }
let pendingRefresh = false;
function refresh() { const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && document.getElementById('app').contains(a)) { pendingRefresh = true; return; } render(); }
document.addEventListener('focusout', () => { if (!pendingRefresh) return; setTimeout(() => { const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return; pendingRefresh = false; render(); }, 50); });
function toast(t) { let el = document.getElementById('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = t; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600); }
function later(ms, fn) { setTimeout(() => { fn(); save(); refresh(); }, ms); }
/* ---------- Rahmen ---------- */
function navItems() { return [['links', 'Projekte', 'folder'], ['notif', 'Nachrichten', 'bell'], ['abrechnung', 'Abrechnung', 'card'], ['bprofil', 'Betrieb', 'user']]; }
const PARENT = { newlink: 'links', link: 'links', preise: 'abrechnung' };
function navCount(k) {
  if (k === 'notif') return newNotif();
  if (k === 'links') return A().links.filter((l) => l.status === 'eingegangen' && !l.seen).length;
  return 0;
}
function activeNav(k) { const p = PARENT[S.screen]; return S.screen === k || p === k || (S.hist.length && S.hist[0][0] === k && !navItems().some((n) => n[0] === S.screen)); }
const TITLES = { landing: 'Fensterino', reg: 'Registrieren', wie: 'So funktioniert es', preise: 'Preise', notif: 'Nachrichten', links: 'Projekte', newlink: 'Neues Projekt', link: 'Projekt', abrechnung: 'Abrechnung', bprofil: 'Mein Betrieb' };
let lastScreen = null, lastNew = 0, io = null;
const LASTVALS = {};
function render() {
  const root = document.getElementById('app'), role = S.role, out = !role;
  if (out && !['landing', 'reg', 'wie', 'preise'].includes(S.screen)) S.screen = 'landing';
  if (!out && ['landing', 'reg'].includes(S.screen)) S.screen = home();
  const view = (SCREENS[S.screen] || SCREENS.landing)();
  const anim = S.screen !== lastScreen || !!S.animNext; S.animNext = false;
  root.className = 'app' + (out ? ' is-out' : '');
  let h = '';
  if (!out) h += sidebar();
  const canBack = S.hist.length > 0 || (!!role && !!PARENT[S.screen]) || (S.screen === 'reg' && !!S.reg && S.reg.step > 0);
  const backBtn = '<button type="button" class="back" data-act="back" aria-label="Zurück"><svg width="10" height="17" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Zurück</span></button>';
  const logo = '<button type="button" class="logo-s" data-act="nav" data-v="landing"><span class="lm">' + LOGO(32) + '</span><span>Fensterino</span></button>';
  h += '<div class="main"><header class="top">' + (canBack ? backBtn : out ? logo : '') + '<h1>' + esc(out && S.screen === 'landing' ? '' : view.title || TITLES[S.screen] || '') + '</h1>';
  if (out) h += '<a class="btn small ghost hide-s" href="' + APP_OPEN + '">Zur App</a>' + (S.screen !== 'preise' ? '<button type="button" class="btn small ghost hide-s" data-act="go" data-v="preise">Preise</button>' : '') + '<button type="button" class="btn small ghost" data-act="sheet" data-v="login">Anmelden</button>' + (S.screen !== 'reg' ? '<button type="button" class="btn small primary" data-act="reg" data-v="betrieb"><span class="hide-s">Für Betriebe starten</span><span class="only-xs">Starten</span></button>' : '');
  else h += '<button type="button" class="btn small soft only-s demo-top" aria-label="Demo-Ansicht wechseln" data-act="sheet" data-v="demo">' + icon('swap', 16) + 'Demo</button><button type="button" class="ibtn" aria-label="Nachrichten" data-act="nav" data-v="notif">' + ICONS.bell + (newNotif() ? '<span class="dot"></span>' : '') + '</button>';
  h += '</header><div class="scr' + (anim ? ' anim' : '') + '" data-screen="' + S.screen + '">' + view.html + '</div>' + (out ? footer() : '') + '</div>';
  if (!out) h += '<nav class="tabs" aria-label="Bereiche">' + navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + '<span>' + esc(n[1]) + '</span>' + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>';
  if (S.sheet && SHEETS[S.sheet.k]) h += '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="sheet-close"></button><div class="sheet" role="dialog" aria-modal="true"><span class="grip"></span><button type="button" class="xclose" aria-label="Schließen" data-act="sheet-close">×</button>' + SHEETS[S.sheet.k](S.sheet) + '</div>';
  root.innerHTML = h;
  afterRender(anim);
  lastScreen = S.screen;
  save();
}
function sidebar() {
  const me = { n: BC().name, s: X.planName(X.konto(A())) + (Server.online() ? '' : ' · Demo'), col: BC().col };
  return '<aside class="side"><button type="button" class="logo" data-act="nav" data-v="' + home() + '"><span class="lm">' + LOGO(36) + '</span><span>Fensterino<small>für Betriebe</small></span></button><nav class="nav">' +
    navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + esc(n[1]) + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>' +
    '<div class="me"><span class="av" style="background: ' + me.col + '">' + esc(me.n.slice(0, 1)) + '</span><span class="me-t"><b>' + esc(me.n) + '</b><small>' + esc(me.s) + '</small></span><button type="button" class="ibtn out" data-act="logout" aria-label="Abmelden" title="Abmelden">' + icon('logout', 19) + '</button></div><button type="button" class="btn small soft demo-side" data-act="sheet" data-v="demo">' + icon('swap', 17) + 'Demo-Ansicht wechseln</button></aside>';
}
function footer() {
  return '<footer class="foot"><div class="wrap"><div class="row between"><span class="lm-foot">' + LOGO(22) + ' Fensterino</span><div class="row foot-links"><button type="button" data-act="go" data-v="wie">So funktioniert es</button><button type="button" data-act="go" data-v="preise">Preise</button><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a><button type="button" data-act="sheet" data-v="legal" data-id="agb">AGB</button></div></div>' + (Server.an ? '<p>Ihre Projekte und Aufmaße liegen auf unserem Server; Zahlungen laufen über Stripe. Die Demo-Betriebe sind Beispiele im Browser.</p>' : '<p>Pilotphase. Die Betriebe und Projekte hier sind Beispiele, es wird nichts berechnet. Echt funktionieren schon Aufmaß-Links, der Code-Eingang, Nachbesserungen und der PDF-Export; alles bleibt in Ihrem Browser.</p>') + '</div></footer>';
}
/* ---------- Nach dem Rendern: Bewegung ---------- */
function afterRender(anim) {
  if (S.screen === 'link' && window.Blatt) window.Blatt.schrift();
  if (window.Lottie) window.Lottie.auf(document.body);
  /* Startseitenkarte dreht sich leicht mit dem Scrollen */
  const b2c = document.querySelector('.b2c-win'); if (b2c && window.Scroll) window.Scroll.binden(b2c, (p) => b2c.style.setProperty('--sp', p.toFixed(3)));
  const scr = document.querySelector('.scr');
  if (!scr) return;
  ['.list', '.grid', '.flow', '.form', '.share'].forEach((sel) => scr.querySelectorAll(sel).forEach((p) => Array.from(p.children).forEach((c, i) => c.style.setProperty('--i', String(Math.min(i, 12))))));
  /* Blöcke erscheinen nacheinander: gestaffelt nur, was beim Aufbau schon im Bild ist; was erst beim Scrollen kommt, erscheint sofort */
  const wrap = scr.querySelector('.wrap');
  if (wrap) { let k = 0; Array.from(wrap.children).forEach((c) => { const sichtbar = c.getBoundingClientRect().top < window.innerHeight; c.classList.add('rv'); c.style.setProperty('--i', String(sichtbar ? Math.min(k++, 8) : 0)); }); }
  if (!io && 'IntersectionObserver' in window) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px 48px 0px' });
  scr.querySelectorAll('.rv').forEach((el) => { if (io && anim) io.observe(el); else el.classList.add('in'); });
  scr.querySelectorAll('[data-count]').forEach((el, i) => {
    const key = S.screen + ':' + i, to = +el.getAttribute('data-count'), fmt = el.getAttribute('data-fmt'), from = LASTVALS[key] == null ? 0 : LASTVALS[key];
    LASTVALS[key] = to;
    if (!anim && from === to) return;
    if (anim && io) { el.textContent = fmt === 'eur' ? eur(0) : '0'; const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { countUp(el, 0, to, fmt); o.disconnect(); } })); o.observe(el); return; }
    countUp(el, anim ? 0 : from, to, fmt);
  });
  /* „So läuft es“: Die Bühne zeigt den Schritt, der gerade neben ihr steht (zwei Spalten: der Schritt auf Höhe der Bühnenmitte;
     gestapelt auf dem Telefon: der erste Schritt unter der klebenden Bühne). Wird beim Scrollen nachgeführt, mit etwas Spiel gegen Flackern. */
  const stage = document.getElementById('stage');
  storyTick = null;
  if (stage) {
    const steps = Array.from(scr.querySelectorAll('.story-step'));
    let aktiv = -1;
    const setStep = (i) => { if (aktiv === i) return; aktiv = i; stage.setAttribute('data-step', String(i)); steps.forEach((st) => st.classList.toggle('on', +st.getAttribute('data-i') === i)); };
    storyTick = () => {
      if (!document.body.contains(stage)) { storyTick = null; return; }
      const st = stage.getBoundingClientRect(), gestapelt = matchMedia('(max-width: 879px)').matches;
      const linie = gestapelt ? st.bottom + 60 : st.top + st.height / 2;
      const abstand = steps.map((s) => { const r = s.getBoundingClientRect(); return Math.abs((r.top + r.bottom) / 2 - linie); });
      let best = 0; abstand.forEach((d, i) => { if (d < abstand[best]) best = i; });
      if (aktiv >= 0 && best !== aktiv && abstand[best] > abstand[aktiv] - 16) best = aktiv;
      setStep(best);
    };
    storyTick();
    setTimeout(() => { if (storyTick) storyTick(); }, 400);
  }
  const n = newNotif(), bell = document.querySelector('.top .ibtn:last-child');
  if (bell && n > lastNew) { bell.classList.add('ring'); const d = bell.querySelector('.dot'); if (d) d.classList.add('pop'); }
  lastNew = n;
  /* Rückmeldung am Gegenstand statt Feier: ein Ring um das, was neu ist (Projektkarte, eingegangenes Aufmaß); „gesendet“ lässt einen Ring vom Status auslaufen */
  if (S._feier && window.Feier) {
    const art = S._feier; S._feier = null;
    if (window.Haptik && (art === 'projekt' || art === 'eingang' || art === 'willkommen')) window.Haptik.ok();
    const ziel = art === 'projekt' ? scr.querySelector('.created') : art === 'eingang' ? scr.querySelector('.amhead, .lockcard, .h .badge') : art === 'gesendet' ? scr.querySelector('.h .badge, .tlh li.now') : null;
    if (ziel) setTimeout(() => { if (!document.body.contains(ziel)) return; if (art === 'gesendet') window.Feier.puls(ziel); else window.Feier.markieren(ziel); }, 180);
  }
  if (S._pop) { const q = S._pop; const el = Array.from(document.querySelectorAll('[data-act="' + q.act + '"]')).find((x) => (x.getAttribute('data-v') || '') === q.v && (x.getAttribute('data-k') || '') === q.k); if (el) el.classList.add(el.classList.contains('switch') ? 'just' : 'pop'); S._pop = null; }
  scr.querySelectorAll('.scrollchips').forEach((row) => { const on = row.querySelector('[aria-pressed="true"]'); if (!on) return; const rr = row.getBoundingClientRect(), ro = on.getBoundingClientRect(); if (ro.left < rr.left + 8 || ro.right > rr.right - 8) row.scrollLeft += ro.left - rr.left - 24; });
  if (anim && matchMedia('(max-width: 520px)').matches) scr.querySelectorAll('.sample details').forEach((d) => { d.open = false; });
  if (S.sheet && matchMedia('(hover: hover) and (pointer: fine)').matches) { const f = document.querySelector('.sheet input, .sheet textarea'); if (f && S.sheet.k !== 'demo') setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 80); }
  if (S._focusErr) { const f = document.querySelector('.f.has-err input, .f.has-err select, .f.has-err .chips button, .agree.has-err input'); if (f) { try { f.focus({ preventScroll: false }); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { /* ok */ } } S._focusErr = false; }
}
function countUp(el, from, to, fmt) {
  const t0 = performance.now(), dur = 750, f = (v) => (fmt === 'eur' ? eur(v) : String(Math.round(v)));
  const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = f(from + (to - from) * e); if (k < 1 && document.body.contains(el)) requestAnimationFrame(step); else el.textContent = f(to); };
  requestAnimationFrame(step);
}
let storyTick = null;
window.addEventListener('resize', () => { if (storyTick) storyTick(); });
window.addEventListener('scroll', () => {
  if (storyTick) storyTick();
  const t = document.querySelector('.top'); if (t) t.classList.toggle('scrolled', window.scrollY > 6);
  document.querySelectorAll('.rv:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.94) el.classList.add('in'); });
}, { passive: true });
/* ---------- Bildschirme: Besucher ---------- */
const SCREENS = {};
const CAPS = [
  ['ruler', 'Maueröffnung', 'Drei Breiten und drei Höhen, das kleinste Maß zählt. Abweichungen außer Winkel werden markiert.'],
  ['frame', 'Fensterelement', 'Breite und Höhe des alten Fensters mit Rahmen, dazu Brüstungshöhe und Laibungstiefe.'],
  ['camera', 'Fotos innen und außen', 'Die KI liest Material, Zustand, Rollladenkasten, Fensterbank, Heizkörper und Fassade.'],
  ['open', 'Teilung und Öffnung', 'Flügel, Dreh, Kipp oder fest, DIN links oder rechts, Oberlicht und Sonderformen.'],
  ['palette', 'Material und Farbe', 'Kunststoff, Holz, Holz-Alu oder Aluminium. Farbe innen und außen nach RAL oder Dekor.'],
  ['glass', 'Glas und Sprossen', '2- oder 3-fach, Schallschutz, Sicherheits- und Ornamentglas, Sprossenart und Lage.'],
  ['shutter', 'Rollladen und Insektenschutz', 'Aufsatz oder Vorbau, Antrieb von Gurt bis Smart Home, Spann- oder Drehrahmen.'],
  ['sill', 'Fensterbank und Montage', 'Innen und außen, Ausbau und Entsorgung, RAL-Montage, Putzarbeiten an der Laibung.']
];
function heroPhone() {
  return '<div class="phone hero-ph" aria-hidden="true"><div class="ph-top"><span class="ph-av">B</span><span><b>Fensterbau Brandt</b><small>WhatsApp</small></span></div><div class="ph-body">' +
    '<div class="bub out b1">Guten Tag Familie Weber, für Ihr Fensterangebot brauchen wir die Maße Ihrer Fenster. Mit diesem Link messen Sie selbst, Schritt für Schritt erklärt:<span class="lp"><b>Fensterino · Aufmaß für Fensterbau Brandt</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span><i>09:13 ✓✓</i></div>' +
    '<div class="bub in b2">Super, machen wir heute Abend.<i>09:20</i></div>' +
    '<div class="ph-note b3"><span class="ph-dot"></span><span><b>Aufmaß eingegangen</b><small>Familie Weber · 4 Positionen, 8 Fotos</small></span></div></div></div>';
}
function storyScenes() {
  const win = '<svg viewBox="0 0 320 300" aria-hidden="true"><rect x="60" y="30" width="200" height="220" rx="3" fill="#fbfbfa" stroke="#1d1d1f" stroke-width="2"></rect><rect x="72" y="42" width="84" height="196" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1.2"></rect><rect x="164" y="42" width="84" height="196" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1.2"></rect><path d="M72 42 L156 140 L72 238 M72 238 L114 42 L156 238" fill="none" stroke="#1d1d1f" stroke-width=".8" opacity=".55"></path><rect x="150" y="128" width="5" height="24" rx="2" fill="#c9c3ba"></rect><rect x="165" y="128" width="5" height="24" rx="2" fill="#c9c3ba"></rect><path class="dim v" d="M34 30 V250 M28 30 H40 M28 250 H40" fill="none" stroke="var(--lead)" stroke-width="2.5" stroke-linecap="round"></path><path class="dim h" d="M60 272 H260 M60 266 V278 M260 266 V278" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"></path><g class="lab"><rect x="4" y="128" width="54" height="22" rx="11" fill="var(--lead)"></rect><text x="31" y="143" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">1.410</text></g><g class="lab h"><rect x="133" y="282" width="54" height="22" rx="11" fill="var(--accent)"></rect><text x="160" y="297" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">1.230</text></g></svg>';
  const w = demoWins('weber');
  return '<div class="sc sc-proj"><span class="pill">1 · Projekt</span><div class="mini form-mini"><p class="eyebrow">Neues Projekt</p><div class="fm"><small>Kunde</small><b class="ty" style="--n: 13">Familie Weber</b></div><div class="fm"><small>Objekt</small><b class="ty" style="--n: 26; --d: .9s">Lindenstraße 14, Köln</b></div><div class="fm-chips"><span class="badge acc">Einfamilienhaus</span><span class="badge acc">3 bis 5 Fenster</span><span class="badge acc">Fenster und Rollläden</span></div><span class="fm-btn">Projekt anlegen</span></div><p class="cap">Kunde, Adresse, grobe Eckdaten. Eine Minute.</p></div>' +
    '<div class="sc sc-msg"><span class="pill">2 · Link</span><div class="phone small"><div class="ph-top"><span class="ph-av">B</span><span><b>Fensterbau Brandt</b><small>WhatsApp</small></span></div><div class="ph-body"><div class="bub out">Guten Tag Familie Weber, mit diesem Link messen Sie Ihre Fenster selbst:<span class="lp"><b>Fensterino · Aufmaß für Fensterbau Brandt</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span><i>09:13 ✓✓</i></div></div></div><p class="cap">Mit Ihrem Namen als Absender. Text vorformuliert.</p></div>' +
    '<div class="sc sc-mess"><span class="pill">3 · Kunde misst</span>' + win + '<p class="cap">Im Browser, ohne Konto. Das Modell wächst beim Tippen.</p></div>' +
    '<div class="sc sc-in"><span class="pill">4 · Eingang</span><div class="mini in-mini"><span class="ring"></span><span class="unlock">' + ICONS.check + ' Aufmaß eingegangen</span><p class="mt">Familie Weber · Köln-Ehrenfeld</p>' + w.slice(0, 2).map((x, i) => { const d = AW.derive(x); return '<div class="in-row">' + AW.svg(x, 34) + '<span><b>Pos. ' + (i + 1) + ' · ' + esc(x.name) + '</b><small>Öffnung ' + AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' · ' + esc(AW.opening(x)) + '</small></span></div>'; }).join('') + '<p class="mf">und 2 weitere Positionen, 8 Fotos, Bestellmaß-Vorschlag</p></div><p class="cap">Sie kalkulieren, bevor Sie losfahren.</p></div>';
}
/* Ein Fenster aus dem Aufmaß: Kopfzeile, Maße, Bestellmaß, Einzelheiten zum Aufklappen */
function posCard(w, i, abzug, open) {
  const d = AW.derive(w), ab = abzug || { seite: 15, oben: 15 }, n = AW.num(w.anzahl) || 1;
  const best = d.moW && d.moH ? AW.th(d.moW - 2 * ab.seite) + ' × ' + AW.th(d.moH - ab.oben) + ' mm' : '–';
  const chips = AW.kiChips(w);
  return '<details class="posc"' + (open ? ' open' : '') + '><summary><span class="pic">' + AW.svg(w, 46) + '</span><span class="pt"><b>Pos. ' + (i + 1) + ' · ' + esc(w.name || 'Fenster') + (n > 1 ? ' · ' + n + ' Stück' : '') + '</b><span>Bestellmaß ' + best + '</span><small>Öffnung ' + AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' · Element ' + AW.th(d.elW) + ' × ' + AW.th(d.elH) + ' mm · ' + esc(AW.opening(w)) + ' · ' + esc(AW.lab('material', w.material) || 'Kunststoff') + ' · ' + esc(AW.lab('etage', w.etage) || 'EG') + '</small></span><span class="pchev" aria-hidden="true"></span></summary>' +
    '<div class="pbody"><div class="best"><span>Bestellmaß-Vorschlag</span><b>' + best + '</b><small>Öffnung minus ' + ab.seite + ' mm je Seite und ' + ab.oben + ' mm oben</small></div><div class="kv">' + AW.rows(w).map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>' +
    (AW.kiRows(w).length ? '<p class="eyebrow pos-h">Aus den Fotos (KI, ' + (w.fotos || 0) + ' Fotos)</p><div class="kv">' + AW.kiRows(w).map((r) => '<span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span>').join('') + '</div>' : chips.length ? '<div class="chips">' + chips.map((c) => '<span class="badge">' + esc(c) + '</span>').join('') + '</div>' : '') + '</div></details>';
}
function roiCalc() {
  const n = S.roi ? S.roi.n : 12, t = S.roi ? S.roi.t : 75, r = S.roi ? S.roi.r : 65, v = roiVals(n, t, r);
  const rng = (k, label, min, max, step, val, out) => '<label class="roi-r"><span>' + label + '<b id="roi-' + k + '-l">' + out + '</b></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-in="roi-' + k + '" aria-label="' + label + '"></label>';
  return '<section class="card roi"><div class="roi-in"><p class="eyebrow">Rechnen Sie nach</p><h3>Was ein Erstaufmaß vor Ort kostet.</h3>' + rng('n', 'Erstaufmaße im Monat', 2, 40, 1, n, String(n)) + rng('t', 'Zeit je Termin mit Fahrt', 30, 150, 5, t, t + ' Min.') + rng('r', 'Kosten je Stunde', 40, 120, 5, r, r + ' €') + '</div>' +
    '<div class="roi-out"><div class="ro"><small>Vor Ort im Monat</small><b id="roi-c" data-count="' + v.cost + '" data-fmt="eur">' + eur(v.cost) + '</b><span id="roi-h">' + v.hours + ' Stunden unterwegs und beim Kunden</span></div><div class="ro hi"><small>Mit Fensterino</small><b id="roi-l" data-count="' + v.lm + '" data-fmt="eur">' + eur(v.lm) + '</b><span id="roi-lp">' + v.plan + '</span></div><p class="roi-note">Annahme: Jedes Erstaufmaß ersetzt einen Termin fürs erste Angebot. Das Feinaufmaß vor der Fertigung bleibt.</p></div></section>';
}
/* Günstigster Tarif für n Projekte im Monat: Start je Projekt, Abo 10 mit Kontingent, Plus unbegrenzt */
function roiVals(n, t, r) {
  const p = P(), hours = Math.round(n * t / 60 * 10) / 10, cost = Math.round(n * t / 60 * r);
  const start = n * p.projekt, abo = p.abo.grund + Math.max(0, n - p.abo.inkl) * p.abo.extra, plus = p.plus;
  const best = Math.min(start, abo, plus);
  return { hours: String(hours).replace('.', ','), cost: cost, lm: best, plan: best === start ? n + ' Projekte × ' + p.projekt + ' € netto (Start)' : best === abo ? 'Abo 10: ' + p.abo.grund + ' € für ' + p.abo.inkl + ' Projekte' + (n > p.abo.inkl ? ' + ' + (n - p.abo.inkl) + ' × ' + p.abo.extra + ' €' : '') : 'Plus, Projekte unbegrenzt' };
}
SCREENS.landing = () => ({ title: 'Fensterino', html: '<div class="wrap">' + (vonPdf() ? '<div class="banner vonpdf"><span><b>Sie halten ein Fensterino-Aufmaß in der Hand?</b> So holen Sie es in Ihr Konto: kostenlos registrieren, dann „Code vom Kunden einfügen“ und den Code von der letzten Seite eintippen oder einfügen. Die ersten 3 Aufmaße sind frei.</span><span class="row"><button type="button" class="btn small primary" data-act="reg" data-v="betrieb">Kostenlos registrieren</button><button type="button" class="btn small ghost" data-act="vonpdf-zu">Später</button></span></div>' : '') +
  '<section class="hero b2c"><div><p class="eyebrow">Für Hauseigentümer · Messen kostenlos</p><h2>' + 'Fenster aufmessen. Selbst. Richtig.'.split(' ').map((w, i) => '<span class="w" style="--i: ' + i + '">' + w + '</span>').join(' ') + '</h2><p class="lead">Zwei Fotos, vier Maße mit dem Zollstock, jeder Schritt erklärt. Aus Ihren Zahlen wächst Ihr Fenster als 3-D-Modell, dazu Ihre Wünsche zu Material, Farbe, Glas und Rollladen. Messen, Fotos und 3-D-Modell sind kostenlos. Am Ende Ihr vollständiges Aufmaßblatt als PDF für ' + eur2(P().aufmass) + ', für jeden Fensterbauer lesbar.</p><div class="cta"><a class="btn big primary" href="' + APP_OPEN + '">Jetzt aufmessen</a><button type="button" class="btn big ghost" data-act="go" data-v="wie">So funktioniert es</button></div><p class="hint">Kein Konto zum Messen · keine App aus dem Store · Ihr Aufmaß gehört Ihnen</p></div>' +
  '<div class="hero-visual b2c-visual">' + b2cVisual() + '</div></section>' +
  '<section class="strip"><div class="st"><b><span data-count="5" data-fmt="int">5</span><small> Min.</small></b><span>je Fenster, Fotos und Wünsche inklusive</span></div><div class="st"><b><span data-count="8" data-fmt="int">8</span><small> Maße</small></b><span>je Fenster von Hand, das kleinste zählt, Abweichungen werden markiert</span></div><div class="st"><b>' + eur2(P().aufmass) + '</b><span>für das fertige Aufmaßblatt als PDF. Messen, Fotos und 3-D-Modell sind kostenlos</span></div></section>' +
  '<section class="sec"><div class="sec-head"><h3>Was im Aufmaß steckt</h3><span class="sub">je Fenster, wie beim Termin vor Ort</span></div><div class="caps">' + CAPS.map((c) => '<div class="cap"><span class="ci">' + icon(c[0], 22) + '</span><b>' + c[1] + '</b><span>' + c[2] + '</span></div>').join('') + '</div></section>' +
  '<section class="hero b2b" id="betriebe"><div><p class="eyebrow">Für Fensterbauer</p><h2>' + 'Aufmaß ohne Anfahrt.'.split(' ').map((w, i) => '<span class="w" style="--i: ' + i + '">' + w + '</span>').join(' ') + '</h2><p class="lead">Schicken Sie Ihren Kunden einen Aufmaß-Link statt hinzufahren. Ihr Kunde misst selbst, Schritt für Schritt geführt, und Sie bekommen alles, was Sie für ein erstes Angebot brauchen: Maße, Fotos, Öffnungsarten, Farben und Ausstattung, für jedes Fenster, sortiert nach Positionen.</p><div class="cta"><button type="button" class="btn big primary" data-act="reg" data-v="betrieb">Kostenlos starten</button><button type="button" class="btn big ghost" data-act="demo-as" data-v="c1">Demo ansehen</button></div><p class="hint">' + P().frei + ' Projekte kostenlos · danach ' + P().projekt + ' € je Projekt oder im Abo · Ihr Kunde braucht kein Konto</p></div>' +
  '<div class="hero-visual">' + heroPhone() + '</div></section>' +
  '<section class="sec"><div class="sec-head"><h3>So läuft es</h3><button type="button" class="linkbtn" data-act="go" data-v="wie">Alle Details ›</button></div><div class="story"><div class="story-steps">' + [['Projekt anlegen', 'Kunde, Adresse und ein paar Eckdaten. Mehr braucht es nicht, in einer Minute erledigt. Oder gleich eine ganze Liste von Kunden einladen.'], ['Link schicken', 'Per WhatsApp, SMS oder E-Mail, mit Ihrem Namen als Absender. Die Nachricht ist vorformuliert.'], ['Ihr Kunde misst', 'Im Browser, ohne Konto und ohne Installation. Zwei Fotos und vier Maße je Fenster, jeder Schritt erklärt.'], ['Aufmaß kommt an', 'Sortiert nach Positionen, mit Bestellmaß-Vorschlag und den Hinweisen aus den Fotos. Passt etwas nicht, fragen Sie eine Nachbesserung an, kostenlos.']].map((st, i) => '<div class="story-step" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><h3>' + st[0] + '</h3><p>' + st[1] + '</p></div>').join('') + '</div><div class="story-stage" data-step="0" id="stage">' + storyScenes() + '</div></div></section>' +
  '<section class="sec"><div class="sec-head"><h3>So kommt es bei Ihnen an</h3><span class="sub">Beispiel, Positionen zum Aufklappen</span></div><div class="card sample"><div class="sample-h"><span class="badge ok">' + icon('check', 12) + 'Aufmaß eingegangen</span><b>Familie Weber · Lindenstraße 14, Köln</b><span class="km-s">4 Positionen · 5 Elemente · 8 Fotos · Einfamilienhaus, Baujahr 1978</span></div>' + demoWins('weber').slice(0, 2).map((w, i) => posCard(w, i, null, i === 0)).join('') + '<p class="km-s">Vor der Fertigung messen Sie einmal nach. Fürs erste Angebot sparen Sie die Anfahrt.</p></div></section>' +
  '<section class="grid c3 trust"><div class="tcard"><span class="ci">' + icon('nouser', 22) + '</span><b>Für Ihren Kunden ohne Hürde</b><p>Er öffnet den Link im Browser und legt los. Kein Konto, keine App aus dem Store, keine Kosten. Seine Angaben gehen nur an Sie.</p></div><div class="tcard"><span class="ci">' + icon('filelock', 22) + '</span><b>Ihr Kunde bleibt Ihr Kunde</b><p>Aufmaße aus Ihren Links landen nur bei Ihnen. Ihr Kunde sieht im Link nur Ihren Betrieb. Eine Kopie mit Maßen bekommt er von Ihnen, mit Ihrem Angebot.</p></div><div class="tcard"><span class="ci">' + icon('euro', 22) + '</span><b>Abgerechnet wird je Projekt</b><p>' + P().frei + ' Projekte kostenlos, danach ' + P().projekt + ' € netto je Projekt mit eingegangenem Aufmaß. Oder im Abo: ' + P().abo.inkl + ' Projekte für ' + P().abo.grund + ' € im Monat, unbegrenzt mit Plus für ' + P().plus + ' €. Nachbesserungen kosten nichts.</p></div></section>' +
  roiCalc() +
  '<section class="owner"><div><p class="eyebrow">Ein Kunde hat Ihnen ein Fensterino-Aufmaß geschickt?</p><h3>Holen Sie es in Ihr Konto.</h3><p>Auf der letzten Seite des Aufmaßblatts steht ein Code. Kostenlos registrieren, „Code vom Kunden einfügen“, und das Aufmaß liegt als Projekt bei Ihnen: mit 3-D-Ansicht, Positionen zum Bearbeiten und Nachbesserung per Link.</p></div><div class="row"><button type="button" class="btn primary" data-act="reg" data-v="betrieb">Kostenlos registrieren</button><button type="button" class="btn ghost" data-act="sheet" data-v="login">Anmelden</button></div></section></div>' });
/* Startbild für Hauseigentümer: ein Fenster mit den vier Maßen, wie in der App */
function b2cVisual() {
  const w = AW.mk({ name: 'Wohnzimmer', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, teilung: '2p', fa: '7016', fi: '9016' });
  return '<div class="b2c-card"><div class="b2c-win">' + AW.svg(w, 220) + '<span class="dim dim-h">1.480 mm</span><span class="dim dim-w">1.370 mm</span><span class="dim dim-eh">1.410 mm</span><span class="dim dim-ew">1.230 mm</span></div><div class="b2c-chips"><span class="badge">Kunststoff, anthrazit</span><span class="badge">2 Flügel Dreh-Kipp</span><span class="badge">3-fach-Glas</span><span class="badge ok">' + icon('check', 12) + 'Alle Maße da</span></div></div>';
}
const FAQ = [
  ['Wie genau ist das Aufmaß?', 'Die App führt durch acht Handmaße je Fenster mit dem Zollstock. Von drei Breiten und drei Höhen zählt das kleinste Maß, Abweichungen außer Winkel werden markiert. Für ein erstes Angebot reicht das; vor der Fertigung misst der Fensterbauer einmal nach.'],
  ['Was braucht mein Kunde?', 'Ein Smartphone mit Kamera und einen Zollstock. Kein Konto, keine App aus dem Store, keine Kosten. Der Link öffnet die App direkt im Browser.'],
  ['Was, wenn der Kunde nicht klarkommt?', 'Jeder Schritt hat eine Erklärung mit Bild, jeder Fachbegriff ein Glossar. Im Projekt sehen Sie, ob der Link geöffnet wurde und wie weit Ihr Kunde ist, und können gezielt nachhaken. Und ist ein Maß falsch, fragen Sie eine Nachbesserung an: Ihr Kunde ändert nur das Nötige und schickt erneut, ohne neue Kosten.'],
  ['Wer sieht die Daten?', 'Nur Sie. Aufmaße aus Ihren Links gehen an keinen anderen Betrieb, und Ihr Kunde sieht im Link nur Ihren Betrieb. Eine Kopie mit Maßen bekommt er von Ihnen, nicht von uns.'],
  ['Was ist mit Kunden, die selbst mit Fensterino messen?', 'Hauseigentümer können die App auch ohne Ihren Link nutzen; das Messen ist kostenlos, ihr Aufmaßblatt kaufen sie für 7,99 €. Es enthält einen Code; schickt ein Kunde es Ihnen, holen Sie es mit „Code vom Kunden einfügen“ in Ihr Konto. Das zählt wie ein eigenes Projekt.'],
  ['Wann zahle ich, und wofür?', 'Nur für Projekte mit eingegangenem Aufmaß, nie für verschickte Links. Die ersten 3 sind kostenlos und brauchen keine Zahlungsart. Danach 9 € netto je Projekt, oder Sie nehmen Abo 10 (49 € im Monat, 10 Projekte inklusive, jedes weitere 5 €) oder Plus (79 €, unbegrenzt). Ohne Zahlungsart bleibt ein neues Aufmaß gesperrt. Abgebucht wird alle zwei Wochen als Sammelrechnung, Abos monatlich. Nachbesserungen im selben Projekt kosten nichts.'],
  ['Kann ich die Daten weiterverarbeiten?', 'Ja: als PDF-Aufmaßblatt mit Bestellmaß-Vorschlag je Position und als Text zum Kopieren. Geplant sind Schnittstellen zu gängiger Fensterbau-Software.']
];
SCREENS.wie = () => ({ html: '<div class="wrap narrow"><div class="h hbild"><div><p class="eyebrow">So funktioniert es</p><h2>Aufmaß ohne Anfahrt, abgerechnet mit Ihnen.</h2><p>Für Fensterbauer, die ihren Kunden ein sauberes Erstaufmaß ermöglichen wollen, ohne selbst hinzufahren.</p></div><span class="hbild-l" data-lottie="messen" data-loop="1" aria-hidden="true"></span></div>' +
  '<div class="card"><p class="eyebrow">Projekt und Aufmaß-Link</p><div class="kv" style="margin-top: 10px"><span>1 · Projekt</span><span>Sie legen ein Projekt an: Kunde, Adresse und grobe Eckdaten wie Gebäude und ungefähre Fensterzahl. Oder Sie laden eine ganze Liste von Kunden auf einmal ein.</span><span>2 · Link</span><span>Sie schicken den Aufmaß-Link per WhatsApp, SMS oder E-Mail. Er gilt für ein Aufmaß und läuft nach 7, 14 oder 30 Tagen ab.</span><span>3 · Aufmaß</span><span>Ihr Kunde öffnet den Link im Browser, ohne Konto und ohne Installation, und misst geführt: Fotos, Maße, Wünsche am 3-D-Modell.</span><span>4 · Eingang</span><span>Das Aufmaß landet in Ihrem Projekt. Kein anderer Betrieb sieht es.</span><span>5 · Nachbesserung</span><span>Fehlt etwas oder stimmt ein Maß nicht, fragen Sie eine Nachbesserung an. Ihr Kunde ändert nur das Nötige und schickt erneut. Kostenlos, bis zu zweimal je Projekt.</span><span>6 · Abrechnung</span><span>Mit Ihnen: 3 Projekte kostenlos, danach 9 € netto je Projekt mit eingegangenem Aufmaß, im Abo 10 Projekte für 49 € im Monat, mit Plus unbegrenzt. Ihr Kunde zahlt nichts.</span><span>7 · Datei</span><span>Ihr Kunde bekommt keine Kopie mit Maßen zum Weiterschicken; möchte er eine, geben Sie ihm das Aufmaßblatt als PDF mit dem Angebot.</span></div></div>' +
  '<div class="card"><p class="eyebrow">Für Hauseigentümer</p><div class="kv" style="margin-top: 10px"><span>Kostenlos messen</span><span>Messen, Fotos, 3-D-Modell und Wünsche sind kostenlos, mit oder ohne Link eines Betriebs. Wer ohne Link misst, kauft sein Aufmaßblatt als PDF für 7,99 €; wer über Ihren Link kommt, zahlt nichts, Sie bekommen das Aufmaß.</span><span>Ohne Konto</span><span>Nichts installieren, nichts anmelden. Alles bleibt auf dem eigenen Gerät, Fotos verlassen es nur für die freiwillige KI-Auswertung.</span><span>Zum Fensterbauer</span><span>Das Aufmaßblatt lässt sich direkt teilen. Auf der letzten Seite steht, wie ein Fensterbauer es in sein Fensterino-Konto holt.</span></div></div>' +
  '<section class="sec"><div class="sec-head"><h3>Häufige Fragen</h3></div><div class="faq">' + FAQ.map((f) => '<details class="fq"><summary>' + esc(f[0]) + '<span class="pchev" aria-hidden="true"></span></summary><p>' + esc(f[1]) + '</p></details>').join('') + '</div></section>' +
  '<div class="row"><button type="button" class="btn primary" data-act="reg" data-v="betrieb">Kostenlos starten</button><button type="button" class="btn ghost" data-act="go" data-v="preise">Preise</button><a class="btn ghost" href="' + APP_OPEN + '">Zur App</a></div></div>' });
SCREENS.preise = () => {
  const p = P(), cur = S.role === 'betrieb' ? X.konto(A()) : '';
  const card = (k, eb, pr, sm, items, btn, hi) => '<div class="price' + (cur === k || (!cur && hi) ? ' hi' : '') + '"><p class="eyebrow">' + eb + (cur === k ? ' · Ihr Tarif' : '') + '</p><span class="p">' + pr + '<small>' + sm + '</small></span><ul>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ul>' + btn + '</div>';
  const btn = (k, l) => (S.role ? (cur === k ? '' : '<button type="button" class="btn ' + (k === 'service' ? 'ghost' : 'primary') + '" data-act="konto" data-v="' + k + '">' + l + '</button>') : '<button type="button" class="btn ' + (k === 'service' ? 'ghost' : 'primary') + '" data-act="reg" data-v="betrieb">' + (k === 'service' ? 'Kostenlos starten' : 'Starten') + '</button>');
  return { html: '<div class="wrap"><div class="h"><p class="eyebrow">Für Fensterbauer</p><h2>Sie zahlen für Projekte, in denen ein Aufmaß ankommt.</h2><p>Einzeln, im Abo oder unbegrenzt. Ihr Kunde zahlt nichts und braucht kein Konto. Monatlich kündbar, alle Preise netto' + (p.mwst ? ' zzgl. MwSt.' : '') + '</p></div>' +
    '<div class="grid c3 pricegrid">' + card('service', 'Start', '0 €', ' Grundgebühr', [p.frei + ' Projekte kostenlos', 'danach ' + p.projekt + ' € je Projekt mit eingegangenem Aufmaß', 'Projekte, Aufmaß-Links, Einladungslisten', 'Nachbesserungen inklusive', 'Zahlungsart erst ab dem ' + (p.frei + 1) + '. Projekt'], btn('service', 'Zu Start wechseln')) +
    card('abo', 'Abo 10', p.abo.grund + ' €', ' im Monat', [p.abo.inkl + ' Projekte im Monat inklusive', 'jedes weitere ' + p.abo.extra + ' €', 'günstiger ab ' + Math.ceil(p.abo.grund / p.projekt) + ' Projekten im Monat', 'Nachbesserungen inklusive', 'monatlich kündbar'], btn('abo', 'Abo 10 starten'), true) +
    card('plus', 'Plus', p.plus + ' €', ' im Monat', ['Projekte unbegrenzt', 'günstiger ab ' + (p.abo.inkl + Math.ceil((p.plus - p.abo.grund) / p.abo.extra)) + ' Projekten im Monat', 'Ihr Logo und Ihre Farbe beim Kunden', 'Team mit Rollen und Statistik', 'monatlich kündbar'], btn('plus', 'Plus starten')) + '</div>' +
    '<div class="grid c2"><div class="card kcost"><span class="ci">' + icon('nouser', 22) + '</span><div><b>Für Ihren Kunden: kostenlos und ohne Konto.</b><p>Er misst über Ihren Link und schickt das Aufmaß an Sie. Eine Kopie mit allen Maßen bekommt er von Ihnen: ein Klick im Projekt, PDF mit dem Angebot. Ihr Kunde bleibt Ihr Kunde.</p></div></div>' +
    '<div class="card kcost"><span class="ci">' + icon('euro', 22) + '</span><div><b>Hauseigentümer ohne Link: ' + eur2(p.aufmass) + ' je Aufmaßblatt.</b><p>Messen, Fotos, 3-D-Modell und Wünsche sind kostenlos. Das fertige Aufmaßblatt als PDF kostet einmalig ' + eur2(p.aufmass) + (p.mwst ? ' inkl. MwSt.' : '') + ', für das ganze Projekt, auch wenn später Fenster dazukommen. Darin steht der Code, mit dem jeder Fensterbauer das Aufmaß in sein Konto holt.</p><a class="btn ghost" href="' + APP_OPEN + '">Zur App</a></div></div></div>' +
    roiCalc() + '</div>' };
};
/* ---------- Registrierung ---------- */
const VAL = {
  mail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()) || 'Bitte eine gültige E-Mail-Adresse eingeben.',
  pw: (v) => String(v || '').length >= 8 || 'Mindestens 8 Zeichen.',
  name: (v) => String(v || '').trim().length >= 2 || 'Bitte ausfüllen.',
  plz: (v) => /^\d{5}$/.test(String(v || '').trim()) || 'Bitte eine fünfstellige Postleitzahl eingeben.',
  tel: (v) => String(v || '').replace(/\D/g, '').length >= 6 || 'Bitte eine Telefonnummer eingeben.',
  telopt: (v) => !v || String(v).replace(/\D/g, '').length >= 6 || 'Bitte eine gültige Nummer eingeben oder das Feld leer lassen.',
  agb: (v) => !!v || 'Bitte zustimmen, sonst kann kein Konto angelegt werden.',
  mailfree: (v) => (VAL.mail(v) === true ? (!S.logins[String(v).trim().toLowerCase()] || 'Zu dieser E-Mail gibt es schon ein Konto. Bitte anmelden.') : VAL.mail(v))
};
function regSteps() { return ['Weg', 'Betrieb', 'Auftritt']; }
const firstStep = () => 1;
function regKey(r) { return (r.step <= 1 ? 'betrieb' : 'service') + ':' + r.step; }
const REQ = { 'betrieb:1': { firma: 'name', ap: 'name', mail: 'mailfree', tel: 'tel', pw: 'pw' }, 'service:2': { plz: 'plz', agb: 'agb' } };
const SAMPLE = { 'betrieb:1': { firma: 'Fensterbau Sommer', ap: 'Jonas Sommer', mail: 'info@fensterbau-sommer.de', tel: '0221 777 88 99', pw: 'fenster2026' }, 'service:2': { plz: '51063', col: '#0b7285', agb: true } };
function regValidate(r) {
  const req = Object.assign({}, REQ[regKey(r)] || {}), err = {};
  if (r.server) { delete req.mail; delete req.pw; }
  Object.keys(req).forEach((f) => { const ok = VAL[req[f]](r.d[f]); if (ok !== true) err[f] = ok; });
  r.err = err; return !Object.keys(err).length;
}
SCREENS.reg = () => {
  const r = S.reg || (S.reg = { role: 'betrieb', path: 'service', step: 1, d: {}, err: {} }), d = r.d, e = r.err || {}, steps = regSteps(r), f0 = firstStep(r);
  const fe = (f) => (e[f] ? '<small class="err" id="e-' + f + '">' + esc(e[f]) + '</small>' : '');
  const inp = (label, f, ph, type, small, auto) => '<div class="f' + (e[f] ? ' has-err' : '') + '"><label for="r-' + f + '">' + label + '</label><input id="r-' + f + '" type="' + (type || 'text') + '" data-in="r:' + f + '" value="' + esc(d[f] || '') + '" placeholder="' + esc(ph || '') + '"' + (auto ? ' autocomplete="' + auto + '"' : '') + (e[f] ? ' aria-invalid="true" aria-describedby="e-' + f + '"' : '') + '>' + fe(f) + (small && !e[f] ? '<small>' + small + '</small>' : '') + '</div>';
  const agree = (text) => '<label class="agree' + (e.agb ? ' has-err' : '') + '"><input type="checkbox" data-in="r:agb"' + (d.agb ? ' checked' : '') + '><span>' + text + '</span></label>' + (e.agb ? '<small class="err">' + esc(e.agb) + '</small>' : '');
  const firmaName = d.firma || 'Ihr Betrieb', col = d.col || '#0071e3';
  let body = '', title = '';
  if (r.step === 1) { title = 'Ihr Betrieb.'; body = inp('Firma', 'firma', 'z. B. Fensterbau Muster GmbH', 'text', 'Steht als Absender in Ihren Aufmaß-Links.', 'organization') + inp('Ansprechpartner', 'ap', 'Vor- und Nachname', 'text', '', 'name') + (r.server ? '<div class="f2"><div class="f"><label>E-Mail</label><input value="' + esc(d.mail || '') + '" disabled><small>Bestätigt. Darüber melden Sie sich an.</small></div>' + inp('Telefon', 'tel', 'z. B. 0221 123456', 'tel', 'Für Rückfragen und als Schutz vor Doppelkonten.', 'tel') + '</div>' : '<div class="f2">' + inp('E-Mail', 'mail', 'buero@beispiel.de', 'email', '', 'email') + inp('Telefon', 'tel', 'z. B. 0221 123456', 'tel', '', 'tel') + '</div>' + inp('Passwort', 'pw', 'mindestens 8 Zeichen', 'password', 'Mindestens 8 Zeichen.', 'new-password')); }
  if (r.step === 2) { title = 'So sieht Ihr Kunde den Link.'; body = dupNote(d) + '<div class="f2">' + inp('Postleitzahl des Betriebs', 'plz', 'z. B. 51063', 'text', 'Für die Rechnung.', 'postal-code') + '<div class="f"><label>Ihre Farbe</label><div class="colors">' + ['#0071e3', '#1f7a3d', '#a85a00', '#6e3fc2', '#0b7285', '#b3261e'].map((c) => '<button type="button" class="col" data-act="reg-set" data-k="col" data-v="' + c + '" style="background: ' + c + '" aria-label="Farbe ' + c + '" aria-pressed="' + (col === c) + '"></button>').join('') + '</div></div></div><div class="preview"><p class="eyebrow">Erster Bildschirm beim Kunden</p><div class="pv-card"><span class="av" style="background: ' + col + '">' + esc(firmaName.replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase() || 'F') + '</span><span><small>Persönliche Anfrage von</small><b>' + esc(firmaName) + '</b></span></div><p class="pv-t">Deine Fenster. Deine Maße.</p><small class="pv-s">' + esc(firmaName) + ' braucht für dein Angebot die Maße deiner Fenster. Etwa fünf Minuten pro Fenster, jeder Schritt erklärt.</small></div>' + agree('Ich akzeptiere die <button type="button" class="ulink" data-act="sheet" data-v="legal" data-id="agb">Nutzungsbedingungen für Betriebe</button>. Aufmaße meiner Kunden nutze ich nur für deren Projekt.'); }
  const total = steps.length - f0, pos = r.step - f0 + 1, last = r.step === steps.length - 1, canFill = !!SAMPLE[regKey(r)];
  return { title: 'Konto für Fensterbauer', html: '<div class="wrap narrow"><div class="stepbar"><span style="width: ' + (pos / total * 100) + '%"></span></div><div class="h"><p class="eyebrow">Schritt ' + pos + ' von ' + total + ' · ' + steps[r.step] + '</p><h2>' + title + '</h2>' + (canFill ? '<button type="button" class="fillbtn" data-act="reg-fill">' + icon('play', 13) + 'Nur testen? Beispieldaten einsetzen</button>' : '') + '</div><form class="form" data-form="reg" novalidate>' + body + '</form>' + (Object.keys(e).length ? '<p class="err-sum" role="alert">Bitte die markierten Felder prüfen.</p>' : '') + '<div class="row between formnav"><button type="button" class="btn ghost" data-act="reg-prev">' + (r.step > f0 ? 'Zurück' : 'Abbrechen') + '</button><button type="button" class="btn primary" data-act="reg-next">' + (last ? 'Konto anlegen' : 'Weiter') + '</button></div>' + (r.step === f0 ? '<p class="sub center">Schon ein Konto? <button type="button" class="ulink" data-act="sheet" data-v="login">Anmelden</button> · Hauseigentümer? <a class="ulink" href="' + APP_OPEN + '">Zur App, ohne Konto</a></p>' : '') + '</div>' };
};
function regFinish() {
  const r = S.reg, d = r.d, mail = String(d.mail).trim().toLowerCase();
  if (r.server) return Server.registrieren(d);
  const id = 'u' + Date.now().toString(36), plz = String(d.plz || '50667').trim();
  S.myCompanies.push({ id: id, plan: 'service', name: d.firma.trim(), plz: plz, since: new Date().getFullYear(), col: d.col || '#0071e3' });
  const dup = sameCompany(d);
  S.acc[id] = { plan: 'service', konto: 'service', ap: d.ap.trim(), mail: mail, tel: d.tel, abzug: { seite: 15, oben: 15 }, prefs: { mail: true, remind: true }, rechnungen: [], links: [], book: [], freeUsed: 0 };
  if (dup) { S.acc[id].freeQuota = 0; S.acc[id].dupOf = dup; }
  S.logins[mail] = { role: 'betrieb', id: id };
  S.notif[id] = [{ t: 'Willkommen bei Fensterino', s: dup ? 'Für ' + dup + ' gibt es schon ein Konto, die kostenlosen Projekte wurden dort genutzt. Ab dem ersten Aufmaß brauchen Sie eine Zahlungsart.' : 'Legen Sie Ihr erstes Projekt an oder laden Sie gleich mehrere Kunden ein. Die ersten ' + P().frei + ' Projekte sind kostenlos.', when: stamp(), new: true, to: ['links'] }];
  S.reg = null; S._feier = 'willkommen';
  return login('betrieb', id, 'Willkommen, ' + d.ap.trim().split(' ')[0]);
}

SCREENS.notif = () => {
  const list = notifs();
  return { html: '<div class="wrap narrow"><div class="h"><h2>Nachrichten.</h2></div><div class="list">' + (list.length ? list.map((n, i) => '<button type="button" class="item nitem' + (n.new ? ' is-new' : '') + '" data-act="notif-open" data-i="' + i + '"><span class="ic">' + icon('bell', 22) + '</span><span class="tx"><span class="ti">' + esc(n.t) + '</span><span class="di">' + esc(n.s) + '</span><span class="me">' + esc(n.when) + '</span></span>' + (n.new ? '<span class="badge lead">neu</span>' : '') + (n.to ? CHEV : '') + '</button>').join('') : empty('Keine Nachrichten.', 'Hier landet alles, was passiert: geöffnete Links, eingegangene Aufmaße, Nachbesserungen.', '', 'eingang')) + '</div>' + (list.some((n) => n.new) ? '<div><button type="button" class="btn ghost" data-act="read-all">Alle als gelesen markieren</button></div>' : '') + '</div>' };
};
/* ---------- Bildschirme: Fensterbauer ---------- */
/* Jemand kommt über die PDF eines Kunden (QR-Code): ein Hinweis, der direkt zum Ziel führt */
function vonPdf() {
  try { return /[?&]von=pdf/.test(location.search) && !sessionStorage.getItem('aufmass.vonpdf.zu'); } catch (e) { return false; }
}
function banners() {
  let h = '';
  if (vonPdf() && S.role === 'betrieb') h += '<div class="banner vonpdf"><span><b>Sie halten ein Fensterino-Aufmaß in der Hand?</b> Den Code von der letzten Seite hier einfügen, dann liegt es als Projekt bei Ihnen.</span><span class="row"><button type="button" class="btn small primary" data-act="sheet" data-v="linkimport">Code vom Kunden einfügen</button><button type="button" class="btn small ghost" data-act="vonpdf-zu">Später</button></span></div>';
  return h;
}
/* ---------- Bildschirme: Projekte und Aufmaß-Links ---------- */
const LST = { erstellt: ['Angelegt', ''], gesendet: ['Link gesendet', 'acc'], geoeffnet: ['Link geöffnet', 'warn'], arbeit: ['Kunde misst', 'warn'], eingegangen: ['Aufmaß da', 'ok'], abgelaufen: ['Abgelaufen', 'bad'], deaktiviert: ['Deaktiviert', 'bad'] };
const TL = { erstellt: 'Projekt angelegt', gesendet: 'Link gesendet', geoeffnet: 'Link geöffnet', arbeit: 'Kunde misst', eingegangen: 'Aufmaß eingegangen' };
const TLS = { erstellt: 'Angelegt', gesendet: 'Gesendet', geoeffnet: 'Geöffnet', arbeit: 'Kunde misst', eingegangen: 'Eingegangen' };
const LORDER = ['erstellt', 'gesendet', 'geoeffnet', 'arbeit', 'eingegangen'];
const PGEB = { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Wohnung', gewerbe: 'Gewerbe' };
const PFZ = ['1 bis 2', '3 bis 5', '6 bis 10', 'mehr als 10'];
const PPLAN = ['Fenster', 'Haustür', 'Rollläden', 'Insektenschutz', 'Fensterbänke'];
const linkHash = (l) => '#k-' + l.code + '-' + slug(BC().name) + '.' + b64u(BC().name) + '.' + b64u(l.kunde || '') + (l.nb && l.nb.offen ? '~' + l.nb.runde : '');
const linkURL = (l) => APP_URL + linkHash(l);
const linkOpen = (l) => APP_OPEN + linkHash(l);
function linkMsg(l) {
  if (l.msg) return l.msg;
  const a = A(), c = BC(), u = linkURL(l), who = l.kunde || '', fam = /^Familie\s/i.test(who);
  if (l.nb && l.nb.offen) { const hin = l.nb.hinweis ? ' Konkret: ' + l.nb.hinweis : ''; return (l.du ? 'Hallo ' + who + ', danke für dein Aufmaß! Eine Kleinigkeit müssten wir noch einmal prüfen.' + hin + ' Über diesen Link kannst du es ändern und erneut abschicken, deine bisherigen Angaben bleiben erhalten:\n' : 'Guten Tag ' + who + ', danke für Ihr Aufmaß! Eine Kleinigkeit müssten wir noch einmal prüfen.' + hin + ' Über diesen Link können Sie es ändern und erneut abschicken, Ihre bisherigen Angaben bleiben erhalten:\n') + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name; }
  if (l.du && fam) return 'Hallo ' + who + ', für euer Fensterangebot brauche ich die Maße eurer Fenster. Mit diesem Link messt ihr sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto braucht ihr nicht:\n' + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name;
  if (l.du) return 'Hallo ' + who + ', für dein Fensterangebot brauche ich die Maße deiner Fenster. Mit diesem Link misst du sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto brauchst du nicht:\n' + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name;
  return 'Guten Tag ' + who + ', für Ihr Fensterangebot brauchen wir die Maße Ihrer Fenster. Mit diesem Link messen Sie sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto brauchen Sie nicht:\n' + u + '\n\nViele Grüße\n' + a.ap + ', ' + c.name;
}
const isPhone = (s) => !/@/.test(s || '') && String(s || '').replace(/\D/g, '').length >= 7;
const intl = (s) => { let d = String(s || '').replace(/\D/g, ''); if (d.startsWith('00')) d = d.slice(2); else if (d.startsWith('0')) d = '49' + d.slice(1); return d; };
const placeOf = (l) => { const t = String(l.adresse || ''), m = /\d{5}\s+(.+)$/.exec(t); return m ? m[1] : t.split(',').pop().trim(); };
const projFacts = (l) => [PGEB[l.geb], l.fz ? 'ca. ' + l.fz + ' Fenster' : '', (l.plan || []).join(', ')].filter(Boolean).join(' · ');
function projCard(l) {
  const dead = ['abgelaufen', 'deaktiviert'].includes(l.status), done = l.status === 'eingegangen', m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : (LST[l.status] || LST.erstellt), wins = done && l.aufmass ? l.aufmass.windows : [];
  const bis = parseDE(l.expires), restT = bis ? Math.max(0, Math.ceil((bis - Date.now()) / 864e5)) : 0;
  const vis = done && wins.length ? winStack(wins, 40) : l.status === 'arbeit' ? ring(l.progress, 4) : '<span class="pini ' + l.status + '">' + icon(dead ? 'lock' : l.status === 'erstellt' ? 'link' : l.status === 'geoeffnet' ? 'open' : 'send', 26) + (['gesendet', 'geoeffnet'].includes(l.status) ? '<i class="live"></i>' : '') + '</span>';
  const small = l.status === 'arbeit' ? l.progress + ' von 4 Maßen' : done ? (l.nb && l.nb.offen ? 'Nachbesserung angefragt' : ((l.runde || 1) > 1 ? 'nachgebessert · ' : '') + ((l.log || {}).eingegangen || '')) : dead ? '' : ['gesendet', 'geoeffnet'].includes(l.status) && l.via ? 'über ' + esc(l.via) : 'Link noch nicht verschickt';
  const right = done ? '<span class="rt"><b>' + nW(wins.length || (l.aufmass ? l.aufmass.windows.length : 0), 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : dead ? '<span class="rt"><span class="badge bad">' + m[0] + '</span></span>' : '<span class="rt"><b>' + (restT ? nW(restT, 'Tag', 'Tage') : 'heute') + '</b><small>Link gültig</small></span>';
  return '<button type="button" class="item pcard st-' + (l.locked ? 'locked' : l.status) + (done && !l.seen ? ' is-new' : '') + '" data-act="go" data-v="link" data-id="' + l.id + '">' + (done && !l.seen ? '<span class="neu">Neu</span>' : '') + '<span class="pvis">' + vis + '</span><span class="tx"><span class="ti">' + esc(l.kunde) + (l.demo ? ' <span class="badge">Beispiel</span>' : '') + '</span><span class="di">' + esc([placeOf(l), l.fz ? 'ca. ' + l.fz + ' Fenster' : '', l.nr].filter(Boolean).join(' · ')) + '</span><span class="row lst">' + stepDots(l) + '<span class="badge ' + m[1] + '">' + m[0] + '</span>' + (small ? '<small class="me">' + small + '</small>' : '') + '</span>' + (done ? '<span class="rt-m"><b>' + nW(wins.length || (l.aufmass ? l.aufmass.windows.length : 0), 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : dead ? '' : '<span class="rt-m"><small class="me">Link noch ' + (restT ? nW(restT, 'Tag', 'Tage') : 'heute') + ' gültig</small></span>') + '</span>' + right + CHEV + '</button>';
}
function linkItem(l) {
  const m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : (LST[l.status] || LST.erstellt), prog = l.status === 'arbeit' ? '<span class="mprog"><span style="width: ' + (l.progress / 4 * 100) + '%"></span></span><small>' + l.progress + ' von 4 Maßen</small>' : '';
  const right = l.status === 'eingegangen' && l.aufmass ? '<span class="rt"><b>' + nW(l.aufmass.windows.length, 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : ['gesendet', 'geoeffnet'].includes(l.status) && l.via ? '<span class="rt"><span class="badge">' + esc(l.via) + '</span></span>' : '';
  return '<button type="button" class="item litem' + (l.status === 'eingegangen' && !l.seen ? ' is-new' : '') + '" data-act="go" data-v="link" data-id="' + l.id + '"><span class="ic av" style="background: ' + (l.status === 'eingegangen' ? 'var(--ok)' : 'var(--surface2)') + '; color: ' + (l.status === 'eingegangen' ? '#fff' : 'var(--fg2)') + '">' + esc((l.kunde || '?').replace(/^(Beispiel:\s*)?(Herr|Frau|Familie)\s+/, '').slice(0, 1)) + '</span><span class="tx"><span class="ti">' + esc(l.kunde) + (l.demo ? ' <span class="badge">Beispiel</span>' : '') + '</span><span class="di">' + esc([placeOf(l), l.fz ? 'ca. ' + l.fz + ' Fenster' : '', l.nr].filter(Boolean).join(' · ')) + '</span><span class="row lst"><span class="badge ' + m[1] + '">' + m[0] + '</span>' + prog + '</span></span>' + right + CHEV + '</button>';
}
SCREENS.links = () => {
  const a = A(), L = a.links, open = L.filter((l) => ['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)), rec = L.filter((l) => l.status === 'eingegangen');
  const shown = S.lfilt === 'offen' ? open : S.lfilt === 'eingegangen' ? rec : L, order = (l) => ({ eingegangen: l.seen ? 2 : 0, arbeit: 1, geoeffnet: 1, gesendet: 3, erstellt: 3 }[l.status] || 4);
  if (!L.length) return { html: '<div class="wrap narrow">' + banners() + payBanner() + '<div class="h"><p class="eyebrow">' + esc(BC().name) + '</p><h2>Ihr erstes Projekt.</h2><p>Für einen Kunden, den Sie schon haben: Projekt anlegen, Aufmaß-Link schicken, und das Aufmaß kommt zu Ihnen zurück.</p></div>' +
    '<div class="card hero-link"><div class="hl-steps"><div><span class="n">1</span><b>Projekt anlegen</b><small>Kunde und ein paar Eckdaten.</small></div><div><span class="n">2</span><b>Link schicken</b><small>WhatsApp, SMS oder E-Mail.</small></div><div><span class="n">3</span><b>Aufmaß bekommen</b><small>Maße, Fotos und Wünsche je Fenster.</small></div></div><div class="row"><button type="button" class="btn primary big" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Erstes Projekt anlegen</button><button type="button" class="btn ghost big" data-act="sheet" data-v="liste">Mehrere Kunden einladen</button><button type="button" class="btn ghost big" data-act="demo-project">Beispiel ansehen</button></div><p class="km-s">' + kontingentText(a) + ' Ihr Kunde zahlt nichts.</p></div></div>' };
  return { html: '<div class="wrap">' + banners() + payBanner() + '<div class="h hrow"><div><p class="eyebrow">' + esc(BC().name) + '</p><h2>Projekte.</h2><p>Ein Projekt je Kunde. Den Aufmaß-Link schicken Sie direkt aus dem Projekt.</p></div><span class="row"><button type="button" class="btn ghost big" data-act="sheet" data-v="liste">' + icon('people', 18) + 'Liste einladen</button><button type="button" class="btn primary big" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Neues Projekt</button></span></div>' +
    '<div class="grid c3 stats">' + stat('warn', 'send', 'Offen', open.length, open.length ? 'Link verschickt, Kunde misst noch' : 'alle Links sind erledigt') + stat('ok', 'inbox', 'Eingegangen', rec.length, rec.reduce((s, l) => s + (l.aufmass ? l.aufmass.windows.length : 0), 0) + ' Positionen mit Fotos') + kontingentStat(a) + '</div>' +
    '<div class="row between">' + seg([['alle', 'Alle', L.length], ['offen', 'Offen', open.length], ['eingegangen', 'Eingegangen', rec.length]], S.lfilt, 'lfilt', 'fit') + '<button type="button" class="btn ghost" data-act="sheet" data-v="linkimport">Code vom Kunden einfügen</button></div>' +
    '<div class="list plist">' + (shown.length ? shown.slice().sort((x, y) => order(x) - order(y)).map(projCard).join('') : empty(S.lfilt === 'eingegangen' ? 'Noch nichts eingegangen.' : 'Keine offenen Projekte.', S.lfilt === 'eingegangen' ? 'Sobald ein Kunde sein Aufmaß abschickt, steht es hier.' : 'Alle verschickten Links sind erledigt.', '', 'eingang')) + '</div></div>' };
};
SCREENS.newlink = () => {
  const n = S.nl || (S.nl = { step: 0, kunde: '', kontakt: '', adresse: '', geb: '', fz: '', plan: ['Fenster'], note: '', days: 14, du: false, err: {} }), e = n.err || {}, c = BC(), a = A(), st = n.step || 0;
  const fake = { kunde: n.kunde || 'Familie Weber', code: 'xxxxx', du: n.du };
  const one = (k, v, label) => '<button type="button" class="chip small" data-act="nl-set" data-k="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (n[k] === v) + '">' + esc(label) + '</button>';
  let body, nav;
  if (!st) {
    body = '<div class="f' + (e.kunde ? ' has-err' : '') + '"><label for="nl-kunde">Name des Kunden</label><input id="nl-kunde" data-in="nl:kunde" value="' + esc(n.kunde) + '" placeholder="z. B. Familie Weber" autocomplete="off">' + (e.kunde ? '<small class="err">' + esc(e.kunde) + '</small>' : '<small>Steht als Anrede in der Nachricht.</small>') + '</div>' +
      '<div class="f"><label for="nl-kontakt">Handynummer oder E-Mail</label><input id="nl-kontakt" data-in="nl:kontakt" value="' + esc(n.kontakt) + '" placeholder="z. B. 0171 2345678" autocomplete="off"><small>Freiwillig. Dann geht der Link gleich per WhatsApp, SMS oder E-Mail raus.</small></div>' +
      '<div class="f"><label>Anrede in der Nachricht</label>' + seg([['sie', 'Sie'], ['du', 'Du']], n.du ? 'du' : 'sie', 'nl-du') + '</div>';
    nav = '<div class="row between formnav"><button type="button" class="btn ghost" data-act="back">Abbrechen</button><button type="button" class="btn primary" data-act="nl-next">Weiter</button></div>';
  } else {
    body = '<div class="f"><label for="nl-adresse">Objektadresse</label><input id="nl-adresse" data-in="nl:adresse" value="' + esc(n.adresse) + '" placeholder="z. B. Lindenstraße 14, 50823 Köln" autocomplete="off"></div>' +
      '<div class="f"><label>Gebäude</label><div class="chips">' + Object.keys(PGEB).map((k) => one('geb', k, PGEB[k])).join('') + '</div></div>' +
      '<div class="f"><label>Wie viele Fenster ungefähr?</label><div class="chips">' + PFZ.map((v) => one('fz', v, v)).join('') + '</div></div>' +
      '<div class="f"><label>Was ist geplant?</label><div class="chips">' + PPLAN.map((v) => '<button type="button" class="chip small" data-act="nl-plan" data-v="' + v + '" aria-pressed="' + ((n.plan || []).indexOf(v) >= 0) + '">' + v + '</button>').join('') + '</div></div>';
    nav = '<div class="row between formnav"><button type="button" class="btn ghost" data-act="nl-prev">Zurück</button><button type="button" class="btn primary" data-act="nl-create">' + icon('link', 18) + 'Projekt anlegen</button></div><p class="km-s">Bezahlt wird nur ein eingegangenes Aufmaß. ' + kontingentText(a) + '</p>';
  }
  return { title: 'Neues Projekt', html: '<div class="wrap"><div class="nl-grid"><div><div class="stepbar"><span style="width: ' + (st ? 100 : 50) + '%"></span></div><div class="h"><p class="eyebrow">Schritt ' + (st + 1) + ' von 2 · ' + (st ? 'Eckdaten' : 'Kunde') + '</p><h2>' + (st ? 'Ein paar Eckdaten.' : 'Für wen ist das Projekt?') + '</h2><p>' + (st ? 'Alles freiwillig, hilft beim Angebot. Später im Projekt änderbar.' : 'Ein Projekt je Kunde. Der Aufmaß-Link kommt im nächsten Schritt.') + '</p></div><div class="card"><form class="form" data-form="nl" novalidate>' + body + nav + '</form></div></div>' +
    '<div class="pv"><p class="eyebrow">So kommt die Nachricht an</p><div class="phone small"><div class="ph-top"><span class="ph-av" style="background: ' + c.col + '">' + esc(c.name.slice(0, 1)) + '</span><span><b>' + esc(c.name) + '</b><small>Nachricht</small></span></div><div class="ph-body"><div class="bub out show" id="pv-msg">' + pvHTML(fake) + '</div></div></div><p class="km-s">Den Text können Sie nach dem Anlegen noch ändern.</p><p class="km-s">Ihr Kunde sieht im Link nur Ihren Betrieb: keine anderen Anbieter, keine Werbung. Sein Aufmaß bleibt in diesem Projekt.</p></div></div></div>' };
};
const pvHTML = (fake) => esc(linkMsg(fake)).replace(/\n/g, '<br>').replace(/https?:\/\/\S+/, '<span class="lp"><b>Fensterino · Aufmaß für ' + esc(BC().name) + '</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span>');
function pvUpdate() { const el = document.getElementById('pv-msg'), n = S.nl; if (el && n) el.innerHTML = pvHTML({ kunde: n.kunde || 'Familie Weber', code: 'xxxxx', du: n.du }); }
function aufmassText(l) {
  const am = l.aufmass || {}, pr = am.proj || {}, ab = A().abzug || { seite: 15, oben: 15 }, out = [];
  out.push('Aufmaß · ' + l.kunde + (l.nr ? ' · ' + l.nr : ''), [l.adresse, AW.lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')].filter(Boolean).join(' · '), 'Eingegangen: ' + ((l.log || {}).eingegangen || '') + ' · Zeitraum: ' + AW.lab('zeit', pr.zeit) + ' · Budget: ' + AW.lab('budget', pr.budget));
  if (pr.notiz) out.push('Nachricht vom Kunden: ' + pr.notiz);
  out.push('');
  (am.windows || []).forEach((w, i) => {
    const d = AW.derive(w);
    out.push('Pos. ' + (i + 1) + ' · ' + (w.name || 'Fenster') + ' · ' + (AW.num(w.anzahl) || 1) + ' Stück');
    AW.rows(w).forEach((r) => out.push('  ' + r[0] + ': ' + r[1]));
    if (d.moW && d.moH) out.push('  Bestellmaß-Vorschlag: ' + AW.th(d.moW - 2 * ab.seite) + ' × ' + AW.th(d.moH - ab.oben) + ' mm');
    AW.kiRows(w).forEach((r) => out.push('  Foto, ' + r[0] + ': ' + r[1]));
    out.push('');
  });
  out.push('Erfasst mit Fensterino. Vor der Fertigung Feinaufmaß vor Ort.');
  return out.join('\n');
}
const LSEEN = {};
SCREENS.link = () => {
  const a = A(), l = a.links.find((x) => x.id === S.sel); if (!l) return SCREENS.links();
  if (l.status === 'eingegangen' && !l.seen) l.seen = true;
  const lkey = l.status + ':' + l.progress, fresh = LSEEN[l.id] !== undefined && LSEEN[l.id] !== lkey; LSEEN[l.id] = lkey;
  const m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : LST[l.status], idx = LORDER.indexOf(l.status), done = l.status === 'eingegangen', dead = ['abgelaufen', 'deaktiviert'].includes(l.status), u = linkURL(l), msg = linkMsg(l), phone = isPhone(l.kontakt), mail = /@/.test(l.kontakt || '');
  const cur = dead ? null : (done ? 'eingegangen' : LORDER[Math.max(0, idx)]);
  const tl = '<ol class="tlh">' + LORDER.map((s, i) => '<li class="' + (i < idx || done ? 'done' : i === idx ? 'now' : '') + (fresh && (i === idx || (done && i === LORDER.length - 1)) ? ' fresh' : '') + '"><span class="dot"></span><small>' + TLS[s] + '</small><small class="ts">' + esc((l.log || {})[s] || '') + '</small></li>').join('') + '</ol>' +
    '<p class="km-s tl-now">' + (dead ? esc(m[0]) + '.' : cur ? '<b>' + TL[cur] + (cur === 'arbeit' ? ' · ' + l.progress + ' von 4 Maßen' : '') + '</b>' + ((l.log || {})[cur] ? ' · ' + esc(l.log[cur]) : '') + (l.via && idx >= 1 ? ' · über ' + esc(l.via) : '') : '') + ((l.vorher || []).length ? ' · ' + nW(l.vorher.length, 'Nachbesserung', 'Nachbesserungen') + ((l.log || {}).nachbesserung ? ', zuletzt ' + esc(l.log.nachbesserung) : '') : '') + (l.nb && l.nb.offen ? ' · Nachbesserung angefragt ' + esc(l.nb.when) : '') + '</p>';
  const nbOffen = !!(l.nb && l.nb.offen), nbOk = nbMoeglich(l);
  const share = '<div class="card sharecard' + (nbOffen ? ' nbcard' : '') + '"><div class="row between"><p class="eyebrow">' + (nbOffen ? 'Nachbesserung · Link erneut schicken' : 'Aufmaß-Link schicken') + '</p><span class="km-s">gilt bis ' + esc(l.expires) + '</span></div>' + (nbOffen ? '<p class="km-s nbhint">Runde ' + l.nb.runde + (l.nb.hinweis ? ' · Ihr Hinweis: „' + esc(l.nb.hinweis) + '“' : '') + '. Der Kunde sieht seine bisherigen Angaben, ändert sie und schickt erneut ab. Dafür wird nichts berechnet. <button type="button" class="ulink" data-act="nb-cancel" data-id="' + l.id + '">Zurückziehen</button></p>' : '') + '<div class="linkbox"><code class="sel" id="lnk">' + esc(u) + '</code><button type="button" class="btn small soft" data-act="l-share" data-v="link" data-id="' + l.id + '">' + icon('copy', 16) + 'Kopieren</button></div>' +
    '<div class="share"><a class="sbtn wa" href="https://wa.me/' + (phone ? intl(l.kontakt) : '') + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener" data-act="l-share" data-v="WhatsApp" data-id="' + l.id + '">' + ICONS.wa + '<span>WhatsApp</span></a><a class="sbtn" href="sms:' + (phone ? String(l.kontakt).replace(/\s/g, '') : '') + '?body=' + encodeURIComponent(msg) + '" data-act="l-share" data-v="SMS" data-id="' + l.id + '">' + ICONS.sms + '<span>SMS</span></a><a class="sbtn" href="mailto:' + (mail ? esc(l.kontakt) : '') + '?subject=' + encodeURIComponent('Ihr Fenster-Aufmaß für ' + BC().name) + '&body=' + encodeURIComponent(msg) + '" data-act="l-share" data-v="E-Mail" data-id="' + l.id + '">' + ICONS.mail + '<span>E-Mail</span></a><button type="button" class="sbtn" data-act="l-share" data-v="Text" data-id="' + l.id + '">' + ICONS.copy + '<span>Text kopieren</span></button></div>' +
    '<div class="f"><label for="lmsg">Nachricht</label><textarea id="lmsg" rows="4" data-in="lmsg:' + l.id + '">' + esc(msg) + '</textarea><div class="row between"><span class="row" style="gap: 8px">' + seg([['sie', 'Sie'], ['du', 'Du']], l.du ? 'du' : 'sie', 'l-du') + seg([['7', '7 Tage'], ['14', '14 Tage'], ['30', '30 Tage']], String(l.days || 14), 'l-days') + '</span>' + (l.msg ? '<button type="button" class="linkbtn" data-act="l-reset-msg" data-id="' + l.id + '">Text zurücksetzen</button>' : '') + '</div></div>' +
    '<p class="km-s">' + (l.kontakt ? 'Kontakt: <span class="sel">' + esc(l.kontakt) + '</span>. ' : 'Ohne Nummer öffnet WhatsApp die Kontaktauswahl. ') + 'SMS und E-Mail öffnen Ihr Programm, falls das Gerät es erlaubt; sonst den Text kopieren.</p></div>';
  let result = '';
  if (done && l.aufmass) {
    const am = l.aufmass, pr = am.proj || {}, wins = am.windows || [], tot = AW.num(pr.total) || 0;
    result = '<section class="sec"><div class="sec-head"><h3>Aufmaß</h3><span class="sub">' + nW(wins.length, 'Position', 'Positionen') + ' · ' + nW(am.elemente || wins.length, 'Element', 'Elemente') + ' · ' + nW(am.fotos || 0, 'Foto', 'Fotos') + '</span></div>' +
      '<div class="card amhead"><div class="kv"><span>Gebäude</span><span>' + esc((AW.lab('gebaeude', pr.gebaeude) || PGEB[l.geb] || '–') + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')) + '</span><span>Zeitraum</span><span>' + esc(AW.lab('zeit', pr.zeit) || '–') + '</span><span>Budget</span><span>' + esc((AW.lab('budget', pr.budget) || '–') + (pr.foerd ? ', Förderung gewünscht' : '')) + '</span><span>Lüftung</span><span>' + (tot && (am.elemente || wins.length) > tot / 3 ? 'Mehr als ein Drittel der Fenster: Lüftungskonzept nach DIN 1946-6 prüfen' : tot ? (am.elemente || wins.length) + ' von ' + tot + ' Fenstern im Haus' : '–') + '</span>' + (pr.notiz ? '<span>Nachricht</span><span class="amnote">„' + esc(pr.notiz) + '“</span>' : '') + '</div><div class="row amacts"><button type="button" class="btn small primary" data-act="pdf-am" data-id="' + l.id + '">' + icon('dl', 16) + 'PDF herunterladen</button><button type="button" class="btn small soft" data-act="copy-am" data-id="' + l.id + '">' + icon('copy', 16) + 'Als Text kopieren</button></div></div>' +
      '<div class="row between poshead"><span class="eyebrow">Positionen</span><button type="button" class="linkbtn" data-act="pos-all">Alle aufklappen</button></div><div class="poslist">' + wins.map((w, i) => posCard(w, i, a.abzug, false)).join('') + '</div></section>' +
      '<section class="sec"><div class="sec-head"><h3>Stand</h3></div><div class="card"><div class="pipe">' + [['neu', 'Neu'], ['angebot', 'Angebot'], ['termin', 'Feinaufmaß'], ['auftrag', 'Auftrag'], ['verloren', 'Verloren']].map((s) => '<button type="button" data-act="l-stage" data-id="' + l.id + '" data-v="' + s[0] + '" aria-pressed="' + ((l.stage || 'neu') === s[0]) + '">' + s[1] + '</button>').join('') + '</div><div class="f" style="margin-top: 12px"><label for="lmemo">Notiz zum Stand</label><textarea id="lmemo" data-in="lmemo:' + l.id + '" placeholder="z. B. Angebot bis Freitag">' + esc(l.memo || '') + '</textarea></div></div></section>';
  }
  const pdata = '<details class="card fold"><summary><span>Projektdaten<small>' + esc([l.kontakt, placeOf(l), projFacts(l)].filter(Boolean).join(' · ') || 'Kontakt, Objekt, Eckdaten, interne Notiz') + '</small></span></summary><div class="fold-body"><div class="kv"><span>Kunde</span><span>' + esc(l.kunde) + '</span><span>Kontakt</span><span>' + (l.kontakt ? '<span class="sel">' + esc(l.kontakt) + '</span>' : '–') + '</span><span>Objekt</span><span>' + esc(l.adresse || '–') + '</span><span>Eckdaten</span><span>' + esc(projFacts(l) || '–') + '</span><span>Link</span><span>' + (dead ? esc(m[0]) : 'gültig bis ' + esc(l.expires)) + ', Anrede ' + (l.du ? 'Du' : 'Sie') + '</span></div><div class="f" style="margin-top: 12px"><label for="pnote">Interne Notiz</label><textarea id="pnote" data-in="pnote:' + l.id + '" placeholder="Sieht nur Ihr Team">' + esc(l.note || '') + '</textarea></div></div></details>';
  return { title: l.kunde, html: '<div class="wrap narrow"><div class="h"><p class="eyebrow">' + (l.demo ? 'Beispielprojekt' : 'Projekt ' + esc(l.nr || '')) + ' · angelegt ' + esc(l.created) + '</p><h2>' + esc(l.kunde) + '</h2><p>' + esc([placeOf(l), projFacts(l)].filter(Boolean).join(' · ') || 'Ohne Eckdaten') + '</p><div class="row"><span class="badge ' + m[1] + (fresh ? ' pop' : '') + '">' + m[0] + '</span>' + (l.via ? '<span class="badge">über ' + esc(l.via) + '</span>' : '') + (nbOffen ? '<span class="badge warn">Nachbesserung angefragt</span>' : (l.runde || 1) > 1 ? '<span class="badge acc">Nachgebessert · Runde ' + l.runde + '</span>' : '') + '</div></div>' +
    (S.justCreated === l.id ? '<div class="card created"><span class="burst-ok" data-lottie="fertig"><span class="lottie-still">' + icon('check', 30) + '</span></span><div><b>Projekt angelegt.</b><span>Jetzt den Aufmaß-Link an ' + esc(l.kunde) + ' schicken.</span></div></div>' : '') +
    (done && nbOffen ? share : '') + (done ? (l.locked ? lockCard(l, a) : result) : '') + (!done && !dead ? share : '') +
    '<section class="sec"><div class="sec-head"><h3>Verlauf</h3></div><div class="card tlcard">' + tl + '</div></section>' + pdata +
    '<div class="row">' + (!done && !dead ? '<button type="button" class="btn ghost" data-act="l-sim" data-id="' + l.id + '">' + icon('play', 16) + 'Demo: Kunde füllt aus</button>' : '') + (!dead ? '<a class="btn ghost" href="' + linkOpen(l) + '" target="_blank" rel="noopener">Als Kunde öffnen ' + icon('ext', 15) + '</a>' : '') + (!done && !dead ? '<button type="button" class="btn danger" data-act="sheet" data-v="deact" data-id="' + l.id + '">Link deaktivieren</button>' : '') + (done && !nbOffen && nbOk === 'ok' ? '<button type="button" class="btn ghost" data-act="sheet" data-v="nachbesserung" data-id="' + l.id + '">' + icon('swap', 16) + 'Nachbesserung anfragen</button>' : '') + (done || dead ? '<button type="button" class="btn ghost" data-act="l-again" data-id="' + l.id + '">' + (dead ? 'Neuen Link für ' : 'Weiteres Projekt für ') + esc(l.kunde.replace(/^Beispiel:\s*/, '')) + '</button>' : '') + '</div>' + (done && !nbOffen && nbOk && nbOk !== 'ok' ? '<p class="km-s">' + esc(nbOk) + '</p>' : '') +
    '<p class="km-s">„Als Kunde öffnen“ zeigt die Fensterino-App so, wie Ihr Kunde sie sieht. ' + (Server.online() ? 'Schickt Ihr Kunde sein Aufmaß ab, erscheint es hier von selbst.' : 'In der Demo schickt Ihr Kunde nach dem Absenden einen Aufmaß-Code, den Sie über „Code vom Kunden einfügen“ übernehmen.') + '</p></div>' };
};

/* ---------- Bildschirme: Abrechnung und Betrieb ---------- */
/* Kontingent in Worten und als Kachel: Start zählt freie Projekte, Abo 10 das Monatskontingent, Plus ist offen */
function kontingentText(a) {
  const k = X.konto(a), p = P();
  if (k === 'plus') return 'Plus: Projekte unbegrenzt.';
  if (k === 'abo') { const f = X.aboFrei(a); return f ? 'Abo 10: noch ' + f + ' von ' + p.abo.inkl + ' Projekten in ' + monthLabel() + ' inklusive.' : 'Abo 10: Kontingent für ' + monthLabel() + ' verbraucht, jedes weitere Projekt ' + p.abo.extra + ' €.'; }
  const f = freeLeft(a); return f ? 'Noch ' + f + ' von ' + freeQuota(a) + ' Projekten kostenlos, danach ' + p.projekt + ' € je Projekt.' : 'Kostenlose Projekte verbraucht, ' + p.projekt + ' € je Projekt' + (a.pay ? '.' : ', dafür eine Zahlungsart hinterlegen.');
}
function kontingentStat(a) {
  const k = X.konto(a), p = P();
  if (k === 'plus') return stat('acc', 'gift', 'Projekte', '∞', 'Plus, unbegrenzt');
  if (k === 'abo') return stat('acc', 'gift', 'Inklusive', X.aboFrei(a) + ' / ' + p.abo.inkl, 'Abo 10, ' + monthLabel());
  return stat('acc', 'gift', 'Noch kostenlos', freeLeft(a), a.pay ? 'danach ' + p.projekt + ' € je Projekt' : 'danach mit Zahlungsart');
}
SCREENS.abrechnung = () => {
  const a = A(), book = ledger(a), rec = receivedLinks(), wait = lockedLinks(a), p = P(), k = X.konto(a);
  const nextInv = book.filter((b) => b.status === 'offen').reduce((s, b) => s + b.betrag, 0);
  const row = (t, sub, amount, badge, cls) => '<div class="lrow"><span class="lt"><b>' + esc(t) + '</b><small>' + esc(sub) + '</small></span><span class="la"><b>' + amount + '</b><span class="badge ' + (cls || '') + '">' + esc(badge) + '</span></span></div>';
  const waitRows = wait.map((l) => row('Aufmaß · ' + l.kunde, ((l.log || {}).eingegangen || '') + ' · wartet auf Zahlungsart', eur(k === 'abo' ? p.abo.extra : p.projekt), 'gesperrt', 'bad'));
  const bookRows = book.map((b) => row(b.text, b.sub || b.when, eur(b.betrag), b.badge + (b.status === 'berechnet' ? ' · Rechnung ' + (b.rechnung || '') : b.status === 'bezahlt' ? ' · bezahlt' : ''), b.betrag ? (b.status === 'bezahlt' ? 'ok' : 'warn') : 'ok'));
  const inv = (a.rechnungen || []).map((r) => row('Sammelrechnung ' + r.nr, r.datum + ' · ' + r.pos + ' Positionen', eur(r.betrag), r.status, r.status === 'bezahlt' ? 'ok' : 'warn'));
  const all = waitRows.concat(bookRows, inv);
  const plans = [['service', 'Start · keine Grundgebühr', p.frei + ' Projekte frei, danach ' + p.projekt + ' € netto je Projekt mit eingegangenem Aufmaß.'], ['abo', 'Abo 10 · ' + p.abo.grund + ' € im Monat', p.abo.inkl + ' Projekte im Monat inklusive, jedes weitere ' + p.abo.extra + ' €. Monatlich kündbar.'], ['plus', 'Plus · ' + p.plus + ' € im Monat', 'Projekte unbegrenzt, Ihr Logo und Ihre Farbe beim Kunden, Team und Statistik. Monatlich kündbar.']];
  const payCard = '<div class="card paycard"><div class="row between" style="align-items: center; flex-wrap: nowrap"><span style="min-width: 0"><p class="eyebrow">Zahlungsart</p><b>' + (a.pay ? esc(a.pay.type) + ' · ' + esc(a.pay.label) : 'Noch keine hinterlegt') + '</b><small>' + (a.pay ? 'Projekte werden alle zwei Wochen als Sammelrechnung eingezogen, Abos monatlich.' : 'Nötig ab dem ersten kostenpflichtigen Projekt. Bis dahin wird nichts abgebucht.') + '</small></span><button type="button" class="btn small ' + (a.pay ? 'ghost' : 'primary') + '" data-act="sheet" data-v="pay">' + (a.pay ? 'Ändern' : 'Hinterlegen') + '</button></div></div>';
  return { html: '<div class="wrap">' + payBanner() + '<div class="h"><h2>Abrechnung.</h2><p>' + kontingentText(a) + ' Nachbesserungen kosten nichts, Ihr Kunde zahlt nichts.' + (a.dupOf ? ' Die kostenlosen Projekte für Ihren Betrieb wurden schon über das Konto ' + esc(a.dupOf) + ' genutzt.' : '') + '</p></div>' +
    '<div class="grid c3 stats">' + stat('ok', 'inbox', 'Aufmaße', rec.length, 'eingegangen') + kontingentStat(a) + stat(nextInv ? 'warn' : 'acc', 'euro', 'Nächste Rechnung', nextInv, nextInv ? 'netto, bisher' : 'nichts offen', 'eur') + '</div>' + payCard +
    '<section class="sec"><div class="sec-head"><h3>Tarif</h3><button type="button" class="linkbtn" data-act="go" data-v="preise">Alle Preise ›</button></div><div class="grid c3">' + plans.map((o) => '<button type="button" class="opt" data-act="konto" data-v="' + o[0] + '" aria-pressed="' + (k === o[0]) + '"><span><b>' + o[1] + '</b><small>' + o[2] + '</small></span></button>').join('') + '</div>' +
    (a.downgrade ? '<p class="km-s">Wechsel zu ' + X.planName(a.downgrade.to) + ' zum ' + esc(a.downgrade.at) + ' vorgemerkt. Bis dahin bleibt ' + X.planName(k) + ' aktiv. <button type="button" class="linkbtn" data-act="konto" data-v="' + k + '">' + X.planName(k) + ' behalten</button></p>' : k !== 'service' ? '<p class="km-s">' + X.planName(k) + ' ist für ' + esc(monthLabel()) + ' gebucht. Ein Wechsel nach unten gilt zum Monatsende; gebuchte Positionen bleiben, wie sie sind.</p>' : '') + '</section>' +
    '<section class="sec"><div class="sec-head"><h3>Positionen</h3></div>' + (all.length ? '<div class="card ledger">' + all.join('') + '</div><p class="km-s">Gebucht wird beim ersten Eingang je Projekt, zum dann gültigen Tarif. Nachbesserungen im selben Projekt kosten nichts. Projekte löschen oder den Tarif wechseln ändert gebuchte Positionen nicht.</p>' : empty('Noch keine Positionen.', 'Sobald ein Aufmaß eingeht, steht es hier.')) + '</section></div>' };
};
const abEx = (ab) => 'Beispiel: Öffnung 1.260 × 1.440 mm ergibt ' + AW.th(1260 - 2 * ab.seite) + ' × ' + AW.th(1440 - ab.oben) + ' mm.';
SCREENS.bprofil = () => {
  const c = BC(), a = A(), p = a.prefs || {}, ab = a.abzug || (a.abzug = { seite: 15, oben: 15 });
  const ini = esc(c.name.replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase());
  return { html: '<div class="wrap"><div class="h"><h2>' + esc(c.name) + '</h2><p>So begrüßt die App Ihre Kunden, wenn sie Ihren Aufmaß-Link öffnen.</p></div><div class="grid c2"><div class="card fcard"><p class="eyebrow">Beim Kunden in der App</p><div class="preview"><div class="pv-card"><span class="av" style="background: ' + c.col + '">' + ini + '</span><span><small>Persönliche Anfrage von</small><b>' + esc(c.name) + '</b></span></div><p class="pv-t">Deine Fenster. Deine Maße.</p><small class="pv-s">' + esc(c.name) + ' braucht für dein Angebot die Maße deiner Fenster.</small></div><p class="km-s">Ihr Kunde sieht nur Ihren Betrieb: keine anderen Anbieter, keine Werbung. Mit Betrieb Plus auch mit Ihrem Logo.</p></div>' +
    '<div class="card"><p class="eyebrow">Zugang und Kontakt</p><div class="form" style="margin-top: 10px"><div class="f"><label for="b-ap">Ansprechpartner</label><input id="b-ap" data-in="b:ap" value="' + esc(a.ap) + '"><small>Unterschreibt die Nachricht an Ihre Kunden.</small></div><div class="f2"><div class="f"><label for="b-mail">E-Mail</label><input id="b-mail" data-in="b:mail" value="' + esc(a.mail) + '" type="email"></div><div class="f"><label for="b-tel">Telefon</label><input id="b-tel" data-in="b:tel" value="' + esc(a.tel) + '" type="tel"></div></div></div></div></div>' +
    '<div class="grid c2"><div class="card"><p class="eyebrow">Bestellmaß-Vorschlag</p><p class="sub" style="margin-top: 6px">Ihr Abzug von der Maueröffnung. Damit rechnet Fensterino in jedem eingegangenen Aufmaß ein Bestellmaß vor; verbindlich bleibt Ihr Feinaufmaß.</p><div class="f2" style="margin-top: 10px"><div class="f"><label for="ab-seite">Je Seite</label><input id="ab-seite" type="number" inputmode="numeric" min="0" max="60" value="' + ab.seite + '" data-in="ab:seite"><small>mm, links und rechts</small></div><div class="f"><label for="ab-oben">Oben</label><input id="ab-oben" type="number" inputmode="numeric" min="0" max="60" value="' + ab.oben + '" data-in="ab:oben"><small>mm</small></div></div><p class="km-s" id="ab-ex" style="margin-top: 8px">' + abEx(ab) + '</p></div>' +
    '<div class="card"><p class="eyebrow">Benachrichtigungen</p>' + sw('E-Mail bei neuem Aufmaß', 'sofort, mit Link zum Projekt', p.mail !== false, 'bpref', 'mail') + sw('Erinnerung an offene Links', 'wenn ein Kunde nach 3 Tagen noch nicht gemessen hat', p.remind !== false, 'bpref', 'remind') + '</div></div>' +
    '<section class="sec"><div class="sec-head"><h3>Team</h3></div><div class="card"><div class="kv"><span>Inhaber</span><span>' + esc(a.ap) + ' · darf alles</span>' + (S.cur === 'c1' ? '<span>Büro</span><span>Sabine Kurz · Projekte und Abrechnung</span><span>Montage</span><span>2 Monteure · sehen nur Aufmaßblätter</span>' : '') + '</div><p style="margin: 10px 0 0"><button type="button" class="btn small soft" data-act="toast" data-v="Einladung per E-Mail. Im Prototyp nur angedeutet.">Mitglied einladen</button></p></div></section>' +
    '<div class="row"><button type="button" class="btn ghost" data-act="sheet" data-v="demo">Demo wechseln</button><button type="button" class="btn ghost" data-act="logout">Abmelden</button></div></div>' };
};

/* ---------- Blätter ---------- */
const LEGAL = { impressum: ['Impressum', 'Anbieter und Kontakt nach § 5 DDG.', '/impressum/'], datenschutz: ['Datenschutz', 'Welche Daten Fensterino verarbeitet, wofür, mit welchen Dienstleistern und welche Rechte Sie haben. In der Pilotphase bleiben Konten, Projekte und Aufmaße in Ihrem Browser.', '/datenschutz/'], agb: ['Nutzungsbedingungen', 'Die ausformulierten Nutzungsbedingungen für Betriebe folgen vor dem öffentlichen Start. Bis dahin gilt: Die ersten 3 Projekte mit eingegangenem Aufmaß sind kostenlos, danach gelten die Preise unter „Preise“ (netto, monatlich kündbar). Aufmaße Ihrer Kunden nutzen Sie nur für deren Projekt; Aufmaße aus Ihren Links gehen an keinen anderen Betrieb.'] };
const DEMOS = [['betrieb', 'c1', 'Fensterbau Brandt', 'Fensterbauer mit drei Projekten', '#0071e3'], ['betrieb', 'c7', 'Glaserei Vogt', 'Fensterbauer mit zwei Projekten', '#8a5a2b']];
function loginServer(s) {
  const schritt = s.schritt || 'mail', reg = s.zweck === 'reg';
  const feld = schritt === 'mail'
    ? '<div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-mail">E-Mail</label><input id="lg-mail" type="email" data-in="lg:mail" value="' + esc(s.mail || '') + '" autocomplete="email" inputmode="email">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Kein Passwort: Sie bekommen einen sechsstelligen Code per E-Mail.</small>') + '</div>'
    : '<div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-code">Code aus der E-Mail</label><input id="lg-code" data-in="lg:code" value="' + esc(s.code || '') + '" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="123456">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Geschickt an ' + esc(s.mail) + '. Kein Code? Auch im Spam-Ordner nachsehen.</small>') + '</div>';
  return '<h3>' + (reg ? 'Konto für Ihren Betrieb' : 'Anmelden') + '</h3><p class="sub" style="margin: -4px 0 12px">' + (reg ? 'Zuerst Ihre E-Mail bestätigen, dann Ihren Betrieb eintragen. Die ersten ' + P().frei + ' Projekte sind kostenlos.' : 'Ein Kunde hat Ihnen ein Fensterino-Aufmaß geschickt? Mit dem Code von der Übersichtsseite holen Sie es nach der Anmeldung in Ihr Konto.') + '</p>' +
    '<form class="form" data-form="srvlogin" novalidate>' + feld + '<div class="row between">' + (schritt === 'code' ? '<button type="button" class="linkbtn" data-act="srv-mail">Andere E-Mail</button>' : '<span></span>') + '<button type="submit" class="btn primary">' + (schritt === 'mail' ? 'Code schicken' : (reg ? 'Weiter' : 'Anmelden')) + '</button></div></form>' +
    '<p class="eyebrow" style="margin-top: 14px">Oder erst einmal ansehen</p><div class="list">' + DEMOS.map((d) => '<button type="button" class="item" data-act="demo-as" data-v="' + d[1] + '"><span class="ic av" style="background: ' + d[4] + '; color: #fff">' + d[2].slice(0, 1) + '</span><span class="tx"><span class="ti">Demo: ' + d[2] + '</span><span class="di">' + d[3] + ', Beispieldaten im Browser</span></span>' + CHEV + '</button>').join('') + '</div>';
}
const SHEETS = {
  login: (s) => (Server.an ? loginServer(s) : '<h3>Anmelden</h3><p class="sub" style="margin: -4px 0 12px">Ein Kunde hat Ihnen ein Fensterino-Aufmaß geschickt? <button type="button" class="ulink" data-act="reg" data-v="betrieb">Kostenlos registrieren</button>, dann „Code vom Kunden einfügen“. Die ersten 3 Projekte sind frei.</p><form class="form" data-form="login" novalidate><div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-mail">E-Mail</label><input id="lg-mail" type="email" data-in="lg:mail" value="' + esc(s.mail || '') + '" autocomplete="email"></div><div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-pw">Passwort</label><input id="lg-pw" type="password" data-in="lg:pw" value="" autocomplete="current-password">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Demo: jedes Passwort ab 8 Zeichen.</small>') + '</div><div class="row between"><button type="button" class="linkbtn" data-act="toast" data-v="Ein Link zum Zurücksetzen ist unterwegs (Demo).">Passwort vergessen?</button><button type="submit" class="btn primary">Anmelden</button></div></form>' +
    '<p class="eyebrow" style="margin-top: 6px">Oder Demo-Zugang</p><div class="list">' + DEMOS.map((d) => '<button type="button" class="item" data-act="demo-as" data-v="' + d[1] + '"><span class="ic av" style="background: ' + d[4] + '; color: #fff">' + d[2].slice(0, 1) + '</span><span class="tx"><span class="ti">' + d[2] + '</span><span class="di">' + d[3] + '</span></span>' + CHEV + '</button>').join('') + '</div><p class="sub center">Noch kein Konto? <button type="button" class="ulink" data-act="reg" data-v="betrieb">Kostenlos registrieren</button> · Hauseigentümer? <a class="ulink" href="' + APP_OPEN + '">Zur App, ohne Konto</a></p>'),
  demo: () => { const own = (S.myCompanies || []).map((c) => ['betrieb', c.id, c.name, c.id === Server.id ? 'Ihr Konto auf dem Server' : 'Ihr Betrieb (Demo im Browser)']); return '<h3>Demo-Ansicht</h3><p class="sub">Alles bleibt in diesem Browser gespeichert. Freier Wechsel zwischen den Sichten.</p><div class="list">' + [['', 'visitor', 'Startseite', 'wie ein neuer Besucher']].concat(DEMOS.map((d) => [d[0], d[1], d[2], d[3]]), own).map((d) => '<button type="button" class="item' + ((d[1] === 'visitor' && !S.role) || (S.role === 'betrieb' && S.cur === d[1]) ? ' cur' : '') + '" data-act="demo-as" data-v="' + d[1] + '"><span class="tx"><span class="ti">' + esc(d[2]) + '</span><span class="di">' + esc(d[3]) + '</span></span>' + CHEV + '</button>').join('') + '</div><button type="button" class="btn danger" data-act="reset">Demo zurücksetzen</button>'; },
  linkimport: () => '<h3>Code vom Kunden einfügen</h3><p class="sub">Ihr Kunde schickt nach dem Absenden einen Aufmaß-Code, zum Beispiel als Antwort in WhatsApp; bei einem Fensterino-Aufmaßblatt steht er auf der letzten Seite. Fügen Sie ihn hier ein: Gehört er zu einem Ihrer Projekte, landet das Aufmaß dort, sonst entsteht ein neues Projekt.</p><div class="f"><textarea id="code-in" rows="4" placeholder="AM1.…"></textarea></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="linkimport">Übernehmen</button></div>',
  liste: (s) => '<h3>Mehrere Kunden einladen</h3><p class="sub">Eine Zeile je Kunde: Name, dann Handynummer oder E-Mail, durch Komma oder Semikolon getrennt. Für jeden entsteht ein Projekt mit eigenem Aufmaß-Link; verschickt wird aus dem Projekt, die Nachricht ist vorformuliert. Kosten entstehen erst, wenn ein Aufmaß eingeht.</p><div class="f"><textarea id="liste-in" rows="6" data-in="liste" placeholder="Familie Weber, 0171 2345678\nHerr Kaya, kaya@beispiel.de\nFrau Schulze">' + esc(s.text || '') + '</textarea><small>Ohne Kontakt geht es auch, dann kopieren Sie den Link später aus dem Projekt.</small></div><div class="f"><label>Anrede in der Nachricht</label>' + seg([['sie', 'Sie'], ['du', 'Du']], s.du ? 'du' : 'sie', 'liste-du') + '</div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="liste-create">' + icon('people', 18) + 'Projekte anlegen</button></div>',
  nachbesserung: (s) => { const l = A().links.find((x) => x.id === s.id) || {}; return '<h3>Nachbesserung anfragen</h3><p class="sub">' + esc(l.kunde || 'Der Kunde') + ' bekommt den Link noch einmal, sieht alle bisherigen Angaben und kann sie ändern. Das neue Aufmaß ersetzt das alte im selben Projekt, <b>berechnet wird nichts</b>. Höchstens ' + NB_MAX + ' Runden je Projekt, bis ' + NB_TAGE + ' Tage nach dem Eingang. Hat das neue Aufmaß keine Position mit dem alten gemeinsam, ist es ein anderes Aufmaß und wird wie ein neues gebucht.</p><div class="f"><label for="nb-hinweis">Was soll der Kunde prüfen?</label><textarea id="nb-hinweis" rows="3" data-in="nb-hinweis" placeholder="z. B. Beim Küchenfenster fehlt die Brüstungshöhe, und die Breite unten scheint vertauscht.">' + esc(s.hinweis || '') + '</textarea><small>Steht so in der Nachricht an den Kunden.</small></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="nb-send" data-id="' + s.id + '">Link erneut öffnen</button></div>'; },
  pay: (s) => paySheet(s),
  deact: (s) => '<h3>Link deaktivieren?</h3><p class="sub">Ihr Kunde kann über diesen Link dann kein Aufmaß mehr schicken. Das kostet nichts. Einen neuen Link können Sie jederzeit erstellen.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn danger" data-act="l-deact" data-id="' + s.id + '">Deaktivieren</button></div>',
  legal: (s) => { const L = LEGAL[s.id] || LEGAL.agb, pilot = L === LEGAL.agb && !Server.an ? 'Fensterino ist in der Pilotphase: Solange kein Server angeschlossen ist, wird nichts berechnet, alle Preise sind eine Vorschau. ' : ''; return '<h3>' + esc(L[0]) + '</h3><p class="sub">' + esc(pilot + L[1]) + '</p><div class="row">' + (L[2] ? '<a class="btn primary" href="' + L[2] + '" target="_blank" rel="noopener">Seite öffnen</a><button type="button" class="btn ghost" data-act="sheet-close">Schließen</button>' : '<button type="button" class="btn primary" data-act="sheet-close">Schließen</button>') + '</div>'; }
};

const unpack = X.unpack, fingerprint = X.fingerprint, fromApp = X.fromApp, fromAppProj = X.fromAppProj;
const nextNr = (a) => X.nextNr(a || A());
/* ---------- Demo: der Kunde füllt den Link aus ---------- */
function simLink(l, cid) {
  const steps = [['geoeffnet', 900], ['arbeit', 1700], ['p2', 2500], ['p3', 3200], ['p4', 3900], ['eingegangen', 4800]];
  steps.forEach((s) => later(s[1], () => {
    if (['eingegangen', 'deaktiviert'].includes(l.status)) return;
    if (s[0] === 'geoeffnet') { l.status = 'geoeffnet'; l.log.geoeffnet = stamp(); }
    else if (s[0] === 'arbeit') { l.status = 'arbeit'; l.progress = 1; l.log.arbeit = stamp(); }
    else if (s[0][0] === 'p') { l.progress = +s[0][1]; }
    else {
      const wins = demoWins('weber').slice(0, 2 + (hashN(l.id) % 3));
      const ok = receiveAufmass(S.acc[cid], cid, l, aufmassOf(wins, projOf({ baujahr: '1984', total: 8, foerd: false, notiz: 'Am besten nach 17 Uhr anrufen.' })), l.via);
      l.seen = S.screen === 'link' && S.sel === l.id;
      if (l.seen && ok) S._feier = 'eingang';
      if (S.role === 'betrieb' && S.cur === cid) toast(ok ? 'Aufmaß eingegangen: ' + l.kunde : 'Aufmaß eingegangen. Zum Ansehen Zahlungsart hinterlegen');
    }
  }));
}

/* ---------- Aufmaßblatt als PDF für den Betrieb ---------- */
let PDL = null;
const PDLP = (async () => { try { PDL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { PDL = null; } return PDL; })();
/* Die PDF zeichnet /assets/blatt.js (gemeinsam mit der App): Ausgabe 'betrieb' in den Farben des Betriebs, mit Bestellmaß-Vorschlag */
const BLATT_H = { derive: AW.derive, lab: AW.lab, num: AW.num, th: AW.th, col: AW.col, orn: (k) => AW.lab('orn', k) };
function amPDF(l) {
  if (!window.Blatt || !l.aufmass) return null;
  const am = l.aufmass, c = BC(), a = A();
  return window.Blatt.pdf({ variante: 'betrieb', fenster: am.windows || [], projekt: am.proj || {}, kunde: { name: l.kunde, kontakt: l.kontakt, adresse: l.adresse }, betrieb: { name: c.name, col: c.col, abzug: a.abzug || { seite: 15, oben: 15 }, nr: l.nr, eingegangen: (l.log || {}).eingegangen }, portalKurz: location.host, h: BLATT_H });
}
async function saveAm(l) {
  if (!l || !l.aufmass) return;
  if (window.Blatt) await window.Blatt.schrift();
  const pdf = amPDF(l), base = 'Aufmass-' + [l.nr, slug(l.kunde.replace(/^Beispiel:\s*/, ''))].filter(Boolean).join('-').replace(/[^A-Za-z0-9_-]+/g, '-');
  const name = base + (pdf ? '.pdf' : '.txt'), data = pdf || aufmassText(l);
  if (!PDL) await PDLP;
  if (PDL) {
    try { await PDL.save({ filename: name, data: data }); toast(pdf ? 'PDF gespeichert' : 'Als Text gespeichert'); }
    catch (e) { if (e && e.code === 'declined') return; if (e && (e.code === 'rejected_extension' || e.code === 'extension_not_enabled') && pdf) { try { await PDL.save({ filename: base + '.txt', data: aufmassText(l) }); toast('Als Text gespeichert'); } catch (e2) { toast('Speichern hat nicht geklappt'); } return; } toast('Speichern hat nicht geklappt'); }
    return;
  }
  if (window.claude) { copyText(aufmassText(l), 'Speichern geht hier nicht. Aufmaß als Text kopiert'); return; }
  try { const blob = data instanceof Blob ? data : new Blob([data], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Download gestartet'); }
  catch (e) { toast('Speichern geht hier nicht. Bitte als Text kopieren.'); }
}

/* ---------- Abrechnung: die Regeln stehen in modell.js (Abrechnung = X) und gelten im Browser wie auf dem Server ---------- */
const monthKey = X.monthKey, monthLabel = X.monthLabel, monthEnd = X.monthEnd, freeQuota = X.freeQuota, ledger = X.ledger, freeLeft = X.freeLeft, lockedLinks = X.lockedLinks, nbMoeglich = X.nbMoeglich, NB_MAX = X.NB_MAX, NB_TAGE = X.NB_TAGE;
/* Ein Aufmaß kommt an (Demo-Simulation): speichern, buchen oder sperren, melden */
function receiveAufmass(a, cid, l, aufmass, via) { const r = X.receiveAufmass(a, l, aufmass, via); notify(cid, r.notif); return r.ok; }
/* Beim Start und einmal pro Minute: was die Zeit erledigt (Tarifwechsel zum Monatsende, Monatsbuchung, abgelaufene Links) */
function tick() {
  let dirty = false;
  Object.keys(S.acc).forEach((id) => { if (id === Server.id && Server.an) return; const r = X.tickKonto(S.acc[id]); if (r.dirty) dirty = true; r.notifs.forEach((n) => notify(id, n)); });
  if (dirty) { save(); if (document.getElementById('app')) refresh(); }
}
/* Gleicher Betrieb schon da? Telefonnummer oder Firmenname mit gleicher PLZ-Region */
const normTel = (t) => { let d = String(t || '').replace(/\D/g, ''); if (d.startsWith('0049')) d = '0' + d.slice(4); else if (d.startsWith('49') && d.length > 10) d = '0' + d.slice(2); return d; };
const normFirma = (n) => String(n || '').toLowerCase().replace(/\b(gmbh|ug|gbr|kg|ohg|e\.?\s?k\.?|inh\.?|&\s?co\.?)\b/g, '').replace(/[^a-z0-9äöüß]/g, '');
function sameCompany(d) {
  const tel = normTel(d.tel), name = normFirma(d.firma), plz = String(d.plz || '').slice(0, 2);
  const ids = Object.keys(S.acc);
  for (let i = 0; i < ids.length; i++) {
    const a = S.acc[ids[i]], c = comp(ids[i]);
    if (tel.length >= 6 && normTel(a.tel) === tel) return c ? c.name : 'ein bestehendes Konto';
    if (name.length >= 4 && c && normFirma(c.name) === name && (!plz || String(c.plz || '').slice(0, 2) === plz)) return c.name;
  }
  return '';
}
/* IBAN prüfen: Länge für Deutschland und Prüfziffer nach ISO 13616 */
function ibanOk(v) {
  const s = String(v || '').replace(/\s+/g, '').toUpperCase();
  if (!/^DE\d{20}$/.test(s)) return false;
  const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let m = 0; for (let i = 0; i < r.length; i++) m = (m * 10 + +r[i]) % 97;
  return m === 1;
}
const ibanMask = (v) => { const s = String(v || '').replace(/\s+/g, '').toUpperCase(); return s.slice(0, 4) + ' •••• •••• ' + s.slice(-4); };
function dupNote(d) { const n = sameCompany(d); return n ? '<div class="note warn">Für <b>' + esc(n) + '</b> gibt es schon ein Fensterino-Konto. Ein weiteres geht, die 3 kostenlosen Aufmaße gibt es aber nur einmal je Betrieb. <button type="button" class="ulink" data-act="sheet" data-v="login">Lieber anmelden</button></div>' : ''; }
function payBanner() {
  if (S.role !== 'betrieb') return '';
  const a = A(), w = lockedLinks(a).length;
  if (w) return '<div class="banner warn"><span><b>' + nW(w, 'Aufmaß wartet', 'Aufmaße warten') + ' auf Freischaltung.</b> Mit einer Zahlungsart sehen Sie ' + (w === 1 ? 'es' : 'sie') + ' sofort.</span><button type="button" class="btn small primary" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button></div>';
  if (!a.pay && X.konto(a) === 'service' && freeLeft(a) === 0) return '<div class="banner"><span><b>Keine kostenlosen Projekte mehr.</b> Mit einer Zahlungsart ist das nächste Aufmaß sofort sichtbar.</span><button type="button" class="btn small ghost" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button></div>';
  return '';
}
function lockCard(l, a) {
  const am = l.aufmass || {}, n = (am.windows || []).length;
  return '<section class="sec"><div class="sec-head"><h3>Aufmaß</h3><span class="sub">' + nW(n, 'Position', 'Positionen') + ' · ' + nW(am.fotos || 0, 'Foto', 'Fotos') + '</span></div><div class="card lockcard"><span class="lk-ic">' + icon('lock', 26) + '</span><div><p class="eyebrow">Eingegangen · gesperrt</p><h3>Zum Ansehen eine Zahlungsart hinterlegen.</h3><p>' + (a.dupOf ? 'Die kostenlosen Aufmaße für Ihren Betrieb wurden schon über das Konto ' + esc(a.dupOf) + ' genutzt.' : 'Ihre ' + freeQuota(a) + ' kostenlosen Aufmaße sind verbraucht.') + ' Dieses Aufmaß kostet ' + eur(P().projekt) + ' netto und kommt auf die nächste Sammelrechnung. Im Abo 10 sind ' + P().abo.inkl + ' Projekte im Monat inklusive, mit Plus alle.</p><div class="row"><button type="button" class="btn primary" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button><button type="button" class="btn ghost" data-act="konto" data-v="abo">Abo 10, ' + eur(P().abo.grund) + ' im Monat</button></div></div></div></section>';
}
function paySheet(s) {
  const e = s.err || {}, t = s.type || 'sepa', w = lockedLinks(A()).length;
  const fe = (f) => (e[f] ? '<small class="err">' + esc(e[f]) + '</small>' : '');
  const inp = (label, f, ph, auto) => '<div class="f' + (e[f] ? ' has-err' : '') + '"><label for="pay-' + f + '">' + label + '</label><input id="pay-' + f + '" data-in="pay:' + f + '" value="' + esc(s[f] || '') + '" placeholder="' + esc(ph) + '" autocomplete="' + auto + '">' + fe(f) + '</div>';
  const why = s.then && s.then !== 'service' ? 'Für ' + X.planName(s.then) + ' brauchen wir eine Zahlungsart. Gebucht wird ab heute für den laufenden Monat.' : w ? nW(w, 'Aufmaß wartet', 'Aufmaße warten') + ' auf Freischaltung und ' + (w === 1 ? 'ist' : 'sind') + ' danach sofort sichtbar.' : 'Nötig ab dem ersten kostenpflichtigen Aufmaß. Bis dahin wird nichts abgebucht.';
  if (Server.online()) return '<h3>Zahlungsart hinterlegen</h3><p class="sub">' + why + ' Sie hinterlegen SEPA-Lastschrift oder Karte auf der sicheren Seite unseres Zahlungsdienstleisters Stripe; Fensterino sieht keine Kontodaten. Abgebucht wird alle zwei Wochen als Sammelrechnung, Abos monatlich.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Später</button><button type="button" class="btn primary" data-act="srv-zahlungsart">Weiter zu Stripe ' + icon('ext', 15) + '</button></div>';
  return '<h3>Zahlungsart hinterlegen</h3><p class="sub">' + why + ' Abgebucht wird alle zwei Wochen als Sammelrechnung, nur für eingegangene Aufmaße.</p>' + seg([['sepa', 'SEPA-Lastschrift'], ['karte', 'Kreditkarte']], t, 'pay-type') +
    '<form class="form" data-form="pay" novalidate style="margin-top: 12px">' + (t === 'sepa' ? '<button type="button" class="fillbtn" data-act="pay-fill">' + icon('play', 13) + 'Nur testen? Beispiel-IBAN einsetzen</button>' + inp('Kontoinhaber', 'inhaber', 'wie auf dem Kontoauszug', 'name') + inp('IBAN', 'iban', 'DE00 0000 0000 0000 0000 00', 'off') +
      '<label class="agree' + (e.mandat ? ' has-err' : '') + '"><input type="checkbox" data-in="pay:mandat"' + (s.mandat ? ' checked' : '') + '><span>Ich erteile Fensterino ein SEPA-Firmenlastschrift-Mandat für dieses Geschäftskonto.</span></label>' + fe('mandat')
      : inp('Karteninhaber', 'inhaber', 'Name auf der Karte', 'cc-name') + '<div class="note">Die Kartennummer geben Sie im sicheren Feld des Zahlungsdienstleisters ein. Fensterino sieht sie nie.</div>') +
    '</form><p class="km-s">Demo: Es wird nichts gespeichert oder abgebucht.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Später</button><button type="button" class="btn primary" data-act="pay-save">' + (s.then && s.then !== 'service' ? 'Speichern und ' + X.planName(s.then) + ' starten' : w ? 'Speichern und freischalten' : 'Speichern') + '</button></div>';
}

/* ---------- Aktionen ---------- */
function act(name, el) {
  const v = el.getAttribute('data-v'), id = el.getAttribute('data-id'), cid = el.getAttribute('data-c');
  const findLink = () => A().links.find((l) => l.id === id);
  switch (name) {
    case 'none': return;
    case 'go': return go(v, id !== null ? id : undefined);
    case 'nav': return nav(v);
    case 'back': return back();
    case 'sheet': { S.sheet = { k: v, id: id }; return render(); }
    case 'sheet-close': { S.sheet = null; return render(); }
    case 'toast': return toast(v);
    case 'reg': {
      if (Server.an) { if (S.acc[Server.id] && Server.sitzung) return login('betrieb', Server.id); if (Server.sitzung) { S.sheet = null; S.reg = { role: 'betrieb', path: 'service', step: 1, d: { mail: Server.sitzung.mail }, err: {}, server: true }; return go('reg'); } S.sheet = { k: 'login', zweck: 'reg' }; return render(); }
      S.sheet = null; S.reg = { role: 'betrieb', path: 'service', step: 1, d: {}, err: {} }; if (S.screen === 'reg') { S.animNext = true; render(); window.scrollTo(0, 0); return; } return go('reg');
    }
    case 'reg-prev': { const r = S.reg; r.err = {}; if (r.step > firstStep(r)) { r.step--; S.animNext = true; render(); window.scrollTo(0, 0); return; } return back(); }
    case 'reg-next': {
      const r = S.reg, steps = regSteps(r);
      if (!regValidate(r)) { S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); if (window.Haptik) window.Haptik.fehler(); } return; }
      if (r.step < steps.length - 1) { r.step++; S.animNext = true; render(); window.scrollTo(0, 0); return; }
      return regFinish();
    }
    case 'reg-fill': { const r = S.reg, smp = SAMPLE[regKey(r)]; if (!smp) return; Object.keys(smp).forEach((k) => { r.d[k] = Array.isArray(smp[k]) ? smp[k].slice() : smp[k]; }); if (r.d.mail && S.logins[r.d.mail]) r.d.mail = r.d.mail.replace('@', '+' + Math.floor(Math.random() * 900 + 100) + '@'); r.err = {}; return render(); }
    case 'reg-chip': { const r = S.reg, k = el.getAttribute('data-k'), arr = r.d[k] || [], i = arr.indexOf(v); r.d[k] = i >= 0 ? arr.filter((x) => x !== v) : arr.concat([v]); delete r.err[k]; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'reg-set': { const r = S.reg, k = el.getAttribute('data-k'); r.d[k] = v; delete r.err[k]; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'reg-toggle': { const r = S.reg, def = v === 'push'; r.d[v] = !(r.d[v] !== undefined ? r.d[v] : def); S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'login-submit': {
      const s = S.sheet, mail = String(s.mail || '').trim().toLowerCase(), u = S.logins[mail];
      if (VAL.mail(mail) !== true) { s.err = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return render(); }
      if (!u) { s.err = 'Zu dieser E-Mail gibt es kein Konto. Registrieren oder einen Demo-Zugang nutzen.'; return render(); }
      if (String(s.pw || '').length < 8) { s.err = 'Das Passwort ist zu kurz. Demo: jedes Passwort ab 8 Zeichen.'; return render(); }
      return login(u.role, u.id);
    }
    case 'srv-code': { const sh = S.sheet; if (!sh) return; return Server.codeSenden(String(sh.mail || '').trim().toLowerCase()); }
    case 'srv-login': { const sh = S.sheet; if (!sh) return; return Server.codePruefen(sh.mail, String(sh.code || '').replace(/\s+/g, '')); }
    case 'srv-mail': { if (S.sheet) { S.sheet.schritt = 'mail'; S.sheet.err = ''; } return render(); }
    case 'srv-zahlungsart': return Server.zahlungsart();
    case 'demo-as': {
      if (v === 'visitor') { S.role = null; S.sheet = null; nav('landing'); return toast('Startseite wie ein neuer Besucher'); }
      if (S.acc[v]) return login('betrieb', v, 'Ansicht: ' + comp(v).name);
      return;
    }
    case 'reset': { try { localStorage.removeItem(STORE); } catch (e) { /* ok */ } S = seed(); nav('landing'); return toast('Demo zurückgesetzt'); }
    case 'logout': { if (Server.online()) Server.abmelden(); S.role = null; S.sheet = null; nav('landing'); return toast('Abgemeldet'); }
    case 'notif-open': { const i = +el.getAttribute('data-i'), n = notifs()[i]; if (!n) return; n.new = false; Server.konto({ gelesenIndex: i }); if (n.to) return go(n.to[0], n.to[1]); return render(); }
    case 'read-all': { notifs().forEach((n) => { n.new = false; }); Server.konto({ gelesen: true }); return render(); }
    case 'konto': {
      const a = A(), k = ['service', 'abo', 'plus'].includes(v) ? v : 'service';
      if (Server.online()) return Server.plan(k);
      if (X.RANG[k] > X.RANG[X.konto(a)] && !a.pay) { S.sheet = { k: 'pay', then: k, type: 'sepa' }; return render(); }
      const r = X.planWechsel(a, k); S._pop = { act: name, v: v, k: '' }; save(); render(); return toast(r.msg);
    }
    case 'bpref': { const p = A().prefs = A().prefs || {}; p[v] = !(p[v] !== undefined ? p[v] : true); Server.konto({ prefs: p }); S._pop = { act: name, v: v, k: '' }; render(); return toast('Gespeichert'); }
    /* Fensterbauer: Kundenlinks */
    case 'lfilt': { S.lfilt = v; return render(); }
    case 'nl-set': { const n = S.nl; if (!n) return; const k = el.getAttribute('data-k'); n[k] = n[k] === v ? '' : v; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'nl-plan': { const n = S.nl; if (!n) return; const arr = n.plan || []; n.plan = arr.indexOf(v) >= 0 ? arr.filter((x) => x !== v) : arr.concat([v]); S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'nl-days': { S.nl.days = +v; return render(); }
    case 'nl-du': { S.nl.du = v === 'du'; return render(); }
    case 'nl-create': {
      const n = S.nl; n.err = {};
      if (String(n.kunde || '').trim().length < 2) { n.err.kunde = 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.'; S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); if (window.Haptik) window.Haptik.fehler(); } return; }
      if (Server.online()) return Server.projektAnlegen(n);
      const l = X.neuesProjekt(A(), n).l;
      S.nl = null; S.justCreated = l.id; S._feier = 'projekt'; S.hist = S.hist.filter((h) => h[0] !== 'newlink'); S.screen = 'links'; go('link', l.id); setTimeout(() => { if (S.justCreated === l.id) { S.justCreated = null; } }, 6000); return;
    }
    case 'l-share': {
      const l = findLink(); if (!l) return;
      if (v === 'link' || v === 'Text') { copyText(v === 'link' ? linkURL(l) : linkMsg(l), v === 'link' ? 'Link kopiert' : 'Nachricht kopiert'); }
      if (l.status === 'erstellt') { l.status = 'gesendet'; l.via = v === 'link' ? 'Link kopiert' : v === 'Text' ? 'Text kopiert' : v; l.log.gesendet = stamp(); S._feier = 'gesendet'; Server.projekt(l.id, { gesendet: true, via: l.via }); setTimeout(() => refresh(), 400); }
      return;
    }
    case 'l-du': { const l = A().links.find((x) => x.id === S.sel); if (!l) return; l.du = v === 'du'; l.msg = ''; Server.projekt(l.id, { du: l.du }); return render(); }
    case 'l-reset-msg': { const l = findLink(); if (l) l.msg = ''; return render(); }
    case 'l-sim': { if (Server.online()) return toast('In Ihrem echten Konto gibt es keine Simulation: Öffnen Sie den Link als Kunde und messen Sie.'); const l = findLink(); if (!l) return; if (l.status === 'erstellt') { l.status = 'gesendet'; l.via = l.via || 'WhatsApp'; l.log.gesendet = stamp(); } simLink(l, S.cur); render(); return toast('Demo: Der Kunde öffnet den Link'); }
    case 'l-deact': { const l = findLink(); if (l && l.status === 'eingegangen') { S.sheet = null; render(); return toast('Ein eingegangenes Aufmaß bleibt im Projekt und in der Abrechnung'); } if (l) { l.status = 'deaktiviert'; Server.projekt(l.id, { deaktivieren: true }); } S.sheet = null; render(); return toast('Link deaktiviert'); }
    case 'l-stage': { const l = findLink(); if (l) { l.stage = v; Server.projekt(l.id, { stage: v }); } S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'nl-next': { const n = S.nl; if (!n) return; n.err = {}; if (String(n.kunde || '').trim().length < 2) { n.err.kunde = 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.'; S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); if (window.Haptik) window.Haptik.fehler(); } return; } n.step = 1; S.dir = 'fwd'; return render(); }
    case 'nl-prev': { if (S.nl) { S.nl.step = 0; S.dir = 'back'; } return render(); }
    case 'l-days': { const l = findLink(); if (l) { l.days = +v; l.expires = dateIn(+v); Server.projekt(l.id, { days: +v }); } S._pop = { act: name, v: v, k: '' }; render(); return toast('Link gilt ' + v + ' Tage'); }
    case 'nb-send': {
      const l = findLink(); if (!l) return; const ok = nbMoeglich(l); if (ok !== 'ok') { S.sheet = null; render(); return toast(ok || 'Keine Nachbesserung möglich.'); }
      const hinweis = String((S.sheet && S.sheet.hinweis) || '').trim().slice(0, 300), r = X.nbAnfragen(l, hinweis);
      Server.projekt(l.id, { nb: { hinweis: hinweis } });
      S.sheet = null; S._feier = ''; render(); return toast(r.msg);
    }
    case 'nb-cancel': { const l = findLink(); X.nbZurueck(l); if (l) Server.projekt(l.id, { nbZurueck: true }); render(); return toast('Nachbesserung zurückgezogen. Das bisherige Aufmaß bleibt.'); }
    case 'liste-du': { if (S.sheet) S.sheet.du = v === 'du'; return render(); }
    case 'liste-create': {
      const s = S.sheet; if (!s) return; const ta = document.getElementById('liste-in'); if (ta) s.text = ta.value;
      const zeilen = String(s.text || '').split(/\n+/).map((z) => z.trim()).filter(Boolean).slice(0, 50);
      if (!zeilen.length) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Bitte mindestens einen Kunden eintragen, eine Zeile je Kunde.'); }
      if (Server.online()) return Server.listeAnlegen(s.text, !!s.du);
      const neu = X.listeProjekte(A(), s.text, !!s.du);
      if (!neu.length) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Keine gültige Zeile gefunden. Beispiel: Familie Weber, 0171 2345678'); }
      S.sheet = null; S.lfilt = 'offen'; S._feier = 'willkommen'; nav('links');
      return toast(nW(neu.length, 'Projekt angelegt', 'Projekte angelegt') + '. Jetzt die Links verschicken.');
    }
    case 'vonpdf-zu': { try { sessionStorage.setItem('aufmass.vonpdf.zu', '1'); } catch (e) { /* ok */ } return render(); }
    case 'l-again': { const l = findLink(); S.nl = { step: 0, kunde: l ? l.kunde.replace(/^Beispiel:\s*/, '') : '', kontakt: l ? l.kontakt || '' : '', adresse: l ? l.adresse || '' : '', geb: l ? l.geb || '' : '', fz: l ? l.fz || '' : '', plan: l ? (l.plan || []).slice() : ['Fenster'], note: '', days: 14, du: l ? !!l.du : false, err: {} }; return go('newlink'); }
    case 'demo-project': { const ex = A().links.find((x) => x.demo); if (ex) return go('link', ex.id); const l = { id: 'l' + Date.now().toString(36), code: newCode(), nr: 'Beispiel', demo: true, kunde: 'Beispiel: Familie Weber', kontakt: '0171 234 56 78', adresse: 'Lindenstraße 14, 50823 Köln', geb: 'efh', fz: '3 bis 5', plan: ['Fenster', 'Rollläden'], note: 'Beispielprojekt, wird nicht berechnet', created: 'heute', expires: dateIn(14), status: 'eingegangen', progress: 4, via: 'WhatsApp', du: false, log: { erstellt: stamp(), gesendet: stamp(), geoeffnet: stamp(), arbeit: stamp(), eingegangen: stamp() }, aufmass: aufmassOf(demoWins('weber'), projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' })), stage: 'neu', seen: true }; A().links.push(l); go('link', l.id); return toast('Beispiel: So kommt ein Aufmaß bei Ihnen an'); }
    case 'copy-am': { const l = findLink(); if (l && !l.locked) copyText(aufmassText(l), 'Aufmaß als Text kopiert'); return; }
    case 'pdf-am': { const l = findLink(); if (l && !l.locked) saveAm(l); return; }
    case 'pay-type': { if (S.sheet) { S.sheet.type = v; S.sheet.err = {}; } return render(); }
    case 'pay-fill': { if (S.sheet) { S.sheet.inhaber = BC().name; S.sheet.iban = 'DE89 3704 0044 0532 0130 00'; S.sheet.mandat = true; S.sheet.err = {}; } return render(); }
    case 'pay-save': {
      const s = S.sheet; if (!s) return; const t = s.type || 'sepa', err = {};
      if (String(s.inhaber || '').trim().length < 2) err.inhaber = t === 'sepa' ? 'Bitte den Kontoinhaber eingeben.' : 'Bitte den Karteninhaber eingeben.';
      if (t === 'sepa' && !ibanOk(s.iban)) err.iban = 'Diese IBAN stimmt nicht. Bitte prüfen: DE und 20 Ziffern.';
      if (t === 'sepa' && !s.mandat) err.mandat = 'Bitte das Mandat bestätigen.';
      s.err = err; if (Object.keys(err).length) return render();
      const a = A(), then = s.then;
      a.pay = t === 'sepa' ? { type: 'SEPA-Firmenlastschrift', label: ibanMask(s.iban), inhaber: String(s.inhaber).trim(), when: stamp() } : { type: 'Kreditkarte', label: 'über Zahlungsdienstleister', inhaber: String(s.inhaber).trim(), when: stamp() };
      S.sheet = null;
      const r = then && then !== 'service' ? X.planWechsel(a, then) : { n: X.unlockWaiting(a) };
      save(); render();
      return toast(then && then !== 'service' ? r.msg : r.n ? nW(r.n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : 'Zahlungsart gespeichert');
    }
    case 'pos-all': { const ds = Array.from(document.querySelectorAll('.poslist details')), open = ds.some((d) => !d.open); ds.forEach((d) => { d.open = open; }); el.textContent = open ? 'Alle zuklappen' : 'Alle aufklappen'; return; }
    case 'linkimport': {
      const ta = document.getElementById('code-in'), code = ta ? ta.value : '', o = unpack(code);
      if (!o) { if (ta) { ta.classList.add('bad'); ta.focus(); } return toast('Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.'); }
      if (Server.online()) return Server.importieren(code);
      const r = X.importCode(A(), o);
      if (!r.ok) { if (r.l && (r.art === 'schon' || r.art === 'doppelt')) { S.sheet = null; go('link', r.l.id); } else if (ta) { ta.classList.add('bad'); ta.focus(); } return toast(r.msg); }
      if (r.notif) notify(S.cur, r.notif);
      S.sheet = null; S.justCreated = null; S._feier = r.feier || ''; go('link', r.l.id); return toast(r.msg);
    }
    case 'copy': return copyText(v, 'Kopiert');
    default: return;
  }
}
function copyText(text, ok) {
  try { navigator.clipboard.writeText(text).then(() => toast(ok), () => fallbackCopy(text, ok)); } catch (e) { fallbackCopy(text, ok); }
}
function fallbackCopy(text, ok) {
  const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
  let done = false; try { done = document.execCommand('copy'); } catch (e) { done = false; }
  ta.remove(); toast(done ? ok : 'Bitte den Text markieren und kopieren');
}
/* ---------- Eingaben ---------- */
function onInput(el, ev) {
  if (el.getAttribute('data-in') === 'nb-hinweis') { if (S.sheet) S.sheet.hinweis = el.value; return; }
  if (el.getAttribute('data-in') === 'liste') { if (S.sheet) S.sheet.text = el.value; return; }
  const k = el.getAttribute('data-in'), v = el.type === 'checkbox' ? el.checked : el.value, i = k.indexOf(':'), ns = i >= 0 ? k.slice(0, i) : k, f = i >= 0 ? k.slice(i + 1) : '';
  if (ns === 'r') { const r = S.reg; if (!r) return; r.d[f] = v; if (r.err && r.err[f]) { delete r.err[f]; const box = el.closest('.f, .agree'); if (box) { box.classList.remove('has-err'); const er = box.querySelector('.err'); if (er) er.remove(); } } if (f === 'agb' && ev.type === 'change') { const er = document.querySelector('.agree + .err'); if (er && v) er.remove(); } return; }
  if (ns === 'lg') { if (S.sheet) S.sheet[f] = v; return; }
  if (ns === 'nl') { if (!S.nl) return; S.nl[f] = v; if (S.nl.err && S.nl.err[f]) { delete S.nl.err[f]; const box = el.closest('.f'); if (box) { box.classList.remove('has-err'); const er = box.querySelector('.err'); if (er) er.remove(); } } if (f === 'kunde') pvUpdate(); return; }
  if (ns === 'lmsg') { const l = A().links.find((x) => x.id === f); if (l) { l.msg = v; if (ev.type === 'change') Server.projekt(l.id, { msg: v }); } return; }
  if (ns === 'pay') { if (!S.sheet) return; S.sheet[f] = v; if (S.sheet.err && S.sheet.err[f]) { delete S.sheet.err[f]; const box = el.closest('.f, .agree'); if (box) { box.classList.remove('has-err'); const er = box.nextElementSibling && box.nextElementSibling.classList.contains('err') ? box.nextElementSibling : box.querySelector('.err'); if (er) er.remove(); } } return; }
  if (ns === 'pnote') { if (ev.type !== 'change') return; const l = A().links.find((x) => x.id === f); if (l) { l.note = v; Server.projekt(l.id, { note: v }); save(); toast('Notiz gespeichert'); } return; }
  if (ns === 'ab') { const ab = A().abzug || (A().abzug = { seite: 15, oben: 15 }); ab[f] = Math.max(0, Math.min(60, parseInt(v, 10) || 0)); const ex = document.getElementById('ab-ex'); if (ex) ex.textContent = abEx(ab); if (ev.type === 'change') { Server.konto({ abzug: ab }); save(); toast('Gespeichert'); } return; }
  if (k.indexOf('roi-') === 0) { S.roi = S.roi || { n: 12, t: 75, r: 65 }; S.roi[k.slice(4)] = +v; const r = S.roi, vv = roiVals(r.n, r.t, r.r), put = (i, t) => { const e2 = document.getElementById(i); if (e2) e2.textContent = t; }, lauf = (i, zu) => { const e2 = document.getElementById(i); if (!e2) return; const von = +(e2.getAttribute('data-count') || 0); e2.setAttribute('data-count', String(zu)); if (matchMedia('(prefers-reduced-motion: reduce)').matches) e2.textContent = eur(zu); else countUp(e2, von, zu, 'eur'); }; put('roi-n-l', String(r.n)); put('roi-t-l', r.t + ' Min.'); put('roi-r-l', r.r + '\u00a0€'); lauf('roi-c', vv.cost); put('roi-h', vv.hours + ' Stunden unterwegs und beim Kunden'); lauf('roi-l', vv.lm); put('roi-lp', vv.plan); return; }
  if (ns === 'lmemo') { if (ev.type !== 'change') return; const l = A().links.find((x) => x.id === f); if (l) { l.memo = v; Server.projekt(l.id, { memo: v }); save(); toast('Notiz gespeichert'); } return; }
  if (ns === 'b') { if (ev.type !== 'change') return; A()[f] = String(v).trim(); const o = {}; o[f] = A()[f]; Server.konto(o); save(); return toast('Gespeichert'); }
}
const root = document.getElementById('app');
root.addEventListener('click', (e) => {
  const el = e.target.closest ? e.target.closest('[data-act]') : null; if (!el || el.disabled) return;
  if (el.tagName !== 'A') e.preventDefault();
  const name = el.getAttribute('data-act');
  if (window.Haptik && el.matches('.seg > button, .chip, .opt, .pipe > button, .switch, .tabs button, .colors button, .col')) window.Haptik.tick();
  if (el.classList.contains('btn')) { const r = el.getBoundingClientRect(); el.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100).toFixed(0) + '%'); el.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100).toFixed(0) + '%'); }
  if (name === 'l-share' && el.tagName === 'A') { const l = A().links.find((x) => x.id === el.getAttribute('data-id')); if (l) { const v = el.getAttribute('data-v'), msg = encodeURIComponent(linkMsg(l)); el.href = v === 'WhatsApp' ? 'https://wa.me/' + (isPhone(l.kontakt) ? intl(l.kontakt) : '') + '?text=' + msg : v === 'SMS' ? 'sms:' + (isPhone(l.kontakt) ? String(l.kontakt).replace(/\s/g, '') : '') + '?body=' + msg : 'mailto:' + (/@/.test(l.kontakt || '') ? l.kontakt : '') + '?subject=' + encodeURIComponent('Ihr Fenster-Aufmaß für ' + BC().name) + '&body=' + msg; } }
  act(name, el);
});
root.addEventListener('submit', (e) => { e.preventDefault(); const f = e.target.getAttribute('data-form'); if (f === 'srvlogin') act(S.sheet && S.sheet.schritt === 'code' ? 'srv-login' : 'srv-code', e.target); if (f === 'login') act('login-submit', e.target); if (f === 'reg') act('reg-next', e.target); if (f === 'nl') act(S.nl && S.nl.step ? 'nl-create' : 'nl-next', e.target); });
root.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && S.sheet) { S.sheet = null; render(); }
  if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') { const form = e.target.closest('form'); if (form) { e.preventDefault(); const f = form.getAttribute('data-form'); if (f === 'srvlogin') act(S.sheet && S.sheet.schritt === 'code' ? 'srv-login' : 'srv-code', form); else if (f === 'login') act('login-submit', form); else if (f === 'reg') act('reg-next', form); else if (f === 'nl') act(S.nl && S.nl.step ? 'nl-create' : 'nl-next', form); } }
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('pt')) { e.preventDefault(); act(e.target.getAttribute('data-act'), e.target); }
});
root.addEventListener('input', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
root.addEventListener('change', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
tick();
setInterval(tick, 60000);
render();
Server.start().then((an) => { if (an) { document.querySelectorAll('.fx-pilot').forEach((e) => e.remove()); render(); setInterval(() => Server.aktualisieren(), 30000); } else if (Server.status) render(); });


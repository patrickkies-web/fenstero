'use strict';
/* Fenster-Modell (AW) und Abrechnungsregeln (X) kommen aus /assets/modell.js, gemeinsam mit dem Server */
const AW = window.AW, X = window.Abrechnung;
/* Signature-Dashboard (Strang E, docs/INSTANZEN.md): Auf dem Haupthost einer Konfigurator-Instanz mit Merkmal dashboard lädt die Hülle
   web/betrieb/index.html diesen Betriebsbereich (data-seite="betrieb", window.KONFIG.instanz aus /config.js?betrieb=1). Dann gilt INST:
   Marke des Betriebs statt eeziframes, Anmeldung per Code mit Sitzung im Cookie (kein Token im Browser), Projekte aus der Tabelle
   anfragen (functions/api/dashboard.js), keine Abrechnung, keine Preise, keine Tour, keine Registrierung. Ohne INST ändert sich nichts. */
const INST = (window.KONFIG && window.KONFIG.instanz && window.KONFIG.instanz.m && window.KONFIG.instanz.m.dashboard && document.body && document.body.getAttribute('data-seite') === 'betrieb') ? window.KONFIG.instanz : null;
const P = () => X.preise();
const eur2 = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
/* ---------- Grundlagen ---------- */
/* Adressen aus der aktuellen Seite: läuft so auf pages.dev und auf der eigenen Domain */
const APP_URL = new URL(INST ? '/' : '/app/', location.href).href; // Instanz: die App liegt unter / derselben Domain (Links https://<host>/#k-…)
const LOCAL = false;
const APP_OPEN = APP_URL;
/* Einstieg ins Ausmessen: die App beginnt gleich mit dem ersten Schritt (Stelle und Element) statt mit ihrer Startseite; ein angefangenes Aufmaß wird fortgesetzt */
const APP_START = INST ? APP_URL : APP_URL + '#ausmessen';
const appEinstieg = () => (eigenesAufmass() ? APP_OPEN : APP_START);
/* Angefangenes eigenes Aufmaß in diesem Browser (die App liegt unter derselben Adresse): dann „fortsetzen“ statt „ausmessen“ */
function eigenesAufmass() { try { const o = JSON.parse(localStorage.getItem('aufmass.v1') || 'null'); return o && Array.isArray(o.windows) ? o.windows.length : 0; } catch (e) { return 0; } }
const STORE = 'aufmass.portal.v1';
const LOGO = (px) => (INST ? instZeichen() : window.Logo ? window.Logo.svg(px) : '');
const WM = () => (INST ? '<span class="b-name">' + esc(INST.name) + '</span>' : window.Marke ? window.Marke.wort() : 'eeziframes');
/* Zeichen des Betriebs (Logo der Instanz oder Initiale in seiner Farbe), wie auf seiner Einladungsseite */
function instZeichen(groesse) { return window.Einladung ? window.Einladung.zeichen(INST.name, { logoUrl: INST.logo || '', col: INST.farbe || '', grund: 'hell' }, groesse || 'klein') : ''; }
const GEO = { '50667': [50.938, 6.957, 'Köln', 'Altstadt'], '50823': [50.951, 6.918, 'Köln', 'Ehrenfeld'], '51103': [50.934, 7.025, 'Köln', 'Kalk'], '50939': [50.918, 6.933, 'Köln', 'Sülz'], '53111': [50.737, 7.098, 'Bonn', 'Zentrum'], '53173': [50.700, 7.160, 'Bonn', 'Bad Godesberg'], '51373': [51.031, 6.988, 'Leverkusen', 'Wiesdorf'], '40213': [51.224, 6.776, 'Düsseldorf', 'Altstadt'], '51429': [50.985, 7.137, 'Bergisch Gladbach', 'Bensberg'], '50354': [50.871, 6.868, 'Hürth', 'Hermülheim'], '50259': [50.996, 6.806, 'Pulheim', 'Stadt'], '53840': [50.816, 7.149, 'Troisdorf', 'Mitte'], '50668': [50.950, 6.960, 'Köln', 'Neustadt-Nord'], '51063': [50.960, 7.000, 'Köln', 'Mülheim'] };
/* Betriebe kommen nur aus Registrierung oder Server; Demo-Konten gibt es nicht mehr, die Tour zeigt den Ablauf */
const BASE_COMPANIES = [];
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
/* Zeitpunkt wird absolut gespeichert („22.10., 09:50“ wie X.stamp), „heute“ und „gestern“ entstehen erst beim Anzeigen (zeitText) */
function stamp() { return window.Abrechnung.stamp(); }
function zeitText(t) {
  const m = /^(\d{2})\.(\d{2})\., (\d{2}:\d{2})$/.exec(String(t || '')); if (!m) return String(t || '');
  const tag = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return two(d.getDate()) + '.' + two(d.getMonth() + 1); }, k = m[1] + '.' + m[2];
  return k === tag(0) ? 'heute, ' + m[3] : k === tag(1) ? 'gestern, ' + m[3] : String(t);
}
function dateIn(days) { const d = new Date(); d.setDate(d.getDate() + days); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); }
const parseDE = (s) => { const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s || '').trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1], 23, 59, 59) : null; };
const datumDE = (ts) => { const d = new Date(ts); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); };
const hashN = X.hashN;
/* ---------- Beispieldaten ---------- */
const nW = (n, one, many) => n + ' ' + (n === 1 ? one : many);
/* Beispiel-Befunde der KI: die Einbausituation, wie sie beim Fensterbauer ankommt (das alte Fenster beschreibt die KI nicht) */
const KI = {
  wohnen: { chips: ['Rollladenkasten innen', 'Fensterbank Naturstein', 'Heizkörper darunter', 'Putzfassade'], rows: [['Rollladen', 'Einbaukasten innen über der Öffnung mit Revisionsdeckel, Gurt mit Unterputz-Wickler links'], ['Anschlag', 'Innenanschlag, Blendrahmen sitzt etwa 2 cm hinter der Innenkante'], ['Fensterbank innen', 'Naturstein, etwa 25 cm tief, über dem Heizkörper'], ['Heizung', 'Heizkörper direkt unter dem Fenster'], ['Fassade', 'Putz auf Mauerwerk, Außenanschlag etwa 3 cm'], ['Zugang', 'Erdgeschoss, kein Gerüst nötig']], hints: ['Der Gurtwickler sitzt in der Laibung; nach dem Ausbau ist Putz nachzuarbeiten.'], pruefen: ['Dämmung und Luftdichtheit des Rollladenkastens prüfen.'] },
  kueche: { chips: ['Fliesenspiegel an der Laibung', 'Arbeitsplatte davor', 'Fensterbank Kunststoff'], rows: [['Laibung', 'Fliesenspiegel bis an den Blendrahmen'], ['Fensterbank innen', 'Kunststoff, weiß'], ['Hindernisse', 'Arbeitsplatte mit Spüle unter dem Fenster, der Flügel muss darüber aufgehen'], ['Elektro', 'Steckdose in der Brüstung neben der Spüle']], hints: ['Für den Ausbau die Arbeitsplatte freiräumen; Fliesen am Rahmen können beschädigt werden.'], pruefen: [] },
  bad: { chips: ['Fliesenlaibung', 'kein Rollladen', 'Obergeschoss'], rows: [['Laibung', 'Gefliest, Fliesen laufen bis an den Blendrahmen'], ['Rollladen', 'Kein Kasten, kein Sonnenschutz'], ['Feuchte', 'Feuchteflecken in der unteren Laibungsecke'], ['Besonderheit', 'Bad: Sichtschutz und Lüftung beim neuen Fenster mitdenken']], hints: ['Die Fliesen an der Laibung werden beim Ausbau wahrscheinlich beschädigt.'], pruefen: ['Ursache der Feuchte in der Laibungsecke klären.'] },
  schlafen: { chips: ['Rollladenkasten innen', 'Putzfassade', 'Obergeschoss'], rows: [['Rollladen', 'Einbaukasten innen, Gurt mit Aufputz-Wickler'], ['Fassade', 'Putz, Außenanschlag erkennbar'], ['Zugang', 'Obergeschoss, Montage von innen möglich']], hints: [], pruefen: ['Rollladenkasten auf Dämmung prüfen.'] },
  laden: { chips: ['Klinkerfassade', 'Erdgeschoss zur Straße', 'Schaufenster'], rows: [['Fassade', 'Klinker, vermutlich zweischalig'], ['Anschlag außen', 'Stumpfer Anschlag, Rahmen sitzt bündig in der Klinkerlaibung'], ['Fensterbank außen', 'Naturstein mit Tropfkante'], ['Einbruchschutz', 'Zur Straße, leicht erreichbar: RC 2 empfehlen'], ['Besonderheit', 'Beschriftung auf dem Glas, muss neu angebracht werden']], hints: [], pruefen: ['Lastabtragung über dem großen Element prüfen.'] },
  back: { chips: ['Fliesen bis zum Rahmen', 'Lebensmittelbetrieb', 'hohe Brüstung'], rows: [['Laibung', 'Gefliest bis an den Blendrahmen'], ['Brüstung', 'Hohe Brüstung über der Arbeitsfläche'], ['Besonderheit', 'Lebensmittelbetrieb: Insektenschutz einplanen']], hints: [], pruefen: [] }
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
function seed() {
  return {
    v: 5, role: null, screen: 'landing', sel: null, hist: [],
    acc: {},
    cur: null, myCompanies: [],
    logins: {},
    notif: {},
    reg: null, nl: null, lfilt: 'alle', sheet: null,
    ansicht: 'kunde'
  };
}

let S = seed();
try { const raw = localStorage.getItem(STORE); if (raw) { const o = JSON.parse(raw); if (o && o.v === 5 && o.acc) S = Object.assign(seed(), o, { sheet: null, tour: null }); } } catch (e) { /* ohne Speicher weiter */ }
/* Frühere Demo-Konten (Fensterbau Brandt, Glaserei Vogt) gibt es nicht mehr: aus dem Speicher nehmen, eine Demo-Sitzung endet */
['c1', 'c7'].forEach((id) => { if ((S.myCompanies || []).some((c) => c.id === id)) return; delete S.acc[id]; if (S.notif) delete S.notif[id]; Object.keys(S.logins || {}).forEach((m) => { if (S.logins[m].id === id) delete S.logins[m]; }); if (S.cur === id) { S.cur = null; S.role = null; S.screen = 'landing'; S.hist = []; } });
if (INST) { S = seed(); S.screen = 'anmelden'; }
/* Instanz-Modus: im Browser bleiben nur die Codes der Projekte (die App derselben Domain erkennt daran „Als Kunde öffnen“, app.js
   linkImBetrieb), keine Kundendaten; alles andere kommt nach dem Laden der Seite vom Server */
function save() { if (INST) { try { const a = S.acc[Server.id]; localStorage.setItem(STORE, JSON.stringify({ v: 5, acc: a ? { srv: { links: (a.links || []).map((l) => ({ code: l.code })) } } : {} })); } catch (e) { /* ok */ } return; } try { const o = Object.assign({}, S, { sheet: null }); ['justCreated', '_pop', '_focusErr', 'animNext', '_feier', 'tour'].forEach((k) => delete o[k]); localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) { /* ok */ } }
/* ---------- Server (Stufe 2) ----------
   Meldet /api/status „daten“, liegt das Konto des Betriebs auf dem Server (Supabase) und Zahlungen laufen über Stripe.
   Ohne Server bleiben Konten lokal im Browser (Pilotphase); das Server-Konto heißt hier 'srv'. Jede Änderung geht an die API, der Server rechnet und zählt. */
const Server = {
  id: 'srv', status: null, sitzung: null, laeuft: false, stripe: null,
  get an() { return !!(this.status && this.status.daten); },
  online() { return this.an && S.role === 'betrieb' && S.cur === this.id && !!this.sitzung; },
  lesen() { if (INST) return; try { this.sitzung = JSON.parse(localStorage.getItem('aufmass.sitzung') || 'null'); } catch (e) { this.sitzung = null; } },
  merken(x) { this.sitzung = x; if (INST) return; try { if (x) localStorage.setItem('aufmass.sitzung', JSON.stringify(x)); else localStorage.removeItem('aufmass.sitzung'); } catch (e) { /* ok */ } },
  async api(pfad, body, method) {
    const init = { method: method || (body ? 'POST' : 'GET'), headers: { accept: 'application/json' } };
    if (body) { init.headers['content-type'] = 'application/json'; init.body = JSON.stringify(body); }
    if (this.sitzung && this.sitzung.token) init.headers.authorization = 'Bearer ' + this.sitzung.token;
    let r = await fetch(pfad, init), j = await r.json().catch(() => null);
    if (r.status === 401 && this.sitzung && this.sitzung.refresh) {
      const er = await fetch('/api/konto/erneuern', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refresh: this.sitzung.refresh }) }).catch(() => null), e = er ? await er.json().catch(() => null) : null;
      if (e && e.ok) { this.merken(Object.assign({}, this.sitzung, { token: e.token, refresh: e.refresh })); init.headers.authorization = 'Bearer ' + e.token; r = await fetch(pfad, init); j = await r.json().catch(() => null); }
      else if (!er || er.status >= 500) { const err = new Error((e && e.fehler) || 'Die Anmeldung ist gerade nicht erreichbar. Bitte gleich noch einmal.'); err.status = 503; throw err; } // Störung: angemeldet bleiben
    }
    if (INST) this.instFehler(r.status, j, pfad);
    else {
      if (r.status === 401) { this.merken(null); if (S.cur === this.id) { S.role = null; nav('landing'); } }
      /* Von eeziframes gesperrt: abmelden, die Begründung kommt als Fehlermeldung (Hinweis oder Fehler im Anmeldeblatt) */
      if (r.status === 403 && j && j.gesperrt) { this.abmelden(); if (S.role === 'betrieb') { S.role = null; nav('landing'); } }
    }
    if (!r.ok || !j || j.ok === false) { const err = new Error(j && j.fehler ? j.fehler : 'Der Server antwortet gerade nicht.'); err.status = r.status; err.gesperrt = !!(j && j.gesperrt); err.umzug = (j && j.umzug) || ''; throw err; }
    return j;
  },
  /* wie api, aber die rohe Antwort (Fotos): mit Anmeldung, eine abgelaufene wird einmal erneuert */
  async roh(pfad) {
    const los = () => fetch(pfad, { headers: this.sitzung && this.sitzung.token ? { authorization: 'Bearer ' + this.sitzung.token } : {} });
    let r = await los();
    if (r.status === 401 && this.sitzung && this.sitzung.refresh) {
      const er = await fetch('/api/konto/erneuern', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refresh: this.sitzung.refresh }) }).catch(() => null), e = er ? await er.json().catch(() => null) : null;
      if (e && e.ok) { this.merken(Object.assign({}, this.sitzung, { token: e.token, refresh: e.refresh })); r = await los(); }
    }
    return r;
  },
  /* Instanz-Modus: abgelaufene Sitzung (401), entzogener Zugang, Paket ohne Dashboard oder gesperrt (403, 404) melden ab; nach dem Ende
     (410) bleibt nur der Export */
  instFehler(status, j, pfad) {
    if (status === 401 && pfad !== '/api/konto/bestaetigen') { this.lokalWeg(); if (S.screen !== 'anmelden') nav('anmelden'); }
    else if (status === 403 && j && (j.abmelden || j.gesperrt)) { this.lokalWeg(); S.anmHinweis = j.fehler || ''; nav('anmelden'); }
    else if (status === 404 && j && j.fehler === 'not_found' && /^\/api\/konto/.test(pfad)) { this.lokalWeg(); S.anmHinweis = 'Dieses Dashboard ist nicht mehr verfügbar. Neue Anfragen kommen per E-Mail mit PDF.'; nav('anmelden'); }
    else if (status === 410 && j && j.beendet) { this.lokalWeg(true); S.beendet = true; nav('beendet'); }
  },
  /* Instanz-Modus: Konto aus diesem Browser nehmen (bleibt angemeldet: nur nach dem Ende, für den Export) */
  lokalWeg(angemeldet) {
    if (!angemeldet) this.sitzung = null;
    delete S.acc[this.id]; delete S.notif[this.id]; S.myCompanies = (S.myCompanies || []).filter((c) => c.id !== this.id); S.cur = null; S.role = null; S.sheet = null; VOLL.clear();
    try { localStorage.removeItem(STORE); } catch (e) { /* ok */ }
  },
  uebernehmen(konto) {
    if (!konto || !konto.acc) return;
    /* Instanz: keine Buchungen (modell.js ledger würde sonst eingegangene Projekte als gesperrt zählen); nachgeladene Aufmaße behalten */
    if (INST) { konto.acc.book = []; this.stand = konto.stand || ''; (konto.acc.links || []).forEach((l) => { const v = l.nachladen && VOLL.get(l.id); if (v) Object.assign(l, { aufmass: v.aufmass, vorher: v.vorher, nachladen: false }); }); }
    S.acc[this.id] = konto.acc; S.notif[this.id] = konto.acc.notif || [];
    S.myCompanies = (S.myCompanies || []).filter((c) => c.id !== this.id).concat([konto.company]); this.stripe = konto.stripe || null;
  },
  async laden() {
    if (INST) { const r = await this.api('/api/konto' + (this.stand ? '?stand=' + encodeURIComponent(this.stand) : '')); if (r.gleich) return null; this.uebernehmen(r.konto); return r.konto; } // unverändert: nur { gleich: true }
    const r = await this.api('/api/konto'); this.uebernehmen(r.konto); return r.konto;
  },
  async start() {
    try { const r = await fetch('/api/status', { headers: { accept: 'application/json' }, cache: 'no-store' }); this.status = r.ok ? await r.json() : null; } catch (e) { this.status = null; }
    if (this.status && this.status.preise) X.setPreise(this.status.preise);
    if (this.status && this.status.ok) X.setEinfuehrung(this.status.einfuehrung || null); // ab dem Stichtag kommt null: kein Hinweis mehr
    if (INST) return this.startInst();
    if (!this.an) { if (S.cur === this.id) { S.cur = null; if (S.role) S.role = null; } return false; }
    this.lesen();
    if (this.sitzung) { try { await this.laden(); if (!S.role || S.cur === this.id) { S.role = 'betrieb'; S.cur = this.id; } } catch (e) { if (e.gesperrt) toast(e.message); /* sonst Sitzung abgelaufen: Startseite */ } }
    else if (S.cur === this.id) { S.role = null; S.cur = null; }
    await this.linkAnmeldung();
    await this.rueckkehr();
    return true;
  },
  /* Instanz-Modus: ob angemeldet, sagt nur der Server (Cookie); sonst die Anmeldung, nach dem Ende der Export */
  async startInst() {
    if (!this.an) { S.anmHinweis = 'Gerade nicht erreichbar. Bitte in ein paar Minuten noch einmal.'; this.fertig = true; render(); return false; }
    try {
      const r = await this.api('/api/konto?start=1');
      if (r.angemeldet === false) { this.fertig = true; return true; } // keine Sitzung: die Anmeldung
      this.uebernehmen(r.konto); S.role = 'betrieb'; S.cur = this.id;
      this.sitzung = { mail: (((r.konto.acc.instanz || {}).zugang || []).find((z) => z.ich) || {}).mail || '' };
      if (['anmelden', 'beendet'].includes(S.screen)) S.screen = 'links';
    } catch (e) { /* 401: Anmeldung, 410: beendet (instFehler) */ }
    this.fertig = true;
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
  codeSenden(mail) { return this.tu(async () => { const sh = anmeldeBlatt(); if (VAL.mail(mail) !== true) { sh.err = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return render(); } try { await this.api('/api/konto/anmelden', { mail: mail }); } catch (e) { if (!INST) throw e; sh.err = e.message; return render(); } if (!INST) try { localStorage.setItem('aufmass.sitzung.anfrage', JSON.stringify({ mail: String(mail).trim().toLowerCase(), at: Date.now() })); } catch (e) { /* ok */ } sh.schritt = 'code'; sh.mail = mail; sh.err = ''; sh.code = ''; render(); toast('E-Mail ist unterwegs an ' + mail); }); },
  codePruefen(mail, code) { return this.tu(async () => { const sh = anmeldeBlatt(); let r; try { r = await this.api('/api/konto/bestaetigen', { mail: mail, code: code }); } catch (e) { sh.err = e.message; sh.umzug = e.umzug || ''; return render(); } this.nachAnmeldung(r); }); },
  /* Nach Code oder Anmeldelink: Sitzung merken, ins Konto oder (neue Adresse) den Betrieb eintragen */
  nachAnmeldung(r) {
    if (INST) {
      this.sitzung = { mail: r.mail }; S.anm = null; S.anmHinweis = '';
      if (r.konto) { this.uebernehmen(r.konto); S.beendet = false; return login('betrieb', this.id, 'Angemeldet bei ' + INST.name); }
      S.beendet = r.status === 'beendet'; S.role = null; return nav(S.beendet ? 'beendet' : 'anmelden');
    }
    try { localStorage.removeItem('aufmass.sitzung.anfrage'); } catch (e) { /* ok */ }
    this.merken({ token: r.token, refresh: r.refresh, mail: r.mail });
    if (r.konto) { this.uebernehmen(r.konto); S.sheet = null; S.reg = null; login('betrieb', this.id, 'Willkommen zurück, ' + String(r.konto.acc.ap || '').split(' ')[0]); }
    else { S.sheet = null; S.reg = { role: 'betrieb', path: 'service', step: 1, d: { mail: r.mail }, err: {}, server: true }; go('reg'); toast('Fast geschafft: noch Ihren Betrieb eintragen.'); }
  },
  /* Anmeldelink aus der E-Mail: Supabase leitet mit #access_token=…&refresh_token=… hierher zurück, bei Fehlern mit #error=…;
     die Werte verschwinden sofort aus der Adresszeile. Ohne Rückfrage nur, wenn dieser Browser die E-Mail für genau diese Adresse in
     der letzten Stunde angefordert hat oder schon so angemeldet ist; sonst könnte ein untergeschobener Link in ein fremdes Konto
     anmelden. Dann fragt das Blatt „linkfrage“ mit der Adresse des Kontos */
  async linkAnmeldung() {
    const h = new URLSearchParams(location.hash.replace(/^#/, '')), token = h.get('access_token'), fehler = h.get('error_code') || h.get('error');
    if (!token && !fehler) return false;
    history.replaceState(null, '', location.pathname + location.search);
    if (!token) { toast(fehler === 'otp_expired' ? 'Der Anmeldelink ist abgelaufen oder schon benutzt. Bitte fordern Sie einen neuen an.' : 'Die Anmeldung über den Link hat nicht geklappt. Bitte noch einmal.'); return true; }
    const r = await fetch('/api/konto/sitzung', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ token: token, refresh: h.get('refresh_token') || '' }) }).then((x) => x.json()).catch(() => null);
    if (!r || !r.ok) { toast((r && r.fehler) || 'Die Anmeldung über den Link hat nicht geklappt. Bitte noch einmal.'); return true; }
    let a = null; try { a = JSON.parse(localStorage.getItem('aufmass.sitzung.anfrage') || 'null'); } catch (e) { a = null; }
    if ((a && a.mail === r.mail && Date.now() - (Number(a.at) || 0) < 3600000) || (this.sitzung && this.sitzung.mail === r.mail)) { this.nachAnmeldung(r); return true; }
    S.sheet = { k: 'linkfrage', r: r }; render();
    return true;
  },
  registrieren(d) { return this.tu(async () => { const r = await this.api('/api/konto/registrieren', { firma: d.firma, ap: d.ap, tel: d.tel, plz: d.plz, col: d.col, agb: d.agb ? nbStand() : '', unternehmer: !!d.agb }); this.uebernehmen(r.konto); S.reg = null; S._feier = 'willkommen'; login('betrieb', this.id, 'Willkommen, ' + String(d.ap || '').trim().split(' ')[0]); }); },
  abmelden() { if (INST) { fetch('/api/konto/abmelden', { method: 'POST', headers: { accept: 'application/json' } }).catch(() => null); S.beendet = false; return this.lokalWeg(); } this.merken(null); delete S.acc[this.id]; delete S.notif[this.id]; S.myCompanies = (S.myCompanies || []).filter((c) => c.id !== this.id); S.cur = null; },
  projektAnlegen(n) { return this.tu(async () => { const r = await this.api('/api/konto/projekte', n); this.uebernehmen(r.konto); S.nl = null; S.justCreated = r.id; S._feier = 'projekt'; S.hist = S.hist.filter((h) => h[0] !== 'newlink'); S.screen = 'links'; go('link', r.id); setTimeout(() => { if (S.justCreated === r.id) S.justCreated = null; }, 6000); }); },
  listeAnlegen(text, du) { return this.tu(async () => { const r = await this.api('/api/konto/projekte/liste', { text: text, du: du }); this.uebernehmen(r.konto); S.sheet = null; S.lfilt = 'neu'; S._feier = 'willkommen'; nav('links'); toast(nW(r.n, 'Projekt angelegt', 'Projekte angelegt') + '. Jetzt die Links verschicken.'); }); },
  projekt(id, p) { if (!this.online()) return; this.api('/api/konto/projekte/' + encodeURIComponent(id), p, 'PATCH').then((r) => { this.uebernehmen(r.konto); }).catch((e) => toast(e.message)); },
  konto(p) { if (!this.online()) return; this.api('/api/konto', p, 'PATCH').then((r) => { this.uebernehmen(r.konto); }).catch((e) => toast(e.message)); },
  importieren(code) { return this.tu(async () => { const r = await this.api('/api/konto/import', { code: code }); this.uebernehmen(r.konto); const e = r.eingang; if (!e.ok) { if (e.id) { S.sheet = null; go('link', e.id); } else { const ta = document.getElementById('code-in'); if (ta) { ta.classList.add('bad'); ta.focus(); } } return toast(e.msg); } S.sheet = null; S.justCreated = null; S._feier = e.feier; go('link', e.id); toast(e.msg); }); },
  plan(k) { return this.tu(async () => { const r = await this.api('/api/konto/plan', { plan: k }); if (r.url) { toast('Weiter zu Stripe …'); location.href = r.url; return; } this.uebernehmen(r.konto); render(); toast(r.ergebnis.msg); }); },
  zahlungsart() { return this.tu(async () => { const r = await this.api('/api/konto/zahlungsart', {}); if (r.url) { toast('Weiter zu Stripe …'); location.href = r.url; } }); },
  async aktualisieren() { if (!this.online() || this.laeuft || S.sheet) return; try { const vorher = JSON.stringify(S.acc[this.id]); await this.laden(); if (JSON.stringify(S.acc[this.id]) !== vorher) refresh(); } catch (e) { if (e.gesperrt) { toast(e.message); refresh(); } /* sonst ruhig */ } }
};
/* ---------- Konten ---------- */
function allCompanies() { return BASE_COMPANIES.concat(S.myCompanies || []); }
const OHNE_BETRIEB = { id: '', plan: 'service', name: 'Ihr Betrieb', plz: '', col: '#0071e3' };
function comp(id) { return allCompanies().find((c) => c.id === id) || OHNE_BETRIEB; }
const A = () => S.acc[S.cur] || { links: [], book: [], rechnungen: [], prefs: {}, abzug: { seite: 15, oben: 15 }, konto: 'service', plan: 'service' };
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
  shield: I('<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
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
/* Schalter: die ganze Zeile ist das Ziel (mindestens 44 px), rechts der Schalter als Bild (S6) */
function sw(label, sub, on, act, v) { return '<button type="button" class="sw-row" role="switch" aria-checked="' + !!on + '" data-act="' + act + '" data-v="' + (v || '') + '"><span class="t"><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><span class="switch" aria-hidden="true"><span></span></span></button>'; }
const seg = (opts, cur, act, cls) => '<div class="seg' + (cls ? ' ' + cls : '') + '" role="tablist">' + opts.map((o) => '<button type="button" role="tab" data-act="' + act + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + esc(o[1]) + (o[2] ? ' <span class="n">' + o[2] + '</span>' : '') + '</button>').join('') + '</div>';
const empty = (title, text, btn, bild) => '<div class="empty">' + (bild ? '<span class="empty-l" data-lottie="' + bild + '" data-loop="1" aria-hidden="true"></span>' : '') + '<b>' + title + '</b><span>' + text + '</span>' + (btn || '') + '</div>';
/* Überschriften im Betriebsbereich wie in den Beiträgen (S6): Punkt am Ende und genau ein grünes Wort (.ak, ohne Angabe das letzte);
   der Kicker darüber steht in Grün. akSatz('Ihre Projekte.') → „Ihre <span class="ak">Projekte.</span>“ */
function akSatz(satz, i) {
  const w = String(satz == null ? '' : satz).trim().split(/\s+/), k = i == null || i >= w.length ? w.length - 1 : i < 0 ? Math.max(0, w.length + i) : i;
  return w.map((x, n) => (n === k ? '<span class="ak">' + esc(x) + '</span>' : esc(x))).join(' ');
}
const mitPunkt = (t) => (/[.!?…]$/.test(String(t || '').trim()) ? String(t).trim() : String(t || '').trim() + '.');
const kicker = (t) => '<p class="eyebrow kicker">' + t + '</p>';
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
function back() { if (S.screen === 'reg' && S.reg && S.reg.step > firstStep(S.reg)) { S.reg.err = {}; S.reg.step--; S.animNext = true; render(); window.scrollTo(0, 0); return; } if (S.screen === 'newlink' && S.nl && S.nl.step) { S.nl.step = 0; S.dir = 'back'; render(); window.scrollTo(0, 0); return; } const h = S.hist.pop(); if (!h) return nav(S.role && PARENT[S.screen] ? PARENT[S.screen] : home()); S.screen = h[0]; S.sel = h[1]; S.sheet = null; render(); window.scrollTo(0, 0); }
function home() { return S.role ? 'links' : INST ? 'anmelden' : 'landing'; }
function login(role, id, msg) { S.role = 'betrieb'; S.cur = id; S.sheet = null; S.reg = null; nav(home()); toast(msg || ('Angemeldet als ' + BC().name)); projektAnkerOeffnen(); }
/* ---------- Zurück im Browser und am Telefon (S6) ----------
   Der Betriebsbereich hält genau einen eigenen Eintrag im Verlauf des Browsers, die „Wache“, solange es in der Seite ein Zurück gibt:
   ein Bildschirm unter der Übersicht, ein offenes Blatt, ein Schritt in Registrierung, neuem Projekt oder Tour. Zurück im Browser
   landet auf dem Eintrag darunter; das fangen wir ab, gehen in der Seite einen Schritt zurück (Blatt zu, Schritt zurück, Bildschirm
   zurück) und stellen die Wache wieder auf, solange es noch weiter zurück geht. Auf der Übersicht ohne Blatt gibt es keine Wache,
   dann verlässt Zurück die Seite. Die Anker der Startseite (#hauseigentuemer, #fensterbauer) ersetzen weiter nur die Adresse. */
const WACHE = 'eeziBetrieb';
let wacheLeise = false, wacheAdresse = '';
const wacheDa = () => { try { return !!(history.state && history.state[WACHE]); } catch (e) { return false; } };
function zurueckMoeglich() {
  if (S.sheet || S.screen === 'tour') return true;
  if (S.screen === 'reg' && S.reg && S.reg.step > firstStep(S.reg)) return true;
  if (S.screen === 'newlink' && S.nl && S.nl.step) return true;
  return S.screen !== home() || S.hist.length > 0;
}
function wacheStellen() {
  try {
    const soll = zurueckMoeglich();
    if (soll && !wacheDa()) { const st = Object.assign({}, history.state || {}); st[WACHE] = 1; history.pushState(st, ''); }
    else if (!soll && wacheDa() && !wacheLeise) { wacheLeise = true; wacheAdresse = location.href; history.back(); } // die Adresse (Anker der Ansicht) bleibt die aktuelle
  } catch (e) { /* ohne Verlauf */ }
}
function zurueckIntern() {
  if (S.sheet) { S.sheet = null; return render(); }
  if (S.screen === 'tour' && S.tour) return S.tour.i > 0 ? tourGehe(S.tour.i - 1) : tourEnde();
  if (S.screen === 'newlink' && S.nl && S.nl.step) { S.nl.step = 0; S.dir = 'back'; return render(); }
  return back();
}
window.addEventListener('popstate', () => {
  if (wacheLeise) { wacheLeise = false; try { if (wacheAdresse && location.href !== wacheAdresse) history.replaceState(history.state, '', wacheAdresse); } catch (e) { /* ok */ } wacheAdresse = ''; return; }
  if (wacheDa()) return; // vorwärts auf die Wache: nichts zu tun
  zurueckIntern();
});
try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* ok */ }
/* Direkt zu einem Projekt (Link in der E-Mail „Aufmaß eingegangen“): /#projekt-<id>; ohne Anmeldung erst das Anmeldeblatt */
let ankerProjekt = '';
function projektAnkerOeffnen() {
  if (!ankerProjekt) return false;
  if (!S.role && INST) { if (Server.fertig && S.screen !== 'anmelden') nav('anmelden'); return false; } // nach der Anmeldung (login) geht es weiter
  if (!S.role) { if (!S.sheet) { S.sheet = { k: 'login' }; render(); } return false; }
  const l = A().links.find((x) => x.id === ankerProjekt);
  ankerProjekt = '';
  if (!l) { toast('Dieses Projekt gibt es in diesem Konto nicht.'); return false; }
  S.hist = []; S.screen = 'links'; go('link', l.id);
  return true;
}
let pendingRefresh = false;
/* ---------- Ansicht der öffentlichen Seiten: Hauseigentümer oder Fensterbauer ----------
   Umschalter oben in der Kopfzeile; jede Ansicht hat einen Anker (#hauseigentuemer, #fensterbauer, früher #betriebe), die Wahl
   bleibt gespeichert. „So funktioniert es“, Preise, Registrierung und Tour gehören zu den Fensterbauern. */
const FB_SCREENS = ['wie', 'preise', 'reg', 'tour'];
const ANKER = { kunde: 'hauseigentuemer', betrieb: 'fensterbauer' };
function ansicht() { return FB_SCREENS.includes(S.screen) ? 'betrieb' : (S.ansicht === 'betrieb' ? 'betrieb' : 'kunde'); }
function ansichtMerken(neu) {
  S.ansicht = neu === 'betrieb' ? 'betrieb' : 'kunde';
  try { if (location.hash !== '#' + ANKER[S.ansicht]) history.replaceState(history.state, '', location.pathname + location.search + '#' + ANKER[S.ansicht]); } catch (e) { /* ohne Verlauf */ }
}
/* Wechsel der Ansicht (Umschalter im Kopf, Karten am Ende, Baustein der Startseite) */
function zurAnsicht(v) {
  const neu = v === 'betrieb' ? 'betrieb' : 'kunde', gleich = S.screen === 'landing' && ansicht() === neu;
  ansichtMerken(neu);
  if (S.screen === 'tour') { clearTimeout(tourTimer); S.tour = null; }
  if (gleich) { window.scrollTo(0, 0); return; }
  S.animNext = true; window.scrollTo(0, 0); return nav('landing');
}
function umschalter() {
  const a = ansicht();
  return '<div class="seg ansicht" role="group" aria-label="Ansicht wählen"><button type="button" data-act="ansicht" data-v="kunde" aria-pressed="' + (a === 'kunde') + '">Hauseigentümer</button><button type="button" data-act="ansicht" data-v="betrieb" aria-pressed="' + (a === 'betrieb') + '">Fensterbauer</button></div>';
}
function refresh() { const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && document.getElementById('app').contains(a)) { pendingRefresh = true; return; } render(); }
document.addEventListener('focusout', () => { if (!pendingRefresh) return; setTimeout(() => { const a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return; pendingRefresh = false; render(); }, 50); });
function toast(t) { let el = document.getElementById('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); } el.textContent = t; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2600); }
function later(ms, fn) { setTimeout(() => { fn(); save(); refresh(); }, ms); }
/* ---------- Rahmen ---------- */
function navItems() { return INST ? [['links', 'Projekte', 'folder'], ['notif', 'Nachrichten', 'bell'], ['bprofil', 'Betrieb', 'user']] : [['links', 'Projekte', 'folder'], ['notif', 'Nachrichten', 'bell'], ['abrechnung', 'Abrechnung', 'card'], ['bprofil', 'Betrieb', 'user']]; }
const PARENT = { newlink: 'links', link: 'links', preise: 'abrechnung' };
function navCount(k) {
  if (k === 'notif') return newNotif();
  if (k === 'links') return A().links.filter((l) => l.status === 'eingegangen' && !l.seen).length;
  return 0;
}
function activeNav(k) { const p = PARENT[S.screen]; return S.screen === k || p === k || (S.hist.length && S.hist[0][0] === k && !navItems().some((n) => n[0] === S.screen)); }
const TITLES = { anmelden: 'Anmelden', beendet: 'Beendet', tour: 'Tour für Fensterbauer', landing: 'eeziframes', reg: 'Registrieren', wie: 'So funktioniert es', preise: 'Preise', notif: 'Nachrichten', links: 'Projekte', newlink: 'Neues Projekt', link: 'Projekt', abrechnung: 'Abrechnung', bprofil: 'Mein Betrieb' };
let lastScreen = null, lastNew = 0, io = null;
const LASTVALS = {};
function render() {
  if (S.role && !S.acc[S.cur]) S.role = null;
  const root = document.getElementById('app'), role = S.role, out = !role;
  if (INST) {
    if (out && S.screen !== 'anmelden' && !(S.screen === 'beendet' && S.beendet)) S.screen = 'anmelden';
    if (!out && ['anmelden', 'beendet', 'landing', 'reg', 'wie', 'preise', 'tour', 'abrechnung'].includes(S.screen)) S.screen = home();
  } else {
    if (out && !['landing', 'reg', 'wie', 'preise', 'tour'].includes(S.screen)) S.screen = 'landing';
    if (out && FB_SCREENS.includes(S.screen) && S.ansicht !== 'betrieb') ansichtMerken('betrieb');
    if (!out && ['landing', 'reg'].includes(S.screen)) S.screen = home();
  }
  const view = (SCREENS[S.screen] || SCREENS.landing)();
  const anim = S.screen !== lastScreen || !!S.animNext; S.animNext = false;
  root.className = 'app' + (out ? ' is-out' : '') + (INST ? ' inst' : '');
  let h = '';
  if (!out) h += sidebar();
  const canBack = S.hist.length > 0 || (!!role && !!PARENT[S.screen]) || (S.screen === 'reg' && !!S.reg && S.reg.step > 0);
  const backBtn = '<button type="button" class="back" data-act="back" aria-label="Zurück"><svg width="10" height="17" viewBox="0 0 11 19" aria-hidden="true"><path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Zurück</span></button>';
  const logo = INST ? '<span class="logo-s b-logo">' + instZeichen() + WM() + '</span>' : '<button type="button" class="logo-s" data-act="nav" data-v="landing" aria-label="Zur Startseite"><span class="lm">' + LOGO(32) + '</span>' + WM() + '</button>';
  /* Einführungspreis: Banner ganz oben, für Besucher je nach Ansicht, angemeldet nur im Tarif Start (gemeinsam.js EinfBanner) */
  /* Einführungspreise der Aufmaß-Links: nicht über der eingebetteten Paket-Landingpage (Ansicht Fensterbauer auf der Startseite), dort gelten die Pakete; auf Preise und für Konten mit Tarif weiter */
  const einfZeigen = !INST && S.screen !== 'tour' && !view.kopflos && (out || X.konto(A()) === 'service') && !(out && S.screen === 'landing' && ansicht() === 'betrieb'), einfArt = out ? ansicht() : 'betrieb';
  h += '<div class="main' + (view.kopflos ? ' kopflos' : '') + '">' + (einfZeigen ? window.EinfBanner(einfArt, einfArt === 'kunde' ? { href: appEinstieg() } : { act: 'go', v: 'preise' }) : '') + '<header class="top' + (out ? ' mit-ansicht' : '') + '">' + (canBack ? backBtn + (out ? logo.replace('class="logo-s"', 'class="logo-s neben-zurueck"') : '') : out ? logo : '') + (out && !INST ? umschalter() : '') + (out && S.screen === 'landing' ? '<div class="top-h"></div>' : '<h1>' + esc(view.title || TITLES[S.screen] || '') + '</h1>');
  /* Knöpfe nur für die gewählte Ansicht: Hauseigentümer messen in der App, Fensterbauer melden sich an oder starten ein Konto */
  if (out && INST) h += '';
  else if (out) h += ansicht() === 'kunde'
    ? '<a class="btn small ghost hide-s" href="/ratgeber/">Ratgeber</a><a class="btn small primary kopf-cta" href="' + appEinstieg() + '">' + (eigenesAufmass() ? 'Aufmaß fortsetzen' : 'Fenster ausmessen') + '</a>'
    : (S.screen !== 'preise' ? '<button type="button" class="btn small ghost hide-s" data-act="go" data-v="preise">Preise</button>' : '') + '<button type="button" class="btn small ghost" data-act="sheet" data-v="login">Anmelden</button>' + (S.screen !== 'reg' ? '<button type="button" class="btn small primary kopf-cta" data-act="reg" data-v="betrieb"><span class="hide-s">Kostenlos starten</span><span class="only-xs">Starten</span></button>' : '');
  else h += '<button type="button" class="ibtn" aria-label="Nachrichten" data-act="nav" data-v="notif">' + ICONS.bell + (newNotif() ? '<span class="dot"></span>' : '') + '</button>';
  h += '</header>';
  if (view.kopflos) h = h.slice(0, h.lastIndexOf('<header class="top')); // Ansicht Hauseigentümer: Kopf kommt aus dem Baustein
  h += '<div class="scr' + (anim ? ' anim' : '') + '" data-screen="' + S.screen + '">' + view.html + '</div>' + footer(!out) + '</div>';
  if (!out) h += '<nav class="tabs" aria-label="Bereiche">' + navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + '<span>' + esc(n[1]) + '</span>' + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>';
  if (S.sheet && SHEETS[S.sheet.k]) h += '<button type="button" class="sheet-bg" aria-label="Schließen" data-act="sheet-close"></button><div class="sheet" role="dialog" aria-modal="true"><span class="grip"></span><button type="button" class="xclose" aria-label="Schließen" data-act="sheet-close">×</button>' + SHEETS[S.sheet.k](S.sheet) + '</div>';
  root.innerHTML = h;
  afterRender(anim);
  lastScreen = S.screen;
  save();
  wacheStellen();
}
/* Avatar des Betriebs (Beitragslinie: Cream gehört dem Avatar): das Logo aus „Einladungsseite“, sonst die Initiale dunkel auf Cream */
function avatar(gross) {
  if (INST) return '<span class="av' + (gross ? ' gross' : '') + '" aria-hidden="true">' + esc(window.Einladung ? window.Einladung.initiale((Server.sitzung && Server.sitzung.mail) || BC().name) : 'B') + '</span>';
  const c = BC(), a = A(), ini = window.Einladung ? window.Einladung.initiale(c.name) : String(c.name || 'B').slice(0, 1);
  return a.logo ? '<span class="av av-logo' + (gross ? ' gross' : '') + '"><img src="' + esc(a.logo) + '" alt="Logo ' + esc(c.name) + '"></span>' : '<span class="av' + (gross ? ' gross' : '') + '" aria-hidden="true">' + esc(ini) + '</span>';
}
const INST_STATUS = { aktiv: 'Fensterplaner live', pausiert: 'Fensterplaner pausiert', einrichtung: 'Fensterplaner in Vorbereitung', beendet: 'Fensterplaner beendet' };
function sidebar() {
  if (INST) return '<aside class="side"><button type="button" class="logo b-logo" data-act="nav" data-v="' + home() + '">' + instZeichen() + '<span>' + esc(INST.name) + '<small>Projekte und Anfragen</small></span></button><nav class="nav">' +
    navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + esc(n[1]) + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>' +
    '<div class="me">' + avatar() + '<span class="me-t"><b>' + esc((Server.sitzung && Server.sitzung.mail) || BC().name) + '</b><small>' + esc(INST_STATUS[(A().instanz || {}).status] || '') + '</small></span><button type="button" class="ibtn out" data-act="logout" aria-label="Abmelden" title="Abmelden">' + icon('logout', 19) + '</button></div></aside>';
  const me = { n: BC().name, s: X.planName(X.konto(A())) + (Server.online() ? '' : ' · Pilotphase'), col: BC().col };
  return '<aside class="side"><button type="button" class="logo" data-act="nav" data-v="' + home() + '"><span class="lm">' + LOGO(36) + '</span><span>' + WM() + '<small>für Betriebe</small></span></button><nav class="nav">' +
    navItems().map((n) => { const c = navCount(n[0]); return '<button type="button" data-act="nav" data-v="' + n[0] + '" aria-current="' + (activeNav(n[0]) ? 'page' : 'false') + '">' + ICONS[n[2]] + esc(n[1]) + (c ? '<span class="cnt">' + c + '</span>' : '') + '</button>'; }).join('') + '</nav>' +
    '<div class="me">' + avatar() + '<span class="me-t"><b>' + esc(me.n) + '</b><small>' + esc(me.s) + '</small></span><button type="button" class="ibtn out" data-act="logout" aria-label="Abmelden" title="Abmelden">' + icon('logout', 19) + '</button></div><button type="button" class="btn small soft tour-side" data-act="tour">' + icon('play', 16) + 'Tour ansehen</button></aside>';
}
function footer(schlank) {
  /* Instanz: Impressum und Datenschutz der Instanz; angemeldet dazu Vertrag, Rechnungen und Support im Kundenkonto (E15) */
  if (INST) { const i = A().instanz || {}; return '<footer class="foot schlank b-fuss"><div class="wrap"><div class="row foot-links"><a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a>' + (schlank && i.kundenkonto ? '<a href="' + esc(i.kundenkonto) + '" target="_blank" rel="noopener">Vertrag, Rechnungen und Support</a>' : '') + '</div></div></footer>'; }
  /* Angemeldet (S6): eine schlanke Fußzeile mit Rechtslinks, „Vertrag widerrufen“, „So funktioniert es“, Preisen und Ratgeber */
  if (schlank) return '<footer class="foot schlank"><div class="wrap"><div class="row foot-links"><a class="foot-widerruf" href="/widerruf/">Vertrag widerrufen</a><button type="button" data-act="go" data-v="wie">So funktioniert es</button><button type="button" data-act="go" data-v="preise">Preise</button><a href="/ratgeber/">Ratgeber</a><a href="/nutzungsbedingungen/">Nutzungsbedingungen</a><a href="/agb/">AGB</a><a href="/datenschutz/">Datenschutz</a><a href="/cookies/">Cookies</a><a href="/impressum/">Impressum</a></div><p><span class="lm-foot">' + LOGO(18) + WM() + '</span> ' + (Server.an ? 'Ihre Projekte und Aufmaße liegen auf unserem Server; Zahlungen laufen über Stripe.' : 'Pilotphase: Konto und Projekte liegen in diesem Browser.') + '</p></div></footer>';
  return '<footer class="foot"><div class="wrap"><div class="row between"><span class="lm-foot">' + LOGO(22) + WM() + '</span><div class="row foot-links"><button type="button" data-act="go" data-v="wie">So funktioniert es für Betriebe</button><button type="button" data-act="tour">Tour für Fensterbauer</button><button type="button" data-act="go" data-v="preise">Preise für Betriebe</button><a href="/fuer-fensterbauer/">Konfigurator für Fensterbauer</a><a href="/ratgeber/">Ratgeber</a><a href="/nutzungsbedingungen/">Nutzungsbedingungen</a><a href="/agb/">AGB</a><a href="/datenschutz/">Datenschutz</a><a href="/cookies/">Cookies</a><a href="/impressum/">Impressum</a><a class="foot-widerruf" href="/widerruf/">Vertrag widerrufen</a></div></div>' + (Server.an ? '<p>Ihre Projekte und Aufmaße liegen auf unserem Server; Zahlungen laufen über Stripe.</p>' : '<p>Pilotphase: Es wird nichts berechnet. Echt funktionieren schon Aufmaß-Links, der Code-Eingang, Nachbesserungen und der PDF-Export; Konto und Projekte bleiben in Ihrem Browser.</p>') + '</div></footer>';
}
/* ---------- Fotos des Kunden (functions/api/fotos.js) ----------
   Kommen nur vom Server, mit der Anmeldung des Betriebs: als Blob geladen (ein <img> kann die Anmeldung nicht mitschicken) und hier
   gemerkt, solange die Seite offen ist. Geladen wird erst, was sichtbar ist: Positionen beim Aufklappen, das große Foto im Blatt. */
const FOTO_ID = /^b[a-z0-9]{12,24}$/;
const FOTO_CACHE = new Map();
function fotoLaden(key) {
  if (!FOTO_CACHE.has(key)) FOTO_CACHE.set(key, (async () => {
    try {
      const teile = String(key).split('/'), r = await Server.roh('/api/konto/foto/' + encodeURIComponent(teile[0]) + '/' + encodeURIComponent(teile[1]));
      if (!r.ok) return null;
      const blob = await r.blob(), url = URL.createObjectURL(blob);
      const d = await new Promise((fertig) => { const im = new Image(); im.onload = () => fertig({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => fertig(null); im.src = url; });
      if (!d) { URL.revokeObjectURL(url); return null; }
      return { url: url, blob: blob, w: d.w, h: d.h };
    } catch (e) { FOTO_CACHE.delete(key); return null; } // Netzfehler: beim nächsten Mal noch einmal
  })());
  return FOTO_CACHE.get(key);
}
function fotoEinsetzen(img) {
  if (img.dataset.geladen) return; img.dataset.geladen = '1';
  const rahmen = img.closest('.pfoto, .foto-gross'); if (rahmen) rahmen.classList.add('laedt');
  fotoLaden(img.getAttribute('data-foto')).then((f) => {
    if (rahmen) rahmen.classList.remove('laedt');
    if (f) { img.src = f.url; return; }
    if (rahmen) { rahmen.classList.add('fehlt'); const k = document.createElement('small'); k.textContent = 'Foto nicht angekommen'; rahmen.appendChild(k); }
  });
}
/* Aufgeklappte Positionen bleiben beim Neuzeichnen offen (etwa nach dem großen Foto), solange die Seite offen ist */
const POS_OFFEN = new Set();
function posMerken(wurzel) { wurzel.querySelectorAll('details[data-pos]').forEach((d) => d.addEventListener('toggle', () => { if (d.open) POS_OFFEN.add(d.dataset.pos); else POS_OFFEN.delete(d.dataset.pos); })); wurzel.querySelectorAll('details.kl-fold').forEach((d) => d.addEventListener('toggle', () => { S.klaerVorort = d.open; })); }
function fotosZeigen(wurzel) {
  wurzel.querySelectorAll('img[data-foto]').forEach((img) => { const d = img.closest('details'); if (!d || d.open) fotoEinsetzen(img); else if (!d.dataset.fotoHoeren) { d.dataset.fotoHoeren = '1'; d.addEventListener('toggle', () => { if (d.open) d.querySelectorAll('img[data-foto]').forEach(fotoEinsetzen); }); } });
  wurzel.querySelectorAll('.foto-gross.fz').forEach(fotoZoom);
}
/* Foto groß zoomen (Strang S5): zwei Finger, Doppeltipp oder Doppelklick, Mausrad, Knöpfe + und −; vergrößert verschieben.
   Der Punkt unter Finger oder Maus bleibt stehen; 1- bis 5-fach; ohne Bewegung bei „weniger Bewegung“ (CSS). */
function fotoZoom(box) {
  if (!box || box._zoom) return;
  const img = box.querySelector('img'), st = { z: 1, x: 0, y: 0 }, zeiger = new Map(); let pinch = null, zuletzt = 0, zug = null;
  const wert = () => { const el = document.querySelector('.fz-wert'); if (el) el.textContent = Math.round(st.z * 100) + ' %'; };
  const grenzen = () => { const r = box.getBoundingClientRect(), mx = Math.max(0, (r.width * st.z - r.width) / 2), my = Math.max(0, (r.height * st.z - r.height) / 2); st.x = Math.max(-mx, Math.min(mx, st.x)); st.y = Math.max(-my, Math.min(my, st.y)); };
  const setzen = (ruhig) => { grenzen(); img.style.transition = ruhig ? 'none' : ''; img.style.transform = 'translate(' + st.x.toFixed(1) + 'px, ' + st.y.toFixed(1) + 'px) scale(' + st.z.toFixed(3) + ')'; box.classList.toggle('gross', st.z > 1.01); wert(); };
  /* um den Punkt (px, py) relativ zur Mitte der Fläche */
  const um = (z, px, py, ruhig) => { z = Math.max(1, Math.min(5, z)); const k = z / st.z; st.x = px - (px - st.x) * k; st.y = py - (py - st.y) * k; st.z = z; if (z === 1) { st.x = 0; st.y = 0; } setzen(ruhig); };
  const mitte = (e) => { const r = box.getBoundingClientRect(); return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2]; };
  box._zoom = (d) => um(d > 0 ? st.z * 1.6 : d < 0 ? st.z / 1.6 : 1, 0, 0);
  box.addEventListener('wheel', (e) => { e.preventDefault(); const m = mitte(e); um(st.z * Math.exp(-e.deltaY * 0.0022), m[0], m[1], true); }, { passive: false });
  box.addEventListener('dblclick', (e) => { const m = mitte(e); um(st.z > 1.01 ? 1 : 2.5, m[0], m[1]); });
  box.addEventListener('pointerdown', (e) => {
    zeiger.set(e.pointerId, [e.clientX, e.clientY]); try { box.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    if (zeiger.size === 2) { const p = Array.from(zeiger.values()); pinch = { d: Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]), z: st.z }; zug = null; return; }
    const jetzt = Date.now(); if (e.pointerType === 'touch' && jetzt - zuletzt < 300) { const m = mitte(e); um(st.z > 1.01 ? 1 : 2.5, m[0], m[1]); zuletzt = 0; return; } zuletzt = jetzt;
    zug = { x: e.clientX - st.x, y: e.clientY - st.y };
  });
  box.addEventListener('pointermove', (e) => {
    if (!zeiger.has(e.pointerId)) return; zeiger.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && zeiger.size === 2) { const p = Array.from(zeiger.values()), r = box.getBoundingClientRect(), cx = (p[0][0] + p[1][0]) / 2 - r.left - r.width / 2, cy = (p[0][1] + p[1][1]) / 2 - r.top - r.height / 2; um(pinch.z * Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) / Math.max(1, pinch.d), cx, cy, true); return; }
    if (zug && st.z > 1.01) { st.x = e.clientX - zug.x; st.y = e.clientY - zug.y; setzen(true); }
  });
  const los = (e) => { zeiger.delete(e.pointerId); if (zeiger.size < 2) pinch = null; if (!zeiger.size) zug = null; };
  box.addEventListener('pointerup', los); box.addEventListener('pointercancel', los);
  wert();
}
/* ---------- Nach dem Rendern: Bewegung ---------- */
/* Eine Cream-Fläche im Bild (S6): Die Hauptaktion oben in der Kopfzeile trägt Cream nur, solange keine Hauptaktion der Seite
   (Cream-Pille) und kein Blatt zu sehen ist; sonst steht sie mit Ring da. Beobachtet wird beim Scrollen, ohne Arbeit je Bild. */
let ctaIo = null;
function kopfCta() {
  if (ctaIo) { ctaIo.disconnect(); ctaIo = null; }
  const top = document.querySelector('.top'); if (!top || !top.querySelector('.kopf-cta')) return;
  const ziele = Array.from(document.querySelectorAll('.scr .btn.primary, .scr .fb .knopf-primaer, .sheet .btn.primary')), im = new Set();
  const setzen = () => top.classList.toggle('cta-still', im.size > 0 || !!S.sheet);
  const hoehe = top.getBoundingClientRect().bottom;
  ziele.forEach((z) => { const r = z.getBoundingClientRect(); if (r.width && r.bottom > hoehe && r.top < window.innerHeight) im.add(z); });
  setzen();
  if (!ziele.length || !('IntersectionObserver' in window)) return;
  ctaIo = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) im.add(e.target); else im.delete(e.target); }); setzen(); }, { rootMargin: '-' + Math.round(hoehe) + 'px 0px 0px 0px' });
  ziele.forEach((z) => ctaIo.observe(z));
}
function afterRender(anim) {
  kopfCta();
  if (S.screen === 'link' && window.Blatt) window.Blatt.schrift();
  posMerken(document); fotosZeigen(document);
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
  /* Ansicht Hauseigentümer: den Baustein der Startseite aufbauen (startseite.js), Preise und Einstieg von hier */
  const sn = scr.querySelector('#startseite');
  if (sn && window.Startseite) window.Startseite.auf(sn, { app: appEinstieg(), appLabel: eigenesAufmass() ? 'Aufmaß fortsetzen' : 'Jetzt konfigurieren', weiter: eigenesAufmass() || 0, fuehrung: APP_OPEN + '#fuehrung', preis: eur2(P().aufmass), einf: X.einfText('aufmass'), zuBetrieb: () => zurAnsicht('betrieb') });
  /* Ansicht Fensterbauer: die eingebettete Seite für Fensterbauer füllen oder darauf fensterbauer.js starten (siehe „Einbettung der Seite für Fensterbauer“) */
  const vk = scr.querySelector('.vk-einbettung');
  if (vk) einbettungAuf(vk);
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
  if (S._pop) { const q = S._pop; const el = Array.from(document.querySelectorAll('[data-act="' + q.act + '"]')).find((x) => (x.getAttribute('data-v') || '') === q.v && (x.getAttribute('data-k') || '') === q.k); if (el) { const sch = el.classList.contains('sw-row') ? el.querySelector('.switch') : el; sch.classList.add(sch.classList.contains('switch') ? 'just' : 'pop'); } S._pop = null; }
  scr.querySelectorAll('.scrollchips').forEach((row) => { const on = row.querySelector('[aria-pressed="true"]'); if (!on) return; const rr = row.getBoundingClientRect(), ro = on.getBoundingClientRect(); if (ro.left < rr.left + 8 || ro.right > rr.right - 8) row.scrollLeft += ro.left - rr.left - 24; });
  if (anim && matchMedia('(max-width: 520px)').matches) scr.querySelectorAll('.sample details').forEach((d) => { d.open = false; });
  if (S.sheet && matchMedia('(hover: hover) and (pointer: fine)').matches) { const f = document.querySelector('.sheet input, .sheet textarea'); if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 80); }
  if (S._focusErr) { const f = document.querySelector('.f.has-err input, .f.has-err select, .f.has-err .chips button, .agree.has-err input'); if (f) { try { f.focus({ preventScroll: false }); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { /* ok */ } } S._focusErr = false; }
}
function countUp(el, from, to, fmt) {
  const t0 = performance.now(), dur = 750, f = (v) => (fmt === 'eur' ? eur(v) : String(Math.round(v)));
  const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = f(from + (to - from) * e); if (k < 1 && document.body.contains(el)) requestAnimationFrame(step); else el.textContent = f(to); };
  requestAnimationFrame(step);
}
window.addEventListener('scroll', () => {
  const t = document.querySelector('.top'); if (t) t.classList.toggle('scrolled', window.scrollY > 6);
  document.querySelectorAll('.rv:not(.in)').forEach((el) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.94) el.classList.add('in'); });
}, { passive: true });
/* ---------- Bildschirme: Besucher ---------- */
const SCREENS = {};
const CAPS = [
  ['ruler', 'Maueröffnung', 'Drei Breiten und drei Höhen, das kleinste Maß zählt. Abweichungen außer Winkel werden markiert.'],
  ['frame', 'Fensterelement', 'Breite und Höhe des alten Fensters mit Rahmen, dazu Brüstungshöhe und Laibungstiefe.'],
  ['camera', 'Fotos innen und außen', 'Die KI liest die Einbausituation: Rollladenkasten, Anschlag, Fensterbänke, Fassade, Strom, Zugang und Schäden, und prüft die Maße gegen das Foto.'],
  ['open', 'Teilung und Öffnung', 'Flügel, Dreh, Kipp oder fest, DIN links oder rechts, Oberlicht und Sonderformen, Balkon-, Hebe-Schiebe- und PSK-Türen.'],
  ['palette', 'Material und Farbe', 'Kunststoff, Kunststoff-Alu, Holz, Holz-Alu oder Aluminium. Farbe innen und außen nach RAL oder Dekor.'],
  ['glass', 'Glas und Sprossen', '2- oder 3-fach, Schallschutz, Sicherheits- und Ornamentglas, Sprossenart und Lage.'],
  ['shutter', 'Rollladen und Insektenschutz', 'Aufsatz oder Vorbau, Antrieb von Gurt bis Smart Home, Spann- oder Drehrahmen.'],
  ['sill', 'Montage und Klärungsliste', 'Fensterbänke, Ausbau, RAL-Montage, Putz. Dazu, was Sie mit dem Kunden klären: Absturzsicherung, Lüftung, Förderung, offene Wünsche.']
];
/* ---------- Aufmaß beim Betrieb (Strang S5) ----------
   Eigenes Vorgehen für ein eingegangenes Aufmaß: Kopf mit Eckdaten, „Mit dem Kunden zu klären“ zum Abhaken (l.klaer), Übersicht aller
   Positionen (Zeichnung, Öffnung, Element, Bestellmaß), je Position aufklappbar: was hier zu klären ist, die Zeichnung mit Maßketten
   (AW.zeichnungSVG), der Bestellmaß-Vorschlag, die Wünsche in einem Satz und in Gruppen mit den Notizen des Kunden an ihrer Stelle,
   die Maße und die Einbausituation laut Fotos. Regeln und Texte stehen in modell.js, damit Bildschirm, Text und PDF dasselbe sagen. */
const SPRECH = I('<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>', 16);
const WARN_I = I('<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.5"/>', 16);
const ARTKURZ = { fenster: 'Fenster', balkon: 'Balkontür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür', fsw: 'Faltschiebewand' };
const amKlaer = (l) => { const am = (l && l.aufmass) || {}; return AW.klaerung(am.windows || [], am.proj || {}, l || {}); };
const klaerOk = (l, id) => !!(l && l.klaer && l.klaer[id] && l.klaer[id].ok);
const klaerNotiz = (l, id) => (l && l.klaer && l.klaer[id] && l.klaer[id].notiz) || '';
const klaerBei = (kl, i) => kl.filter((r) => r.pos === i || (Array.isArray(r.pos) && r.pos.indexOf(i) >= 0));
/* Fragen an den Kunden: nur, was er mit einer Nachbesserung selbst beantworten kann (Maße, Brüstung, Laibung, offene Wünsche, Farbe,
   Absturzsicherung, Glas, Einbruchschutz, Schwelle, Fensterbank, Förderweg, Zahl der Fenster); Text für die Nachricht mit Position */
const klaerFragbar = (r) => /^(absturz|glas|rc2|boden|unvoll|bru|laib|farbe|fba|offen|massfoto|groesser|kleiner)-|^(foerd|fensterzahl)$/.test(r.id);
/* Chip im Blatt „Nachbesserung anfragen“: Thema und Position; offene Wünsche haben kein Kurzthema, dort steht, welche Positionen es sind */
const nbChipText = (r) => (r.kurz ? r.kurz + (r.pos != null && !Array.isArray(r.pos) ? ' · Pos. ' + (r.pos + 1) : Array.isArray(r.pos) && r.k ? ' · ' + r.k : '') : 'Offene Wünsche' + (r.k ? ' · ' + r.k : ''));
const klaerFrage = (r) => (r.pos != null && !Array.isArray(r.pos) ? 'Pos. ' + (r.pos + 1) + ': ' : /^(Pos\.|Alle)/.test(r.k) ? r.k + ': ' : '') + r.v;
const notizHTML = (n) => '<blockquote class="am-notiz">' + SPRECH + '<span><small>' + (n[2] === 'notiz' ? 'Notiz des Kunden' : 'Notiz des Kunden zu ' + esc(n[0])) + '</small>„' + esc(n[1]) + '“</span></blockquote>';
function klaerZeile(r, l, o) {
  o = o || {};
  const ok = klaerOk(l, r.id), nz = klaerNotiz(l, r.id), frei = !!(l && l.id) && !o.nurLesen, nfeld = frei && !o.kompakt && S.klaerNotiz === r.id, idA = ' data-v="' + esc(r.id) + '" data-id="' + (l ? l.id : '') + '"';
  return '<li class="kl-z' + (ok ? ' ok' : '') + (r.gruppe === 'pflicht' ? ' pflicht' : '') + '">' +
    (frei ? '<button type="button" class="kl-haken" data-act="klaer-ok"' + idA + ' aria-pressed="' + ok + '" aria-label="' + (ok ? 'Wieder offen: ' : 'Geklärt: ') + esc(r.kurz || r.k) + '">' + icon('check', 18) + '</button>' : '<span class="kl-punkt" aria-hidden="true"></span>') +
    '<div class="kl-t">' + (o.ohnePos ? '' : '<span class="kl-k">' + esc(r.k) + '</span>') + '<p>' + esc(r.v) + '</p>' + (r.warum ? '<small>' + esc(r.warum) + '</small>' : '') +
    (ok ? '<small class="kl-ok">' + icon('check', 14) + 'geklärt' + (l.klaer[r.id].wann ? ', ' + esc(zeitText(l.klaer[r.id].wann)) : '') + '</small>' : '') +
    (nz && !nfeld ? '<p class="kl-n">' + SPRECH + '<span>' + esc(nz) + '</span></p>' : '') +
    (nfeld ? '<div class="f kl-nf"><label for="kn-' + esc(r.id) + '">Ihre Notiz</label><input id="kn-' + esc(r.id) + '" data-in="klaer:' + esc(r.id) + '" value="' + esc(nz) + '" maxlength="300" placeholder="z. B. Am Telefon geklärt: Geländer außen" autocomplete="off"><small>Sieht nur Ihr Team. Wird beim Verlassen des Felds gespeichert.</small></div>' : '') +
    (frei && !o.kompakt ? '<div class="kl-akt"><button type="button" class="linkbtn" data-act="klaer-notiz"' + idA + '>' + (nfeld ? 'Fertig' : nz ? 'Notiz ändern' : 'Notiz') + '</button>' + (o.frage && klaerFragbar(r) && !ok ? '<button type="button" class="linkbtn" data-act="klaer-frage"' + idA + '>Beim Kunden nachfragen</button>' : '') + '</div>' : '') +
    '</div></li>';
}
/* Die ganze Liste, nach Gruppen; o.nurLesen (Tour), o.max (höchstens so viele Punkte) */
function klaerKarte(l, kl, o) {
  o = o || {};
  if (!kl.length) return '<div class="card klaer leer"><p class="eyebrow">Mit dem Kunden zu klären</p><p class="kl-nichts">' + icon('check', 18) + '<span>Nichts offen: keine Pflichtthemen, keine offenen Wünsche, keine Hinweise aus den Fotos.</span></p></div>';
  const n = kl.filter((r) => klaerOk(l, r.id)).length, frage = !!(l && l.id && !o.nurLesen && nbMoeglich(l) === 'ok' && !(l.nb && l.nb.offen));
  let rest = o.max || 1e9;
  const gruppen = AW.klaerGruppen(kl).map((g) => { const p = g.punkte.slice(0, Math.max(0, rest)); rest -= p.length; if (!p.length) return ''; const liste = '<ul class="kl-liste">' + p.map((r) => klaerZeile(r, l, { frage: frage, nurLesen: o.nurLesen })).join('') + '</ul>', offenN = g.punkte.filter((r) => !klaerOk(l, r.id)).length;
    /* Vor Ort prüfen ist für den Termin: ab fünf Punkten zum Aufklappen, damit Pflicht und Fragen an den Kunden oben bleiben */
    if (g.id === 'vorort' && g.punkte.length > 4 && !o.nurLesen) return '<details class="kl-g kl-fold"' + (S.klaerVorort ? ' open' : '') + '><summary><h4>' + esc(g.titel) + '<span class="n">' + g.punkte.length + '</span></h4><span class="kl-fold-t">' + (offenN ? offenN + ' offen, für den Termin vor Ort' : 'alle geklärt') + '</span><span class="pchev" aria-hidden="true"></span></summary>' + liste + '</details>';
    return '<div class="kl-g"><h4>' + esc(g.titel) + '<span class="n">' + g.punkte.length + '</span></h4>' + liste + '</div>'; }).join('');
  return '<div class="card klaer" id="klaer"><div class="kl-kopf"><p class="eyebrow">Mit dem Kunden zu klären · ' + kl.length + '</p>' + (o.nurLesen ? '' : '<span class="kl-stand"><b>' + n + ' von ' + kl.length + '</b> geklärt</span>') + '</div>' +
    (o.nurLesen ? '' : '<div class="kl-balken" role="progressbar" aria-label="Geklärt" aria-valuemin="0" aria-valuemax="' + kl.length + '" aria-valuenow="' + n + '"><span style="width: ' + Math.round(n / kl.length * 100) + '%"></span></div>') + gruppen +
    (o.max && kl.length > o.max ? '<p class="km-s">und ' + (kl.length - o.max) + ' weitere Punkte</p>' : '') + '</div>';
}
/* Fotos einer Position (code: Link des Aufmaßes; fotosDa: was beim Server angekommen ist, null = unbekannt; weg: nach 12 Monaten gelöscht) */
function posFotos(w, code, fotosDa, weg, posName) {
  const ids = ['in', 'out'].map((s2) => ({ s: s2, id: w.bilder && w.bilder[s2] })).filter((x) => FOTO_ID.test(String(x.id || '')));
  if (!code || !ids.length) return '';
  if (weg) return '<p class="km-s pos-fotos-weg">Die Fotos wurden 12 Monate nach dem Eingang gelöscht.</p>';
  const da = Array.isArray(fotosDa) ? new Set(fotosDa) : null, name = (s2) => (s2 === 'in' ? 'Von innen' : 'Von außen');
  return '<div class="pos-fotos">' + ids.map((x) => (da && !da.has(x.id)
    ? '<span class="pfoto fehlt"><span class="pf-tag">' + name(x.s) + '</span><small>Foto nicht angekommen</small></span>'
    : '<button type="button" class="pfoto" data-act="foto-gross" data-v="' + esc(code + '/' + x.id) + '" data-id="' + esc(name(x.s)) + '" data-pos="' + esc(posName || '') + '" aria-label="Foto ' + name(x.s).toLowerCase() + ' groß ansehen"><img alt="" data-foto="' + esc(code + '/' + x.id) + '"><span class="pf-tag">' + name(x.s) + '</span></button>')).join('') + '</div>';
}
/* Pilotphase ohne Server: Fotos kommen mit dem Code nicht mit, nur ihre Auswertung. Ein Satz statt leerer Kacheln */
const fotosPilot = (w, kiR) => (AW.num(w.fotos) > 0 ? '<p class="km-s pos-fotos-weg">Die Fotos selbst bleiben in der Pilotphase beim Kunden' + (kiR.length ? '; ihre Auswertung steht darunter.' : '. Fragen Sie ihn bei Bedarf danach.') + '</p>' : '');
/* Fotos im Kopf: mit Server angekommen (Haken), ohne Server ehrlich „ausgewertet“ bzw. „beim Kunden“ wie im PDF */
function fotoChip(am) {
  const wins = am.windows || [], nF = am.fotos || 0, nA = wins.reduce((a2, x) => a2 + (x.ki && ((x.ki.rows || []).length || (x.ki.fach && Object.keys(x.ki.fach).length)) ? AW.num(x.fotos) || 0 : 0), 0);
  if (!nF) return ['ohne Fotos', false];
  if (Server.online()) return [nW(nF, 'Foto', 'Fotos'), true];
  return nA >= nF ? [nW(nF, 'Foto', 'Fotos') + ' ausgewertet', true] : nA ? [nA + ' von ' + nF + ' Fotos ausgewertet', true] : [nW(nF, 'Foto', 'Fotos') + ' beim Kunden', null];
}
/* Standard des Fensterbauers (modell.js wuensche): neutral „nach Standard des Fensterbauers“, im Betrieb „nach Ihrem Standard“ */
const ihrStd = (t) => String(t || '').replace(AW.STD_TEXT, 'nach Ihrem Standard');
const stdZeile = (g) => (g.standard && g.standard.length ? '<p class="am-std"><b>Nach Ihrem Standard:</b> ' + esc(g.standard.join(', ')) + '</p>' : '');
const dlZeilen = (rows) => '<dl class="am-dl">' + rows.map((r) => '<dt>' + esc(r[0]) + '</dt><dd' + (r[2] ? ' class="' + r[2] + '"' : '') + '>' + (r[3] ? '<i class="sw" style="background: ' + esc(r[3]) + '"></i>' : '') + esc(r[1]) + '</dd>').join('') + '</dl>';
function posMasse(w) {
  const d = AW.derive(w), mo = w.mo || {}, t = (k) => (AW.num(mo[k]) ? AW.th(mo[k]) : '–'), luecken = AW.massLuecken(w), dev = Math.max(d.devW, d.devH);
  return [[w.neu ? 'Rohbauöffnung' : 'Maueröffnung', d.moW && d.moH ? AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' mm' + (w.neu ? ', Wunschmaß' : ', kleinstes Maß') : 'nicht gemessen', d.moW && d.moH ? 'mo' : 'offen']]
    .concat(w.neu ? [] : [['Breiten', 'oben ' + t('wt') + ' · Mitte ' + t('wm') + ' · unten ' + t('wb'), /Breite/.test(luecken.join()) ? 'offen' : ''], ['Höhen', 'links ' + t('hl') + ' · Mitte ' + t('hm') + ' · rechts ' + t('hr'), /Höhe/.test(luecken.join()) ? 'offen' : '']],
      !w.neu && dev > 5 ? [['Außer Winkel', 'bis ' + dev + ' mm, das kleinste Maß zählt', dev > 10 ? 'offen' : '']] : [],
      [[AW.istTuer(w) ? 'Türelement' : 'Element', d.elW && d.elH ? AW.th(d.elW) + ' × ' + AW.th(d.elH) + ' mm mit Rahmen' + (w.neu ? ', gerechnet' : '') : 'nicht gemessen', d.elW && d.elH ? 'el' : 'offen'],
        ['Lage', (AW.lab('etage', w.etage) || 'EG') + (AW.istTuer(w) ? ', bodentief' : AW.bruDa(w) ? (AW.num(w.bru) ? ', Brüstung ' + AW.th(w.bru) + ' mm' : ', bodentief') : ', Brüstung nicht gemessen') + (AW.num(w.laib) ? ', Laibung innen ' + AW.th(w.laib) + ' mm' : '') + (AW.num(w.wand) ? ', Wand ' + AW.th(w.wand) + ' mm' : '')],
        ['Einbau', w.neu ? 'neue Öffnung, Lage ' + (AW.ohneFotos(w) ? 'nicht eingezeichnet' : 'auf dem Foto eingezeichnet') : 'Austausch' + (AW.ohneFotos(w) ? ', ohne Fotos' : '')]]);
}
/* Große Zeichnung am Schreibtisch: Die Spalte ist ab 601 px Fensterbreite 513 bis 592 px breit. Die Einheiten der viewBox entsprechen darum
   etwa einem Pixel, damit Maßzahlen und „Fußboden“ (fs × 0,92, mindestens fsMin) nie unter 13 px fallen; nicht höher als breit, damit auch
   die Grenze von 72vh bei 1280 × 720 die Schrift nicht verkleinert. Die kleine Zeichnung (zk-klein) gilt bis 600 px; sie ist bei 360 px
   Fensterbreite 292 px breit, ab dort hält auch sie 13 px. */
const ZK_GROSS = { b: 512, fs: 14.4, fsMin: 13.4, h: 512 }, ZK_KLEIN = { b: 292, fs: 14.2, fsMin: 13.2, h: 456 };
/* Ein Fenster aus dem Aufmaß. Zu: Zeichnung klein, Name, Bestellmaß, Kurzzeile, Marken (zu klären, offen, Notizen).
   Auf: was hier zu klären ist, Zeichnung mit Maßen und Bestellmaß, Wünsche, Maße, Einbausituation mit Fotos. */
function posCard(w, i, abzug, open, proj, l, kl) {
  const d = AW.derive(w), n = AW.num(w.anzahl) || 1, b = AW.bestellmass(w, abzug), W = AW.wuensche(w, proj), art = w.art || 'fenster', S0 = w.sashes || AW.sashesFor(w.teilung);
  const hier = klaerBei(kl || [], i), klN = hier.filter((r) => !klaerOk(l, r.id)).length, nzN = AW.notizenVon(w).length, name = 'Pos. ' + (i + 1) + ' · ' + (w.name || 'Fenster');
  const kurz = [ARTKURZ[art] || 'Fenster', AW.lab('etage', w.etage) || 'EG', art === 'fest' ? S0.length + (S0.length === 1 ? ' Feld' : ' Felder') : art === 'fenster' || art === 'balkon' ? AW.oeffnungKurz(w).split(' · ').filter((x) => /Flügel|Seitenteil|fest verglast/.test(x)).join(' · ') : '', AW.istOffen(w, 'material') ? 'Material offen' : AW.lab('material', w.material) || 'Kunststoff'].filter(Boolean).join(' · ');
  const kiR = AW.kiRows(w), chips = AW.kiChips(w), fotos = l && l.aufmass ? (Server.online() ? posFotos(w, l.code, l.aufmass.fotosDa, !!l.fotosGeloescht, name) : l.demo ? '' : fotosPilot(w, kiR)) : '';
  return '<details class="posc" id="pos-' + i + '"' + (open ? ' open' : '') + (l ? ' data-pos="' + esc(l.id + ':' + i) + '"' : '') + '><summary><span class="pic">' + AW.svg(w, 46) + '</span><span class="pt"><b>' + esc(name) + (n > 1 ? ' · ' + n + ' Stück' : '') + '</b><span>Bestellmaß ' + (b ? b.text : '–') + '</span><small>' + esc(kurz) + '</small>' +
    (klN || W.offen.length || nzN ? '<span class="pmarks">' + (klN ? '<span class="badge warn">' + klN + ' zu klären</span>' : '') + (W.offen.length ? '<span class="badge">' + W.offen.length + ' offen</span>' : '') + (nzN ? '<span class="badge">' + SPRECH + nW(nzN, 'Notiz', 'Notizen') + '</span>' : '') + '</span>' : '') + '</span><span class="pchev" aria-hidden="true"></span></summary>' +
    '<div class="pbody">' +
    (hier.length ? '<div class="pos-klaer"><p class="eyebrow">Zu klären bei dieser Position · ' + hier.length + '</p><ul class="kl-liste">' + hier.map((r) => klaerZeile(r, l, { ohnePos: true, kompakt: true, nurLesen: !l })).join('') + '</ul><p class="km-s">Notiz und Rückfrage an den Kunden: in der Liste oben.</p></div>' : '') +
    '<div class="pos-plan"><figure class="zk">' + AW.zeichnungSVG(w, { b: ZK_GROSS.b, fs: ZK_GROSS.fs, fsMin: ZK_GROSS.fsMin, h: ZK_GROSS.h, cls: 'zeichnung zk-gross', label: 'Zeichnung ' + name + ', Ansicht von innen, Maße in mm' }) + AW.zeichnungSVG(w, { b: ZK_KLEIN.b, fs: ZK_KLEIN.fs, fsMin: ZK_KLEIN.fsMin, h: ZK_KLEIN.h, cls: 'zeichnung zk-klein', label: 'Zeichnung ' + name + ', Ansicht von innen, Maße in mm' }) + '<figcaption class="zk-leg"><span class="lg mo">' + (w.neu ? 'Rohbauöffnung, Wunschmaß' : 'Maueröffnung') + '</span><span class="lg el">Element</span><span>Ansicht von innen · Maße in mm' + (w.richtung === 'aussen' && !AW.istTuer(w) && art !== 'fest' ? ' · gestrichelt: öffnet nach außen' : '') + '</span></figcaption></figure>' +
    '<div class="best' + (b && b.warn.length ? ' warn' : '') + '"><span>Bestellmaß-Vorschlag</span><b>' + (b ? b.text : '–') + '</b><small>' + (b ? esc(b.formel) : 'Ohne Maueröffnung kein Vorschlag.') + '</small>' + (b && b.warnText ? '<p class="best-warn">' + WARN_I + '<span>' + esc(b.warnText) + '</span></p>' : '') + '</div></div>' +
    '<div class="am-wunsch"><p class="eyebrow kicker">Wünsche des Kunden</p><p class="satz">' + esc(W.satz) + '.</p>' + (W.offen.length ? '<p class="am-offen"><span>Noch offen</span>' + W.offen.map((x) => '<span class="chip offen">' + esc(x) + '</span>').join('') + '</p>' : '') + W.notizen.allgemein.map(notizHTML).join('') + '</div>' +
    '<div class="am-gruppen">' + W.gruppen.map((g) => '<div class="am-g am-g-' + g.id + '"><p class="eyebrow">' + esc(g.titel) + '</p>' + dlZeilen(g.zeilen.map((z) => [z.k, ihrStd(z.t), z.offen ? 'offen' : z.std ? 'std' : '', z.offen || z.std ? '' : z.hex])) + stdZeile(g) + g.notizen.map(notizHTML).join('') + '</div>').join('') + '</div>' +
    '<div class="am-g am-masse"><p class="eyebrow">Maße von Hand</p>' + dlZeilen(posMasse(w)) + W.notizen.masse.map(notizHTML).join('') + '</div>' +
    (kiR.length || fotos || chips.length || W.notizen.fotos.length ? '<div class="am-g am-ki"><p class="eyebrow">Einbausituation laut Fotos' + (w.ki ? ' (KI, ' + nW(w.fotos || 0, 'Foto', 'Fotos') + ')' : '') + '</p>' + fotos +
      (kiR.length ? dlZeilen(kiR.map((r) => [r[0], r[1], r[0] === 'Hinweis' || r[0] === 'Vor Ort prüfen' || (r[0] === 'Maße und Foto' && AW.massPruef(w)) ? 'hinweis' : ''])) : chips.length ? '<div class="chips">' + chips.map((c) => '<span class="badge">' + esc(c) + '</span>').join('') + '</div>' : '') + W.notizen.fotos.map(notizHTML).join('') + '</div>' : '') +
    '</div></details>';
}
/* Übersicht: alle Positionen als Zeilen gleichen Aufbaus, Antippen springt zur Position und klappt sie auf */
function amUebersicht(l, wins, ab, kl) {
  return '<div class="card am-tab"><div class="am-tab-kopf" aria-hidden="true"><span>Pos.</span><span>Öffnung</span><span>Element</span><span>Bestellmaß</span></div>' + wins.map((w, i) => {
    const d = AW.derive(w), b = AW.bestellmass(w, ab), n = AW.num(w.anzahl) || 1, klN = klaerBei(kl, i).filter((r) => !klaerOk(l, r.id)).length;
    return '<button type="button" class="am-zeile" data-act="pos-zu" data-v="' + i + '"><span class="pic">' + AW.svg(w, 40) + '</span><span class="az-t"><b>' + (i + 1) + ' · ' + esc(w.name || 'Fenster') + '</b><small>' + esc([ARTKURZ[w.art || 'fenster'], AW.lab('etage', w.etage) || 'EG', n > 1 ? n + ' Stück' : ''].filter(Boolean).join(' · ')) + (klN ? ' · <span class="az-k">' + klN + ' zu klären</span>' : '') + '</small></span>' +
      '<span class="az-m"><small>Öffnung</small>' + (d.moW && d.moH ? AW.th(d.moW) + ' × ' + AW.th(d.moH) : '–') + '</span><span class="az-m"><small>Element</small>' + (d.elW && d.elH ? AW.th(d.elW) + ' × ' + AW.th(d.elH) : '–') + '</span><span class="az-m az-b"><small>Bestellmaß</small><b>' + (b ? AW.th(b.b) + ' × ' + AW.th(b.h) : '–') + '</b></span></button>';
  }).join('') + '<p class="km-s am-tab-fuss">Maße in mm, Breite × Höhe. Bestellmaß: Ihr Abzug von der Maueröffnung, verbindlich bleibt Ihr Feinaufmaß.</p></div>';
}
/* Kontakt, den der Kunde in der App selbst eingetragen hat (Telefon, E-Mail, wann erreichbar), soweit er nicht schon im Projekt steht:
   [[Beschriftung, Wert]] für Kopf, Projektdaten, Text und PDF. Kommt ein Aufmaß nur per Code, steht sonst nur eine Nummer im Projekt. */
function kundeKontakt(l) {
  const pr = (l && l.aufmass && l.aufmass.proj) || {}, k = String((l && l.kontakt) || ''), roh = (x) => String(x || '').replace(/[\s/().-]/g, '').toLowerCase();
  return [pr.tel && roh(pr.tel) !== roh(k) ? ['Telefon', pr.tel] : null, pr.mail && roh(pr.mail) !== roh(k) ? ['E-Mail', pr.mail] : null, AW.OPT.erreich[pr.erreich] ? ['Erreichbar', AW.OPT.erreich[pr.erreich]] : null].filter(Boolean);
}
const kontaktKv = (l) => kundeKontakt(l).map((r) => '<span>' + r[0] + '</span><span>' + (r[0] === 'Erreichbar' ? esc(r[1]) : '<span class="sel">' + esc(r[1]) + '</span>') + '</span>').join('');
/* Kopf des Aufmaßes: Umfang, Kunde, Objekt, Eckdaten, Eingang (die Nachricht steht in der Klärungsliste); darunter die Hauptaktion PDF */
function amKopf(l, am) {
  const pr = am.proj || {}, wins = am.windows || [], nE = am.elemente || wins.reduce((s2, w) => s2 + (AW.num(w.anzahl) || 1), 0), tot = AW.num(pr.total), komplett = wins.length > 0 && wins.every((w) => !AW.massLuecken(w).length), fw = AW.foerdWeg(pr);
  const chip = (t, ok) => '<span class="chip' + (ok === false ? ' warnung' : ok === null ? '' : ' haken') + '">' + esc(t) + '</span>', fc = fotoChip(am);
  return '<div class="card amhead"><div class="chips am-chips">' + chip(nW(wins.length, 'Position', 'Positionen')) + chip(nW(nE, 'Element', 'Elemente')) + chip(fc[0], fc[1]) + chip(komplett ? 'alle Maße vollständig' : 'Maße teilweise offen', komplett) + '</div>' +
    '<div class="kv"><span>Kunde</span><span>' + esc(l.kunde) + (l.kontakt ? ' · <span class="sel">' + esc(l.kontakt) + '</span>' : '') + '</span>' + kontaktKv(l) + '<span>Objekt</span><span>' + esc(l.adresse || '–') + '</span><span>Gebäude</span><span>' + esc((AW.lab('gebaeude', pr.gebaeude) || PGEB[l.geb] || '–') + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')) + '</span>' +
    '<span>Fenster im Haus</span><span>' + (tot ? nE + ' von ' + tot + ' werden getauscht' : 'nicht angegeben') + '</span><span>Zeitraum</span><span>' + esc(AW.lab('zeit', pr.zeit) || '–') + '</span><span>Budget</span><span>' + esc(AW.lab('budget', pr.budget) || '–') + '</span><span>Förderung</span><span>' + esc(AW.lab('foerdweg', fw) || '–') + '</span>' + (AW.tiefeKopf(wins, pr, true) ? '<span>Geplant</span><span>' + esc(AW.tiefeKopf(wins, pr, true)) + '</span>' : '') +
    '<span>Eingegangen</span><span>' + esc([zeitText((l.log || {}).eingegangen), l.via ? 'über ' + l.via : '', (l.runde || 1) > 1 ? 'Runde ' + l.runde : ''].filter(Boolean).join(' · ') || '–') + '</span>' + '</div>' +
    '<div class="row amacts"><button type="button" class="btn primary" data-act="pdf-am" data-id="' + l.id + '">' + icon('dl', 18) + 'Aufmaßblatt als PDF<span class="pf" aria-hidden="true"></span></button><button type="button" class="btn ghost" data-act="copy-am" data-id="' + l.id + '">' + icon('copy', 18) + 'Als Text kopieren</button></div></div>';
}
function roiCalc() {
  const n = S.roi ? S.roi.n : 12, t = S.roi ? S.roi.t : 75, r = S.roi ? S.roi.r : 65, v = roiVals(n, t, r);
  const rng = (k, label, min, max, step, val, out) => '<label class="roi-r"><span>' + label + '<b id="roi-' + k + '-l">' + out + '</b></span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-in="roi-' + k + '" aria-label="' + label + '"></label>';
  return '<section class="card roi"><div class="roi-in"><p class="eyebrow kicker">Rechnen Sie nach</p><h3>' + akSatz('Was ein Erstaufmaß vor Ort kostet.') + '</h3>' + rng('n', 'Erstaufmaße im Monat', 2, 40, 1, n, String(n)) + rng('t', 'Zeit je Termin mit Fahrt', 30, 150, 5, t, t + ' Min.') + rng('r', 'Kosten je Stunde', 40, 120, 5, r, r + ' €') + '</div>' +
    '<div class="roi-out"><div class="ro"><small>Vor Ort im Monat</small><b id="roi-c" data-count="' + v.cost + '" data-fmt="eur">' + eur(v.cost) + '</b><span id="roi-h">' + v.hours + ' Stunden unterwegs und beim Kunden</span></div><div class="ro hi"><small>Mit eeziframes</small><b id="roi-l" data-count="' + v.lm + '" data-fmt="eur">' + eur(v.lm) + '</b><span id="roi-lp">' + v.plan + '</span></div><p class="roi-note">Annahme: Jedes Erstaufmaß ersetzt einen Termin fürs erste Angebot. Das Feinaufmaß vor der Fertigung bleibt.</p></div></section>';
}
/* Günstigster Tarif für n Projekte im Monat: Start je Projekt, Abo 10 mit Kontingent, Plus unbegrenzt */
function roiVals(n, t, r) {
  const p = P(), hours = Math.round(n * t / 60 * 10) / 10, cost = Math.round(n * t / 60 * r);
  const start = n * p.projekt, abo = p.abo.grund + Math.max(0, n - p.abo.inkl) * p.abo.extra, plus = p.plus;
  const best = Math.min(start, abo, plus);
  return { hours: String(hours).replace('.', ','), cost: cost, lm: best, plan: best === start ? n + ' Projekte × ' + p.projekt + ' € netto (Start)' : best === abo ? 'Abo 10: ' + p.abo.grund + ' € für ' + p.abo.inkl + ' Projekte' + (n > p.abo.inkl ? ' + ' + (n - p.abo.inkl) + ' × ' + p.abo.extra + ' €' : '') : 'Plus, Projekte unbegrenzt' };
}
/* Startseite in zwei Ansichten (Umschalter oben, siehe ansicht()): Hauseigentümer messen selbst, Fensterbauer sehen die
   Paket-Landingpage /fuer-fensterbauer/ eingebettet. Je Ansicht ein h1, nur ihre Knöpfe, am Ende der Weg in die andere Ansicht.
   Aufbau wie die Beiträge auf Instagram (docs/GESTALTUNG.md): Kicker in Grün, Überschrift mit einem grünen Wort (das letzte),
   Cream-Pille mit Pfeil, daneben das Foto randlos und ohne Rahmen, weich in den Grund auslaufend, mit Haken-Chips darauf. */
const worte = (satz) => { const w = satz.split(' '); return w.map((x, i) => '<span class="w' + (i === w.length - 1 ? ' ak' : '') + '" style="--i: ' + i + '">' + x + '</span>').join(' '); };
/* Fotokarte (gemeinsam.css): Foto aus web/bilder/foto/ (Platzhalter, bis das echte Foto da ist; Motive und Prompts in docs/BILDER.md) */
function fotoKarte(name, alt, chips, oben) {
  const breit = /^(ratgeber|weg-|fehler)/.test(name), w = breit ? 1600 : 1200, h = breit ? 1000 : 1500;
  return '<figure class="foto-karte' + (breit ? ' breit' : '') + '"><img src="/bilder/foto/' + name + '.webp" width="' + w + '" height="' + h + '" alt="' + esc(alt) + '" decoding="async"' + (oben ? ' fetchpriority="high"' : ' loading="lazy"') + '>' +
    (chips && chips.length ? '<div class="chips">' + chips.map((c) => '<span class="chip haken">' + esc(c) + '</span>').join('') + '</div>' : '') + '</figure>';
}
/* Startbild-Foto: kein Kasten, läuft bis an den Bildschirmrand und blendet in den Grund aus (portal.css .hero-foto) */
const heroFoto = (name, w, h, alt, chips) => '<figure class="hero-visual hero-foto"><img src="/bilder/foto/' + name + '.webp" width="' + w + '" height="' + h + '" alt="' + esc(alt) + '" decoding="async" fetchpriority="high">' +
  '<div class="chips">' + chips.map((c) => '<span class="chip haken">' + esc(c) + '</span>').join('') + '</div></figure>';
const aufmassInhalt = (mitModell) => '<section class="sec"><div class="sec-head"><h2>' + akSatz('Was im Aufmaß steckt.', 2) + '</h2><span class="sub">je Fenster, wie beim Termin vor Ort</span></div>' +
  (mitModell ? '<div class="aufmass-raster"><div class="caps">' : '<div class="caps">') + CAPS.map((c) => '<div class="cap"><span class="ci">' + icon(c[0], 22) + '</span><b>' + c[1] + '</b><span>' + c[2] + '</span></div>').join('') + '</div>' +
  (mitModell ? b2cVisual() + '</div>' : '') + '</section>';
/* Elementarten, die die App kennt: Haken-Chips wie im Beitrag „Auch ganz groß.“ */
const ELEMENTE = ['Fenster', 'Balkontüren', 'Festverglasung', 'Hebe-Schiebe-Türen', 'PSK-Türen', 'Faltschiebewände', 'Rollladen', 'Raffstore', 'Screen', 'Insektenschutz'];
const grossSection = () => '<section class="sec gross"><div class="gross-text"><p class="eyebrow kicker">Fenster für Fenster</p><h2>Auch ganz <span class="ak">groß.</span></h2><p class="lead">Balkontür, Hebe-Schiebe-Tür oder Faltschiebewand: Jede Elementart hat in der App ihr eigenes Modell und ihre eigenen Fragen, bis zur Schwelle und zum Sonnenschutz.</p><div class="chips">' + ELEMENTE.map((e) => '<span class="chip haken">' + e + '</span>').join('') + '</div></div>' +
  fotoKarte('gross', 'Ein Oktopus steht mit einer Tasse Kaffee an einer geöffneten Hebe-Schiebe-Tür', null, false) + '</section>';
const RATGEBER = [['/ratgeber/fenster-beschlagen/', 'Fenster beschlagen?', 'Innen, außen oder zwischen den Scheiben: was es bedeutet und wann neue Fenster fällig sind.'], ['/ratgeber/fenster-reparieren-oder-austauschen/', 'Reparieren oder austauschen?', 'Dichtung, Beschlag, Glas oder neu: die Entscheidung mit Tabelle.'], ['/ratgeber/fenster-angebot-vergleichen/', 'Angebote vergleichen', 'Checkliste und Beispiel: woran du ein gutes Fensterangebot erkennst.'], ['/ratgeber/fenster-ausmessen/', 'Fenster ausmessen', 'Die Maueröffnung an drei Stellen messen, das kleinste Maß zählt. Mit Messpunkten und Tipps für den Altbau.'], ['/ratgeber/aufmassblatt-fenster/', 'Aufmaßblatt für Fenster', 'Was ein Aufmaß umfasst und wie das Blatt in der App als PDF entsteht.'], ['/ratgeber/fenster-austauschen/', 'Fenster austauschen', 'Ablauf, Kosten pro Fenster, Förderung 2026 und was ins Angebot gehört.'], ['/ratgeber/balkontuer-ausmessen/', 'Balkontür ausmessen', 'Höhe ab dem fertigen Fußboden, Schwelle und Abdichtung, Hebe-Schiebe- oder PSK-Tür.'], ['/ratgeber/bestellmass-fenster/', 'Bestellmaß berechnen', 'Wie viel kleiner als die Maueröffnung? Fuge je Seite nach Größe und Farbe, mit Beispiel.'], ['/ratgeber/din-links-rechts/', 'DIN links oder rechts', 'Von innen gesehen: Bänder links heißt DIN links. Mit Merkregel und Zeichnung.']];
const wechsel = (zu) => zu === 'betrieb'
  /* Fensterbauer kommen zu den Konfigurator-Paketen (Bauplan §1.5, wie die Textfassung in web/index.html); die Ansicht für
     Bestandsbetriebe mit Anmeldung bleibt erreichbar, wird aber nicht mehr mit Freiprojekten beworben */
  ? '<section class="owner wechsel"><div><p class="eyebrow kicker">Für Fensterbauer</p><h2>' + akSatz('Ihr eigener Fensterkonfigurator.', 2) + '</h2><p>Unter Ihrer Domain und in Ihrer Marke: Ihre Kunden planen ihre Fenster selbst, Sie bekommen jede Anfrage mit Aufmaßblatt.</p></div><div class="row"><a class="btn primary" href="/fuer-fensterbauer/">Pakete ansehen<span class="pf" aria-hidden="true"></span></a><button type="button" class="btn ghost" data-act="ansicht" data-v="betrieb">Zur Ansicht für Fensterbauer</button></div></section>'
  : '<section class="owner wechsel"><div><p class="eyebrow kicker">Für Hauseigentümer</p><h2>' + akSatz('Ihre eigenen Fenster ausmessen?', 2) + '</h2><p>Messen geht kostenlos in der App, ohne Konto und Schritt für Schritt erklärt. Das Aufmaßblatt geht an jeden Fensterbauer.</p></div><div class="row"><button type="button" class="btn ghost" data-act="ansicht" data-v="kunde">Zur Ansicht für Hauseigentümer<span class="pf" aria-hidden="true"></span></button></div></section>';
/* ---------- Einbettung der Seite für Fensterbauer (Ansicht Fensterbauer) ----------
   Eine Quelle: Die Seite bleibt die statische Seite /fuer-fensterbauer/ (Suchmaschinen, fensterbauer.css, fensterbauer.js). Die
   Startseite lädt sie einmal je Seitenaufruf (fetch, gleiche Herkunft), nimmt den Rahmen .fb (Gestaltung und Skripte gelten nur darin)
   und setzt ihn in den Behälter .vk-einbettung; danach startet FbSeite.auf darauf mit { eingebettet: true } (ohne eigene Kopf- und
   Fußzeile, die Startseite hat ihre). Liegt der Inhalt schon im Speicher, steht er beim nächsten Aufbau sofort im HTML (kein Flackern,
   die Scrollposition bleibt, etwa beim Öffnen des Anmeldeblatts); ein neuer Start beendet den vorigen. Fällt das Laden aus, steht die
   Karte „Pakete ansehen“ mit dem Link zur Seite, nie eine leere Fläche; der nächste Aufbau versucht es wieder. Sprungmarken der Seite
   (#pakete, #bestellen …) scrollen innerhalb der Einbettung, ohne die Adresse zu ändern, denn Hashes steuern auf der Startseite die
   Ansicht (ankerLink); der Abstand zur klebenden Kopfzeile wird gemessen, weil sie am Telefon zwei Zeilen hoch ist. */
const VK_SEITE = '/fuer-fensterbauer/';
let vkHtml = null, vkLauf = null;
function vkLaden() {
  if (vkLauf) return vkLauf;
  vkLauf = fetch(VK_SEITE, { credentials: 'same-origin', headers: { accept: 'text/html' } })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then((t) => {
      const fb = new DOMParser().parseFromString(t, 'text/html').querySelector('.fb');
      if (!fb) throw new Error('kein .fb');
      vkHtml = fb.outerHTML;
      return vkHtml;
    })
    .catch(() => { vkLauf = null; return null; });
  return vkLauf;
}
/* Rückfall: die frühere Teaser-Karte mit dem Weg zur Seite */
const vkRueckfall = () => '<div class="wrap"><div class="card pakete-karte"><div><p class="eyebrow kicker">Neu für Fensterbauer</p><h2>' + akSatz('Ihr eigener Fensterkonfigurator.', 2) + '</h2><p>Unter Ihrer Domain und in Ihrer Marke: Ihre Kunden planen ihre Fenster selbst, Sie bekommen jede Anfrage mit Aufmaßblatt.</p></div><a class="btn primary" href="' + VK_SEITE + '">Pakete ansehen<span class="pf" aria-hidden="true"></span></a></div></div>';
const einbettung = () => '<section class="vk-einbettung" aria-label="Konfigurator-Pakete für Fensterbauer"' + (vkHtml ? '>' + vkHtml : ' aria-busy="true">') + '</section>';
/* nach dem Aufbau (afterRender): Inhalt aus dem Speicher ist schon drin, also nur starten; sonst laden und den Behälter füllen */
function einbettungAuf(el) {
  if (!el.hasAttribute('aria-busy')) { vkStarten(el); return; }
  vkLaden().then((html) => {
    const ziel = document.querySelector('.vk-einbettung[aria-busy="true"]'); if (!ziel) return;
    ziel.removeAttribute('aria-busy');
    if (!html) { ziel.classList.add('vk-rueckfall'); ziel.innerHTML = vkRueckfall(); return; }
    ziel.innerHTML = html; vkStarten(ziel); kopfCta();
  });
}
function vkStarten(el) {
  /* fensterbauer.js lädt mit defer; kommt die Antwort früher, startet es beim DOMContentLoaded */
  const starten = () => { if (window.FbSeite && document.body.contains(el)) window.FbSeite.auf(el.querySelector('.fb'), { eingebettet: true }); };
  if (window.FbSeite || document.readyState !== 'loading') starten(); else document.addEventListener('DOMContentLoaded', starten, { once: true });
  el.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
    const m = /^(?:\/fuer-fensterbauer\/)?#([A-Za-z][\w-]*)$/.exec(a.getAttribute('href') || ''); if (!m) return;
    const ziel = el.querySelector('[id="' + m[1] + '"]'); if (!ziel) return;
    e.preventDefault();
    const top = document.querySelector('.top'), ab = (top ? top.getBoundingClientRect().height : 0) + 12;
    window.scrollTo({ top: ziel.getBoundingClientRect().top + window.scrollY - ab, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    ziel.setAttribute('tabindex', '-1'); try { ziel.focus({ preventScroll: true }); } catch (x) { /* ok */ }
  });
}
SCREENS.landing = () => {
  /* Ansicht Fensterbauer: Hinweis zum Code vom Aufmaßblatt (?von=pdf), dann die eingebettete Paket-Landingpage (ihr h1 ist das einzige
     dieser Ansicht), am Ende der Weg zu den Hauseigentümern. Die frühere Werbung für Aufmaß-Links (Tour, Rechner, „Holen Sie es in Ihr
     Konto“) ist hier weg (Bauplan E28); Preise, Anmelden und „Kostenlos starten“ bleiben in der Kopfzeile für Bestandsbetriebe. */
  if (ansicht() === 'betrieb') return { title: 'eeziframes', html: '<div class="wrap">' + (vonPdf() ? '<div class="banner vonpdf"><span><b>Sie halten ein eeziframes-Aufmaß in der Hand?</b> So holen Sie es in Ihr Konto: kostenlos registrieren, dann „Code vom Kunden einfügen“ und den Code von der letzten Seite eintippen oder einfügen. Die ersten 3 Aufmaße sind frei.</span><span class="row"><button type="button" class="btn small ghost" data-act="reg" data-v="betrieb">Kostenlos registrieren</button><button type="button" class="btn small ghost" data-act="vonpdf-zu">Später</button></span></div>' : '') +
  '</div>' + einbettung() + '<div class="wrap">' + wechsel('kunde') + '</div>' }; // die Seite für Fensterbauer volle Breite, außerhalb von .wrap
  /* Ansicht Hauseigentümer (seit 26.10.2026): der Baustein aus der Vorschau „Startseite neu gedacht“ (startseite.js, startseite.css) mit
     eigenem Kopf; portal.js zeichnet hier weder Kopfzeile noch Einführungsband (der Preis steht im Abschnitt „Preis“), nur die Fußzeile */
  return { title: 'eeziframes', kopflos: true, html: '<div class="startseite-halter" id="startseite"></div>' };
};
/* Startbild für Hauseigentümer: ein Fenster mit den vier Maßen, wie in der App */
function b2cVisual() {
  const w = AW.mk({ name: 'Wohnzimmer', mo: { hm: 1480, hl: 1480, hr: 1480, wm: 1370, wt: 1370, wb: 1370 }, el: { w: 1230, h: 1410 }, teilung: '2p', fa: '7016', fi: '9016' });
  return '<div class="b2c-card"><div class="b2c-win">' + AW.svg(w, 220) + '<span class="dim dim-h">1.480 mm</span><span class="dim dim-w">1.370 mm</span><span class="dim dim-eh">1.410 mm</span><span class="dim dim-ew">1.230 mm</span></div><div class="b2c-chips"><span class="badge">Kunststoff, anthrazit</span><span class="badge">2 Flügel Dreh-Kipp</span><span class="badge">3-fach-Glas</span><span class="badge ok">' + icon('check', 12) + 'Alle Maße da</span></div></div>';
}
/* Kundenschutz: was wir den Betrieben zusagen (Nutzungsbedingungen § 11), technisch abgesichert in app.js (NUR_EIGENES, keine PDF,
   kein Code, kein Kauf im Link) und in modell.js (importCode nimmt Codes aus fremden Projekten nicht an) */
const KS_PUNKTE = [
  ['Nur Ihr Betrieb', 'Im Link sieht Ihr Kunde nur Ihren Namen: keine anderen Betriebe, keine Werbung, keine fremden Angebote.'],
  ['Nur in Ihr Konto', 'Das Aufmaß geht ausschließlich an Sie. Kein anderer Betrieb kann es über eeziframes öffnen oder übernehmen.'],
  ['Keine Kopie von uns', 'Ihr Kunde bekommt von eeziframes weder das Aufmaßblatt noch einen Code zum Weitergeben. Eine Kopie gibt es von Ihnen, mit Ihrem Angebot.'],
  ['Kein Weiterverkauf', 'Wir sprechen Ihre Kunden nicht an, verkaufen keine Anfragen und geben ihre Daten an niemanden weiter.']
];
function kundenschutz() {
  return '<section class="sec schutz" id="kundenschutz" aria-labelledby="ks-h"><div class="schutz-kopf"><span class="schutz-ic" aria-hidden="true">' + icon('shield', 26) + '</span><div><p class="eyebrow kicker">Kundenschutz</p><h2 id="ks-h">' + akSatz('Ihr Kunde bleibt Ihr Kunde.') + '</h2><p>Wer über Ihren Link misst, trifft bei eeziframes auf keinen anderen Betrieb, vom ersten Öffnen bis lange nach dem Absenden. Das sagen wir Ihnen in den Nutzungsbedingungen verbindlich zu.</p></div></div>' +
    '<ul class="schutz-liste">' + KS_PUNKTE.map((x) => '<li><span class="schutz-haken" aria-hidden="true">' + icon('check', 14) + '</span><span><b>' + x[0] + '</b>' + x[1] + '</span></li>').join('') + '</ul>' +
    '<a class="linkbtn schutz-fuss" href="/nutzungsbedingungen/#kundenschutz">§ 11 Kundenschutz in den Nutzungsbedingungen</a></section>';
}
/* Einführungspreis für Betriebe in einem Satz (Abo 10 und Plus), sonst leer; Stichtag und Preise aus modell.js (einfuehrung) */
const einfBetrieb = () => { const e = X.einfuehrung(); return e && e.danach ? ' Zum Start gelten Einführungspreise bis ' + X.einfBis() + ', danach ' + e.danach.abo + ' € (Abo 10) und ' + e.danach.plus + ' € (Plus) im Monat.' : ''; };
const FAQ = () => [
  ['Wie genau ist das Aufmaß?', 'Die App führt durch acht Handmaße je Fenster mit dem Zollstock. Von drei Breiten und drei Höhen zählt das kleinste Maß, Abweichungen außer Winkel werden markiert. Für ein erstes Angebot reicht das; vor der Fertigung misst der Fensterbauer einmal nach.'],
  ['Was braucht mein Kunde?', 'Ein Smartphone mit Kamera und einen Zollstock. Kein Konto, keine App aus dem Store, keine Kosten. Der Link öffnet die App direkt im Browser.'],
  ['Was, wenn der Kunde nicht klarkommt?', 'Jeder Schritt hat eine Erklärung mit Bild, jeder Fachbegriff ein Glossar. Im Projekt sehen Sie, ob der Link geöffnet wurde und wie weit Ihr Kunde ist, und können gezielt nachhaken. Und ist ein Maß falsch, fragen Sie eine Nachbesserung an: Ihr Kunde ändert nur das Nötige und schickt erneut, ohne neue Kosten.'],
  ['Wer sieht die Daten?', 'Nur Sie. Aufmaße aus Ihren Links gehen an keinen anderen Betrieb, und Ihr Kunde sieht im Link nur Ihren Betrieb. Eine Kopie mit Maßen bekommt er von Ihnen, nicht von uns.'],
  ['Kann mir ein anderer Betrieb über eeziframes den Kunden abwerben?', 'Nein. Wer über Ihren Link misst, sieht keine anderen Betriebe und keine Werbung. Sein Aufmaß geht nur in Ihr Konto, er bekommt von uns weder das Aufmaßblatt noch einen Code zum Weitergeben, und wir sprechen ihn nicht an. Das sagen wir Ihnen in den Nutzungsbedingungen verbindlich zu (§ 11 Kundenschutz).'],
  ['Was ist mit Kunden, die selbst mit eeziframes messen?', 'Hauseigentümer können die App auch ohne Ihren Link nutzen; das Messen ist kostenlos, ihr Aufmaßblatt kaufen sie für ' + eur2(P().aufmass) + '. Es enthält einen Code; schickt ein Kunde es Ihnen, holen Sie es mit „Code vom Kunden einfügen“ in Ihr Konto. Das zählt wie ein eigenes Projekt.'],
  ['Wann zahle ich, und wofür?', 'Nur für Projekte mit eingegangenem Aufmaß, nie für verschickte Links. Die ersten ' + P().frei + ' sind kostenlos und brauchen keine Zahlungsart. Danach ' + P().projekt + ' € netto je Projekt, oder Sie nehmen Abo 10 (' + P().abo.grund + ' € im Monat, ' + P().abo.inkl + ' Projekte inklusive, jedes weitere ' + P().abo.extra + ' €) oder Plus (' + P().plus + ' €, unbegrenzt).' + einfBetrieb() + ' Ohne Zahlungsart bleibt ein neues Aufmaß gesperrt. Abgebucht wird alle zwei Wochen als Sammelrechnung, Abos monatlich. Nachbesserungen im selben Projekt kosten nichts.'],
  ['Kann ich die Daten weiterverarbeiten?', 'Ja: als PDF-Aufmaßblatt mit Bestellmaß-Vorschlag je Position und als Text zum Kopieren. Geplant sind Schnittstellen zu gängiger Fensterbau-Software.']
];
SCREENS.wie = () => ({ html: '<div class="wrap narrow"><div class="h hbild"><div>' + kicker('So funktioniert es') + '<h2>' + akSatz('Aufmaß ohne Anfahrt, abgerechnet mit Ihnen.') + '</h2><p>Für Fensterbauer, die ihren Kunden ein sauberes Erstaufmaß ermöglichen wollen, ohne selbst hinzufahren.</p><div class="row"><button type="button" class="btn ghost" data-act="tour">' + icon('play', 16) + 'Tour starten, acht Schritte</button></div></div><span class="hbild-l" data-lottie="messen" data-loop="1" aria-hidden="true"></span></div>' +
  '<div class="card"><p class="eyebrow">Projekt und Aufmaß-Link</p><div class="kv" style="margin-top: 10px"><span>1 · Projekt</span><span>Sie legen ein Projekt an: Kunde, Adresse und grobe Eckdaten wie Gebäude und ungefähre Fensterzahl. Oder Sie laden eine ganze Liste von Kunden auf einmal ein.</span><span>2 · Link</span><span>Sie schicken den Aufmaß-Link per WhatsApp, SMS oder E-Mail. Er gilt für ein Aufmaß: Ihr Kunde öffnet ihn innerhalb von 7, 14 oder 30 Tagen und hat ab dann 60 Tage Zeit.</span><span>3 · Aufmaß</span><span>Ihr Kunde öffnet den Link im Browser, ohne Konto und ohne Installation, und misst geführt: Fotos, Maße, Wünsche am 3-D-Modell.</span><span>4 · Eingang</span><span>Das Aufmaß landet in Ihrem Projekt. Kein anderer Betrieb sieht es.</span><span>5 · Nachbesserung</span><span>Fehlt etwas oder stimmt ein Maß nicht, fragen Sie eine Nachbesserung an. Ihr Kunde ändert nur das Nötige und schickt erneut. Kostenlos, bis zu zweimal je Projekt.</span><span>6 · Abrechnung</span><span>Mit Ihnen: 3 Projekte kostenlos, danach 9 € netto je Projekt mit eingegangenem Aufmaß, im Abo 10 Projekte für 49 € im Monat, mit Plus unbegrenzt. Ihr Kunde zahlt nichts.</span><span>7 · Datei</span><span>Ihr Kunde bekommt keine Kopie mit Maßen zum Weiterschicken; möchte er eine, geben Sie ihm das Aufmaßblatt als PDF mit dem Angebot.</span></div></div>' +
  '<div class="card"><p class="eyebrow">Für Hauseigentümer</p><div class="kv" style="margin-top: 10px"><span>Kostenlos messen</span><span>Messen, Fotos, 3-D-Modell und Wünsche sind kostenlos, mit oder ohne Link eines Betriebs. Wer ohne Link misst, kauft sein Aufmaßblatt als PDF für ' + eur2(P().aufmass) + '; wer über Ihren Link kommt, zahlt nichts, Sie bekommen das Aufmaß.</span><span>Ohne Konto</span><span>Nichts installieren, nichts anmelden. Wer ohne Link und ohne Konto misst, behält alles auf dem eigenen Gerät; Fotos verlassen es dann nur für die freiwillige KI-Auswertung. Über Ihren Link kommen die Fotos mit dem Aufmaß zu Ihnen.</span><span>Zum Fensterbauer</span><span>Das Aufmaßblatt lässt sich direkt teilen. Auf der letzten Seite steht, wie ein Fensterbauer es in sein eeziframes-Konto holt.</span></div></div>' +
  kundenschutz() +
  '<section class="sec"><div class="sec-head"><h3>' + akSatz('Häufige Fragen.') + '</h3></div><div class="faq">' + FAQ().map((f) => '<details class="fq"><summary>' + esc(f[0]) + '<span class="pchev" aria-hidden="true"></span></summary><p>' + esc(f[1]) + '</p></details>').join('') + '</div></section>' +
  (S.role ? '<div class="row"><button type="button" class="btn primary" data-act="nav" data-v="links">Zu Ihren Projekten<span class="pf" aria-hidden="true"></span></button><button type="button" class="btn ghost" data-act="go" data-v="preise">Preise</button></div></div>'
    : '<div class="row"><button type="button" class="btn primary" data-act="reg" data-v="betrieb">Kostenlos starten<span class="pf" aria-hidden="true"></span></button><button type="button" class="btn ghost" data-act="tour">' + icon('play', 16) + 'Tour starten</button><button type="button" class="btn ghost" data-act="go" data-v="preise">Preise</button><a class="btn ghost" href="' + APP_OPEN + '">Zur App</a></div></div>') });
SCREENS.preise = () => {
  const p = P(), cur = S.role === 'betrieb' ? X.konto(A()) : '';
  const card = (k, eb, pr, sm, items, btn, hi) => '<div class="price' + (cur === k || (!cur && hi) ? ' hi' : '') + '"><p class="eyebrow">' + eb + (cur === k ? ' · Ihr Tarif' : '') + '</p><span class="p">' + pr + '<small>' + sm + '</small></span><ul>' + items.map((t) => '<li>' + t + '</li>').join('') + '</ul>' + btn + '</div>';
  /* eine Cream-Pille je Bildschirm: nur die empfohlene Karte (Abo 10) trägt sie, die anderen Ring */
  const btn = (k, l) => { const haupt = k === 'abo', cls = 'btn ' + (haupt ? 'primary' : 'ghost'), pf = haupt ? '<span class="pf" aria-hidden="true"></span>' : ''; return S.role ? (cur === k ? '' : '<button type="button" class="' + cls + '" data-act="konto" data-v="' + k + '">' + l + pf + '</button>') : '<button type="button" class="' + cls + '" data-act="reg" data-v="betrieb">' + (k === 'service' ? 'Kostenlos starten' : 'Starten') + pf + '</button>'; };
  return { html: '<div class="wrap"><div class="h">' + kicker('Preise für Fensterbauer') + '<h2>' + akSatz('Sie zahlen für Projekte, in denen ein Aufmaß ankommt.') + '</h2><p>Einzeln, im Abo oder unbegrenzt. Ihr Kunde zahlt nichts und braucht kein Konto. Nur für Unternehmer (§ 14 BGB). Monatlich kündbar, alle Preise netto' + (p.mwst ? ' zzgl. MwSt.' : '') + '</p></div>' +
    '<div class="grid c3 pricegrid">' + card('service', 'Start', '0 €', ' Grundgebühr', [p.frei + ' Projekte kostenlos', 'danach ' + p.projekt + ' € je Projekt mit eingegangenem Aufmaß', 'Projekte, Aufmaß-Links, Einladungslisten', 'Ihre Einladungsseite mit Logo', 'Nachbesserungen inklusive', 'Zahlungsart erst ab dem ' + (p.frei + 1) + '. Projekt'], btn('service', 'Zu Start wechseln')) +
    card('abo', 'Abo 10', p.abo.grund + ' €', ' im Monat', [].concat(X.einfText('abo') ? ['<b>' + esc(X.einfText('abo')) + '</b>'] : [], [p.abo.inkl + ' Projekte im Monat inklusive', 'jedes weitere ' + p.abo.extra + ' €', 'günstiger ab ' + Math.ceil(p.abo.grund / p.projekt) + ' Projekten im Monat', 'Nachbesserungen inklusive', 'monatlich kündbar']), btn('abo', 'Abo 10 starten'), true) +
    card('plus', 'Plus', p.plus + ' €', ' im Monat', [].concat(X.einfText('plus') ? ['<b>' + esc(X.einfText('plus')) + '</b>'] : [], ['Projekte unbegrenzt', 'günstiger ab ' + (p.abo.inkl + Math.ceil((p.plus - p.abo.grund) / p.abo.extra)) + ' Projekten im Monat', 'keine Zählung je Projekt', 'Nachbesserungen inklusive', 'monatlich kündbar']), btn('plus', 'Plus starten')) + '</div>' +
    '<div class="grid c2"><div class="card kcost"><span class="ci">' + icon('nouser', 22) + '</span><div><b>Für Ihren Kunden: kostenlos und ohne Konto.</b><p>Er misst über Ihren Link und schickt das Aufmaß an Sie. Eine Kopie mit allen Maßen bekommt er von Ihnen: ein Klick im Projekt, PDF mit dem Angebot. Ihr Kunde bleibt Ihr Kunde.</p></div></div>' +
    '<div class="card kcost"><span class="ci">' + icon('euro', 22) + '</span><div><b>Hauseigentümer ohne Link: ' + eur2(p.aufmass) + ' je Aufmaßblatt.</b>' + (X.einfText('aufmass') ? '<p class="einf">' + esc(X.einfText('aufmass')) + '</p>' : '') + '<p>Messen, Fotos, 3-D-Modell und Wünsche sind kostenlos. Das fertige Aufmaßblatt als PDF kostet einmalig ' + eur2(p.aufmass) + (p.mwst ? ' inkl. MwSt.' : '') + ', für das ganze Projekt, auch wenn später Fenster dazukommen. Darin steht der Code, mit dem jeder Fensterbauer das Aufmaß in sein Konto holt.</p><a class="btn ghost" href="' + APP_OPEN + '">Zur App</a></div></div></div>' +
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
  if (r.step === 2) { title = 'Ihre Einladung.'; body = dupNote(d) + '<div class="f2">' + inp('Postleitzahl des Betriebs', 'plz', 'z. B. 51063', 'text', 'Für die Rechnung.', 'postal-code') + '<div class="f"><span class="lbl" id="reg-l-farbe">Farbe Ihres Zeichens</span><div class="colors" role="group" aria-labelledby="reg-l-farbe">' + window.Einladung.FARBEN.map((c) => '<button type="button" class="col" data-act="reg-set" data-k="col" data-v="' + c + '" style="background: ' + c + '" aria-label="Farbe ' + EIN_FARBNAME[c] + '" aria-pressed="' + (col === c) + '"></button>').join('') + '</div><small>Für Ihre Initiale beim Kunden und den Kopf Ihres Aufmaßblatts.</small></div></div>' +
    '<div class="ein-reg-vor"><p class="eyebrow">Erster Bildschirm beim Kunden</p>' + einTelefon(window.Einladung.html({ name: firmaName, kunde: 'Familie Weber', du: false, p: window.Einladung.auftritt({ ap: d.ap }, col), vorschau: true }), 'kurz') + '<p class="km-s">Logo, Begrüßung und Telefon für Rückfragen stellen Sie danach unter „Mein Betrieb · Einladungsseite“ ein.</p></div><p class="km-s pv-schutz">' + icon('shield', 16) + '<span>Kundenschutz: Im Link sieht Ihr Kunde nur Ihren Betrieb, und sein Aufmaß geht nur an Sie.</span></p>' + agree('Ich registriere mich als Unternehmer (§ 14 BGB) für meinen Betrieb und akzeptiere die <button type="button" class="ulink" data-act="sheet" data-v="legal" data-id="agb">Nutzungsbedingungen für Fensterbauer</button> (Stand: ' + esc(nbStandDE()) + ') einschließlich des Vertrags über die Auftragsverarbeitung (Anlage). Aufmaße meiner Kunden nutze ich nur für deren Projekt.'); }
  const total = steps.length - f0, pos = r.step - f0 + 1, last = r.step === steps.length - 1;
  return { title: 'Konto für Fensterbauer', html: '<div class="wrap narrow"><div class="stepbar"><span style="width: ' + (pos / total * 100) + '%"></span></div><div class="h">' + kicker('Schritt ' + pos + ' von ' + total + ' · ' + steps[r.step]) + '<h2>' + akSatz(title) + '</h2></div><form class="form" data-form="reg" novalidate>' + body + '</form>' + (Object.keys(e).length ? '<p class="err-sum" role="alert">Bitte die markierten Felder prüfen.</p>' : '') + '<div class="row between formnav"><button type="button" class="btn ghost" data-act="reg-prev">' + (r.step > f0 ? 'Zurück' : 'Abbrechen') + '</button><button type="button" class="btn primary" data-act="reg-next">' + (last ? 'Konto anlegen' : 'Weiter') + '<span class="pf" aria-hidden="true"></span></button></div>' + (r.step === f0 ? '<p class="sub center">Schon ein Konto? <button type="button" class="ulink" data-act="sheet" data-v="login">Anmelden</button> · Hauseigentümer? <a class="ulink" href="' + APP_OPEN + '">Zur App, ohne Konto</a></p>' : '') + '</div>' };
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
  S.notif[id] = [{ t: 'Willkommen bei eeziframes', s: dup ? 'Für ' + dup + ' gibt es schon ein Konto, die kostenlosen Projekte wurden dort genutzt. Ab dem ersten Aufmaß brauchen Sie eine Zahlungsart.' : 'Legen Sie Ihr erstes Projekt an oder laden Sie gleich mehrere Kunden ein. Die ersten ' + P().frei + ' Projekte sind kostenlos.', when: stamp(), new: true, to: ['links'] }];
  S.reg = null; S._feier = 'willkommen';
  return login('betrieb', id, 'Willkommen, ' + d.ap.trim().split(' ')[0]);
}

SCREENS.notif = () => {
  const list = notifs();
  return { html: '<div class="wrap narrow"><div class="h">' + kicker('Eingang und Verlauf') + '<h2>' + akSatz('Ihre Nachrichten.') + '</h2><p>' + (INST ? 'Geöffnete Links, eingereichte Anfragen und Nachbesserungen, die neuesten zuerst.' : 'Geöffnete Links, eingegangene Aufmaße, Nachbesserungen und Rechnungen, die neuesten zuerst.') + '</p></div><div class="list">' + (list.length ? list.map((n, i) => '<button type="button" class="item nitem' + (n.new ? ' is-new' : '') + '" data-act="notif-open" data-i="' + i + '"><span class="ic">' + icon('bell', 22) + '</span><span class="tx"><span class="ti">' + esc(n.t) + '</span><span class="di">' + esc(n.s) + '</span><span class="me">' + esc(zeitText(n.when)) + (n.new ? ' · <b class="neu-w">neu</b>' : '') + '</span></span>' + (n.new ? '<span class="badge acc">neu</span>' : '') + (n.to ? CHEV : '') + '</button>').join('') : empty('Keine Nachrichten.', 'Hier landet alles, was passiert: geöffnete Links, eingegangene Aufmaße, Nachbesserungen.', '<button type="button" class="btn ghost" data-act="nav" data-v="links">Zu den Projekten</button>', 'eingang')) + '</div>' + (list.some((n) => n.new) ? '<div><button type="button" class="btn ghost" data-act="read-all">Alle als gelesen markieren</button></div>' : '') + '</div>' };
};
/* ---------- Bildschirme: Fensterbauer ---------- */
/* Jemand kommt über die PDF eines Kunden (QR-Code): ein Hinweis, der direkt zum Ziel führt */
function vonPdf() {
  try { return /[?&]von=pdf/.test(location.search) && !sessionStorage.getItem('aufmass.vonpdf.zu'); } catch (e) { return false; }
}
function banners() {
  if (INST) return '';
  let h = '';
  if (vonPdf() && S.role === 'betrieb') h += '<div class="banner vonpdf"><span><b>Sie halten ein eeziframes-Aufmaß in der Hand?</b> Den Code von der letzten Seite hier einfügen, dann liegt es als Projekt bei Ihnen.</span><span class="row"><button type="button" class="btn small ghost" data-act="sheet" data-v="linkimport">Code vom Kunden einfügen</button><button type="button" class="btn small ghost" data-act="vonpdf-zu">Später</button></span></div>';
  return h;
}
/* ---------- Bildschirme: Projekte und Aufmaß-Links ---------- */
/* Instanz (Signature-Dashboard): Angelegt, Eingeladen, In Bearbeitung, Eingereicht; die Status selbst bleiben dieselben (modell.js) */
const LST = INST ? { erstellt: ['Angelegt', ''], gesendet: ['Eingeladen', 'acc'], geoeffnet: ['In Bearbeitung', 'warn'], arbeit: ['In Bearbeitung', 'warn'], eingegangen: ['Eingereicht', 'ok'], abgelaufen: ['Abgelaufen', 'bad'], deaktiviert: ['Deaktiviert', 'bad'] }
  : { erstellt: ['Nicht verschickt', ''], gesendet: ['Link gesendet', 'acc'], geoeffnet: ['Link geöffnet', 'warn'], arbeit: ['Kunde misst', 'warn'], eingegangen: ['Aufmaß da', 'ok'], abgelaufen: ['Abgelaufen', 'bad'], deaktiviert: ['Deaktiviert', 'bad'] };
const TL = INST ? { erstellt: 'Projekt angelegt', gesendet: 'Eingeladen', geoeffnet: 'Link geöffnet', arbeit: 'In Bearbeitung', eingegangen: 'Eingereicht' } : { erstellt: 'Projekt angelegt', gesendet: 'Link gesendet', geoeffnet: 'Link geöffnet', arbeit: 'Kunde misst', eingegangen: 'Aufmaß eingegangen' };
const TLS = INST ? { erstellt: 'Angelegt', gesendet: 'Eingeladen', geoeffnet: 'Geöffnet', arbeit: 'In Bearbeitung', eingegangen: 'Eingereicht' } : { erstellt: 'Angelegt', gesendet: 'Gesendet', geoeffnet: 'Geöffnet', arbeit: 'Kunde misst', eingegangen: 'Eingegangen' };
const LORDER = ['erstellt', 'gesendet', 'geoeffnet', 'arbeit', 'eingegangen'];
/* Gebäude wie in der App (AW.gebaeude): Denkmalschutz und Altbau ändern Förderwerte und Klärung */
const PGEB = { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Wohnung', denkmal: 'Denkmalschutz', altbau: 'Altbau', gewerbe: 'Gewerbe' };
const PFZ = ['1 bis 2', '3 bis 5', '6 bis 10', 'mehr als 10'];
const PPLAN = ['Fenster', 'Haustür', 'Rollläden', 'Insektenschutz', 'Fensterbänke'];
/* Was die App nicht misst: steht beim Anlegen und im Projekt als Punkt für den Termin vor Ort */
const NICHT_IN_APP = { 'Haustür': 'Die Haustür misst Ihr Kunde in der App nicht; sie ist ein eigenes Produkt mit eigener Beratung. Bitte vor Ort aufnehmen.' };
const nichtInApp = (plan) => (plan || []).filter((x) => NICHT_IN_APP[x]).map((x) => NICHT_IN_APP[x]);
const linkHash = (l) => '#k-' + l.code + '-' + slug(BC().name) + '.' + b64u(BC().name) + '.' + b64u(l.kunde || '') + einLinkTeil(l) + (l.nb && l.nb.offen ? '~' + l.nb.runde : ''); // einLinkTeil: Anrede und Profil (Einladungsseite)
const linkURL = (l) => APP_URL + linkHash(l);
const linkOpen = (l) => APP_OPEN + '?vorschau=1' + linkHash(l); // Vorschau: speichert und sendet nichts, zählt nicht als geöffnet
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
  const fs = INST && l.fortschritt && ['geoeffnet', 'arbeit'].includes(l.status) ? l.fortschritt : null; // Instanz: Zahl der Fenster und zuletzt aktiv
  const small = fs ? nW(Number(fs.fenster) || 0, 'Fenster', 'Fenster') + (fs.zuletzt ? ' · zuletzt ' + vorZeit(fs.zuletzt) : '') : INST && done && l.via === 'Website' && !(l.nb && l.nb.offen) ? 'über Ihre Website' + ((l.log || {}).eingegangen ? ' · ' + esc(l.log.eingegangen) : '') : l.status === 'arbeit' ? l.progress + ' von 4 Maßen' : done ? (l.nb && l.nb.offen ? 'Nachbesserung angefragt' : ((l.runde || 1) > 1 ? 'nachgebessert · ' : '') + ((l.log || {}).eingegangen || '')) : dead ? '' : ['gesendet', 'geoeffnet'].includes(l.status) && l.via ? 'über ' + esc(l.via) : 'Link noch nicht verschickt';
  const right = done ? '<span class="rt"><b>' + (l.nachladen ? 'Anfrage' : nW(wins.length || (l.aufmass ? l.aufmass.windows.length : 0), 'Position', 'Positionen')) + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : dead ? '<span class="rt"><span class="badge bad">' + m[0] + '</span></span>' : '<span class="rt"><b>' + (restT ? nW(restT, 'Tag', 'Tage') : 'heute') + '</b><small>Link gültig</small></span>';
  return '<button type="button" class="item pcard st-' + (l.locked ? 'locked' : l.status) + (done && !l.seen ? ' is-new' : '') + '" data-act="go" data-v="link" data-id="' + l.id + '">' + (done && !l.seen ? '<span class="neu badge acc">Neu</span>' : '') + '<span class="pvis">' + vis + '</span><span class="tx"><span class="ti">' + esc(l.kunde) + (l.demo ? ' <span class="badge">Beispiel</span>' : '') + (l.test ? ' <span class="badge">Test</span>' : '') + '</span><span class="di">' + esc([placeOf(l), l.fz ? 'ca. ' + l.fz + ' Fenster' : ''].filter(Boolean).join(' · ')) + (l.nr ? (placeOf(l) || l.fz ? ' · ' : '') + '<span class="nr">' + esc(l.nr) + '</span>' : '') + '</span><span class="row lst">' + stepDots(l) + '<span class="badge ' + m[1] + '">' + m[0] + '</span>' + (small ? '<small class="me">' + small + '</small>' : '') + '</span>' + (done ? '<span class="rt-m"><b>' + (l.nachladen ? 'Anfrage' : nW(wins.length || (l.aufmass ? l.aufmass.windows.length : 0), 'Position', 'Positionen')) + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : dead ? '' : '<span class="rt-m"><small class="me">Link noch ' + (restT ? nW(restT, 'Tag', 'Tage') : 'heute') + ' gültig</small></span>') + '</span>' + right + CHEV + '</button>';
}
function linkItem(l) {
  const m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : (LST[l.status] || LST.erstellt), prog = l.status === 'arbeit' ? '<span class="mprog"><span style="width: ' + (l.progress / 4 * 100) + '%"></span></span><small>' + l.progress + ' von 4 Maßen</small>' : '';
  const right = l.status === 'eingegangen' && l.aufmass ? '<span class="rt"><b>' + nW(l.aufmass.windows.length, 'Position', 'Positionen') + '</b><span class="badge ' + (l.locked ? 'warn' : 'ok') + '">' + (l.locked ? 'freischalten' : 'ansehen') + '</span></span>' : ['gesendet', 'geoeffnet'].includes(l.status) && l.via ? '<span class="rt"><span class="badge">' + esc(l.via) + '</span></span>' : '';
  return '<button type="button" class="item litem' + (l.status === 'eingegangen' && !l.seen ? ' is-new' : '') + '" data-act="go" data-v="link" data-id="' + l.id + '"><span class="ic av" style="background: ' + (l.status === 'eingegangen' ? 'var(--ok)' : 'var(--surface2)') + '; color: ' + (l.status === 'eingegangen' ? '#fff' : 'var(--fg2)') + '">' + esc((l.kunde || '?').replace(/^(Beispiel:\s*)?(Herr|Frau|Familie)\s+/, '').slice(0, 1)) + '</span><span class="tx"><span class="ti">' + esc(l.kunde) + (l.demo ? ' <span class="badge">Beispiel</span>' : '') + '</span><span class="di">' + esc([placeOf(l), l.fz ? 'ca. ' + l.fz + ' Fenster' : '', l.nr].filter(Boolean).join(' · ')) + '</span><span class="row lst"><span class="badge ' + m[1] + '">' + m[0] + '</span>' + prog + '</span></span>' + right + CHEV + '</button>';
}
/* Projektliste (S6). Reihenfolge nach dem, was zu tun ist: neu eingegangen, Kunde misst oder hat geöffnet, Link gesendet,
   angelegt (noch nicht verschickt), eingegangen und gesehen, abgelaufen oder deaktiviert; innerhalb einer Stufe die neuesten zuerst.
   Kennzahlen: „Beim Kunden“ zählt nur verschickte Links; angelegte stehen als „noch nicht verschickt“ darunter und als eigener Filter. */
const LRANG = (l) => (l.status === 'eingegangen' ? (l.seen ? 4 : 0) : ({ arbeit: 1, geoeffnet: 1, gesendet: 2, erstellt: 3 }[l.status] ?? 5));
const BEIM_KUNDEN = ['gesendet', 'geoeffnet', 'arbeit'];
SCREENS.links = () => {
  if (INST) return linksInst();
  const a = A(), L = a.links, kunde = L.filter((l) => BEIM_KUNDEN.includes(l.status)), neu = L.filter((l) => l.status === 'erstellt'), rec = L.filter((l) => l.status === 'eingegangen');
  const f = S.lfilt === 'offen' ? 'kunde' : S.lfilt === 'neu' && !neu.length ? 'alle' : (S.lfilt || 'alle');
  const shown = f === 'kunde' ? kunde : f === 'neu' ? neu : f === 'eingegangen' ? rec : L;
  const kopfK = kicker(esc(BC().name));
  if (!L.length) return { html: '<div class="wrap narrow">' + banners() + payBanner() + '<div class="h">' + kopfK + '<h2>' + akSatz('Ihr erstes Projekt.') + '</h2><p>Für einen Kunden, den Sie schon haben: Projekt anlegen, Aufmaß-Link schicken, und das Aufmaß kommt zu Ihnen zurück.</p></div>' +
    '<div class="card hero-link"><div class="hl-steps"><div><span class="n">1</span><b>Projekt anlegen</b><small>Kunde und ein paar Eckdaten.</small></div><div><span class="n">2</span><b>Link schicken</b><small>WhatsApp, SMS oder E-Mail.</small></div><div><span class="n">3</span><b>Aufmaß bekommen</b><small>Maße, Fotos und Wünsche je Fenster.</small></div></div><div class="row"><button type="button" class="btn primary big" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Erstes Projekt anlegen<span class="pf" aria-hidden="true"></span></button><button type="button" class="btn ghost big" data-act="sheet" data-v="liste">Mehrere Kunden einladen</button><button type="button" class="btn ghost big" data-act="tour">' + icon('play', 18) + 'Tour ansehen</button></div><p class="km-s">' + kontingentText(a) + ' Ihr Kunde zahlt nichts.</p></div>' +
    '<p class="km-s">Ein Kunde hat Ihnen ein eeziframes-Aufmaßblatt geschickt? <button type="button" class="ulink" data-act="sheet" data-v="linkimport">Code vom Kunden einfügen</button></p></div>' };
  const filter = [['alle', 'Alle', L.length], ['kunde', 'Beim Kunden', kunde.length]].concat(neu.length ? [['neu', 'Nicht verschickt', neu.length]] : [], [['eingegangen', 'Eingegangen', rec.length]]);
  const leer = f === 'eingegangen' ? empty('Noch nichts eingegangen.', 'Sobald ein Kunde sein Aufmaß abschickt, steht es hier.', '', 'eingang') : f === 'neu' ? empty('Alles verschickt.', 'Jedes angelegte Projekt hat seinen Link bekommen.', '', 'eingang') : empty('Gerade misst niemand.', 'Verschickte Links, an denen ein Kunde noch misst, stehen hier.', '', 'eingang');
  return { html: '<div class="wrap">' + banners() + payBanner() + '<div class="h hrow"><div>' + kopfK + '<h2>' + akSatz('Ihre Projekte.') + '</h2><p>Ein Projekt je Kunde. Den Aufmaß-Link schicken Sie direkt aus dem Projekt.</p></div>' +
    '<button type="button" class="btn primary big l-neu-knopf" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Neues Projekt<span class="pf" aria-hidden="true"></span></button></div>' +
    '<div class="grid c3 stats">' + stat('warn', 'send', 'Beim Kunden', kunde.length, kunde.length ? 'Link verschickt, Kunde misst noch' : 'gerade misst niemand') + stat('ok', 'inbox', 'Eingegangen', rec.length, rec.reduce((s2, l) => s2 + (l.aufmass ? l.aufmass.windows.length : 0), 0) + ' Positionen mit Fotos') + kontingentStat(a) + '</div>' +
    (neu.length ? '<p class="km-s l-neu">' + icon('link', 15) + '<span>' + (neu.length === 1 ? '1 Projekt hat den Aufmaß-Link noch nicht bekommen.' : neu.length + ' Projekte haben den Aufmaß-Link noch nicht bekommen.') + (f !== 'neu' ? ' <button type="button" class="ulink" data-act="lfilt" data-v="neu">Anzeigen</button>' : '') + '</span></p>' : '') +
    '<div class="l-leiste"><div class="chips scrollchips lfilter" role="group" aria-label="Projekte filtern">' + filter.map((o) => '<button type="button" class="chip" data-act="lfilt" data-v="' + o[0] + '" aria-pressed="' + (f === o[0]) + '">' + esc(o[1]) + '<span class="n">' + o[2] + '</span></button>').join('') + '</div>' +
    '<div class="l-neben"><button type="button" class="btn small ghost" data-act="sheet" data-v="liste">' + icon('people', 18) + 'Liste einladen</button><button type="button" class="btn small ghost" data-act="sheet" data-v="linkimport"><span class="hide-s">Code vom Kunden einfügen</span><span class="only-xs">Code einfügen</span></button></div></div>' +
    '<div class="list plist">' + (shown.length ? shown.slice().sort((x, y) => LRANG(x) - LRANG(y)).map(projCard).join('') : leer) + '</div></div>' };
};
SCREENS.newlink = () => {
  if (INST && !instEinladen()) return SCREENS.links();
  const n = S.nl || (S.nl = { step: 0, kunde: '', kontakt: '', adresse: '', geb: '', fz: '', plan: ['Fenster'], note: '', days: 14, du: (A().einladung || {}).anrede === 'du', err: {} }), e = n.err || {}, c = BC(), a = A(), st = n.step || 0;
  const fake = { kunde: n.kunde || 'Familie Weber', code: 'xxxxx', du: n.du };
  const one = (k, v, label) => '<button type="button" class="chip small" data-act="nl-set" data-k="' + k + '" data-v="' + esc(v) + '" aria-pressed="' + (n[k] === v) + '">' + esc(label) + '</button>';
  let body, nav;
  if (!st) {
    body = '<div class="f' + (e.kunde ? ' has-err' : '') + '"><label for="nl-kunde">Name des Kunden</label><input id="nl-kunde" data-in="nl:kunde" value="' + esc(n.kunde) + '" placeholder="z. B. Familie Weber" autocomplete="off">' + (e.kunde ? '<small class="err">' + esc(e.kunde) + '</small>' : '<small>Steht als Anrede in der Nachricht.</small>') + '</div>' +
      '<div class="f"><label for="nl-kontakt">Handynummer oder E-Mail</label><input id="nl-kontakt" data-in="nl:kontakt" value="' + esc(n.kontakt) + '" placeholder="z. B. 0171 2345678" autocomplete="off"><small>Freiwillig. Dann geht der Link gleich per WhatsApp, SMS oder E-Mail raus.</small></div>' +
      '<div class="f"><label>Anrede in Nachricht und Einladungsseite</label>' + seg([['sie', 'Sie'], ['du', 'Du']], n.du ? 'du' : 'sie', 'nl-du') + '<small>Die Messschritte der App duzen immer, damit jede Anleitung kurz bleibt.</small></div>';
    nav = '<div class="row between formnav"><button type="button" class="btn ghost" data-act="back">Abbrechen</button><button type="button" class="btn primary" data-act="nl-next">Weiter<span class="pf" aria-hidden="true"></span></button></div>';
  } else {
    body = '<div class="f"><label for="nl-adresse">Objektadresse</label><input id="nl-adresse" data-in="nl:adresse" value="' + esc(n.adresse) + '" placeholder="z. B. Lindenstraße 14, 50823 Köln" autocomplete="off"></div>' +
      '<div class="f"><label>Gebäude</label><div class="chips">' + Object.keys(PGEB).map((k) => one('geb', k, PGEB[k])).join('') + '</div></div>' +
      '<div class="f"><label>Wie viele Fenster ungefähr?</label><div class="chips">' + PFZ.map((v) => one('fz', v, v)).join('') + '</div></div>' +
      '<div class="f"><label>Was ist geplant?</label><div class="chips">' + PPLAN.map((v) => '<button type="button" class="chip small" data-act="nl-plan" data-v="' + v + '" aria-pressed="' + ((n.plan || []).indexOf(v) >= 0) + '">' + v + '</button>').join('') + '</div>' + nichtInApp(n.plan).map((t) => '<small class="nl-hinweis">' + esc(t) + '</small>').join('') + '</div>';
    nav = '<div class="row between formnav"><button type="button" class="btn ghost" data-act="nl-prev">Zurück</button><button type="button" class="btn primary" data-act="nl-create">' + icon('link', 18) + 'Projekt anlegen<span class="pf" aria-hidden="true"></span></button></div>' + (INST ? '' : '<p class="km-s">Bezahlt wird nur ein eingegangenes Aufmaß. ' + kontingentText(a) + '</p>') + '<p class="km-s pv-schutz">' + icon('shield', 16) + '<span>Kundenschutz: Ihr Kunde sieht im Link nur Ihren Betrieb, sein Aufmaß geht nur an Sie.</span></p>';
  }
  return { title: 'Neues Projekt', html: '<div class="wrap"><div class="nl-grid"><div><div class="stepbar"><span style="width: ' + (st ? 100 : 50) + '%"></span></div><div class="h">' + kicker('Schritt ' + (st + 1) + ' von 2 · ' + (st ? 'Eckdaten' : 'Kunde')) + '<h2>' + (st ? akSatz('Ein paar Eckdaten.') : akSatz('Für wen ist das Projekt?')) + '</h2><p>' + (st ? 'Alles freiwillig, hilft beim Angebot. Später im Projekt änderbar.' : 'Ein Projekt je Kunde. Der Aufmaß-Link kommt im nächsten Schritt.') + '</p></div><div class="card"><form class="form" data-form="nl" novalidate>' + body + nav + '</form></div></div>' +
    '<div class="pv"><p class="eyebrow">So kommt die Nachricht an</p><div class="phone small"><div class="ph-top"><span class="ph-av">' + esc(window.Einladung ? window.Einladung.initiale(c.name) : c.name.slice(0, 1)) + '</span><span><b>' + esc(c.name) + '</b><small>Nachricht</small></span></div><div class="ph-body"><div class="bub out show" id="pv-msg">' + pvHTML(fake) + '</div></div></div><p class="km-s">Den Text können Sie nach dem Anlegen noch ändern.</p><p class="km-s">Ihr Kunde sieht im Link nur Ihren Betrieb: keine anderen Anbieter, keine Werbung. Sein Aufmaß bleibt in diesem Projekt.</p></div></div></div>' };
};
/* Vorschau der Nachricht: zuerst die Adresse durch die Linkvorschau ersetzen, dann die Zeilenumbrüche; umgekehrt liefe \S+ über
   „<br><br>Viele“ hinweg und die Grußzeile fehlte */
const pvHTML = (fake) => esc(linkMsg(fake)).replace(/https?:\/\/[^\s<]+/, '<span class="lp"><b>' + (INST ? esc(BC().name) + ' · Fensterplaner' : 'eeziframes · Aufmaß für ' + esc(BC().name)) + '</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span>').replace(/\n/g, '<br>');
function pvUpdate() { const el = document.getElementById('pv-msg'), n = S.nl; if (el && n) el.innerHTML = pvHTML({ kunde: n.kunde || 'Familie Weber', code: 'xxxxx', du: n.du }); }
/* Das Aufmaß als Text (Kopieren, Speichern ohne PDF): dieselbe Reihenfolge wie auf dem Bildschirm, Klärungsliste mit Stand */
function aufmassText(l) {
  if (INST && AW.aufmassText) return AW.aufmassText(l, { abzug: A().abzug, fuss: 'Erfasst mit dem Fensterplaner von ' + BC().name + '. Vor der Fertigung Feinaufmaß vor Ort.' });
  const am = l.aufmass || {}, pr = am.proj || {}, wins = am.windows || [], ab = AW.abzugVon(A().abzug), out = [], tot = AW.num(pr.total), nE = am.elemente || wins.reduce((s2, w) => s2 + (AW.num(w.anzahl) || 1), 0);
  out.push('Aufmaß · ' + l.kunde + (l.nr ? ' · ' + l.nr : ''), [l.adresse, AW.lab('gebaeude', pr.gebaeude) + (pr.baujahr ? ', Baujahr ' + pr.baujahr : '')].filter(Boolean).join(' · '), 'Eingegangen: ' + ((l.log || {}).eingegangen || '') + ' · Zeitraum: ' + (AW.lab('zeit', pr.zeit) || '–') + ' · Budget: ' + (AW.lab('budget', pr.budget) || '–'));
  const kk = kundeKontakt(l); if (l.kontakt || kk.length) out.push('Kontakt: ' + [l.kontakt].concat(kk.map((r) => r[0] + ' ' + r[1])).filter(Boolean).join(' · '));
  out.push('Fenster im Haus: ' + (tot ? nE + ' von ' + tot + ' werden getauscht' : 'nicht angegeben'));
  if (pr.notiz) out.push('Nachricht vom Kunden: ' + pr.notiz);
  const fw = AW.foerdWeg(pr); if (fw) out.push('Förderung: ' + AW.lab('foerdweg', fw));
  if (AW.tiefeKopf(wins, pr, true)) out.push('Geplant: ' + AW.tiefeKopf(wins, pr, true));
  const kl = amKlaer(l);
  if (kl.length) {
    out.push('', 'Mit dem Kunden zu klären: ' + kl.filter((r) => klaerOk(l, r.id)).length + ' von ' + kl.length + ' geklärt');
    AW.klaerGruppen(kl).forEach((g) => { out.push('  ' + g.titel); g.punkte.forEach((r) => { out.push('  [' + (klaerOk(l, r.id) ? 'x' : ' ') + '] ' + r.k + ': ' + r.v + (r.warum ? ' (' + r.warum + ')' : '')); if (klaerNotiz(l, r.id)) out.push('      Notiz: ' + klaerNotiz(l, r.id)); }); });
  }
  out.push('');
  wins.forEach((w, i) => {
    const b = AW.bestellmass(w, ab), W = AW.wuensche(w, pr), N = (n) => '    Notiz des Kunden' + (n[2] === 'notiz' ? '' : ' zu ' + n[0]) + ': „' + n[1] + '“';
    out.push('Pos. ' + (i + 1) + ' · ' + (w.name || 'Fenster') + ' · ' + (AW.num(w.anzahl) || 1) + ' Stück');
    if (b) out.push('  Bestellmaß-Vorschlag: ' + b.text + ' (' + b.formel + ')' + (b.warnText ? '. ' + b.warnText : ''));
    out.push('  Wunsch: ' + W.satz + '.');
    if (W.offen.length) out.push('  Noch offen: ' + W.offen.join(', '));
    W.notizen.allgemein.forEach((n) => out.push(N(n)));
    W.gruppen.forEach((g) => { out.push('  ' + g.titel + ': ' + g.zeilen.map((z) => (g.zeilen.length > 1 || z.k !== g.titel ? z.k + ' ' : '') + ihrStd(z.t)).join('; ')); if (g.standard.length) out.push('    Nach Ihrem Standard: ' + g.standard.join(', ')); g.notizen.forEach((n) => out.push(N(n))); });
    out.push('  Maße: ' + posMasse(w).map((r) => r[0] + ' ' + r[1]).join('; '));
    W.notizen.masse.concat(W.notizen.fotos).forEach((n) => out.push(N(n)));
    AW.kiRows(w).forEach((r) => out.push('  Einbausituation, ' + r[0] + ': ' + r[1]));
    out.push('');
  });
  out.push('Erfasst mit eeziframes. Vor der Fertigung Feinaufmaß vor Ort.');
  return out.join('\n');
}
const LSEEN = {};
SCREENS.link = () => {
  const a = A(), l = a.links.find((x) => x.id === S.sel); if (!l) return SCREENS.links();
  if (INST && l.nachladen) nachladen(l.id); // älter als 30 Tage: die Liste hat nur den Kopf, das Aufmaß kommt nach
  if (l.status === 'eingegangen' && !l.seen) { l.seen = true; if (INST && darfFeld('seen')) Server.projekt(l.id, { seen: true }); } // Instanz: „Neu“ gilt für alle Zugänge
  const lkey = l.status + ':' + l.progress, fresh = LSEEN[l.id] !== undefined && LSEEN[l.id] !== lkey; LSEEN[l.id] = lkey;
  const m = l.locked ? ['Aufmaß da · gesperrt', 'warn'] : LST[l.status], idx = LORDER.indexOf(l.status), done = l.status === 'eingegangen', dead = ['abgelaufen', 'deaktiviert'].includes(l.status), u = linkURL(l), msg = linkMsg(l), phone = isPhone(l.kontakt), mail = /@/.test(l.kontakt || '');
  const cur = dead ? null : (done ? 'eingegangen' : LORDER[Math.max(0, idx)]);
  const tl = '<ol class="tlh">' + LORDER.map((s, i) => '<li class="' + (i < idx || done ? 'done' : i === idx ? 'now' : '') + (fresh && (i === idx || (done && i === LORDER.length - 1)) ? ' fresh' : '') + '"><span class="dot"></span><small>' + TLS[s] + '</small><small class="ts">' + esc(zeitText((l.log || {})[s])) + '</small></li>').join('') + '</ol>' +
    '<p class="km-s tl-now">' + (dead ? esc(m[0]) + '.' : cur ? '<b>' + TL[cur] + (cur === 'arbeit' ? ' · ' + l.progress + ' von 4 Maßen' : '') + '</b>' + ((l.log || {})[cur] ? ' · ' + esc(zeitText(l.log[cur])) : '') + (l.via && idx >= 1 ? ' · über ' + esc(l.via) : '') : '') + ((l.vorher || []).length ? ' · ' + nW(l.vorher.length, 'Nachbesserung', 'Nachbesserungen') + ((l.log || {}).nachbesserung ? ', zuletzt ' + esc(zeitText(l.log.nachbesserung)) : '') : '') + (l.nb && l.nb.offen ? ' · Nachbesserung angefragt ' + esc(zeitText(l.nb.when)) : '') + '</p>';
  const nbOffen = !!(l.nb && l.nb.offen), nbOk = nbMoeglich(l);
  const share = '<div class="card sharecard' + (nbOffen ? ' nbcard' : '') + '"><div class="row between"><p class="eyebrow">' + (nbOffen ? 'Nachbesserung · Link erneut schicken' : 'Aufmaß-Link schicken') + '</p><span class="km-s">gilt bis ' + esc(l.expires) + '</span></div>' + (nbOffen ? '<p class="km-s nbhint">Runde ' + l.nb.runde + (l.nb.hinweis ? ' · Ihr Hinweis: „' + esc(l.nb.hinweis) + '“' : '') + '. Der Kunde sieht seine bisherigen Angaben, ändert sie und schickt erneut ab.' + (INST ? '' : ' Dafür wird nichts berechnet.') + ' <button type="button" class="ulink" data-act="nb-cancel" data-id="' + l.id + '">Zurückziehen</button></p>' : '') + '<div class="linkbox"><code class="sel" id="lnk">' + esc(u) + '</code><button type="button" class="btn small soft" data-act="l-share" data-v="link" data-id="' + l.id + '">' + icon('copy', 16) + 'Kopieren</button></div>' +
    '<div class="share"><a class="sbtn wa" href="https://wa.me/' + (phone ? intl(l.kontakt) : '') + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener" data-act="l-share" data-v="WhatsApp" data-id="' + l.id + '">' + ICONS.wa + '<span>WhatsApp</span></a><a class="sbtn" href="sms:' + (phone ? String(l.kontakt).replace(/\s/g, '') : '') + '?body=' + encodeURIComponent(msg) + '" data-act="l-share" data-v="SMS" data-id="' + l.id + '">' + ICONS.sms + '<span>SMS</span></a><a class="sbtn" href="mailto:' + (mail ? esc(l.kontakt) : '') + '?subject=' + encodeURIComponent('Ihr Fenster-Aufmaß für ' + BC().name) + '&body=' + encodeURIComponent(msg) + '" data-act="l-share" data-v="E-Mail" data-id="' + l.id + '">' + ICONS.mail + '<span>E-Mail</span></a><button type="button" class="sbtn" data-act="l-share" data-v="Text" data-id="' + l.id + '">' + ICONS.copy + '<span>Text kopieren</span></button></div>' +
    '<div class="f"><label for="lmsg">Nachricht</label><textarea id="lmsg" rows="4" data-in="lmsg:' + l.id + '">' + esc(msg) + '</textarea><div class="row between"><span class="row" style="gap: 8px">' + seg([['sie', 'Sie'], ['du', 'Du']], l.du ? 'du' : 'sie', 'l-du') + seg([['7', '7 Tage'], ['14', '14 Tage'], ['30', '30 Tage']], String(l.days || 14), 'l-days') + '</span>' + (l.msg ? '<button type="button" class="linkbtn" data-act="l-reset-msg" data-id="' + l.id + '">Text zurücksetzen</button>' : '') + '</div></div>' + einAnredeZeile(l) +
    '<p class="km-s">' + (Server.online() ? 'Ab dem ersten Öffnen hat Ihr Kunde ' + X.OFFEN_TAGE + ' Tage Zeit, auch wenn die Laufzeit kürzer ist; sein Zwischenstand bleibt gespeichert, er kann jederzeit über den Link weitermachen. Abgelaufene Links lassen sich verlängern.' : 'Ihr Kunde kann jederzeit über den Link weitermachen; seine Angaben bleiben in seinem Browser gespeichert.') + '</p>' +
    '<p class="km-s">' + (l.kontakt ? 'Kontakt: <span class="sel">' + esc(l.kontakt) + '</span>. ' : 'Ohne Nummer öffnet WhatsApp die Kontaktauswahl. ') + 'SMS und E-Mail öffnen Ihr Programm, falls das Gerät es erlaubt; sonst den Text kopieren.</p></div>';
  let result = '';
  if (done && l.nachladen) result = '<section class="sec am5"><div class="card"><p class="km-s">Aufmaß wird geladen …</p></div></section>';
  if (done && l.aufmass) {
    const am = l.aufmass, pr = am.proj || {}, wins = am.windows || [], ab = AW.abzugVon(a.abzug), kl = amKlaer(l);
    /* Strang S5: Kopf, Klärungsliste, Übersicht, Positionen (siehe „Aufmaß beim Betrieb“ oben) */
    result = '<section class="sec am5"><div class="sec-head"><h3>' + akSatz('Das Aufmaß.') + '</h3><span class="sub">' + nW(wins.length, 'Position', 'Positionen') + ' · ' + nW(am.elemente || wins.length, 'Element', 'Elemente') + ' · ' + nW(am.fotos || 0, 'Foto', 'Fotos') + '</span></div>' +
      amKopf(l, am) + klaerKarte(l, kl) +
      '<div class="row between poshead"><span class="eyebrow">Positionen</span><button type="button" class="linkbtn" data-act="pos-all">Alle aufklappen</button></div>' + amUebersicht(l, wins, ab, kl) +
      '<div class="poslist">' + wins.map((w, i) => posCard(w, i, ab, POS_OFFEN.has(l.id + ':' + i), pr, l, kl)).join('') + '</div></section>' +
      '<section class="sec"><div class="sec-head"><h3>' + akSatz('Stand des Projekts.', 0) + '</h3></div><div class="card"><div class="pipe">' + [['neu', 'Neu'], ['angebot', 'Angebot'], ['termin', 'Feinaufmaß'], ['auftrag', 'Auftrag'], ['verloren', 'Verloren']].map((s) => '<button type="button" data-act="l-stage" data-id="' + l.id + '" data-v="' + s[0] + '" aria-pressed="' + ((l.stage || 'neu') === s[0]) + '">' + s[1] + '</button>').join('') + '</div><div class="f" style="margin-top: 12px"><label for="lmemo">Notiz zum Stand</label><textarea id="lmemo" data-in="lmemo:' + l.id + '" placeholder="z. B. Angebot bis Freitag">' + esc(l.memo || '') + '</textarea></div></div></section>';
  }
  const pdata = '<details class="card fold"><summary><span>Projektdaten<small>' + esc([l.kontakt, placeOf(l), projFacts(l)].filter(Boolean).join(' · ') || 'Kontakt, Objekt, Eckdaten, interne Notiz') + '</small></span></summary><div class="fold-body"><div class="kv"><span>Kunde</span><span>' + esc(l.kunde) + '</span><span>Kontakt</span><span>' + (l.kontakt ? '<span class="sel">' + esc(l.kontakt) + '</span>' : '–') + '</span>' + kontaktKv(l) + '<span>Objekt</span><span>' + esc(l.adresse || '–') + '</span><span>Eckdaten</span><span>' + esc(projFacts(l) || '–') + '</span><span>Link</span><span>' + (dead ? esc(m[0]) : 'gültig bis ' + esc(l.expires)) + ', Anrede ' + (l.du ? 'Du' : 'Sie') + '</span></div><div class="f" style="margin-top: 12px"><label for="pnote">Interne Notiz</label><textarea id="pnote" data-in="pnote:' + l.id + '" placeholder="Sieht nur Ihr Team"' + (darfFeld('note') ? '' : ' readonly') + '>' + esc(l.note || '') + '</textarea></div></div></details>';
  return { title: l.kunde, html: '<div class="wrap narrow"><div class="h">' + kicker((l.demo ? 'Beispielprojekt' : INST && l.test ? 'Testanfrage · <span class="nr">' + esc(l.nr || '') + '</span>' : INST && l.via === 'Website' ? 'Anfrage über ' + esc((a.instanz || {}).host || INST.host) + ' · <span class="nr">' + esc(l.nr || '') + '</span>' : 'Projekt <span class="nr">' + esc(l.nr || '') + '</span>') + ' · angelegt ' + esc(l.created)) + '<h2>' + akSatz(mitPunkt(l.kunde)) + '</h2><p>' + esc([placeOf(l), projFacts(l)].filter(Boolean).join(' · ') || 'Ohne Eckdaten') + '</p><div class="row"><span class="badge ' + m[1] + (fresh ? ' pop' : '') + '">' + m[0] + '</span>' + (l.via ? '<span class="badge">über ' + esc(l.via) + '</span>' : '') + (nbOffen ? '<span class="badge warn">Nachbesserung angefragt</span>' : (l.runde || 1) > 1 ? '<span class="badge acc">Nachgebessert · Runde ' + l.runde + '</span>' : '') + '</div></div>' +
    (S.justCreated === l.id ? '<div class="card created"><span class="burst-ok" data-lottie="fertig"><span class="lottie-still">' + icon('check', 30) + '</span></span><div><b>Projekt angelegt.</b><span>Jetzt den Aufmaß-Link an ' + esc(l.kunde) + ' schicken.</span></div></div>' : '') +
    (done && nbOffen && darfFeld('gesendet') ? share : '') + (done ? (l.locked ? lockCard(l, a) : result) : '') + (!done && !dead && darfFeld('gesendet') ? share : '') +
    '<section class="sec"><div class="sec-head"><h3>' + akSatz('Bisheriger Verlauf.') + '</h3></div><div class="card tlcard">' + tl + '</div></section>' + (nichtInApp(l.plan).length && !done ? '<div class="note vorort"><b>Vor Ort aufnehmen.</b> ' + nichtInApp(l.plan).map(esc).join(' ') + '</div>' : '') + pdata +
    '<div class="row">' + (!dead ? '<a class="btn ghost" href="' + linkOpen(l) + '" target="_blank" rel="noopener">Als Kunde öffnen ' + icon('ext', 15) + '</a>' : '') + (!done && !dead && darfFeld('deaktivieren') ? '<button type="button" class="btn danger" data-act="sheet" data-v="deact" data-id="' + l.id + '">Link deaktivieren</button>' : '') + (done && !nbOffen && nbOk === 'ok' && darfFeld('nb') ? '<button type="button" class="btn ghost" data-act="sheet" data-v="nachbesserung" data-id="' + l.id + '">' + icon('swap', 16) + 'Nachbesserung anfragen</button>' : '') + (l.status === 'abgelaufen' && darfFeld('verlaengern') ? '<button type="button" class="btn primary" data-act="l-verl" data-id="' + l.id + '">Um ' + X.VERLAENGERN_TAGE + ' Tage verlängern<span class="pf" aria-hidden="true"></span></button>' : '') + ((done || dead) && instEinladen() ? '<button type="button" class="btn ghost" data-act="l-again" data-id="' + l.id + '">' + (dead ? 'Neuen Link für ' : 'Weiteres Projekt für ') + esc(l.kunde.replace(/^Beispiel:\s*/, '').replace(/^Herr(?= )/, 'Herrn')) + '</button>' : '') + (INST ? '<button type="button" class="btn ghost b-loeschen" data-act="sheet" data-v="p-loeschen" data-id="' + l.id + '">Anfrage löschen</button>' : '') + '</div>' + (done && !nbOffen && nbOk && nbOk !== 'ok' ? '<p class="km-s">' + esc(nbOk) + '</p>' : '') +
    (INST ? '<p class="km-s">„Als Kunde öffnen“ zeigt Ihren Fensterplaner so, wie Ihr Kunde ihn sieht, als Vorschau: Was Sie dort eingeben, wird weder gespeichert noch gesendet, und der Link gilt weiter als ungeöffnet. Schickt Ihr Kunde seine Planung ab, erscheint sie hier von selbst.</p>' : '<p class="km-s">„Als Kunde öffnen“ zeigt die eeziframes-App so, wie Ihr Kunde sie sieht, als Vorschau: Was Sie dort eingeben, wird weder gespeichert noch gesendet, und der Link gilt weiter als ungeöffnet. ' + (Server.online() ? 'Schickt Ihr Kunde sein Aufmaß ab, erscheint es hier von selbst.' : 'In der Pilotphase schickt Ihr Kunde nach dem Absenden einen Aufmaß-Code, den Sie über „Code vom Kunden einfügen“ übernehmen.') + '</p>') + '</div>' };
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
  const plans = [['service', 'Start · keine Grundgebühr', p.frei + ' Projekte frei, danach ' + p.projekt + ' € netto je Projekt mit eingegangenem Aufmaß.'], ['abo', 'Abo 10 · ' + p.abo.grund + ' € im Monat', p.abo.inkl + ' Projekte im Monat inklusive, jedes weitere ' + p.abo.extra + ' €. Monatlich kündbar.'], ['plus', 'Plus · ' + p.plus + ' € im Monat', 'Projekte unbegrenzt, ohne Zählung je Projekt. Monatlich kündbar.']];
  const payCard = '<div class="card paycard"><div class="row between" style="align-items: center; flex-wrap: nowrap"><span style="min-width: 0"><p class="eyebrow">Zahlungsart</p><b>' + (a.pay ? esc(a.pay.type) + ' · ' + esc(a.pay.label) : 'Noch keine hinterlegt') + '</b><small>' + (a.pay ? 'Projekte werden alle zwei Wochen als Sammelrechnung eingezogen, Abos monatlich.' : 'Nötig ab dem ersten kostenpflichtigen Projekt. Bis dahin wird nichts abgebucht.') + '</small></span><button type="button" class="btn small ' + (a.pay ? 'ghost' : 'primary') + '" data-act="sheet" data-v="pay">' + (a.pay ? 'Ändern' : 'Hinterlegen<span class="pf" aria-hidden="true"></span>') + '</button></div></div>';
  return { html: '<div class="wrap">' + payBanner() + '<div class="h">' + kicker('Tarif ' + esc(X.planName(k))) + '<h2>' + akSatz('Ihre Abrechnung.') + '</h2><p>' + kontingentText(a) + ' Nachbesserungen kosten nichts, Ihr Kunde zahlt nichts.' + (a.dupOf ? ' Die kostenlosen Projekte für Ihren Betrieb wurden schon über das Konto ' + esc(a.dupOf) + ' genutzt.' : '') + '</p></div>' +
    '<div class="grid c3 stats">' + stat('ok', 'inbox', 'Aufmaße', rec.length, 'eingegangen') + kontingentStat(a) + stat(nextInv ? 'warn' : 'acc', 'euro', 'Nächste Rechnung', nextInv, nextInv ? 'netto, bisher' : 'nichts offen', 'eur') + '</div>' + payCard +
    '<section class="sec"><div class="sec-head"><h3>' + akSatz('Ihr Tarif.') + '</h3><button type="button" class="linkbtn" data-act="go" data-v="preise">Alle Preise ›</button></div><div class="grid c3">' + plans.map((o) => '<button type="button" class="opt" data-act="konto" data-v="' + o[0] + '" aria-pressed="' + (k === o[0]) + '"><span><b>' + o[1] + '</b><small>' + o[2] + '</small></span></button>').join('') + '</div>' +
    (a.downgrade ? '<p class="km-s">Wechsel zu ' + X.planName(a.downgrade.to) + ' zum ' + esc(a.downgrade.at) + ' vorgemerkt. Bis dahin bleibt ' + X.planName(k) + ' aktiv. <button type="button" class="linkbtn" data-act="konto" data-v="' + k + '">' + X.planName(k) + ' behalten</button></p>' : k !== 'service' ? '<p class="km-s">' + X.planName(k) + ' ist für ' + esc(monthLabel()) + ' gebucht. Ein Wechsel nach unten gilt zum Monatsende; gebuchte Positionen bleiben, wie sie sind.</p>' : '') + '</section>' +
    '<section class="sec"><div class="sec-head"><h3>' + akSatz('Gebuchte Positionen.') + '</h3></div>' + (all.length ? '<div class="card ledger">' + all.join('') + '</div><p class="km-s">Gebucht wird beim ersten Eingang je Projekt, zum dann gültigen Tarif. Nachbesserungen im selben Projekt kosten nichts. Projekte löschen oder den Tarif wechseln ändert gebuchte Positionen nicht.</p>' : empty('Noch keine Positionen.', 'Sobald ein Aufmaß eingeht, steht es hier.')) + '</section></div>' };
};
const abEx = (ab) => 'Beispiel: Fensteröffnung 1.260 × 1.440 mm ergibt ' + AW.th(1260 - 2 * ab.seite) + ' × ' + AW.th(1440 - ab.oben - (ab.unten || 0)) + ' mm. Meldet ein Foto einen Anschlag oder ist die Öffnung außer Winkel, steht beim Bestellmaß ein Hinweis.';
SCREENS.bprofil = () => {
  if (INST) return bprofilInst();
  const c = BC(), a = A(), p = a.prefs || {}, ab = a.abzug || (a.abzug = { seite: 15, oben: 15 });
  return { html: '<div class="wrap"><div class="h">' + kicker(esc(c.name)) + '<h2>' + akSatz('Ihr Betrieb.') + '</h2><p>Ihre Einladungsseite, Ihr Kontakt zu eeziframes und wie eeziframes für Sie rechnet.</p></div><div class="grid c2">' + einKarte() +
    '<div class="card"><p class="eyebrow">Zugang und Kontakt</p><div class="form" style="margin-top: 10px"><div class="f"><label for="b-ap">Ansprechpartner</label><input id="b-ap" data-in="b:ap" value="' + esc(a.ap) + '"><small>Unterschreibt die Nachricht an Ihre Kunden.</small></div><div class="f2"><div class="f"><label for="b-mail">E-Mail</label><input id="b-mail" data-in="b:mail" value="' + esc(a.mail) + '" type="email"></div><div class="f"><label for="b-tel">Telefon</label><input id="b-tel" data-in="b:tel" value="' + esc(a.tel) + '" type="tel"></div></div></div></div></div>' +
    '<div class="grid c2"><div class="card"><p class="eyebrow">Bestellmaß-Vorschlag</p><p class="sub" style="margin-top: 6px">Ihr Abzug von der Maueröffnung. Damit rechnet eeziframes in jedem eingegangenen Aufmaß ein Bestellmaß vor; verbindlich bleibt Ihr Feinaufmaß.</p><div class="f2" style="margin-top: 10px"><div class="f"><label for="ab-seite">Je Seite</label><input id="ab-seite" type="number" inputmode="numeric" min="0" max="60" value="' + ab.seite + '" data-in="ab:seite"><small>mm, links und rechts</small></div><div class="f"><label for="ab-oben">Oben</label><input id="ab-oben" type="number" inputmode="numeric" min="0" max="60" value="' + ab.oben + '" data-in="ab:oben"><small>mm</small></div><div class="f"><label for="ab-unten">Unten, Fenster</label><input id="ab-unten" type="number" inputmode="numeric" min="0" max="60" value="' + (ab.unten || 0) + '" data-in="ab:unten"><small>mm, Fensterbankanschluss</small></div><div class="f"><label for="ab-untenT">Unten, Türen</label><input id="ab-untenT" type="number" inputmode="numeric" min="0" max="60" value="' + (ab.untenT || 0) + '" data-in="ab:untenT"><small>mm, an der Schwelle</small></div></div><p class="km-s" id="ab-ex" style="margin-top: 8px">' + abEx(ab) + '</p></div>' +
    /* E-Mails verschickt nur der Server (functions/api/benachrichtigung.js); in der Pilotphase gibt es sie nicht, das steht hier statt der Schalter */
    '<div class="card"><p class="eyebrow">Benachrichtigungen</p>' + (Server.online() && Server.status && Server.status.post ? sw('E-Mail bei neuem Aufmaß', 'sofort an ' + (a.mail || 'Ihre E-Mail-Adresse') + ', mit Link zum Projekt', p.mail !== false, 'bpref', 'mail') + sw('Erinnerung an offene Links', 'einmal, wenn ein Kunde 3 Tage nach dem Verschicken noch nicht misst', p.remind !== false, 'bpref', 'remind') : '<p class="sub b-mail-pilot">' + (Server.online() ? 'E-Mails bei neuem Aufmaß und Erinnerungen an offene Links verschickt eeziframes, sobald der Mailversand eingerichtet ist.' : 'Pilotphase: E-Mails bei neuem Aufmaß und Erinnerungen an offene Links kommen mit dem Start auf unserem Server.') + ' Bis dahin steht alles unter <button type="button" class="ulink" data-act="nav" data-v="notif">Nachrichten</button>.</p>') + '</div></div>' +
    '<section class="sec"><div class="sec-head"><h3>' + akSatz('Ihr Team.') + '</h3></div><div class="card"><div class="kv"><span>Inhaber</span><span>' + esc(a.ap) + ' · darf alles</span></div><p class="km-s b-team"><span class="badge">geplant</span> Eigene Zugänge für Mitarbeiter gibt es noch nicht. Bis dahin arbeitet Ihr Team mit diesem Zugang.</p></div></section>' +
    '<div class="row"><button type="button" class="btn ghost" data-act="tour">' + icon('play', 16) + 'Tour ansehen</button><button type="button" class="btn ghost" data-act="logout">Abmelden</button></div></div>' };
};

/* ---------- Einladungsseite (Strang S4) ----------
   Die erste Seite beim Kunden gestaltet der Betrieb hier: Logo, Farbe seines Zeichens, Begrüßung (Sie und Du, mit {Kunde}),
   Ansprechpartner mit Foto, Telefon und E-Mail für Rückfragen, Ort, Website und die Anrede für neue Projekte. Die Vorschau zeigt die
   echte Seite (einladung.js, dieselbe Funktion wie in der App), so wie Ihr Kunde sie jetzt sieht. Gespeichert wird wie die übrigen
   Betriebsdaten: im Browser (Pilotphase) bzw. auf dem Server (PATCH /api/konto, geprüft in konten.js). Beim Kunden kommt an:
   - mit Server: alles, sofort auch in schon verschickten Links (GET /api/link/:code liefert das Profil)
   - Pilotphase: Begrüßung, Ansprechpartner, Telefon, E-Mail, Ort, Website, Farbe und Anrede reisen gekürzt im Link mit (Stand beim
     Verschicken, linkHash); Logo und Foto nicht, dort steht die Initiale. Die Seite sagt das dem Betrieb.
   Bedient wird über data-ein, data-ein-feld und data-ein-datei mit eigenen Zuhörern (unten), act() und onInput() bleiben unberührt. */
const EIN_UI = { acc: null, entwurf: null, du: null, laeuft: '' };
const EIN_FARBNAME = { '#0071e3': 'Blau', '#1f7a3d': 'Grün', '#a85a00': 'Ocker', '#6e3fc2': 'Violett', '#0b7285': 'Petrol', '#b3261e': 'Rot' };
/* Instanz: Firmenfarbe der Marke wie in der Seitenleiste und auf der Kundenseite (instProfil in app.js); auftritt() kennt nur FARBEN */
const einAuftritt = (a) => {
  const E = window.Einladung;
  if (!INST) return E.auftritt(a || A(), BC().col);
  const p = E.auftritt(a || A(), INST.farbe || '');
  p.col = E.hexFarbe(INST.farbe) || p.col;
  p.logoUrl = INST.logo || '';
  return p;
};
/* was beim Kunden ankommt: ohne Server weder Logo noch Foto */
const einSichtbar = (p) => (Server.online() ? p : Object.assign({}, p, { logo: '', foto: '' }));
/* Teil des Kundenlinks: die Anrede immer, im Pilotbetrieb das gekürzte Profil und der Hinweis einer Nachbesserung */
function einLinkTeil(l) {
  if (!window.Einladung) return '';
  const pilot = !Server.online(), t = window.Einladung.linkTeil(einAuftritt(), { du: !!l.du, voll: pilot, hinweis: pilot && l.nb && l.nb.offen ? l.nb.hinweis || '' : '' });
  return t ? '.' + t : '';
}
/* Einstellungen zum Bearbeiten: der gespeicherte Stand oder, beim ersten Mal, vorbelegt aus dem Konto (Telefon noch nicht sichtbar) */
function einEntwurf() {
  if (EIN_UI.acc !== S.cur) { EIN_UI.acc = S.cur; EIN_UI.entwurf = null; EIN_UI.du = null; }
  if (EIN_UI.entwurf) return EIN_UI.entwurf;
  const a = A();
  return window.Einladung.einstellungen(a.einladung || { ansprechpartner: a.ap, telefon: a.tel, telefonZeigen: false, anrede: 'sie' });
}
const einDu = () => (EIN_UI.du !== null ? EIN_UI.du : einEntwurf().anrede === 'du');
/* Auf dem Server speichern; scheitert es, gilt wieder der Stand des Servers */
function einServer(p) {
  if (!Server.online()) return;
  Server.api('/api/konto', p, 'PATCH').then((r) => { Server.uebernehmen(r.konto); refresh(); }).catch((e) => { toast(e.message); Server.laden().then(() => refresh()).catch(() => {}); });
}
function einSpeichern(teil, still) {
  const E = window.Einladung, e = Object.assign({}, einEntwurf(), teil || {});
  ['begruessung', 'begruessungDu'].forEach((k, i) => { if (String(e[k] || '').trim() === E.VORLAGE[i ? 'du' : 'sie']) e[k] = ''; }); // Vorlage: bleibt mit künftigen Verbesserungen gleich
  const f = [], sauber = E.einstellungen(e, f);
  if (f.length) { toast(f[0]); return false; }
  A().einladung = sauber; EIN_UI.entwurf = null; einServer({ einladung: sauber }); save();
  if (!still) toast('Gespeichert');
  return true;
}
function einVorschauHTML(du) {
  const c = BC(), online = Server.online();
  return window.Einladung.html({ name: c.name, kunde: 'Familie Weber', du: du, p: einSichtbar(einAuftritt(Object.assign({}, A(), { einladung: einEntwurf() }))), bis: online ? dateIn(60) : '', server: online, vorschau: true, instanz: INST ? { kz: INST.m.kennzeichnung || 'keine', website: false, kopie: false, start: {}, bilder: [] } : undefined });
}
function einVorschauNeu() { const el = document.getElementById('ein-vor'); if (!el) return; const top = el.scrollTop; el.innerHTML = einVorschauHTML(einDu()); el.scrollTop = top; }
/* Telefonrahmen mit der echten Seite; lässt sich scrollen, nichts darin ist bedienbar */
const einTelefon = (inhalt, cls) => '<div class="ein-telefon' + (cls ? ' ' + cls : '') + '"><div class="ein-tel-kopf" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 4.5C3 3.7 3.7 3 4.5 3H11v16H4.5c-.8 0-1.5.5-1.5 1.2zM19 4.5c0-.8-.7-1.5-1.5-1.5H11v16h6.5c.8 0 1.5.5 1.5 1.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg>Begriffe</div><div class="ein-tel-inhalt" id="ein-vor" tabindex="0" role="region" aria-label="Vorschau der Einladungsseite">' + inhalt + '</div></div>';
/* Karte in „Mein Betrieb“: der Absender, wie ihn der Kunde sieht, der Stand in einer Zeile und der Weg zum Gestalten */
function einKarte() {
  const a = A(), c = BC(), e = a.einladung, p = einSichtbar(einAuftritt()), E = window.Einladung;
  const stand = [INST ? (INST.logo ? 'mit Logo' : 'ohne Logo') : a.logo ? (Server.online() ? 'mit Logo' : 'Logo hinterlegt, beim Kunden ab dem Serverbetrieb') : 'ohne Logo', e && (e.begruessung || e.begruessungDu) ? 'eigene Begrüßung' : 'Begrüßung nach Vorlage', p.tel ? 'Telefon sichtbar' : 'ohne Telefon', 'Anrede ' + (e && e.anrede === 'du' ? 'Du' : 'Sie'), p.tiefe ? 'Planung: ' + AW.TIEFE_NAME[p.tiefe] : '', p.std ? 'eigener Standard' : ''].filter(Boolean);
  return '<div class="card fcard ein-b-karte"><p class="eyebrow">Ihre Einladungsseite</p>' + E.kopf({ name: c.name, p: p, klein: true, unten: 'für Familie Weber' }) +
    '<p class="sub">Das sieht Ihr Kunde als Erstes, wenn er Ihren ' + (INST ? 'Einladungslink' : 'Aufmaß-Link') + ' öffnet: Ihr Name, Ihr Logo, Ihre Begrüßung und wen er bei Fragen anruft.' + (INST ? '' : ' eeziframes steht nur klein darunter, als Übermittler.') + '</p>' +
    '<p class="km-s">' + esc(stand.join(' · ')) + '</p><div class="row"><button type="button" class="btn primary" data-act="go" data-v="einladung">Einladungsseite gestalten<span class="pf" aria-hidden="true"></span></button></div></div>';
}
SCREENS.einladung = () => {
  const E = window.Einladung, a = A(), c = BC(), e = einEntwurf(), du = einDu(), online = Server.online(), lauf = EIN_UI.laeuft;
  const gruss = (du ? e.begruessungDu : e.begruessung) || E.VORLAGE[du ? 'du' : 'sie'], eigen = !!(du ? e.begruessungDu : e.begruessung);
  const segE = (opts, cur, k, lid) => '<div class="seg" role="group"' + (lid ? ' aria-labelledby="' + lid + '"' : '') + '>' + opts.map((o) => '<button type="button" data-ein="' + k + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + esc(o[1]) + '</button>').join('') + '</div>';
  /* Schalter wie sw() (S6): die ganze Zeile ist das Ziel, rechts der Schalter als Bild */
  const swE = (label, sub, on, k) => '<button type="button" class="sw-row" role="switch" aria-checked="' + !!on + '" data-ein="schalter" data-v="' + k + '"><span class="t"><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><span class="switch" aria-hidden="true"><span></span></span></button>';
  const datei = (art, label) => '<label class="btn small soft ein-datei' + (lauf === art ? ' laeuft' : '') + '">' + (lauf === art ? '<span class="spin" aria-hidden="true"></span>Wird verkleinert …' : esc(label)) + '<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-ein-datei="' + art + '" aria-label="' + esc(label) + '"' + (lauf ? ' disabled' : '') + '></label>';
  const feld = (id, k, label, wert, ph, typ, klein) => '<div class="f"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="' + (typ || 'text') + '" data-ein-feld="' + k + '" value="' + esc(wert || '') + '" placeholder="' + esc(ph || '') + '" maxlength="' + (E.MAX[k === 'ansprechpartner' ? 'ap' : k === 'telefon' ? 'tel' : k] || 80) + '"' + (typ === 'tel' ? ' autocomplete="tel"' : typ === 'email' ? ' autocomplete="email"' : '') + '>' + (klein ? '<small>' + klein + '</small>' : '') + '</div>';
  const zeichen = '<div class="ein-logo-feld"><div class="ein-logo-vor">' + E.zeichen(c.name, { logo: a.logo, grund: e.logoGrund, col: c.col }, 'gross') + '</div><div class="ein-logo-tx"><b>' + (a.logo ? 'Ihr Logo' : 'Noch kein Logo') + '</b><small>' + (a.logo ? 'So steht es oben auf Ihrer Einladungsseite.' : 'Bis dahin steht Ihre Initiale in Ihrer Farbe.') + '</small></div></div>';
  const karteLogo = INST ? '<section class="card ein-b-karte"><p class="eyebrow">Logo und Farbe</p><div class="ein-logo-feld"><div class="ein-logo-vor">' + instZeichen('gross') + '</div><div class="ein-logo-tx"><b>' + (INST.logo ? 'Ihr Logo' : 'Ihre Initiale') + '</b><small>So steht es oben auf Ihrer Einladungsseite.</small></div></div><p class="km-s">Logo, Farbe und Fotos Ihres Fensterplaners pflegt Ihr Einrichtungsservice. Änderungswünsche schicken Sie über das Kundenkonto.</p></section>' : '<section class="card ein-b-karte"><p class="eyebrow">Logo und Farbe</p>' + zeichen +
    '<div class="row">' + datei('logo', a.logo ? 'Anderes Logo' : 'Logo hochladen') + (a.logo ? '<button type="button" class="btn small ghost" data-ein="logo-weg">Entfernen</button>' : '') + '</div>' +
    '<p class="km-s">PNG, JPG oder SVG. Ihr Browser verkleinert es auf höchstens 480 × 160 Pixel und schneidet durchsichtige Ränder ab; gespeichert werden höchstens etwa 90 KB.</p>' +
    (a.logo ? '<div class="f"><span class="lbl" id="ein-l-grund">Hintergrund des Logos</span>' + segE([['hell', 'Helles Feld'], ['dunkel', 'Ohne Feld']], e.logoGrund, 'grund', 'ein-l-grund') + '<small>Dunkle Logos brauchen ein helles Feld, helle stehen direkt auf dem dunklen Grund.</small></div>' : '') +
    '<div class="f"><span class="lbl" id="ein-l-farbe">Farbe Ihres Zeichens</span><div class="colors" role="group" aria-labelledby="ein-l-farbe">' + E.FARBEN.map((col) => '<button type="button" class="col" data-ein="farbe" data-v="' + col + '" style="background: ' + col + '" aria-label="Farbe ' + EIN_FARBNAME[col] + '" aria-pressed="' + (c.col === col) + '"></button>').join('') + '</div><small>Erscheint in Ihrer Initiale, solange kein Logo da ist, und im Kopf Ihres Aufmaßblatts. Knöpfe und Texte bleiben in den Farben von eeziframes, damit sich Ihr Kunde überall zurechtfindet.</small></div>' +
    (online ? '' : '<p class="km-s ein-pilot">' + icon('lock', 14) + '<span>Pilotphase: Logo und Foto sieht Ihr Kunde erst, wenn eeziframes mit Server läuft. Bis dahin steht dort Ihre Initiale; die Vorschau zeigt es so.</span></p>') + '</section>';
  const karteGruss = '<section class="card ein-b-karte"><div class="row between"><p class="eyebrow" id="ein-l-gruss">Begrüßung</p>' + segE([['sie', 'Sie'], ['du', 'Du']], du ? 'du' : 'sie', 'du', 'ein-l-gruss') + '</div>' +
    '<div class="f"><label for="ein-gruss">Für Kunden, die Sie ' + (du ? 'duzen' : 'siezen') + '</label><textarea id="ein-gruss" rows="5" maxlength="' + E.MAX.gruss + '" data-ein-feld="gruss">' + esc(gruss) + '</textarea>' +
    '<div class="row between ein-gruss-zeile"><button type="button" class="btn small soft" data-ein="kunde">Kundennamen einfügen</button><span class="km-s" id="ein-zahl">' + gruss.length + ' / ' + E.MAX.gruss + '</span></div>' +
    '<small>{Kunde} wird durch den Namen aus dem Projekt ersetzt, z. B. „Familie Weber“. ' + (eigen ? '<button type="button" class="linkbtn" data-ein="vorlage">Vorlage wiederherstellen</button>' : 'Das ist unsere Vorlage, ändern Sie sie gern.') + '</small></div>' +
    '<div class="f"><span class="lbl" id="ein-l-anrede">Anrede für neue Projekte</span>' + segE([['sie', 'Sie'], ['du', 'Du']], e.anrede, 'anrede', 'ein-l-anrede') + '<small>Gilt für die Nachricht und diese Seite; im Projekt ändern Sie sie je Kunde. Die Messschritte der App duzen immer, damit jede Anleitung kurz bleibt; bei Sie steht dazu ein Satz auf der Seite.</small></div></section>';
  const apBild = e.foto ? '<img class="ein-ap-foto gross" src="' + esc(e.foto) + '" alt="Foto ' + esc(e.ansprechpartner || a.ap || '') + '">' : '<span class="ein-ap-foto gross ini" aria-hidden="true">' + esc(E.initiale(e.ansprechpartner || a.ap || c.name)) + '</span>';
  const karteAp = '<section class="card ein-b-karte"><p class="eyebrow">Ansprechpartner</p>' +
    '<div class="ein-ap-feld">' + apBild + '<div class="row">' + datei('foto', e.foto ? 'Anderes Foto' : 'Foto hochladen') + (e.foto ? '<button type="button" class="btn small ghost" data-ein="foto-weg">Entfernen</button>' : '') + '</div></div>' +
    '<p class="km-s">Freiwillig. Ein Foto macht die Anfrage persönlich; es wird quadratisch auf 192 Pixel verkleinert.</p>' +
    feld('ein-ap', 'ansprechpartner', 'Name', e.ansprechpartner, 'Vor- und Nachname', 'text', 'Unterschreibt die Begrüßung und steht bei „Fragen?“.') +
    feld('ein-tel', 'telefon', 'Telefon für Rückfragen', e.telefon, 'z. B. 0221 123456', 'tel') + swE('Telefon beim Kunden zeigen', 'mit Knopf „Anrufen“', e.telefonZeigen, 'telefonZeigen') +
    feld('ein-mail', 'mail', 'E-Mail für Rückfragen', e.mail, a.mail || 'buero@beispiel.de', 'email', e.mail ? '' : 'Leer: ' + esc(a.mail || 'die E-Mail-Adresse Ihres Kontos') + '.') + swE('E-Mail beim Kunden zeigen', 'mit Knopf „E-Mail“', e.mailZeigen, 'mailZeigen') +
    '<div class="f2">' + feld('ein-ort', 'ort', 'Ort, freiwillig', e.ort, 'z. B. Köln') + feld('ein-web', 'web', 'Website, freiwillig', e.web, 'z. B. fensterbau-brandt.de', 'url') + '</div></section>';
  /* Standard des Fensterbauers: wie genau die Kunden planen (Vorgabe für die Tiefe in der App) und der eigene Standard in einem Satz.
     Was der Kunde nicht gefragt wird oder nicht wählt, steht im Aufmaß als „nach Ihrem Standard“, nie als offene Frage */
  const TIEFE_B = { '': 'Ihr Kunde wählt selbst, wie genau er plant; vorgeschlagen sind die üblichen Wünsche.', kurz: 'Nur das Wichtigste: Element, Maße, Material, Farbe, Glas, Sonnenschutz. Alles Weitere machen Sie nach Ihrem Standard.', normal: 'Die üblichen Wünsche: dazu Griff, Sprossen, Kasten, Fensterbänke und Montage. Feine Details nach Ihrem Standard.', genau: 'Alles im Detail: auch Profil, Dichtung, Bänder, Lüfter, Endkappen. Wo Ihr Kunde nichts wählt, gilt Ihr Standard.' };
  const karteTiefe = '<section class="card ein-b-karte ein-b-tiefe"><p class="eyebrow">Standard des Fensterbauers</p>' +
    '<p class="sub">Was Ihr Kunde nicht gefragt wird oder nicht auswählt, steht im Aufmaß als „nach Ihrem Standard“. Offen, mit der Bitte um Beratung, ist nur, wo er „Weiß ich noch nicht“ tippt.</p>' +
    '<div class="f"><span class="lbl" id="ein-l-tiefe2">Wie genau Ihre Kunden planen</span>' + segE([['', 'Frei'], ['kurz', 'Kurz'], ['normal', 'Üblich'], ['genau', 'Alles']], e.tiefe || '', 'tiefe', 'ein-l-tiefe2') + '<small>' + esc(TIEFE_B[e.tiefe || '']) + ' Ihr Kunde kann es bei jeder Frage ändern.</small></div>' +
    '<div class="f"><label for="ein-std">Ihr Standard in einem Satz, freiwillig</label><textarea id="ein-std" rows="3" maxlength="' + E.MAX.standard + '" data-ein-feld="standard" placeholder="z. B. Kunststoffprofile mit 3-fach-Glas, Griffe in Weiß, RAL-Montage, alte Fenster entsorgen wir.">' + esc(e.standard || '') + '</textarea><small>Steht auf Ihrer Einladungsseite unter „Wie genau ' + (du ? 'du planst' : 'Sie planen') + '“.</small></div></section>';
  const vor = '<div class="ein-vor-spalte" id="ein-vorschau"><p class="eyebrow">So sieht Ihr Kunde die Seite</p>' + einTelefon(einVorschauHTML(du)) +
    '<p class="km-s">Beispielkunde „Familie Weber“, Anrede ' + (du ? 'Du' : 'Sie') + '. ' + (online ? 'Änderungen gelten sofort für alle Ihre Links, auch für schon verschickte.' : 'Pilotphase: Ein Link trägt den Stand von dem Moment, in dem Sie ihn verschicken; schon verschickte Links bleiben, wie sie waren.') + '</p></div>';
  return { title: 'Einladungsseite', html: '<div class="wrap ein-bereich-wrap"><div class="h">' + kicker('Mein Betrieb') + '<h2>' + akSatz('Ihre Einladungsseite.') + '</h2><p>' + (INST ? 'Das sieht Ihr Kunde als Erstes, wenn er Ihren Einladungslink öffnet. Ihr Name, Ihr Logo, Ihre Worte.' : 'Das sieht Ihr Kunde als Erstes, wenn er Ihren Aufmaß-Link öffnet. Ihr Name, Ihr Logo, Ihre Worte; eeziframes steht nur klein darunter, als Übermittler.') + ' <button type="button" class="linkbtn only-s" data-ein="zur-vorschau">Zur Vorschau</button></p></div>' +
    '<div class="ein-bereich"><div class="col-stack">' + karteLogo + karteGruss + karteAp + karteTiefe + '</div>' + vor + '</div></div>' };
};
PARENT.einladung = 'bprofil';

/* ---------- Signature-Dashboard: Bildschirme und Hilfen im Instanz-Modus (Strang E) ----------
   Anmelden, Projekte, Betrieb und „beendet“ für Betriebe mit eigenem Fensterplaner (INST). Statusnamen Angelegt, Eingeladen, In
   Bearbeitung, Eingereicht; keine Abrechnung, keine Preise, keine Tour, keine eeziframes-Texte. Was der Status der Instanz erlaubt,
   schickt der Server in acc.instanz.darf (aus Instanzregeln.darf); die Knöpfe richten sich danach, der Server prüft es trotzdem. */
const VOLL = new Map(), LAEDT = new Set();
const IA = () => A().instanz || {};
const instDarf = () => IA().darf || { lesen: true, schreiben: null, einladen: false, export: true };
/* Darf dieses Feld eines Projekts gerade geschrieben werden? (pausiert: nur Klärungsliste, Stand, Notiz zum Stand, gesehen) */
function darfFeld(f) { if (!INST) return true; const s = instDarf().schreiben; return s === null || s === undefined || (Array.isArray(s) && s.indexOf(f) >= 0); }
const instEinladen = () => !INST || !!instDarf().einladen;
/* „vor 2 Std.“ für den Fortschritt einer Planung */
function vorZeit(t) {
  const ms = Date.now() - Date.parse(t || ''); if (!(ms >= 0)) return '';
  const m = Math.round(ms / 60000); if (m < 2) return 'gerade eben'; if (m < 60) return 'vor ' + m + ' Min.';
  const h = Math.round(m / 60); if (h < 24) return 'vor ' + h + ' Std.';
  return 'vor ' + nW(Math.round(h / 24), 'Tag', 'Tagen');
}
/* Anmeldung im Instanz-Modus: eigener Bildschirm statt Blatt; sonst das Blatt wie bisher */
function anmeldeBlatt() { return INST ? (S.anm || (S.anm = { schritt: 'mail' })) : S.sheet; }
/* Eingereichte Projekte, die lange unverändert sind, kommen in der Liste nur als Kopf; das Aufmaß hier nachladen */
function nachladen(id) {
  if (LAEDT.has(id)) return; LAEDT.add(id);
  Server.api('/api/konto/projekte/' + encodeURIComponent(id)).then((r) => {
    if (!r || !r.link) return;
    VOLL.set(id, r.link);
    const l = (A().links || []).find((x) => x.id === id); if (l) Object.assign(l, { aufmass: r.link.aufmass, vorher: r.link.vorher, nachladen: false });
    refresh();
  }).catch((e) => toast(e.message)).then(() => LAEDT.delete(id));
}
function instBanner() {
  const i = IA(), host = esc(i.host || INST.host || '');
  if (i.status === 'pausiert') return '<div class="banner warn b-status"><span><b>Ihr Fensterplaner ist pausiert.</b> Das Formular auf ' + host + ' ist offline' + (i.pauseBis && Date.parse(i.pauseBis) ? ', voraussichtlich bis ' + esc(datumDE(Date.parse(i.pauseBis))) : '') + '. Ansehen, PDF, Fotos und Export gehen weiter. Vertrag und Zahlung regeln Sie im Kundenkonto.</span>' + (i.kundenkonto ? '<a class="btn small ghost" href="' + esc(i.kundenkonto) + '" target="_blank" rel="noopener">Zum Kundenkonto</a>' : '') + '</div>';
  if (i.status === 'einrichtung') return '<div class="banner b-status"><span><b>Ihr Fensterplaner ist noch in Vorbereitung.</b> Sie können sich schon umsehen und Ihre Einladungsseite gestalten; Kunden einladen können Sie ab dem Livegang.</span></div>';
  return '';
}
const INST_FILTER = ['alle', 'eingeladen', 'bearbeitung', 'eingegangen', 'website'];
function linksInst() {
  const a = A(), L = a.links || [], i = IA(), host = i.host || INST.host || '';
  const ein = L.filter((l) => l.status === 'erstellt' || l.status === 'gesendet'), arb = L.filter((l) => l.status === 'geoeffnet' || l.status === 'arbeit'), rec = L.filter((l) => l.status === 'eingegangen'), web = L.filter((l) => l.via === 'Website');
  const web30 = web.filter((l) => l.status === 'eingegangen' && Date.now() - (Number(l.eingegangenAt) || 0) < 30 * 864e5).length;
  const f = INST_FILTER.includes(S.lfilt) ? S.lfilt : S.lfilt === 'neu' ? 'eingeladen' : 'alle';
  const shown = { alle: L, eingeladen: ein, bearbeitung: arb, eingegangen: rec, website: web }[f];
  const ws = a.website || {}, live = ws.laufend ? '<p class="km-s b-live">' + icon('spark', 15) + '<span>' + (ws.laufend === 1 ? 'Gerade plant 1 Besucher' : 'Gerade planen ' + ws.laufend + ' Besucher') + ' auf ' + esc(host) + (ws.fenster ? ', zusammen ' + nW(ws.fenster, 'Fenster', 'Fenster') : '') + '. Sie sehen die Anfrage, sobald sie gesendet ist.</span></p>' : '';
  const neuK = instEinladen() ? '<button type="button" class="btn primary big l-neu-knopf" data-act="go" data-v="newlink">' + icon('plus', 20) + 'Kunden einladen<span class="pf" aria-hidden="true"></span></button>' : '';
  const kopf = kicker(esc(BC().name)), website = '<a class="btn ghost big" href="' + esc(i.basis || APP_URL) + '" target="_blank" rel="noopener">Website öffnen ' + icon('ext', 15) + '</a>';
  if (!L.length) return { html: '<div class="wrap narrow">' + instBanner() + '<div class="h">' + kopf + '<h2>' + akSatz('Noch keine Anfragen.') + '</h2><p>Sobald jemand auf ' + esc(host) + ' plant und sendet, steht es hier. Bestehende Kunden laden Sie mit einem persönlichen Link ein.</p></div>' + live +
    '<div class="row">' + neuK + (instEinladen() ? '<button type="button" class="btn ghost big" data-act="sheet" data-v="liste">Mehrere Kunden einladen</button>' : '') + website + '</div></div>' };
  const filter = [['alle', 'Alle', L.length], ['eingeladen', 'Eingeladen', ein.length], ['bearbeitung', 'In Bearbeitung', arb.length], ['eingegangen', 'Eingereicht', rec.length], ['website', 'Über Website', web.length]];
  const leer = f === 'eingegangen' ? empty('Noch nichts eingereicht.', 'Sobald ein Kunde seine Planung sendet, steht sie hier.') : f === 'website' ? empty('Noch keine Anfrage über Ihre Website.', 'Anfragen von ' + esc(host) + ' stehen hier, sobald jemand sendet.') : f === 'eingeladen' ? empty('Keine offenen Einladungen.', 'Eingeladene Kunden, die noch nicht angefangen haben, stehen hier.') : empty('Gerade plant niemand.', 'Kunden, die ihre Planung angefangen haben, stehen hier.');
  return { html: '<div class="wrap">' + instBanner() + '<div class="h hrow"><div>' + kopf + '<h2>' + akSatz('Ihre Projekte.') + '</h2><p>Einladungen und Anfragen über Ihre Website.</p></div>' + neuK + '</div>' +
    '<div class="grid c3 stats">' + stat('warn', 'send', 'In Bearbeitung', arb.length, arb.length ? 'Kunden planen gerade' : 'gerade plant niemand') + stat('ok', 'inbox', 'Eingereicht', rec.length, rec.length ? 'mit Aufmaß, Fotos und Klärungsliste' : 'noch nichts eingereicht') + stat('acc', 'spark', 'Über Ihre Website', web30, 'in den letzten 30 Tagen') + '</div>' + live +
    '<div class="l-leiste"><div class="chips scrollchips lfilter" role="group" aria-label="Projekte filtern">' + filter.map((o) => '<button type="button" class="chip" data-act="lfilt" data-v="' + o[0] + '" aria-pressed="' + (f === o[0]) + '">' + esc(o[1]) + '<span class="n">' + o[2] + '</span></button>').join('') + '</div>' +
    (instEinladen() ? '<div class="l-neben"><button type="button" class="btn small ghost" data-act="sheet" data-v="liste">' + icon('people', 18) + 'Liste einladen</button></div>' : '') + '</div>' +
    '<div class="list plist">' + (shown.length ? shown.slice().sort((x, y) => LRANG(x) - LRANG(y)).map(projCard).join('') : leer) + '</div></div>' };
}
function bprofilInst() {
  const c = BC(), a = A(), p = a.prefs || {}, ab = a.abzug || (a.abzug = { seite: 15, oben: 15 }), i = IA(), dis = darfFeld('profil') ? '' : ' disabled';
  const eing = i.eingang || [], team = i.zugang || [];
  const zahl = (id, f, label, klein) => '<div class="f"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="number" inputmode="numeric" min="0" max="60" value="' + (ab[f] || 0) + '" data-in="ab:' + f + '"' + dis + '><small>' + klein + '</small></div>';
  return { html: '<div class="wrap">' + instBanner() + '<div class="h">' + kicker(esc(c.name)) + '<h2>' + akSatz('Ihr Betrieb.') + '</h2><p>Ihre Einladungsseite, Ihr Kontakt, das Bestellmaß und wer Zugang zu diesem Dashboard hat.</p></div><div class="grid c2">' + einKarte() +
    '<div class="card"><p class="eyebrow">Kontakt</p><div class="form" style="margin-top: 10px"><div class="f"><label for="b-ap">Ansprechpartner</label><input id="b-ap" data-in="b:ap" value="' + esc(a.ap || '') + '"' + dis + '><small>Unterschreibt die Nachricht an Ihre Kunden.</small></div><div class="f2"><div class="f"><label for="b-mail">E-Mail</label><input id="b-mail" data-in="b:mail" value="' + esc(a.mail || '') + '" type="email"' + dis + '></div><div class="f"><label for="b-tel">Telefon</label><input id="b-tel" data-in="b:tel" value="' + esc(a.tel || '') + '" type="tel"' + dis + '></div></div></div></div></div>' +
    '<div class="grid c2"><div class="card"><p class="eyebrow">Bestellmaß-Vorschlag</p><p class="sub" style="margin-top: 6px">Ihr Abzug von der Maueröffnung. Damit rechnet Ihr Dashboard in jeder Anfrage ein Bestellmaß vor; verbindlich bleibt Ihr Feinaufmaß.</p><div class="f2" style="margin-top: 10px">' +
    zahl('ab-seite', 'seite', 'Je Seite', 'mm, links und rechts') + zahl('ab-oben', 'oben', 'Oben', 'mm') + zahl('ab-unten', 'unten', 'Unten, Fenster', 'mm, Fensterbankanschluss') + zahl('ab-untenT', 'untenT', 'Unten, Türen', 'mm, an der Schwelle') + '</div><p class="km-s" id="ab-ex" style="margin-top: 8px">' + abEx(ab) + '</p></div>' +
    '<div class="card"><p class="eyebrow">Neue Anfragen gehen an</p>' + (eing.length ? '<ul class="b-liste">' + eing.map((m) => '<li><span class="sel">' + esc(m) + '</span></li>').join('') + '</ul>' : '<p class="sub">Noch keine bestätigte Adresse.</p>') +
    '<p class="km-s">Jede Anfrage kommt sofort per E-Mail mit dem Aufmaßblatt als PDF. Die Adressen ändern Sie im Kundenkonto' + (i.kundenkonto ? ' (<a class="ulink" href="' + esc(i.kundenkonto) + '" target="_blank" rel="noopener">öffnen</a>)' : '') + '.</p>' +
    sw('Erinnerung an offene Einladungen', 'einmal, wenn ein Kunde 3 Tage nach dem Verschicken noch nicht plant', p.remind !== false, 'bpref', 'remind') + '</div></div>' +
    '<section class="sec"><div class="sec-head"><h3>' + akSatz('Ihr Team.') + '</h3></div><div class="card"><div class="kv">' + team.map((z) => '<span>' + (z.rolle === 'inhaber' ? 'Inhaber' : 'Team') + '</span><span>' + esc([z.name, z.mail].filter(Boolean).join(' · ')) + (z.ich ? ' · <b>Sie</b>' : '') + '</span>').join('') + '</div><p class="km-s">Alle Zugänge sehen und bearbeiten dasselbe. Neue Zugänge richtet Ihr Einrichtungsservice ein; schreiben Sie dazu über das Kundenkonto.</p></div></section>' +
    '<section class="sec"><div class="sec-head"><h3>' + akSatz('Ihre Daten.') + '</h3></div><div class="card"><p class="sub">Alle Projekte mit Aufmaß, Ihr Profil und die Zugänge in einer Datei (JSON), etwa für Ihre Unterlagen oder eine Auskunft nach der DSGVO.</p><div class="row"><button type="button" class="btn ghost" data-act="export">' + icon('dl', 18) + 'Alle Daten exportieren</button></div></div></section>' +
    '<div class="row"><button type="button" class="btn ghost" data-act="logout">Abmelden</button></div></div>' };
}
SCREENS.anmelden = () => {
  if (!INST) return SCREENS.landing();
  if (!Server.fertig) return { title: '', html: '<div class="wrap narrow"><p class="km-s b-laden">Wird geladen …</p></div>' };
  const s = anmeldeBlatt(), schritt = s.schritt || 'mail';
  const feld = schritt === 'mail'
    ? '<div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-mail">E-Mail</label><input id="lg-mail" type="email" data-in="lg:mail" value="' + esc(s.mail || '') + '" autocomplete="email" inputmode="email">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Kein Passwort: Sie bekommen einen Code per E-Mail.</small>') + '</div>'
    : '<div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-code">Code aus der E-Mail</label><input id="lg-code" data-in="lg:code" value="' + esc(s.code || '') + '" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="123456">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Geschickt an ' + esc(s.mail) + ', falls die Adresse Zugang hat. Nichts angekommen? Auch im Spam-Ordner nachsehen.</small>') + '</div>';
  return { title: 'Anmelden', html: '<div class="wrap narrow b-anmelden"><div class="card b-anm-karte">' + window.Einladung.kopf({ name: INST.name, p: { logoUrl: INST.logo || '', col: INST.farbe || '' }, klein: true, oben: 'Dashboard von' }) +
    '<h2>' + akSatz('Anmelden.', 0) + '</h2><p class="sub">Nur für das Team von ' + esc(INST.name) + '. Sie bekommen einen Code per E-Mail.</p>' + (S.anmHinweis ? '<div class="note warn" role="alert">' + esc(S.anmHinweis) + '</div>' : '') +
    '<form class="form" data-form="srvlogin" novalidate>' + feld + '<div class="row between">' + (schritt === 'code' ? '<button type="button" class="linkbtn" data-act="srv-mail">Andere E-Mail</button>' : '<span></span>') + '<button type="submit" class="btn primary">' + (schritt === 'mail' ? 'Code schicken' : 'Anmelden') + '<span class="pf" aria-hidden="true"></span></button></div></form></div></div>' };
};
SCREENS.beendet = () => ({ title: 'Beendet', html: '<div class="wrap narrow"><div class="card b-anm-karte">' + (INST ? window.Einladung.kopf({ name: INST.name, p: { logoUrl: INST.logo || '', col: INST.farbe || '' }, klein: true, oben: 'Dashboard von' }) : '') + '<h2>' + akSatz('Ihr Fensterplaner ist beendet.') + '</h2><p class="sub">Die Seite für Ihre Kunden ist offline. Bis zur Löschung können Sie Ihre Daten hier noch als Datei herunterladen.</p><div class="row"><button type="button" class="btn primary" data-act="export">' + icon('dl', 18) + 'Alle Daten exportieren<span class="pf" aria-hidden="true"></span></button><button type="button" class="btn ghost" data-act="logout">Abmelden</button></div></div></div>' });
/* Datei speichern wie das Aufmaßblatt (Downloads der Umgebung, sonst Link mit download) */
async function dateiSpeichern(name, blob, ok) {
  if (!PDL) await PDLP;
  if (PDL) { try { await PDL.save({ filename: name, data: blob }); toast(ok); } catch (e) { if (!(e && e.code === 'declined')) toast('Speichern hat nicht geklappt'); } return; }
  try { const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast(ok); } catch (e) { toast('Speichern geht hier nicht.'); }
}
async function instExport() {
  if (!INST) return;
  try {
    const r = await fetch('/api/konto/export', { headers: { accept: 'application/json' }, cache: 'no-store' });
    if (!r.ok) { const j = await r.json().catch(() => null); if (r.status === 401) Server.instFehler(401, j, '/api/konto/export'); return toast((j && j.fehler) || 'Der Export geht gerade nicht. Bitte gleich noch einmal.'); }
    const name = (/filename="([^"]+)"/.exec(r.headers.get('content-disposition') || '') || [])[1] || 'dashboard-export.json';
    await dateiSpeichern(name, await r.blob(), 'Export gespeichert');
  } catch (e) { toast('Der Export geht gerade nicht. Bitte gleich noch einmal.'); }
}
function instLoeschen(id) {
  const s = S.sheet; if (!INST || !s || s.k !== 'p-loeschen') return;
  const inp = document.getElementById('pl-nr'), nr = String((inp ? inp.value : s.nr) || '').trim();
  if (!nr) { s.err = 'Bitte die Projektnummer eingeben.'; return render(); }
  return Server.tu(async () => {
    let r; try { r = await Server.api('/api/konto/projekte/' + encodeURIComponent(id || s.id) + '/loeschen', { bestaetigung: nr }); } catch (e) { s.nr = nr; s.err = e.message; return render(); }
    VOLL.delete(id || s.id); Server.uebernehmen(r.konto); S.sheet = null; S.hist = []; nav('links'); toast(r.msg || 'Gelöscht');
  });
}
/* Im Projekt unter der Nachricht: welche Anrede der Kunde sieht und wo die Seite gestaltet wird */
const einAnredeZeile = (l) => '<p class="km-s ein-anrede"><span>Anrede in Nachricht und Einladungsseite: ' + (l.du ? 'Du' : 'Sie') + '. Die Messschritte der App duzen immer.</span><button type="button" class="linkbtn" data-act="go" data-v="einladung">Einladungsseite gestalten</button></p>';
function einFeld(el, ev) {
  const k = el.getAttribute('data-ein-feld'), e = EIN_UI.entwurf = Object.assign({}, einEntwurf());
  if (k === 'gruss') { e[einDu() ? 'begruessungDu' : 'begruessung'] = el.value; const z = document.getElementById('ein-zahl'); if (z) z.textContent = el.value.length + ' / ' + window.Einladung.MAX.gruss; }
  else e[k] = el.value;
  const box = el.closest('.f'); if (box) box.classList.remove('has-err');
  einVorschauNeu();
  if (ev.type === 'change' && !einSpeichern() && box) box.classList.add('has-err');
}
function einAktion(k, el) {
  const v = el.getAttribute('data-v'), a = A(), E = window.Einladung;
  if (window.Haptik && el.matches('.seg > button, .switch, .sw-row, .col')) window.Haptik.tick();
  if (k === 'zur-vorschau') { const z = document.getElementById('ein-vorschau'); if (z) z.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); return; }
  if (k === 'du') { EIN_UI.du = v === 'du'; return render(); }
  if (k === 'anrede') { EIN_UI.du = v === 'du'; einSpeichern({ anrede: v }); return render(); }
  if (k === 'grund') { einSpeichern({ logoGrund: v }); return render(); }
  if (k === 'tiefe') { einSpeichern({ tiefe: v }); return render(); }
  if (k === 'schalter') { const t = {}; t[v] = !einEntwurf()[v]; einSpeichern(t); return render(); }
  if (k === 'vorlage') { const t = {}; t[einDu() ? 'begruessungDu' : 'begruessung'] = ''; einSpeichern(t); return render(); }
  if (k === 'foto-weg') { einSpeichern({ foto: '' }); return render(); }
  if (k === 'logo-weg') { a.logo = ''; einServer({ logo: '' }); save(); toast('Logo entfernt'); return render(); }
  if (k === 'farbe') { if (!E.FARBEN.includes(v)) return; BC().col = v; einServer({ col: v }); save(); toast('Gespeichert'); return render(); }
  if (k === 'kunde') {
    const ta = document.getElementById('ein-gruss'); if (!ta) return;
    const s = ta.selectionStart != null ? ta.selectionStart : ta.value.length, en = ta.selectionEnd != null ? ta.selectionEnd : s;
    ta.value = (ta.value.slice(0, s) + '{Kunde}' + ta.value.slice(en)).slice(0, E.MAX.gruss); ta.focus(); ta.selectionStart = ta.selectionEnd = Math.min(ta.value.length, s + 7);
    einFeld(ta, { type: 'input' });
  }
}
async function einDatei(el) {
  const art = el.getAttribute('data-ein-datei'), datei = el.files && el.files[0], E = window.Einladung;
  if (!datei || EIN_UI.laeuft) return;
  EIN_UI.laeuft = art; render();
  try {
    const r = await E.verkleinern(datei, art);
    if (art === 'logo') { const a = A(); a.logo = r.url; a.einladung = E.einstellungen(Object.assign({}, einEntwurf(), { logoGrund: r.grund })); EIN_UI.entwurf = null; einServer({ logo: r.url, einladung: a.einladung }); save(); toast('Logo übernommen'); }
    else if (einSpeichern({ foto: r.url }, true)) toast('Foto übernommen');
  } catch (e) { toast(e.message || 'Das hat nicht geklappt.'); }
  EIN_UI.laeuft = ''; render();
}
(function () {
  const wurzel = document.getElementById('app');
  wurzel.addEventListener('click', (e) => { const el = e.target.closest ? e.target.closest('[data-ein]') : null; if (!el || el.disabled) return; e.preventDefault(); einAktion(el.getAttribute('data-ein'), el); });
  const feld = (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-ein-feld')) einFeld(el, e); };
  wurzel.addEventListener('input', feld);
  wurzel.addEventListener('change', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-ein-datei')) return einDatei(el); feld(e); });
})();

/* ---------- Tour für Fensterbauer: der Ablauf in acht Schritten ----------
   Ersetzt Demo-Konten und Beispiel-Registrierungen. Jeder Schritt zeigt die echten Bausteine (Projekt, Nachricht,
   Kundenansicht, Positionen, Bestellmaß, PDF, Nachbesserung, Code), ohne Konto; gespeichert wird nichts.
   Vorgegebenes trägt ein Schloss, Antippen erklärt. Je Schritt ein Fakt mit Quelle (Belege: docs/GESTALTUNG.md, Tour). */
const TOUR = ['projekt', 'link', 'misst', 'eingang', 'bestell', 'nachbes', 'code', 'start'];
const TOUR_NAME = { projekt: 'Projekt anlegen', link: 'Link schicken', misst: 'Kunde misst', eingang: 'Aufmaß kommt an', bestell: 'Bestellmaß und PDF', nachbes: 'Nachbesserung', code: 'Aufmaß per Code', start: 'Preise und Start' };
const TOUR_BETRIEB = { name: 'Fensterbau Brandt', ap: 'Jens Brandt', col: '#0071e3' };
const LOCK_S = '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>';
const tourSchloss = () => toast('In der Tour vorgegeben. In Ihrem Konto tragen Sie alles selbst ein.');
function tourFakt(id) {
  const p = P(), F = {
    projekt: { z: '97.482', t: 'offene Stellen im Handwerk ließen sich 2025 rechnerisch nicht mit passend Qualifizierten besetzen, fast jede zweite.', mit: 'Ihr Kunde misst selbst, Ihre Leute fahren erst zum Feinaufmaß.', q: 'KOFA/IW Köln, KOFA Kompakt 7/2026' },
    link: { z: '68 %', t: 'der Handwerksbetriebe verschicken Angebote schon digital, 35 % beraten auch online.', mit: 'Der Aufmaß-Link passt in diesen Ablauf: per WhatsApp verschickt, beim Kunden gemessen, zurück in Ihrem Projekt.', q: 'Bitkom, Studie Digitalisierung des Handwerks, 01/2026' },
    misst: { z: '§ 632 BGB', t: 'Ein Kostenanschlag ist im Zweifel nicht zu vergüten. Ohne Absprache trägt der Betrieb den Aufwand dafür.', mit: 'Der Kunde misst selbst, die Anfahrt fürs erste Angebot entfällt.', q: 'Bürgerliches Gesetzbuch, § 632 Abs. 3' },
    eingang: { z: '65,14 €', t: 'netto kostet eine Meisterstunde im Handwerk im Schnitt.', mit: 'Im Tarif Start kostet ein Projekt mit eingegangenem Aufmaß ' + p.projekt + ' € netto, die ersten ' + p.frei + ' sind kostenlos.', q: 'OneQrew/Taifun, Preisatlas Handwerk 2024' },
    bestell: { z: '87 %', t: 'der Handwerksbetriebe sagen: Kunden erwarten individuelle Angebote.', mit: 'Je Position alle Maße, Fotos und Wünsche: Sie kalkulieren individuell, ohne Termin vor Ort.', q: 'Bitkom, Studie Digitalisierung des Handwerks, 01/2026' },
    nachbes: { z: '76 %', t: 'der Handwerksbetriebe nennen Zeitersparnis als Vorteil digitaler Anwendungen.', mit: 'Fehlt ein Maß, fragen Sie nach. Ihr Kunde ändert nur das Nötige, das kostet nichts extra.', q: 'Bitkom, Studie Digitalisierung des Handwerks, 01/2026' },
    code: { z: '49 %', t: 'der Deutschen finden, Handwerksbetriebe arbeiten oft noch zu analog.', mit: 'Bringt ein Kunde sein eeziframes-Aufmaß mit, holen Sie es per Code in Ihr Konto, als Projekt wie jedes andere.', q: 'Bitkom, Presseinformation vom 14.03.2025' },
    start: { z: '9,9 Wochen', t: 'reichen die Aufträge im Ausbauhandwerk im Schnitt, bei 78 % Auslastung der Betriebe.', mit: 'Termine sind knapp: Das erste Angebot rechnen Sie ohne Anfahrt, vor Ort fahren Sie zum Feinaufmaß.', q: 'ZDH-Konjunkturbericht 1/2026' }
  }, f = F[id];
  return f ? '<aside class="tour-fakt" aria-label="Gut zu wissen"><p class="eyebrow">Gut zu wissen</p><p class="tf-satz"><b>' + esc(f.z) + '</b> ' + esc(f.t).replace(/ %/g, '&nbsp;%') + '</p><p class="tf-mit"><span>Mit eeziframes:</span> ' + esc(f.mit).replace(/ %/g, '&nbsp;%') + '</p><p class="tf-q">Quelle: ' + esc(f.q) + '</p></aside>' : '';
}
/* Die Nachricht an den Kunden, wie sie das Projekt vorformuliert (Sie oder Du, erste Runde oder Nachbesserung) */
function tourMsg(du, nb) {
  const g = '\n\nViele Grüße\n' + TOUR_BETRIEB.ap + ', ' + TOUR_BETRIEB.name;
  if (nb) return (du ? 'Hallo Familie Weber, danke für euer Aufmaß! Eine Kleinigkeit müssten wir noch einmal prüfen. Konkret: Beim Küchenfenster fehlt die Brüstungshöhe. Über diesen Link könnt ihr es ändern und erneut abschicken, eure bisherigen Angaben bleiben erhalten:\n' : 'Guten Tag Familie Weber, danke für Ihr Aufmaß! Eine Kleinigkeit müssten wir noch einmal prüfen. Konkret: Beim Küchenfenster fehlt die Brüstungshöhe. Über diesen Link können Sie es ändern und erneut abschicken, Ihre bisherigen Angaben bleiben erhalten:\n') + '§LINK§' + g;
  return (du ? 'Hallo Familie Weber, für euer Fensterangebot brauche ich die Maße eurer Fenster. Mit diesem Link messt ihr sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto braucht ihr nicht:\n' : 'Guten Tag Familie Weber, für Ihr Fensterangebot brauchen wir die Maße Ihrer Fenster. Mit diesem Link messen Sie sie selbst, Schritt für Schritt erklärt, etwa fünf Minuten pro Fenster. Ein Konto brauchen Sie nicht:\n') + '§LINK§' + g;
}
const tourBub = (text) => esc(text).replace(/\n/g, '<br>').replace('§LINK§', '<span class="lp"><b>eeziframes · Aufmaß für ' + esc(TOUR_BETRIEB.name) + '</b><small>Ohne Konto, etwa 5 Minuten pro Fenster</small></span>');
const tourPhone = (kopf, unter, inhalt, cls, av) => '<div class="phone small' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><div class="ph-top"><span class="ph-av' + (av ? ' kunde' : '') + '">' + (av || 'B') + '</span><span><b>' + esc(kopf) + '</b><small>' + esc(unter) + '</small></span></div><div class="ph-body">' + inhalt + '</div></div>';
const tourFest = (label, wert, mono) => '<div class="tf-feld gesperrt' + (mono ? ' mono' : '') + '" role="group" aria-label="' + esc(label + ': ' + wert) + ', in der Tour vorgegeben"><small>' + esc(label) + '</small><span>' + esc(wert) + '</span><span class="schloss" aria-hidden="true">' + LOCK_S + '</span></div>';
const tourGesperrt = (label) => '<button type="button" class="chip gesperrt" data-act="tour-schloss" aria-disabled="true">' + esc(label) + '<span class="schloss" aria-hidden="true">' + LOCK_S + '</span></button>';
/* Das Fenster, das der Kunde misst: die vier Maße erscheinen nacheinander */
function tourMessBild(k) {
  const d = (i, pfad, farbe, lx, ly, wert) => (i < k ? '<path d="' + pfad + '" fill="none" style="stroke: ' + farbe + '" stroke-width="2.5" stroke-linecap="round"></path><rect x="' + (lx - 27) + '" y="' + (ly - 11) + '" width="54" height="22" rx="11" style="fill: ' + farbe + '"></rect><text x="' + lx + '" y="' + (ly + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">' + wert + '</text>' : '');
  return '<svg class="tour-mess" viewBox="0 0 320 300" aria-hidden="true"><rect x="40" y="20" width="240" height="250" rx="2" fill="#e9e3da"></rect><rect x="60" y="34" width="200" height="222" rx="3" fill="#fbfbfa" stroke="#1d1d1f" stroke-width="2"></rect><rect x="72" y="46" width="84" height="198" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1.2"></rect><rect x="164" y="46" width="84" height="198" fill="#d9e8f7" stroke="#1d1d1f" stroke-width="1.2"></rect><path d="M72 46 L156 145 L72 244 M72 244 L114 46 L156 244" fill="none" stroke="#1d1d1f" stroke-width=".8" opacity=".5"></path><rect x="150" y="133" width="5" height="24" rx="2" fill="#c9c3ba"></rect><rect x="165" y="133" width="5" height="24" rx="2" fill="#c9c3ba"></rect>' +
    d(0, 'M24 20 V270 M18 20 H30 M18 270 H30', 'var(--mo)', 24, 145, '1.480') + d(1, 'M296 34 V256 M290 34 H302 M290 256 H302', 'var(--el)', 296, 145, '1.410') +
    d(2, 'M40 8 H280 M40 2 V14 M280 2 V14', 'var(--mo)', 160, 9, '1.370') + d(3, 'M60 286 H260 M60 280 V292 M260 280 V292', 'var(--el)', 160, 286, '1.230') + '</svg>';
}
function tourStart() {
  S.tour = { i: 0, von: S.screen === 'tour' ? home() : S.screen, du: false, kanal: 'WhatsApp', tage: 14, abzug: 15, lauf: 0, nb: false, code: false };
  go('tour');
}
function tourEnde() { const t = S.tour; clearTimeout(tourTimer); S.tour = null; nav(t && t.von && t.von !== 'tour' ? t.von : home()); }
let tourTimer = 0;
function tourGehe(i) {
  const t = S.tour; if (!t) return tourStart();
  clearTimeout(tourTimer);
  if (i < 0) return tourEnde();
  t.i = Math.max(0, Math.min(TOUR.length - 1, i));
  if (TOUR[t.i] === 'misst') t.lauf = t.lauf >= 6 || matchMedia('(prefers-reduced-motion: reduce)').matches ? 6 : 0;
  S.animNext = true; render(); window.scrollTo(0, 0);
  if (TOUR[t.i] === 'misst' && t.lauf < 6) tourLauf();
}
/* Kunde misst: Link geöffnet, dann vier Maße, dann eingegangen; der Verlauf läuft mit wie im echten Projekt */
function tourLauf() {
  const t = S.tour; if (!t) return;
  const schritt = () => {
    if (S.tour !== t || TOUR[t.i] !== 'misst' || S.screen !== 'tour') return;
    t.lauf++; render();
    if (t.lauf < 6) tourTimer = setTimeout(schritt, t.lauf === 1 ? 900 : 700);
  };
  tourTimer = setTimeout(schritt, 700);
}
/* Das Beispiel-Aufmaß der Tour als Eingabe für Blatt.pdf: dieselben Daten für das Beispiel-PDF zum Herunterladen und für den
   Ausschnitt in der Tour (web/bilder/tour-aufmassblatt-*.webp, erzeugt von scripts/tour-bild.mjs über window.TourBeispiel) */
const tourBlatt = (abzug, host, beispiel) => ({ variante: 'betrieb', beispiel: beispiel !== false, fenster: demoWins('weber'), projekt: projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' }), kunde: { name: 'Familie Weber', kontakt: '0171 234 56 78', adresse: 'Lindenstraße 14, 50823 Köln' }, betrieb: { name: TOUR_BETRIEB.name, col: TOUR_BETRIEB.col, abzug: { seite: abzug, oben: abzug }, nr: 'P-BEISPIEL', eingegangen: 'heute' }, klaerung: AW.klaerung(demoWins('weber'), projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' }), { plan: ['Fenster', 'Rollläden'] }), portalKurz: host || location.host, h: BLATT_H });
window.TourBeispiel = { blatt: tourBlatt, abzuege: [10, 15, 20] };
/* Karte „Das Aufmaßblatt als PDF“: ein echter Ausschnitt von Seite 1 des Beispiel-PDFs zum gewählten Abzug (Bestellmaß ändert sich
   mit), darunter der Weg zum ganzen Beispiel. Bilder und Maße aus scripts/tour-bild.mjs. */
const TOUR_BILD = { breite: 920, hoehe: 872 };
const tourBildSrc = (abzug) => '/bilder/tour-aufmassblatt-' + abzug + '.webp';
function tourBlattKarte(abzug) {
  const w0 = demoWins('weber')[0], d0 = AW.derive(w0), bm = AW.th(d0.moW - 2 * abzug) + ' × ' + AW.th(d0.moH - abzug) + ' mm';
  return '<div class="card tour-pdfkarte"><figure class="tpk-blatt"><img src="' + tourBildSrc(abzug) + '" width="' + TOUR_BILD.breite + '" height="' + TOUR_BILD.hoehe + '" decoding="async" alt="Ausschnitt aus Seite 1 des Aufmaßblatts: Kopf mit dem Namen von ' + esc(TOUR_BETRIEB.name) + ', Kunde Familie Weber mit Eckdaten, Übersicht aller Positionen, Position 1 ' + esc(w0.name) + ' mit Bestellmaß-Vorschlag ' + bm + '"></figure>' +
    '<div class="tpk-tx"><b>Das Aufmaßblatt als PDF</b><p class="km-s">So sieht Seite 1 aus: mit Ihrem Namen und Logo, allen Positionen mit Bestellmaß nach Ihrem Abzug und der Klärungsliste. Danach je Position eine Seite mit Zeichnung, Wünschen und Fotoauswertung. Zum Ausdrucken, Weiterleiten, Abheften.</p><button type="button" class="btn small ghost" data-act="tour-pdf">' + icon('dl', 16) + 'Ganzes Beispiel-PDF ansehen</button></div></div>';
}
/* Die anderen Abzüge schon laden, damit der Wechsel ohne Lücke geht */
let tourBilderGeladen = false;
function tourBilderVorladen() { if (tourBilderGeladen) return; tourBilderGeladen = true; window.TourBeispiel.abzuege.forEach((a) => { const i = new Image(); i.decoding = 'async'; i.src = tourBildSrc(a); }); }
async function tourPDF() {
  const t = S.tour; if (!t) return;
  if (!window.Blatt) return toast('Die PDF lädt noch, gleich noch einmal.');
  await window.Blatt.schrift();
  const pdf = window.Blatt.pdf(tourBlatt(t.abzug));
  if (!pdf) return toast('Die PDF lässt sich hier gerade nicht erzeugen.');
  const name = 'eeziframes-Beispiel-Aufmass-Betrieb.pdf';
  if (!PDL) await PDLP;
  if (PDL) { try { await PDL.save({ filename: name, data: pdf }); toast('PDF gespeichert'); } catch (e) { if (!(e && e.code === 'declined')) toast('Speichern hat nicht geklappt'); } return; }
  if (window.claude) return toast('Speichern geht in dieser Ansicht nicht.');
  try { const url = URL.createObjectURL(pdf), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Download gestartet'); } catch (e) { toast('Speichern geht hier nicht.'); }
}
SCREENS.tour = () => {
  const t = S.tour || (S.tour = { i: 0, von: home(), du: false, kanal: 'WhatsApp', tage: 14, abzug: 15, lauf: 0, nb: false, code: false });
  const id = TOUR[t.i], n = TOUR.length, p = P(), letzte = t.i === n - 1;
  let titel = '', lead = '', merk = [], v = '';
  if (id === 'projekt') {
    titel = 'Projekt anlegen.'; lead = 'Für einen Kunden, den Sie schon haben: Name, Kontakt und ein paar Eckdaten. In einer Minute erledigt.';
    merk = ['Viele Kunden auf einmal: eine Liste einfügen, je Zeile ein Projekt.', 'Anrede Sie oder Du, die Nachricht passt sich an.', 'Bezahlt wird erst, wenn ein Aufmaß eingeht.'];
    v = '<div class="form-mini tour-formular"><p class="eyebrow">Neues Projekt</p>' + tourFest('Kunde', 'Familie Weber') + tourFest('Handynummer oder E-Mail', '0171 234 56 78') + tourFest('Objektadresse', 'Lindenstraße 14, 50823 Köln') +
      '<div class="tf-zeile"><small>Anrede in der Nachricht</small>' + seg([['sie', 'Sie'], ['du', 'Du']], t.du ? 'du' : 'sie', 'tour-du') + '</div>' +
      '<div class="tf-zeile"><small>Gebäude</small><div class="chips"><button type="button" class="chip" data-act="none" aria-pressed="true">Einfamilienhaus</button>' + tourGesperrt('Reihenhaus') + tourGesperrt('Wohnung') + '</div></div>' +
      '<button type="button" class="btn soft tour-attrappe" data-act="tour-weiter">' + icon('link', 18) + 'Projekt anlegen</button></div>';
  } else if (id === 'link') {
    titel = 'Link schicken.'; lead = 'Per WhatsApp, SMS oder E-Mail, mit Ihrem Namen als Absender. Die Nachricht ist vorformuliert, Sie können sie anpassen.';
    merk = ['Kundenschutz: Ihr Kunde sieht im Link nur Ihren Betrieb, keine anderen Anbieter, keine Werbung.', 'Der Link gilt für ein Aufmaß: öffnen innerhalb von ' + t.tage + ' Tagen, ab dann 60 Tage Zeit.', 'Im Projekt sehen Sie, ob er geöffnet wurde.'];
    v = tourPhone(TOUR_BETRIEB.name, t.kanal, '<div class="bub out show">' + tourBub(tourMsg(t.du)) + '<i>09:13 ✓✓</i></div>') +
      '<div class="tour-regler"><div class="tf-zeile"><small>Verschicken per</small>' + seg([['WhatsApp', 'WhatsApp'], ['SMS', 'SMS'], ['E-Mail', 'E-Mail']], t.kanal, 'tour-kanal') + '</div><div class="tf-zeile"><small>Link gilt</small>' + seg([['7', '7 Tage'], ['14', '14 Tage'], ['30', '30 Tage']], String(t.tage), 'tour-tage') + '</div></div>';
  } else if (id === 'misst') {
    const L = t.lauf || 0, st = L >= 6 ? 'eingegangen' : L >= 2 ? 'arbeit' : L >= 1 ? 'geoeffnet' : 'gesendet', k = Math.min(4, Math.max(0, L - 1)), idx = LORDER.indexOf(st);
    titel = 'Ihr Kunde misst.'; lead = 'Im Browser, ohne Konto und ohne App aus dem Store. Zwei Fotos und vier Maße je Fenster, jeder Schritt erklärt.';
    merk = ['Sie sehen, ob der Link geöffnet wurde und wie weit Ihr Kunde ist.', 'Ein 3-D-Modell zeigt ihm jedes Maß, bevor er es eintippt.', 'Fachbegriffe sind mit Bild erklärt, von DIN links bis U-Wert.', 'Kein anderer Betrieb kann Ihren Kunden über eeziframes erreichen oder sein Aufmaß übernehmen.'];
    v = tourPhone(TOUR_BETRIEB.name, 'Persönliche Anfrage, im Browser', '<div class="tour-kunde">' + tourMessBild(k) + '<span class="tk-stand"><span class="mprog' + (L >= 6 ? ' fertig' : '') + '"><span style="width: ' + (L >= 6 ? 100 : k / 4 * 100) + '%"></span></span><small>' + (L >= 6 ? 'Abgeschickt' : L >= 2 ? k + ' von 4 Maßen' : L >= 1 ? 'Link geöffnet' : 'Link verschickt') + '</small></span></div>', 'app-ansicht') +
      '<div class="card tlcard tour-verlauf"><ol class="tlh">' + LORDER.map((s, i) => '<li class="' + (i < idx || st === 'eingegangen' ? 'done' : i === idx ? 'now' : '') + '"><span class="dot"></span><small>' + TLS[s] + '</small></li>').join('') + '</ol><p class="km-s tl-now"><b>' + TL[st] + (st === 'arbeit' ? ' · ' + k + ' von 4 Maßen' : '') + '</b></p></div>' +
      (L >= 6 ? '<div class="ph-note tour-note"><span class="ph-dot"></span><span><b>Aufmaß eingegangen</b><small>Familie Weber · 4 Positionen, 8 Fotos</small></span></div><button type="button" class="btn small ghost tour-nochmal" data-act="tour-lauf">' + icon('play', 15) + 'Nochmal abspielen</button>' : '');
  } else if (id === 'eingang') {
    titel = 'Das Aufmaß kommt an.'; lead = 'Ganz oben, was Sie mit dem Kunden klären. Darunter die Positionen, so wie Sie sie vom Termin kennen, zum Aufklappen.';
    merk = ['Ganz oben, was Sie mit dem Kunden klären: Pflichtthemen, offene Wünsche, Hinweise aus den Fotos, zum Abhaken.', 'Je Position eine Zeichnung mit allen Maßen, Bestellmaß nach Ihrem Abzug.', 'Die Wünsche in einem Satz und in Gruppen, Notizen des Kunden an ihrer Stelle.'];
    v = '<div class="card sample tour-eingang"><div class="sample-h"><span class="badge ok">' + icon('check', 12) + 'Aufmaß eingegangen</span><b>Familie Weber · Lindenstraße 14, Köln</b><span class="km-s">4 Positionen · 5 Elemente · 8 Fotos · Einfamilienhaus, Baujahr 1978</span></div>' + (() => { const ws = demoWins('weber'), pr = projOf({ total: 11, foerd: true, notiz: 'Der Rollladen im Bad klemmt, bitte mit anschauen.' }), kl = AW.klaerung(ws, pr, { plan: ['Fenster', 'Rollläden'] }); return klaerKarte(null, kl, { nurLesen: true, max: 4 }) + ws.slice(0, 2).map((w, i) => posCard(w, i, { seite: t.abzug, oben: t.abzug }, i === 0, pr, null, kl)).join(''); })() + '<p class="km-s">und 2 weitere Positionen</p></div>';
  } else if (id === 'bestell') {
    const x = demoWins('weber')[1], d = AW.derive(x), a = t.abzug;
    tourBilderVorladen();
    titel = 'Bestellmaß und PDF.'; lead = 'Aus der Maueröffnung rechnet eeziframes ein Bestellmaß nach Ihrem Abzug vor. Das Aufmaßblatt gibt es als PDF mit Ihrem Namen und Logo.';
    merk = ['Ihr Abzug gilt für jedes eingegangene Aufmaß.', 'PDF mit Zeichnung je Position, Bestellmaß und Fotoauswertung.', 'Verbindlich bleibt Ihr Feinaufmaß vor Ort.'];
    v = '<div class="card tour-bestell"><p class="eyebrow">Bestellmaß-Vorschlag · Pos. 2 · ' + esc(x.name) + '</p><div class="tbm"><span><small>Maueröffnung</small><b>' + AW.th(d.moW) + ' × ' + AW.th(d.moH) + ' mm</b></span><span class="tbm-pfeil" aria-hidden="true">→</span><span><small>Bestellmaß</small><b>' + AW.th(d.moW - 2 * a) + ' × ' + AW.th(d.moH - a) + ' mm</b></span></div>' +
      '<div class="tf-zeile"><small>Ihr Abzug in mm, je Seite und oben</small>' + seg([['10', '10'], ['15', '15'], ['20', '20']], String(a), 'tour-abzug', 'fit').replace(/<\/div>$/, '<button type="button" class="gesperrt" data-act="tour-schloss" aria-disabled="true">Eigener<span class="schloss" aria-hidden="true">' + LOCK_S + '</span></button></div>') + '</div></div>' +
      tourBlattKarte(a);
  } else if (id === 'nachbes') {
    titel = 'Nachbesserung anfragen.'; lead = 'Fehlt ein Maß oder passt etwas nicht? Ihr Kunde bekommt den Link noch einmal, sieht seine Angaben und ändert nur das Nötige.';
    merk = ['Kostenlos, bis zu ' + X.NB_MAX + ' Runden je Projekt.', 'Das neue Aufmaß ersetzt das alte im selben Projekt.', 'Sie schreiben dazu, was zu prüfen ist.'];
    v = '<div class="card tour-nb"><p class="eyebrow">Nachbesserung anfragen</p>' + tourFest('Was soll der Kunde prüfen?', 'Beim Küchenfenster fehlt die Brüstungshöhe.') + (t.nb ? '<span class="badge warn">Nachbesserung angefragt · kostenlos</span>' : '<button type="button" class="btn soft" data-act="tour-nb">' + icon('swap', 16) + 'Link erneut öffnen</button>') + '</div>' +
      (t.nb ? tourPhone(TOUR_BETRIEB.name, 'WhatsApp', '<div class="bub out show">' + tourBub(tourMsg(t.du, true)) + '<i>17:40 ✓✓</i></div><div class="bub in show">' + (t.du ? 'Stimmt, machen wir heute Abend.' : 'Stimmt, das reichen wir heute Abend nach.') + '<i>17:52</i></div>') : '');
  } else if (id === 'code') {
    titel = 'Kunden mit eigenem Aufmaß.'; lead = 'Hauseigentümer messen auch ohne Ihren Link mit eeziframes und schicken Ihnen ihr Aufmaßblatt. Mit dem Code darin liegt es als Projekt bei Ihnen.';
    merk = ['Gehört der Code zu einem Ihrer Projekte, landet das Aufmaß dort.', 'Sonst entsteht ein neues Projekt mit allen Positionen.', 'Es zählt wie ein eigenes Projekt.'];
    v = '<div class="card tour-code"><p class="eyebrow">Code vom Kunden einfügen</p>' + tourFest('Aufmaß-Code von der letzten Seite des Aufmaßblatts', 'AM1.eyJ2IjoxLCJiIjoiIiwicCI6eyJnZWJhZXVkZSI6ImVmaCIsInRvdGFsIjo5…', true) +
      (t.code ? '<div class="tour-ergebnis">' + icon('check', 20) + '<span><b>Projekt angelegt: Familie Muster</b><small>2 Positionen · Aufmaß eingegangen · zählt wie ein eigenes Projekt</small></span></div>' : '<button type="button" class="btn soft" data-act="tour-code">Übernehmen</button>') + '</div>' +
      '<div class="card tour-blattinfo"><p class="eyebrow">So steht es im Aufmaßblatt</p><ol class="tbi"><li><b>Seite 1</b><span>Die Box „Für Sie als Fensterbauer“ mit Kontakt und dem Weg zum Code</span></li><li><b>Seite 2</b><span>Unten: eeziframes für Ihre eigenen Kunden, mit QR-Code</span></li><li><b>Letzte Seite</b><span>Der Aufmaß-Code und der QR-Code zur Anmeldung</span></li></ol></div>';
  } else {
    titel = 'Bereit für Ihr erstes Projekt?'; lead = 'Kostenlos registrieren, Projekt anlegen, Link schicken. Die ersten ' + p.frei + ' Projekte sind frei, eine Zahlungsart brauchen Sie erst danach.';
    merk = ['Bezahlt wird nur ein eingegangenes Aufmaß, nie ein verschickter Link.', 'Ihr Kunde zahlt nichts und braucht kein Konto.', 'Nur für Unternehmer (§ 14 BGB). Monatlich kündbar, alle Preise netto' + (p.mwst ? ' zzgl. MwSt.' : '.')];
    v = '<div class="tour-preise">' + [['Start', '0 €', 'Grundgebühr', p.frei + ' Projekte kostenlos, danach ' + p.projekt + ' € je Projekt mit eingegangenem Aufmaß'], ['Abo 10', p.abo.grund + ' €', 'im Monat', p.abo.inkl + ' Projekte inklusive, jedes weitere ' + p.abo.extra + ' €'], ['Plus', p.plus + ' €', 'im Monat', 'Projekte unbegrenzt, Team mit Rollen und Statistik']].map((c, k) => '<div class="tpr' + (k === 0 ? ' hi' : '') + '"><p class="eyebrow">' + c[0] + '</p><b>' + c[1] + '<small> ' + c[2] + '</small></b><span>' + esc(c[3]) + '</span></div>').join('') + '</div>' +
      '<p class="km-s">Zum Vergleich: Eine Meisterstunde kostet im Schnitt 65,14 € netto (Preisatlas Handwerk 2024).</p>';
  }
  const kopf = '<div class="tour-kopf"><div class="tk-t">' + kicker('Tour für Fensterbauer') + '<h2>' + akSatz('So läuft ein Aufmaß mit eeziframes.', 3) + '</h2></div><button type="button" class="btn small ghost" data-act="tour-ende">Tour beenden</button></div>' +
    '<ol class="tour-schritte" aria-label="Schritte der Tour">' + TOUR.map((s, k) => '<li><button type="button" data-act="tour-geh" data-v="' + k + '"' + (k === t.i ? ' aria-current="step"' : '') + ' class="' + (k < t.i ? 'fertig' : '') + '"><span class="n">' + (k < t.i ? icon('check', 14) : k + 1) + '</span><span class="tx">' + TOUR_NAME[s] + '</span></button></li>').join('') + '</ol>';
  const navi = '<div class="tour-nav">' + (t.i ? '<button type="button" class="btn ghost" data-act="tour-zurueck">Zurück</button>' : '<button type="button" class="btn ghost" data-act="tour-ende">Beenden</button>') +
    (letzte ? (S.role ? '<button type="button" class="btn primary" data-act="tour-ende">Zu meinen Projekten<span class="pf" aria-hidden="true"></span></button>' : '<button type="button" class="btn primary" data-act="reg" data-v="betrieb">Kostenlos starten<span class="pf" aria-hidden="true"></span></button>') : '<button type="button" class="btn primary" data-act="tour-weiter"><span class="hide-s">Weiter: ' + TOUR_NAME[TOUR[t.i + 1]] + '</span><span class="only-xs">Weiter</span><span class="pf" aria-hidden="true"></span></button>') + '</div>';
  const html = '<div class="wrap tourw">' + kopf + '<div class="tour-raster"><div class="tour-oben">' + kicker('Schritt ' + (t.i + 1) + ' von ' + n) + '<h3>' + akSatz(titel) + '</h3><p class="lead">' + lead + '</p></div>' +
    '<div class="tour-buehne">' + v + '</div><div class="tour-unten"><ul class="tour-merk">' + merk.map((m) => '<li>' + icon('check', 16) + '<span>' + esc(m) + '</span></li>').join('') + '</ul>' + tourFakt(id) + (letzte ? '<button type="button" class="linkbtn" data-act="go" data-v="preise">Alle Preise im Detail ›</button>' : '') + '</div></div>' + navi + '</div>';
  return { title: 'Tour für Fensterbauer', html: html };
};
/* ---------- Blätter ---------- */
/* Stand der Nutzungsbedingungen: vom Server (/api/status, functions/api/recht.js), ohne Server diese Fassung; der Server nimmt die
   Registrierung nur mit genau diesem Stand an und speichert ihn am Konto */
const nbStand = () => (Server.status && Server.status.recht && Server.status.recht.nb) || '2026-10-17';
function nbStandDE() { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nbStand()); return m ? Number(m[3]) + '. ' + ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m[2]) - 1] + ' ' + m[1] : nbStand(); }
const LEGAL = { impressum: ['Impressum', 'Anbieter und Kontakt nach § 5 DDG.', '/impressum/'], datenschutz: ['Datenschutz', 'Welche Daten eeziframes verarbeitet, wofür, mit welchen Dienstleistern und welche Rechte Sie haben.', '/datenschutz/'], agb: ['Nutzungsbedingungen für Fensterbauer', 'Kurz: Die ersten 3 Projekte mit eingegangenem Aufmaß sind kostenlos, danach gelten die Preise unter „Preise“ (netto, Abos monatlich kündbar). Aufmaße Ihrer Kunden nutzen Sie nur für deren Projekt. Kundenschutz (§ 11): Aufmaße aus Ihren Links gehen an keinen anderen Betrieb, Ihr Kunde sieht im Link nur Sie, und wir sprechen ihn nicht an. Für die Daten Ihrer Kunden gilt der Vertrag über die Auftragsverarbeitung in der Anlage.', '/nutzungsbedingungen/'] };
function loginServer(s) {
  const schritt = s.schritt || 'mail', reg = s.zweck === 'reg';
  const feld = schritt === 'mail'
    ? '<div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-mail">E-Mail</label><input id="lg-mail" type="email" data-in="lg:mail" value="' + esc(s.mail || '') + '" autocomplete="email" inputmode="email">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Kein Passwort: Sie bekommen einen Code per E-Mail.</small>') + '</div>'
    : '<div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-code">Code aus der E-Mail</label><input id="lg-code" data-in="lg:code" value="' + esc(s.code || '') + '" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="123456">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Geschickt an ' + esc(s.mail) + '. Steht in der E-Mail ein Link statt eines Codes, klicken Sie einfach darauf. Nichts angekommen? Auch im Spam-Ordner nachsehen.</small>') + '</div>';
  return '<h3>' + (reg ? akSatz('Konto für Ihren Betrieb.') : akSatz('Anmelden für Fensterbauer.')) + '</h3><p class="sub" style="margin: -4px 0 12px">' + (reg ? 'Zuerst Ihre E-Mail bestätigen, dann Ihren Betrieb eintragen. Die ersten ' + P().frei + ' Projekte sind kostenlos.' : 'Ein Kunde hat Ihnen ein eeziframes-Aufmaß geschickt? Mit dem Code von der Übersichtsseite holen Sie es nach der Anmeldung in Ihr Konto.') + '</p>' +
    '<form class="form" data-form="srvlogin" novalidate>' + feld + '<div class="row between">' + (schritt === 'code' ? '<button type="button" class="linkbtn" data-act="srv-mail">Andere E-Mail</button>' : '<span></span>') + '<button type="submit" class="btn primary">' + (schritt === 'mail' ? 'E-Mail schicken' : (reg ? 'Weiter' : 'Anmelden')) + '</button></div></form>' +
    /* Adresse eines Dashboard-Zugangs (Konfigurator-Instanz) ohne Konto hier: der Weg zum eigenen Dashboard (Server: 409 umzug) */
    (s.umzug && /^https?:\/\/[^/]+\/betrieb\/$/.test(s.umzug) ? '<p class="note"><a class="ulink" href="' + esc(s.umzug) + '">Zu Ihrem Dashboard: ' + esc(s.umzug.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</a></p>' : '') +
    '<p class="sub center" style="margin-top: 14px">Erst einmal ansehen? <button type="button" class="ulink" data-act="tour">Tour für Fensterbauer</button></p>';
}
const SHEETS = {
  /* Foto groß (Strang S5): Zoom mit zwei Fingern, Doppeltipp, Mausrad und Knöpfen, Verschieben, „Nächstes Foto“ (fotoZoom) */
  foto: (s) => '<h3>' + esc(s.titel) + '</h3>' + (s.pos ? '<p class="km-s fz-pos">' + esc(s.pos) + '</p>' : '') + '<div class="foto-gross fz" data-key="' + esc(s.key) + '"><img alt="' + esc(s.titel + (s.pos ? ', ' + s.pos : '')) + '" data-foto="' + esc(s.key) + '" draggable="false"></div>' +
    '<div class="row between fz-leiste"><div class="fz-zoom" role="group" aria-label="Zoom"><button type="button" class="btn small ghost" data-act="foto-zoom" data-v="-1" aria-label="Verkleinern">−</button><span class="fz-wert" aria-live="polite">100 %</span><button type="button" class="btn small ghost" data-act="foto-zoom" data-v="1" aria-label="Vergrößern">+</button></div>' + (s.liste && s.liste.length > 1 ? '<button type="button" class="btn small soft" data-act="foto-naechst">Nächstes Foto ' + ((s.liste.findIndex((x) => x.key === s.key) + 1) || 1) + ' von ' + s.liste.length + '</button>' : '') + '</div>' +
    '<p class="km-s">Aufgenommen vom Kunden. Zoomen mit zwei Fingern, Doppeltipp oder Mausrad. Die Fotos bleiben 12 Monate nach dem Eingang beim Aufmaß.</p>',
  linkfrage: (s) => '<h3>' + akSatz('Mit diesem Konto anmelden?') + '</h3><p class="sub">Der Link meldet Sie als <b style="overflow-wrap: anywhere">' + esc(s.r.mail) + '</b> an. Angefordert wurde er nicht in diesem Browser. Melden Sie sich nur an, wenn das Ihre E-Mail-Adresse ist.</p>' + (Server.sitzung && Server.sitzung.mail && Server.sitzung.mail !== s.r.mail ? '<p class="sub">Gerade sind Sie als <b style="overflow-wrap: anywhere">' + esc(Server.sitzung.mail) + '</b> angemeldet und werden dort abgemeldet.</p>' : '') + '<div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Nicht anmelden</button><button type="button" class="btn primary" data-act="srv-link-ja">Anmelden</button></div>',
  login: (s) => (Server.an ? loginServer(s) : '<h3>' + akSatz('Anmelden für Fensterbauer.') + '</h3><p class="sub" style="margin: -4px 0 12px">Ein Kunde hat Ihnen ein eeziframes-Aufmaß geschickt? <button type="button" class="ulink" data-act="reg" data-v="betrieb">Kostenlos registrieren</button>, dann „Code vom Kunden einfügen“. Die ersten 3 Projekte sind frei.</p><form class="form" data-form="login" novalidate><div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-mail">E-Mail</label><input id="lg-mail" type="email" data-in="lg:mail" value="' + esc(s.mail || '') + '" autocomplete="email"></div><div class="f' + (s.err ? ' has-err' : '') + '"><label for="lg-pw">Passwort</label><input id="lg-pw" type="password" data-in="lg:pw" value="" autocomplete="current-password">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Pilotphase: Ihr Konto liegt nur in diesem Browser.</small>') + '</div><div class="row between"><button type="button" class="linkbtn" data-act="toast" data-v="In der Pilotphase liegt Ihr Konto nur in diesem Browser; ein Zurücksetzen per E-Mail kommt mit dem Start.">Passwort vergessen?</button><button type="submit" class="btn primary">Anmelden</button></div></form>' +
    '<p class="sub center">Erst einmal ansehen? <button type="button" class="ulink" data-act="tour">Tour für Fensterbauer</button></p><p class="sub center">Noch kein Konto? <button type="button" class="ulink" data-act="reg" data-v="betrieb">Kostenlos registrieren</button> · Hauseigentümer? <a class="ulink" href="' + APP_OPEN + '">Zur App, ohne Konto</a></p>'),
  linkimport: () => '<h3>' + akSatz('Code vom Kunden einfügen.', 0) + '</h3><p class="sub">Ihr Kunde schickt nach dem Absenden einen Aufmaß-Code, zum Beispiel als Antwort in WhatsApp; bei einem eeziframes-Aufmaßblatt steht er auf der letzten Seite. Fügen Sie ihn hier ein: Gehört er zu einem Ihrer Projekte, landet das Aufmaß dort, sonst entsteht ein neues Projekt.</p><div class="f"><textarea id="code-in" rows="4" placeholder="AM1.…"></textarea></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="linkimport">Übernehmen</button></div>',
  liste: (s) => '<h3>' + akSatz('Mehrere Kunden einladen.') + '</h3><p class="sub">Eine Zeile je Kunde: Name, dann Handynummer oder E-Mail, durch Komma oder Semikolon getrennt. Für jeden entsteht ein Projekt mit eigenem Aufmaß-Link; verschickt wird aus dem Projekt, die Nachricht ist vorformuliert.' + (INST ? '' : ' Kosten entstehen erst, wenn ein Aufmaß eingeht.') + '</p><div class="f"><textarea id="liste-in" rows="6" data-in="liste" placeholder="Familie Weber, 0171 2345678\nHerr Kaya, kaya@beispiel.de\nFrau Schulze">' + esc(s.text || '') + '</textarea><small>Ohne Kontakt geht es auch, dann kopieren Sie den Link später aus dem Projekt.</small></div><div class="f"><label>Anrede in der Nachricht</label>' + seg([['sie', 'Sie'], ['du', 'Du']], s.du ? 'du' : 'sie', 'liste-du') + '</div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="liste-create">' + icon('people', 18) + 'Projekte anlegen</button></div>',
  nachbesserung: (s) => { const l = A().links.find((x) => x.id === s.id) || {}, punkte = l.aufmass ? amKlaer(l).filter((r) => klaerFragbar(r) && !klaerOk(l, r.id)).slice(0, 10) : [], gew = s.chips || []; return '<h3>' + akSatz('Nachbesserung anfragen.', 0) + '</h3><p class="sub">' + esc(l.kunde || 'Der Kunde') + ' bekommt den Link noch einmal, sieht alle bisherigen Angaben und kann sie ändern. Das neue Aufmaß ersetzt das alte im selben Projekt' + (INST ? '' : ', <b>berechnet wird nichts</b>') + '. Höchstens ' + NB_MAX + ' Runden je Projekt, bis ' + NB_TAGE + ' Tage nach dem Eingang.' + (INST ? '' : ' Hat das neue Aufmaß keine Position mit dem alten gemeinsam, ist es ein anderes Aufmaß und wird wie ein neues gebucht.') + '</p>' + (punkte.length ? '<div class="f nb-punkte"><label>Offene Punkte aus der Klärungsliste</label><div class="chips">' + punkte.map((r) => '<button type="button" class="chip" data-act="nb-chip" data-v="' + esc(r.id) + '" aria-pressed="' + (gew.indexOf(r.id) >= 0) + '">' + esc(nbChipText(r)) + '</button>').join('') + '</div><small>Antippen übernimmt den Punkt in den Hinweis; danach können Sie ihn anpassen.</small></div>' : '') + '<div class="f"><label for="nb-hinweis">Was soll der Kunde prüfen?</label><textarea id="nb-hinweis" rows="3" data-in="nb-hinweis" placeholder="z. B. Beim Küchenfenster fehlt die Brüstungshöhe, und die Breite unten scheint vertauscht.">' + esc(s.hinweis || '') + '</textarea><small>Steht so in der Nachricht an den Kunden.</small></div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn primary" data-act="nb-send" data-id="' + s.id + '">Link erneut öffnen</button></div>'; },
  pay: (s) => paySheet(s),
  /* Instanz: Anfrage endgültig löschen (Spam, Löschwunsch des Kunden), Bestätigung mit der Projektnummer */
  'p-loeschen': (s) => { const l = A().links.find((x) => x.id === s.id) || {}; return '<h3>' + akSatz('Anfrage löschen?', 0) + '</h3><p class="sub">Löscht ' + esc(l.kunde || 'das Projekt') + (l.nr ? ' (' + esc(l.nr) + ')' : '') + ' endgültig: Aufmaß, Fotos, Zwischenstand und die Nachrichten dazu. Etwa bei Spam oder wenn Ihr Kunde die Löschung verlangt. Das lässt sich nicht rückgängig machen.</p><div class="f' + (s.err ? ' has-err' : '') + '"><label for="pl-nr">Zur Bestätigung die Projektnummer</label><input id="pl-nr" data-in="ploeschen" value="' + esc(s.nr || '') + '" placeholder="' + esc(l.nr || '') + '" autocomplete="off">' + (s.err ? '<small class="err">' + esc(s.err) + '</small>' : '<small>Steht oben im Projekt, z. B. ' + esc(l.nr || 'P-2026-001') + '.</small>') + '</div><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn danger" data-act="p-loeschen" data-id="' + esc(s.id || '') + '">Endgültig löschen</button></div>'; },
  deact: (s) => '<h3>' + akSatz('Link deaktivieren?') + '</h3><p class="sub">Ihr Kunde kann über diesen Link dann kein Aufmaß mehr schicken.' + (INST ? '' : ' Das kostet nichts.') + ' Einen neuen Link können Sie jederzeit erstellen.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Abbrechen</button><button type="button" class="btn danger" data-act="l-deact" data-id="' + s.id + '">Deaktivieren</button></div>',
  legal: (s) => { const L = LEGAL[s.id] || LEGAL.agb, pilot = L === LEGAL.agb && !Server.an ? 'eeziframes ist in der Pilotphase: Solange kein Server angeschlossen ist, wird nichts berechnet, alle Preise sind eine Vorschau. ' : ''; return '<h3>' + akSatz(mitPunkt(L[0])) + '</h3><p class="sub">' + esc(pilot + L[1]) + '</p><div class="row">' + (L[2] ? '<a class="btn primary" href="' + L[2] + '" target="_blank" rel="noopener">Seite öffnen</a><button type="button" class="btn ghost" data-act="sheet-close">Schließen</button>' : '<button type="button" class="btn primary" data-act="sheet-close">Schließen</button>') + '</div>'; }
};

const unpack = X.unpack, fingerprint = X.fingerprint, fromApp = X.fromApp, fromAppProj = X.fromAppProj;
const nextNr = (a) => X.nextNr(a || A());
/* ---------- Aufmaßblatt als PDF für den Betrieb ---------- */
let PDL = null;
const PDLP = (async () => { try { PDL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { PDL = null; } return PDL; })();
/* Die PDF zeichnet /assets/blatt.js (gemeinsam mit der App): Ausgabe 'betrieb' mit Namen und Logo des Betriebs, Bestellmaß-Vorschlag und Stand der Klärungsliste */
const BLATT_H = { derive: AW.derive, lab: AW.lab, num: AW.num, th: AW.th, col: AW.col, orn: (k) => AW.lab('orn', k), opening: AW.opening, sonne: AW.sonne, innen: AW.innen, farbe: AW.farbe, farbeZeile: AW.farbZeile, griffFarbe: AW.griffName };
/* Strang S5: dieselbe Klärungsliste wie auf dem Bildschirm (mit Stand), Logo des Betriebs im Kopf (pdfLogo, sonst die Initiale) */
function amPDF(l, fotos, logo) {
  if (!window.Blatt || !l.aufmass) return null;
  const am = l.aufmass, c = BC(), a = A();
  return window.Blatt.pdf({ variante: 'betrieb', kennzeichnung: INST ? (IA().m || {}).pdfKennzeichnung || 'keine' : undefined, fenster: am.windows || [], projekt: am.proj || {}, kunde: { name: l.kunde, kontakt: l.kontakt, adresse: l.adresse, mehr: kundeKontakt(l) }, betrieb: { name: c.name, col: c.col, logo: logo || null, abzug: AW.abzugVon(a.abzug), nr: l.nr, eingegangen: (l.log || {}).eingegangen }, klaerung: amKlaer(l), klaerStand: l.klaer || {}, portalKurz: location.host, h: BLATT_H, fotos: fotos || {} });
}
/* Logo aus dem Betriebskonto (Data-URL, auch WebP oder aus SVG gerechnet) fürs PDF als PNG, längste Kante höchstens 600 px */
async function pdfLogo() {
  const a = A(); let url = a && a.logo;
  /* Instanz: das Logo der Marke (/marke/<v>/logo.png derselben Domain) */
  if (INST) { if (!INST.logo) return null; try { const r = await fetch(INST.logo); if (!r.ok) return null; url = URL.createObjectURL(await r.blob()); } catch (e) { return null; } }
  else if (!url || !/^data:image\//.test(url)) return null;
  try {
    const im = await new Promise((fertig, fehler) => { const i = new Image(); i.onload = () => fertig(i); i.onerror = fehler; i.src = url; });
    const f = Math.min(1, 600 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * f)), h = Math.max(1, Math.round(im.naturalHeight * f));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(im, 0, 0, w, h);
    return { data: cv.toDataURL('image/png'), w: w, h: h, grund: (a.einladung && a.einladung.logoGrund) === 'dunkel' ? 'dunkel' : 'hell' };
  } catch (e) { return null; } finally { if (INST && url) URL.revokeObjectURL(url); }
}
/* Fürs PDF verkleinert: längste Kante höchstens 960 px, JPEG 0,8. Das Blatt zeigt die Fotos etwa 56 mm hoch; so bleibt die Datei
   auch mit vielen Fenstern klein genug für E-Mail und Messenger (das volle Foto gibt es im Betriebsbereich) */
async function pdfFoto(blob) {
  let u = ''; try { u = URL.createObjectURL(blob); } catch (e) { return null; }
  try {
    const im = await new Promise((fertig, fehler) => { const i = new Image(); i.onload = () => fertig(i); i.onerror = fehler; i.src = u; });
    const f = Math.min(1, 960 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * f)), h = Math.max(1, Math.round(im.naturalHeight * f));
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
    const data = c.toDataURL('image/jpeg', 0.8);
    return /^data:image\/jpeg/.test(data) ? { data: data, w: w, h: h } : null;
  } catch (e) { return null; } finally { URL.revokeObjectURL(u); }
}
/* Fürs Aufmaßblatt: die angekommenen Fotos als Data-URL (Kennung → { data, w, h }) */
async function amFotos(l) {
  const out = {};
  if (!Server.online() || !l || !l.aufmass || l.fotosGeloescht || l.locked) return out;
  const da = Array.isArray(l.aufmass.fotosDa) ? new Set(l.aufmass.fotosDa) : null;
  for (const w of l.aufmass.windows || []) for (const s2 of ['in', 'out']) {
    const id = w.bilder && w.bilder[s2]; if (!FOTO_ID.test(String(id || '')) || out[id] || (da && !da.has(id))) continue;
    const f = await fotoLaden(l.code + '/' + id); if (!f) continue;
    const p = await pdfFoto(f.blob); if (p) out[id] = p;
  }
  return out;
}
async function saveAm(l) {
  if (!l || !l.aufmass) return;
  if (window.Blatt) await window.Blatt.schrift();
  const pdf = amPDF(l, await amFotos(l), await pdfLogo()), base = 'Aufmass-' + [l.nr, slug(l.kunde.replace(/^Beispiel:\s*/, ''))].filter(Boolean).join('-').replace(/[^A-Za-z0-9_-]+/g, '-');
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
/* Ein Aufmaß kommt an: speichern, buchen oder sperren, melden */
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
function dupNote(d) { const n = sameCompany(d); return n ? '<div class="note warn">Für <b>' + esc(n) + '</b> gibt es schon ein eeziframes-Konto. Ein weiteres geht, die 3 kostenlosen Aufmaße gibt es aber nur einmal je Betrieb. <button type="button" class="ulink" data-act="sheet" data-v="login">Lieber anmelden</button></div>' : ''; }
function payBanner() {
  if (INST || S.role !== 'betrieb') return '';
  const a = A(), w = lockedLinks(a).length;
  if (w) return '<div class="banner warn"><span><b>' + nW(w, 'Aufmaß wartet', 'Aufmaße warten') + ' auf Freischaltung.</b> Mit einer Zahlungsart sehen Sie ' + (w === 1 ? 'es' : 'sie') + ' sofort.</span><button type="button" class="btn small ghost" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button></div>';
  if (!a.pay && X.konto(a) === 'service' && freeLeft(a) === 0) return '<div class="banner"><span><b>Keine kostenlosen Projekte mehr.</b> Mit einer Zahlungsart ist das nächste Aufmaß sofort sichtbar.</span><button type="button" class="btn small ghost" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button></div>';
  return '';
}
function lockCard(l, a) {
  const am = l.aufmass || {}, n = (am.windows || []).length;
  return '<section class="sec"><div class="sec-head"><h3>' + akSatz('Das Aufmaß.') + '</h3><span class="sub">' + nW(n, 'Position', 'Positionen') + ' · ' + nW(am.fotos || 0, 'Foto', 'Fotos') + '</span></div><div class="card lockcard"><span class="lk-ic">' + icon('lock', 26) + '</span><div><p class="eyebrow">Eingegangen · gesperrt</p><h3>Zum Ansehen eine Zahlungsart hinterlegen.</h3><p>' + (a.dupOf ? 'Die kostenlosen Aufmaße für Ihren Betrieb wurden schon über das Konto ' + esc(a.dupOf) + ' genutzt.' : 'Ihre ' + freeQuota(a) + ' kostenlosen Aufmaße sind verbraucht.') + ' Dieses Aufmaß kostet ' + eur(P().projekt) + ' netto und kommt auf die nächste Sammelrechnung. Im Abo 10 sind ' + P().abo.inkl + ' Projekte im Monat inklusive, mit Plus alle.</p><div class="row"><button type="button" class="btn primary" data-act="sheet" data-v="pay">Zahlungsart hinterlegen</button><button type="button" class="btn ghost" data-act="konto" data-v="abo">Abo 10, ' + eur(P().abo.grund) + ' im Monat</button></div></div></div></section>';
}
function paySheet(s) {
  const e = s.err || {}, t = s.type || 'sepa', w = lockedLinks(A()).length;
  const fe = (f) => (e[f] ? '<small class="err">' + esc(e[f]) + '</small>' : '');
  const inp = (label, f, ph, auto) => '<div class="f' + (e[f] ? ' has-err' : '') + '"><label for="pay-' + f + '">' + label + '</label><input id="pay-' + f + '" data-in="pay:' + f + '" value="' + esc(s[f] || '') + '" placeholder="' + esc(ph) + '" autocomplete="' + auto + '">' + fe(f) + '</div>';
  const why = s.then && s.then !== 'service' ? 'Für ' + X.planName(s.then) + ' brauchen wir eine Zahlungsart. Gebucht wird ab heute für den laufenden Monat.' : w ? nW(w, 'Aufmaß wartet', 'Aufmaße warten') + ' auf Freischaltung und ' + (w === 1 ? 'ist' : 'sind') + ' danach sofort sichtbar.' : 'Nötig ab dem ersten kostenpflichtigen Aufmaß. Bis dahin wird nichts abgebucht.';
  if (Server.online()) return '<h3>' + akSatz('Zahlungsart hinterlegen.', 0) + '</h3><p class="sub">' + why + ' Sie hinterlegen SEPA-Lastschrift oder Karte auf der sicheren Seite unseres Zahlungsdienstleisters Stripe; eeziframes sieht keine Kontodaten. Abgebucht wird alle zwei Wochen als Sammelrechnung, Abos monatlich.</p>' + (Server.status && Server.status.testmodus ? '<p class="sub"><b>Testbetrieb:</b> Stripe läuft im Testmodus, es wird nichts abgebucht. Zum Ausprobieren die Test-IBAN DE89 3704 0044 0532 0130 00 oder die Testkarte 4242 4242 4242 4242.</p>' : '') + '<div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Später</button><button type="button" class="btn primary" data-act="srv-zahlungsart">Weiter zu Stripe ' + icon('ext', 15) + '</button></div>';
  return '<h3>' + akSatz('Zahlungsart hinterlegen.', 0) + '</h3><p class="sub">' + why + ' Abgebucht wird alle zwei Wochen als Sammelrechnung, nur für eingegangene Aufmaße.</p>' + seg([['sepa', 'SEPA-Lastschrift'], ['karte', 'Kreditkarte']], t, 'pay-type') +
    '<form class="form" data-form="pay" novalidate style="margin-top: 12px">' + (t === 'sepa' ? inp('Kontoinhaber', 'inhaber', 'wie auf dem Kontoauszug', 'name') + inp('IBAN', 'iban', 'DE00 0000 0000 0000 0000 00', 'off') +
      '<label class="agree' + (e.mandat ? ' has-err' : '') + '"><input type="checkbox" data-in="pay:mandat"' + (s.mandat ? ' checked' : '') + '><span>Ich erteile eeziframes ein SEPA-Firmenlastschrift-Mandat für dieses Geschäftskonto.</span></label>' + fe('mandat')
      : inp('Karteninhaber', 'inhaber', 'Name auf der Karte', 'cc-name') + '<div class="note">Die Kartennummer geben Sie im sicheren Feld des Zahlungsdienstleisters ein. eeziframes sieht sie nie.</div>') +
    '</form><p class="km-s">Pilotphase: Es wird nichts abgebucht; gespeichert wird nur eine gekürzte Angabe in diesem Browser.</p><div class="row between"><button type="button" class="btn ghost" data-act="sheet-close">Später</button><button type="button" class="btn primary" data-act="pay-save">' + (s.then && s.then !== 'service' ? 'Speichern und ' + X.planName(s.then) + ' starten' : w ? 'Speichern und freischalten' : 'Speichern') + '</button></div>';
}

/* ---------- Aktionen ---------- */
function act(name, el) {
  const v = el.getAttribute('data-v'), id = el.getAttribute('data-id'), cid = el.getAttribute('data-c');
  const findLink = () => A().links.find((l) => l.id === id);
  if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') return tourSchloss();
  /* Instanz: keine Tour, keine Registrierung, kein Tarif, kein Code vom Kunden, keine Seiten für Besucher */
  if (INST) {
    if (/^tour/.test(name) || ['reg', 'reg-next', 'reg-prev', 'konto', 'linkimport', 'ansicht', 'srv-zahlungsart', 'pay-save', 'login-submit', 'srv-link-ja', 'vonpdf-zu'].includes(name)) return;
    if ((name === 'go' || name === 'nav') && ['abrechnung', 'preise', 'wie', 'landing', 'tour', 'reg', 'anmelden', 'beendet'].includes(v)) return nav(home());
    if (name === 'sheet' && ['login', 'linkimport', 'pay', 'legal', 'linkfrage'].includes(v)) return;
  }
  switch (name) {
    case 'none': return;
    case 'tour': return tourStart();
    case 'tour-weiter': return tourGehe(S.tour ? S.tour.i + 1 : 0);
    case 'tour-zurueck': return tourGehe(S.tour ? S.tour.i - 1 : 0);
    case 'tour-geh': return tourGehe(+v);
    case 'tour-ende': return tourEnde();
    case 'tour-schloss': return tourSchloss();
    case 'tour-du': { if (S.tour) S.tour.du = v === 'du'; return render(); }
    case 'tour-kanal': { if (S.tour) S.tour.kanal = v; return render(); }
    case 'tour-tage': { if (S.tour) S.tour.tage = +v; return render(); }
    case 'tour-abzug': { if (S.tour) S.tour.abzug = +v; return render(); }
    case 'tour-nb': { if (S.tour) S.tour.nb = true; return render(); }
    case 'tour-code': { if (S.tour) S.tour.code = true; return render(); }
    case 'tour-lauf': { if (!S.tour) return; clearTimeout(tourTimer); S.tour.lauf = 0; render(); return tourLauf(); }
    case 'tour-pdf': return tourPDF();
    case 'ansicht': return zurAnsicht(v);
    case 'go': return go(v, id !== null ? id : undefined);
    case 'nav': return nav(v);
    case 'back': return back();
    case 'sheet': { S.sheet = { k: v, id: id }; return render(); }
    case 'sheet-close': { const y = window.scrollY; S.sheet = null; render(); window.scrollTo(0, y); return; }
    case 'srv-link-ja': { const r = S.sheet && S.sheet.k === 'linkfrage' ? S.sheet.r : null; S.sheet = null; if (!r) return render(); if (Server.sitzung && Server.sitzung.mail !== r.mail) Server.abmelden(); return Server.nachAnmeldung(r); }
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
    case 'reg-chip': { const r = S.reg, k = el.getAttribute('data-k'), arr = r.d[k] || [], i = arr.indexOf(v); r.d[k] = i >= 0 ? arr.filter((x) => x !== v) : arr.concat([v]); delete r.err[k]; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'reg-set': { const r = S.reg, k = el.getAttribute('data-k'); r.d[k] = v; delete r.err[k]; S._pop = { act: name, v: v, k: k }; return render(); }
    case 'reg-toggle': { const r = S.reg, def = v === 'push'; r.d[v] = !(r.d[v] !== undefined ? r.d[v] : def); S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'login-submit': {
      const s = S.sheet, mail = String(s.mail || '').trim().toLowerCase(), u = S.logins[mail];
      if (VAL.mail(mail) !== true) { s.err = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return render(); }
      if (!u) { s.err = 'Zu dieser E-Mail gibt es in diesem Browser kein Konto. Bitte kostenlos registrieren.'; return render(); }
      if (String(s.pw || '').length < 8) { s.err = 'Das Passwort ist zu kurz: mindestens 8 Zeichen.'; return render(); }
      return login(u.role, u.id);
    }
    case 'srv-code': { const sh = anmeldeBlatt(); if (!sh) return; return Server.codeSenden(String(sh.mail || '').trim().toLowerCase()); }
    case 'srv-login': { const sh = anmeldeBlatt(); if (!sh) return; return Server.codePruefen(sh.mail, String(sh.code || '').replace(/\s+/g, '')); }
    case 'srv-mail': { const sh = anmeldeBlatt(); if (sh) { sh.schritt = 'mail'; sh.err = ''; } return render(); }
    case 'export': return instExport();
    case 'p-loeschen': return instLoeschen(id);
    case 'srv-zahlungsart': return Server.zahlungsart();
    case 'logout': { if (INST) { Server.abmelden(); S.anmHinweis = ''; nav('anmelden'); return toast('Abgemeldet'); } if (Server.online()) Server.abmelden(); S.role = null; S.sheet = null; nav('landing'); return toast('Abgemeldet'); }
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
    case 'l-deact': { const l = findLink(); if (l && l.status === 'eingegangen') { S.sheet = null; render(); return toast('Ein eingegangenes Aufmaß bleibt im Projekt und in der Abrechnung'); } if (l) { l.status = 'deaktiviert'; Server.projekt(l.id, { deaktivieren: true }); } S.sheet = null; render(); return toast('Link deaktiviert'); }
    case 'l-stage': { const l = findLink(); if (l) { l.stage = v; Server.projekt(l.id, { stage: v }); } S._pop = { act: name, v: v, k: '' }; return render(); }
    case 'nl-next': { const n = S.nl; if (!n) return; n.err = {}; if (String(n.kunde || '').trim().length < 2) { n.err.kunde = 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.'; S._focusErr = true; render(); const f = document.querySelector('.form'); if (f) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); if (window.Haptik) window.Haptik.fehler(); } return; } n.step = 1; S.dir = 'fwd'; return render(); }
    case 'nl-prev': { if (S.nl) { S.nl.step = 0; S.dir = 'back'; } return render(); }
    case 'l-verl': { const l = findLink(); if (!l) return; const r = X.projektAendern(l, { verlaengern: true }); if (!r.ok) return toast(r.msg); Server.projekt(l.id, { verlaengern: true }); render(); return toast(r.msg); }
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
      S.sheet = null; S.lfilt = 'neu'; S._feier = 'willkommen'; nav('links');
      return toast(nW(neu.length, 'Projekt angelegt', 'Projekte angelegt') + '. Jetzt die Links verschicken.');
    }
    case 'vonpdf-zu': { try { sessionStorage.setItem('aufmass.vonpdf.zu', '1'); } catch (e) { /* ok */ } return render(); }
    case 'l-again': { const l = findLink(); S.nl = { step: 0, kunde: l ? l.kunde.replace(/^Beispiel:\s*/, '') : '', kontakt: l ? l.kontakt || '' : '', adresse: l ? l.adresse || '' : '', geb: l ? l.geb || '' : '', fz: l ? l.fz || '' : '', plan: l ? (l.plan || []).slice() : ['Fenster'], note: '', days: 14, du: l ? !!l.du : false, err: {} }; return go('newlink'); }
    case 'copy-am': { const l = findLink(); if (l && !l.locked) copyText(aufmassText(l), 'Aufmaß als Text kopiert'); return; }
    case 'pdf-am': { const l = findLink(); if (l && !l.locked) saveAm(l); return; }
    case 'pay-type': { if (S.sheet) { S.sheet.type = v; S.sheet.err = {}; } return render(); }
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
    /* Strang S5: Foto groß mit Zoom und „Nächstes Foto“, Klärungsliste abhaken, Notiz, Rückfrage, Sprung zur Position */
    case 'foto-gross': { const y = window.scrollY, liste = Array.from(document.querySelectorAll('.pfoto[data-act="foto-gross"]')).map((b) => ({ key: b.getAttribute('data-v'), titel: b.getAttribute('data-id') || 'Foto', pos: b.getAttribute('data-pos') || '' })).filter((x, k, a) => a.findIndex((z) => z.key === x.key) === k); const hier = liste.find((x) => x.key === v) || { key: v, titel: id || 'Foto', pos: el.getAttribute('data-pos') || '' }; S.sheet = { k: 'foto', key: hier.key, titel: hier.titel, pos: hier.pos, liste: liste }; render(); window.scrollTo(0, y); return; }
    case 'foto-naechst': { const s = S.sheet; if (!s || !s.liste || s.liste.length < 2) return; const k = (s.liste.findIndex((x) => x.key === s.key) + 1) % s.liste.length; Object.assign(s, s.liste[k]); return render(); }
    case 'foto-zoom': { const b = document.querySelector('.foto-gross.fz'); if (b && b._zoom) b._zoom(+v); return; }
    case 'klaer-ok': { const l = findLink(); if (!l) return; const ok = !klaerOk(l, v), nz = klaerNotiz(l, v); X.projektAendern(l, { klaer: { id: v, ok: ok, notiz: nz } }); Server.projekt(l.id, { klaer: { id: v, ok: ok, notiz: nz } }); save(); S._pop = { act: name, v: v, k: '' }; render(); return toast(ok ? 'Als geklärt markiert' : 'Wieder offen'); }
    case 'klaer-notiz': { S.klaerNotiz = S.klaerNotiz === v ? null : v; render(); if (S.klaerNotiz) { const f = document.getElementById('kn-' + v); if (f) { try { f.focus({ preventScroll: true }); } catch (e) { /* ok */ } } } return; }
    case 'klaer-frage': { const l = findLink(); if (!l) return; const r = amKlaer(l).find((x) => x.id === v); S.sheet = { k: 'nachbesserung', id: l.id, chips: r ? [r.id] : [], hinweis: r ? klaerFrage(r).slice(0, 300) : '' }; return render(); }
    case 'nb-chip': { const s = S.sheet; if (!s) return; const l = A().links.find((x) => x.id === s.id), r = l ? amKlaer(l).find((x) => x.id === v) : null; if (!r) return; s.chips = s.chips || []; const t = klaerFrage(r), da = s.chips.indexOf(v) >= 0, h = String(s.hinweis || ''); if (da) { s.chips = s.chips.filter((x) => x !== v); s.hinweis = h.split(t).join('').replace(/\s*;\s*;\s*/g, '; ').replace(/^\s*;\s*|\s*;\s*$/g, '').trim(); } else { s.chips.push(v); s.hinweis = (h.trim() ? h.trim().replace(/[;.]?$/, ';') + ' ' : '') + t; } if (s.hinweis.length > 300) toast('Der Hinweis ist länger als 300 Zeichen und wird gekürzt.'); return render(); }
    case 'pos-zu': { const d = document.getElementById('pos-' + v); if (!d) return; d.open = true; try { d.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); } catch (e) { d.scrollIntoView(); } const sm = d.querySelector('summary'); if (sm) { try { sm.focus({ preventScroll: true }); } catch (e) { /* ok */ } } return; }
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
  /* Strang S5: Notiz zu einem Punkt der Klärungsliste, gespeichert beim Verlassen des Felds */
  if (/^klaer:/.test(el.getAttribute('data-in') || '')) { if (ev.type !== 'change') return; const id = el.getAttribute('data-in').slice(6), l = A().links.find((x) => x.id === S.sel); if (!l) return; const ok = klaerOk(l, id), r = X.projektAendern(l, { klaer: { id: id, ok: ok, notiz: el.value } }); if (r && r.ok === false) return toast(r.msg); Server.projekt(l.id, { klaer: { id: id, ok: ok, notiz: el.value } }); save(); return toast('Notiz gespeichert'); }
  if (el.getAttribute('data-in') === 'liste') { if (S.sheet) S.sheet.text = el.value; return; }
  if (el.getAttribute('data-in') === 'ploeschen') { if (S.sheet) { S.sheet.nr = el.value; if (S.sheet.err && ev.type === 'input') { S.sheet.err = ''; const box = el.closest('.f'); if (box) { box.classList.remove('has-err'); const er = box.querySelector('.err'); if (er) er.remove(); } } } return; }
  const k = el.getAttribute('data-in'), v = el.type === 'checkbox' ? el.checked : el.value, i = k.indexOf(':'), ns = i >= 0 ? k.slice(0, i) : k, f = i >= 0 ? k.slice(i + 1) : '';
  if (ns === 'r') { const r = S.reg; if (!r) return; r.d[f] = v; if (r.err && r.err[f]) { delete r.err[f]; const box = el.closest('.f, .agree'); if (box) { box.classList.remove('has-err'); const er = box.querySelector('.err'); if (er) er.remove(); } } if (f === 'agb' && ev.type === 'change') { const er = document.querySelector('.agree + .err'); if (er && v) er.remove(); } return; }
  if (ns === 'lg') { const sb = anmeldeBlatt(); if (sb) sb[f] = v; return; }
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
  if (window.Haptik && el.matches('.seg > button, .chip, .opt, .pipe > button, .switch, .sw-row, .tabs button, .colors button, .col')) window.Haptik.tick();
  if (el.classList.contains('btn')) { const r = el.getBoundingClientRect(); el.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100).toFixed(0) + '%'); el.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100).toFixed(0) + '%'); }
  if (name === 'l-share' && el.tagName === 'A') { const l = A().links.find((x) => x.id === el.getAttribute('data-id')); if (l) { const v = el.getAttribute('data-v'), msg = encodeURIComponent(linkMsg(l)); el.href = v === 'WhatsApp' ? 'https://wa.me/' + (isPhone(l.kontakt) ? intl(l.kontakt) : '') + '?text=' + msg : v === 'SMS' ? 'sms:' + (isPhone(l.kontakt) ? String(l.kontakt).replace(/\s/g, '') : '') + '?body=' + msg : 'mailto:' + (/@/.test(l.kontakt || '') ? l.kontakt : '') + '?subject=' + encodeURIComponent('Ihr Fenster-Aufmaß für ' + BC().name) + '&body=' + msg; } }
  act(name, el);
});
root.addEventListener('submit', (e) => { e.preventDefault(); const f = e.target.getAttribute('data-form'); if (f === 'srvlogin') act(anmeldeBlatt() && anmeldeBlatt().schritt === 'code' ? 'srv-login' : 'srv-code', e.target); if (f === 'login') act('login-submit', e.target); if (f === 'reg') act('reg-next', e.target); if (f === 'nl') act(S.nl && S.nl.step ? 'nl-create' : 'nl-next', e.target); });
root.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && S.sheet) { S.sheet = null; render(); }
  if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') { const form = e.target.closest('form'); if (form) { e.preventDefault(); const f = form.getAttribute('data-form'); if (f === 'srvlogin') act(anmeldeBlatt() && anmeldeBlatt().schritt === 'code' ? 'srv-login' : 'srv-code', form); else if (f === 'login') act('login-submit', form); else if (f === 'reg') act('reg-next', form); else if (f === 'nl') act(S.nl && S.nl.step ? 'nl-create' : 'nl-next', form); } }
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('pt')) { e.preventDefault(); act(e.target.getAttribute('data-act'), e.target); }
});
root.addEventListener('input', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
root.addEventListener('change', (e) => { const el = e.target; if (el && el.getAttribute && el.getAttribute('data-in')) onInput(el, e); });
tick();
setInterval(tick, 60000);
/* Direktlink zur Tour (/#tour), etwa von der Seite für Fensterbauer */
/* Anker: /#tour öffnet die Tour, /#fensterbauer (auch #betriebe) und /#hauseigentuemer wählen die Ansicht; wer über den
   QR-Code eines Aufmaßblatts kommt, ist Fensterbauer */
const ankerLink = () => {
  const h = location.hash;
  /* Instanz: nur der Sprung zu einem Projekt (Link „Im Dashboard öffnen“ aus der Mail) */
  if (INST) { const pi = /^#projekt-([a-z0-9]{1,40})$/i.exec(h); if (!pi) return false; ankerProjekt = pi[1]; history.replaceState(history.state, '', location.pathname + location.search); if (!projektAnkerOeffnen()) render(); return true; }
  if (h === '#tour') { history.replaceState(null, '', location.pathname + location.search); tourStart(); return true; }
  const pm = /^#projekt-([a-z0-9]{1,40})$/i.exec(h);
  if (pm) { ankerProjekt = pm[1]; history.replaceState(history.state, '', location.pathname + location.search); if (!projektAnkerOeffnen()) render(); return true; }
  const a = h === '#fensterbauer' || h === '#betriebe' ? 'betrieb' : h === '#hauseigentuemer' ? 'kunde' : '';
  if (!a) return false;
  ansichtMerken(a);
  if (!S.role) { if (S.screen === 'tour') { clearTimeout(tourTimer); S.tour = null; } S.hist = []; S.screen = 'landing'; S.sheet = null; }
  render(); window.scrollTo(0, 0);
  return true;
};
if (vonPdf()) ansichtMerken('betrieb');
if (!ankerLink()) render();
window.addEventListener('hashchange', ankerLink);
Server.start().then((an) => { if (an) { render(); setInterval(() => Server.aktualisieren(), 30000); } else { window.PilotHinweis(); if (Server.status) render(); } projektAnkerOeffnen(); });


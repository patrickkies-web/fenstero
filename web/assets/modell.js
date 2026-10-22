/* eeziframes · Modell und Abrechnung, gemeinsam für Betriebsbereich (Browser) und Server (Cloudflare Worker)
   window.AW          Fenster-Modell: Felder, Beschriftungen, Ableitungen, Zeichnung als SVG
   window.Abrechnung  Regeln: Tarife, Buchung je Projekt, Kontingente, Nachbesserung, Code-Eingang, Projekte anlegen
   Keine Oberfläche, kein Speicher: Alle Funktionen arbeiten auf einem Konto-Objekt a = { konto, pay, freeUsed, freeQuota, dupOf, downgrade, book, links, notif, abzug, ... }
   und geben zurück, was passiert ist. Im Browser speichert der Betriebsbereich, auf dem Server die Datenbank. */
(function (root, factory) {
  const api = factory();
  root.AW = api.AW; root.Abrechnung = api.Abrechnung;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const AW = (() => {
    const OPT = {
      etage: { kg: 'Keller', eg: 'EG', og: 'OG', dg: 'DG' },
      form: { rechteck: 'Rechteck', rundbogen: 'Rundbogen', segment: 'Segmentbogen', schraeg: 'Schräg', rund: 'Rund' },
      olT: { F: 'Oberlicht fest', K: 'Oberlicht kippbar' },
      material: { kunststoff: 'Kunststoff', kunststoffalu: 'Kunststoff-Alu', holz: 'Holz', holzalu: 'Holz-Alu', alu: 'Aluminium' },
      spross: { wiener: 'Wiener Sprosse', szr: 'Innenliegende Sprossen', auf: 'Aufgesetzte Sprossen', echt: 'Glasteilende Sprossen' },
      aufseite: { beide: 'innen und außen', aussen: 'nur außen', innen: 'nur innen' },
      glas: { '2': '2-fach', '3': '3-fach' },
      glasfn: { schall: 'Schallschutz', vsg: 'Sicherheitsglas', sicht: 'Sichtschutz', sonne: 'Sonnenschutz' },
      griff: { standard: 'Standard', abschliessbar: 'abschließbar', druckknopf: 'mit Druckknopf', ohne: 'ohne Griff (verdeckt oder elektrisch)', motor: 'elektrisch' },
      hstGriff: { standard: 'Hebegriff', abschliessbar: 'Hebegriff, abschließbar', motor: 'elektrisch (Taster oder App)' },
      art: { fenster: 'Fenster', balkon: 'Balkon- oder Terrassentür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür (Parallel-Schiebe-Kipp)', fsw: 'Faltschiebewand' },
      pskSchema: { A: '2-teilig (1 Schiebeflügel vor 1 Festteil)', A3: '3-teilig (1 Schiebeflügel vor 2 Festteilen)' },
      griffA: { keiner: 'kein Griff außen', ziehgriff: 'Ziehgriff mit Schnäpper', abschliessbar: 'abschließbar, Schlüssel außen' },
      boden: { bleibt: 'Fußboden bleibt, wie er ist', neu: 'Fußboden wird erneuert' },
      absturz: { balkon: 'Balkon oder Terrasse davor, keine nötig', gelaender: 'Geländer außen (französischer Balkon)', glas: 'Glasbrüstung in der Laibung', fest: 'unteres Feld fest, Sicherheitsglas' },
      erreichbar: { ja: 'leicht erreichbar', nein: 'nicht leicht erreichbar' },
      foerdweg: { bafa: 'BAFA-Zuschuss (BEG EM)', steuer: 'Steuerbonus (§ 35c EStG)', keine: 'keine', offen: 'noch offen' },
      /* Fachangaben der KI aus den Fotos (ki.fach) */
      kasten: { einbau: 'Einbaukasten innen im Sturz', aufsatz: 'Aufsatzkasten auf dem Fenster', vorbau: 'Vorbaukasten außen', keiner: 'kein Kasten' },
      fassade: { putz: 'Putz', klinker: 'Klinker', wdvs: 'gedämmt (WDVS)', holz: 'Holz', sonstige: 'sonstige' },
      bank: { naturstein: 'Naturstein', kunststoff: 'Kunststoff', holz: 'Holz', fliesen: 'Fliesen', aluminium: 'Aluminium', klinker: 'Klinker', faserzement: 'Faserzement', beton: 'Beton', keine: 'keine' },
      bruestung: { bodentief: 'bodentief', niedrig: 'niedrig', normal: 'normal' },
      ul: { nein: 'kein Unterlicht', glas: 'Unterlicht aus Glas, fest', paneel: 'Unterlicht als Paneel, gedämmt' },
      hstSchema: { A: 'Schema A (1 Schiebeflügel vor 1 Festteil)', A3: '3-teilig (1 Schiebeflügel vor 2 Festteilen)', C: 'Schema C (2 Schiebeflügel mittig vor 2 Festteilen)', D: 'Schema D (2 Schiebeflügel, Mitte zu)' },
      hstRichtung: { L: 'Schiebeflügel links', R: 'Schiebeflügel rechts' },
      schwelle: { flach: 'flache Schwelle (ca. 20 mm)', null: 'barrierefrei ohne Schwelle (DIN 18040)', standard: 'Standardschwelle mit Anschlag' },
      fswSchema: { links: 'Paket links', rechts: 'Paket rechts', geteilt: 'Paket beidseitig' },
      sart: { keiner: 'keiner', behalten: 'bestehender bleibt', rollladen: 'Rollladen', raffstore: 'Raffstore', screen: 'Screen (Textil)' },
      einbau: { aufsatz: 'Aufsatzkasten', vorbau: 'Vorbaukasten' },
      sfarbe: { silber: 'silber', weiss: 'weiß', hellgrau: 'hellgrau', anthrazit: 'anthrazit', braun: 'braun', bronze: 'bronze', schwarz: 'schwarz' },
      iart: { keiner: 'keiner', rollo: 'Rollo', plissee: 'Plissee', jalousie: 'Jalousie' },
      ifarbe: { weiss: 'weiß', creme: 'creme', grau: 'grau', anthrazit: 'anthrazit', blau: 'blau', gruen: 'salbei', terra: 'terracotta' },
      gf: { weiss: 'weiß', silber: 'silber', edelstahl: 'Edelstahl', titan: 'titan', schwarz: 'schwarz', anthrazit: 'anthrazit', braun: 'braun', messing: 'Messing', bronze: 'bronze' },
      rc: { basis: 'Basisschutz', rc1: 'RC1 N', rc2: 'RC2' },
      roll: { keiner: 'keiner', behalten: 'bestehender bleibt', aufsatz: 'Aufsatzrollladen neu', vorbau: 'Vorbaurollladen neu' },
      antrieb: { gurt: 'Gurt', kurbel: 'Kurbel', motor: 'elektrisch', smart: 'Smart Home' },
      insekt: { keiner: 'keiner', spann: 'Spannrahmen', dreh: 'Drehrahmen', plissee: 'Plissee' },
      fbi: { behalten: 'behalten', werzalit: 'Werzalit', stein: 'Naturstein', holz: 'Holz' },
      fba: { behalten: 'behalten', alu: 'Aluminium', stein: 'Naturstein' },
      gebaeude: { efh: 'Einfamilienhaus', dh: 'Doppelhaushälfte', rh: 'Reihenhaus', mfh: 'Mehrfamilienhaus', etw: 'Eigentumswohnung', denkmal: 'Denkmalschutz', altbau: 'Altbau', gewerbe: 'Gewerbe' },
      zeit: { asap: 'so bald wie möglich', '3m': 'in 1 bis 3 Monaten', '6m': 'in 3 bis 6 Monaten', '12m': 'später, erst Angebote', sofort: 'so bald wie möglich', offen: 'noch offen' },
      budget: { b0: 'noch offen', b1: 'bis 5.000 €', b2: '5.000 bis 10.000 €', b3: '10.000 bis 20.000 €', b4: 'über 20.000 €' },
      orn: { satinato: 'Satinato', chinchilla: 'Chinchilla', master: 'Mastercarré' }
    };
    const COL = { '9016': ['Verkehrsweiß', 'RAL 9016', '#f1f0ea'], '9001': ['Cremeweiß', 'RAL 9001', '#e9e0cf'], '7035': ['Lichtgrau', 'RAL 7035', '#cbd0cc'], '7039': ['Quarzgrau', 'RAL 7039', '#6c6960'], '7012': ['Basaltgrau', 'RAL 7012', '#575d5e'], '7016': ['Anthrazitgrau', 'RAL 7016', '#383e42'], '9005': ['Tiefschwarz', 'RAL 9005', '#141516'], '8022': ['Schwarzbraun', 'RAL 8022', '#2b2522'], '6005': ['Moosgrün', 'RAL 6005', '#1f4436'], '5011': ['Stahlblau', 'RAL 5011', '#1e2b3a'], '3005': ['Weinrot', 'RAL 3005', '#5e2129'], goak: ['Golden Oak', 'Holzdekor', '#b5732f'], nuss: ['Nussbaum', 'Holzdekor', '#6b4428'], eiche: ['Eiche hell', 'Holzdekor', '#c9a46b'], mahag: ['Mahagoni', 'Holzdekor', '#6f2f22'] };
    const TYP = { F: 'Fest', D: 'Dreh', K: 'Kipp', DK: 'Dreh-Kipp', S: 'Schiebeflügel', X: 'Faltflügel', P: 'Gehflügel', PS: 'PSK-Flügel' };
    /* Türen: Hebe-Schiebe, Faltschiebewand, Balkon-/Terrassentür, PSK; ihre Einstellungen (Schwelle usw.) liegen je Art in einem eigenen Feld */
    const istTuer = (w) => w.art === 'hst' || w.art === 'fsw' || w.art === 'balkon' || w.art === 'psk';
    const tuerCfg = (w) => (w.art === 'hst' ? w.hst : w.art === 'fsw' ? w.fsw : w.art === 'psk' ? w.psk : w.art === 'balkon' ? w.bt : null) || {};
    const lab = (g, k) => (OPT[g] && OPT[g][k]) || '';
    /* Farben (S2): alle RAL-Classic-Töne, Holzdekore und Sonderfarben aus ral.js (im Browser globalThis.RAL, auf dem Server per require).
       col(k) → [Name, Code, Hex] für den gespeicherten Schlüssel; Unbekanntes bleibt sichtbar statt still Verkehrsweiß zu werden. */
    let ralCache, ralVersucht = false;
    const ral = () => {
      if (ralCache) return ralCache;
      if (typeof globalThis !== 'undefined' && globalThis.RAL) return (ralCache = globalThis.RAL);
      if (!ralVersucht) { ralVersucht = true; try { ralCache = require('./ral.js'); } catch (e) { ralCache = null; } }
      return ralCache;
    };
    const ralEintrag = (k) => { const r = ral(); return k && r ? r.eintrag(k) : null; };
    const col = (k) => { const e = ralEintrag(k); return e ? [e.name, e.code, e.hex] : COL[k] || (k ? [String(k), 'Farbe bitte prüfen', COL['9016'][2]] : COL['9016']); };
    /* Name einer Auswahl (Griff, Sonnenschutz, Innenschutz): eigene Beschriftung, sonst der Farbeintrag mit Code */
    const optName = (g, k, sonst) => lab(g, k) || (ralEintrag(k) || {}).label || sonst;
    const num = (v) => { const n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
    const th = (v) => (!num(v) ? '–' : String(Math.round(num(v))).replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    /* ---------- Offen statt Vorgabe ----------
       Wo der Kunde „Weiß ich noch nicht“ wählt (oder eine Frage ohne Vorauswahl übergeht, etwa die Farbe außen), steht im Fenster
       offen = { Schlüssel: true }. Der Wert daneben bleibt, damit Modell und Zeichnung etwas zeigen; auf dem Blatt steht „offen“. */
    const OFFEN_TEXT = 'offen, bitte beraten';
    const OFFEN_NAME = { material: 'Material', fa: 'Farbe außen', fi: 'Farbe innen', glas: 'Verglasung', glasfn: 'Glas-Extras', spross: 'Sprossenart', griff: 'Griff', griffA: 'Griff außen', rc: 'Einbruchschutz', sart: 'Sonnenschutz außen', einbau: 'Rollladenkasten', antrieb: 'Antrieb', insekt: 'Insektenschutz', iart: 'Sichtschutz innen', fbi: 'Fensterbank innen', fba: 'Fensterbank außen', schwelle: 'Schwelle', montage: 'Montage' };
    const OFFEN_REIHE = Object.keys(OFFEN_NAME);
    /* Sonnenschutz außen mit Kasten: sart, bei älteren Aufmaßen ohne sart das frühere Feld roll (Aufsatz oder Vorbau heißt Rollladen) */
    const sartVon = (w) => (w.sart && w.sart !== 'keiner' ? w.sart : w.roll === 'aufsatz' || w.roll === 'vorbau' ? 'rollladen' : w.roll === 'behalten' ? 'behalten' : 'keiner');
    const kastenAktiv = (w) => { const a = sartVon(w); return a === 'rollladen' || a === 'raffstore' || a === 'screen'; };
    /* Gehört die Angabe überhaupt zu diesem Element? (keine Fensterbank an Türen, kein Griff an Festverglasung usw.) */
    function offenGilt(w, k) {
      const art = w.art || 'fenster', tuer = istTuer(w);
      if (k === 'fbi' || k === 'fba') return !tuer && w.form !== 'rund';
      if (k === 'griff') return art !== 'fest';
      if (k === 'griffA') return art === 'balkon';
      if (k === 'schwelle') return tuer && art !== 'psk';
      if (k === 'einbau' || k === 'antrieb') return kastenAktiv(w);
      if (k === 'spross') return (w.bars || []).length > 0;
      return OFFEN_REIHE.indexOf(k) >= 0;
    }
    const istOffen = (w, k) => !!(w && w.offen && w.offen[k]) && offenGilt(w, k);
    const offenListe = (w) => OFFEN_REIHE.filter((k) => istOffen(w, k));
    const ov = (w, k, text) => (istOffen(w, k) ? OFFEN_TEXT : text);
    /* Eigene Farben: ral.js erkennt RAL, DB, Dekore, Strukturen und Farbwörter (im Browser und auf dem Server); ohne ral.js Farbtext (gemeinsam.js) */
    const leser = () => ral() || (typeof globalThis !== 'undefined' && globalThis.Farbtext) || null;
    const erkannt = (t) => { const ft = leser(); return t && ft ? ft.lesen(t) : null; };
    const farbeOffen = (w, seite) => !!(w.offen && (seite === 'innen' ? (w.gleich ? w.offen.fa : w.offen.fi) : w.offen.fa));
    function farbe(w, seite) {
      if (farbeOffen(w, seite)) return ['Farbe offen', 'bitte beraten', '#f1f0ea'];
      const innen = seite === 'innen', t = innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA, k = innen ? (w.gleich ? w.fa : w.fi) : w.fa, f = erkannt(t);
      if (!f) return col(k);
      return f.eintrag ? [f.eintrag.name, f.eintrag.code, f.hex] : [f.name, f.code ? 'RAL ' + f.code : 'eigene Farbe', f.hex];
    }
    function farbZeile(w, seite) {
      if (farbeOffen(w, seite)) return OFFEN_TEXT;
      const innen = seite === 'innen', t = (innen ? (w.gleich ? w.wunschA : w.wunschI) : w.wunschA) || '', c = farbe(w, seite);
      if (t && erkannt(t)) return c[0] + (c[1] && c[1] !== 'eigene Farbe' && c[0].indexOf(c[1]) < 0 ? ' (' + c[1] + ')' : '') + ', eigene Angabe';
      return c[0] + ' (' + c[1] + ')' + (t ? ', Wunsch: ' + t : '');
    }
    const nameMitWunsch = (t, basis) => { const f = erkannt(t); return f ? f.name : basis + (t ? ', Wunsch: ' + t : ''); };
    const griffName = (w) => nameMitWunsch(w.wunschGf, optName('gf', w.gf, 'weiß'));
    function sashesFor(k) {
      if (k === '1') return [{ t: 'DK', din: 'L' }];
      if (k === '2s') return [{ t: 'D', din: 'L' }, { t: 'DK', din: 'R' }];
      if (k === '3') return [{ t: 'DK', din: 'L' }, { t: 'F', din: 'L' }, { t: 'DK', din: 'R' }];
      return [{ t: 'DK', din: 'L' }, { t: 'DK', din: 'R' }];
    }
    function base() {
      return { name: '', etage: 'eg', anzahl: 1, mo: { hm: '', hl: '', hr: '', wm: '', wt: '', wb: '' }, el: { h: '', w: '' }, bru: '', laib: '', form: 'rechteck', teilung: '2p', ol: false, olT: 'K', sashes: sashesFor('2p'), richtung: 'innen', material: 'kunststoff', bars: [], spross: 'wiener', breite: 26, aufSeite: 'beide',
        fa: '7016', fi: '9016', gleich: false, wunschA: '', wunschI: '', wunschGf: '', wunschSf: '', wunschIf: '', glas: '3', glasfn: [], orn: 'satinato', griff: 'standard', gf: 'weiss', rc: 'basis', roll: 'keiner', antrieb: 'gurt', insekt: 'keiner', fbi: 'behalten', fba: 'alu',
        art: 'fenster', neu: false, plan: null, wand: '', ul: false, ulH: 400, ulA: 'glas', hst: { schema: 'A', richtung: 'R', schwelle: 'flach' }, fsw: { n: 3, schema: 'links', geh: true, schwelle: 'flach' }, sart: 'keiner', sfarbe: 'silber', iart: 'keiner', ifarbe: 'weiss', durchbruch: true,
        bt: { schwelle: 'standard', griffA: 'keiner', boden: 'bleibt' }, psk: { schema: 'A', richtung: 'R', schwelle: 'standard' }, offen: {}, absturz: '', erreichbar: '', massOk: false,
        demontage: true, ralm: true, putz: true, notiz: '', ki: null, fotos: 0 };
    }
    const mk = (o) => { const w = Object.assign(base(), o); if (!o.sashes) w.sashes = sashesFor(w.teilung); return w; };
    function derive(w) {
      const mo = w.mo || {}, hs = ['hm', 'hl', 'hr'].map((k) => num(mo[k])).filter(Boolean), ws = ['wm', 'wt', 'wb'].map((k) => num(mo[k])).filter(Boolean);
      const moH = hs.length ? Math.min.apply(null, hs) : 0, moW = ws.length ? Math.min.apply(null, ws) : 0;
      return { moH: moH, moW: moW, devH: hs.length > 1 ? Math.max.apply(null, hs) - moH : 0, devW: ws.length > 1 ? Math.max.apply(null, ws) - moW : 0, elH: num(w.el && w.el.h) || num(w.h), elW: num(w.el && w.el.w) || num(w.w) };
    }
    const fluegelText = (S) => S.map((x) => TYP[x.t] + (x.t === 'D' || x.t === 'DK' ? (x.din === 'L' ? ' DIN links' : ' DIN rechts') : '')).join(' · ');
    function opening(w) {
      const S = w.sashes || [];
      if (w.art === 'fest') return S.length + (S.length === 1 ? ' Feld' : ' Felder') + ', fest verglast, ohne Griff';
      if (w.art === 'hst') { const h = w.hst || {}; return lab('hstSchema', h.schema) + (h.schema === 'A' || h.schema === 'A3' ? ', ' + lab('hstRichtung', h.richtung) : '') + ', ' + ov(w, 'schwelle', lab('schwelle', h.schwelle)); }
      if (w.art === 'fsw') { const f = w.fsw || {}; return S.length + ' Flügel, ' + lab('fswSchema', f.schema) + (f.geh ? ', mit Gehflügel' : ', ohne Gehflügel') + ', ' + ov(w, 'schwelle', lab('schwelle', f.schwelle)); }
      if (w.art === 'psk') { const p = w.psk || {}; return lab('pskSchema', p.schema) + ', ' + lab('hstRichtung', p.richtung) + ', kippbar, mit Schwelle'; }
      if (w.art === 'balkon') { const b = w.bt || {}; return (w.ol ? lab('olT', w.olT) + ' · ' : '') + fluegelText(S) + ', ' + ov(w, 'schwelle', lab('schwelle', b.schwelle)); }
      return (w.ol ? lab('olT', w.olT) + ' · ' : '') + fluegelText(S) + (w.ul ? ' · ' + lab('ul', w.ulA) + ' ' + th(w.ulH) + ' mm' : '');
    }
    /* Sonnenschutz außen in Worten; ältere Aufmaße kennen nur roll */
    function sonne(w) {
      if (istOffen(w, 'sart')) return OFFEN_TEXT;
      const a = w.sart && w.sart !== 'keiner' ? w.sart : (w.roll === 'aufsatz' || w.roll === 'vorbau' ? 'rollladen' : w.roll === 'behalten' ? 'behalten' : 'keiner');
      if (a === 'keiner') return 'keiner';
      if (a === 'behalten') return 'bestehender bleibt';
      return lab('sart', a) + ', ' + (istOffen(w, 'einbau') ? 'Kasten nach Wahl des Fensterbauers' : lab('einbau', w.roll === 'vorbau' ? 'vorbau' : 'aufsatz')) + ', ' + nameMitWunsch(w.wunschSf, optName('sfarbe', w.sfarbe, 'silber')) + ', ' + (istOffen(w, 'antrieb') ? 'Antrieb offen' : lab('antrieb', w.antrieb));
    }
    const innen = (w) => (istOffen(w, 'iart') ? OFFEN_TEXT : !w.iart || w.iart === 'keiner' ? 'keiner' : lab('iart', w.iart) + ', ' + nameMitWunsch(w.wunschIf, optName('ifarbe', w.ifarbe, 'weiß')));
    const griffText = (w) => (w.art === 'fest' ? 'ohne Griff' : istOffen(w, 'griff') ? OFFEN_TEXT : (w.art === 'hst' ? (lab('hstGriff', w.griff) || 'Hebegriff') : (lab('griff', w.griff) || 'Standard')) + (w.griff === 'ohne' || w.griff === 'motor' ? '' : ', ' + griffName(w)));
    const montageText = (w) => (istOffen(w, 'montage') ? 'nach Vorschlag des Fensterbauers' : [w.neu ? (w.durchbruch !== false ? 'Wanddurchbruch samt Sturz' : '') : (w.demontage ? 'Altfenster ausbauen und entsorgen' : ''), w.ralm ? 'RAL-Montage' : '', w.putz ? 'Innenlaibung verputzen' : ''].filter(Boolean).join(', ') || 'nur Lieferung');
    const rcText = (w) => (istOffen(w, 'rc') ? OFFEN_TEXT : lab('rc', w.rc) || 'Basisschutz') + (w.erreichbar === 'ja' ? ' · leicht erreichbar' + (w.rc === 'rc2' ? '' : ', Polizei empfiehlt RC2') : w.erreichbar === 'nein' ? ' · nicht leicht erreichbar' : '');
    /* ---------- Pflichtthemen ----------
       Absturzsicherung: Fensterbrüstungen müssen nach der Musterbauordnung (§ 38 MBO, von den meisten Ländern übernommen) mindestens 0,80 m hoch
       sein, bei mehr als 12 m Absturzhöhe 0,90 m; darunter, bei bodentiefen Fenstern und bei Türen ohne Balkon davor braucht es eine Absturzsicherung. Gefragt wird im OG und DG
       ab einer Brüstung unter 900 mm (die Absturzhöhe kennt die App nicht); ohne gemessene Brüstung, wenn das Innenfoto eine bodentiefe oder
       niedrige zeigt. */
    const ABSTURZ_MM = 900;
    const bruDa = (w) => w.bru !== '' && w.bru != null && String(w.bru).trim() !== '';
    function absturzFrage(w) {
      if (!w || (w.etage !== 'og' && w.etage !== 'dg')) return false;
      if (istTuer(w)) return true;
      if (bruDa(w)) return num(w.bru) < ABSTURZ_MM;
      const f = w.ki && w.ki.fach;
      return !!(f && (f.bruestung === 'bodentief' || f.bruestung === 'niedrig'));
    }
    const absturzText = (w) => (w.absturz ? lab('absturz', w.absturz) : OFFEN_TEXT);
    /* ---------- Förderung ----------
       Zielwerte nach den technischen Mindestanforderungen der BEG EM und der ESanMV (Steuerbonus, Anlage 4), beide gleich: Fenster, Balkon-
       und Terrassentüren Uw ≤ 0,95; barrierearm oder einbruchhemmend und mit Sonderverglasung (z. B. Schallschutz ab Rw 40 dB) ≤ 1,1;
       Baudenkmal ≤ 1,4, mit echten (glasteilenden) Sprossen ≤ 1,6. Ältere Aufmaße kennen nur foerd (ja/nein): ja heißt „noch offen“. */
    const foerdWeg = (p) => { p = p || {}; return OPT.foerdweg[p.foerdweg] ? p.foerdweg : p.foerd ? 'offen' : ''; };
    function uwZiel(w, p) {
      const fw = foerdWeg(p); if (fw !== 'bafa' && fw !== 'steuer') return null;
      if ((p || {}).gebaeude === 'denkmal') { const echt = w.spross === 'echt' && (w.bars || []).length > 0; return { wert: echt ? 1.6 : 1.4, grund: 'Baudenkmal' + (echt ? ', glasteilende Sprossen' : '') }; }
      if (w.rc === 'rc2' && !istOffen(w, 'rc')) return { wert: 1.1, grund: 'einbruchhemmend (RC2)' };
      const s = istTuer(w) && !istOffen(w, 'schwelle') ? tuerCfg(w).schwelle : '';
      if (s === 'null' || s === 'flach') return { wert: 1.1, grund: 'barrierearme Schwelle' };
      if ((w.glasfn || []).indexOf('schall') >= 0) return { wert: 1.1, grund: 'Schallschutzglas ab Rw 40 dB' };
      return { wert: 0.95, grund: '' };
    }
    const uwText = (z) => (z ? 'Uw höchstens ' + String(z.wert).replace('.', ',') + ' W/(m²K)' + (z.grund ? ' (' + z.grund + ')' : '') : '');
    /* Ohne Fotos erfasst: Der Kunde hat im Foto-Schritt „Ohne Foto weiter“ gewählt und bisher kein Foto nachgereicht */
    const ohneFotos = (w) => !!(w && w.ohneFoto) && !num(w.fotos);
    /* ---------- Maße gegen das Foto ----------
       Die KI schätzt aus dem Innenfoto das Seitenverhältnis des Fensterelements (Breite : Höhe, Schrägsicht herausgerechnet). Weicht es
       stark von den Handmaßen ab, sind Breite und Höhe vertauscht (Kehrwert passt) oder ein Maß stimmt nicht. Großzügige Grenzen,
       damit ein schräges Foto keinen Fehlalarm auslöst. */
    function massPruef(w) {
      if (!w || w.neu || !w.ki || !(Number(w.ki.verh) > 0)) return null;
      const d = derive(w); if (!d.elW || !d.elH) return null;
      const rm = d.elW / d.elH, rk = Number(w.ki.verh), lm = Math.log(rm), lk = Math.log(rk), ab = Math.abs(lm - lk);
      if (ab <= 0.25) return null;
      if (Math.abs(lm + lk) < 0.12 && Math.abs(lk) > 0.12) return { typ: 'tausch', rm: rm, rk: rk };
      return ab > 0.3 ? { typ: 'abweichung', rm: rm, rk: rk } : null;
    }
    const verhText = (v) => String(Math.round(v * 100) / 100).replace('.', ',');
    /* Elektrischer Antrieb gewünscht: Rollladen/Raffstore/Screen mit Motor oder Hebe-Schiebe-Tür elektrisch */
    const motor = (w) => (kastenAktiv(w) && !istOffen(w, 'sart') && (w.antrieb === 'motor' || w.antrieb === 'smart') && !istOffen(w, 'antrieb')) || (w.art === 'hst' && w.griff === 'motor');
    /* Fachangaben der KI in einer Zeile: was der Fensterbauer sonst beim ersten Termin anschaut */
    function fachZeile(w) {
      const f = w && w.ki && w.ki.fach; if (!f) return '';
      const t = [];
      if (f.rollladen) t.push('Kasten: ' + lab('kasten', f.rollladen));
      if (f.anschlagI || f.anschlagA) t.push('Anschlag ' + (f.anschlagI === 'innen' ? 'innen' : f.anschlagA === 'aussen' ? 'außen' : 'ohne'));
      if (f.fassade) t.push('Fassade ' + lab('fassade', f.fassade));
      if (f.fbi || f.fba) t.push('Fensterbank' + (f.fbi ? ' innen ' + lab('bank', f.fbi) : '') + (f.fbi && f.fba ? ',' : '') + (f.fba ? ' außen ' + lab('bank', f.fba) : ''));
      if (f.bruestung) t.push('Brüstung ' + lab('bruestung', f.bruestung));
      if (f.strom === true) t.push('Strom am Fenster'); else if (f.strom === false) t.push('kein Strom zu sehen');
      if (f.erreichbar === true) t.push('leicht erreichbar'); else if (f.erreichbar === false) t.push('nicht leicht erreichbar');
      if (f.geruest === true) t.push('Gerüst nötig'); else if (f.geruest === false) t.push('ohne Gerüst');
      return t.join(' · ');
    }
    function massZeile(w) {
      if (!w || w.neu || !w.ki || !(Number(w.ki.verh) > 0)) return '';
      const d = derive(w), m = massPruef(w); if (!d.elW || !d.elH) return '';
      const zahlen = 'Breite : Höhe laut Foto etwa ' + verhText(Number(w.ki.verh)) + ', laut Maßen ' + verhText(d.elW / d.elH);
      if (!m) return 'passen zusammen (' + zahlen + ')';
      return (m.typ === 'tausch' ? 'Breite und Höhe vertauscht?' : 'weichen ab') + ' (' + zahlen + ')' + (w.massOk ? ', Kunde hat die Maße bestätigt' : '') + '; beim Feinaufmaß prüfen';
    }
    function rows(w, p) {
      const d = derive(w), mo = w.mo || {}, art = w.art || 'fenster', z = uwZiel(w, p);
      const r = [
        ['Maueröffnung', d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm, kleinstes Maß' + (d.devW > 5 || d.devH > 5 ? ', bis ' + Math.max(d.devW, d.devH) + ' mm außer Winkel' : '') : 'nicht gemessen'],
        ['Breiten', 'oben ' + th(mo.wt) + ' · Mitte ' + th(mo.wm) + ' · unten ' + th(mo.wb)],
        ['Höhen', 'links ' + th(mo.hl) + ' · Mitte ' + th(mo.hm) + ' · rechts ' + th(mo.hr)],
        [istTuer(w) ? 'Türelement' : 'Fensterelement', d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm mit Rahmen' + (w.neu ? ' (Wunschmaß)' : '') : 'nicht gemessen'],
        ['Lage', (w.name || 'ohne Raum') + ', ' + (lab('etage', w.etage) || 'EG') + (num(w.bru) ? ', Brüstung ' + th(w.bru) + ' mm' : '') + (num(w.laib) ? ', Laibung innen ' + th(w.laib) + ' mm' : '') + (num(w.wand) ? ', Wand ' + th(w.wand) + ' mm' : '')],
        ['Einbau', w.neu ? 'Neue Öffnung: ' + (ohneFotos(w) ? 'ohne Foto, Lage nicht eingezeichnet' : 'Lage vom Kunden auf dem Foto eingezeichnet') + ', Maße sind Wunschmaße. Sturz und Statik vor dem Durchbruch prüfen.' : 'Austausch' + (ohneFotos(w) ? ' ohne Fotos' : '') + ', Feinaufmaß vor Ort'],
        ['Element', lab('art', art) || 'Fenster'],
        ['Öffnung', opening(w) + (w.richtung === 'aussen' && !istTuer(w) && art !== 'fest' ? ', öffnet nach außen' : '')],
        ['Form, Material', (lab('form', w.form) || 'Rechteck') + ', ' + (istOffen(w, 'material') ? 'Material ' + OFFEN_TEXT : lab('material', w.material) || 'Kunststoff')],
        ['Farbe', 'außen ' + farbZeile(w, 'aussen') + ', innen ' + (w.gleich ? 'wie außen' : farbZeile(w, 'innen'))],
        ['Glas', ov(w, 'glas', lab('glas', w.glas) || '3-fach') + (istOffen(w, 'glasfn') ? ', Extras ' + OFFEN_TEXT : (w.glasfn || []).length ? ', ' + w.glasfn.map((g) => lab('glasfn', g) + (g === 'sicht' ? ' (' + lab('orn', w.orn) + ')' : '')).join(', ') : '')],
        ['Sprossen', (w.bars || []).length ? ov(w, 'spross', lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + lab('aufseite', w.aufSeite) + ')' : '')) + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück' : 'keine'],
        ['Griff', griffText(w) + (art === 'balkon' ? '; außen ' + ov(w, 'griffA', lab('griffA', (w.bt || {}).griffA) || 'kein Griff') : '')],
        ['Einbruchschutz', rcText(w)]
      ];
      if (absturzFrage(w)) r.push(['Absturzsicherung', absturzText(w)]);
      if (z) r.push(['Förderwert', uwText(z) + ', ' + lab('foerdweg', foerdWeg(p))]);
      r.push(['Sonnenschutz außen', sonne(w)], ['Sonnenschutz innen', innen(w)], ['Insektenschutz', ov(w, 'insekt', lab('insekt', w.insekt) || 'keiner')]);
      if (istTuer(w)) r.push(['Schwelle', art === 'psk' ? 'mit Schwelle (PSK)' : ov(w, 'schwelle', lab('schwelle', tuerCfg(w).schwelle) || 'flache Schwelle') + (art === 'balkon' ? ', ' + lab('boden', (w.bt || {}).boden || 'bleibt') : '')]);
      else r.push(['Fensterbank', 'innen ' + ov(w, 'fbi', lab('fbi', w.fbi) || 'behalten') + ', außen ' + ov(w, 'fba', lab('fba', w.fba) || 'behalten')]);
      r.push(['Montage', montageText(w)]);
      if (w.notiz) r.push(['Notiz des Kunden', w.notiz]);
      return r;
    }
    /* Befund der KI zur Einbausituation: Fachangaben auf einen Blick, Abgleich der Maße mit dem Foto, Zeilen, dann Hinweise und Prüfpunkte fürs Feinaufmaß */
    function kiRows(w) {
      if (!w.ki) return [];
      const fz = fachZeile(w), mz = massZeile(w);
      return (fz ? [['Auf einen Blick', fz]] : []).concat(mz ? [['Maße und Foto', mz]] : [], w.ki.rows || [], (w.ki.hints || []).map((t) => ['Hinweis', t]), (w.ki.pruefen || []).map((t) => ['Vor Ort prüfen', t]));
    }
    /* ---------- Klärungsliste: oben auf dem Blatt und im Betriebsbereich (Strang S5) ----------
       Was der Fensterbauer vor dem Angebot klären muss, nur aus echten Auslösern in den Daten. Eine Regelstelle für Betriebsbereich,
       Text-Export und PDF (beide Ausgaben); neutral formuliert, damit derselbe Text beim Kunden (Du) und beim Betrieb (Sie) passt.
       klaerung(wins, p, l): p = Angaben des Kunden zum Projekt, l = optional die Projektdaten des Betriebs ({ plan, geb }).
       Rückgabe [{ id, k, v, warum, art, gruppe, kurz, pos }]: id bleibt über Neuzeichnen und Nachbesserung gleich (zum Abhaken,
       l.klaer[id]); k nennt die Position oder das Thema, v was zu klären ist, warum den Grund; gruppe ordnet in
       Pflicht, Mit dem Kunden, Vor Ort prüfen (KLAER_GRUPPEN). */
    const KLAER_GRUPPEN = [['pflicht', 'Pflicht'], ['kunde', 'Mit dem Kunden'], ['vorort', 'Vor Ort prüfen']];
    const ART_GRUPPE = { pflicht: 'pflicht', bau: 'pflicht', foerder: 'kunde', offen: 'kunde', hinweis: 'kunde', kunde: 'kunde', umfang: 'kunde', pruefen: 'vorort', ki: 'vorort', mass: 'vorort' };
    /* Notizen des Kunden je Stelle (Vertrag mit S1: w.notizen = { stelle: text }, Beschriftung AW.notizStelle); ältere Aufmaße tragen
       nur w.notiz. Rückgabe [[Stelle, Text, Schlüssel]] in der Reihenfolge der App */
    const NOTIZ_ERSATZ = { start: 'Start', fotos: 'Fotos', zeichnen: 'Lage auf dem Foto', planmasse: 'Wunschmaße', messen: 'Messen', raender: 'Ränder der Öffnung', ergebnis: 'Ergebnis der Maße', anfrage: 'Angaben zum Haus', anfrage2: 'Zeit, Budget und Förderung', anfrage3: 'Kontakt', notiz: 'Notiz' };
    function notizenVon(o) {
      if (!o) return [];
      let l = [];
      if (typeof AW !== 'undefined' && AW && typeof AW.notizListe === 'function') { try { l = AW.notizListe(o) || []; } catch (e) { l = []; } }
      else if (o.notizen && typeof o.notizen === 'object' && !Array.isArray(o.notizen)) {
        const name = (k) => (typeof AW !== 'undefined' && AW && typeof AW.notizStelle === 'function' ? AW.notizStelle(k) : OFFEN_NAME[k] || NOTIZ_ERSATZ[k] || k);
        l = Object.keys(o.notizen).filter((k) => /^[A-Za-z0-9-]{1,24}$/.test(k) && typeof o.notizen[k] === 'string' && o.notizen[k].trim()).slice(0, 80).map((k) => [name(k), String(o.notizen[k]).trim().slice(0, 500), k]);
      }
      if (typeof o.notiz === 'string' && o.notiz.trim() && !l.some((x) => x[2] === 'notiz')) l.push(['Notiz', o.notiz.trim().slice(0, 600), 'notiz']);
      return l;
    }
    /* Ist ein eingetippter Farbwunsch erkannt? true/false; null, wenn kein Leser da ist (Server ohne ral.js): dann keine Regel */
    function farbErkannt(t) {
      const g = typeof globalThis !== 'undefined' ? globalThis : {};
      try { if (g.RAL && typeof g.RAL.finde === 'function') return !!g.RAL.finde(t); if (g.Farbtext && typeof g.Farbtext.lesen === 'function') return !!g.Farbtext.lesen(t); } catch (e) { return null; }
      return null;
    }
    const MASS_NAME = { wt: 'Breite oben', wm: 'Breite Mitte', wb: 'Breite unten', hl: 'Höhe links', hm: 'Höhe Mitte', hr: 'Höhe rechts' };
    /* Fehlende Maße einer Position in Worten (leer: vollständig). Neue Öffnung: Wunschmaß Breite und Höhe genügt */
    function massLuecken(w) {
      const mo = w.mo || {}, d = derive(w);
      if (w.neu) return [!d.moW ? 'Breite' : '', !d.moH ? 'Höhe' : ''].filter(Boolean);
      return Object.keys(MASS_NAME).filter((k) => !num(mo[k])).map((k) => MASS_NAME[k]).concat(!d.elW || !d.elH ? ['Element'] : []);
    }
    function klaerung(wins, p, l) {
      wins = wins || []; p = p || {}; l = l || {};
      const out = [], pos = (w, i) => 'Pos. ' + (i + 1) + (w.name ? ' ' + w.name : '');
      const wk = (w, i) => (w && w.wid ? String(w.wid).replace(/[^A-Za-z0-9_]/g, '').slice(0, 24) || 'p' + i : 'p' + i);
      const dazu = (k, v, art, kurz, i, id, warum) => out.push({ id: String(id || art + '-' + out.length).slice(0, 64), k: k, v: v, warum: warum || '', art: art, gruppe: ART_GRUPPE[art] || 'kunde', kurz: kurz, pos: i == null ? null : i });
      const mehrere = (idx) => (idx.length === wins.length && wins.length > 1 ? 'Alle Positionen' : idx.length === 1 ? pos(wins[idx[0]], idx[0]) : 'Pos. ' + idx.map((i) => i + 1).join(', '));
      const geb = p.gebaeude || '', lgeb = l.geb || '', plan = Array.isArray(l.plan) ? l.plan : [];
      const bruText = (w) => (istTuer(w) ? ', bodentief' : bruDa(w) ? (num(w.bru) ? ', Brüstung ' + th(w.bru) + ' mm' : ', bodentief') : (w.ki && w.ki.fach && w.ki.fach.bruestung === 'bodentief' ? ', bodentief laut Foto' : ', niedrige Brüstung laut Foto'));
      /* Pflicht: Absturzsicherung, Lüftung, Statik, Denkmal, Rettungsweg */
      wins.forEach((w, i) => { if (absturzFrage(w) && w.absturz !== 'balkon') dazu(pos(w, i), 'Absturzsicherung nötig (' + (lab('etage', w.etage) || 'OG') + bruText(w) + '): ' + (w.absturz ? lab('absturz', w.absturz) : 'bitte beraten'), 'pflicht', 'Absturzsicherung', i, 'absturz-' + wk(w, i), 'Bauordnung (§ 38 MBO): Brüstung mindestens 80 cm, über 12 m Absturzhöhe 90 cm; Türen ohne Balkon davor immer.'); });
      const nE = wins.reduce((a, x) => a + (num(x.anzahl) || 1), 0), tot = num(p.total);
      if (tot && nE > tot / 3) dazu('Lüftung', 'Lüftungskonzept nach DIN 1946-6 erforderlich: ' + nE + ' von ' + tot + ' Fenstern werden getauscht, mehr als ein Drittel.', 'pflicht', 'Lüftungskonzept', null, 'lueftung', 'Dichte neue Fenster: ohne Konzept drohen Feuchte und Schimmel.');
      wins.forEach((w, i) => { if (w.neu) dazu(pos(w, i), 'Neue Öffnung: Sturz und Statik vor dem Durchbruch klären.', 'pflicht', 'Sturz und Statik', i, 'statik-' + wk(w, i), 'Durchbruch in der Außenwand, die Wand trägt oft.'); });
      if (geb === 'denkmal' || lgeb === 'denkmal') dazu('Gebäude', 'Baudenkmal: Genehmigung der Denkmalbehörde vor dem Auftrag einholen; Teilung, Sprossen und Farben sind oft vorgegeben.', 'bau', 'Denkmalschutz', null, 'denkmal', 'Ohne Genehmigung drohen Rückbau und Bußgeld.');
      const dg = []; wins.forEach((w, i) => { if (w.etage === 'dg' && (w.art || 'fenster') === 'fenster') dg.push(i); });
      if (dg.length) dazu(mehrere(dg), 'Dachgeschoss: Ist ein Fenster zweiter Rettungsweg, braucht es im Lichten mindestens 0,90 × 1,20 m und höchstens 1,20 m Brüstung.', 'bau', 'Rettungsweg', dg.length === 1 ? dg[0] : dg, 'rettung', 'Landesbauordnung (§ 35 MBO), wenn es keine zweite Treppe gibt.');
      /* Mit dem Kunden: Förderung, Glas, Einbruchschutz, Eigentümer, Fußboden, Umfang, Fensterzahl, Maße, Farbwunsch, Fensterbank, Notizen, offene Wünsche */
      const fw = foerdWeg(p);
      if (fw === 'bafa') dazu('Förderung', 'BAFA-Zuschuss gewünscht: Energieeffizienz-Experte einbinden, Antrag vor Beginn, Vertrag nur mit Förderklausel. Uw-Zielwerte bei den Positionen.', 'foerder', 'Förderung BAFA', null, 'foerd', 'Ohne Antrag vor Beginn gibt es keinen Zuschuss.');
      else if (fw === 'steuer') dazu('Förderung', 'Steuerbonus nach § 35c EStG gewünscht: Bescheinigung nach amtlichem Muster vom Fachbetrieb. Uw-Zielwerte bei den Positionen.', 'foerder', 'Steuerbonus', null, 'foerd', 'Ohne Bescheinigung kein Steuerbonus.');
      else if (fw === 'offen') dazu('Förderung', 'Noch offen: BAFA-Zuschuss oder Steuerbonus, vor dem Auftrag klären.', 'foerder', 'Förderweg', null, 'foerd', 'Davon hängen Glas, Uw-Wert und Ablauf ab.');
      /* 2-fach erreicht etwa Uw 1,1 bis 1,3: bei den strengen Zielwerten (0,95 und 1,1) ein Hinweis, im Baudenkmal (1,4 und 1,6) nicht */
      if (fw === 'bafa' || fw === 'steuer') wins.forEach((w, i) => { const z = uwZiel(w, p); if (w.glas === '2' && !istOffen(w, 'glas') && z && z.wert < 1.3) dazu(pos(w, i), '2-fach-Glas gewählt: Für die Förderung braucht es ' + uwText(uwZiel(w, p)).replace(/ \(.*\)$/, '') + ', das schafft praktisch nur 3-fach-Glas.', 'foerder', 'Glas für die Förderung', i, 'glas-' + wk(w, i), 'Mit 2-fach-Glas gibt es keine Förderung.'); });
      wins.forEach((w, i) => {
        if (istOffen(w, 'rc') || w.rc === 'rc2') return;
        if (w.erreichbar === 'ja') dazu(pos(w, i), 'Leicht erreichbar, gewählt ' + (lab('rc', w.rc) || 'Basisschutz') + ': Die Polizei empfiehlt RC2.', 'hinweis', 'Einbruchschutz RC2', i, 'rc2-' + wk(w, i), 'Leicht erreichbare Fenster sind der häufigste Einstieg.');
        else if (!w.erreichbar && w.ki && w.ki.fach && w.ki.fach.erreichbar === true) dazu(pos(w, i), 'Laut Foto leicht erreichbar, gewählt ' + (lab('rc', w.rc) || 'Basisschutz') + ': Einbruchschutz besprechen, die Polizei empfiehlt RC2.', 'hinweis', 'Einbruchschutz RC2', i, 'rc2-' + wk(w, i), 'Leicht erreichbare Fenster sind der häufigste Einstieg.');
      });
      if (geb === 'etw' || lgeb === 'etw') dazu('Gebäude', 'Eigentumswohnung: Fenster gehören meist zum Gemeinschaftseigentum; Beschluss der Eigentümer und Vorgaben zu Farbe und Teilung klären.', 'bau', 'Eigentümer', null, 'weg', 'Ohne Beschluss darf am Gemeinschaftseigentum nichts geändert werden.');
      else if (geb === 'mfh' || lgeb === 'mfh') dazu('Gebäude', 'Mehrfamilienhaus: Eigentümer und Vorgaben zu Farbe und Teilung klären, bei Miete die Zustimmung des Vermieters.', 'bau', 'Eigentümer', null, 'weg', 'Fenster gehören zur Fassade des ganzen Hauses.');
      out.forEach((r) => { if (r.id === 'weg') r.gruppe = 'kunde'; });
      wins.forEach((w, i) => {
        if (!istTuer(w)) return;
        const s = tuerCfg(w).schwelle;
        if (w.art === 'balkon' && (w.bt || {}).boden === 'neu') dazu(pos(w, i), 'Fußboden wird erneuert: Höhe der Schwelle, Abdichtung und Anschluss an den neuen Bodenaufbau abstimmen.', 'kunde', 'Fußboden und Schwelle', i, 'boden-' + wk(w, i), 'Die Schwelle richtet sich nach dem fertigen Fußboden.');
        if (s === 'null' && w.art !== 'psk' && !istOffen(w, 'schwelle')) dazu(pos(w, i), 'Barrierefreie Schwelle: Abdichtung und Entwässerung außen (Rinne) einplanen.', 'pruefen', 'Schwelle', i, 'schwelle-' + wk(w, i), 'Ohne Schwelle muss Wasser außen sicher ablaufen.');
      });
      if (plan.length) {
        const sonneDa = wins.some((w) => { const a = sartVon(w); return a !== 'keiner' && a !== 'behalten' || istOffen(w, 'sart'); }), insektDa = wins.some((w) => (w.insekt && w.insekt !== 'keiner') || istOffen(w, 'insekt')), bankDa = wins.some((w) => !istTuer(w) && ((w.fbi && w.fbi !== 'behalten') || (w.fba && w.fba !== 'behalten') || istOffen(w, 'fbi') || istOffen(w, 'fba')));
        const fehlt = [plan.indexOf('Haustür') >= 0 ? ['haustuer', 'Haustür ist im Projekt geplant, im Aufmaß aber nicht enthalten: getrennt aufnehmen.'] : null, plan.indexOf('Rollläden') >= 0 && !sonneDa ? ['rolllaeden', 'Rollläden sind im Projekt geplant, im Aufmaß hat kein Fenster einen Sonnenschutz.'] : null, plan.indexOf('Insektenschutz') >= 0 && !insektDa ? ['insekt', 'Insektenschutz ist im Projekt geplant, im Aufmaß an keinem Fenster gewählt.'] : null, plan.indexOf('Fensterbänke') >= 0 && !bankDa ? ['baenke', 'Fensterbänke sind im Projekt geplant, im Aufmaß bleiben alle bestehenden.'] : null].filter(Boolean);
        fehlt.forEach((f) => dazu('Umfang', f[1], 'umfang', 'Umfang', null, 'umfang-' + f[0], 'So beim Anlegen des Projekts angegeben.'));
      }
      if (!tot && nE >= 2) dazu('Fenster im Haus', 'Zahl der Fenster im Haus fehlt: Ohne sie lässt sich nicht sagen, ob ein Lüftungskonzept nach DIN 1946-6 nötig ist.', 'kunde', 'Fenster im Haus', null, 'fensterzahl', 'Wer mehr als ein Drittel der Fenster tauscht, braucht ein Lüftungskonzept.');
      wins.forEach((w, i) => {
        const fehlt = massLuecken(w); if (!fehlt.length) return;
        dazu(pos(w, i), fehlt.length >= 7 || (w.neu && fehlt.length >= 2) ? 'Nicht gemessen: Maße beim Kunden nachfragen oder vor Ort nehmen.' : 'Maße unvollständig, es fehlt: ' + fehlt.join(', ') + '.', 'mass', 'Maße unvollständig', i, 'unvoll-' + wk(w, i), 'Ohne alle Maße kein verlässliches Bestellmaß.');
      });
      wins.forEach((w, i) => {
        if (istTuer(w) || w.neu || bruDa(w) || absturzFrage(w) || (w.etage !== 'og' && w.etage !== 'dg')) return;
        dazu(pos(w, i), 'Brüstungshöhe fehlt: im ' + lab('etage', w.etage) + ' nötig, um die Absturzsicherung zu beurteilen.', 'mass', 'Brüstung fehlt', i, 'bru-' + wk(w, i), 'Unter 80 cm (über 12 m Höhe 90 cm) braucht es eine Absturzsicherung.');
      });
      wins.forEach((w, i) => { if (!w.neu && !istTuer(w) && w.form !== 'rund' && w.fbi && w.fbi !== 'behalten' && !istOffen(w, 'fbi') && !num(w.laib)) dazu(pos(w, i), 'Laibungstiefe innen fehlt: für die neue Fensterbank innen nötig.', 'mass', 'Laibung fehlt', i, 'laib-' + wk(w, i), 'Die Tiefe der Fensterbank hängt von der Laibung ab.'); });
      out.forEach((r) => { if (/^(unvoll|bru|laib)-/.test(r.id)) r.gruppe = 'kunde'; });
      wins.forEach((w, i) => [['aussen', 'außen', w.wunschA], ['innen', 'innen', w.gleich ? '' : w.wunschI]].forEach((s) => {
        const t = String(s[2] || '').trim(); if (!t || farbeOffen(w, s[0]) || farbErkannt(t) !== false) return;
        dazu(pos(w, i), 'Farbwunsch ' + s[1] + ' „' + t.slice(0, 60) + '“ nicht eindeutig: Ton mit RAL-Nummer oder Muster festlegen.', 'kunde', 'Farbwunsch', i, 'farbe-' + wk(w, i) + '-' + s[0].slice(0, 1), 'Ohne eindeutigen Ton kein verbindliches Angebot.');
      }));
      wins.forEach((w, i) => { if (!w.neu && !istTuer(w) && w.form !== 'rund' && w.demontage !== false && w.fba === 'behalten' && !istOffen(w, 'fba')) dazu(pos(w, i), 'Fensterbank außen soll bleiben: beim Ausbau oft beschädigt, Anschluss ans neue Fenster prüfen.', 'kunde', 'Fensterbank außen', i, 'fba-' + wk(w, i), 'Die alte Bank passt selten an das Anschlussprofil des neuen Fensters.'); });
      /* Notizen des Kunden an der jeweiligen Stelle und seine Nachricht */
      wins.forEach((w, i) => notizenVon(w).forEach((n) => dazu(pos(w, i), (n[2] === 'notiz' ? 'Notiz' : 'Notiz zu ' + n[0]) + ': „' + n[1] + '“', 'kunde', 'Notizen des Kunden', i, 'notiz-' + wk(w, i) + '-' + n[2], 'Notiz an dieser Stelle der App.')));
      const pn = String(p.notiz || '').trim();
      if (pn) dazu('Nachricht', '„' + pn + '“', 'kunde', 'Nachricht des Kunden', null, 'nachricht', 'Nachricht beim Absenden des Aufmaßes.');
      notizenVon({ notizen: p.notizen }).forEach((n) => dazu('Projekt', 'Notiz zu ' + n[0] + ': „' + n[1] + '“', 'kunde', 'Notizen des Kunden', null, 'pnotiz-' + n[2], 'Notiz an dieser Stelle der App.'));
      /* Offene Wünsche: Positionen mit derselben Liste zusammen */
      const gruppen = [];
      wins.forEach((w, i) => { const ol = offenListe(w).map((k) => OFFEN_NAME[k]); if (!ol.length) return; const key = ol.join(', '), g = gruppen.find((x) => x.key === key); if (g) g.i.push(i); else gruppen.push({ key: key, i: [i] }); });
      gruppen.forEach((g) => dazu(mehrere(g.i), g.key + ': ' + OFFEN_TEXT + '.', 'offen', '', null, 'offen-' + g.i.map((i) => wk(wins[i], i)).join('_').slice(0, 50) + '-' + g.key.length, 'Bei der Auswahl „Weiß ich noch nicht“ gewählt.'));
      /* Vor Ort prüfen: Fotos, Maße, Winkel, Strom, Asbest, KI, Gerüst, gleiche Fenster */
      const ohne = []; wins.forEach((w, i) => { if (ohneFotos(w)) ohne.push(i); });
      if (ohne.length) dazu(mehrere(ohne), 'Ohne Fotos erfasst: Einbausituation (Rollladenkasten, Laibung, Fensterbänke, Fassade)' + (ohne.some((i) => wins[i].neu) ? ' und Lage der neuen Öffnung' : '') + ' vor Ort aufnehmen.', 'pruefen', 'Ohne Fotos', ohne.length === 1 ? ohne[0] : ohne, 'ohnefoto', 'Ohne Fotos fehlt die Einbausituation.');
      const ohneKi = []; wins.forEach((w, i) => { if (num(w.fotos) > 0 && !(w.ki && ((w.ki.rows || []).length || (w.ki.fach && Object.keys(w.ki.fach).length)))) ohneKi.push(i); });
      if (ohneKi.length) dazu(mehrere(ohneKi), 'Fotos ohne Auswertung: Einbausituation (Kasten, Anschlag, Fensterbänke, Fassade) selbst auf den Fotos ansehen.', 'pruefen', 'Fotos ohne Auswertung', ohneKi.length === 1 ? ohneKi[0] : ohneKi, 'ohneki', 'Die Fotos wurden nicht ausgewertet.');
      wins.forEach((w, i) => { const m = massPruef(w); if (m) dazu(pos(w, i), (m.typ === 'tausch' ? 'Breite und Höhe laut Foto vertauscht?' : 'Seitenverhältnis laut Foto weicht von den Maßen ab.') + (w.massOk ? ' Die Maße sind bestätigt.' : '') + ' Beim Feinaufmaß prüfen.', 'pruefen', 'Maße prüfen', i, 'massfoto-' + wk(w, i), 'Foto und Handmaße passen nicht zusammen.'); });
      wins.forEach((w, i) => {
        if (w.neu) return;
        const d = derive(w), dev = Math.max(d.devW, d.devH);
        if (dev > 10) dazu(pos(w, i), 'Öffnung bis ' + dev + ' mm außer Winkel: Ausgleich und Fuge beim Feinaufmaß festlegen, das kleinste Maß zählt.', 'mass', 'Außer Winkel', i, 'winkel-' + wk(w, i), 'Ab 10 mm passt ein rechtwinkliges Element nur mit breiterer Fuge.');
        if (d.moW && d.moH && d.elW && d.elH) {
          if (d.elW > d.moW || d.elH > d.moH) dazu(pos(w, i), 'Element größer als die Öffnung (' + th(d.elW) + ' × ' + th(d.elH) + ' zu ' + th(d.moW) + ' × ' + th(d.moH) + ' mm): nur mit Anschlag möglich, sonst vertauscht oder falsch abgelesen.', 'mass', 'Element größer als Öffnung', i, 'groesser-' + wk(w, i), 'Ohne Anschlag ist ein Element immer kleiner als die Maueröffnung.');
          else if ((d.moW - d.elW) / 2 > 60 || d.moH - d.elH > 120) dazu(pos(w, i), 'Element je Seite über 60 mm kleiner als die Öffnung: Verbreiterung, Anschlag oder Messfehler prüfen.', 'mass', 'Großer Abstand zur Öffnung', i, 'kleiner-' + wk(w, i), 'Üblich sind 10 bis 30 mm Fuge je Seite.');
        }
      });
      wins.forEach((w, i) => { if (motor(w) && !(w.ki && w.ki.fach && w.ki.fach.strom === true)) dazu(pos(w, i), 'Elektrischer Antrieb gewünscht: Strom am Fenster ' + (w.ki && w.ki.fach && w.ki.fach.strom === false ? 'laut Foto nicht zu sehen' : 'klären') + ', gegebenenfalls Elektriker einplanen.', 'pruefen', 'Strom für den Antrieb', i, 'strom-' + wk(w, i), (w.antrieb === 'smart' ? 'Smart Home und Motor' : 'Ein Motor') + ' braucht Strom am Fenster.'); });
      /* Faserzement laut Foto: bis 1993 enthielt er oft Asbest, vor dem Ausbau prüfen lassen */
      wins.forEach((w, i) => { const f = (w.ki && w.ki.fach) || {}, wo = [f.fbi === 'faserzement' ? 'innen' : '', f.fba === 'faserzement' ? 'außen' : ''].filter(Boolean); if (wo.length) dazu(pos(w, i), 'Fensterbank ' + wo.join(' und ') + ' laut Foto aus Faserzement: vor dem Ausbau auf Asbest prüfen (bis 1993 verbaut).', 'pruefen', 'Asbest prüfen', i, 'asbest-' + wk(w, i), 'Asbest darf nur mit Sachkunde ausgebaut werden (TRGS 519).'); });
      wins.forEach((w, i) => {
        const f = (w.ki && w.ki.fach) || {}, d = derive(w), og = w.etage === 'og' || w.etage === 'dg';
        if (f.geruest === true) dazu(pos(w, i), 'Gerüst laut Foto nötig: einplanen und mit dem Kunden absprechen.', 'ki', 'Gerüst', i, 'geruest-' + wk(w, i), 'Von innen lässt sich hier nicht montieren.');
        else if (og && f.geruest !== false && d.elW * d.elH >= 3e6) dazu(pos(w, i), 'Großes Element im ' + lab('etage', w.etage) + ' (' + th(d.elW) + ' × ' + th(d.elH) + ' mm): Transport, Gerüst oder Hebegerät prüfen.', 'ki', 'Transport und Montage', i, 'gross-' + wk(w, i), 'Ab etwa 3 m² ist das Element zu schwer, um es durchs Treppenhaus zu tragen.');
      });
      wins.forEach((w, i) => {
        const k = w.ki || {};
        (k.pruefen || []).slice(0, 6).forEach((t, n) => { if (String(t || '').trim()) dazu(pos(w, i), 'Vor Ort prüfen: ' + String(t).trim(), 'ki', 'Vor Ort prüfen', i, 'kip-' + wk(w, i) + '-' + n, 'Auf den Fotos nicht sicher zu beurteilen.'); });
        (k.hints || []).slice(0, 6).forEach((t, n) => { if (String(t || '').trim()) dazu(pos(w, i), 'Laut Foto: ' + String(t).trim(), 'ki', 'Hinweis aus den Fotos', i, 'kih-' + wk(w, i) + '-' + n, 'Erkannt auf den Fotos; wichtig fürs Angebot.'); });
      });
      wins.forEach((w, i) => { const n = num(w.anzahl); if (n > 1) dazu(pos(w, i), n + ' gleiche Fenster: vor Ort prüfen, ob alle wirklich gleich sind; gemessen wurde eines.', 'mass', 'Gleiche Fenster', i, 'gleich-' + wk(w, i), 'Gleich aussehende Fenster weichen oft um einige Millimeter ab.'); });
      /* Reihenfolge: Pflicht, Mit dem Kunden, Vor Ort prüfen; innerhalb der Gruppe wie oben */
      const rang = { pflicht: 0, kunde: 1, vorort: 2 };
      return out.map((r, n) => [r, n]).sort((a, b) => (rang[a[0].gruppe] - rang[b[0].gruppe]) || a[1] - b[1]).map((x) => x[0]);
    }
    /* Klärungsliste nach Gruppen: [{ id, titel, punkte }], leere Gruppen fallen weg */
    const klaerGruppen = (liste) => KLAER_GRUPPEN.map((g) => ({ id: g[0], titel: g[1], punkte: (liste || []).filter((r) => r.gruppe === g[0]) })).filter((g) => g.punkte.length);
    /* Kurzfassung für eine Zeile: „Absturzsicherung (Pos. 2), Lüftungskonzept, Farbe außen (alle)“; offene Wünsche je Angabe */
    function klaerKurz(wins, p, l) {
      wins = wins || [];
      const map = new Map(), add = (key, i) => { if (!map.has(key)) map.set(key, []); if (i != null && map.get(key).indexOf(i) < 0) map.get(key).push(i); };
      klaerung(wins, p, l).forEach((r) => { if (r.art !== 'offen') (Array.isArray(r.pos) ? r.pos : [r.pos]).forEach((i) => add(r.kurz, i)); });
      wins.forEach((w, i) => offenListe(w).forEach((k) => add(OFFEN_NAME[k], i)));
      return Array.from(map.entries()).map((e) => e[0] + (e[1].length ? ' (' + (e[1].length === wins.length && wins.length > 1 ? 'alle' : 'Pos. ' + e[1].sort((a, b) => a - b).map((i) => i + 1).join(', ')) + ')' : ''));
    }
    /* ---------- Wünsche des Kunden in kurzen Sätzen (Strang S5) ----------
       wuensche(w, p) → { satz, offen, gruppen: [{ id, titel, zeilen: [{ k, t, offen, hex }], notizen }], notizen: { masse, fotos, allgemein } }
       Ein Satz fürs Wesentliche, dann acht Gruppen (Fenster, Farbe, Glas, Beschlag und Sicherheit, Sonnenschutz, Insektenschutz,
       Fensterbänke bzw. Schwelle und Boden, Montage); Notizen des Kunden stehen bei der Gruppe ihrer Stelle. Für Betriebsbereich und PDF. */
    const NOTIZ_GRUPPE = { start: 'allgemein', lage: 'allgemein', design: 'allgemein', notiz: 'allgemein', fotos: 'fotos', zeichnen: 'fotos', messen: 'masse', raender: 'masse', ergebnis: 'masse', planmasse: 'masse',
      teilung: 'fenster', material: 'fenster', ol: 'fenster', ul: 'fenster', form: 'fenster', richtung: 'fenster', felder: 'fenster', hsts: 'fenster', hstr: 'fenster', psks: 'fenster', pskr: 'fenster', psk: 'fenster', fswn: 'fenster', fsws: 'fenster', fswg: 'fenster', sprossen: 'fenster', spross: 'fenster', aufseite: 'fenster', breite: 'fenster',
      fa: 'farbe', fi: 'farbe', glas: 'glas', glasfn: 'glas', orn: 'glas', griff: 'beschlag', griffa: 'beschlag', gf: 'beschlag', rc: 'beschlag', absturz: 'beschlag',
      sart: 'sonne', einbau: 'sonne', sfarbe: 'sonne', antrieb: 'sonne', iart: 'sonne', ifarbe: 'sonne', insekt: 'insekt', fbi: 'bank', fba: 'bank', schwelle: 'bank', boden: 'bank', montage: 'montage' };
    const notizGruppe = (k) => (/^(typ|din)-\d+$/.test(k) ? 'fenster' : NOTIZ_GRUPPE[k] || NOTIZ_GRUPPE[String(k).toLowerCase()] || 'allgemein');
    const ARTKURZ = { fenster: 'Fenster', balkon: 'Balkontür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür', fsw: 'Faltschiebewand' };
    const istOT = (t) => String(t || '').indexOf(OFFEN_TEXT) >= 0 || /\boffen\b/.test(String(t || '')) && /^(Material offen|Farbe offen|Antrieb offen)/.test(String(t || ''));
    function wuensche(w, p) {
      const art = w.art || 'fenster', tuer = istTuer(w), z = uwZiel(w, p), S = w.sashes || sashesFor(w.teilung), n = S.length;
      const fa = farbe(w, 'aussen'), fi = farbe(w, 'innen'), sa = sartVon(w);
      const zeile = (k, t, x) => Object.assign({ k: k, t: t, offen: istOT(t) }, x || {});
      const glasExtras = istOffen(w, 'glasfn') ? OFFEN_TEXT : (w.glasfn || []).map((g) => lab('glasfn', g) + (g === 'sicht' ? ' (' + lab('orn', w.orn) + ')' : '')).join(', ');
      const G = [
        { id: 'fenster', titel: 'Fenster', zeilen: [zeile('Element', (lab('art', art) || 'Fenster') + (w.neu ? ', neue Öffnung' : '')), zeile('Öffnung', opening(w) + (w.richtung === 'aussen' && !tuer && art !== 'fest' ? ', öffnet nach außen' : ''))]
          .concat(w.form && w.form !== 'rechteck' ? [zeile('Form', lab('form', w.form))] : [], [zeile('Material', istOffen(w, 'material') ? OFFEN_TEXT : lab('material', w.material) || 'Kunststoff')],
            (w.bars || []).length ? [zeile('Sprossen', ov(w, 'spross', lab('spross', w.spross) + (w.spross === 'auf' ? ' (' + lab('aufseite', w.aufSeite) + ')' : '')) + ', ' + w.breite + ' mm, ' + w.bars.length + ' Stück')] : []) },
        { id: 'farbe', titel: 'Farbe', zeilen: [zeile('außen', farbZeile(w, 'aussen'), { hex: fa[2] }), zeile('innen', w.gleich ? 'wie außen' : farbZeile(w, 'innen'), { hex: fi[2] })] },
        { id: 'glas', titel: 'Glas', zeilen: [zeile('Verglasung', ov(w, 'glas', lab('glas', w.glas) || '3-fach'))].concat(glasExtras ? [zeile('Extras', glasExtras)] : [], z ? [zeile('Förderwert', uwText(z))] : []) },
        { id: 'beschlag', titel: 'Beschlag und Sicherheit', zeilen: [zeile('Griff', griffText(w))].concat(art === 'balkon' ? [zeile('Griff außen', ov(w, 'griffA', lab('griffA', (w.bt || {}).griffA) || 'kein Griff'))] : [], [zeile('Einbruchschutz', rcText(w))], absturzFrage(w) ? [zeile('Absturzsicherung', absturzText(w))] : []) },
        { id: 'sonne', titel: 'Sonnenschutz', zeilen: [zeile('außen', sonne(w)), zeile('innen', innen(w))] },
        { id: 'insekt', titel: 'Insektenschutz', zeilen: [zeile('Insektenschutz', ov(w, 'insekt', lab('insekt', w.insekt) || 'keiner'))] },
        tuer ? { id: 'bank', titel: 'Schwelle und Boden', zeilen: [zeile('Schwelle', art === 'psk' ? 'mit Schwelle (PSK)' : ov(w, 'schwelle', lab('schwelle', tuerCfg(w).schwelle) || 'flache Schwelle'))].concat(art === 'balkon' ? [zeile('Fußboden', lab('boden', (w.bt || {}).boden || 'bleibt'))] : []) }
          : { id: 'bank', titel: 'Fensterbänke', zeilen: w.form === 'rund' ? [zeile('Fensterbänke', 'keine (rundes Fenster)')] : [zeile('innen', ov(w, 'fbi', lab('fbi', w.fbi) || 'behalten')), zeile('außen', ov(w, 'fba', lab('fba', w.fba) || 'behalten'))] },
        { id: 'montage', titel: 'Montage', zeilen: [zeile('Montage', montageText(w))] }
      ];
      const nz = notizenVon(w), rest = { masse: [], fotos: [], allgemein: [] };
      G.forEach((g) => { g.notizen = []; });
      nz.forEach((x) => { const gid = notizGruppe(x[2]), g = G.find((y) => y.id === gid); if (g) g.notizen.push(x); else rest[gid === 'masse' || gid === 'fotos' ? gid : 'allgemein'].push(x); });
      /* Ein Satz: Material, Farben, Glas, Flügel, Sonnenschutz, Insektenschutz, Sprossen, Einbruchschutz; Offenes steht darunter */
      const t = [];
      if (!istOffen(w, 'material')) t.push(lab('material', w.material) || 'Kunststoff');
      if (w.gleich && !farbeOffen(w, 'aussen')) t.push('innen und außen ' + fa[0]);
      else { if (!farbeOffen(w, 'aussen')) t.push('außen ' + fa[0]); if (!farbeOffen(w, 'innen')) t.push('innen ' + fi[0]); }
      if (!istOffen(w, 'glas')) t.push((lab('glas', w.glas) || '3-fach') + ((w.glasfn || []).indexOf('schall') >= 0 && !istOffen(w, 'glasfn') ? ' mit Schallschutz' : ''));
      t.push(art === 'fenster' ? n + ' Flügel' + (w.ol ? ' mit Oberlicht' : '') : art === 'fest' ? 'fest verglast' : ARTKURZ[art]);
      if ((sa === 'rollladen' || sa === 'raffstore' || sa === 'screen') && !istOffen(w, 'sart')) t.push(lab('sart', sa).replace(' (Textil)', '') + (motor(w) ? ' elektrisch' : ''));
      if (w.insekt && w.insekt !== 'keiner' && !istOffen(w, 'insekt')) t.push('Insektenschutz');
      if ((w.bars || []).length) t.push('Sprossen');
      if ((w.rc === 'rc2' || w.rc === 'rc1') && !istOffen(w, 'rc')) t.push(lab('rc', w.rc));
      return { satz: t.join(', '), offen: offenListe(w).map((k) => OFFEN_NAME[k]), gruppen: G, notizen: rest };
    }
    /* ---------- Bestellmaß-Vorschlag ----------
       Abzug des Betriebs: { seite, oben, unten (Fenster, Fensterbankanschluss), untenT (Türen, Schwelle) } in mm, 0 bis 60.
       Warnt, wenn das Foto einen Anschlag zeigt, die Öffnung mehr als 10 mm außer Winkel ist oder Maße und Foto nicht zusammenpassen. */
    function abzugVon(ab) { ab = ab || {}; const z = (v, d) => { const k = parseInt(v, 10); return isNaN(k) ? d : Math.max(0, Math.min(60, k)); }; return { seite: z(ab.seite, 15), oben: z(ab.oben, 15), unten: z(ab.unten, 0), untenT: z(ab.untenT, 0) }; }
    function bestellmass(w, ab) {
      const a = abzugVon(ab), d = derive(w), u = istTuer(w) ? a.untenT : a.unten;
      if (!d.moW || !d.moH) return null;
      const f = (w.ki && w.ki.fach) || {}, warn = [], dev = Math.max(d.devW, d.devH), anschlag = f.anschlagI === 'innen' || f.anschlagA === 'aussen';
      if (anschlag) warn.push('Anschlag ' + (f.anschlagI === 'innen' && f.anschlagA === 'aussen' ? 'innen und außen' : f.anschlagI === 'innen' ? 'innen' : 'außen') + ' laut Foto');
      if (!w.neu && dev > 10) warn.push('Öffnung bis ' + dev + ' mm außer Winkel');
      if (massPruef(w)) warn.push('Maße und Foto passen nicht zusammen');
      const bw = d.moW - 2 * a.seite, bh = d.moH - a.oben - u;
      return { b: bw, h: bh, text: th(bw) + ' × ' + th(bh) + ' mm', formel: (w.neu ? 'Rohbauöffnung' : 'Öffnung') + ' minus ' + a.seite + ' mm je Seite, ' + a.oben + ' mm oben' + (u ? ', ' + u + ' mm unten' : ''), warn: warn,
        warnText: warn.length ? 'Vor Ort prüfen: ' + warn.join(', ') + (anschlag ? '; der Vorschlag ist ohne Anschlag gerechnet.' : '.') : '' };
    }
    /* ---------- Zeichnung fürs Aufmaß ----------
       Ansicht von innen, Maße in mm. plan(w, o) rechnet die Zeichnung einmal als neutrale Teile in einem Rahmen der Breite o.b
       (Einheiten des Aufrufers, Schriftgröße o.fs, höchstens o.h hoch); zeichnungSVG setzt sie als SVG (Betriebsbereich), blatt.js
       zeichnet dieselben Teile mit jsPDF. Teile: { t: 'poly', p, f, s, w, d, o } · { t: 'line', p: [a, b], s, w, d, o } ·
       { t: 'text', x, y, s, g, c, b, a, r, bg }. Maßketten außen: Maueröffnung orange (oben, Mitte, unten; links, Mitte, rechts),
       Element blau, Brüstung bis zum Fußboden; nichts liegt auf dem Glas. Öffnungssymbole: Linien beginnen an der Bandseite, die
       Spitze zeigt zum Griff, Kippen mit Spitze oben, gestrichelt öffnet nach außen; F heißt fest. */
    const ZF = { ink: '#161616', grau: '#5f5f64', wand: '#f3f2ee', laib: '#e4e1d9', glas: '#d6e6f4', bank: '#d3cec4', paneel: '#c9c9c6', boden: '#8a8984', mo: '#ff8a5b', moT: '#b3401e', el: '#7aa2ff', elT: '#3d63c9', griff: '#4a4a4f', papier: '#ffffff' };
    function formFn(form, x, y, b, h) {
      const cx = x + b / 2;
      if (form === 'rund') { const r = Math.max(0, Math.min(b, h) / 2), cy = y + h / 2, q = (xx) => Math.sqrt(Math.max(0, r * r - (xx - cx) * (xx - cx))); return { rund: true, cx: cx, cy: cy, r: r, top: (xx) => cy - q(xx), bot: (xx) => cy + q(xx), xl: cx - r, xr: cx + r }; }
      const sk = form === 'rundbogen' ? Math.min(b / 2, h * 0.8) : form === 'segment' ? Math.min(b * 0.15, h * 0.35) : form === 'schraeg' ? h * 0.42 : 0;
      let top = () => y;
      if (form === 'rundbogen' && sk > 0.5) { const a = b / 2; top = (xx) => y + sk - sk * Math.sqrt(Math.max(0, 1 - ((xx - cx) / a) * ((xx - cx) / a))); }
      else if (form === 'segment' && sk > 0.5) { const hb = b / 2, R = (hb * hb + sk * sk) / (2 * sk), cyc = y + R; top = (xx) => cyc - Math.sqrt(Math.max(0, R * R - (xx - cx) * (xx - cx))); }
      else if (form === 'schraeg') top = (xx) => y + sk * (1 - (xx - x) / b);
      return { rund: false, eckig: !sk, top: top, bot: () => y + h, xl: x, xr: x + b };
    }
    /* Rechteck geschnitten mit der Form (Punkte oben von links nach rechts, unten zurück) */
    function schnitt(g, x, y, b, h) {
      if (g.eckig) return [[x, y], [x + b, y], [x + b, y + h], [x, y + h]];
      const xa = Math.max(x, g.xl), xb = Math.min(x + b, g.xr), J = 28, o = [], u = [];
      for (let j = 0; j < J; j++) { const xx = xa + (xb - xa) * (1 - Math.cos(Math.PI * j / (J - 1))) / 2, yt = Math.min(y + h, Math.max(y, g.top(xx))), yb = Math.max(yt, Math.min(y + h, g.bot(xx))); o.push([xx, yt]); u.unshift([xx, yb]); }
      return o.concat(u);
    }
    const hell = (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return true; const v = parseInt(m[1], 16); return ((v >> 16) * 299 + ((v >> 8) & 255) * 587 + (v & 255) * 114) / 1000 > 200; };
    function plan(w, o) {
      o = o || {};
      const T0 = [], fs = o.fs || 13, B = o.b || 420, HMAX = o.h || B * 1.3, masse = o.masse !== false && !o.nurElement, nurEl = !!o.nurElement;
      const d = derive(w), mo = w.mo || {}, tuer = istTuer(w), art = w.art || 'fenster', form = w.form || 'rechteck', rund = form === 'rund';
      const moW = d.moW || (d.elW ? d.elW + 60 : 1230), moH = d.moH || (d.elH ? d.elH + 40 : 1410);
      const elW = Math.min(d.elW || moW - 50, moW * 0.985), elH = Math.min(d.elH || moH - 35, moH * 0.985), bru = tuer ? 0 : num(w.bru);
      const poly = (p, f, s, sw, x) => T0.push(Object.assign({ t: 'poly', p: p, f: f || null, s: s || null, w: sw || 0 }, x || {}));
      const line = (a, b, s, sw, x) => T0.push(Object.assign({ t: 'line', p: [a, b], s: s, w: sw }, x || {}));
      const text = (x, y, s, x2) => T0.push(Object.assign({ t: 'text', x: x, y: y, s: s, g: fs, c: ZF.ink, b: 700, a: 'middle', r: 0, bg: null }, x2 || {}));
      const R4 = (x, y, b, h) => [[x, y], [x + b, y], [x + b, y + h], [x, y + h]];
      const g0 = fs * 1.55, gk = fs * 1.95, lw = fs * 0.075;
      /* Ränder für die Maßketten: links zwei (links, Mitte), rechts zwei (rechts, Element), oben drei (oben, Mitte, Element), unten eine */
      const L = masse ? g0 + gk + fs * 0.8 : 0, Rr = masse ? g0 + gk + fs * 0.8 : 0, T = masse ? g0 + 2 * gk + fs * 0.8 : 0;
      const wB = Math.max(10, B - L - Rr), sill = !tuer && !rund;
      const zone = (s) => {
        if (nurEl) return 0;
        const sh = sill ? Math.max(fs * 0.45, 35 * s) : 0, kette = masse ? g0 * 0.85 + fs * 0.9 : fs * 0.4;
        if (tuer) return fs * 0.8 + (masse ? g0 + fs * 0.9 : 0);
        if (!bru) return sh + kette + fs * 0.3;
        return Math.max(sh + kette + fs * 1.2, Math.min(bru * s, Math.max(fs * 4.2, moH * s * 0.42))) + fs * 0.9;
      };
      let s = Math.min(wB / (nurEl ? elW : moW), (HMAX - T - zone(0)) / (nurEl ? elH : moH));
      if (!nurEl) s = Math.min(s, (HMAX - T - zone(s)) / moH);
      s = Math.max(s, 1e-4);
      const ow = moW * s, oh = moH * s, ox = nurEl ? 0 : L + (wB - ow) / 2, oy = T, oyB = oy + oh, Z = zone(s), H = nurEl ? elH * s : oy + oh + Z;
      const ew = elW * s, eh = elH * s, ex = nurEl ? (B - ew) / 2 : ox + (ow - ew) / 2, ey = nurEl ? 0 : oyB - eh - (sill ? 0 : 0);
      const gMo = formFn(form, ox, oy, ow, oh);
      /* Wand, Laibung, Fensterbank, Fußboden */
      const sh = sill ? Math.max(fs * 0.45, 35 * s) : 0;
      let yF = null;
      if (!nurEl) {
        const wr = fs * 0.85;
        yF = tuer ? oyB : bru ? oyB + Z - fs * 0.9 : null;
        poly(R4(ox - wr, oy - wr, ow + 2 * wr, (yF != null ? yF : oyB + sh + fs * 0.4) - (oy - wr)), ZF.wand, null, 0);
        poly(rund ? schnitt(gMo, ox, oy, ow, oh) : schnitt(gMo, ox, oy, ow, oh), ZF.laib, ZF.ink, lw * 1.1);
        if (sill) poly(R4(ox - fs * 0.5, oyB, ow + fs, sh), ZF.bank, ZF.ink, lw);
        if (yF != null) {
          const x0 = ox - wr - fs * 0.6, x1 = ox + ow + wr + fs * 0.6;
          line([x0, yF], [x1, yF], ZF.ink, lw * 1.6);
          for (let hx = x0 + fs * 0.5; hx < x1; hx += fs * 0.7) line([hx, yF], [hx - fs * 0.45, yF + fs * 0.45], ZF.boden, lw * 0.8);
          text(B - fs * 0.15, yF - fs * 0.55, 'Fußboden', { a: 'end', g: fs * 0.82, c: ZF.grau, b: 500 });
        }
      }
      /* Element: Blendrahmen in der Farbe innen (Ansicht von innen), Kämpfer, Pfosten, Flügel, Glas, Symbole, Sprossen, Griffe */
      const fc = farbe(w, 'innen')[2], gEl = formFn(form, ex, ey, ew, eh), dash = w.richtung === 'aussen' && !tuer && art !== 'fest';
      const sprossFarbe = hell(fc) ? '#b9b4a8' : fc;
      poly(schnitt(gEl, ex, ey, ew, eh), fc, ZF.ink, lw * 1.2);
      const pf = Math.max(fs * (nurEl ? 0.12 : 0.42), Math.min(ew, eh) * 0.035, 62 * s), pfB = tuer ? Math.max(fs * 0.22, 28 * s) : pf, mul = Math.max(fs * (nurEl ? 0.1 : 0.32), 78 * s), sf = Math.max(fs * (nurEl ? 0.1 : 0.3), 66 * s);
      const ix = ex + pf, iy = ey + pf, iw = ew - 2 * pf, ih = eh - pf - pfB, gIn = formFn(form, ix, iy, iw, ih);
      const senke = rund ? 0 : form === 'rundbogen' ? Math.min(iw / 2, ih * 0.8) : form === 'segment' ? Math.min(iw * 0.15, ih * 0.35) : form === 'schraeg' ? ih * 0.42 : 0;
      const olH = w.ol && !rund ? Math.min(ih * 0.6, Math.max(ih * 0.26, senke)) : 0;
      const ulH = w.ul && art === 'fenster' && !rund ? Math.max(ih * 0.14, Math.min((num(w.ulH) || 400) * s, (ih - olH) * 0.55)) : 0;
      const symW = Math.max(lw * 0.8, fs * 0.055), symO = 0.62;
      const glas = (pts) => poly(pts, ZF.glas, ZF.ink, lw * 0.7);
      const fest = (cx, cy) => { if (!nurEl) text(cx, cy, 'F', { g: fs * 0.95, c: ZF.grau, b: 700 }); };
      /* Symbol in einem Glasfeld (x, y, b, h); Oberkante folgt der Form */
      const symbol = (gg, x, y, b, h, typ, din) => {
        const top = (xx) => Math.max(y, Math.min(y + h, gg.eckig ? y : gg.top(xx))), st = { o: symO, d: dash ? [fs * 0.42, fs * 0.3] : null };
        if (typ === 'D' || typ === 'DK' || typ === 'P' || typ === 'X') { if (din === 'L') { line([x, top(x)], [x + b, y + h / 2], ZF.ink, symW, st); line([x, y + h], [x + b, y + h / 2], ZF.ink, symW, st); } else { line([x + b, top(x + b)], [x, y + h / 2], ZF.ink, symW, st); line([x + b, y + h], [x, y + h / 2], ZF.ink, symW, st); } }
        if (typ === 'K' || typ === 'DK' || typ === 'PS') { line([x, y + h], [x + b / 2, top(x + b / 2)], ZF.ink, symW, st); line([x + b, y + h], [x + b / 2, top(x + b / 2)], ZF.ink, symW, st); }
        if (typ === 'S' || typ === 'PS') {
          const dir = din === 'L' ? 1 : -1, cx = x + b / 2, cy = y + h * 0.62, al = Math.min(b * 0.26, fs * 2.6), sp = Math.min(fs * 0.55, b * 0.08);
          line([cx - dir * al, cy], [cx + dir * al, cy], ZF.ink, symW * 1.4, { o: 0.8 }); line([cx + dir * al, cy], [cx + dir * (al - sp), cy - sp * 0.8], ZF.ink, symW * 1.4, { o: 0.8 }); line([cx + dir * al, cy], [cx + dir * (al - sp), cy + sp * 0.8], ZF.ink, symW * 1.4, { o: 0.8 });
        }
      };
      const sprossen = (i, x, y, b, h, gg) => (w.bars || []).filter((bar) => bar.s === i).forEach((bar) => {
        const bw = Math.max(fs * (nurEl ? 0.06 : 0.14), (num(w.breite) || 26) * s);
        if (bar.d === 'v') { const xx = x + b * bar.p; line([xx, Math.max(y, gg.eckig ? y : gg.top(xx))], [xx, y + h], sprossFarbe, bw); } else { const yy = y + h * bar.p; line([x, yy], [x + b, yy], sprossFarbe, bw); }
      });
      const griff = (x, y, b, h, horiz) => poly(horiz ? R4(x - b / 2, y - h / 2, b, h) : R4(x - b / 2, y - h / 2, b, h), ZF.griff, null, 0, { r: Math.min(b, h) / 2 });
      /* Oberlicht */
      if (olH) {
        const gO = formFn(form, ix, iy, iw, ih);
        if (w.olT === 'F') { glas(schnitt(gO, ix, iy, iw, olH)); fest(ix + iw / 2, iy + olH * 0.6); }
        else {
          poly(schnitt(gO, ix, iy, iw, olH), fc, ZF.ink, lw * 0.8);
          const gG = formFn(form, ix + sf, iy + sf, iw - 2 * sf, ih - 2 * sf);
          glas(schnitt(gG, ix + sf, iy + sf, iw - 2 * sf, olH - 2 * sf)); symbol(gG, ix + sf, iy + sf, iw - 2 * sf, olH - 2 * sf, w.olT || 'K', 'L');
          if (!nurEl) griff(ix + iw / 2, iy + sf * 0.5, Math.min(iw * 0.16, fs * 1.4), Math.max(fs * 0.16, sf * 0.36), true);
        }
      }
      /* Unterlicht */
      if (ulH) { const uy = iy + ih - ulH; if (w.ulA === 'paneel') poly(R4(ix, uy, iw, ulH), ZF.paneel, ZF.ink, lw * 0.7); else { glas(R4(ix, uy, iw, ulH)); fest(ix + iw / 2, uy + ulH / 2); } }
      /* Flügel */
      const S = (w.sashes && w.sashes.length ? w.sashes : sashesFor(w.teilung)), n = S.length, schiebe = art === 'hst' || art === 'psk' || art === 'fsw';
      const y0 = iy + (olH ? olH + mul : 0), h0 = ih - (olH ? olH + mul : 0) - (ulH ? ulH + mul : 0);
      const gap = schiebe ? 0 : w.teilung === '2s' && art !== 'fest' ? Math.max(lw, sf * 0.12) : mul, sw = (iw - gap * (n - 1)) / n;
      S.forEach((sa, i) => {
        const sx = ix + i * (sw + gap), festFeld = (sa.t === 'F' && !schiebe) || art === 'fest';
        if (festFeld) { glas(schnitt(gIn, sx, y0, sw, h0)); sprossen(i, sx, y0, sw, h0, gIn); fest(sx + sw / 2, y0 + h0 / 2); return; }
        poly(schnitt(gIn, sx, y0, sw, h0), fc, ZF.ink, lw * 0.8);
        const gx = sx + sf, gy = y0 + sf, gw = sw - 2 * sf, gh = h0 - 2 * sf, gG = olH ? { eckig: true } : formFn(form, ix + sf, iy + sf, iw - 2 * sf, ih - 2 * sf);
        glas(schnitt(gG.eckig ? { eckig: true } : gG, gx, gy, gw, gh));
        sprossen(i, gx, gy, gw, gh, gG);
        if (sa.t === 'F') fest(gx + gw / 2, gy + gh / 2); else symbol(gG, gx, gy, gw, gh, sa.t, sa.din);
        if (nurEl) return;
        const gb = Math.max(fs * 0.17, sf * 0.36), gl = Math.min(h0 * 0.14, fs * 1.6);
        if (sa.t === 'D' || sa.t === 'DK' || sa.t === 'P') griff(sa.din === 'L' ? sx + sw - sf * 0.5 : sx + sf * 0.5, y0 + h0 / 2, gb, gl);
        else if (sa.t === 'K') griff(sx + sw / 2, y0 + sf * 0.5, Math.min(sw * 0.16, fs * 1.4), gb, true);
        else if (sa.t === 'S' || sa.t === 'PS') griff(sa.din === 'L' ? sx + sf * 0.5 : sx + sw - sf * 0.5, y0 + h0 * 0.52, gb * 1.1, Math.min(h0 * (sa.t === 'PS' ? 0.12 : 0.2), fs * 2.4));
      });
      /* Maßketten: Hilfslinien, Maßlinie mit Schrägstrichen, Zahl auf weißem Grund */
      if (masse) {
        const tick = fs * 0.32, wert = (k) => (num(mo[k]) ? th(mo[k]) : '–');
        const kette = (horiz, a, b, at, von, label, farbe, schrift, x) => {
          x = x || {};
          if (horiz) {
            const dir = at < von ? -1 : 1;
            [a, b].forEach((xx) => line([xx, von + dir * fs * 0.2], [xx, at + dir * fs * 0.3], farbe, lw * 0.7, { o: 0.85 }));
            line([a, at], [b, at], farbe, lw * 1.25, x.d ? { d: x.d } : null);
            [a, b].forEach((xx) => line([xx - tick, at + tick], [xx + tick, at - tick], farbe, lw * 1.6));
            text((a + b) / 2, at, label, { c: schrift, bg: ZF.papier, g: fs * 0.92 });
          } else {
            const dir = at < von ? -1 : 1;
            [a, b].forEach((yy) => line([von + dir * fs * 0.2, yy], [at + dir * fs * 0.3, yy], farbe, lw * 0.7, { o: 0.85 }));
            line([at, a], [at, b], farbe, lw * 1.25, x.d ? { d: x.d } : null);
            [a, b].forEach((yy) => line([at - tick, yy + tick], [at + tick, yy - tick], farbe, lw * 1.6));
            text(at, (a + b) / 2, label, { c: schrift, bg: ZF.papier, g: fs * 0.92, r: -90 });
          }
        };
        const gleichW = w.neu || (num(mo.wt) === num(mo.wm) && num(mo.wm) === num(mo.wb)), gleichH = w.neu || (num(mo.hl) === num(mo.hm) && num(mo.hm) === num(mo.hr));
        const mid = [fs * 0.55, fs * 0.4];
        if (gleichW && d.moW) kette(true, ox, ox + ow, oy - g0, oy, (w.neu ? 'Breite ' : '') + th(d.moW), ZF.mo, ZF.moT);
        else { kette(true, ox, ox + ow, oy - g0, oy, 'oben ' + wert('wt'), ZF.mo, ZF.moT); kette(true, ox, ox + ow, oy - g0 - gk, oy, 'Mitte ' + wert('wm'), ZF.mo, ZF.moT, { d: mid }); }
        if (!gleichW || !d.moW) kette(true, ox, ox + ow, oyB + (tuer ? fs * 0.8 + g0 : sh + g0 * 0.85), oyB, 'unten ' + wert('wb'), ZF.mo, ZF.moT);
        if (gleichH && d.moH) kette(false, oy, oyB, ox - g0, ox, (w.neu ? 'Höhe ' : '') + th(d.moH), ZF.mo, ZF.moT);
        else { kette(false, oy, oyB, ox - g0, ox, 'links ' + wert('hl'), ZF.mo, ZF.moT); kette(false, oy, oyB, ox - g0 - gk, ox, 'Mitte ' + wert('hm'), ZF.mo, ZF.moT, { d: mid }); kette(false, oy, oyB, ox + ow + g0, ox + ow, 'rechts ' + wert('hr'), ZF.mo, ZF.moT); }
        if (d.elW) kette(true, ex, ex + ew, oy - g0 - 2 * gk, ey, 'Element ' + th(d.elW), ZF.el, ZF.elT);
        if (d.elH) kette(false, ey, ey + eh, ox + ow + g0 + gk, ex + ew, 'Element ' + th(d.elH), ZF.el, ZF.elT);
        if (bru && yF != null) kette(false, oyB, yF, ox - g0, ox, 'Brüstung ' + th(bru), ZF.ink, ZF.ink);
      }
      return { b: B, h: H, s: s, teile: T0, mo: { x: ox, y: oy, b: ow, h: oh }, el: { x: ex, y: ey, b: ew, h: eh } };
    }
    /* Breite einer Beschriftung in Inter, geschätzt (für den weißen Grund unter der Zahl im SVG) */
    const textBreite = (s, g, b) => String(s).split('').reduce((a, ch) => a + (/[0-9]/.test(ch) ? 0.61 : /[.,:; ]/.test(ch) ? 0.28 : /[ilIjtfr]/.test(ch) ? 0.33 : /[mwMW]/.test(ch) ? 0.86 : /[A-ZÄÖÜ]/.test(ch) ? 0.68 : 0.56), 0) * g * (b >= 700 ? 1.04 : 1);
    const escX = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function zeichnungSVG(w, o) {
      o = o || {};
      const p = plan(w, o), f = (v) => Math.round(v * 10) / 10, pts = (a) => a.map((q) => f(q[0]) + ' ' + f(q[1])).join('L');
      const st = (t) => ' fill="' + (t.f || 'none') + '" stroke="' + (t.s || 'none') + '"' + (t.s ? ' stroke-width="' + f(t.w) + '"' : '') + (t.d ? ' stroke-dasharray="' + t.d.map(f).join(' ') + '"' : '') + (t.o != null && t.o < 1 ? ' opacity="' + t.o + '"' : '');
      let s = '';
      p.teile.forEach((t) => {
        if (t.t === 'poly') s += t.r ? '<rect x="' + f(t.p[0][0]) + '" y="' + f(t.p[0][1]) + '" width="' + f(t.p[1][0] - t.p[0][0]) + '" height="' + f(t.p[2][1] - t.p[1][1]) + '" rx="' + f(t.r) + '"' + st(t) + '/>' : '<path d="M' + pts(t.p) + 'Z"' + st(t) + ' stroke-linejoin="round"/>';
        else if (t.t === 'line') s += '<path d="M' + pts(t.p) + '"' + st(Object.assign({}, t, { f: null })) + ' stroke-linecap="round"/>';
        else if (t.t === 'text') {
          const tr = t.r ? ' transform="rotate(' + t.r + ' ' + f(t.x) + ' ' + f(t.y) + ')"' : '';
          if (t.bg) { const bw = textBreite(t.s, t.g, t.b) + t.g * 0.6, bh = t.g * 1.25; s += '<rect x="' + f(t.x - bw / 2) + '" y="' + f(t.y - bh / 2) + '" width="' + f(bw) + '" height="' + f(bh) + '" rx="' + f(bh / 2) + '" fill="' + t.bg + '"' + tr + '/>'; }
          s += '<text x="' + f(t.x) + '" y="' + f(t.y) + '" font-size="' + f(t.g) + '" font-weight="' + t.b + '" fill="' + t.c + '" text-anchor="' + t.a + '" dominant-baseline="central"' + tr + '>' + escX(t.s) + '</text>';
        }
      });
      return '<svg class="' + (o.cls || 'zeichnung') + '" viewBox="0 0 ' + f(p.b) + ' ' + f(p.h) + '"' + (o.label ? ' role="img" aria-label="' + escX(o.label) + '"' : ' aria-hidden="true"') + ' font-family="Inter, system-ui, sans-serif">' + s + '</svg>';
    }
    const kiChips = (w) => (w.ki ? (w.ki.chips || (w.ki.rows || []).map((r) => r[1])).filter(Boolean).slice(0, 6) : []);
    /* Fensterzeichnung: Rahmen, Flügel, Öffnungssymbole, Sprossen, Oberlicht; Farbe außen als Rahmenfarbe */
    const n1 = (v) => Math.round(v * 10) / 10;
    const R = (x, y, w, h) => 'M' + n1(x) + ' ' + n1(y) + 'h' + n1(w) + 'v' + n1(h) + 'h' + n1(-w) + 'Z';
    const Ln = (...p) => 'M' + p.map((q) => n1(q[0]) + ' ' + n1(q[1])).join('L');
    const path = (d, f, s, sw, da) => '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="' + (s || 'none') + '" stroke-width="' + sw + '"' + (da ? ' stroke-dasharray="' + da + '"' : '') + ' stroke-linejoin="round"></path>';
    function sym(x, y, w, h, t, din, da) {
      let o = '';
      if (t === 'P') t = 'D';
      if (t === 'PS') return sym(x, y, w, h, 'S', din, da) + path(Ln([x, y + h], [x + w / 2, y], [x + w, y + h]), 'none', '#1d1d1f', 0.7, da);
      if (t === 'S') { const d = din === 'L' ? 1 : -1, cx = x + w / 2, cy = y + h * 0.62; return path(Ln([cx - d * w * 0.25, cy], [cx + d * w * 0.25, cy]) + Ln([cx + d * w * 0.25 - d * 2, cy - 2], [cx + d * w * 0.25, cy], [cx + d * w * 0.25 - d * 2, cy + 2]), 'none', '#1d1d1f', 0.9) + path(R(din === 'L' ? x + 1 : x + w - 2.6, y + h * 0.38, 1.6, h * 0.24), '#1d1d1f', 'none', 0); }
      if (t === 'D' || t === 'DK') o += path(din === 'L' ? Ln([x, y], [x + w, y + h / 2], [x, y + h]) : Ln([x + w, y], [x, y + h / 2], [x + w, y + h]), 'none', '#1d1d1f', 0.7, da);
      if (t === 'K' || t === 'DK') o += path(Ln([x, y + h], [x + w / 2, y], [x + w, y + h]), 'none', '#1d1d1f', 0.7, da);
      return o;
    }
    function svg(w, size) {
      const d = derive(w), a = (d.elW || 1000) / (d.elH || 1200), bw = a >= 1 ? 50 : 50 * a, bh = a >= 1 ? 50 / a : 50, bx = (64 - bw) / 2, by = (64 - bh) / 2;
      const fc = farbe(w, 'aussen')[2], gl = '#d6e6f4', da = w.richtung === 'aussen' ? '3 2' : '';
      let o = path(R(bx, by, bw, bh), fc, '#1d1d1f', 1.2);
      const f = Math.max(2, bw * 0.06); let ix = bx + f, iy = by + f; const iw = bw - 2 * f; let ih = bh - 2 * f;
      if (w.ol) { const oh = ih * 0.27; o += path(R(ix, iy, iw, oh), gl, '#1d1d1f', 0.6) + sym(ix, iy, iw, oh, w.olT || 'K', 'L', da); iy += oh + f * 0.7; ih -= oh + f * 0.7; }
      const art = w.art || 'fenster', tuer = istTuer(w);
      if (w.ul && art === 'fenster') { const uh = Math.min(ih * 0.5, Math.max(ih * 0.18, ih * (num(w.ulH) || 400) / (d.elH || 1400))); o += path(R(ix, iy + ih - uh, iw, uh), w.ulA === 'paneel' ? '#c9c9c6' : gl, '#1d1d1f', 0.6); ih -= uh + f * 0.7; }
      const S = w.sashes || sashesFor(w.teilung), n = S.length, gap = tuer ? f * 0.2 : w.teilung === '2s' ? f * 0.25 : f * 0.8, sw = (iw - gap * (n - 1)) / n;
      S.forEach((s, i) => {
        const sx = ix + i * (sw + gap), fest = s.t === 'F' || art === 'fest', g = fest ? 0 : Math.max(1.5, sw * 0.09);
        if (!fest) o += path(R(sx, iy, sw, ih), fc, '#1d1d1f', 0.7);
        const gx = sx + g, gy = iy + g, gw = sw - 2 * g, gh = ih - 2 * g;
        o += path(R(gx, gy, gw, gh), gl, '#1d1d1f', 0.5);
        (w.bars || []).filter((b) => b.s === i).forEach((b) => { o += path(b.d === 'v' ? Ln([gx + gw * b.p, gy], [gx + gw * b.p, gy + gh]) : Ln([gx, gy + gh * b.p], [gx + gw, gy + gh * b.p]), 'none', fc === '#f1f0ea' ? '#b9b4a8' : fc, 1.2); });
        if (s.t !== 'X') o += sym(gx, gy, gw, gh, s.t, s.din, da);
      });
      if (tuer) o += path(R(bx - 1, by + bh - 0.6, bw + 2, 1.6), '#ddd6cb', '#1d1d1f', 0.5);
      return '<svg viewBox="0 0 64 64" width="' + (size || 44) + '" height="' + (size || 44) + '" aria-hidden="true">' + o + '</svg>';
    }
    return { OPT: OPT, TYP: TYP, lab: lab, col: col, farbe: farbe, farbZeile: farbZeile, griffName: griffName, num: num, th: th, mk: mk, derive: derive, rows: rows, kiRows: kiRows, kiChips: kiChips, svg: svg, opening: opening, sonne: sonne, innen: innen, istTuer: istTuer, tuerCfg: tuerCfg, sashesFor: sashesFor,
      OFFEN_TEXT: OFFEN_TEXT, OFFEN_NAME: OFFEN_NAME, istOffen: istOffen, offenGilt: offenGilt, offenListe: offenListe, griffText: griffText, montageText: montageText, rcText: rcText,
      absturzFrage: absturzFrage, absturzText: absturzText, ABSTURZ_MM: ABSTURZ_MM, bruDa: bruDa, foerdWeg: foerdWeg, uwZiel: uwZiel, uwText: uwText, massPruef: massPruef, massZeile: massZeile, ohneFotos: ohneFotos, verhText: verhText, fachZeile: fachZeile, motor: motor, klaerung: klaerung, klaerKurz: klaerKurz,
      /* Strang S5: Aufmaß beim Betrieb und im PDF */
      sartVon: sartVon, kastenAktiv: kastenAktiv, KLAER_GRUPPEN: KLAER_GRUPPEN, klaerGruppen: klaerGruppen, notizenVon: notizenVon, notizGruppe: notizGruppe, massLuecken: massLuecken, wuensche: wuensche, abzugVon: abzugVon, bestellmass: bestellmass, ZF: ZF, plan: plan, zeichnungSVG: zeichnungSVG, textBreite: textBreite };
  })();

  /* ---------- Notizen je Stelle (Strang S1) ----------
     Der Kunde kann an jedem Schritt der App eine Notiz anfügen: am Fenster w.notizen = { <stelle>: text }, auf den Anfrage-Seiten
     am Projekt p.notizen. <stelle> ist der Schlüssel des Schritts ('start', 'fotos', 'messen', 'raender', 'ergebnis' …) bzw. der
     Frage aus der App (qList: 'material', 'fa', 'typ-0' …). Höchstens 500 Zeichen je Notiz. Ältere Aufmaße ohne notizen bleiben
     gültig; notizSauber macht aus allem, was ankommt, ein sauberes Objekt (nur Texte, Schlüssel aus Kleinbuchstaben, Ziffern, -). */
  (function () {
    const NOTIZ_MAX = 500;
    const STELLE = {
      start: 'Start: Stelle und Element', fotos: 'Fotos', zeichnen: 'Lage auf dem Foto', planmasse: 'Wunschmaße', messen: 'Messen', raender: 'Ränder der Öffnung', ergebnis: 'Ergebnis der Maße',
      lage: 'Lage', absturz: 'Absturzsicherung', design: 'Gestaltung', teilung: 'Flügel', material: 'Material', ol: 'Oberlicht', ul: 'Unterlicht', form: 'Form', richtung: 'Öffnungsrichtung',
      felder: 'Felder', hsts: 'Schema der Hebe-Schiebe-Tür', hstr: 'Seite des Schiebeflügels', psks: 'Teile der PSK-Tür', pskr: 'Seite des Schiebeflügels', schwelle: 'Schwelle', boden: 'Fußboden',
      fswn: 'Zahl der Flügel', fsws: 'Faltrichtung', fswg: 'Gehflügel', sprossen: 'Sprossen', spross: 'Sprossenart', aufseite: 'Aufgesetzte Sprossen', breite: 'Sprossenbreite',
      fa: 'Farbe außen', fi: 'Farbe innen', glas: 'Verglasung', glasfn: 'Glas-Extras', orn: 'Ornamentglas', griff: 'Griff', griffa: 'Griff außen', gf: 'Griff-Farbe', rc: 'Einbruchschutz',
      sart: 'Sonnenschutz außen', einbau: 'Kasten des Sonnenschutzes', sfarbe: 'Farbe des Sonnenschutzes', antrieb: 'Antrieb', insekt: 'Insektenschutz', iart: 'Sicht- und Blendschutz innen',
      ifarbe: 'Farbe des Sichtschutzes', fbi: 'Fensterbank innen', fba: 'Fensterbank außen', montage: 'Montage', notiz: 'Notiz',
      anfrage: 'Angaben zum Haus', anfrage2: 'Zeit, Budget und Förderung', anfrage3: 'Kontakt'
    };
    const REIHE = Object.keys(STELLE);
    const schluessel = (k) => String(k || '').trim();
    /* Beschriftung einer Stelle; Flügelfragen tragen die Nummer (typ-0 → Öffnung Flügel 1); sonst der Schlüssel selbst */
    function notizStelle(k) {
      k = schluessel(k);
      const m = /^(typ|din)-(\d{1,2})$/.exec(k);
      if (m) return (m[1] === 'typ' ? 'Öffnung' : 'Scharniere') + ', Flügel ' + (Number(m[2]) + 1);
      return STELLE[k] || STELLE[k.toLowerCase()] || k;
    }
    const rang = (k) => { const m = /^(typ|din)-(\d{1,2})$/.exec(k); const i = REIHE.indexOf(m ? 'teilung' : String(k).toLowerCase()); return (i < 0 ? 999 : i) + (m ? (m[1] === 'din' ? 0.5 : 0.2) + Number(m[2]) / 100 : 0); };
    function notizSauber(o) {
      const out = {};
      if (!o || typeof o !== 'object' || Array.isArray(o)) return out;
      Object.keys(o).slice(0, 80).forEach((k) => {
        const t = typeof o[k] === 'string' ? o[k].replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, NOTIZ_MAX) : '';
        if (t && /^[A-Za-z0-9-]{1,24}$/.test(k)) out[k] = t;
      });
      return out;
    }
    /* Notizen eines Fensters oder Projekts in der Reihenfolge der App: [[Stelle, Text, Schlüssel]] */
    function notizListe(o) {
      const n = notizSauber(o && o.notizen);
      return Object.keys(n).sort((a, b) => rang(a) - rang(b)).map((k) => [notizStelle(k), n[k], k]);
    }
    AW.NOTIZ_MAX = NOTIZ_MAX; AW.notizStelle = notizStelle; AW.notizSauber = notizSauber; AW.notizListe = notizListe;
  })();

  /* ---------- Abrechnung ---------- */
  const Abrechnung = (() => {
    /* Preise netto für Betriebe, brutto für Hauseigentümer; aus /config.js bzw. vom Server (/api/status) überschreibbar */
    const PREISE0 = { aufmass: 7.99, projekt: 9, frei: 3, abo: { grund: 49, inkl: 10, extra: 5 }, plus: 79, mwst: true, freiTage: 14 };
    let PREISE = JSON.parse(JSON.stringify(PREISE0));
    if (typeof window !== 'undefined' && window.KONFIG && window.KONFIG.preise) PREISE = Object.assign({}, PREISE, window.KONFIG.preise, { abo: Object.assign({}, PREISE.abo, window.KONFIG.preise.abo || {}) });
    function setPreise(p) { if (!p) return PREISE; PREISE = Object.assign({}, PREISE, p, { abo: Object.assign({}, PREISE.abo, p.abo || {}) }); return PREISE; }
    const preise = () => PREISE;
    /* Einführungspreis (functions/api/umgebung.js, EINFUEHRUNG): vom Server über /api/status, ohne Server aus /config.js; null, wenn er vorbei ist.
       einfBis() → „17. November“, einfText('aufmass' | 'abo' | 'plus') → „Einführungspreis bis 17. November, danach 12,99 €“; sonst '' */
    let EINF = (typeof window !== 'undefined' && window.KONFIG && window.KONFIG.einfuehrung) || null;
    function setEinfuehrung(e) { EINF = e || null; return EINF; }
    const einfuehrung = () => (EINF && EINF.ende && Date.now() < Date.parse(EINF.ende) ? EINF : null);
    const MONAT = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    /* ganze Tage bis zum Ende, der laufende Tag zählt mit: am 17. November 1 („Nur noch heute“), am 16. November 2 */
    const einfRest = () => { const e = einfuehrung(); return e ? Math.max(1, Math.ceil((Date.parse(e.ende) - Date.now()) / 864e5)) : 0; };
    const einfBis = () => { const e = einfuehrung(); if (!e) return ''; const d = String(e.bis).split('-'); return Number(d[2]) + '. ' + MONAT[Number(d[1]) - 1]; };
    function einfText(k) {
      const e = einfuehrung(), v = e && e.danach ? e.danach[k] : null;
      return v == null ? '' : 'Einführungspreis bis ' + einfBis() + ', danach ' + (Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ',')) + ' €';
    }
    const RANG = { service: 0, abo: 1, plus: 2 };
    const PLAN_NAME = { service: 'Start', abo: 'Abo 10', plus: 'Plus' };
    const planName = (k) => PLAN_NAME[k] || PLAN_NAME.service;
    const konto = (a) => (RANG[a.konto] !== undefined ? a.konto : 'service');
    const NB_MAX = 2, NB_TAGE = 30;
    /* Ab dem ersten Öffnen hat der Kunde 60 Tage Zeit (auch wenn die gewählte Laufzeit kürzer ist); danach schließt der Link,
       der Betrieb kann ihn verlängern */
    const OFFEN_TAGE = 60, VERLAENGERN_TAGE = 30;
    const spaeter = (a, b) => { const x = parseDE(a), y = parseDE(b); return !!x && (!y || x.getTime() > y.getTime()); };
    const two = (n) => String(n).padStart(2, '0');
    const d0 = (now) => new Date(now || Date.now());
    const monthKey = (now) => { const d = d0(now); return d.getFullYear() + '-' + two(d.getMonth() + 1); };
    const monthLabel = (now) => d0(now).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    const monthEnd = (now) => { const d = d0(now), e = new Date(d.getFullYear(), d.getMonth() + 1, 0); return two(e.getDate()) + '.' + two(e.getMonth() + 1) + '.' + e.getFullYear(); };
    const stamp = (now) => { const d = d0(now); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '., ' + two(d.getHours()) + ':' + two(d.getMinutes()); };
    const datum = (now) => { const d = d0(now); return two(d.getDate()) + '.' + two(d.getMonth() + 1) + '.' + d.getFullYear(); };
    const dateIn = (days, now) => { const d = d0(now); d.setDate(d.getDate() + days); return datum(d.getTime()); };
    const parseDE = (s) => { const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(s || '').trim()); return m ? new Date(+m[3], +m[2] - 1, +m[1], 23, 59, 59) : null; };
    const hashN = (s) => String(s).split('').reduce((x, c) => (x * 31 + c.charCodeAt(0)) >>> 0, 7);
    const nW = (n, one, many) => n + ' ' + (n === 1 ? one : many);
    /* Link-Code: 10 Zeichen aus a–z und 0–9 (rund 3,6 Billiarden Möglichkeiten), damit niemand fremde Links errät; ältere Links
       mit 5 Zeichen bleiben gültig */
    const ZEICHEN = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const newCode = () => { const z = new Uint8Array(10); if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(z); else for (let i = 0; i < 10; i++) z[i] = Math.floor(Math.random() * 256); let c = ''; for (let i = 0; i < 10; i++) c += ZEICHEN[z[i] % 36]; return c; };
    const newId = (p) => (p || 'l') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    function nextNr(a, now) { const y = d0(now).getFullYear(), mx = (a.links || []).reduce((m, l) => { const k = /-(\d+)$/.exec(l.nr || ''); return k ? Math.max(m, +k[1]) : m; }, 0); return 'P-' + y + '-' + String(mx + 1).padStart(3, '0'); }
    const normTel = (t) => { let d = String(t || '').replace(/\D/g, ''); if (d.startsWith('0049')) d = '0' + d.slice(4); else if (d.startsWith('49') && d.length > 10) d = '0' + d.slice(2); return d; };
    const normFirma = (n) => String(n || '').toLowerCase().replace(/\b(gmbh|ug|gbr|kg|ohg|e\.?\s?k\.?|inh\.?|&\s?co\.?)\b/g, '').replace(/[^a-z0-9äöüß]/g, '');

    /* ---------- Aufmaß-Code aus der App lesen ---------- */
    function unpack(code) {
      try {
        const m = /(?:AM1|ZF1|FE1|LM1)\.([A-Za-z0-9_-]+)/.exec(String(code || '').replace(/\s+/g, '')); if (!m) return null;
        const b = m[1].replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const text = new TextDecoder().decode(bytes), ende = text.lastIndexOf('}'); const o = JSON.parse(ende > 0 ? text.slice(0, ende + 1) : text);
        return o && Array.isArray(o.w) ? o : null;
      } catch (e) { return null; }
    }
    /* Fenster aus der App vollständig übernehmen: gleiche Felder, fehlende Werte sind App-Standard */
    const fromApp = (w) => AW.mk(Object.assign({}, w, { name: w.name || 'Fenster' }, w && w.notizen ? { notizen: AW.notizSauber(w.notizen) } : {})); // Notizen je Stelle nur als saubere Texte
    function fingerprint(o) { try { return hashN(JSON.stringify([o.w, o.p])); } catch (e) { return 0; } }
    function fromAppProj(p) { p = p || {}; const fw = AW.OPT.foerdweg[p.foerdweg] ? p.foerdweg : ''; return { gebaeude: p.gebaeude || '', baujahr: p.baujahr || '', total: AW.num(p.total) || 0, zeit: p.zeit || '', budget: p.budget || '', foerd: !!p.foerd || fw === 'bafa' || fw === 'steuer', foerdweg: fw, notiz: String(p.notiz || '').replace(/\s+/g, ' ').trim().slice(0, 600), notizen: AW.notizSauber(p.notizen) }; }
    const aufmassOf = (wins, proj) => ({ windows: wins, proj: proj, fotos: wins.reduce((s, w) => s + (w.fotos || 0), 0), elemente: wins.reduce((s, w) => s + (AW.num(w.anzahl) || 1), 0) });

    /* ---------- Buchungen ----------
       1. Gebucht wird beim ersten Eingang je Projekt, zum Tarif, der in diesem Moment gilt; Nachbesserungen im selben Projekt kosten nichts. Eine Buchung wird nie geändert oder gelöscht.
       2. Start: die ersten 3 Projekte je Betrieb frei (zählt über die Buchungen), danach 9 € je Projekt, nur mit Zahlungsart.
       3. Abo 10: 49 € im Monat, 10 Projekte im Kalendermonat inklusive, jedes weitere 5 €. Plus: 79 € im Monat, unbegrenzt.
       4. Ohne Zahlungsart bleibt ein kostenpflichtiges Aufmaß gesperrt: es kommt an, wird gespeichert, die Maße bleiben verborgen, bis eine Zahlungsart da ist. */
    const freeQuota = (a) => (a.freeQuota != null ? a.freeQuota : PREISE.frei);
    function ledger(a) {
      if (!a.book) { a.book = []; a.freeUsed = 0; (a.links || []).slice().reverse().filter((l) => l.status === 'eingegangen' && !l.demo).forEach((l) => { l.locked = !bookAufmass(a, l); }); }
      return a.book;
    }
    const freeLeft = (a) => { ledger(a); return Math.max(0, freeQuota(a) - (a.freeUsed || 0)); };
    const lockedLinks = (a) => (a.links || []).filter((l) => l.status === 'eingegangen' && l.locked && !l.demo);
    const aboGenutzt = (a, now) => { const k = monthKey(now); return ledger(a).filter((b) => b.kind === 'aufmass' && b.inkl && b.month === k).length; };
    const aboFrei = (a, now) => Math.max(0, PREISE.abo.inkl - aboGenutzt(a, now));
    function bookAufmass(a, l, extra, now) {
      const book = a.book || (a.book = []), ref = extra ? l.id + '#' + extra : l.id;
      if (book.some((b) => b.kind === 'aufmass' && b.ref === ref)) return true;
      const am = l.aufmass || {}, sub = [((l.log || {}).eingegangen || stamp(now)), l.nr, am.windows ? nW(am.windows.length, 'Position', 'Positionen') : '', extra ? 'anderes Aufmaß in Runde ' + extra : ''].filter(Boolean).join(' · ');
      let betrag = 0, badge, inkl = false;
      const k = konto(a);
      if (k === 'plus') badge = 'inklusive (Plus)';
      else if (k === 'abo') {
        const genutzt = aboGenutzt(a, now);
        if (genutzt < PREISE.abo.inkl) { badge = 'inklusive (Abo, ' + (genutzt + 1) + ' von ' + PREISE.abo.inkl + ')'; inkl = true; }
        else if (a.pay) { betrag = PREISE.abo.extra; badge = 'nächste Rechnung, über dem Kontingent'; }
        else return false;
      } else if (freeQuota(a) - (a.freeUsed || 0) > 0) { a.freeUsed = (a.freeUsed || 0) + 1; badge = 'kostenlos, ' + a.freeUsed + ' von ' + freeQuota(a); }
      else if (a.pay) { betrag = PREISE.projekt; badge = 'nächste Rechnung'; }
      else return false;
      book.unshift({ id: newId('b'), kind: 'aufmass', ref: ref, when: stamp(now), month: monthKey(now), text: 'Aufmaß · ' + l.kunde, sub: sub, betrag: betrag, badge: badge, status: 'offen', inkl: inkl });
      return true;
    }
    /* Ein Aufmaß kommt an: speichern, buchen oder sperren; Rückgabe sagt, ob es sichtbar ist, und was dem Betrieb gemeldet wird */
    function receiveAufmass(a, l, aufmass, via, now) {
      ledger(a);
      l.status = 'eingegangen'; l.progress = 4; l.via = l.via || via || 'Code'; l.log = l.log || {}; l.log.eingegangen = stamp(now); l.eingegangenAt = now || Date.now(); l.aufmass = aufmass; l.stage = 'neu'; l.runde = l.runde || 1;
      l.locked = l.demo ? false : !bookAufmass(a, l, null, now);
      const size = nW(aufmass.windows.length, 'Position', 'Positionen') + ' mit ' + nW(aufmass.fotos || 0, 'Foto', 'Fotos');
      return { ok: !l.locked, notif: l.locked ? { t: 'Aufmaß eingegangen: ' + l.kunde, s: size + '. Zum Ansehen eine Zahlungsart hinterlegen; Ihre kostenlosen Aufmaße sind verbraucht.', to: ['link', l.id] } : { t: 'Aufmaß eingegangen: ' + l.kunde, s: size + '. ' + (l.nr || ''), to: ['link', l.id] } };
    }
    /* Nach Zahlungsart oder Tarifwechsel: wartende Aufmaße freischalten, ältestes zuerst */
    function unlockWaiting(a, now) { let n = 0; lockedLinks(a).slice().reverse().forEach((l) => { if (bookAufmass(a, l, null, now)) { l.locked = false; n++; } }); return n; }
    function bookPlan(a, k, now) {
      const key = monthKey(now), preis = k === 'plus' ? PREISE.plus : PREISE.abo.grund;
      const schon = ledger(a).filter((b) => (b.kind === 'plus' || b.kind === 'abo') && b.month === key);
      /* aboBezahlt (nur auf dem Server): bis zu diesem Monat hat Stripe das Abo bezahlt gemeldet, auch wenn die Meldung vor der Buchung kam */
      if (!schon.length) { const bez = !!a.aboBezahlt && key <= a.aboBezahlt; a.book.unshift({ id: newId('p'), kind: k, month: key, when: stamp(now), text: planName(k) + ' · ' + monthLabel(now), sub: 'monatlich, bis ' + monthEnd(now) + ', monatlich kündbar', betrag: preis, badge: bez ? 'bezahlt' : 'nächste Rechnung', status: bez ? 'bezahlt' : 'offen' }); return; }
      /* im selben Monat von Abo 10 auf Plus: nur der Aufpreis */
      if (k === 'plus' && !schon.some((b) => b.kind === 'plus')) a.book.unshift({ id: newId('p'), kind: 'plus', month: key, when: stamp(now), text: 'Plus · ' + monthLabel(now) + ', Aufpreis', sub: 'Wechsel von Abo 10, bis ' + monthEnd(now), betrag: Math.max(0, PREISE.plus - PREISE.abo.grund), badge: 'nächste Rechnung', status: 'offen' });
    }
    /* Tarif wechseln: nach oben sofort (Monat wird gebucht), nach unten zum Monatsende vorgemerkt. Rückgabe: was passiert ist */
    function planWechsel(a, k, now) {
      const alt = konto(a); k = RANG[k] !== undefined ? k : 'service';
      if (k === alt) { if (a.downgrade) { a.downgrade = null; return { art: 'bleibt', msg: planName(k) + ' läuft weiter' }; } return { art: 'gleich', msg: planName(k) + ' ist schon Ihr Tarif' }; }
      if (RANG[k] > RANG[alt]) {
        if (!a.pay && k !== 'service') return { art: 'zahlungsart', msg: 'Für ' + planName(k) + ' brauchen wir eine Zahlungsart.' };
        const key = monthKey(now), aufpreis = k === 'plus' && ledger(a).some((b) => b.kind === 'abo' && b.month === key) && !ledger(a).some((b) => b.kind === 'plus' && b.month === key);
        a.konto = k; a.downgrade = null; bookPlan(a, k, now); const n = unlockWaiting(a, now);
        return { art: 'aktiv', n: n, msg: planName(k) + ' aktiv, ' + (aufpreis ? 'Aufpreis ' + (PREISE.plus - PREISE.abo.grund) : (k === 'plus' ? PREISE.plus : PREISE.abo.grund)) + ' € für ' + monthLabel(now) + (n ? '. ' + nW(n, 'Aufmaß', 'Aufmaße') + ' freigeschaltet' : '') };
      }
      a.downgrade = { to: k, at: monthEnd(now) };
      return { art: 'vorgemerkt', msg: 'Vorgemerkt: ' + planName(alt) + ' läuft bis ' + monthEnd(now) + ', danach ' + planName(k) };
    }
    /* Beim Start und einmal pro Minute: was die Zeit erledigt. Rückgabe: Meldungen für den Betrieb */
    function tickKonto(a, now) {
      now = now || Date.now(); const out = []; let dirty = false;
      if (a.downgrade) { const d = parseDE(a.downgrade.at); if (d && now > d.getTime()) { const alt = konto(a); a.konto = a.downgrade.to; a.downgrade = null; dirty = true; out.push({ t: 'Tarif gewechselt', s: planName(alt) + ' ist ausgelaufen, wie vorgemerkt. Jetzt: ' + planName(konto(a)) + '.', to: ['abrechnung'] }); } }
      if ((konto(a) === 'plus' || konto(a) === 'abo') && a.pay && !ledger(a).some((b) => (b.kind === 'plus' || b.kind === 'abo') && b.month === monthKey(now))) { bookPlan(a, konto(a), now); dirty = true; }
      (a.links || []).forEach((l) => { if (['erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)) { const d = parseDE(l.expires); if (d && now > d.getTime()) { l.status = 'abgelaufen'; l.log = l.log || {}; l.log.abgelaufen = l.expires; dirty = true; } } });
      return { dirty: dirty, notifs: out };
    }

    /* ---------- Nachbesserung: gleiche Position = gleicher Name oder gleiche Maße (±3 %). Ohne jede Überschneidung ist es ein anderes Aufmaß. ---------- */
    const nahMm = (x, y) => x && y && Math.abs(x - y) <= Math.max(30, 0.03 * Math.max(x, y));
    function passt(alt, neu) { const da = AW.derive(alt), dn = AW.derive(neu); return (!!neu.name && !!alt.name && neu.name.trim().toLowerCase() === alt.name.trim().toLowerCase()) || (nahMm(dn.elW || dn.moW, da.elW || da.moW) && nahMm(dn.elH || dn.moH, da.elH || da.moH)); }
    function ueberschneidung(alt, neu) { const A0 = (alt && alt.windows) || [], N0 = (neu && neu.windows) || []; if (!A0.length || !N0.length) return 1; return N0.filter((n) => A0.some((x) => passt(x, n))).length / N0.length; }
    function nbMoeglich(l, now) {
      if (!l || l.status !== 'eingegangen' || l.locked || l.demo) return '';
      if ((l.runde || 1) > NB_MAX) return 'Zwei Nachbesserungen sind das Maximum. Für mehr legen Sie ein neues Projekt an.';
      if (l.eingegangenAt && (now || Date.now()) - l.eingegangenAt > NB_TAGE * 864e5) return 'Eine Nachbesserung ist bis ' + NB_TAGE + ' Tage nach dem Eingang möglich.';
      return 'ok';
    }
    function nbAnfragen(l, hinweis, now) {
      const ok = nbMoeglich(l, now); if (ok !== 'ok') return { ok: false, msg: ok || 'Keine Nachbesserung möglich.' };
      l.nb = { runde: (l.runde || 1) + 1, hinweis: String(hinweis || '').trim().slice(0, 300), when: stamp(now), offen: true };
      l.msg = ''; l.expires = dateIn(PREISE.freiTage || 14, now); l.log = l.log || {}; l.log.nbangefragt = stamp(now);
      return { ok: true, msg: 'Nachbesserung angefragt. Jetzt den Link noch einmal an ' + l.kunde + ' schicken.' };
    }
    function nbZurueck(l) { if (l && l.nb) { l.nb.offen = false; l.msg = ''; } return { ok: true, msg: 'Nachbesserung zurückgezogen. Das bisherige Aufmaß bleibt.' }; }

    /* ---------- Projekte anlegen ---------- */
    function neuesProjekt(a, f, now) {
      f = f || {}; const days = [7, 14, 30].includes(+f.days) ? +f.days : 14, codes = (a.links || []).map((l) => l.code);
      let code = newCode(); while (codes.includes(code)) code = newCode();
      const l = { id: newId('l'), code: code, nr: nextNr(a, now), kunde: String(f.kunde || '').trim().slice(0, 60), kontakt: String(f.kontakt || '').trim().slice(0, 80), adresse: String(f.adresse || '').trim().slice(0, 120), geb: String(f.geb || '').slice(0, 20), fz: String(f.fz || '').slice(0, 20), plan: Array.isArray(f.plan) ? f.plan.slice(0, 8).map((x) => String(x).slice(0, 30)) : [], note: String(f.note || '').trim().slice(0, 600), created: datum(now), days: days, expires: dateIn(days, now), status: 'erstellt', progress: 0, via: '', du: !!f.du, log: { erstellt: stamp(now) } };
      if (l.kunde.length < 2) return { ok: false, msg: 'Bitte einen Namen eingeben, zum Beispiel „Familie Weber“.' };
      a.links = a.links || []; a.links.unshift(l);
      return { ok: true, l: l };
    }
    function listeProjekte(a, text, du, now) {
      const zeilen = String(text || '').split(/\n+/).map((z) => z.trim()).filter(Boolean).slice(0, 50), neu = [];
      zeilen.forEach((z) => { const teile = z.split(/[;,\t]/).map((t) => t.trim()).filter(Boolean); const kunde = teile[0] || '', kontakt = teile.slice(1).find((t) => /@/.test(t) || t.replace(/\D/g, '').length >= 6) || ''; if (kunde.length < 2) return; const r = neuesProjekt(a, { kunde: kunde, kontakt: kontakt, plan: ['Fenster'], note: 'aus Einladungsliste', days: 14, du: du }, now); if (r.ok) neu.push(r.l); });
      return neu;
    }
    /* Markierungen am Projekt: gesendet, Anrede, Laufzeit, Stand, Notizen, deaktivieren */
    function projektAendern(l, p, now) {
      if (!l) return { ok: false, msg: 'Projekt nicht gefunden.' };
      if (p.gesendet && l.status === 'erstellt') { l.status = 'gesendet'; l.via = String(p.via || 'Link').slice(0, 30); l.log = l.log || {}; l.log.gesendet = stamp(now); }
      if (p.du !== undefined) { l.du = !!p.du; l.msg = ''; }
      if (p.days && [7, 14, 30].includes(+p.days)) { l.days = +p.days; const bis = dateIn(+p.days, now); if (!l.offenAm || spaeter(bis, l.expires)) l.expires = bis; } // geöffnet: die 60 Tage nie verkürzen
      if (p.verlaengern) {
        if (!['abgelaufen', 'erstellt', 'gesendet', 'geoeffnet', 'arbeit'].includes(l.status)) return { ok: false, msg: 'Dieser Link lässt sich nicht verlängern.' };
        l.expires = dateIn(VERLAENGERN_TAGE, now); l.log = l.log || {};
        if (l.status === 'abgelaufen') { l.status = l.log.arbeit ? 'arbeit' : l.log.geoeffnet ? 'geoeffnet' : l.log.gesendet ? 'gesendet' : 'erstellt'; l.log.verlaengert = stamp(now); }
        return { ok: true, msg: 'Der Link gilt jetzt bis ' + l.expires + '.' };
      }
      if (p.stage && ['neu', 'angebot', 'termin', 'auftrag', 'verloren'].includes(p.stage)) l.stage = p.stage;
      if (p.note !== undefined) l.note = String(p.note).slice(0, 600);
      if (p.memo !== undefined) l.memo = String(p.memo).slice(0, 600);
      /* Klärungsliste abarbeiten (Strang S5): ein Punkt je Aufruf, { id, ok, notiz }; ohne Haken und Notiz fällt er wieder weg */
      if (p.klaer && typeof p.klaer === 'object') {
        const id = String(p.klaer.id || ''), notiz = String(p.klaer.notiz || '').replace(/\s+/g, ' ').trim().slice(0, 300);
        if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return { ok: false, msg: 'Diesen Punkt gibt es nicht.' };
        l.klaer = l.klaer && typeof l.klaer === 'object' ? l.klaer : {};
        if (p.klaer.ok || notiz) l.klaer[id] = { ok: !!p.klaer.ok, notiz: notiz, wann: stamp(now) }; else delete l.klaer[id];
        const ks = Object.keys(l.klaer); if (ks.length > 300) ks.slice(0, ks.length - 300).forEach((k) => delete l.klaer[k]);
      }
      if (p.msg !== undefined) l.msg = String(p.msg).slice(0, 1500);
      if (p.seen) l.seen = true;
      if (p.deaktivieren) { if (l.status === 'eingegangen') return { ok: false, msg: 'Ein eingegangenes Aufmaß bleibt im Projekt und in der Abrechnung' }; l.status = 'deaktiviert'; l.deaktiviertAm = now || Date.now(); }
      if (p.nb) return nbAnfragen(l, p.nb.hinweis, now);
      if (p.nbZurueck) return nbZurueck(l);
      return { ok: true };
    }

    /* ---------- Eingang eines Aufmaß-Codes (aus der App direkt oder eingefügt): neues Projekt, Nachbesserung oder Teil-Nachbesserung ---------- */
    function importCode(a, o, now, via) {
      now = now || Date.now(); a.links = a.links || [];
      if (!o || !Array.isArray(o.w)) return { ok: false, art: 'fehler', msg: 'Code nicht lesbar. Bitte komplett kopieren, er beginnt mit AM1.' };
      let l = o.b ? a.links.find((x) => x.code === o.b) : null;
      if (o.b && !l) return { ok: false, art: 'fremd', msg: 'Dieser Code gehört zu keinem Ihrer Projekte.' };
      if (l && l.status === 'eingegangen' && !(l.nb && l.nb.offen && (o.r || 1) >= l.nb.runde)) return { ok: false, art: 'schon', l: l, msg: l.nb && l.nb.offen ? 'Dieser Code ist noch die alte Fassung. Der Kunde muss das Aufmaß über den Nachbesserungs-Link erneut abschicken.' : 'Dieses Aufmaß ist schon eingegangen. Für eine Korrektur fragen Sie im Projekt eine Nachbesserung an.' };
      if (l && l.status === 'eingegangen') {
        const fp2 = fingerprint(o), wins2 = (o.w || []).map(fromApp), am2 = aufmassOf(wins2, fromAppProj(o.p || {})); am2.fp = fp2;
        const q = ueberschneidung(l.aufmass, am2), neu = q === 0, gleich = !!(l.aufmass && l.aufmass.fp === fp2);
        (l.vorher = l.vorher || []).push({ runde: l.runde || 1, when: (l.log || {}).eingegangen || '', aufmass: l.aufmass });
        /* Kunde ohne gespeicherte Angaben (anderes Gerät) schickt nur die betroffenen Fenster: passende Positionen ersetzen, übrige behalten */
        if (o.m && !neu && l.aufmass && l.aufmass.windows) { const alt = l.aufmass.windows, rest = alt.filter((x) => !wins2.some((w) => passt(x, w))); am2.windows = rest.concat(wins2); am2.fotos = am2.windows.reduce((s2, w) => s2 + (w.fotos || 0), 0); am2.elemente = am2.windows.reduce((s2, w) => s2 + (AW.num(w.anzahl) || 1), 0); am2.proj = Object.assign({}, l.aufmass.proj || {}, am2.proj || {}); }
        l.aufmass = am2; l.runde = l.nb.runde; l.nb.offen = false; l.nb.fertig = stamp(now); l.log = l.log || {}; l.log.nachbesserung = stamp(now); l.seen = false; l.stage = l.stage === 'verloren' ? 'neu' : l.stage;
        if (neu) { l.locked = !bookAufmass(a, l, l.runde, now); return { ok: true, art: 'nb-neu', l: l, feier: 'eingang', msg: 'Übernommen. Das ist ein anderes Aufmaß, es wurde als neues gebucht.', notif: { t: 'Anderes Aufmaß in Projekt ' + (l.nr || ''), s: 'Die Nachbesserung hat keine Position mit dem bisherigen Aufmaß gemeinsam und wurde wie ein neues Aufmaß gebucht.', to: ['link', l.id] } }; }
        return { ok: true, art: 'nb', l: l, feier: 'eingang', msg: gleich ? 'Nachbesserung übernommen, der Kunde hat nichts geändert. Nichts berechnet.' : (o.m ? 'Nachbesserung ergänzt, nichts berechnet: ' : 'Nachbesserung übernommen, nichts berechnet: ') + l.kunde, notif: { t: 'Nachbesserung eingegangen: ' + l.kunde, s: nW(wins2.length, 'Position', 'Positionen') + ', Runde ' + l.runde + '. Nichts berechnet.', to: ['link', l.id] } };
      }
      if (l && l.status === 'deaktiviert') return { ok: false, art: 'deaktiviert', l: l, msg: 'Dieser Link wurde deaktiviert. Für ein neues Aufmaß legen Sie ein neues Projekt an.' };
      const fp = fingerprint(o), schon = a.links.find((x) => x.aufmass && x.aufmass.fp === fp);
      if (schon) return { ok: false, art: 'doppelt', l: schon, msg: 'Dieses Aufmaß ist schon da: ' + schon.kunde };
      const war = l && l.status === 'abgelaufen', wins = (o.w || []).map(fromApp), p = o.p || {};
      if (!l) { l = { id: newId('l'), code: newCode(), nr: nextNr(a, now), kunde: String(p.name || 'Kunde ohne Projekt').slice(0, 60), kontakt: String(p.tel || p.mail || '').slice(0, 80), adresse: String(p.ort || '').slice(0, 120), geb: '', fz: '', plan: [], note: 'direkt vom Kunden, per Code übernommen', created: datum(now), expires: dateIn(14, now), status: 'gesendet', progress: 0, via: 'Code', du: false, log: { erstellt: stamp(now), gesendet: stamp(now) } }; a.links.unshift(l); }
      l.seen = false; l.log = l.log || {}; l.log.gesendet = l.log.gesendet || stamp(now); l.log.geoeffnet = l.log.geoeffnet || stamp(now); l.log.arbeit = l.log.arbeit || stamp(now);
      const am = aufmassOf(wins, fromAppProj(p)); am.fp = fp;
      const r = receiveAufmass(a, l, am, via || 'Code', now);
      return { ok: true, art: 'neu', l: l, feier: r.ok ? 'eingang' : '', locked: !r.ok, notif: r.notif, msg: r.ok ? (war ? 'Link war abgelaufen, Aufmaß trotzdem übernommen: ' : 'Aufmaß übernommen: ') + l.kunde : 'Aufmaß übernommen. Zum Ansehen Zahlungsart hinterlegen' };
    }
    /* Fortschritt aus der App (Link geöffnet, misst): ohne Buchung */
    /* Rückgabe: 'geoeffnet' (zum ersten Mal geöffnet), 'arbeit', 'frist' (nur die 60-Tage-Frist gesetzt) oder false */
    function fortschritt(l, stufe, k, now) {
      if (!l || ['eingegangen', 'deaktiviert', 'abgelaufen'].includes(l.status) || linkZu(l, now)) return false; // auch abgelaufen, bevor die Zeit angewendet wurde
      l.log = l.log || {};
      let frist = false;
      if (!l.offenAm && (stufe === 'geoeffnet' || stufe === 'arbeit')) { l.offenAm = datum(now); const bis = dateIn(OFFEN_TAGE, now); if (spaeter(bis, l.expires)) l.expires = bis; frist = true; }
      if (stufe === 'geoeffnet' && ['erstellt', 'gesendet'].includes(l.status)) { l.status = 'geoeffnet'; l.log.geoeffnet = stamp(now); return 'geoeffnet'; }
      if (stufe === 'arbeit') { if (l.status !== 'arbeit') { l.status = 'arbeit'; l.log.arbeit = stamp(now); } l.progress = Math.max(l.progress || 0, Math.min(4, +k || 0)); return 'arbeit'; }
      return frist ? 'frist' : false;
    }
    /* Ist der Link für den Kunden zu? Abgelaufen (auch wenn tickKonto noch nicht lief), deaktiviert oder schon eingegangen ohne
       offene Nachbesserung */
    function linkZu(l, now) {
      if (!l) return 'fehlt';
      if (l.status === 'deaktiviert') return 'deaktiviert';
      if (l.status === 'eingegangen') return l.nb && l.nb.offen ? '' : 'eingegangen';
      if (l.status === 'abgelaufen') return 'abgelaufen';
      const d = parseDE(l.expires); if (d && (now || Date.now()) > d.getTime()) return 'abgelaufen';
      return '';
    }

    return { preise: preise, setPreise: setPreise, einfuehrung: einfuehrung, setEinfuehrung: setEinfuehrung, einfBis: einfBis, einfRest: einfRest, einfText: einfText, planName: planName, konto: konto, RANG: RANG, NB_MAX: NB_MAX, NB_TAGE: NB_TAGE, OFFEN_TAGE: OFFEN_TAGE, VERLAENGERN_TAGE: VERLAENGERN_TAGE, monthKey: monthKey, monthLabel: monthLabel, monthEnd: monthEnd, stamp: stamp, datum: datum, dateIn: dateIn, parseDE: parseDE, hashN: hashN, nW: nW, newCode: newCode, newId: newId, nextNr: nextNr, normTel: normTel, normFirma: normFirma,
      unpack: unpack, fromApp: fromApp, fingerprint: fingerprint, fromAppProj: fromAppProj, aufmassOf: aufmassOf,
      freeQuota: freeQuota, ledger: ledger, freeLeft: freeLeft, lockedLinks: lockedLinks, aboGenutzt: aboGenutzt, aboFrei: aboFrei, bookAufmass: bookAufmass, receiveAufmass: receiveAufmass, unlockWaiting: unlockWaiting, bookPlan: bookPlan, planWechsel: planWechsel, tickKonto: tickKonto,
      passt: passt, ueberschneidung: ueberschneidung, nbMoeglich: nbMoeglich, nbAnfragen: nbAnfragen, nbZurueck: nbZurueck, neuesProjekt: neuesProjekt, listeProjekte: listeProjekte, projektAendern: projektAendern, importCode: importCode, fortschritt: fortschritt, linkZu: linkZu };
  })();

  return { AW: AW, Abrechnung: Abrechnung };
});

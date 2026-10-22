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
    const kastenAktiv = (w) => w.sart === 'rollladen' || w.sart === 'raffstore' || w.sart === 'screen';
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
    /* ---------- Klärungsliste: oben auf dem Blatt und im Betriebsbereich ----------
       Was der Fensterbauer vor dem Angebot mit dem Kunden klären muss: Pflichtthemen, Förderweg, Abweichungen und offene Wünsche.
       Neutral formuliert, damit derselbe Text beim Kunden (Du) und beim Betrieb (Sie) passt. Rückgabe [{ k, v, art }]. */
    function klaerung(wins, p) {
      wins = wins || []; p = p || {};
      const out = [], pos = (w, i) => 'Pos. ' + (i + 1) + (w.name ? ' ' + w.name : ''), dazu = (k, v, art, kurz, i) => out.push({ k: k, v: v, art: art, kurz: kurz, pos: i == null ? null : i });
      const bruText = (w) => (istTuer(w) ? ', bodentief' : bruDa(w) ? (num(w.bru) ? ', Brüstung ' + th(w.bru) + ' mm' : ', bodentief') : (w.ki && w.ki.fach && w.ki.fach.bruestung === 'bodentief' ? ', bodentief laut Foto' : ', niedrige Brüstung laut Foto'));
      wins.forEach((w, i) => { if (absturzFrage(w) && w.absturz !== 'balkon') dazu(pos(w, i), 'Absturzsicherung nötig (' + (lab('etage', w.etage) || 'OG') + bruText(w) + '): ' + (w.absturz ? lab('absturz', w.absturz) : 'bitte beraten'), 'pflicht', 'Absturzsicherung', i); });
      const nE = wins.reduce((a, x) => a + (num(x.anzahl) || 1), 0), tot = num(p.total);
      if (tot && nE > tot / 3) dazu('Lüftung', 'Lüftungskonzept nach DIN 1946-6 erforderlich: ' + nE + ' von ' + tot + ' Fenstern werden getauscht, mehr als ein Drittel.', 'pflicht', 'Lüftungskonzept');
      wins.forEach((w, i) => { if (w.neu) dazu(pos(w, i), 'Neue Öffnung: Sturz und Statik vor dem Durchbruch klären.', 'pflicht', 'Sturz und Statik', i); });
      /* Ohne Fotos: Positionen in einer Zeile, damit ein Aufmaß ganz ohne Fotos die Liste nicht füllt */
      const ohne = []; wins.forEach((w, i) => { if (ohneFotos(w)) ohne.push(i); });
      if (ohne.length) dazu(ohne.length === wins.length && wins.length > 1 ? 'Alle Positionen' : ohne.length === 1 ? pos(wins[ohne[0]], ohne[0]) : 'Pos. ' + ohne.map((i) => i + 1).join(', '), 'Ohne Fotos erfasst: Einbausituation (Rollladenkasten, Laibung, Fensterbänke, Fassade)' + (ohne.some((i) => wins[i].neu) ? ' und Lage der neuen Öffnung' : '') + ' vor Ort aufnehmen.', 'pruefen', 'Ohne Fotos', ohne.length === 1 ? ohne[0] : ohne);
      const fw = foerdWeg(p);
      if (fw === 'bafa') dazu('Förderung', 'BAFA-Zuschuss gewünscht: Energieeffizienz-Experte einbinden, Antrag vor Beginn, Vertrag nur mit Förderklausel. Uw-Zielwerte bei den Positionen.', 'foerder', 'Förderung BAFA');
      else if (fw === 'steuer') dazu('Förderung', 'Steuerbonus nach § 35c EStG gewünscht: Bescheinigung nach amtlichem Muster vom Fachbetrieb. Uw-Zielwerte bei den Positionen.', 'foerder', 'Steuerbonus');
      else if (fw === 'offen') dazu('Förderung', 'Noch offen: BAFA-Zuschuss oder Steuerbonus, vor dem Auftrag klären.', 'foerder', 'Förderweg');
      /* 2-fach erreicht etwa Uw 1,1 bis 1,3: bei den strengen Zielwerten (0,95 und 1,1) ein Hinweis, im Baudenkmal (1,4 und 1,6) nicht */
      if (fw === 'bafa' || fw === 'steuer') wins.forEach((w, i) => { const z = uwZiel(w, p); if (w.glas === '2' && !istOffen(w, 'glas') && z && z.wert < 1.3) dazu(pos(w, i), '2-fach-Glas gewählt: Für die Förderung braucht es ' + uwText(uwZiel(w, p)).replace(/ \(.*\)$/, '') + ', das schafft praktisch nur 3-fach-Glas.', 'foerder', 'Glas für die Förderung', i); });
      wins.forEach((w, i) => { const m = massPruef(w); if (m) dazu(pos(w, i), (m.typ === 'tausch' ? 'Breite und Höhe laut Foto vertauscht?' : 'Seitenverhältnis laut Foto weicht von den Maßen ab.') + (w.massOk ? ' Die Maße sind bestätigt.' : '') + ' Beim Feinaufmaß prüfen.', 'pruefen', 'Maße prüfen', i); });
      wins.forEach((w, i) => { if (motor(w) && !(w.ki && w.ki.fach && w.ki.fach.strom === true)) dazu(pos(w, i), 'Elektrischer Antrieb gewünscht: Strom am Fenster ' + (w.ki && w.ki.fach && w.ki.fach.strom === false ? 'laut Foto nicht zu sehen' : 'klären') + ', gegebenenfalls Elektriker einplanen.', 'pruefen', 'Strom für den Antrieb', i); });
      /* Faserzement laut Foto: bis 1993 enthielt er oft Asbest, vor dem Ausbau prüfen lassen */
      wins.forEach((w, i) => { const f = (w.ki && w.ki.fach) || {}, wo = [f.fbi === 'faserzement' ? 'innen' : '', f.fba === 'faserzement' ? 'außen' : ''].filter(Boolean); if (wo.length) dazu(pos(w, i), 'Fensterbank ' + wo.join(' und ') + ' laut Foto aus Faserzement: vor dem Ausbau auf Asbest prüfen (bis 1993 verbaut).', 'pruefen', 'Asbest prüfen', i); });
      wins.forEach((w, i) => { if (w.erreichbar === 'ja' && w.rc !== 'rc2' && !istOffen(w, 'rc')) dazu(pos(w, i), 'Leicht erreichbar, gewählt ' + (lab('rc', w.rc) || 'Basisschutz') + ': Die Polizei empfiehlt RC2.', 'hinweis', 'Einbruchschutz RC2', i); });
      /* Offene Wünsche: Positionen mit derselben Liste zusammen */
      const gruppen = [];
      wins.forEach((w, i) => { const l = offenListe(w).map((k) => OFFEN_NAME[k]); if (!l.length) return; const key = l.join(', '), g = gruppen.find((x) => x.key === key); if (g) g.i.push(i); else gruppen.push({ key: key, i: [i] }); });
      gruppen.forEach((g) => { const alle = g.i.length === wins.length && wins.length > 1; dazu(alle ? 'Alle Positionen' : g.i.length === 1 ? pos(wins[g.i[0]], g.i[0]) : 'Pos. ' + g.i.map((i) => i + 1).join(', '), g.key + ': ' + OFFEN_TEXT + '.', 'offen', '', null); });
      return out;
    }
    /* Kurzfassung für eine Zeile oben auf dem Blatt: „Absturzsicherung (Pos. 2), Lüftungskonzept, Farbe außen (alle)“; offene Wünsche je Angabe */
    function klaerKurz(wins, p) {
      wins = wins || [];
      const map = new Map(), add = (key, i) => { if (!map.has(key)) map.set(key, []); if (i != null && map.get(key).indexOf(i) < 0) map.get(key).push(i); };
      klaerung(wins, p).forEach((r) => { if (r.art !== 'offen') (Array.isArray(r.pos) ? r.pos : [r.pos]).forEach((i) => add(r.kurz, i)); });
      wins.forEach((w, i) => offenListe(w).forEach((k) => add(OFFEN_NAME[k], i)));
      return Array.from(map.entries()).map((e) => e[0] + (e[1].length ? ' (' + (e[1].length === wins.length && wins.length > 1 ? 'alle' : 'Pos. ' + e[1].sort((a, b) => a - b).map((i) => i + 1).join(', ')) + ')' : ''));
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
      absturzFrage: absturzFrage, absturzText: absturzText, ABSTURZ_MM: ABSTURZ_MM, bruDa: bruDa, foerdWeg: foerdWeg, uwZiel: uwZiel, uwText: uwText, massPruef: massPruef, massZeile: massZeile, ohneFotos: ohneFotos, verhText: verhText, fachZeile: fachZeile, motor: motor, klaerung: klaerung, klaerKurz: klaerKurz };
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
    const fromApp = (w) => AW.mk(Object.assign({}, w, { name: w.name || 'Fenster' }));
    function fingerprint(o) { try { return hashN(JSON.stringify([o.w, o.p])); } catch (e) { return 0; } }
    function fromAppProj(p) { p = p || {}; const fw = AW.OPT.foerdweg[p.foerdweg] ? p.foerdweg : ''; return { gebaeude: p.gebaeude || '', baujahr: p.baujahr || '', total: AW.num(p.total) || 0, zeit: p.zeit || '', budget: p.budget || '', foerd: !!p.foerd || fw === 'bafa' || fw === 'steuer', foerdweg: fw, notiz: String(p.notiz || '').replace(/\s+/g, ' ').trim().slice(0, 600) }; }
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

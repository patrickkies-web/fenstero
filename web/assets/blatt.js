'use strict';
/* eeziframes · Aufmaßblatt als PDF: ein Zeichner für drei Ausgaben
   Blatt.pdf(e)      -> Blob (null, wenn jsPDF oder das Modell fehlt)
   Blatt.schrift()   -> Promise; lädt vor dem ersten Blatt jsPDF, den QR-Code und die eingebettete Schrift (blatt-schrift.js) einmal nach,
                        danach sofort; vor jedem Blatt.pdf() abwarten

   e = {
     variante: 'kunde' | 'fensterbauer' | 'betrieb' | 'anfrage',
        kunde:        das Blatt des Hauseigentümers für seine Unterlagen (Du), mit Seite für den Fensterbauer am Ende
        fensterbauer: dasselbe Aufmaß, so wie es der Hauseigentümer einem Betrieb schickt (Sie), mit Seite für den Fensterbauer
        betrieb:      aus dem Betriebsbereich, mit Namen und Logo des Betriebs, Bestellmaß-Vorschlag und Stand der Klärungsliste, ohne Werbung
        anfrage:      Kopie für den Endkunden einer Konfigurator-Instanz in der Marke des Betriebs (e.marke): wie betrieb, aber ohne Abzug und
                      Bestellmaß, ohne Projekt-QR, ohne Werbeseiten; Anrede Du, mit e.sie Sie (docs/INSTANZEN.md)
     kennzeichnung: 'deutlich' (Vorgabe: eeziframes im Untertitel und im Fuß) | 'dezent' (nur im Fuß) | 'keine' (nirgends, auch nicht
                    als Autor oder Ersteller); gilt für betrieb und anfrage, die Blätter der Hauseigentümer tragen immer die Marke,
     marke: { name, logo: { data, w, h, grund }, farbe, host } (anfrage: Name, Logo und Domain der Instanz), nr (Nummer der Anfrage),
     ausgabe: 'bytes' liefert Uint8Array statt Blob (Server, functions/api/blatt-server.js), fotoHinweis: Zeile in den Eckdaten,
     fenster: [Fenster wie in der App], projekt: { name, ort, tel, mail, erreich, gebaeude, baujahr, total, zeit, budget, foerd, foerdweg, notiz, notizen },
     kunde: { name, kontakt, adresse, mehr: [[Beschriftung, Wert]] (vom Kunden eingetragen: Telefon, E-Mail, Erreichbar) } (betrieb), betrieb: { name, logo: { data, w, h, grund }, abzug: { seite, oben, unten, untenT }, nr, eingegangen } (betrieb),
     klaerung: [Punkte aus AW.klaerung] (betrieb, sonst gerechnet), klaerStand: { id: { ok, notiz, wann } } (betrieb),
     code, portalUrl, portalKurz, qr: window.qrcode (für die Seite an den Fensterbauer), fotos: { Kennung: { data, w, h } }, beispiel,
     h: { derive(w), lab(gruppe, key), … } (ältere Aufrufer; gerechnet wird mit window.AW aus modell.js)
   }
   Gestaltung nach der Design-DNA (Palette „Task-App dunkel“ auf Papier): weißes Papier, Schrift Schwarz #07090a und Anthrazit #202022,
   Nebentext Textgrau #6b676c, Linien als Ton von Silbergrau, Violett #897efc für Werte, Haken und „aktiv“, Koralle #f88962 für Hinweise
   (Text im dunklen Ton der Koralle), Indigo #3c3a66 für Chips und Codes; Kopfband Schwarz mit Logo und Namen des Betriebs bzw. der Marke;
   Outfit 300/400/500/600, die Wortmarke in Inter. Zahlen als Held (dünn, Einheit klein), Vollständigkeit als Kapselreihe.
   Systematik: Positionen nach Geschoss geordnet (Keller, EG, OG, DG), Code aus Geschoss und Nummer (EG-01) auf jeder Seite.
   Aufbau: Seite 1 Kopf, Kennzahlen, Kunde und Eckdaten, Übersicht je Geschoss mit Ausstattung und Seitenverweis; Klärungsliste;
   Aufstellung nach Gewerk (Fenster und Türen, Sonnenschutz, Insektenschutz, Glas, Sicherheit, Strom) mit den Positionen; danach je
   Position eine Seite (Zeichnung mit Maßketten aus AW.plan, Maße, Wünsche, Einbausituation, Fotos) mit Weg zurück zur Übersicht und
   zur nächsten Position; am Ende Ausstattung, Zahlen, Maßstab und (für Hauseigentümer) der Aufmaß-Code. Lesezeichen und Verweise im
   PDF sind anklickbar, die Seitenzahlen stehen auch gedruckt da (das Blatt wird dafür zweimal gesetzt).
   anfrage ist die Durchschrift für den Kunden: dieselbe Ordnung, aber ohne Maße, Zeichnung, Bestellmaß und Fotoauswertung, damit sie
   sich nicht als Aufmaß an andere Betriebe eignet; sie nennt, dass der Betrieb das vollständige Blatt auf Anfrage schickt.
   Läuft im Browser (window.Blatt) und ohne DOM im Worker (globalThis.Blatt, functions/api/blatt-server.js): jsPDF, die Schrift und das
   Modell liegen dann auf globalThis, Datum immer in deutscher Zeit. */
(typeof globalThis !== 'undefined' ? globalThis : window).Blatt = (() => {
  const G = typeof globalThis !== 'undefined' ? globalThis : window;
  const W = 210, H = 297, M = 14, BOTTOM = H - 16;
  /* Druckpalette aus den acht Farben der DNA (Töne erlaubt, keine neuen Farben): Schwarz, Weiß, Anthrazit, Silbergrau, Textgrau,
     Violett, Koralle, Indigo. Koralle als Text nur im dunklen Ton (#b4502f, 5:1 auf Weiß), Violett als Text nur ab 9 pt fett */
  const SCHWARZ = '#07090a', ANTH = '#202022', SILBER = '#a8a4a9', VIOLETT = '#897efc', KORALLE = '#f88962', INDIGO = '#3c3a66';
  const INK = SCHWARZ, INK2 = ANTH, GREY = '#6b676c', LINE = '#dcdadc', LINE_F = '#ecebec', BUEHNE = SCHWARZ, HELL = '#ffffff', HELL2 = SILBER, GRUEN = VIOLETT, GRUEN_T = INDIGO,
    WARN = '#b4502f', WARN_P = KORALLE, MO_T = ANTH, EL_T = INDIGO, MO = ANTH, EL = VIOLETT, GLASS = '#eceef1', CHIP = '#ecebf3', VIOLETT_H = '#f1efff';
  /* Farben der Zeichnung (modell.js, ZF) auf die Palette der DNA abbilden; Farben der Fenster selbst (RAL) bleiben */
  const PLANF = { '#161616': SCHWARZ, '#5f5f64': GREY, '#f3f2ee': '#f4f3f4', '#e4e1d9': '#e7e6e7', '#d6e6f4': GLASS, '#d3cec4': '#d9d7d9', '#c9c9c6': '#cecccf', '#8a8984': SILBER,
    '#ff8a5b': ANTH, '#b3401e': MO_T, '#7aa2ff': VIOLETT, '#3d63c9': INDIGO, '#4a4a4f': ANTH };
  const pf = (c) => (c && PLANF[String(c).toLowerCase()]) || c;
  const rgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); const n = m ? parseInt(m[1], 16) : 0; return [n >> 16, (n >> 8) & 255, n & 255]; };
  /* Zeichen, die Outfit im eingebetteten Ausschnitt nicht hat, werden ersetzt */
  const t = (s) => (Array.isArray(s) ? s.map(t) : String(s == null ? '' : s).replace(/[    ]/g, ' ').replace(/[‐‑‒]/g, '-').replace(/­/g, '').replace(/≥/g, 'ab ').replace(/≤/g, 'bis ').replace(/≈/g, 'ca. ').replace(/\(([^()]+) \(([^()]+)\)\)/g, '($1, $2)').replace(/[←-↓]/g, '-').replace(/✓/g, ''));
  const istTuer = (w) => w.art === 'hst' || w.art === 'fsw' || w.art === 'balkon' || w.art === 'psk';
  const ARTNAME = { fenster: 'Fenster', balkon: 'Balkontür', fest: 'Festverglasung', hst: 'Hebe-Schiebe-Tür', psk: 'PSK-Tür', fsw: 'Faltschiebewand' };
  const A = () => G.AW || null;
  const ERREICH = { vm: 'vormittags', nm: 'nachmittags', ab: 'abends' };
  const BASIS = typeof document !== 'undefined' && document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/[^/]*$/, '') : '/assets/';
  /* jsPDF (etwa 360 KB) und der QR-Code kommen erst mit dem ersten Blatt, nicht mit der Seite: Startseite und App laden schneller */
  const VENDOR = BASIS.replace(/assets\/$/, 'vendor/');
  const geladen = {};
  const skript = (src, da) => {
    if (da()) return Promise.resolve(true);
    if (geladen[src]) return geladen[src];
    return (geladen[src] = new Promise((res) => {
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = () => res(!!da()); s.onerror = () => { delete geladen[src]; s.remove(); res(false); };
      document.head.appendChild(s);
    }));
  };
  function schrift() {
    return Promise.all([
      skript(VENDOR + 'jspdf.umd.min.js', () => !!(G.jspdf && G.jspdf.jsPDF)),
      skript(VENDOR + 'qrcode.js', () => typeof G.qrcode === 'function'),
      skript(BASIS + 'blatt-schrift.js', () => !!G.BlattSchrift)
    ]).then((r) => r[2]);
  }

  function pdf(e) {
    const J = G.jspdf && G.jspdf.jsPDF, AW = A(); if (!J || !AW) return null;
    /* Erst zur Probe setzen (ohne Bilder), um die Seiten der Positionen und Abschnitte zu kennen, dann mit Seitenzahlen und Verweisen */
    const probe = setzen(e, null, true), doc = setzen(e, probe.seiten, false).doc;
    if (e.ausgabe === 'bytes') return new Uint8Array(doc.output('arraybuffer'));
    return doc.output('blob');
  }
  /* ref: { pos: { Index: Seite }, abschnitt: { name: Seite } } aus dem Probelauf oder null; probe: ohne Bilder */
  function setzen(e, ref, probe) {
    const J = G.jspdf.jsPDF, AW = A();
    const doc = new J({ unit: 'mm', format: 'a4', compress: true });
    const SEITEN = { pos: {}, abschnitt: {} };
    const seiteVon = (art, k) => (ref ? (art === 'pos' ? ref.pos[k] : ref.abschnitt[k]) : 0) || 0;
    /* Verweis auf eine Seite: im Probelauf ohne Ziel, danach als Link gesetzt */
    const verweis = (x, y0, w, h2, ziel) => { if (ziel > 0) { try { doc.link(x, y0, w, h2, { pageNumber: ziel }); } catch (err) { /* ohne Link weiter */ } } };
    const V = e.variante || 'kunde', wins = e.fenster || [], pr = e.projekt || {}, kd = e.kunde || {};
    /* BKOPF: Kopf und Seite 1 in der Marke eines Betriebs (betrieb, anfrage); BEST: mit Bestellmaß und Stand der Klärung (nur betrieb);
       EIGENE: Blätter der Hauseigentümer mit Markenstreifen, Code-Seite und Seite für Fensterbauer */
    const BKOPF = V === 'betrieb' || V === 'anfrage', BEST = V === 'betrieb', ANF = V === 'anfrage';
    const bt = ANF ? Object.assign({}, e.marke || {}, e.betrieb || {}, { nr: e.nr || (e.betrieb || {}).nr || '' }) : e.betrieb || {}, ab = AW.abzugVon(bt.abzug);
    const KZ = ['dezent', 'keine'].indexOf(e.kennzeichnung) >= 0 ? e.kennzeichnung : 'deutlich';
    const sie = ANF ? !!e.sie : V !== 'kunde', EIGENE = !BKOPF, STREIFEN = EIGENE ? 8 : 0, XR = W - (EIGENE ? 18 : 14), CW = XR - M;
    /* Adresse der Website: die, unter der eeziframes gerade läuft (nach einem Domainwechsel stimmt sie von selbst); bei der Kopie einer
       Anfrage die Domain der Instanz */
    const HOST = (ANF && bt.host) || e.portalKurz || (typeof location !== 'undefined' && location.host) || (KZ === 'keine' ? '' : 'eeziframes');
    /* Schrift: Outfit wie auf der Website (300 große Zahlen, 400 Text, 500 Werte und Listen, 600 Überschriften und Codes), die Wortmarke
       in Inter; ohne eingebettete Schrift Helvetica */
    const BS = G.BlattSchrift;
    const F = BS && BS.halb ? (() => {
      try {
        [['Outfit-Light.ttf', 'OutfitLight', BS.duenn], ['Outfit-Regular.ttf', 'OutfitRegular', BS.normal], ['Outfit-Medium.ttf', 'OutfitMedium', BS.mittel], ['Outfit-SemiBold.ttf', 'OutfitSemiBold', BS.halb],
          ['Inter-Black.ttf', 'InterBlack', BS.markeFett], ['Inter-Medium.ttf', 'InterMedium', BS.markeNormal]].forEach((f) => { doc.addFileToVFS(f[0], f[2]); doc.addFont(f[0], f[1], 'normal'); });
        return { extra: ['OutfitSemiBold', 'normal'], bold: ['OutfitMedium', 'normal'], normal: ['OutfitRegular', 'normal'], duenn: ['OutfitLight', 'normal'], mono: ['courier', 'normal'], markeA: ['InterBlack', 'normal'], markeB: ['InterMedium', 'normal'] };
      } catch (err) { return null; }
    })() : null;
    const FONTS = F || { extra: ['helvetica', 'bold'], bold: ['helvetica', 'bold'], normal: ['helvetica', 'normal'], duenn: ['helvetica', 'normal'], mono: ['courier', 'normal'], markeA: ['helvetica', 'bold'], markeB: ['helvetica', 'normal'] };
    const font = (k, size, color) => { const f = FONTS[k] || FONTS.normal; doc.setFont(f[0], f[1]); if (size) doc.setFontSize(size); if (color) doc.setTextColor.apply(doc, rgb(color)); };
    const fill = (c) => doc.setFillColor.apply(doc, rgb(c)), stroke = (c) => doc.setDrawColor.apply(doc, rgb(c));
    const tw = (s) => doc.getTextWidth(t(s));
    const wrap = (s, w) => doc.splitTextToSize(t(s), Math.max(4, w));
    /* Beschriftungen: ein langes zusammengesetztes Wort, das nicht in die Spalte passt, an der Fuge trennen statt mitten im Wort */
    const FUGE = { Absturzsicherung: 'Absturz', Einbruchschutz: 'Einbruch', Insektenschutz: 'Insekten', Sonnenschutz: 'Sonnen', Fensterbank: 'Fenster', Förderwert: 'Förder', Maueröffnung: 'Mauer', Rohbauöffnung: 'Rohbau', Fensterbänke: 'Fenster', Insektenschutzgewebe: 'Insekten', Rollladenpanzer: 'Rollladen', Kindersicherung: 'Kinder', Abstandhalter: 'Abstand', Fensteröffner: 'Fenster', Rahmenansicht: 'Rahmen', Abdeckleisten: 'Abdeck', Lichtschlitze: 'Licht', Fenstergitter: 'Fenster' };
    const wrapK = (s, w) => wrap(String(s).split(' ').map((wd) => (FUGE[wd] && tw(wd) > w ? FUGE[wd] + '-\n' + wd.slice(FUGE[wd].length) : wd)).join(' '), w);
    const txt = (s, x, y0, o) => doc.text(t(s), x, y0, o);
    const bild = function () { if (!probe) doc.addImage.apply(doc, arguments); };
    /* Marke: immer klein, auch in Versalzeilen; Wortmarke „eezi“ in ExtraBold, „frames“ in Medium */
    const VERSAL = (s) => String(s).split(/(eeziframes|eezi)/).map((x, i) => (i % 2 ? x : x.replace(/ß/g, 'ẞ').toUpperCase())).join(''); // „MAẞE“, nicht „MASSE“
    const wortmarke = (x, y0, size, col) => { font('markeA', size, col); txt('eezi', x, y0); const w1 = tw('eezi'); font('markeB', size, col); txt('frames', x + w1, y0); return w1 + tw('frames'); };
    const alpha = (a) => { try { doc.setGState(new doc.GState({ opacity: a })); } catch (err) { /* ohne Transparenz */ } };
    const rr = (x, y0, w, h2, r, mode) => doc.roundedRect(x, y0, w, h2, r, r, mode || 'F');
    const dash = (d) => { try { doc.setLineDashPattern(d || [], 0); } catch (err) { /* ok */ } };
    const num = AW.num, th = AW.th;
    const nE = wins.reduce((a, x) => a + (num(x.anzahl) || 1), 0), nF = wins.reduce((a, x) => a + (num(x.fotos) || 0), 0);
    /* „ausgewertet“ nur, wo die Auswertung auch im Blatt steht (Befund oder Fachangaben); sonst ehrlich nur die Zahl der Fotos */
    const nA = wins.reduce((a, x) => a + (x.ki && ((x.ki.rows || []).length || (x.ki.fach && Object.keys(x.ki.fach).length)) ? num(x.fotos) || 0 : 0), 0);
    const fotoText = ANF ? (nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ' übermittelt' : 'ohne Fotos') : !nF ? 'ohne Fotos' : nA === nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ' ausgewertet' : nA ? nA + ' von ' + nF + ' Fotos ausgewertet' : nF + (nF === 1 ? ' Foto' : ' Fotos');
    const komplett = wins.length > 0 && wins.every((x) => !AW.massLuecken(x).length);
    const heute = (() => { try { return new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }); } catch (err) { return ''; } })();
    const titelName = BKOPF ? (kd.name || pr.name || 'Kunde') : (pr.name || '');
    const laufTitel = (ANF ? (sie ? 'Ihre Anfrage · ' : 'Deine Anfrage · ') : BEST ? 'Aufmaß · ' : 'Aufmaßblatt · ') + (titelName || (V === 'kunde' ? 'Dein Aufmaß' : 'Fenster-Aufmaß'));
    const initial = (name) => (String(name || 'F').replace(/^(Fensterbau|Glaserei|Schreinerei|Tischlerei)\s+/i, '').slice(0, 1).toUpperCase() || 'F');
    /* Kennung des Aufmaßes: kurz, aus dem Code gebildet, steht auf jeder Seite (eine einzelne Seite bleibt zuordenbar) */
    const kennung = e.beispiel ? 'AM-BEISPIEL' : BKOPF && bt.nr ? String(bt.nr) : (() => { const q = String(e.code || (pr.name || '') + heute + wins.length); let a = 2166136261; for (let i = 0; i < q.length; i++) { a ^= q.charCodeAt(i); a = Math.imul(a, 16777619); } const Z = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let o = ''; for (let i = 0; i < 6; i++) o += Z[(a >>> (i * 5)) & 31]; return 'AM-' + o; })();
    /* Autor und Ersteller: bei kennzeichnung 'keine' nur der Betrieb, nie eeziframes */
    const ohneEezi = BKOPF && KZ === 'keine';
    try { doc.setDocumentProperties({ title: laufTitel, subject: 'Fenster-Aufmaß ' + kennung + (titelName ? ' · ' + titelName : ''), author: BKOPF ? (bt.name || (ohneEezi ? '' : 'eeziframes')) : 'eeziframes', keywords: 'Aufmaß, Fenster, Maße in mm, ' + kennung, creator: ohneEezi ? (bt.name || '') : 'eeziframes' }); doc.setLanguage('de-DE'); if (doc.viewerPreferences) doc.viewerPreferences({ DisplayDocTitle: true }); } catch (err) { /* ohne Eigenschaften weiter */ }
    const bnK = bt.name || (sie ? 'Ihr Fensterbauer' : 'dein Fensterbauer');
    const stand = e.klaerStand || {}, geklaert = (r) => (r.ids || [r.id]).every((id) => !!(stand[id] && stand[id].ok));
    /* Gleiche Punkte an mehreren Positionen (z. B. „Strom am Fenster klären“) stehen in einer Zeile mit allen Codes; doppelte fallen weg */
    const kl = (() => {
      const roh = Array.isArray(e.klaerung) ? e.klaerung : AW.klaerung(wins, pr), out = [];
      const liste = (r) => (typeof r.pos === 'number' ? [r.pos] : Array.isArray(r.pos) ? r.pos.slice() : null);
      roh.forEach((r) => {
        const pl = liste(r), da = pl && out.find((x) => x._pl && x.gruppe === r.gruppe && x.v === r.v);
        if (da) { pl.forEach((q) => { if (da._pl.indexOf(q) < 0) da._pl.push(q); }); if (da.ids.indexOf(r.id) < 0) da.ids.push(r.id); }
        else out.push(Object.assign({}, r, { ids: [r.id], _pl: pl }));
      });
      out.forEach((r) => { if (r._pl && r._pl.length > 1) r.pos = r._pl.slice().sort((a, b) => a - b); });
      return out;
    })();

    /* ---------- Systematik: Geschoss, Code, Reihenfolge ----------
       Positionen nach Geschoss (Keller, Erdgeschoss, Obergeschosse, Dachgeschoss), im Geschoss in der Reihenfolge der Erfassung; Code aus
       Geschoss und Nummer (EG-01). Er steht in Übersicht, Aufstellung, Klärungsliste, auf jeder Positionsseite und im Maßstab. */
    const RANG = { kg: 0, eg: 1, og: 2, dg: 3 };
    const ogNr = (w) => (w.etage === 'og' ? Math.max(1, num(w.ogNr) || 1) : 0);
    const eKurz = (w) => (w.etage === 'og' ? (ogNr(w) > 1 ? ogNr(w) + 'OG' : 'OG') : ({ kg: 'KG', eg: 'EG', dg: 'DG' })[w.etage] || 'EG');
    const eName = (w) => (w.etage === 'og' ? (num(w.ogNr) > 0 ? num(w.ogNr) + '. Obergeschoss' : 'Obergeschoss') : ({ kg: 'Keller', eg: 'Erdgeschoss', dg: 'Dachgeschoss' })[w.etage] || 'Erdgeschoss');
    const eRang = (w) => (RANG[w.etage] != null ? RANG[w.etage] : 1) * 100 + ogNr(w);
    const ORDER = wins.map((w, i) => i).sort((a, b) => eRang(wins[a]) - eRang(wins[b]) || a - b);
    const CODE = {}, BEREICHE = [];
    ORDER.forEach((i) => { const k = eKurz(wins[i]); let b = BEREICHE.find((x) => x.k === k); if (!b) { b = { k: k, name: eName(wins[i]), idx: [] }; BEREICHE.push(b); } b.idx.push(i); CODE[i] = k + '-' + String(b.idx.length).padStart(2, '0'); });
    const posName = (i) => wins[i].name || (ARTNAME[wins[i].art] || 'Fenster');
    const posLabel = (i) => CODE[i] + ' ' + posName(i);
    const bereichVon = (i) => BEREICHE.find((b) => b.idx.indexOf(i) >= 0) || { name: '', idx: [i] };
    /* Ausstattung je Position: Sonnenschutz außen, innen, Insektenschutz; je Eintrag Zeichen, Text für die Position, Text der Gruppe in
       der Aufstellung */
    const KASTEN_N = { aufsatz: 'Aufsatzkasten', vorbau: 'Vorbaukasten', unterputz: 'Unterputzkasten' };
    const antriebT = (w) => (AW.istOffen(w, 'antrieb') ? 'Antrieb offen' : AW.istStd && AW.istStd(w, 'antrieb') ? '' : AW.lab('antrieb', w.antrieb) || '');
    function ausstattungVon(w) {
      const out = [], sa = AW.sartVon ? AW.sartVon(w) : w.sart || 'keiner';
      if (AW.istOffen(w, 'sart')) out.push({ z: 'offen', k: 'aussen', t: 'Sonnenschutz außen offen', gruppe: 'offen, bitte beraten' });
      else if (sa === 'rollladen' || sa === 'raffstore' || sa === 'screen') {
        const name = { rollladen: 'Rollladen', raffstore: 'Raffstore', screen: 'Screen' }[sa];
        const kasten = AW.istOffen(w, 'einbau') ? 'Kasten offen' : AW.istStd && AW.istStd(w, 'einbau') ? '' : KASTEN_N[w.roll] || 'Aufsatzkasten';
        const farbe = AW.istOffen(w, 'sfarbe') || (AW.istStd && AW.istStd(w, 'sfarbe')) ? '' : AW.lab('sfarbe', w.sfarbe) || '';
        out.push({ z: sa, k: 'aussen', t: [name, kasten, antriebT(w)].filter(Boolean).join(', '), gruppe: [name, kasten, antriebT(w), farbe].filter(Boolean).join(', '), strom: /elektrisch|Smart/.test(antriebT(w)), solar: w.antrieb === 'solar' });
      } else if (sa === 'klappladen') out.push({ z: 'klappladen', k: 'aussen', t: 'Klappläden', gruppe: 'Klappläden' });
      else if (sa === 'behalten') out.push({ z: 'rollladen', k: 'aussen', t: 'Sonnenschutz bleibt', gruppe: 'bestehender Sonnenschutz bleibt' });
      if (AW.istOffen(w, 'iart')) out.push({ z: 'offen', k: 'innen', t: 'Sichtschutz innen offen', gruppe: 'offen, bitte beraten' });
      else if (w.iart && w.iart !== 'keiner') out.push({ z: 'innen', k: 'innen', t: AW.lab('iart', w.iart) + ' innen', gruppe: AW.innen(w) });
      if (AW.istOffen(w, 'insekt')) out.push({ z: 'offen', k: 'insekt', t: 'Insektenschutz offen', gruppe: 'offen, bitte beraten' });
      else if (w.insekt && w.insekt !== 'keiner') out.push({ z: 'insekt', k: 'insekt', t: 'Insektenschutz ' + AW.lab('insekt', w.insekt), gruppe: AW.lab('insekt', w.insekt) });
      return out;
    }
    const AUS = {}; wins.forEach((w, i) => { AUS[i] = ausstattungVon(w); });
    const nSonne = wins.filter((w, i) => AUS[i].some((a) => a.k === 'aussen' && a.z !== 'offen')).length, nKomplett = wins.filter((w) => !AW.massLuecken(w).length).length;
    const ZEICHEN_A = [['rollladen', 'RL', 'Rollladen'], ['raffstore', 'RS', 'Raffstore'], ['screen', 'SC', 'Screen'], ['klappladen', 'KL', 'Klappläden'], ['insekt', 'IS', 'Insektenschutz'], ['innen', 'IN', 'innen']];
    const KUERZEL = {}; ZEICHEN_A.forEach((z) => { KUERZEL[z[0]] = z[1]; });
    /* Maß „B × H“ am Zeichen „ד ausgerichtet, damit die Spalte ruhig steht; gibt das rechte Ende zurück */
    const massZelle = (a, b, x, yy) => {
      const xm = x + 9.6;
      if (!a || !b) { txt('–', xm, yy, { align: 'center' }); return xm + 1; }
      txt(th(a), xm - 1.4, yy, { align: 'right' }); txt('×', xm, yy, { align: 'center' }); txt(th(b), xm + 1.4, yy); return xm + 1.4 + tw(th(b));
    };

    /* ---------- Seitenrahmen ---------- */
    let y = 0;
    /* Das Zeichen: Licht fällt durch ein Fenster in einen dunklen Raum. Dieselben Punkte wie im SVG (scripts/logo-setzen.py,
       Raster 64); der Lichtstreifen endet unten links an der Rundung der Kachel. Auf dunklem Band weiße Kachel, sonst schwarze. */
    const ZEICHEN = (() => {
      const strahl = [[44.2, 41], [55.9, 43.3], [11.7, 64], [10, 64]];
      for (let i = 1; i <= 8; i++) { const a = Math.PI / 2 + (Math.PI / 2) * i / 8; strahl.push([10 + 10 * Math.cos(a), 54 + 10 * Math.sin(a)]); }
      return [[[26.4, 12.2], [44.4, 19.7], [56.3, 15.3], [42, 6.6]], [[45, 22], [57, 17.6], [57, 41.9], [45, 39.8]], strahl];
    })();
    function marke(x, y0, s, hell) {
      const u = s / 64;
      fill(hell ? '#ffffff' : '#000000'); rr(x, y0, s, s, 10 * u);
      fill(hell ? '#000000' : '#ffffff');
      ZEICHEN.forEach((pts) => doc.lines(pts.slice(1).map((p, i) => [(p[0] - pts[i][0]) * u, (p[1] - pts[i][1]) * u]), x + pts[0][0] * u, y0 + pts[0][1] * u, [1, 1], 'F', true));
    }
    /* Logo des Betriebs (aus dem Betriebskonto) auf dem dunklen Band: dunkle Logos auf hellem Feld, helle direkt; ohne Logo die Initiale */
    const logoFmt = (d) => (/^data:image\/png/i.test(d) ? 'PNG' : /^data:image\/jpe?g/i.test(d) ? 'JPEG' : /^data:image\/webp/i.test(d) ? 'WEBP' : '');
    function betriebZeichen(x, cy, hoehe) {
      const lg = bt.logo && bt.logo.data && logoFmt(bt.logo.data) && bt.logo.w > 0 && bt.logo.h > 0 ? bt.logo : null;
      if (lg) {
        const r = lg.w / lg.h, hh = hoehe, ww = Math.min(hoehe * 3.6, hh * r), h2 = ww / r, pad = lg.grund === 'dunkel' ? 0 : hoehe * 0.12, padX = pad * 1.6;
        if (pad) { fill('#ffffff'); rr(x, cy - h2 / 2 - pad, ww + 2 * padX, h2 + 2 * pad, Math.min(2.4, hoehe * 0.2)); }
        try { bild(lg.data, logoFmt(lg.data), x + padX, cy - h2 / 2, ww, h2); return ww + 2 * padX; } catch (err) { /* ohne Logo weiter */ }
      }
      const r = hoehe / 2; fill(HELL); doc.circle(x + r, cy, r, 'F'); font('extra', hoehe * 1.55, BUEHNE); txt(initial(bt.name), x + r, cy + hoehe * 0.19, { align: 'center' });
      return hoehe;
    }
    /* Kopfband: Schwarz, links Logo (oder Zeichen und Wortmarke) und Name, rechts Etikett mit violettem Punkt, Kennung und Datum.
       Auf den Folgeseiten schmal; auf Positionsseiten rechts der Weg: Übersicht, vorige und nächste Position (anklickbar) */
    const kopfband = (gross, nav) => {
      const bh = gross ? 30 : 12;
      fill(BUEHNE); doc.rect(0, 0, W, bh, 'F');
      const rechtsKopf = (label) => {
        font('bold', 6.8); const lw = tw(VERSAL(label)) + VERSAL(label).length * 0.5; fill(VIOLETT); doc.circle(XR - lw - 2.4, bh / 2 - 6.3, 0.9, 'F');
        font('bold', 6.8, HELL2); txt(VERSAL(label), XR, bh / 2 - 5.4, { align: 'right', charSpace: 0.5 });
        font('extra', 12, '#ffffff'); txt(kennung, XR, bh / 2 + 0.8, { align: 'right' });
      };
      if (BKOPF) {
        const zw = betriebZeichen(M, bh / 2, gross ? 14 : 6.4), nx = M + zw + (gross ? 5 : 3);
        const stand = [bt.eingegangen ? 'eingegangen ' + bt.eingegangen : '', bt.eingegangen === heute ? '' : heute].filter(Boolean).join(' · ');
        let rw = 70;
        if (gross) { font('extra', 12); rw = tw(kennung); font('normal', 7.6); rw = Math.max(rw, tw(stand)) + 6; }
        else if (nav) rw = navBreite(nav) + 4;
        const frei = XR - nx - rw;
        const bname = bt.name || 'Ihr Betrieb'; let gn = gross ? 15 : 8.6; font('extra', gn, '#ffffff');
        while (gn > (gross ? 10.5 : 7) && tw(bname) > frei) { gn -= 0.5; font('extra', gn); } // langer Name neben breitem Logo: kleiner statt abgeschnitten
        txt(wrap(bname, frei)[0], nx, bh / 2 + (gross ? -0.6 : 1.1));
        if (gross) {
          font('normal', 7.8, HELL2);
          const was = ANF ? (sie ? 'Ihre Anfrage' : 'Deine Anfrage') : 'Aufmaß Ihres Kunden', sub = KZ === 'deutlich' ? was + ' · ' + (ANF ? 'erstellt' : 'übermittelt') + ' mit eeziframes' : was;
          txt(tw(sub) <= frei ? sub : wrap(KZ === 'deutlich' ? 'Übermittelt mit eeziframes' : was, frei)[0], nx, bh / 2 + 5);
          rechtsKopf(ANF ? 'Durchschrift' : 'Aufmaß'); font('normal', 7.6, HELL2); txt(stand, XR, bh / 2 + 6.2, { align: 'right' });
        } else if (nav) navZeichnen(nav, bh);
        else { font('normal', 6.8, HELL2); txt(laufTitel + ' · ' + kennung, XR, bh / 2 + 1.1, { align: 'right' }); }
      } else {
        marke(M, gross ? 8 : 3.1, gross ? 14 : 5.8, true);
        wortmarke(M + (gross ? 19 : 7.8), gross ? 18 : 7.6, gross ? 16 : 8, '#ffffff');
        if (gross) { rechtsKopf('Aufmaßblatt'); font('normal', 7.6, HELL2); txt(heute, XR, bh / 2 + 6.2, { align: 'right' }); }
        else if (nav) navZeichnen(nav, bh);
        else { font('normal', 6.6, HELL2); txt(laufTitel + ' · ' + heute + ' · ' + kennung, XR, 7.5, { align: 'right' }); }
      }
      doc.setTextColor.apply(doc, rgb(INK));
      return bh;
    };
    /* Weg auf Positionsseiten: „Übersicht“, vorige und nächste Position, je mit Verweis (im Probelauf ohne Ziel, gleiche Breite) */
    const navTeile = (nav) => [nav.vor != null ? { s: '‹ ' + CODE[nav.vor], z: seiteVon('pos', nav.vor) } : null, { s: 'Übersicht', z: seiteVon('abschnitt', 'uebersicht') }, nav.nach != null ? { s: CODE[nav.nach] + ' ›', z: seiteVon('pos', nav.nach) } : null].filter(Boolean);
    const navBreite = (nav) => { font('bold', 7.4); return navTeile(nav).reduce((a, x) => a + tw(x.s) + 8, 0); };
    function navZeichnen(nav, bh) {
      let x = XR; font('bold', 7.4);
      navTeile(nav).reverse().forEach((x2) => { const w2 = tw(x2.s) + 5; fill('#202022'); rr(x - w2, bh / 2 - 3.1, w2, 6.2, 3.1); font('bold', 7.4, '#ffffff'); txt(x2.s, x - w2 / 2, bh / 2 + 1.1, { align: 'center' }); verweis(x - w2, bh / 2 - 3.1, w2, 6.2, x2.z); x -= w2 + 3; });
    }
    let NAV = null; // Weg der laufenden Positionsseite
    const neueSeite = () => { doc.addPage(); y = kopfband(false, NAV) + 9; };
    const seiteNr = () => doc.getCurrentPageInfo().pageNumber;
    const unten = () => BOTTOM;
    const platz = (h2) => { if (y + h2 > unten()) { neueSeite(); return true; } return false; };
    let codeSeite = 0, fbBox = null;
    /* Senkrechter Markenstreifen am rechten Rand (nur in den Blättern der Hauseigentümer): Hinweis, der sich nicht abtrennen lässt */
    const streifen = (bandH) => {
      if (!STREIFEN) return;
      const x0 = W - STREIFEN, y0 = bandH, y1 = H - 12, len = y1 - y0;
      fill(BUEHNE); doc.rect(x0, y0, STREIFEN, len, 'F');
      const text = 'eeziframes  ·  Fenster ausmessen. Selbst. eezi.  ·  ' + HOST + '  ·  Für Fensterbauer: Aufmaß per Code in Ihr Konto holen' + (codeSeite ? ', Seite ' + codeSeite : '') + '  ·  3 Projekte kostenlos';
      let size = 6.8; font('bold', size, HELL);
      while (tw(text) > len - 16 && size > 5.2) { size -= 0.2; font('bold', size, HELL); }
      const tl = tw(text), ty = y1 - 9 - (len - 16 - tl) / 2;
      txt(text, x0 + STREIFEN / 2 + size * 0.12, ty, { angle: 90 });
      marke(x0 + 1.2, y1 - 7.2, STREIFEN - 2.4, true);
    };
    /* Beispiel aus der Führung: schräg „Beispiel“ über jeder Seite, damit es nicht als echtes Aufmaß durchgeht */
    const wasserzeichen = (wort) => {
      const a = 34 * Math.PI / 180, s = wort || 'BEISPIEL';
      font('extra', wort ? 78 : 96, wort ? SILBER : WARN); alpha(wort ? 0.08 : 0.07);
      const l = tw(s), cxw = W / 2, cyw = H / 2 + 12;
      txt(s, cxw - Math.cos(a) * l / 2, cyw + Math.sin(a) * l / 2, { angle: 34 });
      alpha(1);
    };
    /* Fußzeile links: nur so lang, wie neben der Seitenzahl Platz ist; erst fällt der Zusatz weg, dann der Host, zuletzt wird der Name gekürzt */
    const fussLinks = (frei) => {
      const name = String(bt.name || 'Ihr Betrieb').replace(/\s+/g, ' ').trim(), passt = (x) => tw(x) <= frei;
      const mit = ANF ? 'Erstellt mit eeziframes' : 'Aufmaß übermittelt mit eeziframes', h0 = HOST ? [HOST] : [];
      /* Durchschrift: vorn der Hinweis, dass Maße und Zeichnungen beim Betrieb liegen */
      if (ANF) {
        const vorn = ['Durchschrift ohne Maße, vollständiges Blatt bei ' + name];
        const v2 = KZ === 'keine' ? [vorn.concat(h0), vorn, ['Durchschrift ohne Maße']] : [vorn.concat([mit]), ['Durchschrift ohne Maße', mit], [mit]];
        for (let k = 0; k < v2.length; k++) { const s2 = v2[k].join(' · '); if (passt(s2)) return s2; }
      }
      const varianten = BKOPF && KZ === 'keine'
        ? [[name].concat(h0, ['Vor der Fertigung Feinaufmaß vor Ort.']), [name].concat(h0), [name]]
        : BKOPF
          ? [[name, mit].concat(h0, ['Vor der Fertigung Feinaufmaß vor Ort.']), [name, mit].concat(h0), [name, ANF ? 'erstellt mit eeziframes' : 'übermittelt mit eeziframes'], [name]]
          : [['Erstellt mit eeziframes', HOST, 'Vor der Fertigung Feinaufmaß vor Ort.'], ['Erstellt mit eeziframes', HOST], ['Erstellt mit eeziframes']];
      for (let k = 0; k < varianten.length; k++) { const s2 = varianten[k].join(' · '); if (passt(s2)) return s2; }
      let kurz = name; while (kurz.length > 1 && !passt(kurz + '...')) kurz = kurz.slice(0, -1);
      return kurz.trim() + '...';
    };
    const fuss = () => {
      const n = doc.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        stroke(LINE); doc.setLineWidth(0.25); doc.line(M, H - 11.5, XR, H - 11.5);
        font('normal', 7.2, GREY);
        const rechts = kennung + ' · Seite ' + i + ' von ' + n;
        txt(fussLinks(XR - M - tw(rechts) - 4), M, H - 7.2);
        txt(rechts, XR, H - 7.2, { align: 'right' });
        streifen(i === 1 ? 30 : 12);
        if (e.beispiel) wasserzeichen(); else if (ANF) wasserzeichen('DURCHSCHRIFT');
      }
      if (fbBox) { doc.setPage(1); fbBox(); }
    };
    /* QR-Code zur Anmeldung (?von=pdf), weiß hinterlegt und anklickbar */
    const QR_URL = (e.portalUrl || '') + '?von=pdf';
    function qr(x, y0, size) {
      try {
        if (!e.qr) return false;
        const q = e.qr(0, 'M'); q.addData(QR_URL); q.make();
        const nq = q.getModuleCount(), cell = size / (nq + 8), x0 = x + 4 * cell, yy = y0 + 4 * cell;
        fill('#ffffff'); rr(x, y0, size, size, 1.2); fill('#000000');
        for (let r = 0; r < nq; r++) for (let c = 0; c < nq; c++) if (q.isDark(r, c)) doc.rect(x0 + c * cell, yy + r * cell, cell + 0.02, cell + 0.02, 'F');
        doc.link(x, y0, size, size, { url: QR_URL });
        return true;
      } catch (err) { return false; }
    }

    /* ---------- Bausteine ---------- */
    /* Etikett in Versalien mit Laufweite; mit o.punkt der violette Punkt davor (Etikett der DNA) */
    const kicker = (s, x, y0, color, o) => { o = o || {}; let x2 = x; if (o.punkt) { fill(VIOLETT); doc.circle(x + 0.9, y0 - 0.95, 0.9, 'F'); x2 = x + 3.2; } font('bold', o.size || 7.2, color || GRUEN_T); txt(VERSAL(s), x2, y0, Object.assign({ charSpace: 0.55 }, o.align ? { align: o.align } : {})); };
    /* Haken: violetter Kreis mit weißem Haken (erreicht, inklusive) */
    const haken = (cx, cy, r) => { fill(VIOLETT); doc.circle(cx, cy, r, 'F'); stroke('#ffffff'); doc.setLineWidth(Math.max(0.25, r * 0.28)); doc.lines([[r * 0.38, r * 0.4], [r * 0.72, -r * 0.82]], cx - r * 0.5, cy + r * 0.02, [1, 1], 'S', false); };
    const punkt = (cx, cy, r, c) => {
      const f = doc.getFont(), fs = doc.getFontSize(), tc = doc.getTextColor(), R = r * 1.3, col = c || WARN;
      fill('#ffffff'); stroke(col); doc.setLineWidth(Math.max(0.18, R * 0.2)); doc.circle(cx, cy, R, 'FD');
      font('extra', R * 4.4, col); txt('!', cx, cy + R * 0.56, { align: 'center' });
      doc.setFont(f.fontName, f.fontStyle); doc.setFontSize(fs); doc.setTextColor(tc);
    };
    /* Chip: Pille im Ton von Indigo ohne Rand (Zustand), Hinweise im Ton der Koralle; art 'ok' mit Haken, 'warn' mit Punkt, sonst ein
       Zeichen der Ausstattung (zeichen()) */
    const chip = (s, x, y0, art, size) => {
      size = size || 7.6; font('bold', size); const hh = size * 0.84, z = art && art !== 'ok' && art !== 'warn', ic = !art ? 0 : z ? hh * 0.6 : hh * 0.62, tx = x + 2.5 + (art ? ic + (z ? 1.4 : 0) : 0), w = tw(s) + (tx - x) + 2.5;
      fill(art === 'warn' ? '#fdeee8' : CHIP); rr(x, y0, w, hh, hh / 2, 'F');
      if (art === 'ok') haken(x + 2.5 + ic / 2 - 0.3, y0 + hh / 2, ic * 0.42); else if (art === 'warn') punkt(x + 2.5 + ic / 2 - 0.3, y0 + hh / 2, ic * 0.28); else if (art) zeichen(art, x + 2.3, y0 + (hh - ic) / 2, ic);
      font('bold', size, art === 'warn' ? WARN : INDIGO); txt(s, tx, y0 + hh * 0.68); return w;
    };
    /* Zeichen der Ausstattung (ein Zeichen je Bedeutung, Legende in der Übersicht): Rollladen Querstäbe, Raffstore schräge Lamellen,
       Screen Tuch, Klappläden zwei Flügel, Insektenschutz Gitter, innen Zickzack (Plissee, Rollo, Jalousie), offen Punkt in Koralle */
    function zeichen(art, x, y0, s) {
      s = s || 4.2; const r = s * 0.2, lw = Math.max(0.2, s * 0.06);
      stroke(INK2); doc.setLineWidth(lw);
      if (art === 'innen') { const n = 4, dx = s / n, pts = []; for (let k = 0; k <= n; k++) pts.push([x + k * dx, y0 + (k % 2 ? s * 0.78 : s * 0.22)]); doc.lines(pts.slice(1).map((q, k) => [q[0] - pts[k][0], q[1] - pts[k][1]]), pts[0][0], pts[0][1], [1, 1], 'S', false); return; }
      if (art === 'offen') { punkt(x + s / 2, y0 + s / 2, s * 0.3); return; }
      fill('#ffffff'); rr(x, y0, s, s, r, 'FD');
      if (art === 'rollladen') { for (let k = 1; k <= 3; k++) doc.line(x + s * 0.16, y0 + k * s / 4, x + s * 0.84, y0 + k * s / 4); }
      else if (art === 'raffstore') { for (let k = 1; k <= 3; k++) doc.line(x + s * 0.18, y0 + k * s / 4 + s * 0.09, x + s * 0.82, y0 + k * s / 4 - s * 0.09); }
      else if (art === 'screen') { fill(SILBER); doc.rect(x + s * 0.18, y0 + s * 0.16, s * 0.64, s * 0.5, 'F'); doc.line(x + s * 0.12, y0 + s * 0.76, x + s * 0.88, y0 + s * 0.76); }
      else if (art === 'klappladen') { doc.line(x + s / 2, y0 + s * 0.14, x + s / 2, y0 + s * 0.86); for (let k = 1; k <= 3; k++) { doc.line(x + s * 0.16, y0 + k * s / 4, x + s * 0.4, y0 + k * s / 4); doc.line(x + s * 0.6, y0 + k * s / 4, x + s * 0.84, y0 + k * s / 4); } }
      else if (art === 'insekt') { for (let k = 1; k <= 2; k++) { doc.line(x + k * s / 3, y0 + s * 0.14, x + k * s / 3, y0 + s * 0.86); doc.line(x + s * 0.14, y0 + k * s / 3, x + s * 0.86, y0 + k * s / 3); } }
    }
    /* Code einer Position als Etikett: Ton von Indigo, Schrift Indigo 600; gross: Indigo voll, Schrift weiß */
    const codeTag = (code, x, y0, gross) => {
      const size = gross ? 12 : 8; font('extra', size); const w = Math.max(tw(code) + (gross ? 6 : 4), gross ? 22 : 15), hh = gross ? 12 : 5.6;
      fill(gross ? INDIGO : CHIP); rr(x, y0, w, hh, gross ? 2.6 : 1.6); font('extra', size, gross ? '#ffffff' : INDIGO); txt(code, x + w / 2, y0 + hh / 2 + size * 0.13, { align: 'center' }); return w;
    };
    /* Kapselreihe (G11): n von gesamt als Reihe abgerundeter Stäbchen, erreicht violett, Rest schraffiert */
    function kapseln(n, gesamt, x, y0, breite, hh) {
      const k = Math.max(1, Math.min(20, gesamt)), voll = gesamt ? Math.round(n / gesamt * k) : 0, gap = 1.1, bw = Math.min(3.2, (breite - gap * (k - 1)) / k);
      for (let j = 0; j < k; j++) {
        const x0 = x + j * (bw + gap);
        if (j < voll) { fill(VIOLETT); rr(x0, y0, bw, hh, bw / 2); }
        else { stroke(SILBER); doc.setLineWidth(0.2); fill('#ffffff'); rr(x0, y0, bw, hh, bw / 2, 'FD'); for (let q = -hh; q < bw; q += 1.1) { const a = Math.max(0, q), b = Math.min(bw, q + hh); if (b > a) doc.line(x0 + a, y0 + hh - (a - q), x0 + b, y0 + hh - (b - q)); } }
      }
      return k * bw + (k - 1) * gap;
    }
    const swatch = (hex, x, cy, r) => { fill(hex); stroke(LINE); doc.setLineWidth(0.25); doc.circle(x, cy, r || 1.6, 'FD'); };
    /* Karte: weiß mit feinem Rand im Ton von Silbergrau (wie --kachel-rand der Website), Rundung 3 mm; o.fuell für Hinweise im Ton der
       Koralle, nie ein farbiger Seitenbalken */
    const karteRand = (x, y0, w, h2, o) => { o = o || {}; stroke(o.rand || LINE); doc.setLineWidth(o.dick || 0.35); fill(o.fuell || '#ffffff'); rr(x, y0, w, h2, 3, 'FD'); };
    /* Zeilen [Begriff, Wert, { swatch, bold, col, offen }], Begriffsspalte lw */
    const ZL = (fs) => fs * 0.44;
    function zeilenH(rows, w, o) { const lw = o.lw || 26, fs = o.fs || 8; let hh = 0; rows.forEach((r) => { font('normal', fs); const v = wrap(r[1], w - lw - (r[2] && (r[2].swatch || r[2].offen) ? 4.5 : 0)); font('normal', fs - 0.6); const k = wrapK(r[0], lw - 2); hh += Math.max(v.length, k.length, 1) * ZL(fs) + 1.3; }); return hh; }
    function zeilen(rows, x, y0, w, o) {
      const lw = o.lw || 26, fs = o.fs || 8; let yy = y0;
      rows.forEach((r) => {
        const x2 = r[2] || {};
        font('normal', o.lfs || fs - 0.6, o.lc || GREY); const kl2 = wrapK(r[0], lw - 2); txt(kl2, x, yy + 3);
        let vx = x + lw;
        if (x2.swatch) { swatch(x2.swatch, vx + 1.7, yy + 2, 1.6); vx += 4.5; } else if (x2.offen) { punkt(vx + 1.2, yy + 2, 0.95); vx += 4.5; }
        font(x2.bold || x2.offen ? 'bold' : 'normal', fs, x2.col || (x2.offen ? WARN : INK)); const v = wrap(r[1], w - (vx - x)); txt(v, vx, yy + 3);
        yy += Math.max(v.length, kl2.length, 1) * ZL(fs) + 1.3;
      });
      return yy - y0;
    }
    /* Notiz des Kunden: Zitat mit Strich links, Stelle darüber */
    const notizH = (n, w) => { font('normal', 8); return 3.6 + wrap('„' + n[1] + '“', w - 5).length * ZL(8) + 1.6; };
    function notiz(n, x, y0, w) {
      const hh = notizH(n, w); fill(INK); doc.rect(x, y0 + 0.6, 0.7, hh - 1.8, 'F');
      font('bold', 6.8, GREY); txt(VERSAL(n[2] === 'notiz' ? (sie ? 'Notiz des Kunden' : 'Deine Notiz') : (sie ? 'Notiz des Kunden zu ' : 'Deine Notiz zu ') + n[0]), x + 3, y0 + 2.4, { charSpace: 0.3 });
      font('normal', 8, INK); txt(wrap('„' + n[1] + '“', w - 5), x + 3, y0 + 5.8); return hh;
    }
    /* Überschrift eines Abschnitts: Kicker, Überschrift mit Punkt, Linie */
    function sektion(k, titel, rechts) { platz(18); kicker(k, M, y, GREY); y += 7; font('extra', 16, INK); txt(titel, M, y); if (rechts) { font('normal', 8.4, GREY); txt(rechts, XR, y, { align: 'right' }); } stroke(INK); doc.setLineWidth(0.4); doc.line(M, y + 2.6, XR, y + 2.6); y += 8; }

    /* ---------- Zeichnung aus modell.js (AW.plan): dieselben Teile wie im Betriebsbereich, hier mit jsPDF ---------- */
    function planZeichnen(pl, x0, y0) {
      pl.teile.forEach((p) => {
        if (p.t === 'poly') {
          if (p.o != null && p.o < 1) alpha(p.o);
          const mode = p.f && p.s ? 'FD' : p.f ? 'F' : 'S';
          if (p.f) fill(pf(p.f)); if (p.s) { stroke(pf(p.s)); doc.setLineWidth(Math.max(0.05, p.w)); } dash(p.d);
          if (p.r) rr(x0 + p.p[0][0], y0 + p.p[0][1], p.p[1][0] - p.p[0][0], p.p[2][1] - p.p[1][1], p.r, mode);
          else doc.lines(p.p.slice(1).map((q, k) => [q[0] - p.p[k][0], q[1] - p.p[k][1]]), x0 + p.p[0][0], y0 + p.p[0][1], [1, 1], mode, true);
          dash(null); if (p.o != null && p.o < 1) alpha(1);
        } else if (p.t === 'line') {
          if (p.o != null && p.o < 1) alpha(p.o);
          stroke(pf(p.s)); doc.setLineWidth(Math.max(0.05, p.w)); dash(p.d);
          doc.line(x0 + p.p[0][0], y0 + p.p[0][1], x0 + p.p[1][0], y0 + p.p[1][1]);
          dash(null); if (p.o != null && p.o < 1) alpha(1);
        } else if (p.t === 'text') {
          font(p.b >= 800 ? 'extra' : p.b >= 700 ? 'bold' : 'normal', p.g / 0.3528, pf(p.c));
          const w2 = tw(p.s), x = x0 + p.x, yy = y0 + p.y, versatz = p.g * 0.36;
          if (p.bg) { const bw = w2 + p.g * 0.6, bh = p.g * 1.25; fill(pf(p.bg)); if (p.r) rr(x - bh / 2, yy - bw / 2, bh, bw, bh / 2); else rr(x - bw / 2, yy - bh / 2, bw, bh, bh / 2); }
          if (p.r) txt(p.s, x + versatz, yy + w2 / 2, { angle: 90 });
          else txt(p.s, p.a === 'middle' ? x - w2 / 2 : p.a === 'end' ? x - w2 : x, yy + versatz);
        }
      });
    }
    /* Kleines Fenster für Tabellen: nur das Element, in den Rahmen s × s eingepasst */
    function mini(w, x, y0, s) { const pl = AW.plan(w, { nurElement: true, b: s, h: s, fs: 1.4 }); planZeichnen(pl, x, y0 + (s - pl.h) / 2); }
    const offen = (w, k) => AW.istOffen(w, k);
    const OT = AW.OFFEN_TEXT;

    /* ---------- Seite 1: Übersicht ---------- */
    const FS = 8.4;
    y = kopfband(true) + 10;
    const gebText = [AW.lab('gebaeude', pr.gebaeude), pr.baujahr ? 'Baujahr ' + pr.baujahr : ''].filter(Boolean).join(', ');
    if (BKOPF) {
      kicker(ANF ? (sie ? 'Ihre Anfrage' : 'Deine Anfrage') + (bt.name ? ' bei ' + bt.name : '') : 'Aufmaß vom Kunden · fürs Angebot', M, y); y += 9;
      font('extra', 24, INK); txt(wrap((kd.name || 'Kunde') + '.', CW)[0], M, y); y += 7;
      font('normal', 10, INK2); txt(wrap([kd.adresse, gebText].filter(Boolean).join(' · ') || 'Objekt ohne Adresse', CW)[0], M, y); y += 6;
    } else {
      kicker(V === 'kunde' ? 'Dein Fenster-Aufmaß' : 'Fenster-Aufmaß Ihres Kunden', M, y); y += 9;
      font('extra', 24, INK); txt(wrap(V === 'kunde' ? (pr.name ? pr.name + '.' : 'Dein Aufmaß.') : (pr.name || 'Aufmaß für Ihr Angebot') + '.', CW)[0], M, y); y += 7;
      font('normal', 10, INK2); txt(wrap([pr.ort, gebText].filter(Boolean).join(' · ') || 'Selbst gemessen, Schritt für Schritt geführt', CW)[0], M, y); y += 6;
    }
    /* Durchschrift: der Hinweis steht oben, vor allem anderen (was sie zeigt, wo die Maße liegen, wie man das vollständige Blatt
       bekommt); die Kontaktzeile bricht nur zwischen den Angaben um, nie in einer Telefonnummer */
    if (ANF) {
      const nr = bt.nr || '';
      const s1 = sie ? 'Diese Durchschrift zeigt Ihre Fenster, die Ausstattung und Ihre Wünsche, ohne Maße. Maße, Zeichnungen und die Auswertung Ihrer Fotos liegen bei ' + bnK + '; vor der Fertigung misst ' + bnK + ' ohnehin bei Ihnen vor Ort nach.'
        : 'Diese Durchschrift zeigt deine Fenster, die Ausstattung und deine Wünsche, ohne Maße. Maße, Zeichnungen und die Auswertung deiner Fotos liegen bei ' + bnK + '; vor der Fertigung misst ' + bnK + ' ohnehin bei dir vor Ort nach.';
      const s2 = sie ? 'Das vollständige Aufmaßblatt mit Maßen schickt ' + bnK + ' Ihnen auf Anfrage als PDF' + (nr ? '; bitte nennen Sie dabei die Nummer ' + nr : '') + '.'
        : 'Das vollständige Aufmaßblatt mit Maßen schickt ' + bnK + ' dir auf Anfrage als PDF' + (nr ? '; nenn dabei die Nummer ' + nr : '') + '.';
      const angaben = [bt.ap ? 'Ansprechperson: ' + bt.ap : '', bt.tel ? 'Telefon ' + bt.tel : '', bt.mail || '', bt.host || ''].filter(Boolean);
      font('bold', 8.4); const kz = []; angaben.forEach((a) => { const z = kz.length ? kz[kz.length - 1] + '  ·  ' + a : a; if (kz.length && tw(z) <= CW - 10) kz[kz.length - 1] = z; else kz.push(a); });
      font('normal', 8.4); const l1 = wrap(s1, CW - 10); font('bold', 8.4); const l2 = wrap(s2, CW - 10), hh = 10 + (l1.length + l2.length) * 3.7 + (kz.length ? 1.6 + kz.length * 3.9 : 0) + 3;
      karteRand(M, y, CW, hh, { fuell: '#fff7f3', rand: '#f6d6c9' }); kicker(sie ? 'Ihre Durchschrift · ohne Maße' : 'Deine Durchschrift · ohne Maße', M + 5, y + 6, WARN);
      let by = y + 11.2;
      font('normal', 8.4, INK2); txt(l1, M + 5, by, { lineHeightFactor: 1.3 }); by += l1.length * 3.7 + 0.6;
      font('bold', 8.4, INK); txt(l2, M + 5, by, { lineHeightFactor: 1.3 }); by += l2.length * 3.7 + 1.6;
      font('normal', 8.4, INK); kz.forEach((z) => { txt(z, M + 5, by); by += 3.9; });
      y += hh + 7;
    }
    /* Kennzahlen (ab zwei Positionen): Fenster und Türen, Geschosse, Sonnenschutz, offene Punkte (Koralle mit Prüfzeichen, führt zur
       Klärungsliste); rechts die Vollständigkeit der Maße als Kapselreihe */
    const klOffen = kl.filter((r) => !geklaert(r)), nPflicht = klOffen.filter((r) => r.gruppe === 'pflicht').length;
    if (wins.length > 1) {
      const zahlenK = [[nE, nE === wins.length ? 'Fenster und Türen' : 'Elemente in ' + wins.length + ' Positionen'], [BEREICHE.length, BEREICHE.length === 1 ? 'Geschoss' : 'Geschosse'], [nSonne, 'mit Sonnenschutz außen'], [klOffen.length, 'zu klären' + (nPflicht ? ', davon ' + nPflicht + ' Pflicht' : ''), true]];
      const zw = 27; let zx = M;
      zahlenK.forEach((z) => {
        const warn = z[2] && z[0] > 0;
        font('normal', 26, warn ? WARN : INK); txt(String(z[0]), zx, y + 8.6); if (warn) punkt(zx + tw(String(z[0])) + 2.6, y + 2.2, 1.05);
        font('normal', 7.4, GREY); txt(wrap(z[1], zw - 3).slice(0, 2), zx, y + 13.2, { lineHeightFactor: 1.15 });
        if (z[2]) verweis(zx, y - 1, zw - 2, 19, seiteVon('abschnitt', 'klaerung'));
        zx += zw;
      });
      const kx = M + 4 * zw + 4, kb = XR - kx;
      kicker(ANF ? 'Maße erfasst' : 'Maße vom Kunden', kx, y + 2.6, GREY); font('extra', 8.4, INK); txt(nKomplett + ' von ' + wins.length + (ANF ? '' : ' vollständig'), XR, y + 2.6, { align: 'right' });
      kapseln(nKomplett, wins.length, kx, y + 5.2, kb, 4.4);
      font('normal', 7.4, GREY); txt(wrap((ANF ? 'Maße bei ' + bnK + ' · ' : '8 Maße je Fenster · Feinaufmaß folgt · ') + fotoText, kb).slice(0, 2), kx, y + 13.2, { lineHeightFactor: 1.15 });
      y += 22;
    }
    const fw = AW.foerdWeg(pr), tot = num(pr.total);
    /* Wie genau geplant wurde (Detailtiefe): beim Kunden „Deine Planung“, sonst „Geplant“ mit „nach Ihrem Standard“ */
    const tiefeT = AW.tiefeKopf ? AW.tiefeKopf(wins, pr, sie) : '';
    const eck = [['Gebäude', gebText || '–'], ['Fenster im Haus', tot ? nE + ' von ' + tot + ' werden getauscht' : 'nicht angegeben'], ['Zeitraum', AW.lab('zeit', pr.zeit) || '–'], ['Budget', AW.lab('budget', pr.budget) || '–'], ['Förderung', fw && fw !== 'keine' ? AW.lab('foerdweg', fw) || fw : 'keine Angabe']].concat(tiefeT ? [[V === 'kunde' ? 'Deine Planung' : 'Geplant', tiefeT]] : []);
    const kontaktZ = [['Name', pr.name || '–'], ['Ort', pr.ort || '–'], ['Telefon', pr.tel || '–'], ['E-Mail', pr.mail || '–'], ['Erreichbar', ERREICH[pr.erreich] || '–']].filter((r) => r[1] !== '–');
    if (e.fotoHinweis) eck.push(['Fotos', String(e.fotoHinweis)]);
    if (!BKOPF) {
      /* Der Weg: vier Schritte erledigt (Haken und Wort), der fünfte ist der nächste. Ehrlich gezählt: fehlt etwas, steht es offen da. */
      const wegS = [
        { t: 'Fotografiert', d: nF ? nF + (nF === 1 ? ' Foto' : ' Fotos') + ', von der KI gelesen' : 'ohne Fotos', ok: nF > 0 },
        { t: 'Gemessen', d: komplett ? '8 Maße je Fenster, von Hand' : 'Maße teilweise offen', ok: komplett },
        { t: 'Wünsche festgelegt', d: 'Teilung, Farbe, Glas, Extras', ok: wins.length > 0 },
        { t: 'Aufmaßblatt erstellt', d: 'am ' + heute, ok: true },
        { t: V === 'kunde' ? 'Jetzt senden' : 'Ihr Schritt: Angebot', d: V === 'kunde' ? 'an beliebig viele Fensterbauer, Angebote vergleichen' : 'auf Grundlage dieses Blatts', jetzt: true }
      ];
      const erledigt = wegS.filter((x) => x.ok).length, sw5 = CW / 5, r5 = 3.4, wy = y + 8;
      kicker((V === 'kunde' ? 'Dein Weg zu neuen Fenstern' : 'Was Ihr Kunde schon erledigt hat') + ' · ' + erledigt + ' von 5 Schritten erledigt', M, y + 1, INK2);
      wegS.forEach((x, i) => { if (i === 4) return; const x1 = M + i * sw5 + 2 * r5 + 1.5, x2 = M + (i + 1) * sw5 - 1.5; stroke(x.ok && (wegS[i + 1].ok || wegS[i + 1].jetzt) ? INK : LINE); doc.setLineWidth(0.6); dash(i === 3 ? [1.1, 0.9] : null); doc.line(x1, wy, x2, wy); dash(null); });
      wegS.forEach((x, i) => {
        const x0 = M + i * sw5, mx = x0 + r5;
        if (x.jetzt) { fill('#ffffff'); stroke(INK); doc.setLineWidth(0.9); doc.circle(mx, wy, r5, 'FD'); fill(INK); doc.circle(mx, wy, 1.3, 'F'); }
        else if (x.ok) haken(mx, wy, r5);
        else { fill('#ffffff'); stroke(WARN); doc.setLineWidth(0.8); doc.circle(mx, wy, r5, 'FD'); font('extra', 8, WARN); txt('!', mx, wy + 2.8, { align: 'center' }); }
        font('bold', 9, INK); txt(wrap(x.t, sw5 - 3)[0], x0, wy + 9);
        font('normal', 7.8, x.ok || x.jetzt ? INK2 : WARN); txt(wrap((x.ok ? 'Erledigt · ' : x.jetzt ? '' : 'Offen · ') + x.d, sw5 - 4).slice(0, 2), x0, wy + 13, { lineHeightFactor: 1.2 });
      });
      y = wy + 21;
      /* Links Eckdaten, rechts die Box für den Fensterbauer, mit einer Spitze am letzten Schritt angeschlossen */
      const fbW = 82, ekW = CW - fbW - 5, fbX = XR - fbW, oFb = { lw: 19, fs: 8 }, oEk = { lw: 25, fs: FS };
      const fbZeilen = (seite) => kontaktZ.concat([['Maße', 'in mm, Breite × Höhe, Ansicht von innen; Maueröffnung: kleinstes von drei Maßen'], ['Digital', '„Code vom Kunden einfügen“ in eeziframes, Code auf Seite ' + seite + '; die ersten 3 Projekte sind frei'], ['Danach', 'Angebot, vor der Fertigung Feinaufmaß vor Ort']]);
      const fbTitel = V === 'kunde' ? 'Für deinen Fensterbauer' : 'Für Sie als Fensterbauer';
      const hFb = 11 + zeilenH(fbZeilen(99), fbW - 8, oFb) + 3, hEk = 11 + zeilenH(eck, ekW - 8, oEk) + 3, hb = Math.max(hFb, hEk);
      karteRand(M, y, ekW, hb); kicker('Eckdaten zum Projekt', M + 4, y + 6, GREY); zeilen(eck, M + 4, y + 9, ekW - 8, oEk);
      const by0 = y, sx = M + 4 * sw5 + r5;
      fbBox = () => {
        karteRand(fbX, by0, fbW, hb, { rand: INK, dick: 0.5 });
        /* Spitze zum Schritt „an den Fensterbauer“ */
        fill('#ffffff'); doc.triangle(sx - 2.6, by0 + 0.25, sx + 2.6, by0 + 0.25, sx, by0 - 2.8, 'F'); stroke(INK); doc.setLineWidth(0.5); doc.line(sx - 2.6, by0, sx, by0 - 2.8); doc.line(sx, by0 - 2.8, sx + 2.6, by0);
        kicker(fbTitel, fbX + 4, by0 + 6, INK); zeilen(fbZeilen(codeSeite || 99), fbX + 4, by0 + 9, fbW - 8, oFb);
      };
      y += hb + 9;
    } else {
      /* Ihr Kunde und Eckdaten nebeneinander, dann die Übersicht aller Positionen mit Bestellmaß */
      const halb = (CW - 5) / 2, oB = { lw: 22, fs: FS }, kb = [[ANF ? 'Name' : 'Kunde', kd.name || '–'], ['Kontakt', kd.kontakt || '–']].concat((Array.isArray(kd.mehr) ? kd.mehr : []).filter((r) => r && r[1]).slice(0, 3).map((r) => [String(r[0]), String(r[1])]), [['Objekt', kd.adresse || '–']]);
      const hk = 11 + zeilenH(kb, halb - 8, oB) + 3, he = 11 + zeilenH(eck, halb - 8, { lw: 26, fs: FS }) + 3, hm = Math.max(hk, he);
      karteRand(M, y, halb, hm); kicker(ANF ? (sie ? 'Ihre Angaben' : 'Deine Angaben') : 'Ihr Kunde', M + 4, y + 6, GREY); zeilen(kb, M + 4, y + 9, halb - 8, oB);
      karteRand(M + halb + 5, y, halb, hm); kicker('Eckdaten zum Projekt', M + halb + 9, y + 6, GREY); zeilen(eck, M + halb + 9, y + 9, halb - 8, { lw: 26, fs: FS });
      y += hm + 9;
      uebersicht();
    }

    /* Übersicht je Geschoss: Code, Zeichnung, Position (Raum, Art, Flügel, Stück), Maße (Maueröffnung, Element, beim Betrieb das
       Bestellmaß), Ausstattung als Zeichen, Seite; jede Zeile führt zur Seite der Position. Durchschrift: Ausstattung als Text, ohne Maße */
    function uebersicht() {
      platz(42);
      SEITEN.abschnitt.uebersicht = seiteNr();
      sektion(wins.length + (wins.length === 1 ? ' Position' : ' Positionen') + ' · ' + nE + (nE === 1 ? ' Element' : ' Elemente') + ' · nach Geschoss' + (BEST ? ' · mit Bestellmaß' : ''), 'Übersicht.', ANF ? 'Maße beim Fensterbauer' : 'Maße in mm · Breite × Höhe');
      /* Legende der Zeichen mit Kürzel und Wort (nie nur das Zeichen), auf jeder Seite der Übersicht */
      const legende = () => {
        font('normal', 7, GREY); txt('Zeichen:', M, y); let lx = M + tw('Zeichen:') + 2.5;
        ZEICHEN_A.forEach((z) => { zeichen(z[0], lx, y - 2.8, 3.3); font('bold', 6.4, INK2); txt(z[1], lx + 4.1, y); const kx = lx + 4.1 + tw(z[1]) + 1; font('normal', 7, GREY); txt(z[2], kx, y); lx = kx + tw(z[2]) + 3.2; });
        punkt(lx + 1.3, y - 1.1, 0.95); font('normal', 7, GREY); txt('vor Ort prüfen', lx + 3.6, y);
        y += 5;
      };
      legende();
      const MASS = !ANF, cB = 18, cM = 11, cS = 10, cA = ANF ? 68 : 19, mB = MASS ? 23 : 0, bB = BEST ? 26 : 0;
      const cP = CW - cB - cM - cS - cA - 2 * mB - bB;
      const cols = [['Code', cB], ['', cM], ['Position', cP]].concat(MASS ? [['Öffnung', mB], ['Element', mB]] : [], BEST ? [['Bestellmaß', bB]] : [], [['Ausstattung', cA], ['Seite', cS]]);
      const cX = []; let ax = M; cols.forEach((c) => { cX.push(ax); ax += c[1]; });
      const kopf = () => { font('bold', 6.4, GREY); cols.forEach((c, k) => { if (c[0]) txt(VERSAL(c[0]), cX[k] + (k === cols.length - 1 ? c[1] - 1.2 : 0), y, { align: k === cols.length - 1 ? 'right' : 'left', charSpace: 0.3 }); }); y += 1.8; stroke(INK); doc.setLineWidth(0.35); doc.line(M, y, XR, y); y += 0.4; };
      kopf();
      BEREICHE.forEach((b) => {
        const nEb = b.idx.reduce((a, i) => a + (num(wins[i].anzahl) || 1), 0);
        const band = (fort) => { fill(LINE_F); doc.rect(M, y, CW, 6.4, 'F'); font('extra', 8.6, INK); txt(b.name + (fort ? ', Fortsetzung' : ''), M + 2, y + 4.4); font('normal', 7.2, GREY); txt(b.idx.length + (b.idx.length === 1 ? ' Position' : ' Positionen') + ' · ' + nEb + (nEb === 1 ? ' Element' : ' Elemente'), XR - 2, y + 4.4, { align: 'right' }); y += 6.4; };
        if (y + 6.4 + 12.5 > unten()) { neueSeite(); legende(); kopf(); }
        band(false);
        b.idx.forEach((i) => {
          const w = wins[i], d = AW.derive(w), bm = BEST ? AW.bestellmass(w, ab) : null, aus = AUS[i], n = num(w.anzahl) || 1;
          const fl = (w.art || 'fenster') === 'fenster' || w.art === 'balkon' ? AW.oeffnungKurz(w).split(' · ').filter((x) => /Flügel|Seitenteil|Oberlicht|Festfeld/.test(x)).join(' · ') : '';
          const zeile2 = [ARTNAME[w.art] || 'Fenster', fl, n > 1 ? n + ' Stück' : ''].filter(Boolean).join(' · ');
          let ausZ = []; if (ANF) { font('normal', 7.2); ausZ = wrap(aus.length ? aus.map((a) => a.t).join(' · ') : 'ohne Sonnen- und Insektenschutz', cA - 2).slice(0, 3); }
          const rh = Math.max(12.5, ausZ.length * 3.1 + 5);
          if (y + rh > unten()) { neueSeite(); legende(); kopf(); band(true); }
          const ty = y + rh / 2 + 1.2, ziel = seiteVon('pos', i);
          codeTag(CODE[i], cX[0], y + rh / 2 - 2.8);
          mini(w, cX[1], y + (rh - 9) / 2, 9);
          font('extra', 8.8, INK); txt(wrap(posName(i), cP - 3)[0], cX[2], ty - 1.6);
          font('normal', 7.2, INK2); txt(wrap(zeile2, cP - 3)[0], cX[2], ty + 2.4);
          let k = 3;
          if (MASS) { font('normal', 8.2, INK2); massZelle(d.moW, d.moH, cX[k], ty); massZelle(d.elW, d.elH, cX[k + 1], ty); k += 2; }
          if (BEST) { font('extra', 8.6, INK); const rx2 = massZelle(bm && bm.b, bm && bm.h, cX[k], ty); if (bm && bm.warn.length) punkt(rx2 + 2.4, ty - 1.1, 0.9); k += 1; }
          if (ANF) { font('normal', 7.2, INK2); txt(ausZ, cX[k], y + rh / 2 - (ausZ.length - 1) * 1.55 + 1.1, { lineHeightFactor: 1.2 }); }
          else { let zx = cX[k]; aus.slice(0, 3).forEach((a) => { zeichen(a.z, zx, ty - 3.6, 3.9); const ku = KUERZEL[a.z]; if (ku) { font('bold', 5.4, INK2); txt(ku, zx + 1.95, ty + 3.1, { align: 'center' }); } zx += 5; }); if (aus.length > 3) { font('bold', 7, GREY); txt('+' + (aus.length - 3), zx, ty); } }
          font('extra', 8.2, ziel ? INDIGO : GREY); txt(String(ziel || '–'), XR, ty, { align: 'right' });
          verweis(M, y, CW, rh, ziel);
          y += rh; stroke(LINE); doc.setLineWidth(0.2); doc.line(M, y, XR, y);
        });
      });
      font('normal', 7.2, GREY);
      const lg = ANF ? wrap('Code aus Geschoss und Nummer, z. B. ' + (CODE[ORDER[0]] || 'EG-01') + '. ' + 'Maße, Zeichnungen und die Auswertung ' + (sie ? 'Ihrer' : 'deiner') + ' Fotos stehen im vollständigen Aufmaßblatt bei ' + (bt.name || 'dem Fensterbauer') + '. Seite: Seite in dieser Durchschrift.', CW)
        : !BEST ? wrap('Code aus Geschoss und Nummer, z. B. ' + (CODE[ORDER[0]] || 'EG-01') + '. Maueröffnung: das kleinste von drei Maßen. Element: das sichtbare Fenster mit Rahmen. Seite: jede Zeile führt zur Position. Vor der Fertigung misst ' + (bt.name || 'der Fensterbauer') + ' vor Ort nach.', CW)
        : wrap('Bestellmaß: Ihr Abzug von der Maueröffnung (' + ab.seite + ' mm je Seite, ' + ab.oben + ' mm oben' + (ab.unten ? ', ' + ab.unten + ' mm unten bei Fenstern' : '') + (ab.untenT ? ', ' + ab.untenT + ' mm unten bei Türen' : '') + '). Ring mit Ausrufezeichen: vor Ort prüfen, Hinweis bei der Position. Code aus Geschoss und Nummer; jede Zeile führt zur Seite der Position. Verbindlich bleibt Ihr Feinaufmaß.', CW);
      txt(lg, M, y + 4, { lineHeightFactor: 1.25 }); y += 4 + lg.length * 3.1 + 6;
    }

    /* Aufstellung nach Gewerk: was zu bestellen und einzuplanen ist, mit Stückzahl und den Positionen (Codes anklickbar) */
    function aufstellung() {
      const gruppen = [];
      const dazu = (titel, label, i, stk) => { let g = gruppen.find((x) => x.titel === titel); if (!g) { g = { titel: titel, zeilen: [] }; gruppen.push(g); } let z = g.zeilen.find((x) => x.label === label); if (!z) { z = { label: label, stk: 0, pos: [] }; g.zeilen.push(z); } z.stk += stk; if (z.pos.indexOf(i) < 0) z.pos.push(i); };
      ORDER.forEach((i) => {
        const w = wins[i], n = num(w.anzahl) || 1;
        const mat = AW.istOffen(w, 'material') ? 'Material offen' : AW.lab('material', w.material) || 'Kunststoff';
        const fa = AW.istOffen(w, 'fa') ? 'außen offen' : 'außen ' + AW.farbe(w, 'aussen')[0], fi = AW.istOffen(w, 'fi') ? 'innen offen' : 'innen ' + AW.farbe(w, 'innen')[0];
        dazu('Fenster und Türen', (ARTNAME[w.art] || 'Fenster') + ', ' + mat + ', ' + fa + ', ' + fi, i, n);
        AUS[i].forEach((a) => dazu(a.k === 'aussen' ? 'Sonnenschutz außen' : a.k === 'innen' ? 'Sicht- und Blendschutz innen' : 'Insektenschutz', a.gruppe, i, n));
        dazu('Glas', AW.istOffen(w, 'glas') ? 'Verglasung offen' : (AW.lab('glas', w.glas) || '3-fach') + '-Verglasung', i, n);
        (w.glasfn || []).forEach((g) => dazu('Glas', (AW.lab('glasfn', g) || g) + (g === 'sicht' && w.orn ? ' (' + (AW.lab('orn', w.orn) || w.orn) + ')' : ''), i, n));
        if (w.rc && w.rc !== 'basis' && !AW.istOffen(w, 'rc')) dazu('Sicherheit', 'Einbruchschutz ' + (AW.lab('rc', w.rc) || w.rc), i, n);
        if (w.absturz && w.absturz !== 'balkon') dazu('Sicherheit', 'Absturzsicherung: ' + (AW.lab('absturz', w.absturz) || w.absturz), i, n);
        if (AUS[i].some((a) => a.strom)) dazu('Strom und Antrieb', w.ki && w.ki.fach && w.ki.fach.strom === true ? 'Strom am Fenster laut Foto vorhanden' : 'Strom für den Antrieb klären, gegebenenfalls Elektriker', i, n);
        if (AUS[i].some((a) => a.solar)) dazu('Strom und Antrieb', 'Solarantrieb, ohne Stromanschluss', i, n);
        if (w.griff === 'motor') dazu('Strom und Antrieb', 'Elektrischer Antrieb am Flügel', i, n);
        const mt = AW.montageText ? AW.montageText(w) : ''; if (mt) dazu('Montage', mt, i, n);
      });
      const FOLGE = ['Fenster und Türen', 'Sonnenschutz außen', 'Sicht- und Blendschutz innen', 'Insektenschutz', 'Glas', 'Sicherheit', 'Strom und Antrieb', 'Montage'];
      gruppen.sort((a, b) => FOLGE.indexOf(a.titel) - FOLGE.indexOf(b.titel));
      /* Sonnenschutz außen nach Art, mit Summe je Art („Raffstore 3 · Rollladen 5“) */
      const ARTEN = ['Rollladen', 'Raffstore', 'Screen', 'Klappläden'], artVon = (l) => { const k = ARTEN.findIndex((x) => l.indexOf(x) === 0); return k < 0 ? 9 : k; };
      gruppen.forEach((g) => {
        if (g.titel !== 'Sonnenschutz außen') return;
        g.zeilen.sort((a, b) => artVon(a.label) - artVon(b.label));
        const sum = {}; g.zeilen.forEach((z) => { const a = ARTEN[artVon(z.label)] || 'Weitere'; sum[a] = (sum[a] || 0) + z.stk; });
        g.summe = Object.keys(sum).map((a) => a + ' ' + sum[a]).join(' · ');
      });
      const ghVon = (g) => 6.6 + (g.summe ? 5 : 0) + g.zeilen.reduce((a, z) => { font('normal', 8.2); return a + Math.max(wrap(z.label, Math.round(CW * 0.5) - 2).length * 3.6, 5.4 * Math.ceil(z.pos.length / 5)) + 2.2; }, 0);
      platz(36);
      SEITEN.abschnitt.aufstellung = seiteNr();
      sektion('Nach Gewerk, mit den Positionen', 'Aufstellung.', 'Stück · Positionen');
      const cL = Math.round(CW * 0.5), cN = 12, cPx = M + cL + cN + 5, cPw = XR - cPx;
      gruppen.forEach((g) => {
        if (y + 6.6 + 12 > unten() || (y + ghVon(g) > unten() && 30 + ghVon(g) < unten())) neueSeite(); // ein Gewerk nicht über den Umbruch, wenn es auf eine Seite passt
        const titelG = (fort) => { font('bold', 6.8, GREY); txt(VERSAL(g.titel + (fort ? ', Fortsetzung' : '')), M, y + 3.2, { charSpace: 0.4 }); stroke(LINE); doc.setLineWidth(0.25); doc.line(M, y + 4.6, XR, y + 4.6); y += 6.6; };
        titelG(false);
        if (g.summe) { font('bold', 8, INK); txt(g.summe, M, y + 2.4); y += 5; }
        g.zeilen.forEach((z) => {
          font('normal', 8.2); const ll = wrap(z.label, cL - 2);
          font('bold', 7.4); let px = 0, zc = 1; z.pos.forEach((i) => { const cw = tw(CODE[i]) + 4; if (px + cw > cPw && px > 0) { zc++; px = 0; } px += cw + 1.4; });
          const rh = Math.max(ll.length * 3.6, zc * 5.4) + 2.2;
          if (y + rh > unten()) { neueSeite(); titelG(true); }
          font('normal', 8.2, INK); txt(ll, M, y + 3.4, { lineHeightFactor: 1.25 });
          font('extra', 9, INK); txt(String(z.stk), M + cL + cN, y + 3.4, { align: 'right' });
          let cx2 = cPx, cy2 = y;
          z.pos.forEach((i) => { font('bold', 7.4); const cw = tw(CODE[i]) + 4; if (cx2 + cw > XR + 0.1 && cx2 > cPx) { cx2 = cPx; cy2 += 5.4; } fill(CHIP); rr(cx2, cy2 + 0.3, cw, 4.6, 2.3); font('bold', 7.4, INDIGO); txt(CODE[i], cx2 + cw / 2, cy2 + 3.5, { align: 'center' }); verweis(cx2, cy2 + 0.3, cw, 4.6, seiteVon('pos', i)); cx2 += cw + 1.4; });
          y += rh; stroke(LINE_F); doc.setLineWidth(0.2); doc.line(M, y - 0.5, XR, y - 0.5);
        });
        y += 3;
      });
      y += 3;
    }

    /* ---------- Klärungsliste: nach Gruppen, je Punkt Position, was, warum; im Betrieb mit Stand ---------- */
    const klTitel = V === 'kunde' ? 'Noch zu klären, dein Fensterbauer berät dich' : ANF ? (sie ? 'Noch zu klären, wir beraten Sie gern' : 'Noch zu klären, wir beraten dich gern') : 'Mit dem Kunden zu klären';
    /* Ein Punkt als Tabellenzeile: Kästchen (geklärt: grüner Haken), links die Position, rechts was zu klären ist und warum */
    const KL_K = 38;
    const klLabel = (r) => (typeof r.pos === 'number' && CODE[r.pos] ? posLabel(r.pos) : Array.isArray(r.pos) && r.pos.length && r.pos.every((q) => CODE[q]) ? (r.pos.length === wins.length && wins.length > 1 ? 'Alle Positionen' : r.pos.slice().sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).map((q) => CODE[q]).join(', ')) : r.k);
    const klRang = (r) => (typeof r.pos === 'number' ? ORDER.indexOf(r.pos) : Array.isArray(r.pos) && r.pos.length ? Math.min.apply(null, r.pos.map((q) => ORDER.indexOf(q))) : -1);
    /* Durchschrift: Punkte mit Maßen werden aus den Feldern neu gesagt (Absturzsicherung, Maßprüfungen, großes Element), ohne Zahl;
       in allen übrigen Texten fallen nur Angaben in mm weg (Normwerte wie „0,90 × 1,20 m“ bleiben). Die Prüfung
       scripts/blatt-beispiel.mjs sucht danach jedes Maß des Projekts im Text der Durchschrift. */
    const ohneMass = (x) => (!ANF || !x ? x : String(x)
      .replace(/\s*\([^()]*\d[\d.]*\s*(?:×\s*\d[\d.]*\s*)?mm[^()]*\)/g, '')
      .replace(/,?\s*(?:Brüstung\s+|bis\s+|über\s+)?\d{1,3}(?:\.\d{3})*(?:\s*×\s*\d{1,3}(?:\.\d{3})*)?\s*mm\b/g, '')
      .replace(/\s+([),:.;])/g, '$1').replace(/\s{2,}/g, ' ').trim());
    const MASS_ID = /^(winkel|groesser|kleiner|massfoto|unvoll|bru|laib)-/;
    const klText = (r) => {
      if (!ANF) return r.v;
      const id = String((r.ids || [r.id])[0] || ''), w = typeof r.pos === 'number' ? wins[r.pos] : null, ihr = sie ? 'Ihnen' : 'dir';
      if (/^absturz-/.test(id) && w) return 'Absturzsicherung nötig' + (AW.etageText(w) ? ' (' + AW.etageText(w) + ')' : '') + ': ' + (w.absturz ? AW.lab('absturz', w.absturz) || 'gewählt' : 'bitte beraten') + '. ' + (istTuer(w) ? 'Vor einer Tür ohne Balkon verlangt die Bauordnung eine Sicherung.' : 'Die Brüstung ist niedriger, als die Bauordnung hier verlangt.') + ' Das ist kein Messfehler; ' + bnK + ' plant die Sicherung mit ' + ihr + '.';
      if (/^gross-/.test(id)) return 'Großes Element: Transport, Gerüst oder Hebegerät plant ' + bnK + ' ein.';
      if (MASS_ID.test(id)) return (r.kurz || 'Maße') + ': prüft ' + bnK + ' beim Feinaufmaß bei ' + ihr + ' vor Ort. Das ist üblich und kein Fehler von ' + ihr + '.';
      return ohneMass(r.v);
    };
    function klaerPunktH(r, w) {
      const vw = w - KL_K - 8;
      font('bold', 7.6); const k = wrap(klLabel(r), KL_K - 2).length; font(r.gruppe === 'pflicht' ? 'bold' : 'normal', 8.4); const v = wrap(klText(r), vw).length; font('normal', 7.2); const g = r.warum ? wrap(r.warum, vw).length : 0;
      const nz = stand[r.id] && stand[r.id].notiz ? (font('normal', 7.6), wrap('Ihre Notiz: ' + stand[r.id].notiz, vw).length) : 0;
      return 1.2 + Math.max(k * 3.2, v * 3.65 + g * 3.05 + nz * 3.3 + (geklaert(r) ? 3.2 : 0)) + 2;
    }
    function klaerPunkt(r, x, y0, w) {
      const ok = geklaert(r), vx = x + 8 + KL_K, vw = w - KL_K - 8;
      if (ok) haken(x + 2, y0 + 3.1, 2); else { stroke(INK2); doc.setLineWidth(0.35); fill('#ffffff'); rr(x, y0 + 1.1, 4, 4, 0.8, 'FD'); }
      font('bold', 7.6, INK2); const kz = wrap(klLabel(r), KL_K - 2); txt(kz, x + 7, y0 + 4, { lineHeightFactor: 1.15 }); if (typeof r.pos === 'number') verweis(x + 6, y0, KL_K, kz.length * 3.6 + 1.5, seiteVon('pos', r.pos));
      let yy = y0 + 4;
      font(r.gruppe === 'pflicht' ? 'bold' : 'normal', 8.4, ok ? GREY : INK); const v = wrap(klText(r), vw); txt(v, vx, yy, { lineHeightFactor: 1.25 }); yy += v.length * 3.65;
      if (r.warum) { font('normal', 7.2, GREY); const g = wrap(r.warum, vw); txt(g, vx, yy - 0.4, { lineHeightFactor: 1.2 }); yy += g.length * 3.05; }
      if (ok) { font('bold', 7.2, GRUEN_T); txt('geklärt' + (stand[r.id].wann ? ', ' + stand[r.id].wann : ''), vx, yy - 0.2); yy += 3.2; }
      if (stand[r.id] && stand[r.id].notiz) { font('normal', 7.6, INK2); txt(wrap('Ihre Notiz: ' + stand[r.id].notiz, vw), vx, yy - 0.2); }
    }
    function klaerListe() {
      if (!kl.length) {
        platz(22); SEITEN.abschnitt.klaerung = seiteNr(); kicker(klTitel, M, y); y += 4; karteRand(M, y, CW, 12); haken(M + 6, y + 6, 2.2); font('normal', 8.6, INK2); txt('Nichts offen: keine Pflichtthemen, keine offenen Wünsche, keine Hinweise aus den Fotos.', M + 11, y + 7.2); y += 18; return;
      }
      /* je Gruppe in der Reihenfolge der Codes, allgemeine Punkte zuerst; in Durchschrift und Kundenblatt „Mit Ihnen“ statt „Mit dem Kunden“ */
      const gruppen = AW.klaerGruppen(kl).map((g) => Object.assign({}, g, { titel: (ANF || V === 'kunde') && /^Mit dem Kunden/.test(g.titel) ? (sie ? 'Mit Ihnen' : 'Mit dir') : g.titel, punkte: g.punkte.slice().sort((a, b) => klRang(a) - klRang(b)) }));
      const iw = CW - 18, n = kl.filter(geklaert).length;
      let titel = klTitel, start = null;
      const kopf = (fort) => { kicker(fort ? titel + ', Fortsetzung' : titel, M, y, WARN); font('normal', 8, GREY); txt(V === 'betrieb' ? n + ' von ' + kl.length + ' geklärt' : kl.length + (kl.length === 1 ? ' Punkt' : ' Punkte'), XR, y, { align: 'right' }); y += 3.5; start = y; y += 3; };
      const schliessen = () => { karteRand(M, start, CW, y - start + 1, { fuell: '#fffaf8', rand: '#f3d9ce' }); };
      /* Karte zuerst messen und zeichnen, dann den Inhalt darüber: so bleibt der Rand unter dem Text */
      const zeichnen = [];
      const flush = () => { schliessen(); zeichnen.forEach((f) => f()); zeichnen.length = 0; };
      if (y + 30 > unten()) neueSeite();
      SEITEN.abschnitt.klaerung = seiteNr();
      kopf(false);
      gruppen.forEach((g) => {
        const gh = 6.5;
        g.punkte.forEach((r, k) => {
          const ph = klaerPunktH(r, iw) + (k === 0 ? gh : 0);
          if (y + ph > unten() - 2) { flush(); neueSeite(); kopf(true); }
          if (k === 0 || zeichnen.length === 0) { const yy = y; zeichnen.push(() => { font('bold', 6.8, GREY); txt(VERSAL(g.titel) + '  ·  ' + g.punkte.length, M + 6, yy + 3.6, { charSpace: 0.4 }); }); y += gh; }
          const yy = y; zeichnen.push(() => klaerPunkt(r, M + 6, yy, iw)); y += klaerPunktH(r, iw);
        });
        y += 1.5;
      });
      flush(); y += 7;
    }
    klaerListe();
    if (EIGENE && wins.length > 1) uebersicht();
    if (wins.length > 1 && !ANF) aufstellung(); // die Durchschrift bekommt keine Aufstellung (kein Leistungsverzeichnis für Dritte)

    /* ---------- Je Position eine Seite: Kopf, Zeichnung mit Maßen, Maße, Wünsche in Gruppen, Einbausituation, Fotos ---------- */
    function masseZeilen(w) {
      const d = AW.derive(w), mo = w.mo || {}, L = (k) => (num(mo[k]) ? th(mo[k]) : '–'), luecken = AW.massLuecken(w), dev = Math.max(d.devW, d.devH);
      return [[w.neu ? 'Rohbauöffnung' : 'Maueröffnung', d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm' + (w.neu ? ', Wunsch' : ', kleinstes') : 'nicht gemessen', d.moW && d.moH ? { bold: true, col: MO_T } : { offen: true }]]
        .concat(w.neu ? [] : [['Breiten', 'oben ' + L('wt') + ' · Mitte ' + L('wm') + ' · unten ' + L('wb'), /Breite/.test(luecken.join()) ? { offen: true } : null], ['Höhen', 'links ' + L('hl') + ' · Mitte ' + L('hm') + ' · rechts ' + L('hr'), /Höhe/.test(luecken.join()) ? { offen: true } : null]],
          !w.neu ? [['Außer Winkel', dev > 5 ? 'bis ' + dev + ' mm, das kleinste Maß zählt' : 'unter 5 mm', dev > 10 ? { offen: true } : null]] : [],
          [[istTuer(w) ? 'Türelement' : 'Element', d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm mit Rahmen' : 'nicht gemessen', d.elW && d.elH ? { bold: true, col: EL_T } : { offen: true }],
            ['Brüstung', istTuer(w) ? 'bodentief' : AW.bruDa(w) ? (num(w.bru) ? th(w.bru) + ' mm' : 'bodentief') : '–'], ['Laibung innen', num(w.laib) ? th(w.laib) + ' mm' : '–'], ['Lage', (AW.etageText(w) || 'EG') + (num(w.wand) ? ', Wand ' + th(w.wand) + ' mm' : '')],
            ['Einbau', w.neu ? 'neue Öffnung, Wunschmaße' : 'Austausch' + (AW.ohneFotos(w) ? ', ohne Fotos' : '')]]);
    }
    function position(w, i) {
      const oi = ORDER.indexOf(i);
      NAV = wins.length > 1 ? { vor: oi > 0 ? ORDER[oi - 1] : null, nach: oi < ORDER.length - 1 ? ORDER[oi + 1] : null } : null;
      neueSeite();
      SEITEN.pos[i] = seiteNr();
      const d = AW.derive(w), n = num(w.anzahl) || 1, b = AW.bestellmass(w, ab), Wn = AW.wuensche(w, pr), name = posName(i);
      const fort = () => { neueSeite(); codeTag(CODE[i], M, y - 4); font('bold', 9, INK2); txt(name + ', Fortsetzung', M + tw(CODE[i]) + 9, y); y += 6; };
      const platzP = (h2) => { if (y + h2 > unten()) fort(); };
      /* Kopf wie eine Zeile im Lieferschein: Code als Etikett, darüber Geschoss und Stelle, Raum, Art und Öffnung; rechts dunkel
         hervorgehoben das Bestellmaß bzw. die Maueröffnung */
      const cw0 = codeTag(CODE[i], M, y - 1.5, true), boxW = 64, tx0 = M + cw0 + 4.5, tB = XR - boxW - 5 - tx0, ber = bereichVon(i);
      font('bold', 6.6, GREY); txt(VERSAL(ber.name + ' · Position ' + (ber.idx.indexOf(i) + 1) + ' von ' + ber.idx.length), tx0, y + 1.4, { charSpace: 0.4 });
      font('extra', 16, INK); txt(wrap(name, tB)[0], tx0, y + 7.6);
      font('normal', 8.2, INK2);
      let datenZ = '';
      [ARTNAME[w.art] || 'Fenster', AW.oeffnungKurz(w), n + ' Stück', w.fotos ? w.fotos + (w.fotos === 1 ? ' Foto' : ' Fotos') : 'ohne Fotos'].forEach((teil) => { const z = datenZ ? datenZ + ' · ' + teil : teil; if (tw(z) <= tB) datenZ = z; }); // passt ein Teil nicht (lange Öffnung einer Tür), fehlt nur er
      txt(datenZ, tx0, y + 12);
      fill(BUEHNE); rr(XR - boxW, y - 2, boxW, 17.5, 2.6);
      if (BEST) { kicker('Bestellmaß-Vorschlag', XR - boxW + 4, y + 2.4, GRUEN, { size: 6.6 }); font('extra', 12.5, '#ffffff'); txt(b ? b.text : '–', XR - boxW + 4, y + 8.4); font('normal', 6.2, HELL2); txt(wrap(b ? b.formel : 'ohne Maueröffnung kein Vorschlag', boxW - 8).slice(0, 2), XR - boxW + 4, y + 11.6, { lineHeightFactor: 1.15 }); }
      else { kicker(w.neu ? 'Rohbauöffnung' : 'Maueröffnung', XR - boxW + 4, y + 2.4, GRUEN, { size: 6.6 }); font('extra', 12.5, '#ffffff'); txt(d.moW && d.moH ? th(d.moW) + ' × ' + th(d.moH) + ' mm' : 'nicht gemessen', XR - boxW + 4, y + 8.4); font('normal', 6.6, HELL2); txt('Element ' + (d.elW && d.elH ? th(d.elW) + ' × ' + th(d.elH) + ' mm' : 'nicht gemessen'), XR - boxW + 4, y + 11.8); }
      y += 20;
      /* Ausstattung als Chips mit Zeichen (wie in der Übersicht), Offenes im Ton der Koralle */
      if (AUS[i].length) {
        let cx = M;
        AUS[i].forEach((a) => { font('bold', 7.4); const cwA = tw(a.t) + 10; if (cx + cwA > XR && cx > M) { cx = M; y += 7.2; } cx += chip(a.t, cx, y - 1, a.z === 'offen' ? 'warn' : a.z, 7.4) + 2; });
        y += 10.5;
      }
      /* Was bei dieser Position zu klären ist, ausgeschrieben (draußen hat der Monteur nur diese Seite in der Hand) */
      const hier = kl.filter((r) => r.pos === i || (Array.isArray(r.pos) && r.pos.indexOf(i) >= 0)).filter((r) => !geklaert(r));
      if (hier.length) {
        kicker('Zu klären bei dieser Position · ' + hier.length, M, y, WARN); y += 4.4;
        hier.slice().sort((a, b) => (a.gruppe === 'pflicht' ? 0 : 1) - (b.gruppe === 'pflicht' ? 0 : 1)).forEach((r) => {
          font(r.gruppe === 'pflicht' ? 'bold' : 'normal', 8.2, INK); const z = wrap(r.v, CW - 6);
          punkt(M + 1.6, y + 0.4, 1); txt(z, M + 5, y + 1.6, { lineHeightFactor: 1.2 }); y += z.length * 3.5 + 1.4;
        });
        y += 3;
      }
      /* Erst messen, was nach der Zeichnung kommt (Wünsche, Gruppen, Einbausituation, Fotos), damit die Position auf ihre Seite passt:
         die Zeichnung wird so hoch, wie Platz bleibt (72 bis 118 mm); reicht auch das nicht, geht der Rest auf die nächste Seite */
      const zw = Math.round(CW * 0.6), rx = M + zw + 5, rw = CW - zw - 5, oM = { lw: 21, fs: 7.8 };
      const mz = masseZeilen(w), bWarn = V === 'betrieb' && b && b.warnText ? b.warnText : '', notM = Wn.notizen.masse;
      const mH = 10 + zeilenH(mz, rw - 8, oM) + (bWarn ? (font('normal', 7.6), wrap(bWarn, rw - 12).length * 3.4 + 3) : 0) + notM.reduce((s2, x) => s2 + notizH(x, rw - 8) + 1, 0) + 2;
      font('bold', 10.4); const satz = wrap(Wn.satz + '.', CW), allg = Wn.notizen.allgemein;
      const wH = 5.5 + satz.length * 4.6 + (Wn.offen.length ? 9 : 0) + allg.reduce((s2, x) => s2 + notizH(x, CW) + 1.5, 0) + 2;
      const sp = (CW - 6) / 2, oG = { lw: 23, fs: 8 };
      /* Standard des Fensterbauers: Zeilen, die nicht gefragt wurden, grau; je Gruppe eine Zeile mit den Angaben nach Standard */
      const stdT = (t) => (sie ? String(t).replace(AW.STD_TEXT, 'nach Ihrem Standard') : t);
      const gRows = (g) => g.zeilen.map((z) => [kName(z.k), stdT(z.t), z.offen ? { offen: true } : z.std ? { col: GREY } : z.hex ? { swatch: z.hex } : null]);
      const stdText = (g) => (g.standard && g.standard.length ? (sie ? 'Nach Ihrem Standard: ' : 'Nach Standard des Fensterbauers: ') + g.standard.join(', ') : '');
      const stdH = (g, w2) => (stdText(g) ? (font('normal', 7.2), wrap(stdText(g), w2).length * 3.1 + 1.6) : 0);
      const gH = (g) => 6 + zeilenH(gRows(g), sp, oG) + stdH(g, sp) + g.notizen.reduce((s2, x) => s2 + notizH(x, sp) + 1, 0) + 2.4;
      const G = Wn.gruppen, hs = G.map(gH), sum = (a, b2) => hs.slice(a, b2).reduce((s2, x) => s2 + x, 0);
      let best = Infinity; for (let k = 1; k < G.length; k++) best = Math.min(best, Math.max(sum(0, k), sum(k, G.length))); // Höhe ausgewogen in zwei Spalten
      const kiR = AW.kiRows(w).map((r) => [r[0], r[1], r[0] === 'Hinweis' || r[0] === 'Vor Ort prüfen' || (r[0] === 'Maße und Foto' && AW.massPruef(w)) ? { offen: true } : r[0] === 'Auf einen Blick' ? { bold: true } : null]);
      const fotos = ['in', 'out'].map((s2) => ({ s: s2, f: w.bilder && e.fotos ? e.fotos[w.bilder[s2]] : null })).filter((x) => x.f && /^data:image\/jpeg/.test(String(x.f.data || '')) && x.f.w > 0 && x.f.h > 0);
      const nzF = Wn.notizen.fotos, mitBild = !!(w.neu && w.plan && w.plan.bild && /^data:image\/jpeg/.test(w.plan.bild)), oK = { lw: 24, fs: 7.6 };
      const half = Math.ceil(kiR.length / 2), lsp = [kiR.slice(0, half), kiR.slice(half)], kH = kiR.length ? Math.max(zeilenH(lsp[0], sp, oK), zeilenH(lsp[1], sp, oK)) : 0;
      const FH = 48, kiBlock = (kiR.length ? 6 + kH + 3 : 0) + nzF.reduce((s2, x) => s2 + notizH(x, CW) + 1.5, 0) + (fotos.length ? FH + 12 + (kiR.length ? 0 : 6) : 0);
      const bw0 = mitBild ? w.plan.bw || 3 : 3, bh0 = mitBild ? w.plan.bh || 4 : 4, iw2 = Math.min(CW - 8, 64 * bw0 / bh0), ih2 = iw2 * bh0 / bw0, bildH = mitBild ? ih2 + 12 : 0;
      const rest = wH + best + 3 + kiBlock + bildH, ziel = unten() - y - 7 - rest;
      /* Passt alles nicht einmal mit kleiner Zeichnung, geht die Einbausituation geschlossen auf die nächste Seite und die Zeichnung bleibt groß */
      const ohneKi = unten() - y - 7 - (rest - kiBlock - bildH), kiWeiter = ziel < 72 && (kiBlock + bildH) > 0;
      const zMax = !kiWeiter ? Math.max(72, Math.min(118, ziel)) : Math.max(84, Math.min(118, ohneKi)), pl = AW.plan(w, { b: zw - 6, h: zMax - 13, fs: 3 }), zh = Math.max(pl.h + 13, mH);
      /* Zeichnung links, Maße rechts */
      platzP(zh);
      karteRand(M, y, zw, zh);
      planZeichnen(pl, M + 3, y + 3 + Math.max(0, (zh - 13 - pl.h) / 2));
      /* Legende mit Wort, Farbe nie allein */
      const ly = y + zh - 3.6, moL = w.neu ? 'Rohbauöffnung, Wunschmaß' : 'Maueröffnung, von Hand'; font('normal', 7, INK2);
      fill(MO); doc.rect(M + 4, ly - 1.6, 5, 0.9, 'F'); txt(moL, M + 10.5, ly);
      const lx2 = M + 10.5 + tw(moL) + 5; fill(EL); doc.rect(lx2, ly - 1.6, 5, 0.9, 'F'); txt('Element', lx2 + 6.5, ly);
      txt('Ansicht von innen · mm' + (w.richtung === 'aussen' && !istTuer(w) && w.art !== 'fest' ? ' · gestrichelt: nach außen' : ''), M + zw - 4, ly, { align: 'right' });
      karteRand(rx, y, rw, zh); kicker('Maße von Hand', rx + 4, y + 6, GREY);
      let ry = y + 9 + zeilen(mz, rx + 4, y + 9, rw - 8, oM);
      if (bWarn) { punkt(rx + 5.2, ry + 2.2, 1); font('normal', 7.6, WARN); const wl = wrap(bWarn, rw - 12); txt(wl, rx + 8, ry + 3); ry += wl.length * 3.4 + 3; }
      notM.forEach((x) => { ry += notiz(x, rx + 4, ry + 1, rw - 8) + 1; });
      y += zh + 7;
      /* Wünsche des Kunden: ein Satz, offene Punkte, dann die Gruppen in zwei Spalten */
      platzP(wH + Math.min(best, 40));
      kicker(sie ? 'Wünsche des Kunden' : 'Deine Wünsche', M, y); y += 5.5;
      font('bold', 10.4, INK); txt(satz, M, y, { lineHeightFactor: 1.25 }); y += satz.length * 4.6;
      if (Wn.offen.length) { let ox = M; font('bold', 6.8, GREY); txt('NOCH OFFEN', ox, y + 3.6, { charSpace: 0.4 }); ox += tw('NOCH OFFEN') + 8; Wn.offen.forEach((x) => { font('bold', 7.2); const cw2 = tw(x) + 9; if (ox + cw2 > XR) { y += 7; ox = M; } ox += chip(x, ox, y, 'warn', 7.2) + 2; }); y += 9; }
      allg.forEach((x) => { platzP(notizH(x, CW)); y += notiz(x, M, y, CW) + 1.5; });
      y += 2;
      function gruppe(g, x, y0, w2) {
        font('bold', 6.8, GREY); txt(VERSAL(g.titel), x, y0 + 3.2, { charSpace: 0.4 }); stroke(LINE); doc.setLineWidth(0.25); doc.line(x, y0 + 4.6, x + w2, y0 + 4.6);
        let yy = y0 + 5.4 + zeilen(gRows(g), x, y0 + 5.4, w2, oG);
        if (stdText(g)) { font('normal', 7.2, GREY); const sl = wrap(stdText(g), w2); txt(sl, x, yy + 2.6, { lineHeightFactor: 1.2 }); yy += stdH(g, w2); }
        g.notizen.forEach((x2) => { yy += notiz(x2, x, yy + 1, w2) + 1; });
      }
      /* Gruppen zweispaltig: passen die übrigen Gruppen auf diese Seite, ausgewogen links und rechts; sonst (viele Detailangaben)
         fließen sie erst links bis zum Seitenende, dann rechts, und auf der nächsten Seite wieder ausgewogen. Nie eine Gruppe geteilt,
         keine halbe Seite leer */
      const strich = (top, h2) => { stroke(LINE); doc.setLineWidth(0.25); doc.line(M + sp + 3, top + 1, M + sp + 3, top + h2 - 3); };
      let offenG = G.slice(), frisch = false;
      while (offenG.length) {
        const hr0 = offenG.map(gH), summe = (a, b2) => hr0.slice(a, b2).reduce((s2, x) => s2 + x, 0);
        let tk = offenG.length, bb = summe(0, offenG.length); for (let k = 1; k < offenG.length; k++) { const m2 = Math.max(summe(0, k), summe(k, offenG.length)); if (m2 < bb) { bb = m2; tk = k; } }
        if (y + bb <= unten()) {
          let hl = 0, hr = 0;
          offenG.slice(0, tk).forEach((g) => { gruppe(g, M, y + hl, sp); hl += gH(g); });
          offenG.slice(tk).forEach((g) => { gruppe(g, M + sp + 6, y + hr, sp); hr += gH(g); });
          if (hr) strich(y, Math.max(hl, hr));
          y += Math.max(hl, hr); break;
        }
        const top = y, yy = [y, y]; let col = 0, i = 0;
        while (i < offenG.length) {
          const h = gH(offenG[i]);
          if (yy[col] + h > unten()) {
            if (col === 0 && top + h <= unten()) { col = 1; continue; }
            if (i === 0 && frisch) { gruppe(offenG[0], M, top, sp); yy[0] += h; i = 1; } // höher als eine ganze Seite: trotzdem setzen, sonst hinge es fest
            break;
          }
          gruppe(offenG[i], M + col * (sp + 6), yy[col], sp); yy[col] += h; i++;
        }
        if (yy[1] > top) strich(top, Math.max(yy[0], yy[1]) - top);
        y = Math.max(yy[0], yy[1]); offenG = offenG.slice(i);
        if (offenG.length) { fort(); frisch = true; }
      }
      y += 3;
      /* Einbausituation aus den Fotos: Befund der KI zweispaltig, Hinweise und Prüfpunkte markiert, darunter die Fotos */
      const kiTitel = 'Einbausituation aus den Fotos' + (w.ki ? ' (KI, ' + (w.fotos || 0) + (w.fotos === 1 ? ' Foto)' : ' Fotos)') : '');
      if (kiWeiter && kiBlock > 0 && y + 6 + Math.min(kH, 30) + (fotos.length ? FH + 12 : 0) > unten()) fort();
      if (kiR.length) {
        if (y + 6 + kH > unten()) {
          /* passt der Befund nicht mehr, geht er ganz auf die nächste Seite, einspaltig bei Bedarf über mehrere */
          fort(); kicker(kiTitel, M, y + 3, GREY); y += 6;
          if (y + kH > unten()) kiR.forEach((r) => { const hh = zeilenH([r], CW, oK); platzP(hh); zeilen([r], M, y, CW, oK); y += hh; });
          else { zeilen(lsp[0], M, y, sp, oK); zeilen(lsp[1], M + sp + 6, y, sp, oK); y += kH; }
        } else { kicker(kiTitel, M, y + 3, GREY); y += 6; zeilen(lsp[0], M, y, sp, oK); zeilen(lsp[1], M + sp + 6, y, sp, oK); y += kH; }
        y += 3;
      }
      nzF.forEach((x) => { platzP(notizH(x, CW)); y += notiz(x, M, y, CW) + 1.5; });
      if (fotos.length) {
        platzP(FH + 12 + (kiR.length ? 0 : 6));
        if (!kiR.length) { kicker(kiTitel, M, y + 3, GREY); y += 6; }
        const zb = (CW - 6) / 2;
        fotos.forEach((x, k) => {
          const fx = M + k * (zb + 6), r = x.f.w / x.f.h; let iw = zb - 3, ih = iw / r; if (ih > FH) { ih = FH; iw = ih * r; }
          stroke(LINE); doc.setLineWidth(0.5); rr(fx, y, zb, FH + 8, 2.6, 'S');
          try { bild(x.f.data, 'JPEG', fx + (zb - iw) / 2, y + 1.5 + (FH - ih) / 2, iw, ih); } catch (err) { /* ohne Bild weiter */ }
          font('bold', 7.2, INK2); txt(x.s === 'in' ? 'Von innen' : 'Von außen', fx + zb / 2, y + FH + 5.6, { align: 'center' });
        });
        y += FH + 12;
      }
      if (mitBild) {
        platzP(bildH);
        kicker('Lage auf dem Foto, ' + (sie ? 'vom Kunden' : 'von dir') + ' eingezeichnet', M, y + 3, GREY); y += 5;
        try { bild(w.plan.bild, 'JPEG', M + (CW - iw2) / 2, y, iw2, ih2); } catch (err) { /* ohne Bild weiter */ }
        y += ih2 + 5;
      }
    }

    /* ---------- Durchschrift: je Position eine Karte mit Code, Ausstattung und Wünschen, ohne Maße, Zeichnung mit Maßen, Fotos und
       Auswertung; nach Geschoss wie in der Übersicht ---------- */
    /* „Förderwert“ ist das Ziel für die Förderung, kein Wert des Fensters */
    const kName = (k) => (k === 'Förderwert' ? 'Förderziel' : k);
    function kopieKarten() {
      platz(60);
      sektion('Je Position · Ausstattung und Wünsche · ohne Maße', sie ? 'Ihre Positionen.' : 'Deine Positionen.', bt.name ? 'Maße bei ' + bt.name : '');
      const P = 5, iw = CW - 2 * P, sp = (iw - 6) / 2, oG = { lw: 25, fs: 8, lfs: 7.8, lc: INK2 };
      const zText = (z) => ohneMass(sie ? String(z.t).replace(AW.STD_TEXT, 'nach Standard des Fensterbauers') : z.t);
      /* je Gruppe eine Zeile: „außen Anthrazitgrau · innen Verkehrsweiß“; offen in Koralle */
      const zeileG = (g) => { const zz = g.zeilen.filter((z) => !(g.id === 'fenster' && z.k === 'Element')); return [g.titel, zz.map((z) => ((zz.length > 1 || z.k !== g.titel) && String(z.t).toLowerCase().indexOf(String(z.k).toLowerCase()) !== 0 ? kName(z.k) + ' ' : '') + zText(z)).join(' · '), zz.some((z) => z.offen) ? { offen: true } : null]; };
      const gH = (g) => zeilenH([zeileG(g)], sp, oG);
      BEREICHE.forEach((bb) => {
        const kopfB = () => { fill(LINE_F); doc.rect(M, y, CW, 6.4, 'F'); font('extra', 8.6, INK); txt(bb.name, M + 2, y + 4.4); font('normal', 7.2, GREY); txt(bb.idx.length + (bb.idx.length === 1 ? ' Position' : ' Positionen'), XR - 2, y + 4.4, { align: 'right' }); y += 9; };
        let ersteB = true;
        bb.idx.forEach((i) => {
          const w = wins[i], Wn = AW.wuensche(w, pr), n = num(w.anzahl) || 1, G = Wn.gruppen.filter((g) => g.zeilen.length);
          const hs = G.map(gH), half = Math.ceil(G.length / 2), hl0 = hs.slice(0, half).reduce((a, x) => a + x, 0), hr0 = hs.slice(half).reduce((a, x) => a + x, 0);
          font('bold', 9.2); const satz = wrap(Wn.satz + '.', iw);
          const zeile2 = [ARTNAME[w.art] || 'Fenster', AW.oeffnungKurz(w), n + ' Stück'].join(' · ');
          let chipsH = 0; if (Wn.offen.length) { let cx = 0; chipsH = 7.2; Wn.offen.forEach((x) => { font('bold', 7.2); const c = tw(x + ' offen') + 9; if (cx + c > iw && cx > 0) { cx = 0; chipsH += 7.2; } cx += c + 2; }); chipsH += 1; }
          const hh = P + 13 + satz.length * 4.1 + 2.5 + chipsH + Math.max(hl0, hr0) + P - 2;
          if (y + (ersteB ? 9 : 0) + hh > unten()) { neueSeite(); ersteB = true; }
          if (ersteB) { kopfB(); ersteB = false; }
          if (SEITEN.pos[i] == null) SEITEN.pos[i] = seiteNr();
          const y0 = y; karteRand(M, y0, CW, hh);
          const cw0 = codeTag(CODE[i], M + P, y0 + P - 0.5), tx0 = M + P + cw0 + 4;
          font('extra', 11.5, INK); txt(wrap(posName(i), XR - P - 16 - tx0)[0], tx0, y0 + P + 3.6);
          font('normal', 7.8, INK2); txt(wrap(zeile2, XR - P - 16 - tx0)[0], tx0, y0 + P + 8);
          let ax = XR - P - 12 - 2; AUS[i].slice().reverse().forEach((a) => { ax -= 5; zeichen(a.z, ax, y0 + P + 0.4, 3.9); });
          mini(w, XR - P - 12, y0 + P - 1, 12);
          let yy = y0 + P + 13 + 3.2;
          font('bold', 9.2, INK); txt(satz, M + P, yy, { lineHeightFactor: 1.25 }); yy += satz.length * 4.1 + 0.6;
          if (chipsH) { let cx = M + P; Wn.offen.forEach((x) => { font('bold', 7.2); const c = tw(x + ' offen') + 9; if (cx + c > XR - P && cx > M + P) { cx = M + P; yy += 7.2; } cx += chip(x + ' offen', cx, yy - 1, 'warn', 7.2) + 2; }); yy += 8.2; }
          const top = yy; let hl = 0, hr = 0;
          stroke(LINE); doc.setLineWidth(0.25); doc.line(M + P, top - 1.4, XR - P, top - 1.4);
          G.forEach((g, k) => { const links = k < half, x = links ? M + P : M + P + sp + 6; zeilen([zeileG(g)], x, top + (links ? hl : hr), sp, oG); if (links) hl += hs[k]; else hr += hs[k]; });
          y += hh + 4;
        });
        y += 2;
      });
    }

    /* ---------- Ende (ab zwei Positionen): Ausstattung, Zahlen, alle Elemente im selben Maßstab ---------- */
    function ausstattung() {
      const flaeche = wins.reduce((a, x) => { const d = AW.derive(x); return a + (d.elW && d.elH ? d.elW * d.elH / 1e6 * (num(x.anzahl) || 1) : 0); }, 0);
      const groesste = ORDER.reduce((best, i) => { const d = AW.derive(wins[i]); return !best || d.elW * d.elH > best.a ? { a: d.elW * d.elH, n: posLabel(i), d: d } : best; }, null);
      const zahlen = [['Positionen', String(wins.length)], ['Elemente', String(nE)], ['Geschosse', BEREICHE.map((b) => b.name).join(', ')]]
        .concat(ANF ? [] : [['Fensterfläche', flaeche ? 'etwa ' + flaeche.toFixed(1).replace('.', ',') + ' m² (Element, alle Stück)' : '–'], ['Größtes Element', groesste && groesste.d.elW ? groesste.n + ', ' + th(groesste.d.elW) + ' × ' + th(groesste.d.elH) + ' mm' : '–']],
          [['Fotos', ANF ? (nF ? nF + ' übermittelt, Auswertung bei ' + bnK : 'keine') : nF ? nF + (nA ? (nA === nF ? ', alle' : ', davon ' + nA) + ' von der KI ausgewertet' : '') : 'keine'], ['Maße', komplett ? 'alle 8 Handmaße je Fenster' + (ANF ? ', bei ' + bnK : '') : wins.filter((x) => AW.massLuecken(x).length).length + ' Position(en) mit Lücken', komplett ? null : { offen: true }]],
          V === 'betrieb' ? [['Ihr Abzug', ab.seite + ' mm je Seite, ' + ab.oben + ' mm oben' + (ab.unten ? ', ' + ab.unten + ' mm unten (Fenster)' : '') + (ab.untenT ? ', ' + ab.untenT + ' mm unten (Türen)' : '')]] : []);
      const sp = (CW - 14) / 2, oZ = { lw: 30, fs: FS }, half = Math.ceil(zahlen.length / 2), hh = 11 + Math.max(zeilenH(zahlen.slice(0, half), sp, oZ), zeilenH(zahlen.slice(half), sp, oZ)) + 3;
      platz(hh);
      karteRand(M, y, CW, hh); kicker('Zahlen zum Projekt', M + 4, y + 6, GREY);
      zeilen(zahlen.slice(0, half), M + 4, y + 9, sp, oZ); zeilen(zahlen.slice(half), M + 10 + sp, y + 9, sp, oZ);
      y += hh + 7;
    }
    /* Alle Elemente im selben Maßstab */
    function massstab() {
      const maxH = wins.reduce((a, x) => Math.max(a, AW.derive(x).elH || 1200), 0), maxW = wins.reduce((a, x) => Math.max(a, AW.derive(x).elW || 1000), 0), perRow = Math.min(wins.length, 6), slot = (CW - 8) / perRow, zeilenN = Math.ceil(wins.length / perRow), sc = Math.min(30 / maxH, (slot - 10) / maxW), rowH = maxH * sc + 20.5, gh = 12 + zeilenN * rowH + 2;
      platz(gh);
      karteRand(M, y, CW, gh); kicker('Alle Elemente im selben Maßstab', M + 4, y + 6, GREY);
      ORDER.forEach((oi, k) => {
        const w = wins[oi], d = AW.derive(w), ww = (d.elW || 1000) * sc, wh = (d.elH || 1200) * sc, r = Math.floor(k / perRow), c = k % perRow;
        const cx0 = M + 4 + c * slot + slot / 2, base = y + 10 + r * rowH + maxH * sc;
        const pl = AW.plan(w, { nurElement: true, b: ww, h: wh, fs: 1.4 }); planZeichnen(pl, cx0 - ww / 2, base - pl.h);
        font('extra', 7.4, INDIGO); txt(CODE[oi], cx0, base + 4.4, { align: 'center' }); font('bold', 7.2, INK); txt(wrap(posName(oi), slot - 3)[0], cx0, base + 7.9, { align: 'center' }); verweis(cx0 - slot / 2, base - pl.h, slot, pl.h + 12.5, seiteVon('pos', oi));
        font('normal', 7, INK2); txt(d.elW ? th(d.elW) + ' × ' + th(d.elH) + ((num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stk.' : '') : 'Maße offen', cx0, base + 11.4, { align: 'center' });
      });
      y += gh + 6;
    }
    /* Aufmaß-Code mit der Anleitung zum Übernehmen (für Fensterbauer, die eeziframes nutzen möchten) */
    function codeTeil() {
      if (!e.code && !e.beispiel) return;
      platz(70);
      codeSeite = seiteNr(); SEITEN.abschnitt.code = codeSeite;
      sektion('Für Fensterbauer · kostenlos bis 3 Projekte', 'Aufmaß digital übernehmen.');
      const qs = 28, qx = XR - qs;
      [['Kostenlos registrieren', HOST + ' oder den QR-Code scannen'], ['„Code vom Kunden einfügen“', 'den Aufmaß-Code unten einsetzen, Leerzeichen und Umbrüche stören nicht'], ['Projekt ist da', 'je Position mit Zeichnung, Klärungsliste und Bestellmaß nach Ihrem Abzug']].forEach((st, k) => { fill(INK); doc.circle(M + 4, y + 4 + k * 10.5, 4, 'F'); font('extra', 9, '#ffffff'); txt(String(k + 1), M + 4, y + 5.4 + k * 10.5, { align: 'center' }); font('bold', 9.2, INK); txt(st[0], M + 11, y + 3.4 + k * 10.5); font('normal', 8, INK2); txt(st[1], M + 11, y + 7.6 + k * 10.5); });
      qr(qx, y - 2, qs); font('normal', 7.2, INK2); txt('Scannen: Anmeldung', qx + qs / 2, y + qs + 2, { align: 'center' });
      y += 36;
      if (!e.code) { karteRand(M, y, CW, 17); kicker('Aufmaß-Code für eeziframes', M + 4, y + 6, INK); font('normal', 8.2, INK2); txt('Im echten Aufmaßblatt steht hier der Aufmaß-Code. In diesem Beispiel bleibt er leer.', M + 4, y + 12); y += 21; return; }
      /* Courier, damit sich der Code aus jedem PDF-Programm sauber kopieren lässt */
      font('mono', 6.2); const zeilen2 = doc.splitTextToSize(e.code, CW - 8), zh2 = 2.7;
      let k = 0, erster = true;
      while (k < zeilen2.length) {
        const frei = Math.floor((unten() - y - (erster ? 12 : 8)) / zh2);
        if (frei < 6) { neueSeite(); continue; }
        const teil = zeilen2.slice(k, k + frei), hh = teil.length * zh2 + (erster ? 12 : 8);
        karteRand(M, y, CW, hh);
        if (erster) { kicker('Aufmaß-Code für eeziframes', M + 4, y + 5.6, INK); font('normal', 7.2, INK2); txt('Maße, Wünsche und Fotoauswertung aller Positionen; als Text markieren und kopieren.', XR - 4, y + 5.6, { align: 'right' }); }
        font('mono', 6.2, '#3a3a3f'); let cy2 = y + (erster ? 10.6 : 6);
        teil.forEach((z) => { txt(z, M + 4, cy2); cy2 += zh2; });
        y += hh + 3; k += teil.length; erster = false;
      }
    }
    /* Für Fensterbauer: eeziframes für die eigenen Kunden. Gestaltet wie normaler Inhalt, nicht wie Werbung. */
    const EIGENE_H = 46;
    function eigeneKunden() {
      platz(EIGENE_H + 4);
      const y0 = y;
      karteRand(M, y0, CW, EIGENE_H);
      const qs = 25, qx = XR - qs - 5, qy = y0 + 5, tx = M + 5, tw2 = qx - tx - 6;
      kicker('Für Fensterbauer · Aufmaße Ihrer eigenen Kunden', tx, y0 + 6.6, GRUEN_T);
      font('extra', 11.5, INK); const t1 = wrap('Ihre Kunden messen selbst. Sie fahren erst zum Feinaufmaß.', tw2); txt(t1, tx, y0 + 12.8, { lineHeightFactor: 1.1 });
      let yy = y0 + 12.8 + t1.length * 4.6 + 0.6;
      font('normal', 8, INK2); const t2 = wrap('Projekt in eeziframes anlegen, Aufmaß-Link per WhatsApp oder E-Mail schicken. Zurück kommt ein Aufmaß wie dieses: 8 Maße je Fenster, Fotos mit Auswertung, alle Wünsche, Bestellmaß nach Ihrem Abzug, das Blatt mit Ihrem Logo.', tw2); txt(t2, tx, yy, { lineHeightFactor: 1.22 }); yy += t2.length * 3.45 + 1.6;
      font('bold', 8, INK); txt('3 Projekte kostenlos · danach 9 € netto je Projekt mit eingegangenem Aufmaß · keine Grundgebühr', tx, yy); yy += 4.2;
      font('normal', 7, GREY); txt(wrap('Zum Vergleich: Eine Meisterstunde kostet im Schnitt 65,14 € netto (Preisatlas Handwerk 2024).', tw2)[0], tx, yy);
      qr(qx, qy, qs); font('normal', 7, INK2); txt('Scannen: Projekt anlegen', qx + qs / 2, qy + qs + 3.4, { align: 'center' }); font('bold', 7, INK); txt(HOST, qx + qs / 2, qy + qs + 6.8, { align: 'center' });
      y += EIGENE_H + 6;
    }

    if (wins.length) { if (ANF) kopieKarten(); else ORDER.forEach((i) => position(wins[i], i)); }
    else { font('normal', 10, GREY); txt('Noch kein Fenster erfasst.', M, y + 6); y += 12; }
    NAV = null;
    if (wins.length > 1) { if (ANF) platz(80); else neueSeite(); SEITEN.abschnitt.ende = seiteNr(); ausstattung(); if (!ANF) massstab(); }
    if (EIGENE) { if (wins.length <= 1 || y + 90 > unten()) neueSeite(); codeTeil(); eigeneKunden(); }

    /* Lesezeichen des PDF: Übersicht, Klärung, Aufstellung, je Geschoss die Positionen, Ende, Code; das PDF öffnet mit ihnen */
    function lesezeichen() {
      if (probe || !doc.outline) return;
      try {
        const add = (eltern, titel, seite) => (seite ? doc.outline.add(eltern, t(titel), { pageNumber: seite }) : null);
        add(null, BKOPF ? (kd.name || 'Aufmaß') + ', Seite 1' : 'Seite 1', 1);
        add(null, 'Übersicht nach Geschoss', SEITEN.abschnitt.uebersicht);
        add(null, klTitel, SEITEN.abschnitt.klaerung);
        add(null, 'Aufstellung nach Gewerk', SEITEN.abschnitt.aufstellung);
        BEREICHE.forEach((b) => { const k = add(null, b.name, SEITEN.pos[b.idx[0]]); if (k) b.idx.forEach((i) => add(k, posLabel(i), SEITEN.pos[i])); });
        add(null, 'Ausstattung und Zahlen', SEITEN.abschnitt.ende);
        add(null, 'Aufmaß-Code', SEITEN.abschnitt.code);
        doc.internal.events.subscribe('putCatalog', () => { doc.internal.write('/PageMode /UseOutlines'); });
      } catch (err) { /* ohne Lesezeichen weiter */ }
    }
    fuss();
    lesezeichen();
    return { doc: doc, seiten: SEITEN };
  }
  return { pdf: pdf, schrift: schrift };
})();

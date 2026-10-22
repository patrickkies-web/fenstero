// eeziframes · Prüfabschnitt 23, Teil 0: Fundament der Konfigurator-Instanzen (Bauplan S0, docs/INSTANZEN.md)
// Pakete und Regeln, Speicher-Attrappe aller neuen Tabellen, Sitzungen und Zweck-Token, Post mit Anhängen, Bremsen und Budgets, Ablagen,
// Cron-Weiche, Stubs mit festen Exportnamen, wrangler.jsonc, Schema, Haken in seo.js, Testserver mit Host-Kopfzeile und *.localhost.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export default async (h) => {
  const { ok } = h, W = h.WURZEL;
  const imp = (rel) => import(pathToFileURL(path.join(W, rel)).href);
  const lies = (rel) => fs.readFileSync(path.join(W, rel), 'utf8');
  const stempel = Date.now().toString(36);
  await imp('web/assets/pakete.js'); await imp('web/assets/instanzregeln.js');
  const P = globalThis.Pakete, R = globalThis.Instanzregeln;

  /* ---------- 23.0a pakete.js: jedes Paket hat jedes Merkmal, Preise > 0, Abweichungen nur bekannte Schlüssel ---------- */
  const schluessel = Object.keys(P.MERKMALE);
  const fehlt = P.LISTE.flatMap((p) => schluessel.filter((k) => !(k in P.PAKETE[p])).map((k) => p + '.' + k));
  const fremd = P.LISTE.flatMap((p) => Object.keys(P.PAKETE[p]).filter((k) => !schluessel.includes(k)).map((k) => p + '.' + k));
  ok(P.LISTE.join() === 'essential,plus,signature' && !fehlt.length && !fremd.length, 'pakete.js: alle drei Pakete haben jedes Merkmal aus MERKMALE und keins mehr' + (fehlt.length || fremd.length ? ' (' + fehlt.concat(fremd).join(', ') + ')' : ''));
  ok(P.LISTE.every((p) => P.PAKETE[p].preis.monat > 0 && P.PAKETE[p].preis.einrichtung > 0) && P.preis('plus').monat === 39 && P.preis('signature').einrichtung === 279 && P.preis('x') === null, 'pakete.js: alle Preise größer 0 (29/99, 39/199, 64/279 €)');
  const mP = P.merkmale('plus', { fotos: 2, kennzeichnung: 'keine', preis: { monat: 1, einrichtung: 1 }, paket: 'signature', unbekannt: true, logo: 'ja', aufbewahrung: 'vertrag' });
  ok(Object.isFrozen(mP) && mP.paket === 'plus' && mP.fotos === 2 && mP.kennzeichnung === 'keine' && mP.preis.monat === 39 && !('unbekannt' in mP) && mP.logo === true && mP.aufbewahrung === 'vertrag' && P.merkmale('gold') === null, 'pakete.js: merkmale() eingefroren, Abweichungen nur für bekannte Merkmale mit passendem Typ, nie Paket oder Preis');
  ok(JSON.stringify(Object.keys(P.oeffentlich(P.merkmale('signature')))) === JSON.stringify(['gestaltung', 'logo', 'farbe', 'fotos', 'startansicht', 'kennzeichnung', 'rechtNennung', 'kopieKunde', 'dashboard']), 'pakete.js: oeffentlich() gibt dem Browser nur die neun Merkmale der Oberfläche');
  ok(/^29 € im Monat netto zzgl\. MwSt\.$/.test(P.preisText('essential', 'monat')) && /§ 19 UStG/.test(P.preisText('plus', 'einrichtung', false)) && P.preisStand('signature').stand === P.PREIS_STAND && P.preisStand('signature').mwst === 19, 'pakete.js: Preistexte netto zzgl. MwSt. (bzw. § 19 UStG), Preisstand für die Bestellung');
  ok(P.PAKETE.essential.kennzeichnung === 'deutlich' && P.PAKETE.plus.kennzeichnung === 'dezent' && P.PAKETE.signature.kennzeichnung === 'keine' && P.PAKETE.signature.dashboard && !P.PAKETE.plus.dashboard && P.PAKETE.signature.zugaenge === 5 && P.PAKETE.essential.fotoLinkTage === 14 && P.PAKETE.signature.fotoLinkTage === 0, 'pakete.js: Kennzeichnung deutlich/dezent/keine, Dashboard nur Signature (5 Zugänge), Fotolink 14 Tage nur Essential/Plus');
  /* Kein Vergleich mit dem Paketnamen außerhalb von pakete.js (Bauplan 23.10) */
  const quellen = [], such = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!['node_modules', 'vendor', '.git', 'fonts', 'bilder', 'lottie'].includes(e.name)) such(f); } else if (/\.(m?js)$/.test(e.name)) quellen.push(f); } };
  ['functions', 'web', 'worker.js'].forEach((x) => { const f = path.join(W, x); if (fs.statSync(f).isDirectory()) such(f); else quellen.push(f); });
  const vergleiche = quellen.filter((f) => !f.endsWith(path.join('assets', 'pakete.js')) && /\bpaket\s*[!=]==?\s*['"]|['"](essential|signature)['"]\s*[!=]==?\s*\w*paket\b/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(W, f));
  ok(!vergleiche.length, 'Kein Vergleich mit einem Paketnamen außerhalb von pakete.js (Code fragt Merkmale ab)' + (vergleiche.length ? ': ' + vergleiche.join(', ') : ''));

  /* ---------- 23.0b instanzregeln.js: jede Zelle der Status-Matrix (§2.7), Fristen, Übergänge, Verkauf ---------- */
  const zellenOk = R.ZEILEN.every((z) => R.BEREICHE.every((b) => { const c = R.MATRIX[z][b]; return c === true || c === false || (Array.isArray(c) && c.length > 0); })) && R.ZEILEN.every((z) => Object.keys(R.MATRIX[z]).length === R.BEREICHE.length);
  ok(zellenOk && R.ZEILEN.length === 5 && R.BEREICHE.length === 9, 'instanzregeln.js: Matrix mit allen 5 × 9 Zellen (ja, nein oder Liste der Felder)');
  const erwartet = { // Zeile: seite recht schreiben link ki dashboardLesen dashboardSchreiben einladen export (Bauplan §2.7)
    einrichtung: [0, 1, 0, 0, 0, 1, 'profil', 0, 1], vorschau: [1, 1, 1, 1, 1, 1, 'profil', 0, 1], aktiv: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    pausiert: [0, 1, 0, 0, 0, 1, 'klaer,stage,memo,seen', 0, 1], beendet: [0, 1, 0, 0, 0, 0, 0, 0, 1] };
  const abweichend = [];
  for (const [zeile, werte] of Object.entries(erwartet)) {
    const st = zeile === 'vorschau' ? 'einrichtung' : zeile, o = { vorschau: zeile === 'vorschau' };
    R.BEREICHE.forEach((b, i) => {
      const w = werte[i];
      if (typeof w === 'string') { const felder = w.split(','); if (!felder.every((f) => R.darf(st, b, Object.assign({ feld: f }, o))) || R.darf(st, b, Object.assign({ feld: 'kunde' }, o)) || R.darf(st, b, o)) abweichend.push(zeile + '.' + b); }
      else if (R.darf(st, b, o) !== !!w) abweichend.push(zeile + '.' + b);
    });
  }
  ok(!abweichend.length, 'instanzregeln.js: darf() beantwortet jede Zelle wie im Bauplan §2.7' + (abweichend.length ? ' (abweichend: ' + abweichend.join(', ') + ')' : ''));
  ok(R.seite('einrichtung').code === 503 && R.seite('einrichtung', { vorschau: true }).code === 200 && R.seite('pausiert').art === 'pausiert' && R.seite('beendet').code === 410 && R.seite('quatsch').code === 410 && R.anfrageArt('einrichtung', { vorschau: true }) === 'test' && R.anfrageArt('aktiv') === 'website' && R.anfrageArt('pausiert') === null && !R.darf('aktiv', 'gibtsnicht'), 'instanzregeln.js: Startseite 503/200/503/410, Testanfrage in der Vorschau, Unbekanntes ist verboten');
  const F = R.FRISTEN, G = R.GRENZEN;
  ok(F.kulanzTage === 14 && F.pauseMaxTage === 60 && F.loeschenNachEndeTage === 30 && F.testTage === 1 && F.sitzungTage === 14 && F.frischMinuten === 15 && F.freigabeErinnerung.join() === '3,7' && G.anfragenIpTag === 10 && G.pdfBudget === 5000000 && G.anhangMax === 7000000 && G.startsTagInstanzHart === 5000 && Object.isFrozen(F), 'instanzregeln.js: Fristen und Grenzen wie im Bauplan (Vorschläge §5.3)');
  const B = R.bestellung;
  ok(B.LEISTE.map((x) => x.titel).join('|') === 'Bestellt|Bezahlt|In Einrichtung|Domain gesichert|Zur Freigabe|Live' && !!B.uebergang('offen', 'bezahlt', 'stripe') && !B.uebergang('offen', 'bezahlt', 'inhaber') && !B.uebergang('offen', 'live') && !B.uebergang('beendet', 'live') && B.uebergang('freigabe', 'domain', 'inhaber').vermerk && !B.uebergang('freigabe', 'live', 'inhaber').vermerk && R.instanz.statusFuer('live') === 'aktiv' && R.instanz.statusFuer('domain') === 'einrichtung' && R.instanz.uebergang('aktiv', 'pausiert') && !R.instanz.uebergang('beendet', 'aktiv'), 'instanzregeln.js: Statusleiste in sechs Schritten, nur erlaubte Übergänge (wer, Vermerk), Status der Instanz zur Bestellung');
  const v0 = R.verkauf({}), vL = R.verkauf({ live: true }), vO = R.verkauf({ live: true, offen: true, bereit: true }), vOb = R.verkauf({ live: true, offen: true, bereit: false });
  ok(v0.vorlaeufig && !v0.bestellen && v0.kasse && !vL.kasse && vO.kasse && vO.bestellen && !vO.vorlaeufig && !vOb.kasse, 'Verkauf ohne PAKETE_OFFEN: vorläufige Preise, Anfrage statt Bestellung, Paket-Kasse im Live-Modus zu (im Testmodus offen)');
  ok(R.host('HTTPS://WWW.Brandt-Fenster.App/x').host === 'brandt-fenster.app' && /^xn--/.test(R.host('müller-fenster.de').host) && !R.host('eeziframes.com').ok && !R.host('kunde.eeziframes.com').ok && R.host('demo-plus.eeziframes.com', { demo: true }).ok && !R.host('plus.localhost').ok && R.host('plus.localhost', { lokal: true }).ok && !R.host('x').ok, 'instanzregeln.js: Domains normalisiert (klein, ohne www., Punycode), keine eeziframes- und Test-Hosts');
  ok(!R.farbe('#0071e3').ok && R.farbe('#8fd694').ok && R.farbe(R.akzent('#0071e3')).ok && R.kontrast('#ffffff', '#000000') === 21, 'instanzregeln.js: Firmenfarbe mit Kontrast ≥ 4,5:1 auf #161616, Vorschlag zum Aufhellen');
  const best = B.vollstaendig({ firma: { firma: 'Brandt', strasse: 'Weg 1', plz: '5066', ort: 'Köln', bundesland: 'NW', ap: 'J', tel: '12', rechtsform: 'GmbH', vertretung: 'Jens', ust: 'DE12', erreichbar: { tage: [], von: '18:00', bis: '08:00' } }, konfigurator: { name: 'Brandt', domains: [], eingang: ['x@y'] } }, P.merkmale('signature'), 'S1', {});
  const feldFehler = Object.keys(best.fehler);
  ok(!best.ok && ['firma.plz', 'firma.ap', 'firma.tel', 'firma.ust', 'firma.erreichbar.tage', 'firma.erreichbar.zeit', 'konfigurator.domains', 'konfigurator.eingang.0', 'konfigurator.zugang', 'zustimmung.unternehmer', 'zustimmung.agb', 'zustimmung.avv'].every((k) => feldFehler.includes(k)), 'instanzregeln.js: Feldregeln der Bestellung melden jeden Fehler am Feld (' + feldFehler.length + ')');

  /* ---------- 23.0c Speicher-Attrappe: Anlegen, Lesen, Ändern mit Version für jede neue Tabelle ---------- */
  const umg = await imp('functions/api/umgebung.js'), { speicher } = await imp('functions/api/speicher.js');
  const sp = speicher(umg.konfig({ DATEN_ATTRAPPE: '1' }));
  const fehlerVon = async (fn) => { try { await fn(); return null; } catch (e) { return e; } };
  const iA = await sp.instanzAnlegen({ slug: 'a' + stempel, name: 'Fenster A', plz: '50667', paket: 'plus', eingang: { mails: [{ mail: 'a@a.example', bestaetigt: null }] }, betriebDaten: { ap: 'Anna' } });
  const iB = await sp.instanzAnlegen({ slug: 'b' + stempel, name: 'Fenster B', plz: '10115', paket: 'signature', zugang: [{ mail: 'z@b.example', uid: 'uid-b-' + stempel }] });
  const rowA = await sp.instanzHolen(iA), betA = await sp.betriebHolen(rowA.betrieb);
  ok(rowA.status === 'einrichtung' && rowA.version === 1 && rowA.paket === 'plus' && betA.mail === 'i-' + iA.replace(/-/g, '') + '@instanz.invalid' && betA.daten.konto === 'instanz' && betA.daten.instanz.id === iA && betA.daten.ap === 'Anna' && !betA.auth_user && !betA.stripe_customer && (await sp.instanzVonBetrieb(rowA.betrieb)).id === iA, 'Speicher: Instanz mit Betriebszeile angelegt (Platzhalter auf .invalid, konto instanz, ohne Anmeldung und Stripe)');
  const neuA = await sp.instanzAendern(iA, (z) => { z.status = 'aktiv'; z.marke = { name: 'A', v: 1 }; });
  const nichts = await sp.instanzAendern(iA, () => false), wert = await sp.instanzAendern(iA, (z) => { z.indexierung = true; return 'fertig'; });
  ok(neuA.status === 'aktiv' && neuA.version === 2 && nichts === false && wert === 'fertig' && (await sp.instanzHolen(iA)).version === 3 && (await fehlerVon(() => sp.instanzAnlegen({ slug: 'a' + stempel, name: 'X', paket: 'plus' }))).extra.grund === 'slug_vergeben' && (await fehlerVon(() => sp.instanzAnlegen({ slug: 'z' + stempel, name: 'X', paket: 'gold' }))).status === 400 && (await fehlerVon(() => sp.instanzAendern(iA, (z) => { z.slug = 'b' + stempel; }))).status === 409, 'Speicher: instanzAendern mit Version (false schreibt nichts), eindeutige Kennung, nur bekannte Pakete');
  const nr = [await sp.instanzNr(iA), await sp.instanzNr(iA), await sp.instanzNr(iB)], jahr = new Date().getFullYear();
  ok(nr.join() === ['P-' + jahr + '-001', 'P-' + jahr + '-002', 'P-' + jahr + '-001'].join(), 'Speicher: instanz_nr zählt je Instanz unabhängig (' + nr.join(', ') + ')');
  await sp.hostAnlegen({ host: 'a' + stempel + '.example', instanz: iA, haupt: true, status: 'aktiv' });
  await sp.hostAnlegen({ host: 'alias-a' + stempel + '.example', instanz: iA });
  const hostFehler = [await fehlerVon(() => sp.hostAnlegen({ host: 'a' + stempel + '.example', instanz: iB })), await fehlerVon(() => sp.hostAnlegen({ host: 'zweit-a' + stempel + '.example', instanz: iA, haupt: true })), await fehlerVon(() => sp.hostAnlegen({ host: 'www.a' + stempel + '.example', instanz: iA })), await fehlerVon(() => sp.hostAnlegen({ host: 'Gross.example', instanz: iA }))];
  const fh = await sp.instanzFuerHost('A' + stempel + '.EXAMPLE'), fhAlias = await sp.instanzFuerHost('alias-a' + stempel + '.example');
  ok(hostFehler[0].extra.grund === 'host_vergeben' && hostFehler[1].extra.grund === 'haupt_doppelt' && hostFehler[2].status === 400 && hostFehler[3].status === 400 && fh && fh.haupt && fh.instanz.id === iA && !('entwurf' in fh.instanz) && !('zugang' in fh.instanz) && fh.betrieb.name === 'Fenster A' && fh.betrieb.ap === 'Anna' && fhAlias.haupthost === 'a' + stempel + '.example' && !fhAlias.haupt && (await sp.instanzFuerHost('gibtsnicht.example')) === null && (await sp.hostsVon(iA)).length === 2, 'Speicher: Hosts eindeutig, eine Hauptdomain je Instanz, Format geprüft; instanzFuerHost ohne Entwurf und Zugänge, mit Haupthost');
  const code = (s) => (s + stempel + 'aaaaaaaaaa').replace(/[^a-z0-9]/g, '').slice(0, 10);
  const an = await sp.anfrageAnlegen({ code: code('q'), instanz: iA, betrieb: rowA.betrieb, lid: 'l1', art: 'website', daten: { kunde: 'K', aufmass: { windows: [1] }, vorher: { x: 1 } } });
  const anFehler = [await fehlerVon(() => sp.anfrageAnlegen({ code: code('q'), instanz: iA, betrieb: rowA.betrieb, lid: 'l2', art: 'website' })), await fehlerVon(() => sp.anfrageAnlegen({ code: code('r'), instanz: iA, betrieb: rowA.betrieb, lid: 'l1', art: 'website' })), await fehlerVon(() => sp.anfrageAnlegen({ code: 'kurz', instanz: iA, betrieb: rowA.betrieb, lid: 'l3', art: 'website' }))];
  const jetzt = Date.now();
  await sp.anfrageAendern(an.code, (z) => { z.status = 'eingegangen'; z.eingegangen_at = new Date(jetzt).toISOString(); z.versand = { runde: 1, status: 'offen', versuche: 0, naechster: new Date(jetzt + 600000).toISOString(), id: 'mail-' + stempel }; });
  const kopf = await sp.anfragenVonBetrieb(rowA.betrieb, { kopf: true }), stand = await sp.anfragenStand(rowA.betrieb);
  const faelligJetzt = await sp.anfragenFaellig(jetzt), faelligSpaeter = await sp.anfragenFaellig(jetzt + 700000);
  await sp.anfrageAendern(an.code, (z) => { z.loeschen_ab = new Date(jetzt + 86400000).toISOString(); });
  ok(an.version === 0 && (await sp.anfrageHolen(an.code)).version === 2 && anFehler[0].extra.grund === 'anfrage_vorhanden' && anFehler[1].extra.grund === 'anfrage_vorhanden' && anFehler[2].status === 400 && (await sp.anfrageNachLid(rowA.betrieb, 'l1')).code === an.code && kopf.length === 1 && kopf[0].daten.kunde === 'K' && !('aufmass' in kopf[0].daten) && !('vorher' in kopf[0].daten) && stand.anzahl === 1 && !!stand.stand && !faelligJetzt.some((a) => a.code === an.code) && faelligSpaeter.some((a) => a.code === an.code) && (await sp.anfrageNachMailId('mail-' + stempel)).code === an.code && !(await sp.anfragenZuLoeschen(jetzt)).some((a) => a.code === an.code) && (await sp.anfragenZuLoeschen(jetzt + 2 * 86400000)).some((a) => a.code === an.code), 'Speicher: Anfragen mit Code und lid eindeutig, Ändern mit Version, Kopf ohne Aufmaß, Stand, fällige Versände, Mail-ID, Löschfrist');
  const e1 = await sp.entwurfAnlegen(code('e'), rowA.betrieb, { instanz: { id: iA } }), e2 = await sp.entwurfAnlegen(code('e'), rowA.betrieb, { anders: true });
  ok(e1 && e1.meta.instanz.id === iA && e2 === null && (await sp.entwurfHolen(code('e'))).meta.instanz.id === iA, 'Speicher: entwurfAnlegen legt nur neu an und überschreibt nie (zweiter Versuch: null)');
  const pa = await sp.partnerAnlegen({ mail: 'Partner-' + stempel + '@Beispiel.example', firma: 'Partner GmbH', auth_user: 'uid-p-' + stempel });
  const paFehler = await fehlerVon(() => sp.partnerAnlegen({ mail: 'partner-' + stempel + '@beispiel.example', firma: 'Doppelt' }));
  const paNeu = await sp.partnerAendern(pa.id, (z) => { z.daten = { ort: 'Köln' }; });
  ok(pa.mail === 'partner-' + stempel + '@beispiel.example' && paFehler.extra.grund === 'partner_vorhanden' && paNeu.version === 1 && paNeu.daten.ort === 'Köln' && (await sp.partnerNachMail('PARTNER-' + stempel + '@beispiel.example')).id === pa.id && (await sp.partnerNachAuth('uid-p-' + stempel)).id === pa.id && (await sp.partnerFelder(pa.id, { stripe_customer: 'cus_' + stempel })).stripe_customer === 'cus_' + stempel, 'Speicher: Partner mit eindeutiger Adresse (klein), Ändern mit Version, Felder');
  const b1 = await sp.bestellungAnlegen({ partner: pa.id, paket_bestellt: 'plus', preise: P.preisStand('plus'), zahlung: { session: 'cs_' + stempel } });
  const b2 = await sp.bestellungAnlegen({ partner: pa.id, paket_bestellt: 'signature' });
  const bFehler = [await fehlerVon(() => sp.bestellungAnlegen({ partner: pa.id, paket_bestellt: 'plus', zahlung: { session: 'cs_' + stempel } })), await fehlerVon(() => sp.bestellungAendern(b2.id, (z) => { z.zahlung = { session: 'cs_' + stempel }; }))];
  await sp.bestellungAendern(b1.id, (z) => { z.status = 'bezahlt'; z.zahlung.pi = 'pi_' + stempel; z.abo = { id: 'sub_' + stempel }; z.verlauf = new Array(230).fill({ t: 1 }); });
  const b1n = await sp.bestellungHolen(b1.id);
  ok(/^B-\d{4}-\d{4}$/.test(b1.nr) && b1.nr !== b2.nr && b1.status === 'offen' && bFehler[0].extra.grund === 'zahlung_doppelt' && bFehler[1].extra.grund === 'zahlung_doppelt' && b1n.version === 1 && b1n.verlauf.length === 200 && (await sp.bestellungNachSession('cs_' + stempel)).id === b1.id && (await sp.bestellungNachPi('pi_' + stempel)).id === b1.id && (await sp.bestellungNachAbo('sub_' + stempel)).id === b1.id && (await sp.bestellungenVonPartner(pa.id)).length === 2 && (await sp.bestellungenListe({ status: 'bezahlt' })).some((b) => b.id === b1.id), 'Speicher: Bestellungen mit Nummer B-JJJJ-NNNN, Zahlung (Session, PaymentIntent) eindeutig, Verlauf höchstens 200, Suche nach Session, PI, Abo, Status');
  const n1 = await sp.nachrichtAnlegen({ partner: pa.id, bestellung: b1.id, von: 'partner', art: 'rueckruf', text: 'Bitte anrufen', rueckruf: { tag: '2026-10-23', fenster: 'vm' } });
  await sp.nachrichtAnlegen({ partner: pa.id, von: 'inhaber', text: 'Hallo' });
  const gelesen = await sp.nachrichtenGelesen(pa.id, 'partner'), offen1 = (await sp.rueckrufeOffen()).some((x) => x.id === n1.id);
  await sp.nachrichtAendern(n1.id, { rueckruf: { tag: '2026-10-23', fenster: 'vm', erledigt: new Date().toISOString() } });
  ok((await sp.nachrichtenVon(pa.id)).length === 2 && gelesen === 1 && offen1 && !(await sp.rueckrufeOffen()).some((x) => x.id === n1.id) && (await sp.nachrichtenVon(pa.id, { bestellung: b1.id })).length === 1, 'Speicher: Nachrichten, gelesen je Empfänger, offene Rückrufe');
  const geschuetzt = await sp.geschuetzteNutzer();
  ok(geschuetzt.has('uid-p-' + stempel) && geschuetzt.has('uid-b-' + stempel), 'Speicher: geschuetzteNutzer() kennt Partner- und Zugangs-Anmeldungen (Aufräumen der Zentrale)');
  const z1 = await sp.zaehlerErhoehen('2026-10-22', 'budget:t' + stempel), z2 = await sp.zaehlerErhoehen('2026-10-22', 'budget:t' + stempel, 2), zl = await sp.zaehlerLesen('2026-10-22', ['budget:t' + stempel, 'budget:leer' + stempel]);
  ok(z1 === 1 && z2 === 3 && zl['budget:t' + stempel] === 3 && zl['budget:leer' + stempel] === 0, 'Speicher: dauerhafte Zähler (zaehlerErhoehen, zaehlerLesen)');
  await sp.instanzLoeschen(iA);
  ok(!(await sp.instanzHolen(iA)) && !(await sp.betriebHolen(rowA.betrieb)) && !(await sp.anfrageHolen(an.code)) && !(await sp.instanzFuerHost('a' + stempel + '.example')) && !(await sp.entwurfHolen(code('e'))), 'Speicher: instanzLoeschen nimmt Hosts, Anfragen, Zwischenstände und Betriebszeile mit');

  /* ---------- 23.0d sitzung.js: Bereich, Host, Ablauf, Unterschrift, Herkunft, Zweck-Token ---------- */
  const S = await imp('functions/api/sitzung.js');
  const kS = umg.konfig({ DATEN_ATTRAPPE: '1' }), envS = { DATEN_ATTRAPPE: '1' };
  const ctxS = (adresse, o) => { o = o || {}; const hh = new Headers(); if (o.cookie) hh.set('cookie', o.cookie); if (o.origin) hh.set('origin', o.origin); return { k: o.k || kS, env: o.env || envS, url: new URL(adresse), request: new Request(adresse, { method: o.method || 'GET', headers: hh }) }; };
  const SIG = 'http://signature.localhost:8788/api/konto';
  const sc = await S.sitzungSetzen(ctxS(SIG), 'betrieb', { sub: 'nutzer-1', mail: 'Chef@Beispiel.example' }), keks = sc.split(';')[0];
  const gut = await S.sitzungLesen(ctxS(SIG, { cookie: keks }), 'betrieb');
  const teile = keks.split('=')[1].split('.'), fremdeMac = '__Host-betrieb=' + teile[0] + '.' + teile[1].replace(/^./, (c) => (c === 'A' ? 'B' : 'A'));
  const alsPartner = '__Host-partner=' + keks.split('=')[1];
  const spaeter = { DATEN_ATTRAPPE: '1', JETZT: new Date(Date.now() + 15 * 864e5).toISOString() };
  const sitzungFall = {
    falscherBereich: await S.sitzungLesen(ctxS(SIG, { cookie: alsPartner }), 'partner'),
    falscherHost: await S.sitzungLesen(ctxS('http://signature2.localhost:8788/api/konto', { cookie: keks }), 'betrieb'),
    abgelaufen: await S.sitzungLesen(ctxS(SIG, { cookie: keks, env: spaeter }), 'betrieb'),
    fremderMac: await S.sitzungLesen(ctxS(SIG, { cookie: fremdeMac }), 'betrieb'),
    postOhneOrigin: await S.sitzungLesen(ctxS(SIG, { cookie: keks, method: 'POST' }), 'betrieb'),
    postFremd: await S.sitzungLesen(ctxS(SIG, { cookie: keks, method: 'POST', origin: 'https://boese.example' }), 'betrieb'),
    anderesGeheimnis: await S.sitzungLesen(ctxS(SIG, { cookie: keks, k: umg.konfig({ SITZUNG_GEHEIMNIS: 'x'.repeat(40) }) }), 'betrieb')
  };
  const postEigen = await S.sitzungLesen(ctxS(SIG, { cookie: keks, method: 'POST', origin: 'http://signature.localhost:8788' }), 'betrieb');
  ok(/^__Host-betrieb=[^;]+; Path=\/; Secure; HttpOnly; SameSite=Strict; Max-Age=1209600$/.test(sc) && gut && gut.sub === 'nutzer-1' && gut.mail === 'chef@beispiel.example' && gut.aud === 'signature.localhost' && gut.frisch === true && !!postEigen, 'sitzung.js: Cookie __Host-betrieb (HttpOnly, Secure, SameSite=Strict, 14 Tage) gilt auf seinem Host, frisch nach der Anmeldung');
  ok(Object.values(sitzungFall).every((x) => x === null), 'sitzung.js: falscher Bereich, falscher Host, abgelaufen, fremde Unterschrift, fremdes Geheimnis, Schreiben ohne oder mit fremder Herkunft → abgelehnt (' + Object.entries(sitzungFall).filter(([, x]) => x !== null).map(([n]) => n).join(', ') + ')');
  const alt20 = { DATEN_ATTRAPPE: '1', JETZT: new Date(Date.now() + 20 * 60000).toISOString() };
  const pflicht = await fehlerVon(() => S.sitzungPflicht(ctxS(SIG, { cookie: keks, env: alt20 }), 'betrieb', { frisch: true })), ohne = await fehlerVon(() => S.sitzungPflicht(ctxS(SIG), 'betrieb'));
  ok(pflicht && pflicht.status === 401 && pflicht.extra.frisch === true && ohne.status === 401 && ohne.extra.anmelden === true && (await S.sitzungLesen(ctxS(SIG, { cookie: keks, env: alt20 }), 'betrieb', { frisch: true })) === null && /Max-Age=0$/.test(S.sitzungLoeschen(ctxS(SIG), 'betrieb')), 'sitzung.js: Geld-Aktionen verlangen eine frische Anmeldung (nach 20 Minuten 401 { frisch: true }), ohne Sitzung 401 { anmelden: true }, Abmelden');
  const tok = await S.tokenSignieren(kS, 'vorschau', { i: 'x' }, 60), kSpaeter = umg.konfig({ DATEN_ATTRAPPE: '1', JETZT: new Date(Date.now() + 120000).toISOString() });
  const ohneGeheimnis = umg.konfig({}), kurz = umg.konfig({ SITZUNG_GEHEIMNIS: 'zu-kurz' });
  ok((await S.tokenPruefen(kS, 'vorschau', tok)).i === 'x' && (await S.tokenPruefen(kS, 'fotos', tok)) === null && (await S.tokenPruefen(kSpaeter, 'vorschau', tok)) === null && (await S.tokenPruefen(kS, 'vorschau', tok + 'x')) === null && (await S.tokenPruefen(ohneGeheimnis, 'vorschau', tok)) === null && (await fehlerVon(() => S.tokenSignieren(ohneGeheimnis, 'vorschau', {}, 60))).status === 503 && (await fehlerVon(() => S.sitzungSetzen(ctxS(SIG, { k: kurz }), 'partner', { sub: 'x' }))).status === 503 && kurz.hinweise.some((t) => /SITZUNG_GEHEIMNIS/.test(t)), 'sitzung.js: Zweck-Token nur für seinen Zweck und bis zum Ablauf; ohne SITZUNG_GEHEIMNIS (≥ 32 Zeichen) weder Sitzung noch Token');

  /* ---------- 23.0e post.js: .invalid abgelehnt, Anhänge, Absender, Idempotenz, Rahmen je Marke ---------- */
  const postM = await imp('functions/api/post.js');
  const pd = postM.postDienst({ post: { attrappe: true, absender: 'test@eeziframes.invalid', kontakt: 'k@beispiel.example' } });
  const pdf = Buffer.from('%PDF-1.4\n% Prüfung\n').toString('base64');
  const rInv = await pd.senden({ an: 'i-abc@instanz.invalid', betreff: 'x', html: 'y' }), rInv2 = await pd.senden({ an: ['ok@beispiel.example', 'i-abc@instanz.invalid'], betreff: 'x', html: 'y' });
  const rAn = await pd.senden({ an: ['eins@beispiel.example', 'zwei@beispiel.example'], betreff: 'Neue Anfrage ' + stempel, html: postM.mailRahmen('T', '<p>x</p>', '', { marke: { name: 'Fenster <A>', logoCid: 'logo-a', dezent: true } }), anhaenge: [{ filename: 'Aufmass-P-1.pdf', content: pdf, content_type: 'application/pdf' }], von: { name: 'Konfigurator "A" <b>', adresse: 'anfragen@post.beispiel.example' }, antwortAn: 'kunde@beispiel.example', idempotenz: 'anfrage-' + stempel + '-1-0' });
  const rDoppelt = await pd.senden({ an: 'eins@beispiel.example', betreff: 'nochmal', html: 'y', idempotenz: 'anfrage-' + stempel + '-1-0' });
  const gemerkt = postM.attrappePost.find((m) => m.betreff === 'Neue Anfrage ' + stempel);
  ok(rInv.ok === false && rInv.grund === 'invalid' && rInv2.grund === 'invalid' && rAn.ok && rDoppelt.ok && rDoppelt.id === rAn.id && !postM.attrappePost.some((m) => m.betreff === 'nochmal') && gemerkt && gemerkt.anhaenge.length === 1 && gemerkt.anhaenge[0].name === 'Aufmass-P-1.pdf' && gemerkt.anhaenge[0].typ === 'application/pdf' && gemerkt.anhaenge[0].bytes === Buffer.from(pdf, 'base64').length && gemerkt.von.name === 'Konfigurator A b' && gemerkt.von.adresse === 'anfragen@post.beispiel.example' && gemerkt.an.length === 2 && gemerkt.antwortAn === 'kunde@beispiel.example', 'post.js: Empfänger auf .invalid abgelehnt, Anhang (Name, Typ, Größe), Absender mit Anzeigename, mehrere Empfänger, Idempotenz gemerkt');
  const eezi = postM.mailRahmen('T', '<p>x</p>', 'k'), dezent = postM.mailRahmen('T', '<p>x</p>', 'k', { marke: { name: 'Fenster <A>', logoCid: 'logo-a', dezent: true } }), neutral = postM.mailRahmen('T', '<p>x</p>', 'k', { marke: 'neutral' }), eigen = postM.mailRahmen('T', '<p>x</p>', '', { marke: { name: 'Fenster A' } });
  ok(eezi.includes('cid:eeziframes-zeichen') && dezent.includes('cid:logo-a') && dezent.includes('Konfigurator von eeziframes') && !dezent.includes('cid:eeziframes-zeichen') && dezent.includes('Fenster &lt;A&gt;') && !/eezi/i.test(neutral) && !/eezi/i.test(eigen) && eigen.includes('Fenster A'), 'post.js: mailRahmen mit Marke null (eeziframes), dezent (Logo des Betriebs, Fußzeile), neutral und eigen (ohne eeziframes)');

  /* ---------- 23.0f bremse.js, Ablagen, Cron-Weiche ---------- */
  const Br = await imp('functions/api/bremse.js');
  let erlaubt = 0; for (let i = 0; i < 12; i++) if (await Br.bremse({ env: {} }, 'START', '203.0.113.' + stempel)) erlaubt++;
  const aufrufe = []; const binding = { limit: async (o) => { aufrufe.push(o.key); return { success: aufrufe.length < 2 }; } };
  const b1r = await Br.bremse({ env: { RL_KI: binding } }, 'RL_KI', 'k1'), b2r = await Br.bremse({ env: { RL_KI: binding } }, 'KI', 'k1');
  const kaputt = await Br.bremse({ env: { RL_FORM: { limit: async () => { throw new Error('weg'); } } } }, 'FORM', 'f-' + stempel);
  const ctxB = { env: { DATEN_ATTRAPPE: '1' }, sp: sp }, budgets = [];
  for (let i = 0; i < 6; i++) budgets.push(await Br.budget(ctxB, 'inst:t' + stempel + ':ki', 4, { alarm: 3, monat: true }));
  ok(erlaubt === 10 && b1r === true && b2r === false && aufrufe.join() === 'k1,k1' && kaputt === true && budgets.map((b) => b.ok).join() === 'true,true,true,true,false,false' && budgets.filter((b) => b.alarm).length === 1 && budgets[2].alarm && (await Br.budgetStand(ctxB, 'inst:t' + stempel + ':ki', { monat: true })) === 6 && Object.keys(Br.BREMSEN).join() === 'RL_LINK,RL_START,RL_FOTO,RL_KI,RL_OTP,RL_FORM', 'bremse.js: Binding RL_* wenn da, sonst Bremse im Arbeitsspeicher (10 Starts je Minute); budget zählt dauerhaft, Alarm genau einmal, über max nein');
  const fotos = await imp('functions/api/fotos.js'), kA = umg.konfig({ DATEN_ATTRAPPE: '1' });
  const abM = fotos.ablage(kA, 'marke'), abB = fotos.ablage(kA, 'blatt'), abBe = fotos.ablage(kA, 'bestellungen');
  const png = new Uint8Array([137, 80, 78, 71]);
  ok(Object.keys(fotos.ABLAGEN).join() === 'fotos,marke,bestellungen,blatt' && fotos.ablage(kA).art === 'attrappe' && await abM.ablegen('instanz/t' + stempel + '/1/logo.png', png, 'image/png') && !(await abM.ablegen('instanz/t' + stempel + '/1/x.pdf', png, 'application/pdf')) && await abB.ablegen('instanz/t' + stempel + '/q-1.pdf', png, 'application/pdf') && await abBe.ablegen('partner/p/b/d1.svg', png, 'image/svg+xml') && abM.alle().includes('instanz/t' + stempel + '/1/logo.png') && !fotos.ablage(kA).alle().some((x) => x.includes('t' + stempel)) && fotos.FOTO_ID.test('b0123456789abk') && fotos.FOTO_ID.test('b0123456789ab') && !fotos.FOTO_ID.test('b0123456789a') && !fotos.FOTO_ID.test('b0123456789abcdefghijklmnopk') && fotos.fotoIds([{ bilder: { in: 'b0123456789abk' } }]).has('b0123456789abk'), 'fotos.js: Ablagen fotos, marke, bestellungen, blatt getrennt mit erlaubten Typen; FOTO_ID nimmt die kleine Fassung …k');
  const router = await imp('functions/api/router.js');
  const log = console.log; console.log = () => {}; // der Lauf schreibt sein Ergebnis ins Log
  let zehn, taeglich; try { zehn = await router.geplant({ DATEN_ATTRAPPE: '1' }, router.CRON_ZEHN); taeglich = await router.geplant({ DATEN_ATTRAPPE: '1' }, router.CRON_TAEGLICH); } finally { console.log = log; }
  ok(router.CRON_ZEHN === '*/10 * * * *' && router.CRON_TAEGLICH === '17 4 * * *' && zehn.zehn === true && !('aufraeumen' in zehn) && !('nachholen' in zehn) && !!taeglich.instanzen && ['anfragen', 'bestellungen', 'domains', 'einladungen'].every((x) => taeglich.instanzen[x] && taeglich.instanzen[x].ok) && taeglich.nurAufraeumen === true && !!taeglich.nachholen, 'router.js: Cron-Weiche nach Zeitplänen (alle 10 Minuten nur der Versand, täglich Aufräumen, Nachholen und die Läufe der Instanzen)');

  /* ---------- 23.0g Stubs mit festen Exportnamen ---------- */
  const STUBS = {
    'functions/instanz/mandant.js': ['hostVon', 'istHaupt', 'instanzVon', 'auftritt', 'cacheVergessen'],
    'functions/instanz/seiten.js': ['ausliefern', 'kopf', 'konfigJs', 'icons', 'robots', 'fehlerSeite'],
    'functions/instanz/adapter.js': ['linkAufloesen', 'linkAendern', 'pseudoKonto'],
    'functions/instanz/verwalten.js': ['instanzAnlegen', 'instanzAendern', 'instanzStatus', 'hostSetzen', 'hostEntfernen', 'hauptSetzen', 'markeVeroeffentlichen', 'bildAblegen', 'empfaengerEinladen', 'vorschauToken', 'cacheLeeren', 'instanzDatenLoeschen'],
    'functions/instanz/recht.js': ['impressumSeite', 'datenschutzSeite', 'rechtVollstaendig'],
    'functions/api/eingang.js': ['eingangVerarbeiten', 'versandNachholen', 'eingangErneut', 'probeEingang', 'anfragenAufraeumen', 'textPdf', 'EINGANG'],
    'functions/api/instanz-api.js': ['INSTANZ_API'],
    'functions/api/blatt-server.js': ['blattFuerEingang', 'blattAnfrage', 'textPdf'],
    'functions/api/partner.js': ['PARTNER'],
    'functions/api/bestellung.js': ['uebergang', 'einrichtungUebernehmen', 'paketObjekt', 'paketEreignis', 'aboStarten', 'paketWechseln', 'aboSteuern', 'bestellungenLauf', 'erstatten'],
    'functions/api/dashboard.js': ['kontoVon', 'dashboardSicht', 'mailCode', 'einladungenErinnern', 'DASHBOARD'],
    'functions/api/zentrale-instanzen.js': ['ZENTRALE_INSTANZEN'],
    'functions/api/zentrale-bestellungen.js': ['ZENTRALE_BESTELLUNGEN'],
    'functions/api/cloudflare.js': ['cloudflareDienst', 'instanzenPruefen'],
    'functions/pakete-seite.js': ['paketeSeite', 'paketeLlms', 'PAKETE_SEITEN'],
    'functions/api/sitzung.js': ['sitzungSetzen', 'sitzungLesen', 'sitzungPflicht', 'sitzungLoeschen', 'tokenSignieren', 'tokenPruefen'],
    'functions/api/bremse.js': ['bremse', 'budget']
  };
  const stubFehlt = [];
  for (const [datei, namen] of Object.entries(STUBS)) { let m = {}; try { m = await imp(datei); } catch (e) { stubFehlt.push(datei + ' (' + e.message + ')'); continue; } namen.forEach((n) => { if (!(n in m)) stubFehlt.push(datei + ': ' + n); }); }
  ok(!stubFehlt.length, 'Alle Module der Stränge importierbar mit den festen Exportnamen (' + Object.keys(STUBS).length + ' Dateien)' + (stubFehlt.length ? ': fehlt ' + stubFehlt.join(', ') : ''));
  const bst = await imp('functions/api/bestellung.js'), ad = await imp('functions/instanz/adapter.js'), rechtI = await imp('functions/instanz/recht.js');
  const ps = ad.pseudoKonto({ abzug: { seite: 10 }, prefs: { mail: true }, since: 2020, links: [{ code: 'x' }] }, { code: 'y' });
  const impr = rechtI.impressumSeite({ name: 'Fenster "B" <b>&', m: P.merkmale('signature'), recht: { firma: 'Fenster "B" <b>&', rechtsform: 'GmbH', vertretung: 'Bea', strasse: 'Weg 1', plz: '50667', ort: 'Köln', tel: '0221 1', mail: 'b@beispiel.example', bundesland: 'NW' } });
  const dsSig = rechtI.datenschutzSeite({ name: 'B', m: P.merkmale('signature'), recht: { firma: 'B' } }), dsEss = rechtI.datenschutzSeite({ name: 'E', m: P.merkmale('essential'), recht: { firma: 'E' } });
  ok(bst.paketObjekt({ type: 'checkout.session.completed', data: { object: { metadata: {} } } }) === false && ps.konto === 'instanz' && ps.links.length === 1 && ps.links[0].code === 'y' && ps.book.length === 0 && ps.abzug.seite === 10 && /Angaben nach § 5 DDG/.test(impr) && !impr.includes('<b>&') && impr.includes('Fenster &quot;B&quot; &lt;b&gt;&amp;') && !/eeziframes/i.test(dsSig) && /eeziframes/.test(dsEss) && rechtI.rechtVollstaendig({}).fehlt.length >= 8, 'Stubs: paketObjekt lässt Stripe beim Altbestand, Pseudo-Konto, Impressum aus Feldern (escapt), Datenschutz-Platzhalter ohne eeziframes bei Signature');

  /* ---------- 23.0h wrangler.jsonc, Schema, Haken in seo.js, Doku ---------- */
  const wr = lies('wrangler.jsonc'), wrCode = wr.replace(/^\/\*[\s\S]*?\*\//, '').split('\n').map((z) => z.replace(/^\s*\/\/.*$/, '')).join('\n'); // nur der Kopfkommentar und ganze Kommentarzeilen („/*“ steht auch in Pfaden)
  const rwf = JSON.parse((wr.match(/"run_worker_first":\s*(\[[^\]]*\])/) || [])[1] || '[]');
  const neuePfade = ['/config.js', '/favicon.svg', '/apple-touch-icon.png', '/og.png', '/manifest.webmanifest', '/marke/*', '/betrieb', '/betrieb/*', '/zentrale', '/zentrale/*', '/partner', '/partner/*', '/konfigurator-bedingungen', '/konfigurator-bedingungen/*', '/404.html'];
  ok(!/"routes"|"route"|"custom_domain"/.test(wrCode) && !/not_found_handling/.test(wrCode) && neuePfade.every((p) => rwf.includes(p)) && /"\*\/10 \* \* \* \*"/.test(wrCode) && ['RL_LINK', 'RL_START', 'RL_FOTO', 'RL_KI', 'RL_OTP', 'RL_FORM'].every((n) => new RegExp('"name": "' + n + '"').test(wrCode)) && !/"kv_namespaces"|"queues"/.test(wrCode), 'wrangler.jsonc: keine routes/custom_domain, kein not_found_handling, neue Pfade im Worker, Cron alle 10 Minuten, sechs Bremsen; KV und Queue erst nach Einrichtung');
  const sql = lies('supabase/schema.sql');
  ok(['partner', 'bestellungen', 'partner_nachrichten', 'instanzen', 'instanz_hosts', 'anfragen'].every((t) => sql.includes('create table if not exists public.' + t + ' (') && sql.includes('alter table public.' + t)) && ['instanz_nr(p_instanz uuid)', 'instanz_fuer_host(p_host text)', 'instanz_anlegen(p jsonb)', 'anfragen_kopf(p_betrieb uuid', 'eeziframes_budget(p_tag date'].every((f) => sql.includes('create or replace function public.' + f)) && sql.includes('bestellungen_session_uidx') && sql.includes("'@instanz.invalid'") && /grant execute on function public\.instanz_nr/.test(sql), 'supabase/schema.sql: neue Tabellen mit RLS, Funktionen instanz_nr, instanz_fuer_host, instanz_anlegen, anfragen_kopf, eeziframes_budget, eindeutige Zahlung');
  const seo = await imp('functions/seo.js');
  ok(seo.istSeite('/konfigurator-bedingungen/') && /Disallow: \/partner\//.test(seo.robots('https://eeziframes.com', true)) && !/Disallow: \/partner\//.test(seo.robots('https://eeziframes.com', false)) && lies('functions/seo.js').includes('paketeSeite(') && lies('functions/seo.js').includes('paketeLlms(') && lies('functions/seo.js').includes('.concat(PAKETE_SEITEN)'), 'seo.js: Haken paketeSeite, paketeLlms und PAKETE_SEITEN, /partner/ gesperrt, /konfigurator-bedingungen/ ist eine Seite');
  const doku = fs.existsSync(path.join(W, 'docs/INSTANZEN.md')) ? lies('docs/INSTANZEN.md') : '';
  const vertrag = ['ctx.instanz', 'window.KONFIG', '/api/instanz/start', '/api/instanz/ping', '/api/instanz/bestaetigen', 'linkAufloesen', 'linkAendern', 'pseudoKonto', 'instanzStatus', 'markeVeroeffentlichen', 'empfaengerEinladen', 'vorschauToken', 'cacheLeeren', 'instanzDatenLoeschen', 'eingangVerarbeiten', 'versandNachholen', 'eingangErneut', 'probeEingang', 'anfragenAufraeumen', 'textPdf', 'uebergang', 'einrichtungUebernehmen', 'paketEreignis', 'aboStarten', 'paketWechseln', 'aboSteuern', 'bestellungenLauf', 'erstatten', 'sitzungSetzen', 'sitzungLesen', 'tokenSignieren', 'tokenPruefen', 'bremse(', 'budget(', 'Blatt.pdf', 'pakete.js', 'instanzregeln.js', 'PAKETE_OFFEN', 'Dateibesitz', 'Welle'];
  const dokuFehlt = vertrag.filter((v) => !doku.includes(v));
  ok(doku.length > 2000 && !dokuFehlt.length, 'docs/INSTANZEN.md beschreibt jede Schnittstelle aus Bauplan §3.0, Dateibesitz und Wellen' + (dokuFehlt.length ? ' (fehlt: ' + dokuFehlt.join(', ') + ')' : ''));

  /* ---------- 23.0i Testserver: Host-Kopfzeile, *.localhost, Fehlerseite aus dem Worker, Saat, Hilfen ---------- */
  const st = await h.api('localhost', '/api/status'), stE = await h.api('essential.localhost', '/api/status'), weg = await h.api('localhost', '/gibtsnicht'), start = await h.api('localhost', '/');
  ok(st.status === 200 && st.json.daten === true && stE.status === 200 && weg.status === 404 && /<title>Seite nicht gefunden/.test(weg.text) && weg.headers['content-security-policy'] && start.status === 200 && /<h1>/.test(start.text), 'Testserver: Adresse aus der Kopfzeile Host (auch *.localhost), jede Anfrage durch worker.js, fehlende Datei → Fehlerseite mit 404 und CSP');
  const att = await h.attrappe(), slugs = Object.keys(h.instanzen);
  ok(slugs.join() === 'essential,plus,signature,signature2' && slugs.every((s) => h.instanzen[s].host === s + '.localhost' && h.instanzen[s].status === 'aktiv' && /^[0-9a-f]{8}$/.test(h.instanzen[s].id8)) && att.hosts.some((x) => x.host === 'plus-alias.localhost' && !x.haupt) && att.instanzen.filter((i) => slugs.includes(i.slug)).every((i) => i.eingang.mails.length === 1 && i.eingang.mails[0].bestaetigt && i.recht.firma) && att.instanzen.find((i) => i.slug === 'signature').zugang.length === 1, 'Testserver: Standard-Instanzen essential, plus (mit Alias), signature, signature2 aktiv, mit bestätigter Eingangsadresse, Rechtsangaben und Zugang');
  const gesetzt = await h.instanz('plus.localhost', { indexierung: true }), uhr = await h.uhr(3), uhrAus = await h.uhr(null), lauf = await h.geplant('*/10 * * * *');
  ok(gesetzt && gesetzt.indexierung === true && Math.abs(Date.parse(uhr) - Date.now() - 3 * 864e5) < 60000 && uhrAus === null && lauf && lauf.zehn === true, 'Testserver: Instanz ändern, Uhr vorstellen (JETZT) und zurück, geplanten Lauf auslösen (/__scheduled)');
  const z = await h.zentrale(), zs = await z.api('/api/zentrale/status');
  ok(zs.status === 200 && zs.json.angemeldet === true, 'Testserver: Zentrale angemeldet (h.zentrale)');
  /* Chromium nimmt das Sitzungs-Cookie (__Host-, Secure) auf http://*.localhost an und schickt es nur an diesen Host */
  const kc = await h.browser.newContext(), seite = await kc.newPage();
  await seite.goto(h.base('signature.localhost') + '/__sitzung?bereich=betrieb');
  const drauf = await seite.goto(h.base('signature.localhost') + '/__sitzung/lesen?bereich=betrieb').then((r) => r.json());
  const nebenan = await seite.goto(h.base('signature2.localhost') + '/__sitzung/lesen?bereich=betrieb').then((r) => r.json());
  const kekse = await kc.cookies();
  ok(drauf.sitzung && drauf.sitzung.aud === 'signature.localhost' && nebenan.sitzung === null && kekse.some((c) => c.name === '__Host-betrieb' && c.httpOnly && c.secure && c.sameSite === 'Strict' && c.domain === 'signature.localhost'), 'Chromium nimmt __Host-betrieb auf http://signature.localhost an (HttpOnly, Secure, SameSite=Strict) und schickt es nicht an signature2.localhost');
  await kc.close();
};

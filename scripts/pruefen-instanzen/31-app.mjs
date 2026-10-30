// eeziframes · Prüfabschnitt 31, Teil App: Vermittlung „Angebote aus deiner Nähe“ (docs/VERMITTLUNG.md, Abschnitt 10) im Browser
//   31.A1 Weiche nach „Zeit und Budget“: zwei Karten untereinander (0 € mit durchgestrichenem Preis, „Empfohlen“, Satz des Inhabers), Daten-Garantie,
//         „Warum kostenlos?“ zum Aufklappen, Gratis vorgewählt, eine volle Pille „Betriebe finden“, Ziele ab 44 px, kein Querscrollen; Weg B führt
//         wie bisher über den Kontakt zum Freischalten · 31.A3 Betriebe (Reihenfolge des Inhabers, 30.10.2026: zuerst): nur die Postleitzahl,
//         mit der fünften Ziffer sofort die Liste, unbekannte PLZ am Feld, nur öffentliche Felder in der App, zwei bis fünf, „Sucht ihr passende
//         für mich aus“ · 31.A2 Kontakt danach: Name und Telefon Pflicht, kein Feld „PLZ und Ort“, Fehler am Feld, Einwilligung mit den gewählten
//         Betrieben, ohne sie kein Abschicken · 31.A4 Code: falscher Code bleibt auf der Folie, richtiger schickt ab, Angefragt mit
//         Nummer, Mail an den Inhaber mit dem Aufmaßblatt aus der App (PDF) · 31.A5 Schreibtisch · 31.A6 ohne Vermittlung (Pilot) der
//         bisherige Weg Zeit → Kontakt
export const titel = 'Vermittlung: Folien der App';

export default async function (h) {
  const { ok } = h;
  let netz = 40;
  const kontext = (o) => h.browser.newContext(Object.assign({ extraHTTPHeaders: { 'x-forwarded-for': '198.51.100.' + (++netz) } }, o || {}));
  const telefon = () => kontext(h.telefon);
  const PROJ = { total: 8, zeit: 'asap', budget: 'b2', name: 'Familie Prüfer', ort: '33442 Herzebrock-Clarholz', tel: '', mail: 'pruefer@beispiel.de' };
  const vorbereiten = async (s) => {
    await s.waitForFunction(() => typeof SERVER !== 'undefined' && !!SERVER.vermittlung, null, { timeout: 8000 }).catch(() => null);
    await s.evaluate((p) => { S.windows = demoProject(); S.proj = Object.assign({}, PROJ0, p); S.verm = null; persist(); go('anfrage2'); }, PROJ);
    await s.waitForTimeout(200);
  };
  const pillen = (s) => s.evaluate(() => Array.from(document.querySelectorAll('.scr .dna-pille.lg-weiter')).filter((b) => !b.classList.contains('dna-pille--leise') && b.offsetParent).length);
  const ziele = (s) => s.evaluate(() => Array.from(document.querySelectorAll('.scr button, .scr a, .scr input')).filter((e) => e.offsetParent && !e.closest('.foot-links') && !e.closest('.ab-pflicht') && !e.closest('.vm-recht') && !e.closest('.ab-note') && !e.classList.contains('ulink')).map((e) => { const r = e.getBoundingClientRect(); return { t: (e.getAttribute('aria-label') || e.textContent || e.id || '').trim().slice(0, 30), h: r.height, w: r.width }; }).filter((x) => x.h < 44 || x.w < 44));
  const quer = (s) => s.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  /* Das Etikett der Schritte hat geschützte Leerzeichen („3 von 5“), daher \s in den Mustern */
  const klick = async (s, sel) => { await s.click(sel); await s.waitForTimeout(250); };
  const screen = (s) => s.evaluate(() => S.screen);

  /* ---------- Telefon ---------- */
  const ctx = await telefon(), s = await h.neueSeite(ctx, h.base());
  await s.goto(h.base() + '/app/', { waitUntil: 'networkidle' }); await s.waitForTimeout(400);
  const an = await s.evaluate(() => !!(SERVER.vermittlung && SERVER.vermittlung.an));
  ok(an, '31.A1 Server meldet die Vermittlung (vermittlung.an mit Daten und Mailversand)');
  await vorbereiten(s);
  await klick(s, '.scr .lg-weiter');
  ok(await screen(s) === 'weg', '31.A1 „Zeit und Budget“ führt zur Weiche');
  const weg = await s.evaluate(() => { const A = document.querySelector('.vm-karte[data-v="A"]'), B = document.querySelector('.vm-karte[data-v="B"]'), ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect(), bg = getComputedStyle(document.querySelector('.vm-buehne')).backgroundImage;
    return { karten: document.querySelectorAll('.vm-karte').length, a: A.getAttribute('aria-pressed'), untereinander: ra.bottom <= rb.top && Math.abs(ra.left - rb.left) < 2, titel: (A.querySelector('.vm-karte-titel') || {}).textContent || '', pille: (document.querySelector('.scr .lg-weiter') || {}).textContent || '', etikett: (A.querySelector('.vm-karte-etikett') || {}).textContent || '', null: (A.querySelector('.vm-preis b') || {}).textContent, alt: (A.querySelector('.vm-preis s') || {}).textContent || '', preisB: (B.querySelector('.vm-preis') || {}).textContent || '',
      text: document.querySelector('.scr').textContent, umkreis: !!document.querySelector('.vm-buehne .vm-umkreis'), foto: /buehne\.webp/.test(bg), chip: (document.querySelector('.ab-chip') || {}).textContent || '' }; });
  ok(weg.karten === 2 && weg.a === 'true' && weg.untereinander && weg.etikett === 'Empfohlen' && weg.null === '0' && /7,99/.test(weg.alt) && /7,99/.test(weg.preisB) && weg.umkreis && !weg.foto && /3\svon\s5/.test(weg.chip),
    '31.A1 Weiche: zwei Karten untereinander, Gratis vorgewählt mit „Empfohlen“, 0 € und durchgestrichenem Preis, Umkreis auf der Bühne ohne das Foto mit dem Lichtschatten, Schritt 3 von 5 (' + JSON.stringify(Object.assign({}, weg, { text: undefined })) + ')');
  ok(/Wähle, wie du fortfahren möchtest\./.test(weg.text) && weg.titel === 'Gestatte uns, das Aufmaßblatt an von dir ausgewählte Betriebe zu schicken (und nur an diese).' && /Betriebe finden/.test(weg.pille),
    '31.A1 Weiche: Untertitel und Satz im weißen Feld nach dem Wortlaut des Inhabers, Pille „Betriebe finden“ (' + weg.titel + ')');
  const ga = await s.evaluate(() => { const g = document.querySelector('.vm-garantie'), d = document.querySelector('details.vm-falls'), t = (g || {}).textContent || ''; return { chip: ((g && g.querySelector('.vm-garantie-chip')) || {}).textContent || '', t: t, offen: !!(d && d.open), frage: d ? d.querySelector('summary').textContent : '', unterKarten: !!(g && g.getBoundingClientRect().top > document.querySelector('.vm-karte[data-v="B"]').getBoundingClientRect().bottom), vorFalten: !!(g && d && g.getBoundingClientRect().bottom <= d.getBoundingClientRect().top) }; });
  ok(ga.chip === 'Daten-Garantie' && /meldet sich niemand bei dir/.test(ga.t) && /weder per E-Mail noch per Telefon noch auf anderen Wegen/.test(ga.t) && /nur an die Fensterbauer weiter, die du auswählst/.test(ga.t) && /so wie du es vermutlich auch selbst tun würdest/.test(ga.t) && /Kein versteckter Verkauf und keine versteckte Speicherung/.test(ga.t) && ga.unterKarten && ga.vorFalten && !ga.offen && /Warum kostenlos\?/.test(ga.frage),
    '31.A1 Weiche: Daten-Garantie als Feld mit Chip unter den Karten, darunter „Warum kostenlos?“ zugeklappt');
  await klick(s, 'details.vm-falls summary');
  ok(await s.evaluate(() => { const d = document.querySelector('details.vm-falls'); return d.open && /bezahlen uns für die Vermittlung/.test(d.textContent); }), '31.A1 „Warum kostenlos?“ klappt auf');
  ok(await pillen(s) === 1, '31.A1 Weiche: genau eine volle Pille');
  const z1 = await ziele(s); ok(!z1.length, '31.A1 Weiche: Ziele ab 44 px' + (z1.length ? ' ' + JSON.stringify(z1) : ''));
  ok(!(await quer(s)), '31.A1 Weiche: kein Querscrollen');
  /* Weg B: Blatt auf der Bühne, Kontakt freiwillig, dann Freischalten wie bisher */
  await klick(s, '.vm-karte[data-v="B"]');
  const b = await s.evaluate(() => ({ blatt: !!document.querySelector('.ab-papier'), pille: (document.querySelector('.scr .lg-weiter') || {}).textContent || '', chip: (document.querySelector('.ab-chip') || {}).textContent || '' }));
  ok(b.blatt && /Aufmaßblatt/.test(b.pille) && /3\svon\s4/.test(b.chip), '31.A1 Weg B: Blatt auf der Bühne, „Weiter zum Aufmaßblatt“, Schritt 3 von 4');
  await klick(s, '.scr .lg-weiter');
  const bk = await s.evaluate(() => ({ sc: S.screen, t: (document.querySelector('.lg-frage h1') || {}).textContent || '', pille: (document.querySelector('.scr .lg-weiter') || {}).textContent || '' }));
  ok(bk.sc === 'anfrage3' && /dein Fensterbauer/.test(bk.t) && /Zum Aufmaßblatt/.test(bk.pille), '31.A1 Weg B: Kontakt wie bisher, weiter zum Aufmaßblatt');
  await klick(s, '.scr .lg-zurueck');
  ok(await screen(s) === 'weg', '31.A1 Zurück vom Kontakt führt zur Weiche');
  /* Weg A: zuerst die Betriebe, nur die Postleitzahl */
  await klick(s, '.vm-karte[data-v="A"]');
  await klick(s, '.scr .lg-weiter');
  const be = await s.evaluate(() => ({ sc: S.screen, t: (document.querySelector('.lg-frage h1') || {}).textContent || '', plz: (document.getElementById('vm-plz') || {}).value, felder: document.querySelectorAll('.dna-rechts input, .lg-spalte input, .scr input').length, chip: (document.querySelector('.ab-chip') || {}).textContent || '' }));
  ok(be.sc === 'betriebe' && /Nähe/.test(be.t) && be.plz === '33442' && be.felder === 1 && /4\svon\s5/.test(be.chip), '31.A3 Weg A: „Betriebe finden“ führt zu den Betrieben, nur ein Feld (Postleitzahl, aus „PLZ und Ort“ vorbelegt), Schritt 4 von 5 (' + JSON.stringify(be) + ')');
  await s.waitForSelector('.vm-betrieb', { timeout: 15000 }).catch(() => null);
  /* Postleitzahl leer: kein Weiter, Fehler am Feld; unbekannt: Fehler vom Server am Feld; mit der fünften Ziffer sofort die Liste */
  await s.fill('#vm-plz', ''); await klick(s, '.scr .lg-weiter');
  const p0 = await s.evaluate(() => ({ sc: S.screen, bad: !!document.querySelector('.vm-plzfeld.ist-bad'), f: (document.getElementById('vm-plz-f') || {}).textContent || '', fokus: document.activeElement && document.activeElement.id }));
  ok(p0.sc === 'betriebe' && p0.bad && /fünf Ziffern/.test(p0.f) && p0.fokus === 'vm-plz', '31.A3 Ohne Postleitzahl kein Weiter: Fehler am Feld, Feld im Fokus (' + JSON.stringify(p0) + ')');
  await s.type('#vm-plz', '05999'); await s.waitForFunction(() => !vm().laedt, null, { timeout: 8000 }).catch(() => null); await s.waitForTimeout(250);
  const p1 = await s.evaluate(() => ({ bad: !!document.querySelector('.vm-plzfeld.ist-bad'), f: (document.getElementById('vm-plz-f') || {}).textContent || '', liste: document.querySelectorAll('.vm-betrieb').length }));
  ok(p1.bad && /kennen wir nicht/.test(p1.f) && p1.liste === 0, '31.A3 Unbekannte Postleitzahl (05999): Hinweis am Feld, keine Liste (' + p1.f + ')');
  /* die 400 des Servers für die unbekannte PLZ ist gewollt, kein Fehler der Seite */
  s.probleme = s.probleme.filter((p) => !/\/api\/vermittlung\/suche/.test(p) && !/status of 400/.test(p));
  await s.fill('#vm-plz', ''); const t0 = Date.now(); await s.type('#vm-plz', '33442');
  await s.waitForSelector('.vm-betrieb', { timeout: 15000 }).catch(() => null); const dauer = Date.now() - t0;
  const l = await s.evaluate(() => ({ n: document.querySelectorAll('.vm-betrieb').length, felder: Array.from(new Set((S.verm.liste || []).flatMap((x) => Object.keys(x)))).sort(), punkte: document.querySelectorAll('.vm-umkreis circle.vm-pkt').length, ort: S.proj.ort, quelle: (document.querySelector('.vm-quelle') || {}).textContent || '', geo: !!document.querySelector('.vm-quelle a[href="https://www.geonames.org/"]') }));
  ok(l.n >= 3 && l.punkte === l.n && l.ort === '33442 Herzebrock-Clarholz' && /rund um 33442 Herzebrock-Clarholz/.test(l.quelle) && l.geo, '31.A3 Mit der fünften Ziffer die Liste (' + l.n + ' Betriebe in ' + dauer + ' ms), als Punkte im Umkreis, Ort vom Server, Quelle GeoNames genannt');
  ok(!l.felder.some((k) => /tel|web|strasse|mail|plz/i.test(k)), '31.A3 In der App nur öffentliche Felder: ' + l.felder.join(', '));
  await klick(s, '.scr .lg-weiter');
  const f2 = await s.evaluate(() => ({ sc: S.screen, grund: (document.querySelector('.vm-grund') || {}).textContent || '', bad: !!document.querySelector('.vm-liste.ist-bad') }));
  ok(f2.sc === 'betriebe' && /mindestens zwei Betriebe/.test(f2.grund) && f2.bad, '31.A3 Ohne Wahl kein Weiter, Grund über der Pille (' + f2.grund + ')');
  const ids = await s.evaluate(() => S.verm.liste.map((x) => x.id));
  await klick(s, '.vm-betrieb[data-v="' + ids[0] + '"]'); await klick(s, '.scr .lg-weiter');
  const f2b = await s.evaluate(() => (document.querySelector('.vm-grund') || {}).textContent || '');
  ok(/noch mindestens einen Betrieb/.test(f2b), '31.A3 Mit einem Betrieb kein Weiter: „noch mindestens einen Betrieb“ (' + f2b + ')');
  for (const id of ids.slice(1, 5)) await klick(s, '.vm-betrieb[data-v="' + id + '"]');
  /* der sechste ist gesperrt (aria-disabled): Playwright klickt ihn nicht, also das Klick-Ereignis direkt; die Sperre selbst wird geprüft */
  ok(ids.length >= 6, '31.A3 Die Attrappe liefert mehr als fünf Betriebe (' + ids.length + ')');
  await s.$eval('.vm-betrieb[data-v="' + ids[5] + '"]', (e) => e.click()); await s.waitForTimeout(250);
  const w = await s.evaluate(() => ({ wahl: S.verm.wahl.length, aus: document.querySelectorAll('.vm-betrieb[aria-disabled="true"]').length, nr: Array.from(document.querySelectorAll('.vm-betrieb[aria-pressed="true"] .vm-mark')).map((e) => e.textContent).join(','), gewaehlt: document.querySelectorAll('.vm-umkreis .vm-pkt.ist-gewaehlt').length, zahl: (document.querySelector('.vm-zahl') || {}).textContent || '' }));
  ok(w.wahl === 5 && w.nr === '1,2,3,4,5' && w.aus === ids.length - 5 && w.gewaehlt === 5 && /5 von höchstens 5/.test(w.zahl), '31.A3 Höchstens fünf, nummeriert, im Umkreis markiert, die übrigen gesperrt (' + JSON.stringify(w) + ')');
  await klick(s, '.vm-selbst');
  ok(await s.evaluate(() => S.verm.suchen && !S.verm.wahl.length), '31.A3 „Sucht ihr passende für mich aus“ ersetzt die Wahl');
  await klick(s, '.vm-selbst');
  for (const id of ids.slice(0, 3)) await klick(s, '.vm-betrieb[data-v="' + id + '"]');
  ok(await pillen(s) === 1, '31.A3 Betriebe: genau eine volle Pille');
  const z3 = await ziele(s); ok(!z3.length, '31.A3 Betriebe: Ziele ab 44 px' + (z3.length ? ' ' + JSON.stringify(z3) : ''));
  ok(!(await quer(s)), '31.A3 Betriebe: kein Querscrollen');
  await klick(s, '.scr .lg-weiter');
  /* Kontakt danach: Name und Telefon Pflicht, der Ort kommt aus der Postleitzahl */
  const k0 = await s.evaluate(() => ({ sc: S.screen, t: (document.querySelector('.lg-frage h1') || {}).textContent || '', ort: !!document.getElementById('t-ort'), chip: (document.querySelector('.ab-chip') || {}).textContent || '' }));
  ok(k0.sc === 'anfrage3' && /die Betriebe/.test(k0.t) && !k0.ort && /5\svon\s5/.test(k0.chip), '31.A2 Nach den Betrieben der Kontakt „Wie erreichen dich die Betriebe?“, ohne Feld „PLZ und Ort“, Schritt 5 von 5 (' + JSON.stringify(k0) + ')');
  ok(await s.evaluate(() => /echter Mensch anfragt/.test(document.querySelector('.scr').textContent) && /ernsthafte Rückmeldungen/.test(document.querySelector('.scr').textContent)), '31.A2 Telefonbestätigung positiv begründet (echter Mensch, ernsthafte Rückmeldungen)');
  await klick(s, '.scr .lg-weiter');
  const f1 = await s.evaluate(() => ({ sc: S.screen, tel: document.getElementById('t-tel').getAttribute('aria-invalid'), grund: !!document.querySelector('.vm-grund'), fokus: document.activeElement && document.activeElement.id }));
  ok(f1.sc === 'anfrage3' && f1.tel === 'true' && f1.grund && f1.fokus === 't-tel', '31.A2 Ohne Telefon kein Weiter: Feld markiert und im Fokus, Grund über der Pille (' + JSON.stringify(f1) + ')');
  await s.fill('#t-tel', '0123456789'); await klick(s, '.scr .lg-weiter');
  ok(await s.evaluate(() => document.getElementById('t-tel').getAttribute('aria-invalid') === 'true' && S.screen === 'anfrage3'), '31.A2 Unsinnige Nummer (0123456789) wird abgelehnt');
  await s.fill('#t-tel', '0171 2345678'); await klick(s, '.scr .lg-weiter');
  const f3 = await s.evaluate(() => ({ sc: S.screen, einw: !!document.querySelector('.vm-einw.ist-bad'), text: document.querySelector('.vm-einw').textContent }));
  ok(f3.sc === 'anfrage3' && f3.einw, '31.A2 Ohne Einwilligung kein Abschicken');
  const namen = await s.evaluate((x) => x.map((id) => S.verm.liste.find((b) => b.id === id).name), ids.slice(0, 3));
  ok(namen.every((n) => f3.text.includes(n)) && /Sonst bekommt niemand meine Daten/.test(f3.text) && /jederzeit widerrufen/.test(f3.text) && /E-Mail-Adresse/.test(f3.text) && !/nach zwei Tagen|fragt .* nach, ob/.test(f3.text), '31.A2 Einwilligung aktiv, nennt die gewählten Betriebe (' + namen.join(', ') + '), „sonst niemand“, widerrufbar, ohne Rückfrage nach zwei Tagen');
  ok(await pillen(s) === 1, '31.A2 Kontakt: genau eine volle Pille');
  const z2 = await ziele(s); ok(!z2.length, '31.A2 Kontakt: Ziele ab 44 px' + (z2.length ? ' ' + JSON.stringify(z2) : ''));
  await klick(s, '.scr .lg-zurueck');
  ok(await s.evaluate(() => S.screen === 'betriebe' && S.verm.wahl.length === 3 && document.querySelectorAll('.vm-betrieb[aria-pressed="true"]').length === 3), '31.A3 Zurück vom Kontakt zu den Betrieben, die Wahl bleibt');
  await klick(s, '.scr .lg-weiter');
  await klick(s, '.vm-einw');
  await klick(s, '.scr .lg-weiter'); await s.waitForTimeout(400);
  const c = await s.evaluate(() => ({ sc: S.screen, kanal: S.verm.kanal, an: S.verm.an, test: /123456/.test(document.querySelector('.scr').textContent) }));
  ok(c.sc === 'vcode' && c.kanal === 'sms' && /••• 5678$/.test(c.an) && c.test, '31.A4 Code per SMS an die maskierte Nummer, Hinweis auf den Testbetrieb (' + JSON.stringify(c) + ')');
  /* Mails über ihre Kennung finden, nicht über die Position: die Mail-Attrappe behält nur die letzten 50 (functions/api/post.js) */
  const vorher = new Set((await h.post()).map((m) => m.id));
  await s.fill('#vm-code', '000000'); await s.waitForTimeout(1500);
  const c2 = await s.evaluate(() => ({ sc: S.screen, fehler: (document.querySelector('.vm-feldfehler') || {}).textContent || '', gesendet: !!(S.verm && S.verm.gesendet) }));
  ok(c2.sc === 'vcode' && c2.fehler && !c2.gesendet, '31.A4 Falscher Code: bleibt auf der Folie mit Fehler am Feld (' + c2.fehler + ')');
  /* der falsche Code ist gewollt: der Server antwortet 401 (feld code); diese eine Antwort ist kein Fehler der Seite */
  s.probleme = s.probleme.filter((p) => !/\/api\/vermittlung\/senden/.test(p) && !/status of 401/.test(p));
  await s.fill('#vm-code', '123456');
  await s.waitForFunction(() => S.screen === 'angefragt', null, { timeout: 20000 }).catch(() => null);
  const g = await s.evaluate(() => ({ sc: S.screen, nr: S.verm.gesendet && S.verm.gesendet.nr, text: document.querySelector('.scr').textContent, frei: FREI(), k: Object.assign({}, S.kauf || {}), pille: (document.querySelector('.scr .lg-weiter') || {}).textContent || '' }));
  ok(g.sc === 'angefragt' && /^V-\d{4}-\d{4}$/.test(g.nr || '') && g.text.includes(namen[0]) && /Wir fragen/.test(g.text), '31.A4 Angefragt mit Nummer ' + g.nr + ', nennt die Betriebe, sagt „Wir fragen an“');
  ok(g.frei && g.k.paid && g.k.frei === 'vermittlung' && g.k.session === 'vermittlung:' + g.nr && !!g.k.token && /Aufmaßblatt laden/.test(g.pille), '31.A4 Gratis-Weg: das Aufmaßblatt ist freigeschaltet (Nachweis vom Server), die Pille lädt es');
  ok(!/gesendet an|ist bei (?!uns)/i.test(g.text.replace(/Anfrage .{0,40} ist bei uns/, '')), '31.A4 Kein „gesendet an Betrieb“ in der Bestätigung');
  await s.waitForTimeout(400);
  const post = (await h.post({ anhaenge: true })).filter((m) => !vorher.has(m.id));
  /* Format der Mail-Attrappe: anhaenge [{ name, typ, bytes, cid }] und anhangDaten [Base64] in derselben Reihenfolge */
  const anInhaber = post.find((m) => (m.anhaenge || []).length && /Vermittlung/.test(String(m.betreff || '')) && String(m.betreff || '').includes(g.nr || '-'));
  const iPdf = anInhaber ? (anInhaber.anhaenge || []).findIndex((x) => x.typ === 'application/pdf' && /\.pdf$/.test(x.name || '')) : -1;
  const pdf = iPdf >= 0 ? (anInhaber.anhangDaten || [])[iPdf] : '';
  ok(!!anInhaber, '31.A4 Mail an den Inhaber zur Anfrage ist raus');
  ok(!!pdf && Buffer.from(String(pdf), 'base64').slice(0, 4).toString() === '%PDF', '31.A4 Das Aufmaßblatt aus der App hängt als PDF an');
  ok(post.some((m) => m.an === 'pruefer@beispiel.de' && (m.anhaenge || []).some((x) => x.typ === 'application/pdf')), '31.A4 Der Kunde bekommt die Bestätigung mit seinem Aufmaßblatt (Gratis-Weg)');
  await klick(s, '.vm-fuss-zwei .dna-pille--leise');
  ok(await screen(s) === 'home', '31.A4 „Fertig“ führt zur Liste');
  await s.evaluate(() => go('weg')); await s.waitForTimeout(200);
  ok(await s.evaluate(() => /Angefragt/.test(document.querySelector('.vm-karte[data-v="A"]').textContent) && /ist bei uns/.test(document.querySelector('.scr').textContent)), '31.A4 Weiche zeigt danach „Angefragt“');
  await s.reload({ waitUntil: 'networkidle' }); await s.waitForTimeout(500);
  ok(await s.evaluate(() => !!(S.verm && S.verm.gesendet && S.verm.gesendet.nr) && !S.verm.code && !S.verm.token), '31.A4 Nach dem Neuladen: Anfrage gemerkt, kein Code und kein Token auf dem Gerät');
  h.sauber(s, '31.A Telefon: Ablauf ohne Fehler');
  await ctx.close();

  /* ---------- Beim Bezahlen noch einmal der Gratis-Weg; Wahl von der Startseite ---------- */
  const ctxG = await telefon(), gz = await h.neueSeite(ctxG, h.base());
  await gz.goto(h.base() + '/app/?weg=blatt&farbe=9016#ausmessen', { waitUntil: 'networkidle' }); await gz.waitForTimeout(800);
  const dl = await gz.evaluate(() => ({ weg: S.verm && S.verm.weg, fa: S.win && S.win.fa, offen: !!(S.win && S.win.offen && S.win.offen.fa), url: location.search }));
  ok(dl.weg === 'B' && dl.fa === '9016' && !dl.offen && !/weg=|farbe=/.test(dl.url), '31.A7 Wahl von der Startseite: ?weg=blatt legt den Weg fest, ?farbe=9016 die Rahmenfarbe außen des ersten Fensters (gewählt, nicht offen); die Angaben verschwinden aus der Adresse (' + JSON.stringify(dl) + ')');
  await vorbereiten(gz); await gz.evaluate(() => { vm().weg = 'B'; go('teilen'); }); await gz.waitForTimeout(300);
  const tz = await gz.evaluate(() => { const h = document.querySelector('.vm-gratis-hinweis'); return { karte: !!h, text: (h || {}).textContent || '', oben: !!(h && h === document.querySelector('.ab-inhalt').firstElementChild), puls: !!(h && h.classList.contains('ist-puls')), titel: h ? getComputedStyle(h.querySelector('.vm-gratis-titel')).textTransform : '', weiss: h ? [...h.querySelectorAll('p')].map((p) => getComputedStyle(p).color) : [] }; });
  ok(tz.karte && tz.oben && tz.puls && tz.titel === 'uppercase' && tz.weiss.length === 2 && tz.weiss.every((c) => c === 'rgb(255, 255, 255)') && /^EmpfohlenKostenlos/.test(tz.text) && /an mindestens zwei Betriebe deiner Wahl zu schicken, erhältst du es kostenlos statt für 7,99 €/.test(tz.text) && !/on top|Sonstige/.test(tz.text) && /Keine versteckten Kosten/.test(tz.text) && /Garantiert\./.test(tz.text) && /Kostenlos weiter/.test(tz.text), '31.A7 Folie zum Bezahlen: der Gratis-Weg ganz oben („Empfohlen“, „KOSTENLOS“, Text des Inhabers, beide Absätze weiß), pulsiert beim ersten Zeigen (' + JSON.stringify(Object.assign({}, tz, { text: tz.text.slice(0, 40) })) + ')');
  ok(await pillen(gz) === 1, '31.A7 Folie zum Bezahlen: weiter genau eine volle Pille');
  await klick(gz, '.vm-gratis-hinweis .dna-pille');
  ok(await gz.evaluate(() => S.screen === 'betriebe' && S.verm.weg === 'A' && /Nähe/.test(document.querySelector('.lg-frage h1').textContent)), '31.A7 „Kostenlos weiter“ wechselt auf den Gratis-Weg (zuerst die Betriebe)');
  await gz.evaluate(() => { const k = kauf(); k.mail = 'pruefer@beispiel.de'; go('kasse'); }); await gz.waitForTimeout(200);
  ok(await gz.evaluate(() => !!document.querySelector('.vm-gratis-hinweis')), '31.A7 Auch die Kasse zeigt den Gratis-Weg');
  h.sauber(gz, '31.A7 ohne Fehler');
  await ctxG.close();

  /* ---------- Schreibtisch ---------- */
  const ctxD = await kontext({ viewport: { width: 1280, height: 800 } }), d = await h.neueSeite(ctxD, h.base());
  await d.goto(h.base() + '/app/', { waitUntil: 'networkidle' }); await d.waitForTimeout(400);
  await vorbereiten(d);
  for (const sc of ['weg', 'betriebe', 'anfrage3']) {
    await d.evaluate((x) => { S.proj.tel = '0171 2345678'; go(x); }, sc); await d.waitForTimeout(sc === 'betriebe' ? 1500 : 300);
    const r = await d.evaluate(() => { const b = document.querySelector('.dna-links .ab-buehne'), r = b && b.getBoundingClientRect(); return { links: !!b && r.width > 400, rechts: !!document.querySelector('.dna-rechts .lg-frage') }; });
    ok(r.links && r.rechts, '31.A5 Schreibtisch ' + sc + ': Bühne links, Spalte rechts');
    ok(await pillen(d) === 1 && !(await quer(d)), '31.A5 Schreibtisch ' + sc + ': eine Pille, kein Querscrollen');
  }
  /* Angefragt: „Fertig“ und „Aufmaßblatt laden“ nebeneinander, der Pfeil bleibt in seiner Pille (am Schreibtisch teilten sich beide die Spalte) */
  await d.evaluate(() => { const z = vm(); z.gesendet = { nr: 'V-2026-0099', when: Date.now(), namen: [], wahl: [], suchen: true, plz: '33442' }; const k = kauf(); k.paid = true; k.token = k.token || 'pruef'; k.frei = 'vermittlung'; go('angefragt'); }); await d.waitForTimeout(300);
  const fz = await d.evaluate(() => Array.from(document.querySelectorAll('.vm-fuss-zwei > .dna-pille')).map((e) => ({ w: e.clientWidth, sw: e.scrollWidth })));
  ok(fz.length === 2 && fz.every((x) => x.sw <= x.w + 1), '31.A5 Schreibtisch angefragt: beide Pillen nebeneinander, nichts ragt heraus (' + JSON.stringify(fz) + ')');
  h.sauber(d, '31.A5 Schreibtisch ohne Fehler');
  await ctxD.close();

  /* ---------- Ohne Vermittlung (Pilot der übrigen Suite, ohne Daten): bisheriger Weg ---------- */
  const ctxP = await telefon(), p = await h.neueSeite(ctxP, h.BASE);
  await p.goto(h.BASE + '/app/', { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await p.evaluate((x) => { S.windows = demoProject(); S.proj = Object.assign({}, PROJ0, x); go('anfrage2'); }, PROJ); await p.waitForTimeout(200);
  await klick(p, '.scr .lg-weiter');
  ok(await screen(p) === 'anfrage3' && await p.evaluate(() => /3\svon\s3/.test(document.querySelector('.ab-chip').textContent)), '31.A6 Ohne Vermittlung: Zeit → Kontakt (3 von 3) wie bisher');
  h.sauber(p, '31.A6 Pilot ohne Fehler');
  await ctxP.close();
}

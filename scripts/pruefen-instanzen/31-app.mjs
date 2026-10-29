// eeziframes · Prüfabschnitt 31, Teil App: Vermittlung „Angebote aus deiner Nähe“ (docs/VERMITTLUNG.md, Abschnitt 10) im Browser
//   31.A1 Weiche nach „Zeit und Budget“: zwei Wege, Weg A vorgewählt, eine volle Pille, Ziele ab 44 px, kein Querscrollen; Weg B führt
//         wie bisher über den Kontakt zum Freischalten · 31.A2 Kontakt auf Weg A: Name, PLZ und Ort, Telefon Pflicht, Fehler am Feld
//   · 31.A3 Betriebe: Suche zur PLZ (Attrappe), nur öffentliche Felder in der App, höchstens drei, „Sucht ihr für mich aus“, ohne Wahl
//         und ohne Einwilligung kein Abschicken · 31.A4 Code: falscher Code bleibt auf der Folie, richtiger schickt ab, Angefragt mit
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
  const weg = await s.evaluate(() => ({ kacheln: document.querySelectorAll('.vm-kachel').length, a: document.querySelector('.vm-kachel[data-v="A"]').getAttribute('aria-pressed'), umkreis: !!document.querySelector('.vm-buehne .vm-umkreis'), chip: (document.querySelector('.ab-chip') || {}).textContent || '' }));
  ok(weg.kacheln === 2 && weg.a === 'true' && weg.umkreis && /3\svon\s5/.test(weg.chip), '31.A1 Weiche: zwei Wege, „Angebote aus deiner Nähe“ vorgewählt, Umkreis auf der Bühne, Schritt 3 von 5 (' + JSON.stringify(weg) + ')');
  ok(await pillen(s) === 1, '31.A1 Weiche: genau eine volle Pille');
  const z1 = await ziele(s); ok(!z1.length, '31.A1 Weiche: Ziele ab 44 px' + (z1.length ? ' ' + JSON.stringify(z1) : ''));
  ok(!(await quer(s)), '31.A1 Weiche: kein Querscrollen');
  /* Weg B: Blatt auf der Bühne, Kontakt freiwillig, dann Freischalten wie bisher */
  await klick(s, '.vm-kachel[data-v="B"]');
  const b = await s.evaluate(() => ({ blatt: !!document.querySelector('.ab-papier'), pille: (document.querySelector('.scr .lg-weiter') || {}).textContent || '', chip: (document.querySelector('.ab-chip') || {}).textContent || '' }));
  ok(b.blatt && /Aufmaßblatt/.test(b.pille) && /3\svon\s4/.test(b.chip), '31.A1 Weg B: Blatt auf der Bühne, „Weiter zum Aufmaßblatt“, Schritt 3 von 4');
  await klick(s, '.scr .lg-weiter');
  const bk = await s.evaluate(() => ({ sc: S.screen, t: (document.querySelector('.lg-frage h1') || {}).textContent || '', pille: (document.querySelector('.scr .lg-weiter') || {}).textContent || '' }));
  ok(bk.sc === 'anfrage3' && /dein Fensterbauer/.test(bk.t) && /Zum Aufmaßblatt/.test(bk.pille), '31.A1 Weg B: Kontakt wie bisher, weiter zum Aufmaßblatt');
  await klick(s, '.scr .lg-zurueck');
  ok(await screen(s) === 'weg', '31.A1 Zurück vom Kontakt führt zur Weiche');
  /* Weg A: Kontakt mit Pflicht */
  await klick(s, '.vm-kachel[data-v="A"]');
  await klick(s, '.scr .lg-weiter');
  ok(await screen(s) === 'anfrage3' && /die Betriebe/.test(await s.evaluate(() => document.querySelector('.lg-frage h1').textContent)), '31.A2 Weg A: Kontakt „Wie erreichen dich die Betriebe?“');
  await klick(s, '.scr .lg-weiter');
  const f1 = await s.evaluate(() => ({ sc: S.screen, tel: document.getElementById('t-tel').getAttribute('aria-invalid'), grund: !!document.querySelector('.vm-grund'), fokus: document.activeElement && document.activeElement.id }));
  ok(f1.sc === 'anfrage3' && f1.tel === 'true' && f1.grund && f1.fokus === 't-tel', '31.A2 Ohne Telefon kein Weiter: Feld markiert und im Fokus, Grund über der Pille (' + JSON.stringify(f1) + ')');
  await s.fill('#t-tel', '0123456789'); await klick(s, '.scr .lg-weiter');
  ok(await s.evaluate(() => document.getElementById('t-tel').getAttribute('aria-invalid') === 'true' && S.screen === 'anfrage3'), '31.A2 Unsinnige Nummer (0123456789) wird abgelehnt');
  await s.fill('#t-tel', '0171 2345678'); await klick(s, '.scr .lg-weiter');
  ok(await screen(s) === 'betriebe', '31.A2 Mit Name, PLZ und Telefon weiter zu den Betrieben');
  /* Betriebe */
  await s.waitForSelector('.vm-betrieb', { timeout: 15000 }).catch(() => null);
  const l = await s.evaluate(() => ({ n: document.querySelectorAll('.vm-betrieb').length, felder: Array.from(new Set((S.verm.liste || []).flatMap((x) => Object.keys(x)))).sort(), punkte: document.querySelectorAll('.vm-umkreis circle.vm-pkt').length }));
  ok(l.n >= 3 && l.punkte === l.n, '31.A3 Suche zur PLZ: Betriebe in der Liste und als Punkte im Umkreis (' + l.n + ')');
  ok(!l.felder.some((k) => /tel|web|strasse|mail/i.test(k)), '31.A3 In der App nur öffentliche Felder: ' + l.felder.join(', '));
  await klick(s, '.scr .lg-weiter');
  const f2 = await s.evaluate(() => ({ sc: S.screen, grund: (document.querySelector('.vm-grund') || {}).textContent || '', bad: !!document.querySelector('.vm-liste.ist-bad') }));
  ok(f2.sc === 'betriebe' && /mindestens einen Betrieb/.test(f2.grund) && f2.bad, '31.A3 Ohne Wahl kein Abschicken, Grund über der Pille');
  const ids = await s.evaluate(() => S.verm.liste.map((x) => x.id));
  for (const id of ids.slice(0, 3)) await klick(s, '.vm-betrieb[data-v="' + id + '"]');
  /* der vierte ist gesperrt (aria-disabled): Playwright klickt ihn nicht, also das Klick-Ereignis direkt; die Sperre selbst wird geprüft */
  await s.$eval('.vm-betrieb[data-v="' + ids[3] + '"]', (e) => e.click()); await s.waitForTimeout(250);
  const w = await s.evaluate(() => ({ wahl: S.verm.wahl.length, aus: document.querySelectorAll('.vm-betrieb[aria-disabled="true"]').length, nr: Array.from(document.querySelectorAll('.vm-betrieb[aria-pressed="true"] .vm-mark')).map((e) => e.textContent).join(','), etiketten: document.querySelectorAll('.vm-etikett').length }));
  ok(w.wahl === 3 && w.nr === '1,2,3' && w.aus === ids.length - 3 && w.etiketten === 3, '31.A3 Höchstens drei, nummeriert, mit Etikett im Umkreis, die übrigen gesperrt (' + JSON.stringify(w) + ')');
  await klick(s, '.vm-selbst');
  ok(await s.evaluate(() => S.verm.suchen && !S.verm.wahl.length), '31.A3 „Sucht ihr für mich aus“ ersetzt die Wahl');
  await klick(s, '.vm-selbst');
  await klick(s, '.vm-betrieb[data-v="' + ids[0] + '"]'); await klick(s, '.vm-betrieb[data-v="' + ids[1] + '"]');
  await klick(s, '.scr .lg-weiter');
  const f3 = await s.evaluate(() => ({ sc: S.screen, einw: !!document.querySelector('.vm-einw.ist-bad'), text: document.querySelector('.vm-einw').textContent }));
  ok(f3.sc === 'betriebe' && f3.einw, '31.A3 Ohne Einwilligung kein Abschicken');
  const namen = await s.evaluate((x) => x.map((id) => S.verm.liste.find((b) => b.id === id).name), ids.slice(0, 2));
  ok(namen.every((n) => f3.text.includes(n)), '31.A3 Einwilligung nennt die gewählten Betriebe: ' + namen.join(', '));
  ok(await pillen(s) === 1, '31.A3 Betriebe: genau eine volle Pille');
  const z3 = await ziele(s); ok(!z3.length, '31.A3 Betriebe: Ziele ab 44 px' + (z3.length ? ' ' + JSON.stringify(z3) : ''));
  ok(!(await quer(s)), '31.A3 Betriebe: kein Querscrollen');
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
  const g = await s.evaluate(() => ({ sc: S.screen, nr: S.verm.gesendet && S.verm.gesendet.nr, text: document.querySelector('.scr').textContent }));
  ok(g.sc === 'angefragt' && /^V-\d{4}-\d{4}$/.test(g.nr || '') && g.text.includes(namen[0]) && /Wir fragen/.test(g.text), '31.A4 Angefragt mit Nummer ' + g.nr + ', nennt die Betriebe, sagt „Wir fragen an“');
  ok(!/gesendet an|ist bei (?!uns)/i.test(g.text.replace(/Anfrage .{0,40} ist bei uns/, '')), '31.A4 Kein „gesendet an Betrieb“ in der Bestätigung');
  await s.waitForTimeout(400);
  const post = (await h.post({ anhaenge: true })).filter((m) => !vorher.has(m.id));
  /* Format der Mail-Attrappe: anhaenge [{ name, typ, bytes, cid }] und anhangDaten [Base64] in derselben Reihenfolge */
  const anInhaber = post.find((m) => (m.anhaenge || []).length && /Vermittlung/.test(String(m.betreff || '')) && String(m.betreff || '').includes(g.nr || '-'));
  const iPdf = anInhaber ? (anInhaber.anhaenge || []).findIndex((x) => x.typ === 'application/pdf' && /\.pdf$/.test(x.name || '')) : -1;
  const pdf = iPdf >= 0 ? (anInhaber.anhangDaten || [])[iPdf] : '';
  ok(!!anInhaber, '31.A4 Mail an den Inhaber zur Anfrage ist raus');
  ok(!!pdf && Buffer.from(String(pdf), 'base64').slice(0, 4).toString() === '%PDF', '31.A4 Das Aufmaßblatt aus der App hängt als PDF an');
  ok(post.some((m) => m.an === 'pruefer@beispiel.de') && !post.some((m) => String(m.an || '').includes('pruefer@beispiel.de') && (m.anhaenge || []).length), '31.A4 Der Kunde bekommt eine Bestätigung, aber kein Aufmaßblatt (Weg A)');
  await klick(s, '.scr .lg-weiter');
  ok(await screen(s) === 'home', '31.A4 „Fertig“ führt zur Liste');
  await s.evaluate(() => go('weg')); await s.waitForTimeout(200);
  ok(await s.evaluate(() => /Angefragt am/.test(document.querySelector('.vm-kachel[data-v="A"]').textContent)), '31.A4 Weiche zeigt danach „Angefragt am …“');
  await s.reload({ waitUntil: 'networkidle' }); await s.waitForTimeout(500);
  ok(await s.evaluate(() => !!(S.verm && S.verm.gesendet && S.verm.gesendet.nr) && !S.verm.code && !S.verm.token), '31.A4 Nach dem Neuladen: Anfrage gemerkt, kein Code und kein Token auf dem Gerät');
  h.sauber(s, '31.A Telefon: Ablauf ohne Fehler');
  await ctx.close();

  /* ---------- Schreibtisch ---------- */
  const ctxD = await kontext({ viewport: { width: 1280, height: 800 } }), d = await h.neueSeite(ctxD, h.base());
  await d.goto(h.base() + '/app/', { waitUntil: 'networkidle' }); await d.waitForTimeout(400);
  await vorbereiten(d);
  for (const sc of ['weg', 'betriebe']) {
    await d.evaluate((x) => { S.proj.tel = '0171 2345678'; go(x); }, sc); await d.waitForTimeout(sc === 'betriebe' ? 1500 : 300);
    const r = await d.evaluate(() => { const b = document.querySelector('.dna-links .ab-buehne'), r = b && b.getBoundingClientRect(); return { links: !!b && r.width > 400, rechts: !!document.querySelector('.dna-rechts .lg-frage') }; });
    ok(r.links && r.rechts, '31.A5 Schreibtisch ' + sc + ': Bühne links, Spalte rechts');
    ok(await pillen(d) === 1 && !(await quer(d)), '31.A5 Schreibtisch ' + sc + ': eine Pille, kein Querscrollen');
  }
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

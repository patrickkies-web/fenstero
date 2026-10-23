// eeziframes · Prüfabschnitt 29: Verkaufsseite, Rechtstexte, Doku (Strang F, Bauplan §3 F; docs/INSTANZEN.md)
// 29.1 Preise der Pakete in HTML und JSON-LD wie pakete.js, ohne JavaScript, „nur für Unternehmer“, keine alten Tarife ·
// 29.2 Bestellknöpfe (mit PAKETE_OFFEN) auf /partner/#bestellen/<paket>, Frageformular mit und ohne JavaScript, Honigtopf, Bremse, Mail an
// MAIL_KONTAKT · 29.3 Kopf der Verkaufsseite (h1, Titel, Beschreibung, Canonical; Abschnitt 10 prüft alle Seiten) · 29.4 Paketbedingungen
// mit Stand, Platzhaltern und beiden PDFs · 29.5 Impressum und Datenschutz je Paket · 29.6 Datenschutz und Cookies auf eeziframes.com ·
// 29.7 llms.txt · 29.8 Doku-Links. Dazu Bildschirmfotos der Verkaufsseite (Telefon und Schreibtisch, mit BILDER=…).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const titel = 'Verkaufsseite, Rechtstexte, Doku (Konfigurator-Pakete)';
const NB = ' ';
const ldjson = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch (e) { return null; } });
const formular = (o) => Object.entries(o).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');

export default async (h) => {
  const { ok } = h, WZ = h.WURZEL;
  const imp = (rel) => import(pathToFileURL(path.join(WZ, rel)).href);
  await imp('web/assets/pakete.js'); await imp('web/assets/instanzregeln.js');
  const Pk = globalThis.Pakete, RI = globalThis.Instanzregeln, F = RI.FRISTEN;
  const recht = await imp('functions/api/recht.js'), rechtI = await imp('functions/instanz/recht.js'), bpdf = await imp('scripts/bedingungen-pdf.mjs');
  const eur = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + NB + '€';
  const lies = (rel) => fs.readFileSync(path.join(WZ, rel), 'utf8');

  /* ---------- 29.1 Preise ---------- */
  const vk = await h.api('localhost', '/fuer-fensterbauer/');
  const fb = vk.text, roh = lies('web/fuer-fensterbauer/index.html');
  const karten = [...fb.matchAll(/<article class="vk-paket[^"]*" id="paket-([a-z]+)"[\s\S]*?<\/article>/g)].map((m) => ({ p: m[1], html: m[0] }));
  const karteOk = (k) => { const pr = Pk.preis(k.p); return k.html.includes('<b>' + eur(pr.monat) + '</b> im Monat') && k.html.includes(eur(pr.einrichtung) + ' Einrichtung') && /nur für Unternehmer/.test(k.html) && /zzgl\. MwSt\./.test(k.html) && k.html.includes(Pk.PAKETE[k.p].name); };
  ok(vk.status === 200 && karten.length === Pk.LISTE.length && karten.map((k) => k.p).join() === Pk.LISTE.join() && karten.every(karteOk), '29.1 Verkaufsseite: drei Paketkarten mit Monats- und Einrichtungspreis aus pakete.js (' + Pk.LISTE.map((p) => Pk.preis(p).monat + '/' + Pk.preis(p).einrichtung).join(', ') + ' €), „zzgl. MwSt.“ und „nur für Unternehmer“ bei jedem Preis');
  const vgl = (/<table class="rg-tab vk-vergleich">[\s\S]*?<\/table>/.exec(fb) || [''])[0];
  const titelVgl = Object.keys(Pk.MERKMALE).filter((s) => Pk.MERKMALE[s].vergleich && s !== 'preis').map((s) => Pk.MERKMALE[s].titel);
  ok(Pk.LISTE.every((p) => vgl.includes(eur(Pk.preis(p).monat)) && vgl.includes(eur(Pk.preis(p).einrichtung))) && titelVgl.every((t) => vgl.includes('<td>' + t + '</td>')) && /Alle Preise netto zzgl\. MwSt\., nur für Unternehmer\./.test(fb), '29.1 Vergleich: alle Merkmale mit „vergleich“ aus pakete.js (' + titelVgl.length + '), Preise je Paket, Hinweis netto und nur für Unternehmer');
  const ld = ldjson(fb).find((x) => x && x['@type'] === 'SoftwareApplication' && Array.isArray(x.offers));
  const ldOk = !!ld && ld.offers.length === 3 && Pk.LISTE.every((p, i) => {
    const o = ld.offers[i], pr = Pk.preis(p), spez = o.priceSpecification || [];
    return o['@type'] === 'Offer' && o.name === Pk.PAKETE[p].name && o.price === pr.monat.toFixed(2) && o.priceCurrency === 'EUR' && spez.length === 2 && spez.every((x) => x.valueAddedTaxIncluded === false && x.priceCurrency === 'EUR') &&
      spez[0].price === pr.monat.toFixed(2) && spez[0].billingDuration === 'P1M' && spez[1].price === pr.einrichtung.toFixed(2) && /Nur für Unternehmer/.test(o.description);
  });
  ok(ldOk && /^https?:\/\//.test(ld.url) && ld.offers.every((o) => o.availability === 'https://schema.org/PreOrder'), '29.1 JSON-LD: drei Offer mit priceSpecification netto (valueAddedTaxIncluded: false), Monat und Einrichtung wie pakete.js, absolute Adresse, ohne PAKETE_OFFEN „PreOrder“');
  const alt = ['Abo 10', 'Kostenlos starten', '/#fensterbauer', '/#tour', 'je Projekt mit eingegangenem', 'Projekte kostenlos', 'Einführungspreis'].filter((x) => fb.includes(x) || roh.includes(x));
  ok(!alt.length && !/class="einf"/.test(fb), '29.1 Keine alten Tarife des Betriebsbereichs auf /fuer-fensterbauer/ (Projektpreis, Abo 10, Plus, „Kostenlos starten“, Tour, Einführungspreis)' + (alt.length ? ': ' + alt.join(', ') : ''));
  ok(karten.every(karteOk.bind(null)) && [...roh.matchAll(/<article class="vk-paket[^"]*" id="paket-([a-z]+)"[\s\S]*?<\/article>/g)].every((m) => karteOk({ p: m[1], html: m[0] })) && bpdf.pruefen().ok, '29.1 Auch ohne Worker und JavaScript: Die Datei in web/ trägt dieselben Preise (Bausteine von node scripts/bedingungen-pdf.mjs aktuell)' + (bpdf.pruefen().ok ? '' : ': ' + bpdf.pruefen().fehler.join('; ')));

  /* ohne PAKETE_OFFEN: vorläufig, Anfrage statt Bestellung */
  const ohneBestellen = !/href="\/partner\/#bestellen\//.test(fb) && /<b>Vorläufige Preise\.<\/b>/.test(fb) && /Bestellung bald möglich/.test(fb) && Pk.LISTE.every((p) => new RegExp('href="#bestellen" data-paket="' + p + '"').test(fb)) && /<form class="vk-form" method="post" action="\/api\/partner\/frage"/.test(fb);
  ok(ohneBestellen, '29.2 Ohne PAKETE_OFFEN: „Vorläufige Preise“, „Bestellung bald möglich“, jede Karte führt zum Anfrageformular (kein Link in die Kasse)');

  /* ---------- 29.2 mit PAKETE_OFFEN, Frageformular ---------- */
  const s2 = await h.server({ PAKETE_OFFEN: '1', MAIL_KONTAKT: 'inhaber@pruefung29.example' });
  const fb2 = (await s2.api('localhost', '/fuer-fensterbauer/')).text;
  const knoepfe = [...fb2.matchAll(/<a class="btn [a-z]+" href="([^"]+)">([^<]+) bestellen<\/a>/g)];
  const ziele = Pk.LISTE.map((p) => '/partner/#bestellen/' + p);
  const ld2 = ldjson(fb2).find((x) => x && Array.isArray(x.offers));
  ok(knoepfe.length >= 6 && knoepfe.every((k) => ziele.includes(k[1])) && ziele.every((z) => knoepfe.filter((k) => k[1] === z).length >= 2) && !/Bestellung bald möglich/.test(fb2) && /<b>Vorläufige Preise\.<\/b>/.test(fb2) === Pk.VORLAEUFIG && ld2 && ld2.offers.every((o) => o.availability === 'https://schema.org/InStock'),
    '29.2 Mit PAKETE_OFFEN=1: jeder „Bestellen“-Knopf (Karte und Abschnitt „Bestellen“) führt auf /partner/#bestellen/<paket>, kein „bald möglich“, JSON-LD „InStock“' + (Pk.VORLAEUFIG ? ', Preise weiter als vorläufig markiert (Pakete.VORLAEUFIG)' : ''));
  const partnerSeite = await s2.api('localhost', '/partner/');
  ok(partnerSeite.status === 200 && /partner\.js/.test(partnerSeite.text), '29.2 Ziel der Knöpfe: /partner/ liefert das Kundenkonto');

  const vorPost = (await s2.post()).length;
  const ohneJs = await s2.api('localhost', '/api/partner/frage', { body: formular({ name: 'Jens Brandt', firma: 'Brandt <Fenster>', mail: 'jens@brandt.example', tel: '0221 1', paket: 'plus', text: 'Geht auch eine .de-Domain?', fax: '' }), headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': '10.29.1.1' } });
  const mails1 = (await s2.post()).slice(vorPost);
  const fm = mails1.find((m) => /Frage zu den Paketen/.test(m.betreff));
  ok(ohneJs.status === 200 && /text\/html/.test(ohneJs.headers['content-type'] || '') && /Danke, Ihre Frage ist da\./.test(ohneJs.text) && /href="\/fuer-fensterbauer\/"/.test(ohneJs.text) && !!fm && fm.an === 'inhaber@pruefung29.example' && fm.antwortAn === 'jens@brandt.example' && /EEZI Essential Plus/.test(fm.html) && /Brandt &lt;Fenster&gt;/.test(fm.html) && !/Brandt <Fenster>/.test(fm.html),
    '29.2 Frage ohne JavaScript (Formular): Dankesseite mit Weg zurück, Mail an MAIL_KONTAKT mit Antwortadresse des Fragenden, Paket und escapter Firma');
  const falsch = await s2.api('localhost', '/api/partner/frage', { body: formular({ name: 'J', mail: 'kaputt', text: '' }), headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': '10.29.1.2' } });
  const falschJs = await s2.api('localhost', '/api/partner/frage', { body: { name: 'J', mail: 'kaputt', text: '' }, headers: { 'x-forwarded-for': '10.29.1.3' } });
  ok(falsch.status === 400 && /Das hat noch nicht geklappt/.test(falsch.text) && /role="alert"/.test(falsch.text) && falschJs.status === 400 && falschJs.json && falschJs.json.felder && falschJs.json.felder.name && falschJs.json.felder.mail && falschJs.json.felder.text, '29.2 Fehler: ohne JavaScript eine Seite mit den Hinweisen, mit JavaScript die Felder (name, mail, text) als JSON');
  const vorHonig = (await s2.post()).length;
  const honig = await s2.api('localhost', '/api/partner/frage', { body: { name: 'Bot', mail: 'bot@spam.example', text: 'Kaufen Sie jetzt', fax: '0800 1' }, headers: { 'x-forwarded-for': '10.29.1.4' } });
  ok(honig.status === 200 && honig.json && honig.json.ok && (await s2.post()).length === vorHonig, '29.2 Honigtopf: Ein ausgefülltes Feld „fax“ bekommt ein freundliches OK, es geht aber keine Mail raus');
  const stati = [];
  for (let i = 0; i < 7; i++) stati.push((await s2.api('localhost', '/api/partner/frage', { body: { name: 'Viel Frager', mail: 'viel@frager.example', text: 'Frage ' + i }, headers: { 'x-forwarded-for': '10.29.2.9' } })).status);
  const anderer = await s2.api('localhost', '/api/partner/frage', { body: { name: 'Anderer', mail: 'anderer@frager.example', text: 'Andere Frage' }, headers: { 'x-forwarded-for': '10.29.3.9' } });
  ok(stati.slice(0, 5).every((x) => x === 200) && stati.slice(5).every((x) => x === 429) && anderer.status === 200, '29.2 Bremse: je Anschluss 5 Fragen in der Minute, danach 429; ein anderer Anschluss fragt weiter (' + stati.join(' ') + ')');
  const instFrage = await s2.api('essential.localhost', '/api/partner/frage', { body: { name: 'Jens', mail: 'jens@brandt.example', text: 'Hallo' }, headers: { 'x-forwarded-for': '10.29.4.1' } });
  ok(instFrage.status >= 400, '29.2 Das Frageformular gibt es nur auf eeziframes.com, nicht auf einer Instanz (' + instFrage.status + ')');

  /* im Browser: Karte wählt das Paket vor, Fehler am Feld, Dank ersetzt das Formular; Telefon und Schreibtisch ohne Querscrollen */
  for (const [name, opts] of [['Telefon', h.telefon], ['Schreibtisch', { viewport: { width: 1280, height: 900 }, locale: 'de-DE' }]]) {
    const c = await h.browser.newContext(opts), page = await h.neueSeite(c, h.base('localhost'));
    await page.goto(h.base('localhost') + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
    const quer = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    await page.locator('#pakete').scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
    await h.foto(page, 'f-verkauf-pakete-' + (name === 'Telefon' ? 'telefon' : 'desktop'));
    await page.click('#paket-signature a[data-paket="signature"]'); await page.waitForTimeout(300);
    const vor = await page.evaluate(() => document.querySelector('select[name="paket"]').value);
    await page.fill('input[name="name"]', 'J'); await page.click('.vk-form button[type="submit"]'); await page.waitForTimeout(200);
    const fehler = await page.evaluate(() => ({ n: document.querySelectorAll('.vk-form [aria-invalid="true"]').length, text: [...document.querySelectorAll('.vk-fehler')].map((x) => x.textContent).join(' | '), fokus: document.activeElement && document.activeElement.name }));
    await page.fill('input[name="name"]', 'Jens Brandt'); await page.fill('input[name="mail"]', 'jens' + name.length + '@brandt.example'); await page.fill('textarea[name="text"]', 'Wann geht es los?');
    await h.foto(page, 'f-verkauf-frage-' + (name === 'Telefon' ? 'telefon' : 'desktop'));
    await page.click('.vk-form button[type="submit"]'); await page.waitForSelector('.vk-danke', { timeout: 8000 }).catch(() => null);
    const dank = await page.evaluate(() => { const d = document.querySelector('.vk-danke'); return !!d && document.activeElement === d && !document.querySelector('.vk-form input'); });
    const ziele = await page.evaluate(() => [...document.querySelectorAll('.vk-paket .btn, .rg-cta .btn, .vk-form .btn')].filter((a) => a.offsetParent).map((a) => a.getBoundingClientRect()).every((r) => r.height >= 44));
    ok(!quer && vor === 'signature' && fehler.n === 3 && fehler.fokus === 'name' && /Namen/.test(fehler.text) && dank && ziele, '29.2 Im Browser (' + name + '): kein Querscrollen, „Signature anfragen“ wählt das Paket vor, Fehler an drei Feldern mit Fokus, Dank ersetzt das Formular, Knöpfe ab 44 px');
    h.sauber(page, '29.2 Verkaufsseite im Browser (' + name + ') ohne Fehler, CSP-Verstöße und fremde Server');
    await c.close();
  }
  const nojs = await h.browser.newContext(Object.assign({}, h.telefon, { javaScriptEnabled: false })), np = await nojs.newPage();
  await np.goto(h.base('localhost') + '/fuer-fensterbauer/', { waitUntil: 'load' });
  const nojsPreise = await np.evaluate(() => [...document.querySelectorAll('.vk-paket .vk-preis b')].map((b) => b.textContent));
  await np.fill('input[name="name"]', 'Ohne Skript'); await np.fill('input[name="mail"]', 'ohne@skript.example'); await np.fill('textarea[name="text"]', 'Frage ohne JavaScript');
  await Promise.all([np.waitForNavigation({ waitUntil: 'load' }).catch(() => null), np.click('.vk-form button[type="submit"]')]);
  const nojsDank = await np.evaluate(() => /Danke, Ihre Frage ist da/.test(document.body.innerText) && location.pathname === '/api/partner/frage');
  ok(nojsPreise.join() === Pk.LISTE.map((p) => eur(Pk.preis(p).monat)).join() && nojsDank, '29.1/29.2 Ohne JavaScript (Telefon): Preise sichtbar (' + nojsPreise.join(', ') + '), Frage geht als Formular ab und endet auf der Dankesseite');
  await nojs.close();

  /* ---------- 29.3 Kopf der Verkaufsseite ---------- */
  const titelFb = (fb.match(/<title>([^<]*)<\/title>/) || [])[1] || '', beschr = (fb.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok((fb.match(/<h1[\s>]/g) || []).length === 1 && /eeziframes/.test(titelFb) && titelFb.length <= 75 && beschr.length >= 70 && beschr.length <= 170 && /rel="canonical"/.test(vk.headers.link || '') && /<link rel="canonical" href="[^"]+\/fuer-fensterbauer\/">/.test(fb) && /Ihr eigener Fenster-Konfigurator, unter Ihrer <span class="ak">Marke<\/span>/.test(fb),
    '29.3 Verkaufsseite: ein h1 mit einem grünen Wort, Titel mit Marke (' + titelFb.length + ' Zeichen), Beschreibung (' + beschr.length + ' Zeichen), Canonical');
  const abschnitte = ['die-idee', 'so-funktioniert-es', 'pakete', 'ablauf', 'demos', 'bestellen', 'haeufige-fragen'].filter((id) => !new RegExp('<h2 id="' + id + '">').test(fb));
  const leiste = RI.bestellung.LEISTE.map((s) => s.titel), ablauf = (/<!--pakete:ablauf-->([\s\S]*?)<!--\/pakete:ablauf-->/.exec(fb) || [])[1] || '';
  ok(!abschnitte.length && leiste.every((t, i) => ablauf.indexOf('<b>' + t + '</b>') >= 0 && (i === 0 || ablauf.indexOf('<b>' + t + '</b>') > ablauf.indexOf('<b>' + leiste[i - 1] + '</b>'))) && /3 bis 5 Werktage/.test(fb) && /ohne ihn programmieren zu lassen/.test(fb) && /Ihr eigenes Baby/.test(fb),
    '29.3 Inhalt: Idee (ohne Programmierkosten, professioneller Auftritt, eigenes Baby), So funktioniert es, Pakete, Ablauf in den sechs Schritten der Statusleiste (' + leiste.join(' → ') + '), Demos, Bestellen, FAQ' + (abschnitte.length ? '; fehlt: ' + abschnitte.join(', ') : ''));
  const faq = ldjson(fb).find((x) => x && x['@graph']), fragen = faq ? faq['@graph'].find((x) => x['@type'] === 'FAQPage').mainEntity.map((q) => q.name) : [];
  ok(fragen.length >= 6 && fragen.every((q) => fb.includes('<summary>' + q + '</summary>')) && ['Domain', 'kündigen', 'Datenschutz', 'Kunde', 'Website'].every((w) => fragen.some((q) => q.includes(w))), '29.3 FAQ (Domain, Kosten, Kündigung, Datenschutz, was der Kunde sieht, Website) auf der Seite und als FAQPage gleich');

  /* ---------- 29.4 Paketbedingungen und PDFs ---------- */
  const kb = await h.api('localhost', '/konfigurator-bedingungen/');
  const pdfs = recht.paketPdfs(), pdfAntwort = await Promise.all(pdfs.map((p) => h.api('localhost', p)));
  const dateiPdf = pdfs.map((p) => fs.readFileSync(path.join(WZ, 'web', p)));
  const vertr = bpdf.vertraege(kb.text);
  ok(kb.status === 200 && kb.text.includes('<meta name="stand" content="' + recht.PAKET_STAND + '">') && kb.text.includes('Stand: <!--pakete:stand-->' + recht.standText(recht.PAKET_STAND)) && pdfs.every((p) => kb.text.includes('href="' + p + '"')),
    '29.4 /konfigurator-bedingungen/ mit Stand ' + recht.standText(recht.PAKET_STAND) + ' (wie PAKET_STAND) und Links auf beide PDFs');
  ok(pdfAntwort.every((r, i) => r.status === 200 && /application\/pdf/.test(r.headers['content-type'] || '') && r.buf.slice(0, 5).toString() === '%PDF-' && r.buf.length > 10000 && bpdf.summeIn(r.buf) === bpdf.pruefsumme(vertr[i]) && r.buf.equals(dateiPdf[i])) && /\/Title \(Paketbedingungen/.test(dateiPdf[0].toString('latin1')),
    '29.4 Beide PDFs ausgeliefert und lesbar (' + pdfAntwort.map((r) => Math.round(r.buf.length / 1024) + ' KB').join(', ') + '), Prüfsumme passt zum Text der Seite');
  const ph = (kb.text.match(/<mark class="ph">\[[^\]<]{1,60}\]<\/mark>/g) || []).length;
  const assets = { fetch: async (req) => { const p = new URL(req.url).pathname, f = path.join(WZ, 'web', p.endsWith('/') ? p + 'index.html' : p); return fs.existsSync(f) ? new Response(fs.readFileSync(f), { status: 200 }) : new Response('', { status: 404 }); } };
  const umg = await imp('functions/api/umgebung.js');
  const vs = await recht.paketVerkaufStand(umg.konfig({ STRIPE_SECRET_KEY: 'sk_live_pruefung29', MAIL_API_KEY: 're_pruefung29', MAIL_ABSENDER: 'kontakt@eeziframes.com', MWST: '19', SITZUNG_GEHEIMNIS: 'pruefung29-sitzung-geheimnis-mindestens-32-zeichen', SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_KEY: 'sb_secret_x' }), { ASSETS: assets }, 'https://pruefung29.example');
  ok(ph >= 3 && /Entwurf zur anwaltlichen Prüfung/.test(kb.text) && vertr.every((v) => v.entwurf) && !vs.bereit && vs.fehlt.some((x) => /Paketbedingungen/.test(x)) && !vs.fehlt.some((x) => /PDF fehlt/.test(x)) && RI.verkauf({ offen: true, live: true, bereit: vs.bereit }).kasse === false,
    '29.4 Entwurf: ' + ph + ' sichtbar markierte Platzhalter, „Entwurf zur anwaltlichen Prüfung“ auf der Seite und in den PDFs; solange sie da sind, hält paketVerkaufStand() die Live-Kasse zu (die PDFs sind da)');
  const leist = (/<!--pakete:leistungen-->([\s\S]*?)<!--\/pakete:leistungen-->/.exec(kb.text) || [])[1] || '';
  const fristTab = (/<!--pakete:fristen-->([\s\S]*?)<!--\/pakete:fristen-->/.exec(kb.text) || [])[1] || '';
  const zellen = (s) => s.replace(/<[^>]+>/g, ' ');
  ok(Object.keys(Pk.MERKMALE).filter((s) => s !== 'name' && s !== 'preis').every((s) => leist.includes(Pk.MERKMALE[s].titel)) && Pk.LISTE.every((p) => leist.includes('<th>' + Pk.PAKETE[p].name + '</th>')) &&
    zellen(fristTab).includes(Pk.merkmale('essential').aufbewahrung + ' Tage nach bestätigter Zustellung') && zellen(fristTab).includes(F.fotosSignatureTage + ' Tage nach dem Eingang') && zellen(fristTab).includes(F.loeschenNachEndeTage + ' Tage nach dem Ende') &&
    kb.text.includes('<!--pakete:f-kulanzTage-->' + F.kulanzTage + '<') && kb.text.includes('<!--pakete:f-pauseMaxTage-->' + F.pauseMaxTage + '<') && ['Cloudflare', 'Supabase', 'Resend', 'Anthropic'].every((u) => kb.text.includes(u)) && /C-154\/21/.test(kb.text),
    '29.4 Inhalt aus pakete.js und instanzregeln.js: Leistungen je Paket (alle Merkmale), Fristen je Paket, Kulanz ' + F.kulanzTage + ' und Pause ' + F.pauseMaxTage + ' Tage; AV-Vertrag mit Unterauftragnehmern und Nennungspflicht (EuGH C-154/21)');

  /* ---------- 29.5 Impressum und Datenschutz je Paket ---------- */
  const I = h.instanzen, seiten = {};
  for (const sel of ['essential', 'plus', 'signature']) {
    const host = I[sel].host;
    seiten[sel] = { imp: await h.api(host, '/impressum/'), ds: await h.api(host, '/datenschutz/'), m: Pk.merkmale(I[sel].paket) };
  }
  const zeilen = await h.attrappe();
  const rechtVon = (sel) => ((zeilen.instanzen || []).find((i) => i.id === I[sel].id) || {}).recht || {};
  const pflicht = Object.keys(seiten).every((sel) => { const r = rechtVon(sel), t = seiten[sel].imp.text; return seiten[sel].imp.status === 200 && /Angaben nach § 5 DDG/.test(t) && ['firma', 'vertretung', 'strasse', 'plz', 'ort', 'tel', 'mail', 'register', 'ust'].every((k) => !r[k] || t.includes(String(r[k]).replace(/&/g, '&amp;'))); });
  ok(pflicht, '29.5 Impressum je Paket mit den Pflichtangaben aus instanzen.recht (Firma, Vertretung, Anschrift, Telefon, E-Mail, Register, USt-IdNr.)');
  const UNTER = ['Cloudflare, Inc.', 'Supabase Inc.', 'Plus Five Five, Inc. (Resend)', 'Anthropic Ireland, Limited'];
  ok(Object.values(seiten).every((x) => x.ds.status === 200 && UNTER.every((u) => x.ds.text.includes(u)) && /Art\. 28 DSGVO/.test(x.ds.text) && /Art\. 6 Abs\. 1 lit\. a DSGVO/.test(x.ds.text) && /Art\. 6 Abs\. 1 lit\. b DSGVO/.test(x.ds.text) && /§ 25 Abs\. 2 Nr\. 2 TDDDG/.test(x.ds.text) && /__Host-vorschau/.test(x.ds.text) && /localStorage/.test(x.ds.text) && /Art\. 77 DSGVO/.test(x.ds.text)),
    '29.5 Datenschutz in allen Paketen: Unterauftragnehmer mit Namen (Cloudflare, Supabase, Resend, Anthropic), Rechtsgrundlagen (lit. a KI, lit. b Anfrage), Speicher im Browser und Cookies (§ 25 TDDDG), Beschwerderecht');
  const sig = seiten.signature;
  ok(!/eeziframes/i.test(sig.ds.text) && !/eeziframes/i.test(sig.imp.text) && /technischer Dienstleister/.test(sig.ds.text) && ['essential', 'plus'].every((sel) => /eeziframes \(Patrick Kies, Postweg 35, 33442 Herzebrock-Clarholz\) als unser Auftragsverarbeiter/.test(seiten[sel].ds.text)),
    '29.5 Signature nennt eeziframes nirgends (nur „technischer Dienstleister“), Essential und Plus nennen eeziframes mit Anschrift als Auftragsverarbeiter');
  const fristOk = Object.values(seiten).every((x) => {
    const t = x.ds.text, m = x.m;
    return (m.aufbewahrung === 'vertrag' ? t.includes(F.fotosSignatureTage + ' Tage nach dem Eingang') : t.includes(m.aufbewahrung + ' Tage nachdem die E-Mail an uns zugestellt wurde')) &&
      (m.fotoLinkTage ? t.includes(m.fotoLinkTage + ' Tage gültig') : !/Originalfotos in unserer E-Mail/.test(t)) && t.includes(F.entwurfLeerStunden + ' Stunden') && t.includes(F.entwurfStillTage + ' Tage nach der letzten Änderung') &&
      t.includes(F.unzustellbarTage + ' Tage nach dem Eingang') && t.includes(F.loeschenNachEndeTage + ' Tage nach dem Ende') && /__Host-betrieb/.test(t) === !!m.dashboard && /Persönliche Einladung/.test(t) === !!m.einladungslinks;
  });
  ok(fristOk, '29.5 Fristen je Paket wie pakete.js und instanzregeln.js (Aufbewahrung ' + Pk.LISTE.map((p) => Pk.merkmale(p).aufbewahrung).join('/') + ', Fotolink ' + Pk.LISTE.map((p) => Pk.merkmale(p).fotoLinkTage).join('/') + ' Tage), Dashboard-Cookie und Einladungen nur bei Signature');
  const nw = rechtI.aufsichtFuer('NW');
  ok(Object.values(seiten).every((x) => x.ds.text.includes(nw.name) && x.ds.text.includes('ldi.nrw.de')) && Object.keys(rechtI.AUFSICHT).length === 16 && Object.keys(RI.BUNDESLAENDER).every((b) => rechtI.AUFSICHT[b] && /^https:\/\//.test(rechtI.AUFSICHT[b].web) && /\d{5} /.test(rechtI.AUFSICHT[b].anschrift)), '29.5 Aufsichtsbehörde: Tabelle der 16 Länder; die Instanzen (Sitz NRW) nennen die LDI NRW');
  const rP = Object.assign({}, rechtVon('plus'), { firma: 'Fenster <script>alert(1)</script> & "Söhne"', vertretung: '<img src=x onerror=alert(2)>', bundesland: 'BY' });
  await h.instanz(I.plus.host, { recht: rP });
  const impX = await h.api(I.plus.host, '/impressum/'), dsX = await h.api(I.plus.host, '/datenschutz/');
  ok(!/<script>alert|<img src=x/.test(impX.text + dsX.text) && impX.text.includes('Fenster &lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;Söhne&quot;') && dsX.text.includes('&lt;img src=x onerror=alert(2)&gt;') && dsX.text.includes('Bayerisches Landesamt für Datenschutzaufsicht') && !dsX.text.includes('ldi.nrw.de'),
    '29.5 Escaping: Firma und Vertretung mit HTML erscheinen als Text; Sitz in Bayern → Bayerisches Landesamt für Datenschutzaufsicht');
  await h.instanz(I.plus.host, { status: 'pausiert' });
  const impP = await h.api(I.plus.host, '/impressum/'), dsP = await h.api(I.plus.host, '/datenschutz/'), startP = await h.api(I.plus.host, '/');
  await h.instanz(I.plus.host, { status: 'aktiv', recht: rechtVon('plus') });
  ok(impP.status === 200 && dsP.status === 200 && startP.status === 503 && RI.darf('pausiert', 'recht') && RI.darf('beendet', 'recht'), '29.5 Impressum und Datenschutz bleiben auch bei pausierter Instanz erreichbar (Startseite 503)');
  ok(Object.values(seiten).every((x) => /noindex/.test(x.ds.text) && !/<script/.test(x.ds.text) && !(x.ds.text.match(/https?:\/\/[^"'\s<]+/g) || []).some((u) => /fonts\.googleapis|cdn\./.test(u)) && (VORLAGE_SICHTBAR(rechtI) ? /anwaltliche Prüfung ausstehend/.test(x.ds.text) && /anwaltliche Prüfung ausstehend/.test(x.imp.text) : true)),
    '29.5 Rechtsseiten der Instanzen ohne Skripte und fremde Server, noindex; solange die Vorlage nicht anwaltlich geprüft ist, steht das sichtbar darunter');
  const c5 = await h.browser.newContext(h.telefon), p5 = await h.neueSeite(c5, h.base(I.signature.host));
  await p5.goto(h.base(I.signature.host) + '/datenschutz/', { waitUntil: 'networkidle' });
  const r5 = await p5.evaluate(() => ({ quer: document.documentElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll('h1').length, links: [...document.querySelectorAll('nav a')].every((a) => a.getBoundingClientRect().height >= 44) }));
  await h.foto(p5, 'f-instanz-datenschutz-telefon');
  ok(!r5.quer && r5.h1 === 1 && r5.links, '29.5 Datenschutz der Instanz am Telefon: Tabellen ohne Querscrollen, ein h1, Navigation ab 44 px');
  h.sauber(p5, '29.5 Rechtsseite der Instanz ohne Fehler und CSP-Verstöße');
  await c5.close();

  /* ---------- 29.6 Datenschutz und Cookies auf eeziframes.com ---------- */
  const dsE = (await h.api('localhost', '/datenschutz/')).text, ckE = (await h.api('localhost', '/cookies/')).text;
  const p6 = (/<h2 id="pakete">[\s\S]*?(?=<h2)/.exec(dsE) || [''])[0];
  ok(/<h2 id="pakete">9\. Konfigurator-Pakete für Fensteranbieter<\/h2>/.test(dsE) && /__Host-partner/.test(p6) && /Art\. 6 Abs\. 1 lit\. b DSGVO/.test(p6) && /Stripe/.test(p6) && /Resend/.test(p6) && /Supabase/.test(p6) && /Art\. 28 DSGVO/.test(p6) && /Auftragsverarbeiter/.test(p6) &&
    p6.includes('<!--pakete:f-bestellEntwurfTage-->' + F.bestellEntwurfTage + '<') && p6.includes('<!--pakete:f-loeschenNachEndeTage-->' + F.loeschenNachEndeTage + '<') && p6.includes('<!--pakete:f-sitzungTage-->' + F.sitzungTage + '<') &&
    /<h2 id="widerruf">11\. Widerruf/.test(dsE) && /<h2>12\. Ihre Rechte<\/h2>/.test(dsE) && /__Host-partner/.test(ckE) && /href="\/datenschutz\/#pakete"/.test(ckE),
    '29.6 Datenschutz eeziframes.com: Abschnitt 9 zu den Konfigurator-Paketen (Frage, Kundenkonto mit Cookie, Bestellung, Stripe, Resend, Supabase, Fristen aus instanzregeln.js, eeziframes als Auftragsverarbeiter der Instanzen), Nummern danach verschoben; Cookies nennt __Host-partner');

  /* ---------- 29.7 llms.txt ---------- */
  const ll = (await h.api('localhost', '/llms.txt')).text;
  const llAbs = (/## Konfigurator-Pakete für Fensteranbieter[\s\S]*?(?=\n## |$)/.exec(ll) || [''])[0];
  ok(!!llAbs && Pk.LISTE.every((p) => llAbs.includes(Pk.PAKETE[p].name + ': ' + Pk.preis(p).monat + ' € im Monat, dazu ' + Pk.preis(p).einrichtung + ' € Einrichtung')) && /nur für Unternehmer/i.test(llAbs) && /\(http:\/\/localhost:\d+\/fuer-fensterbauer\/\)/.test(llAbs) && /\/konfigurator-bedingungen\/\)/.test(llAbs) && RI.bestellung.LEISTE.every((s) => llAbs.includes(s.titel)) && !/Abo 10/.test(ll),
    '29.7 llms.txt mit Absatz zu den Paketen: Preise aus pakete.js, nur für Unternehmer, Ablauf, Links auf Verkaufsseite und Paketbedingungen; keine Tarife des Betriebsbereichs');

  /* ---------- 29.8 Doku-Links ---------- */
  const dokus = ['README.md'].concat(fs.readdirSync(path.join(WZ, 'docs')).filter((f) => f.endsWith('.md')).map((f) => 'docs/' + f));
  const fehlt = [];
  for (const d of dokus) {
    /* seit Welle 3 sind alle Stränge zusammengeführt: auch die Tabelle „Wellen und Dateibesitz“ nennt nur vorhandene Dateien */
    const t = lies(d), basis = path.dirname(path.join(WZ, d));
    for (const m of t.matchAll(/\]\(([^)\s#]+)(#[^)\s]*)?\)/g)) { const z = m[1]; if (/^(https?:|mailto:|tel:)/.test(z)) continue; if (!fs.existsSync(path.resolve(basis, z)) && !fs.existsSync(path.join(WZ, z.replace(/^\//, '')))) fehlt.push(d + ' → ' + z); }
    for (const m of t.matchAll(/`((?:docs|scripts|functions|web|supabase)\/[A-Za-z0-9_./-]+\.(?:md|mjs|js|html|css|sql|json|jsonc|py))`/g)) { if (!fs.existsSync(path.join(WZ, m[1])) && !/<|\*/.test(m[1])) fehlt.push(d + ' → ' + m[1]); }
  }
  const pflichtDoku = ['docs/BESTELLUNG.md', 'docs/INSTANZEN.md', 'docs/ONLINE-STELLEN.md'].filter((d) => !fs.existsSync(path.join(WZ, d)));
  const teil2 = /## Teil 2: Betrieb\n\n(?!Folgt)/.test(lies('docs/INSTANZEN.md'));
  ok(!fehlt.length && !pflichtDoku.length && teil2 && /BESTELLUNG\.md/.test(lies('README.md')) && /PAKETE_OFFEN/.test(lies('docs/ONLINE-STELLEN.md')) && /bedingungen-pdf\.mjs/.test(lies('docs/BESTELLUNG.md')),
    '29.8 Doku: alle Links und Dateipfade in README.md und docs/*.md zeigen auf vorhandene Dateien (' + dokus.length + ' Dateien), INSTANZEN.md Teil 2 und BESTELLUNG.md geschrieben' + (fehlt.length ? '; fehlt: ' + fehlt.slice(0, 8).join(', ') : '') + (pflichtDoku.length ? '; Datei fehlt: ' + pflichtDoku.join(', ') : ''));
};
const VORLAGE_SICHTBAR = (rechtI) => !rechtI.VORLAGE.geprueft;

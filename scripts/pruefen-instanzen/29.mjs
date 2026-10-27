// eeziframes · Prüfabschnitt 29: Verkaufsseite, Rechtstexte, Doku (Strang F, Bauplan §3 F; docs/INSTANZEN.md)
// 29.1 Preise der Pakete in HTML und JSON-LD wie pakete.js, ohne JavaScript, „nur für Unternehmer“, keine alten Tarife ·
// 29.2 Paketknöpfe auf die Bestellung /bestellen/#<paket> (ohne PAKETE_OFFEN „anfragen“, mit „bestellen“), Frageformular (POST /api/auftrag/frage) mit und ohne JavaScript, Honigtopf, Bremse, Mail an
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
  const zahl = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')), eur = (n) => zahl(n) + NB + '€';
  const lies = (rel) => fs.readFileSync(path.join(WZ, rel), 'utf8');

  /* ---------- 29.1 Preise ---------- */
  const vk = await h.api('localhost', '/fuer-fensterbauer/');
  const fb = vk.text, roh = lies('web/fuer-fensterbauer/index.html');
  /* Design-DNA (26.10.2026): Karten .ez-paket (id paket-<paket> in der Reihenfolge von Pakete.LISTE), Vergleichstabelle, Preise als Bausteine fb-… */
  const kartenAus = (html) => [...html.matchAll(/<article class="ez-paket[^"]*" id="paket-([a-z]+)"[\s\S]*?<\/article>/g)].map((m) => ({ p: m[1], html: m[0] }));
  const ohneMarken = (t) => t.replace(/<!--\/?pakete:[\w-]+-->/g, '');
  const karten = kartenAus(ohneMarken(fb));
  const karteOk = (k) => { const pr = Pk.preis(k.p); return k.html.includes('<span class="dna-zahl__wert">' + zahl(pr.monat) + '<span class="dna-zahl__einheit">€ im Monat, netto</span>') && k.html.includes('dazu ' + eur(pr.einrichtung) + ' Einrichtung, einmalig vorab · netto') && k.html.includes(Pk.tausend(Pk.PAKETE[k.p].kiMonat) + ' KI-Auswertungen im Monat inklusive, jede weitere ' + eur(pr.ki)) && k.html.includes(Pk.PAKETE[k.p].name); };
  ok(vk.status === 200 && karten.length === Pk.LISTE.length && karten.map((k) => k.p).join() === Pk.LISTE.join() && karten.every(karteOk) && /Alle Preise netto zzgl\. MwSt\., nur für Unternehmer\./.test(fb), '29.1 Verkaufsseite: drei Paketkarten mit Monats- und Einrichtungspreis aus pakete.js (' + Pk.LISTE.map((p) => Pk.preis(p).monat + '/' + Pk.preis(p).einrichtung).join(', ') + ' €), netto, KI-Kontingent und Preis jeder weiteren Auswertung, „nur für Unternehmer“');
  const vgl = (/<details class="ez-vergleich-auf">[\s\S]*?<\/table>/.exec(fb) || [''])[0];
  const zeile = (t) => (new RegExp('<th scope="row">' + t + '</th>([\\s\\S]*?)</tr>').exec(vgl) || [])[1] || '';
  ok(Pk.LISTE.every((p) => zeile('Monatlich, netto').includes(eur(Pk.preis(p).monat)) && zeile('Einrichtung, einmalig vorab').includes(eur(Pk.preis(p).einrichtung))) && /Zugänge zum Dashboard/.test(vgl) && zeile('Zugänge zum Dashboard').includes(String(Pk.merkmale('signature').zugaenge)), '29.1 Vergleich: Monats- und Einrichtungspreis je Paket aus pakete.js, Zugänge zum Dashboard wie pakete.js');
  const ld = ldjson(fb).find((x) => x && x['@type'] === 'SoftwareApplication' && Array.isArray(x.offers));
  const ldOk = !!ld && ld.offers.length === 3 && Pk.LISTE.every((p, i) => {
    const o = ld.offers[i], pr = Pk.preis(p), spez = o.priceSpecification || [];
    return o['@type'] === 'Offer' && o.name === Pk.PAKETE[p].name && o.price === pr.monat.toFixed(2) && o.priceCurrency === 'EUR' && spez.length === 2 && spez.every((x) => x.valueAddedTaxIncluded === false && x.priceCurrency === 'EUR') &&
      spez[0].price === pr.monat.toFixed(2) && spez[0].billingDuration === 'P1M' && spez[1].price === pr.einrichtung.toFixed(2) && /Nur für Unternehmer/.test(o.description);
  });
  ok(ldOk && /^https?:\/\//.test(ld.url) && ld.offers.every((o) => o.availability === 'https://schema.org/PreOrder'), '29.1 JSON-LD: drei Offer mit priceSpecification netto (valueAddedTaxIncluded: false), Monat und Einrichtung wie pakete.js, absolute Adresse, ohne PAKETE_OFFEN „PreOrder“');
  const alt = ['Abo 10', 'Kostenlos starten', '/#fensterbauer', '/#tour', 'je Projekt mit eingegangenem', 'Projekte kostenlos', 'Einführungspreis'].filter((x) => fb.includes(x) || roh.includes(x));
  ok(!alt.length && !/class="einf"/.test(fb), '29.1 Keine alten Tarife des Betriebsbereichs auf /fuer-fensterbauer/ (Projektpreis, Abo 10, Plus, „Kostenlos starten“, Tour, Einführungspreis)' + (alt.length ? ': ' + alt.join(', ') : ''));
  ok(kartenAus(ohneMarken(roh)).length === Pk.LISTE.length && kartenAus(ohneMarken(roh)).every(karteOk) && bpdf.pruefen().ok, '29.1 Auch ohne Worker und JavaScript: Die Datei in web/ trägt dieselben Preise (Bausteine von node scripts/bedingungen-pdf.mjs aktuell)' + (bpdf.pruefen().ok ? '' : ': ' + bpdf.pruefen().fehler.join('; ')));

  /* ohne PAKETE_OFFEN: vorläufig, Anfrage statt Bestellung */
  const ohneBestellen = !/\/partner\//.test(fb) && /Vorläufige Preise;/.test(fb) === Pk.VORLAEUFIG && /Die Bestellung wird in Kürze freigeschaltet/.test(fb) && Pk.LISTE.every((p) => new RegExp('<a class="dna-pille(?: dna-pille--leise)?" href="/bestellen/#' + p + '" data-paket="' + p + '">[^<]+ anfragen').test(fb)) && /<form class="ez-form" id="anfrage-form" data-theme="hell" method="post" action="\/api\/auftrag\/frage">/.test(fb);
  ok(ohneBestellen, '29.2 Ohne PAKETE_OFFEN: „Vorläufige Preise“ nur, solange pakete.js sie vorläufig nennt (seit 27.10.2026 nicht mehr), „Bestellung wird in Kürze freigeschaltet“, jede Karte führt als „… anfragen“ in die Bestellung ihres Pakets (die ohne offene Kasse unverbindlich anfragt)');

  /* ---------- 29.2 mit PAKETE_OFFEN, Frageformular ---------- */
  const s2 = await h.server({ PAKETE_OFFEN: '1', MAIL_KONTAKT: 'inhaber@pruefung29.example' });
  const fb2 = (await s2.api('localhost', '/fuer-fensterbauer/')).text;
  const knoepfe = [...fb2.matchAll(/<a class="dna-pille(?: dna-pille--leise)?" href="([^"]+)" data-paket="[a-z]+">[^<]+ bestellen/g)].concat([...fb2.matchAll(/<a href="(\/bestellen\/#[a-z]+)">/g)]);
  const ziele = Pk.LISTE.map((p) => '/bestellen/#' + p);
  const ld2 = ldjson(fb2).find((x) => x && Array.isArray(x.offers));
  ok(knoepfe.length >= 6 && knoepfe.every((k) => ziele.includes(k[1])) && ziele.every((z) => knoepfe.filter((k) => k[1] === z).length >= 2) && !/in Kürze freigeschaltet/.test(fb2) && /Vorläufige Preise;/.test(fb2) === Pk.VORLAEUFIG && /Ja\. Wählen Sie Ihr Paket und bestellen Sie online/.test(fb2) && ld2 && ld2.offers.every((o) => o.availability === 'https://schema.org/InStock'),
    '29.2 Mit PAKETE_OFFEN=1: Knopf jeder Karte und Abschnitt „Ihre Anfrage“ führen auf /bestellen/#<paket>, nichts mehr „in Kürze freigeschaltet“, FAQ „Ja“, JSON-LD „InStock“' + (Pk.VORLAEUFIG ? ', Preise weiter als vorläufig markiert (Pakete.VORLAEUFIG)' : ''));
  const bestellSeite = await s2.api('localhost', '/bestellen/'), altSeite = await s2.api('localhost', '/partner/');
  ok(bestellSeite.status === 200 && /bestellen\.js/.test(bestellSeite.text) && altSeite.status === 404, '29.2 Ziel der Knöpfe: /bestellen/ liefert die Bestellung; das alte Kundenkonto /partner/ gibt es nicht mehr (404)');

  const vorPost = (await s2.post()).length;
  const ohneJs = await s2.api('localhost', '/api/auftrag/frage', { body: formular({ name: 'Jens Brandt', firma: 'Brandt <Fenster>', mail: 'jens@brandt.example', tel: '0221 1', paket: 'plus', text: 'Geht auch eine .de-Domain?', fax: '' }), headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': '10.29.1.1' } });
  const mails1 = (await s2.post()).slice(vorPost);
  const fm = mails1.find((m) => /Frage zu den Paketen/.test(m.betreff));
  ok(ohneJs.status === 200 && /text\/html/.test(ohneJs.headers['content-type'] || '') && /Danke, Ihre Frage ist da\./.test(ohneJs.text) && /href="\/fuer-fensterbauer\/"/.test(ohneJs.text) && !!fm && fm.an === 'inhaber@pruefung29.example' && fm.antwortAn === 'jens@brandt.example' && /EEZI Essential Plus/.test(fm.html) && /Brandt &lt;Fenster&gt;/.test(fm.html) && !/Brandt <Fenster>/.test(fm.html),
    '29.2 Frage ohne JavaScript (Formular): Dankesseite mit Weg zurück, Mail an MAIL_KONTAKT mit Antwortadresse des Fragenden, Paket und escapter Firma');
  const falsch = await s2.api('localhost', '/api/auftrag/frage', { body: formular({ name: 'J', mail: 'kaputt', text: '' }), headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': '10.29.1.2' } });
  const falschJs = await s2.api('localhost', '/api/auftrag/frage', { body: { name: 'J', mail: 'kaputt', text: '' }, headers: { 'x-forwarded-for': '10.29.1.3' } });
  const kurz = await s2.api('localhost', '/api/auftrag/frage', { body: { name: 'Jens', mail: 'jens@kurz.example', text: 'ab' }, headers: { 'x-forwarded-for': '10.29.1.5' } });
  ok(falsch.status === 400 && /Das hat noch nicht geklappt/.test(falsch.text) && /role="alert"/.test(falsch.text) && falschJs.status === 400 && falschJs.json && falschJs.json.felder && falschJs.json.felder.name && falschJs.json.felder.mail && !falschJs.json.felder.text && kurz.status === 400 && kurz.json.felder.text, '29.2 Fehler: ohne JavaScript eine Seite mit den Hinweisen, mit JavaScript die Felder (name, mail) als JSON; die Frage ist freiwillig, nur ein, zwei Zeichen sind ein Fehler');
  const vorLeer = (await s2.post()).length;
  const leer = await s2.api('localhost', '/api/auftrag/frage', { body: { name: 'Ohne Frage', mail: 'ohne@frage.example', paket: 'signature', text: '' }, headers: { 'x-forwarded-for': '10.29.1.6' } });
  const leerMail = (await s2.post()).slice(vorLeer).find((m) => /Frage zu den Paketen/.test(m.betreff));
  ok(leer.status === 200 && !!leerMail && /Bitte Paket vormerken/.test(leerMail.html) && /EEZI Signature/.test(leerMail.html), '29.2 Ohne Frage („Paket vormerken“): Anfrage geht durch, die Mail sagt, was gewünscht ist');
  const vorHonig = (await s2.post()).length;
  const honig = await s2.api('localhost', '/api/auftrag/frage', { body: { name: 'Bot', mail: 'bot@spam.example', text: 'Kaufen Sie jetzt', fax: '0800 1' }, headers: { 'x-forwarded-for': '10.29.1.4' } });
  ok(honig.status === 200 && honig.json && honig.json.ok && (await s2.post()).length === vorHonig, '29.2 Honigtopf: Ein ausgefülltes Feld „fax“ bekommt ein freundliches OK, es geht aber keine Mail raus');
  const stati = [];
  for (let i = 0; i < 7; i++) stati.push((await s2.api('localhost', '/api/auftrag/frage', { body: { name: 'Viel Frager', mail: 'viel@frager.example', text: 'Frage ' + i }, headers: { 'x-forwarded-for': '10.29.2.9' } })).status);
  const anderer = await s2.api('localhost', '/api/auftrag/frage', { body: { name: 'Anderer', mail: 'anderer@frager.example', text: 'Andere Frage' }, headers: { 'x-forwarded-for': '10.29.3.9' } });
  ok(stati.slice(0, 5).every((x) => x === 200) && stati.slice(5).every((x) => x === 429) && anderer.status === 200, '29.2 Bremse: je Anschluss 5 Fragen in der Minute, danach 429; ein anderer Anschluss fragt weiter (' + stati.join(' ') + ')');
  const instFrage = await s2.api('essential.localhost', '/api/auftrag/frage', { body: { name: 'Jens', mail: 'jens@brandt.example', text: 'Hallo' }, headers: { 'x-forwarded-for': '10.29.4.1' } });
  ok(instFrage.status >= 400, '29.2 Das Frageformular gibt es nur auf eeziframes.com, nicht auf einer Instanz (' + instFrage.status + ')');

  /* im Browser: Karte wählt das Paket vor, Fehler am Feld, Dank ersetzt das Formular; Telefon und Schreibtisch ohne Querscrollen */
  for (const [name, opts] of [['Telefon', h.telefon], ['Schreibtisch', { viewport: { width: 1280, height: 900 }, locale: 'de-DE' }]]) {
    const c = await h.browser.newContext(opts), page = await h.neueSeite(c, h.base('localhost'));
    await page.goto(h.base('localhost') + '/fuer-fensterbauer/', { waitUntil: 'networkidle' });
    const quer = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    await page.locator('#pakete').scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
    await h.foto(page, 'f-verkauf-pakete-' + (name === 'Telefon' ? 'telefon' : 'desktop'));
    const ziel = await page.getAttribute('#paket-signature a.dna-pille', 'href');
    await page.locator('#bestellen').scrollIntoViewIfNeeded(); await page.locator('#anfrage-form input[name="paket"][value="signature"]').check({ force: true }); await page.waitForTimeout(200);
    const vor = ziel === '/bestellen/#signature' ? await page.evaluate(() => (document.querySelector('#anfrage-form input[name="paket"]:checked') || {}).value) : 'Ziel ' + ziel;
    await page.fill('input[name="name"]', 'J'); await page.click('#anfrage-form button[type="submit"]'); await page.waitForTimeout(200);
    const fehler = await page.evaluate(() => ({ n: document.querySelectorAll('#anfrage-form [aria-invalid="true"]').length, text: [...document.querySelectorAll('#anfrage-form .ez-feld__fehler.ist-da')].map((x) => x.textContent).join(' | '), fokus: document.activeElement && document.activeElement.name }));
    await page.fill('input[name="name"]', 'Jens Brandt'); await page.fill('input[name="mail"]', 'jens' + name.length + '@brandt.example'); await page.fill('textarea[name="text"]', 'Wann geht es los?');
    await h.foto(page, 'f-verkauf-frage-' + (name === 'Telefon' ? 'telefon' : 'desktop'));
    await page.click('#anfrage-form button[type="submit"]'); await page.waitForSelector('#anfrage-form.ist-gesendet .ez-form__meldung', { timeout: 8000 }).catch(() => null);
    const dank = await page.evaluate(() => { const d = document.querySelector('#anfrage-form .ez-form__meldung'); return !!d && document.activeElement === d && /Danke, Ihre Frage ist da/.test(d.textContent) && !document.querySelector('#anfrage-form input[name="name"]').offsetParent; });
    const ziele = await page.evaluate(() => [...document.querySelectorAll('.fb .dna-pille, .fb .widerruf-knopf, #anfrage-form button')].filter((a) => a.offsetParent).map((a) => a.getBoundingClientRect()).every((r) => r.height >= 44));
    ok(!quer && vor === 'signature' && fehler.n === 2 && fehler.fokus === 'name' && /Namen/.test(fehler.text) && dank && ziele, '29.2 Im Browser (' + name + '): kein Querscrollen, Knopf unter Signature führt in die Bestellung von Signature, Paketwahl im Formular, Fehler an Name und E-Mail mit Fokus, Dank ersetzt das Formular, Knöpfe ab 44 px');
    h.sauber(page, '29.2 Verkaufsseite im Browser (' + name + ') ohne Fehler, CSP-Verstöße und fremde Server');
    await c.close();
  }
  const nojs = await h.browser.newContext(Object.assign({}, h.telefon, { javaScriptEnabled: false })), np = await nojs.newPage();
  await np.goto(h.base('localhost') + '/fuer-fensterbauer/', { waitUntil: 'load' });
  const nojsPreise = await np.evaluate(() => [...document.querySelectorAll('.ez-paket .dna-zahl__wert')].map((b) => [...b.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim() + '\u202f€'));
  await np.fill('input[name="name"]', 'Ohne Skript'); await np.fill('input[name="mail"]', 'ohne@skript.example'); await np.fill('textarea[name="text"]', 'Frage ohne JavaScript');
  /* per Tastatur: Das sanfte Scrollen der Seite (scroll-behavior: smooth) lässt Playwrights Klick ohne JavaScript nie „stabil“ werden */
  await np.focus('#anfrage-form button[type="submit"]');
  await Promise.all([np.waitForNavigation({ waitUntil: 'load' }).catch(() => null), np.keyboard.press('Enter')]);
  const nojsDank = await np.evaluate(() => /Danke, Ihre Frage ist da/.test(document.body.innerText) && location.pathname === '/api/auftrag/frage');
  ok(nojsPreise.join() === Pk.LISTE.map((p) => eur(Pk.preis(p).monat)).join() && nojsDank, '29.1/29.2 Ohne JavaScript (Telefon): Preise sichtbar (' + nojsPreise.join(', ') + '), Frage geht als Formular ab und endet auf der Dankesseite');
  await nojs.close();

  /* ---------- 29.3 Kopf der Verkaufsseite ---------- */
  const titelFb = (fb.match(/<title>([^<]*)<\/title>/) || [])[1] || '', beschr = (fb.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok((fb.match(/<h1[\s>]/g) || []).length === 1 && /eeziframes/.test(titelFb) && titelFb.length <= 75 && beschr.length >= 70 && beschr.length <= 170 && /rel="canonical"/.test(vk.headers.link || '') && /<link rel="canonical" href="[^"]+\/fuer-fensterbauer\/">/.test(fb) && !/name="robots"/.test(fb) && ((h1) => h1.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() === 'Anfragen mit Aufmaß. Unter Ihrer Marke.' && (h1.match(/class="ez-ak"/g) || []).length === 1 && /<em class="ez-ak">Unter Ihrer Marke\.<\/em>/.test(h1))((/<h1 class="dna-titel-xl" id="hero-titel"[^>]*>([\s\S]*?)<\/h1>/.exec(fb) || [])[1] || ''),
    '29.3 Verkaufsseite: ein h1 mit zweiter Stimme in Grau, Titel mit Marke (' + titelFb.length + ' Zeichen), Beschreibung (' + beschr.length + ' Zeichen), Canonical, kein noindex der Vorschau');
  const abschnitte = ['hero', 'die-idee', 'so', 'aufmass', 'pakete', 'bestellen', 'start', 'kundenschutz', 'fragen', 'hintergrund', 'naehe', 'ratgeber'].filter((id) => !new RegExp(' id="' + id + '"').test(fb));
  const leiste = RI.bestellung.LEISTE.map((s) => s.titel), ablauf = (/<ol class="dna-schritte ez-livegang"[\s\S]*?<\/ol>/.exec(fb) || [''])[0];
  ok(!abschnitte.length && leiste.every((t, i) => ablauf.indexOf('<b>' + t + '</b>') >= 0 && (i === 0 || ablauf.indexOf('<b>' + t + '</b>') > ablauf.indexOf('<b>' + leiste[i - 1] + '</b>'))) && /3 bis 5 Werktage/.test(fb) && /Kundenschutz|Kunden bleiben Ihre Kunden/.test(fb),
    '29.3 Inhalt: Bühne, Idee, Kunde, Postfach, Pakete, Formular, Start mit den sechs Schritten der Statusleiste (' + leiste.join(' → ') + '), Kundenschutz, FAQ, Hintergrund, Nähe, Wissen' + (abschnitte.length ? '; fehlt: ' + abschnitte.join(', ') : ''));
  const faq = ldjson(fb).find((x) => x && x['@graph']), fragen = faq ? faq['@graph'].find((x) => x['@type'] === 'FAQPage').mainEntity : [];
  const sichtbar = (t) => t.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  ok(fragen.length >= 6 && fragen.every((q) => fb.includes('<summary><span>' + q.name + '</span>') && sichtbar(fb).includes(q.acceptedAnswer.text)) && ['Domain', 'kündigen', 'Datenschutz', 'Kunde', 'Website'].every((w) => fragen.some((q) => q.name.includes(w))), '29.3 FAQ (Domain, Kosten, Kündigung, Datenschutz, was der Kunde sieht, Website) auf der Seite und als FAQPage gleich');

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
  ok(ph >= 1 && /\[Freigabe der Fassung durch die Anwältin folgt\]/.test(kb.text) && /Entwurf zur anwaltlichen Prüfung/.test(kb.text) && vertr.every((v) => v.entwurf) && !vs.bereit && vs.fehlt.some((x) => /Paketbedingungen/.test(x)) && !vs.fehlt.some((x) => /PDF fehlt/.test(x)) && RI.verkauf({ offen: true, live: true, bereit: vs.bereit }).kasse === false,
    '29.4 Entwurf: ' + ph + ' sichtbar markierte Platzhalter (mindestens die Freigabe durch die Anwältin), „Entwurf zur anwaltlichen Prüfung“ auf der Seite und in den PDFs; solange sie da sind, hält paketVerkaufStand() die Live-Kasse zu (die PDFs sind da)');
  ok(!VORLAGE_SICHTBAR(rechtI) || vs.fehlt.some((x) => /Vorlage .*Instanzen anwaltlich prüfen/.test(x)), '29.4 Befund 5: solange die Rechtsvorlage der Instanzen ungeprüft ist (VORLAGE.geprueft false), nennt paketVerkaufStand() sie und hält die Live-Kasse zu');
  const sigKarte = (/<article class="ez-paket[^"]*" id="paket-signature"[\s\S]*?<\/article>/.exec(fb) || [''])[0], absZeile = (/<tr><td>Absender der E-Mails<\/td>[\s\S]*?<\/tr>/.exec(kb.text) || [''])[0];
  ok(!!sigKarte && (/sobald eingerichtet/.test(sigKarte) || !/Absender|neutral/i.test(sigKarte)) && !/auch im PDF und in den E-Mails/.test(sigKarte) && /sobald eingerichtet/.test(absZeile) && !/>neutrales Postfach</.test(absZeile),
    '29.4 Befund 2: Verkaufsseite (Karte Signature) verspricht keinen neutralen Absender (oder nur „sobald eingerichtet“), Paketbedingungen (Zeile „Absender der E-Mails“) nur „sobald eingerichtet“');
  const leist = (/<!--pakete:leistungen-->([\s\S]*?)<!--\/pakete:leistungen-->/.exec(kb.text) || [])[1] || '';
  const fristTab = (/<!--pakete:fristen-->([\s\S]*?)<!--\/pakete:fristen-->/.exec(kb.text) || [])[1] || '';
  const zellen = (s) => s.replace(/<[^>]+>/g, ' ');
  /* Originalfotos: mit der Anfrage gelöscht; nur ein Paket mit Aufbewahrung bis Vertragsende hätte eine eigene Fotofrist
     (fotosSignatureTage). Seit 27.10.2026 hat keines das (Entscheidung des Inhabers, docs/INSTANZEN.md) */
  const fotoZeile = Pk.LISTE.some((p) => Pk.merkmale(p).aufbewahrung === 'vertrag') ? F.fotosSignatureTage + ' Tage nach dem Eingang' : 'Originalfotos der Anfragen ' + Pk.LISTE.map(() => 'mit der Anfrage').join(' ');
  ok(Object.keys(Pk.MERKMALE).filter((s) => s !== 'name' && s !== 'preis').every((s) => leist.includes(Pk.MERKMALE[s].titel)) && Pk.LISTE.every((p) => leist.includes('<th>' + Pk.PAKETE[p].name + '</th>')) &&
    zellen(fristTab).includes(Pk.merkmale('essential').aufbewahrung + ' Tage nach bestätigter Zustellung') && zellen(fristTab).replace(/\s+/g, ' ').includes(fotoZeile) && zellen(fristTab).includes(F.loeschenNachEndeTage + ' Tage nach dem Ende') &&
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
  ok(/<h2 id="pakete">9\. Konfigurator-Pakete für Fensteranbieter<\/h2>/.test(dsE) && /__Host-kunde/.test(p6) && !/__Host-partner|\/partner\//.test(p6) && /Art\. 6 Abs\. 1 lit\. b DSGVO/.test(p6) && /Stripe/.test(p6) && /Resend/.test(p6) && /Supabase/.test(p6) && /Art\. 28 DSGVO/.test(p6) && /Auftragsverarbeiter/.test(p6) &&
    p6.includes('<!--pakete:f-bestellEntwurfTage-->' + F.bestellEntwurfTage + '<') && p6.includes('<!--pakete:f-loeschenNachEndeTage-->' + F.loeschenNachEndeTage + '<') && p6.includes('<!--pakete:f-sitzungTage-->' + F.sitzungTage + '<') &&
    /<h2 id="widerruf">11\. Widerruf/.test(dsE) && /<h2>12\. Ihre Rechte<\/h2>/.test(dsE) && /__Host-kunde/.test(ckE) && /__Host-inhaber/.test(ckE) && !/__Host-partner/.test(ckE) && /href="\/datenschutz\/#pakete"/.test(ckE),
    '29.6 Datenschutz eeziframes.com: Abschnitt 9 zu den Konfigurator-Paketen (Frage, Kundenkonto mit Cookie, Bestellung, Stripe, Resend, Supabase, Fristen aus instanzregeln.js, eeziframes als Auftragsverarbeiter der Instanzen), Nummern danach verschoben; Cookies nennt __Host-kunde und __Host-inhaber');

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

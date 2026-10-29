/* eeziframes · Wiederkehrende Bausteine aller Ratgeberseiten und Seiten für Fensterbauer an einer Stelle pflegen:
   - der Kopf jeder Seite in der Design-DNA (seit 28.10.2026): Grund sofort Schwarz, Outfit und Inter vorab geladen,
     web/assets/ratgeber-dna.css und ratgeber-dna.js (Quelle docs/profis/ratgeber-vorschau/, übertragen mit
     node scripts/ratgeber-uebertragen.mjs), Sprunglink zum Inhalt
   - drei Szenen wie auf der Startseite: dunkler Einstieg (Brotkrumen, Etikett, Titel, „Kurz gesagt“, Pillen, Zeichnung),
     helles Lesen („Auf dieser Seite“ und der Text), dunkles Ende (Häufige Fragen, Weg, Weiterlesen, Quellen)
   - „Auf dieser Seite“: Abschnitte aus den h2 der Seite, mit Lesezeit, am Anfang der hellen Szene
   - „Dein Weg zu neuen Fenstern“: sechs Schritte von „Prüfen“ bis „Einbauen“ als Stationen, der eigene hervorgehoben, dazu
     „Nächster Schritt“ mit der Zeichnung der nächsten Seite (nur Ratgeber für Hauseigentümer, vor „Weiterlesen“); hält Leser
     auf der Seite und verlinkt die Seiten sinnvoll
   - die Übersicht /ratgeber/ als dieser Weg (Stationen im Einstieg, je Schritt die Zahl und die Seiten mit ihrer Zeichnung)
     und ihre strukturierten Daten (hasPart)
   - die Fußzeile in drei Gruppen (Ratgeber, Für Fensterbauer, Mehr; die eigene Seite mit aria-current)
   - ids an allen h2, damit „Auf dieser Seite“ und Google („Springe zu“) auf Abschnitte zeigen können
   - die Bildsprache der Beiträge: Etikett über dem h1, die zweite Stimme (.ak, Silbergrau: der Teil nach „: “ oder „? “, sonst das
     letzte Wort), der Pfeilkreis an jeder vollen Pille, unter der ersten der Preis. Bilder sind die Zeichnungen der Seiten
     (web/bilder/*.svg in der Druckpalette der DNA, python3 scripts/zeichnungen-dna.py); die Tierfotos der früheren Bildsprache kommen
     nicht mehr vor
   - Feinsatz nach dem Gremium vom 28.10.2026: geschützte Leerzeichen zwischen Zahl und Einheit (auch § 4, DIN 18202, 2 × 3), Zahlen
     in Tabellen mit kleiner Einheit, das Ergebnis („es zählt“) als Zahl-Held, „Typische Fehler“ mit Kreuz, im Kasten „Häufiger Fehler“
     der erste Satz kräftig, Belegnummern mit Rückweg aus den Quellen
   - Muster „Antwort zuerst“ (29.10.2026, docs/SEO.md): die Symbole der Antwort-Kacheln (.rg-faelle) aus einem Satz (SYMBOLE); im HTML
     steht <svg class="rg-sym" data-sym="NAME"></svg>, das Skript setzt Maße und Zeichen ein. Merksatz, Zahl-Kacheln und Lösungs-Karte
     sind reines HTML mit den Klassen rg-merk, rg-zahlen und rg-loesung (Gestaltung in docs/profis/ratgeber-vorschau/ratgeber.css)
   Neue Seite: Eintrag in SEITEN_INFO und im passenden Schritt von WEG (Hauseigentümer) bzw. in FENSTERBAUER, dann
     node scripts/ratgeber-bausteine.mjs
   Das Skript ist idempotent; scripts/pruefen.mjs (Abschnitt 10) prüft, dass jede Seite genau so aussieht, wie es sie bauen würde. */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import crypto from 'node:crypto';

/* Kurzname (Fußzeile, Weg) und Kartentext (Übersicht, „Nächster Schritt“) je Seite */
export const SEITEN_INFO = {
  '/ratgeber/fenster-beschlagen/': ['Fenster beschlagen', 'Innen, außen oder zwischen den Scheiben: was es bedeutet und was hilft.'],
  '/ratgeber/fenster-undicht/': ['Fenster undicht', 'Der Papiertest zeigt in einer Minute, wo es zieht, und was du tun kannst.'],
  '/ratgeber/fenster-alter-erkennen/': ['Alter der Fenster', 'Abstandhalter lesen, Feuerzeugtest und Tabelle nach Bauzeit.'],
  '/ratgeber/fenster-reparieren-oder-austauschen/': ['Reparieren oder tauschen', 'Drei Fragen, mit denen du entscheidest, was dein Fenster braucht.'],
  '/ratgeber/fenster-austauschen/': ['Fenster austauschen', 'Sechs Schritte vom Aufmaß bis zum Einbau, Kosten pro Fenster, Förderung 2026.'],
  '/ratgeber/fenstertausch-altbau/': ['Fenstertausch im Altbau', 'Laibung, Abdichtung und wie du Schimmel nach dem Tausch vermeidest.'],
  '/ratgeber/fenster-material-vergleich/': ['Fenstermaterial', 'Kunststoff, Holz, Holz-Alu oder Alu: Preise, Lebensdauer und Pflege im Vergleich.'],
  '/ratgeber/dreifachverglasung/': ['Dreifachverglasung', 'Lohnt sich 3-fach-Glas? Werte, Aufpreis und Nachteile.'],
  '/ratgeber/fenster-oeffnungsarten/': ['Öffnungsarten', 'Dreh-Kipp, Kipp, Stulp oder fest: was wo passt und was du vorher klären solltest.'],
  '/ratgeber/uw-wert-fenster/': ['Uw-Wert und Förderung', 'Was der Wert bedeutet und welchen die Förderung 2026 verlangt.'],
  '/ratgeber/din-links-rechts/': ['DIN links oder rechts', 'Von innen gesehen: Bänder links heißt DIN links. Mit Merkregel und Zeichnung.'],
  '/ratgeber/fenster-standardmasse/': ['Standardmaße', 'Übliche Größen als Tabelle, und warum es im Altbau selten passt.'],
  '/ratgeber/fenster-ausmessen/': ['Fenster ausmessen', 'Maueröffnung an drei Stellen messen, das kleinste Maß zählt. Mit Messpunkten und typischen Fehlern.'],
  '/ratgeber/balkontuer-ausmessen/': ['Balkontür ausmessen', 'Höhe ab dem fertigen Fußboden, Schwelle und Abdichtung, Hebe-Schiebe- oder PSK-Tür.'],
  '/ratgeber/fenster-mit-rollladen-ausmessen/': ['Fenster mit Rollladen', 'Aufsatz, Einbau oder Vorbau: erst den Kasten erkennen, dann messen.'],
  '/ratgeber/kellerfenster-ausmessen/': ['Kellerfenster ausmessen', 'Maueröffnung oder Zarge, Lichtschacht und Einbruchschutz.'],
  '/ratgeber/fensterbank-ausmessen/': ['Fensterbank ausmessen', 'Innen und außen: Länge, Tiefe, Überstand und Gefälle.'],
  '/ratgeber/bruestungshoehe-fenster/': ['Brüstungshöhe', '80 cm, über 12 m Absturzhöhe 90 cm, und wann es eine Absturzsicherung braucht.'],
  '/ratgeber/aufmassblatt-fenster/': ['Aufmaßblatt', 'Was ein Aufmaß umfasst, Punkt für Punkt, und wie das Aufmaßblatt in der App entsteht.'],
  '/ratgeber/bestellmass-fenster/': ['Bestellmaß', 'Wie viel kleiner als die Öffnung? Fuge je Seite nach Größe und Farbe, mit Beispiel.'],
  '/ratgeber/fenster-angebot-vergleichen/': ['Angebote vergleichen', 'Checkliste und ein Beispiel, in dem das teurere Angebot das günstigere ist.'],
  '/ratgeber/ral-montage-fenster/': ['RAL-Montage', 'Innen luftdicht, in der Mitte gedämmt, außen schlagregendicht, einfach erklärt.'],
  '/ratgeber/lueftungskonzept-fenstertausch/': ['Lüftungskonzept', 'Wann es nach DIN 1946-6 nötig ist und was dabei herauskommt.'],
  '/fuer-fensterbauer/': ['Eigener Fenster-Konfigurator', 'Ihr Konfigurator unter Ihrer Domain, in drei Paketen; jede Anfrage kommt als Aufmaßblatt-PDF per E-Mail.'],
  '/fuer-fensterbauer/erstaufmass-feinaufmass/': ['Erstaufmaß und Feinaufmaß', 'Wofür welches Aufmaß da ist, wer misst und wie genau.'],
  '/fuer-fensterbauer/falsches-aufmass-haftung/': ['Falsches Aufmaß: Haftung', 'Wer haftet, wenn Fenster nicht passen, und wie Sie vorbeugen.'],
  '/fuer-fensterbauer/aufmass-kostenpflichtig/': ['Aufmaß kostenpflichtig?', 'Kostenloses Aufmaß, Anfahrtspauschale und was vorher vereinbart sein muss.'],
  '/fuer-fensterbauer/geplatzter-aufmasstermin/': ['Geplatzter Aufmaßtermin', 'Was eine Fahrt ohne Kunden kostet, mit Beispielrechnung.'],
  '/fuer-fensterbauer/fensterbau-software/': ['Fensterbau-Software', 'Aufmaß-Apps, Handwerkersoftware und ERP im fairen Überblick.'],
  '/fuer-fensterbauer/fenster-konfigurator-website/': ['Konfigurator für die Website', 'Widget, Hersteller, Agentur oder fertig gemietet: vier Wege im Vergleich.'],
  '/fuer-fensterbauer/digitales-aufmass/': ['Digitales Aufmaß', 'Wie genau Laser, LiDAR und Foto messen, und wann der Kunde misst.'],
  '/fuer-fensterbauer/leads-fensterbau/': ['Leads im Fensterbau', 'Was Portale verlangen und wie Sie Anfragen selbst gewinnen.'],
  '/fuer-fensterbauer/ki-im-fensterbau/': ['KI im Fensterbau', 'Wo KI hilft, warum sie nicht misst und was das Recht verlangt.']
};

/* Der Weg zu neuen Fenstern; die erste Seite eines Schritts ist sein Ziel in der Wegleiste und im „Nächster Schritt“ */
export const WEG = [
  { name: 'Prüfen', text: 'Beschlagen, undicht, wie alt?', seiten: ['/ratgeber/fenster-alter-erkennen/', '/ratgeber/fenster-beschlagen/', '/ratgeber/fenster-undicht/'] },
  { name: 'Entscheiden', text: 'Reparieren oder neu, Kosten, Förderung', seiten: ['/ratgeber/fenster-reparieren-oder-austauschen/', '/ratgeber/fenster-austauschen/', '/ratgeber/fenstertausch-altbau/'] },
  { name: 'Auswählen', text: 'Material, Glas, Öffnungsart', seiten: ['/ratgeber/fenster-material-vergleich/', '/ratgeber/dreifachverglasung/', '/ratgeber/fenster-oeffnungsarten/', '/ratgeber/uw-wert-fenster/', '/ratgeber/din-links-rechts/', '/ratgeber/fenster-standardmasse/'] },
  { name: 'Ausmessen', text: 'Selbst messen, fürs Angebot', seiten: ['/ratgeber/fenster-ausmessen/', '/ratgeber/balkontuer-ausmessen/', '/ratgeber/fenster-mit-rollladen-ausmessen/', '/ratgeber/kellerfenster-ausmessen/', '/ratgeber/fensterbank-ausmessen/', '/ratgeber/bruestungshoehe-fenster/', '/ratgeber/aufmassblatt-fenster/', '/ratgeber/bestellmass-fenster/'] },
  { name: 'Vergleichen', text: 'Angebote richtig lesen', seiten: ['/ratgeber/fenster-angebot-vergleichen/'] },
  { name: 'Einbauen', text: 'RAL-Montage, Lüftung', seiten: ['/ratgeber/ral-montage-fenster/', '/ratgeber/lueftungskonzept-fenstertausch/'] }
];
export const FENSTERBAUER = ['/fuer-fensterbauer/', '/fuer-fensterbauer/erstaufmass-feinaufmass/', '/fuer-fensterbauer/falsches-aufmass-haftung/', '/fuer-fensterbauer/aufmass-kostenpflichtig/', '/fuer-fensterbauer/geplatzter-aufmasstermin/', '/fuer-fensterbauer/fensterbau-software/',
  '/fuer-fensterbauer/fenster-konfigurator-website/', '/fuer-fensterbauer/digitales-aufmass/', '/fuer-fensterbauer/leads-fensterbau/', '/fuer-fensterbauer/ki-im-fensterbau/'];

/* Das Zeichen (eine Quelle: scripts/logo-setzen.py), hier für die Marke in der Fußzeile */
const ZEICHEN = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect class="fi-kachel" width="64" height="64" rx="10" fill="#000"/><g class="fi-licht" fill="#fff"><path class="fi-decke" d="M26.4 12.2 44.4 19.7 56.3 15.3 42 6.6Z"/><path class="fi-fenster" d="M45 22 57 17.6V41.9L45 39.8Z"/><path class="fi-strahl" d="M44.2 41 55.9 43.3 11.7 64H10A10 10 0 0 1 0 54Z"/></g><rect class="fi-rand" x=".5" y=".5" width="63" height="63" rx="9.5" fill="none" stroke="#000" stroke-opacity=".1"/></svg>';
const MARKE = '<a class="rg-marke" href="/" aria-label="eeziframes, zur Startseite">' + ZEICHEN + '<span class="wm" translate="no"><b>eezi</b>frames</span></a>';

const name = (p) => SEITEN_INFO[p][0], karte = (p) => SEITEN_INFO[p][1];
export const schrittVon = (pfad) => WEG.findIndex((s) => s.seiten.includes(pfad));

/* Kopf im HTML: Grund sofort Schwarz, Schriften vorab, Gestaltung und Skript der Ratgeber in der Design-DNA. Alles, was hier
   wegfällt (gemeinsam.css, ratgeber.css, theme-color #161616), gehört zur früheren Gestaltung. */
/* Die Schriften stehen in ratgeber-dna.css (Outfit und die Wortmarke als Teilmenge von Inter); beide Dateien mit Prüfsumme in der
   Adresse, web/_headers hält sie ein Jahr im Zwischenspeicher */
const ASSETS = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'web', 'assets');
const pruefsumme = (f) => crypto.createHash('sha256').update(fs.readFileSync(path.join(ASSETS, f))).digest('hex').slice(0, 8);
const KOPF = '<style>html,body{background:#07090a}</style>\n<link rel="preload" href="/fonts/outfit.woff2" as="font" type="font/woff2" crossorigin>\n' +
  '<link rel="preload" href="/fonts/inter-marke.woff2" as="font" type="font/woff2" crossorigin>\n' +
  '<link rel="stylesheet" href="/assets/ratgeber-dna.css?v=' + pruefsumme('ratgeber-dna.css') + '">\n<script src="/assets/ratgeber-dna.js?v=' + pruefsumme('ratgeber-dna.js') + '" defer></script>\n';
const KOPF_RAUS = [/<style>html,body\{background:#07090a\}<\/style>\n/g, /<link rel="preload" href="\/fonts\/[^"]+" as="font"[^>]*>\n/g,
  /<link rel="stylesheet" href="\/(?:fonts\/(?:fonts|dna)|assets\/(?:gemeinsam|ratgeber|ratgeber-dna))\.css(?:\?v=[0-9a-f]+)?">\n/g, /<script src="\/assets\/ratgeber-dna\.js(?:\?v=[0-9a-f]+)?" defer><\/script>\n/g];
function kopf(h) {
  let k = h.replace(/<meta name="theme-color" content="#[0-9a-fA-F]+">/, '<meta name="theme-color" content="#07090a">');
  for (const r of KOPF_RAUS) k = k.replace(r, '');
  k = k.replace(/(<link rel="apple-touch-icon"[^>]*>\n)/, (m) => m + KOPF);
  /* Sprunglink als erstes Ziel, die Seite steht auf dunklem Grund (data-theme), der Inhalt ist das Sprungziel */
  return k.replace(/<body class="rg-seite"[^>]*>\n(?:<a class="rg-skip"[^>]*>[^<]*<\/a>\n)?/, '<body class="rg-seite" data-theme="dunkel">\n<a class="rg-skip" href="#inhalt">Zum Inhalt springen</a>\n')
    .replace(/<main class="rg"[^>]*>/, '<main class="rg" id="inhalt">');
}

/* Szenen: dunkel (Einstieg), hell (Lesen), dunkel (Ende). Die Hüllen stehen je auf eigener Zeile und werden vor jedem Bau
   entfernt, damit das Skript idempotent bleibt. */
const HUELLE = {
  heroAuf: '\n  <div class="rg-szene rg-hero" data-theme="dunkel"><div class="rg-hero__text">',
  heroTextZu: '\n  </div><!-- /rg-hero__text -->',
  heroZu: '\n  </div><!-- /rg-hero -->',
  textAuf: '\n  <div class="rg-szene rg-text" data-theme="hell">',
  flussAuf: (n) => '\n  <div class="rg-fluss" style="--gesamt:' + n + '">',
  flussZu: '\n  </div><!-- /rg-fluss -->',
  textZu: '\n  </div><!-- /rg-text -->',
  endeAuf: '\n  <div class="rg-szene rg-ende" data-theme="dunkel">',
  endeZu: '\n  </div><!-- /rg-ende -->'
};
const ohneHuellen = (main) => main
  .replace(/\n {2}<div class="rg-szene rg-(?:hero|text|ende)" data-theme="(?:dunkel|hell)">(?:<div class="rg-hero__text">)?/g, '')
  .replace(/\n {2}<div class="rg-fluss" style="--gesamt:\d+">/g, '')
  .replace(/\n {2}<\/div><!-- \/rg-(?:hero__text|hero|fluss|text|ende) -->/g, '');

/* Fußzeile: Marke und drei Gruppen, Ratgeber in der Reihenfolge des Wegs */
export const GRUPPEN = [
  /* Für Fensterbauer zuerst (Gremium 28.10.2026: am Telefon sonst erst nach 24 Ratgebern): die Verkaufsseite der Konfigurator-Pakete
     und das Wissen rund ums Aufmaß; die Paketbedingungen stehen hier, die Nutzungsbedingungen des eingestellten Betriebskontos
     (28.10.2026) nicht mehr */
  ['Für Fensterbauer', FENSTERBAUER.map((p) => [p, name(p)]).concat([['/konfigurator-bedingungen/', 'Paketbedingungen']])],
  ['Ratgeber', [['/ratgeber/', 'Alle Ratgeber']].concat(WEG.flatMap((s) => s.seiten.map((p) => [p, name(p)])))],
  ['Mehr', [['/', 'Startseite'], ['/app/', 'App'], ['/agb/', 'AGB'], ['/datenschutz/', 'Datenschutz'], ['/cookies/', 'Cookies'], ['/impressum/', 'Impressum']]]
];
export function fusszeile(eigen) {
  const link = ([href, text]) => '<a href="' + href + '"' + (href === eigen ? ' aria-current="page"' : '') + '>' + text + '</a>';
  return '<footer class="rg-fuss rg-fuss-gruppen"><div>' + MARKE + GRUPPEN.map(([titel, links], i) =>
    '<nav aria-label="' + titel + '"><p class="rg-fuss-titel">' + titel + '</p>' + links.map(link).join('') +
    (i === GRUPPEN.length - 1 ? '<a class="rg-widerruf" href="/widerruf/">Vertrag widerrufen</a>' : '') + '</nav>').join('') + '</div></footer>';
}
export const FUSS = /<footer class="rg-fuss[^"]*"[^>]*>[\s\S]*?<\/footer>/;

/* ids aus dem Text der Überschrift: klein, Umlaute ausgeschrieben, nur Buchstaben, Ziffern und Bindestriche */
const slug = (t) => t.replace(/<[^>]+>/g, '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 6).join('-') || 'abschnitt';
const OHNE_INHALT = ['Weiterlesen', 'Quellen', 'Dein Weg zu neuen Fenstern'];
/* Seiten ohne „Auf dieser Seite“: die Verkaufsseite für Fensterbauer ist eine Landingpage, unter ihrem Startbild folgen direkt die Leisten */
export const OHNE_INHALTSVERZEICHNIS = ['/fuer-fensterbauer/'];
/* Bildsprache der Beiträge, alles idempotent: die Zeile über dem h1 wird zum Etikett, das letzte Wort des h1 zur zweiten Stimme,
   die erste volle Pille bekommt den Pfeilkreis */
const kicker = (h) => h.replace(/(<nav class="rg-pfad"[\s\S]*?<\/nav>\s*<p class=")eyebrow(">)/, '$1eyebrow kicker$2');
const zweiteStimme = (h) => h.replace(/<h1>([\s\S]*?)<\/h1>/, (m, innen) => {
  /* Überschrift in Zeilen (Seite für Fensterbauer, Zeilenmaske): dort gibt es die zweite Stimme schon */
  if (/class="vk-zeile"/.test(innen)) return m;
  const text = innen.replace(/<span class="ak">([\s\S]*?)<\/span>/g, '$1');
  /* das Suchwort vorn in Weiß, der Rest nach dem ersten „: “ oder „? “ als zweite Stimme (Text Zeichen für Zeichen gleich) */
  const satz = text.match(/^([\s\S]{12,}?[:?]) ([\s\S]+)$/);
  if (satz) return '<h1>' + satz[1] + ' <span class="ak">' + satz[2] + '</span></h1>';
  const k = text.lastIndexOf(' ');
  return k < 0 ? m : '<h1>' + text.slice(0, k + 1) + '<span class="ak">' + text.slice(k + 1) + '</span></h1>';
});
/* jede volle Pille mit Pfeilkreis (im Kopf ist die Pille Umriss, Klasse „btn primary small“, und bleibt ohne) */
const pfeil = (h) => h.replace(/(<a class="btn primary" href="[^"]*">)([^<]*)(<\/a>)/g, (m, a, t, z) => a + t + '<span class="pf" aria-hidden="true"></span>' + z);
/* Feinsatz im Hauptteil, alles idempotent. Nur Text zwischen Tags und nicht in den Fragen (<details>), denn die stehen wortgleich im
   JSON-LD: geschütztes Leerzeichen zwischen Zahl und Einheit, bei „§ 4“, „DIN 18202“, „2 × 3“ und „z. B.“ */
const EINHEIT = '(?:mm|cm|m²|m³|m|km|€|%|°C|kg|Jahre|Jahren|Minuten|Min\\.|Stunden|Stunde|Mio\\.|Tage|Tagen|Monate|Monaten|Wochen)';
const MIT_EINHEIT = new RegExp('(\\d) (' + EINHEIT + ')(?![A-Za-zÄÖÜäöüß0-9])', 'g');
const ohneFragen = (main, f) => main.split(/(<details[\s\S]*?<\/details>)/).map((teil, i) => (i % 2 ? teil : f(teil))).join('');
const feinsatz = (main) => ohneFragen(main, (teil) => teil.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(MIT_EINHEIT, '$1&nbsp;$2')
  .replace(/(\d) × (\d)/g, '$1&nbsp;×&nbsp;$2').replace(/§ (\d)/g, '§&nbsp;$1').replace(/\b(DIN|EN|ISO) (?=\d|EN\b|ISO\b)/g, '$1&nbsp;')
  .replace(/\bz\. B\./g, 'z.&nbsp;B.') + '<'));
/* Zahlen in Tabellen: Zellen, die nur eine Zahl (mit Einheit) tragen, in Tinte mit kleiner Einheit; das Ergebnis („es zählt“ oder
   die Zahl in <strong>) als Zahl-Held */
const ZAHL = new RegExp('^(<strong>)?(\\d[\\d.,]*(?: bis \\d[\\d.,]*)?)(?:(?:&nbsp;| )(' + EINHEIT + '))?(<\\/strong>)?((?:\\s*<a href="#q\\d+">\\[\\d+\\]<\\/a>)?)$');
const tabellen = (main) => main.replace(/<td( data-k="([^"]*)")?>([\s\S]*?)<\/td>/g, (m, attr, k, inhalt) => {
  const z = inhalt.match(ZAHL);
  if (!z) return m;
  const held = k === 'es zählt' || !!(z[1] && z[4]);
  return '<td class="rg-zahl' + (held ? ' rg-held' : '') + '"' + (attr || '') + '>' + (z[1] || '') + z[2] + (z[3] ? '&nbsp;<span class="rg-einheit">' + z[3] + '</span>' : '') + (z[4] || '') + z[5] + '</td>';
});
/* „Typische Fehler“: Liste mit Kreuz; im Kasten „Häufiger Fehler“ der erste Satz kräftig (Text gleich, nur Auszeichnung) */
const fehler = (main) => main.replace(/(<h2[^>]*>[^<]*Fehler[^<]*<\/h2>\s*)<ul(?: class="rg-fehler-liste")?>/g, '$1<ul class="rg-fehler-liste">')
  .replace(/(<aside class="rg-tipp fehler"><p class="eyebrow">[^<]*<\/p><p>)(?!<b>)((?:(?!<\/p>)[\s\S])*?[.!?])(?=\s|<\/p>)/g, '$1<b>$2</b>');
/* Symbole der Antwort-Kacheln: ein kleiner Satz einheitlicher Zeichen ohne Text, 24 × 24, Strich 1,8 mit runden Enden in currentColor,
   Punkte gefüllt, für Bildschirmleser verborgen (der Titel der Kachel sagt alles). Scheibe: zwei Gläser mit Randverbund wie in der
   Zeichnung fenster-beschlagen.svg, die Tropfen innen (links, Raum), zwischen den Gläsern oder außen (rechts). Software: Fertigung
   (Branchensoftware, ERP), Beleg (Handwerkersoftware), Telefon mit Maß (Aufmaß-App vor Ort), Maßband (Selbstaufmaß) */
const SCHEIBE = '<path d="M8 3h8v18H8z"/>';
const TROPFEN = (x) => [7, 12, 17].map((y) => '<circle cx="' + x + '" cy="' + y + '" r="1.5" fill="currentColor" stroke="none"/>').join('');
export const SYMBOLE = {
  'tropfen-innen': SCHEIBE + TROPFEN(4),
  'tropfen-zwischen': SCHEIBE + TROPFEN(12),
  'tropfen-aussen': SCHEIBE + TROPFEN(20),
  fertigung: '<path d="M3 20V11l5 3v-3l5 3V4.5h5V20M2 20h20"/>',
  beleg: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h4"/>',
  'vor-ort': '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M9.5 11h5M9.5 9.5v3M14.5 9.5v3M11 18.5h2"/>',
  'selbst-messen': '<rect x="2.5" y="5.5" width="12" height="12" rx="3"/><circle cx="8.5" cy="11.5" r="2.2"/><path d="M14.5 14.5h7v3h-7M17.5 14.5v1.3M20 14.5v1.3"/>'
};
const symbole = (main) => main.replace(/<svg class="rg-sym" data-sym="([a-z-]+)"[^>]*>[\s\S]*?<\/svg>/g, (m, n) => (SYMBOLE[n]
  ? '<svg class="rg-sym" data-sym="' + n + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + SYMBOLE[n] + '</svg>'
  : m));
/* Belegnummern: die erste Stelle je Quelle bekommt eine id, die Quelle einen Link zurück dorthin */
function belege(main) {
  main = main.replace(/<a href="#(q\d+)" id="zu-q\d+">/g, '<a href="#$1">').replace(/ <a class="rg-zurueck" href="#zu-q\d+" aria-label="[^"]*">zurück zum Text<\/a>/g, '');
  const gesetzt = new Set();
  main = main.split(/(<details[\s\S]*?<\/details>|<ol class="rg-quellen">[\s\S]*?<\/ol>)/).map((teil, i) => (i % 2 ? teil : teil.replace(/<a href="#(q\d+)">/g, (m, q) => {
    if (gesetzt.has(q)) return m;
    gesetzt.add(q);
    return '<a href="#' + q + '" id="zu-' + q + '">';
  }))).join('');
  return main.replace(/(<li id="(q\d+)">[\s\S]*?)(<\/li>)/g, (m, a, q, z) => (gesetzt.has(q) ? a + ' <a class="rg-zurueck" href="#zu-' + q + '" aria-label="Zurück zum Text, Beleg ' + q.slice(1) + '">zurück zum Text</a>' + z : m));
}
/* Preis direkt unter der ersten Pille: der Satz aus den Ratgebern, der Betrag aus web/config.js (nach dem Einführungspreis setzt
   functions/seo.js den neuen ein) */
const KONFIG = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'web', 'config.js'), 'utf8'))(w); return w.KONFIG; })();
const euro = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + '&nbsp;€';
const PREIS = '\n  <p class="rg-preis">Messen ist kostenlos; das Aufmaßblatt als PDF kostet ' + euro(KONFIG.preise.aufmass) + ', über den Link deines Fensterbauers nichts.</p>';
const PREIS_RAUS = /\n {2}<p class="rg-preis">[^<]*<\/p>/g;
/* Rundknopf „Auf dieser Seite“ in der zurückkehrenden Leiste (nur auf Seiten mit Inhaltsverzeichnis) */
const ZUM_INHALT = '<a class="rg-zum-inhalt" href="#auf-dieser-seite" aria-label="Auf dieser Seite"></a>';
const zumInhalt = (h, mit) => h.replace(ZUM_INHALT, '').replace(/(<nav class="rg-nav"[^>]*>(?:(?!<\/nav>)[\s\S])*?)(<a class="btn primary small")/, (m, a, b) => (mit ? a + ZUM_INHALT + b : m));
const INHALT = /\n?\s*<nav class="rg-inhalt"[\s\S]*?<\/nav>/;
const WEGBLOCK = /\n?\s*<section class="rg-weg"[\s\S]*?<\/section>/;

/* Lesezeit: Wörter im Hauptteil ohne Quellen, 200 Wörter je Minute, mindestens 2 Minuten */
function lesezeit(main) {
  const text = main.replace(/<h2[^>]*>Quellen<\/h2>[\s\S]*$/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  return Math.max(2, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

/* Zeichnung einer Seite (die Abbildung im Einstieg): Quelle, Maße und Alternativtext, für „Nächster Schritt“ und die Übersicht */
const bildVon = (z, pfad) => (z && z[pfad]) || null;
const bild = (b, klasse) => '<img src="' + b.src + '" width="' + b.w + '" height="' + b.h + '" alt="' + b.alt + '" decoding="async" class="' + klasse + '">';

function wegBlock(pfad, zeichnungen) {
  const i = schrittVon(pfad);
  /* alle Stationen gleich (kein „erledigt“: gelesen ist nicht getan); die eigene ohne Link auf sich selbst, aria-current am Ziel */
  const liste = WEG.map((s, j) => (j === i
    ? '<li><span class="rg-weg-hier" aria-current="step"><span class="n">Schritt ' + (j + 1) + '</span><b>' + s.name + '</b><span class="t">Du bist hier</span></span></li>'
    : '<li><a href="' + s.seiten[0] + '"><span class="n">Schritt ' + (j + 1) + '</span><b>' + s.name + '</b><span class="t">' + s.text + '</span></a></li>')).join('');
  const naechster = WEG[i + 1];
  /* Bild: die Zeichnung der Seite, zu der es geht; am Ende des Wegs das Aufmaßblatt, das in der App entsteht */
  const b = bildVon(zeichnungen, naechster ? naechster.seiten[0] : '/ratgeber/aufmassblatt-fenster/');
  /* das Blatt tritt aus der Karte; Zeichnungen mit Beträgen tragen groß „Beispiel“; der Linkname ist Etikett und Titel, nicht der
     lange Alternativtext */
  const zeichnung = b ? '<span class="rg-weiter-blatt">' + bild(b, 'rg-weiter-bild') + (b.beispiel ? '<span class="rg-beispiel" aria-hidden="true">Beispiel</span>' : '') + '</span>' : '';
  const auf = (href) => '<a class="rg-karte rg-weiter" href="' + href + '" aria-labelledby="rg-weiter-etikett rg-weiter-titel">' + zeichnung + '<span class="rg-weiter-text">';
  const weiter = naechster
    ? auf(naechster.seiten[0]) + '<span class="eyebrow" id="rg-weiter-etikett">Nächster Schritt · ' + (i + 2) + ' von ' + WEG.length + ': ' + naechster.name + '</span><b id="rg-weiter-titel">' + name(naechster.seiten[0]) + '</b><span>' + karte(naechster.seiten[0]) + '</span></span></a>'
    : auf('/app/') + '<span class="eyebrow" id="rg-weiter-etikett">Alles geplant?</span><b id="rg-weiter-titel">Fenster ausmessen, kostenlos</b><span>Etwa fünf Minuten je Fenster; das Aufmaßblatt kann jeder Fensterbauer lesen.</span></span></a>';
  return '\n  <section class="rg-weg" aria-labelledby="weg"><h2 id="weg">Dein Weg zu neuen Fenstern</h2><ol class="rg-weg-liste">' + liste + '</ol>' + weiter + '</section>';
}

/* Eine Seite (nicht die Übersicht): Bausteine entfernen, ids setzen, Feinsatz, neu einsetzen, in Szenen ordnen, Fußzeile */
export function baue(pfad, html, zeichnungen) {
  let h = pfeil(zweiteStimme(kicker(html.replace(INHALT, '').replace(WEGBLOCK, '').replace(PREIS_RAUS, ''))));
  const MAIN = /<main class="rg"[^>]*>[\s\S]*<\/main>/;
  if (!MAIN.test(h)) return h.replace(FUSS, () => fusszeile(pfad));
  h = kopf(h);
  let main = ohneHuellen(h.match(MAIN)[0]);
  const vergeben = new Set([...main.matchAll(/ id="([^"]+)"/g)].map((x) => x[1]));
  main = main.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (alles, attr, inhalt) => {
    if (attr && /\sid="/.test(attr)) return alles;
    let id = slug(inhalt), n = 2; while (vergeben.has(id)) id = slug(inhalt) + '-' + n++;
    vergeben.add(id);
    return '<h2' + (attr || '') + ' id="' + id + '">' + inhalt + '</h2>';
  });
  main = symbole(belege(fehler(feinsatz(tabellen(main)))));
  const abschnitte = [...main.matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].filter((x) => !OHNE_INHALT.includes(x[2].trim()));
  const imWeg = schrittVon(pfad) >= 0;
  if (imWeg) main = main.replace(/(\n\s*)<h2([^>]*)>Weiterlesen<\/h2>/, (x) => wegBlock(pfad, zeichnungen) + x);

  /* Szenen: Einstieg bis zum ersten Knopfblock (und der Zeichnung direkt dahinter), Lesen bis vor die Häufigen Fragen, Ende */
  const auf = main.match(/^<main class="rg"[^>]*>/)[0];
  let rest = main.slice(auf.length, -'</main>'.length);
  const cta = rest.match(/<div class="rg-cta">[\s\S]*?<\/div>/);
  if (!cta) return zumInhalt(h, false).replace(MAIN, () => auf + rest + '</main>').replace(FUSS, () => fusszeile(pfad));
  /* im Weg (Hauseigentümer): was es kostet, direkt unter der ersten Pille */
  const ctaEnde = cta.index + cta[0].length + (imWeg ? PREIS.length : 0);
  if (imWeg) rest = rest.slice(0, cta.index + cta[0].length) + PREIS + rest.slice(cta.index + cta[0].length);
  const fig = rest.slice(ctaEnde).match(/^\s*<figure class="rg-bild">[\s\S]*?<\/figure>/);
  const heroEnde = ctaEnde + (fig ? fig[0].length : 0);
  const einstieg = rest.slice(0, ctaEnde) + HUELLE.heroTextZu + (fig ? fig[0] : '') + HUELLE.heroZu;
  rest = rest.slice(heroEnde);
  const endeBei = ['\n  <h2 id="haeufige-fragen">', '\n  <section class="rg-weg"', '\n  <h2 id="weiterlesen">'].map((x) => rest.indexOf(x)).filter((x) => x >= 0);
  const e = endeBei.length ? Math.min(...endeBei) : rest.length;
  const lesen = rest.slice(0, e), ende = rest.slice(e).replace(/\s*$/, '');
  const zahl = (lesen.match(/<h2[\s>]/g) || []).length;
  /* Auf dieser Seite: die Abschnitte des Lesens nummeriert wie „Abschnitt N von M“, danach Fragen und Weg ohne Nummer; der Text des
     Eintrags in einer eigenen Spanne, damit eine Tiefstellung (Uw) in der Zeile bleibt */
  const imLesen = new Set([...lesen.matchAll(/<h2[^>]*\sid="([^"]+)"/g)].map((x) => x[1]));
  const eintraege = abschnitte.map((x) => '<li' + (imLesen.has(x[1]) ? '' : ' class="rg-mehr"') + '><a href="#' + x[1] + '"><span>' + x[2].trim() + '</span></a></li>')
    .concat(imWeg ? ['<li class="rg-mehr"><a href="#weg"><span>Dein Weg: Schritt ' + (schrittVon(pfad) + 1) + ' von ' + WEG.length + '</span></a></li>'] : []);
  const inhalt = '\n  <nav class="rg-inhalt" id="auf-dieser-seite" aria-label="Auf dieser Seite"><p class="eyebrow">Auf dieser Seite · ' + lesezeit(main) + ' Min. Lesezeit</p><ol>' + eintraege.join('') + '</ol></nav>';
  const ohneInhalt = OHNE_INHALTSVERZEICHNIS.includes(pfad);
  main = auf + HUELLE.heroAuf + einstieg + HUELLE.textAuf + (ohneInhalt ? '' : inhalt) + HUELLE.flussAuf(zahl) + lesen.replace(/\s*$/, '') + HUELLE.flussZu + HUELLE.textZu +
    (ende ? HUELLE.endeAuf + ende + HUELLE.endeZu : '') + '\n</main>';
  return zumInhalt(h, !ohneInhalt).replace(MAIN, () => main).replace(FUSS, () => fusszeile(pfad));
}

/* Übersicht /ratgeber/: Stationen im Einstieg, je Schritt die Zahl und die Seiten mit ihrer Zeichnung (helle Szene), für
   Fensterbauer und „Selbst messen“ im dunklen Ende; strukturierte Daten aus den h1 der Seiten */
export function uebersicht(html, h1Von, zeichnungen) {
  const karten = (liste, mitBild) => '<div class="rg-karten' + (mitBild ? ' rg-karten--bild' : '') + '">' + liste.map((p) => {
    const b = mitBild ? bildVon(zeichnungen, p) : null;
    /* Kleinbild ohne Schrift und mit kräftigen Strichen (web/bilder/klein/, python3 scripts/zeichnungen-dna.py) */
    return '<a class="rg-karte" href="' + p + '">' + (b ? '<img src="' + b.src.replace(/^\/bilder\//, '/bilder/klein/') + '" width="' + b.w + '" height="' + b.h + '" alt="" decoding="async">' : '') + '<b>' + name(p) + '</b><span>' + karte(p) + '</span></a>';
  }).join('') + '</div>';
  const stationen = '\n  <nav class="rg-wegkarte" aria-label="Die sechs Schritte"><p class="eyebrow">In&nbsp;sechs Schritten</p><ol class="rg-weg-liste">' + WEG.map((s, j) => '<li><a href="#schritt-' + (j + 1) + '"><span class="n">Schritt ' + (j + 1) + '</span><b>' + s.name + '</b><span class="t">' + s.text + '</span></a></li>').join('') + '</ol></nav>';
  const teile = WEG.map((s, j) => '\n  <section class="rg-schritt" aria-labelledby="schritt-' + (j + 1) + '"><div class="rg-schritt__kopf"><p class="rg-schritt__nr"><span class="rg-sr">Schritt </span>' + (j + 1) + '<span class="rg-einheit">&nbsp;von ' + WEG.length + '</span></p><h2 id="schritt-' + (j + 1) + '">' + s.name + '</h2><p class="rg-klein">' + s.text + '</p></div>' + karten(s.seiten, true) + '</section>');
  /* im Einstieg dieselben zwei Wege wie am Ende der Übersicht („Selbst messen“): die eine volle Pille je Bildschirm */
  const cta = '\n  <div class="rg-cta"><a class="btn primary" href="/app/">Fenster ausmessen, kostenlos<span class="pf" aria-hidden="true"></span></a><a class="btn ghost" href="/app/#fuehrung">Führung in zwei Minuten</a></div>';
  const weg = '<!-- weg -->' + cta + PREIS + HUELLE.heroTextZu + stationen + HUELLE.heroZu + HUELLE.textAuf + teile.join('') + HUELLE.textZu + HUELLE.endeAuf +
    '\n  <h2 id="fuer-fensterbauer">Für Fensterbauer</h2>\n  ' + karten(FENSTERBAUER) + '\n  <!-- /weg -->';
  const hasPart = '"hasPart":[\n' + WEG.flatMap((s) => s.seiten).concat(FENSTERBAUER.slice(1)).map((p) => '{"@type":"Article","headline":' + JSON.stringify(h1Von(p)) + ',"url":"' + p + '"}').join(',\n') + ']}';
  let h = kopf(zweiteStimme(kicker(html)));
  const auf = h.match(/<main class="rg"[^>]*>/)[0];
  h = h.replace(/<main class="rg"[^>]*>[\s\S]*<\/main>/, (main) => {
    let innen = ohneHuellen(main).slice(auf.length, -'</main>'.length).replace(/<!-- weg -->[\s\S]*?<!-- \/weg -->/, () => weg).replace(/\s*$/, '');
    return auf + HUELLE.heroAuf + innen + HUELLE.endeZu + '\n</main>';
  });
  return h.replace(/"hasPart":\[[\s\S]*?\]\}(?=,\n\{"@type":"BreadcrumbList")/, () => hasPart);
}

/* Alle Seiten unter web/ratgeber/ und web/fuer-fensterbauer/ */
export function seiten(web) {
  const raus = [];
  const such = (d, rel) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) such(path.join(d, e.name), rel + e.name + '/'); else if (e.name === 'index.html') raus.push([rel, path.join(d, e.name)]); } };
  for (const o of ['ratgeber', 'fuer-fensterbauer']) such(path.join(web, o), '/' + o + '/');
  return raus;
}
/* Die Zeichnung jeder Seite aus ihrer Abbildung im Einstieg (Quelle, Maße, Alternativtext) */
export function zeichnungenVon(alle) {
  const z = {};
  for (const [p, d] of alle) {
    const f = fs.readFileSync(d, 'utf8').match(/<figure class="rg-bild"><img ([^>]*)>/);
    if (!f) continue;
    const a = (k) => (f[1].match(new RegExp(k + '="([^"]*)"')) || [])[1];
    const datei = a('src') ? path.join(path.dirname(d).replace(/[\\/](ratgeber|fuer-fensterbauer)([\\/].*)?$/, ''), a('src')) : '';
    if (a('src')) z[p] = { src: a('src'), w: a('width'), h: a('height'), alt: a('alt'), beispiel: fs.existsSync(datei) && /\(Beispiel\)/.test(fs.readFileSync(datei, 'utf8')) };
  }
  return z;
}
/* Was die Seite nach dem Bauen enthalten muss (für die Prüfsuite und den Lauf unten) */
export function gebaut(web) {
  const alle = seiten(web), h1 = {}, z = zeichnungenVon(alle);
  for (const [p, d] of alle) h1[p] = ((fs.readFileSync(d, 'utf8').match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/<[^>]+>/g, '');
  return alle.map(([p, d]) => { const alt = fs.readFileSync(d, 'utf8'); return [p, d, alt, p === '/ratgeber/' ? uebersicht(alt, (x) => h1[x], z).replace(FUSS, () => fusszeile(p)) : baue(p, alt, z)]; });
}

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  const web = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', 'web');
  const fehlt = WEG.flatMap((s) => s.seiten).concat(FENSTERBAUER).filter((p) => !fs.existsSync(path.join(web, p, 'index.html')));
  if (fehlt.length) console.error('Seite fehlt (noch): ' + fehlt.join(', '));
  let n = 0;
  for (const [, d, alt, neu] of gebaut(web)) if (neu !== alt) { fs.writeFileSync(d, neu); n++; }
  console.log('Bausteine in ' + n + ' Dateien neu geschrieben');
}

#!/usr/bin/env python3
"""Baut aus den drei Paket-Vorlagen (docs/profis/{essential,plus,signature}-vorschau) eine Familie je Beispielbetrieb.

Aufruf:  python3 docs/profis/werkzeuge/paketvorlagen.py brandt      (Fensterbau Brandt, Köln, Palette des Betriebs nach Stufen)
         python3 docs/profis/werkzeuge/paketvorlagen.py ostermann   (Fenster Ostermann, Bremen, eigene Palette; seit 27.10.2026 nicht gepflegt)
         python3 docs/profis/werkzeuge/paketvorlagen.py brandt --web
                  schreibt die drei Seiten für die Website nach web/vorschau/paket-beispiel/ (verlinkt aus dem Paketvergleich der Seite für
                  Fensterbauer): ohne Inline-Skript (CSP, /assets/js-da.js), mit noindex, Titel je Paket, index.html leitet auf Plus.
Ergebnis: docs/profis/paketvorlagen/<betrieb>/ mit essential.html, plus.html, signature.html (volle Seiten, verlinken sich über
die Muster-Leiste), index-<paket>.html (dieselbe Seite ohne Dokumentgerüst, als Hauptseite eines Artifacts), <paket>.css/.js,
muster.css, dna/, fonts/, bilder/.

Preise kommen aus web/assets/pakete.js (die einzige Stelle für Preise); in den Vorlagen stehen sie zwischen <!--preis:<paket>-->
und <!--/preis:<paket>-->. Daten und Farben des Betriebs stehen unten in BETRIEBE. Essential bekommt laut Paket keine
Firmenfarbe und kein Logo (eeziframes-Design mit dem Namen); die Palette des Betriebs gilt in Plus und Signature.
"""
import json, re, shutil, subprocess, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]
PAKETE = ['essential', 'plus', 'signature']
QUELLE = {p: ROOT / 'docs' / 'profis' / f'{p}-vorschau' for p in PAKETE}
HUELLE = ('<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
          '<style>:root{box-sizing:border-box}body{margin:0;padding:0;background:#07090a}img{max-width:100%}[hidden]{display:none!important}</style></head><body>')

# Marke Brandt (Zeichen ohne Kachel) und App-Symbol (mit Kachel), wie in den Vorlagen
BRANDT_MARKE = '<rect x="4" y="4" width="24" height="56" rx="5" fill="var(--firma)"/><rect x="36" y="4" width="24" height="24" rx="5" fill="var(--firma)"/><rect x="36" y="36" width="24" height="24" rx="5" fill="var(--firma)"/>'
APP = re.compile(r'(<rect width="64" height="64" rx="16" fill="var\(--firma\)"/>)(<rect x="14" y="14"[^>]*/><rect [^>]*/><rect [^>]*/>)')

BETRIEBE = {
    'brandt': {'ersetzen': [], 'palette': None, 'marke': None, 'app': None,
               # Palette des Betriebs (Vorgabe des Inhabers, 27.10.2026): Signature ganz, Plus zur Hälfte, Essential bleibt eeziframes
               'farben': {'datei': 'farben-brandt.css', 'stufen': {'plus': 'halb', 'signature': 'voll'}}},
    'ostermann': {
        # Palette des Betriebs: Petrol als Hauptfarbe, Tiefsee als Schatten, Gischt als Licht, Leuchtturmrot als Hinweis.
        # Der Grund bleibt Schwarz und Weiß (DNA: eine Markenfarbe ersetzt Leuchten und Signal, nie den Grund).
        'palette': '.ez { --firma: #2fa792; --firma-tief: #134540; --auf-firma: #07090a; --firma-licht: #62d1bc; --hinweis: #e8574a; }',
        # Zeichen: ein Bogenfenster mit Kämpfer und Pfosten
        'marke': '<path d="M8 60V30a24 24 0 0 1 48 0v30z" fill="var(--firma)"/><rect x="30" y="6" width="4" height="56" fill="#07090a"/><rect x="6" y="34" width="52" height="4" fill="#07090a"/>',
        'app': '<path d="M17 52V31a15 15 0 0 1 30 0v21z" fill="#07090a"/><rect x="30.6" y="14" width="2.8" height="40" fill="var(--firma)"/><rect x="15" y="34.6" width="34" height="2.8" fill="var(--firma)"/>',
        'ersetzen': [
            ('Neue Fenster, <em class="ez-ak">gut geplant.</em>', 'Moin, <em class="ez-ak">neue Fenster?</em>'),
            ('Fenster, Türen und Montage <em class="ez-ak">aus einer Hand.</em>', 'Fenster und Haustüren, <em class="ez-ak">vom Aufmaß bis zum Einbau.</em>'),
            ('Fensterbau Brandt GmbH', 'Fenster Ostermann GmbH'),
            ('Petra Brandt', 'Jonas Ostermann'),
            ('>PB<', '>JO<'),
            ('<b>Brandt</b><small>Fensterbau · Köln</small>', '<b>Ostermann</b><small>Fenster + Türen · Bremen</small>'),
            ('<b id="kontakt-karte">Brandt</b><small>Fensterbau · <span data-vorlage="firma.ort">Köln</span></small>', '<b id="kontakt-karte">Ostermann</b><small>Fenster + Türen · <span data-vorlage="firma.ort">Bremen</span></small>'),
            ('Fensterbau Brandt', 'Fenster Ostermann'),
            ('<b>fensterbau-brandt</b>.eeziframes.com', '<b>fenster-ostermann</b>.eeziframes.com'),  # Essential: Firmenname bei eeziframes
            ('fensterbau-brandt', 'ostermann-fenster'),
            ('Musterstraße&nbsp;12, 50667&nbsp;Köln', 'Am Deich&nbsp;7, 28199&nbsp;Bremen'),
            ('Musterstraße 12, 50667 Köln', 'Am Deich 7, 28199 Bremen'),
            ('Musterstraße&nbsp;12<br>50667&nbsp;Köln', 'Am Deich&nbsp;7<br>28199&nbsp;Bremen'),
            ('0221&nbsp;123456', '0421&nbsp;456789'), ('0221 123456', '0421 456789'),
            ('Köln und Umgebung', 'Bremen und umzu'),
            ('Köln', 'Bremen'),
            ('Familie Weber', 'Familie Hansen'),
            ('Geschäftsführung', 'Inhaber'),
            ('>B<', '>O<'),
            ('Brandt', 'Ostermann'),
        ],
    },
}


def eur(n):
    return '{:,}'.format(n).replace(',', '.') + '\u00a0€'


def preise():
    js = "const P=require(process.argv[1]);process.stdout.write(JSON.stringify({l:P.liste(),v:P.VORLAEUFIG}))"
    out = subprocess.run(['node', '-e', js, str(ROOT / 'web' / 'assets' / 'pakete.js')], capture_output=True, text=True, check=True).stdout
    d = json.loads(out)
    monat = {x['paket']: eur(x['preis']['monat']) for x in d['l']}
    zeile = {x['paket']: '%s im Monat · %s einmalig · im ersten Jahr %s · netto%s' % (
        eur(x['preis']['monat']), eur(x['preis']['einrichtung']), eur(12 * x['preis']['monat'] + x['preis']['einrichtung']),
        ', vorläufig' if d['v'] else '') for x in d['l']}
    return monat, zeile, d['v']


TITEL_WEB = {'essential': 'EEZI Essential', 'plus': 'EEZI Essential Plus', 'signature': 'EEZI Signature'}


def fuer_web(html, p):
    """Seite für web/vorschau/paket-beispiel/: CSP der Website (kein Inline-Skript), noindex, eigener Titel; sonst wie die Vorlage."""
    alt = '<script>document.documentElement.classList.add("ez-js");</script>'
    assert html.count(alt) == 1, p
    html = html.replace(alt, '<script src="/assets/js-da.js"></script>')
    html = html.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
    html = re.sub(r'<title>[^<]*</title>', '<title>Beispiel %s: Fensterbau Brandt, ein erfundener Betrieb · eeziframes</title>' % TITEL_WEB[p], html, count=1)
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex, nofollow">', 1)
    assert '<script>' not in html and 'noindex' in html, p
    return html


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else 'brandt'
    web = '--web' in sys.argv
    b = BETRIEBE[name]
    ziel = (ROOT / 'web' / 'vorschau' / 'paket-beispiel') if web else (ROOT / 'docs' / 'profis' / 'paketvorlagen' / name)
    if ziel.exists():
        shutil.rmtree(ziel)
    ziel.mkdir(parents=True)
    pr, zeilen, vorlaeufig = preise()
    for p in PAKETE:
        q = QUELLE[p]
        for ordner in ('dna', 'fonts', 'bilder'):
            shutil.copytree(q / ordner, ziel / ordner, dirs_exist_ok=True)
        html = (q / 'index.html').read_text(encoding='utf-8')
        css = (q / 'start.css').read_text(encoding='utf-8')
        js = (q / 'start.js').read_text(encoding='utf-8')
        for k, v in pr.items():
            html = re.sub(r'<!--preis:%s-->.*?<!--/preis:%s-->' % (k, k), '<!--preis:%s-->%s<!--/preis:%s-->' % (k, v, k), html)
            html = re.sub(r'<!--preiszeile:%s-->.*?<!--/preiszeile:%s-->' % (k, k), '<!--preiszeile:%s-->%s<!--/preiszeile:%s-->' % (k, zeilen[k], k), html)
        if vorlaeufig:
            html = html.replace('data-preise="fest"', 'data-preise="vorlaeufig"')
        if p != 'essential':
            if b['palette']:
                html = re.sub(r'\.ez \{ --firma: [^}]*\}', b['palette'], html, count=1)
            if b['marke']:
                html = html.replace(BRANDT_MARKE, b['marke'])
            if b['app']:
                html = APP.sub(lambda m: m.group(1) + b['app'], html)
        for alt, neu in b['ersetzen']:
            html = html.replace(alt, neu)
        stufe = (b.get('farben') or {}).get('stufen', {}).get(p)
        if stufe:
            html = html.replace('<main class="dna-wurzel ez" ', '<main class="dna-wurzel ez" data-farbe="%s" ' % stufe, 1)
            html = html.replace('<link rel="stylesheet" href="muster.css">', '<link rel="stylesheet" href="muster.css">\n<link rel="stylesheet" href="farben.css">', 1)
            assert 'data-farbe=' in html and 'href="farben.css"' in html, p
            if stufe == 'voll':
                # ganze Seite in der Palette: Hero und „So geht es“ werden helle Szenen (Eisblau), dunkel bleiben Kontakt und Fuß
                n0 = html.count('data-theme="hell"')
                html = re.sub(r'<section class="dna-szene" data-theme="dunkel"( aria-label="Willkommen| id="so")', r'<section class="dna-szene" data-theme="hell"\1', html)
                assert html.count('data-theme="hell"') == n0 + 2, p
        html = html.replace('href="start.css"', 'href="%s.css"' % p).replace('src="start.js"', 'src="%s.js"' % p)
        (ziel / f'{p}.css').write_text(css, encoding='utf-8')
        (ziel / f'{p}.js').write_text(js, encoding='utf-8')
        if web:
            (ziel / f'{p}.html').write_text(fuer_web(HUELLE + html + '</body></html>', p), encoding='utf-8')
        else:
            (ziel / f'index-{p}.html').write_text(html, encoding='utf-8')
            (ziel / f'{p}.html').write_text(HUELLE + html + '</body></html>', encoding='utf-8')
    shutil.copy(ROOT / 'docs' / 'profis' / 'werkzeuge' / 'muster-leiste.css', ziel / 'muster.css')
    shutil.copy(ROOT / 'docs' / 'profis' / 'werkzeuge' / 'muster-leiste.js', ziel / 'muster.js')
    if b.get('farben'):
        shutil.copy(ROOT / 'docs' / 'profis' / 'werkzeuge' / b['farben']['datei'], ziel / 'farben.css')
    if web:
        (ziel / 'index.html').write_text('<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow">'
            '<meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url=plus.html">'
            '<title>Beispiel: Fensterbau Brandt in drei Paketen · eeziframes</title><style>html,body{background:#07090a;color:#fff;font-family:system-ui,sans-serif}</style></head>'
            '<body><p><a href="plus.html" style="color:#fff">Zum Beispiel Fensterbau Brandt</a></p></body></html>\n', encoding='utf-8')
    print('gebaut:', ziel.relative_to(ROOT), '·', ', '.join('%s %s' % (k, v) for k, v in pr.items()))


if __name__ == '__main__':
    main()

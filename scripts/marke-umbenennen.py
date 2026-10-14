#!/usr/bin/env python3
"""Marke umbenennen: ersetzt den sichtbaren Namen in Website, KI-Funktion, Doku und Hilfsskripten.

    python3 scripts/marke-umbenennen.py NeuerName

Den bisherigen Namen liest das Skript aus web/config.js (marke: '…'), es lässt sich also
mehrfach verwenden. Interne Namen sind markenneutral und bleiben gleich (Browser-Speicher „aufmass.…“,
Code-Kürzel AM1, Variablen wie KONFIG), damit gespeicherte Daten und Codes gültig bleiben.
Danach: Änderungen prüfen (git diff), committen, pushen; Cloudflare veröffentlicht automatisch.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
if len(sys.argv) != 2 or not sys.argv[1].strip():
    sys.exit('Aufruf: python3 scripts/marke-umbenennen.py NeuerName')
neu = sys.argv[1].strip()
if any(c in neu for c in '\'"<>\\'):
    sys.exit('Der Name darf keine Anführungszeichen, spitzen Klammern oder Backslashes enthalten.')

m = re.search(r"marke:\s*'([^']+)'", (ROOT / 'web/config.js').read_text(encoding='utf-8'))
if not m:
    sys.exit('Bisheriger Name in web/config.js nicht gefunden (marke: \'…\').')
alt = m.group(1)
if alt == neu:
    sys.exit('Der Name ist schon ' + neu + '.')

muster = re.compile(r'(?<!\w)' + re.escape(alt) + r'(?!\w)')
ziele = [ROOT / 'README.md'] + [p for d in ('web', 'functions', 'docs', 'scripts') for p in (ROOT / d).rglob('*')
                                if p.suffix in ('.html', '.js', '.mjs', '.css', '.md', '.txt') and 'vendor' not in p.parts and 'fonts' not in p.parts]
geaendert = 0
for p in ziele:
    if not p.is_file():
        continue
    text = p.read_text(encoding='utf-8')
    neu_text, n = muster.subn(neu, text)
    if n:
        p.write_text(neu_text, encoding='utf-8')
        geaendert += 1
        print('%4d× %s' % (n, p.relative_to(ROOT)))
print('Fertig: „%s“ heißt jetzt „%s“ (%d Dateien).' % (alt, neu, geaendert))
print('Hinweis: Domain-Angaben (z. B. klopfan.de) in der Doku und der Spruch in web/config.js bitte selbst anpassen.')

#!/usr/bin/env python3
"""Zeichnungen der Ratgeber (web/bilder/*.svg) in die Druckpalette der Design-DNA bringen, wie das Aufmaßblatt seit 27.10.2026
(web/assets/blatt.js): weißes Papier, Schrift Schwarz, Rahmen Anthrazit, Fenster und Element Violett, Maueröffnung und Hinweise
Koralle, Glas und Wand in Tönen von Silbergrau. Koralle als Schrift nur im dunklen Ton (#b4502f, 5:1 auf Weiß), Violett als
Schrift nur als Indigo (Violett ist auf Weiß zu schwach). Neue Farben gibt es nicht, nur Töne der acht.

Seit dem Gremium vom 28.10.2026 (docs/profis/2026-10-28-ratgeber-dna.md) außerdem:
- Schrift: Ein SVG als <img> kann die Schriften der Seite nicht laden, die Beschriftung erschien in Arial. Jede Zeichnung trägt
  deshalb ihre eigene Teilmenge von Outfit (nur ihre Zeichen, je Gewicht, als data:-Adresse in <style id="schrift">; mit der CSP
  der Website geprüft). Outfit steht unter der SIL Open Font License 1.1 (web/fonts/OFL-Outfit.txt).
- Kleinbilder: web/bilder/klein/<name>.svg für die Zeilen der Übersicht (96 px breit): ohne Schrift, ohne gestrichelte Linien und
  Pfeilspitzen, Striche 2,2-mal so kräftig, damit es ein klares Bild bleibt statt grauem Brei.
Braucht fontTools und brotli (pip install fonttools brotli).

Aufruf: python3 scripts/zeichnungen-dna.py        (schreibt die Dateien neu; ein zweiter Lauf ändert nichts)
        python3 scripts/zeichnungen-dna.py --pruefen  (meldet nur, welche Datei noch alte Farben trägt)
"""
import base64
import html
import io
import pathlib
import re
import sys

BILDER = pathlib.Path(__file__).resolve().parent.parent / 'web' / 'bilder'
OUTFIT = BILDER.parent / 'fonts' / 'outfit.woff2'

# alte Zeichnungsfarbe → Ton der DNA (Flächen und Linien)
FLAECHE = {
    '#1d4ed8': '#897efc',  # Fenster, Element: Violett
    '#c2410c': '#f88962',  # Maueröffnung, Maße, Hinweis: Koralle
    '#141414': '#07090a',  # Schrift, Fußboden: Schwarz
    '#3d3d3a': '#202022',  # Rahmen: Anthrazit
    '#5c5c58': '#6b676c',  # Nebentext: Textgrau
    '#6b7280': '#6b676c',
    '#a8a79f': '#a8a4a9',  # Fensterbank, Kanten: Silbergrau
    '#b9bcc2': '#c4c1c5',
    '#c9c8c2': '#c4c1c5',
    '#c9ccd1': '#c4c1c5',
    '#cfcdc4': '#d2d0d3',
    '#d4d2ca': '#d2d0d3',
    '#d6d4cc': '#d2d0d3',
    '#d6d5cf': '#d2d0d3',
    '#dceaf7': '#eceef1',  # Glas: heller Ton (wie GLASS im Aufmaßblatt)
    '#f4f8fd': '#f5f6f8',
    '#e1e0da': '#e6e5e7',
    '#e2e0d8': '#e6e5e7',
    '#e7e2d6': '#e6e5e7',
    '#ecebe6': '#ecebec',  # Wand, Laibung: heller Ton von Silbergrau
    '#efe4d2': '#efeeef',
    '#f3f2ee': '#f3f3f4',
    '#f6f5f1': '#f6f6f7',
    '#f6e3a1': '#fde3d8',  # Dämmschaum: heller Ton von Koralle
}
# Schrift: Koralle und Violett sind auf Weiß als Text zu schwach
SCHRIFT = {'#c2410c': '#b4502f', '#1d4ed8': '#3c3a66'}
ALT_SCHRIFT = '"Helvetica Neue, Arial, sans-serif"'
NEU_SCHRIFT = '"Outfit, Helvetica Neue, Arial, sans-serif"'


def umfaerben(svg: str) -> str:
    # 1. Schriftfarben an <text> und an Gruppen, die nur Schrift tragen (font-family im selben Tag)
    def tag(m):
        t = m.group(0)
        if t.startswith('<text') or 'font-family' in t:
            for alt, neu in SCHRIFT.items():
                t = re.sub(r'fill="' + alt + '"', 'fill="' + neu + '"', t, flags=re.I)
        return t
    svg = re.sub(r'<(?:text|g)\b[^>]*>', tag, svg)
    # 2. alle übrigen Farben
    for alt, neu in FLAECHE.items():
        svg = re.sub(re.escape(alt), neu, svg, flags=re.I)
    svg = svg.replace('font-family=' + ALT_SCHRIFT, 'font-family=' + NEU_SCHRIFT)
    # 3. Ziffern auf Violett und Koralle schwarz (DNA, Abschnitt 8: Weiß ist dort zu schwach): der Kreis steht direkt vor der Ziffer,
    #    oder eine Gruppe mit weißer Schrift trägt nur Ziffern auf Kreisen in Koralle (fenster-undicht)
    svg = re.sub(r'(<circle [^>]*fill="#(?:897efc|f88962)"/>\s*<text [^>]*?)fill="#ffffff"', r'\1fill="#07090a"', svg)
    svg = re.sub(r'(<g [^>]*font-weight="700" )fill="#ffffff"( text-anchor="middle">\s*<circle [^>]*fill="#f88962")', r'\1fill="#07090a"\2', svg)
    return svg


def schrift(svg: str) -> str:
    """Outfit als Teilmenge mit genau den Zeichen der Zeichnung, je Gewicht (400 und 700; 800 zeichnet mit 700, Outfit reicht bis 700)"""
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    svg = re.sub(r'<style id="schrift">[\s\S]*?</style>', '', svg)
    texte = ''.join(re.findall(r'<text\b[^>]*>([\s\S]*?)</text>', svg))
    zeichen = ''.join(sorted(set(html.unescape(re.sub(r'<[^>]+>', '', texte)))))
    if not zeichen.strip():
        return svg
    gewichte = sorted({400} | {min(700, int(x)) for x in re.findall(r'font-weight="(\d+)"', svg)})
    regeln = ''
    for i, w in enumerate(gewichte):
        o = subset.Options()
        o.flavor = 'woff2'
        o.layout_features = ['kern']
        o.name_IDs = []
        f = TTFont(OUTFIT, recalcTimestamp=False)
        sub = subset.Subsetter(o)
        sub.populate(text=zeichen)
        sub.subset(f)
        f = instancer.instantiateVariableFont(f, {'wght': w})
        f.flavor = 'woff2'
        f.recalcTimestamp = False  # sonst trägt jede Datei die Uhrzeit des Laufs und ändert sich bei jedem Lauf
        b = io.BytesIO()
        f.save(b)
        bereich = '%d %d' % (w, 900 if i == len(gewichte) - 1 else gewichte[i + 1] - 1)
        regeln += '@font-face{font-family:"Outfit";font-weight:%s;src:url(data:font/woff2;base64,%s) format("woff2")}' % (bereich, base64.b64encode(b.getvalue()).decode())
    return re.sub(r'(<svg\b[^>]*>)', lambda m: m.group(1) + '<style id="schrift">' + regeln + '</style>', svg, count=1)


def klein(svg: str) -> str:
    """Kleinbild für die Übersicht: ohne Schrift, gestrichelte Linien und Pfeilspitzen, Striche 2,2-mal so kräftig"""
    svg = re.sub(r'<style id="schrift">[\s\S]*?</style>|<title[^>]*>[\s\S]*?</title>|<desc[^>]*>[\s\S]*?</desc>', '', svg)
    svg = re.sub(r'\s(?:role|aria-labelledby)="[^"]*"', '', svg)
    svg = re.sub(r'<text\b[\s\S]*?</text>', '', svg)
    svg = re.sub(r'<(?:line|path|polyline)\b[^>]*stroke-dasharray[^>]*/>', '', svg)
    svg = re.sub(r'\smarker-(?:start|mid|end)="[^"]*"', '', svg)
    return re.sub(r'stroke-width="([\d.]+)"', lambda m: 'stroke-width="%g"' % round(float(m.group(1)) * 2.2, 1), svg)


def alte_farben(svg: str):
    return sorted({f.lower() for f in re.findall(r'#[0-9a-fA-F]{6}\b', svg)} & set(FLAECHE))


def main():
    pruefen = '--pruefen' in sys.argv
    offen, neu_geschrieben = [], 0
    (BILDER / 'klein').mkdir(exist_ok=True)
    for datei in sorted(BILDER.glob('*.svg')):
        alt = datei.read_text(encoding='utf-8')
        if pruefen:
            if alte_farben(alt):
                offen.append(datei.name)
            continue
        neu = schrift(umfaerben(alt))
        if neu != alt:
            datei.write_text(neu, encoding='utf-8')
            neu_geschrieben += 1
        kl = BILDER / 'klein' / datei.name
        if not kl.exists() or kl.read_text(encoding='utf-8') != klein(neu):
            kl.write_text(klein(neu), encoding='utf-8')
            neu_geschrieben += 1
    if pruefen:
        print('alte Farben in: ' + (', '.join(offen) if offen else 'keiner Zeichnung'))
        sys.exit(1 if offen else 0)
    print(f'{neu_geschrieben} Zeichnungen neu geschrieben')


if __name__ == '__main__':
    main()

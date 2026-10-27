# eeziframes · Schrift für die PDFs (Aufmaßblatt, Paketbedingungen, Textblätter des Servers) erzeugen
#
# Design-DNA: Outfit für alles, die Wortmarke „eeziframes“ bleibt Inter (eezi 900, frames 500). jsPDF braucht feste TrueType-Schnitte,
# deshalb werden aus den variablen Schriften in web/fonts/ einzelne Gewichte gezogen (fontTools, Instanz) und auf Latin-1 und
# Satzzeichen verkleinert (Teilmenge); die Inter-Schnitte nur auf die Buchstaben der Wortmarke.
#
#   pip install fonttools brotli
#   python3 scripts/blatt-schrift.py          schreibt web/assets/blatt-schrift.js
#
# Nur ein Werkzeug zum Bauen; die Seite selbst lädt nichts von fremden Servern.
import base64, io, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(WURZEL, 'web', 'fonts')
ZIEL = os.path.join(WURZEL, 'web', 'assets', 'blatt-schrift.js')

ZEICHEN = ''.join(chr(c) for c in list(range(0x20, 0x7f)) + list(range(0xa0, 0x100))) + '–—‚‘’„“”•…€−‹›ẞ'


def eszett(f, gewicht):
    """Versal-Eszett (U+1E9E) für Outfit, das ihn nicht hat: aus Inter im selben Gewicht, auf die Versalhöhe von Outfit skaliert.
    So steht in Versalzeilen „MAẞE“ statt „MASSE“ (Gremium 27.10.2026)."""
    if 0x1E9E in f.getBestCmap():
        return
    q = instancer.instantiateVariableFont(TTFont(os.path.join(FONTS, 'inter-latin-ext-wght-normal.woff2')), {'wght': gewicht}, updateFontNames=False)
    quelle = q.getBestCmap()[0x1E9E]
    k = f['OS/2'].sCapHeight / q['OS/2'].sCapHeight
    stift = TTGlyphPen(None)
    q.getGlyphSet()[quelle].draw(TransformPen(stift, (k, 0, 0, k, 0, 0)))
    g = stift.glyph()
    name = 'uni1E9E'
    f['glyf'][name] = g
    g.recalcBounds(f['glyf'])
    f['hmtx'][name] = (round(q['hmtx'][quelle][0] * k), getattr(g, 'xMin', 0))
    f.setGlyphOrder(f.getGlyphOrder() + [name] if name not in f.getGlyphOrder() else f.getGlyphOrder())
    for t in f['cmap'].tables:
        if t.isUnicode():
            t.cmap[0x1E9E] = name


def schnitt(datei, gewicht, zeichen):
    f = TTFont(os.path.join(FONTS, datei))
    f = instancer.instantiateVariableFont(f, {'wght': gewicht}, updateFontNames=False)
    if 'outfit' in datei:
        eszett(f, gewicht)
    # eigene Namen je Schnitt, sonst heißen alle wie die Standardinstanz und ein PDF-Programm könnte sie verwechseln
    familie = (f['name'].getDebugName(16) or f['name'].getDebugName(1) or 'Schrift').replace(' Thin', '').strip()
    stil = {300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 800: 'ExtraBold', 900: 'Black'}.get(gewicht, str(gewicht))
    for nid, wert in ((1, familie + ' ' + stil), (2, 'Regular'), (4, familie + ' ' + stil), (6, (familie + '-' + stil).replace(' ', '')), (16, familie), (17, stil)):
        f['name'].setName(wert, nid, 3, 1, 0x409)
        f['name'].setName(wert, nid, 1, 0, 0)
    opt = subset.Options()
    opt.layout_features = []  # jsPDF setzt ohne OpenType-Funktionen
    opt.name_IDs = ['*']
    opt.notdef_outline = True
    opt.flavor = None
    s = subset.Subsetter(options=opt)
    s.populate(text=zeichen)
    s.subset(f)
    f.flavor = None
    puffer = io.BytesIO()
    f.save(puffer)
    return base64.b64encode(puffer.getvalue()).decode('ascii')


def main():
    teile = {
        'duenn': schnitt('outfit.woff2', 300, ZEICHEN),     # große Zahlen
        'normal': schnitt('outfit.woff2', 400, ZEICHEN),    # Lesetext
        'mittel': schnitt('outfit.woff2', 500, ZEICHEN),    # Etiketten, Werte
        'halb': schnitt('outfit.woff2', 600, ZEICHEN),      # Überschriften, Codes
        'markeFett': schnitt('inter-latin-wght-normal.woff2', 900, 'eezi'),
        'markeNormal': schnitt('inter-latin-wght-normal.woff2', 500, 'frames')
    }
    kopf = ('/* eeziframes · Schrift für die PDFs (SIL Open Font License 1.1, siehe /fonts/OFL-Outfit.txt und /fonts/OFL.txt). Design-DNA:\n'
            '   Outfit in vier Schnitten (300 große Zahlen, 400 Lesetext, 500 Etiketten und Werte, 600 Überschriften und Codes), dazu die\n'
            '   Wortmarke in Inter (eezi 900, frames 500, nur deren Buchstaben). Feste TrueType-Schnitte aus den variablen Schriften in web/fonts,\n'
            '   auf Latin-1 und Satzzeichen verkleinert. Erzeugt mit scripts/blatt-schrift.py (fontTools); wird nur beim Erzeugen einer PDF geladen. */\n')
    js = kopf + "(typeof globalThis !== 'undefined' ? globalThis : window).BlattSchrift = {\n" + ',\n'.join("  %s: '%s'" % (k, v) for k, v in teile.items()) + '\n};\n'
    with open(ZIEL, 'w', encoding='utf-8') as f:
        f.write(js)
    print('geschrieben:', os.path.relpath(ZIEL, WURZEL), round(len(js) / 1024), 'KB')


if __name__ == '__main__':
    sys.exit(main())

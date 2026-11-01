#!/usr/bin/env python3
"""Teilmenge von Inter nur für die Wortmarke „eeziframes“ (web/fonts/inter-marke.woff2, etwa 2,3 KB statt 48 KB), Gewicht 500 bis 900.
Ratgeber, Rechtstexte und Fehlerseite laden nur diese Datei und Outfit (Gremium vom 28.10.2026, docs/profis/2026-10-28-ratgeber-dna.md).
Inter steht unter der SIL Open Font License 1.1 (web/fonts/OFL.txt); die Teilmenge bleibt unter derselben Lizenz.
Braucht fontTools und brotli (pip install fonttools brotli). Aufruf: python3 scripts/schrift-marke.py"""
import pathlib
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

FONTS = pathlib.Path(__file__).resolve().parent.parent / 'web' / 'fonts'
o = subset.Options()
o.flavor = 'woff2'
o.layout_features = ['kern']
t = TTFont(FONTS / 'inter-latin-wght-normal.woff2', recalcTimestamp=False)
s = subset.Subsetter(o)
s.populate(text='eeziframs')
s.subset(t)
t = instancer.instantiateVariableFont(t, {'wght': (500, 900)})
t.flavor = 'woff2'
t.recalcTimestamp = False
t.save(FONTS / 'inter-marke.woff2')
print('web/fonts/inter-marke.woff2', (FONTS / 'inter-marke.woff2').stat().st_size, 'Bytes')

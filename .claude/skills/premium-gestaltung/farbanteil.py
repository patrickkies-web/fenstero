"""Farbanteile eines Bildschirmfotos messen (Designrichtung, Abschnitte 2, 3.1 und 7).

Aufruf: python3 -I farbanteil.py bild.png [weitere.png ...]
Misst je Bild drei Anteile der Fläche:
  unbunt   Sättigung unter 15 % (Grund, Flächen, Text, Cream)
  farbig   Sättigung ab 25 % und Helligkeit über 40 % (auch unser zartes Grün #8fd694)
  kräftig  Sättigung über 45 % und Helligkeit über 40 % (Orange, Blau, satte Fototöne)
Richtwerte: unbunt mindestens 80 %, kräftig höchstens 5 %, farbig nicht null. Große Fotos und die eine Markengeste je Seite drücken den
unbunten Anteil; dort zählt, dass die Oberfläche selbst unbunt bleibt.
"""
import colorsys
import sys

from PIL import Image


def messen(pfad):
    bild = Image.open(pfad).convert('RGB')
    bild.thumbnail((400, 900))
    punkte = bild.get_flattened_data() if hasattr(bild, 'get_flattened_data') else bild.getdata()
    n = unbunt = farbig = kraeftig = 0
    eimer = {}
    for r, g, b in punkte:
        n += 1
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        if s < 0.15:
            unbunt += 1
        elif s >= 0.25 and v > 0.4:
            farbig += 1
            if s > 0.45:
                kraeftig += 1
            e = eimer.setdefault(int(h * 12) % 12, [0, 0, 0, 0])
            e[0] += 1
            e[1] += r
            e[2] += g
            e[3] += b
    toene = sorted(eimer.values(), key=lambda e: -e[0])[:3]
    liste = '  '.join('#%02x%02x%02x %.1f %%' % (e[1] // e[0], e[2] // e[0], e[3] // e[0], e[0] / n * 100) for e in toene)
    if kraeftig / n > 0.05:
        urteil = 'zu bunt, außer große Fotos oder die Markengeste'
    elif farbig / n < 0.003:
        urteil = 'ohne Akzent: fehlen Bild, Licht oder Signal?'
    elif unbunt / n < 0.8:
        urteil = 'Oberfläche im Rahmen, großes Foto im Bild'
    else:
        urteil = 'im Rahmen'
    print('%s: unbunt %.0f %%, farbig %.1f %%, kräftig %.1f %% (%s)  %s'
          % (pfad, unbunt / n * 100, farbig / n * 100, kraeftig / n * 100, urteil, liste))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for p in sys.argv[1:]:
        messen(p)

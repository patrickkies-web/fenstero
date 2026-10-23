"""Licht eines Bildes messen: Schwarzpunkt, Farbtemperatur der Spitzlichter, Schattenfarbe, Clipping (Designrichtung 3.4).

Aufruf: python3 -I bildlicht.py bild.png [weitere ...]
Für Fotos, Renderings und Standbilder aus Videos vor dem Einbau, nicht für Bildschirmfotos der Seite (dafür farbanteil.py).
Abgefilmte Bildschirme und stark komprimierte Bilder liefern nur Schätzungen.

Richtwerte (Rolle Fotograf, 23.10.2026):
  Schwarz   Luma p0,5 bei 18 bis 24, so dunkel wie der Grund #161616, und neutral (|a*| und |b*| bis 1,5)
  Licht     Spitzlichter 4800 bis 5800 K: warm-neutral, nie bläulich, nie orange
  Schatten  unbunt, C* der dunkelsten 20 % bis 8; ganzes Bild C* bis 20
  Hell      Luma p99 bis 242, damit die Schrift das Hellste bleibt; Clipping höchstens 1 %
"""
import sys

import numpy as np
from PIL import Image

M = np.array([[0.4124564, 0.3575761, 0.1804375],
              [0.2126729, 0.7151522, 0.0721750],
              [0.0193339, 0.1191920, 0.9503041]])
WEISS = np.array([0.95047, 1.0, 1.08883])
TT = np.arange(1500, 15001, 10.0)


def linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lab(xyz):
    t = xyz / WEISS
    d = 6 / 29
    f = np.where(t > d ** 3, np.cbrt(t), t / (3 * d * d) + 4 / 29)
    return 116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])


def planck_uv(t):
    u = (0.860117757 + 1.54118254e-4 * t + 1.28641212e-7 * t * t) / (1 + 8.42420235e-4 * t + 7.08145163e-7 * t * t)
    v = (0.317398726 + 4.22806245e-5 * t + 4.20481691e-8 * t * t) / (1 - 2.89741816e-5 * t + 1.61456053e-7 * t * t)
    return u, v


PU, PV = planck_uv(TT)


def kelvin(xyz):
    x, y, z = xyz
    s = x + 15 * y + 3 * z
    if s <= 0:
        return None
    return float(TT[int(np.argmin(np.hypot(PU - 4 * x / s, PV - 6 * y / s)))])


def messen(pfad):
    bild = Image.open(pfad).convert('RGB')
    bild.thumbnail((1200, 1200))
    a8 = np.asarray(bild).reshape(-1, 3).astype(np.float64)
    xyz = linear(a8 / 255) @ M.T
    l, a, b = lab(xyz)
    c = np.hypot(a, b)
    luma = a8 @ np.array([0.2126, 0.7152, 0.0722])
    geclippt = a8.max(1) >= 252
    mx, mn = a8.max(1), a8.min(1)
    satt = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-9), 0)

    schwarz = float(np.percentile(luma, 0.5))
    tief = luma <= np.percentile(luma, 1)
    schwarz_a, schwarz_b = float(a[tief].mean()), float(b[tief].mean())
    spitz = (l >= np.percentile(l, 95)) & (satt < 0.35) & ~geclippt
    if spitz.sum() < 30:
        spitz = (l >= np.percentile(l, 98)) & ~geclippt
    k = kelvin(xyz[spitz].mean(0)) if spitz.sum() >= 30 else None
    schatten = l <= np.percentile(l, 20)
    c_schatten, c_bild = float(c[schatten].mean()), float(c.mean())
    hell, clip = float(np.percentile(luma, 99)), float(geclippt.mean() * 100)

    maengel = []
    if not 18 <= schwarz <= 24:
        maengel.append('Schwarz %s' % ('zu tief' if schwarz < 18 else 'zu hell'))
    if max(abs(schwarz_a), abs(schwarz_b)) > 1.5:
        maengel.append('Schwarz farbig')
    if k is None:
        maengel.append('keine Spitzlichter')
    elif k < 4800:
        maengel.append('Licht zu warm')
    elif k > 5800:
        maengel.append('Licht zu kühl')
    if c_schatten > 8:
        maengel.append('Schatten farbig')
    if c_bild > 20:
        maengel.append('zu bunt')
    if hell > 242:
        maengel.append('Lichter heller als die Schrift')
    if clip > 1:
        maengel.append('ausgefressen')
    print('%s: Schwarz %.0f (a* %+.1f, b* %+.1f), Licht %s, Schatten C* %.1f, Bild C* %.1f, Luma p99 %.0f, Clipping %.1f %%  -> %s'
          % (pfad, schwarz, schwarz_a, schwarz_b, '%d K' % k if k else '–', c_schatten, c_bild, hell, clip,
             ', '.join(maengel) or 'im Rahmen'))


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for p in sys.argv[1:]:
        messen(p)

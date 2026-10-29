"""Farbanteile nach einer Betriebspalette. Jedes Pixel geht an die nächste Farbe (Lab, ΔE76) aus der Betriebspalette oder aus der
Palette von eeziframes; Magenta (#ff00ff) ist „Bild“, Kantenpixel (Sprung der Helligkeit über 10) sind Schriftkanten; beide zählen nicht mit. Ausgabe: Ist und Ziel je Farbe, dazu der Rest von eeziframes.
Aufruf: python3 -I palette.py "Reinweiß:#FFFFFF:40,Eisblau:#EEF7F9:25,..." bild1.png [bild2.png ...]"""
import sys
import numpy as np
from PIL import Image

EEZI = [('Schwarz', '#07090a'), ('Anthrazit', '#202022'), ('Silbergrau', '#a8a4a9'), ('Textgrau', '#6b676c'),
        ('Violett', '#897efc'), ('Koralle', '#f88962'), ('Indigo', '#3c3a66')]

def hex2rgb(h):
    h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]

def lab(rgb):
    c = np.asarray(rgb, dtype=np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

def main():
    spec = [s.split(':') for s in sys.argv[1].split(',')]
    betrieb = [(n, h, float(z)) for n, h, z in spec]
    namen = [n for n, _, _ in betrieb] + [n for n, _ in EEZI]
    ziele = lab([hex2rgb(h) for _, h, _ in betrieb] + [hex2rgb(h) for _, h in EEZI])
    for pfad in sys.argv[2:]:
        img = np.asarray(Image.open(pfad).convert('RGB'))[::2, ::2].astype(np.int16)
        r, g, bl = img[..., 0], img[..., 1], img[..., 2]
        bild = (np.minimum(r, bl) > 90) & (g < 0.55 * np.minimum(r, bl))       # Magenta und seine Kanten, auch auf dunklem Grund
        Lk = lab(img.astype(np.uint8).reshape(-1, 3))[:, 0].reshape(img.shape[:2])
        kante = np.zeros_like(bild)                                            # Kantenglättung der Schrift zählt nicht
        kante[:, :-1] |= np.abs(Lk[:, :-1] - Lk[:, 1:]) > 10
        kante[:-1, :] |= np.abs(Lk[:-1, :] - Lk[1:, :]) > 10
        a = img.reshape(-1, 3).astype(np.uint8); bild = bild.reshape(-1); kante = kante.reshape(-1) & ~bild
        rest = a[~bild & ~kante]
        L = lab(rest)
        d = ((L[:, None, :] - ziele[None, :, :]) ** 2).sum(-1)
        k = d.argmin(1)
        n = len(rest)
        print('\n%s  (Bild %.1f %%, Kanten %.1f %% der Fläche, beide nicht gezählt)' % (pfad.split('/')[-1], 100 * bild.mean(), 100 * kante.mean()))
        print('| Farbe | Ziel % | Ist % |')
        print('| --- | --- | --- |')
        for i, (name, _, ziel) in enumerate(betrieb):
            print('| %s | %.0f | %.1f |' % (name, ziel, 100 * (k == i).sum() / n))
        eezi = 100 * (k >= len(betrieb)).sum() / n
        teile = ', '.join('%s %.1f' % (namen[j], 100 * (k == j).sum() / n) for j in range(len(betrieb), len(namen)) if (k == j).sum() / n > 0.002)
        print('| eeziframes (Rest) | – | %.1f |' % eezi + ('  ' + teile if teile else ''))

main()

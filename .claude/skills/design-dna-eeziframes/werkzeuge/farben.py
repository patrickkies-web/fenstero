"""Farbanteile je Bildschirm nach der Palette „Task-App dunkel“: jeder Pixel wird einer der acht Farben zugeordnet.
Aufruf: python3 -I farben.py <höhe je Bildschirm> bild1.png bild2.png ...  (Bilder in Seitenreihenfolge; das letzte darf überlappen)
Neutral: Schwarz, Anthrazit, Silbergrau/Textgrau, Weiß (nach Helligkeit). Farbe: Violett, Indigo (dunkles Violett), Koralle, Foto (andere Töne)."""
import sys
import numpy as np
from PIL import Image

def klassen(a):
    a = a.astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    chroma = mx - mn
    v = mx / 255
    luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    hue = np.zeros_like(mx)
    m = chroma > 0
    rr, gg, bb = r[m], g[m], b[m]
    mxm, cm = mx[m], chroma[m]
    h = np.where(mxm == rr, ((gg - bb) / cm) % 6, np.where(mxm == gg, (bb - rr) / cm + 2, (rr - gg) / cm + 4)) * 60
    hue[m] = h
    neutral = chroma < 26
    bunt = ~neutral
    viol = bunt & (hue >= 222) & (hue <= 278)
    indigo = viol & (v < .6)
    violett = viol & (v >= .6)
    koralle = bunt & (hue >= 2) & (hue <= 38)
    foto = bunt & ~viol & ~koralle
    return {
        'Schwarz': neutral & (luma < .075), 'Anthrazit': neutral & (luma >= .075) & (luma < .3),
        'Grau': neutral & (luma >= .3) & (luma < .86), 'Weiß': neutral & (luma >= .86),
        'Violett': violett, 'Koralle': koralle, 'Indigo': indigo, 'Foto': foto }

def zeile(name, k, n):
    p = {s: float(k[s].sum()) / n * 100 for s in k}
    neutral = p['Schwarz'] + p['Anthrazit'] + p['Grau'] + p['Weiß']
    farbe = p['Violett'] + p['Koralle'] + p['Indigo'] + p['Foto']
    return '| %s | %.1f (S %.0f · A %.0f · G %.0f · W %.0f) | %.1f | %.1f | %.1f | %.1f | **%.1f** |' % (
        name, neutral, p['Schwarz'], p['Anthrazit'], p['Grau'], p['Weiß'], p['Violett'], p['Koralle'], p['Indigo'], p['Foto'], farbe), p

def main():
    hoehe = int(sys.argv[1]); pfade = sys.argv[2:]
    bilder = [np.asarray(Image.open(p).convert('RGB')) for p in pfade]
    # Seite zusammensetzen: letzte Aufnahme nur so weit, wie sie neu ist (Seitenhöhe = Summe ohne Überlappung unbekannt; wir nehmen volle Bilder außer dem letzten, das anhand des vorletzten Endes geschnitten wird)
    print('| Bildschirm | Neutral % | Violett | Koralle | Indigo | Foto | Farbe gesamt |')
    print('| --- | --- | --- | --- | --- | --- | --- |')
    summe = None; gesamt = 0
    for i, b in enumerate(bilder):
        k = klassen(b); n = b.shape[0] * b.shape[1]
        z, p = zeile(str(i + 1), k, n); print(z)
        if summe is None: summe = {s: 0.0 for s in p}
        for s in p: summe[s] += p[s] * n
        gesamt += n
    if gesamt:
        p = {s: summe[s] / gesamt for s in summe}
        neutral = p['Schwarz'] + p['Anthrazit'] + p['Grau'] + p['Weiß']; farbe = p['Violett'] + p['Koralle'] + p['Indigo'] + p['Foto']
        print('| **Seite** | %.1f (S %.0f · A %.0f · G %.0f · W %.0f) | %.1f | %.1f | %.1f | %.1f | **%.1f** |' % (neutral, p['Schwarz'], p['Anthrazit'], p['Grau'], p['Weiß'], p['Violett'], p['Koralle'], p['Indigo'], p['Foto'], farbe))

main()

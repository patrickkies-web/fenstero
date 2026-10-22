#!/usr/bin/env python3
"""eeziframes · Fotos für die Website aus den Originalen erzeugen.

Die Website zeigt an festen Plätzen Fotos in der Bildsprache der Instagram-Beiträge (ein Tier oder ein Astronaut tut etwas
Menschliches rund ums Fenster, fotorealistisch, warmes Licht). Welcher Platz wo liegt, welches Motiv und welcher Prompt
dazugehören, steht in docs/BILDER.md.

  1. Original (PNG, JPG oder WebP, beliebige Größe) nach fotos-roh/<name>.<ext> legen; der Ordner bleibt außerhalb von Git.
  2. python3 scripts/fotos.py
  3. web/bilder/foto/<name>.webp einchecken.

Jedes Bild wird mittig auf das Format seines Platzes beschnitten, verkleinert und als WebP geschrieben (Qualität 82).
Fehlt ein Original, entsteht ein neutraler Platzhalter ohne Text (dunkle Fläche, Fenster, Licht am Boden), damit die Seite steht;
ein vorhandenes Foto wird nie durch einen Platzhalter ersetzt. Mit --platzhalter werden alle Platzhalter neu geschrieben."""
import pathlib
import sys

from PIL import Image, ImageDraw, ImageFont

WURZEL = pathlib.Path(__file__).resolve().parent.parent
ROH = WURZEL / 'fotos-roh'
ZIEL = WURZEL / 'web' / 'bilder' / 'foto'

# Name, Breite, Höhe (Pixel; 4:5 wie die Beiträge, 16:10 für breite Plätze; die beiden Startbilder laufen randlos aus und
# werden per CSS beschnitten, darum quadratisch bzw. in der Größe des Originals)
PLAETZE = [
    ('start-hauseigentuemer', 1250, 1250),
    ('start-fensterbauer', 1120, 1400),
    ('app-start', 1120, 1400),
    ('gross', 1200, 1500),
    ('fuer-fensterbauer', 1200, 1500),
    ('ratgeber', 1600, 1000),
    ('weg-pruefen', 1600, 1000),
    ('weg-entscheiden', 1600, 1000),
    ('weg-auswaehlen', 1600, 1000),
    ('weg-ausmessen', 1600, 1000),
    ('weg-vergleichen', 1600, 1000),
    ('weg-einbauen', 1600, 1000),
    ('fehler', 1600, 1000),
]
GRUND, FLAECHE, LINIE, LINIE2, TEXT, NEBEN, SIGNAL = '#161616', '#1f1f1f', '#2b2b2b', '#3a3a3a', '#f3f2ee', '#93928d', '#8fd694'
SCHRIFT = pathlib.Path('/usr/share/fonts/opentype/inter')


def schrift(gewicht, px):
    for name in (f'Inter-{gewicht}.otf', 'Inter-Bold.otf'):
        p = SCHRIFT / name
        if p.exists():
            return ImageFont.truetype(str(p), px)
    return ImageFont.load_default()


def original(name):
    for ext in ('png', 'jpg', 'jpeg', 'webp', 'PNG', 'JPG', 'JPEG'):
        p = ROH / f'{name}.{ext}'
        if p.exists():
            return p
    return None


def zuschneiden(im, w, h):
    """mittig auf das Seitenverhältnis des Platzes, dann verkleinern"""
    im = im.convert('RGB')
    q = im.width / im.height
    if q > w / h:  # zu breit
        nb = round(im.height * w / h)
        x = (im.width - nb) // 2
        im = im.crop((x, 0, x + nb, im.height))
    else:
        nh = round(im.width * h / w)
        y = (im.height - nh) // 2
        im = im.crop((0, y, im.width, y + nh))
    return im.resize((w, h), Image.LANCZOS)


def platzhalter(name, w, h):
    """neutrales Bild ohne Text, bis das Foto da ist: Licht fällt durch ein Fenster in einen dunklen Raum, wie im Zeichen.
    Keine Beschriftung, keine Dateipfade, kein Verweis auf Prompts: Besucher sehen eine ruhige Fläche, kein Baustellenschild."""
    im = Image.new('RGB', (w, h), FLAECHE)
    d = ImageDraw.Draw(im)
    s = min(w, h) / 1000  # Maßstab
    fw, fh = round(w * 0.30), round(h * 0.36)
    fx, fy = round(w * 0.56) - fw // 2, round(h * 0.16)
    # Lichtfläche auf dem Boden unter dem Fenster
    boden = fy + fh + round(h * 0.16)
    d.polygon([(fx, fy + fh), (fx + fw, fy + fh), (fx + fw - round(w * 0.12), boden + round(h * 0.18)), (fx - round(w * 0.30), boden + round(h * 0.18))], fill='#242424')
    # Fenster: Rahmen, Glas etwas heller, Kreuz
    d.rectangle((fx, fy, fx + fw, fy + fh), fill='#262626')
    d.rounded_rectangle((fx, fy, fx + fw, fy + fh), radius=round(8 * s), outline=LINIE2, width=max(4, round(8 * s)))
    d.line((fx + fw // 2, fy, fx + fw // 2, fy + fh), fill=LINIE2, width=max(3, round(6 * s)))
    d.line((fx, fy + fh // 2, fx + fw, fy + fh // 2), fill=LINIE2, width=max(3, round(6 * s)))
    # Fensterbank
    d.rectangle((fx - round(24 * s), fy + fh, fx + fw + round(24 * s), fy + fh + round(12 * s)), fill=LINIE2)
    return im


def main():
    nur_platzhalter = '--platzhalter' in sys.argv
    ZIEL.mkdir(parents=True, exist_ok=True)
    for name, w, h in PLAETZE:
        ziel = ZIEL / f'{name}.webp'
        roh = None if nur_platzhalter else original(name)
        if roh:
            im = zuschneiden(Image.open(roh), w, h)
            im.save(ziel, 'WEBP', quality=82, method=6)
            print(f'{ziel.relative_to(WURZEL)}  aus {roh.relative_to(WURZEL)}  ({ziel.stat().st_size // 1024} KB)')
        elif nur_platzhalter or not ziel.exists():
            platzhalter(name, w, h).save(ziel, 'WEBP', quality=80, method=6)
            print(f'{ziel.relative_to(WURZEL)}  Platzhalter')
        else:
            print(f'{ziel.relative_to(WURZEL)}  bleibt (kein Original in fotos-roh/)')


if __name__ == '__main__':
    main()

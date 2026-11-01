import sys
from PIL import Image, ImageDraw, ImageFont
font = None
for p in ['outfit.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/home/user/fenstero/web/vendor/fonts/outfit-500.ttf', '/home/user/fenstero/docs/profis/startseite-dna-vorschau/fonts/Outfit-Medium.ttf']:
    try: font = ImageFont.truetype(p, 44); break
    except Exception: pass
if not font:
    import glob
    c = glob.glob('/home/user/fenstero/**/Outfit*.ttf', recursive=True) + glob.glob('/usr/share/fonts/**/*.ttf', recursive=True)
    font = ImageFont.truetype(c[0], 44) if c else ImageFont.load_default()
def paar(a, b, out, titel):
    A, B = Image.open(a), Image.open(b)
    g = 48; h = max(A.height, B.height) + 110
    M = Image.new('RGB', (A.width + B.width + 3 * g, h + g), (7, 9, 10))
    d = ImageDraw.Draw(M)
    d.text((g, 28), 'Vorher · ' + titel, fill=(168, 164, 169), font=font)
    d.text((A.width + 2 * g, 28), 'Nachher · ' + titel, fill=(255, 255, 255), font=font)
    M.paste(A, (g, 110)); M.paste(B, (A.width + 2 * g, 110))
    M.save(out, quality=88)
paar('bilder/tel-vorher.png', 'bilder/tel-nachher.png', 'vorher-nachher-telefon.jpg', 'Telefon 390 × 844')
paar('bilder/laptop-vorher.png', 'bilder/laptop-nachher.png', 'vorher-nachher-laptop.jpg', 'Laptop 1440 × 900')
print('ok')

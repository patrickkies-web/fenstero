import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
name, spalten, faktor, out = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 26)
files = sorted(glob.glob(f'ueberblick/{name}-*.png'))
teile = [int(x) for x in sys.argv[5].split('-')] if len(sys.argv) > 5 else None
if teile: files = files[teile[0]-1:teile[1]]
ims = [Image.open(f) for f in files]
w = int(ims[0].width * faktor); h = int(ims[0].height * faktor)
g = 24; zeilen = (len(ims) + spalten - 1) // spalten
M = Image.new('RGB', (spalten * (w + g) + g, zeilen * (h + g + 40) + g), (7, 9, 10))
d = ImageDraw.Draw(M)
for i, (f, im) in enumerate(zip(files, ims)):
    x = g + (i % spalten) * (w + g); y = g + (i // spalten) * (h + g + 40)
    d.text((x, y), os.path.basename(f)[len(name)+1:-4], fill=(168, 164, 169), font=font)
    M.paste(im.resize((w, h), Image.LANCZOS), (x, y + 36))
M.save(out, quality=85); print(out, M.size)

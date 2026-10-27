import json, os, re
from PIL import Image
Z='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/bilder/ergebnis/'; os.makedirs(Z, exist_ok=True)
JS='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.js'
def mitte(c): return [c[0]+c[2]/2, c[1]+c[3]/2]
lage={}
for art in ['fenster','balkon','fest','hst','psk','fsw']:
    pj=f'mess-render/ergebnis/lage-{art}.json'; pp=f'mess-render/ergebnis/{art}.png'
    if not (os.path.exists(pj) and os.path.exists(pp)): continue
    im=Image.open(pp).convert('RGB')
    if im.size[0]!=2148: im=im.resize((2148, round(im.size[1]*2148/im.size[0])), Image.LANCZOS)  # Faktor 4 auf das Raster von Faktor 6
    if im.size[1]<1800: print(art,'Größe',im.size); continue
    im=im.crop((0,0,2148,1800))
    im.save(Z+art+'.webp','WEBP',quality=78,method=6)
    L=json.load(open(pj)); o={}
    for k,d in L['dims'].items():
        a,b=[mitte(c) for c in d['caps']]
        if ' v' in ' '+d['cls'].split(' mo ')[-1] or d['cls'].split()[2:3]==['v'] or ' v ' in ' '+d['cls']+' ':
            x=d['line'][0]+d['line'][2]/2; o[k]=[round(x*6,1),round(a[1]*6,1),round(x*6,1),round(b[1]*6,1)]
        else: o[k]=[round(a[0]*6,1),round(a[1]*6,1),round(b[0]*6,1),round(b[1]*6,1)]
    lage[art]=o; print(art, os.path.getsize(Z+art+'.webp')//1024,'KB', o)
s=open(JS,encoding='utf-8').read()
s,n=re.subn(r'var ERG_LAGE = \{.*?\};','var ERG_LAGE = '+json.dumps(lage,separators=(',',':'))+';',s,count=1,flags=re.S); assert n==1
open(JS,'w',encoding='utf-8').write(s)

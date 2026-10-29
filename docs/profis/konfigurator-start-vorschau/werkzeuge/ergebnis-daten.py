import json, os, re
from PIL import Image
Z='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/bilder/ergebnis/'; os.makedirs(Z, exist_ok=True)
JS='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.js'
def mitte(c): return [c[0]+c[2]/2, c[1]+c[3]/2]
lage={}
# Lagen aus einem eigenen Lauf mit Faktor 1 (LAGE=Ordner), wenn der Lauf mit Faktor 6 die Kamera noch fahrend gelesen hat
LAGE=os.environ.get('LAGE','mess-render/ergebnis')
KANTEN={'fenster':((719,360),(1619,379),1400),'balkon':((866,360),(1286,368),1416),'fest':((733,391),(1876,418),1355),
        'hst':((733,508),(1875,541),1247),'psk':((724,368),(1676,380),1399),'fsw':((734,502),(1875,536),1244)}
for art in ['fenster','balkon','fest','hst','psk','fsw']:
    pj=f'{LAGE}/lage-{art}.json'; pp=f'mess-render/ergebnis/{art}.png'
    if not (os.path.exists(pj) and os.path.exists(pp)): continue
    im=Image.open(pp).convert('RGB')
    if im.size[0]!=2148: im=im.resize((2148, round(im.size[1]*2148/im.size[0])), Image.LANCZOS)  # Faktor 4 auf das Raster von Faktor 6
    if im.size[1]<1800: print(art,'Größe',im.size); continue
    im=im.crop((0,0,2148,1800))
    # Frontend 1: Standard 1320 × 1106 (360 bis 412 px bei Pixeldichte 3), die volle Fassung nur für den Zoom
    im.save(Z+art+'-gross.webp','WEBP',quality=78,method=6)
    im.resize((1320,1106),Image.LANCZOS).save(Z+art+'.webp','WEBP',quality=80,method=6)
    L=json.load(open(pj)); o={}
    for k,d in L['dims'].items():
        a,b=[mitte(c) for c in d['caps']]
        if ' v' in ' '+d['cls'].split(' mo ')[-1] or d['cls'].split()[2:3]==['v'] or ' v ' in ' '+d['cls']+' ':
            x=d['line'][0]+d['line'][2]/2; o[k]=[round(x*6,1),round(a[1]*6,1),round(x*6,1),round(b[1]*6,1)]
        else: o[k]=[round(a[0]*6,1),round(a[1]*6,1),round(b[0]*6,1),round(b[1]*6,1)]
    # Gremium G (Veto): die Linien des Elements an die Außenkanten des Rahmens statt durchs Glas. Die App legt im Ergebnis die Breite auf
    # 80 % der Höhe und die Höhe auf 76 % der Breite, beide in derselben Ebene; aus diesen vier Enden ergibt sich die Projektion der
    # Rahmenebene (Homographie), daraus die rechte Kante (Höhe) und die Unterkante (Breite).
    import numpy as np
    d=L['dims']; ca=lambda k,i: [v*6 for v in mitte(d[k]['caps'][i])]
    src=[(0,0.8),(1,0.8),(0.76,0),(0.76,1)]; dst=[ca('ew',0),ca('ew',1),ca('eh',0),ca('eh',1)]
    A=[]
    for (u,v),(x,y) in zip(src,dst):
        A.append([u,v,1,0,0,0,-x*u,-x*v,-x]); A.append([0,0,0,u,v,1,-y*u,-y*v,-y])
    H=np.linalg.svd(np.array(A))[2][-1].reshape(3,3)
    def P(u,v):
        q=H@np.array([u,v,1.0]); return [round(float(q[0]/q[2]),1), round(float(q[1]/q[2]),1)]
    o['eh']=P(1,0)+P(1,1); o['ew']=P(0,1)+P(1,1)
    # Zeichen 1 (27.10.2026): die App setzt die Maße der Öffnung abgesetzt neben die Kanten. Die Vorschau legt sie auf die Kanten:
    # Ecken oben links und oben rechts im Bild abgelesen (Raster 20 px), unten die Unterkante der App (Bank bzw. Fußboden)
    if art in KANTEN:
        (xl,yl),(xr,yr),yb=KANTEN[art]
        o['hm']=[xl,yl,xl,yb]; o['wm']=[xl,yl,xr,yr]
    lage[art]=o; print(art, os.path.getsize(Z+art+'.webp')//1024,'KB', o)
s=open(JS,encoding='utf-8').read()
s,n=re.subn(r'var ERG_LAGE = \{.*?\};','var ERG_LAGE = '+json.dumps(lage,separators=(',',':'))+';',s,count=1,flags=re.S); assert n==1
open(JS,'w',encoding='utf-8').write(s)

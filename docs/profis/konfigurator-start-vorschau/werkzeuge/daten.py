import json, os, re
from PIL import Image
Z='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/bilder/mess/'
JS='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.js'
hd=json.load(open('mess-render/hd/lage-hd.json'))
def linie(d):
    a,b=d['caps']
    if ' v ' in ' '+d['dimCls']+' ':
        x=d['line'][0]+d['line'][2]/2; return [x*6,(a[1]+a[3]/2)*6,x*6,(b[1]+b[3]/2)*6]
    return [(a[0]+a[2]/2)*6,(a[1]+a[3]/2)*6,(b[0]+b[2]/2)*6,(b[1]+b[3]/2)*6]
lage={}; rahmen={}
for art in ['fenster','balkon','fest','hst','psk','fsw']:
    s3=hd[art]
    box_s=[min(s3[2][0],s3[2][2]),s3[0][1],max(s3[2][0],s3[2][2]),s3[0][3]]
    pf=f'mess-render/front/lage-{art}.json'
    if os.path.exists(pf) and os.path.exists(f'mess-render/front/{art}.png'):
        pl=f'mess-render/front-lage/lage-{art}.json'
        L=json.load(open(pl if os.path.exists(pl) else pf)); f={k:[round(v,1) for v in linie(L[k])] for k in L}
        im=Image.open(f'mess-render/front/{art}.png').convert('RGB'); assert im.size==(2148,1410), im.size
        im.crop((0,0,2148,1400)).save(Z+art+'-front.webp','WEBP',quality=78,method=6)
        box_f=[min(f['3'][0],f['3'][2]),f['1'][1],max(f['3'][0],f['3'][2]),f['1'][3]]
        lage[art]=[s3[0],s3[1],f['3'],f['4']]; rahmen[art]=[[round(v,1) for v in box_s],[round(v,1) for v in box_f]]
        print(art,'front',os.path.getsize(Z+art+'-front.webp')//1024,'KB',f['3'],f['4'],box_f)
    else:
        lage[art]=s3; rahmen[art]=[[round(v,1) for v in box_s],[round(v,1) for v in box_s]]
        print(art,'noch ohne Frontansicht')
# Kanten nach dem Helligkeitsprofil (Detail-Profi Zeichen): Maß 1 oben auf der Putzkante (240,5 statt 243,6, alle Elemente gleich),
# Fenster Maß 2 oben auf der Rahmenaußenkante, Fenster Maß 3 rechts am Ende der Laibung
for art in lage:
    if abs(lage[art][0][1]-243.6) < 0.2: lage[art][0][1]=240.5
if abs(lage['fenster'][1][1]-268.2) < 0.2: lage['fenster'][1][1]=264.5
if 'fenster' in lage and abs(lage['fenster'][2][2]-1482.6) < 0.2: lage['fenster'][2][2]=1475.5
s=open(JS,encoding='utf-8').read()
s,n=re.subn(r'var MESS_LAGE = \{.*?\};','var MESS_LAGE = '+json.dumps(lage,separators=(',',':'))+';\n  var MESS_RAHMEN = '+json.dumps(rahmen,separators=(',',':'))+';',s,count=1,flags=re.S); assert n==1
s=re.sub(r'(\n  var MESS_RAHMEN = \{.*?\};)\n  var MESS_RAHMEN = \{.*?\};', r'\1', s, count=1, flags=re.S)
open(JS,'w',encoding='utf-8').write(s)

import json, os, re, sys
from PIL import Image
SP='/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/'
V='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/'
R=SP+(sys.argv[1] if len(sys.argv)>1 else 'wunsch-render')+'/'
F=json.load(open(R+'fragen.json'));
# Formen: Kurzbeschreibung je Form wie OPT.form der App in der Kachel; die Zeile „Rechteck · der Standard“ entfällt (steht in der Kachel)
FORM_SUB={'rechteck':'der Standard','rundbogen':'Halbkreis oben','segment':'flacher Bogen oben','schraeg':'eine Seite höher','rund':'fest verglast, ohne Flügel','trapez':'beide Ecken schräg','dreieck':'Giebel, fest verglast'}
for _q in F:
    if _q.get('id')=='form':
        for _b in _q['bloecke']:
            if _b['typ']=='karten':
                for _o in _b['opts']: _o['sb']=FORM_SUB.get(_o['v'],'')
        _q['bloecke']=[_b for _b in _q['bloecke'] if _b['typ']!='aktuell']
G=json.load(open(SP+'wunsch-gloss.json')); T=json.load(open(SP+'app-lage/tiefe.json'))
os.makedirs(V+'bilder/wuensche',exist_ok=True)
def bild(name):
    if not name: return None
    src=R+name+'.png'
    if not os.path.exists(src): return None
    ziel='bilder/wuensche/'+name+'.webp'
    im=Image.open(src).convert('RGB')
    w=1170
    if im.size[0]>w: im=im.resize((w, round(im.size[1]*w/im.size[0])), Image.LANCZOS)
    im.save(V+ziel,'WEBP',quality=78,method=6)
    return {'src':ziel,'w':im.size[0],'h':im.size[1]}
def strich(svg):
    # Zeichnungen der App als Strichzeichnung wie in Schritt 1: Flächen leer, Glas leicht getönt, Striche in currentColor,
    # Stärken gerätunabhängig 1,8 / 1,2 / 1 px (G14 „Ein Zeichen je Bedeutung“)
    svg=re.sub(r' width="\d+" height="\d+"','',svg)
    def fill(m):
        v=m.group(1).lower()
        if v in ('none',): return 'fill="none"'
        if v in ('#d6e6f4','#cfe0f0','#dbe8f5','#e3eef8'): return 'fill="currentColor" fill-opacity=".12"'
        if v in ('#ffffff','#fff','#f5f5f7','#fafafa','#f2f2f4'): return 'fill="none"'
        return 'fill="currentColor" fill-opacity=".22"'
    svg=re.sub(r'fill="([^"]*)"',fill,svg)
    svg=re.sub(r'stroke="(?!none)[^"]*"','stroke="currentColor"',svg)
    def sw(m):
        w=float(m.group(1)); n=1.8 if w>=1.2 else 1.2 if w>=0.8 else 1
        return 'stroke-width="%s" vector-effect="non-scaling-stroke"'%n
    svg=re.sub(r'stroke-width="([\d.]+)"',sw,svg)
    return svg
kap=[]
for k in F[2]['kapitel']: kap.append({'k':k['kap'],'n':k['n'],'v':k['v']})
fragen=[]
for q in F:
    if q['id'] in ('lage','tiefe'): continue
    d={k:q.get(k) for k in ['id','kap','eyebrow','h1','gloss','sub','notiz','hint','rx','ry','weiter']}
    d['bild']=bild(q.get('bild'))
    bl=[]
    for b in q['bloecke']:
        b=dict(b)
        if 'opts' in b:
            neu=[]
            for o in b['opts']:
                o=dict(o)
                if o.get('bild'): o['bild']=bild(o['bild'])
                # Icons der App: Farben auf currentColor, damit sie im Licht der Kachel stehen
                if o.get('ico'): o['ico']=strich(o['ico'])
                neu.append(o)
            b['opts']=neu
        bl.append(b)
    d['bloecke']=bl
    fragen.append(d)
g={k:G[k] for k in G}
out={'kapitel':kap,'fragen':fragen,'gloss':g,'tiefe':T}
js='/* Schritt 6 „Wünsche“: Inhalte der App (Fenster, zwei Flügel, „Üblich“), ausgelesen aus der laufenden App mit werkzeuge/wunsch-render.mjs:\n   Fragen, Texte, Optionen, Erklärungen (GLOSS) und je Frage bzw. Option das Bild des Modells. Nicht von Hand ändern, neu erzeugen. */\nwindow.EZ_WUENSCHE = '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n'
open(V+'wuensche-daten.js','w',encoding='utf-8').write(js)
print(len(fragen),'Fragen,', sum(1 for q in fragen if q['bild']),'mit Bild,', len(js)//1024,'KB')

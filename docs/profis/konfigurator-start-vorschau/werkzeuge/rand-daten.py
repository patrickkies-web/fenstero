import json, os, re
JS='/home/user/fenstero/docs/profis/konfigurator-start-vorschau/start.js'
def mitte(c): return [c[0]+c[2]/2, c[1]+c[3]/2]
def linie(d):
    a,b=d['caps']
    if ' v ' in ' '+d['dimCls']+' ':
        x=d['line'][0]+d['line'][2]/2; return [x*6,(a[1]+a[3]/2)*6,x*6,(b[1]+b[3]/2)*6]
    return [(a[0]+a[2]/2)*6,(a[1]+a[3]/2)*6,(b[0]+b[2]/2)*6,(b[1]+b[3]/2)*6]
r6=lambda l:[round(v,1) for v in l]
s=open(JS,encoding='utf-8').read()
mess=json.loads(re.search(r'var MESS_LAGE = (\{.*?\});',s).group(1))
rand={}; passt={}
for art in ['fenster','balkon','fest','hst','psk','fsw']:
    L=json.load(open(f'mess-render/rand2/lage-{art}.json'))
    cap=lambda k,ans: r6([v*6 for v in mitte(L[k][ans]['caps'][0])+mitte(L[k][ans]['caps'][1])])
    rand[art]=[cap('1','schraeg'),cap('2','schraeg'),cap('3','front'),cap('4','front')]
    pl=f'mess-render/front-lage/lage-{art}.json'; pf=f'mess-render/front/lage-{art}.json'
    F=json.load(open(pl if os.path.exists(pl) else pf))
    hm=r6(linie(F['1']))
    # Übersicht „Passt.“ von vorn: Breite oben, Mitte, unten; Höhe links, Mitte, rechts
    passt[art]=[cap('3','front'),mess[art][2],cap('4','front'),cap('1','front'),hm,cap('2','front')]
# Nachmessung im Bild (Zeichen 3–5, 27.10.2026), Fenster: alle Breiten von Mauerkante zu Mauerkante (667 → 1480), Höhen bei „Passt.“
# an der Mauer, Rand 1/2 oben auf der Kante, Höhe rechts an der raumseitigen Ecke. Die übrigen Elemente sind noch nicht nachgemessen.
NACH={'fenster':{'rand':{0:[746.7,214.0,753.6,1109.1],1:[1421.0,269.8,1414.4,1215.3],2:[667.0,260.7,1480.0,260.7],3:[667.0,1143.9,1480.0,1143.9]},
                 'passt':{0:[667.0,260.7,1480.0,260.7],1:[667.0,702.3,1480.0,702.3],2:[667.0,1143.9,1480.0,1143.9],3:[668.5,237.0,668.5,1167.6],5:[1478.5,237.0,1478.5,1167.6]}}}
for art,n in NACH.items():
    for i,l in n['rand'].items(): rand[art][i]=l
    for i,l in n['passt'].items(): passt[art][i]=l
blk='\n  /* Ränder (Schritt 4) aus demselben Modell: Höhe links und rechts schräg, Breite oben und unten von vorn; „Passt.“ zeigt alle sechs\n     Maße der Öffnung von vorn (Breite oben, Mitte, unten; Höhe links, Mitte, rechts). Erzeugt mit werkzeuge/lage-rand.mjs und rand-daten.py */\n  var RAND_LAGE = '+json.dumps(rand,separators=(',',':'))+';\n  var PASST_LAGE = '+json.dumps(passt,separators=(',',':'))+';'
if 'var RAND_LAGE' in s:
    s=re.sub(r'\n  /\* Ränder \(Schritt 4\).*?var PASST_LAGE = \{.*?\};', lambda m: blk, s, count=1, flags=re.S)
else:
    s=re.sub(r'(var MESS_RAHMEN = \{.*?\};)', lambda m: m.group(1)+blk, s, count=1, flags=re.S)
open(JS,'w',encoding='utf-8').write(s)
print(json.dumps(passt['fenster']))

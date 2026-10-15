#!/usr/bin/env python3
"""eeziframes · Bewegtbilder (Lottie), aus Code erzeugt. Bodymovin-Format 5.7, nur Formen und Keyframes, keine Ausdrücke,
damit der leichte Spieler (web/vendor/lottie_light.min.js) sie ohne eval unter der strengen CSP abspielt.
Farben sind Marker (die hellen Tokens); gemeinsam.js tauscht sie beim Laden gegen die aktuellen Tokens, auch im dunklen Modus.
   python3 scripts/lottie-erzeugen.py web/assets/lottie
Fünf Zeichen: messen (drei Maße, das kleinste zählt), fotos (der Sucher liest das Fenster), senden (der Flieger),
eingang (ein Aufmaß landet im Projekt), fertig (Kreis, Haken, vier Striche). Regeln in docs/GESTALTUNG.md."""
import json, math, sys, os

FR = 60
# Markerfarben = Werte der hellen Tokens (so sieht es auch ohne Tausch richtig aus)
INK = [0x14 / 255, 0x14 / 255, 0x14 / 255, 1]
PAPER = [0xf3 / 255, 0xf2 / 255, 0xee / 255, 1]
SURF = [0xec / 255, 0xeb / 255, 0xe6 / 255, 1]
MO = [0xc2 / 255, 0x41 / 255, 0x0c / 255, 1]
EL = [0x1d / 255, 0x4e / 255, 0xd8 / 255, 1]
OK = [0x15 / 255, 0x73 / 255, 0x3a / 255, 1]

E_OUT = ({"x": [0.2], "y": [0.7]}, {"x": [0.2], "y": [1]})   # o, i  (cubic-bezier(.2,.7,.2,1))
E_IO = ({"x": [0.45], "y": [0]}, {"x": [0.2], "y": [1]})
E_IN = ({"x": [0.5], "y": [0]}, {"x": [0.8], "y": [0.4]})
LIN = ({"x": [0.33], "y": [0.33]}, {"x": [0.67], "y": [0.67]})

def st(v): return {"a": 0, "k": v}
def kf(frames, ease=E_OUT):
    """frames: [(t, value), ...]; value number oder Liste. Letzter Frame nur t+s. 'h' = Halten per ease=None"""
    out = []
    for n, (t, v) in enumerate(frames):
        vv = v if isinstance(v, list) else [v]
        k = {"t": t, "s": vv}
        if n < len(frames) - 1:
            nxt = frames[n + 1][1]
            k["e"] = nxt if isinstance(nxt, list) else [nxt]
            if ease is None: k["h"] = 1
            else: k["o"], k["i"] = ease
        out.append(k)
    return {"a": 1, "k": out}
def kfm(frames):
    """frames: [(t, value, ease|None|'hold'), ...] mit Ease je Abschnitt"""
    out = []
    for n, fr in enumerate(frames):
        t, v = fr[0], fr[1]; ease = fr[2] if len(fr) > 2 else E_OUT
        vv = v if isinstance(v, list) else [v]
        k = {"t": t, "s": vv}
        if n < len(frames) - 1:
            nxt = frames[n + 1][1]
            k["e"] = nxt if isinstance(nxt, list) else [nxt]
            if ease == 'hold': k["h"] = 1
            else: k["o"], k["i"] = ease
        out.append(k)
    return {"a": 1, "k": out}

def tr(p=(0, 0), a=(0, 0), s=(100, 100), r=0, o=100):
    return {"ty": "tr", "p": p if isinstance(p, dict) else st(list(p)), "a": st(list(a)), "s": s if isinstance(s, dict) else st(list(s)),
            "r": r if isinstance(r, dict) else st(r), "o": o if isinstance(o, dict) else st(o), "sk": st(0), "sa": st(0)}
def group(items, name="g", **t):
    return {"ty": "gr", "nm": name, "it": items + [tr(**t)], "np": len(items) + 1, "cix": 2, "bm": 0, "hd": False}
def path(pts, closed=False, tang=None):
    n = len(pts)
    i = tang[0] if tang else [[0, 0]] * n
    o = tang[1] if tang else [[0, 0]] * n
    return {"ty": "sh", "nm": "p", "hd": False, "ks": st({"i": i, "o": o, "v": [list(p) for p in pts], "c": closed})}
def rect(w, h, x=0, y=0, r=0): return {"ty": "rc", "d": 1, "s": st([w, h]), "p": st([x, y]), "r": st(r), "nm": "r", "hd": False}
def ellipse(w, h, x=0, y=0, s=None): return {"ty": "el", "d": 1, "s": s or st([w, h]), "p": st([x, y]), "nm": "e", "hd": False}
def stroke(c, w, o=100, dash=None):
    d = {"ty": "st", "c": st(c), "o": o if isinstance(o, dict) else st(o), "w": w if isinstance(w, dict) else st(w), "lc": 2, "lj": 2, "ml": 4, "bm": 0, "nm": "s", "hd": False}
    if dash: d["d"] = [{"n": "d", "nm": "d", "v": st(dash[0])}, {"n": "g", "nm": "g", "v": st(dash[1])}]
    return d
def fill(c, o=100): return {"ty": "fl", "c": st(c), "o": o if isinstance(o, dict) else st(o), "r": 1, "bm": 0, "nm": "f", "hd": False}
def trim(s=0, e=100, o=0): return {"ty": "tm", "s": s if isinstance(s, dict) else st(s), "e": e if isinstance(e, dict) else st(e), "o": st(o), "m": 1, "nm": "t", "hd": False}
def layer(name, shapes, ind, op, ip=0, p=(120, 120), o=100, s=(100, 100), r=0, a=(0, 0)):
    return {"ddd": 0, "ind": ind, "ty": 4, "nm": name, "sr": 1, "ao": 0, "bm": 0, "ip": ip, "op": op, "st": 0,
            "ks": {"o": o if isinstance(o, dict) else st(o), "r": r if isinstance(r, dict) else st(r),
                   "p": p if isinstance(p, dict) else st([p[0], p[1], 0]), "a": st([a[0], a[1], 0]),
                   "s": s if isinstance(s, dict) else st([s[0], s[1], 100])},
            "shapes": list(reversed(shapes))}
def anim(name, layers, op, w=240, h=240):
    # Ebenen werden von unten nach oben notiert; Lottie zeichnet die erste Ebene zuoberst
    return {"v": "5.7.4", "fr": FR, "ip": 0, "op": op, "w": w, "h": h, "nm": name, "ddd": 0, "assets": [], "layers": list(reversed(layers)),
            "markers": []}

# ---------------------------------------------------------------- messen: drei Maße, das kleinste zählt (Schleife, 3,8 s)
def messen():
    OP = 228
    L = []
    # Maueröffnung: äußerer Rahmen und ein zweiflügeliges Fenster darin, ruhig
    oeffnung = group([rect(144, 160, 0, 0, 6), stroke(INK, 4)], "oeffnung")
    fenster = group([rect(120, 136, 0, 0, 3), rect(54, 124, -30, 0, 2), rect(54, 124, 30, 0, 2), stroke(INK, 3, 32)], "fenster")
    L.append(layer("oeffnung", [oeffnung, fenster], 1, OP))
    # drei Breiten, nacheinander gezogen; die mittlere ist die kürzeste
    masse = [(-64, -60, 64, 10), (-60, 0, 56, 40), (-64, 60, 62, 70)]
    for n, (x1, y, x2, t0) in enumerate(masse):
        linie = group([path([(x1, y), (x2, y)]), stroke(MO, 4), trim(0, kf([(t0, 0), (t0 + 26, 100)]))], "linie")
        ticks = group([path([(x1, y - 7), (x1, y + 7)]), path([(x2, y - 7), (x2, y + 7)]), stroke(MO, 4, kf([(t0 + 22, 0), (t0 + 32, 100)]))], "ticks")
        ist_kuerzeste = n == 1
        # die längeren treten zurück, die kürzeste bleibt; am Ende blendet alles aus
        o = kfm([(0, 100, 'hold'), (118, 100, E_OUT), (136, 100 if ist_kuerzeste else 28, 'hold'), (196, 100 if ist_kuerzeste else 28, E_IN), (214, 0, 'hold'), (OP, 0)])
        L.append(layer("mass" + str(n), [linie, ticks], 2 + n, OP, o=o))
    # Markierung des kleinsten Maßes: ein Punkt setzt sich in die Mitte, mit Papierkern
    punkt = group([ellipse(14, 14), fill(PAPER), stroke(MO, 4)], "punkt",
                  s=kfm([(118, [0, 0], E_OUT), (134, [116, 116], E_OUT), (144, [100, 100], 'hold'), (196, [100, 100], E_IN), (212, [0, 0], 'hold'), (OP, [0, 0])]))
    L.append(layer("kleinstes", [punkt], 6, OP, p=(118, 120)))
    return anim("messen", L, OP)

# ---------------------------------------------------------------- fotos: der Sucher findet das Fenster, eine Linie liest es (Schleife, 2,8 s)
def fotos():
    OP = 168
    L = []
    fenster = group([rect(132, 104, 0, 0, 3), path([(0, -52), (0, 52)]), rect(118, 90, 0, 0, 2), stroke(INK, 3, 40)], "fenster")
    L.append(layer("fenster", [fenster], 1, OP))
    # vier Ecken des Suchers ziehen sich auf das Fenster zusammen
    ecken = []
    for sx, sy in [(-1, -1), (1, -1), (1, 1), (-1, 1)]:
        x, y = sx * 84, sy * 70
        ecken.append(path([(x, y - sy * 22), (x, y), (x - sx * 22, y)]))
    sucher = group(ecken + [stroke(INK, 5)], "sucher",
                   s=kf([(0, [124, 124]), (26, [100, 100])]), o=kf([(0, 0), (16, 100)]))
    L.append(layer("sucher", [sucher], 2, OP, o=kfm([(0, 100, 'hold'), (146, 100, E_IN), (160, 0, 'hold'), (OP, 0)])))
    # Leselinie mit weichem Band läuft einmal von oben nach unten
    band = group([rect(128, 26, 0, 0, 2), fill(EL, 12)], "band")
    linie = group([path([(-64, 0), (64, 0)]), stroke(EL, 3)], "linie")
    L.append(layer("lesen", [band, linie], 3, OP,
                   p=kfm([(30, [120, 72, 0], E_IO), (104, [120, 168, 0], 'hold'), (OP, [120, 168, 0])]),
                   o=kfm([(30, 0, E_OUT), (40, 100, 'hold'), (96, 100, E_OUT), (108, 0, 'hold'), (OP, 0)])))
    # drei Treffer: kleine Punkte, die sich nacheinander setzen (Rahmen, Glas, Griff)
    for n, (x, y, t0) in enumerate([(-44, -28, 62), (36, 2, 80), (-10, 34, 98)]):
        punkt = group([ellipse(10, 10), fill(EL)], "punkt",
                      s=kfm([(t0, [0, 0], E_OUT), (t0 + 10, [120, 120], E_OUT), (t0 + 18, [100, 100], 'hold'), (OP, [100, 100])]))
        ring = group([ellipse(10, 10), stroke(EL, 2.5)], "ring",
                     s=kfm([(t0 + 4, [100, 100], E_OUT), (t0 + 30, [320, 320], 'hold'), (OP, [320, 320])]),
                     o=kfm([(t0 + 4, 70, E_OUT), (t0 + 30, 0, 'hold'), (OP, 0)]))
        L.append(layer("treffer" + str(n), [ring, punkt], 4 + n, OP, p=(120 + x, 120 + y),
                       o=kfm([(0, 100, 'hold'), (146, 100, E_IN), (160, 0, 'hold'), (OP, 0)])))
    return anim("fotos", L, OP)

# ---------------------------------------------------------------- senden: das Blatt fliegt, der Weg bleibt kurz stehen (einmal, 1,9 s)
def senden():
    OP = 114
    L = []
    # Flugbahn: ein Bogen von links unten nach rechts oben; gepunktet, zeichnet sich mit dem Flieger
    P0, P1, P2 = (46, 150), (130, 128), (268, 46)
    bahn = group([path([P0, P1, P2], tang=([[0, 0], [-36, 14], [-14, 36]], [[46, -2], [52, -26], [0, 0]])),
                  stroke(INK, 3, 42, dash=(0.1, 9)), trim(0, kf([(8, 0), (66, 100)], E_IO))], "bahn")
    L.append(layer("bahn", [bahn], 1, OP, p=(0, 0), o=kfm([(0, 100, 'hold'), (92, 100, E_IN), (110, 0, 'hold'), (OP, 0)])))
    # Papierflieger: Umriss mit Papierfüllung, Faltlinie
    koerper = path([(24, -24), (7.2, 24), (-2.4, 2.4), (-24, -7.2)], closed=True)
    falte = path([(24, -24), (-2.4, 2.4)])
    fl = group([koerper, fill(PAPER)], "fuell")
    um = group([koerper, falte, stroke(INK, 4)], "umriss")
    pos = kfm([(8, [P0[0], P0[1], 0], E_IO), (66, [P2[0], P2[1], 0], 'hold'), (OP, [P2[0], P2[1], 0])])
    # räumliche Tangenten, damit der Flieger dem Bogen folgt
    pos["k"][0]["to"] = [60, -8, 0]; pos["k"][0]["ti"] = [-40, 50, 0]
    L.append(layer("flieger", [fl, um], 2, OP, p=pos,
                   r=kfm([(8, 40, E_IO), (40, 12, E_IO), (66, -24, 'hold'), (OP, -24)]),
                   s=kfm([(8, [100, 100], E_OUT), (66, [128, 128], 'hold'), (OP, [128, 128])]),
                   o=kfm([(0, 0, E_OUT), (14, 100, 'hold'), (OP, 100)])))
    # Ankunft: ein Ring läuft am Ziel aus
    ring = group([ellipse(30, 30), stroke(OK, 3.5)], "ring",
                 s=kfm([(62, [20, 20], E_OUT), (92, [150, 150], 'hold'), (OP, [150, 150])]),
                 o=kfm([(62, 0, E_OUT), (70, 70, E_IN), (92, 0, 'hold'), (OP, 0)]))
    L.append(layer("ring", [ring], 3, OP, p=(P2[0] + 6, P2[1] - 8)))
    return anim("senden", L, OP, w=320, h=200)

# ---------------------------------------------------------------- eingang: ein Aufmaß landet im Projekt (Schleife, 4,4 s)
def eingang():
    OP = 264
    L = []
    # Ablage: offene Schale
    schale = group([path([(-66, -24), (-66, 54), (66, 54), (66, -24)], tang=([[0, 0], [0, -6], [-6, 0], [0, 0]], [[0, 0], [6, 0], [0, -6], [0, 0]])),
                    stroke(INK, 4)], "schale")
    L.append(layer("schale", [schale], 1, OP, p=(120, 136)))
    # Blatt: Karte mit drei Zeilen und einer kleinen Zeichnung, fällt in die Schale und setzt sich
    karte = group([rect(88, 108, 0, 0, 8), fill(PAPER)], "karte")
    rand = group([rect(88, 108, 0, 0, 8), stroke(INK, 4)], "rand")
    zeilen = group([path([(-28, -22), (28, -22)]), path([(-28, -6), (16, -6)]), path([(-28, 10), (24, 10)]), stroke(INK, 3.5, 32)], "zeilen")
    fensterchen = group([rect(30, 22, 0, 30, 2), path([(0, 19), (0, 41)]), stroke(INK, 2.5, 60)], "fensterchen")
    L.append(layer("blatt", [karte, rand, zeilen, fensterchen], 2, OP,
                   p=kfm([(6, [120, 10, 0], E_IO), (56, [120, 118, 0], E_OUT), (66, [120, 112, 0], 'hold'), (200, [120, 112, 0], E_IN), (222, [120, 60, 0], 'hold'), (OP, [120, 60, 0])]),
                   r=kfm([(6, -6, E_IO), (56, 2, E_OUT), (66, 0, 'hold'), (OP, 0)]),
                   o=kfm([(6, 0, E_OUT), (22, 100, 'hold'), (200, 100, E_IN), (218, 0, 'hold'), (OP, 0)])))
    # Haken-Plakette oben rechts an der Karte
    plakette = group([ellipse(26, 26), fill(OK)], "plakette")
    haken = group([path([(-6, 0), (-2, 4), (6, -5)]), stroke(PAPER, 3.5)], "haken")
    L.append(layer("plakette", [plakette, haken], 3, OP, p=(160, 62),
                   s=kfm([(70, [0, 0], E_OUT), (84, [116, 116], E_OUT), (94, [100, 100], 'hold'), (OP, [100, 100])]),
                   o=kfm([(0, 100, 'hold'), (196, 100, E_IN), (212, 0, 'hold'), (OP, 0)])))
    # Schale deckt den unteren Teil der Karte (Vorderwand) ab
    vorne = group([rect(126, 34, 0, 40, 0), fill(PAPER)], "vorne")
    vorne_rand = group([path([(-66, 23), (-66, 54), (66, 54), (66, 23)], tang=([[0, 0], [0, -6], [-6, 0], [0, 0]], [[0, 0], [6, 0], [0, -6], [0, 0]])), stroke(INK, 4)], "vorne_rand")
    L.insert(2, layer("vorderwand", [vorne, vorne_rand], 4, OP, p=(120, 136)))
    return anim("eingang", L, OP)

# ---------------------------------------------------------------- fertig: Kreis, Haken, vier kurze Striche (einmal, 1,3 s)
def fertig():
    OP = 78
    L = []
    flaeche = group([ellipse(150, 150), fill(OK, kf([(14, 0), (40, 12)]))], "flaeche")
    kreis = group([ellipse(150, 150), stroke(OK, 5), trim(0, kf([(0, 0), (38, 100)], E_IO), 0)], "kreis")
    L.append(layer("kreis", [flaeche, kreis], 1, OP))
    haken = group([path([(-36, 2), (-12, 26), (38, -26)]), stroke(OK, 7), trim(0, kf([(22, 0), (50, 100)]))], "haken")
    L.append(layer("haken", [haken], 2, OP))
    for n in range(4):
        a = math.radians(45 + n * 90)
        x1, y1 = math.cos(a) * 90, math.sin(a) * 90
        x2, y2 = math.cos(a) * 110, math.sin(a) * 110
        s = group([path([(x1, y1), (x2, y2)]), stroke(OK, 4), trim(kf([(40, 0), (58, 100)]), kf([(34, 0), (50, 100)]))], "strich")
        L.append(layer("strich" + str(n), [s], 3 + n, OP))
    return anim("fertig", L, OP)

if __name__ == '__main__':
    ziel = sys.argv[1]
    os.makedirs(ziel, exist_ok=True)
    for f in (messen, fotos, senden, eingang, fertig):
        d = f()
        p = os.path.join(ziel, f.__name__ + '.json')
        json.dump(d, open(p, 'w'), separators=(',', ':'))
        print(p, os.path.getsize(p), 'B', d['op'] / FR, 's')

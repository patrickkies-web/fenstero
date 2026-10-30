"""Postleitzahlen in Deutschland mit Mittelpunkt und Ortsnamen für die Suche nach Fensterbetrieben (functions/api/plz-de.js).

Quelle: GeoNames, Postal Code Dataset DE (https://download.geonames.org/export/zip/DE.zip), Lizenz Creative Commons Attribution 4.0.
Aufruf: python3 -I scripts/plz-tabelle.py <Pfad zu DE.zip>  (schreibt functions/api/plz-de.js)

- Großkunden: GeoNames führt neben den Orten auch Firmen und Behörden mit eigener PLZ (GmbH, Bank, Stadtverwaltung, GEMA …), oft weit
  weg von ihrer Leitregion. Ihre Einträge haben kein Genauigkeitsfeld (Spalte 12 leer); die Einträge der Orte haben eines (4, 6 oder 1).
  Eine PLZ kommt in die Tabelle, wenn sie einen Eintrag mit Genauigkeit hat, oder einen Ortsnamen (kein Firmenwort, FIRMA) höchstens
  60 km vom Mittel ihrer Leitregion (die ersten zwei Ziffern); reine Großkunden-PLZ bleiben draußen.
- Mittelpunkt: aus den Einträgen mit Genauigkeit, sonst aus den Ortsnamen. Ortsname: aus den Einträgen mit Genauigkeit; eine PLZ ohne
  solche (auch dort stehen oft Firmen, deren Namen FIRMA nicht erkennt, etwa „Erzbischöfliches Ordinariat“) bekommt den Ort der nächsten
  PLZ mit Genauigkeit. Stützpunkte nur aus PLZ mit Genauigkeit.
- VORRAT: Stützpunkte für den Vorrat an Betrieben, gierig so gewählt, dass jede PLZ höchstens 20 km von einem entfernt ist; dicht
  besiedelte (viele PLZ im Umkreis) zuerst.
"""
import collections
import json
import math
import re
import sys
import zipfile
from pathlib import Path

R_KM = 20
FIRMA = re.compile(r'GmbH|mbH|\bAG\b|\bKG\b|\bOHG\b|\bSE\b|e\. ?V\.|Co\.|[Bb]ank|[Vv]ersicherung|[Ss]parkasse|[Vv]erwaltung|[Ff]inanzamt|\b[Aa]mt\b|'
                   r'[Uu]niversität|[Hh]ochschule|[Kk]linik|[Kk]rankenhaus|[Pp]ostfach|[Gg]esellschaft|Deutsche |\bLandes|\bBundes|[Mm]inisterium|'
                   r'[Bb]ehörde|[Rr]undfunk|[Ff]ernsehen|[Vv]erlag|[Ss]tadtwerke|[Aa]gentur|[Kk]asse\b|[Zz]entrale|[Ss]ervice|[Hh]olding|[Gg]roup|'
                   r'[Vv]ertrieb|[Ll]eitstelle|[Pp]räsidium|[Gg]ericht|[Kk]ammer|[Ii]nstitut|[Ss]tiftung|[Vv]erband|[Ww]erke\b')
STAND = '2026-10-30'


def km(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    return 6371 * 2 * math.asin(math.sqrt(math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2))


def main(zip_pfad):
    zeilen = zipfile.ZipFile(zip_pfad).read('DE.txt').decode('utf-8').splitlines()
    eintraege = collections.defaultdict(list)
    for z in zeilen:
        f = z.split('\t')
        if len(f) < 11 or not re.fullmatch(r'\d{5}', f[1]):
            continue
        eintraege[f[1]].append((f[2].strip(), float(f[9]), float(f[10]), len(f) > 11 and f[11].strip() != ''))
    mitte = lambda l: (sum(x[1] for x in l) / len(l), sum(x[2] for x in l) / len(l))
    # Mittel je Leitregion aus den Einträgen mit Genauigkeit
    region = collections.defaultdict(list)
    for p, l in eintraege.items():
        genau = [x for x in l if x[3]]
        if genau:
            region[p[:2]].append(mitte(genau))
    region = {r: (sorted(a for a, _ in v)[len(v) // 2], sorted(b for _, b in v)[len(v) // 2]) for r, v in region.items()}
    out = {}
    for p, l in eintraege.items():
        genau = [x for x in l if x[3]]
        orte = [x for x in l if not FIRMA.search(x[0])]
        if genau:
            basis = genau
        elif orte and p[:2] in region and km(mitte(orte), region[p[:2]]) <= 60:
            basis = orte
        else:
            continue
        lat, lon = mitte(basis)
        name = next((x[0] for x in genau if not FIRMA.search(x[0])), None)
        out[p] = [round(lat, 3), round(lon, 3), name]
    regulaer = {p for p in out if any(x[3] for x in eintraege[p])}
    mit_ort = [p for p in out if out[p][2]]
    for p in out:
        if not out[p][2]:
            naechste = min(mit_ort, key=lambda q: km(out[p], out[q]))
            out[p][2] = out[naechste][2]
    # Stützpunkte des Vorrats
    rest = set(regulaer)
    stuetz = []
    while rest:
        p0 = min(rest, key=lambda p: (-out[p][0], out[p][1]))
        kand = [p for p in rest if km(out[p], out[p0]) <= R_KM]
        best = max(kand, key=lambda c: (sum(1 for q in kand if km(out[q], out[c]) <= R_KM), c))
        stuetz.append(best)
        rest -= {q for q in rest if km(out[q], out[best]) <= R_KM}
    dicht = {s: sum(1 for q in regulaer if km(out[q], out[s]) <= R_KM) for s in stuetz}
    stuetz.sort(key=lambda s: (-dicht[s], s))
    daten = '|'.join('%s,%d,%d,%s' % (p, round(out[p][0] * 1000), round(out[p][1] * 1000), out[p][2].replace('|', '/').replace(',', ' ')) for p in sorted(out))
    js = ('/* eeziframes · Postleitzahlen in Deutschland mit Mittelpunkt und Ortsnamen, für die Suche nach Fensterbetrieben (vermittlung-ort.js).\n'
          '   Quelle: GeoNames, Postal Code Dataset DE (https://www.geonames.org), Lizenz Creative Commons Attribution 4.0. Gebaut mit\n'
          '   scripts/plz-tabelle.py (Stand ' + STAND + '). Je Eintrag: PLZ, Breite und Länge in Tausendstel Grad, Ort; Großkunden-PLZ tragen den Ort der\n'
          '   nächsten PLZ. VORRAT: Stützpunkte des Vorrats, jede PLZ höchstens ' + str(R_KM) + ' km entfernt, dicht besiedelte zuerst. */\n'
          'export const PLZ_DATEN = ' + json.dumps(daten, ensure_ascii=False) + ';\n'
          'export const VORRAT = ' + json.dumps(','.join(stuetz)) + ';\n')
    ziel = Path(__file__).resolve().parent.parent / 'functions' / 'api' / 'plz-de.js'
    ziel.write_text(js, encoding='utf-8')
    print('%d Postleitzahlen, %d Stützpunkte, %d Bytes → %s' % (len(out), len(stuetz), len(js.encode('utf-8')), ziel))


if __name__ == '__main__':
    main(sys.argv[1])

#!/usr/bin/env python3
"""eeziframes · Das Zeichen an allen Stellen gleich setzen: Licht fällt durch ein Fenster in einen dunklen Raum.
Eine Quelle (INNEN, 64 × 64), von hier aus verteilt auf:
  web/assets/gemeinsam.js (Logo.svg für App und Betriebsbereich), web/assets/zentrale.js, web/favicon.svg und das Zeichen
  in den Köpfen aller statischen Seiten (Startseite, Ratgeber, Fensterbauer-Seite, Rechtsseiten, Widerruf, 404).
Das PDF zeichnet dieselben Punkte selbst (web/assets/blatt.js, marke), die E-Mails tragen ein PNG davon (functions/api/marke.js,
erzeugt mit scripts/marke-bilder.mjs). scripts/pruefen.mjs prüft, dass überall dasselbe Zeichen steht.
   python3 scripts/logo-setzen.py
Aufbau: Kachel (fi-kachel), drei Lichtflächen (fi-licht: Decke, Fenster, Lichtstreifen am Boden; der Streifen läuft unten links
aus der Kachel und endet an ihrer Rundung), dazu ein Haarstrich (fi-rand), den man nur über dem Lichtstreifen sieht; im dunklen
Modus wird er hell (gemeinsam.css, recht.css), damit sich die Kachel vom schwarzen Hintergrund abhebt."""
import pathlib, re, sys

WURZEL = pathlib.Path(__file__).resolve().parent.parent
WEB = WURZEL / 'web'

INNEN = ('<rect class="fi-kachel" width="64" height="64" rx="10" fill="#000"/>'
         '<g class="fi-licht" fill="#fff">'
         '<path class="fi-decke" d="M26.4 12.2 44.4 19.7 56.3 15.3 42 6.6Z"/>'
         '<path class="fi-fenster" d="M45 22 57 17.6V41.9L45 39.8Z"/>'
         '<path class="fi-strahl" d="M44.2 41 55.9 43.3 11.7 64H10A10 10 0 0 1 0 54Z"/>'
         '</g>'
         '<rect class="fi-rand" x=".5" y=".5" width="63" height="63" rx="9.5" fill="none" stroke="#000" stroke-opacity=".1"/>')

STATISCH = '<svg viewBox="0 0 64 64" aria-hidden="true">' + INNEN + '</svg>'
FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
           '<style>@media (prefers-color-scheme: dark){.fi-rand{stroke:#fff;stroke-opacity:.2}}</style>' + INNEN + '</svg>\n')

# Ein Zeichen im Seitenkopf: altes (Fenster mit vier Scheiben, rx="16") oder schon neues (fi-kachel)
ZEICHEN = re.compile(r'<svg viewBox="0 0 64 64" aria-hidden="true">(?:(?!</svg>).)*?</svg>', re.S)
KOPF_404 = ('<header class="kopf"><div>\n  <a class="marke" href="/">' + STATISCH +
            '<span class="wm" translate="no"><b>eezi</b>frames</span></a>\n'
            '  <nav><a href="/">Startseite</a><a href="/app/">App</a></nav>\n</div></header>\n')


def ersetzen(pfad, alt, neu, anzahl=1):
    t = pfad.read_text(encoding='utf-8')
    n = t.count(alt)
    if n != anzahl:
        sys.exit('%s: %d statt %d Treffer' % (pfad, n, anzahl))
    pfad.write_text(t.replace(alt, neu), encoding='utf-8')


def main():
    geaendert = []
    # 1. gemeinsam.js: Logo.svg(px)
    g = WEB / 'assets' / 'gemeinsam.js'
    t = g.read_text(encoding='utf-8')
    t2 = re.sub(r"var LOGO_INNEN = '[^']*';", lambda m: "var LOGO_INNEN = '" + INNEN + "';", t, count=1)
    if t2 == t and INNEN not in t:
        sys.exit('gemeinsam.js: LOGO_INNEN nicht gefunden')
    if t2 != t:
        g.write_text(t2, encoding='utf-8'); geaendert.append(g)
    # 2. zentrale.js
    z = WEB / 'assets' / 'zentrale.js'
    t = z.read_text(encoding='utf-8')
    t2 = re.sub(r"var LOGO = '<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" class=\"z-logo\">.*?</svg>';",
                lambda m: "var LOGO = '<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" class=\"z-logo\">" + INNEN + "</svg>';", t, count=1)
    if t2 == t and INNEN not in t:
        sys.exit('zentrale.js: LOGO nicht gefunden')
    if t2 != t:
        z.write_text(t2, encoding='utf-8'); geaendert.append(z)
    # 3. favicon.svg
    f = WEB / 'favicon.svg'
    if f.read_text(encoding='utf-8') != FAVICON:
        f.write_text(FAVICON, encoding='utf-8'); geaendert.append(f)
    # 4. statische Seiten
    for p in sorted(WEB.rglob('*.html')):
        t = p.read_text(encoding='utf-8')
        t2 = ZEICHEN.sub(lambda m: STATISCH if ('rx="16"' in m.group(0) or 'fi-kachel' in m.group(0)) else m.group(0), t)
        if p.name == '404.html' and 'class="kopf"' not in t2:
            t2 = t2.replace('<body>\n', '<body>\n' + KOPF_404, 1)
        if t2 != t:
            p.write_text(t2, encoding='utf-8'); geaendert.append(p)
    for p in geaendert:
        print('gesetzt:', p.relative_to(WURZEL))
    print(len(geaendert), 'Dateien')


if __name__ == '__main__':
    main()

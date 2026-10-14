# Gestaltung

Fensterino ist ein Präzisionswerkzeug: Schrift führt, das Fenster ist das Bild, alles andere tritt zurück. Diese Seite ist die Regel; die Werte stehen als Tokens in `web/assets/gemeinsam.css` (lädt vor `app.css` und `portal.css`).

## System

**Farbe.** Papier `#f3f2ee`, Fläche `#fff`, Fläche 2/3 `#ecebe6`/`#e1e0da`, Tinte `#141414`, Tinte 2 `#3d3d3a`, Nebentext `#63635e`, Linie `rgba(20,20,20,.09|.17)`. Primär ist Tinte (schwarze Knöpfe, Papier-Schrift). Ein Akzent, Blau `#1d4ed8`, nur für Links, Fokus und das Fensterelement in der Zeichnung; Orange `#c2410c` ist die Maueröffnung. Status: ok `#15733a`, warn `#9a5b00`, bad `#b42318`, immer als Wort mit Punkt oder Symbol, nie als farbige Fläche. Dunkel über `prefers-color-scheme` und `[data-theme="dark"]`. Farben kommen ausschließlich aus Tokens; Verläufe gibt es nicht.

**Schrift.** Maven Pro, sechs Rollen je Oberfläche, nichts unter 13 px.
App: 40 Zahl/Hero · 32 Titel · 24 Zwischentitel · 17 Text · 15 Nebentext · 13 Label.
Betriebsbereich: 44 Hero · 30 Titel (26 am Telefon) · 22 Zwischentitel · 17 Text · 15 Nebentext · 13 Label. Große Zahlen (Kennzahlen, Preise) tragen die Titelrolle.

**Fläche, Form, Raum.** Karten liegen mit einem 1-px-Ring auf dem Papier (`--ring`); Schatten wirft nur, was schwebt (`--lift` Hover, `--float` Blätter). Radien 8 · 12 · 18 · 24. Kontrollhöhen 44 (`--h1`: Chips, kleine Knöpfe, Segmente) und 52 (`--h2`: Knöpfe, Segment-Gruppen außen). Raster 4 px, Abstände 8 · 12 · 16 · 20 · 24.

**Bewegung.** Drei Dauern 150 · 220 · 320 ms, zwei Kurven (`--e-out`, `--e-io`). Katalog, mehr gibt es nicht:
1 Erscheinen (8 px aufwärts, gestaffelt nur beim Aufbau) · 2 Wechsel (App gleitet, Betriebsbereich blendet) · 3 Bestätigen (ein Haken wird gezogen) · 4 Fehler (Rütteln, 300 ms) · 5 Fortschritt (Balken, Ringe, Zahlen laufen nach) · 6 Einrasten (eine Zahl setzt sich aus 1,06) · 7 Öffnen/Schließen (Blatt steigt auf, mittig am Schreibtisch) · 8 Laden (ruhige Drehung). Dazu zwei Rückmeldungen am Objekt: Markieren (Ring läuft um das Neue) und Puls (Ring läuft aus). Bei „weniger Bewegung“ läuft nichts.

## Komponenten

Alle Zustände je Element: Ruhe, Hover (nur bei `hover: hover`), gedrückt (`scale(.98)`), gewählt (Tinte auf Papier), Fokus (2-px-Tintenrahmen, nur Tastatur), gesperrt (40 % Deckkraft). Keine Größenänderung beim Wählen, Zielflächen mindestens 44 px, Text in Knöpfen einzeilig (Ellipse) oder bewusst zweizeilig mit fester Höhe.

| Element | Regel |
|---|---|
| Knopf `.btn` | 52 px, Radius 14, 17 px fett. `primary` Tinte, `ghost` Ring, `soft` Fläche 2, `danger`/`ok` als Wort in Statusfarbe. `small` 44, `big` 56. |
| Segmente `.seg` | 2–3 Optionen, gleich breit, außen 52 / innen 44. `.fit`: Inhaltsbreite, wenn Beschriftungen zu verschieden lang sind (Projektfilter). |
| Chips `.chip` | 44 px, Ring, gewählt Tinte. `.grid2`/`.grid3` für gleich breite Reihen. |
| Auswahl in Fragen (App, `auswahl()`) | ≤ 3 kurze Optionen → Segmente · ≤ 6 kurze Optionen → Chips in zwei gleich breiten Spalten · mit Symbol: 2–3 Karten nebeneinander, 4 Karten als 2×2 mit Symbol links und zweizeiliger fester Beschriftung, mehr als 4 als Reihe zum Wischen (112 px) · lange Beschriftungen → Liste mit Markierungskreis · Farben → Tupfen mit Namen. |
| Karten `.card` | Fläche, Ring, Radius 18; Hervorhebung durch Ring in Tinte (`.hi`), nicht durch Farbe. |
| Status `.badge` | 13 px, Fläche 2, Statusfarbe nur als Punkt oder Symbol. |
| Kennzahl `.stat` | Zahl in Titelrolle, Symbol in Statusfarbe, am Telefon als Zeile. |
| Blatt `.sheet` | Telefon: von unten; Schreibtisch: mittig, Radius 24, `--float`. |
| Eingaben | 48 px, Ring, Fokus Tinte; Messwert 32 px fett. |
| Hinweis `.fx-pilot` | eine Tintenzeile oben, schließbar, verschwindet im Servermodus. |

## Rückmeldung statt Feier

Konfetti ist vollständig entfernt (`Feier.konfetti`, `.fx-konfetti`, alle Aufrufe, Prüfungen angepasst). Jeder frühere Moment hat eine Rückmeldung am Gegenstand:

| Moment | Vorher | Jetzt |
|---|---|---|
| App · alle vier Maße da | Konfetti | Maßlinien am 3-D-Modell zeichnen sich nacheinander, die vier Werte rasten ein |
| App · Fenster gespeichert | Konfetti | Haken wird gezogen, der Name setzt sich |
| App · Aufmaß abgeschickt / gekauft | Konfetti | Haken bzw. Flieger, ein Ring läuft aus dem Zeichen |
| App · PDF gespeichert | Konfetti | Ring um die Dateikarte |
| App · Kopie geteilt | Konfetti | Ring um den erledigten Weg |
| Betrieb · Projekt angelegt | Konfetti | Haken wird gezogen, Ring um die Karte „Projekt angelegt“ |
| Betrieb · Aufmaß eingegangen | Konfetti | Ring um die Aufmaß-Karte |
| Betrieb · Link gesendet | Puls | Puls am Status |
| Betrieb · Registrierung, Liste angelegt | Konfetti | nichts Zusätzliches: die Seite baut sich gestaffelt auf, der Hinweis nennt die Zahl |

## Entscheidungen

- Primärfarbe ist Tinte, nicht Blau. Blau bleibt dem Fensterelement, Orange der Maueröffnung; so liest man die Zeichnung, nicht die Knöpfe.
- Zwei Knopfhöhen (44/52), nicht fünf. Segment-Gruppen sind außen so hoch wie Knöpfe, damit Reihen bündig sind.
- Bedienelemente in Fragen folgen einer Regel nach Anzahl und Länge der Optionen statt je Frage einer Lösung.
- Status als Wort mit Punkt. Farbige Pillen gibt es nicht mehr; Tönung bleibt den beiden Maßfarben und Hinweiskarten vorbehalten.
- Schmuckbewegung entfernt: Neigen der Karte, Magnetknöpfe, Parallaxe, Lesefortschritt. Zahlen zählen beim Aufbau einmal hoch (Katalog 5).
- Blätter am Schreibtisch mittig statt am unteren Rand.
- Die Telefon-Attrappe und die Bühne „So läuft es“ sind Illustration; dort gelten die Rollen sinngemäß (verkleinerte Oberfläche), aber nie unter 13 px.
- Pilot-Hinweis bleibt eine Tintenzeile; am Telefon wird er länger, verschwindet aber im Servermodus. Text unverändert.
- Bewusst gelassen: PDF-Zeichner, Server, Abrechnung, Abläufe, Reihenfolge, Texte, Datenmodell.

## Nachweis

Gemessen mit Playwright über 96 Bildschirme (56 App am Telefon, 20 Betrieb Schreibtisch, 20 Betrieb Telefon): kein Umbruch oder Überlauf in Bedienelementen, keine ungleichen Höhen in einer Reihe, keine Zielfläche unter 44 px, keine Schrift unter 13 px, Kontrast ≥ 4,5:1 (≥ 3:1 groß), kein Querscrollen, genau sechs Schriftgrößen je Oberfläche, bei „weniger Bewegung“ keine laufende Animation. Prüfsuite `scripts/pruefen.mjs`: 181 Prüfungen grün. Vorher/Nachher je Bildschirm liegt dem Pull Request bei (`docs/gestaltung/`).

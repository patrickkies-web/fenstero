# 04.1 Ihre Marke: Kopf, Namensleiste, Kartenreihe (#pakete)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 6 von 15 (Kapitel 04, Block 1 von 3; nach `fb-05-ihr-postfach`, vor `fb-07-entscheidungshilfe-vergleich`) · Intensitätsstufe: 2 klar (Typ T7 Paketentscheidung, ohne inszenierende Signature)

Phase I, Stand 24.10.2026, Planungsdokument (nichts gebaut). Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (ZA) und
[10-paketentscheidung.md](../10-paketentscheidung.md) (PE, für Pakete verbindlich; hier auf `fb-06` zugeschnitten); VK =
`web/fuer-fensterbauer/index.html`, PB = `web/konfigurator-bedingungen/index.html`. **[V]** verbindlich, **[H]** Hypothese mit Rückfall,
**Festlegung I-n** = Entscheidung dieser Spezifikation. Pixellagen geplant; Textbreiten mit Inter (`web/fonts/`) in Chromium gemessen.

---

## A. Abschnitt und Funktion

- **Name:** Kapitel 04 „Ihre Marke“, Block 1: Abschnittskopf, Namensleiste, Kartenreihe der drei Pakete. h2 mit Pflichtanker `#pakete`
  (Prüfsuite 29.3), Karten mit `#paket-essential`, `#paket-plus`, `#paket-signature`.
- **Position:** sechster Abschnitt; Telefon ab ≈ 4,35 BH (bei 844 px Bildschirm 5, bei 664 px Bildschirm 6), Schreibtisch ab ≈ 4,0 BH
  (ZA 8.3.2). Davor 03 „Ihr Postfach“ (Stufe 3, Aufmaßblatt), dessen Textziel **Textentwurf** „Wie sehr soll er Ihre Marke tragen?“ hierher
  springt; danach im selben Kapitel `fb-07` (Verkaufsstand, Vergleich; PE Festlegung 10-1) und `fb-08` (Festblock, Gesprächsweg). Weitere
  Zugänge: Cream „Pakete ansehen“ im Startbild, Kopf-Ring, Menü, Abschluss `fb-15`.
- **Ziel (EA S4):** Preis und Markenstufe bewerten. Alle drei Monatspreise auf einen Blick, eine Karte vom Namen bis zum Knopf, die
  Markenstufe als Bild statt als Liste.
- **Beantwortete Nutzerfrage:** „Was kostet es im Monat und einmalig, und welches Paket passt zu meinem Betrieb?“
- **Vorbereitete Entscheidung:** Tipp auf einen Kartenknopf („… anfragen“ in Zustand A, „… bestellen“ in Zustand B) = Paketwahl (E-3).
  Z1+ über die begründete Empfehlung, das Bild der höheren Stufe direkt nebenan und die Datenblattzeile „Für Ihr Team“.
- **Grenze:** Der Block enthält keine Risikofakten (die stehen 24 px tiefer im Festblock, `fb-08`) und keinen Vergleich (`fb-07`).

## B. Konkreter Inhalt

**Inhalte in Lesereihenfolge**

| Element | Wortlaut | Fundstelle | Status |
|---|---|---|---|
| Kapitelzeile | „04 · IHRE MARKE“, „04“ grün | EV 7.5.2 | Textentwurf |
| h2 | „Die **Pakete**“, grün „Pakete“, `id="pakete"` | VK:171; Prüfsuite 29.3 | Bestand wörtlich |
| Lead 17 | „Ein Konfigurator, drei Stufen **Ihrer Marke**. In allen: eigene Domain, jede Anfrage als PDF, keine Gebühr je Anfrage.“ (gemessen: 3 Zeilen bei 358 px, 2 bei 685 px) | VK:172, :236, :237 | Textentwurf; Rückfall VK:172 wörtlich |
| Namensleiste | „Essential · 29 €“, „Essential Plus · 39 €“, „Signature · 64 €“ | `functions/pakete-seite.js:31`; `web/assets/pakete.js:44`, `:52`, `:60` | Bestand, um Preise ergänzt (AB-11) |
| Pille | „Empfohlen“ (nur Plus, solange O-5 offen) | `functions/pakete-seite.js:33`, `:117`; SKILL:49 | Bestand |
| Paketname | „EEZI Essential“, „EEZI Essential Plus“, „EEZI Signature“ | `web/assets/pakete.js:44`, `:52`, `:60` | Bestand wörtlich |
| „Wenn“-Satz 15 = Empfehlungs- und Passungsgrund | Essential: „Wenn Ihr Name genügt: der volle Konfigurator im eeziframes-Design.“ · Plus: „Wenn Ihre Kunden Ihr Logo, Ihre Farbe und Ihre Fotos sehen sollen.“ · Signature: „Wenn Ihre Kunden eeziframes nicht sehen sollen, mit Dashboard.“ (je 2 Zeilen bei 270 px) | `web/assets/pakete.js:46`, `:54`, `:62-65`; PE 10.4 B | Textentwurf; Rückfall `kurzText()` (`functions/pakete-seite.js:59-63`) |
| Preis | `<b>39 €</b> im Monat` (U+202F vor „€“) | `functions/pakete-seite.js:30`, `:120`; Prüfsuite 29.1 | Bestand wörtlich |
| Bindung 15 | „ab Livegang, monatlich kündbar“ | PB § 4, VK:243 | Textentwurf (J-R15) |
| Einrichtung 15 | „**199 € Einrichtung**, einmalig vorab: Anruf, Domain, Gestaltung, Vorschau“ (99 / 199 / 279 €) | `functions/pakete-seite.js:121`; PB § 5 (1), (3), § 6 (1) | Textentwurf (J-R13); Teilzeichenkette „199 € Einrichtung“ bleibt zusammenhängend (Prüfsuite 29.1) |
| Steuerzeile 13 | „netto zzgl. MwSt. · nur für Unternehmer“ | `functions/pakete-seite.js:44`, `:122` | Bestand wörtlich |
| Knopf | A: „Essential Plus anfragen“, `href="#bestellen" data-paket="plus"` · B: „Essential Plus bestellen“ → `/partner/#bestellen/plus` | `functions/pakete-seite.js:113-115`; Prüfsuite 29.2 | Bestand wörtlich |
| Satz unter dem Knopf, nur B | „Erst Ihre Angaben, bezahlt wird im letzten Schritt.“ | `web/assets/partner.js:161-175`, `:296-300` | Textentwurf [H, J-H6] |
| Browserleiste | Schloss + „ihr-name-fenster.de · Beispiel“ | `functions/pakete-seite.js:107`; E-12; G7 | Bestand, um „· Beispiel“ ergänzt |
| Beispielbild | Startansicht des Beispielbetriebs „Fensterbau Brandt“ in der Markenstufe des Pakets | `web/assets/einladung.js:172`, `:193`, `:199-203`; `BEISPIEL_BILD` `functions/pakete-seite.js:96` | fehlt; bis dahin Skizze `:99-104` |
| Datenblatt, 4 Zeilen (Kennwort / Wert je Paket) | GESTALTUNG: „eeziframes-Design, Ihr Name“ / „Ihr Logo, Ihre Farbe, bis 6 Fotos“ / dasselbe · HINWEIS AUF EEZIFRAMES: „„Powered by EEZIframes““ / „kleiner Hinweis im Fuß“ / „keiner“ · IN SUCHMASCHINEN: „nein“ / „Startseite“ / „Startseite“ · FÜR IHR TEAM: „nicht enthalten“ / „nicht enthalten“ / „Dashboard, Einladungslinks, 5 Zugänge“ | `web/assets/pakete.js:77`, `:83`, `:88`, `:93-96` | Werte Bestand; Auswahl und Kürzung Textentwurf (J-R10, E-6) |
| Umschalter | „Leistungen ansehen“ / „Leistungen ausblenden“ | `functions/pakete-seite.js:123`; `web/assets/verkauf.js:350-357` | Bestand |
| Leistungsliste | `punkte()`, Unterschiede zuerst; Signature mit „… sobald eingerichtet“ | `functions/pakete-seite.js:65-82`; Prüfsuite 29.4 | Bestand, umgestellt (J-R11) |
| Demo-Link, nur `PAKETE_DEMOS=1` | „Demo ansehen“ → `https://demo-<paket>.eeziframes.com/` | `functions/pakete-seite.js:15-16`, `:166-169` | Textentwurf [H, J-H7] |

**Unterschiedszeile (Variante, nicht Grundfassung).** Der Auftrag nennt sie; PE Festlegung 10-2 macht sie verbindlich zur Variante J-H5,
weil eine Zeile nur mit der Monatsdifferenz die Einrichtungsdifferenz verschweigt. Grundfassung: Der Unterschied steht im „Wenn“-Satz, im
Bild und im Datenblatt. Variante, wenn geprüft wird: 13 px `--text2`, zwei Zeilen (gemessen), 8 px unter dem Knopf, **Textentwurf** aus
`web/assets/pakete.js:44-60` gerechnet: Plus „Gegenüber Essential: +10 € im Monat, +100 € einmalig“, Signature „Gegenüber Essential Plus:
+25 € im Monat, +80 € einmalig“; Essential lässt die Zeile leer (gleiche Kartenstruktur, J-R5). Nie über dem Knopf, sonst endet er bei
664 px außerhalb des Bildes.

**Empfehlungsgrund.** Der „Wenn“-Satz ist der sachliche Grund der Empfehlung (J-R8). Rückfall nach J-H15: `kurzText()` plus der Grund aus
EA 4.3.3/6 an der empfohlenen Karte, **Textentwurf** „Empfohlen, wenn Ihre Kunden Ihr Logo, Ihre Farbe und Ihre Fotos sehen sollen und Ihre
Startseite in Suchmaschinen erscheinen soll.“ Welches Paket empfohlen wird, entscheidet der Inhaber (J-O-1).

**Interaktionen:** Wischen der Reihe (Telefon, bis 899 px); Tipp auf ein Segment der Namensleiste (navigiert, wählt nicht, E-3); Tipp auf
einen Kartenknopf (Wahl); „Leistungen ansehen“; mit Demos: Demo-Link; Hover und Tastatur am Schreibtisch.

**Vorhandene Komponenten:** `karten()`, `beispiel()`, `skizze()`, `punkte()` (`functions/pakete-seite.js`); `pakete()` mit `--a`,
`--p`, `zu()` (`web/assets/verkauf.js:340-404`), Vorwahl (`:25-35`); Raster und Browserrahmen (`web/assets/verkauf.css:21-91`); Tokens
(`web/assets/gemeinsam.css:9-32`). Änderungen je Datei in H.

## C. Exakte Layoutkomposition

**Grundstruktur (G2):** Kopf (Haarlinie, Kapitelzeile, h2, Lead) → Namensleiste → Kartenreihe; in jeder Karte Preisblock → Knopf → Held
(Beispielbild) → Datenblatt → Umschalter. Ordnungslinie ist die linke Spaltenkante x = 16, in der Karte ihre linke Innenkante x = 60
(G5). Asymmetrisch: alles linksbündig, nur die Karte sitzt durch das Einrasten mittig.

**Telefon 390 × 844** – 4 Spalten à 77,5 px, Rand 16, Abstand 16. y im Bildschirm nach dem Sprung auf `#pakete` (`scroll-margin-top`
116 px). Die Reihe bricht über beide Ränder.

| y (px) | Element | x · Maß | Ebene |
|---|---|---|---|
| 0–56 | Kopf; Ring ausgeblendet (J-AB-9, Festlegung I-3) | 390 × 56 | 40 |
| 72 | Haarlinie 1 px `--line` | 16–374 | 30 |
| 88–104 | Kapitelzeile 13/600, Versalien, Sperrung .12em, `--muted`, „04“ `--accent` (134 px breit) | 16 | 30 |
| 116–150 | h2 32/800, eine Zeile (147 px) | 16 | 30 |
| 162–238 | Lead 17/500 `--text2`, „Ihrer Marke“ `--text` 600, 3 Zeilen | 16–374 | 30 |
| 255–307 | Namensleiste 358 × 52: drei Segmente 116 × 52, Abstand 5 | 16–374 | 30 |
| 317–345 | Pille „Empfohlen“ 122 × 28, Mitte auf der Kartenoberkante | 60–182 | 30 |
| 331 | Kartenoberkante; Karte 310 breit; Nachbarn x −282…28 und 362…672 (je 28 px sichtbar) | 40–350 | 30 |
| 355–379 | Paketname 17/800 (Plus 146 px) | 60 | 30 |
| 387–431 | „Wenn“-Satz 15/500 `--text2`, 2 Zeilen | 60–330 | 30 |
| 447–485 | Preis 32/800 `tabular-nums` + 6 px + „im Monat“ 15 `--muted` auf der Grundlinie | 60 | 30 |
| 487–509 | Bindung 15 `--text2` (195 px) | 60 | 30 |
| 517–561 | Einrichtung 15, Betrag mit „Einrichtung“ `--text` 600, Rest `--text2`, 2 Zeilen | 60–330 | 30 |
| 565–583 | Steuerzeile 13 `--muted` (211 px) | 60 | 30 |
| 599–651 | Knopf 270 × 52 | 60–330 | 30 |
| 667–691 | Browserleiste 24 px `#222`: drei Punkte 6 px, Adresspille 18 px hoch | 42–348 | 20 |
| 691–921 | Bildfenster 306 × 230 (4 : 3), darin Bildebene 354 × 230 mit je 24 px Rand (Festlegung I-2) | 42–348 | 20 |
| 937–1132 | Datenblatt: 4 Zeilen à 48 (Kennwort 13 oben, Wert 15 darunter), 3 Haarlinien `--line` | 60–330 | 30; Leitlinien 25 |
| 1144–1188 | „Leistungen ansehen“ 270 × 44, Haarlinie oben, Pfeil rechts | 60–330 | 30 |
| 1208 | Kartenunterkante (Innenabstand unten 20; Karte 877 hoch, alle drei gleich) | – | – |

Danach 24 px bis zum Verkaufsstand (`fb-07`). Block ≈ 1.136 px ab der Haarlinie ≈ 1,35 BH (ZA plant 1,10; PE 1,28). Die Mehrlänge kommt
aus Festlegung I-1 und liegt ganz unter dem ersten Bildschirm nach dem Sprung.

**Prüfungen [V]:** Bei 390 × 664 endet der Knopf bei y 651 (13 px Reserve, J-R2, E-1); alle drei Preise stehen ab y 307 in der Leiste.
Bei 844 sind 177 von 254 px des Bildrahmens sichtbar (Fortsetzungssignal, SG 10.7/10). Bei 360 px Breite: Karte 280, Innenbreite 240,
Texte bleiben zweizeilig (gemessen), Knopf bei y ≈ 599–651.

**Größenhierarchie (SG 10.1/4):** drei Stufen: Zahl 32 (h2 und Preis) · Lesestufe 17/15 · Mikrostufe 13. Paketname 17 statt 24
(J-AB-1). Hauptelement ist das Bild: 254 px Höhe = 27 × Versalhöhe der Bedienschrift (≈ 9,5 px); der Preis trägt nur die Titelstufe
(32/13 = 2,5 < 3, G4).

**Verhältnisse:** Karte: Preisblock mit Knopf ≈ 36 %, Bild 29 %, Datenblatt mit Umschalter 29 %, Innenabstände 6 %. Das unterschreitet
„≥ ⅓“ aus DG T7, weil die vier Datenblattzeilen verbindlich sind (J-R5, J-R10); bis zur Bildunterkante (590 px) sind es 43 % [H, Rückfall G]. Erster Bildschirm nach dem Sprung (Überschlag): Bild ≈ 16 %,
Text und Bedienung ≈ 34 %, ruhige Fläche ≈ 50 % (≥ 33 %, SG 10.1/3). Abstände 8 : 16 : 24–48.

**Ebenen:** Z 0 Grund `#161616` ohne Licht und Raster · Z 20 Browserleiste, Bildfenster mit Bildebene · Z 25 Leitlinien und Marker (SVG,
`aria-hidden`) · Z 30 Karte `--surface` `#1f1f1f`, Text, Pille, Namensleiste, Knopf; Kartenring als `::after` über dem Bild · Z 40 Kopf.
Verdeckungen (SG 10.9, mindestens eine): Pille über dem Kartenrand; Kartenring über den Seitenkanten des Bildes; Bildschirmrand schneidet
die Nachbarn.

**Namensleiste im Detail:** Grund transparent, Innenring 2 px `--line`, Radius voll. Zeiger 108 × 44 (4 px Einzug) `--surface2`, Radius
voll, Schritt 121 px. Je Segment zentriert zwei Zeilen: Kurzname 13/600 (77 px bei „Essential Plus“), darunter Preis 15/700
`tabular-nums`; aktiv beide `--text`, sonst `--text2`.

**Pille:** Kontur 2 px `--primary`, Füllung `--ground` (deckt nur den Kartenring ab, liest sich als ausgeschnitten), Text 13/700 Versalien,
Sperrung .12em, `--primary` (98 px), Innenabstand 0 12, Radius voll.

**Knopf:** A und B 17/700 linksbündig, Innenabstand links 20. Cream (`--primary`, Text `--on-primary`) mit Pfeilkreis 36 px rechts, 8 px
Abstand zum Rand (Text gemessen 170 px: 20 + 170 + 12 + 36 + 8 = 246 ≤ 270). Ring: transparent, Innenkontur 2 px `--line2`, ohne
Pfeilkreis. Unter 375 px Breite: Innenabstand 16, Pfeilkreis 32 (Festlegung I-4).

**Datenblatt:** `dl`; je Zeile `dt` 13/600 Versalien, Sperrung .12em, `--muted` (längstes Kennwort 211 px), `dd` 15/500 `--text` (längster
Wert 240 px), je eine Zeile; Innenabstand 4 oben und unten, 2 px zwischen dt und dd. **Leitlinien (informierende Signature):** zwei Pfade
1 px `--text` 40 % mit 1-px-Halo `--ground` 60 %, nur waagerecht und senkrecht wie Maßlinien: vom Kennwort (Haken 4 px bei x 56–60) in einem
Kanal links (x 54 für GESTALTUNG, x 48 für HINWEIS) senkrecht nach oben ins Bild, dann waagerecht zum Marker (Ring 6 px, 1 px). Ziele:
GESTALTUNG → Name bzw. Logo im Kopf der Startansicht; HINWEIS → Kennzeichnung im Fuß (bei Signature der leere Platz, Marker hohl).
Koordinaten je Bild als `data-ziel-gestaltung="6,4"` (Prozent der Aufnahme ohne Rand; das Skript addiert den Versatz der Bildebene).

**Schreibtisch 1280 × 800** – 12 Spalten à 64,67, Abstand 24, Spalte x 120–1160; nach dem Sprung `scroll-margin-top` 124.

| y (px) | Element | Spalten · x |
|---|---|---|
| 0–64 | Kopf | – |
| 80 | Haarlinie | 1–12 |
| 96–112 · 124–168 | Kapitelzeile 13 · h2 40/800 (183 px) | 1–4 |
| 128–179 | Lead 17, 2 Zeilen, linke Kante = linke Kante der Plus-Karte | 5–12 · 474,7–1160 |
| 194–222 | Pille an Plus | 498,7–620,7 |
| 208 | Kartenoberkanten; Karten 330,7 breit, Innenabstand 24, Innenbreite 282,7 | 1–4 · 5–8 · 9–12 |
| 232–256 · 264–308 | Paketname 17 · „Wenn“-Satz 2 Zeilen | je Karte |
| 324–368 · 370–392 · 400–444 · 448–466 | Preis 40/800 · Bindung · Einrichtung · Steuer | je Karte |
| 482–534 | Knopf 282,7 × 52 | je Karte |
| 558–582 · 582–794 | Browserleiste 24 · Bildfenster 282,7 × 212, Radius 12 | je Karte |
| 810–1005 | Datenblatt | je Karte |
| ab 1021 | Leistungsliste offen (Haken grün, 15), dann Demo-Link | je Karte |

`subgrid` mit acht Zeilen (Pille/Name, Satz, Preisblock, Knopf, Bild, Datenblatt, Liste, Demo), Bestand `verkauf.css:85`. Keine
Namensleiste, kein Umschalter. Alle drei Bilder vollständig im ersten 800-px-Bildschirm: der Bildvergleich, den das Telefon nur
nacheinander zeigt.

**Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Kartenbreite Telefon | `min(calc(100vw - 80px), 380px)` | Bestand `verkauf.css:89`; Nachbarn als Anschnitt |
| Kartenabstand | 12 Telefon, 24 Schreibtisch | Bestand; Rasterabstand |
| Innenabstand | 20 Telefon, 24 ab 900 px | Bestand; 24 hält die Bilder bei 800 px im Bild |
| Radien | Karte 24 (`--r4`), Bildfenster Schreibtisch 12 (`--r2`), Telefon 0 (läuft von Ring zu Ring), Pillen voll | DG-AB-8 |
| Ring | `::after`, `box-shadow: inset 0 0 0 2px var(--line)`, empfohlen `var(--primary)` | J-R8; liegt über dem Bild |
| Reihe | `scroll-snap-type: x mandatory`, `scroll-snap-align: center`, `scroll-snap-stop: always`, `overscroll-behavior-x: contain` | Bestand `verkauf.css:89-91` |
| Nachbarn | `opacity: calc(1 - var(--a) * .34)`, keine Skalierung | J-AB-2; SG 10.7/3 |
| Umbruch Reihe → drei Spalten | ab 900 px | PE Festlegung 10-4 (bei 768 px wären Karten 229 px) |
| Bildebene | `left: -7.84%; width: 115.69%; height: 100%`; das Bild füllt sie genau (1,54 : 1) | Festlegung I-2 |

## D. Anwendung der Design-DNA

Stufe 2, Dialekt C (flach) mit einem Bildträger je Karte; keine inszenierende Signature (DG Dosierregel 1 [V]); eine informierende
(Annotation). Intensität auf der DNA-Skala 0–4.

| Eigenschaft | Ausgestaltung und Position | Int. | Wirkung, Beitrag zur Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achse | drei Ebenen plus Kopf; Verdeckung durch Pille, Ring über dem Bild, Anschnitt der Nachbarn | 2 | trennt Zeigen (Bild) von Entscheiden (Karte), G1 |
| Material, Transparenz | Material nur im Bild: echte Aufnahme der Startansicht; Karte matt `#1f1f1f`; kein Glas | 1 | belegt, was der Kunde des Betriebs sieht (SKILL:41) |
| Licht, Schatten | keine Lichtquelle, kein Schatten (heute `0 18px 38px` am Rahmen, `verkauf.css:45`, entfällt); 1-px-Lichtkante Weiß 14 % an der Oberkante der Browserleiste (`--kante-alpha`, Licht von oben) | 0–1 | kein Blickziel neben Preis und Knopf |
| Formen | Vollrundung für Pille, Segmente, Zeiger, Knöpfe; Radius 24 Karte, 12 Bildfenster; keine Formänderung bei Zuständen | 2 | ein Formsystem (DNA Nr. 5) |
| 3D-Objekte | keine | 0 | Konzentration auf Zahlen |
| Bildintegration | Bild als Panel im Container (B.3.4), am Telefon über die volle Kartenbreite; gleiche Aufnahme, gleiche Belichtung für alle drei (J-R9) | 2 | Markenstufe sehen statt lesen (SKILL:29) |
| Oberflächendetails | Haarlinien im Datenblatt; Leitlinien mit Markerring; Schloss und „· Beispiel“ in der Adresspille | 2 | Präzision eines Aufmaßes; erklärt, wo „Powered by“ sitzt (F-24) |
| Animation | nur nutzergeführt: Reihe folgt dem Finger, Bild läuft nach und kehrt mit Feder ≤ 3 % zurück, Zeiger folgt | 1 | Bild und Karte als ein Stück (SKILL:43, :122) |
| Typografie | Zahl als Held 32/40, 800, `tabular-nums`; Bühnenstimme (h2, Preis), Technikstimme (Kapitelzeile, Pille, Kennwörter) | 2 | Leselinie Preis → Knopf |
| Überlagerungen | Pille auf dem Rand; Leitlinien und Marker über dem Bild | 1 | Empfehlung und Erklärung eindeutig zugeordnet |
| Perspektive | keine; Rahmen frontal | 0 | Bilder bleiben vergleichbar |
| Interaktive Effekte | aktiv = Füllung, Hover = Kontur, Fokus = 2-px-Kontur 3 : 1 | 1 | Rückmeldung ohne Ablenkung |

**Bewusst weggelassen:** Glas, Lichtraum, Kantenlicht, Schatten, Messraster (wäre eine zweite informierende Signature), Riesenwort,
gekippte Karten, Auftritte beim Scrollen (E-13), Lottie `farbwechsel` (J-AB-10), hochzählende Preise, Einlauf-Hinweis `.vk-wischen`
(J-AB-3), Skalierung der Nachbarn (J-AB-2), grüner Schein (J-AB-4), gefüllte Cream-Pille „Empfohlen“ (zweite Cream-Fläche).

## E. Visual Attention Architecture

Erwartete Aufmerksamkeit aus Komposition und Recherche (RE E1–E3), nicht gemessen.

- **Primärer Fokus:** Preis „39 €“ und Cream-Knopf der empfohlenen Karte (größte Zahl, einzige helle Fläche 270 × 52).
- **Sekundärer Fokus:** Namensleiste mit drei Preisen; danach die Oberkante des Bildes als einzige farbige Fläche.
- **Erwartete Reihenfolge am Telefon:** h2 mit grünem Wort → Namensleiste (drei Preise als Band) → Pille und Cream-Ring → Preis → Bindung,
  Einrichtung → Knopf → Bildoberkante → Anschnitt der Nachbarn (Wisch-Hinweis ohne Bewegung).
- **Am Schreibtisch:** h2 → Lead → drei Preise links nach rechts → Cream-Knopf Mitte → drei Bilder → Datenblätter.
- **Kontraste:** `--text` auf `#1f1f1f` ≈ 15 : 1; `--text2` und `--muted` ≥ 4,5 : 1; Cream mit `#161616`; Grün nur „04“ und „Pakete“.
- **CTA:** ein Cream-Knopf je Bildschirm; Ring-Knöpfe der Nachbarn liegen außerhalb des Bildes; Kopf-Ring ausgeblendet. Am Schreibtisch zwei
  Ring-Knöpfe gleicher Größe daneben.
- **Ablenkungen:** (1) Der Startknopf in der Aufnahme der Essential-Stufe kann als zweiter heller Fleck wirken (DG-H-12): Blinzeltest,
  sonst Ausschnitt ohne hellen Knopf. (2) Das Datenblatt ist textreich, steht aber unter Knopf und Bild. (3) Die Namensleiste könnte als
  Auswahl gelesen werden: sie heißt „Paketübersicht“ und setzt nichts (E-3, J-H16).
- **Übergang:** Nach der Reihe 24 px zum Satz Verkaufsstand (`fb-07`), dann Vergleichszeile, Festblock; keine Bühne dazwischen.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Ebene | Dauer, Kurve | Verfahren | Weniger Bewegung |
|---|---|---|---|---|---|
| Scrollen | keine Bewegung im Block; Kopf-Ring blendet aus, solange Namensleiste oder Reihe das Band unter dem Kopf bis 60 % der Bildhöhe schneidet; danach in Zustand A „Paket anfragen“ → `#frage` (`rh-01-kopf`) | 40 | 220 ms, `--kurve-ein` | IntersectionObserver auf den Block, `rootMargin: -56px 0px -40% 0px`, `opacity` | sofort |
| Wischen | Karte folgt 1 : 1, rastet mittig ein, ohne Überschwingen; Nachbarn 1 → 0,66 Deckkraft | 30 | nativ | `scroll-snap`, `--a` (Bestand) | gleich |
| Wischen | Bildebenen aller drei Karten laufen entgegen der Wischrichtung nach und kehren zurück | 20 | Feder, Einschwingen ≈ 420 ms | siehe unten | kein Nachlauf |
| Wischen | Zeiger folgt `translateX(calc(var(--p) * (100% + 13px)))`; `aria-current` bei der Rundung | 30 | 1 : 1 | Bestand `verkauf.js:371-373` | gleich |
| Tipp auf Segment | Reihe rollt zur Karte, Seite bleibt stehen; keine Wahl | 30 | Browser-Glättung | `scrollTo({behavior: 'smooth'})`, Bestand `zu()` | `auto` |
| Hover (`pointer: fine`) | Karte: Ring `--muted`; Ring-Knopf: Kontur `--text`; Cream: Innenkontur 2 px `--on-primary` 24 %; Datenblattzeile: Marker und Leitlinie 40 → 100 % | 30/25 | 160 ms, `--kurve-ein` | CSS auf Farbe, Kontur, Deckkraft | gleich |
| Druck auf Knopf | Füllung dunkler (`--primary` → `#e2e1db`), keine Skalierung | 30 | 150 ms | `:active` | gleich |
| Knopf, Zustand A | rollt zu `#frage`, Paket gesetzt, Auswahlzeile in `fb-09`, Fokus auf h3, `aria-live` „EEZI Essential Plus ausgewählt“; gewähltes Paket trägt danach den Cream-Knopf, Pille und Ring bleiben an Plus (J-AB-8) | 30 | nativ glatt | `scrollIntoView`, Zustand je Wurzel in `sessionStorage` (`try/catch`) | Sprung |
| Knopf, Zustand B | Seitenwechsel `/partner/#bestellen/<paket>`; [H] gewähltes Bild gleitet in die Miniatur von Schritt 1 | Seite/20 | Überblendung 240 ms, Gleiten 320 ms `cubic-bezier(.2,0,0,1)` | `@view-transition { navigation: auto }`, `view-transition-name: paket-wahl` nur am getippten Bild | ohne Übergang |
| „Leistungen ansehen“ | Listen aller drei Karten öffnen, Höhe sofort, Inhalt über Deckkraft; `aria-expanded` | 30 | 220 ms | Bestand `verkauf.js:350-357` | sofort |

**Feder im Bild (Verfahren):** Geschwindigkeit der Reihe `v = Δ scrollLeft / Δt` in px/ms, geglättet `v = 0,7 · v_alt + 0,3 · v_neu`;
Ziel `x* = clamp(8 · v, −24, 24)` (Reihe läuft nach links → Bild bleibt rechts zurück). Feder `a = ω² (x* − x) − 2ζω · ẋ` mit ω = 2π · 2 Hz,
ζ = 0,75 (Überschwingen ≈ 2,8 %, ≤ 3 % nach G1), semi-implizites Euler, `dt = min(Δt, 32 ms)`. `transform: translate3d(x, 0, 0)` direkt auf
den drei Bildebenen; im selben Schritt die Pfade der Leitlinien neu (Marker wandert mit, Kanal bleibt). Schleife nur, solange die Reihe im
Bild ist (IntersectionObserver), Stopp bei |x| < 0,1 px und |ẋ| < 0,01 px/ms ohne Scrollereignis seit 100 ms; `will-change: transform` nur
während der Schleife.

**Charakteristik:** ruhig und präzise. Die Bedienschicht wechselt nur Zustände; Physik liegt allein im Bild; keine autonome Bewegung, daher
keine Pause nötig. **Ohne JavaScript:** Reihe nativ wischbar und einrastend (wo unterstützt beginnt sie mit `scroll-initial-target:
nearest` an Plus, sonst an Essential), Namensleiste springt per Anker, Listen offen, Knöpfe springen zu `#bestellen` (Prüfsuite 29.1/29.2).

## G. Responsive Design

**Telefon 390 × 844 (zuerst).** Eigenständige Komposition nach C (Namensleiste statt Spaltenvergleich, eine Karte voll, Nachbarn je
28 px, Bild über die volle Kartenbreite, Liste zu). Ab 360 px gleich mit Karte 280. 600–899 px: Karte höchstens 380, Nachbarn zeigen mehr,
Namensleiste bleibt 358 breit linksbündig. Rückfall, falls die Sichtprüfung das Bild bei 29 %
der Kartenhöhe zu schwach findet: Datenblatt standardmäßig zu und unter „Leistungen ansehen“ (Bild dann 38 %), Freigabe nötig, weil J-R5 das
Datenblatt sichtbar vorsieht.

**Schreibtisch 1280.** Drei Karten nebeneinander nach C, Preise und Knöpfe y 324–534, Bilder bis y 794; h2 40, Preis 40, Spalte 1040:
nichts überdimensioniert (SKILL:28).

**Schreibtisch 1024 × 768.** Spalte 944 ab x 40, Karten 298,7, Innenbreite 250,7; „Wenn“-Satz und Einrichtung dreizeilig; Preis
y ≈ 346–390, Knopf y ≈ 526–578, Bilder (250,7 × 188 plus Leiste) y ≈ 602–814, zu ≈ 78 % im ersten Bildschirm. Keine eigene Variante.

**Einbettung `/#fensterbauer`.** Identisch; Bindungen idempotent bei jedem `Verkauf.auf` (Bestand `box.__vkAn`), Prüfung
`document.body.contains(box)` in jeder Schleife; Zustand „gewählt“ je Wurzel; der Kopf-Ring der Einbettung folgt `kopfCta()` der
Startseite (GEST:399).

## H. Technische Umsetzung

**Bestehende Dateien, Änderungen**

| Datei | Teil | Änderung |
|---|---|---|
| `functions/pakete-seite.js` | `karten()` 109–131 | Reihenfolge: Pille, h3, „Wenn“-Satz, Preis, Bindung, Einrichtung, Steuer, Knopf, Beispiel, `dl`, Umschalter, Liste, Demo; Namensleiste vor die Reihe (heute Zeile 129–130 danach), mit Preisen, `aria-label="Paketübersicht"` (Festlegung I-5); `hinweis()` wandert nach `fb-07` |
| | `beispiel()` 105–107 | Adresspille „ihr-name-fenster.de · Beispiel“; `figcaption` nur für Vorleseprogramme; Bildebene; `data-ziel-*`; `BEISPIEL_BILD` je Paket |
| | `punkte()` 65–82 | Unterschiede zuerst (J-R11) |
| | danach | `node scripts/bedingungen-pdf.mjs` |
| `web/assets/verkauf.js` | `pakete()` 340–404 | Breakpoint 899 statt 760; Feder und Leitlinien; `.vk-wischen` (390–404) entfernen; Kopf-Ring-Beobachter; Cream nach Wahl |
| `web/assets/verkauf.css` | 8, 21–91 | `scroll-margin-top` 116/124; kein Schein (23); Ring als `::after` für alle Karten; keine Skalierung (91); Pille als Kontur; Rahmen ohne Schatten; Bildebene; Datenblatt; Namensleiste oben |
| `web/assets/pakete.js` | – | unverändert, einzige Quelle für Preise und Merkmale |
| `scripts/pruefen-instanzen/29.mjs` | 29.1 | bleibt; ergänzen: Namensleiste nennt alle drei Preise, alle Karten haben dieselben vier `dt` |

**Prüfsuite-Fallen [V]:** `<article class="vk-paket…" id="paket-…">` mit `class` vor `id` (Regex Zeile 28); im Artikel `<b>39 €</b> im
Monat`, „199 € Einrichtung“ ohne Tag dazwischen, „zzgl. MwSt.“, „nur für Unternehmer“, voller Paketname; Zustand A `href="#bestellen"
data-paket="…"`. `<b>Vorläufige Preise.</b>` und „Bestellung bald möglich“ (29.2) liefern `fb-07` und `fb-09`.

**Neue Bausteine:** Namensleiste mit Preisen und Zeiger · Datenblatt mit Leitlinien-SVG · Feder-Modul (≈ 60 Zeilen, ohne Bibliothek) ·
Kopf-Ring-Beobachter · Zustand „gewählt“ je Wurzel.

**CSS:** Grid mit `subgrid`; `scroll-snap`; `@media (pointer: fine)`; `@media (prefers-reduced-motion: reduce)`; `@media (forced-colors:
active)` mit `outline: 2px solid CanvasText; outline-offset: -2px` statt Ring-Schatten; Z-Stufen 0/20/25/30/40; feste Seitenverhältnisse.

**Assets**

| Asset | Art | Format, Maß | Freistellung | Quelle |
|---|---|---|---|---|
| Beispielbild × 3 | Aufnahme der Startansicht „Fensterbau Brandt“: Essential eeziframes-Design mit Namen und „Powered by“; Plus Monogramm „Beispiel“, Farbe, Fotos, kleiner Hinweis; Signature ohne Hinweis | Kontext 1280 × 960; Kopf und Fuß im Ausschnitt (sonst Seitenzoom im Skript, für alle drei gleich); links und rechts je 100 px in der Grundfarbe der Startansicht ergänzt (1480 × 960); Ausgabe 708 × 460 (2 × Bildebene), AVIF ≤ 40 KB, WebP ≤ 55 KB | rechteckig | per Skript mit Playwright aus `web/assets/einladung.js` (vorhanden); kein erfundenes Logo |
| Fotos des Beispielbetriebs (bis 6) | Werkstatt, Fenster im Einbau, Musterfenster; erkennbar erfunden, keine Personen | 1200 × 900, WebP | keine | beim Inhaber anzufragen (Flux): ohne Text, Logos, Wasserzeichen, Licht warm von oben links |
| Pfeilkreis, Schloss | Inline-SVG | 36/32 bzw. 11 px | – | vorhanden (`functions/pakete-seite.js:97`, Formularknopf `:186`) |

Bis die Bilder da sind, bleibt die Skizze als Platzhalter, der Nachlauf und Leitlinien schon zeigt: Sie füllt den 4 : 3-Kern der
Bildebene, der Rand trägt ihre Grundfarbe (Ziele: `.sk-logo` 8 % / 7 %, `.sk-hinweis` 83 % / 95 %, bei Plus 89 % / 95 %).

**Technikstufe:** 1 „Leicht“ (SKILL Abschnitt 3): CSS auf `opacity`, Farbe, Kontur; `requestAnimationFrame` nur für `transform` der
Bildebenen; View Transitions des Browsers. Grafikchip-Effekte würden mit Preis und Knopf konkurrieren (DG Dosierregel 1).

**Leistung:** drei Bilder ≈ 120–165 KB, `loading="lazy"`, `decoding="async"`, `draggable="false"`, `pointer-events: none` (Wischen im Bild
wischt die Reihe), feste Maße (CLS ≤ 0,1). Der Block liegt nie im ersten Bildschirm (kein LCP-Einfluss). Scroll gebündelt per rAF
(Bestand); INP: der Kartenknopf schreibt nur Zustand und Feldwert. Ohne View-Transition-Unterstützung oder bei Bildzeit > 25 ms kein
Übergang (SG 10.8).

**Barrierefreiheit:** Reihe `aria-label="Pakete"`, Karte `article` mit `h3` (Bestand); Namensleiste `nav` mit Links und `aria-current`,
zugänglicher Name „Essential Plus, 39 € im Monat“ (versteckt „im Monat“); Knöpfe als Links mit eindeutigem Namen; „Empfohlen“ als Text;
Datenblatt `dl`; Leitlinien, Marker, Browserleiste `aria-hidden`; Bild-`alt` „Beispielseite EEZI Essential Plus“; Fokus 2 px `--text` mit
2 px Abstand, nie unter dem Kopf (`scroll-margin`); Tab-Folge Segmente → Knöpfe → Umschalter, die Reihe rollt zum fokussierten Knopf
(`scrollIntoView({inline: 'center'})`); Ziele ≥ 44 px; 200 % Text ohne Querscrollen (Segmente wachsen in der Höhe).

**Abweichungen** – jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (aus PE 10.4 H, hier wirksam).

| Nr. | bestehende Regel | hier | Begründung |
|---|---|---|---|
| J-AB-1 | Paketname 24 (GEST:449) | 17/800 | höchstens drei Größenstufen (SG 10.1/4) |
| J-AB-2 | Nachbarn „bis 5 % kleiner“ (GEST:452) | nur Deckkraft | keine Skalierung der Bedienschicht (SG 10.7/3) |
| J-AB-3 | Einlauf mit Federn (GEST:452) | entfällt | Bedienelemente federn nicht (SG 10.7/2), E-13 |
| J-AB-4 | grüner Schein (GEST:452) | entfällt | kein Licht als Flächenmittel (DNA Nr. 10) |
| J-AB-6 | Namensleiste unter der Reihe (GEST:452) | darüber, mit Preisen | alle Preise ohne Wischen (R9) |
| J-AB-8 | Cream am empfohlenen Paket (GEST:456) | nach der Wahl am gewählten | Folge der Absicht (E-3) |
| J-AB-9 | im Kopf ein Ring-Knopf (GEST:456) | ausgeblendet, solange der Block im Bild ist | eine Handlung je Bildschirm |
| J-AB-10 | Vorspann mit `farbwechsel` (GEST:447) | entfällt | keine Dauerbewegung in Entscheidungsflächen |

**Festlegungen dieser Spezifikation:** I-1 Datenblatt gestapelt statt Spalten 96/166 (PE 10.4 C), weil „HINWEIS AUF EEZIFRAMES“ 211 px
misst. I-2 Bildebene mit 24 px Rand je Seite in der Grundfarbe der Startansicht, Asset 708 × 460 statt 660 × 495: Der Nachlauf zeigt keine
leere Kante, und die Aufnahme wird weder beschnitten noch skaliert (der Fuß mit dem Hinweis bleibt sichtbar).
I-3 Kopf-Ring nach Band statt „≥ 50 % im Bild“, weil die Reihe mit 877 px höher ist als 608 px Sichtfläche bei 664. I-4 Knopf 17/700 mit
gemessenem Platz für den Pfeilkreis. I-5 Namensleiste „Paketübersicht“ statt „Paket wählen“ (`functions/pakete-seite.js:129`), weil sie
nicht wählt (E-3).

## I. Conversion-Begründung

- **Position:** Nach 01–03 kennt der Besucher Produkt, Kundensicht und Anfrage; „Was kostet es, welches?“ ist die nächste Frage (EA S4).
  Wer früher entschieden hat, springt aus dem Startbild hierher und sieht Preise und Knopf ohne Scrollen.
- **Gestaltung:** Alle Preise beieinander (J-R2); der Preisblock nennt, was sonst überraschen würde: Einrichtung mit Inhalt, ab wann, wie
  kündbar, netto (RE E11). Eine Hervorhebung, aber begründet (J-R8); der Unterschied wird gezeigt statt beschrieben (J-R10); Physik nur
  im Bild, damit nichts mit dem Knopf konkurriert.
- **Informationsmenge:** vor dem Knopf je Karte ≈ 35–45 Wörter in vier Bausteinen; nach dem Knopf Bild und vier Datenzeilen; Liste und
  Vergleich auf Abruf. Pflichtangaben bleiben sichtbar (§ 5a UWG, PAK Q51), lange Listen nicht (SKILL:29-30).
- **Beitrag zur Zielhandlung:** Z1a/Z1 über den Kartenknopf mit vorgewähltem Paket; Z1+ über „Wenn“-Satz, Team-Zeile mit „nicht
  enthalten“ und das Bild der höheren Stufe daneben; keine Lockvögel, keine Knappheit (R7).
- **Zu testende Annahmen [H]:** J-H5 (Unterschiedszeile), J-H11 (Stufe am Bild erkennbar), J-H12 (Leitlinien), J-H13 (Feder; Video mit
  und ohne), J-H14 (Kopf-Ring), J-H15 („Wenn“-Satz als Grund), J-H16 (Namensleiste als Überblick), Bildanteil 29 % (G). Prüfwege: Telefon-Video
  390 × 844 und 664, Bildschirmfotos 1280 × 800, Lesetests mit Fensterbauern, Paketfeld im Formular; keine erwarteten Größen.

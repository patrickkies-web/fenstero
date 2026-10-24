# Brotkrumen und Fuß (kurz und lang)

Seite: Rahmen (alle Seiten) · Position: 3 (letztes Element jeder Seite) · Intensitätsstufe: 1 ruhig (Typ T0; Ansichtstyp „Arbeitsansicht“ nach SG)

ID `rh-03-brotkrumen-fuss`. Phase I, Stand 24.10.2026. Reine Planung: gelesen wurde das Repository, gebaut oder geändert nichts.
Kennzeichnungen wie in 08: **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Textentwurf** (neuer Wortlaut, Freigabe nötig),
**Festlegung I** (Entscheidung dieser Spezifikation, wo 08 offen ist). Grundlage: 08 (8.2.2, 8.2.5, 8.3.0–8.3.9), IA 5.3.5 und K05/K07,
DG 2.3.2 (T0), 2.4.1, SG 10.1 und 10.10, Ergebnis B (B.5), SKILL, GEST:429–438. `10-paketentscheidung.md` liegt nicht vor; der Fuß
nennt keine Preise.

## A. Abschnitt und Funktion

| | |
|---|---|
| Position | Letztes Element jeder Seite. Seite für Fensterbauer: nach A4 `fb-15-abschluss`, Bildschirm 14–15 bei 664 px (08 8.3.2 a). Startseite: nach `st-04-wechselkarte`. Ratgeber, Fachartikel: nach A-7 „Quellen, Stand“. Paketbedingungen, Rechtsseiten, 404: nach dem Text. Der Nachbar oben hat immer Stufe ≤ 2; danach folgt nichts |
| Ziel | Recht (Pflichtseiten, „Vertrag widerrufen“ auf jeder Seite, GEST:438), Wechsel zwischen den Zielgruppen, Kontakt, interne Verlinkung (08 R-3) |
| Nutzerfrage | „Wer steckt dahinter, wo ist das Kleingedruckte?“ (08 R-3); dazu „Wo ist der andere Bereich?“ (N8) |
| vorbereitete Entscheidung | Anbieter prüfen (F-20); Zielgruppe wechseln; Rückweg zur Paketwahl oder ins Wissen (FB-6, FB-1); Anmelden (FB-7), gesichertes Aufmaß öffnen (HE-7) |
| Länge (Telefon) | kurz ≈ 0,91 BH mit Brotkrumen, ≈ 0,87 ohne; lang ≈ 1,58 BH (08: ≈ 0,9 bzw. ≈ 1,5) |

Der Fuß führt nicht zur Zielhandlung, er hält sie offen: Der klebende Kopf-Ring bleibt der einzige Handlungsträger (N5); der Fuß hat
keine Cream.

## B. Konkreter Inhalt

### B.1 Einträge der einen Quelle

| Gruppe · Spalte | sichtbarer Text | Ziel | kurz | lang | Herkunft |
|---|---|---|:-:|:-:|---|
| Für Fensterbauer · Angebot | Eigener Fenster-Konfigurator | `/fuer-fensterbauer/` | ✓ | ✓ | Kurzname `scripts/ratgeber-bausteine.mjs:42` |
| | Konfigurator-Pakete | `/fuer-fensterbauer/#pakete` | ✓ | ✓ | IA 5.3.5; Kicker `web/assets/partner.js:131` |
| | Paketbedingungen | `/konfigurator-bedingungen/` | ✓ | ✓ | `ratgeber-bausteine.mjs:84` |
| | Anmelden | `/partner/` (Weiche K37); auf `/` öffnet es das Anmeldeblatt des Betriebsbereichs | ✓ | ✓ | `web/assets/portal.js:450`; IA FB-7 |
| Für Fensterbauer · Wissen | Erstaufmaß und Feinaufmaß · Falsches Aufmaß: Haftung · Aufmaß kostenpflichtig? · Geplatzter Aufmaßtermin · Fensterbau-Software | fünf Fachartikel | ✓ | ✓ | `ratgeber-bausteine.mjs:43-47` |
| Für Hauseigentümer · Messen | Fenster ausmessen | `/app/#ausmessen` | ✓ | ✓ | Kopf (08 8.2.2) |
| | Führung starten | `/app/#fuehrung` | ✓ | ✓ | `portal.js:852` |
| | **Textentwurf** Gesichertes Aufmaß öffnen | `/app/` | ✓ | ✓ | IA-AB-10; HE-7 (`web/assets/app.js:2773`) |
| Für Hauseigentümer · Lesen | Ratgeber | `/ratgeber/` | ✓ | – | SI 2.2 |
| | **Textentwurf** Anleitung Fenster ausmessen | `/ratgeber/fenster-ausmessen/` | ✓ | → Ratgeber | nach `app.js:2781` („Anleitung: Fenster ausmessen ›“) |
| Ratgeber | Alle Ratgeber + 23 Artikel in der Reihenfolge des Wegs | Artikel | – | ✓ | `WEG`, `SEITEN_INFO` (`ratgeber-bausteine.mjs:18-59`); Ausmessen-Artikel mit demselben Text wie oben, damit kein zweiter Link „Fenster ausmessen“ mit anderem Ziel entsteht (WCAG 2.4.4) |
| Anbieter und Recht | Zeichen und Wortmarke (kein Link; das Kopf-Logo führt zur Startseite) | – | ✓ | ✓ | GEST:7; `Marke.wort()` |
| | ask@eeziframes.com | `mailto:` | ✓ | ✓ | `web/impressum/index.html:32` |
| | 0152 56950998 | `tel:+4915256950998` | erst nach EA O-9 | | `web/impressum/index.html:33` |
| | Impressum · AGB · Nutzungsbedingungen · Datenschutz · Cookies | Rechtsseiten | ✓ | ✓ | GEST:438; SI 2.2 |
| | Knopf „Vertrag widerrufen“ | `/widerruf/` | ✓ | ✓ | GEST:438; CP P7 |
| | nur auf `/` ohne Server: „Pilotphase: Konto und Projekte liegen in diesem Browser.“ | – | ✓ | – | `portal.js:481` |

Gruppenköpfe „Für Fensterbauer“, „Für Hauseigentümer“ (`portal.js:791`), „Ratgeber“ sind Bestand. **Brotkrumen:** Seite für Fensterbauer
„Startseite › Für Fensterbauer“ (`web/fuer-fensterbauer/index.html:53`; JSON-LD `BreadcrumbList` `:40` bleibt); Ratgeber „Startseite ›
Ratgeber › {Kurzname}“, Fachartikel „Startseite › Für Fensterbauer › {Kurzname}“ (heute je `nav.rg-pfad`). Lage oben in `ar-01`, die
Gestaltung gilt von hier.

**Entfällt:** „So funktioniert es für Betriebe“, „Tour für Fensterbauer“, „Preise für Betriebe“ (IA-AB-1); der lange Pilotsatz
`portal.js:482`, weil er Aufmaß-Links bewirbt; der Satz zum Server, wenn ein Server läuft (08 8.2.5); Links auf Profile in sozialen Netzen
(im Repository steht keine Adresse).

### B.2 Regeln der Quelle

1. **[V]** Jedes Ziel genau einmal je Fuß. **Festlegung I:** 08 8.2.5 führt das Impressum zweimal („Anbieter (Impressum)“ und in der
   Rechtszeile); es steht einmal, als erster Eintrag der Rechtszeile direkt unter Marke und E-Mail.
2. **Festlegung I [H]:** Die Kontextgruppe steht zuerst (Kontexte nach 08 8.2.2). Fensterbauer: FB, HE, lang dazu Ratgeber. Hauseigentümer:
   HE, FB; lang Ratgeber, HE, FB. Neutral: FB, HE. Grund: Die eigene Gruppe zuerst erspart den Blick über die fremde (IA Grundsatz 4).
   Rückfall: überall FB, HE.
3. Lang = kurz + Gruppe Ratgeber; dort entfallen in HE „Ratgeber“ und „Anleitung …“ (Regel 1).
4. `aria-current="page"` am Eintrag der eigenen Seite.
5. Schalter für IA-O-16: Auf `/fuer-fensterbauer/` entfällt die Gruppe HE, falls der Inhaber so entscheidet. Bis dahin bleibt sie (08 8.2.5).
6. **[V]** Die Brotkrumen stehen außerhalb von `main.rg`. Die Einbettung auf `/` übernimmt nur `main.rg` und trägt sie damit nicht
   (GEST:193).

Kurz sind es 21 Links statt bis zu 39 (PA 1.9/2).

### B.3 Interaktionen und vorhandene Bausteine

Alle Einträge sind normale Links und funktionieren ohne JavaScript. Der Fuß trägt `id="navigation"`; ohne JavaScript führt „Menü“
hierher (N7). Sonderfälle mit JavaScript: In der Einbettung auf `/` springen „Eigener Fenster-Konfigurator“ an den Anfang der Ansicht und
„Konfigurator-Pakete“ an `#pakete`, beide innerhalb der Ansicht und ohne Ankerwechsel (GEST:193). „Anmelden“ auf `/` öffnet das
Anmeldeblatt. Welche vorhandenen Bausteine genutzt werden, steht in H.

## C. Exakte Layoutkomposition

**Grundstruktur.** Der Fuß liegt direkt auf dem Grund `#161616`, ohne eigene Fläche. Er hat zwei Zonen: **Zone 1 Wege** (die Gruppen) und
**Zone 2 Anbieter und Recht**. Auf der Seite für Fensterbauer kommt davor als Zeile 0 die Brotkrumenzeile unter derselben Haarlinie. Der
Satz ist asymmetrisch und linksbündig an der Ordnungslinie (G5), mit genau einer zweiten Fluchtlinie (SG 10.1/1, „eingerückte
Zweitlinie“): am Telefon der Beginn von Rasterspalte 3, am Schreibtisch die Spalten 4, 7 und 10. Jede Gruppe teilt sich in zwei Spalten
„tun | lesen“ (Angebot | Wissen, Messen | Lesen); die Teilung ordnet ohne Unterköpfe. Einen Held gibt es nicht (DG T0). Etwa 30 % der
Fläche tragen Schrift, 0 % Bild, rund 70 % sind freier Grund (Schätzung). Größenstufen: 13 (Köpfe, Brotkrumen, Pilotsatz), 15 (Einträge,
Knopf), 17 (Wortmarke). Das ist eine Klein-Stufe nach DG 2.2.18; 24, 32 und 40 kommen nicht vor.

### C.1 Telefon 390 × 844 (4 Spalten à 77,5 px, Abstand 16; Spalte A = Rasterspalten 1–2, x 16–187; Spalte B = 3–4, x 203–374)

| y (px) | Element | Lage, Maß | Satz |
|---|---|---|---|
| 0 | Haarlinie | x 16–374, 1 px `--line` #2b2b2b | – |
| 1–45 | Brotkrumen (nur `/fuer-fensterbauer/`) | ab x 16, Zeile 44 | 13 px, 600, keine Versalien; Link `--muted`, eigene Seite `--text2` |
| 61–81 | Kopf der Kontextgruppe | x 16 | Technikstimme 13 px, 600, Versalien +0,12 em, Grün `--accent` |
| 89–325 | Listen: A „Angebot“ (4), B „Wissen“ (5) | je 171 px | 15 px, 500, `--text2`, Zeilenhöhe 20; Zeile ≥ 44, zweizeilig 48 |
| 349–369 | Kopf der zweiten Gruppe | x 16 | wie oben |
| 377–513 | Listen: A „Messen“ (3), B „Lesen“ (2) | je 171 px | wie oben |
| 537 | Haarlinie (Zonenwechsel) | x 16–374 | – |
| 561–605 | A: Zeichen 24 + 8 Abstand + Wortmarke · B: E-Mail | Zeile 44 | Wortmarke 17 px `--text`; E-Mail 15 px `--text2` |
| (605–649) | B: Telefon, nur nach O-9 | | 15 px, `tabular-nums` |
| 613–701 | Rechtszeile, fließend: „Impressum Datenschutz Cookies“ / „AGB Nutzungsbedingungen“ | ab x 16, Abstand 16, 2 × 44 | 15 px, 500, `--muted` |
| 709–753 | Knopf „Vertrag widerrufen“ ≈ 177 × 44 | x 16 | 15 px, 700, `--text`, Kontur 2 px `--text` |
| 769 | Ende | Polster 16 + `env(safe-area-inset-bottom)` | – |

Ohne Brotkrumen beginnt der erste Kopf 24 px unter der Haarlinie (Ende ≈ y 733). Auf der Ansicht Hauseigentümer steht HE oben, die Maße
bleiben. Lang (Ratgeber): Ratgeber-Gruppe 24 Einträge in A und B, spaltenweise, 12 Zeilen ≈ 552 px, danach HE (nur Spalte A) und FB, dann
Zone 2; Ende ≈ y 1.337.

### C.2 Schreibtisch 1280 × 800 (Spalte 1040 px, x 120–1160; 12 Spalten à 64,67 px, Abstand 24; Spaltenkanten x 120 / 386 / 652 / 918)

| y (px) | Element | Spalten |
|---|---|---|
| 0 | Haarlinie | 1–12 |
| 1–45 | Brotkrumen | ab 1 |
| 77–97 | Köpfe: Kontextgruppe · zweite Gruppe | 1–6 · 7–12 |
| 105–325 | Listen in vier Spalten à 242 px: Angebot 1–3, Wissen 4–6, Messen 7–9, Lesen 10–12 (im Kontext HE gespiegelt); nichts bricht um | Zeilen 44 |
| 349 | Haarlinie | 1–12 |
| 373–417 | Zeichen und Wortmarke · Rechtszeile (Abstand 16, ≈ 479 px) · Knopf „Vertrag widerrufen“ linksbündig an Spalte 10 | 1–3 · 4–9 · 10–12 |
| 417–461 | E-Mail (Telefon darunter nach O-9) · Pilotsatz 13 px (nur `/` ohne Server) | 1–3 · 4–9 |
| 509 | Ende, Polster 48 | – |

Das sind ≈ 0,64 BH; nichts ist überdimensioniert (SKILL:28). Lang steht die Ratgeber-Gruppe als eigene Zeile in vier Spalten à 3, spaltenweise,
6 × 44 px: im Kontext HE vor, im Kontext FB nach der Zeile mit den zwei Gruppen. DOM-Folge und Sichtfolge sind auf beiden Breiten gleich.

### C.3 Startwerte mit Begründung

| Wert | Start | Grund |
|---|---|---|
| Abstand zum Abschnitt davor | 96 / 128 px | G6 |
| Abstände im Fuß | 8 in der Gruppe · 24 zwischen Gruppen · 48 zwischen Zonen | 1 : 3 : 6 (G6; Ergebnis B, Rahmenmaße) |
| Seitenrand Telefon | 16 px | G6 [V]; SG schlägt 20 vor, die Anforderung des Inhabers geht vor |
| Zeilen und Ziele | `min-height` und `min-width` 44 px | N12; Prüfsuite `scripts/pruefen.mjs:1610` |
| Spaltenabstand | 16 Telefon, 24 Schreibtisch | G6; SG 16–32 |
| Zeichen | 24 px (heute 22, `portal.js:482`) | 4-px-Raster; steht neben der 17-px-Wortmarke |
| Knopf | Höhe 44, Polster 0 16, `border: 2px solid`, Radius voll | GEST:438; Rand statt Innenschatten, weil `box-shadow` unter `forced-colors` verschwindet |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung im Fuß | Intensität (0–4) | Wirkung und Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | Grund Z 0, Fuß Z 30; einzige Verdeckung: der opake Kopf (Z 40) beim Scrollen | 0 | flach mit Absicht: Arbeitsansicht, Stapel nur Ziel (SG „Wofür er gilt“) |
| Material, Transparenz | keines; die heutige Fläche `--surface` (`web/assets/portal.css:368`) entfällt, weil es keine Bänder in anderer Grundfarbe gibt (DG 2.3.17/3 [V]); kein Glas (DG T0, T12) | 0 | der Fuß liegt auf demselben Grund wie die Seite |
| Licht, Schatten | keines, keine Lichtkante (nichts schwebt); Licht nur mit Quelle (DG 2.4.1) | 0 | – |
| Formen | Haarlinien 1 px; genau eine geschlossene Form, die Pille „Vertrag widerrufen“; Vollrundung | 1 | der Widerruf ist hervorgehoben, ohne Farbe |
| 3D-Objekte, Bild | keine; kein Foto, kein Astronaut | 0 | der Held gehört den Abschnitten |
| Oberflächendetails | zwei Fluchtlinien; Zeichen mit Haarstrich `fi-rand` (GEST:7); Trenner „›“ in `--line2`; Telefon mit `tabular-nums` | 1 | Präzision wie ein Aufmaß, ohne Signature |
| Animation | keine eigene; Zustände; das Zeichen leuchtet bei Berührung (F) | 0–1 | – |
| Typografie | Technikstimme für Köpfe, Lesetext 15 für Einträge, Wortmarke über `Marke.wort()` | – | ruhig, eine Klein-Stufe |
| Farbe | ≥ 98 % unbunt; Grün nur an den Gruppenköpfen (Kicker-Rolle, G8), damit der letzte Bildschirm nicht ohne Farbe ist (DR: „farbig über 0,3 %“); keine Cream | – | Orientierung über die zwei Zielgruppen |
| Überlagerungen, Perspektive, interaktive Effekte | keine; frontal; nur Zustände über Farbe und Füllung (G1) | 0 | – |

**Bewusst weggelassen:** jede Signature (Stufe 1, DG 2.4.2), Kulissenwort „eeziframes“ (Raumschrift ohne plastisches Gegenüber, SG 10.10
Nr. 9), „Nach oben“-Knopf (nicht im Bestand, der Kopf klebt), Newsletter, Siegel und Zahlen (SKILL:49), Lesefortschritt (DG-AB-15).

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primär:** Kopf der Kontextgruppe, das einzige Grün im Fuß, dann deren Spalte A. **Sekundär:** Knopf „Vertrag widerrufen“, die einzige
  geschlossene Form mit 2-px-Kontur in `--text`, etwa 16:1. Er ist gewollt auffällig (GEST:438) und steht deshalb unter den Wegen.
- **Reihenfolge (Telefon, Seite für Fensterbauer):** Haarlinie und Brotkrumen (Signal: Seitenende) → grüner Kopf → Angebot → Wissen →
  zweiter Kopf → Zonenlinie → Zeichen und E-Mail → Rechtszeile → Knopf.
- **Kontraste auf `#161616`:** Einträge `--text2` ≈ 11,4:1; Rechtszeile `--muted` ≈ 5,8:1, eine Stufe leiser als Kleingedrucktes; Köpfe
  Grün ≈ 10,5:1; Haarlinie ≈ 1,3:1, rein dekorativ.
- **Handlung:** Der Fuß hat keine. Am Telefon bleibt der Kopf-Ring sichtbar („Paket anfragen“ bzw. „Pakete ansehen“, 08 8.2.2);
  „Konfigurator-Pakete“ steht im Fuß als leiser Text.
- **Mögliche Ablenkungen:** Die weißen Lichtflächen des Zeichens sind die hellste Stelle; das Zeichen bleibt deshalb bei 24 px in der
  unteren Zone. Beim Scrollen über die Grenze von A4 kann die Cream des Abschlusses mit dem Knopf im Bild stehen: Die gefüllte Cream gewinnt
  gegen die Kontur, dazwischen liegen 96 px und eine Haarlinie.
- **Übergang:** Es folgt kein Abschnitt; nichts lädt nach.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Element | Verhalten | Dauer, Kurve | weniger Bewegung |
|---|---|---|---|---|
| Scrollen | ganzer Fuß | steht; kein Einblenden. Er wird oft per Sprung (`#navigation`) oder schnellem Scrollen erreicht und muss sofort lesbar sein | – | gleich |
| Hover (nur `@media (hover: hover)`) | Einträge, Brotkrumen | `--text2` bzw. `--muted` → `--text` | 150 ms `--e-out` (`--t1`, DG-AB-16) | gleich |
| Hover | Knopf | Füllung transparent → `--surface2` #262626 | 150 ms `--e-out` | gleich |
| Drücken | Knopf | Füllung `--surface3` #2e2e2e; nicht skalieren (SG 10.10 Nr. 1) | sofort | gleich |
| Fokus | alle Ziele | 2-px-Kontur `--text`, Abstand 2 px (`web/assets/gemeinsam.css:38`); nie unter dem Kopf (`scroll-padding-top` 56/64) | sofort | gleich |
| Tippen „Konfigurator-Pakete“ auf der eigenen Seite | Sprung zu `#pakete` | natives Springen mit Verlaufseintrag (08 8.2.7); `scroll-behavior: smooth` nur ohne reduzierte Bewegung | Browser | Sprung ohne Gleiten |
| Berührung oder Zeiger am Zeichen | Zeichen | Licht geht einmal an (`Logo.bewegen(el)`, `gemeinsam.js:127-135`) | 1,6 s | ruhig (`gemeinsam.css:208`) |

Im Fuß gibt es keinen Ladeauftritt; der gehört dem Kopf-Logo, damit sich nur ein Träger bewegt (SG 10.7/4). **Leistungsrisiko:**
`Logo.bewegen()` ohne Ziel erfasst heute jedes `.fi-logo` der Seite; der Aufruf beim Laden wird auf den Kopf begrenzt. Grund für die Ruhe:
Stufe 1, in der Bedienschicht nur Zustände (G1), und Bewegung nur mit Sinn (SKILL:45).

## G. Responsive Design

**Telefon 390 × 844 (zuerst, eigene Komposition):** wie C.1. Daumenbereich: Rechtszeile und Knopf liegen am Seitenende unten, also gut
erreichbar. Von 360 bis 389 px werden die Spalten 164 px breit, es brechen mehr Einträge zweizeilig um. Unter 360 px oder bei 200 % Text
steht alles in einer Spalte: Containerabfrage in em (`@container fuss (max-width: 22.5em)`), damit die Textvergrößerung sie auslöst; die
E-Mail bekommt `overflow-wrap: anywhere`. Bis 320 px scrollt nichts seitlich (SG 10.10 Nr. 19).

**640–1023 px (8 Spalten):** Jede Gruppe läuft über die volle Breite mit zwei Spalten à 4; Zone 2 Marke 1–4 · E-Mail 5–8; die Rechtszeile
fließt über 1–8, der Knopf steht in einer eigenen Zeile.

**Schreibtisch 1024:** Raster wie bei 1280 in 922 px (Rand 51 px); Spalten à 212 px, „Eigener Fenster-Konfigurator“ bricht zweizeilig um
(Zeile 48); die Rechtszeile darf zweizeilig fließen. **1280:** wie C.2. **Ab 1440:** Die Spalte bleibt 1040 px.

## H. Technische Umsetzung

| Bestand | Umgang |
|---|---|
| `scripts/ratgeber-bausteine.mjs` (`GRUPPEN`, `fusszeile`, `FUSS`) | wird zum Generator für alle statischen Seiten: 24 Ratgeberseiten, 6 Seiten für Fensterbauer, Paketbedingungen, 6 Rechtsseiten, `web/404.html`, Textfassungen `web/index.html:97` und `web/app/index.html:84`; idempotent, Prüfsuite Abschnitt 10 vergleicht |
| `portal.js:477-482` `footer()` | öffentliche Fassung → `Fuss.html({ laenge: 'kurz', kontext: Ansicht, server: Server.an, einbettung })`; schlanke Fassung (angemeldet) und Instanz-Fuß bleiben (Betriebsbereich, eigene Skala, GEST:405) |
| `app.js:6629-6635` | Rechtszeile und Knopf aus `Fuss.RECHT`; Form der App bleibt (GEST:438, 8.3.10). **Festlegung I:** 08 nennt den kurzen Fuß auch für die App; volle Gruppen nur unter dem Startbild, Abgleich mit `ap-01` |
| `portal.js:810` | entfernt `.rg-pfad` in der Einbettung; nach Regel 6 ohne Wirkung, bleibt als Sicherung |
| `ratgeber.css:148-159`, `recht.css:44-53`, `portal.css:368-380` | Fußregeln wandern in eine gemeinsame Datei; `.fuss` mit 14 px (außerhalb der Skala) entfällt |

**Neu.** (1) `web/assets/fuss.js`, aufgebaut wie `web/assets/pakete.js` (läuft im Browser und in Node, ≈ 3 KB): `GRUPPEN`, `RECHT`,
`KONTAKT` (`telefon: null` bis O-9), `html(optionen)`; `SEITEN_INFO` und `WEG` werden hier gelesen, damit es eine Quelle bleibt.
(2) `web/assets/rahmen.css`, gemeinsam mit `rh-01` und `rh-02`; der Teil für den Fuß ≈ 2 KB. Er lädt auch auf den Seiten mit `recht.css`
und nutzt deshalb Tokens mit Ersatzwert (`var(--text2, #c9c8c3)`), weil `recht.css` andere Namen führt (`--fg`, `--bg`).

```html
<nav class="rg-pfad" aria-label="Brotkrumen"><ol><li><a href="/">Startseite</a></li><li aria-current="page">Für Fensterbauer</li></ol></nav>
<footer class="rg-fuss" id="navigation">
  <div class="fuss-wege">
    <nav class="fuss-gruppe" aria-labelledby="fg-fb"><p class="fuss-kopf" id="fg-fb">Für Fensterbauer</p><ul>…Angebot…</ul><ul>…Wissen…</ul></nav>
    <nav class="fuss-gruppe" aria-labelledby="fg-he">…</nav>
  </div>
  <div class="fuss-anbieter">
    <p class="fuss-marke"><svg class="fi-logo" aria-hidden="true">…</svg><span class="wm" translate="no"><b>eezi</b>frames</span></p>
    <p><a href="mailto:ask@eeziframes.com">ask@eeziframes.com</a></p>
    <ul class="fuss-recht">…</ul>
    <a class="rg-widerruf" href="/widerruf/">Vertrag widerrufen</a>
  </div>
</footer>
```

```css
.rg-fuss { container: fuss / inline-size; margin-top: 96px; padding: 24px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--line, #2b2b2b); background: none }
.fuss-gruppe { display: grid; grid-template-columns: 1fr 1fr; column-gap: 16px; margin-bottom: 24px }
.fuss-kopf { grid-column: 1 / -1; margin: 0 0 8px; font: 600 13px/20px var(--font); letter-spacing: .12em; text-transform: uppercase;
  color: var(--accent, #8fd694) }
.rg-fuss a { display: flex; align-items: center; min-height: 44px; min-width: 44px; padding: 4px 0; font-size: 15px; line-height: 20px;
  color: var(--text2, #c9c8c3); text-decoration: none; transition: color 150ms var(--e-out) }
.rg-fuss a[aria-current] { color: var(--text, #f3f2ee); font-weight: 700 }
.rg-fuss a.rg-widerruf { display: inline-flex; padding: 0 16px; border: 2px solid var(--text, #f3f2ee); border-radius: 999px;
  font-weight: 700; color: var(--text, #f3f2ee) }
.rg-pfad li + li::before { content: "›" / ""; color: var(--line2, #3a3a3a); margin: 0 8px }
@container fuss (max-width: 22.5em) { .fuss-gruppe { grid-template-columns: 1fr } }
@media print { .rg-fuss, .rg-pfad { display: none } }
```

Die Klassennamen `rg-fuss`, `rg-pfad` und `rg-widerruf` bleiben, und der Knopf steht genau als
`<a class="rg-widerruf" href="/widerruf/">`: Daran hängen der Musterabgleich `pruefen.mjs:3805`, die Druckregel (`ratgeber.css:168`;
GEST:437) und `:174`, `:1610`. Die eigene Seite ist heute grün (`ratgeber.css:159`); künftig steht sie in `--text` und fett, damit Grün
Signal bleibt.

**Assets:** keine neuen. Das Zeichen kommt als SVG aus `scripts/logo-setzen.py` bzw. aus `Logo.svg(24)`. **Leistung:** kein Bild, kein
nötiges Skript; HTML kurz ≈ 2,5 KB, lang ≈ 5 KB; statisch, also keine Layoutverschiebung. **Barrierefreiheit:** Landmarke `contentinfo`;
`nav` mit Namen je Gruppe; `ol` in den Brotkrumen, Trenner für Hilfstechnik stumm; `aria-current`; Fokusfolge = DOM = Sichtfolge; Ziele
≥ 44 px; Kontraste nach E; Rahmen statt Schatten unter `forced-colors`; Wortmarke mit `translate="no"`.

**Prüfsuite (IA-O-9):** `pruefen.mjs:513` sucht `.fuss a.widerruf-knopf` → `.rg-fuss a.rg-widerruf`; Abschnitt 10 umfasst künftig auch
Rechtsseiten, Paketbedingungen und 404. Die Startseite verlinkt weiter `/impressum/`, `/datenschutz/`, `/ratgeber/`,
`/fuer-fensterbauer/` (`:155`, `:1584`).

## I. Conversion-Begründung

- **Lage:** Recht und Kontakt am Seitenende sind Konvention (RE E2, R6; N11). Dort sucht man sie, und dort belasten sie keine
  Entscheidungsfläche.
- **Brotkrumen unten auf der Seite für Fensterbauer** sparen ≈ 40 px im ersten Bildschirm, in dem Preissignal und Cream in den oberen
  ≈ 600 px liegen müssen (E-1). Für Suchmaschinen bleibt der Pfad im JSON-LD [H, IA-H-10].
- **Gestaltung:** Stufe 1 ohne Cream lässt A4 die letzte Handlung der Seite sein (eine Cream je Bildschirm, SKILL:71). Marke, E-Mail und
  Impressum in einer Zone beantworten F-20 „Wer steckt dahinter?“ an einer Stelle.
- **Menge:** Kurz sind es 21 Links statt bis zu 39. Lang bleiben alle Artikel verlinkt, für die interne Verlinkung (IA 5.3.5).
- **Beitrag zur Zielhandlung:** ein Rückweg zu `#pakete` (FB-6), Fachartikel → Seite für Fensterbauer (FB-1), „Anmelden“ (FB-7),
  „Gesichertes Aufmaß öffnen“ (HE-7), Widerruf auf jeder Seite.

| Annahme [H] | Prüfweg | Rückfall |
|---|---|---|
| Brotkrumen unten schaden dem Pfad in der Suche nicht (IA-H-10) | Search Console, Pfadanzeige | oben wie heute |
| Die Kontextgruppe zuerst kürzt den Weg (Festlegung I) | Sichtprüfung des Inhabers | feste Folge FB, HE |
| „tun \| lesen“ wird ohne Unterköpfe verstanden | Lesetest | Unterköpfe 13 px (+ 28 px je Gruppe) |
| Die grünen Köpfe reichen für „farbig über 0,3 %“ am letzten Bildschirm | `farbanteil.py` bei 390 × 844 | Ausnahme für das Seitenende freigeben lassen, kein Grün als Schmuck |

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig (R3-AB-1).** GEST:438 legt die Folge fest: „Ratgeber-Links, dann
AGB, Nutzungsbedingungen, Datenschutz, Cookies, Impressum“. Vorschlag: Das Impressum steht als erster Rechtslink unter Marke und E-Mail,
und auf Fachartikeln steht die Gruppe „Für Fensterbauer“ vor den Ratgeber-Links. Grund: Anbieterprüfung an einer Stelle, Weg FB-1. Rückfall:
die Folge aus GEST:438. **Hinweis:** Die Brotkrumen unten (IA-H-10) führt 08 8.4.5 nicht als Abweichung. Liest der Inhaber GEST:429 als
Regel für ihre Lage, gilt auch das als Abweichung, mit dem Rückfall „oben“.

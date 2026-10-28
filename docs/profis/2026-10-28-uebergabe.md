# Übergabe: Seiten im alten Design (Stand 28.10.2026)

Diese Datei hält den Ist-Zustand fest, damit ein neuer Chat ohne Vorwissen weitermachen kann. Sie beschreibt nur, was
ist, und gibt keinen neuen Auftrag. Den Auftrag schickt der Inhaber im neuen Chat selbst.

## 1. Wo alles liegt

- **Repository:** `patrickkies-web/fenstero` (GitHub).
- **Arbeitszweig:** `claude/bestand-altes-design`, hochgeladen, **nicht** in main gemischt, nichts online.
  - Basis: main bei `1bba0d8` („Merge branch 'claude/fensterbauer-ohne-anker'“).
  - `b54f9b7`: Bestandsaufnahme, erste Fassung (nur erster Bildschirm je Seite).
  - `b5c936b`: zweite Fassung nach Korrektur des Inhabers (jede Seite in voller Länge, Ratgeber einzeln, Fensterbau Brandt).
  - danach: diese Übergabedatei.
- **Dateien auf dem Zweig:**
  - `docs/profis/2026-10-28-altes-design.md`: ausführliches Protokoll (Methode, Befund, Tabelle je Seite).
  - `docs/profis/2026-10-28-uebergabe.md`: diese Datei.
  - `docs/profis/bilder/2026-10-28-altes-design-uebersicht.jpg`: alle 49 alten Ansichten, erster Bildschirm am Telefon.
  - `docs/profis/bilder/2026-10-28-altes-design-ratgeber-ganz.jpg`: alle 24 Ratgeber-Seiten in voller Länge nebeneinander.
  - `docs/profis/werkzeuge/altes-design.mjs`: Messwerkzeug, wiederholt die ganze Bestandsaufnahme (siehe Abschnitt 7).
  - `.claude/skills/design-dna-eeziframes/SKILL.md`: Abschnitt 4 um die neue Regel ergänzt (siehe Abschnitt 6).
- **Liste mit allen Bildschirmfotos (Artifact):** https://claude.ai/artifact/N9pZWsD5DQ9FnL54c7zvqt. Sie ist privat und gehört
  zum bisherigen Account. Ein anderer Account kann sie erst öffnen, wenn sie über „Teilen“ freigegeben ist. Alle Bilder lassen
  sich mit dem Werkzeug neu erzeugen (etwa 15 Minuten).
- **An den Seiten selbst ist nichts geändert.** Es gab bisher nur die Bestandsaufnahme, noch keinen Umbau.

## 2. Der bisherige Auftrag

Der Inhaber hat seine Designlinie geändert (Design-DNA, Palette „Task-App dunkel“). Einige Seiten stehen noch im früheren
Design: Grün und Schwarz. Gefragt war eine Liste aller Seiten, die nicht nach seinem Prompt (Master-Anhängsel,
`.claude/skills/design-dna-eeziframes/master-anhaengsel.md`) gebaut sind, mit Bildschirmfotos.

Als besonders gelungen nennt der Inhaber und damit als Maßstab:
- die Startseite (`/`) und ihre Ansicht für Fensterbauer (Umschalter oben, `/fensterbauer`),
- die Paket-Vorschauen `/vorschau/paket-beispiel/essential.html`, `plus.html`, `signature.html` (Beispielbetrieb Fensterbau Brandt).

## 3. Woran „alt“ und „neu“ erkannt werden

| | Alt | Neu (Design-DNA) |
| --- | --- | --- |
| Grund | `#161616` | `#07090a` (Schwarz), Kacheln `#202022` (Anthrazit) |
| Signal | Grün `#8fd694` (Kicker, ein Wort je Überschrift, Haken, Plus) | Violett `#897efc`, Indigo `#3c3a66`, Koralle `#f88962` |
| Hauptknopf | Cream-Pille `#f1f0ea` | weiße Pille mit schwarzem Pfeilkreis |
| Schrift | Inter, fett | Outfit |
| Zeichnungen | Orange-Rot und Blau auf weißer Karte | Anthrazit und Violett (wie das Aufmaßblatt seit 27.10.) |

Als „alt“ gilt eine Seite, wenn ihr Grund `#161616` ist, ihre erste Überschrift in Inter steht oder ein sichtbares Element Grün trägt.

## 4. Ergebnis: 49 Ansichten im alten Design, 12 schon neu

| Bereich | Ansichten | Vorlage im Code |
| --- | ---: | --- |
| Ratgeber | 24 | `web/assets/gemeinsam.css` + `web/assets/ratgeber.css` |
| Wissen für Fensterbauer | 5 | `web/assets/gemeinsam.css` + `web/assets/ratgeber.css` |
| Rechtstexte und Fehlerseite | 8 | `web/assets/recht.css` |
| Konfigurator beim Fensterbauer | 10 | `web/assets/einladung.css` + `einladung.js` (Start), `functions/instanz/recht.js` (Impressum, Datenschutz), `functions/instanz/seiten.js` (Fehler, Zustände, `STIL`), `web/assets/portal.css` (Dashboard) |
| Alte Vorschauen, nicht verlinkt | 2 | `web/vorschau/app-start-a1614b4e6b/`, `web/vorschau/fensterbauer-79b44cf9f8/` |

Die 37 Seiten auf eeziframes.com (Ratgeber, Wissen, Recht, 404) hängen an zwei Vorlagen: `ratgeber.css` mit `gemeinsam.css`
(29 Seiten) und `recht.css` (8 Seiten).

### 4.1 Ratgeber (24 Seiten)

Adressen: `/ratgeber/` (Übersicht) und 23 Artikel unter `/ratgeber/<name>/`.

Alle 24 Seiten haben denselben Aufbau. Alt sind diese 13 Bausteine:
1. Band „Einführungspreis bis 17. November“ ganz oben mit grünem Etikett „Noch 21 Tage“ und grünem Link (nur Ratgeber; erzeugt in `functions/seo.js`, Funktion `banner`).
2. Kopf mit Logo und Cream-Pille „Fenster ausmessen“.
3. Kicker „Ratgeber · Stand 21. Oktober 2026“ in Grün, Versalien.
4. Überschrift in Inter fett, ein Wort grün (`.ak`).
5. Karte „Kurz gesagt“ auf `#1f1f1f` mit Rand.
6. Zwei Knöpfe: Cream-Pille mit schwarzem Pfeilkreis und Umriss-Pille, im Text je Seite noch einmal.
7. „Auf dieser Seite“: Inhaltsverzeichnis in zwei Spalten, letzter Punkt „Dein Weg: Schritt n von 6“ grün.
8. Zeichnung (SVG-Datei in `web/bilder/*.svg`) auf weißer Karte in Orange-Rot und Blau.
9. Hinweiskarten: „Gut zu wissen“ mit grünem Balken links, „Häufiger Fehler“ mit orangem Balken links.
10. Tabellen und Checklisten als Karten mit Versal-Etiketten und Kästchen.
11. Häufige Fragen zum Aufklappen, mit grünem Plus.
12. „Dein Weg zu neuen Fenstern“: sechs Kacheln mit grünem „Schritt n“, die aktuelle als Cream-Fläche „Du bist hier“; darunter „Nächster Schritt“ mit Bild und grünem Pfeil.
13. Weiterlesen, Quellen, Fußzeile; dort die aktuelle Seite grün.

Weitere Funde:
- **Fotos fehlen.** Die Übersicht `/ratgeber/` hat sieben Fotoplätze (`web/bilder/foto/ratgeber.webp` und `weg-pruefen`,
  `weg-entscheiden`, `weg-auswaehlen`, `weg-ausmessen`, `weg-vergleichen`, `weg-einbauen`, je `.webp`). Alle sieben sind nur der
  leere Platzhalter (3.494 Byte, gezeichnetes Fenster). Derselbe Platzhalter steht in 21 von 23 Artikeln in „Nächster Schritt“.
  Lüftungskonzept und RAL-Montage (Schritt 6) zeigen dort das Waschbär-Foto `app-start.webp`. Die in `docs/BILDER.md` geplanten
  Tierfotos gehören zur alten Bildsprache.
- **Kleiner Fehler:** `/ratgeber/uw-wert-fenster/`: Im Inhaltsverzeichnis steht „U w -Wert“ mit Lücke, die Tiefstellung (`<sub>`)
  fällt im Link aus der Zeile.

Je Seite (Länge am Telefon in CSS-Pixeln, ein Bildschirm sind 844; „× Grün“ = sichtbare grüne Elemente):

| Seite | Adresse | Länge | Abschn. | Fragen | Tabellen | Hinweise | Quellen | Schritt | Zeichnung | Bild „Nächster Schritt“ | × Grün | Besonderheit |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | ---: | --- |
| Ratgeber neue Fenster: prüfen, auswählen, ausmessen | `/ratgeber/` | 9.157 | 8 | – | – | – | – | – | – | 7 leere Platzhalter | 12 | alle sieben Fotoplätze leer |
| Aufmaßblatt Fenster als PDF: 12 Punkte, die draufgehören | `/ratgeber/aufmassblatt-fenster/` | 9.559 | 9 | 5 | 1 | 1 | 3 | 4 | aufmassblatt.svg | leerer Platzhalter | 18 |  |
| Balkontür ausmessen: Terrassentür, Hebe-Schiebe- und PSK-Tür | `/ratgeber/balkontuer-ausmessen/` | 9.727 | 10 | 5 | 2 | 1 | 5 | 4 | balkontuer.svg | leerer Platzhalter | 18 |  |
| Bestellmaß Fenster berechnen: Fuge je Seite, Tabelle, Beispiel | `/ratgeber/bestellmass-fenster/` | 7.529 | 8 | 4 | 2 | 1 | 4 | 4 | bestellmass.svg | leerer Platzhalter | 17 |  |
| Brüstungshöhe Fenster: 80 oder 90 cm? Mindestmaß und Geländer | `/ratgeber/bruestungshoehe-fenster/` | 7.815 | 9 | 4 | 1 | 1 | 3 | 4 | bruestung.svg | leerer Platzhalter | 17 |  |
| Fenster DIN links oder rechts? Die Hand-Regel mit Bild | `/ratgeber/din-links-rechts/` | 6.666 | 9 | 4 | 1 | 1 | 2 | 3 | din-links-rechts.svg | leerer Platzhalter | 17 |  |
| Dreifachverglasung oder Zweifach: Lohnt sich 3-fach-Glas? | `/ratgeber/dreifachverglasung/` | 9.559 | 9 | 5 | 1 | 1 | 9 | 3 | verglasung.svg | leerer Platzhalter | 20 |  |
| Wie alt sind meine Fenster? Baujahr in 3 Minuten erkennen | `/ratgeber/fenster-alter-erkennen/` | 10.306 | 9 | 5 | 2 | 1 | 6 | 1 | fenster-alter.svg | leerer Platzhalter | 20 |  |
| Fensterangebote vergleichen: Checkliste, Beispiel, Warnzeichen | `/ratgeber/fenster-angebot-vergleichen/` | 11.765 | 11 | 5 | 1 | 2 | 11 | 5 | angebote-vergleichen.svg | leerer Platzhalter | 20 |  |
| Fenster ausmessen in 6 Schritten: Anleitung auch für Altbau | `/ratgeber/fenster-ausmessen/` | 12.046 | 12 | 8 | 2 | 2 | 6 | 4 | messpunkte.svg | leerer Platzhalter | 23 |  |
| Fenster austauschen 2026: Kosten, Förderung und Ablauf | `/ratgeber/fenster-austauschen/` | 12.566 | 10 | 7 | 1 | 1 | 15 | 2 | fenster-austauschen.svg | leerer Platzhalter | 20 |  |
| Fenster beschlagen innen, außen oder zwischen den Scheiben? | `/ratgeber/fenster-beschlagen/` | 10.479 | 11 | 5 | 1 | 2 | 6 | 1 | fenster-beschlagen.svg | leerer Platzhalter | 20 |  |
| Fenstermaterial im Vergleich: Kunststoff, Holz oder Alu? | `/ratgeber/fenster-material-vergleich/` | 9.637 | 11 | 5 | 1 | 1 | 7 | 3 | fenstermaterial.svg | leerer Platzhalter | 20 |  |
| Fenster mit Rollladenkasten ausmessen: Aufsatz, Einbau, Vorbau | `/ratgeber/fenster-mit-rollladen-ausmessen/` | 8.223 | 10 | 4 | 1 | 2 | 4 | 4 | rollladen.svg | leerer Platzhalter | 19 |  |
| Fenster-Öffnungsarten: Dreh-Kipp, Kipp, Stulp oder fest? | `/ratgeber/fenster-oeffnungsarten/` | 10.990 | 10 | 6 | 2 | 2 | 6 | 3 | fenster-oeffnungsarten.svg | leerer Platzhalter | 21 |  |
| Fenster reparieren oder austauschen? Entscheidung in 3 Fragen | `/ratgeber/fenster-reparieren-oder-austauschen/` | 10.773 | 9 | 5 | 3 | 1 | 11 | 2 | fenster-entscheidung.svg | leerer Platzhalter | 18 |  |
| Fenster-Standardmaße: Tabelle mit Rohbau- und Fenstermaßen | `/ratgeber/fenster-standardmasse/` | 8.748 | 10 | 5 | 1 | 1 | 7 | 3 | fenster-standardmasse.svg | leerer Platzhalter | 18 |  |
| Fenster undicht? Zugluft in 1 Minute prüfen und beheben | `/ratgeber/fenster-undicht/` | 9.880 | 9 | 5 | 1 | 2 | 6 | 1 | fenster-undicht.svg | leerer Platzhalter | 20 |  |
| Fensterbank ausmessen innen und außen: Überstand, Gefälle | `/ratgeber/fensterbank-ausmessen/` | 8.851 | 10 | 5 | 1 | 1 | 5 | 4 | fensterbank.svg | leerer Platzhalter | 18 |  |
| Fenstertausch Altbau: so vermeidest du Schimmel an der Laibung | `/ratgeber/fenstertausch-altbau/` | 11.383 | 10 | 5 | 1 | 1 | 9 | 2 | fenstertausch-altbau.svg | leerer Platzhalter | 20 |  |
| Kellerfenster ausmessen: Maueröffnung, Zarge und Lichtschacht | `/ratgeber/kellerfenster-ausmessen/` | 9.560 | 9 | 5 | 2 | 1 | 6 | 4 | kellerfenster.svg | leerer Platzhalter | 18 |  |
| Lüftungskonzept beim Fenstertausch: Pflicht, Lösungen, Kosten | `/ratgeber/lueftungskonzept-fenstertausch/` | 9.944 | 9 | 5 | 3 | 1 | 7 | 6 | lueftungskonzept.svg | Waschbär-Foto | 20 | letzter Schritt mit Waschbär-Foto |
| RAL-Montage Fenster: 3 Ebenen einfach erklärt, mit Prüfliste | `/ratgeber/ral-montage-fenster/` | 11.086 | 11 | 5 | 1 | 1 | 9 | 6 | ral-montage.svg | Waschbär-Foto | 20 | letzter Schritt mit Waschbär-Foto |
| Uw-Wert beim Fenster: Bedeutung, Berechnung, Förderung 2026 | `/ratgeber/uw-wert-fenster/` | 11.673 | 10 | 5 | 3 | 1 | 10 | 3 | uw-wert.svg | leerer Platzhalter | 18 | Inhaltsverzeichnis: „U w -Wert“ mit Lücke |

### 4.2 Wissen für Fensterbauer (5) und Rechtstexte mit Fehlerseite (8)

- Wissen: `/fuer-fensterbauer/aufmass-kostenpflichtig/`, `erstaufmass-feinaufmass/`, `falsches-aufmass-haftung/`,
  `fensterbau-software/`, `geplatzter-aufmasstermin/`. Dieselbe Vorlage wie der Ratgeber, Knopf „Pakete ansehen“ als Cream-Pille.
  Das Band „Einführungspreis“ und „Dein Weg“ gibt es hier nicht. Die Verkaufsseite `/fuer-fensterbauer/` selbst ist schon neu.
- Recht: `/impressum/`, `/datenschutz/`, `/agb/`, `/nutzungsbedingungen/`, `/cookies/`, `/widerruf/`, `/konfigurator-bedingungen/`
  und die Fehlerseite `web/404.html`, die auch unter `/betrieb/` erscheint. Reine Textseiten: Grün nur im Kicker
  (Fehlerseite auch im Wort „nicht“), Karten auf `#1f1f1f`, Cream-Knöpfe.

| Seite | Adresse | Länge | × Grün |
| --- | --- | ---: | ---: |
| Aufmaß kostenpflichtig? Anfahrtspauschale richtig vereinbaren | `/fuer-fensterbauer/aufmass-kostenpflichtig/` | 8.529 | 8 |
| Erstaufmaß und Feinaufmaß: Unterschied, Prüfliste, Toleranzen | `/fuer-fensterbauer/erstaufmass-feinaufmass/` | 9.760 | 10 |
| Falsches Aufmaß: Wer haftet, wenn Fenster nicht passen? | `/fuer-fensterbauer/falsches-aufmass-haftung/` | 9.855 | 10 |
| Fensterbau-Software 2026: ERP, Aufmaß-App oder Selbstaufmaß? | `/fuer-fensterbauer/fensterbau-software/` | 9.177 | 10 |
| Geplatzter Aufmaßtermin: Was er kostet und wie Sie vorbeugen | `/fuer-fensterbauer/geplatzter-aufmasstermin/` | 9.059 | 8 |
| Impressum | `/impressum/` | 1.454 | 1 |
| Datenschutz | `/datenschutz/` | 20.423 | 1 |
| AGB | `/agb/` | 11.877 | 1 |
| Konto für Fensterbauer eingestellt | `/nutzungsbedingungen/` | 1.989 | 1 |
| Cookies | `/cookies/` | 5.661 | 1 |
| Vertrag widerrufen | `/widerruf/` | 1.563 | 1 |
| Paketbedingungen der Konfigurator-Pakete | `/konfigurator-bedingungen/` | 38.119 | 1 |
| Seite nicht gefunden | `/gibt-es-nicht/` | 844 | 2 |

### 4.3 Konfigurator beim Fensterbauer (10 Ansichten)

Das sieht jeder Kunde eines Betriebs, der ein Paket gekauft hat, unter dessen Domain:
1. Startbildschirm Essential (Kicker und Wort grün)
2. Startbildschirm Essential Plus
3. Startbildschirm Signature (Plus und Signature mit der Firmenfarbe statt Grün, sonst alt)
4. Blatt „So funktioniert es“
5. Impressum des Betriebs
6. Datenschutz des Betriebs
7. Fehlerseite
8. Dashboard Signature, Anmeldung (`/betrieb/`)
9. Dashboard Signature, angemeldet
10. Zustandsseiten „gerade nicht erreichbar“ (auch „in Vorbereitung“ und „beendet“, alle aus `fehlerSeite` in `functions/instanz/seiten.js`)

Ab „Erstes Fenster ausmessen“ ist der Konfigurator schon neu. Die Paket-Vorschau auf eeziframes.com zeigt den
Fensterbauern das neue Design, nach dem Kauf sieht ihr Kunde aber den alten Startbildschirm.

Diese Ansichten wurden **lokal nachgestellt**, denn online gibt es noch keinen Konfigurator eines Fensterbauers. Dafür
wurde im Testserver der Beispielbetrieb Fensterbau Brandt (Köln, Petra Brandt, Firmenfarbe Aquatürkis `#2ab4bd`)
angelegt, je Paket eine Instanz und eine pausierte. Die Namen Fensterbau Amsel, Glaserei Fink, Fensterwerk Specht und
Holzfenster Meise sind erfundene Testbetriebe der Prüfsuite (`scripts/dev-server.mjs`, Liste `STANDARD`; Prüfungen in
`scripts/pruefen-instanzen/23.mjs` und `24.mjs`). Sie entstehen nur im Arbeitsspeicher des lokalen Testservers und waren nie online.

### 4.4 Alte Vorschauen (2)

`/vorschau/app-start-a1614b4e6b/` und `/vorschau/fensterbauer-79b44cf9f8/`: nicht verlinkt, mit noindex, aber über die
Adresse erreichbar. Sie zeigen den Stand, den Startseite und Verkaufsseite inzwischen ersetzt haben.

### 4.5 Schon in der Design-DNA (12 Ansichten)

- Startseite `/` (Hauseigentümer) und `/fensterbauer`, Verkaufsseite `/fuer-fensterbauer/`
- Paket-Vorschau Essential, Plus, Signature (`/vorschau/paket-beispiel/`)
- App `/app/` mit Start, Führung und Konfigurator
- Bestellung `/bestellen/`, Kundenbereich `/konto/`, Zentrale `/zentrale/` (alle `web/assets/auftrag.css`)
- Vorschau Konfigurator `/vorschau/konfigurator-5269b7215a/`

### 4.6 Außerhalb der Website (nicht fotografiert)

- Anmelde-Mails in Supabase (`supabase/vorlagen/anmeldecode.html`, `registrierung.html`): noch Grün auf `#161616`.
- Mails des Servers an Fensterbauer (Code fürs Dashboard, neue Anfrage, Benachrichtigung in `functions/api/`): noch `#161616`.
- Das Aufmaßblatt (PDF) ist seit 27.10.2026 schon in der Druckpalette der Design-DNA.

## 5. Was noch nicht begonnen ist

- Keine der 49 alten Ansichten ist umgebaut.
- Keine Fotos für die sieben leeren Plätze im Ratgeber.
- Der Fehler im Inhaltsverzeichnis Uw-Wert ist nicht behoben.
- Die Mails sind nicht angepasst.
- Der Arbeitszweig ist nicht in main gemischt.

## 6. Korrekturen des Inhabers aus diesem Chat (gelten als Regel)

Eingetragen in `.claude/skills/design-dna-eeziframes/SKILL.md`, Abschnitt 4, „Bestandsaufnahmen gründlich“:
- Jede Seite in voller Länge fotografieren (vorher durchscrollen), am Telefon und am Schreibtisch, und selbst ansehen, nicht
  nur messen. Der erste Bildschirm allein reicht nie.
- Bilder für den Inhaber nie mit den Testbetrieben der Prüfsuite. Muss ein Betrieb gezeigt werden, den es online nicht gibt:
  Fensterbau Brandt aus der Paket-Vorschau, lokal nachgestellt, und das in der Lieferung sagen.
- Bilder in einer Liste laden sofort (kein `loading="lazy"`).

Weiter gelten unverändert: `CLAUDE.md` (Deutsch, Gestaltung nur nach `design-dna` mit Begleit-Skill `design-dna-eeziframes`,
`profis` nur eine Runde, `emil-design-eng` bei Bewegung) und der Master-Anhängsel
(`.claude/skills/design-dna-eeziframes/master-anhaengsel.md`).

## 7. Bestandsaufnahme wiederholen

```bash
git checkout claude/bestand-altes-design
KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 BETRIEBSKONTO=0 PORT=8789 node scripts/dev-server.mjs   # in einem eigenen Fenster
node docs/profis/werkzeuge/altes-design.mjs <ausgabeordner> http://localhost:8789
```

Das Werkzeug legt Fensterbau Brandt im Testserver an. Es fotografiert alle 61 Ansichten: je erster Bildschirm und ganze Seite,
am Telefon (390 px) und am Schreibtisch (1280 px). Dann misst es Grund, Schrift und Farben samt Rändern, Schatten und
Pseudo-Elementen, dazu die Ratgeber-Bausteine. Es schreibt `ergebnis.json` und gibt je Seite eine Zeile „alt“ oder „neu“ aus.
Nach einem Umbau dient es als Gegenprobe. Es braucht Playwright unter `/opt/node-tools/node_modules/playwright` (im
Cloud-Container vorhanden) und läuft etwa 15 Minuten.

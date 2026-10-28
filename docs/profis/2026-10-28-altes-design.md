# Seiten im alten Design, Bestandsaufnahme 28.10.2026

Auftrag des Inhabers: Prüfen, welche Seiten der Website noch im früheren Design stehen (Grün und Schwarz) und nicht nach dem
Master-Anhängsel mit der Design-DNA gebaut sind; als Liste mit Bildschirmfoto. Maßstab: die Startseite in beiden Ansichten
(Hauseigentümer und Fensterbauer) und die Paket-Vorschauen, die der Inhaber als besonders gelungen nennt.

Nur Bestandsaufnahme, an den Seiten ist nichts geändert.

- Liste mit allen Bildern (erster Bildschirm und ganze Seite, Telefon und Schreibtisch): https://claude.ai/artifact/N9pZWsD5DQ9FnL54c7zvqt (privat)
- Übersichtsbild: `docs/profis/bilder/2026-10-28-altes-design-uebersicht.jpg`
- Werkzeug zum Wiederholen (auch als Gegenprobe nach dem Umbau): `docs/profis/werkzeuge/altes-design.mjs`

## Korrektur des Inhabers (zweite Fassung, 28.10.2026)

Die erste Fassung zeigte je Seite nur den ersten Bildschirm, und die Ratgeber-Seiten waren nicht einzeln durchgesehen
(„die hast du ja noch gar nicht überprüft … vernünftig vorgehen“). Außerdem standen in den Bildern der Konfiguratoren die
Testbetriebe der Prüfsuite (Fensterbau Amsel, Glaserei Fink, Fensterwerk Specht, Holzfenster Meise), ohne Erklärung.
Daraus gilt jetzt:

- Bei einer Bestandsaufnahme jede Seite in voller Länge fotografieren (vorher einmal durchscrollen, damit nachgeladene Bilder
  stehen), am Telefon und am Schreibtisch, und jede Seite selbst ansehen, nicht nur messen.
- Bilder für den Inhaber nie mit den Testbetrieben der Prüfsuite. Wo ein Betrieb gezeigt werden muss, den es online noch nicht
  gibt: den Beispielbetrieb Fensterbau Brandt aus der Paket-Vorschau, lokal nachgestellt, und das in der Lieferung sagen.
- In der Liste die Bilder sofort laden (kein `loading="lazy"`), damit sie in der App des Inhabers sicher erscheinen.

Die Testbetriebe gibt es nur im lokalen Testserver (`scripts/dev-server.mjs`, Liste `STANDARD`) und in den Prüfungen 23 und
24 (`scripts/pruefen-instanzen/`). Sie wurden nie online gestellt; der Testserver legt sie nur auf Abruf im Arbeitsspeicher an.

## Wie gemessen

Stand von main (1bba0d8), lokaler Testserver mit Attrappen (`KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 BETRIEBSKONTO=0`).
Jede Seite am Telefon (390 × 844, doppelte Dichte) und am Schreibtisch (1280 × 800): erster Bildschirm nach 2,6 s, dann einmal
durchgescrollt und in voller Länge. Im DOM samt Schatten-DOM: Grund von body/html, Schrift der ersten Überschrift, sichtbare
Elemente in Grün (Farbton 95–165°), Violett (232–265°) und Koralle, auch Ränder, Schatten und `::before`/`::after`; dazu die
Bausteine je Ratgeber-Seite. Die 24 Ratgeber-Seiten, die 5 Fachartikel und die Rechtstexte zusätzlich von Hand, Abschnitt für Abschnitt.

Als „alt“ gilt eine Seite, wenn ihr Grund `#161616` ist, ihre Überschrift in Inter steht oder ein sichtbares Element Grün trägt.
Neu heißt: Grund `#07090a`, Outfit, Violett und Koralle aus der Palette „Task-App dunkel“, kein Grün.

## Ergebnis

49 Ansichten im alten Design (37 Seiten auf eeziframes.com, 10 Ansichten im Konfigurator beim Fensterbauer, 2 alte Vorschauen),
12 schon in der Design-DNA.

| Bereich | Ansichten | Vorlage im Code |
| --- | ---: | --- |
| Konfigurator beim Fensterbauer | 10 | `web/assets/einladung.css`/`einladung.js` (Start), `functions/instanz/recht.js`, `functions/instanz/seiten.js`, `web/assets/portal.css` (Dashboard) |
| Ratgeber | 24 | `web/assets/gemeinsam.css` und `web/assets/ratgeber.css` |
| Wissen für Fensterbauer | 5 | `web/assets/gemeinsam.css` und `web/assets/ratgeber.css` |
| Rechtstexte und Fehlerseite | 8 | `web/assets/recht.css` |
| Alte Vorschauen, nicht verlinkt | 2 | `web/vorschau/app-start-a1614b4e6b/`, `web/vorschau/fensterbauer-79b44cf9f8/` |

Zwei Vorlagen tragen alle 37 Seiten auf eeziframes.com: `ratgeber.css` mit `gemeinsam.css` (29) und `recht.css` (8).

### Konfigurator beim Fensterbauer (10)

Das sieht jeder Kunde eines Betriebs, der ein Paket gekauft hat. Alt sind: Startbildschirm in allen drei Paketen (Essential mit
Grün, Plus und Signature mit der Firmenfarbe an seiner Stelle; Grund, Schrift und Cream-Pille bleiben die alten), das Blatt
„So funktioniert es“, Impressum und Datenschutz des Betriebs, Fehlerseite, Dashboard von Signature (Anmeldung und angemeldet)
und die Zustandsseiten (gerade nicht erreichbar, in Vorbereitung, beendet; alle aus `fehlerSeite`). Ab „Erstes Fenster
ausmessen“ ist der Konfigurator schon neu. Die Paket-Vorschau auf eeziframes.com zeigt den Fensterbauern dagegen schon das
neue Design: Nach dem Kauf sieht ihr Kunde einen anderen Startbildschirm als in der Vorschau.

Nachgestellt im lokalen Testserver mit Fensterbau Brandt (Köln, Petra Brandt, Firmenfarbe Aquatürkis `#2ab4bd` aus seiner
Palette), je Paket eine Instanz und eine pausierte; online gibt es noch keinen Konfigurator eines Fensterbauers.

### Ratgeber (24): Befund

Alle 24 Seiten bauen auf derselben Vorlage auf. Was auf jeder Seite alt ist:

1. Band „Einführungspreis bis 17. November“ ganz oben, mit grünem Etikett „Noch 21 Tage“ und grünem Link (nur Ratgeber, `functions/seo.js`, `banner`).
2. Kopf mit Logo und Cream-Pille „Fenster ausmessen“.
3. Kicker „Ratgeber · Stand 21. Oktober 2026“ in Grün, Versalien.
4. Überschrift in Inter fett, ein Wort grün.
5. Karte „Kurz gesagt“ auf `#1f1f1f` mit Rand.
6. Zwei Knöpfe: Cream-Pille mit schwarzem Pfeilkreis und Umriss-Pille; im Text je Seite noch einmal.
7. „Auf dieser Seite“: Inhaltsverzeichnis in zwei Spalten, letzter Punkt „Dein Weg: Schritt n von 6“ in Grün.
8. Zeichnung auf weißer Karte in den alten Zeichnungsfarben Orange-Rot und Blau (das Aufmaßblatt zeichnet seit dem 27.10. in Anthrazit und Violett).
9. Hinweiskarten: „Gut zu wissen“ mit grünem Balken links, „Häufiger Fehler“ mit orangem Balken links.
10. Tabellen und Checklisten als Karten mit Versal-Etiketten und Kästchen.
11. Häufige Fragen zum Aufklappen, mit grünem Plus.
12. „Dein Weg zu neuen Fenstern“: sechs Kacheln mit grünem „Schritt n“, die aktuelle als Cream-Fläche „Du bist hier“, darunter „Nächster Schritt“ mit Bild und grünem Pfeil.
13. Weiterlesen, Quellen und Fußzeile; in der Fußzeile die aktuelle Seite grün.

Weitere Funde:

- **Fotos fehlen.** Die Ratgeber-Übersicht hat sieben Fotoplätze (`ratgeber.webp`, `weg-*.webp`), alle sind nur der leere
  Platzhalter (3.494 Byte, ein gezeichnetes Fenster). Derselbe Platzhalter steht auf 21 von 23 Artikeln in „Nächster Schritt“;
  Lüftungskonzept und RAL-Montage (Schritt 6) zeigen stattdessen das Waschbär-Foto der App. Die geplanten Tierfotos aus
  docs/BILDER.md gehören zur alten Bildsprache.
- **Kleiner Fehler im Bestand.** Uw-Wert: Im Inhaltsverzeichnis steht „U w -Wert“ mit Lücke, weil die Tiefstellung
  (`<sub>`) im Link aus der Zeile fällt. Beim Umbau mit beheben.

Je Seite (Länge am Telefon in CSS-Pixeln, ein Bildschirm sind 844; „× Grün“ zählt sichtbare grüne Elemente):

| Seite | Adresse | Länge | Abschn. | Fragen | Tabellen | Hinweise | Quellen | Schritt | Zeichnung | Bild „Nächster Schritt“ | × Grün | Besonderheit |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | ---: | --- |
| Ratgeber neue Fenster: prüfen. auswählen. ausmessen | `/ratgeber/` | 9.157 | 8 | – | – | – | – | – | – | 7 leere Platzhalter | 12 | alle sieben Fotoplätze leer |
| Aufmaßblatt Fenster als PDF: 12 Punkte. die draufgehören | `/ratgeber/aufmassblatt-fenster/` | 9.559 | 9 | 5 | 1 | 1 | 3 | 4 | aufmassblatt.svg | leerer Platzhalter | 18 |  |
| Balkontür ausmessen: Terrassentür. Hebe-Schiebe- und PSK-Tür | `/ratgeber/balkontuer-ausmessen/` | 9.727 | 10 | 5 | 2 | 1 | 5 | 4 | balkontuer.svg | leerer Platzhalter | 18 |  |
| Bestellmaß Fenster berechnen: Fuge je Seite. Tabelle. Beispiel | `/ratgeber/bestellmass-fenster/` | 7.529 | 8 | 4 | 2 | 1 | 4 | 4 | bestellmass.svg | leerer Platzhalter | 17 |  |
| Brüstungshöhe Fenster: 80 oder 90 cm? Mindestmaß und Geländer | `/ratgeber/bruestungshoehe-fenster/` | 7.815 | 9 | 4 | 1 | 1 | 3 | 4 | bruestung.svg | leerer Platzhalter | 17 |  |
| Fenster DIN links oder rechts? Die Hand-Regel mit Bild | `/ratgeber/din-links-rechts/` | 6.666 | 9 | 4 | 1 | 1 | 2 | 3 | din-links-rechts.svg | leerer Platzhalter | 17 |  |
| Dreifachverglasung oder Zweifach: Lohnt sich 3-fach-Glas? | `/ratgeber/dreifachverglasung/` | 9.559 | 9 | 5 | 1 | 1 | 9 | 3 | verglasung.svg | leerer Platzhalter | 20 |  |
| Wie alt sind meine Fenster? Baujahr in 3 Minuten erkennen | `/ratgeber/fenster-alter-erkennen/` | 10.306 | 9 | 5 | 2 | 1 | 6 | 1 | fenster-alter.svg | leerer Platzhalter | 20 |  |
| Fensterangebote vergleichen: Checkliste. Beispiel. Warnzeichen | `/ratgeber/fenster-angebot-vergleichen/` | 11.765 | 11 | 5 | 1 | 2 | 11 | 5 | angebote-vergleichen.svg | leerer Platzhalter | 20 |  |
| Fenster ausmessen in 6 Schritten: Anleitung auch für Altbau | `/ratgeber/fenster-ausmessen/` | 12.046 | 12 | 8 | 2 | 2 | 6 | 4 | messpunkte.svg | leerer Platzhalter | 23 |  |
| Fenster austauschen 2026: Kosten. Förderung und Ablauf | `/ratgeber/fenster-austauschen/` | 12.566 | 10 | 7 | 1 | 1 | 15 | 2 | fenster-austauschen.svg | leerer Platzhalter | 20 |  |
| Fenster beschlagen innen. außen oder zwischen den Scheiben? | `/ratgeber/fenster-beschlagen/` | 10.479 | 11 | 5 | 1 | 2 | 6 | 1 | fenster-beschlagen.svg | leerer Platzhalter | 20 |  |
| Fenstermaterial im Vergleich: Kunststoff. Holz oder Alu? | `/ratgeber/fenster-material-vergleich/` | 9.637 | 11 | 5 | 1 | 1 | 7 | 3 | fenstermaterial.svg | leerer Platzhalter | 20 |  |
| Fenster mit Rollladenkasten ausmessen: Aufsatz. Einbau. Vorbau | `/ratgeber/fenster-mit-rollladen-ausmessen/` | 8.223 | 10 | 4 | 1 | 2 | 4 | 4 | rollladen.svg | leerer Platzhalter | 19 |  |
| Fenster-Öffnungsarten: Dreh-Kipp. Kipp. Stulp oder fest? | `/ratgeber/fenster-oeffnungsarten/` | 10.990 | 10 | 6 | 2 | 2 | 6 | 3 | fenster-oeffnungsarten.svg | leerer Platzhalter | 21 |  |
| Fenster reparieren oder austauschen? Entscheidung in 3 Fragen | `/ratgeber/fenster-reparieren-oder-austauschen/` | 10.773 | 9 | 5 | 3 | 1 | 11 | 2 | fenster-entscheidung.svg | leerer Platzhalter | 18 |  |
| Fenster-Standardmaße: Tabelle mit Rohbau- und Fenstermaßen | `/ratgeber/fenster-standardmasse/` | 8.748 | 10 | 5 | 1 | 1 | 7 | 3 | fenster-standardmasse.svg | leerer Platzhalter | 18 |  |
| Fenster undicht? Zugluft in 1 Minute prüfen und beheben | `/ratgeber/fenster-undicht/` | 9.880 | 9 | 5 | 1 | 2 | 6 | 1 | fenster-undicht.svg | leerer Platzhalter | 20 |  |
| Fensterbank ausmessen innen und außen: Überstand. Gefälle | `/ratgeber/fensterbank-ausmessen/` | 8.851 | 10 | 5 | 1 | 1 | 5 | 4 | fensterbank.svg | leerer Platzhalter | 18 |  |
| Fenstertausch Altbau: so vermeidest du Schimmel an der Laibung | `/ratgeber/fenstertausch-altbau/` | 11.383 | 10 | 5 | 1 | 1 | 9 | 2 | fenstertausch-altbau.svg | leerer Platzhalter | 20 |  |
| Kellerfenster ausmessen: Maueröffnung. Zarge und Lichtschacht | `/ratgeber/kellerfenster-ausmessen/` | 9.560 | 9 | 5 | 2 | 1 | 6 | 4 | kellerfenster.svg | leerer Platzhalter | 18 |  |
| Lüftungskonzept beim Fenstertausch: Pflicht. Lösungen. Kosten | `/ratgeber/lueftungskonzept-fenstertausch/` | 9.944 | 9 | 5 | 3 | 1 | 7 | 6 | lueftungskonzept.svg | Waschbär-Foto | 20 | letzter Schritt mit Waschbär-Foto |
| RAL-Montage Fenster: 3 Ebenen einfach erklärt. mit Prüfliste | `/ratgeber/ral-montage-fenster/` | 11.086 | 11 | 5 | 1 | 1 | 9 | 6 | ral-montage.svg | Waschbär-Foto | 20 | letzter Schritt mit Waschbär-Foto |
| Uw-Wert beim Fenster: Bedeutung. Berechnung. Förderung 2026 | `/ratgeber/uw-wert-fenster/` | 11.673 | 10 | 5 | 3 | 1 | 10 | 3 | uw-wert.svg | leerer Platzhalter | 18 | Inhaltsverzeichnis: „U w -Wert“ mit Lücke |

### Wissen für Fensterbauer (5) und Rechtstexte mit Fehlerseite (8)

Die fünf Fachartikel nutzen dieselbe Vorlage wie der Ratgeber, mit „Pakete ansehen“ als Cream-Pille, Zeichnung in Orange-Rot
und Blau, „Gut zu wissen“ mit grünem Balken und Fragen mit grünem Plus; das Band „Einführungspreis“ und „Dein Weg“ fehlen hier.
Die Rechtstexte sind reine Textseiten: Grün nur im Kicker (Fehlerseite: auch im Wort „nicht“), Grund `#161616`, Inter, Karten
auf `#1f1f1f`, Cream-Knöpfe. Die Fehlerseite erscheint auch unter `/betrieb/`, seit der Bereich für Fensterbauer abgeschaltet ist.

| Seite | Adresse | Länge | × Grün |
| --- | --- | ---: | ---: |
| Aufmaß kostenpflichtig? Anfahrtspauschale richtig vereinbaren | `/fuer-fensterbauer/aufmass-kostenpflichtig/` | 8.529 | 8 |
| Erstaufmaß und Feinaufmaß: Unterschied. Prüfliste. Toleranzen | `/fuer-fensterbauer/erstaufmass-feinaufmass/` | 9.760 | 10 |
| Falsches Aufmaß: Wer haftet. wenn Fenster nicht passen? | `/fuer-fensterbauer/falsches-aufmass-haftung/` | 9.855 | 10 |
| Fensterbau-Software 2026: ERP. Aufmaß-App oder Selbstaufmaß? | `/fuer-fensterbauer/fensterbau-software/` | 9.177 | 10 |
| Geplatzter Aufmaßtermin: Was er kostet und wie Sie vorbeugen | `/fuer-fensterbauer/geplatzter-aufmasstermin/` | 9.059 | 8 |
| Impressum | `/impressum/` | 1.454 | 1 |
| Datenschutz | `/datenschutz/` | 20.423 | 1 |
| AGB | `/agb/` | 11.877 | 1 |
| Konto für Fensterbauer eingestellt | `/nutzungsbedingungen/` | 1.989 | 1 |
| Cookies | `/cookies/` | 5.661 | 1 |
| Vertrag widerrufen | `/widerruf/` | 1.563 | 1 |
| Paketbedingungen der Konfigurator-Pakete | `/konfigurator-bedingungen/` | 38.119 | 1 |
| Seite nicht gefunden | `/gibt-es-nicht/` | 844 | 2 |

### Alte Vorschauen (2)

`/vorschau/app-start-a1614b4e6b/` und `/vorschau/fensterbauer-79b44cf9f8/`: nicht verlinkt, mit noindex, aber über die Adresse
erreichbar. Sie zeigen den Stand, den Startseite und Verkaufsseite inzwischen ersetzt haben.

### Schon in der Design-DNA (12)

Startseite Hauseigentümer (`/`) und Fensterbauer (`/fensterbauer`), Verkaufsseite `/fuer-fensterbauer/`, Paket-Vorschau
Essential, Plus und Signature (`/vorschau/paket-beispiel/`), App mit Start, Führung und Konfigurator (`/app/`), Bestellung
(`/bestellen/`), Kundenbereich (`/konto/`), Zentrale (`/zentrale/`), Vorschau Konfigurator (`/vorschau/konfigurator-5269b7215a/`).

## Außerhalb der Website (nicht fotografiert)

- Anmelde-Mails in Supabase (`supabase/vorlagen/anmeldecode.html`, `registrierung.html`): noch Grün auf `#161616`.
- Mails des Servers an Fensterbauer (Code fürs Dashboard, neue Anfrage, Benachrichtigung in `functions/api/`): noch `#161616`.
- Das Aufmaßblatt (PDF) ist seit dem 27.10.2026 in der Druckpalette der Design-DNA.

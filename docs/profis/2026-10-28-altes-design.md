# Seiten im alten Design, Bestandsaufnahme 28.10.2026

Auftrag des Inhabers: Prüfen, welche Seiten der Website noch im früheren Design stehen (Grün und Schwarz) und nicht nach dem
Master-Anhängsel mit der Design-DNA gebaut sind; als Liste mit Bildschirmfoto. Maßstab: die Startseite in beiden Ansichten
(Hauseigentümer und Fensterbauer) und die Paket-Vorschauen, die der Inhaber als besonders gelungen nennt.

Nur Bestandsaufnahme, an den Seiten ist nichts geändert.

- Liste mit allen Bildern (Telefon und Schreibtisch, Großansicht je Seite): https://claude.ai/artifact/N9pZWsD5DQ9FnL54c7zvqt (privat)
- Übersichtsbild: `docs/profis/bilder/2026-10-28-altes-design-uebersicht.jpg`
- Werkzeug zum Wiederholen (auch als Gegenprobe nach dem Umbau): `docs/profis/werkzeuge/altes-design.mjs`

## Wie gemessen

Stand von main (1bba0d8), lokaler Testserver mit Attrappen (`KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 BETRIEBSKONTO=0`),
damit auch die Konfiguratoren der Fensterbauer (`essential.localhost` usw.) laufen. Jede Seite am Telefon (390 × 844) und am
Schreibtisch (1280 × 800) nach 2,6 s fotografiert und im DOM samt Schatten-DOM gemessen: Grund von body/html, Schrift der ersten
Überschrift, sichtbare Elemente in Grün (Farbton 95–165°), Violett (232–265°) und Koralle.

Als „alt“ gilt eine Seite, wenn ihr Grund `#161616` ist, ihre Überschrift in Inter steht oder ein sichtbares Element Grün trägt.
Neu heißt: Grund `#07090a`, Outfit, Violett und Koralle aus der Palette „Task-App dunkel“, kein Grün.

## Ergebnis

48 Ansichten im alten Design, 12 schon in der Design-DNA.

| Bereich | Ansichten | Vorlage im Code |
| --- | ---: | --- |
| Konfigurator beim Fensterbauer | 9 | `web/assets/einladung.css`/`einladung.js` (Start), `functions/instanz/recht.js`, `functions/instanz/seiten.js`, `web/assets/portal.css` (Dashboard) |
| Ratgeber | 24 | `web/assets/gemeinsam.css` und `web/assets/ratgeber.css` |
| Wissen für Fensterbauer | 5 | `web/assets/gemeinsam.css` und `web/assets/ratgeber.css` |
| Rechtstexte und Fehlerseite | 8 | `web/assets/recht.css` |
| Alte Vorschauen, nicht verlinkt | 2 | `web/vorschau/app-start-a1614b4e6b/`, `web/vorschau/fensterbauer-79b44cf9f8/` |

Zwei Vorlagen tragen 37 Seiten auf eeziframes.com: `ratgeber.css` mit `gemeinsam.css` (29) und `recht.css` (8).

### Konfigurator beim Fensterbauer (9)

Das sieht jeder Kunde eines Betriebs, der ein Paket gekauft hat. Alt sind: Startbildschirm (Essential mit Grün, Plus und
Signature mit der Firmenfarbe an seiner Stelle, Grund, Schrift und Cream-Pille bleiben die alten), „So funktioniert es“,
Impressum und Datenschutz des Betriebs, Fehlerseite, Dashboard von Signature (Anmeldung und angemeldet), Zustandsseiten
(gerade nicht erreichbar, in Vorbereitung, beendet). Ab „Erstes Fenster ausmessen“ ist der Konfigurator schon neu.
Die Paket-Vorschau auf eeziframes.com zeigt den Fensterbauern dagegen schon das neue Design: Nach dem Kauf sieht ihr Kunde
einen anderen Startbildschirm als den aus der Vorschau.

### Seiten auf eeziframes.com (37)

Spalte „Grün“: Zahl der sichtbaren grünen Elemente auf der ganzen Seite. Alle 37 stehen auf `#161616` in Inter. Ratgeber und
Wissen tragen oben zusätzlich das Band „Einführungspreis“ mit grünem Etikett „Noch 21 Tage“ (`functions/seo.js`, `banner`).
Die Fehlerseite erscheint auch unter `/betrieb/`, seit der Bereich für Fensterbauer abgeschaltet ist.

| Bereich | Seite | Adresse | Grün |
| --- | --- | --- | ---: |
| Ratgeber | Ratgeber neue Fenster: prüfen, auswählen, ausmessen | `/ratgeber/` | 12 |
| Ratgeber | Aufmaßblatt Fenster als PDF: 12 Punkte, die draufgehören | `/ratgeber/aufmassblatt-fenster/` | 12 |
| Ratgeber | Balkontür ausmessen: Terrassentür, Hebe-Schiebe- und PSK-Tür | `/ratgeber/balkontuer-ausmessen/` | 12 |
| Ratgeber | Bestellmaß Fenster berechnen: Fuge je Seite, Tabelle, Beispiel | `/ratgeber/bestellmass-fenster/` | 12 |
| Ratgeber | Brüstungshöhe Fenster: 80 oder 90 cm? Mindestmaß und Geländer | `/ratgeber/bruestungshoehe-fenster/` | 12 |
| Ratgeber | Fenster DIN links oder rechts? Die Hand-Regel mit Bild | `/ratgeber/din-links-rechts/` | 12 |
| Ratgeber | Dreifachverglasung oder Zweifach: Lohnt sich 3-fach-Glas? | `/ratgeber/dreifachverglasung/` | 13 |
| Ratgeber | Wie alt sind meine Fenster? Baujahr in 3 Minuten erkennen | `/ratgeber/fenster-alter-erkennen/` | 13 |
| Ratgeber | Fensterangebote vergleichen: Checkliste, Beispiel, Warnzeichen | `/ratgeber/fenster-angebot-vergleichen/` | 13 |
| Ratgeber | Fenster ausmessen in 6 Schritten: Anleitung auch für Altbau | `/ratgeber/fenster-ausmessen/` | 13 |
| Ratgeber | Fenster austauschen 2026: Kosten, Förderung und Ablauf | `/ratgeber/fenster-austauschen/` | 12 |
| Ratgeber | Fenster beschlagen innen, außen oder zwischen den Scheiben? | `/ratgeber/fenster-beschlagen/` | 13 |
| Ratgeber | Fenstermaterial im Vergleich: Kunststoff, Holz oder Alu? | `/ratgeber/fenster-material-vergleich/` | 13 |
| Ratgeber | Fenster mit Rollladenkasten ausmessen: Aufsatz, Einbau, Vorbau | `/ratgeber/fenster-mit-rollladen-ausmessen/` | 13 |
| Ratgeber | Fenster-Öffnungsarten: Dreh-Kipp, Kipp, Stulp oder fest? | `/ratgeber/fenster-oeffnungsarten/` | 13 |
| Ratgeber | Fenster reparieren oder austauschen? Entscheidung in 3 Fragen | `/ratgeber/fenster-reparieren-oder-austauschen/` | 12 |
| Ratgeber | Fenster-Standardmaße: Tabelle mit Rohbau- und Fenstermaßen | `/ratgeber/fenster-standardmasse/` | 12 |
| Ratgeber | Fenster undicht? Zugluft in 1 Minute prüfen und beheben | `/ratgeber/fenster-undicht/` | 13 |
| Ratgeber | Fensterbank ausmessen innen und außen: Überstand, Gefälle | `/ratgeber/fensterbank-ausmessen/` | 12 |
| Ratgeber | Fenstertausch Altbau: so vermeidest du Schimmel an der Laibung | `/ratgeber/fenstertausch-altbau/` | 13 |
| Ratgeber | Kellerfenster ausmessen: Maueröffnung, Zarge und Lichtschacht | `/ratgeber/kellerfenster-ausmessen/` | 12 |
| Ratgeber | Lüftungskonzept beim Fenstertausch: Pflicht, Lösungen, Kosten | `/ratgeber/lueftungskonzept-fenstertausch/` | 13 |
| Ratgeber | RAL-Montage Fenster: 3 Ebenen einfach erklärt, mit Prüfliste | `/ratgeber/ral-montage-fenster/` | 13 |
| Ratgeber | Uw-Wert beim Fenster: Bedeutung, Berechnung, Förderung 2026 | `/ratgeber/uw-wert-fenster/` | 12 |
| Wissen für Fensterbauer | Aufmaß kostenpflichtig? Anfahrtspauschale richtig vereinbaren | `/fuer-fensterbauer/aufmass-kostenpflichtig/` | 3 |
| Wissen für Fensterbauer | Erstaufmaß und Feinaufmaß: Unterschied, Prüfliste, Toleranzen | `/fuer-fensterbauer/erstaufmass-feinaufmass/` | 4 |
| Wissen für Fensterbauer | Falsches Aufmaß: Wer haftet, wenn Fenster nicht passen? | `/fuer-fensterbauer/falsches-aufmass-haftung/` | 4 |
| Wissen für Fensterbauer | Fensterbau-Software 2026: ERP, Aufmaß-App oder Selbstaufmaß? | `/fuer-fensterbauer/fensterbau-software/` | 4 |
| Wissen für Fensterbauer | Geplatzter Aufmaßtermin: Was er kostet und wie Sie vorbeugen | `/fuer-fensterbauer/geplatzter-aufmasstermin/` | 3 |
| Rechtstexte und Fehlerseite | Impressum | `/impressum/` | 1 |
| Rechtstexte und Fehlerseite | Datenschutz | `/datenschutz/` | 1 |
| Rechtstexte und Fehlerseite | AGB | `/agb/` | 1 |
| Rechtstexte und Fehlerseite | Konto für Fensterbauer eingestellt | `/nutzungsbedingungen/` | 1 |
| Rechtstexte und Fehlerseite | Cookies | `/cookies/` | 1 |
| Rechtstexte und Fehlerseite | Vertrag widerrufen | `/widerruf/` | 1 |
| Rechtstexte und Fehlerseite | Paketbedingungen der Konfigurator-Pakete | `/konfigurator-bedingungen/` | 1 |
| Rechtstexte und Fehlerseite | Seite nicht gefunden | `/gibt-es-nicht/` | 2 |

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

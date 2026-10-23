# Übergabe: Konfigurator-Instanzen in drei Paketen

Stand 23.10.2026 (nach der Nacharbeit), Branch `claude/eager-sagan-2ey2vv`. Diese Datei ist für eine Claude-Code-Sitzung, die die Arbeit fortsetzt.

## Was es ist

eeziframes wird zum „Fenster-Editor der Wahl“ für Fensteranbieter. Jeder Fensterbauer bekommt einen eigenen Konfigurator auf einer eigenen Domain, als Paket **Essential**, **Plus** oder **Signature**. Er bestellt auf eeziframes.com, zahlt die Einrichtung vorab und verfolgt den Stand im Kundenkonto `/partner/`. Der Inhaber richtet jede Instanz in der Zentrale ein, ohne Code-Eingriff. Jede Anfrage eines Hausbesitzers geht als Mail mit dem Aufmaßblatt-PDF an den Betrieb. Signature hat zusätzlich ein Dashboard unter `https://<domain>/betrieb/`. eeziframes.com bleibt für Hausbesitzer (B2C) unverändert.

Verbindlich sind:
- **`BAUPLAN.md`** (in diesem Ordner): Zielbild, Datenmodell, Merkmal × Paket, Status-Matrix, Stränge, manuelle Schritte des Inhabers (§4), Entscheidungen E1–E30 (§5.1) und Fragen F1–F5 (§5.3).
- **`../INSTANZEN.md`**: Verträge und Schnittstellen, Stand nach Welle 3.
- **`../BESTELLUNG.md`**: Bestellung, Stripe, Paketbedingungen.

## Stand

| Schritt | Stand |
|---|---|
| S0 Fundament: Schema, `pakete.js`, `instanzregeln.js`, Sitzung, Bremse, dev-server mit `*.localhost` | fertig |
| Welle 1: A Server-Kern (Host → Instanz, Auslieferung, Eingang mit PDF und Mail) und D Kundenkonto, Bestellformular, Stripe | fertig |
| Welle 2: B Konfigurator-App im Instanz-Modus und C Zentrale (Bestellungen, Instanzen, Domain, Gestaltung, live, pausieren) | fertig |
| Welle 3: E Signature-Dashboard und F Verkaufsseite, Rechtstexte (Entwürfe), Doku | fertig |
| Abschnitt 30: Ende zu Ende je Paket, von der Bestellung bis zur Löschung | fertig |
| Volle Prüfsuite auf `e8d86a0`, Abschnitte 1–30 | **1641 bestanden, 0 fehlgeschlagen** |
| Prüfung durch zwei unabhängige Prüfer | fertig: 22 Befunde (1 muss, 9 sollte, 12 kann), siehe `PRUEFBEFUNDE.md` |
| Nacharbeit der Befunde | fertig: 19 behoben, 2 bestätigt (6, 7), 1 teilweise (17), 2 bewusst verschoben (11, 15), siehe Tabelle in `PRUEFBEFUNDE.md` |
| Volle Prüfsuite nach der Nacharbeit, Abschnitte 1–30 | **1679 bestanden, 0 fehlgeschlagen** (Stand a2d202d) |
| Verkaufsseite `/fuer-fensterbauer/` als Landingpage (Abschnitte, Scroll-Bewegung, Lottie-Zeichen marke/domain/dashboard, Bildplätze mit Platzhaltern) und Startseite: Ansicht „Fensterbauer“ bettet sie ein (23.10., Wunsch des Inhabers) | fertig; volle Suite auf dem Endstand **1683 bestanden, 0 fehlgeschlagen** (Lauf mit 1682/1, der eine Satz 30.W3 angepasst, Abschnitt 30 danach 136/0) |
| Verkaufsseite, zweite Runde (23.10., Inhaber: „zu wenig Bewegung“): Scroll-Bühne mit Telefon zu „So funktioniert es“, Bewegtbild-Band `konfigurator` (10-s-Schleife), `farbwechsel` im Vorspann der Pakete, Zeichen in den Paketkarten, gezeichnete Symbole der Zeitleiste, Ringe um die Kennzahlen, alle Zeichen als Schleife im Bild | fertig; volle Suite **1683 bestanden, 0 fehlgeschlagen** |
| Bilder der Verkaufsseite (23.10.): Startbild Astronaut in der Raumstation (vom Inhaber geliefert) mit Overlay aus drei eintrudelnden Meldungskarten und vier Chips auf der dunklen linken Bildhälfte; Bild „Warum Kunden selbst planen“ (winziger Meister auf der Fensterbank) mit vier Chips; Prompts für die übrigen zehn Plätze in `docs/BILDER.md` | fertig; Abschnitte 10, 29, 30 grün auf dem Endstand, Abschnitte 1 und 16 nach dem Merge von main (Konfigurator-Feinschliff) grün |
| Schlussprüfung, PR, Bericht an den Inhaber | auf Wunsch des Inhabers („Stell deine updates mal online“) nach main gemergt (#48–#51), Bericht übergeben |

Der Code ist auf main; die Seite ist über den Cloudflare-Build von main online. Pakete bleiben trotzdem geschlossen: Ohne `PAKETE_OFFEN=1` kann niemand ein Paket kaufen, und Instanz-Domains gibt es erst, wenn der Inhaber eine anlegt. Vor dem Öffnen: Preise, Rechtstexte, Einrichtung bei Cloudflare, Stripe und Resend (BAUPLAN §4).

## Nächste Schritte

1. Inhaber: PR ansehen und freigeben (Preise, Rechtstexte, Entscheidungen zu F1–F5 in `BAUPLAN.md` §5.3); Rechtstexte anwaltlich prüfen lassen, danach `VORLAGE.geprueft` in `functions/instanz/recht.js` setzen.
2. Inhaber: manuelle Schritte aus `BAUPLAN.md` §4 (Cloudflare, Supabase-Schema, Resend, Stripe, Secrets).
3. Offene Befunde mit „kann“ (11, 15, 17 Formularfeld) nachholen; Wortlaut in `PRUEFBEFUNDE.md`. Dazu die restlichen Bilder einbauen, sobald der Inhaber sie liefert (`docs/BILDER.md`, Abschnitt „Plätze für die Fensterbauer-Seiten“: Startbild und `fb-kunden-planen` sind echt, die Plätze `fb-anfrage`, `fb-kundenschutz`, `fb-pakete`, `fb-ablauf`, `fb-frage` zeigen Platzhalter aus `scripts/fotos.py`; die Plätze 8–12 für Kundenkonto und Essential-Bestätigung sind noch nicht verdrahtet). Ablauf je Bild: Original nach `fotos-roh/<name>.png`, `python3 scripts/fotos.py`, Alternativtext prüfen.
4. Entscheidung des Inhabers: Sollen auch die Zeitstempel des Altbestands (eeziframes.com, `stamp()`/`datum()` in modell.js) in deutscher Zeit entstehen? Heute laufen sie im Worker in UTC.
5. Prüfsuite wie bisher:
   ```
   node scripts/mit-server.mjs 8960 env PW_PFAD=<Ordner mit playwright-core> node scripts/pruefen.mjs
   ```
   Einzelne Abschnitte mit `NUR=<n>` davor. Testserver nur über `scripts/mit-server.mjs`. Bildschirmfotos aus Abschnitt 30 mit `BILDER30=<Ordner>`.

## Hinweise zur Umgebung

- Commits enden mit den Attributionszeilen der jeweiligen Sitzung.
- Stil: Deutsch. Kunde in der App per Du, Betrieb und Website per Sie. Styleguide `docs/GESTALTUNG.md`.
- Altbestand ist heilig: Die Abschnitte 1–22 bleiben grün.

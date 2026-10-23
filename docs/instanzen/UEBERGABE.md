# Übergabe: Konfigurator-Instanzen in drei Paketen

Stand 23.10.2026, Branch `claude/eager-sagan-2ey2vv`. Diese Datei ist für eine neue Claude-Code-Sitzung (anderer Account), die die Arbeit fortsetzt.

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
| Nacharbeit der Befunde | **offen**: begonnen und wegen des Wochenlimits abgebrochen; ungetesteter Zwischenstand in `nacharbeit-zwischenstand.patch` (`partner.js`, `portal.js`, `28.mjs`, `30.mjs`) |
| Schlussprüfung, PR, Bericht an den Inhaber | **offen** |

Der Code ist **nicht** auf main. Merge erst nach Freigabe durch den Inhaber (Preise, Rechtstexte, Einrichtung bei Cloudflare, Stripe und Resend, siehe BAUPLAN §4). Der Stand ist so gebaut, dass ein Merge auch vorher gefahrlos ist: Ohne `PAKETE_OFFEN=1` kann niemand ein Paket kaufen, und Instanz-Domains gibt es erst, wenn der Inhaber eine anlegt.

## Nächste Schritte

1. Zwischenstand ansehen (`git apply --check docs/instanzen/nacharbeit-zwischenstand.patch`). Übernehmen, was richtig ist, sonst neu machen.
2. Alle `muss`- und `sollte`-Befunde aus `PRUEFBEFUNDE.md` beheben oder begründet ablehnen. Zuerst Befund 1: `instanzDatenLoeschen` darf keine Anmeldung löschen, an der noch eigene B2C-Aufmaße hängen.
3. Volle Suite bis grün:
   ```
   node scripts/mit-server.mjs 8960 env PW_PFAD=<Ordner mit playwright-core> node scripts/pruefen.mjs
   ```
   Einzelne Abschnitte mit `NUR=<n>` davor. Testserver nur über `scripts/mit-server.mjs`. Bildschirmfotos aus Abschnitt 30 mit `BILDER30=<Ordner>`.
4. Bildschirmfotos ansehen: Verkaufsseite, Bestellformular, Kundenkonto, Zentrale, je Paket Start, Bestätigung, PDF und Mail, Signature-Dashboard.
5. Commit und Push auf `claude/eager-sagan-2ey2vv`, dann einen PR nach main öffnen (nicht mergen).
6. Bericht an den Inhaber, kurz und in einfacher Sprache:
   - was fertig ist;
   - Klick-Liste aus BAUPLAN §4 (Workers Paid, `SITZUNG_GEHEIMNIS`, Resend Pro mit `post.eeziframes.com`, Stripe-Ereignisse, `CF_API_TOKEN`/`CF_ACCOUNT_ID`, Supabase-Schema neu ausführen);
   - Fragen F1–F5;
   - Rechtstexte anwaltlich prüfen lassen.

## Hinweise zur Umgebung

- Commits enden mit den Attributionszeilen der jeweiligen Sitzung.
- Stil: Deutsch. Kunde in der App per Du, Betrieb und Website per Sie. Styleguide `docs/GESTALTUNG.md`.
- Altbestand ist heilig: Die Abschnitte 1–22 bleiben grün.

## Auftrag zum Einfügen in die neue Sitzung

> Repo patrickkies-web/fenstero, Branch `claude/eager-sagan-2ey2vv`. Lies `docs/instanzen/UEBERGABE.md` und arbeite die „Nächsten Schritte“ ab. Erst die Prüfbefunde aus `docs/instanzen/PRUEFBEFUNDE.md` (muss und sollte) beheben, dann volle Suite grün, Bildschirmfotos ansehen, pushen und einen PR nach main öffnen, aber nicht mergen. Danach gib mir einen kurzen Bericht in einfacher Sprache: was fertig ist, was ich bei Cloudflare, Stripe, Resend und Supabase klicken muss (BAUPLAN §4) und die offenen Fragen F1–F5. Entscheide technische Fragen selbst nach dem Bauplan.

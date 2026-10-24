# Bestand: Seiten, Inhalte, Navigation

Phase A der Neukonzeption (MASTER-PROMPT V4), Teil „Seiten, Inhalte, Navigation“.
Grundlage: Arbeitszweig `claude/design-dna-styleguide`, Commit `dc130d0` (24.10.2026). Nur gelesen, nichts verändert.

Lesehilfe:

- Belege stehen als `Datei:Zeile`. Zeilen in `web/assets/portal.js` und `web/assets/app.js` beziehen sich auf den Quelltext, aus dem
  die Seiten im Browser gezeichnet werden.
- Die bestehende Gestaltung ist kein Vorbild. Sie wird hier beschrieben und, wo nötig, kritisch eingeordnet.
- Maßstab für die Einordnung sind die Anforderungen des Inhabers in `.claude/skills/premium-gestaltung/SKILL.md` (kurz: SKILL) und die
  Markenregeln in `docs/GESTALTUNG.md`.
- Wortzahlen sind gezählt (sichtbarer Text ohne Grafiken) oder, bei Inhalten aus JavaScript, aus den Textbausteinen geschätzt („ca.“).

---

## 1. Seitenbaum mit URLs und Zweck

### 1.1 Überblick

```
eeziframes.com
├── /                               Startseite, eine Seite mit zwei Ansichten (portal.js)
│   ├── #hauseigentuemer            Ansicht Hauseigentümer (Standard)
│   ├── #fensterbauer  (#betriebe)  Ansicht Fensterbauer: bettet /fuer-fensterbauer/ ein
│   ├── #tour                       Tour für Fensterbauer, 8 Schritte (Aufmaß-Link-Modell)
│   ├── ?von=pdf                    Einstieg über den QR-Code im Aufmaßblatt → Ansicht Fensterbauer mit Hinweis
│   ├── #projekt-<id>               Sprung zu einem Projekt im Betriebsbereich (Link aus E-Mail)
│   └── ohne eigene URL:            „So funktioniert es“, „Preise“, „Registrieren“, Blatt „Anmelden“,
│                                   angemeldet: Betriebsbereich (Projekte, Nachrichten, Abrechnung, Betrieb)
├── /app/                           Mess-App für Hauseigentümer (app.js)
│   ├── #ausmessen                  springt direkt in den ersten Messschritt
│   ├── #fuehrung                   Führung, 9 Schritte, ohne eigene Maße
│   └── #k-…                        Aufmaß-Link eines Betriebs (Kundenlink)
├── /ratgeber/                      Übersicht „In sechs Schritten zu neuen Fenstern“
│   └── /ratgeber/<thema>/          23 Artikel für Hauseigentümer
├── /fuer-fensterbauer/             Verkaufsseite der Konfigurator-Pakete
│   └── /fuer-fensterbauer/<thema>/ 5 Fachartikel für Fensterbauer
├── /konfigurator-bedingungen/      Paketbedingungen mit AV-Vertrag, dazu je 2 PDF-Fassungen (22. und 23.10.2026)
├── /partner/                       Kundenkonto der Paket-Kunden (noindex), #bestellen/<paket>, #bestellung/<id>
├── /agb/  /nutzungsbedingungen/  /datenschutz/  /cookies/  /impressum/  /widerruf/
├── /zentrale/                      interner Bereich des Inhabers (noindex)
├── /betrieb/                       nur auf Domains der Konfigurator-Instanzen; auf der Hauptdomain 404
├── 404                             Fehlerseite (web/404.html)
└── System: /robots.txt  /sitemap.xml  /llms.txt  /og.png  /verifyforzoho.html  /f39851a8….txt (IndexNow-Schlüssel)

Domains der Paket-Kunden (Konfigurator-Instanzen, eigener Auslieferungsweg)
├── /                               App mit Kopf und Marke des Betriebs
├── /impressum/  /datenschutz/      je Instanz erzeugt
└── /betrieb/                       Dashboard (nur Paket Signature)
```

Belege: Ansichten und Anker `web/assets/portal.js:395-406`, `:1960-1976`; App-Anker `web/assets/app.js:6303`, `:6560-6612`;
Sitemap `functions/seo.js:20-59`; Kundenkonto `web/partner/index.html:18-20`; Instanzen `functions/instanz/seiten.js:1-17`;
Hauptdomain/Instanz-Weiche und 404 `worker.js:1-90`.

### 1.2 Seiten mit Zweck

| URL | Zweck laut Quelltext | Zielgruppe | Index | Beleg |
|---|---|---|---|---|
| `/` Ansicht Hauseigentümer | Selbst messen bewerben, Weg in die App | Hauseigentümer | ja (Sitemap 1.0) | `web/assets/portal.js:845-858` |
| `/` Ansicht Fensterbauer | dieselbe Verkaufsseite wie `/fuer-fensterbauer/`, eingebettet | Fensterbauer | (gleiche URL) | `web/assets/portal.js:792-850` |
| `/` Textfassung | Inhalt für Besucher ohne JavaScript und für Suchmaschinen; wird beim Laden ersetzt | beide | ja | `web/index.html:43-98` |
| `/app/` | Fenster messen, 3-D-Modell, Aufmaßblatt kaufen (7,99 €) | Hauseigentümer | ja (0.9) | `web/app/index.html`, `web/assets/app.js:2768` |
| `/ratgeber/` | Einstieg in 23 Artikel, gegliedert nach sechs Schritten | Hauseigentümer | ja (0.6) | `web/ratgeber/index.html` |
| `/ratgeber/<thema>/` | Suchanfragen beantworten, in die App führen | Hauseigentümer | ja (0.7–0.9) | `functions/seo.js:23-46` |
| `/fuer-fensterbauer/` | Konfigurator-Pakete verkaufen (zurzeit: anfragen) | Fensterbauer, Fensterhändler | ja (0.9) | `web/fuer-fensterbauer/index.html` |
| `/fuer-fensterbauer/<thema>/` | Fachfragen beantworten, zu den Paketen führen | Fensterbauer | ja (0.7) | `functions/seo.js:47-51` |
| `/konfigurator-bedingungen/` | Paketbedingungen und AV-Vertrag, „Entwurf zur anwaltlichen Prüfung“ | Paket-Kunden | ja (0.3) | `web/konfigurator-bedingungen/index.html:28`, `functions/pakete-seite.js:264` |
| `/partner/` | Bestellen, Status bis Live, Nachrichten, Rückruf, Rechnungen | Paket-Kunden | nein | `web/partner/index.html:6-9`, `web/assets/partner.js:131` |
| `/agb/` | Vertrag Aufmaßblatt (Hauseigentümer) | Verbraucher | ja (0.2) | `web/agb/index.html` |
| `/nutzungsbedingungen/` | Vertrag Aufmaß-Link-Modell (Tarife Start, Abo 10, Plus) | Betriebe | ja (0.2) | `web/nutzungsbedingungen/index.html:42-46` |
| `/datenschutz/`, `/cookies/`, `/impressum/`, `/widerruf/` | Pflichtangaben, Widerrufsformular | alle | ja (0.1–0.2) | `functions/seo.js:53-58` |
| `/zentrale/` | Bestellungen, Instanzen, Kennzahlen des Inhabers | intern | nein | `web/zentrale/index.html:17-20` |
| `/betrieb/` | Dashboard der Signature-Kunden | Paket-Kunden | nein | `web/betrieb/index.html:18-21` |
| 404 | Fehlerseite | alle | nein | `web/404.html` |

Status der Freigaben, die nicht im Repository stehen: Suchmaschinen sind nur mit der Variablen `INDEXIERUNG=1` zugelassen, sonst
`noindex` (`functions/seo.js:3-6`, `web/_headers:2-6`). Bestellung der Pakete nur mit `PAKETE_OFFEN=1`, Live-Demos nur mit
`PAKETE_DEMOS=1` (`functions/pakete-seite.js:13-16`). Welche Werte bei Cloudflare gesetzt sind, ist im Repository nicht erkennbar.
Die Datei-Fassung der Verkaufsseite zeigt „Vorläufige Preise“ und „Bestellung bald möglich“ (`web/fuer-fensterbauer/index.html:174`, `:220`).

---

## 2. Navigation und Seitenhierarchie

### 2.1 Kopfzeilen

| Seite | Logo führt zu | Links | Hauptknopf | Am Telefon sichtbar | Beleg |
|---|---|---|---|---|---|
| `/` Ansicht Hauseigentümer | Startseite (Ansicht bleibt) | Umschalter, „Ratgeber“ | „Fenster ausmessen“ bzw. „Aufmaß fortsetzen“ → `/app/#ausmessen` | Logo, Umschalter, Hauptknopf („Ratgeber“ ab 520 px ausgeblendet) | `web/assets/portal.js:441-449`, `web/assets/portal.css:59` |
| `/` Ansicht Fensterbauer | Startseite | Umschalter, „Preise“ (alte Tarife), „Anmelden“ | „Kostenlos starten“ / „Starten“ → Registrierung im Aufmaß-Link-Modell | Logo, „Anmelden“, „Starten“, Umschalter | `web/assets/portal.js:450`, Bildschirmfoto `screens/mobil-fensterbauer-ansicht-01.jpg` |
| `/` Textfassung (ohne JS) | `/` | Ratgeber, Für Fensterbauer | „Fenster ausmessen“ → `/app/#ausmessen` | nur Logo und Knopf | `web/index.html:46`, `web/assets/ratgeber.css:15` |
| `/app/` (App) | Startseite, nur auf dem Startbild | „Übersicht“ (ab dem ersten Schritt), „Begriffe“ | keiner im Kopf | wie Schreibtisch | `web/assets/app.js:2621-2627` |
| `/app/` Textfassung | `/` | Ratgeber, Für Fensterbauer | keiner | nur Logo | `web/app/index.html:44` |
| `/ratgeber/…` (24 Seiten) | `/` | Ratgeber, Für Fensterbauer | „Fenster ausmessen“ → `/app/` | nur Logo und Knopf | z. B. `web/ratgeber/index.html` (Kopf) |
| `/fuer-fensterbauer/` | `/` | Ratgeber, **Kundenkonto** | „Pakete ansehen“ (Ring) → `#pakete` | nur Logo und Knopf; Lesefortschritt als Linie | `web/fuer-fensterbauer/index.html:50`, `web/assets/verkauf.js:448` |
| `/fuer-fensterbauer/<thema>/` | `/` | Ratgeber, Für Fensterbauer | „Pakete ansehen“ (Cream) → `/fuer-fensterbauer/#pakete` | nur Logo und Knopf | z. B. `web/fuer-fensterbauer/geplatzter-aufmasstermin/index.html` (Kopf) |
| Rechtsseiten (6) | `/` | „Für Betriebe“ → `/`, „App“ | keiner | beide Links | `web/agb/index.html:17` (gleich in allen sechs) |
| `/konfigurator-bedingungen/` | `/` | „Pakete“ → `/fuer-fensterbauer/`, „Kundenkonto“ | keiner | beide Links | `web/konfigurator-bedingungen/index.html` (Kopf) |
| `/partner/` | `/fuer-fensterbauer/` | keine | keiner | – | `web/partner/index.html:21` |
| 404 | `/` | Startseite, App | keiner | beide | `web/404.html:15-17` |

Befund: Es gibt sieben verschiedene Kopfzeilen. Am Telefon (bis 640 px) blenden alle statischen Seiten die Textlinks aus
(`web/assets/ratgeber.css:15`); ein Menü gibt es nicht. Ratgeber, Fensterbauer-Seite und Kundenkonto sind am Telefon dann nur über den
Fuß erreichbar.

### 2.2 Fußzeilen

| Seite | Inhalt | Beleg |
|---|---|---|
| `/` (mit JavaScript, beide Ansichten gleich) | Logo; „So funktioniert es für Betriebe“, „Tour für Fensterbauer“, „Preise für Betriebe“ (alle drei: Aufmaß-Link-Modell), „Konfigurator für Fensterbauer“, Ratgeber, Nutzungsbedingungen, AGB, Datenschutz, Cookies, Impressum, „Vertrag widerrufen“; dazu ein Satz zur Pilotphase oder zum Server | `web/assets/portal.js:482` |
| `/` angemeldet | schlanke Fassung mit Rechtslinks, „So funktioniert es“, Preise, Ratgeber | `web/assets/portal.js:481` |
| `/` Textfassung, `/app/` Textfassung | App bzw. Startseite, Für Fensterbauer, Ratgeber, AGB, Nutzungsbedingungen, Datenschutz, Cookies, Impressum, Vertrag widerrufen | `web/index.html:97`, `web/app/index.html:84` |
| `/app/` (App) | „Anleitung: Fenster ausmessen ›“, „Sie sind Fensterbauer? ›“ → `/#fensterbauer`, „Zur Startseite ›“; darunter Vertrag widerrufen, AGB, Datenschutz, Cookies, Impressum (öffnen in neuem Fenster) | `web/assets/app.js:2781`, `:2308`, `:6629-6635` |
| Ratgeber und Fensterbauer-Seiten | drei Gruppen: „Ratgeber“ (alle 23 Artikel + Übersicht), „Für Fensterbauer“ (Verkaufsseite, 5 Artikel, Paketbedingungen), „Mehr“ (Startseite, App, AGB, Nutzungsbedingungen, Datenschutz, Cookies, Impressum, Vertrag widerrufen) | z. B. `web/fuer-fensterbauer/index.html:269` |
| Rechtsseiten | Startseite, App, Ratgeber, AGB, Nutzungsbedingungen, Datenschutz, Cookies, Impressum, Vertrag widerrufen (ohne „Für Fensterbauer“) | `web/agb/index.html` (Fuß) |
| `/konfigurator-bedingungen/` | Startseite, Für Fensterbauer, Kundenkonto, AGB, Nutzungsbedingungen, Datenschutz, Impressum, Vertrag widerrufen | Fuß der Datei |
| `/partner/` | Pakete, Paketbedingungen, Datenschutz, Impressum | `web/assets/partner.js` (`p-fuss`) |
| 404 | Startseite, App, Ratgeber, AGB, Datenschutz, Impressum, Vertrag widerrufen (ohne Für Fensterbauer, Nutzungsbedingungen, Cookies) | `web/404.html:25` |

### 2.3 Umschalter Hauseigentümer / Fensterbauer

- Zwei Knöpfe „Hauseigentümer“ und „Fensterbauer“ in der Kopfzeile der Startseite (`web/assets/portal.js:403-406`).
- Die Wahl setzt den Anker `#hauseigentuemer` oder `#fensterbauer` per `replaceState` (kein neuer Verlaufseintrag) und wird im Browser
  gespeichert (`web/assets/portal.js:399-402`, Speicher `aufmass.portal.v1`, `:21`, `:104`).
- `#betriebe` (alter Anker) und `?von=pdf` wählen ebenfalls die Ansicht Fensterbauer (`web/assets/portal.js:1969`, `:1976`).
- Die Bildschirme „So funktioniert es“, „Preise“, „Registrieren“ und „Tour“ gelten als Ansicht Fensterbauer (`web/assets/portal.js:396-398`).
- Am Ende jeder Ansicht steht ein Abschnitt mit dem Weg in die andere Ansicht (`web/assets/portal.js:787-791`).
- Die Ansicht Fensterbauer lädt `/fuer-fensterbauer/` per `fetch`, entfernt die Brotkrumen und setzt den Inhalt ein; Sprungmarken scrollen
  innerhalb der Einbettung, ohne die Adresse zu ändern; schlägt das Laden fehl, steht eine Karte „Pakete ansehen“
  (`web/assets/portal.js:792-844`).
- Ein Wechsel der Ansicht zeichnet die Seite neu und springt nach oben (`web/assets/portal.js:1775-1781`).

### 2.4 Sprungmarken und Einstiege von außen

| Anker / Adresse | Wirkung | Beleg |
|---|---|---|
| `/app/#ausmessen` | beginnt sofort ein Fenster (oder setzt fort), überspringt das Startbild der App | `web/assets/app.js:6560-6612` |
| `/app/#fuehrung` | startet die Führung | `web/assets/app.js:6604` |
| `/app/#k-…` | Aufmaß-Link eines Betriebs | `web/assets/portal.js:987-988` |
| `/#tour` | Tour für Fensterbauer | `web/assets/portal.js:1966` |
| `/?von=pdf` | Ansicht Fensterbauer mit Hinweis „Sie halten ein eeziframes-Aufmaß in der Hand?“ und „Kostenlos registrieren“ | `web/assets/portal.js:849`, QR-Code im PDF `web/assets/blatt.js:226-227` |
| `/fuer-fensterbauer/#…` | `#die-idee`, `#so-funktioniert-es`, `#was-in-jeder-anfrage-steht`, `#warum-kunden-selbst-planen`, `#kundenschutz`, `#pakete`, `#paket-essential/-plus/-signature`, `#vergleich`, `#ablauf`, `#demos`, `#bestellen`, `#frage`, `#haeufige-fragen`, `#wissen-fuer-fensterbauer`, `#quellen` | `web/fuer-fensterbauer/index.html:74-259` |
| `/partner/#bestellen/<paket>` | Bestellformular (nur mit `PAKETE_OFFEN=1` verlinkt) | `functions/pakete-seite.js:13-15`, `:128` |
| `/ratgeber/#schritt-1` … `#schritt-6`, `#fuer-fensterbauer`, `#selbst-messen` | Gliederung der Übersicht | `web/ratgeber/index.html` |

### 2.5 Interne Verlinkung

Gezählt wurden Links im Hauptinhalt (`<main>`) der statischen Seiten, ohne Kopf und Fuß:

| Ziel | Seiten, die im Inhalt darauf verlinken |
|---|---|
| `/app/` | 27 |
| `/ratgeber/fenster-ausmessen/` | 26 |
| `/ratgeber/` (meist Brotkrumen) | 23 |
| Prüfen/Entscheiden/Auswählen/Vergleichen/Einbauen-Artikel (Block „Dein Weg“) | je 24–25 |
| `/fuer-fensterbauer/` | 9 (davon 5 eigene Fachartikel, Ratgeber-Übersicht, Aufmaßblatt-Artikel, Datenschutz, Textfassung der Startseite) |
| einzelne Fachartikel für Fensterbauer | 3–6 |

Muster:

- **Ratgeber → App.** Jeder Artikel hat zwei bis vier Knöpfe in die App, meist `/app/` (Startbild der App), nicht `/app/#ausmessen`.
- **Ratgeber → Ratgeber.** Block „Dein Weg zu neuen Fenstern“ mit sechs Schritten, der aktuelle markiert, der nächste mit Foto
  (`web/ratgeber/fenster-ausmessen/index.html:148`); dazu „Weiterlesen“-Karten und der Fuß mit allen Artikeln.
- **Fachartikel für Fensterbauer → Verkaufsseite.** Vier bis fünf Links je Artikel auf `/fuer-fensterbauer/`, `#pakete`, `#demos` oder
  `#so-funktioniert-es`.
- **Ratgeber → Fensterbauer.** Aus den 23 Artikeln für Hauseigentümer führt im Inhalt nur `aufmassblatt-fenster` zur Verkaufsseite; sonst
  nur Kopf und Fuß.
- **Verkaufsseite → außen.** Fünf Quellen (ZDH, KOFA, BGB, Preisatlas, Bitkom), Paketbedingungen, Datenschutz `#pakete`
  (`web/fuer-fensterbauer/index.html:159-267`).
- **App → Website.** Nur auf dem Startbild der App: Anleitung, „Sie sind Fensterbauer?“ (zur Startseite, nicht zur Verkaufsseite),
  Startseite (`web/assets/app.js:2781`).

### 2.6 Seitenhierarchie

```
Ebene 0   Startseite (zwei Ansichten)
Ebene 1   App · Ratgeber-Übersicht · Verkaufsseite für Fensterbauer · (Kundenkonto)
Ebene 2   23 Ratgeber-Artikel (Weg in 6 Schritten) · 5 Fachartikel für Fensterbauer · Paketbedingungen
Flach     sechs Rechtsseiten, nur über den Fuß
```

- Brotkrumen gibt es nur auf Ratgeber- und Fensterbauer-Seiten (`<nav class="rg-pfad">`, z. B. `web/fuer-fensterbauer/index.html:53`).
- Die Verkaufsseite ist inhaltlich zweimal vorhanden: als eigene URL und als Ansicht der Startseite (eine Quelle, zwei Orte,
  `web/assets/portal.js:792-799`).
- Neben der Hierarchie besteht ein zweiter, älterer Strang für Fensterbauer ohne eigene URLs: „So funktioniert es“, „Preise“, „Tour“ und
  Registrierung des Aufmaß-Link-Modells. Er ist nur über Kopf und Fuß der Startseite erreichbar (Abschnitt 3.4).

---

## 3. Einstiegs- und Verkaufsseiten, Abschnitt für Abschnitt

Spalten: **Überschrift** wörtlich (grünes Wort in Klammern vermerkt, wo es markiert ist) · **Kernaussage** · **Inhalte** mit Belegen ·
**Bild/Bewegung** · **Handlung → Ziel** · **Wörter**.

### 3.1 Startseite `/`, Textfassung (ohne JavaScript, für Suchmaschinen)

Wird beim Laden durch die Ansicht aus `portal.js` ersetzt (`web/index.html:43`, `web/assets/portal.js:455`). 566 Wörter.
Meta: Titel „Fenster selbst ausmessen, Aufmaß ohne Anfahrt | eeziframes“, og-Titel „eeziframes – Fensterplanung, easy gemacht“
(`web/index.html:6-16`). Strukturierte Daten: Organisation mit Gründer Patrick Kies, E-Mail, Telefon, Anschrift; App mit Angeboten 0 € und
7,99 €; Konfigurator für Fensteranbieter (`web/index.html:29-35`).

| # | Überschrift | Kernaussage | Inhalte (Beleg) | Bild | Handlung → Ziel | Wörter |
|---|---|---|---|---|---|---|
| 1 | Kicker „Für Hauseigentümer und Fensterbauer“, H1 „Fenster ausmessen. Selbst. eezi.“ | Aufmaß-App im Browser für beide Zielgruppen | Messen mit Zollstock und Handy, Aufmaßblatt als PDF; Fensterbauer bekommen denselben Konfigurator unter eigener Domain (`web/index.html:49-53`) | – | „Jetzt ausmessen“ → `/app/#ausmessen`; „Führung starten“ → `/app/#fuehrung` (`:54`) | ca. 60 |
| 2 | H2 „Für Hauseigentümer“ | kostenlos messen, PDF kaufen | 2 Fotos, ca. 5 Min. je Fenster; 3 Breiten, 3 Höhen, Rahmenmaß; 3-D-Modell; 7,99 € (Einführungspreis bis 17.11.2026, danach 12,99 €), über Link des Fensterbauers kostenlos; kein Konto (`:56-63`) | – | – | ca. 120 |
| 3 | H2 „Für Fensterbauer“ | eigener Konfigurator ohne Programmierung | Anfrage als Aufmaßblatt-PDF per E-Mail mit Klärungsliste; drei Pakete mit Einrichtung und Monatspreis, ohne Gebühr je Anfrage, nur Unternehmer (`:66`) | – | „Konfigurator für Fensterbauer“ → `/fuer-fensterbauer/`; „Pakete ansehen“ → `#pakete` (`:67`) | ca. 75 |
| 4 | H2 „eeziframes auf einen Blick“ | Steckbrief | Tabelle Was, Für wen, Ergebnis, Kosten, Technik, Sprache/Markt „Deutsch, für Deutschland“, Datenschutz „Server in Frankfurt“ (`:69-80`) | – | – | ca. 130 |
| 5 | H2 „Ratgeber“ | – | 6 Karten (ausmessen, Aufmaßblatt, austauschen, Balkontür, Bestellmaß, DIN) (`:82-90`) | – | 6 Links | ca. 60 |
| 6 | H2 „Häufige Fragen“ | – | 3 Fragen: selbst messen, Kosten, Weg zum Fensterbauer (`:92-95`) | – | – | ca. 100 |

### 3.2 Startseite `/`, Ansicht Hauseigentümer (mit JavaScript)

Über der Kopfzeile stehen je nach Lage zwei Bänder: der Pilot-Hinweis (nur ohne Server, `web/assets/gemeinsam.js:347-357`) und das
Band „Einführungspreis bis 17. November: Aufmaßblatt 7,99 € · danach 12,99 € · Noch N Tage · Jetzt ausmessen →“
(`web/assets/gemeinsam.js:330-341`, `web/assets/portal.js:444-445`). Bildschirmfoto: `screens/desktop-start-01.jpg`.
Gesamt ca. 500 Wörter.

| # | Überschrift | Kernaussage | Inhalte (Beleg) | Bild/Bewegung | Handlung → Ziel | Wörter |
|---|---|---|---|---|---|---|
| 1 | Kicker „In Minuten zum Aufmaß für jeden Fensterbauer“, H1 „Fenster ausmessen. Selbst. eezi.“ (grün: „eezi.“) | selbst messen, kostenlos bis zum PDF | „Zwei Fotos, vier Maße mit dem Zollstock“; 3-D-Modell; PDF 7,99 € „für jeden Fensterbauer lesbar“; Zeile „Führung: ein Fenster in zwei Minuten, ohne eigene Maße · kein Konto zum Messen · keine App aus dem Store“ (`web/assets/portal.js:852`) | Foto `start-hauseigentuemer.webp` (Waschbär misst Maueröffnung), randlos, Chips „Maße, Öffnungsart, Farbe, Glas“ (`:853`); Überschrift baut sich Wort für Wort auf (`:769`) | „Jetzt ausmessen“ bzw. „Aufmaß fortsetzen“ (Cream) → `/app/#ausmessen`; „Führung starten“ → `/app/#fuehrung` | ca. 75 |
| 2 | ohne Überschrift (Zahlenleiste) | drei Kennzahlen | „5 Min. je Fenster“, „8 Maße je Fenster von Hand, das kleinste zählt“, „7,99 € für das fertige Aufmaßblatt“ + Einführungshinweis (`:854`) | Zahlen zählen hoch | – | ca. 50 |
| 3 | H2 „Was im Aufmaß steckt.“, Zusatz „je Fenster, wie beim Termin vor Ort“ | Vollständigkeit wie beim Vor-Ort-Termin | 8 Kacheln: Maueröffnung, Fensterelement, Fotos innen und außen (KI liest Einbausituation), Teilung und Öffnung, Material und Farbe, Glas und Sprossen, Rollladen und Insektenschutz, Montage und Klärungsliste (`:615-624`, `:779-781`) | Strichsymbole; Fensterzeichnung mit vier Maßen 1.480/1.370/1.410/1.230 mm und Plaketten „Kunststoff, anthrazit“, „2 Flügel Dreh-Kipp“, „3-fach-Glas“, „Alle Maße da“ (`:861-865`) | – | ca. 150 |
| 4 | Kicker „Fenster für Fenster“, H2 „Auch ganz groß.“ | jede Elementart mit eigenem Modell | 10 Chips: Fenster, Balkontüren, Festverglasung, Hebe-Schiebe-Türen, PSK-Türen, Faltschiebewände, Rollladen, Raffstore, Screen, Insektenschutz (`:783-785`) | `gross.webp` – **Platzhalter**, Alt-Text beschreibt einen Oktopus | – | ca. 50 |
| 5 | H2 „Aus dem Ratgeber.“ | – | 9 Karten (beschlagen, reparieren/austauschen, Angebote, ausmessen, Aufmaßblatt, austauschen, Balkontür, Bestellmaß, DIN) (`:786`, `:857`) | – | 9 Links, „Alle Ratgeber ›“ | ca. 135 |
| 6 | Kicker „Für Fensterbauer“, H2 „Ihr eigener Fensterkonfigurator.“ | Hinweis auf das Angebot für Betriebe | „Unter Ihrer Domain und in Ihrer Marke …“ (`:790`) | – | „Pakete ansehen“ (Cream) → `/fuer-fensterbauer/` (verlässt die Startseite); „Zur Ansicht für Fensterbauer“ | ca. 35 |

### 3.3 Startseite `/`, Ansicht Fensterbauer

Inhalt: der Hauptteil von `/fuer-fensterbauer/` (Abschnitt 3.5) ohne Brotkrumen, danach der Abschnitt „Ihre eigenen Fenster ausmessen?“
mit Knopf „Zur Ansicht für Hauseigentümer“ (`web/assets/portal.js:849-850`, `:791`, `:792-799`). Kein Einführungsband (`:444`).

Abweichungen gegenüber der eigenständigen Seite:

- Kopfzeile mit „Preise“, „Anmelden“ und „Kostenlos starten“ für das Aufmaß-Link-Modell (`web/assets/portal.js:450`). Am Telefon steht
  über dem Startbild der Fensterbauer-Seite der Cream-Knopf „Starten“ (`screens/mobil-fensterbauer-ansicht-01.jpg`).
- Pilot-Hinweis „Im Bereich für Betriebe wird nichts berechnet … Zum Kennenlernen gibt es die Tour.“ (`web/assets/gemeinsam.js:349`).
- Über `?von=pdf` ein Band „Sie halten ein eeziframes-Aufmaß in der Hand? … kostenlos registrieren … Die ersten 3 Aufmaße sind frei.“
  (`web/assets/portal.js:849`).
- Fuß mit Links zu Tarifen und Tour des Aufmaß-Link-Modells (`web/assets/portal.js:482`).

### 3.4 Startseite, Bildschirme ohne eigene URL (Aufmaß-Link-Modell)

Erreichbar über Kopf („Preise“, „Kostenlos starten“) und Fuß der Startseite. Laut Kommentar „werden nicht mehr beworben“, bleiben aber
für Bestandsbetriebe (`web/assets/portal.js:787-789`, `:846-848`; `docs/instanzen/BAUPLAN.md:657`).

| Bildschirm | Überschrift | Kernaussage | Inhalte (Beleg) | Bild | Handlungen | Wörter |
|---|---|---|---|---|---|---|
| So funktioniert es | Kicker „So funktioniert es“, H2 „Aufmaß ohne Anfahrt, abgerechnet mit Ihnen.“ | Betrieb schickt Aufmaß-Links, zahlt je eingegangenem Aufmaß | 7 Schritte (Projekt, Link 7/14/30 Tage + 60 Tage, Aufmaß, Eingang, Nachbesserung bis zweimal, Abrechnung „3 Projekte kostenlos, danach 9 € … 49 € … Plus unbegrenzt“, Datei); Karte für Hauseigentümer; Kundenschutz mit 4 Zusagen (Nutzungsbedingungen § 11); 8 FAQ (`web/assets/portal.js:867-896`) | Lottie `messen` | „Kostenlos starten“, „Tour starten“, „Preise“, „Zur App“ | ca. 850 |
| Preise | Kicker „Preise für Fensterbauer“, H2 „Sie zahlen für Projekte, in denen ein Aufmaß ankommt.“ | drei Tarife | Start 0 € (3 frei, dann 9 €), Abo 10 49 € (10 inkl., je weiteres 5 €; „Empfohlen“-Stellung), Plus 79 € unbegrenzt; Einführungspreise; Rechner „Was ein Erstaufmaß vor Ort kostet“ (Vorgabe 12 Termine, 75 Min., 65 €/h) (`:897-919`, `:752-768`) | Symbole, Schieberegler | „Kostenlos starten“, „Starten“ | ca. 400 |
| Tour für Fensterbauer | Kicker „Tour für Fensterbauer“, H2 „So läuft ein Aufmaß mit eeziframes.“ | Ablauf des Aufmaß-Link-Modells zum Anfassen | 8 Schritte, je mit „Gut zu wissen“ und Quelle (Katalog 4.4) (`:1442-1592`) | Telefon-Attrappen, Beispiel-Aufmaß „Familie Weber“, Aufmaßblatt-Bilder `tour-aufmassblatt-10/15/20.webp` | „Kostenlos starten“, „Alle Preise im Detail ›“ | ca. 1.000 über 8 Schritte |
| Registrieren | Schritte „Weg, Betrieb, Auftritt“ | Konto im Aufmaß-Link-Modell | (`:921-963`) | – | – | – |

### 3.5 Verkaufsseite `/fuer-fensterbauer/`

Datei `web/fuer-fensterbauer/index.html`, Bausteine aus `functions/pakete-seite.js` (Pakete, Vergleich, Ablauf, Demos, Bestellen,
JSON-LD). Gesamt 2.190 Wörter. Meta-Titel „Fenster-Konfigurator für Fensterbauer, unter Ihrer Domain | eeziframes“ (`:6`). Stand 23.10.2026
(`:267`). Bildschirmfotos `screens/mobil-fuer-fensterbauer-01…07.jpg`.

| # | Überschrift | Kernaussage | Inhalte (Beleg) | Bild/Bewegung | Handlung → Ziel | Wörter |
|---|---|---|---|---|---|---|
| 1 | Kicker „Für Fensterbauer und Fensterhändler“, H1 „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“ (grün: „Marke“) | eigener Konfigurator unter eigener Marke, ohne Programmierauftrag | Chips „Ihre Domain, Kunden planen selbst, PDF per E-Mail, Ihre Marke, Ihre Kunden“; Kasten „Kurz gesagt“ (`:56-62`) | Foto `fb-sessel.webp` (Astronaut misst Bullauge), Licht, Staub, Maßlinie „1.200 mm“; Stapel mit drei Beispiel-Meldungen „Neue Anfrage · Familie Weber“, „Projekt angelegt · Balkontür, Köln“, „Bereit fürs Angebot · P-2026-031“, als „Beispiel“ gekennzeichnet, wechselt alle 3,4 s (`:55`, `web/assets/verkauf.js:152-190`) | „Pakete ansehen“ (Cream) → `#pakete`; „Konfigurator ausprobieren“ → `#demos` (`:63`) | 85 |
| 2 | ohne Überschrift (Leiste A) | Breite des Konfigurators | 14 Einträge mit Symbol: Dreh-Kipp-Fenster, Zweiflügelig, Balkontür, Hebe-Schiebe-Tür, PSK-Tür, Faltschiebewand, Festverglasung, Rundbogen, Oberlicht, Rollladen, Raffstore, Insektenschutz, Wiener Sprossen, Schräge Fenster (`:66-68`) | Laufband nach rechts, 30 px/s plus Schub aus dem Scrollen (`web/assets/verkauf.js:256-262`) | – | 16 |
| 3 | ohne Überschrift (Leiste B) | Kennzahlen | „0 Zeilen Code auf Ihrer Website“, „3 Pakete, ein Konfigurator“, „5 Minuten je Fenster, etwa“, „1 PDF je Anfrage, per E-Mail“, „3–5 Werktage bis zum Livegang“, „0 € Gebühr je Anfrage“ (`:69-71`) | Laufband nach links, Zahlen rollen ein | – | 31 |
| 4 | H2 „Die Idee: der Fenster-Konfigurator Ihrer Wahl“ (grün: „Wahl“) | eigene Konfiguratoren zu teuer, Hersteller-Konfiguratoren tragen fremde Marke | 4 Punkte: Kein Programmierauftrag; Professioneller Auftritt; „Ihr eigenes Baby“; Anfragen mit Maßen statt Einzeiler (`:74-81`) | keines | – | 115 |
| 5 | H2 „So funktioniert es“ | fünf Schritte vom Besuch bis zum Feinaufmaß | Kunde kommt (Beispiel-Domain „brandt-fenster.app“), plant selbst, sendet, Betrieb bekommt Aufmaßblatt per E-Mail, Angebot und Feinaufmaß (`:87-93`) | Lottie `messen`, `senden`, `eingang`, `fertig`, `fotos`; Telefon mit drei Bildschirmen („Ihr Betrieb“, „Ihre Fenster, selbst geplant.“), Papierflieger, Tisch mit Aufmaßblatt-Karte „Nr. 0142 · Familie Beispiel“, Konfetti; wechselt mit dem Scrollen (`:94-116`, `web/assets/verkauf.js:112-150`) | – | 164 |
| 6 | H2 „Was in jeder Anfrage steht“ (grün: „Anfrage“) | Anfrage so vollständig wie ein Termin | 7 Inhalte: Maueröffnung, Fensterelement, Fotos und Einbausituation (KI nur mit Einwilligung), Teilung und Öffnung, Material/Farbe/Glas, Sonnenschutz und Montage, Klärungsliste (`:123-131`) | Bild `tour-aufmassblatt-15.webp` (echtes Aufmaßblatt, Beispiel „Fensterbau Brandt / Familie Weber“), Maßkarte „1.229 × 1.424 mm · Bestellmaß · Pos. 2 · Küche“, Klärungsliste mit Haken (Absturzsicherung, Lüftungskonzept, Förderweg Uw 0,95) (`:132-145`) | – | 169 |
| 7 | H2 „Warum Kunden selbst planen“ (grün: „selbst“) | Markt- und Rechtslage spricht fürs Selbstaufmaß | 9,9 Wochen Auftragsreichweite, 97.482 offene Stellen, 65,14 € je Meisterstunde + § 632 BGB, 68 % Angebote digital (Katalog 4.3), Quellen [1]–[5] (`:150-155`) | Foto `fb-kunden-planen.webp` (Vater und Tochter messen, Mini-Fensterbauer), Chips „Abends, Ohne Termin, Mit Anleitung, 5 Minuten je Fenster“; Zahlen zählen hoch | Quellen-Anker | 144 |
| 8 | H2 „Ihre Kunden bleiben Ihre Kunden“ | Konfigurator arbeitet nur für den Betrieb | 4 Zusagen: Nur Ihr Betrieb; Nur an Sie; In Ihrem Auftrag; Kein Weiterverkauf; Verweis Paketbedingungen § 10 (`:160-166`) | `fb-kundenschutz.webp` – **Platzhalter**, Alt-Text beschreibt Meister, Familie und drei Wölfe | „Paketbedingungen“ → `/konfigurator-bedingungen/#kundenschutz` | 97 |
| 9 | H2 „Die Pakete“ (grün: „Pakete“) | drei Stufen der Markenführung | Vorspann; Hinweis „Vorläufige Preise … Bestellung schalten wir in Kürze frei“; Karten EEZI Essential 29 €/99 €, EEZI Essential Plus 39 €/199 € („Empfohlen“), EEZI Signature 64 €/279 €; Leistungslisten; Vergleich mit 17 Zeilen (aufklappbar); Rechtshinweis § 14 BGB (`:171-189`) | Lottie `farbwechsel`; je Karte Skizze einer Beispielseite; am Telefon Wischreihe mit Namensleiste und einmaligem Wisch-Hinweis (`web/assets/verkauf.js:333-340`) | „Essential anfragen“ / „Essential Plus anfragen“ (Cream) / „Signature anfragen“ → `#bestellen` mit vorgewähltem Paket; „Paketbedingungen“ | 509 |
| 10 | H2 „Von der Bestellung bis zum Livegang“ (grün: „Livegang“) | meist 3 bis 5 Werktage | 6 Schritte: Bestellt, Bezahlt (Stripe, Karte oder SEPA), In Einrichtung (Anruf), Domain gesichert, Zur Freigabe (Vorschau-Link, Testanfrage), Live (Knopf „Fenster planen“) (`:192-203`) | Zeitleiste füllt sich beim Scrollen, gezeichnete Symbole | – | 158 |
| 11 | H2 „Live-Demos“ | Demos folgen, bis dahin die App | „Es ist dieselbe App, mit der Hauseigentümer auf eeziframes.com ihre Fenster planen“ (`:209`) | – | „Konfigurator ausprobieren“ → `/app/` | 58 |
| 12 | H2 „Bestellen oder anfragen“, H3 „Paket unverbindlich anfragen“ | Anfrage statt Bestellung | Kasten „Bestellung bald möglich … Wir antworten in der Regel innerhalb eines Werktags“; Formular Name, Firma, E-Mail, Telefon, Paket, Frage (`:215-232`) | `fb-frage.webp` – **Platzhalter**, Alt-Text beschreibt springendes rotes Telefon; Chips „Rückruf, Nachricht, Unverbindlich“ | „Frage senden“ (Cream) → `POST /api/partner/frage` | 90 |
| 13 | H2 „Häufige Fragen“ | Einwände klären | 10 Fragen: Unterschied der Pakete, Kosten, Domain, Website nötig, was der Kunde sieht, Datenschutz (Supabase Frankfurt), Dauer, Kündigung/Wechsel, Bestandskunden mit Kundenlinks, Genauigkeit (`:236-245`) | – | – | 453 |
| 14 | H2 „Wissen für Fensterbauer“ | – | 5 Karten zu den Fachartikeln (`:250-256`) | – | 5 Links | 58 |
| 15 | H2 „Quellen“ | Belege | 5 externe Quellen (`:259-266`) | – | externe Links | 39 |

Einordnung (neutral, gemessen an SKILL):

- Die Seite folgt einem langen, linearen Aufbau mit 15 Abschnitten und rund 2.200 Wörtern; Pakete kommen erst an neunter Stelle. SKILL
  verlangt „kurze Abschnitte, wenige Wörter“, „Pakete sichtbar machen“ und „nie wie ein Ratgeber“ (SKILL §1, §2). Der Kasten „Kurz gesagt“,
  die Quellenliste und zehn ausgeklappte Fragen stammen aus dem Ratgeber-Baukasten (`ratgeber.css`).
- Abschnitt 7 („Warum Kunden selbst planen“) stellt das Selbstmessen in den Mittelpunkt; SKILL nennt „Kunden messen selbst“ ausdrücklich
  „nicht die Hauptaussage“.
- Drei von fünf Fotos fehlen (Platzhalter). Die Paketkarten zeigen Skizzen statt Beispielbildern (`functions/pakete-seite.js:90`).
- Der Weg zur Demo ist ein Umweg: „Konfigurator ausprobieren“ → Abschnitt „Live-Demos“ → App für Hauseigentümer mit eeziframes-Marke und
  Preis für Hauseigentümer.

### 3.6 App `/app/`

**Textfassung** (ohne JavaScript, 561 Wörter, `web/app/index.html:46-83`): Kicker „Fensterplanung, ganz eezi“, H1 „Fenster ausmessen:
kostenlose Aufmaß-App im Browser“; H2 „So funktioniert es“ (4 Schritte Fotografieren, Messen, Wünschen, Aufmaßblatt), „Was es kostet“
(7,99 €, Einführungspreis), „Wie genau ist das?“, „Mehr lesen“ (6 Karten), „Häufige Fragen“ (4). Anrede „du“.

**Startbild der App** (mit JavaScript, nur wenn noch kein Fenster erfasst ist; `web/assets/app.js:2768-2783`):

| # | Überschrift | Kernaussage | Inhalte (Beleg) | Bild/Bewegung | Handlung → Ziel | Wörter |
|---|---|---|---|---|---|---|
| 0 | Einführungsband | Preis befristet | „Einführungspreis bis 17. November: Aufmaßblatt 7,99 € · danach 12,99 €“ (`:2772`) | – | „Jetzt ausmessen →“ → neues Fenster | ca. 15 |
| 1 | Kicker „Fensterplanung, ganz eezi“, H1 „Fotografieren. Messen. Wünschen.“ (grün: „Wünschen.“) | in drei Schritten zum Aufmaß | „Zwei Fotos, vier Maße mit dem Zollstock … Dein Fensterbauer bekommt alles fürs Angebot.“; „Zwei Minuten, ohne eigene Maße · Wie genau ist das?“ (`:2772-2773`) | Foto `app-start.webp` (drei Waschbären), Chips „Fotografieren, Messen, Wünschen“ (`:2767`); 3-D-Modell (WebGL) mit vier Maßen 1.480/1.370/1.410/1.230 mm, leicht schwingend (`:2774`) | „Fenster ausmessen“ (Cream) → erster Messschritt; „Führung starten“; ggf. „Anmelden“ | ca. 40 |
| 2 | H2 „Dein Projekt.“ | – | „0 Fenster erfasst“ (`:2775`) | – | „Erstes Fenster ausmessen“ | ca. 8 |
| 3 | Kicker „So funktioniert's“, H2 „Zollstock statt Rätselraten.“ | drei Schritte erklärt | Fotografieren (KI liest Einbausituation), Messen („Vier Maße … dann ergänzt du die Ränder“), Wünschen; Nachsatz Feinaufmaß (`:2776-2780`) | – | Glossar „Feinaufmaß“ | ca. 75 |
| 4 | Links | – | „Anleitung: Fenster ausmessen ›“, „Sie sind Fensterbauer? ›“, „Zur Startseite ›“ + Rechtslinks (`:2781`) | – | → Ratgeber, `/#fensterbauer`, `/` | ca. 15 |

Hinweis: Die Knöpfe der Startseite führen mit `#ausmessen` am Startbild vorbei (`web/assets/app.js:6605`); das Startbild sehen vor allem
Besucher aus dem Ratgeber, deren Knöpfe auf `/app/` ohne Anker zeigen.

**Führung** (`/app/#fuehrung`): 9 Schritte Element, Fotos, Messen, Öffnung, Material, Farbe, Glas, Sonnenschutz, Aufmaßblatt, mit
vorgegebenen Maßen, gesperrten Optionen und je einer belegten Zahl (`web/assets/app.js:6307-6329`, Katalog 4.4).

### 3.7 Ratgeber-Übersicht `/ratgeber/`

613 Wörter, Stand 21.10.2026 (`web/ratgeber/index.html`). Über der Seite das Einführungsband (vom Server eingesetzt,
`functions/seo.js:160-171`).

| # | Überschrift | Kernaussage | Inhalte | Bild | Handlung → Ziel | Wörter |
|---|---|---|---|---|---|---|
| 1 | Kicker „Ratgeber · Fensterplanung, ganz eezi“, H1 „Ratgeber: In sechs Schritten zu neuen Fenstern“ (grün: „Fenstern“) | geführter Weg vom Verdacht bis zum Einbau | Kurztext; Wegliste 6 Schritte | `ratgeber.webp` – **Platzhalter** (Alt: Eule), 6 Chips | Anker zu den Schritten | ca. 110 |
| 2–7 | H2 „1. Prüfen“ … „6. Einbauen“ | je Schritt die Artikel | 3 / 3 / 6 / 8 / 1 / 2 Karten | je ein Foto `weg-*.webp` – alle **Platzhalter** | Links zu 23 Artikeln | ca. 330 |
| 8 | H2 „Für Fensterbauer“ | Brücke zur Verkaufsseite | 6 Karten | – | → `/fuer-fensterbauer/` und 5 Fachartikel | ca. 80 |
| 9 | H2 „Selbst messen“ | App bewerben | „Messen ist kostenlos; das Aufmaßblatt als PDF kostet 7,99 €“ (ohne Einführungshinweis) | – | „Fenster ausmessen, kostenlos“ → `/app/`; „Führung in zwei Minuten“ → `/app/#fuehrung` | ca. 60 |

### 3.8 Ratgeber-Artikel (23) und Fachartikel für Fensterbauer (5)

Gemeinsamer Aufbau (Beispiel `web/ratgeber/fenster-ausmessen/index.html`): Brotkrumen; Kicker „Ratgeber · Stand 21. Oktober 2026“; H1 mit
grünem Wort; Kasten „Kurz gesagt“; zwei Knöpfe (App, Führung oder Anker); Inhaltsverzeichnis „Auf dieser Seite · N Min. Lesezeit“; eine
SVG-Zeichnung; 8–12 H2-Abschnitte mit Tabellen, Kästen „Gut zu wissen“ / „Häufiger Fehler“, Zwischenknopf; Häufige Fragen; Block „Dein Weg
zu neuen Fenstern“ (nur Ratgeber) mit Foto des nächsten Schritts; „Weiterlesen“; nummerierte Quellen; Stand mit Haftungssatz.
Anrede: Ratgeber „du“, Fachartikel „Sie“.

| Pfad | H1 | Min. | Wörter | Quellen | Fragen | Zeichnung |
|---|---|---|---|---|---|---|
| `/ratgeber/fenster-alter-erkennen/` | Wie alt sind meine Fenster? Baujahr erkennen und Lebensdauer | 5 | 1.277 | 6 | 5 | fenster-alter.svg |
| `/ratgeber/fenster-beschlagen/` | Fenster beschlagen: innen, außen oder zwischen den Scheiben | 6 | 1.484 | 6 | 5 | fenster-beschlagen.svg |
| `/ratgeber/fenster-undicht/` | Fenster undicht oder es zieht: Ursachen finden und beheben | 6 | 1.339 | 6 | 5 | fenster-undicht.svg |
| `/ratgeber/fenster-reparieren-oder-austauschen/` | Fenster reparieren oder austauschen? So entscheidest du richtig | 6 | 1.413 | 11 | 5 | fenster-entscheidung.svg |
| `/ratgeber/fenster-austauschen/` | Fenster austauschen: Ablauf, Kosten und Förderung | 7 | 1.733 | 15 | 7 | fenster-austauschen.svg |
| `/ratgeber/fenstertausch-altbau/` | Fenstertausch im Altbau: Laibung, Abdichtung und Schimmel vermeiden | 7 | 1.578 | 9 | 5 | fenstertausch-altbau.svg |
| `/ratgeber/fenster-material-vergleich/` | Kunststoff, Holz oder Alu: Fenstermaterial im Vergleich | 5 | 1.263 | 7 | 5 | fenstermaterial.svg |
| `/ratgeber/dreifachverglasung/` | Dreifachverglasung oder Zweifach: lohnt sich 3-fach-Glas? | 5 | 1.249 | 9 | 5 | verglasung.svg |
| `/ratgeber/fenster-oeffnungsarten/` | Fenster-Öffnungsarten: Dreh-Kipp, Kipp, Stulp oder fest? | 6 | 1.373 | 6 | 6 | fenster-oeffnungsarten.svg |
| `/ratgeber/uw-wert-fenster/` | Uw-Wert beim Fenster: was er bedeutet und was die Förderung verlangt | 7 | 1.652 | 10 | 5 | uw-wert.svg |
| `/ratgeber/din-links-rechts/` | Fenster DIN links oder rechts erkennen | 3 | 761 | 2 | 4 | din-links-rechts.svg |
| `/ratgeber/fenster-standardmasse/` | Fenster-Standardmaße: Tabelle mit üblichen Größen | 5 | 1.162 | 7 | 5 | fenster-standardmasse.svg |
| `/ratgeber/fenster-ausmessen/` | Fenster ausmessen: so geht das Aufmaß für neue Fenster | 7 | 1.659 | 6 | 8 | messpunkte.svg |
| `/ratgeber/balkontuer-ausmessen/` | Balkontür und Terrassentür ausmessen | 5 | 1.232 | 5 | 5 | balkontuer.svg |
| `/ratgeber/fenster-mit-rollladen-ausmessen/` | Fenster mit Rollladenkasten ausmessen | 4 | 995 | 4 | 4 | rollladen.svg |
| `/ratgeber/kellerfenster-ausmessen/` | Kellerfenster ausmessen: Maueröffnung, Zarge und Lichtschacht | 5 | 1.166 | 6 | 5 | kellerfenster.svg |
| `/ratgeber/fensterbank-ausmessen/` | Fensterbank ausmessen: innen und außen | 5 | 1.108 | 5 | 5 | fensterbank.svg |
| `/ratgeber/bruestungshoehe-fenster/` | Brüstungshöhe am Fenster: Mindestmaß und Absturzsicherung | 4 | 974 | 3 | 4 | bruestung.svg |
| `/ratgeber/aufmassblatt-fenster/` | Aufmaßblatt für Fenster: was draufgehört | 5 | 1.122 | 3 | 5 | aufmassblatt.svg |
| `/ratgeber/bestellmass-fenster/` | Bestellmaß für Fenster berechnen | 4 | 857 | 4 | 4 | bestellmass.svg |
| `/ratgeber/fenster-angebot-vergleichen/` | Fensterangebote vergleichen: Checkliste, Beispiel und Warnzeichen | 6 | 1.472 | 11 | 5 | angebote-vergleichen.svg |
| `/ratgeber/ral-montage-fenster/` | RAL-Montage einfach erklärt: so werden Fenster richtig eingebaut | 6 | 1.517 | 9 | 5 | ral-montage.svg |
| `/ratgeber/lueftungskonzept-fenstertausch/` | Lüftungskonzept beim Fenstertausch: wann es Pflicht ist | 5 | 1.287 | 7 | 5 | lueftungskonzept.svg |
| `/fuer-fensterbauer/erstaufmass-feinaufmass/` | Erstaufmaß, Grobaufmaß, Feinaufmaß: die Unterschiede | 6 | 1.237 | 6 | 5 | erstaufmass-feinaufmass.svg |
| `/fuer-fensterbauer/falsches-aufmass-haftung/` | Falsches Aufmaß: Wer haftet, wenn Fenster nicht passen? | 6 | 1.391 | 13 | 5 | haftung-aufmass.svg |
| `/fuer-fensterbauer/aufmass-kostenpflichtig/` | Aufmaß kostenlos oder kostenpflichtig? Anfahrtspauschale fürs Aufmaß | 5 | 1.134 | 8 | 5 | aufmass-anfahrt.svg |
| `/fuer-fensterbauer/geplatzter-aufmasstermin/` | Geplatzter Aufmaßtermin: was er einen Fensterbetrieb kostet | 5 | 1.210 | 8 | 5 | geplatzter-termin.svg |
| `/fuer-fensterbauer/fensterbau-software/` | Fensterbau-Software im Überblick: Aufmaß, Handwerkersoftware, ERP | 5 | 1.196 | 8 | 5 | fensterbau-software.svg |

Handlungsaufforderungen: Ratgeber führen zur App (`/app/`, 2–4 Knöpfe je Artikel), Fachartikel zur Verkaufsseite („Eigener
Konfigurator“, „Die drei Pakete“, „Konfigurator ausprobieren“, 4–6 Knöpfe je Artikel).

### 3.9 Weitere Einstiege

- **Kundenkonto `/partner/`, Anmeldeseite:** Kicker „Konfigurator-Pakete“, H1 „Ihr Kundenkonto.“, Satz „Hier begleiten Sie Ihren
  Konfigurator von der Bestellung bis Live: Status, Nachrichten, Rückruf und Rechnungen. Anmelden geht mit einem Code per E-Mail, ohne
  Passwort.“; Knopf „Code schicken“; „Noch kein Paket? Paket wählen und bestellen“ (`web/assets/partner.js:131-136`). Ohne Bild.
- **404:** „Fehler 404“, H1 „Diese Seite gibt es nicht.“, „Vielleicht ist der Link unvollständig. Kundenlinks sehen so aus: …/app/#k-…“;
  Knöpfe „Zur Startseite“, „Zur App“; Foto `fehler.webp` – **Platzhalter** (Alt: Katze im Fensterrahmen), Unterschrift „Ein Fenster ohne
  Haus: Hier gibt es nichts zu sehen.“ (`web/404.html:19-23`).
- **Aufmaßblatt-PDF als Einstieg für Fensterbauer:** Das PDF der Hauseigentümer trägt einen Kasten „Für Sie als Fensterbauer“ („‚Code vom
  Kunden einfügen‘ in eeziframes … die ersten 3 Projekte sind frei“) und einen Block „Für Fensterbauer · Aufmaße Ihrer eigenen Kunden“ mit
  „Ihre Kunden messen selbst. Sie fahren erst zum Feinaufmaß.“ und QR-Code „Scannen: Projekt anlegen“ auf `/?von=pdf`
  (`web/assets/blatt.js:226-227`, `:356-357`, `:684-700`). Dieser Weg führt in das Aufmaß-Link-Modell, nicht zu den Paketen.

---

## 4. Katalog wiederverwendbarer Inhalte

### 4.1 Aussagen und Leitsätze

| Aussage | Fundstelle |
|---|---|
| „Fensterplanung, easy gemacht“ (Slogan) | `web/index.html:31`, `README.md:3` |
| „Fenster ausmessen. Selbst. eezi.“ | `web/index.html:50`, `web/assets/portal.js:852`, `web/og.png` |
| „Fensterplanung, ganz eezi“ | `web/app/index.html:47`, `web/assets/app.js:2772` |
| „Fotografieren. Messen. Wünschen.“ | `web/assets/app.js:2772` |
| „Zollstock statt Rätselraten.“ | `web/assets/app.js:2776` |
| „In Minuten zum Aufmaß für jeden Fensterbauer“ | `web/assets/portal.js:852` |
| „Was im Aufmaß steckt.“ / „je Fenster, wie beim Termin vor Ort“ | `web/assets/portal.js:779` |
| „Auch ganz groß.“ | `web/assets/portal.js:784` |
| „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“ | `web/fuer-fensterbauer/index.html:57` |
| „Ihr eigener Fenster-Konfigurator, ohne ihn programmieren zu lassen. Jede Anfrage kommt als Aufmaßblatt-PDF.“ | `web/fuer-fensterbauer/index.html:61` |
| „Eigene Konfiguratoren sind zu teuer, die der Hersteller zeigen deren Marke. eeziframes ist fertig, unter Ihrer Domain.“ | `web/fuer-fensterbauer/index.html:75` |
| „Drei Pakete, ein Konfigurator: Sie entscheiden, wie sehr er Ihre Marke trägt.“ | `web/fuer-fensterbauer/index.html:172` |
| „Ihre Kunden bleiben Ihre Kunden“ / „Ihr Kunde bleibt Ihr Kunde.“ | `web/fuer-fensterbauer/index.html:159`, `web/assets/portal.js:874` |
| „Anfragen, mit denen Sie rechnen können: keine Einzeiler aus dem Kontaktformular …“ | `web/fuer-fensterbauer/index.html:80` |
| „Aufmaß ohne Anfahrt, abgerechnet mit Ihnen.“ (Aufmaß-Link-Modell) | `web/assets/portal.js:890` |
| „Ein Fenster ohne Haus: Hier gibt es nichts zu sehen.“ | `web/404.html:23` |

### 4.2 Produkt-Fakten und Zahlen aus dem Bestand

| Angabe | Fundstelle |
|---|---|
| Messen, Fotos, 3-D-Modell kostenlos; Aufmaßblatt-PDF 7,99 €, Einführungspreis bis 17.11.2026, danach 12,99 €; über den Link eines Fensterbauers kostenlos | `web/index.html:61`, `web/config.js:12-14`, `functions/api/umgebung.js:72`, `web/agb/index.html:55` |
| etwa 5 Minuten je Fenster | `web/index.html:58`, `web/fuer-fensterbauer/index.html:70` |
| Führung: ein Fenster in zwei Minuten, ohne eigene Maße | `web/assets/portal.js:852`, `web/assets/app.js:2773` |
| je Fenster drei Breiten und drei Höhen der Maueröffnung, das kleinste zählt, dazu Rahmenmaß; „8 Maße je Fenster von Hand“ | `web/index.html:59`, `web/assets/portal.js:616-617`, `:854` |
| zwei Fotos, innen und außen; KI liest Einbausituation nur mit Einwilligung | `web/index.html:58`, `web/fuer-fensterbauer/index.html:126` |
| Elementarten: Fenster, Balkon- und Terrassentüren, Festverglasungen, Hebe-Schiebe- und PSK-Türen, Faltschiebewände; Sonnenschutz Rollladen, Raffstore, Screen, Insektenschutz | `web/index.html:72`, `web/assets/portal.js:783` |
| höchstens 50 Fenster je Aufmaß | `web/assets/app.js:5041` |
| kein Konto zum Messen, keine App aus dem Store, Browser auf Handy, Tablet, Computer | `web/index.html:62`, `:76` |
| Daten ohne Link und Konto auf dem Gerät; Server in Frankfurt (Supabase) | `web/index.html:78`, `web/fuer-fensterbauer/index.html:241` |
| Konfigurator live meist 3 bis 5 Werktage nach Zahlung | `web/fuer-fensterbauer/index.html:70`, `:193`, `:242` |
| keine Gebühr je Anfrage; Einrichtung vorab, Monatsabo ab Livegang, monatlich kündbar, ohne Mindestlaufzeit | `web/fuer-fensterbauer/index.html:70`, `:237`, `:243` |
| Antwort auf Anfragen in der Regel innerhalb eines Werktags | `web/fuer-fensterbauer/index.html:220` |
| Aufmaß-Link: öffnen in 7, 14 oder 30 Tagen, dann 60 Tage Zeit; Nachbesserung bis zu zweimal, kostenlos | `web/assets/portal.js:891`, `web/assets/modell.js:1137` |
| Marke immer klein „eeziframes“; Name „eezi“ wie „easy“ | `docs/GESTALTUNG.md:7` |
| Anbieter: Patrick Kies, Postweg 35, 33442 Herzebrock-Clarholz; ask@eeziframes.com; 0152 56950998 | `web/impressum/index.html`, `web/index.html:31` |

### 4.3 Belegte Fakten mit externer Quelle

| Zahl | Aussage | Quelle laut Seite | Fundstelle |
|---|---|---|---|
| 9,9 Wochen, 78 % | Auftragsreichweite und Auslastung im Ausbauhandwerk, Anfang 2026 | ZDH-Konjunkturbericht Q1/2026 | `web/fuer-fensterbauer/index.html:151`, `:261` |
| 97.482 | offene Stellen im Handwerk 2025 ohne passend Qualifizierte, „fast jede zweite“ | KOFA/IW Köln, KOFA Kompakt 7/2026 | `:152`, `:262` |
| § 632 Abs. 3 BGB | Kostenanschlag im Zweifel nicht zu vergüten | Gesetzestext | `:153`, `:263` |
| 65,14 € | Meisterstunde netto im Schnitt | OneQrew/Taifun, Preisatlas Handwerk 2024 | `:153`, `:264` |
| 68 %, 35 %, 87 %, 76 % | Angebote digital, Beratung online, Kunden erwarten individuelle Angebote, Zeitersparnis | Bitkom, Digitalisierung des Handwerks 01/2026 | `:154`, `:265` |
| 49 % | Deutsche finden Handwerk zu analog | Bitkom, Presseinformation 14.03.2025 | `web/assets/portal.js:1455` |
| 2 bis 3 | vergleichbare Angebote vor Fenstertausch | Verbraucherzentrale NRW 02/2025 | `web/assets/app.js:6321` |
| 36 % | Eigentümer finden schwer passende Handwerker | ImmoScout24, 501 Eigentümer, 08/2025 | `web/assets/app.js:6322` |
| mehr als 1/3 | getauschte Fenster → Lüftungskonzept nach DIN 1946-6 | Energie-Fachberater | `web/assets/app.js:6324` |
| 598 bis 1.153 € | 3-fach-Fenster 1,3 × 1,3 m mit Montage, Herbst 2023 | VFF und BF, Studie 01/2024 | `web/assets/app.js:6325` |
| 10 bis 20 %, bis 60 % | Heizkostenersparnis, weniger Wärmeverlust mit 3-fach-Glas | Verbraucherzentrale Energieberatung 03/2026 | `web/assets/app.js:6327` |
| 15 % | BAFA-Zuschuss für Fenster | BAFA, BEG EM, Stand 10/2026 | `web/assets/app.js:6328` |
| Kurzantworten der 28 Artikel | Kernaussagen der Ratgeber mit Zahlen (Bestellmaß, Brüstung, Uw-Werte, Kosten, Haftung …) | je Artikel nummerierte Quellen | `functions/seo.js:258-287` (llms.txt) |

### 4.4 Tour und Führung

| Ablauf | Schritte | „Gut zu wissen“ je Schritt | Fundstelle |
|---|---|---|---|
| Tour für Fensterbauer (Aufmaß-Link-Modell, `/#tour`) | Projekt anlegen · Link schicken · Kunde misst · Aufmaß kommt an · Bestellmaß und PDF · Nachbesserung · Aufmaß per Code · Preise und Start | 97.482 · 68 % · § 632 BGB · 65,14 € · 87 % · 76 % · 49 % · 9,9 Wochen | `web/assets/portal.js:1442-1460`, `:1530-1592` |
| Führung in der App (`/app/#fuehrung`) | Element · Fotos · Messen · Öffnung · Material · Farbe · Glas · Sonnenschutz · Aufmaßblatt | 2 bis 3 · 36 % · 9,9 Wochen · mehr als 1/3 · 598–1.153 € · 87 % · 10–20 % · 15 % · 68 % | `web/assets/app.js:6307-6329` |

Beispielfiguren der Tour: Betrieb „Fensterbau Brandt“ (Jens Brandt), Kunde „Familie Weber, Lindenstraße 14, 50823 Köln“, Nachricht an den
Kunden in Sie- und Du-Fassung (`web/assets/portal.js:1444`, `:1461-1465`, `:1504`). Dieselben Figuren stehen auf dem Bild
`tour-aufmassblatt-15.webp` der Verkaufsseite.

### 4.5 Paketnamen, Preise und Merkmale

Einzige Quelle: `web/assets/pakete.js:17-66`; Vergleich auf der Seite `web/fuer-fensterbauer/index.html:183-187`. Preise netto zzgl. MwSt.,
nur Unternehmer, „vorläufig“ (`VORLAEUFIG = true`, `web/assets/pakete.js:17`).

| Merkmal | EEZI Essential | EEZI Essential Plus | EEZI Signature |
|---|---|---|---|
| Monatlich / Einrichtung | 29 € / 99 € | 39 € / 199 € | 64 € / 279 € |
| Satz auf der Karte | „Der volle Konfigurator unter Ihrer Domain, im eeziframes-Design mit Ihrem Namen.“ | „Ihr Konfigurator in Ihrem Design: Logo, Firmenfarbe, Fotos und eigene Startseite.“ | „Ganz Ihre Marke, dazu Ihr Dashboard mit persönlichen Einladungslinks und Fortschritt.“ |
| Domain, voller Konfigurator, PDF per E-Mail | ja | ja | ja |
| Gestaltung | eeziframes-Design mit Ihrem Namen | Ihr Design | Ihr Design |
| Logo, Firmenfarbe, eigene Startseite | nein | ja | ja |
| Fotos des Betriebs | – | bis 6 | bis 6 |
| Hinweis auf eeziframes | „Powered by EEZIframes“ | kleiner Hinweis im Fuß | keiner |
| In Suchmaschinen | nein | Startseite | Startseite |
| Aufbewahrung der Anfragen | 30 Tage nach Zustellung | 30 Tage nach Zustellung | Vertragsdauer |
| Dashboard, Einladungslinks, Fortschritt | nein | nein | ja, 5 Zugänge |
| Stellung auf der Seite | – | „Empfohlen“, Cream-Knopf | – |

Kurznamen in Navigation und Vergleich: „Essential“, „Essential Plus“, „Signature“ (`functions/pakete-seite.js:28`).

Tarife des Aufmaß-Link-Modells (nicht Pakete): Start 0 € Grundgebühr, 3 Projekte frei, dann 9 € je Projekt; Abo 10 49 € (danach 69 €),
10 Projekte inkl., je weiteres 5 €; Plus 79 € (danach 119 €), unbegrenzt (`web/config.js:12-14`, `web/nutzungsbedingungen/index.html:44-46`).

### 4.6 Bilder

Fotos in `web/bilder/foto/` (Bildsprache „Tier oder Astronaut tut etwas Menschliches rund ums Fenster“, `docs/BILDER.md:3-6`).
Platzhalter erkannt an Größe und Prüfsumme: zehn identische Dateien mit 3.494 Byte, dazu `gross.webp` mit 3.950 Byte; Inhalt: dunkle Fläche,
Fensterrahmen, Lichtfeld.

| Datei | Format | Motiv laut Alt-Text | Zustand | Einsatz | Fundstelle |
|---|---|---|---|---|---|
| `start-hauseigentuemer.webp` | 1250 × 1250 | Waschbär auf Tritt misst Maueröffnung | Foto | Startseite, Ansicht Hauseigentümer | `web/assets/portal.js:853` |
| `app-start.webp` | 1120 × 1400 | drei Waschbären im Wohnzimmer | Foto | App-Startbild; „Nächster Schritt“ in zwei Ratgebern | `web/assets/app.js:2767` |
| `fb-sessel.webp` | 1122 × 1402 | Astronaut am Bullauge mit gelbem Zollstock | Foto | Verkaufsseite, Startbild | `web/fuer-fensterbauer/index.html:55` |
| `fb-kunden-planen.webp` | 1200 × 1500 | Vater und Tochter messen, Mini-Fensterbauer | Foto | Verkaufsseite, Abschnitt 7 | `:149` |
| `fuer-fensterbauer.webp` | 1200 × 1500 | Astronaut mit Zollstock (früheres Startbild) | Foto, ungenutzt | – | `docs/BILDER.md:36` |
| `start-fensterbauer.webp` | 1120 × 1400 | Bär in der Werkstatt mit Tablet | Foto, ungenutzt | – | `docs/BILDER.md:31` |
| `gross.webp` | 1200 × 1500 | Oktopus an Hebe-Schiebe-Tür | Platzhalter | Startseite „Auch ganz groß.“ | `web/assets/portal.js:785` |
| `fb-kundenschutz.webp` | 1600 × 1000 | Meister, Familie, Wölfe vor der Tür | Platzhalter | Verkaufsseite, Abschnitt 8 | `web/fuer-fensterbauer/index.html:161` |
| `fb-frage.webp` | 1600 × 1000 | springendes rotes Telefon | Platzhalter | Verkaufsseite, Abschnitt 12 | `:217` |
| `ratgeber.webp`, `weg-pruefen/-entscheiden/-auswaehlen/-ausmessen/-vergleichen/-einbauen.webp` | 1600 × 1000 | Eule, Katze, Fuchs, Oktopus, Biber, Eule, Bär | Platzhalter | Ratgeber-Übersicht, „Nächster Schritt“ in Artikeln | `web/ratgeber/index.html` |
| `fehler.webp` | 1600 × 1000 | Katze im Fensterrahmen auf Wiese | Platzhalter | 404 | `web/404.html:23` |

Weitere Bildträger:

- `web/bilder/tour-aufmassblatt-10/15/20.webp` (920 × 872): Ausschnitt des echten Aufmaßblatts, Beispiel „Fensterbau Brandt / Familie
  Weber“, je Abzug 10/15/20 mm; 15 auf der Verkaufsseite, alle drei in der Tour (`web/assets/portal.js:1509`, `README.md` „Zeichen und
  Bilder“).
- 28 SVG-Zeichnungen in `web/bilder/*.svg`, je Artikel eine (Tabelle 3.8).
- `web/og.png` (1200 × 630): „Aufmass-App für Fenster · Fenster ausmessen. Selbst. eezi.“ mit Chips „Maße, Fotos, 3-D-Modell,
  Aufmaßblatt, Für Fensterbauer: ohne Anfahrt“; gilt für alle Seiten, auch die Verkaufsseite (`web/fuer-fensterbauer/index.html:13-16`).
- Logo (Licht fällt durch ein Fenster in einen dunklen Raum), animiert beim Laden (`docs/GESTALTUNG.md:7`, `web/favicon.svg`).
- Im Code gezeichnet: Fensterzeichnung mit vier Maßen (`web/assets/portal.js:861-865`); 3-D-Modell in WebGL (`web/assets/buehne.js`,
  App-Startbild); Telefon-Bühne, Tisch und Aufmaßblatt-Karte der Verkaufsseite (`web/fuer-fensterbauer/index.html:94-116`); Paket-Skizzen
  (`functions/pakete-seite.js:95-106`); 14 Element-Symbole der Leiste (`web/fuer-fensterbauer/index.html:67`); 6 Ablauf-Symbole
  (`functions/pakete-seite.js:152-160`).
- Material-Wünsche für weitere Plätze mit Motiv und Prompt: `fb-anfrage`, `fb-pakete`, `fb-ablauf`, `partner-start`, `partner-gestaltung`,
  `partner-warten`, `partner-live`, `instanz-danke` (`docs/BILDER.md:90-156`); keine dieser Dateien liegt vor.

### 4.7 Lottie-Zeichen

Zehn Dateien in `web/assets/lottie/`, aus Code erzeugt (`scripts/lottie-erzeugen.py`), Spieler `web/vendor/lottie_light.min.js`;
Beschreibung `docs/GESTALTUNG.md:43`.

| Zeichen | Inhalt laut Doku | Eingesetzt |
|---|---|---|
| `messen` | Fenster mit Maßlinie | Verkaufsseite Schritt 2 und Telefon-Bühne; „So funktioniert es“ (Startseite); App |
| `fotos` | Sucher mit Messpunkten | Telefon-Bühne der Verkaufsseite; App |
| `senden` | Papierflieger | Verkaufsseite Schritt 3; App (Versand) |
| `eingang` | Blatt in Ablage | Verkaufsseite Schritt 4 und Tisch; leere Listen im Betriebsbereich |
| `fertig` | grüner Haken | Verkaufsseite Schritt 5; App; Kundenkonto nach Zahlung |
| `farbwechsel` | Rahmen wechselt Farbe über drei Chips | Verkaufsseite, Vorspann „Die Pakete“ |
| `marke` | Rahmen wird gefüllt, Logo rastet ein | nirgends |
| `domain` | Adresszeile, Schloss wird grün | nirgends |
| `dashboard` | drei Statuskarten | nirgends |
| `konfigurator` | 10-s-Geschichte: Messen, Element, Flieger, Blatt | nirgends |

Belege der Verwendung: `web/fuer-fensterbauer/index.html:89-109`, `:172`; `web/assets/portal.js:890`, `:1031`; `web/assets/partner.js:575`;
Suche nach `data-lottie` über `web/` und `functions/`.

### 4.8 Wiederkehrende Fragen (FAQ-Bestand)

| Ort | Anzahl | Themen | Fundstelle |
|---|---|---|---|
| Startseite, Textfassung | 3 | selbst messen, Kosten, Weg zum Fensterbauer | `web/index.html:93-95` |
| App, Textfassung | 4 | Handy, Kosten, Konto, Daten | `web/app/index.html:79-82` |
| Verkaufsseite | 10 | siehe 3.5 Nr. 13 | `web/fuer-fensterbauer/index.html:236-245` |
| „So funktioniert es“ (Aufmaß-Link-Modell) | 8 | Genauigkeit, was der Kunde braucht, Hilfe, Datensicht, Abwerben, Eigenmesser, Zahlung, Weiterverarbeitung | `web/assets/portal.js:880-889` |
| Ratgeber und Fachartikel | 4–8 je Seite | themenbezogen | Tabelle 3.8 |

### 4.9 Zusagen zum Kundenschutz

| Fassung | Punkte | Fundstelle |
|---|---|---|
| Pakete | Nur Ihr Betrieb · Nur an Sie · In Ihrem Auftrag · Kein Weiterverkauf | `web/fuer-fensterbauer/index.html:162-166`, Paketbedingungen § 10 (`web/konfigurator-bedingungen/index.html:83`) |
| Aufmaß-Link-Modell | Nur Ihr Betrieb · Nur in Ihr Konto · Keine Kopie von uns · Kein Weiterverkauf | `web/assets/portal.js:867-878`, Nutzungsbedingungen § 11 (`web/nutzungsbedingungen/index.html:79`) |

---

## 5. Auffälligkeiten

### 5.1 Zwei Geschäftsmodelle für Fensterbauer nebeneinander

1. **Verkaufsseite gegen Startseite.** Die Verkaufsseite verkauft Konfigurator-Pakete (29–64 € im Monat). Die Startseite bewirbt in Kopf,
   Fuß und Pilot-Hinweis weiterhin das Aufmaß-Link-Modell mit Tarifen Start, Abo 10 und Plus („Preise“, „Kostenlos starten“, „Tour für
   Fensterbauer“, „Preise für Betriebe“) (`web/assets/portal.js:450`, `:482`; `web/assets/gemeinsam.js:349`). Laut Bauplan sollen alte
   Tarife „nicht mehr beworben“ werden (`docs/instanzen/BAUPLAN.md:657`); SKILL: „Kein Thema mehr: eine Plattform, auf der Kunden bei
   eeziframes Projekte anlegen.“
2. **Gleiche Namen, anderer Inhalt.** „So funktioniert es“ heißt auf der Verkaufsseite der Paket-Ablauf (`#so-funktioniert-es`), im Fuß der
   Startseite „So funktioniert es für Betriebe“ der Ablauf des Aufmaß-Link-Modells (`web/assets/portal.js:890-891`). Ebenso „Preise für
   Betriebe“ gegen „Die Pakete“.
3. **Zwei Hauptknöpfe in der Ansicht Fensterbauer.** Kopf: „Kostenlos starten“/„Starten“ (Registrierung alt); Inhalt: „Pakete ansehen“.
   Am Telefon steht „Starten“ in Cream direkt über dem Startbild der Paket-Seite (`screens/mobil-fensterbauer-ansicht-01.jpg`).
4. **Kundenschutz widersprüchlich lesbar.** Alt: „Ihr Kunde bekommt von eeziframes weder das Aufmaßblatt noch einen Code“
   (`web/assets/portal.js:870`). Pakete: „Nach dem Senden bekommt er … seine Anfrage als PDF“ (`web/fuer-fensterbauer/index.html:240`,
   `kopieKunde: true` in `web/assets/pakete.js`). Beide stehen in derselben Ansicht erreichbar.
5. **Aufmaßblatt-PDF führt ins alte Modell.** Kasten „die ersten 3 Projekte sind frei“, Block „Ihre Kunden messen selbst …“, QR-Code
   „Projekt anlegen“ → `/?von=pdf` → Registrierung (`web/assets/blatt.js:356-357`, `:684-700`; `web/assets/portal.js:849`). Kein Hinweis auf die
   Pakete.
6. **Bestandskunden-Frage** auf der Verkaufsseite („Ich nutze eeziframes schon mit Kundenlinks …“, `web/fuer-fensterbauer/index.html:244`)
   bestätigt, dass das alte Modell weiterläuft; für Neukunden bleibt unklar, ob es noch angeboten wird.

### 5.2 Widersprüche bei Zahlen und Aussagen

| Thema | Stelle A | Stelle B | Fundstellen |
|---|---|---|---|
| Zahl der Maße | „vier Maße mit dem Zollstock“ (Startseite, App, Tour „k von 4 Maßen“) | „8 Maße je Fenster von Hand“, „acht Handmaße“, „drei Breiten und drei Höhen … dazu das Rahmenmaß“ | `web/assets/portal.js:852`, `:1550-1551`; `web/assets/app.js:2772`, `:2778` gegen `web/assets/portal.js:854`, `:881`; `web/index.html:59` |
| Leistungen Plus (alt) | Tour: „Projekte unbegrenzt, Team mit Rollen und Statistik“ | Preise: ohne Team; Betriebsprofil: Team „geplant“; Nutzungsbedingungen: „Logo und Farbe beim Kunden sowie die weiteren Leistungen laut Preisübersicht“ | `web/assets/portal.js:1579` gegen `:905`, `:1172`; `web/nutzungsbedingungen/index.html:46` |
| Umsatzsteuer | Seiten und Konfiguration: „netto zzgl. MwSt.“, `mwst: true` | AGB/Nutzungsbedingungen: „Solange wir die Kleinunternehmerregelung nach § 19 UStG anwenden …“ | `web/config.js:12`, `web/fuer-fensterbauer/index.html:174-178` gegen `web/agb/index.html:55`, `web/nutzungsbedingungen/index.html:48` |
| Code auf der Website | „0 Zeilen Code auf Ihrer Website“ | Kundenkonto: Knopf „Fenster planen“ als „HTML-Code kopieren und … einfügen“ (freiwillig) | `web/fuer-fensterbauer/index.html:70` gegen `web/assets/partner.js:531` |
| Schreibweise der Marke | Regel: „eeziframes, immer klein geschrieben“ | Kennzeichnung Essential: „Powered by EEZIframes“ (in INSTANZEN und BAUPLAN so festgelegt) | `docs/GESTALTUNG.md:7` gegen `web/assets/pakete.js` (kennzeichnung), `docs/INSTANZEN.md:288` |
| Paketnamen | SKILL: Paketnamen „wie vorgegeben („EEZI Essential“)“ | Navigation, Vergleich, Knöpfe: „Essential“, „Essential Plus“, „Signature“ | SKILL §4, `functions/pakete-seite.js:28`, `web/fuer-fensterbauer/index.html:180`, `:184` |
| Einführungspreis | meist mit Hinweis „Einführungspreis bis 17. November 2026, danach 12,99 €“ | ohne Hinweis: Startseite-FAQ, App-FAQ, Ratgeber „Selbst messen“ (der Server tauscht den Preis am Stichtag selbst, `functions/seo.js:145-155`) | `web/index.html:61` gegen `web/index.html:94`, `web/app/index.html:80`, `web/ratgeber/index.html` |
| Ratgeber-Auswahl | Textfassung Startseite: 6 Karten | JS-Fassung: 9 Karten, andere Auswahl; App-Textfassung: 6 Karten | `web/index.html:83-90`, `web/assets/portal.js:786`, `web/app/index.html:69-76` |

### 5.3 Dopplungen

- **Verkaufsseite zweimal:** `/fuer-fensterbauer/` und `/#fensterbauer` mit identischem Inhalt, aber anderem Kopf, Fuß und Banner
  (Abschnitt 3.3). Der Abschnitt „Für Fensterbauer“ der Ansicht Hauseigentümer verlinkt auf die eigenständige Seite, nicht auf die Ansicht
  (`web/assets/portal.js:790`).
- **Startseite in zwei Fassungen** mit unterschiedlichem Inhalt: Suchmaschinen und Besucher ohne JavaScript sehen Steckbrief-Tabelle und
  FAQ; Besucher mit JavaScript sehen Zahlenleiste, „Was im Aufmaß steckt.“ und „Auch ganz groß.“ (`web/index.html:43-96` gegen
  `web/assets/portal.js:851-858`). Gleiches gilt für die App (H1 „Fenster ausmessen: kostenlose Aufmaß-App im Browser“ gegen
  „Fotografieren. Messen. Wünschen.“).
- **Inhaltskataloge mehrfach:** „Was im Aufmaß steckt“ (8 Kacheln, `web/assets/portal.js:615-624`), „Was in jeder Anfrage steht“
  (7 Punkte, `web/fuer-fensterbauer/index.html:123-131`), Steckbrief „Ergebnis“ (`web/index.html:74`), Ratgeber „Aufmaßblatt“ – vier
  Fassungen derselben Liste mit abweichender Gliederung.
- **Kundenschutz** in vier Texten: zwei Seitenfassungen (4.9) und zwei Vertragsfassungen (§ 11 Nutzungsbedingungen, § 10 Paketbedingungen).
- **Zahlen der Verkaufsseite** stehen zusätzlich in Tour und App-Führung (9,9 Wochen, 65,14 €, 68 %, 87 %) und im PDF (65,14 €).
- **PDF-Fassungen** der Paketbedingungen und des AV-Vertrags liegen je zweimal vor (22. und 23.10.2026, `web/konfigurator-bedingungen/`);
  verlinkt ist nur die neuere.

### 5.4 Navigation

- Sieben Kopfzeilen-Varianten (2.1). Am Telefon keine Textnavigation auf statischen Seiten und kein Menü.
- Rechtsseiten: Link „Für Betriebe“ führt auf `/` (Standardansicht Hauseigentümer) (`web/agb/index.html:17` und fünf weitere).
- Verkaufsseite: Kopf-Link „Kundenkonto“ für Besucher, die noch nichts bestellen können; kein Weg zurück zur Startseite außer Logo und
  Brotkrumen (`web/fuer-fensterbauer/index.html:50`).
- App: „Sie sind Fensterbauer? ›“ führt zu `/#fensterbauer` (mit Kopf des alten Modells) statt zu `/fuer-fensterbauer/` (`web/assets/app.js:2308`).
- 404: Fuß ohne „Für Fensterbauer“, Nutzungsbedingungen, Cookies (`web/404.html:25`).
- Ratgeber-Knöpfe führen auf `/app/` (Startbild der App), die Startseite auf `/app/#ausmessen` (direkt messen) – zwei Einstiege in dieselbe
  Handlung.
- Aus den Ratgebern für Hauseigentümer gibt es im Inhalt kaum Wege zur Verkaufsseite (2.5); umgekehrt verlinkt die Verkaufsseite keine
  Ratgeber für Hauseigentümer.

### 5.5 Veraltete oder unfertige Stellen

- **Platzhalter-Fotos** an 11 Plätzen, darunter drei auf der Verkaufsseite und alle sieben der Ratgeber-Übersicht; die Alt-Texte beschreiben
  Motive, die nicht zu sehen sind (4.6).
- **Ungenutztes Material:** Fotos `start-fensterbauer.webp`, `fuer-fensterbauer.webp`; Lottie `marke`, `domain`, `dashboard`,
  `konfigurator`. `docs/GESTALTUNG.md:43` nennt fünf Zeichen „der Verkaufsseite“, eingebaut ist nur `farbwechsel`.
- **`docs/BILDER.md:31`** führt `start-fensterbauer` noch als Bild der Ansicht Fensterbauer der Startseite; diese bettet inzwischen die
  Verkaufsseite ein.
- **Pilot-Hinweis** „Im Bereich für Betriebe wird nichts berechnet … Zum Kennenlernen gibt es die Tour.“ erscheint ohne Server auf der
  Startseite in beiden Ansichten über dem Einführungsband (`web/assets/gemeinsam.js:347-357`, `screens/desktop-start-01.jpg`).
- **Live-Demos und Bestellung** angekündigt „in Kürze“ (`web/fuer-fensterbauer/index.html:174`, `:209`, `:220`).
- **Paketbedingungen** sind ein „Entwurf zur anwaltlichen Prüfung“ mit Platzhaltern (`web/konfigurator-bedingungen/index.html:28`, `:89`,
  `:106`, `:164`).
- **Stand-Angaben:** Cookies „Stand: 18. Oktober 2026“, Datei zuletzt am 23.10.2026 geändert, Sitemap-Stand 23.10.2026; Datenschutz nur
  „Oktober 2026“ (`web/cookies/index.html`, `functions/seo.js:54`, `:57`).
- **README:** nennt Schrift „Maven Pro“ (geladen wird Inter, `web/fonts/`), „fünf gezeichnete Bewegtbilder“ (es sind zehn) und Rechtstexte
  mit „E-Mail und Telefon folgen“ (Impressum enthält beides) (`README.md`, Tabelle „Aufbau“ und „Lizenzen“).
- **Beispiel-Domain** „brandt-fenster.app“ und Beispielbetrieb „Fensterbau Brandt“ sind fiktiv; auf dem Bild der Verkaufsseite steht der
  Hinweis „Beispiel“ nur klein im Blatt (`web/fuer-fensterbauer/index.html:88`, `:133`).

### 5.6 Sprache und Marke

- **Anrede wechselt** für dieselbe Zielgruppe: Hauseigentümer werden auf der Startseite gesiezt, in App, Ratgeber und og-Text der App
  geduzt; in der Ratgeber-Leiste der gesiezten Startseite steht „woran du ein gutes Fensterangebot erkennst“
  (`web/assets/portal.js:786`, `web/app/index.html:12`).
- **Überschriften:** Markenregel „genau ein grünes Wort je Überschrift“ und Punkt am Ende (`docs/GESTALTUNG.md:26`, SKILL §4). Auf der
  Verkaufsseite haben „So funktioniert es“, „Ihre Kunden bleiben Ihre Kunden“, „Live-Demos“, „Bestellen oder anfragen“, „Häufige Fragen“,
  „Wissen für Fensterbauer“ kein grünes Wort; keine Überschrift der Seite endet mit Punkt, im Betriebsbereich enden alle mit Punkt.
- **og-Bild** der Verkaufsseite ist das Bild der Hauseigentümer („Fenster ausmessen. Selbst. eezi.“).

### 5.7 Offene Fragen

1. Wird das Aufmaß-Link-Modell (Start, Abo 10, Plus) Neukunden noch angeboten, oder nur für Bestandsbetriebe weitergeführt? Davon hängen
   Kopf und Fuß der Startseite, Pilot-Hinweis, Tour, Preise und der Fensterbauer-Teil des Aufmaßblatt-PDFs ab.
2. Soll die Verkaufsseite dauerhaft an zwei Orten stehen (eigene URL und Ansicht der Startseite)?
3. Umsatzsteuer: Wird Umsatzsteuer berechnet oder gilt die Kleinunternehmerregelung?
4. Sind die Paketpreise (29/39/64 €, Einrichtung 99/199/279 €) endgültig? Wann werden Bestellung (`PAKETE_OFFEN`) und Live-Demos
   (`PAKETE_DEMOS`) freigeschaltet, und ist `INDEXIERUNG` gesetzt? Die Werte stehen nicht im Repository.
5. Welche Zahl der Maße soll kommuniziert werden: vier (Einstieg) oder acht (vollständig)?
6. Plus-Tarif: Sind „Team mit Rollen und Statistik“ vorhanden oder geplant?
7. „Powered by EEZIframes“ in Versalien: bewusste Ausnahme von der Kleinschreibung der Marke?
8. Anrede der Hauseigentümer: „du“ oder „Sie“ einheitlich?
9. Wann kommen die 11 fehlenden Fotos und die Beispielbilder der Paketkarten?
10. Gewichtung „Kunden planen selbst“: SKILL nennt es nicht die Hauptaussage, die Verkaufsseite widmet ihm einen eigenen Abschnitt mit den
    meisten belegten Zahlen. Soll das so bleiben?
11. Paketbedingungen: Wann liegt die anwaltlich geprüfte Fassung vor? Ohne sie werden laut Seite keine kostenpflichtigen Bestellungen
    angenommen (`web/konfigurator-bedingungen/index.html:28`).

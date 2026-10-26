# Vorlage: Landingpage eines Konfigurators (EEZI Essential)

Die Seite, die Kunden eines Fensterbauers zuerst sehen, wenn sie auf seiner Website „Fenster planen“ tippen und auf
`<firma>.eeziframes.com` landen. Danach kommt der Konfigurator. Stand 26.10.2026, Vorschau ohne Funktionen: Knöpfe haben noch
kein Ziel (`href="#"`, start.js verhindert den Sprung nach oben), die Seite liegt nur als Vorschau unter
`docs/profis/konfigurator-landing-vorschau/`. Protokoll: `docs/profis/2026-10-26-konfigurator-landing.md`.

Grundsatz: **Die Form gehört eeziframes, die Farbe gehört dem Betrieb.** Bühne (Beton im Fensterlicht, wie das Zeichen von
eeziframes), Schrift, Pillen, Aufbau und Texte bleiben bei jedem Betrieb gleich; Name, Zeichen, Farbe, Ansprechpartner und
Kontakt wechseln. eeziframes erscheint nur schwarz-weiß bzw. silbergrau: im Kopf rechts („Konfigurator von“), in der Adresse am
Gerät, als Station „eeziframes übermittelt“ und im Fuß („Powered by“, Kennzeichnung des Pakets nach `web/assets/pakete.js`).

## Was je Betrieb getauscht wird

Jede Stelle trägt im Markup `data-vorlage="…"`; so findet man alle Vorkommen mit einer Suche.

| Platz | `data-vorlage` | Platzhalter | Wo | Hinweis |
| --- | --- | --- | --- | --- |
| Name | `firma.name` | Muster Fensterbau | Kopf, Leiste, Gerät, Zeile unter den Knöpfen, Schritt 4, „Weiß ich noch nicht“, Weg (Titel, Text, Stationen), Kontakt, Fuß, `<title>`, Bildbeschreibung der Bühne, versteckter Linkname „Website von …“ | bis 80 Zeichen; Kopf und Leiste kürzen nach zwei bzw. einer Zeile. Im Titel des Wegs steht der Name in `<span>`, der Punkt dahinter bleibt |
| Zeichen | `firma.zeichen` | Initiale „M“ | Kopf, Leiste, Gerät, Schritt 4, Weg, Kontakt, Fuß | Initiale: erster Buchstabe ohne Zusatz wie „Fensterbau“ (wie `Einladung.initiale`). Logo statt Initiale: `<span class="ez-firma__zeichen ez-firma__zeichen--logo"><img src="…" alt=""></span>`, helles Feld, Logo eingepasst |
| Firmenfarbe | Block `.ez { … }` im Kopf von `index.html` | Violett mit Indigo | Zeichen, Leuchten (Bühne, Schritt 4, 5 Minuten, Weg, Kontakt), gewählte Kachel und laufende Station im Gerät, gewählte Wünsche, „Gesendet“, Fenster-Maßlinie, Hover | fünf Variablen, Regeln unten („Farbe prüfen“). Die Farbe ersetzt nur Violett/Indigo, nie den Grund (DNA, Rangfolge 2) |
| Adresse | `firma.adresse` | **muster-fensterbau**.eeziframes.com | Etikett am Gerät, Fuß | Teil vor dem Punkt hell (Betrieb), Rest grau (Gastgeber); im Fuß darf sie am Punkt umbrechen (`<wbr>`) |
| Begrüßung | `firma.begruessung` | „**Für Ihr Angebot brauchen wir die Maße Ihrer Fenster.** Messen Sie hier selbst, danach melden wir uns mit dem Angebot.“ | Hero | eigener Text des Betriebs, höchstens drei Zeilen am Telefon (sonst rutscht die Pille unter die Falz); der Satz, was danach kommt, gehört hinein |
| Ansprechpartner | `firma.ansprechpartner`, Bild `firma.ansprechpartner.bild` | Maria Muster, Initialen „MM“ | Unterschrift unter der Begrüßung, mit Betrieb und Ort | Foto statt Initialen: `<img>` in `.ez-person`; ohne Person „Ihr Team von <Name>“ |
| Ort | `firma.ort` | Fensterbau in Musterstadt | Kontaktkarte, Unterschrift | |
| Telefon | `firma.telefon` | 0123&nbsp;456789 | Kontaktkarte (Held, 32 px) und runder Knopf | Ziffern mit geschütztem Leerzeichen; für den Knopf später `tel:+49123456789` (E.164) |
| E-Mail | `firma.mail` | info@muster-fensterbau.de | Kontaktkarte und runder Knopf | später `mailto:…?subject=Frage%20zu%20meinen%20Fenstern` |
| Anschrift | `firma.anschrift` | Musterstraße&nbsp;1 / 12345&nbsp;Musterstadt | Kontaktkarte | Straße und Ort in zwei Zeilen |
| Website | `firma.website` | ohne Ziel | runder Knopf | |
| Nachmessen | `firma.feinaufmass` | „Ob das etwas kostet, steht im Angebot.“ | Station „Nachmessen vor Ort“ | der Betrieb kann hier sagen, ob das Feinaufmaß kostet |
| Ziel der Hauptknöpfe | `ziel.konfigurator` | `#` | Hero, Leiste, Karte „Bereit“ | Konfigurator der Instanz; mit gespeicherter Planung später „Weiter planen“ und „2 Fenster gespeichert“ darunter |
| Rechtliches | `recht.impressum`, `recht.datenschutz` | ohne Ziel | Fuß | Impressum und Datenschutz des Betriebs (`functions/instanz/recht.js`) |
| Anrede | – | Sie | ganze Seite | Du-Fassung nur auf Wunsch des Betriebs; die Messschritte duzen immer (Satz in der Einleitung von „So geht es“) |

Fehlt eine Angabe zum Kontakt, fällt ihre Zeile und ihr runder Knopf weg. Lädt der Konfigurator später nicht, zeigt die Seite die
Kontaktkarte (für die Umsetzung in der Instanz).

## Farbe prüfen

Fünf Variablen im Block `.ez { … }` (die Prüfung lässt sich mit `farbprobe.mjs` nachstellen, siehe Protokoll):

| Variable | Regel |
| --- | --- |
| `--firma` | die Firmenfarbe als Hex |
| `--auf-firma` | Schwarz `#07090a` oder Weiß, je nachdem, was mehr Kontrast hat (mindestens 4,5:1) |
| `--firma-tief` | `color-mix(in srgb, <hex> 40%, #07090a)`; bei sehr hellen Farben (relative Helligkeit über 0,3) 30 % |
| `--firma-licht` | die Farbe selbst; bei sehr dunklen Farben (Helligkeit unter 0,08) `color-mix(in srgb, <hex> 55%, #fff)`, damit das Leuchten auf Schwarz sichtbar bleibt; bei sehr hellen (über 0,3) `color-mix(in srgb, <hex> 70%, #07090a)`, damit Lesetext über dem Leuchten 4,5:1 behält |
| `--hinweis` | Koralle `#f88962`; bei roter oder oranger Firmenfarbe (Farbton unter 40° oder über 340°, kräftig) Silbergrau `#a8a4a9`, damit Hinweise und Öffnungs-Maß nicht wie der Betrieb aussehen |

Geprüft am 26.10.2026 mit Gold, Rot, Dunkelblau, Grün, fast Schwarz und Gelb (`docs/profis/bilder/2026-10-26-konfigurator-landing-farbprobe.jpg`).

## Was bleibt

- Bühne `bilder/buehne.webp` (Prompt in `bilder/buehne-prompt.md`). Lage des Geräts und das Fensterkreuz über dem Gerät hängen
  zusammen: Ändern sich `--gx`, `--gy`, `--gs` oder das Seitenverhältnis der Bühne, müssen `--k1` und `--k2` neu gerechnet werden.
- Das Gerät mit dem ersten Schritt des Konfigurators (Renderings aus der App in `bilder/konfig/`), Schritte, Zeichnung, 3-D-Modell,
  Texte über Ablauf, Daten und Danach.
- Kein Wortspiel mit „eezi“ (docs/GESTALTUNG.md: nie im Kundenlink eines Betriebs), keine Preise.
- Paket: Laut `web/assets/pakete.js` hat EEZI Essential weder Logo noch Firmenfarbe (`logo: false`, `farbe: false`, Name als
  Text). Die Vorlage hält die Plätze trotzdem bereit; ob Essential sie bekommt, entscheidet der Inhaber. Ohne Logo und Farbe gilt
  der Rückfall: Initiale auf Violett.
- In der Instanz: `<html lang="de">` (die Vorschau setzt `lang` nur an `<main>`), „Powered by“ trägt `lang="en"`.

## Neu befüllen

1. Name, Adresse, Ort, Begrüßung, Ansprechpartner, Kontakt: alle Stellen mit `data-vorlage` ersetzen (auch `<title>` und das
   `<figcaption>` der Bühne).
2. Farbe im Block `.ez { … }` nach der Tabelle oben setzen.
3. Logo (falls vorhanden) als PNG oder WebP nach `bilder/firma/`, in allen Zeichen einsetzen.
4. Messen wie jede Seite (Begleit-Skill, Abschnitt 5): `huelle.sh`, `shot.mjs`, `farben.py`, `pruef.mjs`, `leistung.mjs`;
   die Pille muss am Telefon auch bei 664 px sichtbarer Höhe ganz zu sehen sein.

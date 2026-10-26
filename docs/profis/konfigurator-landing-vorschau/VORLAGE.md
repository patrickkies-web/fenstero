# Vorlage: Landingpage eines Konfigurators (EEZI Essential)

Die Seite, die Kunden eines Fensterbauers zuerst sehen, wenn sie auf seiner Website „Fenster planen“ tippen und auf
`<firma>.eeziframes.com` landen. Danach kommt der Konfigurator. Stand 26.10.2026, Vorschau ohne Funktionen: Knöpfe haben noch
kein Ziel (`href="#"`), die Seite liegt nur als Vorschau unter `docs/profis/konfigurator-landing-vorschau/`.

Grundsatz: **Die Form gehört eeziframes, die Farbe gehört dem Betrieb.** Bühne (Beton im Fensterlicht, wie das Zeichen von
eeziframes), Schrift, Pillen, Aufbau und Texte bleiben bei jedem Betrieb gleich; Name, Zeichen, Farbe und Kontakt wechseln.
eeziframes erscheint nur schwarz-weiß: im Kopf rechts („Konfigurator von“), in der Adresse am Gerät, als Station „eeziframes
übermittelt“ und im Fuß („Powered by“).

## Was je Betrieb getauscht wird

Jede Stelle trägt im Markup `data-vorlage="…"`; so findet man alle Vorkommen mit einer Suche.

| Platz | `data-vorlage` | Platzhalter | Wo | Hinweis |
| --- | --- | --- | --- | --- |
| Name | `firma.name` | Muster Fensterbau | Kopf, Leiste, Gerät, Unterschrift, Schritt 4, „Weiß ich noch nicht“, Weg, Kontakt, Fuß, `<title>` | bis 80 Zeichen; Kopf und Leiste kürzen nach zwei bzw. einer Zeile |
| Zeichen | `firma.zeichen` | Initiale „M“ | Kopf, Leiste, Gerät, Unterschrift, Schritt 4, Weg, Kontakt, Fuß | Initiale: erster Buchstabe ohne Zusatz wie „Fensterbau“ (wie `Einladung.initiale`). Logo statt Initiale: `<span class="ez-firma__zeichen ez-firma__zeichen--logo"><img src="…" alt=""></span>`, helles Feld, Logo eingepasst |
| Firmenfarbe | Block `.ez { --firma … }` im Kopf von `index.html` | Violett mit Indigo | Zeichen, Leuchten (Bühne, Schritt 4, 5 Minuten, Weg, Kontakt), gewählte Kachel und laufende Station im Gerät, Fenster-Maßlinie | `--firma: <hex>; --firma-tief: color-mix(in srgb, <hex> 40%, #07090a); --auf-firma:` Schwarz oder Weiß, je nachdem, was ab 4,5:1 hat. Die Farbe ersetzt nur Violett/Indigo, nie den Grund (DNA, Rangfolge 2) |
| Adresse | `firma.adresse` | **muster-fensterbau**.eeziframes.com | Etikett am Gerät, Fuß | Teil vor dem Punkt hell (Betrieb), Rest grau (Gastgeber) |
| Begrüßung | `firma.begruessung` | Vorlage der Einladungsseite (`Einladung.VORLAGE`, Website-Fassung) | Hero | eigener Text des Betriebs, höchstens drei Zeilen am Telefon |
| Ort | `firma.ort` | Fensterbau in Musterstadt | Kontaktkarte | |
| Telefon, E-Mail, Website | `firma.telefon`, `firma.mail`, `firma.website` | ohne Ziel | Kontaktkarte | fehlt eine Angabe, fällt ihr runder Knopf weg; fehlen alle, bleibt nur der Satz „… meldet sich nach Ihrer Anfrage bei Ihnen.“ |
| Ziel der Hauptknöpfe | `ziel.konfigurator` | `#` | Hero, Leiste, Karte „Bereit“ | Konfigurator der Instanz |
| Rechtliches | `recht.impressum`, `recht.datenschutz` | ohne Ziel | Fuß | Impressum und Datenschutz des Betriebs (`functions/instanz/recht.js`) |
| Anrede | – | Sie | ganze Seite | Du-Fassung nur auf Wunsch des Betriebs; die Messschritte duzen immer (Satz in der Karte „Bereit“) |

## Was bleibt

- Bühne `bilder/buehne.webp` (Prompt in `bilder/buehne-prompt.md`), das Gerät mit dem ersten Schritt des Konfigurators
  (Renderings aus der App in `bilder/konfig/`), Schritte, Zeichnung, 3-D-Modell, Texte über Ablauf, Daten und Danach.
- Kein Wortspiel mit „eezi“ (docs/GESTALTUNG.md: nie im Kundenlink eines Betriebs), keine Preise.
- Paket: Laut `web/assets/pakete.js` hat EEZI Essential weder Logo noch Firmenfarbe (`logo: false`, `farbe: false`, Name als
  Text). Die Vorlage hält die Plätze trotzdem bereit; ob Essential sie bekommt, entscheidet der Inhaber. Ohne Logo und Farbe gilt
  der Rückfall: Initiale auf Violett.

## Neu befüllen

1. Name, Adresse, Ort, Begrüßung: alle Stellen mit `data-vorlage` ersetzen (auch `<title>` und die Bildbeschreibung im
   `<figcaption>` der Bühne).
2. Farbe im Block `.ez { … }` setzen; Kontrast von `--auf-firma` prüfen.
3. Logo (falls vorhanden) als PNG oder WebP nach `bilder/firma/`, in allen Zeichen einsetzen.
4. Messen wie jede Seite (Begleit-Skill, Abschnitt 5): `huelle.sh`, `shot.mjs`, `farben.py`, `pruef.mjs`, `leistung.mjs`.

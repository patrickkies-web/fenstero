# Vorlage: Landingpage im Paket EEZI Essential Plus

Muster-Landingpage eines Konfigurators unter der eigenen Domain des Betriebs (Beispiel: Fensterbau Brandt, Köln, erfunden). Gegenüber Essential kommt der Betrieb selbst auf die Seite; was im Paket zu ihm gehört, steht in `web/assets/pakete.js` (Merkmale `gestaltung: 'eigen'`, `logo`, `farbe`, `fotos: 6`, `startansicht`, `icons: 'betrieb'`, `kennzeichnung: 'dezent'`, `indexierung: 'start'`).

## Was je Betrieb getauscht wird (`data-vorlage="…"` im Markup)

| Schlüssel | Stelle | Quelle in der Instanz |
| --- | --- | --- |
| `firma.logo`, `firma.zeichen` | Kopf, Leiste, App auf dem Gerät, Schritt 4, Route, Kontaktkarte, Fuß (SVG-Zeichen plus Wortmarke) | `marke.bilder.logo`, `icon*` |
| Firmenfarbe | Block `<style>` am Anfang: `--firma`, `--firma-tief`, `--auf-firma`, `--firma-licht`, `--hinweis` | `marke.farbe` (Kontrast über `Instanzregeln.akzent`) |
| `start.kicker`, `start.ueberschrift`, `start.text` | Hero | `marke.start` |
| `firma.titel`, `firma.text` | Szene 2, Kopfzeile des Betriebs | neu: Titel und Text des Betriebs (Vorschlag für `marke.start`) |
| `firma.foto.2` … `firma.foto.6`, Bühne `data-foto="1"` | Bento in Szene 2, Bühne im Hero | `marke.bilder.start[]`, bis zu sechs |
| `firma.name`, `firma.ort`, `firma.anschrift`, `firma.telefon`, `firma.mail`, `firma.karte`, `firma.website`, `firma.domain` | Hero, Weg, Kontakt, Fuß, Etikett am Gerät | `recht`, `kontakt`, Haupthost |
| `firma.ansprechpartner`, `firma.ansprechpartner.bild` | Begrüßung im Hero und in der Kontaktszene | `auftritt` (Einladung.profil) |
| `firma.feinaufmass` | Route, Station „Nachmessen vor Ort“ | Satz des Betriebs zum Feinaufmaß |
| `ziel.konfigurator` | alle Pillen „Fenster planen“, Pfeilkreis | `/app/` der Instanz |
| `recht.impressum`, `recht.datenschutz` | Fuß | `/impressum/`, `/datenschutz/` der Instanz |

## Fotos

Sechs Plätze: Foto 1 ist die Bühne hinter dem Gerät (bis dahin Beton im Fensterlicht, `bilder/buehne.webp`), Foto 2 bis 6 das Bento in Szene 2 (Werkstatt, Montage, Team, Ausstellung, Referenz). Ohne Foto zeigt ein Platz die gestaltete Leerstelle (dunkle Kachel mit Fensterlicht-Textur, Schraffur = „noch nicht“, Chip „Foto n von 6“). Beim echten Betrieb bekommt jeder Platz das Foto als `<img>` mit Breite, Höhe und Alternativtext ab 40 Zeichen, die Beschriftung bleibt (Werkstatt …), die Zeile „Foto folgt“ entfällt. Prompts für die sechs Motive: `bilder-prompts.md`.

## Muster-Ebene

Der Schalter „Ihres markiert / Ihres zeigen“ im Kopf und alle Elemente mit `ez-muster` zeigen Fensterbauern auf der Verkaufsseite, was im Paket zum Betrieb gehört (Logo, Text, Domain, Farbe und Zeichen, Bühne, Fotos, die Zeile im Fuß). Beim echten Betrieb entfallen Schalter, Klasse `ist-muster` am `<main>` und die `ez-muster`-Elemente.

## Farbe prüfen

`--firma` muss auf Schwarz (#07090a) als Leuchten sichtbar sein (sonst `--firma-licht` aufhellen) und `--auf-firma` auf `--firma` mindestens 4,5:1 haben (Schwarz oder Weiß). Bei roter oder oranger Firmenfarbe wird `--hinweis` Silbergrau (#a8a4a9), damit Hinweis und Betrieb nicht verschwimmen. Die volle Pille bleibt immer Weiß auf Dunkel und Schwarz auf Hell, nie in der Firmenfarbe.

## Übertragen in web/

Wie bei der Seite für Fensterbauer (`scripts/fensterbauer-uebertragen.mjs`): `html.ez-js` über `web/assets/js-da.js` statt Inline-Skript, der Farbblock als Datei oder als `style`-Attribut, das der Server je Instanz setzt (`functions/instanz/seiten.js`), Schriften aus `web/fonts/`, Bilder unter `/marke/<v>/`.

# Abgleich Material und Licht (Jonas Veit): Vorlage der Landingpage „EEZI Signature“

**Gesamteindruck.** Die Seite steht auf der Untergrenze der Startseite und an drei Stellen darüber: Das Fensterkreuz läuft vom Beton über den Bildschirm des Geräts weiter, der Wurf des Telefons ist hart und schräg (Vorlage 09), jedes Etikett ist Glas mit Bruchkante. Was fehlt, ist an fünf Stellen dasselbe: Das Gold leuchtet, aber es trifft nichts. Der Schein des Bildschirms liegt vollständig unter dem Gerät und ist nirgends zu sehen; die beiden schwarzen Innenkarten (Fortschritt im Dashboard, Telefon) sind flaches #07090a ohne Kante und ohne Schatten auf der Karte darunter, obwohl genau sie das Paket Signature ausmachen; die Leuchtkacheln (5 Minuten, Kontakt) sind weiche Wolken ohne Kern und ohne Oberfläche; das Rendering in der Konfigurator-Kachel steht auf der Kachelkante statt herauszubrechen; das Link-Etikett ist zu 72 % Anthrazit und liest sich als Pille, nicht als Glas.

Geprüft: tel-01, reihe-tel (zehn Bildschirme), reihe-desk, tel-oben-einladung-muster, desk-oben-einladung-muster, detail-geraet, detail-bento, detail-schritte, detail-paar, detail-route, detail-bereit, detail-kontakt gegen `signature-vorschau/start.css` (Bühne, Gerät, Schein, Kacheln, Glas, Innenkarten), `index.html` und `dna/tokens.css`. Alle Werte bleiben in den acht Farben plus Firmenfarbe (Tonwerte per `color-mix`, die vorhandenen Töne #3a3b40, #1c1c1e), Leuchten nur radial, kein `filter: blur` auf Flächen, Glas weiter `backdrop-filter`.

## Wo die Seite die Vorlagen schon erreicht (nicht anfassen)

- Bühne (Vorlage 09 und darüber hinaus): das Fensterkreuz des Betons läuft über den Bildschirm weiter (`.ez-geraet__licht`, gleiche Winkel), der Wurf fällt hart nach rechts unten (`30px 40px 8px -2px`), die Bühne hat Lichtkante oben und Vignette unten, dahinter den Lichtteich.
- Etiketten (01, 02, 04): die Domain hängt mit Punkt und gestrichelter Linie am Gerät, das Glas trägt die Bruchkante (.28 oben, .4 unten), das Link-Etikett liegt über Gerät und Boden; das Senden-Feld hat das Leuchten mit Kern um das Zeichen des Betriebs.
- Zahl als Held (10, 07): „5 Minuten“ in 250 mit Einheit 15 px, „2 von 4 Fenstern“ in 300 mit der Kapselreihe (weiß, Gold mit Hof, Schraffur heißt offen), der goldene Lichtteich hinter dem Knoten des Betriebs in der Route (`.ez-route__stelle--ziel::before`) mit dem Zeichen im Hof.

**Pflicht vor Kür, keine Hebel:** Das Bildfeld von Schritt 3 „Wünsche“ ist flaches Weiß (`.ez-schritt__bild--hell { background: var(--weiss) }`), das Fenster schwebt ohne Kontaktschatten; das ist unter der Untergrenze. Die Werte stehen im Urteil zur Seite für Fensterbauer, Hebel 3 (radialer Abfall Weiß zu Silbergrau 14 %, Ellipse .22) und gelten eins zu eins.

## Hebel 1 · Das Gerät ist ein Körper im Gegenlicht (Vorlage 09, 08) · Wirkung hoch

Vorher: `.ez-buehne__schein` sitzt bei 52 % / 56 %, also mittig unter dem deckenden Gerät; im Bild ist kein Gold auf dem Beton. Der Rahmen ist ein gleichmäßiger Ring mit Glanz links oben, das Gerät hat keine sichtbare Dicke (`scale(1, .81)` drückt es flach, aber keine Flanke fängt Licht), nichts am Gerät zeigt, dass sein Bildschirm leuchtet. Nachher: Das Gold ist das Gegenlicht zum weißen Fensterlicht (die Logik aus Vorlage 08). Der Schein rückt unter die Ecke des Geräts, die auf dem dunklen Beton liegt (am Telefon links unten, am Schreibtisch rechts unten), und schaut zur Hälfte darunter hervor; die Kanten des Geräts, die dem Schein zugewandt sind, nehmen seine Farbe; der Bildschirm spiegelt es in der Ecke; eine Flanke von 3 px zeigt die Dicke des Körpers (Vorlage 09, Metallband).

```css
.ez-buehne { --sx: 20%; --sy: 82%; }
.ez-buehne__schein { width: 86%; height: 74%; background: radial-gradient(40% 40% at 50% 50%, var(--firma-licht), color-mix(in srgb, var(--firma) 62%, transparent) 18%, color-mix(in srgb, var(--firma-tief) 70%, transparent) 42%, transparent 70%); }
.ez-geraet { box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), inset 0 0 0 2.5px rgba(7,9,10,.7), inset 0 1.5px 0 rgba(255,255,255,.38), inset 1.5px -1.5px 0 color-mix(in srgb, var(--firma) 55%, transparent), 0 3px 0 color-mix(in srgb, var(--silbergrau) 35%, var(--anthrazit)), 0 4px 0 rgba(7,9,10,.95), 30px 40px 8px -2px rgba(7,9,10,.8), 3px 5px 5px rgba(7,9,10,.9), 0 26px 44px -18px rgba(7,9,10,.9); }
.ez-geraet__glanz { background: linear-gradient(118deg, rgba(255,255,255,.16), rgba(255,255,255,.04) 34%, transparent 46%), radial-gradient(70% 46% at 0% 100%, color-mix(in srgb, var(--firma) 26%, transparent), transparent 62%); }
@media (min-width: 900px) {
  .ez-buehne { --sx: 74%; --sy: 84%; }
  .ez-geraet { box-shadow: inset 0 0 0 1px rgba(255,255,255,.22), inset 0 0 0 2.5px rgba(7,9,10,.7), inset 1.5px 1.5px 0 rgba(255,255,255,.38), inset -1.5px -1.5px 0 color-mix(in srgb, var(--firma) 55%, transparent), 0 3px 0 color-mix(in srgb, var(--silbergrau) 35%, var(--anthrazit)), 0 4px 0 rgba(7,9,10,.95), 30px 40px 8px -2px rgba(7,9,10,.8), 3px 5px 5px rgba(7,9,10,.9), 0 26px 44px -18px rgba(7,9,10,.9); }
  .ez-geraet__glanz { background: linear-gradient(118deg, rgba(255,255,255,.16), rgba(255,255,255,.04) 34%, transparent 46%), radial-gradient(70% 46% at 100% 100%, color-mix(in srgb, var(--firma) 26%, transparent), transparent 62%); }
}
```

Warum: In Vorlage 08 ist das Violett eine Lampe, und Kante, Bildschirm und Boden reagieren darauf; in Vorlage 09 macht erst das Metallband mit dem harten Wurf das Telefon zum Körper auf dem Beton. Ein Gerät, das in seinem eigenen Licht liegt und dessen Schatten davon warm gefüllt wird, ist teurer als ein Gerät, das nur beleuchtet wird. Die Flanke folgt der Drehung des Geräts mit (box-shadow liegt im gedrehten Raum), also sitzt sie an der dem Betrachter zugewandten Unterkante.

## Hebel 2 · Die schwarzen Innenkarten liegen auf der Karte, nicht darin (Vorlage 07, 08) · Wirkung hoch

Vorher: `.ez-stand` (Fortschritt im Dashboard) und `.ez-kontakt__held` (Telefon) sind flaches `var(--schwarz)` mit einer Lichtkante von .08 und ohne Schatten; auf dem tonalen Anthrazit der Karte lesen sie sich als Loch, nicht als Karte. Die Kapseln sind flache Flächen, die Schraffur ohne Grund. In der Kontaktkarte endet das Gold oberhalb der Innenkarte, berührt sie also nicht. Nachher: die Innenkarte bekommt einen leichten tonalen Hub oben, eine Lichtkante aus der Lichtrichtung der Karte (Route: links oben weiß; Kontakt: rechts oben Gold), einen Schatten auf die Karte darunter und eine schmale Lichtkante unter sich; in der Kontaktkarte rückt das Gold so tief, dass die Innenkarte in das Leuchten schneidet, und ihre Oberkante fängt es rechts. Die Kapseln bekommen Oberfläche wie in Vorlage 02 (Verlauf, Unterkante), die laufende ihr Gold mit Glanz.

```css
.ez-stand, .ez-kontakt__held { position: relative; background: radial-gradient(140% 90% at 50% -10%, color-mix(in srgb, var(--anthrazit) 55%, var(--schwarz)), var(--schwarz) 60%); box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset 1px 0 0 rgba(255,255,255,.06), inset 0 0 0 1px rgba(255,255,255,.05), inset 0 -1px 0 rgba(7,9,10,.9), 0 1px 0 rgba(255,255,255,.05), 0 18px 32px -18px rgba(0,0,0,.95), 0 2px 4px rgba(0,0,0,.5); }
.ez-kontakt__schein { background: radial-gradient(54% 60% at 90% 16%, var(--firma-kern), var(--firma-licht) 7%, color-mix(in srgb, var(--firma) 58%, transparent) 26%, color-mix(in srgb, var(--firma-tief) 60%, transparent) 48%, transparent 70%); }
.ez-kontakt__held::before { content: ""; position: absolute; left: 30%; right: 0; top: 0; height: 1px; border-radius: inherit; pointer-events: none; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--firma-licht) 75%, transparent)); }
.ez-kapseln i { background: var(--ez-schraffur), color-mix(in srgb, var(--anthrazit) 55%, var(--schwarz)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--silbergrau) 40%, transparent), inset 0 1px 0 rgba(255,255,255,.06); }
.ez-kapseln i.voll { background: linear-gradient(180deg, var(--weiss), color-mix(in srgb, var(--silbergrau) 38%, var(--weiss))); box-shadow: inset 0 -1px 0 rgba(7,9,10,.3), 0 1px 2px rgba(0,0,0,.6); }
.ez-kapseln i.ist { background: linear-gradient(180deg, var(--firma-licht), var(--firma) 65%); box-shadow: 0 0 0 3px var(--firma-tief), inset 0 1px 0 rgba(255,255,255,.4), 0 1px 2px rgba(0,0,0,.6); }
```

Warum: Vorlage 07 ist genau dieser Aufbau (Verlaufskarte, schwarze Innenkarte mit Balance und weißem Rundknopf), und sie wirkt, weil die Innenkarte als Objekt auf dem Licht liegt: Kante, Schatten, das Leuchten läuft hinter ihr weiter. Auf der Signature-Seite sind die beiden Innenkarten die Stellen, an denen der Fensterbauer den Unterschied zu Plus sieht (Dashboard, Nummer als Held); sie müssen die wertvollsten Objekte der Seite sein, nicht die flachsten.

## Hebel 3 · Das Rendering bricht aus der Konfigurator-Kachel (Vorlage 03) · Wirkung mittel bis hoch

Vorher: am Telefon steht das Fenster mit `bottom: -2%` praktisch auf der Kachelkante, am Schreibtisch mit `-10%` knapp darunter, rechts bleibt es mit 3 bzw. 5 % innen; der Lichtsaum oben ist weiß, obwohl das Gold von unten kommt; die Kontaktellipse (.75) liegt unter dem Fenster, aber der Schein (84 % / 86 %) ist eine Wolke hinter ihm, kein Teich unter ihm. Nur im Muster-Zustand (Fensterbauer) bricht es wirklich aus (`right: -18%`), der Kunde sieht das nie. Nachher: der Schein wird zum Lichtteich am unteren Rand, auf dem das Fenster steht, das Fenster bricht rechts und unten aus der Kachel (auf der hellen Szene 2 steht der Anthrazit-Rahmen dann vor der Kante auf Weiß), der Saum unten nimmt das Gold, der Wurf folgt dem Licht von links oben.

```css
.ez-planen__schein { background: radial-gradient(48% 42% at 80% 102%, var(--firma-kern), var(--firma-licht) 7%, color-mix(in srgb, var(--firma) 62%, transparent) 26%, color-mix(in srgb, var(--firma-tief) 66%, transparent) 48%, transparent 70%); }
.ez-planen__bild { right: -2%; bottom: -7%; width: 50%; filter: drop-shadow(0 -1px 0 rgba(255,255,255,.22)) drop-shadow(0 1px 0 color-mix(in srgb, var(--firma-licht) 60%, transparent)) drop-shadow(3px 6px 4px rgba(7,9,10,.6)) drop-shadow(0 18px 18px rgba(7,9,10,.3)); }
.ez-planen::after { right: 2%; bottom: 2%; width: 48%; height: 7%; background: radial-gradient(closest-side, rgba(7,9,10,.8), transparent); }
@media (min-width: 760px) { .ez-planen__bild { right: 2%; bottom: -16%; width: 25%; } .ez-planen::after { right: 5%; bottom: 3%; width: 25%; } }
```

Warum: In Vorlage 03 entsteht die Tiefe allein dadurch, dass die Kachelkante durch die Figur läuft; die Karte wird zur Bühne, die Figur zum Objekt davor. Die Kachel ist das erste Bild nach dem Hero und am Schreibtisch 1200 px breit; dort trägt dieser eine Schnitt mehr als jede weitere Lichtkante. Die Ellipse bleibt in der Kachel (auf dem Gold), damit auf dem Weiß darunter kein dunkler Fleck liegt; die Füße tragen ihren Wurf über `drop-shadow`.

## Hebel 4 · Leuchten mit Kern und Körnung: 5-Minuten-Kachel und Kontakt (Vorlage 10, 12) · Wirkung mittel

Vorher: `.ez .dna-leucht::before` ist 60 % × 70 % der Kachel groß und fällt von `--firma-kern` über fünf Stufen weich ab; am Schreibtisch ist das rechte Drittel der 5-Minuten-Kachel eine leere goldene Wolke, die Kontaktkarte oben rechts ebenso. Das Licht hat keine Oberfläche; es sieht aus wie ein Weichzeichner, obwohl es keiner ist. Nachher: der Kern wird enger und heißer (Vorlage 10: das Licht sitzt dicht, die Zahl bleibt der Held), und über dem Leuchten liegt ein Punktraster, das mit dem Licht ausläuft (Vorlage 12; die beste Kachel der Startseite, 65,14 €, hat es schon). Gleiche Regel für den Kontakt-Schein, dessen Mitte Hebel 2 nach 90 % / 16 % setzt.

```css
.ez-zeit.dna-leucht { --glut-x: 90%; --glut-y: 2%; }
.ez .ez-zeit.dna-leucht::before { background: radial-gradient(36% 48% at var(--glut-x) var(--glut-y), var(--firma-kern), var(--firma-licht) 6%, color-mix(in srgb, var(--firma) 62%, transparent) 22%, color-mix(in srgb, var(--firma-tief) 58%, transparent) 44%, transparent 66%); }
.ez .ez-zeit.dna-leucht::after, .ez-kontakt__schein::after { content: ""; position: absolute; inset: 0; z-index: -1; filter: none; pointer-events: none; background: radial-gradient(circle, rgba(255,255,255,.14) .7px, transparent 1.3px) 0 0 / 9px 9px; -webkit-mask: radial-gradient(44% 56% at var(--glut-x, 90%) var(--glut-y, 16%), #000 8%, transparent 72%); mask: radial-gradient(44% 56% at var(--glut-x, 90%) var(--glut-y, 16%), #000 8%, transparent 72%); }
```

(`.ez .ez-zeit.dna-leucht::after` schlägt die DNA-Regel `.ez .dna-leucht::after { content: none }` über die Spezifität; das Raster ist keine zweite Leuchtebene, sondern die Oberfläche der ersten. Die Zahl 5 und die Stationen bleiben unverändert, sie sind richtig.)

Warum: Vorlage 10 und 12 leuchten nicht weicher, sondern dichter: ein heißer Kern, kurzer Abfall, und das Licht hat Korn, als läge es hinter einer gelochten Fläche. Erst das macht aus Farbe Material; eine große weiche Wolke liest sich dagegen als Hintergrundbild.

## Hebel 5 · Das Link-Etikett wird Glas, das zeigt, was dahinter liegt (Vorlage 01, 02) · Wirkung mittel

Vorher: `.ez-link-etikett` ist `rgba(32,32,34,.72)` mit `blur(12px)`; über dem schwarzen Boden ist das deckend, nur über der weißen App-Karte des Geräts schimmert etwas durch. Es liest sich als dunkle Pille mit Rand, nicht als Glas. Die Scheibe mit dem Goldpunkt ist flaches Anthrazit. Nachher: das Glas wird nach unten dichter (Vorlage 02: Chips oben offen, unten dunkel), lässt mit Sättigung durch, was darunter liegt (Gerätekante, Gold der App, Beton), die Bruchkante wird stärker, der Wurf tiefer; die Scheibe wird ein kleiner Körper. Dasselbe Rezept für das Domain-Etikett (`.ez-adresse .dna-etikett`), damit beide Gläser eine Sorte sind.

```css
.ez-link-etikett, .ez-adresse .dna-etikett { background: linear-gradient(180deg, rgba(32,32,34,.46), rgba(7,9,10,.64)); -webkit-backdrop-filter: blur(14px) saturate(160%); backdrop-filter: blur(14px) saturate(160%); border-color: rgba(255,255,255,.22); box-shadow: inset 0 1px 0 rgba(255,255,255,.34), inset 0 0 0 1px rgba(255,255,255,.06), inset 0 -1px 0 rgba(7,9,10,.55), 0 14px 30px -12px rgba(0,0,0,.75), 0 1px 2px rgba(0,0,0,.4); }
.ez-link-etikett__punkt { background: radial-gradient(circle at 50% 30%, #3a3b40, var(--anthrazit) 70%); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 0 0 1px rgba(7,9,10,.5); }
```

Warum: In Vorlage 01 und 02 lebt das Glas davon, dass das Foto darunter weiterläuft; die Karte „80 gr“ ist nur deshalb exklusiv, weil man die Schale und das Tuch durch sie sieht. Das Link-Etikett ist im Einladungszustand das Signature-Objekt im Hero (Name des Kunden, Nummer aus dem Dashboard); als Glas über Gerät und Beton zeigt es, dass die Seite Material kennt, als Pille nur, dass sie Ränder kennt.

## Die drei, die am meisten bringen

1. Hebel 1, Gerät: Schein unter die Ecke des Geräts, goldene Kanten und Spiegelung, Flanke von 3 px.
2. Hebel 2, Innenkarten: Hub, Lichtkante, Schatten; der Kontakt-Schein schneidet in die Telefonkarte, die Kapseln bekommen Oberfläche.
3. Hebel 3, Konfigurator-Kachel: Lichtteich unten, Fenster bricht rechts und unten aus, Saum in Gold.

# Abgleich Material und Licht (Jonas Veit): Seite für Fensterbauer

**Gesamteindruck.** Die Untergrenze der Startseite ist da (tonale Karten mit Lichtkante, Glas mit Bruchkante an allen Etiketten, Metallkante und Spiegelung am Gerät, Leuchten radial ohne Weichzeichner, Blatt mit Kante und Schatten auf dunklem Grund), aber an fünf Stellen bleibt die Seite hinter den Vorlagen zurück, weil das Licht keine gemeinsame Geschichte erzählt: Das Violett leuchtet, doch nichts am Gerät zeigt, dass es leuchtet; Schatten fallen senkrecht, obwohl jede Karte von links oben belichtet ist; die zwei weißen Paketkarten und die weißen Bildfelder in den Stufen sind flache Rechtecke, auf denen Fenster und Aufmaßblatt schweben.

Geprüft: detail-geraet, detail-weg, detail-stufen, detail-blatt, detail-pakete, detail-pakete-2, zustand-ruhe sowie desk-01/02/05/06/13/14 und tel-01/06/07/10/11 gegen `start.css`, `dna/tokens.css` und die Bausteine in `dna/bundle.css`. Alle Werte bleiben in der Palette (Tonwerte der acht Farben, Mischungen per `color-mix`), Leuchten radial, kein `filter: blur` auf Flächen.

## Was schon stimmt (nicht anfassen)

- Etiketten und Glaskarte (Vorlage 01, 02, 04): Bruchkante (Rand .18, oben .28 hell, unten .4 dunkel), liegen über Foto, Objekt oder Leuchten. Gut.
- Blatt auf dunkler Karte (Vorlage 11): Kante aus Silbergrau, tiefer Schatten, 3° Drehung; Ankerpunkte weiße Scheibe mit schwarzem Ring. Gut.
- Leuchtkachel 65,14 € (Vorlage 10, 12): Punktraster über dem Leuchten, Zahl in 250 mit Einheit 15 px, Indigo unten links als Gegenlicht; die beste Kachel der Seite. Schönheitsfehler: Das Label „Preisatlas Handwerk 2024“ sitzt in der hellsten Stelle der Quelle; `--glut-x: 100%; --glut-y: 4%`, dann bleibt das Label im Schatten.
- Gerät: Metallkante und Spiegelung sind umgesetzt. Was fehlt, steht in Hebel 1.

## Hebel 1 · Hero: ein Licht, eine Quelle (Vorlage 08, 09) · Wirkung hoch

Vorher: das Violett ist eine eigene Fläche rechts oben, das Gerät trägt rundum eine weiße Metallkante, der Schirm spiegelt weiß von links oben, der Schatten (0 px seitlich) verschwindet auf #1c1c1e, der Lichtteich liegt hinter der deckenden Karte. Nachher: die rechte Kante des Geräts nimmt die Farbe der Quelle, der Schirm spiegelt das Violett von rechts, der Schatten fällt nach rechts unten (Hauptlicht links oben, das Violett ist Gegenlicht) und die Karte steht in einem sichtbaren Lichtteich:

```css
.ez-geraet.dna-geraet { box-shadow: inset -1.5px 0 0 color-mix(in srgb, var(--violett) 70%, transparent), inset 0 0 0 1px rgba(255,255,255,.22), inset 0 0 0 2.5px rgba(7,9,10,.7), 0 1px 0 rgba(255,255,255,.3), 14px 40px 70px -24px rgba(0,0,0,.85), 5px 12px 28px -12px rgba(0,0,0,.6); }
.ez-geraet .dna-geraet__schirm::after { background: radial-gradient(70% 55% at 100% 16%, color-mix(in srgb, var(--violett) 26%, transparent), transparent 62%), radial-gradient(90% 60% at 18% 0%, rgba(255,255,255,.06), transparent 60%); }
.ez-hero__buehne::before { inset: -30% -24% -34%; background: radial-gradient(50% 42% at 64% 70%, #1d1e21, transparent 72%); }
```

Warum: In Vorlage 08 ist das Violett eine Lampe hinter dem Gerät: Kante, Schirm und Boden reagieren. Vorlage 09: erst der schräge Schlagschatten setzt das Handy auf den Beton.

## Hebel 2 · Paketkarten als Objekte (Vorlage 06, 07) · Wirkung hoch

Vorher sind Essential und Signature flache weiße Rechtecke mit 1-px-Ring, während das Formular Ring und Schwebeschatten hat. Fehler: Für die Innenkarte der Plus-Karte stehen zwei Regeln mit gleichem Selektor; die spätere löscht tiefen Schatten und Ring der ersten. Nachher:

```css
.ez-paket { background: linear-gradient(180deg, var(--weiss) 55%, color-mix(in srgb, var(--silbergrau) 9%, var(--weiss))); box-shadow: var(--kachel-rand), var(--schatten-schwebe); }
.ez-paket--leucht .ez-paket__bild { box-shadow: var(--schatten-tief), inset 0 1px 0 rgba(255,255,255,.18), inset 0 0 0 1px rgba(255,255,255,.10), inset 0 -1px 0 rgba(255,255,255,.12); }
```

Warum: Vorlage 06 lebt davon, dass auch helle Kacheln einen tonalen Abfall haben; Vorlage 07 ist unser Plus-Aufbau, dort sitzt die Innenkarte mit Kante und Schatten auf dem Verlauf.

## Hebel 3 · Objekte auf Weiß bekommen Boden (Vorlage 01, 03) · Wirkung mittel bis hoch

Vorher: Bildfeld flaches Weiß, das Fenster schwebt ohne Kontaktschatten, das Aufmaßblatt in Stufe 4 ist Weiß auf Weiß ohne Kante. Die Startseite hatte den Kontaktschatten; das ist unter der Untergrenze. Nachher:

```css
.ez-stufe__bild--hell { background: radial-gradient(90% 70% at 50% 0%, var(--weiss), color-mix(in srgb, var(--silbergrau) 14%, var(--weiss))); }
.ez-stufe__bild--hell > img { position: relative; z-index: 1; }
.ez-stufe__bild--hell::after { content: ""; position: absolute; left: 16%; right: 16%; bottom: 7%; height: 10%; border-radius: 50%; background: radial-gradient(closest-side, rgba(7,9,10,.22), transparent); z-index: 0; }
.ez-stufe__bild .dna-anker { z-index: 2; }
#stufe-4 .ez-stufe__bild--hell > img { filter: drop-shadow(0 0 1px var(--silbergrau)) drop-shadow(0 14px 22px rgba(7,9,10,.18)); }
```

(Das Modell spiegelt weiter Himmelblau, außerhalb der Palette; wie bei der Startseite eine Bild-, keine CSS-Frage.)

## Hebel 4 · Eine Lichtrichtung für Schatten und Kanten (Vorlage 03, 09) · Wirkung mittel

Vorher fallen alle Schatten senkrecht, obwohl jede dunkle Karte von links oben belichtet ist; die dunklen Mini-Browser tragen einen gleichmäßigen Ring statt einer Lichtkante oben. Nachher:

```css
.ez-blatt > img { box-shadow: 16px 48px 80px -28px rgba(0,0,0,.9), 6px 16px 32px -16px rgba(0,0,0,.7), 0 0 0 1px var(--silbergrau); }
.ez-weg__konf { box-shadow: 14px 44px 80px -28px rgba(7,9,10,.55), 4px 14px 30px -14px rgba(7,9,10,.35), inset 0 1px 0 rgba(255,255,255,.18), inset 0 0 0 1px rgba(255,255,255,.08); }
.ez-mini--dunkel { box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.07); }
.ez-stufe__bild--knopf .ez-mini--knopf { box-shadow: 14px 40px 70px -26px rgba(0,0,0,.9), 4px 12px 28px -14px rgba(0,0,0,.7); }
```

## Hebel 5 · Stufe 3: das Leuchten bekommt eine Quelle, das Glas eine Kante daraus (Vorlage 02, 04) · Wirkung mittel

Vorher sitzt die violette Scheibe mittig hinter der Glaskarte, die hellste Stelle ist verdeckt, das Licht hat keine Richtung. Nachher kommt das Licht aus der Ecke, aus der auf der ganzen Seite das Violett kommt, mit Indigo als Gegenlicht unten links, und die Glaskante fängt es rechts:

```css
.ez-stufe__bild--gesendet::before { background: radial-gradient(64% 70% at 78% 18%, var(--violett) 6%, color-mix(in srgb, var(--violett) 55%, transparent) 38%, transparent 74%), radial-gradient(40% 36% at 8% 104%, color-mix(in srgb, var(--indigo) 70%, transparent), transparent 70%); }
.ez-glaskarte { box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset -1px 0 0 color-mix(in srgb, var(--violett) 45%, transparent), inset 0 -1px 0 rgba(7,9,10,.4), 14px 32px 60px -22px rgba(0,0,0,.7); }
```

## Die drei, die am meisten bringen

1. Hebel 1, Hero: violetter Saum und Spiegelung am Gerät, Schatten nach rechts unten auf das Leuchten, sichtbarer Lichtteich.
2. Hebel 2, Pakete: Schwebeschatten und tonaler Abfall auf den weißen Karten, Kante und Schatten der Plus-Innenkarte zurück.
3. Hebel 3, Objekte auf Weiß: Kontaktschatten unter dem Fenstermodell, Kante und Schatten am Aufmaßblatt in Stufe 4.

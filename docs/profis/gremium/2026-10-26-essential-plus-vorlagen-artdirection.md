# Landingpage Y (Essential Plus) gegen die Vorlagen des Inhabers – Art Direction, Perspektive „Material und Licht“

Datum: 26.10.2026 · Gegenstand: Y (Fensterbau Brandt, Gold #d8ad55), Telefon 390 × 844 und Schreibtisch 1280 × 800, Quelle docs/profis/essential-plus-vorschau/start.css · Vorlagen: docs/profis/vorlagen/2026-10-26/01–12 (Prinzip übernehmen, nie das Motiv) · Maßstab: G14 „Keine Fläche ist flach“ und G15 in Werten (design-dna-eeziframes, Abschnitt 3).

## 1. Befund in acht Zeilen

- **Gerät auf Beton (Vorlage 9, 8):** Die Idee stimmt, das Material auch (Beton mit Fensterkreuz, Lichtkante und Vignette auf der Bühne). Aber das Telefon ist gestaucht (`scale(1, .81)`), nicht gekippt: es liegt wie ein Aufkleber auf dem Boden, hat keine sichtbare Dicke und keine Kante, die das Licht fängt. In Vorlage 9 sieht man den Rahmen als Metallband mit hartem Schlagschatten, in Vorlage 8 fängt die Gerätekante das violette Licht als Saum.
- **Leuchten als Zustand (Vorlage 8, 7):** Der Gold-Schein auf der Bühne ist 104 % breit und liegt als Sepia-Wash über der rechten Bildhälfte; der Beton wird braun statt grau. Er kommt nicht erkennbar vom Gerät. Dasselbe Rezept (Kern `#e2bb66`, 42 % bei 34 %, Gegen-Ecke `#5b4a26`) sitzt in Zeit-Kachel, Kontaktkarte, Senden-Kachel, Planen-Kachel und auf allen sechs Fotoplätzen – Gold ist überall und damit nirgends ein Zustand. Die Gegen-Ecke in `--firma-tief` wirkt auf Anthrazit als brauner Fleck (Zeit-Kachel unten links, Kontaktkarte unten links).
- **Lichtkanten:** Die Kacheln haben die 1-px-Kante (`inset 0 1px 0 rgba(255,255,255,.10)`), aber auf den Fotoplätzen liegt sie **unter** der Textur: `.ez-foto__grund` ist ein Kind mit `z-index:-1` im isolierten Kontext und malt über den inset-Schatten des Elements. Die Fotoplätze sind damit die einzigen Flächen der Seite ohne Kante.
- **Spiegelung:** Der Glanz auf dem Schirm (`.ez-geraet__glanz`, 16 % → 4 %) ist ein weicher Schleier, kein Reflex. Vorlagen 1/2 zeigen am Rahmen einen scharfen Chrome-Streifen, der Schirm spiegelt das Fenster hart (das Fensterkreuz über dem Gerät in Y ist dagegen gut gelöst und bleibt).
- **Kontaktschatten:** Auf Weiß vorhanden (Fenster in der Bereit-Karte) und richtig. Dem Rendering, das aus der Planen-Kachel ragt, fehlt er: ein einziger `drop-shadow(0 18px 24px .7)` wird auf der weißen Seite zum grauen Schmierfleck und in der Kachel zu wenig Kontakt.
- **Glas über Foto (Vorlage 1, 2):** Chips „Foto n von 6“, Domain-Etikett, Muster-Chips – Bruchkante, 12 px Unschärfe, richtig gesetzt. Kein Handlungsbedarf.
- **Objekt bricht aus dem Rahmen (Vorlage 3, 1):** Am Telefon bricht das Fenster nach rechts aus dem Bildschirm, am Schreibtisch wird es bei etwa 1232 px von der Hüllenkante hart abgeschnitten (desk-03): der Ausbruch endet an einer geraden Kante, das Gegenteil von G12.
- **Fotoplätze:** Sechsmal derselbe Beton-Ausschnitt, sechsmal dieselbe Gold-Ecke, sechsmal dieselbe Schraffur: Sie lesen sich als sechs Kacheln mit Tapete, nicht als sechs gestaltete Plätze. Details in Abschnitt 2.

Untergrenze (Startseite 26.10.) ist in Typografie, Pillen und Szenenwechsel gehalten; in Material und Licht liegt Y darunter, weil die Bühne und das Bento die Hälfte der ersten zwei Bildschirme sind.

## 2. Die drei Sonderfragen

### Die sechs Fotoplätze: gestaltete Plätze oder leere Kacheln?

Heute leere Kacheln, aus drei Gründen: (1) dieselbe Textur sechsmal, jedes Mal in anderer Vergrößerung und ohne Bezug zur Nachbarkachel; (2) dieselbe Gold-Ecke oben rechts auf allen sechs, dazu die Gold-Ecke der Planen-Kachel – das Bento ist ein brauner Block; (3) die Schraffur ist eine Fläche über der halben Kachel, keine Form. In den Vorlagen ist Schraffur immer **eine begrenzte Form** auf dem Material: die schraffierte Kapsel als Platzhalter (Vorlage 7, 8), die schraffierten Stufen mit Kontur im Diagramm (Vorlage 10), der schraffierte Plus-Kreis (Vorlage 7).

In der Hand der Vorlagen, ohne ein Foto zu erfinden:

- **Eine Fläche, ein Licht.** Das Bento ist ein Betonboden, den die Fugen zerschneiden (Vorlage 5 und 12: ein Raster hinter allem). Die sechs `__grund` zeigen einen einzigen Ausschnitt des Bühnenfotos, jeder Platz sein Stück davon, mit `background-size` in Bento-Breite und `background-position` aus Spalte und Zeile. Das Fensterkreuz läuft dann als ein Lichtstrahl über zwei, drei Plätze hinweg – das Auge erkennt ein Material statt sechs Tapeten.
- **Kein Gold auf den Plätzen.** Die Gold-Ecke geht weg; Gold hat im Bento nur die Planen-Kachel (Vorlage 7: eine Honig-Karte neben schwarzen Karten; Vorlage 12: eine Magenta-Kachel). Die Plätze bekommen stattdessen Lichtkante oben und Vignette unten **über** der Textur.
- **Schraffur als Form.** Ein Band von 34 % Höhe mit gestrichelter Oberkante und einem 1-px-Lichtsaum, Schraffur bei 22 % – ein „Rest“, den man ablesen kann (Vorlage 10), nicht ein Schleier.
- **Beschriftung in drei Ebenen.** Glas-Chip oben links (bleibt, er sitzt über Material), unten der Titel 18/600 und darunter „Foto folgt — vom Betrieb“ 12/400 mit 0,03 em als „Beschriftung — Wert“ (Vorlage 6: „Owned by — Name“).
- **Ein Platz trägt den Lichtfleck.** Nur der große Platz (Werkstatt) bekommt das volle Fensterkreuz; die vier kleinen liegen im Halbschatten (Textur-Deckung 0,36 statt 0,55), Platz 6 (breit) im Streiflicht. Drei Helligkeiten statt einer.

### Das Rendering, das aus der Kachel ragt (G12): Schatten, Kante, Licht

Vorlage 3 (Pikachu) und Vorlage 1 (Schale) machen dreierlei: Das Objekt hat **einen hellen Saum** an der Oberkante (es ist beleuchtet, nicht ausgeschnitten), **einen engen Kontaktschatten** dort, wo es die Karte berührt, und **das Leuchten liegt hinter dem Objekt**, nicht neben ihm. In Y: kein Saum, ein weiter weicher Schatten für beides (Kachel und weiße Seite), Schein unten rechts neben dem Fenster statt dahinter, und am Schreibtisch das harte Clip. Lösung in Hebel 4.

### Gold als Leuchten (Vorlage 7/8, Orange-Honig): Kern, Rand, Intensität

In Vorlage 7 und 8 ist der Kern des Lichts **heller als die Farbe** (Pfirsich bis fast Weiß), die Farbe selbst ist der Mittelton, und der Rand fällt in einen tiefen, sauberen Ton, bevor er auf Schwarz endet – es gibt keinen braunen Fleck an der Gegenseite. In Y ist der Kern die Firmenfarbe selbst (`#e2bb66`, Sättigung ohne Helligkeit), der Verlauf endet in `#5b4a26` und hat zusätzlich die Gegen-Ecke in `#5b4a26`: Mitte gelblich, Rand braun, Gegen-Ecke braun. Deshalb wirkt das Gold dumpf und das Licht „aus“. Rezept: Kern `color-mix(in srgb, #d8ad55 45%, #fff)` = `#eddab3` auf 0–8 %, dann `#e2bb66` bei 12 %, Firmenfarbe bei 55 % Deckung bei 30 %, `--firma-tief` bei 60 % Deckung bei 50 %, aus bei 70 %; die Gegen-Ecke entfällt. Ein Leuchten je Bildschirm, nicht fünf.

## 3. Fünf Hebel nach Wirkung

### Hebel 1 – Bühne: das Licht kommt vom Gerät, das Gerät ist ein Körper

- **Wo:** `.ez-buehne__schein`, `.ez-geraet`, `.ez-geraet__glanz`, neu `.ez-geraet::before`.
- **Was:** Den Sepia-Wash durch einen engen Lichtteich unter dem Gerät ersetzen, dem Telefon Dicke, Metallkante, Chrome-Reflex und zwei Schatten (hart nah, weich lang) geben; die dem Licht zugewandte Kante fängt das Gold als Saum.
- **Wie:**
  ```css
  .ez-buehne__schein { left: var(--sx); top: 66%; width: 72%; height: 64%; mix-blend-mode: screen;
    background: radial-gradient(50% 50% at 50% 50%, #eddab3, #e2bb66 8%, color-mix(in srgb, var(--firma) 48%, transparent) 26%, color-mix(in srgb, var(--firma-tief) 55%, transparent) 46%, transparent 68%); }
  .ez-geraet { background: linear-gradient(145deg, #5a5b61, #0b0b0c 30%, #1d1e21 68%, #3a3b40);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.26), inset 0 0 0 2.5px rgba(7,9,10,.7),
      inset 1.5px 1.5px 0 rgba(255,255,255,.5),                                 /* Chrome oben links */
      inset -1.5px -1.5px 0 color-mix(in srgb, var(--firma) 45%, transparent),  /* Goldsaum zum Licht */
      2px 3px 0 rgba(7,9,10,.95),                                               /* Kontakt, hart */
      26px 44px 30px -8px rgba(7,9,10,.72);                                     /* Wurf, weich, in Lichtrichtung */ }
  .ez-geraet::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; translate: 3px 5px;
    background: linear-gradient(145deg, #4a4b50, #141517 40%, #26272b); }      /* Dicke des Rahmens */
  .ez-geraet__glanz { background: linear-gradient(118deg, rgba(255,255,255,.24) 0 11%, rgba(255,255,255,.05) 12% 34%, transparent 46%); }
  ```
  Nach oben offen: `transform: perspective(1400px) rotateX(36deg) rotateZ(-20deg)` statt `scale(1, .81)` – dann müssen `--k1/--k2`, `--px/--py` und `--ex/--ey` neu gemessen werden (start.js), deshalb als zweiter Schritt.
- **Warum:** Vorlage 9 (Metallband, harter Schlagschatten, Beton bleibt grau), Vorlage 8 (Lichtkern hinter dem Gerät, Kante fängt das Licht), Vorlage 1/2 (Chrome-Streifen am Rahmen). Der Hero ist der erste Bildschirm am Telefon und am Schreibtisch; hier entscheidet sich „exklusiv“.

### Hebel 2 – Fotoplätze: eine Fläche, ein Licht, kein Gold

- **Wo:** `.ez-foto__grund`, `.ez-foto::before`, neu `.ez-foto::after`, `.ez-foto__schraffur`, `.ez-foto__text span`, je Platz `--bx/--by`.
- **Was:** Sechs Ausschnitte eines Bodens statt sechs Tapeten; Lichtkante und Vignette über die Textur; Gold raus; Schraffur als begrenztes Band; drei Helligkeiten.
- **Wie:**
  ```css
  .ez-bento { --sp: calc((100% - 3 * 12px) / 4); }                              /* Spaltenbreite am Schreibtisch; am Telefon 2 Spalten */
  .ez-foto__grund { background: url(bilder/buehne.webp) var(--bx, 0) var(--by, 0) / var(--bento-breite, 1104px) auto no-repeat;
    opacity: var(--td, .36); mix-blend-mode: screen; }
  .ez-foto--gross { --td: .55; }  .ez-foto--breit { --td: .44; }               /* drei Helligkeiten */
  .ez-foto[data-foto="3"] { --bx: calc(-2 * (var(--sp) + 12px)); --by: 0; }
  .ez-foto[data-foto="4"] { --bx: calc(-2 * (var(--sp) + 12px)); --by: -212px; }
  .ez-foto[data-foto="5"] { --bx: 0; --by: -424px; }
  .ez-foto[data-foto="6"] { --bx: calc(-1 * (var(--sp) + 12px)); --by: -424px; }
  .ez-foto::before { background: none; }                                        /* Gold-Ecke weg */
  .ez-foto::after { content: ""; position: absolute; inset: 0; z-index: 3; border-radius: inherit; pointer-events: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.06), inset 0 -70px 90px -50px rgba(7,9,10,.72); }
  .ez-foto__schraffur { height: 34%; opacity: .22; mask: none;
    border-top: 1px dashed color-mix(in srgb, var(--silbergrau) 55%, transparent); box-shadow: inset 0 1px 0 rgba(255,255,255,.07); }
  .ez-foto__text span { color: var(--silbergrau); }                             /* „Foto folgt — vom Betrieb“ als Beschriftung — Wert */
  ```
  Die Textur hat `--bento-breite` als Bezug; `--by` aus Zeile × (200 px + 12 px), am Telefon aus 150 px + 12 px. Pflicht: `.ez-foto` verliert dadurch nicht den `--ez-kachel`-Grund, er bleibt als Material unter der Textur.
- **Warum:** Vorlage 5 und 12 (ein Raster, eine Fläche hinter allen Karten), Vorlage 7 (eine Farbkarte neben schwarzen), Vorlage 10 (Schraffur mit Kontur als ablesbarer Rest), G14 (Lichtkante sichtbar, nicht unter der Textur). Das Bento ist der zweite Bildschirm und gleichzeitig das Paket-Argument „bis zu 6 Fotos“; es muss wie ein Ort wirken, bevor die Fotos da sind.

### Hebel 3 – Gold als Licht: heller Kern, sauberer Rand, ein Leuchten je Bildschirm

- **Wo:** `.ez` (Token), `.ez .dna-leucht::before`, `.ez-kontakt__schein`, `.ez-senden__schein`, `.ez-planen__schein`, `.ez-route__stelle--ziel::before`.
- **Was:** Ein Rezept mit Kern über der Firmenfarbe, Mittelton Firmenfarbe, tiefem Rand, ohne Gegen-Ecke; Intensität gestaffelt: Zeit-Kachel und Kontaktkarte voll, Senden und Route halb, Planen hinter dem Objekt.
- **Wie:**
  ```css
  .ez { --firma-kern: color-mix(in srgb, var(--firma) 45%, #fff); }            /* #eddab3 bei Gold */
  .ez .dna-leucht::before, .ez-kontakt__schein { background:
    radial-gradient(58% 62% at var(--glut-x, 88%) var(--glut-y, 6%), var(--firma-kern), var(--firma-licht) 10%,
      color-mix(in srgb, var(--firma) 55%, transparent) 30%, color-mix(in srgb, var(--firma-tief) 60%, transparent) 50%, transparent 70%); }
  .ez-senden__schein { background: radial-gradient(48% 48% at 50% 50%, var(--firma-kern), var(--firma-licht) 9%,
      color-mix(in srgb, var(--firma) 50%, transparent) 28%, transparent 62%); }                       /* halbe Reichweite */
  .ez-route__stelle--ziel::before { width: 200px; height: 140px; background: radial-gradient(50% 50% at 30% 50%,
      color-mix(in srgb, var(--firma-licht) 70%, transparent), color-mix(in srgb, var(--firma) 35%, transparent) 36%, transparent 68%); }
  ```
  Die zweite `radial-gradient(... var(--firma-tief) ...)` an der Gegen-Ecke in allen vier Selektoren entfällt. Messen: Gold bleibt bei 3–4 % der Seite, weil die Fläche kleiner, der Kern aber heller wird.
- **Warum:** Vorlage 7 (Honig-Karte: Kern fast Weiß, Mitte Orange, Rand sauber, schwarze Innenkarte als Gegengewicht statt brauner Ecke), Vorlage 8 (Lichtkern hinter dem Gerät, Abfall in tiefes Violett), Vorlage 12 (Magenta-Kachel mit hellem Kern). DNA-Regel 5: Leuchten radial mit Zwischenstufe; die Zwischenstufe fehlt in Y nach oben (zum Hellen), nicht nach unten.

### Hebel 4 – Rahmenbruch des Renderings: Saum, Kontaktschatten, Licht dahinter, kein Clip

- **Wo:** `.ez-planen__bild`, `.ez-planen__schein`, neu `.ez-planen::after`, die Szene 2 (das Clip an der Hüllenkante bei 1232 px, desk-03 – Ursache in der Vorhang-Szene oder Hülle prüfen).
- **Was:** Dem Fenster einen 1-px-Lichtsaum oben geben, den Schatten in Kontakt (hart, nah) und Wurf (weich, kurz) trennen, den Gold-Kern hinter das Fenster legen, den Ausbruch dorthin lenken, wo Platz ist (nach unten über die Fuge statt nach rechts aus der Seite).
- **Wie:**
  ```css
  .ez-planen__bild { filter: drop-shadow(0 -1px 0 rgba(255,255,255,.22))        /* Lichtsaum an der Oberkante der Silhouette */
                             drop-shadow(2px 4px 3px rgba(7,9,10,.55))          /* Kontakt */
                             drop-shadow(0 14px 14px rgba(7,9,10,.28)); }       /* kurzer Wurf, auf Weiß noch sauber */
  .ez-planen::after { content: ""; position: absolute; z-index: 0; right: 4%; bottom: 6%; width: 64%; height: 10%; border-radius: 50%;
    pointer-events: none; background: radial-gradient(closest-side, rgba(7,9,10,.85), transparent); }   /* Kontaktschatten in der Kachel */
  .ez-planen__schein { background: radial-gradient(46% 42% at 82% 84%, var(--firma-kern), var(--firma-licht) 10%,
    color-mix(in srgb, var(--firma) 50%, transparent) 30%, transparent 66%); }  /* Licht hinter dem Fenster */
  @media (min-width: 760px) { .ez-planen__bild { right: -8%; bottom: -16%; width: 104%; } }   /* ragt nach unten und wenig nach rechts */
  ```
  Am Telefon bleibt `right: -7%` (Ausbruch über den Bildschirmrand ist dort gewollt und sichtbar), `bottom: -12%`.
- **Warum:** Vorlage 3 (Pikachu: Lichtsaum, kein Schmierschatten, Karte bleibt lesbar), Vorlage 1 und 2 (Schale mit Kontaktschatten auf der Glaskarte, Pfeilkreis daneben), Vorlage 11 (Produkt bricht aus der Fläche mit hartem Kontakt), Vorlage 8 (Objekt vor dem Licht). G12 lebt von der Illusion, dass das Objekt vor der Kachel steht; eine gerade Schnittkante zerstört sie.

### Hebel 5 – Kontaktkarte und Zeit-Kachel: die schwarze Innenkarte trägt die Zahl

- **Wo:** `.ez-kontakt__daten .ez-kontakt__held`, `.ez-kontakt__wege`, `.ez-zeit .dna-zahl` (Umhüllung).
- **Was:** Der eine Wert (Telefonnummer; „5 Minuten“) sitzt auf einer schwarzen Innenkarte in der leuchtenden Kachel, mit rundem weißen Aktionsknopf (Anrufen) rechts darin; die drei Ring-Knöpfe bleiben darunter als Umriss.
- **Wie:**
  ```css
  .ez-kontakt__daten .ez-kontakt__held { grid-template-columns: minmax(0, 1fr) 44px; align-items: center; gap: 4px 12px;
    padding: 14px 14px 14px 16px; border-radius: 20px; background: var(--schwarz);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08), inset 0 0 0 1px rgba(255,255,255,.05); }
  .ez-kontakt__daten .ez-kontakt__held dd { font: 300 36px/1 var(--font-sans); letter-spacing: -.02em; color: var(--weiss); }
  .ez-kontakt__daten .ez-kontakt__held dt { color: var(--silbergrau); }
  .ez-kontakt__held .ez-rund--voll { grid-row: 1 / 3; width: 44px; height: 44px; background: var(--weiss); color: var(--schwarz);
    box-shadow: 0 8px 18px -8px rgba(7,9,10,.9); }                              /* weißer Rundknopf in der Innenkarte, Vorlage 7 */
  .ez-zeit .dna-zahl { padding: 12px 16px 10px; border-radius: 20px; background: var(--schwarz);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.08), inset 0 0 0 1px rgba(255,255,255,.05); }
  ```
  Die Regel „genau eine volle Pille je Bildschirm“ bleibt: Der Rundknopf ist Rundknopf (G13), keine Pille.
- **Warum:** Vorlage 7 (Innenkarte „Balance“ mit weißem Rundknopf in der Honig-Karte), Vorlage 8 (schwarze Innenkarten mit Werten in der Verlaufskarte), Vorlage 10 (Zahl 300 mit kleiner Einheit auf Schwarz mit Lichtkante), G8 „dunkle Innenkarte mit dem Wert“. Das Leuchten wird dadurch zur Oberfläche, die Zahl zum Objekt – Material in drei Ebenen statt Text auf Verlauf.

## 4. Nicht ändern

Fensterkreuz über dem Gerät (`.ez-geraet__licht`), Domain-Etikett als Glas mit Schloss, Glas-Chips mit Fortschrittsring, Kontaktschatten unter dem Fenster der Bereit-Karte, Elemente-Reihe auf Weiß mit `--kachel-rand`, Lichtkante auf Schritt-, Route- und Kontaktkachel, Schraffur als Bedeutung „noch nicht“.

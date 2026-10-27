# Vorlagen-Abgleich · Konfigurator Schritt 6 „Wünsche“ (27.10.2026)

Drei Perspektiven (Frontend und Leistung, Material und Licht, Typografie), je fünf Hebel nach Wirkung; ein Agent, gemessen an der laufenden Vorschau.

Ich habe keine Projektdateien geändert und keine git-Befehle benutzt. Skripte, Messdaten und Bilder liegen unter `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/wz-vorlagen/`.

**Zum Messstand.** Die Vorschau hat sich während meiner Arbeit geändert.
- **13:37–13:47:** gemessen am Vorschlag Y mit Standbildern, wie in den Blind-Bildern.
- **Ab 13:45:** die Bühne ist ein Bühnenfenster mit der echten App (app/buehne.html, Korrektur des Inhabers). Diesen Stand habe ich von 13:55 bis 13:58 nachgemessen.
- Im Live-Stand ist schon umgesetzt, deshalb steht es unten nicht mehr als Hebel:
  - Werkzeuge zurück (Zahnrad, −, +). In Y fehlten sie, das verstieß gegen „Funktionen bleiben“ und „Vergrößern immer möglich“.
  - Flügelmarkierung in Violett.
  - „Frage N von M“.
  - Gefragtes Wort weiß, der Rest grau.
  - Die Pille steht auf jeder Frage bei 774–826 px (`min-height: 100svh`).
  - „Weiß ich noch nicht“ klebt über dem Fuß.

Gemessen bei 390 × 844, Pixeldichte 3, CPU vierfach gedrosselt, wahlweise mit Slow 4G (150 ms, 1,6 Mbit/s).

---

## Frontend und Leistung

### 1. Die Bühne bleibt bei „Weiter“ stehen (größter sichtbarer Fehler, in beiden Ständen)
- **Was passiert:** `.ez-wz-kommt` liegt auf dem ganzen `.ez-wz-schritt[data-schritt="frage"]`, also auch auf `#wz-buehne` bzw. dem Bühnenfenster. Bei jedem Fragewechsel geht die Deckkraft der Bühne auf 0 und blendet wieder ein.
- **Wie oft und wie lange:**
  - Standbilder: 27 von 27 Wechseln, 155–201 ms gedimmt.
  - Live: 4 von 4 Wechseln, 216–235 ms gedimmt.
  - Im Trace ist die Bühne bei 106 ms fast schwarz (Helligkeit 8 statt 210 von 255). Beleg: `weiter-streifen.png`.
- **Doppelt eingeblendet:** `#wz-antwort` blendet zusätzlich in sich ein (Faktor t²).
- **Lange Aufgabe:** 74 ms bei vierfacher CPU, davon 7 Stilberechnungen und 4 Layouts, erzwungen durch `void antwort.offsetWidth`, `void ziel.offsetWidth`, `focus` und `scrollTo`.
- **Wie beheben:**
  - In `folgeSchritt` (und `frageZeigen`) nur `.ez-frage` und `#wz-antwort` animieren, und zwar so:
    `[schritte.frage.querySelector('.ez-frage'), antwort].forEach(el => el.animate([{opacity:0},{opacity:1}], {duration:220, easing:'cubic-bezier(.2,.7,.2,1)'}))`
  - Das Klassen-Neustarten mit `void offsetWidth` entfällt dann.
- **Gegenprobe (eingespritzt):** Die Bühnendeckkraft bleibt bei 6 von 6 Wechseln bei 1,00.
- **Vorlagen:** 11 (das Haus steht, Werte wechseln), 01 (das Foto steht, die Karte wechselt); dazu Brief Punkt 6.

### 2. Tipp in der Live-Fassung: erst den Zustand zeigen, dann die App, und nur die Unterschiede neu setzen
- **Kosten je Tipp:**
  - Lange Aufgabe von 110–192 ms, dazu 56–79 ms im Bühnenfenster (CSS-Modell).
  - Mit WebGL und Slow 4G: 111–143 ms.
- **Ursache:** Der Weg ist `B.bedien` → `liveNeu` → `antwortSetzen` → `antwort.innerHTML` neu, also alle Kacheln samt SVG. Ring und Licht erscheinen erst danach. Weil die Elemente neu sind, laufen die 220-ms-Übergänge des Lichts nicht.
- **Wie beheben:**
  - Im Klick-Handler zuerst `aria-pressed` setzen und `.ez-wz-zelle.ist-an` umschalten, dann `requestAnimationFrame(() => B.bedien(...))`.
  - In `antwortSetzen` einen Schlüssel aus Typ, Optionszahl und Labels je Block bilden (`antwort.dataset.schluessel`). Ist er gleich, nur Attribute aktualisieren (`aria-pressed`, `aria-checked`, `output`, `disabled`, `.ez-wz-jetzt`), nicht `innerHTML`.
- **Ziel:** Ring im nächsten Frame, Aufgabe unter 50 ms.
- **Vorlagen:** Grundsatz der App-Bewegung (Rückmeldung 220 ms, Zustand 320 ms); emil-design-eng.

### 3. Bühnenfenster früher und schlanker laden
- **Gemessen:**
  - Beim Eintritt in die Wünsche kommen 1,67 MB über das Netz: app.js 863 KB, app.css 197 KB, `bilder/foto/app-start.webp` 179 KB (unsichtbar), modell.js 161 KB, buehne.js 112 KB, einladung.js 37 KB.
  - Der lokale Server liefert ungepackt; app.js wäre mit gzip 269 KB.
  - Bereit (`ist-live`) nach 0,9 s (schnelles Netz, CSS-Modell), 4,8 s (WebGL über SwiftShader) bzw. 11,3 s (Slow 4G).
  - Lange Aufgaben beim Laden: 230 + 152 + 73 ms bzw. 306 + 91 + 77 ms. Sie liegen auf demselben Hauptthread wie die feste Folie „Lage“, also genau beim Tippen des Raumnamens.
  - Mit SwiftShader einmal 2,3 s (Software-Rendering, nur als Obergrenze lesen).
- **Wie beheben:**
  - `appLaden()` schon auf dem Ergebnis im Leerlauf starten: `requestIdleCallback(appLaden, {timeout: 3000})`.
  - In ez-vorab.js beim Umschreiben von innerHTML `app-start.webp` durch `data:,` ersetzen.
  - Prüfen, ob die Bühne einladung.js braucht.
  - Online gzip oder brotli ausliefern.

### 4. Standbilder als Rückfall
- **Bildbytes und Doppel:**
  - 109 Bilder, 1,77 MB. Alle in 1170 × 863, das ist 1:1 für 390 px bei Pixeldichte 3.
  - 21 Dateien sind bytegleich (350 KB, 20 %), z. B. 03-teilung = 04-seiten = 09-kvd = 10-ol = 13-material = 15-fi.
  - Wie beheben: in wuensche-daten.py nach Prüfsumme auf eine Adresse zusammenlegen.
- **Optionsbilder:**
  - Heute werden sie nicht vorgeladen. Vom Tipp bis zum Beginn der Überblendung vergehen 233–315 ms (Slow 4G), insgesamt etwa 0,5 s.
  - Wie beheben: im Leerlauf nach `frageZeigen` alle `opts[].bild` der Frage laden und `decode()` aufrufen (15–127 KB je Frage).
  - Gegenprobe: 20–47 ms.
- **Grüne Markierung:** In den Standbildern 05-typ-*, 06-din-*, 07-typ-* und 08-din-* ist sie grün, live violett. Neu rendern mit `werkzeuge/wunsch-render.mjs` und ez-buehne.css (`.w3d-selring` #897efc).
- **wuensche-daten.js:**
  - 122 KB, mit gzip 20 KB. 46 % davon sind SVG-Text (44 verschiedene Zeichnungen, 51 KB), dazu 25 KB Erklärungen (GLOSS).
  - Wiederholte Attribute (`vector-effect`, `stroke-linecap/-linejoin`, 22 KB) ins CSS verlegen, GLOSS erst bei Bedarf laden.

### 5. Layout bei echten Klicks
- Der offizielle Layoutsprung (CLS) ist 0, alle Sprünge kommen mit kurz vorheriger Eingabe. Sichtbar bleiben aber:
  - Die Beschriftung springt bei jedem Tipp um 15 px (siehe Typografie 1).
  - Die Stationspunkte wechseln über die Größe (`.dna .lg-band i.ist` 7 → 12 px plus 4-px-Ring). Bei jedem Kapitelwechsel rücken die Nachbarn um etwa 5 px.
- **Wie beheben, bei gleichem Bild:** `.dna .lg-band i.ist { width:7px; height:7px; transform:scale(1.714); box-shadow:0 0 0 2.33px var(--indigo) }`. Die Formensprache verlangt Stationen über Farbe und Skalierung.
- **Beobachtung:** Die klebende „Weiß ich noch nicht“-Zeile verdeckt bei „Welches Material?“ zum Start die Meta-Zeilen von Holz und Holz-Alu („Braucht Pflege“, „€€“) und die 5. Kachel.

**In Ordnung:**
- Bilder werden vor der Überblendung dekodiert.
- Das Bild der nächsten Frage ist vorgeladen: in 27 von 27 Wechseln im ersten Frame vollständig.
- Im Ruhezustand 3 zeichnende Ebenen, kein `filter: blur` auf Flächen der Fragen.
- Keine Konsolenfehler.
- JS-Speicher 2,6–3,2 MB (Standbilder) bzw. 6–8 MB (live).

---

## Material und Licht

**Farbmessung Y** (farben.py):
- Auf 8 von 10 Bildschirmen 1,5–2,3 % Farbe, Violett 0,1–0,4 %.
- Auf „Welche Farbe außen?“ und „Sonnenschutz außen?“ zählt der warme Außenputz des Renderings (Farbton 36°) als Koralle: 9,1–9,4 %, also mehr als Violett.
- Nach der Regel des Inhabers wird deswegen kein Violett ergänzt. Ob Pixel oder Eindruck zählen, entscheidet er.

### 1. Werkzeuge als Glasleiste am rechten Rand (Vorlage 01; Gene G13 und G10)
- **Heute:** dunkle, undurchsichtige Scheiben in einer waagerechten Reihe oben rechts. Sie verdecken die obere Rahmenkante, und „−“ (gesperrt) ist eine hellgraue Scheibe.
- **Wie in app/ez-buehne.css:**
  - `#w3d .w3d-zoom { top:12px; right:12px; flex-direction:column; gap:8px }`
  - `#w3d .w3d-knopf { width:44px; height:44px; background:rgba(32,32,34,.55); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.18); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(7,9,10,.4), 0 10px 24px -12px rgba(7,9,10,.6) }`
  - `#w3d .w3d-knopf:disabled { opacity:1; color:rgba(255,255,255,.38) }`
- **Dasselbe Glas** für `#w3d .w3d-hint` und `.ez-buehne--wz .ez-glaschip`. Glas ist über Bild bzw. Modell erlaubt (G14).
- **Danach prüfen:** mit leistung.mjs beim Drehen keine Aufgabe über 50 ms.

### 2. Bühnenkante hell-dunkel (Vorlage 02; G14-Regel für Fotos aus der Startseite)
- **Heute:** Die unteren 8 px der Bühne haben eine Helligkeit von 179–186, direkt darunter die Frage mit 20–23. Das ergibt eine harte, helle Kante auf Schwarz.
- **Wie:** `.ez-buehne--wz .ez-buehne__kante { box-shadow: inset 0 1px 0 rgba(255,255,255,.30), inset 0 -64px 72px -52px rgba(7,9,10,.6), inset 0 -1px 0 rgba(7,9,10,.30) }`
- **Ziel:** Rand unter 110. Die Fensterbank (mindestens 40 px über der Kante) bleibt hell. Der Hinweis-Chip steht danach auf dunklerem Grund.

### 3. „Noch offen“ als Schraffur statt Violett (G1; Vorlagen 07, 10, 04)
- **Heute:** „Weiß ich noch nicht“ zeigt aktiv einen violetten Ring und einen violetten Haken. Violett heißt in der DNA aber „gewählt“.
- **Wie:**
  - `[data-offen][aria-pressed="true"] { box-shadow: inset 0 0 0 1.5px var(--silbergrau); background: repeating-linear-gradient(135deg, transparent 0 6px, rgba(168,164,169,.14) 6px 7.4px), linear-gradient(180deg,#2c2c2f,var(--anthrazit) 60%,#1c1c1e) }`
  - Haken als schraffierte Scheibe: `repeating-linear-gradient(135deg, transparent 0 3px, rgba(168,164,169,.7) 3px 4.4px)`
  - Solange „offen“ gilt, wird die gewählte Kachel ruhig: `.ez-wz-antwort:has([data-offen][aria-pressed="true"]) .ez-wz-kachel[aria-pressed="true"]` mit Ring in Silbergrau und `::before { opacity:0 }`.
  - `.ez-wz-plus` („Mehr zu …“) als schraffierter Kreis wie das „+“ in Vorlage 07.

### 4. Gewählte Kachel nach dem Rezept von Schritt 1 (Untergrenze, vom Inhaber angenommen)
- **Heute:** Das Licht ist nur 34 % Violett und läuft ins Transparente aus; das Glas der Zeichnung bleibt ungetönt.
- **Wie:**
  - `.ez-wz-kachel::before { left:-10%; right:-10%; bottom:-34px; height:70px; background: radial-gradient(50% 50% at 50% 50%, var(--violett) 0, color-mix(in srgb,var(--violett) 60%,var(--indigo)) 30%, var(--indigo) 58%, transparent 80%) }`
  - `.ez-wz-kachel[aria-pressed="true"] .ez-wz-kachel__ico [fill-opacity] { fill: color-mix(in srgb,var(--violett) 36%,var(--anthrazit)); fill-opacity:1 }`
- Das ist Licht im und unter dem Objekt, keine Fläche.

### 5. Etikett am Objekt (G9; Vorlagen 11 und 01; Schritt 1 „Etikett mit Anker“)
- **Heute:** Der Hinweis der App („Flügel 1 von 2“, „Der Griff wandert mit“) steht lose unten links.
- **Wie in ez-bruecke.js:**
  - Ist `#w3d .w3d-selring` sichtbar, dessen `getBoundingClientRect()` lesen.
  - Den Hinweis als `.dna-etikett` mit `dna-etikett__punkt` und 1-px-Ankerlinie 8 px über der Mitte des Rings setzen, 12 px Abstand zum Bühnenrand.
  - Ohne Ring (z. B. Material, Farbe) bleibt der Chip unten links.

---

## Typografie

**Gemessen** auf den 10 Fragen des Briefs:
- Titel 28/500 mit −.025em; 3 von 28 Fragen fallen auf 24 px zurück.
- Unterzeile 14/400.
- Kachel 15/500, Kachel-Unterzeile 12/400.
- Zählerzeilen 14/500.
- Etikett 12/400 mit .03em.

### 1. Die Beschriftung bleibt stehen
- **Heute:** Der Punkt sitzt inline vor dem Text. Gewählte Beschriftungen rücken von 14 auf 29 px (15 px Sprung je Tipp), im Umschalter um 8 px.
- **Wie in Kacheln:**
  - `.ez-wz-kachel[aria-pressed="true"] .ez-wz-kachel__lbl::before { content:none }`
  - `.ez-wz-kachel__ico { position:relative }`
  - `.ez-wz-kachel[aria-pressed="true"] .ez-wz-kachel__ico::after { content:""; position:absolute; left:calc(100% + 6px); top:50%; margin-top:-4px; width:8px; height:8px; border-radius:50%; background:var(--violett); box-shadow:0 0 0 3px color-mix(in srgb,var(--violett) 30%,transparent) }`
  - Ohne Zeichnung den Punkt oben links bei 14/14.
- **Wie im Umschalter:** `.ez-wz-umschalter button[data-o]::before { position:absolute; left:14px; top:50%; margin-top:-4px; opacity:0 }`, gewählt `opacity:1`.
- **Vorlagen:** 03 (Punkt an der Ecke des Zeichens), 12 (Legende „• Income ○ Expenses“); Untergrenze Schritt 1 („ohne den Text zu verschieben“).

### 2. Eine Titelgröße
- **Heute:** `.ez-wz-lang` schaltet bei mehr als 30 Zeichen auf 24 px (3 von 28 Fragen). 8 von 28 Titeln brechen ohnehin zweizeilig, weil i und Notiz 98 px belegen.
- **Wie:** `h1.ez-wz-lang { font-size:1.75rem; line-height:1.1 }` oder den Klassenwechsel entfernen. Alle Titel bei 28 px, höchstens zwei Zeilen, `text-wrap: balance` bleibt.
- **Vorlagen:** 02 und 05 (gleiche Größe, zweizeilig); G15.

### 3. Mindestgröße und eine Stimme je Rolle
- `.ez-wz-kachel__sb` von 12 auf 13 px (`400 .8125rem/1.3`). Die DNA verlangt mindestens 13 px Text; 12 px bleiben nur für Etiketten.
- `.ez-wz-reihe > .ez-wz-wahl { font: 400 .9375rem/1.3 var(--font-sans) }`: Zählerzeilen von 14 auf 15 px, gleich wie Kachel, Umschalter und Zeile.
- **Ergebnis:** Optionstitel 15/500, Meta 13/400, Etikett 12/400 .03em.
- **Vorlagen:** 06 („Owned by — Name“), 03.

### 4. Luft nach G15
- **Heute:** Etikett→Titel 15 px, Titel→Unterzeile 9 px, Unterzeile→Antworten 14 px.
- **Ziel:** 8, 12 und 24 px.
- **Wie:**
  - `.ez-wz-zeile { min-height:28px; margin-bottom:-4px }`
  - `.ez-folie[data-folie="wuensche"] .ez-unterzeile { margin-top:5px }`
  - `.ez-wz-antwort { margin-top:22px }`
- **Danach prüfen:** Bei 360 px darf „Notiz“ (44 px) nicht unter „Fragen: Üblich“ rutschen. Insgesamt kommen nur 6 px hinzu.
- **Vorlagen:** 06 und 09.

### 5. Zahl mit kleiner Einheit (G3; Vorlagen 01 „80gr“, 10 „12.4kWh“, 04)
- **Heute:** „492 mm“ in der Aufteilung steht durchgehend in 300/24, Einheit gleich groß.
- **Wie:**
  - In `blockHtml` (aufteilung) und im Regler-Handler (`V.tausend(w1) + NB + 'mm'`) `<b>492<small> mm</small></b>` schreiben.
  - `.ez-wz-teile__werte b small { font:400 .875rem/1 var(--font-sans); letter-spacing:0; margin-left:2px; color:var(--textgrau) }`

**Zur Entscheidung:** Das `<em>` meint in den Wünschen jetzt „laut“ (gefragtes Wort weiß), in Messen und Ergebnis „leise“ (zweite Stimme grau, z. B. „Höhe *links.*“). Das sollte einmal entschieden und dann im Protokoll festgehalten werden.

---

## Belege

Alle Dateien liegen in `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/wz-vorlagen/`.

- **Bühne wird schwarz beim Fragewechsel:** `weiter-streifen.png`; Einzelbilder `spur-weiter-f00.png` bis `spur-weiter-f16.png`
- **Live-Stand:** `live-frage.png`, `live-material.png`, `live-gl.png`
- **Pille zu hoch im Standbild-Stand:** `q-09.png`
- **Messdaten:**
  - `m1-4x-slow4g.json`: alle Wechsel und Tipps, Standbilder
  - `m3.json`: Typografie
  - `m5-ohne.json`, `m5-mit.json`: Gegenprobe
  - `m8-4x-slow4g-gl.json`: Live-Bühne
  - `m2.json`: Ebenen und Geometrie
- **Skripte:** `m1.mjs` bis `m12.mjs`, `spur.py`, `daten.cjs`, `optbytes.cjs`
- **Code-Stand von 13:52:** Kopie unter `stand-1352/`

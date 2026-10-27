# Detail-Profis (Bewegung, Zeichen, UX, Typografie) · Konfigurator Schritt 6 „Wünsche“ (27.10.2026)

Ich habe die laufende Vorschau mit Playwright bei 390 × 844, 360 × 780 und 375 × 667 durchgespielt, in voller und in ruhiger Fassung. Alle 28 Fragen sind gelaufen, Tests per Tastatur, Doppeltipp, Bögen und Vorlesen eingeschlossen.

**Zum Stand:** `wuensche.js`, `wuensche.css` und `app/` haben sich während der Prüfung geändert (13:49–13:54). Seitdem ist die Bühne die echte App im iframe, die Titelfarben sind umgedreht, die Pille steht fest, „Weiß ich noch nicht“ klebt über dem Fuß, das Etikett heißt „Frage 1 von 11“ und der Ring im Chip zeigt den Anteil. Ich habe danach alles erneut gemessen. Die Befunde gelten für den Stand von etwa 13:58. Was in der Zwischenzeit schon behoben wurde, steht unter „In Ordnung“.

## 1. Bewegung (Emil-Schule)

| Nr | Befund (Stelle) | Wie (genauer Wert) | Wirkung |
|---|---|---|---|
| 1 | Die Bühne wird bei jedem Weiter und Zurück kurz schwarz. In `wuensche.js` Z. 381 sitzt `ez-wz-kommt` (opacity ab 0, 220 ms) auf `.ez-wz-frage`, und darin liegt `#wz-buehne` samt iframe. | Gemessen live: Deckkraft 1,00 bei 79 ms, 0,00 bei 139 ms, noch 0,00 bei 254 ms, 0,69 bei 318 ms, 1,00 erst nach etwa 500 ms. Abhilfe: nur Text und Antworten einblenden, `ziel = fr ? [schritte.frage.querySelector('.ez-frage'), antwort] : [schritte[name]]`, Keyframe ab `opacity: .4` statt 0, 160 ms mit `var(--dna-auftritt)`. | Die Bühne bleibt stehen, wie Brief Punkt 6 es verlangt. Kein schwarzes Loch 28-mal je Fenster, der Wechsel ist rund 340 ms schneller. |
| 2 | Die Antworten werden doppelt eingeblendet: Z. 286 setzt die Klasse auf `#wz-antwort`, Z. 381 zusätzlich auf das Elternelement. | Gemessen ohne iframe: 0,27 × 0,27 = 0,07 nach 27 ms, 0,48 nach 60 ms. Abhilfe: Z. 286 streichen, nur Z. 381 mit den Zielen aus Nr. 1. | Antworten erscheinen zusammen mit dem Titel statt etwa 40 ms später. |
| 3 | Live zeichnet jeder Tipp alle Antworten neu (`antwortSetzen`: `antwort.innerHTML = …`). | Gemessen: Die getippte Kachel ist danach ein neues Element, es gibt 0 transitionstart-Ereignisse. Abhilfe: Bei gleicher `q.id` und gleicher Blockzahl nur die Zustände setzen (`[data-o]` → `aria-pressed`, `[data-s]` → `aria-checked`, `output` → Zahl). innerHTML nur bei einer neuen Frage. | Ring (150 ms) und Licht (220 ms) laufen wieder, und das Rückfedern aus `scale(.97)` (160 ms) reißt nicht mehr ab. |
| 4 | Der Punkt in der Kachel lässt den Text springen (`.ez-wz-kachel[aria-pressed="true"] .ez-wz-kachel__lbl::before`, inline 8 + 7 px). | Das Label rückt beim Wählen 15 px nach rechts, das vorige 15 px zurück. Der Punkt kommt ohne Übergang, Ring und Licht mit 150 bzw. 220 ms, also drei Zeiten für einen Zustand. Abhilfe wie in Schritt 1 (`.ez-kachel__name::before`): `position: absolute; left: calc(100% + 7px); top: 50%; opacity: 0; transform: translateY(-50%) scale(.6); transition: opacity 150ms, transform 150ms var(--dna-druck)`, das Licht ebenfalls 150 ms. | Kein Textsprung, eine einzige Dauer für einen Zustand. |
| 5 | Kein Druckgefühl an `.ez-wz-wahl` (Listen F11 und F16), `.ez-wz-tiefe` („Üblich“), `#wz-band`, `.ez-wz-info`, `.ez-wz-kapitel button` und `.ez-wz-teile__werte button`. | `transition: transform 160ms var(--dna-druck)` und `:active { transform: scale(.97); transition-duration: 0s }`. Für volle Listenzeilen statt Skalierung: `.ez-wz-reihe:has(> .ez-wz-wahl:active) { background: color-mix(in srgb, var(--silbergrau) 14%, var(--weiss)) }`. | Jeder Tipp antwortet sofort, wie bei Kacheln, Tupfen und Zähler. |
| 6 | Das Modell im Bühnenfenster schwingt endlos (`web/assets/app.css` Z. 331: `w3dsway 9s ease-in-out infinite alternate`; mit WebGL das „Schwingen“ in `buehne.js` um Z. 1029). | Nach 2,6 s laufen außen 0 Animationen, im iframe 1 (`w3dsway`). `shot.mjs` sieht das iframe nicht. Das muss der Inhaber entscheiden: App unverändert lassen oder „nach 2,6 s läuft nichts mehr“. Mein Vorschlag für `app/ez-buehne.css`: `#w3d .w3d-sway { animation-iteration-count: 1 }`, mit WebGL nach einem Halbzyklus (4,5 s) anhalten. Das Prüfskript sollte zusätzlich `iframe.contentDocument.getAnimations()` zählen. | Ruhe nach dem Ankommen, weniger Last auf Mittelklasse-Telefonen. |
| 7 | Nur Ersatzbild ohne iframe: Die Überblendung bricht bei schnellen Tipps ab (`bildZeigen`). | Bei Tipps im Abstand von 80 ms steht das dritte Bild nach 127 ms sofort auf 1,00. Bild A tauscht seine `src`, während es mit 0,80 sichtbar ist. Abhilfe am Anfang der Funktion: `if (blendT) { clearTimeout(blendT); blendT = 0; an.classList.remove('blendet'); aus.classList.remove('blendet','ist-an'); void aus.offsetWidth; }` | Weiche Überblendung von 220 ms auch beim schnellen Durchprobieren. |

**In Ordnung:**
- Ruhige Fassung: 0 Animationen, 0 Übergänge mit Dauer, iframe ohne Übergang.
- Tastatur: Enter auf „Weiter“ löst keine Animation aus, der Fokus geht auf h1. Seit dem Umbau behoben, vorher blendeten die Antworten noch ein.
- Die Doppeltipp-Sperre auf „Weiter“ (450 ms) wirkt: ein Schritt.
- Außerhalb des iframe läuft nach 2,6 s nichts mehr.
- Druckgefühl: `.97`/`.94`, hinein in 0 s, zurück in 160 ms.
- Überblendung: 220 ms mit `--dna-druck`, das neue Bild liegt oben, kein Einbruch dazwischen.
- Bögen: 200/150 ms.

## 2. Zeichen

| Nr | Befund (Stelle) | Wie (genauer Wert) | Wirkung |
|---|---|---|---|
| 1 | „Gewählt“ hat vier Zeichen. | Punkt (Kachel, Umschalter, Schalterkern in F27), schwarzer Haken auf Weiß (Liste F11 Einfachwahl und F16 Mehrfachwahl), violetter Haken („Weiß ich noch nicht“, „Fensterbauer schlägt vor“), violetter Ring (Kachel, Tupfen). F11 „Öffnet nach innen oder außen?“ ist eine Einfachwahl und bekommt deshalb den Punkt: 24-px-Scheibe Schwarz mit 8-px-Punkt Violett. Haken nur für Mehrfachwahl und An/Aus. | Ein Zeichen je Bedeutung: Punkt heißt aktiv, Haken heißt dabei. |
| 2 | Zwei gleich aussehende Ringe am Zeilenende (F16, F27 „RAL-Montage“ mit i neben dem Schalter, F21/F25 i in den Zellen). | Wahlring 24 px / 1,5 px (Silbergrau 70 %) und i-Ring 22 px / 1,4 px (Textgrau) stehen 12 px auseinander und lesen sich wie zwei Kästchen. Abhilfe: i direkt hinter das Wort (20-px-Ring, `margin-left: 6px; vertical-align: -4px`, 44-px-Ziel über `::after`), der Wahlring steht allein am Rand. | Wahl und Erklärung sind nicht mehr zu verwechseln. |
| 3 | Die i-Ringe haben drei Strichstärken. | Frage-i 28 px / 1,5 px, Kachel-i und Listen-i 22 px / 1,4 px, Zellen-i 20 px / 1,4 px. Einheitlich `.ez-wz-info::before { box-shadow: inset 0 0 0 1.5px currentColor }`, Größen 28 (Frage) und 22 (Antworten). | Gleiche Hand wie Haken-Ring und Zurück. |
| 4 | Den Zeichnungen in „Sonnenschutz außen?“ fehlt der Hauptstrich. | Keiner, Bestehender, Rollladen, Screen und Klappläden haben nur Striche von 1 und 1,2 px. Raffstore und alle anderen Gruppen haben eine 1,8-px-Kontur. Außenkontur (Kasten und Rahmen) dieser fünf auf `stroke-width="1.8"` setzen, `vector-effect` bleibt. | Die Reihe wiegt gleich, die Rangfolge 1,8 / 1,2 / 1 gilt überall. |
| 5 | Der Kapitel-Bogen spricht eine andere Sprache als das Band. | Band: fertig = gefüllter 7-px-Punkt Silbergrau, jetzt = Violett mit Indigo-Hof, offen = Ring 1,5. Bogen: „erledigt“ und „jetzt“ nur als Text, offene Kapitel ohne Zeichen (der CSS-Kommentar verspricht Haken). Abhilfe: dieselben drei Punkte links vor dem Namen, der Text rechts kann bleiben. | Band und Bogen lesen sich als dasselbe Zeichen. |
| 6 | Die Ringe der leisen Zeilen sind ungleich groß. | „Weiß ich noch nicht“ hat einen 24-px-Ring, „Mehr zu …“ einen 28-px-Plusring (`.ez-wz-plus`). Beide auf 24 px. | Geschwisterzeilen sehen gleich aus. |

**In Ordnung:**
- Strichzeichnungen der App mit `non-scaling-stroke` in 1,8 / 1,2 / 1 (bis auf Nr. 4); ungewählt Silbergrau, gewählt Weiß.
- Gewählte Kachel: violetter Ring 1,8 + Punkt + Licht. Violett bleibt Akzent.
- Haken-SVG 1,8 mit runden Enden, Chevron im „Üblich“-Chip als 1,8-Maske.
- Kapitelband-Punkte 7/12 px mit Indigo-Hof; Indigo nur für den Zustands-Chip.
- Seit dem Umbau: Der Ring im Chip „Schritt 6 · Wünsche“ zeigt den Anteil (0,667 bei Griff-Farbe) statt eines vollen Rings, die Werkzeugknöpfe der Bühne haben DNA-Rundknopf-Optik.

## 3. UX

| Nr | Befund (Stelle) | Wie (genauer Wert) | Wirkung |
|---|---|---|---|
| 1 | Bei 375 × 667 sind die Antworten praktisch unsichtbar. | Zwischen Antwortbeginn (500 px) und der klebenden Zeile „Weiß ich noch nicht“ (519 px) bzw. dem Fuß (583 px) bleiben bei Form 83 px, bei Material 19 px, bei Sonnenschutz 2 px. Bei 360 × 780 sind es 115–196 px. Auch bei 390 × 844 liegt ein per Tab fokussierter Rollladen (Unterkante 724) 28 px unter der klebenden Zeile (696). Abhilfe: Bühne `height: clamp(184px, calc(100svh - 470px), 272px)` (667 → 197 px, ab 742 px Höhe wieder 272), `.ez-wz-offen` nur `@media (min-height: 740px)` klebend, sonst am Ende; dazu `html { scroll-padding-bottom: 168px }`. | Auf kleinen Telefonen ist mindestens eine volle Kachelreihe zu sehen, der Fokus wird nie verdeckt. |
| 2 | „Zurück“ hat keine Doppeltipp-Sperre (`wuensche.js` Z. 411 und `[data-wz-zurueck]`). | Gemessen mit 250 ms Abstand: Live springt es zwei Schritte zurück (Scharniere 1 → Seitenteile). Ohne iframe hat der zweite Tipp auf der vorigen Frage „Kipp“ statt „Dreh-Kipp“ gewählt, weil der Fuß dort höher stand. Abhilfe: `function (e) { if (e.detail !== 0 && Date.now() < schrittBis) return; zurueck(); }` für beide Zurück-Knöpfe, dazu Zeigerklicks in `#wz-antwort` 450 ms nach jedem Wechsel verwerfen (Capture-Listener wie in `start.js` bei `zeigeFolie`). | Kein versehentlicher Rücksprung und keine ungewollte Wahl mehr. |
| 3 | Beim Schließen einer Erklärung geht der Fokus verloren. Ursache in `start.js`: `bogenBinden(erkl, null)` schließt mit `knopf = null`. | Mit „Alles klar“, X oder Tipp auf den Hintergrund landet der Fokus auf BODY, und `aria-expanded="true"` bleibt an `#wz-i` und am Kachel-i stehen. Nur Escape ist richtig. Abhilfe in `bogenBinden`: `var k = offenerBogen && offenerBogen.bogen === bogen ? offenerBogen.knopf : knopf; bogenZeigen(bogen, k, false)`. | Tastatur und Vorlesen landen wieder am i, der Zustand stimmt. |
| 4 | Vorlesen: Gruppen ohne Namen, Einfachwahl als Umschalter, doppelte Ansage. | `role="group"` ohne Namen auf `.ez-wz-kacheln`, `.ez-wz-umschalter` und `.ez-wz-liste`; Einfachwahl mit `aria-pressed` wird als „Umschalter, gedrückt“ angesagt. Abhilfe: `role="radiogroup" aria-labelledby="wz-h1"`, Optionen mit `role="radio" aria-checked` (wie Schritt 1). Nach jedem Schritt wird h1 fokussiert und zusätzlich „Frage 1 von 11: …“ live angesagt: besser `aria-describedby="wz-pos"` am h1, `V.status` in `folgeSchritt` und nach dem Kachel-Tipp streichen. | Eine Ansage je Schritt, „1 von 5, ausgewählt“. |
| 5 | Das i in den Zellen ist zu klein (F21 Basisschutz, RC2 N, RC2, RC3; F25 Werzalit). | `.ez-wz-karte .ez-wz-zelle .ez-wz-info` ist 28 px, mit `::after` −6 also 40 × 40 px, und liegt in der Zelle. Abhilfe: 32 × 32 px (mit −6 = 44), Zelle `padding-right: 42px`. | Die 44-px-Regel gilt überall, weniger Fehltipps zwischen Wahl und Erklärung. |
| 6 | „Eine Breite antippen“ bewirkt nichts (F2, `.ez-wz-teile__werte button`). | Beide Knöpfe haben weder Handler noch Statusmeldung, live wie ohne iframe. Abhilfe: live an die App geben (`B.bedien(n, 'breite', j)`) oder wie an den anderen Stellen `V.status('In der App öffnet sich hier die Eingabe der Breite.')`; sonst als `<p>` statt Knopf. | Nichts sieht nach Knopf aus, was keiner ist. |

**In Ordnung:**
- Die Pille steht seit dem Umbau auf jeder Frage an derselben Stelle (774 / 710 / 597 px). Vorher sprang sie zwischen 592 und 774 px.
- Die Sperre auf „Weiter“ wirkt.
- Der Fokus geht nach Weiter, Zurück, Kapitelsprung und Tastatur auf h1. Escape schließt und gibt den Fokus zurück, Tab bleibt im Bogen.
- Alle übrigen Ziele haben mindestens 44 px. Keine waagerechte Rollleiste bei 360, 375 und 390.
- „Weiß ich noch nicht“ hebt live die Kachelwahl auf und umgekehrt.
- „Üblich“ führt zu „Wie genau planen?“ und danach zurück zur selben Frage.
- Fixe Folien „Wo ist das Fenster?“ und „Wie genau möchtest du planen?“: kein echter Fehler. Die Grundzeile erscheint und der Fokus springt ins Feld (375 × 667 und 360 × 780), keine Konsolenfehler.

## 4. Typografie

**Zur Frage aus dem Auftrag:** Ja, die graue zweite Stimme hat das wichtige Wort geschwächt. „Form?“, „Sonnenschutz“ und „Fensterbank“ waren grau, die App hebt sie grün hervor. Seit 13:49 ist das umgedreht: gefragtes Wort Weiß, Rest Silbergrau. Offen sind noch die Punkte 1 bis 3.

| Nr | Befund (Stelle) | Wie (genauer Wert) | Wirkung |
|---|---|---|---|
| 1 | Titel ohne `<em>` sind ganz grau: F17 „Sprossen?“ und F23 „Insektenschutz?“. | `#wz-h1` ist Silbergrau, und `titelHtml` entfernt das em, wenn der Titel nur aus em besteht. Abhilfe: `#wz-h1:not(:has(em)) { color: var(--weiss) }`. | Diese beiden Titel sind nicht schwächer als die übrigen 26. |
| 2 | In sechs Titeln steht ein einzelnes graues Fragezeichen (F11, F13, F22, F24, F25, F26, z. B. „Fensterbank innen?“). In 18 anderen ist das „?“ weiß. | In `titelHtml` nach dem Zusammenfügen: `.replace(/<\/em>([?.!])/g, '$1</em>')`. | Das Satzzeichen gehört zum Wort, kein einzelner Farbfleck. |
| 3 | Zebra-Titel und doppeltes em. | F11 „Öffnet nach innen oder außen?“ wechselt Weiß/Grau/Weiß/Grau/Weiß. F14 wird zu `Und <em><em>innen</em>?</em>`, weil die Regex `>innen` im em trifft. Abhilfe: `(^|\s)(innen|außen)` statt `(^|[\s>])`, und je Titel nur ein weißer Abschnitt, für F11 also „Öffnet nach <em>innen oder außen?</em>“. | Ruhiger Titel mit einem Blickpunkt. |
| 4 | Der Titel hat zu wenig Breite. | i (28 px), Lücken (18 px) und Notiz (52 px) nehmen 98 px weg: h1 höchstens 260 px (bei 390) bzw. 230 px (bei 360). Bei 360 brechen 16 von 28 Titeln um, die Antworten beginnen je Frage zwischen 478 und 537 px. Die 24-px-Stufe `.ez-wz-lang` hilft nicht (F27 bleibt dreizeilig). Abhilfe: Notiz als 44-px-Rundknopf nur mit Zeichen in die Etikettenzeile neben „Üblich“; i inline hinter das letzte Wort (wie `.lg-i` in der Lage, letztes Wort und i mit `white-space: nowrap`). Dann hat h1 328 bzw. 358 px. `.ez-wz-lang` streichen, überall 28 px. | Bei 360 werden 8 weitere Titel einzeilig, der Antwortbeginn ist gleichmäßig, keine Größensprünge. |
| 5 | Die Abstände sind vertauscht. | Etikett → Titel 12 px Zeilenkasten (optisch etwa 20 px), Titel → Unterzeile 7 px. Die DNA sagt 6 px und 12 px. Abhilfe: `.ez-wz-zeile { min-height: 28px; margin-bottom: -6px }` und `.ez-folie[data-folie="wuensche"] .ez-unterzeile { margin-top: 10px }`. | Das Etikett gehört sichtbar zum Titel, die Unterzeile löst sich. |
| 6 | Unter den Tupfen in F19 (Griff-Farbe) stehen Rohwerte. | Dort steht „weiss, silber, edelstahl, titan, schwarz, anthrazit, braun, bronze, messing“, klein geschrieben und mit „ss“, darüber korrekt „Weiß“. Abhilfe: Beschriftung `/^RAL \d+/.test(o.name) ? o.v : o.name`. | Richtige deutsche Schreibweise. |
| 7 | Es fehlen geschützte Leerzeichen. | „1.180 mm“ (F2), „Ug ≈ 0,5 bis 0,7“ (F15, Bruch nach ≈ möglich), „RC2 N“ (F21), „und 1 weitere“ (gemessen „… Rahmenansicht und 1 / weitere“), „und 4 weitere“ (bei 360 „… und / 4 weitere“), „z. B.“ (F28), in den Erklärungen „80 cm“, „10 dB“, „RAL 7016“, „30 bis 60 cm“, dazu „50 %“ im Skript. Abhilfe: eine Hilfsfunktion vor `ESC`: `t.replace(/(\d) (?=(mm|cm|dB|%|€|weitere)\b)/g,'$1 ').replace(/≈ /g,'≈ ').replace(/z\. B\./g,'z. B.').replace(/\b(RAL|RC2) (?=[\dN])/g,'$1 ')`. | Zahl und Einheit bleiben zusammen, keine Waisen. |
| 8 | Zwischenetikett und Erklärungsbogen. | „Einbruchschutz“ (F21, Block `label`) steht inline in 13 px / 500 Weiß; besser wie ein Etikett, 12 px / 400 Silbergrau mit .03em (`class="dna-label"`). Im Erklärungsbogen haben die Absätze keinen Abstand (`.ez-bogen p { margin: 0 }`), Abhilfe `#wz-erkl-text { display: grid; gap: 10px }`. Nach „Tipp:“ folgen Leerzeichen und `margin-right: 4px`, die Lücke ist doppelt: margin streichen. | Klare Rangfolge, die Erklärung liest sich in Absätzen. |

**In Ordnung:**
- Titel 28 / 500 mit −.025em in Outfit, gefragtes Wort Weiß.
- Etiketten 12 / 400 mit .03em, Kacheln 15 / 500 und 12 / 400.
- Kontraste: Silbergrau auf Schwarz 8,1 : 1, Textgrau auf Weiß 5,5 : 1, Weiß auf Indigo etwa 10 : 1. Knapp: ungewählter Umschalter Textgrau auf #ecebec mit 4,6 : 1.
- „1 Flügel“ mit geschütztem Leerzeichen; `lang="de"` am `main`, die Silbentrennung wirkt; weiche Trennstriche in „Abschließ­bar“ und ähnlichen Wörtern.

Skripte, Messdaten und Bilder liegen in `/tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/wz-profis/`, die Bilder vom aktuellen Stand im Unterordner `neu/`. Projektdateien habe ich nicht geändert, git habe ich nicht benutzt.

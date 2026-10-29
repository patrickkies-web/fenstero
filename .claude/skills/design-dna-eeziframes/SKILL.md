---
name: design-dna-eeziframes
description: Begleit-Skill zur Design-DNA des Inhabers für eeziframes. Immer zusammen mit design-dna laden, sobald im Projekt etwas gestaltet wird (Startseite, Verkaufsseite, App, Abschnitte, Bilder, Bewegung). Enthält die Palette „Task-App dunkel“ als fertige Token-Datei, die Ergänzungen der Formensprache vom 26.10.2026 (Untergrenze: die Startseite vom 26.10.2026, nach oben offen), die Entscheidungen des Inhabers, das Rezept je Seite mit Gremium und Detail-Profis, die Messwerkzeuge und die Prompt-Vorlage.
---

# Design-DNA für eeziframes (Begleit-Skill)

Die Design-DNA (`design-dna`, Skill des Inhabers) sagt, wie etwas aussieht: Gene, Formensprache, Bausteine, Musterseiten, Palette. Dieser Skill sagt, was im Projekt eeziframes dazukommt, damit jede neue Seite mindestens die Tiefe der Startseite vom 26.10.2026 hat und darüber hinausgeht, wo das Material es hergibt. Die Startseite ist Untergrenze, nicht Ziel und nicht Vorlage; die Messlatte steigt mit jeder Seite und jeder neuen Vorlage des Inhabers. Rangfolge: die Worte des Inhabers im Auftrag, dann Marke und echte Inhalte, dann `design-dna`, dann dieser Skill, dann `emil-design-eng` und `impeccable` nur, wo sie nicht widersprechen. `premium-gestaltung`, `ultimativ-webdesign` und `webdesign-wow` werden für Gestaltung nicht geladen.

## 1. Quellen, immer zuerst

| Quelle | Wo | Wofür |
| --- | --- | --- |
| Design-System „Design-DNA“ | https://claude.ai/artifact/7Sn3WTUMn15nyKvyeQak4o (`project/README.md`, `bewegung.md`, `tokens.json`, `components/bundle.css`, `components/bundle.js`, READMEs der Bausteine) | Bausteine und Bewegungs-Rezepte; `bundle.css`/`bundle.js` unverändert einbinden, Abweichungen in eigenen Dateien mit Präfix `ez-` |
| Musterseite Website | https://claude.ai/artifact/5CqFMQ5g8XJaKtQwjaUW97 | Familientest |
| Musterseiten App | „Konfigurator in Violett“ https://claude.ai/artifact/1vVq72cTJCJMRBxkrchmJX, „Lage in Violett“ https://claude.ai/artifact/RrGJ6AtBUWhKJQo5APBPCq | App-Rahmen (DNA Abschnitt 9) |
| **Untergrenze der Qualität** | Startseite Kunden, 26.10.2026: https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i; Quelle docs/profis/startseite-dna-vorschau/; Protokoll docs/profis/2026-10-26-startseite-dna.md; Bilder docs/profis/bilder/2026-10-26-startseite-dna-*.jpg | Jede neue Seite wird daneben gelegt: gleiche Hand, mindestens diese Tiefe, gern mehr. Ihre Bausteine werden übernommen, wo sie passen, aus den Vorlagen übersetzt, wo sie nicht reichen, und neu gebaut, wo beides nicht genügt; diese Wahl treffe ich aus dem Material, der Inhaber muss sie nicht vorgeben. Wird eine neue Seite besser, ist sie die neue Untergrenze |
| Vorlagen des Inhabers | docs/profis/vorlagen/2026-10-26/ (zwölf Bilder), Urteile in docs/profis/gremium/2026-10-26-startseite-dna-vorlagen-*.md; Beschreibung aller Vorlagen in `design-dna` Abschnitt 6 | Abgleich in Schritt 7 des Rezepts |
| Palette | `tokens.css` neben dieser Datei | Einbinden statt neu schreiben (Abschnitt 2) |
| Stand der DNA | `design-dna-stand-2026-10-26.md` und `design-dna-ergaenzungen-2026-10-26.diff` neben dieser Datei | Die DNA liegt synchronisiert außerhalb des Projekts; überschreibt die Synchronisation die Ergänzungen vom 26.10.2026, hier nachlesen und erneut einarbeiten |

## 2. Palette „Task-App dunkel“

Die Palette, Anteile, Regeln und Kontraste stehen in `design-dna`, Abschnitt 8, und gelten unverändert. `tokens.css` neben dieser Datei ist die fertige Umsetzung für Website-Seiten (Themen `hell`/`dunkel`, Glut-Zuordnung, Abstände, Rundungen, Schriften, Schatten, `--kachel-rand`); sie wird als `dna/tokens.css` vor `bundle.css` eingebunden. Abweichungen zum Token-Block der DNA, mit Absicht: Glut-Zuordnung der Website (orange/blau/grün → Violett, honig/lila/magenta → Indigo, pink → Koralle, damit Leuchten Violett-Indigo bleiben und Koralle allein steht), Fokusring Weiß auf Dunkel und Schwarz auf Hell (Violett ist auf Weiß zu schwach), Glas mit Deckkraft .8 statt voll, `--auf-signal` Schwarz (Kontrastregel der DNA). Für App-Folien gilt der Block in Abschnitt 8 der DNA. Tonale Nuancen der acht Farben (Lichtkanten, Vignetten, Schatten, Verläufe zwischen Schwarz und Anthrazit) sind erlaubt, neue Farben nicht. Nennt der Inhaber eine andere Palette, wird sie genauso als Token-Datei angelegt. Vor dem Zeigen die Farbanteile je Bildschirm messen (`werkzeuge/farben.py`) und als Tabelle ausgeben; Fotos zählen als Farbfläche, und der Inhaber entscheidet, ob Pixelzählung oder Eindruck gilt (beim Hausfoto im Hero galt der Eindruck).

## 3. Ergänzungen der Formensprache (G14 und G15 in Werten)

Diese Werte haben die Tiefe gebracht, die der Inhaber an seinen Vorlagen schätzt. Sie gelten zusätzlich zur DNA und werden bei jeder Website-Seite angewendet; die Quelle ist docs/profis/startseite-dna-vorschau/start.css.

- **Keine Fläche ist flach (G14).** Dunkle Karten, Kacheln und Stufen: `background: radial-gradient(120% 90% at 18% 0%, #363638, var(--anthrazit) 55%, #1c1c1e); box-shadow: inset 0 1px 0 rgba(255,255,255,.10), inset 0 0 0 1px rgba(255,255,255,.045)`. Fotos in der Bühne: Lichtkante oben und Vignette unten (`inset 0 1px 0 rgba(255,255,255,.14), inset 0 0 0 1px rgba(255,255,255,.06), inset 0 -90px 120px -60px rgba(7,9,10,.75)`). Hinter der Bühne ein Lichtteich (`radial-gradient(55% 45% at 68% 45%, #141517, transparent 72%)`). Objekte auf Weiß bekommen einen Kontaktschatten (radialer Schatten unter dem Objekt), Geräte eine Metallkante und eine Spiegelung. Weiße Karten auf Weiß nur mit `--kachel-rand` und Schwebeschatten.
- **Leuchten ohne Weichzeichner.** `.dna-leucht::before` als radialer Verlauf mit Zwischenstufe (`var(--glut-a), color-mix(in srgb, var(--glut-a) 42%, transparent) 34%, transparent 72%`), `filter: none`, `::after` ohne Inhalt. Kein `filter: blur` auf Flächen oder Pseudoelementen, keine zweite Leuchtebene. Glas: `backdrop-filter: blur(12px)`, Bruchkante (`border-color: rgba(255,255,255,.18); box-shadow: inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(7,9,10,.4)`), nur über Bild, Objekt oder Leuchten.
- **Ein schweres Element je Bild (G15).** `titel-xl` 600, `clamp(44px, 9.5vw, 56px)`, Zeile .95, −.035em; `titel` 600, −.025em; Kartentitel 24/600; Labels 12 px in 400 mit .03em; kleine Zahlen 300 (48 px) mit Einheit 14 px, große Zahlen 200–250 (64–88 px) mit Einheit 15 px. Ist die Zahl der Held, bleibt der Titel leichter.
- **Luft nach Hierarchie.** Etikett→Titel 6 px (`margin-bottom: -6px` am Label in der Kopfzeile), Titel→Text 12 px, Text→Handlung 32 px, Gruppe→Gruppe 48 px; Lesetexte 36ch; Karten in drei Ebenen (Label, Titel, eine Zeile Meta oder Pille), nie ein Absatz in einer Karte.
- **Ein Zeichen je Bedeutung.** Chevron 1,8 px mit runden Enden als Daten-SVG-Maske in `currentColor`; der violette Punkt (8 px mit Hof) nur für „aktiv“ und am Etikett; Listenpunkte 6 px in `var(--linie)`; Haken für „inklusive“; Chips Indigo für Zustände, Koralle für Hinweise; Rundknöpfe mit Lichtverlauf und Ring (`display: grid` für den Pfeil); Maßlinien an den richtigen Kanten; Striche in Zeichnungen gerätunabhängig 1,8 / 1,2 / 1 px; Ankerpunkte auf Papier: weiße Scheibe, schwarzer Ring, Linie mit feinem Schatten.
- **Wortmarke** bleibt Inter (eezi 900, frames 500), 18 px, Zeichen 26 px; alles andere Outfit, eine Punktzahl je Bildschirm in Doto; deutsche Schreibweise mit geschützten Leerzeichen (1.409 mm, 7,99 €, 17. November).
- **Bewegung, dosiert.** Auftritt aus der Unschärfe nur im Hero (Überschrift Wort für Wort aus 6 px, Lead, Pille, Chips ohne Unschärfe, fertig nach 1,3 s); unterhalb des Hero steht alles sofort (`data-dna-auftritt` dort weglassen). Zahlen rasten von einem nahen Wert ein (700 ms), Etiketten erst Punkt und Linie, dann Text. Stationen wechseln nur über Farbe und Skalierung (`scale(1.45)` am aktiven Punkt); Karten blenden nur. Leiste beim Hochscrollen (320 ms hin, 220 ms weg, 24 px Hysterese in beide Richtungen, Grenze einmal beim Laden messen). Vorhang-Szenen rechnen mit der größten Bildschirmhöhe der Ausrichtung (`innerHeight` stabilisieren, siehe start.js). Lebendes Bento nur mit Hysterese, sonst aus (Layoutsprung). Tastatur löst nie Gleiten aus; Fokus unter dem Vorhang holt sich mit `behavior: 'auto'` in die Mitte.
- **Laden.** `<style>html,body{background:#07090a}</style>` ganz oben, Schriften vorab (`<link rel="preload" as="font">`), `html.ez-js` per Inline-Script und Fallback-CSS für „ohne JavaScript“, Bilder sofort mit `decoding="async"` und Maßen, große Bilder höchstens 1000 px, keine lazy-Bilder in den ersten Szenen. Ziel: Layoutsprung 0, keine Weichzeichner auf Flächen, Laden unter 1 s.
- **Bedienung.** Jedes Ziel 44 px, Stationen und Zeilen als echte Links, nichts sieht nach Knopf aus, was keiner ist; Skip-Link, Landmarken, `lang`; Umschalter zeigt „aktiv“ mit Füllung und Punkt, nicht nur mit Farbe.

## 4. Entscheidungen des Inhabers (gelten weiter, bis er sie ändert)

- Gestaltung nur nach `design-dna` und diesem Skill; keine Regel aus `premium-gestaltung` oder `ultimativ-webdesign` (Pillenband 460–600 px, ein farbiges Wort je Überschrift, Messband-Hero, Figurenwelt, Riesenwort als Standard).
- Gremium `profis` nur eine Runde, etwa zehn Minuten je Seite; keine zweite und dritte Runde.
- Startseite: kein Handy und keine Maßlinien im Hero, sein Hausfoto ist die Bühne. Bildpille in der Überschrift und Schriftfenster „eeziframes“ zurückgenommen (Kunden lasen „Kästchen“; 5:1 gegen das Schriftfenster); beide nur auf sein Wort. Pilotphase-Band oben weg, Satz im Fuß und in der Karte. Wortlaut „Jetzt konfigurieren“ bleibt.
- Konzept und Abfolge der Startseite stehen; Änderungen daran nur auf Wunsch.
- Seit 26.10.2026 ist die Seite die echte Startseite (Ansicht Hauseigentümer, web/index.html mit web/assets/startseite.js und startseite-dna.css). Änderungen an der Vorschau unter docs/profis/startseite-dna-vorschau/ gehen nicht von selbst online: start.css und Markup danach in die Dateien unter web/ übertragen (Protokoll, Abschnitt „Übernahme als Startseite“).
- Offen (nur auf sein Wort): Renderings mit grauem Studioglas statt Himmelblau, lebendes Bento wieder an, Mieter-Ansicht, Test auf einem echten Mittelklasse-Android.
- Seite für Fensterbauer (26.10.2026, abends): nach der DNA gebaut, vom Inhaber nach der ersten Vorschau als „sehr gut“ angenommen und auf
  sein Wort online gestellt (web/fuer-fensterbauer/, eingebettet auch in der Ansicht Fensterbauer der Startseite). Übertragen mit
  `node scripts/fensterbauer-uebertragen.mjs` aus docs/profis/fensterbauer-vorschau/, danach `node scripts/bedingungen-pdf.mjs`;
  Änderungen gehören in die Vorschau. Protokoll docs/profis/2026-10-26-fensterbauer-dna.md.
- Ein Kopfbereich für beide Ansichten der Startseite (Korrektur des Inhabers, 26.10.2026, „den Header anpassen an die Ansicht von den
  Kunden“): Die Ansicht Fensterbauer zeigt den Kopf der eingebetteten DNA-Seite (Marke, Umschalter, Pille), nicht die alte Kopfzeile
  des Portals; Pilotband, Portal-Kopf und Portal-Fuß bleiben dort aus. Wird eine weitere Seite eingebettet, gilt dasselbe.
- Nur der genannte Bereich (Korrektur des Inhabers, 26.10.2026): Ein Auftrag „überarbeite die Seite für Fensterbauer“ meint genau diese
  Landingpage. Nichts aus App, Portal oder Betriebsbereich wird mit hineingenommen; andere Seiten werden nur gelesen, nie geändert, und
  die Lieferung sagt, welche Dateien berührt wurden.
- Kürzere Entscheidungsfindung (Korrektur des Inhabers, 26.10.2026): Gremium eine Runde, danach nur die Muss-Punkte und Vetos umsetzen;
  Detail-Profis und Vorlagen-Abgleich entfallen, sofern er sie nicht nennt. Ihre Befunde bleiben als Kann-Liste im Protokoll. Die Vorlage
  beim Inhaber: Vorschau, drei Sätze je Gruppe, Muss-Liste, fertig.
- Jede Folie für sich (Korrektur des Inhabers, 26.10.2026, Schritt 1 „Was planst du?“): Eine Folie des Konfigurators wird nicht von
  anderen Folien oder von der Musterseite „Konfigurator in Violett“ abgeschaut, auch nicht als „Musterfolie“ oder im Familientest.
  Quellen sind allein die, die er im Auftrag nennt: die DNA (Gene, Formensprache, Bausteine, Palette, App-Rahmen), die Startseite vom
  26.10.2026, seine Vorlagen unter docs/profis/vorlagen/, die Seite „Konfigurator von Muster Fensterbau“
  (https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM) und der Bestand der Folie selbst. Ideen kommen aus der Ideenmatrix zu diesen
  Quellen, nicht aus dem Nachbau einer bestehenden Folie. Vorschlag für seine DNA: in Abschnitt 9 den Satz „Vorbild sind die Folien in
  ‚Konfigurator in Violett‘“ durch „Jede Folie entsteht aus den Genen und Bausteinen für ihren Inhalt“ ersetzen.
- Violett nur als Akzent (Korrektur des Inhabers, 26.10.2026, Schritt 1): Proben mit violettem Lichtteich über der Bühne, voll violetten
  Kacheln und violettem Saum waren ihm „viel zu viel Violett“. Violett bleibt Punkt, Ring, Licht unter dem Objekt und gewählte Taste;
  nie eine Fläche, nie die Bühne. Hält eine Folie ihn nicht, liegt es nicht an zu wenig Violett.
- Kacheln nie weiß (Korrektur des Inhabers, 26.10.2026, Schritt 1): Weiße Auswahl-Kacheln auf Schwarz „sehen kacke aus“. Auswahl steht
  auf Anthrazit-Kacheln (G14, gewählt mit violettem Ring, Punkt und Licht); Weiß gehört in eine Karte für Eingaben (die Stelle, Felder),
  in Text und in die eine Pille, so wie der App-Rahmen (DNA Abschnitt 9) es sagt.
- Schritt 1 „Was planst du?“ angenommen (Inhaber, 26.10.2026: „Find ich gut“): Betonboden im Fensterlicht als Bühne, Etikett mit Anker am
  Objekt, Anthrazit-Kacheln mit den Strichzeichnungen der App, die Stelle auf weißer Karte, eine Pille unten. Diese Folie ist die
  Untergrenze für die weiteren Folien des Konfigurators (docs/profis/konfigurator-start-vorschau/, Protokoll
  docs/profis/2026-10-26-konfigurator-start.md). Weitere Folien folgen demselben Weg: Bestand, Quellen des Inhabers, Gremium eine Runde.
- Noch nicht überarbeitete Folien sind keine Vorlage (Inhaber, 27.10.2026, beim Übergang zu Schritt 3): Die Folien des Konfigurators
  werden nach und nach alle überarbeitet; die bisherigen sind deshalb ausdrücklich keine Gestaltungsvorlage, auch wenn sie nicht hässlich
  sind. Aus ihnen kommen nur Bestand und Ablauf (Texte, Begriffe, Zustände, Prüfungen, Reihenfolge, Funktionen der App), nie Farbe, Form,
  Anordnung oder Bewegung. Gestaltet wird allein nach seinen Skills: design-dna, dieser Begleit-Skill, profis, emil-design-eng.
- Funktionen der App bleiben (Korrektur des Inhabers, 27.10.2026, Schritt 2 „Fotos“): Das Gremium hatte das Häkchen „Diesen Hinweis
  nicht mehr anzeigen“ im Bogen „Mit Foto wird dein Aufmaß besser.“ für unnötig gehalten, die Vorschau ließ es weg; der Inhaber will es
  „auf jeden Fall“. Regel: Was die App dem Kunden heute an Bedienung bietet (Häkchen, Entfernen, Neu aufnehmen, Rückwege, Hinweise),
  bleibt in der neuen Folie erhalten und bekommt eine Form nach der DNA. Streichen nur mit seinem Ja, auch wenn das Gremium es empfiehlt.
- Ein Modell, überall das der Wünsche (Korrektur des Inhabers, 27.10.2026, Schritt 3 „Messen“): Das 3-D-Modell in den Wünschen ist
  „extrem hoch“ in der Qualität, beim Messen war es „deutlich schlechter“ (dunkles Raum-Licht, leere Öffnung; in den Vorschauen dazu das
  CSS-Ersatzmodell, weil der Testbrowser ohne Grafikchip nicht in WebGL zeichnet). Regel: Jede Folie zeigt das Element mit demselben
  Programm, denselben Materialien und demselben Licht wie die Wünsche (web/assets/buehne.js, WebGL, ohne `raum-licht`). Frei sind nur
  Größe, Ausschnitt, Kamera und die Farbnuancen drumherum. Renderings für Vorschauen entstehen mit `?gl=voll` und den Chromium-Schaltern
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`; ein Bild aus dem CSS-Modell ist kein Rendering.
- Bildfläche vor Dichte (Korrektur des Inhabers, 27.10.2026, Schritt 3 „Messen“): Ein Bild „mickrig klein“, das man nicht vergrößern
  kann, reicht für Erstnutzer und Ältere nicht, auch wenn es gut aussieht; Platz zwischen Bild und Karte gehört dem Bild. Regel: Wo ein
  Kunde am Bild handeln muss (anlegen, messen, zuordnen), füllt die Sache die Bühne (Bühne von Rand zu Rand, Kamera auf das, worum es
  gerade geht), die entscheidenden Stellen stehen vergrößert daneben (Lupe mit Marke), die Zahl verdeckt so wenig wie möglich, und
  ein Tipp aufs Bild öffnet eine Großansicht. Vorschlag für seine DNA, Abschnitt 9: „Die Bühne zeigt die Sache so groß, dass Anfang und
  Ende ohne Brille erkennbar sind; Vergrößern ist immer möglich.“
- Echte 3-D-Bühne statt Standbilder (Korrektur des Inhabers, 27.10.2026, Wünsche): In der Vorschau fehlten Detailtiefe, Bewegung,
  das Blatt der Einstellungen und Wahlen wie „Klinke ja oder nein“, weil sie Standbilder aus der App zeigte. Regel: In den Wünschen
  zeigt die Vorschau die App selbst (app/buehne.html lädt app.js, buehne.js und modell.js unverändert, sichtbar ist nur die Bühne;
  Fragen und Stand liest die Folie live, jeder Tipp geht an die App). Standbilder dort nur als Platzhalter, bis die Bühne geladen ist.
  Eine Vereinfachung der Vorschau gegenüber der App wird vor dem Zeigen ausdrücklich genannt, nicht nur unter „Offen“.
- Beim Messen kein 3-D, in den Wünschen das ausgearbeitete 3-D (Klarstellung des Inhabers, 27.10.2026, nach dem Ergebnis mit der
  App-Bühne): Die Kunden sollen „am Anfang“, wo sie ihre Maße eingeben, keine 3-D-Ansicht haben, „weil das einfach nur Unruhe
  stiftet“, sondern eine vorgegebene Ansicht auf das jeweilige Element; „nachher“ in den Wünschen „auf jeden Fall“ die sehr stark
  herausgearbeitete 3-D-Fassung. Regel: Messen, Ränder und Ergebnis (Maße eingeben und bestätigen) zeigen eine feste Ansicht je
  Element, ohne Drehen; Vergrößern bleibt. Das 3-D-Modell der App mit Detailtiefe, Bewegung und jeder Wahl gehört in die Wünsche und
  wird bei der Übernahme in die App dort nie durch Standbilder ersetzt. Die Vorschau muss es nicht über die Wünsche hinaus vorführen;
  es geht um die App. Vorschlag für seine DNA, Abschnitt 9: „Beim Messen eine feste Ansicht je Element, in den Wünschen das
  lebende Modell.“
- Vorlagen der Pakete (Korrektur des Inhabers, 26.10.2026, „Ich meine sicherlich nicht das! Das ist kacke.“ auf ein Bild des alten
  Dashboards): Eine „Vorlage für ein Paket“ ist die Landingpage, die der Betrieb unter seiner Domain bekommt, in der Design-DNA und als
  Schwester der Vorlagen für Essential und Plus. Das Dashboard und seine alte Gestaltung (#161616, Inter, farbiges Wort, Bilder unter
  web/bilder/beispiel/) sind weder Vorlage noch Material dafür; Merkmale eines Pakets erscheinen auf der Landingpage als Bausteine der
  DNA (Signature: Einladungszustand, Link-Etikett, Innenkarte mit dem Fortschritt). Vorschau docs/profis/signature-vorschau/.
- Paketstufen (Wunsch des Inhabers, 26.10.2026, abends: „alle Pakete visuell sehr ansprechend, aber die Käufer der höherpreisigen
  Pakete sollen schon auch was davon haben“): Jede Paket-Vorlage zeigt genau, was web/assets/pakete.js liefert, nicht mehr und nicht
  weniger. Der Anreiz steht in den Etiketten der Muster-Ebene (grauer Punkt in allen Paketen, Koralle neu im Paket, Ring erst im
  nächsten Paket), nie in einer absichtlich schwächeren Seite. Eine Familie je Betrieb mit einer Muster-Leiste (Paketwechsel an
  derselben Stelle, Preis aus pakete.js), gebaut von docs/profis/werkzeuge/paketvorlagen.py; geändert wird in den drei Vorschau-Ordnern
  (essential-, plus-, signature-vorschau), dann neu gebaut. Die Palette eines Betriebs gilt nach Stufen (siehe „Palette eines Betriebs“
  unten); Essential bleibt im eeziframes-Violett, bis der Inhaber pakete.js ändert. Protokoll docs/profis/2026-10-26-paketstufen.md.
- Paket-Vorlagen, Korrekturen des Inhabers (27.10.2026): Essential läuft immer unter firmenname.eeziframes.com, nie unter einer eigenen
  Domain; die eigene Domain ist dort ein Etikett „Ab Plus“. Im Daten-Abschnitt steht kein ausdrücklicher Satz, dass der Betrieb vor dem
  Senden nichts sieht; es steht nur, dass mit dem Konfigurator von eeziframes geplant wird (Signature: „von <Betrieb>“, ohne den Namen
  eeziframes) und dass der Betrieb die Anfrage bekommt, sobald gesendet wird. Unterlagen für die Vertragsdauer und eine Ablage im
  Dashboard über die Vertragsdauer kommen in keinem Paket vor, weder im Text noch in Etiketten (auch nicht in pakete.js: Aufbewahrung
  überall 30 Tage; Signature zeigt die Aufmaßblätter im Dashboard nur, solange die Anfrage gespeichert ist). Statt der Kachel „Für große Türen eine zweite Person“ steht
  „Ihre Wünsche zu Farbe und Glas“. Jedes Etikett passt in seine Pille, einzeilig oder im Fluss umbrechend, geprüft bei 390 und 1280 px.
- Palette eines Betriebs (Vorgabe des Inhabers, 27.10.2026, Beispiel Fensterbau Brandt: Reinweiß 40 %, Eisblau 25 %, Schieferblau 15 %,
  Tiefes Petrol 10 %, Aquatürkis 7 %, Frisches Mint 3 %): Signature folgt auf der ganzen Seite der Palette und ihren Anteilen, auch im
  Grund (gegen DNA Abschnitt 0, „Markenfarbe nie im Grund“: Vorschlag für die DNA). Plus geht zur Hälfte in die Palette (Karten, helle
  Szene, Akzente), der Grund der dunklen Szenen, Silbergrau und Koralle bleiben von eeziframes. Essential bleibt eeziframes. Muster-Leiste
  und Etiketten bleiben in allen Stufen eeziframes. Umsetzung als Farbdatei je Betrieb (docs/profis/werkzeuge/farben-<betrieb>.css,
  `data-farbe="voll"`/`"halb"` am main, im Generator unter BETRIEBE). Gemessen wird die Kundenansicht ohne Bilder mit
  werkzeuge/palette.mjs und palette.py, am Telefon und am Schreibtisch; Toleranz wie DNA Abschnitt 8 (neutral ±3, Farbe ±2 Punkte).
- Kein Abschnitt über den Weg der Daten (Inhaber, 27.10.2026: „Das ist etwas, was den Kunden so überhaupt nicht interessiert.“): Auf
  der Landingpage steht nirgends, dass Daten erst beim Senden zum Betrieb gehen oder wer sie übermittelt. Die Szene heißt „So geht es
  weiter“ und zeigt den Weg von der Planung bis zum Einbau; Datenschutz steht im Datenschutz.
- Schmale Leiste (Wunsch des Inhabers, 27.10.2026, Paket-Vorlagen): Die Leiste verschwindet beim Herunterscrollen nicht mehr, sondern
  zieht sich auf ihren Knopf „Fenster planen“ zusammen (Zuschnitt `clip-path` auf das gemessene Rechteck der Pille, runde Enden,
  280 ms ease-in-out; Logo blendet in 160 ms aus); beim Hochscrollen kommt sie ganz zurück (320 ms), über dem Kopf der Seite ist sie
  weg. Der Zuschnitt begrenzt auch die Treffer, daneben bleibt die Seite bedienbar. Ruhige Fassung: nur Überblenden. Vorschlag für die
  DNA und für weitere Seiten mit Leiste.
- Beispiel-Betrieb und Paketbereich (Wunsch des Inhabers, 27.10.2026, „Ich brauch jetzt nur noch den Betrieb Brandt, der dient mir
  als Beispiel“): Fensterbau Brandt ist der einzige Beispiel-Betrieb; Ostermann wird nicht mehr gepflegt (Generator und Artifact
  bleiben, nichts gelöscht). Im Paketbereich der Seite für Fensterbauer zeigt jede Karte ein Bild der Brandt-Seite ihres Pakets, und
  die drei Bilder unterscheiden sich, bevor man liest (Gremium 27.10.2026): Essential den dunklen ersten Bildschirm im eeziframes-Look,
  Plus die Szene mit den Fotos des Betriebs, Signature die helle persönliche Begrüßung. Aufgenommen bei 1024 × 640 mit Szenen ohne
  Vorhang, Ausschnitt genau 16:10 innerhalb der Szene (nichts aus der nächsten Szene im Bild), als 960 × 600 WebP
  bilder/paket-<paket>.webp. In der Browserleiste des Bilds die Adresse des Pakets in 13 px, der unterscheidende Teil hell und
  halbfett (fensterbau-brandt.eeziframes.com, fensterbau-brandt.de). Das Bild ist ein Link mit Glas-Etikett „Beispiel ansehen“; direkt
  unter den Karten steht die Zeile „Alle drei Pakete am Beispiel ansehen“ (voller Rundknopf 44 px), darunter der Vergleich. Ziel sind
  die Beispielseiten unter web/vorschau/paket-beispiel/ (noindex, nicht in der Sitemap), gebaut mit
  `python3 docs/profis/werkzeuge/paketvorlagen.py brandt --web`; dort trägt die Muster-Leiste vorn einen Umriss-Rundknopf zurück zu
  den Paketen. Danach die Kartenbilder neu aufnehmen. Die Merkmale im Vergleich kommen aus pakete.js; Farben als Treppe „Farben von
  eeziframes / zur Hälfte in Ihren Farben / ganz in Ihren Farben“ (nie „Karten und Akzente“, nie „Firmenfarbe“ ohne Einschränkung),
  Fristen als Zahl („30 Tage nach Zustellung“), Domains brechen nie um. Vorschau und pakete.js ändern sich zusammen.
- Altes Geschäftsmodell weg, alles neu (Korrektur des Inhabers, 27.10.2026: „keine Rücksicht auf bisherige Plattformen oder Layouts …
  keine Überschneidungen zwischen dem damaligen Design und dem neuen Design oder irgendwelchen Funktionen“): Kundenkonto `/partner/`,
  alte Paket-Bestellung und Oberfläche der alten Zentrale sind gelöscht. Bestellung (`/bestellen/`), Kundenbereich (`/konto/`) und
  Zentrale (`/zentrale/`) sind neu im App-Rahmen der DNA (`web/assets/auftrag.css`, Präfix `a-`) gebaut und bauen nur auf den aktuellen
  Paketen und den Landingpages von Fensterbau Brandt auf. Wer daran weiterbaut, liest nur docs/BESTELLUNG.md und docs/ZENTRALE.md, nicht
  den früheren Stand; alte Muster (Statusleiste mit sechs Balken, Seitenleiste der alten Zentrale, Papier-Optik) kommen nicht zurück.
- Aufmaßblatt (27.10.2026, Wunsch des Inhabers): Das Beispiel „Fensterbau Brandt / Familie Mustermann“ (13 Positionen, Systematik
  nach Geschoss) steht an allen Stellen, die ein Aufmaßblatt zeigen oder darauf verweisen: Startseite, Seite für Fensterbauer (über
  die Vorschau), Bestellung (Muster-Aufmaßblatt), Ratgeber Aufmaßblatt; die PDFs liegen unter web/beispiele/. Ändert sich blatt.js,
  `node scripts/blatt-beispiel.mjs --web` und die Anker an den Bildern prüfen (Protokoll docs/profis/2026-10-27-aufmassblatt.md).
- Bestellung (Korrektur des Inhabers, 27.10.2026): Vor der Kasse nur das Nötigste (Betrieb, Wunsch-Adresse, wohin die Anfragen gehen),
  alles Weitere (Impressum, Team, Logo, Farben, Fotos, Texte) nach der Zahlung im Kundenbereich („Seite einrichten“). Die eine Handlung
  steht unter dem, was man ausfüllt, nie darüber. Vor dem Bezahlen die Frage nach dem nächstgrößeren Paket mit den wenigen wichtigsten
  Unterschieden. Wahl „Seite vorschlagen“ (wir füllen alles aus) neben „Selbst angeben“. Vorschauen zeigen die echte Seite, nie die
  persönliche Einladung. Springt eine Meldung „es fehlt noch“ zu einer Maske, sind die Felder dort rot markiert und stehen auch dort.
- Folie für Folie, erst im Bild (Inhaber, 27.10.2026, spät, nach der ersten Übernahme der DNA-Folien in die App): Er war mit dem
  Ergebnis in der App „überhaupt nicht zufrieden“ (Bühne am Laptop winzig, graue Streifen, Knöpfe zu groß, alte und neue Folien
  durcheinander). Regel: Jede Folie gehen wir einzeln durch. Er beschreibt, ich zeige ein Bild für Telefon und Laptop, ohne etwas zu
  programmieren; erst nach seinem Ja wird genau das in der App gebaut, mit allen Knöpfen der Folie, und auf sein Wort online gestellt.
  Am 3-D-Modell und seiner Anzeige ändere ich nichts, was er nicht verlangt. Für Schritt 1 „Was planst du?“ gilt seitdem: kein Violett
  in den Kacheln und kein violettes Licht, kein schwarzer Rand und keine Abdunklung um die Bühne, der Hintergrund läuft ohne Container
  hinter den Kacheln weiter und verliert sich an der weißen Karte, das Element schwebt groß in der Mitte (seine eigenen Bilder der sechs
  Elemente), am Laptop füllt die Folie den Bildschirm. Vorschlag für seine DNA (Abschnitt 9): „Erst das Bild, dann der Bau“.
- Keine Schraffur, kein violettes Leuchten in der Lage (Korrektur des Inhabers, 28.10.2026, Folie „Wo ist das Fenster?“): Die schrägen
  Streifen im Haus und in der Karte „Genau gleiche Fenster“ und die violetten Leuchten sollten weg, der gewählte Stockwerk-Knopf weiß
  gefüllt sein. Auswahl auf dunkler Kachel heißt weiß mit schwarzer Schrift; Zustand zeigt sich über Helligkeit, nicht über Leuchten.
  Vorschlag für seine DNA: G1 (Schraffur als „Rest“) und das Leuchten als Zustand in App-Folien nur noch auf sein Wort.
- Laptop wie die Start-Folie (Wunsch des Inhabers, 28.10.2026): Jede Folie des Konfigurators füllt im Browser den Bildschirm wie
  „Was planst du?“: Kopf 60 px, links die Bühne über die ganze Höhe, rechts eine Spalte von 380 px mit Frage, Karten und der Pille
  unten, darunter die rechtlichen Verweise. Neue Folien bekommen diese Ansicht von Anfang an (`dnaTisch` oder eigenes Raster).
  Vorschlag für seine DNA: in Abschnitt 9 (App-Rahmen) den Satz „Schreibtisch: Bühne links über die ganze Höhe, rechts die Spalte mit
  der Pille“ ergänzen.
- Bühne im Container, scharf und flüssig (Inhaber, 28.10.2026, Foto der Fotos-Folie am Desktop: „das Bild sehr unscharf … mir reicht
  das auch, wenn der Konfigurator bzw. das Bild im Container stattfindet, so 25 % kleiner“; auf langsameren PCs ruckelten Folienwechsel
  und Drehen): Am Laptop steht die Bühne als Karte im Container, je Richtung ein Viertel kleiner (Abstand `--bx`, `--by`); Start und
  Gespeichert bleiben vollflächig. Bilder der Bühne mindestens in doppelter Anzeigegröße (Beispielfoto 2000 × 1500). Folien fahren
  nicht herein, über dem drehbaren Modell kein Milchglas (`backdrop-filter`), ohne WebGL schwingt das Modell nicht von selbst. Prüfen
  mit vierfach gedrosselter CPU, auch ohne WebGL: Folienwechsel unter 0,3 s. Vorschlag für seine DNA (Abschnitt 9): „Bewegung nur
  für Zustand und Rückmeldung; Folienwechsel stehen sofort; kein Glas über bewegten 3-D-Bühnen“.
- Hinweise gehören in die Folie, nicht darüber (Korrektur des Inhabers, 28.10.2026, Testansicht für Fensterbauer): Eine Karte über der
  alten Startseite eines Betriebs fand er „hässlich“, gewünscht ist „einfach ein Infobereich in der ersten Folie des Konfigurators“.
  Regel: Ein Hinweis, der für eine ganze Ansicht gilt, steht als Fläche in der Folie selbst (Anthrazit mit Lichtkante, Etikett mit
  violettem Punkt, ein Satz, ein Weg), nicht als Bogen oder Karte vor dem Inhalt und nicht auf noch nicht überarbeiteten Seiten.
  Vorschlag für seine DNA: in Abschnitt 9 „Hinweise als Fläche in der Folie, nie als Schicht davor“.
- Ein Ablauf, ein Look (Korrektur des Inhabers, 28.10.2026, Kontakt auf einer Instanz neben der neuen Bestätigung: „Das passt ja nicht
  überein. Nimm das neue Design“): Was der Kunde in einem Zug durchläuft, steht ganz im neuen Look, auch auf Instanzen. Wird eine
  Folie neu, werden ihre Nachbarn im selben Ablauf mitgezogen oder ausdrücklich als offen genannt.
- Ausprobieren ist der ganze Weg des Kunden (Inhaber, 28.10.2026: „von der Landingpage über den Konfigurator bis zu dem Absenden … und
  danach wieder abgeholt werden, um zu meiner Seite zu gelangen“; „Einflüsse … von meiner vorherigen Geschäftsausrichtung und dessen
  Design … möcht ich halt nicht in diesen Schritten sehen“): Ein Test für Fensterbauer beginnt auf der Beispielseite Signature von
  Fensterbau Brandt (Kästchen davor in der Palette von eeziframes), geht durch den Konfigurator bis zum Senden und endet mit der Auswahl
  in den Farben des Betriebs, die zurück zu den Paketen führt. Jede Seite, die dabei erreichbar ist (Liste, Seite nach dem Senden,
  Rückwege), steht im neuen Look; ein Rückweg führt nie auf eine Seite im früheren Design. Das Kästchen sagt, dass wir die Landingpage
  auf Wunsch mitgestalten, erklärt „Fenster planen“ auf der Seite und bietet „Fenster konfigurieren“ gleich im Kästchen (Inhaber, später
  am selben Tag). Vorschlag für seine DNA (Abschnitt 9):
  „Ein Ablauf ist erst fertig, wenn jeder erreichbare Bildschirm darin im neuen Look steht.“
- Bestandsaufnahmen gründlich (Inhaber, 28.10.2026: „diese ganzen Ratgeber Seiten die hast du ja noch gar nicht überprüft … vernünftig
  vorgehen“; „Wo kommen denn diese ganzen komischen Firmen her“): Jede Seite in voller Länge fotografieren (vorher durchscrollen), am
  Telefon und am Schreibtisch, und selbst ansehen, nicht nur messen; der erste Bildschirm allein reicht nie. Bilder für den Inhaber nie
  mit den Testbetrieben der Prüfsuite (Amsel, Fink, Specht, Meise); wo ein Betrieb gezeigt werden muss, den es online noch nicht gibt,
  Fensterbau Brandt aus der Paket-Vorschau, lokal nachgestellt, und das in der Lieferung sagen. Bilder in einer Liste laden sofort
  (kein `loading="lazy"`). Werkzeug: `docs/profis/werkzeuge/altes-design.mjs`. Vorschlag für seine DNA (Abschnitt 7):
  „Geprüft heißt: jede Seite ganz gesehen, mit Beispielen, die der Inhaber kennt.“
- Ratgeber einheitlich, Inhalte bleiben, Konfigurator bleibt (Inhaber, 28.10.2026: „die Inhalte so zu lassen wie sie sind aber das
  Design zu verändern … so dass der Ratgeber einheitlich aussieht“; „den Konfigurator der Seite sowie die Seiten, die bereits dem neuen
  Design entsprechen, lässt du, wie sie sind“; „die Links zu überprüfen, ob die Wege auch passend sind“): Alle 24 Ratgeber, die 5 Seiten
  Wissen für Fensterbauer, die Rechtstexte und die Fehlerseite stehen in einer Vorlage (Generatoren `scripts/ratgeber-bausteine.mjs` und
  `scripts/recht-bausteine.mjs`); ihr Text bleibt Wort für Wort, nur Auszeichnung (Etikett, geschütztes Leerzeichen, kräftiger erster
  Satz eines Fehlers) und Navigation kommen dazu. Konfigurator beim Fensterbauer (Start, Signature-Dashboard) und Seiten im neuen Look
  werden nicht angefasst, auch wenn die Bestandsaufnahme sie als alt führt; das steht in der Lieferung als offen. Jede Lieferung prüft
  die Links der berührten Seiten (intern alle, extern mit Status). Protokoll docs/profis/2026-10-28-ratgeber-dna.md. Vorschlag für seine
  DNA (Abschnitt 7): „Überarbeiten heißt: Gestalt neu, Wortlaut gleich, Wege geprüft.“
- Knopf „Zum Konfigurator“ in der Leiste der Seite für Fensterbauer (Wunsch des Inhabers, 29.10.2026: „wenn ich … über die Seite
  scrolle, so ein Button, wo drin steht zum Konfigurator … direkt in die erste Seite … soll auch zum Drücken animieren … nicht … die
  Pakete … sondern direkt in den Konfigurator“): Oben im Kopf bleibt „Paket anfragen“; unterhalb des Kopfs zieht sich die Leiste wie
  in den Paket-Vorlagen genau auf den Knopf zusammen (Umriss-Pille auf dunklem Glas mit weißem Pfeilkreis), beim Hochscrollen kommt sie
  ganz (am Telefon Zeichen und Knopf, der Umschalter steht im Kopf der Seite). Beim ersten Erscheinen je Seitenaufruf leuchtet der Rand
  zweimal violett auf und der Pfeil stupst zweimal im Kreis (1,4 s, nie in Schleife; ruhige Fassung ohne). Ziel
  `/app/?ausprobieren=signature&direkt`: gleich „Was planst du?“ in der Kundenansicht, ohne Beispielseite und Kästchen, Rückweg zur
  Seite für Fensterbauer. Vorschlag für seine DNA: „Eine Leiste darf einen zweiten Weg tragen, wenn der Inhaber ihn nennt; der Anreiz
  ist einmalig, nie Dauerbewegung.“
- Das Foto mit dem Lichtschatten auf dem Boden nicht überall (Inhaber, 29.10.2026: „nutzt bitte nicht schon wieder dieses Foto … ich muss
  das nicht überall haben“): web/bilder/konfigurator/buehne.webp bleibt auf den Folien, die es schon tragen (Start, Gespeichert,
  Haus, Zeit, Kontakt), neue Folien und Abschnitte nehmen eine andere Bühne. In der Vermittlung: Anthrazit mit Licht von oben links,
  feinem Punktraster (wie eine Karte) und Vignette. Vorschlag für seine DNA (Abschnitt 9): „Ein Foto als Bühne trägt höchstens ein
  Ablauf; neue Folien bekommen ihr eigenes Material.“
- Gratis-Weg als Wahl, nicht im Kleingedruckten (Inhaber, 29.10.2026, übernommen aus einem Vorschlag): zwei Karten nebeneinander,
  „Aufmaßblatt für dich“ mit Preis und „Aufmaßblatt + an bis zu 5 Fensterbauer in deiner Nähe“ (zuerst 2, am selben Abend auf bis zu
  fünf, mindestens zwei erweitert) für 0 € mit durchgestrichenem Preis als
  Anker; die Gratis-Karte mit violettem Ring und Etikett (Koralle, schwarze Schrift). Etikett „Empfohlen“ statt des vorgeschlagenen
  „Beliebt“, weil Beliebtheit ohne Nutzerzahlen eine erfundene Kennzahl wäre (DNA Abschnitt 4). Vertrauenssätze stehen dort, wo der
  Zweifel entsteht (unter der Karte, am Telefonfeld), nicht gesammelt am Ende. Wo bezahlt wird, steht der Gratis-Weg noch einmal als
  Fläche in der Folie. Was der Besucher auf der Startseite wählt (Farbe, Weg), übernimmt der Konfigurator.
- Konfigurator als Einstieg der Startseite (Inhaber, 29.10.2026: „Der Konfigurator sollte selbst der Einstieg sein, statt dass er erst
  erklärt wird“): im Hero ein drehbares Fenster aus dem Modell der App mit 3–4 Farbfeldern, dazu die Fassade, auf der nacheinander
  Fenster eingeplant werden; Überschrift „Plane deine Fenster in 3D, bevor du den ersten Handwerker anrufst.“, Knopf „Kostenlos
  losplanen“ (ersetzt im Hero „Jetzt konfigurieren“; die Leiste behält ihren Knopf). Protokoll docs/profis/2026-10-26-startseite-dna.md.
- Jede weitere Korrektur des Inhabers wird hier eingetragen und als Vorschlag für seine DNA genannt (Abschnitt 7 der DNA).

## 5. Rezept je Seite (so entstand die Startseite, etwa drei Stunden)

1. **Auftrag.** Ein Satz des Inhabers genügt („Ändere den Bereich für Fensterbauer“). Dann übernehme ich: Bestand lesen (Seite, Inhalte, Bilder, Zahlen), Material sichten (DNA, dieser Skill, Startseite, die Vorlagen unter docs/profis/vorlagen/, Bilder im Projekt), daraus entscheiden, was Sinn ergibt, und es anwenden: Richtung, Szenen, welche Bausteine der Startseite passen, welche Prinzipien der Vorlagen übersetzt werden, welches Foto oder Rendering die Bühne trägt. Die Wahl steht in drei Zeilen in der Lieferung, nicht als Rückfrage. Nachfrage nur, wenn zwei Lesarten zu wesentlich verschiedener Arbeit führen (z. B. Konzept neu oder nur Feinschliff). Nennt der Inhaber mehr (Zeilen aus `prompt.md`: Bleibt, Material mit Rolle, Richtung, Grenzen), gilt das vor meiner Wahl.
2. **DNA lesen** (Quellen laden), Szenen bilden (drei bis fünf, dunkel/hell im Wechsel), Ideenmatrix je Szene, drei Richtungen (naheliegend, mutig, überraschend; Bedeutung in `prompt.md`). Bei klarem Auftrag die stärkste bauen und die anderen in einer Zeile nennen; wünscht der Inhaber die Wahl, erst drei Bilder.
3. **Bauen** als eigenständige Vorschau unter docs/profis/<bereich>-vorschau/: `index.html` ohne Dokumentgerüst (das legt der Artifact-Dienst herum), `dna/tokens.css` aus diesem Skill, `dna/bundle.css` und `dna/bundle.js` unverändert, eigene `start.css`/`start.js` mit Präfix `ez-`, Schriften in `fonts/` (Outfit, Doto, Inter mit Lizenzen), Bilder in `bilder/`. Telefon zuerst (390 px), dann Schreibtisch (1280 px). Lokal: `sh werkzeuge/huelle.sh <ordner>` baut `lokal.html` (steht in .gitignore), `python3 -m http.server 8790 --bind 127.0.0.1` im Ordner liefert aus.
4. **Messen, bevor etwas gezeigt wird** (`werkzeuge/`, alle gegen `http://localhost:8790/lokal.html`, anderer Pfad über `URL=`):
   - `node shot.mjs <ausgabe>`: Bildschirme an Szenengrenzen für Telefon und Schreibtisch, Bericht `bericht.json` mit Pillenlage (Telefon: unteres Drittel), volle Pillen je Bildschirm (genau eine), laufende Animationen nach 2,6 s (null), Leiste, Konsolenfehler; `node shot.mjs <ausgabe> <url> 1` für die ruhige Fassung.
   - `python3 -I farben.py <höhe> bild1.png …`: Farbanteile je Bildschirm und Mittel der Seite als Tabelle.
   - `node pruef.mjs`: ruhige Fassung, ohne JavaScript, Zielgrößen ab 44 px, Tab-Weg, Fokus.
   - `node leistung.mjs`: Layoutsprung (CLS 0), lange Aufgaben, `filter`-Ebenen (0), lazy-Bilder (0), Bildbytes, Ladezeit bei vierfach gedrosselter CPU.
   - `node bewegung.mjs <ausgabe>`: Zeitlupen-Einzelbilder (CDP, Faktor 0,1) und Zustände für die Detail-Profis.
   Dazu die DNA-Prüfliste (Abschnitt 4) und der Familientest neben Musterseite und Startseite: gleiche Familie, und an keiner Stelle flacher als die Startseite.
5. **Gremium** (`profis`) eine Runde: drei Agenten blind X/Y (Gestalter, Kunden, Fensterbauer), Brief mit Bildern, Änderungsliste, Mehrheiten je Änderung; umsetzen, keine zweite Runde. Urteile unter docs/profis/gremium/.
6. **Feinschliff:** vier Profis parallel, je etwa zehn Minuten, je höchstens zehn Befunde mit genauem Wie: Bewegung (Emil-Schule, mit `emil-design-eng`), Zeichen, UX-Details, Typografie. Material: Zeitlupen-Takte, Zustände, Quellen.
7. **Abgleich mit den aktuellen Vorlagen** des Inhabers in drei Perspektiven (Material und Licht, Frontend und Leistung, Typografie), je fünf Hebel nach Wirkung, umsetzen.
8. **Veröffentlichen** als Artifact (dieselbe Adresse bei Nachbesserung, Icon „window“), Protokoll docs/profis/JJJJ-MM-TT-<bereich>.md mit Änderungstabelle und Farbtabelle, Bilder unter docs/profis/bilder/, Commit auf dem Arbeitszweig. Online (main) nur auf Wunsch.
9. **Rückfluss:** Jede Korrektur des Inhabers wird Regel in Abschnitt 4 und Vorschlag für seine DNA.

## 6. Prompt

Vorlage, Gestaltungs-Anhängsel und die drei Richtungen mit Beispielen in `prompt.md`; das Master-Anhängsel für jeden Auftrag (Gestaltung, App, Texte, Server) in `master-anhaengsel.md`, beide neben dieser Datei.

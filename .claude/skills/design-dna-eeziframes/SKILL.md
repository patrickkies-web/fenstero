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
  (essential-, plus-, signature-vorschau), dann neu gebaut. Die Palette eines Betriebs gilt in Plus und Signature; Essential bleibt im
  eeziframes-Violett, bis der Inhaber pakete.js ändert. Protokoll docs/profis/2026-10-26-paketstufen.md.
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

# Detail-Profi „UX“ · Konfigurator Schritt 4 bis Ende (27.10.2026)

Ich habe mit Playwright auf lokal.html geprüft: bei 390×844, 375×667 und 360×780 mit Touch, bei 1280×800 mit Maus und Tastatur. Im Code habe ich start.js, abschluss.js und index.html gelesen und mit web/assets/app.js abgeglichen (SCREENS.rest, ergebnis, fertig, anfrage1–3, teilen, konto, kasse, gekauft, zurueckTaste).

Während der Prüfung wurden start.js, start.css und abschluss.js geändert (12:43 und 12:46 Uhr). Die Befunde 1 und 2 habe ich danach noch einmal nachgestellt, sie bestehen weiter. Der Tastaturbefund „Fokus landet unter dem Fuß“ ist mit `scroll-padding-bottom: 120px` behoben und steht deshalb nicht in der Tabelle.

**Was trägt:**
- **Zurück in den Rändern:** Funktioniert mit Ansage und passenden Namen („Voriger Rand“, „Zurück zum Messen“ führt zu Maß 4). „Passt.“ ↔ Rand 4 zeigt „Bisher 1.236 mm. Tippen ersetzt das Maß.“
- **Entwürfe bleiben:** Ein nicht gespeichertes „14“ auf Rand 1 überlebt Zurück und Vor. Haus, Zeit, Kontakt und E-Mail bleiben beim Hin und Her erhalten.
- **Warnung:**
  - Die Pille ist nach der Warnung 450 ms gesperrt. Ein zweiter Tipp nach 192 ms wird abgefangen.
  - „Korrigieren“ leert das Feld mit Ansage.
  - „Stimmt so“ ist 90×44 px groß.
  - Die Ansage endet mit „… Korrigieren oder Stimmt so.“
- **Fokus:**
  - Nach jedem Folienwechsel liegt der Fokus auf der h1, die Seite steht oben.
  - Nach „Hier auch“ und „Stimmt so“ geht der Fokus auf die Pille.
  - „Passt.“ wird mit beiden Maßen angesagt.
- **Fehlermeldungen:**
  - E-Mail-Seite: `aria-invalid` und `aria-describedby` sind gesetzt, der Fokus geht ins Feld, der Fehler verschwindet bei gültiger Eingabe.
  - Kasse: alle drei Fehler erscheinen, der Fokus geht auf den ersten und wird mittig gescrollt.
  - Die Haken sind beim Betreten der Kasse leer, wie bei `kasseOeffnen` der App.
- **Pille:** Genau eine volle Pille je Folie, klebend unten, Mitte bei 93–95 % der Höhe. Die Stepper „−/+“ sind Umrisse.
- **Ziele ≥ 44 px:** Erfüllt; die i-Knöpfe haben 28 px plus 8 px rundum. Ausnahmen stehen in Befund 5 und 9.
- **Funktionen der App erhalten:**
  - Prüfungen und Texte stimmen überein (checkRest, cm-Rückfrage, k-next, k-buy).
  - Die Rückwege blatt→anfrage3, konto→blatt, kasse→konto und teilen→anfrage3 sind gleich.
  - „Freischalten“ mit bekannter E-Mail geht direkt zur Kasse.
  - Der Code hat das AM1-Format.

| Nr | Befund (Stelle, Schritte zum Nachstellen) | Wie | Wirkung |
|---|---|---|---|
| 1 | **Doppeltipp springt über eine ganze Folie.** Die Pille steht überall an derselben Stelle, und der zweite Tipp (nach 150 ms) löst die Pille der nächsten Folie aus. Nachgestellt bei 390×844 mit Touch: „Passt.“ → Doppeltipp „Weiter zum Ergebnis“ landet in den **Wünschen**, das Ergebnis ist übersprungen. „Gespeichert“ → „Zum Aufmaßblatt“ landet bei **„Zeit und Budget“**. Aufmaßblatt → „Freischalten“ zeigt auf der E-Mail-Seite sofort „Bitte eine gültige E-Mail-Adresse eingeben.“. Kasse vollständig ausgefüllt → „Testkauf abschließen“ landet bei **Teilen**, „Freigeschaltet“ ist übersprungen. | Eine Sperre nach jedem Folienwechsel: In `zeigeFolie` `wechselBis = Date.now() + 450` setzen. Ein Klick-Filter in der Capture-Phase auf `#app` verwirft Zeigerklicks auf `.ez-fuss button` und `.ez-ab-kachel`, solange die Sperre läuft. Tastaturklicks (`detail === 0`) gehen durch. | Hoch: Ältere tippen doppelt. Sie übersehen dann das Ergebnis, Pflichtfehler stehen schon beim Ankommen da, und der Moment „Freigeschaltet“ fehlt. |
| 2 | **„Hier auch …“: Ein langsamer Doppeltipp speichert den nächsten Rand ungemessen.** Nach dem Speichern steht 350 ms später im nächsten Rand an derselben Stelle wieder „Hier auch 1.410 mm gemessen?“. Nachgestellt: Rand 1, zweimal tippen im Abstand von 450 ms. Ergebnis: Rand 2 ist auf 1.410 gesetzt, die Folie steht schon auf „Breite oben.“. | Nach einem Tipp auf „Hier auch“ ist der Knopf im nächsten Rand für etwa 700 ms gesperrt (`taub` für `#mess-gleich`). Er blendet erst danach ein (160 ms, keine Blende bei reduzierter Bewegung). | Hoch: Ein falscher Rand verfälscht das kleinste Maß, ohne dass es jemand merkt. |
| 3 | **Das Feld verdeckt die Lupen** bei Rand 3 „Breite oben“. Bei 360×780 sind beide Lupen zu etwa 60 % verdeckt (je ~1.700 px²), bei 375×667 die rechte Lupe (1.400 px²) und „Groß ansehen“. Bei 375×667 verdeckt das Feld auch auf Rand 1 die obere Lupe und „Groß ansehen“. 390×844 ist frei. Bild: /tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/ux5/l-360-montage.png | In `legen()` für das Feld bei `r === 'h'` eine Lage unter den Lupen ergänzen (`y = Unterkante der Lupen + 8`). Passt keine Lage, statt auf Lage 0 zurückzufallen das Feld schmal setzen: ohne „z. B.“, Breite 140. | Hoch bis mittel: Beim ersten Blick fehlt, wo genau gemessen wird. |
| 4 | **Zwei Zahlen für ein leeres Feld.** Rand 1 zeigt im Feld „z. B. 1.250 mm“ und in der Zeile „Hier auch 1.410 mm gemessen?“. Bei Breite oben steht „z. B. 1.100“ gegen „Hier auch 1.240“. Beim Tippen unter 250 erklärt die Zeile ebenfalls mit „125 cm = 1.250 mm“. Die App hat denselben Platzhalter. | Bei den Rändern das Beispiel weglassen (leeres Feld mit „mm“) oder das Maß der Mitte nehmen. Auch die Erklärzeile rechnet mit dem Maß der Mitte. | Mittel: Ältere tippen das Beispiel ab. |
| 5 | **AGB-Link mitten in der Zustimmungszeile.** Ein Tipp auf die Mitte von „Ich akzeptiere die AGB (Stand …)“ trifft den Link (29×18 px), nicht den Haken. Nachgestellt bei 390×844: Kasse, Tipp auf die Mitte der Zeile → Fokus liegt auf dem Link „AGB“, der Haken bleibt leer, der Fehler bleibt. `href="#"` springt in der Vorschau; die App öffnet /agb/ in einem neuen Tab. | Die Zeile mit dem Haken enthält keinen Link mehr („Ich akzeptiere die AGB.“). Darunter ein eigener Link „AGB lesen (Stand 18. Oktober 2026)“ mit mindestens 44 px. Das gilt auch für die App. | Mittel: Der Kauf stockt, im Zweifel verlässt man die Kasse. |
| 6 | **Tote Knöpfe:** „Notiz“, „Übersicht“ und „Begriffe“ im Kopf von Ränder/Passt, Ergebnis und allen Abschlussfolien haben keinen Handler. Ein Tipp tut nichts und wird nicht angesagt. Alle anderen Platzhalter melden sich mit „Vorschau: In der App …“. In der App öffnen sich die Notiz, das Begriffsverzeichnis und die Liste. | Dieselbe Toast-Rückmeldung wie bei den übrigen Platzhaltern einbauen und bei der Übernahme an `S.notiz`/`glossIndex` anbinden. | Mittel: Prüfer und Kunden halten die Knöpfe für defekt. |
| 7 | **Rückwege weichen von der App ab.** (a) „Gespeichert“ → „Maße ändern“ → Ergebnis → Zurück führt zu „Passt.“. In der App geht es zurück zu „Gespeichert“ (`einstiegHier`), in der Vorschau führt der Rückweg nur über Ergebnis und Wünsche. (b) Bei „Fürs Angebot 1“ heißt der Knopf „Zurück: Aufmaß“, führt aber zu „Gespeichert“; in der App führt er zur Übersicht. (c) „Freigeschaltet“ hat im Kopf ein „Zurück: Fenster“, das nur einen Toast zeigt, und im Fuß kein Zurück; der Kommentar im HTML sagt „kein Rückweg“. | (a) Die Herkunft merken (`ergVon = 'fertig'`) und Zurück dorthin, mit dem Namen „Zurück: Fenster“. (b) Name und Ziel angleichen. (c) Das Kopf-Zurück auf „Freigeschaltet“ entfernen. | Niedrig bis mittel. |
| 8 | **Screenreader:** Ein Toast wird doppelt angesagt: Die Toast-Zeile mit `role=status` und `#ez-live` bekommen denselben Text. Der Kassenfehler „Bitte eine Zahlungsart wählen.“ ist nicht mit der Gruppe verbunden, und die Haken haben kein `aria-invalid`. Auf „Gespeichert“ liest der Fokus auf der h1 nur „Fenster“; „Gespeichert · Position 1“ steht nur im Chip. | `toast()` ohne `E.status` (oder den Toast ohne Rolle). Die Gruppe Zahlungsart bekommt `aria-describedby="ab-pay-fehler"`, die Haken bekommen `aria-invalid`. In der h1 ein unsichtbares Präfix „Gespeichert: “. | Mittel. |
| 9 | **„Mehr erfahren“ zu klein:** In den Hinweisen Denkmalschutz und Lüftungskonzept (Fürs Angebot 1) ist der Knopf 91×20 px groß, ohne erweiterte Trefferfläche. Nachstellen: Gebäude „Denkmalschutz“ wählen und „Fenster im ganzen Haus“ auf 2 setzen. | Wie beim i-Knopf: `position: relative` und `::after { inset: -12px -4px }`, oder `min-height: 44px` mit `inline-flex`. | Niedrig bis mittel. |
| 10 | **E-Mail wird zweimal abgefragt:** Die Adresse aus „Fürs Angebot 3“ fehlt auf „Wohin soll die Rechnung?“; das Feld ist leer, in der App ebenso. | Wenn `kauf.mail` leer ist, mit `proj.mail` vorbelegen. Der Fehler erscheint erst nach „Weiter“. | Niedrig bis mittel: Weniger Tippen vor dem Bezahlen. |

Skripte und Bildschirmfotos liegen in /tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/ux5/. Die Doppeltipp-Durchläufe sind weg.mjs, abschluss2.mjs und rand.mjs; die Messung der Überdeckung ist lupe.mjs. Ich habe keine Projektdateien geändert und keine git-Befehle ausgeführt.

# Detail-Profi UX: Konfigurator Schritt 3 „Messen“

Lena Hartwig, UX-Research und Barrierefreiheit. Ich habe im Browser mit Playwright geprüft: 375 × 667, 390 × 730, 390 × 844 und 1280 × 800, per Tippen, Maus und Tastatur. Die Live-Regionen habe ich mitgeschnitten. Dateien habe ich nicht geändert.

**Vorgaben des Gremiums:**
- **Erfüllt:**
  - „Speichern sichtbar“.
  - „Öffnung“/„Fensters“ steht hell (#fff gegen Silbergrau, etwa 8:1).
  - Kontrast der Zeile: #6b676c auf Weiß, 5,5:1.
  - Alle Ziele ab 44 px (i-Ring 28 px plus 8 px Rand, „Stimmt so“ 90 × 44, Tasten 46/48).
  - Tasten über dem Fuß bei 730 px Höhe (Taste endet bei 640, der Fuß beginnt bei 646).
- **Nicht erfüllt:**
  - bei 667 px Höhe (Nr. 3),
  - „Linienenden frei“ unter 730 px Höhe (Nr. 8),
  - „sichere Antwort auf der Pille“ in einem Fall (Nr. 1).

| Nr. | Befund | Wie | Wirkung |
|---|---|---|---|
| 1 | **Zentimeter-Falle bei echten Millimetern.** Ich habe beim Fenster „400“ getippt (Kellerfenster, 40 cm hoch) und 1 s gewartet. Die Pille zeigt dann „Ja, 4.000 mm“, Enter und Tippen speichern 4.000 mm. Einen Weg „Nein, das sind Millimeter“ gibt es nicht, obwohl `pruefe()` 400 annimmt. Dasselbe gilt für 250 bis 499 (Höhe) und 250 bis 399 (Breite) und ebenso in der App (`padTeile`). | Kleine Ergänzung in `messZeileSetzen()` (start.js Z. 386, Zweig `cm`): Ist `v >= 250`, kommt rechts in die Zeile `<button class="ez-zeile__knopf" id="mess-nein">Nein, 400 mm</button>`, wie „Stimmt so“. Der Knopf setzt `mess.cmLive=false; mess.mmOk=v` und ruft `messWeiter()`. `cmFrage` fragt für `mess.mmOk` nicht erneut. Die Pille behält „Ja, 4.000 mm“. | Ein falsches Maß wird verhindert; heute steht dann 4 m statt 40 cm in der Anfrage. |
| 2 | **„Stimmt so“ wird doppelt gebunden, dadurch wird Maß 3 übersprungen.** Nachgestellt: Maß 2 „300“ und Enter in unter 0,8 s. Dann feuert der cm-Timer, `messZeileSetzen()` bindet am selben Knopf einen zweiten Listener (Z. 392). Ein Tipp auf „Stimmt so“ ruft `messWeiter()` zweimal, die Folie springt auf „Maß 4 von 4“, und die Breite der Öffnung fehlt. | Listener einmal per Delegation: `messZeile.addEventListener('click', e => { if (e.target.closest('#mess-stimmt')) { mess.ack = true; messWeiter(); } })` und Z. 392 streichen. Dazu am Anfang von `messWeiter()`: `if (mess.sperre) return;`. | Datenverlust ohne Fehlermeldung wird verhindert. |
| 3 | **375 × 667 (iPhone SE/8): die untere Reihe „0“ und „⌫“ liegt unter dem Fuß.** Die Taste endet bei 654 px, der Fuß beginnt bei 583 px. Wer „0“ tippt, scrollt, und das Feld mit der Zahl verschwindet oben (Bild ux-375-warnung.png). Ursache: Die Überschrift bricht um (239 px Platz, 240 px nötig), und die Bühne steht schon auf ihrem Minimum von 150 px. | start.css Z. 375 erweitern, `@media (max-height:700px) and (max-width:759px)`: `.ez-frage h1{font-size:1.625rem}` (alle fünf Titel einzeilig, 29 statt 66 px), `.ez-taste{height:44px}`, `.ez-tasten{gap:5px}`, `.ez-zeile{height:54px}`, `.ez-karte--tasten{padding:10px 16px 12px}`, im Fuß Pille und Rund 48 px, `.ez-fuss{padding-top:10px;padding-bottom:calc(12px + env(safe-area-inset-bottom))}`. Dazu in Z. 309 `Math.max(innerHeight < 700 ? 126 : 150, …)`. Gemessen: Taste endet bei 589, der Fuß beginnt bei 597. | Alle Tasten und das Feld sind gleichzeitig zu sehen, auf dem häufigsten Seniorentelefon. |
| 4 | **Screenreader: dieselbe Meldung zwei- bis dreimal, der Maßwechsel ohne Inhalt, „Zurück“ stumm.** Mitschnitt beim Speichern: Zeile „Gespeichert…“, dann Status „Gespeichert…“, Zeile „Maß 1 gespeichert…“, Status „Maß 2 von 4.“, alles innerhalb von 0,35 s. Die Warnung kommt doppelt (Zeile und Status). Nach „Voriges Maß“ wird nichts angesagt. Das Feld ist `aria-hidden`; die aktuelle Zahl lässt sich nicht abrufen. | `aria-live` an `#mess-zeile` entfernen (index.html Z. 250) und nur `status()` sprechen lassen. Z. 442 entfällt. Z. 445 wird zu `status('Gespeichert: 1.250 Millimeter. Maß 2 von 4: Höhe des Fensters.')`. In `messZurueck()`: `status('Maß 1 von 4: Höhe der Öffnung. Bisher 1.250 Millimeter, Tippen ersetzt das Maß.')`. Im cm-Timer (Z. 429): `status('Zollstock zeigt 141 Zentimeter? Dann Ja, 1.410 Millimeter.')`. An `#mess-weiter`: `aria-describedby="mess-wert"`. | Eine klare Ansage je Ereignis; mit dem Fokus auf der Pille hört man die Zahl. |
| 5 | **Fokus geht nach „Stimmt so“ verloren.** Nach Enter auf „Stimmt so“ steht der Fokus auf `BODY`, weil die Zeile neu geschrieben wird. Der nächste Tab beginnt oben im Kopf. | Im Handler von „Stimmt so“ vor `messWeiter()`: `messWeiterKnopf.focus({preventScroll:true})`. | Tastatur- und Screenreader-Nutzer bleiben an der Stelle. |
| 6 | **Maus und Eingabetaste ergeben eine zusätzliche Ziffer.** Am Rechner „1“ mit der Maus, dann „250“ und Enter auf der Tastatur: Ergebnis „12.501“, „Höchstens 6.000 mm“. Die angeklickte Taste behält den Fokus, und Enter löst sie erneut aus (Z. 466 schließt Knöpfe aus). | `.ez-taste` bei `mousedown` mit `e.preventDefault()` belegen (die Taste nimmt bei Mausklick keinen Fokus). Tab-Nutzer bedienen die Tasten weiter mit Enter und Leertaste. | Enter heißt am Rechner immer „Weiter“, wie in der Notiz versprochen. |
| 7 | **Doppeltipp: „Korrigieren“ zweimal ergibt einen Fehler.** Der erste Tipp leert das Feld, die Pille heißt sofort wieder „Weiter“. Der zweite Tipp zeigt „Bitte das Maß in Millimetern eintragen.“ mit Rahmen in Koralle. Auch der Wechsel zu „Ja, … mm“ nach 0,8 s Pause hat keine Sperre, und die Beschriftung springt unter dem Finger. | `pilleSperre = Date.now() + 450` im Zweig `korr` (Z. 403) und im cm-Timer (Z. 429) setzen. | Kein Fehler, den der Nutzer nicht verursacht hat; kein Fehltipp beim Wechsel. |
| 8 | **Das obere Linienende berührt bei 667 und 730 px Höhe den Schritt-Chip.** Der Chip endet rechts bei 201 px, die Kappe beginnt bei 194 px. `legen()` berücksichtigt den Chip nur für Feld und Etiketten, nicht für die Linie. | In `messBuehneSetzen()` prüfen, ob sich Chip und Endkasten schneiden. Wenn ja, `messChip.classList.add('ist-kurz')`; „ · Messen“ in einen `<span class="ez-glaschip__zusatz">` legen und mit `.ist-kurz .ez-glaschip__zusatz{display:none}` ausblenden (der Chip ist dann etwa 110 px breit). | „Linienenden frei“ gilt auch auf kleinen Telefonen. |
| 9 | **„Korrigieren“ trägt den Vorwärtspfeil.** Der Pfeil sagt „weiter“, die Pille leert aber das Feld (Bild ux-375-warnung.png). | In `pilleSetzen()`: `messWeiterKnopf.dataset.art = artNeu`; dazu `#mess-weiter[data-art="korr"] .dna-pille__pfeil{display:none}`. | Das Zeichen passt zur Handlung, kein Zögern. |
| 10 | **Tab-Weg führt über vier Rechtslinks zum Weiter.** Reihenfolge: ⌫, „Vertrag widerrufen“, Impressum, Datenschutz, AGB, Zurück, Weiter. | `<p class="ez-recht">` (index.html Z. 264) hinter `.ez-fuss` setzen; der Abstand bleibt über `.ez-folie[data-folie="messen"] .ez-recht`. | Vier Tabs weniger bis zur Hauptaktion, Lesefolge wie im Bild. |

**Fazit:** Der Ablauf ist ruhig und gut lesbar: offene Tasten, Haken beim Speichern und das gespeicherte Maß in der Zeile sind für Senioren genau richtig. Vor jeder weiteren Gestaltung müssen zwei Fehler weg, weil sie falsche Daten erzeugen: die Zentimeter-Falle ohne „Nein“ (Nr. 1) und der doppelte Listener, der Maß 3 überspringt (Nr. 2). Danach kommen das kleine Telefon (Nr. 3) und die Screenreader-Ansagen (Nr. 4); der Rest ist je eine Zeile Code.

Alle Bilder liegen in /tmp/claude-0/-home-user-fenstero/97099377-e5e3-521d-870b-9fed47c94459/scratchpad/profis3/:
- ux-375x667-leer.png
- ux-375-warnung.png
- ux-400-falle.png
- ux-375x667-vorschlag.png (Vorschlag aus Nr. 3 eingespielt)
- ux-doppel-stimmt.png
- ux-desk.png
- ux-zurueck.png

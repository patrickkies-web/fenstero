# Essential Plus, Landingpage Y: Feinschliff UX und Barrierefreiheit

Prüferin: Lena Hartwig (UX-Research, Barrierefreiheit, Tests mit Senioren). Datum: 26.10.2026. Dauer: etwa zehn Minuten.
Grundlage: Brief, Telefon-Streifen Y (9 Bildschirme), Y ohne Muster-Ebene (tel-01), Schreibtisch desk-01 bis desk-08, Zustandsbild,
Quelle docs/profis/essential-plus-vorschau/index.html, start.css, start.js, dna/tokens.css.

## Kurzurteil

- **Drei-Sekunden-Test (Y ohne Muster-Ebene, Telefon):** bestanden. Logo „Brandt, Fensterbau · Köln“, ein Telefon mit dem
  Konfigurator, „Neue Fenster, gut geplant.“, fett „Messen Sie in Ruhe selbst“, eine weiße Pille „Fenster planen“. Wer: klar.
  Was: klar. Was tun: klar. Das Wort „Angebot“ kommt erst im zweiten Satz; für Senioren reicht „Wir melden uns mit Ihrem Angebot“ als
  Belohnung, es steht noch über der Pille.
- **Mit Muster-Ebene (so sieht es der Fensterbauer):** sechs Glas-Chips und ein Schalter auf dem ersten Bildschirm. Für Fensterbauer
  verständlich, sobald der Schalter sagt, dass es eine Vorschau-Ebene ist (Befund 2). Für Hauseigentümer darf sie nie erscheinen; das
  regelt der Kommentar in der Vorlage schon.
- **Tab-Weg = Lesepfad:** ja. Skip-Link → Logo → Schalter → Anrufen → Fenster planen → So geht es → Pfeilkreis (Szene 2) → Fenster
  planen (Bereit) → Anrufen → E-Mail → Anfahrt → Impressum → Datenschutz → fensterbau-brandt.de. Die Leiste ist aria-hidden mit
  tabindex -1, also kein zweiter Weg. Fokus unter dem Vorhang wird per focusin in die Mitte geholt (start.js), gut für 2.4.11.
- **Fokus sichtbar:** 2 px Umriss in --fokus (Weiß auf dunkel, Schwarz auf hell) mit 3 px Abstand, für Pillen, runde Knöpfe, Schalter
  und Logo. Auf der weißen Pille im Dunkeln bleibt ein schwarzer Spalt zwischen Pille und Ring, der Ring ist erkennbar. Im
  Zustandsbild ist die Fokus-Zeile von der Ruhe-Zeile kaum zu unterscheiden; einmal am Gerät gegenprüfen (Befund 10).
- **Überschriftenfolge:** h1 → h2 Betrieb → h3 Planen → h2 So geht es → h3 ×4 → h3 Offen → h2 Weg → h2 Bereit → h2 Kontakt. Sauber.
- **Kontrast (gemessen):** Silbergrau #a8a4a9 auf Anthrazit #202022 = 6,6:1, auf Schwarz = 8,1:1, auf Kachel #363638 = 4,9:1;
  Textgrau #6b676c auf Weiß = 5,6:1; Gold #d8ad55 als Text kommt nicht vor (nur als Fläche mit Schwarz darauf = 9,5:1, und als
  Haken-Zeichen auf Weiß, abgedunkelt #ae8c46 = 3,2:1, als Grafik ab 3:1 erlaubt). Koralle-Chip mit Schwarz = 8,3:1. Alles ab 4,5:1
  für Text; einziger Prüfpunkt ist „Foto folgt“ in 12 px auf der Textur (Befund 8).
- **Ziele:** Schalter 44, runder Anrufen-Knopf 44, Logo 44 hoch, Pfeilkreis 52, Kontaktwege 52, Fußlinks 15 px Innenabstand oben
  und unten plus 14 px Schrift = 44. Erfüllt 2.5.8, meist auch 2.5.5.
- **Du/Sie:** Seite durchgehend „Sie“, ein Satz kündigt das „du“ des Konfigurators an (Befund 7).

## Befunde nach Wirkung

### 1. Fotoplätze „Foto folgt“ beim echten Betrieb (Muss)
- **Wo:** Szene 2, Bento, fünf `figure.ez-foto` mit `figcaption` „Werkstatt, Foto folgt vom Betrieb“, „Montage, Foto folgt“ usw.;
  Glas-Chips „Foto 2 von 6“ bis „Foto 6 von 6“ (`ez-glaschip`, nicht `ez-muster`, also auch in Y-aus sichtbar); Kommentar der Vorlage.
- **Was:** Als Muster für Fensterbauer tragen die Platzhalter („noch nicht“ als Schraffur, Zähler bis 6). Beim echten Betrieb wirken
  fünf Kacheln „Foto folgt“ auf Hauseigentümer wie eine unfertige Seite und „Foto n von 6“ ist Paketsprache, die ein Kunde nicht
  deuten kann. Screenreader hören fünfmal „Abbildung: Werkstatt, Foto folgt“. Zwei meiner Senioren würden fragen, ob der Betrieb
  noch existiert. Die Vorlage sagt nicht, was ohne Foto geschieht; das Bento-Raster ist fest auf fünf Plätze gelegt
  (`grid-template-areas`).
- **Wie:** In den Vorlagenkommentar: „Eine Kachel ohne Foto wird weggelassen, nie leer veröffentlicht; mit 0 bis 5 Fotos ordnet sich das
  Bento neu (Varianten für 2, 3, 4, 5 Kacheln in start.css, ohne Foto entfällt der Block ganz und die Karte ‚Alles, was Sie planen‘
  steht allein).“ Die Chips „Foto n von 6“ und die Schraffur in die Muster-Ebene verschieben (`class="ez-glaschip ez-muster"`),
  damit sie mit dem Schalter verschwinden. `figcaption` beim echten Betrieb nur die Bezeichnung („Werkstatt“), das Foto bekommt
  `alt` vom Betrieb (data-vorlage="firma.foto.2.alt"). Bühne (Foto 1): ohne Foto bleibt Beton im Fensterlicht, das ist in Ordnung.
- **Warum:** WCAG 1.1.1 (Textalternative beschreibt das Bild, nicht den Status), 1.3.1; Vertrauen ist das Produkt dieser Seite.

### 2. Schalter der Muster-Ebene: Name wechselt, „Ihres“ bleibt unklar (Muss)
- **Wo:** Kopf, `button#muster-schalter`: sichtbar „Ihres markiert“ (an) / „Ihres zeigen“ (aus), dazu `aria-pressed` und ein
  versteckter Zusatz „: Muster-Etiketten zeigen, was im Paket Essential Plus zum Betrieb gehört“.
- **Was:** Ein Umschalter mit `aria-pressed` braucht einen festen Namen; hier ändert sich der Name mit dem Zustand, Screenreader
  sagen „Ihres markiert … Umschalter, gedrückt“ und „Ihres zeigen … nicht gedrückt“, zwei Zustandsangaben auf einmal. Für
  Fensterbauer ist „Ihres“ ohne Bezugswort rätselhaft, und nichts sagt, dass die Chips eine Vorschau sind, die ihre Kunden nie sehen.
  Im Zustandsbild (unten) erscheinen beide Beschriftungen zugleich („Ihres markiertIhres zeigen“) mit leerem Punkt; vermutlich ein
  Artefakt der Montage, trotzdem prüfen.
- **Wie:** Fester sichtbarer Name „Ihr Anteil zeigen“ (unter 420 px „Ihr Anteil“), Zustand nur über Punkt und `aria-pressed`.
  Versteckter Zusatz: „Etiketten an allem, was im Paket Essential Plus Ihrem Betrieb gehört. Ihre Kunden sehen diese Etiketten
  nicht.“ Wenn der Inhaber zwei Wörter will: „Ihr Anteil“ an / aus als Punkt, nie als Textwechsel.
- **Warum:** WCAG 4.1.2 (Name, Rolle, Wert), 2.4.6; ARIA Authoring Practices, Toggle Button: „the label does not change when the
  state changes“.

### 3. Links ohne Ziel in der Muster-Seite (Muss)
- **Wo:** `href="#"` mit preventDefault (start.js): „Fenster planen“ dreimal, Pfeilkreis, Leiste, „Anrufen“ im Kopf und in der
  Kontaktkarte, „E-Mail“, „Anfahrt“, „Impressum“, „Datenschutz“, „fensterbau-brandt.de“.
- **Was:** Auf der Verkaufsseite klickt der Fensterbauer die Pille, und nichts geschieht, kein Hinweis, kein Sprung. Er hält den
  Konfigurator für kaputt oder die Demo für hohl. Screenreader-Nutzer landen auf einem Link, der nichts tut, ohne Erklärung.
- **Wie:** In der Vorschau: „Fenster planen“ und Pfeilkreis auf die Demo-Instanz des Konfigurators (`data-vorlage="ziel.konfigurator"`
  bleibt, Vorschau-Wert ist die Demo-Adresse). Kontaktwege mit echten Platzhalter-Schemata: `href="tel:+49221123456"`,
  `href="mailto:info@fensterbau-brandt.de"`, Anfahrt auf eine Karten-Adresse; Rechtslinks auf die Rechtsseiten der Demo. Wenn ein Ziel
  in der Vorschau wirklich fehlen muss: `<a href="#" aria-describedby="muster-hinweis">` plus eine kurze, sichtbare Rückmeldung beim
  Klick („Muster: das Ziel setzt der Betrieb“), nicht stummes Verschlucken.
- **Warum:** WCAG 2.4.4 (Linkzweck), 3.2.1/3.2.2 (Vorhersehbarkeit); Fehlerweg ohne Rückmeldung.

### 4. Telefonnummer als Held ist nicht antippbar (Muss)
- **Wo:** Szene 5, Kontaktkarte, `<dd data-vorlage="firma.telefon">0221 123456</dd>` (groß, dünn, Held der Karte); „Anrufen“ darunter
  als runder Knopf mit `href="#"`.
- **Was:** Senioren tippen auf die große Zahl, nicht auf den kleinen Knopf darunter; am Telefon passiert nichts. Die Zahl ist zwar
  per `user-select: text` kopierbar, das hilft am Handy niemandem.
- **Wie:** `<dd><a href="tel:+49221123456" data-vorlage="firma.telefon">0221 123456</a></dd>`, Link ohne Unterstreichung in der
  Schrift der Zahl, mindestens 44 px hoch; dasselbe für die E-Mail (`mailto:`). Der runde Knopf darf bleiben.
- **Warum:** WCAG 2.5.8 ist erfüllt, aber 1.3.1 (die Zahl ist eine Handlung, nicht nur Text) und die Erwartung aus Tests: „Die
  Nummer ist zum Anrufen da.“

### 5. Landmarken und ARIA ohne Rolle (Kann)
- **Wo:** `header.ez-kopf role="banner"` liegt in `section` in `main`; `footer.ez-fuss role="contentinfo"` liegt in `section` in
  `main`; `div.ez-bento aria-label="Fensterbau Brandt in Bildern"` ohne Rolle.
- **Was:** banner und contentinfo gelten nur als Landmarken, wenn sie auf oberster Ebene stehen; in main verschachtelt bieten
  Screenreader sie nicht in der Landmarkenliste an („zum Fuß springen“ geht ins Leere). `aria-label` auf einem `div` ohne Rolle ist
  nach ARIA 1.2 verboten und wird ignoriert.
- **Wie:** Kopf und Fuß aus `main` herausziehen (der Vorhang-Mechanik zuliebe sonst `role` weglassen und `aria-label` an die
  Szenen lassen); `div.ez-bento` mit `role="group"` oder das Label streichen (die Überschrift „Fenster, Türen und Montage“ reicht).
- **Warum:** WCAG 1.3.1, 2.4.1; ARIA 1.2, „aria-label prohibited on generic“.

### 6. Doppelungen auf dem ersten Bildschirm (Kann)
- **Wo:** Hero: Kicker „Fensterbau Brandt · Köln“, Text „Ihr Team von Fensterbau Brandt“, Unterschrift „Petra Brandt, Geschäftsführung,
  Fensterbau Brandt“, Meta „geht nur an Fensterbau Brandt“, dazu das Logo: fünfmal der Name. Petra Brandt erscheint im Hero und in
  Szene 5 je mit Initialen-Kreis „PB“.
- **Was:** Die Wiederholung bremst Leser mit wenig Lesefluss; zweimal „PB“ ohne Gesicht wirkt wie ein Platzhalter, nicht wie eine
  Person.
- **Wie:** Hero-Unterschrift „Petra Brandt, Geschäftsführung“ (ohne drittes „Fensterbau Brandt“); Kicker darf bleiben, weil er den
  Ort trägt. Vorlage: Foto der Ansprechpartnerin als Regel (`firma.ansprechpartner.bild`), Initialen nur als Rückfall; im Kontakt
  bleibt die Person, im Hero reicht die Unterschrift.
- **Warum:** WCAG 3.1 (Verständlichkeit), Lesbarkeit; Vertrauen durch Gesicht statt Kürzel.

### 7. Satz über das „du“ des Konfigurators (Kann)
- **Wo:** Szene 3, Einleitung: „In den Messschritten spricht der Konfigurator Sie kurz mit ‚du‘ an, damit jede Anleitung knapp bleibt.“
- **Was:** Ehrlich, aber eine Erklärung über die Seite selbst; ältere Leser stolpern („Warum duzt mich eine Firma?“) noch bevor sie
  gestartet sind. Die Seite bleibt sonst sauber in der Sie-Form.
- **Wie:** Streichen oder weichmachen: „Die Anleitungen im Konfigurator sind bewusst kurz gehalten.“ Wenn der Hinweis bleiben soll,
  dann als Nebensatz beim Schritt „Messen“, nicht in der Einleitung.
- **Warum:** WCAG 3.1.5 (Lesbarkeit), Tonalität; Tests: Meta-Sätze werden als Entschuldigung gelesen.

### 8. Kleine Schriften und ein Kontrast auf Textur (Kann)
- **Wo:** `.ez-logo__wort small` 11 px Versalien „FENSTERBAU · KÖLN“; `dna-label` und Chips 12 px; `.ez-foto__text span` „Foto folgt“
  12 px Silbergrau über der Textur-Kachel; Fußzeile „Konfigurator von eeziframes“ 13 px.
- **Was:** 11 px Versalien mit Sperrung sind für Senioren am Telefon nicht lesbar, sie lesen „Brandt“ und raten den Rest; „Foto folgt“
  liegt auf einem Verlauf, dessen helle Stellen den Kontrast unter 4,5:1 drücken können (Silbergrau auf #363638 = 4,9:1, knapp).
- **Wie:** Logo-Zeile 12 px, Chips 13 px, Fußzeile 14 px; „Foto folgt“ auf dem dunklen Band unter der Schraffur messen (Kontrast-
  Werkzeug aus dem Begleit-Skill), bei Bedarf Weiß mit 70 % statt Silbergrau. Entfällt zum Teil mit Befund 1.
- **Warum:** WCAG 1.4.3 (Kontrast), 1.4.4 (Vergrößern); Erfahrung aus Tests: unter 12 px liest niemand über 65.

### 9. Erreichbarkeit ohne Zeiten (Kann)
- **Wo:** Szene 5, Text „Sie erreichen uns werktags im Büro in Köln.“ und Kontaktkarte (Telefon, E-Mail, Anschrift).
- **Was:** Senioren rufen an, und zwar zu einer Uhrzeit; „werktags“ ohne Zeiten erzeugt Fehlanrufe und die Angst, zu stören.
- **Wie:** Eine Zeile in der Kontaktkarte `data-vorlage="firma.zeiten"`: „Mo–Fr 8–17 Uhr“, im Fließtext „Sie erreichen uns werktags
  von 8 bis 17 Uhr.“ Wer keine Zeiten pflegt, lässt die Zeile weg (Vorlage: leer = weg).
- **Warum:** WCAG 3.3.5 (Hilfe) im Geist; Erwartung an eine Betriebsseite.

### 10. Leiste und Zustände einmal am Gerät gegenprüfen (Kann)
- **Wo:** `.ez-leiste` (aria-hidden, tabindex -1) mit sichtbarer Pille „Fenster planen“; Zustandsbild, Zeile „Fokus“ und Zeile
  „Kopf mit Schalter an/aus“; Hover der leisen Pille „So geht es“ wird goldgefüllt.
- **Was:** Tastaturnutzer sehen in der Leiste eine Pille, die sie nicht erreichen können (bewusst, die Hero-Pille ist im Tab-Weg;
  aber beim Hochscrollen ist die Hero-Pille weit weg). Die Fokus-Zeile im Bild unterscheidet sich kaum von Ruhe. Die goldene
  Hover-Füllung macht aus der leisen Pille eine zweite volle, farbige Pille (die DNA will genau eine, nie farbig); Mausnutzer sehen
  kurz zwei Hauptaktionen.
- **Wie:** Leiste: Pille erreichbar machen, sobald die Leiste da ist (`aria-hidden` und `tabindex` per JS nur setzen, solange
  `.ist-da` fehlt); Fokus am Gerät prüfen (Ring 2 px Weiß, Abstand 3 px, auf der leisen Pille gut sichtbar?); Hover der leisen Pille
  als Umriss-Aufhellung oder Anthrazit-Füllung statt Gold.
- **Warum:** WCAG 2.1.1 (Tastatur), 2.4.7 (Fokus sichtbar), 2.4.11; DNA-Regel „eine Pille je Bildschirm, nie farbig“.

## Muss und Kann

- **Muss:** 1 (Fotoplätze beim echten Betrieb), 2 (Schalter: fester Name, „Ihr Anteil zeigen“, Vorschau-Hinweis), 3 (Links ohne
  Ziel in der Muster-Seite), 4 (Telefonnummer als tel-Link).
- **Kann:** 5 (Landmarken, ARIA), 6 (Doppelungen), 7 (du-Satz), 8 (Schriftgrößen, Kontrast auf Textur), 9 (Zeiten), 10 (Leiste,
  Fokus und Hover am Gerät prüfen).

Nicht beanstandet: Tab-Weg, Überschriftenfolge, Fokus-Mechanik unter dem Vorhang, Kontraste der Grundfarben, Zielgrößen,
Sie-Form, versteckte Bildbeschreibung der Bühne (`figcaption.ez-unsichtbar`), `aria-hidden` an Glas-Chips, Minis und Zeichen
(der sichtbare Text trägt den Inhalt), Seitentitel und Beschreibung.

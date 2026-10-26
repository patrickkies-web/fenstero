# Profis · Landingpage des Konfigurators (EEZI Essential) nach Design-DNA · 26.10.2026

Vorschau: `docs/profis/konfigurator-landing-vorschau/` (index.html, start.css, start.js, dna/, fonts/, bilder/), Plätze der
Vorlage in `VORLAGE.md` daneben. Artifact: https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM (privat). Bilder:
`docs/profis/bilder/2026-10-26-konfigurator-landing-{tel,desk,desk-reihe,familie,farbprobe}.jpg`. Urteile:
`docs/profis/gremium/2026-10-26-konfigurator-landing-*.md`. Alle Stimmen sind simuliert (getrennte Agenten), kein Realitäts-Check.

## Auftrag

Der Inhaber: Für das Paket EEZI Essential braucht er eine Vorlage für die Seite, die Kunden eines Fensterbauers sehen, wenn sie auf
dessen Website den Knopf zum Konfigurator tippen und auf `<firma>.eeziframes.com` landen. Neutral, je Betrieb mit Logo und
Firmenfarbe zu füllen; eeziframes als Gastgeber klar erkennbar, die Identität des Betriebs gewahrt; einladend, grafisch gut, der
Besucher wird abgeholt und nutzt danach den Konfigurator. Nur Gestaltung, ohne Links und Funktionen. Variable Inhalte kommen im
nächsten Schritt.

Vier Zeilen fürs Gremium: Bereich Startseite einer Essential-Instanz · Wunsch Gastgeber erkennbar, Betrieb bleibt Betrieb ·
Besucher soll verstehen, bei wem er ist, wem seine Daten gehen, dass es nichts kostet, und den Konfigurator starten · Erfolg: Kunden
sagen das richtig in eigenen Worten, Fensterbauer würden die Seite hinter ihren Knopf legen.

## Wahl (selbst entschieden, nach Begleit-Skill Abschnitt 5)

- **Richtung:** mutig, Prinzip der Task-App-Vorlage (Gerät auf Beton im harten Licht) übersetzt: Die Bühne gehört eeziframes
  (Licht fällt durch ein Fenster auf dunklen Beton, wie das Zeichen), das Gerät gehört dem Betrieb (der echte erste Schritt des
  Konfigurators mit seinem Zeichen und seiner Farbe). Die Adresse hängt als Etikett am Gerät. Grundsatz der Vorlage: Die Form
  gehört eeziframes, die Farbe gehört dem Betrieb; eeziframes erscheint nur schwarz-weiß.
- **Szenen:** drei (dunkel, hell, dunkel): Empfang · So geht es · Weg der Anfrage mit heller Karte „Bereit“, Kontakt und Fuß.
  Nicht gebaut: naheliegend (Bausteine der Startseite mit Betriebsfoto als Bühne; ohne eigenes Foto bei Essential leer) und
  überraschend (die Adresse als Riesenwort, „muster-fensterbau“ hell, „.eeziframes.com“ grau; zu laut für den Betrieb).
- **Material:** echte Texte der bisherigen Startseite einer Instanz (`web/assets/einladung.js`, Website-Fassung, Sie), echte
  Renderings des Konfigurators (Startfolie aus „Konfigurator in Violett“), Foto und Modell aus der Startseite, ein neues
  Bühnenbild (FLUX 1.1 pro Ultra, Prompt in `konfigurator-landing-vorschau/bilder/buehne-prompt.md`, Skript
  `docs/profis/werkzeuge/bild-flux.sh`). Keine Preise, kein Wortspiel mit „eezi“ (docs/GESTALTUNG.md: nie im Kundenlink eines
  Betriebs), keine Figurenwelt.

## Szenen und Gene (Endfassung)

| Szene | Inhalt | Gene |
| --- | --- | --- |
| 1 Empfang (dunkel) | Kopf mit zwei Marken (Betrieb links, „Konfigurator von eeziframes“ rechts in Silbergrau), Bühne mit Telefon im Fensterlicht (das Kreuz läuft über das Gerät), Adresse als Etikett an der Gerätekante, „Ihre neuen Fenster, Ihr Angebot.“, Begrüßung mit Danach-Satz und Ansprechpartner, Pille „Fenster planen“, „Kostenlos und unverbindlich. Ihre Anfrage geht nur an …“ | G4, G7, G9, G10, G6, G2 |
| 2 So geht es (hell) | vier dunkle Schrittkarten mit Bild (Foto mit Sucher und Fortschrittsring, Zeichnung mit zwei Breiten, 3-D-Modell mit Farbwahl, Senden an den Betrieb), 5 Minuten als Zahl mit den vier Stationen, „Weiß ich noch nicht“ mit gewählten und schraffierten offenen Wünschen | G5, G8, G3, G1, G10, G14 |
| 3 Weg, Bereit, Fuß (dunkel) | Stationen Sie → eeziframes übermittelt → Betrieb → Angebot, Nachmessen vor Ort, Einbau; helle Karte „Das brauchen Sie. Mehr nicht.“ mit zweiter Pille; Kontaktkarte mit der Telefonnummer als Held und runden Knöpfen; Fuß mit beiden Marken und Adresse | G5, G9, G2, G1, G6, G3, G13, G14 |

## Gremium (eine Runde, blind X/Y; X = bisherige Startseite einer Instanz, Y = neu)

| Gruppe | Ergebnis | Hände | Median | Vetos |
| --- | --- | --- | --- | --- |
| Gestalter | Y 6:0 | Jonas 4 · Lena 3 · Noah 4 · Tobias 4 · Mara 4 · Daniel 3 | 4 | keine |
| Kunden | Y 5 von 6 (Kai keine); verstehen Y: was es ist 5, bei wem 5, Rolle von eeziframes 4, was es kostet 6 (zwei glauben es nicht), was sie tun 5; Abbruch erster Bildschirm nur Kai | Renate 3 · Murat 4 · Sabine 4 · Thomas 3 · Gisela 3 · Kai Faust | 3 | Kai gegen „Jetzt konfigurieren“ |
| Fensterbauer | Y 6:0; kaufen 2 → 3,5, zeigen 2 → 4, seriös 2 → 4; eeziframes als Gastgeber 4:2 richtig | Klaus 3 · Sarah 4 · Deniz 4 · Tobias 2 · Michael 4 · Petra 3 | 3,5 | Tobias zur Zeichnung „Messen“; Petra bedingt („sonst an niemanden“ muss stimmen) |

Konsent ist damit nicht erreicht (Kai Faust, Tobias 2); beide Einwände sind umgesetzt (Knopf umbenannt, Zeichnung neu). Eine
zweite Runde gibt es nach Vorgabe des Inhabers nicht.

## Änderungstabelle

| Wo | Was | Warum | Quelle |
| --- | --- | --- | --- |
| Hauptknopf (Hero, Leiste, Karte „Bereit“) | „Jetzt konfigurieren“ → „Fenster planen“ | dasselbe Wort wie der Knopf auf der Website des Betriebs; „konfigurieren“ klang für drei von sechs Kunden nach Kaufen; Veto Kai | Kunden 4 ändern, Fensterbauer 3 ändern + 1 zurück; Vorrang Kunde |
| Hero, Zeile unter den Knöpfen | „Etwa 5 Minuten … kostenlos und unverbindlich“ → „**Kostenlos und unverbindlich.** Ihre Anfrage geht nur an Muster Fensterbau.“ | Datenweg im ersten Bildschirm | Kunden |
| Hero, Begrüßung und Unterschrift | Danach-Satz zurück, Unterschrift mit Person und Ort (Platz `firma.ansprechpartner`) | Erfolgskriterium „was kommt danach“, wer spricht | Gestalter (Muss Lena, Mara), Kunden, Fensterbauer |
| Kopf | eeziframes in Silbergrau, 15 statt 17 px | der Betrieb steht vorn | Gestalter 4 ändern, Fensterbauer (Sarah) |
| Bühne | Gerät gut ein Drittel größer, flach in 2D statt 3D (Schrift scharf), harter Schlagschatten mit Lichtkante, das Fensterkreuz läuft über das Gerät, Etikett ohne Punkt an der Gerätekante | Held lesbar, Idee sichtbar, Etikett sah aus wie ein Suchfeld | Gestalter, Kunden, Vorlagen (Material 1, 2; Frontend 1) |
| Hero, Bewegung | 100–400 ms nur das Etikett, Überschrift ab 420 ms, Pille zuletzt (840–1320 ms); Auftritt auch unter der Falz; Druck auf iOS | eine Bewegung zur Zeit; Safari | Feinschliff Bewegung |
| Hero, Höhe am Telefon | Begrüßung drei Zeilen, Bühne 10:7, Kopf 64 px: Pille 606–658 px | auf iPhones mit Safari-Leisten (664 px) ganz sichtbar | eigene Messung |
| Schritt 2 „Messen“ | zwei ineinanderliegende Rechtecke, Öffnung und Fenster je als Breite bemaßt; Wand ohne Schraffur | Veto: senkrecht/waagrecht las sich als Höhe/Breite; Schraffur heißt „offen“ | Fensterbauer (Veto Tobias), Zeichen 4 |
| Schrittkarten | kürzere Texte, Nachmessen in „Messen“, „Gesendet“ als Zustand statt weißer Pille | Angst, falsch zu messen; nichts sieht nach Knopf aus | Kunden, Typografie, Zeichen |
| 5-Minuten-Karte | Stäbchen „erledigt/hier/später“ → die vier Stationen wie im Konfigurator | vor dem Start ist nichts erledigt | Fensterbauer 5 ändern, Kunden |
| „Weiß ich noch nicht“ | Vermerk „Beispiel“, gewählte Wünsche als Zustand in der Firmenfarbe, offene schraffiert und gestrichelt, kein Warnfarben-Badge | Chips sahen aus wie Knöpfe bzw. Warnung | Gestalter, Kunden (Kai), Zeichen |
| Weg der Anfrage | „sonst an niemanden“ gestrichen (Unterauftragnehmer, KI mit Einwilligung) → „ohne Werbung und ohne andere Anbieter“; Haken „Vor der Fertigung wird nachgemessen“; „Nachmessen vor Ort (Feinaufmaß)“ mit Platz für die Kosten; Linie und Knoten sauber | Ehrlichkeit, Fachwörter einfach | Fensterbauer (Petra), Gestalter (Daniel), Kunden, Zeichen |
| Kontaktkarte | Telefon als Held (32 px), E-Mail und Anschrift ausgeschrieben, keine Lücke am Schreibtisch | Kunden wollen anrufen; Zahl als Held | Kunden, Gestalter, Typografie |
| Firmenfarbe | `--firma-licht`, `--hinweis`, `--auf-firma`, `--firma-tief` mit Regeln; Leuchten der 5-Minuten-Karte und Chips hingen fest an Violett/Indigo (behoben) | jede Firmenfarbe ohne Handarbeit | Gestalter (Muss Tobias), UX 4, Farbprobe |
| Sprunglink, Fußlinks, Überschrift Kontakt | Ziel `#inhalt` mit sichtbarem Ring, Fußlinks 44 px, „Fragen vorab?“ als h3 | Tastatur, Ziele ab 44 px | UX |
| Leuchten, dunkle Karten, Glas | Leuchten ohne Plateau (Rezept §3), Karten nach G14, Glas `blur(12px)` ohne Sättigung | Material statt Umriss | Vorlagen (Material 3, 4; Frontend 3) |
| Laden | Inter als Teilmenge (3 KB statt 48 KB), Bilder in Anzeigegröße (250 → 180 KB), `will-change` nur beim Auftritt | Leistung | Vorlagen (Frontend 2, 4, 5) |

Nicht übernommen, mit Grund:

- Kicker „Muster Fensterbau · Musterstadt“: Der Ort steht in der Unterschrift (Fensterbauer, Kunden).
- „Bereitgestellt von“ statt „Powered by“: Das ist der Wortlaut der Kennzeichnung in `pakete.js` (Typografie).
- Hero-Zeile nur „Kostenlos und unverbindlich“: Die Kunden wollen „geht nur an …“ im ersten Bildschirm (Typografie, Vorrang Kunde).
- Absatz im Weg nur „sieht niemand etwas davon“: Das stimmt nicht, denn der Server hält den Zwischenstand. Stattdessen steht dort
  ein belegbarer Satz in drei Zeilen (Vorlagen).
- Wünsche-Modell auf Anthrazit, Stäbchen nach vier Schritten gruppiert: Minderheiten (Gestalter).
- Neues Bühnenfoto mit Relief statt Sprenkeln: offen, siehe unten (Vorlagen, Material 5).

## Blickprotokoll (Telefon, erster Bildschirm)

- Vorher (X): Waschbären → „geplant“ → Pille.
- Nachher (Y): Bühne mit Etikett „muster-fensterbau.eeziframes.com“ → Überschrift → Pille, darunter „Ihre Anfrage geht nur an …“.

## Farbanteile (Endfassung, je Pixel der nächsten Farbe zugeordnet, `farben.py`)

Vorgabe Seite: S 42, W 26, A 16, G 9 (±3), Violett 3,5, Koralle 2, Indigo 1,5 (±1), Farbe gesamt etwa 7, je Bildschirm höchstens 12.

Telefon 390 × 844:

| Bildschirm | Neutral % | Violett | Koralle | Indigo | Farbe gesamt |
| --- | --- | --- | --- | --- | --- |
| 1 Empfang | 98,8 (S 61 · A 13 · G 12 · W 14) | 0,5 | 0,2 | 0,4 | 1,2 |
| 2 So geht es | 98,4 (S 30 · A 13 · G 13 · W 42) | 0,2 | 0,1 | 0,1 | 1,6 |
| 3 Senden, 5 Minuten, offen | 89,6 (S 14 · A 26 · G 9 · W 41) | 2,7 | 0,1 | 7,4 | 10,4 |
| 4 Weg | 97,2 (S 47 · A 43 · G 6 · W 1) | 0,5 | 1,5 | 0,9 | 2,8 |
| 5 Bereit | 95,3 (S 19 · A 20 · G 4 · W 52) | 1,8 | 0,0 | 2,8 | 4,7 |
| 6 Kontakt, Fuß | 94,5 (S 44 · A 33 · G 4 · W 13) | 2,2 | 0,0 | 3,4 | 5,5 |
| **Seite** | 95,6 (S 36 · A 25 · G 8 · W 27) | 1,3 | 0,3 | 2,5 | 4,4 |

Schreibtisch 1280 × 800: Seite 97,5 (S 45 · A 14 · G 5 · W 33), Violett 0,5, Koralle 0,1, Indigo 1,4, Farbe gesamt 2,5;
Bildschirm 3 bei 7,4, alle übrigen unter 3,6.

Abweichungen von der Vorgabe:

- Am Telefon liegt Anthrazit mit 25 neun Punkte über der Vorgabe, Schwarz mit 36 drei Punkte darunter. Ursache sind die dunklen Karten
  nach G14 (Weg, Kontakt, 5 Minuten). Eine schwarze Fassung lag in der Toleranz (S 44, A 18), wirkte im Abgleich mit den Vorlagen
  aber wie ein Drahtrahmen; der Begleit-Skill schreibt G14 vor.
- Violett und Koralle liegen wie bei der Startseite darunter: Leuchten ohne Plateau zählt dunkel als Indigo. Mehr satte Fläche
  hieße Leuchten ohne Wert.
- Am Schreibtisch liegt Weiß sieben Punkte darüber (lange helle Szene „So geht es“).

Der Inhaber entscheidet, ob Pixelzählung oder Eindruck gilt (Begleit-Skill §2).

## Messwerte (Endfassung)

- Genau eine volle Pille je Bildschirm. Am Telefon steht sie bei 606–658 px: im unteren Drittel bei 844 px und ganz sichtbar bei
  664 px (iPhone mit Safari-Leisten).
- Nach 2,6 s laufen 0 Animationen. Layoutsprung 0. Laden 0,3 s bei vierfach gedrosselter CPU; eine lange Aufgabe mit 72 ms.
- Bilder 180 KB, Schriften Outfit und Inter als Teilmenge.
- Kein `filter: blur` auf Flächen. Es gibt drei `backdrop-filter` mit 12 px (Leiste, Adress-Etikett, Glas-Chip im Foto) und
  0 lazy-Bilder.
- Ruhige Fassung und ohne JavaScript steht alles sofort. Keine Konsolenfehler, kein Querscrollen.
- Ziele ab 44 px (die Fußlinks sind nachgebessert). Tab-Weg: Zum Inhalt springen, Fenster planen, So geht es, Fenster planen,
  Anrufen, E-Mail, Website, Impressum, Datenschutz.
- Familientest neben Startseite und „Konfigurator in Violett“ (`2026-10-26-konfigurator-landing-familie.jpg`): Die Seite gehört
  sichtbar zur selben Familie und steht zwischen beiden. Sie ist an keiner Stelle flacher als die Startseite: Gerät im Licht,
  Werte an der Sache, Stationen, Zahl als Held.
- Farbprobe mit Gold, Rot, Dunkelblau, Grün, fast Schwarz und Gelb (`2026-10-26-konfigurator-landing-farbprobe.jpg`,
  `docs/profis/werkzeuge/konfigurator-landing-farbprobe.mjs`): Die Schrift auf dem Zeichen hat mindestens 5,4:1, das Leuchten ist
  bei Dunkelblau und fast Schwarz aufgehellt und bei Gold und Gelb abgedunkelt, die Hinweise sind bei Rot grau.
- Prüfsuite (`node scripts/pruefen.mjs`, voller Lauf): 1.093 Prüfungen bestanden, zwei fehlgeschlagen, Abbruch in Abschnitt 21.
  - „Vertrag widerrufen“ fehlt auf `/fuer-fensterbauer/`.
  - Der KI-Dialog nennt Anthropic Ireland, die Löschung und den Widerruf nicht wie erwartet.
  - In Abschnitt 21 stürzte ein Seitenskript ab, wo es bei den 3-D-Teilen ein Element nicht fand.

  Dieser Zweig ändert nichts unter `web/`, `functions/` oder `scripts/`; die Fehler stammen also nicht von der Landingpage. Die
  Ursache ist nicht untersucht.

## Was offen ist

- **Logo und Firmenfarbe bei Essential:** Laut `pakete.js` hat Essential weder Logo noch Firmenfarbe, beides gehört zu Plus.
  Die Vorlage hält die Plätze trotzdem bereit. Entscheidung des Inhabers.
- **Adresse `<firma>.eeziframes.com`:** Bisher sehen die Instanzen eigene Domains der Betriebe vor (docs/INSTANZEN.md); unter
  eeziframes.com laufen nur die Demo-Instanzen. Für Subdomains muss je Betrieb eine Custom Domain am Worker eingerichtet werden.
  Nicht umgesetzt.
- **Übertragung in die Instanz:** Die Seite ist nur Vorschau. Die Startansicht einer Instanz baut heute `web/assets/einladung.js`.
  Ziele der Knöpfe, Kontaktlinks, `lang` und „Weiter planen“ kommen erst mit der Übertragung, nur auf Wunsch.
- **Knopftext:** „Fenster planen“ weicht hier von „Jetzt konfigurieren“ ab, das für die Startseite gilt. Auf Wunsch ist es eine
  Zeile.
- **Bühnenfoto:** Ein neues Rendering mit Relief statt Sprenkeln und ohne Nähte steht noch aus (Vorlagen, Material 5; Zusatz im
  Prompt notiert). Danach `--k1` und `--k2` neu rechnen.
- **Realitäts-Check:** zwei bis drei echte Menschen, mindestens ein Fensterbauer, fünf Minuten, ohne Hilfe.
  - „Bei wem sind Sie hier, und wer bekommt Ihre Angaben?“
  - „Was kostet das?“
  - „Was würden Sie jetzt tun?“

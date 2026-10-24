# Häufige Fragen (#haeufige-fragen)

Seite: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`) · Position: 13 von 15 (Anhang A2, nach A1 Live-Demos, vor A3 Hintergrund) · Intensitätsstufe: 1 ruhig (Typ T9 Häufige Fragen; Muster für alle Fragenlisten der Website)

Kürzel: ZA = 08-zielarchitektur, EV = 07-expertenvergleich, PE = 10-paketentscheidung, DG = 02-design-grammatik, EA =
04-entscheidungsarchitektur, IA = 05-informationsarchitektur, PA = 01-projektanalyse, SG = design-dna/04-styleguide, DNA-B =
design-dna/05-ergebnis-b-styleguide, GEST = docs/GESTALTUNG.md, SKILL und DR = premium-gestaltung/SKILL.md und designrichtung.md, VK =
`web/fuer-fensterbauer/index.html`. **[V]** verbindlich, **[H]** Hypothese. Zeilenzahlen, Höhen und Farbanteile sind an einem Modell
im Arbeitsverzeichnis mit der Inter-Datei des Projekts gemessen (Chromium, 390 × 844), nicht an Besuchern.

## A. Abschnitt und Funktion

| Merkmal | Festlegung |
|---|---|
| Name, ID | Häufige Fragen, `fb-13-haeufige-fragen`; Anker `#haeufige-fragen` an der h2 (Pflicht, `scripts/pruefen-instanzen/29.mjs:112`) |
| Lage | Anhang A2; Telefon Bildschirm 12–13 bei 664 px (ZA 8.3.2 a). Davor A1 Live-Demos (Stufe 1, zwei Zeilen und Ring), danach A3 Hintergrund (Stufe 1, dieselben Zeilen), dann A4 Abschluss (Stufe 2, Cream). Rhythmus 1 · **1** · 1 · 2 |
| Ziel | Restzweifel sammeln, die im Fluss keinen Platz haben (IA V12); die Antworten am Ort des Zweifels ersetzt der Abschnitt nicht (EA 4.6.3) |
| beantwortete Frage | „Und was ist mit …?“ (Stufe S5 Absichern) |
| vorbereitete Entscheidung | Restzweifel ausräumen, damit der Abschluss A4 (Z1a „anfragen“, in Zustand B Z1 „bestellen“) ohne offene Frage erreicht wird; Zweifel F-02, F-04, F-05, F-06, F-09, F-10, F-16, F-25, F-31 (EA 4.6.1) |
| bewusst nicht | keine neuen Aussagen; keine Preise (vorläufig, PE J-R18; die Antwort verweist auf die Karten); keine Cream; kein Bild; keine Suche, Reiter oder Kategorien bei acht Fragen; „Unterschied der Pakete“ und „Dauer“ (im Fluss beantwortet, IA V12); nichts zu offenen Punkten F-12 (EA O-15), F-21, F-29 (EA O-24) |

## B. Konkreter Inhalt

**Überschrift [V].** h2 wörtlich „Häufige Fragen“ (VK:235), Markup `<h2 id="haeufige-fragen">Häufige <span class="ak">Fragen</span></h2>`;
das grüne Wort ändert den Wortlaut nicht. Kein Kicker, keine Abschnittsnummer (Anhang, E-AB-10), kein Lead.

**Acht Fragen [V].** Fragen wörtlich aus VK:237-241, :243-245 (die Prüfsuite verlangt dort die Wörter Domain, kündigen, Datenschutz,
Kunde, Website, `29.mjs:116-117`). Die Antworten erfüllen die Regel „höchstens fünf Zeilen“ (ZA A2; DG T9) bei 358 px Textbreite nur
gekürzt; die Kürzungen sind **Textentwurf**, gebildet nur aus dem Bestand, und gelten zugleich für HTML und JSON-LD (IA 5.1.5). Fett =
`<strong>` in `--text`.

| Nr., `id` | Frage (wörtlich) | Antwort | Herkunft | Zeilen 358 / 593 px |
|---|---|---|---|---|
| 1 `hf-kosten` | Was kostet ein eigener Fenster-Konfigurator? | **Textentwurf** „Eine Einrichtungsgebühr vorab, danach ein fester [Monatspreis je Paket](#pakete), netto zuzüglich Mehrwertsteuer. Keine Gebühr je Anfrage, keine Kosten für Programmierung, Server oder Pflege.“ | VK:237 | 5 / 3 |
| 2 `hf-domain` | Brauche ich eine eigene Domain? | **Textentwurf** „**Nein**, die sichern wir für Sie, etwa ihr-name-fenster.de, sofern sie frei ist, samt Zertifikat. Wem sie gehört und was nach einer Kündigung geschieht, regeln die [Paketbedingungen](/konfigurator-bedingungen/#domain).“ | VK:238; PB § 6 | 5 / 3 |
| 3 `hf-website` | Brauche ich eine Website? | **Textentwurf** „**Nein.** Ihr Konfigurator ist selbst eine Seite unter Ihrer Domain; den Link teilen Sie per E-Mail, bei Google oder auf dem Firmenwagen. Mit Website gibt es zum Livegang einen Knopf „Fenster planen“.“ | VK:239 | 5 / 3 |
| 4 `hf-kunde` | Was sieht mein Kunde? | **Textentwurf** „Ihren Konfigurator mit Ihrem Namen, je nach Paket mit Logo, Farbe und Fotos; keine Preise, keine Werbung, keine anderen Betriebe. Er bekommt seine Anfrage als PDF, Ihre Antwort geht direkt an ihn.“ | VK:240 | 5 / 3 |
| 5 `hf-datenschutz` | Wer ist für den Datenschutz verantwortlich? | **Textentwurf** „**Sie.** eeziframes verarbeitet die Anfragen Ihrer Kunden in Ihrem Auftrag, der Vertrag dazu kommt mit der Bestellung. Impressum und Datenschutzerklärung erstellen wir; die Daten liegen bei Supabase in Frankfurt.“ | VK:241 | 5 / 4 |
| 6 `hf-kuendigung` | Kann ich kündigen oder das Paket wechseln? | **Textentwurf** „**Ja.** Das Abo beginnt mit dem Livegang: monatlich kündbar, ohne Mindestlaufzeit. Wechsel auf Anfrage, nach oben gegen die Differenz der Einrichtungsgebühr, nach unten zum Monatsende.“ | VK:243; PE J-R15 | 5 / 3 |
| 7 `hf-kundenlinks` | Ich nutze eeziframes schon mit Kundenlinks. Ändert sich etwas? | wörtlich VK:244, nur „**Nein.**“ fett | VK:244 | 5 / 3 |
| 8 `hf-genauigkeit` | Ist ein Kundenaufmaß genau genug fürs Angebot? | **Textentwurf** „**Fürs erste Angebot ja:** je Fenster drei Breiten und drei Höhen der Maueröffnung, das kleinste Maß zählt, Abweichungen werden markiert. Vor der Fertigung messen Sie nach; das Feinaufmaß bleibt bei Ihnen.“ | VK:245 | 5 / 3 |

Weggelassen sind nur Nebensätze („ganz nach Ihrem Wunsch“, „.app“, „eine Bestätigung“, „Die Einzelheiten stehen in den
Paketbedingungen“); jede Tatsache, die die Frage beantwortet, bleibt. Fett steht nur das Ja, Nein oder Sie am Anfang (DR 3.2 „das
Entscheidende in `--text`“). **Entfallen** (VK:236, :242): „Was unterscheidet die drei Pakete?“ beantworten Unterschiedszeile und
Entscheidungshilfe (fb-06, fb-07), „Wie schnell …?“ der Ablauf mit „meist 3 bis 5 Werktage“ (fb-10). Vor dem Löschen prüfen, dass
„Aufmaßblatt-PDF per E-Mail“, „Dashboard mit persönlichen Einladungslinks“ und „hängt an Domain und Freigabe“ dort stehen.

**JSON-LD [V].** `FAQPage` (VK:29-39) mit genau diesen acht Paaren in derselben Folge, Antworttext = sichtbarer Text ohne Tags
(`scripts/pruefen.mjs:1739-1748`). Nach dem Umbau `stand` in `functions/seo.js:24` erneuern.

**Weiterweg (Festlegung fb-13, [H]).** Unter der Liste ein Textlink 15 px fett, **Textentwurf** „Ihre Frage ist nicht dabei? Fragen Sie
uns“ → `#frage` mit `data-paket=""` (Paket „Noch offen“, `functions/pakete-seite.js:174`; Formular in beiden Zuständen unter
`h3#frage`, `:194`, `:196`). Gleiches Muster wie der Gesprächsweg der Pakete (PE J-R20). ZA nennt für A2 keine Handlung; der Link kommt
dazu, weil der Kopf-Ring nach 04 „Paket anfragen“ heißt und für eine bloße Frage nicht passt (EA W4). Rückfall: ohne Link.

**Interaktionen.** Öffnen und Schließen jeder Frage; mehrere gleichzeitig offen; Sprung auf eine Frage über `#hf-…` öffnet sie; zwei
Textlinks in Antworten; der Weiterweg.

**Vorhandene Komponenten.** `details.rg-frage` (VK:236-245; `web/assets/ratgeber.css:128-134`, Druck :168-171), `.link`
(`web/assets/gemeinsam.css:67`), `.ak` (:47), `:focus-visible` (:38), Tokens (:9-32), `scroll-margin-top: 76px` an `.rg h2[id]`
(`web/assets/verkauf.css:8`), Haarlinie und Zähler von `.vk-teil` (:501-502), Paket-Vorwahl über `a[data-paket]`
(`web/assets/verkauf.js:28-35`).

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Satzbau G2 ohne Held: Haarlinie → h2 → Liste → Weiterweg. Ein flacher Stapel gleichrangiger Zeilen an der
Ordnungslinie x = 16, getrennt durch Haarlinien statt Karten (DG-AB-19). Asymmetrie aus Text links und dem Zeichen „+“ rechts als
schmale zweite Kante; keine Achse. Arbeitsansicht nach DNA-B B.1: Linie und flache Bedienschicht sind Pflicht, Anker und Sprung
nicht. Hauptelement ist Typografie (Ausnahme DG-E-1 C: Hierarchie über Gewicht und Tonwert).

**Telefon 390 × 844, 4 Spalten** (je 77,5 px, Abstand 16); alle Elemente über die Spalten 1–4, y ab der Haarlinie, alle Zeilen
geschlossen:

| y | Element | Maß, Ausrichtung |
|---|---|---|
| 0 | Haarlinie des Abschnitts | 1 px `--line`, x 16–374 |
| 24–58 | h2 „Häufige Fragen“, eine Zeile | 32 px / 1,05, 800, −0,03 em; ≈ 240 px breit; „Fragen“ `--accent` |
| 82 | Haarlinie über der Liste | 1 px `--line` |
| 83–157 | Zeile 1 Kosten (Frage zweizeilig) | 74 + 1 px Linie |
| 158–316 | Zeilen 2–4 Domain, Website, Kunde | je 52 + 1 |
| 317–616 | Zeilen 5–8 Datenschutz, Kündigung, Kundenlinks, Genauigkeit (zweizeilig) | je 74 + 1 |
| 632–676 | Weiterweg | 15 px fett, Ziel 44 hoch, ≈ 300 px breit, x 16–315 |
| **Ende 676** | **0,80 BH**; danach 96 px bis A3 | ZA plant 0,65 BH unter der Annahme von acht einzeiligen Zeilen; gemessen brechen fünf Fragen bei 318 px Textbreite zweizeilig (Festlegung fb-13) |

**Zeile.** `summary` volle Breite 358 px, Text x 16–334 (318 px), Innenabstand 15 px oben und unten: einzeilig 15 + 22 + 15 = 52 px
(Kontrollhöhe `--h2`), zweizeilig 74 px. Zeichen „+“ rechts bündig im Feld 24 × 24 (x 350–374), zwei gezeichnete Striche 14 × 2 px
(x 355–369), Mitte auf der Mitte der **ersten** Fragezeile (y = Zeilenoberkante + 26), nicht der Zeile; so bleibt es bei zweizeiligen
Fragen am Anfang. Offene Antwort: 15 px unter der Frage, volle Breite 358 px, höchstens fünf Zeilen à 25,5 px (≤ 128 px), 24 px bis
zur nächsten Haarlinie; offene Zeile 52 + 128 + 24 = 204 bzw. 226 px.

**Verhältnisse.** Textzeilen ≈ 35 %, Bild 0 %, Freiraum ≈ 65 % der Abschnittsfläche (Stufe 1: Bild 0–20 %). Größen: drei Stufen 32 · 17
· 15; Sprung h2 : Frage 32 / 17 = 1,9 (unter 3, zulässig nach DG-E-1 C). Rang über Tonwert: Frage `--text` 16,2 : 1, Antwort `--text2`
10,8 : 1, Zeichen `--muted` 5,8 : 1, Haarlinie `--line` 1,3 : 1 (gegen `#161616`).

**Ebenen [V].** 0 Grund `#161616` → 30 Bedienschicht (Haarlinien, h2, Zeilen, Zeichen, Link) → 40 Kopf (klebt, opak). Keine Bildschicht,
keine Verdeckung (in Arbeitsansichten Ziel, nicht Pflicht, DNA-B B.1). Interaktiv: jede Zeile über die volle Breite und der Link unten
im Daumenbereich.

**Schreibtisch 1280 × 800, 12 Spalten** in 1040 px (x 120–1160; Spalte 57,3, Abstand 32), Split 5 : 7 wie die übrige Seite (ZA 8.3.2 c):

- Haarlinie über alle 12 Spalten (y 0); h2 40 px / 1,05 in den Spalten 1–5 (x 120–535), y 24–66, eine Zeile ≈ 300 px.
- Liste in den Spalten 6–12 (x 567–1160, 593 px), beginnt bei y 24 **ohne** eigene obere Linie (die Abschnittslinie trägt), acht einzeilige
  Zeilen je 52 + 1 px → y 24–448; Grundlinie der ersten Frage ≈ 2 px über der Grundlinie der h2. Antworten 593 px breit, drei bis vier
  Zeilen (≈ 68 Zeichen je Zeile, DG T9: 45–75).
- Weiterweg in den Spalten 6–12, 16 px unter der Liste (y 464–508). Spalten 1–5 unter der h2 bleiben frei (Negativraum, DNA Nr. 8).
- Ende ≈ 508 px (0,64 BH). Keine Anheftung (ZA 8.3.2 c: angeheftet wird nur 01).

**Warum Split statt einer Spalte ≤ 820 px (Festlegung fb-13).** ZA nennt „Zeilenbreite ≤ 820 px“; 820 px ergeben bei 17 px rund 95
Zeichen je Antwortzeile und brechen die eigene Regel 45–75 Zeichen (DG T9). In den Spalten 6–12 sind es ≈ 68, alle Fragen einzeilig, und
der Abschnitt ist ≈ 170 px kürzer als gestapelt.

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung hier | Intensität | Wirkung, Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achsen | Grund und eine flache Bedienschicht; der Kopf liegt beim Scrollen über den Zeilen | 0 | Ruhe nach den Szenen 01–03; nichts lenkt vom Lesen ab |
| Material, Transparenz | keines; keine Kartenfläche `#1f1f1f`, kein Ring, kein Glas | 0 | acht Karten wären ein Feld gleichrangiger Flächen ohne Anker (SG 10.10 Nr. 11) |
| Licht, Schatten | keines; kein Schein, kein `--float` | 0 | DNA Nr. 6, 10 |
| Formen | radienlose Zeilen mit Haarlinien als Gegenform, kein Formbruch (SG 10.5/5); einziges Rund: Fokusring | gering | Zeilen lesen sich als Liste, die Vollrundung der Knöpfe bleibt unberührt |
| 3D-Objekte, Bild, Perspektive, Überlagerung | keine | 0 | Stufe 1 (DG 2.4.2); Bildanteil 0 % |
| Oberflächendetails | gezeichnetes „+“ aus zwei 2-px-Strichen statt Schriftzeichen; Zeichen ruhig `--muted`, offen `--accent` als aktive Marke (G3); Haarlinie unter der Zeile beim Überfahren `--line2` | gering | Präzision wie ein Aufmaß: gleich dicke Striche, exakt mittig, keine Glyphenverschiebung |
| Typografie | Bühnenstimme h2 32/40; Fragen 17/700 `--text`, Zeilenabstand 1,3; Antworten 17/500 `--text2`, 1,5, höchstens 60 ch; Link 15/700 | – | Rang ohne Größensprung, nur über Gewicht und Tonwert |
| Farbe | ein grünes Wort in der h2; Grün im Zeichen nur bei offener Zeile | Signal | gemessen: geschlossen farbig 0,4 % (G8 verlangt > 0,3 %); ohne das Wort 0,1 % |
| Animation | Antwort blendet 220 ms über Deckkraft ein; senkrechter Strich des „+“ blendet 150 ms aus | Zustand | Rückmeldung am Ort des Tippens |
| interaktive Effekte | Überfahren: Zeichen `--text`, Linie `--line2`; Fokus 2 px `--text` | Zustand | Bedienschicht nur über Farbe, Kontur, Deckkraft (G1) |

**Bewusst weggelassen:** Abschnittsnummer, Kicker, Auftritt beim Scrollen (E-13; die Zeilen stehen nicht in der Reveal-Liste
`verkauf.js:477` und kommen nicht hinein), Drehen des „+“ (Drehung der Bedienschicht, G1), Federn, Nummern vor den Fragen, Symbole je
Frage, „Alle öffnen“, exklusives Akkordeon, Hintergrundfläche beim Öffnen. Die verlangte Bewegung mit Tiefe und Physik (SKILL:43) tragen
V1, 02 und 03; hier gilt „fein, nicht laut“ (SKILL:48).

## E. Visual Attention Architecture

Erwartete, nicht gemessene Aufmerksamkeit.

- **Primärer Fokus:** h2 mit dem grünen „Fragen“, die größte Schrift und die einzige Farbe des Bildschirms; sie benennt den Abschnitt.
- **Sekundärer Fokus:** die linke Kante der Fragen. Erwartet wird ein Überfliegen von oben nach unten über die ersten zwei, drei Wörter
  („Was kostet …“, „Brauche ich …“, „Wer ist …“); deshalb stehen die Fragen in `--text` und fett, die Antworten zurückgenommen.
- **Dritter Rang:** die Spalte der Zeichen rechts als Zeichen „aufklappbar“; nach dem Öffnen das fette „Nein.“, „Ja.“ oder „Sie.“ am
  Antwortanfang.
- **Handlung:** keine Hauptaktion, keine Cream in diesem Bildschirm; der Weiterweg ist das schwächste Bedienelement (15 px, Unterstreichung
  `--line2`). Die nächste Cream steht im Abschluss A4.
- **Mögliche Ablenkungen:** der Kopf-Ring „Paket anfragen“ (dauerhaft, gewollt); A3 Hintergrund mit denselben Zeilen kann als Fortsetzung
  der Fragen gelesen werden: getrennt durch 96 px, Haarlinie und eigene h2.
- **Übergang:** nach dem Weiterweg 96 px Grund, dann Haarlinie und h2 „Hintergrund“ am unteren Bildschirmrand angeschnitten; der Blick
  läuft an derselben Ordnungslinie weiter zu A4.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Dauer, Kurve | Verfahren | weniger Bewegung |
|---|---|---|---|---|
| Scrollen | nichts; kein Auftritt, keine Kopplung | – | natives Scrollen | gleich |
| Überfahren (`hover: hover` und `pointer: fine`) | Zeichen `--muted` → `--text`; Haarlinie unter der Zeile `--line` → `--line2` | 150 ms `--e-out` | CSS-Übergang; Linie über `.rg-frage:has(> summary:hover)` | Farbwechsel bleibt |
| Tippen, Klick, Enter, Leertaste auf eine Frage | öffnet: Höhe sofort, Antwort Deckkraft 0 → 1; senkrechter Strich 1 → 0 („–“); Zeichen `--accent` | Antwort 220 ms `--e-out`, Strich 150 ms | natives `details`; Keyframe-Animation auf `[open] > div` | ohne Einblenden, sofort |
| erneutes Tippen | schließt: Antwort sofort weg, Strich 150 ms zurück, Zeichen `--muted` | 150 ms | nativ | sofort |
| mehrere Fragen | bleiben unabhängig offen (kein `name`-Attribut) | – | – | – |
| Sprung `#haeufige-fragen` (Menü, Kopf) | h2 76 px unter der Oberkante | – | `scroll-margin-top` (`verkauf.css:8`) | gleich |
| Sprung `#hf-…` | Zeile öffnet sich, 76 px unter der Oberkante | – | `gemeinsam.js` (H) | gleich |
| Weiterweg | Paket „Noch offen“, Sprung zu `#frage` | – | `verkauf.js:28-35` | gleich |
| Link in Antwort | Unterstreichung `--line2` → `--text` | 150 ms | CSS | gleich |
| Tastaturfokus | Kontur 2 px `--text`, Abstand 2 px | sofort | `gemeinsam.css:38` | gleich |

**Begründung.** Die Bedienschicht darf nur Zustände zeigen (G1; SG 10.10 Nr. 14); 220 ms ist die Rückmeldungsdauer der Website (DG
2.4.1), 150 ms die Zustandsdauer. Kein exklusives Akkordeon: Schlösse eine obere Zeile, sobald eine untere aufgeht, rutschte die
angetippte Zeile unter dem Finger weg. Das Öffnen verursacht keinen CLS-Wert, weil es auf eine Eingabe folgt.

**Offener Punkt DG-E-14 (Höhenwechsel).** Grundfassung ist **A**: Die Höhe springt, die Antwort blendet ein. **B** als Vergleich im
Telefon-Video: `::details-content` mit `block-size` 0 → `auto` in 220 ms `--e-io` (`interpolate-size: allow-keywords`, `transition-behavior:
allow-discrete`), nur unter `@supports selector(::details-content)`, sonst A; bei „weniger Bewegung“ aus. B animiert eine Höhe:
**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** (SKILL:56 „nur transform und opacity“, Codesperre SG 10.10
Umsetzung 5), begründet mit SKILL:48 „nichts … springt“. Der Inhaber entscheidet nach dem Video; Folgezeilen per `transform` zu schieben
(C) ist ausgeschlossen.

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst).** Komposition wie in C: eine Spalte, Liste mit eigener oberer Linie, Weiterweg unter der
Liste im Daumenbereich. Ein Bildschirm zeigt bei 844 px den ganzen geschlossenen Abschnitt (676 px), bei 664 px die h2 und sechs Fragen;
die beiden letzten und der Weiterweg folgen nach kurzem Scrollen.

**360 px.** Textbreite 328: Antworten 4–5 fünf, 4–8 sechs Zeilen; Fragen wie bei 390. **320 px:** kein Querscrollen; ihr-name-fenster.de
bricht nicht, weil kurz genug. **200 % Text:** Zeilen wachsen über `min-height`; das Zeichen sitzt per `top: calc(15px + .65em - 1px)`
weiter auf der ersten Fragezeile.

**640–1023 px.** Telefonkomposition, Liste und Weiterweg höchstens 640 px breit an der linken Ordnungslinie; h2 40 px ab 761 px.

**Schreibtisch 1280 (dazu 1024).** Split wie in C. Bei 1024: Inhalt 992 px (x 16–1008), Spaltenabstand ≈ 26 px, h2 in den Spalten 1–5
(x 16–415), Liste in 6–12 (≈ x 440–1008, 568 px Breite). Die Frage „Ich nutze eeziframes schon mit Kundenlinks …“ bricht dort zweizeilig
(74 px); Ende ≈ 530 px. Nichts wird größer als 40 px (SKILL:28).

**Einbettung `/#fensterbauer`.** Gleiche Darstellung: `ratgeber.css` lädt auch auf `/` (`web/index.html:24`), `.vk-einbettung` gleicht die
Spalte an. Ohne eigene Bindung bis auf den delegierten Klick der Paketvorwahl (je Wurzel, idempotent, `verkauf.js:28-29`); nach einem
Neuaufbau funktionieren die nativen `details` ohne Zutun. `#frage` und `#hf-…` lässt der Ansichtswechsel unberührt
(`web/assets/portal.js:1962-1976` reagiert nur auf eigene Anker).

**Ohne JavaScript.** Voll bedienbar (nativ); es fehlen nur das Öffnen per `#hf-…` und die Vorwahl, die ohnehin „Noch offen“ ist.
**Druck:** Antworten offen, Zeichen aus, Haarlinien `#999`.

## H. Technische Umsetzung

**Bestand ändern.**

- `web/fuer-fensterbauer/index.html`: Abschnitt VK:234-246 nach dem Muster unten ersetzen; `FAQPage` VK:29-39 auf dieselben acht Paare.
- `web/assets/ratgeber.css:128-134`: `.rg-frage` wird zum Muster für alle Fragenlisten (31 Seiten mit `rg-frage`, dazu der Vergleich
  `#vergleich` als 52-px-Zeile, PE J-R19); Druck :168-171 anpassen.
- `web/assets/verkauf.css` (bei :501-513): Klasse `.vk-anhang` für A1–A3 und das Raster `.hf`.
- `web/assets/gemeinsam.js`: Öffnen per Anker (sechs Zeilen).
- `functions/seo.js:24`: `stand`. Prüfsuite unverändert gültig: ≥ 6 Fragen und Pflichtwörter (`29.mjs:116-117`), Wortgleichheit und ≥ 100
  Fragen gesamt (`pruefen.mjs:1739-1748`; 155 → 153), Ziele ≥ 44 px an `.rg-frage summary` (`pruefen.mjs:1610`), nur Größen 13/15/17/24/32/40.

**Markup [V].** `<summary>` enthält nur den Fragetext, ohne `span` (Prüfung `'<summary>' + q + '</summary>'`); `</summary><div>` und
`</div></details>` stehen unmittelbar aneinander (Regex `pruefen.mjs:1744`).

```html
<section class="vk-teil vk-anhang hf" aria-labelledby="haeufige-fragen">
  <h2 id="haeufige-fragen">Häufige <span class="ak">Fragen</span></h2>
  <div class="hf-liste">
    <details class="rg-frage" id="hf-kosten"><summary>Was kostet ein eigener Fenster-Konfigurator?</summary><div><p>Eine Einrichtungsgebühr vorab, danach ein fester <a class="ulink" href="#pakete">Monatspreis je Paket</a>, netto zuzüglich Mehrwertsteuer. Keine Gebühr je Anfrage, keine Kosten für Programmierung, Server oder Pflege.</p></div></details>
    <!-- … sieben weitere wie Tabelle B … -->
  </div>
  <p class="hf-weiter"><a class="link" href="#frage" data-paket="">Ihre Frage ist nicht dabei? Fragen Sie uns</a></p>
</section>
```

**CSS, Muster (`ratgeber.css`).**

```css
.rg-frage { margin: 0; border-bottom: 1px solid var(--line) }
.rg-frage:first-child, :not(.rg-frage) + .rg-frage { border-top: 1px solid var(--line) }
.rg-frage[id] { scroll-margin-top: 76px }
.rg-frage summary { position: relative; display: block; min-height: var(--h2); padding: 15px 40px 15px 0; font-size: 17px;
  line-height: 1.3; font-weight: 700; color: var(--text); list-style: none; cursor: pointer; -webkit-tap-highlight-color: transparent }
.rg-frage summary::-webkit-details-marker { display: none }
.rg-frage summary::before, .rg-frage summary::after { content: ''; position: absolute; right: 5px; top: calc(15px + .65em - 1px);
  width: 14px; border-top: 2px solid var(--muted); transition: opacity var(--t1) var(--e-out), border-color var(--t1) var(--e-out) }
.rg-frage summary::after { transform: rotate(90deg) }               /* steht, wird nie animiert gedreht */
.rg-frage[open] summary::before, .rg-frage[open] summary::after { border-color: var(--accent) }
.rg-frage[open] summary::after { opacity: 0 }
.rg-frage > div { padding: 0 0 24px }
.rg-frage > div p { margin: 0 0 12px; max-width: 60ch; font-size: 17px; line-height: 1.5; color: var(--text2) }
.rg-frage > div p:last-child { margin-bottom: 0 }
.rg-frage > div strong { color: var(--text); font-weight: 700 }
.rg-frage[open] > div { animation: rg-frage-ein var(--t2) var(--e-out) }
@keyframes rg-frage-ein { from { opacity: 0 } }
@media (hover: hover) and (pointer: fine) {
  .rg-frage summary:hover::before, .rg-frage summary:hover::after { border-color: var(--text) }
  .rg-frage:has(> summary:hover) { border-bottom-color: var(--line2) } }
@media (prefers-reduced-motion: reduce) {
  .rg-frage[open] > div { animation: none } .rg-frage summary::before, .rg-frage summary::after { transition: none } }
```

**CSS, Abschnitt (`verkauf.css`).** `.vk-anhang { counter-increment: none; padding-top: 24px } .vk-anhang::before { content: none }`;
`.hf-liste { margin-top: 24px } .hf-weiter { margin: 16px 0 0; font-size: 15px }`; 640–1023 px `max-width: 640px` für Liste und Weiterweg;
ab 1024 px `.hf { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(24px, 2.5vw, 32px); align-items:
start }`, `.hf > h2 { grid-column: 1 / span 5; grid-row: 1 / span 2 }`, `.hf-liste, .hf-weiter { grid-column: 6 / -1 }`, `.hf-liste {
margin-top: 0 } .hf-liste > .rg-frage:first-child { border-top: 0 }`.

**JavaScript (`gemeinsam.js`).** Bei `DOMContentLoaded` und `hashchange`: Element zur Sprungmarke suchen (`getElementById`, in
`try/catch`); ist es ein `details`, `open = true` setzen. Einmal global gebunden, also auch in der Einbettung und nach einem Neuaufbau.

**Assets.** Keine; nichts beim Inhaber anzufragen.

**Animationstechnik.** Stufe 1 „leicht“ (SKILL:55): nur CSS, nur `opacity` und Farbe; Fassung B mit `block-size` nur nach Freigabe.

**Leistung.** Keine Bilder, keine Schleifen, kein Beobachter; das Öffnen ist nativ (INP unkritisch), `:has()` nur für die Hover-Linie
(ohne Unterstützung fehlt nur sie).

**Barrierefreiheit.** Natives `details`: Rolle und Zustand liest der Screenreader selbst, kein doppeltes `aria-expanded`; der Fragetext ist
der Name; das Zeichen ist Pseudo-Element ohne Text. Abschnitt über `aria-labelledby` benannt. Ziele 358 × 52 (Schreibtisch 593 × 52).
Kontraste wie in C; die Haarlinie trennt nur und identifiziert kein Bedienelement (WCAG 1.4.11 erfüllt über Text und Zeichen ≥ 3 : 1).
Bei `forced-colors: active` bleiben Linien und Zeichen sichtbar, weil beide aus `border` bestehen. DOM-Folge = Lesefolge an allen Breiten.
Links in Antworten sind Fließtextlinks (Ausnahme WCAG 2.5.8).

**Abweichungen von bestehenden Regeln (je: Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig).**

| Regel | Neu | Begründung |
|---|---|---|
| „Fragen: `details` als Karten, 48 px hoch“ (GEST:435) | Zeilen mit Haarlinien ohne Kartenfläche, 52 px (DG-AB-19) | Acht gleiche Karten sind ein Feld ohne Anker (SG 10.10 Nr. 11); Linien ordnen ohne Fläche; 52 px = Kontrollhöhe `--h2`. Gilt nach Freigabe für alle Fragenlisten |
| Nummer an jeder Haarlinie (GEST:450) | Anhang ohne Nummer (E-AB-10, gesammelt in ZA 8.4.5) | ein Benennungssystem für Kapitel 01–06 |
| nur `transform` und `opacity` (SKILL:56) | nur Fassung B, Höhe 220 ms | SKILL:48; Entscheidung nach Video (DG-E-14) |

Selbst entschieden, ohne Regelbruch: Fragen 700 statt 800 (`gemeinsam.css`: 700 für Listen), Zeichen `--muted` statt `--accent`
(`ratgeber.css:131`), Antwort 17 statt bisher Erbgröße, Lesebreite 60 ch.

**Folgen für das Muster.** `he-06-haeufige-fragen`: `portal.js:894` rendert heute `details.fq` mit `.pchev` und Antworten 15 px; es übernimmt
`details.rg-frage` mit derselben Struktur (ohne `id="haeufige-fragen"`, damit die Einbettung keinen doppelten Anker erzeugt). Ratgeber
übernehmen die Darstellung, aber nicht die Grenze von fünf Zeilen: Dort ist längerer Text Absicht (DR 3.2). A3 `fb-14` nutzt die Zeile
für „Zahlen“, „Quellen“, „Wissen“, nicht im JSON-LD. Danach GEST:435 nachziehen.

## I. Conversion-Begründung

**Warum hier.** Nach Paketen, Formular, Ablauf und Kundenschutz bleiben Fragen, die keine Station des Flusses tragen: Domain, Website,
Datenschutz, Bestandskunden, Genauigkeit. Sie direkt vor den Abschluss zu legen, hält den Fluss frei (EA 4.6.3 [H]) und fängt den Leser
ab, der vor der endgültigen Wahl noch einmal prüft (EA H-D7). Kosten und Kündigung stehen bewusst doppelt: am Preis als Kurzform (PE J-R15),
hier mit Wechselregel.

**Wie die Gestaltung unterstützt.** Geschlossen zeigt der Abschnitt nur acht Fragen mit rund 60 Wörtern; wer nicht zweifelt, überfliegt
ihn in Sekunden und erreicht A4 ohne Umweg. Wer zweifelt, findet die Frage an der linken Kante und die Antwort im ersten Wort. Die Ruhe
(Stufe 1, keine Cream, keine Bewegung) grenzt den Abschnitt von Entscheidungsflächen ab, sodass der Abschluss als nächste Handlung stärker
wirkt.

**Informationsmenge.** Acht statt zehn Fragen, je Antwort höchstens fünf Zeilen am Telefon (≈ 230 Wörter offen, alle auf Abruf).
Weniger Fragen ließen Pflichtthemen der Prüfsuite oder belegte Zweifel aus EA 4.6.1 offen; mehr wären Wiederholungen des Flusses.

**Beitrag zur Zielhandlung.** Beseitigt Hindernisse vor Z1a/Z1, ohne eigene Handlung zu fordern; der Weiterweg hält Unentschlossene im
vorhandenen Formular (W4) statt sie zu verlieren. Über Wirkung auf Anfragen sagt diese Spezifikation nichts.

**Zu testende Annahmen.**

| Nr. | Annahme [H] | Prüfweg | Rückfall |
|---|---|---|---|
| HF-1 | Zeilen ohne Karte werden als antippbar erkannt (Zeichen, Fettung) | Beobachtung am Telefon, fünf Fensterbauer | Kartenform nach GEST:435, nur `ratgeber.css` |
| HF-2 | Die gekürzten Antworten beantworten die Frage so gut wie die langen | Lesetest „Wem gehört die Domain? Wer ist verantwortlich?“ | Bestandstexte VK:237-245 (6–8 Zeilen), HTML und JSON-LD zusammen |
| HF-3 | Der Weiterweg führt zu Fragen, ohne vom Abschluss abzulenken | Gespräche; Anteil „Noch offen“ im Formular (eine Herkunftsmessung fehlt, EA O-2) | ohne Link, Ende bei 0,73 BH |
| HF-4 | Kosten zuerst trifft den häufigsten Restzweifel | Gespräche (keine Erfassung geöffneter Zeilen) | Folge nach Gesprächen |
| DG-E-14 | Fassung B wirkt ruhiger als A, ohne zu stocken | Telefon-Video A gegen B, Inhaber | A |

# 01 Ihr Name (#die-idee)

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 3 von 15 (Kapitel 01, nach V1 Startbild und V2 Leiste, vor 02 Ihr Kunde) · Intensitätsstufe: 2 klar (Typ T3, Objektfassung)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (Z),
dazu EIN = `web/assets/einladung.js`, PK = `web/assets/pakete.js`. **[V]** verbindlich, **[H]** Hypothese mit Rückfall. Alle Lagen sind
geplant, nicht gemessen.

## A. Abschnitt und Funktion

- **Name, ID, Anker:** 01 Ihr Name, `fb-03-ihr-name`, h2 mit Pflicht-ID `die-idee` (`scripts/pruefen-instanzen/29.mjs:110-118`).
- **Position:** Telefon ≈ 1,02–2,11 BH, bei 664 px Höhe Bildschirm 2–3. Davor V2 Leiste (Stufe 3), danach 02 Ihr Kunde (Stufe 3, Lichtraum).
  01 ist die Ruhestelle im Rhythmus 4 · 3 · **2** · 3 · 3 (DG 2.3.17/6) und trennt die beiden Lichtorte V1 und 02 (Dosierregel 3).
- **Zugänge:** Ring „Selbst ausprobieren“ im Startbild (E-AB-3), Menü-Sprungmarke „01“, Weiterscrollen.
- **Ziel:** EA S2 Verstehen: eigener Konfigurator unter eigener Domain und eigenem Namen, ohne Programmierauftrag.
- **Beantwortete Nutzerfrage:** „Was bekomme ich genau, und sieht das nach meinem Betrieb aus?“
- **Vorbereitete Entscheidung:** eigener Konfigurator statt Kontaktformular oder Hersteller-Konfigurator (F-01, F-02, F-08). Gekauft wird
  hier nichts; der Weg zu den Paketen bleibt über den Kopf-Ring „Pakete ansehen“ einen Tipp entfernt.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| h2 „Die Idee: der Fenster-Konfigurator Ihrer Wahl“, grün „Wahl“ | VK:74 | wörtlich |
| Pflichtsatz „… ohne ihn programmieren zu lassen“ | VK:61; Prüfsuite 29.3 | Punkt 1 (einzige Stelle, weil „Kurz gesagt“ entfällt, E-AB-5) |
| „Kein Programmierauftrag … Server, Updates, Sicherheit …“ | VK:77 | Punkt 1, gekürzt |
| „Professioneller Auftritt: Ihre Adresse in der Adresszeile, Ihr Name …“ | VK:78 | als Bild: das Gerät |
| „Ihr eigenes Baby“ (Pflichtwort) | VK:79; Prüfsuite 29.3 | Punkt 2 |
| Beispieladresse „ihr-name-fenster.de“; „Ihr Konfigurator ist selbst eine Seite unter Ihrer Domain“ | VK:238-239; E-12 | Adresszeile, fest; der Satz bleibt in den Fragen |
| Startansicht einer Website-Instanz: „Fensterplaner von“, „Ihre neuen Fenster, Ihr Angebot.“ (grün „Angebot“), Knöpfe „Erstes Fenster ausmessen“, „So funktioniert es“, Standardbild, Initiale ohne „Fensterbau“ | EIN:136-139, :172, :229, :247-252 | Inhalt der Miniatur |
| Essential: eeziframes-Design, Name als Text, keine eigene Startansicht; Beispielbetrieb „Fensterbau Brandt“ | PK:44-49; Z 8.3.0 | Markenstufe und Name ohne Eingabe |
| Erwartung „Werkzeug, keine Kundenvermittlung“ | EA F-08, H-D4; PB:85 § 10 (2) | Punkt 3 |
| Feld „Firma (freiwillig)“ im Anfrageformular | VK:223 | Ziel der Übergabe des Namens (05) |

VK:80 („Anfragen, mit denen Sie rechnen können“) wandert als Lead nach 03 (E-AB-8).

**B.2 Texte**

| Element | Wortlaut | Status |
|---|---|---|
| Kapitelzeile | „01 · IHR NAME“ | Textentwurf (Z 8.2.6) |
| h2 | „Die Idee: der Fenster-Konfigurator Ihrer Wahl“ | Bestand VK:74 |
| Lead | „So begrüßt Ihr Konfigurator Ihre Kunden, unter Ihrer Domain.“ | Textentwurf |
| Textziel | „Mit Ihrem Namen ansehen“ | Textentwurf |
| Feldbeschriftung | „Ihr Firmenname“ | Textentwurf |
| Hinweis am Feld | „Nur eine Vorschau auf diesem Gerät. Nichts wird gesendet.“ | Textentwurf |
| Punkt 1 | „**Kein Programmierauftrag:** Ihr Konfigurator, ohne ihn programmieren zu lassen. Server, Updates und Sicherheit sind dabei.“ | Textentwurf aus VK:61, :77; Pflichtsatz wörtlich |
| Punkt 2 | „**Ihr eigenes Baby:** Sie geben frei, bevor es online geht. Logo, Farbe und Fotos je nach Paket.“ | Textentwurf aus VK:79 |
| Punkt 3 | „**Ihr Werkzeug:** Wir vermitteln keine Kunden. Sie teilen den Link, wo Ihre Kunden Sie finden.“ | Textentwurf (EA F-08) |
| Vorlesetext des Geräts | „Beispiel: Startansicht in EEZI Essential unter ihr-name-fenster.de. Fensterplaner von Fensterbau Brandt, Überschrift ‚Ihre neuen Fenster, Ihr Angebot.‘, Knopf ‚Erstes Fenster ausmessen‘.“ | Textentwurf |
| Statusmeldung nach Eingabe | „Die Vorschau zeigt jetzt: Fensterplaner von {Name}.“ | Textentwurf |

Punkt 2 weicht bewusst vom Wortlaut VK:79 ab: „Startseite, Begrüßung … und Bilder bestimmen Sie“ gilt nur für Plus und Signature
(`startansicht: false`, `fotos: 0` bei Essential, PK:46), und das Gerät zeigt Essential. Wortlaut zur Freigabe.

**B.3 Interaktionen:** genau eine, freiwillig: Textziel öffnet das Feld, „Fertig“ übernimmt den Namen in die Miniatur. Kein Senden, kein
Formular (E-7, E-10). Das Gerät hat keine Trefferfläche.

**B.4 Vorhandene Komponenten:** Abschnittsrahmen `.vk-teil` mit Haarlinie (`web/assets/verkauf.css:500-502`); Telefon-Miniatur
`.vk-telefon` und `.vk-schirm-start` (VK:94-103, `verkauf.css:346-379`) als Ausgangspunkt; Feldstil `.vk-feld` (`verkauf.css:127-131`);
Bindung über `Verkauf.auf(wurzel, o)` mit `beobachten()`, `ruhig()`, `o.still` (`web/assets/verkauf.js:1-16`); `Einladung` läuft
auch auf dem Server (EIN:7, :361-362); Tokens aus `web/assets/gemeinsam.css:9-31`.

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Telefon: eine Spalte, Satzbau Haarlinie → Kapitelzeile → h2 → Lead → Held → Handlung → Lesestapel (G2; der Lead
steht vor dem Gerät, weil er es beschriftet). Text auf der Ordnungslinie x = 16, das Gerät auf der Mittelachse (G5: Achse nur für das
mittige Motiv). Asymmetrisch: linksbündiger Text, zentriertes Objekt.

**C.2 Telefon 390 × 844, Lagen relativ zur Haarlinie (y = 0); 4 Spalten à 77,5 px, Abstand 16 px**

| y | Element | Breite · x | Maß |
|---|---|---|---|
| 0 | Haarlinie 1 px `--line` | 358 · 16–374 | 96 px Abstand zu V2 davor |
| 16–33 | Kapitelzeile 13 px | links | Abstand 16 |
| 45–115 | h2 32 px, zwei Zeilen („Die Idee: der Fenster-“ / „Konfigurator Ihrer Wahl“) | 358 | Abstand 12; bei 360 px Breite drei Zeilen zulässig |
| 127–178 | Lead 17 px, zwei Zeilen | 358 | Abstand 12 |
| 202–622 | Gerät 300 × 420 | 45–345 (Achse) | Abstand 24; ≈ 38 % der Bildschirmfläche |
| 630–674 | Textziel, Trefferfläche 358 × 44 | 16–374 | Abstand 8 |
| 698–924 | drei Punkte, 90 + 68 + 68 px | 358 | Abstand 24 |

Gesamthöhe ≈ 924 px (1,09 BH; Z plant 1,05, Differenz ≈ 30 px; die Pakete bleiben bei 844 px auf Bildschirm 5). Bei offenem Feld
ersetzt die Feldgruppe (Beschriftung 20 + 8 + Feld 52 + 8 + Hinweis 18 = 106 px) das Textziel, die Punkte rücken um 62 px.

**C.3 Das Gerät (Bildschicht, Z 20)**

- **Körper:** 300 px breit, sichtbar 420 px hoch: der obere Teil eines Telefons, unten über 48 px in den Grund ausgeblendet
  (`mask-image`, gerichteter Auslauf nach SG 10.9). Rand 10 px `--surface`, Außenradius 44, Bildschirmradius 34 (Außen − Innenabstand,
  SG 10.5). Keine Kamera-Insel, keine Statusleiste: abstrahiert, damit die Startansicht trägt und kein Herstellergerät zitiert wird.
- **Bildschirm** 280 × 410, Grund `--ground`, Inhalt mit 16 px Innenrand (Bildschirmkoordinaten):

| y | Inhalt | Maß, Schrift |
|---|---|---|
| 10–38 | Adresszeile als Pille `--surface2`, Schloss 10 px, „ihr-name-fenster.de“ 13 px `--text2`, „ · Beispiel“ 13 px `--muted` | 248 × 28 |
| 52–88 | Absender: Zeichen 32 × 32 (Radius 8, Cream, Initiale „B“ 15 px 800 `--on-primary`); daneben „Fensterplaner von“ 13 px 700 `--muted`, darunter „Fensterbau Brandt“ 15 px 800 `--text`, einzeilig mit Auslassungspunkten | Text ab x 58 |
| 100–240 | Standardbild `app-start` 16 : 9, Radius 12, unteres Drittel in den Grund verlaufend wie `.ein-bild` | 248 × 140 |
| 254–310 | „Ihre neuen Fenster, Ihr Angebot.“ 24 px 800, grün „Angebot“, zwei Zeilen | 248 |
| 324–360 | Pille Cream „Erstes Fenster ausmessen“ 15 px 700 mit Pfeilkreis | 248 × 36 |
| 370–406 | Ring-Pille „So funktioniert es“, liegt im Auslauf | 248 × 36 |

Die Miniatur ist verdichtet: ohne Kicker, Begrüßungstext und Zeitzeile der echten Seite (H-E9). Ihre Knöpfe sind 36 px hoch und damit
sichtbar kleiner als jedes echte Ziel (≥ 44 px). Sie tragen eigene Klassen, nie `.btn.primary`, weil `portal.js:554` jede sichtbare
`.btn.primary` als Cream des Bildschirms zählt und den Kopf-Ring in der Einbettung sonst ausblendet.

**C.4 Verhältnisse.** Im Bildschirm mit vollständig sichtbarem Gerät (Scrollstand ≈ 640): Gerät 38 %, Text ≈ 15 %, frei ≈ 47 % (≥ 33 %,
SG 10.1/3). Maßstabssprung: Gerät 420 px gegen 13-px-Bedienschrift (Versalhöhe ≈ 9,5 px) ≈ 44-fach, h2 32 px als einzige Zwischenstufe
(DNA Nr. 7). Bildanteil ≈ 38 % (Stufe 2: 20–50 %).

**C.5 Ebenen:** 0 Grund `#161616` → 20 Gerät (`pointer-events: none`) → 30 Bedienschicht → 40 Kopf: drei Ebenen (Mindestzahl, SG 10.9),
kein Lichtraum, kein Überstand über die Kapitelkante. Die Bedienschicht berührt das Gerät nie.

**C.6 Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Abschnittsabstand | 96 px Telefon, 128 px Schreibtisch | G6 |
| Kapitelzeile | 13/17 px, 600, Laufweite .12em, Ziffern tabellarisch, `--accent`, `aria-hidden` | wie `.vk-teil::before`; SG Mikrolabel +0,06–0,12 em |
| h2 | 32/35 px (40/44 ab 761 px), 800, −.03em, `--text`; Markup genau `<h2 id="die-idee">` ohne weitere Attribute | Regex der Prüfsuite (29.mjs) |
| Lead | 17/25,5 px, 500, `--text2`, `max-width: 60ch` | Lesestapel ≤ 3 Zeilen (G2) |
| Textziel | `<button>`, 17 px 700 `--text`, Unterstreichung 1 px `--muted`, Versatz 6 px, Höhe 44 | Ring wäre eine zweite Pille neben dem Gerät; Textziel bleibt leise (G2) |
| Feld | 358 × 52, 17 px, Radius 12, Grund `--ground`, Kontur 2 px `--muted` | 3:1 als einzige Grenze (DG-E-10); 17 px verhindert Zoom unter iOS |
| Hinweis | 13/18 px `--muted` (≈ 5,9 : 1) | Z; bei Freigabe von DG-E-6 15 px |
| Punkte | `ul`, je Zeile 12 px oben und unten, Haarlinie 1 px `--line` zwischen den Zeilen und darüber; 15/22 px, Anlauf 700 `--text`, Rest 500 `--text2` | Haarlinien statt Kacheln oder Haken: präzise wie ein Aufmaß, keine Baukasten-Karten (DG T3 „nicht“) |
| Lichtkante Gerät | 1 px, oben `rgba(243,242,238,.24)`, seitlich `.14`, unten keine | SG `--kante-licht`/`--kante-alpha`; Licht von oben (DG-E-8) |

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung und Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen; Tiefe über den Auslauf des Geräts in den Grund (Bildoptik statt Verdeckung, DNA Nr. 2); am Schreibtisch Verdeckung Telefon vor Browser | 1 | Ruhe nach der Leiste |
| Material, Transparenz | Gehäuse matt `--surface`; kein Glas (nur V1 und Umschalter) | 1 | Material liegt im Bildschirminhalt |
| Licht, Schatten | 1-px-Lichtkante; Bildschirm als einzige Helligkeit; kein Lichthof, kein Schatten | 1 | Lichtbudget bleibt bei V1 und 02 |
| Formen | Gehäuse Radius 44/34 (Motiv, außerhalb der UI-Radien); UI Pillen und Radius 12 | – | ein Körper, eine Formfamilie |
| 3D-Objekte, Perspektive | keine; frontal, ohne den −14°-Eintritt aus Konzept D | 0 | Domain lesbar; Gegensatz zur Fototiefe in V1 |
| Bildintegration | echte Startansicht als HTML-Miniatur mit echtem Standardbild | 2 | das Produkt beweist (SKILL:41) |
| Oberflächendetails | Adresszeile mit Schloss, „Beispiel“ in `--muted`, Haarlinien der Punkte | 1 | Präzision im Kleinen |
| Animation | Bildschirm geht einmal an; Name blendet über | 1 | Bewegung mit Sinn |
| Typografie | Bedienschicht 32 · 17/15 · 13 (17/15 = 1,13 als eine Stufe); Schrift im Gerät ist Bildinhalt | – | Maßstabssprung |
| Überlagerungen | Schreibtisch: Telefon überdeckt ≈ 14 % des Browsers (SG 5–15 %) | – | Verankerung ohne Schatten |
| Interaktive Effekte | nur Zustände über Kontur, Unterstreichung, Deckkraft | – | G1 |

**Signature:** keine (Budget Stufe 2: 0 inszenierend). Die Kapitelzeile zählt außerhalb des Budgets (DG 2.4.2).
**Bewusst weggelassen:** Lichtraum und Lichthof (Konzept D), Rahmenbruch des Geräts, Flug, scrollgekoppelter Eintritt, Riesenwort
(DG-E-3), Lottie `domain` (zweites Bild derselben Aussage), Puls-Ring am Miniaturknopf, Kacheln `.vk-punkte`, Schlagschatten.

**Auslegung zu bestätigen [H]:** Cream und Grün im Gerät sind Produktinhalt und zählen nicht als Signal der Seite (Vorbild GEST:448: „der
Knopf zeigt die App und zählt nicht als Cream-Pille der Seite“). Weil DG G3 Cream und Grün am Held ausschließt, steht in 01 sonst keine
Cream-Fläche. Rückfall, falls der Blinzeltest zwei Flecken zeigt: Bildschirminhalt mit 80 % Deckkraft.

**Abweichungen von bestehender Regel – Freigabe durch den Inhaber nötig:** E-AB-8 (Gerät und drei Punkte statt vier Karten, GEST:447,
:450), E-AB-2 (Namensfeld, GEST:455), E-AB-10 (Kapitelzeile mit Kapitelwort statt Nummer), DG-AB-1 (Gerät ohne Schatten; DR Baustein 8
sieht „weicher Bodenschatten“ vor), DG-AB-2 (Bedienschicht ohne 24-px-Auftritt), Puls-Ring am Miniaturknopf entfällt (GEST:448; Schleife
über 5 s, DG-AB-5).

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primärer Fokus:** der Gerätebildschirm, die einzige helle Fläche (Bild mit warmem Licht, Cream-Knopf) auf `#161616`; beim Anschalten
  wechselt er die Helligkeit.
- **Sekundärer Fokus:** h2, danach die Adresszeile „ihr-name-fenster.de“.
- **Erwartete Reihenfolge:** h2 → Bildschirm geht an → Adresszeile → Absender mit Namen → Textziel → Punkte. Nach dem Sprung aus V1
  steht die Haarlinie bei y ≈ 72 (`scroll-margin-top: 116px` am h2): bei 844 px Höhe sind Kopf, Gerät und Textziel im Bild, bei 664 px
  Kopf und ≈ 93 % des Geräts.
- **Kontraste:** Bildschirminhalt bis ≈ 16 : 1 (Cream auf Grund), Lesetext ≈ 11 : 1 (`--text2`), Gehäuse nur ≈ 1,1 : 1, damit der Rand
  nicht mit dem Inhalt konkurriert.
- **CTA:** keine Hauptaktion; das Textziel ist leise, linksbündig im Daumenbereich. Der Kaufweg liegt im Kopf-Ring.
- **Ablenkungen:** Der Miniaturknopf wirkt bedienbar (Gegenmittel: 36 statt 52 px, keine Trefferfläche); das Waschbären-Bild könnte als
  Motiv für Hauseigentümer gelesen werden (Gegenmittel: der Lead direkt darüber); das grüne „Angebot“ im Gerät (24 gegen 32 px).
- **Übergang zu 02:** Nach 96 px folgt die Haarlinie von 02, dort dasselbe Gerät auf derselben Achse, oben angeschnitten: 01 zeigt das
  obere Ende, 02 das untere. Die neue Kadrierung trägt die Fortsetzung.

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Gerät erreicht ≥ 60 % Sichtbarkeit und V2 ruht | Bildschirminhalt Deckkraft 0 → 1 und Maßstab 1,015 → 1 (nur Inhalt, Bildschicht); einmal je Seitenaufruf | 600 ms, `--e-out` | Motiv-Auftritt (DG 2.4.1); Bildschicht darf skalieren |
| V2 läuft noch aus | warten auf Ereignis `vk:leiste-ruht` an der Wurzel (von `fb-02` auszulösen), höchstens 1,2 s | – | ein bewegter Träger (E-2) |
| Scrollen | keine Kopplung, keine Parallaxe, kein Anheften am Telefon | – | E-8, SG 10.7 Mobil |
| Tipp auf Textziel | Textziel verschwindet, Feldgruppe erscheint an derselben Stelle, Fokus ins Feld (öffnet die Tastatur, gleiche Geste); Punkte rücken ohne Animation | Feldgruppe Deckkraft 220 ms | DG-E-14 A sinngemäß; Höhe springt nur auf Eingabe |
| Tippen im Feld | Miniatur ändert sich nicht | – | kein Flackern je Taste |
| „Fertig“ (`enterkeyhint="done"`), Enter oder `change` | Name bereinigen (Leerraum, ≤ 60 Zeichen), Initiale nach EIN:136-139; liegt die Absenderzeile außerhalb des Bildes, scrollt die Seite nativ dorthin; dann alter Name aus, neuer ein; Statusmeldung `aria-live="polite"`; leeres Feld = „Fensterbau Brandt“ | aus 165 ms, ein 220 ms, `--e-out` | eine Rückmeldung, am Objekt |
| Escape | letzter übernommener Wert, Feld verlassen | – | Tastatur |
| Hover (nur `hover: hover`) | Textziel: Unterstreichung `--muted` → `--text`; Feld: Kontur `--line2` → `--text2` | 150 ms | Zustand über Kontur (G1) |
| Fokus | 2-px-Kontur `--ink`, Versatz 2 (`gemeinsam.css`) | – | SG 10.9 Fokusanzeige |
| weniger Bewegung | Bildschirm von Anfang an, Name ohne Überblendung, Feld ohne Einblenden, Scrollen ohne `smooth` | 0 | SG 10.7/7 |
| ohne JavaScript | Textziel und Feldgruppe `hidden`, Bildschirm an, „Fensterbau Brandt“ | – | SKILL:62 |
| Neuaufbau (`Verkauf.auf`, `o.still`) | Name aus `sessionStorage` (in `try/catch`) sofort ohne Überblendung; steht das Gerät im Bild, ist der Bildschirm an | – | SKILL:63-64 |

Charakter: kurz, weich, ohne Überschwingen; keine räumliche Transformation der Bedienschicht (SG 10.7/1-2).

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst).** Komposition C.2. Textziel und Feld liegen in der unteren Bildschirmhälfte, sobald das Gerät
ganz zu sehen ist; bei offener Tastatur schiebt der Browser das Feld darüber (kein eigenes Scrollen beim Fokus). 360 px: Gerät unverändert
(x 30–330), h2 drei Zeilen. Unter 332 px verkleinert `transform: scale()` das Gerät auf die Inhaltsbreite; bis 320 px kein Querscrollen.
200 % Text: h2 bis vier Zeilen, das Gerät bleibt fest.

**Schreibtisch 1280 × 800.** Spalte 1040 (x 120–1160), 12 Spalten à 57,3 px, Abstand 32 px; Kopf 64 px.

- Kopfzone über die Spalten 1–8 (683 px): Haarlinie über alle 12, Kapitelzeile, h2 40 px in zwei Zeilen (`text-wrap: balance`).
- Darunter, 32 px tiefer: links Spalten 1–5 (x 120–535) Lead, Textziel bzw. Feld (Feld 415 × 52), drei Punkte (je zwei bis drei Zeilen);
  rechts Spalten 6–12 (x 567–1160) die Geräte-Bühne 593 × 660, Oberkante auf Höhe des Leads.
- **Bühne:** Browserfenster 560 × 360 rechtsbündig (Bühnenkoordinaten x 33–593, y 0–360), Radius 12, Lichtkante wie das Gerät, Leiste
  36 px mit drei Punkten 8 px `--line2` und Adresszeile „ihr-name-fenster.de · Beispiel“ 13 px. Darin die Startansicht als mittige Spalte
  240 px im nicht überdeckten Teil (Seitenkoordinaten x 853–1093): Absender, Bild 240 × 132, Überschrift 24 px, Cream-Pille 36 px. Davor
  das Telefon 220 × 450 ganz sichtbar (x 0–220, y 210–660; Rand 8, Radien 36/28), Adresszeile nur „ihr-name-fenster.de“ („Beispiel“
  steht einmal für die Bühne im Browser), Überschrift 17 px, Knopftext 13 px. Überdeckung 187 × 150 px: ≈ 14 % des Browsers, ≈ 28 %
  des Telefons. Beide tragen den Namen.
- **Festlegung (Abweichung von Z 8.3.2 c, begründet):** Bei 1280 × 800 ist die Textspalte (≈ 410 px) kürzer als die Bühne (660 px);
  ein Anheften hätte nichts zu halten. Grundfassung daher ohne wirksames Anheften. `position: sticky; top: 96px` bleibt als Sicherung für
  1024 px und 200 % Text, wo die Textspalte länger wird; die Strecke endet am Kapitelende und bleibt so unter 1,1 BH (E-8).
- Abschnittshöhe ≈ 825 px (1,03 BH). Beide Bildschirme gehen gleichzeitig an (ein Träger).

**Schreibtisch 1024.** Inhalt 992 px (x 16–1008), Spaltenabstand 24, Spalte 60,7 px. Text Spalten 1–5 (x 16–415), Bühne Spalten 6–12
(x 439–1008): Browser 520 × 334 rechtsbündig, Telefon 200 × 410 bei x 439, y 190; Überdeckung ≈ 12 % bzw. 26 %. h2 40 px über 8 Spalten,
zwei Zeilen. Zwischen 761 und 1023 px skaliert die Bühne mit `aspect-ratio`; unter 761 px gilt die Telefonfassung.

## H. Technische Umsetzung

**Bestehend (Datei):** `web/fuer-fensterbauer/index.html:73-83` wird ersetzt (Abschnitt mit h2 `#die-idee` bleibt); `functions/pakete-seite.js`
liefert Bausteine, neu erzeugt mit `node scripts/bedingungen-pdf.mjs` (SKILL:107); `web/assets/verkauf.css` (Rahmen, `.vk-feld`,
`.vk-telefon` als Vorlage ohne `box-shadow` und ohne `vk-puls`); `web/assets/verkauf.js` (`Verkauf.auf`, `beobachten`, `ruhig`, `kannIO`);
`web/assets/gemeinsam.css` (Tokens, Fokus); `web/assets/einladung.js` serverseitig für die Texte.

**Neu:**

1. **Baustein `<!--pakete:geraet-->`** in `functions/pakete-seite.js` erzeugt Gerät und Browser als statisches HTML. Absender, Überschrift
   und Knopftexte stammen beim Erzeugen aus `Einladung.html({ vorschau: true, name: 'Fensterbau Brandt', instanz: { website: true,
   kz: 'deutlich', standardBild: true } })` (Teil `.ein-start`); `<h1>` wird zu `<p>` (ein h1 je Seite, Prüfsuite 29.3). Wurzel
   `<div class="vk-geraet" role="img" aria-label="…">`, Namensstellen mit `data-vk-name`, Initialen mit `data-vk-initiale`.
2. **Feldgruppe** `<div class="vk-name" id="vk-name" hidden>` mit `<label for="vk-name-feld">` und `<input id="vk-name-feld" type="text"
   maxlength="60" autocomplete="organization" autocapitalize="words" spellcheck="false" enterkeyhint="done"
   aria-describedby="vk-name-hinweis">`, ohne `name` und ohne `form`; Textziel `<button type="button" class="vk-textziel"
   aria-expanded="false" aria-controls="vk-name" hidden>`.
3. **JS `ihrName(wurzel, o)`** in `verkauf.js`, aufgerufen aus `Verkauf.auf`: Bindung je Element einmal (`__vkAn`), Beobachter über
   `beobachten()` (Schwelle 0,6), Name in `wurzel.__vkName` und `sessionStorage` (`vk-vorschau-name`, `try/catch`), Ereignis `vk:name`
   für 04 (nur wenn eingegeben), 05 (Feld `firma`, nur wenn leer, gekennzeichnet und löschbar) und den Abschluss (Z 8.2.6);
   `initiale()` als Kopie von EIN:136-139; ≈ 1,5 KB.
4. **Prüfsuite:** Ausnahme in `scripts/pruefen.mjs:1789-1797` genau für `div.vk-name` (E-AB-2); Abgleich der Miniaturtexte mit
   `Einladung.html` (H-E9) und von `initiale()` mit EIN; Schriftgrößen im Gerät nur 13, 15, 17, 24.

**CSS:** Telefon eine Spalte; ab 761 px `display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: clamp(24px, 2.5vw,
32px)`; Gerät `width: 300px; height: 420px; mask-image: linear-gradient(#000 calc(100% - 48px), transparent)`; Lichtkante als
`::before` mit 1-px-Rand und Verlaufsmaske; nur `opacity` und `transform` animiert; kein `backdrop-filter`.

**Assets:**

| Asset | Art, Format, Maß | Quelle |
|---|---|---|
| Ausschnitt des Standardbilds 16 : 9 | WebP, 500 × 281 und 750 × 422 (2×/3× von 248 px), je ≤ 45 KB, nicht freigestellt, `loading="lazy"` | abgeleitet aus `web/bilder/foto/app-start.webp` (1120 × 1400) per Skript; keine Anfrage nötig |
| Schloss | Inline-SVG 10 px, `currentColor` | neu, im Code |
| Rückfall zu H-E9 | Aufnahme der echten Essential-Startansicht 390 × 844 unter der Beispieldomain, PNG | per Playwright erzeugen; Freigabe des Inhabers |

**Leistung:** unterhalb des ersten Bildschirms, kein Einfluss auf LCP; feste Maße (CLS 0); ein Beobachter, keine Schleife; zusätzlich
≈ 2 KB HTML, ≈ 1,5 KB JS, ≤ 45 KB Bild. Risiko: Die Miniatur veraltet mit der Startansicht, daher der Abgleich in der Prüfsuite.

**Barrierefreiheit:** Gerät als ein Bild mit Vorlesetext, der den Namen mitführt; Statusmeldung `aria-live="polite"`; sichtbare
Beschriftung und Hinweis am Feld; Ziele ≥ 44 px; Kontraste ≥ 4,5 : 1; Tastatur mit Enter und Escape; nichts nur über Bewegung.

## I. Conversion-Begründung

- **Position:** Nach Zuordnen (V1) und Breite (V2) folgt Verstehen (S2), bevor der Besucher in 02 bedient, was sein Kunde erlebt. Der Ring
  aus V1 landet hier, damit „ausprobieren“ beim eigenen Produkt beginnt statt in der App für Hauseigentümer (E-11).
- **Gestaltung:** Die Hauptaussage „unter Ihrer Marke, unter Ihrer Domain“ steht als Bild am echten Produkt (Adresszeile, Absender,
  Startansicht). Den Beleg liefert das Produkt selbst, ohne Kundenstimmen oder Kennzahlen (SKILL:49). Stufe 2 lässt 02 und 03 den Vortritt.
- **Informationsmenge:** ≈ 18 Wörter bis zum Gerät, ≈ 50 darunter. Drei Punkte beantworten die drei Zweifel von S2 je in einem Satz:
  Aufwand (F-01), Gestaltungshoheit, Erwartung an Anfragen (F-08). Heute: ≈ 115 Wörter ohne Bild (`bestand/seiten-und-inhalte.md:266`).
- **Beitrag zur Zielhandlung [H]:** Wer den eigenen Betrieb im Gerät sieht, liest die Pakete in 04 als Markenstufen derselben Startansicht;
  der Name spart im Formular einen Handgriff. Keine gemessene Wirkung.
- **Zu testende Annahmen [H]:**
  - H-E2: Das Feld wird geöffnet, und der eigene Name verbessert das Verständnis (Gespräche, Telefon-Video). Eine anonyme Zählung „Feld
    geöffnet“ nur über die eigene Statistik (`docs/ONLINE-STELLEN.md:235`), nie mit dem Namen, nach Entscheidung des Inhabers. Rückfall:
    ohne Feld.
  - H-E9: Die verdichtete Miniatur gilt als echtes Produkt. Rückfall: Aufnahme ohne Namen.
  - Das Standardbild im Gerät wird als Startansicht des Kunden gelesen, nicht als Motiv der Seite (Lesetest „Was sieht Ihr Kunde?“).
    Rückfall: Bildfläche mit Zeichnung im Stil des Aufmaßblatts.
  - H-D4: Punkt 3 beugt Fehlkäufen vor, ohne die Anfragebereitschaft spürbar zu senken.
  - Das Textziel wird nicht für die Hauptaktion gehalten.

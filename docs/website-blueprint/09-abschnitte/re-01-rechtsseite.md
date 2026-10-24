# Rechtsseite

Seite: Rechtsseiten (Muster: Impressum, Datenschutz, Cookies, AGB, Nutzungsbedingungen, Widerruf) · Position: 1 (einziger Inhaltsabschnitt zwischen `rh-01-kopf` und `rh-03-brotkrumen-fuss`) · Intensitätsstufe: 1 ruhig (Typ T12; Ansichtstyp „Arbeitsansicht“ nach SG)

ID `re-01-rechtsseite`, Phase I, Stand 24.10.2026. Reine Planung: Das Repository wurde gelesen, gebaut oder geändert wurde nichts.
Kennzeichnungen wie in 08: **[V]** verbindlich, **[H]** Hypothese mit Rückfall, **Textentwurf** (Freigabe nötig), **Festlegung I**
(Entscheidung dieser Spezifikation, wo 08 offen ist). Grundlage: 08 (8.2.2, 8.2.5, 8.3.0, 8.3.7, 8.3.11), DG 2.3.1, 2.3.14, 2.4.1,
DG-E-1 C, DG-AB-8, SG „Wofür er gilt“, 10.1, 10.7, 10.10 Nr. 5, Ergebnis B (B.1, B.5), SKILL, GEST:26, :29, :408, :429–438, :455.
`10-paketentscheidung.md` liegt nicht vor; der Abschnitt nennt keine Preise, Preise im Wortlaut der Rechtstexte bleiben unberührt.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name | Rechtsseite, ein Muster für sechs Adressen (08 S24–S29). `pb-03-bedingungstext` folgt ihm (08 8.3.6) |
| Position | einziger Inhaltsabschnitt. Darüber `rh-01-kopf` im Kontext neutral, opak ab y = 0 (keine Bühne), darunter nach 96/128 px `rh-03-brotkrumen-fuss` kurz, ohne Brotkrumen, mit „Vertrag widerrufen“ |
| Länge am Telefon | Schätzung aus der Wortzahl bei 664 px je BH: Impressum ≈ 1,3 BH (104 Wörter), Widerruf ≈ 1,9 (206 Wörter und Formular), Cookies ≈ 5,5 (740), AGB ≈ 15 (1.922), Nutzungsbedingungen ≈ 20 (2.505), Datenschutz ≈ 33 (4.650) |
| Ziel | Pflichtangaben ruhig und lesbar; Sprungziele treffen sichtbar; `/widerruf/` ohne JavaScript nutzbar (CP P7); Kopf neutral mit Wegen zu beiden Zielgruppen |
| Nutzerfrage | „Wer ist der Anbieter, was gilt?“ (08 L-1); auf `/widerruf/`: „Wie widerrufe ich, und habe ich einen Beleg?“ |
| Vorbereitete Entscheidung | keine Kaufentscheidung (08 „–“); abgesichert werden Anbieterprüfung (EA F-20, S5), Zustimmung an der Kasse (EA H-09), Ausübung des Widerrufs, Wechsel zur passenden Zielgruppe |
| Einstiege | Fuß jeder Seite; Kasse der App → `/agb/#widerrufsbelehrung`, `#widerrufsformular` im neuen Fenster (`web/assets/app.js:3463`); Anfrageformular → `/datenschutz/#pakete` im selben Fenster (`web/fuer-fensterbauer/index.html:225`); Paketbedingungen → `/datenschutz/#pakete`, `/nutzungsbedingungen/`; `/widerruf/` → `/datenschutz/#widerruf`, `/agb/#widerrufsformular` |

**Kopf neutral [V] (08 8.2.2, `rh-01`).** Telefon: Logo → `/` und Menü 44 × 44; das neutrale Menü (`rh-02`) führt das Segment
„Hauseigentümer · Fensterbauer“ als zwei Links, „Für Fensterbauer“, „Fenster ausmessen“, „Ratgeber“. Schreibtisch: Logo, „Für
Fensterbauer“ → `/fuer-fensterbauer/`, „Fenster ausmessen“ → `/app/`; kein Knopf. „Für Betriebe“ → `/` entfällt (SI 5.4; 08 8.4.3). Beide
Zielgruppen liegen damit am Schreibtisch direkt, am Telefon einen Tipp entfernt; der kurze Fuß führt beide Gruppen ebenfalls. Eine eigene
Wegezeile im Abschnitt entfällt deshalb.

## B. Konkreter Inhalt

### B.1 Bausteine (DOM-Folge = Sichtfolge)

1. **Kicker** (höchstens ≈ 32 Zeichen), 2. **h1**, 3. **Geltungszeile** 15 px (wo der Bestand eine Geltung nennt), 4. **Verweiszeile**
(nur Nutzungsbedingungen), 5. **Entwurfshinweis** als erste Karte, nur wenn er sichtbar besteht: heute nur in den Paketbedingungen
(`PB:28`), auf den sechs Seiten nur als HTML-Kommentar (`web/impressum/index.html:14` u. a.); ob er sichtbar wird, entscheidet PA-Frage 18,
6. **Hervorhebungskarte** („Kurz gesagt“ oder Anschrift), 7. **Abschnittsliste [H]** bei mindestens acht h2, 8. **Textkörper** (h2 mit
Haarlinie, h3, Absätze, Listen, `address`, Karten mit rechtlicher Hervorhebung, Tabelle, `code`), 9. **Formular, Bestätigung, „Andere
Wege“** (nur `/widerruf/`), 10. **Schlusszeile „Stand“**, wo vorhanden (`web/agb/index.html:114`, `web/nutzungsbedingungen/index.html:142`).

| Seite | Kicker | h1 | darunter | Karte oben | h2 / h3 | Besonderheiten |
|---|---|---|---|---|---|---|
| Impressum | „Angaben nach § 5 DDG“ (`web/impressum/index.html:20`) | Impressum | – | Anschrift (`:22-29`) | 5 / 0 | `mailto:`, `tel:` (`:32-33`) |
| Datenschutz | „Stand: Oktober 2026“ (`web/datenschutz/index.html:21`) | Datenschutz | – | „Kurz gesagt“, ≈ 180 Wörter (`:24`) | 12 / 0 | `#pakete` (`:75`), `#widerruf` (`:90`), Karte Widerspruchsrecht (`:96`) |
| Cookies | „Stand: 18. Oktober 2026“ (`web/cookies/index.html:20`) | Cookies und Speicher im Browser | – | „Kurz gesagt“ (`:22`) | 4 / 0 | Tabelle, 16 Zeilen, drei Spalten mit `data-k` (`:28-48`) |
| AGB | „Stand: 18. Oktober 2026“ (aus `web/agb/index.html:20`) | Allgemeine Geschäftsbedingungen | Geltung „Für Hauseigentümer und alle, die mit der App ihre eigenen Fenster ausmessen“ (`:20`) | „Kurz gesagt“ (`:22`) | 14 / 3 | Karten `#widerrufsbelehrung`, `#erloeschen`, `#widerrufsformular` (`:63-90`); `meta name="stand"` (`:11`) |
| Nutzungsbedingungen | „Stand: 18. Oktober 2026“ (aus `:20`) | Nutzungsbedingungen für Fensterbauer | Geltung „Für Fensterbauer und andere Betriebe, die eeziframes für ihre Kunden nutzen“, Verweiszeile | „Kurz gesagt“ (`:22`) | 16 / 10 | `#kundenschutz` (`:79`), `#avv` (`:107`) |
| Widerruf | „Widerrufsfunktion“ (`web/widerruf/index.html:21`) | Vertrag widerrufen | Einleitung (`:23`), Hinweis Widerrufsbelehrung (`:24`) | Formular (`:26-46`) | 1 / 0 | `noscript` (`:47`), Bestätigung (`:49-56`), „Andere Wege“ (`:58-60`) |

**[V] Der Wortlaut der Rechtstexte bleibt unverändert;** die Gestaltung ändert den Satz, nicht den Text. Am Markup ändern sich nur:
die Trennung von Kicker und Geltung (**Festlegung I**: Die heutige Kickerzeile von AGB und Nutzungsbedingungen läuft in Versalien über mehr
als drei Zeilen; „Stand“ bleibt Kicker, die Geltung steht ausgeschrieben unter dem h1), weiche Trennstellen (`&shy;`) und eine `id` für
jede h2 ohne `id`. Alle bestehenden `id` bleiben (PA 1.10).

### B.2 Neue Texte

- **Textentwurf** Verweiszeile auf `/nutzungsbedingungen/` (aus PB § 1 (3), `web/konfigurator-bedingungen/index.html:35`): „Für die
  Konfigurator-Pakete gelten eigene Paketbedingungen.“ mit Link „Paketbedingungen“ → `/konfigurator-bedingungen/`.
- **Textentwurf** kürzere Einleitung auf `/widerruf/` (aus `:23`, 33 statt 50 Wörter): „Hier widerrufen Sie einen Vertrag, den Sie als
  Verbraucher über diese Website geschlossen haben, zum Beispiel den Kauf eines Aufmaßblatts. Drei Felder genügen; Sie erhalten sofort eine
  Eingangsbestätigung per E-Mail.“ Rückfall: Bestand. „Widerruf bestätigen“, Feldnamen, Hilfe- und Fehlertexte bleiben wörtlich
  (`web/assets/widerruf.js:20-22`, `functions/api/widerruf.js:46-48`).
- **Textentwurf** Abschnittsliste: Zeile „Alle Abschnitte · 12“ (Zahl aus den h2), Kopf am Schreibtisch „ABSCHNITTE“.

### B.3 Interaktionen und Bausteine

Text-, `mailto:`- und `tel:`-Links; Sprungmarken; `details` der Abschnittsliste; Formular mit drei Pflichtfeldern, `method="post"
action="/api/widerruf"`, mit JavaScript als JSON, ohne JavaScript mit Antwortseite des Servers (`functions/api/widerruf.js:68-90`);
Bestätigung, Fehler, Druck. Vorhanden: `web/assets/recht.css` (`.karte`, `.klein`, `.tabelle` mit `data-k`, `.formular`, `.feld`, `.knopf`,
`.fehler`, `.karte.ok`, `mark.ph`), `web/assets/widerruf.js`, Logo aus `scripts/logo-setzen.py`, Druckregel `web/assets/ratgeber.css:166-172`,
Kopf und Fuß aus `rh-01` (`kopf.js`) und `rh-03` (`fuss.js`, `rahmen.css`).

## C. Exakte Layoutkomposition

**Grundstruktur.** Eine Lesespalte an der linken Ordnungslinie, asymmetrisch (G5). Kein Held (DG T12); das Hauptelement ist das h1, als
dokumentierte Ausnahme DG-E-1 C für Lese- und Arbeitsflächen (Hierarchie über Grad, Gewicht, Tonwert). Ebenen: 0 Grund `#161616` →
20 Karten mit Ring → 30 Text, Tabelle, Formular → 40 Kopf. Im ersten Bildschirm ≈ 45 % Schrift, 0 % Bild, der Rest Grund (Schätzung).
Maßstabssprung (32/17 = 1,9) und Luft sind in der Arbeitsansicht Ziel, nicht Pflicht (SG).

**Größen [V] (08 8.3.7; GEST:29).** h1 32 px am Telefon, 40 px ab 640 px (Bühnenstimme: 800, −0,03 em, Zeilenhöhe 1,05) · h2 24 px, 800,
1,25 · h3 17 px, 800, `--text` (Gewicht statt neuem Grad) · Text 17 px, 500, `--text2`, 1,6; `strong` 700 `--text` · Nebentext 15 px
`--muted` · Label 13 px Technikstimme (600, Versalien, 0,12 em, `tabular-nums`). Fünf Grade in drei Gruppen: Titel (32/40, 24), Lesestufe
(17), Kleinstufe (13–15).

### C.1 Telefon 390 × 844 (4 Spalten, Spalte x 16–374 = 358 px)

| y (px) | Element | Maß, Lage | Satz |
|---|---|---|---|
| 0–56 | Kopf neutral | opak, Haarlinie | `rh-01` |
| 80–100 | Kicker | ab x 16 | 13/20, `--accent` |
| 108–142 | h1 einzeilig (zweizeilig bis 176) | volle Spalte | 32/34 `--text` |
| +8 | Geltungszeile, dann Verweiszeile | je bis 2 Zeilen à 22 | 15 `--muted`, Link `--text` |
| +24 | Hervorhebungskarte | x 16–374, Radius 24, Rand 2 px `--line`, Polster 20 | 17/27 |
| +24 | Abschnittsliste [H] | 52-px-Zeile zwischen Haarlinien | 17/700 |
| +48 | Haarlinie, 16, h2 | x 16–374 | 24/30 |
| +12 | Absätze (Abstand 12), Listen (Einzug 20, Abstand 8) | | 17/27 |

Impressum: Anschrift y 166–314, „Kontakt“ ab 362; der erste Bildschirm zeigt Kicker, h1, Anschrift, Kontakt und den Beginn von
„Verantwortlich für den Inhalt“. Datenschutz: „Kurz gesagt“ reicht von y 166 bis ≈ 1.156 (≈ 1,5 BH); ihr Anschnitt ist das
Fortsetzungssignal.

**`/widerruf/` (mit Textentwurf):**

| y (px) | Element | Maß | Satz |
|---|---|---|---|
| 80–100 · 108–142 | Kicker · h1 | | wie oben |
| 158–293 · 305–350 | Einleitung (5 Zeilen) · Hinweis Widerrufsbelehrung (2 Zeilen) | | 17/27 · 15 `--muted` |
| 374 | Formularkarte, Polster 20, innen x 36–354 | Radius 24 | – |
| 394–474 | Label „Ihr Name“ · Feld | 318 × 52 | 15/700 · 17 |
| 498–683 | Label · Textfeld 3 Zeilen · Hilfe | 318 × 104 | 15/700 · 17 · 15 |
| 707–787 | Label E-Mail · Feld | 318 × 52 | |
| 811–863 | Cream „Widerruf bestätigen“ | 318 × 52, volle Kartenbreite | 17/700 |
| 879–947 · 967 | Datenschutzsatz (3 Zeilen) · Kartenende | | 15 `--muted` |
| 1.015 | Haarlinie, h2 „Andere Wege“ | | 24 |

Bei der realen Höhe von ≈ 664 px stehen Formularbeginn und erstes Feld im ersten Bildschirm, der Knopf nach ≈ ½ Bildschirm. Das erfüllt
„zeitkritische Inhalte ohne Scrollen“ der Arbeitsansicht für den Beginn der Handlung. Die Cream-Pille ist die einzige der Seite.

### C.2 Schreibtisch 1280 × 800 (Spalte x 120–1160, 12 Spalten à 64,67 px, Rinne 24)

| y (px) | Element | Spalten, x |
|---|---|---|
| 0–64 | Kopf neutral: Logo 120–250 · „Für Fensterbauer“ 839–989 · „Fenster ausmessen“ 993–1160 | `rh-01` |
| 112–132 · 140–182 | Kicker · h1 40/42 | ab Spalte 1; h1 höchstens 1–8 (685 px) |
| 190–212 | Geltungszeile | 1–7 |
| ab 236 | Karte, Textkörper, Formular | **Lesespalte 1–7: x 120–717 = 597 px**, ≈ 70 Zeichen |
| ab 236 | Abschnittsliste [H], klebt bei `top: 88px` | 9–12: x 829–1160 = 331 px |
| – | Tabelle (Cookies, ohne Abschnittsliste) | 1–9: x 120–847 = 727 px |
| – | Formular: Felder in Kartenbreite (549 px), Knopf mindestens 240 × 52, linksbündig | 1–7 |

Spalte 8 ist Luft; ohne Abschnittsliste bleiben 8–12 frei (≈ 40 %), ruhiger Grund statt Lücke. 597 px halten die Obergrenze von 820 px
(GEST:429) und die Zeilenlänge 45–75 Zeichen (SG 10.1). **1024 × 768:** Rand 32, Spalte 960, Spalten 58 px; Lesespalte 550 px, Liste x 688–992.

### C.3 Startwerte

| Wert | Start | Begründung |
|---|---|---|
| Abstände | Absatz 12 · Liste 8 · vor h3 24 · vor Haarlinie mit h2 48, danach 16 · um Karten 24 | G6, 1 : 3 : 6 |
| Karten, Tabelle | Radius 24 (heute 20 bzw. 16), `border: 2px solid var(--line)` | DG-AB-8; GEST:32; Rand statt `box-shadow`, der unter `forced-colors` verschwindet |
| Felder | 52 hoch, Radius 12, Polster 0 14 (Textfeld 12 14, mindestens 104), 17 px, Rand 2 px `--muted`, Fläche `--ground` | 08; GEST:455. Der heutige Rand `#3a3a3a` erreicht auf `#1f1f1f` nur ≈ 1,4 : 1, `--muted` ≈ 5,3 : 1 (WCAG 1.4.11; RE R10) |
| Ziele | ≥ 44 px; Links im Fließtext ausgenommen | SKILL:71; WCAG 2.5.8 „inline“ |
| Trennung | Generator setzt `&shy;` in Wörter über 14 Zeichen in h1 und h2 („Geschäfts&shy;bedingungen“, „Nutzungs&shy;bedingungen“, „Verbraucher&shy;streit&shy;beilegung“); Fließtext `hyphens: auto`; überall `overflow-wrap: break-word` | „Geschäftsbedingungen“ in 32 px/800 ≈ 365 px > 358 px: sonst seitliches Scrollen (Prüfsuite Abschnitt 5) |
| Sprungziele | `scroll-padding-top` nach `rh-01` (Kopf + 12); `h2[id], .karte[id] { scroll-margin-top: 17px }` | die Haarlinie über dem Ziel bleibt sichtbar (N12) |

## D. Anwendung der Design-DNA

Verbindlich in der Arbeitsansicht: Nr. 1, 5, 6, 9, 10, 11, die Ordnungslinie aus Nr. 3, scharfe Schrift, alle Mindestanforderungen; Stapel,
Anker, Sprung, Luft sind Ziel (SG). Stufe 1, keine Signature, auch keine informierende (08 8.3.11).

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung, Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achse | Grund 0, Karten 20, Text 30, Kopf 40; einzige Verdeckung: der opake Kopf über dem scrollenden Text | 0–1 | flaches Dokument, nichts lenkt vom Lesen ab |
| Material, Transparenz | Karten matt `#1f1f1f`, Felder vertieft in `--ground`; kein Glas, kein halbtransparenter Kopf (T12) | 0 | Fläche nur als Gruppe: Hervorhebung, Formular, Tabelle |
| Licht, Schatten | keines, keine Lichtkante, nichts schwebt (Nr. 6, 10) | 0 | – |
| Formen | eine Familie: Vollrundung (Knopf), 24 (Karten, Tabelle), 12 (Felder); Haarlinien 1 px | 1 | Formular und Fuß sprechen die Form der Verkaufsseite |
| 3D-Objekte, Bild | keine; ein Bild ohne Inhalt wäre ein Platzhalter als Hauptbild (DG 2.4.1) | 0 | Ernst des Rechtstexts |
| Oberflächendetails | Haarlinie über jedem h2; **Festlegung I:** Ordnungsnummer im h2 („§ 8“, „9.“) als `span` in `--muted`, gleicher Grad, `tabular-nums`; Sprungziel (`:target`) mit grüner Haarlinie bzw. Ring `--text2` (RE-AB-3); Tabellenköpfe und `data-k` in der Technikstimme | 1 | „präzise wie ein Aufmaß“ (DR): Paragrafen schnell finden, ohne Kapitelziffern als Signature (DG 2.3.17/1) |
| Animation | keine, nur Zustände (E-13) | 0 | – |
| Typografie | Bühnenstimme nur im h1; `code` behält die System-Monospace als feste Rolle „Bezeichner“ (Bestand; SG 10.1/9) | – | Hierarchie über Gewicht und Tonwert (DG-E-1 C) |
| Farbe | ≥ 98 % unbunt; Grün nur Kicker und Zielmarke; Cream nur am Knopf auf `/widerruf/`; `--bad` (≈ 6,5 : 1 auf `#1f1f1f`) nur im Fehler, mit Symbol und Satz (SG 10.10 Nr. 5); `--warn` nur in `mark.ph` (Paketbedingungen) | – | Farbe = Funktion |
| Überlagerungen, Perspektive, interaktive Effekte | keine; frontal; Zustände über Farbe, Kontur, Füllung (G1) | 0 | – |

**Bewusst weggelassen:** jede Signature; Kapitelziffern (nur Verkaufsseite und Ansicht Hauseigentümer); Lesefortschritt (DG-AB-15);
„Nach oben“-Knopf (Kopf klebt); Lottie-Haken bei der Bestätigung; Hervorhebung des aktuellen Abschnitts in der Liste (bräuchte einen
Beobachter, die Liste bleibt statisch).

## E. Visual Attention Architecture (erwartet, nicht gemessen)

- **Primär** das h1 (größter Grad, `--text`); **sekundär** die Hervorhebungskarte, die einzige Fläche im ersten Bildschirm. Auf
  `/widerruf/` ist der zweite Pol die Formularkarte mit der Cream-Pille, dem stärksten Hellwert der Seite (≈ 16 : 1).
- **Reihenfolge (Telefon):** grüner Kicker → h1 → Geltung → Karte → Abschnittsliste → erste Haarlinie mit h2 → Text. `/widerruf/`: Kicker →
  h1 → Einleitung → Labels und Felder → Cream → Datenschutzsatz → „Andere Wege“.
- **Kontraste auf `#161616`:** `--text2` ≈ 11 : 1, `--muted` ≈ 5,8 : 1, Kicker ≈ 10,5 : 1, Feldrand ≈ 5,3 : 1 auf der Karte; Haarlinien
  ≈ 1,3 : 1, rein ordnend.
- **Handlungsträger** nur auf `/widerruf/` (Cream), sonst keiner, auch im Kopf nicht. Der Ring „Vertrag widerrufen“ im Fuß bleibt
  Rechtspflicht (GEST:438).
- **Ablenkungen:** Die lange Karte „Kurz gesagt“ der Datenschutzerklärung schiebt § 1 auf Bildschirm 2–3; die klebende Liste am Schreibtisch
  bleibt deshalb `--muted`. Die grüne Zielmarke zieht nur nach einem Sprung.
- **Übergang:** nach 96/128 px die Haarlinie des Fußes; auf `/widerruf/` trägt „Vertrag widerrufen“ dort `aria-current="page"`.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Element | Verhalten | Dauer, Kurve | weniger Bewegung |
|---|---|---|---|---|
| Laden, Scrollen | alles | steht sofort, kein Auftritt (E-13); Sprungziele sofort lesbar | – | gleich |
| Hover (`hover: hover`) | Inline-Link | Unterstreichung 1,5 px, Abstand 3, `--line2` → `--text` (GEST:408) | 150 ms `--e-out` | gleich |
| Hover | Listeneintrag · Feld | `--muted` → `--text` · Rand → `--text2` | 150 ms | gleich |
| Fokus | alle Ziele | Kontur 2 px `--text`, Abstand 2, nie unter dem Kopf | sofort | gleich |
| Tipp in der Abschnittsliste | Sprung | ohne Gleiten (`behavior: auto`): über bis zu 30 BH wäre Gleiten lang und ungenau; Ziel mit `:target`-Marke | sofort | gleich |
| Tipp „Alle Abschnitte“ | `details` | öffnet nativ; „+“ wird „–“ (24-px-Striche, Muster `fb-13`) | sofort | gleich |
| Absenden mit Lücken | Formular | Rand `--bad`, Satz mit Symbol darunter, Fokus aufs erste Feld; kein Rütteln (DG-AB-3; GEST:455); Fehler verschwindet beim Tippen (`widerruf.js:25`) | sofort | gleich |
| Senden | Knopf | `disabled`, „Wird gesendet …“, Deckkraft 0,6 (Bestand) | sofort | gleich |
| Erfolg | Bestätigung | **Festlegung I:** Einleitung, Hinweis und Formular verborgen, Karte direkt unter dem h1, Fokus darauf | Deckkraft 0 → 1, 220 ms `--e-out` | ohne Blende |
| Drucken | Seite | Kopf, Fuß, Menü, Abschnittsliste fallen weg; weißer Grund, schwarze Schrift, Karten mit 1-px-Rand `#999` (wie `ratgeber.css:166-172`); damit ist die Bestätigung druckbar, wie sie es anbietet (`widerruf.js:47`) | – | – |

Grund: Stufe 1, Bedienschicht nur mit Zuständen (G1; SG 10.7/1–3), Bewegung nur mit Sinn (SKILL:45). Ohne JavaScript bleibt alles
bedienbar; die Bestätigung kommt dann als Seite vom Server.

## G. Responsive Design

**Telefon 390 × 844 (zuerst):** wie C.1, eine Spalte, Abschnittsliste als `details` nach der Karte, Felder und Knopf in Kartenbreite; der
Knopf liegt nach dem Scrollen im unteren Daumenbereich. Bei offener Tastatur liegt über dem Feld nur der 56-px-Kopf. **360 px:** Spalte
328 px, die Trennstellen tragen die langen Titel. **320 px und 200 % Text:** kein seitliches Scrollen; Tabellen als Zeilenblöcke mit
`data-k`-Titel (Bestand bis 600 px); E-Mail-Adressen und `code` mit `overflow-wrap: anywhere`.

**640–1023 px:** Lesespalte höchstens 640 px an der Ordnungslinie, h1 40 px, Abschnittsliste als `details`, Tabelle dreispaltig ab 601 px.

**Schreibtisch 1280 und 1024:** wie C.2. Bei mindestens acht h2 steht rechts die klebende Liste: ein Eintrag je h2, 15 px, Zeilen 44 px,
`--muted`, Haarlinien dazwischen, Kopf „ABSCHNITTE“ in der Technikstimme. Höher als der Bildschirm (Nutzungsbedingungen, 17 Einträge bei
768 px), scrollt sie in sich (`max-height: calc(100vh - 112px)`, `overscroll-behavior: contain`). Nichts ist überdimensioniert.

## H. Technische Umsetzung

| Bestand | Umgang |
|---|---|
| `web/assets/recht.css` (sechs Rechtsseiten, Paketbedingungen, `web/404.html`) | **Name bleibt**, weil die Ersatzseite des Servers ihn lädt (`functions/api/widerruf.js:74`). Token-Namen wie `gemeinsam.css` (`--ground`, `--text`, `--text2`, `--muted`, `--line`, `--line2`, `--accent`, `--bad`, `--warn`, `--cream`), alte Namen als Aliasse. Entfällt: h1 `clamp(32px, 7vw, 44px)`, h2 22, h3 18 (außerhalb der Skala), `.fuss` 14 px (geht in `rh-03` auf), `backdrop-filter` (`rh-01`) |
| sechs HTML-Dateien | Kopf und Fuß aus dem Generator (`rh-01`, `rh-03`); genau ein `main`, weil der Server ohne JavaScript `<main>…</main>` ersetzt (`functions/api/widerruf.js:73`); `meta name="stand"` bleibt |
| `scripts/ratgeber-bausteine.mjs` | erweitert: `&shy;` in h1/h2; `id` für h2 ohne `id` (Kurzform des Titels ohne Nummer, z. B. `#haftung`; bestehende gehen vor); Abschnittsliste aus den h2 in beiden Fassungen aus einer Quelle. Idempotent, Prüfsuite Abschnitt 10 vergleicht |
| `web/assets/widerruf.js` | bei Erfolg auch `[data-wr-vorher]` verbergen; `aria-describedby` jedes Felds um seine Fehler-ID ergänzen (heute nur der Hilfetext, `web/widerruf/index.html:34`) |
| `functions/api/widerruf.js` `erfolgHtml()` (`:78-83`) | an die Fassung mit JavaScript angleichen: Kicker, h1 „Vertrag widerrufen“, Karte mit h2 „Ihr Widerruf ist eingegangen.“, darunter „Zur Startseite“; Wortlaut unverändert |

```html
<main class="re">
  <p class="re-kicker">Stand: 18. Oktober 2026</p>
  <h1>Allgemeine Geschäfts&shy;bedingungen</h1>
  <p class="re-geltung">Für Hauseigentümer und alle, die mit der App ihre eigenen Fenster ausmessen</p>
  <div class="re-raster">
    <nav class="re-inhalt" aria-label="Abschnitte">…</nav>                <!-- ab 1024 -->
    <div class="re-text">
      <div class="karte"><p><strong>Kurz gesagt:</strong> …</p></div>
      <details class="re-inhalt-klapp"><summary>Alle Abschnitte · 14</summary><ol>…</ol></details>   <!-- unter 1024 -->
      <h2 id="widerrufsrecht"><span class="re-nr">§ 8</span> Widerrufsrecht</h2> …
    </div>
  </div>
</main>
```

```css
.re { max-width: 1040px; margin: 0 auto; padding: 24px 16px 0 }
.re-kicker { margin: 0 0 8px; font: 600 13px/20px var(--font); letter-spacing: .12em; text-transform: uppercase; color: var(--accent) }
.re h1 { max-width: 685px; margin: 0; font-size: 32px; line-height: 1.05; font-weight: 800; letter-spacing: -.03em; overflow-wrap: break-word }
.re-text { max-width: 40rem; hyphens: auto }
.re h2 { margin: 48px 0 12px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 24px; line-height: 1.25; scroll-margin-top: 17px }
.re h2:target { border-top-color: var(--accent) }                 /* RE-AB-3; Rückfall var(--text) */
.re-nr { color: var(--muted); font-variant-numeric: tabular-nums }
.re .karte { margin: 24px 0; padding: 20px; border: 2px solid var(--line); border-radius: 24px; background: var(--surface) }
.feld input { min-height: 52px; padding: 0 14px } .feld textarea { min-height: 104px; padding: 12px 14px }
.feld input, .feld textarea { border: 2px solid var(--muted); border-radius: 12px; background: var(--ground); font-size: 17px }
.feld [aria-invalid="true"] { border-color: var(--bad) }
.re-inhalt { display: none }
@media (min-width: 640px) { .re h1 { font-size: 40px } }
@media (min-width: 1024px) {
  .re { padding-top: 48px }
  .re-raster { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px }
  .re-text { grid-column: 1 / span 7; grid-row: 1 }
  .re-inhalt { display: block; grid-column: 9 / span 4; grid-row: 1; position: sticky; top: 88px; align-self: start }
  .re-inhalt-klapp { display: none }
}
@media print { .kopf, .rg-fuss, .re-inhalt, .re-inhalt-klapp { display: none } /* Farben wie ratgeber.css:167 */ }
```

**Assets:** keine; beim Inhaber ist nichts anzufragen. Fehlersymbol als Inline-SVG (16 × 16, Kreis mit Ausrufezeichen, `--bad`,
`aria-hidden`), weil Farbe nie allein anzeigen darf (SG 10.10 Nr. 5). **Animationstechnik:** CSS-Übergänge auf Farbe und Deckkraft, keine
Bibliothek, keine fremden Server (SKILL:60). **Leistung:** keine Bilder; Skripte nur `widerruf.js` und `kopf.js` (`defer`); die
Datenschutzerklärung hat ≈ 36 KB HTML; `content-visibility` bleibt weg, weil Sprungziele und Liste sonst springen könnten; CLS 0.
**Barrierefreiheit:** genau ein h1 (`scripts/pruefen.mjs:1566`), Folge h1 → h2 → h3; `main`, `nav` mit Namen; `label for`, `autocomplete`,
`aria-invalid`, Fehler per `aria-describedby`; allgemeiner Fehler `role="alert"`, Bestätigung `role="status"` mit Fokus; Ränder statt
Schatten unter `forced-colors`; Reflow bis 320 px.

**Prüfsuite (IA-O-9):** Abschnitt 5 (`scripts/pruefen.mjs:511-514`) sucht `.fuss a.widerruf-knopf` mit `box-shadow`; mit `rh-03` wird
daraus `.rg-fuss a.rg-widerruf` mit Rand. Die Grünprüfung (`:521-525`) bleibt erfüllt, Links sind nie grün, grün ist nur die Haarlinie.
Abschnitt 17 (`:3785-3850`) prüft Wortlaute, `id` und `method="post" action="/api/widerruf"`; alles bleibt. Die Rechtsseiten der Instanzen
(`functions/instanz/recht.js`) gehören nicht zu diesem Abschnitt.

## I. Conversion-Begründung

- **Lage:** Pflichtseiten hängen flach am Fuß (08 8.1.2) und tragen keine Zielhandlung. Sie wirken indirekt: Wer den Anbieter prüft (F-20),
  an der Kasse die AGB öffnet (H-09) oder als Mitentscheider den Datenschutz liest (EA M-1 bis M-5), findet ein Dokument, das so sorgfältig
  aussieht wie das Produkt (SKILL:38).
- **Gestaltung:** Lesespalte mit ≈ 70 Zeichen, Haarlinien mit Paragrafennummer und Zielmarke senken den Suchaufwand. Karten heben nur
  hervor, was rechtlich hervorgehoben sein soll (Zusammenfassung, Widerrufsbelehrung, Widerspruchsrecht). Cream nur, wo die Seite eine
  Handlung hat.
- **Informationsmenge:** Der Text ist Recht und bleibt vollständig; die Gestaltung senkt nur die Wahrnehmungslast. Kürzen ließen sich
  allenfalls „Kurz gesagt“ und Einleitungen, nur mit Freigabe (PA-Frage 18).
- **Beitrag zur Zielhandlung:** neutraler Kopf zu beiden Zielgruppen; die Verweiszeile führt Paketinteressenten aus dem Altbestand-Vertrag
  zu den Paketbedingungen (FB-6); der Widerruf ist von jeder Seite erreichbar und läuft ohne JavaScript.

| Annahme [H] | Prüfweg | Rückfall |
|---|---|---|
| H-RE1: Die Abschnittsliste hilft auf langen Seiten und wirkt nicht wie ein Inhaltsverzeichnis einer Verkaufsfläche (SKILL:30 gilt dort) | Urteil des Inhabers; Lesetest „Finden Sie die Speicherdauer“ | ohne Liste, Anker bleiben |
| H-RE2: Die Verweiszeile verhindert, dass Paketinteressenten die Nutzungsbedingungen für ihren Vertrag halten | Lesetest mit zwei Fensterbauern | Verweis nur im Fuß |
| H-RE3: Die kürzere Einleitung bringt das Formular früher ins Bild, ohne Verständnis zu kosten | Bildschirmfoto bei 390 × 664; Lesetest | Bestandstext |
| H-RE4: Die Zielmarke zeigt nach einem Sprung (`#pakete`, `#widerrufsbelehrung`), welcher Abschnitt gemeint ist | Sichtprüfung mit dem Link aus dem Anfrageformular | ohne Marke |

**Abweichungen.** Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**:

| Nr. | Bestehend | Vorschlag | Begründung | Rückfall |
|---|---|---|---|---|
| RE-AB-1 | Kicker 800, gesperrt 0,18 em (GEST:26; `recht.css`) | Technikstimme 600, 0,12 em | wie `fb-01` I-AB-2; „ANGABEN NACH § 5 DDG“ bleibt einzeilig | 0,18 em |
| RE-AB-2 | „Headlines mit Punkt am Ende … genau ein Wort je Headline in Grün“ (GEST:26) | Überschriften der Rechtsseiten ohne grünes Wort und ohne Schlusspunkt, wie im Bestand | Namen von Rechtsdokumenten und Paragrafen; ein grünes „Impressum“ wäre Schmuck; Grün trägt der Kicker | grünes Wort nur im h1, wo eines trägt |
| RE-AB-3 | „Grün als Signal: Kicker, Haken, genau ein Wort je Überschrift“ (SKILL:68) | grüne Haarlinie am Sprungziel (`:target`) | aktive Marke als Signal (G8), statisch, nur nach einem Sprung | Haarlinie in `--text` |

Festlegungen I zur Kenntnis: Kicker und Geltung getrennt; Paragrafennummer in `--muted`; Bestätigung ersetzt die Einleitung; Sprünge ohne
Gleiten; Feldrand `--muted` wegen des Kontrasts.

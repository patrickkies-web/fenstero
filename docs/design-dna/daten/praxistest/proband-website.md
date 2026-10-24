# Startseite Wärmepumpen-Fachbetrieb – Gestaltungsentwurf nach Design-Prompt (Ergebnis C)

Umfang: erster Bildschirm und zwei folgende Abschnitte. Ziel: Beratungstermin anfragen. Geräte: Telefon 390 × 844 zuerst, dann Schreibtisch 1280. Technikstufe „Premium mit Ersatzfassung“. Farbpalette frei gewählt.

---

## 1. Kurzbegründung

**Stilvariante: B – Plastischer Hauptdarsteller im Licht.** Im ersten Bildschirm als Szene, in Abschnitt 2 und 3 als freigestellter Körper.
Begründung: Die Außeneinheit selbst, ein grauer Kasten, weckt keine Sehnsucht. Hauseigentümer kaufen ein warmes Haus ohne Öl und Gas. Licht zeigt genau das: draußen kalte blaue Stunde, drinnen warmes Fensterlicht. Variante A (Riesenwort) würde die Aussage auf ein Wort verkürzen und mit dem Gehäusematerial konkurrieren (Zielkonflikt Raumschrift gegen Material). Variante C (flach) trägt die Wärme-Metapher schwächer.

**Ausdrucksträger: Licht** (warmes Licht im kühlen Raum), in allen drei Ansichten gleich: Fensterlicht im ersten Bildschirm, warme Lichtkante am Gerät in Abschnitt 2, warmes Kantenlicht am Ansprechpartner in Abschnitt 3. Eine Stufe darunter liegen die Bildoptik im ersten Bildschirm (Dämmerungsdunst, unscharfer Vordergrund) und die technische Mikroschicht in Abschnitt 2. Ein gleichrangiger zweiter Träger fehlt bewusst.

**Gewählte Stellschrauben (Teil 2), auf der ganzen Seite gleich**

| Stellschraube | Wahl |
|---|---|
| Ordnungsfigur | Ab 1024 px Split: Textspalte links gegen Bildbühne rechts. Darunter senkrechter Stapel an der linken Kante. Raster 12/8/4 Spalten. |
| Tiefenmittel | einseitige Verdeckung (Motiv oder Vordergrund über einer hinteren Ebene), im ersten Bildschirm zusätzlich Bildoptik |
| Fokusträger | erster Bildschirm: Szene (88 % der Fläche, Textzone frei) · Abschnitt 2: freigestelltes Objekt (≈ 20 %) · Abschnitt 3: freigestellte Person in einer Bühne (≈ 25–29 %) |
| Material | matt, nur am Fokusträger (pulverbeschichtetes Gehäuse). Kein Glas, weil es nirgends über gesättigtem Bildinhalt läge (die Dämmerungsszene ist dunkel und entsättigt). |
| Licht | fotografisch bzw. Studiolicht im Asset, warm, Richtung links oben (Token `--licht-x/-y`), ein Lichtkern je Ansicht |
| UI-Flächen | opak und flach. Hover-Kanal: Deckkraft einer hellen Überlagerung. Aktiv-Kanal: Füllung gegen Kontur. |
| Formfamilie | Vollrundung: Aktionen und einzeilige Felder als Pille, Kreis-Schalter, Bühne groß gerundet; 2 Radienwerte |
| Schrift | Etikett neben dem Motiv. Serife für Headlines, Grotesk für Text und Bedienung, Monospace nur als Bezeichner (Index, Bemaßung). |
| Grundton | dunkel (Nachtblau); Figur-Grund-Trennung über Lichtkante |
| Fortsetzungssignal | angeschnittene Folgesektion, 12 % der Viewporthöhe |
| Verankerung | erster Bildschirm: Vordergrund · Abschnitt 2: Überdeckung der Bodenlinie + Lichtsaum · Abschnitt 3: Anschnitt an der Bühnenunterkante |

**Technikstufe 1.** Annahme zur Angabe „Premium mit Ersatzfassung“: Videoschleife im Motiv des ersten Bildschirms und CSS-Scrollanimation (Parallax). Für jede Bewegung gibt es ein vollständiges Standbild als Ersatzfassung. Stufe 2 scheidet aus, weil niemand Objekt oder Kamera stetig steuert (Teil 7).

**Annahmen**
- **Annahme Marke:** Arbeitsname „Ruhewärme“ als Wortmarke in Satzschrift. Wird durch den echten Firmennamen ersetzt.
- **Annahme Zielgruppe:** Eigentümer von Einfamilienhäusern im Bestand (Baujahr etwa 1960–2005, heute Gas oder Öl), 35–70 Jahre alt. Sie lesen überwiegend abends am Telefon. Ihre Hauptsorgen: Eignet sich mein Haus? Wie laut ist das Gerät? Was kostet es, welche Förderung gibt es?
- **Annahme Inhalte:** Abschnitt 2 „Ablauf in vier Schritten“, Abschnitt 3 „Anfrage“ mit Kurzformular. Alle Handlungsaufrufe führen zu `#anfrage`.
- **Annahme Bildmaterial:** eigene Fotoproduktion an einem Referenzhaus (blaue Stunde, Winter), Freisteller einer Außeneinheit (Foto oder Render) ohne Herstellerlogo, Freisteller-Porträt eines echten Mitarbeiters. Keine Stockfotos.
- **Annahme Schriften:** Newsreader (Headlines), Instrument Sans (Text und Bedienung), JetBrains Mono (nur Index und Bemaßung). Alle selbst gehostet als woff2 mit Latin-Teilmenge.
- **Annahme Viewports:** Telefon 390 × 844 (im Browser nutzbare Höhe 664–844 px), Schreibtisch 1280 × 800.
- **Annahme Aussagen:** „Rückmeldung innerhalb eines Werktags“, „verbindliches Angebot“, Telefonnummer, Region und Name des Ansprechpartners sind Platzhalter. Der Betrieb muss sie vor der Veröffentlichung bestätigen.
- **Farbpalette (frei):** fünf Werte, Rollen nach Teil 8, nämlich Grund (Zentrum und Rand), Text, Hell, Tief und genau eine Akzentrolle.

---

## 2. Tokens (drei Schichten)

```css
/* ===== Schicht 1 – Marke: Rohwerte. Nur hier stehen Farb- und Schriftwerte. ===== */
:root {
  --marke-nacht:     #0F1A26;
  --marke-schiefer:  #1C2A38;
  --marke-tief:      #070D14;
  --marke-kalk:      #F4F1EA;
  --marke-bernstein: #E8A54B;

  --marke-familie-titel: "Newsreader", "Iowan Old Style", Georgia, serif;
  --marke-familie-text:  "Instrument Sans", "Segoe UI", system-ui, sans-serif;
  --marke-familie-index: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;
}

/* ===== Schicht 2 – Rollen und Basiswerte ===== */
:root {
  /* Farbrollen nach Teil 8 */
  --rolle-grund:         var(--marke-nacht);
  --rolle-grund-zentrum: var(--marke-schiefer);   /* Lichtraum-Zentrum, zugleich Bühnenfläche */
  --rolle-text:          var(--marke-kalk);
  --rolle-hell:          var(--marke-kalk);       /* Kanten, Fokus, Hover-Überlagerung */
  --rolle-tief:          var(--marke-tief);       /* Schattenton: Scrim */
  --rolle-akzent:        var(--marke-bernstein);  /* nur Hauptaktion, ≤ 5 % Fläche */

  /* Abgeleitete Stufen derselben Rollen – keine neuen Farbtöne */
  --rolle-text-leise:    color-mix(in srgb, var(--rolle-text) 68%, var(--rolle-grund));          /* ≈ #ABACAB */
  --rolle-kontur:        color-mix(in srgb, var(--rolle-hell) 45%, var(--rolle-grund-zentrum));  /* ≈ #7D8488 */
  --rolle-kontur-stark:  color-mix(in srgb, var(--rolle-hell) 70%, var(--rolle-grund-zentrum));
  --rolle-haarlinie:     color-mix(in srgb, var(--rolle-hell) 14%, transparent);
  --rolle-annotation:    color-mix(in srgb, var(--rolle-hell) 30%, transparent);
  --rolle-ueberlagerung: color-mix(in srgb, var(--rolle-hell) 12%, transparent);
  --rolle-auf-akzent:    var(--rolle-grund);

  /* Schriftfamilien */
  --familie-titel: var(--marke-familie-titel);
  --familie-text:  var(--marke-familie-text);
  --familie-index: var(--marke-familie-index);

  /* Abstand: Basis 4 px; Gruppe : Gruppen : Zonen = 1 : 3 : 6 */
  --abstand-1: 4px;   --abstand-2: 8px;   --abstand-3: 12px;  --abstand-4: 16px;
  --abstand-6: 24px;  --abstand-8: 32px;  --abstand-12: 48px; --abstand-16: 64px;
  --abstand-24: 96px; --abstand-32: 128px;
  --abstand-gruppe:  var(--abstand-2);
  --abstand-gruppen: var(--abstand-6);
  --abstand-zonen:   var(--abstand-12);
  --seitenrand:      clamp(1rem, 5vw, 6rem);          /* 19,5 px bei 390 · 64 px bei 1280 */
  --abschnitt:       clamp(4rem, 2rem + 8vw, 10rem);  /* 64 px bei 390 · 134 px bei 1280 */
  --spaltenabstand:  clamp(1rem, 2.5vw, 2rem);
  --lesebreite:      30rem;                            /* 480 px = 37,5 % von 1280 */

  /* Schrift: zwei Textgrade (Spreizung 1,21) und ein Headline-Grad je Ansicht */
  --grad-text:    clamp(1rem, 0.95rem + 0.2vw, 1.0625rem); /* 16 → 17 px */
  --grad-klein:   0.875rem;                                  /* 14 px: Versal-Labels, Index, Hinweise */
  --grad-titel:   clamp(2.25rem, 1.5rem + 3vw, 4.5rem);      /* 36 px mobil · 62 px bei 1280 */
  --grad-titel-2: clamp(2.25rem, 1.25rem + 2.5vw, 3.5rem);   /* 36 px mobil · 52 px bei 1280 */
  --zeile-text:  1.55;
  --zeile-titel: 1.1;
  --laufweite-versal: 0.08em;

  /* Radien: eine Familie (Vollrundung), zwei Werte */
  --radius-voll:  9999px;
  --radius-gross: 28px;
  --haarlinie:    1px;
  --fokus-breite: 2px;
  --fokus-abstand: 3px;

  /* Ebenen */
  --z-grund: 0; --z-kulisse: 10; --z-motiv: 20; --z-vordergrund: 25; --z-bedien: 30; --z-nav: 40;

  /* Licht: Richtung, aus der das Licht kommt (links oben) */
  --licht-x: -0.55;
  --licht-y: -0.85;

  /* Bewegung */
  --dauer-zustand:     160ms;
  --dauer-austritt:    120ms;
  --dauer-panel:       240ms;
  --dauer-panel-aus:   180ms;
  --dauer-einblendung: 400ms;
  --kurve-zustand:  cubic-bezier(0.2, 0, 0, 1);
  --kurve-austritt: cubic-bezier(0.4, 0, 1, 1);
  --parallax-motiv: 0.92;

  /* Scrim */
  --scrim-deckkraft: 55%;
}

@media (max-width: 639px) {
  :root { --radius-gross: 20px; --parallax-motiv: 0.95; }
}

@media (prefers-contrast: more) {
  :root {
    --rolle-text-leise:   var(--rolle-text);
    --rolle-kontur:       var(--rolle-hell);
    --rolle-kontur-stark: var(--rolle-hell);
    --rolle-haarlinie:    color-mix(in srgb, var(--rolle-hell) 40%, transparent);
    --scrim-deckkraft:    85%;
    --fokus-breite:       3px;
  }
}

@media (prefers-reduced-transparency: reduce) {
  :root {
    --scrim-deckkraft:  80%;
    --rolle-haarlinie:  color-mix(in srgb, var(--rolle-hell) 14%, var(--rolle-grund));
    --rolle-annotation: color-mix(in srgb, var(--rolle-hell) 30%, var(--rolle-grund));
  }
}

/* ===== Schicht 3 – Komponenten (lesen nur Schicht 2) ===== */
:root {
  --kopf-hoehe:      56px;
  --kopf-text:       var(--rolle-text);
  --kopf-grund-fest: var(--rolle-grund);
  --kopf-kante:      var(--rolle-haarlinie);

  --aktion-hoehe:     52px;
  --aktion-polster-x: var(--abstand-8);
  --aktion-radius:    var(--radius-voll);
  --aktion-grund:     var(--rolle-akzent);
  --aktion-text:      var(--rolle-auf-akzent);
  --aktion-hover:     var(--rolle-ueberlagerung);

  --kontur-aktion-rand:        var(--rolle-kontur);
  --kontur-aktion-text:        var(--rolle-text);
  --kontur-aktion-hover:       var(--rolle-ueberlagerung);
  --kontur-aktion-aktiv-grund: var(--rolle-hell);
  --kontur-aktion-aktiv-text:  var(--rolle-grund);
  --kreis-aktion-groesse:      44px;

  --textlink-farbe:       var(--rolle-text);
  --textlink-linie-ruhe:  color-mix(in srgb, var(--rolle-text) 40%, transparent);
  --textlink-linie-hover: var(--rolle-text);

  --feld-hoehe:              52px;
  --feld-radius:             var(--radius-voll);
  --feld-grund:              var(--rolle-grund);
  --feld-rand:               var(--rolle-kontur);
  --feld-rand-hover:         var(--rolle-kontur-stark);
  --feld-rand-fehler-breite: 2px;
  --feld-text:               var(--rolle-text);
  --feld-label:              var(--rolle-text);
  --feld-hinweis:            var(--rolle-text-leise);

  --buehne-radius:     var(--radius-gross);
  --buehne-grund:      var(--rolle-grund-zentrum);
  --buehne-lichtkante: var(--rolle-haarlinie);
  --buehne-polster:    clamp(0.75rem, 3vw, 2.5rem);   /* 12 px bei 390 · 38 px bei 1280 */

  --schrittmarke-groesse: 36px;
  --schrittmarke-rand:    var(--rolle-kontur);
  --schrittmarke-ziffer:  var(--rolle-text);

  --annotation-linie: var(--rolle-annotation);
  --annotation-text:  var(--rolle-text-leise);

  --lichtraum-zentrum: var(--rolle-grund-zentrum);
  --lichtraum-rand:    var(--rolle-grund);

  --scrim-farbe: var(--rolle-tief);
  --fokus-ring:  var(--fokus-breite) solid var(--rolle-hell);
}
```

---

## 3. Bildschirme und Abschnitte

### 3.1 Erster Bildschirm (Hero)

**a) Zweck und Hauptaktion**
In etwa fünf Sekunden soll klar sein, was der Betrieb tut (Wärmepumpen planen und einbauen), für wen (Einfamilienhaus) und mit welchem Nutzen (warm wohnen ohne Öl und Gas). Danach führt die Seite zur Anfrage.
Hauptaktion: „Beratungstermin anfragen“ → `#anfrage`. Sekundär: Anruf (`tel:`).

**b) Ebeneninventar (hinten → vorn)**

| z | Ebene | Inhalt | Medium |
|---|---|---|---|
| 0 | Grund | Nachtblau `--rolle-grund`, sichtbar im Fortsetzungsanschnitt und beim Laden | CSS-Farbe |
| 20 | Motiv (Szene) | Einfamilienhaus in der blauen Stunde, Winter. Ein bodentiefes Fenster leuchtet warm: das ist der Anker. Ein kleines Obergeschossfenster leuchtet mit höchstens 50 % seiner Helligkeit, Außenleuchten sind aus. Die Außeneinheit steht an der Hauswand im Schatten, das Fensterlicht streift ihre linke Gehäusekante. Leichter Dunst vor den Bäumen. Zur Ebene gehören der Scrim (Tief, Schreibtisch von links, Telefon von unten) und die Ausblendung des unteren Bildrands in den Grund. Darüber liegt die Videoschleife im gleichen Zuschnitt. | Poster als AVIF/WebP-`<img>`; Schleife als MP4 (H.264) und WebM (AV1); Scrim als CSS-Verlauf |
| 25 | Vordergrund | Unscharfe Gräser bzw. Strauch, freigestellt, als Randstreifen. Schreibtisch: unten rechts, Tiefe 18 % der Bühnenhöhe, x 55–100 %. Telefon: am rechten Rand, Breite 18 %, y 30–42 %. Er überdeckt Hausfuß und Gerätesockel. | AVIF mit Alpha |
| 30 | Bedienschicht | Etikett, H1, Subline, Primär-Pille, Anruf-Link, Vertrauenszeile, Bewegungs-Schalter | Live-Text im DOM |
| 40 | Navigation | Wortmarke, Links (Schreibtisch) bzw. Menü-Pille (Telefon); Menü-Panel als Popover | HTML |

5 Ebenen. **Verdeckung:** Der Vordergrund (25) überdeckt Hausfuß und Gerätesockel (20). Im Foto steht außerdem das Haus vor den Bäumen, und der Dunst nimmt nach hinten zu (Bildoptik).
**Vorgaben für die Aufnahme:**
- Kamera: Brennweite etwa 70 mm Kleinbild (horizontales Sichtfeld ≈ 29°), Augenhöhe 1,4 m, Haus höchstens 15° schräg.
- Textzone: Schreibtisch x ≤ 46 %, Telefon y ≥ 43 %. Dort hat die hellste Stelle eine relative Luminanz ≤ 0,05 (etwa #2A3F57).
- Himmel in der Kopfzeile: L ≤ 0,03.
- Zone des Bewegungs-Schalters (Schreibtisch unten rechts, 120 × 120 px): ohne Lichter, L ≤ 0,03.
- Gerät ohne Herstellerlogo.

**c) Komposition**

*Telefon (390 × 844) – zuerst*
- **Ordnungsfigur:** senkrechter Stapel an der linken Kante. **Ordnungslinie** x = 19,5 px (Seitenrand). Wortmarke, Etikett, H1, Subline, Pille, Link und Vertrauenszeile fluchten darauf. Keine Zweitlinie.
- **Anker:** warmes Fenster, x 30–68 %, y 12–32 % (≈ 150 × 170 px). **Fokusreiz:** Helligkeit + Wärme. Zweiter Gewichtspol: die Außeneinheit (x 62–84 %, y 33–40 %), kühl und dunkel, ohne Fokusreiz.
- **Stapel:**
  - Kopfzeile 0–56 px über dem Himmel, dann der Anker.
  - Ab y ≈ 364 px (43 %) die Textzone auf dunklem Rasen: Etikett, H1 (2 Zeilen), Subline (3 Zeilen), Primär-Pille (y ≈ 591–643), Anruf-Link, Vertrauenszeile.
  - Bewegungs-Schalter unten rechts (x 326–370), als letzte Position im Lesestapel.
  - Höhe des ersten Bildschirms 88svh = 743 px, darunter 101 px (12 %) angeschnittener Abschnitt 2 mit dem Deckel des Geräts.
- **Flächenanteile:** frei ≈ 44 % (Himmel, dunkle Fassade, Rasen, Anschnitt) · dominante Motivteile ≈ 16 % (Szene insgesamt 88 %) · Text und Bedienung ≈ 20 % · Kopfzeile ≈ 4 % · unruhige, nicht dominante Bildteile ≈ 16 %.
- **Maßstabssprung:** Anker 170 px gegen 11 px Versalhöhe der Bedienschrift (16 px × 0,7) ergibt **≈ 15-fach**. Die H1-Versalhöhe (36 px × 0,65 ≈ 23 px) ist 2,1-fach größer als die Bedienschrift, der Anker 7-fach größer als die H1.

*Schreibtisch (1280 × 800)*
- **Ordnungsfigur:** Split. Textspalte x 64–544 (30rem = 37,5 % der Breite), die Szene läuft vollflächig dahinter. **Ordnungslinie** x = 64 px für Wortmarke und gesamten Lesestapel. Keine Zweitlinie.
- **Anker:** Fenster x 62–80 %, y 20–58 % (≈ 230 × 300 px). Außeneinheit x 83–94 %, y 58–72 %. Textstapel bei y 200–580, vertikal um 46 % zentriert.
- **Flächenanteile:** frei ≈ 52 % · dominante Motivteile ≈ 18 % · Text ≈ 11 % (gemessen an den Zeilenboxen; der Umriss des Blocks ergibt 17 %) · Kopfzeile ≈ 4 %.
- **Maßstabssprung:** Anker 300 px gegen 11,9 px Versalhöhe der Bedienschrift ergibt **≈ 25-fach**. Die H1 (62 px, Versalhöhe ≈ 40 px) ist 3,4-fach größer als die Bedienschrift, der Anker 7,5-fach größer als die H1.
- **Größenstufen:** 3 je Ansicht (Anker, H1, Textgrade 14 und 16–17 px mit Spreizung 1,21).

**d) Bausteine der Bedienschicht** (Formfamilie Vollrundung)

| Baustein | Form | Radius-Token | Zustände | Zustandskanal |
|---|---|---|---|---|
| Wortmarke „Ruhewärme“ (Link zur Startseite) | Text, Fokusfläche als Pille | `--radius-voll` | Ruhe, Hover, Fokus | Hover: Deckkraft der Unterstreichung |
| Nav-Links (Schreibtisch: Leistungen, Ablauf, Förderung, Kontakt, Telefonnummer) | Textlinks, Trefferfläche 44 px hoch | `--radius-voll` (Fokusring) | Ruhe, Hover, Fokus | Hover: Unterstreichung 40 % → 100 % Deckkraft |
| Menü-Pille (Telefon) | Kontur-Pille 44 px, „Menü“ und Zwei-Strich-Symbol | `--radius-voll` | Ruhe, Hover, Fokus, offen (`aria-expanded`) | Hover: 12 % helle Überlagerung · aktiv/offen: Füllung Kalk, Text Nacht |
| Menü-Panel | Popover in voller Fläche, opak Nacht, Zeilen 56 px mit Haarlinien, Schließen-Kreis 44 px | Kreis `--radius-voll` | geschlossen, offen | Deckkraft 240 ms ein, 180 ms aus |
| Primär-Pille „Beratungstermin anfragen“ | gefüllt Bernstein, 52 px hoch, Polster 32 px, Breite nach Inhalt (≈ 270 px) | `--radius-voll` | Ruhe, Hover, Fokus, gedrückt | Hover: 12 % helle Überlagerung · gedrückt: 20 % · Fokus: Ring 2 px Kalk, Abstand 3 px, folgt der Form |
| Anruf-Link „Lieber anrufen: …“ | Textlink, Trefferfläche 44 px hoch | `--radius-voll` (Fokusring) | Ruhe, Hover, Fokus | Hover: Deckkraft der Unterstreichung |
| Bewegungs-Schalter | Kontur-Kreis 44 × 44 px mit Pause- bzw. Abspiel-Symbol, `aria-pressed`, `aria-label` „Bewegung anhalten“ bzw. „fortsetzen“ | `--radius-voll` | läuft, angehalten, Hover, Fokus | Hover: Überlagerung · aktiv (angehalten): Füllung Kalk und Symbolwechsel |

Kein Baustein mit Schatten, Glanz, Glow oder Kippung. Keine Formänderung bei Hover oder Laden.

**e) Texte**

| Element | Text | Wörter |
|---|---|---|
| Etikett (Versal 14 px, +0,08 em) | WÄRMEPUMPEN FÜR EINFAMILIENHÄUSER · [REGION] | 4 |
| H1 | Warm wohnen ohne Öl und Gas. | 6 |
| Subline | Wir planen und installieren Ihre Wärmepumpe – von der Heizlastberechnung bis zur Inbetriebnahme, mit einem festen Ansprechpartner. | 16 |
| Primär | Beratungstermin anfragen | 2 |
| Sekundär | Lieber anrufen: 0000 123 456 (Platzhalter) | 3 |
| Vertrauenszeile (14 px) | Kostenlos und unverbindlich · Rückmeldung innerhalb eines Werktags (Annahme) | 7 |
| **Summe außerhalb der Navigation** | | **38 von höchstens 40** |

H1: 2 Zeilen auf Telefon und Schreibtisch. Zeilenlänge der Subline: ≈ 57 Zeichen (Schreibtisch), ≈ 45 Zeichen (390 px).
Alternativtext des Motivs: „Einfamilienhaus in der Abenddämmerung; ein großes Fenster leuchtet warm, an der Hauswand steht die Außeneinheit einer Wärmepumpe.“

**f) Signature-Effekte**

| Effekt | Erfüllte Bedingung |
|---|---|
| Selbstleuchtende Quelle mit Lichthof | Ein Kern am Anker (Fenster), der Lichthof fällt auf Rasen und Gerätekante. Die einzige weitere Leuchtinsel (Obergeschossfenster) ist höchstens halb so hell. |
| Dunst und rahmender Vordergrund | Kamera-Szene. Der Randstreifen ist 18 % tief (≤ 25 %) und liegt nie über Text: Schreibtisch erst ab x 55 %, die Textspalte endet bei 42,5 %; Telefon rechts oberhalb der Textzone. |

Nicht eingesetzt: Glas (Bedingung „über gesättigtem Bildinhalt“ nicht erfüllt), Schein, Formbruch, Rahmenbruch.

**g) Bewegung**
- **Träger:** genau einer, die Videoschleife im Motiv. Die Lüfterflügel der Außeneinheit drehen ruhig hinter dem Gitter, sonst steht alles still. Bewusst nicht: Schnee, Wolkenzug, Dampf. Sie würden den Textkontrast einzelner Frames gefährden, Dampf würde zudem als Abgas missverstanden.
- **Dauer:** 8 s Periode, nahtlos. Erstes und letztes Bild entsprechen dem Poster.
- **Kurve:** im Video linear (konstante Drehzahl). Das Video erscheint über dem Poster per Deckkraft 0 → 1 in 300 ms, erst beim Ereignis `playing`.
- **Auslöser:** nach `load` und `requestIdleCallback` (spätestens nach 2 s). Nur ohne `prefers-reduced-motion`, ohne `Save-Data` und ohne 2g/3g-Verbindung, und nur solange der erste Bildschirm sichtbar ist (IntersectionObserver pausiert sonst).
- **Pausieren:** Bewegungs-Schalter, weil die Schleife länger als 5 s selbst läuft. Der Zustand wird mit try/catch in `localStorage` gemerkt.
- **CSS-Scrollanimation:** Parallax nur an der Motivebene, Faktor 0,92 (Telefon 0,95). `animation-timeline: scroll(root)`, nur `transform`, innerhalb von `@supports (animation-timeline: scroll())`. Vordergrund, Text und UI bewegen sich mit Faktor 1,0. Kein Anheften, keine Scroll-Übernahme.
- **Kopfzeile:** Beim Verlassen des ersten Bildschirms wechselt sie von transparent zu opak Nacht mit Haarlinie: Deckkraft 160 ms, `cubic-bezier(0.2, 0, 0, 1)`. Der Klassenwechsel kommt per IntersectionObserver.
- **Fassung „weniger Bewegung“:** Poster statt Video, kein Parallax, Kopfzeile wechselt ohne Übergang, der Bewegungs-Schalter entfällt.

**h) Mobilfassung ab 360 px**
- **Stapel:** wie in c), Anker oben, Lesestapel darunter. Hauptaktion ohne Scrollen sichtbar.
- **Zuschnitt:** eigener Hochformat-Zuschnitt (780 × 1486 px, @2x) mit Fenster im oberen Drittel. `object-position: 50% 0%`, damit bei geringer Höhe nur Rasen unten wegfällt und nie der Anker.
- **Bei 360 px:**
  - Seitenrand 18 px.
  - H1 36 px, „Warm wohnen ohne“ ≈ 259 px von 324 px.
  - Subline 3 Zeilen.
  - Primär-Pille 270 px; auch bei 320 px passt sie in 288 px, kein horizontales Scrollen.
- **Nutzbare Höhe < 700 px** (Browserleisten): Die Vertrauenszeile entfällt (sie steht ohnehin in Abschnitt 3), der Motivbereich schrumpft per Zuschnitt. Die Primär-Pille liegt dann bei y ≈ 513–565 px und bleibt sichtbar.
- **200 % Text:** Der erste Bildschirm hat `min-height` statt `height`, Texte wachsen, die Pille bricht um (`min-height` statt fester Höhe).
- **Entfällt mobil:** zweite Parallaxebene (es gibt nur eine), Video bei Datensparmodus oder langsamer Verbindung.
- **768 px:** eigener Zuschnitt 3 : 4, Stapel wie Telefon, Textspalte 30rem.

**i) Ersatzfassungen**

| Fassung | Verhalten |
|---|---|
| ohne JavaScript | Poster-Standbild mit identischer Ebenenfolge, Anker und Maßstabssprung. Kein Video, daher kein Bewegungs-Schalter. Kopfzeile absolut statt klebend. Menü über das Popover-Attribut (`popovertarget`) ohne Skript bedienbar. Links funktionieren. |
| ohne backdrop-filter | kein Glas verwendet, daher unverändert |
| reduzierte Transparenz | Scrim-Startdeckkraft 55 % → 80 %, Haarlinien opak gemischt. Die Textzone wird damit nahezu deckend; Teil 7 geht R4 vor. |
| erhöhter Kontrast | Sekundärtext und Konturen werden Kalk, Konturen 2 px, Scrim 85 %, Fokusring 3 px, Unterstreichungen 100 % |
| `forced-colors: active` | Pillen und Kreise erhalten `1px solid ButtonText`. Die Primär-Pille nutzt `ButtonFace`/`ButtonText`. Das Bild bleibt, Text erhält die systemseitige Unterlegung (Backplate). Fokus in `Highlight`. |
| Datensparmodus | kein Video, die Monospace-Schrift wird nicht geladen (Rückfall `ui-monospace`) |

**j) Kontrastpunkte** (WCAG-Kontrast; Untergrund an der ungünstigsten Stelle)

| Text / Element | Ungünstigste Stelle | Wert | Ziel |
|---|---|---|---|
| H1 Kalk (≥ 24 px) | Schreibtisch: Zeilenende x ≈ 42 %, Scrim dort ≈ 17 %. Telefon: erste Zeile bei y ≈ 46 %, Scrim ≈ 10 %. Fotozone L ≤ 0,05. | ≥ 9,3 : 1 | 3 : 1 |
| Subline, Text leise (16–17 px) | dieselben Stellen | ≥ 5,3 : 1 (ohne Scrim im Fehlerfall 4,6 : 1) | 4,5 : 1 |
| Etikett, Kalk 14 px Versal | Telefon y ≈ 43 %, Scrim ≈ 0 % | ≥ 9,3 : 1 | 4,5 : 1 |
| Primär-Pille: Text Nacht auf Bernstein | – | 8,3 : 1 (Hover 8,9 : 1) | 4,5 : 1 |
| Primär-Pille gegen Umfeld | hellste Bildstelle neben der Pille (L ≤ 0,05) | ≥ 5,0 : 1 | 3 : 1 |
| Anruf-Link, Kalk | wie H1 | ≥ 9,3 : 1 | 4,5 : 1 |
| Vertrauenszeile, Text leise 14 px | Schreibtisch x ≤ 38 % (Scrim ≥ 27 %), Telefon y ≈ 85 % (Scrim ≥ 40 %) | ≥ 5,8 : 1 | 4,5 : 1 |
| Wortmarke und Nav-Links, Kalk | Himmel oben, L ≤ 0,03 | ≥ 11,6 : 1 | 4,5 : 1 |
| Kontur der Menü-Pille und des Bewegungs-Schalters (≈ #7D8488) | Himmel oben bzw. Zone unten rechts (L ≤ 0,03); Telefon auf Grund Nacht | ≥ 3,4 : 1 | 3 : 1 |
| Fokusring, Kalk 2 px | hellste Bildstelle neben einem fokussierbaren Element | ≥ 9,3 : 1 | 3 : 1 |

---

### 3.2 Abschnitt 2 – Ablauf („Geplant, bevor gebohrt wird.“)

**a) Zweck und Hauptaktion**
Die Sorge „Passt das zu meinem Haus?“ nehmen, indem der Ablauf sichtbar und überschaubar wird. Hauptaktion des Abschnitts: Kontur-Pille „Termin anfragen“ → `#anfrage`. Die Bernstein-Akzentfläche bleibt dem ersten Bildschirm und dem Formular vorbehalten.

**b) Ebeneninventar (hinten → vorn)**

| z | Ebene | Inhalt | Medium |
|---|---|---|---|
| 0 | Grund mit Lichtraum | Nachtblau; radialer Lichtraum hinter dem Gerät mit dem 1,3-fachen der Gerätebreite, Zentrum Schiefer, Rand Nacht (2 Verlaufszonen) | CSS-Verlauf |
| 10 | Kulisse: technische Mikroschicht | Haarfeine Bemaßungslinien (1 px, `--annotation-linie`): waagerechte Maßlinie durch das Gerät, Bodenlinie, zwei Maßpfeile. Monospace-Bezeichner als Beispiel: „Aufstellort“, „Abstand zur Grundstücksgrenze“, „Heizlast raumweise“. Dazu der Index „02 · Ablauf“. Liegt nur rechts in der Bühne, nie unter Fließtext; `aria-hidden`. | Inline-SVG + Text |
| 20 | Motiv | Freisteller der Außeneinheit, frontal mit leichter Aufsicht, hellgrau matt. Warme Lichtkante oben links, rechte Seite fällt ins Dunkel. Alpha-Kante 1–2 px ohne Saum. | AVIF/WebP mit Alpha (Telefon ≤ 60 KB, Schreibtisch ≤ 120 KB) |
| 30 | Bedienschicht | Index, H2, Intro, Schrittliste (4), Kontur-Pille | Live-Text |
| 40 | Navigation | klebende Kopfzeile, opak | HTML |

5 Ebenen. **Verdeckung:** Das Gerät (20) überdeckt die waagerechte Maßlinie und die Bodenlinie (10); beide laufen beidseitig sichtbar weiter.

**c) Komposition**

*Telefon*
- **Ordnungsfigur:** senkrechter Stapel an der linken Kante, Ordnungslinie x = 19,5 px.
- **Stapel:**
  - Anker oben: das Gerät, 280 px breit (≈ 230 px hoch), linke Kante auf der Ordnungslinie. Die Maßlinie läuft rechts in den Randanschnitt.
  - Darunter Index, H2, Intro, Schrittliste und Kontur-Pille.
  - Die Schrittmarke steht in derselben Zeile vor dem Schritttitel. Die Beschreibung beginnt darunter wieder auf der Ordnungslinie, es entsteht also keine Zweitlinie.
- **Anker und Fokusreiz:** das Gerät, Helligkeit (hellgrau, beleuchtet auf Nacht).
- **Flächen** (Ansicht 390 × 844 beim Erreichen des Abschnitts): frei ≈ 46 %, Fokusträger ≈ 20 %, Text ≈ 28 %.
- **Maßstabssprung:** Gerät 230 px gegen 11 px ergibt **≈ 21-fach**.

*Schreibtisch*
- **Ordnungsfigur:** Split wie im ersten Bildschirm.
  - Textspalte x 64–544: Index, H2, Intro, Schrittmarken und Kontur-Pille auf der Ordnungslinie x = 64.
  - Zweitlinie x = 112 (+48 px = 3,75 % der Breite) für Schritttitel und Schritttext (Schrittmarke 36 px + 12 px Abstand).
  - Bühne rechts: Spalten 7–12 mit Gerät (520 × 440 px), Lichtraum und Mikroschicht.
- **Anker:** Gerät, Fokusreiz Helligkeit. Die warme Lichtkante oben links wiederholt die Lichtrichtung des ersten Bildschirms.
- **Flächen** (Ansicht 1280 × 800): frei ≈ 48 %, Fokusträger ≈ 20 %, Text ≈ 22 %, Mikroschicht ≈ 4 %.
- **Maßstabssprung:** Gerät 440 px gegen 11,9 px ergibt **≈ 37-fach**. H2 52 px (Versalhöhe ≈ 34 px) ist 2,9-fach größer als die Bedienschrift. 3 Größenstufen.
- **Fortsetzung aus dem ersten Bildschirm:** Im 96-px-Anschnitt (Schreibtisch) stehen Index und oberste Maßlinie. Im 101-px-Anschnitt (Telefon) sind Index und Gerätedeckel zu sehen.

**d) Bausteine**

| Baustein | Form | Radius-Token | Zustände | Kanal |
|---|---|---|---|---|
| Schrittliste `<ol>` | flache Liste, Schritte durch Haarlinien (`--rolle-haarlinie`) getrennt, keine Karten | – | statisch | – |
| Schrittmarke | Kontur-Kreis 36 px, Ziffer in Monospace 14 px, Formreim zum runden Lüftergitter; die Ziffer kommt aus dem `<ol>`-Zähler | `--radius-voll` | statisch | – |
| Kontur-Pille „Termin anfragen“ | Kontur, 52 px hoch | `--radius-voll` | Ruhe, Hover, Fokus, gedrückt | Hover: 12 % helle Überlagerung · gedrückt: 20 % |

**e) Texte**

| Element | Text | Wörter |
|---|---|---|
| Index (Monospace 14 px) | 02 · Ablauf | 2 |
| H2 | Geplant, bevor gebohrt wird. | 4 |
| Intro | Eine Wärmepumpe ist nur so gut wie ihre Planung. So arbeiten wir: | 12 |
| Schritt 1 | **Vor-Ort-Termin** – Wir sehen uns Haus, Heizkörper und den möglichen Aufstellort an. | 2 + 10 |
| Schritt 2 | **Heizlast berechnen** – Raum für Raum statt Schätzwert. Daraus folgen Gerätegröße und Vorlauftemperatur. | 2 + 11 |
| Schritt 3 | **Angebot und Förderung** – Ein verbindliches Angebot; beim Förderantrag unterstützen wir Sie. (Annahme) | 3 + 9 |
| Schritt 4 | **Einbau und Inbetriebnahme** – Montage, Einstellung und Einweisung aus einer Hand. | 3 + 7 |
| Handlungsaufruf | Termin anfragen | 2 |

Gesamt 67 Wörter. Die 40-Wörter-Grenze gilt nur für den ersten Bildschirm.

**f) Signature-Effekte**

| Effekt | Erfüllte Bedingung |
|---|---|
| Technische Mikroschicht (Bemaßung, Monospace, Index) | Der Inhalt ist technikbetont (Planung, Heizlast). Die Schicht ist nicht flächig, liegt nur in der Bühne und nicht unter Fließtext. |
| Zonierter Lichtraum hinter dem Fokusträger | Lichthof = 1,3-fache Gerätebreite. Innerhalb R11: ein Helligkeitszentrum hinter dem Anker, 2 Verlaufszonen. |
| Formreim | Runde Lüfteröffnung als klare Grundform des Motivs, aufgegriffen von Schrittmarken (Kreis) und Pillen. |

**g) Bewegung**
- **Einblendung:** einmalig, Lesestapel und Gerät gemeinsam, Deckkraft 0 → 1 in 400 ms, `cubic-bezier(0.2, 0, 0, 1)`, ohne Versatz. Auslöser: IntersectionObserver bei 15 % Sichtbarkeit. Die Ausgangsdeckkraft 0 setzt erst das Skript, ohne Skript ist alles sofort sichtbar.
- **Kontur-Pille:** Zustände 160 ms, Austritt 120 ms.
- **Kein Dauerträger** in diesem Abschnitt.
- **Fassung „weniger Bewegung“:** alles sofort sichtbar, Zustandswechsel ohne Übergang.

**h) Mobilfassung ab 360 px**
- **Stapel:** wie in c).
- **Zuschnitt:** eigener Gerätezuschnitt mit weniger Aufsicht. Die Maßlinie wird auf 3 Bezeichner gekürzt, bei 360 px auf 2.
- **Entfällt:** der Bezeichner „Abstand zur Grundstücksgrenze“. Lichtraum und Formreim bleiben.
- **Bei 320 px:** Die längsten Wörter („Heizlastberechnung“ kommt hier nicht vor, „Inbetriebnahme“ ≈ 120 px) brechen nicht über den Rand. Silbentrennung per `hyphens: auto` und `lang="de"`.

**i) Ersatzfassungen**

| Fassung | Verhalten |
|---|---|
| ohne JavaScript | keine Einblendung, sonst identisch |
| ohne backdrop-filter | kein Glas, daher unverändert |
| reduzierte Transparenz | Annotationen und Haarlinien als opake Mischfarben |
| erhöhter Kontrast | Text leise wird Kalk, Kreis- und Pillenkonturen werden Kalk 2 px, Annotationen 60 % |
| `forced-colors` | Konturen in `CanvasText` bzw. `ButtonText`, die Mikroschicht wird ausgeblendet (rein dekorativ) |

**j) Kontrastpunkte**

| Text / Element | Ungünstigste Stelle | Wert | Ziel |
|---|---|---|---|
| H2, Kalk | Rand des Lichtraums (Schiefer) | ≥ 12,9 : 1 | 3 : 1 |
| Intro und Schritttext, Text leise | Rand des Lichtraums (Schiefer) | ≥ 6,4 : 1 | 4,5 : 1 |
| Schritttitel und Ziffer, Kalk | Schiefer | ≥ 12,9 : 1 | 4,5 : 1 |
| Index und Bezeichner, Monospace 14 px, Text leise | Zentrum des Lichtraums (Schiefer) | ≥ 6,4 : 1 | 4,5 : 1 (vorsorglich, obwohl `aria-hidden`) |
| Kreis der Schrittmarke (≈ #7D8488) | Schiefer | ≥ 3,8 : 1 | 3 : 1 |
| Kontur-Pille: Rand / Text / Text bei Hover | Nacht | 4,6 : 1 / 15,5 : 1 / 11,2 : 1 | 3 : 1 / 4,5 : 1 / 4,5 : 1 |
| Bemaßungslinien (Hell 30 %) | – | ≈ 2 : 1 | keine Anforderung (rein dekorativ, `aria-hidden`) |

---

### 3.3 Abschnitt 3 – Anfrage („Sprechen wir über Ihr Haus.“)

**a) Zweck und Hauptaktion**
Die Anfrage mit möglichst wenig Aufwand abschließen und dabei ein Gesicht zeigen: einen festen Ansprechpartner statt eines Callcenters. Hauptaktion: Formular absenden, „Beratungstermin anfragen“ (Bernstein-Pille).

**b) Ebeneninventar (hinten → vorn)**

| z | Ebene | Inhalt | Medium |
|---|---|---|---|
| 0 | Grund | Nachtblau, flach | CSS-Farbe |
| 10 | Bühne (Container) | opake Fläche Schiefer, `--radius-gross`, Lichtkante oben 1 px (`--buehne-lichtkante`), keine Schatten | CSS |
| 20 | Motiv | Freisteller-Porträt des Ansprechpartners, halbe Figur, naturweißes Hemd oder hellgraue Arbeitsjacke ohne Logo. Warmes Kantenlicht von links oben an Haar und Schulter. Der Kopf ragt über die obere Bühnenkante (Rahmenbruch). | AVIF/WebP mit Alpha (≤ 140 KB Schreibtisch, ≤ 90 KB Telefon), unterhalb des ersten Bildschirms per `loading="lazy"` |
| 30 | Bedienschicht | Etikett, H2, Text mit Namen des Ansprechpartners, Formular (3 Felder), Primär-Pille, Hinweis mit Datenschutz-Link; nach dem Absenden der Bestätigungstext | Live-Text, natives `<form>` |
| 40 | Navigation | klebende Kopfzeile | HTML |

5 Ebenen. **Verdeckung:** Das Porträt (20) überdeckt die obere Bühnenkante (10). Text, Felder und Pille werden nie überdeckt.

**c) Komposition**

*Telefon*
- **Bühne:** x 19,5–370,5, Polster 12 px.
- **Ordnungslinie:** linke Bühnenkante = Seitenrand x = 19,5. **Zweitlinie:** Bühneninnenkante x = 31,5 (+12 px = 3,1 %); dort fluchten alle Texte und Felder.
- **Stapel:** Anker oben, das Porträt (≈ 300 px hoch). Der Kopf ragt 48 px über die Bühnenkante (5 % der Bühnenhöhe von ≈ 960 px). Das untere Viertel des Porträts läuft in die Bühnenfläche aus.
- **Darunter:** Etikett, H2, Text, Name / Telefon / Postleitzahl, Primär-Pille (Breite nach Inhalt, ≈ 270 px, 4,3 % Fläche), Hinweis.
- **Anker:** Gesicht des Ansprechpartners, Fokusreiz Helligkeit und Wärme des Kantenlichts.
- **Flächen** (Ansicht 390 × 844): frei ≈ 40 % (ruhige Bühnenfläche und Ränder), Fokusträger ≈ 24 %, Text und Felder ≈ 30 %.
- **Maßstabssprung:** Porträt 300 px gegen 11 px ergibt **≈ 27-fach**.

*Schreibtisch*
- **Bühne:** x 64–1216, Höhe ≈ 690 px, Polster 38 px.
- **Ordnungslinie:** linke Bühnenkante x = 64 (dieselbe Linie wie im ersten Bildschirm). **Zweitlinie:** x = 102 (+38 px = 3 %) für den ganzen Lesestapel und das Formular (Spalten 1–6, Lesebreite 30rem).
- **Porträt:** Spalten 8–11 (x ≈ 760–1120), 746 px hoch. Die Unterkante liegt auf der geraden Bühnenunterkante, nicht im Radius (Anschnitt). Der Kopf ragt 56 px über die Oberkante (8,1 %).
- **Anker:** Gesicht. Zweiter Gewichtspol: die Primär-Pille, klein (1,4 % Fläche), ohne die Helligkeitsdominanz des Ankers.
- **Flächen** (Ansicht 1280 × 800): frei ≈ 45 %, Fokusträger ≈ 29 %, Text und Felder ≈ 20 %.
- **Maßstabssprung:** Porträt 746 px gegen 11,9 px ergibt **≈ 63-fach**, Gesicht allein ≈ 9-fach. H2 52 px. 3 Größenstufen.

**d) Bausteine**

| Baustein | Form | Radius-Token | Zustände | Kanal |
|---|---|---|---|---|
| Bühne | opake Fläche, Lichtkante oben | `--radius-gross` (28 / 20 px) | statisch | – |
| Label | Text 14 px, Kalk, halbfett, oberhalb des Felds. Pflichtfelder mit dem Wort „Pflichtfeld“ (nicht nur Sternchen). | – | – | – |
| Feld (Name `autocomplete="name"`; Telefon `type="tel"`, `autocomplete="tel"`; Postleitzahl `inputmode="numeric"`, `autocomplete="postal-code"`, `pattern="[0-9]{5}"`) | Pille 52 px, Füllung Nacht, Kontur 1 px | `--radius-voll` | Ruhe, Hover, Fokus, Fehler, ausgefüllt | Hover: Kontur-Deckkraft 45 → 70 % · Fokus: Ring 2 px · Fehler: Kontur 2 px, Symbol „!“ im Kreis und Fehlertext (keine zweite Akzentfarbe) |
| Primär-Pille „Beratungstermin anfragen“ (`type="submit"`) | gefüllt Bernstein, 52 px | `--radius-voll` | Ruhe, Hover, Fokus, gedrückt, sendet | Hover: Überlagerung 12 % · sendet: Beschriftung „Wird gesendet …“, `aria-busy`, keine Form- oder Größenänderung, kein Spinner |
| Bestätigung | ersetzt das Formular als Text in einer `role="status"`-Region, ohne eigene Innenfläche | – | – | Fokus springt auf die Bestätigung |
| Datenschutz-Link | Textlink | `--radius-voll` (Fokusring) | Ruhe, Hover, Fokus | Deckkraft der Unterstreichung |

**e) Texte**

| Element | Text | Wörter |
|---|---|---|
| Etikett (Versal 14 px) | BERATUNG | 1 |
| H2 | Sprechen wir über Ihr Haus. | 5 |
| Text | Ihr Ansprechpartner ist [Vorname Nachname], Meister für Heizungstechnik. Er meldet sich innerhalb eines Werktags und vereinbart einen Termin vor Ort. (Platzhalter, Annahme) | 21 |
| Labels | Name · Telefon · Postleitzahl | 3 |
| Primär | Beratungstermin anfragen | 2 |
| Hinweis (14 px) | Kostenlos und unverbindlich. Wir nutzen Ihre Angaben nur für diese Anfrage. Datenschutz | 12 |
| Fehlertext (Beispiel) | Bitte geben Sie eine Telefonnummer an, unter der wir Sie erreichen. | 12 |
| Bestätigung | Danke! Wir rufen Sie innerhalb eines Werktags an. | 8 |

Alternativtext Porträt: „[Vorname Nachname], Meister für Heizungstechnik.“

**f) Signature-Effekte**

| Effekt | Erfüllte Bedingung |
|---|---|
| Rahmenbruch | Genau ein Objekt (das Porträt) ragt über genau eine Containerkante (oben): 8,1 % der Bühnenhöhe auf dem Schreibtisch, 5 % auf dem Telefon, also ≤ 10 %. Alle Bedienelemente bleiben im Rahmen. |
| Gerichteter Auslauf statt Bildkante (nur Telefon) | Freisteller auf gleichem Grund (Bühnenfläche), Auslauf über das untere Viertel des Porträts |

**g) Bewegung**
- **Einblendung:** einmalig, 400 ms Deckkraft (wie Abschnitt 2).
- **Formularzustände:** 160 ms, Austritt 120 ms (nur Kontur-Deckkraft bzw. Überlagerung).
- **Bestätigung:** Überblendung 200 ms über Deckkraft.
- **Kein Dauerträger.**
- **Fassung „weniger Bewegung“:** sofort sichtbar, Bestätigung als Schnitt.

**h) Mobilfassung ab 360 px**
- **Stapel:** wie in c). Das Porträt liegt oben, damit der Anker oben steht.
- **Zuschnitt:** eigener engerer Brustbild-Zuschnitt.
- **Entfällt:** nichts. Die Zeilenlänge im Bühneninneren liegt bei ≈ 42 Zeichen (siehe Unklarheiten).
- **200 % Text:** Felder wachsen in der Höhe (`min-height`), die Labels bleiben oberhalb der Felder.
- **Bei 320 px:** Feldbreite 100 % der Bühne, kein horizontales Scrollen.

**i) Ersatzfassungen**

| Fassung | Verhalten |
|---|---|
| ohne JavaScript | Normaler POST an `/anfrage`, dann Bestätigungsseite. Native Prüfung (`required`, `pattern`) mit eigenen `title`-Hinweisen, keine Einblendung. |
| ohne backdrop-filter | kein Glas, daher unverändert |
| reduzierte Transparenz | Lichtkante als opake Mischfarbe |
| erhöhter Kontrast | Feldkonturen werden Kalk 2 px, Hinweistext Kalk, Fokus 3 px |
| `forced-colors` | Felder `1px solid FieldText`, Primär-Pille `ButtonText`-Kontur, Bühne erhält Kontur `CanvasText` |

**j) Kontrastpunkte**

| Text / Element | Ungünstigste Stelle | Wert | Ziel |
|---|---|---|---|
| H2, Labels, Fehlertext, Kalk | Bühne Schiefer | 12,9 : 1 | 4,5 : 1 |
| Text und Hinweis, Text leise | Bühne Schiefer | 6,4 : 1 | 4,5 : 1 |
| Feldeingabe, Kalk | Feldgrund Nacht | 15,5 : 1 | 4,5 : 1 |
| Feldkontur gegen Bühne / gegen Feldgrund | – | 3,8 : 1 / 4,6 : 1 | 3 : 1 |
| Primär-Pille: Text / gegen Bühne | – | 8,3 : 1 / 6,9 : 1 | 4,5 : 1 / 3 : 1 |
| Fokusring, Kalk | Bühne Schiefer | 12,9 : 1 | 3 : 1 |
| Datenschutz-Link, Text leise, unterstrichen | Bühne Schiefer | 6,4 : 1 | 4,5 : 1 |

---

## 4. Code

Nicht angefordert. Teil 9, Punkt 4 sieht Code nur „auf Wunsch“ vor, daher entfällt er.
Vorgesehener Umfang, falls gewünscht:
- semantisches HTML: `header` › `nav`, `main` › `section#start` (h1), `section#ablauf` (h2), `section#anfrage` (h2, `form`)
- CSS mit den Tokens aus Kapitel 2
- JavaScript ≈ 3 KB: Video-Start und Bewegungs-Schalter, IntersectionObserver für Kopfzeile und Einblendung, Formular-Absenden per fetch mit Rückfall auf POST

---

## 5. Prüfprotokoll (Teil 10)

| Nr. | Prüfpunkt | Erfüllt | Nachweis |
|---|---|---|---|
| 1 | Ein dominanter Fleck bei Weichzeichnung in Graustufen, und es ist der Anker | ja | Erster Bildschirm: Das Fenster (L ≈ 0,6–0,8; 230 × 300 bzw. 150 × 170 px) ist der einzige helle Großfleck. Die Primär-Pille ist auf Inhaltsbreite begrenzt (270 px, L 0,45), damit sie auf dem Telefon nicht mit dem Fenster konkurriert. Abschnitt 2: das beleuchtete hellgraue Gerät. Abschnitt 3: Gesicht und helle Kleidung gegen die dunkle Bühne. |
| 2 | Ordnungslinie, an der Text und Bedienung fluchten | ja | x = 64 px (Schreibtisch) bzw. 19,5 px (Telefon) in allen Ansichten. Je höchstens eine Zweitlinie: Abschnitt 2 Schritttexte +48 px (3,75 %), Abschnitt 3 Bühneninnenkante +38 px (3 %) bzw. +12 px (3,1 %). |
| 3 | 3–6 Ebenen, Tiefe über Verdeckung oder Bildoptik, ohne tragenden Schatten | ja | 5 Ebenen je Ansicht. Verdeckungen: Vordergrund über Hausfuß und Gerät, Gerät über Maßlinie, Porträt über Bühnenkante. Bildoptik: Dunst und Unschärfe im Vordergrund. Kein Schatten. |
| 4 | Bedienschicht frontal, flach, ohne Material, Glow und Elevation; eine Formfamilie, ≤ 4 Radien | ja | Vollrundung mit 2 Radienwerten (`voll`, `gross`). Opake, flache Flächen. Zustände nur über Deckkraft und Füllung. Keine Transformation. |
| 5 | Maßstabssprung bei jeder Breite ≥ 3-fach, ≤ 3 Größenstufen, ≥ 33 % frei | ja | Erster Bildschirm 15- bzw. 25-fach, Abschnitt 2 21- bzw. 37-fach, Abschnitt 3 27- bzw. 63-fach. 3 Größenstufen. Frei: 44 / 52 %, 46 / 48 %, 40 / 45 %. |
| 6 | Bild bildet den Raum, ohne Saum und Textkasten; Grund mit ≤ 1 Helligkeitszentrum | ja | Szene vollflächig, Textzone frei, Scrim kantenlos. Unterer Bildrand läuft in den Grund aus (kein Grundsprung). Freisteller mit Alpha-Kante 1–2 px ohne Farbsaum. Ein Helligkeitszentrum je Ansicht (Fenster bzw. Lichtraum bzw. keines). |
| 7 | Ein Ausdrucksträger dominiert, Einmal-Grenzen eingehalten, Effektbedingungen erfüllt | ja | Licht dominiert, Bildoptik und Mikroschicht liegen darunter. Je Ansicht: 1 Anker, 1 Fokusträger, 0 Formbruch, ≤ 1 Rahmenbruch (Abschnitt 3), 1 Lichtkern, ≤ 1 Helligkeitszentrum, 0 Schein, ≤ 1 bewegter Träger (erster Bildschirm), 0 Schattenstufen. Bedingungen siehe jeweils f). |
| 8 | Kontrast an der ungünstigsten Stelle, Fokus sichtbar und unverdeckt, Ziele ≥ 24 px, Tab-Reihenfolge gleich Lesefolge | ja | Alle Werte siehe j), der kleinste ist 4,6 : 1 für Text (Rückfall ohne Scrim) bzw. 3,4 : 1 für Konturen. Fokusring 2 px folgt der Form und liegt in z 30/40 über allem. Ziele 44–52 px. DOM-Reihenfolge: Kopfzeile, H1, Subline, Pille, Anruf, Vertrauenszeile, Bewegungs-Schalter, Abschnitt 2, Abschnitt 3. |
| 9 | Eigene Komposition ab 360 px, kein horizontales Scrollen bei 320 px, kein Verlust bei 200 % Text | ja | Eigene Zuschnitte und Stapel je Ansicht. Breitestes Element bei 320 px: Pille 270 px < 288 px. `min-height` statt `height`, Schriftgrade mit rem-Anteil. |
| 10 | Ohne JavaScript und mit reduzierter Bewegung vollständiges Standbild | ja | Das Poster entspricht dem Endzustand. Ohne Skript gibt es keine Ausgangsdeckkraft 0. Menü per Popover-Attribut, Formular per POST. |
| 11 | Leistungsbudgets eingehalten, leichtestes Verfahren | ja | Bis zum LCP: Telefon ≈ 268 KB (HTML 12, kritisches CSS 14, zwei Schriften 52, Poster ≤ 190), Schreibtisch ≈ 338 KB (Poster ≤ 260). Gerätefreisteller im Anschnitt mit `fetchpriority="low"`, 60 KB, ≈ 328 KB. LCP-Element ist das Poster-`<img>` mit `fetchpriority="high"` und festen Abmessungen. JS ≈ 3 KB. Video Telefon ≤ 1,2 MB, erst nach `load`. Kein 3D. CLS über feste Bildmaße und Metrik-Anpassung der Ersatzschriften. |
| 12 | Nichts nachgebaut | ja | Eigenes Motivkonzept (kaltes Haus, warmes Fenster). Gerät und Kleidung herstellerneutral, keine bekannte Website, Marke oder Motivkomposition als Vorlage. |

---

## Unklarheiten im Prompt

1. **Technikstufe.** Der Prompt kennt nur 0 / 1 / 2, der Auftrag nennt „Premium mit Ersatzfassung“. Ich habe Stufe 1 angenommen. „Ersatzfassung“ ist im Prompt als Stufenbegriff nicht definiert, er kommt nur als Ausgabepunkt 3 i) vor.
2. **Gerätereihenfolge.** Der Auftrag verlangt „zuerst Telefon“. Das Ausgabeformat führt die Mobilfassung erst als Punkt h) nach der (implizit desktopbezogenen) Komposition. Ich habe in c) Telefon vor Schreibtisch gestellt und h) für die 360-px-Details genutzt. Die Reihenfolge der Punkte passt nicht zu einem Mobile-first-Auftrag.
3. **R7 Maßstabssprung.** „Desktop etwa 5–12-fach“ verträgt sich nicht mit den eigenen Parametern:
   - Ein Fokusträger-Objekt mit 15–35 % Fläche ist bei 800 px Höhe 300–700 px hoch, das ergibt 25–60-fach.
   - Eine Kulissenschrift mit Versalhöhe 15–33 % der Bühnenhöhe ergibt 10–22-fach.

   Offen ist, ob 12 eine Obergrenze ist. Offen ist auch, was bei einer Szene als „Hauptelement“ gemessen wird: die ganze Szene oder der Anker. Ich habe die Höhe des Ankers gemessen und 5–12 als groben Richtwert, nicht als Obergrenze gelesen.
4. **„2–3 Größenstufen je Ansicht“.** Unklar ist, ob das Motiv als Größenstufe zählt und ob 14 px und 17 px zwei Stufen sind. Die Spreizungsregel ≤ 1,25 spricht für eine gemeinsame Stufe. Ich habe Motiv, Headline und Textgruppe als 3 Stufen gezählt.
5. **Akzentrolle gegen Fokusreiz.** Teil 4 verlangt den Akzent auf der Hauptaktion. R3 und Teil 6 verbieten einen zweiten Gewichtspol, der den Fokusreiz teilt, bzw. einen „zweiten Akzentreiz neben dem Anker“. Bei warmem Anker (Fensterlicht) und warmem Akzent (Bernstein) teilen beide den Reiz „Wärme“. Ich habe den Konflikt über Größe und Helligkeit gelöst (Pille klein, Graustufentest). Der Prompt sagt nicht, ob der Akzent der Hauptaktion von dieser Regel ausgenommen ist.
6. **Rollenliste Teil 8.** Grund, Text, Hell, Tief und ein Akzent reichen nicht für Sekundärtext, Feldkonturen, Containerflächen und Fehlerzustände. Ich habe Stufen per `color-mix` aus den vorhandenen Rollen abgeleitet. Ob das erlaubt ist, bleibt offen. Fehlerzustände dürfen wegen „keine zweite Akzentfarbe für Zustände“ kein Rot nutzen. Das ist vertretbar, wird aber nirgends ausdrücklich gesagt.
7. **Ebenenzählung.** Die z-Skala (0/10/20/25/30/40) hat keinen Platz für den Scrim. Als eigene Ebene gezählt käme der erste Bildschirm mit Kulisse auf 7 Ebenen, also über 6. Unklar ist außerdem, ob ein vollständig verdeckter Grund und ob Navigation bzw. Overlays als Ebenen zählen. Ich habe den Scrim der Motivebene zugeschlagen.
8. **Zweitlinie 2–4 % der Breite auf dem Telefon.** Bei 390 px sind das 8–16 px, weniger als der Mindest-Seitenrand von 16 px. Container-Innenabstände werden dadurch sehr knapp (12 px). Vermutlich ist die Regel nur für Desktop gedacht.
9. **Zeilenlänge 45–75 Zeichen gegen „Lesezone mobil volle Breite“.** Bei 360 px und 16 px Fließtext sind höchstens etwa 42 Zeichen möglich, in einem Container noch weniger. Die Regeln widersprechen sich auf kleinen Telefonen.
10. **Seitenrand.** `clamp(1rem, 5vw, 6rem)` ergibt bei 390 px 19,5 px, also kein Raster-Vielfaches von 4 px. Das kollidiert leicht mit „Basis 4 px“.
11. **Leistungsbudget.** „Bis zum LCP ≤ 350 KB“ ist als mobiler Wert markiert. Gleichzeitig ist ein Desktop-Fokus-Asset bis 400 KB erlaubt, das allein schon über 350 KB liegt. Unklar ist, ob die 350 KB auch für Desktop gelten. Ich habe sie auf beide angewendet und das Desktop-Poster auf 260 KB begrenzt. Ebenso offen: Gilt „Fokus-Asset nie verzögert geladen“ auch für Fokusträger unterhalb des ersten Bildschirms (hier das Porträt, `lazy`)?
12. **Fortsetzungssignal (8–25 %) gegen „Hauptaktion ohne Scrollen sichtbar“.** Auf Telefonen mit Browserleisten (nutzbare Höhe ≈ 664 px) schrumpft der Anschnitt unter 8 %. Der Prompt sagt nicht, welche Viewporthöhe gilt (nominal 844 px, `svh` oder `lvh`).
13. **Kopfzeile ≤ 8 % der Viewporthöhe.** Mit 44-px-Zielen geht das im Hochformat. Im Querformat auf Telefonen (≈ 390 px Höhe) ist es unerfüllbar, eine Regel dafür fehlt.
14. **Navigation und Ordnungslinie.** Rechtsbündige Nav-Links fluchten nicht auf der linken Ordnungslinie. Der Prompt sagt nicht, ob die rechte Rasterkante als zulässige Kante gilt oder ob die Navigation ausgenommen ist.
15. **Zählung der Handlungsaufrufe und Wörter.** Unklar ist, ob Telefonnummer oder Handlungsaufruf in der Navigation, der vorgeschriebene Pause-Schalter (Selbstlauf über 5 s) und die Wörter im angeschnittenen Folgeabschnitt unter „1 primärer und höchstens 1 sekundärer Handlungsaufruf“ bzw. „≤ 40 Wörter“ fallen.
16. **„Textfläche ohne Kulisse ≤ 15 %“.** Es ist nicht festgelegt, ob Zeilenboxen oder der Umriss des Textblocks gemessen werden. Hier ergibt das 11 % bzw. 17 %.
17. **Negativraum.** R8 bezieht sich nur auf den ersten Bildschirm, Teil 10 Nr. 5 verlangt die Prüfung „jeder Ansicht“. Bei langen Abschnitten (Formular) bleibt offen, was eine „Ansicht“ ist. Ich habe einen Viewport-Ausschnitt beim Erreichen des Abschnitts angenommen.
18. **Szene 60–100 % gegen mobilen Stapel „Anker oben, Lesestapel darunter“.** Liegt der Text unter dem Bild, deckt die Szene mobil nur etwa 45 % ab. Gelöst habe ich das mit einer hohen Szene, deren dunkler unterer Teil die Textzone bildet. Der Prompt klärt das nicht.
19. **Scrim „35–50 % der Bildbreite“.** Das ist nur für seitliche Textzonen formuliert. Für den mobilen Text unter dem Anker braucht es einen senkrechten Scrim, für den keine Werte angegeben sind.
20. **Variante B gegen Signature-Effekt Vordergrund.** „Kamera-Szenen bleiben formstarr und unschärfearm“ steht gegen „Dunst und rahmender Vordergrund nur in Kamera-Szenen“. Unklar ist, wie viel Unschärfe im Vordergrund erlaubt ist.
21. **Kleintext der technischen Mikroschicht.** Teil 7 nimmt nur rein dekorative Kulissenschrift von den Kontrastwerten aus. Ob kleine Annotationen als dekorativ gelten, bleibt offen. Ich habe vorsorglich 4,5 : 1 eingehalten.
22. **„Glas ist erlaubt (Teil 2)“.** R9 verweist auf Teil 2, die Glasregeln stehen aber in Teil 3 und Teil 4. Außerdem steht „Text ohne deckende Box“ (R4) gegen die Rückfälle bei reduzierter Transparenz bzw. ohne `backdrop-filter`, die faktisch deckend werden. Teil 7 löst das per Vorrang, aber eine konkrete Gestaltung des Rückfalls fehlt.
23. **„Folgeabschnitte einmalig 300–500 ms über Deckkraft“.** „Einmalig“ braucht JavaScript, weil CSS-Scroll-Timelines umkehrbar sind. Eine Kurve für Einblendungen ist nicht angegeben, nur für UI-Zustände und Szenenwechsel.
24. **Parallax-Faktor 0,8–1,0.** Damit kann sich nur die hintere Ebene langsamer bewegen, der Vordergrund nie schneller. Ob „Bildebenen“ auch die Vordergrundebene (z 25) einschließt, ist offen.
25. **Farbpalette „frei wählbar“.** Teil 8 sagt „{FARBPALETTE} nur Rollen zuweisen“, setzt also gegebene Werte voraus. Dass die KI ohne Palette eigene Werte vorschlägt, steht nur in den Anpassungshinweisen außerhalb des Codeblocks, also außerhalb des eigentlichen Prompts. Gedeckt ist das nur über die allgemeine Annahme-Regel.

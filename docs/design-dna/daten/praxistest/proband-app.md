# Bibliotheks-App: Hauptbildschirm und Detailansicht

Angewendet: Universeller Design-Prompt (docs/design-dna/06-design-prompt.md), Ausgabeformat nach Teil 9.

---

## 1. Kurzbegründung

### Projektangaben (ausgefüllt)

| Angabe | Wert | Herkunft |
|---|---|---|
| Marke | Arbeitsname „Stadtbibliothek“, Wortmarke als reiner Text, keine reale Bibliothek nachgebildet | Annahme |
| Ziel und Hauptaktion | Schnell finden und verlängern. Start: Hauptaktion „Verlängern“ (dringendste Ausleihe), Suche als ständig sichtbares Eingabefeld. Detail: „Vormerken“, bei eigener Ausleihe „Verlängern“ | Ziel aus dem Auftrag, Hauptaktionen Annahme |
| Zielgruppe | Mitglieder von 12 bis über 80, viele Gelegenheitsnutzer, ein Teil mit vergrößerter Systemschrift | Annahme |
| Inhalte und Bildschirme | Start (Suche, nächste Rückgabe, Abholbereit, Ausleihen, Vormerkungen), Suchzustand mit Treffern, Titeldetail mit Vormerk-Dialog. Konto, Ausweis und Gebühren hinter dem Kontoknopf (nicht ausgestaltet) | Auftrag plus Annahme |
| Bildmaterial | Buchcover aus dem Katalogdienst: Fremdbilder, rechteckig, Farben unkontrolliert. Fehlt ein Cover, gibt es ein typografisches Ersatzcover (Titel in der Headline-Schrift auf Kulissenton) | Annahme |
| Farbpalette | frei, gewählt: Papier, Tinte, ein Waldgrün als einzige Akzentrolle | Auftrag (frei), Werte gewählt |
| Schriften | Source Serif 4 (nur Schnitt 600, Latin-Subset, etwa 30 KB) für Headlines; Systemschrift für Text und Bedienung; System-Monospace mit fester Rolle „Bezeichner“ (Signatur, Mediennummer) | Annahme |
| Geräte und Breiten | Telefon 390 × 844, Hochformat; ausgestaltet für 390 und 360, abgesichert bis 320 | Auftrag plus Annahme |
| Technikstufe | „leicht“ entspricht Stufe 0 (HTML, CSS, Bild). JavaScript nur für Funktionen (Vorschläge, Verlängern ohne Neuladen, Dialog), höchstens 15 KB; alles funktioniert auch über Formulare | Auftrag, Zuordnung Annahme |
| Stilvariante | nicht angegeben, gewählt: C | Annahme |
| Plattform | Web-App (PWA), serverseitig gerendert | Annahme |
| Grundton | nur hell in dieser Runde; eine dunkle Fassung kommt später (Figur-Grund dann über Lichtkante, der Begleitschatten entfällt) | Annahme |
| Beispieldaten | fiktive Titel („Das Jahr der Kraniche“, Lea Brandt) | – |

### Stilvariante: C, flache Lösung

Der Fokusträger ist zwangsläufig ein Buchcover: ein flaches Fremdbild ohne Körper, das bei jedem Titel anders aussieht. Variante B (plastischer Körper im Licht) bräuchte für jeden Titel einen eigenen Render. Variante A (Riesenwort) braucht ein plastisches Gegenüber und nimmt auf 390 px die Fläche weg, die Suche und Verlängern brauchen. C erzeugt Tiefe aus flacher Überlappung, kostet keine zusätzlichen Assets und passt zu Stufe 0.

### Ausdrucksträger: Kulissen

Das **Regalband** ist ein flaches, blasses Querband über die volle Breite. Jedes Anker-Cover steht davor und kreuzt es senkrecht, steht also oben und unten über. Auf dem Startbildschirm kommt die **Staffel der eigenen Ausleihen** hinzu: Vorn steht das Cover der nächsten Rückgabe, dahinter stehen die übrigen Ausleihen entsättigt auf derselben Grundlinie. Das Regalband ist die wiederkehrende Produktsignatur in allen Ansichten. Alle übrigen Mittel bleiben eine Stufe darunter: Die Schrift ist ein konventionelles Etikett, Licht erscheint nur als blasser Lichtraum, Material gibt es nicht.

### Gewählte Stellschrauben (Teil 2)

- **Ordnungsfigur:** Achsenkreuz. Ein senkrechtes Objekt (das Cover) kreuzt ein waagerechtes Objektband (das Regalband). Die primäre Ordnungslinie ist die linke Kante bei `--rand` (19,5 px bei 390 px). Es gibt keine Zweitlinie.
- **Tiefenmittel:** einseitige Verdeckung. Das Cover verdeckt das Regalband; auf dem Startbildschirm verdeckt das vordere Cover zusätzlich die Nebencover.
- **Fokusträger:** freigestelltes Objekt (Cover). Anteil: Start 19 % (Staffel), Detail 18 %, Treffer 7,5 % (bewusste Abweichung, siehe 3.2).
- **Material:** keines.
- **Licht:** gezeichnet. Ein Lichtraum hinter dem Anker; Lichtrichtung von oben links, sie gilt nur für den Begleitschatten.
- **UI-Flächen:** opak und flach. Rang über Füllung gegen Kontur. Hover und Gedrückt über die Deckkraft einer Tinte-Überlage (8 % bzw. 12 %). Aktiv über Akzent-Tönung (Füllung 12 %) mit Akzentkontur und Symbolwechsel.
- **Formfamilie:** Vollrundung (Pillen, Kreise), Panels mit großem Radius 20 px, Innenflächen 8 px; Cover mit 2 px als Buchkante.
- **Schrift:** Etikett unter dem Motiv; 2 Familien, dazu Monospace mit fester Rolle.
- **Grundton:** hell (Papier). Figur und Grund trennen sich über einen 1-px-Kantensaum und einen blassen Begleitschatten am Anker.
- **Fortsetzungssignal:** angeschnittene Folgesektion (Start 16 %, Detail 8,6 %, Treffer: angeschnittene dritte Zeile).
- **Verankerung:** Überdeckung (das Cover steht vor dem Band und ragt unten heraus) und auf dem Startbildschirm die gemeinsame Grundlinie der Staffel.

---

## 2. Tokens

```css
/* ===== Schicht 1: Marke – die einzige Stelle mit Rohwerten ===== */
:root {
  --marke-papier:        #F4F1EA;
  --marke-papier-licht:  #FBF9F4;
  --marke-papier-tief:   #EAE4D8;
  --marke-tinte:         #1F1D1A;
  --marke-tinte-mittel:  #5B574F;
  --marke-tinte-kontur:  #8A8478;
  --marke-haarlinie:     #D6CFC1;
  --marke-schattenton:   #3A3020;
  --marke-waldgruen:     #136F5B;
  --marke-weiss:         #FFFFFF;
  --marke-serif: "Source Serif 4", "Iowan Old Style", Georgia, serif;
  --marke-sans:  system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --marke-mono:  ui-monospace, "SF Mono", "Roboto Mono", Menlo, monospace;
}

/* ===== Schicht 2: Rollen und Basiswerte ===== */
:root {
  /* Farbrollen */
  --grund:          var(--marke-papier);
  --grund-zentrum:  var(--marke-papier-licht);   /* Zentrum des Lichtraums */
  --kulisse:        var(--marke-papier-tief);    /* Regalband */
  --text:           var(--marke-tinte);
  --text-leise:     var(--marke-tinte-mittel);
  --kontur:         var(--marke-tinte-kontur);   /* Grenzen von Bedienelementen, ≥ 3:1 */
  --kante:          var(--marke-haarlinie);      /* dekorative Haarlinie, Figur-Grund */
  --hell:           var(--marke-weiss);          /* Feld- und Panelfläche */
  --tief:           var(--marke-schattenton);    /* Schattenton */
  --akzent:         var(--marke-waldgruen);      /* einzige Akzentrolle */
  --auf-akzent:     var(--marke-weiss);
  --akzent-toenung: color-mix(in srgb, var(--marke-waldgruen) 12%, var(--marke-papier));
  --fokus:          var(--marke-tinte);
  --ueberlage-hover:     color-mix(in srgb, var(--marke-tinte) 8%, transparent);
  --ueberlage-gedrueckt: color-mix(in srgb, var(--marke-tinte) 12%, transparent);
  --abdunklung:          color-mix(in srgb, var(--marke-tinte) 40%, transparent);

  /* Schrift */
  --schrift-headline: var(--marke-serif);
  --schrift-ui:       var(--marke-sans);
  --schrift-kennung:  var(--marke-mono);          /* nur Signatur, Mediennummer */
  --grad-text:     1rem;                          /* 16 px, zugleich Bedienschrift */
  --grad-label:    0.875rem;                      /* 14 px, Versal */
  --grad-headline: clamp(2.25rem, 1.5rem + 3vw, 4.5rem);  /* mobil 36 px */
  --zeile-text:      1.5;
  --zeile-headline:  1.1;
  --laufweite-label: 0.08em;
  --gewicht-normal:  400;
  --gewicht-betont:  600;

  /* Abstand, Basis 4 px; Gruppe : Gruppen : Zonen = 1 : 3 : 6 */
  --a-1: 4px;  --a-2: 8px;  --a-3: 12px; --a-4: 16px; --a-5: 24px;
  --a-6: 32px; --a-7: 48px; --a-8: 64px; --a-9: 96px; --a-10: 128px;
  --abstand-gruppe:  var(--a-2);
  --abstand-gruppen: var(--a-5);
  --abstand-zonen:   var(--a-7);
  --rand: clamp(1rem, 5vw, 6rem);

  /* Form: Vollrundung, genau 4 Radienwerte */
  --radius-voll:   9999px;
  --radius-gross:  20px;
  --radius-klein:  8px;
  --radius-objekt: 2px;
  --haarlinie:     1px;
  --ziel-min:      44px;

  /* Ebenen */
  --z-grund: 0; --z-kulisse: 10; --z-nebenkoerper: 15;
  --z-motiv: 20; --z-bedien: 30; --z-nav: 40;

  /* Licht von oben links */
  --licht-x: -0.5;
  --licht-y: -1;

  /* Bewegung */
  --dauer-zustand:   160ms;
  --dauer-austritt:  120ms;
  --dauer-panel:     240ms;
  --dauer-panel-aus: 180ms;
  --dauer-szene:     500ms;
  --kurve-ein:   cubic-bezier(0.2, 0, 0, 1);
  --kurve-aus:   cubic-bezier(0.4, 0, 1, 1);
  --kurve-szene: cubic-bezier(0.65, 0, 0.35, 1);
}

/* ===== Schicht 3: Komponenten – lesen nur Rollen-Tokens ===== */
:root {
  --kopf-hoehe: 64px;
  --kopf-grund: var(--grund);
  --kopf-kante-angeheftet: var(--kante);

  --suche-hoehe:       52px;
  --suche-grund:       var(--hell);
  --suche-kontur:      var(--kontur);
  --suche-text:        var(--text);
  --suche-platzhalter: var(--text-leise);
  --suche-radius:      var(--radius-voll);

  --knopf-hoehe:            52px;
  --knopf-klein-hoehe:      var(--ziel-min);
  --knopf-radius:           var(--radius-voll);
  --knopf-primaer-grund:    var(--akzent);
  --knopf-primaer-text:     var(--auf-akzent);
  --knopf-sekundaer-kontur: var(--kontur);
  --knopf-sekundaer-text:   var(--text);
  --knopf-aktiv-grund:      var(--akzent-toenung);
  --knopf-aktiv-kontur:     var(--akzent);
  --knopf-hover:            var(--ueberlage-hover);
  --knopf-gedrueckt:        var(--ueberlage-gedrueckt);
  --kreisknopf-groesse:     var(--ziel-min);

  --cover-radius:          var(--radius-objekt);
  --cover-kante:           var(--kante);
  --cover-anker-start:     234px;   /* Höhe; Breite folgt dem Seitenverhältnis */
  --cover-anker-detail:    300px;
  --cover-anker-treffer:   192px;
  --cover-neben:           168px;
  --cover-thumb:           60px;
  --cover-neben-filter:    grayscale(1) contrast(0.55) brightness(1.2);
  --schatten-versatz:      24px;    /* je Ansicht 10 % der Ankerhöhe: 24 / 30 / 19 */
  --cover-begleitschatten:
    calc(var(--licht-x) * -1 * var(--schatten-versatz))
    calc(var(--licht-y) * -1 * var(--schatten-versatz))
    calc(2.5 * var(--schatten-versatz))
    calc(-0.25 * var(--schatten-versatz))
    color-mix(in srgb, var(--tief) 4%, transparent);

  --regal-grund: var(--kulisse);
  --regal-hoehe: 88px;
  --lichtraum-zentrum: var(--grund-zentrum);
  --lichtraum-rand:    var(--grund);
  /* je Ansicht: --lichtraum-rx, --lichtraum-ry, --lichtraum-x, --lichtraum-y */

  --zeile-trenner: var(--kante);
  --zeile-hover:   var(--ueberlage-hover);
  --zeile-radius:  var(--radius-klein);
  --zeile-meta:    var(--text-leise);

  --panel-grund:      var(--hell);
  --panel-radius:     var(--radius-gross);
  --panel-abdunklung: var(--abdunklung);

  --fokus-breite:  2px;
  --fokus-abstand: 2px;
  --fokus-farbe:   var(--fokus);
}

/* ===== Ersatzfassungen auf Rollenebene ===== */
@media (prefers-contrast: more) {
  :root {
    --text-leise: var(--marke-tinte);
    --kante:      var(--marke-tinte-kontur);
    --kontur:     var(--marke-tinte);
    --fokus-breite: 3px;
  }
}
@media (prefers-reduced-transparency: reduce) {
  :root { --abdunklung: color-mix(in srgb, var(--marke-tinte) 85%, var(--marke-papier)); }
}
@media (forced-colors: active) {
  :root { --kante: CanvasText; --kontur: ButtonText; --fokus: Highlight; }
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --dauer-zustand: 0ms; --dauer-austritt: 0ms;
    --dauer-panel: 0ms;   --dauer-panel-aus: 0ms;
    --dauer-szene: 150ms; /* nur noch Überblendung, keine Bewegung */
  }
}
```

---

## 3. Bildschirme

Bezugsgröße: 390 × 844 CSS-px, Sicherheitszonen 47 px oben (Statusleiste) und 34 px unten (Home-Indikator). Ordnungslinie bei x = 20 (gerundet aus 19,5).

### 3.1 Hauptbildschirm „Start“, Ruhezustand

**a) Zweck und Hauptaktion**
Auf einen Blick sehen, was als Nächstes zurückgegeben werden muss, und es mit einem Tipp verlängern; jederzeit suchen können.
Hauptaktion: „Verlängern“ für die dringendste Ausleihe. Sekundär: „Alle 3 verlängern“. Die Suche ist ein Eingabefeld und kein Handlungsaufruf.

**b) Ebeneninventar (von hinten nach vorn)**

| Nr. | z | Ebene | Inhalt | Medium |
|---|---|---|---|---|
| 1 | 0 | Grund | Papierton mit Lichtraum: Ellipse rx 180 / ry 150 um (98 \| 344), 2 Verlaufszonen | CSS |
| 2 | 10 | Kulisse | Regalband, volle Breite, 88 px hoch, y 349–437 | CSS-Fläche, aria-hidden |
| 3 | 15 | Nebenkörper | 2 hintere Cover (2. und 3. Ausleihe), 112 × 168, x 136–248 und 224–336, gemeinsame Grundlinie y 461, entsättigt | Bild (AVIF), CSS-Filter, aria-hidden, pointer-events: none |
| 4 | 20 | Motiv | Ankercover der nächsten Rückgabe, 156 × 234, x 20–176, y 227–461, Kante 1 px, Begleitschatten | Bild (AVIF/WebP), als Link |
| 5 | 30 | Bedienschicht | Label, Headline, Subline, 2 Knöpfe, Folgesektion (Abholbereit, Ausleihen, Vormerkungen) | HTML-Text |
| 6 | 40 | Navigation | Kopfzeile (Wortmarke, Kontoknopf), Suchfeld (beim Scrollen als 68-px-Leiste angeheftet), Vorschlagspanel | HTML |

Sichtbare Verdeckung: Das Ankercover verdeckt das Regalband und 40 px des zweiten Covers. Das zweite Cover verdeckt 24 px des dritten Covers und das Band.

**c) Komposition**

- Ordnungsfigur: Achsenkreuz (Coverstaffel senkrecht, Regalband waagerecht).
- Ordnungslinie: linke Kante bei x = 20. Darauf fluchten Wortmarke, Suchfeld, Ankercover, Label, Headline, Subline, Primärknopf und die Texte der Folgesektion. Die Thumbnails der Folgezeilen sitzen rechtsbündig am Gegenrand (x 330–370), damit keine zweite Textlinie entsteht.
- Raster (y in px):

| Bereich | y | Bemerkung |
|---|---|---|
| Kopfzeile | 47–111 | 64 px = 7,6 % der Viewporthöhe |
| Suchfeld | 127–179 | gehört mit der Kopfzeile zu einer Gruppe (Abstand 16) |
| Bühne | 227–461 | Abstand zur Zone darüber 48; Band 349–437, Cover ragt 24 px darunter heraus |
| Label | 485–505 | Abstand zur Gruppe darüber 24 |
| Headline | 513–553 | |
| Subline | 561–585 | |
| Knöpfe | 609–661 | 132 + 12 + 176 = 320 px breit |
| Folgesektion | ab 709 | angeschnitten, sichtbar 135 px = 16 % |

- Anker und Fokusreiz: Das Ankercover ist der Anker. Sein Reiz ist die Größe (größte geschlossene Fläche, 5,3-mal so groß wie der Primärknopf) zusammen mit dem Bildkontrast. Die Nebencover tragen keinen Reiz (entsättigt, Kontrast gesenkt). Die Headline ist der zweite Gewichtspol: ein dunkler Tonwert, aber eine Linie und keine Fläche, sie teilt den Größenreiz nicht.
- Geschätzte Flächenanteile: frei ≈ 55 %, Fokusträger ≈ 19 %, Text ≈ 13 %, Bedienflächen ≈ 13 %. Das Regalband zählt als ruhige Szenenfläche zum freien Anteil.
- Maßstabssprung: 234 px Coverhöhe zu 11,2 px Versalhöhe der Bedienschrift = **20,9 : 1**. Die Headline ist mit 36 px 2,25-mal so groß wie der Fließtext. Größenstufen: 3 (Anker 234 · Headline 36 · Text und Bedienung 16, das Label mit 14 px liegt innerhalb einer Spreizung von 1,14).

**d) Bausteine der Bedienschicht**

| Baustein | Form, Radius-Token | Zustände | Zustandskanal |
|---|---|---|---|
| Kontoknopf | Kreis 44 px, `--radius-voll` (50 %, aspect-ratio 1), Symbol in Tinte | Ruhe, Hover, Gedrückt, Fokus | Hover und Gedrückt: Deckkraft der Überlage |
| Suchfeld | Pille 52 px, `--suche-radius`, Kontur 1 px `--suche-kontur`, Fläche `--suche-grund` | Ruhe, Hover, Fokus, Eingabe (Lupe wird zum Zurück-Pfeil, Löschen-× erscheint, die Breite bleibt gleich) | Hover: Deckkraft; Eingabe: Symbolwechsel |
| Ankercover (Link zur Detailansicht) | Rechteck, `--cover-radius`, Kante 1 px | Ruhe, Gedrückt, Fokus (Ring 2 px, Abstand 2 px) | Gedrückt: Deckkraft der Überlage |
| Primärknopf „Verlängern“ | Pille 52 px, `--knopf-radius`, Akzentfläche | Ruhe, Hover, Gedrückt, Fokus; Laden: Beschriftung „Wird verlängert …“, aria-busy, ohne Formänderung und ohne drehendes Symbol; Erfolg: wird zur Kontur-Pille mit Häkchen, „Verlängert bis 21. Nov.“, nicht mehr bedienbar; nicht möglich: Knopf entfällt, stattdessen Textzeile mit Symbol „Nicht verlängerbar: vorgemerkt“ | Rang: Füllung gegen Kontur; Hover: Deckkraft |
| Sekundärknopf „Alle 3 verlängern“ | Pille 52 px, `--knopf-radius`, Kontur 1 px | wie der Primärknopf; Ergebnis als Zusammenfassung „2 verlängert, 1 vorgemerkt“ | wie oben |
| Folgezeile (Link) | flache Zeile, Trennlinie 1 px `--zeile-trenner`, Hover- und Fokusfläche innen mit `--zeile-radius` (8), Thumbnail 40 × 60 rechts mit `--cover-radius` | Ruhe, Hover, Gedrückt, Fokus | Deckkraft |
| Statusmeldung | Textzeile unter den Knöpfen, role="status" | – | – |
| Vorschlagspanel (Overlay) | `--panel-radius` (20), opak `--panel-grund` | ein/aus | Deckkraft |

Radien gesamt: voll, 20, 8, 2, also 4 Werte. Kein Formbruch.

Datenfälle:
- 0 Ausleihen: Das Anker-Cover zeigt „Neu im Bestand“, Label „NEU IM BESTAND“, Headline ist der Titel, Primärknopf „Ansehen“.
- 1 Ausleihe: ohne Nebencover.
- Mehr als 3 Ausleihen: höchstens 3 Cover, Label „5 AUSLEIHEN“.
- Überfällig: Label „ÜBERFÄLLIG“ mit Warnsymbol in Tinte, Headline „Seit 2 Tagen überfällig“. Keine Signalfarbe, weil es nur eine Akzentrolle gibt.

Barrierefreiheit: Das unsichtbare h1 lautet „Start“, die sichtbare Headline ist h2 im Abschnitt „Nächste Rückgabe“. DOM- und Tab-Reihenfolge: Kontoknopf, Suchfeld, Ankercover, Verlängern, Alle verlängern, Folgezeilen.

**e) Texte**

| Element | Text | Wörter |
|---|---|---|
| Suchfeld (Platzhalter) | „Titel, Person oder Thema“ (unsichtbares Label: „Katalog durchsuchen“) | 4 |
| Label | „NÄCHSTE RÜCKGABE“ | 2 |
| Headline | „Fällig in 4 Tagen“ | 4 |
| Subline | „Das Jahr der Kraniche · Lea Brandt“ | 6 |
| Primär | „Verlängern“ (zugänglicher Name: „Das Jahr der Kraniche verlängern“) | 1 |
| Sekundär | „Alle 3 verlängern“ | 3 |
| Folgesektion im Anschnitt | „ABHOLBEREIT · 1“, „Atlas der kleinen Inseln“, „Zentrale · bis Mo., 2. Nov.“ | 11 |
| **Summe außerhalb der Navigation** | | **31 (≤ 40)** |

**f) Signature-Effekte**

- **Zonierter Lichtraum hinter dem Fokusträger.** Bedingung erfüllt: ein einziges Zentrum hinter dem Ankercover, 2 Verlaufszonen, also innerhalb von R11. Der Lichthof ist 360 px breit, das 1,14-Fache der Staffelbreite (316 px). Er endet unterhalb der Kopfzeile, deshalb entsteht keine Naht zur opaken Kopffläche.
- **Weicher, blasser Begleitschatten am Ankercover.** Bedingung erfüllt: helle Fläche, eine einzige Stufe, neben einer Verdeckung (das Cover verdeckt Band und Nebencover). 4 % `--tief`, Versatz x 12 / y 24 px in Lichtrichtung, Weichzeichnung 60 px, Ausdehnung −6 px. Die dunkelste Stelle liegt etwa 7 Tonwerte unter dem Umfeld (Grenze 8).
- Nicht eingesetzt: Glas (unter den Flächen liegt kein dauerhaft gesättigter Bildinhalt), Rahmenbruch, Formreim, Schein.

**g) Bewegung**

- Dauerbewegung: keine. Kein Parallax, keine Scroll-Kopplung, keine Einblendung von Folgeabschnitten.
- UI-Zustände: Deckkraft der Überlage in 160 ms mit `--kurve-ein`, Austritt 120 ms mit `--kurve-aus`. Der Fokusring erscheint ohne Übergang.
- Wechsel in den Suchzustand (Auslöser: Fokus im Suchfeld): Bühne, Lesestapel und Folgesektion blenden in 200 ms über Deckkraft aus, das Vorschlagspanel blendet in 240 ms ein. Kopfzeile und Suchfeld bleiben stehen.
- Übergang zur Detailansicht (Auslöser: Tipp auf Cover oder Zeile). Einziger bewegter Träger ist das Ankercover. Seitenübergreifende View Transition: Das Cover gleitet und skaliert gleichmäßig von 156 × 234 auf 200 × 300 (Seitenverhältnis bleibt), 500 ms mit `--kurve-szene`. Die Bedienschicht wird in 200 ms überblendet, die Kopfzeile ist von der Animation ausgenommen.
- Erfolg beim Verlängern: Die Beschriftung wird in 160 ms überblendet.
- Fassung „weniger Bewegung“: Die View Transition wird zur Überblendung von 150 ms ohne Ortsänderung. Panel und Ausblendungen erscheinen sofort. Alle Zustände bleiben gleich (Farbwechsel ohne Dauer).

**h) Mobilfassung ab 360 px**

- 390: Grundkomposition wie oben (mobile-first).
- 360 × 780: Rand 18 px; Ankercover 144 × 216, Nebencover 104 × 156; die Headline bleibt einzeilig (≈ 306 von 324 px); Knöpfe 320 px; der Anschnitt der Folgesektion liegt bei etwa 14 %.
- 320: Das dritte Cover entfällt, das Ankercover misst 132 × 198. Die Knöpfe brechen um (Primärknopf oben, Sekundärknopf darunter, beide an der Linie). Der Zonenabstand sinkt von 48 auf 32, damit das Label der Folgesektion im Anschnitt bleibt. Kein horizontales Scrollen.
- Vergrößerte Schrift (Media Query in em, `(max-width: 22em)`, greift ab etwa 18 px Grundgrad): Nebencover und Begleitschatten entfallen, das Ankercover wird höchstens 28svh hoch, die Headline darf 3 Zeilen haben. Der Maßstab bleibt bei mindestens 6,8 : 1.
- Zuschnitt: Cover werden nie beschnitten (Werkabbildung), nur skaliert. Je Breite gibt es eine eigene Bildgröße über srcset (1×, 2×, 3×).
- Querformat: Annahme Hochformat. Im Querformat bleibt der Stapel senkrecht, die Bühne höchstens 40svh hoch.

**i) Ersatzfassungen**

- **Ohne JavaScript:** Die Suche ist ein GET-Formular (`role="search"`) und führt zur serverseitigen Trefferseite mit der Komposition aus 3.2, ohne Vorschläge. „Verlängern“ und „Alle verlängern“ sind POST-Formulare; danach kehrt die App auf den Startbildschirm zurück und zeigt eine Statuszeile. Die Kante der angehefteten Leiste entfällt. Die View Transition ist reines CSS und bleibt erhalten, wo der Browser sie unterstützt. Ebenenfolge, Anker und Maßstab bleiben gleich.
- **Ohne backdrop-filter:** Es gibt kein Glas, die Fassung bleibt gleich.
- **Reduzierte Transparenz:** Die Abdunklung hinter Panels steigt auf 85 % Deckkraft. Die Nebencover arbeiten mit Filtern, nicht mit Transparenz.
- **Erhöhter Kontrast:** Zweittext in Tinte, Haarlinien in Konturton, Konturen in Tinte, Fokusring 3 px. Die Nebencover entfallen.
- **forced-colors:** Cover bekommen einen 1-px-Rahmen in CanvasText, Knöpfe einen Rahmen in ButtonText, der Fokus erscheint in Highlight. Band und Lichtraum entfallen systembedingt; das Cover bleibt über seinen Rahmen lesbar.

**j) Kontrastpunkte (ungünstigste Stelle)**

| Text / Element | Ungünstigste Stelle | Wert | Ziel |
|---|---|---|---|
| Wortmarke (Tinte) | Grund #F4F1EA | 14,9 : 1 | 4,5 |
| Platzhalter (Text-leise) | Feld #FFFFFF | 7,2 : 1 | 4,5 |
| Kontur des Suchfelds | Grund | 3,3 : 1 | 3 |
| Label 14 px Versal (Text-leise) | Grund außerhalb des Lichtraums | 6,4 : 1 | 4,5 |
| Headline (Tinte) | Grund | 14,9 : 1 | 3 (große Schrift) |
| Subline (Text-leise) | Grund | 6,4 : 1 | 4,5 |
| Primärknopf: Weiß auf Akzent | Knopffläche | 6,1 : 1 | 4,5 |
| Primärknopf: Fläche gegen Umfeld | Grund | 5,4 : 1 | 3 |
| Sekundärknopf: Kontur / Text | Grund | 3,3 : 1 / 14,9 : 1 | 3 / 4,5 |
| Fokusring (Tinte, 2 px Abstand) | Grund | 14,9 : 1 | 3 |
| Meta der Folgezeile 14 px | Grund | 6,4 : 1 | 4,5 |
| Regalband | Auf dem Band liegen weder Text noch Konturen (eine Kontur hätte dort nur 2,9 : 1) | – | – |

---

### 3.2 Hauptbildschirm im Suchzustand (Treffer)

**a) Zweck und Hauptaktion**
Den gesuchten Titel in einem Blick erkennen und öffnen. Hauptaktion: den besten Treffer öffnen (Cover und Textblock sind ein gemeinsamer Link). Es gibt keinen Knopf als Handlungsaufruf; die Filterchips sind Einstellungen.

**b) Ebeneninventar**

| Nr. | z | Ebene | Inhalt | Medium |
|---|---|---|---|---|
| 1 | 0 | Grund | Papier mit Lichtraum: rx 96 / ry 120 um (84 \| 391) | CSS |
| 2 | 10 | Kulisse | Regalband 88 px, y 375–463 | CSS |
| 3 | 20 | Motiv | Cover des besten Treffers, 128 × 192, x 20–148, y 295–487 | Bild |
| 4 | 30 | Bedienschicht | Chips, Trefferzahl, Text des besten Treffers, Trefferzeilen mit Thumbnails 40 × 60 | HTML |
| 5 | 40 | Navigation | Kopfzeile, angeheftetes Suchfeld, Vorschlagspanel während der Eingabe | HTML |

Verdeckung: Das Cover verdeckt das Regalband.

**c) Komposition**

- Raster (y in px): Kopfzeile 47–111 · Suchfeld 127–179 („Kraniche“, Zurück-Pfeil, ×) · Chips 195–239 · Label 263–283 · Cover 295–487 · Titel 511–535 · Meta 535–555 · Zeile 1 579–671 · Zeile 2 671–763 · Zeile 3 ab 763 angeschnitten.
- Ordnungslinie: linke Kante. Der Text des besten Treffers steht unter dem Cover, nicht daneben; sonst entstünde eine Textlinie bei 42 % der Breite.
- Anker: das Cover des besten Treffers (Reiz: Größe). Die Thumbnails sind linear 3,2-mal kleiner, flächig 10-mal.
- Geschätzte Flächenanteile: frei ≈ 69 %, Fokusträger 7,5 %, Text ≈ 12 %, Bedienflächen ≈ 12 %.
- Maßstabssprung: 192 zu 11,2 = **17,1 : 1**. Größenstufen: 2 (Anker; Text 16 mit 14). Keine Headline.
- Bewusste Abweichung: Der Fokusträger hat 7,5 % statt der 15–35 % aus dem Spielraum, damit mindestens 3 Treffer ohne Scrollen sichtbar sind. R7 und R8 bleiben erfüllt.

**d) Bausteine**

| Baustein | Form, Radius-Token | Zustände | Kanal |
|---|---|---|---|
| Suchfeld im Eingabezustand | wie 3.1 | Eingabe, Fokus | Symbolwechsel |
| Chip „Nur verfügbare“ (Umschalter, aria-pressed) | Pille 44 px, `--knopf-radius`, Kontur | Ruhe, Hover, Fokus; aktiv: Akzent-Tönung, Akzentkontur, Häkchen | aktiv: Füllung (Tönung); Hover: Deckkraft |
| Knopf „Filter“ | Pille 44 px, Kontur, Symbol | öffnet Panel (`--panel-radius`) | Deckkraft |
| Bester Treffer (ein Link für Cover und Text) | Fokusfläche `--zeile-radius` um Cover und Text | Ruhe, Gedrückt, Fokus | Deckkraft |
| Trefferzeile | wie die Folgezeile in 3.1 | wie 3.1 | Deckkraft |
| Vorschlagspanel | `--panel-radius`, opak, bis 6 Zeilen à 48 px; bei leerem Feld „Zuletzt gesucht“ | 240 ms ein / 180 ms aus | Deckkraft |

Das Panel verdeckt während der Eingabe die Bühne; erlaubt, weil es nur Bild und Kulisse trifft. Leer- und Fehlerzustände sind nicht ausgestaltet (Annahme: nächste Runde).

**e) Texte**

| Element | Text | Wörter |
|---|---|---|
| Suchbegriff | „Kraniche“ | 1 |
| Chips | „Nur verfügbare“, „Filter“ | 3 |
| Label | „12 TREFFER“ | 2 |
| Bester Treffer | „Das Jahr der Kraniche“ / „Lea Brandt · Im Regal, Zentrale“ | 9 |
| Zeile 1 | „Kraniche über dem Moor“ / „Jonas Weil · Ausgeliehen bis 12.11.“ | 9 |
| Zeile 2 | „Zugvögel Mitteleuropas“ / „Hrsg. M. Ott · Im Regal“ | 7 |
| Zeile 3 (Anschnitt) | „Die Rückkehr der Kraniche“ | 4 |
| **Summe** | | **35 (≤ 40)** |

**f) Signature-Effekte**
Lichtraum: Lichthof 192 px, das 1,5-Fache der Coverbreite, ein Zentrum. Begleitschatten: Versatz x 10 / y 19 px, Weichzeichnung 48 px, Ausdehnung −5 px, 4 %, neben der Verdeckung des Bands. Gleiche Systematik wie auf dem Startbildschirm.

**g) Bewegung**
Panel 240 ms ein, 180 ms aus, nur über Deckkraft. Die Trefferliste erscheint in 200 ms über Deckkraft. Der Wechsel zum Detail läuft wie in 3.1, Träger ist das Treffer-Cover. Bei weniger Bewegung erscheint alles sofort, die Szene wird in 150 ms überblendet.

**h) Mobilfassung ab 360 px**
360: Cover 120 × 180; die Chips (150 + 8 + 100 px) passen auch bei 320 ohne Umbruch. Bei offener Tastatur sind nur Kopfzeile, Suchfeld und Panel sichtbar; das ist ein vorübergehender Zustand. Bei vergrößerter Schrift entfällt der Begleitschatten.

**i) Ersatzfassungen**
Ohne JavaScript: Die Trefferseite wird serverseitig erzeugt, der Chip ist ein Link mit Parameter (`?verfuegbar=1`), „Filter“ führt auf eine eigene Seite. Die übrigen Fassungen entsprechen 3.1.

**j) Kontrastpunkte**

| Text / Element | Ungünstigste Stelle | Wert | Ziel |
|---|---|---|---|
| Titel (Tinte) | Grund | 14,9 : 1 | 4,5 |
| Meta 14 px (Text-leise) | Grund | 6,4 : 1 | 4,5 |
| Chip-Kontur | Grund | 3,3 : 1 | 3 |
| Aktiver Chip: Tinte auf Tönung / Akzentkontur | Tönung #D9E1D9 / Grund | 12,6 : 1 / 5,4 : 1 | 4,5 / 3 |
| Vorschlagstext auf dem Panel | Hell | 16,8 : 1 (Tinte), 7,2 : 1 (Text-leise) | 4,5 |

---

### 3.3 Detailansicht „Titel“

**a) Zweck und Hauptaktion**
Den Titel bestätigen, die Verfügbarkeit verstehen und vormerken.
Hauptaktion: „Vormerken“; bei eigener Ausleihe „Verlängern“. Sekundär: „Merken“.

**b) Ebeneninventar**

| Nr. | z | Ebene | Inhalt | Medium |
|---|---|---|---|---|
| 1 | 0 | Grund | Papier mit Lichtraum: rx 150 / ry 170 um (120 \| 285) | CSS |
| 2 | 10 | Kulisse | Regalband 88 px, y 315–403 | CSS |
| 3 | 20 | Motiv | Ankercover 200 × 300, x 20–220, y 135–435, Kante, Begleitschatten | Bild, alt="Cover von „Das Jahr der Kraniche“" |
| 4 | 30 | Bedienschicht | Label, Headline, Autorin, Statuszeile, 2 Knöpfe, Folgesektion | HTML |
| 5 | 40 | Navigation | Kopfzeile mit Zurück-Knopf; Vormerk-Dialog | HTML, `<dialog>` |

Verdeckung: Das Cover verdeckt das Regalband und ragt 32 px darunter heraus.

**c) Komposition**

- Raster (y in px): Kopfzeile 47–111 (Zurück-Kreisknopf 44 px, x 8–52, Glyphe optisch auf x 20) · Cover 135–435 · Label 459–479 · Headline 487–567 (2 Zeilen) · Autorin 575–599 · Status 623–647 · Knöpfe 671–723 · Folgesektion ab 771, sichtbar 73 px = 8,6 %.
- Ordnungsfigur und -linie wie 3.1. Rechts neben dem Cover (x 236–370) bleibt die Fläche bewusst leer.
- Anker: das Cover (Reiz: Größe, 9-mal so groß wie die Knopffläche).
- Geschätzte Flächenanteile: frei ≈ 65 %, Fokusträger 18 %, Text ≈ 12 %, Bedienflächen ≈ 5 %. Der freie Anteil liegt über dem Zielband 40–60 %, aber über dem Mindestwert.
- Maßstabssprung: 300 zu 11,2 = **26,8 : 1**. Headline 36 px = 2,25-mal Fließtext. Größenstufen: 3.

**d) Bausteine**

| Baustein | Form, Radius-Token | Zustände | Kanal |
|---|---|---|---|
| Zurück-Knopf | Kreis 44 px, `--radius-voll` | Ruhe, Hover, Gedrückt, Fokus | Deckkraft |
| Primärknopf „Vormerken“ | Pille 52 px, Akzentfläche | wie 3.1; öffnet den Vormerk-Dialog | Rang: Füllung; Hover: Deckkraft |
| Sekundärknopf „Merken“ (Umschalter, aria-pressed) | Pille 52 px, Kontur, Lesezeichen-Symbol | aktiv: „Gemerkt“, Akzent-Tönung, Akzentkontur, gefülltes Symbol | aktiv: Füllung (Tönung) |
| Statuszeile | Text 16/600 mit Symbol (Uhr = ausgeliehen, Haken = im Regal, Ausrufezeichen = überfällig) | – | Symbol und Wortlaut, nie nur Farbe |
| Folgesektion | Zeilen wie 3.1: Verfügbarkeit je Zweigstelle; Signatur in `--schrift-kennung`; Kurzbeschreibung 16/1,5 (≈ 45 Zeichen je Zeile); Angaben (ISBN, Seiten, Sprache); „Mehr von Lea Brandt“ mit Thumbnails rechts | wie 3.1 | Deckkraft |
| Vormerk-Dialog | `<dialog>` am unteren Rand, `--panel-radius` oben, opak `--panel-grund`, Abdunklung 40 % | 240 ms ein / 180 ms aus, nur Deckkraft, kein Hochgleiten. Inhalt: „Abholen in“ (16/600), Radiozeilen je Zweigstelle (56 px, vorgewählt ist die zuletzt genutzte), gegebenenfalls „Gebühr 1,00 €“, Primärknopf „Vormerkung bestätigen“, Sekundärknopf „Abbrechen“. Beim Öffnen liegt der Fokus auf der gewählten Option, Esc schließt | Deckkraft |

Zustandsvarianten (gleiche Plätze, gleiche Komposition):

| Fall | Label | Statuszeile | Primär | Sekundär |
|---|---|---|---|---|
| Von anderen ausgeliehen | ROMAN · 2024 | Ausgeliehen bis 12. Nov. · 2 Vormerkungen | Vormerken | Merken |
| Im Regal | ROMAN · 2024 | Im Regal · Zentrale, 2. OG · `Rom BRA` | Vormerken (Bereitstellung) | Merken |
| Von mir ausgeliehen | VON DIR AUSGELIEHEN | Fällig am 30. Okt. · noch 2 Verlängerungen | Verlängern | – |
| Von mir vorgemerkt | VORGEMERKT · PLATZ 2 | Abholung in der Zentrale | – | Vormerkung löschen |
| E-Medium | E-BOOK | Sofort verfügbar | Ausleihen | Merken |

**e) Texte (Fall „von anderen ausgeliehen“)**

| Element | Text | Wörter |
|---|---|---|
| Label | „ROMAN · 2024“ | 2 |
| Headline | „Das Jahr der Kraniche“ | 4 |
| Autorin | „Lea Brandt“ | 2 |
| Statuszeile | „Ausgeliehen bis 12. Nov. · 2 Vormerkungen“ | 6 |
| Primär / Sekundär | „Vormerken“ / „Merken“ | 2 |
| Folgesektion im Anschnitt | „VERFÜGBARKEIT“, „Zentrale · 0 von 3 im Regal“ | 7 |
| **Summe** | | **23 (≤ 40)** |

Lange Titel: Ein Untertitel wandert in die Zeile unter dem Haupttitel. Der Haupttitel bleibt bei 36 px und darf in Ausnahmefällen 4 Zeilen haben; es wird nichts abgeschnitten.

**f) Signature-Effekte**
Lichtraum: Lichthof 300 px, das 1,5-Fache der Coverbreite. Begleitschatten: Versatz x 15 / y 30 px, Weichzeichnung 75 px, Ausdehnung −8 px, 4 %, neben der Verdeckung des Bands. Die Signatur in Monospace ist eine Schriftrolle, kein Effekt.

**g) Bewegung**
Ankunft über die View Transition aus 3.1, Träger ist das Cover (500 ms, `--kurve-szene`). Dialog 240 ms ein, 180 ms aus. Wechsel auf „Gemerkt“: Füllung in 160 ms. Bei weniger Bewegung: Überblendung in 150 ms, Dialog sofort.

**h) Mobilfassung ab 360 px**
360: Cover 184 × 276, die Headline darf 3 Zeilen haben, die Statuszeile 2; Knöpfe 128 + 12 + 124 px. 320: Cover 160 × 240; der Anschnitt der Folgesektion kann entfallen, die Hauptaktion bleibt ohne Scrollen sichtbar. Bei vergrößerter Schrift: Cover höchstens 30svh, kein Begleitschatten.

**i) Ersatzfassungen**
- Ohne JavaScript: „Vormerken“ ist ein Link auf eine eigene Seite (`/titel/123/vormerken`) mit derselben Komposition: kleineres Cover mit Band oben, darunter die Liste der Abholorte und „Vormerkung bestätigen“. „Merken“ ist ein POST-Formular. „Zurück“ ist ein Link auf die Herkunftsseite (serverseitig ermittelt, sonst Start).
- Reduzierte Transparenz: Abdunklung hinter dem Dialog 85 %.
- Alle übrigen Fassungen wie 3.1.

**j) Kontrastpunkte**

| Text / Element | Ungünstigste Stelle | Wert | Ziel |
|---|---|---|---|
| Headline (Tinte) | Grund | 14,9 : 1 | 3 |
| Autorin, Label (Text-leise) | Grund | 6,4 : 1 | 4,5 |
| Statuszeile (Tinte) | Grund | 14,9 : 1 | 4,5 |
| Primärknopf / Fläche | Akzent / Grund | 6,1 : 1 / 5,4 : 1 | 4,5 / 3 |
| Sekundärknopf, Kontur | Grund | 3,3 : 1 | 3 |
| Dialogtext (Tinte / Text-leise) | Hell | 16,8 : 1 / 7,2 : 1 | 4,5 |
| Radio-Kontur im Dialog | Hell | 3,7 : 1 | 3 |
| Signatur in Monospace | Grund | 14,9 : 1 | 4,5 |

---

## 4. Code

Nicht angefordert, deshalb kein Code. Die Tokens in Abschnitt 2 lassen sich direkt verwenden.

Leistungsplan als Grundlage für Prüfpunkt 11:
- Bis zum LCP etwa 110 KB: HTML 15 KB, CSS 12 KB, Schrift 30 KB, Ankercover etwa 50 KB in AVIF bei 2×.
- JavaScript höchstens 15 KB, keine Bibliothek.
- Das Ankercover lädt mit `fetchpriority="high"`, nie verzögert und mit festen width/height aus den Katalogdaten.
- Thumbnails unterhalb der Falz laden verzögert.
- Die Schrift lädt mit `font-display: swap` und einem Fallback mit size-adjust, damit es keinen Layoutsprung gibt.

---

## 5. Prüfprotokoll (Teil 10)

| Nr. | Prüfpunkt | Erfüllt | Nachweis |
|---|---|---|---|
| 1 | Graustufen-Unschärfe: genau ein dominanter Fleck, und er ist der Anker | ja, mit Einschränkung | Das Ankercover ist in jeder Ansicht die größte geschlossene Tonfläche (Start 5,3-mal, Detail 9-mal so groß wie der Primärknopf; in den Treffern gibt es nur Kontur-Chips). Restrisiko: Sehr helle Fremdcover verschwinden beim Unschärfetest im Papierton (siehe Unklarheiten). |
| 2 | Ordnungslinie, an der Text und Bedienung fluchten | ja | Linke Kante x = 20 in allen Ansichten; Thumbnails am Gegenrand; das Symbol des Zurück-Knopfs sitzt optisch auf der Linie. |
| 3 | 3–6 Ebenen, Tiefe an Verdeckung ablesbar, kein tragender Schatten | ja | Start 6, Treffer 5, Detail 5 Ebenen. Das Cover verdeckt das Regalband (überall), auf dem Startbildschirm zusätzlich die Nebencover. Der Begleitschatten hat 4 % und trägt nicht. |
| 4 | Bedienschicht frontal und flach, ohne Material, Glow oder Elevation, eine Formfamilie, höchstens 4 Radien | ja | Keine Transformation an der UI, opake flache Flächen, Vollrundung; Radien: voll, 20, 8, 2. |
| 5 | Maßstabssprung ≥ 3-fach bei jeder Breite, höchstens 3 Größenstufen, ≥ 33 % frei | ja | 20,9 / 17,1 / 26,8 : 1 bei 390; bei 320 mindestens 17 : 1; bei großer Schrift mindestens 6,8 : 1. Größenstufen 3 / 2 / 3. Frei ≈ 55 / 69 / 65 %. |
| 6 | Bild bildet den Raum, ohne Saum und Textkasten, Grund mit höchstens einem Helligkeitszentrum | ja | Das Cover steht ohne Rahmen auf dem Grund vor dem Band; Text liegt nur auf dem Grund, nie auf dem Bild; ein Lichtraum je Ansicht. |
| 7 | Ein Ausdrucksträger dominiert, Einmal-Grenzen eingehalten, Effekte mit erfüllter Bedingung | ja | Ausdrucksträger: Kulissen (Regalband und Staffel). Je Ansicht 1 Anker, 1 Fokusträger, 0 Formbrüche, 0 Rahmenbrüche, 1 Helligkeitszentrum, 0 Schein, 1 bewegter Träger (nur beim Übergang), 1 Schattenstufe. Lichtraum und Begleitschatten mit erfüllter Bedingung (siehe jeweils f). |
| 8 | Kontrast an der ungünstigsten Stelle, Fokus sichtbar und unverdeckt, Ziele ≥ 24 px, Tab-Reihenfolge folgt der Lesefolge | ja | Kleinster Textkontrast 6,4 : 1, kleinste Kontur 3,3 : 1, Fokusring 2 px Tinte (14,9 : 1). Alle Ziele mindestens 44 px. DOM-Reihenfolge = Lesestapel (siehe 3.1 d). |
| 9 | Eigene Komposition ab 360 px, kein horizontales Scrollen bei 320 px, kein Verlust bei 200 % Text | ja | 360 und 320 mit eigenen Maßen; Umbruch der Knöpfe; Fassung für große Schrift über em-Media-Query; Schriftgrade in rem. |
| 10 | Ohne JavaScript und mit reduzierter Bewegung ein vollständiges Standbild | ja | Formulare statt Skripte; gleiche Ebenenfolge; Endzustände ohne Bewegung. |
| 11 | Leistungsbudgets eingehalten, leichtestes Verfahren gewählt | ja (budgetiert, nicht gemessen) | Stufe 0; etwa 110 KB bis zum LCP; JavaScript höchstens 15 KB; Cover unter 200 KB; das LCP-Element ist ein Bild, kein Canvas. |
| 12 | Nichts nachgebaut | ja | Keine Vorlage verwendet; das Regalband ist eine eigene Ableitung aus dem Thema; keine reale Marke; fiktive Titel. |

---

## Unklarheiten im Prompt

1. **Technikstufe.** Der Auftrag sagt „leicht (CSS und wenig JavaScript)“. Die Skala des Prompts (0/1/2) erwähnt JavaScript nicht; Stufe 0 heißt nur „HTML, CSS, Bild“. Ich habe Stufe 0 angenommen und JavaScript nur für Funktionen eingesetzt. Offen bleibt auch, ob CSS View Transitions zu Stufe 0 oder 1 gehören; Stufe 1 nennt nur „CSS-Scrollanimation“.
2. **Geltungsbereich.** Der Prompt ist auf Erstbildschirme und Heros von Websites zugeschnitten; laut Anpassungshinweis sind nur Desktop-Heros belegt. Für eine App ist unklar, was „erster Bildschirm“ heißt (jede Ansicht? jeder Zustand?) und ob R2, R7 und R8 auch für vorübergehende Zustände gelten (Vorschlagspanel bei offener Tastatur, Dialog). Ich habe geraten: Sie gelten nur für Ruheansichten, vorübergehende Zustände zählen als Overlay.
3. **Listen gegen Anker und Fokusträgergröße.** Eine Trefferliste ist ihrem Wesen nach gleichrangig. Unklar ist, ob Listenzeilen als „Feld gleichrangiger Kacheln ohne Anker“ gelten. Meine Lösung: „Bester Treffer“ als Anker. Er erreicht aber nur 7,5 % der Fläche statt 15–35 %, sonst wären weniger als 3 Treffer sichtbar. Dass Werte nur Startwerte sind und die Regel zählt, sagt der Prompt ausdrücklich nur für Teil 4, nicht für die Prozentwerte in Teil 2.
4. **Ebenenfolge gegen Verdeckungsregel (Widerspruch).** Die z-Stufen legen das Motiv (20) unter die Bedienschicht (30). Gleichzeitig darf die Verdeckung „Inhaltsflächen wie Karten“ treffen, und Karten gehören laut Begriffsdefinition zur Bedienschicht. Ich habe das umgangen: Keine Karte wird vom Motiv verdeckt.
5. **Akzent gegen Anker.** Ausgeschlossen ist „ein zweiter Akzentreiz neben dem Anker“, zugleich ist die Akzentrolle für die Hauptaktion vorgesehen. Ein gesättigter Primärknopf teilt den Reiz „Sättigung“ mit einem farbigen Cover. Ich habe angenommen: Der Reiz des Ankers ist die Größe, und ein Akzent mit höchstens 5 % Fläche ist ein zulässiger zweiter Pol.
6. **Keine Zustandsfarben.** Es gibt genau eine Akzentrolle und ausdrücklich keine zweite Akzentfarbe für Zustände. Damit fehlen Warn- und Fehlerfarben (überfällig, nicht verlängerbar, Formularfehler). Ich habe das über Symbol, Wortlaut und Schriftgewicht gelöst; ob das so gewollt ist, sagt der Prompt nicht.
7. **Zu wenige Farbrollen.** Teil 8.3 sieht nur Grund, Text, Hell, Tief und Akzent vor. Eine App braucht mindestens einen Zweittext, eine Kontur mit 3 : 1 für Felder und eine Kulissenfläche. Dazu kommt ein Namenskonflikt: Die Kantenrolle heißt „Hell“, auf hellem Grund muss die Kante aber dunkler sein (Teil 2: „hell über Kantensaum“). Ich habe die Rollen text-leise, kontur, kante und kulisse ergänzt.
8. **Fremdbilder.** Buchcover sind rechteckige Fremdbilder mit unkontrollierten Farben. Unklar ist:
   - ob sie als „Freisteller“ oder als „gerahmte Beigabe“ gelten;
   - ob ihre 1-px-Kante ein erlaubter „Kantensaum“ oder ein verbotener „Freistellsaum“ ist;
   - ob eine getönte Kulissenfläche (Regalband) als „Grundsprung“ zählt;
   - wie ΔE00 ≤ 1 zwischen Asset-Grund und Seitengrund anzuwenden ist.

   Prüfpunkt 1 (genau ein dominanter Fleck) lässt sich bei sehr hellen Covern nicht garantieren.
9. **Größenstufen.** R7 verlangt „2–3 Größenstufen“, Teil 10 nur „höchstens 3“. Offen ist, ob das Motiv als Stufe zählt und ob 14 px und 16 px (Spreizung ≤ 1,25) eine Stufe oder zwei sind. Ich habe geraten: Das Motiv zählt, und Werte innerhalb von 1,25 bilden eine Stufe.
10. **Messung des Maßstabssprungs.** Objekthöhe gegen Versalhöhe ergibt mobil 17- bis 27-fach, also mehr als der Desktopwert „etwa 5–12-fach“. Unklar ist, ob es eine Obergrenze gibt und ob mit „Hauptelement“ das Motiv oder die Headline gemeint ist. Außerdem misst der Prompt beim Objekt die Höhe, beim Wort die Versalhöhe; die beiden Maße sind nicht vergleichbar.
11. **„Mindestens 3-mal kleiner“ (Nebenkörper).** Linear oder in der Fläche? Ich habe linear angenommen: Die Thumbnails sind 3,2-mal kleiner. Die größeren Nebencover laufen über die zweite Möglichkeit „ohne Fokusreiz“ (entsättigt).
12. **Ordnungslinie bei Zeilen mit Bild.** R3 erlaubt nur eine Zweitlinie mit 2–4 % Einzug. Übliche Listenzeilen (Bild links, Text daneben) erzeugen eine Textlinie bei etwa 20 % der Breite. Ich habe die Thumbnails an den rechten Rand gesetzt. Offen bleibt, ob der Gegenrand als weitere Linie zählt und ob bei Symbolknöpfen die Trefferfläche oder die Glyphe auf der Linie sitzen muss.
13. **Mindestgrad der Headline gegen Zeilenzahl.** Mobil sind mindestens 2,25-mal Fließtext (36 px) und höchstens 3 Zeilen verlangt. Bei langen Buchtiteln (mehr als etwa 45 Zeichen) geht beides nicht zugleich. Zwischengrößen sind verboten, Inhaltsverlust auch (Teil 7). Ich habe geraten: 36 px bleiben, Ausnahmen dürfen 4 Zeilen haben.
14. **Panels „nur über Deckkraft“.** Verlangt sind Panels ohne Versatz; das widerspricht der Plattformkonvention, nach der Bottom-Sheets hochgleiten. Ich habe die Regel trotzdem befolgt.
15. **Zählweise.** Offen ist, ob Suchfeld, Filterchips, verlinkte Listenzeilen und Kopfzeilenknöpfe als Handlungsaufrufe zählen und ob Platzhaltertext und Statuszeilen zu den 40 Wörtern gehören. Ich habe geraten: Nur Knöpfe zählen als Aufrufe; gezählt sind alle sichtbaren Wörter außer der Kopfzeile.
16. **Kopfzeile ≤ 8 %.** Offen ist, ob Statusleiste und Sicherheitszone mitzählen; mit ihnen sind es 13 %. Ich habe ohne sie gerechnet.
17. **Zustandskanäle.** Teil 2 nennt Deckkraft, Sättigung, Füllung gegen Kontur und Glas gegen opak; Teil 5 nennt zusätzlich „Farbe“. Auf Touchgeräten gibt es kein Hover. Für „gedrückt“, „lädt“ und „erledigt“ legt der Prompt keinen Kanal fest.
18. **Raster und Zeilenlänge.** Der Seitenrand clamp(1rem, 5vw, 6rem) ergibt bei 390 px 19,5 px und liegt damit nicht auf der 4-px-Basis. Die Zeilenlänge von 45–75 Zeichen ist bei 360 px und 16 px knapp nicht erreichbar (etwa 42 Zeichen).
19. **Riesenwort in Variante C.** Teil 2 erlaubt Kulissenschrift nur mit plastischem Gegenüber, nennt aber das „Riesenwort“ als möglichen Fokusträger, und Variante C hat keinen plastischen Körper. Ob ein Riesenwort als Fokusträger in C zulässig ist, bleibt offen; ich habe keins verwendet.
20. **Ausgabeformat.** Der Auftrag verlangt „genau das Ausgabeformat“, Punkt 4 („auf Wunsch Code“) wurde aber nicht gewünscht; ich habe den Code deshalb weggelassen. Offen ist auch, ob vorübergehende Zustände (Panel, Dialog) eigene Blöcke a) bis j) brauchen; ich habe sie unter d) behandelt.
21. **Breiten, Ausrichtung, große Schrift.** Teil 7 verlangt Prüfbreiten bis 1440 px und eine eigene Komposition je Breite, der Auftrag nennt nur ein Telefon. Das Querformat regelt der Prompt nicht, obwohl „Hauptaktion ohne Scrollen sichtbar“ dort kaum zu erfüllen ist. Dasselbe gilt bei 200 % Text: Die Regel „ohne Verlust“ und „Hauptaktion ohne Scrollen“ widersprechen sich dann.
22. **Negativraum über dem Ziel.** Die Detailansicht hat 65 % freie Fläche und liegt damit über dem Zielband 40–60 %. Ob das Ziel zugleich eine Obergrenze ist, sagt der Prompt nicht.
23. **Hell- und Dunkelmodus.** „Grundton hell, dunkel oder fotografisch“ soll je Produkt gewählt und überall gleich angewendet werden. Unklar ist, wie sich das mit einer System-Dunkelfassung verträgt, die viele Telefone erwarten.

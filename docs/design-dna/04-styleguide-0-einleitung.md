# 6. Technischer Styleguide

[← Übersicht](README.md)

Dieses Kapitel übersetzt die gemeinsame Design-DNA aus Kapitel 5 in prüfbare Regeln, Werte und Techniken. Kapitel 5 sagt, was die Richtung ausmacht; dieses Kapitel sagt, wie man eine Oberfläche in dieser Richtung baut und prüft: Ordnung, Ebenen, Material, Licht, Form, Bild, Bewegung, Technik und Grenzen.

## Wofür er gilt

- **Gegenstand.** Oberflächen, die nach der DNA gestaltet werden: erste Bildschirme (Hero) von Websites und Landingpages, ihre Folgeabschnitte und App-Ansichten mit einer Bühne. Belegt sind nur Desktop-Heros. Folgeabschnitte, Mobilfassung (0 von 15 Referenzen), Bewegung und Interaktion sind Ableitung oder Neuentwurf und als solche gekennzeichnet.
- **Marken- und farbneutral.** Der Styleguide schreibt keine Farbtöne, Schriftarten, Marken oder Motive vor. Farbe erscheint nur als Funktion: Anteil, Kontrast, Akzentrolle, Rang. Die Werte einer Marke liegen in einer eigenen Token-Schicht, die austauschbar bleibt (10.9).
- **Mindestanforderungen für jede Variante.** WCAG 2.2 AA für Text, Bedienelemente und Fokus; eine eigene Komposition ab 360 px und Umfließen bis 320 px; die Leistungsbudgets aus 10.8. Eindrucksvolle Gestaltung darf Nutzbarkeit nicht verhindern: Im Konflikt weicht der Effekt, nie die Mindestanforderung (10.10).
- **Nicht Gegenstand.** Inhalte, Texte, Informationsarchitektur, Markenwerte und einzelne Seiten.
- **Leser.** Gestaltung arbeitet vor allem mit 10.1 bis 10.6 und 10.10, Entwicklung mit 10.7 bis 10.9, Prüfung mit den Prüffragen jedes Abschnitts und den Prüfverfahren in 10.10.

## Wie er zu lesen ist

**Aufbau.** Jeder Abschnitt folgt demselben Raster: Grundsatz, Beobachtet in den Referenzen, Regeln, Umsetzung (Vorschlag), Mobil und Barrierefreiheit, Prüffragen. 10.9 sammelt stattdessen alle Zahlen in Tabellen und zeigt, wie sie als Design-Tokens organisiert werden; 10.10 führt Ausschlüsse statt Regeln.

**Regelmarken.**

| Marke | Bedeutung | Herkunft |
|---|---|---|
| **[Pflicht]** | gilt für jede Variante; wer abweicht, verlässt die Richtung oder unterschreitet eine Mindestanforderung | verbindliche DNA (5.2, Nr. 1–11), Rahmen der Stellschrauben (5.3) oder Nutzbarkeitsvorgabe (WCAG 2.2 AA, Core Web Vitals) |
| **[Variabel]** | Stellschraube mit belegtem Spielraum; je Produkt oder Ansicht eine Wahl, die dann überall gleich gilt | variable Ausgestaltung und Dialekte (5.3) |
| **[Optional]** | Signature-Effekt; nur unter der genannten Bedingung, nie Pflicht | Signature-Effekte (5.4) |

**Beobachtet und vorgeschlagen.** Beides ist strikt getrennt.

- *Beobachtet* steht nur, was die Referenzen zeigen, mit Beleg („Ref 03“) und Zählung („12 von 15“). Die Gegenprobe zählt 14 unabhängige Designs, weil Ref 04 und Ref 07 zwei Standbilder desselben Designs sind („Gegenprobe 11 von 14“). Proportionen sind geschätzt: 9 von 15 Quellen sind perspektivisch verzerrt, Pixelwerte aus fotografierten Bildschirmen werden nicht verwendet. „Näherung“ heißt geschätzt am unverzerrten Bildschirmfoto Ref 01. Die Konsenssicherheit (hoch, mittel, niedrig) ist eine Obergrenze, weil die acht Expertenrollen simuliert sind (4.6).
- *Vorschlag* sind Umsetzungswerte und Techniken. Ihre Herkunft ist jeweils benannt:
  - *abgeleitet*: aus geschätzten Verhältnissen der genannten Referenzen gerundet;
  - *Ableitung*: aus einem belegten Prinzip geschlossen, selbst nicht beobachtet;
  - *Neuentwurf*: ohne Beleg in der Sammlung, also eine eigene Gestaltungsentscheidung;
  - *Neuentwurf (nicht beobachtet)*: Bewegung, Scrollen, Mikrointeraktion, Physik und Übergänge, die Standbilder nicht zeigen;
  - *Hypothese*: technische Vermutung zu einer Referenz;
  - *Norm*: externe Vorgabe, vor allem WCAG 2.2 und Core Web Vitals.
- *Technik* wird nie verlangt, weil sie verbreitet ist. „Erforderlich“ ist das leichteste Verfahren, das den Effekt vollständig trägt; „optional“ ist ein schwereres Verfahren mit Bedingung und Begründung (Matrix in 10.8).

**Verweise.** „Nr. 6“ meint Prinzip 6 der verbindlichen DNA (5.2), „5.6.12“ eine Dimension in Kapitel 5, „D4“ die Dimension 4 der Bewertung, „4.4, Frage 5“ eine Leitfrage in Kapitel 4. Alle Zahlen stehen gesammelt in 10.9; weicht ein Abschnitt davon ab, gilt 10.9.

## Verhältnis zu Kapitel 5

- **Kapitel 5 ist die Quelle.** Es nennt die Konstruktionsformel (5.1), die elf verbindlichen Prinzipien (5.2), Stellschrauben und Dialekte (5.3), Signature-Effekte (5.4), häufige Fehldeutungen (5.5) und die 18 Dimensionen im Einzelnen (5.6). Dieses Kapitel fügt der DNA nichts hinzu und lockert nichts.
- **Zuordnung.** Jede [Pflicht]-Regel lässt sich auf ein Prinzip aus 5.2, auf einen Rahmen aus 5.3 oder auf eine Mindestanforderung zurückführen; [Variabel] und [Optional] übernehmen Spielraum und Bedingungen aus 5.3 und 5.4. Die Fehldeutungen aus 5.5 kehren in 10.10 als Ausschlüsse wieder. Was über Kapitel 5 hinausgeht (Zahlenwerte, Mobilfassung, Zeitverhalten, Technik, Barrierefreiheit, Leistung), ist als Neuentwurf, Hypothese oder Norm gekennzeichnet.
- **Dialekte.** A Typo-Bild-Sandwich, B plastischer Hauptdarsteller im gestalteten Licht und C flache Lösung sind zulässige Ausprägungen derselben Konstruktion; Ref 01 taugt nur als Glasschicht innerhalb von A oder B. Ein Dialekt rechtfertigt keine Abweichung von einer [Pflicht]-Regel.
- **Rangfolge im Konflikt.** Für die Richtung gilt Kapitel 5, für die Nutzbarkeit gelten die Mindestanforderungen; der Styleguide wird dann angepasst, nicht die Quelle.

## Übersicht der Abschnitte

| Abschnitt | Regelt | Prinzipien und Dimensionen |
|---|---|---|
| 10.1 Layout und Komposition | Ordnungslinie, Fixationsanker, Negativraum, Maßstabssprung, Raster, Schriftgrade, Textmenge | Nr. 3, 7, 8; D6, D18 |
| 10.2 Räumliche Gestaltung | Ebenenfolge, Verdeckung, Raumschrift, Bildperspektive, Stapelstufen | Nr. 1, 2; D1, D15, D18 |
| 10.3 Materialien und Oberflächen | Materialgefälle, Glas, Unschärfe, Kanten, Textur | Nr. 9; D2, D4, D12 |
| 10.4 Licht und Schatten | Lichtkern, Lichtraum, Begleitschatten, Lichtkante, Schein als Zustand | Nr. 6, 10, 11; D3, D4, D13 |
| 10.5 Geometrie und Formensprache | Formfamilie, Radienstufen, Formbruch, Anschnitt, Masken | Nr. 5; D5, D14 |
| 10.6 Bild- und Objektintegration | Bild als Raum, Freisteller, Übergang Bild–Grund, Verankerung, Text auf dem Bild | Nr. 1, 3, 4, 6; D7, D11 |
| 10.7 Motion und Interaktion | Ort der Bewegung, Zustandskanäle, Scrollen, Übergänge, Fassung „weniger Bewegung“ | Nr. 1, 3, 5; D8, D9, D10, D16, D17 (nicht belastbar) |
| 10.8 Rendering- und Frontend-Techniken | Effekt-Technik-Matrix, Ersatzfassungen, Leistungsbudgets | Nr. 1, 5; Hypothesen aus 4.4, Frage 4 |
| 10.9 Technische Designparameter | alle Zahlen und Wertebereiche, Design-Tokens | alle |
| 10.10 Gestalterische Ausschlussregeln | Verbote aus 5.2 und 5.5, Nutzbarkeitsvorgaben, Prüfverfahren | Nr. 1–11; WCAG 2.2 AA, Core Web Vitals |

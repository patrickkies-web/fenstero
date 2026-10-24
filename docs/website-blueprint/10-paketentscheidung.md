# 10. Kaufentscheidung: Paketauswahl

Phase J des Website-Blueprints (MASTER-PROMPT V4): besondere Ausarbeitung der Kaufentscheidung, also der Auswahl unter den drei
Konfigurator-Paketen. Stand 24.10.2026, Arbeitszweig `claude/design-dna-styleguide`. Planungsdokument: Das Repository wurde nur gelesen,
gebaut oder geändert wurde nichts.

**Was dieses Kapitel leistet.** Die Zielarchitektur (ZA 8.3.2) legt Kapitel 04 „Ihre Marke“ der Seite für Fensterbauer als drei Blöcke an
(`fb-06-pakete-karten`, `fb-07-entscheidungshilfe-vergleich`, `fb-08-festblock-gespraechsweg`). Dieses Kapitel untersucht die
Entscheidungssituation selbst (10.1), entwirft vier Konzepte nur für diese Situation (10.2), bewertet sie (10.3) und spezifiziert das
gewählte Konzept vollständig, einschließlich der Rückmeldung nach der Wahl und des Übergangs zum Bestellweg `/partner/` (10.4). Wo es von
ZA abweicht, steht **Festlegung 10** mit Begründung.

**Grundlage**

| Kürzel | Datei |
|---|---|
| PA | [01-projektanalyse.md](01-projektanalyse.md) |
| GM, CP | [bestand/geschaeftsmodell.md](bestand/geschaeftsmodell.md) (Pakete, Preise, Fristen: nur diese Fakten), [bestand/conversion-pfade.md](bestand/conversion-pfade.md) |
| RE | [03-recherche.md](03-recherche.md): Erkenntnisse E1–E19, Regeln R1–R14, Tests T1–T19 |
| PAK | [recherche/pakete-und-entscheidung.md](recherche/pakete-und-entscheidung.md): Beobachtungen B1–B8, Hypothesen PAK-H1 bis -H40, Quellen Q1–Q57 mit Status A/S/U |
| EA | [04-entscheidungsarchitektur.md](04-entscheidungsarchitektur.md): Z1, Z1a, Z1+; Zweifel F-nn; AB-n; O-n; H-D-n |
| EV | [07-expertenvergleich.md](07-expertenvergleich.md): Architektur E, Regeln E-1 bis E-13, H-E1 bis H-E10, E-AB-n, Testalternative C′ |
| ZA | [08-zielarchitektur.md](08-zielarchitektur.md): Abschnitte `fb-06` bis `fb-09`, `fb-15` |
| DG | [02-design-grammatik.md](02-design-grammatik.md): G1–G9, T7, Stufen 1–4, Dosierregeln, DG-AB-n, DG-E-n, DG-H-n |
| DNA, SG, B, VGL | `docs/design-dna/03-design-dna.md` (5.1 Formel, 5.2 Prinzipien Nr. 1–11, 5.4 Signature), `04-styleguide.md` (10.1–10.10; „SG 10.7/3“ = Abschnitt 10.7, Regel 3), `05-ergebnis-b-styleguide.md` (Bausteine B.3, Tokens B.5), `02-vergleich.md` |
| SKILL, DR, GEST | `.claude/skills/premium-gestaltung/SKILL.md` (Anforderungen des Inhabers), `…/designrichtung.md`, `docs/GESTALTUNG.md` (heutige Regeln, dürfen hinterfragt werden) |
| VK, PB | `web/fuer-fensterbauer/index.html`, `web/konfigurator-bedingungen/index.html` |

**Kennzeichnungen**

- `Datei:Zeile` ist ein Beleg im Repository. Quellen der Recherche tragen ihr Kennzeichen aus PAK: **[Empirisch]**,
  **[Forschungsbasierte Praxis]**, **[Branchenpraxis/Meinung]**, dazu den Prüfstatus A, S oder U.
- **[V]** verbindlich: Anforderung des Inhabers, DNA-Prinzip, Pflichtregel des Styleguides, Recht, Prüfsuite oder Regel aus RE 3.5.1.
  **[H]** Hypothese oder experimentelle Gestaltungsentscheidung, mit Rückfall; wird erst nach Prüfung zur Regel.
- **Textentwurf**: neuer Wortlaut, nur aus belegten Fakten gebildet; braucht die Freigabe des Inhabers. Wörtliche Bestandstexte tragen
  einen Beleg.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: Vorschlag gegen eine Regel aus GEST oder DR, gesammelt als
  J-AB-n in 10.4 H. Name, Wortmarke und Logo bleiben (GEST:7).
- Nummern dieses Kapitels: J-R-n (Regel), J-H-n (Hypothese), J-AB-n (Abweichung), J-O-n (offene Frage).
- Alle Pixellagen sind geplant, nicht gemessen. Telefon 390 × 844 ist die Hauptansicht (SKILL:28); geprüft wird zusätzlich die reale
  Höhe von ≈ 664 px (EV X9). Schriftgrößen nur 13, 15, 17, 24, 40, am Telefon 32 statt 40 (SKILL:69).

**Methode und Grenzen.** Simulierte Perspektiven (Inhaber eines kleinen Fensterbaubetriebs, Büro, B2B-Vertrieb) sind eine Analysemethode,
keine Nutzerstudie. Im Repository gibt es keine Nutzerforschung, keine Besucherzahlen, keine Verkäufe je Paket und keine Testergebnisse
(GM 4.3; PAK 0). Die Recherche stammt überwiegend aus Verbraucher-Experimenten und Befragungen größerer Unternehmen; die Übertragung auf
Fensterbaubetriebe ist eine Annahme (PAK 0, „Übertragbarkeit“). Dieses Kapitel nennt deshalb keine Wahrscheinlichkeiten und keine
erwarteten Steigerungen. Die Paketbestellung ist heute nicht geöffnet (Zustand A, `PAKETE_OFFEN` fehlt; docs/BESTELLUNG.md:50-57); jede
Spezifikation gilt für Zustand A (Anfrage) und Zustand B (Bestellung).

**Fakten, auf denen alles steht** (GM 3.1–3.3; `web/assets/pakete.js:15-17`, `:42-67`; PB):

| | EEZI Essential | EEZI Essential Plus | EEZI Signature |
|---|---|---|---|
| Monatspreis netto | 29 € | 39 € | 64 € |
| Einrichtung netto, einmalig, vorab | 99 € | 199 € | 279 € |
| Erstes Vertragsjahr netto (eigene Rechnung, keine Prognose) | 447 € | 667 € | 1.047 € |
| Gestaltung | eeziframes-Design mit Ihrem Namen | in Ihrem Design (Logo, Farbe, bis 6 Fotos, eigene Startseite) | wie Plus |
| Hinweis auf eeziframes in der App | „Powered by EEZIframes“ | kleiner Hinweis im Fuß | keiner |
| In Suchmaschinen | nein | Startseite | Startseite |
| Dashboard, Einladungslinks, Fortschritt, Zugänge | nicht enthalten | nicht enthalten | enthalten, 5 Zugänge |
| Aufbewahrung der Anfragen | 30 Tage nach Zustellung | 30 Tage nach Zustellung | Vertragsdauer |

Für alle drei: eigene Domain (Jahrespreis bis 25 € netto enthalten, PB:64), voller Konfigurator, jede Anfrage als Aufmaßblatt-PDF per
E-Mail; keine Gebühr je Anfrage (VK:237); Vertrag mit Eingang der Einrichtungsgebühr (PB:48); Monatsabo ab Livegang (PB:54); Vorschau und
Freigabe vor dem Livegang (PB:60); Storno bis zum Beginn der Einrichtung mit voller Erstattung, danach keine (PB:70); kündbar zum Ende des
laufenden Abrechnungsmonats, ohne Mindestlaufzeit (PB:69); Preise vorläufig, Preisstand 2026-10-22 (`web/assets/pakete.js:15-17`); nur für
Unternehmer nach § 14 BGB, netto zuzüglich Umsatzsteuer (PB:52); ob Umsatzsteuer ausgewiesen wird, ist offen (`MWST`, O-6). Einen
Einführungspreis für die Pakete gibt es nicht (GM 3.1).

---

## 10.1 Systematische Untersuchung

Jedes Thema in drei Schritten: **Belege** (Recherche mit Kennzeichen), **Bestand** (was die Seite heute tut), **Folgerung** (Regel [V] oder
Hypothese [H]). Wo keine Studie gefunden wurde, steht das ausdrücklich da.

### 10.1.1 Optimale Zahl gleichzeitig sichtbarer Angebote

- **Belege.** [Empirisch] Metaanalyse über 50 Experimente (N = 5.036): im Mittel praktisch kein Effekt der Auswahlgröße, große Streuung
  (Q2, A). [Empirisch] Spätere Metaanalyse: Überforderung tritt auf, wenn die Aufgabe schwierig, das Angebot komplex und die eigene
  Präferenz unklar ist (Q3, A; RE E8). [Branchenpraxis/Meinung] Zählungen von SaaS-Preisseiten: Median 3,5 Pläne, häufigster Wert 3
  (Q45, Q46). [Forschungsbasierte Praxis] Inhalte jenseits der ersten Karte eines Karussells werden wenig gesehen (Q56, A für den NN/g-Satz;
  RE E18).
- **Bestand.** Drei Pakete. Telefon: eine Karte voll, die Nachbarn schauen je 28 px herein (Karte `min(100vw − 80px, 380px)`, Abstand
  12 px; `web/assets/verkauf.css:89`); darunter eine Leiste nur mit den Kurznamen, ohne Preise (`functions/pakete-seite.js:129`).
  Schreibtisch: drei Karten nebeneinander.
- **Folgerung.**
  - **J-R1 [V]** Drei Pakete, keine vierte Stufe „auf Anfrage“ (PAK-H1; RE 3.4.3, „Anzahl“).
  - **J-R2 [V]** Am Telefon stehen alle drei Monatspreise gleichzeitig im Bild, bevor eine Karte gelesen ist, und genau eine Karte ist
    vom Namen bis zum Knopf vollständig sichtbar; die Nachbarn erscheinen nur als Anschnitt. Am Schreibtisch sind alle drei Karten bis zum
    Knopf in einem 800-px-Bildschirm (R9; EA S4; AB-11).
  - **J-H1 [H]** Wichtiger als die Zahl der Pakete ist die Zahl der Merkmale, die gleichzeitig abgewogen werden (Q3). Vor dem Knopf stehen
    je Karte höchstens vier Textbausteine (Satz, Preis mit Bindung, Einrichtung, Steuer); alles Weitere steht im Datenblatt unter dem
    Bild oder auf Abruf.

### 10.1.2 Reihenfolge der Pakete

- **Belege.** [Branchenpraxis/Meinung] 81 % der gezählten Preisseiten ordnen aufsteigend (Q45, Nenner unklar). [Empirisch] Absteigende
  Preise führen zu teureren Wahlen, wenn vom Preis auf Qualität geschlossen wird (Q1, A; Verbraucherexperiment). [Empirisch] Die mittlere
  Option gilt als beliebt und wird häufiger gewählt (Q13, A); kurz vor der Entscheidung bekommt sie mehr Blicke (Q14, A).
  [Empirisch] Voreinstellungen wirken im Mittel deutlich (d = 0,68), stärker, wenn sie als Empfehlung gelesen werden (Q15, A).
  [Forschungsbasierte Praxis] Der erste gesehene Preis setzt die Erwartung (Q32, A).
- **Bestand.** HTML und Schreibtisch aufsteigend (`web/assets/pakete.js:18`); die Prüfsuite erwartet genau diese Reihenfolge
  (`scripts/pruefen-instanzen/29.mjs:30`). Telefon: Die Reihe beginnt beim empfohlenen Paket (`data-start="1"`,
  `functions/pakete-seite.js:130`). Erster Preis der Seite ist künftig die Preiszeile „Ab 29 € im Monat“ im Startbild (ZA V1).
- **Folgerung.**
  - **J-R3 [V]** HTML-Reihenfolge und Schreibtisch aufsteigend: Essential, Essential Plus, Signature.
  - **J-R4 [V]** Telefon: Die Reihe beginnt an der empfohlenen Karte; die Namensleiste zeigt trotzdem die aufsteigende Ordnung (links
    Essential). Die Startposition wirkt wie eine Voreinstellung (Q15) und ist nur mit sichtbarem sachlichem Grund zulässig (J-R8).
  - Absteigende Reihenfolge (Q1) bleibt ein Test (RE T6); ohne Vergleichstests und Besucherzahlen ist er heute nicht durchführbar und wird
    nicht geplant.

### 10.1.3 Aufbau der Preiskarten

- **Belege.** [Empirisch] Kleine wiederkehrende Beträge werden mit kleinen laufenden Ausgaben verglichen (Q24, A): Der Monatspreis taugt
  als Hauptzahl. [Empirisch] Aufgeteilte Preise senken den erinnerten Gesamtpreis; versteckte Zuschläge verstärken das (Q18, A; Q19, A).
  [Empirisch] Freiwillige Kostentransparenz erhöht Vertrauen und Kaufbereitschaft (Q21, A). [Branchenpraxis/Meinung] § 5a UWG erfasst auch
  unklare oder verspätete Darstellung wesentlicher Informationen gegenüber Betrieben (Q51). [Forschungsbasierte Praxis] Gleiche Merkmale in
  gleicher Reihenfolge, klare Spaltenköpfe (Q34, Einzelregeln U).
- **Bestand.** Name, Satz, Monatspreis groß, „dazu … Einrichtung, einmalig vorab“, Steuerzeile, Leistungsliste mit gleichen Punkten zuerst
  (PAK B2), Knopf, Beispielseite (`functions/pakete-seite.js:109-127`). Was die Einrichtung enthält, steht nicht da (PAK B5); die
  Kündbarkeit steht nur in den Häufigen Fragen (PAK B3).
- **Folgerung.**
  - **J-R5 [V]** Alle drei Karten haben denselben Aufbau in derselben Reihenfolge: (1) Pille „Empfohlen“ nur an einer Karte, (2) Paketname,
    (3) ein Satz, für wen das Paket ist, (4) Monatspreis als Zahl mit „im Monat“, (5) „ab Livegang, monatlich kündbar“, (6) Einrichtung mit
    ihrem Inhalt, (7) Steuer und Zielgruppe, (8) Knopf, (9) Beispielbild, (10) Datenblatt mit vier gleichen Zeilen, (11) volle
    Leistungsliste auf Abruf. (4) bis (7) bilden einen Preisblock ohne Trennlinie (R1).
  - **J-H2 [H]** Die Zeile „ab Livegang, monatlich kündbar“ direkt unter dem Preis beantwortet die Zweifel F-06 („Wie lange bin ich
    gebunden?“) und „Wann zahle ich monatlich?“ am Ort der Entscheidung, ohne Anfragen zu senken.

### 10.1.4 Vergleichbarkeit

- **Belege.** [Forschungsbasierte Praxis] Vergleichstabellen eignen sich für wenige Angebote mit mehreren Merkmalen; entscheidend sind
  Einheitlichkeit, Überfliegbarkeit und einfacher Aufbau (Q34, A für das Video). [Forschungsbasierte Praxis] Beispiele typischer Fälle
  helfen mehr als Rechner (Q33, A). Eine Studie, die Gruppierung in Preisvergleichen misst, wurde nicht gefunden (PAK 5).
- **Bestand.** Schreibtisch: Zeilen der drei Karten über `subgrid` auf gleicher Höhe (`web/assets/verkauf.css:85-86`). Vergleich als
  `details`, 17 Zeilen ohne Gruppen, drei Zeilen „ja, ja, ja“, die Zahl 0 als „nein“ (PAK B4; `functions/pakete-seite.js:51`). Die
  Prüfsuite verlangt alle Merkmale mit `vergleich: true` als Zeilentitel und den Satz „Alle Preise netto zzgl. MwSt., nur für
  Unternehmer.“ (`scripts/pruefen-instanzen/29.mjs:31-33`).
- **Folgerung.**
  - **J-R6 [V]** Gleiche Einheiten und Wörter in allen Karten („€ im Monat“, „€ Einrichtung, einmalig vorab“); am Schreibtisch stehen
    Preise, Knöpfe, Bilder und Datenblatt der drei Karten auf je einer Höhe (Bestand `subgrid`); am Telefon übernimmt die Namensleiste den
    Preisvergleich über die Karten hinweg.
  - **J-R7 [V]** Der Vergleich behält jede Zeile, die die Prüfsuite verlangt, wird aber gruppiert: „Kosten“, „In allen Paketen“ (die drei
    gleichen Zeilen mit einer gemeinsamen Zelle „in allen drei“), „Ihre Marke“, „Gefunden werden“, „Für Ihr Team“, „Daten“; „nicht
    enthalten“ statt „nein“ bei Zahlen; am Telefon fester Kopf aus drei Kurznamen, kein Querscrollen (R9; PAK-H10, -H12, -H13; AB-6).
  - **J-H3 [H]** Der gruppierte Vergleich wird am Telefon schneller und richtiger gelesen (RE T7).
  - **J-H4 [H]** Eine Zeile „Im ersten Jahr, netto (Einrichtung und 12 Monate)“ mit 447 / 667 / 1.047 € im Vergleich, nicht auf der Karte,
    senkt Rückfragen zu Kosten (Q21, Q43) – Gegenhypothese: senkt Anfragen (Q20, Feldexperiment im Ticketverkauf, Prozentwerte S). Bis
    zur Freigabe des Inhabers (J-O-11) ist die Zeile vorgesehen, aber abschaltbar.

### 10.1.5 Visuelle Dominanz

- **Belege.** [Empirisch] Mitte- und Kompromisseffekt (Q4, A; Q13, A; Q14, A). [Empirisch] Wirksam ist die Beliebtheitsinformation, nicht
  die Markierung an sich (Q17, A). [Empirisch] Empfehlungsschilder können die Erwägungsmenge vergrößern und die Wahl erschweren (Q16, U).
  RE E2, E3: zusätzliche Blickziele kosten Aufmerksamkeit. DNA Nr. 10: kein Licht als Flächenmittel der Bedienschicht; SG 10.7/3: keine
  Skalierung auf Zwischengrößen.
- **Bestand.** Plus mit 2-px-Ring in Cream, Pille „Empfohlen“ auf dem Rand, einzigem Cream-Knopf und grünem Schein
  (`web/assets/verkauf.css:23-24`); die Nachbarkarten am Telefon werden bis 5 % kleiner und blasser (`web/assets/verkauf.css:91`).
  Empfohlen ist Plus, weil es in der Mitte steht (`functions/pakete-seite.js:32-33`; PAK B1).
- **Folgerung.**
  - **J-R8 [V]** Genau eine Karte trägt die Hervorhebung, über drei gekoppelte Signale: 2-px-Ring in Cream, Kontur-Pille „Empfohlen“
    (Cream-Schrift 13, ohne Füllung), einziger Cream-Knopf. Kein Schein (AB-5), keine größere Karte, keine Skalierung der Nachbarn, kein
    Auftritt. Die Empfehlung steht nie ohne sachlichen Satz (Satz (3) der Karte, J-R5). „Beliebt“ erst mit gezählten Bestellungen
    (SKILL:49).
  - **J-R9 [V] Gleiche Bildqualität.** Die drei Beispielbilder zeigen denselben Beispielbetrieb, denselben Ausschnitt, dieselbe
    Belichtung. Kein Paket wird durch schwächere Bilder herabgesetzt (R7; Ehrlichkeit nach SKILL:49).
  - Welches Paket empfohlen wird, entscheidet der Inhaber (O-5). Grundfassung: Plus, wie im Bestand. Wird Signature empfohlen, beginnt die
    Reihe am Telefon rechts außen; dann schaut nur Plus von links herein, und der Mitte-Effekt (Q13) entfällt (PAK-H5).

### 10.1.6 Darstellung der Unterschiede

- **Belege.** Für eine Zeile mit der Preisdifferenz zum Nachbarpaket wurde keine Studie gefunden (PAK-H9). [Empirisch] Lockvogeleffekte
  verschwinden meist, wenn Optionen realistisch beschrieben oder mit Bildern gezeigt werden (Q7, A; Q8, A; Gegenposition Q9, A): Bilder
  machen die Wahl sachlicher. SKILL:29 „Bild statt Text“; SKILL:121-122 „Pakete am Telefon zum Wischen mit einem Beispielbild darunter, das
  sichtbar mitwischt“. Der Unterschied laut Bestand: „wie sehr der Konfigurator Ihre Marke trägt, und Signature hat zusätzlich ein
  Dashboard mit persönlichen Einladungslinks“ (VK:236).
- **Bestand.** Satz je Karte aus den Merkmalen (`functions/pakete-seite.js:59-63`), Liste mit den gleichen drei Punkten zuerst
  (`:65-82`), Skizze der Beispielseite ohne Text (`:99-104`), Bilder fehlen (`BEISPIEL_BILD`, `:96`).
- **Folgerung.**
  - **J-R10 [V]** Unterschiede auf zwei Achsen. Achse Marke: dieselbe Startansicht des Konfigurators in drei Stufen als Beispielbild, dazu
    die Datenblattzeilen „Gestaltung“, „Hinweis auf eeziframes“, „In Suchmaschinen“. Achse Team: die Zeile „Für Ihr Team“ steht in allen
    drei Karten, bei Essential und Plus mit „nicht enthalten“, bei Signature mit „Dashboard, Einladungslinks, 5 Zugänge“ (E-6; durch die
    gleiche Zeile wird der Unterschied sichtbar, ohne Sondergestaltung). Das Gemeinsame steht einmal im Lead (PAK B2).
  - **J-R11 [V]** In der vollen Leistungsliste stehen die Unterschiede zuerst, das Gemeinsame zuletzt (Umstellung in `punkte()`,
    `functions/pakete-seite.js:65-82`).
  - **J-H5 [H]** Eine Unterschiedszeile mit beiden Differenzen („Gegenüber Essential: +10 € im Monat, +100 € einmalig“) erhöht den Anteil
    höherer Pakete (RE T5). Nur mit beiden Beträgen ehrlich; als Variante, nicht in der Grundfassung (**Festlegung 10-2**, 10.4 B).

### 10.1.7 Position und Gestaltung der Auswahlknöpfe

- **Belege.** RE E18: Am Telefon zählen Daumenreichweite, Zielgrößen und sichtbare Alternativen zum Wischen; WCAG 2.5.8 (Ziele ≥ 24 px,
  Inhaber 44 px, SKILL:71). [Empirisch] 61 % bzw. 67 % der befragten B2B-Käufer bevorzugen einen Kauf ohne Vertrieb (Q36, A; Q37, A).
  B.3.7: eine Hauptaktion, Pille mit Pfeilkreis, keine Skalierung beim Drücken.
- **Bestand.** Knopf nach der Steuerzeile, volle Kartenbreite, Cream nur an der empfohlenen Karte, Beschriftung mit Kurzname und Verb
  („Essential Plus anfragen“ bzw. „… bestellen“, `functions/pakete-seite.js:113-115`). Der Pfeilkreis steht nur am Formularknopf
  (`:186`), GEST:399 verlangt ihn an Cream-Pillen.
- **Folgerung.**
  - **J-R12 [V]** Der Knopf steht unmittelbar unter dem Preisblock, nie über ihm und nie erst nach dem Bild; volle Kartenbreite, 52 px
    hoch; Beschriftung nennt Paket und Handlung; Cream mit Pfeilkreis nur einmal je Bildschirm, sonst Ring mit 2-px-Kontur. Am Telefon liegt
    er bei y ≈ 599–651, im unteren mittleren Daumenbereich. Keine klebende Kaufleiste (EV 7.5.5).
  - **J-H6 [H]** In Zustand B senkt ein Satz unter dem Knopf („Erst Ihre Angaben, bezahlt wird im letzten Schritt.“, **Textentwurf** aus
    `web/assets/partner.js:161-175`, `:296-300`) die Scheu vor dem Wort „bestellen“.

### 10.1.8 Transparenz bei Preisen und Bedingungen

- **Belege.** [Empirisch] Aufgeteilte Preise wirken günstiger, Verstecken verstärkt das (Q18, Q19); freiwillige Transparenz schafft
  Vertrauen (Q21); Reue nach Softwarekäufen wegen höherer Gesamtkosten als erwartet (Q43, Gründe S); frühe Gebührenanzeige senkte im
  Ticketverkauf Käufe (Q20, Gegenbefund). [Branchenpraxis/Meinung] PAngV regelt Preise gegenüber Verbrauchern (Q50); BGH I ZR 99/08:
  Endpreise auch bei Werbung an die Allgemeinheit, wenn Verbraucher nicht wirksam ausgeschlossen sind (Q49, Auslegung S); die
  Verbraucherregeln zu Laufzeit und Kündigungsknopf betreffen Verbraucherverträge (Q53, B2B-Abgrenzung U). Keine Rechtsberatung.
- **Bestand.** Einrichtung auf jeder Karte, kleiner als der Monatspreis und ohne Inhalt (PAK B5); „netto zzgl. MwSt. · nur für
  Unternehmer“ 13 px; „Vorläufige Preise“ als Kasten über den Karten, größer wirkend als die Preise (PA 1.8; GEST:453); Widerspruch
  zwischen „bleibt für Ihren Vertrag fest“ (`functions/pakete-seite.js:89`) und dem Änderungsvorbehalt mit sechs Wochen Ankündigung (PB:55;
  PAK B6, O-7). Brutto erscheint erst in Schritt 6 des Bestellformulars und nur, wenn `MWST` gesetzt ist (`web/assets/partner.js:289`).
- **Folgerung.**
  - **J-R13 [V] Einrichtung.** Auf jeder Karte im Preisblock in 15 px, mit ihrem Inhalt in einem Satz nur aus PB:58-64 (R1): „Anruf,
    Domain, Gestaltung, Vorschau“.
  - **J-R14 [V] Monatspreis.** Hauptzahl der Karte, 32 px am Telefon, 40 px am Schreibtisch, Ziffern gleich breit; „im Monat“ 15 px
    `--muted` (Q24; DR 3.2 „Zahl als Held“).
  - **J-R15 [V] Laufzeit.** „ab Livegang, monatlich kündbar“ an jedem Preis; der genaue Wortlaut „zum Ende des laufenden
    Abrechnungsmonats“ (PB:69) steht im Festblock, sobald O-7 entschieden ist; bis dahin „Monatlich kündbar, ohne Mindestlaufzeit“ (VK:243).
  - **J-R16 [V] Fristen.** Am Ort der Entscheidung nur die Fristen, die die Entscheidung betreffen: Vertrag ab Zahlung, Abo ab Livegang,
    Storno-Grenze. Kulanz, Pause, Löschung, Domain nach Vertragsende und Aufbewahrung stehen im Vergleich (Zeile „Aufbewahrung“), in den
    Häufigen Fragen und in den Paketbedingungen (Informationsmenge, J-H1). „Meist 3 bis 5 Werktage“ bleibt im Ablauf (ZA 06.1).
  - **J-R17 [V] Netto, brutto.** Netto bleibt Hauptangabe mit „zzgl. MwSt.“ (Prüfsuite 29.1); nach der Entscheidung zu O-6 „zzgl. 19 % MwSt.“
    oder der Satz nach § 19 UStG (`functions/pakete-seite.js:44`). Brutto steht vor der Zahlung in der Bestellübersicht (Bestand). Ob
    Nettopreise in der Einbettung auf `/` genügen, prüft ein Anwalt (O-25).
  - **J-R18 [V] Verkaufsstand.** Ein Satz unter der Reihe, kleiner als jeder Preis (AB-4): **Textentwurf** „Vorläufige Preise, Stand
    22.10.2026. Es gilt der Preis, den Sie beim Bestellen sehen.“ (`web/assets/pakete.js:15-17`; PB:52). Die Zusage „bleibt für Ihren
    Vertrag fest“ entfällt, bis O-7 sie bestätigt; sonst stünde sie gegen PB:55.

### 10.1.9 Vergleichs- und Beratungselemente

- **Belege.** [Empirisch] B2B-Käufer bevorzugen Selbstbedienung (Q36, Q37), berichten dabei aber häufiger hohe Reue (43 % gegenüber 26 %,
  Q35, A); Rat suchen sie für Passungsfragen (Q36). [Branchenpraxis/Meinung] Produktdemos gehören zu den meistgenutzten Quellen (Q41);
  Herstellerdaten zu Demos (Q44) mit Auswahleffekt. [Empirisch] Unklare Präferenz verstärkt Überforderung (Q3).
- **Bestand.** Vergleich zugeklappt unter den Karten; Formular erst nach Ablauf und Demos (PAK B8); kein Gesprächsweg bei den Paketen;
  Demos vorbereitet, aber nicht verlinkt (`functions/pakete-seite.js:165-172`).
- **Folgerung.**
  - **J-R19 [V]** Der Vergleich steht direkt unter der Reihe als eine 52-px-Zeile „Alle Merkmale im Vergleich“ (Bestand), zugeklappt.
  - **J-R20 [V]** Direkt unter dem Festblock ein leiser Gesprächsweg als Ring zum vorhandenen Formular mit Paket „Noch offen“ (H-D14; RE T9;
    `functions/pakete-seite.js:174`). Selbstkauf bleibt der Hauptweg (PAK-H27).
  - **J-H7 [H]** Mit `PAKETE_DEMOS=1` steht je Karte ein Textlink „Demo ansehen“ in die Demo-Instanz (RE T11; R14 – vorher nicht).
  - Ein Paketberater mit Fragen ist Konzept P4 (10.2) und bleibt Testalternative (EV 7.6.1, C′), nicht Grundfassung.

### 10.1.10 Informationen direkt vor der Entscheidung

- **Belege.** RE E11: spät aufgedeckte Kosten schaden; RE E12: Risiko senken mit belegten Vertragsfakten, nicht mit erfundenen Garantien.
  [Empirisch] Geld-zurück-Garantien wirken (Q26, A), eine solche Zusage gibt es aber nicht (PB:70). EA 4.3.1/1: Was in Schritt 6 der
  Bestellung zum ersten Mal auftaucht, wirkt wie eine verspätete Bedingung.
- **Bestand.** Risikofakten verteilt auf Häufige Fragen, Ablauf und Bedingungen (PAK B3).
- **Folgerung.**
  - **J-R21 [V]** Vor dem Knopf auf der Karte: Monatspreis, ab wann und wie kündbar, Einrichtung mit Inhalt, Steuer und Zielgruppe.
    Unmittelbar nach der Reihe: Verkaufsstand, Vergleich, **Festblock** mit den fünf belegten Fakten und der ehrlichen Grenze (R8), Link
    „Paketbedingungen mit AV-Vertrag“. Nichts darüber hinaus, keine neue Garantie (R7).
  - **J-R22 [V]** Was das Bestellformular verlangt (Angaben fürs Impressum, Wunsch-Domain, bis drei Empfängeradressen, bei Plus und
    Signature Logo und Fotos, nachreichbar) steht in Zustand B vor dem Wechsel ins Kundenkonto (EA 4.3.1 **Textentwurf**, ZA 05); in
    Zustand A ist es nicht nötig.

### 10.1.11 Visuelles Feedback nach der Auswahl

- **Belege.** [Empirisch] Sichtbar gemachte Arbeit des Anbieters erhöht den wahrgenommenen Wert (Q22, S); sichere Käufer berichten häufiger
  von einem guten Abschluss (Q37, A); Reue hängt an Kosten- und Einführungsüberraschungen (Q43, S). Gegenbefund: Fortschrittsanzeigen
  senken Abbrüche im Mittel nicht (Q54, A).
- **Bestand.** Ein Tipp auf „… anfragen“ springt zu `#bestellen` und setzt das Paket im Formular, ohne sichtbare Bestätigung
  (`web/assets/verkauf.js:25-35`). In Zustand B öffnet `/partner/#bestellen/<paket>` das Formular bei Schritt 1 mit dem vorgewählten
  Paket (`web/assets/partner.js:612-616`); Schritt 6 fasst Paket, Einrichtung „netto, einmalig, vorab“ und „monatlich, ab dem Livegang“
  zusammen (`:278`).
- **Folgerung.**
  - **J-R23 [V]** „Gewählt“ heißt: auf einen Kartenknopf getippt (E-3). Die Wahl wird sofort sichtbar bestätigt: Zustand der Taste
    (150 ms), dann am Ziel eine Auswahlzeile mit Paket und Preisen über dem Formular, das Paket im Feld gesetzt, Fokus auf die Überschrift
    des Formulars, Ansage über `aria-live`. Kein Konfetti, kein Haken-Bewegtbild bei der Wahl; der Haken gehört zum Dank nach dem Senden
    (ZA 05).
  - **J-H8 [H]** Nach der Wahl trägt das gewählte Paket den Cream-Knopf auch in der Kartenreihe und im Abschluss (J-AB-8).
  - **J-H9 [H]** In Zustand B bestätigt Schritt 1 im Kundenkonto die Wahl mit Zahlen („Heute fällig …, ab Livegang …“) statt sie erneut
    abzufragen (PAK-H38, -H40; RE T13).

### 10.1.12 Navigation zum nächsten Schritt

- **Belege.** RE E17: wenige Felder, keine doppelte Eingabe. CP 5.4, „Hürden“: Medienbrüche, Paket doppelt wählen, langes Formular vor der
  Zahlung, spät erkannt, dass nicht bestellt werden kann. [Empirisch] Schnell beginnende Fortschrittsanzeigen senkten Abbrüche (Q54).
- **Bestand.** Zustand A: Sprung zum Formular auf derselben Seite (heute vier Abschnitte weiter unten); Zustand B: eigene Oberfläche
  `/partner/` mit eigenem Kopf und sechs Schritten (CP 5.2).
- **Folgerung.**
  - **J-R24 [V]** Ein Ziel je Zustand. A: `#frage` auf derselben Seite, das Formular folgt direkt nach dem Kapitel (ZA 05), der Weg ist auch
    ohne Sprung kurz. B: `/partner/#bestellen/<paket>` im selben Tab. Kein Rücklink nach oben in der Entscheidungsfläche (E-4).
  - **J-H10 [H]** Ein Seitenübergang mit Überblendung, bei dem das gewählte Beispielbild als einziges gemeinsames Element in Schritt 1 des
    Kundenkontos gleitet, macht den Medienbruch zu einer Fortsetzung (SG 10.7, „Übergänge“: nur der Fokusträger darf gleiten).

---

## 10.2 Vier Konzepte für die Entscheidungssituation

Alle vier gelten nur für Kapitel 04 bis zum Übergang ins Formular bzw. ins Kundenkonto; Startbild, Kapitel 01 bis 03 und 05 bis Fuß bleiben
wie in ZA. Alle vier halten J-R1, J-R3, J-R8, J-R9 und die Ehrlichkeitsregeln. Für jedes Konzept sind Lagen am Telefon nach dem Sprung von
„Pakete ansehen“ angegeben (Kopf 56 px klebt; Kapitelanfang bei y = 72). Raster: Telefon 4 Spalten zu 77,5 px mit 16 px Abstand in
358 px Inhaltsbreite; Schreibtisch 12 Spalten zu 64,67 px mit 24 px Abstand in 1040 px (DG G6; SG 10.9).

### 10.2.1 Konzept P1 „Wischreihe mit Markenbild“

**Leitidee.** Drei gleich gebaute Karten; jede trägt unter ihrem Preisblock dieselbe Startansicht des Konfigurators in ihrer Markenstufe.
Am Telefon wischt man durch die Pakete, das Bild wischt mit und läuft physikalisch nach. Weiterentwicklung des Bestands und von ZA `fb-06`.

| Aspekt | Telefon 390 × 844 | Schreibtisch 1280 × 800 |
|---|---|---|
| Ebenen | 0 Grund `#161616` → 20 Beispielbild im Browserrahmen (Bildschicht) → 30 Karte `#1f1f1f` mit 2-px-Ring, Text, Knopf, Namensleiste → 40 Kopf | gleich |
| Proportionen | Kopfzone y 72–239 (Kapitelzeile, h2 32, Lead 3 Zeilen); Namensleiste 358 × 52 bei y 255–307; Karte 310 × 877 (in `fb-06` gemessen, Designsystem K-38); Preisblock und Knopf bis y 651; Bild 306 × 254 ab y 667 (≈ 29 % der Kartenhöhe, volle Kartenbreite) | h2 Spalten 1–4, Lead Spalten 5–12 auf derselben Höhe; drei Karten zu 4 Spalten (330,7 px); Knopf bis y 534; Bilder 282,7 × 236 bei y 558–794 |
| Kartengrößen | alle gleich breit; Nachbarn schauen 28 px herein, nur über Deckkraft zurückgenommen (0,66) | alle gleich breit und hoch (`subgrid`) |
| Hervorhebung | Plus: Cream-Ring, Kontur-Pille „Empfohlen“, einziger Cream-Knopf; Reihe beginnt dort | gleich; Mitte der Reihe |
| Vergleich | Namensleiste mit allen drei Preisen; Datenblatt mit vier gleichen Zeilen je Karte; Vergleich zugeklappt darunter | Zeilen auf gleicher Höhe; Vergleich darunter über 12 Spalten |
| Knöpfe | unter dem Preisblock, 270 × 52 | unter dem Preisblock, 282,7 × 52 |
| Rückmeldung | Taste 150 ms; Sprung zum Formular mit Auswahlzeile (A) bzw. Seitenwechsel (B) | gleich |
| Übergang `/partner/` | Überblendung, Beispielbild als gemeinsames Element [H] | gleich |
| DNA | Stufe 2, Dialekt C; ein Bildträger je Karte; Verdeckung über Pille auf dem Rand, Etikett im Browserrahmen, Anschnitt der Nachbarn; eine informierende Signature (Annotation am Bild); Physik nur im Bild | gleich, ohne Wischen |

**Stärken.** Erfüllt den ausdrücklichen Wunsch des Inhabers (Wischen, Bild darunter, das mitwischt; SKILL:121-122); alle Preise sichtbar;
gleiche Struktur macht Unterschiede lesbar; robust ohne JavaScript (Karten sind Artikel mit Preisen, Prüfsuite 29.1). **Schwächen.** Am
Telefon steht immer nur ein Bild voll im Bild, der Bildvergleich ist nacheinander; das Bild ist mit 306 × 254 kleiner als in P2; Karten
werden mit Datenblatt lang (≈ 1 BH).

### 10.2.2 Konzept P2 „Eine Startansicht, drei Stufen“

**Leitidee.** Ein großes Gerät mit der Startansicht ist der einzige Held. Darunter eine Stufenwahl aus drei Segmenten; die Wahl wechselt die
Markenstufe im Bild und den Inhalt einer Detailtafel. Der Unterschied der Pakete ist ein Zustand derselben Ansicht (Leitidee von D,
gemeinsame Vorschau D-AB-2, die EV nur als Variante führte).

| Aspekt | Telefon 390 × 844 | Schreibtisch 1280 × 800 |
|---|---|---|
| Ebenen | 0 Grund → 20 Browserrahmen 358 × 244 mit Startansicht (Bildschicht) → 30 Stufenwahl überdeckt die Unterkante des Rahmens um 16 px (Verdeckung), Detailtafel → 40 Kopf | 0 Grund → 20 Rahmen links → 30 Wahlzeilen und Tafel rechts |
| Proportionen | Kopfzone y 72–213 (Lead 2 Zeilen); Rahmen y 229–473 (29 % der Höhe); Stufenwahl 358 × 64 bei y 457–521 (drei Segmente 116 × 64: Kurzname 13, Preis 15); Tafel ab y 537: Satz, Preis 32, Bindung, Einrichtung, Steuer, Knopf bis y ≈ 829 | Rahmen Spalten 1–7 (≈ 608 × 456, Bild 57 % der Spaltenbreite); rechts Spalten 8–12: drei Wahlzeilen je 408 × 88, darunter Einrichtung, Steuer, Knopf |
| Kartengrößen | keine Karten; eine Tafel 358 breit | drei gleich große Wahlzeilen |
| Hervorhebung | Startzustand = empfohlenes Segment; Pille „Empfohlen“ über dem Segment; der Knopf ist immer Cream und trägt das aktive Paket | gleich |
| Vergleich | Preise in der Stufenwahl; Merkmale nur des aktiven Pakets; Vergleich zugeklappt darunter | Wahlzeilen zeigen Satz und Preis aller drei |
| Knöpfe | ein Knopf in der Tafel, y ≈ 777–829 (bei 664 nicht im Bild) | ein Knopf unter den Wahlzeilen |
| Rückmeldung | Segment aktiv über Füllung; Bild wechselt per Überblendung 500 ms, Tafeltext per Deckkraft 160 ms; Wahl wie P1 | gleich |
| Übergang `/partner/` | wie P1 | wie P1 |
| DNA | idealer „ein Fokusträger“; Szenenwechsel im Motiv 500 ms; Bedienschicht flach | gleich |

**Stärken.** Größtes Bild, Markenunterschied am deutlichsten; genau ein Held; kurz (≈ 1,1 BH). **Schwächen.** Merkmale nur nacheinander
vergleichbar (Q34); „aktiv“ (angesehen) und „gewählt“ (getippt) sind leicht zu verwechseln (E-3); weicht vom Wunsch „Wischen mit Bild
darunter“ ab; Knopf bei 664 px nicht im ersten Bildschirm; Signature braucht ein zweites Bildmotiv (Dashboard), die Bühne wechselt dann die
Art des Inhalts; ohne JavaScript eine andere Komposition (drei Blöcke untereinander).

### 10.2.3 Konzept P3 „Gegenüberstellung“

**Leitidee.** Die Vergleichstabelle ist die Entscheidungsfläche: drei Spalten mit kleinem Bild, Preis und Knopf im Kopf, darunter die
gruppierten Unterschiede. Klassische Preistabelle, auf Telefon übersetzt.

| Aspekt | Telefon 390 × 844 | Schreibtisch 1280 × 800 |
|---|---|---|
| Ebenen | 0 Grund → 20 drei Miniaturen → 30 Tabelle, Kopf klebt unter dem Seitenkopf → 40 Kopf | 0 Grund → 20 Miniaturen im Tabellenkopf → 30 Tabelle |
| Proportionen | Tabellenkopf y 255–447: drei Spalten 114 breit (Abstand 8), Miniatur 114 × 86, Kurzname 13, Preis 24, „im Monat“ 13; dann Gruppen: Gruppenzeile 13 über die volle Breite, je Merkmal eine Beschriftung 15 über die volle Breite und darunter drei Zellen 114 breit | Beschriftungsspalte Spalten 1–3, Pakete Spalten 4–6, 7–9, 10–12; Kopf mit Bild 236 × 177, Preis 40, Knopf |
| Kartengrößen | Spalten gleich breit | Spalten gleich breit |
| Hervorhebung | Plus-Spalte mit 2-px-Cream-Rahmen vom Kopf bis zum Ende, Pille oben, Cream-Knopf | gleich |
| Vergleich | maximal: jede Zeile direkt nebeneinander | maximal |
| Knöpfe | drei Knöpfe 114 × 52 am Tabellenende („Anfragen“, mit `aria-label` des Pakets), im klebenden Kopf nur Preise | Knöpfe im Tabellenkopf |
| Rückmeldung | wie P1 | wie P1 |
| Übergang `/partner/` | wie P1 | wie P1 |
| DNA | Hauptelement am Telefon textlich (gegen G4), Tabellenfeld ohne Anker (SG 10.10 Nr. 11 als Risiko) | Tabelle als Kachelraster |

**Stärken.** Höchste Vergleichbarkeit und Transparenz; echte `<table>`, ohne JavaScript vollständig; geringster Aufwand. **Schwächen.**
Der eigentliche Unterschied der Pakete (wie sehr der Konfigurator die Marke trägt) erscheint nur als Miniatur von 114 × 86; textlastig
(SKILL:29) mit Gefahr des „Baukasten-Musters“ (SKILL:38); Knöpfe erst am Tabellenende; kein Wischen mit Bild (SKILL:121-122).

### 10.2.4 Konzept P4 „Zwei Fragen, eine Antwort“

**Leitidee.** Vor den Karten zwei freiwillige Fragen; die Antwort zeigt das passende Paket in einer Antwortbühne und immer auch die nächste
Stufe mit Preisdifferenz. Entspricht dem Paketberater der Testalternative C′ (EV 7.6.1) mit seiner eindeutigen Zuordnung von 12
Kombinationen.

| Aspekt | Telefon 390 × 844 | Schreibtisch 1280 × 800 |
|---|---|---|
| Ebenen | 0 Grund → 20 Antwortbühne mit Startansicht → 30 Fragen als Antwortzeilen, Ergebniskarte, Kartenreihe aus P1 darunter → 40 Kopf | Fragen links, Bühne rechts |
| Proportionen | Kopfzone y 72–213; Textlink „Direkt zu den Karten“ 44 px; Frage 1 (17 fett) mit vier Antwortzeilen 358 × 52 (y ≈ 270–510); Frage 2 erscheint darunter (drei Zeilen); Antwortbühne 358 × 300 (≥ 35 % des Bildschirms, X1) erst nach beiden Antworten, also im dritten Bildschirm des Kapitels | Fragen Spalten 1–5, Bühne Spalten 7–12 (≈ 504 × 378) |
| Kartengrößen | Ergebniskarte 358 breit; Kartenreihe wie P1 darunter | Ergebniskarte unter der Bühne, Reihe darunter |
| Hervorhebung | „Passt zu Ihren Antworten“ statt „Empfohlen“ am Ergebnis; „Empfohlen“ bleibt an Plus in der Reihe (zwei Arten von Empfehlung) | gleich |
| Vergleich | Zeile „Eine Stufe höher: …, +25 € im Monat, +80 € einmalig“; Reihe mit allen Preisen darunter | gleich |
| Knöpfe | Antwortzeilen mit `aria-pressed`; Cream am Ergebnis | gleich |
| Rückmeldung | nächste Frage erscheint über Deckkraft 320 ms, `aria-live="polite"`; Wahl wie P1 | gleich |
| Übergang `/partner/` | wie P1 | wie P1 |
| DNA | zweiter Mechanismus neben dem Bild (EV 7.5.5); Antwortbühne als Held | gleich |

**Stärken.** Beantwortet F-23 („Welches Paket brauche ich?“) direkt; der Grund entsteht aus den eigenen Antworten (Q4); zeigt immer die
nächste Stufe (SKILL:50). **Schwächen.** Zwei Entscheidungen vor der eigentlichen Entscheidung; Preis und Knopf des Ergebnisses erst nach
zwei Antworten (+1 bis 1,5 BH); Fragebogen-Anmutung (EV 7.4, Punkt 5); ohne JavaScript nur die Reihe; die Zuordnungslogik muss mit
`web/assets/pakete.js` gepflegt werden.

---

## 10.3 Bewertung der Konzepte

**Kriterien und Gewichte.** Gewichtet ist nach der Aufgabe der Fläche (Paketwahl treffen, ohne Reue), nicht nach vermuteter Klickrate. Die
Ehrlichkeit ist ein Ausschlusskriterium: Alle vier bestehen es nur, wenn sie wie beschrieben gebaut werden (P4 nur mit benannter
Empfehlung bei „Weiß ich noch nicht“ und mit der Zeile zur nächsten Stufe).

| Nr. | Kriterium | Gewicht | Woran gemessen |
|---|---|:-:|---|
| Kr1 | Passung zum tatsächlichen Angebot | 3 | ein Konfigurator, Unterschied = Markenstufe plus Team-Achse (VK:236), drei feste Preise |
| Kr2 | Vergleichbarkeit und Preistransparenz | 3 | alle Preise, Einrichtung, Bindung, Steuer ohne Wischen oder Umschalten; gleiche Struktur (Q34; R1, R9) |
| Kr3 | vermutete Informationsbedürfnisse | 3 | Antworten auf F-05, F-06, F-23, F-24, F-25 am Ort der Entscheidung (EA 4.6.1) |
| Kr4 | Anforderungen des Inhabers | 3 | Telefon zuerst, Wischen mit mitwischendem Bild darunter, kurze Texte, eine Cream-Pille, zum höheren Paket hinführen (SKILL) |
| Kr5 | Passung zu DNA und Grammatik | 2 | ein Held, flache Bedienschicht, Stufe 2 ohne inszenierende Signature, Verdeckung, Negativraum (DNA 5.2; DG T7) |
| Kr6 | Ruhe und Aufmerksamkeit | 2 | eine Handlung je Bildschirm, wenige Blickziele, kein Umweg vor Preis und Knopf (RE E2, E3) |
| Kr7 | Robustheit | 2 | Zustand A und B, ohne JavaScript, ruhige Fassung, Einbettung, Prüfsuite 29 |
| Kr8 | Aufwand, Material, Leistung | 1 | neue Bausteine, fehlendes Material, Risiko für LCP und INP |

**Matrix (subjektive Einschätzung auf einer Skala 1–5, keine Messung).**

| Kriterium (Gewicht) | P1 Wischreihe | P2 Eine Startansicht | P3 Gegenüberstellung | P4 Zwei Fragen |
|---|:-:|:-:|:-:|:-:|
| Kr1 Angebot (3) | 4 | 5 | 2 | 4 |
| Kr2 Vergleichbarkeit (3) | 4 | 3 | 5 | 3 |
| Kr3 Informationsbedürfnisse (3) | 4 | 3 | 4 | 5 |
| Kr4 Inhaber (3) | 5 | 2 | 2 | 3 |
| Kr5 DNA (2) | 4 | 5 | 2 | 3 |
| Kr6 Ruhe (2) | 4 | 5 | 3 | 2 |
| Kr7 Robustheit (2) | 5 | 3 | 5 | 2 |
| Kr8 Aufwand (1) | 4 | 3 | 5 | 2 |
| **Summe gewichtet (Höchstwert 95)** | **81** | **68** | **64** | **61** |

**Empfindlichkeit.** Ohne Kr4 (damit P1 nicht nur wegen der Vorlieben des Inhabers vorn liegt; Höchstwert 80): P1 66, P2 62, P3 58,
P4 52. Mit doppeltem Gewicht für Kr2: P1 93, P3 79, P2 77, P4 70. P1 bleibt in beiden Fällen vorn; welches Konzept Zweiter ist, hängt an
der Gewichtung.

**Begründung, sachlich statt nach Klickrate**

- **P1** trifft das Angebot gut: Der Unterschied ist sichtbar (Bild) und benannt (Datenblatt), alle Preise stehen beieinander, und die
  Komposition ist ohne JavaScript dieselbe Liste von Artikeln. Sie ist die einzige, die den ausdrücklichen Wunsch des Inhabers ohne Umdeutung
  erfüllt (SKILL:121-122; SKILL:21-22 „Nicht zu viel interpretieren“).
- **P2** zeigt den Markenunterschied am stärksten, verlangt aber Vergleich aus dem Gedächtnis (nur ein Paket gleichzeitig im Detail) und
  ersetzt das Wischen durch eine Segmentwahl. Das wäre eine größere eigene Idee, die nach SKILL:27 vorzuschlagen, nicht zu bauen wäre.
- **P3** maximiert Transparenz, macht aber das Merkmal, das die Pakete wirklich trennt, zur Miniatur. Ein Fensterbauer sähe eine Liste von
  „ja/nein“, nicht seinen Konfigurator in drei Stufen. Das Risiko, wie „Technik von 2015“ zu wirken (SKILL:38), ist am höchsten.
- **P4** mag mehr Interaktion erzeugen, Interaktion ist aber nicht Entscheidungsqualität: Zwei Fragen schieben Preis und Knopf nach unten
  und erzeugen eine zweite Art von Empfehlung. Ob sie bei unsicherer Präferenz trotzdem hilft, klärt der vorgesehene Test E gegen C′
  (EV 7.6.3), nicht diese Phase.

**Was P1 von den anderen übernimmt**

| Element | aus | Ort in P1 |
|---|---|---|
| Gruppierter Vergleich mit Gruppe „In allen Paketen“, klebender Kopf aus drei Kurznamen | P3 | `fb-07` unter der Reihe (J-R7) |
| Eine Startansicht in drei Stufen: gleicher Beispielbetrieb, gleicher Ausschnitt, gleiche Belichtung | P2 | Beispielbilder (J-R9) |
| „Wenn“-Satz je Karte als statische Entscheidungshilfe; Weg mit „Noch offen“ | P4 | Satz (3) der Karte; Gesprächsweg (J-R20) |

**Festlegung 10-1.** Die Entscheidungshilfe in drei Zeilen unter der Reihe (ZA 04.2) entfällt; ihr Inhalt steht als „Wenn“-Satz in jeder
Karte. Grund: ein Mechanismus statt zwei (EV 7.5.4, Zeile „Entscheidungshilfe“), Platz am Telefon; die Fassung ohne JavaScript bleibt
erhalten, weil die Karten dort untereinander mit ihren Sätzen stehen. **P2 wird nicht weiterverfolgt**, bleibt aber Rückgriff, falls der
Lesetest zeigt, dass Bilder von 306 × 254 die Markenstufe nicht erkennbar machen (J-H11). **P4 bleibt Testalternative** wie C′.

---

## 10.4 Empfehlung und vollständige Spezifikation: Konzept P1 „Wischreihe mit Markenbild“

### A. Abschnitt und Funktion

- **Name.** Kapitel 04 „Ihre Marke“, Entscheidungsfläche Paketwahl. Bausteine: `fb-06-pakete-karten` (Kopf, Namensleiste, Kartenreihe),
  `fb-07-entscheidungshilfe-vergleich` (hier: Verkaufsstand und Vergleich, Festlegung 10-1), `fb-08-festblock-gespraechsweg` (Festblock,
  Gesprächsweg, Rechtshinweis), dazu die Rückmeldung am Ziel: Auswahlzeile in `fb-09-anfrage` (Zustand A) bzw. Schritt 1 in
  `/partner/#bestellen/<paket>` (Zustand B).
- **Position.** Nach Kapitel 03 „Ihr Postfach“, dessen Textziel „Wie sehr soll er Ihre Marke tragen?“ hierher führt, und vor Kapitel 05
  „Ihre Anfrage“. Telefon ≈ 4,35–6,35 BH (bei 844 px Bildschirm 5, bei 664 px Bildschirm 6); Schreibtisch ab ≈ 4,0 BH (ZA 8.3.2). Weitere
  Zugänge: Cream „Pakete ansehen“ im Startbild, Kopf-Ring, Menü, Anker `#pakete`, `#paket-essential|plus|signature`, Abschluss `fb-15`.
  Eingebettet in `/#fensterbauer` identisch (SKILL:63-64).
- **Ziel.** Z1 (Bestellung, Zustand B), bis dahin Z1a (Anfrage, Zustand A); Z1+ (höheres Paket) über Empfehlung mit Grund, Markenbild und
  Team-Zeile (EA 4.3.1–4.3.3).
- **Beantwortete Nutzerfrage.** „Was kostet es im Monat und einmalig, welches Paket passt zu meinem Betrieb, und was riskiere ich?“
- **Vorbereitete Entscheidung.** „Dieses Paket, und ich frage jetzt an bzw. bestelle“, oder bei Unsicherheit „Ich frage, welches passt“
  (Gesprächsweg). Erwartete Ausgangslage, nicht erhoben: Wer über „Pakete ansehen“ springt, ist der Entscheidung schon nah; wer die Seite
  durchlaufen hat, kennt Produkt und Anfrage aus 01 bis 03.

### B. Konkreter Inhalt

**Verwendete Inhalte, in Lesereihenfolge**

| Element | Inhalt | Herkunft | Art |
|---|---|---|---|
| Kapitelzeile | „04 · IHRE MARKE“ | EV 7.5.2 | Textentwurf |
| h2 | „Die Pakete“, grün „Pakete“, `id="pakete"` | VK:171; Prüfsuite 29.3 (Pflicht-h2) | Bestand wörtlich |
| Lead 17, drei Zeilen | „Ein Konfigurator, drei Stufen **Ihrer Marke**. In allen: eigene Domain, jede Anfrage als PDF, keine Gebühr je Anfrage.“ | VK:172, :236, :237 | **Textentwurf**; Rückfall VK:172 wörtlich |
| Namensleiste | drei Segmente: Kurzname („Essential“, „Essential Plus“, „Signature“) und Monatspreis („29 €“, „39 €“, „64 €“) | `functions/pakete-seite.js:31`, `:129`; `web/assets/pakete.js:44`, `:52`, `:60` | Bestand, um Preise ergänzt (AB-11) |
| Pille | „Empfohlen“ (nur an einer Karte) | `functions/pakete-seite.js:117`; SKILL:49 | Bestand |
| Paketname | „EEZI Essential“, „EEZI Essential Plus“, „EEZI Signature“ | `web/assets/pakete.js:44`, `:52`, `:60` | Bestand wörtlich |
| „Wenn“-Satz 15 | Essential: „Wenn Ihr Name genügt: der volle Konfigurator im eeziframes-Design.“ · Plus: „Wenn Ihre Kunden Ihr Logo, Ihre Farbe und Ihre Fotos sehen sollen.“ · Signature: „Wenn Ihre Kunden eeziframes nicht sehen sollen, mit Dashboard.“ | `web/assets/pakete.js:46`, `:54`, `:62-65`; `:77`, `:83` | **Textentwurf**, ersetzt `kurzText()` (`functions/pakete-seite.js:59-63`), Rückfall dessen Wortlaut |
| Preis | `<b>39 €</b> im Monat` | `functions/pakete-seite.js:120`; Prüfsuite 29.1 verlangt dieses Markup | Bestand wörtlich |
| Bindung 15 | „ab Livegang, monatlich kündbar“ | PB:54, :69; VK:243 | **Textentwurf** |
| Einrichtung 15 | „199 € Einrichtung, einmalig vorab: Anruf, Domain, Gestaltung, Vorschau“ (je Paket 99 / 199 / 279 €) | `functions/pakete-seite.js:121`; PB:58, :60, :64; Prüfsuite 29.1 verlangt „<Betrag> Einrichtung“ | **Textentwurf** |
| Steuerzeile 13 | „netto zzgl. MwSt. · nur für Unternehmer“ | `functions/pakete-seite.js:44`, `:122` | Bestand wörtlich |
| Knopf | Zustand A „Essential Plus anfragen“ → `#bestellen` mit `data-paket`; Zustand B „Essential Plus bestellen“ → `/partner/#bestellen/plus` | `functions/pakete-seite.js:113-115` | Bestand wörtlich |
| Satz unter dem Knopf (nur Zustand B) | „Erst Ihre Angaben, bezahlt wird im letzten Schritt.“ | `web/assets/partner.js:161-175`, `:296-300` | **Textentwurf** [H, J-H6] |
| Beispielbild | Startansicht des Konfigurators des Beispielbetriebs in der Markenstufe des Pakets, im Browserrahmen mit Adresszeile „ihr-name-fenster.de · Beispiel“ | `functions/pakete-seite.js:105-107`; `web/assets/einladung.js:172`; E-12; G7 | Bestand (Rahmen), Bild fehlt (`BEISPIEL_BILD`, `:96`) |
| Datenblatt, vier Zeilen | GESTALTUNG: „eeziframes-Design, Ihr Name“ / „Ihr Logo, Ihre Farbe, bis 6 Fotos“ / dasselbe · HINWEIS AUF EEZIFRAMES: „„Powered by EEZIframes““ / „kleiner Hinweis im Fuß“ / „keiner“ · IN SUCHMASCHINEN: „nein“ / „Startseite“ / „Startseite“ · FÜR IHR TEAM: „nicht enthalten“ / „nicht enthalten“ / „Dashboard, Einladungslinks, 5 Zugänge“ | `web/assets/pakete.js:77`, `:83`, `:88`, `:93-96`; GM 3.2 | Werte Bestand, Zeilenauswahl und Kürzung **Textentwurf** |
| Leistungsliste auf Abruf | Liste aus `punkte()`, Unterschiede zuerst; bei Signature mit „… neutralen Absender, sobald eingerichtet“ | `functions/pakete-seite.js:65-82`; Prüfsuite 29.4 Befund 2 | Bestand, umgestellt (J-R11) |
| Umschalter | „Leistungen ansehen“ / „Leistungen ausblenden“ | `functions/pakete-seite.js:123`; `web/assets/verkauf.js:350-357` | Bestand |
| Demo-Link (nur `PAKETE_DEMOS=1`) | „Demo ansehen“ → `https://demo-<paket>.eeziframes.com/` | `functions/pakete-seite.js:166-169` | Textentwurf [H, J-H7] |
| Verkaufsstand 15 | „Vorläufige Preise, Stand 22.10.2026. Es gilt der Preis, den Sie beim Bestellen sehen.“ | `web/assets/pakete.js:15-17`; PB:52 | **Textentwurf** (J-R18) |
| Vergleich | Zusammenfassung „Alle Merkmale im Vergleich“; Gruppen nach J-R7; Fußsatz „Alle Preise netto zzgl. MwSt., nur für Unternehmer. Vorläufige Preise.“ | VK:182; `functions/pakete-seite.js:133-140`; `web/assets/pakete.js:71-99`; Prüfsuite 29.1 | Bestand, gruppiert; Zeile „Im ersten Jahr“ [H, J-H4] |
| Festblock, Kennwort 13 | „VERTRAG IN KÜRZE“ | – | **Textentwurf** |
| Festblock, Zeilen 15 mit grünem Haken | „Der Vertrag beginnt erst mit Ihrer Zahlung.“ (PB:48) · „Das Monatsabo läuft erst ab dem Livegang.“ (PB:54) · „Vorher sehen Sie eine Vorschau; live erst mit Ihrer Freigabe oder nach Absprache.“ (PB:60) · „Bis zum Beginn der Einrichtung stornieren Sie mit voller Erstattung.“ (PB:70) · ohne Haken, `--text2`, eingerückt: „Danach wird die Einrichtung nicht erstattet.“ (PB:70) · „Monatlich kündbar, ohne Mindestlaufzeit.“ (PB:69; VK:243) | EA 4.3.1 | **Textentwurf** |
| Link 44 | „Paketbedingungen mit AV-Vertrag“ → `/konfigurator-bedingungen/` | VK:188 | Bestand, gekürzt |
| Gesprächsweg, Ring 52 | „Unsicher, welches Paket passt? Fragen Sie uns“ → `#frage`, Paket „Noch offen“; darunter 15: „Per Nachricht oder Rückruf, Antwort in der Regel innerhalb eines Werktags.“ | `functions/pakete-seite.js:174`, `:194`, `:196` | **Textentwurf** (Werktag ungemessen, O-8; Rückruf nur über das Formular, O-9) |
| Rechtshinweis 13 | „Angebot nur für Unternehmer im Sinne von § 14 BGB, nicht für Verbraucher. Ihr Kunde zahlt nichts.“ | VK:188 | **Textentwurf** (gekürzt; der Rest steht im Festblock) |
| Auswahlzeile in `fb-09` (Zustand A) | „Ihre Wahl: EEZI Essential Plus“ (15/700, K-21) · „39 € im Monat ab Livegang · 199 € Einrichtung einmalig · netto“ (13) · Link 44 „Paket ändern“ | `web/assets/pakete.js:42-67` | **Textentwurf** |
| Bestätigung in `/partner/` Schritt 1 (Zustand B) | „Heute fällig: 199 € netto, einmalig. Ab Livegang: 39 € im Monat. Monatlich kündbar.“ | `web/assets/partner.js:278`; PB:69 | **Textentwurf** [H, J-H9] |

**Festlegung 10-2.** Die Unterschiedszeile der Karte aus ZA 04.1 („+10 € gegenüber Essential: Ihr Design“) wird Variante (J-H5). Grund:
Eine Zeile mit nur der Monatsdifferenz verschweigt die Differenz der Einrichtung (+100 € bzw. +80 €); beide Beträge passen nicht in eine
Zeile von 270 px; der Unterschied steht schon im „Wenn“-Satz, im Bild und im Datenblatt.

**Festlegung 10-3.** Das Vorspann-Zeichen `farbwechsel` (Lottie-Schleife, VK:172) entfällt (J-AB-10).

**Erforderliche Interaktionen.** Wischen der Reihe (Telefon); Tipp auf ein Segment der Namensleiste; Tipp auf einen Kartenknopf (Wahl);
„Leistungen ansehen“; Vergleich öffnen; Gesprächsweg; Link zu den Bedingungen; mit Demos: Demo-Link.

**Nutzbare vorhandene Komponenten.** `karten()`, `vergleich()`, `hinweis()`, `beispiel()`, `skizze()`, `formular()`, `bestellen()`, `ld()`
in `functions/pakete-seite.js`; Daten und Beschriftungen in `web/assets/pakete.js`; Wischreihe, Zeiger und Umschalter in
`web/assets/verkauf.js` (`pakete()`, Zeilen 340–404); Vorwahl im Formular (`web/assets/verkauf.js:25-35`); Rahmen der Beispielseite und
Raster der Karten in `web/assets/verkauf.css` (Zeilen 21–41, 85–91); Startansicht der Instanz in `web/assets/einladung.js`; Statusleiste und
Verkaufszustand in `web/assets/instanzregeln.js`; Bestellformular in `web/assets/partner.js`.

### C. Exakte Layoutkomposition

**Grundstruktur.** Kopf → Namensleiste → Kartenreihe (Held je Karte: Beispielbild) → Verkaufsstand → Vergleich → Festblock → Gesprächsweg
→ Rechtshinweis. Satzbau nach G2: Kopf (Haarlinie, Kapitelzeile, h2), Held, Lesestapel, Handlung. Ordnungslinie ist die linke Spaltenkante
(G5); in jeder Karte die linke Innenkante.

**Telefon 390 × 844, nach dem Sprung auf `#pakete`** (4 Spalten, Rand 16 px; alles über 4 Spalten; die Kartenreihe bricht über beide
Ränder hinaus)

| y (px) | Element | Maß | Ebene |
|---|---|---|---|
| 0–56 | Kopf; Ring ausgeblendet, solange Namensleiste oder Kartenreihe das Band unter dem Kopf bis 60 % der Bildhöhe schneidet (K-28, J-AB-9) | 390 × 56 | 40 |
| 72 | Haarlinie | 358 × 1 | 30 |
| 88–104 | Kapitelzeile 13, Technikstimme, grün „04“ | – | 30 |
| 116–150 | h2 32 „Die Pakete“ | eine Zeile | 30 |
| 162–239 | Lead 17, drei Zeilen | 358 breit | 30 |
| 255–307 | Namensleiste: drei Segmente 116 × 52, Abstand 5; Zeiger 116 × 52 als Füllung `#262626` | 358 × 52 | 30 |
| 317–345 | Pille „Empfohlen“, x 60–182, Mitte auf der Kartenoberkante | 122 × 28 | 30 |
| 331 | Kartenoberkante; Karte x 40–350, Nachbarn x −274…28 und 362…674 (je 28 px sichtbar) | 310 breit | 30 |
| 356–378 | Paketname Bedientext 17/22, 700 (K-21) | – | 30 |
| 387–431 | „Wenn“-Satz 15, zwei Zeilen, `--text2` | 270 breit | 30 |
| 447–485 | Preis 32/800 + „im Monat“ 15 `--muted` auf der Grundlinie | – | 30 |
| 487–509 | Bindung 15 | eine Zeile | 30 |
| 517–561 | Einrichtung 15, zwei Zeilen | – | 30 |
| 565–583 | Steuerzeile 13 | – | 30 |
| 599–651 | Knopf, x 60–330 | 270 × 52 | 30 |
| 667–921 | Beispielbild über die volle Kartenbreite: Browserleiste 24 px `--surface2` (`#262626`, K-38) + Bildfenster 306 × 230 (4 : 3), x 42–348 | 306 × 254 | 20 |
| 937–1132 | Datenblatt: vier Zeilen à 48, je Zeile Kennwort 13 Versalien oben, Wert 15 darunter (gestapelt, `fb-06` Festlegung I-1), drei Haarlinien zwischen den Zeilen | 270 × 195 | 30 (Leitlinien 25) |
| 1144–1188 | „Leistungen ansehen“ | 270 × 44 | 30 |
| 1208 | Kartenunterkante (Innenabstand unten 20; Karte 877 hoch, in `fb-06` gemessen, K-38; Signature gleich hoch, weil alle Karten dieselben Zeilen haben) | – | – |
| +24 | Verkaufsstand 15, zwei Zeilen | 358 × 44 | 30 |
| +24 | Vergleich, Zeile 52 mit Haarlinien oben und unten, „+“ als 24-px-Strich rechts | 358 × 52 | 30 |
| +48 | Festblock: Kennwort 13, fünf Haken-Zeilen und die Grenze (≈ 8 Zeilen à 22), Link 44 | 358 × ≈ 240 | 30 |
| +24 | Gesprächsweg: Ring, darunter eine Zeile 15 | 358 × 52 + 22 | 30 |
| +16 | Rechtshinweis 13, zwei bis drei Zeilen | 358 × ≈ 54 | 30 |

Kapitel 04 insgesamt ≈ 1.740 px ≈ 2,1 BH (ZA plant 1,9 BH). **Prüfung bei 390 × 664:** Der Knopf der empfohlenen Karte endet bei y 651 und
steht im ersten Bildschirm nach dem Sprung (13 px Reserve). **Bei 844:** Vom Beispielbild sind 177 von 254 px sichtbar (y 667–844); die
Fortsetzung ist angekündigt (SG 10.7/10). **Bei 360 px Breite:** Karte 280, Innenbreite 240; die Texte bleiben zweizeilig (in `fb-06` gemessen),
der Knopf steht bei y ≈ 599–651 (K-38).

**Größenhierarchie.** Drei Stufen je Ansicht (SG 10.1/4): (1) Zahl 32 (h2 und Preis teilen die Stufe) neben dem nicht-textlichen Held
Beispielbild; (2) Lesestufe 17 und 15; (3) Mikrostufe 13. Der Paketname steht in 17/700 statt 24 (J-AB-1; DG-E-2 A), weil 24 sonst eine
vierte Stufe zwischen Preis und Lesetext öffnet und nie neben 32/40 steht; 700, nicht 800, weil 800 Titel und Zahl vorbehalten ist (K-21). Maßstabssprung am Telefon: Bildhöhe 254 zu Versalhöhe der Bedienschrift (≈ 9,5 px bei 13)
≈ 27-fach; Preis 32 zu 13 ≈ 2,5-fach (textlich unter 3, deshalb trägt das Bild den Sprung, G4).

**Verhältnisse.** Karte (877 px, K-38): Preisblock mit Knopf ≈ 36 % der Kartenhöhe, Bild ≈ 29 %, Datenblatt und Umschalter ≈ 29 %,
Innenabstände ≈ 6 %. Bildschirm nach dem Sprung (geplant, geschätzt): Bild ≈ 15 %, Text und Bedienelemente ≈ 35 %, ruhige Fläche (Grund und Kartenfläche
ohne Inhalt) ≈ 50 %. Nach rund 150 px Scrollen steht das Bild ganz im Bild, dann ≈ 24 % Bild. Abstände 8 (innerhalb einer Gruppe) : 16
(zwischen Gruppen) : 24 bis 48 (zwischen Zonen) ≈ 1 : 2 : 3–6 (SG 10.9, Abstände).

**Symmetrie.** Asymmetrisch: alles an der linken Kante; nur die Karte sitzt mittig in der Reihe (Einrasten auf die Mitte). Kein mittiger
Text.

**Vorder-, Mittel-, Hintergrund.** Hintergrund Z 0: Grund `#161616`, ohne Licht und Raster. Mittelgrund Z 20: die drei Beispielbilder.
Z 25: Leitlinien des Datenblatts (SVG, `aria-hidden`), die vom Kennwort zur markierten Stelle im Bild laufen. Vordergrund Z 30: Karten,
Text, Pille, Namensleiste, Knöpfe. Z 40: Kopf. Verdeckungen (DNA Nr. 2, SG 10.9 „mindestens 1“): die Pille überdeckt den Kartenrand; die
Adresszeile mit „Beispiel“ überdeckt die Oberkante des Bildes; der Bildschirmrand schneidet die Nachbarkarten.

**Position interaktiver Komponenten.** Namensleiste oben über der Reihe (Navigation und Preisüberblick); Knopf in der unteren Hälfte des
Bildschirms; Umschalter am Kartenende; Vergleich, Link und Gesprächsweg untereinander an der linken Kante, je volle Breite, Ziele ≥ 44 px.

**Schreibtisch 1280 × 800** (12 Spalten zu 64,67 px, Abstand 24, Spalte 1040 ab x = 120)

| y (px) | Element | Spalten |
|---|---|---|
| 0–64 | Kopf | – |
| 80 | Haarlinie | 1–12 |
| 96–112 | Kapitelzeile 13 | 1–4 |
| 124–168 | h2 40 | 1–4 |
| 128–179 | Lead 17, zwei Zeilen; linke Kante = linke Kante der Plus-Karte | 5–12 |
| 208 | Kartenoberkanten; Karten x 120–450,7 · 474,7–805,3 · 829,3–1160 | 1–4 · 5–8 · 9–12 |
| 233–255 | Paketname 17/22, 700 (K-21) | je Karte |
| 264–308 | „Wenn“-Satz 15, zwei Zeilen (Innenbreite 282,7) | je Karte |
| 324–368 | Preis 40/800 | je Karte |
| 370–392 | Bindung 15 | je Karte |
| 400–444 | Einrichtung 15 | je Karte |
| 448–466 | Steuerzeile 13 | je Karte |
| 482–534 | Knopf 282,7 × 52 | je Karte |
| 558–794 | Beispielbild in der Innenbreite: Browserleiste 24 `--surface2` (`#262626`, K-38) + Bildfenster 282,7 × 212 | je Karte |
| 810–1005 · ab 1021 | Datenblatt (vier Zeilen à 48, K-38) · Leistungsliste offen (Bestand), dann Demo-Link | je Karte |

Danach: Verkaufsstand Spalten 1–8; Vergleich Spalten 1–12 (Beschriftung Spalten 1–3, Pakete je 3 Spalten); Festblock Spalten 1–6,
daneben Spalten 7–12 Gesprächsweg und Rechtshinweis, oben bündig mit dem Festblock. Keine Namensleiste. Die drei Bilder stehen im ersten
800-px-Bildschirm nebeneinander: der Bildvergleich, den das Telefon nur nacheinander zeigt. Das `subgrid` hat acht Zeilen (Kopf mit Name,
Satz, Preisblock, Knopf, Bild, Datenblatt, Liste, Demo), wie heute `repeat(8, auto)` (`web/assets/verkauf.css:85`).

**Technische Startwerte und Begründung**

| Wert | Start | Begründung |
|---|---|---|
| Kartenbreite Telefon | `min(calc(100vw − 80px), 380px)` = 310 | Bestand (`web/assets/verkauf.css:89`); Nachbarn als Anschnitt |
| Abstand der Karten | 12 Telefon, 24 Schreibtisch | Bestand; Rasterabstand |
| Innenabstand der Karte | 20 Telefon, 24 Schreibtisch und 1024 | Bestand 20 (`verkauf.css:22`); 24 hält die Bilder bei 800 px ganz im Bild |
| Radius | Karte 24, Bildrahmen 12 (am Telefon oben 0, weil er an den Ring stößt), Pillen und Knöpfe voll | DG-AB-8 (vier Werte voll · 24 · 18 · 12) |
| Ring | 2 px `--ring`, empfohlen 2 px Cream | DG-E-10; J-R8 |
| `scroll-margin-top` für `#pakete` | 116 px Telefon, 124 px Schreibtisch | damit Haarlinie und Kapitelzeile nach dem Sprung unter dem Kopf stehen; heute 76 (`verkauf.css:8`) |
| Reihe | `scroll-snap-type: x mandatory`, `scroll-snap-align: center`, `scroll-snap-stop: always`, `overscroll-behavior-x: contain` | Bestand (`verkauf.css:89-91`) |
| Nachbarn | `opacity: calc(1 − var(--a) * .34)`, ohne `scale` | Bestand ohne Skalierung (J-AB-2; SG 10.7/3) |
| Ausrichtung der Karten | gleich hoch (`align-items: stretch`), weil alle dieselben Zeilen tragen | ruhige Kanten beim Wischen |
| Umbruch Reihe → drei Spalten | ab 900 px Breite drei Spalten, darunter Reihe | **Festlegung 10-4:** heute 760 px (`verkauf.css`, `verkauf.js:347`); bei 768 px wären drei Karten nur ≈ 229 px breit |
| Bildformat | 4 : 3, aufgenommen bei 1280 × 960 | eine Aufnahme für alle Breiten; bei 1280 × 800 passen die Bilder ganz in den ersten Bildschirm |

Abweichungen von DNA-Werten, funktional begründet: Die freie Fläche liegt im ersten Bildschirm nach dem Sprung bei ≈ 50 % einschließlich
ruhiger Kartenfläche, der Bildanteil bei ≈ 15 % statt 20–50 % (DG 2.4.2, Stufe 2). Grund: EA S4 und J-R2 verlangen Preisblock und Knopf
vollständig im ersten Bildschirm; das Bild folgt direkt darunter.

### D. Anwendung der Design-DNA

Stufe 2 „klar“, Dialekt C (flache Lösung) mit einem Bildträger je Karte; Entscheidungsfläche ohne inszenierende Signature (DG Dosierregel 1,
[V]); eine informierende Signature (Annotation). Intensität auf der DNA-Skala 0–4.

| Eigenschaft | Ausgestaltung | Intensität | Position | Zusammenspiel und Wirkung | Beitrag zur Funktion |
|---|---|:-:|---|---|---|
| Tiefe, Z-Achse (D1) | drei Ebenen plus Kopf; Verdeckung über Pille, Adresszeile, Anschnitt der Nachbarn | 2 | ganze Fläche | Raum ohne Effekt; die Karte liegt eindeutig über dem Bild | trennt Bild (zeigen) von Bedienung (entscheiden), G1 |
| Material, Transparenz (D2) | Material nur im Bild: echte Bildschirmaufnahme der Startansicht; Karten matt `#1f1f1f`; kein Glas | 1 | Beispielbild | „echtes Material statt Symbole“ (SKILL:41) | belegt, was der Kunde des Betriebs sieht |
| Licht, Schatten (D3, D4) | keine Lichtquelle, kein Schatten auf dunklem Grund; Lichtkante am Browserrahmen nach K-24: 1 px rundum `--kante-alpha` (14 %), Ober- und rechte Kante `--kante-licht` (24 %); Lichtrichtung nach Haus-Token oben rechts (`--licht-x` −0,6, `--licht-y` 0,8) | 0–1 | Kanten jedes Bildrahmens | ruhig; das Licht der Seite gehört V1 und 02 | kein Blickziel konkurriert mit Preis und Knopf |
| Formen (D5) | Vollrundung für Pillen, Knöpfe, Segmente; Radius 24 für Karten, 12 für Bildrahmen; keine Formänderung bei Zuständen | 2 | überall | ein geschlossenes Formsystem (DNA Nr. 5) | Knöpfe und Segmente sind als bedienbar erkennbar |
| 3D-Objekte (D7) | keine | 0 | – | bewusst flach | Konzentration auf Zahlen |
| Bildintegration (D11) | Bild als Panel im gerundeten Container (B.3.4), am Telefon über die volle Kartenbreite; gleiche Aufnahme, gleiche Belichtung für alle drei (J-R9) | 2 | unter dem Knopf | die drei Bilder lesen sich als Zustände einer Ansicht | Markenstufe sehen statt lesen (SKILL:29) |
| Oberflächendetails (D12) | Datenblatt mit Haarlinien; zwei Leitlinien (1 px, `--muted` 40 %) mit Markierungsring 6 px vom Kennwort zur Stelle im Bild: „Gestaltung“ → Kopf der Startansicht, „Hinweis auf eeziframes“ → Fuß | 2 | unter und im Bild | Präzision wie in einer Bauzeichnung (DR 1; Ref 10 Annotation) | verbindet Wort und Bild; erklärt, wo „Powered by“ sitzt (F-24) |
| Animation (D8, D16) | nur nutzergeführt: Karte folgt dem Finger; Bild läuft nach und kehrt mit gedämpfter Feder zurück (Modell „Feder“ nach K-37: ≤ 24 px, ≤ 3 %, Einschwingen ≈ 420 ms); Zeiger der Namensleiste folgt | 1 | Reihe, Bild, Leiste | „Trägheit und Federn“ (SKILL:43) nur in der Bildschicht | zeigt, dass Bild und Karte ein Stück sind (SKILL:122) |
| Typografie (D18) | Zahl als Held 32/40, 800, `tabular-nums`; zwei Stimmen: Bühnenstimme (h2, Preis), Technikstimme (Kapitelzeile, Kennwörter des Datenblatts, Adresszeile) | 2 | Preisblock, Datenblatt | klare Leselinie Preis → Knopf | Preise vergleichbar über die Karten |
| Überlagerungen | Pille auf dem Kartenrand; „Beispiel“ in der Adresszeile über dem Bild; Leitlinien über dem Bild | 1 | Kartenoberkante, Bild | flach, frontal | Empfehlung und Kennzeichnung als Beispiel sind eindeutig zugeordnet (G7) |
| Perspektive (D15) | keine; Bildrahmen frontal, nicht gekippt | 0 | – | vermeidet die Anmutung gekippter Geräteschablonen | Bilder bleiben vergleichbar |
| Interaktive Effekte (D10) | Zustände nur über Füllung (aktiv), Kontur (Hover), 2-px-Fokus 3 : 1; Zeiger in der Leiste als Füllung | 1 | Knöpfe, Segmente, Karten am Schreibtisch | ruhig, eindeutig | Rückmeldung ohne Ablenkung |

**Bewusst weggelassen:** Glas, Lichtraum und Lichtquelle, Kantenlicht, Schatten, Messraster (wäre eine zweite informierende Signature),
Riesenwort, gekippte oder gedrehte Karten (DG-AB-12), Auftritte beim Scrollen (E-13), Lottie-Vorspann (J-AB-10), hochzählende Preise
(DG-AB-3), Einlauf-Hinweis mit Federn (J-AB-3), Skalierung der Nachbarn (J-AB-2), grüner Schein (J-AB-4), Partikel, Kapitelanzeige im Kopf.

### E. Visual Attention Architecture

Erwartete Aufmerksamkeit aus Komposition und Forschung (RE E1–E3; Q14), nicht gemessen.

- **Primärer Fokus:** Preisblock und Knopf der empfohlenen Karte (größte Zahl, größte helle Fläche: Cream 270 × 52).
- **Sekundärer Fokus:** Namensleiste mit den drei Preisen; danach das Beispielbild (einzige farbige Fläche).
- **Erwartete Reihenfolge am Telefon:** h2 mit grünem Wort → Namensleiste (drei Preise als Band) → Pille „Empfohlen“ und Cream-Ring →
  Preis „39 €“ → Bindung und Einrichtung → Cream-Knopf → Oberkante des Bildes → Anschnitt der Nachbarn (Hinweis aufs Wischen, ohne
  Animation).
- **Am Schreibtisch:** h2 → Lead rechts daneben → Preise der drei Karten von links nach rechts → Cream-Knopf in der Mitte → Reihe der drei
  Bilder → Datenblatt.
- **Kontraste:** Text `#f3f2ee` auf `#1f1f1f` ≈ 15 : 1; `--text2` und `--muted` ≥ 4,5 : 1; Cream-Füllung mit dunkler Schrift; Grün nur im
  h2-Wort, in der Kapitelzeile und an den Haken des Festblocks.
- **Position und Gewicht des CTA:** ein Cream-Knopf je Bildschirm; Ring-Knöpfe der Nachbarn sind außerhalb des Bildes; der Kopf-Ring ist
  ausgeblendet (K-28, J-AB-9). Am Schreibtisch zwei Ring-Knöpfe neben dem Cream-Knopf, gleich groß, nur die Füllung unterscheidet.
- **Mögliche Ablenkungen:** (1) Im Beispielbild der Essential-Stufe steht der Startknopf der App im eeziframes-Design; im Bild ist er
  ≈ 40 × 10 px groß, kann aber im Blinzeltest als zweiter heller Fleck wirken (DG-H-12) – prüfen, notfalls Aufnahme ohne hellen Knopf im
  sichtbaren Ausschnitt. (2) Das Datenblatt mit vier Zeilen ist textreich; es steht unter dem Bild und erst nach dem Knopf. (3) Die
  Namensleiste kann als zweite Auswahl missverstanden werden; sie navigiert nur (E-3).
- **Übergang zum nächsten Abschnitt:** Nach der Reihe führen Verkaufsstand (Satz) → Vergleich (Zeile) → Festblock (grüne Haken als ruhige
  Signalreihe) → Gesprächsweg (Ring) → Rechtshinweis zur Kapitelzeile „05 · IHRE ANFRAGE“; keine Bühne, kein Effekt dazwischen.

### F. Interaktions- und Bewegungsverhalten

| Auslöser | Reaktion | Ebene | Dauer, Kurve | Verfahren | Weniger Bewegung | Begründung |
|---|---|---|---|---|---|---|
| Ankersprung auf `#pakete` (Startbild-Cream „Pakete ansehen“, Kopf-Ring, Menü) | Seite steht sofort am Kapitelanfang, danach Fokus auf die h2 „Die Pakete“ (`tabindex="-1"`) | Seite | sofort | `behavior: 'auto'` | gleich | K-10: dazwischen liegen scrollgekoppelte Szenen (Leiste, Lichtraum, Explosionsansicht); glattes Rollen spielte sie nacheinander ab |
| Scrollen durch das Kapitel | keine Bewegung. Kopf-Ring nach K-28: erscheint, wenn die Startbild-Cream unter dem Kopf verschwindet; ausgeblendet, solange Namensleiste oder Kartenreihe das Band unter dem Kopf bis 60 % der Bildhöhe schneidet, in Zustand A und B; danach in Zustand A „Paket anfragen“ → `#frage` (Textwechsel 100 + 120 ms), ausgeblendet an 05; Kontur `--muted` (K-1), Druck Füllung `--surface2` (K-2) | 40 | ein 220 ms (`--t2`) `--e-out`, aus 165 ms (`--t2-aus`) `--e-in` | IntersectionObserver auf Namensleiste und Reihe, `opacity` | sofort | E-13; eine Handlung je Bildschirm |
| Wischen der Reihe | Karte folgt dem Finger 1 : 1, rastet auf die Mitte, ohne Überschwingen; Nachbarn über Deckkraft (1 → 0,66) | 30 | nativ | `scroll-snap`, `--a` aus `verkauf.js` | gleich (natives Scrollen) | SG 10.7, „Direkte Manipulation“ |
| Wischen der Reihe | Beispielbild läuft entgegen der Wischrichtung nach: Versatz = Wischgeschwindigkeit (px/ms) × 8, gekappt auf ± 24 px; Rückkehr als gedämpfte Feder nach K-37 (Modell „Feder“, nur für diese fingergeführte Bildebene): ζ = 0,75 (Überschwingen ≈ 2,8 %, ≤ 3 %), f = 2 Hz (ω ≈ 12,6 s⁻¹), Einschwingen ≈ 420 ms | 20 | Feder | `requestAnimationFrame`, `transform: translate3d`, nur solange die Reihe im Bild ist | kein Nachlauf | SKILL:43, :121-122; DG T7; Federn ≤ 3 % nur in der Bildschicht (G1) |
| Wischen der Reihe | Zeiger der Namensleiste folgt dem Fortschritt; `aria-current` wechselt bei der Rundung | 30 | 1 : 1 | `--p`, `transform: translateX` | gleich | Bestand (`verkauf.js:371-373`) |
| Tipp auf ein Segment | Reihe rollt zur Karte, die Seite bleibt stehen | 30 | Browser-Glättung, ≈ 300–500 ms | `scrollTo({behavior: 'smooth'})` | `auto` | Bestand (`verkauf.js:376-379`, `:383-385`); waagerecht in der Reihe, glatt zulässig nach K-10 |
| Hover (Schreibtisch, `pointer: fine`) | Karte: Ring wird 2-px-Kontur `--muted` (≥ 3 : 1); Ring-Knopf: Kontur `--text`; Cream-Knopf: innere Kontur 2 px `--on-primary` 24 %; Datenblattzeile hebt ihre Markierung im Bild hervor (Deckkraft 40 → 100 %) | 30 / 25 | 160 ms, `--kurve-ein` | CSS-Übergang auf Farbe und Kontur | gleich (Farbwechsel bleiben) | Hover = Kontur (DG 2.4.1); kein Anheben |
| Tipp auf den Kartenknopf | Taste: Füllung dunkler | 30 | 150 ms | `:active` | gleich | Zustand ohne Skalierung (SG 10.7/3) |
| – Zustand A | Seite rollt zu `#frage`; Paket im Feld gesetzt (Bestand); Auswahlzeile erscheint über den Feldern; Fokus auf h3 „Paket unverbindlich anfragen“ (`tabindex="-1"`, `focus({preventScroll: true})` nach dem Rollen); `aria-live` sagt „EEZI Essential Plus ausgewählt“; Cream wandert im Hintergrund an Karte und Abschluss dieses Pakets (J-AB-8) | 30 | Rollen nativ glatt (zulässig nach K-10: zwischen Karte und `#frage` liegen nur `fb-07`, `fb-08`, keine scrollgekoppelte Szene); Auswahlzeile 220 ms Deckkraft | `scrollIntoView`, Zustand je Wurzel in `sessionStorage` (`try/catch`) | Sprung ohne Glättung, Zeile sofort | E-3; J-R23; RE E11 |
| – Zustand B | Seitenwechsel zu `/partner/#bestellen/<paket>` im selben Tab; Überblendung der Seite; [H] das gewählte Beispielbild gleitet als einziges gemeinsames Element in die Miniatur von Schritt 1 und skaliert gleichmäßig | Seite / 20 | Überblendung 240 ms; Gleiten 320 ms, `cubic-bezier(.2, 0, 0, 1)` | View Transitions zwischen Dokumenten (`@view-transition { navigation: auto; }`, `view-transition-name: paket-wahl`), nur wo unterstützt | ohne Übergang | SG 10.7, „Übergänge und Physik“; J-H10 |
| „Leistungen ansehen“ | Listen aller drei Karten öffnen; Höhe sofort, Inhalt blendet ein; Beschriftung wechselt; `aria-expanded` | 30 | 220 ms Deckkraft | Bestand (`verkauf.js:350-357`) | sofort | DG-E-14 A |
| Vergleich öffnen | `details` öffnet; Höhe sofort, Tabelle blendet ein; Tabellenkopf klebt am Telefon unter dem Kopf (`top: 56px`) | 30 | 220 ms Deckkraft | `details`, `position: sticky` | sofort | ZA 04.2 |
| Gesprächsweg | wie Zustand A, Paket „Noch offen“, keine Auswahlzeile | 30 | wie oben | wie oben | wie oben | E-3 |

**Charakteristik.** Ruhig und präzise: Die Bedienschicht ändert nur Zustände, alles Physikalische liegt im Bild. Keine Richtung ohne Anlass:
Bewegung entsteht nur als Antwort auf Finger, Zeiger oder Tipp. Keine autonome Bewegung, also auch keine Pausen-Schaltfläche nötig (R2).
**Ohne JavaScript:** Reihe nativ wischbar, Karten mit Preisen und offenen Listen, Vorwahl entfällt, Knöpfe springen zu `#bestellen`
(Prüfsuite 29.1/29.2).

### G. Responsive Design

**Telefon 390 × 844 (zuerst, eigenständige Komposition).** Kopf, Lead, Namensleiste mit Preisen, eine Karte voll und zwei angeschnitten;
Preisblock und Knopf bis y 651, also auch bei 664 px im ersten Bildschirm; Bild über die volle Kartenbreite; Vergleich mit klebendem Kopf
aus drei Kurznamen und Zeilen, deren Beschriftung über der ganzen Breite und deren drei Werte darunter in drei Zellen à 114 px stehen; kein
Querscrollen (R9). Ab 360 px gleiche Komposition mit Karte 280. Bis 899 px Breite bleibt die Reihe (Festlegung 10-4); zwischen 600 und 899 px
wird die Karte höchstens 380 breit (Bestand), die Nachbarn zeigen entsprechend mehr.

**Schreibtisch 1280 × 800.** Drei Karten nebeneinander in 1040 px, Zeilen über `subgrid`; h2 Spalten 1–4, Lead ab der linken Kante der
Plus-Karte; Preise und Knöpfe bei y 324–534, alle drei Bilder vollständig bis y 794; keine Namensleiste; Leistungslisten offen; Festblock
links, Gesprächsweg und Rechtshinweis rechts. Nichts überdimensioniert: Preis 40, h2 40, Spalte 1040 (SKILL:28).

**Schreibtisch 1024 × 768.** Spalte 944 ab x = 40, Karten 298,7 breit, Innenbreite 250,7. „Wenn“-Satz und Einrichtung dreizeilig; Preis
bei y ≈ 346–390, Knopf bei y ≈ 526–578, Bilder (250,7 × 188 plus Leiste) bei y ≈ 602–814, also zu ≈ 78 % im ersten Bildschirm. Gleiche
Struktur, keine eigene Variante.

**Einbettung `/#fensterbauer`.** Identisch; Zustand („gewählt“, letzte Karte) je Wurzel; Bindungen idempotent bei jedem `Verkauf.auf`
(Bestand `box.__vkAn`); der Kopf-Ring der Einbettung folgt `kopfCta()` der Startseite (GEST:399).

### H. Technische Umsetzung

**Bestehende Komponenten (bleiben, werden angepasst)**

| Datei | Teil | Änderung |
|---|---|---|
| `functions/pakete-seite.js` | `karten()` 109–131 | „Wenn“-Satz statt `kurzText()` (Rückfall behalten); Zeile Bindung; Einrichtung mit Inhalt (Prüfsuite-String „<Betrag> Einrichtung“ bleibt); Datenblatt; Pfeilkreis am Cream-Knopf; Namensleiste mit Preisen vor die Reihe (heute danach, Zeile 129–130) |
| | `punkte()` 65–82 | Unterschiede zuerst (J-R11); Signature-Satz mit „sobald eingerichtet“ bleibt (Prüfsuite 29.4) |
| | `hinweis()` 86–91 | Satz nach J-R18 unter die Reihe statt Kasten darüber |
| | `vergleich()` 133–140 | Gruppen als `<tbody>` mit `<th scope="rowgroup">`; gemeinsame Zelle für „In allen Paketen“; „nicht enthalten“ statt „nein“ bei Zahlen (`wertText`, Zeile 51); optionale Zeile „Im ersten Jahr“; Fußsatz wörtlich (Prüfsuite 29.1) |
| | `beispiel()` 105–107, `BEISPIEL_BILD` 96 | Bilder je Paket eintragen; Adresszeile „ihr-name-fenster.de · Beispiel“; `figcaption` nur für Vorleseprogramme |
| | `EMPFOHLEN` 33 | bleibt Konstante, bis O-5 entschieden ist; der „Wenn“-Satz ersetzt die Begründung über die Position |
| | danach | `node scripts/bedingungen-pdf.mjs` (SKILL, Abschnitt 8) |
| `web/assets/verkauf.js` | `pakete()` 340–404 | Feder-Nachlauf des Bildes (K-37); Einlauf-Hinweis `.vk-wischen` entfernen (Zeilen 390–404); Breakpoint 899; Cream nach Wahl; Kopf-Ring nach K-28 |
| | `formular()` 25–35 | Auswahlzeile, Fokus, `aria-live` |
| `web/assets/verkauf.css` | 8, 21–41, 85–91 | `scroll-margin-top`; kein Schein (Zeile 23); keine Skalierung der Nachbarn (Zeile 91); Pille als Kontur; Datenblatt; Bild über die Kartenbreite am Telefon; `@view-transition` |
| `web/assets/partner.js` | Schritt 1, `schrittPaket()`; Vorwahl 612–616 | [H] Bestätigung mit Zahlen statt erneuter Wahl; Miniatur mit `view-transition-name` |
| `web/assets/pakete.js` | – | unverändert; einzige Quelle für Preise und Merkmale |
| `scripts/pruefen-instanzen/29.mjs` | 29.1, 29.2, 29.4 | bleiben gültig; ergänzen: Namensleiste nennt alle drei Preise, Datenblatt hat in allen Karten dieselben vier Zeilen |

**Neue Bausteine.** Namensleiste mit Preisen; Datenblatt mit Leitlinien (SVG-Überlagerung, Markierungskoordinaten je Bild als
`data-`-Attribute aus der Aufnahme); Festblock; Gesprächsweg; Auswahlzeile im Formular; Zustandsspeicher „gewählt“ je Wurzel; Logik für den
Kopf-Ring; Bestätigung in Schritt 1 des Kundenkontos.

**CSS- und Layouttechniken.** Grid mit `subgrid` (Bestand), `scroll-snap` (Bestand), `position: sticky` für den Tabellenkopf,
`@media (pointer: fine)` für Hover, `@media (prefers-reduced-motion: reduce)`, `@view-transition` als fortschreitende Verbesserung; Ebenen
über die Z-Stufen 0/20/25/30/40 (DG 2.4.1); Bilder mit festen `width`/`height` gegen Layoutverschiebung.

**Benötigte Assets**

| Asset | Art | Format, Maß | Freistellung | Quelle |
|---|---|---|---|---|
| Beispielbild je Paket (3) | Bildschirmaufnahme der Startansicht des Beispielbetriebs in der Markenstufe (Essential: eeziframes-Design mit Namen und „Powered by“; Plus: Logo, Farbe, Fotos, kleiner Hinweis; Signature: ohne Hinweis) | aufgenommen 1280 × 960, ausgegeben 660 × 495 (2-fach der größten Anzeige 306 × 230 bzw. 282,7 × 212), AVIF ≤ 35 KB und WebP ≤ 50 KB | rechteckig, nicht freigestellt | per Skript mit Playwright aus `web/assets/einladung.js` (vorhanden, `/opt/node-tools`); Logo als neutrales Monogramm „Beispiel“ statt eines erfundenen Logos (EV X6) |
| Fotos des Beispielbetriebs (bis 6, für Plus und Signature) | Werkstatt, Fenster im Einbau, Musterfenster; erkennbar erfunden, keine echte Firma, keine erkennbaren Personen | 1200 × 900, JPEG oder WebP | keine | beim Inhaber anzufragen (Flux), ohne Text, Logos, Wasserzeichen; Licht warm, von oben rechts nach Haus-Token (`--licht-x` −0,6, `--licht-y` 0,8; K-24) |
| Bild des Dashboards (optional, Signature) | Aufnahme `/betrieb/` mit Beispieldaten, für eine spätere Miniatur in der Team-Zeile | 660 × 440 | keine | per Skript (vorhanden); offen nach O-12 |
| Miniatur für Auswahlzeile und Kundenkonto | aus dem Beispielbild abgeleitet | 96 × 72 (2-fach von 48 × 36) | keine | aus Asset 1 |
| Name des Beispielbetriebs | „Fensterbau Brandt“ aus `web/assets/einladung.js:172` | – | – | Bestätigung durch den Inhaber, eine Beispielfirma auf der ganzen Website (G7; PA-Frage 25) |

Bis die Bilder da sind, bleiben die Skizzen ohne Text (`functions/pakete-seite.js:99-104`) als Platzhalter, der den Effekt schon zeigt
(SKILL, Abschnitt 5).

**Animationstechnik und Technikstufe.** Stufe 1 „Leicht“ (SKILL, Abschnitt 3): CSS-Übergänge auf `opacity`, Farbe und Kontur; schlankes
JavaScript mit `requestAnimationFrame` für die Feder, nur `transform`; View Transitions des Browsers ohne Bibliothek. Begründung: Die
Entscheidungsfläche ist Stufe 2 ohne inszenierende Signature (DG Dosierregel 1); Grafikchip-Effekte würden mit Preis und Knopf
konkurrieren. Der hochwertige Eindruck entsteht hier aus Präzision (Datenblatt, Leitlinien), echtem Material und der Feder im Bild.

**Leistungsrisiken.** Drei Bilder ≈ 105–150 KB, `loading="lazy"`, `decoding="async"`, feste Maße (CLS ≤ 0,1); das Kapitel liegt nie im
ersten Bildschirm, belastet also das LCP nicht. Scroll-Verarbeitung gebündelt per `requestAnimationFrame` (Bestand), Feder nur bei
sichtbarer Reihe (IntersectionObserver; SKILL:61). INP: Klick auf den Kartenknopf schreibt nur Zustand und Feldwert. View Transitions
erzeugen Schnappschüsse; bei Median-Bildzeit über 25 ms ohne Übergang (SG 10.8).

**Barrierefreiheit.** Reihe als Bereich mit `aria-label="Pakete"`, jede Karte ein `article` mit `h3` (Bestand); Namensleiste `nav` mit Links
und `aria-current` (Bestand); Knöpfe als Links mit eindeutigem Namen („Essential Plus anfragen“); „Empfohlen“ als Text, nicht nur Farbe;
Datenblatt als `dl`; Haken im Festblock mit Text, Zeichen `aria-hidden`; „–“ im Vergleich mit verstecktem Text „nicht enthalten“; Fokus
2 px mit 3 : 1, nie unter dem klebenden Kopf (`scroll-margin`); alle Ziele ≥ 44 px (Prüfsuite 29.2 misst Knöpfe); Kontraste nach R10;
Tastatur: Tab erreicht Segmente, Knöpfe, Umschalter in Lesereihenfolge, die Reihe rollt zum fokussierten Knopf (`scrollIntoView` mit
`inline: 'center'`); 200 % Textgröße ohne Querscrollen; Dekorebenen `aria-hidden` und `pointer-events: none`.

**Abweichungen von bestehenden Regeln** – jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.**

| Nr. | bestehende Regel | Vorschlag | Begründung | Rückfall | bereits geführt als |
|---|---|---|---|---|---|
| J-AB-1 | „24 Zwischentitel und Paketname“ (GEST:449) | Paketname 17/700 (K-21) | höchstens drei Größenstufen je Ansicht (SG 10.1/4); der Preis ist die Titelstufe | Name 24 als dokumentierte Ausnahme (DG-E-2 C) | DG-E-2 A |
| J-AB-2 | Nachbarkarten „bis 5 % kleiner, blasser“ (GEST:452) | nur Deckkraft | keine Skalierung der Bedienschicht (SG 10.7/3) | – | DG T7 |
| J-AB-3 | „Einmal … laufen die Karten ein Stück nach links und federn zurück“ (GEST:452) | entfällt; Anschnitt der Nachbarn zeigt das Wischen | Bedienelemente federn nicht (SG 10.7/2); E-13 | – | AB-9, DG-AB-4 |
| J-AB-4 | empfohlene Karte mit „leichtem grünen Schein oben“ (GEST:452) | entfällt | kein Licht als Flächenmittel der Bedienschicht (DNA Nr. 10) | – | AB-5, E-AB-9 |
| J-AB-5 | „Vorläufige Preise“ als Kasten mit Warnstrich über den Karten (GEST:453) | ein Satz unter der Reihe, ohne „bleibt für Ihren Vertrag fest“ bis O-7 | Vorbehalt kleiner als die Preise; Widerspruch zu PB:55 | Kasten, kleiner gesetzt | AB-4 |
| J-AB-6 | „darunter eine Leiste mit den drei Namen“ (GEST:452) | über der Reihe, mit Monatspreisen | R9: alle Preise ohne Wischen | – | AB-11 |
| J-AB-7 | Vergleich mit allen Merkmalen ungegliedert (GEST:454) | gruppiert, gleiche Zeilen zusammengefasst | Lesbarkeit (Q34); Prüfsuite bleibt erfüllt | ungegliedert | AB-6 |
| J-AB-8 | „bei den Paketen der Knopf des empfohlenen Pakets“ als Cream (GEST:456) | nach einem Tipp auf einen Kartenknopf trägt das gewählte Paket den Cream-Knopf in Reihe und Abschluss; „Empfohlen“ bleibt an Plus | Folge der gewählten Absicht statt Gegenlenkung; gleiche Regel wie im Abschluss (E-3) | Cream bleibt am empfohlenen Paket | neu |
| J-AB-9 | „im Kopf der Seite nur ein Ring-Knopf“ (GEST:456) | der Ring blendet aus, solange Namensleiste oder Kartenreihe das Band unter dem Kopf bis 60 % der Bildhöhe schneidet (Zustand A und B), danach in Zustand A „Paket anfragen“ (K-28) | eine Handlung je Bildschirm; der Ring „Pakete ansehen“ wäre dort sinnlos | Ring bleibt sichtbar | neu |
| J-AB-10 | Vorspann der Pakete „mit dem Zeichen `farbwechsel`“ als Schleife (GEST:447) | entfällt | Entscheidungsfläche ohne Dauerbewegung (DG Dosierregel 1); das Beispielbild trägt die Aussage | Zeichen als Standbild | neu |

### I. Conversion-Begründung

- **Warum an dieser Position.** Nach 01 bis 03 weiß der Besucher, was er bekommt, was sein Kunde sieht und was im Postfach landet; die Frage
  „was kostet es, welches?“ ist dann die nächste (EA S4). Wer früher entschieden hat, erreicht die Fläche mit einem Tipp aus dem Startbild.
  Direkt danach folgt das Formular (ZA 05), der Weg von der Wahl zur Handlung ist kurz (H-E6).
- **Wie die Gestaltung unterstützt.** Alle Preise stehen beieinander (J-R2); der Preisblock nennt, was sonst überraschen würde: Einrichtung
  mit Inhalt, ab wann monatlich, kündbar, netto (E11); ein Weg ist hervorgehoben, aber begründet (J-R8); der Unterschied ist sichtbar statt
  beschrieben (J-R10); die Risikofakten stehen dort, wo die Entscheidung fällt (R8); wer unsicher ist, hat einen leisen zweiten Weg (J-R20).
- **Warum die Informationsmenge angemessen ist.** Vor dem Knopf je Karte etwa 35 bis 45 Wörter in vier Bausteinen; nach dem Knopf Bild und
  Datenblatt; Liste, Vergleich und Bedingungen auf Abruf. Das folgt der Lehre aus Q3 (Merkmalsfülle bei unklarer Präferenz) und der Vorgabe
  „kurze Abschnitte, wenige Wörter“ (SKILL:29-30), ohne Pflichtangaben zu verstecken (§ 5a UWG, Q51).
- **Beitrag zur Zielhandlung.** Z1a bzw. Z1 über den Kartenknopf mit vorgewähltem Paket; Z1+ über Empfehlung mit „Wenn“-Satz, die Team-Zeile,
  die bei Essential und Plus „nicht enthalten“ zeigt, und das Bild der höheren Stufe direkt nebenan; keine Lockvögel, keine Knappheit
  (R7).
- **Zu testende Annahmen:** J-H1 bis J-H16 in 10.5.

---

## 10.5 Offene Fragen an den Inhaber und Testhypothesen

### 10.5.1 Offene Fragen

| Nr. | Frage | Grundlage | Betrifft |
|---|---|---|---|
| J-O-1 | Welches Paket wird empfohlen, und tragen die drei „Wenn“-Sätze als Grund? | O-5; PAK F1; `functions/pakete-seite.js:32-33` | J-R8, Karten |
| J-O-2 | Bleibt der Preis „für Ihren Vertrag fest“, oder gilt der Änderungsvorbehalt? Bis dahin entfällt die Zusage im Verkaufsstand. | O-7; PB:55; `functions/pakete-seite.js:89` | J-R18 |
| J-O-3 | 19 % Umsatzsteuer oder Kleinunternehmerregelung? Danach richtet sich die Steuerzeile. | O-6; `functions/api/recht.js:58` | J-R17 |
| J-O-4 | Genügen Nettopreise auf einer Seite, die auch in die Startseite eingebettet ist? (anwaltlich) | O-25; Q49 | J-R17 |
| J-O-5 | Wird die Einrichtung erstattet, wenn die Vorschau nicht freigegeben wird? Erst dann darf der Festblock mehr sagen. | O-16; PB:60, :70 | Festblock |
| J-O-6 | Wortlaut der Kündigung: „zum Ende des Abrechnungsmonats“ (PB:69) oder „zum Monatsende“ (VK:243)? Wechsel nach unten „ab dem nächsten Abrechnungsmonat“ oder „zum Monatsende“? | O-7 | Festblock, J-R15 |
| J-O-7 | Soll der Hinweis auf den späteren Wechsel nach oben an die Karten rücken? (nimmt Druck, kann den Anteil höherer Pakete beim ersten Kauf senken) | O-26; EA 4.3.3/8 | Karten |
| J-O-8 | Kommen Fotos eines erkennbar erfundenen Beispielbetriebs (bis 6), und gilt „Fensterbau Brandt“ als die eine Beispielfirma? | O-12; PA-Frage 25; G7 | Assets |
| J-O-9 | Wann werden `PAKETE_OFFEN` und `PAKETE_DEMOS` gesetzt? | O-3 | Zustände, J-H7 |
| J-O-10 | Darf der Gesprächsweg „Rückruf“ nennen, solange der Rückruf nur über das Formular angefragt werden kann? Soll eine Telefonnummer auf die Seite? | O-9; `functions/pakete-seite.js:194` | J-R20 |
| J-O-11 | Soll die Zeile „Im ersten Jahr“ (447 / 667 / 1.047 € netto) im Vergleich stehen? | PAK-H15; RE T8 | J-H4 |
| J-O-12 | Freigaben J-AB-1 bis J-AB-10 | 10.4 H | – |
| J-O-13 | Darf Schritt 1 im Kundenkonto die Wahl bestätigen statt sie erneut abzufragen (Änderung an `web/assets/partner.js`)? | CP 5.4 „Paket doppelt wählen“; PAK-H40 | J-H9 |
| J-O-14 | Soll in Zustand A der Festblock sagen, dass die Paketbedingungen noch ein Entwurf sind? | PB:28 | Festblock |
| J-O-15 | Gewünscht: eine weiterreichbare Kurzfassung der Pakete für Mitentscheider (Büro, Partner, Steuerberater)? | RE T12; H-D13 | – |
| J-O-16 | Haptik-Tipp beim Einrasten der Reihe am Telefon? | DG-E-9 | F |

### 10.5.2 Testhypothesen

Prüfwege, die heute möglich sind: Telefon-Video und Bildschirmfotos bei 390 × 844 und 1280 × 800 (SKILL, Abschnitt 8), Sichtprüfung durch
den Inhaber, Gespräche und Lesetests mit Fensterbauern, das Paketfeld im Anfrageformular, Bestellungen je Paket in der Zentrale, Messung von
LCP, INP, CLS. Vergleichstests sind nicht eingerichtet (RE 3.1); ein Trichter für die Verkaufsseite fehlt (O-2). Keine Hypothese nennt eine
erwartete Größe.

| Nr. | Hypothese | Grundlage | Prüfweg und Messgröße | Rückfall |
|---|---|---|---|---|
| J-H1 | Vier Textbausteine vor dem Knopf plus Datenblatt genügen; die volle Liste braucht man selten | Q3; RE E8 | Lesetest „Was bekomme ich mit Plus zusätzlich?“: Zeit und richtige Antworten | zwei bis drei Haken je Karte (IA-AB-11) |
| J-H2 | „ab Livegang, monatlich kündbar“ am Preis beantwortet die Bindungsfrage am Ort | F-06; RE E12 | Gespräche; Fragen im Formular nach Thema auszählen | nur im Festblock |
| J-H3 | Gruppierter Vergleich wird am Telefon schneller und richtiger gelesen | RE T7; PAK-H10 bis -H13 | Lesetest mit Zeit und richtigen Antworten | ungegliedert, Gruppen als Zwischenzeilen |
| J-H4 | „Im ersten Jahr“ senkt Rückfragen zu Kosten, ohne Anfragen zu senken | Q21, Q43; Gegenbefund Q20 | vorher/nachher: Anfragen je Aufruf, Rückfragen zu Kosten | Zeile entfällt |
| J-H5 | Eine Unterschiedszeile mit beiden Differenzen erhöht den Anteil höherer Pakete | RE T5; keine Studie | Paketfeld im Formular, Bestellungen je Paket | ohne Zeile (Grundfassung) |
| J-H6 | Der Satz unter dem Knopf in Zustand B senkt die Scheu vor „bestellen“ | RE E11, E17 | Abbrüche vor Schritt 2 im Kundenkonto (nach `PAKETE_OFFEN`) | ohne Satz |
| J-H7 | Ein Demo-Link je Karte erhöht Anfragen und Verständnis der Unterschiede | RE T11; Q41; Q44 (Herstellerdaten) | Aufrufe der Demos, Anfragen danach; Gespräche | Demos nur im Anhang A1 |
| J-H8 | Cream folgt der Wahl, ohne den Anteil höherer Pakete zu senken | E-3; SKILL:50 | Paketfeld und Bestellungen je Paket vorher/nachher; Gespräche | Cream bleibt am empfohlenen Paket |
| J-H9 | Bestätigung mit Zahlen in Schritt 1 senkt Abbrüche im Bestellformular | PAK-H38, -H40; RE T13 | Abbrüche je Schritt im Kundenkonto | Schritt 1 wie heute |
| J-H10 | Der Seitenübergang mit gleitendem Beispielbild wirkt als Fortsetzung und verlangsamt nichts | SG 10.7 | Telefon-Video, Urteil des Inhabers; INP und Navigationszeit | nur Überblendung, dann ohne Übergang |
| J-H11 | Bilder von 306 × 254 machen die Markenstufe am Telefon erkennbar | H-D8; H-E3 | Lesetest: Stufe am Bild benennen | Konzept P2 als Variante prüfen |
| J-H12 | Die Leitlinien des Datenblatts erklären „Powered by“ schneller als Text allein | F-24; DG-H-5 sinngemäß | Lesetest „Wo sieht Ihr Kunde einen Hinweis auf eeziframes?“ | Datenblatt ohne Leitlinien |
| J-H13 | Die Feder im Bild erfüllt „Trägheit und Federn“ für den Inhaber | SKILL:43; DG-H-2 | Telefon-Video mit und ohne Feder | Gegenlauf nach Position (Bestand `--d`) |
| J-H14 | Der ausgeblendete Kopf-Ring nimmt Konkurrenz, ohne Orientierung zu kosten | RE E2, E3 | Sichtprüfung; Gespräche | Ring bleibt |
| J-H15 | Die „Wenn“-Sätze werden als Grund der Empfehlung verstanden | RE T4; Q4 | Gespräche: Grund in eigenen Worten | `kurzText()` plus Empfehlungsgrund aus EA 4.3.3 |
| J-H16 | Die Namensleiste mit Preisen wird als Überblick und Navigation verstanden, nicht als zweite Auswahl | R9; E-3 | Telefon-Video, Gespräch „Was kostet Signature?“ ohne Wischen | Leiste unter der Reihe, Preise im Lead |

Der Test der Leitidee (E gegen C′, EV 7.6.3) bleibt davon unberührt; Konzept P4 dieses Kapitels ist dort die Paketwahl von C′.

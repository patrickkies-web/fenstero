# Konzept B – Conversion-First Product Architecture

Ergebnis 6 des Website-Blueprints (MASTER-PROMPT V4), Phasen F und G, Konzept B von vier (A Immersive Product Experience,
B Conversion-First Product Architecture, C Guided Decision, D eigener Ansatz). Stand 24.10.2026, Arbeitszweig
`claude/design-dna-styleguide`, gelesen bis Commit `a4d6843`. Planungsdokument: Das Repository wurde nur gelesen, gebaut und geändert
wurde nichts.

**Grundlage**

| Kürzel | Datei |
|---|---|
| PA | [../01-projektanalyse.md](../01-projektanalyse.md); „PA-Frage n“ = Frage n in PA 1.11 |
| DG | [../02-design-grammatik.md](../02-design-grammatik.md): Grundregeln G1–G9 (2.3.1), Abschnittstypen T0–T14, Stufen 1–4 (2.4.2), DG-AB-n, DG-E-n, DG-H-n |
| RE | [../03-recherche.md](../03-recherche.md): Erkenntnisse E1–E19, Regeln R1–R14, Tests T1–T19 |
| EA | [../04-entscheidungsarchitektur.md](../04-entscheidungsarchitektur.md): Z1, Z1a, Z1+, Z2a, Z2; Gruppen FB-1 bis FB-7, HE-1 bis HE-8, M-1 bis M-7; Stufen S0–S8 (Fensterbauer) und B1–B5 (Hauseigentümer); Zweifel F-nn, H-nn; H-D-n; AB-n; O-n |
| IA | [../05-informationsarchitektur.md](../05-informationsarchitektur.md): Abschnitte V1–V14, H1–H7, Bereiche K01–K37, IA-AB-n, IA-H-n, IA-O-n |
| DNA | `docs/design-dna/03-design-dna.md`: Konstruktionsformel 5.1, Prinzipien Nr. 1–11 (5.2), Stellschrauben und Dialekte 5.3, Signature-Effekte 5.4, Abgrenzung 5.5 |
| SG | `docs/design-dna/04-styleguide.md` (Kapitel 6, 10.1–10.10; Zahlen nach 10.9, gilt bei Abweichung); „SG 10.7/2“ = Abschnitt 10.7, Regel 2 |
| DNA-B, PROMPT, VGL | `docs/design-dna/05-ergebnis-b-styleguide.md` (B.1 Regeln, B.2 Ebenen, B.3 Bausteine, B.8 Abnahme), `…/06-design-prompt.md`, `…/02-vergleich.md` |
| SKILL, DR, GEST | `.claude/skills/premium-gestaltung/SKILL.md` (Anforderungen des Inhabers), `…/designrichtung.md` und `docs/GESTALTUNG.md` (heutige Regeln, dürfen hinterfragt werden) |
| VK, PB | `web/fuer-fensterbauer/index.html`, `web/konfigurator-bedingungen/index.html` |

**Kennzeichnungen**

- `Datei:Zeile` ist ein Beleg im Repository; was keinen Beleg hat, steht als **[H]** (Hypothese) da.
- **[V]** verbindlich: Vorgabe des Inhabers (SKILL), DNA-Prinzip (5.2), SG-[Pflicht], Regel R1–R14, Recht, Prüfsuite oder eine in DG 2.4.1
  festgelegte Hausregel. **[H]** experimentelle Gestaltungshypothese; sie wird erst nach Prüfung (Telefon-Video, Sichtprüfung durch den
  Inhaber, Lesetest mit Fensterbauern) zur Regel.
- **Textentwurf**: neuer Wortlaut, nur aus belegten Fakten gebildet; braucht die Freigabe des Inhabers. Entwürfe für Hauseigentümer sind
  ohne Anrede formuliert, solange EA O-13 offen ist.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig** markiert jeden Vorschlag gegen eine Regel in GEST oder DR;
  gesammelt als B-AB-1 bis B-AB-9 am Ende des Abschnitts „Website-Architektur“.
- **VB1–VB11** sind die Abschnitte der Seite für Fensterbauer in Konzept B, **HB1–HB7** die der Ansicht Hauseigentümer, **KB-1 bis KB-4**
  neue Bausteine, **B-H-n** die Annahmen im letzten Abschnitt. V-, H- und K-Nummern ohne „B“ verweisen auf IA.
- Bildschirm n am Telefon = y von (n − 1) × 844 bis n × 844 bei 390 × 844; Schreibtisch 1280 × 800, Stichprobe 1024 × 768. „Scrollstand
  2,8“ heißt: die Oberkante des Bildschirms steht 2,8 Bildschirmhöhen tief in der Seite. Alle Lagen und Maße sind geplant, nicht gemessen.
- Schriftgrößen nur 13, 15, 17, 24, 40, am Telefon 32 statt 40 (SKILL:69); höchstens drei Größenstufen je Ansicht (SG 10.1/4).

**Methode.** Das Konzept leitet die Seitenfolge aus der Kette S1–S7 (EA 4.4) ab, ordnet sie aber nach der Frage „Was braucht ein
Besucher, der kaufen will, als Nächstes?“ statt „Was muss er vorher verstanden haben?“. Geprüft wurde jede Entscheidung aus simulierten
Perspektiven: Inhaber eines kleinen Fensterbaubetriebs mit Vorwissen (FB-2), derselbe ohne Vorwissen (FB-1), Büro eines Betriebs als
Mitentscheider (M-1), B2B-Vertrieb, Hauseigentümer vor dem Fenstertausch (HE-3), Prüfung der Barrierefreiheit, Leistungsprüfung auf einem
mittleren Android-Telefon. Das ist eine Analysemethode, keine Nutzerstudie. Im Repository gibt es keine Nutzerforschung, Besucherzahlen,
Geräteanteile oder Konversionsraten (PA, „Was es nicht gibt“); Aussagen über Wirkung sind Hypothesen, Wahrscheinlichkeiten werden nicht
genannt.

**Was in jedem Konzept gleich bleibt** (IA 5.7.4): alle Adressen und Anker (IA 5.1), die Zielhandlungen (EA 4.1), die festen Erwartungen
der Prüfsuite (h1 der Verkaufsseite wörtlich mit grünem „Marke“; die h2-IDs `die-idee`, `so-funktioniert-es`, `pakete`, `ablauf`, `demos`,
`bestellen`, `haeufige-fragen`; die Sätze „ohne ihn programmieren zu lassen“, „Ihr eigenes Baby“, „3 bis 5 Werktage“; Ablauf in den sechs
Wörtern der Statusleiste; mindestens sechs Fragen zu Domain, Kündigung, Datenschutz, Kunde und Website; Eyebrow und h1 der Startseite;
`scripts/pruefen-instanzen/29.mjs:107-118`), die Regeln R1–R14, die verbindliche DNA (DG 2.4.1) sowie Name, Wortmarke und Logo. Die
Reihenfolge der Abschnitte prüft die Suite nicht (`scripts/pruefen-instanzen/29.mjs:113-116` sucht nur das Vorhandensein der h2).

---

## Leitidee (drei bis fünf Sätze) und für wen es am besten passt

**Leitidee.** Konzept B behandelt die Seite für Fensterbauer als Angebot und nicht als Erzählung: Der erste Bildschirm sagt, was ein Betrieb
kauft, was die drei Pakete im Monat kosten und wie er zu ihnen kommt; der zweite zeigt die Pakete selbst. Das Produkt beweist sich im
Angebot, denn jede Paketkarte trägt das Bild des Konfigurators in ihrer Markenstufe, sodass Preis, Unterschied und Gegenwert in einem Blick
stehen. Was danach kommt (Anfrage, Inhalt einer Anfrage, Kundensicht, Kundenschutz, Ablauf), ist eine Folge kurzer Prüfstationen für alle,
die noch zweifeln; eine Kaufleiste im Daumenbereich hält am Telefon auf jedem dieser Bildschirme das gewählte Paket und die nächste Handlung
bereit. Mit voller Kraft inszeniert wird nur im Startbild und im Produktbeweis; die Entscheidungsflächen bleiben ruhig, flach und sofort
lesbar.

**Kurzformel:** Angebot zuerst, Begründung danach, Handlung immer im Daumen.

**Für wen es am besten passt** (Gruppen nach EA 4.2; Eignung abgeleitet, [H])

| Gruppe | Eignung | Begründung |
|---|---|---|
| FB-2 sucht Software oder Konfigurator (K2, mittel) | sehr gut | sieht alle drei Monatspreise ohne Scrollen, die erste Paketkarte nach einem Wisch (RE E1, T1); seine Leitfrage „Was kostet es, und was ist anders?“ (EA 4.2.1) beantworten Preisreihe und Karte |
| FB-3 kam über „Powered by EEZIframes“ (K3) | sehr gut | kennt das Produkt; seine Frage „geht es ohne diesen Hinweis?“ beantwortet die Karte Signature im zweiten Bildschirm |
| FB-6 Prüfer kurz vor dem Kauf | sehr gut | Preis, Unterschiede, Risikofakten, Bedingungen und Formular liegen in den ersten vier Telefon-Bildschirmen |
| M-1, M-4, M-5 Mitentscheider mit Link | gut | `#pakete` trägt Preis, Einrichtung, Steuerzeile, Risikofakten und den Link zu den Paketbedingungen an einer Stelle |
| FB-4 hat ein Aufmaßblatt in der Hand (QR-Code) | gut | Hinweis K34, dann sofort der Preis „solcher Anfragen unter eigenem Namen“; das Blatt erkennt er erst in VB4 wieder (in IA früher) |
| FB-1 Fachfrage, FB-5 ohne Kontext (K1) | eingeschränkt | trifft den Preis vor der Erklärung; die Hauptaussage tragen nur h1, Chips und Beispielbilder; Beweis und Erklärung kommen ab Scrollstand 3,8 |
| HE-3 will messen, HE-5 direkt | sehr gut | Preis und Start im ersten, das Aufmaßblatt mit Preisetikett im zweiten Bildschirm |
| HE-1, HE-2, HE-4 | über die Ratgeber | die Ansicht ist kurz; die Ratgeber-Zeile führt Unentschlossene in den Weg der sechs Schritte |
| FB-7, P-1 Bestands- und Paketkunden | neutral | „Anmelden“ im Menü (Telefon) und im Kopf (Schreibtisch) |

B passt am besten, wenn der Inhaber die Paketanfrage (später die Bestellung) als Hauptumwandlung der ganzen Website bestätigt (PA-Frage 1,
EA O-1) und die meisten Fensterbauer mit Vorwissen kommen (K2, K3). Kommt der größere Teil über Fachfragen mit der Brille „Aufmaß“ (FB-1),
spricht das eher für eine Folge, die vor dem Preis erklärt, wie die Ausgangsbasis in IA 5.4.2. Welche Gruppe größer ist, ist unbekannt
(EA 4.2.1, „Nicht belegt“).

---

## Website-Architektur (welche Seiten, Abweichungen von 05-informationsarchitektur.md)

### Seiten

Konzept B legt keine Seite an und streicht keine (IA 5.1.1 Nr. 1 und 2, 5.1.4 gelten). Es ändert Reihenfolge und Gewicht auf den drei
Hauptflächen und ergänzt zwei Bausteine für die Handlung.

| Seite oder Bereich | Ausgangsbasis (IA) | Konzept B |
|---|---|---|
| `/` Startseite, Rahmen | eine Adresse, zwei Ansichten, Standard „Hauseigentümer“, Glas-Umschalter über dem Startbild (IA 5.4.1, K03) | gleich; EA AB-1 wird nicht beansprucht, weil Google die Standardansicht rendert und Eyebrow und h1 wörtlich geprüft werden. Neu: am Telefon scrollt der Kopf mit, und jede Ansicht hat ihre feste untere Leiste (KB-1 bzw. KB-2) |
| `/#hauseigentuemer` | H1–H7, Telefon ≈ 6,3 Bildschirme | HB1–HB7, ≈ 4,75 Bildschirme bis zur Wechselkarte; das Aufmaßblatt mit Preisetikett steht im zweiten Bildschirm, die Bildfolge (IA K17) entfällt zugunsten eines Ergebnisbilds |
| `/#fensterbauer` | Einbettung V1–V14 | Einbettung VB1–VB11 mit Kaufleiste; Meldungsstapel rückt unter den Glas-Umschalter (VB1) |
| `?von=pdf` | Hinweis K34 vor V1 | gleich |
| `/fuer-fensterbauer/` | V1–V14, Telefon ≈ 12,5 Bildschirme, Pakete ab Bildschirm 6, Formular ab 9 | VB1–VB11, ≈ 10,7 Bildschirme bis zum Abschluss (mit Fuß ≈ 11,5), Paketkopf ab Scrollstand 0,9, erste Karte ab 1,3, Formular ab 2,8 |
| 5 Fachartikel | Handlungsbaustein K36, Ziel Seitenanfang, beim Artikel „Fensterbau-Software“ `#pakete` | gleich; weil der Seitenanfang in B schon die Preise trägt, landet auch FB-1 nach einem Bildschirm bei den Paketen |
| `/konfigurator-bedingungen/` | Absicherungsseite, Ring „Pakete ansehen“ | gleich; falls die Kurzfassung als PDF entsteht (IA-O-6), steht ihr Link zusätzlich im Festblock von VB2 |
| `/app/`, Ratgeber, Konten, Rechtsseiten, 404, Demo-Domains | IA 5.1.2 | gleich |

### Abweichungen von 05-informationsarchitektur.md

1. **Reihenfolge der Verkaufsseite: Angebot → Anfrage → Begründung.** VB1 Startbild → VB2 Pakete (mit Festblock, Vergleich, Gesprächsweg)
   → VB3 Bestellen oder anfragen → VB4 Beweis (Die Idee und was in jeder Anfrage steht) → VB5 So funktioniert es (mit der Leiste
   Elementarten) → VB6 Live-Demos → VB7 Kundenschutz → VB8 Ablauf → VB9 Häufige Fragen → VB10 Hintergrund → VB11 Abschluss. Die Pakete
   rücken von Platz 8 auf Platz 2, das Formular von Platz 11 auf Platz 3. Grundlage: SKILL:50-51 („Pakete sichtbar machen … nächste Handlung
   klar“), RE E1 (rund 74 % der Betrachtungszeit in den ersten zwei Bildschirmhöhen), EA 4.3.2/7 (Formular direkt nach Paketen und
   Risikoblock, IA wich davon mit IA-H-7 ab), IA 5.7.4 (Spielraum „Lage der Pakete“, „Lage des Formulars“).
2. **V3 und V5 werden eine Szene (VB4).** Der Einzeiler aus dem Kontaktformular und das Aufmaßblatt, das ihn überdeckt und sich danach in
   seine Schichten zerlegt, sind ein Fokusträger statt zweier. Die IDs `die-idee` (h2, Pflicht) und `was-in-jeder-anfrage-steht` (h3 in
   VB4) bleiben (IA 5.1.5).
3. **Leisten:** V2 (Elementarten) wandert als Abschluss in VB5 „So funktioniert es“, weil sie zeigt, was der Kunde des Betriebs planen
   kann. V7 (Kennzahlen) entfällt als Leiste; die geklärten Fakten stehen statisch im Festblock von VB2 („Keine Gebühr je Anfrage“) und in
   VB8 („meist 3 bis 5 Werktage“). Damit stehen sie dort, wo entschieden wird (R5), und vor den Paketen bewegt sich nichts.
4. **Anbieterblock K28** wandert von V10 an das Formular (VB3): Die Frage „Antwortet überhaupt jemand?“ (F-20; EA 4.3.2/3) entsteht dort,
   wo man Namen und E-Mail-Adresse preisgibt.
5. **Neue Bausteine:** KB-1 Kaufleiste (Verkaufsseite und Ansicht Fensterbauer, Telefon), KB-2 Startleiste (Ansicht Hauseigentümer,
   Telefon), KB-3 Preisreihe im Startbild der Verkaufsseite, KB-4 Preisetikett im Ergebnisbild der Ansicht Hauseigentümer.
6. **Ansicht Hauseigentümer:** H2 und H3 werden HB2 (das Aufmaßblatt mit Preis und Inhalt), HB3 ist neu (Ablauf in vier Schritten und
   Datenschutz), der Ratgeber-Weg (H4) wird eine Wischzeile nach den Fragen (HB5).
7. **Kopf am Telefon:** Auf den Verkaufsflächen (Startseite in beiden Ansichten, Verkaufsseite) klebt er nicht, Menü und Handlung liegen in
   der unteren Leiste (B-AB-1). Ratgeber, Fachartikel, Paketbedingungen, Rechtsseiten und 404 behalten den Kopf aus IA 5.3.2; dort gibt es
   keine Leiste.
8. **Kopfknopf am Schreibtisch** wechselt sein Ziel, sobald die Pakete passiert sind [H, verwandt mit IA-H-12].

### Navigation in Konzept B

**Telefon (bis 1023 px)**

- **Kopf** 56 px (6,6 % von 844), scrollt mit der Seite. Links Logo (Ziel 44 × 44; im Kontext Fensterbauer → Anfang der Verkaufsseite,
  IA-H-5), rechts „Menü“ (44 × 44). Über Bildern flächenlos mit Scrim aus `#161616` (60 % → 0 über 96 px, DG 2.3.2), über Inhalt opak mit
  Haarlinie. Kein Kopfknopf.
- **Untere Leiste** (KB-1 auf Verkaufsflächen für Fensterbauer, KB-2 in der Ansicht Hauseigentümer): 64 px plus Sicherheitsabstand des
  Geräts (`env(safe-area-inset-bottom)`), ohne diesen 7,6 % der Höhe. Sie erscheint, sobald die Cream-Pille des Startbilds den Bildschirm
  verlassen hat; der Kopf ist dann schon weggescrollt. Damit ist zu jedem Zeitpunkt genau ein Menü-Knopf sichtbar, und die fest belegte
  Fläche bleibt unter 8 % (SG 10.1, Kopfzeile ≤ 8 %).
- **Menü:** Blatt von unten bis etwa 85 % der Höhe (IA K02), öffnet aus Kopf oder Leiste, Ein- und Ausblenden nur über Deckkraft 220 ms
  (DG-E-12, Empfehlung). Einträge wie IA 5.3.3; die Sprungmarken heißen in B „Pakete“, „Anfragen“, „So funktioniert es“, „Ablauf“,
  „Fragen“.
- **Ohne JavaScript:** keine untere Leiste; „Menü“ im Kopf ist eine Sprungmarke zur Navigation im Fuß (IA 5.3.8).

**Schreibtisch (ab 1024 px)**

- **Kopf** 64 px (8 % von 800), klebt, opak über Inhalt, flächenlos über Bildern (DG-AB-10). Logo, auf `/` der Umschalter daneben,
  Sprungmarken 15 px „Pakete · So funktioniert es · Ablauf · Fragen“, „Anmelden“ als Textlink, rechts ein Ring-Knopf (nie Cream, GEST:456).
- **Ring-Knopf** [H]: bis zum Ende von VB2 „Pakete ansehen“ → `#pakete`; danach **Textentwurf** „‹Kurzname› anfragen“ → `#frage` mit
  vorgewähltem Paket (Zustand B „… bestellen“). Ausgeblendet (Deckkraft 0, nicht fokussierbar), solange die Cream-Pille des Startbilds,
  die Paketkarten, das Formular oder die Abschluss-Paketwahl im Bild sind (IA N4, erweitert).
- Keine untere Leiste.

### Abweichungen von bestehenden Regeln in Konzept B (gesammelt)

Jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.**

| Nr. | Bestehende Regel | Vorschlag in B | Begründung |
|---|---|---|---|
| B-AB-1 | Kopf „klebt oben, halbtransparent wie die App“ (GEST:428); Umschalter am Telefon als Zeile der klebenden Kopfzeile (GEST:190); Kopfzeile der Ansicht Hauseigentümer mit „Fenster ausmessen“ (GEST:192) | Am Telefon scrollt der Kopf auf den Verkaufsflächen mit; Menü und Handlung liegen in einer festen unteren Leiste (KB-1, KB-2), die erst nach dem Startbild erscheint | fest belegte Fläche ≤ 8 % (SG 10.1); Handlung im Daumenbereich (RE E18); die App hat schon eine feste untere Leiste mit Zurück und Weiter (PA 1.9/3), das ist erwartbar (E2); „nächste Handlung klar“ (SKILL:50-51). Umfasst IA-AB-3 |
| B-AB-2 | Abschnitte der Verkaufsseite „in dieser Reihenfolge“ (GEST:447) | Startbild → Pakete → Anfrage → Beweis → So funktioniert es → Demos → Kundenschutz → Ablauf → Fragen → Hintergrund → Abschluss | wie Abweichung 1 oben; geht über EA AB-3 und IA-AB-2 hinaus |
| B-AB-3 | „Leisten unter dem Startbild: zwei waagerechte Leisten“, die zweite in Cream mit Kennzahlen (GEST:451) | Leiste Elementarten als Abschluss von VB5; Kennzahlen-Leiste entfällt, geklärte Fakten stehen statisch in VB2 und VB8 | vor den Paketen keine bewegte Bandform (RE E5); Entscheidendes an der Stelle der Entscheidung (R5); „0 Zeilen Code“ und „5 Minuten“ sind offen (EA O-10, O-11); eine Cream-Fläche je Bildschirm (DG-AB-7) |
| B-AB-4 | Startbild am Telefon „540 bis 640 px hoch“, Text zieht 128 px in den Auslauf, „Kurz gesagt“ als Lead, Ring „Konfigurator ausprobieren“ (GEST:447) | Foto 480 px, Text zieht rund 96 px in den Auslauf; statt „Kurz gesagt“ die Preisreihe KB-3; Ring in Zustand A **Textentwurf** „Beispiel-Anfrage ansehen“ → `#was-in-jeder-anfrage-steht`, mit Demos „Live-Demo ansehen“ | Preis und Weg in den ersten 844 px (R12, T1); „Konfigurator ausprobieren“ führt in Zustand A in die App für Hauseigentümer mit Paywall und Du-Anrede (PA 1.9/4; EA W3 „heute nur eingeschränkt“); ersetzt IA-AB-12 |
| B-AB-5 | Vergleich „als `details` unter den Karten“ (GEST:454) | am Schreibtisch offen, Zeile für Zeile in den drei Kartenspalten fortgesetzt; am Telefon zugeklappt | Unterschiede ohne Klick lesbar, wo Platz ist (EA AB-6, RE T7); am Telefon kein Querscrollen (R9) |
| B-AB-6 | „‚Die Idee‘ und Kundenschutz als Kacheln (Nummer bzw. Haken)“ und getrennte Abschnitte „Die Idee“ und „Was in jeder Anfrage steht“ (GEST:447, :450) | „Die Idee“ und der Inhalt einer Anfrage als eine Szene mit einem Fokusträger (Aufmaßblatt); die vier Punkte der Idee als Zeilen ohne Kacheln | ein Held statt zweier aufeinanderfolgender Papierbilder; Strichsymbole und Nummernkacheln als Hauptträger gegen SKILL:41 (DG 2.3.5) |
| B-AB-7 | „Karten und Bänder erscheinen beim Scrollen 24 px aufwärts und von 0,98 auf 1 in 600 ms“ (GEST:448; DR 3.5 „Auftritt“) | Entscheidungs- und Arbeitsflächen (VB2, VB3, VB11, HB6) stehen ohne jeden Auftritt; übrige Abschnitte blenden einmal nur über Deckkraft ein (DG-AB-2) | eine Fläche, auf der entschieden wird, ist sofort lesbar; kein Bewegungsbeginn neben Preis und Knopf (RE E2, E5) |
| B-AB-8 | Ansicht Hauseigentümer „Hero …, Kennzahlen, ‚Was im Aufmaß steckt‘, Ratgeber als Karten, am Ende die helle Karte“ (GEST:192) | Angebotsbühne → Aufmaßblatt mit Preisetikett → So geht es mit Datenschutz → Fragen → Ratgeber-Zeile → Messaufforderung → Wechselkarte (Ring) | Preis vor Aufwand (R13); Ergebnis statt Symbolkarten (SKILL:41); Ende mit dem Start (EA H-D12); widersprüchliche Kennzahlen (PA 1.9/4). Ersetzt IA-AB-5 |
| B-AB-9 | „Je Seite bricht mindestens einmal etwas aus seinem Rahmen“ (DR 3.3) | Verkaufsseite mit genau einem Rahmenbruch (Lichtübertrag aus VB1); Ansicht Hauseigentümer ohne Rahmenbruch | dort ist das Signature-Budget der einzigen Stufe-3-Bühne mit dem Glas des Umschalters ausgeschöpft (DG 2.4.2); übernimmt DG-AB-18 |

**Übernommen** (Begründung dort): EA AB-4 (Verkaufsstand als Satz), AB-5 = DG-AB-14 (Empfehlung ohne Schein), AB-6 (gruppierter
Vergleich), AB-8 = DG-AB-5 (autonome Bewegung endet), AB-9 = DG-AB-4 (Wischen ohne Überschwingen), AB-10 = DG-AB-13 (keine
Anheftstrecke am Telefon), AB-11 (Namensleiste über der Reihe); IA-AB-1 (Altbestand nicht im Fuß), IA-AB-4, IA-AB-6, IA-AB-8 (Platzhalter
entfallen), IA-AB-9, IA-AB-10, IA-AB-11 (nur Unterschiede auf der Karte); DG-AB-1 (Lichtkante statt `--float`), DG-AB-2, DG-AB-3,
DG-AB-6, DG-AB-8 (vier Radien), DG-AB-9, DG-AB-10, DG-AB-15 (Parallaxe nur der Bildebenen; B zeigt keinen Lesefortschritt), DG-AB-16,
DG-AB-17, DG-AB-19. **Nicht übernommen:** IA-AB-2 und IA-AB-7 (B geht weiter, B-AB-2, B-AB-3), IA-AB-5 (ersetzt durch B-AB-8), IA-AB-12
(ersetzt durch B-AB-4).

---

## Seitenaufbau der Hauptseiten: Startseite, Seite für Fensterbauer, Einstieg für Hauseigentümer

### Startseite `/`: Rahmen und Weiche

**Aufgabe in B.** Jede der zwei Ansichten beginnt mit ihrem Angebot samt Preis und endet mit ihrer Handlung; der Wechsel bleibt leise
(Umschalter oben, Wechselkarte unten). Die Startseite ist kein dritter Ort mit eigener Botschaft.

| Nr. | Rahmenteil | Funktion | Inhalt | Lage und Größe | Gewicht |
|---|---|---|---|---|---|
| R1 | Bänder (K04) | Stand melden | nur die Pilotleiste ohne Server (`web/assets/gemeinsam.js:347-357`); das Einführungsband entfällt auf `/` (IA-AB-6), der Preis steht in der Preiszeile von HB1 | höchstens ein Band, 40 px, über dem Kopf | minimal |
| R2 | Kopf (K01) mit Umschalter (K03) | orientieren, Zielgruppe wählen | Telefon: Logo, Menü; Umschalter als Glas-Segment „Hauseigentümer · Fensterbauer“ über dem Foto (IA K03) | Telefon: Kopf 56 px, scrollt mit (B-AB-1); Segment 260 × 44 px bei y 68–112. Schreibtisch: Kopf 64 px klebend, Segment neben dem Logo | klein, aber im ersten Bildschirm |
| R3 | Hinweis `?von=pdf` (K34) | FB-4 abholen | wie IA 5.4.4 a, Glas-Karte ohne Cream | ≤ 180 px über dem oberen Fotorand von VB1; der Meldungsstapel rückt dann nach unten | nur mit Parameter |
| R4 | Ansicht | Hauptinhalt | HB1–HB7 oder, eingebettet, VB1–VB11 | – | – |
| R5 | Wechselkarte (K06) | leiser Wechsel | wie IA (Ring, nicht Cream; IA-AB-9) | Ende der Ansicht, ≈ 0,3 Bildschirme | leise |
| R6 | Fuß kurz (K07) | Recht, Wechsel, Kontakt | wie IA 5.3.5 | ≈ 0,85 Bildschirme | ruhig |
| R7 | Textfassung (K08) | Crawler ohne JavaScript | Abschnitte HB1–HB6 in Textform in derselben Folge, Steckbrief (`web/index.html:69-80`), Block „Für Fensterbauer“ mit VK:61 und Links | – | – |
| R8 | untere Leiste je Ansicht (neu) | Handlung im Daumenbereich | Ansicht Hauseigentümer: Startleiste KB-2; Ansicht Fensterbauer: Kaufleiste KB-1 aus der eingebetteten Seite | Telefon bis 1023 px, 64 px; beim Wechsel der Ansicht wird die Leiste getauscht, nie stehen beide | Handlung |

### Seite für Fensterbauer: `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`)

**Ziel:** Z1 (Zustand B), bis dahin Z1a; Z1+ über die Empfehlung und den Unterschied je Karte. **Länge:** Telefon ≈ 10,7 Bildschirme bis
zum Abschluss, mit Fuß ≈ 11,5 (IA ≈ 12,5, heute ≈ 19); Schreibtisch ≈ 10,3 bzw. 10,9 [H]. **Pakete:** Paketkopf im Anschnitt des ersten
Bildschirms, Preis und Knopf der empfohlenen Karte vollständig im zweiten.

**Übersicht** (Stufe und Typ nach DG 2.3 und 2.4.2; „Anteil“ = Anteil an der Seitenhöhe am Telefon)

| Nr. | Abschnitt | Anker | Kette (EA) | Typ · Stufe | Telefon y (Scrollstand) | Anteil | Schreibtisch, Bildschirm | Cream im Abschnitt |
|---|---|---|---|---|---|---|---|---|
| VB1 | Angebotsbühne | – | S1 + Preisanker S4 | T1 · 4 | 0–772 (0–0,91) | 8 % | 1 | „Pakete ansehen“ |
| VB2 | Die Pakete: Karten, Festblock, Vergleich, Gesprächsweg | `#pakete` (h2), `#paket-essential`, `#paket-plus`, `#paket-signature`, `#vergleich` | S4 + S5-Kern | T7 · 2 | 772–2.330 (0,91–2,76) | 16 % | 2–3 | Knopf der empfohlenen Karte |
| VB3 | Bestellen oder anfragen | `#bestellen` (h2), `#frage` | S6 | T10 · 1 | 2.330–3.180 (2,76–3,77) | 9 % | 4 | „Frage senden“ (Zustand A) |
| VB4 | Beweis: Die Idee und was in jeder Anfrage steht | `#die-idee` (h2), `#was-in-jeder-anfrage-steht` (h3) | S2 + S3 | T5 mit T3 A · 3 | 3.180–4.640 (3,77–5,50) | 15 % | 5–6 | – (Kaufleiste) |
| VB5 | So funktioniert es, mit Leiste Elementarten | `#so-funktioniert-es` (h2) | S3 | T4 · 3 | 4.640–5.800 (5,50–6,87) | 12 % | 7 | – |
| VB6 | Live-Demos | `#demos` (h2) | S3, Probieren | T4-Anhang · 1 | 5.800–6.060 (6,87–7,18) | 3 % | 7–8 | – |
| VB7 | Ihre Kunden bleiben Ihre Kunden | `#kundenschutz` | S5 | T6 · 2 | 6.060–6.640 (7,18–7,87) | 6 % | 8 | – |
| VB8 | Von der Bestellung bis zum Livegang | `#ablauf` (h2) | S5 | T8 · 2 | 6.640–7.600 (7,87–9,00) | 10 % | 8–9 | – |
| VB9 | Häufige Fragen | `#haeufige-fragen` (h2) | S5 | T9 · 1 | 7.600–8.200 (9,00–9,72) | 6 % | 9–10 | – |
| VB10 | Hintergrund, zugeklappt | `#warum-kunden-selbst-planen`, `#quellen`, `#wissen-fuer-fensterbauer` | – | T9-artig · 1 | 8.200–8.500 (9,72–10,07) | 3 % | 10 | – |
| VB11 | Abschluss: Paketwahl | – | S6, zweite Gelegenheit | T11 · 2 | 8.500–9.020 (10,07–10,69) | 5 % | 10 | Zeile des empfohlenen Pakets |
| – | Brotkrumen, Fuß kurz | – | – | T0 · 1 | 9.020–9.700 (10,69–11,49) | 7 % | 10–11 | – |

**Rhythmus** (DG 2.3.17/6, Dosierregeln 2.4.2): genau ein Abschnitt der Stufe 4 (VB1); VB4 und VB5 sind die einzigen zwei Abschnitte der
Stufe 3 in Folge, davor und danach Ruhe (VB3, VB6); alle Entscheidungs- und Arbeitsflächen (VB2, VB3, VB11) bleiben bei Stufe ≤ 2 ohne
inszenierende Signature [V nach DG Dosierregel 1].

---

**VB1 Angebotsbühne** (S1 und Preisanker; Stufe 4; Telefon Bildschirm 1, Schreibtisch Bildschirm 1)

- **Funktion:** In einem Bildschirm vier Antworten: Ist das für meinen Betrieb? Was ist es? Was kostet es? Wie komme ich hin?
- **Inhalt:**
  - Kicker „Für Fensterbauer und Fensterhändler“ (VK:56), 13 px Technikstimme, grün.
  - h1 „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“, grün „Marke“ (VK:57; Prüfsuite wörtlich).
  - Haken-Chips in einer Zeile, **Textentwurf** (gekürzt aus VK:58, wie IA V1): „Ihre Domain · Ihre Marke · Anfrage als PDF“. Der Chip
    „Kunden planen selbst“ entfällt (SKILL:24).
  - **Preisreihe KB-3**, zwei Zeilen 13 px, Ziffern gleich breit, **Textentwurf** aus `web/assets/pakete.js:44-60`: Zeile 1
    „Essential 29 € · Plus 39 € · Signature 64 €“ (Beträge fett in `--text`, Namen in `--muted`; Kurznamen nach PA-Frage 22), Zeile 2
    „im Monat, netto, plus Einrichtung ab 99 € · vorläufige Preise“ (der Zusatz verschwindet mit `VORLAEUFIG = false`).
  - Cream „Pakete ansehen“ → `#pakete` (VK:63).
  - Ring in Zustand A **Textentwurf** „Beispiel-Anfrage ansehen“ → `#was-in-jeder-anfrage-steht`; mit `PAKETE_DEMOS` **Textentwurf**
    „Live-Demo ansehen“ → `#demos` (B-AB-4).
  - Meldungsstapel mit drei als „Beispiel“ gekennzeichneten Meldungen (VK:55, K10), Bildschicht, `aria-hidden`.
  - Entfällt: Kasten „Kurz gesagt“ (sein Satz VK:61 eröffnet VB4), Brotkrumen über dem Foto.
  - Rund 40 Wörter in der Bedienschicht (Meldungen als Bildschicht nicht gezählt), an der Obergrenze von SG 10.1 („≤ etwa 40“).
- **Gewicht und Komposition, Telefon 390 × 844:**
  - Kopf 0–56 flächenlos über dem dunklen oberen Bildrand.
  - Foto `fb-sessel.webp` y 0–480 (57 % der Höhe, unter dem flächenlosen Kopf; DG-E-11 am echten Foto prüfen), unteres Drittel
    (y 320–480) läuft in `#161616` aus. Der Astronaut am Bullauge bleibt vollständig im Bild (SKILL:87, am Foto zu prüfen).
  - Glas-Stapel rechts oben, 220 × 96 px (x 154–374, y 72–168); auf `/` wegen des Umschalters y 124–220. Papierflieger links bleibt frei.
  - Maßlinie am Bullauge (Bildschicht), Wert „1.200 mm“ auf opakem `#1f1f1f` statt auf Glas, damit gleichzeitig höchstens zwei
    Glasflächen stehen (vorderste Meldung und auf `/` der Umschalter; SG 10.9).
  - Kicker y 384–400, h1 drei Zeilen y 408–509 (im Auslauf des Fotos), Chips y 525–561 (36 px, flach `#262626`, weil darunter kein Bild
    mehr liegt), Preisreihe y 577–613, Cream 358 × 52 bei y 633–685, Ring 358 × 52 bei y 697–749.
  - Anschnitt y 772–844 (72 px, 8,5 %): Haarlinie, Nummer „02“ und die obere Hälfte von „Die Pakete“ (Fortsetzungssignal, SG 10.7/10).
  - Proportionen: Foto 57 % · Bedienschicht y 384–749 (43 %, davon 96 px im Auslauf überlappend) · Anschnitt 9 %. Fokusträger
    (Astronaut und Bullauge) 25–35 % der Fläche; frei bleiben die dunkle Kapselwand und der Auslauf, Ziel ≥ 33 % (SG 10.1/3), am Foto zu
    prüfen.
  - Größen: h1 32 · Klein-Stufe 13 (Kicker, Chips, Preisreihe) und 17 (Knopftexte) · Foto; Preisreihe zu h1 = 1 : 2,46.
- **Gewicht und Komposition, Schreibtisch 1280 × 800:** Kopf 64 px klebend, sein Ring-Knopf ist ausgeblendet, solange die Cream-Pille im
  Bild ist. Text links über 5 von 12 Spalten (x ≈ 120–533): Kicker y ≈ 196, h1 40 px in drei Zeilen y ≈ 216–342, Chips y ≈ 366–402,
  Preisreihe y ≈ 422–458, Cream (≈ 220 × 52) und Ring (≈ 280 × 52) nebeneinander y ≈ 486–538. Foto rechts ab x ≈ 553 bis an den
  Fensterrand (57 % der Breite), y 0–720, links und unten ausgeblendet; Glas-Stapel im Foto oben über der dunklen Wand. Anschnitt
  y 720–800 (10 %) mit Haarlinie, „02“ und Oberkante der h2. Bei 1024 px beginnt das Foto bei 44 % (GEST:447).
- **Ebenen** (4): Grund mit Lichtübertrag des Erdlichts (radial, Zeichnungsblau ≤ 12 %, höchstens drei Stopps) → Foto → Glas-Meldungen
  und Maßlinienwert → Bedienschicht; Kopf in Z 40. Dialekt B (Objekt im gestalteten Licht).
- **Bewegung:** Ladefolge nacheinander, nie zwei Träger zugleich: Foto 0–0,9 s (Deckkraft, Zoom 1,04 → 1); Meldungen bei 0,9 / 1,6 /
  2,3 s (je 600 ms, `--e-out`, ohne Abprallen); Maßlinie zeichnet sich 2,9–4,1 s, ihr Wert zählt mit (Bildschicht). Stand nach 4,1 s
  (< 5 s, R2). Beim Scrollen bleibt das Foto zurück (Faktor 0,88), Glas 1,0; am Telefon tragen die Meldungen dabei die nicht deckende
  Ersatzfüllung statt Live-Unschärfe (SG 10.8, Mobil). Die Bedienschicht steht ab dem ersten Bild. **Technik:** Stufe 1 (Foto mit
  Parallaxe) ist Grundfassung und Poster; Stufe 2 (Foto mit Tiefenkarte, WebGL) lädt erst nach dem LCP und nur nach bestandener Prüfung
  auf einem mittleren Android-Telefon (DG-E-13; SKILL:57-61).
- **Ruhige Fassung:** Endbild mit drei Meldungen und fertiger Maßlinie, kein Zoom, keine Tiefe. **Ohne JavaScript:** Foto, Text, Chips,
  Preisreihe, Knöpfe, statischer Stapel, keine Maßlinie.
- **Entscheidungsunterstützung:** S1 vollständig; Preisniveau aller drei Pakete samt Hinweis auf die Einrichtung vor dem ersten Knopf
  (RE E11, T1; EA H-D15); Schnellweg W2 mit einem Tippen; F-33 nur über den Kicker (O-22).

**VB2 Die Pakete** `#pakete` (S4 mit S5-Kern; Stufe 2; Telefon y 772–2.330 ≈ 1,85 Bildschirme; Schreibtisch Bildschirm 2–3)

- **Funktion:** Preis, Paketwahl, Unterschied und die Risikofakten an einem Ort; der zweite Bildschirm ist die eigentliche Verkaufsfläche.
- **Inhalt, Telefon in dieser Reihenfolge:**
  1. Kopf: Haarlinie, „02“, h2 „Die Pakete“ grün „Pakete“ (VK:171), y 772–850; Leitsatz VK:172 „Drei Pakete, ein Konfigurator: Sie
     entscheiden, wie sehr er Ihre Marke trägt.“ 17 px, y 866–914; **Textentwurf** (EA 4.3.3) „In allen Paketen: Ihre eigene Domain,
     der volle Konfigurator und jede Anfrage als Aufmaßblatt-PDF per E-Mail.“ 15 px, y 930–996.
  2. Namensleiste über der Reihe (EA AB-11), y 1.012–1.064: drei Segmente je 114 × 52 px, Kurzname 13 px und Monatspreis 15 px fett; ein
     2-px-Zeiger in `--text` folgt dem Wischen (Zustand), Tippen springt zur Karte. Keine Füllung, damit die Cream-Fläche des Bildschirms
     der Knopf bleibt.
  3. Wischreihe y 1.080–1.720: Karte 310 × 640 px, Nachbarn schauen je 40 px herein (Deckkraft 50 %, nicht skaliert); die Reihe beginnt
     bei der empfohlenen Karte (heute Essential Plus; Entscheidung O-5). Karte nach IA K19, in B von oben:
     - empfohlene Karte: 2-px-Ring in Cream, Kontur-Pille „Empfohlen“ 13 px auf dem oberen Rand;
     - Paketname 17 px fett, Schreibweise „EEZI Essential Plus“ (DG-E-2 A; SKILL:71);
     - Zeile „Für wen“ 15 px `--text2`, zwei Zeilen: bei Essential und Signature der Kartensatz aus `web/assets/pakete.js:44`, `:60`; bei
       der empfohlenen Karte der Grund, **Textentwurf** (EA 4.3.3, RE T4): „Empfohlen, wenn Ihre Kunden Ihr Logo, Ihre Farbe und Ihre
       Fotos sehen sollen.“;
     - Monatspreis 32 px mit „im Monat“ 15 px `--muted` (Headline-Stufe der Ansicht, „Zahl als Held“, DR 3.2);
     - Einrichtung 15 px, **Textentwurf** aus PB:58-64 (IA K19): „dazu 199 € Einrichtung, einmalig vorab: Anruf, Anlage, Domain,
       Gestaltung, Vorschau zur Freigabe.“;
     - Steuerzeile 13 px „netto zzgl. MwSt. · nur für Unternehmer“ (`functions/pakete-seite.js:122`; Steuerstatus O-6);
     - Unterschied zum Nachbarpaket [H, RE T5], **Textentwurf**: „Gegenüber Essential +10 € im Monat:“ und drei Haken 15 px aus
       `web/assets/pakete.js:42-67` („Logo, Firmenfarbe, bis 6 Fotos“, „Eigene Startseite, in Suchmaschinen“, „Hinweis auf eeziframes nur
       dezent“); bei Signature „Gegenüber Plus +25 € im Monat:“ („Kein Hinweis auf eeziframes“, „Dashboard mit 5 Zugängen und
       Einladungslinks“, „Anfragen über die Vertragsdauer aufbewahrt“); bei Essential „Das ist dabei:“ („Ihr Name im eeziframes-Design“,
       „Hinweis ‚Powered by EEZIframes‘“, „Anfragen 30 Tage aufbewahrt“) (IA-AB-11);
     - Knopf 262 × 52: empfohlene Karte Cream „Essential Plus anfragen“, sonst Ring (`functions/pakete-seite.js:109-131`);
     - unten das Beispielbild im Browserrahmen 262 × 194 px (Leiste 22 px, Bild 172 px), ≈ 30 % der Kartenhöhe, Held der Karte
       (SKILL:121-122; IA-H-14 ⅓, EA S4 ½). Material fehlt (O-12): bis dahin die Skizze ohne Text (heute so).
  4. Verkaufsstand K21, ein Satz 15 px, kleiner als jeder Preis, **Textentwurf** „Vorläufige Preise, Stand 22.10.2026.“
     (`web/assets/pakete.js:15-17`), y 1.744–1.766 (EA AB-4).
  5. **Festblock** (K22, erweitert um VK:70), sechs Zeilen mit grünem Haken, 15 px, **Textentwurf** aus VK:237, PB:48, :54, :60, :70,
     :69: „Keine Gebühr je Anfrage.“ · „Der Vertrag beginnt erst, wenn Ihre Zahlung eingegangen ist.“ · „Das Monatsabo läuft erst ab dem
     Livegang.“ · „Vorher sehen Sie Ihren Konfigurator in einer Vorschau und geben ihn frei.“ · „Bis zum Beginn der Einrichtung
     stornieren Sie mit voller Erstattung.“ · „Monatlich kündbar, ohne Mindestlaufzeit.“; darunter ohne Haken in `--text2` die Grenze
     „Danach wird die Einrichtung nicht erstattet.“ und der Link 44 px „Paketbedingungen mit AV-Vertrag“; y 1.790–2.170.
  6. Vergleich K20, zugeklappt als Zeile 52 px, **Textentwurf** „Alle Unterschiede im Vergleich“; aufgeklappt mit festem Kopf aus drei
     Kurznamen, gruppiert („Ihre Marke“, „Gefunden werden“, „Team und Einladungen“, „Daten“, „Richtwerte“), ≈ 12 Zeilen, „nicht
     enthalten“ statt „nein“; y 2.186–2.238.
  7. Gesprächsweg K23: Satz 15 px **Textentwurf** „Unsicher, welches Paket passt?“ und Ring „Rückruf oder Nachricht“ → `#frage` mit Paket
     „Noch offen“ (`functions/pakete-seite.js:177-182`); y 2.254–2.330. Rechtshinweis „Angebot nur für Unternehmer im Sinne von § 14 BGB“
     (VK:188) als letzte Zeile 13 px.
- **Gewicht:** Der zweite Telefon-Bildschirm (Scrollstand 1,0–2,0) zeigt Namensleiste, Preis, Einrichtung, Unterschiede, Knopf und den
  oberen Teil des Beispielbilds der empfohlenen Karte; Preis und Knopf stehen in jedem Wischzustand im selben Bildschirm (R1, R9). Die
  Karte ist mit rund 55 Wörtern der dichteste Block der Seite: dicht, wo entschieden wird.
- **Schreibtisch:** Kopf y 800–960 (h2 40 px links, Leitsatz und „In allen Paketen“ in zwei Spalten daneben); drei Karten je 328 × 640 px
  in der 1040-px-Spalte (Abstand 28), aufsteigend, Zeilen über `subgrid` auf gleicher Höhe, y ≈ 992–1.632; Preis und Knopf jeder Karte im
  zweiten Bildschirm (800–1.600). Darunter der Vergleich **offen** (B-AB-5), in denselben drei Spalten fortgesetzt: je Merkmal eine
  13-px-Zeile mit dem Merkmalsnamen über die volle Breite und darunter die drei Werte unter ihrer Karte (≈ 12 × 44 px, y ≈ 1.664–2.192).
  Dann Festblock links (6 Spalten) und Verkaufsstand, Gesprächsweg und Rechtshinweis rechts (6 Spalten), y ≈ 2.240–2.500.
- **Ebenen** (3–4): Grund → Beispielbild im Browserrahmen (Bildschicht; der untere Kartenrand überdeckt seinen Fuß) → Karte `#1f1f1f` mit
  2-px-Ring, Inhalt, Knopf → Kopf. Dialekt C, kein Licht, kein Glas, keine Signature (DG Dosierregel 1).
- **Bewegung:** keine Einblendung (B-AB-7). Wischen nativ mit `scroll-snap` und Trägheit, ohne Überschwingen (DG-AB-4); das Beispielbild
  bleibt beim Wischen bis 24 px hinter seiner Karte zurück und holt mit einer Feder (≤ 3 % Überschwingen) auf (Bildschicht, DG 2.2.16);
  Zeiger der Namensleiste als Zustand. Vergleich öffnet als Rückmeldung 220 ms (DG-E-14).
- **Ruhige Fassung, ohne JavaScript:** Karten untereinander mit Preisen (Prüfsuite 29.1), Beispielbild ohne Nachlauf, Vergleich offen als
  Tabelle mit festem Kopf.
- **Entscheidungsunterstützung:** F-05, F-06, F-23 (Leitsatz, Empfehlungsgrund), F-24 (Hinweis auf eeziframes je Karte), F-25 (im
  Vergleich; an den Karten nach O-26), F-26 (Richtwerte im Vergleich), F-30 (Steuerzeile, O-6); R1, R8, R9; RE T4, T5, T7, T9.

**VB3 Bestellen oder anfragen** `#bestellen`, Formular `#frage` (S6; Stufe 1; Telefon y 2.330–3.180 ≈ 1,0; Schreibtisch Bildschirm 4)

- **Funktion:** Abschluss Z1a direkt nach der Paketwahl; in Zustand B Vorbereitung der Bestellung und Nebenweg.
- **Inhalt, Zustand A:** Haarlinie, „03“, h2 „Bestellen oder anfragen“ (Pflicht-h2); ein Satz 17 px, **Textentwurf** aus VK:220 (wie IA
  V11): „Die Bestellung schalten wir in Kürze frei. Bis dahin fragen Sie unverbindlich an; wir antworten in der Regel innerhalb eines
  Werktags.“ (O-8); h3 „Paket unverbindlich anfragen“ 17 px fett; Formular K32 mit Name, E-Mail, Paket (aus der Karte vorgewählt), Frage;
  die freiwilligen Felder Firma und Telefon in einer aufklappbaren Zeile 52 px, **Textentwurf** „Firma und Telefon angeben (freiwillig)“
  (`details`, ohne JavaScript bedienbar) [H]; Satz zum Datenschutz mit Link auf `/datenschutz/#pakete`; Cream „Frage senden“ volle Breite;
  darunter der Anbieterblock K28 als eine Zeile 15 px, **Textentwurf** aus PB:33 § 1 und `web/impressum/index.html:32`: „Es antwortet
  eeziframes, Patrick Kies, Herzebrock-Clarholz · ask@eeziframes.com“ (Telefon und Bild erst nach O-9).
- **Inhalt, Zustand B:** Block K33 **Textentwurf** (EA 4.3.1) „Für die Bestellung brauchen Sie: die Angaben Ihres Unternehmens fürs
  Impressum, eine Wunsch-Domain oder unseren Vorschlag und bis zu drei E-Mail-Adressen für Ihre Anfragen. Logo und Fotos für Plus und
  Signature können Sie bis zur Freigabe nachreichen.“; Hinweis, dass über die Knöpfe der Karten bestellt wird; das Formular zugeklappt als
  „Vorher eine Frage?“ mit Ring-Knopf.
- **Gewicht:** ein Bildschirm, ohne Bild; die Pflichtfelder bleiben drei (Name, E-Mail, Frage), weil die Prüfsuite Fehler an drei Feldern
  mit Fokus auf „Name“ erwartet (`scripts/pruefen-instanzen/29.mjs:95`); weniger Pflichtfelder (RE T10) nur mit bewusster Änderung der
  Suite (IA-O-9). Telefon eine Spalte, Felder 52 px, Schrift 17 px, Beschriftung 15 px fett, Feldumrisse ≥ 3:1 (R10). Schreibtisch zwei
  Spalten: links Satz, Datenschutz und Anbieterzeile, rechts das Formular.
- **Ebenen, Bewegung:** Grund → Formular → Kopf; flach, kein Bild (der Platzhalter `fb-frage` entfällt, IA-AB-8), keine Einblendung
  (B-AB-7); nur Rückmeldung 220 ms; Fehler am Feld ohne Rütteln (DG-AB-3); der Dank ersetzt das Formular, Lottie-Haken einmal, Fokus auf
  den Dank (PA 1.10 Nr. 14).
- **Übergang:** Unter dem Formular schneidet die Einzeiler-Karte aus VB4 (Bild, „Beispiel“) die untere Bildschirmkante um 8–12 % an.
- **Entscheidungsunterstützung:** F-17, F-20 (Anbieterzeile), F-32 (Telefon nach O-9), F-18 (Preisbindung offen, O-7).

**VB4 Beweis: Die Idee und was in jeder Anfrage steht** `#die-idee`, `#was-in-jeder-anfrage-steht` (S2 und S3; Stufe 3; Telefon
y 3.180–4.640 ≈ 1,7; Schreibtisch Bildschirm 5–6)

- **Funktion:** Für alle, die noch nicht angefragt haben: Was bekomme ich für das Geld, und warum ist es besser als mein Kontaktformular?
- **Inhalt:**
  - Haarlinie, „04“, h2 **Textentwurf** „Die Idee: Maße statt Einzeiler.“, grün „Maße“ (aus VK:80 „keine Einzeiler aus dem
    Kontaktformular, sondern Maße, Fotos und Wünsche“); die heutige Überschrift VK:74 bräuchte am Telefon drei Zeilen (DG G2: höchstens
    zwei).
  - Lead VK:61, 17 px: „Ihr eigener Fenster-Konfigurator, ohne ihn programmieren zu lassen. Jede Anfrage kommt als Aufmaßblatt-PDF.“
    (Prüfsuite).
  - Szene: hinten die Einzeiler-Karte, **Textentwurf** „Bitte um Angebot für 3 Fenster“, „Beispiel“; davor das echte Aufmaßblatt
    `web/bilder/tour-aufmassblatt-15.webp` („Beispiel“), das die Karte zu höchstens einem Drittel überdeckt (Anfang und Ende des
    Einzeilers bleiben lesbar, SG 10.1/6); danach lösen sich die Schichten Maße · Fotos · Klärungsliste, jede mit Führungslinie und
    13-px-Beschriftung.
  - h3 „Was in jeder Anfrage steht“ (Anker) und die eine Fassung des Inhaltskatalogs K15, sieben Zeilen 15 px (VK:123-131).
  - Zeile zu F-09 (PB:44 § 2 (4); VK:245): „Die Maße im Aufmaßblatt sind Angaben Ihrer Kunden; vor der Fertigung messen Sie selbst nach
    (Feinaufmaß).“
  - die vier Punkte der Idee als Zeilen 15 px mit hellem Kennwort (VK:75-81; Prüfsuite „Ihr eigenes Baby“): Kein Programmierauftrag ·
    Professioneller Auftritt · Ihr eigenes Baby · Anfragen, mit denen Sie rechnen können.
  - Zeile zu F-08, **Textentwurf** (EA H-D4): „Ihr Konfigurator ist Ihr Werkzeug: Wir vermitteln keine Kunden. Den Link teilen Sie dort, wo
    Ihre Kunden Sie finden.“
- **Gewicht und Komposition, Telefon:** Kopf und Lead rel. 0–229; Szene 358 × 440 px (rel. 253–693, ≈ 48 % des Bildschirms beim
  Durchlauf): Einzeiler-Karte 250 × 64 oben links, Aufmaßblatt 300 px breit (≈ 85 % der Spalte) ab rel. 285, unten in den Grund
  ausgeblendet, Bestellmaß-Karte opak `#1f1f1f` 170 × 70 mit Lichtkante über dem unteren Drittel des Blatts; Beschriftungen an der linken
  Kante. Darunter h3 und Liste (rel. 717–945), F-09 (961–1.005), vier Punkte (1.029–1.229), F-08 (1.245–1.360).
- **Schreibtisch:** Split, Text und Liste links über 5 Spalten, Szene rechts über 7; die Szene ist ≤ 1,5 Bildschirmhöhen angeheftet,
  davon ≥ ⅓ Ruhe im Endzustand (DG 2.2.9) – die einzige Anheftstrecke der Seite.
- **Ebenen** (4): Grund mit Messraster (fein 8 px, kräftig 40 px, ≤ 1,3:1, zum Rand und unter jedem Lesetext ausgeblendet) → Einzeiler-Karte
  und Aufmaßblatt samt Schichten (20) → Bestellmaß-Karte (25) mit blassem Begleitschatten nur auf dem weißen Papier (DG 2.2.4) →
  Beschriftungen und Text (30). Dialekt B (Vitrine); Ausdrucksträger Material und Detail.
- **Bewegung:** am Fortschritt des Abschnitts (0 → 1): 0–0,3 das Blatt schiebt sich vor die Karte (24 px aus Lichtrichtung, Deckkraft);
  0,3–0,9 die drei Schichten gleiten mit Trägheit um 0 / 28 / 56 px nach oben und 0 / 12 / 24 px nach rechts und kommen gleichmäßig
  gestaffelt zur Ruhe, die Führungslinien zeichnen sich mit; 0,9–1 Ruhe. Telefon ohne Anheften: das geschieht, während das Blatt durch
  den Bildschirm zieht (DG-AB-13). Text blendet einmal über Deckkraft ein (320 ms).
- **Signature:** Material-Explosionsansicht mit Annotation (inszenierend, die eine der Stufe 3), Messraster (informierend). Die
  Teilüberdeckung ist verbindliche Verdeckung, keine Signature (DG 2.5.4).
- **Ruhige Fassung, ohne JavaScript:** auseinandergezogenes, beschriftetes Endbild.
- **Entscheidungsunterstützung:** F-01, F-02 (über Punkt 1 und die Frage „Brauche ich eine Website?“ in VB9), F-08, F-09, F-15; EA H-D3.

**VB5 So funktioniert es**, mit Leiste Elementarten `#so-funktioniert-es` (S3; Stufe 3; Telefon y 4.640–5.800 ≈ 1,4; Schreibtisch
Bildschirm 7)

- **Funktion:** Was der Kunde des Betriebs erlebt, und wie breit der Konfigurator plant.
- **Inhalt:** h2 „So funktioniert es“; fünf Stationen je eine Zeile (VK:87-93): Kunde kommt auf die Domain des Betriebs · plant selbst ·
  sendet · Betrieb bekommt das Aufmaßblatt · Angebot und Feinaufmaß; Zeile zu F-10 (VK:240): keine Preise, keine Werbung, keine anderen
  Betriebe. Ein Beispielbetrieb, eine Beispielfamilie, eine Beispieldomain auf der ganzen Seite (PA-Frage 25). Danach die Leiste
  Elementarten (VK:66-68; Liste nach PA-Frage 29).
- **Gewicht und Komposition, Telefon:** Kopf rel. 0–74; Geräte-Bühne: Telefon 200 × 410 px mittig (x 95–295, ≈ 25 % der Fläche), mit
  echten Bildschirmen des Konfigurators unter der Beispieldomain (neu aufzunehmen, PA 1.7), 1-px-Lichtkante statt Schatten; Stationen
  5 × 44 px (rel. 524–744; Ziffer 13 Technikstimme, Stationswort 17 fett; aktive Station zusätzlich als Satz 15); F-10-Zeile; 48 px Luft;
  Leiste über die volle Breite 144 px (rel. 912–1.056), Bilder 72 × 72, das mittlere 90 × 90 unter dem Lichtkegel. Die Leiste steht
  erst in der Bildschirmmitte, wenn das Gerät den Bildschirm verlassen hat: ein Held je Bildschirm.
- **Schreibtisch:** Stationen links über 5 Spalten, rechts ein Browserfenster mit der Startseite des Konfigurators (7 Spalten) und das
  Telefon davor, das die linke untere Ecke des Browsers überdeckt; die Leiste darunter über die volle Fensterbreite (176 px). Kein
  Anheften.
- **Ebenen** (4): Grund → Browserfenster (20, tritt über Tonwert zurück) → Telefon (20, Fokusträger, Verdeckung) → Bedienschicht; in der
  Leiste: Grund mit Haarlinien → Bilder der Elementarten → Lichtschlitz mit Kegel (Quelle sichtbar, höchstens halb so hell wie der
  Lichtkern von VB1) → Name.
- **Bewegung:** Aktiv ist die Station, deren Zeile der Bildschirmmitte am nächsten liegt; der Gerätebildschirm blendet 220 ms über. In
  Station 3 spielt der Gerätebildschirm einmal eine stumme Aufnahme von ≤ 4 s, in der am Fenstermodell der Raffstore herunterfährt
  (Lamellen um je 12 ms versetzt wie in der App, GEST:64), und bleibt auf dem letzten Bild stehen [H]; damit kommt der Realismus, den der
  Inhaber an Lamellen und Fenstermodell mag (SKILL:122), ohne eigene Bildfolge-Szene. Leiste: Versatz proportional zum Scrolltempo
  (Faktor 0,42), Auslauf mit Trägheit ≤ 1,2 s, die Bilder wölben sich zum Rand weg (Bildschicht), die Namen wechseln über Deckkraft
  (DG-AB-6); keine Dauerschleife; mit dem Finger wischbar.
- **Signature:** Schärfestaffelung an den Rändern der Leiste (inszenierend, die eine der Stufe 3). Kein Lichtraum hinter dem Gerät, keine
  scrollgekoppelte Bildfolge (bewusst reduziert gegenüber DG 2.3.6).
- **Ruhige Fassung:** fünf Standbilder untereinander mit Station; Leiste steht, wischbar, alle Namen sichtbar; Aufnahme als Endbild.
- **Entscheidungsunterstützung:** F-10, F-14 (Breite als Bild, ohne Sortimentszusage, O-17), F-34.

**VB6 Live-Demos** `#demos` (Stufe 1; Telefon ≈ 0,3 Bildschirme): wie IA V6. Zustand A: zwei Zeilen **Textentwurf** aus VK:209 („Die Demos
je Paket schalten wir in Kürze frei. Bis dahin zeigt ‚Konfigurator ausprobieren‘ die Fassung für Hauseigentümer auf eeziframes.com, mit
Preis; unter Ihrer Domain trägt er Ihren Namen und zeigt keine Preise.“) und Ring „Konfigurator ausprobieren“ → `/app/` [H: neuer Tab].
Mit Demos: drei Zeilen à 56 px (Paketname 17, Satz 13, Pfeil) zu `demo-essential`, `demo-plus`, `demo-signature.eeziframes.com`
(`docs/INSTANZEN.md:310`). Funktion: Probieren direkt nach dem Blick in die Kundensicht (EA W3), ohne den Weg zur Paketwahl zu verlieren
(Kaufleiste).

**VB7 Ihre Kunden bleiben Ihre Kunden** `#kundenschutz` (S5; Stufe 2; Telefon ≈ 0,7)

- **Funktion:** Loyalität des Anbieters belegen (F-10, F-11).
- **Inhalt:** h2 wörtlich (VK:159); vier Zusagen im Wortlaut der Prüfsuite (VK:160-166); Link „Paketbedingungen § 10“ →
  `/konfigurator-bedingungen/#kundenschutz`; „Zusage“, nicht „Garantie“ (GEST:379).
- **Gewicht:** ohne Bild die erste Zusage „Nur Ihr Betrieb“ als Ankerkachel über die volle Breite (358 × 104), die drei übrigen kleiner
  untereinander (je 358 × 80) (DG 2.3.8; SG 10.10 Nr. 11). Liegt das Bild der Instanz-Startseite unter der Beispieldomain vor (DG-H-7),
  wird es Held (358 × 200) über den Kacheln. Schreibtisch: Kacheln links 2 × 2 mit Ankerkachel über beide Spalten, Bild rechts.
- **Bewegung:** Haken werden einmal gezogen (500 ms, Bildschicht der Kachel); sonst ruhig.

**VB8 Von der Bestellung bis zum Livegang** `#ablauf` (S5; Stufe 2; Telefon ≈ 1,15)

- **Funktion:** Aufwand, Dauer und Mitwirkung.
- **Inhalt:** h2 grün „Livegang“; „Meist 3 bis 5 Werktage nach der Zahlung.“ (VK:193; Prüfsuite; O-8); sechs Schritte in den Wörtern der
  Statusleiste Bestellt, Bezahlt, In Einrichtung, Domain gesichert, Zur Freigabe, Live (`web/assets/instanzregeln.js:74-77`);
  **Textentwurf** „Sie brauchen …“ wie in VB3 Zustand B (EA H-D5).
- **Gewicht:** senkrechter Maßstab an der linken Kante (x 16–40, ≈ 480 px hoch, Striche alle 8 px fein, alle 40 px kräftig, sechs Marken
  mit Ziffern 01–06) als Hauptelement (G4); Schritte rechts ab x 56 (Wort 17 fett, Satz 15). Schreibtisch: Maßstab links, Schritte über
  7 Spalten.
- **Bewegung, Signature:** erreichte Marken werden grün, sobald ihr Schritt die Bildschirmmitte passiert (Zustandswechsel 220 ms; kein
  wachsender Strich, DG-AB-15); Fortschritts-Maßstab als informierende Signature (DR Baustein 7). Ruhige Fassung: alle Marken stehen.

**VB9 Häufige Fragen** `#haeufige-fragen` (Stufe 1; Telefon ≈ 0,7): acht Fragen wie IA V12 (Kosten, Domain, Website, was der Kunde sieht,
Datenschutz, Kündigung und Wechsel, Bestandskunden, Genauigkeit), JSON-LD wortgleich; Zeilen 52 px mit Haarlinien (DG-AB-19), Frage
17 px fett, Antwort 17 px `--text2`; „Unterschied der Pakete“ und „Dauer“ sind in VB2 und VB8 beantwortet.

**VB10 Hintergrund** (zugeklappt, Telefon ≈ 0,35): wie IA V13; h2 **Textentwurf** „Hintergrund“; drei Zeilen 52 px „Zahlen zum Handwerk“
(VK:150-155), „Quellen“ (VK:259-266), „Wissen für Fensterbauer“ (fünf Fachartikel).

**VB11 Abschluss: Paketwahl** (S6; Stufe 2; Telefon ≈ 0,6)

- **Funktion:** Die Seite endet mit einer Handlung (EA H-D7); wer bis hier gelesen hat, wählt ohne Rückweg.
- **Inhalt:** Bildband: Ausschnitt des Bullauges mit Erdlicht aus VB1, 390 × 160 px, in den Grund ausgeblendet (DG-H-8); h2
  **Textentwurf** „Drei Pakete, ein Konfigurator.“ (IA V14) im Auslauf des Bands; drei Zeilen à 56 px: links Kurzname 17 fett über der
  Einrichtung 13, Mitte Monatspreis 17, rechts Knopf 120 × 44 „Anfragen“ (Zustand B „Bestellen“; zugänglicher Name „Essential Plus
  anfragen“); nur die Zeile des empfohlenen Pakets trägt Cream; darunter Ring „Frage stellen“ → `#frage`. In der Einbettung folgt die
  Wechselkarte K06.
- **Bewegung:** keine außer Zustand; kein Auftritt (B-AB-7).

**Zustände der Seite in Konzept B**

| Ort | Zustand A (heute) | Zustand B (`PAKETE_OFFEN=1`) | zusätzlich mit Demos (`PAKETE_DEMOS=1`) |
|---|---|---|---|
| VB1 | Cream „Pakete ansehen“; Ring „Beispiel-Anfrage ansehen“; Preisreihe mit „vorläufige Preise“, solange `VORLAEUFIG` | gleich | Ring „Live-Demo ansehen“ → `#demos` |
| VB2 Karten | Cream „Essential Plus anfragen“, sonst Ring „… anfragen“ → `#frage` mit Vorwahl | „… bestellen“ → `/partner/#bestellen/<paket>` | kleiner Link „Demo“ je Karte (RE T11, [H]) |
| VB2 Verkaufsstand | „Vorläufige Preise, Stand …“ | entfällt mit `VORLAEUFIG = false` | – |
| VB3 | Formular als Abschluss, Cream „Frage senden“ | K33, Formular zugeklappt als „Vorher eine Frage?“ | – |
| VB6 | zwei Zeilen und Ring „Konfigurator ausprobieren“ | gleich | drei Demo-Zeilen |
| VB11, Kaufleiste | „Anfragen“ | „Bestellen“ | – |
| JSON-LD | `PreOrder` | `InStock` | – |

Jeder Vorbehalt steht genau dort, wo er wirkt, als Satz in Nebengröße und nie als Kasten: „vorläufige Preise“ in der Preisreihe von VB1 und
unter den Karten, „Demos in Kürze“ in VB6, „Bestellung in Kürze“ in VB3 (EA AB-4).

---

### Einstieg für Hauseigentümer: Ansicht `/#hauseigentuemer`

**Ziel:** Z2a, dann Z2 in der App. **Hauptgruppen:** HE-3, HE-5. **Länge:** Telefon ≈ 4,75 Bildschirme bis zur Wechselkarte, mit Fuß
≈ 5,6 (IA ≈ 6,3 ohne Fuß); Schreibtisch ≈ 4,6. **Anrede:** offen (EA O-13); Entwürfe ohne Anrede. Höchststufe 3 (DG Dosierregel 5).

| Nr. | Abschnitt | Kette (EA) | Typ · Stufe | Telefon y (Scrollstand) | Anteil bis Fuß | Cream |
|---|---|---|---|---|---|---|
| HB1 | Angebotsbühne | B1 + Preis | T1 · 3 | 0–772 (0–0,91) | 19 % | „Jetzt ausmessen“ |
| HB2 | Das Aufmaßblatt und sein Preis | B2 | T5-artig, statisch · 2 | 772–1.860 (0,91–2,20) | 27 % | – (Startleiste) |
| HB3 | So geht es, und was mit den Daten geschieht | B2, B3 | T8-artig · 2 | 1.860–2.620 (2,20–3,10) | 19 % | – (Ring „Führung starten“) |
| HB4 | Häufige Fragen | B3 | T9 · 1 | 2.620–3.120 (3,10–3,70) | 12 % | – |
| HB5 | Aus dem Ratgeber, eine Wischzeile | Zubringer | Stufe 1 | 3.120–3.380 (3,70–4,00) | 7 % | – |
| HB6 | Abschluss: Messaufforderung | B4 | T11 · 2 | 3.380–3.760 (4,00–4,45) | 10 % | „Jetzt ausmessen“ |
| HB7 | Wechselkarte Fensterbauer | – | T11 · 2 | 3.760–4.010 (4,45–4,75) | 6 % | – |
| – | Fuß kurz | – | T0 | 4.010–4.720 (4,75–5,59) | – | – |

**HB1 Angebotsbühne** (B1; Stufe 3; Telefon Bildschirm 1)

- **Funktion:** zuordnen, Zutrauen, Preis und Start ohne Scrollen (R12, R13).
- **Inhalt:** Eyebrow „In Minuten zum Aufmaß für jeden Fensterbauer“ und h1 „Fenster ausmessen. Selbst. eezi.“, grün „eezi.“
  (`web/assets/portal.js:852`; Prüfsuite wörtlich); Lead 17 px, **Textentwurf** (IA H1, aus `web/index.html:58`): „Zwei Fotos und die
  Maße mit dem Zollstock, jeder Schritt erklärt.“; Preiszeile 15 px (in B eine Stufe größer als in IA, damit der Preis Gewicht hat),
  **Textentwurf** aus `web/index.html:61-62`: „**Messen kostenlos**, ohne Konto · **Aufmaßblatt 12,99 €**“ (bis 17.11.2026 „7,99 € bis
  17.11.2026, danach 12,99 €“; IA-AB-6); Cream „Jetzt ausmessen“ → `/app/#ausmessen` (mit angefangenem Aufmaß „Aufmaß fortsetzen“,
  GEST:192); Ring „Führung starten“ → `/app/#fuehrung`. Rund 35 Wörter.
- **Gewicht und Komposition, Telefon:** Kopf 0–56 flächenlos; Glas-Umschalter 260 × 44 bei y 68–112; Foto `start-hauseigentuemer.webp`
  (Waschbär an der Maueröffnung) y 0–480, unteres Drittel ausgeblendet; Eyebrow y 392–408, h1 zwei Zeilen y 416–484, Lead y 500–544,
  Preiszeile zwei Zeilen y 560–600, Cream 358 × 52 bei y 620–672, Ring 358 × 52 bei y 684–736; Anschnitt y 772–844 mit Haarlinie, „02“
  und Oberkante der h2 von HB2. Foto 57 %, Bedienschicht 41 %.
- **Schreibtisch:** Kopf 64 px mit Umschalter neben dem Logo; Text links über 5 Spalten, Foto rechts über 7 bis an den Rand; Cream und Ring
  nebeneinander im ersten Bildschirm.
- **Ebenen, Bewegung:** Grund → Foto → Glas-Umschalter → Bedienschicht (4). Foto 900 ms Deckkraft und Zoom 1,03 → 1 [H, wie IA]; die
  Überschrift steht ab dem ersten Bild (der Aufbau Wort für Wort entfällt, DG 2.2.8). Signature: nur das Glas des Umschalters.
- **Entscheidungsunterstützung:** H-01 (Lead, Führung), H-02 (Preiszeile), H-03 (ohne Konto).

**HB2 Das Aufmaßblatt und sein Preis** (B2; Stufe 2; Telefon ≈ 1,3 Bildschirme)

- **Funktion:** Das Produkt mit Preisschild zeigen: was am Ende herauskommt, was es kostet, was darin steht.
- **Inhalt:** h2 „Was im Aufmaß steckt.“ mit Zusatz 15 px „je Fenster, wie beim Termin vor Ort“ (`web/assets/portal.js:779`); Held: das
  echte Aufmaßblatt `tour-aufmassblatt-15.webp` („Beispiel“) mit dem Preisetikett KB-4; drei Preiszeilen (K25; AGB:34, :55;
  `web/index.html:61`), Preis 17 px fett an gemeinsamer linker Kante, Beschriftung 15 px: „0 € Messen, Fotos, 3-D-Modell“ · „12,99 €
  Aufmaßblatt als PDF, einmalig“ · „0 € über den Link des eigenen Fensterbauers“; die eine Fassung des Inhaltskatalogs K15, sieben Zeilen
  15 px (dieselbe wie in VB4); Messangabe aus `web/index.html:59`: „Je Fenster drei Breiten und drei Höhen der Maueröffnung, dazu das
  Rahmenmaß. Es zählt das kleinste Maß.“; Zeile „Grundlage für Angebote, kein Bestellmaß“ (AGB:35 § 2 (4)).
- **Gewicht und Komposition, Telefon:** Kopf y 772–912; Szene 358 × 340 (y 932–1.272): Blatt 290 px breit, um −2° gedreht, unten in den
  Grund ausgeblendet; Preisetikett 152 × 76 px über der rechten unteren Ecke des Blatts (≤ 15 % Überdeckung); Preiszeilen y 1.296–1.428;
  Katalog y 1.452–1.648; Messangabe und Bestellmaß-Zeile bis y ≈ 1.760. Der Held belegt beim Durchlauf ≈ 37 % des Bildschirms.
- **Schreibtisch:** Szene rechts über 7 Spalten (Blatt ≈ 420 px breit), Preiszeilen und Katalog links über 5.
- **Ebenen, Bewegung:** Grund → Blatt (20) → Preisetikett (25, Bildschicht, `aria-hidden`; der Preis steht zusätzlich in den Preiszeilen,
  G1) → Bedienschicht. Das Blatt legt sich einmal ab (600 ms, 24 px aus Lichtrichtung, Bildschicht); Text blendet einmal über Deckkraft
  ein. Keine Signature, kein Licht (Kontrast über das Papierweiß).
- **Entscheidungsunterstützung:** H-02, H-06, H-11 (Elementarten nennt HB4), widerspruchsfreie Maßangabe bis O-11.

**HB3 So geht es, und was mit den Daten geschieht** (B2, B3; Stufe 2; Telefon ≈ 0,9)

- **Funktion:** den Aufwand einschätzbar machen und die Frage nach den Fotos des eigenen Hauses beantworten, bevor gestartet wird.
- **Inhalt:** h2 „Fotografieren. Messen. Wünschen.“, grün „Wünschen.“ (vorhandener Satz, `web/assets/app.js:2772`); vier Schritte mit
  Ziffer 13 px Technikstimme und je einer Zeile 15 px, **Textentwurf**: 01 Foto · 02 Maß · 03 Modell · 04 Blatt; Vertrauenszeile K29 mit
  drei Haken, **Textentwurf** (IA H3): „Fotos und Eingaben bleiben ohne Konto auf dem Gerät.“ · „Die KI wertet Fotos nur mit Einwilligung
  aus.“ · „Zum Kauf: E-Mail und Code, kein Passwort.“ („Server in Frankfurt“ nicht in der KI-Zeile, `web/datenschutz/index.html:51`);
  Ring „Führung starten“ als zweite Gelegenheit für Unsichere (U4).
- **Gewicht:** Held sind vier echte App-Bildschirme als Miniaturen 80 × 164 px in einer Reihe (x 16–374, Abstand 12; neu aufzunehmen,
  PA 1.7); bis das Material vorliegt, ein waagerechter Maßstab mit vier Marken (358 × 64) als nicht textliches Hauptelement (G4).
  Schreibtisch: Miniaturen rechts über 7 Spalten, Text links.
- **Bewegung:** keine außer einmaligem Einblenden über Deckkraft. Nicht als „Handy zu Briefumschlag“ (SKILL:125).
- **Entscheidungsunterstützung:** H-01, H-03, H-04, H-07; EA H-D11 (Konto vor dem Kauf früh genannt).

**HB4 Häufige Fragen** (B3; Stufe 1; ≈ 0,6): vier Fragen wie IA H5, in Ansicht und Textfassung gleich; die Antwort auf „Was kostet
eeziframes?“ nennt hier nur Messen und Aufmaßblatt (IA 5.6). Zeilen 52 px.

**HB5 Aus dem Ratgeber** (Zubringer; Stufe 1; ≈ 0,3): h2 „Aus dem Ratgeber.“ (`web/assets/portal.js:857`); eine Wischzeile aus sechs Pillen
44 px hoch mit Ziffer und Name (Prüfen 3, Entscheiden 3, Auswählen 6, Ausmessen 8, Vergleichen 1, Einbauen 2) → `/ratgeber/#schritt-1`
bis `#schritt-6`; „Ausmessen“ mit hellem Ring hervorgehoben; Link „Alle Ratgeber“. Am Schreibtisch eine Reihe ohne Wischen. Ersetzt die
2 × 3 Kacheln aus IA H4 (Höhe ≈ 0,3 statt 0,6 Bildschirme).

**HB6 Abschluss: Messaufforderung** (B4; Stufe 2; ≈ 0,45): Bildband 390 × 160 px aus dem Foto von HB1 (Öffnung im Rohbau), ausgeblendet; h2
**Textentwurf** „Das erste Fenster ausmessen.“ (IA H6) im Auslauf; Cream „Jetzt ausmessen“; Preiszeile wie HB1. Eine Handlung, kein Ring
(der steht in HB3). Kein Auftritt (B-AB-7).

**HB7 Wechselkarte Fensterbauer** (K06): wie IA H7, Ring **Textentwurf** „Zur Seite für Fensterbauer“.

---

### Neue Bausteine in Konzept B

| Nr. | Baustein | Einsatz | Aufbau | Zustände und Rückfall | Gestaltung |
|---|---|---|---|---|---|
| KB-1 | Kaufleiste | Verkaufsseite und Ansicht Fensterbauer, Telefon bis 1023 px | fest unten, 64 px plus Sicherheitsabstand; links „Menü“ (44 × 44), Mitte Paketfeld (Ziel ≥ 44 px; Kurzname 13 px über Monatspreis 15 px fett, Tippen → `#pakete`), rechts Knopf ≈ 112 × 44 **Textentwurf** „Anfragen“ (Zustand B „Bestellen“) → `#frage` mit Vorwahl bzw. `/partner/#bestellen/<paket>` | erscheint, sobald die Cream-Pille von VB1 den Bildschirm verlassen hat; der Knopf ist in den Zonen VB1, VB2, VB3 und VB11 ausgeblendet (dort steht die Handlung im Inhalt), sonst sichtbar und dann die einzige Cream-Fläche des Bildschirms; Paketfeld zeigt das empfohlene Paket, nach Wischen das zuletzt eingerastete [H]; Wahl gilt nur für den Seitenaufruf; ohne JavaScript nicht vorhanden; eingebettet nach jedem Aufbau neu gebunden (`Verkauf.auf`, SKILL:63-64) | opak `#1f1f1f`, 1-px-Lichtkante oben (Weiß 10 %), kein Schatten (DG-AB-1), Z 40; Ein- und Ausblenden nur über Deckkraft 320 ms; `inert`, solange unsichtbar; `scroll-padding-bottom` ≥ 64 px plus Sicherheitsabstand (WCAG 2.4.11) |
| KB-2 | Startleiste | Ansicht Hauseigentümer, Telefon | wie KB-1; Mitte zwei Zeilen 13 px „Messen kostenlos“ und „Aufmaßblatt 12,99 €“ (Betrag fett; bis 17.11.2026 7,99 €); Knopf ≈ 160 × 44 Cream „Jetzt ausmessen“ bzw. „Aufmaß fortsetzen“ → `/app/#ausmessen` | Knopf ausgeblendet in den Zonen HB1 und HB6; Preis wechselt am Stichtag aus `web/config.js:12-14` von selbst | wie KB-1 |
| KB-3 | Preisreihe | VB1 | zwei Zeilen 13 px, `tabular-nums`, Beträge fett in `--text`, Rest `--muted` | aus `web/assets/pakete.js` erzeugt (eine Stelle je Wahrheit, PA 1.10 Nr. 7), ohne JavaScript sichtbar; „vorläufige Preise“ hängt an `VORLAEUFIG` | Klein-UI unter den Chips, über der Pille |
| KB-4 | Preisetikett | HB2 | opake Karte `#1f1f1f`, Radius 12, 1-px-Lichtkante, Inhalt „AUFMASSBLATT · PDF“ 13 px Technikstimme und Preis 32 px mit „einmalig“ 15 px | Bildschicht, `aria-hidden`, Preis aus `web/config.js`; ruhige Fassung ohne Ablegen | überdeckt ≤ 15 % des Blatts, nie Kopfzeile oder Maße des Blatts |

---

## Unterscheidungsmerkmale

Vergleichsmaßstab ist die Ausgangsbasis aus IA 5.4, weil die übrigen Konzepte parallel entstehen. Alle Werte sind geplant.

| Merkmal | Konzept B, Telefon 390 × 844 | Konzept B, Schreibtisch 1280 × 800 | Ausgangsbasis IA |
|---|---|---|---|
| **Erster Bildschirm** | Angebotsbühne: Foto 480 px = 57 % der Höhe; Bedienschicht y 384–749 = 43 % (davon 96 px im Auslauf); Anschnitt 72 px = 9 % zeigt den Kopf der Pakete. Zwischen Chips und Pille die Preisreihe aller drei Pakete (36 px = 4 % der Höhe). Cream 358 × 52 = 5,6 % der Fläche, Ring gleich groß darunter. h1 : Preisreihe = 32 : 13 | Split 5 : 7; Foto 57 % der Breite, 90 % der Höhe; Preisreihe 36 px unter den Chips; Knöpfe nebeneinander bei y ≈ 486–538; Anschnitt 80 px = 10 % | Foto 500 px (59 %), Preiszeile „Ab 29 €“ unter den Knöpfen, Leiste V2 im Anschnitt |
| **Informationsdichte** | ≈ 10,7 Bildschirme bis zum Abschluss; rund 900 sichtbare Wörter [H, zu zählen] (heute 1.456, PA 1.8). Dichte bewusst ungleich: höchste Dichte in VB2 (Karte ≈ 55 Wörter auf 640 px, Festblock ≈ 70 Wörter) und VB3; geringste in VB1 (≈ 40 Wörter auf 844 px) und VB5 (≈ 45 Wörter auf 1,4 Bildschirmen). Lesetext höchstens drei Zeilen je Block | ≈ 10,3 Bildschirme; Vergleich offen erhöht die Dichte in Bildschirm 3 (≈ 12 Zeilen) | ≈ 11,7 Bildschirme bis V14, Dichte gleichmäßiger |
| **Bild-Text-Verhältnis** | Bildanteil je Abschnitt: VB1 57 %; VB2 Beispielbild 262 × 172 ≈ 14 % des Bildschirms (≈ 27 % der Karte); VB3 0 %; VB4 Szene ≈ 48 %; VB5 Gerät ≈ 25 %, Leiste ≈ 17 %; VB7 0 % (ohne Instanz-Bild); VB11 Bildband 19 %. Rund ein Fünftel der Seitenhöhe trägt ein Bild [geplant] | gleiche Folge; Bilder rechts über 7 Spalten, Text links über 5 | Bilder gleichmäßiger verteilt, Produktbeweis in zwei Szenen (V4, V5) |
| **Stärke und Ort der Inszenierung** | Stufe 4 nur in VB1 (8 % der Seitenhöhe); Stufe 3 in VB4 und VB5 (27 %); Stufe ≤ 2 auf 65 % der Seite. Autonome Bewegung nur beim Laden von VB1 (4,1 s); scrollgekoppelt nur Bildebenen (Tiefe VB1, Explosion VB4, Stationen und Leiste VB5); nutzergeführt nur das Wischen in VB2. Inszenierung am Rand des Kaufs, nie in ihm | eine Anheftstrecke (VB4, ≤ 1,5 Bildschirme), sonst wie Telefon | zwei Stufe-4-Abschnitte (V1, V4), Bühne „So funktioniert es“ mit Bildfolge und Lichtraum |
| **Platzierung der Handlungsaufforderungen** | Cream „Pakete ansehen“ bei y 633 (Bildschirm 1); Kartenknopf bei y ≈ 1.478 (Bildschirm 2); Ring „Rückruf oder Nachricht“ bei y ≈ 2.280; „Frage senden“ bei y ≈ 3.100 (Bildschirm 4); Kaufleiste ab Scrollstand 0,8 mit Paketfeld und ab 3,8 (VB4) mit Cream-Knopf auf jedem Bildschirm; VB11 bei y ≈ 8.712. Kein Bildschirm ohne erreichbare Handlung | Ring-Knopf im klebenden Kopf mit wechselndem Ziel; Cream in VB1, an der empfohlenen Karte, am Formular, in VB11 | Kopfknopf als Ring; Formular erst ab Bildschirm 9 |
| **Darstellung des Angebots** | Preis ab 0 s (Preisreihe), Paketkopf im Anschnitt, Karte ab Scrollstand 1,3; je Karte Preis 32 px, Einrichtung mit Inhalt, Steuerzeile, Unterschied mit Aufpreis, Knopf, Beispielbild; Namensleiste mit allen drei Preisen über der Reihe; Festblock direkt unter den Karten; Vergleich auf Abruf; Wiederholung als Zeilenwahl in VB11 | drei Karten nebeneinander im zweiten Bildschirm, Vergleich offen in den Kartenspalten | Pakete ab Bildschirm 6, Kennzahlen-Leiste davor |
| **Art der Entscheidungsunterstützung** | Vergleich auf einen Blick statt geführter Fragen: drei Preise ohne Wischen, „Gegenüber … +x € im Monat“ je Karte, Beispielbild je Markenstufe, Empfehlung mit Grund, Risikofakten am Preis, Gesprächsweg für Passungsfragen. Kein Paketfinder, keine Fragestrecke, keine Rechner | dasselbe, der Vergleich steht offen | gruppierter Vergleich zugeklappt, Risikoblock unter den Karten |
| **Übergänge** | harte, ruhige Schnitte: Haarlinie mit Nummer, Anschnitt 8–10 %, farbgleicher Grund. Entscheidungsflächen ohne Auftritt; übrige Abschnitte blenden einmal über Deckkraft ein (320 ms). Ein Rahmenbruch: das Erdlicht aus VB1 läuft über die Fotokante und endet 24 px vor der Haarlinie von VB2. Am Telefon keine Anheftstrecke | wie Telefon; Szene in VB4 angeheftet | Leiste V2 schiebt sich über das Startbild, Bühnen-Szenen am Schreibtisch angeheftet |

---

## Anwendung der Design-DNA (welche verbindlichen, variablen und Signature-Merkmale wo, in welcher Intensität)

### Verbindlich überall

Konstruktionsformel (DNA 5.1) und die elf Prinzipien (5.2) gelten in jedem Abschnitt, dazu G1–G9 (DG 2.3.1) und die Konstanten aus DG 2.4.1.
Wie sie in B greifen:

| Prinzip | Anwendung in Konzept B |
|---|---|
| Nr. 1 Frontale Bedienschicht | Karten, Namensleiste, Kaufleiste, Formular frontal; Perspektive nur im Foto (VB1), im gedrehten Blatt (VB4, HB2) und in den gewölbten Bildern der Leiste (VB5) |
| Nr. 2 Tiefe über Verdeckung | VB1 Text im Auslauf des Fotos; VB2 Kartenrand über dem Fuß des Beispielbilds; VB4 Blatt über Einzeiler, Bestellmaß-Karte über Blatt; VB5 Telefon vor Browser; HB2 Etikett über Blatt; Kaufleiste über dem Inhalt |
| Nr. 3 Ein Anker, eine Linie | Anker je Bildschirm: Bullauge (VB1), Beispielbild der mittleren Karte (VB2), keiner in VB3 (Arbeitsfläche, DG-E-1 C), Aufmaßblatt (VB4), Telefon bzw. mittleres Leistenbild (VB5), Ankerkachel (VB7), Maßstab (VB8), Bildband (VB11). Ordnungslinie überall die linke Spaltenkante (x = 16 bzw. Spaltenbeginn) |
| Nr. 4 Ein Raum | Fotos randlos ausgeblendet, Blatt als Objekt der Szene, kein Hauptbild als Fotokarte (DG-AB-9) |
| Nr. 5 Formsystem | Vollrundung, vier Radien voll · 24 · 18 · 12 (DG-AB-8); Kaufleiste ohne Radius an den Bildschirmkanten zählt als Randzone, nicht als fünfter Radius |
| Nr. 6 Kein Schlagschatten | Lichtkante an Glas-Meldungen, Gerät, Bestellmaß-Karte, Etikett und Kaufleiste; Begleitschatten nur auf dem weißen Papier |
| Nr. 7 Maßstabssprung | Telefon: Hauptelement immer Bild, Gerät, Blatt oder Maßstab (G4); höchstens drei Größenstufen je Ansicht (VB2: Preis 32, Klein-Stufe 13–17, Beispielbild; Paketname 17 nach DG-E-2 A) |
| Nr. 8 Negativraum | erster Bildschirm ≥ 33 % frei (dunkle Wand, Auslauf); in VB2 Luft über 24-px-Innenabstände und die zurückgenommenen Nachbarkarten [am Prototyp zu messen] |
| Nr. 9, 10 Bedienschicht ohne Material und Licht | kein grüner Schein an der empfohlenen Karte (DG-AB-14), Kaufleiste matt, Knöpfe ohne Glanz |
| Nr. 11 Grund untergeordnet | Grund `#161616` überall; Lichtraum nur in VB1, Messraster nur in VB4 |

### Variable Merkmale je Abschnitt (Ziel-Intensität auf der DNA-Skala 0–4)

D5 Form = 2, D6 Komposition = 3 und D14 Morphing = 0 gelten in allen Abschnitten. Fett: Ausdrucksträger des Abschnitts (SG 10.9: eine Stufe
über den übrigen Mitteln).

| Dimension | VB1 | VB2 | VB3 | VB4 | VB5 | VB6 | VB7 | VB8 | VB9–10 | VB11 | HB1 | HB2 | HB3 | KB-1/2 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| D1 Tiefe | 3 | 2 | 2 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 3 | 2 | 2 | 2 |
| D2 Material | 2 | 1 | 1 | **3** | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 0 |
| D3 Licht | **3** | 1 | 0 | 1 | 2 | 0 | 1 | 1 | 0 | 1 | 2 | 1 | 1 | 0 |
| D4 Schatten, Unschärfe | 2 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 0 |
| D7 Plastik | **3** | 2 | 0 | 2 | **3** | 0 | 1 | 1 | 0 | 2 | **3** | 2 | 1 | 0 |
| D8 Animation | 2 | 1 | 0 | 2 | 2 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| D9 Scroll | 2 | 0 | 0 | 2 | 2 | 0 | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 1 |
| D10 Mikrointeraktion | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 2 |
| D11 Bild | 3 | 2 | 0 | 3 | 3 | 1 | 1 | 1 | 0 | 2 | 3 | **3** | 2 | 0 |
| D12 Detail | 2 | 2 | 1 | **3** | 2 | 1 | 2 | **2** | 1 | 1 | 2 | 2 | 2 | 1 |
| D13 Grund | 2 | 1 | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 1 |
| D15 Perspektive | 2 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 2 | 1 | 0 | 0 |
| D16 Physik | 1 | 1 | 0 | 2 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| D17 Übergänge | 1 | 0 | 0 | 1 | 2 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 1 |
| D18 Typografie | 2 | 2 | 1 | 2 | 1 | 1 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 1 |
| Dialekt | B | C | C | B (Vitrine) | B (Gerät) | C | C | C | C | C | B | C/B | C | – |

Lesart gegenüber DG 2.2.19: B senkt die Produktdemonstration (DE in DG: D7 4, D3 3, D8 3) auf D7 3, D3 2, D8 2, weil keine Fenster-Bildfolge
und kein Lichtraum hinter dem Gerät vorgesehen sind; VB2, VB3 und VB11 liegen bei D9 0 und D17 0, weil Entscheidungsflächen ohne Auftritt
stehen (B-AB-7). VB2 erreicht D10 2 durch die Namensleiste mit Zeiger und die Wischreihe.

### Signature-Effekte (nur gezielt)

| Ort | Effekt (DNA 5.4) | Klasse (DG 2.4.2) | Budget der Stufe | Technik | Ersatz |
|---|---|---|---|---|---|
| VB1 | Glas mit Hintergrundunschärfe: vorderste Meldung | inszenierend | 1 von 2 (Stufe 4) | `backdrop-filter`, Stufe 1 | nicht deckende Ersatzfüllung; deckend bei reduzierter Transparenz |
| VB1 | Lichtübertrag des Erdlichts, zugleich der eine Rahmenbruch der Seite (DG-E-4 A) | inszenierend | 2 von 2 | radialer Verlauf, ≤ 3 Stopps | statisch |
| VB1 | Maßlinie mit Wert am Bullauge | informierend | 1 | SVG `stroke-dashoffset` | fertige Linie |
| VB4 | Material-Explosionsansicht mit Annotation | inszenierend | 1 von 1 (Stufe 3) | `transform` am Scrollfortschritt | auseinandergezogenes Endbild |
| VB4 | Messraster | informierend | 1 | CSS | gleich |
| VB5 | Schärfestaffelung an den Rändern der Leiste | inszenierend | 1 von 1 (Stufe 3) | im Bild eingebacken | ohne Unschärfe |
| VB8 | Fortschritts-Maßstab, Marken als Zustand | informierend | 1 | CSS | alle Marken stehen |
| VB1–VB11, HB1–HB7 | Abschnittsnummern an der Haarlinie | informierend, außerhalb des Budgets (DG 2.4.2) | – | – | – |
| HB1, Umschalter auf `/` | Glas des Umschalters über dem Startbild | inszenierend | 1 von 1 (Stufe 3) | `backdrop-filter` | Ersatzfüllung |

**Technikwahl, keine Signature:** Foto mit Tiefenkarte in VB1 (Stufe 2 mit Stufe 1 als Poster, DG-E-13); stumme Aufnahme ≤ 4 s im
Gerätebildschirm von VB5 (Motivbewegung, ein bewegter Träger).

**Bewusst nicht eingesetzt in B:** scrollgekoppelte Fenster-Bildfolge (Aufwand, Ladelast, Material ungeprüft, DG-H-6), Lichtraum hinter dem
Gerät, Riesenwort und Bild-Wort-Ergänzung (DG-E-3), Staub im Lichtkegel, Kantenlicht, Kennzahl-Kachel (die Kennzahlen-Leiste entfällt),
B2C-Bildfolge (IA K17), Rahmenbruch auf der Ansicht Hauseigentümer (B-AB-9), jede Signature in VB2, VB3, VB11, HB2–HB7.

---

## Phase G – Visuelle Dramaturgie der Hauptseite (Seite für Fensterbauer; zusätzlich die ersten zwei Bildschirme der Startseite)

### Seite für Fensterbauer: die zehn Punkte

1. **Erster Seitenaufruf.** Bei 0 ms stehen Kopf, Kicker, h1, Chips, Preisreihe und beide Knöpfe als HTML aus dem ersten Abruf (Prüfsuite,
   ohne JavaScript lesbar). Das Foto ist das LCP-Element (≤ 200 KB, feste Maße gegen Layoutverschiebung, vorrangig geladen) und erscheint
   in 0,9 s mit Deckkraft und Zoom 1,04 → 1. Dann fallen die drei Meldungen bei 0,9 / 1,6 / 2,3 s ein, danach zeichnet sich die Maßlinie
   bis 4,1 s; danach ist Ruhe. Die Fassung mit Tiefenkarte lädt erst nach dem LCP und übernimmt unsichtbar, wenn der Grafikchip die Bildrate
   hält. Telefon: keine Kaufleiste, der Kopf liegt flächenlos über dem Foto. Schreibtisch: Kopf 64 px klebend, sein Ring-Knopf bleibt
   ausgeblendet, solange die Cream-Pille im Bild ist.
2. **Aufmerksamkeitserzeuger.** Das Erdlicht im Bullauge: der einzige farbige Lichtkern (Zeichnungsblau) und das einzige
   Helligkeitszentrum des Bildschirms. Zweiter, bewusst einmaliger Reiz ist der Bewegungsbeginn der ersten Meldung bei 0,9 s (RE E5); nach
   drei Meldungen endet der Stapel (R2). Die Cream-Pille ist zweiter Pol auf der Diagonale, ohne den Fokusreiz zu teilen (DG G3). Die
   Preisreihe ist kein Blickfang: 13 px in `--muted` mit hellen Beträgen, damit sie gelesen und nicht angesprungen wird.
3. **Erste Information.** Die h1 „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“. Lesepfad Telefon: Bullauge → h1 → Chips →
   Preisreihe → Pille. Die zweite Information ist in B der Preis: drei Monatsbeträge, bevor ein Knopf kommt. Schreibtisch: Der Blick springt
   vom Bullauge rechts über die Diagonale zur h1 links.
4. **Position des Hauptmotivs.** Telefon: Astronaut am Bullauge im oberen Bilddrittel (y ≈ 80–330, am echten Foto zu prüfen), 25–35 % der
   Fläche; die Meldungen rechts oben überdecken weder Gesicht noch Hände, Zollstock oder Papierflieger (SKILL:87). Schreibtisch: rechts über
   7 von 12 Spalten bis an den Fensterrand, das Bullauge etwa auf Höhe der h1-Oberkante.
5. **Layoutveränderung beim Scrollen.** Die Ordnungsfigur wechselt sichtbar: senkrechter Stapel (VB1) → Kartenreihe unter einer
   Namensleiste (VB2; Schreibtisch drei Spalten, der Vergleich setzt die Spalten fort) → einspaltige Arbeitsfläche (VB3; Schreibtisch zwei
   Spalten) → Split mit Szene (VB4, VB5) → linke Maßstab-Kante (VB8) → Listen mit Haarlinien (VB9, VB10) → Zeilenwahl (VB11). Die linke
   Spaltenkante bleibt in allen Abschnitten die eine Ordnungslinie. Der Bildanteil fällt von 57 % (VB1) auf ≈ 14 % (VB2) und 0 % (VB3), steigt
   in VB4 auf ≈ 48 % und sinkt danach stufenweise.
6. **Einleitung des Folgeabschnitts.** VB1 → VB2: Anschnitt 72 px mit Haarlinie, „02“ und der oberen Hälfte von „Die Pakete“; das Erdlicht
   läuft über die Fotokante und endet 24 px vor der Haarlinie (Rahmenbruch). VB2 → VB3: Der Gesprächsweg sagt, was folgt; das Formular steht
   ohne Bildwechsel direkt darunter. VB3 → VB4: Unter dem Formular schneidet die Einzeiler-Karte „Bitte um Angebot für 3 Fenster“ als Bild
   an; der alte Weg eröffnet den Beweis. VB4 → VB5: Haarlinie mit Nummer, die Oberkante des Telefons im Anschnitt. VB5 → VB6: Die Leiste
   läuft über beide Ränder aus, darunter die Haarlinie. Ab VB6 nur Haarlinie mit Nummer und farbgleicher Grund.
7. **Einsatz von Tiefe und Material.** Drei Zonen: VB1 (Foto im gestalteten Licht, Glas, Lichtübertrag; vier Ebenen), VB4 (Papier,
   Schichten, Bestellmaß-Karte mit Begleitschatten auf Weiß, Messraster; vier Ebenen), VB5 (Gerät mit Lichtkante, echte Bildschirme, Leiste
   mit echten Oberflächen). Überall sonst ein flacher Stapel aus Grund, Karte mit 2-px-Ring und Schrift (Tiefe 2, Material 1).
8. **Bewusste Reduktion.** Entscheidungsflächen ohne Licht, Glas, Signature und Auftritt; kein grüner Schein; keine Kennzahlen-Leiste und
   kein „Kurz gesagt“; keine Leiste zwischen Startbild und Paketen; keine Fenster-Bildfolge, kein Riesenwort, kein Staub, kein Lichtraum am
   Gerät; Kundenschutz ohne Platzhalterbild; Fragen als Zeilen statt Karten; am Telefon kein klebender Kopf; nie zwei Knöpfe mit gleichem
   Ziel und gleicher Füllung in einem Bildschirm (Kaufleiste weicht in den Zonen VB1–VB3 und VB11).
9. **Zeitpunkt und Art der Angebotsdarstellung.** Ab 0 s die Preisreihe (drei Monatsbeträge, „plus Einrichtung ab 99 €“); ab Scrollstand
   0,9 der Paketkopf im Anschnitt; ab 1,0 Namensleiste mit allen drei Preisen; ab 1,3 die empfohlene Karte mit Preis 32 px, Einrichtung
   samt Inhalt, Steuerzeile, Unterschied mit Aufpreis, Knopf und Beispielbild; direkt darunter Verkaufsstand und Festblock; Vergleich auf
   Abruf (Schreibtisch offen); am Ende VB11 als Zeilenwahl. Die Karte ist Angebot und Produktbild zugleich.
10. **Hinführung zur Handlung.** Bildschirm 1: Cream „Pakete ansehen“ im Daumenbereich. Bildschirm 2: Kartenknopf (Cream an der
    empfohlenen Karte), Wischen ohne Verlust der Preise. Bildschirm 3: Festblock, dann Ring „Rückruf oder Nachricht“ für Passungsfragen.
    Bildschirm 4: Formular mit vorgewähltem Paket. Ab Scrollstand 3,8 (Beginn von VB4): Kaufleiste mit Paket und Cream „Anfragen“ auf jedem
    Bildschirm, bis VB11 die Wahl als Zeilen wiederholt. Zustand B: Kartenknöpfe und Kaufleiste führen in die Bestellung, VB3 bereitet sie vor (K33).

### Startseite: die ersten zwei Bildschirme

Standardansicht „Hauseigentümer“ (HB1 und der Anfang von HB2). Wer über den Umschalter wechselt, sieht VB1 und VB2 wie oben, mit dem Kopf der
Startseite und dem Glas-Umschalter über dem Foto.

| Punkt | Telefon 390 × 844 | Schreibtisch 1280 × 800 |
|---|---|---|
| 1 Erster Seitenaufruf | ohne JavaScript steht die Textfassung (K08) in derselben Abschnittsfolge; mit JavaScript erscheinen Eyebrow, h1, Lead, Preiszeile und Knöpfe ab dem ersten Bild (kein Wortaufbau), das Foto in 900 ms; Pilotleiste nur ohne Server | gleich; Kopf mit Umschalter neben dem Logo |
| 2 Aufmerksamkeitserzeuger | das Tageslicht in der Maueröffnung hinter dem Waschbären (warm, aus dem Foto; keine zusätzliche Lichtfläche) | gleich, rechts |
| 3 Erste Information | h1 „Fenster ausmessen. Selbst. eezi.“, dann die Preiszeile „Messen kostenlos, ohne Konto · Aufmaßblatt 12,99 €“ | gleich |
| 4 Position des Hauptmotivs | Waschbär an der Öffnung in der oberen Hälfte (y 0–480), Glas-Umschalter darüber bei y 68–112 links, ohne das Motiv zu verdecken | Foto rechts über 7 Spalten |
| 5 Layoutveränderung | Bildschirm 2: vom Foto-Stapel zur Objekt-Szene (Blatt mit Etikett) und darunter einer Preisliste an gemeinsamer Kante | Split 5 : 7 bleibt, das Bild wechselt von Foto zu Blatt |
| 6 Einleitung des Folgeabschnitts | Anschnitt y 772–844: Haarlinie, „02“, Oberkante von „Was im Aufmaß steckt.“ | Anschnitt 80 px |
| 7 Tiefe und Material | Bildschirm 1: Foto, Glas-Segment (vier Ebenen); Bildschirm 2: Papier des Blatts mit Etikett davor (Verdeckung), ohne Licht | gleich |
| 8 Bewusste Reduktion | kein Band über dem Foto, keine Kennzahlenleiste, keine Bildfolge, keine Ratgeber-Karten im zweiten Bildschirm; das Glas des Umschalters ist die einzige Signature | gleich |
| 9 Angebotsdarstellung | Preis bei 0 s in der Preiszeile; ab Scrollstand 0,9 das Aufmaßblatt als Produkt mit Preisetikett, ab 1,5 die drei Preiszeilen | Blatt und Preiszeilen im zweiten Bildschirm nebeneinander |
| 10 Hinführung zur Handlung | Cream „Jetzt ausmessen“ bei y 620; sobald sie den Bildschirm verlässt, übernimmt die Startleiste mit Preis und Cream „Jetzt ausmessen“ | Cream im ersten Bildschirm, danach der Kopfknopf „Fenster ausmessen“ (Cream, solange keine andere Cream-Pille sichtbar ist, IA 5.3.2) |

---

## Scroll Experience Timeline

### Seite für Fensterbauer, Telefon (390 × 844)

| Phase | Scrollbereich (Bildschirmhöhen) | Sichtbare Inhalte | Visuelles Hauptobjekt | Kamera, räumliche Komposition | Bewegung und Übergang | Informationshierarchie | Position der Handlungsaufforderung | Funktion im Kaufentscheidungsprozess |
|---|---|---|---|---|---|---|---|---|
| Laden | 0 (0–4,1 s) | VB1 vollständig | Foto, Bullauge | fester fotografischer Standpunkt, Foto oben 57 % | Foto 0,9 s, drei Meldungen, Maßlinie; danach Ruhe | h1 > Preisreihe > Chips | Cream y 633, Ring y 697 | Ankommen (S0), Ladebudget |
| Angebotsbühne | 0–0,9 | Foto, Meldungen, Kicker, h1, Chips, Preisreihe, Knöpfe, Anschnitt „02 Die Pakete“ | Astronaut am Bullauge | senkrechter Stapel, Text im Auslauf | Foto bleibt zurück (0,88), Glas mit Ersatzfüllung; Lichtübertrag bis vor VB2 | Zielgruppe, Produkt, Preis, Weg | Cream im Daumenbereich; Kaufleiste noch nicht da | S1 Zuordnen und Preisanker S4 |
| Paketkopf | 0,8–1,3 | Haarlinie, h2, Leitsatz, „In allen Paketen“, Namensleiste, Oberkante der Karte; Kaufleiste erscheint ohne Knopf | Namensleiste mit drei Preisen | frontale Zeilen an der linken Kante | Kaufleiste blendet 320 ms ein; kein Auftritt der Inhalte | Leitsatz > drei Preise > Gemeinsames | Kaufleiste nur Menü und Paketfeld | S4: Was haben alle gemeinsam, was kosten sie? |
| Paketkarte | 1,2–2,05 | eine Karte voll, Nachbarn je 40 px; Namensleiste | Beispielbild der Karte | Kartenreihe, Wischen quer | Wischen mit Trägheit, Beispielbild 24 px Nachlauf mit Feder; Zeiger gleitet | Preis 32 > Unterschied > Einrichtung > Steuer | Cream an der empfohlenen Karte, sonst Ring | S4 Bewerten, Z1+ über Unterschied und Empfehlung |
| Festblock, Vergleich, Gesprächsweg | 2,0–2,76 | Verkaufsstand, sechs Haken, Grenze, Link, Vergleichszeile, Gesprächsweg | Haken-Liste (kein Bild) | flache Zeilen | Vergleich öffnet 220 ms | Risikofakten > Grenze > Link | Ring „Rückruf oder Nachricht“; Kaufleiste ohne Knopf | S5-Kern: Was riskiere ich? |
| Anfrage | 2,76–3,77 | h2, Satz, Formular, Datenschutz, Anbieterzeile; Einzeiler-Karte im Anschnitt | Formular (Arbeitsfläche, kein Held) | eine Spalte | nur Rückmeldung; Dank ersetzt Formular, Lottie-Haken | Pflichtfelder > freiwillige Zeile > Datenschutz | Cream „Frage senden“ | S6 Handeln (Z1a) |
| Beweis, Teil 1 | 3,77–4,4 | h2 „Die Idee: Maße statt Einzeiler.“, Lead, Einzeiler-Karte, Blatt tritt davor | Aufmaßblatt | Vitrine, Blatt um −2° gedreht | Blatt schiebt sich 24 px vor die Karte; Text blendet über Deckkraft ein; Kaufleiste bekommt ihren Cream-Knopf | Gegenüberstellung > Lead | Kaufleiste: Paket und Cream „Anfragen“ | S2 Verstehen |
| Beweis, Teil 2 | 4,4–5,5 | Schichten mit Beschriftungen, h3, sieben Inhalte, F-09, vier Punkte, F-08 | Blatt in Explosionsansicht | Schichten nach oben rechts gestaffelt, Messraster | Schichten gleiten mit Trägheit auseinander, Führungslinien zeichnen sich | Inhalte > Feinaufmaß > Punkte | Kaufleiste | S3 Produktbeweis |
| Kundensicht | 5,5–6,3 | h2, Telefon mit Konfigurator, fünf Stationen, F-10 | Telefon | Gerät mittig, Stationen darunter | Bildschirm blendet je Station 220 ms über; Station 3 spielt ≤ 4 s Raffstore und steht | aktive Station > übrige | Kaufleiste | S3 Sehen |
| Leiste | 6,3–6,87 | Leiste Elementarten | mittleres Bild unter dem Lichtkegel | gewölbte Reihe über beide Ränder | Versatz nach Scrolltempo, Auslauf ≤ 1,2 s | Name des mittleren Elements | Kaufleiste | S3 Breite |
| Demos | 6,87–7,18 | zwei Zeilen, Ring (mit Demos drei Zeilen) | keins | flach | Einblenden über Deckkraft | Hinweis > Ring | Ring „Konfigurator ausprobieren“, Kaufleiste | Probieren (W3) |
| Kundenschutz | 7,18–7,87 | h2, Ankerkachel, drei Kacheln, Link § 10 | Ankerkachel (oder Instanz-Bild) | Kacheln untereinander | Haken ziehen sich einmal | „Nur Ihr Betrieb“ > übrige Zusagen | Kaufleiste | S5 Loyalität |
| Ablauf | 7,87–9,0 | h2, Dauer, Maßstab mit sechs Schritten, „Sie brauchen …“ | Maßstab | linke Maßstab-Kante | Marken werden grün beim Passieren der Bildschirmmitte | Dauer > Schritte > Mitwirkung | Kaufleiste | S5 Aufwand und Dauer |
| Fragen, Hintergrund | 9,0–10,07 | acht Fragen, drei zugeklappte Zeilen | keins | Zeilen mit Haarlinien | Öffnen 220 ms | Fragen gleichrangig | Kaufleiste | S5 Restzweifel, Belege |
| Abschluss | 10,07–10,69 | Bildband Bullauge, h2, drei Paketzeilen, Ring | Bildband | Band oben, Zeilen darunter | keine | empfohlene Zeile > übrige | Cream in der Zeile des empfohlenen Pakets; Kaufleiste ohne Knopf | S6 zweite Gelegenheit |
| Fuß | 10,69–11,49 | Brotkrumen, Fuß kurz, „Vertrag widerrufen“ | keins | Gruppen untereinander | keine | Navigation, Recht | Kaufleiste mit Knopf | Rückweg, Recht |

### Seite für Fensterbauer, Schreibtisch (1280 × 800)

Nur die Phasen, die sich vom Telefon unterscheiden; es gibt keine Kaufleiste, der klebende Kopf trägt den Ring-Knopf.

| Phase | Scrollbereich | Sichtbare Inhalte | Visuelles Hauptobjekt | Kamera, räumliche Komposition | Bewegung und Übergang | Informationshierarchie | Position der Handlungsaufforderung | Funktion |
|---|---|---|---|---|---|---|---|---|
| Angebotsbühne | 0–0,9 | Text links (Kicker, h1 40 px, Chips, Preisreihe, Knöpfe), Foto rechts, Anschnitt | Astronaut am Bullauge | Split 5 : 7, Foto bis an den Rand | wie Telefon; Tiefe des Fotos 0,88 | h1 > Preisreihe | Cream und Ring nebeneinander bei y ≈ 486; Kopfknopf ausgeblendet | S1 + Preisanker |
| Pakete | 1,0–2,2 | h2, Leitsatz, drei Karten nebeneinander mit Beispielbildern | drei Beispielbilder als Reihe, das mittlere mit Cream-Ring | drei Spalten auf gleicher Zeilenhöhe | kein Auftritt; Hover nur Kontur | Preise > Unterschiede > Knöpfe | Cream an der empfohlenen Karte; Kopfknopf ausgeblendet | S4 Bewerten |
| Vergleich offen, Festblock | 2,0–3,1 | ≈ 12 Merkmalszeilen in den Kartenspalten, Festblock links, Gesprächsweg rechts | keins (Tabelle) | Spalten setzen die Karten fort | keine | Unterschiede > Risikofakten | Ring „Rückruf oder Nachricht“; Kopfknopf wechselt ab hier auf „‹Paket› anfragen“, bleibt aber bis VB3 ausgeblendet | S4/S5 |
| Anfrage | 3,1–4,0 | zwei Spalten: Satz, Datenschutz, Anbieterzeile links; Formular rechts | keins | zwei Spalten | nur Rückmeldung | Felder > Hinweise | Cream „Frage senden“ | S6 |
| Beweis | 4,0–6,0 | Text und Liste links, Szene rechts, angeheftet ≤ 1,5 Bildschirmhöhen | Aufmaßblatt | Split, Szene steht, während der Text links durchläuft | Explosion am Fortschritt; ≥ ⅓ Ruhe im Endzustand, dann gibt die Szene die Seite frei | wie Telefon | Kopfknopf „‹Paket› anfragen“ (Ring) | S2, S3 |
| Kundensicht, Leiste | 6,0–7,1 | Stationen links, Browser mit Telefon rechts; Leiste über die volle Breite (176 px) | Telefon vor Browser | Split, Verdeckung der Browserecke | Stationswechsel 220 ms ohne Anheften; Leiste nach Scrolltempo | wie Telefon | Kopfknopf | S3 |
| Abschluss | 9,75–10,3 | Bildband über die volle Breite, drei Zeilen über 7 Spalten | Bildband | Band oben, Zeilen links | keine | empfohlene Zeile | Cream in der Zeile; Kopfknopf ausgeblendet | S6 |

### Startseite und Einstieg für Hauseigentümer, Telefon (390 × 844)

| Phase | Scrollbereich | Sichtbare Inhalte | Visuelles Hauptobjekt | Kamera, räumliche Komposition | Bewegung und Übergang | Informationshierarchie | Position der Handlungsaufforderung | Funktion im Entscheidungsprozess |
|---|---|---|---|---|---|---|---|---|
| Laden | 0 | HB1, Glas-Umschalter | Foto Waschbär | Foto oben 57 % | Foto 900 ms, sonst nichts | h1 > Preiszeile > Lead | Cream y 620, Ring y 684 | Ankommen |
| Angebotsbühne | 0–0,9 | Umschalter, Eyebrow, h1, Lead, Preiszeile, Knöpfe, Anschnitt „02“ | Licht in der Maueröffnung | senkrechter Stapel | Foto bleibt leicht zurück (Stufe 1, 0,9) | Aussage > Preis > Start | Cream im Daumenbereich | B1 Zuordnen, Preis vor Aufwand |
| Aufmaßblatt mit Preis | 0,91–1,6 | h2, Blatt mit Etikett, drei Preiszeilen; Startleiste erscheint | Aufmaßblatt | Vitrine, Blatt um −2° | Blatt legt sich einmal ab; Startleiste blendet ein | Ergebnis > Preis > kostenlose Teile | Startleiste mit Cream „Jetzt ausmessen“ | B2 Verstehen: was ich bekomme und zahle |
| Inhalt | 1,6–2,2 | sieben Inhalte, Messangabe, „kein Bestellmaß“ | Liste (Blatt im oberen Anschnitt) | Zeilen an der linken Kante | Einblenden über Deckkraft | Inhalte > Messregel | Startleiste | B2 |
| So geht es, Daten | 2,2–3,1 | h2 „Fotografieren. Messen. Wünschen.“, vier App-Bildschirme bzw. Maßstab, drei Haken, Ring | Reihe der App-Bildschirme | waagerechte Reihe | keine | Schritte > Datenschutz | Ring „Führung starten“; Startleiste | B3 Absichern |
| Fragen, Ratgeber | 3,1–4,0 | vier Fragen, Wischzeile mit sechs Schritten | keins | Zeilen, dann Wischzeile | Öffnen 220 ms; Wischen nativ | Fragen > Weg | Startleiste | B3, Zubringer |
| Abschluss | 4,0–4,45 | Bildband, h2, Cream, Preiszeile | Bildband Rohbau-Öffnung | Band oben | keine | Aufforderung > Preis | Cream „Jetzt ausmessen“; Startleiste ohne Knopf | B4 Handeln |
| Wechselkarte, Fuß | 4,45–5,59 | helle Karte, Fuß | helle Karte | – | keine | leiser Wechsel | Ring „Zur Seite für Fensterbauer“; Startleiste mit Knopf | Wechsel, Recht |

### Startseite und Einstieg für Hauseigentümer, Schreibtisch (1280 × 800)

| Phase | Scrollbereich | Unterschied zum Telefon |
|---|---|---|
| Angebotsbühne | 0–1,0 | Split 5 : 7; Umschalter im klebenden Kopf neben dem Logo; Cream und Ring nebeneinander |
| Aufmaßblatt mit Preis | 1,0–2,1 | Blatt mit Etikett rechts über 7 Spalten, Preiszeilen und Inhalt links; beides in einem Bildschirm |
| So geht es, Daten | 2,1–2,9 | vier App-Bildschirme rechts in einer Reihe, Schritte und Haken links |
| Ratgeber | 3,6–3,8 | sechs Schritte in einer Reihe ohne Wischen |
| Abschluss | 3,8–4,25 | Bildband 1280 × 200 über die volle Breite; Kopfknopf „Fenster ausmessen“ wird Ring, solange die Cream-Pille des Abschlusses im Bild ist |

---

## Stärken, Risiken, Aufwand (grob), Leistungsrisiken, Barrierefreiheit

### Stärken

- **Nah an der Vorgabe des Inhabers:** „Auf Verkaufsflächen führt jedes Element zum Kauf: Pakete sichtbar machen, zum höheren Paket
  hinführen, nächste Handlung klar“ (SKILL:50-51). Pakete im zweiten statt elften Bildschirm, Handlung auf jedem Bildschirm.
- **Forschungskonform an den belegten Stellen:** Preis und Weg in den ersten zwei Bildschirmen (E1, R12), Kosten früh und vollständig
  (E11, R1), Risikofakten am Preis (E12, R8), drei Preise ohne Wischen (E18, R9), Entscheidungsflächen ohne zusätzliche Blickziele (E2,
  E3).
- **Kurzer Weg für die Gruppen nahe am Kauf** (FB-2, FB-3, FB-6): ein Tippen zu den Paketen, drei zum Absenden der Anfrage.
- **Trägt beide Verkaufszustände** ohne Umbau: Knopftexte, Verkaufsstand, K33 und JSON-LD wechseln über die vorhandenen Schalter.
- **Geringes Leistungs- und Bauvolumen der Inszenierung:** ein Stufe-4-Abschnitt, zwei Stufe-3-Abschnitte, keine Bildfolge, keine
  Echtzeit-3D-Szene.
- **Nutzt Vorhandenes:** Paketdaten aus `web/assets/pakete.js`, Wischreihe (`web/assets/verkauf.js:333-405`), Formular mit Vorwahl,
  Logik „eine Cream-Pille je Bildschirm“ (`kopfCta`, `web/assets/portal.js:551-562`) als Vorbild der Kaufleiste, Meldungsstapel, Maßlinie.
- **Mitentscheider:** Ein Link auf `#pakete` zeigt Preis, Einrichtung, Steuer, Risiko und Bedingungen an einer Stelle.

### Risiken

- **Preis vor Verständnis** für FB-1 und FB-5: Wer die Lösungsart nicht kennt, sieht 29–64 € im Monat, bevor er weiß, was er bekommt
  [H, B-H-2]. Gegenmittel: h1, Chips und Beispielbilder; der Ring „Beispiel-Anfrage ansehen“ springt direkt zum Beweis.
- **Messlatte des Inhabers:** „Ein Fensterbauer soll an der Seite merken, dass eeziframes Webdesign und Digitales beherrscht“ (SKILL:38).
  Eine Seite, die nach dem Startbild Preisliste und Formular zeigt, kann schlichter wirken als gewünscht (DG-H-1, EA H-D10). Die Qualität muss
  in VB1, VB4, VB5 und in der Ausführung der Karten liegen.
- **Abhängigkeit vom Material:** Die These „das Produkt beweist sich im Angebot“ trägt nur mit echten Beispielbildern je Paket (O-12). Mit
  den heutigen Skizzen ist die Karte ein Preisblock ohne Beweis; das ist das größte inhaltliche Risiko des Konzepts.
- **Kaufleiste:** kann als aufdringlich oder werbeähnlich gelesen werden (Bandform am Rand, RE E5); EA 4.3.1/7 riet von Einblendungen über
  dem Inhalt ab. Sie verdeckt 64 px Inhalt und kann bei großer Schrift oder im Querformat zu viel Höhe nehmen [H, B-H-4].
- **Formular früh:** Wer noch nicht bereit ist, scrollt einen Bildschirm Formular, bevor der Beweis kommt (Gegenvariante IA-H-7).
- **„Vorläufige Preise“ im ersten Bildschirm** neben dem ersten Preis (EA H-D15, Gegenrisiko).
- **Nettopreise im ersten Bildschirm** auch in der Einbettung auf `/`, deren andere Ansicht Verbraucher anspricht (EA O-25; BGH I ZR 99/08,
  RE 3.4.3). Anwaltlich zu klären; B erhöht die Sichtbarkeit gegenüber IA.
- **Empfehlung ohne Entscheidung:** Welches Paket empfohlen wird, entscheidet der Inhaber (O-5); die Startposition der Reihe und der Cream-
  Knopf hängen daran.
- **Weniger Fenster-Realismus** als in IA (keine Bildfolge); nur die kurze Aufnahme in Station 3 trägt ihn (SKILL:122).
- **Vom Inhaber gemochtes Startbild verändert:** kürzeres Foto, Preisreihe statt „Kurz gesagt“ (SKILL:120); braucht seine Freigabe
  (B-AB-4).

### Aufwand (grob, relativ zur Ausgangsbasis IA)

| Baustein | Aufwand | Anmerkung |
|---|---|---|
| Neue Reihenfolge und Bausteine der Verkaufsseite (`functions/pakete-seite.js`, danach `node scripts/bedingungen-pdf.mjs`) | mittel | Anker bleiben; neue h2 in VB4 (Textentwurf) |
| VB1 mit Preisreihe KB-3, kürzerem Foto, neu verteiltem Stapel | klein | Tiefenkarte (Stufe 2) zusätzlich mittel |
| Paketkarten in B (Unterschied, Empfehlungsgrund, Einrichtung mit Inhalt), Namensleiste mit Preisen | mittel | Daten aus `pakete.js` |
| Vergleich gruppiert, am Schreibtisch offen über `subgrid` | mittel | Telefon ohne Querscrollen |
| Kaufleiste KB-1 und Startleiste KB-2 (Zonen, Einbettung, `inert`, `scroll-padding`, zwei Wurzeln, Neuaufbau) | mittel | in `verkauf.js` und `portal.js`; Prüfsuite um Leiste ergänzen |
| Formular mit aufklappbarer freiwilliger Zeile, Anbieterzeile | klein | Prüfsuite 29.2 bleibt gültig |
| VB4 Szene mit Explosionsansicht | groß | Schichten des Aufmaßblatts als einzelne Bilder nötig |
| VB5 Geräte-Bühne mit neuen Aufnahmen, Leiste mit echten Bildern, Aufnahme Station 3 | mittel plus Material | Bildschirmaufnahmen und Renderings neu (PA 1.7) |
| Ansicht Hauseigentümer HB1–HB7 in `portal.js` mit Textfassung | mittel | Preisetikett aus `web/config.js` |
| Prüfsuite (neue Elemente, acht Fragen, Kopf ohne Knopf am Telefon) | mittel | bewusste Änderungen nach IA-O-9 |
| Material beim Inhaber anfragen (SKILL 7) | – | Beispielbilder je Paket (kritisch), Konfigurator-Bildschirme unter der Beispieldomain, App-Bildschirme, Elementarten-Renderings, kurze Raffstore-Aufnahme |

Insgesamt mittel; die größten Posten sind die Explosionsansicht und das Material. Gegenüber IA entfallen die scrollgekoppelte Bildfolge und
die B2C-Bildfolge.

### Leistungsrisiken

- **LCP:** In VB1 und HB1 ist das Foto das LCP-Element (≤ 200 KB, erster Bildschirm ≤ 300 KB Bilder, R11); die Tiefenkarte lädt erst danach.
- **Startseite:** `portal.js` zeichnet die Ansicht und lädt heute rund 547 KB Skripte synchron, die Überschrift steht erst nach `portal.js`
  (PA 1.7, TD 1.4). Die Startleiste fügt Logik hinzu; ohne Entkopplung bleibt das LCP-Risiko der Startseite bestehen (Vorbedingung, nicht
  Konzept).
- **Kaufleiste:** Sichtbarkeit über IntersectionObserver an den Zonengrenzen, nicht über einen Scroll-Handler (INP ≤ 200 ms); nur
  Deckkraft animieren.
- **Glas:** höchstens zwei Live-Unschärfen gleichzeitig am Telefon (vorderste Meldung, auf `/` der Umschalter); während das Foto sich
  bewegt, Ersatzfüllung statt Live-Unschärfe.
- **VB4:** vier Ebenen mit `transform` am Scrollfortschritt; Schichtbilder zusammen ≤ 300 KB, erst bei Annäherung geladen.
- **VB5:** Aufnahme ≤ 4 s, stumm, ≤ 600 KB [H], Poster = letztes Bild, erst bei Annäherung; Leiste nur im Bild aktiv.
- **Beispielbilder:** drei Bilder à ≤ 60 KB, die Nachbarkarten erst beim ersten Wischen.
- **Schreibtisch:** offener Vergleich vergrößert das DOM, ist aber statisch.

### Barrierefreiheit

- **Kaufleiste und Startleiste:** eigene Landmarke mit zugänglichem Namen **Textentwurf** „Paket und Anfrage“; im DOM am Ende der Seite
  (Fokus erreicht sie nach dem Inhalt); `inert` und nicht fokussierbar, solange unsichtbar; der Knopf trägt den vollen Namen („Essential
  Plus anfragen“); kein `aria-live` beim Wechsel; Fokus nie unter der Leiste (`scroll-padding-bottom`, WCAG 2.4.11); Ziele ≥ 44 px.
  Bei 200 % Textgröße oder einer Fensterhöhe unter 500 px entfällt die Leiste und der Kopf klebt wieder [H].
- **Preisreihe:** echter Text mit gleich breiten Ziffern, `--muted` auf `#161616` ≈ 5,9:1 (DG-E-10); Beträge in `--text`.
- **Namensleiste und Wischreihe:** Segmente als Knöpfe mit Bezug zur Karte; Wischen hat die Tipp-Alternative (WCAG 2.5.7, R9); ohne
  JavaScript Karten untereinander.
- **Vergleich:** Tabelle mit Spalten- und Zeilenköpfen; am Telefon fester Kopf aus drei Kurznamen, kein Querscrollen.
- **Formular:** Beschriftungen sichtbar, Fehler am Feld mit Satz, `aria-invalid`, `aria-describedby`, Fokus auf das erste Fehlerfeld, Dank
  mit `role="status"` (PA 1.10 Nr. 14); die aufklappbare Zeile als `details` mit verständlicher Zusammenfassung.
- **Bewegung:** „weniger Bewegung“ zeigt die Endbilder (VB1, VB4, VB5), keine Parallaxe, keine Scroll-Kopplung; autonome Bewegung endet
  nach 4,1 s (WCAG 2.2.2); die Aufnahme in VB5 läuft einmal ≤ 4 s.
- **Glas:** deckend bei `prefers-reduced-transparency` und `prefers-contrast: more`; Text auf Glas 4,5:1 gegen die ungünstigste Bildstelle.
- **Dekor:** Meldungen, Preisetikett, Leiste-Bilder und Maßlinie `aria-hidden` mit `pointer-events: none`; was sie zeigen, steht zusätzlich
  als Text in der Bedienschicht (G1).
- **Ohne JavaScript:** alle Inhalte, Preise, Formular und Navigation bedienbar; keine Leiste.

---

## Annahmen, die getestet werden müssten

Prüfwege, die heute möglich sind: Gespräche und Lesetests mit Fensterbauern, Telefon-Video bei 390 × 844 (SKILL:109-113), Sichtprüfung durch
den Inhaber, Bildschirmzählung am Prototyp, das Paketfeld im Anfrageformular, nach der Freigabe Anfragen je Aufruf. Vergleichstests sind
nicht eingerichtet, ein Trichter für die Verkaufsseite fehlt (EA O-2). Getrennt nach Regel und Hypothese: Die verbindlichen Regeln stehen im
Abschnitt „Anwendung der Design-DNA“; alles hier ist [H].

| Nr. | Annahme | Grundlage | Gegenrisiko | Prüfweg |
|---|---|---|---|---|
| B-H-1 | Alle drei Monatspreise im ersten Bildschirm führen mehr Besucher zu den Paketen als ein einzelnes „ab 29 €“-Signal, ohne dass weniger weiterlesen | RE E1, E11, T1; EA H-D15 | Preisschock bei K1; „vorläufig“ neben dem ersten Preis | Anfragen je Aufruf vorher/nachher; Erfassung „Pakete erreicht“ (O-2); Gespräche |
| B-H-2 | Pakete als zweiter Abschnitt schaden FB-1 und FB-5 nicht, weil h1, Chips und Beispielbilder die Hauptaussage tragen | SKILL:23-24; RE E3 | Preis vor Verständnis | Lesetest: Hauptaussage nach zwei Bildschirmen in eigenen Worten |
| B-H-3 | Das Formular direkt nach dem Paketblock trägt besser als nach Kundenschutz und Ablauf | EA 4.3.2/7 | längerer Weg zum Beweis (IA-H-7) | Anteil der Anfragen mit vorgewähltem Paket; Gespräche |
| B-H-4 | Eine Kaufleiste im Daumenbereich erhöht Anfragen, ohne als aufdringlich empfunden zu werden, und der nicht klebende Kopf wird nicht vermisst | RE E18; SKILL:50-51; App-Leiste (PA 1.9/3) | Bandblindheit (E5), verdeckter Inhalt, Werbeeindruck | Telefon-Video, Sichtprüfung durch den Inhaber, Gespräche |
| B-H-5 | Dass die Leiste das zuletzt eingerastete Paket zeigt, wird verstanden und nicht als Vorauswahl missdeutet | – | Besucher fragt das falsche Paket an | Lesetest; Paketfeld der Anfragen gegen Gesprächsangaben |
| B-H-6 | Ein Beispielbild über ≈ 30 % der Karte macht die Markenstufen schneller verständlich als die Liste | SKILL:121-122; EA H-D8; IA-H-14 | Bild zu klein für die Unterschiede; Material fehlt | Lesetest „Was bekomme ich mit Plus zusätzlich?“ mit echten Bildern |
| B-H-7 | „Gegenüber … +x € im Monat“ je Karte erhöht den Anteil höherer Pakete | RE T5 | Aufpreis schreckt ab | Paketfeld der Anfragen bzw. Bestellungen je Paket |
| B-H-8 | Der am Schreibtisch offene Vergleich wird gelesen und verlängert den Weg zum Formular nicht spürbar | RE T7 | Tabellenwand vor dem Festblock | Bildschirmzählung; Gespräche |
| B-H-9 | „Beispiel-Anfrage ansehen“ als Ring im Startbild nützt Fensterbauern in Zustand A mehr als „Konfigurator ausprobieren“ | PA 1.9/4; EA W3 | Probieren ist der stärkere Wunsch (F-22) | Gespräche; Klicks auf beide Wege, falls messbar |
| B-H-10 | Eine Szene aus Gegenüberstellung und Explosionsansicht wird als ein Gedanke verstanden | DG-H-5; EA H-D9 | zwei Botschaften in einer Szene | Lesetest: „Was steht in jeder Anfrage, und was ist anders als beim Kontaktformular?“ |
| B-H-11 | Entscheidungsflächen ohne jeden Auftritt wirken neben den inszenierten Szenen nicht billig | DG-H-1; RE E2 | Messlatte des Inhabers (SKILL:38) | Telefon-Video beider Fassungen (mit und ohne Einblenden) |
| B-H-12 | Die kurze Raffstore-Aufnahme in Station 3 ersetzt für den Inhaber die Fenster-Bildfolge | SKILL:122 | wirkt zu klein im Gerät | Sichtprüfung durch den Inhaber |
| B-H-13 | Das Aufmaßblatt mit Preisetikett im zweiten Bildschirm führt Hauseigentümer eher in die App als eine Bildfolge | RE E3 (Produktbild), R13 | Ablauf weniger anschaulich (RE T18) | Trichter App geöffnet → Kasse → gekauft vorher/nachher |
| B-H-14 | Die Startleiste mit Preis hält Hauseigentümer im Kaufpfad, ohne die Ratgeber-Zubringer zu schwächen | RE E18, R13 | Ratgeber seltener aufgerufen | Aufrufe der Ratgeber von `/`; Trichter |
| B-H-15 | Firma und Telefon in einer aufklappbaren Zeile senken Abbrüche, ohne dass Betriebe seltener eine Telefonnummer angeben | RE E17 | Rückruf schwerer möglich | Anteil der Anfragen mit Telefonnummer vorher/nachher |
| B-H-16 | Eine Seite von ≈ 10,7 Bildschirmen trägt alle Stufen S1–S7 | EA H-D2; IA-H-2 | Zweifel bleiben offen | Bildschirmzählung; Rückfragen nach Anfragen |

**Offene Punkte, an denen Konzept B besonders hängt:** O-5 (empfohlenes Paket), O-12 (Beispielbilder je Paket), O-25 (Nettopreise auf
eingebetteter Seite), O-6 (Umsatzsteuer in Preisreihe und Steuerzeile), O-8 (Antwort- und Einrichtungszeiten im Formular und Ablauf), O-9
(Telefon und Person an der Anbieterzeile), PA-Frage 22 (Kurznamen in Preisreihe, Namensleiste und Kaufleiste), IA-O-9 (welche Erwartungen
der Prüfsuite bewusst angepasst werden).

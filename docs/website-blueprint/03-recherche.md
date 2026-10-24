# 3. Research- und Conversion-Erkenntnisse

Ergebnis 3 des Website-Blueprints (MASTER-PROMPT V4), Phase C, Zusammenführung. Stand 24.10.2026. Planungsdokument: Es ändert nichts
am Bestand und trifft keine Gestaltungsentscheidung. Entscheidungen fallen in den folgenden Phasen und beim Inhaber.

**Grundlage.** Drei Rohdateien der Recherche und die Bestandsaufnahme zum Geschäftsmodell. Für diese Zusammenführung wurde nicht neu
recherchiert; jede Quellenangabe stammt aus den Rohdateien, ihr Prüfstatus ist übernommen.

| Kürzel | Datei |
|---|---|
| WIS | docs/website-blueprint/recherche/wissenschaft.md (Erkenntnisse W-01 bis W-32) |
| WET | docs/website-blueprint/recherche/wettbewerb.md (zwölf Websites, Hypothesen H1 bis H8) |
| PAK | docs/website-blueprint/recherche/pakete-und-entscheidung.md (Beobachtungen B1 bis B8, Hypothesen H1 bis H40, Fragen F1 bis F14) |
| GM | docs/website-blueprint/bestand/geschaeftsmodell.md |
| VK | web/fuer-fensterbauer/index.html (Verkaufsseite) |
| PB | web/konfigurator-bedingungen/index.html (Paketbedingungen, „Entwurf zur anwaltlichen Prüfung“, PB:28) |
| SKILL | .claude/skills/premium-gestaltung/SKILL.md (Vorstellungen und Mindestanforderungen des Inhabers) |
| DR | .claude/skills/premium-gestaltung/designrichtung.md |

Belege im Repository stehen als `Datei:Zeile`. Hypothesen der Rohdateien tragen ein Präfix (WET-H3, PAK-H17), weil sich ihre Nummern
überschneiden. Quellen haben hier einheitliche Nummern: [L1] bis [L121] für Literatur und Studien, [M1] bis [M15] für Websites; die
Zuordnung zu den Nummern der Rohdateien steht in 3.6.

**Was verkauft wird (Kurzfassung, Belege in GM 1 und GM 3).**

- **B2B, Hauptfläche:** ein eigener Fenster-Konfigurator unter Domain und Marke des Betriebs, jede Anfrage als E-Mail mit
  Aufmaßblatt-PDF (README.md:3). Drei Pakete, netto, vorläufig: EEZI Essential 29 € im Monat + 99 € Einrichtung, EEZI Essential Plus
  39 € + 199 €, EEZI Signature 64 € + 279 € (`web/assets/pakete.js:44`, `:52`, `:60`; `VORLAEUFIG` `:17`). Der Verkauf ist nicht
  geöffnet; statt Bestellknöpfen gibt es ein Anfrageformular (docs/BESTELLUNG.md:50-57, VK:174). Hauptaussage laut Inhaber: der
  Konfigurator unter eigener Marke und Domain, nicht „Kunden messen selbst“ (SKILL:23-25).
- **B2C:** Messen, Fotos und 3-D-Modell kostenlos, Aufmaßblatt als PDF 7,99 € bis 17.11.2026, danach 12,99 € (`web/index.html:61`,
  `web/config.js:14`).
- **Reifegrad:** Pilotphase (README.md:5). Im Repository gibt es keine Kundenstimmen, keine Besucherzahlen, keine Konversionsraten und
  keine Nutzerforschung (GM 4.3).

---

## 3.1 Methode und Güte der Quellen

### Vorgehen

- **WIS:** Websuche zu neun Themenfeldern (UX und HCI, visuelle Aufmerksamkeit, Entscheidungspsychologie, Vertrauen, Conversion,
  Usability und Barrierefreiheit, Konfiguratoren, mobile Nutzung). **WET:** zwölf Websites in vier Gruppen. **PAK:** Darstellung von
  Paketen und Kaufentscheidung im B2B-Verkauf.
- **Kein Seitenabruf.** WebFetch scheiterte an der Namensauflösung, curl über den Proxy an einer 403-Sperre (WIS 0, WET 2, PAK 0).
  Alle Angaben beruhen auf Suchauszügen: Abstracts, Verlags- und Repositoriumsseiten, Pressemitteilungen, Sekundärquellen.
  **Kein Volltext wurde gelesen, keine Wettbewerbsseite gesehen.** Über Aussehen, Abschnittsfolge, Knopflage, Bewegung und Verhalten
  der Wettbewerbsseiten am Telefon liegt deshalb keine Beobachtung vor (WET 2).
- **Zusammenführung.** Erkenntnisse aus WIS und PAK zur selben Frage sind zusammengelegt. Wo die Rohdateien im Inhalt voneinander
  abweichen, gilt die vorsichtigere Angabe; wo eine Rohdatei eine Originalfundstelle zeigt und die andere nur eine Sekundärquelle,
  gilt die Originalfundstelle (Tabelle unten).

### Kennzeichnung

| Marke | Bedeutung in diesem Dokument |
|---|---|
| [Empirisch] | kontrolliertes Experiment, Feldexperiment, Metaanalyse oder peer-reviewte Arbeit |
| [Forschungsbasierte Praxis] | aus Nutzerstudien abgeleitete Leitlinien (Nielsen Norman Group, Baymard, Stanford), große Feldtests; Normen mit dem Zusatz „· Norm“ (WCAG) |
| [Branchenpraxis/Meinung] | Befragungen und Auswertungen von Anbietern und Beratungen (Gartner, 6sense, TrustRadius, Capterra, Navattic, Deloitte), Zählungen von Preisseiten, Fallberichte, Blogs, Beobachtungen an Wettbewerbsseiten; rechtliche Einordnungen aus Kammer- und Kanzleibeiträgen (keine Rechtsberatung) |
| [Hypothese] | Übertragung auf eeziframes; ungeprüft |

**Prüfstatus je Quelle:** **A** Abstract oder Original- bzw. Repositoriumsseite im Suchauszug gesehen · **S** nur über Sekundärquelle
(Presse, Blog, Zusammenfassung) · **N** nicht verifiziert oder widersprüchlich (in PAK als „U“ geführt). Angaben mit N tragen keine
Regel und gehören nicht in Verkaufstexte.

### Güte nach Themenfeld

| Feld | Tragfähigste Grundlage | Schwächste Stelle |
|---|---|---|
| Entscheidung: Auswahlmenge, Mitte, Voreinstellung, Anker, Preisaufteilung | mehrere Metaanalysen, Status A | Verbraucher- und Studierendenstichproben; gewichtige Gegenbefunde zu Lockvogel, Nudges, Verlustaversion |
| Aufmerksamkeit, Bewegung, erster Eindruck | Laborexperimente (Abrams & Christ, Burke, Lindgaard, Tuch, Reinecke), Status A | Werbung statt Produktbewegung; NN/g-Eyetracking nur sekundär (S) |
| Bild, Animation, kognitive Last | Metaanalysen (Höffler & Leutner, Noetel), Status A | Lernkontext, nicht Kaufentscheidung |
| Vertrauen | Online-Feldstudie (Fogg 2003), Metaanalyse (Kim & Peterson 2017) | ältere Daten; NN/g-Inhalte teils sekundär; keine Studie zu jungen B2B-Angeboten ohne Referenzen |
| B2B-Kaufverhalten | Gartner-Befragungen mit genannter Stichprobe, Status A | Methode nicht offengelegt, nicht peer-reviewt, eher größere Unternehmen |
| Ladezeit, Formulare | ein A/B-Test (Vodafone), ein Experiment (Seckler) | Handel mit hohem Volumen; mehrere oft zitierte Zahlen nicht verifiziert (N) |
| Barrierefreiheit | WCAG 2.2 (Norm), Status A | einzelne Kriterien nur über Sekundärquelle (2.4.11) |
| Konfiguratoren | Experimente und Feldexperimente (Franke, Hildebrand, Levav), Status A | Uhren, Anzüge, Autos, PCs; keine Fenster; Kauf statt Anfrage |
| Wettbewerb | Wortlaut, Preise und Handlungsaufforderungen aus Suchauszügen | kein Seitenbild; Suchindex teils veraltet (Linear-Preisseite etwa 514 Tage); Eigenangaben ungeprüft |

### Abweichungen zwischen den Rohdateien

| Punkt | WIS | PAK | hier |
|---|---|---|---|
| Neumann, Böckenholt & Sinha 2016 (Metaanalyse Kompromisseffekt) | A, mit Inhalt (142 Beobachtungen) | U, nur Titel bestätigt | N (widersprüchlich); nur zusammen mit Simonson, Valenzuela & Raghubir und Atalay verwendet |
| Befragungen von Gartner, 6sense, TrustRadius, Capterra | [Branchenpraxis/Meinung] | [Empirisch] (Anbieterbefragung) | [Branchenpraxis/Meinung] mit genannter Stichprobe |
| Huber, Payne & Puto 1982 | S (Sekundärseite) | A (Repositorium Duke) | A über die PAK-Fundstelle |
| Fogg et al. 2003 | A (colab.ws) | S (Consumer Reports) | A über die WIS-Fundstelle; 46,1 % beziehen sich auf Kommentare, nicht auf Personen |

### Wo keine Evidenz gefunden wurde

- Keine zitierte Studie untersucht Fensterbauer, Fenster-Konfiguratoren oder Hauseigentümer beim Aufmaß (WIS 0). Jede Konsequenz in
  diesem Dokument ist deshalb [Hypothese].
- Keine belastbare peer-reviewte Evidenz zu Farbe, Text und Lage von Knöpfen; die Praxisregel „Verb plus Gegenstand“ stammt aus
  Gestaltungssystemen und Blogs [L95], die Lagefrage aus Einzelfällen [L94] (WIS W-24).
- Keine Studie zur Gruppierung von Zeilen in Preisvergleichen, zur Darstellung der Differenz zum Nachbarpaket, zu B2B-Diensten mit
  Einrichtungsaufwand je Kunde, zu jungen B2B-Angeboten ohne Referenzen (PAK 4, 5, 10, 14).
- Keine Daten zu B2B-Software mit wenigen Besuchern; alle Ladezeit-Zahlen stammen aus dem Handel (WIS W-22).

### Grenzen im Bestand

- Größe der Zielbetriebe und wer dort über Software entscheidet, ist nicht belegt (GM 4.3; PAK F9).
- Im Repository gibt es keine Einrichtung für Vergleichstests. Die eigene Statistik zählt Gerätearten (`functions/api/statistik.js:57-59`)
  und zeigt den B2C-Trichter App geöffnet → Kasse geöffnet → Aufmaßblatt gekauft (`web/assets/zentrale.js:326-328`). Einen Trichter für
  die Verkaufsseite der Pakete gibt es nicht (WIS 0). Ob die Besucherzahl für Vergleichstests reichen würde, ist unbekannt (GM 4.3).

---

## 3.2 Die neunzehn wichtigsten Erkenntnisse

Neunzehn Erkenntnisse in fünf Gruppen: Aufmerksamkeit und Wahrnehmung (E1 bis E4), Bewegung (E5 bis E7), Entscheidung und Preis (E8 bis
E13), Vertrauen und B2B-Kauf (E14, E15), Technik, Bedienung und Produkt (E16 bis E19). Jede Konsequenz ist eine Hypothese; was daraus
als Regel gelten soll, steht in 3.5.1, was getestet werden soll, in 3.5.2.

### Aufmerksamkeit und Wahrnehmung

#### E1 Aufmerksamkeit liegt in den ersten zwei Bildschirmen; überflogen wird entlang der Überschriften

- **Aussage.** In einer Eyetracking-Auswertung (2018) lagen rund 57 % der Betrachtungszeit oberhalb der ersten Bildschirmkante und rund
  74 % in den ersten zwei Bildschirmhöhen; 2010 waren es rund 80 % oberhalb der Kante (laut Sekundärquelle 120 Teilnehmende, über 130.000
  Fixationen). Das F-Muster ist eines von mehreren Lesemustern; es entsteht vor allem bei ungegliederten Textflächen. Überschriften mit
  einer klaren Aussage stützen das Lesen entlang der Überschriften („Schichtkuchen“).
- **Kennzeichnung.** [Forschungsbasierte Praxis]; Zahlen Status S, F-Muster Status A.
- **Quellen.** [L1], [L2]; WIS W-01, W-02.
- **Gegenbefunde.** Schreibtisch-Bildschirme mit 1920 × 1080; kurze Seiten und Abbrüche erhöhen den Anteil oben rechnerisch. Ein
  Einzelfall berichtet mehr Abschlüsse mit der Handlungsaufforderung am Ende einer langen Verkaufsseite (+304 %, bei zugleich
  geändertem Text) [L94], Status N.
- **Konsequenz [Hypothese].** B2B: Die Pakete folgen heute auf Startbild, zwei Leisten, „Die Idee“, „So funktioniert es“, „Was in jeder
  Anfrage steht“ und zwei Bildbänder (docs/GESTALTUNG.md:447). Wer nicht auf „Pakete ansehen“ tippt (VK:63), sieht Preise spät.
  Kernaussage, Weg zu den Paketen und ein Preissignal gehören in die ersten zwei Telefon-Bildschirme; die Paketkarten selbst können
  weiter unten stehen. Wer nur Überschriften liest, muss das Angebot verstehen. Wer über die Startseite kommt, sieht zuerst die Ansicht
  für Hauseigentümer; die Verkaufsseite liegt hinter dem Umschalter (`web/assets/portal.js:845-853`; GM 5.2, Frage 7.1/2).
  B2C: Startknopf, „kostenlos, ohne Konto“ und der Preis des Aufmaßblatts gehören in die ersten zwei Telefon-Bildschirme.

#### E2 Der erste Eindruck entsteht in Sekundenbruchteilen; Komplexität kostet, Erwartbarkeit hilft

- **Aussage.** Urteile über die visuelle Anziehung einer Website entstehen in 50 ms und stimmen mit späteren Urteilen überein
  (Lindgaard 2006). Komplexität wirkt schon nach 17 ms; geringe Komplexität und hohe Prototypikalität („sieht aus wie eine typische
  Seite ihrer Art“) werden als ansprechend bewertet (Tuch 2012, 119 Screenshots). Farbigkeit und Komplexität erklären rund die Hälfte
  der Varianz im Ersturteil nach 500 ms; der erste Eindruck beeinflusst spätere Urteile über Bedienbarkeit und Vertrauenswürdigkeit
  (Reinecke 2013, 450 Websites, 548 Personen).
- **Kennzeichnung.** [Empirisch], Status A.
- **Quellen.** [L8], [L9], [L10]; WIS W-04.
- **Gegenbefunde.** Die Verbindung „Ersturteil → Glaubwürdigkeit“ ist bei Lindgaard eine Deutung der Presse. Der Effekt der
  Prototypikalität ist bei 17 ms schwächer.
- **Konsequenz [Hypothese].** „Ein Held je Bildschirm“ (SKILL:12-14) ist forschungskonform; jedes Zusatzelement kostet im Ersturteil.
  Erwartbare Orte (Logo oben links, Preise bei den Paketen, Kontakt im Fuß) bleiben. Der Abstand zum „Baukasten-Muster“ (SKILL:39)
  entsteht über Material, Licht und Bildsprache, nicht über ungewohnte Navigation oder Bedienung. Gilt verstärkt für Hauseigentümer, die
  eeziframes nicht kennen.

#### E3 Zielfremde Details und rein dekorative Bilder kosten Aufmerksamkeit; gezielte Hervorhebung hilft

- **Aussage.** Übersicht über 29 Reviews (1.189 Studien, 78.177 Teilnehmende): robuste Belege für Hervorhebung, räumliche und zeitliche
  Nähe von Bild und Text und für Kohärenz, also das Weglassen verführerischer Details (Noetel 2022). Interessante, aber zielfremde
  Inhalte verschlechtern das Lernen, vor allem bildliche (Rey 2012; eine Folge-Metaanalyse mit 58 Studien bestätigt die Richtung).
  Große, rein dekorative Bilder werden übersprungen, Bilder von Produkten und echten Menschen als Inhalt betrachtet (NN/g). Ein Gesicht
  mit abgewandtem Blick lenkte mehr Aufmerksamkeit auf Text und Produkt als eines mit direktem Blick (Sajjacholapunt & Ball 2014).
- **Kennzeichnung.** [Empirisch] (Noetel, Sweller, Sajjacholapunt & Ball: A; Rey-Effektgrößen und Folgestudie: S);
  [Forschungsbasierte Praxis] (NN/g, A/S, Datum N).
- **Quellen.** [L5], [L6], [L7], [L19], [L20]; WIS W-03, W-11.
- **Gegenbefunde.** Lernkontext, nicht Kaufentscheidung. Eine Studie von 2025 fand bei kontrolliertem Inhalt keinen Effekt von
  Multimedia-Gestaltung (nur Sekundärhinweis, N).
- **Konsequenz [Hypothese].** „Detailreichtum“ (SKILL:47) wirkt, solange die Details am Hauptobjekt sitzen (Material, Licht, Maßlinie am
  Fenster) und keine weiteren Blickziele schaffen. Die schwebenden Nebenobjekte im Startbild (Papierflieger, Handy, Bleistift;
  docs/GESTALTUNG.md:447) sind im Sinne der Forschung zielfremd: Markennutzen plausibel, Preis ist Aufmerksamkeit. Der Inhaber mag
  dieses Startbild (SKILL:120); das ist eine Prüfaufgabe, kein Gegenvorschlag (3.5.3). Produktbeweis tragen Renderings und Bildschirme
  aus dem Konfigurator (SKILL:41-42). Wo eine Figur im Bild ist, zeigen Blick oder Handlung zur Botschaft oder zum Knopf. B2C: Das Modell
  des eigenen Fensters ist das stärkste Bild, weil es Produkt und Ergebnis zugleich ist.

#### E4 Schönheit schützt nicht vor Abwertung durch Bedienfehler

- **Aussage.** Am Geldautomaten-Simulator hob die Ästhetik die Urteile über Schönheit und Bedienbarkeit nach der Nutzung, nicht die
  tatsächliche Bedienbarkeit (Tractinsky 2000). In einem Laborversuch mit 80 Teilnehmenden und vier Shop-Varianten änderte die Ästhetik
  die wahrgenommene Bedienbarkeit nicht; schlechte Bedienbarkeit senkte dagegen das Urteil über die Ästhetik, vermittelt über Frust
  (Tuch 2012).
- **Kennzeichnung.** [Empirisch], Status A.
- **Quellen.** [L11], [L12]; WIS W-05.
- **Gegenbefunde.** Die beiden Studien widersprechen sich in der Richtung „schön → bedienbar“; einig sind sie, dass Bedienprobleme das
  Gesamturteil drücken.
- **Konsequenz [Hypothese].** Hochwertige Gestaltung ist Voraussetzung für die Messlatte des Inhabers (SKILL:38-39), aber kein Schutz.
  Weil das Produkt selbst eine Website-Komponente ist, wird jede Störung (Ruckeln, verdeckter Knopf, langes Laden) zum Produktbeleg.
  B2C: Ein Fehler im ersten Messschritt färbt das Urteil über die ganze Marke.

### Bewegung

#### E5 Einsetzende Bewegung zieht den Blick; bandförmige, bewegte Flächen werden übersehen

- **Aussage.** Der Beginn einer Bewegung fängt Aufmerksamkeit, auch wenn er keine Information trägt (Abrams & Christ 2003). Werbebanner
  verlängerten Suchzeiten und wurden kaum erinnert, animierte schlechter als statische (Burke 2005). Störende Anzeigen führten zu
  früherem Abbruch; die störendsten waren laut Sekundärquelle animiert (Goldstein 2013). Nutzer meiden Bereiche, die nach Werbung
  aussehen (Lage oben oder rechts, Bandform, Animation), auch wenn es Inhalt ist (NN/g, „Banner Blindness Revisited“).
- **Kennzeichnung.** [Empirisch] (Abrams & Christ, Burke, Goldstein: A; Einzelzahlen Goldstein S); [Forschungsbasierte Praxis] (NN/g,
  S, Datum N).
- **Quellen.** [L13], [L14], [L15], [L16]; WIS W-07, W-08.
- **Gegenbefunde.** Untersucht wurde Werbung, nicht Produktbewegung. Spätere Arbeiten zeigen den Fang durch Bewegungsbeginn nur, wenn
  nicht zugleich ein neues Objekt erscheint (Sekundärhinweis).
- **Konsequenz [Hypothese].** B2B: Der Meldungsstapel im Startbild (alle 3,4 s fällt eine neue Meldung ein) und die Laufleisten in
  Dauerschleife setzen wiederholt Bewegungsanfänge neben Überschrift und Hauptknopf (docs/GESTALTUNG.md:447, :451). Die Leisten sind
  bewusst „wie die Partner-Logoleisten anderer Seiten“ (SKILL:121): bandförmig, bewegt, über die volle Breite, also mit genau den
  Merkmalen, die Banner-Blindheit auslösen. Entscheidungsrelevante Inhalte der Cream-Leiste (Werktage bis zum Livegang, „0 € Gebühr je
  Anfrage“; VK:70) müssen deshalb zusätzlich statisch an der Stelle der Entscheidung stehen. B2C: Der Einführungspreis steht im Band
  ganz oben, einem typischen Ort für Banner-Blindheit, und zusätzlich im Text (`web/index.html:61`); ob er im ersten Bildschirm außerhalb
  des Bands sichtbar ist, ist zu prüfen.

#### E6 Animation hilft, wenn sie den Gegenstand zeigt; Parallaxe bringt Spaß, keinen messbaren Nutzen

- **Aussage.** Metaanalyse über 26 Studien mit 76 Vergleichen: Animation schlägt statische Bilder im Mittel mit d = 0,37; darstellende
  Animation d = 0,40, realistische Darstellung d = 0,76, für Handlungswissen d = 1,06 (Höffler & Leutner 2007). Eine Parallaxe-Website
  verbesserte bei 86 Teilnehmenden weder Bedienbarkeit noch Zufriedenheit noch Gesamterlebnis; besser war „Spaß“ (Frederick 2015).
- **Kennzeichnung.** [Empirisch], Status A.
- **Quellen.** [L17], [L18]; WIS W-09, W-10.
- **Gegenbefunde.** Eine Folge-Metaanalyse fand einen kleineren Gesamteffekt (g = 0,226; Fundstelle nicht eindeutig verifiziert, N).
  Lernkontext; studentische Stichprobe. Laut Anbieterblog litten in der Parallaxe-Studie zwei Teilnehmende unter Übelkeit (S).
- **Konsequenz [Hypothese].** Bewegung, die den Konfigurator vorführt (Flügel öffnet, Raffstore fährt, Maßlinie zeichnet sich), ist
  durch die Forschung gedeckt und entspricht „Bewegung mit Sinn“ (SKILL:45-46). Gleichförmiges Schweben und Wiegen hat diese Deckung
  nicht. Tiefe und Parallaxe (SKILL:43-44) sind als Markenbeweis vertretbar, aber kein Hebel für Verstehen oder Abschluss.
  B2C: Ein kurzer, realistischer Ablauf „Foto → Maß → Modell → Blatt“ erklärt das Messen besser als Text. Die vom Inhaber abgelehnte
  Umsetzung „Handy zu Briefumschlag“ (SKILL:125) bleibt ausgeschlossen; die Forschung spricht für das Prinzip, nicht für diese Umsetzung.

#### E7 Automatische Dauerbewegung braucht ein Ende oder einen sichtbaren Anhalten-Knopf

- **Aussage.** WCAG 2.2.2 (Stufe A): Bewegung, die automatisch startet, länger als 5 s läuft und neben anderem Inhalt steht, braucht
  eine Möglichkeit zum Anhalten, Beenden oder Ausblenden. Die dokumentierten ausreichenden Techniken sind Bedienelemente auf der Seite;
  ob die Systemeinstellung „weniger Bewegung“ allein genügt, ist nicht geklärt. WCAG 2.3.3 (Stufe AAA) nennt Parallaxe und
  scrollgebundene Bewegung als Auslöser von Schwindel, Übelkeit und Kopfschmerz. In einer US-Erhebung zeigten 35,4 % der Erwachsenen ab
  40 Hinweise auf eine vestibuläre Funktionsstörung (5.086 Personen, Agrawal 2009).
- **Kennzeichnung.** [Forschungsbasierte Praxis · Norm] (WCAG, A; Diskussion zu „weniger Bewegung“ S); [Empirisch] (Agrawal, S).
- **Quellen.** [L100], [L99], [L102]; WIS W-26.
- **Gegenbefunde.** Eine Störung im Gleichgewichtstest ist nicht dasselbe wie Empfindlichkeit für Bewegung am Bildschirm; die Zahl
  gibt eine Größenordnung, keinen Anteil unter Besuchern.
- **Konsequenz [Hypothese].** Bestand: Laufleisten in Dauerschleife, Meldungsstapel, Lottie-Zeichen als Schleife; bei „weniger
  Bewegung“ stehen sie, mit der Maus wird eine Leiste langsamer, einen sichtbaren Anhalten-Knopf gibt es nicht (WIS W-26 nach
  docs/GESTALTUNG.md:447-451 und `web/assets/verkauf.js:171-186`). Daraus folgt Regel R2 (3.5.1). Dass Inhaber von Fensterbaubetrieben
  häufig über 40 sind, ist eine Annahme; im Repository ist sie nicht belegt.

### Entscheidung und Preis

#### E8 Nicht die Zahl der Pakete überfordert, sondern Merkmalsfülle bei unsicherer Präferenz

- **Aussage.** Im Probierstand-Versuch kauften mehr Kunden bei 6 als bei 24 Marmeladen (Iyengar & Lepper 2000). Metaanalyse über 50
  Experimente (N = 5.036): mittlerer Effekt der Auswahlgröße praktisch null, große Streuung (Scheibehenne 2010). Metaanalyse über 99
  Beobachtungen (N = 7.202): Der Effekt ist signifikant, wenn vier Moderatoren hoch sind: Komplexität des Angebots, Schwierigkeit der
  Aufgabe, Unsicherheit über die eigene Präferenz, Ziel, Aufwand zu sparen (Chernev 2015). Progressive Disclosure (Seltenes auf eine
  zweite Ebene) verbessert laut Nielsen Erlernbarkeit und Fehlerrate, wenn die erste Ebene das Wichtige enthält.
- **Kennzeichnung.** [Empirisch] (Metaanalysen A, Marmeladen-Versuch S); [Forschungsbasierte Praxis] (Progressive Disclosure, S).
- **Quellen.** [L21], [L22], [L23], [L3]; WIS W-06, W-12; PAK 2.
- **Gegenbefunde.** Die beiden Metaanalysen widersprechen sich im Gesamteffekt; einig sind sie darin, dass Komplexität und unklare
  Präferenz die Lage verschärfen. Kontrollierte Studien zur Wirksamkeit von Progressive Disclosure gibt es kaum (S).
- **Konsequenz [Hypothese].** B2B: Drei Pakete sind unkritisch. Last entsteht durch den Vergleich (2 Preiszeilen und 15 Merkmalszeilen,
  davon 3 in allen Paketen gleich; PAK 1.1 nach `web/assets/pakete.js:71-99`) und dadurch, dass ein Fensterbauer vor dem ersten Kauf
  eines Konfigurators kaum weiß, ob er Dashboard, neutralen Absender oder Einladungslinks braucht. Hilfe: wenige
  Unterscheidungsmerkmale je Paket, Vergleich zugeklappt (Bestand, docs/GESTALTUNG.md:454), die Frage „Welches Paket passt?“
  beantworten. Die drei Planungstiefen der App (17, 30 und 49 Fragen bei einem dreiflügeligen Fenster, Vorgabe die mittlere;
  docs/GESTALTUNG.md:169-176) sind Progressive Disclosure und ein vorzeigbares Verkaufsargument. B2C: Die App fragt rund 90 Dinge ab
  (docs/GESTALTUNG.md:171); die Moderatoren nach Chernev sind hoch. Der Bestand antwortet mit „Weiß ich noch nicht“, „Standard des
  Fensterbauers“ und drei Tiefen (README.md:3; docs/GESTALTUNG.md:173-176); der Einstieg kann das versprechen.

#### E9 Mitte, Markierung und Startposition wirken gleichgerichtet; wirksam ist ein Grund, nicht das Etikett

- **Aussage.** Eine Option gewinnt Anteile, wenn sie zur mittleren wird, stärker, wenn die Wahl vor anderen begründet werden muss
  (Simonson 1989). Menschen halten die mittlere Option für die beliebteste und wählen sie häufiger (Valenzuela & Raghubir 2009). Der
  erste Blick fällt auf die Mitte; die Zunahme der Aufmerksamkeit auf die Mitte kurz vor der Entscheidung sagt die Wahl voraus (Atalay
  2012, Studie 1 mit 67 Studierenden). Voreinstellungen verschieben Entscheidungen um rund d = 0,63 bis 0,68 bei sehr großer Streuung,
  stärker, wenn sie als Empfehlung gelesen werden (Jachimowicz 2019, 58 Studien, N = 73.675); Eingriffe in die Struktur der Wahl wirken
  unter den Nudges am stärksten (Mertens 2022, d = 0,45). Im Restaurant-Feldexperiment hob die Angabe der fünf meistbestellten Gerichte
  deren Nachfrage um etwa 13 bis 20 %; das bloße Nennen von Beispielgerichten ohne Beliebtheitsangabe wirkte nicht signifikant (Cai
  2009). Laut einer Metaanalyse über 142 Beobachtungen ist der Kompromisseffekt bei vielen nicht-numerischen Merkmalen stärker (Neumann
  2016, Status N).
- **Kennzeichnung.** [Empirisch]; Status A, Neumann N.
- **Quellen.** [L24], [L25], [L26], [L27], [L40], [L41], [L45]; WIS W-13, W-17; PAK 3.
- **Gegenbefunde.** Nach Korrektur für Publikationsverzerrung bleibt für Nudges insgesamt kein Beleg (Maier 2022); eine andere
  Reanalyse schätzt d = 0,08 bis 0,31 und nennt Voreinstellungen als Ausnahme mit verlässlicher Wirkung (Szaszi 2022).
  Empfehlungsschilder können die Zahl ernsthaft erwogener Optionen vergrößern und die Entscheidung erschweren (Goodman 2013, Status N).
  Der Mitte-Effekt sinkt, wenn die eigenen Präferenzen präsent sind.
- **Quellen der Gegenbefunde.** [L42], [L43], [L44].
- **Konsequenz [Hypothese].** B2B: Plus steht in der Mitte, trägt „Empfohlen“ und den einzigen Cream-Knopf; am Telefon beginnt die
  Wischreihe bei Plus (`functions/pakete-seite.js:32-33`, `:128-130`; docs/GESTALTUNG.md:452). Ausgewählt ist Plus nach der Position
  („das mittlere der Liste“), eine Begründung nennt die Karte nicht (PAK B1). Die Empfehlung braucht einen sachlichen Grund in einer
  Zeile, abgeleitet aus Merkmalen (eigene Gestaltung, Logo, Firmenfarbe, Fotos, eigene Startseite in Suchmaschinen;
  `web/assets/pakete.js:52-57`). „Beliebt“ erst mit gezählten Bestellungen (SKILL:49). Welches Paket empfohlen wird, entscheidet der
  Inhaber: Plus nutzt Mitte und Kompromiss; eine Empfehlung von Signature erfüllte „zum höheren Paket hinführen“ (SKILL:50) wörtlicher,
  verzichtete aber auf den Mitte-Effekt (PAK-H4, PAK-H5). B2C: nicht anwendbar (ein Produkt, ein Preis).

#### E10 Lockvogelpakete sind unzuverlässig; Anker und Reihenfolge wirken unter Bedingungen

- **Aussage.** Eine asymmetrisch dominierte Zusatzoption erhöht den Anteil der dominierenden (Huber 1982, 153 Studierende). Erste
  Zahlen ziehen spätere Schätzungen an (Tversky & Kahneman 1974); der Ankereffekt replizierte im Many-Labs-Projekt (36 Stichproben,
  6.344 Teilnehmende); willkürliche Anker beeinflussen die Zahlungsbereitschaft (Ariely 2003). Absteigend gezeigte Preise führten zu
  teureren Wahlen, aufsteigende zu günstigeren, sofern vom Preis auf Qualität geschlossen wurde (Suk 2012). Der erste Preis, den ein
  B2B-Käufer sieht, setzt seine Erwartung für die Kategorie (NN/g). In einer Zählung von 250 SaaS-Preisseiten (2015) waren drei Pläne
  am häufigsten, 81 % ordneten von niedrig nach hoch (Nenner unklar).
- **Kennzeichnung.** [Empirisch] (A; Tversky & Kahneman und Many Labs S); [Forschungsbasierte Praxis] (NN/g, A);
  [Branchenpraxis/Meinung] (Zählung).
- **Quellen.** [L28], [L32], [L33], [L35], [L36], [L67], [L81]; WIS W-13, W-14; PAK 2, 4.
- **Gegenbefunde.** Der Lockvogeleffekt trat meist nicht auf, wenn Optionen realistisch beschrieben, bebildert oder erlebt wurden
  (Frederick 2014); in 91 Versuchen waren nur 11 Effekte verlässlich (Yang & Lynn 2014); die Erstautoren halten ihn unter
  Originalbedingungen für robust (Huber 2014) [L29], [L30], [L31]. Ankereffekte mit Marktgütern fielen kleiner aus; ob das eine
  gescheiterte Replikation ist, ist umstritten (Maniadis 2014) [L34].
- **Konsequenz [Hypothese].** B2B: Kein Paket ist von einem anderen dominiert; Preise und Merkmale steigen gemeinsam
  (`web/assets/pakete.js:43-66`). Einen Lockvogel einzubauen ist nach der Befundlage wenig aussichtsreich, gerade weil die Pakete sich in
  sichtbaren, bebilderten Markenmerkmalen unterscheiden, und widerspräche SKILL:49. Signature ist ein echter oberer Anker; er wirkt nur,
  wenn er vor der Entscheidung gesehen wird. Am Telefon beginnt die Reihe bei Plus, Signature liegt hinter einem Wischen. Am
  Schreibtisch bleibt die Reihenfolge aufsteigend (Erwartung), absteigend nur als Test. Zahlen in der Leiste („0 € Gebühr je
  Anfrage“) setzen ebenfalls Anker. B2C: „7,99 €, danach 12,99 €“ ist ein wahrer Referenzpreis (`web/config.js:14`); einen „statt“-Preis
  zeigt die Seite bewusst nicht (docs/ABRECHNUNG.md:11).

#### E11 Kosten früh und vollständig zeigen; spät aufgedeckte Kosten schaden

- **Aussage.** Werden optionale Gebühren erst spät gezeigt, wählen Käufer häufiger eine scheinbar günstige Option, bleiben trotz höherem
  Gesamtpreis dabei und sind unzufriedener (Santana 2020, sechs Experimente). Aufgeteilte Preise werden günstiger beurteilt, vor allem
  wenn der Zuschlag als üblich und nützlich gilt (Metaanalyse über 149 Beobachtungen, N = 12.878 [L49]; Morwitz 1998; Greenleaf 2016).
  Freiwillige Kostentransparenz erhöhte die Kaufbereitschaft über Vertrauen; im Feldversuch stiegen die Verkäufe um 22 % (Mohan 2020).
  B2B-Käufer fürchten Überraschungskosten; bei variablen Preisen helfen Beispiele für typische Fälle (NN/g). Zusatzkosten sind im Handel
  der häufigste Abbruchgrund (Baymard 2024, 48 % von 1.012 Befragten). Kleine wiederkehrende Beträge werden mit kleinen laufenden
  Ausgaben verglichen (Gourville 1998); Pauschalen werden oft auch dann gewählt, wenn sie teurer sind (Lambrecht & Skiera 2006).
- **Kennzeichnung.** [Empirisch] (A; Moderatoren bei Greenleaf S; Autorenschaft [L49] N); [Forschungsbasierte Praxis] (NN/g A,
  Baymard S).
- **Quellen.** [L49], [L50], [L51], [L52], [L54], [L56], [L57], [L66], [L67], [L93]; WIS W-16, W-23; PAK 6, 8.
- **Gegenbefunde.** Im Feldexperiment bei StubHub senkte die Anzeige der Gebühren von Anfang an Käufe und Umsatz (Blake 2021; Verkauf
  von Tickets an Verbraucher; Prozentwerte S) [L53]. Die Forschung zur Preisaufteilung liefert einen kaufmännischen Anreiz, die
  Einrichtung klein zu zeigen.
- **Konsequenz [Hypothese].** B2B: Der Monatspreis bleibt Hauptzahl; die Einrichtung steht gut lesbar daneben, mit einem Satz, was sie
  enthält, nur aus dem Bestand: Rückruf zur Wunschzeit, Anlage des Konfigurators, Domain bis 25 € Jahrespreis, Gestaltung nach Paket,
  Vorschau mit Freigabe (PB:58-64). Dass eine Domain enthalten ist, steht heute nur in den Bedingungen (PAK B5). „Keine Gebühr je
  Anfrage“ ist ein Pauschalen-Argument und gehört an den Preis, nicht nur in die Leiste (PAK-H22). Eine Zeile „im ersten Jahr“
  (447 / 667 / 1.047 € netto, eigene Rechnung, GM 3.1) ist ein Testfall: Transparenz- und Reue-Befunde sprechen dafür, StubHub dagegen.
  B2C: Messen ist kostenlos, bezahlt wird am Ende. Das ist unkritisch, solange der Preis vor dem Aufwand bekannt ist; erfährt jemand ihn
  erst an der Kasse, wirkt er wie eine spät aufgedeckte Gebühr.

#### E12 Risiko senken mit belegten Vertragsfakten und Vorführung, nicht mit erfundenen Garantien

- **Aussage.** Geld-zurück-Garantien erhöhen Kaufabsicht und Zahlungsbereitschaft, auch über eine positive Gefühlsreaktion (Suwelack
  2011, zwei Experimente). Großzügige Rückgaberegeln erhöhen Käufe und, schwächer, Rückgaben (Janakiraman 2016, Metaanalyse, nur über
  Presse). Interaktive Vorführung erzeugt Vorstellungsbilder der eigenen Nutzung und erhöht die Kaufabsicht stärker als dieselbe
  Information passiv (Schlosser 2003, vier Experimente). 58 % (Capterra, USA) bzw. 60 % (Gartner Digital Markets, n = 3.484) der
  befragten Softwarekäufer bereuen mindestens einen Kauf der letzten 12 bis 18 Monate; als häufigste Gründe werden höhere Gesamtkosten als
  erwartet (33 %) und eine langsame Einführung (32 %) genannt.
- **Kennzeichnung.** [Empirisch] (Suwelack, Schlosser A; Janakiraman S); [Branchenpraxis/Meinung] (Capterra, Gartner Digital Markets;
  Quoten A, Gründe S).
- **Quellen.** [L58], [L59], [L60], [L77]; WIS W-18; PAK 7, 10.
- **Gegenbefunde.** Kostenlose Tests können schaden, wenn die frühe Erfahrung enttäuscht (Foubert & Gijsbrechts 2016, Digitalfernsehen)
  [L61]. Für B2B-Dienste mit Einrichtungsaufwand je Kunde fand sich keine Studie. Jahresverträge senken laut Beraterblogs die Abwanderung
  (N).
- **Konsequenz [Hypothese].** B2B: Eine Garantie gibt es nicht und darf nicht erfunden werden. Belegt, aber heute verstreut auf Häufige
  Fragen, Ablauf und Bedingungen (PAK B3): Vertrag erst mit Zahlung der Einrichtung (PB:48), Storno bis Beginn der Einrichtung mit voller
  Erstattung (PB:70), Vorschau-Link und Freigabe vor dem Livegang (PB:60), Monatsbeitrag erst ab Livegang (PB:54), monatlich kündbar
  ohne Mindestlaufzeit (PB:69). Diese Fakten gehören gebündelt an die Pakete, mit der ehrlichen Grenze daneben: nach Beginn der
  Einrichtung keine Erstattung (PB:70). Vorführung: „Konfigurator ausprobieren“ führt heute in die App für Hauseigentümer unter
  eeziframes-Marke (VK:209-210); „unter Ihrer Marke“ ist dort nicht erlebbar (PAK B7). Die vorbereiteten Demo-Instanzen je Paket
  (`functions/pakete-seite.js:165-172`, docs/INSTANZEN.md:310) wären die passende Vorführung, sobald `PAKETE_DEMOS` gesetzt ist.
  B2C: „Messen kostenlos, ohne Konto“ (README.md:3) ist die Risikoumkehr; sie gehört in den ersten Bildschirm.

#### E13 Druck durch Knappheit, Countdown oder Verlustrahmen ist schwach belegt und kollidiert mit Ehrlichkeit

- **Aussage.** Welche Knappheit wirkt, hängt vom Produkt ab; zeitliche Knappheit am ehesten bei hoher Beteiligung (Barton 2022, 416
  Effektgrößen aus 131 Studien). Eine Untersuchung von rund 11.000 Shops fand 1.818 manipulative Muster, darunter 393 Countdown-Timer,
  teils mit Angeboten, die nach Ablauf weiter galten (Mathur 2019). Milde manipulative Gestaltung verdoppelte in einem Experiment die
  Zustimmung zu einem Abo ohne messbare Gegenreaktion (11 % ohne, 26 % mit milder, 42 % mit aggressiver Gestaltung; Zahlen aus
  Vortragsfolien) (Luguri & Strahilevitz 2021). Verlustaversion: mittlerer Koeffizient 1,955 aus 607 Schätzungen (Brown 2024).
- **Kennzeichnung.** [Empirisch] (A; Quoten Luguri & Strahilevitz S); [Branchenpraxis/Meinung] für die rechtliche Einordnung.
- **Quellen.** [L46], [L47], [L48], [L37]; WIS W-15, W-19; PAK 15.
- **Gegenbefunde.** Gal & Rucker (2018) bestreiten, dass Verluste allgemein stärker wirken als Gewinne [L38]. Dass milde Manipulation
  kommerziell wirken kann, steht gegen § 5 und § 5a UWG, die auch Betriebe als „sonstige Marktteilnehmer“ schützen;
  Spitzenstellungsaussagen wie „Bestseller“ muss der Werbende im Zweifel beweisen [L119], [L120]. Rechtliche Einordnung aus Kammer- und
  Kanzleibeiträgen, anwaltlich zu prüfen.
- **Konsequenz [Hypothese].** B2B: Für die Pakete sind weder Fristen noch Kontingente noch Einführungspreise belegt (GM 3.1); also kein
  Knappheitsdruck. Verlustformulierungen („Anfragen, die Ihnen entgehen“) nur mit belegbarem Inhalt; Zahlen dazu gibt es im Repository
  nicht. „Vorläufige Preise“ (VK:174) ist das Gegenteil von Dringlichkeit; ob es die Anfragebereitschaft senkt, ist unbekannt.
  B2C: Der Einführungspreis endet wirklich am 17.11.2026 (`web/config.js:14`). Ein schlichter Hinweis mit Datum ist ehrlich; ein
  laufender Countdown wäre ein typisches Dringlichkeitsmuster und widerspräche „Fein, nicht laut“ (SKILL:48). Nach dem Stichtag
  verschwindet der Hinweis von selbst (`web/assets/gemeinsam.js:327`).

### Vertrauen und B2B-Kauf

#### E14 Vertrauen ohne Kundenstimmen entsteht über Gestaltungsqualität, Offenlegung und prüfbare Fakten

- **Aussage.** In einer Online-Studie mit 2.684 Personen bezogen sich 46,1 % der Kommentare zur Glaubwürdigkeit auf das Aussehen,
  danach auf Informationsstruktur und Informationsfokus (Fogg 2003). NN/g nennt vier Faktoren: Gestaltungsqualität, Offenlegung vorab
  (Preise, Kontakt), umfassende und aktuelle Inhalte, Verbindung zum übrigen Netz. Die Stanford-Leitlinien verlangen zu zeigen, dass
  eine echte Organisation dahintersteht, und Kontakt leicht zu machen. B2B-Nutzer suchen vor allem Preise; Kontaktangaben werden
  erwartet und gehören nicht hinter Formulare (NN/g, Bericht über 293 B2B-Websites). Metaanalyse über 150 Studien: Vertrauen hängt mit
  wahrgenommenem Datenschutz und Servicequalität zusammen (Kim & Peterson 2017).
- **Kennzeichnung.** [Empirisch] (Fogg, Kim & Peterson: A); [Forschungsbasierte Praxis] (NN/g, Stanford: A/S).
- **Quellen.** [L62], [L63], [L64], [L65], [L66]; WIS W-20; PAK 14.
- **Gegenbefunde.** Fogg zählt Kommentare, nicht Personen. Fehlende Bewertungen sind ein Nachteil: In einem Händler-Datensatz hatte ein
  Produkt mit fünf Bewertungen eine 270 % höhere Kaufwahrscheinlichkeit als eines ohne (Spiegel Research Center, Verbraucherhandel,
  S) [L69]. Zu jungen B2B-Angeboten ohne Referenzen fand sich keine Studie.
- **Konsequenz [Hypothese].** B2B: Kundenstimmen, Zähler, Logos, Siegel gibt es nicht und dürfen nicht erfunden werden (SKILL:49;
  GM 7.2, Frage 12). Tragend sind prüfbare Fakten: Demo, Beispiel-Aufmaßblatt (zeigt erfundene Beispielwerte und muss als Beispiel
  erkennbar sein; docs/GESTALTUNG.md:447), Paketbedingungen und AV-Vertrag als PDF vor dem Kauf, Kundenschutz-Zusagen (PB:83-86,
  VK:159), Datenstandort Frankfurt (VK:241), Antwortversprechen „in der Regel innerhalb eines Werktags“
  (`functions/pakete-seite.js:194`, `:196`), Person und Firma mit Ort und Kontakt, Pilotstatus offen benannt. Gestaltungsqualität ist
  selbst Glaubwürdigkeitsfaktor und deckt sich mit der Messlatte des Inhabers (SKILL:38). Widerspruch im Bestand: README.md:21 sagt
  „E-Mail und Telefon folgen“, das Impressum enthält beides bereits (`web/impressum/index.html:32-33`); alle Rechtstexte sind Entwürfe
  (GM 6.3). B2C: Bei Fotos vom eigenen Haus ist Datenschutz ein Vertrauensinhalt; wer die Fotos sieht und wann sie gelöscht werden,
  gehört in den Einstieg (WIS W-20).

#### E15 B2B-Käufer informieren sich selbst und wollen ohne Vertrieb kaufen, bereuen das aber häufiger

- **Aussage.** 61 % (n = 632, Befragung 2024) bzw. 67 % (n = 646, Befragung 2025) der B2B-Käufer bevorzugen einen Kauf ohne
  Vertriebsmitarbeiter; Rat suchen sie für Fragen der Passung zum eigenen Betrieb (Gartner). Bei Käufen per Selbstbedienung berichten
  43 % hohe Kaufreue, bei Käufen mit Vertrieb 26 % (Gartner 2024). Käufer verbringen etwa 17 % ihrer Kaufzeit mit Anbietern (Gartner
  2018). Knapp 70 % des Prozesses liegen vor dem Erstkontakt, 81 % haben beim Erstkontakt einen Favoriten (6sense 2024). Käufer
  streichen Anbieter, die Selbstbedienung nicht unterstützen (TrustRadius 2022, n = 2.185). Rund die Hälfte der B2B-Suchanfragen kam
  vom Telefon (Google/BCG 2017).
- **Kennzeichnung.** [Branchenpraxis/Meinung]: Befragungen von Anbietern und Beratungen, Methode meist nicht offengelegt, nicht
  peer-reviewt; Status A, Gartner 2018 S.
- **Quellen.** [L70], [L71], [L72], [L73], [L74], [L75], [L76], [L78]; WIS W-21; PAK 11, 13.
- **Gegenbefunde.** Vorliebe und Ergebnis laufen auseinander: Selbstbedienung wird bevorzugt, führt aber häufiger zu Reue. Die
  Stichproben sind international und eher größere Unternehmen (Kaufgruppen von 6 bis 11 Personen); für Fensterbaubetriebe gibt es keine
  Daten. Mehr als die Hälfte der Handwerksbetriebe sieht Digitalisierung als große Herausforderung (Bitkom/ZDH 2020, 502 Interviews)
  [L79].
- **Konsequenz [Hypothese].** B2B: Die Seite muss die Entscheidung ohne Gespräch tragen: Preise, Ablauf bis Live, Vertrag, Demo. Das ist
  angelegt; alles Kaufrelevante ist öffentlich (docs/BESTELLUNG.md:61-67). Es fehlt ein leiser zweiter Weg für Passungsfragen bei den
  Paketen: Das Formular folgt erst nach Paketen, Ablauf und Demos (docs/GESTALTUNG.md:447), bei den Paketen gibt es keinen Hinweis auf
  Rückruf oder Frage (PAK B8). Selbstkauf bleibt Hauptweg (Cream-Knopf am empfohlenen Paket), Beratung als Ring-Knopf, damit die Regel
  „eine Cream-Pille je Bildschirm“ hält (SKILL:71). Solange die Bestellung nicht freigeschaltet ist, ist die Anfrage die einzige
  Abschlusshandlung (GM 5.1). Die Vorwahl des Pakets im Formular bleibt (`functions/pakete-seite.js:115`). Ob Fensterbauer am Telefon
  kommen, ist mit der eigenen Statistik für `/fuer-fensterbauer/` zu prüfen.

### Technik, Bedienung und Produkt

#### E16 Ladezeit und Reaktionszeit wirken auf Abbruch und Abschluss

- **Aussage.** Vodafone, A/B-Test mit 50/50-Aufteilung, optisch und funktional gleiche Seiten: LCP 31 % besser, 8 % mehr Verkäufe
  (web.dev 2021). Eine von Google beauftragte Deloitte-Auswertung (37 Marken, rund 30 Mio. Sitzungen, 2020) fand bei 0,1 s schnelleren
  mobilen Seiten 8,4 % mehr Abschlüsse im Handel, korrelativ. Schwellen der Core Web Vitals am 75. Perzentil: LCP ≤ 2,5 s,
  INP ≤ 200 ms, CLS ≤ 0,1. Antwortzeiten: 0,1 s wirkt unmittelbar, 1 s hält den Gedankenfluss, ab etwa 10 s geht die Aufmerksamkeit
  verloren (Nielsen 1993).
- **Kennzeichnung.** [Forschungsbasierte Praxis] (Vodafone, Core Web Vitals, Nielsen: A); [Branchenpraxis/Meinung] (Deloitte, A).
- **Quellen.** [L4], [L86], [L87], [L88]; WIS W-06, W-22.
- **Gegenbefunde.** Alle Zahlen stammen aus dem Handel mit hohem Volumen; für B2B-Software mit wenigen Besuchern keine Daten. Nicht
  verifiziert: „+32 % Absprungwahrscheinlichkeit bei 1 → 3 s“ (Google, Jahr und Methode N) [L85] und „0,6 % Umsatz je 100 ms“ (Bing,
  N) [L89].
- **Konsequenz [Hypothese].** Premium-Effekte (WebGL, Bildfolgen, Staub; SKILL:55-59) kosten Lade- und Rechenzeit. Das Budget der
  Designrichtung (erster Telefon-Bildschirm höchstens 300 KB Bilder, WebGL und Bildfolgen erst bei Annäherung, Schleifen nur im Bild;
  DR:167-168) deckt sich mit der Forschung. INP ist beim eingebetteten Konfigurator Verkaufsbeleg, weil er das Produkt ist (siehe E4).
  B2C: Jede Zehntelsekunde zwischen Tipp und erstem Messbildschirm zählt; Wartezeiten über 1 s brauchen einen sichtbaren Zwischenstand
  (deckt sich mit SKILL:31-32).

#### E17 Wenige Felder, Fehler am Feld, keine doppelte Eingabe

- **Aussage.** Formulare nach 20 Richtlinien wurden schneller ausgefüllt, mit weniger Absendeversuchen und Blickbewegungen und höherer
  Zufriedenheit (Seckler 2014, Eyetracking, N = 65). Prüfung bei der Eingabe statt beim Absenden: +22 % erfolgreiche Abschlüsse, −42 %
  Zeit, −22 % Fehler (Wroblewski 2009, Usability-Test mit 22 Personen). Die Zahl der Felder wirkt stärker als die Zahl der Schritte;
  auch freiwillige Felder erzeugen Reibung (Baymard). Fortschrittsanzeigen senkten Abbrüche im Mittel nicht; langsam beginnende
  erhöhten sie, schnell beginnende senkten sie (Villar 2013, Metaanalyse über 32 Experimente in Online-Umfragen).
- **Kennzeichnung.** [Empirisch] (Seckler, Villar: A); [Forschungsbasierte Praxis] (Wroblewski S, Baymard A).
- **Quellen.** [L90], [L91], [L92], [L96]; WIS W-23; PAK 16.
- **Gegenbefunde.** Bei Villar bezweifelt ein Leser die Kodierung (S); Online-Umfragen, nicht Bestellungen. Wroblewski ist ein kleiner
  Praxistest.
- **Konsequenz [Hypothese].** B2B: Das Anfrageformular hat Name, Firma (freiwillig), E-Mail, Telefon (freiwillig), Paket und Text
  (`functions/pakete-seite.js:177-182`); Fehler erscheinen beim Absenden am Feld (docs/GESTALTUNG.md:455). Sechs Felder sind wenig;
  zwei freiwillige Felder und ein Pflicht-Freitext erhöhen die Hürde. Testvariante: Pflicht nur E-Mail und Paket, Freitext freiwillig,
  Prüfung beim Verlassen des Feldes. Die Bestellung im Kundenkonto verlangt Angaben aus der Anfrage nicht erneut (WCAG 2.2, 3.3.7).
  Das Bestellformular (Paket, E-Mail, Unternehmen, Konfigurator, Gestaltung, Prüfen; `web/assets/partner.js:161-175`) sollte mit
  schnellen Schritten beginnen. B2C: Messen ohne Konto (README.md:3) hält die Formularhürde vor dem Wert niedrig; an der Kasse E-Mail und
  Code ohne Passwort entspricht der Forschung.

#### E18 Am Telefon zählen Daumen, Zielgrößen, sichtbare Alternativen zum Wischen und Kontrast

- **Aussage.** WCAG 2.2: Zielgröße mindestens 24 × 24 CSS-px (2.5.8, AA), empfohlen 44 × 44 (2.5.5, AAA); Ziehbewegungen brauchen eine
  Alternative mit einfachem Zeigen (2.5.7, AA); der Fokus darf nicht vollständig von eigenem Inhalt verdeckt sein, typisch durch klebende
  Kopfzeilen (2.4.11, AA). Kontrast: Text mindestens 4,5:1, großer Text 3:1 (1.4.3); Bedienelemente und bedeutungstragende Grafik 3:1
  (1.4.11). Helle Schrift auf dunklem Grund schnitt bei Sehschärfe und Korrekturlesen schlechter ab, bei Jüngeren wie Älteren
  (Piepenbrock 2013). 49 % hielten das Telefon einhändig, 36 % gestützt, 15 % zweihändig (Hoober 2013, 1.333 Beobachtungen);
  einhändige Daumenziele um 9,2 bis 9,6 mm (Parhi 2006). Inhalte jenseits der ersten Karte eines Karussells werden wenig gesehen (NN/g).
  Textverständnis am Telefon entsprach dem am Schreibtisch, gelesen wurde etwas langsamer (NN/g 2016).
- **Kennzeichnung.** [Forschungsbasierte Praxis · Norm] (WCAG: A, 2.4.11 S); [Empirisch] (Piepenbrock, Parhi: A);
  [Forschungsbasierte Praxis] (Hoober A/S, NN/g zu Karussells A, Zahlen S, NN/g zum Lesen S).
- **Quellen.** [L97], [L98], [L101], [L104], [L105], [L106], [L107], [L109]; WIS W-25, W-27, W-32; PAK 2.
- **Gegenbefunde.** Der Anteil mobiler Seitenaufrufe in Deutschland schwankt je nach Momentaufnahme 2026 zwischen rund 44 und 61 %
  (StatCounter, N) [L108]; der Anteil für `/fuer-fensterbauer/` ist unbekannt.
- **Eigene Kontrastrechnung (WIS W-25 nach `web/assets/gemeinsam.css:10-16`).** Schrift, Nebentext, Label und Grün erfüllen 4,5:1;
  Label #93928d auf #262626 knapp mit 4,85:1. Linien #2b2b2b und #3a3a3a erreichen 1,16 bis 1,59:1.
- **Konsequenz [Hypothese].** Das Telefon ist Hauptansicht (SKILL:28; Vorgabe, keine Messung). Ziele ab 44 px (SKILL:71) erfüllen 2.5.8
  und 2.5.5. Die Paketreihe wird gewischt, eine Namensleiste erlaubt Antippen (docs/GESTALTUNG.md:452); 2.5.7 ist damit voraussichtlich
  erfüllt. Wegen des Karussell-Befunds sollen alle drei Preise ohne Wischen sichtbar sein, etwa in der vorhandenen Namensleiste
  (PAK-H3). Prüfpunkte: Formularfelder mit Ring #3a3a3a auf #161616 (rund 1,6:1, `web/assets/verkauf.css:131`) verfehlen 1.4.11, wenn
  der Ring das einzige Merkmal des Feldes ist; Glas-Meldungen über dem Foto (60 % Deckkraft, docs/GESTALTUNG.md:450) am ungünstigsten
  Bildausschnitt messen; die klebende Kopfzeile darf ein fokussiertes Feld nicht verdecken (2.4.11). Die dunkle Bühne bleibt
  verbindlich (docs/GESTALTUNG.md, Abschnitt „Farbe“); die Forschung spricht für kurze Texte und 17 px Lesetext, was ohnehin Vorgabe ist
  (SKILL:29, :69).

#### E19 Selbst Gestaltetes ist mehr wert; Startlösungen, Reihenfolge und Voreinstellungen steuern, was angefragt wird

- **Aussage.** Die Zahlungsbereitschaft für selbst gestaltete Uhren lag weit über der für gleichwertige Standarduhren (Franke & Piller
  2004, vier Studien, 717 Teilnehmende). Der Effekt bleibt nach Abzug von Passgenauigkeit und Aufwand bestehen und läuft über das
  Gefühl, etwas geschafft zu haben (Franke, Schreier & Kaiser 2010, fünf Studien). Startlösungen senkten in neun Studien die empfundene
  Komplexität, erhöhten die Zufriedenheit und führten zu reicher ausgestatteten Produkten (Hildebrand 2014). In Feldexperimenten mit
  Maßanzügen und Autos veränderte die Reihenfolge der Merkmale, was gekauft wurde, vor allem über die Annahme von Voreinstellungen
  (Levav 2010). Konfiguration Merkmal für Merkmal führte zu weniger empfundener Schwierigkeit und höherer Zufriedenheit als die Wahl
  ganzer Alternativen (Valenzuela, Dhar & Zettelmeyer 2009). Komplexität senkt den erreichten Nutzen; Experten empfinden weniger
  Komplexität (Dellaert & Stremersch 2005).
- **Kennzeichnung.** [Empirisch], Status A.
- **Quellen.** [L110], [L111], [L112], [L113], [L114], [L115]; WIS W-28 bis W-30.
- **Gegenbefunde.** Untersucht an Uhren, T-Shirts, Anzügen, Autos und PCs, nicht an Fenstern, die technisch und durch Bauvorschriften
  begrenzt sind; gemessen wurde Kauf, nicht Anfrage. Für interne Konfiguratoren wurden Angebotsdurchlaufzeiten im Mittel geschätzt um
  85,5 % kürzer, aber nur sechs Fälle lieferten tatsächliche Werte, und die Literatur ist erfolgsorientiert (Haug 2011, S) [L116].
  Voreinstellungen müssen zum Kunden passen; Fehlzuordnungen sind Kosten (Johnson & Goldstein 2003, S) [L39].
- **Konsequenz [Hypothese].** B2B: Die Forschung stützt eher die Aussage „Anfragen von Kunden, die ihr Fenster schon vor Augen haben“
  als „Kunden messen selbst“, das laut Inhaber nicht Hauptaussage ist (SKILL:24-25); ob daraus mehr Aufträge beim Betrieb folgen, ist
  nicht untersucht. „Gestaltung übernehmen“ (README.md:3) ist eine Startlösung im Sinne von Hildebrand. Voreinstellungen durch den
  Betrieb wären nach Levav ein starkes Argument; „Sortiment und Vorbelegung je Instanz“ ist aber nicht gebaut (Rang 1 der Ausbauliste,
  `docs/instanzen/BAUPLAN.md:717`; GM 2.2) und darf nicht als Leistung erscheinen. „Schneller zum Angebot“ ohne eigene Daten der
  Betriebe keine Zahl nennen; die Zentrale misst keine Zeit bis zum Angebot (WIS W-31). B2C: Das 3-D-Modell des eigenen Fensters
  erzeugt Urheberschaft und gehört früh in den Einstieg; der Einstieg über ein vorbereitetes Fenster statt leerer Auswahl ist eine
  Testvariante.

---

## 3.3 Wettbewerb und vergleichbare Geschäftsmodelle

### 3.3.1 Grundlage

Zwölf Websites in vier Gruppen, ausgewertet aus Suchauszügen vom 24.10.2026 (WET 2, 3). „Gesehen“ heißt: im Suchauszug belegt.
„Nicht gesehen“ heißt nicht „nicht vorhanden“. Aussagen über Aussehen, Bildsprache, Bewegung und Aufbau der Seiten sind nicht möglich.
Alle Preise, Bewertungen und Nutzerzahlen sind Eigenangaben der Anbieter. Kennzeichnung aller Beobachtungen: [Branchenpraxis/Meinung].

| Gruppe | Websites | Kern |
|---|---|---|
| 1 Konfiguratoren für Betriebe | Fenzon [M1], 123fenster [M2], Combeenation [M3], Clean Invoice [M4] | Konfigurator als Abo oder Projekt; Clean Invoice als kostenloses Werkzeug |
| 2 Handwerkssoftware | HERO [M5], plancraft [M6], Craftnote [M7] | drei Tarife mit öffentlichen Preisen, Test ohne Zahlungsmittel |
| 3 Endkunden und Aufmaß | fensterversand.com [M8], fensterblick.de [M9], magicplan [M10] | Konfigurator mit Preis, Aufmaß als PDF, Aufmaß-App |
| 4 SaaS-Maßstab | Linear [M11], Shopify [M12] | ruhige Preisseiten, Handlungsaufforderung je Stufe, Kosten offen |

Gefunden, nicht ausgewertet: A+W iQuote [M13], STOLMA [M14], FENSTERART [M15].

### 3.3.2 Wiederkehrende Muster

| Muster | Gesehen bei | Konsequenz für eeziframes [Hypothese] |
|---|---|---|
| **Zwei Lager bei Preisen.** Handwerkssoftware und SaaS zeigen Preise offen in drei bis vier Stufen; Konfigurator-Anbieter für Betriebe nur „Preise anfragen“. Combeenation dazwischen: „ab 697 €/Monat“, Beispiele 697 / 1.600 / 2.400 €, Implementierung etwa 10.000 € für einen einfachen, meist 30.000 bis 60.000 €, mit erklärten Kostentreibern. | M5, M6, M7, M11, M12; M1, M2; M3 | Offene Festpreise sind unter Konfiguratoren für Betriebe ungewöhnlich (WET-H1). Die Größenordnung bei Combeenation zeigt, wo individuelle Konfiguratoren preislich liegen. |
| **Einstieg ohne Zahlungsmittel.** Test 7, 14 oder 30 Tage (plancraft, HERO, Craftnote), Gratisstufe (magicplan, Linear), symbolischer Einstiegspreis (Shopify); daneben ein kurzer begleiteter Termin von 15 bis 30 Minuten (HERO, plancraft). | M5, M6, M7, M10, M11, M12 | eeziframes hat keine Testphase; Vorschau mit Freigabe, Abo erst ab Live und Storno bis zur Einrichtung können diese Rolle übernehmen, wenn sie früh stehen (WET-H7; E12). |
| **Handlungsaufforderung nach Stufe.** Untere Tarife „Get started“, obere „Contact sales“. | M11 | Selbstkauf als Hauptweg, Gespräch als gleichwertige Alternative für das obere Paket; der Rückruf ist im Ablauf ohnehin vorgesehen (docs/BESTELLUNG.md:25). Test, weil die Regel „eine Cream-Pille je Bildschirm“ gilt. |
| **Rabatt für Bindung.** Jahres- oder Zweijahreszahlung günstiger; magicplan unterscheidet nur nach Bindungsdauer. | M5, M6, M7, M10, M12 | eeziframes bietet nur monatlich an (docs/BESTELLUNG.md:38-39); ein Jahresmodell ist Inhaberentscheidung (PAK F10) und wird nicht angekündigt, bevor es beschlossen ist. |
| **Vertrauen über Zahlen und Dritte.** Bewertungen mit Anzahl, Testsiegel, Nutzerzahlen, Zitate mit Gewerk, Fallstudien mit Kennzahlen. Mehrfach widersprechen sich Zahlen zwischen Seiten desselben Anbieters (plancraft 709 / 600 / 608 Rezensionen; fensterversand.com 13.200 / 13.500 / 5.205; Craftnote „monatlich kündbar“ gegenüber Jahresverlängerung). | M3, M5, M6, M7, M8, M11 | Nicht übertragbar, solange es keine Kunden gibt (SKILL:49). Lehre: jede Zahl aus genau einer Quelle. |
| **Vergleich mit dem bisherigen Arbeitsweg.** plancraft vergleicht sich mit „Excel/Word“, HERO mit benannten Wettbewerbern. | M6; M5 | Der Gegner von eeziframes ist das Kontaktformular mit Freitext und der Termin vor Ort, nicht ein anderer Anbieter. |
| **Zahl der Schritte vorab.** „In nur 5 Schritten“ mit laufendem Preis. | M9 | Prinzip übertragbar auf Ablauf bis Live (sechs Schritte, docs/BESTELLUNG.md:19) und auf den Konfigurator; ohne Preis im Konfigurator. |
| **Aufmaß als Dokument.** PDF-Aufmaßblatt, Formeln, Videos zum Ausdrucken und Anwenden; eine geführte Aufmaß-App mit Fotos war nicht zu sehen. | M8 | Geführtes Aufmaß statt Papierprozess ist ein Unterschied (WET-H6); der Nutzen für den Betrieb (weniger Rückfragen) ist nicht gemessen. |
| **Konfiguratoren für Betriebe sind Shop- und Kalkulationssysteme** mit hinterlegten Produkten, Preislisten, Margen und Einrichtung als Dienstleistung. | M1, M2, M3, M13 | eeziframes liefert ohne Preislisten eine geklärte Anfrage (WET-H2). |
| **Der Praxisfall schlägt die Funktionsliste.** Erfolgsgeschichte (Fenzon), Fallstudien mit Kennzahlen (Combeenation); ohne Fall bleibt es bei Behauptungen (123fenster). | M1, M3; M2 | Prinzip übertragbar, sobald es echte Betriebe gibt; vorher nicht. |

### 3.3.3 Lücken, die eeziframes besetzen könnte

Alle Punkte sind [Hypothese] auf Grundlage von Suchauszügen.

| Nr. | Lücke | Beleg im Repository | Grundlage in der Recherche | Einschränkung |
|---|---|---|---|---|
| WET-H1 | Festpreis statt Preisanfrage | `web/assets/pakete.js:44`, `:52`, `:60` | 123fenster und Fenzon nur auf Anfrage; Combeenation ab 697 € im Monat plus Umsetzung | Preise vorläufig (`web/assets/pakete.js:17`) |
| WET-H2 | Anfrage statt Shop: keine Preislisten nötig, Kalkulation bleibt beim Betrieb | README.md:3; VK:209 | Fenzon, 123fenster, Combeenation setzen Preislisten oder Regelwerke voraus | Clean Invoice verspricht dasselbe kostenlos (3.3.5) |
| WET-H3 | Fertig in Tagen statt Monaten: sechs sichtbare Schritte, meist 3 bis 5 Werktage, mit Vorschau und Freigabe | docs/BESTELLUNG.md:19-30 | Combeenation 4 Wochen bis 6 Monate | ob „meist 3 bis 5 Werktage“ gemessen oder Ziel ist, ist offen; der Inhaber richtet jede Instanz selbst ein (GM 7.2, Frage 11) |
| WET-H4 | Die Kunden bleiben beim Betrieb | VK:159-166; PB:83-86 | Clean Invoice wirbt bei Endkunden mit „Angebote vergleichen“ und schickt dieselbe Anfrage an mehrere Firmen | Spannung im eigenen Angebot: eeziframes.com verkauft Hauseigentümern ein Aufmaßblatt, das sie „an beliebig viele Betriebe“ schicken (`web/index.html:95`; docs/ABRECHNUNG.md:84). Die Zusage gilt für die Instanz, nicht für den B2C-Weg; die Verkaufsseite muss beides auseinanderhalten (Frage 3.5.5/10) |
| WET-H5 | Das Produkt selbst als Vorführung | VK:209-210 | außer dem Endkunden-Shop von Fenzon keine frei zugängliche Demo gesehen | die heutige Vorführung zeigt nicht das Verkaufte (PAK B7) |
| WET-H6 | Geführtes Aufmaß statt Aufmaßblatt zum Ausdrucken | README.md:3; docs/KI.md | fensterversand.com: PDF, Formeln, Video | Nutzen für den Betrieb nicht gemessen |
| WET-H7 | Risiko ohne Testphase senken | PB:48, :54, :60, :69, :70 | Teststandard der Handwerkssoftware | Testphase ja oder nein ist Inhaberentscheidung |
| WET-H8 | Gleicher Kern, Pakete nur nach Marke | `web/assets/pakete.js:75`; VK:236 | magicplan: „all features are included, no matter the plan“ | Verständlichkeit bei Fensterbauern ungetestet |

Nicht belegt ist, ob ein anderer Anbieter den Konfigurator unter der Domain des Betriebs betreibt. „Eigene Domain“ darf erst nach einer
Prüfung als Alleinstellung auf die Seite (WET 9, Frage 2).

### 3.3.4 Was wir nicht übernehmen

| Muster | Gesehen bei | Warum nicht |
|---|---|---|
| Bewertungen, Testsiegel, Nutzerzahlen, Kundenzitate ohne echte Grundlage | M5, M6, M7, M8, M11 | Pilotphase (README.md:5); keine erfundenen Belege (SKILL:49). Wo es später Zahlen gibt: eine Quelle je Zahl. |
| „Preise anfragen“ | M1, M2 | widerspricht „Pakete sichtbar machen“ (SKILL:50) und verschenkt WET-H1 |
| Durchgestrichene Preise, „statt … nun …“ | M7 | wirkt nach Ausverkauf, passt nicht zu „fein, nicht laut“ (SKILL:48); der B2C-Einführungspreis zeigt bewusst keinen „statt“-Preis (docs/ABRECHNUNG.md:11) |
| Laufzeit, die auf zwei Seiten verschieden steht | M7 | Vertrauensbruch an der heikelsten Stelle; Laufzeit und Kündigung nur aus den Paketbedingungen ableiten. Im eigenen Bestand gibt es bereits Abweichungen im Wortlaut (3.4.4) |
| Live-Preis im Konfigurator | M8, M9 | der Konfigurator unter der Domain des Betriebs zeigt bewusst keine Preise (VK:209) |
| Preis je Nutzer, Zusatzlizenzen, Gebühr je Projekt | M5, M6, M7, M10 | Festpreis je Betrieb mit „0 € Gebühr je Anfrage“ (VK:70) ist einfacher; nicht verwässern |
| Lockpreis-Testphasen („$1 für 3 Monate“) | M12 | jede Instanz wird von Hand eingerichtet (docs/BESTELLUNG.md:25-28) |
| Viele fast gleiche Seiten für Suchmaschinen | M9 | Verkaufsflächen sollen nicht wie Ratgeber wirken (SKILL:29-30); Ratgeber stehen getrennt unter `/ratgeber/` (README.md:15) |
| Vergleichsseiten gegen benannte Wettbewerber | M5 | für einen jungen Anbieter ohne Belege angreifbar; der Vergleich mit dem bisherigen Arbeitsweg trägt dasselbe Argument |
| KI als Versprechen ohne sichtbaren Beleg | M2 | KI nur dort nennen, wo sie im Produkt zu sehen ist (Auswertung der Fotos, docs/KI.md) |
| Funktionsliste statt Nutzen für den Betrieb | M2 | Bild statt Text, kurze Abschnitte (SKILL:29) |

### 3.3.5 Clean Invoice als nächster Vergleich

Inhaltlich am nächsten an eeziframes: Endkunden konfigurieren ohne Anmeldung über eine Skizze; die Anfrage geht als PDF, Link oder
E-Mail-Entwurf an Fensterfirmen; für Betriebe gibt es laut einem einzigen Suchauszug ein Widget zum Einbinden, „kostenlos, ohne
Anmeldung, ohne Provision“, das „bewusst keine Preise“ zeigt [M4]. Das sind dieselben Versprechen wie bei eeziframes (VK:209), hier
kostenlos und als Weg zur Rechnungssoftware des Anbieters. Unbekannt sind eigene Domain, eigene Marke, Fotos, 3-D-Modell und Auswertung.
Diese Seite sollte vor Phase D als erste im Browser gesichtet werden; die Positionierung gegen ein kostenloses Angebot ist eine offene
Frage (3.5.5).

---

## 3.4 Paketdarstellung und Kaufentscheidung – Konsequenzen

### 3.4.1 Ausgangslage im Bestand

| Gegenstand | Stand | Beleg |
|---|---|---|
| Pakete und Reihenfolge | EEZI Essential, EEZI Essential Plus, EEZI Signature, aufsteigend | `web/assets/pakete.js:18`, `:42-67` |
| Preise | 29 € / 99 €, 39 € / 199 €, 64 € / 279 € (Monat / Einrichtung), netto, vorläufig, Preisstand 2026-10-22 | `web/assets/pakete.js:15-17`, `:44`, `:52`, `:60` |
| Erstes Vertragsjahr (eigene Rechnung, keine Prognose) | 447 €, 667 €, 1.047 € netto | GM 3.1 |
| Unterschied der Pakete | „wie sehr der Konfigurator Ihre Marke trägt“, Signature zusätzlich mit Dashboard und Einladungslinks; der volle Konfigurator ist in allen drei Paketen gleich | VK:236; `web/assets/pakete.js:75` |
| Empfehlung | das mittlere Paket per Konstante, Pille „Empfohlen“, einziger Cream-Knopf | `functions/pakete-seite.js:32-33`, `:112-118`; docs/GESTALTUNG.md:452, :456 |
| Telefon | Wischreihe beginnt beim empfohlenen Paket, darunter eine Leiste mit den drei Kurznamen | `functions/pakete-seite.js:128-130`; docs/GESTALTUNG.md:452 |
| Paketkarte | Name, Satz, Monatspreis groß, Einrichtung, Steuerzeile, Leistungsliste, Knopf, Beispielseite (Bilder fehlen, bis dahin Skizzen) | `functions/pakete-seite.js:92-127` |
| Vergleich | eingeklappt, 2 Preiszeilen und 15 Merkmalszeilen, davon 3 gleich | `functions/pakete-seite.js:133-140`; `web/assets/pakete.js:71-99` |
| Vertrag | mit Eingang der Einrichtungsgebühr; Abo ab Livegang; unbestimmte Zeit, kündbar zum Ende des laufenden Abrechnungsmonats, ohne Mindestlaufzeit | PB:48, :54, :69 |
| Storno, Freigabe | Storno bis Beginn der Einrichtung mit voller Erstattung, danach keine; Live erst mit Freigabe „oder nach Absprache“ | PB:60, :70 |
| Paketwechsel | nach oben gegen Differenz der Einrichtung, neuer Monatspreis ab Wechsel; nach unten ab nächstem Abrechnungsmonat | PB:71 |
| Preisänderung | mindestens sechs Wochen Ankündigung, Sonderkündigungsrecht | PB:55 |
| Domain | bis 25 € Jahrespreis enthalten; Übertragung nach Vertragsende gegen eine Pauschale (Betrag offen) | PB:64-65 |
| Steuer | „netto zzgl. MwSt. · nur für Unternehmer“; Ausweis hängt an der Variable `MWST`, die nicht gesetzt ist | `functions/pakete-seite.js:122`, `:139`; `web/assets/pakete.js:141-146`; GM 6.3 |
| Verkaufsstand | ohne `PAKETE_OFFEN` „Bestellung bald möglich“ und Anfrageformular; Demos erst mit `PAKETE_DEMOS` | docs/BESTELLUNG.md:48-57; `functions/pakete-seite.js:165-172`, `:190-197` |

### 3.4.2 Beobachtungen am Bestand (neutral, kritisch)

Übernommen aus PAK 1.2:

- **B1 Empfehlung ohne Grund.** Die Empfehlung folgt der Position, nicht einem Bedarf; die Karte nennt keinen Grund.
- **B2 Gleiches vor Unterschiedlichem.** Jede Leistungsliste beginnt mit denselben drei Punkten (Domain, voller Konfigurator, Anfrage als
  PDF); die Unterschiede folgen danach (`functions/pakete-seite.js:65-81`).
- **B3 Risikomindernde Fakten verstreut.** Kündbarkeit steht in Häufigen Fragen und Bedingungen, Storno und Freigabe im Ablauf und in den
  Bedingungen; auf den Karten fehlen sie.
- **B4 Vergleich lang und ungegliedert.** 17 Zeilen ohne Gruppen, drei Zeilen „ja, ja, ja“; die Zahl 0 erscheint als „nein“
  (`functions/pakete-seite.js:51`).
- **B5 Einrichtung sichtbar, aber nachrangig.** Kleiner als der Monatspreis und ohne Satz, was sie enthält.
- **B6 Widerspruch beim Preisversprechen** (3.4.4).
- **B7 Die Vorführung zeigt nicht das Verkaufte.** „Konfigurator ausprobieren“ führt in die Hauseigentümer-App unter eeziframes-Marke;
  die Seite sagt das offen (VK:209).
- **B8 Beratungsweg spät.** Das Formular steht erst nach Paketen, Ablauf und Demos; bei den Paketen kein Hinweis auf Rückruf oder Frage.

### 3.4.3 Konsequenzen

Einordnung: **R** = Regel (3.5.1), **T** = Test (3.5.2), **F** = Inhaberentscheidung oder Rechtsfrage (3.5.5), **B** = Bestand beibehalten.

| Thema | Konsequenz [Hypothese] | Stützt sich auf | Gegenbefund, Risiko | Einordnung |
|---|---|---|---|---|
| Anzahl | Drei Pakete bleiben; keine vierte Stufe „auf Anfrage“ (PAK-H1). Wichtiger als die Zahl der Pakete ist die Zahl der Merkmale, die gleichzeitig abgewogen werden. | E8; Zählungen: Median 3,5 Pläne bei 50 Anbietern [L82], „gut, besser, am besten“ als Standardaufbau [L84] | Scheibehenne: im Mittel kein Effekt der Auswahlgröße | B |
| Reihenfolge | Schreibtisch aufsteigend; Telefon Start beim empfohlenen Paket, alle drei Preise ohne Wischen sichtbar (PAK-H2, PAK-H3) | E10, E18 | Platz am Telefon; absteigend lenkte im Experiment nach oben [L36] | R9; absteigend T6 |
| Empfehlung | „Empfohlen“ mit einzeiligem sachlichem Grund aus den Merkmalen; „Beliebt“ erst mit gezählten Bestellungen und Zeitraum (PAK-H4, PAK-H36) | E9 | Empfehlungsschilder können die Wahl erschweren [L44] (N) | R7; Wortlaut T4 |
| Welches Paket | Plus (Mitte, Kompromiss) oder Signature („zum höheren Paket hinführen“) (PAK-H5) | E9, SKILL:50 | Bei Signature entfällt der Mitte-Effekt | F1 |
| Hervorhebung | eine Karte, ein Signal (Rand, Pille, einzige Cream-Pille), keine zusätzlichen Effekte (PAK-H6) | E2, E3; SKILL:68-71 | – | B |
| Lockvogel | kein künstliches Paket (PAK-H7) | E10; SKILL:49 | Huber 2014 hält den Effekt für robust | R7 |
| Schritt zum Nachbarpaket | Differenz zeigen („+10 € im Monat: Logo, Firmenfarbe, Fotos, eigene Startseite, Suchmaschinen“) (PAK-H9) | keine Studie | unbelegt | T5 |
| Vergleich | Gemeinsames einmal als Satz („In allen Paketen: Domain, voller Konfigurator, Anfrage als PDF“); Unterschiede in Gruppen (Ihre Marke; Gefunden werden; Team und Einladungen; Daten); auf der Verkaufsfläche nur Unterschiede, die volle Tabelle bleibt in den Bedingungen; „nicht enthalten“ statt „nein“ bei Zahlen (PAK-H10, -H11, -H13) | E8; NN/g zu Vergleichstabellen [L68] (Video A, Einzelregeln N) | keine Studie zur Gruppierung | T7 |
| Vergleich am Telefon | kein Querscrollen; je Gruppe mit Umschalter der drei Pakete oder fixiertem Kopf aus drei Kurznamen (PAK-H12) | SKILL:71; E18 | – | R9 (kein Querscrollen); Form T7 |
| Einrichtung | neben dem Monatspreis gut lesbar, mit einem Satz Inhalt nur aus PB:58-64 (PAK-H14) | E11; [L54], [L67]; § 5a UWG [L119] | Preisaufteilung hebt Nachfrage, wenn der Zuschlag klein wirkt [L51] | R1 |
| Erstes Jahr | Zeile „im ersten Jahr“ im Vergleich (PAK-H15) | [L54], [L77] | StubHub: frühe Gebührenanzeige senkte Käufe [L53] | T8 |
| Zusatzkosten | Domain über 25 €, Übertragungspauschale nach Vertragsende in den Häufigen Fragen, sobald beziffert (PAK-H16) | § 5a UWG [L119] | – | F (PAK F6) |
| Laufzeit, Kündigung | „Monatlich kündbar, ohne Mindestlaufzeit“ direkt bei den Paketen; daneben ehrlich: keine Erstattung nach Beginn der Einrichtung, was nach Kündigung mit Domain und Daten geschieht, Link zu den Bedingungen; einheitlicher Wortlaut (PAK-H17 bis -H19) | E12; [L77] | Beraterblogs: Jahresverträge senken Abwanderung (N). Die Verbraucherregeln zu Laufzeit und Kündigungsknopf betreffen Verbraucherverträge [L121]; die Abgrenzung für B2B ist nicht belegt | R8; Wortlaut F |
| Monatlich oder jährlich | zum Start nur monatlich; Monatspreis Hauptzahl; „keine Gebühr je Anfrage“ nah am Preis (PAK-H20 bis -H22) | [L56], [L57]; Zählung: eine von fünf der 270 untersuchten SaaS-Firmen bietet beides an [L83] | Reue wegen unerwarteter Gesamtkosten [L77] | B; Jahresmodell F |
| Netto oder brutto | netto als Hauptangabe mit Steuersatz, sobald geklärt; Bruttobeträge in der Bestellübersicht vor der Zahlung (PAK-H23) | PAngV erfasst Preisangaben gegenüber Verbrauchern [L118] | BGH I ZR 99/08: wer in an die Allgemeinheit gerichteter Werbung Preise nennt, muss Endpreise angeben, auch wenn er nur an Unternehmer verkaufen will; die Verkaufsseite ist in die Startseite eingebettet, deren andere Ansicht Hauseigentümer anspricht (SKILL:63-64) [L117] | F (anwaltlich) |
| Risikoumkehr | belegte Fakten als ein kurzer Block bei den Paketen, keine neue Garantie; kein Gratis-Test der eigenen Instanz; Erstattung bei Nichtfreigabe der Vorschau klären (PAK-H24 bis -H26) | E12 | Foubert: schwache Testerlebnisse schaden [L61] | R8; Erstattung F |
| Selbstkauf und Beratung | Selbstkauf als Hauptweg (Cream am empfohlenen Paket); direkt unter den Paketen ein leiser zweiter Weg für Passungsfragen als Ring-Knopf zum vorhandenen Formular (PAK-H27, -H28) | E15 | mehr Reue bei Selbstbedienung | T9 |
| Vorführung | je Paket ein Weg in seine Demo-Instanz, sobald freigeschaltet; bis dahin der offene Hinweis, dass „Konfigurator ausprobieren“ die Hauseigentümer-Fassung zeigt; Beispielbilder je Paket beim Inhaber anfragen (PAK-H29, -H30; SKILL:93-99) | E12; Navattic: dreimal höhere Umwandlung von Demo-Besuchern, Herstellerdaten [L80] | Auswahleffekt; Anbieter mit Verkaufsinteresse | T11; R14 |
| Mitentscheider | weiterreichbare Kurzfassung (Preis, Einrichtung, Kündbarkeit, Link zu den Bedingungen) für Büro, Partner, Steuerberater; Vorwahl des Pakets im Formular bleibt (PAK-H31, -H32) | E15; [L75], [L76] | Größe der Kaufgruppe bei Fensterbauern unbekannt (PAK F9) | T12; Vorwahl B |
| Nach der Wahl | sofortige Bestätigung mit Zahlen (heute fällig, ab Livegang monatlich, monatlich kündbar) und nächstem Schritt in den Worten der Statusleiste; Danke-Seite nennt, wer sich wann meldet und was der Betrieb vorbereiten kann (Logo, Fotos, Wunsch-Domain, Empfänger der Anfragen); Bestellformular beginnt mit schnellen Schritten (PAK-H38 bis -H40) | E17; sichtbar gemachte Arbeit des Anbieters erhöht den wahrgenommenen Wert [L55] (S); Capterra 2026: 89 % der Bereuenden erlebten zuerst eine Störung bei der Einführung [L77] (S) | Fortschrittsanzeigen wirken im Mittel nicht [L96] | T13 |

### 3.4.4 Widersprüche im Bestand, die vor jedem Paket-Text zu klären sind

| Nr. | Widerspruch | Belege |
|---|---|---|
| 1 | Preisbindung: „es gilt der Preis, den Sie beim Bestellen sehen, und er bleibt für Ihren Vertrag fest“ gegenüber Preisänderungen mit sechs Wochen Ankündigung | `functions/pakete-seite.js:89`, VK:174; PB:55 (PAK F3) |
| 2 | Kündigung und Wechsel nach unten: „zum Monatsende“ gegenüber „zum Ende des laufenden Abrechnungsmonats“; der Abrechnungsmonat beginnt mit dem Livegang | VK:243; PB:69, :71 (PAK F4) |
| 3 | Paketwechsel nach oben: Differenz der Einrichtung „Fällig wird“ gegenüber „auf Wunsch“ | PB:71; docs/BESTELLUNG.md:41 (PAK F13) |
| 4 | Umsatzsteuer: „zuzüglich der gesetzlichen Umsatzsteuer“ gegenüber Kleinunternehmerregelung; `MWST` nicht gesetzt | PB:52; VK:185; `web/nutzungsbedingungen/index.html:48`; `functions/api/recht.js:58` (GM 7.4, Frage 17; PAK F7) |
| 5 | „5 Minuten je Fenster, etwa“ in der Kennzahlenleiste ohne Messung im Repository | VK:70; docs/GESTALTUNG.md:451 (PAK F12) |
| 6 | Zwei Produkte heißen „Plus“: Altbestand-Tarif (79 € bzw. 119 €) und EEZI Essential Plus (39 €) | GM 3.5; `web/assets/pakete.js:52` (PAK F14) |
| 7 | „E-Mail und Telefon folgen“ gegenüber vollständigen Kontaktangaben im Impressum | README.md:21; `web/impressum/index.html:32-33` (GM 6.3) |

---

## 3.5 Gestaltungsregeln, die aus der Recherche folgen, und Hypothesen, die getestet werden sollten

Die Vorgaben des Inhabers (SKILL, DR, docs/GESTALTUNG.md) gelten. Die Regeln in 3.5.1 sind so begründet, dass sie ohne eigenen Test
gelten sollen; jede nennt, woraus ihre Verbindlichkeit folgt. Die Hypothesen in 3.5.2 sind getrennt davon und werden erst nach Prüfung
zu Regeln.

### 3.5.1 Regeln, die aus der Recherche folgen

| Nr. | Regel | Begründung | Verbindlich durch |
|---|---|---|---|
| R1 | **Preise offen und vollständig.** Monatspreis, Einrichtung mit einem Satz zu ihrem Inhalt und Steuerhinweis stehen zusammen an jedem Paket. Keine Kosten, die erst in der Bestellung erscheinen; kein „Preise anfragen“. | E11 (Santana [L50], Mohan [L54], NN/g [L66], [L67]); WET-H1 | Inhaber (SKILL:50); § 5a UWG [L119]; konvergente Evidenz |
| R2 | **Dauerbewegung endet oder lässt sich anhalten.** Was automatisch startet, länger als 5 s läuft und neben anderem Inhalt steht (Meldungsstapel, Laufleisten, Lottie-Schleifen), endet nach höchstens 5 s oder hat ein sichtbares Bedienelement zum Anhalten, das „fein, nicht laut“ bleibt. | E7 | WCAG 2.2.2, Stufe A [L100] |
| R3 | **Ruhige Fassung vollständig.** Jede Bewegung hat eine Fassung für „weniger Bewegung“ mit dem Endbild; scrollgebundene Bewegung und Parallaxe schalten dort vollständig ab; ohne JavaScript bleibt alles lesbar und bedienbar. | E6, E7 | Inhaber (SKILL:62; DR „Ruhige Fassung“); WCAG 2.3.3 [L99] |
| R4 | **Bewegung mit Bezug.** Bewegung zeigt einen Gegenstand oder Ablauf (Flügel, Raffstore, Maßlinie, Messschritt) oder antwortet auf den Besucher. Keine gleichförmigen Schleifen ohne Reaktion; höchstens ein Drittel der Elemente gleichzeitig in Bewegung. | E5, E6 (Höffler & Leutner [L17], Abrams & Christ [L13]) | Inhaber (SKILL:45-46; DR: „Schleifen nur mit Reaktion“, Ein-Drittel-Regel); Evidenz |
| R5 | **Entscheidendes nicht nur im Band.** Zahlen und Zusagen aus den Leisten (Werktage bis Live, keine Gebühr je Anfrage) und der B2C-Einführungspreis stehen zusätzlich statisch an der Stelle der Entscheidung. Die Leisten bleiben, wie der Inhaber sie wünscht (SKILL:121). | E5 (Burke [L14], NN/g [L16]) | Evidenz; ändert keine Vorgabe |
| R6 | **Ein Held je Bildschirm.** Eine Cream-Pille, ein grünes Wort je Überschrift; Logo, Preise und Kontakt an erwartbaren Orten; Details am Hauptobjekt statt zusätzlicher Blickziele. | E2, E3 | Inhaber (SKILL:12-14, :68-71); Evidenz [L6], [L9], [L10] |
| R7 | **Ehrlich.** Keine erfundenen Belege, Zähler, Logos, Siegel, Bewertungen; „Empfohlen“ statt „Beliebt“, bis gezählte Bestellungen vorliegen; kein Lockvogelpaket; keine Fristen, Kontingente oder Countdowns ohne realen Grund; Beispiele als Beispiel gekennzeichnet; jede Zahl mit Beleg und aus einer Quelle. | E9, E10, E13, E14; WET 3.3.4 | Inhaber (SKILL:48-49); §§ 5, 5a UWG [L119], [L120] |
| R8 | **Belegte Risikofakten bei den Paketen.** Vertrag erst mit Zahlung, Storno bis Beginn der Einrichtung, Vorschau und Freigabe vor Live, Abo ab Live, monatlich kündbar ohne Mindestlaufzeit; daneben die ehrliche Grenze (keine Erstattung nach Beginn der Einrichtung) und der Link zu den Bedingungen. Nichts darüber hinaus. | E12, E15; PAK B3 | Offenlegung vorab [L64]; Inhaber (SKILL:49) |
| R9 | **Alle drei Preise am Telefon ohne Wischen sichtbar.** Die Wischreihe hat eine Tipp-Alternative; kein Querscrollen, auch nicht im Vergleich. | E10, E18 (NN/g zu Karussells [L109]) | Inhaber (SKILL:71, :121-122); WCAG 2.5.7 [L97] |
| R10 | **Barrierefreiheit als Schwelle.** Text 4,5:1 (groß 3:1); Feldumrisse, Fokus und bedeutungstragende Grafik 3:1; Ziele ab 44 px; Fokus nie vollständig unter der klebenden Kopfzeile; Fehler am Feld mit Satz; keine erneute Eingabe bereits gemachter Angaben. | E17, E18 | WCAG 2.2: 1.4.3, 1.4.11, 2.5.5, 2.5.8, 2.4.11, 3.3.7 [L97], [L98], [L101]; Inhaber (SKILL:71) |
| R11 | **Ladebudget.** Erster Telefon-Bildschirm höchstens 300 KB Bilder; WebGL und Bildfolgen erst bei Annäherung; Schleifen nur im Bild; Zielwerte LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 am 75. Perzentil auf einem mittleren Android-Telefon; Wartezeiten über 1 s mit sichtbarem Zwischenstand. | E16 (Vodafone [L87], Core Web Vitals [L88], Nielsen [L4]) | Inhaber (DR:167-168; SKILL:31-32, :61) |
| R12 | **Die ersten zwei Telefon-Bildschirme tragen die Entscheidung.** B2B: Kernaussage (Konfigurator unter eigener Marke und Domain), nächster Schritt und Weg zu den Paketen. B2C: Startknopf, „kostenlos, ohne Konto“, Preis des Aufmaßblatts. | E1, E2, E12 | Inhaber (SKILL:23-25, :86); Evidenz [L1] (S) |
| R13 | **B2C-Preis vor dem Aufwand.** Der Preis des Aufmaßblatts ist vor dem ersten Messschritt außerhalb des oberen Bands sichtbar, mit Datum des Einführungspreises und ohne laufenden Countdown; nach dem Stichtag verschwindet der Hinweis. | E11, E13 (Santana [L50], Mathur [L47]) | Evidenz; Inhaber (SKILL:48) |
| R14 | **Nur zeigen, was es gibt.** Keine Leistung, die nicht gebaut oder nicht freigeschaltet ist: Vorbelegung je Instanz (nicht gebaut), neutraler Absender nur „sobald eingerichtet“ (docs/INSTANZEN.md:308), Demo-Instanzen erst mit `PAKETE_DEMOS`; die Vorführung bis dahin als Hauseigentümer-Fassung gekennzeichnet. | E12, E19; GM 2.2, 6.2 | Inhaber (SKILL:49) |

### 3.5.2 Hypothesen, die getestet werden sollten

Prüfwege, die heute möglich sind: Vorher-nachher-Vergleich mit der eigenen Statistik (Tagessummen, Gerätearten), das Paketfeld im
Anfrageformular, Bestellungen je Paket in der Zentrale, Gespräche und Lesetests mit Fensterbauern, Messungen am Telefon. Vergleichstests
sind nicht eingerichtet (3.1).

| Nr. | Hypothese | Grundlage | Prüfweg und Messgröße |
|---|---|---|---|
| T1 | Ein Preissignal („ab 29 € im Monat“) im ersten oder zweiten Telefon-Bildschirm erhöht den Anteil der Besucher, die die Pakete erreichen und anfragen. | E1, E10 | vorher/nachher: Anfragen je Aufruf von `/fuer-fensterbauer/`; Sprung zu den Paketen müsste erfasst werden |
| T2 | Ein Meldungsstapel, der nach wenigen Meldungen endet, verlängert die Lesezeit der Überschrift und erhöht Klicks auf „Pakete ansehen“. | E5, E7 | vorher/nachher; Gespräche mit Bildschirmaufnahme |
| T3 | Weniger schwebende Nebenobjekte im Startbild erhöhen Klicks auf den Hauptknopf. Nur mit Zustimmung des Inhabers prüfen, der dieses Startbild mag (SKILL:120). | E3 | Variante dem Inhaber vorlegen; Gespräche |
| T4 | „Empfohlen“ mit einzeiligem Grund verschiebt Anfragen zum empfohlenen Paket stärker als die Markierung allein und wird verstanden. | E9 | Paketfeld im Formular; Gespräche: Grund in eigenen Worten wiedergeben |
| T5 | Die Differenz zum Nachbarpaket („+10 € im Monat: …“) erhöht den Anteil höherer Pakete. | keine Studie (PAK-H9) | Paketfeld; Bestellungen je Paket |
| T6 | Absteigende Reihenfolge am Schreibtisch erhöht den Anteil von Signature. | E10 (Suk [L36]) | nur, wenn die Besucherzahl einen Vergleich trägt |
| T7 | Ein gruppierter Vergleich mit „In allen Paketen“ als Satz, nur Unterschieden (etwa 12 Zeilen) und „nicht enthalten“ statt „nein“ wird am Telefon schneller und richtiger gelesen. | E8, PAK-H10 bis -H13 | Lesetest: „Was bekomme ich mit Plus zusätzlich?“ – Zeit und richtige Antworten |
| T8 | Eine Zeile „im ersten Jahr“ senkt Reue und Rückfragen, ohne Anfragen zu senken (Gegenhypothese: senkt Anfragen). | E11 | vorher/nachher: Anfragen, Rückfragen zu Kosten |
| T9 | Ein leiser zweiter Weg („Unsicher, welches Paket passt? Rückruf oder Nachricht“) direkt unter den Paketen erhöht Anfragen, ohne Bestellungen zu verdrängen. | E15 | Anteil Anfragen mit offenem Paket; Verhältnis Anfragen zu Bestellungen |
| T10 | Ein Formular mit Pflicht nur für E-Mail und Paket, freiwilligem Freitext und Prüfung beim Verlassen des Feldes erhöht die Abschlussquote. | E17 | Formular begonnen → abgesendet (Erfassung fehlt) |
| T11 | Ein Weg in die Demo-Instanz je Paket an der Karte erhöht Anfragen und das Verständnis der Paketunterschiede. | E12 | nach `PAKETE_DEMOS`: Aufrufe der Demos, Anfragen danach; Gespräche |
| T12 | Eine weiterreichbare Kurzfassung der Pakete hilft Betrieben mit Mitentscheidern. | E15 | Abrufe; Gespräche |
| T13 | Eine Bestätigung mit Zahlen und nächstem Schritt nach der Paketwahl senkt Abbrüche im Bestellformular. | E17; PAK-H38 | nach `PAKETE_OFFEN`: Abbrüche je Schritt im Kundenkonto |
| T14 | Der Vergleich mit dem bisherigen Arbeitsweg (Kontaktformular mit Freitext, Termin vor Ort) und die Aussage „Anfragen von Kunden, die ihr Fenster schon vor Augen haben“ überzeugen Fensterbauer stärker als Funktionslisten. | E19; WET 3.3.2 | Gespräche: Verständnis und Relevanz |
| T15 | „Ein Konfigurator in allen Paketen, der Unterschied ist Ihre Marke“ als Leitsatz der Paketwahl ist leichter zu verstehen als eine Liste von Merkmalen. | WET-H8 | Gespräche, Lesetest |
| T16 | Signature mit Rückruf als gleichwertiger Alternative zum Bestellen (Handlungsaufforderung nach Stufe) erhöht Signature-Anfragen. Die Regel „eine Cream-Pille je Bildschirm“ bleibt. | WET 3.3.2 (Linear) | Paketfeld; Anfragen mit Rückrufwunsch |
| T17 | B2C: Ein Einstieg über ein vorbereitetes Fenster statt leerer Auswahl erhöht den Anteil, der den ersten Messschritt abschließt. | E8, E19 (Hildebrand [L114]) | Trichter App geöffnet → Kasse geöffnet → gekauft (`web/assets/zentrale.js:326`) |
| T18 | B2C: Ein kurzer realistischer Ablauf „Foto → Maß → Modell → Blatt“ im Einstieg erhöht den Schritt in die App. Nicht als „Handy zu Briefumschlag“ (SKILL:125). | E6 | wie T17 |
| T19 | B2C: Ein Satz zum Umgang mit den Fotos (wer sie sieht, wann sie gelöscht werden) im Einstieg erhöht den Schritt in die App. | E14 | wie T17 |

### 3.5.3 Spannungen zwischen Vorgaben und Forschung

Die Vorgabe gilt. Die Prüfaufgabe sorgt dafür, dass sie ohne Nachteil umgesetzt wird.

| Vorgabe | Forschung | Prüfaufgabe |
|---|---|---|
| Bewegung mit Tiefe, Physik, Reaktion aufs Scrollen (SKILL:43-46) | Bewegungsbeginn lenkt ab (E5); Parallaxe verbessert die Bedienbarkeit nicht (E6); WCAG 2.2.2 und 2.3.3 (E7) | an Gegenstand oder Handlung binden (R4); Ende oder Pause (R2); ruhige Fassung vollständig (R3) |
| Leisten wie die Logoleisten anderer Seiten (SKILL:121) | Bandform, Bewegung und Lage lösen Banner-Blindheit aus (E5) | Entscheidendes zusätzlich statisch zeigen (R5) |
| Detailreichtum (SKILL:47); Startbild mit Meldungen, Haken-Chips und schwebenden Objekten (SKILL:120; docs/GESTALTUNG.md:447) | zielfremde Details und Komplexität kosten Aufmerksamkeit und Ersturteil (E2, E3) | Details am Hauptobjekt; Zahl der Elemente je Bildschirm zählen; T3 nur mit Zustimmung |
| Dunkle Bühne (docs/GESTALTUNG.md, „Farbe“) | negative Polarität liest sich schlechter (E18) | kurze Texte, 17 px Lesetext, Kontraste wie berechnet (R10) |
| Bildwelt mit Astronaut und Tieren (docs/GESTALTUNG.md, „Bildsprache“) | rein dekorative Bilder werden übersprungen, Produktbilder betrachtet (E3) | Produktbeweis über echte Konfigurator-Bilder (SKILL:41-42); Blick oder Handlung der Figur zur Botschaft |
| „Zum höheren Paket hinführen“ (SKILL:50) | Mitte, Markierung und Startposition wirken auf Plus (E9) | Inhaber entscheidet, welches Paket empfohlen wird (F1) |
| Keine erfundenen Belege (SKILL:49) | Bewertungen und Stimmen wirken (E14, [L69]) | prüfbare Ersatzbelege (E14); Pilotstatus offen |
| Premium-Technik als Standard bei „high end“ (SKILL:55-59) | Ladezeit wirkt auf Abschluss (E16) | Ladebudget (R11); Wirkung am mittleren Android-Telefon messen |

### 3.5.4 Was gemessen werden müsste

Umsetzung ist nicht Teil dieser Phase (WIS 11, PAK 17).

1. B2B: Aufrufe von `/fuer-fensterbauer/` und der eingebetteten Ansicht nach Gerät (Gerätearten werden erfasst,
   `functions/api/statistik.js:57-59`).
2. B2B: Trichter Aufruf → Pakete erreicht → Formular begonnen → Frage gesendet → Bestellung angelegt (fehlt in der Zentrale).
3. B2B: Anteil der Anfragen und Bestellungen je Paket, einschließlich „noch offen“ (prüft E9, T4, T5).
4. B2C: App geöffnet → Kasse geöffnet → gekauft (vorhanden, `web/assets/zentrale.js:326`) vor und nach Änderungen an der
   Preissichtbarkeit (prüft R13, T17 bis T19).
5. Beide: LCP, INP und CLS am 75. Perzentil auf einem mittleren Android-Telefon (prüft R11).

### 3.5.5 Offene Fragen an den Inhaber

1. **Empfehlung:** Welches Paket soll empfohlen werden, und aus welchem Grund? Heute folgt die Empfehlung der Position
   (`functions/pakete-seite.js:32-33`; PAK F1).
2. **Preisbindung:** Bleibt der Preis „für Ihren Vertrag fest“, oder gilt der Änderungsvorbehalt (3.4.4/1; PAK F3)?
3. **Erstattung:** Wird die Einrichtung erstattet, wenn der Betrieb die Vorschau nicht freigibt? Ohne Angabe darf keine Risikoumkehr über
   die Kündbarkeit hinaus erscheinen (PB:60, :70; PAK F5).
4. **Testphase:** Soll es eine Testphase geben, oder übernehmen Vorschau mit Freigabe, Abo erst ab Live und Storno bis zur Einrichtung
   diese Rolle (WET-H7; WET 9, Frage 4)?
5. **Zeitplan:** Wann werden `PAKETE_OFFEN` und `PAKETE_DEMOS` gesetzt, wann endet „Vorläufige Preise“ (GM 7.2, Fragen 5 und 6; PAK F2)?
   Beides bestimmt die Handlungsaufforderung der Seite.
6. **Umsatzsteuer:** 19 % oder Kleinunternehmerregelung (3.4.4/4)? Davon hängt jede Preiszeile ab.
7. **Nettopreise auf eingebetteter Seite:** Genügt die Unternehmer-Bestätigung beim Bestellen, wenn die Verkaufsseite auch in der
   Startseite für Hauseigentümer steht (PAK F8; BGH I ZR 99/08 [L117])? Anwaltlich zu prüfen.
8. **Wortlaut der Bedingungen:** „Monatsende“ oder „Ende des Abrechnungsmonats“; Differenz beim Paketwechsel Pflicht oder auf Wunsch
   (3.4.4/2 und /3)?
9. **Zahlen auf der Seite:** Sind „etwa 5 Minuten je Fenster“, „meist 3 bis 5 Werktage bis Live“ und „Antwort in der Regel innerhalb
   eines Werktags“ gemessen oder Ziele? Gibt es eine Grenze, wie viele Einrichtungen je Woche machbar sind (GM 7.2, Frage 11)?
10. **Kundenschutz und B2C-Weg:** Wie stellt die Verkaufsseite „Ihre Kunden bleiben Ihre Kunden“ dar, wenn eeziframes.com zugleich
    Hauseigentümern ein Aufmaßblatt verkauft, das sie an beliebig viele Betriebe schicken (`web/index.html:95`;
    docs/ABRECHNUNG.md:84)?
11. **Clean Invoice:** Wie positioniert sich eeziframes gegen ein kostenloses Angebot mit ähnlichen Versprechen (3.3.5)? Ist „eigene
    Domain“ wirklich ein Alleinstellungsmerkmal (WET 9, Fragen 1 und 2)?
12. **Referenzen:** Gibt es Pilotbetriebe, die genannt werden dürfen (GM 7.2, Frage 12)?
13. **Messung:** Soll ein Trichter für die Verkaufsseite in der eigenen Statistik entstehen (3.5.4/2)?
14. **Startseite:** Soll sie weiter mit der Ansicht für Hauseigentümer öffnen, obwohl Fensterbauer die Hauptzielgruppe sind (GM 7.1,
    Frage 2)? Das betrifft E1.
15. **Weitere Inhaberentscheidungen:** Jahreszahlung (PAK F10); Pause durch den Betrieb (WET 9, Frage 5); Zusatzkosten beziffern
    (PAK F6); zwei Produkte namens „Plus“ (3.4.4/6).
16. **Recht:** Gilt das Barrierefreiheitsstärkungsgesetz für den Verkauf des Aufmaßblatts, und greift die Ausnahme für
    Kleinstunternehmen (WIS 7; [L103], Sekundärquellen)?
17. **Sichtung:** Für eine Sichtung der Wettbewerbsseiten mit Bildschirmfotos (Telefon 390 × 844, Schreibtisch 1280) müsste die Umgebung
    die Hosts zulassen, oder die Sichtung geschieht von Hand im Browser (WET 2, WET 9, Frage 7). Gleiches gilt für Volltexte der
    Studien.

---

## 3.6 Quellenverzeichnis

Nur Quellen, die in den Rohdateien tatsächlich gefunden wurden, mit der dort genannten Adresse. Status: **A** Abstract oder Original-
bzw. Repositoriumsseite im Suchauszug gesehen · **S** nur Sekundärquelle · **N** nicht verifiziert oder widersprüchlich. Kein Volltext
gelesen. Spalte „Roh“: Nummer in WIS bzw. PAK.

### Aufmerksamkeit, Wahrnehmung, Gestaltung

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L1 | Nielsen Norman Group (2018, Autor nicht ausgewiesen): Scrolling and Attention. https://www.nngroup.com/articles/scrolling-and-attention/ | S | WIS Q28 |
| L2 | Nielsen Norman Group / Pernice, K. (2017, Jahr erschlossen): F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant (Even on Mobile). https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ | A | WIS Q29 |
| L3 | Nielsen, J. (2006): Progressive Disclosure. https://www.nngroup.com/articles/progressive-disclosure/ (nicht abrufbar); Zusammenfassung: https://brajeshwar.com/2006/progressive-disclosure-by-jakob-nielsen-usability-expert/ ; Hinweis auf fehlende Studien: https://thedecisionlab.com/reference-guide/design/progressive-disclosure | S | WIS Q30 |
| L4 | Nielsen, J. (1993): Response Times: The 3 Important Limits. https://nngroup.com/articles/response-times-3-important-limits | A | WIS Q39 |
| L5 | Sweller, J. (1988): Cognitive Load During Problem Solving: Effects on Learning. Cognitive Science 12(2), 257–285. https://doi.org/10.1207/s15516709cog1202_4 | A | WIS Q31 |
| L6 | Noetel, M. et al. (2022): Multimedia Design for Learning: An Overview of Reviews With Meta-Meta-Analysis. Review of Educational Research 92(3), 413–454. https://acuresearchbank.acu.edu.au/item/8zqy4/multimedia-design-for-learning-an-overview-of-reviews-with-meta-meta-analysis | A | WIS Q32 |
| L7 | Rey, G. D. (2012): A review of research and a meta-analysis of the seductive detail effect. Educational Research Review 7(3), 216–237. https://doi.org/10.1016/j.edurev.2012.05.003 ; Folgestudie Sundararajan & Adesope (2020), Pressemitteilung: https://news.wsu.edu/?p=201521 | S | WIS Q33 |
| L8 | Lindgaard, G., Fernandes, G., Dudek, C. & Brown, J. (2006): Attention web designers: You have 50 milliseconds to make a good first impression! Behaviour & Information Technology 25, 115–126. https://www.nature.com/news/2006/060109/full/news060109-13.html | A/S | WIS Q34 |
| L9 | Tuch, A. N., Presslaber, E. E., Stöcklin, M., Opwis, K. & Bargas-Avila, J. A. (2012): The role of visual complexity and prototypicality regarding first impression of websites. International Journal of Human-Computer Studies 70(11), 794–811. https://research.google/pubs/pub38315/ | A | WIS Q35 |
| L10 | Reinecke, K. et al. (2013): Predicting users' first impressions of website aesthetics with a quantification of perceived visual complexity and colorfulness. CHI 2013, 2049–2058. https://www.eecs.harvard.edu/~kgajos/papers/2013/reinecke13predicting.shtml | A | WIS Q36 |
| L11 | Tractinsky, N., Katz, A. S. & Ikar, D. (2000): What is beautiful is usable. Interacting with Computers 13(2), 127–145. https://academic.oup.com/iwc/article/13/2/127/898608 | A | WIS Q37 |
| L12 | Tuch, A. N., Roth, S. P., Hornbæk, K., Opwis, K. & Bargas-Avila, J. A. (2012): Is beautiful really usable? Computers in Human Behavior 28(5), 1596–1607. https://research.google/pubs/is-beautiful-really-usable-toward-understanding-the-relation-between-usability-aesthetics-and-affect-in-hci/ | A | WIS Q38 |
| L13 | Abrams, R. A. & Christ, S. E. (2003): Motion onset captures attention. Psychological Science 14(5), 427–432. https://pubmed.ncbi.nlm.nih.gov/12930472/ | A | WIS Q42 |
| L14 | Burke, M., Hornof, A., Nilsen, E. & Gorman, N. (2005): High-cost banner blindness. ACM TOCHI 12(4), 423–445. https://www.doi.org/10.1145/1121112.1121116 | A | WIS Q41 |
| L15 | Goldstein, D. G., McAfee, R. P. & Suri, S. (2013): The Cost of Annoying Ads. WWW 2013. https://archives.iw3c2.org/www2013/proceedings/p459.pdf | A (Zahlen zu animierten Anzeigen S) | WIS Q43 |
| L16 | Nielsen Norman Group (Datum N): Banner Blindness Revisited: Users Dodge Ads on Mobile and Desktop. https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/ | S | WIS Q40 |
| L17 | Höffler, T. N. & Leutner, D. (2007): Instructional animation versus static pictures: A meta-analysis. Learning and Instruction 17(6), 722–738. https://www.leibniz-ipn.de/en/research/publications/instructional-animation-versus-static-pictures-a-meta-analysis ; Berney, S. & Bétrancourt, M. (2016), Folge-Metaanalyse, Fundstelle N: https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf | A (Folgestudie N) | WIS Q47 |
| L18 | Frederick, D., Mohler, J., Vorvoreanu, M. & Glotzbach, R. (2015): The Effects of Parallax Scrolling on User Experience in Web Design. Journal of Usability Studies 10(2), 87–95. https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Frederick_Feb2015.pdf ; Übelkeit: https://www.uxpin.com/studioblog/3-crucial-ux-considerations-going-parallax/ | A (Übelkeit S) | WIS Q48 |
| L19 | Nielsen, J. (um 2010, Datum N): Photos as Web Content. https://www.nngroup.com/articles/photos-as-web-content/ | A/S | WIS Q45 |
| L20 | Sajjacholapunt, P. & Ball, L. J. (2014): The influence of banner advertisements on attention and memory: human faces with averted gaze can enhance advertising effectiveness. Frontiers in Psychology 5:166. https://pmc.ncbi.nlm.nih.gov/articles/PMC3941030 | A | WIS Q44 |

### Entscheidungspsychologie

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L21 | Iyengar, S. S. & Lepper, M. R. (2000): When Choice is Demotivating. Journal of Personality and Social Psychology. Zusammenfassung: https://acawiki.org/When_Choice_is_Demotivating:_Can_One_Desire_Too_Much_of_a_Good_Thing%3F ; zur Replikation: https://www.psychologicalscience.org/observer/being-choosy-about-choosing | S | WIS Q1 |
| L22 | Scheibehenne, B., Greifeneder, R. & Todd, P. M. (2010): Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice Overload. Journal of Consumer Research 37(3), 409–425. https://ideas.repec.org/a/oup/jconrs/v37y2010i3p409-425.html | A | WIS Q2, PAK Q2 |
| L23 | Chernev, A., Böckenholt, U. & Goodman, J. (2015): Choice Overload: A Conceptual Review and Meta-Analysis. Journal of Consumer Psychology 25(2), 333–358. https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual | A | WIS Q3, PAK Q3 |
| L24 | Simonson, I. (1989): Choice Based on Reasons: The Case of Attraction and Compromise Effects. Journal of Consumer Research 16(2), 158–174. https://www.gsb.stanford.edu/faculty-research/publications/choice-based-reasons-case-attraction-compromise-effects | A | PAK Q4 |
| L25 | Neumann, N., Böckenholt, U. & Sinha, A. (2016): A meta-analysis of extremeness aversion. Journal of Consumer Psychology 26(2), 193–212. https://www.kellogg.northwestern.edu/academics-research/research/detail/2016/a-meta-analysis-of-extremeness-aversion | N (WIS: A mit Inhalt; PAK: nur Titel) | WIS Q8, PAK Q5 |
| L26 | Valenzuela, A. & Raghubir, P. (2009): Position-Based Beliefs: The Center-Stage Effect. Journal of Consumer Psychology 19(2), 185–196. https://merit.url.edu/en/publications/position-based-beliefs-the-center-stage-effect/ | A | PAK Q13 |
| L27 | Atalay, A. S., Bodur, H. O. & Rasolofoarison, D. (2012): Shining in the Center: Central Gaze Cascade Effect on Product Choice. Journal of Consumer Research 39(4), 848–866. https://hal.archives-ouvertes.fr/hal-01947459 | A | WIS Q9, PAK Q14 |
| L28 | Huber, J., Payne, J. W. & Puto, C. (1982): Adding Asymmetrically Dominated Alternatives. Journal of Consumer Research 9(1), 90–98. https://scholars.duke.edu/publication/904415 ; Sekundär: https://andrewclark.super.site/all-media/adding-asymmetrically-dominated-alternatives-violations-of-regularity-and-the-similarity-hypothesis | A | WIS Q4, PAK Q6 |
| L29 | Frederick, S., Lee, L. & Baskin, E. (2014): The Limits of Attraction. Journal of Marketing Research 51, 487–507. https://marketing.wharton.upenn.edu/wp-content/uploads/2016/10/The-Limits-of-Attraction.pdf | A | WIS Q5, PAK Q7 |
| L30 | Yang, S. & Lynn, M. (2014): More Evidence Challenging the Robustness and Usefulness of the Attraction Effect. Journal of Marketing Research 51(4), 508–513. https://ecommons.cornell.edu/entities/publication/0c5b506a-f8d3-4a4c-8825-b2c715e9f956 | A | WIS Q6, PAK Q8 |
| L31 | Huber, J., Payne, J. W. & Puto, C. (2014): Let's Be Honest About the Attraction Effect. Journal of Marketing Research 51(4), 520–525. https://scholars.duke.edu/publication/1045479 ; https://people.duke.edu/~jch8/bio/Papers/HuberPaynePutoJMR%202014.pdf | A | WIS Q7, PAK Q9 |
| L32 | Tversky, A. & Kahneman, D. (1974): Judgment under Uncertainty: Heuristics and Biases. Science 185, 1124–1131. https://andrewclark.super.site/all-media/judgment-under-uncertainty-heuristics-and-biases | S | WIS Q11 |
| L33 | Klein, R. A. et al. (2014): Investigating variation in replicability („Many Labs“). https://research.tilburguniversity.edu/en/publications/investigating-variation-in-replicability-a-many-labs-replication-/ ; https://research.unipd.it/bitstream/11577/2688304/1/ManyLabs.2014.SP.fulltext.pdf ; Ankereffekt als repliziert: https://forrt.org/flora-replication-atlas/doi/10.1177/01461672952111004/ | S | WIS Q12, PAK Q12 |
| L34 | Maniadis, Z., Tufano, F. & List, J. A. (2014): One Swallow Doesn't Make a Summer: New Evidence on Anchoring Effects. American Economic Review 104(1), 277–290. https://eprints.nottingham.ac.uk/31360 ; Kritik: https://datacolada.org/7 , https://datacolada.org/archives/tag/anchoring | A | WIS Q13, PAK Q11 |
| L35 | Ariely, D., Loewenstein, G. & Prelec, D. (2003): „Coherent Arbitrariness“: Stable Demand Curves Without Stable Preferences. Quarterly Journal of Economics 118(1), 73–105. https://www.cmu.edu/dietrich/sds/docs/loewenstein/CoherentArbit.pdf | A | PAK Q10 |
| L36 | Suk, K., Lee, J. & Lichtenstein, D. R. (2012): The Influence of Price Presentation Order on Consumer Choice. Journal of Marketing Research 49(5), 708–717. https://vivo.colorado.edu/display/pubid_59904 ; https://biz.korea.ac.kr/eng/activities/academic_view.html?no=372 | A | WIS Q10, PAK Q1 |
| L37 | Brown, A. L., Imai, T., Vieider, F. M. & Camerer, C. F. (2024): Meta-analysis of Empirical Estimates of Loss Aversion. Journal of Economic Literature 62(2), 485–516. https://www.aeaweb.org/doi/10.1257/jel.20221698 | A | WIS Q14 |
| L38 | Gal, D. & Rucker, D. D. (2018): The Loss of Loss Aversion: Will It Loom Larger Than Its Gain? Journal of Consumer Psychology 28(3), 497–516. https://papers.ssrn.com/abstract=3049660 | A | WIS Q15 |
| L39 | Johnson, E. J. & Goldstein, D. (2003): Do Defaults Save Lives? Science 302(5649), 1338–1339. https://thedecisionlab.com/insights/health/can-defaults-save-lives-the-power-of-default-options-on-life-saving-decisions | S | WIS Q19 |
| L40 | Jachimowicz, J. M., Duncan, S., Weber, E. U. & Johnson, E. J. (2019): When and why defaults influence decisions: a meta-analysis of default effects. Behavioural Public Policy 3(2), 159–186. https://ideas.repec.org/a/cup/bpubpo/v3y2019i02p159-186_00.html | A | WIS Q20, PAK Q15 |
| L41 | Mertens, S., Herberz, M., Hahnel, U. J. J. & Brosch, T. (2022): The effectiveness of nudging. PNAS. https://archive-ouverte.unige.ch/unige:159958 | A | WIS Q21 |
| L42 | Maier, M. et al. (2022): No evidence for nudging after adjusting for publication bias. PNAS. https://pmc.ncbi.nlm.nih.gov/articles/PMC9351501 | A | WIS Q22 |
| L43 | Szaszi, B. et al. (2022): No reason to expect large and consistent effects of nudge interventions. PNAS. https://pmc.ncbi.nlm.nih.gov/articles/PMC9351519 | A | WIS Q23 |
| L44 | Goodman, J. K., Broniarczyk, S. M., Griffin, J. G. & McAlister, L. (2013): Help or Hinder? When Recommendation Signage Expands Consideration Sets and Heightens Decision Difficulty. Journal of Consumer Psychology 23(2), 165–174. https://sites.utexas.edu/sbroniarczyk/publications/ | N (Inhalt nicht am Original geprüft) | PAK Q16 |
| L45 | Cai, H., Chen, Y. & Fang, H. (2009): Observational Learning: Evidence from a Randomized Natural Field Experiment. American Economic Review 99(3), 864–882. https://www.nber.org/papers/w13516 | A | PAK Q17 |
| L46 | Barton, B., Zlatevska, N. & Oppewal, H. (2022): Scarcity tactics in marketing: A meta-analysis of product scarcity effects on consumer purchase intentions. Journal of Retailing 98(4), 741–758. https://research.bond.edu.au/en/publications/scarcity-tactics-in-marketing-a-meta-analysis-of-product-scarcity/ | A | WIS Q26 |
| L47 | Mathur, A. et al. (2019): Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites. ACM CSCW 2019. https://arxiv.org/pdf/1907.07032 ; https://arxiv.org/abs/1907.07032 | A | WIS Q27, PAK Q28 |
| L48 | Luguri, J. & Strahilevitz, L. J. (2021): Shining a Light on Dark Patterns. Journal of Legal Analysis 13(1), 43–109. https://academic.oup.com/jla/article/13/1/43/6180579 ; Quoten aus Vortragsfolien (2022): https://cppa.ca.gov/meetings/materials/20220329_30_day_1_item_2c_strahilevitz.pdf | A (Quoten S) | PAK Q27 |

### Preise, Kosten, Risiko

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L49 | Abraham, A. T. & Hamilton, R. W. (2018): When Does Partitioned Pricing Lead to More Favorable Consumer Preferences? Meta-Analytic Evidence. Journal of Marketing Research. https://journals.sagepub.com/doi/10.1177/0022243718800724 | A (Autoren N) | WIS Q24 |
| L50 | Santana, S., Dallas, S. K. & Morwitz, V. G. (2020): Consumer Reactions to Drip Pricing. Marketing Science 39(1), 188–210. https://business.columbia.edu/faculty/research/consumer-reactions-drip-pricing | A | WIS Q25 |
| L51 | Morwitz, V. G., Greenleaf, E. A. & Johnson, E. J. (1998): Divide and Prosper: Consumers' Reactions to Partitioned Prices. Journal of Marketing Research 35, 453–463. https://business.columbia.edu/faculty/research/divide-and-prosper-why-firms-divide-prices-instead-charging-single-price | A | PAK Q18 |
| L52 | Greenleaf, E. A., Johnson, E. J., Morwitz, V. G. & Shalev, E. (2016): The Price Does Not Include Additional Taxes, Fees, and Surcharges: A Review of Research on Partitioned Pricing. Journal of Consumer Psychology 26(1), 105–124. https://cris.openu.ac.il/en/publications/the-price-does-not-include-additional-taxes-fees-and-surcharges-a/ ; Stellungnahme Morwitz vor dem US-Senatsausschuss (Jahr nicht ermittelt): https://www.commerce.senate.gov/services/files/31CC9415-0371-476F-9041-992CEE3A217F | A (Moderatoren S) | PAK Q19 |
| L53 | Blake, T., Moshary, S., Sweeney, K. & Tadelis, S. (2021): Price Salience and Product Choice. Marketing Science 40(4), 619–636. https://faculty.haas.berkeley.edu/stadelis/AIP.pdf | A (Prozentwerte S) | PAK Q20 |
| L54 | Mohan, B., Buell, R. W. & John, L. K. (2020): Lifting the Veil: The Benefits of Cost Transparency. Marketing Science. Pressemitteilung INFORMS: https://informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Cost-Transparency-Can-Increase-Sales-20 | A | PAK Q21 |
| L55 | Buell, R. W. & Norton, M. I. (2011): The Labor Illusion. Management Science; Buell, R. W., Kim, T. & Tsay, C.-J.: Creating Reciprocal Value Through Operational Transparency. Management Science. https://dash.harvard.edu/entities/publication/73120378-fdcc-6bd4-e053-0100007fdf3b | S | PAK Q22 |
| L56 | Lambrecht, A. & Skiera, B. (2006): Paying Too Much and Being Happy About It. Journal of Marketing Research 43, 212–223. https://www.anderson.ucla.edu/documents/areas/fac/marketing/paying_too_much.pdf | A | PAK Q23 |
| L57 | Gourville, J. T. (1998): Pennies-a-Day: The Effect of Temporal Reframing on Transaction Evaluation. Journal of Consumer Research 24(4), 395–408. https://ideas.repec.org/a/oup/jconrs/v24y1998i4p395-408.html | A (Betragsgrenze S) | PAK Q24 |
| L58 | Suwelack, T., Hogreve, J. & Hoyer, W. D. (2011): Understanding Money-Back Guarantees. Journal of Retailing 87(4), 462–478. https://ideas.repec.org/a/eee/jouret/v87y2011i4p462-478.html | A | WIS Q16, PAK Q26 |
| L59 | Janakiraman, N., Syrdal, H. A. & Freling, R. (2016): The Effect of Return Policy Leniency on Consumer Purchase and Return Decisions: A Meta-analytic Review. Journal of Retailing. Pressemitteilung: https://news.utdallas.edu/?p=11491 | S | WIS Q17 |
| L60 | Schlosser, A. E. (2003): Experiencing Products in the Virtual World: The Role of Goal and Imagery in Influencing Attitudes versus Purchase Intentions. Journal of Consumer Research 30(2), 184–198. https://ideas.repec.org/a/oup/jconrs/v30y2003i2p184-98.html | A | WIS Q54 |
| L61 | Foubert, B. & Gijsbrechts, E. (2016): Try It, You'll Like It—Or Will You? The Perils of Early Free-Trial Promotions for High-Tech Service Adoption. Marketing Science 35(5), 810–826. https://pubsonline.informs.org/doi/10.1287/mksc.2015.0973 | A | PAK Q25 |

### Vertrauen und B2B-Kauf

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L62 | Fogg, B. J. et al. (2003): How do users evaluate the credibility of Web sites? DUX '03. https://colab.ws/articles/10.1145/997078.997097 ; Bericht Consumer WebWatch: https://advocacy.consumerreports.org/research/how-do-people-evaluate-a-web-sites-credibility | A | WIS Q49, PAK Q29 |
| L63 | Stanford Persuasive Technology Lab (2002): Stanford Guidelines for Web Credibility. https://credibility.stanford.edu/guidelines | A (Kontakt-Leitlinie S) | PAK Q30 |
| L64 | Nielsen Norman Group / Harley, A. (2016): Trustworthiness in Web Design: 4 Credibility Factors. https://www.nngroup.com/articles/trustworthy-design/ ; Video: https://www.nngroup.com/videos/4-trustworthiness-factors/ | A (nur Anfang des Artikels) / S | WIS Q50, PAK Q31 |
| L65 | Kim, Y. & Peterson, R. A. (2017): A Meta-analysis of Online Trust Relationships in E-commerce. Journal of Interactive Marketing 38, 44–54. https://ideas.repec.org/a/eee/joinma/v38y2017icp44-54.html | A | WIS Q51 |
| L66 | Nielsen Norman Group: Show Prices for Common Scenarios. https://www.nngroup.com/articles/show-prices-for-common-scenarios/ ; B2B Website Usability (Bericht, 293 Websites): https://www.nngroup.com/reports/b2b-websites-usability/ ; Presse 2006: https://www.destinationcrm.com/Articles/CRM-News/CRM-Featured-Articles/B2B-Web-Sites-Are-Dropping-the-Ball-42449.aspx | A/S | WIS Q52, PAK Q33 |
| L67 | Nielsen Norman Group (Jahr nicht ermittelt): B2B Trust from B2C. https://www.nngroup.com/articles/b2b-trust-from-b2c/ | A | PAK Q32 |
| L68 | Nielsen Norman Group: Comparison Tables for Products, Services, and Features; Video „3 Rules for Better Comparison Tables“. https://www.nngroup.com/articles/comparison-tables/ ; https://www.nngroup.com/videos/ux-rules-comparison-tables/ | A (Video), N (Einzelregeln) | PAK Q34 |
| L69 | Spiegel Research Center (Northwestern University) (2017): How Online Reviews Influence Sales. Kopie: https://www.xait.com/hubfs/Spiegel_Online-Review_eBook_Jun2017_FINAL.pdf | S | PAK Q55 |
| L70 | Gartner (2018/2019): The New B2B Buying Journey, über Sekundärquellen: https://www.destinationcrm.com/Articles/CRM-Insights/Insight/Buyer-Enablement-Is-the-Key-to-B2B-Sales-127790.aspx ; https://insightly.com/blog/newb2bbuyingprocess/ ; https://www.foleon.com/blog/b2b-buyer-process | S | WIS Q53, PAK Q38 |
| L71 | Gartner (19.02.2024): Insights-Kurzfassung (75 % bevorzugen Kauf ohne Vertrieb; 43 % gegenüber 26 % hohe Reue). https://www.gartner.com/en/documents/5205463 | A | PAK Q35 |
| L72 | Gartner (25.06.2025): Gartner Sales Survey Finds 61% of B2B Buyers Prefer a Rep-Free Buying Experience (n = 632). https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-sales-survey-finds-61-percent-of-b2b-buyers-prefer-a-rep-free-buying-experience | A | PAK Q36 |
| L73 | Gartner (09.03.2026): Gartner Sales Survey Finds 67% of B2B Buyers Prefer a Rep-Free Experience (n = 646). https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience | A | PAK Q37 |
| L74 | Gartner: Customer Confidence (Buyer Enablement). https://www.gartner.com/en/sales/insights/customer-confidence | A (Methode unbekannt) | PAK Q39 |
| L75 | 6sense (09.10.2024): 6sense Launches 2024 Buyer Experience Report, Pressemitteilung. https://www.businesswire.com/news/home/20241009142556/en/6sense-Launches-2024-Buyer-Experience-Report-Unveiling-Global-B2B-Buyer-Trends | A (Herstellerbefragung) | PAK Q40 |
| L76 | TrustRadius: 2022 B2B Buying Disconnect: The Age of the Self-Serve Buyer (n = 2.185). https://go.trustradius.com/rs/827-FOI-687/images/TrustRadius_2022_B2B_Buying_Disconnect_6.27.22.pdf ; 2021: https://www.trustradius.com/vendor-blog/b2b-buying-disconnect-2021 | A | PAK Q41 |
| L77 | Capterra: 2024 U.S. Tech Trends Report. https://www.capterra.com/resources/us-tech-trends ; Gartner Digital Markets: Why Software Buyers Experience Regret (n = 3.484). https://view.ceros.com/gartner/dm-2559031-gdm-vm-ceros-infographic-q4-abr ; Capterra 2026 Software Buying Trends (Pressemitteilung 07.10.2025). https://www.businesswire.com/news/home/20251007148096/en | A (58 %, 60 %), S (Gründe, 89 %) | PAK Q43 |
| L78 | Google / BCG (2017): Mobile Marketing and the New B2B Buyer. https://www.bcg.com/publications/2017/marketing-sales-digital-go-to-market-transformation-mobile-marketing-new-b2b-buyer | A | WIS Q77 |
| L79 | Bitkom / ZDH (2020): Zwischen Tradition und Innovation – Das Handwerk wird digital, Pressemitteilung (502 Interviews). https://www.bitkom.org/Presse/Presseinformation/Zwischen-Tradition-und-Innovation-brDas-Handwerk-wird-digital.html | A | PAK Q57 |
| L80 | Navattic (2025): State of the Interactive Product Demo 2025. https://navattic.com/report/state-of-the-interactive-product-demo-2025 | A (Herstellerdaten) | PAK Q44 |

### Zählungen von Preisseiten

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L81 | Brandall, B. (Process Street) (2015): I Analyzed 250 SaaS Pricing Pages — Here's What I Found. https://www.process.st/saas-pricing-pages/ | A (Nenner unklar) | PAK Q45 |
| L82 | FastSpring (2022): Three-Tier Pricing Strategy for SaaS: Is It Still Ideal? https://fastspring.com/blog/three-tier-pricing-strategy-for-saas-is-it-still-ideal/ | A | PAK Q46 |
| L83 | ProfitWell (Paddle) (Jahr nicht ermittelt): Annual vs. Monthly Billing. https://learn.profitwell.com/blog/annual-vs-monthly-billing | A (Rabattspannen S) | PAK Q47 |
| L84 | Mohammed, R. (2018): The Good-Better-Best Approach to Pricing. Harvard Business Review, September/Oktober 2018. Katalogeintrag: https://bookshare.org/browse/book/2271405 | S | PAK Q48 |

### Conversion, Ladezeit, Formulare

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L85 | Think with Google: Page load time statistics. https://thinkwithgoogle.com/data/page-load-time-statistics | A (Jahr, Methode N) | WIS Q55 |
| L86 | Deloitte / Google / Fifty-Five (2020): Milliseconds Make Millions. https://web.dev/case-studies/milliseconds-make-millions ; https://deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions | A | WIS Q56 |
| L87 | web.dev (2021): Vodafone: A 31% improvement in LCP increased sales by 8%. https://web.dev/case-studies/vodafone | A | WIS Q57 |
| L88 | web.dev: How the Core Web Vitals metrics thresholds were defined. https://web.dev/articles/defining-core-web-vitals-thresholds | A | WIS Q58 |
| L89 | Kohavi, R. et al. (2013): Online Controlled Experiments at Large Scale. KDD 2013. Hinweis: https://blogs.bing.com/search-quality-insights/2013/08/08/large-scale-experimentation-at-bing | N (0,6 %-Zahl nicht bestätigt) | WIS Q59 |
| L90 | Seckler, M., Heinz, S., Bargas-Avila, J. A., Opwis, K. & Tuch, A. N. (2014): Designing Usable Web Forms: Empirical Evaluation of Web Form Improvement Guidelines. CHI 2014, 1275–1284. https://research.google/pubs/designing-usable-web-forms-empirical-evaluation-of-web-form-improvement-guidelines/ | A | WIS Q60 |
| L91 | Wroblewski, L. (2009): Inline Validation in Web Forms. A List Apart. https://alistapart.com/article/inline-validation-in-web-forms/ ; Folien: https://static.lukew.com/MIX10_WebForms_Lukew_03152010.pdf | S | WIS Q61 |
| L92 | Baymard Institute (2024): Checkout Optimization: average form fields. https://baymard.com/blog/checkout-flow-average-form-fields | A | WIS Q62 |
| L93 | Baymard Institute, über eMarketer (2024): https://www.emarketer.com/content/extra-costs-are-the-top-reason-consumers-abandon-online-carts ; Liste 2023 über https://optinmonster.com/cart-abandonment-statistics/ | S | WIS Q63 |
| L94 | Aagaard, M. (ContentVerve), über Unbounce: https://unbounce.com/conversion-rate-optimization/how-to-write-a-call-to-action/ | N | WIS Q64 |
| L95 | Praxisregeln zu Knopftexten: https://uxmovement.com/buttons/5-rules-for-choosing-the-right-words-on-button-labels/ | S | WIS Q65 |
| L96 | Villar, A., Callegaro, M. & Yang, Y. (2013): Where Am I? A Meta-Analysis of Experiments on the Effects of Progress Indicators for Web Surveys. Social Science Computer Review 31(6), 744–762. https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/ | A (Kritik S) | PAK Q54 |

### Barrierefreiheit und mobile Nutzung

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L97 | W3C (2023): Web Content Accessibility Guidelines (WCAG) 2.2. Übersicht der neuen Kriterien: https://tetralogical.com/blog/2023/10/05/whats-new-wcag-2.2 ; Understanding 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html | A | WIS Q66 |
| L98 | W3C: Understanding 2.4.11 Focus Not Obscured (Minimum), über DAISY: https://kb.daisy.org/publishing/docs/wcag/focus-not-obscured-minimum.html | S | WIS Q67 |
| L99 | W3C: Understanding 2.3.3 Animation from Interactions. https://w3.org/WAI/WCAG21/Understanding/animation-from-interactions | A | WIS Q68 |
| L100 | W3C: Understanding 2.2.2 Pause, Stop, Hide. https://www.w3.org/WAI/WCAG20/Understanding/pause-stop-hide ; Diskussion „prefers-reduced-motion“: https://hidde.blog/meeting-2-22-pause-stop-hide-with-prefers-reduced-motion/ | A/S | WIS Q69 |
| L101 | W3C: Understanding 1.4.3 Contrast (Minimum): https://w3.org/WAI/WCAG22/Understanding/contrast-minimum.html ; Understanding 1.4.11 Non-text Contrast: https://w3.org/WAI/WCAG22/Understanding/non-text-contrast | A | WIS Q70 |
| L102 | Agrawal, Y., Carey, J. P., Della Santina, C. C. et al. (2009): Disorders of balance and vestibular function in US adults. Archives of Internal Medicine 169, 938–944. https://consumer.healthday.com/otolaryngology-24/dizziness-and-vertigo-news-205/balance-dysfunction-common-in-american-adults-627401.html | S | WIS Q71 |
| L103 | Barrierefreiheitsstärkungsgesetz, über IHK Gera: https://www.ihk.de/gera/recht-und-steuern/fokus-onlinehandel/barrierefreiheit-im-onlinehandel-6545152 ; Händlerbund: https://ohn.haendlerbund.de/recht/rechtsfragen/diese-drei-ausnahmen-von-der-barrierefreiheitspflicht-sollten-unternehmen-kennen | S | WIS Q72 |
| L104 | Parhi, P., Karlson, A. K. & Bederson, B. B. (2006): Target size study for one-handed thumb use on small touchscreen devices. MobileHCI 2006. https://dx.doi.org/10.1145/1152215.1152260 | A | WIS Q73 |
| L105 | Hoober, S. (2013): How Do Users Really Hold Mobile Devices? UXmatters. https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php | A/S | WIS Q74 |
| L106 | Piepenbrock, C., Mayr, S. & Buchner, A. (2013): Positive display polarity is advantageous for both younger and older adults. Ergonomics 56(7). https://documentacion.fundacionmapfre.org/documentacion/bib/143702.do | A | WIS Q75 |
| L107 | Nielsen Norman Group / Moran, K. (2016): Lesen auf Mobilgeräten, über Sekundärquelle: https://cte.ku.edu/reason-reconsider-students-mobile-reading | S | WIS Q76 |
| L108 | StatCounter: Desktop vs Mobile Market Share Germany. https://gs.statcounter.com/platform-market-share/desktop-mobile/germany | N | WIS Q78 |
| L109 | Nielsen Norman Group, Themenseite Mobile (Karussells): https://www.nngroup.com/topic/mobile-and-tablet-design/?page=4 ; Smashing Magazine (2022): Usability Guidelines for Better Carousels UX. https://smashingmagazine.com/2022/04/designing-better-carousel-ux | A (NN/g-Satz), S (Zahlen) | PAK Q56 |

### Konfiguratoren und Mass Customization

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L110 | Franke, N. & Piller, F. (2004): Value Creation by Toolkits for User Innovation and Design: The Case of the Watch Market. Journal of Product Innovation Management 21(6), 401–415. https://research.wu.ac.at/en/publications/value-creation-by-toolkits-for-user-innovation-and-design-the-cas-3/ | A | WIS Q79 |
| L111 | Franke, N., Schreier, M. & Kaiser, U. (2010): The „I Designed It Myself“ Effect in Mass Customization. Management Science 56(1), 125–140. https://ideas.repec.org/a/inm/ormnsc/v56y2010i1p125-140.html | A | WIS Q80 |
| L112 | Dellaert, B. G. C. & Stremersch, S. (2005): Marketing Mass-Customized Products: Striking a Balance Between Utility and Complexity. Journal of Marketing Research 42(2), 219–227. https://repub.eur.nl/pub/11081 | A | WIS Q81 |
| L113 | Levav, J., Heitmann, M., Herrmann, A. & Iyengar, S. S. (2010): Order in Product Customization Decisions: Evidence from Field Experiments. Journal of Political Economy 118, 274–299. https://www.journals.uchicago.edu/doi/10.1086/652463 | A (Einzelheiten Autostudie N) | WIS Q82 |
| L114 | Hildebrand, C., Häubl, G. & Herrmann, A. (2014): Product Customization via Starting Solutions. Journal of Marketing Research 51(6), 707–725. https://www.alexandria.unisg.ch/236290 | A | WIS Q83 |
| L115 | Valenzuela, A., Dhar, R. & Zettelmeyer, F. (2009): Contingent Response to Self-Customization Procedures. Journal of Marketing Research 46(6), 754–763. https://merit.url.edu/en/publications/contingent-response-to-self-customization-procedures-implications/ | A | WIS Q84 |
| L116 | Haug, A., Hvam, L. & Mortensen, N. H. (2011, Angaben aus Suche): The impact of product configurators on lead times in engineering-oriented companies. AI EDAM. https://www.cambridge.org/core/journals/ai-edam/article/impact-of-product-configurators-on-lead-times-in-engineeringoriented-companies/107D0DB206626EE028613F59CB0DF203 | S | WIS Q85 |

### Recht (Einordnung, keine Rechtsberatung)

| Nr. | Quelle | Status | Roh |
|---|---|---|---|
| L117 | BGH, Urteil vom 29.04.2010, I ZR 99/08. https://rws-verlag.de/fileadmin/zbb-volltexte/1zr9908.pdf ; IT-Recht Kanzlei: Werbung mit Nettopreisen im B2B. https://www.it-recht-kanzlei.de/werbung-netto-preise-b2b.html | A (Urteil, Leitsätze nicht selbst gelesen), S (Auslegung) | PAK Q49 |
| L118 | Preisangabenverordnung § 1 (Fassung ab 28.05.2022). https://www.buzer.de/1_Preisangabenverordnung.htm ; IHK Düsseldorf: Preisangaben gegenüber Verbrauchern. https://www.ihk.de/duesseldorf/recht-und-steuern/recht/merkblaetter-von-a-bis-z/preisangaben-gegenueber-verbrauchern-5121326 | A | PAK Q50 |
| L119 | Gesetz gegen den unlauteren Wettbewerb, § 5a. https://www.gesetze-im-internet.de/uwg_2004/__5a.html | A | PAK Q51 |
| L120 | Händlerbund (Jahr nicht ermittelt): Abmahnung wegen Werbung erhalten? https://www.haendlerbund.de/de/leistungen/rechtssicherheit/hilfe-bei-abmahnung/abmahnung-werbung | A | PAK Q52 |
| L121 | Fieldfisher: Gesetz für faire Verbraucherverträge. https://www.fieldfisher.com/de-de/insights/gesetz-fur-faire-verbrauchervertrage ; Händlerbund: Kündigungsbutton nach § 312k BGB. https://www.haendlerbund.de/de/ratgeber/recht/kuendigungsbutton-nach-312k-bgb | A (B2B-Abgrenzung N) | PAK Q53 |

### Websites (Wettbewerb)

Alle aus Suchauszügen vom 24.10.2026; keine Seite war direkt abrufbar; Preise, Bewertungen und Nutzerzahlen sind Eigenangaben (WET 2).

| Nr. | Website | Adressen |
|---|---|---|
| M1 | Fenzon | https://fenzon.de/ ; https://fenzon.de/core/fenster-konfigurator ; https://fenzon.de/blog/kellerfensteronline-integriert-fenster-konfigurator-in-shopify ; https://shop.fenzon.de/ |
| M2 | 123fenster | https://123fenster.com/ |
| M3 | Combeenation | https://www.combeenation.com/en/pricing/ ; https://www.combeenation.com/blog/details/was-kostet-ein-produktkonfigurator/ ; https://www.combeenation.com/en/case-studies/ ; https://www.combeenation.com/en/cpq-implementation/ |
| M4 | Clean Invoice, Fenster-Konfigurator | https://www.clean-invoice.com/fenster-konfigurator ; https://www.clean-invoice.com/fenster-konfigurator/betriebe ; https://www.clean-invoice.com/rechner-einbinden/fenster-konfigurator |
| M5 | HERO | https://hero-software.de/preise ; https://hero-software.de/videos/preisgestaltung ; https://hero-software.de/ueber-uns/auszeichnungen-mitgliedschaften/trusted-testsieger ; https://hero-software.de/alternativen/streit ; https://hero-software.de/ai |
| M6 | plancraft | https://plancraft.com/de-de/preise ; https://plancraft.com/de-de ; https://plancraft.com/de-de/word-excel-vs-plancraft ; https://plancraft.com/de-de/gewerke/maler-software |
| M7 | Craftnote | https://craftnote.de/preise/ ; https://craftnote.de/pakete/ ; https://craftnote.de/ ; https://craftnote.de/buero-plus/ |
| M8 | fensterversand.com | https://www.fensterversand.com/info/anleitungen/fensterkonfigurator.php ; https://www.fensterversand.com/info/anleitungen/fenster/ausmessen.php ; https://www.fensterversand.com/fileadmin/pdf/aufmassblatt-fensterversand.pdf ; https://www.fensterversand.com/referenzen-fenster-shop.php ; https://www.fensterversand.com/fenstermonteure.php |
| M9 | fensterblick.de | https://www.fensterblick.de/ ; https://www.fensterblick.de/fensterpreisrechner.html ; https://www.fensterblick.de/fenster-kosten.html ; https://www.fensterblick.de/konfigurator.html |
| M10 | magicplan | https://magicplan.app/pricing ; https://help.magicplan.app/magicplan-pro-subscriptions ; https://help.magicplan.app/using-magicplan-for-free ; https://magicplan.app/blog/lidar |
| M11 | Linear | https://linear.app/pricing ; https://linear.app/ ; https://linear.app/docs/billing-and-plans ; https://linear.app/contact/sales |
| M12 | Shopify | https://www.shopify.com/pricing ; https://www.shopify.com/plus/pricing ; https://help.shopify.com/en/manual/intro-to-shopify/pricing-plans |
| M13 | A+W iQuote (gefunden, nicht ausgewertet) | a-w.com/software/cantor-iquote/ ; blog.a-w.com/uk/online-configurator-for-dealers-and-end-customers (Adressen wie in WET, ohne Protokoll) |
| M14 | STOLMA (gefunden, nicht ausgewertet) | stolma.de/konfigurator (wie in WET) |
| M15 | FENSTERART (gefunden, nicht ausgewertet) | fensterart.de/service/online-konfigurator (wie in WET) |

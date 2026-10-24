# Phase C: Wissenschaftliche und empirische Erkenntnisse

Stand: 24.10.2026. Teil der planerischen Neukonzeption nach MASTER-PROMPT V4. Dieses Dokument ändert nichts am Bestand; es sammelt
Forschung, ordnet ihre Belastbarkeit ein und leitet daraus Hypothesen für zwei Seiten ab:

- **B2B:** die Verkaufsseite für Fensterbauer `/fuer-fensterbauer/` (auch eingebettet in die Startseite, Ansicht „Fensterbauer“;
  docs/GESTALTUNG.md Z. 191 und Z. 441–456). Produkt: der Fenster-Konfigurator unter Marke und Domain des Betriebs in drei Paketen
  (`web/assets/pakete.js` Z. 43–66: EEZI Essential 29 €/Monat + 99 € Einrichtung, EEZI Essential Plus 39 € + 199 €, EEZI Signature
  64 € + 279 €, netto, vorläufig laut Z. 7 und Z. 16).
- **B2C:** die Einstiegsseite für Hauseigentümer (Startseite, Ansicht „Hauseigentümer“, docs/GESTALTUNG.md Z. 192): Messen, Fotos und
  3-D-Modell kostenlos, Aufmaßblatt als PDF 7,99 € als Einführungspreis bis 17.11.2026, danach 12,99 € (`web/index.html` Z. 61,
  `web/config.js` Z. 12–14).

Die Vorgaben des Inhabers (`.claude/skills/premium-gestaltung/SKILL.md`, `designrichtung.md`) sind Anforderungen. Wo Forschung und
Vorgabe in Spannung stehen, steht das in Abschnitt 10 als Prüfaufgabe, nicht als Gegenvorschlag.

## 0. Methode, Kennzeichnung, Grenzen

**Recherche.** Websuche (WebSearch) zu den neun Themenfeldern des Auftrags. Der Abruf einzelner Seiten (WebFetch, curl) war in dieser
Umgebung gesperrt (DNS-Fehler bzw. Proxy-Antwort 403 für nngroup.com). Alle Angaben stammen deshalb aus Suchergebnissen: Abstracts,
Verlags- und Repositoriumsseiten, Pressemitteilungen und Sekundärquellen. **Kein Volltext wurde gelesen.** Effektstärken, Stichproben
und Jahreszahlen stehen nur, wo die Suche sie zeigte; was nur aus Sekundärquellen kommt, ist markiert.

**Kennzeichnung je Erkenntnis**

| Marke | Bedeutung |
|---|---|
| [Empirisch] | kontrollierte Studie, Metaanalyse oder peer-reviewte Arbeit; Art und Stichprobe, soweit gefunden |
| [Forschungsbasierte Praxis] | Nielsen Norman Group (NN/g), Baymard, große Feldtests, Normen wie WCAG |
| [Branchenpraxis/Meinung] | Fallberichte, Anbieter- und Beratungsstudien, Einzeltests, Meinungen |

**Status je Quelle** (Quellenverzeichnis, Abschnitt 12): **A** = Abstract oder Verlags-/Repositoriumsseite über die Suche gesehen;
**S** = nur über Sekundärquelle (Presse, Blog, Zusammenfassung); **N** = nicht verifiziert (Angabe konnte nicht bestätigt werden).

**Hypothesen.** Jede Konsequenz für B2B und B2C ist eine Hypothese. Keine der zitierten Studien untersucht Fensterbauer, Fenster-
Konfiguratoren oder Hauseigentümer beim Fensteraufmaß. Die Übertragung ist in jedem Fall eine Annahme.

**Lücke im Bestand.** Im Repository fand ich keine Einrichtung für A/B-Tests. Die eigene Statistik zählt Gerätearten
(`functions/api/statistik.js` Z. 57–59, Z. 173) und zeigt Trichter in der Zentrale (`web/assets/zentrale.js` Z. 289, Z. 326–328; B2C:
App geöffnet → Kasse geöffnet → Aufmaßblatt gekauft). Einen Trichter für die Verkaufsseite der Pakete (Aufruf → Frage → Bestellung)
fand ich dort nicht.

## 1. Kurzfassung: die zehn belastbarsten Punkte

| # | Aussage | Evidenz | Folge (Hypothese) |
|---|---|---|---|
| 1 | Aufmerksamkeit fällt nach dem ersten Bildschirm stark ab; rund drei Viertel der Betrachtungszeit liegen in den ersten zwei Bildschirmhöhen. | [Forschungsbasierte Praxis] W-01 | Kernaussage, Paketzugang und Preissignal in die ersten zwei Telefon-Bildschirme. |
| 2 | Visuelle Komplexität senkt den ersten Eindruck, der in 17–500 ms entsteht; Erstbewertungen sagen spätere Urteile über Vertrauen voraus. | [Empirisch] W-04 | „Ein Held je Bildschirm“ (Designrichtung) ist forschungskonform; Zusatzelemente kosten. |
| 3 | Dekorative, nicht zielbezogene Details verschlechtern Verstehen; zielbezogene Hervorhebung hilft. | [Empirisch] W-03 | Detailreichtum am Hauptobjekt ja, zusätzliche Elemente nein. |
| 4 | Bewegungsbeginn zieht Aufmerksamkeit unwillkürlich an; animierte Werbung stört Suche und wird schlechter erinnert. | [Empirisch] W-07, W-08 | Dauerbewegung neben Text konkurriert mit der Botschaft; Bewegung an den Inhalt binden. |
| 5 | Animation hilft dem Verstehen, wenn sie den Gegenstand darstellt (Abläufe, Handgriffe), kaum als Schmuck. | [Empirisch] W-09 | Konfigurator-Abläufe animieren, Schmuckschleifen meiden. |
| 6 | „Zu viel Auswahl“ ist kein allgemeiner Effekt; er hängt von Komplexität, Präferenzunsicherheit und Aufgabe ab. | [Empirisch] W-12 | Drei Pakete sind unkritisch; kritisch ist die Zahl der Merkmale im Vergleich. |
| 7 | Mittlere Optionen werden robust häufiger gewählt; Voreinstellungen wirken stark, aber heterogen. | [Empirisch] W-13, W-17 | „Empfohlen“ und Start beim empfohlenen Paket wirken wahrscheinlich; begründen statt drängen. |
| 8 | Spät aufgedeckte Kosten führen zu Unzufriedenheit; Zusatzkosten sind der häufigste Abbruchgrund im Handel. | [Empirisch] W-16, [Forschungsbasierte Praxis] W-23 | B2C: Preis des Aufmaßblatts vor dem Messen sichtbar halten. |
| 9 | Ladezeit wirkt auf Abbruch und Umsatz; große Feldtests zeigen Effekte schon bei Zehntelsekunden. | [Forschungsbasierte Praxis] W-21 | Premium-Effekte nur nachgeladen; Budget aus der Designrichtung einhalten. |
| 10 | WCAG 2.2 verlangt für automatisch laufende Bewegung über 5 s neben anderem Inhalt eine Möglichkeit zum Anhalten (Stufe A). | [Forschungsbasierte Praxis · Norm] W-26 | Laufleisten und Meldungsstapel brauchen einen sichtbaren Anhalten-Mechanismus oder ein Ende. |

## 2. UX Research und HCI

### W-01 Aufmerksamkeit über die Seitenlänge

**Befund.** In einer Eyetracking-Auswertung der NN/g (2018) lagen rund 57 % der Betrachtungszeit oberhalb der ersten Bildschirmkante
und rund 74 % in den ersten zwei Bildschirmhöhen; 2010 waren es noch rund 80 % oberhalb der Kante. Der steile Abfall nach der Kante
blieb gleich. Grundlage laut Sekundärquelle: über 130.000 Fixationen von 120 Teilnehmenden an 1920 × 1080 [Q28].
**Evidenz.** [Forschungsbasierte Praxis]. Status S (Zahlen aus Zusammenfassungen; die NN/g-Seite war nicht abrufbar).
**Gegenbefunde und Grenzen.** Kurze Seiten und Abbrüche erhöhen den Anteil oben rechnerisch; es handelt sich um Schreibtisch-Bildschirme.
Ein Einzelfall aus der Branchenpraxis berichtet bei einer langen Verkaufsseite mehr Abschlüsse mit der Handlungsaufforderung am Ende
(+304 %), allerdings mit geändertem Text zugleich [Q64, Status N].
**Hypothese B2B.** Die Abschnittsfolge der Verkaufsseite führt erst nach Idee, Ablauf, Anfrage-Inhalt und zwei Bildbändern zu den
Paketen (docs/GESTALTUNG.md Z. 447). Wer nicht auf „Pakete ansehen“ tippt, erreicht Preise erst spät. Ein frühes Preissignal (etwa
„ab … im Monat“ im ersten oder zweiten Telefon-Bildschirm) erhöht die Zahl der Besucher, die Pakete überhaupt sehen. Die Pakete selbst
können weiter unten stehen.
**Hypothese B2C.** Hero, Einstieg in die App und Preis des Aufmaßblatts gehören in die ersten zwei Telefon-Bildschirme; was danach
kommt (Ratgeber, Erklärungen), wird von einem kleinen Teil gelesen und trägt die Entscheidung kaum.

### W-02 Scanning-Muster und Informationshierarchie

**Befund.** NN/g beschrieb 2006 das F-Muster beim Lesen von Webtext und präzisierte es 2017 (Jahr aus der Suche erschlossen): Das F
ist nicht das einzige Muster (weitere: Schichtkuchen, gefleckt, markierend, überspringend, verbindlich), es entsteht vor allem bei
Textflächen ohne Gliederung und lässt sich durch Gestaltung vermeiden [Q29].
**Evidenz.** [Forschungsbasierte Praxis], Eyetracking. Status A (Artikelseite über Suche), Details S.
**Gegenbefunde und Grenzen.** Ein grobes Muster, keine pixelgenaue Regel; die Grundstudien sind älter und am Schreibtisch entstanden.
**Hypothese B2B.** Fensterbauer überfliegen. Abschnittsüberschriften mit genau einer Aussage, ein hervorgehobenes Wort (Markenregel
„ein grünes Wort je Überschrift“, docs/GESTALTUNG.md Abschnitt „Schrift“) und kurze Absätze unterstützen das Schichtkuchen-Muster:
Wer nur Überschriften liest, muss das Angebot verstehen.
**Hypothese B2C.** Gleich; zusätzlich: der erste Satz jedes Abschnitts trägt die Aussage, weil die linke Kante am meisten gelesen wird.

### W-03 Kognitive Last, Kohärenz und Hervorhebung

**Befund.** Die Theorie der kognitiven Last (Sweller 1988) beschreibt ein begrenztes Arbeitsgedächtnis [Q31]. Eine Übersicht über
29 Reviews mit 1.189 Studien und 78.177 Teilnehmenden (Noetel et al. 2022) fand robuste Belege unter anderem für Hervorhebung
(Signaling), räumliche und zeitliche Nähe von Bild und Text und für Kohärenz, also das Weglassen verführerischer Details [Q32]. Die
Metaanalyse von Rey (2012) zum Effekt verführerischer Details: interessante, aber zielfremde Inhalte verschlechtern das Lernen, vor
allem wenn sie bildlich sind (Effektgrößen nur aus Sekundärquellen) [Q33]. Eine neuere Metaanalyse (58 Studien, über 7.500
Lernende) bestätigt die Richtung (Pressemitteilung) [Q33].
**Evidenz.** [Empirisch], Metaanalysen, Lernkontext. Status A (Noetel, Sweller), S (Rey-Effektgrößen, Folgestudie).
**Gegenbefunde und Grenzen.** Forschung zum Lernen, nicht zum Kaufen. Eine Studie von 2025 fand bei kontrolliertem Inhalt keinen
messbaren Effekt von Multimedia-Gestaltung [Q32, Sekundärhinweis, N].
**Hypothese B2B.** „Detailreichtum“ (SKILL.md Z. 47) wirkt, solange die Details am Hauptobjekt sitzen (Material, Licht, Maßlinie am
Fenster) und keine zusätzlichen Blickziele schaffen. Schwebende Nebenobjekte (Papierflieger, Handy, Bleistift im Startbild,
docs/GESTALTUNG.md Z. 447) sind zielfremd im Sinne der Forschung; ihr Nutzen für die Marke ist plausibel, ihr Preis ist Aufmerksamkeit.
Messen statt annehmen.
**Hypothese B2C.** Im Einstieg vor dem Messen ist die Last ohnehin hoch (unbekannte Aufgabe). Je weniger Nebenelemente im ersten
Bildschirm, desto eher der Schritt in die App.

### W-04 Erster Eindruck, Komplexität, Prototypikalität

**Befund.** Urteile über die visuelle Anziehung einer Website entstehen in 50 ms und stimmen mit Urteilen nach längerer Betrachtung
überein (Lindgaard et al. 2006) [Q34]. Visuelle Komplexität wirkt schon bei 17 ms; geringe Komplexität und hohe Prototypikalität
(sieht aus wie eine typische Seite ihrer Art) wurden als besonders ansprechend bewertet (Tuch et al. 2012, Studie 1: 119 Screenshots)
[Q35]. Modelle aus Farbigkeit und Komplexität erklären rund die Hälfte der Varianz im Ersturteil nach 500 ms (Reinecke et al. 2013,
450 Websites, 548 Freiwillige); der erste Eindruck beeinflusst spätere Urteile über Bedienbarkeit und Vertrauenswürdigkeit [Q36].
**Evidenz.** [Empirisch], Laborexperimente und Online-Studien. Status A.
**Gegenbefunde und Grenzen.** Die Übertragung „Ersturteil → Glaubwürdigkeit“ ist bei Lindgaard eine Deutung der Presse [Q34]. Bei
Tuch ist der Effekt der Prototypikalität bei 17 ms schwächer.
**Hypothese B2B.** Der Inhaber will nicht wie ein „Baukasten-Muster“ wirken (SKILL.md Z. 39). Prototypikalität heißt aber nicht
Baukasten: Erwartete Orte (Logo oben links, Preise bei den Paketen, Kontakt im Fuß) können bleiben, während Bildsprache und Licht den
Unterschied tragen. Hohe Neuartigkeit in der Struktur (unerwartete Navigation, ungewohnte Bedienung) kostet beim Ersturteil.
**Hypothese B2C.** Gleiches gilt verstärkt für Hauseigentümer, die eeziframes nicht kennen.

### W-05 Ästhetik und wahrgenommene Bedienbarkeit

**Befund.** Bei einem Geldautomaten-Simulator beeinflusste die Ästhetik die Urteile über Schönheit und Bedienbarkeit nach der
Nutzung, die tatsächliche Bedienbarkeit nicht (Tractinsky et al. 2000) [Q37].
**Gegenbefund.** In einem Laborversuch mit 80 Teilnehmenden und vier Shop-Varianten änderte die Ästhetik die wahrgenommene
Bedienbarkeit nicht; schlechte Bedienbarkeit senkte dagegen das Urteil über die Ästhetik, vermittelt über Frust (Tuch et al. 2012) [Q38].
**Evidenz.** [Empirisch]. Status A.
**Hypothese B2B.** Hochwertige Gestaltung ist Voraussetzung für das Ziel des Inhabers („Fensterbauer soll merken, dass eeziframes
Webdesign beherrscht“, SKILL.md Z. 38–39), schützt aber nicht vor Abwertung, wenn etwas hakt (ruckelnde Bewegung, verdeckte Knöpfe,
langes Laden). Bei einem Produkt, das selbst eine Website-Komponente ist, wird jede Störung zum Produktbeleg.
**Hypothese B2C.** Ein Fehler im ersten Messschritt wirkt auf das Urteil über die ganze Marke zurück.

### W-06 Progressive Disclosure und Antwortzeiten

**Befund.** Progressive Disclosure (seltene oder fortgeschrittene Inhalte auf eine zweite Ebene verlegen) verbessert laut Nielsen
Erlernbarkeit, Effizienz und Fehlerrate, wenn die erste Ebene das Wichtige enthält [Q30]. Eine Sekundärquelle hält fest, dass es
kaum kontrollierte Studien zur Wirksamkeit gibt [Q30]. Antwortzeiten: 0,1 s wirkt unmittelbar, 1 s hält den Gedankenfluss, ab etwa
10 s geht die Aufmerksamkeit verloren (Nielsen 1993 nach Miller 1968 und Card et al. 1991) [Q39].
**Evidenz.** [Forschungsbasierte Praxis]. Status S (Progressive Disclosure: NN/g-Original nicht abrufbar), A (Antwortzeiten).
**Bezug Bestand.** Die App setzt Progressive Disclosure bereits um: drei Planungstiefen mit 17, 30 und 49 Fragen bei einem
dreiflügeligen Fenster, Vorgabe die mittlere, „Mehr zu …“ je Kapitel (docs/GESTALTUNG.md Z. 169–176). Die Verkaufsseite zeigt den
Merkmalsvergleich als aufklappbares Element (Z. 454) und klappt Leistungen am Telefon zu (Z. 452).
**Hypothese B2B.** Die drei Planungstiefen sind ein Verkaufsargument (Kunden steigen ohne Überforderung ein) und gehören sichtbar
auf die Verkaufsseite; Belege dafür: W-12, W-30.
**Hypothese B2C.** Rückmeldung unter 0,1 s bei jeder Wahl im Modell; jede Wartezeit über 1 s mit sichtbarem Zwischenstand (deckt sich
mit SKILL.md Z. 31–32: „keine Wartezeiten ohne sichtbares Zwischenergebnis“).

## 3. Visual Attention Research

### W-07 Bewegung zieht Aufmerksamkeit, auch gegen den Willen

**Befund.** Nicht Bewegung an sich, sondern ihr Beginn fängt Aufmerksamkeit, auch wenn sie keine Information trägt (Abrams & Christ
2003) [Q42]. Werbebanner wurden kaum erinnert, verlängerten aber Suchzeiten; animierte Banner wurden schlechter erinnert als statische
Gegenstücke (Burke et al. 2005) [Q41]. In Experimenten mit bezahlten Online-Arbeitern führten störende Anzeigen zu früherem Abbruch;
die am stärksten störenden Anzeigen waren laut Sekundärquelle alle animiert (Goldstein et al. 2013) [Q43].
**Evidenz.** [Empirisch], Laborexperimente (Abrams), Experimente mit Suchaufgaben (Burke), Online-Feldexperiment (Goldstein). Status A,
Einzelzahlen zu Goldstein S.
**Gegenbefunde und Grenzen.** Spätere Arbeiten zeigen Bewegungsbeginn als Fänger nur, wenn nicht zugleich ein neues Objekt erscheint
[Q42, Sekundärhinweis]. Die Studien betreffen Werbung, nicht Produktbewegung.
**Hypothese B2B.** Der Meldungsstapel im Startbild (alle 3,4 s fällt eine neue Meldung ein, docs/GESTALTUNG.md Z. 447) und die
Laufleisten (Dauerschleife, Z. 451) setzen wiederholt neue Bewegungsanfänge neben Überschrift und Handlungsaufforderung. Nach der
Forschung zieht jeder Einfall den Blick vom Text ab. Prüfen: Endet der Stapel nach wenigen Meldungen, steigt die Lesezeit der
Überschrift? Die Designrichtung verlangt ohnehin „Schleifen nur mit Reaktion“ und die Ein-Drittel-Regel (designrichtung.md Z. 142,
Z. 148).
**Hypothese B2C.** Im Einstieg keine Dauerbewegung neben dem Startknopf; Bewegung als Antwort auf eine Handlung (Modell dreht sich bei
Berührung) stört die Entscheidung nicht.

### W-08 Banner-Blindheit

**Befund.** Nutzer meiden Bereiche, die wie Werbung aussehen: Lage (oben, rechte Spalte), werbetypische Optik einschließlich Animation
und Nähe zu Werbung lösen das Wegsehen aus, auch bei Inhalten, die keine Werbung sind (NN/g, „Banner Blindness Revisited“, Datum laut
Suche 2018, nicht verifiziert) [Q40]. Burke et al. zeigen den Effekt im Experiment [Q41].
**Evidenz.** [Forschungsbasierte Praxis] (NN/g), [Empirisch] (Burke). Status S bzw. A.
**Hypothese B2B.** Die beiden Leisten unter dem Startbild sind bewusst „wie die Logoleisten anderer Seiten“ (SKILL.md Z. 121,
docs/GESTALTUNG.md Z. 451): bandförmig, bewegt, über die volle Breite. Genau diese Merkmale lösen Banner-Blindheit aus. Inhalte der
Cream-Leiste (etwa „3–5 Werktage bis zum Livegang“, „0 € Gebühr je Anfrage“) sollten deshalb an anderer Stelle statisch wiederkehren,
wenn sie für die Entscheidung zählen.
**Hypothese B2C.** Der Einführungspreis steht nur im Band ganz oben (docs/GESTALTUNG.md, Tabelle „Wortspiel“). Ein Band am oberen
Rand ist ein typischer Ort für Banner-Blindheit; der Preis steht zusätzlich im Text (`web/index.html` Z. 61). Ob er im ersten
Bildschirm außerhalb des Bands sichtbar ist, ist zu prüfen.

### W-09 Animation erklärt, wenn sie den Gegenstand zeigt

**Befund.** Metaanalyse über 26 Studien mit 76 Vergleichen: Animation schlägt statische Bilder im Mittel mit d = 0,37; darstellende
Animation (zeigt den Gegenstand) d = 0,40; realistische Darstellung (z. B. Video) d = 0,76; für Handlungswissen d = 1,06 (Höffler &
Leutner 2007) [Q47]. Eine spätere Metaanalyse fand einen kleineren Gesamteffekt (g = 0,226) [Q47, Fundstelle nicht eindeutig
verifiziert].
**Evidenz.** [Empirisch], Metaanalysen, Lernkontext. Status A.
**Hypothese B2B.** Bewegung, die den Konfigurator vorführt (Flügel öffnet, Raffstore fährt, Maßlinie zeichnet sich), ist durch die
Forschung gedeckt und passt zu „Bewegung mit Sinn“ (SKILL.md Z. 45). Bewegung ohne Darstellungsbezug (gleichförmiges Schweben, Wiegen
der Zeichnungen in der Leiste, Z. 451) hat diese Deckung nicht.
**Hypothese B2C.** Ein kurzer, realistischer Ablauf „Foto → Maß → Modell → Blatt“ erklärt den Messvorgang besser als Text. Der
Inhaber lehnt eine bestimmte Umsetzung davon ab („Handy zu Briefumschlag“, SKILL.md Z. 125); die Forschung spricht für das Prinzip,
nicht für diese Umsetzung.

### W-10 Parallaxe und Tiefe beim Scrollen

**Befund.** Studie mit 86 Teilnehmenden: Eine Parallaxe-Website verbesserte weder Bedienbarkeit noch Zufriedenheit noch das
Gesamterlebnis; signifikant besser war „Spaß“ (je nach Fassung zusätzlich „professionelles Design“) (Frederick et al. 2015) [Q48].
Laut Anbieter-Blog hatten zwei Teilnehmende Übelkeit und deutliche Bedienprobleme [Q48, Status S].
**Evidenz.** [Empirisch], Zwischen-Gruppen-Vergleich, studentische Stichprobe. Status A.
**Hypothese B2B.** Tiefe und Parallaxe (SKILL.md Z. 43–44, designrichtung.md Z. 152–165) sind als Markenbeweis vertretbar, aber kein
Hebel für Verständnis oder Abschluss. Sie brauchen die ruhige Fassung (SKILL.md Z. 62) und müssen bei „weniger Bewegung“ vollständig
abschalten (W-26).
**Hypothese B2C.** Gleich.

### W-11 Bilder, Gesichter, Blickrichtung

**Befund.** NN/g-Eyetracking (um 2010, Datum nicht verifiziert): große, rein dekorative Wohlfühlbilder werden übersprungen; Bilder von
Produkten und echten Menschen werden als Inhalt betrachtet [Q45]. In einer Eyetracking-Studie lenkte ein Gesicht mit abgewandtem Blick
mehr Aufmerksamkeit auf Banner, Text und Produkt und verbesserte die Erinnerung; direkter Blick band die Aufmerksamkeit am Gesicht
(Sajjacholapunt & Ball 2014) [Q44].
**Evidenz.** [Forschungsbasierte Praxis] (NN/g), [Empirisch] (Sajjacholapunt & Ball; laut späterer Arbeit einzige Studie zu sozialen
Hinweisen in Bannern). Status S bzw. A.
**Hypothese B2B.** Die Bildwelt (Astronaut oder Tier tut Menschliches am Fenster, docs/GESTALTUNG.md Abschnitt „Bildsprache“) erzählt
die Aussage und ist kein Stockfoto; sie kann trotzdem als „dekorativ“ gelesen werden. Produktbeweis tragen echte Bildschirme und
Renderings aus dem Konfigurator, wie der Inhaber selbst fordert (SKILL.md Z. 41–42). Wo eine Figur im Bild ist, sollte ihr Blick
oder ihre Handlung zur Botschaft oder zum Knopf zeigen (Astronaut misst am Bullauge: Blick auf die Maßlinie, Z. 450).
**Hypothese B2C.** Gleiches Prinzip; das Modell des eigenen Fensters ist das stärkste Bild, weil es Produkt und Ergebnis zugleich ist.

## 4. Entscheidungspsychologie

### W-12 Choice Overload: Befund und Gegenbefunde

**Befund.** Im Probierstand-Versuch kauften mehr Kunden, wenn 6 statt 24 Marmeladen angeboten wurden (Iyengar & Lepper 2000) [Q1].
**Gegenbefund 1.** Metaanalyse über 63 Bedingungen aus 50 Experimenten (N = 5.036): mittlerer Effekt praktisch null, große Streuung;
keine hinreichenden Bedingungen gefunden (Scheibehenne et al. 2010) [Q2]. Eigene Wiederholungsversuche fanden den Effekt nicht [Q1,
Sekundärhinweis].
**Gegenbefund 2.** Metaanalyse über 99 Beobachtungen (N = 7.202): Der Effekt ist signifikant, sobald vier Moderatoren berücksichtigt
werden: Komplexität des Angebots, Schwierigkeit der Aufgabe, Unsicherheit der Präferenz, Entscheidungsziel (Chernev et al. 2015) [Q3].
**Evidenz.** [Empirisch], Feldexperiment und zwei Metaanalysen mit gegenteiligem Schwerpunkt. Status A (Metaanalysen), S (Jam-Studie).
**Hypothese B2B.** Drei Pakete sind keine große Auswahl. Last entsteht durch Merkmalsfülle (die Vergleichstabelle aus `MERKMALE` in
`web/assets/pakete.js` Z. 70 ff.) und durch Präferenzunsicherheit: Ein Fensterbauer weiß vor dem Kauf nicht, ob er Dashboard,
neutrale Absender oder Einladungslinks braucht. Hilfe: wenige Unterscheidungsmerkmale je Paket nennen, Vergleich zugeklappt lassen
(Bestand, Z. 454), Fragen „Welches Paket passt?“ beantworten.
**Hypothese B2C.** Die App fragt rund 90 Dinge ab (docs/GESTALTUNG.md Z. 171). Die Moderatoren nach Chernev sind hier hoch
(unbekannte Fachbegriffe, unsichere Präferenzen). Der Bestand antwortet bereits mit „Weiß ich noch nicht“, „Standard des
Fensterbauers“ und drei Tiefen (README.md Z. 3, docs/GESTALTUNG.md Z. 173–176); die Einstiegsseite kann genau das versprechen:
„Sie müssen nicht alles wissen.“

### W-13 Mitte, Kompromiss, Decoy

**Befund Kompromisseffekt.** Metaanalyse über 142 Beobachtungen: Mittlere Optionen werden signifikant häufiger gewählt; die Stärke
schwankt je nach Methode um das Dreifache. Schwächer bei reinen Preis-Qualitäts-Abwägungen, stärker bei mehr Abwägungsdimensionen,
nicht-numerischen Merkmalen und nützlichen (utilitaristischen) Produkten (Neumann et al. 2016) [Q8].
**Befund Mitte im Blick.** In Eyetracking-Studien (Studie 1: 67 Studierende, 4 ausgeschlossen) fiel der erste Blick auf die Mitte,
und vor der Entscheidung nahm die Aufmerksamkeit auf die mittlere Option zu; nur diese Zunahme sagte die Wahl voraus. Eine
Offline-Studie bestätigte die Bevorzugung der Mitte (Atalay et al. 2012) [Q9].
**Befund Decoy.** Eine asymmetrisch dominierte Zusatzoption erhöht den Anteil der dominierenden Option (Huber et al. 1982, 153
Studierende) [Q4].
**Gegenbefunde Decoy.** Der Effekt trat überwiegend nur bei rein numerisch beschriebenen Optionen auf; bei Bildern oder erlebten
Produkten kaum (Frederick et al. 2014) [Q5]. 91 Versuche ergaben nur 11 verlässliche Effekte; Beschreibungen und Bilder verkleinerten
ihn (Yang & Lynn 2014) [Q6]. Die Erstautoren halten den Effekt unter den Originalbedingungen für robust (Huber et al. 2014) [Q7].
**Evidenz.** [Empirisch]. Status A.
**Bezug Bestand.** Keine der drei Paketoptionen ist von einer anderen dominiert (Preise und Merkmale steigen gemeinsam, `pakete.js`
Z. 43–66). Ein Decoy liegt also nicht vor. Plus steht am Schreibtisch in der Mitte, ist als „Empfohlen“ markiert, und am Telefon beginnt
die Wischreihe bei Plus (docs/GESTALTUNG.md Z. 452, `web/assets/verkauf.js` Z. 335).
**Hypothese B2B.** Mitte, Markierung und Startposition wirken gleichgerichtet auf Plus. Nach Neumann et al. ist der Kompromisseffekt
bei vielen nicht-numerischen Merkmalen (Logo, Farbe, Fotos) eher stark. Einen Decoy einzubauen ist nach den Gegenbefunden wenig
aussichtsreich und widerspräche der Ehrlichkeitsregel (SKILL.md Z. 49). Offene Frage an den Inhaber: Woraus begründet sich „Empfohlen“?
Eine sichtbare Begründung ist ehrlicher als die Markierung allein.
**Hypothese B2C.** Nicht anwendbar (ein Produkt, ein Preis).

### W-14 Anker und Reihenfolge der Preise

**Befund.** Erste Zahlen ziehen spätere Schätzungen an (Tversky & Kahneman 1974) [Q11]. Der klassische Ankereffekt replizierte im
Many-Labs-Projekt (36 Stichproben, 6.344 Teilnehmende) [Q12]. Bei Preisen: absteigende Reihenfolge führte zu teureren Wahlen,
aufsteigende zu günstigeren; Voraussetzung war, dass Käufer Preis und Qualität verknüpfen (Suk et al. 2012) [Q10].
**Gegenbefund.** Eine Replikation zu zufälligen Ankern (Zahlungsbereitschaft) fand schwächere Effekte (Maniadis et al. 2014); ob das
eine gescheiterte Replikation ist, ist umstritten [Q13].
**Evidenz.** [Empirisch]. Status A (Tversky & Kahneman nur Zusammenfassung, Many Labs nur Sekundär bestätigt: S).
**Hypothese B2B.** Die Pakete stehen aufsteigend (`pakete.js` Z. 18: essential, plus, signature). Am Telefon beginnt die Reihe bei Plus,
damit ist Essential nicht der erste Anker. Am Schreibtisch liest man von links: Essential zuerst. Eine absteigende Anordnung ist eine
testbare Variante, aber nur sinnvoll, wenn Fensterbauer höhere Pakete als höherwertig wahrnehmen; das ist bei unterschiedlichen
Merkmalen wahrscheinlich. Zahlen in der Kennzahlen-Leiste („0 € Gebühr je Anfrage“) setzen ebenfalls Anker.
**Hypothese B2C.** Der Einführungspreis nennt den späteren Preis gleich mit („danach 12,99 €“, `web/index.html` Z. 61); das ist ein
offener Referenzpreis. Er wirkt nur, wenn er wahr ist; das ist hier im Code belegt (`web/config.js` Z. 14).

### W-15 Verlustaversion

**Befund.** Metaanalyse über 607 Schätzungen aus 150 Artikeln: mittlerer Verlustaversionskoeffizient 1,955 (95 %-Intervall 1,82–2,10)
(Brown et al. 2024) [Q14].
**Gegenbefund.** Gal & Rucker (2018) argumentieren in einer Übersichtsarbeit, dass Verluste im Allgemeinen nicht stärker wirken als
Gewinne; Kommentatoren stimmen zu, dass Verlustaversion weniger gesichert ist als angenommen [Q15].
**Evidenz.** [Empirisch], Metaanalyse vs. Übersichtsarbeit mit Gegenposition. Status A.
**Hypothese B2B.** Eine Verlustformulierung („Anfragen, die Ihnen entgehen“) ist nicht sicher wirksamer als eine Gewinnformulierung
und kann bei Fensterbauern als Druck wirken. Es gibt keine Zahlen im Repository, die einen Verlust belegen würden; ohne Beleg wäre
eine Verlustbehauptung eine erfundene Angabe (SKILL.md Z. 49). Verlustrahmen nur mit belegbarem Inhalt (etwa Anfahrt zum Erstaufmaß,
Eyebrow „Das Erstaufmaß kommt zu Ihnen“, docs/GESTALTUNG.md Tabelle „Wortspiel“).
**Hypothese B2C.** Gleiches; „Einführungspreis endet am …“ ist ein wahrer Verlustrahmen und reicht.

### W-16 Preisaufteilung und spät aufgedeckte Kosten

**Befund.** Metaanalyse über 149 Beobachtungen aus 27 Arbeiten (N = 12.878): Aufgeteilte Preise werden günstiger beurteilt als
Gesamtpreise, wenn der Gesamtpreis fehlt, wenn der Aufschlag in der Kategorie üblich ist, wenn er als nützlich gilt und bei
nützlichen Produkten (Abraham & Hamilton 2018; Autorenschaft auf der Artikelseite nicht direkt bestätigt) [Q24]. Werden optionale
Gebühren erst spät gezeigt, wählen Käufer häufiger eine scheinbar günstige Option, bleiben trotz höherem Gesamtpreis dabei und sind
unzufriedener (Santana et al. 2020, sechs Experimente) [Q25].
**Evidenz.** [Empirisch]. Status A (Abraham & Hamilton: Autoren N).
**Hypothese B2B.** Jedes Paket hat Monatspreis und Einrichtung (`pakete.js` Z. 44, 52, 60). Die Einrichtung wird eher akzeptiert,
wenn sichtbar ist, wofür sie steht (Domain, Gestaltung, Livegang in 3–5 Werktagen, docs/BESTELLUNG.md Z. 30) und wenn sie neben dem
Monatspreis steht, nicht erst in der Bestellung. Der Bestand nennt beide in der Karte (docs/GESTALTUNG.md Z. 452).
**Hypothese B2C.** Messen ist kostenlos, bezahlt wird am Ende für das Blatt. Nach Santana et al. ist das unkritisch, solange der Preis
vor dem Aufwand bekannt ist; erfährt jemand ihn erst an der Paywall, wirkt das wie eine spät aufgedeckte Gebühr (Unzufriedenheit,
Abbruch, Vertrauensverlust). Der Preis gehört in den Einstieg, nicht nur ins Band.

### W-17 Voreinstellungen (Default-Effekt)

**Befund.** Länder mit Widerspruchslösung hatten weit höhere Zustimmungsraten zur Organspende (Johnson & Goldstein 2003) [Q19].
Metaanalyse über 58 Studien (N = 73.675): Voreinstellungen verschieben Entscheidungen um rund d = 0,63–0,68, mit sehr großer
Heterogenität (Jachimowicz et al. 2019) [Q20]. Unter den Nudges wirken Eingriffe in die Struktur der Wahl (darunter Voreinstellungen)
am stärksten (Mertens et al. 2022, Gesamteffekt d = 0,45) [Q21].
**Gegenbefunde.** Nach Korrektur für Publikationsverzerrung bleibt für Nudges insgesamt kein Beleg (Maier et al. 2022) [Q22]; andere
schätzen den bereinigten Effekt auf d = 0,08 bis 0,31 und nennen Voreinstellungen als Ausnahme mit verlässlicher Wirkung (Szaszi et al.
2022) [Q23].
**Evidenz.** [Empirisch], Metaanalysen und Reanalysen. Status A (Johnson & Goldstein: S).
**Hypothese B2B.** Zwei Ebenen: (1) Auf der Verkaufsseite ist Plus faktisch voreingestellt (W-13). (2) Im Produkt setzt der Betrieb
selbst Voreinstellungen: „Standard des Fensterbauers“ und „Vorgabe des Betriebs“ für die Planungstiefe (docs/GESTALTUNG.md Z. 176,
Z. 182). Nach Levav et al. (W-30) verändern Voreinstellungen im Konfigurator, was Kunden bestellen. Das ist ein belegbares
Verkaufsargument, sofern diese Funktion in den Paketen enthalten ist; ob „Vorgabe des Betriebs“ auch in den Instanzen gilt, ist eine
offene Frage.
**Hypothese B2C.** Die mittlere Tiefe ist Vorgabe (Z. 173). Das senkt Abbrüche wahrscheinlich, ohne die Wahl zu nehmen.

### W-18 Risikoumkehr: Garantien, Rückgabe, Vorführung

**Befund.** Geld-zurück-Garantien wirken neben der kognitiven Risikosenkung über eine positive Gefühlsreaktion und erhöhen Kaufabsicht
und Zahlungsbereitschaft (zwei Experimente, Suwelack et al. 2011) [Q16]. Metaanalyse über rund 21–22 Studien: Großzügige
Rückgaberegeln erhöhen Käufe und, schwächer, Rückgaben (Janakiraman et al. 2016; nur über Presse und zitierende Arbeit) [Q17].
Vorführungen und Garantien sind zwei Mechanismen gegen Unsicherheit, die sich ergänzen oder ersetzen (Heiman et al. 2001; nur
bibliografisch, Studienart nicht verifiziert) [Q18]. Interaktive Produktvorführung erzeugt Vorstellungsbilder der eigenen Nutzung und
erhöht die Kaufabsicht stärker als dieselbe Information passiv (Schlosser 2003, vier Experimente) [Q54].
**Evidenz.** [Empirisch]. Status A (Suwelack, Schlosser), S (Janakiraman), N (Heiman: Inhalt).
**Bezug Bestand.** Im Repository gibt es keine Geld-zurück-Garantie. Belegt sind: Monatsabo ohne Mindestlaufzeit, kündbar zum
Monatsende (`web/konfigurator-bedingungen/index.html` Z. 69, Entwurf zur anwaltlichen Prüfung), und „Konfigurator ausprobieren“ ohne
Konto (`web/fuer-fensterbauer/index.html` Z. 63 und Z. 210). Live-Demos je Paket sind angekündigt, aber noch nicht da
(`functions/pakete-seite.js` Z. 171).
**Hypothese B2B.** Die stärksten belegbaren Risikosenker sind die Kündbarkeit zum Monatsende und das Ausprobieren. Beide gehören
sichtbar an die Paketkarten. Eine Garantie darf nicht erfunden werden; ob die Einrichtungsgebühr bei früher Kündigung erstattet wird,
ist offen.
**Hypothese B2C.** Der Einstieg ist risikoarm (Messen kostenlos, ohne Konto, README.md Z. 3). Das ist die Risikoumkehr; sie gehört in
den ersten Bildschirm.

### W-19 Knappheit und Dringlichkeit

**Befund.** Metaanalyse über 416 Effektgrößen aus 131 Studien: Welche Knappheit wirkt, hängt vom Produkt ab; zeitliche Knappheit wirkt
am besten bei Produkten mit hoher Beteiligung (Barton et al. 2022) [Q26]. Eine Untersuchung von rund 11.000 Shops fand 393
Countdown-Timer, teils mit Angeboten, die nach Ablauf weiter galten (Mathur et al. 2019) [Q27].
**Evidenz.** [Empirisch] (Metaanalyse; deskriptive Großerhebung). Status A.
**Hypothese B2B.** Kein Knappheitsdruck: weder Fristen noch Kontingente sind im Repository für Pakete belegt. „Vorläufige Preise“
(`web/fuer-fensterbauer/index.html` Z. 174) ist das Gegenteil von Dringlichkeit; ob es die Anfragebereitschaft senkt, ist unbekannt.
**Hypothese B2C.** Der Einführungspreis endet wirklich am 17.11.2026 (`web/config.js` Z. 14). Ein schlichter Hinweis mit Datum ist
ehrlich; ein laufender Countdown wäre nach Mathur et al. ein typisches Dringlichkeitsmuster und widerspräche „Fein, nicht laut“
(SKILL.md Z. 48). Nach dem Stichtag muss der Hinweis verschwinden (der Code sieht das vor: `web/assets/portal.js` Z. 442).

## 5. Vertrauen und Glaubwürdigkeit

### W-20 Wie Besucher Glaubwürdigkeit beurteilen

**Befund.** 2.684 Personen beurteilten Websites; das „Aussehen“ wurde in 46,1 % der Kommentare genannt, danach
Informationsstruktur und Informationsfokus (Fogg et al. 2003) [Q49]. NN/g nennt vier Faktoren: Gestaltungsqualität, offene
Vorabinformation (Preise, Kontakt), umfassende und aktuelle Inhalte, Verbindung zum übrigen Netz (Belege Dritter) [Q50].
Metaanalyse über 150 Studien: Vertrauen hängt mit wahrgenommenem Datenschutz und Servicequalität zusammen und führt zu Loyalität und
Wiederkaufabsicht; die Zusammenhänge sind subtiler als angenommen (Kim & Peterson 2017) [Q51]. B2B-Nutzer suchen vor allem Preise;
wo Leistungen individuell sind, empfiehlt NN/g Beispielpreise für typische Fälle; Kontaktangaben werden erwartet und nicht hinter
Formularen versteckt (NN/g, B2B-Bericht auf Basis von 293 B2B-Websites) [Q52].
**Evidenz.** [Empirisch] (Fogg: Online-Feldstudie; Kim & Peterson: Metaanalyse), [Forschungsbasierte Praxis] (NN/g). Status A (Fogg,
Kim & Peterson), S (NN/g-Inhalte).
**Gegenbefunde und Grenzen.** Fogg zählt Kommentare, nicht Personen; Sekundärquellen geben die 46,1 % falsch als Personenanteil wieder.
**Bezug Bestand.** Preise stehen offen (Stärke). Schwächen nach dem Repository: Rechtstexte sind Entwürfe, E-Mail und Telefon „folgen“
(README.md, Tabelle „Aufbau“, Zeile Rechtstexte); die Auffindbarkeit ist gesperrt, bis Impressum und Datenschutz fertig sind (README.md
Z. 5); Belege Dritter (Kunden, Bewertungen) gibt es nicht und dürfen nicht erfunden werden (SKILL.md Z. 49, designrichtung.md Z. 200).
**Hypothese B2B.** Ohne Kundenstimmen tragen verifizierbare Belege das Vertrauen: echte Demo, echtes Beispiel-Aufmaßblatt, offene
Vertragsbedingungen als PDF (`/konfigurator-bedingungen/`), vollständige Kontaktdaten, Antwortversprechen („in der Regel innerhalb
eines Werktags“, `functions/pakete-seite.js` Z. 194). Die Miniatur eines Aufmaßblatts zeigt „erfundene Beispielwerte“
(docs/GESTALTUNG.md Z. 447); sie muss als Beispiel erkennbar sein.
**Hypothese B2C.** Für Hauseigentümer zählen Datenschutz (Fotos vom eigenen Haus) und Kontakt. Der Hinweis, wer die Fotos sieht und
wann sie gelöscht werden (README.md, Zeile `fotos.js`), ist ein Vertrauensinhalt für den Einstieg.

### W-21 B2B-Käufer informieren sich selbst

**Befund.** Nach Gartner verbringen B2B-Käufer etwa 17 % der Kaufzeit mit Anbietergesprächen, verteilt auf alle Anbieter (2018) [Q53].
Nach Google/BCG (2017) beeinflusst Mobilnutzung bei führenden B2B-Unternehmen mehr als 40 % des Umsatzes, rund die Hälfte der
B2B-Suchanfragen kam vom Telefon [Q77].
**Evidenz.** [Branchenpraxis/Meinung]: Umfragen von Beratungsunternehmen, Methodik nicht offen, nicht peer-reviewt. Status S bzw. A
(BCG-Seite).
**Hypothese B2B.** Die Verkaufsseite muss die Entscheidung ohne Gespräch tragen können: Preise, Ablauf bis Livegang, Vertrag,
Demo. Das Anfrageformular ist Ergänzung, nicht Voraussetzung. Gilt besonders, solange die Bestellung noch nicht freigeschaltet ist
(`functions/pakete-seite.js` Z. 196).

## 6. Conversion Rate Optimization

### W-22 Ladezeit und Abschluss

**Befund.** Google gibt an, dass die Absprungwahrscheinlichkeit um 32 % steigt, wenn die Ladezeit von 1 auf 3 s wächst (Jahr und
Methode nicht verifiziert) [Q55]. Eine von Google beauftragte Deloitte-Auswertung (37 Marken, Europa, rund 30 Mio. Sitzungen, 2020)
fand bei 0,1 s schnelleren mobilen Seiten 8,4 % mehr Abschlüsse im Handel; Bedingung war, dass jede Seite des Weges in vier Maßen
um 0,1 s schneller wurde [Q56]. Vodafone: A/B-Test mit 50/50-Aufteilung, optisch und funktional gleiche Seiten, LCP 31 % besser,
8 % mehr Verkäufe (web.dev 2021) [Q57]. Bing-Experimente zu künstlicher Verzögerung (Kohavi et al. 2013): die oft zitierte Zahl von
0,6 % Umsatz je 100 ms konnte ich nicht bestätigen [Q59, N].
**Schwellen.** Core Web Vitals am 75. Perzentil: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 [Q58].
**Evidenz.** [Forschungsbasierte Praxis] (Vodafone-Feldtest, Core Web Vitals), [Branchenpraxis/Meinung] (Google-Statistik,
Deloitte-Auftragsstudie, korrelativ). Status A bzw. N.
**Gegenbefunde und Grenzen.** Alle Zahlen aus dem Handel mit hohem Volumen; für B2B-Software mit wenigen Besuchern keine Daten
gefunden.
**Hypothese B2B.** Premium-Effekte (WebGL, Bildfolgen, Staub) kosten Ladezeit und Rechenzeit. Das Budget der Designrichtung (erster
Bildschirm am Telefon höchstens 300 KB Bilder, WebGL erst bei Annäherung laden, designrichtung.md Z. 167) deckt sich mit der Forschung.
INP ≤ 200 ms ist für den eingebetteten Konfigurator als Verkaufsbeleg wichtig: Er ist das Produkt.
**Hypothese B2C.** Der Weg Startseite → App ist ein Trichter (W-01); jede Zehntelsekunde zwischen Tipp und erstem Messbildschirm zählt.

### W-23 Formulare

**Befund.** Eyetracking-Experiment (N = 65): Formulare nach 20 Richtlinien wurden schneller ausgefüllt, brauchten weniger
Absendeversuche und weniger Blickbewegungen, Zufriedenheit stieg; am stärksten bei schlechten Ausgangsformularen (Seckler et al.
2014) [Q60]. Prüfung bei der Eingabe statt beim Absenden: +22 % erfolgreiche Abschlüsse, −42 % Zeit, −22 % Fehler (Wroblewski 2009,
Usability-Test mit 22 Personen) [Q61]. Baymard: Die Zahl der Felder beeinflusst die Bedienbarkeit stärker als die Zahl der Schritte;
auch freiwillige Felder erzeugen Reibung [Q62]. Zusatzkosten sind laut Baymard-Umfrage (2024, 1.012 Erwachsene in den USA) für 48 %
der häufigste Abbruchgrund; „Gesamtkosten nicht vorab sichtbar“ nannten 2023 17 % [Q63].
**Evidenz.** [Empirisch] (Seckler), [Forschungsbasierte Praxis] (Wroblewski, Baymard). Status A bzw. S.
**Bezug Bestand.** Anfrageformular mit Name, Firma (freiwillig), E-Mail, Telefon (freiwillig), Paket, Text (`functions/pakete-seite.js`
Z. 177–182); Fehler werden beim Absenden am Feld gezeigt (docs/GESTALTUNG.md Z. 455).
**Hypothese B2B.** Sechs Felder sind wenig. Zwei freiwillige Felder und ein Pflicht-Freitext erhöhen die Hürde. Variante: Pflicht nur
E-Mail und Paket, Freitext freiwillig; Prüfung beim Verlassen des Feldes. Die spätere Bestellung im Kundenkonto darf bereits
eingegebene Angaben nicht erneut verlangen (WCAG 3.3.7, W-26).
**Hypothese B2C.** Gemessen wird ohne Konto (README.md Z. 3); das hält die Formular-Hürde vor dem Wert niedrig. Die Paywall ist der
eigentliche Formularmoment: E-Mail und Code, kein Passwort (README.md Z. 3) entspricht der Forschung.

### W-24 Handlungsaufforderungen

**Befund.** Für Farbe, Text und Lage von Knöpfen fand ich keine belastbare peer-reviewte Evidenz. Die Praxisregeln (Verb plus
Gegenstand statt „Senden“ oder „OK“, Text muss ohne Umfeld verständlich sein) stammen aus Gestaltungssystemen und Blogs, die NN/g
zitieren [Q65]. Die Lagefrage (oben oder nach der Erklärung) beruht auf Einzelfällen [Q64].
**Evidenz.** [Branchenpraxis/Meinung]. Status S bzw. N.
**Hypothese B2B.** Die Knöpfe „Pakete ansehen“, „Konfigurator ausprobieren“, „Frage senden“ (`web/fuer-fensterbauer/index.html`
Z. 63, Z. 226) folgen der Praxisregel. Wirksamkeitsunterschiede nur über eigene Messung klärbar. Die Markenregel „eine Cream-Pille je
Bildschirm“ (docs/GESTALTUNG.md Z. 456) setzt eine klare Hierarchie und passt zu W-03 (Hervorhebung).
**Hypothese B2C.** Ein eindeutiger Startknopf; „Aufmaß fortsetzen“ bei begonnenem Aufmaß (Z. 192) ist ein guter, belegbarer Zustand.

## 7. Usability und Accessibility

### W-25 Kontraste der Markenfarben

**Befund.** WCAG 2.2: Text mindestens 4,5:1, großer Text 3:1 (1.4.3); Bedienelemente und bedeutungstragende Grafik mindestens 3:1
gegen angrenzende Farben (1.4.11), der Wert ist eine harte Schwelle [Q70]. Helle Schrift auf dunklem Grund (negative Polarität)
schnitt bei Sehschärfe und Korrekturlesen schlechter ab als dunkle Schrift auf hellem Grund, bei Jüngeren und Älteren (Piepenbrock et
al. 2013) [Q75].
**Evidenz.** [Forschungsbasierte Praxis · Norm] (WCAG), [Empirisch] (Piepenbrock). Status A.
**Eigene Berechnung** (WCAG-Formel, Werte aus `web/assets/gemeinsam.css` Z. 10–16):

| Vordergrund | auf #161616 | auf #1f1f1f | auf #262626 | Anforderung |
|---|---|---|---|---|
| Schrift #f3f2ee | 16,15:1 | 14,71:1 | 13,51:1 | 4,5:1 erfüllt |
| Nebentext #c9c8c3 | 10,80:1 | 9,84:1 | 9,03:1 | erfüllt |
| Label #93928d | 5,81:1 | 5,29:1 | 4,85:1 | erfüllt, auf #262626 knapp |
| Grün #8fd694 | 10,53:1 | 9,59:1 | 8,80:1 | erfüllt |
| Linie #2b2b2b | 1,28:1 | 1,16:1 | – | 3:1 nicht erfüllt, wo bedeutungstragend |
| Linie 2 #3a3a3a | 1,59:1 | 1,45:1 | – | 3:1 nicht erfüllt, wo bedeutungstragend |

**Hypothese B2B und B2C.** Textkontraste sind gut. Prüfpunkt: Die Formularfelder der Verkaufsseite haben als Umriss nur einen Ring in
#3a3a3a auf Grund #161616 (`web/assets/verkauf.css` Z. 131, rund 1,6:1). Ist dieser Umriss das einzige Merkmal, das ein Feld als Feld
erkennbar macht, verfehlt er 1.4.11; ob die Beschriftung darüber genügt, ist zu prüfen. Kartenränder sind Schmuck und fallen nicht
darunter. Glas-Meldungen über dem Foto (60 % Deckkraft, docs/GESTALTUNG.md Z. 450) haben keinen festen Hintergrund; ihr Kontrast muss
am ungünstigsten Bildausschnitt gemessen werden. Wegen der negativen Polarität der Marke (verbindlich, docs/GESTALTUNG.md „Farbe“)
spricht die Forschung für kurze Texte, was ohnehin Vorgabe ist (SKILL.md Z. 29).

### W-26 Bewegung, Anhalten, vestibuläre Störungen

**Befund.** WCAG 2.2.2 (Stufe A): Bewegung, die automatisch startet, länger als 5 s läuft und neben anderem Inhalt steht, braucht eine
Möglichkeit zum Anhalten, Beenden oder Ausblenden [Q69]. Ob die Systemeinstellung „weniger Bewegung“ allein genügt, ist nicht
geklärt; sie ist keine dokumentierte ausreichende Technik, die dokumentierten Techniken sind Bedienelemente auf der Seite [Q69]. WCAG
2.3.3 (Stufe AAA): durch Interaktion ausgelöste Bewegung abschaltbar; als Beispiel nennt die W3C ausdrücklich Parallaxe und
scrollgebundene Bewegung, die Schwindel, Übelkeit und Kopfschmerz auslösen kann [Q68]. In einer US-Erhebung zeigten 35,4 % der
Erwachsenen ab 40 Hinweise auf eine vestibuläre Funktionsstörung (5.086 Personen, mit dem Alter stark steigend) (Agrawal et al. 2009)
[Q71].
**Evidenz.** [Forschungsbasierte Praxis · Norm] (WCAG), [Empirisch] (Agrawal; Status S, Zahlen aus Sekundärquellen).
**Gegenbefunde und Grenzen.** Vestibuläre Dysfunktion im Gleichgewichtstest ist nicht dasselbe wie Empfindlichkeit für Bildschirm-
bewegung; die Zahl gibt eine Größenordnung der betroffenen Altersgruppe, keinen Anteil Betroffener unter Besuchern.
**Bezug Bestand.** Laufleisten in Dauerschleife, Meldungsstapel mit neuer Meldung alle 3,4 s, Lottie-Zeichen als Schleife
(docs/GESTALTUNG.md Z. 447–451). Bei „weniger Bewegung“ stehen sie, mit der Maus wird eine Leiste langsamer; einen sichtbaren
Anhalten-Knopf fand ich nicht (Z. 451; `web/assets/verkauf.js` stoppt Schleifen nur außerhalb des Bildes, Z. 171–186).
**Hypothese B2B.** Um 2.2.2 sicher zu erfüllen: Bewegung endet nach höchstens 5 s oder hat ein Bedienelement zum Anhalten. Das ist mit
„fein, nicht laut“ vereinbar (etwa ein kleiner Pausenknopf in der Technikstimme). Ein Grund für die Sorgfalt: Fensterbauer-Inhaber sind
häufig in der Altersgruppe ab 40 (Annahme, im Repository nicht belegt).
**Hypothese B2C.** Gleich; im Konfigurator ist die Bewegung des Modells Antwort auf eine Wahl (2.3.3) und hat bei „weniger Bewegung“
bereits eine Fassung (docs/GESTALTUNG.md Abschnitt „Bewegung“).

### W-27 Zielgrößen, Ziehen, verdeckter Fokus

**Befund.** WCAG 2.2 (Empfehlung seit 5.10.2023, neun neue Kriterien) [Q66]: 2.5.8 Zielgröße mindestens 24 × 24 CSS-px (AA), mit
Ausnahmen für Abstand [Q66]; 2.5.5 empfiehlt 44 × 44 (AAA). 2.5.7 Ziehbewegungen brauchen eine Alternative mit einfachem Zeigen (AA).
2.4.11 Fokus darf nicht vollständig von eigenem Inhalt verdeckt sein; typisches Problem sind klebende Kopfzeilen (AA) [Q67]. Für
einhändige Daumenbedienung empfahlen Parhi et al. (2006) Ziele um 9,2 mm (Einzelwahl) bzw. 9,6 mm (Folgen) [Q73]. Beobachtungen
zum Halten von Telefonen: 49 % einhändig, 36 % gestützt, 15 % zweihändig, unter Personen, die den Bildschirm berührten (Hoober 2013,
1.333 Beobachtungen) [Q74].
**Evidenz.** [Forschungsbasierte Praxis · Norm] (WCAG), [Empirisch] (Parhi), [Forschungsbasierte Praxis] (Hoober, Feldbeobachtung,
Status S für die Verteilung).
**Bezug Bestand.** Ziele ab 44 px (SKILL.md Z. 71) erfüllen 2.5.8 und 2.5.5. Die Paketreihe am Telefon wird gewischt; darunter erlaubt
eine Namensleiste das Antippen (docs/GESTALTUNG.md Z. 452, `verkauf.js` Z. 384), das erfüllt 2.5.7 voraussichtlich. Die Kopfzeile klebt
(docs/GESTALTUNG.md Z. 189, Z. 428).
**Hypothese B2B.** Prüfpunkt 2.4.11: Beim Tabben durch das Anfrageformular darf die klebende Kopfzeile (am Telefon mit eigener Zeile
für den Umschalter) kein fokussiertes Feld ganz verdecken. Hauptknöpfe im Daumenbereich (untere Bildschirmhälfte) sind bei
einhändiger Nutzung leichter erreichbar.
**Hypothese B2C.** Gleich; der Einstieg in die App wird häufig einhändig erfolgen.

### Rahmen: Barrierefreiheitsstärkungsgesetz (keine Forschung)

Nach Sekundärquellen (IHK, Händlerbund) gilt das BFSG seit 28.06.2025 für Dienstleistungen im elektronischen Geschäftsverkehr mit
Verbrauchern; reine B2B-Angebote und Kleinstunternehmen (unter 10 Beschäftigte und höchstens 2 Mio. € Umsatz oder Bilanzsumme), die
Dienstleistungen erbringen, sind ausgenommen [Q72]. Ob der Verkauf des Aufmaßblatts an Hauseigentümer darunter fällt und ob die
Ausnahme greift, ist eine Rechtsfrage (offene Frage 4). WCAG-Konformität ist unabhängig davon die Messlatte des Inhabers für
Qualität.

## 8. Produktkonfiguratoren und Mass Customization

### W-28 Selbst gestaltet ist mehr wert

**Befund.** Uhren-Experimente (vier Studien, 717 Teilnehmende, 267 gestalteten selbst): Die Zahlungsbereitschaft für selbst
gestaltete Uhren lag weit über der für Standarduhren gleicher Technik, berichtet wird ein Wertzuwachs um 100 % (Franke & Piller 2004)
[Q79]. Fünf Studien: Selbst Gestaltetes erzielt höhere Zahlungsbereitschaft auch nach Abzug von Passgenauigkeit und Aufwand,
vermittelt über das Gefühl, etwas geschafft zu haben (Franke et al. 2010) [Q80].
**Evidenz.** [Empirisch]. Status A.
**Gegenbefunde und Grenzen.** Untersucht an Uhren, T-Shirts und ähnlichen Produkten mit Gestaltungsspielraum; Fenster sind stark
technisch und durch Bauvorschriften begrenzt. Ob der Effekt bei einer Anfrage (nicht beim Kauf) auftritt, ist offen.
**Hypothese B2B.** Ein Argument, warum Endkunden des Fensterbauers selbst planen wollen („Kunden planen selbst“ ist ein Haken-Chip,
docs/GESTALTUNG.md Z. 447). Aber: Der Inhaber will „Kunden messen selbst“ nicht als Hauptaussage (SKILL.md Z. 24–25). Die Forschung
stützt eher die Aussage „Anfragen von Kunden, die ihr Fenster schon vor Augen haben“ als ein Verkaufsargument für den Betrieb; ob das
höhere Abschlüsse beim Fensterbauer bedeutet, ist nicht untersucht.
**Hypothese B2C.** Das 3-D-Modell des eigenen Fensters erzeugt das Gefühl der Urheberschaft; es gehört früh in den Einstieg.

### W-29 Komplexität, Startlösungen, Art der Konfiguration

**Befund.** Die Gestaltung des Konfigurators verändert den erreichten Nutzen und die empfundene Komplexität; Komplexität senkt den
Nutzen, Experten empfinden weniger Komplexität (Dellaert & Stremersch 2005, PC-Konfiguration) [Q81]. Startlösungen (erst ein
vorbereitetes Produkt wählen, dann anpassen) senkten in neun Studien die Komplexität, erhöhten die Zufriedenheit und führten zu
reicher ausgestatteten, teureren Produkten (Hildebrand et al. 2014) [Q83]. Konfiguration Merkmal für Merkmal führte häufiger zu
Kompromissoptionen, weniger empfundener Schwierigkeit und höherer Zufriedenheit als die Wahl ganzer Alternativen (Valenzuela et al.
2009) [Q84].
**Evidenz.** [Empirisch]. Status A.
**Bezug Bestand.** „Gestaltung übernehmen“ (gespeicherte Gestaltungen mit einem Tippen, README.md Z. 3), Detailtiefe mit Vorgabe,
Kapitel in fester Reihenfolge (docs/GESTALTUNG.md Z. 173–175).
**Hypothese B2B.** „Gestaltung übernehmen“ ist eine Startlösung im Sinne von Hildebrand et al. und damit ein belegbares Argument
für höherwertige Anfragen. Eine Startlösung, die der Betrieb vorgibt (sein Standardfenster), wäre die direkte Umsetzung; ob es sie
gibt, ist offen.
**Hypothese B2C.** Einstieg über ein vorbereitetes Fenster (etwa „typisches Dreh-Kipp-Fenster“) statt leerer Auswahl senkt die
Hürde; Belege W-29, W-12.

### W-30 Reihenfolge und Voreinstellungen im Konfigurator

**Befund.** Feldexperimente mit Maßanzügen und Autos: Die Reihenfolge der Merkmale veränderte, was konfiguriert und gekauft wurde,
vor allem darüber, ob Käufer die Voreinstellung des Herstellers annahmen; beim Auto betraf das Ausstattung und Preis (Levav et al.
2010) [Q82].
**Evidenz.** [Empirisch], natürliche Feldexperimente. Status A (Einzelheiten der Autostudie N).
**Hypothese B2B.** Für den Fensterbauer heißt das: Wer Voreinstellungen und Reihenfolge festlegt, beeinflusst, was angefragt wird.
Das ist ein starkes, forschungsgestütztes Verkaufsargument, sofern Betriebe in den Paketen Voreinstellungen setzen können (offene
Frage 3). Ethische Grenze: Voreinstellungen müssen zum Kunden passen (Johnson & Goldstein nennen Fehlzuordnungen als Kosten) [Q19].
**Hypothese B2C.** Die feste Kapitelfolge „erst was es ist, dann woraus, dann was dazukommt“ (docs/GESTALTUNG.md Z. 175) ist
konsistent mit der Forschung; teure Zusatzfragen nach vielen einfachen Wahlen werden häufiger mit der Voreinstellung beantwortet.

### W-31 Konfiguratoren beim Anbieter: Durchlaufzeit

**Befund.** Untersuchung in 14 auftragsbezogen konstruierenden Unternehmen: Angebotsdurchlaufzeiten sanken mit Konfiguratoren um bis
zu 99,9 %, im Mittel geschätzt um 85,5 %; nur sechs Fälle lieferten Schätzungen tatsächlicher Verkürzung, und die Literatur ist
überwiegend auf Erfolge ausgerichtet (Haug, Hvam & Mortensen 2011; Autoren und Jahr aus der Suche, nicht vollständig verifiziert)
[Q85].
**Evidenz.** [Empirisch], Fallstudien mit Schätzungen. Status S.
**Gegenbefunde und Grenzen.** Interne Konfiguratoren für Vertrieb und Konstruktion, nicht kundenseitige Web-Konfiguratoren;
Fensterbauer wurden nicht untersucht.
**Hypothese B2B.** Ein Argument „schneller zum Angebot“ ist plausibel, aber nur mit eigenen Daten der Betriebe belegbar. Die
Zentrale zählt „Vom Projekt zum Auftrag“ (`web/assets/zentrale.js` Z. 289); Zeitangaben bis zum Angebot fand ich dort nicht. Bis
dahin keine Zahl nennen.
**Hypothese B2C.** Nicht anwendbar.

## 9. Mobile Nutzung

### W-32 Lesen und Nutzen am Telefon

**Befund.** NN/g (2016, nach Sekundärquelle): Textverständnis am Telefon entsprach dem am Schreibtisch (Artikel mit 400 und 990
Wörtern), gelesen wurde etwas langsamer; eine Studie sechs Jahre zuvor fand schlechteres Verständnis am Telefon [Q76]. Andere
Sekundärquellen nennen widersprüchliche Zahlen [Q76, N]. Anteil mobiler Seitenaufrufe in Deutschland nach StatCounter: je nach
Momentaufnahme 2026 zwischen rund 44 % und 61 %; die Werte schwanken zu stark für eine Aussage [Q78, N].
**Evidenz.** [Forschungsbasierte Praxis] (NN/g, Status S), [Branchenpraxis/Meinung] (StatCounter).
**Bezug Bestand.** Der Inhaber setzt das Telefon (390 × 844) als Hauptansicht (SKILL.md Z. 28). Die eigene Statistik erfasst Telefon,
Tablet und Schreibtisch (`functions/api/statistik.js` Z. 57–59).
**Hypothese B2B.** Die Annahme „Fensterbauer kommen am Telefon“ ist nach BCG (W-21) plausibel, aber mit der eigenen Statistik für
`/fuer-fensterbauer/` zu prüfen; Vergleich und Formular werden vermutlich eher am Schreibtisch genutzt. Beides muss am Telefon
vollständig gehen.
**Hypothese B2C.** Gemessen wird am Fenster mit dem Telefon; der Einstieg ist mobil zu denken. Lange Texte sind am Telefon nicht
schlechter verstanden, aber langsamer gelesen: kurz halten.

## 10. Spannungsfelder zwischen Forschung und Vorgaben des Inhabers

Die Vorgaben gelten. Die folgenden Punkte sind Prüfaufgaben für Phase D und später, damit die Vorgaben ohne Nachteil umgesetzt werden.

| Vorgabe (Quelle) | Forschung | Prüfaufgabe |
|---|---|---|
| Bewegung mit Tiefe, Physik, Reaktion aufs Scrollen (SKILL.md Z. 43–46) | Bewegungsbeginn lenkt ab (W-07); Parallaxe verbessert Bedienbarkeit nicht (W-10); Animation hilft, wenn sie darstellt (W-09); WCAG 2.2.2 und 2.3.3 (W-26) | Bewegung an Gegenstand oder Handlung binden; Dauerbewegung mit Ende oder Pause; ruhige Fassung vollständig |
| Leisten wie Logoleisten anderer Seiten (SKILL.md Z. 121) | Bandform, Bewegung und Lage lösen Banner-Blindheit aus (W-08) | Entscheidungsrelevante Inhalte der Leisten zusätzlich statisch zeigen |
| Detailreichtum, Mikrodetails (SKILL.md Z. 47) | Zielfremde Details kosten Verständnis; Komplexität senkt Ersturteil (W-03, W-04) | Details am Hauptobjekt, keine zusätzlichen Blickziele; Zahl der Elemente je Bildschirm zählen |
| Dunkle Bühne (docs/GESTALTUNG.md „Farbe“) | Negative Polarität liest sich schlechter (W-25) | Kurze Texte, Schriftgröße 17 für Lesetext halten, Kontraste wie berechnet |
| Bildwelt mit Astronaut und Tieren (docs/GESTALTUNG.md „Bildsprache“) | Dekorative Bilder werden übersprungen, Produktbilder betrachtet (W-11) | Produktbeweis durch echte Konfigurator-Bilder; Blickrichtung der Figur zur Botschaft |
| „Empfohlen“, Start beim empfohlenen Paket (docs/GESTALTUNG.md Z. 452) | Mitte, Voreinstellung und Kompromiss wirken gleichgerichtet (W-13, W-17) | Begründung der Empfehlung sichtbar machen; Wirkung messen |
| Keine erfundenen Belege (SKILL.md Z. 49) | Vertrauen braucht Belege Dritter (W-20) | Verifizierbare Ersatzbelege: Demo, Beispielblatt, Vertrag, Kontakt |

## 11. Messbare Hypothesen für die spätere Prüfung

Ohne A/B-Test-Einrichtung (Abschnitt 0) bleiben Vorher-nachher-Vergleiche mit der eigenen Statistik. Vorschlag für Kennzahlen, die
die Statistik schon erfasst oder leicht erfassen könnte (Umsetzung ist nicht Teil dieser Phase):

1. B2B: Anteil der Aufrufe von `/fuer-fensterbauer/` nach Gerät (vorhanden: Gerätearten).
2. B2B: Aufrufe → Frage gesendet → Bestellung angelegt (Trichter fehlt in der Zentrale, siehe Abschnitt 0).
3. B2B: Anteil der Anfragen je Paket im Formularfeld „Paket“ (prüft W-13).
4. B2C: App geöffnet → Kasse geöffnet → gekauft (vorhanden, `web/assets/zentrale.js` Z. 326) vor und nach Änderungen an der
   Preissichtbarkeit (prüft W-16).
5. Beide: LCP und INP am 75. Perzentil auf einem mittleren Android-Telefon (prüft W-22; SKILL.md Z. 61).

## 12. Offene Fragen

1. Worauf stützt sich die Markierung „Empfohlen“ für EEZI Essential Plus, und soll die Begründung auf der Seite stehen?
2. Wird die Einrichtungsgebühr bei Kündigung im ersten Monat erstattet? Ohne Angabe darf keine Risikoumkehr über die Kündbarkeit
   hinaus behauptet werden.
3. Können Betriebe in den Paketen (Instanzen) Voreinstellungen setzen („Standard des Fensterbauers“, „Vorgabe des Betriebs“,
   Startfenster)? docs/GESTALTUNG.md Z. 182 beschreibt das für „Mein Betrieb · Einladungsseite“ im Betriebsbereich; für Instanzen fand
   ich keine Aussage.
4. Gilt das BFSG für den Verkauf des Aufmaßblatts, und greift die Ausnahme für Kleinstunternehmen? Rechtsfrage.
5. Wann sind E-Mail und Telefon in Impressum und Rechtstexten vollständig? Vertrauensfaktor laut W-20.
6. Gibt es einen Zeitplan für die Freischaltung der Bestellung und das Ende der „Vorläufigen Preise“? Beides beeinflusst die
   Handlungsaufforderung der Seite.
7. Soll ein Trichter für die Verkaufsseite in der eigenen Statistik ergänzt werden (Abschnitt 11, Punkt 2)?

## 13. Quellenverzeichnis

Status: **A** Abstract, Verlags- oder Repositoriumsseite über Suche gesehen · **S** nur Sekundärquelle · **N** nicht verifiziert.
Kein Volltext gelesen (Abschnitt 0).

**Entscheidungspsychologie**

- [Q1] Iyengar, S. S. & Lepper, M. R. (2000). When Choice is Demotivating: Can One Desire Too Much of a Good Thing? Journal of
  Personality and Social Psychology (Band und Seiten N). Zusammenfassung: https://acawiki.org/When_Choice_is_Demotivating:_Can_One_Desire_Too_Much_of_a_Good_Thing%3F ;
  zur Replikation: https://www.psychologicalscience.org/observer/being-choosy-about-choosing — S
- [Q2] Scheibehenne, B., Greifeneder, R. & Todd, P. M. (2010). Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice
  Overload. Journal of Consumer Research 37(3), 409–425. https://ideas.repec.org/a/oup/jconrs/v37y2010i3p409-425.html — A
- [Q3] Chernev, A., Böckenholt, U. & Goodman, J. (2015). Choice Overload: A Conceptual Review and Meta-Analysis. Journal of Consumer
  Psychology 25(2), 333–358. https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual — A
- [Q4] Huber, J., Payne, J. W. & Puto, C. (1982). Adding Asymmetrically Dominated Alternatives: Violations of Regularity and the
  Similarity Hypothesis. Journal of Consumer Research 9(1), 90–98. https://andrewclark.super.site/all-media/adding-asymmetrically-dominated-alternatives-violations-of-regularity-and-the-similarity-hypothesis — S
- [Q5] Frederick, S., Lee, L. & Baskin, E. (2014). The Limits of Attraction. Journal of Marketing Research 51, 487–507.
  https://marketing.wharton.upenn.edu/wp-content/uploads/2016/10/The-Limits-of-Attraction.pdf — A
- [Q6] Yang, S. & Lynn, M. (2014). More Evidence Challenging the Robustness and Usefulness of the Attraction Effect. Journal of
  Marketing Research 51(4), 508–513. https://ecommons.cornell.edu/entities/publication/0c5b506a-f8d3-4a4c-8825-b2c715e9f956 — A
- [Q7] Huber, J., Payne, J. W. & Puto, C. (2014). Let's Be Honest About the Attraction Effect. Journal of Marketing Research 51(4),
  520–525. https://scholars.duke.edu/publication/1045479 — A
- [Q8] Neumann, N., Böckenholt, U. & Sinha, A. (2016). A meta-analysis of extremeness aversion. Journal of Consumer Psychology 26(2),
  193–212. https://www.kellogg.northwestern.edu/academics-research/research/detail/2016/a-meta-analysis-of-extremeness-aversion — A
- [Q9] Atalay, A. S., Bodur, H. O. & Rasolofoarison, D. (2012). Shining in the Center: Central Gaze Cascade Effect on Product Choice.
  Journal of Consumer Research 39(4), 848–866. https://hal.archives-ouvertes.fr/hal-01947459 — A
- [Q10] Suk, K., Lee, J. & Lichtenstein, D. R. (2012). The Influence of Price Presentation Order on Consumer Choice. Journal of
  Marketing Research 49(5), 708–717. https://vivo.colorado.edu/display/pubid_59904 — A
- [Q11] Tversky, A. & Kahneman, D. (1974). Judgment under Uncertainty: Heuristics and Biases. Science 185, 1124–1131.
  https://andrewclark.super.site/all-media/judgment-under-uncertainty-heuristics-and-biases — S
- [Q12] Klein, R. A. et al. (2014). Investigating variation in replicability: A „Many Labs“ replication project (Zeitschrift N).
  https://research.tilburguniversity.edu/en/publications/investigating-variation-in-replicability-a-many-labs-replication-/ ;
  Ankereffekt als repliziert: https://forrt.org/flora-replication-atlas/doi/10.1177/01461672952111004/ — S
- [Q13] Maniadis, Z., Tufano, F. & List, J. A. (2014). One Swallow Doesn't Make a Summer: New Evidence on Anchoring Effects. American
  Economic Review 104(1), 277–290. https://eprints.nottingham.ac.uk/31360 ; Kritik: https://datacolada.org/archives/tag/anchoring — A
- [Q14] Brown, A. L., Imai, T., Vieider, F. M. & Camerer, C. F. (2024). Meta-analysis of Empirical Estimates of Loss Aversion. Journal
  of Economic Literature 62(2), 485–516. https://www.aeaweb.org/doi/10.1257/jel.20221698 — A
- [Q15] Gal, D. & Rucker, D. D. (2018). The Loss of Loss Aversion: Will It Loom Larger Than Its Gain? Journal of Consumer Psychology
  28(3), 497–516. https://papers.ssrn.com/abstract=3049660 — A
- [Q16] Suwelack, T., Hogreve, J. & Hoyer, W. D. (2011). Understanding Money-Back Guarantees: Cognitive, Affective, and Behavioral
  Outcomes. Journal of Retailing 87(4), 462–478. https://ideas.repec.org/a/eee/jouret/v87y2011i4p462-478.html — A
- [Q17] Janakiraman, N., Syrdal, H. A. & Freling, R. (2016). The Effect of Return Policy Leniency on Consumer Purchase and Return
  Decisions: A Meta-analytic Review. Journal of Retailing. https://news.utdallas.edu/?p=11491 (Pressemitteilung) — S
- [Q18] Heiman, A., McWilliams, B. & Zilberman, D. (2001). Demonstrations and money-back guarantees: market mechanisms to reduce
  uncertainty. Journal of Business Research 54(1), 71–84. https://ideas.repec.org/a/eee/jbrese/v54y2001i1p71-84.html — A (nur
  bibliografisch, Inhalt N)
- [Q19] Johnson, E. J. & Goldstein, D. (2003). Do Defaults Save Lives? Science 302(5649), 1338–1339.
  https://thedecisionlab.com/insights/health/can-defaults-save-lives-the-power-of-default-options-on-life-saving-decisions — S
- [Q20] Jachimowicz, J. M., Duncan, S., Weber, E. U. & Johnson, E. J. (2019). When and why defaults influence decisions: a
  meta-analysis of default effects. Behavioural Public Policy 3(2), 159–186.
  https://ideas.repec.org/a/cup/bpubpo/v3y2019i02p159-186_00.html — A
- [Q21] Mertens, S., Herberz, M., Hahnel, U. J. J. & Brosch, T. (2022). The effectiveness of nudging: A meta-analysis of choice
  architecture interventions across behavioral domains. PNAS. https://archive-ouverte.unige.ch/unige:159958 — A
- [Q22] Maier, M., Bartoš, F., Stanley, T. D., Shanks, D. R., Harris, A. J. L. & Wagenmakers, E.-J. (2022). No evidence for nudging
  after adjusting for publication bias. PNAS. https://pmc.ncbi.nlm.nih.gov/articles/PMC9351501 — A
- [Q23] Szaszi, B. et al. (2022). No reason to expect large and consistent effects of nudge interventions. PNAS.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC9351519 — A
- [Q24] Abraham, A. T. & Hamilton, R. W. (2018). When Does Partitioned Pricing Lead to More Favorable Consumer Preferences?
  Meta-Analytic Evidence. Journal of Marketing Research. https://journals.sagepub.com/doi/10.1177/0022243718800724 — A (Autoren N)
- [Q25] Santana, S., Dallas, S. K. & Morwitz, V. G. (2020). Consumer Reactions to Drip Pricing. Marketing Science 39(1), 188–210.
  https://business.columbia.edu/faculty/research/consumer-reactions-drip-pricing — A
- [Q26] Barton, B., Zlatevska, N. & Oppewal, H. (2022). Scarcity tactics in marketing: A meta-analysis of product scarcity effects on
  consumer purchase intentions. Journal of Retailing 98(4), 741–758.
  https://research.bond.edu.au/en/publications/scarcity-tactics-in-marketing-a-meta-analysis-of-product-scarcity/ — A
- [Q27] Mathur, A. et al. (2019). Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites. ACM CSCW 2019.
  https://arxiv.org/pdf/1907.07032 — A

**UX Research und HCI**

- [Q28] Nielsen Norman Group (2018, Autor nicht ausgewiesen). Scrolling and Attention. https://www.nngroup.com/articles/scrolling-and-attention/ — S
- [Q29] Nielsen Norman Group / Pernice, K. (2017, Jahr erschlossen). F-Shaped Pattern of Reading on the Web: Misunderstood, But Still
  Relevant (Even on Mobile). https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ — A
- [Q30] Nielsen, J. (2006). Progressive Disclosure. Nielsen Norman Group. https://www.nngroup.com/articles/progressive-disclosure/
  (nicht abrufbar); Zusammenfassung: https://brajeshwar.com/2006/progressive-disclosure-by-jakob-nielsen-usability-expert/ ;
  Hinweis auf fehlende Studien: https://thedecisionlab.com/reference-guide/design/progressive-disclosure — S
- [Q31] Sweller, J. (1988). Cognitive Load During Problem Solving: Effects on Learning. Cognitive Science 12(2), 257–285.
  https://doi.org/10.1207/s15516709cog1202_4 — A
- [Q32] Noetel, M. et al. (2022). Multimedia Design for Learning: An Overview of Reviews With Meta-Meta-Analysis. Review of
  Educational Research 92(3), 413–454. https://acuresearchbank.acu.edu.au/item/8zqy4/multimedia-design-for-learning-an-overview-of-reviews-with-meta-meta-analysis — A
- [Q33] Rey, G. D. (2012). A review of research and a meta-analysis of the seductive detail effect. Educational Research Review 7(3),
  216–237. https://doi.org/10.1016/j.edurev.2012.05.003 — S (Effektgrößen); Folgestudie Sundararajan & Adesope (2020),
  Pressemitteilung: https://news.wsu.edu/?p=201521 — S
- [Q34] Lindgaard, G., Fernandes, G., Dudek, C. & Brown, J. (2006). Attention web designers: You have 50 milliseconds to make a good
  first impression! Behaviour & Information Technology 25, 115–126. https://www.nature.com/news/2006/060109/full/news060109-13.html — A/S
- [Q35] Tuch, A. N., Presslaber, E. E., Stöcklin, M., Opwis, K. & Bargas-Avila, J. A. (2012). The role of visual complexity and
  prototypicality regarding first impression of websites. International Journal of Human-Computer Studies 70(11), 794–811.
  https://research.google/pubs/pub38315/ — A
- [Q36] Reinecke, K., Yeh, T., Miratrix, L., Mardiko, R., Zhao, Y., Liu, J. & Gajos, K. Z. (2013). Predicting users' first impressions
  of website aesthetics with a quantification of perceived visual complexity and colorfulness. CHI 2013, 2049–2058.
  https://www.eecs.harvard.edu/~kgajos/papers/2013/reinecke13predicting.shtml — A
- [Q37] Tractinsky, N., Katz, A. S. & Ikar, D. (2000). What is beautiful is usable. Interacting with Computers 13(2), 127–145.
  https://academic.oup.com/iwc/article/13/2/127/898608 — A
- [Q38] Tuch, A. N., Roth, S. P., Hornbæk, K., Opwis, K. & Bargas-Avila, J. A. (2012). Is beautiful really usable? Computers in Human
  Behavior 28(5), 1596–1607. https://research.google/pubs/is-beautiful-really-usable-toward-understanding-the-relation-between-usability-aesthetics-and-affect-in-hci/ — A
- [Q39] Nielsen, J. (1993). Response Times: The 3 Important Limits. Nielsen Norman Group.
  https://nngroup.com/articles/response-times-3-important-limits — A

**Visual Attention**

- [Q40] Nielsen Norman Group (2018, Datum N). Banner Blindness Revisited: Users Dodge Ads on Mobile and Desktop.
  https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/ — S
- [Q41] Burke, M., Hornof, A., Nilsen, E. & Gorman, N. (2005). High-cost banner blindness: Ads increase perceived workload, hinder
  visual search, and are forgotten. ACM TOCHI 12(4), 423–445. https://www.doi.org/10.1145/1121112.1121116 — A
- [Q42] Abrams, R. A. & Christ, S. E. (2003). Motion onset captures attention. Psychological Science 14(5), 427–432.
  https://pubmed.ncbi.nlm.nih.gov/12930472/ — A
- [Q43] Goldstein, D. G., McAfee, R. P. & Suri, S. (2013). The Cost of Annoying Ads. WWW 2013.
  https://archives.iw3c2.org/www2013/proceedings/p459.pdf — A (Zahlen zu animierten Anzeigen S)
- [Q44] Sajjacholapunt, P. & Ball, L. J. (2014). The influence of banner advertisements on attention and memory: human faces with
  averted gaze can enhance advertising effectiveness. Frontiers in Psychology 5:166. https://pmc.ncbi.nlm.nih.gov/articles/PMC3941030 — A
- [Q45] Nielsen, J. (um 2010, Datum N). Photos as Web Content („Not All Images Are the Same“). Nielsen Norman Group.
  https://www.nngroup.com/articles/photos-as-web-content/ — A/S
- [Q46] (nicht verwendet; NN/g zu automatisch weiterschaltenden Karussells nur über Sekundärquelle gefunden:
  https://designsystem.qld.gov.au/about/exploring-our-decisions/carousels — N)
- [Q47] Höffler, T. N. & Leutner, D. (2007). Instructional animation versus static pictures: A meta-analysis. Learning and
  Instruction 17(6), 722–738. https://www.leibniz-ipn.de/en/research/publications/instructional-animation-versus-static-pictures-a-meta-analysis — A;
  Berney, S. & Bétrancourt, M. (2016), Folge-Metaanalyse, Fundstelle N: https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf
- [Q48] Frederick, D., Mohler, J., Vorvoreanu, M. & Glotzbach, R. (2015). The Effects of Parallax Scrolling on User Experience in Web
  Design. Journal of Usability Studies 10(2), 87–95. https://uxpajournal.org/wp-content/uploads/sites/7/pdf/JUS_Frederick_Feb2015.pdf — A
  (Übelkeit: https://www.uxpin.com/studioblog/3-crucial-ux-considerations-going-parallax/ — S)

**Vertrauen**

- [Q49] Fogg, B. J. et al. (2003). How do users evaluate the credibility of Web sites? DUX '03. https://colab.ws/articles/10.1145/997078.997097 — A
- [Q50] Nielsen Norman Group / Harley, A. (2016). Trustworthiness in Web Design: 4 Credibility Factors. Video:
  https://www.nngroup.com/videos/4-trustworthiness-factors/ — S
- [Q51] Kim, Y. & Peterson, R. A. (2017). A Meta-analysis of Online Trust Relationships in E-commerce. Journal of Interactive
  Marketing 38, 44–54. https://ideas.repec.org/a/eee/joinma/v38y2017icp44-54.html — A
- [Q52] Nielsen Norman Group. Show Prices for Common Scenarios. https://www.nngroup.com/articles/show-prices-for-common-scenarios/ ;
  B2B Website Usability (Bericht, 293 Websites): https://www.nngroup.com/reports/b2b-websites-usability/ ; Presse 2006:
  https://www.destinationcrm.com/Articles/CRM-News/CRM-Featured-Articles/B2B-Web-Sites-Are-Dropping-the-Ball-42449.aspx — A/S
- [Q53] Gartner (2018), über Sekundärquelle: https://www.destinationcrm.com/Articles/CRM-Insights/Insight/Buyer-Enablement-Is-the-Key-to-B2B-Sales-127790.aspx — S
- [Q54] Schlosser, A. E. (2003). Experiencing Products in the Virtual World: The Role of Goal and Imagery in Influencing Attitudes
  versus Purchase Intentions. Journal of Consumer Research 30(2), 184–198. https://ideas.repec.org/a/oup/jconrs/v30y2003i2p184-98.html — A

**Conversion Rate Optimization**

- [Q55] Think with Google. Page load time statistics. https://thinkwithgoogle.com/data/page-load-time-statistics — A (Jahr, Methode N)
- [Q56] Deloitte / Google / Fifty-Five (2020). Milliseconds Make Millions. https://web.dev/case-studies/milliseconds-make-millions ;
  https://deloitte.com/ie/en/services/consulting/research/milliseconds-make-millions — A
- [Q57] web.dev (2021). Vodafone: A 31% improvement in LCP increased sales by 8%. https://web.dev/case-studies/vodafone — A
- [Q58] web.dev. How the Core Web Vitals metrics thresholds were defined. https://web.dev/articles/defining-core-web-vitals-thresholds — A
- [Q59] Kohavi, R. et al. (2013). Online Controlled Experiments at Large Scale. KDD 2013. Hinweis:
  https://blogs.bing.com/search-quality-insights/2013/08/08/large-scale-experimentation-at-bing — N (0,6 %-Zahl nicht bestätigt)
- [Q60] Seckler, M., Heinz, S., Bargas-Avila, J. A., Opwis, K. & Tuch, A. N. (2014). Designing Usable Web Forms: Empirical Evaluation
  of Web Form Improvement Guidelines. CHI 2014, 1275–1284.
  https://research.google/pubs/designing-usable-web-forms-empirical-evaluation-of-web-form-improvement-guidelines/ — A
- [Q61] Wroblewski, L. (2009). Inline Validation in Web Forms. A List Apart. https://alistapart.com/article/inline-validation-in-web-forms/ ;
  Folien: https://static.lukew.com/MIX10_WebForms_Lukew_03152010.pdf — S
- [Q62] Baymard Institute (2024). Checkout Optimization: average form fields. https://baymard.com/blog/checkout-flow-average-form-fields — A
- [Q63] Baymard Institute, über eMarketer (2024): https://www.emarketer.com/content/extra-costs-are-the-top-reason-consumers-abandon-online-carts ;
  Liste 2023 über https://optinmonster.com/cart-abandonment-statistics/ — S
- [Q64] Aagaard, M. (ContentVerve), über Unbounce: https://unbounce.com/conversion-rate-optimization/how-to-write-a-call-to-action/ — N
- [Q65] Praxisregeln zu Knopftexten, z. B. https://uxmovement.com/buttons/5-rules-for-choosing-the-right-words-on-button-labels/ — S

**Usability und Accessibility**

- [Q66] W3C (2023). Web Content Accessibility Guidelines (WCAG) 2.2. Übersicht der neuen Kriterien:
  https://tetralogical.com/blog/2023/10/05/whats-new-wcag-2.2 ; Understanding 2.5.8:
  https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — A
- [Q67] Understanding 2.4.11 Focus Not Obscured (Minimum), über DAISY:
  https://kb.daisy.org/publishing/docs/wcag/focus-not-obscured-minimum.html — S
- [Q68] W3C. Understanding 2.3.3 Animation from Interactions. https://w3.org/WAI/WCAG21/Understanding/animation-from-interactions — A
- [Q69] W3C. Understanding 2.2.2 Pause, Stop, Hide. https://www.w3.org/WAI/WCAG20/Understanding/pause-stop-hide ; Diskussion
  „prefers-reduced-motion“: https://hidde.blog/meeting-2-22-pause-stop-hide-with-prefers-reduced-motion/ — A/S
- [Q70] W3C. Understanding 1.4.3 Contrast (Minimum): https://w3.org/WAI/WCAG22/Understanding/contrast-minimum.html ; Understanding
  1.4.11 Non-text Contrast: https://w3.org/WAI/WCAG22/Understanding/non-text-contrast — A
- [Q71] Agrawal, Y., Carey, J. P., Della Santina, C. C. et al. (2009). Disorders of balance and vestibular function in US adults.
  Archives of Internal Medicine 169, 938–944. https://consumer.healthday.com/otolaryngology-24/dizziness-and-vertigo-news-205/balance-dysfunction-common-in-american-adults-627401.html — S
- [Q72] BFSG, über IHK Gera: https://www.ihk.de/gera/recht-und-steuern/fokus-onlinehandel/barrierefreiheit-im-onlinehandel-6545152 ;
  Händlerbund: https://ohn.haendlerbund.de/recht/rechtsfragen/diese-drei-ausnahmen-von-der-barrierefreiheitspflicht-sollten-unternehmen-kennen — S
- [Q73] Parhi, P., Karlson, A. K. & Bederson, B. B. (2006). Target size study for one-handed thumb use on small touchscreen devices.
  MobileHCI 2006. https://dx.doi.org/10.1145/1152215.1152260 — A
- [Q74] Hoober, S. (2013). How Do Users Really Hold Mobile Devices? UXmatters.
  https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php — A/S
- [Q75] Piepenbrock, C., Mayr, S. & Buchner, A. (2013). Positive display polarity is advantageous for both younger and older adults.
  Ergonomics 56(7). https://documentacion.fundacionmapfre.org/documentacion/bib/143702.do — A

**Mobile Nutzung**

- [Q76] Nielsen Norman Group / Moran, K. (2016). Lesen auf Mobilgeräten, über Sekundärquelle:
  https://cte.ku.edu/reason-reconsider-students-mobile-reading — S
- [Q77] Google / BCG (2017). Mobile Marketing and the New B2B Buyer.
  https://www.bcg.com/publications/2017/marketing-sales-digital-go-to-market-transformation-mobile-marketing-new-b2b-buyer — A
- [Q78] StatCounter. Desktop vs Mobile Market Share Germany. https://gs.statcounter.com/platform-market-share/desktop-mobile/germany — N

**Konfiguratoren und Mass Customization**

- [Q79] Franke, N. & Piller, F. (2004). Value Creation by Toolkits for User Innovation and Design: The Case of the Watch Market.
  Journal of Product Innovation Management 21(6), 401–415.
  https://research.wu.ac.at/en/publications/value-creation-by-toolkits-for-user-innovation-and-design-the-cas-3/ — A
- [Q80] Franke, N., Schreier, M. & Kaiser, U. (2010). The „I Designed It Myself“ Effect in Mass Customization. Management Science
  56(1), 125–140. https://ideas.repec.org/a/inm/ormnsc/v56y2010i1p125-140.html — A
- [Q81] Dellaert, B. G. C. & Stremersch, S. (2005). Marketing Mass-Customized Products: Striking a Balance Between Utility and
  Complexity. Journal of Marketing Research 42(2), 219–227. https://repub.eur.nl/pub/11081 — A
- [Q82] Levav, J., Heitmann, M., Herrmann, A. & Iyengar, S. S. (2010). Order in Product Customization Decisions: Evidence from Field
  Experiments. Journal of Political Economy 118, 274–299. https://www.journals.uchicago.edu/doi/10.1086/652463 — A
- [Q83] Hildebrand, C., Häubl, G. & Herrmann, A. (2014). Product Customization via Starting Solutions. Journal of Marketing Research
  51(6), 707–725. https://www.alexandria.unisg.ch/236290 — A
- [Q84] Valenzuela, A., Dhar, R. & Zettelmeyer, F. (2009). Contingent Response to Self-Customization Procedures: Implications for
  Decision Satisfaction and Choice. Journal of Marketing Research 46(6), 754–763.
  https://merit.url.edu/en/publications/contingent-response-to-self-customization-procedures-implications/ — A
- [Q85] Haug, A., Hvam, L. & Mortensen, N. H. (2011, Angaben aus Suche). The impact of product configurators on lead times in
  engineering-oriented companies. AI EDAM.
  https://www.cambridge.org/core/journals/ai-edam/article/impact-of-product-configurators-on-lead-times-in-engineeringoriented-companies/107D0DB206626EE028613F59CB0DF203 — S

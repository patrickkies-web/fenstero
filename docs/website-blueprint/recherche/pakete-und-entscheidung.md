# Pakete und Kaufentscheidung im B2B-Software-Verkauf

Phase C (Recherche), Teil „Darstellung von Paketen und Kaufentscheidung“ · Stand 24.10.2026 · Planungsdokument, keine Gestaltungs-
oder Inhaltsentscheidung.

## 0. Zweck, Grundlage, Grenzen

**Zweck.** Belegtes Wissen zur Darstellung von drei Paketen (Einrichtung plus Monatspreis) und zur Kaufentscheidung von Betrieben
sammeln und daraus Hypothesen für die Paketauswahl des Konfigurators für Fensterbauer ableiten. Die Entscheidung fällt in späteren
Phasen (Paketentscheidung, Abschnitts-Spezifikation) und beim Inhaber.

**Geschäftsangaben** stammen nur aus dem Repository und stehen mit Datei und Zeile. Nutzerforschung zu Fensterbauern liegt im
Repository nicht vor; es gibt keine Kundenstimmen, keine Verkaufszahlen je Paket und keine Testergebnisse. Die Verkaufsseite ist im
Pilotbetrieb, die Bestellung noch nicht freigeschaltet (docs/BESTELLUNG.md:48–57, README.md:5).

**Kennzeichnung jeder Erkenntnis**

| Kennzeichen | Bedeutung |
|---|---|
| [Empirisch] | Laborexperiment, Feldexperiment, Metaanalyse oder Befragung mit genannter Stichprobe. Befragungen von Anbietern (Gartner, 6sense, Capterra) sind so markiert; ihre Methode ist meist nur in Pressetexten beschrieben. |
| [Forschungsbasierte Praxis] | Leitlinie, die aus Nutzerstudien abgeleitet ist (Nielsen Norman Group, Stanford), ohne Effektgröße für unseren Fall. |
| [Branchenpraxis/Meinung] | Zählungen von Anbieterseiten, Herstellerdaten mit Eigeninteresse, Beraterblogs. Rechtliche Einordnungen stehen ebenfalls hier, weil sie aus Kammer- und Kanzleibeiträgen stammen; sie sind keine Rechtsberatung und anwaltlich zu prüfen. |

**Prüfstatus der Quellen.** Volltexte ließen sich in dieser Arbeitsumgebung nicht abrufen: WebFetch scheiterte an der Namensauflösung
für jede getestete Domain (u. a. nngroup.com, gartner.com, businesswire.com, pmc.ncbi.nlm.nih.gov), curl an der Sperre des Proxys.
Alle Quellenaussagen beruhen auf Suchmaschinen-Auszügen. Jede Quelle trägt im Verzeichnis (Abschnitt 19) einen Status:

- **A** – Aussage im Auszug der Originalquelle oder ihres Repositoriums; Titel, Herausgeber und Jahr bestätigt, Volltext nicht gelesen.
- **S** – nur über eine Sekundärquelle (Pressebericht, Blog, Zusammenfassung) gefunden.
- **U** – unverifiziert oder widersprüchlich; nicht in Verkaufstexte übernehmen.

**Übertragbarkeit.** Die meisten empirischen Befunde stammen aus Verbraucher-Experimenten oder aus Befragungen mittlerer und großer
Unternehmen. Fensterbauer und Fensterhändler sind nach allgemeiner Kenntnis oft kleine Betriebe; eine Zahl dazu steht nicht im
Repository (offene Frage F9). Jede Konsequenz in diesem Dokument ist deshalb eine Hypothese.

---

## 1. Ausgangslage im Repository

### 1.1 Fakten

| Gegenstand | Stand | Beleg |
|---|---|---|
| Pakete und Reihenfolge | EEZI Essential, EEZI Essential Plus, EEZI Signature, in dieser Reihenfolge | web/assets/pakete.js:18, 42–67 |
| Preise (netto, vorläufig) | Essential 29 € im Monat / 99 € Einrichtung; Plus 39 € / 199 €; Signature 64 € / 279 € | web/assets/pakete.js:44, 52, 60 |
| Vorläufigkeit | `VORLAEUFIG = true`, Preisstand 2026-10-22; Seite zeigt „Vorläufige Preise“ | web/assets/pakete.js:15–17; functions/pakete-seite.js:86–91 |
| Steuer | „netto zzgl. MwSt.“ oder „ohne Ausweis der Umsatzsteuer (§ 19 UStG)“, je nach Variable `MWST` | web/assets/pakete.js:141–146; functions/pakete-seite.js:44 |
| Zielgruppe | nur Unternehmer nach § 14 BGB; Bestätigung per Häkchen beim Bestellen | web/konfigurator-bedingungen/index.html:34; docs/BESTELLUNG.md:23; web/fuer-fensterbauer/index.html:188 |
| Empfehlung | das mittlere Paket der Liste per Konstante (`EMPFOHLEN = 1`), Pille „Empfohlen“, einziger Cream-Knopf | functions/pakete-seite.js:32–33, 112–118; docs/GESTALTUNG.md:452, 456 |
| Telefon | Reihe zum Wischen, beginnt beim empfohlenen Paket; darunter Leiste mit den drei Kurznamen | functions/pakete-seite.js:128–130; docs/GESTALTUNG.md:452 |
| Paketkarte | Name, Satz, Monatspreis groß, „dazu … Einrichtung, einmalig vorab“, Steuerzeile, Leistungsliste, Knopf, Beispielseite | functions/pakete-seite.js:109–127 |
| Vergleich | eingeklappt (`details`), 2 Preiszeilen und 15 Merkmalszeilen, davon 3 in allen Paketen gleich | web/fuer-fensterbauer/index.html:182–185; web/assets/pakete.js:71–99; functions/pakete-seite.js:133–140 |
| Ablauf | sechs Schritte von „Bestellt“ bis „Live“; Einrichtung vorab, Monatsabo ab Livegang; meist 3 bis 5 Werktage | docs/BESTELLUNG.md:19–30; functions/pakete-seite.js:143–150 |
| Vertragsschluss | mit Eingang der Einrichtungsgebühr | web/konfigurator-bedingungen/index.html:48 |
| Laufzeit, Kündigung | unbestimmte Zeit, beidseitig zum Ende des laufenden Abrechnungsmonats, ohne Mindestlaufzeit | web/konfigurator-bedingungen/index.html:69; web/fuer-fensterbauer/index.html:243 |
| Storno | bis zum Beginn der Einrichtung mit voller Erstattung, danach keine Erstattung | web/konfigurator-bedingungen/index.html:70; docs/BESTELLUNG.md:44 |
| Freigabe | Vorschau-Link; live erst mit Freigabe oder nach Absprache | web/konfigurator-bedingungen/index.html:60; docs/BESTELLUNG.md:27 |
| Paketwechsel | nach oben: Differenz der Einrichtung, neuer Monatspreis ab Wechsel; nach unten: ab nächstem Abrechnungsmonat | web/konfigurator-bedingungen/index.html:71; docs/BESTELLUNG.md:41 |
| Preisänderung | mindestens sechs Wochen Ankündigung, Kündigung zum Änderungszeitpunkt möglich | web/konfigurator-bedingungen/index.html:55 |
| Domain | Domain bis 25 € Jahrespreis im Paket enthalten; Übertragung nach Vertragsende gegen Pauschale (Betrag offen) | web/konfigurator-bedingungen/index.html:64–65 |
| Verkaufsstand | ohne `PAKETE_OFFEN`: „Bestellung bald möglich“, Anfrageformular; mit: Bestellknöpfe ins Kundenkonto | docs/BESTELLUNG.md:48–57; functions/pakete-seite.js:190–197 |
| Antwortzeit | „in der Regel innerhalb eines Werktags“ | functions/pakete-seite.js:194, 196 |
| Demos | Demo-Instanzen je Paket vorbereitet, verlinkt erst mit `PAKETE_DEMOS=1`; bis dahin Weg in die Hauseigentümer-App | functions/pakete-seite.js:165–172; docs/INSTANZEN.md:310 |
| Nach der Zahlung | Danke-Seite („Wir melden uns innerhalb eines Werktags zu Ihrer Wunschzeit …“), Statusleiste, später Abo-Karte | web/assets/partner.js:571–576; docs/BESTELLUNG.md:19–30 |
| Bestellformular | Schritte Paket, E-Mail, Unternehmen, Konfigurator, Gestaltung (nur Plus, Signature), Prüfen und bestellen | web/assets/partner.js:161–175 |
| Rechtstexte | Paketbedingungen „Entwurf zur anwaltlichen Prüfung“ mit Platzhaltern (u. a. Verfügbarkeit, Übertragungspauschale) | web/konfigurator-bedingungen/index.html:28, 65, 89; docs/BESTELLUNG.md:63 |
| Kundenschutz | nur der eigene Betrieb, keine Werbung, keine Preise; Anfragen nur an bestätigte Adressen; kein Weiterverkauf | web/konfigurator-bedingungen/index.html:83–86; web/fuer-fensterbauer/index.html:159 |
| Vorgaben des Inhabers | Pakete sichtbar machen, zum höheren Paket hinführen; „Beliebt“ nur mit Kunden, sonst „Empfohlen“; keine erfundenen Belege; Telefon zuerst; eine Cream-Pille je Bildschirm; kurze Texte; Pakete am Telefon zum Wischen mit mitwischendem Beispielbild | .claude/skills/premium-gestaltung/SKILL.md:28–30, 49–50, 71, 120–122 |

**Rechnung aus den Repository-Werten** (netto, vorläufige Preise, Einrichtung plus zwölf Monatsbeiträge, kein Angebotstext):
Essential 447 €, Plus 667 €, Signature 1.047 €. Abstände: Essential → Plus +10 € im Monat und +100 € Einrichtung; Plus → Signature
+25 € im Monat und +80 € Einrichtung. Brutto bei 19 %: 34,51 € / 117,81 €; 46,41 € / 236,81 €; 76,16 € / 332,01 €.

### 1.2 Beobachtungen zur bestehenden Darstellung (neutral, kritisch)

- **B1 Empfehlung ohne Grund.** Der Code wählt das empfohlene Paket nach seiner Position („das mittlere der Liste“,
  functions/pakete-seite.js:32), nicht nach einem Bedarf; die Karte nennt keinen Grund für die Empfehlung.
- **B2 Gleiches vor Unterschiedlichem.** Jede Leistungsliste beginnt mit denselben drei Punkten (Domain, voller Konfigurator,
  Anfrage als PDF); die Unterschiede folgen erst danach (functions/pakete-seite.js:65–81).
- **B3 Risikomindernde Fakten verstreut.** Monatliche Kündbarkeit steht in den Häufigen Fragen und den Paketbedingungen, Storno und
  Freigabe im Ablauf und in den Bedingungen; auf den Karten und im Satz unter dem Vergleich fehlen sie
  (functions/pakete-seite.js:116–126; web/fuer-fensterbauer/index.html:188).
- **B4 Vergleich lang und ungegliedert.** 17 Zeilen ohne Gruppen, drei Zeilen „ja, ja, ja“, die Zahl 0 erscheint als „nein“
  (functions/pakete-seite.js:51); die Tabelle ist standardmäßig eingeklappt.
- **B5 Einrichtung sichtbar, aber nachrangig.** Sie steht auf jeder Karte, aber kleiner als der Monatspreis und ohne Satz, was sie
  enthält; dass eine Domain bis 25 € enthalten ist, steht nur in den Bedingungen (web/konfigurator-bedingungen/index.html:64).
- **B6 Widerspruch beim Preisversprechen.** Über den Karten steht, der Preis „bleibt für Ihren Vertrag fest“
  (functions/pakete-seite.js:89); die Bedingungen behalten Preisänderungen mit sechs Wochen Ankündigung vor
  (web/konfigurator-bedingungen/index.html:55). Siehe F3.
- **B7 Demo zeigt nicht das Verkaufte.** Bis zur Freischaltung der Demo-Instanzen führt „Konfigurator ausprobieren“ in die App für
  Hauseigentümer unter eeziframes-Marke; die Kernaussage „unter Ihrer Marke“ ist dort nicht erlebbar. Die Seite sagt das offen
  (functions/pakete-seite.js:171).
- **B8 Beratungsweg am Ende.** Das Anfrageformular steht im vorletzten Abschnitt; bei den Paketen gibt es keinen Hinweis auf
  Rückruf oder Frage (web/fuer-fensterbauer/index.html:171–221).

---

## 2. Anzahl und Reihenfolge der Pakete

**Erkenntnisse**

- [Empirisch] Eine Metaanalyse über 50 Experimente (63 Bedingungen, N = 5.036) findet im Mittel praktisch keinen Effekt der
  Auswahlgröße auf „Choice Overload“, aber große Streuung zwischen den Studien (Q2).
- [Empirisch] Eine spätere Metaanalyse findet einen signifikanten Effekt, sobald Moderatoren berücksichtigt werden: schwierige
  Aufgabe, komplexes Angebot, Unsicherheit über die eigenen Präferenzen und das Ziel, Aufwand zu sparen (Q3).
- [Empirisch] Werden Preise absteigend gezeigt, wählen Menschen eher teurere Optionen, aufsteigend eher günstigere; Voraussetzung ist,
  dass vom Preis auf Qualität geschlossen wird (Q1).
- [Branchenpraxis/Meinung] Zählungen von SaaS-Preisseiten: Median 3,5 Pläne bei 50 Anbietern, Spanne 0 bis 23 (Q46); 2015 bei
  250 Seiten Mittelwert 3,5, häufigster Wert 3, 81 % ordnen von niedrig nach hoch (Q45, Nenner der Prozentwerte unklar).
- [Branchenpraxis/Meinung] Das Muster „gut, besser, am besten“ wird als Standardaufbau für Paketreihen empfohlen (Q48).

**Gegenbefunde und Grenzen**

- Q2 und Q3 widersprechen sich im Gesamteffekt; einig sind sie darin, dass Komplexität und unklare Präferenzen die Lage verschärfen.
- Q1 ist ein Verbraucherexperiment; ob Betriebe beim Kauf einer Dienstleistung vom Preis auf Qualität schließen, ist nicht geprüft.

**Bezug zum Bestand.** Drei Pakete, aufsteigend sortiert (web/assets/pakete.js:18). Am Telefon steht zuerst das mittlere Paket
(functions/pakete-seite.js:130).

**Hypothesen**

- **H1** Drei Pakete bleiben; keine vierte Stufe („Individuell“, „auf Anfrage“) auf der Verkaufsfläche. Ein Fensterbauer kauft
  vermutlich zum ersten Mal einen Konfigurator; genau diese Lage (unklare eigene Präferenz) nennt Q3 als Verstärker. Wichtiger als
  die Zahl der Pakete ist die Zahl der Merkmale, die er gleichzeitig abwägen muss (siehe H10, H11).
- **H2** Am Schreibtisch bleibt die Reihenfolge aufsteigend (Erwartung der Leser, Q45). Absteigend (Q1) wäre der Weg, der stärker
  zum höheren Paket führt, verstößt aber gegen die Gewohnheit; nur als Test, nicht als Standard.
- **H3** Am Telefon bleibt der Start beim empfohlenen Paket (vereinbar mit Q13, Q14 und der Vorliebe des Inhabers,
  SKILL.md:121–122). Dafür sollen alle drei Preise ohne Wischen sichtbar sein, etwa in der vorhandenen Namensleiste
  (functions/pakete-seite.js:129), weil Inhalte jenseits der ersten Karte in Karussells wenig gesehen werden (Q56).

---

## 3. Empfohlenes Paket und Hervorhebung

**Erkenntnisse**

- [Empirisch] Kompromisseffekt: Eine Option gewinnt Anteile, wenn sie zur mittleren wird; der Effekt ist stärker bei Menschen, die
  ihre Wahl vor anderen begründen müssen (Q4). Eine Metaanalyse zur Abneigung gegen Extreme existiert (Q5; Inhalt nicht geprüft).
- [Empirisch] Mitte-Effekt: Menschen halten die mittlere Option einer Reihe für die beliebteste und wählen sie häufiger; der Effekt
  sinkt, wenn die eigenen Präferenzen präsent sind (Q13). Blickmessung: Die mittlere Option bekommt kurz vor der Entscheidung mehr
  Aufmerksamkeit und wird häufiger gewählt (Q14).
- [Empirisch] Voreinstellungen wirken im Mittel deutlich (d = 0,68, 58 Studien), stärker, wenn sie als Empfehlung gelesen werden;
  die Streuung ist sehr groß (Q15). Der Startpunkt der Wischreihe wirkt wie eine Voreinstellung.
- [Empirisch] Feldexperiment im Restaurant: Die Angabe der fünf meistbestellten Gerichte erhöhte deren Nachfrage um etwa 13 bis
  20 %; bloßes Nennen von Beispielgerichten ohne Beliebtheitsangabe wirkte nicht signifikant (Q17).
- [Branchenpraxis/Meinung] Etwa die Hälfte (2015, Q45) bzw. rund ein Drittel (2019, nur sekundär berichtet) der untersuchten
  SaaS-Preisseiten hebt ein Paket hervor.

**Gegenbefunde und Grenzen**

- [Empirisch] Empfehlungs- und Bestseller-Schilder können die Zahl der ernsthaft erwogenen Optionen vergrößern und die Entscheidung
  erschweren (Q16; Status U: Inhalt nur aus Titel und einer verwandten Dissertation erschlossen).
- Q17 zeigt: Wirksam ist die Beliebtheitsinformation, nicht die Markierung an sich. Eine Empfehlung ohne Grund trägt diese Wirkung
  nicht und darf sie nach den Inhaberregeln auch nicht vortäuschen (SKILL.md:49).

**Bezug zum Bestand.** B1. Empfohlen ist Plus, weil es in der Mitte steht (functions/pakete-seite.js:32–33); vorher hieß die
Pille „Beliebt“ und wurde mangels Kunden umbenannt (docs/GESTALTUNG.md:452).

**Hypothesen**

- **H4** Die Empfehlung bekommt einen sachlichen Grund in einer Zeile, abgeleitet aus Merkmalen, nicht aus Beliebtheit (z. B. eigenes
  Design mit Logo, Farbe, Fotos und Startseite in Suchmaschinen, web/assets/pakete.js:52–57). Stützt sich auf Q4 (Gründe) und Q15
  (Empfehlung als Fürsprache), vermeidet das Risiko aus Q16.
- **H5** Welches Paket empfohlen wird, entscheidet der Inhaber (F1). Plus nutzt Kompromiss- und Mitte-Effekt; eine Empfehlung von
  Signature würde „zum höheren Paket hinführen“ (SKILL.md:50) wörtlicher erfüllen, verzichtet aber auf den Mitte-Effekt.
- **H6** Eine Karte trägt die Hervorhebung, mit einem Signal (Rand, Pille, die einzige Cream-Pille), wie im Bestand; keine
  zusätzlichen Effekte, die mit den Markenregeln kollidieren (SKILL.md:68–71).

---

## 4. Ankerpreise und Lockvogel (Decoy)

**Erkenntnisse**

- [Empirisch] Eine Option, die von einer anderen klar übertroffen wird, erhöht die Wahl dieser anderen (asymmetrische Dominanz, Q6).
- [Empirisch] Willkürliche Anker beeinflussen die Zahlungsbereitschaft (Q10); Ankereffekte bei Schätzaufgaben wurden in einem großen
  Mehrlabor-Projekt wiederholt (Q12, Status S).
- [Forschungsbasierte Praxis] Der erste Preis, den ein B2B-Käufer sieht, setzt seine Erwartung für die Kategorie (Q32).

**Gegenbefunde und Grenzen**

- [Empirisch] Der Lockvogeleffekt tritt meist nicht auf, wenn Optionen realistisch beschrieben, mit Bildern gezeigt oder erlebt
  werden (Q7). In 91 Versuchen waren nur 11 Effekte belastbar; bedeutungsvolle Beschreibungen und Bilder verkleinerten den Effekt
  (Q8). Die Erstautoren halten dagegen, der Effekt sei bei originalgetreuer Wiederholung robust (Q9).
- [Empirisch] Eine Wiederholung des Anker-Experiments mit Marktgütern fand kleinere Effekte (Q11); Kritiker halten diese
  Wiederholung für zu ungenau, um zwischen keinem und einem deutlichen Effekt zu unterscheiden (Q11, Data Colada).

**Bezug zum Bestand.** Kein Paket wird von einem anderen klar übertroffen: Signature kostet mehr und bietet mehr (Dashboard, ohne
Hinweis auf eeziframes), Essential kostet weniger und trägt „Powered by EEZIframes“ (web/assets/pakete.js:44–66). Die Pakete
unterscheiden sich vor allem in sichtbaren Markenmerkmalen, die die Seite mit Beispielbildern zeigen will
(functions/pakete-seite.js:92–108).

**Hypothesen**

- **H7** Kein künstliches Lockvogelpaket. Die Befundlage ist unsicher (Q7–Q9), gerade bei bildhaft dargestellten Unterschieden, und
  der Inhaber verlangt Ehrlichkeit (SKILL.md:49).
- **H8** Signature ist ein echter oberer Anker. Er wirkt nur, wenn er gesehen wird, bevor die Entscheidung fällt; am Telefon hängt
  das an H3.
- **H9** Der Schritt zum Nachbarpaket wird als Differenz gezeigt („+10 € im Monat: Logo, Farbe, Fotos, eigene Startseite,
  Suchmaschinen“). Dazu wurde keine Studie gefunden; reine Hypothese, nur im Test bewerten.

---

## 5. Vergleichstabellen: Aufbau, Gruppierung, Länge

**Erkenntnisse**

- [Forschungsbasierte Praxis] Vergleichstabellen eignen sich für wenige Angebote mit mehreren Merkmalen; entscheidend sind
  Einheitlichkeit, Überfliegbarkeit und ein einfacher Aufbau (Q34, Videoseite).
- [Forschungsbasierte Praxis] Eine Sekundärzusammenfassung desselben Artikels nennt: höchstens etwa fünf Angebote, gleiche Merkmale in
  gleicher Reihenfolge, klare Spaltenköpfe, am Telefon reduzierte Vergleiche (Q34, Status U).
- [Forschungsbasierte Praxis] Bei komplexen B2B-Preisen helfen Beispiele für typische Fälle mehr als ein Rechner mit vielen Eingaben
  (Q33).
- [Empirisch] Komplexität des Angebots verstärkt Überforderung (Q3).

**Gegenbefunde und Grenzen.** Keine Studie gefunden, die Gruppierung oder das Zusammenfassen gleicher Zeilen in Preisvergleichen
misst. Die Hinweise sind Praxisleitlinien.

**Bezug zum Bestand.** B2, B4. Die vollständige Leistungstabelle mit allen Merkmalen steht zusätzlich in den Paketbedingungen
(functions/pakete-seite.js:214–221). Am Telefon wird die Tabelle über `data-k` zu Karten je Zeile (docs/GESTALTUNG.md:454).

**Hypothesen**

- **H10** Gruppen statt Liste: (1) „In allen Paketen“ als ein Satz über der Tabelle (Domain, voller Konfigurator, Anfrage als PDF)
  statt dreier gleicher Zeilen; (2) Ihre Marke (Gestaltung, Logo, Farbe, Fotos, Startseite, Hinweis auf eeziframes); (3) Gefunden
  werden (Suchmaschinen); (4) Team und Einladungen (Dashboard, Zugänge, Einladungslinks, Fortschritt); (5) Daten (Aufbewahrung).
  Preise stehen oben.
- **H11** Auf der Verkaufsfläche nur die Unterschiede (etwa 12 Zeilen); die vollständige Tabelle bleibt in den Paketbedingungen.
  Passt zu „kurze Abschnitte, wenige Wörter“ (SKILL.md:29–30).
- **H12** Telefon: kein Querscrollen (SKILL.md:71); Vergleich entweder je Gruppe mit Umschalter der drei Pakete oder mit fixiertem
  Kopf aus drei Kurznamen.
- **H13** Fehlende Merkmale als „nicht enthalten“ statt „nein“ bei Zahlen; wird im Test auf Lesbarkeit geprüft.

---

## 6. Transparenz bei Einrichtungsgebühren

**Erkenntnisse**

- [Empirisch] Aufgeteilte Preise (Grundpreis plus Zuschlag) senken den erinnerten Gesamtpreis und erhöhen die Nachfrage (Q18).
  Laut Übersichtsarbeit bleibt der Effekt trotz Offenlegung bestehen und wächst, wenn Zuschläge versteckt werden; die Wirkung hängt
  davon ab, ob der Zuschlag als nützlich und üblich gilt (Q19, Moderatoren Status S).
- [Empirisch] Freiwillige Kostentransparenz erhöhte die Kaufbereitschaft über Vertrauen; im Feldversuch stiegen die Verkäufe um
  22 %. Vorgeschriebene Transparenz wirkte nicht so; schaden kann sie, wenn sie Unfairness zeigt (Q21).
- [Empirisch] Als häufigste Gründe für Reue nach einem Softwarekauf werden höhere Gesamtkosten als erwartet (33 %) und eine
  langsame Einführung (32 %) genannt (Q43, Status S).
- [Forschungsbasierte Praxis] B2B-Käufer haben enge Budgets und fürchten Überraschungskosten; Preise zeigen, bei variablen Preisen
  typische Szenarien (Q32, Q33).
- [Branchenpraxis/Meinung] § 5a UWG erfasst auch das Vorenthalten wesentlicher Informationen gegenüber „sonstigen
  Marktteilnehmern“, also Betrieben; als Vorenthalten gilt auch unklare oder verspätete Darstellung (Q51).

**Gegenbefunde und Grenzen**

- [Empirisch] Im Feldexperiment bei StubHub senkte die Anzeige der Gebühren von Anfang an Käufe und Umsatz (Q20; Prozentangaben nur
  aus Presseberichten, Status S). Transparenz kann kurzfristig Abschlüsse kosten. Der Befund stammt aus dem Ticketverkauf an
  Verbraucher.
- Q18 liefert einen kaufmännischen Anreiz, die Einrichtung klein zu zeigen; Q19, Q43 und Q51 sprechen dagegen.

**Bezug zum Bestand.** B5. Die Einrichtung steht auf der Karte und im Vergleich (functions/pakete-seite.js:121, 137); „keine Gebühr
je Anfrage“ steht in Leiste und Häufigen Fragen (web/fuer-fensterbauer/index.html:237); nach Beginn der Einrichtung wird sie nicht
erstattet (web/konfigurator-bedingungen/index.html:70).

**Hypothesen**

- **H14** Die Einrichtung ist neben dem Monatspreis gut lesbar und hat einen Satz, was sie enthält, nur aus dem Bestand: Anruf zur
  Wunschzeit, Anlage des Konfigurators, Domain bis 25 € Jahrespreis, Gestaltung nach Paket, Vorschau mit Freigabe
  (web/konfigurator-bedingungen/index.html:58–64). Stützt sich auf Q21 und Q32.
- **H15** Eine Zeile „im ersten Jahr“ (447 / 667 / 1.047 € netto) im Vergleich. Gegenhypothese nach Q20: Sie senkt Abschlüsse.
  Nur im Test entscheiden.
- **H16** Mögliche Zusatzkosten (Domain über 25 €, Übertragungspauschale nach Vertragsende) erscheinen in den Häufigen Fragen,
  sobald sie beziffert sind (F6).

---

## 7. Laufzeiten und Kündigung

**Erkenntnisse**

- [Branchenpraxis/Meinung] Die Verschärfungen zu Laufzeit und Kündigungsfrist (§ 309 Nr. 9 BGB) und der Kündigungsknopf
  (§ 312k BGB) aus dem Gesetz für faire Verbraucherverträge betreffen Verbraucherverträge (Q53). Dass § 309 BGB gegenüber
  Unternehmern nur mittelbar über § 307 BGB wirkt (§ 310 Abs. 1 BGB), ist durch die Suche nicht belegt und anwaltlich zu prüfen.
- [Empirisch] 58 % (Capterra, USA) bzw. 60 % (Gartner Digital Markets, n = 3.484) der befragten Softwarekäufer bereuen mindestens
  einen Kauf der letzten 12 bis 18 Monate (Q43). Kurze Bindung senkt das Risiko solcher Fehlkäufe für den Käufer.

**Gegenbefunde und Grenzen**

- [Branchenpraxis/Meinung] Beraterblogs berichten, dass Jahresverträge die Abwanderung senken (Q47-Umfeld, Status U). Monatliche
  Kündbarkeit verschiebt das Risiko zum Anbieter.
- Ob Capterra (größere Firmen bereuen mehr) oder Gartner Digital Markets (kleine Firmen besonders betroffen) für kleine Betriebe
  gilt, ist widersprüchlich (Q43).

**Bezug zum Bestand.** Monatlich kündbar, ohne Mindestlaufzeit, im Kundenkonto oder in Textform
(web/konfigurator-bedingungen/index.html:69). Nach dem Ende: Daten 30 Tage, Domain zwölf Monate
(web/konfigurator-bedingungen/index.html:65, 77).

**Hypothesen**

- **H17** „Monatlich kündbar, ohne Mindestlaufzeit“ steht direkt bei den Paketen (eine Zeile unter den Karten oder auf jeder Karte).
  Es ist der stärkste belegte risikomindernde Fakt des Angebots (B3).
- **H18** Daneben ehrlich: Die Einrichtung wird nach ihrem Beginn nicht erstattet; was nach einer Kündigung mit Domain und Daten
  geschieht, in einem Satz mit Link zu den Bedingungen.
- **H19** Einheitliche Wortwahl: Bedingungen „zum Ende des laufenden Abrechnungsmonats“, Häufige Fragen „nach unten zum Monatsende“
  (web/fuer-fensterbauer/index.html:243). Ein Abrechnungsmonat beginnt mit dem Livegang, nicht am Monatsersten (F4).

---

## 8. Monatlich oder jährlich

**Erkenntnisse**

- [Empirisch] Pauschalen werden oft gewählt, auch wenn sie teurer sind (Flatrate-Bias); Gründe sind unter anderem Absicherung
  gegen Schwankungen, das „Taxameter“-Gefühl bei Einzelabrechnung und Überschätzung der Nutzung (Q23).
- [Empirisch] Kleine wiederkehrende Beträge werden mit kleinen laufenden Ausgaben verglichen, zusammengefasste Beträge mit großen
  seltenen Ausgaben; das verändert die Bewertung (Q24). Dass der Effekt bei größeren Beträgen kippt, ist nur sekundär berichtet.
- [Branchenpraxis/Meinung] Nur eine von fünf der 270 untersuchten SaaS-Firmen bietet monatliche und jährliche Zahlung an (Q47);
  Jahresrabatte von 15 bis 20 % gelten in Blogs als üblich (Status S).

**Gegenbefunde und Grenzen.** Q24 spricht für den Monatspreis als Hauptzahl, Q43 (Reue wegen unerwarteter Gesamtkosten) für eine
sichtbare Gesamtsicht. Beides zugleich ist ein Zielkonflikt (siehe H15).

**Bezug zum Bestand.** Nur monatlich, Einrichtung vorab, Abo ab Livegang (docs/BESTELLUNG.md:38–39); „0 € Gebühr je Anfrage“ in der
Kennzahlenleiste (docs/GESTALTUNG.md:451).

**Hypothesen**

- **H20** Zum Start nur monatlich. Ein Jahresmodell ist eine Inhaberentscheidung (F10) und wird nicht angekündigt, bevor es
  beschlossen ist.
- **H21** Der Monatspreis bleibt die Hauptzahl (Q24); die Gesamtsicht steht im Vergleich (H15).
- **H22** „Keine Gebühr je Anfrage“ ist ein Pauschalen-Argument (Q23) und steht nah am Preis statt nur in der Leiste.

---

## 9. Netto oder brutto bei B2B in Deutschland

**Erkenntnisse**

- [Branchenpraxis/Meinung] Die Preisangabenverordnung regelt Preisangaben von Unternehmern gegenüber Verbrauchern (§ 1 Abs. 1 PAngV,
  in Kraft seit 28.05.2022); Merkblätter der IHK nennen reine B2B-Angebote als nicht erfasst (Q50).
- [Branchenpraxis/Meinung] BGH, Urteil vom 29.04.2010, I ZR 99/08: Wer in an die Allgemeinheit gerichteter Werbung Preise nennt, muss
  Endpreise angeben, auch wenn er nur an Unternehmer verkaufen will; an den wirksamen Ausschluss von Verbrauchern stellt die
  Rechtsprechung hohe Anforderungen (Q49, Leitsätze nicht selbst gelesen). Ein Kanzleibeitrag (2026) berichtet, ein bloßer
  Gewerbehinweis reiche nicht, wenn Verbraucher trotzdem bestellen können (Q49, Status S).

**Gegenbefunde und Grenzen.** Kein Beleg gefunden, ob Fensterbauer Softwarepreise netto oder brutto erwarten; die Annahme „Betriebe
rechnen netto“ ist unbelegt.

**Bezug zum Bestand.** Netto mit „zzgl. MwSt. · nur für Unternehmer“ auf Karte und Vergleich (functions/pakete-seite.js:122, 139);
Bestellung nur mit Unternehmer-Bestätigung (docs/BESTELLUNG.md:23); strukturierte Daten mit `valueAddedTaxIncluded: false`
(functions/pakete-seite.js:198–206). Die Seite steht auch in der Startseite, deren andere Ansicht sich an Hauseigentümer richtet
(SKILL.md:63–64); Verbraucher erreichen sie also. Ob Umsatzsteuer ausgewiesen wird, hängt von `MWST` ab (web/assets/pakete.js:141).

**Hypothesen**

- **H23** Netto bleibt Hauptangabe, mit Steuersatz im Satz („zzgl. 19 % MwSt.“, sobald F7 geklärt); Bruttobeträge in der
  Bestellübersicht vor der Zahlung. Anwaltlich prüfen lassen, ob Einbettung in die Startseite plus Unternehmer-Bestätigung beim
  Bestellen den Anforderungen aus I ZR 99/08 genügt (F8).

---

## 10. Risikoumkehr: Test, Rückgabe, Kündbarkeit

**Erkenntnisse**

- [Empirisch] Geld-zurück-Garantien erhöhen Kaufabsicht und Bereitschaft, mehr zu zahlen, auch über eine positive Gefühlsreaktion;
  bei Erfahrungsgütern sind strengere Bedingungen sinnvoll (Q26).
- [Empirisch] Kostenlose Tests können schaden: Zeitpunkt und Nutzungsintensität entscheiden, eine enttäuschende frühe Erfahrung kann
  Kunden dauerhaft vertreiben (Q25).
- [Empirisch] Bei Käufen per Selbstbedienung berichten 43 % hohe Kaufreue, bei Käufen mit Vertrieb 26 % (Gartner, Q35).
- [Branchenpraxis/Meinung] Testkonten und Produktdemos gehören zu den meistgenutzten Informationsquellen von Technologiekäufern
  (TrustRadius, Q41).

**Gegenbefunde und Grenzen.** Q25 betrifft einen Verbraucherdienst (Digitalfernsehen). Für B2B-Dienste mit Einrichtungsaufwand je
Kunde wurde keine Studie gefunden.

**Bezug zum Bestand: vorhandene risikomindernde Fakten**

| Fakt | Beleg |
|---|---|
| Vertrag erst mit Zahlung der Einrichtung | web/konfigurator-bedingungen/index.html:48 |
| Storno bis Beginn der Einrichtung mit voller Erstattung | web/konfigurator-bedingungen/index.html:70 |
| Vorschau-Link und Freigabe vor dem Livegang | web/konfigurator-bedingungen/index.html:60 |
| Monatsbeitrag erst ab Livegang | web/konfigurator-bedingungen/index.html:54 |
| Monatlich kündbar, ohne Mindestlaufzeit | web/konfigurator-bedingungen/index.html:69 |
| Konfigurator ohne Konto ausprobieren (Hauseigentümer-Fassung) | functions/pakete-seite.js:171 |
| Preisstand der Bestellung wird festgehalten | web/assets/pakete.js:7–8; docs/BESTELLUNG.md:38 |

Nicht vorhanden: kostenloser Test der eigenen Instanz, Erstattung der Einrichtung nach deren Beginn.

**Hypothesen**

- **H24** Die Fakten der Tabelle stehen als ein kurzer Block direkt bei den Paketen, nur Belegtes, keine neue Garantie.
- **H25** Kein Gratis-Test der eigenen Instanz: Einrichtung, Domain und Gestaltung sind Arbeit je Kunde, und Q25 warnt vor schwachen
  Testerlebnissen. Risikofreies Erleben leisten die Demo-Instanzen (H29).
- **H26** Ob die Einrichtung erstattet wird, wenn die Vorschau nicht freigegeben wird, ist offen (F5). Eine solche Zusage wäre echte
  Risikoumkehr (Q26), darf aber nur nach Inhaberentscheidung und mit passender Klausel erscheinen.

---

## 11. Beratungstermin oder Selbstkauf

**Erkenntnisse**

- [Empirisch] Gartner-Befragungen: 61 % (n = 632, Aug.–Sep. 2024) bzw. 67 % (n = 646, Aug.–Sep. 2025) der B2B-Käufer bevorzugen
  einen Kauf ohne Vertriebsmitarbeiter; Rat vom Anbieter suchen sie für Aufgaben, die Kontextwissen brauchen, etwa die Frage, ob eine
  Lösung zum eigenen Betrieb passt (Q36, Q37). Eine Gartner-Kurzfassung von 2024 nennt 75 % und 43 % gegenüber 26 % hoher Reue
  (Q35).
- [Empirisch] Käufer, die Informationen bekommen, die ihnen Kaufaufgaben erleichtern, schließen nach Gartner dreimal so
  wahrscheinlich ein „hochwertiges Geschäft mit geringer Reue“ ab (Q39; Methode nicht offengelegt).
- [Empirisch] Sichere Käufer berichten doppelt so häufig von einem hochwertigen Abschluss (Gartner 2026, Q37).

**Gegenbefunde und Grenzen.** Vorliebe und Ergebnis laufen auseinander: Selbstbedienung wird bevorzugt, führt aber häufiger zu Reue
(Q35). Die Stichproben sind international und eher größere Unternehmen.

**Bezug zum Bestand.** Selbstkauf im Kundenkonto (bei offenem Verkauf), Frageformular ohne Konto, Rückruf zur Wunschzeit erst nach
der Zahlung (docs/BESTELLUNG.md:23–25, 59); B8.

**Hypothesen**

- **H27** Selbstkauf bleibt der Hauptweg (Cream-Knopf am empfohlenen Paket).
- **H28** Direkt unter den Paketen ein leiser zweiter Weg für Passungsfragen („Unsicher, welches Paket passt? Rückruf oder
  Nachricht“) als Ring-Knopf zum vorhandenen Formular. Stützt sich auf Q35–Q37; hält die Regel „eine Cream-Pille je Bildschirm“.

---

## 12. Interaktive Produktdemos

**Erkenntnisse**

- [Branchenpraxis/Meinung] Navattic (Anbieter von Demo-Software) berichtet für 2025 eine dreimal höhere Umwandlung von Demo-Besuchern
  in Verkaufschancen als bei isolierten Produktseiten; Grundlage über 28.000 Demos auf der eigenen Plattform und 280 befragte
  Nutzer (Q44).
- [Branchenpraxis/Meinung] Produktdemos gehören zu den meistgenutzten Informationsquellen von Technologiekäufern (Q41).

**Gegenbefunde und Grenzen.** Keine unabhängige Studie gefunden. Die Zahlen stammen von einem Anbieter mit Verkaufsinteresse; wer
eine Demo ansieht, ist vermutlich ohnehin interessierter (Auswahleffekt).

**Bezug zum Bestand.** Demo-Instanzen je Paket mit erfundenem Betrieb sind vorbereitet (docs/INSTANZEN.md:310;
docs/ONLINE-STELLEN.md:256, 270), aber nicht verlinkt; Beispielbilder je Paket fehlen noch, bis dahin Skizzen
(functions/pakete-seite.js:92–108). B7.

**Hypothesen**

- **H29** Je Paket ein Weg in seine Demo-Instanz an der Karte, sobald freigeschaltet: Der Unterschied der Pakete (wie sehr der
  Konfigurator die eigene Marke trägt) wird erlebt statt gelesen. Bis dahin bleibt der Hinweis, dass „Konfigurator ausprobieren“ die
  Fassung für Hauseigentümer zeigt.
- **H30** Die Beispielbilder je Paket sind am Telefon die schnellste Form der Demo; sie brauchen eine Materialanfrage beim Inhaber
  (SKILL.md:93–99).

---

## 13. B2B-Kaufprozess: Beteiligte und Recherche ohne Anbieterkontakt

**Erkenntnisse**

- [Empirisch] 6sense (Anbieterbefragung 2024): Käufer sind zu knapp 70 % durch ihren Prozess, bevor sie Anbieter ansprechen; 81 %
  haben beim Erstkontakt schon einen Favoriten; über 80 % der Erstkontakte gehen vom Käufer aus; Kaufgruppen im Mittel 11 Personen
  (Q40).
- [Empirisch] Gartner (2018/2019): Käufer verbringen etwa 17 % ihrer Kaufzeit mit Anbietern; Kaufgruppen haben 6 bis 10 Entscheider;
  die Kaufaufgaben laufen nicht nacheinander, sondern parallel (Q38, Status S).
- [Empirisch] TrustRadius 2022 (2.185 Technologiekäufer): Käufer recherchieren selbst, prüfen bei Kollegen und streichen Anbieter,
  die Selbstbedienung nicht unterstützen (Q41).
- [Empirisch] Bitkom/ZDH 2020 (502 Interviews): Mehr als die Hälfte der Handwerksbetriebe sieht Digitalisierung als große
  Herausforderung; kleinen Betrieben fällt eine Digitalstrategie schwer (Q57).

**Gegenbefunde und Grenzen.** Die Zahlen zu Kaufgruppen stammen aus größeren Unternehmen; für Forresters „13 Beteiligte“ fand sich
nur Widersprüchliches (Q42, Status U). Für Fensterbaubetriebe gibt es keine Daten; vermutlich entscheiden kleinere Gruppen, belegt
ist das nicht (F9).

**Bezug zum Bestand.** Alles Kaufrelevante ist ohne Kontakt öffentlich: Preise, Vergleich, Ablauf, Häufige Fragen, Paketbedingungen
und AV-Vertrag als PDF (docs/BESTELLUNG.md:61–67). Kommt ein Interessent über eine Paketkarte zum Formular, ist das Paket
vorgewählt (functions/pakete-seite.js:115; docs/INSTANZEN.md:209).

**Hypothesen**

- **H31** Eine weiterreichbare Kurzfassung der Pakete (Preis, Einrichtung, Kündbarkeit, Link zu den Bedingungen) für Mitentscheider
  wie Büro, Partner oder Steuerberater. Die Bedingungen gibt es schon als PDF.
- **H32** Die Vorwahl des Pakets im Formular bleibt (Q40: Wer anfragt, hat meist schon einen Favoriten).

---

## 14. Vertrauen ohne Kundenstimmen

**Erkenntnisse**

- [Forschungsbasierte Praxis] Stanford-Leitlinien zur Glaubwürdigkeit von Websites (zehn Leitlinien, Forschung mit über 4.500
  Personen): zeigen, dass eine echte Organisation dahintersteht (Adresse, Fotos), und Kontakt leicht machen (Q30; Kontakt-Leitlinie
  Status S).
- [Forschungsbasierte Praxis] Nielsen Norman Group: Vertrauen entsteht über Gestaltungsqualität, Offenlegung vorab, vollständige und
  aktuelle Inhalte und Verbindung zum übrigen Netz; 2016 erneut bestätigt (Q31).
- [Empirisch] In einer Studie mit 2.684 Teilnehmern bezogen sich 46,1 % der Kommentare zur Glaubwürdigkeit auf das Erscheinungsbild
  (Q29, Zahlen sekundär bestätigt).
- [Empirisch] Freiwillige Transparenz schafft Vertrauen und Kaufbereitschaft (Q21); sichtbar gemachte Arbeit des Anbieters erhöht
  den wahrgenommenen Wert (Q22, Status S).
- [Empirisch] Ein Händler-Datensatz: Produkt mit fünf Bewertungen 270 % höhere Kaufwahrscheinlichkeit als ohne Bewertungen (Q55,
  Status S, Verbraucherhandel).

**Gegenbefunde und Grenzen.** Q55 zeigt, dass fehlende Stimmen ein Nachteil sind; eine Studie zu jungen B2B-Angeboten ohne
Referenzen wurde nicht gefunden.

**Bezug zum Bestand.** Keine Kundenstimmen; erfundene Belege sind ausgeschlossen (SKILL.md:49). Vorhanden: echte Quellen mit
Nachweisen (web/fuer-fensterbauer/index.html:148, 259), Kundenschutz-Zusagen (web/konfigurator-bedingungen/index.html:83–86), AV-Vertrag,
Datenstandort Frankfurt (web/fuer-fensterbauer/index.html:241), ausprobierbare App, Beispiel-Meldungen im Startbild als „Beispiel“
gekennzeichnet (web/fuer-fensterbauer/index.html:55). Impressum und Datenschutz sind Entwürfe, E-Mail und Telefon „folgen“
(README.md:21).

**Hypothesen**

- **H33** Ersatz für Kundenstimmen sind prüfbare Fakten: Produkt erleben (Demo), Vertrag vor dem Kauf lesen (Link zu den
  Bedingungen bei den Paketen), Person und Firma hinter dem Angebot mit Name, Ort und Telefon (sobald das Impressum fertig ist, F11),
  Kundenschutz-Zusagen, Ablauf mit Freigabe.
- **H34** Den Pilotstatus offen benennen; keine Zähler, Logos, Siegel oder „bekannt aus“.
- **H35** Zahlen in der Kennzahlenleiste nur mit Beleg; für „5 Minuten je Fenster, etwa“ fand sich im Repository keine Messung
  (docs/GESTALTUNG.md:451; F12).

---

## 15. Ehrlichkeit von Labels wie „beliebt“

**Erkenntnisse**

- [Empirisch] Beliebtheitsangaben verändern Entscheidungen (Q17), und die Mitte wird als beliebt gedeutet (Q13): Labels wirken.
- [Empirisch] Schon milde manipulative Gestaltung verdoppelte in einem Experiment die Zustimmung zu einem Abo ohne messbare
  Gegenreaktion (11 % ohne, 26 % mit milder, 42 % mit aggressiver Gestaltung; Zahlen aus Vortragsfolien, Status S) (Q27).
- [Empirisch] Eine Untersuchung von rund 11.000 Shops fand 1.818 manipulative Muster, darunter vorgetäuschten sozialen Beweis; 183
  Seiten setzten täuschende Praktiken ein (Q28).
- [Branchenpraxis/Meinung] Spitzenstellungs-Aussagen wie „Bestseller“ oder „Marktführer“ muss der Werbende im Zweifel beweisen; §§ 5,
  5a UWG schützen auch Betriebe als „sonstige Marktteilnehmer“ (Q51, Q52).

**Gegenbefunde und Grenzen.** Q27 zeigt, dass milde Manipulation kommerziell ohne Gegenreaktion wirken kann. Dagegen stehen Recht
und die Vorgabe des Inhabers.

**Bezug zum Bestand.** „Empfohlen“ statt „Beliebt“ (docs/GESTALTUNG.md:452; SKILL.md:49); „Vorläufige Preise“ offen ausgewiesen
(docs/GESTALTUNG.md:453).

**Hypothesen**

- **H36** „Empfohlen“ nur mit Grund (H4). „Beliebt“ oder „meistgewählt“ erst, wenn gezählte Bestellungen vorliegen (die Zentrale
  führt Bestellungen, docs/BESTELLUNG.md:15), mit Zeitraum.
- **H37** Keine Fristen oder Knappheit ohne realen Grund. Gibt es später einen Einführungspreis für Pakete, braucht er ein echtes
  Stichtagsdatum wie der Einführungspreis für Hauseigentümer (docs/ABRECHNUNG.md:11).

---

## 16. Rückmeldung nach der Auswahl und nächste Schritte

**Erkenntnisse**

- [Empirisch] Reue nach Softwarekäufen hängt vor allem an Kosten- und Einführungsüberraschungen; nach Capterra 2026 erlebten 89 % der
  Bereuenden zuerst eine unerwartete Störung bei der Einführung (Q43, Status S).
- [Empirisch] Sichtbar gemachte Arbeit des Anbieters erhöht Zufriedenheit und wahrgenommenen Wert (Q22, Status S).
- [Empirisch] Sichere Käufer berichten häufiger von einem hochwertigen Abschluss (Q37).

**Gegenbefunde und Grenzen**

- [Empirisch] Fortschrittsanzeigen senkten in einer Metaanalyse von 32 Experimenten (Online-Umfragen) die Abbrüche im Mittel nicht;
  Anzeigen, die langsam beginnen, erhöhten sie, solche, die schnell beginnen, senkten sie (Q54; ein Leser bezweifelt die Kodierung,
  Status S).

**Bezug zum Bestand.** Bestellformular mit Schritten und Statusleiste (web/assets/partner.js:161–175; docs/GESTALTUNG.md:458),
Eingangsbestätigung mit Bedingungen als PDF sofort, Kasse bei Stripe, Danke-Seite mit nächster Handlung
(web/assets/partner.js:571–576), Statusleiste bis Live, danach Abo-Karte (docs/BESTELLUNG.md:19–30). Nach einer Anfrage ersetzt
ein Dank das Formular (docs/GESTALTUNG.md:455).

**Hypothesen**

- **H38** Nach der Paketwahl auf der Verkaufsseite eine sofortige Bestätigung mit Zahlen: heute fällig (Einrichtung), ab Livegang
  monatlich, monatlich kündbar, und der nächste Schritt in den Worten der Statusleiste.
- **H39** Danke-Seite nach der Zahlung und Dank nach einer Anfrage nennen, wer sich wann meldet und was der Betrieb vorbereiten kann
  (Logo, Fotos, Wunsch-Domain, Empfänger der Anfragen; aus den Formulartexten, web/assets/partner.js:168–175).
- **H40** Das Bestellformular behält seine Statusleiste, beginnt aber mit schnellen Schritten (Q54); Prüfung im Test.

---

## 17. Hypothesen im Überblick

| Nr. | Hypothese (kurz) | Stützt sich auf | Gegenbefund, Risiko | Prüfweg |
|---|---|---|---|---|
| H1 | drei Pakete, keine vierte Stufe | Q3, Q45, Q46 | Q2 (kein Mitteleffekt) | Anfragen mit „Paket: noch offen“ zählen |
| H2 | Schreibtisch aufsteigend | Q45 | Q1 (absteigend lenkt nach oben) | Vergleichstest, falls Besucherzahl reicht |
| H3 | Telefon: alle drei Preise ohne Wischen sichtbar | Q13, Q14, Q56 | Platz am Telefon | Bildschirmfoto 390 × 844, Gespräche |
| H4 | „Empfohlen“ mit Grund | Q4, Q15 | Q16 | Gespräche: Wird der Grund verstanden? |
| H5 | Wahl des empfohlenen Pakets durch den Inhaber | Q4, Q13, SKILL.md:50 | Mitte-Effekt entfällt bei Signature | Inhaberentscheidung (F1) |
| H6 | ein Signal, eine Karte | SKILL.md:68–71 | – | Prüfsuite, Sichtprüfung |
| H7 | kein Lockvogelpaket | Q7, Q8, SKILL.md:49 | Q6, Q9 | – |
| H8 | Signature als echter Anker sichtbar | Q1, Q10 | Q11 | wie H3 |
| H9 | Differenz zum Nachbarpaket zeigen | keine Studie | unbelegt | Test |
| H10–H13 | Vergleich gruppiert, kürzer, ohne Querscrollen | Q3, Q34 | Q34 nur Leitlinie | Gespräche, Lesetest am Telefon |
| H14 | Einrichtung lesbar mit Inhalt | Q21, Q32, Q51 | Q18 (Aufteilung hebt Nachfrage) | Gespräche |
| H15 | Kosten im ersten Jahr zeigen | Q21, Q43 | Q20 (senkt Abschlüsse) | Test |
| H16 | Zusatzkosten nennen, sobald beziffert | Q51 | – | nach F6 |
| H17–H19 | Kündbarkeit bei den Paketen, ehrliche Grenzen, einheitliche Wortwahl | Q43, B3 | Q47 (Abwanderung) | Gespräche |
| H20–H22 | nur monatlich; Monatspreis Hauptzahl; „keine Gebühr je Anfrage“ nah am Preis | Q23, Q24, Q47 | Q43 (Gesamtkosten) | Inhaberentscheidung (F10) |
| H23 | netto als Hauptangabe, brutto vor der Zahlung | Q49, Q50 | Einbettung in Startseite | anwaltliche Prüfung (F8) |
| H24–H26 | Risikofakten bündeln, kein Gratis-Test, Erstattung bei Nichtfreigabe klären | Q25, Q26, Q35 | Q25 | Inhaberentscheidung (F5) |
| H27–H28 | Selbstkauf als Hauptweg, Beratung als leiser zweiter Weg bei den Paketen | Q35–Q37 | Reue bei Selbstbedienung | Anteil Anfragen und Bestellungen |
| H29–H30 | Demo je Paket, Beispielbilder | Q41, Q44 | Q44 Anbieterdaten | nach Freischaltung `PAKETE_DEMOS` |
| H31–H32 | weiterreichbare Kurzfassung, Paket vorgewählt | Q38, Q40, Q41 | Kaufgruppe unbekannt (F9) | Gespräche |
| H33–H35 | prüfbare Fakten statt Stimmen, Pilot offen, Zahlen belegt | Q21, Q29–Q31 | Q55 | Gespräche |
| H36–H37 | ehrliche Labels, keine falsche Knappheit | Q17, Q27, Q28, Q51, Q52 | Q27 (Manipulation wirkt) | – |
| H38–H40 | Bestätigung mit Zahlen und nächstem Schritt | Q22, Q37, Q43 | Q54 | Test im Kundenkonto |

Messbarkeit: Die Zentrale führt Bestellungen und eine eigene Statistik ohne Cookies mit Tagessummen (README.md:5; docs/ZENTRALE.md:5).
Vergleichstests einzelner Darstellungen sind damit nicht vorgesehen; realistische Prüfwege sind Gespräche mit Fensterbauern, das
Paketfeld im Anfrageformular und Bestellungen je Paket.

---

## 18. Offene Fragen

| Nr. | Frage | Grundlage im Repository |
|---|---|---|
| F1 | Welches Paket soll empfohlen werden, und aus welchem Grund? Heute folgt die Empfehlung der Position. | functions/pakete-seite.js:32–33; SKILL.md:50 |
| F2 | Wann gelten die Preise als endgültig? | web/assets/pakete.js:15–17 |
| F3 | Bleibt der Preis „für Ihren Vertrag fest“, oder gilt der Änderungsvorbehalt mit sechs Wochen Ankündigung? | functions/pakete-seite.js:89; web/konfigurator-bedingungen/index.html:55; docs/BESTELLUNG.md:39 |
| F4 | Kündigung und Wechsel nach unten: „Monatsende“ (Häufige Fragen) oder „Ende des Abrechnungsmonats“ (Bedingungen)? | web/fuer-fensterbauer/index.html:243; web/konfigurator-bedingungen/index.html:69, 71 |
| F5 | Wird die Einrichtung erstattet, wenn der Betrieb die Vorschau nicht freigibt? Die Bedingungen schließen Erstattung nach Beginn aus, Live geht erst mit Freigabe „oder nach Absprache“. | web/konfigurator-bedingungen/index.html:60, 70 |
| F6 | Höhe der Übertragungspauschale für die Domain, Verfügbarkeitszusage, Haftungshöchstbetrag (Platzhalter). | web/konfigurator-bedingungen/index.html:65, 89; docs/BESTELLUNG.md:63 |
| F7 | Wird Umsatzsteuer ausgewiesen (19 %) oder gilt die Kleinunternehmerregelung (`MWST=0`)? | web/assets/pakete.js:141–146; docs/BESTELLUNG.md:57 |
| F8 | Genügt die Unternehmer-Bestätigung beim Bestellen für Nettopreise auf einer Seite, die auch in der Startseite für Hauseigentümer steht? | SKILL.md:63–64; docs/BESTELLUNG.md:23 |
| F9 | Wie groß sind die Zielbetriebe, wer entscheidet dort über Software? Keine Daten im Repository. | – |
| F10 | Ist eine jährliche Zahlung gewünscht? | nicht im Repository |
| F11 | Wann sind Impressum, Telefon und E-Mail fertig? | README.md:21 |
| F12 | Beleg für „5 Minuten je Fenster, etwa“ in der Kennzahlenleiste? | docs/GESTALTUNG.md:451 |
| F13 | Paketwechsel nach oben: Ist die Differenz der Einrichtung Pflicht (Bedingungen: „Fällig wird“) oder nur „auf Wunsch“ (Betriebsdoku)? | web/konfigurator-bedingungen/index.html:71; docs/BESTELLUNG.md:41 |
| F14 | Namensgleichheit: Bestandstarif „Plus“ für Betriebe (79 € im Monat, wird weiter im Betriebsbereich gezeigt) und Paket „EEZI Essential Plus“ (39 €). Verwechslungsgefahr bei Bestandskunden? | docs/ABRECHNUNG.md:19; web/assets/portal.js:900–904; web/assets/pakete.js:52 |

---

## 19. Quellen

Status: A = Auszug der Originalquelle, S = nur sekundär, U = unverifiziert oder widersprüchlich (Erklärung in Abschnitt 0).

| Nr. | Quelle | Status |
|---|---|---|
| Q1 | Suk, K.; Lee, J.; Lichtenstein, D. R.: The Influence of Price Presentation Order on Consumer Choice. Journal of Marketing Research 49(5), 2012, 708–717. https://biz.korea.ac.kr/eng/activities/academic_view.html?no=372 | A |
| Q2 | Scheibehenne, B.; Greifeneder, R.; Todd, P. M.: Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice Overload. Journal of Consumer Research 37(3), 2010, 409–425. https://ideas.repec.org/a/oup/jconrs/v37y2010i3p409-425.html | A |
| Q3 | Chernev, A.; Böckenholt, U.; Goodman, J.: When Product Assortment Leads to Choice Overload: A Conceptual Review and Meta-Analysis. Journal of Consumer Psychology 25(2), 2015, 333–358. https://www.kellogg.northwestern.edu/faculty/research/detail/2015/when-product-assortment-leads-to-choice-overload-a-conceptual | A |
| Q4 | Simonson, I.: Choice Based on Reasons: The Case of Attraction and Compromise Effects. Journal of Consumer Research 16(2), 1989, 158–174. https://www.gsb.stanford.edu/faculty-research/publications/choice-based-reasons-case-attraction-compromise-effects | A |
| Q5 | Neumann, N.; Böckenholt, U.; Sinha, A.: A Meta-Analysis of Extremeness Aversion. Journal of Consumer Psychology, 2016. https://www.kellogg.northwestern.edu/academics-research/research/detail/2016/a-meta-analysis-of-extremeness-aversion | U (nur Titel bestätigt) |
| Q6 | Huber, J.; Payne, J. W.; Puto, C.: Adding Asymmetrically Dominated Alternatives: Violations of Regularity and the Similarity Hypothesis. Journal of Consumer Research 9(1), 1982. https://scholars.duke.edu/publication/904415 | A |
| Q7 | Frederick, S.; Lee, L.; Baskin, E.: The Limits of Attraction. Journal of Marketing Research 51(4), 2014, 487–507. https://marketing.wharton.upenn.edu/wp-content/uploads/2016/10/The-Limits-of-Attraction.pdf | A |
| Q8 | Yang, S.; Lynn, M.: More Evidence Challenging the Robustness and Usefulness of the Attraction Effect. Journal of Marketing Research 51(4), 2014, 508–513. https://ecommons.cornell.edu/entities/publication/0c5b506a-f8d3-4a4c-8825-b2c715e9f956 | A |
| Q9 | Huber, J.; Payne, J. W.; Puto, C.: Let's Be Honest About the Attraction Effect. Journal of Marketing Research 51(4), 2014, 520–525. https://people.duke.edu/~jch8/bio/Papers/HuberPaynePutoJMR%202014.pdf | A |
| Q10 | Ariely, D.; Loewenstein, G.; Prelec, D.: „Coherent Arbitrariness“: Stable Demand Curves Without Stable Preferences. Quarterly Journal of Economics 118(1), 2003, 73–105. https://www.cmu.edu/dietrich/sds/docs/loewenstein/CoherentArbit.pdf | A |
| Q11 | Maniadis, Z.; Tufano, F.; List, J. A.: One Swallow Doesn't Make a Summer: New Evidence on Anchoring Effects. American Economic Review 104(1), 2014, 277–290. https://eprints.nottingham.ac.uk/31360 · Kritik: Simonsohn, U. u. a., Data Colada, 2013. https://datacolada.org/7 | A |
| Q12 | Klein, R. A. u. a.: Investigating Variation in Replicability („Many Labs“). Social Psychology, 2014. https://research.unipd.it/bitstream/11577/2688304/1/ManyLabs.2014.SP.fulltext.pdf | S (Ankerbefund nur über Blogbeiträge) |
| Q13 | Valenzuela, A.; Raghubir, P.: Position-Based Beliefs: The Center-Stage Effect. Journal of Consumer Psychology 19(2), 2009, 185–196. https://merit.url.edu/en/publications/position-based-beliefs-the-center-stage-effect/ | A |
| Q14 | Atalay, A. S.; Bodur, H. O.; Rasolofoarison, D.: Shining in the Center: Central Gaze Cascade Effect on Product Choice. Journal of Consumer Research 39(4), 2012, 848–866. https://hal.archives-ouvertes.fr/hal-01947459 | A |
| Q15 | Jachimowicz, J. M.; Duncan, S.; Weber, E. U.; Johnson, E. J.: When and Why Defaults Influence Decisions: A Meta-Analysis of Default Effects. Behavioural Public Policy 3(2), 2019, 159–186. https://ideas.repec.org/a/cup/bpubpo/v3y2019i02p159-186_00.html | A |
| Q16 | Goodman, J. K.; Broniarczyk, S. M.; Griffin, J. G.; McAlister, L.: Help or Hinder? When Recommendation Signage Expands Consideration Sets and Heightens Decision Difficulty. Journal of Consumer Psychology 23(2), 2013, 165–174. https://sites.utexas.edu/sbroniarczyk/publications/ | U (Inhalt nicht am Original geprüft) |
| Q17 | Cai, H.; Chen, Y.; Fang, H.: Observational Learning: Evidence from a Randomized Natural Field Experiment. American Economic Review 99(3), 2009, 864–882. https://www.nber.org/papers/w13516 | A |
| Q18 | Morwitz, V. G.; Greenleaf, E. A.; Johnson, E. J.: Divide and Prosper: Consumers' Reactions to Partitioned Prices. Journal of Marketing Research 35, 1998, 453–463. https://business.columbia.edu/faculty/research/divide-and-prosper-why-firms-divide-prices-instead-charging-single-price | A |
| Q19 | Greenleaf, E. A.; Johnson, E. J.; Morwitz, V. G.; Shalev, E.: The Price Does Not Include Additional Taxes, Fees, and Surcharges: A Review of Research on Partitioned Pricing. Journal of Consumer Psychology 26(1), 2016, 105–124. https://cris.openu.ac.il/en/publications/the-price-does-not-include-additional-taxes-fees-and-surcharges-a/ · Stellungnahme Morwitz vor dem US-Senatsausschuss (Jahr nicht ermittelt): https://www.commerce.senate.gov/services/files/31CC9415-0371-476F-9041-992CEE3A217F | A (Moderatoren S) |
| Q20 | Blake, T.; Moshary, S.; Sweeney, K.; Tadelis, S.: Price Salience and Product Choice. Marketing Science 40(4), 2021, 619–636. https://faculty.haas.berkeley.edu/stadelis/AIP.pdf | A (Prozentwerte S) |
| Q21 | Mohan, B.; Buell, R. W.; John, L. K.: Lifting the Veil: The Benefits of Cost Transparency. Marketing Science, 2020. Pressemitteilung INFORMS: https://informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Cost-Transparency-Can-Increase-Sales-20 | A |
| Q22 | Buell, R. W.; Norton, M. I.: The Labor Illusion. Management Science, 2011; Buell, R. W.; Kim, T.; Tsay, C.-J.: Creating Reciprocal Value Through Operational Transparency. Management Science (2016/2017). https://dash.harvard.edu/entities/publication/73120378-fdcc-6bd4-e053-0100007fdf3b | S |
| Q23 | Lambrecht, A.; Skiera, B.: Paying Too Much and Being Happy About It: Existence, Causes, and Consequences of Tariff-Choice Biases. Journal of Marketing Research 43, 2006, 212–223. https://www.anderson.ucla.edu/documents/areas/fac/marketing/paying_too_much.pdf | A |
| Q24 | Gourville, J. T.: Pennies-a-Day: The Effect of Temporal Reframing on Transaction Evaluation. Journal of Consumer Research 24(4), 1998, 395–408. https://ideas.repec.org/a/oup/jconrs/v24y1998i4p395-408.html | A (Betragsgrenze S) |
| Q25 | Foubert, B.; Gijsbrechts, E.: Try It, You'll Like It—Or Will You? The Perils of Early Free-Trial Promotions for High-Tech Service Adoption. Marketing Science 35(5), 2016, 810–826. https://pubsonline.informs.org/doi/10.1287/mksc.2015.0973 | A |
| Q26 | Suwelack, T.; Hogreve, J.; Hoyer, W. D.: Understanding Money-Back Guarantees: Cognitive, Affective, and Behavioral Outcomes. Journal of Retailing 87(4), 2011, 462–478. https://ideas.repec.org/a/eee/jouret/v87y2011i4p462-478.html | A |
| Q27 | Luguri, J.; Strahilevitz, L. J.: Shining a Light on Dark Patterns. Journal of Legal Analysis 13(1), 2021, 43–109. https://academic.oup.com/jla/article/13/1/43/6180579 · Quoten aus Vortragsfolien (CPPA, 2022): https://cppa.ca.gov/meetings/materials/20220329_30_day_1_item_2c_strahilevitz.pdf | A (Quoten S) |
| Q28 | Mathur, A. u. a.: Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites. Proceedings of the ACM on Human-Computer Interaction (CSCW), 2019. https://arxiv.org/abs/1907.07032 | A |
| Q29 | Fogg, B. J. u. a.: How Do Users Evaluate the Credibility of Web Sites? A Study with over 2,500 Participants. DUX 2003 (Bericht Consumer WebWatch 2002). https://advocacy.consumerreports.org/research/how-do-people-evaluate-a-web-sites-credibility | S |
| Q30 | Stanford Persuasive Technology Lab: Stanford Guidelines for Web Credibility, 2002. https://credibility.stanford.edu/guidelines | A (Kontakt-Leitlinie S) |
| Q31 | Nielsen Norman Group: Trustworthiness in Web Design: 4 Credibility Factors, 2016. https://www.nngroup.com/articles/trustworthy-design/ | A (nur Anfang des Artikels) |
| Q32 | Nielsen Norman Group: B2B Trust from B2C (Jahr nicht ermittelt). https://www.nngroup.com/articles/b2b-trust-from-b2c/ | A |
| Q33 | Nielsen Norman Group: Show Prices for Common Scenarios (Jahr nicht ermittelt). https://www.nngroup.com/articles/show-prices-for-common-scenarios/ | A |
| Q34 | Nielsen Norman Group: Comparison Tables for Products, Services, and Features (Artikel, Jahr nicht ermittelt) und Video „3 Rules for Better Comparison Tables“. https://www.nngroup.com/articles/comparison-tables/ · https://www.nngroup.com/videos/ux-rules-comparison-tables/ | A (Video), U (Einzelregeln) |
| Q35 | Gartner: Insights-Kurzfassung, 19.02.2024 (75 % bevorzugen Kauf ohne Vertrieb; 43 % vs. 26 % hohe Reue). https://www.gartner.com/en/documents/5205463 | A |
| Q36 | Gartner: Gartner Sales Survey Finds 61% of B2B Buyers Prefer a Rep-Free Buying Experience, Pressemitteilung 25.06.2025 (n = 632). https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-sales-survey-finds-61-percent-of-b2b-buyers-prefer-a-rep-free-buying-experience | A |
| Q37 | Gartner: Gartner Sales Survey Finds 67% of B2B Buyers Prefer a Rep-Free Experience, Pressemitteilung 09.03.2026 (n = 646). https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience | A |
| Q38 | Gartner: The New B2B Buying Journey (2018/2019), zitiert bei Insightly: https://insightly.com/blog/newb2bbuyingprocess/ und Foleon: https://www.foleon.com/blog/b2b-buyer-process | S |
| Q39 | Gartner: Customer Confidence (Buyer Enablement, 3× „high-value, low-regret deal“). https://www.gartner.com/en/sales/insights/customer-confidence | A (Methode unbekannt) |
| Q40 | 6sense: 6sense Launches 2024 Buyer Experience Report, Pressemitteilung 09.10.2024. https://www.businesswire.com/news/home/20241009142556/en/6sense-Launches-2024-Buyer-Experience-Report-Unveiling-Global-B2B-Buyer-Trends | A (Herstellerbefragung) |
| Q41 | TrustRadius: 2022 B2B Buying Disconnect: The Age of the Self-Serve Buyer (n = 2.185). https://go.trustradius.com/rs/827-FOI-687/images/TrustRadius_2022_B2B_Buying_Disconnect_6.27.22.pdf · 2021 B2B Buying Disconnect (Informationsquellen): https://www.trustradius.com/vendor-blog/b2b-buying-disconnect-2021 | A |
| Q42 | Forrester: The State of Business Buying, 2024, Pressemitteilung. https://www.forrester.com/press-newsroom/forrester-the-state-of-business-buying-2024 | U („13 Beteiligte“ nicht bestätigt) |
| Q43 | Capterra: 2024 U.S. Tech Trends Report (veröffentlicht 2023). https://www.capterra.com/resources/us-tech-trends · Gartner Digital Markets: Why Software Buyers Experience Regret (n = 3.484). https://view.ceros.com/gartner/dm-2559031-gdm-vm-ceros-infographic-q4-abr · Capterra 2026 Software Buying Trends (Pressemitteilung 07.10.2025). https://www.businesswire.com/news/home/20251007148096/en | A (58 %, 60 %), S (Gründe, 89 %) |
| Q44 | Navattic: State of the Interactive Product Demo 2025. https://navattic.com/report/state-of-the-interactive-product-demo-2025 | A (Herstellerdaten) |
| Q45 | Brandall, B. (Process Street): I Analyzed 250 SaaS Pricing Pages — Here's What I Found, 2015. https://www.process.st/saas-pricing-pages/ | A (Nenner unklar) |
| Q46 | FastSpring: Three-Tier Pricing Strategy for SaaS: Is It Still Ideal?, 2022. https://fastspring.com/blog/three-tier-pricing-strategy-for-saas-is-it-still-ideal/ | A |
| Q47 | ProfitWell (Paddle): Annual vs. Monthly Billing (Jahr nicht ermittelt). https://learn.profitwell.com/blog/annual-vs-monthly-billing | A (Rabattspannen S) |
| Q48 | Mohammed, R.: The Good-Better-Best Approach to Pricing. Harvard Business Review, September/Oktober 2018. Katalogeintrag: https://bookshare.org/browse/book/2271405 | S |
| Q49 | BGH, Urteil vom 29.04.2010, I ZR 99/08. https://rws-verlag.de/fileadmin/zbb-volltexte/1zr9908.pdf · IT-Recht Kanzlei: Werbung mit Nettopreisen im B2B. https://www.it-recht-kanzlei.de/werbung-netto-preise-b2b.html | A (Urteil), S (Auslegung) |
| Q50 | Preisangabenverordnung § 1 (Fassung ab 28.05.2022). https://www.buzer.de/1_Preisangabenverordnung.htm · IHK Düsseldorf: Preisangaben gegenüber Verbrauchern. https://www.ihk.de/duesseldorf/recht-und-steuern/recht/merkblaetter-von-a-bis-z/preisangaben-gegenueber-verbrauchern-5121326 | A |
| Q51 | Gesetz gegen den unlauteren Wettbewerb, § 5a. https://www.gesetze-im-internet.de/uwg_2004/__5a.html | A |
| Q52 | Händlerbund: Abmahnung wegen Werbung erhalten? (Jahr nicht ermittelt). https://www.haendlerbund.de/de/leistungen/rechtssicherheit/hilfe-bei-abmahnung/abmahnung-werbung | A |
| Q53 | Fieldfisher: Gesetz für faire Verbraucherverträge. https://www.fieldfisher.com/de-de/insights/gesetz-fur-faire-verbrauchervertrage · Händlerbund: Kündigungsbutton nach § 312k BGB. https://www.haendlerbund.de/de/ratgeber/recht/kuendigungsbutton-nach-312k-bgb | A (B2B-Abgrenzung U) |
| Q54 | Villar, A.; Callegaro, M.; Yang, Y.: Where Am I? A Meta-Analysis of Experiments on the Effects of Progress Indicators for Web Surveys. Social Science Computer Review 31(6), 2013, 744–762. https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/ | A (Kritik S) |
| Q55 | Spiegel Research Center (Northwestern University): How Online Reviews Influence Sales, 2017. Kopie: https://www.xait.com/hubfs/Spiegel_Online-Review_eBook_Jun2017_FINAL.pdf | S |
| Q56 | Nielsen Norman Group, Themenseite Mobile (Karussells: geringe Auffindbarkeit, nur nacheinander zugänglich). https://www.nngroup.com/topic/mobile-and-tablet-design/?page=4 · Smashing Magazine: Usability Guidelines for Better Carousels UX, 2022. https://smashingmagazine.com/2022/04/designing-better-carousel-ux | A (NN/g-Satz), S (Zahlen) |
| Q57 | Bitkom/ZDH: Zwischen Tradition und Innovation – Das Handwerk wird digital, Pressemitteilung 2020 (502 Interviews). https://www.bitkom.org/Presse/Presseinformation/Zwischen-Tradition-und-Innovation-brDas-Handwerk-wird-digital.html | A |

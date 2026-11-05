# Titel und Beschreibungen der Ratgeberseiten, 05.11.2026

## Auftrag

Der Inhaber: jede Ratgeberseite einzeln prüfen, für welche Suchbegriffe sie gebaut ist, ob Titel und Beschreibung (die Anzeige bei Google) das enthalten, was Suchende erwarten, um die Klickrate zu erhöhen und Absprünge zu vermeiden; dazu prüfen, ob die Systematik für Suchmaschinen und KI-Assistenten Verbesserungen braucht, damit Google besser crawlen kann.

## Vorgehen

- 42 Seiten: 31 Ratgeber für Hauseigentümer, die Übersicht `/ratgeber/` und 10 Unterseiten von `/fuer-fensterbauer/`.
- Suchbegriffe aus dem Abschnitt „Suchbegriffe in Deutschland“ in docs/SEO.md (Vorschläge der Google-Suche, Oktober 2026). Neue Vorschläge und die Live-Seite waren aus der Sitzung nicht erreichbar (Netzwerkregeln: `suggestqueries.google.com`, `eeziframes.com`).
- Je Hauptbegriff eine Stichprobe der Suchergebnisse über das Suchwerkzeug (41 Suchen, US-Index; Reihenfolge und Titel können auf google.de anders sein): was die Treffer versprechen und welche Frage sie offenlassen.
- Breite in Pixeln statt Zeichen: Titel Arial 20 px, Beschreibung Arial 14 px (Liberation Sans hat dieselben Laufweiten), Grenzen nach dem Snippet-Generator von Sistrix für den Schreibtisch: Titel 580 px, Beschreibung 990 px. Google nennt keine feste Grenze und kürzt nach Gerätebreite; den Websitenamen zeigt Google in einer eigenen Zeile über dem Titel.
- Jede Zahl und jedes Versprechen im neuen Snippet gegen den Seitentext geprüft.

## Befund im Überblick

| Punkt | Vorher | Nachher |
| --- | --- | --- |
| Titel ganz über 580 px (Marke fällt auf dem Schreibtisch weg) | 39 von 42 | 38 von 42, gewollt: nur die Marke fällt weg |
| Kern des Titels (ohne Marke) über 580 px | 3 (Brüstungshöhe, Fenstertausch Altbau, Fensterbau-Software) | 0 |
| Beschreibung über 990 px | 22 von 42 | 0 |
| Versprechen, das die Seite nicht oder nur halb hält | 4 (Baujahr „in 3 Minuten“, Lüftungskonzept „Kosten“, Fenster vergrößern „Kosten“, Aufmaßblatt „als PDF“ als Download missverständlich) | 0 |
| Wortlaut der Suche verfehlt | 8 (Raum für Raum, Material, KI, Baujahr, Haus gekauft ohne „Sanierungspflicht“, Öffnungsarten ohne „Festverglasung“, Kellerfenster ohne „Maße“, Übersicht) | 0 |
| Titel / Beschreibungen neu | | 38 / 41 (Stand aller 42 Seiten 05.11.2026) |

## Je Seite

Px-Werte: Titel ohne Marke / Beschreibung. Begründung je Seite im Bericht (Artifact).

| Seite | Titel vorher | Titel neu | Beschreibung neu | px vorher | px neu |
| --- | --- | --- | --- | --- | --- |
| `/ratgeber/` | Ratgeber neue Fenster: prüfen, auswählen, ausmessen \| eeziframes | Fenster-Ratgeber: in 6 Schritten zu neuen Fenstern \| eeziframes | Von der ersten Frage bis zum Einbau: Zustand prüfen, reparieren oder tauschen, Material und Glas wählen, selbst ausmessen, Angebote vergleichen. | 494 / 1009 | 457 / 930 |
| `/ratgeber/aufmassblatt-fenster/` | Aufmaßblatt Fenster als PDF: 12 Punkte, die draufgehören \| eeziframes | Aufmaßblatt Fenster (PDF): 12 Angaben, die draufgehören \| eeziframes | Was aufs Aufmaßblatt gehört: 12 Angaben je Fenster, von drei Breiten bis zu zwei Fotos. Statt leerer Vorlage fragt die App jeden Punkt ab und macht das PDF. | 522 / 986 | 521 / 985 |
| `/ratgeber/balkontuer-ausmessen/` | Balkontür ausmessen: Terrassentür, Hebe-Schiebe- und PSK-Tür \| eeziframes | Balkontür und Terrassentür ausmessen in 6 Schritten \| eeziframes | Die Höhe misst du ab dem fertigen Fußboden, sonst wie beim Fenster. Wie hoch die Schwelle sein darf und was Hebe-Schiebe- und PSK-Tür unterscheidet. | 579 / 1038 | 470 / 970 |
| `/ratgeber/bestellmass-fenster/` | Bestellmaß Fenster berechnen: Fuge je Seite, Tabelle, Beispiel \| eeziframes | Bestellmaß Fenster berechnen: Wie viel kleiner muss es sein? \| eeziframes | Nach Herstellerangabe mindestens 10 mm Fuge je Seite bei weißen Kunststofffenstern bis 1,5 m, bei farbigen 5 mm mehr. Mit Tabelle und Rechenbeispiel. | 558 / 989 | 552 / 961 |
| `/ratgeber/bruestungshoehe-fenster/` | Brüstungshöhe Fenster: 80 oder 90 cm? Mindestmaß und Geländer \| eeziframes | Brüstungshöhe Fenster: 80 oder 90 cm laut Bauordnung? \| eeziframes | Meist mindestens 80 cm, ab 12 m Absturzhöhe 90 cm, Bayern regelt es anders. So misst du die Brüstungshöhe richtig und das hilft, wenn sie zu niedrig ist. | 600 / 958 | 510 / 962 |
| `/ratgeber/din-links-rechts/` | Fenster DIN links oder rechts? Die Hand-Regel mit Bild \| eeziframes | Fenster DIN links oder rechts? Hand-Regel mit Bild \| eeziframes | Von der Seite, zu der das Fenster aufgeht, also meist von innen: Sitzen die Bänder links, ist es DIN links. Mit Hand-Regel und Symbol in der Zeichnung. | 489 / 991 | 454 / 940 |
| `/ratgeber/dreifachverglasung/` | Dreifachverglasung oder Zweifach: Lohnt sich 3-fach-Glas? \| eeziframes | Dreifachverglasung: Lohnt sich das? 2-fach oder 3-fach \| eeziframes | Für die meisten neuen Fenster ja: fast 20 % besser als Zweifachglas, meist Pflicht für die Förderung, im Schnitt 40 bis 60 € Aufpreis. Dazu die Nachteile. | 526 / 996 | 491 / 945 |
| `/ratgeber/fenster-alter-erkennen/` | Wie alt sind meine Fenster? Baujahr in 3 Minuten erkennen \| eeziframes | Fenster-Baujahr erkennen: Wie alt sind meine Fenster? \| eeziframes | Am Abstandhalter zwischen den Scheiben steht oft das Datum der Verglasung. Dazu Feuerzeugtest, Tabelle nach Bauzeit und wie lange Fenster halten. | 526 / 934 | 491 / 944 |
| `/ratgeber/fenster-angebot-vergleichen/` | Fensterangebote vergleichen: Checkliste, Beispiel, Warnzeichen \| eeziframes | Fenster-Angebote vergleichen: Checkliste und Beispiel \| eeziframes | Vergleichbar sind Angebote erst bei gleichem Aufmaß und gleicher Leistung. Mit Checkliste, einem Beispiel, in dem das teurere günstiger ist, und Warnzeichen. | 571 / 977 | 486 / 989 |
| `/ratgeber/fenster-ausmessen/` | Fenster ausmessen in 6 Schritten: Anleitung auch für Altbau \| eeziframes | Fenster ausmessen: Anleitung in 6 Schritten, auch Altbau \| eeziframes | Für neue Fenster misst du innen die Maueröffnung an je drei Stellen, das kleinste Maß zählt. Mit Skizze, Beispiel, Altbau-Tipps und typischen Fehlern. | 530 / 1013 | 509 / 929 |
| `/ratgeber/fenster-austauschen/` | Fenster austauschen 2026: Kosten pro Fenster, Ablauf, Dauer \| eeziframes | Fenster austauschen 2026: Kosten pro Fenster und Ablauf \| eeziframes | Ein einflügeliges Kunststofffenster mit Fensterbänken kostet im Altbau im Schnitt rund 1.050 € netto (BKI 2026). Dazu Ablauf, Dauer, Förderung und Checkliste. | 549 / 970 | 519 / 989 |
| `/ratgeber/fenster-beschlagen/` | Fenster beschlagen innen, außen oder zwischen den Scheiben? \| eeziframes | Fenster beschlagen: innen, außen oder zwischen den Scheiben \| eeziframes | Wo das Wasser sitzt, verrät die Ursache: innen zu feuchte Luft, außen gut dämmendes Glas, dazwischen ein defekter Randverbund. Mit Wischtest und Tipps. | 571 / 986 | 565 / 977 |
| `/ratgeber/fenster-foerderung-2026/` | Fenster-Förderung 2026: Zuschuss, Uw-Wert, Prozent \| eeziframes | Fenster-Förderung 2026: 15 % Zuschuss, bis 4.500 € \| eeziframes | 15 % BAFA-Zuschuss auf bis zu 30.000 € je Wohnung und Jahr, Uw höchstens 0,95, Antrag vor dem Auftrag. Was seit Juli gilt und alte Quellen falsch nennen. | 482 / 947 | 474 / 982 |
| `/ratgeber/fenster-foerderung-beantragen/` | Fenster-Förderung beantragen: Ablauf beim BAFA \| eeziframes | Fenster-Förderung beantragen: BAFA in 10 Schritten \| eeziframes | Den BAFA-Zuschuss beantragst du vor dem Auftrag, nur mit Energieeffizienz-Experte und Vertrag unter Bedingung. Ablauf in 10 Schritten, Unterlagen, Fristen. | 445 / 959 | 469 / 984 |
| `/ratgeber/fenster-material-vergleich/` | Fenstermaterial im Vergleich: Kunststoff, Holz oder Alu? \| eeziframes | Kunststoff-, Holz- oder Alufenster? Preise im Vergleich \| eeziframes | Kunststoff ist am günstigsten, Holz lässt sich reparieren, Holz-Alu und Alu halten am längsten. Preise, Lebensdauer, Pflege und Dämmung in einer Tabelle. | 494 / 946 | 482 / 959 |
| `/ratgeber/fenster-mit-rollladen-ausmessen/` | Fenster mit Rollladenkasten ausmessen: Aufsatz, Einbau, Vorbau \| eeziframes | Fenster mit Rollladenkasten ausmessen: Aufsatz oder Einbau? \| eeziframes | Erst den Kasten bestimmen: Beim Aufsatzkasten misst du bis zu seiner Oberkante, beim Einbaukasten bis zur Unterkante. Mit Zeichnung und Kastenhöhen. | 580 / 1046 | 558 / 969 |
| `/ratgeber/fenster-nach-und-nach-tauschen/` | Fenster nach und nach tauschen oder alle auf einmal? \| eeziframes | Fenster nach und nach tauschen oder alle auf einmal? \| eeziframes | Ein Auftrag spart Anfahrt und Abstimmung, Etappen schonen das Budget und nutzen die Fördergrenze von 30.000 € je Jahr mehrfach. Welche Fenster zuerst? | 483 / 930 | 483 / 986 |
| `/ratgeber/fenster-oder-daemmung-zuerst/` | Fenster oder Dämmung zuerst? Reihenfolge im Altbau \| eeziframes | Fenster oder Dämmung zuerst? Reihenfolge im Altbau \| eeziframes | Am besten zusammen planen. Kommt die Dämmung später, richtet sich die Lage des neuen Fensters schon nach ihr, sonst drohen Tauwasser und Schimmel. | 483 / 974 | 484 / 981 |
| `/ratgeber/fenster-oeffnungsarten/` | Fenster-Öffnungsarten: Dreh-Kipp, Kipp, Stulp oder fest? \| eeziframes | Fenster-Öffnungsarten: Dreh-Kipp, Stulp, Festverglasung \| eeziframes | Dreh-Kipp, Kipp, Stulp, Pfosten oder Festverglasung: was jede Öffnungsart kann, wo sie passt und welches Fenster du besser nicht fest verglasen lässt. | 504 / 944 | 507 / 944 |
| `/ratgeber/fenster-planen-raum-fuer-raum/` | Fenster planen Raum für Raum: Welche Fenster wohin \| eeziframes | Welche Fenster für welchen Raum? Bad, Küche, Kinderzimmer \| eeziframes | Milchglas ins Bad, abschließbare Griffe ins Kinderzimmer, Schallschutz zur Straße, RC 2 im Erdgeschoss: die Tabelle für jeden Raum. | 489 / 953 | 561 / 831 |
| `/ratgeber/fenster-reparieren-oder-austauschen/` | Fenster reparieren oder austauschen? Entscheidung in 3 Fragen \| eeziframes | Fenster reparieren oder austauschen? Entscheidung in 3 Fragen \| eeziframes | Austauschen, wenn der Rahmen morsch oder verzogen ist oder das Fenster von vor 1995 stammt, sonst reparieren. Mit Kosten für Dichtung, Glas und Tausch. | 574 / 997 | 574 / 987 |
| `/ratgeber/fenster-standardmasse/` | Fenster-Standardmaße: Tabelle mit Rohbau- und Fenstermaßen \| eeziframes | Fenster-Standardmaße: Tabelle der üblichen Größen \| eeziframes | Feste Fenstergrößen gibt es nicht mehr. Im Neubau misst eine Öffnung meist ein Vielfaches von 12,5 cm plus 1 cm, etwa 101 cm. Tabelle mit Beispielmaßen. | 570 / 1032 | 469 / 975 |
| `/ratgeber/fenster-steuerlich-absetzen/` | Fenster steuerlich absetzen: Bonus oder Zuschuss? \| eeziframes | Fenster steuerlich absetzen: 20 % Bonus oder 15 % Zuschuss? \| eeziframes | Wohnst du selbst im Haus, sinkt deine Steuer über drei Jahre um 20 % der Kosten, bei Uw höchstens 0,95. Mit dem Zuschuss kombinieren geht nicht. | 461 / 984 | 564 / 930 |
| `/ratgeber/fenster-undicht/` | Fenster undicht? Zugluft in 1 Minute prüfen und beheben \| eeziframes | Fenster undicht? Zugluft in 1 Minute finden und beheben \| eeziframes | Der Papiertest zeigt in einer Minute, wo es zieht: Dichtung, Beschlag oder Fuge zur Wand. Was du selbst tun kannst und wann sich neue Fenster lohnen. | 504 / 1067 | 501 / 949 |
| `/ratgeber/fenster-vergroessern/` | Fenster vergrößern: Statik, Genehmigung und Kosten \| eeziframes | Fenster vergrößern im Altbau: Baugenehmigung und Statik \| eeziframes | In vielen Ländern ohne Bauantrag, aber nicht ohne Statik: Ein Tragwerksplaner legt den neuen Sturz fest. Dazu bodentiefe Fenster und die Kostenposten. | 476 / 951 | 523 / 954 |
| `/ratgeber/fensterbank-ausmessen/` | Fensterbank ausmessen innen und außen: Überstand, Gefälle \| eeziframes | Fensterbank ausmessen: innen und außen, mit Überstand \| eeziframes | Länge zwischen den Laibungen, Tiefe vom Rahmen bis zur Wand, plus Zugabe. Außen mindestens 40 mm Überstand und 5 Grad Gefälle. Mit Skizze. | 553 / 1041 | 516 / 930 |
| `/ratgeber/fenstertausch-altbau/` | Fenstertausch Altbau: so vermeidest du Schimmel an der Laibung \| eeziframes | Fenstertausch Altbau: Schimmel an der Laibung vermeiden \| eeziframes | Neue, dichte Fenster machen Laibung und Sturz zur kalten Stelle. Wann die Laibung gedämmt werden muss, wie abgedichtet wird und wie du richtig lüftest. | 584 / 981 | 526 / 967 |
| `/ratgeber/haus-gekauft-fenster/` | Haus gekauft: Musst du die Fenster tauschen? \| eeziframes | Haus gekauft oder geerbt: Sanierungspflicht für Fenster? \| eeziframes | Nein. Nach Kauf oder Erbe musst du binnen zwei Jahren Geschossdecke und Leitungen dämmen, die Fenster nicht. Was beim Tausch gilt, welche Förderung. | 414 / 975 | 504 / 982 |
| `/ratgeber/kellerfenster-ausmessen/` | Kellerfenster ausmessen: Maueröffnung, Zarge und Lichtschacht \| eeziframes | Kellerfenster ausmessen: Zarge, Öffnung, Standardmaße \| eeziframes | Bleibt die Zarge, misst du ihr lichtes Innenmaß, sonst die Maueröffnung wie bei jedem Fenster. Mit Größentabelle, Lichtschacht, Einbruchschutz, Rettungsweg. | 573 / 1059 | 509 / 983 |
| `/ratgeber/lueftungskonzept-fenstertausch/` | Lüftungskonzept beim Fenstertausch: Pflicht, Lösungen, Kosten \| eeziframes | Lüftungskonzept beim Fenstertausch: Wann ist es Pflicht? \| eeziframes | Ab mehr als einem Drittel getauschter Fenster verlangt die Norm DIN 1946-6 ein Lüftungskonzept. Ob du eine Lüftungsanlage brauchst und wer es erstellt. | 566 / 955 | 514 / 960 |
| `/ratgeber/ral-montage-fenster/` | RAL-Montage Fenster: 3 Ebenen einfach erklärt, mit Prüfliste \| eeziframes | RAL-Montage Fenster einfach erklärt: Ist sie Pflicht? \| eeziframes | Innen luftdicht, Mitte gedämmt, außen schlagregendicht: RAL-Montage einfach erklärt. Ob sie Pflicht ist, ob Bauschaum reicht und wie du den Einbau prüfst. | 540 / 981 | 462 / 967 |
| `/ratgeber/uw-wert-fenster/` | Uw-Wert beim Fenster: Bedeutung, Berechnung, Grenzwerte \| eeziframes | Uw-Wert Fenster: Was ist ein guter Wert? Grenzwerte 2026 \| eeziframes | Je kleiner, desto besser: Beim Austausch verlangt das Gesetz höchstens 1,3, die Förderung 0,95 W/(m²K). Was Uw, Ug und Uf bedeuten, mit Rechenbeispiel. | 541 / 1004 | 528 / 979 |
| `/fuer-fensterbauer/aufmass-kostenpflichtig/` | Aufmaß kostenpflichtig? Anfahrtspauschale richtig vereinbaren \| eeziframes | Aufmaß kostenlos oder kostenpflichtig? Die Rechtslage \| eeziframes | In der Regel kostenlos: Geld für Aufmaß oder Anfahrt gibt es nur mit vorheriger, ausdrücklicher Vereinbarung, AGB genügen nicht. Mit Beispielrechnung. | 554 / 1007 | 490 / 945 |
| `/fuer-fensterbauer/digitales-aufmass/` | Digitales Aufmaß für Fenster: Laser, LiDAR, Foto oder Kunde? \| eeziframes | Digitales Aufmaß Fenster: Laser, LiDAR, Foto im Vergleich \| eeziframes | Laser misst auf etwa 1,5 mm genau, LiDAR und Foto auf 1 bis 2 cm. Was DIN 18202 an der Öffnung erlaubt und wann ein Kundenaufmaß fürs Angebot reicht. | 554 / 1067 | 520 / 982 |
| `/fuer-fensterbauer/erstaufmass-feinaufmass/` | Erstaufmaß und Feinaufmaß: Unterschied, Prüfliste, Toleranzen \| eeziframes | Erstaufmaß und Feinaufmaß: Unterschied und Prüfliste \| eeziframes | Das Erstaufmaß liefert die Maße fürs Angebot und kann vom Kunden kommen, das Feinaufmaß nehmen Sie vor der Bestellung. Mit Prüfliste und Toleranzen. | 564 / 1002 | 489 / 975 |
| `/fuer-fensterbauer/falsches-aufmass-haftung/` | Falsches Aufmaß: Wer haftet, wenn Fenster nicht passen? \| eeziframes | Falsches Aufmaß bei Fenstern: Wer haftet? Die 3 Fälle \| eeziframes | Wer misst, trägt das Risiko: drei Fälle vom Betrieb bis zum Kunden, Mängelrechte, Verjährung, Toleranzen nach DIN 18202 und sechs Regeln zum Absichern. | 519 / 1070 | 488 / 980 |
| `/fuer-fensterbauer/fenster-konfigurator-website/` | Fenster-Konfigurator für die Website: 4 Wege und Kosten \| eeziframes | Fenster-Konfigurator für die Website: 4 Wege, Kosten \| eeziframes | Kostenloses Widget, Hersteller, Agentur oder fertig gemietet unter Ihrer Domain: vier Wege im Vergleich, was sie kosten und wem die Anfragen gehören. | 509 / 1060 | 475 / 946 |
| `/fuer-fensterbauer/fensterangebot-erstellen/` | Fenster-Angebot erstellen: vom Kundenaufmaß zum Angebot \| eeziframes | Fenster-Angebot erstellen: Inhalt, Bindefrist, Widerruf \| eeziframes | Was in ein Fensterangebot gehört, Kundenmaße mit Feinaufmaß-Vorbehalt, wie lange es bindet, Widerruf bei Annahme per E-Mail und wann Sie nachfassen. | 544 / 1004 | 471 / 978 |
| `/fuer-fensterbauer/fensterbau-software/` | Fensterbau-Software 2026: ERP, Aufmaß-App oder Selbstaufmaß? \| eeziframes | Fensterbau-Software 2026: 4 Arten im Überblick \| eeziframes | Branchensoftware und ERP, Handwerkersoftware, Aufmaß-App oder Selbstaufmaß: was jede Art leistet, ob es sie kostenlos gibt und wie Sie auswählen. | 595 / 1113 | 428 / 945 |
| `/fuer-fensterbauer/geplatzter-aufmasstermin/` | Geplatzter Aufmaßtermin: Was er kostet und wie Sie vorbeugen \| eeziframes | Geplatzter Aufmaßtermin: Kosten und Ausfallpauschale \| eeziframes | Im Beispiel kostet ein geplatzter Aufmaßtermin rund 116 € für Fahrzeug und Arbeitszeit. Ob Sie ihn berechnen dürfen und fünf Wege, vorzubeugen. | 564 / 1049 | 492 / 913 |
| `/fuer-fensterbauer/ki-im-fensterbau/` | KI im Fensterbau: was im Handwerk heute wirklich hilft \| eeziframes | KI im Handwerk: Was im Fensterbau 2026 wirklich hilft \| eeziframes | KI hilft bei Angebotstexten, beim Sortieren von Anfragen und beim Lesen von Fotos. Was sie nicht kann und was Datenschutz und KI-Verordnung verlangen. | 485 / 1060 | 483 / 971 |
| `/fuer-fensterbauer/leads-fensterbau/` | Fenster-Leads kaufen oder Anfragen selbst gewinnen? \| eeziframes | Fenster-Leads kaufen oder Anfragen selbst gewinnen? \| eeziframes | Gekaufte Leads kosten je Anfrage, auch ohne Auftrag, und gehen teils an mehrere Betriebe. So rechnen Sie, ob sie sich lohnen, und wie es ohne Portal geht. | 486 / 1068 | 487 / 977 |

## Änderungen

| Wo | Was | Warum |
| --- | --- | --- |
| 42 Seiten unter `web/ratgeber/` und `web/fuer-fensterbauer/` | `<title>` und `<meta name="description">` neu (38 Titel, 41 Beschreibungen), Stand, `dateModified` und beide „Stand“-Angaben auf 05.11.2026 | Suchbegriff und Versprechen im sichtbaren Teil, Antwort zuerst, nur belegte Versprechen; neuer Stand, damit Google und Bing (IndexNow) die Seiten neu abrufen |
| `functions/seo.js` | `stand` der 42 Seiten und `STAND` auf 2026-11-05; mit Freigabe `X-Robots-Tag: max-image-preview:large` (`VORSCHAU`) statt keiner Kopfzeile | große Bildvorschau in Discover und neben dem Treffer; Google-Fallstudie: Klickrate in Discover deutlich höher |
| `scripts/ratgeber-bausteine.mjs` (`vorschau()`), alle 41 Unterseiten | `Article.image`: Vorschaubild 1200 × 630 als `ImageObject` vor der Zeichnung | Google empfiehlt für Artikel hochauflösende Bilder; die SVG-Zeichnung allein hat keine Pixelgröße |
| `scripts/pruefen.mjs`, Abschnitt 10 | neue Prüfung: Titel ohne Marke höchstens 580 px, endet mit „| eeziframes“, Beschreibung höchstens 990 px, auf allen 42 Seiten; Erwartungen an `X-Robots-Tag` und das Bild im JSON-LD angepasst | damit kein neuer Titel die Regel reißt |
| `docs/SEO.md` | Regeln „Titel und Beschreibung im Suchergebnis“, Technik (Bildvorschau, Bild im JSON-LD), Freigabe-Prüfung | Regel für künftige Seiten |

## Geprüft

- Ganze Prüfsuite grün (1.772 Prüfungen, alle Abschnitte); Abschnitt 10 allein 298, darunter die neue Längenprüfung: längster Titelkern 574 px, längste Beschreibung 989 px; IndexNow meldet nach dem Onlinestellen die 42 geänderten Seiten.
- Das Bauskript ist wiederholbar: zweiter Lauf ändert keine Datei.
- Lokal mit `INDEXIERUNG=1`: robots.txt, Sitemap (53 Adressen), Canonical in Kopfzeile und HTML, `X-Robots-Tag: max-image-preview:large`.

## Offen

- Live-Abruf: eeziframes.com, Googles Suchvorschläge und Google selbst sind aus dieser Sitzung gesperrt. Freigeben lässt sich das in den Einstellungen der Umgebung unter Netzwerkzugriff (erlaubte Domains eeziframes.com und suggestqueries.google.com).
- Search Console: Ob sie eingerichtet ist, sehe ich nicht. Die Messung oben setzt sie voraus.
- Marke im Titel: Ohne „| eeziframes“ hätte jeder Titel 114 px mehr Platz, Google zeigt den Namen ohnehin. Eure Regel verlangt die Marke, deshalb bleibt sie.
- Haus gekauft: Die Seite sagt, beim Tausch gelte Uw 1,3, nennt aber nicht die 10-%-Grenze der Fensterfläche, die die Seite Förderung 2026 mit Quelle angibt. Den Seitentext habe ich nicht geändert.
- Kosten: Bei „Fenster vergrößern“ und „Lüftungskonzept“ suchen viele nach Kosten. Die Seiten nennen bewusst keine erfundenen Beträge; belegte Spannen, etwa aus Angeboten der Pilotbetriebe, würden diese Lücke schließen.
- Jahreszahlen: Förderung 2026, Fenster austauschen 2026, Uw-Wert 2026, Fensterbau-Software 2026 und KI 2026 im Januar 2027 mit dem Inhalt prüfen und erneuern.
- Cloudflare: prüfen, dass der Bot-Schutz Googlebot, Bingbot und die KI-Suchen nicht aussperrt.

## So wird gemessen

1. Vor dem Onlinestellen in der Search Console unter Leistung → Suchergebnisse die letzten 28 Tage je Seite exportieren: Klicks, Impressionen, Klickrate, Position (Filter „Seite enthält /ratgeber/“ und „/fuer-fensterbauer/“).
2. Nach dem Onlinestellen für die zehn wichtigsten Seiten in der URL-Prüfung „Indexierung beantragen“. Google zeigt neue Titel erst nach dem nächsten Abruf.
3. Nach 28 Tagen denselben Zeitraum vergleichen, Seite für Seite und nur bei ähnlicher Position: Die Klickrate hängt stark an der Position (Sistrix 2020: Platz 1 rund 28 %, Platz 10 rund 2,5 %).
4. Je Seite unter „Suchanfragen“ nachsehen, welche Begriffe die Impressionen bringen. Dominiert ein anderer Begriff als in dieser Tabelle, den Titel daran ausrichten.
5. Stichproben in Google: Zeigt Google einen anderen Titel als den eigenen, notieren und den Titel nachschärfen. Wo eine KI-Übersicht erscheint, fallen die Klicks auf Platz 1 deutlich (Sistrix für Deutschland, Februar 2026); dort zählt, ob eeziframes darin zitiert wird.

## Quellen

- [Google Search Central: Title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google Search Central: Snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Google Search Central: Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Google Search Central: Robots meta tag und X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Google Search Central: Fallstudie große Bilder in Discover](https://developers.google.com/search/case-studies/large-images-case-study)
- [Google Search Central Blog: Changes to HowTo and FAQ rich results, 08.08.2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Google Search Central Blog: More info about titles, September 2021](https://developers.google.com/search/blog/2021/09/more-info-about-titles)
- [Sistrix: SERP-Snippet-Generator](https://www.sistrix.com/serp-snippet-generator/)
- [Ahrefs: Meta-Description-Studie, 2020](https://ahrefs.com/blog/meta-description-study/)
- [Portent: How often Google ignores meta descriptions, 2020](https://portent.com/blog/seo/how-often-google-ignores-our-meta-descriptions.htm)
- [Zyppy: Google title rewrites, Januar 2022](https://zyppy.com/seo/google-title-rewrites/)
- [Amsive zu den Sistrix-Klickraten 2020](https://www.amsive.com/insights/seo/seo-click-through-rates-by-serp-feature-2020-sistrix-data)
- [Search Engine Journal zu Sistrix: KI-Übersichten in Deutschland, 2026](https://www.searchenginejournal.com/google-ai-overviews-cut-germanys-top-organic-ctr-by-59/)

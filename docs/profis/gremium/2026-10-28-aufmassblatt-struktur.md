# Zwei Fensterbauer mit Faible für Struktur prüfen das Aufmaßblatt, danach der Umbau (28.10.2026)

Simuliertes Gremium: zwei getrennte Agenten, eine Runde. Echte Stimmen gab es nicht. Beide kannten nur das Blatt (18 Seiten, Bilder
und Text), nicht die Urteile der vier Fensterbauer vom Vormittag (docs/profis/gremium/2026-10-28-aufmassblatt-fensterbauer.md).

- **Auftrag des Inhabers:** „… noch zwei Fensterbauer, die eine besondere Faible für die Strukturierung von so einem Dokument legen,
  also die es gerne übersichtlich haben und sehr intuitiv. Diese sollen das Blatt auch beurteilen.“ Danach das Blatt entsprechend
  verändern und mit dem Code der Website verknüpfen, „so dass bei der Konfiguration von Elementen diese Daten auch im Aufmaßblatt
  ankommen“ und das Beispiel „die tatsächlichen Ergebnisse zeigt“.

| Person | Rolle | Note | Kernsatz |
| --- | --- | --- | --- |
| Andrea Wolters | Inhaberin und Technikerin, Münster, 28 MA, 900 Aufträge/Jahr; hat Auftragsmappe und Aufmaßformular selbst neu gegliedert | 6/10 | „Das Gerüst stimmt, aber jede Positionsseite sagt mir das Wichtige dreimal und das Unwichtige dreizehnmal, und ausgerechnet die Warnung, dass das Bestellmaß nicht stimmt, steht nicht beim Bestellmaß.“ |
| Jonas Feldhaus | Fensterbaumeister, Leiter Auftragsabwicklung bei Stuttgart, 60 MA, 1.800 Aufträge/Jahr; baut Formulare für Monteure, Azubis und Innendienst | 6/10 | „Sauber gesetzt und gut zu blättern, aber das fetteste Maß auf dem Blatt ist ein Vorschlag mit offenen Fragen, und wo die Fragen sitzen, zeigt die Übersicht nicht.“ |

Mit den vier vom Vormittag (7, 6, 6, 6) liegt der Median der sechs bei 6.

## Was gut gegliedert ist (beide)

- Code aus Geschoss und Nummer, überall gleich, Übersicht mit Seitenspalte und Weg vor, zurück, Übersicht.
- Klärliste mit Kästchen und „0 von 15 geklärt“, Pflicht zuerst; Aufstellung nach Gewerk mit den Codes.
- Kleinstmaß und Abzug offen ausgewiesen, Zeichnung von innen mit den Handmaßen an ihrer Stelle.

## Was die Struktur stört

| Befund | Wer | Seite (alt) |
| --- | --- | --- |
| „Bestellmaß“ fett im schwarzen Kasten, obwohl es bei Anschlag „ohne Anschlag gerechnet“ ist; der Hinweis klein unten in der Maßkarte, nicht in der Klärliste | beide | S. 1, 6, 9 |
| Pflichtpunkte (OG-02, DG-01) in der Übersicht unsichtbar, der Ring steht nur am Maß | beide | S. 1–2 |
| Dieselbe Warnung bis zu viermal (Klärliste, oben, „Vor Ort prüfen“, „Hinweis“); Wünsche dreifach (Chips, Satz, Tabelle) | beide | S. 6, 15 |
| 13-mal dieselben Werte (Kunststoff, Griff Standard, Fensterbank behalten, Montage) und „keiner“-Zeilen | beide | S. 5–17 |
| „Element“ heißt Altfenster, Bauart, Stückzahl und Linie; „Öffnung“ heißt Maueröffnung und Öffnungsart | Feldhaus | S. 1, 5 |
| Drei Maßspalten in der Übersicht, „Element“ ohne Legende nicht als Altfenster zu erkennen | Feldhaus | S. 1–2 |
| Aufsatzkasten: mit oder ohne Kasten? Alte Innenkästen: was passiert mit ihnen? | beide | S. 8, 9, 13 |
| Rettungsweg § 35 statt § 37 Abs. 5 MBO, nicht nachgerechnet (DG-02 zu klein); Absturzfeld braucht VSG, nicht „Sicherheitsglas“ | beide | S. 2, 13, 16, 17 |
| Seitenumbrüche zerreißen das 1. OG in der Übersicht und „Vor Ort prüfen“ in der Klärliste | Wolters | S. 1/2, 2/3 |
| Klärliste nach Art statt nach Zeitpunkt; die Nachricht mit dem Hund ist kein Klärpunkt | Wolters | S. 2 |
| Breiten und Höhen im Fließtext, umgebrochen; Zahlen, die man vergleicht, nicht untereinander | Feldhaus | S. 6, 7, 12 |
| Knöpfe im Kopf tun gedruckt nichts; Rollladen- und Raffstore-Zeichen gedruckt kaum zu unterscheiden | Feldhaus | alle |
| S. 18 wiederholt S. 1 (Abzug zum dritten Mal); Fensterfläche nur ganz hinten | Wolters | S. 18 |
| „20 Fotos ausgewertet“, aber kein Foto | beide | S. 1 |

## Vorschläge der beiden

- **Wolters:** Seite 1 mit Kunde, Eckdaten, „n Pflichtpunkte offen“ groß und einem Block „Gilt für alle Positionen“; Übersicht ganz auf
  Seite 2 mit Spalte offen/Pflicht; Klärliste nach Zeitpunkt (Anruf, Angebot, Feinaufmaß); je Position nur Abweichungen in festem
  Raster, was das Maß verändert direkt am Maß, Fotos klein neben der Zeichnung.
- **Feldhaus:** eindeutige Begriffe (Maueröffnung, Altfenster, Bauart, Öffnungsart, Kleinstmaß, Winkelabweichung, Laibungstiefe, VSG),
  Ausstattung als Wort statt Zeichen, Spalte „Offen“ mit „P“, nummerierte Hinweise (K7) auf der Positionsseite, Pflicht mit Wort, das
  Maß nur fett, wenn es belastbar ist, Seitenzahlen im Weg für Papier.

## Abdeckung: was aus dem Konfigurator im Blatt ankommt

Geprüft (Agent, nur gelesen): Fast alle Wünsche laufen über `AW.wuensche` auf die Positionsseite. Lücken lagen in der Aufstellung
(Fensterbänke, Zubehör aus den Detailangaben, Farbe und Details des Sonnenschutzes, Farbe und Gewebe des Insektenschutzes, Glas aus
Absturzsicherung und RC, Strom aus allen Antrieben), bei der Nachricht des Kunden (nur als Klärpunkt), bei „Maße bestätigt“ und in der
Testansicht (Abzug immer 15/15/0, kein Logo). Offen bleibt die Lage einer neuen Öffnung im Blatt des Servers (das Bild wird beim
Senden geleert; blatt.js müsste die Ecken selbst auf das Foto zeichnen).

## Änderungstabelle (umgesetzt)

| Wo | Was | Warum | Gremium | Stand |
| --- | --- | --- | --- | --- |
| Begriff | „Bestellmaß“ überall im Blatt des Betriebs „Richtmaß fürs Angebot“; bestellt wird nach dem Feinaufmaß | Haftung, Klarheit | 3 von 4 + 2 von 2 | umgesetzt |
| Richtmaß | heller Kasten mit Rand; fett nur, wenn belastbar; sonst „vorläufig“ mit Grund (Aufsatzkasten, Fuge, Winkel, Foto); bei Anschlag laut Foto „Feinaufmaß nötig“ statt der Zahl; in der Übersicht ebenso („vorl.“, „Feinaufmaß“) | Vertrauen | beide | umgesetzt (modell.js `bestellmass`: `sicher`, `anschlag`, `aufsatz`) |
| Seite 1 | Kennzahlen: Elemente, Pflichtpunkte offen, Punkte zu klären, Fensterfläche; Nachricht des Kunden im Kundenkasten; **Projektstandard** mit Richtmaß des Betriebs | eine Information einmal | Wolters, Feldhaus | umgesetzt |
| Übersicht | ganz auf Seite 2, Geschoss nicht über den Umbruch; Spalten Maueröffnung, Richtmaß, Ausstattung in Worten, **Offen** mit „P“; keine Spalte Altfenster | Blickführung | beide | umgesetzt |
| Klärliste | Nummern K1 …, Gruppen nach Zeitpunkt, Gruppe nicht über den Umbruch, gleicher Grund nur einmal, Codes mehrerer Positionen anklickbar | Arbeitsablauf | beide | umgesetzt |
| Klärliste, neue Punkte | Anschlag laut Foto, Kastenhöhe beim Aufsatzkasten, alter Innenkasten (ausbauen, dämmen, luftdicht), Fuge bei großen oder dunklen Elementen, Fliesenlaibung bei „verputzen“, RC2/RC3 mit P4A/P5A und abschließbarem Griff | Fachliche Lücken | 3 von 4 + beide | umgesetzt (modell.js `klaerung`) |
| Rettungsweg | § 37 Abs. 5 MBO (z. B. § 37 BauO NRW), je Fenster im DG nachgerechnet: lichte Öffnung etwa Element je Flügel minus 120 mm, Stulp beide Flügel; im Beispiel DG-01 und DG-02 zu klein | Fehler, selbst geprüft | 2 von 4 + beide | umgesetzt (`AW.rettung`) |
| Glas | VSG statt „Sicherheitsglas“; VSG im unteren Feld bei der Absturzsicherung und P4A/P5A bei RC2/RC3 als „Nötig“ in der Glasgruppe und in der Aufstellung | Fehlbestellung | beide | umgesetzt (`AW.glasPflicht`) |
| Absturzsicherung | mit gewählter Lösung „…, im Angebot einplanen“ statt wie offen | „Welcher Stand gilt?“ | Wolters | umgesetzt |
| Position | Nummern der Klärpunkte, „PFLICHT“ als Wort, Verweis auf die Klärliste; Breiten und Höhen als Tabelle, Kleinstmaß fett; Begriffe Altfenster, Winkelabweichung, Laibungstiefe, Öffnungsart, Bauart; Wandstärke nur, wenn angegeben | Intuition | Feldhaus | umgesetzt |
| Position | nur Abweichungen vom Projektstandard, keine „keiner“-Zeilen, „Sonst wie Projektstandard (Seite 1): …“; keine Ausstattungs-Chips; „Bestand laut Fotos“ ohne die doppelten Hinweise | eine Information einmal | beide | umgesetzt |
| Position | Bilder klein unten in der Maßkarte (von innen, von außen), Position bleibt meist auf ihrer Seite | Belege | 4 von 4 + beide | umgesetzt |
| Weg im Kopf | „Übersicht S. 2“, „Klärliste S. 3“ | Papier | Feldhaus | umgesetzt |
| Ende | keine Wiederholung von Seite 1 (Zahlen, Abzug, Maßstab) | Länge | Wolters | umgesetzt |
| Aufstellung | Fensterbänke, Beschlag und Zubehör, Schwelle und Boden, voller Sonnenschutz samt Details, Insektenschutz mit Details, Glas aus Pflicht, Strom aus allen Antrieben, Absturz nur, wenn die Frage gilt | Abdeckung | Agent | umgesetzt |
| Beispiel | Daten als Datei im Format der App (`web/beispiele/mustermann/projekt.json`), natürlich streuende Maße, Widersprüche entfernt (Fensterbank OG-01, Kasten OG-03, Küche), Wandstärke nur, wo die App sie fragt | „tatsächliche Ergebnisse“ | Inhaber, 3 von 4 | umgesetzt |
| Beispiel, Bilder | 24 Bilder aus dem 3-D-Modell der App (`scripts/beispiel-bilder.mjs`), im Blatt gekennzeichnet „Beispiel: Bild aus dem 3-D-Modell statt Foto“; echte Fotos gibt es für das erfundene Projekt nicht | Ehrlichkeit | – | umgesetzt |
| Verknüpfung | `/app/?ausprobieren=signature&beispiel` öffnet dasselbe Projekt im Konfigurator; Testansicht mit Abzug und Logo des Beispielbetriebs; nach dem Senden ist das Blatt inhaltlich das Beispiel der Website (Prüfung 25.12); Link „Dasselbe Beispiel im Konfigurator öffnen und ändern“ auf der Seite für Fensterbauer | Wunsch des Inhabers | – | umgesetzt |
| Website | Bild des Blatts zeigt die Übersicht (Seite 2), Etiketten neu vermessen (Maueröffnung, Richtmaß, „Anschlag laut Foto“), Texte „Richtmaß“, „20 Seiten“, Klärliste mit neuen Punkten | Gleichstand | – | umgesetzt |
| Export | CSV oder Excel für die Branchensoftware | 2 von 4 | – | offen (später) |
| Hausansicht | ein Bild des Hauses auf Seite 1 | Ralf Steinmetz | – | offen: die App fragt kein Hausfoto |
| Neue Öffnung | Lage auf dem Foto im Blatt des Servers | Agent | – | offen |

Seitenzahl des Beispiels: 20 statt 18 (Klärliste mit 25 statt 15 Punkten, Aufstellung länger, Bilder; dafür keine Schlussseite).

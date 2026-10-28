# Vier Fensterbauer prüfen das Beispiel-Aufmaßblatt (28.10.2026)

Das Gremium war simuliert: vier getrennte Agenten, eine Runde. Echte Stimmen gab es nicht.

- **Material:** web/beispiele/aufmassblatt-fensterbau-brandt.pdf (18 Seiten, Familie Mustermann, 13 Positionen mit 16 Elementen), als
  Seitenbilder und als Text.
- **Auftrag des Inhabers:** „Lass mal 4 Fensterbauer, die viele Aufträge haben, drübergucken. Was sagen die dazu, wie urteilen die?“

| Person | Rolle | Note | Kauf | Kernsatz |
| --- | --- | --- | --- | --- |
| Ralf Steinmetz | Inhaber, 45 MA, 1.200 Aufträge/Jahr | 6/10 | so nicht; drei Monate Test, wenn Fotos drin sind, „Richtmaß“ statt „Bestellmaß“ und ein Export da ist | Seite 1 sagt sofort, was ich wissen will; das fetteste Maß ist genau das, nach dem ich nie bestellen darf. |
| Svenja Albers | Arbeitsvorbereitung, 120 MA, 3.000 Aufträge/Jahr | 6/10 | – | Ein Angebot mit Annahmen kann ich machen, bestellen nicht; ich tippe eine Stunde ab und habe noch 11 Rückfragen. |
| Murat Kaya | Vertriebsleiter, 150 Online-Anfragen/Monat | 7/10 | rät nach drei Monaten Test zum Kauf | Bester Eingang aus einem Webformular; die Klärliste ist mein Gesprächsleitfaden. |
| Holger Brandl | Montageleiter, Feinaufmaß, 1.500 Montagen/Jahr | 6/10 | – | Besser als alles per Mail, aber die Zahlen sehen geklont aus, und „Bestellmaß“ macht mich nervös. |

Median der Noten: 6.

## Was gelobt wurde

- Seite 1 bringt alles für den ersten Anruf: Kontext, Budget, Zeitraum, Förderung, Erreichbarkeit.
- Die Klärliste (S. 2–3) dient als Gesprächsleitfaden.
- Die Aufstellung nach Gewerk (S. 3–4) zeigt den Zusatzverkauf, den der Kunde schon selbst gewählt hat.
- Drei Breiten und drei Höhen, das kleinste Maß, Brüstungen, Laibungen.
- Fachlich richtig: Lüftungskonzept nach DIN 1946-6, § 38 MBO zur Absturzsicherung, Förderantrag vor Vertrag.
- Der Satz „Feinaufmaß vor Ort“ steht drin.
- Geschätzte Ersparnis:
  - 45–60 Min. je Anfrage, bei kleinen Anfragen die erste Fahrt (Steinmetz)
  - 1–2 Std. je Angebot, Abschlussquote +3 bis 5 Punkte (Kaya)

## Was alle oder fast alle bemängeln

| Befund | Wer | Seite |
| --- | --- | --- |
| Die Fotos fehlen im PDF („20 Fotos ausgewertet“), KI-Aussagen ohne Beleg | 4 von 4 | S. 1, alle Positionen |
| „Bestellmaß“ fett gedruckt; richtig wäre „Richtmaß fürs Angebot, nicht bestellfähig“ | 3 von 4 | S. 1–2, 5–17 |
| Messabweichungen bei allen 13 Positionen gleich (unten +2, links +3, rechts +2): wirkt geklont | 3 von 4 | S. 5–17 (Beispieldaten) |
| Aufsatzkasten ohne Kastenhöhe; Anschlag nur bei zwei Positionen; was mit den alten Innenkästen passiert, steht nirgends | 3 von 4 | S. 6, 8, 9, 12, 13, 14 |
| „Innenlaibung verputzen“ auch bei Fliesen (Bad, WC); Fensterbank „behalten“ widerspricht sich (OG-01, EG-03) | 3 von 4 | S. 8, 10, 12, 15 |
| Rettungsweg: § 35 MBO zitiert, richtig ist § 37 Abs. 5 MBO (in NRW die BauO NRW); nicht mit den eigenen Maßen nachgerechnet (DG-02 schafft 0,90 × 1,20 m nicht) | 2 von 4 (geprüft: § 37 Abs. 5 stimmt) | S. 2, 16, 17 |
| Absturzsicherung „Sicherheitsglas“ zu ungenau (ESG oder VSG, DIN 18008-4); bei OG-02 fehlt sie in der Glasliste | 3 von 4 | S. 2, 4, 13 |
| RC2 mit Standardgriff und ohne P4A-Glas | 3 von 4 | S. 4–6 |
| 15 mm Fuge pauschal, auch bei der 3-m-Hebe-Schiebe-Tür in Anthrazit | 3 von 4 | S. 7 |
| Kein Export (CSV, Excel, XML) für die Branchensoftware | 2 von 4 | – |
| Zu lang für die Arbeitsvorbereitung: Übersicht ohne Öffnungsart, Glas, Farbe | 2 von 4 | S. 1–2 |
| Doppelte Hinweise; „Hund“ als Klärungspunkt | 2 von 4 | S. 2, 6, 15 |

## Einzelne Wünsche

- **Vertrieb:**
  - Kasten „Verkauf“ auf S. 1: Haustür, die drei übrigen Fenster, fehlender Insekten- und Sonnenschutz, Lüftung als Produkt.
  - Der Preis, den der Kunde gesehen hat, und ein Budget mit Obergrenze.
- **Montage:**
  - Anschlagart, Wandstärke, Außenmaß, Diagonalen und Bezugshöhe Fertigfußboden je Position.
  - Absturzhöhe außen, Material der Altfenster, Zugang und Gerüst, Schadstoffverdacht (Baujahr 1978).
  - Feld für Datum, Ergebnis und Unterschrift je Klärungspunkt (Haftung).
- **Arbeitsvorbereitung:**
  - Glas mit Ug und Schallschutzklasse.
  - Sonnenschutz mit Panzer, Lamelle und Steuerung.
  - Fensterbank außen mit Ausladung und Farbe.
  - Teilungsmaße.

## Stand

Nichts umgesetzt. Die Befunde betreffen web/assets/blatt.js (PDF) und web/assets/modell.js (Abzüge, Regeln). Beide werden nur auf
ausdrücklichen Wunsch des Inhabers geändert. Die Beispieldaten (gleiche Abweichungen) liegen im Beispiel selbst.

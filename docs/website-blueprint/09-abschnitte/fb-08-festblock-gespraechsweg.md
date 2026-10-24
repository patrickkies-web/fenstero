# 04.3 Festblock, Gesprächsweg, Rechtshinweis

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 8 von 15 (dritter Block von Kapitel 04 „Ihre Marke“, nach 04.2 Entscheidungshilfe und Vergleich, vor 05 Ihre Anfrage) · Intensitätsstufe: 1 ruhig (Typ T6 ohne Held, Arbeitsansicht)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu
PB = `web/konfigurator-bedingungen/index.html`, VK = `web/fuer-fensterbauer/index.html`, PS = `functions/pakete-seite.js`. **[H]** Hypothese
mit Rückfall. Lagen sind geplant, nicht gemessen. Preise und Paketwahl berührt der Block nicht (`10-paketentscheidung.md` liegt nicht vor).

## A. Abschnitt und Funktion

- **Name, ID, Anker:** 04.3 Festblock, Gesprächsweg, Rechtshinweis, `fb-08-festblock-gespraechsweg`. Kein eigener Anker; der Block liegt
  unter dem Pflicht-h2 `#pakete` (Z 8.1.4).
- **Position:** direkt unter dem Verkaufsstand „Vorläufige Preise, Stand 22.10.2026.“ aus 04.2, laut Z bei 664 px Höhe in Bildschirm 8;
  nach 96 px folgt die Haarlinie von 05. Im Rhythmus 2 · 1 · **1** · 1 (04.1 bis 05) die ruhige Strecke zwischen Kartenreihe und Formular.
  Erreicht wird er durch Weiterscrollen von den Karten, auch nach dem Sprung „Pakete ansehen“ und über Links auf `#pakete` (M-1).
- **Ziel:** Risiko am Ort der Entscheidung senken (EA S5-Kern; RE R8): fünf belegte Risikofakten, die ehrliche Grenze und der Link zu den
  Paketbedingungen. Dazu ein leiser zweiter Weg für Unentschlossene (W4).
- **Beantwortete Nutzerfrage:** „Was riskiere ich, und was, wenn ich unsicher bin?“
- **Vorbereitete Entscheidung:** Das Risiko ist tragbar, also fragt er an (Kartenknopf oben oder Formular unten), oder er wählt das Gespräch
  statt der Entscheidung (Ring → `#frage`, Paket „Noch offen“).
- **Ansichtstyp (SG „Wofür er gilt“):** Arbeitsansicht. Pflicht sind Ordnungslinie, flache Bedienschicht und Mindestanforderungen. Anker,
  Sprung, Ebenenzahl und Negativraum sind nur Ziel.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| Vertrag kommt mit Eingang der Einrichtungsgebühr zustande | PB:48, § 3 (2) | Zeile 1 |
| Monatsgebühr beginnt mit dem Livegang | PB:54, § 4 (3) | Zeile 4 |
| Vorschau-Link, Freigabe im Kundenkonto, live erst mit Freigabe oder nach Absprache | PB:60, § 5 (3) | Zeile 3 |
| Monatsabo ohne Mindestlaufzeit, Kündigung zum Ende des Abrechnungsmonats | PB:69, § 7 (1) | Zeile 5 |
| Storno bis zum Beginn der Einrichtung mit voller Erstattung, danach keine Erstattung | PB:70, § 7 (2) | Zeile 2 und Grenze |
| „Entwurf zur anwaltlichen Prüfung“, keine kostenpflichtigen Bestellungen, solange offene Stellen bestehen; Fassung `PAKET_STAND` 2026-10-23 | PB:28; `functions/api/recht.js:17`, `:22-25` | Standzeile am Link |
| „Angebot nur für Unternehmer im Sinne von § 14 BGB, nicht für Verbraucher. … Ihr Kunde zahlt nichts.“ | VK:188; Prüfsuite 27.1 erwartet „Angebot nur für Unternehmer“ (`scripts/pruefen-instanzen/27.mjs:486`) | Rechtshinweis |
| Steuertext „netto zzgl. MwSt.“ oder „ohne Ausweis der Umsatzsteuer (§ 19 UStG)“ | PS:44 `steuerText(v)`; EA O-6 | Rechtshinweis, nie fest eingetragen |
| Paketfeld mit erster Option „Noch offen“ (Wert leer); Vorwahl über `a[data-paket]` | PS:173-174; `web/assets/verkauf.js:28-36` | Ziel des Gesprächswegs |
| Rückruf ohne Konto gibt es nicht; der Wunsch geht über das Formular. Zustand B: „gern auch am Telefon“ | EA 4.3.3/7, W4; PS:194 | Wortlaut des Rings |

**B.2 Texte**

| Element | Wortlaut | Status |
|---|---|---|
| Blocktitel (h3, Versalien per CSS) | „Vertrag und Kündigung“ | Textentwurf |
| Zeile 1 | „Vertrag erst mit Eingang Ihrer Zahlung.“ | Textentwurf, gekürzt aus EA 4.3.1 |
| Zeile 2 | „Bis zum Beginn der Einrichtung stornieren Sie mit voller Erstattung.“ | Textentwurf EA 4.3.1 |
| Grenze (ohne Haken) | „Danach wird die Einrichtungsgebühr nicht erstattet.“ | Textentwurf, nach PB:70 präzisiert |
| Zeile 3 | „Live erst mit Ihrer Freigabe der Vorschau.“ | Textentwurf, gekürzt aus EA 4.3.1 |
| Zeile 4 | „Monatsabo erst ab dem Livegang.“ | Textentwurf, gekürzt aus EA 4.3.1 |
| Zeile 5 | „Monatlich kündbar, ohne Mindestlaufzeit.“ | Textentwurf EA 4.3.1 (= VK:243) |
| Link | „Paketbedingungen mit AV-Vertrag“ | Textentwurf (Z, EA 4.3.1) |
| Standzeile | A: „Entwurf zur anwaltlichen Prüfung · Fassung vom 23. Oktober 2026“; B: „Fassung vom 23. Oktober 2026“ | Textentwurf aus PB:28 und `PAKET_STAND` |
| Frage | „Unsicher, welches Paket passt?“ | Textentwurf (Z; KB VB2) |
| Ring | „Rückruf oder Nachricht“ | Textentwurf (Z; KB VB2) |
| Rechtshinweis | „Angebot nur für Unternehmer im Sinne von § 14 BGB, nicht für Verbraucher. Alle Preise {steuerText}. Ihr Kunde zahlt nichts.“ | Satz 1 und 3 wörtlich VK:188, Satz 2 Textentwurf |

Sichtbar sind in Zustand A rund 75 Wörter, davon 45 im Festblock.

- **Reihenfolge, Festlegung dieser Spezifikation [H]:** Z nennt die fünf Fakten, legt aber keine Folge fest. Sie stehen hier zeitlich geordnet:
  Zahlung, Storno, Freigabe, Livegang, Kündigung. Das ist dieselbe Folge wie im Ablauf 06.1 (Bestellt … Live). Die Grenze steht direkt unter
  der Storno-Zeile und im selben Listenpunkt. So ist sie nie von ihrer Zusage getrennt und rutscht nicht ans Ende, wo man sie überliest.
  Rückfall: Folge wie in Z, die Grenze als letzte Zeile (KB VB2).
- **Kürzungen:** Die Zeilen 1, 3 und 4 bleiben bei 390 px einzeilig (≤ 43 Zeichen bei 15 px); die Sätze aus EA 4.3.1 sind die Langfassung
  zur Wahl. Zeile 3 lässt „oder nach Absprache“ (PB:60) weg, wie schon EA; der Link führt zum vollen Wortlaut.
- **Bewusst nicht im Block:** Erstattung bei nicht erteilter Freigabe (offen, EA O-16), Domain (F-04, O-24), Preisbindung (F-18, O-7),
  Verfügbarkeit und Haftung (F-29), Paketwechsel (VK:243). Kein „Garantie“, kein „risikofrei“ (EA 4.6.3; GEST:379). „Keine Gebühr je
  Anfrage“ steht schon im Kopf von 04.1 (Z).
- **„Ihr Kunde zahlt nichts.“** bleibt aus VK:188 erhalten; der Inhaber kann den Satz streichen (eine Zeile weniger).

**B.3 Interaktionen:** genau zwei. (1) Link → `/konfigurator-bedingungen/`, im selben Tab; der Weg zurück läuft über den Kopf-Ring „Pakete
ansehen“ dort (Z 8.2.7). (2) Ring → `#frage`. Er setzt das Paketfeld auf „Noch offen“ und springt zum Formular. Sonst gibt es nichts
Bedienbares: keinen Rücklink nach oben (E-4, N10) und keine Cream.

**B.4 Zustände**

| | Zustand A (heute) | Zustand B (`PAKETE_OFFEN=1`) |
|---|---|---|
| Festblock | gleich | gleich |
| Standzeile | mit „Entwurf zur anwaltlichen Prüfung · “ (gekoppelt an `!v.bestellen`, weil PB:28 bis zur Prüfung Bestellungen ausschließt) | nur „Fassung vom …“ |
| Ring | → `#frage` (h3 „Paket unverbindlich anfragen“) | → `#frage` (h3 „Vorher eine Frage?“, PS:194) |
| Rechtshinweis | `steuerText(v)`; mit `mwst: false` „ohne Ausweis der Umsatzsteuer (§ 19 UStG)“ | gleich |

## C. Exakte Layoutkomposition

**C.1 Grundstruktur (Telefon zuerst).** Ein flacher, linksbündiger Stapel ohne Kartenfläche: Titel → Festblock (Liste) → Link mit Standzeile
→ Gesprächsweg (Frage und Ring) → Rechtshinweis. Raster am Telefon 4 Spalten à 77,5 px mit 16 px Abstand. Der Block nutzt alle vier Spalten.
Die Haken stehen auf der Ordnungslinie x = 16 (Kasten 24 px), der Text auf der eingerückten Zweitlinie x = 48. Das ist die einzige erlaubte
Zweitlinie (SG 10.1/1). Der Ring sitzt in den Spalten 1–3 (x 16–260).

**C.2 Lagen bei 390 × 844** (y ab Blockbeginn, Unterkante des Verkaufsstands = 0)

| Element | x | y | Maß, Schrift |
|---|---|---|---|
| Abstand zu 04.2 | – | 0–48 | Zonenabstand (G6) |
| Titel h3 | 16–200 | 48–64 | 13/16, 600, Versalien, Sperrung .12em, `--muted` |
| Zeile 1 | Haken 16–40, Text 48–374 | 80–102 | 15/22, 500, `--text` |
| Zeile 2 (zweizeilig) | wie oben | 110–154 | 15/22 |
| Grenze (zweizeilig, ohne Haken) | 48–374 | 158–202 | 15/22, 500, `--text2` |
| Zeile 3 | wie oben | 210–232 | 15/22 |
| Zeile 4 | wie oben | 240–262 | 15/22 |
| Zeile 5 | wie oben | 270–292 | 15/22 |
| Link | 16–≈ 262 | 308–352 | Ziel 44 px, Schrift 15/700, unterstrichen |
| Standzeile | 16–374 | 352–368 | 13/16, 500, `--muted`; ein Satz, daher nach Freigabe von DG-E-6 15/22 (K-20) |
| Frage | 16–≈ 250 | 392–414 | 15/22, 700, `--text` |
| Ring | 16–≈ 260 | 422–474 | 52 px, Schrift 17/700 (`.btn`), innere Kontur 2 px `--muted` (K-1) |
| Rechtshinweis | 16–374 | 498–558 | 13/20, 500, `--muted`, drei Zeilen; nach Freigabe von DG-E-6 15/22, drei Zeilen (K-20) |

Höhe ≈ 558 px (0,66 BH; Z plant 0,55). Nach der Umstellung auf 15 px (K-20) wächst der Block um ≈ 34 px (Standzeile in Zustand A
zweizeilig, Rechtshinweis drei Zeilen à 22 px). Das Mehr von ≈ 94 px kommt aus dem 44-px-Linkziel, der Standzeile, dem Titel und der zweizeiligen
Grenze und schiebt 05 entsprechend nach unten; ob das Formular bei 664 px in Bildschirm 9 bleibt, zeigt die Bildschirmzählung (EV X9).
Rückfall: Titel nur für Vorleseprogramme (−32 px), dann „Ihr Kunde zahlt nichts.“ streichen (−20 px). Bei 664 px passt der ganze Block in
die 608 px unter dem Kopf, Fakten, Grenze und Gesprächsweg stehen zusammen in einem Bildschirm (SKILL:86).

**C.3 Verhältnisse und Hierarchie**

- **Größen:** drei Stufen, 13 · 15 · 17. Ränge entstehen über Gewicht und Tonwert, nicht über Größe (DG-E-1 C): Fakten 500 `--text`, Grenze
  500 `--text2`, Frage 700 `--text`, Ring 17/700 als größte Schrift, Titel 13 `--muted` (Technikstimme). Standzeile und Rechtshinweis
  sind Sätze: 13 `--muted` nur bis zur Freigabe von DG-E-6, danach 15 (K-20).
- **Flächen (Schätzung):** Text und Bedienelemente ≈ 50 %, Bild 0 %, Freiraum ≈ 50 % (Ziel ≥ 33 %, SG 10.1/3). Der Freiraum liegt rechts der
  kurzen Zeilen und in den Gruppenabständen.
- **Abstände (G6, 1 : 3 : 6):** 8 px zwischen den Fakten (eine Gruppe), 4 px Fakt → Grenze, 16 px Liste → Link, 24 px zwischen den Gruppen,
  48 px zu 04.2, 96 px zu 05.
- **Asymmetrie und Ebenen:** alles linksbündig mit Flatterrand, nichts zentriert (G5). Hintergrund 0 Grund `#161616`, Mittelgrund leer (Z 20
  unbesetzt), Vordergrund 30 Bedienschicht, darüber 40 Kopf beim Überscrollen.
- **Interaktive Elemente:** Link bei ≈ 55–63 % der Blockhöhe, Ring bei ≈ 76–85 %. Steht der Block mittig im Bildschirm, liegt der Ring im
  unteren Drittel, im Daumenbereich.

**C.4 Technische Startwerte**

| Wert | Start | Begründung |
|---|---|---|
| Zeilenhöhe der Fakten | 22 px (≈ 1,47) | 4-px-Raster; die DNA nennt 1,5–1,6 für Fließtext. Listen mit kurzen Zeilen brauchen weniger, `.vk-liste` hat heute 1,4 |
| Textbreite | Telefon 326 px ≈ 43 Zeichen; Schreibtisch 476 px ≈ 62 Zeichen (bei 1024: 436 px ≈ 57 Zeichen) | DNA: unter 640 px ≥ 35, sonst 45–75 Zeichen |
| Haken | 6 × 11 px, Strich 2,5 px `--accent`, gedreht um 45°, Mitte auf der ersten Zeile | Bestand `.vk-liste li::before` (`web/assets/verkauf.css:35`) |
| Ring-Kontur | innere Kontur 2 px `--muted` statt `--line2`, als echter `border` (bleibt in `forced-colors`); Hover → `--text`, Druck Füllung `--surface2` | K-1 (11.6.2): `--line2` erreicht ≈ 1,6 : 1 und verfehlt die 3 : 1 für die einzige Grenze des Knopfs (DG-E-10). Abweichung von bestehender Regel (GEST:24; `gemeinsam.css:58` Ghost-Rand `--line2`) – Freigabe durch den Inhaber nötig (DS-AB-10) |
| Schrift 13 px | Titel 13 (Technikstimme, bleibt); Standzeile und Rechtshinweis 13 bis zur Freigabe von DG-E-6, danach 15/22 | K-20 (11.3.3): 13 px nur für die Technikstimme, jeder bedeutungstragende Satz 15 px; bis zur Freigabe gilt GEST (13 px zulässig), umgestellt wird in einem Schritt für alle Abschnitte. Abweichung von bestehender Regel (GEST:26, :452) – Freigabe durch den Inhaber nötig (DS-AB-2). Bis dahin: Abweichung von der DNA (Bedienschrift ≥ 14 px, B.5), Kontrast ≥ 5,8 : 1; Markenskala und Prüfsuite lassen nur 13/15/17/24/40 (32) zu (SKILL:69). Den Sprung ≥ 3× verfehlt die Arbeitsansicht zulässig (DG-E-1 C) |

## D. Anwendung der Design-DNA

Die Dosierung folgt der Dosierregel 1 aus DG 2.4.2: Entscheidungsfläche, Stufe 1, keine inszenierende Signature. Verbindlich bleiben
Nr. 1, 3, 5, 6, 9, 10 und 11. Variable Mittel sind hier fast alle auf 0 gestellt; den Ausdruck tragen die Nachbarn (Beispielbild in 04.1).

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung und Beitrag zur Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achse | zwei Ebenen, Grund und Bedienschicht; der Kopf überdeckt beim Scrollen (Nr. 2 nur Ziel) | 0 | nichts Inszeniertes, wo es um Verbindlichkeit geht |
| Material, Transparenz | kein Glas, keine Kartenfläche, opaker Grund | 0 | Glas gehört dem Startbild (Dosierregel 3); ohne Karte keine Konkurrenz zu den Paketkarten |
| Licht, Schatten | keines; kein Schein am Ring, kein Schatten | 0 | Nr. 6, 10: Fakten sollen nicht „beworben“ wirken |
| Formen | Vollrundung nur am Ring (Pille, `--pill`); Haken als Strichform; kein Formbruch | 1 | eine Formfamilie (Nr. 5); der Ring reimt sich auf die Kartenknöpfe darüber |
| 3D-Objekte, Bildintegration | keine | 0 | DG-E-1: der Held fehlt bewusst; das Platzhalterbild alter Art kommt nicht zurück |
| Oberflächendetails | Haken in Grün als einziges Signal; Unterstreichung 1,5 px mit 4 px Versatz (`.link`); Standzeile wie die Beschriftung eines Dokuments; ab 1024 die Paragrafenspalte in der Technikstimme [H] | 1 | Präzision wie bei einem Aufmaß: jede Zusage lässt sich in den Bedingungen finden |
| Animation | keine (Z: „keine; kein Auftritt“) | 0 | Entscheidungsflächen ohne Auftritt (EV 7.5.4, B-AB-7) |
| Typografie | 13 · 15 · 17; Gewicht und Tonwert tragen den Rang; Technikstimme (13) im Titel und ab 1024 in der Paragrafenspalte, Sätze nach Freigabe von DG-E-6 in 15 (K-20) | 1 | schnell zu überfliegen: Haken, erstes Wort, nächste Zeile |
| Überlagerungen | keine | 0 | Text liegt nie auf Bild (GEST) |
| Perspektive | frontal | 0 | Nr. 1 |
| Interaktive Effekte | Zustände über Kontur und Füllung, 220 ms | 1 | Rückmeldung ohne Versatz oder Skalierung (SG 10.7/1-3) |

**Bewusst weggelassen:** Karte um den Festblock (Konkurrenz zu den Paketkarten); gezogene Haken per Lottie (gehören 06.2); Schild-, Schloss-
oder Siegel-Symbole (wirken wie erfundene Belege, SKILL:49); Pfeil im Kreis am Ring (gehört der Hauptaktion, B.3.7); grünes Wort im Titel;
Einblenden beim Scrollen; Warnfarbe an der Grenze (sie ist eine Bedingung, kein Fehler, B.5).

## E. Visual Attention Architecture

Erwartete Aufmerksamkeit aus Gestaltungsregeln, nicht gemessen.

- **Primärer Fokus:** die Hakenspalte an der linken Kante. Fünf gleiche grüne Zeichen bilden eine senkrechte Reihe, den einzigen Farbreiz
  im Block. Sie wirkt als typografischer Anker anstelle eines Bildes.
- **Sekundärer Fokus:** der Ring. Er ist die einzige umrandete Fläche und die größte Schrift im Block. Er gewinnt gegen den Kartenknopf
  darüber nicht, weil er nur Kontur hat und keine Cream-Fläche (Rang über Füllung, B.3.7).
- **Erwartete Reihenfolge:** Titel → Zeile 1 → Bruch im Hakenrhythmus bei der Grenze (gewollt) → Zeilen 3–5 → Link → Frage → Ring →
  Rechtshinweis (überflogen, aber erreichbar).

| Paar | Kontrast (berechnet) | Rolle |
|---|---|---|
| Fakten `#f3f2ee` auf `#161616` | ≈ 16 : 1 | lesen |
| Grenze `--text2` auf Grund | ≈ 10,8 : 1 | lesbar und sichtbar leiser, nicht versteckt |
| Haken `--accent` auf Grund | ≈ 10,5 : 1 | Signal |
| Titel, Standzeile, Rechtshinweis `--muted` | ≈ 5,8 : 1 | Nebenzeilen, AA erfüllt |
| Ring-Kontur `--muted` (K-1) | ≈ 5,8 : 1 | einzige Grenze des Bedienelements ≥ 3 : 1 |

- **CTA:** keine Cream im Block; sie gehört dem Knopf der empfohlenen Karte darüber und danach „Frage senden“ in 05. Der Ring ist der zweite
  Weg, nicht die Hauptaktion.
- **Mögliche Ablenkungen:** (1) Der Kopf-Ring „Paket anfragen“ (rh-01) hat dasselbe Ziel, setzt das Paket aber nicht um und liegt außerhalb
  der Daumenzone; das bleibt so. (2) Der Link führt von der Seite weg, für FB-6 und Mitentscheider gewollt; zurück über den Kopf-Ring dort.
  (3) Ein geöffneter Vergleich in 04.2 schiebt den Block um ≈ 12 Zeilen nach unten, aber nie hinter das Formular.
- **Übergang:** Rechtshinweis → 96 px Ruhe → Haarlinie mit „05 · IHRE ANFRAGE“. Der Ring zeigt auf genau diesen Abschnitt: Wer scrollt, kommt
  ohne Sprung ans selbe Ziel wie mit dem Ring.

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Scrollen | nichts bewegt sich, nichts erscheint; der Inhalt steht ab dem ersten Bild | – | Z; Dosierregel 1; SG 10.7/4 (Bedienschicht steht still) |
| Hover Ring (nur `@media (hover: hover)`) | Kontur `--muted` → `--text` (K-1) | 220 ms `--e-out` (Tokens `--t2`, `--e-out`) | Zustand über Kontur (SG 10.7/8) |
| Hover Link | Unterstreichung `--line2` → `--text` | 220 ms (Bestand `.link`) | gleich |
| Drücken Ring | Füllung transparent → `--surface2`, **ohne** `scale(.98)` | 220 ms | SG 10.7/3: keine Skalierung (wie fb-01) |
| Fokus (Ring und Link) | `outline` 2 px solid `--text`, Abstand 2 px, formfolgend (am Ring die Pille); kein −2 px, weil keines der beiden an eine Gruppen- oder Containerkante stößt; nie verdeckt | sofort | K-34 (11.9.1); WCAG 2.4.7, 2.4.11, 1.4.11 |
| Tipp Ring | `select[name="paket"]` = „“ („Noch offen“) über den vorhandenen Zuhörer; dann Sprung zu `#frage` | eingebettet: weiches Scrollen über den Handler (`web/assets/portal.js:835-842`), bei „weniger Bewegung“ `auto`; eigenständig: nativer Sprung | Bestand, keine neue Bewegung; die Seite entscheidet weiches Scrollen einheitlich (rh-01, rh-02), nicht dieser Block |
| Nach dem Sprung | Fokus auf h3 `#frage` (eingebettet schon so, `tabindex="-1"`); eigenständige Seite: `tabindex="-1"` am h3 in 05 setzen, damit Vorleseprogramme dort landen | – | Schnittstelle zu fb-09 |

- **Charakteristik:** ruhig, ohne Richtung, ohne räumliche Veränderung. Bewegung mit Tiefe und Physik (SKILL:43) trägt nebenan die Wischreihe
  in 04.1; hier wäre sie eine Verkaufsgeste, wo Vertrauen entstehen soll.
- **Weniger Bewegung:** identisch; nur der eingebettete Sprung ist sofort (Bestand). Farbwechsel bleiben.
- **Ohne JavaScript:** alles steht, der Ring springt nativ zu `#frage`. Das Paketfeld steht ohnehin auf „Noch offen“ (erste Option).
- **Zustand, Empfehlung an fb-15:** Der Ring heißt „unsicher“ und löscht eine frühere Kartenwahl; der Abschluss fällt dann auf „Empfohlen“
  zurück (E-3: die letzte ausdrückliche Wahl gilt).

## G. Responsive Design

**G.1 Telefon 390 × 844 (zuerst).** Komposition wie in C.2: ein Stapel, ≈ 558 px. **390 × 664:** gleiche Werte, der ganze Block passt
unter den Kopf. **360:** Zeile 3 kann umbrechen (+22 px), der Ring bleibt 244 px breit. **320:** Text 256 px breit (≈ 34 Zeichen); Zeilen 1,
4 und 5 bleiben einzeilig, der Ring passt (244 ≤ 288). **200 % Text:** Der Ring darf umbrechen (`white-space: normal`, Polster 13/22 px,
`min-height: 52px`); `.btn` hat heute `nowrap` und liefe sonst über den Rand (WCAG 1.4.4, 1.4.10). Paragrafen sind ausgeblendet.

**G.2 640–1023.** Gleicher Stapel, Textbreite höchstens 600 px (≈ 75 Zeichen), Seitenrand 24 px wie die übrige Seite (11.2.1, K-13):
Haken auf x = 24, Text ab x = 56; keine Paragrafenspalte.

**G.3 Schreibtisch 1280 × 800.** Spalte 1040 px (x 120–1160), 12 Spalten à 64,7 px, Abstand 24. Asymmetrie 6 + 1 : 1 : 4.

| Element | Spalten | x | y ab Blockbeginn |
|---|---|---|---|
| Titel, Festblock, Link, Standzeile | 1–6 | 120–628 | 48–346 (Zeile 2 zweizeilig, die übrigen und die Grenze einzeilig) |
| Paragrafenspalte [H] | 7 | 652–717 | je auf der ersten Zeile des Fakts, 13/22, Technikstimme, `tabular-nums`, `--muted` |
| Gesprächsweg | 9–12 (fluchtet mit der dritten Karte in 04.1) | 829–1160 | Frage 48–70, Ring 78–130, Breite ≈ 244 px, linksbündig |
| Freiraum | 9–12 | – | 130–346 |
| Rechtshinweis | 1–8, höchstens 72 Zeichen | 120–≈ 700 | 370–410 (2 Zeilen) |

Höhe ≈ 410 px (0,51 BH bei 800; nach der Umstellung auf 15 px nach K-20 ≈ 420 px). Der Gesprächsweg steht oben bündig mit dem Titel neben den Fakten: Das „oder“ ist auf einen Blick zu
sehen. Nichts wird vergrößert (SKILL:28); Schriften 13/15/17, Ring 52 px.

**G.4 Schreibtisch 1024.** Seitenrand 32 px, Spalte 960 px (x 32–992), 12 Spalten à 58 px, Rinne 24 (11.2.1, K-12, K-13; wie der Kopf
in rh-01). Festblock in Spalten 1–6 (x 32–500; Haken auf x = 32, Text x 64–500 = 436 px), Paragrafen in Spalte 7 (x 524–582),
Gesprächsweg in Spalten 9–12 (x 688–992, Ring ≈ 244 von 304 px), Rechtshinweis in Spalten 1–8 (x 32–664). Zeile 2 bleibt zweizeilig,
alles andere wie bei 1280.

## H. Technische Umsetzung

**H.1 Bestand, wiederverwendet**

- PS: `BLOECKE`, `bausteineEinsetzen` (`:249-259`), `verkaufFuer` (`:40-43`), `steuerText` (`:44`), `stand` (`:245`), Formular (`:173-174`).
- `web/assets/verkauf.js:28-36`: `a[data-paket=""]` setzt „Noch offen“, ohne neue Bindung, in der Einbettung idempotent (`wurzel.__vkPaket`).
- `web/assets/portal.js:835-842`: Sprung zu `#frage` in der Einbettung mit Fokus und „weniger Bewegung“.
- `web/assets/gemeinsam.css:55-67` (`.btn`, `.btn.ghost`, `.link`); `web/assets/verkauf.css:8` (`scroll-margin-top: 76px`), `:33-35`
  (Haken-Muster), `:511` (`.vk-recht`).
- VK:188: Der Absatz `.vk-recht` wird durch den Baustein ersetzt; Abo ab Livegang und Link stehen künftig im Festblock.

**H.2 Neu: Baustein `festblock`** in PS (Eintrag in `BLOECKE`), in VK als `<!--pakete:festblock--><!--/pakete:festblock-->` hinter dem
Verkaufsstand von 04.2. Danach `node scripts/bedingungen-pdf.mjs`, sonst schlägt Prüfsuite 29.1 fehl (Bausteine in `web/` aktuell).
Serverseitig erzeugt und ohne JavaScript vollständig. Variabel sind zwei Stellen: Standzeile = (`!v.bestellen` ? „Entwurf zur
anwaltlichen Prüfung · “ : „“) + „Fassung vom “ + `standText(PAKET_STAND)`; Rechtshinweis Satz 2 = „Alle Preise “ + `steuerText(v)` + „.“.
Alle Selektoren tragen wie in `verkauf.css` ein `.rg` davor, damit sie gegen `ratgeber.css` (etwa `.rg h3`, `.rg ul`) gewinnen; das gilt
auch in der Einbettung (`main.rg`).

```html
<div class="vk-festblock">
  <div class="vk-fest">
    <h3 class="vk-fest-titel" id="vk-fest-titel">Vertrag und Kündigung</h3>
    <ul class="vk-fest-liste" role="list" aria-labelledby="vk-fest-titel">
      <li><span>Vertrag erst mit Eingang Ihrer Zahlung.</span><span class="vk-fest-par">§ 3 (2)</span></li>
      <li><span>Bis zum Beginn der Einrichtung stornieren Sie mit voller Erstattung.
        <span class="vk-fest-grenze">Danach wird die Einrichtungsgebühr nicht erstattet.</span></span><span class="vk-fest-par">§ 7 (2)</span></li>
      <li><span>Live erst mit Ihrer Freigabe der Vorschau.</span><span class="vk-fest-par">§ 5 (3)</span></li>
      <li><span>Monatsabo erst ab dem Livegang.</span><span class="vk-fest-par">§ 4 (3)</span></li>
      <li><span>Monatlich kündbar, ohne Mindestlaufzeit.</span><span class="vk-fest-par">§ 7 (1)</span></li>
    </ul>
    <p class="vk-fest-bed"><a class="link" href="/konfigurator-bedingungen/">Paketbedingungen mit AV-Vertrag</a>
      <span class="vk-fest-stand">Entwurf zur anwaltlichen Prüfung · Fassung vom 23. Oktober 2026</span></p>
  </div>
  <div class="vk-gespraech">
    <p class="vk-gespraech-frage" id="vk-gespraech-frage">Unsicher, welches Paket passt?</p>
    <a class="btn ghost vk-gespraech-knopf" href="#frage" data-paket="" aria-describedby="vk-gespraech-frage">Rückruf oder Nachricht</a>
  </div>
  <p class="vk-recht">Angebot nur für Unternehmer im Sinne von § 14 BGB, nicht für Verbraucher. Alle Preise netto zzgl. MwSt. Ihr Kunde zahlt nichts.</p>
</div>
```

```css
.vk-festblock { display: grid; row-gap: 24px; margin-top: 48px }
.vk-festblock > * { margin: 0 }
.vk-fest-titel { margin: 0 0 16px; font-size: 13px; line-height: 16px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--muted) }
.vk-fest-liste { list-style: none; margin: 0; padding: 0; display: grid; row-gap: 8px }
.vk-fest-liste li { position: relative; padding-left: 32px; font-size: 15px; line-height: 22px; font-weight: 500; color: var(--text) }
.vk-fest-liste li::before { content: ''; position: absolute; left: 9px; top: 4px; width: 6px; height: 11px;
  border-right: 2.5px solid var(--accent); border-bottom: 2.5px solid var(--accent); transform: rotate(45deg) }
.vk-fest-grenze { display: block; margin-top: 4px; color: var(--text2) }
.vk-fest-par { display: none }
.vk-fest-bed { margin: 16px 0 0; display: flex; flex-direction: column; align-items: flex-start }
.vk-fest-bed .link { font-size: 15px }
.vk-fest-stand { font-size: 13px; line-height: 16px; color: var(--muted) }
/* K-20, erst nach Freigabe von DG-E-6 und in einem Schritt mit allen Abschnitten: .vk-fest-stand und .rg .vk-recht auf 15px/22px */
.vk-gespraech-frage { margin: 0 0 8px; font-size: 15px; line-height: 22px; font-weight: 700; color: var(--text) }
/* K-1: innere Kontur 2px --muted als border (border-box, bleibt in forced-colors), Hover --text, Druck --surface2 */
.vk-gespraech-knopf { border: 2px solid var(--muted); box-shadow: none; white-space: normal; padding: 13px 22px; line-height: 22px;
  transition: border-color var(--t2) var(--e-out), background var(--t2) var(--e-out) }
.vk-gespraech-knopf:active { transform: none; background: var(--surface2) }
/* K-34: 2px --text, Abstand 2px, formfolgend */
.vk-gespraech-knopf:focus-visible { outline: 2px solid var(--text); outline-offset: 2px }
@media (hover: hover) { .vk-gespraech-knopf:hover { box-shadow: none; border-color: var(--text) } }
@media (min-width: 640px) and (max-width: 1023px) { .vk-festblock { max-width: 600px } }
@media (min-width: 1024px) {
  .vk-festblock { grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 24px; align-items: start }
  .vk-fest { grid-column: 1 / 8; display: grid; grid-template-columns: subgrid }
  .vk-fest > * { grid-column: 1 / 7 }
  .vk-fest-liste { grid-column: 1 / -1; grid-template-columns: subgrid }
  .vk-fest-liste li { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid }
  .vk-fest-liste li > span:first-child { grid-column: 1 / 7 }
  .vk-fest-par { display: block; grid-column: 7; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--muted) }
  .vk-gespraech { grid-column: 9 / 13 }
  .vk-recht { grid-column: 1 / 9 }
}
@supports not (grid-template-columns: subgrid) { @media (min-width: 1024px) { .vk-fest-par { display: none } } }
```

Fehlt `subgrid`, entfällt nur die Paragrafenspalte. Die Gliederung in Spalten bleibt.

**H.3 Assets:** keine. Kein Bild, kein Lottie, keine Schrift außer der lokalen Inter. Vom Inhaber braucht es nur die Freigabe der Texte.

**H.4 Animationstechnik:** keine. Die Zustände nutzen die Übergänge des Bestands an `.btn` und `.link`.

**H.5 Leistung:** ≈ 1,5 KB HTML, kein Skript, keine Layoutverschiebung (Server-HTML mit festen Zeilenhöhen). INP unkritisch, der Zuhörer
gibt es schon.

**H.6 Barrierefreiheit:** Die Überschrift h3 gliedert Kapitel 04 für Vorleseprogramme (Versalien nur per CSS). `role="list"`, weil Safari
mit `list-style: none` die Listensemantik verwirft. Die Haken sind Pseudoelemente und werden nicht vorgelesen. Die Grenze liegt im selben
`li` wie ihre Zusage. Der Ring hat den Namen „Rückruf oder Nachricht“ und die Beschreibung „Unsicher, welches Paket passt?“. Ziele sind 44 px
(Link) und 52 px (Ring). Der Fokus ist nie verdeckt (K-34: seitenweit `scroll-padding-top` 72/80 px = Kopf + 16). Der Ring trägt seine innere 2-px-Kontur (K-1) als echten Rand statt des
Box-Schattens von `.btn.ghost`, weil `forced-colors: active` Box-Schatten entfernt; der Rand bleibt dort als Systemfarbe sichtbar. Umfließen bis 320 px und 200 % Text siehe G.1.

**H.7 Einbettung und Prüfsuite:** Die Einbettung lädt denselben Server-HTML-Block; beim Neuaufbau ist nichts nachzubinden. Prüfsuite:
Abschnitt 10 (nur 13/15/17; der Ring erbt 17 px über `.btn`), 27.1 („Angebot nur für Unternehmer“), 29.1 (kein Link auf `/#tour`,
`/#fensterbauer`) sind erfüllt. Als `.btn.ghost` zählt der Ring in `kopfCta()` (`web/assets/portal.js:554`) nicht als Cream. **Abweichungen von bestehenden Regeln:**
(1) Ring-Kontur `--muted` statt `--line2` (K-1; GEST:24, `gemeinsam.css:58`): Abweichung von bestehender Regel – Freigabe durch den
Inhaber nötig (DS-AB-10, DG-E-10). (2) Standzeile und Rechtshinweis in 15 px (K-20; GEST:26, :452): Abweichung von bestehender Regel –
Freigabe durch den Inhaber nötig (DS-AB-2, DG-E-6); bis dahin 13 px nach GEST. Der Block setzt außerdem DG-AB-2 (kein Versatz der
Bedienschicht) voraus und hält die Dosierregel 1.

## I. Conversion-Begründung

- **Warum hier:** EA 4.3.1/7 lässt „… bestellen“ nur an der Karte zu, wenn „der Block mit den Risikofakten direkt folgt“ (R1, R8). Was erst im
  Bestellschritt 6 auftaucht, wirkt wie eine spät aufgedeckte Bedingung (RE E11). Alle Perspektiven außer zweien setzen die Fakten unter die
  Karten (EV Ü6). Direkt darunter liegt das Formular (H-E6). Der Besucher liest also Preis → Risiko → Handlung ohne Umweg.
- **Wie die Gestaltung hilft:** Kurze, gleich gebaute Zeilen mit Haken lassen sich in Sekunden überfliegen. Die Grenze steht ohne Haken und
  leiser, aber gut lesbar direkt bei ihrer Zusage. Das entspricht der Haltung „Ehrlich“ (SKILL:49) und vermeidet den Eindruck von
  Kleingedrucktem. Die Standzeile beantwortet F-17 dort, wo der Link steht. Der Ring fängt die Passungsfrage (F-23, FB-6) auf, ohne den
  Kartenknopf zu überstimmen.
- **Informationsmenge:** genau die fünf Fakten und die Grenze aus RE R8 („Nichts darüber hinaus“), dazu ein Link, ein Weg und eine Pflichtzeile;
  rund 75 Wörter. Alles Weitere steht in den Bedingungen, im Ablauf 06.1 (dort nur an den Marken, ohne Wiederholung des Wortlauts) und in
  den Fragen.
- **Beitrag zur Zielhandlung:** Z1a, weil das Risiko tragbar wird und der Ring einen zweiten Weg mit „Noch offen“ öffnet (W4). Z1 in Zustand
  B, weil die Bedingungen vor dem Bestellschritt 6 bekannt sind (EA 4.3.1/1). Über Wahrscheinlichkeiten sagt das nichts.

| Nr. | Annahme [H] | Prüfweg | Rückfall |
|---|---|---|---|
| H-08-1 | Zeitliche Folge und Grenze direkt bei der Storno-Zeile werden besser verstanden als die Grenze am Ende | Lesetest mit Fensterbauern: „Bis wann bekommen Sie die Einrichtung zurück?“ | Folge wie Z, Grenze zuletzt |
| H-08-2 | Der Titel hilft beim Überfliegen und kostet keinen Bildschirm | Bildschirmzählung bei 664 px; Lesetest | Titel nur für Vorleseprogramme |
| H-08-3 | „Entwurf zur anwaltlichen Prüfung“ schreckt weniger ab, als es Vertrauen schafft | Gespräche (FB-6, Mitentscheider) | nur „Fassung vom …“ |
| H-D14 | Der leise Gesprächsweg nimmt Passungsfragen auf, ohne Anfragen mit Paket zu verdrängen | Anteil der Anfragen mit „Noch offen“ (Paketfeld vorhanden); Verhältnis zu Anfragen mit Paket | Ring **Textentwurf** „Frage stellen“ oder entfernen |
| H-08-4 | Die Paragrafenspalte am Schreibtisch stärkt die Prüfbarkeit für FB-6 | Gespräche | weglassen |
| H-08-5 | Die Kurzfassungen der Zeilen werden so verstanden wie die Sätze aus EA 4.3.1 | Lesetest | Langfassung EA 4.3.1 |

Voraussetzung für das Wort „Rückruf“: Der Inhaber bestätigt, dass er auf Wunsch anruft. In 05 sollte das Telefonfeld den Rückruf nennen,
**Textentwurf** „Telefon (freiwillig, für einen Rückruf)“; das entscheidet fb-09. Ohne Bestätigung heißt der Ring **Textentwurf** „Frage
stellen“.

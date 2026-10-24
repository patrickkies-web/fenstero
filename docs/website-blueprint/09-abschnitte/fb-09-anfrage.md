# 05 Ihre Anfrage (#bestellen, #frage) mit Dank

Seite: `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) · Position: 9 von 15 (Kapitel 05, nach 04.3 Festblock und Gesprächsweg, vor 06.1 Ablauf) · Intensitätsstufe: 1 ruhig (Typ T10 Anfrage)

Phase I, Planungsdokument; das Repository wurde nur gelesen. Kürzel wie in [08-zielarchitektur.md](../08-zielarchitektur.md) (Z), dazu
PS = `functions/pakete-seite.js`, VJ = `web/assets/verkauf.js`, VC = `web/assets/verkauf.css`, PJ = `functions/api/partner.js`,
29 = `scripts/pruefen-instanzen/29.mjs`. **[V]** verbindlich, **[H]** Hypothese mit Rückfall. Alle Lagen sind geplant, nicht gemessen.
`10-paketentscheidung.md` liegt nicht vor; Paketnamen und Reihenfolge kommen aus `web/assets/pakete.js` (Z 8.3.2).

## A. Abschnitt und Funktion

- **Name, ID, Anker:** 05 Ihre Anfrage, `fb-09-anfrage`; h2 mit Pflicht-ID `bestellen` (29:110-118), Formularüberschrift mit `frage`.
- **Position:** Telefon ≈ 6,3–7,7 BH, bei 664 px Höhe Bildschirm 9–10. Davor 04.3 (Stufe 1, endet mit dem Rechtshinweis), danach 06.1
  Ablauf (Stufe 2, Maßstab). 05 schließt die ruhige Entscheidungszone ab: Rhythmus 2 · 1 · 1 · **1** · 2 (04.1 bis 06.1).
- **Zugänge:** Kartenknopf „… anfragen“ (04.1, mit Paket), Gesprächsweg-Ring (04.3, Paket „Noch offen“), Kopf-Ring „Paket anfragen“
  (ohne Paket), Zeilen des Abschlusses A4 (mit Paket), Menü „05 Anfragen“, Weiterscrollen.
- **Ziel:** Zustand A: Z1a, Paket unverbindlich anfragen. Zustand B (`PAKETE_OFFEN=1`): Bestellung vorbereiten, Formular als Nebenweg.
- **Beantwortete Nutzerfrage:** A „Lohnt es sich, jetzt anzufragen, und was passiert dann?“; B „Was muss ich bereithaben?“
- **Vorbereitete Entscheidung:** Name und E-Mail preisgeben, ohne sich zu verpflichten (EA 4.3.2/1); in B mit bereitliegenden Angaben
  am Kartenknopf bestellen.

## B. Konkreter Inhalt

**B.1 Bestandsinformationen**

| Inhalt | Fundstelle | Verwendung |
|---|---|---|
| h2 „Bestellen oder anfragen“, ID `bestellen` | VK:215; 29:110-118 | wörtlich; neu ein grünes Wort (GEST:26) |
| h3 „Paket unverbindlich anfragen“, ID `frage` | VK:221; PS:196 | wörtlich (Zustand A) |
| „Die Bestellung schalten wir in Kürze frei … unverbindlich … in der Regel innerhalb eines Werktags … sobald Sie bestellen können“ | VK:220 | Lead und Dank, gekürzt; Werktag ungemessen (EA O-8) |
| Felder Name, Firma (freiwillig), E-Mail, Telefon (freiwillig), Paket mit „Noch offen“, Frage; Regeln Name ≥ 2, E-Mail gültig, Frage ≥ 3 Zeichen; Honigtopf `fax` | PS:173-189; PJ:206-214 | Felder und Regeln unverändert, Reihenfolge neu (C.6) |
| „Wir nutzen Ihre Angaben nur, um Ihnen zu antworten (Datenschutz)“ → `/datenschutz/#pakete` | PS:185; `web/datenschutz/index.html:75` | wörtlich |
| „Danke, Ihre Frage ist da. Wir melden uns in der Regel innerhalb eines Werktags bei Ihnen.“ | VJ:64-68; PJ:578 | Dank |
| Anbieter Patrick Kies, Herzebrock-Clarholz, `ask@eeziframes.com` | PB:33 § 1; `web/impressum/index.html:32` | Anbieterzeile; Telefon erst nach EA O-9 |
| B: „Wählen Sie Ihr Paket. Im Kundenkonto … bezahlen die Einrichtung bei Stripe …“, „Schon bestellt? Zum Kundenkonto“, h3 „Vorher eine Frage?“ | PS:192-194 | gekürzt |
| B: „Für die Bestellung brauchen Sie: …“ | EA 4.3.1 (aus `web/assets/partner.js:161-175`) | als Liste |
| Fehlersätze, „Keine Verbindung …“ | VJ:56-62, :89; PJ:208, :211-213 | wörtlich |

**B.2 Texte Zustand A (Reihenfolge von oben)**

| Element | Text | Herkunft |
|---|---|---|
| Kapitelzeile | **Textentwurf** „05 · IHRE ANFRAGE“ | Z 8.2.6 |
| h2 | „Bestellen oder anfragen“, grün „anfragen“ | VK:215 |
| Lead | **Textentwurf** „Bestellen können Sie in Kürze. Bis dahin fragen Sie unverbindlich an; wir antworten in der Regel innerhalb eines Werktags.“ | VK:220; gekürzt gegenüber Z (C.6) |
| h3 | „Paket unverbindlich anfragen“ | VK:221 |
| Felder | „Paket“ · „Ihr Name“ · „Firma (freiwillig)“ · „E-Mail“ · **Textentwurf** „Telefon für Rückruf (freiwillig)“ (Rückfall „Telefon (freiwillig)“, O-9) · „Ihre Frage oder Ihr Wunsch“ | PS:177-182 |
| Hinweis am Paket (nur nach Kartenknopf) | **Textentwurf** „bei den Paketen gewählt“ | E-3 |
| Hinweis an Firma (nur vorbefüllt) | **Textentwurf** „aus Ihrer Vorschau übernommen“ und Knopf „entfernen“ | Z 8.3.2; EV X5 |
| Datenschutzsatz | wörtlich PS:185 | – |
| Hauptaktion | „Frage senden“ (Cream, mit Pfeilkreis) | PS:186; E-7 |
| Anbieterzeile | **Textentwurf** „Es antwortet eeziframes, Patrick Kies, Herzebrock-Clarholz“, darunter `ask@eeziframes.com` | PB:33; Ü5 |
| Dank | „Danke, Ihre Frage ist da.“ + **Textentwurf** „Wir melden uns in der Regel innerhalb eines Werktags und sagen Bescheid, sobald Sie bestellen können.“ · Ring „Zurück zu den Paketen“ → `#pakete` · Link „Paketbedingungen“ → `/konfigurator-bedingungen/` | CP 5.5; VK:220; Z 8.3.2 |
| Fehler beim Server | **Textentwurf** „Ihre Frage ließ sich gerade nicht senden. Bitte versuchen Sie es gleich noch einmal oder schreiben Sie an ask@eeziframes.com.“ | VJ:85, Adresse statt „im Impressum“ |

**B.3 Texte Zustand B:** h2 grün „Bestellen“ · Lead **Textentwurf** „Sie bestellen am Knopf Ihres Pakets und bezahlen die Einrichtung im
Kundenkonto bei Stripe.“ · Zeile 15 fett „Für die Bestellung brauchen Sie:“ · Liste mit grünem Haken: „die Angaben Ihres Unternehmens fürs
Impressum“, „eine Wunsch-Domain oder unseren Vorschlag“, „bis zu drei E-Mail-Adressen für Ihre Anfragen“ · Satz 15 **Textentwurf** „Logo und
Fotos für Plus und Signature reichen Sie bis zur Freigabe nach.“ · Link „Schon bestellt? Zum Kundenkonto“ → `/partner/` · eingeklappt „Vorher
eine Frage?“, darin dasselbe Formular ohne h3 · Dank wie A, zweiter Satz nur „Wir melden uns in der Regel innerhalb eines Werktags.“
Der Satz „gern auch am Telefon“ (PS:194) entfällt, weil keine Nummer genannt wird (EA F-32).

**B.4 Erforderliche Interaktionen:** Paket aus Kartenknopf und Abschluss übernehmen (E-3); Firmenname aus 01 gekennzeichnet übernehmen und
entfernbar machen; E-Mail beim Verlassen prüfen [H]; Absenden mit Fehlern am Feld; Senden mit Wartezustand; Dank ersetzt das Formular;
in B Aufklappen „Vorher eine Frage?“; ohne JavaScript normales Absenden auf die Dankesseite (PJ:577-582).

**B.5 Vorhandene Komponenten:** Abschnittsrahmen `.vk-teil` mit Haarlinie (VC:501-502), `scroll-margin-top: 76px` (VC:8); Feldstil
`.vk-feld` (VC:127-136, wird ersetzt); `.btn.primary` mit `.pf`, `.btn.ghost`, `.link` (`web/assets/gemeinsam.css:56-74`); Formularlogik
`formular(wurzel)` (VJ:19-90); Lottie-Zeichen `fertig` (`web/assets/lottie/fertig.json`, 6,9 KB) mit `Lottie.spielen` und Standbild
`.lottie-still` (`web/assets/gemeinsam.js:194-256`); Route `POST /api/partner/frage` mit Bremse und Honigtopf (PJ:206-222).

## C. Exakte Layoutkomposition

**C.1 Grundstruktur.** Eine Arbeitsfläche ohne Held (DG-E-1, Fassung C: Hierarchie über Gewicht und Tonwert). Telefon: eine Spalte über alle
4 Spalten (je 77,5 px, Abstand 16), alles an der Ordnungslinie x = 16, linksbündig, asymmetrisch durch Flattersatz und den rechten Freiraum
der Beschriftungen. Schreibtisch: 12 Spalten, Hinweis links über 5, Formular rechts über 7 (DR 3.3). Ebenen: 0 Grund `#161616`, flach →
30 Bedienschicht (Text, Felder, Knöpfe; der Dank-Haken als kleine Bildschicht darin) → 40 Kopf. Kein Mittelgrund, kein Bild, kein Licht.

**C.2 Telefon 390 × 844, Zustand A, Lagen relativ zur Haarlinie (y = 0)**

| y | Element | Maß |
|---|---|---|
| 0 | Haarlinie 1 px `--line`, x 16–374 | 96 px Abstand zu 04.3 |
| 16–33 | Kapitelzeile 13 px | Abstand 16 |
| 45–112 | h2 32 px, zwei Zeilen „Bestellen oder“ / „anfragen“ | Abstand 12 |
| 124–201 | Lead 17 px, drei Zeilen, `max-width: 358px` | Abstand 12 |
| 233–255 | h3 17 px (Ziel der Sprünge, landet bei y = 76 im Bildschirm) | Abstand 32 (Zonenwechsel) |
| 271–380 | Paket: Beschriftung 20 · 8 · Feld 52 · 8 · Hinweis 21 (nur nach Kartenknopf) | Abstand 16 |
| 396–476 | Ihr Name (20 · 8 · 52) | Abstand 16 |
| 492–572 | Firma; vorbefüllt + 8 · Hinweiszeile 44 | Abstand 16 |
| 588–668 | E-Mail | Abstand 16 |
| 684–764 | Telefon | Abstand 16 |
| 780–928 | Frage: Beschriftung 20 · 8 · Feld 120 | Abstand 24 |
| 952–994 | Datenschutzsatz 15 px, zwei Zeilen | Abstand 16 |
| 1010–1062 | Cream „Frage senden“ 358 × 52 | Abstand 16 |
| 1078–1120 | Anbieterzeile 15 px, zwei Zeilen | – |
| 1120–1164 | E-Mail-Link, Zeile 44 px | 96 px zu 06.1 |

Gesamthöhe ≈ 1.135–1.216 px (1,34–1,44 BH), je nach Hinweisen. Größenverhältnisse: h2 32 : Feldtext 17 : Beschriftung 15 = 2,1 : 1,1 : 1;
die Cream ist mit 358 × 52 px ≈ 5,7 % der Bildschirmfläche die größte helle Fläche. Text ≈ 30 %, Felder und Knöpfe ≈ 30 %, Freiraum
≈ 40 % (Ränder, Abstände, Flattersatz); Bild 0 %.

**C.3 Feldanatomie (Startwerte)**

| Teil | Wert | Begründung |
|---|---|---|
| Beschriftung | über dem Feld, 15/20 px, 700, `--text`; „(freiwillig)“ 500 `--muted` | GEST:455; Beschriftung bleibt bei Eingabe sichtbar |
| Feld | Höhe 52, Innenabstand 0 16 (Textfeld 13 16), Schrift 17/24 500 `--text`, Grund transparent (= `--ground`), `border: 1px solid var(--muted)`, Radius 12 | 17 px verhindert Zoom auf iOS; `--muted` erreicht 5,8 : 1 gegen `#161616` (R10 ≥ 3 : 1; `--line2` nur 1,6 : 1, RE E18); `border` statt `box-shadow`, damit der Umriss in `forced-colors` bleibt |
| Auswahl „Paket“ | wie Feld, Chevron 24 px `--text2` rechts bei 16 px, `appearance: none` | VC:132 |
| Textfeld | `min-height: 120px; resize: vertical`; mit `field-sizing: content` bis 320 px wachsend (wo unterstützt) | VC:133 |
| Hinweis | 8 px unter dem Feld, 15/21 px 500 `--muted`; „entfernen“ als `.link` 15 px 700, Trefferfläche 44 × 44, Zeile 44 px hoch | DG-E-6: bedeutungstragend ⇒ 15 statt 13 |
| Fehler | Rand 2 px `--bad` (Rand 1 px + `outline: 1px` ohne Abstand), darunter 8 px Abstand, Satz 15/21 px 700 `--bad` mit Punkt 8 px `--bad` davor (Einzug 16) | GEST:24 „Wort mit Punkt“; `#ff7b72` 7,2 : 1 |
| Fokus | `outline: 2px solid var(--text); outline-offset: 2px; border-radius: 12px` | überschreibt den Radius 8 aus `gemeinsam.css:38`, sonst ändert das Feld beim Fokus seine Form |

**C.4 Schreibtisch 1280 × 800.** Spalte 1040 px (x 120–1160), 12 Spalten à 57,3 px, Abstand 32. Haarlinie über alle 12 Spalten.

| y | links, Spalten 1–5 (x 120–535) | rechts, Spalten 6–12 (x 567–1160) |
|---|---|---|
| 24–41 | Kapitelzeile | – |
| 57–141 | h2 40 px, zwei Zeilen | h3 57–79 (oben bündig mit der h2) |
| 153–230 | Lead 17 px, drei Zeilen | Paket über volle Breite 95–204 |
| darunter | frei (≈ 415 × 500 px Negativraum) | Name · Firma nebeneinander (je 288,5 px, Abstand 16) 220–300; E-Mail · Telefon 316–396; Frage volle Breite 412–560; Datenschutz eine Zeile 584–605; Cream nach Inhalt (≈ 190 × 52) 621–673, linksbündig; Anbieterzeile mit Mail-Link in einer Zeile 689–733 |

Nach dem Sprung auf `#frage` (h3 bei y = 76) steht alles bis zur Anbieterzeile in einem 800-px-Bildschirm (Unterkante ≈ 752).
In einer Zeile richten sich Felder über `align-items: end` aus, falls eine Beschriftung umbricht.

**C.5 Zustand B (Telefon):** Haarlinie, Kapitelzeile, h2 wie A; Lead 124–201; Liste ab 233: Zeile „Für die Bestellung brauchen Sie:“
20 px, drei Punkte je 2 × 24 px mit Haken 20 px bei x 16–36, Text ab x 48, Abstand 8; Satz zu Logo und Fotos 2 Zeilen; Link 44 px;
32 px Abstand; Zusammenfassung „Vorher eine Frage?“ als Ring 358 × 52. Eingeklappt ≈ 600 px (0,71 BH). Schreibtisch: Liste links, die
eingeklappte Zeile rechts oben bündig mit der h2.

**C.6 Festlegungen dieses Abschnitts (Abweichungen von Z mit Begründung)**

1. **Paket als erstes Feld** statt an fünfter Stelle [H]: Nach dem Sprung vom Kartenknopf sieht der Besucher seine Wahl direkt unter der
   Überschrift (bei y ≈ 130 statt unterhalb der Bildschirmkante). Die Prüfsuite bleibt erfüllt: Das Paket ist nie fehlerhaft, der Fokus
   geht weiter auf „Name“ (29:95). Rückfall: Reihenfolge nach Z.
2. **Pflichtfelder wie heute** (Name, E-Mail, Frage): Z nennt „Pflicht nur E-Mail und Paket“ als [H] (RE T10). Die Prüfsuite erwartet
   drei Fehler mit Fokus auf „Name“ (29:95, [V]), der Server weist ohne Name und Frage ab (PJ:211-213). Die T10-Fassung ist vorbereitet:
   „Ihr Name (freiwillig)“, „Ihre Frage oder Ihr Wunsch (freiwillig)“, Änderung in PJ:211-213, VJ:56-62 und 29:95, erst nach Freigabe
   (IA-O-9).
3. **Lead gekürzt:** Der Satz aus Z bräuchte am Telefon vier Zeilen; DR 3.2 erlaubt höchstens drei. „Sobald Sie bestellen können“ steht
   im Dank.
4. **Hinweise 15 statt 13 px:** bedeutungstragend und mit Bedienelement (SG 10.9 Bedienschrift ≥ 14 px; DG-E-6). 15 ist eine Markengröße,
   keine Abweichung von GEST.
5. **Gewicht ≈ 1,35–1,45 BH statt 1,10:** Sechs Felder à 80 px sind bei 52-px-Feldern mit Beschriftung darüber das Minimum. Pakete und
   Formularbeginn bleiben, wo Z sie plant; 06.1 rückt ≈ 0,3 BH nach unten.
6. **Zustand B:** keine Bestellknöpfe in 05, bestellt wird am Kartenknopf (E-3, Z 8.3.2 d); das Formular ist eingeklappt, „Frage senden“
   bleibt Cream, weil in 05 keine Bestell-Pille steht. Kein Hinweis-Link nach oben (E-4).

## D. Anwendung der Design-DNA

Der Abschnitt ist eine **Arbeitsansicht** (DNA-B B.1): Pflicht sind Regel 3 und 7–12, von Regel 4 die Linie. Signature-Effekte: keine
(Dosierregel 1 [V]; Z 8.3.11).

| Eigenschaft | Ausgestaltung | Intensität (0–4) | Wirkung, Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achsen | zwei Ebenen, 0 Grund und 30 Bedienschicht; Kopf 40. Keine Verdeckung (Arbeitsansicht: Ziel, nicht Pflicht) | 0 | nichts liegt über den Feldern (Regel 10) |
| Material, Transparenz | keines; Felder ohne Füllung, kein Kartenkasten um das Formular (heute `.vk-form` mit Fläche und Ring, VC:125) | 0 | flache Bedienschicht ohne Eigenmaterial (Regel 3); kein Kasten im Kasten |
| Licht, Schatten | kein Lichtfleck, kein Schatten an Feldern (DG T10 „Nicht“); einziger Hellwert ist die Cream | 0 | die Cream wird der Lichtpunkt der Ansicht |
| Formen | eine Familie: Pillen für Knöpfe und Zusammenfassung (B), Radius 12 für Felder, Fokus formfolgend (DG-AB-8: voll · 24 · 18 · 12) | 1 | formstabil auch bei Fokus und Fehler |
| 3D-Objekte | keine | 0 | – |
| Bildintegration | keine; das Foto `fb-frage.webp` mit Chips „Rückruf · Nachricht · Unverbindlich“ entfällt (IA-AB-8) | 0 | der Chip „Rückruf“ versprach etwas ohne Nummer (EA F-32) |
| Oberflächendetails | Haarlinie oben; Kapitelzeile in der Technikstimme; 1-px-Feldumrisse; Fehlerpunkt; Pfeilkreis `.pf` in der Cream; grüne Haken in B | 1 | Präzision wie ein Formblatt, ohne Schmuck |
| Animation | nur Zustände (150/220 ms) und einmal der Lottie-Haken im Dank (1,3 s) | 1 | Rückmeldung, kein Auftritt (E-13 [V]) |
| Typografie | h2 32/40 800 mit einem grünen Wort; h3 17 800; Feldtext 17 500; Beschriftung 15 700; Nebentext 15 500 `--muted`; Kapitelzeile 13 600 Versal. Unter der h2 höchstens 17 : 15 = 1,13 (SG 10.9 ≤ 1,25) | 2 | Rang über Gewicht und Tonwert (DG-E-1 C) |
| Überlagerungen | keine | 0 | – |
| Perspektive | keine; alles frontal (Regel 3) | 0 | – |
| interaktive Effekte | Hover = Kontur heller, Fokus = 2-px-Kontur, Fehler = Kontur rot mit Satz, gewählt = Wert sichtbar plus Hinweis; Drücken ohne Skalierung | 1 | jeder Zustand mit Form und Text, nie nur Farbe (B.3 Zustandsregeln) |

**Bewusst weggelassen:** Foto, Lichtfleck, Glas, Kasten „Bestellung bald möglich“ (EA AB-4), Reveal beim Scrollen, Rütteln bei Fehlern,
Konfetti, Platzhaltertexte in Feldern, Sterne für Pflichtfelder (markiert wird das Freiwillige, wie heute).

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig:**
- *fb-09-AB-1 (neu):* `--muted` auch als Feldumriss. GEST:24 vergibt `--muted` „nur für Labels und Nebenzeilen“; keine Linienfarbe der
  Marke erreicht 3 : 1 (R10 [V]). Rückfall: eigenes Linien-Token ≥ 3 : 1, dann Abweichung von „keine weiteren Farben“.
- Bereits in Z 8.4.5 gesammelt und hier angewendet: EA AB-4 (Satz statt Kasten), IA-AB-8 (Bildplatz entfällt), DG-AB-3 (kein Rütteln),
  DG-AB-2 mit E-13 (kein Erscheinen), E-AB-7 (Lage nach den Paketen), E-AB-10 (Kapitelzeile mit Wort).

## E. Visual Attention Architecture

Erwartete, nicht gemessene Aufmerksamkeit; keine Blickdaten im Repository.

- **Primärer Fokus:** Cream „Frage senden“, die einzige Cream im Bildschirm (`#f1f0ea` auf `#161616` ≈ 16 : 1); der Kopf-Ring ist
  ausgeblendet, solange 05 mindestens 120 px über dem unteren Rand steht (rh-01 F).
- **Sekundärer Fokus:** h2 mit grünem „anfragen“ (32 px, 10,5 : 1 für das Grün); nach einem Sprung das Paketfeld mit seinem Wert.
- **Reihenfolge beim Scrollen:** grüne Kapitelzeile (erster Farbpunkt nach dem ruhigen Festblock) → h2 → Lead → h3 → Paket → Feldsäule an
  der linken Kante → Datenschutzsatz → Cream → Anbieterzeile mit „Patrick Kies“ in `--text` 700 als kleinem Anker.
- **Nach dem Sprung vom Kartenknopf:** h3 bei y = 76, darunter sofort „EEZI Signature“ mit „bei den Paketen gewählt“; die Cream liegt bei
  844 px knapp unter der Kante und kommt beim Ausfüllen ins Bild.
- **Kontraste:** `--text` ≈ 16 : 1 (Beschriftungen, Werte) > `--text2` (Lead) > `--muted` 5,8 : 1 (Nebentext, Umrisse) > `--line`
  (Haarlinie). Die Cream ist die einzige Fläche über 50 % Helligkeit.
- **CTA:** volle Breite am Telefon, nach dem Datenschutzsatz (er wird vor dem Tipp gelesen), Anbieterzeile direkt darunter.
- **Mögliche Ablenkungen:** Datenschutz-Link (in `--muted`, nicht heller als Lesetext); Mail-Link als gleichwertiger zweiter Weg (gewollt,
  ehrliche Alternative); im Dank der Ring zurück (erst nach dem Senden).
- **Übergang:** Steht die Cream in Bildschirmmitte, zeigen sich am unteren Rand Haarlinie und Kapitelzeile von 06.1 (≈ 11 % der Höhe,
  SG 10.9 Anschnitt 8–25 %). Im Dank führt der grüne Haken den Blick, dann der Satz, dann der Ring.

## F. Interaktions- und Bewegungsverhalten

| Ereignis | Verhalten | Dauer, Kurve | weniger Bewegung |
|---|---|---|---|
| Abschnitt kommt ins Bild | nichts bewegt sich; `.vk-bestellen > *` aus der Reveal-Liste (VJ:477) nehmen | – | – |
| Kartenknopf oder A4-Zeile | Paket setzen, Hinweis an, Sprung `behavior: 'auto'` auf `#frage`, Fokus auf die h3 (`tabindex="-1"` per JS) | Hinweis Deckkraft 220 ms `--e-out` | Hinweis sofort |
| Gesprächsweg | Paket „Noch offen“, kein Hinweis, sonst wie oben | – | – |
| Kopf-Ring „Paket anfragen“ | Paket bleibt, wie es ist (E-3) | – | – |
| Einbettung `/#fensterbauer` | Sprünge scrollen innerhalb der Ansicht, Anker `#fensterbauer` bleibt (GEST:193) | – | – |
| Name aus 01 (`vk:name`, beim Binden aus `sessionStorage`) | nur in ein leeres, unberührtes Feld „Firma“; Hinweiszeile an | 220 ms Deckkraft | sofort |
| „entfernen“ | Feld leer, Hinweis weg, Fokus ins Feld; neu befüllt nur bei neuem Namen in 01 | sofort | – |
| eigene Eingabe in vorbefülltes Feld | Hinweis verschwindet (der Wert gehört jetzt dem Besucher) | 150 ms | sofort |
| Hover (`hover: hover`) | Umriss `--muted` → `--text2`; Cream → `--primary-hover`; Unterstreichung `--line2` → `--text` | 150 ms `--e-out` | bleibt |
| Fokus | 2-px-Kontur sofort; `scroll-padding-top: 76px`, damit der Kopf kein Feld verdeckt | – | gleich |
| E-Mail verlassen [H] | nicht leer und ungültig ⇒ Fehler; sonst nichts. Name und Frage nur beim Absenden | Satz 220 ms Deckkraft | sofort |
| Tippen im fehlerhaften Feld | Fehler fällt weg, sobald die Regel erfüllt ist | 150 ms | sofort |
| Absenden mit Fehlern | alle Fehler zugleich, Fokus auf das erste fehlerhafte Feld; kein Rütteln (DG-AB-3) | 220 ms | sofort |
| Senden läuft | ab 300 ms `aria-busy`, Knopf `aria-disabled` (nicht `disabled`, damit der Fokus bleibt), im `.pf` dreht ein 2-px-Ring ruhig (1,2 s je Umdrehung, Katalog 8), Meldung „Wird gesendet …“ | – | Ring steht |
| Erfolg | h3 und Formular blenden aus, die Seite springt so, dass der Dank bei y = 76 steht, Dank blendet ein, danach Haken einmal; Fokus auf den Dank; Ereignis `vk:gesendet` an der Wurzel (rh-01); Merker `vk-anfrage-gesendet` in `sessionStorage` | aus 165 ms `--e-io`, ein 220 ms `--e-out`, Haken 1,3 s | Schnitt, Endbild des Hakens |
| Server lehnt ab | Fehler am Feld (`felder`); 429 mit Satz des Servers; ab 500 nur der feste Satz aus B.2, nie der Text des Servers (Router 503 nennt Variablennamen, `functions/api/router.js:85-86`); Angaben bleiben | – | – |
| B: „Vorher eine Frage?“ | `details` öffnet, Inhalt Deckkraft 0 → 1; ein Link auf `#frage` öffnet es per JS | 220 ms | sofort |
| Neuaufbau der Einbettung | Werte aus einer Modulvariablen in VJ zurück (nicht gespeichert); mit Merker sofort der Dank ohne Haken-Lauf | – | – |
| ohne JavaScript | normales POST, Dankesseite des Servers (PJ:577-582); Browserprüfung über `required`, `minlength` | – | – |

Charakter: kurz, weich, ohne Überschwingen und ohne räumliche Transformation der Bedienschicht (SG 10.9). Der Wechsel zum Dank ist der
einzige größere Vorgang: Der Sprung geschieht, solange der Dank unsichtbar ist, und liest sich deshalb als ruhige Überblendung.

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht, zuerst).** Komposition C.2, eine Spalte, Felder und Cream über die volle Breite. Daumenzone: die
Cream liegt beim Ausfüllen in der unteren Hälfte. `enterkeyhint="next"` an den Feldern, `inputmode="email"` an der E-Mail; beim Fokus
schiebt der Browser das Feld über die Tastatur (kein eigenes Scrollen). 360 px: Lead vier Zeilen zulässig, Beschriftungen einzeilig
(„Telefon für Rückruf (freiwillig)“ ≈ 262 px). Bei 664 px Höhe beginnt das Formular auf Bildschirm 9 wie geplant. Kein Querscrollen bis
320 px; 200 % Text ohne Verlust.

**Schreibtisch 1280.** Komposition C.4: Hinweis links über 5, Formular rechts über 7 Spalten; Felder zweispaltig; Cream nach Inhalt
statt voller Breite (eine 593 px breite Pille wäre überdimensioniert, SKILL:28). Nichts klebt (E-8).

**Schreibtisch 1024.** Spalte 992 px (Rand 16), Spaltenabstand `clamp(24px, 2.5vw, 32px)` = 25,6 px; links 398 px, rechts 568 px,
Felder je 276 px. h2 40 px bleibt zweizeilig, Lead drei Zeilen. **640–1023 px:** eine Spalte, Formular höchstens 600 px breit, Felder ab
600 px zweispaltig.

## H. Technische Umsetzung

1. **Statisches Markup** (VK:213-232): Bildplatz `.vk-frage-foto` und das Raster `.vk-bestellen` entfernen; `<h2 id="bestellen">` bleibt
   zeichengenau (29.3 sucht genau diese Zeichenfolge), das grüne Wort als `<span class="ak">` im Text.
2. **PS `formular()`** (173-189): Reihenfolge Paket, Name, Firma, E-Mail, Telefon, Frage; je Feld Container für Hinweis und Fehler; Attribute
   `autocomplete` (name, organization, email, tel), `enterkeyhint`, `inputmode`. Der Start-Tag
   `<form class="vk-form" method="post" action="/api/partner/frage" data-vk-frage>` bleibt Byte für Byte (`scripts/pruefen.mjs:1793`
   entfernt nur genau diesen Block); `novalidate` und `aria-labelledby` setzt VJ. Die Anbieterzeile `p.vk-anbieter` steht hinter dem
   Formular, damit sie den Dank überdauert.
3. **PS `bestellen()`** (190-197): A ohne `.vk-bald`, mit Lead, h3, Formular, Anbieterzeile; B mit Lead, `ul.vk-brauchen`, Satz, Link und
   `<details class="vk-vorher"><summary><h3 id="frage">Vorher eine Frage?</h3></summary>…</details>`. `data-zustand="a|b"` und in A
   `data-kopf-ziel` am Behälter (rh-01 H.4). Danach `node scripts/bedingungen-pdf.mjs` (SKILL 8).
4. **Schnittstellen:** Kartenknöpfe (PS:115) und A4 auf `href="#frage"` mit `data-paket`; Gesprächsweg mit `data-paket=""`; Name aus 01
   über `vk:name` und `sessionStorage` `vk-vorschau-name` (fb-03 H.3).
5. **VJ `formular(wurzel)`** erweitern, idempotent je Formular (`__vkAn`) und je Wurzel (`__vkPaket`): Vorwahl mit Hinweis und Fokus;
   Vorbefüllung und „entfernen“; Prüfung der E-Mail beim Verlassen; Fehler mit `aria-invalid` und `aria-describedby` (Hinweis- und
   Fehler-ID zusammen); Wartezustand; feste Sätze ab Status 500; Dank mit `Lottie.spielen(el, 'fertig', { loop: false })`, nur wenn
   `window.Lottie` da ist und keine ruhige Fassung gilt; `CustomEvent('vk:gesendet', { bubbles: true })`; alle `sessionStorage`-Zugriffe
   in `try/catch`, gespeichert wird nur der Merker, keine Angaben (E-10). Umfang ≈ 2,5 KB zusätzlich.
6. **VC:** VC:120-148, :487-493 und die Zeilen zu `.vk-bestellen` in :634, :649 ersetzen; Raster `grid-template-columns: repeat(12,
   minmax(0, 1fr))` ab 1024 px (links `1 / span 5`, rechts `6 / -1`), Felder `repeat(2, minmax(0, 1fr))` mit `gap: 16px`; Werte aus C.3;
   nur Deckkraft und Farbe in Übergängen; `@media (prefers-reduced-motion: reduce)` ohne Übergänge und Drehung.
7. **Assets:** keine neuen. Vorhanden: `web/assets/lottie/fertig.json`, `web/vendor/lottie_light.min.js` (schon geladen, VK:44). Das Foto
   `web/bilder/foto/fb-frage.webp` wird hier nicht mehr verwendet (Datei bleibt; docs/BILDER.md nachziehen). Beim Inhaber ist nichts
   anzufragen.
8. **Leistung:** kein Bild, kein neuer Server; die Hinweise erscheinen nur nach einer Eingabe (zählt nicht zum CLS); die Lottie-Datei lädt
   erst beim Dank. **Vorbedingung des Livegangs:** angeschlossene Datenbank, sonst 503 (EA O-3).
9. **Barrierefreiheit:** sichtbare `label`; Pflicht über `required`, Freiwilliges im Text; Fehler mit Text, Punkt und Rand, Fokus auf das
   erste Feld (WCAG 3.3.1, 3.3.3); Umrisse ≥ 3 : 1, Fokus 2 px (1.4.11, 2.4.7); Fokus nicht verdeckt (2.4.11); Ziele ≥ 44 px; Vorbefüllung
   statt erneuter Eingabe (3.3.7); Status über `role="status"` (4.1.3); Dank fokussiert, Haken `aria-hidden`; Honigtopf für Vorleseprogramme
   unsichtbar (VC:143).
10. **Prüfsuite:** 29.2 bleibt erfüllt (`select[name="paket"]`, drei Fehler mit Fokus auf `name`, `.vk-danke` fokussiert, kein
    `.vk-form input` nach dem Dank, Knöpfe ≥ 44 px). Neu zu prüfen: Umrisskontrast ≥ 3 : 1, Anbieterzeile vorhanden, kein Server-Text bei
    503. Doku: docs/GESTALTUNG.md (Anfrageformular, Kasten „Bestellung bald möglich“).

## I. Conversion-Begründung

- **Warum hier:** Unmittelbar vor 05 stehen Preise, Empfehlung, Risikofakten und der Gesprächsweg; die Zweifel F-17, F-18 und F-20 sind
  dort beantwortet. Das Formular ist der nächste Schritt nach dem Kartenknopf, ohne Umweg über Ablauf und Demos (EA 4.3.2/7; H-E6 [H]).
- **Wie die Gestaltung hilft:** Ohne Bild und Signature bleibt ein Blickziel: die Cream (Dosierregel 1). Das Paket oben bestätigt den
  letzten Tipp. Die Anbieterzeile steht dort, wo Name und E-Mail preisgegeben werden (Ü5). Der Lead sagt in zwei Sätzen, warum heute
  angefragt und nicht bestellt wird.
- **Informationsmenge:** sechs Felder wie heute, davon drei Pflicht, kein neues Pflichtfeld (Ü9); ein Lead von drei Zeilen; keine
  Wiederholung von Preisen oder Leistungen. Mehr würde zwischen Entscheidung und Handlung stehen; weniger ließe „Wer antwortet, wann?“ offen.
- **Beitrag zur Zielhandlung:** Z1a; der Dank bestätigt den Eingang und sagt, was folgt (EA S7). In Zustand B senkt die Liste
  „Für die Bestellung brauchen Sie“ den Aufwand vor dem Kundenkonto (EA H-D1 [H]).

| Annahme [H] | Prüfweg | Rückfall |
|---|---|---|
| H-E6: Das Formular direkt nach den Paketen schadet Unentschlossenen nicht | Gespräche; nach Livegang die Zählung `ereignis:paket_frage` (PJ:220) | Formular nach 06 |
| C.6/1: Paket zuerst macht den Übergang vom Kartenknopf sichtbar | Lesetest „Welches Paket fragen Sie gerade an?“ | Reihenfolge nach Z |
| RE T10: Pflicht nur E-Mail erhöht den Abschluss | erst nach Freigabe IA-O-9; Vergleich gesendeter Anfragen vorher/nachher | Pflichtfelder wie heute |
| T-7: Die gekennzeichnete Vorbefüllung wirkt hilfreich, nicht übergriffig | Gespräche | nur das Paket vorbefüllen |
| Anbieterzeile mindert F-20 („Antwortet überhaupt jemand?“) | Gespräche | Zeile mit Telefon nach O-9 |
| „Telefon für Rückruf“ passt zum Gesprächsweg | Entscheidung O-9 | „Telefon (freiwillig)“ |
| Prüfung der E-Mail beim Verlassen hilft, ohne zu stören | Lesetest mit Tippfehler | nur beim Absenden |

„Formular begonnen“ wird heute nicht erfasst; eine anonyme Zählung bräuchte die Entscheidung des Inhabers (EA O-2). Über Wahrscheinlichkeiten
der Anfrage sagt dieser Abschnitt nichts.

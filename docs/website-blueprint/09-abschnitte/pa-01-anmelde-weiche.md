# Anmeldeseite als Weiche

Seite: Kundenkonto `/partner/` (noindex) · Position: 1 (einziger Inhaltsabschnitt zwischen Kopf und Fuß des Kundenkontos) · Intensitätsstufe: 1 ruhig (Typ T12; Ansichtstyp Arbeitsansicht nach DNA-B B.1)

ID `pa-01-anmelde-weiche` · Phase I, 24.10.2026, reine Planung (gelesen, nichts gebaut oder geändert) · **[V]** verbindlich, **[H]**
Hypothese mit Rückfall, **Textentwurf** neuer Wortlaut mit Freigabe, **Festlegung I** Entscheidung dieser Spezifikation · Grundlage: 08
8.3.8, 8.3.11; IA 5.3.2, 5.4.4 d; EA W10, W11; DG 2.3.14, 2.4.1–2.4.2, DG-E-1; DNA-B B.1–B.6; SG 10.7; 10-paketentscheidung J-R24 (ein Ziel je Zustand) ·
Lagen in CSS-Pixeln ab Oberkante, Textbreiten in Inter aus `web/fonts/` gemessen.

## A. Abschnitt und Funktion

| | |
|---|---|
| Name, Lage | Anmeldeseite als Weiche (08 K-1). Darüber der Kopf des Kontos (64 px, Logo → `/fuer-fensterbauer/`, „wie heute“), darunter der Fuß des Kontos (`web/assets/partner.js:114`). Es gibt keinen weiteren Abschnitt |
| Geltung | nur abgemeldet (Route leer oder `#anmelden`, `partner.js:595`, `:623`), dazu im Fehlerzustand „Gerade nicht erreichbar“ (`:777`) und ohne JavaScript. Bestellschritt „E-Mail“ und frische Anmeldung (`:582`) nutzen das Formular **ohne** Weiche. Auf Instanz-Hosts gibt es `/partner/` nicht (Prüfung 27.15) |
| Wer kommt | P-1 Paketkunde; FB-7 Bestandsbetrieb über „Anmelden“ außerhalb von `/` (08 8.2); Team eines Signature-Betriebs; Besucher ohne Paket. In Zustand A gibt es nur Bestellentwürfe (EA P-1) |
| Ziel | die drei Anmeldungen ordnen, ohne neue Seite (IA-H-9): Kundenkonto per Code hier, Betriebskonto auf `/`, Dashboard unter der Domain des Betriebs; ohne Paket zu den Paketen |
| Nutzerfrage | „Wo melde ich mich an?“ |
| Vorbereitete Entscheidung | richtiges Konto wählen; ohne Paket: Pakete ansehen (A) bzw. bestellen (B) |
| Gewicht | Telefon ≈ 0,72 BH (y 64–672); 08 nennt ≈ 1 BH |

## B. Konkreter Inhalt

**B.1 Bestand und Umgang**

| Element | Bestand | Fundstelle | Umgang |
|---|---|---|---|
| Kicker | „Konfigurator-Pakete“ | `partner.js:131` | bleibt |
| h1 | „Ihr **Kundenkonto**.“, ein Wort grün | `:131` | bleibt [V] (08) |
| Lead | „Hier begleiten Sie Ihren Konfigurator von der Bestellung bis Live: Status, Nachrichten, Rückruf und Rechnungen. Anmelden geht mit einem Code per E-Mail, ohne Passwort.“ (26 Wörter, am Telefon vier bis fünf Zeilen) | `:131` | gekürzt (B.2); Rückfall Bestand |
| Formular | „E-Mail-Adresse“, Cream „Code schicken“; danach „Code aus der E-Mail“, „Wir haben ihn an … geschickt. Er gilt eine Stunde.“, Cream „Bestätigen“, Link „Andere Adresse oder neuer Code“; Fehlersätze | `:121-129`, `:134-147` | Wortlaut bleibt; IDs `f-mail`, `f-code` und `data-a` bleiben (`scripts/pruefen-instanzen/27.mjs:548`) |
| Nebenzeile | „Noch kein Paket? Paket wählen und bestellen“ → `#bestellen` | `:132` | wird Zeile W3 mit Ziel je Zustand (W10; IA 5.4.4 d) |
| Titel, Robots | „Kundenkonto für Konfigurator-Pakete \| eeziframes“, `noindex, nofollow`, kein Zwischenspeicher | `web/partner/index.html:6-8`; `worker.js:25`; PA 1.10 Nr. 9 | bleibt [V] |
| ohne JavaScript | „Das Kundenkonto braucht JavaScript …“ | `index.html:27` | bleibt, dazu die Weiche (H) |
| Zustand A/B | `verkauf.bestellen` aus `GET /api/partner/stand` | `functions/api/partner.js:273-276`; `web/assets/instanzregeln.js:116-120` | schaltet W3 |

**B.2 Neu**

- **Lead, Textentwurf:** „Ihr Paket von der Bestellung bis Live. Anmelden mit einem Code, ohne Passwort.“ (13 Wörter, aus dem Bestand
  gekürzt; zwei Zeilen bei 358 und 542 px Satzbreite, drei bei 328 px). Mit dem Bestandssatz endete die Weiche bei 390 × 664 unter dem
  Rand (C).
- **Weiche:** drei Zeilen, jede aus einer Frage (15/500) und einer Antwort (Link 15/700 bzw. Hinweis 15/500).

| Nr. | Frage | Antwort | Ziel | Herkunft |
|---|---|---|---|---|
| W1 | „Sie nutzen eeziframes mit Kundenlinks?“ | „Zum Betriebskonto“ | `/#anmelden`: öffnet das Anmeldeblatt des Betriebsbereichs (H, Nr. 7) | **Textentwurf** aus IA 5.4.4 d und 08 |
| W2 | „Dashboard von EEZI Signature?“ | „Unter Ihrer Domain, Adresse /betrieb/“ | kein Link: Domain unbekannt, Kundendomains werden nicht verlinkt (IA) | **Textentwurf** nach 08 („Signature-Dashboard: unter Ihrer Domain, Adresse /betrieb/“), Paketname nach `pakete.js:60`, SKILL:71 |
| W3 in A | „Noch kein Paket?“ | „Pakete ansehen“ | `/fuer-fensterbauer/#pakete` | **Textentwurf**; Ziel nach 08 und W10; Wortlaut wie der Kopf-Ring „Pakete ansehen“ (08 8.2) |
| W3 in B | „Noch kein Paket?“ | „Paket wählen und bestellen“ | `#bestellen` | Bestand `partner.js:132` |

**Festlegung I zu 08.** In Zustand A heißt W3 nicht „Paket wählen und bestellen“. Bestellen ist dort nicht möglich, und der Besucher
erführe es sonst erst am Ziel (SKILL:49; CP Befund 11). W2 steht in beiden Zuständen, weil der Satz eine Tatsache über das Produkt nennt
und die Weiche so ohne Abfrage gleich bleibt. Name der Liste für Hilfstechnik: **Textentwurf** „Andere Zugänge“.

**Wortmenge:** 40 in A, 42 in B (Kicker 1, h1 2, Lead 13, Label 1, Cream 2, W1 7, W2 9, W3 5 bzw. 7; DNA-B B.2: etwa 40); heute 39 ohne
Weiche.

**B.3 Interaktionen.** E-Mail eingeben, Code anfordern (Enter oder Cream), Code eingeben und bestätigen, Adresse ändern (alles Bestand);
W1 und W3 sind normale Links im selben Tab; W2 ist nicht bedienbar.

**B.4 Komponenten.** `.p-kopfblock`, `.p-titel`, `.p-lead`, `.p-karte`, `.p-form`, `.p-f`, `.p-link`, `.p-fehlerliste`
(`web/assets/partner.css:21-41`, `:87-117`); `.btn.primary` mit `.pf`, `.spin`, `.eyebrow.kicker`, `.ak` und Tokens
(`web/assets/gemeinsam.css:9-31`, `:44-76`, `:201`); Chevron wie `CHEV` (`web/assets/portal.js:261`).

## C. Exakte Layoutkomposition

**Grundstruktur [V].** Linksbündiger Stapel an einer Ordnungslinie (G5): Lesestapel (Kicker, h1, Lead) → Karte mit dem Formular →
Weiche als flächenlose Zeilenliste zwischen Haarlinien. Die Karte ist die einzige Fläche und der Anker der Arbeitsansicht. Die Weiche
folgt darunter, weil der berechtigte Besucher sein Formular zuerst sehen soll; wer falsch ist, merkt es an der h1. Kein Held, kein Bild
(T12); asymmetrisch, Block links, Luft rechts.

**Raster.** Telefon: 4 Spalten à 77,5 px, Rinne 16, Rand 16; alles über die Spalten 1–4 (x 16–374). Schreibtisch: Das Konto behält
seine zentrierte Spalte `.p-schmal` (728 px Inhalt, bei 1280 x 276–1004), damit Kopf und Ordnungslinie beim Wechsel zu Bestellformular
und Übersicht stehen bleiben (SG 10.7, Regel 5). Sie gilt als 12-Spalten-Raster (46 px, Rinne 16); der Block belegt die Spalten 1–9
(542 px, x 276–818), 10–12 bleiben frei. Das 1040er-Raster der Website würde die Achse der Konto-Ansichten verlegen (Festlegung I).

**Abstände.** Kicker → h1 8, h1 → Lead 12, Lead → Karte 24, Karte → Weiche 24; in der Karte Rand 20, Label → Feld 6, Feld → Knopf 16
(Bestand). Das ergibt innen 8 und 12, zwischen Gruppen 24 (G6, 4-px-Raster).

**Verhältnisse (390 × 844).** Karte 358 × 179 (19 % des Bildschirms), Weiche 358 × 176, Lesestapel 358 × 117. Frei bleiben ≈ 50 %,
gemessen mit Textflächen nach Zeilenbreite, Kopf und Fuß eingerechnet; bei 664 px Höhe ≈ 46 % (Soll ≥ 33 %). Die Cream (318 × 52) ist
der größte Hellwert.

**Größenhierarchie.** h1 26 (Schreibtisch 30) > 17 (Lead, Feld, Cream) > 15 (Weiche) > 13 (Kicker, Label, Fehlersatz): vier Stufen,
Sprung 26/17 = 1,5. In der Arbeitsansicht ist das DNA-Ziel (≤ 3 Stufen, ≥ 3×) keine Pflicht. Begründetes Nein: Skala des
Betriebsbereichs (08; GEST:458), Hierarchie zusätzlich über Gewicht (800/700/500) und Tonwert (DG-E-1 C).

**Ebenen.** Z 0 Grund `#161616` → Z 20 Kartenfläche `#1f1f1f` mit 2-px-Ring → Z 30 Text, Formular, Weiche → Z 40 Kopf. Der Kopf klebt
und verdeckt beim Scrollen den Inhalt; das ist die eine Verdeckung.

**Interaktive Lage (Telefon).** Feld y 272–320 und Cream y 336–388 über die volle Breite; W1 y 433–497, W3 y 563–607. Alles liegt im
Daumenbereich, und die Cream ist die einzige gefüllte Fläche.

**Technische Startwerte** (in `partner.css`, nur Tokens aus `gemeinsam.css`):

```css
.p-anmelden { width: 100%; max-width: 542px; }                    /* Block; Telefon 358 */
.p-anmelden .p-kopfblock { gap: 0; }
.p-anmelden .p-titel { margin-top: 8px; }
.p-anmelden .p-lead { margin-top: 12px; max-width: none; }
.p-anmelden .p-karte { margin-top: 24px; }
.p-anmelden .btn:active:not([disabled]) { transform: none; background: var(--primary-hover); }
.p-anm-knoepfe { display: flex; flex-direction: column; align-items: stretch; gap: 8px; }  /* Cream, darunter Link */
@media (min-width: 521px) { .p-anm-knoepfe { flex-direction: row; align-items: center; gap: 16px; } }
.p-weiche { list-style: none; margin: 24px 0 0; padding: 0; border-top: 1px solid var(--line); }
.p-weiche > li { border-bottom: 1px solid var(--line); }
.p-wz { display: flex; align-items: center; gap: 12px; min-height: 44px; margin: 0 -8px; padding: 12px 8px;
  border-radius: var(--r2); font-size: 15px; line-height: 20px; font-weight: 500; color: var(--text2);
  text-decoration: none; transition: background-color 150ms var(--e-out); }
.p-wz .t { flex: 1; min-width: 0; }
.p-wz .z { display: inline-block; }                                /* Antwort bricht als Ganzes um */
a.p-wz .z { font-weight: 700; color: var(--text); text-decoration: underline 1.5px var(--line2);
  text-underline-offset: 4px; transition: text-decoration-color 150ms var(--e-out); }
.p-wz svg { flex: none; width: 8px; height: 14px; color: var(--muted); transition: color 150ms var(--e-out); }
.p-wz .pfad { color: var(--text); }
@media (hover: hover) { a.p-wz:hover .z { text-decoration-color: var(--text); } a.p-wz:hover svg { color: var(--text); } }
a.p-wz:active { background: var(--surface2); }
a.p-wz:focus-visible { outline: 2px solid var(--text); outline-offset: 0; border-radius: var(--r2); }
```

**Begründungen.** 542 statt heute 728 px: Ein E-Mail-Feld über 690 px ist überdimensioniert (SKILL:28), und 542 ist die schmalste
Breite, in der jede Zeile der Weiche einzeilig steht (W2 498 px). Haarlinien sind Trenner, keine Zielgrenze; das Ziel tragen Text,
Unterstreichung und Chevron. `margin: 0 -8px` hält den Text an der Ordnungslinie und gibt der Druckfläche Luft. `inline-block` ohne
`nowrap` lässt die Antwort geschlossen umbrechen, auch bei 200 % Text.

## D. Anwendung der Design-DNA

| Eigenschaft | Ausgestaltung | Intensität 0–4 | Wirkung, Beitrag zur Funktion |
|---|---|:-:|---|
| Tiefe, Z-Achsen | drei Ebenen (Grund, Kartenfläche, Bedienschicht), darüber der klebende Kopf | 1 | Ruhe; Verdeckung ist in der Arbeitsansicht Ziel, nicht Pflicht |
| Material, Transparenz | Karte matt und opak, 2-px-Ring; kein Glas (ohne Bild ausgeschlossen, DG 2.4.1), kein Relief, kein Glanz (DNA Nr. 9) | 0 | die Arbeitsfläche tritt zurück |
| Licht, Schatten | keines; kein Schatten an der Karte (Nr. 6, DG-AB-1), kein Schein an der Cream (Nr. 10) | 0 | der Hellwert der Cream bleibt der einzige Reiz |
| Formen | eine Familie: Pille (Cream), Radius 18 (Karte), 12 (Feld, Druckfläche der Zeilen), dazu Haarlinien | 1 | dieselben Formen wie im übrigen Konto (DG-AB-8) |
| 3D-Objekte, Perspektive | keine, alles frontal (Nr. 1) | 0 | – |
| Bildintegration | kein Bild, Bildanteil 0 (T12) | 0 | nichts konkurriert mit der Wahl |
| Oberflächendetails | Haarlinien zwischen den Zeilen, Chevron 8 × 14 in `--muted`, Unterstreichung 1,5 px mit 4 px Abstand, `/betrieb/` hell als Pfad, Pfeil im Kreis nur in der Cream | 1 | Präzision im Detail (designrichtung.md:17) ohne Zierrat |
| Animation | nur Zustände; Codefeld blendet über Deckkraft ein (F) | 1 | E-13: Arbeitsfläche ohne Auftritt |
| Typografie | Betriebsbereichsskala; Kicker grün in Versalien, ein grünes Wort in der h1; Fragen 500 `--text2`, Antworten 700 `--text` | 1 | Frage und Antwort sind ohne Farbe unterscheidbar |
| Überlagerungen | keine | 0 | – |
| Interaktive Effekte | Hover: Unterstreichung und Chevron hellen auf; aktiv: Füllung; Fokus: 2-px-Kontur; keine Skalierung (DNA-B B.3) | 1 | eindeutige Rückmeldung, Bedienschicht steht |

**Signature:** keine (08 8.3.11: Kundenkonto Stufe 1, Budget 0).

**Bewusst weggelassen:** Bild oder Figur, Glas, Licht, Maßlinie, Riesenwort, Rahmenbruch, Ladeauftritt, Rütteln, Schein, Kontosymbole;
ebenso drei Karten oder Reiter für die drei Konten (gleichrangige Flächen ohne Anker, SG 10.10 Nr. 11; zwei führen von der Seite weg).

**Abweichungen.** Jede Zeile ist eine **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**.

| Nr. | bestehende Regel | hier | Begründung |
|---|---|---|---|
| PA-AB-1 | „Ein Held je Bildschirm“ (designrichtung.md:14, :57, :204) | kein Held, die Karte ist Anker | T12; DG-E-1 C; ein Bild ohne Aussage wäre Füllung |
| PA-AB-2 | „Je Seite bricht mindestens einmal etwas aus seinem Rahmen“ (designrichtung.md:112) | nicht auf dieser Seite | DG-AB-18 |

Skala, Grün, Cream, Ziele und Ring folgen GEST:28, :458. **Nachbar, nicht Teil dieses Abschnitts:** Der Kopf des Kontos ist halbtransparent
mit Unschärfe (`partner.css:9`); T12 und DG-AB-10 verlangen ihn über Inhalt opak. Das ist mit dem Kopf zu entscheiden.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Blinzeltest:** Der einzige helle Fleck ist die Cream; die Karte hebt sich nur über den Ring ab.
2. **Primärer Fokus [H]:** Kicker → h1 (größte Schrift, ≈ 16 : 1) → Lead → Feld → Cream.
3. **Sekundärer Fokus [H]:** die Weiche, für den, der an der h1 merkt, dass es nicht sein Konto ist. Jede Zeile beginnt mit einer Frage
   in seinen Worten („Kundenlinks“, „Dashboard“, „kein Paket“), nicht mit einem Kontonamen.
4. **CTA-Gewicht, Kontraste:** Cream gefüllt, 52 px; Weiche ungefüllt, 15 px. Antworten fett in `--text` (≈ 16 : 1) und unterstrichen,
   Fragen in `--text2` (≈ 10,8 : 1). W2 ohne Unterstreichung und Chevron liest sich nicht als Link.
5. **Ablenkungen:** W3 steht zuletzt, damit sie Paketkunden nicht vorher abzieht; der Fußlink „Pakete“ doppelt ihr Ziel (Fuß überall
   gleich). Grün steht nur im Lesestapel.
6. **Übergang:** kein Folgeabschnitt, nach 64 px der Fuß. Im Code-Schritt rutscht die Weiche unter den Rand; gewählt ist dann schon.

## F. Interaktions- und Bewegungsverhalten

| Auslöser | Verhalten | Dauer, Kurve | Begründung | weniger Bewegung |
|---|---|---|---|---|
| Laden | „Kundenkonto wird geladen …“, dann die Seite ohne Auftritt; `stand` liegt vor dem ersten Zeichnen vor (`:776`), W3 wechselt nie sichtbar | Schnitt | E-13; T12 | gleich |
| Code schicken | Cream gesperrt mit Ladekreis, `aria-live` „Code verschickt an …“ (`:138`); Codefeld und Hinweis blenden ein, Fokus ins Codefeld (`:139`) | 220 ms Deckkraft, `--e-out` | Bedienschicht nur über Deckkraft (G1) | sofort; Ladekreis steht |
| Eingabefehler | Rand und Fläche in Fehlerfarbe, Satz 13/700, Fokus ins Feld (neu: heute geht er beim Neuzeichnen verloren, `:136`, `:143`) | sofort | DG-AB-3, kein Rütteln | gleich |
| Serverfehler | `.p-fehlerliste` mit `role="alert"` über dem Knopf; Fokus zurück auf die Cream | sofort | Ansage ohne Bewegung | gleich |
| Zeilen W1, W3 | Hover (`hover: hover`): Unterstreichung `--line2` → `--text`, Chevron `--muted` → `--text`; Drücken: Füllung `--surface2` (x 8–382); Fokus: 2 px `--text`, Abstand 0, Radius 12 | 150 ms, `--e-out`; Fokus sofort | Hover über Linie, aktiv = Füllung, Fokus ≥ 3 : 1 | gleich |
| Cream drücken | `--primary-hover`, ohne Skalierung (hebt `gemeinsam.css:65` hier auf) | 150 ms | DNA-B B.3 | gleich |
| W1 | Seitenwechsel nach `/#anmelden`; dort steigt das Anmeldeblatt auf (Katalog 7 des Betriebsbereichs) | wie Ziel | – | wie Ziel |
| W3 | A: Seitenwechsel zu `/fuer-fensterbauer/#pakete`. B: Ankerwechsel zum Bestellformular, Schritt 1, Fokus auf die h1, Rollen nach oben (Bestand `:600`) | – | – | ohne Rollen (Bestand) |

Kein eigener Seitenübergang; wird J-H10 (`@view-transition`) gebaut, blendet der Browser zu `/fuer-fensterbauer/` 240 ms über. Keine
Richtung, keine räumliche Transformation: An der Bedienschicht bewegt sich nichts.

## G. Responsive Design

**Telefon 390 × 844 (Hauptansicht), Zustand A**

| y | Element | x, Maß |
|---|---|---|
| 0–64 | Kopf des Kontos | Bestand |
| 88–105 | Kicker | x 16, 206 px |
| 113–142 | h1 26/29, einzeilig | 208 px |
| 154–205 | Lead, zwei Zeilen | 358 px |
| 229–408 | Karte, Radius 18 | 358 × 179 |
| 249–266 · 272–320 | Label · Feld | x 36–354 |
| 336–388 | Cream „Code schicken“ | 318 × 52 |
| 432–608 | Weiche mit vier Haarlinien: W1 433–497 (Frage 285 px, Antwort 139 px darunter), W2 498–562 (225 + 269 px), W3 563–607 (244 px, in B 328 px) | x 16–374, Chevron x 366–374 |
| 748–844 | Fuß | Bestand |

Bei 390 × 664 steht alles bis W3 im Bild (608 < 664) [V]. Code-Schritt: Karte 229–592, Weiche 616–792. **360 px:** Lead dreizeilig,
Weiche endet bei 634. **320 px:** W1 dreizeilig (84 px), W3 in B zweizeilig; kein Querscrollen; bei 200 % Text brechen die Antworten als
Ganzes um.

**Schreibtisch 1280 × 800**

| y | Element | x |
|---|---|---|
| 0–64 | Kopf des Kontos (Logo x 16, Bestand) | – |
| 88–105 | Kicker | x 276 |
| 113–147 | h1 30/34 | 241 px |
| 159–210 | Lead, zwei Zeilen | 542 px |
| 234–413 | Karte 542 × 179; Feld 502 × 48; Cream ≈ 199 × 52 links | x 276–818 |
| 437–573 | Weiche: drei einzeilige Zeilen à 44 px mit Haarlinien | x 276–818, Chevron x 810–818 |
| ≈ 704–800 | Fuß | Bestand |

Code-Schritt: Cream links, Link daneben, Weiche endet bei ≈ 706. Frei ≈ 70 %; die Schrift endet bei 30.

**1024 × 768:** Kontospalte x 148–876, Block x 148–690, gleiche y-Werte; die Weiche endet bei 573. **521–759 px:** Block bis 542 px,
Knöpfe nebeneinander.

## H. Technische Umsetzung

**Bestehend:** Dateien aus B.1 und B.4; dazu Routen `partner.js:590-628` und `start()` :775-791.

**Neu**

1. `weiche()` in `partner.js` liefert die Liste. Zustand B gilt bei `!!(S.stand && S.stand.verkauf && S.stand.verkauf.bestellen)`, ohne
   `stand` gilt A.
2. `anmeldenSeite()`: `<div class="p-anmelden">` um Kopfblock, Karte und `weiche()`; der Absatz „Noch kein Paket?“ entfällt.
3. `anmeldeForm(false)`: Knopfzeile `p-anm-knoepfe` mit DOM-Folge Cream vor Link, damit Lese- und Fokusfolge gleich sind.
   `anmeldeForm(true)` und die frische Anmeldung bleiben unverändert.
4. Fehlerfokus: nach `neuZeichnen(true)` in `codeSenden()` und `codePruefen()` das Feld mit `aria-invalid` fokussieren, sonst die Cream.
5. `start()`, Fehlerzweig (`:777`): unter „Neu laden“ ebenfalls `weiche()`.
6. `web/partner/index.html:27`: `<noscript>` um die statische Liste in Fassung A ergänzen.
7. **Voraussetzung außerhalb des Abschnitts:** Anker `#anmelden` auf `/` in `ankerLink()` (`web/assets/portal.js:1962-1975`): Ansicht
   Fensterbauer merken, ohne Sitzung Blatt `{ k: 'login' }`, mit Sitzung „Projekte“; Zeitpunkt wie `projektAnkerOeffnen()` (`:382-392`)
   nach `Server.start()` (`:1979`). Rückfall bis dahin: `/#fensterbauer` (ein Tipp mehr).
8. **Folgehinweis (Kundenkonto, nicht dieser Abschnitt):** Ohne Bestellung führt `neuRoute()` nach der Anmeldung ins Bestellformular
   (`:627`). In Zustand A oder bei `konto.betrieb` besser `#uebersicht`, wo der Satz zum Betriebsbereich schon steht (`:557`, Link dann
   `/#anmelden`); sonst landet ein falsch eingetretener Bestandsbetrieb in einem Formular, das in A nicht abschließbar ist (W10).

```html
<ul class="p-weiche" aria-label="Andere Zugänge">
  <li><a class="p-wz" href="/#anmelden"><span class="t">Sie nutzen <span translate="no">eeziframes</span> mit Kundenlinks?
    <span class="z">Zum Betriebskonto</span></span><!-- CHEV --></a></li>
  <li><p class="p-wz hinweis"><span class="t">Dashboard von <span translate="no">EEZI Signature</span>?
    <span class="z">Unter Ihrer Domain, Adresse <span class="pfad" translate="no">/betrieb/</span></span></span></p></li>
  <li><a class="p-wz" href="/fuer-fensterbauer/#pakete"><span class="t">Noch kein Paket?
    <span class="z">Pakete ansehen</span></span><!-- CHEV --></a></li>   <!-- B: href="#bestellen", „Paket wählen und bestellen“ -->
</ul>
```

**Assets:** keine; der Chevron ist Inline-SVG. **Animationstechnik:** CSS-Übergänge auf Farbe, Hintergrund und Deckkraft, keine
Bibliothek, Technikstufe 1 (SKILL:56). **Leistung:** kein Bild, ≈ 1,5 KB CSS und JavaScript, kein fremder Server; CLS 0, weil der
Zustand vor dem ersten Zeichnen feststeht.

**Barrierefreiheit:** `ul` mit Namen; Linkname = Frage und Antwort (WCAG 2.5.3); W2 als nicht fokussierbares `p`; Ziele ≥ 44 px;
Kontraste nach E, Chevron ≥ 3 : 1; `forced-colors`: Haarlinien `CanvasText`, Fokus `Highlight`; Reflow bis 320 px; eine h1, Fokus nach
Routenwechsel auf die h1 (Bestand `:118`).

**Prüfsuite** (`scripts/pruefen-instanzen/27.mjs` erweitern): abgemeldet `.p-weiche` mit drei Einträgen und zwei Links; W3 in A →
`/fuer-fensterbauer/#pakete`, in B → `#bestellen`; genau ein `.btn.primary`; im Bestellschritt „E-Mail“ keine `.p-weiche`; Schriftgrößen
13, 15, 17, 26 bzw. 30; die bestehenden Selektoren bleiben gültig.

## I. Conversion-Begründung

- **Position:** dort, wohin „Anmelden“ von allen Seiten außer `/` führt (08 8.2), ohne eigene Seite `/anmelden/` (IA); unter der Karte,
  weil der berechtigte Besucher (P-1) sein Formular zuerst sehen soll.
- **Gestaltung:** drei Fragen in den Worten der Besucher, je eine Antwort; Link und Hinweis sichtbar unterschieden; eine Cream.
- **Informationsmenge:** 40 Wörter (heute 39) trotz drei neuer Wege, weil der Lead von 26 auf 13 Wörter schrumpft; alles steht bei
  390 × 664 im ersten Bildschirm.
- **Beitrag zur Zielhandlung:** indirekt. In Zustand B (Z1) führt W3 Wiederkehrende direkt ins Formular (W10). In Zustand A (Z1a) führt
  W3 zu den Paketen statt in ein Formular, das erst in Schritt 6 sagt, dass nicht bestellt werden kann (CP 5.4). Im Service finden
  Bestandsbetriebe und Teams ihre Anmeldung ohne Rückfrage (IA-H-9).

**Zu testende Annahmen.** Es gibt keine Messung. Seitenaufrufe von `/partner/` zählt die Statistik nicht (`functions/api/statistik.js:165`),
wohl aber die Ereignisse `partner_code`, `partner_anmeldung`, `paket_entwurf` und `paket_frage` (`functions/api/partner.js:244`, `:267`,
`:314`, `:220`).

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| PA-H-1 | Bestandsbetriebe erkennen sich in „Kundenlinks“ und wechseln, bevor sie hier einen Code anfordern | Vorschlag: aggregierte Zählung der Anmeldungen hier mit Betriebskonto und ohne Bestellung (`betrieb` liegt vor, `:265`); Rückfragen | Weiche als eine Zeile über der Karte |
| PA-H-2 | Die Weiche unter der Karte hält Paketkunden nicht auf | Verhältnis `partner_anmeldung` zu `partner_code` vor und nach dem Umbau | Weiche zugeklappt hinter „Andere Anmeldung?“ (`details`) |
| PA-H-3 | Der Lead mit 13 Wörtern genügt, damit Paketkunden wissen, dass sie richtig sind | Lesetest „Wo melden Sie sich an?“ mit drei bis fünf Fensterbauern (EA O-2) | Bestandssatz, dann Weiche ab y ≈ 483–509 |
| PA-H-4 | „Pakete ansehen“ (A) führt Besucher ohne Paket eher zur Anfrage als das heutige Bestellformular | `paket_frage` gegenüber `paket_entwurf` vor und nach dem Umbau | keiner nötig, Lernwert |

**Offen:** Freigaben PA-AB-1 und PA-AB-2; die Textentwürfe (Lead, W2, W3 in A, Listenname); der Anker `/#anmelden` (H, Nr. 7); das Ziel
nach einer Anmeldung ohne Bestellung (H, Nr. 8); ein opaker Kopf des Kontos.

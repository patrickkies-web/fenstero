# Konzept A – Immersive Product Experience

Ergebnis 6 des Website-Blueprints (MASTER-PROMPT V4), Phase F und G, Konzept A von vier (A Immersive Product Experience, B
Conversion-First, C Guided Decision, D eigener Ansatz). Stand 24.10.2026, Arbeitszweig `claude/design-dna-styleguide`. Planungsdokument:
Das Repository wurde nur gelesen, gebaut und geändert wurde nichts. Alle vier Konzepte beruhen auf derselben Design-DNA und denselben
Inhalten; Konzept A unterscheidet sich von den anderen in Dramaturgie, Komposition und Führung, nicht nur in Oberflächen.

**Grundlage**

| Kürzel | Datei | Rolle |
|---|---|---|
| PA | [../01-projektanalyse.md](../01-projektanalyse.md) | Bestand, Material, Pflichten (1.10), Fragen (1.11) |
| DG | [../02-design-grammatik.md](../02-design-grammatik.md) | Übersetzung der DNA: Grundregeln G1–G9, Typen T0–T14, Stufen 1–4, Dosierregeln, DG-AB-n, DG-E-n, DG-H-n |
| RE | [../03-recherche.md](../03-recherche.md) | Erkenntnisse E1–E19, Regeln R1–R14, Tests T1–T19 |
| EA | [../04-entscheidungsarchitektur.md](../04-entscheidungsarchitektur.md) | Kette S0–S8 und B1–B5, Zweifel F-nn und H-nn, AB-n, O-n |
| IA | [../05-informationsarchitektur.md](../05-informationsarchitektur.md) | Ausgangsbasis: Abschnitte V1–V14, H1–H7, Bereiche K01–K37, Spielraum 5.7.4 |
| DNA | `docs/design-dna/03-design-dna.md` | verbindlich: Konstruktionsformel 5.1, Prinzipien Nr. 1–11 (5.2); variabel 5.3; Signature 5.4 |
| SG | `docs/design-dna/04-styleguide.md` | technischer Styleguide 10.1–10.10; „SG 10.7/2“ = Abschnitt 10.7, Regel 2; Zahlen nach 10.9 |
| DNA-B, PROMPT, VGL | `docs/design-dna/05-ergebnis-b-styleguide.md`, `…/06-design-prompt.md`, `…/02-vergleich.md` | Bausteine und Tokens; Design-Prompt; Statistik und Stilcluster |
| SKILL | `.claude/skills/premium-gestaltung/SKILL.md` | Anforderungen des Inhabers |
| DR, GEST | `.claude/skills/premium-gestaltung/designrichtung.md`, `docs/GESTALTUNG.md` | heutige Regeln; dürfen hinterfragt werden |

**Kennzeichnungen**

- **[V]** verbindlich: aus DNA Nr. 1–11, einer [Pflicht]-Regel des SG, einer Anforderung des Inhabers (SKILL), Recht oder Prüfsuite, oder
  eine [V]-Regel der Design-Grammatik, die Konzept A unverändert übernimmt.
- **[H]** experimentelle Gestaltungshypothese; wird erst nach Prüfung (Telefon-Video, Sichtprüfung durch den Inhaber, Lesetest mit
  Fensterbauern, Messung) zur Regel. Aussagen über Wirkung sind immer [H]; Wahrscheinlichkeiten werden nicht genannt.
- **Textentwurf**: neuer oder gekürzter Wortlaut aus belegten Fakten; braucht die Freigabe des Inhabers.
- **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig**: jeder Vorschlag gegen eine Regel in GEST oder DR, gesammelt als
  KA-AB-1 bis KA-AB-11 (Abschnitt „Abweichungen von bestehenden Regeln“). Abweichungen von IA, DG oder EA, die keine bestehende Regel
  betreffen, heißen KA-IA-n und sind als Konzeptentscheidung begründet.
- Bildschirm n am Telefon = y von (n − 1) × 844 bis n × 844 bei 390 × 844, am Schreibtisch 1280 × 800. „Bildschirmhöhe“ (BH) ist die
  Scrollstrecke einer Viewporthöhe. Alle Lagen, Längen und Anteile sind geplant, nicht gemessen; maßgeblich sind die Regeln, aus denen
  sie folgen (SG 10.9).
- Schriftgrößen nur 13, 15, 17, 24, 40, am Telefon 32 statt 40 (SKILL:69).
- Beispieldaten: ein Beispielbetrieb, eine Beispielfamilie, eine Beispieldomain auf der ganzen Website, jeweils mit „Beispiel“ in der
  Technikstimme gekennzeichnet (DG G7; PA-Frage 25). Dieses Dokument nennt sie nur als „Beispielbetrieb“ und „Beispieldomain“.

**Methode.** Das Konzept wurde aus simulierten Perspektiven geprüft: Inhaber eines kleinen Fensterbaubetriebs am Telefon, Büro eines
Betriebs am Schreibtisch, B2B-Vertrieb, Hauseigentümer vor dem Fenstertausch, Frontend-Leistung auf einem mittleren Android-Telefon,
Barrierefreiheit. Das ist eine Analysemethode, keine Nutzerstudie. Im Repository gibt es keine Nutzerforschung, Besucherzahlen,
Geräteanteile oder Konversionsraten (PA, „Was es nicht gibt“).

---

## Leitidee und für wen es am besten passt

### Leitidee

Konzept A verkauft den Konfigurator, indem es ihn vorführt, statt ihn zu beschreiben. Ein Gegenstand trägt die Seite: das Fenster aus dem
eigenen Konfigurator, das als Leitobjekt durch drei Akte wandert – unter der Domain des Betriebs (Browser), in der Hand seines Kunden
(Telefon) und als Aufmaßblatt auf seinem Tisch (Papier) – und in den Paketkarten in den drei Stufen der Marke wiederkehrt. Der Faden
zwischen den Szenen ist das Zeichen der Marke, Licht durch ein Fenster: Erdlicht im Bullauge, Lichtkegel über der Leiste, Leuchten des
Telefonbildschirms. Inszeniert wird bis zur Entscheidung; an Preis, Paket und Formular bewegt sich nur noch, was der Besucher selbst mit
dem Finger bewegt.

Kurzformel: **Ankommen → Vorführen in drei Akten → Wiedererkennen in den Paketen → in Ruhe absichern und handeln.**

### Für wen es am besten passt

| Gruppe (EA 4.2) | Passung | Grund [H] |
|---|---|---|
| **FB-2** sucht Software oder Konfigurator (K2, Absicht mittel) | sehr gut | will sehen, was er bekommt und wie es sich vom Kontaktformular unterscheidet; die Vorführung beantwortet S2 und S3 mit Material statt Behauptung (RE E3, E6; EA H-D3) |
| **FB-3** sah „Powered by EEZIframes“ (K3) | sehr gut | erkennt den Konfigurator, den er schon gesehen hat, und sieht in den Paketkarten, wie er ohne den Hinweis aussieht (F-24) |
| **FB-4** hat ein Aufmaßblatt in der Hand (K3, Ergebnis) | gut | Akt 3 zeigt genau dieses Blatt; der Weg dahin zeigt, woher es kommt |
| **FB-6** Prüfer kurz vor dem Kauf | gut, über Schnellwege | springt über „Pakete ansehen“ oder den Kopf-Knopf; die Vorführung bleibt für Mitentscheider abrufbar |
| Inhaber von eeziframes als Maßstab | sehr gut | „Ein Fensterbauer soll an der Seite merken, dass eeziframes Webdesign und Digitales beherrscht“ (SKILL:38): Konzept A macht die Seite selbst zum Beleg |
| **FB-1** Fachfrage mit der Brille „Aufmaß“ (K1) | mittel | kommt über Fachartikel; die Brücke „Anfragen statt Einzeiler“ steht erst in Akt 3, etwa 4 BH tief |
| **FB-5** angestoßen ohne Kontext | mittel | das Startbild ordnet zu; die Länge der Vorführung ist für Eilige ein Risiko |
| Besucher auf schwachen Geräten, mit langsamer Verbindung oder Bewegungsempfindlichkeit | nur mit Ersatzfassung | dann trägt die ruhige Fassung (Standbilder, Endzustände) die Seite allein |
| **HE-3, HE-5** Hauseigentümer | leichtere Dosis | die Startseite bleibt eine Stufe unter der Verkaufsseite (DG Dosierregel 5); die Objektreise beginnt im Startfoto und endet im Aufmaßblatt |

### Was Konzept A bewusst nicht ist

- Keine Echtzeit-3D-Bühne auf der Verkaufsfläche in der ersten Fassung (TD 6.1: das Modell hängt an `app.js`; DG 2.2.7). Alle Objekte sind
  Fotos, vorgerenderte Bildfolgen aus der eigenen WebGL-Bühne oder echte Bildschirmaufnahmen.
- Keine Inszenierung an der Entscheidung: Pakete, Formular und Abschluss bleiben bei Stufe ≤ 2 ohne inszenierende Signature (DG
  Dosierregel 1 [V]).
- Kein Riesenwort, keine Partikel in der ersten Fassung, kein Glas außerhalb des Startbilds, keine Kamera-Szene mit Dunst.
- Keine erfundenen Belege: keine Kundenstimmen, Zähler, Logos, Siegel; jede Zahl aus einer Quelle (SKILL:49; RE R7).

---

## Website-Architektur

### Seiten

Konzept A behält die Adressmenge der Ausgangsbasis vollständig (IA 5.1.1, 5.1.2): keine neue indexierbare Seite, keine Umbenennung, alle
Anker bleiben. Die Konzeptentscheidung liegt in der Ordnung und Form der drei Hauptflächen.

| Seite | In Konzept A | Intensität (DG 2.4.2) |
|---|---|---|
| `/fuer-fensterbauer/` (eingebettet in `/#fensterbauer`) | Hauptseite; Produktszene in drei Akten statt drei getrennter Abschnitte; Pakete als Wiedererkennung des Leitobjekts | Höchststufe 4, zweimal (Startbild, Akt 2) |
| `/` Startseite | eine Adresse, zwei Ansichten, Standard „Hauseigentümer“ (wie IA); der Umschalter wechselt die Ansicht als Szenenwechsel unter stehendem Kopf | Rahmen Stufe 1, Ansicht Hauseigentümer Höchststufe 3 |
| `/#hauseigentuemer` | Objektreise, die im Startfoto beginnt: dieselbe Maueröffnung wird vermessen, als Modell gefüllt, als Blatt ausgegeben | Höchststufe 3 |
| `/app/` | unverändert (Schnittstelle, IA 5.4.4 f) | Stufe 2 |
| `/konfigurator-bedingungen/`, Kundenkonto, Rechtsseiten, 404 | wie IA | Stufe 1 |
| `/ratgeber/`, 23 Ratgeber, 5 Fachartikel | wie IA; Handlungsbaustein K36 wie IA | Kopf 2, Fließtext 1 |
| Demo-Domains `demo-*.eeziframes.com` | Ziel von V6 und der Demo-Links an den Karten erst mit `PAKETE_DEMOS=1` (`docs/INSTANZEN.md:310`) | – |

### Abweichungen von 05-informationsarchitektur.md

| Nr. | IA | Konzept A | Begründung |
|---|---|---|---|
| KA-IA-1 | V3 „Die Idee“, V4 „So funktioniert es“, V5 „Was in jeder Anfrage steht“ als drei Abschnitte | **eine Produktszene in drei Akten** PS1–PS3 mit durchgehendem Leitobjekt; die drei h2 mit den Ankern `#die-idee`, `#so-funktioniert-es`, `#was-in-jeder-anfrage-steht` bleiben die Köpfe der Akte | IA 5.7.4 nennt „eine einzige Szene, die beides verbindet“ ausdrücklich als Spielraum; Objekt statt Text (SKILL:29, :41) |
| KA-IA-2 | Gegenüberstellung Einzeiler/Aufmaßblatt in V3 | wandert in Akt 3 als Schlusspunkt: der Einzeiler steht hinter dem angekommenen Blatt | der Vergleich wirkt erst, wenn das Blatt gezeigt ist; PS1 trägt stattdessen das Gerät mit der Domain |
| KA-IA-3 | V6 Live-Demos vor den Paketen | V6 `#demos` **nach** den Paketen, vor dem Kundenschutz | Probieren ist in Akt 2 schon vorgeführt; Demos gibt es je Paket (RE T11), sie gehören an die Karten; spart ≈ 0,4 BH vor den Paketen. EA AB-3 sah Demos ebenfalls nach den Paketen |
| KA-IA-4 | Ring im Startbild „Konfigurator ausprobieren“ → `#demos` bzw. App | Ring **Textentwurf** „Vorführung“ → `#so-funktioniert-es`; mit `PAKETE_DEMOS` „Live-Demo ansehen“ → `#demos` | verhindert den Weg in Paywall und Du-Anrede der App (W3; PAK B7) |
| KA-IA-5 | am Telefon keine Anheftstrecke (EA AB-10, DG-AB-13) | in Akt 2 eine klebende Bühne von ≈ 0,86 BH (höchstens 1,2 BH) am Telefon [H] | Kern der Vorführung; DR 3.5 erlaubt bis zwei Bildschirmhöhen; Rückfall ohne Kleben vorgesehen (KA-H-2) |
| KA-IA-6 | Länge ≈ 12,5 Telefon-Bildschirme, Pakete ab Bildschirm 6; Schreibtisch ≈ 10, Pakete ab 4 bis 5 | Telefon ≈ 13,6 BH, Pakete ab y ≈ 4.512 (5,3 BH, Bildschirm 6); Schreibtisch ≈ 12,6 BH, Pakete ab y ≈ 4.292 (5,4 BH, Bildschirm 6) | bewusster Preis der Vorführung; Ausgleich über Preiszeile im ersten Bildschirm, Cream „Pakete ansehen“ und Kopf-Knopf (KA-H-4) |
| KA-IA-7 | V9 Kundenschutz ohne Bild | Held [H]: Bild der Startansicht des Beispielbetriebs (Wiederkehr des Geräts aus Akt 1), ersatzweise Ankerkachel | DG T6, DG-H-7; Leitobjekt kehrt als Beleg „Nur Ihr Betrieb“ wieder |
| KA-IA-8 | Hinweis `?von=pdf` (K34) als Glas über dem Startbild | opake Karte `#1f1f1f` mit 1-px-Lichtkante über dem oberen Fotorand | Glasbudget am Telefon ≤ 2 Flächen (vordere Meldung, Maßwert) |
| KA-IA-9 | Umschalter wechselt sofort und springt an den Anfang | Wechsel als Szenenwechsel: Startfoto und Text der Ansicht blenden über (Motiv 700 ms, Text 240 ms), Kopf und Umschalter stehen | Szenenwechsel unter stehender Kopfzeile ist belegt (Ref 04/07; SG 10.7/5); macht die zwei Ansichten als zwei Bühnen derselben Marke lesbar [H] |
| KA-IA-10 | H2 Bildfolge Foto → Maß → Modell → Blatt als eigene Bühne | „Foto“ und „Maß“ geschehen im Startfoto selbst (Maßlinien zeichnen sich beim ersten Scrollen in die Maueröffnung); die Bühne von H2 zeigt nur noch Modell und Blatt | eine Öffnung, eine Reise; kürzer; RE T18 bleibt erfüllt [H] |
| KA-IA-11 | H6 mit Ausschnitt des Startfotos | [H] dieselbe Öffnung, jetzt mit Fenster darin (Bildwunsch an den Inhaber), ersatzweise der Ausschnitt aus H1 | Klammer: leer am Anfang, gefüllt am Ende (DG-H-8) |

Unverändert gegenüber IA: Kopf in drei Kontexten (N1–N9), Menü als Blatt von unten [H IA-H-13], Fuß kurz und lang, Wege zurück (5.3.6),
Zustände A und B der Verkaufsseite (5.4.2), alle Pflichtanker und festen Erwartungen der Prüfsuite (IA 5.1.1 Nr. 7).

### Navigation und Schnellwege in Konzept A

- **Kopf Fensterbauer** (Telefon 56 px, Schreibtisch 64 px): Ring „Pakete ansehen“ erscheint, sobald die Cream-Pille des Startbilds aus
  dem Bild ist (IA N4), ab V8 in Zustand A „Frage stellen“ (IA-H-12). Er ist der einzige Handlungsaufruf, der während der Vorführung
  sichtbar bleibt; in den Akten selbst steht kein Knopf (Bühne frei).
- **Kapitel als Zustand** (Schreibtisch): Die Sprungmarken „So funktioniert es“, „Ablauf“, „Fragen“ im Kopf wechseln ihre Farbe nach
  `--text`, solange ihr Abschnitt im Bild ist (DG-E-7 B); kein laufender Lesefortschritt (KA-AB-11).
- **Telefon-Menü:** Sprungmarken „So funktioniert es“, „Was in jeder Anfrage steht“, „Pakete“, „Ablauf“, „Fragen“ (IA 5.3.3).

---

## Seitenaufbau der Hauptseiten

Gewicht = Intensitätsstufe nach DG 2.4.2 · Länge am Telefon in Bildschirmhöhen · Bildanteil am Telefon-Bildschirm, während der Abschnitt
ihn füllt.

### Seite für Fensterbauer `/fuer-fensterbauer/` (eingebettet auch in `/#fensterbauer`)

| Nr. | Abschnitt, Anker | Funktion (Kette EA 4.4) | Inhalt (Quelle) | Gewicht | Handlung |
|---|---|---|---|---|---|
| 1 | **V1 Ankunft** (Startbild) | S1 Zuordnen; Schnellweg W2 | Kicker „Für Fensterbauer und Fensterhändler“ (VK:56); h1 „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“, grün „Marke“ (VK:57, Prüfsuite wörtlich); Chips **Textentwurf** „Ihre Domain · Ihre Marke · Anfrage als PDF“ (IA); Preiszeile **Textentwurf** „Ab 29 € im Monat, netto, plus Einrichtung · vorläufige Preise“ (EA S1; RE T1); Foto `fb-sessel.webp` mit Meldungsstapel aus drei „Beispiel“-Meldungen (VK:55) und Maßlinie am Bullauge | Stufe 4 · 1,0 BH · Foto 57 % | Cream „Pakete ansehen“ → `#pakete`; Ring **Textentwurf** „Vorführung“ → `#so-funktioniert-es` |
| 2 | **V2 Leiste Elementarten** | S1 Breite ohne Text | Elementarten aus dem Konfigurator (VK:66-68; Liste nach PA-Frage 29) als Renderings aus der eigenen Bühne, bis dahin Zeichnungen im Stil des Aufmaßblatts (heute) | Stufe 3 · 0,17 BH · Reihe 17 % | – |
| 3 | **PS1 Akt 1 „Ihre Domain“** `#die-idee` (h2) | S2 Verstehen: was er bekommt | h2 „Die Idee: der Fenster-Konfigurator Ihrer Wahl“, grün „Wahl“ (VK:74); Lead VK:61 („ohne ihn programmieren zu lassen“, Prüfsuite); vier Punkte je eine Zeile (VK:75-81, darunter „Ihr eigenes Baby“, Prüfsuite); Zeile zu F-08 **Textentwurf** (EA H-D4): „Ihr Konfigurator ist Ihr Werkzeug: Wir vermitteln keine Kunden.“; Geräte-Bühne: Browserfenster mit der Startansicht des Konfigurators unter der Beispieldomain, davor ein Telefon | Stufe 2 · 0,95 BH · Gerät 40 % | – |
| 4 | **PS2 Akt 2 „Ihr Kunde plant“** `#so-funktioniert-es` (h2) | S3 Sehen: Kundensicht | h2 „So funktioniert es“; drei Stationen, **Textentwurf** gekürzt aus VK:87-90: 1 „Ihr Kunde kommt über Ihren Link oder Knopf auf Ihre Domain. Er sieht nur Ihren Betrieb, keine Preise, keine Werbung.“ (F-10, VK:240) · 2 „Er plant selbst: Fotos, Maße, Wünsche.“ · 3 „Er sendet seine Anfrage.“; im Telefon echte Bildschirme des Konfigurators unter der Beispieldomain; Probierfenster: Modell drehen und öffnen | Stufe 4 · 1,5 BH, davon Haltestrecke 0,86 BH · Bühne 56 % | Probier-Steuerung (Regler „Drehen“, Knopf „Öffnen“, **Textentwurf**); kein Handlungsaufruf |
| 5 | **PS3 Akt 3 „Bei Ihnen kommt an“** `#was-in-jeder-anfrage-steht` (h2) | S3 Produktbeweis; Brücke für FB-1 und FB-4 | h2 „Was in jeder Anfrage steht“, grün „Anfrage“; Lead **Textentwurf** gekürzt aus VK:80: „Anfragen, mit denen Sie rechnen können.“; echtes Aufmaßblatt `tour-aufmassblatt-15.webp` („Beispiel“); die sieben Inhalte als eine Liste (VK:123-131; Katalog K15); dahinter der Einzeiler **Textentwurf** „Bitte um Angebot für 3 Fenster“ („Beispiel“, EA S2); Schluss: Station 4–5 aus VK:91-92 („Sie kalkulieren aus dem Aufmaß und fahren erst zum Feinaufmaß, wenn der Auftrag kommt.“) mit F-09 (PB:44: Maße sind Angaben der Kunden, Feinaufmaß beim Betrieb) | Stufe 3 · 1,1 BH · Bühne 48 % | – |
| 6 | **V7 Leiste Kennzahlen** | S4 Auftakt | nur geklärte Zahlen (VK:69-71; IA V7): „3 Pakete, ein Konfigurator“ · „1 PDF je Anfrage“ · „3–5 Werktage bis zum Livegang“ (meist, O-8) · „0 € Gebühr je Anfrage“; „0 Zeilen Code“ und „5 Minuten“ ruhen (O-10, O-11) | Stufe 2 · 0,15 BH | – |
| 7 | **V8 Die Pakete** `#pakete` (h2), `#paket-essential`, `#paket-plus`, `#paket-signature`, `#vergleich` | S4 Bewerten mit S5-Kern | h2 „Die Pakete“, grün „Pakete“ (VK:171); Leitsatz VK:172; **Textentwurf** „In allen Paketen: Ihre eigene Domain, der volle Konfigurator und jede Anfrage als Aufmaßblatt-PDF per E-Mail.“ (EA 4.3.3); Namensleiste mit Kurzname und Monatspreis; drei Karten aus `web/assets/pakete.js:42-67` mit Beispielbild je Paket als Geräte-Render in der jeweiligen Markenstufe; Vergleich gruppiert, zugeklappt (EA AB-6); Verkaufsstand-Satz (EA AB-4); Risikoblock **Textentwurf** EA 4.3.1; Gesprächsweg **Textentwurf** „Unsicher, welches Paket passt? Rückruf oder Nachricht“; Rechtshinweis (VK:188) | Stufe 2 · 1,65 BH · Beispielbild ≈ 24 % des Bildschirms, ≈ 44 % der Kartenhöhe | Cream am Knopf der empfohlenen Karte; Ring an den übrigen; Ring Gesprächsweg → `#frage` mit „Noch offen“ |
| 8 | **V6 Live-Demos** `#demos` (h2) | U1 Probieren je Paket | Zustand A: zwei Zeilen **Textentwurf** (IA V6) und Ring „Konfigurator ausprobieren“ → `/app/` [H neuer Tab]; mit Demos drei Zeilen je 56 px zu `demo-essential`, `demo-plus`, `demo-signature` | Stufe 1 · 0,3 BH | Ring |
| 9 | **V9 Ihre Kunden bleiben Ihre Kunden** `#kundenschutz` | S5 Absichern | h2 wörtlich (VK:159); vier Zusagen im Wortlaut der Prüfsuite (VK:160-166); Link „Paketbedingungen § 10“; Held [H] Bild der Startansicht des Beispielbetriebs, die nur ihn zeigt („Beispiel“) | Stufe 2 · 0,75 BH · Bild 22 % | Link |
| 10 | **V10 Von der Bestellung bis zum Livegang** `#ablauf` (h2) | S5 Ablauf, Mitwirkung, Anbieter | sechs Wörter der Statusleiste (`web/assets/instanzregeln.js:74-77`); „meist 3 bis 5 Werktage“ (VK:193, Prüfsuite); **Textentwurf** „Sie brauchen …“ (EA 4.3.1); Anbieterblock **Textentwurf** „eeziframes ist ein Angebot von Patrick Kies, Herzebrock-Clarholz.“ (PB:33) mit E-Mail | Stufe 2 · 1,1 BH · Maßstab als Hauptelement (Höhe 57 %) | – |
| 11 | **V11 Bestellen oder anfragen** `#bestellen` (h2), `#frage` | S6 Handeln | wie IA V11 (Zustand A: Formular K32; Zustand B: Block K33, Formular als Nebenweg) | Stufe 1 · 1,1 BH · kein Bild | Cream „Frage senden“ |
| 12 | **V12 Häufige Fragen** `#haeufige-fragen` (h2) | S5 Restzweifel | acht Fragen wie IA V12; JSON-LD wortgleich | Stufe 1 · 0,65 BH | – |
| 13 | **V13 Hintergrund** `#warum-kunden-selbst-planen`, `#quellen`, `#wissen-fuer-fensterbauer` | Belege | drei zugeklappte Zeilen wie IA V13 | Stufe 1 · 0,3 BH | – |
| 14 | **V14 Abschluss** | S6 zweite Gelegenheit | Ausschnitt des Startbilds (Bullauge mit Erdlicht) als Klammer, 390 × 240 px [H DG-H-8]; Überschrift **Textentwurf** „Drei Pakete, ein Konfigurator.“; drei Zeilen je 56 px (Kurzname, Monatspreis, Einrichtung, Knopf); in der Einbettung danach die Wechselkarte K06 | Stufe 2 · 0,6 BH · Bild 28 % | Cream an der Zeile des empfohlenen Pakets; Ring „Frage stellen“ |
| – | Brotkrumen über dem Fuß (IA-H-10), Fuß kurz | Recht, Wechsel, Kontakt | IA 5.3.5 | 0,9 BH | „Vertrag widerrufen“ |

**Zustände.** Wie IA 5.4.2 „Zustände der Seite“, mit zwei Unterschieden: Der Ring im Startbild heißt in Zustand A und B „Vorführung“ und
führt zu `#so-funktioniert-es`, erst mit `PAKETE_DEMOS` „Live-Demo ansehen“ → `#demos`; mit Demos trägt jede Paketkarte zusätzlich den
kleinen Link „Demo“ (RE T11). Vorbehalte stehen als Satz in Nebengröße dort, wo sie wirken: „vorläufige Preise“ in der Preiszeile von V1
und unter den Karten, „Demos in Kürze“ in V6, „Bestellung in Kürze“ am Formular (EA AB-4).

**Dramaturgische Kurve (Intensitätsstufe je Abschnitt).** V1 4 · V2 3 · PS1 2 · PS2 4 · PS3 3 · V7 2 · V8 2 · V6 1 · V9 2 · V10 2 · V11 1 ·
V12 1 · V13 – · V14 2. Prüfung gegen DG 2.3.17/6 und Dosierregel 2: zwei Abschnitte der Stufe 4, nicht nebeneinander (V1, PS2); nie mehr
als zwei Abschnitte der Stufe ≥ 3 in Folge (V1–V2, PS2–PS3); PS1 ist die bewusste Atempause der Stufe 2 zwischen Ankunft und Vorführung;
alle Entscheidungsflächen (V8, V11, V14) bei Stufe ≤ 2.

### Startseite `/` (Rahmen und Weiche)

Die Startseite bleibt eine Adresse mit zwei Ansichten; Standard ist „Hauseigentümer“ (IA 5.1.2; Google rendert diese Ansicht, Eyebrow
und h1 sind Prüfsuite-Pflicht). Ihr Inhalt in der Standardansicht ist der Einstieg für Hauseigentümer (nächster Abschnitt); hier steht der
Rahmen.

| Nr. | Rahmenteil | Funktion | Inhalt | Gewicht | Handlung |
|---|---|---|---|---|---|
| R1 | Band (K04) | Stand melden | Pilotleiste nur ohne Server; Einführungsband entfällt auf `/`, der Preis steht in der Preiszeile von H1 (IA-AB-6; nach dem 17.11.2026 ohnehin weg) | höchstens 40 px, sonst nichts vor dem Foto | – |
| R2 | Kopf (K01) mit Umschalter (K03) | Orientierung, Ansicht wählen | Telefon: Logo, Handlungsknopf, Menü in 56 px; Umschalter als Glas-Segment 260 × 44 px über dem Startfoto (y 68–112). Schreibtisch: Segment neben dem Logo. **Konzept A:** Der Wechsel ist ein Szenenwechsel (KA-IA-9): Kopf und Umschalter stehen, das Startfoto blendet in 700 ms (`--kurve-szene`) vom Waschbären an der Maueröffnung zum Astronauten am Bullauge über, die Bedienschicht der Ansicht in 240 ms über Deckkraft; danach steht die Ansicht am Anfang | Stufe 1; Glas zählt im Budget von H1 | Handlungsknopf „Fenster ausmessen“ (Ring, solange eine Cream-Pille im Bild ist) bzw. Ring „Pakete ansehen“ |
| R3 | Hinweis `?von=pdf` (K34) | FB-4 abholen | Titel aus `web/assets/portal.js:849`; zwei Zeilen **Textentwurf** (IA 5.4.4 a); Link „Aufmaß per Code übernehmen“ | opake Karte ≤ 180 px über dem oberen Fotorand von V1 (KA-IA-8) | Link, keine Cream |
| R4 | Ansicht | Hauptinhalt | Hauseigentümer H1–H7 (unten) oder Fensterbauer V1–V14 (oben, eingebettet, `Verkauf.auf` nach jedem Aufbau) | – | – |
| R5 | Wechselkarte (K06) | leiser Wechsel | wie IA R5 | ≈ 0,3 BH | Ring |
| R6 | Fuß kurz (K07) | Recht, Wechsel, Kontakt | wie IA 5.3.5 | ≈ 0,9 BH | „Vertrag widerrufen“ |
| R7 | Textfassung (K08) | Crawler ohne JavaScript | gleiche Abschnittsfolge wie die Ansicht (IA K08) | – | – |

In der eingebetteten Ansicht Fensterbauer trägt der Umschalter die nicht deckende Ersatzfüllung (80 %) ohne Live-Unschärfe, weil über
dem Foto von V1 schon zwei Glasflächen stehen (vordere Meldung, Maßwert; SG 10.9: ≤ 2 am Telefon); der Meldungsstapel rückt dort auf
y ≈ 124–228, damit er den Umschalter nicht berührt.

### Einstieg für Hauseigentümer `/#hauseigentuemer`

Anrede offen (EA O-13); Entwürfe ohne Anrede. Länge Telefon ≈ 6,1 BH.

| Nr. | Abschnitt | Funktion (B1–B4) | Inhalt (Quelle) | Gewicht | Handlung |
|---|---|---|---|---|---|
| H1 | **Startbild „Die Öffnung“** | B1 Zuordnen, Zutrauen, Start und Preis | Eyebrow und h1 wörtlich (`web/assets/portal.js:852`, Prüfsuite), grün „eezi.“; Lead **Textentwurf** aus `web/index.html:58`: „Zwei Fotos und die Maße mit dem Zollstock, jeder Schritt erklärt.“; Preiszeile **Textentwurf** (IA H1); Foto `start-hauseigentuemer.webp` (Waschbär misst die Maueröffnung im Rohbau); Licht in der Öffnung geht beim Laden einmal an; beim ersten Scrollen zeichnen sich drei Breiten und drei Höhen als Maßlinien in die Öffnung, Werte nur am kleinsten Maß je Richtung („Beispiel“) | Stufe 3 · 1,0 BH · Foto 55 % | Cream „Jetzt ausmessen“ → `/app/#ausmessen`; Ring „Führung starten“ → `/app/#fuehrung`, am Telefon **Textentwurf** „Führung“ (Breite) |
| H2 | **Objektreise „Was im Aufmaß steckt.“** | B2 Verstehen: das Ergebnis | h2 und Zusatz wie heute (`web/assets/portal.js:779`); Stationszeilen 1 Foto · 2 Maß · 3 Modell · 4 Blatt, die ersten zwei als erledigt markiert (sie geschahen im Startfoto); Bühne mit dem vorgerenderten Modell in der vermessenen Öffnung, dann das Aufmaßblatt (gekennzeichnet); Messangabe aus `web/index.html:59`; Elementarten als Wischzeile; Zeile zu H-06 „Grundlage für Angebote, kein Bestellmaß“ (AGB:35) | Stufe 3 · 1,0 BH · Bühne 46 % | – |
| H3 | **Was es kostet.** (**Textentwurf**) | B2, B3 Preis und Daten | drei Zeilen mit Preis 24 px (AGB:34, :55; `web/index.html:61`); Vertrauenszeilen K29 (IA H3); Held: das Aufmaßblatt aus H2 im Anschnitt am oberen Rand (DG T7 H3) | Stufe 2 · 0,7 BH · Anschnitt 14 % | – |
| H4 | **Aus dem Ratgeber.** | Zubringer | Weg in sechs Schritten (IA H4) | Stufe 2 · 0,6 BH | Kacheln als Links |
| H5 | **Häufige Fragen** | B3 | vier Fragen (IA H5) | Stufe 1 · 0,6 BH | – |
| H6 | **Das erste Fenster ausmessen.** (**Textentwurf**, IA) | B4 Handeln | Band 390 × 200 px: [H] dieselbe Öffnung mit eingesetztem Fenster (Bildwunsch, KA-IA-11), sonst Ausschnitt aus H1; Preiszeile wie H1 | Stufe 2 · 0,5 BH · Bild 24 % | Cream „Jetzt ausmessen“; Ring „Führung starten“ |
| H7 | **Wechselkarte Fensterbauer** | leiser Wechsel | wie IA H7 | – · 0,3 BH | Ring **Textentwurf** „Zur Seite für Fensterbauer“ |

Kurve: H1 3 · H2 3 · H3 2 · H4 2 · H5 1 · H6 2 · H7 –; Höchststufe 3 (DG Dosierregel 5).

---

## Unterscheidungsmerkmale

| Merkmal | Konzept A konkret | Gegenüber der Ausgangsbasis (IA, DG) |
|---|---|---|
| **Erster Bildschirm** | Telefon: Foto 390 × 484 px (y 56–540, 57 % der Höhe), Anker Bullauge mit Erdlicht im rechten oberen Bildviertel (≈ 100 × 240 px), Glas-Stapel 250 × 104 px links oben über der dunklen Kabinenwand, Lesestapel y 452–729 (33 % der Höhe) an der linken Kante x = 16; Cream (≈ 200 × 52) und Ring (≈ 146 × 52) in einer Zeile y 645–697 im Daumenbereich; Preiszeile y 713–729; die Leiste schneidet ab y 752 um 92 px an (11 %); rund 40 Wörter. Schreibtisch: Split 5 : 7, Text x 120–533, Foto x 553 bis an den Rand (57 % der Breite, 760 px hoch), h1 40 px in zwei Zeilen, Leiste 76 px angeschnitten (9,5 %). Ladeauftritt in drei Takten bis 4,1 s, dann Stand | wie DG T1, aber mit Lichtkeil als Rahmenbruch in die Leiste und Ring in die Vorführung; Staub entfällt (KA-AB-5) |
| **Informationsdichte** | Ziel rund 900 sichtbare Wörter ohne aufgeklappte Fragen und Vergleich (heute 1.456, PA 1.8; Schätzung aus den Abschnitten oben); in Szenen höchstens 40 Wörter je Telefon-Bildschirm, in Entscheidungsflächen höchstens 120; Lesetext höchstens drei Zeilen je Block, höchstens zwei Blöcke je Bildschirm (DG G2); Stationen als Zeile mit Ziffer statt als Karte | weniger Text als IA, weil „Die Idee“ und „So funktioniert es“ als Beschriftung einer Szene statt als Kartenabschnitte stehen |
| **Bild-Text-Verhältnis** | Telefon, Bildanteil je Bildschirm: V1 57 % · V2 17 % · PS1 40 % · PS2 56 % (Bühne) · PS3 48 % · V8 24 % (Beispielbild) · V9 22 % · V10 Maßstab (Grafik, Höhe 57 %, Fläche gering) · V11 bis V13 0 % · V14 28 %. Im ersten Drittel der Seite (bis 4,5 BH) liegt der Bildanteil im Mittel über 40 %, danach unter 25 % | im ersten Drittel bildlastiger als IA; danach gleich |
| **Stärke und Ort der Inszenierung** | drei Höhepunkte: Ankunft (V1, Stufe 4, Ladeauftritt und Licht), Vorführung (PS2, Stufe 4, klebende Bühne, Bildfolge, Bildschirmlicht, Probierfenster), Beweis (PS3, Stufe 3, Explosionsansicht); dazwischen eine Atempause (PS1, Stufe 2); ab V7 nur noch Bewegung, die der Besucher selbst auslöst (Wischen, Nachlauf des Beispielbilds) oder Zustandswechsel | IA verteilt die Signature-Effekte gleichmäßig über V1, V3, V5 und V10; Konzept A bündelt Wirkung im ersten Drittel und hält die zweite Hälfte ruhig |
| **Platzierung der Handlungsaufforderungen** | V1 Cream „Pakete ansehen“ (y 645) + Ring „Vorführung“; Kopf-Ring ab Verlassen des Startbilds; **keine Knöpfe in den Akten**; V8 Cream am Knopf der empfohlenen Karte (Karte y ≈ 4.787–5.427, Knopf ≈ 64 % der Kartenhöhe), Ring an den übrigen, Ring Gesprächsweg unter dem Risikoblock; V6 Ring; V11 Cream „Frage senden“; V14 Cream an der empfohlenen Zeile. Eine Cream-Fläche je Bildschirm [V] | IA hat dieselben Orte; Konzept A verzichtet auf jede Handlung zwischen V1 und V8 außer dem Kopf-Ring |
| **Darstellung des Angebots** | Angebot als Gegenstand: dasselbe Gerät aus Akt 1 (Browserfenster mit Beispieldomain, davor Telefon) kehrt in jeder Paketkarte als Beispielbild wieder, gerendert in der Markenstufe des Pakets (Essential: eeziframes-Design mit Namen und deutlichem „Powered by“; Essential Plus: Logo, Firmenfarbe, Fotos; Signature: ohne Hinweis, dazu das Dashboard); Telefon 278 × 280 px, ≈ 44 % der Kartenhöhe; Monatspreis als Held 32/40 px; alle drei Preise vorher in der Namensleiste; Risikofakten direkt unter den Karten | IA: Beispielbild ein Drittel der Karte (IA-H-14), Skizze bis Material da ist; Konzept A setzt auf das Geräte-Render und die Wiedererkennung des Leitobjekts (EA H-D8, Hälfte) |
| **Art der Entscheidungsunterstützung** | „Zeigen, wiedererkennen, selbst bewegen“: Antworten stehen in der Szene, in der der Zweifel entsteht (F-08 in PS1, F-10 in PS2, F-09 und F-15 in PS3, F-05, F-06, F-07 im Risikoblock); die Markenstufen werden durch eigenes Wischen sichtbar (das Beispielbild läuft bis 24 px nach und holt mit Feder auf, ≤ 3 % Überschwingen, nur Bildschicht); das Probierfenster lässt das Modell drehen und öffnen | IA und EA stützen die Entscheidung über Text und gruppierten Vergleich; Konzept A fügt die direkte Hand am Objekt hinzu, ohne die Bedienschicht zu bewegen |
| **Übergänge** | Übergabe des Leitobjekts statt bloßer Haarlinie: (1) V1 → V2 Lichtkeil des Erdlichts über die Abschnittskante (Rahmenbruch, einziger der Seite), Leiste überdeckt den ausgeblendeten Fotofuß um 92 px; (2) PS1 → PS2 Formanschluss Telefon 112 × 230 → 220 × 450 px (Faktor 1,96; Telefon als Match-Schnitt, Schreibtisch als Gleiten im Motiv [H]); (3) PS2 → PS3 Formanschluss Telefonbildschirm → Aufmaßblatt: das Blatt beginnt in Größe und Lage des Bildschirms (≈ 200 × 190 px) und wächst auf 330 px Breite; (4) PS3 → V7 die Kennzahlen-Leiste überdeckt den Fuß des auseinandergezogenen Blatts; (5) V8: das Gerät aus PS1 kehrt wieder; (6) V14: der Bullauge-Ausschnitt schließt die Klammer. Dazu überall Haarlinie mit Nummer und farbgleicher Grund (DG 2.3.17) | IA: Haarlinie, Anschnitt, farbgleicher Grund; Konzept A ergänzt Objekt- und Lichtübergaben |

---

## Anwendung der Design-DNA

### Verbindliche Merkmale überall

| DNA-Prinzip (5.2) | Umsetzung in Konzept A | Wo Konzept A es besonders gefährdet | Prüfung |
|---|---|---|---|
| Nr. 1 Frontale Bedienschicht | Überschriften, Stationen, Regler, Knöpfe, Karten stehen frontal; Perspektive nur in Foto, Geräte-Render und Modell | Probierfenster: der Regler „Drehen“ dreht das Bild, nie die Bedienschicht; Paketkarten werden beim Wischen weder gekippt noch skaliert | Stylelint-Sperre gegen `perspective`, `rotateX/Y` in UI (DG 2.1.9) |
| Nr. 2 Tiefe als Ebenenordnung, Verdeckung | je Ansicht mindestens eine Verdeckung: Text im Auslauf des Fotos (V1), Leiste über Fotofuß, Telefon über Browserecke (PS1, ≈ 37 % der Telefonhöhe), Blatt über Einzeiler (PS3, ≈ ⅓), Kartenrand über Fuß des Beispielbilds (V8) | PS2: Bühne mit Telefon und Lichtraum hat Verdeckung nur über das Lichtrund hinter dem Gerät; ergänzt durch die klebende Bühne, unter der die Stationen durchziehen (Ebene über Ebene) | Blinzeltest, Ebeneninventar je Abschnitt |
| Nr. 3 Anker und Ordnungslinie | linke Spaltenkante x = 16 (Telefon) bzw. Spaltenbeginn x = 120 (Schreibtisch); ein Held je Bildschirm | PS2 am Telefon: Bühne mittig (Achse x = 195) über einem linksbündigen Lesestapel; zulässig, weil das Motiv mittig steht (DG G5) | Blinzeltest bei 390 × 844 je Haltepunkt |
| Nr. 4 Bild und Seite ein Raum | Fotos laufen randlos in `#161616` aus; Renderings auf exakt `#161616` (ΔE00 ≤ 1) oder mit Alphakanal; Aufmaßblatt als Objekt; kein Hauptbild als Fotokarte | Geräte-Renders der Paketkarten liegen in der Karte: Inhaltsbild mit 1-px-Kante aus den Farbrollen, unten vom Kartenrand angeschnitten | Sichtprüfung auf Saum und Grundsprung |
| Nr. 5 Ein Formsystem | Vollrundung; vier Radien voll · 24 · 18 · 12 (DG-AB-8); Regler-Daumen als Kreis 44 px, Spur als Haarlinie mit Millimeterstrichen | Probierfenster bringt zwei neue Bedienelemente (Regler, Knopf); beide aus der Familie, kein Formbruch | Token-Prüfung |
| Nr. 6 Kein Schlagschatten als Tiefenträger | auf dunklem Grund Lichtkante statt `--float` (DG-AB-1); einziger Begleitschatten auf dem weißen Blatt ist entfallen, weil die Bestellmaß-Karte Teil der Schicht „Maße“ wird (KA-AB-10) | Geräte-Renders: Schatten nur im Render eingebacken als Bodenlicht, nie als CSS-Schatten | Code-Sperre `box-shadow` außer Tokens |
| Nr. 7 Maßstabssprung | am Telefon ist das Hauptelement jeder Ansicht ein Bild, Objekt oder Maßstab (DG G4); Telefon 450 px gegen Bedienschrift 13 px (Versalhöhe ≈ 9 px) = rund 50-fach | V7, V11, V12 ohne Bild: Klein-Stufe und Headline-Stufe nach DG-E-1 C | Größenstufen je Ansicht ≤ 3 |
| Nr. 8 Negativraum | ≥ 33 % frei je Bühne; dunkle Kabinenwand, Lichtraum-Rand, Messraster-Rand zählen als frei | PS2-Haltestrecke: Bühne 56 % plus Stationstext ≈ 20 %; frei bleiben die Flächen links und rechts des Telefons (≈ 2 × 85 × 470 px) und der Rand des Lichtraums, zusammen ≈ 35 % | Flächenrechnung am Prototyp |
| Nr. 9 Kein UI-Material | Karten `#1f1f1f` flach mit 2-px-Ring, Pillen flach; Material nur in Foto, Render, Papier, Gerät | Beispielbild-Renders mit Glanz der Gerätefront: Glanz bleibt im Bild, nie an der Karte | Sichtprüfung |
| Nr. 10 Kein leuchtendes UI | Licht nur im Bild: Erdlicht, Lichtkegel der Leiste, Bildschirmlicht; empfohlene Karte ohne Schein (DG-AB-14) | Lichtraum hinter dem Telefon darf nicht unter die Stationstexte reichen | Kontrastmessung an der ungünstigsten Stelle |
| Nr. 11 Grund untergeordnet | `#161616`; ein Helligkeitszentrum je Bildschirm, hinter dem Anker; Messraster ≤ 1,3:1 nur in PS3, unter Text ausgeblendet | V1/V2: Erdlicht und Lichtkegel gehören zu einer Quelle; nie zwei Lichtfarben auf einem Bildschirm | `farbanteil.py` je Bildschirm |

Dazu gelten unverändert die Grundregeln DG G1–G9 und die Konstanten DG 2.4.1, vor allem G1 (Physik nur in der Bildschicht), ein
bewegter Träger je Ansicht, autonome Bewegung endet nach höchstens 5 s, ruhige Fassung = Endbild, Mindestanforderungen vor Effekt.

### Variable Merkmale je Abschnitt

| Abschnitt | Dialekt (DNA 5.3) | Ausdrucksträger | Tiefenmittel | Fokusträger, Anteil | Licht | Material | Ordnungsfigur | Bewegung |
|---|---|---|---|---|---|---|---|---|
| V1 | B, dunkle Lichtbühne | Licht (Erdlicht) mit Foto | Verdeckung (Text im Auslauf), Glas über Bild | Astronaut am Bullauge, Anker Bullauge; Foto 57 %, Figur ≈ 25 % | 3: Quelle Bullauge, Blau ≤ 12 %, Lichtkeil über die Kante | 2: Foto, Glas vermittelnd | Telefon: senkrechter Stapel, Diagonale Meldung → Bullauge → Text; Schreibtisch: Split 5 : 7 | Ladeauftritt in drei Takten; Foto bleibt beim Scrollen zurück (0,88) |
| V2 | B als Reihe | Bilder der Elementarten | Wölbung der Bilder, Schärfestaffelung am Rand | mittleres Bild 90 × 90 px (1,25 × die übrigen) unter dem Lichtkegel | 1: Lichtkegel, höchstens halb so hell wie das Erdlicht, gleiche Farbe | 1: Oberflächen im Render | Band über die volle Breite | Versatz nach Scrolltempo, Faktor 0,42, Auslauf ≤ 1,2 s |
| PS1 | C mit Gerät | Gerät (Browser + Telefon) | Verdeckung Telefon über Browserecke | Geräte-Bühne 358 × 368 px (40 %) | 1: nur im Bildschirm | 2: Gerätefront | Telefon: Gerät oben, Text darunter; Schreibtisch: Split 5 : 7 | Adresszeile füllt sich einmal (1,2 s), Schloss wird grün |
| PS2 | B, Vitrine mit Gerät | Objekt im Licht (Telefon, Modell) | klebende Bühne über durchziehendem Text; Lichtraum hinter dem Gerät | Telefon 220 × 450 px (30 % der Fläche), Bühne 56 % der Höhe | 3: Quelle Bildschirm, Cream ≤ 12 %, Lichthof Ø ≈ 330 px | 3: Putz, Holz, Aluminium, Glas des Modells im Bildschirm | Achse x = 195 für das Gerät, Text an x = 16 | Bildschirmwechsel 220 ms, Bildfolge (Öffnen, Raffstore) scrollgekoppelt, Probierfenster per Regler |
| PS3 | B, Vitrine | Material (Papier) und Detail | Verdeckung Blatt über Einzeiler; Explosion | Blatt 330 × 313 px (85 % der Breite) | 2: kein eigenes, Papierweiß als Hellwert | 3: Papier, Druck, Haken | Telefon: Blatt oben, Liste darunter; Schreibtisch: Split | Formanschluss vom Bildschirm, Schichten lösen sich (0/28/56 px nach oben, 0/12/24 px nach rechts) |
| V7, V8 | C | – (Preis und Beispielbild als Hauptelement) | Kartenrand über Beispielbild | Beispielbild ≈ 44 % der Karte; Preis 32/40 | 1: im Render eingebacken | 1 | Kartenreihe mit Namensleiste | Wischen nativ mit `scroll-snap`; Beispielbild-Nachlauf ≤ 24 px, Feder ≤ 3 % |
| V6, V9–V13 | C | – | flacher Stapel, Ankerkachel bzw. Instanz-Bild | Bild 22 % (V9), Maßstab (V10) | 0–1 | 0–1 | Liste an der Kante | nur Zustände; V10 Marken werden grün beim Passieren der Bildschirmmitte |
| V14 | C mit Bildausschnitt | – | Ausschnitt in Grund ausgeblendet | Band 390 × 240 px | aus dem Ausschnitt | – | Liste an der Kante | keine |
| H1 | B | Licht in der Öffnung | Verdeckung (Text im Auslauf), Glas-Umschalter | Waschbär an der Öffnung; Foto 55 % | 2: Tageslicht in der Öffnung, Cream ≤ 15 %, einmal angehend | 2 | Stapel an x = 16 | Licht geht einmal an (1,6 s), Maßlinien zeichnen sich beim Scrollen |
| H2 | B | Modell, dann Blatt | Formanschluss Öffnung → Modell | Bühne 358 × 420 px (46 %) | 2 | 2 | Bühne oben, Zeilen darunter | scrollgekoppelte Bildfolge ohne Anheften |

### Signature-Effekte gezielt

Budget je Abschnitt nach DG 2.4.2 (Stufe 3: eine inszenierende, Stufe 4: höchstens zwei am selben Fokusträger; je eine informierende).

| Effekt (DNA 5.4) | Klasse | Ort in Konzept A | Bedingung | Zahl |
|---|---|---|---|---|
| Glas mit Hintergrundunschärfe | inszenierend | V1 Meldungsstapel (nur die vorderste mit Live-Unschärfe), H1 Umschalter | über Bildinhalt; am Telefon nie über bewegtem Motiv: die Meldungen fahren mit der Fotoebene (gleicher Faktor 0,88), damit sich unter dem Glas nichts verschiebt; Ersatzfüllung 80 % | 2 Orte je Bereich |
| Lichtquelle mit Lichtraum bzw. Lichtübertrag | inszenierend | V1 (Erdlicht, Lichtkeil über die Kante = Rahmenbruch), PS2 (Bildschirmlicht hinter dem Telefon) | eine Lichtfarbe je Bildschirm; nie in zwei Folgeabschnitten (V1 und PS2 sind durch V2 und PS1 getrennt) | 2 je Seite |
| Rahmenbruch | inszenierend | Lichtkeil V1 → V2 (DG-E-4 A) | genau ein Lichtkeil über genau eine Kante; zählt im Budget von V1 | 1 je Seite |
| Schärfestaffelung an Begleitelementen | inszenierend | V2 Ränder (Bilder am Rand 0,3–0,6 % der Breite unscharf, Namen scharf) | Fokus und Schrift scharf | 1 |
| Scrollgekoppelte Bildfolge im Motiv | inszenierend | PS2 (im Telefonbildschirm: Fenster öffnet, Raffstore fährt; Probierfenster), H2 (Modell) | ≤ 60 Bilder und ≤ 3 MB am Telefon, erst bei Annäherung; Poster = Endzustand | 1 je Seite |
| Material-Explosionsansicht mit Annotation | inszenierend | PS3 | drei Schichten, haarfeine Führungslinien, Beschriftungen frontal | 1 |
| Maßlinie mit Wert | informierend | V1 am Bullauge; H1 in der Öffnung | nie über Gesicht oder Hände; Orange = Maueröffnung | 1 je Ansicht |
| Messraster | informierend | PS3 | ≤ 1,3:1, zum Rand und unter Text ausgeblendet | 1 |
| Kennzahl-Kachel | informierend | V7 | nur belegte Zahlen, zählt nicht hoch | 1 Reihe |
| Fortschritts-Maßstab | informierend | V10 | Marken als Zustand, kein laufender Strich | 1 |

**Bewusst nicht eingesetzt:** Riesenwort und Bild-Wort-Ergänzung (Rhythmus, Zielkonflikt Schrift gegen Material ρ −0,26, DG-E-3);
Partikel und Staub (KA-AB-5; Variante nur anstelle des Lichtkeils); Kantenlicht als eigener Effekt; Dunst, Repoussoir, Kamera-Szene;
Schein als Zustand; Formreim; Glas außerhalb von V1 und H1; jede inszenierende Signature in V7 bis V14.

### Intensitätsmatrix

Ziel-Intensität auf der DNA-Skala 0–4 (Prüfmaß nach SG 10.9). Fett: Ausdrucksträger. In Klammern die Abweichung von DG 2.2.19.

| Dimension | V1 | V2 | PS1 | PS2 | PS3 | V7/V8 | V9/V10 | V11–V13 | V14 | H1 | H2 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| D1 Tiefe | 3 | 2 | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 3 | 3 |
| D2 Material | 2 | 1 | 2 | 3 | **3** | 1 | 1 | 1 | 1 | 2 | 2 |
| D3 Licht | **3** | 1 | 1 | **3** | 2 | 1 | 1 | 1 | 1 | **2** | 2 |
| D4 Schatten, Unschärfe | 2 | 2 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 2 | 1 |
| D5 Form | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| D6 Komposition | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| D7 Plastik | **3** | **2** | 2 | **4** | 2 | 2 | 1 | 0 | 1 | 3 | **3** |
| D8 Animation | 2 | 1 | 1 | 3 | 2 | 1 | 1 | 0 | 0 | 2 | 2 |
| D9 Scroll | 2 | 2 | 1 | 3 | 2 | 1 | 2 | 0 | 0 | 2 | 2 |
| D10 Mikrointeraktion | 1 | 1 | 1 | 2 (+1) | 1 | 2 | 1 | 1 | 1 | 1 | 1 |
| D11 Bild | 3 | 2 | 3 | 3 | 3 | 2 | 2 | 1 | 2 | 3 | 3 |
| D12 Detail | 2 | 1 | 2 | 2 | **3** | 2 | 2 | 1 | 1 | 2 | 2 |
| D13 Grund | 2 | 1 | 1 | 2 | 2 | 1 | 1 | 1 | 1 | 2 | 1 |
| D14 Morphing | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| D15 Perspektive | 2 | 1 | 1 | 2 | 1 | 1 | 0 | 0 | 0 | 2 | 2 |
| D16 Physik | 1 | 1 | 0 | 2 | 2 | 1 | 0 | 0 | 0 | 0 | 1 |
| D17 Übergänge | 1 | 1 | 2 (+1) | 2 | 2 (+1) | 1 | 1 | 0 | 1 | 2 (+1) | 2 |
| D18 Typografie | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 2 | 2 |

Lesart: Konzept A hebt nur die Übergänge (D17 in PS1, PS3 und H1: Objektübergaben, Szenenwechsel des Umschalters) und die
Mikrointeraktion am Probierfenster (D10 in PS2) um je eine Stufe. In PS1 (keine Unschärfe), V14 und der Ansicht Hauseigentümer liegen
einzelne Werte unter der Grammatik. Alle Obergrenzen der DNA bleiben (D13 nie 3, D14 außerhalb des Motivs 0).

### Technikstufen je Element

Zuordnung zu den zwei Stufen des Inhabers (SKILL:55-59) und zu den Ersatzstufen 0/1/2 des SG (10.8).

| Element | Stufe des Inhabers | Verfahren | Ersatzfassung |
|---|---|---|---|
| Foto V1 mit Tiefe beim Scrollen | Leicht (Telefon, Parallaxe 0,88); Premium als Standard am Schreibtisch (2,5-D mit Tiefenkarte, WebGL nach dem LCP), Telefon erst nach bestandener Leistungsprüfung (DG-E-13) | `transform` am Scrollfortschritt; Shader mit Tiefenkarte | Foto ohne Versatz |
| Foto H1 | Leicht; am Telefon ohne Parallaxe, weil der Glas-Umschalter darüber liegt (SG 10.8, Mobil); am Schreibtisch Parallaxe 0,9 | `transform` am Scrollfortschritt | Foto ohne Versatz |
| Glas-Meldungen, Glas-Umschalter | Leicht | `backdrop-filter`, 60 %, 24 px, Sättigung 100 % (DG-AB-17) | Ersatzfüllung 80 %; deckend bei reduzierter Transparenz |
| Maßlinien (V1, H1) | Leicht | SVG `stroke-dashoffset`, Wert zählt in der Bildschicht | fertige Linie |
| Lichtkeil, Lichtkegel, Lichtraum | Leicht | radiale Verläufe ≤ 3 Stopps, `mix-blend-mode: screen`, Dithering eingebacken | ohne Licht oder statisch |
| Leiste V2 | Leicht | `transform` je Bild nach Abstand zur Mitte (nur Bildschicht), Tempo aus Scrollgeschwindigkeit | flache, wischbare Reihe |
| Bildfolgen PS2, H2; Probierfenster | Premium nach DR 3.6 (vorgerenderte Bildfolge auf `<canvas>`); nach SG Stufe 1 mit Poster | Bilder aus der eigenen WebGL-Bühne mit `?gl=voll` und Playwright (TD 6.1); Canvas mit Pixeldichte ≤ 1,5; Regler als `input type="range"` | Einzelbild je Station; Regler entfällt ohne JavaScript |
| Echtzeit-Fenster für das Probierfenster | Premium (Stufe 2), **nicht in der ersten Fassung** | SG 10.8/9 wäre erfüllt (Besucher dreht stetig), aber das Modell hängt an `app.js` (810 KB) und bricht neben `portal.js` (TD 6.1) | Bildfolge |
| Explosionsansicht PS3 | Leicht | `transform` der Schichten am Abschnittsfortschritt, SVG-Führungslinien | auseinandergezogenes, beschriftetes Endbild |
| Wischreihe V8 mit Nachlauf | Leicht | `scroll-snap`, native Trägheit; Beispielbild-Nachlauf als `transform` mit Feder (≤ 3 %) | Karten untereinander, ohne Nachlauf |
| Szenenwechsel des Umschalters | Leicht | Überblendung über Deckkraft; View Transitions optional | Schnitt |

### Abweichungen von bestehenden Regeln

**Übernommen aus den Phasen B, D und E** (Begründung dort; jede trägt die Formel „Abweichung von bestehender Regel – Freigabe durch den
Inhaber nötig“): DG-AB-1 (Lichtkante statt `--float`), DG-AB-2 (Bedienschicht nur über Deckkraft einblenden), DG-AB-3 (keine
hochzählenden Zahlen in der Bedienschicht), DG-AB-4 (Karten ohne Überschwingen), DG-AB-5 (autonome Bewegung endet nach höchstens 5 s),
DG-AB-6 (nur Bilder wölben sich), DG-AB-7 (Kennzahlen-Leiste dunkel), DG-AB-8 (vier Radien), DG-AB-9 (keine Fotokarte als Hauptbild),
DG-AB-10 (Kopf opak über Inhalt), DG-AB-11 (Kacheln mit Anker), DG-AB-12 (Drehung nur reiner Bildkarten), DG-AB-13 **nur am Schreibtisch**
(am Telefon gilt KA-AB-2), DG-AB-14 (kein grüner Schein), DG-AB-15 (Bildparallaxe zulässig), DG-AB-16 (Motivdauern 500–900 ms),
DG-AB-17 (Glas ohne Sättigungsanhebung), DG-AB-18 (Rahmenbruch höchstens einmal), DG-AB-19 (Fragen als Zeilen); EA AB-2, AB-4, AB-5,
AB-6, AB-8, AB-9, AB-11; IA-AB-1 bis IA-AB-12. Abweichend von IA steht in V9 statt keines Bildes ein Bild der Startansicht des
Beispielbetriebs [H]; der Platzhalter `fb-kundenschutz` entfällt wie in IA-AB-8.

**Neu in Konzept A.** Jede Zeile: **Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig.**

| Nr. | Bestehende Regel | Vorschlag Konzept A | Begründung |
|---|---|---|---|
| KA-AB-1 | Abschnitte der Verkaufsseite „in dieser Reihenfolge“: … „Die Idee als vier Karten → So funktioniert es als Scroll-Bühne → Was in jeder Anfrage steht → … → Pakete → Ablauf → Demos → Bestellen …“ (GEST:447) | „Die Idee“, „So funktioniert es“ und „Was in jeder Anfrage steht“ als drei Akte einer Szene; Reihenfolge danach Kennzahlen → Pakete → Demos → Kundenschutz → Ablauf → Bestellen → Fragen → Hintergrund → Abschluss | Vorführung statt Kartenabschnitte (SKILL:29, :41); Demos gehören zu den Paketen (RE T11); Pakete bleiben am Telefon in Bildschirm 6 (EA H-D2) |
| KA-AB-2 | „So funktioniert es … am Telefon keine Bühne, je Karte das Zeichen links“ (GEST:447) | am Telefon eine klebende Bühne (Telefon 220 × 450 px) über durchziehenden Stationen, Haltestrecke ≈ 0,86 BH, höchstens 1,2 BH, davon ≥ ⅓ Ruhe im Endzustand; nicht bei „weniger Bewegung“, nicht bei Viewporthöhe unter 640 CSS-px | DR 3.5 erlaubt bis zwei Bildschirmhöhen; ohne Bühne trägt das Telefon die Vorführung nicht (Telefon zuerst, SKILL:28); widerspricht der Empfehlung DG-AB-13, EA AB-10 und dem Startwert SG 10.7 Mobil (Neuentwurf, nicht DNA-verbindlich) und ist deshalb Hypothese KA-H-2 mit Rückfall |
| KA-AB-3 | Ring-Knopf „Konfigurator ausprobieren“ im Startbild (GEST:447; VK:63) | Ring **Textentwurf** „Vorführung“ → `#so-funktioniert-es`; mit `PAKETE_DEMOS` „Live-Demo ansehen“ → `#demos` | „Konfigurator ausprobieren“ führt in Zustand A in die App für Hauseigentümer mit Preis, Paywall und Du-Anrede (PA 1.9/4; W3) |
| KA-AB-4 | Leiste 1 „je Eintrag eine Zeichnung im Stil des Aufmaßblatts … 24 px“ (GEST:451) | Renderings der Elementarten aus der eigenen Bühne, 72 px (Mitte 90 px), am Schreibtisch 96 px (Mitte 120 px), sobald Material vorliegt; bis dahin Zeichnungen | DR Baustein 9 „Kacheln mit echten Bildern statt Strichsymbolen“; SKILL:41 |
| KA-AB-5 | Startbild der Verkaufsseite mit „Staub im Lichtkegel“ (GEST:450) | Staub entfällt in der ersten Fassung; an seiner Stelle trägt der Lichtkeil über die Abschnittskante die zweite inszenierende Signature von V1 | Budget der Stufe 4 (zwei inszenierende am selben Fokusträger, DG 2.3.3); Partikel nur als Variante anstelle des Lichtkeils |
| KA-AB-6 | Startfoto der Startseite mit Haken-Chips (GEST:100; docs/BILDER.md:7) | Chips „Maße · Öffnungsart · Farbe · Glas“ verlassen das Foto (wie IA H1); stattdessen zeichnen sich beim ersten Scrollen Maßlinien in die Öffnung | Maß als Bild statt als Wort (SKILL:29); erster Bildschirm ≤ 40 Wörter (SG 10.9) |
| KA-AB-7 | „Drei Dauern … 150 · 220 · 320 ms … mehr gibt es nicht“ (GEST:38); Umschalter wechselt sofort (GEST:191) | Wechsel der Ansicht als Szenenwechsel: Motiv 700 ms, Bedienschicht 240 ms über Deckkraft; bei „weniger Bewegung“ Schnitt | Szenenwechsel unter stehender Kopfzeile (SG 10.7/5); Dauer nach DG-AB-16 |
| KA-AB-8 | Paketkarte: „24 Zwischentitel und Paketname“ (GEST:449); Beispielseite als Skizze im Browserrahmen (GEST:452) | Paketname 17 px fett, Preis 32/40 als Headline-Stufe (DG-E-2 A); Beispielbild als Geräte-Render (Browserrahmen und Telefon) in der Markenstufe des Pakets, ≈ 44 % der Kartenhöhe | höchstens drei Größenstufen je Ansicht (SG 10.1/4); „Bild statt Text“ und das mitwischende Beispielbild (SKILL:121-122) |
| KA-AB-9 | „Was in jeder Anfrage steht“ links die Liste, rechts die Miniatur, am Schreibtisch klebend (GEST:447) | Szene mit Formanschluss vom Telefonbildschirm und Explosionsansicht; am Schreibtisch ohne Kleben, am Abschnittsfortschritt | kürzerer Weg zu den Paketen am Schreibtisch; eine Haltestrecke je Seite und Gerät genügt der Vorführung [H] |
| KA-AB-10 | „davor Bestellmaß und Klärungsliste, die beim Scrollen leicht gegeneinander laufen“ (GEST:450) | die Bestellmaß-Angabe wird Teil der Schicht „Maße“ der Explosionsansicht; keine eigene schwebende Karte | am Telefon höchstens 3–4 Ebenen (DG 2.2.1): Grund mit Raster, Einzeiler, Blatt mit Schichten, Bedienschicht |
| KA-AB-11 | „an der Unterkante der Kopfzeile ein feiner Maßstab, der sich mit dem Lesefortschritt grün füllt“ (GEST:450) | kein laufender Lesefortschritt; am Schreibtisch wechselt die Sprungmarke des aktiven Kapitels als Zustand, am Telefon steht die Abschnittsnummer an der Haarlinie | keine Bewegung der Bedienschicht über Zustandswechsel hinaus (SG 10.10 Nr. 14); DG-E-7 B |

---

## Phase G – Visuelle Dramaturgie der Hauptseite

### Seite für Fensterbauer

**1. Erster Seitenaufruf.**
- **Bis zum LCP (Telefon):** Ohne Einblenden stehen Kopf (56 px, flächenlos auf einem Scrim 60 % → 0 über 96 px), das Foto
  `fb-sessel.webp` in Endlage als LCP-Element (82 KB, feste Maße, `fetchpriority="high"`), Kicker, h1 in drei Zeilen, Chips, Cream und
  Ring, Preiszeile und die Oberkante der Leiste. Keine Überschrift wartet auf JavaScript.
- **Nach dem LCP, drei Takte, nie zwei Träger zugleich** (SG 10.7/4): Takt 1, 0–0,9 s: Foto zoomt von 1,04 auf 1 (`--e-out`), das
  Erdlicht im Bullauge öffnet sich von 0 auf 12 % Deckkraft (Zeichnungsblau, radial, Lichthof ≈ 1,2 × Bullaugenbreite). Takt 2,
  0,9–2,9 s: drei Glas-Meldungen fallen bei 0,9 / 1,6 / 2,3 s von oben ein (je 600 ms, 24 px, Lichtkante auf der Bullaugen-Seite folgt
  50 ms später), Text der Meldungen aus dem Bestand („Neue Anfrage“ → „Projekt angelegt“ → „Bereit fürs Angebot“), oben „Beispiel“.
  Takt 3, 2,9–4,1 s: die Maßlinie am rechten Rand des Bullauges zeichnet sich in 1,2 s, ihr Wert zählt auf 1.200 mm (Bildschicht). Ab
  4,1 s steht alles; danach bewegt sich die Ansicht nur noch mit dem Scrollen.
- **Schreibtisch:** dieselben Takte; nach dem LCP lädt die 2,5-D-Tiefe des Fotos (Premium), sonst Parallaxe.

**2. Aufmerksamkeitserzeuger.** Genau einer: das Erdlicht im Bullauge, die einzige gesättigte Farbe und der hellste Fleck der
Ansicht. Der Blick folgt dann dem ersten Bewegungsbeginn (Meldung bei 0,9 s, links oben) und läuft über die Diagonale nach links unten
in die Überschrift. Die Meldungen enden nach der dritten, damit der Bewegungsbeginn nicht dauerhaft mit dem Lesen konkurriert (RE E5,
R2). Blinzeltest: ein dominanter Fleck (Bullauge), Cream-Pille als zweiter Pol ohne Fokusreiz (DG G3, DG-H-12).

**3. Erste Information.** Die h1 „Ihr eigener Fenster-Konfigurator, unter Ihrer Marke“ (32 px, ab dem ersten Bild lesbar), danach die
Chips als Zusammenfassung in drei Wörtern-Gruppen, danach die Preiszeile als erste Zahl. Lesefolge: Kicker → h1 → Chips → Pille → Preiszeile.
Die erste Produktinformation trägt das Bild: „Neue Anfrage“ als Beispiel-Meldung über dem Kopf des Astronauten.

**4. Position des Hauptmotivs.** Telefon: Astronaut rechts der Bildmitte (≈ 25 % der Fläche), Bullauge im rechten oberen Bildviertel
(x ≈ 290–390, y ≈ 120–360), Meldungsstapel oben links (x 16–266, y 72–176) über der dunklen Kabinenwand, ohne Gesicht, Hände oder
Papierflieger zu verdecken (SKILL:87); Lesestapel unten links ab y 452 im ausgeblendeten Fotofuß. Schreibtisch: Text links über 5 von 12
Spalten, Foto rechts über 7 Spalten bis an den Rand, Bullauge im rechten oberen Viertel des Fotos; Meldungen über dem Kopf des
Astronauten rechts vom Flieger (GEST:447).

**5. Layoutveränderung beim Scrollen.** Die Ordnungsfigur wechselt je Akt, die Ordnungslinie x = 16 bleibt:
Startbild (Foto oben, Stapel unten) → Band (Leiste über die volle Breite) → Gerät über Text (PS1) → klebende Bühne oben, Text zieht
darunter durch (PS2: 56 % Bühne, 44 % Text) → Objekt im Messraster über Liste (PS3) → Kartenreihe unter einer Namensleiste (V8) → Listen
an der Kante (V9–V13). Beim ersten Scrollen (0–300 px) bleibt das Foto zurück (Faktor 0,88, eine Ebene am Telefon), die Meldungen fahren
mit dem Foto, der Lesestapel mit 1,0; die Leiste schiebt sich über den Fotofuß, der Lichtkeil wird bis zum Lichtkegel der Leiste sichtbar.
Schreibtisch: Split 5 : 7 bleibt von V1 bis PS3; die Bühne steht immer rechts, der Text immer links.

**6. Einleitung des Folgeabschnitts.** Jeder Übergang hat eine Aufgabe:
- V1 → V2: Die Leiste schneidet den ersten Bildschirm um 92 px an (11 %); der Lichtkeil verbindet Bullauge und Lichtkegel.
- V2 → PS1: Haarlinie mit Nummer „01“, farbgleicher Grund; das Browserfenster der Geräte-Bühne erscheint als erstes Element unter der h2.
- PS1 → PS2: Formanschluss. Das kleine Telefon aus PS1 (112 × 230 px, vor der linken unteren Browserecke) ist dasselbe Gerät mit
  demselben Bildschirm wie das große in PS2 (220 × 450 px). Telefon: Match-Schnitt, das große blendet in 600 ms über Deckkraft ein,
  wenn seine Oberkante y 700 passiert. Schreibtisch [H]: das Telefon gleitet im Motiv von seiner Lage in PS1 in die Bühne von PS2 und
  wächst um Faktor 2 (Weg ≈ 200 px, unter ⅓ der Bildschirmhöhe).
- PS2 → PS3: Formanschluss vom Bildschirm zum Papier. Das Blatt beginnt in Größe und Lage des Telefonbildschirms (≈ 200 × 190 px,
  mittig) und wächst mit dem Abschnittsfortschritt auf 330 px Breite; kein Umschlag, kein Flieger (SKILL:125).
- PS3 → V7: Die Kennzahlen-Leiste überdeckt den Fuß des auseinandergezogenen Blatts (Überdeckung, Ref 12).
- V7 → V8: Haarlinie mit Nummer „04“; die Namensleiste mit drei Preisen steht vor der ersten Karte.
- V8 → V6 → V9 bis V13: Haarlinie mit Nummer; V9 zeigt das Gerät aus PS1 ein letztes Mal als Beleg „Nur Ihr Betrieb“.
- V13 → V14: Der Bullauge-Ausschnitt aus V1 öffnet den Abschluss (Klammer).

**7. Einsatz von Tiefe und Material.**
- V1: Foto mit fotografischer Tiefe, Glas über der Kabinenwand (60 %, 24 px), Erdlicht als Licht mit Quelle, Maßlinie als Präzisionsdetail.
- V2: Bilder wölben sich zum Rand weg (nur Bildschicht), Ränder 0,3–0,6 % unscharf, Mitte scharf unter dem Lichtkegel.
- PS1: Verdeckung Telefon vor Browser (≈ 37 % der Telefonhöhe überdecken die Browserecke); Material der Gerätefront; flach im Übrigen.
- PS2: das Gerät mit Glasfront und 1-px-Lichtkante (Cream 14 %) statt Schatten; Lichtraum hinter dem Gerät; im Bildschirm das Modell
  mit Putz, Holz, Aluminium und Glas der eigenen Bühne; Lamellen folgen um je 12 ms versetzt (in der Bildfolge eingebacken).
- PS3: Papierweiß als einziger großer Hellwert; Messraster (fein 8 px, kräftig 40 px, Weiß 3–5 %) zum Rand und unter Text ausgeblendet;
  drei Schichten mit haarfeinen Führungslinien; der Einzeiler liegt dahinter (+3° gedreht, reine Bildkarte).
- V8: Tiefe über Anschnitt (Kartenrand über dem Fuß des Beispielbilds) und den Nachlauf des Bildes; Material nur im Render.
- Ab V9 flach: Grund, Karte mit Ring, Schrift.

**8. Bewusste Reduktion.** Kein Riesenwort; kein Staub; kein Glas nach V1; keine Lichtfläche nach PS2; keine inszenierende Signature
ab V7; keine Knöpfe in den Akten; keine Zahlen, die hochzählen (außer dem Wert der Maßlinie in der Bildschicht); keine Kennzahlen ohne
Beleg; „Warum Kunden selbst planen“ nur zugeklappt in V13; Fragen als Zeilen statt Karten; PS1 als ruhige Stufe 2 zwischen zwei
Stufe-4-Abschnitten.

**9. Zeitpunkt und Art der Angebotsdarstellung.**
- **Sekunde 0, Bildschirm 1:** Preissignal in der Preiszeile „Ab 29 € im Monat, netto, plus Einrichtung · vorläufige Preise“
  (**Textentwurf**, RE T1).
- **Telefon y ≈ 4.286 (5,1 BH):** „3 Pakete, ein Konfigurator“ in der Kennzahlen-Leiste.
- **y ≈ 4.719 (5,6 BH):** alle drei Monatspreise in der Namensleiste (R9).
- **y ≈ 4.787–5.427:** die empfohlene Karte mit Preis 32 px, Einrichtung mit Satz, Steuerzeile 13 px, Unterschieden, Knopf und
  Beispielbild auf einem Bildschirm (R1); Risikoblock unmittelbar darunter (R8).
- **Schreibtisch:** Paketkopf ab y ≈ 4.292 (5,4 BH), drei Karten nebeneinander ab y ≈ 4.456, Preis und Knopf jeder Karte in einem
  800-px-Bildschirm.
- **Art:** Das Angebot erscheint als drei Zustände desselben Gegenstands, den der Besucher in Akt 1 kennengelernt hat; die Unterschiede
  stehen als Bild (Marke) und als drei bis vier Haken (nur Unterschiede, IA-AB-11), alles Übrige im gruppierten Vergleich.

**10. Hinführung zur Handlung.** Erster Bildschirm: Cream „Pakete ansehen“ im Daumenbereich (y 645–697) und Ring „Vorführung“. Danach
trägt der Kopf-Ring „Pakete ansehen“ den Weg, während die Akte ohne Knopf bleiben. An der Entscheidung: Cream am Knopf der empfohlenen
Karte („Essential Plus anfragen“ in Zustand A, `functions/pakete-seite.js:109-131`), Ring an den übrigen, darunter Risikoblock und Ring
„Unsicher, welches Paket passt? Rückruf oder Nachricht“. Danach Absichern (V9, V10) und das Formular mit vorgewähltem Paket (Cream
„Frage senden“). Wer bis zum Ende liest, findet in V14 die kompakte Paketwahl (Cream an der empfohlenen Zeile). Kein Countdown, keine
Einblendung, keine Frist (R7).

### Startseite, Bildschirme 1 und 2 (Ansicht Hauseigentümer)

**1. Erster Seitenaufruf.** Bis zum LCP stehen Kopf (Logo, Ring „Fenster ausmessen“, Menü), Glas-Umschalter über dem Foto (y 68–112),
Foto `start-hauseigentuemer.webp` (y 56–520), Eyebrow, h1, Lead, Cream und Ring, Preiszeile. Die h1 steht sofort, ohne Wort-für-Wort-Aufbau
(heute `portal.css:232-234`; DG 2.2.8). Nach dem LCP: Foto 0–0,9 s Zoom 1,04 → 1; danach geht das Licht in der Maueröffnung einmal an
(1,6 s, wie das Licht im Zeichen der Marke beim Laden, GEST:7): ein radialer Lichthof in Cream steigt von 0 auf 15 % und bleibt stehen.
Ab 2,5 s Ruhe.

**2. Aufmerksamkeitserzeuger.** Das angehende Licht in der Öffnung: Bewegungsbeginn und hellster Fleck zugleich. Der Waschbär steht mit
dem Telefon in der Hand davor; Blick und Handlung zeigen zur Öffnung, also zum Gegenstand (RE E3).

**3. Erste Information.** h1 „Fenster ausmessen. Selbst. eezi.“ (wörtlich), dann der Lead in zwei Zeilen, dann die Preiszeile
**Textentwurf** „Messen kostenlos, ohne Konto · Aufmaßblatt 7,99 € bis 17.11.2026, danach 12,99 €“ (nach dem Stichtag nur „Aufmaßblatt
12,99 €“).

**4. Position des Hauptmotivs.** Telefon: Foto über die volle Breite (390 × 464 px, 55 % der Höhe); Waschbär in der Bildmitte, Öffnung im
rechten Drittel; Lesestapel ab y 412 im ausgeblendeten Fotofuß an x = 16. Schreibtisch: Text links über 5 Spalten, Foto rechts über 7 bis
an den Rand, Umschalter als Segment neben dem Logo.

**5. Layoutveränderung beim Scrollen.** Zwischen 0 und 200 px Scroll (0–0,24 BH) zeichnen sich in der Öffnung drei Breiten und drei Höhen
als orange Maßlinien mit Endstrichen, nacheinander von oben nach unten, nie über Gesicht oder Pfoten (Prüfaufgabe am echten Foto). Einen
Wert tragen nur die kleinste Breite und die kleinste Höhe, denn „es zählt das kleinste Maß“ (`web/index.html:59`); die zwei Werte stehen
auf opaker dunkler Fläche (`#1f1f1f`, 90 %) statt auf Glas, weil der Glas-Umschalter schon eine der zwei Glasflächen des Telefons belegt
(SG 10.9). Das Foto steht am Telefon ohne Parallaxe (Faktor 1,0), damit unter dem Glas-Umschalter kein Motiv wandert (SG 10.8, Mobil); die
Tiefe dieser Phase trägt das Zeichnen der Linien. Am Schreibtisch bleibt das Foto mit Faktor 0,9 zurück.

**6. Einleitung des Folgeabschnitts.** H2 schneidet den ersten Bildschirm ab y 740 um 104 px an (12 %): Haarlinie, Nummer „01“, h2 „Was im
Aufmaß steckt.“. Die Stationszeilen von H2 nennen „1 Foto“ und „2 Maß“ als erledigt (grüner Haken als Zustand), weil beides gerade im
Startfoto geschehen ist; die Bühne beginnt mit derselben Öffnung als orange Umrisslinie.

**7. Tiefe und Material.** Bildschirm 1: Foto mit Tiefe, Glas-Umschalter, Licht in der Öffnung. Bildschirm 2: die Bühne von H2 zeigt
das vorgerenderte Fenster (Dreiviertelansicht, Sichtfeld 25–35°) in der vermessenen Öffnung; mit dem Scrollen öffnet sich der Flügel
(Bildfolge, dieselben Bilder wie in PS2), dann folgt das Aufmaßblatt als Papier.

**8. Bewusste Reduktion.** Keine Bänder vor dem Foto (nur die Pilotleiste ohne Server), keine Chips auf dem Foto (KA-AB-6), kein zweites
Licht, keine Kennzahlenleiste, keine Pakete in dieser Ansicht.

**9. Zeitpunkt und Art der Angebotsdarstellung.** Preis und „kostenlos, ohne Konto“ stehen im ersten Bildschirm (R12, R13); die
ausführliche Preisstaffel folgt in H3 (y ≈ 1.638, 1,9 BH) als drei Zeilen mit Preis 24 px.

**10. Hinführung zur Handlung.** Cream „Jetzt ausmessen“ (≈ 216 × 52 px) und Ring **Textentwurf** „Führung“ (≈ 115 × 52 px) in einer
Zeile (y 592–644, Daumenbereich); „Führung starten“ passt am Telefon nicht neben die Pille und bleibt am Schreibtisch und in H6. Sobald
die Cream-Pille das Bild verlässt, wird der Kopfknopf „Fenster ausmessen“ Cream (eine Cream-Fläche je Bildschirm, GEST:192); in H2 steht
kein eigener Knopf. Abschluss in H6 mit Cream „Jetzt ausmessen“.

---

## Scroll Experience Timeline

Scrollbereich = Lage der Viewport-Oberkante in Bildschirmhöhen (BH) und in px.

### Seite für Fensterbauer – Telefon 390 × 844

| Phase | Scrollbereich | Sichtbare Inhalte | Visuelles Hauptobjekt | Kamera, räumliche Komposition | Bewegung und Übergang | Informationshierarchie | Handlungsaufforderung | Funktion |
|---|---|---|---|---|---|---|---|---|
| 1 Ankunft | 0–0,2 (0–170) | Kopf, Foto mit Meldungen und Maßlinie, Kicker, h1, Chips, Cream und Ring, Preiszeile, Oberkante der Leiste | Bullauge mit Erdlicht | fotografischer Standpunkt in der Kabine, Blick des Astronauten nach rechts oben zum Bullauge; Seite als Stapel an x = 16 | Ladeauftritt in drei Takten bis 4,1 s, dann Stand | Bullauge → h1 → Pille → Chips → Preiszeile → Meldung | Cream y 645, Ring daneben | S1 Zuordnen; Preisniveau; Schnellweg W2 |
| 2 Abflug, Leiste | 0,2–1,0 (170–844) | Fotofuß, Lesestapel verlässt oben, Leiste in Bildmitte, Kopf von PS1 kommt | mittleres Bild der Leiste unter dem Lichtkegel | Reihe frontal, Bilder zum Rand gewölbt | Foto 0,88, Leiste versetzt sich nach Scrolltempo (0,42) und läuft ≤ 1,2 s aus; Lichtkeil verbindet Bullauge und Kegel; Kopf wird opak mit Haarlinie | Name des mittleren Elements | Kopf-Ring „Pakete ansehen“ erscheint | S1 Breite |
| 3 Akt 1 „Ihre Domain“ | 1,0–1,9 (844–1.600) | Haarlinie „01“, h2, Geräte-Bühne, Lead, vier Punkte, Zeile F-08 | Browserfenster mit Startansicht unter der Beispieldomain, davor Telefon | frontal, Telefon überdeckt die linke untere Browserecke | Adresszeile füllt sich einmal (1,2 s), Schloss wird grün; sonst Ruhe | h2 → Gerät → Lead → Punkte | Kopf-Ring | S2 Verstehen; F-01, F-02 (über den Konfigurator als eigene Seite), F-08 |
| 4 Übergabe | 1,9–2,27 (1.600–1.913) | Kopf von PS2, Bühne steigt ein | Telefon groß | Achse x = 195, Lichtraum dahinter | Match-Schnitt Telefon klein → groß (600 ms Deckkraft), Lichtraum öffnet sich 0 → 12 % | h2 „So funktioniert es“ | Kopf-Ring | S3 Auftakt |
| 5 Akt 2 Haltestrecke | 2,27–3,12 (1.913–2.636) | klebende Bühne y 64–534; darunter ziehen Station 1, 2, 3 durch | Telefon mit echten Bildschirmen | Telefon frontal; im Bildschirm das Modell in Dreiviertelansicht | Bildschirm wechselt bei der Auslöselinie y 600 (220 ms): Startansicht (Station 1, ab 1.863) → Foto (2.023) → Maß (2.103) → Modell, Flügel öffnet, Raffstore fährt (2.183–2.383) → Senden (Station 3, ab 2.383); danach Ruhe im Endzustand (253 px, 35 % der Haltestrecke). Stationsblöcke 160 / 360 / 140 px; Regler und Knopf des Probierfensters stehen am Fuß des Blocks von Station 2 und sind sichtbar, solange das Modell im Telefon steht | aktive Station in `--text` mit grünem Strich, übrige `--muted` | keine; Probier-Steuerung im Block von Station 2 | S3 Sehen: was der Kunde erlebt; F-10, F-34 |
| 6 Akt 2 Abgang, Akt 3 Auftakt | 3,12–3,6 (2.636–3.040) | Bühne scrollt nach oben weg, Haarlinie „03“, h2 | Blatt in Bildschirmgröße | mittig | Formanschluss: Blatt erscheint in Lage und Größe des Telefonbildschirms und wächst | h2 „Was in jeder Anfrage steht“ | Kopf-Ring | S3 Brücke zum Betrieb |
| 7 Akt 3 Explosion | 3,6–4,4 (3.040–3.710) | Blatt mit drei Schichten, Einzeiler dahinter, Messraster, Lead, Liste der sieben Inhalte, Station 4–5 mit F-09 | Aufmaßblatt (Papierweiß) | Draufsicht, Blatt −2°; Schichten lösen sich nach oben rechts (Lichtrichtung) | Schichten gleiten am Abschnittsfortschritt auseinander und kommen gestaffelt zur Ruhe; Führungslinien zeichnen sich mit; Einzeiler wird ab Fortschritt 0,7 sichtbar | Blatt → Lead → Liste → Schlusssatz | Kopf-Ring | S3 Produktbeweis; F-09, F-15; Vorteil 2 |
| 8 Auftakt Pakete | 4,4–5,6 (3.710–4.720) | Kennzahlen-Leiste, Haarlinie „04“, h2 „Die Pakete“, Leitsatz, „In allen Paketen“, Namensleiste | Leiste, dann Namensleiste mit drei Preisen | frontal | Leiste überdeckt den Blattfuß, versetzt sich nach Scrolltempo; danach nur Zustände | Zahlen → h2 → Leitsatz → drei Preise | Kopf-Ring wechselt zu „Frage stellen“ (IA-H-12) | S4 Auftakt; F-05 vorab |
| 9 Paketwahl | 5,6–6,6 (4.720–5.570) | Namensleiste, empfohlene Karte voll, Nachbarn je 40 px; Verkaufsstand-Satz | Beispielbild der Karte (Geräte-Render) und Preis als Held | Gerät frontal mit Studiolicht im Render | Wischen nativ mit `scroll-snap`, ohne Überschwingen; Beispielbild läuft ≤ 24 px nach, Feder ≤ 3 %; Zeiger der Namensleiste folgt (Zustand) | Preis → Unterschiede → Knopf → Beispielbild | Cream am Knopf der empfohlenen Karte, Ring an den übrigen | S4 Bewerten; Z1+; F-23, F-24 |
| 10 Absichern im Paketblock | 6,6–7,0 (5.570–5.900) | Vergleich zugeklappt, Risikoblock, Gesprächsweg, Rechtshinweis | Risikoblock (Haken grün) | Liste an x = 16 | keine | fünf Risikofakten → Grenze → Link | Ring Gesprächsweg | S5-Kern; F-05, F-06, F-07, F-30 |
| 11 Demos, Kundenschutz | 7,0–8,3 (5.900–7.000) | V6 zwei Zeilen und Ring; V9 Instanz-Bild, vier Zusagen | Bild der Startansicht des Beispielbetriebs | frontal, wie in Akt 1 | Haken werden einmal gezogen (500 ms) | h2 → Bild → Zusagen | Ring „Konfigurator ausprobieren“; Link § 10 | U1; S5 F-10, F-11 |
| 12 Ablauf, Anbieter | 8,3–9,5 (7.000–8.000) | Maßstab mit sechs Marken, Schritte, „Sie brauchen …“, Anbieter | senkrechter Maßstab | Maßstab an x 16–40, Text ab x 56 | Marken werden grün, sobald ihr Schritt die Bildschirmmitte passiert (220 ms) | Dauer „meist 3 bis 5 Werktage“ → Schritte → Mitwirkung → Anbieter | – | S5 F-19, F-20 |
| 13 Anfrage | 9,5–10,7 (8.000–9.050) | h2, Satz zum Verkaufsstand, Formular | – (Formular) | eine Spalte | Rückmeldung 220 ms; Dank ersetzt das Formular | Felder → Cream | Cream „Frage senden“ | S6 Handeln; Z1a |
| 14 Fragen, Hintergrund | 10,7–11,7 (9.050–9.900) | acht Fragen, drei zugeklappte Zeilen | – | Zeilen mit Haarlinien | Öffnen 220 ms Deckkraft | Fragen | – | S5 Restzweifel; Belege |
| 15 Abschluss | 11,7–12,1 (9.900–10.200) | Bullauge-Ausschnitt, „Drei Pakete, ein Konfigurator.“, drei Zeilen | Bullauge (Klammer) | Ausschnitt randlos, in den Grund ausgeblendet | keine | Überschrift → drei Preise | Cream an der empfohlenen Zeile, Ring „Frage stellen“ | S6 zweite Gelegenheit |
| 16 Fuß | 12,1–12,6 (10.200–10.606, Ende der Seite) | Brotkrumen, Fuß kurz | – | – | – | – | „Vertrag widerrufen“ | Recht, Wechsel |

### Seite für Fensterbauer – Schreibtisch 1280 × 800

Gleiche Inhalte und Funktionen; abweichend sind Lagen, Komposition und die Haltestrecke.

| Phase | Scrollbereich | Abweichende Komposition | Bewegung und Übergang | Handlungsaufforderung |
|---|---|---|---|---|
| 1 Ankunft | 0–0,2 (0–160) | Split 5 : 7: Text x 120–533 (Kicker y ≈ 236, h1 40 px y ≈ 260–344, Chips y ≈ 364, Knöpfe y ≈ 424–476, Preiszeile y ≈ 496); Foto x 553–1280, y 0–760; Meldungen über dem Kopf des Astronauten | wie Telefon; danach 2,5-D-Tiefe des Fotos (Premium) | Cream und Ring nebeneinander |
| 2 Leiste | 0,2–1,1 (160–900) | Leiste 176 px, Bilder 96 px, Mitte 120 px, volle Fensterbreite | wie Telefon | Kopf-Ring rechts |
| 3 Akt 1 | 1,1–2,0 (900–1.636) | Text links über 5 Spalten; Geräte-Bühne rechts über 7 Spalten: Browser 600 × 375, Telefon 150 × 308 überdeckt die linke untere Browserecke | Adresszeile füllt sich | Kopf-Ring |
| 4 Übergabe und Akt 2 | 2,0–3,7 (1.636–2.964) | Bühne rechts angeheftet 1,2 BH (960 px): Telefon 300 × 620, Lichtraum Ø ≈ 450 px; links Stationsliste je ≈ 96 px mit Unterzuständen und Probierfenster-Regler | [H] Telefon gleitet aus PS1 in die Bühne und wächst um Faktor 2; Stationen wechseln an der Bildschirmmitte; Ruhe ≥ ⅓ (≥ 320 px) | keine; Sprungmarke „So funktioniert es“ im Kopf aktiv |
| 5 Akt 3, Kennzahlen | 3,7–5,4 (2.964–4.292) | Split: Szene rechts (Blatt 520 × 493, −2°), Liste links; Führungslinien laufen von den Beschriftungen links über den Spaltenabstand zu den Schichten; danach die Kennzahlen-Leiste (176 px, volle Fensterbreite) | ohne Anheften, Explosion am Abschnittsfortschritt (KA-AB-9) | Kopf-Ring |
| 6 Pakete | 5,4–6,4 (4.292–5.120) | h2, Leitsatz, „In allen Paketen“; drei Karten 330 × ≤ 640 nebeneinander, Zeilen über `subgrid` auf einer Höhe; Beispielbild 298 × 260 unten in der Karte; keine Namensleiste (alle drei Preise sichtbar) | Beispielbild läuft beim Scrollen nicht nach (kein Wischen); nur Zustände | Cream an der empfohlenen Karte |
| 7 Absichern im Paketblock | 6,4–6,7 | Risikoblock und Gesprächsweg links, Vergleich rechts, zwei Spalten | keine | Ring Gesprächsweg |
| 8 bis 16 | 6,7–11,6 (Ende der Seite) | wie IA und DG: V9 Bild rechts über 6 Spalten, Kacheln 2 × 2 links; V10 Maßstab links, Schritte über 7 Spalten; V11 zwei Spalten; V12 höchstens 820 px Zeilenbreite; V14 Ausschnitt 1040 × 240 | wie Telefon | wie Telefon |

### Startseite, Ansicht Hauseigentümer – Telefon 390 × 844

| Phase | Scrollbereich | Sichtbare Inhalte | Visuelles Hauptobjekt | Kamera, räumliche Komposition | Bewegung und Übergang | Informationshierarchie | Handlungsaufforderung | Funktion |
|---|---|---|---|---|---|---|---|---|
| 1 Ankunft | 0–0,2 (0–170) | Kopf, Glas-Umschalter, Foto, Eyebrow, h1, Lead, Cream und Ring, Preiszeile, Kante von H2 | Licht in der Maueröffnung | Standpunkt im Rohbau, frontal zur Wand, Öffnung rechts | Zoom 0–0,9 s, Licht geht einmal an (1,6 s), dann Stand | Öffnung → h1 → Lead → Pille → Preiszeile | Cream „Jetzt ausmessen“ y 592, Ring „Führung“ daneben | B1 Zuordnen, Zutrauen, Preis |
| 2 Messen im Foto | 0,2–0,45 (170–380) | Foto mit Maßlinien, Lesestapel oben angeschnitten, h2 von H2 | Öffnung mit sechs Maßlinien, zwei Werte am kleinsten Maß | wie 1 | Maßlinien zeichnen sich zwischen 0 und 200 px Scroll; Foto ohne Parallaxe; danach Stand | Maßlinien → h2 | Kopfknopf wird Cream, sobald die Pille das Bild verlässt | B2 Auftakt: „so wird gemessen“ |
| 3 Objektreise | 0,45–1,1 (380–930) | Bühne von H2, Stationszeilen 1–4 | Modell in der Öffnung, dann Blatt | Modell Dreiviertelansicht 25–35°; Blatt Draufsicht | Bühnenfortschritt zwischen Scroll 260 und 786: Modell (Flügel öffnet, 16 Bilder) bis 0,5, dann Formanschluss zum Blatt; ohne Anheften | aktive Station → Messangabe | Kopf Cream | B2 Verstehen, H-06 |
| 4 Ergebnis, Kosten und Daten | 1,1–2,6 (930–2.240) | Messangabe, Elementarten als Wischzeile, Zeile „Grundlage für Angebote, kein Bestellmaß“; dann H3 mit Blatt im Anschnitt, drei Preiszeilen, Vertrauenszeilen | Preis 24 px | Zeilen an x = 16 | Wischzeile nativ; sonst keine | Messangabe → Preise → Daten | Kopf Cream | B2, B3; H-02, H-03, H-04, H-06 |
| 5 Ratgeber, Fragen | 2,6–4,1 | Weg in sechs Schritten, vier Fragen | Kachel „Ausmessen“ | 2 × 3 Kacheln | Zustände | „Ausmessen“ hervorgehoben | Kacheln als Links | Zubringer, B3 |
| 6 Messaufforderung | 4,1–4,7 | Band mit der Öffnung (gefüllt [H] oder Ausschnitt), Überschrift, Knöpfe, Preiszeile | Öffnung | Band randlos | keine | Überschrift → Pille | Cream „Jetzt ausmessen“, Ring „Führung starten“ | B4 Handeln |
| 7 Wechselkarte, Fuß | 4,7–5,1 (Ende der Seite) | helle Karte, Fuß | Wechselkarte | – | – | – | Ring „Zur Seite für Fensterbauer“ | leiser Wechsel |

### Startseite – Schreibtisch 1280 × 800

| Phase | Abweichung zum Telefon |
|---|---|
| 1 Ankunft | Split 5 : 7, Foto rechts randlos 760 px hoch; Umschalter als Segment neben dem Logo im Kopf (kein Glas); Cream „Jetzt ausmessen“ und Ring „Führung starten“ nebeneinander unter dem Lead |
| 2 Messen im Foto | Maßlinien zeichnen sich in der Öffnung des rechten Fotos; die zwei Werte am kleinsten Maß auf dunklem Glas (der Umschalter ist dort kein Glas); Foto mit Parallaxe 0,9 |
| 3 Objektreise | Bühne rechts über 7 Spalten (560 × 460), Stationszeilen links über 5 Spalten; ohne Anheften (Höchststufe 3) |
| 4–7 | wie IA: Kosten in einer Zeile mit drei Spalten, Ratgeber-Weg in einer Reihe, Fragen bis 820 px Zeilenbreite |
| Umschalter | Szenenwechsel zur Ansicht Fensterbauer: Foto rechts blendet in 700 ms vom Waschbären zum Astronauten, Kopf steht, Text links blendet in 240 ms |

---

## Stärken, Risiken, Aufwand, Leistungsrisiken, Barrierefreiheit

### Stärken

- **Beweis durch die Seite selbst.** Die Messlatte des Inhabers (SKILL:38) wird nicht behauptet, sondern vorgeführt; das ist ohne
  Kundenstimmen der stärkste ehrliche Vertrauensträger (RE E14: Gestaltungsqualität und prüfbare Fakten) [H].
- **Echtes Material statt Symbolen** in jedem Akt: Bildschirmaufnahmen, Bildfolgen aus der eigenen Bühne, das echte Aufmaßblatt
  (SKILL:41; RE E6: Animation hilft, wenn sie den Gegenstand zeigt).
- **Eine Geschichte, ein Objekt.** Das Leitobjekt verbindet Domain, Kunde und Betrieb; die Pakete sind Wiedererkennung statt neuer
  Information, was die Merkmalslast an der Entscheidung senkt (RE E8) [H].
- **Ruhe an der Entscheidung.** Alle Wirkung liegt vor den Paketen; Preis, Karte und Formular bleiben frei von inszenierender Bewegung
  (DG Dosierregel 1).
- **Vorlieben des Inhabers erhalten und gesteigert:** Startbild mit Foto, Meldungen und Chips; Astronauten-Bildwelt; Leiste,
  hochwertig ausgearbeitet; Pakete zum Wischen mit mitwischendem Beispielbild; Lamellen und Fenstermodell mit Realismus (SKILL 9).
- **Leitmotiv der Marke** (Licht durch ein Fenster) wird zur sichtbaren Verbindung der Szenen (DG 2.2.0).

### Risiken

| Risiko | Wirkung | Gegenmittel |
|---|---|---|
| Pakete später als in IA am Schreibtisch (Bildschirm 6 statt 4 bis 5) und Seite länger (Telefon ≈ 13,6 statt 12,5 BH) | weniger Besucher erreichen die Preise (RE E1) [H] | Preiszeile und Cream im ersten Bildschirm, Kopf-Ring, Sprungmarken; Messung „Pakete erreicht“ (EA O-2); Rückfall: PS3 kürzen, V7 in den Kopf von V8 ziehen |
| Klebende Bühne am Telefon wirkt wie Festhalten | Ungeduld, Abbruch | Haltestrecke ≤ 0,86 BH geplant, natives Scrollen, Text zieht weiter; Rückfall ohne Kleben (KA-H-2) |
| Material fehlt (Bildfolgen, Bildschirmaufnahmen, Beispielbilder je Paket) | ohne Material bleibt die Vorführung ein Platzhalter (PA 1.7) | Bau erst, wenn Probeaufnahme gelingt (DG-H-6); bis dahin Standbilder als Ersatzfassung, nie Platzhalter als Hauptbild (DG 2.2.11) |
| Leistung auf mittleren Android-Telefonen | Ruckeln wird zum Produktbeleg gegen eeziframes (RE E4) | Budgets und Abschaltregeln (unten); Telefon-Test des Inhabers entscheidet (SKILL:113) |
| Ablenkung durch Inszenierung von der Hauptaussage | Fensterbauer erinnern das Bild, nicht das Angebot (RE E3, E5) | jede Szene mit Aufgabe (Tabelle oben); Lesetest „Hauptaussage in eigenen Worten“ (EA H-D3) |
| Ähnlichkeit mit bekannten Gesamtbildern (dunkle Produktvitrine mit Bemaßung) | „Trendabbild“ (PROMPT Teil 10, Nr. 12) | Bildwelt des Inhabers (Astronaut, Waschbär) und echtes eigenes Material statt generischer Geräte; kein HUD-Dekor außer Maßlinie und Führungslinien |
| Prüfsuite erwartet heutige Reihenfolge oder Selektoren (IA-O-9) | Prüfungen schlagen fehl | Pflicht-h2 und Anker bleiben; Anpassung der Suite bewusst mit dem Umbau (PA 1.10) |
| Einbettung in `/#fensterbauer` | klebende Bühne, Beobachter und Bildfolgen müssen mit zwei Wurzeln und nach Neuaufbau funktionieren (SKILL:63-64) | `Verkauf.auf` bindet alle Beobachter je Wurzel neu; klebende Lagen über die Kopfhöhe als Token; Prüfsuite 29/30 |
| Probierfenster wird übersehen oder als Spielerei gelesen | kein Nutzen, Aufwand umsonst | eine Steuerung, eine Beschriftung, nur in Station 2; Sichtprüfung (KA-H-3); Rückfall: ohne Regler, nur scrollgekoppelt |

### Aufwand (grob)

Schätzung in Arbeitstagen ohne Messung, für eine Person, die das Repository kennt; ohne Freigabeschleifen mit dem Inhaber.

| Baustein | Aufwand | Abhängigkeit |
|---|---|---|
| Bildfolgen aus der eigenen WebGL-Bühne erzeugen (Flügel öffnet, Raffstore, Drehung für das Probierfenster, 14 Elementarten, Modell für H2), Pipeline mit `?gl=voll` und Playwright, Qualitätsprüfung | 3–6 | DG-H-6: Rechenzeit und Qualität ohne Grafikchip ungeprüft (TD 6.1) |
| Neue Bildschirmaufnahmen des Konfigurators unter der Beispieldomain (Browser, Telefon, sechs bis acht Zustände) und Geräte-Renders der drei Markenstufen | 2–4 | Demo-Instanzen (`docs/INSTANZEN.md:310`) oder Beispieldaten; Freigabe der Beispieldaten (PA-Frage 25) |
| V1 überarbeiten (Ring, Preiszeile, drei Takte, Lichtkeil, Meldungen enden) und V2 mit Renderings und Tempo-Kopplung | 3–5 | – |
| Produktszene PS1–PS3 (klebende Bühne Telefon und Schreibtisch, Canvas-Spieler mit Vorrat, Probierfenster mit Regler und Tastatur, Formanschlüsse, Explosionsansicht, ruhige Fassung, Einbettung) | 8–12 | Bildfolgen |
| V8 mit Geräte-Render-Beispielbildern, Nachlauf, Namensleiste mit Preisen, Risikoblock, Gesprächsweg | 3–5 | Beispielbilder (EA O-12) |
| übrige Abschnitte nach IA (V6, V7, V9–V14) | 4–6 | O-9, O-8 |
| Startseite H1–H7, Szenenwechsel des Umschalters, Maßlinien im Startfoto, H2-Bühne | 4–6 | Lage der Öffnung im Foto prüfen |
| Prüfsuite-Anpassung, Telefon-Videos, Leistungsmessung, Barrierefreiheit, Prüfbreiten 360, 390, 1024, 1280 | 4–6 | – |
| **Summe** | **rund 31–50 Arbeitstage** | ohne Material des Inhabers |

### Material, das fehlt (anfragen nach SKILL 7, nicht erfinden)

- Bildfolgen aus der eigenen Bühne (selbst erzeugbar, Probe zuerst): Flügel öffnet (Telefon 16 Bilder, Schreibtisch 32), Raffstore fährt
  (16/32), Drehung ±35° (24/48), Modell frontal für H2; Grund exakt `#161616` oder Alphakanal; Licht in Hausrichtung von oben rechts
  (DG-E-8).
- 14 Einzelbilder der Elementarten für die Leiste, 192 × 192 px (für 96 px bei doppelter Dichte), gleiche Kamera und gleiches Licht.
- Bildschirmaufnahmen des Konfigurators unter der Beispieldomain, neu (Stand 21.10.2026 veraltet, PA 1.7).
- Beispielbilder je Paket als Geräte-Render (EA O-12): Startansicht des Konfigurators in Essential, Essential Plus und Signature, für
  Signature zusätzlich das Dashboard; ohne echte Kundendaten.
- [H] Bild der Startansicht einer Instanz, die nur den Beispielbetrieb zeigt (DG-H-7).
- [H] H6: dieselbe Rohbau-Öffnung mit eingesetztem Fenster, gleiche Kamera und gleiches Licht wie `start-hauseigentuemer.webp`
  (Flux, 4:5, 1.200 × 1.500 px, ohne Text und Wasserzeichen).

### Leistungsrisiken

| Stelle | Budget (SG 10.8, DR 3.6, RE R11) | Risiko | Maßnahme |
|---|---|---|---|
| Erster Bildschirm Telefon | Bilder ≤ 300 KB, bis LCP ≤ 350 KB, JavaScript ≤ 100 KB, LCP ≤ 2,5 s | Foto 82 KB (Bestand), Glas-Rechnung beim Zoom | Glas erst nach dem Zoom; LCP ist das Foto, nie ein Canvas |
| Bildfolgen PS2 und H2 | ≤ 60 Bilder und ≤ 3 MB am Telefon, ≤ 120 Bilder am Schreibtisch; erst bei Annäherung | 56 Bilder à 360 × 360 px WebP ≈ 20–30 KB = 1,1–1,7 MB; entpackt 56 × 0,52 MB ≈ 29 MB Speicher | nur ein Fenster von ± 6 entpackten Bildern im Vorrat (`createImageBitmap`), Pixeldichte ≤ 1,5, Laden ab einer Bildschirmhöhe vor dem Abschnitt; Rückfall auf Einzelbild bei Median-Bildzeit über 25 ms für 2 s |
| Klebende Bühne mit Lichtraum | INP ≤ 200 ms, kein Ruckeln | Lichtraum als großer Verlauf über dem Gerät | Lichtraum statisch, nur `opacity` animiert; kein `filter`, kein `backdrop-filter` in der Bühne |
| 2,5-D-Tiefe im Startbild (Schreibtisch) | 3D-Paket ≤ 3 MB Schreibtisch, nach dem LCP | Shader und Tiefenkarte | nur mit `failIfMajorPerformanceCaveat`; Rückfall Parallaxe |
| Startseite insgesamt | wie oben | `portal.js` lädt heute rund 547 KB Skripte synchron, die Überschrift steht erst danach (TD 1.4) | H2-Bildfolge und Leisten-Bilder verzögert; Vorbedingung bleibt die Entschlackung der Startseite (außerhalb dieses Konzepts) |
| Beispielbilder V8 | je ≤ 60 KB, verzögert | drei Renders gleichzeitig beim Wischen | `loading="lazy"` mit `aspect-ratio`, kein Layoutsprung (CLS ≤ 0,1) |
| Leiste V2 | 14 Bilder ≈ 6–12 KB je Bild, verzögert | Bewegung jedes Bildes beim Scrollen | nur `transform` und `opacity`; Bewegung nur im Bild (IntersectionObserver) |

### Barrierefreiheit

- **Bewegung:** Autonome Bewegung endet nach höchstens 5 s (Startbild 4,1 s, Licht in der Öffnung 2,5 s; WCAG 2.2.2). Unter
  `prefers-reduced-motion: reduce`: kein Zoom, keine Parallaxe, keine klebende Bühne, keine Scroll-Kopplung, Szenenwechsel als Schnitt; jede
  Szene zeigt ihr Endbild (PS2 als drei Stationen untereinander mit je einem Standbild 180 × 370 px, PS3 auseinandergezogen und beschriftet,
  H1 mit fertigen Maßlinien). Das Probierfenster bleibt bedienbar, dreht aber ohne Nachlauf und öffnet als Schnitt (WCAG 2.3.3).
- **Ziehen hat eine Alternative ohne Ziehen** (WCAG 2.5.7): Das Modell dreht über den Regler `input type="range"` (Tippen auf die Spur
  genügt, Pfeiltasten in 15°-Schritten) und öffnet über einen Knopf mit `aria-pressed`; die Wischreihe hat die Namensleiste zum Tippen (R9).
- **Ziele:** alle ≥ 44 × 44 px, auch Regler-Daumen und Segmente; Fokus 2-px-Kontur mit 3:1, nie verdeckt (WCAG 2.4.11): Solange die Bühne
  in PS2 klebt, setzt `scroll-padding-top` die Kopfhöhe plus Bühnenhöhe, damit fokussierte Elemente unter der Bühne erscheinen.
- **Kurze Viewports und Vergrößerung:** Die Bühne klebt nur bei einer Viewporthöhe ab 640 CSS-px; im Querformat (844 × 390), bei 200 % Text
  und bei 320 px Breite steht PS2 als Liste mit Standbildern. Kein Querscrollen bis 320 px.
- **Vorleseprogramme:** Bildschicht `aria-hidden` mit `pointer-events: none`; die Aussage jeder Szene steht als Text in der Bedienschicht
  (Stationen, Liste der sieben Inhalte). Das Probierfenster-Canvas trägt `role="img"` mit einer Beschriftung, die Drehwinkel und Zustand
  nennt; Meldungen und Einzeiler sind als Illustration `aria-hidden` und im Bild als „Beispiel“ gekennzeichnet. DOM- und Tab-Folge folgen
  dem Lesestapel, nicht der Ebenenfolge.
- **Kontrast:** Text 4,5:1, groß 3:1, gegen die ungünstigste Stelle in jeder Scrollposition: Kicker und h1 im Fotofuß, Stationstexte am
  Rand des Lichtraums, Beschriftungen über dem Messraster, Maßwerte im Startfoto (Telefon: opake Fläche).
- **Transparenz und Kontrastmodus:** Glas wird deckend bei `prefers-reduced-transparency` und `prefers-contrast: more`; unter
  `forced-colors` bleiben Konturen als Grenzen.
- **Ohne JavaScript:** alle Texte, Preise, Karten untereinander, Formular; Startbild mit statischem Meldungsstapel; Bildfolgen als
  Einzelbild; keine Maßlinien und kein Probierfenster (GEST:450 sinngemäß).

---

## Annahmen, die getestet werden müssten

Prüfwege wie in EA 4.7.1 und DG 2.6.2: Telefon-Video bei 390 × 844, Sichtprüfung durch den Inhaber, Lesetests und Gespräche mit
Fensterbauern, Bildschirmzählung, Messung auf einem mittleren Android-Telefon, eigene Statistik nach dem Livegang. Vergleichstests sind
nicht eingerichtet; ohne Trichter für die Verkaufsseite (EA O-2) lassen sich KA-H-1, -4, -5 und -11 nur über Gespräche prüfen.

| Nr. | Annahme | Grundlage | Gegenrisiko | Prüfweg | Rückfall, wenn sie nicht trägt |
|---|---|---|---|---|---|
| KA-H-1 | Fensterbauer verstehen die Hauptaussage (eigener Konfigurator unter eigener Marke, Anfrage als Aufmaßblatt) aus der Vorführung, ohne eigenen Textabschnitt „Die Idee“ | RE E3, E6; EA H-D3 | Bild wird erinnert, Aussage nicht | Lesetest: Hauptaussage nach 60 s in eigenen Worten | PS1 als eigener Textabschnitt nach IA V3 |
| KA-H-2 | Eine klebende Bühne von ≈ 0,86 BH am Telefon wird nicht als Festhalten empfunden und senkt den Anteil, der die Pakete erreicht, nicht | DR 3.5; SKILL:43-44 | SG 10.7 Mobil; EA AB-10; RE E1 | Telefon-Video, Sichtprüfung, Gespräche; nach Livegang „Pakete erreicht“ | ohne Kleben: drei Stationen mit je einem Standbild (Ausgangsbasis IA V4) |
| KA-H-3 | Das Probierfenster (Regler „Drehen“, Knopf „Öffnen“) wird gefunden und hebt das Urteil „eeziframes kann Digitales“ ohne Ablenkung | SKILL:38, SKILL 9 (Fenstermodell mit Realismus) | Spielerei, Bindung an Station 2 | Sichtprüfung durch den Inhaber; Gespräche: „Was haben Sie ausprobiert?“ | nur scrollgekoppelte Bildfolge ohne Steuerung |
| KA-H-4 | Der spätere Paketbeginn (Telefon 5,3 BH, Schreibtisch 5,4 BH) wird durch Preiszeile, Cream „Pakete ansehen“ und Kopf-Ring ausgeglichen | RE E1, T1; EA H-D2, H-D15 | Preise zu spät für Eilige | Erfassung von Sprüngen zu `#pakete` und Erreichen der Karten (fehlt heute) | V7 in den Kopf von V8 ziehen, PS3 kürzen, Haltestrecke streichen |
| KA-H-5 | Geräte-Renders der drei Markenstufen (≈ 44 % der Karte) erklären die Paketunterschiede schneller als Haken und Tabelle und führen eher zum höheren Paket | SKILL:50, :121-122; EA H-D8; RE T15 | Bild zu klein für Unterschiede; Material fehlt | Lesetest „Was bekomme ich mit Plus zusätzlich?“; Paketfeld der Anfragen | Beispielbild als Bildschirmaufnahme ohne Gerät, ein Drittel der Karte (IA-H-14) |
| KA-H-6 | Der Formanschluss Telefonbildschirm → Aufmaßblatt liest sich als „die Anfrage kommt an“, ohne Umschlag oder Flieger | SKILL:125 (mag nicht: Handy zu Briefumschlag) | wirkt wie ein Zoom ohne Bedeutung | Sichtprüfung durch den Inhaber im Telefon-Video | harter Schnitt mit Station 4 als Zeile |
| KA-H-7 | Licht durch ein Fenster als Faden (Erdlicht → Lichtkegel → Bildschirmlicht) macht die Marke wiedererkennbar | DG 2.2.0, DG-H-3 | Lichtquellen der Fotos widersprechen der Hausrichtung | Sichtprüfung je Bühne | Licht nur in V1, Lichtraum in PS2 entfällt |
| KA-H-8 | Die Seite hält auf einem mittleren Android-Telefon LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 und läuft in PS2 flüssig | SG 10.8; RE R11 | Speicherlast der Bildfolgen; Glas und Licht | Messung im gedrosselten Mobilnetz; Telefon-Test des Inhabers (SKILL:113) | Stufe 1 ohne Bildfolge: Standbilder mit Überblendung 220 ms |
| KA-H-9 | Der Szenenwechsel des Umschalters macht die zwei Ansichten als zwei Bühnen einer Marke verständlich, ohne zu verwirren | Ref 04/07; SG 10.7/5 | Besucher halten den Wechsel für einen Seitenwechsel | Gespräche: „Wie kommen Sie zur Seite für Fensterbauer?“ (IA-H-4) | sofortiger Wechsel wie heute |
| KA-H-10 | Maßlinien in der Öffnung des Startfotos und die Objektreise führen mehr Hauseigentümer in die App als eine eigene Bildfolge | RE E6, T18 | Linien stören das Foto; Lage am echten Foto unklar | Trichter App geöffnet → Kasse → gekauft (vorhanden) vor und nach | H2 als eigene Bühne mit vier Stationen (IA) |
| KA-H-11 | Der Ring „Vorführung“ ins eigene Vorführen statt „Konfigurator ausprobieren“ in die App senkt Irrwege in Paywall und Du-Anrede, ohne den Wunsch zu probieren zu enttäuschen | W3; PAK B7 | Fensterbauer wollen selbst tippen | Gespräche; Klicks auf V6 nach der Vorführung | Ring „Konfigurator ausprobieren“ mit Hinweis (IA V6) |
| KA-H-12 | Demos nach den Paketen schwächen F-22 nicht | RE T11; EA AB-3 | Probierwillige suchen früher | Gespräche; Aufrufe von `#demos` | V6 vor die Pakete (IA) |
| KA-H-13 | Physik nur in der Bildschicht (Nachlauf, Explosion, Lamellen, Leiste nach Scrolltempo) erfüllt „Trägheit und Federn“ für den Inhaber | SKILL:43; DG-H-2 | Inhaber vermisst federnde Karten | Telefon-Video mit und ohne Nachlauf | Inhaber entscheidet über DG-AB-4 |
| KA-H-14 | Die ruhige Entscheidungsfläche nach drei inszenierten Akten wirkt nicht als Bruch oder als „billiger“ | DG Dosierregel 1; EA H-D10 | Seite fällt nach PS3 ab (SKILL:38) | Sichtprüfung des ganzen Telefon-Videos | Beispielbilder auf die halbe Kartenhöhe vergrößern, Studiolicht nur im Render; weiterhin ohne inszenierende Signature und ohne Licht an der Karte |
| KA-H-15 | Der Bullauge-Ausschnitt in V14 bindet Ende und Anfang, ohne leer zu wirken | DG-H-8 | Wiederholung | Sichtprüfung | V14 ohne Bild (IA) |
| KA-H-16 | Leiste mit Renderings statt Zeichnungen wird nicht als Banner übersehen, sondern als Breite des Sortiments gelesen | SKILL:121; RE E5, R5 | Banner-Blindheit | Gespräche: „Welche Elemente kann der Konfigurator?“ | Elementarten zusätzlich als Zeile in PS2 Station 2 |

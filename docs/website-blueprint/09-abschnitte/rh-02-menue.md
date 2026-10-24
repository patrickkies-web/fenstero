# Menü-Blatt am Telefon

Seite: Rahmen (alle Seiten außer App und Kundenkonto) · Position: 2 (`rh-02-menue`, außerhalb des Seitenflusses, nur auf Abruf) · Intensitätsstufe: 1 ruhig (Typ T0)

Phase I, Planungsdokument: Es wurde nichts gebaut. Grundlagen: Zielarchitektur (ZA) 8.2.1 (N5, N7, N8, N12), 8.2.3, 8.2.6, 8.2.8, 8.3.1;
Architektur E (EV 7.5.2, 7.5.8); Design-Grammatik (DG) 2.3.2 T0, DG-AB-1, DG-AB-8, DG-E-12; Styleguide (SG) 10.7 einschließlich
„Direkte Manipulation und Sheet“, 10.9, 10.10; DNA-B B.1 (Ansichtstyp „vorübergehender Zustand“); Kopf `09-abschnitte/rh-01-kopf.md` (KO);
Designsystem `11-designsystem.md` (DS), abgeglichen mit den Festlegungen K-1, K-3, K-5, K-10, K-24 und K-34.
`10-paketentscheidung.md` liegt nicht vor. Das Menü nennt deshalb weder Preise noch Pakete. Kennzeichnung wie in ZA: **[V]** verbindlich,
**[H]** Hypothese mit Rückfall, **Textentwurf** für neuen Wortlaut. **Festlegung rh-02** markiert eine Entscheidung dieser Spezifikation an
Stellen, die ZA offen lässt.

## A. Abschnitt und Funktion

- **Name und Lage:** Menü-Blatt, Rahmen Position 2. Es ist kein Abschnitt im Fluss und hat 0 Bildschirmhöhen Gewicht. Der Menü-Knopf des
  Kopfs (KO: x 330–374, y 6–50) legt ein opakes Blatt über die Seite. Nachbarn:
  - `rh-01-kopf` löst das Blatt aus und ist unter dem Scrim `inert`.
  - `rh-03-brotkrumen-fuss` trägt `#navigation`, das Ziel ohne JavaScript, mit denselben Wegen in voller Länge.
  - `st-02-umschalter`: Am Telefon ist der Glas-Umschalter weggescrollt. Das Segment im Blatt übernimmt seine Aufgabe (IA-AB-3).
  - Die Kapitel 01–06 und die Anhänge der Seite für Fensterbauer sind die Sprungziele.
- **Ziel (ZA 8.3.1):** Alle Wege liegen im Daumenbereich: Sprungmarken 01–06 und Fragen, Paketbedingungen, Wissen, Anmelden und Kontakt,
  im Kontext Hauseigentümer deren Wege.
- **Nutzerfrage:** „Wo finde ich …?“ Je nach Gruppe heißt das (ZA 8.2.8):
  - FB-6: „Wo waren die Pakete, wo die Bedingungen?“
  - FB-7 und P-1: „Wo melde ich mich an?“
  - HE-7: „Wo öffne ich mein gesichertes Aufmaß?“
- **Vorbereitete Entscheidung:** Sprung an die passende Stelle oder Wechsel des Bereichs. Gekauft wird hier nichts. Heute gibt es am Telefon
  kein Menü. Ratgeber, Seite für Fensterbauer und Kundenkonto erreicht man dort nur über den Fuß (SI 2.1; `web/assets/ratgeber.css:15`).

## B. Konkreter Inhalt

### B.1 Einträge je Kontext (Reihenfolge nach ZA 8.2.3 [V])

Der Kontext ist der des Kopfs (KO, Tabelle 8.2.2). Auf `/` enthält das Blatt beide Sätze, „Hauseigentümer“ und „Fensterbauer“; sichtbar ist
der Satz der aktuellen Ansicht.

**Fensterbauer** (`/fuer-fensterbauer/`, `/#fensterbauer`, 5 Fachartikel, `/konfigurator-bedingungen/`)

| Zone | Eintrag | Ziel | Wortlaut |
|---|---|---|---|
| Blattkopf | Segment „Hauseigentümer · Fensterbauer“, „Fensterbauer“ gewählt (ohne Link) | auf `/` schaltet es die Ansicht (wie `portal.js:403-406`, GEST:191); sonst „Hauseigentümer“ → `/#hauseigentuemer` | GEST:190 |
| Gruppenkopf | **Textentwurf** „AUF DIESER SEITE“; auf Fachartikeln und Paketbedingungen „SEITE FÜR FENSTERBAUER“ | – | – |
| Zeile | „01 Die Idee“ | `#die-idee` | gekürzt aus VK:74, **Textentwurf** |
| Zeile | „02 So funktioniert es“ | `#so-funktioniert-es` | VK:85 |
| Zeile | „03 Was in jeder Anfrage steht“ | `#was-in-jeder-anfrage-steht` | VK:121 |
| Zeile | „04 Pakete“ | `#pakete` | gekürzt aus VK:171 |
| Zeile | Zustand A: „05 Anfragen“ (**Textentwurf**, ZA 8.2.3). Zustand B und außerhalb der Seite: „05 Bestellen oder anfragen“ | `#bestellen` | VK:215 |
| Zeile | „06 Ablauf“ | `#ablauf` | **Textentwurf**; Anker VK:192 |
| Zeile | „Fragen“ | `#haeufige-fragen` | gekürzt aus VK:235 |
| Gruppenkopf | **Textentwurf** „UNTERLAGEN“ | – | – |
| Zeile | „Paketbedingungen“ | `/konfigurator-bedingungen/` | VK:269 (Fuß) |
| Zeile | „Wissen für Fensterbauer“ | `#wissen-fuer-fensterbauer`; öffnet dort die zugeklappte Zeile (ZA 8.1.4 [H]) | VK:249 |
| Blattfuß | Ring „Anmelden“ | auf `/` das Anmeldeblatt des Betriebsbereichs (wie `portal.js:385`), sonst `/partner/` (Weiche K37) | ZA 8.2.3, 8.2.8 FB-7 |
| Blattfuß | `ask@eeziframes.com` | `mailto:` | `web/impressum/index.html:32` |

Außerhalb der Seite für Fensterbauer zeigen die Sprungmarken auf `/fuer-fensterbauer/#…`. Den Zustand liefert `data-zustand` an
`[data-vk-pakete]` (KO, Neu 4). Eine Telefonnummer gibt es (`web/impressum/index.html:33`). Ins Menü kommt sie erst, wenn EA O-9
entschieden ist (PA-Frage 13).

**Hauseigentümer** (`/` Ansicht Hauseigentümer, `/ratgeber/` und 23 Artikel)

| Zone | Eintrag | Ziel | Wortlaut |
|---|---|---|---|
| Blattkopf | Segment, „Hauseigentümer“ gewählt | auf `/` schaltet es die Ansicht; sonst „Fensterbauer“ → `/fuer-fensterbauer/` (ZA 8.1.1 Nr. 5) | GEST:190 |
| Gruppenkopf | **Textentwurf** „IN DER APP“ | – | – |
| Zeile | „Fenster ausmessen“; mit angefangenem Aufmaß „Aufmaß fortsetzen“, aber nur dort, wo auch der Kopf so beschriftet ist (KO, Neu 6) | `/app/#ausmessen` | GEST:192; `portal.js:852` |
| Zeile | „Führung starten“ | `/app/#fuehrung` | `portal.js:852` |
| Zeile | **Textentwurf** „Gesichertes Aufmaß öffnen“ | `/app/` (Startbild mit „Schon ein Aufmaß gesichert? Anmelden“, `web/assets/app.js:2773`) | IA-AB-10 |
| Gruppenkopf | „RATGEBER“ | – | Fußgruppe VK:269 |
| Zeile | „Alle Ratgeber“ | `/ratgeber/` | VK:269 |
| Unterzeilen, 2 × 3 | „1 Prüfen“, „2 Entscheiden“, „3 Auswählen“, „4 Ausmessen“, „5 Vergleichen“, „6 Einbauen“ | `/ratgeber/#schritt-1` bis `#schritt-6` | `web/ratgeber/index.html:75-95` |
| Zeile nach Haarlinie | „Für Fensterbauer“ | `/fuer-fensterbauer/` | `web/index.html:47` |

Für Hauseigentümer gibt es heute keinen Kontaktweg (PA P8; IA-O-4 offen). Das Menü erfindet keinen.

**Neutral** (6 Rechtsseiten, 404): Segment ohne Wahl, also zwei Links (`/#hauseigentuemer`, `/fuer-fensterbauer/`), dazu „Für Fensterbauer“,
„Fenster ausmessen“ → `/app/` (wie KO) und „Ratgeber“. Einen Gruppenkopf gibt es hier nicht, weil nur eine Gruppe steht (Festlegung rh-02).

**Aktuelle Stelle:**
- Die Zeile der aktuellen Seite trägt `aria-current="page"` und erscheint in `--text2` 500.
- Auf der Seite für Fensterbauer trägt das Kapitel, dessen h2 als letztes über 40 % der Bildschirmhöhe steht, `aria-current="location"`.
  Seine Nummer wird grün.

Festlegung rh-02: Die grüne Nummer gibt Orientierung, obwohl der Kopf keine Kapitelanzeige haben darf (N6, Ü15). Sie erscheint nur auf
Abruf.

**Weitere Texte:**
- Zugänglicher Name des Blatts: „Menü“.
- Schließen-Knopf: **Textentwurf** „Menü schließen“.
- Es gibt keine Überschrift, keine Beschreibung je Zeile und keinen Preis.

### B.2 Interaktionen

Öffnen über den Menü-Knopf; Schließen über Knopf, Wischen nach unten, Escape, Android-Zurück oder Tippen auf den Scrim; Sprung, Seitenwechsel,
Ansicht schalten, Anmelden, E-Mail. Verhalten in F.

### B.3 Vorhandene Komponenten

- `.sheet`, `.sheet-bg`, `.grip`, `.xclose` (`web/assets/portal.css:194-205`): Vorbild für Griff (36 × 4, Radius 2, `--line2`) und Abstand
  unten (`env(safe-area-inset-bottom)`). Sie werden nicht wiederverwendet, weil `--float`, Aufsteigen in 320 ms, Radius 24 und 88vh den
  Regeln unten widersprechen.
- Tokens: `web/assets/gemeinsam.css:9-32`.
- Generator mit Marken: `scripts/ratgeber-bausteine.mjs:87-93` (`fusszeile`, `FUSS`).
- `portal.js`: Ansichtswechsel (`:403-406`), Anmeldeblatt (`:385`), `eigenesAufmass()` (`:20`).
- Kopf: `a.kopf-menue[href="#navigation"]` und `Kopf.auf` aus `web/assets/kopf.js` (KO H, neu).

## C. Exakte Layoutkomposition

**Grundstruktur.** Das Blatt ist ein `<dialog>` in der obersten Ebene (top layer) und hängt am unteren Rand. Es besteht aus drei Zonen
übereinander:
- **Blattkopf**, fest.
- **Liste**: Sie scrollt allein, wenn der Inhalt höher ist als das Blatt.
- **Blattfuß**, fest, nur im Kontext Fensterbauer.

Das Blatt ist randlos 390 breit. Seine Höhe richtet sich nach dem Inhalt und beträgt höchstens 85 % der sichtbaren Höhe (`85dvh`)
[V/H, ZA 8.2.3]. Die Komposition ist asymmetrisch: Alles steht linksbündig an der Ordnungslinie x = 16. Zentriert ist nur der Griff, weil er
ein Systemzeichen ist.

Ebenen von hinten nach vorn: eingefrorene Seite samt Kopf (Hintergrund) → Scrim (Mittelgrund) → Blatt, Z 40 (Vordergrund).

**4-Spalten-Raster** (x 16–374, Spalten 77,5 px, Rinne 16):

| Element | Lage im Raster | x |
|---|---|---|
| Segment-Gruppe | Spalte 1 bis Mitte Spalte 4 | 16–314 |
| Schließen | Spalte 4, dieselbe senkrechte Achse wie der Menü-Knopf: Öffnen und Schließen liegen übereinander | 330–374 |
| Zeilen | über alle vier Spalten | 16–374 |
| Ratgeber-Schritte | je zwei Spalten | 16–187 und 203–374 |

**Zeilenaufbau:**
- Die Nummer (13 px) steht bei x 16 in einem 20-px-Kasten.
- Die Bezeichnung (17 px) beginnt bei x 48.
- Zeilen ohne Nummer beginnen bei x 16, wie die Anhänge ohne Nummer auf der Seite (E-AB-10).
- Über jeder Zeile außer der ersten einer Gruppe liegt eine Haarlinie, 1 px, x 16–374.

**Telefon 390 × 844, Kontext Fensterbauer.** Das Blatt ist 681 px hoch, also 81 % der Höhe. Mit einer Safe-Area von 34 px sind es 715 px,
noch unter der Grenze von 717 px (85 %). Die y-Werte am Bildschirm gelten ohne Safe-Area.

| Zone | Element | y im Blatt | y am Bildschirm | Maß |
|---|---|---|---|---|
| Scrim | gedimmte Seite und Kopf | – | 0–163 | 19 % der Höhe; Tippen schließt |
| Blattkopf | Lichtkante | 0 | 163 | 1 px über die volle Breite, `--kante-licht` 24 %; rundum `--kante-alpha` 14 % (K-24) |
| | Griff | 8–12 | 171–175 | 36 × 4, x 177–213 |
| | Segment-Gruppe | 20–72 | 183–235 | außen 298 × 52, innen 2 × 145 × 44 |
| | Schließen | 24–68 | 187–231 | Kreis 44 × 44 |
| Liste | Gruppenkopf | 80–112 | 243–275 | 13 px |
| | 01 bis Fragen | 112–476 | 275–639 | 7 × 52 |
| | Gruppenkopf | 476–508 | 639–671 | 13 px |
| | Paketbedingungen, Wissen | 508–612 | 671–775 | 2 × 52 |
| Blattfuß | Haarlinie | 612 | 775 | x 0–390 |
| | Ring „Anmelden“ ab x 16, E-Mail rechtsbündig bis x 374 | 625–669 | 788–832 | 44 hoch; Ring ≈ 120 breit |
| | Abstand unten | 669–681 | 832–844 | 12 px + `env(safe-area-inset-bottom)` |

```
y   0 ┌──────── gedimmte Seite (Scrim 60 %) ────────┐  Tippen = schließen
  163 ╞════════════ Lichtkante 24/14 % ═════════════╡  Radius 18
      │                    ━━━━                     │  Griff
      │ (Hauseigentümer │▓Fensterbauer▓)        (×) │  Segment · Schließen
      │ AUF DIESER SEITE                            │  13 px Technikstimme
  275 │ 01  Die Idee                                │  52 px je Zeile
      │ 02  So funktioniert es                      │
      │ …   (03–06, Fragen)                         │
      │ UNTERLAGEN                                  │
      │ Paketbedingungen · Wissen für Fensterbauer  │
  775 ├─────────────────────────────────────────────┤
      │ ( Anmelden )               ask@eeziframes.com│  Blattfuß
  844 └─────────────────────────────────────────────┘
```

**Daumenbereich.**
- Untere Hälfte (y > 422): 04 bis Fragen, Unterlagen, Anmelden und E-Mail.
- 01 bis 03 (y 275–431) sind einhändig noch erreichbar (RE E18).
- Segment und Schließen stehen oben, weil sie selten gebraucht werden. Von der ersten Zeile trennen sie 40 px.

**Bei der realen Höhe 390 × 664.** Das Blatt ist 564 px hoch (y 100–664). Blattkopf (80) und Blattfuß (69) bleiben stehen, für die Liste
bleiben 415 px. Darin passen der Gruppenkopf und 01 bis Fragen (396 px); „UNTERLAGEN“ ist angeschnitten und zeigt so, dass es weitergeht.

**Hauseigentümer.** Das Blatt ist 557 px hoch (66 %), y 287–844:

| Element | y |
|---|---|
| Blattkopf | 287–367 |
| „IN DER APP“ | 367–399 |
| drei Zeilen | 399–555 |
| „RATGEBER“ | 555–587 |
| „Alle Ratgeber“ | 587–639 |
| Schritte (3 × 44, zwei Spalten, 15 px) | 639–771 |
| Haarlinie | 779 |
| „Für Fensterbauer“ | 780–832 |
| Abstand unten | 12 px |

Bei 664 passt es ohne Scrollen. **Neutral:** 248 px (29 %), y 596–844, Blattkopf und drei Zeilen.

**Größenhierarchie und Anteile.**
- Drei Schriftgrößen: 17 für Zeilen; 15 für Segment, Unterzeilen und Fuß; 13 für Gruppenköpfe und Nummern (SKILL:69).
- Die größte Form ist die Segment-Gruppe. Sie bleibt absichtlich leise (Ring ohne Fläche), damit die Liste führt.
- Bildanteil 0 %. Die Bezeichnung belegt 25–60 % der Zeilenbreite, Text deckt ≈ 22 % der Blattfläche.
- „≥ ⅓ frei“ ist für vorübergehende Zustände nicht Pflicht (DNA-B B.1). Die Luft in den Zeilen erfüllt die Regel trotzdem.

**Startwerte**

| Wert | Startwert | Begründung |
|---|---|---|
| Blatt | `--surface` `#1f1f1f`, opak | ZA 8.2.3; Glas nur über Bild (DG-AB-10) |
| Lichtkante | 1 px rundum `--kante-alpha` (`rgb(243 242 238 / .14)`), Ober- und rechte Kante `--kante-licht` (`rgb(243 242 238 / .24)`): `border: 1px solid var(--kante-alpha); border-top-color: var(--kante-licht); border-right-color: var(--kante-licht)` (Rand statt zweier `box-shadow`, damit sich 14 und 24 % oben nicht addieren). Am Telefon liegt das Blatt seitlich und unten am Bildschirmrand; sichtbar sind Oberkante und Rundungen, ab 640 px auch die Seiten | DS 11.5.4, Festlegung K-24: Haus-Token `--licht-x: -0.6; --licht-y: 0.8` (Licht von oben rechts, DG 2.2.0); Menüblatt schwebt |
| Radius | 18 oben, 0 unten | DG-AB-8 |
| Scrim | `rgb(0 0 0 / .6)` als Token `--scrim-blatt` | Bestand (`portal.css:194`, `app.css:485`). Darunter wird Cream zu `#60605e`, es entsteht keine zweite Cream |
| Höhe | `max-height: 85dvh` (Ersatz `85vh`) | ZA |
| Breite | 100 %; ab 640 px höchstens 560, mittig | wie `portal.css:195` |
| Innenrand | 16 px (< 640), 24 px (640–1023) | KO, Seitenrand |
| Zeile | 52 px (`--h2`), 17/24 px, 700, `--text` | DG T0; GEST:26 „700 für Listen“ |
| Unterzeile | 44 px (`--h1`), 15 px, 500, `--text2` | ZA: Unterzeilen 15 px |
| Gruppenkopf, Nummer | 13 px, 600, Versalien mit 0,12 em bzw. `tabular-nums`, `--muted`; aktuelle Nummer `--accent` | Technikstimme (DR 3.2) |
| Haarlinie | 1 px `--line2` | `--line` wäre auf `#1f1f1f` mit 1,16 : 1 unsichtbar; Trenner, keine Elementgrenze (SG 10.9) |
| Gedrückt, Hover | `--surface2`, Radius 12, x 8–382 | `--muted` hält darauf 4,85 : 1, auf `--surface3` nur 4,36 : 1 |
| Segment | Gruppe 52 hoch, Spur mit innerer 2-px-Kontur `--line2`, ohne Fläche; Segmente 44 hoch, 4 px Einzug. Gewählt: Füllung `--surface3` plus innere 2-px-Kontur `--text`, Schrift 700 `--text`; nicht gewählt: ohne Fläche, Schrift 500 `--text2`; Hover (nur `hover: hover`) am nicht gewählten Segment: Kontur `--line2`; nie Cream | DS 11.6.3, Festlegung K-3 (wie Umschalter `st-02`): Die Tinten-Kontur trägt die 3 : 1, `--surface3` allein läge darunter; ZA 8.2.4. Abweichung DS-AB-4, siehe D |
| Schließen | Kreis 44, Fläche `--surface2`, Kreuz 16 px aus 2-px-Strichen in `--text2` | Kreis-Knopf (DG 2.2.5) |
| Anmelden | Ring 44 px (Pille), transparent, innere 2-px-Kontur `--muted` (5,3 : 1 auf `--surface`), Schrift 15/700 `--text`; Hover (nur `hover: hover`) Kontur → `--text`; Druck Füllung `--surface2`. Der Ghost-Rand `--line2` aus `.btn.ghost.small` (`gemeinsam.css:58`) wird nicht übernommen | GEST:399, „alles andere mit Ring“; DS 11.6.2, Festlegung K-1: Die Kontur ist die einzige Grenze des Knopfs, `--line2` (1,6 : 1) nie. Abweichung DS-AB-10, siehe D |

Kontraste auf `#1f1f1f`: `--text` 14,7 : 1, `--text2` 9,8 : 1, `--muted` 5,3 : 1, `--accent` 9,6 : 1.

## D. Anwendung der Design-DNA

Das Blatt ist ein vorübergehender Zustand (DNA-B B.1). Pflicht sind Regel 3 (flache Bedienschicht), 8 (eine Formfamilie), 11 (Bewegung) und
12 (Mindestanforderungen) sowie der Verzicht auf tragende Schatten. Stufe 1 bedeutet: keine Signature, kein Bild, kein Licht im Bild.

| Eigenschaft | Ausgestaltung | Intensität | Wirkung, Beitrag zur Funktion |
|---|---|---|---|
| Tiefe, Z-Achse | drei Ebenen (Seite → Scrim → Blatt); Tiefe entsteht nur durch Verdeckung und das Helligkeitsgefälle `#090909` → `#1f1f1f` | 2 | Das Blatt liegt eindeutig vorn, die Seite bleibt als Ort erkennbar |
| Material, Transparenz | opak und flach, kein Glas, keine Textur. Flache Füllung ist kein „opakes Eigenmaterial“ im Sinn der DNA (Metall, Relief, Glanz; DNA 5.6.2) | 1 | Lesbarkeit über jedem Seiteninhalt |
| Licht, Schatten | 1-px-Lichtkante rundum `--kante-alpha` 14 %, oben und rechts `--kante-licht` 24 % (K-24, Licht von oben rechts); kein `--float`, kein Schein | 1 | trennt Figur und Grund auf dunklem Grund über Licht (SG 10.4/7) |
| Formen | Radius 18 oben, Pillen für Segment und Ring, Kreis für Schließen, rechteckige Zeilen mit Haarlinien als Gegenform | 2 | eine Formfamilie, präzise wie ein Aufmaß |
| 3D-Objekte, Bild, Perspektive | keine; alles frontal | 0 | Navigation konkurriert nicht mit den Helden der Seite |
| Oberflächendetails | gleich breite Ziffern, Haarlinien, Griff 36 × 4, die Haarlinie unter dem Blattkopf erscheint erst beim Scrollen der Liste (Zustand, 150 ms) | 1 | Mikrodetail statt Schmuck (SKILL:47) |
| Typografie | Technikstimme für Gruppenköpfe und Nummern, Inter 700 für Zeilen; drei Größen | 2 | Nummern spiegeln die Kapitelzeilen der Seite |
| Überlagerung | das Blatt deckt 29–81 % der Fläche; Kopf und Seite liegen unter dem Scrim | – | „Vorübergehend“ ist sofort lesbar |
| Animation | nur Deckkraft; Finger 1:1 beim Wischen (F) | 1 | ruhig, ein Träger |
| Interaktive Effekte | gedrückte Fläche, Fokuskontur, grüne Nummer der aktuellen Stelle | 1 | Rückmeldung ohne Bewegung |

**Bewusst weggelassen:**
- Glas, weil die Bühnen das Budget schon belegen (ZA 8.3.11).
- `--float`.
- Ein Bild oder eine Figur im Blatt.
- Ein Fortschritts-Maßstab neben 01–06: Auf Stufe 1 ist keine informierende Signature erlaubt.
- Pfeile je Zeile, Beschreibungen, Preise, eine Cream-Pille, ein Suchfeld.
- Gestaffeltes Erscheinen der Zeilen (DG-AB-2).

**Abweichung von bestehender Regel – Freigabe durch den Inhaber nötig:**
1. **rh-02-AB-1 (neu): Erscheinen.**
   - Bestehende Regel: „Öffnen/Schließen (Blatt steigt auf)“ (GEST:39; `gemeinsam.css:178`, 320 ms).
   - Vorschlag: Deckkraft 220/165 ms ohne Versatz (ZA 8.2.3; DG T0, DG-E-12).
   - Begründung: Die Bedienschicht ruht (SG 10.7/1; DG-AB-2).
   - Rückfall: Einfahren in der Ebene (F, Variante V-1), das SG 10.7 für plattformübliche Sheets ausdrücklich zulässt.
2. **DG-AB-1: Lichtkante statt `--float`** an Blättern (GEST:24, :32).
3. **IA-AB-3: Umschalter im Menü** statt als Zeile des klebenden Kopfs (GEST:190).
4. **IA-AB-10: „Gesichertes Aufmaß öffnen“** in der Ansicht Hauseigentümer (GEST:192 „Kein Anmelden“).
5. **DS-AB-10 (K-1): Ring-Kontur `--muted`** am Ring „Anmelden“ statt Ghost-Rand `--line2` (GEST:24 „`--muted` nur für Labels und
   Nebenzeilen“; `gemeinsam.css:58`). Begründung: Die Kontur ist die einzige Grenze des Knopfs und braucht 3 : 1 (WCAG 1.4.11). Rückfall:
   `--line2`.
6. **DS-AB-4 (K-3): gewähltes Segment `--surface3` mit 2-px-Kontur `--text`** statt Cream (GEST:24; `gemeinsam.css:82`, `:90`).
   Begründung: eine Cream je Bildschirm (SKILL:71); die Kontur trägt die 3 : 1. Rückfall: Füllung `--muted`.

## E. Visual Attention Architecture (erwartet, nicht gemessen)

1. **Blattkante.** Das Helligkeitsgefälle vom Scrim zum Blatt und die Lichtkante melden: Hier liegt etwas Neues vorn.
2. **Primärer Fokus: die Liste.**
   - Die Bezeichnungen sind 17 px fett in `--text` und die hellsten Flächen im Blatt.
   - Die Spalte gleich breiter Nummern 01–06 gibt den Takt von oben nach unten.
   - Die grüne Nummer der aktuellen Stelle ist der einzige Farbreiz und damit der Anker („Sie sind hier“). Ohne aktuelle Stelle übernimmt
     die erste Zeile.
3. **Sekundär: der Blattfuß** im Daumenbereich (Ring „Anmelden“, E-Mail), absichtlich leiser als die Liste.
4. **Tertiär: Segment und Schließen.** Ihre Formen sind groß, aber flächenarm, damit das Segment nicht als zweite Hauptaktion wirkt.

- **Handlungsaufruf:** keiner in Cream. „04 Pakete“ hat dasselbe Gewicht wie die anderen Zeilen, weil der Kopf-Ring diesen Weg schon dauerhaft
  trägt (N5).
- **Mögliche Ablenkungen:** versehentlicher Wechsel der Zielgruppe (darum steht das Segment oben); ein Tipp auf den Scrim, der eigentlich der
  ersten Zeile galt (112 px Abstand).
- **Übergang:** Nach einem Sprung blendet das Blatt aus und gibt Kapitelzeile und h2 des Ziels unter dem Kopf frei. Nach dem Schließen sieht man
  die unveränderte Seite. Der Fuß (`rh-03`) ist die Fassung ohne JavaScript.

## F. Interaktions- und Bewegungsverhalten

| Vorgang | Verhalten | Dauer, Kurve | Begründung |
|---|---|---|---|
| Öffnen | `showModal()`, Seite gesperrt (`html.menue-offen { overflow: hidden }`). Blatt und Scrim blenden gemeinsam als ein Träger von 0 auf 1 | 220 ms `--e-out` | ZA 8.2.3; SG 10.7/4; GEST `--t2` |
| Schließen | beide blenden von 1 auf 0, danach `close()` | 165 ms `--e-io` (Abgang ≈ ¾) | DR 3.5; SG 10.9 |
| Wischen nach unten | Start im Blattkopf oder in der Liste bei `scrollTop = 0`. Das Blatt folgt dem Finger 1:1 (`translateY`), Scrim-Deckkraft = 1 − Weg/Blatthöhe. Nach oben bewegt sich nichts | – | SG 10.7, direkte Manipulation |
| Loslassen | Schließt bei mehr als 25 % der Blatthöhe oder mehr als 0,5 px/ms. Dann läuft das Blatt mit der Abwurfgeschwindigkeit weiter (Dauer = Restweg ÷ Tempo, 120–220 ms) und blendet aus. Sonst kehrt es ohne Überschwingen zurück | Rückkehr 165 ms `--e-out` | Trägheit statt Feder: SKILL:43 innerhalb von SG 10.7/2 |
| Liste | nativ, `overscroll-behavior: contain` | – | SG 10.7 |
| Tippen, Hover | Zeilen: Fläche `--surface2`; Ring „Anmelden“: Hover Kontur `--muted` → `--text`, Druck Füllung `--surface2` (K-1); Segment nach C (K-3); Hover nur bei `(hover: hover)`; keine Skalierung | 150 ms | DG-AB-16; SG 10.7/3 |
| Fokus | `outline: 2px solid var(--text)`, formfolgend. Zeilen und Unterzeilen (Menüzeilen) und Segmente (an der Gruppenkante): Abstand −2 px, Radius 12 auf der Druckfläche bzw. Pille. Schließen (Kreis), Ring „Anmelden“ (Pille) und E-Mail: Abstand 2 px. Nie verdeckt: Blattkopf und Blattfuß liegen neben der Liste, nicht über ihr; die Liste rollt die fokussierte Zeile nativ in Sicht | – | DS 11.9.1, Festlegung K-34; SG 10.9 |
| Sprung | eigene Seite: `location.hash` setzen (Verlaufseintrag nach ZA 8.2.7, `hashchange` öffnet Zeilen im Hintergrund); Einbettung: `scrollIntoView` ohne Ankerwechsel (GEST:193). Beides sofort (`behavior: 'auto'`, wie KO) unter dem noch deckenden Blatt, dann Ausblenden; danach Fokus auf das Ziel-h2 (`tabindex="-1"`) | 165 ms | DS 11.7.6, Festlegung K-10: senkrechte Sprünge sofort, weil ein weicher Lauf über acht Bildschirme alle scrollgekoppelten Szenen abspielen würde (V1, 03). Der Fokus folgt dem Sprung (WCAG 2.4.3); ZA nennt sonst die Rückkehr auf den Knopf |
| Schließen ohne Ziel | Fokus zurück auf `.kopf-menue` (bei `/` neu abfragen, weil `portal.js` den Kopf neu zeichnen kann) | – | ZA 8.2.3 |
| Ansicht auf `/` | Das Segment wechselt den Zustand. Dann Neuaufbau über die Funktion des Umschalters (`portal.js:403-406`) und Sprung an den Anfang ohne Gleiten (`behavior: 'auto'`) unter dem noch deckenden Blatt. Danach blendet das Blatt aus, und die neue Ansicht blendet ein; anschließend läuft ihr eigener Foto-Auftritt (K-7). Kopf und Umschalter stehen | Segment 150 ms (`--t1`), Blatt aus 165 ms, Ansicht ein 220 ms (`--t2`), beide gleichzeitig | GEST:191; DS 11.7.6, Festlegung K-5: gleich für Umschalter, Wechselkarte und Menü |
| Anmelden auf `/` | Blatt schließt, dann Aufruf des Anmeldeblatts; immer nur ein Blatt offen | – | GEST:399 |
| Andere Seite | Navigation sofort; bei `pageshow` aus dem Zwischenspeicher wird das Blatt geschlossen | – | – |
| Weniger Bewegung | Deckkraft bleibt (SG: „Farb- und Deckkraftwechsel bleiben“). Wischen folgt weiter dem Finger. Nach dem Loslassen nur Ausblenden, kein Weiterlaufen | – | SG 10.7; ZA „ohne Bewegung“ |
| Ohne JavaScript | „Menü“ ist ein Link auf `#navigation`, der Browser springt zum Fuß | – | N7 [V] |
| Tastatur | Tab bleibt im Dialog, Escape und `cancel` schließen | – | ZA 8.2.3 |

**Varianten [H]:**
- **V-1 Einfahren in der Ebene:** `translateY(100 %)` → 0 in 240 ms `--e-out`, Austritt 180 ms, Scrim parallel. Bei „weniger Bewegung“ nur
  Deckkraft. Entspricht GEST:39 und SG 10.7. Voraussetzung ist die Entscheidung DG-E-12.
- **Nicht empfohlen:** Federn beim Zurückschnappen (DR 3.5 erlaubt bis 3 %). Das widerspricht SG 10.7/2 [Pflicht].

## G. Responsive Design

**Telefon 390 × 844 (zuerst):**
- Komposition und Lagen wie in C. Bei 664 scrollt nur im Kontext Fensterbauer die Liste.
- **360 × 640:** Blatt 544 px; Segment 268 breit, also 2 × 130 (Text „Hauseigentümer“ ≈ 118 px, das passt).
- **Unter 360 px oder bei 200 % Text:** Schließen steht in eigener Zeile über dem Segment, das Segment nimmt die volle Breite. Zeilen wachsen
  mit, die Liste scrollt, Bezeichnungen werden nie gekürzt.
- **Querformat (844 × 390):** Blatt höchstens 331 px hoch und 560 breit, mittig; die Liste scrollt.
- **640–1023 px (Tablet):** Blatt 560 breit, mittig, unten verankert, Innenrand 24. Raster und Werte sonst wie am Telefon.

**Schreibtisch 1280 und 1024:**
- Es gibt kein Blatt. Der Kopf (KO) zeigt die Sprungmarken 02, 06 und Fragen, dazu „Anmelden“ und den Ring. Alle übrigen Wege stehen im
  Fuß (`#navigation`).
- Ein 12-Spalten-Bezug entfällt, weil kein Blatt erscheint.
- Der Dialog bleibt im Markup, sein Auslöser ist ab 1024 px `display: none`.
- Wird das Fenster bei offenem Blatt auf ≥ 1024 px vergrößert, schließt es sofort und ohne Animation.
- 1024 und 1280 verhalten sich gleich. Die Grenze folgt dem Kopf: Sobald KO die Textlinks ausblendet, erscheint der Menü-Knopf.

## H. Technische Umsetzung

**Bestehend:** die Komponenten aus B.3, dazu `functions/pakete-seite.js:40-43` (`verkaufFuer(env).bestellen`, Quelle des Zustands).

**Neu:**
1. **Markup aus einer Quelle.**
   - `Kopf.menue(kontext, { seite, ansicht, zustand })` in `web/assets/kopf.js` liefert den Dialog.
   - `scripts/ratgeber-bausteine.mjs` schreibt ihn zwischen `<!--menue-->`-Marken in jede öffentliche Seite, und zwar **nach dem Fuß, außerhalb
     von `main`**. Sonst zieht die Einbettung ihn mit `main.rg` doppelt nach `/`.
   - Auf `/` steht er hinter `#app`, weil `portal.js:455` den Inhalt von `#app` ersetzt. Dort enthält er beide Sätze
     (`[data-kontext="fensterbauer|hauseigentuemer"]`).
   - Aufbau: `dialog#menue.menue[aria-label="Menü"]` → `div.menue-kopf` (Griff `aria-hidden`, `nav.menue-segment[aria-label="Zielgruppe"]`,
     `button.menue-zu`) → `nav.menue-liste[aria-label="Menü"]` mit `p.menue-gruppe[id]` und `ul[aria-labelledby]` → `div.menue-fuss`.
   - Gruppenköpfe sind **keine** Überschriften. Sonst ändern sie die h2-Gliederung, die die Prüfsuite zählt.
   - IDs tragen den Vorsatz `m-`, damit sie auf `/` eindeutig bleiben.
2. **Verhalten in `Kopf.auf`.**
   - Klicks werden an `document` delegiert und funktionieren deshalb nach jedem Neuaufbau (SKILL:63-64). Die Bindung ist idempotent.
   - Fehlt `HTMLDialogElement`, bleibt der Link.
   - Der Auslöser bekommt `role="button"`, `aria-haspopup="dialog"`, `aria-controls="menue"` und `aria-expanded`, dazu die Leertaste.
   - Animiert wird über die Klasse `.offen` (nicht über `@starting-style`, weil das nicht überall unterstützt wird); `transitionend` mit
     Sicherung nach 200 ms.
   - Scrim-Tipp: `click` auf `dialog` mit `clientY` über der Blattoberkante.
   - Wischen über Pointer-Events mit `touch-action: pan-y` an der Liste und `none` am Blattkopf.
3. **CSS-Block `.menue` in `gemeinsam.css`:**
   - `position: fixed; inset: auto 0 0; margin: 0 auto; display: flex; flex-direction: column`.
   - `.menue:not([open]) { display: none }`.
   - Liste mit `flex: 1 1 auto; min-height: 0; overflow-y: auto`.
   - `::backdrop` mit `--scrim-blatt` und Deckkraftübergang.
   - Alle `button`- und `a`-Elemente bekommen ausdrücklich eine Schriftgröße, sonst erben Knöpfe 13,33 px (SKILL:69-70).
   - `@media (forced-colors: active)`: obere Kante `1px solid CanvasText`.
4. **Fuß:** `id="navigation"` am `nav` des Fußes (Abhängigkeit von `rh-03`).
5. **Prüfsuite (`scripts/pruefen.mjs`, Abschnitt 10):**
   - Das Menü jeder Seite gleicht dem Generator.
   - Kein `input` im Dialog.
   - Nur die Größen 13, 15 und 17 px.
   - Auf `/fuer-fensterbauer/` kein Link auf `/#fensterbauer` oder `/#tour` (ZA 8.4.6); das gewählte Segment ist deshalb kein Link.
   - `a[href="#navigation"]` hat ein Ziel.
   - Erwartung an den Umschalter (`:213`) mit dem zweiten Segment abgleichen (IA-O-9).

**Assets:** keine. Kreuz und Griff entstehen in Inline-SVG bzw. CSS. Beim Inhaber ist nichts anzufragen.

**Animationstechnik:** CSS-Übergänge auf `opacity`; beim Wischen `transform` per `requestAnimationFrame`. Kein `backdrop-filter`, keine
Bibliothek, keine fremden Server (SKILL:60).

**Leistungsrisiken:**
- Markup ≈ 2–3 KB je Seite, JavaScript ≈ 3 KB in `kopf.js`. Ratgeber- und Rechtsseiten laden damit erstmals ein Skript (`defer`); laut KO
  braucht der Kopf es dort ohnehin.
- Die aktuelle Stelle ergibt sich aus höchstens acht `getBoundingClientRect` beim Öffnen. Es gibt keinen Scroll-Handler und keinen
  Layoutsprung (top layer).
- `dvh` unter iOS mit beweglicher Leiste prüfen.
- Die Android-Zurück-Geste schließt den Dialog erst ab Chrome 120 (CloseWatcher). Ältere Geräte navigieren zurück; das ist hinnehmbar.

**Barrierefreiheit:**
- Modaler Dialog mit Namen; Fokusfalle und `inert` kommen von `showModal()`.
- Fokus beim Öffnen auf der ersten Zeile der ersten Gruppe (`preventScroll`).
- Ziele: Zeilen 52 × 374, Unterzeilen 44 × 171, alle Knöpfe 44.
- Kontraste wie in C; Fokus 3 : 1.
- `aria-current` statt Farbe allein.
- Reflow bis 320 px ohne Querscrollen (WCAG 1.4.10).

## I. Conversion-Begründung

- **Lage:** Das Menü gehört zum Rahmen, weil es auf jeder Seite denselben Dienst leistet. Weil es nur auf Abruf erscheint, kostet es die
  Seite kein Gewicht. Es ist auch kein zweiter dauerhafter Handlungsträger neben dem Kopf-Ring (N5; anders als die verworfene Kaufleiste, EV W9).
- **Beitrag zur Zielhandlung (indirekt):**
  - „04 Pakete“ und „05 Anfragen“ sind von jeder Stelle einen Tipp entfernt.
  - FB-6 prüft über Paketbedingungen und kehrt zu 04 zurück.
  - FB-2 springt nach den Paketen zurück zu 01–03.
  - Service-Wege (Anmelden, gesichertes Aufmaß) sind von der Akquise getrennt, statt im Kopf zu konkurrieren.
  - Die heutige Sackgasse „am Telefon nur über den Fuß“ (SI 2.1) entfällt.
- **Informationsmenge:**
  - Fensterbauer: elf Wege und das Segment. Das ist die Obergrenze, zusammengehalten durch zwei Gruppen und einen Fuß.
  - Jede Zeile hat höchstens fünf Wörter und keine Beschreibung, weil das Blatt nur Orte nennt. Die Erklärung steht am Ziel.
  - Hauseigentümer: sechs Ziele und sechs Schritte. Neutral: drei Ziele.
- **Gestaltung:** ruhig auf Stufe 1, damit nach dem Schließen die Helden der Seite wirken und nicht das Menü.

**Zu testende Annahmen.** Keine davon ist gemessen. Wirkung auf Anfragen wird nicht behauptet.

| Nr. | Hypothese | Prüfweg | Rückfall |
|---|---|---|---|
| H-M1 (= IA-H-13) | Ein Blatt unten ist am Telefon besser erreichbar als ein Menü von oben | Telefon-Video, Gespräche, Sichtprüfung des Inhabers | gleicher Inhalt als Blatt unter dem Kopf |
| H-M2 | Die grüne Nummer der aktuellen Stelle hilft bei der Orientierung, obwohl der Kopf keine Kapitelanzeige hat | Gespräche: „Wo sind Sie gerade?“ | nur `aria-current` |
| H-M3 | Bezeichnungen nach den h2 („02 So funktioniert es“) findet man schneller als die Kapitelwörter („02 Ihr Kunde“, ZA 8.2.6) | Suchaufgabe „Zeigen Sie mir den Ablauf“ | Kapitelwörter |
| H-M4 | Erscheinen über Deckkraft wirkt hochwertig genug (SKILL:43) | Telefon-Video beider Fassungen, Urteil des Inhabers (DG-E-12) | V-1 |
| H-M5 | „Anmelden“ im Blattfuß genügt FB-7 und P-1 und lenkt Neukunden nicht ab | Gespräche mit Bestandsbetrieben | Zeile unter „UNTERLAGEN“ |
| H-M6 | Der Anschnitt bei 664 px zeigt, dass die Liste weitergeht | Telefon-Video bei 664 | Gruppenkopf „UNTERLAGEN“ entfällt |

Eine Zählung der Öffnungen und der gewählten Zeilen kommt nur in Frage, wenn es eine eigene Statistik ohne fremde Server gibt
(EV 7.5.7 Nr. 17).

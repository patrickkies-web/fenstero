# Website-Blueprint eeziframes

Planerische Neukonzeption der Website nach dem MASTER-PROMPT V4 („Website Experience & Conversion Design Architect“). Stand 24.10.2026,
Arbeitszweig `claude/design-dna-styleguide`.

## Zweck und Stand

- **Zweck:** Die Website von eeziframes (Startseite mit Einstieg für Hauseigentümer, Seite für Fensterbauer mit den drei
  Konfigurator-Paketen, Ratgeber, Fachartikel, Paketbedingungen, Rechtsseiten) so zu planen, dass ein Fensterbauer am Telefon versteht,
  was er bekommt, ein Paket wählt und anfragt, und dass die Website die gestalterische Grundlage der Design-DNA trägt.
- **Stand: Planung, nichts implementiert.** Das Repository wurde nur gelesen. Kein Code, keine Seite, kein Bild und keine Regel wurde
  geändert; online (`main`) ist nichts. Alle Dokumente in diesem Ordner sind Planungsdokumente.
- **Verbindliche Quellen:** das Repository für Geschäft, Inhalte und Funktionen (Bestandsaufnahme in [bestand/](bestand/) und
  [01-projektanalyse.md](01-projektanalyse.md)); die Design-DNA für die gestalterische Grundlage ([../design-dna/README.md](../design-dna/README.md));
  die Vorstellungen und Mindestanforderungen des Inhabers in `.claude/skills/premium-gestaltung/SKILL.md`. Die heutigen Markenregeln
  (`docs/GESTALTUNG.md`, `…/designrichtung.md`) durften hinterfragt werden; jede Abweichung ist als **Abweichung von bestehender Regel –
  Freigabe durch den Inhaber nötig** gekennzeichnet. Name, Wortmarke und Logo bleiben.
- **Einstieg für den Bau:** [16-abschlussdokumentation.md](16-abschlussdokumentation.md), die verbindliche Gesamtspezifikation.

## Ergebnis in Kürze

**Bevorzugte Architektur E** ([07-expertenvergleich.md](07-expertenvergleich.md), 7.5; [08-zielarchitektur.md](08-zielarchitektur.md)).
Der Fensterbauer bedient sein künftiges Produkt, bevor er die Pakete sieht: Er sieht seinen eigenen Konfigurator unter seiner Domain
(auf Wunsch mit seinem Firmennamen), probiert mit zwei Griffen, was sein Kunde tut, und sieht das echte Aufmaßblatt, das in seinem
Postfach ankommt. Der Unterschied der drei Pakete ist ein Zustand derselben Startansicht (Markenstufe). Gründe: ehrlicher Beweis ohne
Kundenstimmen oder erfundene Belege, Telefon zuerst (Tippen und Wischen statt Anheftstrecken), kurzer Weg zu den Paketen. Die Wahl ist
knapp und vorläufig; sie hängt an der Grundsatzfreigabe des Inhabers, einer Materialprobe und dem Test gegen die Alternative.

**Testalternative C′ „Die Seite fragt“** ([07-expertenvergleich.md](07-expertenvergleich.md), 7.6.1): keine Probe; über den Karten ein
Paketberater mit zwei Fragen, der die passende Markenstufe zeigt. **Rückfall B′ „Angebot zuerst“** (7.6.2), falls das Material nicht
trägt: Pakete früh, Beweis danach. Beide teilen mit E Sitemap, Navigation und alles ab den Paketen.

**Wichtigste Entscheidungen**

1. **Sitemap bleibt:** alle 39 Adressen und alle Anker bleiben, keine neue indexierbare Seite; die Seite für Fensterbauer steht an zwei
   Orten (`/fuer-fensterbauer/` und eingebettet in `/#fensterbauer`).
2. **Seite für Fensterbauer:** Startbild mit Preissignal und „Pakete ansehen“ im ersten Telefon-Bildschirm, Leiste der Elementarten,
   Kapitel „01 Ihr Name“, „02 Ihr Kunde“, „03 Ihr Postfach“, „04 Ihre Marke“ (Pakete), „05“ (Anfrage), „06 Ihr Start“ (Ablauf,
   Kundenschutz), danach Live-Demos, Häufige Fragen, Hintergrund und eine kompakte Paketwahl als Abschluss; 13,8 statt heute ≈ 19
   Telefon-Bildschirme (Kapitelwörter sind Textentwürfe).
3. **Paketwahl P1 „Wischreihe mit Markenbild“** ([10-paketentscheidung.md](10-paketentscheidung.md)): Namensleiste mit allen drei
   Monatspreisen über der Reihe, Karte mit „Wenn“-Satz, Preisblock mit Einrichtung, Bindung und Steuerzeile, Knopf, Beispielbild der
   Markenstufe, das mitwischt, und Datenblatt; Formular direkt nach den Paketen.
4. **Startseite:** öffnet weiter mit der Ansicht für Hauseigentümer, neu aufgebaut aus Startbild, Probemessung, Aufmaßblatt mit Preis,
   Ablauf und Daten, Ratgeber-Weg, Fragen und Messaufforderung; Glas-Umschalter über dem Foto.
5. **Ein Designsystem** ([11-designsystem.md](11-designsystem.md)): Bildschicht (Perspektive, Licht, Material, Bewegung, Physik) getrennt
   von einer flachen, frontalen Bedienschicht; dunkler Grund `#161616`, eine Cream-Fläche je Bildschirm, ein grünes Wort je Überschrift,
   vier Radien, zwei Umbruchpunkte, Licht nur mit Quelle im Bild; 40 Festlegungen beenden die Widersprüche zwischen den Abschnitten.
6. **Bewegung mit Tiefe, aber ruhig:** ein bewegter Träger je Ansicht, autonome Bewegung endet nach höchstens 5 s, Physik nur im Bild,
   jede Szene als Standbild tragfähig (ruhige Fassung, Fassung ohne JavaScript); Signature-Effekte (Glas, Lichtübertrag,
   Schärfestaffelung, Explosionsansicht) nur an je einem Ort ([12-storyboard.md](12-storyboard.md)).
7. **Technik ohne Neuerung** ([15-implementierung.md](15-implementierung.md)): keine Bibliothek, kein Build, CSP unverändert, keine
   fremden Server; neue Dateien für Rahmen, Kopf, Fuß und Inhaltskatalog; jede Abweichung als Schalter mit Bestandswert bis zur Freigabe.
8. **Vor dem Bau:** Grundsatzfreigabe und Materialprobe (Gate G0) vor Startbild und Produktkapiteln; Rahmen und Paketstrecke können
   vorher gebaut werden. **Vor dem Livegang:** Umsatzsteuerzeile und Frage-Route ohne Datenbank sind kritisch
   ([14-realitaetspruefung.md](14-realitaetspruefung.md), 14.4).
9. **Freigaben:** 86 offene Abweichungen von bestehenden Regeln und 40 offene Entscheidungen des Inhabers, geordnet nach Bauschritt
   ([16-abschlussdokumentation.md](16-abschlussdokumentation.md), 16.9 und 16.10).
10. **Validierung:** zwölf Prüfungen mit realen Menschen in fünf Runden, Kern ist ein moderierter Test mit 6–8 Fensterbauern am
    Prototyp; A/B-Tests erst nach dem Livegang und nur unter festen Bedingungen (14.5).

## Zuordnung der 13 geforderten Ergebnisse

| Nr. | Gefordertes Ergebnis | Dokument | Phase |
|---|---|---|---|
| 1 | Projektanalyse | [01-projektanalyse.md](01-projektanalyse.md), Bestandsaufnahme in [bestand/](bestand/) (Geschäftsmodell, Seiten und Inhalte, Conversion-Pfade, Technik und Designsystem, Browser Telefon und Schreibtisch mit [Bildschirmfotos](bestand/screens/)) | A |
| 2 | Design-DNA-Interpretation und Website Design Grammar | [02-design-grammatik.md](02-design-grammatik.md) | B |
| 3 | Research- und Conversion-Erkenntnisse | [03-recherche.md](03-recherche.md), Rohrecherche in [recherche/](recherche/) (Wissenschaft, Wettbewerb, Pakete und Entscheidung) | C |
| 4 | Customer Decision Architecture | [04-entscheidungsarchitektur.md](04-entscheidungsarchitektur.md) | D |
| 5 | Informationsarchitektur | [05-informationsarchitektur.md](05-informationsarchitektur.md) | E |
| 6 | Finale Website-Sitemap, Navigation und Nutzerwege | [08-zielarchitektur.md](08-zielarchitektur.md), 8.1 und 8.2; Grundlage: vier Konzepte mit Scroll-Storyboard in [06-konzepte/](06-konzepte/) ([A](06-konzepte/konzept-a.md), [B](06-konzepte/konzept-b.md), [C](06-konzepte/konzept-c.md), [D](06-konzepte/konzept-d.md)) und [07-expertenvergleich.md](07-expertenvergleich.md) mit bevorzugter Architektur und Testalternative | F, G, H |
| 7 | Page-by-Page Blueprint | [08-zielarchitektur.md](08-zielarchitektur.md), 8.3 und 8.4 | H |
| 8 | Section-by-Section Visual Design Specification | [09-abschnitte/](09-abschnitte/) (33 Spezifikationen, Liste unten); dazu die besondere Ausarbeitung der Kaufentscheidung in [10-paketentscheidung.md](10-paketentscheidung.md) | I, J |
| 9 | Scroll Experience Storyboard | [12-storyboard.md](12-storyboard.md) | L |
| 10 | Wireframes und visuelle Planung | [13-wireframes.md](13-wireframes.md), Grafiken in [wireframes/](wireframes/) | L |
| 11 | Page Composition System und übergreifendes Designsystem | [11-designsystem.md](11-designsystem.md) | K |
| 12 | Repository Implementation Mapping | [15-implementierung.md](15-implementierung.md); dazu Realitätsprüfung und Testkonzept in [14-realitaetspruefung.md](14-realitaetspruefung.md) | M |
| 13 | Implementierungsreife Abschlussdokumentation und Übersicht | [16-abschlussdokumentation.md](16-abschlussdokumentation.md) und diese Datei | N |

Hinweis zur Zählung: Die Dokumentköpfe sind nicht ganz einheitlich nummeriert. 05 nennt sich Ergebnis 5, 08 Ergebnisse 6 und 7; die
Konzeptdateien in 06-konzepte nennen sich „Ergebnis 6“, der Commit der Phase H spricht von „Ergebnissen 5 bis 7“. Die Tabelle folgt den
Köpfen von 05 und 08; Konzepte und Expertenvergleich sind als Grundlage von Ergebnis 6 geführt. Inhaltlich fehlt keine Phase:
Paketentscheidung (Phase J) und Realitätsprüfung (Phase M) haben eigene Dokumente ohne eigene Ergebnisnummer.

**Abschnitts-Spezifikationen** ([09-abschnitte/](09-abschnitte/), je mit Teilen A bis I)

| Seite | Spezifikationen |
|---|---|
| Rahmen aller Seiten | [rh-01 Kopf](09-abschnitte/rh-01-kopf.md) · [rh-02 Menü](09-abschnitte/rh-02-menue.md) · [rh-03 Brotkrumen und Fuß](09-abschnitte/rh-03-brotkrumen-fuss.md) |
| Startseite `/` | [st-02 Umschalter](09-abschnitte/st-02-umschalter.md) · [st-03 Hinweis bei ?von=pdf](09-abschnitte/st-03-hinweis-von-pdf.md) · [st-04 Wechselkarte](09-abschnitte/st-04-wechselkarte.md) |
| Ansicht Hauseigentümer | [he-01 Startbild](09-abschnitte/he-01-startbild.md) · [he-02 Probemessung](09-abschnitte/he-02-probemessung.md) · [he-03 Aufmaßblatt und Preis](09-abschnitte/he-03-aufmassblatt-preis.md) · [he-04 Ablauf und Daten](09-abschnitte/he-04-ablauf-daten.md) · [he-05 Ratgeber-Weg](09-abschnitte/he-05-ratgeber-weg.md) · [he-07 Abschluss](09-abschnitte/he-07-abschluss.md) |
| Seite für Fensterbauer | [fb-01 Startbild](09-abschnitte/fb-01-startbild.md) · [fb-02 Leiste](09-abschnitte/fb-02-leiste-elementarten.md) · [fb-03 Ihr Name](09-abschnitte/fb-03-ihr-name.md) · [fb-04 Ihr Kunde](09-abschnitte/fb-04-ihr-kunde.md) · [fb-05 Ihr Postfach](09-abschnitte/fb-05-ihr-postfach.md) · [fb-06 Pakete](09-abschnitte/fb-06-pakete-karten.md) · [fb-07 Vergleich](09-abschnitte/fb-07-entscheidungshilfe-vergleich.md) · [fb-08 Festblock](09-abschnitte/fb-08-festblock-gespraechsweg.md) · [fb-09 Anfrage](09-abschnitte/fb-09-anfrage.md) · [fb-10 Ablauf](09-abschnitte/fb-10-ablauf.md) · [fb-11 Kundenschutz](09-abschnitte/fb-11-kundenschutz.md) · [fb-12 Live-Demos](09-abschnitte/fb-12-live-demos.md) · [fb-13 Häufige Fragen](09-abschnitte/fb-13-haeufige-fragen.md) · [fb-15 Abschluss](09-abschnitte/fb-15-abschluss.md) |
| Fachartikel, Ratgeber | [ar-01 Artikelkopf](09-abschnitte/ar-01-artikelkopf.md) · [ar-02 Handlungsbaustein](09-abschnitte/ar-02-handlungsbaustein.md) |
| Unterseiten | [pb-02 Merkmalstabelle](09-abschnitte/pb-02-merkmalstabelle.md) · [re-01 Rechtsseite](09-abschnitte/re-01-rechtsseite.md) · [pa-01 Anmeldeseite](09-abschnitte/pa-01-anmelde-weiche.md) · [nf-01 Fehlerseite](09-abschnitte/nf-01-fehlerseite.md) · [ap-01 App-Startbild](09-abschnitte/ap-01-startbild-schnittstelle.md) |

Ohne eigene Spezifikation, nach einem Muster: `st-01` (Hinweisband), `st-05` (Textfassung), `he-06` und `fb-14` (wie `fb-13`), `ar-03`
bis `ar-05` (Bestand), `pb-01` und `pb-03` (wie `re-01`).

## Leseweg für den Inhaber

Der kürzeste Weg zu den Entscheidungen, die von Ihnen gebraucht werden:

1. Diese Seite, Abschnitt „Ergebnis in Kürze“.
2. [16-abschlussdokumentation.md](16-abschlussdokumentation.md): Kurzfassung (16.0), dann **16.10 Offene Entscheidungen** (blockierende
   zuerst, nach Bauschritt geordnet) und **16.9 Abweichungen von bestehenden Regeln** (jede mit Rückfall).
3. Bilder statt Text: [13-wireframes.md](13-wireframes.md) mit Seitenübersicht, Telefon- und Schreibtisch-Wireframes, Startbild,
   Produktdarstellung, Paketentscheidung und Storyboard.
4. Wie sich die Seite beim Scrollen anfühlen soll: [12-storyboard.md](12-storyboard.md), 12.1 (Dramaturgie auf einen Blick).
5. Die Paketwahl im Detail: [10-paketentscheidung.md](10-paketentscheidung.md), 10.4 und die offenen Fragen 10.5.1.
6. Was am Papier auffiel und wie getestet wird: [14-realitaetspruefung.md](14-realitaetspruefung.md), 14.0, 14.4 und 14.5.
7. Welches Material Sie liefern könnten (Fotos, Zuschnitte, mit fertigen Prompts): [15-implementierung.md](15-implementierung.md), 15.11.1.
8. Bei Bedarf die Spezifikation eines einzelnen Abschnitts in [09-abschnitte/](09-abschnitte/); Teil I.4 nennt dort die Freigaben.

**Für den Bau:** [16-abschlussdokumentation.md](16-abschlussdokumentation.md) ganz, dann je Abschnitt die Spezifikation in
[09-abschnitte/](09-abschnitte/), dann Dateien, Schnittstellen und Reihenfolge in [15-implementierung.md](15-implementierung.md).

## Methode und Grenzen

- **Ablauf:** Bestandsaufnahme am Repository (Phase A) → Interpretation der Design-DNA als Website-Grammatik (B) → Recherche (C) →
  Rückwärtsanalyse der Kaufentscheidung (D) → Informationsarchitektur (E) → vier konkurrierende Konzepte mit Storyboard (F, G) →
  Expertenvergleich und Zielarchitektur (H) → Abschnitts-Spezifikationen (I) → Paketentscheidung (J) → Designsystem (K) → Storyboard
  und Wireframes (L) → Realitätsprüfung und Implementierungs-Mapping (M) → Abschlussdokumentation (N).
- **Simulierte Perspektiven:** Die Bewertungen in [07-expertenvergleich.md](07-expertenvergleich.md) und
  [10-paketentscheidung.md](10-paketentscheidung.md) stammen aus simulierten Fachperspektiven desselben Modells. Das ist eine
  Analysemethode, keine Nutzerstudie; die Urteile sind korreliert und belegen nichts über Besucher.
- **Keine Nutzerdaten:** Im Repository gibt es keine Nutzerforschung, Personas, Besucherzahlen, Geräteanteile, Konversionsraten oder
  Kundenstimmen. Aussagen über Wirkung sind Hypothesen mit Rückfall; kein Dokument nennt Conversion-Wahrscheinlichkeiten oder erwartete
  Steigerungen. Was gilt, klären erst die Prüfungen mit realen Menschen ([14-realitaetspruefung.md](14-realitaetspruefung.md), 14.5).
- **Geplant, nicht gemessen:** Pixellagen, Bildschirmnummern und Seitenlängen sind aus den Spezifikationen gerechnet; gemessen sind nur
  Textbreiten (Chromium mit Inter) und die Dateigrößen des Bestands.
- **Prüfung am Papier:** Die Realitätsprüfung liest die Dokumente gegen ihre eigenen Regeln; sie ersetzt keinen Test.
- **Design-DNA aus Standbildern:** Die DNA ist aus Desktop-Standbildern gewonnen; jede Regel für Telefon und Bewegung ist abgeleiteter
  Neuentwurf und als solcher zu prüfen.
- **Ehrlichkeit:** Keine erfundenen Leistungen, Preise, Garantien, Kundenstimmen, Kennzahlen oder Siegel. Neue Wortlaute sind als
  **Textentwurf** gekennzeichnet und brauchen Ihre Freigabe; erfundenes Beispielmaterial trägt „Beispiel“.
- **Kennzeichnungen in allen Dokumenten:** **[V]** verbindlich, **[H]** Hypothese mit Rückfall, `Datei:Zeile` als Beleg im Repository.

## Design-DNA

Die gestalterische Grundlage dieser Planung ist die Design-DNA aus 15 Referenzen: Übersicht und Ergebnis in
[../design-dna/README.md](../design-dna/README.md); Konstruktionsformel, elf verbindliche Prinzipien, Stellschrauben und
Signature-Effekte in [../design-dna/03-design-dna.md](../design-dna/03-design-dna.md); technischer Styleguide 10.1–10.10 in
[../design-dna/04-styleguide.md](../design-dna/04-styleguide.md); Arbeitsfassung mit Bausteinen und Tokens in
[../design-dna/05-ergebnis-b-styleguide.md](../design-dna/05-ergebnis-b-styleguide.md); universeller Design-Prompt in
[../design-dna/06-design-prompt.md](../design-dna/06-design-prompt.md); Statistik und Stilcluster in
[../design-dna/02-vergleich.md](../design-dna/02-vergleich.md). Wie die DNA auf eeziframes übertragen wird (verbindliche Merkmale
überall, variable je Abschnitt dosiert, Signature-Effekte gezielt), steht in [02-design-grammatik.md](02-design-grammatik.md) und
[11-designsystem.md](11-designsystem.md).

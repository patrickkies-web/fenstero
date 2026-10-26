# Prompt-Vorlage für Gestaltungsaufträge bei eeziframes

Vier Zeilen von dir, dann das Anhängsel. Alles Übrige steht in CLAUDE.md und in den Skills, du musst nichts wiederholen.

```
Bereich: <Seite oder Abschnitt, Pfad oder Link, Ansicht (Hauseigentümer, Mieter, Fensterbauer)>
Wunsch: <deine Idee in zwei bis drei Sätzen; was dich stört, was du dir vorstellst; Richtung: naheliegend, mutig oder überraschend, oder „drei Richtungen, ich wähle“>
Bleibt: <was unangetastet bleibt: Konzept, Texte, Abfolge, ein Element, das du magst>
Material: <Fotos, Vorlagen, Renderings mit Rolle (Vorbild, Material, Gegenbeispiel); oder „Prompt für ein Foto schreiben“>
```

## Anhängsel (unter jeden Gestaltungs-Prompt kopieren)

```
Gilt: Skill design-dna (Design-System https://claude.ai/artifact/7Sn3WTUMn15nyKvyeQak4o, Musterseite
https://claude.ai/artifact/5CqFMQ5g8XJaKtQwjaUW97) und der Begleit-Skill design-dna-eeziframes
(.claude/skills/design-dna-eeziframes/SKILL.md: Palette „Task-App dunkel“ als tokens.css, Ergänzungen G14/G15,
meine Entscheidungen, Rezept, Messwerkzeuge). Nicht laden: premium-gestaltung, ultimativ-webdesign, webdesign-wow.
Referenz der Qualität: die Startseite vom 26.10.2026 (https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i,
Quelle docs/profis/startseite-dna-vorschau/, Protokoll docs/profis/2026-10-26-startseite-dna.md).
Gleiche Hand, gleiche Tiefe, nicht dieselben Elemente.
Vorlagen: docs/profis/vorlagen/2026-10-26/ (Vorbild: Prinzip übernehmen, nie das Motiv).
Ablauf: Rezept aus dem Begleit-Skill (bauen Telefon zuerst, messen, Gremium profis eine Runde, vier Detail-Profis,
Abgleich mit den Vorlagen, Farbtabelle je Bildschirm, Vorschau als Artifact, Protokoll unter docs/profis/,
Commit auf dem Arbeitszweig). Online nichts ohne mein Ja.
```

## Die drei Richtungen (aus `design-dna`, Abschnitt 3, Schritt 4)

Jede Richtung bleibt in der DNA und in der Palette. Sie unterscheiden sich darin, wie weit die Idee von der Startseite wegrückt.

### Naheliegend: die Bausteine der Startseite neu zusammengesetzt

Was es heißt: Dieselbe Familie, dieselben Bausteine (Bento, Leuchtkachel, Stufen, Etiketten, Pille mit Pfeilkreis), nur für den neuen Inhalt geordnet. Gene vor allem G2 (neutraler Raum, leuchtender Inhalt), G3 (die Zahl ist der Held), G6 (eine volle Pille), G8 (Zerlegen und neu ordnen), dazu G14 und G15.
Quellen: Startseite (https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i, docs/profis/startseite-dna-vorschau/start.css), Bausteine im Design-System (https://claude.ai/artifact/7Sn3WTUMn15nyKvyeQak4o, `project/components/`), Musterseite (https://claude.ai/artifact/5CqFMQ5g8XJaKtQwjaUW97).
Skills: design-dna, design-dna-eeziframes.
Passt, wenn: eine bestehende Seite nachziehen soll, oder ein Abschnitt neben der Startseite stehen wird.

```
Bereich: Seite für Fensterbauer (/fuer-fensterbauer/), Kopf und Pakete.
Wunsch: Richtung naheliegend. Die Pakete wie das Bento der Startseite, das empfohlene Paket leuchtet violett. Der Kopf
zeigt den Konfigurator als Objekt auf der Bühne, nicht als flaches Bildschirmfoto.
Bleibt: Paketnamen, Preise, Texte, Reihenfolge der Abschnitte.
Material: web/bilder/beispiel/ (Material: genau so einbauen); zwei Vorlagen im Anhang (Vorbild).
<Anhängsel>
```

### Mutig: ein Prinzip einer Vorlage übersetzen

Was es heißt: Ein Prinzip aus einer Vorlage des Inhabers wird auf eeziframes übertragen, ohne das Motiv zu kopieren: Werte am echten Objekt (Domus, Vorlage 2 und 17), Glaskarte über dem Foto mit einer Zahl, die aus der Karte ragt (Koch-App, 13 und 14), Figur bricht aus der Karte (Nintendo, 15), Zahl als Held mit Einheit im Chip (Heeal, 12). Gene G4 (Interface als Objekt), G9 (Daten an der Sache), G10 (scharf vor unscharf), G12 (Objekt bricht aus dem Rahmen), G13 (runde Knöpfe).
Quellen: docs/profis/vorlagen/2026-10-26/ (Bilder), Beschreibung und Gene in `design-dna` Abschnitt 6 und 10, Urteile docs/profis/gremium/2026-10-26-startseite-dna-vorlagen-{artdirection,frontend,typografie}.md, Bewegungs-Rezepte in `project/bewegung.md` des Design-Systems.
Skills: design-dna, design-dna-eeziframes, emil-design-eng (für die Bewegung).
Passt, wenn: ein Abschnitt etwas erklären soll, das man am Objekt sieht (Maße, Aufbau, Preis an der Sache).

```
Bereich: Abschnitt „Was im Aufmaß steckt“ der Startseite.
Wunsch: Richtung mutig, Prinzip aus Domus (Vorlage 2): die Werte hängen als Etiketten am Rendering des Fensters, der
Besucher tippt ein Etikett an und sieht, was es bedeutet. Das Blatt bleibt, wird aber Bühne für das Rendering.
Bleibt: Konzept der fünf Szenen, Wortlaut der Etiketten.
Material: Renderings aus docs/profis/startseite-dna-vorschau/bilder/so/ (Material); Vorlage 2 und 17 (Vorbild).
<Anhängsel>
```

### Überraschend: einmal umdrehen

Was es heißt: Eine Erwartung wird umgekehrt, bei gleicher Familie: der Preis als einzige Zahl auf weißer Szene, der Rest flüstert; der Hero hell statt dunkel, das Foto kommt erst in der zweiten Szene; ein Element reist durch alle Szenen (swapie, Vorlage 7); eine Szene besteht nur aus Feinzeichnung (Punktraster, Skala) und einem Wort. Gene G1 (weich trifft präzise), G3, G5 (Skalen und Strichmarken), G7 (ein besonderes Material), die Bewegungs-Gene „ein Element reist“, „Zahl rastet ein“, „Vorhang von unten“.
Quellen: `design-dna` Abschnitt 2 (Bewegungs-Gene) und 6 (Vorlage 7 swapie, 16 Nintendo-Web), `project/bewegung.md` des Design-Systems, Protokoll der Startseite (Abschnitt „Richtungen“, was verworfen wurde und warum).
Skills: design-dna, design-dna-eeziframes, emil-design-eng, gsap-scrolltrigger nur, wenn CSS und bundle.js nicht reichen (GSAP nach web/vendor/ mit Lizenz).
Passt, wenn: ein Abschnitt Aufmerksamkeit tragen soll (Preis, Einstieg einer neuen Seite) und drei Bilder zur Wahl gewünscht sind.

```
Bereich: Preisabschnitt der Startseite.
Wunsch: Richtung überraschend, drei Bilder zur Wahl, gebaut wird erst danach. Man soll den Preis „fühlen“: 7,99 € ist
der Held, und man sieht, was davor alles kostenlos ist.
Bleibt: Wortlaut zu Preis und Zahlung, die weiße Szene.
Material: keins, Renderings aus dem Projekt.
<Anhängsel>
```

## Was im Prompt wirkt

- **Bleibt** schützt, was du magst; ohne diese Zeile baue ich, was die DNA nahelegt.
- **Material** mit Rolle (Vorbild, Material, Gegenbeispiel) verhindert, dass ein Motiv kopiert wird.
- **Grenzen** ausdrücklich („kein Handy im Hero“, „keine Riesenwörter“); sie landen in Abschnitt 4 des Begleit-Skills.
- Wenn ich eine Regel aus einem alten Skill anwende: sagen. Ich nehme sie raus und schreibe die Korrektur ins Protokoll und in Abschnitt 4.
- Nennst du keine Richtung, baue ich die stärkste und nenne die anderen beiden in je einer Zeile.

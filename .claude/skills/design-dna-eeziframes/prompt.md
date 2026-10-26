# Prompt-Vorlage für Gestaltungsaufträge bei eeziframes

## Kurzform (reicht im Normalfall)

```
Ändere den Bereich für Fensterbauer (/fuer-fensterbauer/).
```

Ein Satz mit dem Bereich, dazu, was dich stört oder was du dir vorstellst, falls du etwas im Kopf hast. Den Rest übernehme ich: Bestand lesen, DNA und Begleit-Skill laden, Startseite (als Untergrenze, nicht als Vorlage) und deine Vorlagen daneben legen, entscheiden, was für diesen Bereich Sinn ergibt (Richtung, Szenen, welche Bausteine der Startseite passen, welche Prinzipien aus den Vorlagen übersetzt werden, welches Bild die Bühne trägt), bauen, messen, Gremium eine Runde, Detail-Profis, Vorschau, Protokoll, Commit. Meine Wahl steht in drei Zeilen in der Lieferung; du korrigierst, was dir nicht gefällt. Das Anhängsel unten gehört unverändert unter jeden Gestaltungs-Prompt: Es belegt jede Datei und jede Quelle, nennt die Skills, die nicht geladen werden, und die Messwerte, die bestehen müssen, damit das Ergebnis mindestens das der Startseite ist.

## Langform (wenn du steuern willst)

Vier Zeilen, jede davon freiwillig. Was du nennst, gilt vor meiner Wahl.

```
Bereich: <Seite oder Abschnitt, Pfad oder Link, Ansicht (Hauseigentümer, Mieter, Fensterbauer)>
Wunsch: <deine Idee in zwei bis drei Sätzen; was dich stört, was du dir vorstellst; Richtung: naheliegend, mutig oder überraschend, oder „drei Richtungen, ich wähle“>
Bleibt: <was unangetastet bleibt: Konzept, Texte, Abfolge, ein Element, das du magst>
Material: <Fotos, Vorlagen, Renderings mit Rolle (Vorbild, Material, Gegenbeispiel); oder „Prompt für ein Foto schreiben“>
```

## Anhängsel (unter jeden Gestaltungs-Prompt kopieren, unverändert)

```
ANHÄNGSEL GESTALTUNG EEZIFRAMES (Stand 26.10.2026)

1. Skills laden, in dieser Reihenfolge, vor dem ersten Entwurf:
   - design-dna (mein synchronisierter Skill; Stand mit den Ergänzungen vom 26.10.2026 liegt auch unter
     .claude/skills/design-dna-eeziframes/design-dna-stand-2026-10-26.md; fehlen dort G14/G15, diesen Stand nehmen)
   - design-dna-eeziframes (.claude/skills/design-dna-eeziframes/SKILL.md), dazu tokens.css und prompt.md daneben
   - profis (.claude/skills/profis/SKILL.md), nur eine Runde, etwa zehn Minuten je Seite
   - emil-design-eng (.claude/skills/emil-design-eng/SKILL.md) für Bewegung, Übergänge, Bedienelemente
2. Nicht laden, keine Regel daraus anwenden: premium-gestaltung, ultimativ-webdesign, webdesign-wow, eezi-designrat,
   docs/GESTALTUNG.md (nur Technik der App). impeccable und gsap-* nur, wenn ich sie im Prompt nenne. Keine Pille im
   Band 460–600 px, kein farbiges Wort je Überschrift, kein Messband-Hero, keine Figurenwelt, kein Riesenwort.
3. Quellen lesen, bevor etwas gebaut wird:
   - Design-System: https://claude.ai/artifact/7Sn3WTUMn15nyKvyeQak4o (project/README.md, bewegung.md, tokens.json,
     components/bundle.css, components/bundle.js, README der Bausteine, die gebraucht werden)
   - Musterseite: https://claude.ai/artifact/5CqFMQ5g8XJaKtQwjaUW97
   - Untergrenze der Qualität, nach oben offen: Startseite vom 26.10.2026, https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i,
     Quelle docs/profis/startseite-dna-vorschau/ (index.html, start.css, start.js, dna/tokens.css, dna/bundle.css,
     dna/bundle.js, fonts/, bilder/), Bilder docs/profis/bilder/2026-10-26-startseite-dna-{tel,desk,bild1}.jpg
   - Protokoll docs/profis/2026-10-26-startseite-dna.md und die Urteile docs/profis/gremium/2026-10-26-startseite-dna-*.md
     (gestalter, kunden, fensterbauer, feinschliff-bewegung/-zeichen/-ux/-typografie, vorlagen-artdirection/-frontend/-typografie)
   - Meine Vorlagen: docs/profis/vorlagen/2026-10-26/ mit README.md (Vorbild: Prinzip übernehmen, nie das Motiv)
   - Bestand des Bereichs: alle Texte, Bilder, Zahlen, Rechtstexte; echte Inhalte bleiben, nichts erfinden
4. Entscheiden: Du wählst aus diesem Material Richtung, Szenen, Bausteine und Bild selbst und nennst die Wahl in drei
   Zeilen in der Lieferung. Keine Rückfrage, außer zwei Lesarten führen zu wesentlich verschiedener Arbeit.
5. Bauen: eigenständige Vorschau unter docs/profis/<bereich>-vorschau/ (index.html ohne Dokumentgerüst, dna/tokens.css
   aus dem Begleit-Skill, bundle.css und bundle.js unverändert, eigene start.css/start.js mit Präfix ez-, Schriften lokal
   in fonts/ mit Lizenz, keine fremden Server). Telefon 390 px zuerst, dann 1280 px. Palette nur die acht Farben.
6. Messen, bevor du etwas zeigst (.claude/skills/design-dna-eeziframes/werkzeuge/): huelle.sh, shot.mjs, farben.py,
   pruef.mjs, leistung.mjs, bewegung.mjs. Muss bestehen: genau eine volle Pille je Bildschirm, am Telefon im unteren
   Drittel; 0 Animationen nach 2,6 s; Layoutsprung 0; kein filter: blur auf Flächen; 0 lazy-Bilder in den ersten Szenen;
   Ziele ab 44 px; ruhige Fassung und ohne JavaScript stehen sofort; keine Konsolenfehler; Laden unter 1 s; Farbtabelle je
   Bildschirm (Bildschirm | Neutral % | Violett | Koralle | Indigo | Farbe gesamt) innerhalb der Toleranzen aus
   design-dna Abschnitt 8, Abweichungen erst anpassen, dann zeigen. Familientest neben Musterseite und Startseite.
7. Gremium profis eine Runde (drei Agenten blind, Änderungsliste, Mehrheiten), dann vier Detail-Profis parallel
   (Bewegung, Zeichen, UX, Typografie, je etwa zehn Minuten, je höchstens zehn Befunde), dann Abgleich mit meinen Vorlagen
   in drei Perspektiven (Material und Licht, Frontend und Leistung, Typografie). Alles umsetzen, keine zweite Runde.
8. Liefern: Vorschau als privates Artifact (bei Nachbesserung dieselbe Adresse), Bilder Telefon und Schreibtisch im Chat,
   Protokoll docs/profis/JJJJ-MM-TT-<bereich>.md (Auftrag, Wahl, Änderungstabelle, Farbtabelle, Messwerte), Urteile unter
   docs/profis/gremium/, Bilder unter docs/profis/bilder/, Commit auf dem Arbeitszweig (Deutsch). Nichts online (main)
   ohne mein Ja. Jede Korrektur von mir kommt in Abschnitt 4 des Begleit-Skills.
9. Meine Entscheidungen gelten weiter: kein Handy und keine Maßlinien im Hero der Startseite, mein Hausfoto als Bühne;
   keine Bildpille im Satz, kein Schriftfenster; „Jetzt konfigurieren“ bleibt; Konzept und Abfolge der Startseite stehen.
```

## Die drei Richtungen (aus `design-dna`, Abschnitt 3, Schritt 4)

Du musst keine Richtung nennen. Ohne Angabe wähle ich je Szene die, die zum Inhalt passt, und nenne die Wahl in der Lieferung. Die Beschreibung hier ist dafür da, dass du meine Wahl einordnen oder eine Richtung vorgeben kannst. Jede Richtung bleibt in der DNA und in der Palette; sie unterscheiden sich darin, wie weit die Idee von der Startseite wegrückt.

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
- Nennst du keine Richtung, kein Material und keine Grenzen, entscheide ich alles aus dem Material und nenne die Wahl in drei Zeilen; das ist der Normalfall.

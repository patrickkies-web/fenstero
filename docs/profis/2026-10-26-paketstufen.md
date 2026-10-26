# Paketstufen: Essential, Plus und Signature fair abgestuft (26.10.2026, abends)

## Auftrag

- **Bereich:** die drei Vorlagen der Landingpage eines Betriebs (Essential, Plus, Signature).
- **Wunsch des Inhabers:** prüfen, ob Aufmachung und Leistung fair nach Paket abgestuft sind; 15 Fensterbauer urteilen lassen; danach
  anpassen. Ein zweiter Beispielbetrieb mit eigener Palette, je Paket eine Seite. Alle Pakete sehr ansprechend, aber wer mehr zahlt,
  soll es sehen (Anreiz zum Aufstieg). Bild-Prompts für morgen.
- **Erfolg:** Jede Vorlage zeigt genau ihr Paket (nicht mehr, nicht weniger als web/assets/pakete.js), der nächste Schritt ist sichtbar,
  und der Fensterbauer wechselt in einem Tipp zwischen den Paketen.

## Wahl in drei Zeilen

1. Eine Familie je Betrieb: drei verlinkte Seiten aus denselben Bausteinen, eine Muster-Leiste mit Paketwechsel, Preis und „Etiketten“.
2. Der Anreiz steht in den Etiketten (nur auf Wunsch eingeblendet), nicht in einer schlechteren Essential-Seite: Essential bleibt
   schön, zeigt aber ehrlich, was erst ab Plus oder Signature kommt.
3. Essential trägt keine Firmenfarbe, weil pakete.js sie dort ausschließt und 12 von 15 Fensterbauern das so wollen; Plus und Signature
   tragen die Palette des Betriebs.

## Merkmal-Abgleich gegen pakete.js (sichtbar in der Vorlage)

| Merkmal | Essential | Plus | Signature |
| --- | --- | --- | --- |
| Eigene Domain | ja, Etikett „fensterbau-brandt.de“ | ja | ja |
| Gestaltung | eeziframes-Violett, Initiale und Name | Logo, Firmenfarbe | Logo, Firmenfarbe |
| Fotos des Betriebs | nein (mit Etiketten: Rahmen „ab Plus: bis zu 6 Fotos“) | Bühne und Foto-Bento, bis zu 6 | wie Plus |
| Eigene Startansicht und Texte | nein, Standardtext | ja | ja |
| Hinweis auf eeziframes | deutlich (Kopf, Fuß, Daten-Satz) | eine Zeile im Fuß, Daten-Satz nennt „technischer Dienstleister“ | keiner, auch nicht im Aufmaßblatt und in E-Mails |
| Aufbewahrung | 30 Tage nach Zustellung | 30 Tage nach Zustellung | Vertragsdauer, Originalfotos ein Jahr (`fotosSignatureTage` 365) |
| Einladungslinks, Begrüßung mit Namen | nein | nein (Etikett „Erst in Signature“) | ja, Seite öffnet im Einladungszustand |
| Dashboard, Fortschritt, Zugänge | nein | nein | ja, 5 Zugänge (Vorschau mit Etiketten) |
| Preis (netto, vorläufig) | 29 € im Monat, 99 € einmalig | 39 €, 199 € | 64 €, 279 € |

Preise stehen nur in web/assets/pakete.js; der Generator liest sie dort aus.

## Gremium: 15 Fensterbauer in drei Gruppen (simuliert, eine Runde)

Urteile in docs/profis/gremium/2026-10-26-paketstufen-fensterbauer-{klein,mittel,gross}.md. Bewertet wurde der Stand vor dem Umbau.

| Gruppe | fair E / P / S | zeigen E / P / S | Hände (Median) | Vetos | Wechsel E→P · P→S |
| --- | --- | --- | --- | --- | --- |
| F1 kleine Betriebe (1–5) | 4 / 3 / 3 | 3 / 4 / 4 | 3 | Uwe: Aufbewahrung nicht nach Tabelle | 2 von 5 · 2 von 5 |
| F2 mittlere (10–30) | 3 / 3 / 4 | 2 / 4 / 4 | 3 | Klaus: Essential zeigt Begrüßung und eeziframes-Adresse | 4 von 5 · 4 von 5 |
| F3 große (40–85) | 3 / 4 / 4 | 2 / 3 / 4 | 3 | Nadine: Plus nennt eeziframes im Daten-Satz | 5 von 5 · 4 von 5 |

- **F1:** Unten und oben trägt die Abstufung, in der Mitte hängt sie durch: Plus zeigte seinen greifbarsten Vorteil, die Fotos, nicht.
- **F2:** Die Abstufung im Paket trägt, die Vorlagen zeigten sie schief: Essential mehr, als es liefert, Plus weniger.
- **F3:** Corporate Design ist Pflicht, Essential kauft hier keiner, und das ist richtig so; der Schritt Plus→Signature ist echt, war
  aber für Besucher kaum zu sehen.

Alle drei Vetos fallen mit den Änderungen 1, 2 und 6 unten. Die Hände standen vor dem Umbau bei Median 3; eine Abnahme nach dem Umbau gab
es nach der Regel „eine Runde“ nicht.

## Änderungstabelle

| Nr | Wo | Was | Warum | Stimmen | Stand |
| --- | --- | --- | --- | --- | --- |
| 1 | Essential, Bühne und Fuß | Etikett mit eigener Domain und Schloss, Fußsatz „läuft bei eeziframes“ ohne Subdomain | Paket hat eigene Domain | 15 : 0 | umgesetzt |
| 2 | Essential, Hero | Standardtext statt Begrüßung, Ansprechperson und Kontakt bleiben | Server leert die Begrüßung ohne Startansicht | 13 ja, 2 ändern | umgesetzt |
| 3 | alle, Daten-Satz | Satz nach Tabellenzeile: 30 Tage, technischer Dienstleister, Vertragsdauer | Uwes Veto | 14 ja, 1 ändern | umgesetzt |
| 4 | alle, oben | Muster-Leiste: Paketwechsel an derselben Stelle, Preis mit Einrichtung und erstem Jahr | Vergleich in einem Tipp | 13 ja, 2 ändern | umgesetzt |
| 5 | alle | „Etiketten“: grau in allen Paketen, Koralle neu im Paket, Ring erst im nächsten | Anreiz ohne schlechtere Seite | 11 ja, 4 ändern | umgesetzt |
| 6 | Plus, Daten-Satz | eeziframes nur im Fuß, im Text „technischer Dienstleister“ | Nadines Veto | 14 ja, 1 ändern | umgesetzt |
| 7 | Signature, Start | öffnet im Einladungszustand; aus einem anderen Paket kommend im Website-Zustand | Unterschied sofort sichtbar, Vergleich gleich | 10 ja, 1 ändern, 4 nein | umgesetzt |
| 8 | Plus und Signature | Foto-Bento mit 6 Plätzen auch ohne Etiketten | sichtbarster Plus-Vorteil | Muss in allen drei Gruppen | umgesetzt |
| 9 | Signature, Muster-Ebene | Vorschau Dashboard: drei Anfragen in drei Zuständen, „bis zu 5 Zugänge“ | Signature für den Betrieb zeigen | Vorschlag der Sprecher F2 und F3 | umgesetzt |
| 10 | Essential | Firmenfarbe | pakete.js schließt sie aus | 3 ja, 12 nein | nicht umgesetzt, Frage an den Inhaber |
| 10a | Signature | eigene Szene „Ihr Ansprechpartner“ mit Foto und Durchwahl | sichtbarer Vorteil für Besucher | F1 nein, F2 und F3 ja unter Bedingung | nicht gebaut: hängt daran, ob der Absender je Zugang wählbar ist (Frage 3) |
| 11 | Leiste am Telefon | Titel und Preis neben dem Schalter, Legende eigene Zeile | Pille stand bei Signature unter der Falz | Messung | umgesetzt |
| 12 | alle, Skript | Vorhang ordnet nach jeder Höhenänderung neu | mit Etiketten war die Bereit-Pille unerreichbar | Frontend-Abgleich | umgesetzt |
| 13 | Plus und Signature, Kontakt | Telefonnummer an die Kartenbreite gebunden | 12–13 Zeichen liefen in den Knopf | Frontend-Abgleich | umgesetzt |
| 14 | Signature, Wechsel | nur Überschrift, Kicker und Brief blenden; Pille steht | Pille blinkte beim ersten Tipp | Frontend-Abgleich | umgesetzt |
| 15 | Etiketten | Logo-Etikett einzeilig, Ablage-Etikett nur am Schreibtisch, Fuß-Etiketten im Fluss, Foto-Rahmen in Essential | Überdeckungen und Ausbrüche | eigene Prüfung | umgesetzt |
| 16 | Reihe der Elemente | Trennung „Falt-schiebe-wand“ | Bruch mitten im Wort | F1, F2 | umgesetzt |

## Zweiter Beispielbetrieb: Fenster Ostermann, Bremen

| Rolle | Farbe | Wert |
| --- | --- | --- |
| Hauptfarbe (ersetzt Violett als Akzent) | Petrol | #2fa792 |
| Schatten der Hauptfarbe | Tiefsee | #134540 |
| Licht der Hauptfarbe | Gischt | #62d1bc |
| Hinweis | Leuchtturmrot | #e8574a |
| Grund, Text, Flächen | wie die DNA | Schwarz, Weiß, Anthrazit, Silbergrau |

Zeichen: Bogenfenster mit Kämpfer und Pfosten. Inhaber Jonas Ostermann, Am Deich 7, 28199 Bremen, 0421 456789 (Beispieldaten).
Überschrift Plus: „Moin, neue Fenster?“ (zwei Zeilen am Telefon; „Fenster für Bremen, in Ruhe geplant.“ brach in drei und schob die
Pille aus dem ersten Bildschirm). Gebaut mit `python3 docs/profis/werkzeuge/paketvorlagen.py ostermann`; Ergebnis unter
docs/profis/paketvorlagen/ostermann/. Bild-Prompts: docs/profis/2026-10-26-paketvorlagen-bildprompts.md.

## Veröffentlicht (privat)

| Seite | Adresse |
| --- | --- |
| Essential, Fensterbau Brandt | https://claude.ai/artifact/AeVzh8NgNvxEqcDTwdxhiM (dieselbe Adresse wie bisher) |
| Plus, Fensterbau Brandt | https://claude.ai/artifact/Qo299jgiGQZMsAi6pVgCzU (dieselbe Adresse wie bisher) |
| Signature, Fensterbau Brandt | https://claude.ai/artifact/8GL1ypE8PwgWYSwY6Dgdms |
| Fenster Ostermann, alle drei Pakete (Start Signature) | https://claude.ai/artifact/XCeRzDoQKx5bNMhoxCZVU8 |

## Messwerte (alle sechs Seiten, 26.10.2026, 22 Uhr)

| Prüfung | Ziel | Ergebnis |
| --- | --- | --- |
| Volle Pille im ersten Bildschirm, Telefon 390 × 844 | genau eine, unteres Drittel | alle sechs, oben bei 709–759 px; mit Etiketten 725–775 px |
| Laufende Animationen nach 2,6 s | 0 | 0 |
| Layoutsprung (CLS), CPU 4× gedrosselt | 0 | 0 |
| Laden bis `load`, gedrosselt | unter 1 s | 308–475 ms |
| Weichzeichner auf Flächen | 0 | 0 (nur Schlagschatten an Objekten, Glas nur über Bild) |
| Lazy-Bilder in den ersten Szenen | 0 | 0 (ein lazy-Bild, nur am Schreibtisch weiter unten) |
| Ziele unter 44 px | 0 | 0 |
| Ruhige Fassung | Endbild sofort | ja, 0 Animationen nach 150 ms |
| Ohne JavaScript | alles sichtbar | ja; Wahl und Schalter ausgeblendet |
| Erreichbarkeit jedes Links und Knopfs | alle | alle, in beiden Zuständen und mit Etiketten (außer dem gewollt versteckten Sprunglink) |
| Konsolenfehler | 0 | 0 |

## Farbtabelle (Mittel der Seite, Prozent der Fläche)

| Seite | Neutral | Violett | Koralle | Indigo | Firmenfarbe und Fotos | Farbe gesamt |
| --- | --- | --- | --- | --- | --- | --- |
| Essential, Telefon (beide Betriebe) | 96,3 | 1,1 | 0,3 | 2,1 | 0,2 | 3,7 |
| Essential, Schreibtisch | 97,5 | 0,5 | 0,1 | 1,4 | 0,5 | 2,5 |
| Plus Brandt, Telefon / Schreibtisch | 98,3 / 98,1 | 0 | 0,1 | 0 | 1,6 / 1,9 | 1,7 / 1,9 |
| Signature Brandt, Telefon / Schreibtisch | 98,2 / 97,8 | 0 | 0,1 | 0,1 / 0 | 1,7 / 2,2 | 1,8 / 2,2 |
| Plus Ostermann, Telefon / Schreibtisch | 97,8 / 97,5 | 0 | 0,1 | 0 | 2,1 / 2,4 | 2,2 / 2,5 |
| Signature Ostermann, Telefon / Schreibtisch | 97,7 / 97,3 | 0 | 0,1 | 0,1 / 0 | 2,1 / 2,6 | 2,3 / 2,7 |

Die Farbe liegt unter den etwa 7 % der DNA, wie schon bei den bisherigen Vorlagen. Die sechs Fotoplätze sind graue Platzhalter; mit
echten Fotos steigt der Anteil. Ob dann Pixelzählung oder Eindruck gilt, entscheidet der Inhaber.

## Frontend-Abgleich (Tobias Lenz), Stand der Hebel

Urteil: docs/profis/gremium/2026-10-26-signature-vorlage-vorlagen-frontend.md.

- **Umgesetzt:** Hebel 1 (Vorhang nach Höhenänderung), Hebel 2 (Telefonnummer und Kapselreihe an die Breite gebunden), Hebel 5 (beim
  Wechsel nur tauschen, was sich ändert), Etikett ohne Übergang in der ruhigen Fassung, Wahl und Schalter ohne JavaScript ausgeblendet,
  Leistengrenze rechnet die Muster-Leiste mit.
- **Offen, betrifft die echte Instanz, nicht die Vorlage:** Hebel 3 (die Instanz liefert genau einen Zustand, ohne Muster-Ebene, mit
  sauberem Kopf und `js-da.js` statt Inline-Skript) und Hebel 4 (Fotos des Betriebs in zwei Breiten mit Größengrenze in der Zentrale).
  Beides berührt functions/ und web/assets/zentrale.js und wartet auf das Wort des Inhabers.

## Paketvorschläge der Fensterbauer (nicht umgesetzt, Entscheidung des Inhabers)

| Vorschlag | Stimmen |
| --- | --- |
| Wechsel Plus → Signature: Einrichtung nur die Differenz (80 €) | 5 (F3) |
| Einladungslink im Namen des Zugangs, der ihn verschickt (Name, Rolle, Durchwahl) | 4 (F3), dazu Frage aus F2 |
| Plus: Aufbewahrung 90 statt 30 Tage, damit das Blatt bis zum Feinaufmaß reicht | 3 (F1 1, F2 2) |
| Zugänge in Signature zubuchbar, je Filiale | 3 (F3); 10 statt 5 Zugänge: 1 (F2) |
| Signature mit der Hausschrift des Betriebs | 3 (F3) |
| Signature bis 12 Fotos | 3 (F2 1, F3 2) |
| Essential mit Firmenfarbe, Logo bleibt Plus | 3 dafür, 12 dagegen |
| Fortschritt mit Status „geöffnet“ | 1 |
| Einladungslinks schon in Plus | 1 |
| Essential: eeziframes im Aufmaßblatt und in E-Mails nur im Fuß | 1 |
| Signature: nach Kündigung 90 Tage Download, dann gelöscht | 1 |

## Offene Fragen an den Inhaber

1. Essential mit Firmenfarbe? Der Auftrag nannte die Palette des Betriebs für jede Seite; pakete.js und 12 von 15 Fensterbauern sagen
   nein. Umgesetzt ist das Paket. Soll Essential die Farbe bekommen, ist es eine Zeile in pakete.js und eine im Generator.
2. Was gilt nach einer Kündigung für Anfragen und Aufmaßblätter, in allen drei Paketen?
3. Ist der Absender eines Einladungslinks je Zugang wählbar, und läuft das Dashboard am Handy vor Ort?
4. Zeigt das Dashboard „Fenster 2 von 4“ oder nur die drei Zustände (eingeladen, in Bearbeitung, eingereicht)?
5. Darf eines der sechs Fotos die Ansprechperson zeigen?

## Was echt ist und was nicht

Simuliert: alle Urteile des Gremiums und der Profis. Echt: die Messwerte oben. Beispielbetriebe, Namen, Adressen, Telefonnummern und
Dashboard-Einträge sind erfunden und als Muster gekennzeichnet. Fotos fehlen noch (Prompts liegen bereit).

## Bilder

- docs/profis/bilder/2026-10-26-paketstufen-brandt-tel.jpg, -tel-etiketten.jpg, -desk.jpg
- docs/profis/bilder/2026-10-26-paketstufen-ostermann-tel.jpg, -tel-etiketten.jpg, -desk.jpg

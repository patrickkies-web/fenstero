# KI: die Einbausituation aus den Fotos

Die KI ersetzt nicht das Messen. Die 8 Maße nimmt der Kunde mit dem Zollstock, das Feinaufmaß macht der Fensterbauer vor Ort. Die KI liest aus den beiden Fotos (innen, außen) alles, was der Fensterbauer **außer den Maßen** fürs Erstaufmaß wissen muss: die Einbausituation rund um die Maueröffnung. Das bestehende Fenster wird ausgebaut und deshalb **nicht** beschrieben (kein Material, Alter, Glas, Griff, keine Dichtungen); es kommt nur vor, wenn es Ausbau oder Öffnung betrifft.

Code: `functions/api/ki.js` (Aufträge, nur auf dem Server), `web/assets/app.js` (`AI`, `mergeKI`), Anzeige in App, Betriebsbereich und Aufmaßblatt.

## Ablauf

1. Der Kunde fotografiert innen und außen. Vor dem ersten Foto fragt die App um Einwilligung; ohne geht alles weiter, nur ohne Befund.
2. Das Handy verkleinert das Foto auf etwa 1,15 Megapixel (rund 1.240 × 930 Pixel).
3. `POST /api/ki?aufgabe=einbau&seite=in|out` (bei der neuen Öffnung `aufgabe=wand`). Der Server prüft Herkunft, Format, Größe und die Bremse (40 Anfragen je 10 Minuten und IP) und schickt Foto und Auftrag an Anthropic. **Eine Anfrage je Foto.**
4. Antwort als JSON, in der App zusammengeführt (`w.ki`): Befundzeilen, Stichworte für den Kunden, Hinweise für Angebot und Montage, Prüfpunkte fürs Feinaufmaß, Laibungstiefe (nur innen) und Schräglage des Fotos (für die Wasserwaage).
5. Ins neue Fenster wird nur die Laibungstiefe übernommen, und nur wenn der Kunde keine eingetragen hat. Material, Teilung und Öffnung wählt der Kunde.

## Was die KI liest, in dieser Reihenfolge

| Foto innen | Foto außen |
|---|---|
| 1. Rollladen und Sturz: Einbau- oder Sturzkasten, Aufsatzkasten auf dem Altfenster, keiner; Antrieb (Gurt mit Wickler auf oder unter Putz, Kurbel, Motor); Spalte und Zugluftspuren | 1. Fassade und Wandaufbau: Putz, Klinker oder Verblendmauerwerk (zweischalig?), WDVS mit grober Dämmstärke, Holz, Schiefer, Beton, Fachwerk |
| 2. Anschlag und Einbaulage: Lage des Blendrahmens, eingeputzt oder verkleidet, Innenanschlag | 2. Außenanschlag und Einbaulage: Mauerwerk vor dem Rahmen, stumpfer Anschlag, Fenster in der Dämmebene |
| 3. Laibung innen: Putz, Tapete, Fliesen, Verkleidung; Zustand; was nach dem Ausbau beigeputzt werden muss | 3. Sonnenschutz außen: Vorbaukasten, Führungsschienen, Raffstore, Markise, Klappläden, Gitter |
| 4. Fensterbank innen: Material, Überstand, über dem Heizkörper, kann sie bleiben | 4. Fensterbank außen: Material, Überstand, Tropfkante, Gefälle, Abschlüsse, Zustand; Faserzement vor 1993: auf Asbest prüfen |
| 5. Brüstung: bodentief, niedrig, normal; sehr niedrig über dem Erdgeschoss: Absturzsicherung prüfen | 5. Anschlüsse außen: Fugen, Putzanschluss, Dämmung in der Laibung |
| 6. Heizung: Heizkörper, Rohre, Thermostat, Abstand, Verkleidung | 6. Sturz: Rollschicht, Betonsturz, Risse |
| 7. Elektro: Steckdosen, Schalter, Kabel in Laibung oder Brüstung, Rollladenschalter, Alarmkontakte | 7. Geschoss und Zugang: Gerüst oder Hubsteiger nötig, Hindernisse vor der Fassade |
| 8. Hindernisse: Möbel, Einbauküche, Spüle, Gardinenleiste, Rollo oder Plissee am Rahmen, Dachschräge | 8. Feuchte und Schäden: Flecken unter der Fensterbank, Algen, Abplatzungen |
| 9. Feuchte und Schäden: Schimmel, Stockflecken, Kondensat, Risse | 9. Gestaltung: Teilung, Sprossen, Farbe der Nachbarfenster; historische Fassade: Denkmalschutz prüfen |
| 10. Besonderheiten: Kastenfenster, Bad oder Küche, Dachgeschoss als Rettungsweg | 10. Einbruchschutz: leicht erreichbar, dann RC 2 empfehlen |
| | 11. Besonderheiten: Fallrohre, Leitungen, Leuchten, Kameras, Satellitenschüssel |

**Neue Öffnung (`wand`).** Innen: Wandoberfläche und Hinweise auf tragende Außenwand, Elektro (Dosen und vermutete Leitungen), Heizung und Wasser, Möbel, Raum (Deckenhöhe, Nachbarfenster als Anhalt), Feuchte. Außen: Wandaufbau, Geschoss und Zugang, Nachbarfenster (Stil, Sturz- und Brüstungshöhe), Leitungen und Hindernisse, Hinweise auf Statik (Ringanker, Deckenauflager, Gebäudeecken), Genehmigung und Denkmalschutz.

**Regeln im Auftrag:** nur, was zu sehen ist oder sich klar ergibt; Vermutungen mit „vermutlich“; Unsichtbares als Prüfpunkt fürs Feinaufmaß statt geraten; keine Maße außer Laibungstiefe und Schräglage; keine Preise; sachlich, weil der Kunde mitliest.

## Warum diese Punkte

| Befund | Folgerung für die KI | Quelle |
|---|---|---|
| Im Altbau ist die Aufnahme der Einbausituation Grundvoraussetzung: Materialien im Anschlussbereich, Lastabtragung, Abdichtung nach dem Ebenenmodell (luftdicht innen, Fuge, Wetterschutz außen); Wandtypen monolithisch, mit Luftschicht und Vorsatzschale, kerngedämmt, Fachwerk; Fensterbank (Wetterbank), Brüstung und Absturzsicherung, Rollladenkästen, Schadstoffe beim Rückbau | Wandaufbau, Anschlag, Anschlüsse, Fensterbänke, Brüstung, Rollladenkasten und Schadstoffverdacht stehen oben auf der Liste | [RAL-Gütegemeinschaft, Leitfaden zur Montage 2024 (Leseprobe)](https://guete-shop.de/wp-content/uploads/2024/03/LzM_2024_Leseprobe.pdf) |
| Beim Aufmaß fragt der Fachhandel außer den Maßen: Anschlag innen oder außen, Alt- oder Neubau (Anschlussprofil), Fensterbank innen und außen samt Höhenunterschied, Rollladen (Vorbau, Aufsatz, vorhandener Kasten), Rahmenverbreiterung | genau diese Punkte als eigene Themen | [Neuffer, Aufmaßhilfe Fenster](https://www.neuffer.de/sites/de/files/downloads/pdf/aufmasshilfe-fenster.pdf) |
| Altes Anschlagmauerwerk ist oft staubig und ungleichmäßig, die Abdichtung muss darauf abgestimmt werden | Anschlag und Laibungszustand beschreiben, Unsichtbares als Prüfpunkt | [TMP, Fenstermontage im Altbau](https://www.tmp-fenster.de/fachbetriebe/tutorials/artikel/fenstermontage-im-altbau-einbau-mit-anschlag-nach-ral/) |
| Fensterbretter aus Asbestzement und asbesthaltige Pappe unter Fensterbrettern kommen vor; Asbest ist seit 1993 verboten; vor dem Abriss klären | Faserzement-Fensterbank bei Gebäuden vor 1993: Prüfhinweis, nie eine Behauptung | [Stiftung Warentest, Asbest](https://www.test.de/Asbest-Die-versteckte-Gefahr-1269112-0/) |
| Brüstung nach Musterbauordnung 0,80 m bis 12 m Absturzhöhe, darüber 0,90 m; Länder weichen ab | niedrige Brüstung über dem Erdgeschoss: Absturzsicherung prüfen | [Bauprofessor, absturzsichere Fenster](https://www.bauprofessor.de/absturzsichere-fenster-und-montage/) |
| Fenster als zweiter Rettungsweg: lichte Öffnung mindestens 0,90 × 1,20 m, höchstens 1,20 m über dem Fußboden | Dachgeschoss: lichte Öffnung nicht verkleinern | [Baunetz Wissen, anleiterbare Fenster](https://www.baunetzwissen.de/brandschutz/fachwissen/flucht--rettungswege/anleiterbare-fenster-3143585) |
| Leicht erreichbare Fenster sind besonders gefährdet; empfohlen ist mindestens RC 2 | leicht erreichbar: RC 2 empfehlen | [Polizei, K-Einbruch](https://www.k-einbruch.de/sicherheitstipps/fenster/) |
| Ohne den Rollladenkasten bleibt beim Fenstertausch ein Wärmeschlupfloch; gefördert wird er nur zusammen mit Fenstertausch oder Fassade | Kastenart, Spalte und Zugluftspuren aufnehmen, Dämmung als Prüfpunkt | [Energie-Fachberater, Rollladenkasten](https://www.energie-fachberater.de/daemmung/daemmung-rollladenkasten/foerderung-fuer-die-daemmung-des-rollladenkastens.php) |

## Modell und Kosten

Standard ist `claude-sonnet-5-5` (genau beim Erkennen kleiner Details wie Kastenart, Anschlag oder Fugen). Umstellen ohne Code: Variable `KI_MODELL` bei Cloudflare (der frühere Name `KI_MODELL_GENAU` gilt weiter).

Je Foto: Bild etwa 1.530 Tokens, Auftrag etwa 1.500 Tokens, Antwort etwa 800 Tokens. Mit Sonnet 5.5 (2 $ Eingabe, 10 $ Ausgabe je Million Tokens) sind das rund 1,4 US-Cent je Foto, **etwa 2,5 Eurocent je Fenster** (1.000 Fenster im Jahr mit 20 % Wiederholungen: rund 30 €). Mit `KI_MODELL=claude-haiku-5-5` etwa 0,13 Cent je Fenster, dafür weniger genau. Preise: [Anthropic, Pricing](https://platform.claude.com/docs/en/about-claude/pricing); Bild-Tokens: [Anthropic, Vision](https://platform.claude.com/docs/en/build-with-claude/vision).

## Prüfen

Lokal antwortet die KI mit festen Testdaten (`KI_ATTRAPPE=1`, `scripts/dev-server.mjs`); die Zeile „Testauftrag“ zeigt Aufgabe, Seite und Modell. Die Prüfsuite kontrolliert: eine Anfrage je Foto, Auftrag Einbausituation, kein Altfenster im Befund, Prüfpunkte übernommen, Wand-Auftrag bei der neuen Öffnung, „struktur“ abgelehnt.

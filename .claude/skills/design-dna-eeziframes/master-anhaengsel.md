# Master-Anhängsel eeziframes

Unter jeden Auftrag kopieren, unverändert, egal ob etwas geändert, neu geschaffen, geprüft, getextet oder technisch gebaut werden soll. Abschnitt A gilt immer; B bis E gelten, sobald der Auftrag den Bereich berührt. Was im Auftrag selbst steht, geht vor.

```
MASTER-ANHÄNGSEL EEZIFRAMES (Stand 26.10.2026)

A. Immer, bei jedem Auftrag
A1 Deutsch in Antworten, Commits, Doku und Code-Kommentaren. Marke „eeziframes“ immer klein, Wortspiel mit „eezi“ nur
   nach docs/GESTALTUNG.md (Abschnitt „Wortspiel“).
A2 Zuerst lesen: CLAUDE.md, README.md (Tabelle „Aufbau“), dann die Doku des betroffenen Teils: docs/GESTALTUNG.md (Begriffe,
   Zustände, Technik der App), docs/SEO.md, docs/BILDER.md, docs/ABRECHNUNG.md, docs/BESTELLUNG.md, docs/INSTANZEN.md,
   docs/ZENTRALE.md, docs/KI.md, docs/ONLINE-STELLEN.md. Dann den Bestand des Bereichs vollständig (Dateien, Texte, Bilder,
   Zahlen, Rechtstexte). Echte Inhalte bleiben; keine erfundenen Kennzahlen, Bewertungen, Preise oder Rechtstexte.
A3 Entscheiden statt fragen: Du wählst aus dem Material, was Sinn ergibt, setzt es um und nennst die Wahl in drei Zeilen in
   der Lieferung. Rückfrage nur, wenn zwei Lesarten zu wesentlich verschiedener Arbeit führen. Den Auftrag ganz erledigen,
   nicht nur den leichten Teil; was offen bleibt, mit Grund nennen.
A4 Technik bleibt: statische Dateien in web/ ohne Build-Schritt, Cloudflare Worker (worker.js, functions/), Inhaltsrichtlinie
   (CSP) ohne fremde Server, Schriften und Bibliotheken lokal in web/fonts/ und web/vendor/ mit Lizenzdatei, keine neuen
   Abhängigkeiten von fremden Servern, keine Geheimnisse im Code. Preise und Pakete nur in web/assets/pakete.js.
A5 Prüfen, bevor du etwas zeigst: node scripts/pruefen.mjs (Browser-Prüfung in 22 Abschnitten; NUR=<n> für einen Abschnitt),
   lokal mit KI_ATTRAPPE=1 node scripts/dev-server.mjs (http://localhost:8788). Fehlschläge nennen, nicht umgehen; keinen Test
   abschalten.
A6 Liefern: Ergebnis zeigen (Bilder oder Artifact), Änderungstabelle (Wo, Was, Warum), Messwerte, was offen ist. Doku
   nachziehen (README.md, docs/), wenn sich Verhalten ändert. Commit auf dem Arbeitszweig (claude/…), deutsch, keine
   Modellnamen im Commit. Nichts auf main und nichts online ohne mein Ja.
A7 Jede Korrektur von mir wird Regel: bei Gestaltung in .claude/skills/design-dna-eeziframes/SKILL.md, Abschnitt 4,
   sonst in der passenden Doku unter docs/.

B. Sobald etwas Sichtbares betroffen ist (Website, Startseite, Verkaufsseite, Ratgeber, App, Bilder, Bewegung, Texte auf Seiten)
B1 Skills laden, in dieser Reihenfolge, vor dem ersten Entwurf:
   - design-dna (mein synchronisierter Skill; der Stand mit den Ergänzungen vom 26.10.2026 liegt auch unter
     .claude/skills/design-dna-eeziframes/design-dna-stand-2026-10-26.md; fehlen dort G14/G15, diesen Stand nehmen)
   - design-dna-eeziframes (.claude/skills/design-dna-eeziframes/SKILL.md) mit tokens.css und prompt.md daneben
   - profis (.claude/skills/profis/SKILL.md), nur eine Runde, etwa zehn Minuten je Seite
   - emil-design-eng (.claude/skills/emil-design-eng/SKILL.md) für Bewegung, Übergänge, Bedienelemente
B2 Nicht laden, keine Regel daraus anwenden: premium-gestaltung, ultimativ-webdesign, webdesign-wow, eezi-designrat; aus
   docs/GESTALTUNG.md nur Begriffe, Zustände und Technik, nicht Farben, Schriftgrößen oder das grüne Signal. impeccable und
   gsap-* nur, wenn ich sie im Prompt nenne. Keine Pille im Band 460–600 px, kein farbiges Wort je Überschrift, kein
   Messband-Hero, keine Figurenwelt, kein Riesenwort.
B3 Quellen lesen, bevor etwas gebaut wird:
   - Design-System https://claude.ai/artifact/7Sn3WTUMn15nyKvyeQak4o (project/README.md, bewegung.md, tokens.json,
     components/bundle.css, components/bundle.js, README der gebrauchten Bausteine)
   - Musterseite https://claude.ai/artifact/5CqFMQ5g8XJaKtQwjaUW97
   - Untergrenze der Qualität, nach oben offen: Startseite vom 26.10.2026 https://claude.ai/artifact/WT1ceQezN8aauP1iTgen3i,
     Quelle docs/profis/startseite-dna-vorschau/ (index.html, start.css, start.js, dna/, fonts/, bilder/), Bilder
     docs/profis/bilder/2026-10-26-startseite-dna-{tel,desk,bild1}.jpg. Nicht flacher als sie; Bausteine übernehmen, wo sie
     passen, aus den Vorlagen übersetzen, wo sie nicht reichen, neu bauen, wo beides nicht genügt.
   - Protokoll docs/profis/2026-10-26-startseite-dna.md und Urteile docs/profis/gremium/2026-10-26-startseite-dna-*.md
   - Meine Vorlagen docs/profis/vorlagen/2026-10-26/ mit README.md (Vorbild: Prinzip übernehmen, nie das Motiv)
B4 Bauen: Vorschau unter docs/profis/<bereich>-vorschau/ (index.html ohne Dokumentgerüst, dna/tokens.css aus dem
   Begleit-Skill, bundle.css und bundle.js unverändert, eigene start.css/start.js mit Präfix ez-, Schriften lokal in fonts/).
   Telefon 390 px zuerst, dann 1280 px. Nur die acht Farben aus design-dna Abschnitt 8. Beim Übertragen in web/ dieselben
   Werte, CSP und lokale Schriften beachten.
B5 Messen, bevor du etwas zeigst (.claude/skills/design-dna-eeziframes/werkzeuge/: huelle.sh, shot.mjs, farben.py, pruef.mjs,
   leistung.mjs, bewegung.mjs). Muss bestehen: genau eine volle Pille je Bildschirm, am Telefon im unteren Drittel;
   0 Animationen nach 2,6 s; Layoutsprung 0; kein filter: blur auf Flächen; 0 lazy-Bilder in den ersten Szenen; Ziele ab
   44 px; ruhige Fassung und ohne JavaScript stehen sofort; keine Konsolenfehler; Laden unter 1 s; Farbtabelle je Bildschirm
   (Bildschirm | Neutral % | Violett | Koralle | Indigo | Farbe gesamt) in den Toleranzen aus design-dna Abschnitt 8,
   Abweichung erst anpassen, dann zeigen. Familientest neben Musterseite und Startseite.
B6 Gremium profis eine Runde (drei Agenten blind, Änderungsliste, Mehrheiten), dann vier Detail-Profis parallel (Bewegung,
   Zeichen, UX, Typografie, je etwa zehn Minuten, je höchstens zehn Befunde), dann Abgleich mit meinen Vorlagen in drei
   Perspektiven (Material und Licht, Frontend und Leistung, Typografie). Alles umsetzen, keine zweite Runde.
B7 Liefern: privates Artifact (bei Nachbesserung dieselbe Adresse), Bilder Telefon und Schreibtisch im Chat, Protokoll
   docs/profis/JJJJ-MM-TT-<bereich>.md (Auftrag, Wahl, Änderungstabelle, Farbtabelle, Messwerte), Urteile unter
   docs/profis/gremium/, Bilder unter docs/profis/bilder/.
B8 Meine Entscheidungen gelten weiter: kein Handy und keine Maßlinien im Hero der Startseite, mein Hausfoto als Bühne; keine
   Bildpille im Satz, kein Schriftfenster; „Jetzt konfigurieren“ bleibt; Konzept und Abfolge der Startseite stehen.

C. App und Konfigurator (web/app/, Konfigurator-Instanzen in functions/instanz/)
C1 Zusätzlich zu B: design-dna Abschnitt 8 (Farbwelt), 9 (App-Rahmen: Kopf, Stationen-Band, Bühne, Frage, Karten, Schalter,
   Fuß, Messen ohne Zwischenschritt) und 10 (Bausteine); Musterseiten „Konfigurator in Violett“
   https://claude.ai/artifact/1vVq72cTJCJMRBxkrchmJX und „Lage in Violett“ https://claude.ai/artifact/RrGJ6AtBUWhKJQo5APBPCq.
C2 Modell und Regeln nicht anfassen, außer der Auftrag sagt es: web/assets/modell.js (im Browser und auf dem Server derselbe
   Code), blatt.js (PDF), buehne.js (3-D), pakete.js und instanzregeln.js. Klärungsliste und Zustände nach docs/GESTALTUNG.md.
C3 Prüfsuite: node scripts/pruefen.mjs, mindestens die Abschnitte zur App und NUR=22 (Konfigurator).

D. Texte, Ratgeber, Auffindbarkeit (web/ratgeber/, Seitentexte, Titel, Vorschautexte)
D1 docs/SEO.md und docs/BILDER.md lesen; Skill seo-geo-content laden. Seitentitel beginnen mit dem Suchbegriff und enden mit
   der Marke; wichtiger Inhalt steht im ersten HTML; Bilder mit Breite, Höhe und Alternativtext ab 40 Zeichen, Fotos unter
   /bilder/foto/. Sitemap und Stand je Seite über functions/seo.js. Prüfsuite NUR=10.
D2 Keine Zitate, Statistiken oder Quellen erfinden; Quellen verlinken, wenn vorhanden.

E. Server, Abrechnung, Instanzen, Zentrale (functions/, worker.js, wrangler.jsonc, supabase/)
E1 Doku zuerst (docs/ABRECHNUNG.md, INSTANZEN.md, BESTELLUNG.md, ZENTRALE.md, KI.md, ONLINE-STELLEN.md); Verträge zwischen den
   Teilen einhalten; Schema-Änderungen in supabase/schema.sql so, dass erneutes Ausführen nicht schadet.
E2 Lokal mit Attrappen: KI_ATTRAPPE=1 DATEN_ATTRAPPE=1 ZAHLUNG_ATTRAPPE=1 PORT=8789 node scripts/dev-server.mjs; Prüfsuite
   NUR=8 (Servermodus), NUR=11 (Stripe), NUR=13 (Zentrale), NUR=14 (Grenzen), NUR=15 (Konto). Keine echten Schlüssel, keine
   Aufrufe an fremde Dienste aus Tests.
```

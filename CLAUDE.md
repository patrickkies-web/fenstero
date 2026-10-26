# eeziframes

- Sprache: Deutsch, in Antworten, Commits und Doku.
- Bevor etwas Sichtbares gebaut oder geändert wird (Website, Verkaufsseite für Fensterbauer, Startseite, App, Bilder, Animationen), den
  Skill `premium-gestaltung` laden (.claude/skills/premium-gestaltung/SKILL.md). Er enthält die Vorstellungen und Mindestanforderungen des
  Inhabers.
- Für jeden Gestaltungswunsch des Inhabers (ein Bereich der App oder Website soll besser werden): erst `ultimativ-webdesign`
  (.claude/skills/ultimativ-webdesign/SKILL.md, das vereinte Regelwerk aus webdesign-wow, Emil Kowalski, impeccable und GSAP) für
  Befund, Richtung und Vorschau, dann `profis` (.claude/skills/profis/SKILL.md, das Gremium aus Gestaltern, Kunden und Fensterbauern)
  für die Entscheidung je Änderung. Protokolle unter docs/profis/.
- Bei Animationen, Übergängen und Bedienelementen zusätzlich den Skill `emil-design-eng` laden
  (.claude/skills/emil-design-eng/SKILL.md, von Emil Kowalski, MIT): Easing, Dauer, Druckfeedback, was nicht animiert wird.
  Die Markenregeln gehen vor.
- `/impeccable <befehl> <bereich>` (Skill `impeccable` von Paul Bakaus, Apache 2.0): craft, critique, audit, polish, bolder, quieter,
  animate, typeset, layout und weitere. Die Markenregeln und `premium-gestaltung` gehen vor; Schriftgrößen und Farben bleiben die
  der App, auch wenn der Skill andere Schriften empfiehlt.
- JavaScript-Animationen mit GSAP: Skills `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`,
  `gsap-performance` (GreenSock, MIT). GSAP liegt noch nicht im Projekt; bei Einsatz nach web/vendor/ mit Lizenzdatei.
- Konfigurator (App) ab 26.10.2026: Folie für Folie im Skill `design-dna` mit der Palette „Task-App dunkel“ (nur acht Farben) und
  dem Rahmen der Lage-Folien (Kopf mit Logo, Stationen-Band, Fuß mit rundem Zurück und weißer Weiter-Pille, Knöpfe der Lage).
  Musterseiten: „Lage in Violett“ (online) und „Konfigurator in Violett“ (Vorschau Start bis Lage); Abschnitt „Design-DNA im
  Konfigurator“ in docs/GESTALTUNG.md. Dort gehen design-dna und Palette den alten Markenregeln (Inter, 13/15/17/24/32/40, grünes
  Wort, Cream-Pille) vor; Farbanteile je Bildschirm messen. Beim Messen kein Zwischenschritt: Zifferntasten offen, „Weiter“ speichert.
- Gestaltungsregeln: docs/GESTALTUNG.md. Arbeiten auf dem Arbeitszweig einchecken; online (main) nur auf ausdrücklichen Wunsch.

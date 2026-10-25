# eeziframes

- Sprache: Deutsch, in Antworten, Commits und Doku.
- Bevor etwas Sichtbares gebaut oder geändert wird (Website, Verkaufsseite für Fensterbauer, Startseite, App, Bilder, Animationen), den
  Skill `premium-gestaltung` laden (.claude/skills/premium-gestaltung/SKILL.md). Er enthält die Vorstellungen und Mindestanforderungen des
  Inhabers.
- Bei Animationen, Übergängen und Bedienelementen zusätzlich den Skill `emil-design-eng` laden
  (.claude/skills/emil-design-eng/SKILL.md, von Emil Kowalski, MIT): Easing, Dauer, Druckfeedback, was nicht animiert wird.
  Die Markenregeln gehen vor.
- `/impeccable <befehl> <bereich>` (Skill `impeccable` von Paul Bakaus, Apache 2.0): craft, critique, audit, polish, bolder, quieter,
  animate, typeset, layout und weitere. Die Markenregeln und `premium-gestaltung` gehen vor; Schriftgrößen und Farben bleiben die
  der App, auch wenn der Skill andere Schriften empfiehlt.
- JavaScript-Animationen mit GSAP: Skills `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`,
  `gsap-performance` (GreenSock, MIT). GSAP liegt noch nicht im Projekt; bei Einsatz nach web/vendor/ mit Lizenzdatei.
- Gestaltungsregeln: docs/GESTALTUNG.md. Arbeiten auf dem Arbeitszweig einchecken; online (main) nur auf ausdrücklichen Wunsch.

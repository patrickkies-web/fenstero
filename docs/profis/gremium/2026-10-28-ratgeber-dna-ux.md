# Ratgeber in der DNA, Detail-Profi UX und Barrierefreiheit (28.10.2026)

Lena Hartwig, getrennter Agent, eine Runde, Fassung X. Zehn Befunde nach Wirkung:

1. **Lesetext Grau auf Weiß, Zeilen zu lang** (17 px in #6b676c, 5,5:1; am Schreibtisch etwa 91 Zeichen, AGB etwa 95). Wie: Lesetext als Ton der DNA-Farben (`color-mix` aus Textgrau und Schwarz, etwa 10:1), Grau nur für Etiketten und Meta; Spalte etwa 75 Zeichen; Rechtstexte 580 px.
2. **Orientierung am Telefon:** kein Weg zurück zum Inhaltsverzeichnis, Zählungen passen nicht („Abschnitt 8 von 8“ gegen zehn Einträge, dazu „Schritt 1–6“ und „Schritt 4 von 6“). Wie: Rundknopf „Auf dieser Seite“ in der zurückkehrenden Leiste (unter 1024 px), Zählung angleichen, Einträge am Telefon 17 px.
3. **Widerrufsformular:** Feldrand Silbergrau auf Weiß 2,5:1 (WCAG 1.4.11), Fehlertext nicht mit dem Feld verknüpft. Wie: Rand Textgrau, Fokus 2 px schwarz mit Abstand, `aria-describedby` auf die Fehlermeldungen.
4. **Fokus unter dem Vorhang** (WCAG 2.4.11): Shift+Tab landet unter der nächsten Szene. Wie: `focusin` prüft mit `elementFromPoint`, ob eine andere Szene das Ziel überdeckt, und scrollt ohne Gleiten; Leiste mit Fokus nicht verstecken; `summary` in die Fokusregel; Fokusbild neu aufnehmen.
5. **Ringe bei „Sonderfall“ sehen aus wie Ankreuzfelder.** Wie: Listenpunkt 6 px in `linie`.
6. **„Du bist hier“ sieht aus wie die Hauptpille**, `aria-current` am `li` statt am Ziel, Link auf sich selbst. Wie: Indigo-Marke; statt Link ein `span` mit `aria-current="step"`.
7. **„Nächster Schritt“: Linkname ist der lange Alternativtext des Bildes**, Bild `lazy`. Wie: Bild mit `alt=""` (wie in der Übersicht), ohne `lazy`.
8. **Rechtstexte am Telefon 16 px, keine §-Übersicht.** Wie: 17 px auf allen Breiten; Ids an den Überschriften und eine Liste „Auf dieser Seite“ (Rechtstext wörtlich gleich).
9. **Weiterlesen mit schrägem Pfeil (wirkt wie „externe Seite“), Fußnoten [n] klein und ohne Rückweg.** Wie: Pfeil statt Ecke; Fußnoten 14 px mit Polster (Ziel etwa 24 px); Rückweg „zurück zum Text“ in den Quellen.
10. **Fehlerseite auf kleinen Telefonen ohne Handlung im ersten Bildschirm**, Etikett 40 px über dem Titel. Wie: Abstände 6/12/32, Bild am Telefon kleiner; dritter Knopf „Zum Ratgeber“ nur auf Wort des Inhabers (neuer Inhalt).

Geprüft und in Ordnung: Ziele ab 44 px, Fokusring auf Hell schwarz und auf Dunkel weiß, Sprungmarken nicht unter der Leiste, eine volle Pille im unteren Drittel, Kontraste auf Dunkel. Randnotiz: fünf Beschriftungen für dieselbe Handlung (WCAG 3.2.4), ändern nur auf Wort des Inhabers.

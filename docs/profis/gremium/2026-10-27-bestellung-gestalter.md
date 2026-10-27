# Gremium Gestalter: Bestellung, Kundenbereich, Zentrale (27.10.2026, eine Runde)

Simuliert, getrennter Agent, nur Urteil. Bewertet wurde der Stand vor dem Umbau; umgesetzt siehe [2026-10-27-bestellung.md](../2026-10-27-bestellung.md).

**Gruppe G (Gestalter): eine Runde, Bestellung, Kundenbereich und Zentrale vom 27.10.2026**

Ich habe alle 20 Bilder angesehen und die langen Ganzseitenaufnahmen zum Lesen in Abschnitte zerlegt. Die Maße stammen aus den Pixeln: Das × auf dem Foto in 390-5 ist sichtbar 26 px groß, die Pille im Kopf etwa 44 px. Die Kontraste sind aus Pixeln geschätzt. Es wurden keine Dateien im Projekt geändert.

---

**Jonas Veit, 44, Art Director**
- **Blicke:** Auf 390-1 sehe ich zuerst das Muster-Mockup, dann „Welches Paket“, dann die weiße Pille. Auf 390-6 zuerst die Vorschau der eigenen Seite, dann „Alles da?“, dann die 199 mit dem Lichtfleck. Danach kommen drei weiße Platten hintereinander.
- **Schieltest:** Auf beiden Bildern sehe ich drei Formen. Auf 390-6 ringen aber Vorschau und Preiskachel um den Helden.
- **Urteil:** Die Idee trägt. Die Seite baut sich beim Ausfüllen auf, von „Ihr Betrieb – Ihr Ort“ bis „Fensterbau Test – Köln und Umgebung“. Das ist eigen. Oben stimmen Material und Licht (Gerätrahmen, Verlauf), unten wird es ein Stapel gleicher Karten. Schraffur ist ein Werkstattzeichen, kein Material. Im Formular ist sie in Ordnung, in der Vorschau einer Seite, die live ist, nicht.
- **Hand:** 3
- **MUSS:** In 1280-k4 die schraffierte Kachel in der Live-Vorschau durch das Bild ersetzen, das wirklich auf der Seite steht. Sonst die Kachel weglassen.
- **VETO:** nein

**Lena Hartwig, 38, UX-Research und Barrierefreiheit**
- **Blicke:** Auf 390-1 sehe ich die Überschrift, dann die Essential-Karte mit leerem Kreis, dann die Pille „Weiter mit Essential Plus“. In drei Sekunden steht da ein Widerspruch: Ich sehe Essential, der Knopf sagt Plus. Auf 390-6 sehe ich Vorschau, Überschrift und Pille. Die drei Häkchen finde ich erst ganz unten.
- **Schieltest:** ja
- **Urteil:** Der Kontrast hält: Textgrau auf Weiß etwa 5,5:1, Silbergrau auf Schwarz etwa 8:1. Schlimmer ist anderes:
  - Platzhalter wie „Fensterbau Brandt GmbH“ sehen aus wie Eingaben. Im Fehlerbild wirkt das Feld gefüllt, und darunter steht „Bitte eingeben“.
  - Die Hinweisblasen liegen über der Pille (in 390-2 ist die Beschriftung verdeckt) und über Feldern.
  - Das × auf dem Foto misst sichtbar 26 px.
- **Hand:** 2
- **MUSS:**
  1. In 390-3 und 390-4 die Platzhalter mit „z. B. …“ beginnen, wie beim Anrufwunsch.
  2. Hinweisblasen nie über Pille oder Feld legen.
  3. Das × in 390-5 bekommt 44 px Trefferfläche.
- **VETO:** nein

**Noah Brandner, 31, Motion**
- **Blicke:** Auf 390-1 sehe ich den violetten Punkt mit Hof im Band, dann Überschrift, dann Pille. Auf 390-6 den Punkt 6 von 6, dann Vorschau, dann Pille.
- **Schieltest:** ja
- **Urteil:** Es gibt kaum Bewegung, und das ist richtig. Ein Unternehmer füllt ein Formular aus und will Ruhe, das Druckfeedback .97 genügt. Der Stationswechsel nur über Farbe ist ehrlich. Gleitet der Hof zum nächsten Punkt, wird der Fortschritt sichtbar. Mein Problem sind die Hinweisblasen: „Code ist unterwegs“ steht noch auf Station 3, wenn der Code längst eingelöst ist. Und sie erscheinen genau dort, wo der Daumen gleich tippt. Eine Meldung ohne Bezug ist so schlimm wie Bewegung ohne Bedeutung. Das Freigabeblatt (k3) dunkelt den Hintergrund ruhig ab.
- **Hand:** 4
- **MUSS:** Hinweisblasen gehören zur Station. Beim Wechsel verschwinden sie, sonst nach etwa 4 s. Sie kommen von unten mit ease-out 200 ms und gehen schneller. Bei reduzierter Bewegung nur Blende.
- **VETO:** nein

**Tobias Lenz, 35, Frontend**
- **Blicke:** Auf 390-1 sehe ich Mockup, Überschrift, Pille. Auf 390-6 Vorschau, Preis, Pille.
- **Schieltest:** ja
- **Urteil:** Die Telefonbreite hält. Es gibt kein Querscrollen außer der Filterleiste der Zentrale, die bewusst angeschnitten ist. Die Vorschau zeigt die Eingaben scharf und sofort, der Fuß klebt sauber mit Verlauf. Die Mängel:
  - Die Hinweisblasen liegen frei über Fuß und Inhalt statt im Fuß-Stapel.
  - E-Mails brechen mitten im Wort („fensterba / u-test.de“). Die Umbruchstelle gehört vor das @.
  - In z3 ist die Bühne am Telefon eine schwarze Fläche, obwohl der Download-Chip sagt, dass die Datei da ist.
  - Der Einbau-Code im Kundenbereich hängt an Inline-Style. Eine strenge Sicherheitsrichtlinie (CSP) auf der Kundenseite blockiert das.
- **Hand:** 3
- **MUSS:**
  1. Die Hinweisblasen in den Fuß-Stapel, oberhalb der Pille mit Abstand, mit aria-live.
  2. In z3 das Bühnenbild am Telefon wirklich laden oder ehrlich „lädt“ zeigen. Die Ursache prüfen.
- **VETO:** nein

**Mara Keller, 40, Conversion**
- **Blicke:** Auf 390-1 sehe ich die Überschrift, die 29, dann die Pille „Weiter mit Essential Plus“. Ich bestelle Plus und sehe Essential mit leerem Kreis: Misstrauen schon auf Station 1. Auf 390-6 sehe ich Vorschau, die 199, dann „Kostenpflichtig bestellen“.
- **Schieltest:** ja
- **Urteil:** Gut sind „heute, einmalig“, „ohne Mindestlaufzeit“, der Name Stripe und „So geht es weiter“ in vier Schritten. Die Abbruchstellen:
  - Auf Station 2 deckt die Blase die Pille.
  - Auf Station 3 fehlen „11 Angaben“, und das vor der Zahlung.
  - Auf Station 6 liegen drei Häkchen ganz unten, die Pille klebt längst im Fuß.
  - Am Schreibtisch (1280-1, 1280-6) sehe ich im ersten Bildschirm keine Hauptaktion.

  Als Anreiz zum nächsten Paket ist „zur Hälfte in Ihren Farben“ auf der Station Auftritt ein guter Haken, er führt aber nirgends hin.
- **Hand:** 2
- **MUSS:**
  1. In 390-1 das gewählte Paket im ersten Bildschirm zeigen, z. B. mit einem Umschalter Essential/Plus/Signature über den Karten.
  2. In 390-6 die Häkchen direkt unter die Preiskachel. Die Zeile über der Pille nennt, was fehlt.
- **VETO:** nein

**Daniel Roth, 52, Typograf und Marke**
- **Blicke:** Auf 390-1 sehe ich „Welches Paket“, dann „passt zu Ihnen?“ in Silbergrau, dann die 29. Auf 390-6 sehe ich die Vorschau, dann „Alles da? Dann bestellen Sie.“, dann die 199.
- **Schieltest:** ja
- **Urteil:** Die zweite Stimme sitzt auf jeder Station, bis in Zentrale und Kundenbereich. Die großen dünnen Ziffern sind ein Wiedererkennungszeichen. Unehrlich sind die Preise:
  - 199 € steht groß da, ohne „netto“ daneben.
  - Am Schreibtisch steht klein „Preise netto zzgl. 19 % USt.: 332,01 €“. Das liest sich, als seien 332,01 € netto. Dahinter steht „Vorläufige Preise.“, und das neben „Kostenpflichtig bestellen“ ist unhaltbar.
  - Im Kundenbereich stehen 332,01 € und 279 € (netto) ohne Brücke dazwischen.
  - Das Datum steht mal als „27.10.2026“, mal als „Stand 2026-10-27“.
  - „EEZI Signature“ und „Signature“ wechseln sich ab.
- **Hand:** 2
- **MUSS:**
  1. Auf den Stationen Paket und Bestellen „netto“ an jeden Preis, dazu die Zeile „Heute bei Stripe: 332,01 € inkl. 19 % USt.“. „Vorläufige Preise“ streichen.
  2. In k4 „332,01 € inkl. USt.“ schreiben und das Datum deutsch.
- **VETO:** nein

---

**Sprecher der Gruppe G**

- **Median der Hand:** 2,5
- **Verteilung:** dreimal 2 (Hartwig, Keller, Roth), zweimal 3 (Veit, Lenz), einmal 4 (Brandner)
- **Vetos:** keine

**MUSS nach Wirkung:**
1. **Paket 390-1/1280-1, Bestellen 390-6/1280-6, Kundenbereich k4:** Die Preise stehen ohne „netto“, „Vorläufige Preise“ steht neben „Kostenpflichtig bestellen“, und 332,01 € steht ohne Bezug da. „netto“ an jeden Preis, Zeile „Heute bei Stripe: 332,01 € inkl. 19 % USt.“, „Vorläufige Preise“ streichen, im Kundenbereich „inkl. USt.“.
2. **Hinweisblasen 390-2, 390-3, 390-3-fehler, k1:** Sie verdecken Pille, Felder und Überschrift, und „Code ist unterwegs“ steht noch auf Station 3. Sie gehören in den Fuß-Stapel oberhalb der Pille, mit aria-live. Beim Stationswechsel verschwinden sie, sonst nach 4 s.
3. **Betrieb und Adresse 390-3/390-4:** Die Beispielwerte wirken wie Eingaben, das Fehlerbild widerspricht sich. „z. B. …“ voranstellen. Die Wunsch-Domain echt vorbelegen oder ebenso kennzeichnen.
4. **Paket 390-1:** Die Pille sagt Plus, sichtbar ist Essential mit leerem Kreis. Umschalter Essential/Plus/Signature über die Karten, das gewählte Paket im ersten Bildschirm.
5. **Bestellen 390-6:** Die Zustimmung steht ganz unten. Sie kommt direkt unter die Preiskachel. Die Statuszeile nennt, was fehlt. Koralle nur bei Fehlern.
6. **Kundenbereich 1280-k4:** Schraffur in der Live-Vorschau. Das echte Bild der Seite zeigen oder die Kachel weglassen.
7. **Auftritt 390-5:** Das × ist 26 px groß. Trefferfläche 44 px.
8. **Zentrale 390-z3:** Die Bühne ist schwarz, obwohl die Datei da ist. Ursache finden, Bild laden.
9. **Kundenbereich k4, Verlauf:** „Stand 2026-10-27“ wird zu „27.10.2026“.

**Kann (höchstens fünf, außerhalb der 200 Wörter):**
1. **390-6, Zusammenfassung:** Die Farbe mit Hexwert zeigen, wie in der Zentrale. E-Mails vor dem @ umbrechen.
2. **k3:** „Abbrechen“ als Umriss statt als Indigo-Fläche, damit nur eine Pille gefüllt ist.
3. **Zentrale, Eingang (390-z2, 1280-z2):** Die Zahl steht dreimal da (Überschrift, Kachel, Filter). „In Arbeit 5“ steht neben Pillen mit „Bestellt“. Filter und Status gleich benennen.
4. **Stationen-Band:** Der Hof gleitet zum nächsten Punkt, mit ease-out etwa 250 ms.
5. **Auftritt 390-5:** Den Satz „zur Hälfte in Ihren Farben“ mit einem Verweis auf Signature verbinden.

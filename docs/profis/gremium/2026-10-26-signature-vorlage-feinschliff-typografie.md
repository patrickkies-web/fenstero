# Feinschliff Typografie (Daniel Roth): Vorlage EEZI Signature

**Gesamteindruck:** Die Vorlage spricht in der Hand der Startseite: Outfit durchgehend, Labels 12/400 mit 0,03 em, Titel 600 mit der zweiten Stimme in Silbergrau, Lesetext 16 in tinte-2 auf 36ch, Zahlen dünn mit kleiner Einheit, die Luft Etikett→Titel→Text→Handlung fast überall 6/12/32. Der Einladungs-Hero trägt: „Guten Tag,“ leise, der Name das eine schwere Element. Die Muster-Leiste (12/400 Silbergrau auf Anthrazit, rund 6,6:1) und die Etiketten (12/500 auf Glas) bleiben sauber hinter der Seite. Was nicht stimmt, liegt in den Wörtern, nicht in den Rollen: die Seite sagt vieles zweimal (der Betrieb viermal in einer Telefonhöhe, Label-Werte nehmen den Titel vorweg, die Haken-Liste wiederholt die Route daneben), der Kicker nennt die Einladung „Anfrage“, und eine Handvoll Werte liegt neben der Skala (46, 17, 15, 13, 11, 9 px; Geviert- statt Halbgeviertstrich).

## 1. Kicker im Einladungszustand · Wirkung hoch
- **Wo:** index.html, Z. 133, `.ez-kicker.ez-nur-einladung`: „Persönliche Anfrage von Fensterbau Brandt“.
- **Was ist:** „Anfrage“ heißt auf dieser Seite die Anfrage des Kunden (Schritt 4, „Ihre Anfrage geht nur an Fensterbau Brandt.“, Fuß, PDF). Hier fragt der Betrieb den Kunden; und die Sache hat schon drei andere Namen: „Einladung“ (Umschalter), „Einladungslink“ (Leiste, Etikett), „Ihr Link“ (Etikett, Meta).
- **Wie:** „Persönliche Einladung von Fensterbau Brandt“.
- **Warum:** Ein Wort je Sache. „Einladung“ ist das Wort des Produkts (eingeladen, in Bearbeitung, eingereicht) und erklärt den Kicker aus sich selbst; „Anfrage“ bleibt dem Kunden.

## 2. Hero-Spalte: der Betrieb viermal, zwei Schlussformeln · Wirkung hoch
- **Wo:** index.html, Z. 132–146 (Kicker, `.ez-brief .dna-text`, `.ez-unterschrift`, `.ez-meta`); Kontakt Z. 387.
- **Was ist:** Im Website-Zustand steht „Fensterbau Brandt“ in einer Telefonhöhe viermal (Kicker, Schlussformel „Ihr Team von Fensterbau Brandt.“, Unterschrift „Geschäftsführung, Fensterbau Brandt“, Meta „… Angebot von Fensterbau Brandt.“), dazu „Brandt“ im Logo und auf dem Gerät. Der Brief endet zweimal: im Text („Ihr Team von …“) und mit dem Unterschriftsblock. Im Einladungszustand nennt die fette Meta-Zeile „Ihr persönlicher Link.“ dasselbe wie das Etikett „Ihr Link · P-2026-001“ im selben Bild.
- **Wie:** Text (Website): „**Messen Sie in Ruhe selbst, Schritt für Schritt erklärt.** Wir melden uns mit Ihrem Angebot.“ · Unterschrift in beiden Zuständen und im Kontakt: „Petra Brandt“ / „Geschäftsführung“ · Meta (Website): „**Kostenlos und unverbindlich.** Etwa 5 Minuten je Fenster, ohne Konto. Den Preis nennt Ihnen das Angebot.“ · Meta (Einladung): „**Kostenlos und unverbindlich.** Über Ihren Link kommen Sie jederzeit zurück, auf jedem Gerät. Etwa 5 Minuten je Fenster.“
- **Warum:** Der Unterschriftsblock ist die Schlussformel; ein zweiter Schluss im Text liest wie ein Brief, der zweimal aufhört. Die fette Meta-Zeile ist die Zusage, die der Besucher in drei Sekunden braucht, in beiden Zuständen dieselbe; der Link erklärt sich im Grau. Der Betrieb steht dann noch im Kicker, im Logo und auf dem Gerät, das genügt.

## 3. Doppelte Aussagen zwischen den Bausteinen · Wirkung hoch
| Wo | Was ist | Wie |
| --- | --- | --- |
| Label Szene 3 (Z. 224) gegen Titel | „So geht es — vier Schritte“ über „In vier Schritten zum Angebot.“ | Label-Wert „– zu Hause, am Handy“ |
| Label Szene 4 (Z. 306) gegen Titel | „Ihre Daten — nur an den Betrieb“ über „Ihre Anfrage geht nur an Fensterbau Brandt.“ | Label-Wert „– vor und nach dem Senden“ (das erklärt der Absatz) |
| Label Kontakt (Z. 383) gegen Text (Z. 385/386) | „— werktags im Büro“, der Text beginnt „Sie erreichen uns werktags im Büro in Köln.“ | Website: „Wenn Sie lieber schreiben: eine E-Mail genügt, wir melden uns.“ · Einladung: „Oder Sie antworten einfach auf die Nachricht, mit der dieser Link kam.“ |
| Einleitung Szene 3 (Z. 226) gegen Zeit-Karte | „Etwa 5 Minuten je Fenster“ einen Bildschirm über „Je Fenster etwa 5 Minuten“ | „Ohne Konto und ohne App aus dem Store. In den Messschritten …“ |
| `ul.ez-haken` (Z. 309–314) gegen Route und Seite | Alle vier Haken stehen wörtlich anderswo: „Kostenlos und unverbindlich“ (Hero, Bereit), „Ohne Konto, ohne Werbung“ (Szene 3, Absatz darüber), „als PDF“ (Schritt 4, Route daneben), „nachgemessen“ (Schritt 2, Route daneben) | Liste streichen |
| Innenkarte `.ez-stand__fuss` (Z. 325) gegen Absatz (Z. 308) | „Maße und Fotos erst nach dem Senden.“ sagt der Absatz im ersten Satz | „Ihr Berater sieht, wie weit Sie sind, und hilft, wenn Sie hängen.“ Die Zusage gehört in den Absatz: der ist echter Text, die Karte ist `role="img"`, ihr Text für Vorleser unsichtbar |
| Kontakt-Karte (Z. 393), Feld `firma.ort` | „Fensterbau Brandt“ über „Fensterbau in Köln“; dasselbe Feld heißt in Szene 2 „Köln und Umgebung“ | „Köln und Umgebung“, ein Wert je Feld |

**Warum:** Wiederholung gehört an zwei Stellen, Hero und letzte Pille (kostenlos, 5 Minuten). Dazwischen kostet jede zweite Nennung Aufmerksamkeit, und ein Label-Wert, der den Titel vorwegnimmt, macht den Titel zur Wiederholung.

## 4. Titel „Guten Tag, Familie Weber.“ · Wirkung mittel
- **Wo:** index.html, Z. 135; start.css `.ez .dna-titel-xl`.
- **Was ist:** Trägt. Der Gruß in Silbergrau ist die leise Stimme, der Name in Weiß das eine schwere Element (G15); am Telefon zwei Zeilen, der Name ganz; −0,035 em sitzt bei 44 wie bei 56 px, Komma im Grau, Punkt im Weiß, kein Zusammenstoß von „g“ und „F“ bei Zeile 0,95. Dass die leise Stimme hier vorn steht und sonst hinten, ist richtig: der Leser sucht seinen Namen. Zwei Fehler im Gerüst: Der Punkt steht im `data-vorlage="kunde.name"`, also in den Daten des Betriebs; und das `&nbsp;` zwischen „Familie“ und „Weber“ hält jeden Namen in einem Stück, bei „Familie Schneider-Hofmann“ läuft die Zeile bei 44 px über den Rand (`overflow-x: clip` schneidet ab).
- **Wie:** `<h1 class="dna-titel-xl ez-nur-einladung" data-dna-woerter="6"><em class="ez-ak">Guten Tag,</em><br><span data-vorlage="kunde.name">Familie Weber</span>.</h1>`: Punkt außerhalb der Daten, fester Umbruch nach dem Gruß, normales Leerzeichen im Namen. Heute ändert das nichts am Bild (die Zeile bricht ohnehin nach „Tag,“); lange Namen brechen dann in der zweiten Zeile, statt „Familie“ in die erste zu ziehen. `data-dna-woerter` ist der Startindex der Wort-Animation (bundle.js, Z. 36) und bleibt 6.
- **Warum:** Eine Vorlage darf Satzzeichen nicht den Daten überlassen, und der Name darf nie aus dem Bild laufen.

## 5. Wortwahl und Ton · Wirkung mittel
- **Wo:** index.html Z. 308 (Absatz Szene 4), Z. 335 (Station des Betriebs), Z. 360 (Bereit-Karte).
- **Was ist:** Sie-Form sitzt, der „du“-Hinweis für den Konfigurator ist ehrlich, Ich-Brief gegen Wir-Website ist je Zustand sauber getrennt (Hero und Kontakt wechseln gemeinsam, die Texte des Betriebs dazwischen bleiben in der dritten Person, das stimmt). Drei Stellen: „Übermittelt wird im Auftrag des Betriebs durch einen technischen Dienstleister, …“ ist Passiv ohne Subjekt, Amtsdeutsch über drei Zeilen; „Zugang“ steht in zwei Bedeutungen auf einer Seite („Freien Zugang zum Fenster“, „Team-Zugang“, „bis zu 5 Zugänge“); „… ins Postfach und ins Dashboard, dort bleibt es griffbereit“ hängt zwei Hauptsätze an ein Komma.
- **Wie:** „Ihre Anfrage übermittelt ein technischer Dienstleister im Auftrag des Betriebs, ohne Werbung und ohne andere Anbieter.“ (der Begriff bleibt, pakete.js) · Bereit-Karte: „Platz vor dem Fenster“ · Station: „bekommt das Aufmaßblatt ins Postfach und ins Dashboard, wo es griffbereit bleibt“. „Ihr Berater“ bleibt (die Person hinter den fünf Zugängen, nicht immer Petra Brandt), „griffbereit“ bleibt (Handwerkersprache, das beste Wort der Seite), „Team-Zugang“ bleibt (das Schloss erklärt ihn); nur das Fenster braucht keinen „Zugang“.
- **Warum:** Ein aktiver Satz mit Subjekt liest sich bei 16 px auf 36ch eine Zeile kürzer; ein Wort in einer Bedeutung.

## 6. Größen neben der Skala · Wirkung mittel
- **Wo:** start.css `.ez-stand__zahl` 46/300 · `.ez-stand__kopf b` 17/500, `.ez-stand__kopf` gap 5 · `.ez-stand__fuss` 13 · `.ez-meta` 15 auf 40ch (die Schwester `.ez-meta--hell` hat 14) · `.ez-zeit .dna-zahl__wert` bis 96 · `.ez-kontakt__held-text b` 250 bei 36–48 px · `.ez-weg .dna-text` 38ch · `.ez-modus button` und `.ez-schalter` 13.
- **Was ist:** Die Skala der Seite ist 12 · 14 · 16 · 18 · 22/24 · 30–40 · 44–56, Zahlen 48/300 und 64–88/200–250. 46, 17, 15, 13 und 96 liegen daneben. In der Innenkarte stimmen Rollen (Label 12/400/0,03 em, Zahl dünn, Einheit 14/400 in Grau) und Luft (12 zwischen Titel, Zahl und Satz), nur die Werte sind um ein, zwei Pixel verrutscht; der Satz darunter ist Lesetext in Chip-Größe. Die Telefonnummer trägt das Gewicht der großen Zahl (250) in der Größe der kleinen (48). Die 38ch sind eine Zeilenlänge, die es sonst nirgends gibt.
- **Wie:** `.ez-stand__zahl` 48px · `.ez-stand__kopf b` 16px/1.2 (wie die kleinen Stationen und der Betrieb in der Kontaktkarte) · `.ez-stand__kopf` gap 6px · `.ez-stand__fuss` 14px/1.45 · `.ez-meta` 14px/1.45, max-width 36ch (dann kann `.ez-meta--hell` die Größe weglassen) · `.ez-zeit .dna-zahl__wert` clamp(76px, 20vw, 88px) · `.ez-kontakt__held-text b` font-weight 300 (ein Gewicht je Stufe: 300 bei 48, 250 nur für die 5) · `.ez-weg .dna-text` 36ch · `.ez-modus button` und `.ez-schalter` 14px wie `.dna-pillen` und die Pille der Rücklauf-Leiste (passt am Telefon bis 360 px).
- **Warum:** Zwei Pixel sieht niemand als Absicht, nur als Unruhe. Eine Stufe, ein Gewicht.

## 7. Kleinstgrößen 9 und 11 px · Wirkung mittel
- **Wo:** start.css `.ez-link-etikett small` 11 (fest, auch am Schreibtisch, wo das Etikett 13 hat) · `.ez-muster--innen` 11 · `.ez-logo--klein .ez-logo__wort small` 9 · `.ez-logo__wort small` 10 unter der 21-px-Wortmarke ab 900 px.
- **Was ist:** „Ihr Link · P-2026-001“ ist die persönliche Nummer des Kunden und zugleich die kleinste Schrift der Seite, auf Glas über einem Foto. Die Wortmarke „Brandt“ 19/600 mit „FENSTERBAU · KÖLN“ 10 px gesperrt liest im Kopf als Zeichen, nicht als Text; das darf unter 12 liegen. 9 px in der Rücklauf-Leiste über bewegtem Inhalt nicht.
- **Wie:** `.ez-link-etikett small` 12px (auch am Schreibtisch, eine Stufe unter der 13 der Zeile darüber) · `.ez-muster--innen` 12px, height 22px · `.ez-logo--klein .ez-logo__wort small` 10px · ab 900 px `.ez-kopf .ez-logo__wort small` 11px, damit der Kicker mit der Marke wächst.
- **Warum:** 12 ist die Untergrenze der Seite (Urteil zur Fensterbauer-Seite); Gesperrtes in Versalien trägt 10, aber nicht 9.

## 8. Striche und geschützte Leerzeichen · Wirkung mittel
- **Wo:** index.html Z. 157, 224, 306, 355, 383 (Label-Werte), Z. 168–202 („— Foto folgt“), start.css `.ez-kontakt__daten dt::after` („ —“); Z. 429 `.ez-fuss__satz`; Z. 430 `.ez-muster--kz`; Z. 43 Muster-Leiste.
- **Was ist:** Alle elf Gedankenstriche sind Geviertstriche (U+2014); im Deutschen gilt der Halbgeviertstrich mit Leerzeichen, und bei 12 px mit 0,03 em wird der lange Strich zum Balken zwischen Grau und Weiß. Richtig sind „P-2026-001“, „0221 123456“ (DIN 5008, geschützt, nowrap), „5 Minuten“, „Schritt 1 von 4“, „Musterstraße 12, 50667 Köln“ in der Kontaktkarte, „du“ und „Weiß ich noch nicht“ in deutschen Anführungszeichen, der Mittelpunkt mit Abständen. Im Fuß steht dieselbe Anschrift ohne geschützte Leerzeichen (bei längerem Firmennamen bricht „50667 / Köln“); die zwei umbrechenden Fuß-Etiketten können vor „·“ und zwischen „5“ und „Zugänge“ brechen; die Leiste sagt „6 Fotos“, das Paket „bis zu 6“.
- **Wie:** Label-Werte `&nbsp;– vier Schritte` (U+2013, geschütztes Leerzeichen davor, damit der Strich nie eine Zeile beginnt) · Bildunterschriften „–&nbsp;Foto folgt“ · `dt::after { content: "\00a0–"; }` · Fuß „Musterstraße&nbsp;12, 50667&nbsp;Köln“ · Etiketten „… E-Mails&nbsp;·&nbsp;nur Signature“ und „bis zu 5&nbsp;Zugänge&nbsp;·&nbsp;nur Signature“ · Leiste „bis zu 6&nbsp;Fotos“.
- **Warum:** Eine Schreibweise auf der ganzen Seite; der Halbgeviertstrich ist die deutsche Form und bei 12 px die leisere.

## 9. Kartentitel-Rolle in der Konfigurator-Kachel · Wirkung klein
- **Wo:** start.css `.ez-planen__text .dna-titel-s { font-size: 22px; font-weight: 500; }` (Z. 246) und die 760-px-Regel (Z. 258, nur Größe).
- **Was ist:** Ab 760 px steht „Alles, was Sie planen.“ in 24/500, die Nachbarn „Fotos“, „Messen“, „Wünsche“, „Senden“ und „Unsicher? …“ in 24/600 (Regel: Kartentitel 24/600). Im Ausschnitt sichtbar leichter.
- **Wie:** Z. 246 auf `font-size: 22px` kürzen, das Gewicht kommt aus `.ez .dna-titel-s`; Z. 258 bleibt.
- **Warum:** Eine Rolle, ein Gewicht. Das Rendering bleibt das schwere Element der Kachel durch Größe und Licht, nicht durch einen leiseren Titel.

## 10. Luft vor der Pille in der Bereit-Karte · Wirkung klein
- **Wo:** start.css `.ez-bereit__karte > .dna-pille { margin-top: 12px }`, `.ez-dinge { margin: 8px 0 12px }`, `.ez-handy { margin: -2px 0 4px }`.
- **Was ist:** Text→Handlung ist am Schreibtisch 28 px (4 + 12 + 12), am Telefon 36 px (12 + 12 + 12); im Hero sind es 32 (12 + 20), die Regel sagt 32.
- **Wie:** `.ez-bereit__karte > .dna-pille { margin-top: 16px }`, `.ez-dinge { margin: 8px 0 4px }`: dann 32 in beiden Breiten.
- **Warum:** Die Luft vor der Handlung ist die auffälligste Luft der Seite; sie soll auf beiden Geräten und in beiden Karten gleich sein.

**Was gut ist:** Die Rollen sitzen (Labels 12/400/0,03 em, Titel 600 mit zweiter Stimme, Lesetext 16 in tinte-2 auf 36ch, Zahlen dünn mit kleiner Einheit, 6/12/32 fast überall), und der Einladungs-Hero trägt mit dem Namen als dem einen schweren Element. Die Wortmarke „Brandt“ mit gesperrtem Kicker liest als Zeichen, die Nummer 0221 123456 als Held, beides richtig geschrieben. „griffbereit“, „Offen lassen geht auch“ und der ehrliche „du“-Hinweis sind der Ton eines Betriebs, nicht einer Software.

**Die drei Befunde, die am meisten bringen:** 1. Kicker „Persönliche Einladung von Fensterbau Brandt“ (ein Wort je Sache). 2. Hero-Spalte entdoppeln: Schlussformel aus dem Text, Unterschrift „Geschäftsführung“, Meta in beiden Zuständen mit „Kostenlos und unverbindlich.“ 3. Doppelte Aussagen zwischen den Bausteinen: Label-Werte, Haken-Liste, Innenkarte, Einleitung Szene 3.

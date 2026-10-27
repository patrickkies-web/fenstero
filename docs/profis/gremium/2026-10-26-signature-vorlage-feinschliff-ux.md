# Feinschliff UX (Lena Hartwig): Vorlage EEZI Signature

Geprüft am 26.10.2026, etwa zehn Minuten, Telefon 390 × 844 und Schreibtisch 1280 × 800, beide Zustände (Website, Einladungslink), Muster-Ebene an und aus. Quellen: docs/profis/signature-vorschau/index.html, start.css, start.js. Maßstab: Familie Weber (71, Telefon, kein Konto, hat den Link per Nachricht bekommen) und der Fensterbauer, der die Vorlage als Muster anschaut.

Gesamteindruck: Der Einstieg ist deutlich besser als in der Fassung vom Vormittag: der Skip-Link springt auf den Hero-Text, die zurückkehrende Leiste ist aus dem Zugänglichkeitsbaum genommen, der Fokus wird unter dem Vorhang hervorgeholt, Ziele sind 44 px, die Kontraste der Palette halten (Silbergrau auf Anthrazit 6,6:1, auf Schwarz 8,1:1, auf der hellsten Kachelstelle 4,9:1, Textgrau auf Weiß 5,6:1). Was fehlt, liegt fast ganz in den Wörtern, die Signature neu auf die Seite bringt („Dashboard“, „technischer Dienstleister“, „Team-Zugang“, „Ihr Berater sieht …“), in der Innenkarte, die wie ein echter Stand aussieht, und in zwei Stellen der Muster-Leiste, die am Telefon nur ein Eingeweihter versteht. Zwei Punkte aus dem Urteil zur Fensterbauer-Seite (DOM-Reihenfolge der Bühne, Landmarken im main) sind in diese Vorlage mitgewandert.

## Befunde, nach Wirkung geordnet

1. **Innenkarte „In Bearbeitung · 2 von 4 Fenstern“ liest sich wie ein echter Stand** (hoch, Kunde und Vorleser)
   · Wo: index.html, Szene 4, `span.ez-stand` mit `role="img"` und `aria-label`.
   · Was: Sichtbar steht nirgends „Beispiel“. Familie Weber hat noch nichts begonnen und sieht „In Bearbeitung, 2 von 4 Fenstern“: Ist das meins? Sieht jemand fremde Daten? Für Vorleser verschluckt `role="img"` den ganzen Inhalt, auch den beruhigenden Satz „Maße und Fotos erst nach dem Senden“; das `aria-label` nennt ihn nicht. Der Satz selbst beunruhigt eher: „Ihr Berater“ ist eine neue, namenlose Person (unterschrieben hat Petra Brandt), „sieht, wie weit Sie sind“ ohne „nur“ klingt nach Zuschauen, „wenn Sie hängen“ ist salopp.
   · Wie: `role="img"` und `aria-label` weg, stattdessen `role="group" aria-label="Beispiel: so sieht es Fensterbau Brandt"`, die Kapselreihe `aria-hidden="true"`, ein sichtbares „Beispiel“ wie in der Karte „Weiß ich noch nicht“, und der Satz neu:
   ```html
   <span class="ez-stand" role="group" aria-label="Beispiel: so sieht es Fensterbau Brandt">
     <span class="ez-stand__kopf"><small>Was Fensterbau Brandt sieht</small><b>In Bearbeitung <span class="ez-beispiel">Beispiel</span></b></span>
     <span class="ez-stand__wert"><span class="ez-stand__zahl">2<small>von 4 Fenstern</small></span><span class="ez-kapseln" aria-hidden="true">…</span></span>
     <span class="ez-stand__fuss">Fensterbau Brandt sieht nur, wie weit Sie sind, und hilft, wenn Sie nicht weiterkommen. Ihre Maße und Fotos bleiben bis zum Senden bei Ihnen.</span>
   </span>
   ```
   CSS: `.ez-stand .ez-beispiel { margin-left: 8px; color: var(--silbergrau); font: 400 12px/1 var(--font-sans); vertical-align: middle; }`
   · Warum: Senioren nehmen eine Zahl in einer schwarzen Karte für bare Münze; Vorleser-Nutzer hören sonst nur „Bild“. Das „nur“ und „bei Ihnen“ sind die zwei Wörter, die aus Beobachtung Fürsorge machen.

2. **„Dashboard“ und „technischer Dienstleister“ im Kundentext** (hoch, die 71-Jährige)
   · Wo: index.html, Szene 4: Absatz unter „Ihre Anfrage geht nur an Fensterbau Brandt“; `.ez-stand__kopf small` („Im Dashboard von Fensterbau Brandt“); Station „bekommt das Aufmaßblatt ins Postfach und ins Dashboard“; „Nachmessen vor Ort … mit Ihren Unterlagen aus dem Dashboard“.
   · Was: „Dashboard“ kennt Familie Weber nicht (dreimal im Kundentext; der Fensterbauer sieht das Wort ohnehin in der Muster-Leiste und den Etiketten). Der Datensatz ist passiv und widerspricht sich für Laien: Überschrift „nur an Fensterbau Brandt“, dann „durch einen technischen Dienstleister“, dann „nicht bei Dritten“. Wer ist der Dienstleister, wenn nicht ein Dritter?
   · Wie: Datentext: „Bevor Sie senden, sieht Fensterbau Brandt Ihre Maße und Fotos nicht, nur wie weit Sie sind. Die Technik dafür stellt ein Dienstleister im Auftrag von Fensterbau Brandt, mehr nicht: keine Werbung, keine anderen Anbieter. Ihre Unterlagen liegen danach bei Fensterbau Brandt, bei niemandem sonst.“ Innenkarte: „Was Fensterbau Brandt sieht“ (siehe 1). Station: „bekommt das Aufmaßblatt ins Postfach und in seine Ablage, dort bleibt es griffbereit“. Nachmessen: „mit Ihren Unterlagen aus der Anfrage“. „Dashboard“ bleibt in Muster-Leiste, Etiketten und Toast (Sprache des Fensterbauers).
   · Warum: Ein unbekanntes Wort an der Stelle, an der es um Vertrauen geht, lässt Senioren aufhören zu lesen; Aktivsatz mit „stellt die Technik“ erklärt den Dienstleister, ohne ihn zu leugnen (pakete.js verlangt nur die Kategorie, nicht das Wort „technisch“).

3. **Einladungszustand: Kicker, Meta-Zeile und Nummer sprechen Systemsprache** (hoch, Familie Weber)
   · Wo: index.html, `.ez-kicker.ez-nur-einladung`, `.ez-meta.ez-nur-einladung`, `.ez-link-etikett small`.
   · Was: „Persönliche Anfrage von Fensterbau Brandt“: Wer fragt hier wen an? Auf der Seite heißt „Anfrage“ sonst die Anfrage des Kunden. „Darüber kommen Sie jederzeit zurück“: worüber, und wie? Die Seite sagt nicht, dass der Link in der Nachricht bleibt und kein Passwort nötig ist; Senioren erwarten bei „persönlicher Link“ ein Konto. „P-2026-001“ ohne Wort davor sieht aus wie ein Kennwort, das man sich merken muss.
   · Wie: Kicker: „Persönliche Einladung von Fensterbau Brandt“. Meta: `<b>Ihr persönlicher Link, kein Passwort nötig.</b> Später einfach wieder antippen, Ihre Planung ist noch da, auch auf einem anderen Gerät. Etwa 5 Minuten je Fenster, kostenlos und unverbindlich.` Etikett: `<small>Ihr Link · Vorgang P-2026-001</small>` (das `aria-hidden` am Etikett bleibt, die h1 begrüßt bereits).
   · Warum: „Einladung“ ist das Wort, das auch die Nachricht trägt, mit der der Link kam; „kein Passwort nötig“ nimmt die größte Sorge der Altersgruppe; „Vorgang“ sagt, was die Nummer ist, falls sie am Telefon genannt werden soll.

4. **Die eine Pille liegt im Einladungszustand auf echten Telefonen unter der Falz** (mittel bis hoch, Kunde am Telefon)
   · Wo: start.css Zeile 146 (`.ez-buehne { aspect-ratio: 10 / 7 }` bis 899 px), Zeile 120 (`.ez-hero { gap: var(--raum-4) }`).
   · Was: Gemessen ohne Muster-Leiste (die der Kunde nie sieht) sitzt „Fenster planen“ bei 614–665 px (Website) und 638–689 px (Einladung). Ein iPhone mit sichtbaren Safari-Leisten hat 664 px Höhe: im Einladungszustand ist die Pille um 25 px abgeschnitten, im Website-Zustand berührt sie die Kante. Die Reihenfolge Bühne vor Text ist am Telefon in Ordnung (die Überschrift steht bei 365 px, das Foto ist der Anker „das ist der Betrieb“), aber sie kostet 250 px.
   · Wie: `@media (max-width: 899px) { .ez-buehne { aspect-ratio: 16 / 10; } .ez-hero { gap: var(--raum-3); } }` (31 px gewonnen); danach prüfen, ob das Gerät mit `--gy: 12%` noch ganz im Bild liegt; reicht es nicht, Petras Brief in der Vorlage auf drei Zeilen: „Für Ihr Angebot brauche ich die Maße Ihrer Fenster. Messen Sie in Ruhe selbst, ich erkläre jeden Schritt. Danach melde ich mich.“
   · Warum: Senioren scrollen nicht, wenn ein Bildschirm fertig aussieht; die Signature-Einladung ist genau der Weg, auf dem die Pille ohne Scrollen sichtbar sein muss.

5. **Vorleser hören die Bühne vor der Begrüßung, Landmarken liegen im main** (mittel, Screenreader; aus dem Urteil zur Fensterbauer-Seite nicht übernommen)
   · Wo: index.html `.ez-hero` (figure vor `#inhalt`), `.ez-adresse` (nicht `aria-hidden`), `header role="banner"` und `footer role="contentinfo"` innerhalb von `main`.
   · Was: Reihenfolge im Baum: „Fensterbau Brandt, zum Seitenanfang“, „anrufen“, dann „fensterbau-brandt .de“, dann die figcaption (Domain ein zweites Mal), erst dann Kicker und h1. Am Schreibtisch widerspricht das auch der sichtbaren Ordnung (Text links). Banner und Contentinfo als Nachfahren von main sind keine Seiten-Landmarken.
   · Wie: `.ez-hero__text` im Markup vor `.ez-hero__buehne` stellen; die `order`-Regeln (Zeilen 121, 123, 127–128) bleiben und liefern am Telefon weiter Bühne oben. `.ez-adresse` bekommt `aria-hidden="true"` (die Domain steht schon in der figcaption). `role="banner"` und `role="contentinfo"` entfernen; die Linkliste im Fuß als `<nav aria-label="Impressum und Datenschutz">`.
   · Warum: Die Begrüßung „Guten Tag, Familie Weber“ ist der Grund der Seite; sie sollte das Erste sein, was ein Vorleser nach dem Kopf sagt. Zwei h1 im Markup sind in Ordnung: die jeweils andere ist `display: none` und damit aus dem Baum.

6. **Umschalter „Website | Einladung“: zwei Druckknöpfe statt einer Wahl, am Telefon ohne Kontext** (mittel, Fensterbauer, Tastatur und Vorleser)
   · Wo: index.html `.ez-modus` (`role="group"`, zwei `button aria-pressed`), start.css 452–453 (`.ez-ab-desk { display: none }`), 96, start.js `setzeModus`.
   · Was: `aria-pressed` sind zwei unabhängige Schalter; ein Vorleser hört „Website, Umschalter, gedrückt“ und „Einladung, nicht gedrückt“, und dass das eine das andere löst, sagt niemand; Pfeiltasten fehlen. Tabs wären falsch (es gibt kein Panel, die ganze Seite wechselt), Radio ist die richtige Form. Am Telefon fällt mit `display: none` auch für Vorleser „Über die“ und „Mit … slink“ weg, es bleibt „Website“ und „Einladung“; sehend liest ein Fensterbauer „Website“ als Link zur Website, denn links steht nur „Muster“.
   · Wie: echte Radios, Zustand über `change`:
   ```html
   <fieldset class="dna-pillen ez-modus">
     <legend class="ez-unsichtbar">So kommt Ihr Kunde auf diese Seite</legend>
     <label><input type="radio" name="modus" value="website" checked><span class="ez-modus__text"><span class="ez-ab-desk">Über die </span>Website</span></label>
     <label><input type="radio" name="modus" value="einladung"><span class="ez-modus__text"><span class="ez-ab-desk">Mit </span>Einladung<span class="ez-ab-desk">slink</span></span></label>
   </fieldset>
   ```
   CSS: `.ez-modus input { position: absolute; opacity: 0; width: 1px; height: 1px; }`, `.ez-modus label:has(:checked) { background: var(--weiss); color: var(--schwarz); }`, `.ez-modus label:has(:focus-visible) { outline: 2px solid var(--fokus); outline-offset: 2px; }` (oder Klasse `ist-wahl` per Skript). `.ez-ab-desk` am Telefon nicht `display: none`, sondern visuell versteckt (die Regeln von `.ez-unsichtbar`), damit „Über die Website“ hörbar bleibt. Unter „Muster“ am Telefon eine zweite Zeile `<span class="ez-nur-tel-text">Weg des Kunden</span>` (12 px Silbergrau, Ausnahme zu Zeile 96).
   · Warum: Radios bringen „eins von zwei“, Pfeiltasten und den Gruppennamen ohne Skript mit; „Weg des Kunden“ sagt am Telefon, dass hier kein Menü ist.

7. **Der runde Schalter ohne Text am Telefon sieht aus wie eine dritte, verwaiste Option** (mittel, Fensterbauer am Telefon)
   · Wo: index.html `#muster-schalter`, start.css 103–107 und 465–469.
   · Was: Ein 44-px-Ring mit hohlem 10-px-Punkt, direkt neben den hohlen 8-px-Punkten des Umschalters, in derselben Zeichensprache (Ring, gefüllt wird Koralle). Nichts sagt „Etiketten“; aktiv wird er zum Koralle-Punkt, das wirkt wie „ausgewählt“, nicht wie „zeigt an“. Für Vorleser ist alles da (Text plus „Ihre Kunden sehen diese Etiketten nicht“), sehend fehlt der Hinweis.
   · Wie: am Telefon ein Etikett-Zeichen statt des Punkts, der Koralle-Punkt als kleine Marke oben rechts, wenn an:
   ```html
   <svg class="ez-schalter__zeichen" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 3h7l7 7-7 7-7-7z"/><circle cx="7" cy="7" r="1.3" fill="currentColor"/></svg>
   ```
   CSS ≤ 759 px: `.ez-schalter { position: relative; } .ez-schalter__zeichen { width: 20px; height: 20px; } .ez-schalter__punkt { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; }`; ab 760 px bleibt der Punkt vor dem Text wie jetzt. Alternative, wenn ein Wort gewünscht ist: „Ihres“ mit Punkt (74 px, passt ab 390 px Breite).
   · Warum: Gleiche Form heißt gleiche Bedeutung; ein Zeichen, das nicht wie ein Radio aussieht, trennt „Zustand wählen“ von „Etiketten einblenden“.

8. **„Team-Zugang“ im Fuß verwirrt Kunden** (mittel, Kunde)
   · Wo: index.html `.ez-fuss__team` (Link mit Schloss), Muster-Etikett im Fuß, start.js Toast-Text `ziel.dashboard`.
   · Was: Neben Impressum, Datenschutz und Domain steht ein Schloss-Link „Team-Zugang“. Familie Weber liest: Gibt es doch einen Zugang? Brauche ich einen? „Team“ ist das Wort des Betriebs für sich selbst, nicht das des Kunden. Im Muster-Etikett ist das Wort richtig (Fensterbauer-Sprache).
   · Wie: `<a href="#" data-vorlage="ziel.dashboard" aria-label="Anmeldung für Mitarbeiter von Fensterbau Brandt">[Schloss] Anmeldung für Mitarbeiter</a>`; Etikett: „Anmeldung für Ihr Team: Dashboard unter Ihrer Domain, bis zu 5 Zugänge · nur Signature“; Toast: „Muster: Hier öffnet sich später Ihr Dashboard unter Ihrer Domain.“ Am Schreibtisch bleibt der Link rechts außen (jetzt schon), am Telefon in eigener Zeile (jetzt schon).
   · Warum: „für Mitarbeiter“ sagt dem Kunden „nicht für mich“ und dem Fensterbauer „das ist der Zugang meines Teams“; die Seite verspricht „ohne Konto“, ein Login-Link muss das nicht in Frage stellen.

9. **Toast: ein Text für alle Knöpfe, zu kurz, Entwicklersprache** (klein bis mittel, Fensterbauer)
   · Wo: start.js Block „Knöpfe ohne Ziel“, start.css `.ez-toast`.
   · Was: Jedes `a[href="#"]` meldet „Das Ziel setzt der Betrieb. Im echten Konfigurator geht es hier weiter.“ Auf der Telefonnummer (Held der Kontaktkarte, runder Knopf im Kopf), auf Anfahrt, Website, Impressum und Datenschutz ist das falsch. 1,8 s für 90 Zeichen in 13 px reicht einem langsamen Leser nicht (etwa 6 s nötig). „Das Ziel setzt der Betrieb“ spricht über den Leser statt zu ihm (die Leiste sagt „Ihr Logo, Ihre Farbe“).
   · Wie:
   ```js
   var texte = {
     'ziel.konfigurator': 'Muster: Hier startet später Ihr Konfigurator.',
     'ziel.dashboard': 'Muster: Hier öffnet sich später Ihr Dashboard unter Ihrer Domain.',
     'firma.telefon': 'Muster: Hier wählt das Telefon Ihre Nummer.',
     'firma.karte': 'Muster: Hier öffnet sich die Anfahrt zu Ihnen in der Karten-App.',
     'firma.website': 'Muster: Hier geht es zu Ihrer Website.',
     'recht.impressum': 'Muster: Hier liegt Ihr Impressum.',
     'recht.datenschutz': 'Muster: Hier liegt Ihre Datenschutzerklärung.'
   };
   toast.textContent = texte[a.getAttribute('data-vorlage')] || 'Muster: Dieses Ziel setzen Sie beim Einrichten.';
   toastUhr = setTimeout(function () { toast.classList.remove('ist-da'); }, 4000);
   ```
   CSS: `.ez-toast { font-size: 14px; }`. `role="status"` mit `aria-live="polite"` bleibt richtig.
   · Warum: Die Vorlage soll dem Fensterbauer zeigen, was seine Seite kann; eine falsche Rückmeldung auf der Telefonnummer sät Zweifel an der ganzen Vorlage.

10. **Kleindruck dort, wo der Text etwas sagt** (klein, die 71-Jährige; Kontraste sind in Ordnung)
    · Wo: start.css: `.ez-link-etikett small` 11 px (481), `.ez-muster--innen` 11 px (516), Kicker über `.dna-label` 12 px, `.ez-stand__kopf small` 12 px (491), `.ez-kontakt__wege a` 12 px (431, „E-Mail / Anfahrt / Website“ unter 52-px-Knöpfen), `.ez-reihe li` 12 px am Telefon (268, Elementnamen), `.ez-kontakt__held-text small` 12 px (420, „Telefon“).
    · Was: Die Farben halten (Silbergrau/Anthrazit 6,6:1, Silbergrau/Schwarz 8,1:1, Textgrau/Weiß 5,6:1, Koralle nur auf Dunkel 6,8:1; Ringe und Linien bei 1,7–2,4:1 sind Zierde ohne Information). Die Größe ist das Problem: 11 und 12 px Silbergrau auf Dunkel sind für 71-Jährige am Telefon die Grenze, und die genannten Stellen tragen Botschaften („Persönliche Einladung von Fensterbau Brandt“, „Ihr Link · Vorgang …“, „Was Fensterbau Brandt sieht“, die Elementnamen).
    · Wie: `.ez-kicker { font-size: 13px; }`, `.ez-link-etikett small, .ez-muster--innen { font-size: 12px; }`, `.ez-stand__kopf small, .ez-kontakt__wege a, .ez-kontakt__held-text small { font-size: 13px; }`, `@media (max-width: 759px) { .ez-reihe li { font-size: 13px; } }`. Glas-Chips („Foto 1 von 2“), Muster-Etiketten und das 10-px-„FENSTERBAU · KÖLN“ im Logo dürfen bleiben (Zierde, Fensterbauer am Schreibtisch, `aria-hidden`).
    · Warum: Die DNA erlaubt 12 px für Labels; sobald ein Label ein Satz mit Inhalt ist, ist es keins mehr. Ein Punkt mehr kostet keinen Umbruch an diesen Stellen.

## Was gut ist
Skip-Link auf `#inhalt` mit `tabindex="-1"`, Fokus unter dem Vorhang in die Mitte geholt, zurückkehrende Leiste `aria-hidden` mit `tabindex="-1"`, alles ab 44 px, Fokusring auf dem Umschalter: der Tastaturweg stimmt. Die Ich-Form von Petra Brandt, „ohne Konto“, „Oder Sie antworten einfach auf die Nachricht, mit der dieser Link kam“ und die Telefonnummer als Held sind genau die Sprache, die Senioren brauchen. Die versteckten Zusätze („… Ihre Kunden sehen diese Etiketten nicht“, Gruppenname „So kommt Ihr Kunde auf diese Seite“, figcaption der Bühne) zeigen, dass an Vorleser gedacht wurde.

## Die drei, die am meisten bringen
1 (sichtbares „Beispiel“ und der neue Satz in der Innenkarte), 2 mit 3 (die Wörter: „Dashboard“, „Dienstleister“, „Einladung“ statt „Anfrage“, „kein Passwort nötig“), 4 (die Pille im Einladungszustand über die Falz).

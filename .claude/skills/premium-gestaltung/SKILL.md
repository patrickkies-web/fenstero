---
name: premium-gestaltung
description: Vorstellungen und Mindestanforderungen des Inhabers für alles Sichtbare an eeziframes (Website, Verkaufsseite für Fensterbauer, Startseite, App, Bilder, Animationen). Immer laden, bevor ein Abschnitt, ein Element, eine Animation, ein Layout oder ein Bild gebaut oder geändert wird, und sobald der Inhaber ein Element beschreibt („ich hätte gerne …“, „hochwertiger“, „schöner“, „wie auf anderen Seiten“, „fokus auf Mobilgeräte“).
---

# Premium-Gestaltung: Vorstellungen und Mindestanforderungen des Inhabers

Dieser Skill hält fest, was der Inhaber von jedem sichtbaren Element erwartet. Er gilt zusätzlich zu den Markenregeln in
docs/GESTALTUNG.md (Farben, Schrift, Größen, Bewegung), die dort verbindlich stehen. Seine Auftragsvorlage je Element steht in
vorlage.md neben dieser Datei; fehlt in einem Auftrag ein Feld, sinnvoll annehmen und die Annahme im Ergebnis nennen.

**Wie es aussehen soll, steht in designrichtung.md neben dieser Datei: vor jedem sichtbaren Element lesen.** Kurz: ruhig wie Apple,
präzise wie ein Aufmaß, mit Licht und Tiefe wie in einer Raumstation; erst verstehen, dann erleben; eigene Zeichen vor Trends; ein
Held je Bildschirm, echtes Material, Licht nur mit Quelle. Die Analyse seiner 21 Vorbilder steht in vorbilder.md, die zwölf Rollen und
die Jury, die fertige Seiten bewertet, in rollen.md.

## 1. Grundhaltung

- **Inhalt aus seinen Worten, Aussehen aus der Richtung.** Was ein Element zeigt und wo es steht, sagt er; wie es aussieht, bestimmt
  designrichtung.md, auch wenn er es nicht eigens beschreibt. „Du weißt ja noch gar nicht, was ich will“ hieß: Er erwartet diesen Stil
  von selbst.
- **Bauen, was er beschreibt.** Nicht umdeuten, keine eigenen Abschnitte oder Inhalte erfinden. „Nicht zu viel interpretieren“ ist
  wörtlich gemeint. Was er nicht erwähnt, bleibt, wie es ist.
- **Die Absicht verstehen.** Wozu ist das Element da? Auf der Seite für Fensterbauer soll ein Fensterbauer kaufen. Das Produkt ist ein
  hochwertiger Fenster-Konfigurator unter seiner eigenen Marke und Domain, den er in drei Paketen in seine Seite bringt. Nicht die
  Hauptaussage: „Kunden messen selbst“. Kein Thema mehr: eine Plattform, auf der Kunden bei eeziframes Projekte anlegen.
- **Verbesserungen gleich mitnehmen.** Offensichtliches (Überdeckungen, Lesbarkeit, Abstände, Ehrlichkeit) direkt umsetzen und am Ende
  unter „selbst entschieden“ nennen. Größere eigene Ideen erst vorschlagen, nicht bauen.
- **Mobil zuerst.** Telefon 390 × 844 ist die Hauptansicht, danach Schreibtisch 1280 und 1024. Am Schreibtisch nichts überdimensionieren.
- **Bild statt Text.** Kurze Abschnitte, wenige Wörter, visuelle Träger. Nie wie ein Ratgeber oder Blogbeitrag: auf Verkaufsflächen kein
  Inhaltsverzeichnis mit Lesezeit, keine langen Absätze.
- **Tempo.** Kurze Wege. Kleine Änderungen (Text, Abstand, Farbe) sofort ändern und zeigen, ohne lange Durchsichten oder Testläufe
  dazwischen. Die volle Prüfung läuft einmal, bevor etwas online geht. Keine Wartezeiten ohne sichtbares Zwischenergebnis.
- **Stopp heißt stopp.** Bei „Stopp“, „Pause“ oder „hör auf“ sofort alles anhalten, auch Hintergrundaufgaben und Hilfsagenten, und den
  Stand in drei Zeilen melden.

## 2. Was „hochwertig“ für ihn heißt

Seine Messlatte: Ein Fensterbauer soll an der Seite merken, dass eeziframes Webdesign und Digitales beherrscht. Alles, was wirkt wie
„Technik von 2015“ oder ein Baukasten-Muster, ist durchgefallen.

- **Echtes Material statt Symbole.** Plastische Bilder, Renderings aus dem eigenen Konfigurator, Fotos und Videos des Inhabers. Flache
  Strichsymbole nur als Nebensache.
- **Bewegung mit Tiefe und Physik.** Trägheit und Federn statt linearem Gleiten, Reaktion auf die Scrollgeschwindigkeit, Ebenen in
  verschiedener Tiefe, Unschärfe zum Rand, Licht. Ein Laufband, das nur gleichmäßig durchläuft, reicht nicht.
- **Bewegung mit Sinn.** Elemente erzählen etwas, gehen in den nächsten Abschnitt über oder reagieren auf den Besucher. Keine Effekte als
  Selbstzweck, nichts, was „billig von links nach rechts geschoben“ wirkt.
- **Detailreichtum.** Mikrodetails in den Farben der Marke: Schatten, Ränder, Glanz, Übergänge, ausgefallene Anzeigen.
- **Fein, nicht laut.** Weiche Kurven, ruhige Geschwindigkeiten; nichts blinkt, ruckelt oder springt.
- **Ehrlich.** Keine erfundenen Belege, Kundenzahlen, Bewertungen, Siegel oder Testimonials. „Beliebt“ nur mit Kunden, sonst „Empfohlen“.
- **Zum Ziel hin.** Auf Verkaufsflächen führt jedes Element zum Kauf: Pakete sichtbar machen, zum höheren Paket hinführen, nächste
  Handlung klar.

## 3. Technik

- **Zwei Stufen, je Element bewusst wählen und im Ergebnis nennen.**
  1. Leicht: CSS und schlankes JavaScript, nur transform und opacity animieren.
  2. Premium: Grafikchip (WebGL, 3-D, Shader), wenn Tiefe, Licht oder Verzerrung den Unterschied machen. Immer mit einfacher
     Ersatzfassung für schwache Geräte.
  Wünscht er „high end“ oder vergleicht er mit modernen Seiten, ist Stufe 2 der Standard.
- **Keine fremden Server.** Die CSP (functions/seo.js) erlaubt nur die eigene Herkunft. Bibliotheken liegen mit Lizenzdatei in web/vendor/.
- **Flüssig auf einem mittleren Android-Telefon.** Schleifen laufen nur, solange das Element im Bild ist.
- **Ruhige Fassung.** Jede Bewegung hat eine Fassung für „weniger Bewegung“; ohne JavaScript bleibt alles lesbar und bedienbar.
- **Einbettung.** Die Verkaufsseite steht auch auf der Startseite in der Ansicht „Fensterbauer“ (/#fensterbauer, portal.js lädt sie nach
  und ruft Verkauf.auf auf). Jedes Element muss dort genauso funktionieren, auch nach einem Neuaufbau.

## 4. Markenregeln in Kürze (verbindlich: docs/GESTALTUNG.md)

- Dunkle Bühne, Karten mit 2-px-Rand, Cream für die Hauptaktion, Grün als Signal: Kicker, Haken, genau ein Wort je Überschrift.
- Schrift Inter. Schriftgrößen nur 13, 15, 17, 24 und 40, am Telefon 32 statt 40. Die Prüfsuite lässt nichts anderes durch, auch nicht
  in ausgeblendeten Elementen (Knöpfe erben sonst 13,33 px).
- Eine Cream-Pille je Bildschirm. Ziele ab 44 px. Kein Querscrollen. Paketnamen in Versalien wie vorgegeben („EEZI Essential“).

## 5. Ablauf je Element

1. In einer Zeile sagen, was jetzt gebaut wird und welcher Baustein der Designrichtung (Abschnitt 4 dort) es trägt.
2. Material prüfen. Fehlt ein Bild oder Video, genau sagen, was gebraucht wird (Abschnitt 7), und bis dahin einen Platzhalter bauen,
   der den Effekt schon zeigt.
3. Bei ambitionierten Elementen zwei bis drei Varianten als kurze Videos bauen; er wählt, danach nur noch Feinschliff.
4. Bauen, dann selbst prüfen: Bilder bei 390 und 1280, bei Bewegung ein Telefon-Video (Abschnitt 8), Checkliste (Abschnitt 6). Neue
   Elemente zusätzlich aus den passenden Rollen in rollen.md (Abschnitt 2 dort), neue Vorbilder aus allen.
5. Liefern: Video und Bilder schicken, dann drei kurze Listen: gebaut, selbst entschieden, brauche ich von dir.
6. Einchecken auf dem Arbeitszweig. Online (main) nur auf seinen ausdrücklichen Wunsch, danach den Cloudflare-Build prüfen.

## 6. Checkliste vor dem Zeigen

- Wirkt es hochwertig und heutig, nicht wie ein Baukasten-Muster? Hält es die Prüfpunkte der Designrichtung (Abschnitt 6 dort)?
- Telefon: Steht das Wichtige zusammen auf einem Bildschirm? Ist es mit dem Daumen bedienbar?
- Verdeckt nichts das Hauptmotiv (Gesichter, Hauptobjekt, Details im Bild wie Papierflieger)?
- Läuft die Bewegung flüssig und weich, und ist die ruhige Fassung vollständig?
- Marke: Farben, Schriftgrößen, eine Cream-Pille, ein grünes Wort?
- Sind die Texte kurz und ist die Hauptaussage klar?
- Einbettung auf der Startseite, ohne JavaScript und bei „weniger Bewegung“ geprüft?

## 7. Material beim Inhaber anfragen

Er erzeugt Bilder mit Flux und Videos mit Kling und lädt sie im Chat hoch. Anfragen immer mit: Zweck, Format und Pixelmaß, Freistellung
(PNG mit Transparenz oder direkt vor #161616, nicht vor Grün), Licht von rechts oben mit 4800 bis 5800 K, Kamera und Makrotextur nach
designrichtung.md 3.4 (dort auch Prompt-Bausteine; „golden hour“ macht die Bilder orange), was nicht drin sein darf (Text,
Wasserzeichen). Gelieferte Bilder vor dem Einbau mit bildlicht.py messen. Bei Videos zusätzlich: Länge, nahtlose Schleife (Start-
und Endbild gleich), Kamera still, ruhige Bewegung, und ein Prompt auf Englisch zum Kopieren. Hochgeladene Dateien liegen unter
/root/.claude/uploads/<Sitzung>/; kommt ein angekündigtes Bild nicht an, das sofort sagen.

## 8. Werkzeuge im Projekt

- Vorschau-Server: `KI_ATTRAPPE=1 PORT=8788 node scripts/dev-server.mjs` im Hintergrund, Abrufe mit `curl --noproxy '*'`. Nach Änderungen
  unter functions/ neu starten, er hält die Module im Speicher.
- Prozesse nie mit einem Suchmuster beenden, das im selben Befehl steht; der Befehl beendet sich sonst selbst. Erst die Nummern
  ermitteln, dann beenden.
- Bausteine der Verkaufsseite: functions/pakete-seite.js ändern, danach `node scripts/bedingungen-pdf.mjs`. Kopf und Fuß der Ratgeber und
  der Seiten für Fensterbauer: `node scripts/ratgeber-bausteine.mjs`.
- Bilder und Videos: Playwright aus /opt/node-tools, Chromium unter /opt/pw-browsers/chromium (kein „playwright install“). Telefon-Video:
  Chromium mit `--force-device-scale-factor=2` starten, Kontext 390 × 844 ohne `deviceScaleFactor`, recordVideo 780 × 1688, dann
  `ffmpeg … -c:v libx264 -pix_fmt yuv420p -movflags +faststart` zu MP4. Mit `deviceScaleFactor` im Kontext liegt die Seite nur im linken
  oberen Viertel des Videos. Bildschirmfotos über 16.384 Pixel Höhe bleiben unten weiß: Bildschirm für Bildschirm aufnehmen. Der Browser
  rechnet ohne Grafikchip: Wie flüssig es sich anfühlt, entscheidet der Test des Inhabers am eigenen Telefon.
- Prüfsuite: `NUR=… PW_PFAD=/opt/node-tools node scripts/pruefen.mjs`. Verkaufsseite: Abschnitte 2, 6, 10, 29, 30. Fenstermodell der App:
  20 und 22.
- Messen: `python3 -I .claude/skills/premium-gestaltung/farbanteil.py bild.png` (Farb- und Lichtanteile eines Bildschirmfotos) und
  `python3 -I .claude/skills/premium-gestaltung/bildlicht.py bild.webp` (Schwarz, Lichtfarbe, Schatten und Clipping eines Bildes).
- Doku nachziehen: docs/GESTALTUNG.md für die Gestaltung, docs/BILDER.md für Bildplätze.

## 9. Was er bisher gesagt hat

- **Mag:** das Startbild der Fensterbauer-Seite mit Foto, eingeblendeten Benachrichtigungen und Haken-Chips unter der Überschrift; die
  Astronauten-Bildwelt; Leisten wie die Partner-Logoleisten anderer Seiten, aber hochwertig ausgearbeitet; Pakete am Telefon zum Wischen
  mit einem Beispielbild darunter, das sichtbar mitwischt; Lamellen und Fenstermodell mit viel Realismus.
- **Vorbilder (23.10.2026):** „Apple-ähnlich“. Erste Runde: Dropbox Dash × McLaren, textura.eu, KAGE (kryntixstudio), Axle
  (viktoroddy), ein KI-Dashboard (juicelab), DE</HELPERS (seanaiux) und die Skills „Motion Design“ und „Design DNA“. Zweite Runde: Liquid
  Glass (Figma), Dentora und Velour, eine Fahrdienst-App, Freshify, POUR/PLAY, Bluebird, lightup, eine Samurai-Parallaxe (Webflow,
  Lottie), happy lemon, Dahlia und Ciao Energy (WebGL), mit dem Auftrag, alle mehrfach aus unterschiedlichen Rollen zu vergleichen und
  die Gemeinsamkeiten in den Skill zu nehmen; danach alle noch einmal auf Proportionen, Kontraste, Schriften und Animationen, mit
  weiteren Rollen. Ausgewertet in vorbilder.md, die Regeln daraus in designrichtung.md.
- **Mag nicht:** das Bewegtbild Handy zu Briefumschlag; die Unterschrift „Vom Foto zum Aufmaßblatt, so sieht es Ihr Kunde.“; lange Texte
  und Inhaltsverzeichnisse auf der Verkaufsseite; überdimensionierte Desktop-Ansichten; flache Laufbänder und Effekte „von 2015“; lange
  Wartezeiten ohne Ergebnis; eigenmächtige Umdeutungen seiner Vorgaben.

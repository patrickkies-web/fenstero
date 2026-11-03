# Rechtstexte „An meinem Haus ansehen“: zum Einsetzen beim Freischalten

**Nachtrag 2.11.2026, spät:** Die KI-Vorschau rechnet jetzt Cloudflare Workers AI (Wunsch des Inhabers). Online stehen die Fassungen
für Cloudflare: Datenschutz 5a, der Satz zum Prüfwert in Abschnitt 2, AGB § 2 Abs. 5 und § 11 Abs. 2 (Stand 2.11.2026) und die
Cookie-Zeile; Einwilligung Stand `2026-11-02c` (web/assets/hausbild.js). Die Entwürfe unten mit Black Forest Labs gelten nur, falls der
Weg über Black Forest Labs direkt je eingeschaltet wird (`FREIGEGEBEN` in functions/api/hausbild.js); dann 5a und Einwilligung neu
fassen und den Stand hochzählen.

Stand 2.11.2026 (Fassung Black Forest Labs). Diese Texte standen nicht online: Die KI-Vorschau über Black Forest Labs bleibt aus, bis der Vertrag zur Auftragsverarbeitung mit
Black Forest Labs da ist (Prüfung: docs/recht/2026-11-02-hausbild-pruefung.md, Anfrage: docs/recht/2026-11-02-black-forest-labs-anfrage.md).

## Was öffentlich über Black Forest Labs bekannt ist (Recherche 2.11.2026)

Von hier aus ließen sich die Seiten von bfl.ai nicht direkt öffnen (Netz der Arbeitsumgebung). Die Angaben stammen aus Suchergebnissen,
die diese Seiten zitieren. Vor dem Einsetzen bitte im Original prüfen.

- **Firma laut Impressum** (bfl.ai/legal/imprint): BFL GmbH, Ingeborg-Krummer-Schroth-Straße 18, 79106 Freiburg im Breisgau,
  Amtsgericht München HRB 291820. Laut Datenschutzerklärung von BFL (bfl.ai/legal/privacy-policy) ist für Nutzer im EWR die BFL GmbH
  verantwortlich; Übermittlungen außerhalb des EWR stützt sie auf EU-Standardvertragsklauseln. Es gibt eigene „EU Developer Terms of
  Service“ (bfl.ai/legal/eu-developer-terms-of-service). Wer im Vertrag zur Auftragsverarbeitung Vertragspartner ist, steht damit
  noch nicht fest.
- **Training:** Laut den FLUX API Service Terms (bfl.ai/legal/flux-api-service-terms) darf BFL Eingaben und Ergebnisse zum Training
  und zur Verbesserung seiner Modelle nutzen. Laut Datenschutzerklärung kann man dem per E-Mail an privacy@blackforestlabs.ai mit dem
  Betreff „Training Opt Out“ und den Kontodaten widersprechen. **Ohne diesen Widerspruch und eine Bestätigung wäre der Satz
  „trainiert seine KI nicht damit“ falsch**; außerdem nutzte BFL die Fotos dann für eigene Zwecke, was mit einer Auftragsverarbeitung
  nicht vereinbar ist. Die E-Mail liegt fertig in docs/recht/2026-11-02-black-forest-labs-anfrage.md.
- **Vertrag zur Auftragsverarbeitung:** Einen öffentlich abrufbaren DPA von BFL haben wir nicht gefunden. Er muss angefragt werden
  (Anfrage wie oben).
- **Speicherdauer:** öffentlich nicht gefunden; Frage 4 der Anfrage.

## Sperre in der App

Ausgeschaltet im Server: `FREIGEGEBEN = false` in `functions/api/hausbild.js` (Wunsch des Inhabers, 2.11.2026). Danach erscheint
die Einladung erst, wenn **beides** stimmt: `HAUSBILD_FREI=1` bei Cloudflare **und** kein Platzhalter mehr in
`HB_EINW_TEXT` (web/assets/hausbild.js: `sitz`, `frist`, `ohneTraining`). Wird der Schalter versehentlich zu früh gesetzt, bleibt die
Funktion trotzdem aus.

## Freischalten, Schritt für Schritt

1. Vertrag mit Black Forest Labs abschließen, Antworten auf die Anfrage einholen, Training abbestellen und die Bestätigung aufheben.
2. Die Platzhalter „[bitte ergänzen …]“ unten füllen (Firma und Anschrift, Drittland-Satz, Frist, Training) und dieselben Angaben im
   Einwilligungsblatt eintragen: `HB_EINW_TEXT` in `web/assets/hausbild.js` (Sitz, Frist, Datum der Bestätigung zum Training). Ändert sich der Text des Blatts, zählen
   `HB_EINW_STAND` (web/assets/hausbild.js) und `EINW_STAND` (functions/api/hausbild.js) gemeinsam hoch.
3. Texte einsetzen:
   - `web/datenschutz/index.html`: Abschnitt 5a vor Abschnitt 6, Eintrag im Inhaltsverzeichnis, Satz in Abschnitt 2 (Ende des Absatzes
     zur Zählung im Arbeitsspeicher); Stand der Seite und `functions/seo.js` (`/datenschutz/`) aktualisieren.
   - `web/agb/index.html`: § 2 Abs. 5 nach Abs. 4, § 11 bekommt die Nummer (1) und Abs. 2; Stand der Seite (`<meta name="stand">` und
     zweimal „Stand:“), `AGB_STAND` in `functions/api/recht.js` und `functions/seo.js` (`/agb/`) auf das neue Datum.
   - `web/cookies/index.html`: Zeile nach `aufmass.ki.einwilligung`; Stand der Seite und `functions/seo.js` (`/cookies/`).
4. Prüfsuite: `PW_PFAD=/opt/node-tools NUR=3,17 node scripts/pruefen.mjs` (Kasse mit dem neuen AGB-Stand, Rechtstexte).
5. In `functions/api/hausbild.js` `FREIGEGEBEN` auf `true` setzen (seit 2.11.2026 auf Wunsch des Inhabers `false`: Der Server lehnt
   jede Vorschau ab und schickt nichts an Black Forest Labs, gleich was bei Cloudflare steht).
6. Bei Cloudflare (Workers & Pages → fenstero → Settings → Variables and Secrets) die Variable `HAUSBILD_FREI` mit dem Wert `1` anlegen
   (`BFL_API_KEY` steht schon). Ab dann erscheint die Einladung in „Gespeichert“.

## Datenschutzerklärung, Abschnitt 2 (Satz am Ende des Absatzes zur Zählung)

```
Für die Tagesgrenze der Vorschau am eigenen Haus (Abschnitt 5a) speichern wir einen nicht umkehrbaren Prüfwert Ihres Anschlusses, keine IP-Adresse, und löschen ihn nach zwei Tagen.
```

## Datenschutzerklärung, Inhaltsverzeichnis

```
<li><a href="#p5a-vorschau-am-eigenen-haus">5a. Vorschau am eigenen Haus (freiwillig)</a></li>
```

## Datenschutzerklärung, Abschnitt 5a

```html
  <h2 id="p5a-vorschau-am-eigenen-haus">5a. Vorschau am eigenen Haus (freiwillig)</h2>
  <p><strong>Ohne KI.</strong> Unter „An meinem Haus ansehen“ können Sie ein Foto Ihres Hauses wählen und Ihre geplanten Fenster darauf setzen. Das Foto verkleinert die App auf höchstens 2.000 Pixel; es bleibt auf Ihrem Gerät, nur für die Dauer der Sitzung im Arbeitsspeicher, und wir speichern es nicht, auch nicht in Ihrem Konto. Bis hierhin verlässt nichts Ihr Gerät.</p>
  <p><strong>KI-Vorschau.</strong> Nur wenn Sie „KI-Vorschau“ antippen und eingewilligt haben, schickt die App über unseren Server (Cloudflare, Abschnitt 2) einen Ausschnitt Ihres Fotos rund um die gesetzten Fenster (höchstens 1.600 Pixel an der längsten Seite), Bilder der geplanten Fenster aus der App und deren Merkmale (Rahmenfarbe, Zahl der Flügel, Oberlicht, Sprossen, Sonnenschutz, Glasart) an unseren Dienstleister [bitte ergänzen: Firma und Anschrift von Black Forest Labs laut Vertrag zur Auftragsverarbeitung]. Dessen KI (FLUX) berechnet daraus ein Bild, in dem die neuen Fenster in Ihr Foto eingesetzt sind. Welchen Ausschnitt die App übermittelt, zeigt sie Ihnen vor der Einwilligung. Name, Anschrift, E-Mail-Adresse, Telefonnummer und Maße übermitteln wir nicht; Ortsangaben (GPS) aus dem Foto entfernt die App vor dem Versand, und Ihre IP-Adresse erhält Black Forest Labs nicht.</p>
  <p><strong>Nur in der EU.</strong> Wir nutzen ausschließlich den Zugang von Black Forest Labs für die Europäische Union, verarbeitet wird auf Servern in der EU. Ist dieser Zugang gestört, gibt es keine KI-Vorschau; auf Server außerhalb der EU weichen wir nicht aus. [bitte ergänzen nach Auskunft von Black Forest Labs: „Eine Übermittlung in Drittländer findet nicht statt.“ oder, falls der Vertragspartner oder Unterauftragnehmer in einem Drittland sitzen: „Die Übermittlung stützt sich auf das EU-US Data Privacy Framework (Art. 45 DSGVO) bzw. EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).“]</p>
  <p><strong>Speicherung.</strong> Unser Server leitet das Ergebnis an Ihr Gerät weiter und speichert weder den Ausschnitt noch das Ergebnis. Der Link zum Abholen des Ergebnisses bei Black Forest Labs verfällt nach 10 Minuten. Black Forest Labs speichert die übermittelten Bilder und das Ergebnis höchstens [bitte ergänzen: Frist laut Vertrag], nur zur Berechnung und zur Prüfung auf Missbrauch, und nutzt sie nicht zum Training seiner Modelle [bitte bestätigen laut Vertrag]. Bereits übermittelte Bilder löscht Black Forest Labs nach dieser Frist, auch wenn Sie Ihre Einwilligung widerrufen.</p>
  <p><strong>Rechtsgrundlage und Widerruf.</strong> Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die die App vor der ersten KI-Vorschau abfragt. Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen, im Editor oder unten in der App über „Vorschau-Einwilligung widerrufen“; danach fragt die App vor der nächsten KI-Vorschau wieder. Ohne Einwilligung funktioniert alles andere in der App wie bisher. Black Forest Labs verarbeitet die Daten in unserem Auftrag (Art. 28 DSGVO).</p>
  <p><strong>Andere Personen auf dem Foto.</strong> Bitte wählen Sie möglichst ein Foto, auf dem keine Personen und keine Kfz-Kennzeichen zu erkennen sind. Sind auf dem Ausschnitt dennoch Personen, Kennzeichen oder Nachbarhäuser zu sehen, verarbeiten wir sie nur, weil es sich nicht vermeiden lässt, und nur für diese Berechnung (Art. 6 Abs. 1 lit. f DSGVO).</p>
  <p>Das Ergebnis ist ein von einer KI berechnetes Bild und keine Aufnahme Ihres Hauses: Es zeigt, wie die Fenster wirken könnten, und ist keine Grundlage für Maße oder die Bestellung. Die App kennzeichnet es sichtbar im Bild und in den Bilddaten als KI-Visualisierung. Die KI trifft keine Entscheidungen über Sie im Sinne von Art. 22 DSGVO.</p>
```

## AGB § 2 Abs. 5

```html
  <p>(5) Auf Wunsch berechnet eine künstliche Intelligenz aus einem Foto Ihres Hauses kostenlos eine Visualisierung Ihrer geplanten Fenster („An meinem Haus ansehen“). Sie ist ein künstlich erzeugtes Bild, kein Foto und keine Zusage über das Aussehen der Fenster; Farbe, Proportionen, Glas, Fensterbank, Laibung und Schatten können abweichen. Sie ist nicht Teil des Aufmaßblatts und keine Grundlage für Maße, Angebote oder Bestellung. Ein bestimmtes Ergebnis schulden wir nicht.</p>
```

## AGB § 11 Abs. 2 (der bisherige Absatz wird Abs. 1)

```html
  <p>(2) Für „An meinem Haus ansehen“ (§ 2 Abs. 5) laden Sie nur Fotos hoch, die Sie selbst aufgenommen haben oder nutzen dürfen, und nur von Häusern, die Ihnen gehören oder deren Eigentümer einverstanden ist; Personen und Kfz-Kennzeichen sollen nicht erkennbar sein. Sie räumen uns das einfache, unentgeltliche, nicht übertragbare Recht ein, das Foto für die Berechnung zu vervielfältigen, zu bearbeiten und an unseren Dienstleister zu übermitteln. Weitere Rechte erhalten wir nicht. Verletzen Sie schuldhaft Rechte Dritter, stellen Sie uns von daraus folgenden Ansprüchen frei.</p>
```

## Cookies und Speicher, neue Zeile

```html
      <tr><td><code>aufmass.hausbild.einwilligung</code></td><td data-k="Wofür">Ihre Einwilligung zur KI-Vorschau am eigenen Haus, mit dem Stand des Textes, dem Sie zugestimmt haben</td><td data-k="Wie lange">bis Sie sie widerrufen oder die Website-Daten löschen</td></tr>
```

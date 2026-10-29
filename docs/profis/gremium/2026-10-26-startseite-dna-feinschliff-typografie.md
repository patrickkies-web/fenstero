# T · Daniel Roth, Typografie, Raster, Abstände

1. **Wo** start.css `.ez-hero__text` (gap 16/24), `.ez-text` (16), `.ez-fb` (16) · **Was stört** Die volle Pille klebt am Lead, nur raum-4/5 davor. · **Beheben** `.ez-hero__text .ez-aktionen, .ez-text > .dna-pille, .ez-fb .ez-aktionen { margin-top: 16px }`, Hero ab 900 px `8px`: überall 32 px. · **Warum** DNA: vor der Hauptaktion mindestens raum-6.

2. **Wo** `.ez-liste li`, `.ez-linkzeile`, `.ez-frei li`, `.ez-ratgeber span`, `.ez-fuss ul a` (15 px); `.ez-klein`, `.ez-fuss__pilot` (13); `.ez-ratgeber b`, große Bento-`figcaption b` (18) · **Was stört** Schattenskala 13/15/18 neben 12/14/16/22. · **Beheben** Liste, Linkzeile 16/1.5; Ratgeber-Text, Fußlinks, Kostenlos-Liste 14/1.45; Kleintexte 14; Ratgeber-Titel und große Kachel 22/1.2/−.01em. · **Warum** Zwischenwerte lesen sich als Unsicherheit.

3. **Wo** `.ez-bento .dna-zahl--klein .dna-zahl__wert` 44/52; `.ez-preis .dna-zahl__wert` 72–96/250, `__einheit` 24; Lesebreiten 44ch (`.ez-kopfzeile`), 46ch (`.ez-fb`), 52ch (`.ez-fuss-satz`), 56ch (`.ez-ratgeber span`) · **Was stört** Tokenabweichungen ohne Grund. · **Beheben** Bento 48/250; Preis `clamp(64px, 16vw, 88px)`/200, Einheit 15 px, `margin-left: 4px`; Lesebreiten 36ch, Ratgeber 44ch plus `text-wrap: pretty` (desk-07: „Altbau.“ allein). · **Warum** zahl-xl/zahl/einheit und 36ch sind die DNA; 56ch sind 85 Zeichen.

4. **Wo** `[data-theme="hell"].dna-szene > .ez-abschnitt { padding-block: 56px }` · **Was stört** Gewinnt per Spezifität auch ab 900 px: helle Szenen 56, dunkle 120 (desk-02, Kicker bei y 56). · **Beheben** Regel streichen; wenn bewusst knapper: raum-7, ab 900 px raum-8. · **Warum** Szenenabstand ist raum-8/9, 56 ist kein Token.

5. **Wo** `.ez-stufe__text` gap 8, `.ez-kopfzeile` 12, `.ez-text` 16 · **Was stört** Dasselbe Tripel Kicker–Titel–Text in drei Takten. · **Beheben** Kicker→Titel 12, Titel→Text 16: `.ez-stufe__text { gap: 12px }` + `.dna-text { margin-top: 4px }`; `.ez-text > .dna-titel { margin-top: -4px }`; `.ez-kopfzeile .dna-text { margin-top: 4px }`. · **Warum** raum-3/raum-4 als festes Paar.

6. **Wo** `.ez-fuss__pilot` mit 24-px-Chip in 13/1.5; `.ez-fuss__spalten > .ez-marke` · **Was stört** Der Chip sprengt Zeile 1 (Pitch 23, dann 20 px); das Logo schwebt mittig in der Spalte. · **Beheben** Chip `height: 20px; vertical-align: -5px`; Marke `align-self: start; margin-top: -3px`. · **Warum** Gleicher Durchschuss; die Marke steht oben.

7. **Wo** `.ez-liste` (desk-06: „Insektenschutz ·“ / „Antrieb“, dreimal), Gerät `.ez-schirm__kopf` („Wohnzimmer ·“ / „Fenster 1“), „bis 17. November“ · **Was stört** Mittelpunkt hängt am Zeilenende; Datum kann brechen. · **Beheben** `</b>&nbsp;·&nbsp;` in allen acht Zeilen; im Gerät `Wohnzimmer<br>Fenster&nbsp;1` ohne Punkt; `17.&nbsp;November`. · **Warum** Satzzeichen bleiben am Wort.

8. **Wo** `.ez-fenster figcaption b/span` (nowrap, ellipsis, gap 2) · **Was stört** 760–900 px (Kachel innen 109 px): „Rundbogenfenst…“; 360-px-Telefone kappen „Anthrazitgrau“. · **Beheben** Auf `b` nowrap/ellipsis entfernen; `span` `white-space: normal` mit `Aluminium&nbsp;·&nbsp;Anthrazitgrau`; `gap: 4px`. · **Warum** Kein Bruch im Wort, kein gekappter Produktname.

9. **Wo** `.ez-ratgeber a` border, `.ez-fuss` border-top (dunkel: linie-fein = Anthrazit auf Schwarz, 1,2:1) · **Was stört** Haarlinien fehlen, der Rundknopf daneben trägt einen Silbergrau-Ring. · **Beheben** `border-color: color-mix(in srgb, var(--silbergrau) 30%, transparent)`, 1 px. · **Warum** Eine Linienstärke, ein Ton je Bildschirm.

10. **Wo** `.ez-anker .dna-etikett` 12→13 px ab 900, `.ez-stufe__bild`/`.ez-blatt .dna-etikett` bleiben 12; `[data-theme="dunkel"] .dna-etikett__wert` auf tinte/400; `.ez-preis .dna-leucht__kopf` · **Was stört** Etiketten am Schreibtisch uneinheitlich; Label 500 und Wert 400 beide weiß verschmelzen; Preis-Label 4 px über der Chip-Mitte. · **Beheben** Alle Etiketten 12 px, ab 900 px 13; Wert zurück auf `var(--tinte-2)`; `align-items: center`. · **Warum** Ein Bauteil, ein Maß; die Einheit flüstert.

**Bleibt:**
- Hero-Titel bricht an 390 und 1280 sauber („Fensterplanung / ganz eezi.“), `text-wrap: balance` rettet 375 px.
- Wortmarke Inter 900/500 bei 20 px, 10 px zum Zeichen; Tabellenziffern in Zahl und Etikett; 1.409 mm und 7,99 € mit geschütztem Leerzeichen.
- Rundungen 28/40/999, Fuge raum-3, Innenabstand raum-4/5, Stationen-Punktlinie exakt auf 12 px Mitte.

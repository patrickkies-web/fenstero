/* Startseite, Ansicht Hauseigentümer: der Baustein aus der Vorschau „Startseite neu gedacht“ (Fassung 5, docs/profis/2026-10-25-startseite.md).
   portal.js setzt in SCREENS.landing (Ansicht Hauseigentümer) einen leeren Halter #startseite und ruft nach dem Aufbau Startseite.auf(halter,
   daten). Der Inhalt steht im Schatten-DOM des Halters: Die Klassen der Vorschau (hero, wrap, seg, foto …) kollidieren so nicht mit
   portal.css, und portal.css wirkt nicht hinein. Gestaltung in startseite.css (einmal geladen, als gemeinsames Stylesheet für jeden
   neuen Aufbau). Kopf- und Fußzeile: Kopf mit Marke, „Jetzt konfigurieren“ und Ansicht kommt von hier, die Fußzeile mit den Rechtslinks
   von portal.js. Daten: app (Einstieg in die App), fuehrung, preis (Aufmaßblatt), einf (Satz zum Einführungspreis oder leer),
   zuBetrieb (Wechsel zur Ansicht Fensterbauer). */
(function () {
  'use strict';
  /* Fenster aus dem 3-D-Modell der App (gerendert mit docs/profis/werkzeuge/startseite-renderings.mjs), Zahlen in der App gezählt (Stand Oktober 2026) */
  const EL = [
    ['fsw', 't', 'Faltschiebewand', 'Aluminium · Anthrazitgrau', 'Faltschiebewand aus Aluminium in Anthrazitgrau'],
    ['rund', 'f', 'Rundfenster', 'Kunststoff · Anthrazitgrau', 'rundes Fenster aus Kunststoff in Anthrazitgrau'],
    ['sprosse', 'f', 'Mit Wiener Sprossen', 'Kunststoff · Verkehrsweiß', 'zweiflügliges Fenster in Verkehrsweiß mit Wiener Sprossen'],
    ['raffstore', 'f', 'Mit Raffstore', 'Aluminium · Anthrazitgrau', 'Fenster von außen mit halb heruntergefahrenem Raffstore, Anthrazitgrau'],
    ['hst', 't', 'Hebe-Schiebe-Tür', 'Aluminium · Tiefschwarz', 'Hebe-Schiebe-Tür aus Aluminium in Tiefschwarz'],
    ['rundbogen', 'f', 'Rundbogenfenster', 'Holz · Eiche hell', 'Rundbogenfenster aus Holz in Eiche hell'],
    ['rollladen', 'f', 'Mit Rollladen', 'Kunststoff · Golden Oak', 'dreiflügliges Fenster von außen mit halb heruntergefahrenem Rollladen, Holzdekor Golden Oak'],
    ['trapez', 'f', 'Festverglasung, Trapez', 'Aluminium · Anthrazitgrau', 'trapezförmige Festverglasung aus Aluminium in Anthrazitgrau'],
    ['balkon', 't', 'Balkontür', 'Kunststoff · Verkehrsweiß', 'Balkontür aus Kunststoff in Verkehrsweiß mit Quersprosse'],
    ['psk', 't', 'PSK-Tür', 'Kunststoff-Alu · innen weiß', 'Parallel-Schiebe-Kipp-Tür aus Kunststoff-Alu, innen weiß'],
    ['segment', 'f', 'Segmentbogen, Sprossen', 'Kunststoff · Cremeweiß', 'Segmentbogenfenster in Cremeweiß mit glasteilenden Sprossen']
  ];
  const ZAHLEN = [['219', 'RAL-Farben'], ['15', 'Holzdekore'], ['7', 'Formen'], ['6', 'Elementarten'], ['5', 'Materialien'], ['4', 'Arten Sonnenschutz'], ['7', 'Glas-Extras'], ['4', 'Sprossenarten'], ['9', 'Griff-Farben'], ['5', 'Stufen Einbruchschutz'], ['6', 'Arten Insektenschutz'], ['8', 'Maße je Fenster'], ['124', 'Begriffe erklärt'], ['0&nbsp;€', 'fürs Messen']];
  const REIHE = () => EL.map(([b, art, t, w, alt], i) => '<li class="el ' + art + '" style="--i: ' + i + '"><span class="el-bild"><img src="/bilder/startseite/reihe/' + b + '.webp" alt="3-D-Modell aus der App: ' + alt + '" loading="lazy" decoding="async" draggable="false"></span><span class="el-titel">' + t + '</span><span class="el-was">' + w + '</span></li>').join('');
  const FAKTEN = () => ZAHLEN.map(([z, l]) => '<li class="zahl"><span class="zahl-wert">' + z + '</span><span class="zahl-label">' + l + '</span><span class="zahl-trenner" aria-hidden="true"></span></li>').join('');
  const html = (d) => `<header class="kopf" id="kopfzeile"><div class="wrap">
  <a class="marke" href="/" aria-label="eeziframes, zur Startseite"><svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="10" fill="#000"/><g fill="#fff"><path d="M26.4 12.2 44.4 19.7 56.3 15.3 42 6.6Z"/><path d="M45 22 57 17.6V41.9L45 39.8Z"/><path d="M44.2 41 55.9 43.3 11.7 64H10A10 10 0 0 1 0 54Z"/></g><rect x=".5" y=".5" width="63" height="63" rx="9.5" fill="none" stroke="#fff" stroke-opacity=".12"/></svg><span class="wm" translate="no"><b>eezi</b>frames</span></a>
  <a class="pille" href="${d.app}"><span>Jetzt konfigurieren</span><span class="pf" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>
</div></header>

<div class="wrap"><nav class="seg" aria-label="Ansicht wählen"><a href="/#hauseigentuemer" aria-current="page">Hauseigentümer</a><a href="/#fensterbauer" data-zu="betrieb">Fensterbauer<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></a></nav></div>

<main>
<div class="wrap">
<section class="hero" id="kopf">
  <div class="fotohalter"><div class="foto">
    <img src="/bilder/foto/start-hauseigentuemer.webp" width="1250" height="1250" alt="Ein Waschbär steht auf einem Tritt und misst mit dem Zollstock die Maueröffnung eines Fensters, in der anderen Pfote das Handy" fetchpriority="high">
  </div></div>
  <div class="text">
    <h1><span class="zeile"><span>Fensterplanung </span></span><span class="zeile"><span>ganz <span class="ak">eezi.</span></span></span></h1>
    <p class="lead"><b>Planen und Messen kosten nichts.</b> Das Aufmaßblatt kostet einmal ${d.preis}.</p>
    <div class="cta"><a class="pille gross" href="${d.app}"><span>Jetzt konfigurieren</span><span class="pf" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a><a class="geist" href="#so" id="mehr">Mehr erfahren</a></div>
  </div>
</section>
</div>

<section class="lauf rev" id="fenster" aria-labelledby="lauf-titel">
  <div class="wrap lauf-kopf"><p class="kicker">Aus dem Konfigurator</p><h2 id="lauf-titel">Jedes Fenster. Bis ins <span class="ak">Detail.</span></h2></div>
  <div class="laufband bilder" style="--dauer: 44s"><ul class="spur">${REIHE()}</ul></div>
  <div class="laufband zahlen" style="--dauer: 60s"><ul class="spur">${FAKTEN()}</ul></div>
  <p class="wrap lauf-fuss">Alle Fenster: Ansichten aus dem 3-D-Modell der App. Alle Zahlen: in der App gezählt, Stand Oktober 2026.</p>
</section>

<div class="wrap">
<section class="abschnitt so rev" id="so" aria-labelledby="so-titel">
  <div class="kopfzeile"><p class="kicker">So geht es</p><h2 id="so-titel">Vom Zollstock zum <span class="ak">Aufmaß.</span></h2><p class="sub">Ein Fenster, vier Schritte. Ohne Konto, ohne App aus dem Store.</p></div>
  <div class="so-grid">
    <div class="so-buehne" id="so-buehne" data-s="1" role="img" aria-label="Animation: Ein Fenster wird von innen und außen fotografiert, als Zeichnung mit vier Maßen vermessen, als 3-D-Modell in Anthrazit mit Sprossen geplant und landet als erste Zeile im Aufmaßblatt.">
      <div class="sz sz1" aria-hidden="true">
        <img class="s1-bild s1-aussen" src="/bilder/startseite/so/wand-aussen.webp" width="1200" height="1186" alt="" loading="lazy" decoding="async">
        <img class="s1-bild s1-innen" src="/bilder/startseite/so/wand-innen.webp" width="1200" height="1186" alt="" loading="lazy" decoding="async">
        <div class="sucher"><i></i><i></i><i></i><i></i></div>
        <div class="blitz"></div>
        <div class="daumen d1"><img src="/bilder/startseite/so/wand-innen.webp" alt="" loading="lazy"><b>innen</b></div>
        <div class="daumen d2"><img src="/bilder/startseite/so/wand-aussen.webp" alt="" loading="lazy"><b>außen</b></div>
        <div class="stapel s1-plak">
          <span class="plakette c1"><span class="pk"></span>Foto 1 von 2 · innen</span>
          <span class="plakette c2"><span class="pk"></span>Foto 2 von 2 · außen</span>
          <span class="plakette c3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Einbausituation erkannt</span>
        </div>
      </div>
      <div class="sz sz2" aria-hidden="true">
        <svg class="zeichnung" viewBox="0 0 560 560">
          <defs>
            <pattern id="so-schraffur" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V9" stroke="rgba(243,242,238,.09)" stroke-width="1.2"/></pattern>
            <mask id="so-wandmaske"><rect x="40" y="70" width="480" height="420" fill="#fff"/><rect x="130" y="150" width="300" height="236" fill="#000"/></mask>
          </defs>
          <rect class="wand" x="40" y="70" width="480" height="420" fill="url(#so-schraffur)" mask="url(#so-wandmaske)"/>
          <rect class="glas" x="155" y="175" width="113" height="193"/><rect class="glas" x="292" y="175" width="113" height="193"/>
          <path class="l" style="--i: 0" pathLength="1" d="M130 150H430V386H130Z"/>
          <path class="l" style="--i: 1" pathLength="1" d="M116 386H444V397H116Z"/>
          <path class="l" style="--i: 2" pathLength="1" d="M137 157H423V386H137Z"/>
          <path class="l" style="--i: 3" pathLength="1" d="M145 165H278V378H145Z"/>
          <path class="l" style="--i: 4" pathLength="1" d="M282 165H415V378H282Z"/>
          <path class="l duenn" style="--i: 5" pathLength="1" d="M155 175H268V368H155Z"/>
          <path class="l duenn" style="--i: 6" pathLength="1" d="M292 175H405V368H292Z"/>
          <path class="l" style="--i: 7; stroke-width: 4" pathLength="1" d="M271 258V292"/>
          <path class="l" style="--i: 7; stroke-width: 4" pathLength="1" d="M289 258V292"/>
          <path class="sym" d="M268 175L155 271.5L268 368M155 175L211.5 368L268 175"/>
          <path class="sym" d="M292 175L405 271.5L292 368M292 175L348.5 368L405 175"/>
          <g class="mass mo m1">
            <path class="hilf gestr" d="M126 150H76M126 386H76"/>
            <path class="hilf" d="M80 156L92 144M80 392L92 380"/>
            <path class="ml" pathLength="1" d="M86 150V386"/>
            <g transform="translate(86 268)"><g class="wert"><rect x="-38" y="-17" width="76" height="34" rx="10"/><text>1.409</text></g></g>
          </g>
          <g class="mass el m2">
            <path class="hilf gestr" d="M427 157H492M448 386H492"/>
            <path class="hilf" d="M476 163L488 151M476 392L488 380"/>
            <path class="ml" pathLength="1" d="M482 157V386"/>
            <g transform="translate(482 272)"><g class="wert"><rect x="-38" y="-17" width="76" height="34" rx="10"/><text>1.385</text></g></g>
          </g>
          <g class="mass mo m3">
            <path class="hilf gestr" d="M130 146V106M430 146V106"/>
            <path class="hilf" d="M124 122L136 110M424 122L436 110"/>
            <path class="ml" pathLength="1" d="M130 116H430"/>
            <g transform="translate(280 116)"><g class="wert"><rect x="-38" y="-17" width="76" height="34" rx="10"/><text>1.789</text></g></g>
          </g>
          <g class="mass el m4">
            <path class="hilf gestr" d="M137 401V446M423 401V446"/>
            <path class="hilf" d="M131 442L143 430M417 442L429 430"/>
            <path class="ml" pathLength="1" d="M137 436H423"/>
            <g transform="translate(280 436)"><g class="wert"><rect x="-38" y="-17" width="76" height="34" rx="10"/><text>1.760</text></g></g>
          </g>
        </svg>
        <div class="s2-legende"><span class="plakette o"><span class="pk"></span>Öffnung</span><span class="plakette e"><span class="pk"></span>Fenster</span></div>
        <div class="stapel s2-zaehler">
          <span class="plakette z1">Maß 1 von 4 · Höhe</span>
          <span class="plakette z2">Maß 2 von 4 · Höhe</span>
          <span class="plakette z3">Maß 3 von 4 · Breite</span>
          <span class="plakette z4">Maß 4 von 4 · Breite</span>
          <span class="plakette zf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Alle Maße in mm</span>
        </div>
      </div>
      <div class="sz sz3" aria-hidden="true">
        <div class="modell">
          <img class="sprosse" src="/bilder/startseite/so/modell-sprosse.webp" width="1398" height="1425" alt="" loading="lazy" decoding="async">
          <img class="anthrazit" src="/bilder/startseite/so/modell-anthrazit.webp" width="1398" height="1425" alt="" loading="lazy" decoding="async">
          <img class="weiss" src="/bilder/startseite/so/modell-weiss.webp" width="1398" height="1425" alt="" loading="lazy" decoding="async">
        </div>
        <div class="stapel s3-fertig"><span class="plakette"><span class="pk"></span>3-D-Modell aus deinen Maßen</span></div>
        <div class="s3-panel">
          <div class="s3-zeile"><span class="s3-farbe">Farbe <span class="stapel"><b class="n1">Verkehrsweiß · RAL 9016</b><b class="n2">Anthrazitgrau · RAL 7016</b></span></span></div>
          <div class="s3-zeile">
            <span class="punkte"><i style="background: #f1f0ea"></i><i style="background: #383e42"></i><i style="background: linear-gradient(135deg, #c9a46b, #b8935c 50%, #d6b47c)"></i><i style="background: #0e0e10"></i><span class="ring"></span></span>
            <span class="schalter"><span class="aus">Sprossen</span><span class="an"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Sprossen</span></span>
          </div>
        </div>
      </div>
      <div class="sz sz4" aria-hidden="true">
        <div class="s4-blatt">
          <img src="/bilder/fensterbauer/aufmassblatt-weber.webp" width="920" height="872" alt="" loading="lazy" decoding="async">
          <i class="zeile z1"></i><i class="zeile z2"></i><i class="zeile z3"></i><i class="zeile z4"></i>
          <span class="haken h1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <span class="haken h2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <span class="haken h3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <span class="haken h4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
        </div>
        <div class="flug"><img src="/bilder/startseite/so/modell-sprosse.webp" alt="" loading="lazy" decoding="async"></div>
        <div class="s4-plak"><span class="plakette"><span class="pk"></span>Aufmaßblatt.pdf · für jeden Fensterbauer</span><span class="plakette">einmal ${d.preis}</span></div>
      </div>
      <button class="so-halt" type="button" aria-pressed="false" aria-label="Ablauf anhalten" hidden><svg class="i-halt" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg><svg class="i-weiter" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z"/></svg></button>
    </div>
    <ol class="so-liste">
      <li><button type="button" class="so-s" data-s="1" aria-current="step" aria-controls="so-buehne"><span class="nr">01</span><span class="t">Fotografieren</span><span class="x">Ein Foto von innen, eins von außen. Daraus liest die App die Einbausituation für deinen Fensterbauer.</span><span class="balken"><i></i></span></button></li>
      <li><button type="button" class="so-s" data-s="2" aria-current="false" aria-controls="so-buehne"><span class="nr">02</span><span class="t">Messen</span><span class="x">Vier Maße mit dem Zollstock: Öffnung und Fenster, je Höhe und Breite. Die App zeigt, wo du anlegst.</span><span class="balken"><i></i></span></button></li>
      <li><button type="button" class="so-s konf" data-s="3" aria-current="false" aria-controls="so-buehne"><span class="nr">03</span><span class="t">Konfigurieren</span><span class="x">Farbe, Sprossen, Glas, Rollladen: Du wählst, das Fenster zeigt es sofort.</span><span class="balken"><i></i></span></button></li>
      <li><button type="button" class="so-s" data-s="4" aria-current="false" aria-controls="so-buehne"><span class="nr">04</span><span class="t">Aufmaßblatt</span><span class="x">Alles auf einem Blatt als PDF, das jeder Fensterbauer lesen kann. Einmal ${d.preis} für alle Fenster.</span><span class="balken"><i></i></span></button></li>
    </ol>
  </div>
  <p class="ablauf-fuss">Erst ansehen? Die <a href="${d.fuehrung}">Führung</a> zeigt alles in zwei Minuten, ohne eigene Maße.</p>
</section>

<section class="abschnitt rev" id="blatt">
  <div class="haar"></div>
  <div class="kopfzeile"><p class="kicker">Fenster für Fenster</p><h2>Was im <span class="ak">Aufmaß</span> steckt.</h2><p class="sub">Alles, was der Fensterbauer für ein Angebot braucht, sauber sortiert.</p></div>
  <div class="blattblock">
    <div class="medien"><div class="schirm blatt"><img src="/bilder/fensterbauer/aufmassblatt-weber.webp" width="920" height="872" alt="" loading="lazy"></div><span class="datei"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/></svg>Aufmaßblatt-Weber.pdf · 2 Seiten</span>
      <p class="beispiel"><b>Das Blatt ist fürs Angebot; vor der Fertigung misst dein Fensterbauer einmal nach.</b> Beispiel: Aufmaß von Familie Weber bei Fensterbau Brandt, beide erfunden.</p></div>
    <div>
      <ul class="liste">
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Maueröffnung</b> · Breite oben, Mitte, unten; Höhe links, Mitte, rechts; die App nimmt das kleinste Maß</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Fensterelement</b> · Breite und Höhe des alten Fensters mit Rahmen</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Fotos innen und außen</b> · Einbausituation, Rollladenkasten, Fensterbänke</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Teilung und Öffnung</b> · Flügel, Dreh, Kipp, DIN links oder rechts</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Material und Farbe</b> · Kunststoff, Holz, Alu, innen und außen</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Glas und Sprossen</b> · 2- oder 3-fach, Schallschutz, Sicherheit</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Rollladen und Insektenschutz</b> · Antrieb, Kasten, Führung</span></li>
        <li><span class="hk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>Montage und Klärungsliste</b> · Fensterbänke, Anschluss, offene Wünsche</span></li>
      </ul>
      <a class="linkzeile" href="#fensterbauer">Fensterbauer? So kommt das Blatt zu Ihnen ›</a>
    </div>
  </div>
</section>

<section class="abschnitt rev" id="preis">
  <div class="haar"></div>
  <div class="kopfzeile"><p class="kicker">Preis</p><h2>Messen kostet <span class="ak">nichts.</span></h2></div>
  <div class="preis">
    <div class="zahl">${d.preis}<small>einmal fürs Aufmaßblatt, alle Fenster</small></div>
    <p>${d.einf ? d.einf + '. ' : ''}Du zahlst erst, wenn alle Maße da sind: mit Karte, Apple Pay oder Google Pay, über Stripe.</p>
    <div class="frei"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Messen</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Fotos</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>3-D-Modell</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>Wünsche</span></div>
    <div class="cta"><a class="pille gross" href="${d.app}"><span>Jetzt ausmessen</span><span class="pf" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a></div>
  </div>
</section>

<section class="abschnitt rev" id="ratgeber">
  <div class="haar"></div>
  <div class="kopfzeile"><p class="kicker">Ratgeber</p><h2>Vor dem <span class="ak">Messen</span> lesen.</h2></div>
  <ul class="rat">
    <li><a href="/ratgeber/fenster-ausmessen/"><div><b>Fenster ausmessen</b><span>Die Maueröffnung an drei Stellen messen, das kleinste Maß zählt. Mit Tipps für den Altbau.</span></div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></a></li>
    <li><a href="/ratgeber/aufmassblatt-fenster/"><div><b>Aufmaßblatt für Fenster</b><span>Was ein Aufmaß umfasst und wie das Blatt in der App als PDF entsteht.</span></div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></a></li>
    <li><a href="/ratgeber/fenster-austauschen/"><div><b>Fenster austauschen</b><span>Ablauf, Kosten pro Fenster, Förderung 2026 und was ins Angebot gehört.</span></div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></a></li>
  </ul>
  <a class="linkzeile" href="/ratgeber/">Alle Ratgeber ›</a>
</section>

<section class="fb rev" id="fensterbauer">
  <div class="fb-inhalt"><p class="kicker">Für Fensterbauer</p><h2>Ihr eigener <span class="ak">Fensterkonfigurator.</span></h2>
  <p>Unter Ihrer Domain und in Ihrer Marke: Ihre Kunden planen ihre Fenster selbst, Sie bekommen jede Anfrage mit Aufmaßblatt. <b>Ihre Kunden zahlen nichts.</b></p>
  <div class="cta"><a class="pille gross" href="/fuer-fensterbauer/"><span>Pakete ansehen</span><span class="pf" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a><a class="geist" href="/#fensterbauer" data-zu="betrieb">Zur Ansicht für Fensterbauer</a></div></div>
</section>
</div>`;

  /* Gestaltung einmal laden; jeder neue Aufbau nimmt dasselbe Stylesheet (kein Aufblitzen ohne Stil). Ohne gemeinsame Stylesheets: <link> */
  const CSS = '/assets/startseite.css';
  let blatt = null, laden = null;
  const gemeinsam = typeof CSSStyleSheet === 'function' && 'replaceSync' in CSSStyleSheet.prototype && 'adoptedStyleSheets' in Document.prototype;
  function stil() {
    if (!laden) laden = fetch(CSS, { credentials: 'same-origin' }).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }).then((t) => { blatt = new CSSStyleSheet(); blatt.replaceSync(t); return blatt; }).catch(() => { laden = null; return null; });
    return laden;
  }
  let aus = null; // Aufräumen des vorigen Aufbaus (Fenster-Ereignisse, Beobachter)

  function auf(halter, d) {
    if (aus) { aus(); aus = null; }
    if (!halter || halter.shadowRoot) return;
    const root = halter.attachShadow({ mode: 'open' });
    root.innerHTML = html(d);
    if (gemeinsam && blatt) { root.adoptedStyleSheets = [blatt]; }
    else if (gemeinsam) { halter.style.visibility = 'hidden'; stil().then((s) => { if (s) root.adoptedStyleSheets = [s]; else { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = CSS; root.prepend(l); } halter.style.visibility = ''; }); }
    else { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = CSS; halter.style.visibility = 'hidden'; l.onload = l.onerror = () => { halter.style.visibility = ''; }; root.prepend(l); }
    aus = beleben(root, d);
  }

  /* Bewegung und Bedienung wie in der Vorschau; alles hängt an root, Fenster-Ereignisse werden beim nächsten Aufbau gelöst */
  function beleben(root, d) {
    const weg = [], an = (ziel, typ, fn, opt) => { ziel.addEventListener(typ, fn, opt); weg.push(() => ziel.removeEventListener(typ, fn, opt)); };
    const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (id) => root.getElementById(id);
    const hero = $('kopf');
    /* Auftritt: nur beim ersten Aufruf in dieser Sitzung, nur mit Bewegung, erst wenn die Schrift da ist (sonst springt die Maske) */
    let schon = false; try { schon = sessionStorage.getItem('start-auftritt') === '1'; sessionStorage.setItem('start-auftritt', '1'); } catch (e) { /* ohne Speicher */ }
    if (!schon && !ruhig && hero) {
      hero.classList.add('an', 'warte');
      const frei = () => hero.classList.remove('warte');
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(frei);
      setTimeout(frei, 400);
      setTimeout(() => hero.classList.remove('an', 'warte'), 2000);
    }
    /* Abschnitte erscheinen einmal, wenn 15 % im Bild sind */
    const beob = [];
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 }) : null;
    if (io) beob.push(io);
    root.querySelectorAll('.rev').forEach((el) => { if (io && !ruhig) io.observe(el); else el.classList.add('in'); });

    /* Laufbänder: Inhalt verdoppeln (Klone für Vorleser unsichtbar), laufen ohne Unterbrechung; außerhalb des Bildes und im verdeckten Tab stehen sie still */
    const band = $('fenster'), baender = band ? band.querySelectorAll('.laufband') : [];
    baender.forEach((lb) => { const spur = lb.querySelector('.spur'); Array.prototype.slice.call(spur.children).forEach((li) => { const k = li.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.setAttribute('data-klon', ''); spur.appendChild(k); }); });
    if (band && !ruhig && document.timeline) {
      baender.forEach((lb) => lb.classList.add('bereit'));
      const laeufe = []; baender.forEach((lb) => { const a = lb.querySelector('.spur').getAnimations()[0]; if (a) { a.pause(); laeufe.push(a); } });
      let bandSicht = false;
      const bandLos = () => { const los = bandSicht && !document.hidden; band.classList.toggle('steht', !los); laeufe.forEach((a) => { if (los) a.play(); else a.pause(); }); };
      band.classList.add('steht');
      if ('IntersectionObserver' in window) { const o = new IntersectionObserver((e) => { bandSicht = e[0].isIntersecting; bandLos(); }, { rootMargin: '0px 0px -20% 0px' }); o.observe(band.querySelector('.laufband.bilder')); beob.push(o); }
      else { bandSicht = true; bandLos(); }
      an(document, 'visibilitychange', bandLos);
    }

    /* So geht es: vier Takte nacheinander, solange die Bühne im Bild ist; der Fortschrittsbalken des laufenden Schritts bestimmt den Wechsel.
       Antippen springt, der Halt-Knopf hält alles an. Bei „weniger Bewegung“ zeigt jeder Schritt sein Endbild, ohne Ablauf. */
    const so = $('so'), buehne = $('so-buehne');
    if (so && buehne) {
      const schritte = Array.prototype.slice.call(so.querySelectorAll('.so-s')), soHalt = buehne.querySelector('.so-halt');
      const DAUER = { 1: 4600, 2: 4800, 3: 5000, 4: 4800 };
      let akt = 1, gestartet = false;
      const setze = (n) => {
        akt = n;
        buehne.setAttribute('data-s', '');
        schritte.forEach((b) => b.setAttribute('aria-current', 'false'));
        void buehne.offsetWidth;
        buehne.setAttribute('data-s', String(n));
        schritte.forEach((b) => { if (b.getAttribute('data-s') === String(n)) { b.setAttribute('aria-current', 'step'); b.style.setProperty('--dauer', DAUER[n] + 'ms'); } });
      };
      schritte.forEach((b) => b.addEventListener('click', () => { if (!ruhig && !gestartet) { gestartet = true; so.classList.add('laeuft'); } setze(Number(b.getAttribute('data-s'))); }));
      if (!ruhig) {
        so.classList.add('aus');
        soHalt.hidden = false;
        soHalt.addEventListener('click', () => {
          const halt = !so.classList.contains('halt');
          so.classList.toggle('halt', halt);
          soHalt.setAttribute('aria-pressed', String(halt));
          soHalt.setAttribute('aria-label', halt ? 'Ablauf fortsetzen' : 'Ablauf anhalten');
        });
        so.querySelector('.so-liste').addEventListener('animationend', (e) => { if (e.animationName === 'fortschritt') setze(akt % 4 + 1); });
        let imBild = false;
        const sicht = () => so.classList.toggle('aus', !imBild || document.hidden);
        if ('IntersectionObserver' in window) {
          const o = new IntersectionObserver((e) => { imBild = e[0].isIntersecting; if (imBild && !gestartet) { gestartet = true; so.classList.add('laeuft'); setze(1); } sicht(); }, { threshold: 0.45 });
          o.observe(buehne); beob.push(o);
        } else { imBild = true; gestartet = true; so.classList.add('laeuft'); setze(1); sicht(); }
        an(document, 'visibilitychange', sicht);
      }
      /* „Mehr erfahren“: zur Bühne „So geht es“, der Ablauf beginnt von vorn */
      const mehr = $('mehr');
      if (mehr) mehr.addEventListener('click', (e) => {
        e.preventDefault();
        so.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
        if (!ruhig) { if (!gestartet) { gestartet = true; so.classList.add('laeuft'); } so.classList.remove('halt'); setze(1); }
      });
    }

    /* Sprungmarken im Baustein (#fensterbauer, #so) scrollen hier, ohne die Adresse zu ändern: Hashes steuern auf der Startseite die Ansicht.
       data-zu wechselt zur Ansicht Fensterbauer (portal.js) */
    root.addEventListener('click', (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a || e.defaultPrevented) return;
      if (a.hasAttribute('data-zu')) { if (d.zuBetrieb && a.getAttribute('data-zu') === 'betrieb') { e.preventDefault(); d.zuBetrieb(); } return; }
      const href = a.getAttribute('href') || '';
      if (href === '/#hauseigentuemer') { e.preventDefault(); window.scrollTo({ top: 0, behavior: ruhig ? 'auto' : 'smooth' }); return; }
      if (href.charAt(0) !== '#') return;
      const ziel = root.getElementById(href.slice(1)); if (!ziel) return;
      e.preventDefault();
      ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
    });

    /* Kopfzeile: beim Lesen nach unten weg, nach 24 px Hochscrollen zurück (keine Fingerkorrektur lässt sie flackern) */
    const kopf = $('kopfzeile');
    let raf = 0, letztes = window.scrollY, hoch = 0;
    const lauf = () => {
      raf = 0; const y = window.scrollY, dy = y - letztes;
      if (y < 80) { kopf.classList.remove('weg'); hoch = 0; }
      else if (dy > 0) { kopf.classList.add('weg'); hoch = 0; }
      else if (dy < 0) { hoch -= dy; if (hoch >= 24) kopf.classList.remove('weg'); }
      letztes = y;
    };
    if (kopf) { an(window, 'scroll', () => { if (!raf) raf = requestAnimationFrame(lauf); }, { passive: true }); lauf(); }

    return () => { weg.forEach((f) => f()); beob.forEach((o) => o.disconnect()); if (raf) cancelAnimationFrame(raf); };
  }

  stil(); // früh laden, damit der erste Aufbau nicht wartet
  window.Startseite = { auf: auf };
})();

/* eeziframes · Farben am Fenster: RAL Classic, Holzdekore, Sonderoberflächen und Farbwörter
   Eine Quelle für App, Betriebsbereich, Aufmaßblatt und Server (UMD wie modell.js: setzt globalThis.RAL, module.exports für Node).
   Im Browser vor modell.js laden; modell.js holt sie sich auf dem Server selbst (require).

   Datenvertrag
     RAL.finde(text | schlüssel) → Eintrag oder null. Erst der genaue Schlüssel ('7016', 'goak', 'db703'), sonst der eingetippte Text
       („RAL 7016“, „7016“, „Anthrazitgrau“, „DB 703“, „Golden Oak“, „Messing“, „#383E42“).
     Eintrag = { key, code, nr, name, label, hex, bg, art, familie, holz }
       key      so steht die Farbe im Fenster (w.fa, w.fi, w.sfarbe, w.ifarbe): RAL als Nummer '7016', Dekore und Sonderfarben als Kürzel
       code     angezeigter Code: 'RAL 7016', 'DB 703', 'Holzdekor', 'RAL 7016 Struktur', 'E6/EV1'; bei Farbwörtern ''
       nr       nur bei RAL die Nummer ('7016'), sonst ''
       name     Name ohne Code ('Anthrazitgrau', 'Golden Oak'); RAL mit dem offiziellen deutschen Namen
       label    Name mit Code, wie im Aufmaß in Fließtext ('RAL 7016 Anthrazitgrau', 'DB 703 Eisenglimmer dunkel', 'Golden Oak')
       kurz     Kürzel unter dem Farbfeld ('7016', 'DB 703', 'E6/EV1'), bei Holz leer
       hex      sRGB-Näherung in Kleinbuchstaben ('#383e42'); bg ist der CSS-Hintergrund (Holz mit Maserung, sonst hex)
       art      'ral' | 'holz' | 'sonder' | 'wort' (Farbwort wie „Messing“) | 'hex' (eingetippter Hexwert)
       familie  Schlüssel aus RAL.FAMILIEN (bei 'wort' und 'hex' leer)
     RAL.eintrag(schlüssel)   nur der genaue Schlüssel, sonst null (für gespeicherte Werte)
     RAL.lesen(text)          eingetippte Farbe wie bisher Farbtext.lesen: { hex, bg, name (= label), code (= nr), key, holz, eintrag }
     RAL.suche(text, arten)   Einträge, beste zuerst: Nummer (auch ohne „RAL“, auch angefangen), Name, Suchwörter, Tippfehler
     RAL.liste                alle wählbaren Einträge (RAL, Holzdekore, Sonderfarben) in Reihenfolge der Familien
     RAL.FAMILIEN             [{ k, label, hex }] für die Chips; RAL.BELIEBT { rahmen, rahmenMehr, sonne, innen } als Schlüssel
     RAL.mischen(hex, ziel, t), RAL.holzBg(hex)
   Die Farbwerte sind Bildschirm-Näherungen. Das echte Ergebnis zeigt ein Farbmuster des Fensterbauers. */
(function (root, factory) {
  const api = factory();
  root.RAL = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  /* RAL Classic, alle 216 Töne (Stand RAL K7 mit den Ergänzungen 2020: 1037, 2017, 6039), offizieller deutscher Name, sRGB-Näherung */
  const TABELLE = ('1000 Grünbeige CDBA88|1001 Beige D0B084|1002 Sandgelb D2AA6D|1003 Signalgelb F9A800|1004 Goldgelb E49E00|1005 Honiggelb CB8E00|1006 Maisgelb E29000|1007 Narzissengelb E88C00|1011 Braunbeige AF804F|1012 Zitronengelb DDAF27|1013 Perlweiß E3D9C6|1014 Elfenbein DDC49A|1015 Hellelfenbein E6D2B5|1016 Schwefelgelb F1DD38|1017 Safrangelb F6A950|1018 Zinkgelb FACA30|1019 Graubeige A48F7A|1020 Olivgelb A08F65|1021 Rapsgelb F6B600|1023 Verkehrsgelb F7B500|1024 Ockergelb BA8F4C|1026 Leuchtgelb FFFF00|1027 Currygelb A77F0E|1028 Melonengelb FF9B00|1032 Ginstergelb E2A300|1033 Dahliengelb F99A1C|1034 Pastellgelb EB9C52|1035 Perlbeige 908370|1036 Perlgold 80643F|1037 Sonnengelb F09200|' +
    '2000 Gelborange DA6E00|2001 Rotorange BA481B|2002 Blutorange BF3922|2003 Pastellorange F67828|2004 Reinorange E25303|2005 Leuchtorange FF4D06|2007 Leuchthellorange FFB200|2008 Hellrotorange ED6B21|2009 Verkehrsorange DE5307|2010 Signalorange D05D28|2011 Tieforange E26E0E|2012 Lachsorange D5654D|2013 Perlorange 923E25|2017 RAL Orange FC5500|' +
    '3000 Feuerrot A72920|3001 Signalrot 9B2423|3002 Karminrot 9B2321|3003 Rubinrot 861A22|3004 Purpurrot 6B1C23|3005 Weinrot 59191F|3007 Schwarzrot 3E2022|3009 Oxidrot 6D342D|3011 Braunrot 782423|3012 Beigerot C5856D|3013 Tomatenrot 972E25|3014 Altrosa CB7375|3015 Hellrosa D8A0A6|3016 Korallenrot A63D30|3017 Rosé CA555D|3018 Erdbeerrot C63F4A|3020 Verkehrsrot BB1E10|3022 Lachsrot CF6955|3024 Leuchtrot FF2D21|3026 Leuchthellrot FF2A1B|3027 Himbeerrot AB273C|3028 Reinrot CC2C24|3031 Orientrot A63437|3032 Perlrubinrot 701D24|3033 Perlrosa A53A2E|' +
    '4001 Rotlila 816183|4002 Rotviolett 8D3C4B|4003 Erikaviolett C4618C|4004 Bordeauxviolett 651E38|4005 Blaulila 76689A|4006 Verkehrspurpur 903373|4007 Purpurviolett 47243C|4008 Signalviolett 844C82|4009 Pastellviolett 9D8692|4010 Telemagenta BC4077|4011 Perlviolett 6E6387|4012 Perlbrombeer 6B6B7F|' +
    '5000 Violettblau 2A4362|5001 Grünblau 1F4764|5002 Ultramarinblau 2B2C7C|5003 Saphirblau 2A3756|5004 Schwarzblau 1D1F2A|5005 Signalblau 154889|5007 Brillantblau 41678D|5008 Graublau 313C48|5009 Azurblau 2E5978|5010 Enzianblau 13447C|5011 Stahlblau 232C3F|5012 Lichtblau 3481B8|5013 Kobaltblau 232D53|5014 Taubenblau 6C7C98|5015 Himmelblau 2874B2|5017 Verkehrsblau 0E518D|5018 Türkisblau 21888F|5019 Capriblau 1A5784|5020 Ozeanblau 0B4151|5021 Wasserblau 07737A|5022 Nachtblau 2F2A5A|5023 Fernblau 4D668E|5024 Pastellblau 6A93B0|5025 Perlenzian 296478|5026 Perlnachtblau 102C54|' +
    '6000 Patinagrün 3C7460|6001 Smaragdgrün 366735|6002 Laubgrün 325928|6003 Olivgrün 50533C|6004 Blaugrün 024442|6005 Moosgrün 114232|6006 Grauoliv 3C392E|6007 Flaschengrün 2C3222|6008 Braungrün 37342A|6009 Tannengrün 27352A|6010 Grasgrün 4D6F39|6011 Resedagrün 6C7C59|6012 Schwarzgrün 303D3A|6013 Schilfgrün 7D765A|6014 Gelboliv 474135|6015 Schwarzoliv 3D3D36|6016 Türkisgrün 00694C|6017 Maigrün 587F40|6018 Gelbgrün 61993B|6019 Weißgrün B9CEAC|6020 Chromoxidgrün 37422F|6021 Blassgrün 8A9977|6022 Braunoliv 3A3327|6024 Verkehrsgrün 008351|6025 Farngrün 5E6E3B|6026 Opalgrün 005F4E|6027 Lichtgrün 7EBAB5|6028 Kieferngrün 315442|6029 Minzgrün 006F3D|6032 Signalgrün 237F52|6033 Minttürkis 46877F|6034 Pastelltürkis 7AACAC|6035 Perlgrün 194D25|6036 Perlopalgrün 04574B|6037 Reingrün 008B29|6038 Leuchtgrün 00B51A|6039 Fasergrün B3C43E|' +
    '7000 Fehgrau 7A888E|7001 Silbergrau 8C969D|7002 Olivgrau 817863|7003 Moosgrau 7A7669|7004 Signalgrau 9B9B9B|7005 Mausgrau 6C6E6B|7006 Beigegrau 766A5E|7008 Khakigrau 745E3D|7009 Grüngrau 5D6058|7010 Zeltgrau 585C56|7011 Eisengrau 52595D|7012 Basaltgrau 575D5E|7013 Braungrau 575044|7015 Schiefergrau 4F5358|7016 Anthrazitgrau 383E42|7021 Schwarzgrau 2F3234|7022 Umbragrau 4C4A44|7023 Betongrau 808076|7024 Graphitgrau 45494E|7026 Granitgrau 374345|7030 Steingrau 928E85|7031 Blaugrau 5B686D|7032 Kieselgrau B5B0A1|7033 Zementgrau 7F8274|7034 Gelbgrau 92886F|7035 Lichtgrau C5C7C4|7036 Platingrau 979392|7037 Staubgrau 7A7B7A|7038 Achatgrau B0B0A9|7039 Quarzgrau 6B665E|7040 Fenstergrau 989EA1|7042 Verkehrsgrau A 8E9291|7043 Verkehrsgrau B 4F5250|7044 Seidengrau B7B3A8|7045 Telegrau 1 8D9295|7046 Telegrau 2 7E868A|7047 Telegrau 4 C8C8C7|7048 Perlmausgrau 817B73|' +
    '8000 Grünbraun 89693F|8001 Ockerbraun 9D622B|8002 Signalbraun 794D3E|8003 Lehmbraun 7E4B27|8004 Kupferbraun 8D4931|8007 Rehbraun 70462B|8008 Olivbraun 724A25|8011 Nussbraun 5A3826|8012 Rotbraun 66332B|8014 Sepiabraun 4A3526|8015 Kastanienbraun 5E2F26|8016 Mahagonibraun 4C2B20|8017 Schokoladenbraun 442F29|8019 Graubraun 3D3635|8022 Schwarzbraun 1A1718|8023 Orangebraun A45729|8024 Beigebraun 795038|8025 Blassbraun 755847|8028 Terrabraun 513A2A|8029 Perlkupfer 7F4031|' +
    '9001 Cremeweiß E9E0D2|9002 Grauweiß D7D5CB|9003 Signalweiß ECECE7|9004 Signalschwarz 2B2B2C|9005 Tiefschwarz 0E0E10|9006 Weißaluminium A1A1A0|9007 Graualuminium 878581|9010 Reinweiß F1ECE1|9011 Graphitschwarz 27292B|9012 Reinraumweiß F8F2E1|9016 Verkehrsweiß F1F0EA|9017 Verkehrsschwarz 2A292A|9018 Papyrusweiß C8CBC4|9022 Perlhellgrau 858583|9023 Perldunkelgrau 797B7A').split('|');

  /* Farbfamilien für die Chips: wie man Farben am Fenster sucht, nicht streng nach RAL-Gruppen. Jede Farbe steht in genau einer. */
  const FAMILIEN = [
    { k: 'weiss', label: 'Weiß und Creme', hex: '#f1f0ea' }, { k: 'grau', label: 'Grau', hex: '#8c969d' }, { k: 'dunkel', label: 'Anthrazit und Schwarz', hex: '#383e42' },
    { k: 'braun', label: 'Braun', hex: '#5a3826' }, { k: 'holz', label: 'Holzdekore', hex: '#b5732f' }, { k: 'gelb', label: 'Beige und Gelb', hex: '#d0b084' },
    { k: 'orange', label: 'Orange', hex: '#e25303' }, { k: 'rot', label: 'Rot und Rosa', hex: '#9b2423' }, { k: 'violett', label: 'Violett', hex: '#76689a' },
    { k: 'blau', label: 'Blau', hex: '#2a4362' }, { k: 'gruen', label: 'Grün', hex: '#325928' }, { k: 'metall', label: 'Metallic und Struktur', hex: '#a1a1a0' }
  ];
  const WEISS = ['9001', '9002', '9003', '9010', '9012', '9016', '9018', '1013', '1015'];
  const DUNKEL = ['7016', '7021', '7022', '7024', '7026', '9004', '9005', '9011', '9017'];
  const METALL = ['9006', '9007', '9022', '9023'];
  const familieVon = (nr) => (WEISS.indexOf(nr) >= 0 ? 'weiss' : DUNKEL.indexOf(nr) >= 0 ? 'dunkel' : METALL.indexOf(nr) >= 0 ? 'metall'
    : ({ 1: 'gelb', 2: 'orange', 3: 'rot', 4: 'violett', 5: 'blau', 6: 'gruen', 7: 'grau', 8: 'braun', 9: 'weiss' })[nr.charAt(0)]);
  /* Suchwörter: was Kunden statt des RAL-Namens tippen */
  const WORTE = {
    9016: 'weiss fensterweiss standard', 9010: 'weiss', 9001: 'creme weiss', 9003: 'weiss', 1013: 'creme', 1015: 'elfenbein creme', 9002: 'weiss',
    7016: 'anthrazit dunkelgrau', 7021: 'anthrazit dunkelgrau', 7024: 'anthrazit graphit dunkelgrau', 7026: 'anthrazit dunkelgrau', 7015: 'dunkelgrau',
    7035: 'hellgrau', 7047: 'hellgrau', 7038: 'hellgrau', 7040: 'grau', 7001: 'silber', 7039: 'quarz', 7012: 'basalt', 7030: 'grau',
    9005: 'schwarz', 9004: 'schwarz', 9011: 'schwarz', 9017: 'schwarz', 9006: 'silber alu aluminium metallic', 9007: 'alu aluminium silber metallic dunkel', 9022: 'metallic', 9023: 'metallic',
    8022: 'dunkelbraun', 8019: 'braun dunkelbraun', 8014: 'braun', 8017: 'braun schokobraun', 8011: 'braun', 8028: 'braun', 8003: 'braun',
    6005: 'gruen dunkelgruen', 6009: 'gruen dunkelgruen', 6012: 'dunkelgruen', 6020: 'dunkelgruen', 6021: 'salbei',
    5011: 'blau dunkelblau', 5014: 'blau', 5003: 'blau', 5010: 'blau', 3005: 'bordeaux dunkelrot', 3004: 'bordeaux', 3009: 'rotbraun', 3011: 'rotbraun', 4004: 'bordeaux', 1019: 'beige sand', 1001: 'beige', 1002: 'sand'
  };
  /* Holzdekore (Folien auf Kunststoff, Aludekor), Schlüssel der App bleiben: goak, nuss, eiche, mahag */
  const HOLZ = [
    ['goak', 'Golden Oak', 'B5732F', 'golden eiche goldeneiche'], ['nuss', 'Nussbaum', '6B4428', 'nuss walnuss'], ['eiche', 'Eiche hell', 'C9A46B', 'eiche hell'],
    ['eiched', 'Eiche dunkel', '6B4A2C', 'eiche dunkel'], ['moor', 'Mooreiche', '3E3128', 'moor eiche dunkel'], ['winch', 'Winchester', 'A8774C', 'winchester'],
    ['sheff', 'Sheffield Oak', 'B9AB95', 'sheffield eiche grau'], ['doug', 'Douglasie', 'B8834F', 'douglas'], ['oregon', 'Oregon', 'B77C45', 'oregon kiefer'],
    ['mahag', 'Mahagoni', '6F2F22', 'mahagoni'], ['macore', 'Macoré', '7B3F2B', 'macore'], ['sbraun', 'Schwarzbraun', '2F2621', 'schwarzbraun dunkelbraun dekor'],
    ['siena', 'Siena Noce', '6F4B2E', 'siena noce nuss'], ['kiefer', 'Bergkiefer', 'C99A62', 'kiefer'], ['teak', 'Teak', '8B5A2B', 'teak']
  ];
  /* Sonderoberflächen: Eisenglimmer, Strukturlacke, Eloxal (Familie Metallic und Struktur) */
  /* [Schlüssel, Name, Code, Farbe, Suchwörter, kurz im Raster] */
  const SONDER = [
    ['db701', 'Eisenglimmer hell', 'DB 701', '8E9192', 'db 701 db701 eisenglimmer metallic', 'DB 701'], ['db702', 'Eisenglimmer mittel', 'DB 702', '7C8083', 'db 702 db702 eisenglimmer grau metallic', 'DB 702'],
    ['db703', 'Eisenglimmer dunkel', 'DB 703', '545A5E', 'db 703 db703 eisenglimmer anthrazit metallic', 'DB 703'],
    ['sand7016', 'Sandstruktur Anthrazit', 'RAL 7016 Struktur', '3B4145', 'sand struktur feinstruktur anthrazit matt', '7016'], ['sand9005', 'Feinstruktur Tiefschwarz', 'RAL 9005 Struktur', '17171a', 'sand struktur feinstruktur schwarz matt', '9005'],
    ['holz7016', 'Anthrazit Holzstruktur', 'RAL 7016 Folie', '3D4347', 'holzstruktur folie anthrazitgrau genarbt', '7016'],
    ['eloxal', 'Aluminium natur eloxiert', 'E6/EV1', 'B8BABA', 'eloxal eloxiert ev1 e6 alu natur silber', 'E6/EV1'], ['eloxbronze', 'Bronze eloxiert', 'E6/C33', '6E5B45', 'eloxal eloxiert bronze c33', 'E6/C33']
  ];
  /* Farbwörter für eingetippte Wünsche (Griff, Behang, Stoff): [Suchwörter, Name, Farbe] */
  const WOERTER = [
    [['weiss', 'weis'], 'Weiß', 'F3F2EE'], [['schwarz'], 'Schwarz', '151617'], [['grau'], 'Grau', '8A8D8F'], [['hellgrau'], 'Hellgrau', 'C5C7C4'], [['dunkelgrau'], 'Dunkelgrau', '45494E'], [['anthrazit'], 'Anthrazit', '383E42'],
    [['silber', 'silbern'], 'Silber', 'C9CCD0'], [['alu', 'aluminium'], 'Aluminium', 'A1A1A0'], [['edelstahl', 'inox'], 'Edelstahl', 'B4B8BC'], [['titan'], 'Titan', '8B8D8F'], [['gold', 'golden'], 'Gold', 'C8A24A'], [['messing'], 'Messing', 'B5A26A'],
    [['bronze'], 'Bronze', '8A6A48'], [['kupfer'], 'Kupfer', 'B87333'], [['champagner'], 'Champagner', 'D3C3A3'], [['creme', 'cremeweiss'], 'Creme', 'E9E0D2'], [['beige'], 'Beige', 'D0B084'], [['sand'], 'Sand', 'D2BC94'], [['taupe'], 'Taupe', '8B7D6B'],
    [['braun'], 'Braun', '5A4030'], [['dunkelbraun'], 'Dunkelbraun', '3B2A20'], [['rot'], 'Rot', 'A72920'], [['bordeaux'], 'Bordeaux', '651E38'], [['gruen'], 'Grün', '114232'], [['oliv'], 'Oliv', '50533C'], [['salbei'], 'Salbei', '7F9A7C'],
    [['blau'], 'Blau', '232C3F'], [['petrol'], 'Petrol', '1F5F6A'], [['tuerkis'], 'Türkis', '21888F'], [['gelb'], 'Gelb', 'F7B500'], [['orange'], 'Orange', 'E25303'], [['rosa'], 'Rosa', 'D8A0A6'], [['lila', 'violett'], 'Violett', '76689A'], [['terracotta', 'terrakotta'], 'Terracotta', 'B56A48'],
    [['holz'], 'Holzton', '9C6B3E']
  ];
  /* Beliebt: Rahmen (die zwölf häufigsten am Fenster), im Blatt dazu Holz und DB 703; Sonnenschutz (Lamellen und Panzer); innen (Rollo, Plissee, Jalousie) */
  const BELIEBT = {
    rahmen: ['9016', '7016', '9001', '7035', '7039', '8022', '9005', '7012', '6005', '8019', '7021', '5011'],
    rahmenMehr: ['goak', 'nuss', 'winch', 'db703'],
    sonne: ['9006', '9007', '7016', 'db703', '9016', '7035', '8014', '8019', '9005', '7039', '7021', '9001'],
    innen: ['9016', '9010', '9001', '1015', '1013', '7035', '7047', '9006', '7016', '9005', '8019', '7039']
  };

  const falt = (t) => String(t || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[éè]/g, 'e').replace(/[^a-z0-9#]+/g, ' ').trim();
  function mischen(hex, ziel, t) {
    const a = parseInt(String(hex).slice(1), 16), b = parseInt(String(ziel).slice(1), 16), k = (sh) => Math.round(((a >> sh) & 255) + ((((b >> sh) & 255) - ((a >> sh) & 255)) * t));
    return '#' + [16, 8, 0].map((sh) => ('0' + k(sh).toString(16)).slice(-2)).join('');
  }
  function holzBg(hex) { const h1 = mischen(hex, '#ffffff', 0.1), d = mischen(hex, '#000000', 0.12), m = mischen(hex, '#ffffff', 0.04); return 'repeating-linear-gradient(100deg, ' + hex + ' 0px, ' + h1 + ' 3px, ' + d + ' 6px, ' + m + ' 9px)'; }

  const liste = [], KEY = {};
  const neu = (o) => { o.hex = o.hex.toLowerCase(); o.bg = o.holz ? holzBg(o.hex) : o.hex; o.such = falt(o.name + ' ' + (o.code || '') + ' ' + (o.worte || '')); delete o.worte; liste.push(o); KEY[o.key] = o; return o; };
  TABELLE.forEach((z) => { const m = /^(\d{4}) (.+) ([0-9A-F]{6})$/.exec(z); if (!m) return; neu({ key: m[1], code: 'RAL ' + m[1], nr: m[1], name: m[2], label: 'RAL ' + m[1] + ' ' + m[2], kurz: m[1], hex: '#' + m[3], art: 'ral', familie: familieVon(m[1]), holz: false, worte: WORTE[m[1]] || '' }); });
  HOLZ.forEach((h) => neu({ key: h[0], code: 'Holzdekor', nr: '', name: h[1], label: h[1], kurz: '', hex: '#' + h[2], art: 'holz', familie: 'holz', holz: true, worte: h[3] + ' holz holzdekor dekor' }));
  SONDER.forEach((s) => neu({ key: s[0], code: s[2], nr: '', name: s[1], label: /^DB /.test(s[2]) ? s[2] + ' ' + s[1] : s[1], kurz: s[5], hex: '#' + s[3], art: 'sonder', familie: 'metall', holz: false, worte: s[4] }));
  /* Reihenfolge der Liste: nach Familie (wie die Chips), darin nach Nummer bzw. wie oben aufgeführt */
  const FOLGE = FAMILIEN.map((f) => f.k);
  liste.sort((a, b) => FOLGE.indexOf(a.familie) - FOLGE.indexOf(b.familie) || (a.nr && b.nr ? a.nr.localeCompare(b.nr) : 0));
  const namen = liste.filter((e) => e.art === 'ral').map((e) => [falt(e.name), e]);

  const eintrag = (k) => (k != null && Object.prototype.hasOwnProperty.call(KEY, String(k)) ? KEY[String(k)] : null);
  const wort = (w) => ({ key: '', code: '', nr: '', name: w[1], label: w[1], hex: '#' + w[2].toLowerCase(), bg: '#' + w[2].toLowerCase(), art: 'wort', familie: '', holz: false });
  /* Eingetippte Wörter: Dekore und Sonderfarben über ihre üblichen Namen, dann allgemeine Farbwörter. [Wörter (gefaltet), Eintrag] */
  const ALIAS = [
    [['db 701', 'db701'], 'db701'], [['db 702', 'db702'], 'db702'], [['db 703', 'db703', 'eisenglimmer'], 'db703'],
    [['eloxal', 'eloxiert', 'e6 ev1', 'ev1', 'alu natur'], 'eloxal'], [['bronze eloxiert', 'eloxal bronze'], 'eloxbronze'],
    [['golden oak', 'goldeneiche', 'golden eiche'], 'goak'], [['nussbaum', 'nuss', 'walnuss'], 'nuss'], [['eiche hell', 'eiche'], 'eiche'], [['eiche dunkel'], 'eiched'],
    [['mooreiche', 'moor eiche'], 'moor'], [['mahagoni'], 'mahag'], [['winchester'], 'winch'], [['sheffield oak', 'sheffield'], 'sheff'], [['douglasie', 'douglas'], 'doug'],
    [['siena noce', 'siena'], 'siena'], [['macore'], 'macore'], [['bergkiefer', 'kiefer'], 'kiefer'], [['teak'], 'teak'], [['oregon'], 'oregon'],
    [['sandstruktur', 'sandstruktur anthrazit', 'anthrazit sandstruktur', 'feinstruktur anthrazit'], 'sand7016'], [['feinstruktur', 'feinstruktur schwarz', 'feinstruktur tiefschwarz', 'sandstruktur schwarz'], 'sand9005'],
    [['holzstruktur', 'anthrazit holzstruktur', 'anthrazitgrau holzstruktur'], 'holz7016']
  ];
  const WORT = ALIAS.map((a) => [a[0], KEY[a[1]]]).concat(WOERTER.map((w) => [w[0], wort(w)]));
  /* Eingetippten Text verstehen (wie bisher Farbtext): Hex, DB, RAL-Nummer, Namen genau, dann enthalten (das längste Wort gewinnt) */
  function lesenRoh(text) {
    const roh = String(text == null ? '' : text).trim(); if (!roh) return null;
    const f = falt(roh); let m;
    if (eintrag(f)) return eintrag(f);
    m = /(^|\s)#?([0-9a-f]{6}|[0-9a-f]{3})(\s|$)/.exec(f);
    if (m && (/#/.test(f) || (/[a-f]/.test(m[2]) && /\d/.test(m[2]))) && !/^db\b/.test(f)) {
      const hx = (m[2].length === 3 ? m[2].replace(/(.)/g, '$1$1') : m[2]).toLowerCase();
      return { key: '', code: '', nr: '', name: 'Farbe #' + hx.toUpperCase(), label: 'Farbe #' + hx.toUpperCase(), hex: '#' + hx, bg: '#' + hx, art: 'hex', familie: '', holz: false };
    }
    m = /\bdb ?(70[123])\b/.exec(f); if (m) return KEY['db' + m[1]];
    m = /(?:^|[^0-9])([1-9]\d{3})(?![0-9])/.exec(f); if (m && eintrag(m[1])) return KEY[m[1]];
    let best = null, len = 0;
    const gut = (laenge, treffer) => { if (laenge > len) { best = treffer; len = laenge; } };
    namen.forEach((n) => { if (n[0] === f) gut(n[0].length + 4, n[1]); });
    liste.forEach((e) => { if (e.art !== 'ral' && falt(e.name) === f) gut(f.length + 4, e); });
    WORT.forEach((w) => { w[0].forEach((x) => { if (x === f) gut(x.length + 3, w[1]); }); });
    if (!best) {
      namen.forEach((n) => { if (n[0].length >= 5 && f.indexOf(n[0]) >= 0) gut(n[0].length, n[1]); });
      WORT.forEach((w) => { w[0].forEach((x) => { if (x.length >= 3 && new RegExp('(^| )' + x + '( |$)').test(f)) gut(x.length, w[1]); }); });
    }
    return best;
  }
  function finde(x) { if (x == null) return null; return eintrag(String(x).trim()) || lesenRoh(x); }
  /* Für eingetippte Farben: dieselbe Form wie bisher Farbtext.lesen (name mit Code vorn, code = RAL-Nummer) */
  function lesen(text) {
    const e = lesenRoh(text); if (!e) return null;
    return { hex: e.hex, bg: e.bg, name: e.label, code: e.nr, key: e.key, holz: e.holz, eintrag: e.art === 'wort' || e.art === 'hex' ? null : e };
  }

  /* Suche: tolerant gegen Tippfehler (Abstand zu einem Teilstück des Namens), „RAL“ darf fehlen, Nummern auch angefangen („70“) */
  function abstand(p, t) {
    const m = p.length; let prev = []; for (let i = 0; i <= m; i++) prev[i] = i;
    let best = m;
    for (let j = 0; j < t.length; j++) {
      const cur = [0];
      for (let i = 1; i <= m; i++) cur[i] = Math.min(prev[i] + 1, cur[i - 1] + 1, prev[i - 1] + (p.charAt(i - 1) === t.charAt(j) ? 0 : 1));
      if (cur[m] < best) best = cur[m];
      prev = cur;
    }
    return best;
  }
  function wertung(e, tok) {
    const digits = /^\d+$/.test(tok);
    if (digits) {
      if (e.nr === tok) return 100;
      if (e.nr && e.nr.indexOf(tok) === 0) return 80 - (4 - tok.length);
      const c = falt(e.code).replace(/\s+/g, '');
      if (c.indexOf(tok) >= 0) return tok.length >= 3 ? 75 : 0;
      return 0;
    }
    const kompakt = tok.replace(/\s+/g, '');
    if (/^db\d+$/.test(kompakt)) return falt(e.code).replace(/\s+/g, '').indexOf(kompakt) === 0 ? 95 : 0;
    /* Deutsche Farbnamen tragen die Grundfarbe hinten („Smaragdgrün“ ist ein Grün, „Grüngrau“ ein Grau): Ende zählt mehr als Anfang */
    const n = falt(e.name), worte = e.such.split(' ');
    let w = 0;
    if (n === tok) w = 95;
    else if (worte.indexOf(tok) >= 0 && tok.length >= 3) w = 90;
    else if (n.split(' ').some((x) => x.length > tok.length && x.slice(-tok.length) === tok)) w = 86;
    else if (n.indexOf(tok) === 0) w = 78;
    else if (n.split(' ').some((x) => x.indexOf(tok) === 0)) w = 76;
    else if (n.indexOf(tok) >= 0) w = 70;
    else if (worte.some((x) => x.indexOf(tok) === 0) && tok.length >= 3) w = 60;
    else if (e.such.indexOf(tok) >= 0 && tok.length >= 4) w = 54;
    else {
      const tol = tok.length >= 7 ? 2 : tok.length >= 4 ? 1 : 0;
      if (!tol) return 0;
      const d = Math.min(abstand(tok, n), abstand(tok, e.such));
      if (d > tol) return 0;
      w = 46 - d * 8;
    }
    /* Was am Fenster üblich ist, steht bei gleich guten Treffern vorn (die beliebteste zuerst) */
    const b = BELIEBT.rahmen.indexOf(e.key);
    return w + (b >= 0 ? 6 - b * 0.2 : BELIEBT.rahmenMehr.indexOf(e.key) >= 0 || BELIEBT.sonne.indexOf(e.key) >= 0 ? 3 : 0);
  }
  function suche(text, arten) {
    let q = falt(text).replace(/\bral\s*(?=\d)/g, '').replace(/\bral\b/g, ' ').replace(/\bdb\s+(?=\d)/g, 'db').trim();
    if (!q) return [];
    const toks = q.split(/\s+/).filter(Boolean), basis = arten ? liste.filter((e) => arten.indexOf(e.art) >= 0) : liste;
    const treffer = [];
    basis.forEach((e, i) => {
      /* jedes Wort muss passen; bei mehreren Wörtern zählt auch die ganze Eingabe („golden ok“ → Golden Oak) */
      let summe = 0;
      for (const t of toks) { const w = wertung(e, t); if (!w) { summe = 0; break; } summe += w; }
      if (toks.length > 1) summe = summe / toks.length;
      const ganz = toks.length > 1 ? wertung(e, toks.join(' ')) : 0;
      if (summe || ganz) treffer.push([Math.max(summe, ganz), i, e]);
    });
    treffer.sort((a, b) => b[0] - a[0] || (a[2].nr || 'z').localeCompare(b[2].nr || 'z') || a[1] - b[1]);
    return treffer.map((t) => t[2]);
  }

  return { finde: finde, eintrag: eintrag, lesen: lesen, suche: suche, liste: liste, FAMILIEN: FAMILIEN, BELIEBT: BELIEBT, mischen: mischen, holzBg: holzBg, falt: falt };
});

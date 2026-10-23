/* eeziframes · Pakete der Konfigurator-Instanzen (Essential, Plus, Signature): die einzige Stelle für Merkmale, Preise und Fristen je Paket
   Läuft im Browser (window.Pakete: Verkaufsseite, Kundenkonto /partner/, Zentrale) und auf dem Server (globalThis.Pakete, wie modell.js;
   Import in functions/api/router.js). Ein Merkmal in ein anderes Paket zu schieben heißt, eine Zelle in PAKETE zu ändern.
   Regeln (docs/INSTANZEN.md):
   - Nirgends sonst wird ein Paketname verglichen; Code fragt Merkmale ab (m.dashboard, m.logo …), nie den Schlüssel des Pakets.
   - Ein Paket setzt nie den Tarif eines Kontos (konto); Instanzkonten haben konto: 'instanz'.
   - Preise sind netto zzgl. MwSt. und vorläufig (VORLAEUFIG), bis der Inhaber sie bestätigt; der Preisstand einer Bestellung wird bei
     der Bestellung festgehalten (bestellungen.preise) und ändert sich danach nicht mehr.
   API: PAKETE, MERKMALE, LISTE, liste(), gueltig(p), merkmale(paket, abweichung) → eingefrorenes Objekt, oeffentlich(m),
        preis(paket) → { monat, einrichtung }, preisText(paket, art, mwst), preisStand(paket, mwst) → für bestellungen.preise */
(function (root) {
  'use strict';

  /* Stand der Preise (bestellungen.preise.stand); ändert sich ein Preis, ändert sich der Stand */
  const PREIS_STAND = '2026-10-22';
  /* Preise noch nicht vom Inhaber bestätigt: Verkaufsseite und Bestellformular sagen „vorläufige Preise“ */
  const VORLAEUFIG = true;
  const LISTE = ['essential', 'plus', 'signature'];

  /* Merkmal × Paket (Bauplan §2b). Werte:
     preis              { monat, einrichtung } in Euro netto
     domain, konfigurator, eingangMail   eigene Domain, voller Konfigurator, jede Anfrage per Mail mit PDF
     gestaltung         'standard' (eeziframes-Design, Name als Text) | 'eigen'
     logo, farbe        Logo in Kopf, Startansicht, PDF, Mail; Firmenfarbe als --accent
     fotos              Anzahl Unternehmensfotos in der Startansicht
     startansicht       eigener Titel, Kicker, Text, Begrüßung
     icons              'eezi' | 'betrieb'
     kennzeichnung      Hinweis in der App: 'deutlich' („Powered by EEZIframes“, verlinkt) | 'dezent' (Text im Fuß) | 'keine'
     pdfKennzeichnung   im Aufmaßblatt: 'deutlich' (Untertitel und Fuß) | 'dezent' (nur Fuß) | 'keine' (auch nicht als Autor)
     mailKennzeichnung  Rahmen der Mails an den Betrieb: 'deutlich' | 'dezent' | 'keine'
     absender           'instanz' (MAIL_ABSENDER_INSTANZ) | 'neutral' (MAIL_ABSENDER_NEUTRAL, sonst instanz)
     rechtNennung       eeziframes in Datenschutz und KI-Dialog: 'name' | 'kategorie' („technischer Dienstleister“)
     indexierung        'nein' (noindex, kein Disallow) | 'start' (nur / in Suchmaschinen)
     kopieKunde         „Meine Anfrage als PDF“ nach dem Senden
     fotoLinkTage       Link auf die Originalfotos in der Mail, Gültigkeit in Tagen (0 = kein Link)
     aufbewahrung       Tage nach Zustellung, nach denen die Anfrage gelöscht wird, oder 'vertrag' (bis Vertragsende)
     pdfAblage          PDF beim Eingang ablegen (Bucket blatt)
     dashboard, einladungslinks, fortschritt   Signature-Dashboard unter /betrieb/, persönliche Links, laufende Planungen
     zugaenge           Anzahl Dashboard-Zugänge
     kiMonat            Alarmgrenze KI-Auswertungen je Monat (hart = 2×)
     anfragenTag        Alarmgrenze Anfragen je Tag (hart = 4×) */
  const PAKETE = {
    essential: {
      name: 'EEZI Essential', preis: { monat: 29, einrichtung: 99 },
      domain: true, konfigurator: true, eingangMail: true,
      gestaltung: 'standard', logo: false, farbe: false, fotos: 0, startansicht: false, icons: 'eezi',
      kennzeichnung: 'deutlich', pdfKennzeichnung: 'deutlich', mailKennzeichnung: 'deutlich', absender: 'instanz', rechtNennung: 'name',
      indexierung: 'nein', kopieKunde: true, fotoLinkTage: 14, aufbewahrung: 30, pdfAblage: false,
      dashboard: false, einladungslinks: false, fortschritt: false, zugaenge: 0, kiMonat: 600, anfragenTag: 50
    },
    plus: {
      name: 'EEZI Essential Plus', preis: { monat: 39, einrichtung: 199 },
      domain: true, konfigurator: true, eingangMail: true,
      gestaltung: 'eigen', logo: true, farbe: true, fotos: 6, startansicht: true, icons: 'betrieb',
      kennzeichnung: 'dezent', pdfKennzeichnung: 'dezent', mailKennzeichnung: 'dezent', absender: 'instanz', rechtNennung: 'name',
      indexierung: 'start', kopieKunde: true, fotoLinkTage: 14, aufbewahrung: 30, pdfAblage: false,
      dashboard: false, einladungslinks: false, fortschritt: false, zugaenge: 0, kiMonat: 1000, anfragenTag: 50
    },
    signature: {
      name: 'EEZI Signature', preis: { monat: 64, einrichtung: 279 },
      domain: true, konfigurator: true, eingangMail: true,
      gestaltung: 'eigen', logo: true, farbe: true, fotos: 6, startansicht: true, icons: 'betrieb',
      kennzeichnung: 'keine', pdfKennzeichnung: 'keine', mailKennzeichnung: 'keine', absender: 'neutral', rechtNennung: 'kategorie',
      indexierung: 'start', kopieKunde: true, fotoLinkTage: 0, aufbewahrung: 'vertrag', pdfAblage: true,
      dashboard: true, einladungslinks: true, fortschritt: true, zugaenge: 5, kiMonat: 2000, anfragenTag: 100
    }
  };

  /* Beschriftung für Verkaufsseite (Vergleich) und Zentrale. art: wie der Wert gelesen wird (ja/nein, Zahl, Auswahl);
     werte: Text je Auswahlwert; vergleich: erscheint in der Vergleichstabelle der Verkaufsseite */
  const MERKMALE = {
    preis: { titel: 'Preis', art: 'preis', vergleich: true },
    name: { titel: 'Paket', art: 'text' },
    domain: { titel: 'Eigene Domain', text: 'Ihr Konfigurator unter Ihrer eigenen Adresse, z. B. ihr-name-fenster.de', art: 'janein', vergleich: true },
    konfigurator: { titel: 'Voller Konfigurator', text: 'Planung mit 3-D-Modell, KI-Auswertung der Fotos, Klärungsliste und Zeichnung', art: 'janein', vergleich: true },
    eingangMail: { titel: 'Anfrage per E-Mail mit PDF', text: 'Jede Anfrage kommt mit dem fertigen Aufmaßblatt als PDF in Ihr Postfach', art: 'janein', vergleich: true },
    gestaltung: { titel: 'Gestaltung', art: 'wahl', werte: { standard: 'eeziframes-Design mit Ihrem Namen', eigen: 'in Ihrem Design' }, vergleich: true },
    logo: { titel: 'Ihr Logo', text: 'in der App, im Aufmaßblatt und in der E-Mail', art: 'janein', vergleich: true },
    farbe: { titel: 'Ihre Firmenfarbe', art: 'janein', vergleich: true },
    fotos: { titel: 'Fotos Ihres Betriebs', text: 'auf der Startseite', art: 'zahl', vergleich: true },
    startansicht: { titel: 'Eigene Startseite', text: 'Titel, Begrüßung und Text', art: 'janein', vergleich: true },
    icons: { titel: 'App-Symbol', art: 'wahl', werte: { eezi: 'eeziframes', betrieb: 'Ihr Zeichen' } },
    kennzeichnung: { titel: 'Hinweis auf eeziframes in der App', art: 'wahl', werte: { deutlich: '„Powered by EEZIframes“', dezent: 'kleiner Hinweis im Fuß', keine: 'keiner' }, vergleich: true },
    pdfKennzeichnung: { titel: 'Hinweis auf eeziframes im Aufmaßblatt', art: 'wahl', werte: { deutlich: 'Untertitel und Fuß', dezent: 'nur im Fuß', keine: 'keiner' } },
    mailKennzeichnung: { titel: 'Rahmen der E-Mails', art: 'wahl', werte: { deutlich: 'eeziframes', dezent: 'Ihr Logo, Fußzeile von eeziframes', keine: 'ohne eeziframes' } },
    absender: { titel: 'Absender der E-Mails', art: 'wahl', werte: { instanz: 'Konfigurator-Postfach von eeziframes', neutral: 'neutrales Postfach ohne eeziframes, sobald eingerichtet; bis dahin das Konfigurator-Postfach' } },
    rechtNennung: { titel: 'eeziframes in Datenschutz und KI-Hinweis', art: 'wahl', werte: { name: 'mit Namen', kategorie: 'als technischer Dienstleister' } },
    indexierung: { titel: 'In Suchmaschinen', art: 'wahl', werte: { nein: 'nein', start: 'Startseite' }, vergleich: true },
    kopieKunde: { titel: 'PDF-Kopie für Ihre Kunden', art: 'janein' },
    fotoLinkTage: { titel: 'Originalfotos per Link', art: 'tage' },
    aufbewahrung: { titel: 'Aufbewahrung der Anfragen', art: 'aufbewahrung', vergleich: true },
    pdfAblage: { titel: 'Unterlagen jederzeit abrufbar', art: 'janein' },
    dashboard: { titel: 'Dashboard unter Ihrer Domain', text: 'geschützter Zugang für Ihr Team', art: 'janein', vergleich: true },
    einladungslinks: { titel: 'Persönliche Einladungslinks', text: 'Kunden gezielt einladen, auf Ihrer Domain', art: 'janein', vergleich: true },
    fortschritt: { titel: 'Fortschritt sehen', text: 'eingeladen, in Bearbeitung, eingereicht', art: 'janein', vergleich: true },
    zugaenge: { titel: 'Zugänge zum Dashboard', art: 'zahl', vergleich: true },
    kiMonat: { titel: 'KI-Auswertungen im Monat (Richtwert)', art: 'zahl' },
    anfragenTag: { titel: 'Anfragen am Tag (Richtwert)', art: 'zahl' }
  };

  /* Was der Browser einer Instanz erfährt (window.KONFIG.instanz.m); alles andere bleibt auf dem Server. pdfKennzeichnung braucht die
     App für „Meine Anfrage als PDF“ und das Dashboard (Signature) für seine Aufmaßblätter */
  const OEFFENTLICH = ['gestaltung', 'logo', 'farbe', 'fotos', 'startansicht', 'kennzeichnung', 'pdfKennzeichnung', 'rechtNennung', 'kopieKunde', 'dashboard'];

  const frieren = (o) => { Object.keys(o).forEach((k) => { if (o[k] && typeof o[k] === 'object') frieren(o[k]); }); return Object.freeze(o); };
  const kopie = (o) => JSON.parse(JSON.stringify(o));
  LISTE.forEach((p) => frieren(PAKETE[p]));
  frieren(MERKMALE);

  const gueltig = (p) => LISTE.indexOf(String(p)) >= 0;
  /* gleicher Typ wie im Paket: Zahl ab 0, ja/nein, bei Auswahl einer der Werte aus MERKMALE; aufbewahrung Tage oder 'vertrag' */
  function passtTyp(schluessel, wert) {
    if (schluessel === 'aufbewahrung') return (typeof wert === 'number' && wert > 0 && wert <= 3650) || wert === 'vertrag';
    const vorlage = PAKETE.essential[schluessel], wahl = MERKMALE[schluessel].werte;
    if (typeof vorlage === 'number') return typeof wert === 'number' && isFinite(wert) && wert >= 0;
    if (typeof vorlage === 'string') return typeof wert === 'string' && (!wahl || Object.prototype.hasOwnProperty.call(wahl, wert));
    return typeof wert === typeof vorlage;
  }
  /* Nicht abweichend einstellbar: Paket, Name und Preis (Preise stehen im Preisstand der Bestellung, der Wechsel läuft über paketWechseln) */
  const FEST = ['paket', 'name', 'preis'];

  /* Merkmale einer Instanz: Paket plus einzelne Abweichungen (instanzen.abweichung, Kulanz). Unbekannte Schlüssel und Werte mit
     falschem Typ werden übergangen. Unbekanntes Paket: null */
  function merkmale(paket, abweichung) {
    if (!gueltig(paket)) return null;
    const m = kopie(PAKETE[paket]);
    m.paket = paket;
    const ab = abweichung && typeof abweichung === 'object' ? abweichung : {};
    Object.keys(ab).forEach((k) => { if (FEST.indexOf(k) < 0 && Object.prototype.hasOwnProperty.call(MERKMALE, k) && passtTyp(k, ab[k])) m[k] = kopie(ab[k]); });
    return frieren(m);
  }
  function oeffentlich(m) {
    const out = {};
    if (!m) return out;
    OEFFENTLICH.forEach((k) => { if (Object.prototype.hasOwnProperty.call(m, k)) out[k] = m[k]; });
    return out;
  }
  const preis = (paket) => (gueltig(paket) ? { monat: PAKETE[paket].preis.monat, einrichtung: PAKETE[paket].preis.einrichtung } : null);
  /* 29 → „29 €“, 99.5 → „99,50 €“ (mit geschütztem Leerzeichen) */
  const euro = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(2).replace('.', ',')) + ' €';
  /* art: 'monat' | 'einrichtung'; mwst: false bei Kleinunternehmerregelung (MWST=0), sonst zzgl. 19 % */
  function preisText(paket, art, mwst) {
    const p = preis(paket); if (!p) return '';
    const betrag = art === 'einrichtung' ? p.einrichtung : p.monat;
    const zusatz = mwst === false ? ' (kein Ausweis der Umsatzsteuer nach § 19 UStG)' : ' zzgl. MwSt.';
    return euro(betrag) + (art === 'einrichtung' ? ' einmalig' : ' im Monat') + ' netto' + zusatz;
  }
  /* Preisstand für bestellungen.preise: { monat, einrichtung, mwst, name, stand } */
  function preisStand(paket, mwst) {
    const p = preis(paket); if (!p) return null;
    return { monat: p.monat, einrichtung: p.einrichtung, mwst: mwst === false ? 0 : 19, name: PAKETE[paket].name, stand: PREIS_STAND };
  }
  const liste = () => LISTE.map((p) => ({ paket: p, name: PAKETE[p].name, preis: preis(p) }));

  const P = { PAKETE: PAKETE, MERKMALE: MERKMALE, LISTE: LISTE, OEFFENTLICH: OEFFENTLICH, PREIS_STAND: PREIS_STAND, VORLAEUFIG: VORLAEUFIG,
    liste: liste, gueltig: gueltig, merkmale: merkmale, oeffentlich: oeffentlich, preis: preis, preisText: preisText, preisStand: preisStand, euro: euro };
  root.Pakete = P;
  if (typeof module === 'object' && module.exports) module.exports = P;
})(typeof globalThis !== 'undefined' ? globalThis : this);

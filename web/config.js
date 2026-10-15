/* eeziframes · Einstellungen der Website
   Hier stehen KEINE geheimen Schlüssel. Der KI-Schlüssel liegt nur bei Cloudflare
   (Umgebungsvariable ANTHROPIC_API_KEY, siehe docs/ONLINE-STELLEN.md). */
window.KONFIG = {
  marke: 'eeziframes',
  pilot: true,                 // ohne Server: Code-Versand per WhatsApp/E-Mail, Kauf als Testkauf; mit Server (/api/status) schaltet die App selbst um
  ki: '/api/ki',               // KI-Auswertung der Fotos; '' schaltet sie ganz ab
  impressum: '/impressum/',
  datenschutz: '/datenschutz/',
  /* Preise. Mit Server (Stufe 2) kommen sie aus /api/status und überschreiben diese Werte.
     aufmass: Aufmaßblatt für Hauseigentümer ohne Link, brutto, 0 = kostenlos · projekt/frei/abo/plus: Betriebe, netto · mwst: false bei Kleinunternehmerregelung */
  preise: { aufmass: 7.99, projekt: 9, frei: 3, abo: { grund: 49, inkl: 10, extra: 5 }, plus: 79, mwst: true }
};

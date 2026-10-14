/* Klopfan · Einstellungen der Website
   Hier stehen KEINE geheimen Schlüssel. Der KI-Schlüssel liegt nur bei Cloudflare
   (Umgebungsvariable ANTHROPIC_API_KEY, siehe docs/ONLINE-STELLEN.md). */
window.KONFIG = {
  marke: 'Klopfan',
  pilot: true,                 // Pilotphase: kein Server, Code-Versand per WhatsApp/E-Mail, Datei kostenlos, nichts wird berechnet
  ki: '/api/ki',               // KI-Auswertung der Fotos; '' schaltet sie ganz ab
  impressum: '/impressum/',
  datenschutz: '/datenschutz/'
};

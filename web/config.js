/* Fensterino · Einstellungen der Website
   Hier stehen KEINE geheimen Schlüssel. Der KI-Schlüssel liegt nur bei Cloudflare
   (Umgebungsvariable ANTHROPIC_API_KEY, siehe docs/ONLINE-STELLEN.md). */
window.KONFIG = {
  marke: 'Fensterino',
  pilot: true,                 // Pilotphase: kein Server, Code-Versand per WhatsApp/E-Mail, Datei kostenlos, nichts wird berechnet
  ki: '/api/ki',               // KI-Auswertung der Fotos; '' schaltet sie ganz ab
  impressum: '/impressum/',
  datenschutz: '/datenschutz/',
  kundeDatei: 0                // PDF für Hauseigentümer, die ohne Link selbst messen: 0 = kostenlos (empfohlen), z. B. 19.9 = Verkauf mit Konto
};

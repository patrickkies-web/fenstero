/* eeziframes · Anbieter für E-Mails und Bestätigungen (dieselben Angaben wie im Impressum, web/impressum/index.html).
   Die Kontaktadresse kommt aus MAIL_KONTAKT bzw. MAIL_ABSENDER (functions/api/umgebung.js), damit sie nur an einer Stelle steht.
   telefon: Pflichtangabe in Widerrufsbelehrung und Vertragsbestätigung (Art. 246a § 1 EGBGB); bis sie eingetragen ist, bleibt sie
   leer, und die Rechtsseiten zeigen einen Platzhalter, der die Kasse im Live-Modus geschlossen hält (recht.js). */
export const ANBIETER = {
  name: 'Patrick Kies',
  strasse: 'Postweg 35',
  ort: '33442 Herzebrock-Clarholz',
  land: 'Deutschland',
  telefon: ''
};

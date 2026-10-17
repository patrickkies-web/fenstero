/* eeziframes · Anbieter für E-Mails und Bestätigungen (dieselben Angaben wie im Impressum, web/impressum/index.html; die Prüfsuite
   vergleicht beides).
   mail: Kontaktadresse in Vertragsbestätigung, Eingangsbestätigung eines Widerrufs und als Antwortadresse; MAIL_KONTAKT bei
   Cloudflare geht vor (functions/api/umgebung.js). Das Postfach liegt bei Zoho Mail (Datenschutzerklärung, Abschnitt 7).
   telefon: Pflichtangabe in Widerrufsbelehrung und Vertragsbestätigung (Art. 246a § 1 EGBGB). */
export const ANBIETER = {
  name: 'Patrick Kies',
  strasse: 'Postweg 35',
  ort: '33442 Herzebrock-Clarholz',
  land: 'Deutschland',
  mail: 'ask@eeziframes.com',
  telefon: '0152 56950998'
};

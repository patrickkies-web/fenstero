/* eeziframes · API der Instanz-Hosts: Start eines virtuellen Links, Ping für die Domain-Prüfung, Bestätigung von Empfängern,
   Fotoseite für Essential/Plus (Strang A, Bauplan §3 A.4; Vertrag docs/INSTANZEN.md)
   STUB aus dem Fundament (S0): keine Routen; /api/instanz/… antwortet 404 wie jede unbekannte Adresse. Vorgesehen:
     POST /api/instanz/start → { ok, code, betrieb, du, auftritt }
     GET  /api/instanz/ping  → { ok, instanz: id8, version }
     GET  /api/instanz/bestaetigen?t=   (Hauptdomain) Empfänger- und Zugangsbestätigung
     GET  /api/instanz/fotos/:code?t=   Fotoseite (Token Zweck fotos, nur Haupthost der Instanz) */
export const INSTANZ_API = {};

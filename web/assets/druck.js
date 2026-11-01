/* eeziframes · Druck auf dem iPhone: iOS-Safari zeigt :active erst mit einem touchstart. Ein leerer passiver Lauscher genügt; ohne
   Skript bleibt alles bedienbar (Rechtstexte und Fehlerseite, CSP ohne Inline-Skript). */
document.addEventListener('touchstart', function () {}, { passive: true });

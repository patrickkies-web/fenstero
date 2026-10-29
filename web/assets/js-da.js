/* Kennzeichnet die Seite als Seite mit JavaScript (html.ez-js), damit die Auftritte der Design-DNA laufen; ohne JavaScript steht alles sofort. Eigene Datei, weil die CSP (functions/seo.js, web/_headers) kein Inline-Skript erlaubt. */
document.documentElement.classList.add('ez-js');

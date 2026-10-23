/* eeziframes · Auslieferung auf den Hosts der Konfigurator-Instanzen (Strang A, Bauplan §3 A.3; Vertrag window.KONFIG in docs/INSTANZEN.md)
   worker.js ruft ausliefern() für jeden Host auf, der nicht die Hauptdomain ist. Ausgeliefert wird nur, was die Instanz braucht, nach der
   Status-Matrix (Instanzregeln.darf) und einer Positivliste; alles andere ist eine neutrale Fehlerseite in der Marke des Betriebs (E23).
     unbekannter Host                  404 neutral (kein eeziframes, noindex)
     Alias-Host, www.                  301 auf den Haupthost (POST: 308)
     /, /index.html                    App (web/app/index.html) mit ersetztem Kopf; Status nach §2.7 (503 in Vorbereitung, 503 mit Kontakt
                                       bei Pause, 410 nach dem Ende); mit gültigem Vorschau-Cookie auch in der Einrichtung
     /?vorschau=<token>                setzt das Cookie __Host-vorschau (Token Zweck vorschau, verwalten.vorschauToken) und leitet auf / um
     /app, /app/…                      301 auf /
     /config.js                        window.KONFIG der Instanz (konfigJs), max-age=60
     /favicon.svg, /apple-touch-icon.png, /og.png, /manifest.webmanifest   je Merkmal icons: Bilder der Marke bzw. Initiale, sonst eeziframes
     /marke/<v>/<datei>                Bild der veröffentlichten Marke (Bucket marke), unveränderlich zwischengespeichert
     /impressum/, /datenschutz/        functions/instanz/recht.js
     /robots.txt, /sitemap.xml         nach Indexierung (Merkmal und Schalter der Instanz, E26, K2.9)
     /betrieb, /betrieb/               Dashboard-Hülle (web/betrieb/index.html, Strang E), nur mit Merkmal dashboard
     /assets/*, /fonts/*, /vendor/*, /bilder/*   Dateien aus web/
     /api/…                            Positivliste: /api/status, /api/ki, /api/instanz/*, /api/link/*, /api/aufmass, /api/konto* (nur dashboard)
   Alles im Kopf, im SVG und in /config.js läuft durch esc() bzw. JSON.stringify; Ersetzungen immer mit einer Funktion (K1.11). */
import '../../web/assets/pakete.js';
import '../../web/assets/instanzregeln.js';
import { konfig, json } from '../api/umgebung.js';
import { speicher } from '../api/speicher.js';
import { api } from '../api/router.js';
import { SICHERHEIT, SPERRE } from '../seo.js';
import { ablage } from '../api/fotos.js';
import { tokenPruefen } from '../api/sitzung.js';
import { zaehlen } from '../api/statistik.js';
import { onRequestGet as kiBereit, kiInstanz } from '../api/ki.js';
import { impressumSeite, datenschutzSeite } from './recht.js';
import { farbeVon } from './mandant.js';
import { bildTyp } from '../api/blatt-server.js';

const P = () => globalThis.Pakete;
const R = () => globalThis.Instanzregeln;
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const LOKAL_HOST = /(^|\.)localhost$/;
const VORSCHAU = '__Host-vorschau';
const EEZI = 'https://eeziframes.com/fuer-fensterbauer/';

/* Adresse der Instanz: im Netz https://<haupthost>, lokal (*.localhost) Protokoll und Port der Anfrage */
export function basisVon(inst, url) {
  if (url && LOKAL_HOST.test(url.hostname)) return url.protocol + '//' + (inst && inst.haupthost ? inst.haupthost : url.hostname) + (url.port ? ':' + url.port : '');
  return 'https://' + ((inst && inst.haupthost) || (url && url.hostname) || '');
}
/* Suchmaschinen: nur mit Merkmal (indexierung 'start') und Schalter an der Instanz, und nur die Startseite */
export const indexiert = (inst) => !!(inst && inst.m && inst.m.indexierung === 'start' && inst.indexierung && inst.status === 'aktiv');

function kopfzeilen(o) {
  o = o || {};
  const h = new Headers({ 'content-type': o.typ || 'text/html; charset=utf-8', 'cache-control': o.cache || 'no-store' });
  for (const [k, v] of Object.entries(SICHERHEIT)) h.set(k, v);
  if (!o.index) h.set('X-Robots-Tag', SPERRE);
  if (o.kanonisch) h.set('Link', '<' + o.kanonisch + '>; rel="canonical"');
  if (o.extra) Object.entries(o.extra).forEach(([k, v]) => h.set(k, v));
  return h;
}
const antwort = (body, status, o) => new Response(body, { status: status || 200, headers: kopfzeilen(o) });

/* ---------- Neutrale Seiten: Fehler, in Vorbereitung, pausiert, beendet ---------- */
const STIL = ':root{color-scheme:dark}body{margin:0;background:#161616;color:#f3f2ee;font:500 17px/1.6 Inter,system-ui,sans-serif}main{max-width:640px;margin:0 auto;padding:48px 16px 64px}' +
  'h1{font-size:32px;line-height:1.2;font-weight:800;margin:8px 0 16px}p{margin:0 0 12px;color:#c9c8c3}a{color:#f3f2ee}.klein{font-size:13px;color:#93928d}' +
  '.knopf{display:inline-block;margin-top:12px;padding:12px 20px;border-radius:999px;background:#f1f0ea;color:#161616;font-weight:800;text-decoration:none}.kontakt a{display:block;margin:6px 0}';
export function fehlerSeite(status, inst, o) {
  o = o || {};
  const name = inst && inst.name ? inst.name : '', art = o.art || (status === 404 ? 'fehlt' : status === 410 ? 'beendet' : 'stoerung');
  const T = {
    fehlt: ['Seite nicht gefunden', 'Diese Seite gibt es nicht.', 'Vielleicht ist die Adresse unvollständig.'],
    vorbereitung: ['In Vorbereitung', 'Hier entsteht gerade etwas.', 'Diese Seite ist bald für Sie da. Bitte schauen Sie später noch einmal vorbei.'],
    pausiert: ['Gerade nicht erreichbar', 'Der Fensterplaner ist gerade nicht erreichbar.', 'Für Ihre Anfrage erreichen Sie uns direkt:'],
    beendet: ['Nicht mehr verfügbar', 'Diese Seite gibt es nicht mehr.', ''],
    stoerung: ['Gerade nicht erreichbar', 'Gerade nicht erreichbar.', 'Bitte versuchen Sie es in ein paar Minuten noch einmal.']
  }[art] || ['Fehler', 'Da ist etwas schiefgegangen.', ''];
  const mitName = name && (art === 'fehlt' || art === 'pausiert');
  const k = inst && inst.kontakt ? inst.kontakt : {}, tel = String(k.tel || '').trim(), mail = String(k.mail || '').trim();
  const kontakt = art === 'pausiert' && (tel || mail) ? '<p class="kontakt">' + (tel ? '<a href="tel:' + esc(tel.replace(/[^\d+]/g, '')) + '">' + esc(tel) + '</a>' : '') + (mail ? '<a href="mailto:' + esc(mail) + '">' + esc(mail) + '</a>' : '') + '</p>' : '';
  const html = '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>' + esc(T[0] + (mitName ? ' · ' + name : '')) + '</title>\n' +
    '<meta name="robots" content="noindex">\n<link rel="stylesheet" href="/fonts/fonts.css">\n<style>' + STIL + '</style>\n</head>\n<body>\n<main>\n' +
    (mitName ? '<p class="klein">' + esc(name) + '</p>\n' : '') + '<h1>' + esc(T[1]) + '</h1>\n' + (T[2] ? '<p>' + esc(T[2]) + '</p>\n' : '') + kontakt +
    (art === 'fehlt' && inst ? '<p><a class="knopf" href="/">Zur Startseite</a></p>\n' : '') +
    (inst && art !== 'fehlt' ? '<p class="klein"><a href="/impressum/">Impressum</a> · <a href="/datenschutz/">Datenschutz</a></p>\n' : '') + '</main>\n</body>\n</html>\n';
  return antwort(o.method === 'HEAD' ? null : html, status, { extra: status === 503 ? { 'Retry-After': '600' } : null });
}
const apiFehler = (status, text, extra) => json(Object.assign({ ok: false, fehler: text }, extra || {}), status, { 'X-Robots-Tag': SPERRE });

/* ---------- Kopf der App ---------- */
export function titelVon(inst) {
  const mk = inst.marke || {}, m = inst.m || {};
  const t = (m.startansicht && String(mk.titel || '').trim()) || 'Fenster planen und anfragen · ' + inst.name;
  return t + (m.kennzeichnung === 'deutlich' ? ' · Powered by EEZIframes' : '');
}
function beschreibungVon(inst) {
  const mk = inst.marke || {}, m = inst.m || {};
  return (m.startansicht && String(mk.beschreibung || '').trim()) || 'Planen Sie Ihre neuen Fenster selbst: Maße, Fotos und Wünsche, Schritt für Schritt erklärt. ' + inst.name + ' meldet sich danach mit dem Angebot bei Ihnen.';
}
const bildPfad = (inst, name) => { const mk = inst.marke || {}; return mk.v && name && /^[a-z0-9-]+\.(png|jpe?g|webp)$/.test(String(name)) ? '/marke/' + Number(mk.v) + '/' + name : ''; };
const bilder = (inst) => ((inst.marke || {}).bilder && typeof inst.marke.bilder === 'object' ? inst.marke.bilder : {});
function iconZeilen(inst) {
  if (inst.m.icons !== 'betrieb') return '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<link rel="manifest" href="/manifest.webmanifest">\n';
  const b = bilder(inst), i32 = bildPfad(inst, b.icon32), i180 = bildPfad(inst, b.icon180);
  return '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n' + (i32 ? '<link rel="icon" href="' + esc(i32) + '" type="image/png" sizes="32x32">\n' : '') +
    (i180 ? '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n' : '') + '<link rel="manifest" href="/manifest.webmanifest">\n';
}
const hatOg = (inst) => inst.m.icons !== 'betrieb' || !!bildPfad(inst, bilder(inst).og);
const weichRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ', .14)'; };

/* o: { basis (Adresse der Instanz), titel (statt des Titels der App), index (Startseite in Suchmaschinen) } */
export function kopf(html, inst, env, o) {
  o = o || {};
  const titel = o.titel || titelVon(inst), beschr = beschreibungVon(inst), basis = o.basis || 'https://' + inst.haupthost, f = farbeVon(inst);
  let h = String(html);
  h = h.replace(/<title>[\s\S]*?<\/title>/, () => '<title>' + esc(titel) + '</title>');
  h = h.replace(/<meta name="description" content="[^"]*">/, () => '<meta name="description" content="' + esc(beschr) + '">');
  h = h.replace(/<meta property="og:site_name" content="[^"]*">/, () => '<meta property="og:site_name" content="' + esc(inst.name) + '">');
  h = h.replace(/<meta property="og:title" content="[^"]*">/, () => '<meta property="og:title" content="' + esc(titel) + '">');
  h = h.replace(/<meta property="og:description" content="[^"]*">/, () => '<meta property="og:description" content="' + esc(beschr) + '">');
  if (hatOg(inst)) {
    h = h.replace(/<meta property="og:image" content="[^"]*">/, () => '<meta property="og:image" content="' + esc(basis + '/og.png') + '">');
    h = h.replace(/<meta property="og:image:alt" content="[^"]*">/, () => '<meta property="og:image:alt" content="' + esc(inst.name) + '">');
  } else h = h.replace(/<meta property="og:image[^>]*>\n?/g, () => '').replace(/<meta name="twitter:card" content="summary_large_image">/, () => '<meta name="twitter:card" content="summary">');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, () => '<meta name="theme-color" content="#161616">');
  h = h.replace(/<link rel="icon"[^>]*>\n?/g, () => '').replace(/<link rel="apple-touch-icon"[^>]*>\n?/g, () => '').replace(/<link rel="manifest"[^>]*>\n?/g, () => '');
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, () => '');
  h = h.replace(/<link rel="canonical"[^>]*>\n?/g, () => '');
  const dazu = iconZeilen(inst) + (o.index ? '<link rel="canonical" href="' + esc(basis + '/') + '">\n' : '') +
    (f.akzent ? '<style>:root{--accent:' + f.akzent + ';--accent-soft:' + weichRgb(f.akzent) + '}</style>\n' : '');
  h = h.replace('</head>', () => dazu + '</head>');
  return h;
}
/* Text vor dem Start der App (sonst Werbetext von eeziframes): neutral, mit dem Namen des Betriebs */
function vorabText(inst) {
  const m = inst.m || {};
  const fuss = '<a href="/impressum/">Impressum</a><a href="/datenschutz/">Datenschutz</a>' +
    (m.kennzeichnung === 'deutlich' ? '<a href="' + EEZI + '" rel="noopener" referrerpolicy="no-referrer">Powered by EEZIframes</a>' : m.kennzeichnung === 'dezent' ? '<span>Konfigurator von eeziframes</span>' : '');
  return '<div class="vorab">\n<main class="rg">\n  <p class="eyebrow">' + esc(inst.name) + '</p>\n  <h1>Fenster planen und anfragen</h1>\n  <div class="rg-kurz">\n    <p>Hier planen Sie Ihre neuen Fenster selbst: Maße, Fotos und Wünsche, Schritt für Schritt erklärt. ' + esc(inst.name) + ' meldet sich danach mit dem Angebot bei Ihnen.</p>\n  </div>\n</main>\n' +
    '<footer class="rg-fuss"><div>' + fuss + '</div></footer>\n</div></div>\n<noscript>';
}
export function appSeite(html, inst, env, o) {
  let h = kopf(html, inst, env, o);
  h = h.replace(/<div class="vorab">[\s\S]*?<\/div><\/div>\s*<noscript>/, () => vorabText(inst));
  h = h.replace(/(<noscript><p[^>]*>)[\s\S]*?(<\/p><\/noscript>)/, (x, a, b) => a + 'Zum Planen braucht diese Seite JavaScript. Bitte schalten Sie es in Ihrem Browser ein.' + b);
  return h;
}

/* ---------- /config.js ---------- */
export function konfigInhalt(inst) {
  const m = inst.m || {}, mk = inst.marke || {}, st = mk.start && typeof mk.start === 'object' ? mk.start : {}, b = bilder(inst), f = farbeVon(inst);
  const startBilder = m.fotos > 0 ? (Array.isArray(b.start) ? b.start : []).slice(0, m.fotos).map((n) => bildPfad(inst, n)).filter(Boolean) : [];
  return {
    marke: inst.name, pilot: false, ki: '/api/ki', impressum: '/impressum/', datenschutz: '/datenschutz/',
    instanz: {
      id: inst.id8, v: inst.version, host: inst.haupthost, name: inst.name, du: !!inst.du, status: inst.status, vorschau: !!inst.vorschau, demo: !!inst.demo,
      m: P().oeffentlich(m), auftritt: inst.auftritt,
      start: m.startansicht ? { kicker: String(st.kicker || ''), ueberschrift: String(st.ueberschrift || ''), text: String(st.text || ''), bilder: startBilder } : { kicker: '', ueberschrift: '', text: '', bilder: startBilder },
      farbe: f.farbe, akzent: f.akzent, kontakt: { tel: (inst.kontakt || {}).tel || '', mail: (inst.kontakt || {}).mail || '' },
      logo: m.logo ? bildPfad(inst, b.logo) : '', grenzen: { fenster: R().GRENZEN.fenster }
    }
  };
}
export function konfigJs(inst) {
  return '/* Einstellungen dieses Fensterplaners (vom Server erzeugt) */\nwindow.KONFIG = ' +
    JSON.stringify(konfigInhalt(inst)).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, (c) => (c === '\u2028' ? '\\u2028' : '\\u2029')) + ';\n';
}

/* ---------- Icons, Manifest ---------- */
const ZUSATZ = /^(Fensterbau|Fenster|Glaserei|Schreinerei|Tischlerei|Bauelemente|Fensterbaubetrieb)\s+/i;
/* erster Buchstabe (oder Ziffer) ohne Zusatz wie „Fensterbau“, Anführungszeichen und Zeichen davor zählen nicht (wie einladung.js) */
const ersterBuchstabe = (t) => { const m = /[\p{L}\p{N}]/u.exec(String(t || '')); return m ? m[0] : ''; };
const initiale = (name) => ((ersterBuchstabe(String(name || '').replace(ZUSATZ, '').trim()) || ersterBuchstabe(name) || 'F').toUpperCase());
function aufFarbe(hex) {
  const n = parseInt(hex.slice(1), 16), l = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2] > 0.25 ? '#161616' : '#ffffff';
}
export function initialSvg(inst) {
  const f = farbeVon(inst).farbe || '#f1f0ea';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="' + esc(f) + '"/><text x="32" y="44" text-anchor="middle" font-family="Inter,Arial,Helvetica,sans-serif" font-size="36" font-weight="800" fill="' + aufFarbe(f) + '">' + esc(initiale(inst.name)) + '</text></svg>\n';
}
async function markeBild(env, inst, name, request) {
  const k = konfig(env), ab = ablage(k, 'marke'), mk = inst.marke || {};
  if (!ab || !mk.v || !name) return null;
  const pfad = 'instanz/' + inst.id + '/' + Number(mk.v) + '/' + name;
  const cache = typeof caches !== 'undefined' && caches.default ? caches.default : null, schluessel = cache ? new Request(new URL('/__marke/' + pfad, request.url).href) : null;
  if (cache) { try { const c = await cache.match(schluessel); if (c) return c; } catch (e) { /* weiter */ } }
  let u = null; try { u = await ab.holen(pfad); } catch (e) { u = null; }
  if (!u) return null;
  const typ = bildTyp(u); if (!typ) return null;
  const r = new Response(u, { status: 200, headers: { 'content-type': typ, 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; sandbox" } });
  if (cache) { try { await cache.put(schluessel, r.clone()); } catch (e) { /* ohne */ } }
  return r;
}
export function manifest(inst, basis) {
  const b = bilder(inst), icons = [];
  if (inst.m.icons === 'betrieb') {
    [['icon180', '180x180'], ['icon192', '192x192'], ['icon512', '512x512']].forEach(([k, s]) => { const p = bildPfad(inst, b[k]); if (p) icons.push({ src: p, sizes: s, type: 'image/png' }); });
    icons.push({ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' });
  } else icons.push({ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' });
  return { name: inst.name + ' · Fensterplaner', short_name: String(inst.name).slice(0, 24), start_url: '/', scope: '/', display: 'standalone', background_color: '#161616', theme_color: '#161616', lang: 'de', icons: icons, id: basis ? basis + '/' : '/' };
}
export async function icons(pfad, inst, env, request) {
  const eezi = inst.m.icons !== 'betrieb', b = bilder(inst);
  const datei = async (p) => { const r = await env.ASSETS.fetch(new Request(new URL(p, request.url).href, { method: 'GET' })); return r.status === 200 ? new Response(r.body, { status: 200, headers: { 'content-type': r.headers.get('content-type') || '', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } }) : null; };
  if (pfad === '/favicon.svg') return eezi ? datei(pfad) : new Response(initialSvg(inst), { status: 200, headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff', 'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'" } });
  if (pfad === '/apple-touch-icon.png') return eezi ? datei(pfad) : markeBild(env, inst, b.icon180, request);
  if (pfad === '/og.png') return eezi ? datei(pfad) : markeBild(env, inst, b.og, request);
  return null;
}

/* ---------- robots.txt, sitemap.xml ---------- */
export function robots(inst, basis) {
  if (!indexiert(inst)) return '# ' + inst.name + ' · Fensterplaner\n# Seiten tragen noindex; damit Suchmaschinen das lesen, ist nichts gesperrt\nUser-agent: *\nAllow: /\n';
  return '# ' + inst.name + ' · Fensterplaner\nUser-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /betrieb/\n\nSitemap: ' + (basis || 'https://' + inst.haupthost) + '/sitemap.xml\n';
}
const sitemap = (basis) => '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + esc(basis + '/') + '</loc></url>\n</urlset>\n';

/* ---------- Vorschau-Cookie ---------- */
function cookieWert(request, name) {
  const m = new RegExp('(?:^|;\\s*)' + name.replace(/-/g, '\\-') + '=([^;\\s]+)').exec(request.headers.get('cookie') || '');
  return m ? m[1] : '';
}
async function vorschauGueltig(k, inst, token) {
  if (!token) return null;
  const d = await tokenPruefen(k, 'vorschau', token);
  return d && d.i === inst.id ? d : null;
}

/* ---------- API auf dem Instanz-Host (Positivliste und Status-Matrix) ---------- */
function bereichFuer(method, pfad) {
  if (pfad === '/api/aufmass') return 'schreiben';
  if (/^\/api\/link\//.test(pfad)) return method === 'GET' || method === 'HEAD' ? 'link' : 'schreiben';
  if (pfad === '/api/instanz/start') return 'schreiben';
  return '';
}
function gesperrtAntwort(inst) {
  return inst.status === 'beendet' ? apiFehler(410, 'Diese Seite gibt es nicht mehr.', { status: inst.status }) : apiFehler(503, inst.status === 'pausiert' ? 'Der Fensterplaner ist gerade nicht erreichbar.' : 'Diese Seite ist noch in Vorbereitung.', { status: inst.status });
}
async function apiInstanz(request, env, ctx, inst, pfad) {
  const method = request.method, k = konfig(env), o = { vorschau: inst.vorschau };
  if (pfad === '/api/status') {
    if (method !== 'GET' && method !== 'HEAD') return apiFehler(405, 'Nicht erlaubt.');
    return json({ ok: true, daten: k.daten, ki: !!k.ki && R().darf(inst.status, 'ki', o), post: !!k.post, instanz: true, zahlung: false, konten: false, status: inst.status, vorschau: !!inst.vorschau });
  }
  if (pfad === '/api/ki') {
    if (!R().darf(inst.status, 'ki', o)) return gesperrtAntwort(inst);
    if (method === 'GET' || method === 'HEAD') return kiBereit({ request, env });
    if (method === 'POST') return kiInstanz({ request, env, instanz: inst, waitUntil: (p) => (ctx && ctx.waitUntil ? ctx.waitUntil(p) : p) });
    return new Response(null, { status: 405, headers: { allow: 'GET, POST' } });
  }
  const erlaubt = pfad.startsWith('/api/instanz/') || pfad.startsWith('/api/link/') || pfad === '/api/aufmass' || (inst.m.dashboard && (pfad === '/api/konto' || pfad.startsWith('/api/konto/')));
  if (!erlaubt) return apiFehler(404, 'not_found');
  const bereich = bereichFuer(method, pfad);
  if (bereich && !R().darf(inst.status, bereich, o)) return gesperrtAntwort(inst);
  const r = await api(request, env, ctx, inst);
  return r || apiFehler(404, 'not_found');
}

/* ---------- Auslieferung ---------- */
export async function ausliefern(request, env, ctx, inst) {
  const url = new URL(request.url), pfad = url.pathname, method = request.method, istApi = pfad.startsWith('/api/');
  if (inst === null || inst === undefined) return istApi ? apiFehler(404, 'not_found') : fehlerSeite(404, null, { method: method });
  if (inst.stoerung) return istApi ? apiFehler(503, 'Gerade nicht erreichbar. Bitte gleich noch einmal.') : fehlerSeite(503, null, { art: 'stoerung', method: method });
  /* eine Adresse je Instanz: Alias-Domains und www. auf den Haupthost */
  const lokal = LOKAL_HOST.test(url.hostname);
  if (!inst.haupt || url.hostname.toLowerCase() !== inst.haupthost) {
    const ziel = new URL(url.href); ziel.hostname = inst.haupthost; if (!lokal) { ziel.protocol = 'https:'; ziel.port = ''; }
    return new Response(null, { status: method === 'GET' || method === 'HEAD' ? 301 : 308, headers: { location: ziel.href, 'cache-control': 'public, max-age=3600' } });
  }
  const k = konfig(env), basis = basisVon(inst, url);
  /* Vorschau: Link mit ?vorschau=<token> setzt das Cookie und leitet ohne Token weiter */
  /* ?vorschau=1 ist kein Token, sondern „Als Kunde öffnen“ aus dem Betriebsbereich (app.js VORSCHAU_URL): bleibt in der Adresse */
  const tokenNeu = url.searchParams.get('vorschau');
  if (tokenNeu && tokenNeu !== '1' && (method === 'GET' || method === 'HEAD') && !istApi) {
    const d = await vorschauGueltig(k, inst, tokenNeu), ziel = new URL(url.href); ziel.searchParams.delete('vorschau');
    const h = { location: ziel.pathname.replace(/^\/+/, '/') + ziel.search, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' }; // nie „//fremd.example“
    if (d) h['set-cookie'] = VORSCHAU + '=' + tokenNeu + '; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=' + Math.max(60, Math.floor(R().FRISTEN.vorschauTage * 86400));
    return new Response(null, { status: 302, headers: h });
  }
  inst = Object.assign({}, inst, { vorschau: !!(await vorschauGueltig(k, inst, cookieWert(request, VORSCHAU))) });
  if (istApi) return apiInstanz(request, env, ctx, inst, pfad);
  if (method !== 'GET' && method !== 'HEAD') return fehlerSeite(404, inst, { method: method });
  const o = { vorschau: inst.vorschau }, kopfOnly = method === 'HEAD';
  const statusSeite = () => { const s = R().seite(inst.status, o); return fehlerSeite(s.code, inst, { art: s.art || 'beendet', method: method }); };

  if (pfad === '/' || pfad === '/index.html') {
    if (!R().darf(inst.status, 'seite', o)) return statusSeite();
    const r = await env.ASSETS.fetch(new Request(new URL('/app/', url).href, { method: 'GET' }));
    if (r.status !== 200) return fehlerSeite(503, inst, { art: 'stoerung', method: method });
    const index = indexiert(inst) && pfad === '/';
    const html = appSeite(await r.text(), inst, env, { basis: basis, index: index });
    if (ctx && ctx.waitUntil && k.daten && !kopfOnly) ctx.waitUntil(zaehlen(k, speicher(k), ['inst:' + inst.id8 + ':aufruf']).catch(() => false));
    return antwort(kopfOnly ? null : html, 200, { index: index, cache: 'no-cache', kanonisch: index ? basis + '/' : '' });
  }
  if (pfad === '/app' || pfad.startsWith('/app/')) return new Response(null, { status: 301, headers: { location: '/' + url.search, 'cache-control': 'public, max-age=3600' } });
  if (pfad === '/config.js') {
    /* /config.js?betrieb=1 lädt nur die Hülle des Dashboards (Strang E): Sie braucht die Marke auch in Vorbereitung, Pause und nach dem
       Ende (Export), solange das Paket ein Dashboard hat; die öffentliche App bleibt nach der Status-Matrix zu */
    const fuerDashboard = url.searchParams.get('betrieb') === '1' && !!inst.m.dashboard;
    if (fuerDashboard) return new Response(kopfOnly ? null : konfigJs(inst), { status: 200, headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'X-Robots-Tag': SPERRE } });
    if (!R().darf(inst.status, 'seite', o)) return new Response('/* nicht verfügbar */\n', { status: 503, headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
    return new Response(kopfOnly ? null : konfigJs(inst), { status: 200, headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': inst.vorschau ? 'private, no-store' : 'public, max-age=60', 'x-content-type-options': 'nosniff', 'X-Robots-Tag': SPERRE } });
  }
  if (pfad === '/favicon.svg' || pfad === '/apple-touch-icon.png' || pfad === '/og.png') return (await icons(pfad, inst, env, request)) || fehlerSeite(404, inst, { method: method });
  if (pfad === '/manifest.webmanifest') return new Response(kopfOnly ? null : JSON.stringify(manifest(inst, basis)), { status: 200, headers: { 'content-type': 'application/manifest+json; charset=utf-8', 'cache-control': 'public, max-age=300', 'x-content-type-options': 'nosniff', 'X-Robots-Tag': SPERRE } });
  const mb = /^\/marke\/(\d{1,6})\/([a-z0-9-]{1,40}\.(?:png|jpe?g|webp))$/.exec(pfad);
  if (mb) {
    const r = Number(mb[1]) === Number((inst.marke || {}).v) ? await markeBild(env, inst, mb[2], request) : null;
    return r || fehlerSeite(404, inst, { method: method });
  }
  if (pfad === '/impressum' || pfad === '/datenschutz') return new Response(null, { status: 301, headers: { location: pfad + '/', 'cache-control': 'public, max-age=3600' } });
  if (pfad === '/impressum/' || pfad === '/datenschutz/') return antwort(kopfOnly ? null : (pfad === '/impressum/' ? impressumSeite(inst) : datenschutzSeite(inst)), 200, { cache: 'no-cache' });
  if (pfad === '/robots.txt') return new Response(kopfOnly ? null : robots(inst, basis), { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
  if (pfad === '/sitemap.xml') return indexiert(inst) ? new Response(kopfOnly ? null : sitemap(basis), { status: 200, headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } }) : fehlerSeite(404, inst, { method: method });
  if (pfad === '/betrieb') return inst.m.dashboard ? new Response(null, { status: 301, headers: { location: '/betrieb/', 'cache-control': 'public, max-age=3600' } }) : fehlerSeite(404, inst, { method: method });
  if (pfad === '/betrieb/') {
    if (!inst.m.dashboard) return fehlerSeite(404, inst, { method: method });
    const r = await env.ASSETS.fetch(new Request(new URL('/betrieb/', url).href, { method: 'GET' }));
    if (r.status !== 200) return fehlerSeite(404, inst, { method: method });
    return antwort(kopfOnly ? null : kopf(await r.text(), inst, env, { basis: basis, titel: inst.name + ' · Projekte' }), 200, { cache: 'no-store' });
  }
  if (/^\/(assets|fonts|vendor|bilder)\//.test(pfad)) {
    const r = await env.ASSETS.fetch(request);
    return r.status === 404 ? fehlerSeite(404, inst, { method: method }) : r;
  }
  return fehlerSeite(404, inst, { method: method });
}

/* eeziframes · Eigene Statistik ohne Cookies, ohne Skript im Browser, ohne Kennungen.
   Gezählt wird auf dem Server, während er eine Seite ausliefert (worker.js bzw. scripts/dev-server.mjs → seitenaufruf), und bei
   Vorgängen, die ohnehin über den Server laufen (ereignis: Kasse geöffnet, Aufmaßblatt gekauft, Aufmaß an einen Betrieb gesendet,
   Betrieb registriert …). Gespeichert werden nur Tageszähler (Tabelle statistik: Tag, Schlüssel, Anzahl), keine IP-Adresse, keine
   Browser-Kennung, keine Liste einzelner Aufrufe. Was der Browser bei jedem Seitenaufruf ohnehin mitschickt (Adresse, Herkunft,
   Browser-Kennung) wird in diesem Moment zu groben Klassen verdichtet und dann vergessen; Cloudflare liefert das Land.
   Rechtsgrundlage und Gründe: web/datenschutz/ (Abschnitt „Eigene Statistik“), docs/ZENTRALE.md.

   Nicht gezählt: Bots einzeln (nur als Bot-Familie), Vorab-Ladevorgänge (prefetch), Aufrufe mit „Global Privacy Control“ oder
   „Do Not Track“, Aufrufe des Inhabers, solange er in der Zentrale angemeldet ist, die Zentrale selbst, Fehlerseiten.
   Besuche: Ein Aufruf, der nicht von einer eigenen Seite kommt, beginnt einen Besuch (Einstieg). Nur Einstiege tragen Herkunft,
   Gerät, Browser, System und Land, damit jeder Besuch einmal zählt. Eindeutige Besucher werden bewusst nicht gezählt: Dafür
   bräuchte es eine Kennung (etwa einen Hash aus IP-Adresse und Browser), und die wäre wieder personenbezogen. */
import { konfig } from './umgebung.js';
import { speicher } from './speicher.js';
import { istSeite } from '../seo.js';

/* Seiten, die einzeln gezählt werden; alles andere unter /app/ und /ratgeber/ zählt zur jeweiligen Übersicht */
export const SEITEN_NAMEN = { '/': 'Startseite', '/app/': 'App', '/fuer-fensterbauer/': 'Für Fensterbauer', '/ratgeber/': 'Ratgeber', '/ratgeber/fenster-ausmessen/': 'Ratgeber: Fenster ausmessen', '/ratgeber/aufmassblatt-fenster/': 'Ratgeber: Aufmaßblatt', '/ratgeber/fenster-austauschen/': 'Ratgeber: Fenster austauschen', '/impressum/': 'Impressum', '/datenschutz/': 'Datenschutz' };
export function seitePfad(p) {
  p = String(p || '/').replace(/index\.html$/, '');
  if (!p.endsWith('/')) p += '/';
  if (SEITEN_NAMEN[p]) return p;
  if (p.startsWith('/app/')) return '/app/';
  if (p.startsWith('/ratgeber/')) return '/ratgeber/';
  return null;
}

/* Tag in deutscher Zeit (der Inhaber denkt in deutschen Tagen) */
const TAG = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' });
export const tagBerlin = (d) => TAG.format(d || new Date());
export const tagVor = (n, d) => tagBerlin(new Date((d ? d.getTime() : Date.now()) - n * 864e5));

/* Bots und Link-Vorschauen: nur die Familie zählt, die Reihenfolge entscheidet (Spezielles zuerst) */
const BOTS = [
  ['Linkvorschau (WhatsApp, Telegram …)', /WhatsApp|TelegramBot|Slackbot|Discordbot|LinkedInBot|Twitterbot|SkypeUriPreview|Iframely|Embedly|Pinterestbot|redditbot/i],
  ['Google', /Googlebot|Google-InspectionTool|GoogleOther|Storebot-Google|AdsBot-Google|Mediapartners-Google|Google-Extended|APIs-Google/i],
  ['Bing', /bingbot|BingPreview|msnbot|adidxbot/i],
  ['ChatGPT (Suche)', /OAI-SearchBot|ChatGPT-User/i], ['OpenAI (GPTBot)', /GPTBot/i],
  ['Claude', /ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai/i],
  ['Perplexity', /Perplexity/i], ['Apple', /Applebot/i], ['DuckDuckGo', /DuckDuckBot|DuckAssistBot/i],
  ['Meta', /facebookexternalhit|meta-externalagent|meta-externalfetcher|Facebot/i],
  ['Yandex', /Yandex/i], ['Baidu', /Baiduspider/i], ['Ahrefs, Semrush & Co.', /AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|SeznamBot|BLEXBot|DataForSeoBot/i],
  ['Andere Bots', /bot\b|bot\/|crawl|spider|slurp|scrapy|fetch|scan|monitor|curl\/|wget|python|httpclient|okhttp|axios|node-fetch|undici|go-http|java\/|headless|lighthouse|pagespeed|uptime|feed|preview|validator|checker/i]
];
export function botFamilie(ua) {
  if (!ua) return 'Ohne Browser-Kennung';
  for (const [name, muster] of BOTS) if (muster.test(ua)) return name;
  return '';
}
export function geraet(ua) {
  if (/iPad|Tablet|PlayBook|Silk|Kindle|Android(?!.*Mobile)/i.test(ua)) return 'Tablet';
  if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) return 'Telefon';
  return 'Computer';
}
export function browserName(ua) {
  if (/Edg(e|A|iOS)?\//.test(ua)) return 'Edge';
  if (/OPR\/|Opera/.test(ua)) return 'Opera';
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/Firefox\/|FxiOS/.test(ua)) return 'Firefox';
  if (/CriOS|Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Andere';
}
export function systemName(ua) {
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Mac OS X|Macintosh/.test(ua)) return 'macOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Andere';
}
/* Herkunft eines Besuchs: Kampagne (utm_source), QR-Code des Aufmaßblatts, Suchmaschine, KI-Assistent, Netzwerk oder die Domain */
const QUELLEN = [
  ['Gemini', /(^|\.)gemini\.google\.com$/], ['Google', /(^|\.)google\.[a-z.]+$|^com\.google\.android/], ['Bing', /(^|\.)bing\.com$/], ['DuckDuckGo', /(^|\.)duckduckgo\.com$/],
  ['Ecosia', /(^|\.)ecosia\.org$/], ['Yahoo', /(^|\.)yahoo\.[a-z.]+$/], ['Qwant', /(^|\.)qwant\.com$/], ['Startpage', /(^|\.)startpage\.com$/],
  ['ChatGPT', /(^|\.)(chatgpt\.com|openai\.com)$/], ['Perplexity', /(^|\.)perplexity\.ai$/], ['Claude', /(^|\.)claude\.ai$/], ['Copilot', /(^|\.)copilot\.microsoft\.com$/],
  ['Facebook', /(^|\.)(facebook\.com|fb\.com|fb\.me)$/], ['Instagram', /(^|\.)instagram\.com$/], ['LinkedIn', /(^|\.)(linkedin\.com|lnkd\.in)$/],
  ['X (Twitter)', /(^|\.)(t\.co|twitter\.com|x\.com)$/], ['YouTube', /(^|\.)(youtube\.com|youtu\.be)$/], ['Pinterest', /(^|\.)pinterest\.[a-z.]+$/], ['Reddit', /(^|\.)reddit\.com$/],
  ['WhatsApp', /(^|\.)(whatsapp\.com|wa\.me)$/], ['E-Mail', /^(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|mail\.yahoo\.com|webmail\..+|mail\..+)$/]
];
/* Kampagnen (?utm_source=…): nur bekannte Namen (und eigene aus der Variablen STATISTIK_KAMPAGNEN, durch Komma getrennt) werden
   einzeln gezählt, alles andere als „Kampagne (andere)“. So landet keine E-Mail-Adresse oder Empfänger-Kennung in der Statistik,
   und niemand kann die Tabelle mit erfundenen Werten füllen. */
const KAMPAGNEN = ['newsletter', 'email', 'mail', 'flyer', 'plakat', 'visitenkarte', 'qr', 'messe', 'partner', 'google', 'googleads', 'bing', 'facebook', 'instagram', 'linkedin', 'xing', 'youtube', 'tiktok', 'pinterest', 'whatsapp', 'telegram', 'signal', 'sms', 'chatgpt', 'perplexity', 'aufmassblatt', 'pdf', 'presse', 'blog', 'podcast'];
export function kampagne(wert, env) {
  const w = String(wert || '').trim().toLowerCase();
  if (!w) return '';
  const eigene = String((env && env.STATISTIK_KAMPAGNEN) || '').toLowerCase().split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9_-]{2,30}$/.test(x));
  return KAMPAGNEN.includes(w) || eigene.includes(w) ? w : '(andere)';
}
/* Unbekannte Herkunft: nur die Domain (zwei Ebenen, bei co.uk und Ähnlichem drei), höchstens 100 neue je Tag und Instanz, danach
   „Andere Website“; so bleibt die Tabelle klein, auch wenn jemand erfundene Herkunftsangaben schickt */
const neueHosts = { tag: '', menge: new Set() };
function domain(host) {
  const t = host.split('.'); if (t.length <= 2) return host;
  const zweite = t[t.length - 2], drei = t.length >= 3 && t[t.length - 1].length === 2 && ['co', 'com', 'org', 'net', 'gov', 'ac', 'edu', 'or', 'ne'].includes(zweite);
  return t.slice(drei ? -3 : -2).join('.');
}
export function quelle(referer, url, eigenerHost, env) {
  const utm = url.searchParams.get('utm_source');
  if (utm) return 'Kampagne: ' + kampagne(utm, env);
  if (url.searchParams.get('von') === 'pdf') return 'Aufmaßblatt (QR-Code)';
  if (!referer) return 'Direkt';
  let host = '';
  try { const r = new URL(referer); host = r.protocol === 'android-app:' ? r.host : r.hostname; } catch (e) { return 'Direkt'; }
  host = host.toLowerCase().replace(/^www\./, '');
  if (!host) return 'Direkt';
  if (host === String(eigenerHost || '').toLowerCase().replace(/^www\./, '')) return null; // von einer eigenen Seite: kein neuer Besuch
  for (const [name, muster] of QUELLEN) if (muster.test(host)) return name;
  if (!/^[a-z0-9.-]{1,253}$/.test(host) || !host.includes('.') || /^\d+(\.\d+){3}$/.test(host)) return 'Andere Website';
  const d = domain(host).slice(0, 60), heute = tagBerlin();
  if (neueHosts.tag !== heute) { neueHosts.tag = heute; neueHosts.menge = new Set(); }
  if (!neueHosts.menge.has(d)) { if (neueHosts.menge.size >= 100) return 'Andere Website'; neueHosts.menge.add(d); }
  return d;
}

/* Was ein Seitenaufruf zählt (leer: nichts). Auch für die Prüfsuite exportiert. */
export function schluesselFuer(request, env) {
  const url = new URL(request.url), h = request.headers;
  if (request.method !== 'GET') return [];
  if (h.get('sec-gpc') === '1' || h.get('dnt') === '1') return [];
  if (/prefetch|prerender/i.test(h.get('sec-purpose') || h.get('purpose') || h.get('x-moz') || '')) return [];
  if (/(^|;\s*)__Host-zentrale=/.test(h.get('cookie') || '')) return []; // der Inhaber selbst
  if (['/robots.txt', '/llms.txt', '/sitemap.xml'].includes(url.pathname)) return ['datei:' + url.pathname];
  if (!istSeite(url.pathname)) return [];
  const pfad = seitePfad(url.pathname); if (!pfad) return [];
  const ua = h.get('user-agent') || '', bot = botFamilie(ua);
  if (bot) return ['bot:' + bot];
  const keys = ['aufruf:' + pfad];
  const q = quelle(h.get('referer') || '', url, url.host, env);
  if (q !== null) {
    const cf = request.cf || {}, land = String(cf.country || h.get('cf-ipcountry') || '').toUpperCase();
    keys.push('besuch:' + pfad, 'herkunft:' + q, 'geraet:' + geraet(ua), 'browser:' + browserName(ua), 'system:' + systemName(ua), 'land:' + (/^[A-Z]{2}$/.test(land) && land !== 'XX' && land !== 'T1' ? land : '??'));
  }
  return keys;
}

/* Zählen: ein Aufruf der Datenbankfunktion je Vorgang. Fehlt die Tabelle noch, wird es zehn Minuten lang nicht erneut versucht. */
let ausBis = 0;
export async function zaehlen(k, sp, schluessel) {
  if (!sp || !sp.zaehlen || !schluessel || !schluessel.length || Date.now() < ausBis) return false;
  try {
    const ok = await sp.zaehlen(tagBerlin(), schluessel.map((s) => String(s).slice(0, 120)));
    if (!ok) ausBis = Date.now() + 10 * 60 * 1000;
    return ok;
  } catch (e) { ausBis = Date.now() + 60 * 1000; return false; }
}
export async function seitenaufruf(request, env) {
  const keys = schluesselFuer(request, env); if (!keys.length) return false;
  const k = konfig(env); if (!k.daten) return false;
  return zaehlen(k, speicher(k), keys);
}

/* Auswertung für die Zentrale: Zeitreihe je Tag und Ranglisten je Merkmal über den Zeitraum */
export async function auswerten(sp, tage) {
  tage = [7, 30, 90, 365].includes(+tage) ? +tage : 30;
  const von = tagVor(tage - 1);
  /* Bevorzugt in der Datenbank verdichtet (kleine Antwort); fehlt die Funktion noch, die einzelnen Tageszähler (neueste zuerst) */
  let rows = sp.statistikAuswerten ? await sp.statistikAuswerten(von) : null, verdichtet = rows !== null;
  if (rows === null) rows = await sp.statistikLesen(von);
  if (rows === null) return { ok: true, tabelle: false, tage: tage };
  const liste = [], reihe = new Map();
  for (let i = tage - 1; i >= 0; i--) { const t = tagVor(i); liste.push(t); reihe.set(t, { tag: t, aufrufe: 0, besuche: 0, bots: 0 }); }
  const summen = {};
  for (const r of rows || []) {
    const i = r.schluessel.indexOf(':'), art = r.schluessel.slice(0, i), name = r.schluessel.slice(i + 1), n = Number(r.anzahl) || 0;
    const tagZeile = r.tag ? reihe.get(String(r.tag).slice(0, 10)) : null;
    if (!verdichtet || !r.tag) (summen[art] = summen[art] || new Map()).set(name, ((summen[art] && summen[art].get(name)) || 0) + n);
    if (tagZeile && (!verdichtet || name === '*')) { if (art === 'aufruf') tagZeile.aufrufe += n; else if (art === 'besuch') tagZeile.besuche += n; else if (art === 'bot') tagZeile.bots += n; }
  }
  const rang = (art, namen) => Array.from((summen[art] || new Map()).entries()).map(([name, n]) => ({ name: namen && namen[name] ? namen[name] : name, schluessel: name, n: n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  const ereignisse = {}; for (const [name, n] of (summen.ereignis || new Map()).entries()) ereignisse[name] = n;
  const reiheListe = liste.map((t) => reihe.get(t));
  return {
    ok: true, tabelle: true, tage: tage, von: von, bis: liste[liste.length - 1],
    summe: { aufrufe: reiheListe.reduce((s, x) => s + x.aufrufe, 0), besuche: reiheListe.reduce((s, x) => s + x.besuche, 0), bots: reiheListe.reduce((s, x) => s + x.bots, 0) },
    reihe: reiheListe,
    seiten: rang('aufruf', SEITEN_NAMEN), einstiege: rang('besuch', SEITEN_NAMEN), herkunft: rang('herkunft'), geraet: rang('geraet'), browser: rang('browser'),
    system: rang('system'), land: rang('land'), bots: rang('bot'), dateien: rang('datei'), ereignisse: ereignisse
  };
}

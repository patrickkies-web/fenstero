/* eeziframes · Eigene Statistik ohne Cookies, ohne Skript im Browser, ohne Kennungen.
   Gezählt wird auf dem Server, während er eine Seite ausliefert (worker.js bzw. scripts/dev-server.mjs → seitenaufruf), und bei
   Vorgängen, die ohnehin über den Server laufen (ereignis: Kasse geöffnet, Aufmaßblatt gekauft, Aufmaß an einen Betrieb gesendet,
   Betrieb registriert …). Gespeichert werden nur Zähler je Tag (Tabelle statistik: Tag, Schlüssel, Anzahl), für Besuche, Seitenaufrufe,
   Besuche über Anzeigen und Vorgänge zusätzlich je Stunde (Schlüssel stunde:HH|…), keine IP-Adresse, keine Browser-Kennung, keine
   Liste einzelner Aufrufe. Was der Browser bei jedem Seitenaufruf ohnehin mitschickt (Adresse, Herkunft,
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
/* Kalendertage als JJJJ-MM-TT, von und bis eingeschlossen (reine Datumsrechnung, ohne Uhrzeit und Zeitzone) */
const utc = (t) => Date.UTC(+t.slice(0, 4), +t.slice(5, 7) - 1, +t.slice(8, 10));
export const tagPlus = (t, n) => new Date(utc(t) + n * 864e5).toISOString().slice(0, 10);
export const tageZwischen = (von, bis) => Math.round((utc(bis) - utc(von)) / 864e5) + 1;
export function tageListe(von, bis) { const out = []; for (let t = von; t <= bis && out.length < 4000; t = tagPlus(t, 1)) out.push(t); return out; }

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
  if (/Instagram/.test(ua)) return 'Instagram (App)';
  if (/FBAN|FBAV|FB_IAB|FBIOS/.test(ua)) return 'Facebook (App)';
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
/* Anzeigen: Ein Link aus einer bezahlten Anzeige trägt utm_medium=paid (cpc, paid_social …) oder die Klick-Kennung einer
   Werbeplattform (gclid bei Google, msclkid bei Microsoft …). Gezählt wird nur das Netz, der Wert der Klick-Kennung wird nicht
   gespeichert. fbclid hängt Meta an jeden Link aus Facebook und Instagram, auch ohne Anzeige: Er zählt deshalb nur als Herkunft. */
const BEZAHLT = /^(cpc|ppc|cpm|cpv|paid|paid[_-]?social|paid[_-]?search|social[_-]?paid|paidsocial|ads?|anzeigen?|werbung|sponsored|display|retargeting)$/;
const KLICK = [['gclid', 'Google'], ['gbraid', 'Google'], ['wbraid', 'Google'], ['dclid', 'Google'], ['msclkid', 'Microsoft'], ['ttclid', 'TikTok'], ['li_fat_id', 'LinkedIn'], ['twclid', 'X (Twitter)'], ['epik', 'Pinterest'], ['ScCid', 'Snapchat']];
const NETZE = { facebook: 'Facebook', fb: 'Facebook', instagram: 'Instagram', ig: 'Instagram', meta: 'Meta', msg: 'Messenger', an: 'Meta Audience Network', threads: 'Threads', google: 'Google', googleads: 'Google', adwords: 'Google', youtube: 'YouTube', bing: 'Microsoft', microsoft: 'Microsoft', tiktok: 'TikTok', linkedin: 'LinkedIn', pinterest: 'Pinterest', snapchat: 'Snapchat', x: 'X (Twitter)', twitter: 'X (Twitter)', xing: 'Xing', reddit: 'Reddit' };
export function anzeigeNetz(url) {
  const p = url.searchParams;
  for (const [k, netz] of KLICK) if (p.has(k)) return netz;
  const quelle = String(p.get('utm_source') || '').trim().toLowerCase(), medium = String(p.get('utm_medium') || '').trim().toLowerCase();
  return BEZAHLT.test(medium) ? NETZE[quelle] || (quelle ? 'Andere' : 'ohne Angabe') : '';
}
/* Kampagnenname (utm_campaign) in Kleinbuchstaben, Ziffern und Bindestrichen, höchstens 40 Zeichen; Werte, die nach E-Mail-Adresse,
   Telefonnummer oder Kennung aussehen, zählen als „(andere)“; je Tag und Instanz höchstens 30 neue Namen, danach „(weitere)“ */
const neueKampagnen = { tag: '', menge: new Set() };
export function kampagnenName(wert) {
  const roh = String(wert || '').trim(); if (!roh) return '';
  const w = roh.toLowerCase().replace(/ß/g, 'ss').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  if (!w || /@/.test(roh) || /\d{6,}/.test(w)) return '(andere)';
  const heute = tagBerlin();
  if (neueKampagnen.tag !== heute) { neueKampagnen.tag = heute; neueKampagnen.menge = new Set(); }
  if (!neueKampagnen.menge.has(w)) { if (neueKampagnen.menge.size >= 30) return '(weitere)'; neueKampagnen.menge.add(w); }
  return w;
}
/* Browser in einer App (Instagram, Facebook …) schicken oft keine Herkunft mit; ihre Browser-Kennung verrät die App */
const APPS = [['Instagram', /Instagram/], ['Facebook', /FBAN|FBAV|FB_IAB|FBIOS|\[FB/], ['TikTok', /musical_ly|BytedanceWebview|TikTok/i], ['LinkedIn', /LinkedInApp/], ['Pinterest', /Pinterest\//], ['Snapchat', /Snapchat/]];
function inApp(ua, url) { for (const [name, muster] of APPS) if (muster.test(ua || '')) return name; return url.searchParams.has('fbclid') ? 'Facebook oder Instagram' : ''; }

/* Unbekannte Herkunft: nur die Domain (zwei Ebenen, bei co.uk und Ähnlichem drei), höchstens 100 neue je Tag und Instanz, danach
   „Andere Website“; so bleibt die Tabelle klein, auch wenn jemand erfundene Herkunftsangaben schickt */
const neueHosts = { tag: '', menge: new Set() };
function domain(host) {
  const t = host.split('.'); if (t.length <= 2) return host;
  const zweite = t[t.length - 2], drei = t.length >= 3 && t[t.length - 1].length === 2 && ['co', 'com', 'org', 'net', 'gov', 'ac', 'edu', 'or', 'ne'].includes(zweite);
  return t.slice(drei ? -3 : -2).join('.');
}
export function quelle(referer, url, eigenerHost, env, ua) {
  const netz = anzeigeNetz(url);
  if (netz) return 'Anzeige: ' + netz;
  const utm = url.searchParams.get('utm_source');
  if (utm) return 'Kampagne: ' + kampagne(utm, env);
  if (url.searchParams.get('von') === 'pdf') return 'Aufmaßblatt (QR-Code)';
  if (!referer) return inApp(ua, url) || 'Direkt';
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
  if (/(^|;\s*)__Host-(zentrale|inhaber)=/.test(h.get('cookie') || '')) return []; // der Inhaber selbst (Verwaltung der App oder Zentrale)
  if (['/robots.txt', '/llms.txt', '/sitemap.xml'].includes(url.pathname)) return ['datei:' + url.pathname];
  if (!istSeite(url.pathname)) return [];
  const pfad = seitePfad(url.pathname); if (!pfad) return [];
  const ua = h.get('user-agent') || '', bot = botFamilie(ua);
  if (bot) return ['bot:' + bot];
  const keys = ['aufruf:' + pfad];
  const q = quelle(h.get('referer') || '', url, url.host, env, ua);
  if (q !== null) {
    const cf = request.cf || {}, land = String(cf.country || h.get('cf-ipcountry') || '').toUpperCase();
    keys.push('besuch:' + pfad, 'herkunft:' + q, 'geraet:' + geraet(ua), 'browser:' + browserName(ua), 'system:' + systemName(ua), 'land:' + (/^[A-Z]{2}$/.test(land) && land !== 'XX' && land !== 'T1' ? land : '??'));
    const netz = anzeigeNetz(url), kamp = kampagnenName(url.searchParams.get('utm_campaign'));
    if (netz) keys.push('anzeige:' + netz, 'anzeigeseite:' + pfad);
    if (kamp) keys.push('kampagne:' + kamp);
  }
  return keys;
}

/* Vorgang auf einer Seite, die über einen Anzeigenlink aufgerufen wurde: Die Adresse dieser Seite schickt der Browser bei jeder
   Anfrage an den eigenen Server ohnehin mit (Referer, Referrer-Policy strict-origin-when-cross-origin). Zählt zusätzlich als
   werbung:<Vorgang>; gespeichert wird dabei nichts über die Person. */
export function werbungAus(request) {
  try { const r = new URL(request.headers.get('referer') || ''), u = new URL(request.url); return r.host === u.host ? anzeigeNetz(r) : ''; } catch (e) { return ''; }
}
export const mitWerbung = (schluessel, netz) => (netz && !schluessel.some((s) => s.startsWith('werbung:')) ? schluessel.concat(schluessel.filter((s) => s.startsWith('ereignis:')).map((s) => 'werbung:' + s.slice(9))) : schluessel);
/* Stunde in deutscher Zeit (00 bis 23) und die Stundenzähler zu einem Vorgang: Besuche, Seitenaufrufe, Besuche über Anzeigen,
   Vorgänge (auch aus Anzeigen) */
const STUNDE = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' });
export const stundeBerlin = (d) => STUNDE.format(d || new Date()).padStart(2, '0');
export function mitStunden(schluessel, stunde) {
  const out = schluessel.slice();
  for (const s of schluessel) {
    const art = s.slice(0, s.indexOf(':'));
    if (art === 'aufruf' || art === 'besuch' || art === 'anzeige') out.push('stunde:' + stunde + '|' + art);
    else if (art === 'ereignis' || art === 'werbung') out.push('stunde:' + stunde + '|' + s);
  }
  return out;
}

/* Zählen: ein Aufruf der Datenbankfunktion je Vorgang. Fehlt die Tabelle noch, wird es zehn Minuten lang nicht erneut versucht. */
let ausBis = 0;
export async function zaehlen(k, sp, schluessel) {
  if (!sp || !sp.zaehlen || !schluessel || !schluessel.length || Date.now() < ausBis) return false;
  try {
    const jetzt = new Date(), ok = await sp.zaehlen(tagBerlin(jetzt), mitStunden(schluessel.map((s) => String(s).slice(0, 120)), stundeBerlin(jetzt)));
    if (!ok) ausBis = Date.now() + 10 * 60 * 1000;
    return ok;
  } catch (e) { ausBis = Date.now() + 60 * 1000; return false; }
}
/* Konfigurator-Instanzen (docs/INSTANZEN.md): eigene Zähler je Instanz inst:<id8>:aufruf|start|anfrage|ki|foto, ohne Stunden, ohne
   Herkunft; auf den Domains der Instanzen zählt kein Seitenaufruf von eeziframes (worker.js geht dort nicht über seitenaufruf), und die
   Auswertung unten lässt inst: und budget: (bremse.js) aus den Zahlen von eeziframes */
export const INSTANZ_ARTEN = ['aufruf', 'start', 'anfrage', 'ki', 'foto'];
export function instanzZaehlen(ctx, inst, art) {
  if (!ctx || !inst || !inst.id8 || INSTANZ_ARTEN.indexOf(art) < 0) return false;
  const p = zaehlen(ctx.k, ctx.sp, ['inst:' + inst.id8 + ':' + art]).catch(() => false);
  if (ctx.waitUntil) ctx.waitUntil(p);
  return p;
}
export async function seitenaufruf(request, env) {
  const keys = schluesselFuer(request, env); if (!keys.length) return false;
  const k = konfig(env); if (!k.daten) return false;
  return zaehlen(k, speicher(k), keys);
}

/* Auswertung für die Zentrale: Zeitreihe je Tag und Ranglisten je Merkmal über den Zeitraum.
   zeit: { von, bis } als JJJJ-MM-TT (beide eingeschlossen) oder wie früher eine Zahl von Tagen bis heute (7, 30, 90, 365) */
export async function auswerten(sp, zeit) {
  const heute = tagBerlin();
  let von, bis;
  if (zeit && typeof zeit === 'object') { bis = zeit.bis && zeit.bis < heute ? zeit.bis : heute; von = zeit.von && zeit.von <= bis ? zeit.von : bis; }
  else { const n = [7, 30, 90, 365].includes(+zeit) ? +zeit : 30; bis = heute; von = tagVor(n - 1); }
  const tage = tageZwischen(von, bis), mitEnde = bis < heute ? bis : null;
  /* Bevorzugt in der Datenbank verdichtet (kleine Antwort); fehlt die Funktion noch, die einzelnen Tageszähler (neueste zuerst) */
  let rows = sp.statistikAuswerten ? await sp.statistikAuswerten(von, mitEnde) : null, verdichtet = rows !== null;
  if (rows === null) rows = await sp.statistikLesen(von, mitEnde);
  if (rows === null) return { ok: true, tabelle: false, tage: tage, von: von, bis: bis };
  const liste = tageListe(von, bis), reihe = new Map(liste.map((t) => [t, { tag: t, aufrufe: 0, besuche: 0, bots: 0 }]));
  const summen = {};
  for (const r of rows || []) {
    const i = r.schluessel.indexOf(':'), art = r.schluessel.slice(0, i), name = r.schluessel.slice(i + 1), n = Number(r.anzahl) || 0;
    if (art === 'inst' || art === 'budget') continue; // Zähler der Instanzen und Budgets gehören nicht zu den Zahlen von eeziframes
    const tagZeile = r.tag ? reihe.get(String(r.tag).slice(0, 10)) : null;
    if (!verdichtet && r.tag && !tagZeile) continue; // einzelne Tageszähler außerhalb des Zeitraums
    if (!verdichtet || !r.tag) (summen[art] = summen[art] || new Map()).set(name, ((summen[art] && summen[art].get(name)) || 0) + n);
    if (tagZeile && (!verdichtet || name === '*')) { if (art === 'aufruf') tagZeile.aufrufe += n; else if (art === 'besuch') tagZeile.besuche += n; else if (art === 'bot') tagZeile.bots += n; }
  }
  const rang = (art, namen) => Array.from((summen[art] || new Map()).entries()).map(([name, n]) => ({ name: namen && namen[name] ? namen[name] : name, schluessel: name, n: n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  const ereignisse = {}; for (const [name, n] of (summen.ereignis || new Map()).entries()) ereignisse[name] = n;
  const reiheListe = liste.map((t) => reihe.get(t));
  return {
    ok: true, tabelle: true, tage: tage, von: von, bis: bis,
    summe: { aufrufe: reiheListe.reduce((s, x) => s + x.aufrufe, 0), besuche: reiheListe.reduce((s, x) => s + x.besuche, 0), bots: reiheListe.reduce((s, x) => s + x.bots, 0) },
    reihe: reiheListe,
    seiten: rang('aufruf', SEITEN_NAMEN), einstiege: rang('besuch', SEITEN_NAMEN), herkunft: rang('herkunft'), geraet: rang('geraet'), browser: rang('browser'),
    system: rang('system'), land: rang('land'), bots: rang('bot'), dateien: rang('datei'), ereignisse: ereignisse,
    anzeigen: rang('anzeige'), kampagnen: rang('kampagne'), anzeigeseiten: rang('anzeigeseite', SEITEN_NAMEN), werbung: Object.fromEntries((summen.werbung || new Map()).entries()),
    /* Stundensummen über den Zeitraum (stunde:HH|…), etwa für das Tagesprofil */
    stunden: Object.fromEntries((summen.stunde || new Map()).entries())
  };
}

/* Fenstero · KI-Auswertung der Fotos (Cloudflare Pages Function, Adresse /api/ki)

   GET  /api/ki                                          -> { bereit: true | false }
   POST /api/ki?aufgabe=struktur|fakten&seite=in|out     Inhalt: das Foto als Base64-Text (JPEG)
                                                         -> { ok: true, daten: {...} } oder { ok: false, fehler: '...' }

   Der Schlüssel liegt nur bei Cloudflare: Umgebungsvariable ANTHROPIC_API_KEY, als „Secret“ angelegt.
   Optional: KI_MODELL_GENAU (Rahmen, Glas, Öffnung erkennen) und KI_MODELL_SCHNELL (Fakten fürs Angebot).
   Ohne Schlüssel meldet GET „nicht bereit“, und die App läuft ohne KI weiter. */

const MODELL_GENAU = 'claude-sonnet-5-5';
const MODELL_SCHNELL = 'claude-haiku-5-5';
const MAX_BILD = 3000000;            // Zeichen Base64, etwa 2,2 MB Bild (die App schickt meist unter 0,7 MB)
const FENSTER_MS = 10 * 60 * 1000;   // Bremse gegen Missbrauch: höchstens 40 Anfragen je 10 Minuten und IP-Adresse
const MAX_ANFRAGEN = 40;
const zaehler = new Map();           // nur im Arbeitsspeicher dieser Instanz, wird nirgends gespeichert

/* Aufträge an die KI: dieselben Texte wie in der App (web/assets/app.js, promptStructure und promptFacts).
   Sie liegen hier auf dem Server, damit /api/ki nur Fensterfotos auswertet und nicht als offener KI-Zugang taugt. */
function promptStructure(side) {
  const out = side === 'out';
  return [
    'Du bist die Messsoftware einer App für Fenster-Aufmaße. Das Bild ist ein Handyfoto eines Fensters ' + (out ? 'von außen (Fassade).' : 'von innen.'),
    'Koordinaten: x von 0 (linker Bildrand) bis 1000 (rechter Bildrand), y von 0 (oberer Bildrand) bis 1000 (unterer Bildrand), bezogen auf Bildbreite und Bildhöhe. Prüfe jede Koordinate am Bild nach.',
    'Arbeite von innen nach außen.',
    'Schritt 1, Glas: Finde jede Glasscheibe. Sie hebt sich durch den Lichteinfall deutlich ab. Gib je Scheibe die vier Ecken der Glasfläche. Was durch das Glas zu sehen ist, ist unwichtig.',
    'Schritt 2, Fensterelement: Um die Scheiben liegt der Rahmen aus Flügeln und Blendrahmen, meist einfarbig. Gib die vier äußeren Ecken des sichtbaren Fensterelements, dort, wo die Rahmenfarbe endet und ' + (out ? 'Putz, Mauerwerk oder Fensterbank' : 'Laibung, Putz oder Wand') + ' beginnt.',
    'Schritt 3, Maueröffnung: die Öffnung in der Wand, in der das Fenster sitzt. Gib die vier Ecken, an denen die Laibung in die Wandfläche übergeht' + (out ? ' (von außen die Kante des Mauerwerks um das Fenster)' : ' (die Kante zwischen Laibung und Zimmerwand; unten die Fensterbank)') + '. Schätze die Laibungstiefe in mm.',
    'Schritt 4, Lage: Wie schräg ist das Foto? Gib "neigung_grad" als Drehung der oberen Rahmenkante gegen die Waagerechte (positiv = rechts tiefer).',
    'Schritt 5: Anzahl der Flügel, Teilung, Öffnungsart, material (kunststoff, holz, alu, holzalu), farbe.',
    '',
    'Antworte ausschließlich mit JSON in genau dieser Form:',
    '{"fenster_gefunden":true,"scheiben":[{"ol":[x,y],"or":[x,y],"ur":[x,y],"ul":[x,y]}],"element":{"ol":[x,y],"or":[x,y],"ur":[x,y],"ul":[x,y]},"oeffnung":{"ol":[x,y],"or":[x,y],"ur":[x,y],"ul":[x,y]},"laibung_mm":150,"neigung_grad":1.5,"fluegel":2,"teilung":"2 Flügel mit Pfosten","oeffnungsart":"Dreh-Kipp","material":"kunststoff","farbe":"weiß","hinweise":"ein kurzer Satz"}',
    'Ist keine Öffnung erkennbar, setze "oeffnung": null. Ist wirklich kein Fenster zu sehen: {"fenster_gefunden":false,"hinweise":"..."}'
  ].join('\n');
}
function promptFacts(side) {
  const out = side === 'out';
  return [
    'Du berätst einen Fensterbauer. Das Bild ist ein Handyfoto eines Fensters ' + (out ? 'von außen (Fassade)' : 'von innen') + ', aufgenommen vom Kunden für ein Angebot. Beschreibe alles, was der Fensterbauer für Angebot und Einbau wissen muss, so genau, wie es das Foto hergibt. Wenn etwas nicht erkennbar ist, schreibe "unklar". Erfinde nichts.',
    out ? 'Achte auf: Fassade (Putz, Klinker, WDVS, Holz), Außenanschlag (steht Mauerwerk vor dem Rahmen, wie viel), Rollladen außen (Vorbaukasten, Führungsschienen), Fensterbank außen (Material, Gefälle, Überstand), Zustand von Rahmen, Dichtungen und Anschlussfugen, Verglasung (Abstandhalter, Spiegelung), Gitter, Klappläden, Markise, Geschoss, Zugänglichkeit (Gerüst nötig?), Besonderheiten.'
      : 'Achte auf: Material und Farbe des Rahmens, Alter und Zustand (vergilbt, Lack, feucht, Dichtungen porös, Beschläge), Verglasung (einfach, 2-fach, 3-fach, Sprossen, Ornamentglas), Flügel und Öffnungsart, Griff, Rollladen (Kasten innen, Gurt, Kurbel, Motor), Fensterbank innen (Material, Tiefe), Heizkörper unter dem Fenster (Abstand), Laibung (Putz, Tapete, Fliesen, Holzverkleidung), Innenanschlag, Gardinenschiene, Steckdosen oder Kabel in der Laibung, Raumart, Besonderheiten für Ausbau und Montage.',
    'Antworte ausschließlich mit JSON: {"chips":["Kunststoff, weiß","2 Flügel Dreh-Kipp","Rollladenkasten innen"],"rows":[["Material","Kunststoff, weiß, leicht vergilbt"],["Verglasung","2-fach, Abstandhalter Alu, vermutlich 1990er"],["Rollladen","Kasten innen über dem Fenster, Gurtantrieb links"]],"hinweise":["Gardinenschiene vor dem Einbau abnehmen"],"sicherheit":0.7}',
    '"chips": 3 bis 5 kurze Stichworte für den Kunden. "rows": 6 bis 12 Zeilen [Begriff, Befund] für den Fensterbauer, Fachsprache erlaubt. "hinweise": 0 bis 4 Sätze zu Ausbau, Montage oder Angebot.'
  ].join('\n');
}

function antwort(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}

function erlaubt(ip) {
  const jetzt = Date.now();
  const liste = (zaehler.get(ip) || []).filter((t) => jetzt - t < FENSTER_MS);
  if (liste.length >= MAX_ANFRAGEN) { zaehler.set(ip, liste); return false; }
  liste.push(jetzt);
  zaehler.set(ip, liste);
  if (zaehler.size > 5000) zaehler.clear();
  return true;
}

function jsonAusText(text) {
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(text.slice(a, b + 1)); } catch (e) { return null; }
}

export async function onRequestGet({ env }) {
  return antwort({ bereit: !!env.ANTHROPIC_API_KEY });
}

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) return antwort({ ok: false, fehler: 'images_unavailable' }, 503);
  const url = new URL(request.url);
  /* nur Anfragen von der eigenen Seite */
  if (request.headers.get('Origin') !== url.origin) return antwort({ ok: false, fehler: 'forbidden' }, 403);
  if (!erlaubt(request.headers.get('CF-Connecting-IP') || 'unbekannt')) return antwort({ ok: false, fehler: 'rate_limited' }, 429);

  const aufgabe = url.searchParams.get('aufgabe'), seite = url.searchParams.get('seite');
  if ((aufgabe !== 'struktur' && aufgabe !== 'fakten') || (seite !== 'in' && seite !== 'out')) return antwort({ ok: false, fehler: 'error' }, 400);
  if (Number(request.headers.get('content-length') || 0) > MAX_BILD + 1000) return antwort({ ok: false, fehler: 'image_rejected' }, 413);
  const bild = (await request.text()).trim();
  /* nur JPEG (Base64 beginnt mit /9j/), so wie die App es schickt */
  if (bild.length < 200 || bild.length > MAX_BILD || !bild.startsWith('/9j/') || !/^[A-Za-z0-9+/]+={0,2}$/.test(bild)) return antwort({ ok: false, fehler: 'image_rejected' }, 400);

  const genau = aufgabe === 'struktur';
  const modell = genau ? (env.KI_MODELL_GENAU || MODELL_GENAU) : (env.KI_MODELL_SCHNELL || MODELL_SCHNELL);
  const auftrag = genau ? promptStructure(seite) : promptFacts(seite);
  /* Anfrage als Text zusammensetzen: spart Rechenzeit beim großen Bild */
  const body = '{"model":' + JSON.stringify(modell) + ',"max_tokens":1500,"messages":[{"role":"user","content":[' +
    '{"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":"' + bild + '"}},' +
    '{"type":"text","text":' + JSON.stringify(auftrag) + '}]}]}';

  let r;
  try {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body
    });
  } catch (e) {
    return antwort({ ok: false, fehler: 'error' }, 502);
  }
  if (r.status === 429 || r.status === 529) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  let data = null;
  try { data = await r.json(); } catch (e) { data = null; }
  if (!r.ok) {
    const msg = data && data.error && data.error.message ? String(data.error.message) : '';
    console.log('KI-Anfrage abgelehnt', r.status, msg.slice(0, 200));
    return antwort({ ok: false, fehler: /image/i.test(msg) ? 'image_rejected' : 'error' }, 502);
  }
  if (data && data.stop_reason === 'refusal') return antwort({ ok: false, fehler: 'refused' }, 422);
  const text = (data && Array.isArray(data.content) ? data.content : []).filter((b) => b && b.type === 'text').map((b) => b.text).join('\n');
  const daten = jsonAusText(text);
  if (!daten) return antwort({ ok: false, fehler: 'error' }, 502);
  return antwort({ ok: true, daten });
}

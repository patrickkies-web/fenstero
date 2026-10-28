/* eeziframes · KI-Auswertung der Fotos, Adresse /api/ki (auf Cloudflare Workers über worker.js, läuft auch als Pages Function)

   GET  /api/ki                                          -> { bereit: true | false }
   POST /api/ki?aufgabe=einbau|wand&seite=in|out         Inhalt: das Foto als Base64-Text (JPEG)
                                                         -> { ok: true, daten: {...} } oder { ok: false, fehler: '...' }

   Eine Anfrage je Foto. Die KI liest die Einbausituation rund um die Maueröffnung, also alles, was ein Fensterbauer
   fürs Erstaufmaß außer den Maßen wissen muss (Rollladenkasten, Anschlag, Laibung, Fensterbänke, Wandaufbau, Anschlüsse,
   Hindernisse, Zugang, Schäden, Sonderfälle). Das alte Fenster wird ausgebaut und deshalb nicht beschrieben. Dazu feste Werte („fach“:
   Rollladenkasten, Anschlag, Fassade, Fensterbank, Brüstung, Geschoss, Erreichbarkeit, Strom, Gerüst) und das Seitenverhältnis des
   Fensterelements („verhaeltnis“), mit dem die App die Handmaße gegenprüft.
   „wand“ ist die neue Öffnung: eine Wand ohne Fenster, an die ein Durchbruch soll. Checkliste und Quellen: docs/KI.md.

   Der Schlüssel liegt nur bei Cloudflare: Umgebungsvariable ANTHROPIC_API_KEY, als „Secret“ angelegt.
   Optional: KI_MODELL (Standard claude-sonnet-5-5; früherer Name KI_MODELL_GENAU gilt weiter).
   Ohne Schlüssel meldet GET „nicht bereit“, und die App läuft ohne KI weiter.

   Kosten deckeln (Bauplan E12, K1.2, K2.13):
   - Tagesbudget über alle Domains (KI_TAG_MAX, Vorgabe 3000, dauerhaft gezählt in statistik): Mail an MAIL_KONTAKT bei 80 %, darüber 429.
   - Auf den Domains der Konfigurator-Instanzen (kiInstanz, worker.js → functions/instanz/seiten.js) nur mit ?code=<10 Zeichen> eines
     Links dieser Instanz; je Code höchstens min(60, 2 × Fenster + 6) Auswertungen (Zähler im Zwischenstand, meta.ki). Je Instanz und
     Monat das KI-Kontingent aus pakete.js (kiMonat), gezählt werden gelungene Auswertungen (inst:<id8>:kiok): Ist ein Auftrag mit der
     Instanz verknüpft (auftraege.instanz), pausiert die KI bei 100 %, außer der Fensterbauer hat im Kundenbereich weitere Auswertungen
     freigeschaltet (auftraege.ki.frei); dann bei 200 %, abgerechnet am Monatsende (auftraegeLauf). Ohne Auftrag (Demo, von Hand angelegt)
     wie freigeschaltet. Mails an den Betrieb bei 80 % und 100 % (und an der Obergrenze), an MAIL_KONTAKT bei 100 %. Versuche zählen
     getrennt als Bremse (inst:<id8>:ki, dreifaches Kontingent). Die App macht ohne Auswertung weiter. */

import '../../web/assets/instanzregeln.js';
import { erlaubt as bremse, quelle, konfig } from './umgebung.js';
import { speicher } from './speicher.js';
import { budget, budgetStand, bremse as rlBremse } from './bremse.js';
import { daten as auftragDaten } from '../auftrag/daten.js';
import { kiMail } from '../auftrag/mails.js';
import { HAUPTADRESSE } from '../seo.js';
import { postDienst, mailRahmen, esc } from './post.js';
import { linkAufloesen } from '../instanz/adapter.js';
import { instanzZaehlen } from './statistik.js';

const MODELL = 'claude-sonnet-5-5';
/* Ein echter Befund (bis zu 12 Zeilen, Hinweise, Prüfpunkte, Fachangaben) braucht oft mehr als 2.000 Tokens; abgeschnitten wäre das
   JSON unlesbar und die App bliebe ohne Auswertung. Bezahlt wird nur, was das Modell wirklich schreibt. */
const MAX_TOKENS = 8000;
const MAX_BILD = 3000000;            // Zeichen Base64, etwa 2,2 MB Bild (die App schickt meist unter 0,7 MB)
const FENSTER_MS = 10 * 60 * 1000;   // Bremse gegen Missbrauch: höchstens 40 Anfragen je 10 Minuten und Anschluss (IPv6 je /64)
const MAX_ANFRAGEN = 40;             // gezählt nur im Arbeitsspeicher dieser Instanz (umgebung.js), wird nirgends gespeichert

/* Die Aufträge liegen nur hier auf dem Server, damit /api/ki ausschließlich Fotos fürs Aufmaß auswertet
   und nicht als offener KI-Zugang taugt. Reihenfolge der Punkte = Wichtigkeit für den Fensterbauer. */
const GRUNDSAETZE = [
  'Du bist Fensterbaumeister und bereitest das Erstaufmaß vor. Ein Hauseigentümer hat fotografiert. Die Maße nimmt er selbst von Hand, das Feinaufmaß folgt später vor Ort.',
  'Regeln:',
  '- Keine Maße schätzen, außer wo unten ausdrücklich verlangt.',
  '- Nur, was im Foto zu sehen ist oder sich klar daraus ergibt. Vermutungen mit „vermutlich“ kennzeichnen. Was wichtig, aber nicht zu sehen ist, gehört als Prüfpunkt in "vor_ort", nicht in "rows".',
  '- Sachlich und ruhig formulieren, der Kunde liest mit. Keine Preise, keine Kosten, keine Produktnamen.'
].join('\n');

const AUFGABE = {
  einbau: [
    'Aufgabe: Lies die Einbausituation rund um die Maueröffnung, also alles, was der Fensterbauer für Angebot, Ausbau, Einbau und Anschlüsse wissen muss.',
    'Das bestehende Fenster wird ausgebaut. Beschreibe es nicht: kein Material, Alter, Glas, Griff, keine Dichtungen, kein Zustand der Flügel. Nenne es nur, wenn es Ausbau oder Öffnung betrifft: Kastenfenster mit zwei Ebenen, eingeputzter oder überputzter Blendrahmen, Aufsatzrollladen auf dem Altfenster, Gitter oder Verkleidungen, die mit abgebaut werden müssen.'
  ].join('\n'),
  wand: [
    'Aufgabe: Das Foto zeigt eine Wand, an der noch kein Fenster ist. Der Kunde wünscht dort einen neuen Wanddurchbruch für ein Fenster oder eine Tür.',
    'Lies alles, was für Durchbruch, Sturz, Einbau und Anschlüsse wichtig ist.'
  ].join('\n')
};

const PRUEFLISTE = {
  einbau: {
    in: [
      'Foto von innen. Prüfe in dieser Reihenfolge und nimm nur auf, was du erkennst:',
      '1. Rollladen und Sturz: Kasten innen über der Öffnung (Einbau- oder Sturzkasten mit Revisionsdeckel, Aufsatzkasten auf dem Altfenster) oder keiner; Antrieb (Gurt mit Gurtwickler auf oder unter Putz, Kurbel, Motor mit Schalter); Spalte, Verfärbungen oder Zugluftspuren am Kasten (Dämmung, Luftdichtheit).',
      '2. Anschlag und Einbaulage: Wo sitzt der Blendrahmen in der Wand (innen bündig oder zurückgesetzt), ist er eingeputzt oder mit Leisten verkleidet, ist ein Innenanschlag zu erkennen.',
      '3. Laibung innen: Oberfläche (Putz, Tapete, Fliesen, Holz- oder Kunststoffverkleidung), Zustand (Risse, Abplatzungen, Feuchte), was nach dem Ausbau beigeputzt oder neu verkleidet werden muss.',
      '4. Fensterbank innen: Material (Naturstein, Kunststoff, Holz, Fliesen, Faserzement), Überstand, über einem Heizkörper, kann sie vermutlich bleiben.',
      '5. Brüstung: bodentief, niedrig oder normal (grob). Sehr niedrige Brüstung über dem Erdgeschoss: Absturzsicherung prüfen.',
      '6. Heizung: Heizkörper, Rohre oder Thermostat unter oder neben dem Fenster, Abstand zur Fensterbank, Heizkörperverkleidung.',
      '7. Elektro: Steckdosen, Schalter oder Kabel in Laibung oder Brüstung, Rollladenschalter (Strom liegt an), Kontakte einer Alarmanlage.',
      '8. Hindernisse innen: Möbel, Einbauküche, Spüle, Arbeitsplatte, Gardinenleiste, Rollo oder Plissee am Rahmen, Dachschräge.',
      '9. Feuchte und Schäden: Schimmel, Stockflecken, Kondensat, Risse um die Öffnung.',
      '10. Besonderheiten: Kastenfenster, Raumart (Bad, Küche), Fenster im Dachgeschoss als möglicher Rettungsweg (lichte Öffnung nicht verkleinern), alles, was Ausbau oder Einbau erschwert.',
      '"laibung_mm": geschätzte Tiefe der Innenlaibung von der Wandfläche bis zum Blendrahmen. "neigung_grad": Drehung der oberen Rahmenkante gegen die Waagerechte, positiv heißt rechts tiefer.'
    ],
    out: [
      'Foto von außen. Prüfe in dieser Reihenfolge und nimm nur auf, was du erkennst:',
      '1. Fassade und Wandaufbau: Putz, Klinker oder Verblendmauerwerk (vermutlich zweischalig, mit Luftschicht oder Kerndämmung), Wärmedämmverbundsystem (Dämmstärke an der Laibung grob schätzen), Holz, Schiefer, Beton, Fachwerk.',
      '2. Außenanschlag und Einbaulage: steht Mauerwerk vor dem Blendrahmen (grob wie viel), stumpfer Anschlag, sitzt das Fenster in der Dämmebene.',
      '3. Sonnenschutz außen: Vorbaukasten, Führungsschienen, Raffstore, Markise, Klappläden, Gitter; Farbe; was weiterverwendet oder ersetzt werden muss.',
      '4. Fensterbank außen: Material (Aluminium, Naturstein, Klinker-Rollschicht, Faserzement, Zink, Beton), Überstand und Tropfkante, Gefälle, seitliche Abschlüsse, Zustand. Faserzement an Gebäuden von vor 1993: auf Asbest prüfen.',
      '5. Anschlüsse außen: Anschlussfugen (Silikon, Mörtel, offen, rissig), Putzanschluss, Dämmung in der Laibung.',
      '6. Sturz: Rollschicht, Betonsturz, Risse über der Öffnung.',
      '7. Geschoss und Zugang: Erdgeschoss, Obergeschoss oder Dachgeschoss; Gerüst oder Hubsteiger nötig; Vordach, Wintergarten, Bewuchs oder Anbauten im Weg.',
      '8. Feuchte und Schäden: Feuchteflecken unter der Fensterbank, Algen, Abplatzungen, Risse.',
      '9. Gestaltung: Teilung, Sprossen und Farbe der Nachbarfenster (einheitliches Bild); historische Fassade: Denkmalschutz oder Gestaltungssatzung prüfen.',
      '10. Einbruchschutz: leicht erreichbar (Erdgeschoss, Balkon, Anbau, Garagendach), dann RC 2 empfehlen; vorhandene Gitter.',
      '11. Besonderheiten: Fallrohre, Leitungen, Leuchten, Kameras oder Satellitenschüssel an Laibung oder Sturz.',
      '"neigung_grad": Drehung der oberen Rahmenkante gegen die Waagerechte, positiv heißt rechts tiefer. "laibung_mm" weglassen.'
    ]
  },
  wand: {
    in: [
      'Foto von innen. Prüfe in dieser Reihenfolge und nimm nur auf, was du erkennst:',
      '1. Wand: Oberfläche (Putz, Tapete, Fliesen, Holz), Hinweise auf Außenwand oder tragende Wand, Wanddicke an Nachbaröffnungen.',
      '2. Elektro: Steckdosen, Schalter, sichtbare oder vermutete Leitungen (senkrecht über und unter Dosen).',
      '3. Heizung und Wasser: Heizkörper, Rohre, Anschlüsse in der Fläche.',
      '4. Möbel und Einbauten vor der Wand.',
      '5. Raum: Deckenhöhe (grob), Fußboden, Raumart, Nachbarfenster im Raum (Brüstungs- und Sturzhöhe als Anhalt).',
      '6. Feuchte und Schäden.',
      '"neigung_grad": Drehung der Deckenkante oder einer waagerechten Kante gegen die Waagerechte, positiv heißt rechts tiefer.'
    ],
    out: [
      'Foto von außen. Prüfe in dieser Reihenfolge und nimm nur auf, was du erkennst:',
      '1. Fassade und Wandaufbau: Putz, Klinker, Wärmedämmverbundsystem, Holz, Beton, Fachwerk.',
      '2. Geschoss, Geländeniveau und Zugang (Gerüst nötig).',
      '3. Nachbarfenster: Stil, Teilung, Sturz- und Brüstungshöhe, Fensterbänke, Sonnenschutz (einheitliches Bild).',
      '4. Leitungen und Hindernisse: Fallrohre, Kabel, Leuchten, Dachüberstand, Anbauten.',
      '5. Hinweise auf Statik: tragendes Mauerwerk, Ringanker, Deckenauflager, Abstand zu Gebäudeecken.',
      '6. Gestaltung und Genehmigung: Eine neue Öffnung ändert die Fassade, Baugenehmigung oder Denkmalschutz prüfen.',
      '"neigung_grad": Drehung einer waagerechten Fassadenkante gegen die Waagerechte, positiv heißt rechts tiefer.'
    ]
  }
};

/* Feste Werte für den Fensterbauer („fach“): was dem Kunden zu fachlich ist, liest die KI aus dem Foto; die App zeigt es dem Betrieb
   auf einen Blick und nutzt es selbst (Fassade im Modell, Geschoss als Vorschlag, Absturzsicherung bei niedriger Brüstung, Hinweis auf
   Strom bei elektrischem Antrieb). „verhaeltnis“ prüft die Handmaße gegen das Foto (vertauscht oder stark abweichend). */
const FACH = {
  einbau: {
    in: '"fach" mit festen Werten, nur was du erkennst, sonst den Schlüssel weglassen: "rollladen": "einbau" (Kasten innen im Sturz mit Revisionsdeckel), "aufsatz" (Kasten auf dem Altfenster) oder "keiner"; "anschlag": "innen" oder "ohne"; "fensterbank": "naturstein", "kunststoff", "holz", "fliesen", "faserzement" oder "keine"; "bruestung": "bodentief", "niedrig" (unter etwa 80 cm) oder "normal"; "strom": true, wenn Rollladenschalter, Motor, Steckdose oder Kabel direkt an der Öffnung zu sehen sind, sonst false.\n"verhaeltnis": Breite geteilt durch Höhe des Fensterelements samt Blendrahmen, so als sähest du gerade darauf (Schrägsicht herausrechnen), zwei Nachkommastellen; null, wenn der Rahmen nicht ganz zu sehen ist.',
    out: '"fach" mit festen Werten, nur was du erkennst, sonst den Schlüssel weglassen: "rollladen": "vorbau" (Kasten außen vor der Fassade), "aufsatz", "einbau" (nur der Schlitz im Sturz zu sehen) oder "keiner"; "anschlag": "aussen" oder "ohne"; "fassade": "putz", "klinker", "wdvs", "holz" oder "sonstige"; "fensterbank": "aluminium", "naturstein", "klinker", "faserzement", "beton" oder "keine"; "geschoss": "kg", "eg", "og" oder "dg"; "erreichbar": true, wenn das Fenster vom Boden, Balkon, Anbau oder Garagendach leicht zu erreichen ist, sonst false; "geruest": true, wenn für die Montage ein Gerüst oder Hubsteiger nötig ist, sonst false.\n"verhaeltnis": Breite geteilt durch Höhe des Fensterelements samt Blendrahmen, so als sähest du gerade darauf (Schrägsicht herausrechnen), zwei Nachkommastellen; null, wenn der Rahmen nicht ganz zu sehen ist.'
  },
  wand: {
    in: '"fach" mit festen Werten, nur was du erkennst: "strom": true, wenn Steckdosen, Schalter oder Leitungen in der Fläche zu sehen sind, sonst false. "verhaeltnis" weglassen.',
    out: '"fach" mit festen Werten, nur was du erkennst: "fassade": "putz", "klinker", "wdvs", "holz" oder "sonstige"; "geschoss": "kg", "eg", "og" oder "dg"; "erreichbar": true oder false; "geruest": true oder false. "verhaeltnis" weglassen.'
  }
};

const FORMAT = [
  'Antworte ausschließlich mit JSON in dieser Form:',
  '{"foto_passt":true,"neigung_grad":1.5,"laibung_mm":180,"rows":[["Rollladen","Einbaukasten innen über der Öffnung mit Revisionsdeckel, Gurt mit Unterputz-Wickler links"],["Anschlag","Innenanschlag, Blendrahmen sitzt vermutlich 2 cm hinter der Innenkante"]],"chips":["Rollladenkasten innen","Fensterbank Naturstein","Heizkörper darunter"],"hinweise":["Der Gurtwickler sitzt in der Laibung; nach dem Ausbau ist Putz nachzuarbeiten."],"vor_ort":["Dämmung und Luftdichtheit des Rollladenkastens prüfen."],"fach":{"rollladen":"einbau","anschlag":"innen","fensterbank":"naturstein","bruestung":"normal","strom":true},"verhaeltnis":0.87,"sicherheit":0.7}',
  '"rows": 5 bis 12 Zeilen [Thema, Befund], wichtigstes zuerst. Thema kurz, zum Beispiel Rollladen, Anschlag, Laibung, Fensterbank innen, Brüstung, Heizung, Elektro, Hindernisse, Feuchte, Fassade, Anschlag außen, Sonnenschutz, Fensterbank außen, Anschlüsse, Sturz, Zugang, Gestaltung, Einbruchschutz, Wand, Statik, Besonderheit. Befund in Fachsprache, höchstens 140 Zeichen.',
  '"chips": 3 bis 5 kurze Stichworte für den Kunden.',
  '"hinweise": 0 bis 4 Sätze, was für Angebot, Ausbau oder Montage wichtig ist.',
  '"vor_ort": 0 bis 4 Prüfpunkte fürs Feinaufmaß, die das Foto nicht klärt.',
  'Ist weder Fenster noch Öffnung noch Wand sinnvoll zu erkennen: {"foto_passt":false,"hinweise":["kurzer Grund"]}'
].join('\n');

function auftrag(aufgabe, seite) {
  return [GRUNDSAETZE, AUFGABE[aufgabe], PRUEFLISTE[aufgabe][seite].join('\n'), FORMAT, FACH[aufgabe][seite]].join('\n\n');
}
const kurz = (aufgabe, seite) => (aufgabe === 'wand' ? 'Wand für eine neue Öffnung, ' : 'Fenster, das ersetzt wird, ') + (seite === 'out' ? 'Foto von außen.' : 'Foto von innen.');

function antwort(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}


function jsonAusText(text) {
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(text.slice(a, b + 1)); } catch (e) { return null; }
}

export async function onRequestGet({ env }) {
  return antwort({ bereit: !!env.ANTHROPIC_API_KEY });
}

/* Alarm-Mail an den Inhaber (Tagesbudget, Monatsgrenze einer Instanz); Fehler bleiben folgenlos */
export async function alarmMail(k, betreff, text) {
  const pd = postDienst(k); if (!pd) return false;
  try { return (await pd.senden({ an: pd.kontakt, betreff: betreff, html: mailRahmen(betreff, '<p style="margin:0 0 12px">' + esc(text) + '</p>', pd.kontakt) })).ok; } catch (e) { return false; }
}
/* Tagesbudget über alle Domains; false: Grenze erreicht */
async function tagesBudget(ctx) {
  const max = ctx.k.instanzen.kiTagMax, b = await budget(ctx, 'ki:tag', max, { alarm: Math.max(1, Math.floor(max * 0.8)) });
  if (b.alarm) { const p = alarmMail(ctx.k, 'KI-Auswertungen: 80 % des Tagesbudgets', 'Heute sind schon ' + b.stand + ' von höchstens ' + max + ' KI-Auswertungen gelaufen (Variable KI_TAG_MAX). Darüber antwortet die KI bis Mitternacht nicht mehr; die App macht ohne Auswertung weiter.'); if (ctx.waitUntil) ctx.waitUntil(p); else await p; }
  return b.ok;
}
const kontext = (request, env, o) => { const k = konfig(env); return Object.assign({ k: k, env: env, sp: k.daten ? speicher(k) : null, request: request, url: new URL(request.url) }, o || {}); };

export async function onRequestPost({ request, env, waitUntil }) {
  if (!env.ANTHROPIC_API_KEY) return antwort({ ok: false, fehler: 'images_unavailable' }, 503);
  const url = new URL(request.url);
  /* nur Anfragen von der eigenen Seite */
  if (request.headers.get('Origin') !== url.origin) return antwort({ ok: false, fehler: 'forbidden' }, 403);
  if (!bremse('ki:' + quelle(request), MAX_ANFRAGEN, FENSTER_MS)) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  if (!(await tagesBudget(kontext(request, env, { waitUntil: waitUntil })))) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'tag' }, 429);
  return auswerten(request, env, url);
}

/* Konfigurator-Instanz: nur mit Code eines Links dieser Instanz, Grenzen je Code, Instanz und Monat, Tagesbudget */
export async function kiInstanz({ request, env, instanz, waitUntil }) {
  if (!env.ANTHROPIC_API_KEY) return antwort({ ok: false, fehler: 'images_unavailable' }, 503);
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return antwort({ ok: false, fehler: 'forbidden' }, 403);
  const ctx = kontext(request, env, { instanz: instanz, waitUntil: waitUntil }), G = globalThis.Instanzregeln.GRENZEN;
  if (!bremse('ki:' + quelle(request), MAX_ANFRAGEN, FENSTER_MS) || !(await rlBremse(ctx, 'KI', quelle(request)))) return antwort({ ok: false, fehler: 'rate_limited' }, 429);
  const code = String(url.searchParams.get('code') || '').trim().toLowerCase();
  if (!/^[a-z0-9]{10}$/.test(code)) return antwort({ ok: false, fehler: 'code' }, 400);
  if (!ctx.sp) return antwort({ ok: false, fehler: 'images_unavailable' }, 503);
  let aufl = null;
  try { aufl = await linkAufloesen(ctx, code); } catch (e) { return antwort({ ok: false, fehler: 'not_found' }, e && e.status === 429 ? 429 : 404); }
  if (globalThis.Abrechnung.linkZu(aufl.l)) return antwort({ ok: false, fehler: 'closed' }, 410);
  /* je Code: höchstens min(kiJeCode, 2 × Fenster + 6) Auswertungen, gezählt im Zwischenstand (überlebt jeden Browser) */
  let frei = false;
  await ctx.sp.entwurfAendern(code, instanz.betrieb, (r) => {
    const mt = r.meta || {}, n = Math.max(((r.daten || {}).windows || []).length, Number(mt.angelegt) || 0), max = Math.min(G.kiJeCode, 2 * n + 6), schon = Number(mt.ki) || 0;
    if (schon >= max) return false;
    r.meta = Object.assign({}, mt, { ki: schon + 1 }); frei = true; return true;
  });
  if (!frei) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'code' }, 429);
  /* Testanfragen in der Vorschau zählen nicht ins Kontingent (Paketbedingungen § 2 Abs. 2); es bleiben die Grenze je Code und das Tagesbudget */
  if (globalThis.Instanzregeln.anfrageArt(instanz.status, { vorschau: instanz.vorschau }) === 'test') {
    if (!(await tagesBudget(ctx))) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'tag' }, 429);
    return auswerten(request, env, url);
  }
  /* je Instanz und Monat: Kontingent aus pakete.js, ohne Freischaltung Schluss bei 100 %, mit Freischaltung (oder ohne Auftrag) beim Doppelten */
  const m = instanz.m || {}, richt = Math.max(1, Number(m.kiMonat) || 600), auf = await kiAuftrag(ctx, instanz);
  const mehrFrei = !auf || !!(auf.ki || {}).frei, grenze = mehrFrei ? richt * 2 : richt, okKey = 'inst:' + instanz.id8 + ':kiok';
  const versuch = await budget(ctx, 'inst:' + instanz.id8 + ':ki', richt * 3, { monat: true });
  if (!versuch.ok || (await budgetStand(ctx, okKey, { monat: true })) >= grenze) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'monat' }, 429);
  if (!(await tagesBudget(ctx))) return antwort({ ok: false, fehler: 'rate_limited', grenze: 'tag' }, 429);
  const r = await auswerten(request, env, url);
  if (r.status === 200) {
    instanzZaehlen(ctx, instanz, 'ki');
    const n = (await budget(ctx, okKey, Infinity, { monat: true })).stand, p = kiStufe(ctx, instanz, auf, n, richt, mehrFrei);
    if (p) { if (waitUntil) waitUntil(p); else await p; }
  }
  return r;
}

/* Der laufende Auftrag eines Konfigurators (KI-Kontingent); null ohne Auftrag oder ohne Datenbank */
async function kiAuftrag(ctx, instanz) {
  try { const d = auftragDaten(ctx.k); return d && d.auftragZuInstanz && instanz.id ? await d.auftragZuInstanz(instanz.id) : null; } catch (e) { return null; }
}
/* Genau einmal je Schwelle (der Zähler steigt um eins): 80 % und 100 % an den Betrieb, 100 % an den Inhaber, die Obergrenze an den Betrieb */
function kiStufe(ctx, instanz, a, n, richt, frei) {
  const stufe = n === richt ? 100 : n === Math.ceil(richt * 0.8) && n < richt ? 80 : frei && n === richt * 2 ? 200 : 0;
  if (!stufe) return null;
  const aufgaben = [];
  if (stufe === 100) aufgaben.push(alarmMail(ctx.k, 'KI-Auswertungen: Kontingent erreicht bei ' + instanz.name, instanz.name + ' (' + (instanz.haupthost || '') + ') hat in diesem Monat ' + n + ' KI-Auswertungen, Kontingent ' + richt + '. ' + (!a ? 'Kein Auftrag verknüpft: Die KI läuft bis zum Doppelten weiter.' : frei ? 'Weitere Auswertungen sind freigeschaltet; sie werden am Monatsende abgerechnet, höchstens bis zum Doppelten.' : 'Nicht freigeschaltet: Die KI pausiert dort bis zum Monatsende.')));
  if (a) aufgaben.push((async () => {
    const pd = postDienst(ctx.k), d = auftragDaten(ctx.k); if (!pd || !d) return false;
    const kunde = await d.kundeHolen(a.kunde); if (!kunde || !kunde.mail) return false;
    const P = globalThis.Pakete, pr = a.preise && a.preise.ki != null ? a.preise.ki : P.preis(a.paket).ki;
    const monat = new Date(ctx.k.jetzt || Date.now()).toLocaleDateString('de-DE', { month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' });
    const mail = kiMail(stufe, a, { genutzt: n, kontingent: richt, obergrenze: richt * 2, frei: frei, monat: monat, preis: P.euro(pr) + ' netto', konto: String((ctx.env && ctx.env.KANONISCH) || HAUPTADRESSE).replace(/\/+$/, '') + '/konto/#auftrag/' + a.id });
    return (await pd.senden({ an: kunde.mail, betreff: mail.betreff, html: mail.html, antwortAn: pd.kontakt })).ok;
  })().catch(() => false));
  return Promise.all(aufgaben);
}

async function auswerten(request, env, url) {
  /* „fakten“ ist der frühere Name von „einbau“ (ältere geöffnete Seiten); „struktur“ gibt es nicht mehr */
  let aufgabe = url.searchParams.get('aufgabe');
  if (aufgabe === 'fakten') aufgabe = 'einbau';
  const seite = url.searchParams.get('seite');
  if ((aufgabe !== 'einbau' && aufgabe !== 'wand') || (seite !== 'in' && seite !== 'out')) return antwort({ ok: false, fehler: 'error' }, 400);
  if (Number(request.headers.get('content-length') || 0) > MAX_BILD + 1000) return antwort({ ok: false, fehler: 'image_rejected' }, 413);
  const bild = (await request.text()).trim();
  /* nur JPEG (Base64 beginnt mit /9j/), so wie die App es schickt */
  if (bild.length < 200 || bild.length > MAX_BILD || !bild.startsWith('/9j/') || !/^[A-Za-z0-9+/]+={0,2}$/.test(bild)) return antwort({ ok: false, fehler: 'image_rejected' }, 400);

  const modell = env.KI_MODELL || env.KI_MODELL_GENAU || MODELL;
  /* Anfrage als Text zusammensetzen: spart Rechenzeit beim großen Bild. Auftrag als System, im Nutzerteil erst das Bild, dann ein Satz dazu. */
  const body = '{"model":' + JSON.stringify(modell) + ',"max_tokens":' + MAX_TOKENS + ',"system":' + JSON.stringify(auftrag(aufgabe, seite)) + ',"messages":[{"role":"user","content":[' +
    '{"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":"' + bild + '"}},' +
    '{"type":"text","text":' + JSON.stringify(kurz(aufgabe, seite)) + '}]}]}';

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
  if (data && data.stop_reason === 'max_tokens') console.log('KI-Antwort abgeschnitten', modell, MAX_TOKENS);
  const text = (data && Array.isArray(data.content) ? data.content : []).filter((b) => b && b.type === 'text').map((b) => b.text).join('\n');
  const daten = jsonAusText(text);
  if (!daten) return antwort({ ok: false, fehler: 'error' }, 502);
  return antwort({ ok: true, daten });
}

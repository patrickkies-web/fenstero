'use strict';
/* ---------- An meinem Haus ansehen (Inhaber, 2.11.2026) ----------
   „Gespeichert“ lädt mit einer hellblauen Karte ein, das Fenster an einem Haus zu sehen. Der Editor (Bildschirm hausbild):
   1. Foto des Hauses wählen (wird im Browser auf höchstens 2.000 px verkleinert und bleibt im Browser).
   2. Über Plus ein gespeichertes Element einsetzen: Es erscheint mittig, in der Größe passend zu schon gesetzten Elementen (echte
      Maße in mm). Verschieben mit dem Finger oder der Maus, die vier Ecken auf die Öffnung ziehen (Winkel, Perspektive), mit zwei
      Fingern drehen und vergrößern, am Rechner auch mit dem Mausrad bzw. Umschalt und Mausrad. „Bestätigen“ verankert es im Bild.
      Die Lupe (Näher, Weiter) vergrößert das Foto bis vierfach um das gewählte Element; Ziehen auf dem Foto verschiebt dann den Ausschnitt.
      Die Eckpunkte stehen etwas außerhalb der Ecken, damit sie auch kleine Fenster nicht verdecken.
   3. „Bearbeiten“ macht die Elemente wieder antippbar; nach „Bestätigen“ ist der Modus wieder aus, damit nichts aus Versehen
      verrutscht. Duplizieren und Entfernen gelten für das gewählte Element.
   4. „KI-Vorschau“: bis dahin keine KI. Die App schickt nur den Ausschnitt um alle Elemente: das Foto, dasselbe mit den eingesetzten
      Fenstern (nur für die lokale Attrappe) und je Fenster ein Bild aus dem 3-D-Modell, von außen, mit seinen Daten (Farbe, Flügel,
      Sprossen, Sonnenschutz, Glas; functions/api/hausbild.js, FLUX 3 Image Klein). Ergebnis abholen mit GET, bis 3 Minuten. Das Ergebnis setzt die App nur innerhalb der Elementflächen (weich auslaufend) ins Originalfoto zurück, der Rest bleibt
      das Foto des Kunden. Vorher/Nachher zum Vergleichen, Bild speichern.
   Bild der Elemente: dieselbe WebGL-Bühne wie in den Wünschen (buehne.js, Buehne3D.foto), frei ohne Wand, gerade von außen. Ohne
   WebGL zeichnet hausbild.js eine einfache Ansicht (Rahmenfarbe, Flügel, Glas). Nur im eigenen Aufmaß (nicht im Kundenlink und nicht in
   den Konfiguratoren der Fensterbauer, deren Server die Route nicht durchlässt). */
const HB = { foto: null, el: [], aktiv: null, bearbeiten: false, wahl: false, ergebnis: null, zeige: 'nach', laedt: false, fehler: '', bilder: {}, zaehler: 1, kosten: null, z: 1, tx: 0, ty: 0 };
const HB_Z = {
  plus: '<path d="M10 4v12M4 10h12"/>',
  stift: '<path d="M4 16l1-4 8-8 3 3-8 8z"/><path d="M11.5 5.5l3 3"/>',
  kopie: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>',
  weg: '<path d="M3.5 5.5h13M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5.5 5.5l.8 10.6a1.5 1.5 0 0 0 1.5 1.4h4.4a1.5 1.5 0 0 0 1.5-1.4l.8-10.6"/>',
  foto: '<rect x="2.5" y="5" width="15" height="11" rx="2.5"/><circle cx="10" cy="10.5" r="3"/><path d="M7 5l1.2-2h3.6L13 5"/>',
  haus: '<path d="M3 9.2 10 3.5l7 5.7"/><path d="M5 8v8.5h10V8"/><rect x="8" y="10" width="4" height="4" rx=".6"/>',
  sichern: '<path d="M10 3.5v9M6 9l4 4 4-4"/><path d="M4 15.5v1h12v-1"/>',
  haken: '<path d="M4 10.5l4 4 8-9"/>',
  zu: '<path d="M5 5l10 10M15 5 5 15"/>',
  naeher: '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.5 12.5 17 17M6 8.5h5M8.5 6v5"/>',
  weiter: '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.5 12.5 17 17M6 8.5h5"/>'
};
const hbZ = (k) => '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + HB_Z[k] + '</svg>';
const hbPfeil = '<span class="dna-pille__pfeil" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span>';
/* nur im eigenen Aufmaß, wenn der Server den Bilddienst eingerichtet hat (/api/status: hausbild), nicht in der Führung und nicht in der Vorschau */
const hbDa = () => typeof SERVER !== 'undefined' && !!SERVER.hausbild && !S.betrieb && !INST && !S.tour && !(typeof vorschau === 'function' && vorschau());

/* ---------- Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, Datenschutzerklärung Abschnitt 5a) ----------
   Vor der ersten KI-Vorschau fragt der Editor; Zustimmung und Stand des Textes liegen im Browser. Widerruf so einfach wie die
   Zustimmung: im Editor unter dem Hinweis und in der Fußleiste der App („Vorschau-Einwilligung widerrufen“), danach fragt die App
   beim nächsten Mal wieder. Das Blatt zeigt den Ausschnitt, der tatsächlich übermittelt wird. Der Server nimmt nur Anfragen mit dem
   aktuellen Stand des Textes an. Textfassungen: docs/recht/2026-11-02-hausbild-rechtstexte.md. */
const HB_EINW = 'aufmass.hausbild.einwilligung', HB_EINW_STAND = '2026-11-02c'; // c: Cloudflare. Stand wie EINW_STAND in functions/api/hausbild.js; ändert sich der Text, beide hochzählen
const hbEinwDa = () => { try { const v = JSON.parse(localStorage.getItem(HB_EINW) || 'null'); return !!(v && v.stand === HB_EINW_STAND); } catch (e) { return false; } };
const hbEinwSetzen = (an) => { try { if (an) localStorage.setItem(HB_EINW, JSON.stringify({ stand: HB_EINW_STAND, am: new Date().toISOString() })); else localStorage.removeItem(HB_EINW); } catch (e) { /* ohne Speicher: fragt jedes Mal */ } };
/* Text des Blatts (Stand HB_EINW_STAND, 2.11.2026 c): Die KI rechnet bei Cloudflare (Workers AI, Modell FLUX.2 [klein] auf Servern von
   Cloudflare), wie Datenschutzerklärung 5a. Belege: developers.cloudflare.com/workers-ai/platform/privacy/ (kein Training, Speicherung
   nur mit eigenem Speicherdienst), Modellseite flux-2-klein-9b („Cloudflare-hosted“). Der Weg über Black Forest Labs direkt ist aus
   (functions/api/hausbild.js, FREIGEGEBEN); wird er je eingeschaltet, braucht er einen eigenen Text und einen neuen Stand. */
function hbEinwBlatt() {
  if (!HB.einwFrage) return '';
  const bilder = HB.paket ? (HB.paket.teile ? HB.paket.teile.map((t) => t.lage) : [HB.paket.bild]) : [];
  const aus = bilder.length ? '<figure class="hb-einw-bild' + (bilder.length > 1 ? ' mehr' : '') + '">' + bilder.map((b) => '<img src="' + b + '" alt="Ausschnitt deines Fotos, der übermittelt wird">').join('') +
    '<figcaption>' + (bilder.length > 1 ? 'Diese Ausschnitte gehen' : 'Das geht') + ' an Cloudflare, je Fenster einer</figcaption></figure>' : '';
  return '<div class="hb-wahl" role="dialog" aria-modal="true" aria-labelledby="hb-einw-t"><div class="hb-wahl-blatt hb-einw"><div class="hb-wahl-kopf"><h2 id="hb-einw-t">Einwilligung zur KI-Vorschau</h2>' +
    '<button type="button" class="hb-rund" data-act="hb-einw-nein" aria-label="Abbrechen">' + hbZ('zu') + '</button></div>' + aus +
    '<p>Für die KI-Vorschau schicken wir <b>Ausschnitte deines Fotos</b> mit deinen Fenstern und Bilder der geplanten Fenster an die KI unseres Dienstleisters <b>Cloudflare</b> (Cloudflare, Inc., San Francisco, USA), der auch unsere Website betreibt. Die KI (FLUX.2 von Black Forest Labs, gerechnet auf Servern von Cloudflare) berechnet daraus das Bild. Name, Adresse, E-Mail und Maße gehen nicht mit.</p>' +
    '<p>Wir speichern weder dein Foto noch das Ergebnis. Cloudflare speichert beides nach eigenen Angaben nicht und trainiert keine KI damit. Cloudflare kann auch außerhalb der EU rechnen, etwa in den USA, und ist dafür nach dem EU-US Data Privacy Framework zertifiziert. Bitte achte darauf, dass keine Personen und keine Kfz-Kennzeichen zu erkennen sind.</p>' +
    '<p>Du kannst die Einwilligung jederzeit widerrufen, im Editor oder unten in der App. Mehr in der <a class="ulink" href="/datenschutz/#p5a-vorschau-am-eigenen-haus" target="_blank" rel="noopener">Datenschutzerklärung, Abschnitt 5a</a>.</p>' +
    '<div class="hb-einw-knoepfe"><button type="button" class="hb-einw-knopf" data-act="hb-einw-ja">Einwilligen und rechnen</button><button type="button" class="hb-einw-knopf" data-act="hb-einw-nein">Nicht einwilligen</button></div></div></div>';
}

/* ---------- Einladung in „Gespeichert“ ---------- */
function hbEinladung() {
  if (!hbDa()) return '';
  const tuer = istTuer(S.win), ding = tuer ? 'deine Tür' : S.win.art === 'fest' ? 'deine Verglasung' : 'dein Fenster';
  return '<section class="hb-einladung" aria-labelledby="hb-ein-t"><span class="hb-ein-zeichen" aria-hidden="true">' + hbHausZeichen() + '</span>' +
    '<div class="hb-ein-text"><h2 id="hb-ein-t">Sieh ' + ding + ' <em>an deinem Haus.</em></h2>' +
    '<p>Foto von deinem Haus wählen, ' + ding + ' an seine Stelle ziehen, und eine KI berechnet, wie dein Haus mit dem neuen Element aussehen könnte.</p></div>' +
    '<button type="button" class="hb-ein-knopf" data-act="hb-auf">' + hbZ('foto') + '<span>An meinem Haus ansehen</span><span class="hb-ein-pfeil" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button></section>';
}
/* kleines Haus mit leuchtendem Fenster, in den Tönen der Karte */
const hbHausZeichen = () => '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M10 30 32 12l22 18" stroke="#1d4f8c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<path d="M15 27v25h34V27" stroke="#1d4f8c" stroke-width="3" stroke-linejoin="round"/><rect x="24" y="31" width="16" height="15" rx="2" fill="#fff" stroke="#1d4f8c" stroke-width="2.5"/>' +
  '<path d="M32 31v15M24 38.5h16" stroke="#1d4f8c" stroke-width="2"/><path d="M45 9l1.6 3.4L50 14l-3.4 1.6L45 19l-1.6-3.4L40 14l3.4-1.6z" fill="#5aa0e6"/></svg>';

/* ---------- Bild eines Elements aus der 3-D-Bühne ---------- */
function hbBildVon(i) {
  const w = S.windows[i]; if (!w) return Promise.resolve(null);
  const key = i + '|' + (w.aend || 0) + '|' + JSON.stringify([w.art, w.teilung, w.fa, w.wunschA, w.roll, w.sart, w.ol, w.bars && w.bars.length, w.el && w.el.w, w.el && w.el.h, w.w, w.h]);
  if (HB.bilder[i] && HB.bilder[i].key === key) return Promise.resolve(HB.bilder[i]);
  return hbStudio(w).then((b) => { if (b) { b.key = key; HB.bilder[i] = b; } return b; });
}
let hbStudioKette = Promise.resolve();
function hbStudio(w) {
  const lauf = hbStudioKette.then(() => new Promise((fertig) => {
    let box = document.getElementById('hb-studio');
    if (!box) { box = document.createElement('div'); box.id = 'hb-studio'; box.setAttribute('aria-hidden', 'true'); document.body.appendChild(box); }
    const o = { id: 'hb-studio-st', view: 'aussenGerade', frei: true, haus: false, sway: false, noZoom: true, zkey: 'hb-studio' };
    box.innerHTML = model(w, o);
    const st = box.querySelector('.w3d-stage');
    const zeichnung = () => { box.innerHTML = ''; delete W3DS['hb-studio-st']; fertig(hbZeichnung(w)); };
    if (!st) return zeichnung();
    st.classList.add('no-anim'); w3dApply(st, w, W3DS['hb-studio-st'].o);
    if (!window.Buehne3D || !window.Buehne3D.an(st)) return zeichnung();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const url = window.Buehne3D.foto(st);
      box.innerHTML = ''; delete W3DS['hb-studio-st'];
      if (!url) return fertig(hbZeichnung(w));
      hbZuschneiden(url).then(fertig);
    }));
  }));
  hbStudioKette = lauf.catch(() => null);
  return lauf;
}
/* durchsichtigen Rand abschneiden */
function hbZuschneiden(url) {
  return new Promise((fertig) => {
    const im = new Image();
    im.onload = () => {
      const cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight; const c = cv.getContext('2d'); c.drawImage(im, 0, 0);
      let px; try { px = c.getImageData(0, 0, cv.width, cv.height).data; } catch (e) { return fertig({ src: url, w: cv.width, h: cv.height }); }
      let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
      for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) if (px[(y * cv.width + x) * 4 + 3] > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 < 0) return fertig(null);
      const w = x1 - x0 + 2, h = y1 - y0 + 2, aus = document.createElement('canvas'); aus.width = w; aus.height = h;
      aus.getContext('2d').drawImage(cv, x0, y0, w, h, 0, 0, w, h);
      fertig({ src: aus.toDataURL('image/png'), w: w, h: h });
    };
    im.onerror = () => fertig(null);
    im.src = url;
  });
}
/* ohne WebGL: einfache Ansicht von außen in der Rahmenfarbe (Flügel, Glas, Kasten des Sonnenschutzes) */
function hbZeichnung(w) {
  const bw = num(w.el && w.el.w) || num(w.w) || 1200, bh = num(w.el && w.el.h) || num(w.h) || 1400, k = 520 / Math.max(bw, bh);
  const W = Math.round(bw * k), kasten = /rollladen|raffstore|screen/.test(String(w.roll || w.sart || '')) ? Math.round(150 * k) : 0, H = Math.round(bh * k) + kasten;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const f = rahmenFarbe(w, 'aussen'), farbe = (f && (f.solid || f.bg)) || '#3a3d40', r = Math.max(6, Math.round(64 * k));
  if (kasten) { c.fillStyle = farbe; c.fillRect(0, 0, W, kasten); }
  c.fillStyle = farbe; c.fillRect(0, kasten, W, H - kasten);
  const n = Math.max(1, (w.sashes || []).length || 1), sw = (W - 2 * r) / n;
  for (let i = 0; i < n; i++) {
    const x = r + i * sw, g = c.createLinearGradient(0, kasten + r, 0, H - r); g.addColorStop(0, '#d9e6f1'); g.addColorStop(1, '#8ea7bd');
    c.fillStyle = g; c.fillRect(x + r * .45, kasten + r * 1.45, sw - r * .9, H - kasten - r * 2.9);
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 2; c.strokeRect(x + r * .45, kasten + r * 1.45, sw - r * .9, H - kasten - r * 2.9);
  }
  return { src: cv.toDataURL('image/png'), w: W, h: H, zeichnung: true };
}

/* Daten des Fensters für den Auftrag an den Bilddienst (functions/api/hausbild.js, beschreibung) */
function hbDaten(w) {
  if (!w) return {};
  const f = rahmenFarbe(w, 'aussen'), farbe = String((f && (f.solid || f.bg)) || '').match(/#[0-9a-f]{6}/i);
  return { farbe: farbe ? farbe[0] : '', fluegel: (w.sashes || []).length || 1, oberlicht: !!w.ol, sprossen: (w.bars || []).length > 0, tuer: istTuer(w),
    sonne: typeof sonneAktiv === 'function' && sonneAktiv(w) ? w.sart : '', glas: (w.glasfn || []).indexOf('sicht') >= 0 ? 'ornament' : 'klar' };
}

/* ---------- Geometrie ---------- */
/* Rechteck (0..w, 0..h) → Viereck q (oben links, oben rechts, unten rechts, unten links), als matrix3d (Heckbert) */
function hbMatrix(w, h, q) {
  const [x0, y0] = q[0], [x1, y1] = q[1], [x2, y2] = q[2], [x3, y3] = q[3];
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
  return [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
}
const hbPunkt = (m, x, y) => { const z = m[3] * x + m[7] * y + m[15]; return [(m[0] * x + m[4] * y + m[12]) / z, (m[1] * x + m[5] * y + m[13]) / z]; };
const hbMitte = (q) => [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4];
/* Ecken liegen relativ zum Foto (0..1); px: Faktoren für Breite und Höhe */
const hbPx = (q, W, H) => q.map((p) => [p[0] * W, p[1] * H]);

/* ---------- Bildschirm ---------- */
function hbTitel() {
  if (HB.laedt) return ['Dein Haus wird <em>gerechnet.</em>', 'Das dauert meist 10 bis 30 Sekunden.'];
  if (HB.ergebnis) return ['So <em>könnte</em> es aussehen.', 'Von einer KI berechnet, kein Foto. Farbe, Teilung und Details wie Fensterbank und Laibung können abweichen. Gemessen und bestellt wird mit deinem Aufmaß. ' + (matchMedia('(pointer: coarse)').matches ? 'Mit zwei Fingern zoomst du heran.' : 'Mit dem Mausrad zoomst du heran.')];
  if (!HB.foto) return ['Dein Fenster <em>am Haus.</em>', 'Wähle ein Foto deines Hauses, am besten gerade von vorn und bei Tageslicht.'];
  const ak = HB.el.find((e) => e.id === HB.aktiv);
  if (ak) return ['Zieh es an <em>seinen Platz.</em>', 'Mit dem Finger verschieben, die vier Ecken auf die Öffnung ziehen. Mit zwei Fingern drehen und vergrößern, am Rechner mit dem Mausrad.'];
  if (HB.bearbeiten) return ['Welches Element <em>ändern?</em>', 'Tippe im Bild auf das Element, das du verschieben möchtest.'];
  if (!HB.el.length) return ['Setz dein Fenster <em>ein.</em>', 'Tippe auf Plus und wähle ein gespeichertes Element.'];
  return ['Alles an seinem <em>Platz?</em>', 'Weitere Elemente mit Plus. Dann berechnet die KI-Vorschau, wie dein Haus mit den neuen Fenstern aussehen könnte.'];
}
function hbBuehne() {
  if (!HB.foto) {
    return '<div class="fg-buehne hb-buehne"><div class="hb-leer"><span class="hb-leer-zeichen" aria-hidden="true">' + hbZ('haus') + '</span>' +
      '<p class="hb-leer-satz">Dein Haus, deine Fenster.</p><label class="hb-leer-knopf" for="hb-datei">' + hbZ('foto') + '<span>Foto wählen</span></label></div></div>';
  }
  const src = HB.ergebnis && HB.zeige === 'nach' ? HB.ergebnis : HB.foto.src;
  const els = HB.ergebnis ? '' : HB.el.map((e) => {
    const ak = e.id === HB.aktiv, b = HB.bilder[e.win];
    if (!b) return '';
    return '<div class="hb-el' + (ak ? ' aktiv' : '') + (e.fest && !ak ? ' fest' : '') + '" data-id="' + e.id + '"' + (ak || HB.bearbeiten ? ' tabindex="0" role="button" aria-label="' + esc(e.name) + (ak ? ', wird verschoben' : ', antippen zum Ändern') + '"' : ' aria-hidden="true"') + '>' +
      '<img src="' + b.src + '" alt="" draggable="false"></div>';
  }).join('');
  const ecken = HB.ergebnis ? '' : (HB.el.find((e) => e.id === HB.aktiv) ? [0, 1, 2, 3].map((i) => '<span class="hb-ecke" data-i="' + i + '" aria-hidden="true"></span>').join('') : '');
  const vergleich = HB.ergebnis ? '<div class="hb-vergleich" role="group" aria-label="Vergleich"><button type="button" data-act="hb-zeige" data-v="vor" aria-pressed="' + (HB.zeige === 'vor') + '">Vorher</button><button type="button" data-act="hb-zeige" data-v="nach" aria-pressed="' + (HB.zeige === 'nach') + '">Nachher</button></div>' : '';
  const laedt = HB.laedt ? '<div class="hb-laedt" role="status"><span class="spin"></span><span>' + (HB.langsam ? 'Der Bilddienst hat gerade viel zu tun. Es dauert etwas länger.' : 'Licht, Schatten und Laibung werden gerechnet') + '</span></div>' : '';
  const lupe = HB.ergebnis || HB.laedt ? '' : '<div class="hb-lupe" role="group" aria-label="Lupe"><button type="button" class="hb-rund" data-act="hb-zoom" data-v="1" aria-label="Näher"' + (HB.z >= 3.99 ? ' disabled' : '') + '>' + hbZ('naeher') + '</button>' +
    '<button type="button" class="hb-rund" data-act="hb-zoom" data-v="-1" aria-label="Weiter weg"' + (HB.z <= 1 ? ' disabled' : '') + '>' + hbZ('weiter') + '</button></div>';
  const bedienen = HB.z > 1.001 || (!HB.ergebnis && (HB.aktiv || HB.bearbeiten));
  return '<div class="fg-buehne hb-buehne' + (HB.bearbeiten && !HB.aktiv ? ' waehlen' : '') + '"><div class="hb-rahmen' + (bedienen ? ' bedienen' : '') + '" style="aspect-ratio: ' + HB.foto.w + ' / ' + HB.foto.h + '">' +
    '<div class="hb-zoom"><img class="hb-foto" src="' + src + '" alt="' + (HB.ergebnis && HB.zeige === 'nach' ? 'KI-Visualisierung: dein Haus mit den neuen Elementen, kein Foto' : 'Dein Foto') + '" draggable="false">' +
    '<div class="hb-ebene">' + els + ecken + '</div></div>' + lupe + laedt + (HB.ergebnis && HB.zeige === 'nach' ? '<span class="wz-chip hb-ki-chip" aria-hidden="true">KI-Bild</span>' : '') + '</div>' + vergleich + '</div>';
}
function hbWahl() {
  if (!HB.wahl) return '';
  const zeilen = S.windows.map((w, i) => {
    const b = HB.bilder[i];
    return '<button type="button" class="hb-wahl-zeile" data-act="hb-waehle" data-v="' + i + '"><span class="hb-wahl-bild">' + (b ? '<img src="' + b.src + '" alt="">' : '<span class="spin"></span>') + '</span>' +
      '<span class="hb-wahl-text"><b>' + esc(w.name || artName(w)) + '</b><small>' + esc(lab('art', w.art || 'fenster')) + ((num(w.anzahl) || 1) > 1 ? ' · ' + w.anzahl + ' Stück' : '') + '</small></span><span class="hb-plus-rund" aria-hidden="true">' + hbZ('plus') + '</span></button>';
  }).join('');
  return '<div class="hb-wahl" role="dialog" aria-modal="true" aria-labelledby="hb-wahl-t"><div class="hb-wahl-blatt"><div class="hb-wahl-kopf"><h2 id="hb-wahl-t">Welches Element einsetzen?</h2>' +
    '<button type="button" class="hb-rund" data-act="hb-wahl-zu" aria-label="Schließen">' + hbZ('zu') + '</button></div><div class="hb-wahl-liste">' + zeilen + '</div></div></div>';
}
function hbWerkzeuge() {
  if (!HB.foto || HB.ergebnis || HB.laedt) return '';
  const ak = HB.el.find((e) => e.id === HB.aktiv);
  const k = (act, z, t, an, aus) => '<button type="button" class="hb-werk' + (an ? ' an' : '') + '" data-act="' + act + '"' + (aus ? ' disabled' : '') + (an != null ? ' aria-pressed="' + !!an + '"' : '') + '><span class="hb-werk-rund">' + hbZ(z) + '</span><span>' + t + '</span></button>';
  const reihe = ak
    ? k('hb-dupl', 'kopie', 'Duplizieren') + k('hb-weg', 'weg', 'Entfernen') + k('hb-plus', 'plus', 'Element', null, true)
    : k('hb-plus', 'plus', 'Element') + k('hb-bearbeiten', 'stift', 'Bearbeiten', HB.bearbeiten, !HB.el.length) + '<label class="hb-werk" for="hb-datei"><span class="hb-werk-rund">' + hbZ('foto') + '</span><span>Anderes Foto</span></label>';
  const liste = HB.el.length ? '<p class="hb-liste">' + HB.el.map((e) => '<span class="' + (e.id === HB.aktiv ? 'ak' : e.fest ? 'ok' : '') + '">' + (e.fest && e.id !== HB.aktiv ? hbZ('haken') : '') + esc(e.name) + '</span>').join('') + '</p>' : '';
  return '<div class="hb-werkzeuge">' + reihe + '</div>' + liste;
}
SCREENS.hausbild = function () {
  if (!hbDa()) { setTimeout(() => go('fertig'), 0); return { html: '', dna: true, cls: 'dna' }; }
  const t = hbTitel();
  const kopf = '<div class="hb-kopf"><h1 tabindex="-1">' + t[0] + '</h1><p class="wz-sub">' + t[1] + '</p></div>';
  const fehler = HB.fehler ? '<p class="note warn hb-fehler" role="alert">' + esc(HB.fehler) + '</p>'
    : HB.ergebnis && !HB.laedt && HB.fehlt > 0 ? '<p class="note warn hb-fehler" role="status">' + (HB.fehlt === 1 ? 'Ein Fenster' : HB.fehlt + ' Fenster') + ' konnte die KI gerade nicht berechnen und fehlt im Bild. Tippe auf „Weiter bearbeiten“ und rechne noch einmal.</p>' : '';
  const ergebnis = HB.ergebnis && !HB.laedt ? '<div class="hb-ergebnis-knoepfe"><a class="hb-werk" href="' + HB.ergebnis + '" download="mein-haus-ki-visualisierung.jpg"><span class="hb-werk-rund">' + hbZ('sichern') + '</span><span>Bild speichern</span></a>' +
    '<button type="button" class="hb-werk" data-act="hb-weiter-bearbeiten"><span class="hb-werk-rund">' + hbZ('stift') + '</span><span>Weiter bearbeiten</span></button></div>' : '';
  const hinweis = '<p class="hb-klein">Für die KI-Vorschau gehen nur Ausschnitte rund um deine Elemente an die KI unseres Dienstleisters Cloudflare, und erst nach deiner Zustimmung. Gespeichert wird dein Foto nicht, es bleibt in diesem Browser.' +
    (hbEinwDa() ? ' <button type="button" class="hb-textknopf" data-act="hb-einw-weg">Vorschau-Einwilligung widerrufen</button>' : '') + '</p>';
  const ak = HB.el.find((e) => e.id === HB.aktiv), fest = HB.el.filter((e) => e.fest).length;
  const pille = !HB.foto ? '<label class="dna-pille lg-weiter" for="hb-datei">Foto wählen' + hbPfeil + '</label>'
    : HB.laedt ? '<button type="button" class="dna-pille lg-weiter" disabled><span class="spin"></span> Wird gerechnet</button>'
    : HB.ergebnis ? '<button type="button" class="dna-pille lg-weiter" data-act="hb-fertig">Fertig' + hbPfeil + '</button>'
    : ak ? '<button type="button" class="dna-pille lg-weiter" data-act="hb-ok">Bestätigen' + hbPfeil + '</button>'
    : '<button type="button" class="dna-pille lg-weiter" data-act="hb-vorschau"' + (fest ? '' : ' disabled') + '>KI-Vorschau' + hbPfeil + '</button>';
  const fuss = '<div class="lg-fuss fg-fuss"><button type="button" class="lg-zurueck" data-act="hb-zurueck" aria-label="Zurück">' + LG_PFEIL_L + '</button>' + pille + '</div>';
  const datei = '<input type="file" id="hb-datei" class="hb-datei" accept="image/*">';
  const html = lgKopf(['hb-zurueck', 'Zurück']) + '<div class="fg-tisch hb-tisch">' + hbBuehne() + '<div class="fg-rechts hb-rechts">' + kopf + fehler + hbWerkzeuge() + ergebnis + hinweis + fuss + '</div></div>' + datei + hbWahl() + hbEinwBlatt();
  return { html: html, back: ['Gespeichert', 'fertig'], dna: true, cls: 'dna fg hb', voll: true };
};

/* ---------- nach dem Zeichnen: Datei, Lage der Elemente, Gesten ---------- */
function hbNachRender() {
  if (S.screen !== 'hausbild') return;
  const datei = document.getElementById('hb-datei');
  if (datei && !datei._hb) { datei._hb = true; datei.addEventListener('change', () => { const f = datei.files && datei.files[0]; if (f) hbFotoLaden(f); }); }
  hbLayout();
  const ebene = document.querySelector('.hb-ebene');
  if (ebene && !ebene._hb) { ebene._hb = true; hbGesten(ebene); }
  const ak = document.querySelector('.hb-el.aktiv'); if (ak && document.activeElement === document.body) ak.focus({ preventScroll: true });
}
function hbLayout() {
  const rahmen = document.querySelector('.hb-rahmen'), bue = document.querySelector('.hb-buehne'); if (!rahmen || !bue || !HB.foto) return;
  /* Foto passt ganz in die Bühne (unter Kopf und Chip etwas Luft) */
  const r = bue.getBoundingClientRect(), oben = 14, tel = innerWidth < 900, platzW = r.width - 24, platzH = tel ? Math.max(200, innerHeight * 0.56) : r.height - oben - (HB.ergebnis ? 74 : 26);
  const k = Math.min(platzW / HB.foto.w, platzH / HB.foto.h), w = Math.round(HB.foto.w * k), h = Math.round(HB.foto.h * k);
  rahmen.style.width = w + 'px'; rahmen.style.height = h + 'px';
  HB.anzeige = { w: w, h: h };
  hbZoomSetzen(rahmen);
  rahmen.querySelectorAll('.hb-el').forEach((d) => hbSetzen(d));
  hbEckenSetzen();
}
/* Lupe: Zoom und Ausschnitt; der Ausschnitt bleibt immer ganz im Foto */
function hbZoomSetzen(rahmen) {
  const A = HB.anzeige; if (!A) return;
  HB.tx = Math.min(0, Math.max(A.w - A.w * HB.z, HB.tx)); HB.ty = Math.min(0, Math.max(A.h - A.h * HB.z, HB.ty));
  const z = (rahmen || document).querySelector('.hb-zoom'); if (z) z.style.transform = 'translate(' + HB.tx + 'px,' + HB.ty + 'px) scale(' + HB.z + ')';
  const r = rahmen || document.querySelector('.hb-rahmen'); if (r) r.style.setProperty('--hbz', HB.z);
}
function hbZoom(stufe) {
  const A = HB.anzeige; if (!A) return;
  const e = HB.el.find((x) => x.id === HB.aktiv) || HB.el[HB.el.length - 1], alt = HB.z;
  /* höchstens so nah, dass das gewählte Element samt Eckpunkten im Bild bleibt (sonst erst kleiner ziehen) */
  let grenze = 4;
  if (e && e.id === HB.aktiv) { const p = hbPx(e.q, A.w, A.h), bw = Math.max(...p.map((q) => q[0])) - Math.min(...p.map((q) => q[0])), bh = Math.max(...p.map((q) => q[1])) - Math.min(...p.map((q) => q[1])); grenze = Math.max(1, Math.min(4, Math.min((A.w - 90) / Math.max(1, bw), (A.h - 90) / Math.max(1, bh)))); }
  const neu = Math.max(1, Math.min(grenze, alt + stufe)); if (Math.abs(neu - alt) < 0.01) { if (stufe > 0 && e && e.id === HB.aktiv) toast('Zieh das Element erst etwas kleiner, dann geht die Lupe näher heran.'); return; }
  const m = e ? hbMitte(e.q) : [(A.w / 2 - HB.tx) / alt / A.w, (A.h / 2 - HB.ty) / alt / A.h]; // um das gewählte Element, sonst um die Mitte
  HB.z = neu; HB.tx = A.w / 2 - m[0] * A.w * neu; HB.ty = A.h / 2 - m[1] * A.h * neu;
  render();
}
function hbSetzen(d) {
  const e = HB.el.find((x) => String(x.id) === d.getAttribute('data-id')), b = e && HB.bilder[e.win]; if (!e || !b || !HB.anzeige) return;
  d.style.width = b.w + 'px'; d.style.height = b.h + 'px';
  d.style.transform = 'matrix3d(' + hbMatrix(b.w, b.h, hbPx(e.q, HB.anzeige.w, HB.anzeige.h)).map((v) => +v.toFixed(8)).join(',') + ')';
}
/* Eckpunkte 18 Bildschirmpunkte außerhalb der Ecken (in Richtung von der Mitte weg), gleich groß bei jedem Zoom */
function hbEckpunkte(e) {
  const A = HB.anzeige, p = hbPx(e.q, A.w, A.h), m = hbMitte(p), ab = 18 / HB.z;
  return p.map((pt) => { const dx = pt[0] - m[0], dy = pt[1] - m[1], l = Math.hypot(dx, dy) || 1; return [pt[0] + dx / l * ab, pt[1] + dy / l * ab]; });
}
function hbEckenSetzen() {
  const e = HB.el.find((x) => x.id === HB.aktiv); if (!e || !HB.anzeige) return;
  const p = hbEckpunkte(e);
  document.querySelectorAll('.hb-ecke').forEach((c) => { const i = +c.getAttribute('data-i'); c.style.transform = 'translate(' + p[i][0] + 'px,' + p[i][1] + 'px) scale(' + (1 / HB.z) + ')'; });
}
/* Klasse „bedienen“ (touch-action: none) ohne neues Zeichnen: vergrößert oder beim Setzen der Elemente */
function hbBedienenSetzen() { const r = document.querySelector('.hb-rahmen'); if (r) r.classList.toggle('bedienen', HB.z > 1.001 || (!HB.ergebnis && (!!HB.aktiv || HB.bearbeiten))); }
/* Lupenknöpfe nach einer Geste auf den neuen Zoom bringen */
function hbLupeSetzen() {
  const n = document.querySelector('.hb-lupe [data-v="1"]'), w = document.querySelector('.hb-lupe [data-v="-1"]');
  if (n) n.disabled = HB.z >= 3.99; if (w) w.disabled = HB.z <= 1;
}
/* Doppeltipp: auf z um den Punkt p (im Rahmen) zoomen, kurz und weich (ease-out, 260 ms; ohne bei reduzierter Bewegung) */
function hbZoomAuf(z, p) {
  const zoom = document.querySelector('.hb-zoom'), alt = HB.z; if (!zoom || !HB.anzeige) return;
  HB.tx = p[0] - (p[0] - HB.tx) / alt * z; HB.ty = p[1] - (p[1] - HB.ty) / alt * z; HB.z = z;
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!ruhig) { zoom.style.transition = 'transform 260ms cubic-bezier(0.23, 1, 0.32, 1)'; clearTimeout(zoom._t); zoom._t = setTimeout(() => { zoom.style.transition = ''; }, 300); }
  hbZoomSetzen(); hbEckenSetzen(); hbBedienenSetzen(); hbLupeSetzen();
}
function hbGesten(ebene) {
  /* zeiger: Finger am gewählten Element (verschieben, Ecken, zwei Finger drehen und vergrößern); blick: Finger daneben oder auf der
     fertigen Vorschau (Inhaber, 2.11.2026: „mit den Fingern zoomen und dann verschieben“): zwei Finger zoomen um ihre Mitte, ein Finger
     verschiebt, sobald vergrößert ist; Doppeltipp springt heran und zurück. Während der Geste folgt das Bild dem Finger ohne Animation. */
  const zeiger = new Map(), blick = new Map(); let geste = null, tipp = null;
  const lokal = (ev) => { const r = ebene.getBoundingClientRect(); return [(ev.clientX - r.left) / r.width, (ev.clientY - r.top) / r.height]; };
  const rahmenPunkt = (x, y) => { const r = ebene.closest('.hb-rahmen').getBoundingClientRect(); return [x - r.left, y - r.top]; };
  const aufAktiv = (ev, e) => { const el = ev.target.closest('.hb-el'); return !!e && (!!ev.target.closest('.hb-ecke') || (!!el && +el.getAttribute('data-id') === e.id)); };
  const blickStart = () => {
    const p = Array.from(blick.values());
    if (p.length >= 2) geste = { art: 'blick', z0: HB.z, tx0: HB.tx, ty0: HB.ty, a0: p[0].slice(), b0: p[1].slice() };
    else if (p.length === 1 && HB.z > 1.001) geste = { art: 'schwenk', x: p[0][0], y: p[0][1], tx: HB.tx, ty: HB.ty };
    else geste = null;
  };
  ebene.addEventListener('pointerdown', (ev) => {
    const el = ev.target.closest('.hb-el');
    if (HB.bearbeiten && !HB.aktiv && el && !blick.size) { HB.aktiv = +el.getAttribute('data-id'); render(); return; } // im Bearbeiten-Modus: antippen wählt aus
    const e = HB.ergebnis ? null : HB.el.find((x) => x.id === HB.aktiv);
    if (zeiger.size && !aufAktiv(ev, e)) return; // ein Finger zieht schon am Element: daneben nichts anderes anfangen
    if (!aufAktiv(ev, e) || blick.size) {
      /* Bild: zoomen und verschieben (liegt schon ein Finger neben dem Element, zoomt auch ein zweiter auf dem Element das Bild) */
      blick.set(ev.pointerId, [ev.clientX, ev.clientY]); ebene.setPointerCapture(ev.pointerId);
      if (blick.size >= 2 || HB.z > 1.001) ev.preventDefault();
      tipp = blick.size === 1 ? { x: ev.clientX, y: ev.clientY, t: Date.now(), vorher: tipp && { x: tipp.x, y: tipp.y, t: tipp.t } } : null;
      blickStart(); if (geste) ebene.classList.add('zieht');
      return;
    }
    ev.preventDefault(); ebene.setPointerCapture(ev.pointerId); zeiger.set(ev.pointerId, lokal(ev));
    const ecke = ev.target.closest('.hb-ecke');
    if (zeiger.size === 2) geste = { art: 'zwei', q0: e.q.map((p) => p.slice()), p0: Array.from(zeiger.values()).map((p) => p.slice()) };
    else if (ecke) { const i = +ecke.getAttribute('data-i'), l = lokal(ev); geste = { art: 'ecke', i: i, d: [l[0] - e.q[i][0], l[1] - e.q[i][1]] }; } // Abstand Finger zur Ecke bleibt
    else geste = { art: 'ziehen', q0: e.q.map((p) => p.slice()), s: lokal(ev) };
    ebene.classList.add('zieht');
  });
  ebene.addEventListener('pointermove', (ev) => {
    if (blick.has(ev.pointerId)) {
      blick.set(ev.pointerId, [ev.clientX, ev.clientY]);
      if (tipp && Math.hypot(ev.clientX - tipp.x, ev.clientY - tipp.y) > 10) tipp = null;
      if (!geste) return;
      if (geste.art === 'schwenk') { HB.tx = geste.tx + ev.clientX - geste.x; HB.ty = geste.ty + ev.clientY - geste.y; hbZoomSetzen(); return; }
      if (geste.art === 'blick' && blick.size >= 2) {
        const [a, b] = Array.from(blick.values()), d0 = Math.hypot(geste.b0[0] - geste.a0[0], geste.b0[1] - geste.a0[1]), d1 = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const z = Math.max(1, Math.min(4, geste.z0 * d1 / Math.max(10, d0)));
        const m0 = rahmenPunkt((geste.a0[0] + geste.b0[0]) / 2, (geste.a0[1] + geste.b0[1]) / 2), m1 = rahmenPunkt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        /* der Bildpunkt unter der Mitte der Finger bleibt unter ihr */
        HB.z = z; HB.tx = m1[0] - (m0[0] - geste.tx0) / geste.z0 * z; HB.ty = m1[1] - (m0[1] - geste.ty0) / geste.z0 * z;
        hbZoomSetzen(); hbEckenSetzen();
      }
      return;
    }
    if (!geste || !zeiger.has(ev.pointerId)) return;
    const e = HB.el.find((x) => x.id === HB.aktiv); if (!e) return;
    const p = lokal(ev); zeiger.set(ev.pointerId, p);
    const k = (v) => Math.max(-0.5, Math.min(1.5, v));
    if (geste.art === 'ecke') e.q[geste.i] = [k(p[0] - geste.d[0]), k(p[1] - geste.d[1])];
    else if (geste.art === 'ziehen') { const dx = p[0] - geste.s[0], dy = p[1] - geste.s[1]; e.q = geste.q0.map((a) => [k(a[0] + dx), k(a[1] + dy)]); }
    else if (geste.art === 'zwei' && zeiger.size === 2) {
      /* zwei Finger: verschieben, drehen und vergrößern um die Mitte (im Seitenverhältnis des Bildes gerechnet) */
      const [a, b] = Array.from(zeiger.values()), A = HB.anzeige || { w: 1, h: 1 }, pa = geste.p0[0], pb = geste.p0[1];
      const v0 = [(pb[0] - pa[0]) * A.w, (pb[1] - pa[1]) * A.h], v1 = [(b[0] - a[0]) * A.w, (b[1] - a[1]) * A.h];
      const s = Math.hypot(v1[0], v1[1]) / Math.max(1, Math.hypot(v0[0], v0[1])), w = Math.atan2(v1[1], v1[0]) - Math.atan2(v0[1], v0[0]);
      const m0 = [(pa[0] + pb[0]) / 2 * A.w, (pa[1] + pb[1]) / 2 * A.h], m1 = [(a[0] + b[0]) / 2 * A.w, (a[1] + b[1]) / 2 * A.h], c = Math.cos(w), sn = Math.sin(w);
      e.q = geste.q0.map((q) => { const x = q[0] * A.w - m0[0], y = q[1] * A.h - m0[1]; return [k((m1[0] + s * (c * x - sn * y)) / A.w), k((m1[1] + s * (sn * x + c * y)) / A.h)]; });
    }
    const d = ebene.querySelector('.hb-el.aktiv'); if (d) hbSetzen(d); hbEckenSetzen();
  });
  const ende = (ev) => {
    if (blick.has(ev.pointerId)) {
      blick.delete(ev.pointerId);
      const war = geste && geste.art;
      blickStart();
      if (!blick.size) {
        ebene.classList.remove('zieht');
        if (HB.z < 1.02) { HB.z = 1; hbZoomSetzen(); }
        /* Doppeltipp: heran an die Stelle, bei Zoom zurück aufs ganze Bild */
        if (ev.type === 'pointerup' && tipp && tipp.vorher && tipp.t - tipp.vorher.t < 320 && Math.hypot(tipp.x - tipp.vorher.x, tipp.y - tipp.vorher.y) < 30) { const p = rahmenPunkt(tipp.x, tipp.y); tipp = null; return hbZoomAuf(HB.z > 1.001 ? 1 : 2.5, p); }
        if (war === 'blick' || war === 'schwenk') { hbBedienenSetzen(); hbLupeSetzen(); }
      }
      return;
    }
    zeiger.delete(ev.pointerId);
    if (!zeiger.size) { geste = null; ebene.classList.remove('zieht'); } else if (geste && geste.art === 'zwei') { const e = HB.el.find((x) => x.id === HB.aktiv); geste = e ? { art: 'ziehen', q0: e.q.map((p) => p.slice()), s: Array.from(zeiger.values())[0] } : null; }
  };
  ebene.addEventListener('pointerup', ende); ebene.addEventListener('pointercancel', ende);
  /* Zwei Finger auf dem Bild: Die Seite soll dabei nicht scrollen (bei touch-action: pan-y entscheidet der Browser sonst selbst) */
  ebene.addEventListener('touchstart', (ev) => { if (ev.touches.length > 1 && !ev.target.closest('.hb-el.aktiv, .hb-ecke')) ev.preventDefault(); }, { passive: false });
  ebene.addEventListener('touchmove', (ev) => { if (ev.touches.length > 1 && blick.size > 1) ev.preventDefault(); }, { passive: false });
  /* Mausrad: am gewählten Element vergrößern (mit Umschalt drehen), sonst das Bild um den Mauszeiger zoomen (auch Trackpad mit zwei Fingern) */
  ebene.addEventListener('wheel', (ev) => {
    const e = HB.ergebnis ? null : HB.el.find((x) => x.id === HB.aktiv);
    if (e && ev.target.closest('.hb-el.aktiv, .hb-ecke')) { ev.preventDefault(); return hbDrehenSkalieren(e, ev.shiftKey ? Math.sign(ev.deltaY) * 0.03 : 0, ev.shiftKey ? 1 : Math.exp(-ev.deltaY * 0.0015)); }
    if (ev.shiftKey) return;
    ev.preventDefault();
    const p = rahmenPunkt(ev.clientX, ev.clientY), alt = HB.z, z = Math.max(1, Math.min(4, alt * Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.0015))));
    HB.tx = p[0] - (p[0] - HB.tx) / alt * z; HB.ty = p[1] - (p[1] - HB.ty) / alt * z; HB.z = z < 1.02 ? 1 : z;
    hbZoomSetzen(); hbEckenSetzen(); hbBedienenSetzen();
    clearTimeout(ebene._rad); ebene._rad = setTimeout(hbLupeSetzen, 120);
  }, { passive: false });
  /* Tastatur: Pfeile verschieben, + und − vergrößern, Q und E drehen */
  ebene.addEventListener('keydown', (ev) => {
    const e = HB.el.find((x) => x.id === HB.aktiv); if (!e) return;
    const s = ev.shiftKey ? 0.02 : 0.005, d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[ev.key];
    if (d) { ev.preventDefault(); e.q = e.q.map((p) => [p[0] + d[0], p[1] + d[1]]); }
    else if (ev.key === '+' || ev.key === '=') hbDrehenSkalieren(e, 0, 1.04);
    else if (ev.key === '-') hbDrehenSkalieren(e, 0, 1 / 1.04);
    else if (ev.key === 'q' || ev.key === 'e') hbDrehenSkalieren(e, ev.key === 'q' ? -0.02 : 0.02, 1);
    else if (ev.key === 'Enter') { ev.preventDefault(); return hbAct('hb-ok', ev.target, null); }
    else return;
    const dd = ebene.querySelector('.hb-el.aktiv'); if (dd) hbSetzen(dd); hbEckenSetzen();
  });
}
function hbDrehenSkalieren(e, winkel, faktor) {
  const A = HB.anzeige || { w: 1, h: 1 }, m = hbMitte(e.q), c = Math.cos(winkel), s = Math.sin(winkel);
  e.q = e.q.map((p) => { const x = (p[0] - m[0]) * A.w, y = (p[1] - m[1]) * A.h; return [m[0] + faktor * (c * x - s * y) / A.w, m[1] + faktor * (s * x + c * y) / A.h]; });
  const d = document.querySelector('.hb-el.aktiv'); if (d) hbSetzen(d); hbEckenSetzen();
}

/* ---------- Foto laden ---------- */
function hbFotoLaden(datei) {
  if (!/^image\//.test(datei.type || 'image/')) { HB.fehler = 'Das ist kein Bild. Bitte ein Foto wählen (JPG, PNG oder HEIC vom Handy).'; return render(); }
  const url = URL.createObjectURL(datei), im = new Image();
  im.onload = () => {
    const max = 2000, k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.round(im.naturalWidth * k), h = Math.round(im.naturalHeight * k);
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(im, 0, 0, w, h);
    URL.revokeObjectURL(url);
    HB.foto = { src: cv.toDataURL('image/jpeg', 0.9), w: w, h: h }; HB.ergebnis = null; HB.fehler = ''; HB.zeige = 'nach'; HB.z = 1; HB.tx = 0; HB.ty = 0;
    render();
    if (!HB.el.length) setTimeout(() => hbAct('hb-plus', document.body, null), 250); // gleich weiter: das Element wählen
  };
  im.onerror = () => { URL.revokeObjectURL(url); HB.fehler = 'Das Foto ließ sich nicht öffnen. Bitte ein anderes wählen.'; render(); };
  im.src = url;
}

/* ---------- Element einsetzen ---------- */
function hbEinsetzen(i) {
  const w = S.windows[i], b = HB.bilder[i]; if (!w || !b || !HB.foto) return;
  /* Größe: wie die schon gesetzten Elemente (Millimeter je Bildpunkt), sonst ein Viertel der Bildbreite */
  const mmW = num(w.el && w.el.w) || num(w.w) || 1200, ref = HB.el.find((e) => e.fest);
  let breite = 0.24;
  if (ref) { const rw = S.windows[ref.win], rq = ref.q, rbr = Math.hypot((rq[1][0] - rq[0][0]) * HB.foto.w, (rq[1][1] - rq[0][1]) * HB.foto.h); const rmm = num(rw && rw.el && rw.el.w) || num(rw && rw.w) || 1200; breite = Math.min(0.8, rbr / rmm * mmW / HB.foto.w); }
  const hoehe = breite * HB.foto.w * (b.h / b.w) / HB.foto.h, x0 = 0.5 - breite / 2 + (HB.el.length % 3) * 0.03, y0 = Math.max(0.04, 0.45 - hoehe / 2);
  const id = HB.zaehler++;
  HB.el.push({ id: id, win: i, name: w.name || artName(w), art: w.neu ? 'neu' : 'ersetzen', fest: false, q: [[x0, y0], [x0 + breite, y0], [x0 + breite, y0 + hoehe], [x0, y0 + hoehe]] });
  HB.aktiv = id; HB.bearbeiten = false; HB.wahl = false; HB.ergebnis = null; HB.fehler = '';
  render();
}

/* ---------- Aktionen ---------- */
function hbAct(name, el, v) {
  switch (name) {
    case 'hb-auf': { if (!hbDa()) return; HB.wahl = false; HB.fehler = ''; go('hausbild'); S.windows.forEach((w, i) => hbBildVon(i)); return; }
    case 'hb-zurueck': {
      if (HB.einwFrage) { HB.einwFrage = false; return render(); }
      if (HB.wahl) { HB.wahl = false; return render(); }
      if (HB.ergebnis && !HB.laedt) { HB.ergebnis = null; return render(); }
      HB.aktiv = null; HB.bearbeiten = false; return go('fertig');
    }
    case 'hb-plus': {
      if (!HB.foto) return;
      if (S.windows.length === 1) { const i = 0; HB.wahl = false; return hbBildVon(i).then((b) => { if (b) hbEinsetzen(i); else { HB.fehler = 'Das Bild des Elements ließ sich nicht erzeugen.'; render(); } }); }
      HB.wahl = true; render();
      S.windows.forEach((w, i) => { if (!HB.bilder[i]) hbBildVon(i).then(() => { if (HB.wahl && S.screen === 'hausbild') render(); }); });
      return;
    }
    case 'hb-wahl-zu': HB.wahl = false; return render();
    case 'hb-waehle': { const i = parseInt(v, 10); return hbBildVon(i).then((b) => { if (b) hbEinsetzen(i); }); }
    case 'hb-ok': { const e = HB.el.find((x) => x.id === HB.aktiv); if (e) e.fest = true; HB.aktiv = null; HB.bearbeiten = false; return render(); }
    case 'hb-bearbeiten': { if (!HB.el.length) return; HB.bearbeiten = !HB.bearbeiten; HB.aktiv = null; return render(); }
    case 'hb-dupl': {
      const e = HB.el.find((x) => x.id === HB.aktiv); if (!e) return;
      e.fest = true;
      const id = HB.zaehler++, dx = 0.04;
      HB.el.push(Object.assign({}, e, { id: id, fest: false, q: e.q.map((p) => [p[0] + dx, p[1]]) }));
      HB.aktiv = id; return render();
    }
    case 'hb-weg': { HB.el = HB.el.filter((x) => x.id !== HB.aktiv); HB.aktiv = null; HB.bearbeiten = false; return render(); }
    case 'hb-vorschau': return hbVorschau();
    case 'hb-einw-ja': hbEinwSetzen(true); HB.einwFrage = false; return hbVorschau();
    case 'hb-einw-nein': HB.einwFrage = false; HB.paket = null; return render();
    case 'hb-einw-weg': hbEinwSetzen(false); return toast('Einwilligung widerrufen. Vor der nächsten Vorschau fragen wir wieder.');
    case 'hb-zeige': HB.zeige = v === 'vor' ? 'vor' : 'nach'; return render();
    case 'hb-zoom': return hbZoom(parseInt(v, 10) || 0);
    case 'hb-weiter-bearbeiten': HB.ergebnis = null; return render();
    case 'hb-fertig': HB.aktiv = null; HB.bearbeiten = false; return go('fertig');
  }
}

/* ---------- KI-Vorschau ---------- */
const hbLadeBild = (src) => new Promise((ok, nein) => { const im = new Image(); im.onload = () => ok(im); im.onerror = nein; im.src = src; });
/* Bild auf ein Viereck verziehen: Raster aus Dreiecken, je Dreieck eine affine Abbildung */
function hbVerziehen(c, im, q, n) {
  const w = im.naturalWidth || im.width, h = im.naturalHeight || im.height, m = hbMatrix(w, h, q), N = n || 14;
  for (let iy = 0; iy < N; iy++) for (let ix = 0; ix < N; ix++) {
    const s = [[ix / N * w, iy / N * h], [(ix + 1) / N * w, iy / N * h], [(ix + 1) / N * w, (iy + 1) / N * h], [ix / N * w, (iy + 1) / N * h]];
    const d = s.map((p) => hbPunkt(m, p[0], p[1]));
    hbDreieck(c, im, s[0], s[1], s[2], d[0], d[1], d[2]); hbDreieck(c, im, s[0], s[2], s[3], d[0], d[2], d[3]);
  }
}
function hbDreieck(c, im, s0, s1, s2, d0, d1, d2) {
  const [x0, y0] = s0, [x1, y1] = s1, [x2, y2] = s2, det = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1); if (!det) return;
  const f = (u0, u1, u2) => [(u0 * (y1 - y2) + u1 * (y2 - y0) + u2 * (y0 - y1)) / det, (u0 * (x2 - x1) + u1 * (x0 - x2) + u2 * (x1 - x0)) / det, (u0 * (x1 * y2 - x2 * y1) + u1 * (x2 * y0 - x0 * y2) + u2 * (x0 * y1 - x1 * y0)) / det];
  const [a, cc, e] = f(d0[0], d1[0], d2[0]), [b, d, ff] = f(d0[1], d1[1], d2[1]);
  /* Dreieck minimal aufweiten, damit keine Nähte bleiben */
  const mx = (d0[0] + d1[0] + d2[0]) / 3, my = (d0[1] + d1[1] + d2[1]) / 3, auf = (p) => [p[0] + Math.sign(p[0] - mx) * 0.6, p[1] + Math.sign(p[1] - my) * 0.6];
  const p0 = auf(d0), p1 = auf(d1), p2 = auf(d2);
  c.save(); c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.closePath(); c.clip();
  c.transform(a, b, cc, d, e, ff); c.drawImage(im, 0, 0); c.restore();
}
const hbJpeg = (cv, q) => cv.toDataURL('image/jpeg', q || 0.9);
async function hbVorschau() {
  const els = HB.el.filter((e) => e.fest); if (!HB.foto || !els.length || HB.laedt) return;
  /* ohne Einwilligung: erst den Ausschnitt bauen und im Blatt zeigen, was übermittelt würde */
  if (!hbEinwDa()) { try { HB.paket = await hbPaket(els); } catch (e) { HB.paket = null; } HB.einwFrage = true; return render(); }
  HB.laedt = true; HB.fehler = ''; render();
  try {
    const P = HB.paket || await hbPaket(els); HB.paket = null;
    const meldung = (j) => j && j.fehler === 'nicht_eingerichtet' ? 'Die KI-Vorschau ist noch nicht eingeschaltet.' : j && j.fehler === 'rate_limited' ? 'Für heute sind genug Vorschauen gerechnet. Morgen geht es weiter.' : j && j.fehler === 'abgelehnt' ? 'Der Bilddienst hat das Foto abgelehnt. Bitte ein anderes Foto versuchen.' : j && j.fehler === 'einwilligung' ? 'Bitte lade die Seite neu und willige noch einmal ein.' : j && j.fehler === 'neu_laden' ? 'Bitte lade die Seite neu, die App hat sich aktualisiert.' : 'Die Vorschau hat nicht geklappt. Bitte gleich noch einmal.';
    const senden = P.teile ? { teile: P.teile.map((t) => ({ lage: t.lage, vorlagen: t.vorlagen, elemente: t.elemente, format: t.format })), einwilligung: HB_EINW_STAND }
      : { bild: P.bild, lage: P.lage, vorlagen: P.vorlagen, elemente: P.elemente, einwilligung: HB_EINW_STAND };
    const r = await fetch('/api/hausbild', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(senden) });
    let j = await r.json().catch(() => null);
    if (!r.ok || !j || !j.ok) throw new Error(meldung(j));
    const kosten = j.kosten;
    /* abholen: alle 1,5 s nachfragen, höchstens 3 Minuten; nach 25 s sagt die Bühne, dass es länger dauert */
    if (j.warten) {
      const start = Date.now();
      for (;;) {
        await new Promise((ok) => setTimeout(ok, 1500));
        if (Date.now() - start > 25000 && !HB.langsam) { HB.langsam = true; render(); }
        const g = await fetch('/api/hausbild?u=' + encodeURIComponent(j.warten), { headers: { 'x-hausbild': '1' } }).catch(() => null);
        const k = g ? await g.json().catch(() => null) : null;
        if (g && (!g.ok || !k || !k.ok)) throw new Error(meldung(k));
        if (k && k.fertig) { j = k; break; }
        if (Date.now() - start > 180000) throw new Error('Der Bilddienst ist gerade sehr langsam. Bitte später noch einmal.');
      }
    }
    if (P.teile) {
      const da = P.teile.map((t, i) => Object.assign({}, t, { bild: j.bilder && j.bilder[i] })).filter((t) => t.bild);
      if (!da.length) throw new Error(meldung(null));
      await hbEinsetzenTeile(da, P.teile[0]);
      HB.fehlt = P.teile.length - da.length;
    } else { await hbEinsetzenErgebnis(j.bild, els, P); HB.fehlt = 0; }
    HB.kosten = kosten;
  } catch (e) {
    HB.fehler = (e && e.message && !/fetch|network/i.test(e.message)) ? e.message : 'Keine Verbindung. Bitte gleich noch einmal.';
  }
  HB.laedt = false; HB.langsam = false; render();
}
/* Kennzeichnung als KI-Bild (Art. 50 Abs. 2 KI-Verordnung, Prüfung 2.11.2026): sichtbar unten rechts im Bild, damit sie auch bleibt, wenn
   ein Messenger die Metadaten entfernt, und maschinenlesbar als XMP (IPTC DigitalSourceType „compositeWithTrainedAlgorithmicMedia“) */
function hbKennzeichnen(c, W, H) {
  const t = 'KI-Visualisierung · kein Foto · eeziframes.com', g = Math.max(14, Math.round(W * 0.022));
  c.save(); c.font = '500 ' + g + 'px Outfit, "Avenir Next", "Segoe UI", system-ui, sans-serif';
  const b = c.measureText(t).width, pad = Math.round(g * 0.6), h = Math.round(g * 1.7), x = W - b - pad * 2 - Math.round(g * 0.8), y = H - h - Math.round(g * 0.8);
  c.fillStyle = 'rgba(7, 9, 10, .72)'; c.beginPath(); if (c.roundRect) c.roundRect(x, y, b + pad * 2, h, h / 2); else c.rect(x, y, b + pad * 2, h); c.fill();
  c.fillStyle = '#ffffff'; c.textBaseline = 'middle'; c.fillText(t, x + pad, y + h / 2 + 1); c.restore();
}
function hbMitXmp(dataUrl) {
  try {
    const xmp = '<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
      '<rdf:Description rdf:about="" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" ' +
      'Iptc4xmpExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia" xmp:CreatorTool="eeziframes.com (FLUX.2 auf Cloudflare Workers AI)">' +
      '<dc:description><rdf:Alt><rdf:li xml:lang="x-default">KI-Visualisierung mit eeziframes.com (FLUX.2 auf Cloudflare Workers AI), kein Foto</rdf:li></rdf:Alt></dc:description>' +
      '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>';
    const inhalt = new TextEncoder().encode('http://ns.adobe.com/xap/1.0/\0' + xmp), laenge = inhalt.length + 2;
    if (laenge > 65535) return dataUrl;
    const roh = atob(dataUrl.split(',')[1]), b = new Uint8Array(roh.length); for (let i = 0; i < roh.length; i++) b[i] = roh.charCodeAt(i);
    if (b[0] !== 0xff || b[1] !== 0xd8) return dataUrl;
    /* APP1-Segment mit dem XMP direkt hinter den Anfang der Datei (SOI) */
    const neu = new Uint8Array(b.length + 4 + inhalt.length);
    neu.set(b.subarray(0, 2), 0); neu.set([0xff, 0xe1, laenge >> 8, laenge & 255], 2); neu.set(inhalt, 6); neu.set(b.subarray(2), 6 + inhalt.length);
    let s = ''; for (let i = 0; i < neu.length; i += 0x8000) s += String.fromCharCode.apply(null, neu.subarray(i, i + 0x8000));
    return 'data:image/jpeg;base64,' + btoa(s);
  } catch (e) { return dataUrl; }
}
/* Ausschnitt, Lage, Vorlagen und Elemente für den Auftrag (ohne Netz). Cloudflare (/api/status hausbildMax, 508): je Fenster ein Teil mit
   eigenem Ausschnitt unter 512 Pixeln; so hält sich FLUX.2 [klein] an Flügel und Farbe (Vergleich am Beispielhaus, 2.11.2026) */
async function hbPaket(els) {
  const max = typeof SERVER !== 'undefined' && SERVER.hausbildMax > 0 ? SERVER.hausbildMax : 0;
  if (!max) return hbAusschnitt(els, 1600, 900);
  const teile = []; for (const e of els) teile.push(await hbAusschnitt([e], max, max));
  return { teile: teile };
}
async function hbAusschnitt(els, groesse, vgroesse) {
    const W = HB.foto.w, H = HB.foto.h, foto = await hbLadeBild(HB.foto.src);
    /* Ausschnitt: alle Elemente mit Rand, mindestens 384 px, höchstens das ganze Foto */
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    els.forEach((e) => hbPx(e.q, W, H).forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }));
    const rand = Math.max(48, 0.35 * Math.max(x1 - x0, y1 - y0));
    let ax = Math.max(0, Math.floor(x0 - rand)), ay = Math.max(0, Math.floor(y0 - rand)), bx = Math.min(W, Math.ceil(x1 + rand)), by = Math.min(H, Math.ceil(y1 + rand));
    const mind = Math.min(384, W, H);
    if (bx - ax < mind) { const m = (ax + bx) / 2; ax = Math.max(0, Math.round(m - mind / 2)); bx = Math.min(W, ax + mind); ax = bx - mind; }
    if (by - ay < mind) { const m = (ay + by) / 2; ay = Math.max(0, Math.round(m - mind / 2)); by = Math.min(H, ay + mind); ay = by - mind; }
    const cw = bx - ax, ch = by - ay, k = Math.min(1, groesse / Math.max(cw, ch)), ow = Math.round(cw * k), oh = Math.round(ch * k);
    const aus = document.createElement('canvas'); aus.width = ow; aus.height = oh; const ac = aus.getContext('2d'); ac.drawImage(foto, ax, ay, cw, ch, 0, 0, ow, oh);
    const bild = hbJpeg(aus);
    /* Lage: derselbe Ausschnitt mit den eingesetzten Fenstern */
    const vorl = [], vIdx = {};
    for (const e of els) {
      const b = HB.bilder[e.win]; if (!b) continue;
      if (vIdx[e.win] == null) { vIdx[e.win] = vorl.length; vorl.push(b); }
      const im = await hbLadeBild(b.src), q = hbPx(e.q, W, H).map((p) => [(p[0] - ax) * k, (p[1] - ay) * k]);
      hbVerziehen(ac, im, q);
    }
    const lage = hbJpeg(aus);
    /* Vorlagen höchstens vgroesse (mit Rand), auf hellem Grund (der Dienst sieht so die Kanten des Rahmens) */
    const vorlagen = await Promise.all(vorl.map(async (b) => { const im = await hbLadeBild(b.src), s = Math.min(1, (vgroesse - 40) / Math.max(b.w, b.h)), cv = document.createElement('canvas'); cv.width = Math.round(b.w * s) + 40; cv.height = Math.round(b.h * s) + 40; const c = cv.getContext('2d'); c.fillStyle = '#e2e2e0'; c.fillRect(0, 0, cv.width, cv.height); c.drawImage(im, 20, 20, cv.width - 40, cv.height - 40); return hbJpeg(cv, 0.9); }));
    const elemente = els.map((e) => {
      const p = hbPx(e.q, W, H); let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
      p.forEach((pt) => { bx0 = Math.min(bx0, pt[0]); by0 = Math.min(by0, pt[1]); bx1 = Math.max(bx1, pt[0]); by1 = Math.max(by1, pt[1]); });
      const g = (v, a, l) => Math.round((v - a) / l * 1000);
      return { box: [g(by0, ay, ch), g(bx0, ax, cw), g(by1, ay, ch), g(bx1, ax, cw)], vorlage: vIdx[e.win] || 0, art: e.art, daten: hbDaten(S.windows[e.win]) };
    });
    return { bild: bild, lage: lage, vorlagen: vorlagen, elemente: elemente, format: [ow, oh], els: els, ax: ax, ay: ay, cw: cw, ch: ch, W: W, H: H, foto: foto };
}
/* Ergebnis nur innerhalb der Elementflächen ins Originalfoto, weich auslaufend; teile: [{ bild, els, ax, ay, cw, ch }] (Cloudflare: je Fenster
   ein Teil mit eigenem Ausschnitt), alle auf demselben Foto */
async function hbEinsetzenErgebnis(ergebnis, els, P) { return hbEinsetzenTeile([Object.assign({}, P, { bild: ergebnis, els: els })], P); }
async function hbEinsetzenTeile(teile, P) {
    const { W, H, foto } = P;
    const voll = document.createElement('canvas'); voll.width = W; voll.height = H; const vc = voll.getContext('2d'); vc.drawImage(foto, 0, 0, W, H);
    for (const t of teile) {
    const { ax, ay, cw, ch, els } = t;
    const neu = await hbLadeBild(t.bild);
    const schicht = document.createElement('canvas'); schicht.width = W; schicht.height = H; const sc = schicht.getContext('2d'); sc.drawImage(neu, ax, ay, cw, ch);
    const maske = document.createElement('canvas'); maske.width = W; maske.height = H; const mc = maske.getContext('2d'), weit = W * 3;
    els.forEach((e) => {
      const p = hbPx(e.q, W, H), m = hbMitte(p), gr = Math.max(Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1]), Math.hypot(p[3][0] - p[0][0], p[3][1] - p[0][1]));
      const r2 = Math.max(6, gr * 0.06), q2 = p.map((pt) => [m[0] + (pt[0] - m[0]) * 1.24, m[1] + (pt[1] - m[1]) * 1.24 + (pt[1] > m[1] ? gr * 0.06 : 0)]); // mit Laibung, Schatten und Fensterbank
      mc.save(); mc.shadowColor = '#000'; mc.shadowBlur = r2; mc.shadowOffsetX = -weit; mc.fillStyle = '#000'; mc.beginPath();
      q2.forEach((pt, i) => (i ? mc.lineTo(pt[0] + weit, pt[1]) : mc.moveTo(pt[0] + weit, pt[1]))); mc.closePath(); mc.fill(); mc.restore();
    });
    sc.globalCompositeOperation = 'destination-in'; sc.drawImage(maske, 0, 0); vc.drawImage(schicht, 0, 0);
    }
    hbKennzeichnen(vc, W, H);
    HB.ergebnis = hbMitXmp(hbJpeg(voll, 0.92)); HB.zeige = 'nach'; HB.z = 1; HB.tx = 0; HB.ty = 0;
}
window.addEventListener('resize', () => { if (S.screen === 'hausbild') hbLayout(); });

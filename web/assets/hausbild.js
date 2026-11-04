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
  weiter: '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.5 12.5 17 17M6 8.5h5"/>',
  ganz: '<path d="M3.5 7.5v-4h4M12.5 3.5h4v4M16.5 12.5v4h-4M7.5 16.5h-4v-4"/>'
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

/* ---------- Vorher/Nachher am Beispielhaus (Inhaber, 4.11.2026: „irgendwo muss man ja drauf kommen im Verlauf und sich denken boah wie
   geil ist das denn und dann das mal ausprobieren können“) ----------
   Das Haus der Startseite (web/bilder/start/fassade.webp) und dasselbe Foto mit neuen Fenstern in Anthrazit: gerechnet mit FLUX.2 [pro],
   danach nur die Fensterflächen weich ins Original gesetzt (wie die App es mit dem Ergebnis macht), damit Licht, Läden und Haustür gleich
   bleiben (web/bilder/hausbild/beispiel-*.webp). Kennzeichnung „KI-Bild“ am Nachher. Bedienung: ziehen (Finger oder Maus, waagrecht;
   senkrecht scrollt die Seite weiter), Tippen springt dorthin, am Rechner die Pfeiltasten über den Regler. Beim ersten Erscheinen wischt
   die Linie einmal von „Vorher“ zu „Nachher“ (1,2 s, ease-in-out; erklärt die Bedienung), bei weniger Bewegung steht sie in der Mitte. */
function hbVorherNachher() {
  return '<figure class="hb-vn" style="--vn: 50%"><img class="hb-vn-vor" src="/bilder/hausbild/beispiel-vorher.webp" width="800" height="500" alt="Beispielhaus mit alten Holzfenstern" loading="lazy" decoding="async" draggable="false">' +
    '<img class="hb-vn-nach" src="/bilder/hausbild/beispiel-nachher.webp" width="800" height="500" alt="Dasselbe Haus mit neuen Fenstern in Anthrazit, von einer KI berechnet" loading="lazy" decoding="async" draggable="false">' +
    '<span class="wz-chip hb-vn-chip l" aria-hidden="true">Vorher</span><span class="wz-chip hb-vn-chip r" aria-hidden="true">Nachher · KI-Bild</span>' +
    '<span class="hb-vn-linie" aria-hidden="true"><i class="hb-vn-griff"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6 3 10l4 4M13 6l4 4-4 4"/></svg></i></span>' +
    '<input type="range" class="hb-vn-regler" min="0" max="100" value="50" aria-label="Vorher und Nachher vergleichen"></figure>';
}
const hbVnFertig = new WeakSet();
function hbVnBinden() {
  document.querySelectorAll('.hb-vn').forEach((f) => {
    if (hbVnFertig.has(f)) return; hbVnFertig.add(f);
    const regler = f.querySelector('.hb-vn-regler');
    const setzen = (p) => { const v = Math.max(0, Math.min(100, p)); f.style.setProperty('--vn', v + '%'); if (regler) regler.value = String(Math.round(v)); };
    const punkt = (e) => { const r = f.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
    let zug = null;
    f.addEventListener('pointerdown', (e) => { if (e.button > 0) return; zug = { x: e.clientX, y: e.clientY, an: false, id: e.pointerId }; f._wisch = false; });
    f.addEventListener('pointermove', (e) => {
      if (!zug || e.pointerId !== zug.id) return;
      const dx = e.clientX - zug.x, dy = e.clientY - zug.y;
      if (!zug.an) { if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; if (Math.abs(dy) > Math.abs(dx)) { zug = null; return; } zug.an = true; try { f.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } f.classList.add('zieht'); }
      setzen(punkt(e));
    });
    const ende = (e) => { if (zug && e.pointerId === zug.id) { if (!zug.an && e.type === 'pointerup') setzen(punkt(e)); zug = null; f.classList.remove('zieht'); } };
    f.addEventListener('pointerup', ende); f.addEventListener('pointercancel', ende);
    if (regler) regler.addEventListener('input', () => { f._wisch = false; setzen(Number(regler.value)); });
    /* einmal wischen, sobald es zur Hälfte im Bild ist */
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((ein) => {
      if (!ein[0] || !ein[0].isIntersecting) return; io.disconnect();
      const t0 = performance.now(), von = 88, bis = 38, kurve = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      f._wisch = true;
      const lauf = (t) => { if (!f._wisch) return; const k = Math.min(1, Math.max(0, (t - t0) / 1200)); setzen(von + (bis - von) * kurve(k)); if (k < 1) requestAnimationFrame(lauf); };
      requestAnimationFrame(lauf);
    }, { threshold: 0.5 });
    io.observe(f);
  });
}
window.hbVnBinden = hbVnBinden;

/* ---------- Einladung in „Gespeichert“ und in der Liste (hellblau, Wunsch des Inhabers vom 2.11.2026) ----------
   Seit 4.11.2026 mit dem Vorher/Nachher am Beispielhaus und sichtbar, sobald ein Fenster gespeichert ist (vorher erst mit vollständigen
   Maßen; der Inhaber fand die Funktion im Ablauf nicht). Zeile „Eine Vorschau ist frei“; der Knopf bleibt leise (die volle Pille ist
   „Zum Aufmaßblatt“). wo: 'liste' für „Deine Fenster“. */
function hbEinladung(wo) {
  if (!hbDa() || !S.windows.length) return '';
  const liste = wo === 'liste', tuer = istTuer(S.win), ding = liste ? 'deine Fenster' : tuer ? 'deine Tür' : S.win.art === 'fest' ? 'deine Verglasung' : 'dein Fenster', rest = hbRest();
  const zeile = rest <= 0 ? (!hbBlattFrei() && !hbKonto() && hbKontoMoeglich() ? 'Weitere Vorschauen, wenn du dein Aufmaß sicherst.' : 'Weitere Vorschauen mit deinem Aufmaßblatt.') : 'Noch ' + rest + (rest === 1 ? ' Vorschau' : ' Vorschauen') + (hbBlattFrei() || hbKonto() ? '.' : ' frei.');
  return '<section class="hb-einladung' + (liste ? ' liste' : '') + '" aria-labelledby="hb-ein-t">' + hbVorherNachher() +
    '<div class="hb-ein-text"><span class="hb-ein-label">An deinem Haus</span><h2 id="hb-ein-t">Sieh ' + ding + ' <em>an deinem Haus.</em></h2>' +
    '<p>So wie oben, nur mit deinem Foto: Foto wählen, ' + (liste ? 'deine Fenster an ihre Stelle' : ding + ' an seine Stelle') + ' ziehen, eine KI rechnet das Bild. ' + zeile + '</p></div>' +
    '<button type="button" class="hb-ein-knopf" data-act="hb-auf">' + hbZ('foto') + '<span>Jetzt an meinem Haus ausprobieren</span><span class="hb-ein-pfeil" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button></section>';
}
window.hbEinladung = hbEinladung;
/* Willkommensseite: zeigt, was am Ende geht (ohne eigenes Fenster noch kein Editor; der Weg dorthin ist das erste Fenster) */
function hbAusblick() {
  if (!hbDa()) return '';
  return '<section class="wl-haus-ausblick" aria-labelledby="wl-hb-t"><span class="dna-label">Am Ende: dein Haus</span><h2 id="wl-hb-t">Sieh deine neuen Fenster <em>an deinem Haus.</em></h2>' + hbVorherNachher() +
    '<p class="wl-hb-satz">Zieh die Linie: links heute, rechts mit neuen Fenstern. Mit deinem ersten gespeicherten Fenster probierst du das an einem Foto deines eigenen Hauses aus. ' + HB_FREI_N + ' Vorschauen sind frei.</p>' +
    '<button type="button" class="dna-pille dna-pille--leise wl-hb-knopf" data-act="new">Erstes Fenster ausmessen</button></section>';
}
window.hbAusblick = hbAusblick;

/* ---------- Bild eines Elements aus der 3-D-Bühne ---------- */
function hbBildVon(i) {
  const w = S.windows[i]; if (!w) return Promise.resolve(null);
  const key = i + '|' + (w.aend || 0) + '|' + JSON.stringify([w.art, w.teilung, w.fa, w.wunschA, w.roll, w.sart, w.ol, w.bars && w.bars.length, w.el && w.el.w, w.el && w.el.h, w.w, w.h, w.sfarbe, w.wunschSf, w.sfTeile, w.sfK, w.sfS, w.blende, w.klFarbe, w.klBauart]);
  if (HB.bilder[i] && HB.bilder[i].key === key) return Promise.resolve(HB.bilder[i]);
  return hbStudio(w).then((b) => { if (b) { b.key = key; HB.bilder[i] = b; } return b; });
}
let hbStudioKette = Promise.resolve();
/* Teile, die nicht zum Fensterrahmen gehören (Kasten, Schienen, Behang, Fensterbank, Klappläden, Insektenschutz, Bedienung innen) */
const HB_NICHT_RAHMEN = '.w3d-an, .w3d-roll, [class*="w3d-roll-"], [class*="w3d-behang"], .w3d-fs, [class*="w3d-fs-"], [class*="w3d-kl"], [class*="w3d-ins"], [class*="w3d-gel"], [class*="w3d-gitter"]';
/* ein Standbild der Bühne: ganz oder nur der Rahmen (ohne die Teile oben); null ohne WebGL */
function hbStudioBild(w, nurRahmen) {
  return new Promise((fertig) => {
    let box = document.getElementById('hb-studio');
    if (!box) { box = document.createElement('div'); box.id = 'hb-studio'; box.setAttribute('aria-hidden', 'true'); document.body.appendChild(box); }
    /* Behang ganz hochgefahren (wie im Auftrag an die KI): Kasten, Blende und Schienen bleiben sichtbar, das Fenster frei */
    const o = { id: 'hb-studio-st', view: 'aussenGerade', frei: true, haus: false, sway: false, noZoom: true, zkey: 'hb-studio', behang: { stand: 0, wend: 0, pos: 0 } };
    box.innerHTML = model(w, o);
    const st = box.querySelector('.w3d-stage'), weg = () => { box.innerHTML = ''; delete W3DS['hb-studio-st']; };
    if (!st) { weg(); return fertig(null); }
    st.classList.add('no-anim'); w3dApply(st, w, W3DS['hb-studio-st'].o);
    st.querySelectorAll(nurRahmen ? HB_NICHT_RAHMEN : '.w3d-an').forEach((e) => e.remove()); // Gurt, Wickler, Taster sitzen innen; ohne Wand sähe die KI sie vor der Fassade
    if (!window.Buehne3D || !window.Buehne3D.an(st)) { weg(); return fertig(null); }
    requestAnimationFrame(() => requestAnimationFrame(() => { const url = window.Buehne3D.foto(st); weg(); fertig(url || null); }));
  });
}
/* Element einmal ganz und einmal nur mit Rahmen rendern (gleiche Kamera): Der Rahmen bestimmt die vier Eckpunkte im Editor (Inhaber,
   4.11.2026: „die Ecken … nicht vom eigentlichen Element oder Fensterrahmen“, sondern von den Schienen des Rollladenkastens). b.rahmen:
   Lage des Rahmens im zugeschnittenen Bild als Anteile [x0, y0, x1, y1]. */
function hbStudio(w) {
  const lauf = hbStudioKette.then(async () => {
    const url = await hbStudioBild(w, false); if (!url) return hbZeichnung(w);
    const voll = await hbAlphaBox(url); if (!voll) return hbZeichnung(w);
    const nur = await hbStudioBild(w, true).then((u) => (u ? hbAlphaBox(u) : null)).catch(() => null);
    const b = hbAusschneiden(voll);
    if (nur && nur.x1 > nur.x0 && nur.y1 > nur.y0) {
      const W = voll.x1 - voll.x0 + 2, H = voll.y1 - voll.y0 + 2, k = (v, a, l) => Math.max(0, Math.min(1, (v - a) / l));
      const r = [k(nur.x0, voll.x0, W), k(nur.y0, voll.y0, H), k(nur.x1 + 2, voll.x0, W), k(nur.y1 + 2, voll.y0, H)];
      if (r[2] - r[0] > 0.2 && r[3] - r[1] > 0.2) b.rahmen = r;
    }
    return b;
  });
  hbStudioKette = lauf.catch(() => null);
  return lauf;
}
/* Bild laden und den sichtbaren Bereich (Deckkraft über 12) bestimmen */
function hbAlphaBox(url) {
  return new Promise((fertig) => {
    const im = new Image();
    im.onload = () => {
      const cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight; const c = cv.getContext('2d'); c.drawImage(im, 0, 0);
      let px; try { px = c.getImageData(0, 0, cv.width, cv.height).data; } catch (e) { return fertig({ cv: cv, x0: 0, y0: 0, x1: cv.width - 2, y1: cv.height - 2, url: url }); }
      let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
      for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) if (px[(y * cv.width + x) * 4 + 3] > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      fertig(x1 < 0 ? null : { cv: cv, x0: x0, y0: y0, x1: x1, y1: y1, url: url });
    };
    im.onerror = () => fertig(null);
    im.src = url;
  });
}
/* durchsichtigen Rand abschneiden */
function hbAusschneiden(a) {
  const w = a.x1 - a.x0 + 2, h = a.y1 - a.y0 + 2, aus = document.createElement('canvas'); aus.width = w; aus.height = h;
  aus.getContext('2d').drawImage(a.cv, a.x0, a.y0, w, h, 0, 0, w, h);
  return { src: aus.toDataURL('image/png'), w: w, h: h };
}
function hbZuschneiden(url) { return hbAlphaBox(url).then((a) => (a ? hbAusschneiden(a) : null)); }
/* ohne WebGL: einfache Ansicht von außen in der Rahmenfarbe (Flügel, Glas, Kasten des Sonnenschutzes) */
function hbZeichnung(w) {
  const bw = num(w.el && w.el.w) || num(w.w) || 1200, bh = num(w.el && w.el.h) || num(w.h) || 1400, k = 520 / Math.max(bw, bh);
  const W = Math.round(bw * k), kasten = /^(rollladen|raffstore|screen)$/.test(String(w.sart || '')) && w.roll !== 'unterputz' && !(typeof istOffen === 'function' && istOffen(w, 'sart')) ? Math.round(150 * k) : 0, H = Math.round(bh * k) + kasten;
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
  return { src: cv.toDataURL('image/png'), w: W, h: H, zeichnung: true, rahmen: [0, kasten / H, 1, 1] };
}

/* Daten des Fensters für den Auftrag an den Bilddienst (functions/api/hausbild.js, beschreibung). Sonnenschutz seit 4.11.2026 mit allem,
   was man von außen sieht (Inhaber: „ob das ein Vorbaukasten ist oder unter Putz oder oben mit Blende oder ohne … Farben“): Kastenart,
   Blende des Aufsatzkastens, Farbe von Behang, Kasten und Schienen (wie der Behang, wie der Rahmen oder eigene), Klappläden mit Farbe. */
const hbHex = (x) => { const m = String((x && typeof x === 'object' ? (x.hex || x.solid || x.bg || (Array.isArray(x) ? x[0] : '')) : x) || '').match(/#[0-9a-f]{6}/i); return m ? m[0].toLowerCase() : ''; };
function hbFarbeVon(k) {
  if (!k) return '';
  const r = typeof ralFarbe === 'function' ? ralFarbe(k) : null; if (r && r.hex) return hbHex(r.hex);
  return typeof SFARBE !== 'undefined' && SFARBE[k] ? hbHex(SFARBE[k][0]) : '';
}
function hbSonneDaten(w, rahmen) {
  const offen = (k) => typeof istOffen === 'function' && istOffen(w, k);
  if (w.sart === 'klappladen' && !offen('sart')) return { sonne: 'klappladen', ladenFarbe: hbFarbeVon(w.klFarbe) || '#f1f0ea' };
  const sonne = typeof sonneAktiv === 'function' && sonneAktiv(w) ? w.sart : '';
  if (!sonne || sonne === 'klappladen') return {};
  const behang = hbHex(typeof farbLesen === 'function' && farbLesen(w.wunschSf)) || hbFarbeVon(w.sfarbe) || '#c9cdd1';
  const teile = w.sfTeile === 'rahmen' ? rahmen : w.sfTeile === 'eigen' ? null : behang;
  const kasten = teile || hbFarbeVon(w.sfK) || behang, schienen = teile || hbFarbeVon(w.sfS) || behang;
  const einbau = ['aufsatz', 'vorbau', 'unterputz'].indexOf(w.roll) >= 0 ? w.roll : 'aufsatz';
  return { sonne: sonne, kasten: einbau, blende: einbau === 'aufsatz' ? (w.blende === 'alu' ? 'alu' : 'fassade') : '', behangFarbe: behang, kastenFarbe: kasten, schienenFarbe: schienen };
}
function hbDaten(w) {
  if (!w) return {};
  const f = rahmenFarbe(w, 'aussen'), farbe = hbHex(f);
  return Object.assign({ farbe: farbe, fluegel: (w.sashes || []).length || 1, oberlicht: !!w.ol, sprossen: (w.bars || []).length > 0, tuer: istTuer(w), sonne: '',
    glas: (w.glasfn || []).indexOf('sicht') >= 0 ? 'ornament' : 'klar' }, hbSonneDaten(w, farbe));
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
/* Die vier Eckpunkte sitzen auf dem Fensterrahmen (b.rahmen); Kasten, Schienen und Läden ragen darüber hinaus. hbVoll rechnet aus dem
   Rahmen-Viereck (in Bildpunkten) die vier Ecken des ganzen Bildes mit derselben Perspektive (Homographie vom Rahmen aus fortgesetzt). */
function hbVoll(qpx, b) {
  const r = b && b.rahmen; if (!r) return qpx;
  const fw = Math.max(1, (r[2] - r[0]) * b.w), fh = Math.max(1, (r[3] - r[1]) * b.h), ox = r[0] * b.w, oy = r[1] * b.h, m = hbMatrix(fw, fh, qpx);
  return [[-ox, -oy], [b.w - ox, -oy], [b.w - ox, b.h - oy], [-ox, b.h - oy]].map((p) => hbPunkt(m, p[0], p[1]));
}
const hbVollPx = (e, W, H) => hbVoll(hbPx(e.q, W, H), HB.bilder[e.win]);

/* ---------- Vorschauen zählen (Inhaber, 3.11.2026: „weil ich ja für diese Generierung immer wieder Geld bezahle“) ----------
   Eine KI-Vorschau (ein Durchgang mit allen gesetzten Fenstern) ist frei, das sagt der Editor vorher offen. Weitere gibt es mit dem
   freigeschalteten Aufmaßblatt (gekauft oder über „Angebote aus deiner Nähe“, beides setzt kauf().paid; bei kostenlosem Blatt nach dem
   Senden), dann bis zu HB_MIT_BLATT Durchgänge auf diesem Gerät. Der Zähler liegt im Browser und lenkt nur; die harte Grenze hält der
   Server (Bremse je Tag, functions/api/hausbild.js). So endet „nur mal ansehen“ beim Aufmaßblatt, nicht bei der nächsten Rechnung. */
/* Kontingent seit 4.11.2026 (Inhaber: „maximal zum Beispiel dreimal und wenn man … mehr … generieren möchte, dann soll man zumindest sein
   Aufmaß per Mail sichern und mit Code bestätigen“). Seit dem Abend (Inhaber: „5 Vorschauen für den freien Nutzer, mit E-Mail-Sicherung
   nochmal 10, und wenn man dann das Aufmaß bestellt, bekommt man 25 Vorschauen. Im ‚kostenlos‘-Modus gibt's 50 statt 25“): 5 frei,
   15 mit gesichertem Konto (10 dazu), 25 mit gekauftem Aufmaßblatt, 50 auf dem kostenlosen Weg (Angebote aus der Nähe abgeschickt, oder
   das Blatt ist ohne Preis und gesendet); Gesamtzahlen je Gerät */
const HB_ZAEHL = 'aufmass.hausbild.vorschauen', HB_FREI_N = 5, HB_MIT_BLATT = 25, HB_KOSTENLOS = 50;
const hbGezaehlt = () => { try { return Math.max(0, parseInt(localStorage.getItem(HB_ZAEHL) || '0', 10) || 0); } catch (e) { return 0; } };
const hbZaehlen = () => { try { localStorage.setItem(HB_ZAEHL, String(hbGezaehlt() + 1)); } catch (e) { /* ohne Speicher: zählt nicht */ } };
const hbBlattFrei = () => !!(S.kauf && S.kauf.paid) || (typeof KUNDE_FREI === 'function' && KUNDE_FREI() && !!S.sent);
const HB_MIT_KONTO = 15; // mit E-Mail und Code gesichertes Aufmaß (Konto): 10 zu den 5 freien
/* kostenloser Weg: Anfrage „Angebote aus deiner Nähe“ abgeschickt (Weg A), oder das Blatt hat keinen Preis und ist gesendet */
const hbKostenlos = () => !!(S.verm && S.verm.gesendet) || (typeof KUNDE_FREI === 'function' && KUNDE_FREI() && !!S.sent);
const hbKonto = () => typeof KS !== 'undefined' && !!KS, hbKontoMoeglich = () => typeof kontoBereit === 'function' && kontoBereit();
const hbGrenzeN = () => (hbKostenlos() ? HB_KOSTENLOS : hbBlattFrei() ? HB_MIT_BLATT : hbKonto() ? HB_MIT_KONTO : HB_FREI_N);
const hbRest = () => Math.max(0, hbGrenzeN() - hbGezaehlt());
const hbBlattZiel = () => (typeof FREI === 'function' && FREI() ? 'teilen' : 'anfrage');
/* Satz zum Aufmaßblatt: PDF für den Fensterbauer, und was es kostet (Preis aus pakete.js über PREIS()) */
function hbBlattSatz() {
  if (hbBlattFrei() || (typeof FREI === 'function' && FREI())) return 'Alle Maße, Fotos und Wünsche als PDF, mit Code für deinen Fensterbauer.';
  const preis = typeof PREIS === 'function' && PREIS() > 0 ? euro(PREIS()) + (typeof MWST === 'function' && MWST() ? ' inkl. MwSt.' : '') : '';
  const satz = typeof vermAn === 'function' && vermAn() ? 'Kostenlos, wenn du dir Angebote aus deiner Nähe holst, oder ' + preis + ' für dich' : 'Einmalig ' + preis;
  return /\.$/.test(satz) ? satz : satz + '.';
}
const hbPdfZeichen = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 15.5h6M9 9h2"/></svg>';
/* Karte „Dein Aufmaßblatt“: Anthrazit (G14), PDF-Zeichen, drei Ebenen (Label, Titel, eine Zeile) */
function hbBlattKarte(titel) {
  return '<div class="hbv-karte"><span class="hbv-karte-zeichen">' + hbPdfZeichen + '</span><div class="hbv-karte-text"><span class="hbv-karte-label">Dein Aufmaßblatt</span>' +
    '<b>' + (titel || 'Mit allen Wünschen, zum Ausdrucken oder als PDF.') + '</b><small>' + esc('So versteht dein Fensterbauer genau, was du willst. ' + hbBlattSatz()) + '</small></div></div>';
}
function hbGrenzeBlatt() {
  if (!HB.grenze) return '';
  /* Stufen: ohne Konto zuerst sichern (E-Mail und Code), mit Konto das Aufmaßblatt, mit Aufmaßblatt alles gerechnet */
  const frei = hbBlattFrei(), sichern = !frei && !hbKonto() && hbKontoMoeglich();
  const titel = frei ? 'Alle Vorschauen gerechnet.' : sichern ? 'Weitere Vorschauen: Aufmaß sichern.' : 'Weitere Vorschauen mit deinem Aufmaßblatt.';
  const nahe = typeof vermAn === 'function' && vermAn();
  const text = frei ? 'Auf diesem Gerät sind alle ' + hbGrenzeN() + ' Vorschauen gerechnet. Dein Aufmaßblatt hast du: Es geht mit allen Wünschen an deinen Fensterbauer, und der zeigt dir vor Ort echte Muster.'
    : sichern ? 'Deine ' + HB_FREI_N + ' freien Vorschauen hast du gesehen. Sichere dein Aufmaß mit deiner E-Mail-Adresse und einem Code, dann bekommst du ' + (HB_MIT_KONTO - HB_FREI_N) + ' weitere Vorschauen, und dein Aufmaß ist auf jedem Gerät da.'
    : 'Mit deinem Aufmaßblatt rechnest du hier bis zu ' + HB_MIT_BLATT + ' Vorschauen' + (nahe ? ', mit Angeboten aus deiner Nähe kostenlos sogar bis zu ' + HB_KOSTENLOS : '') + '. Dein Fensterbauer bekommt alle Maße, Fotos und Wünsche, zum Ausdrucken oder als PDF.';
  const pille = sichern ? '<button type="button" class="dna-pille lg-weiter" data-act="hb-sichern">Aufmaß sichern' + hbPfeil + '</button>' : '<button type="button" class="dna-pille lg-weiter" data-act="hb-blatt">Zum Aufmaßblatt' + hbPfeil + '</button>';
  return '<div class="hb-wahl" role="dialog" aria-modal="true" aria-labelledby="hb-grenze-t"><div class="hb-wahl-blatt hb-grenze"><div class="hb-wahl-kopf"><h2 id="hb-grenze-t">' + titel + '</h2>' +
    '<button type="button" class="hb-rund" data-act="hb-grenze-zu" aria-label="Schließen">' + hbZ('zu') + '</button></div><p>' + text + '</p>' + (sichern ? '' : hbBlattKarte()) +
    '<div class="hb-grenze-knoepfe">' + pille + '<button type="button" class="hb-textknopf" data-act="hb-grenze-zu">Nicht jetzt</button></div></div></div>';
}

/* ---------- Bildschirm: eigene Maske (Inhaber, 3.11.2026) ----------
   „in dieser kleinen Maske da oben … übelst anstrengend“, „mit dem Daumen dann viele Sachen bedeckt“, „auch größer angezeigt“: Der Editor
   füllt den ganzen Bildschirm. Oben eine schmale Leiste (Zurück, „An deinem Haus“, Schritt x von 3 als Kapselreihe), darunter die Bühne über
   die volle Breite und Höhe, unten ein weißes Blatt mit genau einer Aufgabe und einer Pille. Ein gewähltes Element holt die Bühne groß heran
   (gut die Hälfte der Bühne); beim Ziehen einer Ecke zeigt eine Lupe die Stelle unter dem Finger vergrößert in der freien Ecke der Bühne, mit
   Fadenkreuz und den Kanten des Elements. Feinjustieren ohne Ziehen: links eine Kachel mit dem Element, darauf die vier Ecken und die Mitte
   zum Antippen, rechts Pfeile (Halten wiederholt), für das ganze Element dazu Kleiner und Größer. Mehrere Fenster stehen als Leiste mit Bild
   und Haken im Blatt; antippen holt eins zurück, Plus setzt das nächste. Am Laptop steht das Blatt rechts neben der Bühne. */
const HB_SCHRITTE = ['Foto wählen', 'Fenster setzen', 'KI-Vorschau'];
const hbSchritt = () => (!HB.foto ? 1 : HB.ergebnis || HB.laedt ? 3 : 2);
const hbAk = () => HB.el.find((e) => e.id === HB.aktiv);
function hbTitel() {
  if (HB.laedt) return ['Dein Haus wird <em>gerechnet.</em>', 'Das dauert meist 10 bis 30 Sekunden.'];
  if (HB.ergebnis) return ['So <em>könnte</em> es aussehen.', 'Von einer KI berechnet, kein Foto. Farbe, Teilung und Details wie Fensterbank und Laibung können abweichen. Gemessen und bestellt wird mit deinem Aufmaß.'];
  if (!HB.foto) return ['Ein Foto von <em>deinem Haus.</em>', 'Am besten gerade von vorn und bei Tageslicht. Personen und Autokennzeichen bitte nicht im Bild.'];
  if (hbAk()) return ['Ecken auf die <em>Öffnung.</em>', 'Zieh die vier Punkte auf die Ecken der Maueröffnung. Feiner: Punkt unten antippen, dann die Pfeile.'];
  if (!HB.el.length) return ['Setz dein Fenster <em>ein.</em>', 'Wähle ein gespeichertes Element. Es erscheint groß in deinem Foto.'];
  return ['Alles an seinem <em>Platz?</em>', 'Tippe ein Fenster an, um es zu ändern, oder setz das nächste ein. Dann rechnet die KI, wie dein Haus damit aussehen könnte.'];
}
function hbKopfLeiste() {
  const s = hbSchritt(), kapseln = [1, 2, 3].map((n) => '<i class="' + (n < s ? 'an' : n === s ? 'jetzt' : '') + '"></i>').join('');
  return '<div class="hbv-kopf"><button type="button" class="hbv-rund" data-act="hb-zurueck" aria-label="Zurück">' + LG_PFEIL_L + '</button>' +
    '<p class="hbv-schritt"><b>An deinem Haus</b><span class="hbv-kapseln" aria-hidden="true">' + kapseln + '</span><small>Schritt ' + s + ' von 3 · ' + HB_SCHRITTE[s - 1] + '</small></p><span aria-hidden="true"></span></div>';
}
function hbBuehne() {
  if (!HB.foto) {
    /* Beispielhaus der Startseite (web/index.html, Schritt 2) mit gestrichelten Rahmen: hier kommt dein Foto hin (G1: gestrichelt = noch offen) */
    const f = [[45.4, 60.8, 8.35, 24.2], [30.25, 20.4, 6, 15.8], [41.25, 16.2, 6.85, 16]].map((r) => '<i style="left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%"></i>').join('');
    return '<div class="hbv-buehne hbv-leer"><figure class="hbv-beispiel"><img src="/bilder/start/fassade.webp" width="800" height="500" alt="" decoding="async">' + f + '</figure>' +
      '<span class="wz-chip hbv-chip" aria-hidden="true">Beispiel</span><label class="hbv-leer-knopf" for="hb-datei">' + hbZ('foto') + '<span>Foto von deinem Haus</span></label></div>';
  }
  const src = HB.ergebnis && HB.zeige === 'nach' ? HB.ergebnis : HB.foto.src, ak = HB.ergebnis ? null : hbAk();
  const els = HB.ergebnis ? '' : HB.el.map((e) => {
    const a = e.id === HB.aktiv, b = HB.bilder[e.win];
    if (!b) return '';
    return '<div class="hb-el' + (a ? ' aktiv' : '') + (e.fest && !a ? ' fest' : '') + '" data-id="' + e.id + '"' + (a || !HB.aktiv ? ' tabindex="0" role="button" aria-label="' + esc(e.name) + (a ? ', wird verschoben' : ', antippen zum Ändern') + '"' : ' aria-hidden="true"') + '>' +
      '<img src="' + b.src + '" alt="" draggable="false"></div>';
  }).join('');
  const ecken = ak ? [0, 1, 2, 3].map((i) => '<span class="hb-ecke' + (String(HB.fein) === String(i) ? ' gewaehlt' : '') + '" data-i="' + i + '" aria-hidden="true"></span>').join('') : '';
  const vergleich = HB.ergebnis && !HB.laedt ? '<div class="hb-vergleich" role="group" aria-label="Vergleich"><button type="button" data-act="hb-zeige" data-v="vor" aria-pressed="' + (HB.zeige === 'vor') + '">Vorher</button><button type="button" data-act="hb-zeige" data-v="nach" aria-pressed="' + (HB.zeige === 'nach') + '">Nachher</button></div>' : '';
  const laedt = HB.laedt ? '<div class="hb-laedt" role="status"><span class="spin"></span><span>' + (HB.langsam ? 'Der Bilddienst hat gerade viel zu tun. Es dauert etwas länger.' : 'Licht, Schatten und Laibung werden gerechnet') + '</span></div>' : '';
  const glas = (act, v, z, t, aus) => '<button type="button" class="hbv-glas" data-act="' + act + '" data-v="' + v + '" aria-label="' + t + '"' + (aus ? ' disabled' : '') + '>' + hbZ(z) + '</button>';
  const lupe = HB.laedt ? '' : '<div class="hb-lupe" role="group" aria-label="Ansicht">' + glas('hb-zoom', '1', 'naeher', 'Näher', HB.z >= 3.99) + glas('hb-zoom', '-1', 'weiter', 'Weiter weg', HB.z <= 1) + glas('hb-zoom', '0', 'ganz', 'Ganzes Bild', HB.z <= 1.001) + '</div>';
  const blase = ak ? '<div class="hbv-lupe" aria-hidden="true"><div class="hbv-lupe-bild"></div><svg viewBox="0 0 132 132"><polygon points=""/><path d="M66 50v32M50 66h32"/><circle cx="66" cy="66" r="3.5"/></svg></div>' : '';
  const waehlen = !HB.ergebnis && !HB.aktiv && HB.el.length;
  return '<div class="hbv-buehne"><div class="hb-rahmen' + (waehlen ? ' waehlen' : '') + '"><div class="hb-zoom"><img class="hb-foto" src="' + src + '" alt="' + (HB.ergebnis && HB.zeige === 'nach' ? 'KI-Visualisierung: dein Haus mit den neuen Elementen, kein Foto' : 'Dein Foto') + '" draggable="false">' +
    '<div class="hb-ebene">' + els + ecken + '</div></div></div>' + blase + lupe + laedt + (HB.ergebnis && HB.zeige === 'nach' ? '<span class="wz-chip hb-ki-chip" aria-hidden="true">KI-Bild</span>' : '') + vergleich + '</div>';
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
/* Leiste der gesetzten Fenster (Anthrazit, Bild, Haken), am Ende „Fenster einsetzen“ gestrichelt */
function hbLeiste() {
  const chips = HB.el.map((e) => {
    const b = HB.bilder[e.win];
    return '<button type="button" class="hbv-el" data-act="hb-el" data-v="' + e.id + '" aria-label="' + esc(e.name) + ' ändern"><span class="hbv-el-bild">' + (b ? '<img src="' + b.src + '" alt="">' : '') + '</span>' +
      '<span class="hbv-el-text"><b>' + esc(e.name) + '</b><small>' + (e.fest ? 'gesetzt' : 'noch offen') + '</small></span>' + (e.fest ? '<i class="hbv-haken" aria-hidden="true">' + hbZ('haken') + '</i>' : '') + '</button>';
  }).join('');
  return '<div class="hbv-leiste" role="group" aria-label="Deine Fenster im Foto">' + chips + '<button type="button" class="hbv-el hbv-el-neu" data-act="hb-plus"><span class="hbv-el-bild">' + hbZ('plus') + '</span><span class="hbv-el-text"><b>' + (HB.el.length ? 'Nächstes' : 'Fenster') + '</b><small>einsetzen</small></span></button></div>';
}
/* Feinjustieren: Kachel mit dem Element (Ecken und Mitte zum Antippen) und Pfeile */
const HB_EZ = {
  0: '<path d="M6 14V6h8"/>', 1: '<path d="M6 6h8v8"/>', 2: '<path d="M14 6v8H6"/>', 3: '<path d="M14 14H6V6"/>',
  l: '<path d="M12.5 4.5 7 10l5.5 5.5"/>', r: '<path d="M7.5 4.5 13 10l-5.5 5.5"/>', o: '<path d="M4.5 12.5 10 7l5.5 5.5"/>', u: '<path d="M4.5 7.5 10 13l5.5-5.5"/>',
  klein: '<path d="M5 10h10"/>', gross: '<path d="M10 5v10M5 10h10"/>', alle: '<path d="M10 3v14M3 10h14M7.5 5.5 10 3l2.5 2.5M7.5 14.5 10 17l2.5-2.5M5.5 7.5 3 10l2.5 2.5M14.5 7.5 17 10l-2.5 2.5"/>'
};
const hbEz = (k) => '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + HB_EZ[k] + '</svg>';
function hbFein(e) {
  const f = HB.fein == null ? 'alle' : String(HB.fein), b = HB.bilder[e.win];
  const punkt = (v, t, cls) => '<button type="button" class="hbv-punkt ' + cls + '" role="radio" aria-checked="' + (f === String(v)) + '" data-act="hb-fein" data-v="' + v + '" aria-label="' + t + '"><i aria-hidden="true">' + (v === 'alle' ? hbEz('alle') : '') + '</i></button>';
  const kachel = '<div class="hbv-was" role="radiogroup" aria-label="Was bewegen die Pfeile?">' + (b ? '<img src="' + b.src + '" alt="">' : '') +
    punkt(0, 'Ecke oben links', 'ol') + punkt(1, 'Ecke oben rechts', 'or') + punkt(3, 'Ecke unten links', 'ul') + punkt(2, 'Ecke unten rechts', 'ur') + punkt('alle', 'Ganzes Fenster', 'mi') + '</div>';
  const pf = (act, v, t, cls) => '<button type="button" class="hbv-pfeil ' + cls + '" data-act="' + act + '" data-v="' + v + '" aria-label="' + t + '">' + hbEz(v === '-1' ? 'klein' : v === '1' ? 'gross' : v) + '</button>';
  const pfeile = '<div class="hbv-pfeile' + (f === 'alle' ? ' mit-groesse' : '') + '">' + pf('hb-groesse', '-1', 'Kleiner', 'p-k') + pf('hb-groesse', '1', 'Größer', 'p-g') +
    pf('hb-schub', 'o', 'Nach oben', 'p-o') + pf('hb-schub', 'l', 'Nach links', 'p-l') + pf('hb-schub', 'r', 'Nach rechts', 'p-r') + pf('hb-schub', 'u', 'Nach unten', 'p-u') + '</div>';
  const was = f === 'alle' ? 'Ganzes Fenster' : ['Ecke oben links', 'Ecke oben rechts', 'Ecke unten rechts', 'Ecke unten links'][+f];
  return '<div class="hbv-fein"><p class="hbv-label">Feinjustieren · <b>' + was + '</b></p>' + kachel + pfeile + '</div>';
}
SCREENS.hausbild = function () {
  if (!hbDa()) { setTimeout(() => go('fertig'), 0); return { html: '', dna: true, cls: 'dna' }; }
  const t = hbTitel(), ak = HB.ergebnis ? null : hbAk(), fest = HB.el.filter((e) => e.fest).length;
  const kopf = '<div class="hb-kopf' + (ak ? ' knapp' : '') + '"><h1 tabindex="-1">' + t[0] + '</h1><p class="wz-sub">' + t[1] + '</p></div>';
  const fehler = HB.fehler ? '<p class="note warn hb-fehler" role="alert">' + esc(HB.fehler) + '</p>'
    : HB.ergebnis && !HB.laedt && HB.fehlt > 0 ? '<p class="note warn hb-fehler" role="status">' + (HB.fehlt === 1 ? 'Ein Fenster' : HB.fehlt + ' Fenster') + ' konnte die KI gerade nicht berechnen und fehlt im Bild. Tippe auf „Weiter bearbeiten“ und rechne noch einmal.</p>' : '';
  const hinweis = '<p class="hb-klein">Für die KI-Vorschau gehen nur Ausschnitte rund um deine Elemente an die KI unseres Dienstleisters Cloudflare, und erst nach deiner Zustimmung. Gespeichert wird dein Foto nicht, es bleibt in diesem Browser.' +
    (hbEinwDa() ? ' <button type="button" class="hb-textknopf" data-act="hb-einw-weg">Vorschau-Einwilligung widerrufen</button>' : '') + '</p>';
  const rest = hbRest();
  const frei = '<p class="hbv-frei"><i aria-hidden="true"></i>' + (rest <= 0 ? (!hbBlattFrei() && !hbKonto() && hbKontoMoeglich() ? 'Weitere Vorschauen, wenn du dein Aufmaß sicherst.' : 'Weitere Vorschauen gibt es mit deinem Aufmaßblatt.')
    : 'Noch ' + rest + (rest === 1 ? ' Vorschau' : ' Vorschauen') + (hbBlattFrei() ? ' mit deinem Aufmaßblatt.' : hbKonto() ? ' mit deinem gesicherten Aufmaß.' : ' frei.')) + '</p>';
  let mitte = '';
  if (!HB.foto) mitte = '<ol class="hbv-wie">' + HB_SCHRITTE.map((s, i) => '<li><span>' + (i + 1) + '</span>' + s + '</li>').join('') + '</ol>' + hbBlattKarte('Dein Aufmaß geht als PDF an deinen Fensterbauer.') + hinweis;
  else if (HB.laedt) mitte = '';
  else if (HB.ergebnis) {
    mitte = '<div class="hbv-werk-reihe"><a class="dna-pille dna-pille--leise dna-pille--klein" href="' + HB.ergebnis + '" download="mein-haus-ki-visualisierung.jpg">' + hbZ('sichern') + 'Bild speichern</a>' +
      '<button type="button" class="dna-pille dna-pille--leise dna-pille--klein" data-act="hb-weiter-bearbeiten">' + hbZ('stift') + 'Weiter bearbeiten</button></div>' +
      hbBlattKarte('Gefällt es dir? Dann geht dein Aufmaß als PDF an deinen Fensterbauer.') + hinweis;
  } else if (ak) mitte = hbFein(ak);
  else mitte = hbLeiste() + '<div class="hbv-zeile"><label class="hb-textknopf" for="hb-datei">Anderes Foto wählen</label></div>' + (fest ? frei : '') + hinweis;
  const pille = !HB.foto ? '<label class="dna-pille lg-weiter" for="hb-datei">Foto wählen' + hbPfeil + '</label>'
    : HB.laedt ? '<button type="button" class="dna-pille lg-weiter" disabled><span class="spin"></span> Wird gerechnet</button>'
    : HB.ergebnis ? '<button type="button" class="dna-pille lg-weiter" data-act="hb-blatt">Zum Aufmaßblatt' + hbPfeil + '</button>'
    : ak ? '<button type="button" class="hbv-fuss-rund" data-act="hb-dupl" aria-label="Kopie daneben setzen" title="Kopie daneben">' + hbZ('kopie') + '</button><button type="button" class="hbv-fuss-rund" data-act="hb-weg" aria-label="Fenster entfernen" title="Entfernen">' + hbZ('weg') + '</button><button type="button" class="dna-pille lg-weiter" data-act="hb-ok">Bestätigen' + hbPfeil + '</button>'
    : !HB.el.length ? '<button type="button" class="dna-pille lg-weiter" data-act="hb-plus">Fenster einsetzen' + hbPfeil + '</button>'
    : '<button type="button" class="dna-pille lg-weiter" data-act="hb-vorschau"' + (fest ? '' : ' disabled') + '>KI-Vorschau' + hbPfeil + '</button>';
  const datei = '<input type="file" id="hb-datei" class="hb-datei" accept="image/*">';
  const html = '<div class="hbv" data-schritt="' + hbSchritt() + '">' + hbKopfLeiste() + hbBuehne() + '<div class="hbv-blatt">' + kopf + fehler + mitte + '<div class="hbv-fuss">' + pille + '</div></div></div>' + datei + hbWahl() + hbEinwBlatt() + hbGrenzeBlatt();
  return { html: html, back: ['Gespeichert', 'fertig'], dna: true, cls: 'dna hb', voll: true };
};

/* ---------- nach dem Zeichnen: Datei, Lage der Elemente, Gesten ---------- */
function hbNachRender() {
  if (S.screen !== 'hausbild') return;
  const datei = document.getElementById('hb-datei');
  if (datei && !datei._hb) { datei._hb = true; datei.addEventListener('change', () => { const f = datei.files && datei.files[0]; if (f) hbFotoLaden(f); }); }
  hbLayout();
  const rahmen = document.querySelector('.hb-rahmen'), ebene = document.querySelector('.hb-ebene');
  if (rahmen && ebene && !rahmen._hb) { rahmen._hb = true; hbGesten(rahmen, ebene); }
  hbHalten();
  const ak = document.querySelector('.hb-el.aktiv'); if (ak && document.activeElement === document.body) ak.focus({ preventScroll: true });
}
/* Bühne = Sichtfenster; das Foto passt anfangs ganz hinein (14 px Luft), vergrößert füllt es die ganze Bühne */
function hbLayout() {
  const rahmen = document.querySelector('.hb-rahmen'); if (!rahmen || !HB.foto) return;
  const r = rahmen.getBoundingClientRect(), pad = 14, vw = r.width, vh = r.height; if (vw < 10 || vh < 10) return;
  const k = Math.min((vw - pad * 2) / HB.foto.w, (vh - pad * 2) / HB.foto.h), w = Math.round(HB.foto.w * k), h = Math.round(HB.foto.h * k);
  const alt = HB.anzeige;
  if (!alt || alt.w !== w || alt.h !== h || alt.vw !== vw || alt.vh !== vh) {
    if (alt && HB.z > 1.001) { const mx = (alt.vw / 2 - HB.tx) / (alt.w * HB.z), my = (alt.vh / 2 - HB.ty) / (alt.h * HB.z); HB.tx = vw / 2 - mx * w * HB.z; HB.ty = vh / 2 - my * h * HB.z; } // Mitte halten
    else { HB.z = 1; HB.tx = (vw - w) / 2; HB.ty = (vh - h) / 2; }
  }
  HB.anzeige = { w: w, h: h, vw: vw, vh: vh };
  const zoom = rahmen.querySelector('.hb-zoom'); if (zoom) { zoom.style.width = w + 'px'; zoom.style.height = h + 'px'; }
  hbZoomSetzen(rahmen);
  rahmen.querySelectorAll('.hb-el').forEach((d) => hbSetzen(d));
  hbEckenSetzen();
  if (HB.fokus != null) { const id = HB.fokus; HB.fokus = null; requestAnimationFrame(() => hbFokus(id)); }
  else if (HB.raus) { HB.raus = false; requestAnimationFrame(() => hbZoom(0)); }
}
/* Ausschnitt: kleiner als die Bühne mittig, größer mit 40 px Spiel an den Rändern (damit Eckpunkte am Fotorand greifbar bleiben) */
function hbZoomSetzen(rahmen) {
  const A = HB.anzeige; if (!A) return;
  const sw = A.w * HB.z, sh = A.h * HB.z, spiel = HB.z > 1.001 ? 40 : 0;
  HB.tx = sw + spiel * 2 <= A.vw ? (A.vw - sw) / 2 : Math.min(spiel, Math.max(A.vw - sw - spiel, HB.tx));
  HB.ty = sh + spiel * 2 <= A.vh ? (A.vh - sh) / 2 : Math.min(spiel, Math.max(A.vh - sh - spiel, HB.ty));
  const z = (rahmen || document).querySelector('.hb-zoom'); if (z) z.style.transform = 'translate(' + HB.tx + 'px,' + HB.ty + 'px) scale(' + HB.z + ')';
  const r = rahmen || document.querySelector('.hb-rahmen'); if (r) r.style.setProperty('--hbz', HB.z);
}
/* Blick weich auf z und Verschiebung (ease-out, 280 ms; bei weniger Bewegung sofort) */
function hbBlickAuf(z, tx, ty) {
  const zoom = document.querySelector('.hb-zoom'); if (!zoom || !HB.anzeige) return;
  HB.z = z; HB.tx = tx; HB.ty = ty;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    zoom.style.transition = 'transform 280ms cubic-bezier(0.23, 1, 0.32, 1)'; clearTimeout(zoom._t); zoom._t = setTimeout(() => { zoom.style.transition = ''; }, 320);
  }
  hbZoomSetzen(); hbEckenSetzen(); hbLupeSetzen();
}
/* Näher (1), weiter (-1) um die Mitte der Bühne, 0: ganzes Bild */
function hbZoom(stufe) {
  const A = HB.anzeige; if (!A) return;
  if (!stufe) return hbBlickAuf(1, (A.vw - A.w) / 2, (A.vh - A.h) / 2);
  const z = Math.max(1, Math.min(4, HB.z * (stufe > 0 ? 1.5 : 1 / 1.5))), p = [A.vw / 2, A.vh / 2];
  hbBlickAuf(z < 1.02 ? 1 : z, p[0] - (p[0] - HB.tx) / HB.z * z, p[1] - (p[1] - HB.ty) / HB.z * z);
}
/* gewähltes Element groß heran: es füllt gut die Hälfte der Bühne */
function hbFokus(id) {
  const A = HB.anzeige, e = HB.el.find((x) => x.id === id); if (!A || !e) return;
  const p = hbVollPx(e, A.w, A.h), xs = p.map((q) => q[0]), ys = p.map((q) => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const z = Math.max(1, Math.min(4, Math.min(A.vw * 0.56 / Math.max(1, x1 - x0), A.vh * 0.56 / Math.max(1, y1 - y0))));
  hbBlickAuf(z, A.vw / 2 - (x0 + x1) / 2 * z, A.vh / 2 - (y0 + y1) / 2 * z);
}
function hbSetzen(d) {
  const e = HB.el.find((x) => String(x.id) === d.getAttribute('data-id')), b = e && HB.bilder[e.win]; if (!e || !b || !HB.anzeige) return;
  d.style.width = b.w + 'px'; d.style.height = b.h + 'px';
  d.style.transform = 'matrix3d(' + hbMatrix(b.w, b.h, hbVoll(hbPx(e.q, HB.anzeige.w, HB.anzeige.h), b)).map((v) => +v.toFixed(8)).join(',') + ')';
}
/* Eckpunkte 18 Bildschirmpunkte außerhalb der Ecken (in Richtung von der Mitte weg), gleich groß bei jedem Zoom */
function hbEckpunkte(e) {
  const A = HB.anzeige, p = hbPx(e.q, A.w, A.h), m = hbMitte(p), ab = 18 / HB.z;
  return p.map((pt) => { const dx = pt[0] - m[0], dy = pt[1] - m[1], l = Math.hypot(dx, dy) || 1; return [pt[0] + dx / l * ab, pt[1] + dy / l * ab]; });
}
function hbEckenSetzen() {
  const e = hbAk(); if (!e || !HB.anzeige) return;
  const p = hbEckpunkte(e);
  document.querySelectorAll('.hb-ecke').forEach((c) => { const i = +c.getAttribute('data-i'); c.style.transform = 'translate(' + p[i][0] + 'px,' + p[i][1] + 'px) scale(' + (1 / HB.z) + ')'; });
}
function hbBedienenSetzen() { /* in der eigenen Maske ist die Bühne immer bedienbar (touch-action: none) */ }
/* Ansichtsknöpfe nach einer Geste auf den neuen Zoom bringen */
function hbLupeSetzen() {
  const n = document.querySelector('.hb-lupe [data-v="1"]'), w = document.querySelector('.hb-lupe [data-v="-1"]'), g = document.querySelector('.hb-lupe [data-v="0"]');
  if (n) n.disabled = HB.z >= 3.99; if (w) w.disabled = HB.z <= 1; if (g) g.disabled = HB.z <= 1.001;
}
/* Doppeltipp: auf z um den Punkt p (in der Bühne) */
function hbZoomAuf(z, p) { hbBlickAuf(z, p[0] - (p[0] - HB.tx) / HB.z * z, p[1] - (p[1] - HB.ty) / HB.z * z); }
/* Lupe über dem Daumen: Stelle um die Ecke i vergrößert (2,4-fach der Ansicht), in der Ecke der Bühne, die der Finger nicht verdeckt */
function hbLupeZeigen(e, i, fx, fy) {
  const L = document.querySelector('.hbv-lupe'), A = HB.anzeige; if (!L || !A || !HB.foto || !e) return;
  const bue = L.parentNode.getBoundingClientRect(), R = 66, M = 2.4, s = A.w * HB.z * M, t = A.h * HB.z * M, q = e.q[i];
  const rechts = fx == null ? q[0] * A.w * HB.z + HB.tx < bue.width / 2 : fx - bue.left < bue.width / 2;
  const unten = fy == null ? false : fy - bue.top < bue.height * 0.45 && (rechts ? fx - bue.left > bue.width - 170 : fx - bue.left < 170);
  L.classList.toggle('rechts', rechts); L.classList.toggle('links', !rechts); L.classList.toggle('unten', unten);
  const bild = L.firstChild; if (bild._src !== HB.foto.src) { bild._src = HB.foto.src; bild.style.backgroundImage = 'url("' + HB.foto.src + '")'; }
  bild.style.backgroundSize = s + 'px ' + t + 'px'; bild.style.backgroundPosition = (R - q[0] * s) + 'px ' + (R - q[1] * t) + 'px';
  L.querySelector('polygon').setAttribute('points', e.q.map((p) => ((p[0] - q[0]) * s + R).toFixed(1) + ',' + ((p[1] - q[1]) * t + R).toFixed(1)).join(' '));
  L.classList.add('an'); clearTimeout(L._t);
}
function hbLupeWeg(spaeter) { const L = document.querySelector('.hbv-lupe'); if (!L) return; clearTimeout(L._t); L._t = setTimeout(() => L.classList.remove('an'), spaeter || 0); }
/* Pfeile und Größe: Halten wiederholt (nach 380 ms alle 60 ms); der Klick danach zählt dann nicht noch einmal */
function hbHalten() {
  const box = document.querySelector('.hbv-pfeile'); if (!box || box._hb) return; box._hb = true;
  let t = null, iv = null;
  const stop = () => { clearTimeout(t); clearInterval(iv); t = iv = null; };
  box.addEventListener('pointerdown', (ev) => {
    const b = ev.target.closest('[data-act]'); if (!b) return; stop();
    t = setTimeout(() => { HB.gehalten = true; iv = setInterval(() => hbAct(b.getAttribute('data-act'), b, b.getAttribute('data-v'), true), 60); }, 380);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => box.addEventListener(n, stop));
}
function hbGesten(rahmen, ebene) {
  /* zeiger: Finger am gewählten Element (verschieben, Ecken mit Lupe, zwei Finger drehen und vergrößern); blick: Finger daneben oder auf der
     fertigen Vorschau: zwei Finger zoomen um ihre Mitte, ein Finger verschiebt, sobald vergrößert ist; Doppeltipp springt heran und zurück;
     ein kurzer Tipp auf ein gesetztes Fenster holt es zum Ändern. Die ganze Bühne nimmt die Gesten an (touch-action: none). */
  const zeiger = new Map(), blick = new Map(); let geste = null, tipp = null;
  const lokal = (ev) => { const r = ebene.getBoundingClientRect(); return [(ev.clientX - r.left) / r.width, (ev.clientY - r.top) / r.height]; };
  const rahmenPunkt = (x, y) => { const r = rahmen.getBoundingClientRect(); return [x - r.left, y - r.top]; };
  const aufAktiv = (ev, e) => { const el = ev.target.closest('.hb-el'); return !!e && (!!ev.target.closest('.hb-ecke') || (!!el && +el.getAttribute('data-id') === e.id)); };
  const blickStart = () => {
    const p = Array.from(blick.values());
    if (p.length >= 2) geste = { art: 'blick', z0: HB.z, tx0: HB.tx, ty0: HB.ty, a0: p[0].slice(), b0: p[1].slice() };
    else if (p.length === 1 && HB.z > 1.001) geste = { art: 'schwenk', x: p[0][0], y: p[0][1], tx: HB.tx, ty: HB.ty };
    else geste = null;
  };
  rahmen.addEventListener('pointerdown', (ev) => {
    if (ev.button > 0) return;
    const e = HB.ergebnis ? null : hbAk();
    if (zeiger.size && !aufAktiv(ev, e)) return; // ein Finger zieht schon am Element: daneben nichts anderes anfangen
    if (!aufAktiv(ev, e) || blick.size) {
      blick.set(ev.pointerId, [ev.clientX, ev.clientY]); rahmen.setPointerCapture(ev.pointerId); ev.preventDefault();
      const el = !HB.aktiv && !HB.ergebnis ? ev.target.closest('.hb-el') : null;
      tipp = blick.size === 1 ? { x: ev.clientX, y: ev.clientY, t: Date.now(), el: el ? +el.getAttribute('data-id') : null, vorher: tipp && { x: tipp.x, y: tipp.y, t: tipp.t } } : null;
      blickStart(); if (geste) rahmen.classList.add('zieht');
      return;
    }
    ev.preventDefault(); rahmen.setPointerCapture(ev.pointerId); zeiger.set(ev.pointerId, lokal(ev));
    const ecke = ev.target.closest('.hb-ecke');
    if (zeiger.size === 2) { geste = { art: 'zwei', q0: e.q.map((p) => p.slice()), p0: Array.from(zeiger.values()).map((p) => p.slice()) }; hbLupeWeg(); }
    else if (ecke) {
      const i = +ecke.getAttribute('data-i'), l = lokal(ev); geste = { art: 'ecke', i: i, d: [l[0] - e.q[i][0], l[1] - e.q[i][1]] }; // Abstand Finger zur Ecke bleibt
      if (String(HB.fein) !== String(i)) { HB.fein = i; hbFeinMarken(); }
      hbLupeZeigen(e, i, ev.clientX, ev.clientY);
    } else geste = { art: 'ziehen', q0: e.q.map((p) => p.slice()), s: lokal(ev) };
    rahmen.classList.add('zieht');
  });
  rahmen.addEventListener('pointermove', (ev) => {
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
    const e = hbAk(); if (!e) return;
    const p = lokal(ev); zeiger.set(ev.pointerId, p);
    const k = (v) => Math.max(-0.5, Math.min(1.5, v));
    if (geste.art === 'ecke') { e.q[geste.i] = [k(p[0] - geste.d[0]), k(p[1] - geste.d[1])]; hbLupeZeigen(e, geste.i, ev.clientX, ev.clientY); }
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
        rahmen.classList.remove('zieht');
        if (HB.z < 1.02 && HB.z !== 1) { HB.z = 1; hbZoomSetzen(); }
        if (ev.type === 'pointerup' && tipp) {
          /* kurzer Tipp auf ein gesetztes Fenster: zum Ändern holen */
          if (tipp.el != null && !(tipp.vorher && tipp.t - tipp.vorher.t < 320)) { const id = tipp.el; tipp = null; return hbAct('hb-el', ev.target, String(id)); }
          /* Doppeltipp: heran an die Stelle, bei Zoom zurück aufs ganze Bild */
          if (tipp.vorher && tipp.t - tipp.vorher.t < 320 && Math.hypot(tipp.x - tipp.vorher.x, tipp.y - tipp.vorher.y) < 30) { const p = rahmenPunkt(tipp.x, tipp.y); tipp = null; return HB.z > 1.001 ? hbZoom(0) : hbZoomAuf(2.5, p); }
        }
        if (war === 'blick' || war === 'schwenk') hbLupeSetzen();
      }
      return;
    }
    zeiger.delete(ev.pointerId);
    if (geste && geste.art === 'ecke') hbLupeWeg(260);
    if (!zeiger.size) { geste = null; rahmen.classList.remove('zieht'); } else if (geste && geste.art === 'zwei') { const e = hbAk(); geste = e ? { art: 'ziehen', q0: e.q.map((p) => p.slice()), s: Array.from(zeiger.values())[0] } : null; }
  };
  rahmen.addEventListener('pointerup', ende); rahmen.addEventListener('pointercancel', ende);
  rahmen.addEventListener('touchstart', (ev) => { if (ev.touches.length > 1) ev.preventDefault(); }, { passive: false });
  /* Mausrad: am gewählten Element vergrößern (mit Umschalt drehen), sonst das Bild um den Mauszeiger zoomen (auch Trackpad mit zwei Fingern) */
  rahmen.addEventListener('wheel', (ev) => {
    const e = HB.ergebnis ? null : hbAk();
    if (e && ev.target.closest('.hb-el.aktiv, .hb-ecke')) { ev.preventDefault(); return hbDrehenSkalieren(e, ev.shiftKey ? Math.sign(ev.deltaY) * 0.03 : 0, ev.shiftKey ? 1 : Math.exp(-ev.deltaY * 0.0015)); }
    if (ev.shiftKey) return;
    ev.preventDefault();
    const p = rahmenPunkt(ev.clientX, ev.clientY), alt = HB.z, z = Math.max(1, Math.min(4, alt * Math.exp(-ev.deltaY * (ev.ctrlKey ? 0.01 : 0.0015))));
    HB.tx = p[0] - (p[0] - HB.tx) / alt * z; HB.ty = p[1] - (p[1] - HB.ty) / alt * z; HB.z = z < 1.02 ? 1 : z;
    hbZoomSetzen(); hbEckenSetzen();
    clearTimeout(rahmen._rad); rahmen._rad = setTimeout(hbLupeSetzen, 120);
  }, { passive: false });
  /* Tastatur: Pfeile verschieben, + und − vergrößern, Q und E drehen */
  ebene.addEventListener('keydown', (ev) => {
    const e = hbAk(); if (!e) return;
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
/* gewählten Punkt (Ecke oder Mitte) in Kachel, Bühne und Beschriftung zeigen, ohne neu zu zeichnen */
function hbFeinMarken() {
  const f = HB.fein == null ? 'alle' : String(HB.fein);
  document.querySelectorAll('.hbv-punkt').forEach((b) => b.setAttribute('aria-checked', String(b.getAttribute('data-v') === f)));
  document.querySelectorAll('.hb-ecke').forEach((c) => c.classList.toggle('gewaehlt', c.getAttribute('data-i') === f));
  const was = document.querySelector('.hbv-label b'); if (was) was.textContent = f === 'alle' ? 'Ganzes Fenster' : ['Ecke oben links', 'Ecke oben rechts', 'Ecke unten rechts', 'Ecke unten links'][+f];
  const box = document.querySelector('.hbv-pfeile'); if (box) box.classList.toggle('mit-groesse', f === 'alle');
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
    HB.foto = { src: cv.toDataURL('image/jpeg', 0.9), w: w, h: h }; HB.ergebnis = null; HB.fehler = ''; HB.zeige = 'nach'; HB.z = 1; HB.tx = 0; HB.ty = 0; HB.anzeige = null;
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
  const r = b.rahmen || [0, 0, 1, 1], seite = ((r[3] - r[1]) * b.h) / Math.max(1, (r[2] - r[0]) * b.w); // Höhe zu Breite des Rahmens
  const hoehe = breite * HB.foto.w * seite / HB.foto.h, x0 = 0.5 - breite / 2 + (HB.el.length % 3) * 0.03, y0 = Math.max(0.08, 0.45 - hoehe / 2);
  const id = HB.zaehler++;
  HB.el.push({ id: id, win: i, name: w.name || artName(w), art: w.neu ? 'neu' : 'ersetzen', fest: false, q: [[x0, y0], [x0 + breite, y0], [x0 + breite, y0 + hoehe], [x0, y0 + hoehe]] });
  HB.aktiv = id; HB.fein = 'alle'; HB.fokus = id; HB.bearbeiten = false; HB.wahl = false; HB.ergebnis = null; HB.fehler = '';
  render();
}

/* ---------- Aktionen ---------- */
/* Pfeile: zwei Bildschirmpunkte je Tipp (bei jedem Zoom gleich weit), für die gewählte Ecke oder das ganze Element */
function hbSchieben(e, r) {
  const A = HB.anzeige; if (!A) return;
  const dx = { l: -2, r: 2 }[r] || 0, dy = { o: -2, u: 2 }[r] || 0, sx = dx / (A.w * HB.z), sy = dy / (A.h * HB.z), f = HB.fein == null ? 'alle' : String(HB.fein);
  if (f === 'alle') e.q = e.q.map((p) => [p[0] + sx, p[1] + sy]);
  else { const i = +f; e.q[i] = [e.q[i][0] + sx, e.q[i][1] + sy]; }
  const d = document.querySelector('.hb-el.aktiv'); if (d) hbSetzen(d); hbEckenSetzen();
  if (f !== 'alle') { hbLupeZeigen(e, +f); hbLupeWeg(900); }
}
function hbAct(name, el, v, wiederholt) {
  /* nach dem Halten eines Pfeils zählt der Klick beim Loslassen nicht noch einmal */
  if ((name === 'hb-schub' || name === 'hb-groesse') && !wiederholt && HB.gehalten) { HB.gehalten = false; return; }
  switch (name) {
    case 'hb-auf': { if (!hbDa()) return; HB.wahl = false; HB.fehler = ''; HB.grenze = false; go('hausbild'); S.windows.forEach((w, i) => hbBildVon(i)); return; }
    case 'hb-zurueck': {
      if (HB.grenze) { HB.grenze = false; return render(); }
      if (HB.einwFrage) { HB.einwFrage = false; return render(); }
      if (HB.wahl) { HB.wahl = false; return render(); }
      if (HB.ergebnis && !HB.laedt) { HB.ergebnis = null; return render(); }
      const ak = hbAk(); if (ak) { ak.fest = true; HB.aktiv = null; HB.raus = true; return render(); } // aus dem Setzen zurück: Lage bleibt
      HB.aktiv = null; HB.bearbeiten = false; return go('fertig');
    }
    case 'hb-plus': {
      if (!HB.foto) return;
      const ak = hbAk(); if (ak) { ak.fest = true; HB.aktiv = null; }
      if (S.windows.length === 1) { const i = 0; HB.wahl = false; return hbBildVon(i).then((b) => { if (b) hbEinsetzen(i); else { HB.fehler = 'Das Bild des Elements ließ sich nicht erzeugen.'; render(); } }); }
      HB.wahl = true; render();
      S.windows.forEach((w, i) => { if (!HB.bilder[i]) hbBildVon(i).then(() => { if (HB.wahl && S.screen === 'hausbild') render(); }); });
      return;
    }
    case 'hb-wahl-zu': HB.wahl = false; return render();
    case 'hb-waehle': { const i = parseInt(v, 10); return hbBildVon(i).then((b) => { if (b) hbEinsetzen(i); }); }
    /* ein gesetztes Fenster zum Ändern holen (Leiste oder kurzer Tipp im Foto); ein offenes anderes gilt dann als gesetzt */
    case 'hb-el': {
      const id = parseInt(v, 10), e = HB.el.find((x) => x.id === id); if (!e || HB.ergebnis) return;
      const ak = hbAk(); if (ak && ak.id !== id) ak.fest = true;
      HB.aktiv = id; HB.fein = 'alle'; HB.fokus = id; HB.bearbeiten = false; return render();
    }
    case 'hb-ok': { const e = hbAk(); if (e) e.fest = true; HB.aktiv = null; HB.bearbeiten = false; HB.raus = true; return render(); }
    case 'hb-bearbeiten': { if (!HB.el.length) return; HB.bearbeiten = !HB.bearbeiten; HB.aktiv = null; return render(); }
    case 'hb-fein': { HB.fein = v === 'alle' ? 'alle' : parseInt(v, 10); hbFeinMarken(); const e = hbAk(); if (e && HB.fein !== 'alle') { hbLupeZeigen(e, HB.fein); hbLupeWeg(1200); } return; }
    case 'hb-schub': { const e = hbAk(); if (e) hbSchieben(e, v); return; }
    case 'hb-groesse': { const e = hbAk(); if (e) hbDrehenSkalieren(e, 0, v === '1' ? 1.015 : 1 / 1.015); return; }
    case 'hb-dupl': {
      /* Kopie gleich daneben (gleich große Fenster stehen meist in einer Reihe), passt sie rechts nicht mehr, dann links */
      const e = hbAk(); if (!e) return;
      e.fest = true;
      const xs = e.q.map((p) => p[0]), bw = Math.max(...xs) - Math.min(...xs), dx = Math.max(...xs) + bw * 1.15 <= 1 ? bw * 1.15 : -bw * 1.15;
      const id = HB.zaehler++;
      HB.el.push(Object.assign({}, e, { id: id, fest: false, q: e.q.map((p) => [p[0] + dx, p[1]]) }));
      HB.aktiv = id; HB.fein = 'alle'; HB.fokus = id; return render();
    }
    case 'hb-weg': { HB.el = HB.el.filter((x) => x.id !== HB.aktiv); HB.aktiv = null; HB.bearbeiten = false; HB.raus = true; return render(); }
    case 'hb-vorschau': return hbVorschau();
    case 'hb-einw-ja': hbEinwSetzen(true); HB.einwFrage = false; return hbVorschau();
    case 'hb-einw-nein': HB.einwFrage = false; HB.paket = null; return render();
    case 'hb-einw-weg': hbEinwSetzen(false); return toast('Einwilligung widerrufen. Vor der nächsten Vorschau fragen wir wieder.');
    case 'hb-grenze-zu': HB.grenze = false; return render();
    case 'hb-blatt': HB.grenze = false; HB.aktiv = null; return go(hbBlattZiel());
    case 'hb-sichern': HB.grenze = false; HB.aktiv = null; return typeof sichernStart === 'function' ? sichernStart('sichern') : go('home'); // E-Mail und Code (Konto)
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
  if (hbRest() <= 0) { HB.grenze = true; return render(); } // freie Vorschau gesehen: weiter mit dem Aufmaßblatt
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
    HB.kosten = kosten; hbZaehlen();
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
    els.forEach((e) => hbVollPx(e, W, H).forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }));
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
      const im = await hbLadeBild(b.src), q = hbVollPx(e, W, H).map((p) => [(p[0] - ax) * k, (p[1] - ay) * k]);
      hbVerziehen(ac, im, q);
    }
    const lage = hbJpeg(aus);
    /* Vorlagen höchstens vgroesse (mit Rand), auf hellem Grund (der Dienst sieht so die Kanten des Rahmens) */
    const vorlagen = await Promise.all(vorl.map(async (b) => { const im = await hbLadeBild(b.src), s = Math.min(1, (vgroesse - 40) / Math.max(b.w, b.h)), cv = document.createElement('canvas'); cv.width = Math.round(b.w * s) + 40; cv.height = Math.round(b.h * s) + 40; const c = cv.getContext('2d'); c.fillStyle = '#e2e2e0'; c.fillRect(0, 0, cv.width, cv.height); c.drawImage(im, 20, 20, cv.width - 40, cv.height - 40); return hbJpeg(cv, 0.9); }));
    const elemente = els.map((e) => {
      const p = hbVollPx(e, W, H); let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
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
      const p = hbVollPx(e, W, H), m = hbMitte(p), gr = Math.max(Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1]), Math.hypot(p[3][0] - p[0][0], p[3][1] - p[0][1]));
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

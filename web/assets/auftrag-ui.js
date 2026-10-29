/* eeziframes · Gemeinsame Bausteine für /bestellen/, /konto/ und /zentrale/ (window.AuftragUI), Stil in auftrag.css (Präfix a-)
   Elemente werden mit h() gebaut, nie aus HTML-Text mit fremden Werten (Angaben der Kunden kommen nur als textContent in die Seite).
   Felder: feld() liefert ein Element mit data-k, damit Fehler aus Auftrag.pruefen() und vom Server an der richtigen Stelle stehen.
   Vorschau: vorschau() zeigt die künftige Landingpage in einem kleinen Browser, so wie die Vorlagen der Pakete (Beispiel Fensterbau
   Brandt) sie aufbauen: Essential dunkel im eeziframes-Design, Plus hell mit der Firmenfarbe als Akzent, Signature ganz in der
   Firmenfarbe. Gezeigt wird immer die echte Startseite, nie die persönliche Einladung (Wunsch des Inhabers, 27.10.2026). */
(function () {
  'use strict';
  const A = () => window.Auftrag, P = () => window.Pakete;

  /* ---------- Elemente ---------- */
  function h(tag, attrs) {
    const el = document.createElement(tag);
    const a = attrs || {};
    Object.keys(a).forEach((k) => {
      const v = a[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'on') Object.keys(v).forEach((e) => el.addEventListener(e, v[e]));
      else if (k === 'style') el.setAttribute('style', v);
      else if (k in el && typeof v !== 'string' && k !== 'list') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (let i = 2; i < arguments.length; i++) anhaengen(el, arguments[i]);
    return el;
  }
  function anhaengen(el, k) {
    if (k == null || k === false || k === '') return;
    if (Array.isArray(k)) { k.forEach((x) => anhaengen(el, x)); return; }
    el.appendChild(typeof k === 'string' || typeof k === 'number' ? document.createTextNode(String(k)) : k);
  }
  const leeren = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  /* Text mit zweiter Stimme: „Welches Paket *passt zu Ihnen?*“ → Text und <em> */
  function stimmen(t) {
    const out = []; String(t || '').split(/(\*[^*]+\*)/).forEach((s) => { if (!s) return; out.push(/^\*.*\*$/.test(s) ? h('em', { text: s.slice(1, -1) }) : s); });
    return out;
  }

  /* ---------- Zeichen (feste SVG-Texte, keine fremden Werte) ---------- */
  const SVG = {
    pfeil: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    zurueck: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    x: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    hoch: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 12.5V3.5M4 7.5l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    stift: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13l.6-2.6L10.8 3.2a1.4 1.4 0 0 1 2 2L5.6 12.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    schloss: '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.2" width="7" height="5.3" rx="1.3"/><path d="M4 5.2V3.8a2 2 0 0 1 4 0v1.4"/></svg>',
    haken: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    laden: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v7.5M4.5 7.5 8 11l3.5-3.5M3 13.5h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    kopie: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 3.5A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    aussen: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 3h4v4M13 3 7.5 8.5M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    telefon: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.6 2.5H3.9a1.4 1.4 0 0 0-1.4 1.5 10 10 0 0 0 9.5 9.5 1.4 1.4 0 0 0 1.5-1.4v-1.7a.9.9 0 0 0-.7-.9l-2-.5a.9.9 0 0 0-.9.3l-.7.8a7.2 7.2 0 0 1-3.2-3.2l.8-.7a.9.9 0 0 0 .3-.9l-.5-2a.9.9 0 0 0-1-.8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
  };
  function icon(n) { const s = h('span', { style: 'display:contents' }); s.innerHTML = SVG[n] || ''; return s.firstChild; }
  /* Zeichen wie überall (eine Quelle: scripts/logo-setzen.py, LOGO_INNEN in gemeinsam.js); auf Dunkel färbt auftrag.css Kachel und Rand */
  const MARKE_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect class="fi-kachel" width="64" height="64" rx="10" fill="#000"/><g class="fi-licht" fill="#fff"><path class="fi-decke" d="M26.4 12.2 44.4 19.7 56.3 15.3 42 6.6Z"/><path class="fi-fenster" d="M45 22 57 17.6V41.9L45 39.8Z"/><path class="fi-strahl" d="M44.2 41 55.9 43.3 11.7 64H10A10 10 0 0 1 0 54Z"/></g><rect class="fi-rand" x=".5" y=".5" width="63" height="63" rx="9.5" fill="none" stroke="#000" stroke-opacity=".1"/></svg>';
  function marke(zusatz, href) {
    const a = h('a', { class: 'a-marke', href: href || '/', 'aria-label': 'eeziframes' + (zusatz ? ', ' + zusatz : '') + ', zur Startseite' });
    a.innerHTML = MARKE_SVG;
    a.appendChild(h('span', { class: 'a-wm', translate: 'no' }, h('b', { text: 'eezi' }), 'frames'));
    if (zusatz) a.appendChild(h('small', { text: zusatz }));
    return a;
  }

  /* ---------- Knöpfe ---------- */
  const pille = (text, attrs) => h(attrs && attrs.href ? 'a' : 'button', Object.assign({ class: 'a-pille', type: attrs && attrs.href ? null : 'button' }, attrs || {}), h('span', { text: text }), h('span', { class: 'a-pfeil', 'aria-hidden': 'true' }, icon('pfeil')));
  const ring = (text, attrs) => h(attrs && attrs.href ? 'a' : 'button', Object.assign({ type: attrs && attrs.href ? null : 'button' }, attrs || {}, { class: 'a-ring' + (attrs && attrs.class ? ' ' + attrs.class : '') }), text);
  const rund = (zeichen, label, attrs) => h(attrs && attrs.href ? 'a' : 'button', Object.assign({ type: attrs && attrs.href ? null : 'button', 'aria-label': label }, attrs || {}, { class: 'a-rund' + (attrs && attrs.class ? ' ' + attrs.class : '') }), icon(zeichen));
  /* Knopf in den Wartezustand (Text bleibt für Screenreader, Drehkreis davor) */
  function warten(knopf, an) {
    if (!knopf) return;
    if (an) { knopf.setAttribute('aria-disabled', 'true'); knopf.dataset.wartet = '1'; const t = knopf.querySelector('span'); if (t && !knopf.querySelector('.a-dreh')) t.insertBefore(h('i', { class: 'a-dreh', 'aria-hidden': 'true', style: 'margin-right:8px;vertical-align:-2px' }), t.firstChild); }
    else { knopf.removeAttribute('aria-disabled'); delete knopf.dataset.wartet; const d = knopf.querySelector('.a-dreh'); if (d) d.remove(); }
  }
  const wartet = (knopf) => !!(knopf && knopf.dataset.wartet);

  /* ---------- Gerüst ---------- */
  function kopf(o) {
    o = o || {};
    const k = h('header', { class: 'a-kopf' });
    if (o.zurueck) k.appendChild(typeof o.zurueck === 'string' ? rund('zurueck', o.zurueckLabel || 'Zurück', { href: o.zurueck, class: 'still' }) : rund('zurueck', o.zurueckLabel || 'Zurück', { class: 'still', on: { click: o.zurueck } }));
    k.appendChild(marke(o.zusatz));
    const r = h('div', { class: 'a-kopf-r' }); anhaengen(r, o.rechts); k.appendChild(r);
    return k;
  }
  function stationen(liste, i, titel) {
    const band = h('div', { class: 'a-band', 'aria-hidden': 'true' });
    liste.forEach((s, j) => band.appendChild(h('i', { class: j < i ? 'fertig' : j === i ? 'ist' : '' })));
    return h('div', { class: 'a-stationen', role: 'group', 'aria-label': 'Schritt ' + (i + 1) + ' von ' + liste.length + ': ' + (titel || liste[i].t) }, h('b', { text: titel || liste[i].t }), band, h('small', { text: (i + 1) + ' von ' + liste.length }));
  }
  function frage(titel, text, extra) {
    return h('div', { class: 'a-frage' }, h('h1', { tabindex: '-1' }, stimmen(titel)), text ? h('p', null, stimmen(text)) : null, extra || null);
  }
  const aenderbar = (text) => h('span', { class: 'a-aenderbar' }, icon('stift'), text || 'Alles lässt sich später im Kundenbereich ändern.');
  function karte(titel, sub, inhalt, attrs) {
    return h('section', Object.assign({ class: 'a-karte' }, attrs || {}), titel ? h('div', { class: 'a-karte-kopf' }, h('h2', { text: titel }), sub ? (typeof sub === 'string' ? h('small', { text: sub }) : sub) : null) : null, inhalt);
  }
  const kachel = (inhalt, cls) => h('section', { class: 'a-kachel' + (cls ? ' ' + cls : '') }, inhalt);

  /* ---------- Felder ----------
     o: { k, label, wert, typ, platzhalter, roh, pflicht, hilfe, max, endung, vorschlaege, auto, modus, zeilen, optionen, onInput }
     Rückgabe: Element .a-feld mit .eingabe (input/select/textarea). Platzhalter beginnen mit „z. B.“, damit niemand ein Beispiel für
     eine Eingabe hält (Gremium 27.10.2026); roh: true lässt ihn, wie er ist (Formate wie „123 456“) */
  let feldNr = 0;
  const bsp = (o) => (!o.platzhalter ? '' : o.roh || /^z\.\s?B\./.test(o.platzhalter) ? o.platzhalter : 'z. B. ' + o.platzhalter);
  function feld(o) {
    const id = 'f' + (++feldNr), hilfeId = id + '-h', fehlerId = id + '-e';
    const f = h('div', { class: 'a-feld', 'data-k': o.k });
    /* Pflicht ist die Regel; markiert wird nur, was fehlen darf */
    f.appendChild(h('label', { for: id }, h('span', { text: o.label }), o.optional ? h('span', { class: 'a-optional', text: 'optional' }) : null));
    let e;
    if (o.zeilen) {
      e = h('textarea', { id: id, rows: String(o.zeilen), placeholder: bsp(o), maxlength: o.max ? String(o.max) : null, 'aria-describedby': hilfeId + ' ' + fehlerId });
      e.value = o.wert || '';
      f.appendChild(h('div', { class: 'a-flaeche' }, e));
    } else if (o.optionen) {
      e = h('select', { id: id, 'aria-describedby': hilfeId + ' ' + fehlerId, autocomplete: o.auto || null });
      e.appendChild(h('option', { value: '', text: o.platzhalter || 'Bitte wählen' }));
      o.optionen.forEach((x) => e.appendChild(h('option', { value: x[0], text: x[1] })));
      e.value = o.wert || '';
      f.appendChild(h('div', { class: 'a-eingabe' }, e));
    } else {
      let liste = null;
      if (o.vorschlaege) { liste = h('datalist', { id: id + '-l' }); o.vorschlaege.forEach((x) => liste.appendChild(h('option', { value: x }))); }
      e = h('input', { id: id, type: o.typ || 'text', placeholder: bsp(o), maxlength: o.max ? String(o.max) : null, autocomplete: o.auto || 'off', inputmode: o.modus || null, list: liste ? id + '-l' : null, spellcheck: o.typ === 'email' || o.modus ? 'false' : null, autocapitalize: o.typ === 'email' || o.typ === 'url' ? 'off' : null, 'aria-describedby': hilfeId + ' ' + fehlerId });
      e.value = o.wert || '';
      f.appendChild(h('div', { class: 'a-eingabe' }, e, o.endung ? h('span', { class: 'a-endung', text: o.endung }) : null, liste));
    }
    if (!o.optional) e.setAttribute('aria-required', 'true');
    if (o.max && (o.zeilen || o.zaehlen)) { const z = h('span', { class: 'a-zeichen', 'aria-hidden': 'true' }); const zaehle = () => { z.textContent = e.value.length + ' / ' + o.max; }; zaehle(); e.addEventListener('input', zaehle); f.appendChild(z); }
    f.appendChild(h('p', { class: 'a-hilfe', id: hilfeId, text: o.hilfe || '', hidden: !o.hilfe }));
    f.appendChild(h('p', { class: 'a-fehler', id: fehlerId, hidden: true, role: 'alert' }));
    if (o.onInput) e.addEventListener(o.optionen ? 'change' : 'input', () => o.onInput(e.value, e));
    if (o.onBlur) e.addEventListener('blur', () => o.onBlur(e.value, e));
    f.eingabe = e;
    return f;
  }
  function fehlerSetzen(f, text) {
    if (!f) return;
    /* f kann selbst die Fehlerzeile sein (Hinweis zu einer ganzen Gruppe, z. B. „Bitte eine Wunsch-Domain nennen“) */
    const p = f.classList.contains('a-fehler') ? f : f.querySelector(':scope > .a-fehler'), e = f.eingabe || (p === f ? null : f.querySelector('input,select,textarea'));
    f.classList.toggle('fehlt', !!text);
    if (p) { p.textContent = text || ''; p.hidden = !text; }
    if (e) { if (text) e.setAttribute('aria-invalid', 'true'); else e.removeAttribute('aria-invalid'); }
  }
  /* Fehler { 'betrieb.firma': 'Satz' } auf Felder mit data-k im Bereich verteilen; Rückgabe: erstes Feld mit Fehler */
  function fehlerZeigen(bereich, fehler, praefix) {
    let erstes = null;
    bereich.querySelectorAll('[data-k]').forEach((f) => {
      const k = (praefix ? praefix + '.' : '') + f.getAttribute('data-k'), t = fehler[k] || '';
      if (f.classList.contains('a-haken')) { f.classList.toggle('fehlt', !!t); const p = f.nextElementSibling; if (p && p.classList.contains('a-fehler')) { p.textContent = t; p.hidden = !t; } }
      else fehlerSetzen(f, t);
      if (t && !erstes) erstes = f;
    });
    return erstes;
  }
  function zuFeld(f) {
    if (!f) return;
    const e = f.eingabe || f.querySelector('input,select,textarea,button');
    f.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    if (e) setTimeout(() => e.focus({ preventScroll: true }), 260);
  }
  function haken(o) {
    const e = h('input', { type: 'checkbox' }); e.checked = !!o.an;
    if (o.onChange) e.addEventListener('change', () => o.onChange(e.checked, e));
    const l = h('label', { class: 'a-haken', 'data-k': o.k || null }, e, h('span', null, o.text));
    l.eingabe = e;
    return o.k ? [l, h('p', { class: 'a-fehler', hidden: true, role: 'alert' })] : l;
  }
  /* Segmente: [{ w, t }], gewählter Wert, onWahl(w) */
  function segment(liste, wert, onWahl, label, dunkel) {
    const s = h('div', { class: 'a-segment' + (dunkel ? ' dunkel' : ''), role: 'group', 'aria-label': label || null });
    liste.forEach((x) => { const b = h('button', { type: 'button', 'aria-pressed': String(x.w === wert) }, x.t); b.addEventListener('click', () => { s.querySelectorAll('button').forEach((y) => y.setAttribute('aria-pressed', String(y === b))); onWahl(x.w); }); s.appendChild(b); });
    return s;
  }
  const chip = (text, art) => h('span', { class: 'a-chip' + (art ? ' ' + art : ''), text: text });

  /* ---------- Rückmeldung ---------- */
  let toastEl = null, toastT = 0;
  /* Meldung: im Fuß über der Pille (gehört zur Station, verschwindet mit ihr oder nach 4 s); ohne Fuß oben unter dem Kopf, nie über
     einem Knopf oder Feld (Gremium 27.10.2026) */
  function toast(text) {
    const fuss = document.querySelector('.a-blatt') ? null : document.querySelector('.a-r-fuss');
    if (toastEl && toastEl.parentNode) toastEl.remove();
    clearTimeout(toastT);
    toastEl = h('p', { class: 'a-meldung' + (fuss ? '' : ' oben'), role: 'status', 'aria-live': 'polite', text: text });
    if (fuss) fuss.insertBefore(toastEl, fuss.firstChild); else document.body.appendChild(toastEl);
    const el = toastEl;
    toastT = setTimeout(() => { el.classList.add('weg'); setTimeout(() => el.remove(), 160); }, 4000);
  }
  /* Blatt (Dialog): { titel, text, inhalt, knoepfe: [Element] } → schliessen() */
  function blatt(o) {
    const vorher = document.activeElement;
    const bg = h('div', { class: 'a-blatt-bg' });
    const b = h('div', { class: 'a-blatt', role: 'dialog', 'aria-modal': 'true', 'aria-label': o.titel });
    const zu = () => { bg.remove(); b.remove(); document.removeEventListener('keydown', taste); if (vorher && vorher.focus) vorher.focus(); };
    const taste = (e) => { if (e.key === 'Escape') zu(); if (e.key === 'Tab') { const f = b.querySelectorAll('button,a[href],input,select,textarea'); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } };
    bg.addEventListener('click', zu);
    anhaengen(b, [h('h2', { text: o.titel }), o.text ? h('p', { text: o.text }) : null, o.inhalt || null, o.knoepfe ? h('div', { class: 'a-knoepfe', style: 'margin-top:16px' }, o.knoepfe) : null]);
    document.body.appendChild(bg); document.body.appendChild(b); document.addEventListener('keydown', taste);
    setTimeout(() => { const f = b.querySelector('input,textarea,button'); if (f) f.focus(); }, 30);
    return zu;
  }

  /* ---------- Server ---------- */
  async function api(methode, pfad, body) {
    let r;
    try { r = await fetch(pfad, { method: methode, credentials: 'same-origin', headers: body === undefined ? { accept: 'application/json' } : { 'content-type': 'application/json', accept: 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) }); }
    catch (e) { const f = new Error('Keine Verbindung. Bitte prüfen Sie Ihr Internet und versuchen Sie es noch einmal.'); f.status = 0; throw f; }
    let j = null; try { j = await r.json(); } catch (e) { j = null; }
    if (!r.ok || !j || j.ok === false) { const f = new Error((j && (j.fehler || j.error || j.text)) || 'Das hat gerade nicht geklappt. Bitte noch einmal.'); f.status = r.status; f.daten = j || {}; throw f; }
    return j;
  }

  /* ---------- Formate ---------- */
  const euro = (n) => { n = Number(n) || 0; return (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + ' €'; };
  const datum = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); };
  const zeit = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + ', ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'; };
  const initialen = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '··';
  /* Schwarz oder Weiß auf einer Farbe (relative Leuchtdichte) */
  function aufFarbe(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '#07090a';
    const n = parseInt(m[1], 16), k = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    const L = 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
    return (1.05) / (L + 0.05) > (L + 0.05) / 0.05 ? '#ffffff' : '#07090a';
  }

  /* ---------- Bilder vor dem Hochladen verkleinern (Fotos bis 2400 px, Porträt 900 px, JPEG); Logo, SVG und PDF unverändert ---------- */
  const lesen = (blob) => new Promise((ok, nein) => { const r = new FileReader(); r.onload = () => ok(String(r.result).replace(/^data:[^,]*,/, '')); r.onerror = () => nein(new Error('Die Datei ließ sich nicht lesen.')); r.readAsDataURL(blob); });
  async function vorbereiten(datei, platz) {
    const pl = A().PLAETZE[platz] || {}, foto = /^image\/(jpeg|png|webp)$/.test(datei.type);
    const max = platz === 'portrait' ? 900 : platz === 'logo' ? 1600 : 2400;
    if (foto && platz !== 'logo' || (foto && platz === 'logo' && datei.size > pl.max)) {
      try {
        const bild = await createImageBitmap(datei);
        const f = Math.min(1, max / Math.max(bild.width, bild.height)), c = document.createElement('canvas');
        c.width = Math.round(bild.width * f); c.height = Math.round(bild.height * f);
        /* JPEG kennt keine Transparenz: Fotos mit durchsichtigen Stellen auf Weiß legen, sonst werden sie schwarz (Zentrale, 27.10.2026) */
        const g = c.getContext('2d'); if (platz === 'logo') g.clearRect(0, 0, c.width, c.height); else { g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height); } g.drawImage(bild, 0, 0, c.width, c.height);
        const typ = platz === 'logo' ? 'image/png' : 'image/jpeg';
        const blob = await new Promise((ok) => c.toBlob(ok, typ, 0.86));
        if (blob && blob.size < datei.size) return { daten: await lesen(blob), name: datei.name.replace(/\.[a-z0-9]+$/i, '') + (typ === 'image/png' ? '.png' : '.jpg'), bytes: blob.size };
      } catch (e) { /* Browser ohne createImageBitmap für diesen Typ: Original */ }
    }
    if (pl.max && datei.size > pl.max) throw new Error('Die Datei ist größer als ' + Math.round(pl.max / 1e6) + ' MB.');
    return { daten: await lesen(datei), name: datei.name, bytes: datei.size };
  }

  /* ---------- Vorschau der eigenen Landingpage ----------
     d: { paket, adresse, name, ort, region, ap, rolle, ueberschrift, einleitung, einladung, farbe, logo, portrait, buehne } (Bild-URLs) */
  const kurzname = (paket) => String(((P().PAKETE || {})[paket] || {}).name || '').replace(/^EEZI\s+/, '');
  function zerlegen(t) {
    const s = String(t || '').trim(); if (!s) return null;
    const k = s.lastIndexOf(','); if (k > 0 && k < s.length - 2) return [s.slice(0, k + 1) + ' ', s.slice(k + 1).trim()];
    const w = s.split(' '); if (w.length < 3) return [s, ''];
    return [w.slice(0, -2).join(' ') + ' ', w.slice(-2).join(' ')];
  }
  function vorschau() {
    const leiste = h('div', { class: 'a-vorschau-leiste' }, h('i'), h('i'), h('i'));
    const adr = h('span'); adr.innerHTML = SVG.schloss; const adrB = h('b'), adrR = h('span', { style: 'margin:0;color:inherit' });
    adr.appendChild(adrB); adr.appendChild(adrR); leiste.appendChild(adr);
    const seite = h('div', { class: 'a-vorschau-seite' });
    const wurzel = h('div', { class: 'a-vorschau', role: 'img' }, leiste, seite);
    let letzt = '';
    function setzen(d) {
      d = d || {};
      const key = JSON.stringify(d); if (key === letzt) return; letzt = key;
      const m = P().merkmale(d.paket) || {}, sig = m.farbwelt === 'voll', eigen = m.gestaltung === 'eigen';
      const firma = d.name || 'Ihr Betrieb', ort = d.region || d.ort || 'Ihr Ort', farbe = eigen ? (d.farbe || '#897efc') : '#897efc';
      /* Adresse */
      if (m.domain) { const t = String(d.adresse || 'ihre-domain.de'); const i = t.indexOf('.'); adrB.textContent = i > 0 ? t.slice(0, i) : t; adrR.textContent = i > 0 ? t.slice(i) : ''; }
      else { adrB.textContent = d.adresse ? String(d.adresse).replace(/\.eeziframes\.com$/, '') : 'ihr-name'; adrR.textContent = '.eeziframes.com'; }
      wurzel.setAttribute('aria-label', 'Vorschau Ihrer Seite unter ' + adrB.textContent + adrR.textContent);
      wurzel.style.setProperty('--a-firma', farbe); wurzel.style.setProperty('--a-auf-firma', aufFarbe(farbe));
      wurzel.style.setProperty('--a-knopf', eigen ? farbe : '#ffffff'); wurzel.style.setProperty('--a-auf-knopf', eigen ? aufFarbe(farbe) : '#07090a');
      leeren(seite); seite.className = 'a-vorschau-seite' + (eigen ? ' hell' : '') + (sig ? ' voll' : '');
      const zeichen = h('span', { class: 'a-vs-zeichen' });
      if (eigen && d.logo) zeichen.appendChild(h('img', { src: d.logo, alt: '' })); else zeichen.textContent = initialen(firma).slice(0, 1);
      seite.appendChild(h('div', { class: 'a-vs-kopf' }, zeichen, h('span', { class: 'a-vs-name' }, sig ? h('small', { text: 'Fensterbau · ' + ort }) : null, firma)));
      let titel, kicker, text;
      if (eigen) { kicker = firma + ' – ' + ort; const z = zerlegen(d.ueberschrift) || ['Neue Fenster, ', 'gut geplant.']; titel = [z[0], h('em', { text: z[1] })]; text = d.einleitung || 'Beratung, Aufmaß und Einbau in ' + ort + '. Mit dem Konfigurator beginnen Sie zu Hause.'; }
      else { kicker = 'Fenster planen und anfragen'; titel = ['Ihre neuen Fenster, ', h('em', { text: 'Ihr Angebot.' })]; text = 'Für Ihr Angebot brauchen wir die Maße Ihrer Fenster. Messen Sie hier selbst, danach melden wir uns.'; }
      seite.appendChild(h('p', { class: 'a-vs-kicker', text: kicker }));
      seite.appendChild(h('p', { class: 'a-vs-titel' }, titel));
      seite.appendChild(h('p', { class: 'a-vs-text', text: text }));
      const person = h('span', { class: 'a-vs-person' }, h('span', null, eigen && d.portrait ? h('img', { src: d.portrait, alt: '' }) : initialen(d.ap || firma)), h('span', null, h('b', { text: d.ap || 'Ansprechperson' }), d.rolle || (firma + ', ' + (d.ort || 'Ort'))));
      seite.appendChild(h('div', { class: 'a-vs-zeile' }, h('span', { class: 'a-vs-pille' }, 'Fenster planen', h('i')), person));
      /* Schraffur heißt „fehlt noch“; eine Seite, die live ist, zeigt statt einer schraffierten Kachel keine (Gremium 27.10.2026) */
      if (eigen && (d.buehne || !d.live)) {
        const b = h('div', { class: 'a-vs-bild' + (d.buehne ? '' : ' leer') }); if (d.buehne) b.appendChild(h('img', { src: d.buehne, alt: '' }));
        seite.appendChild(h('div', { class: 'a-vs-raster' }, b, h('div', { class: 'a-vs-kachel' }, h('small', { text: 'Im Konfigurator' }), h('b', { text: 'Alles, was Sie planen.' }))));
      }
    }
    return { el: wurzel, setzen: setzen };
  }

  /* ---------- Leiste der vier Stationen (Bestellt, In Arbeit, Vorschau, Live) ---------- */
  function leiste(a) {
    const L = A().LEISTE, i = L.findIndex((x) => x.stand === a.stand), pos = i < 0 ? (a.stand === 'pausiert' ? 3 : -1) : i;
    const ol = h('ol', { class: 'a-leiste' });
    L.forEach((x, j) => {
      const e = (a.verlauf || []).filter((v) => v.stand === x.stand).pop();
      ol.appendChild(h('li', { class: j < pos ? 'fertig' : '', 'aria-current': j === pos ? 'step' : null }, x.titel, e ? h('small', { text: datum(e.zeit) }) : null));
    });
    return ol;
  }

  window.AuftragUI = {
    h: h, anhaengen: anhaengen, leeren: leeren, stimmen: stimmen, icon: icon, marke: marke, pille: pille, ring: ring, rund: rund, warten: warten, wartet: wartet,
    kopf: kopf, stationen: stationen, frage: frage, aenderbar: aenderbar, karte: karte, kachel: kachel, feld: feld, fehlerSetzen: fehlerSetzen, fehlerZeigen: fehlerZeigen,
    zuFeld: zuFeld, haken: haken, segment: segment, chip: chip, toast: toast, blatt: blatt, api: api, euro: euro, datum: datum, zeit: zeit, initialen: initialen,
    aufFarbe: aufFarbe, vorbereiten: vorbereiten, vorschau: vorschau, kurzname: kurzname, leiste: leiste
  };
})();

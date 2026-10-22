/* eeziframes · Einladungsseite eines Fensterbauers (Strang S4)
   Die erste Seite, die ein Kunde sieht, wenn er den Aufmaß-Link seines Fensterbauers öffnet. Hier steht der Betrieb vorn (Logo oder
   Initiale, Name, Begrüßung, Ansprechpartner), eeziframes klein als Übermittler darunter. Eine Quelle für alle Stellen:
   - App (app.js linkHomeInhalt): die echte Seite im Kundenlink
   - Betriebsbereich (portal.js): Live-Vorschau unter „Mein Betrieb · Einladungsseite“, Registrierung, Tour
   - Server (functions/api/konten.js, einladung.js): Prüfen der Einstellungen und das öffentliche Profil zum Link
   Läuft im Browser (window.Einladung) und auf dem Server (globalThis.Einladung, wie modell.js). Keine Oberfläche außer HTML-Text,
   kein Speicher; die Bildverkleinerung gibt es nur im Browser.

   Daten im Konto des Betriebs (acc bzw. auf dem Server a = row.daten):
     logo        verkleinertes Logo als Data-URL (PNG, JPEG oder WebP, höchstens MAX.logo Zeichen) oder ''
     einladung   { begruessung, begruessungDu, ansprechpartner, foto, telefon, telefonZeigen, mail, mailZeigen, web, ort, anrede, logoGrund,
                   tiefe, standard }  tiefe: wie genau die Kunden planen ('' der Kunde wählt, sonst kurz, normal, genau; Vorgabe für S.proj.tiefe
                   in der App), standard: der Standard des Betriebs in einem Satz (was er ohne Wahl des Kunden verbaut)
     col         Farbe des Zeichens (eine aus FARBEN; Firma.col im Browser)
   Öffentliches Profil (Auftritt), wie es zum Kunden geht (GET /api/link/:code, im Pilotbetrieb gekürzt im Link):
     { logo, grund, col, gruss: { sie, du }, ap, foto, tel, mail, web, ort, tiefe, std } */
(function (root) {
  'use strict';
  /* Grenzen: das Logo als Data-URL ist höchstens etwa 90 KB groß, das Foto des Ansprechpartners etwa 36 KB */
  const MAX = { logo: 120000, foto: 48000, gruss: 400, ap: 80, tel: 40, mail: 120, web: 120, ort: 60, hinweis: 300, name: 80, kunde: 60, standard: 240 };
  /* Planungstiefe (wie AW.TIEFE_NAME in modell.js): kurz das Wichtigste, normal die üblichen Wünsche, genau alles im Detail */
  const TIEFEN = ['kurz', 'normal', 'genau'];
  const tiefeOk = (t) => (TIEFEN.indexOf(t) >= 0 ? t : '');
  const FARBEN = ['#0071e3', '#1f7a3d', '#a85a00', '#6e3fc2', '#0b7285', '#b3261e'];
  const MINUTEN = 5; // etwa so lange dauert ein Fenster, so steht es auch in der Nachricht des Betriebs
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kurz = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f<>]/g, '').trim().slice(0, n);
  const zeile = (v, n) => kurz(v, n).replace(/\s+/g, ' ');

  /* ---------- Prüfen (Browser und Server gleich) ---------- */
  /* Bild als Data-URL: nur PNG, JPEG, WebP, Base64, passende Signatur, Größe begrenzt. SVG kommt nie an: der Browser rechnet es vorher
     in ein Pixelbild um, damit kein Skript aus einer Datei des Betriebs je bei seinen Kunden läuft. */
  function bild(url, max) {
    const s = String(url || '');
    if (!s) return '';
    const m = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(s);
    if (!m || s.length > max) return null;
    let kopf = '';
    try { kopf = (typeof atob === 'function' ? atob(m[2].slice(0, 24)) : Buffer.from(m[2].slice(0, 24), 'base64').toString('binary')); } catch (e) { return null; }
    const ok = m[1] === 'png' ? kopf.slice(0, 8) === '\x89PNG\r\n\x1a\n' : m[1] === 'jpeg' ? kopf.slice(0, 3) === '\xff\xd8\xff' : kopf.slice(0, 4) === 'RIFF' && kopf.slice(8, 12) === 'WEBP';
    return ok ? s : null;
  }
  const farbe = (c) => (FARBEN.includes(c) ? c : FARBEN[0]);
  function webAdresse(v) {
    let s = zeile(v, MAX.web);
    if (!s) return '';
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    try { const u = new URL(s); return /^https?:$/.test(u.protocol) && /\./.test(u.hostname) ? u.href.replace(/\/$/, '') : ''; } catch (e) { return ''; }
  }
  const mailOk = (v) => { const s = zeile(v, MAX.mail).toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) ? s : ''; };
  const telOk = (v) => { const s = zeile(v, MAX.tel); return s.replace(/\D/g, '').length >= 6 ? s : ''; };
  /* Einstellungen säubern; fehler sammelt, was abgewiesen wurde (der Server meldet es, der Browser verhindert es vorher) */
  function einstellungen(e, fehler) {
    const o = e && typeof e === 'object' ? e : {}, f = fehler || [];
    const foto = o.foto ? bild(o.foto, MAX.foto) : '';
    if (foto === null) f.push('Das Foto ließ sich nicht übernehmen. Bitte ein JPG oder PNG hochladen.');
    const telefon = zeile(o.telefon, MAX.tel), mail = zeile(o.mail, MAX.mail);
    if (telefon && !telOk(telefon)) f.push('Bitte eine gültige Telefonnummer eingeben oder das Feld leer lassen.');
    if (mail && !mailOk(mail)) f.push('Bitte eine gültige E-Mail-Adresse eingeben oder das Feld leer lassen.');
    return {
      begruessung: kurz(o.begruessung, MAX.gruss), begruessungDu: kurz(o.begruessungDu, MAX.gruss),
      ansprechpartner: zeile(o.ansprechpartner, MAX.ap), foto: foto || '',
      telefon: telefon, telefonZeigen: o.telefonZeigen !== false, mail: mail, mailZeigen: !!o.mailZeigen,
      web: zeile(o.web, MAX.web), ort: zeile(o.ort, MAX.ort),
      anrede: o.anrede === 'du' ? 'du' : 'sie', logoGrund: o.logoGrund === 'dunkel' ? 'dunkel' : 'hell',
      tiefe: tiefeOk(o.tiefe), standard: zeile(o.standard, MAX.standard)
    };
  }
  /* Öffentliches Profil aus dem Konto: nur, was der Kunde sehen soll. Telefon und E-Mail nur mit Schalter; ohne eigene Angaben gilt der
     Ansprechpartner des Kontos (steht ohnehin unter jeder Nachricht), die Telefonnummer des Kontos erst, wenn der Betrieb seine
     Einladungsseite gespeichert hat (sie war bei der Registrierung für Rückfragen von eeziframes gedacht). */
  function auftritt(a, col) {
    const acc = a || {}, e = acc.einladung && typeof acc.einladung === 'object' ? acc.einladung : null, x = einstellungen(e || {});
    return {
      logo: bild(acc.logo, MAX.logo) || '', grund: x.logoGrund, col: farbe(col || acc.col),
      gruss: { sie: x.begruessung, du: x.begruessungDu },
      ap: x.ansprechpartner || zeile(acc.ap, MAX.ap), foto: x.foto,
      tel: e && x.telefonZeigen ? telOk(x.telefon || acc.tel) : '', mail: e && x.mailZeigen ? mailOk(x.mail || acc.mail) : '',
      web: webAdresse(x.web), ort: x.ort, tiefe: x.tiefe, std: x.standard
    };
  }
  /* Profil aus fremder Quelle (Server-Antwort, Link) wieder säubern: Darstellung nur aus geprüften Werten */
  function profil(p) {
    const o = p && typeof p === 'object' ? p : {}, g = o.gruss && typeof o.gruss === 'object' ? o.gruss : {};
    return { logo: bild(o.logo, MAX.logo) || '', grund: o.grund === 'dunkel' ? 'dunkel' : 'hell', col: FARBEN.includes(o.col) ? o.col : '', gruss: { sie: kurz(g.sie, MAX.gruss), du: kurz(g.du, MAX.gruss) }, ap: zeile(o.ap, MAX.ap), foto: bild(o.foto, MAX.foto) || '', tel: telOk(o.tel), mail: mailOk(o.mail), web: webAdresse(o.web), ort: zeile(o.ort, MAX.ort), tiefe: tiefeOk(o.tiefe), std: zeile(o.std, MAX.standard) };
  }

  /* ---------- Link im Pilotbetrieb: das Profil reist gekürzt im Link mit (ohne Logo und Foto) ----------
     Format des Kundenlinks: #k-<code>-<slug>.<b64 Betrieb>.<b64 Kunde>[.<b64 Profil>][~<Runde>]. Das Profil ist ein kurzes JSON:
     s (1 = Sie), a, t, m, o, w, c (Ansprechpartner, Telefon, E-Mail, Ort, Website, Farbe), g (eigene Begrüßung), h (Hinweis der
     Nachbesserung), d (Planungstiefe 1 bis 3), n (Standard des Betriebs). Ältere Links ohne Profil gelten weiter: Du, Name aus dem Link. */
  const b64u = (t) => { try { const bytes = new TextEncoder().encode(String(t || '')); let bin = ''; bytes.forEach((b) => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); } catch (e) { return ''; } };
  const unb64u = (v) => { if (!v) return ''; try { const b = v.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(b + '==='.slice((b.length + 3) % 4)); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); } catch (e) { return ''; } };
  function linkTeil(p, o) {
    const q = o || {}, x = {};
    if (!q.du) x.s = 1;
    if (q.voll && p) {
      if (p.ap) x.a = p.ap; if (p.tel) x.t = p.tel; if (p.mail) x.m = p.mail; if (p.ort) x.o = p.ort; if (p.web) x.w = p.web;
      const c = FARBEN.indexOf(p.col); if (c >= 0) x.c = c;
      const g = q.du ? p.gruss && p.gruss.du : p.gruss && p.gruss.sie; if (g) x.g = g;
      if (tiefeOk(p.tiefe)) x.d = TIEFEN.indexOf(p.tiefe) + 1; if (p.std) x.n = p.std;
    }
    if (q.hinweis) x.h = kurz(q.hinweis, MAX.hinweis);
    return Object.keys(x).length ? b64u(JSON.stringify(x)) : '';
  }
  function linkLesen(v) {
    let x = null; try { x = JSON.parse(unb64u(v) || 'null'); } catch (e) { x = null; }
    if (!x || typeof x !== 'object') return null;
    const du = !x.s, g = kurz(x.g, MAX.gruss);
    return { du: du, hinweis: kurz(x.h, MAX.hinweis), profil: profil({ ap: x.a, tel: x.t, mail: x.m, ort: x.o, web: x.w, col: x.c !== undefined ? FARBEN[Number(x.c)] : '', gruss: du ? { du: g } : { sie: g }, tiefe: TIEFEN[Number(x.d) - 1] || '', std: x.n }) };
  }

  /* ---------- Texte ---------- */
  /* Sie oder Du: der Betrieb wählt je Projekt (Nachricht und Einladungsseite); die Messschritte der App duzen */
  const T = (du, sie, dutext) => (du ? dutext : sie);
  const VORLAGE = {
    sie: 'Guten Tag {Kunde}, für Ihr Angebot brauchen wir die Maße Ihrer Fenster. Hier messen Sie selbst, Schritt für Schritt erklärt. Danach melden wir uns mit dem Angebot bei Ihnen.',
    du: 'Hallo {Kunde}, für dein Angebot brauchen wir die Maße deiner Fenster. Hier misst du selbst, Schritt für Schritt erklärt. Danach melden wir uns mit dem Angebot bei dir.'
  };
  function gruss(p, kunde, du) {
    const eigen = p && p.gruss ? (du ? p.gruss.du : p.gruss.sie) : '', k = zeile(kunde, MAX.kunde);
    const t = String(eigen || VORLAGE[du ? 'du' : 'sie']);
    return (k ? t.replace(/\{Kunde\}/g, k) : t.replace(/\s*\{Kunde\}/g, '')).replace(/\s+([,.!?])/g, '$1');
  }
  const ZUSATZ = /^(Fensterbau|Fenster|Glaserei|Schreinerei|Tischlerei|Bauelemente|Fensterbaubetrieb)\s+/i;
  const initiale = (name) => ((String(name || '').replace(ZUSATZ, '').trim() || String(name || '') || 'F').charAt(0).toUpperCase());
  /* dunkle Farbe: helle Initiale, sonst dunkle (Kontrast mindestens 4,5:1) */
  function aufFarbe(hex) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '#161616';
    const n = parseInt(m[1], 16), l = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2] > 0.25 ? '#161616' : '#ffffff';
  }
  const telHref = (t) => { const d = String(t || '').replace(/[^\d+]/g, ''); return d.startsWith('+') ? d : d.startsWith('00') ? '+' + d.slice(2) : d.startsWith('0') ? '+49' + d.slice(1) : d; };
  const webName = (u) => String(u || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');

  /* ---------- Bausteine ---------- */
  const SVG = (d, w) => '<svg viewBox="0 0 24 24" width="' + (w || 20) + '" height="' + (w || 20) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const ICO = {
    tel: SVG('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    mail: SVG('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    web: SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    uhr: SVG('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', 18),
    schild: SVG('<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>', 22)
  };
  const KNOPF = (vor, tag, attr, cls, inhalt) => (vor ? '<span class="' + cls + '" aria-hidden="true">' + inhalt + '</span>' : '<' + tag + ' class="' + cls + '" ' + attr + '>' + inhalt + '</' + tag + '>');
  /* Zeichen des Betriebs: Logo (auf hellem oder dunklem Feld) oder die Initiale in seiner Farbe */
  function zeichen(name, p, groesse) {
    const q = p || {}, cls = 'ein-zeichen' + (groesse ? ' ' + groesse : '');
    if (q.logo) return '<span class="' + cls + ' logo ' + (q.grund === 'dunkel' ? 'dunkel' : 'hell') + '"><img src="' + esc(q.logo) + '" alt="Logo ' + esc(name) + '"></span>';
    const c = FARBEN.includes(q.col) ? q.col : ''; // ohne bekannte Farbe (ältere Links): Cream wie der Avatar in den Beiträgen
    return '<span class="' + cls + ' ini"' + (c ? ' style="--ein-col: ' + c + '; --ein-auf: ' + aufFarbe(c) + '"' : '') + ' aria-hidden="true">' + esc(initiale(name)) + '</span>';
  }
  const apBild = (p) => (p.foto ? '<img class="ein-ap-foto" src="' + esc(p.foto) + '" alt="">' : '<span class="ein-ap-foto ini" aria-hidden="true">' + esc(initiale(p.ap)) + '</span>');
  /* Absender: oben auf jeder Startseite im Link. klein: in der Liste „Weiter, wo …“ */
  function kopf(o) {
    const q = o || {}, p = q.p || {}, name = q.name || 'Ihr Fensterbauer';
    if (q.unten) q.unten = String(q.unten).replace(/^für Herr(?= )/, 'für Herrn'); // „für Herrn Kaya“, die Anrede selbst bleibt „Herr“
    return '<div class="ein-abs' + (q.klein ? ' klein' : '') + (p.logo ? ' mit-logo' : '') + '">' + zeichen(name, p, q.klein ? 'klein' : 'gross') + '<span class="ein-abs-tx"><small>' + esc(q.oben || 'Persönliche Anfrage von') + '</small><b>' + esc(name) + '</b>' + (q.unten ? '<span class="ein-fuer">' + esc(q.unten) + '</span>' : '') + '</span></div>';
  }
  /* Kontakt: Ansprechpartner mit Anruf- und E-Mail-Knopf (44 px); ohne Angaben der Weg über die Nachricht */
  function kontakt(o) {
    const q = o || {}, p = q.p || {}, du = !!q.du, name = q.name || T(du, 'Ihr Fensterbauer', 'dein Fensterbauer'), vor = !!q.vorschau;
    const knoepfe = (p.tel ? KNOPF(vor, 'a', 'href="tel:' + esc(telHref(p.tel)) + '"', 'btn ghost small ein-k', ICO.tel + '<span>Anrufen</span>') : '') +
      (p.mail ? KNOPF(vor, 'a', 'href="mailto:' + esc(p.mail) + '"', 'btn ghost small ein-k', ICO.mail + '<span>E-Mail</span>') : '') +
      (p.web ? KNOPF(vor, 'a', 'href="' + esc(p.web) + '" target="_blank" rel="noopener"', 'btn ghost small ein-k', ICO.web + '<span>Website</span>') : '');
    const nr = p.tel ? '<p class="ein-nr">' + esc(p.tel) + (p.mail ? ' · <span class="ein-mail">' + esc(p.mail) + '</span>' : '') + '</p>' : p.mail ? '<p class="ein-nr"><span class="ein-mail">' + esc(p.mail) + '</span></p>' : '';
    return '<section class="ein-karte ein-kontakt"><p class="eyebrow">' + 'Fragen?' + '</p>' +
      (p.ap ? '<div class="ein-ap">' + apBild(p) + '<span><b>' + esc(p.ap) + '</b><small>' + esc(name) + (p.ort ? ' · ' + esc(p.ort) : '') + '</small></span></div>' : '') +
      (knoepfe ? nr + '<div class="ein-knoepfe">' + knoepfe + '</div>' : '<p>' + T(du, 'Antworten Sie einfach auf die Nachricht, mit der dieser Link kam. ', 'Antworte einfach auf die Nachricht, mit der dieser Link kam. ') + esc(name) + T(du, ' meldet sich bei Ihnen.', ' meldet sich bei dir.') + '</p>') +
      (q.bis ? '<p class="ein-gilt">' + ICO.uhr + '<span>' + T(du, 'Ihr Link gilt bis ', 'Dein Link gilt bis ') + esc(q.bis) + '.</span></p>' : '') + '</section>';
  }
  /* Fußzeile: eeziframes klein als Übermittler */
  function fuss(o) {
    const q = o || {}, du = !!q.du, name = q.name || T(du, 'Ihren Fensterbauer', 'deinen Fensterbauer'), C = root.KONFIG || {};
    const logo = root.Logo && root.Logo.svg ? root.Logo.svg(18) : '', wm = root.Marke && root.Marke.wort ? root.Marke.wort() : '<span class="wm" translate="no"><b>eezi</b>frames</span>';
    return '<div class="ein-fuss"><p class="ein-durch">' + logo + '<span>Übermittelt mit ' + wm + '</span></p><p class="ein-fuss-t">' + T(du, 'Ihr Aufmaß geht nur an ', 'Dein Aufmaß geht nur an ') + esc(name) + '. eeziframes ' + T(du, 'übermittelt es in dessen Auftrag und zeigt Ihnen keine anderen Anbieter und keine Werbung.', 'übermittelt es in dessen Auftrag und zeigt dir keine anderen Anbieter und keine Werbung.') + (q.vorschau ? '' : ' <a class="ulink" href="' + esc(C.datenschutz || '/datenschutz/') + '" target="_blank" rel="noopener">Datenschutz</a>') + '</p></div>';
  }
  const haken = (t) => '<li>' + t + '</li>';
  /* Wie genau planen (nur, wenn der Betrieb eine Tiefe oder seinen Standard angegeben hat): was gefragt wird, was der Betrieb nach
     seinem Standard macht, und dass sich die Tiefe bei jeder Frage oben ändern lässt */
  const TIEFE_SATZ = {
    kurz: [['fragt Sie nur nach dem Wichtigsten.', 'Alles Weitere macht'], ['fragt dich nur nach dem Wichtigsten.', 'Alles Weitere macht']],
    normal: [['fragt Sie nach den üblichen Wünschen.', 'Feine Details wie Dichtung oder Bänder macht'], ['fragt dich nach den üblichen Wünschen.', 'Feine Details wie Dichtung oder Bänder macht']],
    genau: [['fragt Sie alles im Detail.', 'Wo Sie nichts wählen, macht es'], ['fragt dich alles im Detail.', 'Wo du nichts wählst, macht es']]
  };
  function planung(o) {
    const q = o || {}, p = q.p || {}, du = !!q.du, nm = esc(q.name || T(du, 'Ihr Fensterbauer', 'dein Fensterbauer')), t = TIEFE_SATZ[tiefeOk(p.tiefe)];
    if (!t && !p.std) return '';
    const x = t ? t[du ? 1 : 0] : ['', T(du, 'Was Sie nicht auswählen, macht', 'Was du nicht auswählst, macht')];
    return '<section class="ein-karte ein-planung"><p class="eyebrow">' + T(du, 'Wie genau Sie planen', 'Wie genau du planst') + '</p>' +
      '<p>' + (x[0] ? nm + ' ' + x[0] + ' ' : '') + x[1] + ' ' + nm + ' nach ' + (p.std ? 'diesem Standard:' : 'seinem Standard.') + '</p>' +
      (p.std ? '<p class="ein-std">„' + esc(p.std) + '“</p>' : '') +
      '<p class="ein-klein">' + T(du, 'Wie genau gefragt wird, ändern Sie jederzeit oben bei jeder Frage.', 'Wie genau gefragt wird, änderst du jederzeit oben bei jeder Frage.') + '</p></section>';
  }

  /* ---------- Die ganze Seite beim ersten Besuch ----------
     o = { name, kunde, du, p (Profil), bis (gültig bis), server (Daten gehen über den Server), vorschau (Betriebsbereich: nichts ist
     bedienbar) }. Aufbau nach dem Startbild der Gestaltung: Absender, Kicker, Überschrift mit einem grünen Wort, persönliche
     Begrüßung mit Unterschrift, Cream-Pille mit Pfeil und Ghost-Knopf, Dauer und Pause; darunter Ablauf, was man braucht, was danach
     kommt, wer die Daten sieht, Kontakt; ganz unten eeziframes als Übermittler. */
  function html(o) {
    const q = o || {}, du = !!q.du, p = q.p || {}, name = q.name || T(du, 'Ihr Fensterbauer', 'Dein Fensterbauer'), vor = !!q.vorschau, nm = esc(name);
    const g = gruss(p, q.kunde, du);
    const cta = KNOPF(vor, 'button', 'type="button" data-act="new"', 'btn primary', 'Erstes Fenster ausmessen<span class="pf" aria-hidden="true"></span>') +
      KNOPF(vor, 'button', 'type="button" data-ein-so=""', 'btn ghost', 'So funktioniert es');
    const schritt = (n, t, x) => '<li><span class="n">' + n + '</span><div><b>' + t + '</b><p>' + x + '</p></div></li>';
    const gloss = (k, t) => (vor ? t : '<button type="button" class="ulink" data-act="gloss" data-k="' + k + '">' + t + '</button>');
    return '<div class="ein' + (vor ? ' vorschau' : '') + '">' +
      '<section class="' + (vor ? '' : 'hero lk ') + 'ein-start"><div class="ein-start-in">' +
        kopf({ name: name, p: p, unten: q.kunde ? 'für ' + q.kunde : '' }) +
        '<p class="eyebrow kicker">' + T(du, 'Ihr Fenster-Aufmaß', 'Dein Fenster-Aufmaß') + '</p>' +
        '<h1>' + T(du, 'Ihre Fenster, Ihr <span class="ak">Angebot</span>.', 'Deine Fenster, dein <span class="ak">Angebot</span>.') + '</h1>' +
        '<div class="ein-brief"><p class="ein-gruss">' + esc(g) + '</p>' + (p.ap ? '<div class="ein-sign">' + apBild(p) + '<span><b>' + esc(p.ap) + '</b><small>' + nm + '</small></span></div>' : '') + '</div>' +
        '<div class="ein-cta">' + cta + '</div>' +
        '<p class="ein-zeit">' + ICO.uhr + '<span>Etwa ' + MINUTEN + ' Minuten je Fenster. ' + T(du, 'Sie müssen nicht alles auf einmal machen: Über diesen Link kommen Sie jederzeit zurück.', 'Du musst nicht alles auf einmal machen: Über diesen Link kommst du jederzeit zurück.') + '</span></p>' +
      '</div></section>' +
      '<div class="ein-karten">' +
        '<section class="ein-karte ein-so" id="ein-so"><p class="eyebrow kicker">So geht’s</p><h2>In vier Schritten zum Angebot.</h2><ol class="ein-schritte">' +
          schritt(1, 'Fotos.', 'Ein Foto von innen, eins von außen. Empfohlen, aber kein Muss.') +
          schritt(2, 'Messen.', 'Mit Zollstock oder Maßband: erst vier Hauptmaße, dann die Ränder. Jeder Messpunkt wird gezeigt.') +
          schritt(3, 'Wünsche.', T(du, 'Material, Farbe, Glas, Sonnenschutz. Was Sie noch nicht wissen, lassen Sie offen.', 'Material, Farbe, Glas, Sonnenschutz. Was du noch nicht weißt, lässt du offen.')) +
          schritt(4, 'Senden.', T(du, 'Kurz prüfen und an ' + nm + ' schicken. Erst dann hat ' + nm + ' Ihre Maße und Wünsche.', 'Kurz prüfen und an ' + nm + ' schicken. Erst dann hat ' + nm + ' deine Maße und Wünsche.')) +
          '</ol>' + (du ? '' : '<p class="ein-klein">In den Messschritten spricht die App Sie kurz mit „du“ an, damit jede Anleitung knapp bleibt.</p>') + '</section>' +
        '<section class="ein-karte ein-brauchen"><p class="eyebrow">' + T(du, 'Das brauchen Sie', 'Das brauchst du') + '</p><div class="chips"><span class="chip haken">Zollstock oder Maßband</span><span class="chip haken">' + T(du, 'Ihr Handy', 'Dein Handy') + '</span><span class="chip haken">Freien Zugang zum Fenster</span><span class="chip haken">Für große Türen eine zweite Person</span></div>' +
          '<p>' + T(du, 'Unsicher bei einer Frage? Tippen Sie „Weiß ich noch nicht“. ', 'Unsicher bei einer Frage? Tipp „Weiß ich noch nicht“. ') + nm + T(du, ' berät Sie dazu.', ' berät dich dazu.') + '</p></section>' +
        planung({ name: name, p: p, du: du }) +
        '<section class="ein-karte ein-danach"><p class="eyebrow">Danach</p><ol class="ein-schritte klein">' +
          schritt(1, 'Angebot.', nm + T(du, ' meldet sich mit einem Angebot bei Ihnen.', ' meldet sich mit einem Angebot bei dir.')) +
          schritt(2, 'Feinaufmaß.', 'Vor der Fertigung misst ' + nm + ' einmal vor Ort nach, das ' + gloss('feinaufmass', 'Feinaufmaß') + '.') +
          schritt(3, 'Einbau.', 'Termin nach Absprache.') + '</ol></section>' +
        '<section class="ein-karte ein-daten"><p class="eyebrow">' + T(du, 'Ihre Daten', 'Deine Daten') + '</p><ul class="ein-haken">' +
          haken(T(du, 'Ihre Angaben und Fotos gehen nur an ', 'Deine Angaben und Fotos gehen nur an ') + nm + '.') +
          haken(q.server ? T(du, 'Vorher sieht ' + nm + ' nur, dass Sie den Link geöffnet haben und wie weit Sie sind.', 'Vorher sieht ' + nm + ' nur, dass du den Link geöffnet hast und wie weit du bist.') : T(du, 'Bis Sie senden, bleibt alles in diesem Browser.', 'Bis du sendest, bleibt alles in diesem Browser.')) +
          haken(T(du, 'Für Sie kostenlos, ohne Konto und ohne Werbung.', 'Für dich kostenlos, ohne Konto und ohne Werbung.')) +
          haken('eeziframes übermittelt ' + T(du, 'Ihr', 'dein') + ' Aufmaß im Auftrag von ' + nm + '.') + '</ul></section>' +
        kontakt({ name: name, p: p, du: du, bis: q.bis, vorschau: vor }) +
      '</div>' + fuss({ name: name, du: du, vorschau: vor }) + '</div>';
  }

  /* ---------- Nur im Browser: Bilder verkleinern, „So funktioniert es“ ---------- */
  function ladeBild(src) { return new Promise((ja, nein) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ja(i); i.onerror = () => nein(new Error('bild')); i.src = src; }); }
  /* SVG ohne feste Größe: Breite und Höhe aus der viewBox setzen, damit der Browser es in voller Schärfe zeichnet */
  async function svgQuelle(file) {
    const text = await file.text(), doc = new DOMParser().parseFromString(text, 'image/svg+xml'), s = doc.documentElement;
    if (!s || s.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) throw new Error('svg');
    const vb = String(s.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number), w0 = parseFloat(s.getAttribute('width')), h0 = parseFloat(s.getAttribute('height'));
    let w = vb.length === 4 && vb[2] > 0 ? vb[2] : w0 || 300, h = vb.length === 4 && vb[3] > 0 ? vb[3] : h0 || 150;
    const f = 960 / Math.max(w, h); w = Math.round(w * f); h = Math.round(h * f);
    s.setAttribute('width', String(w)); s.setAttribute('height', String(h));
    if (!s.getAttribute('viewBox') && w0 && h0) s.setAttribute('viewBox', '0 0 ' + w0 + ' ' + h0);
    return URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' }));
  }
  /* Logo: durchsichtige Ränder abschneiden, auf höchstens 480 × 160 px verkleinern, als PNG (sonst WebP) unter MAX.logo; dazu ein
     Vorschlag für den Grund: dunkles Logo auf hellem Feld, helles auf dunklem; ein Bild mit hellem Rand (JPG auf Weiß) auf hellem Feld.
     Foto: quadratisch aus der Mitte, 192 px, JPEG. */
  async function verkleinern(file, art) {
    if (!file) throw new Error('Keine Datei gewählt.');
    const typ = String(file.type || ''), svg = typ === 'image/svg+xml' || /\.svg$/i.test(file.name || '');
    if (!svg && !/^image\/(png|jpeg|webp|gif)$/.test(typ)) throw new Error(art === 'foto' ? 'Bitte ein Foto als JPG oder PNG wählen.' : 'Bitte ein Logo als PNG, JPG oder SVG wählen.');
    if (file.size > 8 * 1024 * 1024) throw new Error('Die Datei ist größer als 8 MB. Bitte eine kleinere wählen.');
    const quelle = svg ? await svgQuelle(file).catch(() => { throw new Error('Dieses SVG lässt sich nicht lesen. Bitte als PNG hochladen.'); }) : URL.createObjectURL(file);
    let img;
    try { img = await ladeBild(quelle); } catch (e) { throw new Error('Diese Datei lässt sich nicht als Bild öffnen.'); } finally { setTimeout(() => URL.revokeObjectURL(quelle), 0); }
    const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height;
    if (!W || !H) throw new Error('Dieses Bild hat keine Größe. Bitte als PNG hochladen.');
    const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
    if (art === 'foto') {
      const s = Math.min(W, H), z = Math.min(192, s); cv.width = z; cv.height = z;
      cx.fillStyle = '#262626'; cx.fillRect(0, 0, z, z);
      cx.drawImage(img, (W - s) / 2, (H - s) / 2, s, s, 0, 0, z, z);
      for (const qual of [0.86, 0.75, 0.6]) { const u = cv.toDataURL('image/jpeg', qual); if (u.length <= MAX.foto) return { url: u }; }
      throw new Error('Das Foto ist zu groß. Bitte ein anderes wählen.');
    }
    /* 1. auf eine Arbeitsgröße zeichnen und den sichtbaren Bereich suchen (Alpha) */
    const a0 = Math.min(1, 1200 / Math.max(W, H)), aw = Math.max(1, Math.round(W * a0)), ah = Math.max(1, Math.round(H * a0));
    cv.width = aw; cv.height = ah; cx.drawImage(img, 0, 0, aw, ah);
    let px; try { px = cx.getImageData(0, 0, aw, ah).data; } catch (e) { throw new Error('Dieses Bild lässt sich nicht verarbeiten. Bitte als PNG hochladen.'); }
    let x0 = aw, y0 = ah, x1 = -1, y1 = -1, durch = 0, lum = 0, nLum = 0, rand = 0, nRand = 0;
    const L = (i) => (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
    for (let y = 0; y < ah; y++) for (let x = 0; x < aw; x++) {
      const i = (y * aw + x) * 4, al = px[i + 3];
      if (al < 250) durch++;
      if (al > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; lum += L(i) * al / 255; nLum += al / 255; }
      if ((x === 0 || y === 0 || x === aw - 1 || y === ah - 1) && al > 200) { rand += L(i); nRand++; }
    }
    if (x1 < 0) throw new Error('Das Logo ist ganz durchsichtig.');
    const transparent = durch > aw * ah * 0.01, hell = nLum ? lum / nLum : 1;
    const grund = transparent ? (hell < 0.5 ? 'hell' : 'dunkel') : (nRand && rand / nRand > 0.6 ? 'hell' : 'dunkel');
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1, sx = x0 / a0, sy = y0 / a0, sw = cw / a0, sh = ch / a0;
    /* 2. Ausschnitt in der Zielgröße, bei Bedarf kleiner, bis es passt */
    for (const f of [1, 0.8, 0.62]) {
      const s = Math.min(480 * f / sw, 160 * f / sh, svg ? Infinity : 1), w = Math.max(1, Math.round(sw * s)), h = Math.max(1, Math.round(sh * s));
      cv.width = w; cv.height = h; cx.clearRect(0, 0, w, h); cx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      for (const u of [cv.toDataURL('image/png'), cv.toDataURL('image/webp', 0.92), cv.toDataURL('image/webp', 0.8)]) if (u.length <= MAX.logo && bild(u, MAX.logo)) return { url: u, grund: grund, w: w, h: h };
    }
    throw new Error('Das Logo ist zu detailreich für die Einladung. Bitte eine einfachere Fassung hochladen.');
  }
  /* „So funktioniert es“: zum Ablauf scrollen, ohne die Adresse (#k-…) anzufassen */
  if (typeof document !== 'undefined') document.addEventListener('click', (e) => {
    const k = e.target && e.target.closest ? e.target.closest('[data-ein-so]') : null; if (!k) return;
    const ziel = document.getElementById('ein-so'); if (!ziel) return;
    e.preventDefault();
    let ruhig = false; try { ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (x) { ruhig = false; }
    ziel.scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'start' });
  });

  const E = { MAX: MAX, FARBEN: FARBEN, TIEFEN: TIEFEN, planung: planung, MINUTEN: MINUTEN, VORLAGE: VORLAGE, bild: bild, einstellungen: einstellungen, auftritt: auftritt, profil: profil, linkTeil: linkTeil, linkLesen: linkLesen, gruss: gruss, initiale: initiale, zeichen: zeichen, kopf: kopf, kontakt: kontakt, fuss: fuss, html: html, verkleinern: verkleinern, T: T };
  root.Einladung = E;
  if (typeof module === 'object' && module.exports) module.exports = E;
})(typeof globalThis !== 'undefined' ? globalThis : this);

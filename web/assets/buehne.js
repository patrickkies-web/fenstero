'use strict';
/* ---------- 3-D-Bühne in WebGL ----------
   Das Modell wird weiter in app.js beschrieben (w3dHTML, w3dLayout, w3dPaint): jede Fläche ist ein Element mit Größe, Lage,
   Drehung, Umriss und Hintergrund. Gezeichnet wird es hier mit WebGL 2: mit Tiefenpuffer statt Sortierung der Ebenen (keine
   Laibung, die durch die Wand scheint, keine Nahtlinien in der Verlängerung von Kanten), mit Kantenglättung, Licht von zwei
   Seiten, weicher Verschattung in den Ecken und Spiegelung auf Glas und Metall. Die Elemente bleiben als Beschreibung im DOM
   (unsichtbar), Maßlinien, Hinweis, Lupe und Regler bleiben HTML über der Leinwand.
   Daten aus app.js: el._f (Fläche: W, H, x, y, z, Drehung r, Ursprung o, Umriss c, n = ohne Übergang), el._s (Flügel),
   el._h (Griff), el._g (Griff außen), el._b (Sprosse), el._bg/_bgc/_bgi (Hintergrund wie geschrieben), stage._orn (Ornament);
   Kinder mit Fläche in Griff und Griff außen (Druckknopf, Schließzylinder), el._rund (Rundung), el._bieg (gewölbte Lamelle),
   el._artVers (Muster der Nachbarfläche fortsetzen). Farben stehen inline (_bg), nicht nur in einer Klasse.
   Kamera (Drehung und die Verschiebung beim Zoom) und Schwingen rechnet die Bühne selbst und schreibt sie in .w3d-cam/.w3d-sway,
   damit die Maßlinien mitlaufen. Übergänge der Flächen wie in app.css: 0,7 s, per Zoom-Knopf 0,38 s, Sonnenschutz fahren 1,8 s
   (Lamellen je 12 ms versetzt), Lamellen wenden 0,6 s; beim Ziehen, Zoomen mit zwei Fingern oder dem Rad und ohne Bewegung sofort.
   Vorführungen (Öffnen, Schieben, Falten) laufen weiter als CSS-Animation; gelesen wird deren aktueller Stand.
   Ohne WebGL 2 bleibt alles beim CSS-Modell. */
window.Buehne3D = (function () {
  /* Tiefenbereich: die nahe Ebene so weit vorn wie möglich, ohne etwas abzuschneiden (Böden liegen weit unter der Blickachse).
     Bei NAH 4 löst ein 16-Bit-Tiefenpuffer (manche Telefone) im Abstand der Kamera nur gut 6 px auf: Rahmenseiten schienen dann
     durch Laibung und Rahmen. Bei 200 sind es 0,13 px, mit 24 Bit 0,0005 px */
  const PERSP = 1300, OY = 0.46, NAH = 200, FERN = 60000, WEIT = 24000;
  const DBG = {}; // Prüfung: DBG.ohne = /Rollen/ lässt Flächen beim Zeichnen weg

  /* ---------- Mathe: 4×4 spaltenweise wie matrix3d ---------- */
  const I4 = () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  function mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    return o;
  }
  const T = (x, y, z) => { const m = I4(); m[12] = x; m[13] = y; m[14] = z || 0; return m; };
  const S = (k) => { const m = I4(); m[0] = m[5] = m[10] = k; return m; };
  const RAD = Math.PI / 180;
  const RX = (d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); };
  const RY = (d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); };
  const RZ = (d) => { const c = Math.cos(d * RAD), s = Math.sin(d * RAD); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); };
  const ROT = { rotateX: RX, rotateY: RY, rotateZ: RZ };
  const ap = (m, x, y, z) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14], m[3] * x + m[7] * y + m[11] * z + m[15]];
  /* berechnete CSS-Transformation (getComputedStyle): none, matrix(…) oder matrix3d(…) */
  function cssM(s) {
    if (!s || s === 'none') return null;
    const v = s.slice(s.indexOf('(') + 1, s.lastIndexOf(')')).split(',').map(parseFloat);
    if (s.indexOf('matrix3d') === 0 && v.length === 16) return new Float32Array(v);
    if (v.length === 6) return new Float32Array([v[0], v[1], 0, 0, v[2], v[3], 0, 0, 0, 0, 1, 0, v[4], v[5], 0, 1]);
    return null;
  }
  const cssO = (s) => { const v = String(s || '').split(' ').map(parseFloat); return [v[0] || 0, v[1] || 0, v[2] || 0]; };
  /* Kurven wie cubic-bezier() in CSS */
  function bez(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = (t) => ((ax * t + bx) * t + cx) * t, Y = (t) => ((ay * t + by) * t + cy) * t, dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = X(t) - x, d = dX(t); if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; t -= e / d; }
      if (!(t >= 0 && t <= 1) || Math.abs(X(t) - x) > 1e-4) { let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++) { if (X(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
      return Y(t);
    };
  }
  const E_FORM = bez(0.3, 0.7, 0.2, 1), E_CAM = bez(0.4, 0.1, 0.2, 1), E_SCHWING = bez(0.42, 0, 0.58, 1), E_POP = bez(0.3, 1.5, 0.5, 1), E_OUT = bez(0.2, 0.7, 0.2, 1), E_EASE = bez(0.25, 0.1, 0.25, 1);
  /* wie --e-io (Fahren und Wenden des Sonnenschutzes) und der kurze Zoom-Übergang (is-zoomanim, app.css) */
  const E_IO = bez(0.45, 0, 0.2, 1), E_ZOOM = E_FORM;
  /* Übergänge je Fläche: Dauer d (ms), Kurve k, Verzögerung v (ms) wie die CSS-Übergänge der Flächen */
  const T_FORM = { d: 700, k: E_FORM, v: 0 }, T_ZOOM = { d: 380, k: E_ZOOM, v: 0 }, T_WENDE = { d: 600, k: E_IO, v: 0 };
  const lerp = (a, b, t) => a + (b - a) * t;
  const ruhig = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

  /* ---------- CSS-Hintergründe lesen: Farben, linear/radial, wiederholt, Größe und Lage je Schicht ---------- */
  const NAMEN = { white: [1, 1, 1, 1], black: [0, 0, 0, 1], transparent: [0, 0, 0, 0] };
  function farbe(t) {
    t = String(t || '').trim().toLowerCase();
    if (NAMEN[t]) return NAMEN[t].slice();
    if (t[0] === '#') {
      let h = t.slice(1); if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
      const n = parseInt(h.slice(0, 6), 16); if (isNaN(n)) return null;
      return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255, h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1];
    }
    const m = t.match(/^rgba?\(([^)]*)\)$/);
    if (m) { const v = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); if (v.length < 3) return null; return [v[0] / 255, v[1] / 255, v[2] / 255, v.length > 3 ? v[3] : 1]; }
    return null;
  }
  /* auf oberster Ebene an Kommas teilen */
  function teilen(s) {
    const o = []; let d = 0, a = 0;
    for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === '(') d++; else if (c === ')') d--; else if (c === ',' && !d) { o.push(s.slice(a, i).trim()); a = i + 1; } }
    o.push(s.slice(a).trim()); return o.filter(Boolean);
  }
  const laenge = (t) => { t = String(t).trim(); const v = parseFloat(t); if (isNaN(v)) return null; return { v: v, u: /%$/.test(t) ? '%' : 'px' }; };
  const SCHLUESSEL = { left: { v: 0, u: '%' }, top: { v: 0, u: '%' }, center: { v: 50, u: '%' }, right: { v: 100, u: '%' }, bottom: { v: 100, u: '%' } };
  const lageWert = (t) => SCHLUESSEL[t] || laenge(t) || { v: 50, u: '%' };
  function haltepunkt(s) {
    s = s.trim();
    let c, rest;
    if (/^(rgba?|hsla?)\(/i.test(s)) { const e = s.indexOf(')'); c = s.slice(0, e + 1); rest = s.slice(e + 1); }
    else { const e = s.search(/\s/); c = e < 0 ? s : s.slice(0, e); rest = e < 0 ? '' : s.slice(e); }
    const f = farbe(c); if (!f) return null;
    const p = rest.trim().split(/\s+/).filter(Boolean).map(laenge).filter(Boolean);
    return p.length ? p.map((x) => ({ c: f, p: x })) : [{ c: f, p: null }];
  }
  function schicht(s) {
    const m = s.match(/^(repeating-)?(linear|radial)-gradient\(/);
    if (!m) { const f = farbe(s); return f ? { farbe: f } : null; }
    let d = 0, e = -1;
    for (let i = m[0].length - 1; i < s.length; i++) { if (s[i] === '(') d++; else if (s[i] === ')') { d--; if (!d) { e = i; break; } } }
    if (e < 0) return null;
    const args = teilen(s.slice(m[0].length, e)), rest = s.slice(e + 1).trim();
    const L = { rad: m[2] === 'radial', rep: !!m[1], winkel: 180, kreis: false, at: [SCHLUESSEL.center, SCHLUESSEL.center], stops: [], groesse: null, lage: null, einmal: /no-repeat/.test(rest) };
    const a0 = args[0] || '';
    if (!L.rad) {
      const w = a0.match(/^(-?[\d.]+)(deg|turn|rad)$/);
      if (w) { L.winkel = parseFloat(w[1]) * (w[2] === 'turn' ? 360 : w[2] === 'rad' ? 180 / Math.PI : 1); args.shift(); }
      else if (/^to\s/.test(a0)) { const z = a0.slice(3).trim().split(/\s+/), h = z.indexOf('left') >= 0 ? -1 : z.indexOf('right') >= 0 ? 1 : 0, v = z.indexOf('top') >= 0 ? -1 : z.indexOf('bottom') >= 0 ? 1 : 0; L.winkel = (Math.atan2(h, -v) * 180 / Math.PI + 360) % 360; args.shift(); }
    } else if (/^(circle|ellipse|at\s|closest|farthest|-?[\d.]+(px|%))/.test(a0) || /\sat\s/.test(a0)) {
      /* Form und Größe: circle/ellipse, Schlüsselwort (closest-side … farthest-corner) oder feste Radien (circle 3px, ellipse 10px 4px) */
      const teile = a0.split(/(?:^|\s)at\s/), form = teile[0].trim().split(/\s+/).filter(Boolean), at = teile[1];
      const rad = form.map(laenge).filter(Boolean), wort = form.find((t) => /^(closest|farthest)-(side|corner)$/.test(t));
      L.kreis = form.indexOf('circle') >= 0 || (form.indexOf('ellipse') < 0 && rad.length === 1);
      if (rad.length) L.r = [rad[0], rad[1] || rad[0]]; else if (wort) L.wort = wort;
      if (at) { const z = at.trim().split(/\s+/); L.at = [lageWert(z[0]), lageWert(z[1] || 'center')]; }
      args.shift();
    }
    args.forEach((a) => { const h = haltepunkt(a); if (h) L.stops.push(...h); });
    if (!L.stops.length) return null;
    const r = rest.replace(/no-repeat|repeat-x|repeat-y|repeat/g, '').trim();
    if (r) {
      const t = r.split('/'), pos = t[0].trim().split(/\s+/).filter(Boolean), gr = t[1] ? t[1].trim().split(/\s+/).filter(Boolean) : null;
      if (pos.length) L.lage = [lageWert(pos[0]), lageWert(pos[1] || pos[0])];
      if (gr && gr.length) L.groesse = [laenge(gr[0]), laenge(gr[1] || gr[0])];
    }
    return L;
  }
  const BG = new Map();
  function hintergrund(str) {
    str = String(str || '').trim();
    let b = BG.get(str); if (b) return b;
    b = { basis: [0, 0, 0, 0], schichten: [] };
    const t = teilen(str);
    t.forEach((s, i) => { const L = schicht(s); if (!L) return; if (L.farbe) { if (i === t.length - 1) b.basis = L.farbe; } else b.schichten.push(L); });
    if (BG.size > 400) BG.clear();
    BG.set(str, b); return b;
  }
  /* Haltepunkte für eine Kastengröße auflösen (wie CSS: fehlende verteilt, nie rückwärts) */
  function aufloesen(L, bw, bh) {
    let Lg, cx = 0, cy = 0, ky = 1, dx = 0, dy = 0;
    if (L.rad) {
      cx = L.at[0].u === '%' ? L.at[0].v / 100 * bw : L.at[0].v; cy = L.at[1].u === '%' ? L.at[1].v / 100 * bh : L.at[1].v;
      const nah = L.wort && L.wort.indexOf('closest') === 0, ecke = !L.wort || /corner$/.test(L.wort);
      const fx = nah ? Math.min(cx, bw - cx) : Math.max(cx, bw - cx), fy = nah ? Math.min(cy, bh - cy) : Math.max(cy, bh - cy);
      const px = (l, L2) => (l.u === '%' ? l.v / 100 * L2 : l.v);
      if (L.r) { const rx = px(L.r[0], bw), ry = L.kreis ? rx : px(L.r[1], bh); Lg = rx; ky = ry > 1e-6 ? rx / ry : 1; }
      else if (L.kreis) { Lg = ecke ? Math.hypot(fx, fy) : nah ? Math.min(fx, fy) : Math.max(fx, fy); ky = 1; }
      else { const rx = (ecke ? Math.SQRT2 : 1) * fx, ry = (ecke ? Math.SQRT2 : 1) * fy; Lg = rx; ky = ry > 1e-6 ? rx / ry : 1; }
    } else {
      const a = L.winkel * RAD; dx = Math.sin(a); dy = -Math.cos(a); Lg = Math.abs(bw * dx) + Math.abs(bh * dy);
    }
    Lg = Math.max(Lg, 1e-3);
    const p = L.stops.map((s) => (s.p ? (s.p.u === '%' ? s.p.v / 100 * Lg : s.p.v) : null));
    if (p[0] == null) p[0] = 0;
    if (p[p.length - 1] == null) p[p.length - 1] = L.rep ? p[0] : Lg;
    for (let i = 1; i < p.length; i++) if (p[i] != null && p[i] < p[i - 1]) p[i] = p[i - 1];
    for (let i = 1; i < p.length; i++) {
      if (p[i] != null) continue;
      let j = i; while (p[j] == null) j++;
      for (let k = i; k < j; k++) p[k] = p[i - 1] + (p[j] - p[i - 1]) * (k - i + 1) / (j - i + 1);
      i = j;
    }
    return { Lg: Lg, cx: cx, cy: cy, ky: ky, dx: dx, dy: dy, p: p };
  }
  const vormul = (c) => [c[0] * c[3], c[1] * c[3], c[2] * c[3], c[3]];

  /* ---------- Shader ---------- */
  const VS = '#version 300 es\nlayout(location=0) in vec2 aP;uniform mat4 uM;uniform mat4 uVP;uniform float uDz;out vec2 vP;out vec3 vW;' +
    'void main(){vec4 w=uM*vec4(aP,uDz,1.0);vW=w.xyz;vP=aP;gl_Position=uVP*w;}';
  const FS = (schnitt) => '#version 300 es\nprecision highp float;precision highp int;\n' + (schnitt ? '#define SCHNITT 1\n' : '') + 'in vec2 vP;in vec3 vW;' +
    'uniform vec2 uWH;uniform vec4 uBase;uniform int uNL;uniform vec4 uLA[5];uniform vec4 uLB[5];uniform vec4 uLC[5];uniform vec4 uLM[5];uniform vec4 uSC[48];uniform float uSP[48];' +
    'uniform vec4 uIn;uniform vec4 uFx;uniform float uOp;uniform vec3 uN;uniform vec3 uEye;uniform vec4 uLi;uniform float uSide;' +
    'uniform vec3 uL1;uniform vec3 uC1;uniform vec3 uL2;uniform vec3 uC2;uniform vec3 uSky;uniform vec3 uGnd;uniform vec4 uAo[4];uniform vec2 uAoR;uniform vec4 uTint;uniform vec3 uN2;uniform vec2 uFade;uniform vec4 uArt;uniform vec3 uArtC;uniform vec4 uBand;uniform vec4 uBev;uniform vec4 uBevI;uniform vec3 uTx;uniform vec3 uTy;uniform float uNA;uniform vec2 uArtO;uniform vec4 uRelief;uniform vec4 uPr;uniform vec3 uPrC;' +
    'vec2 gFw;' +
    /* Gerundete Kanten: am Rand der Fläche (und am inneren Rechteck eines Rahmens) neigt sich die Normale nach außen, so fangen Profile Licht */
    'vec3 kante(vec2 P){vec3 t=vec3(0.0);if(uBev.x<=0.0)return t;float fw=max(length(gFw),1e-4);float w=max(uBev.x,1.5*fw);float st=uBev.y*smoothstep(0.5*fw,2.0*fw,uBev.x);' +
    't+=-uTx*(1.0-smoothstep(0.0,w,P.x))+uTx*(1.0-smoothstep(0.0,w,uWH.x-P.x))-uTy*(1.0-smoothstep(0.0,w,P.y))+uTy*(1.0-smoothstep(0.0,w,uWH.y-P.y));' +
    'if(uBevI.z>uBevI.x){vec4 r=uBevI;float iy=smoothstep(r.y-w-fw,r.y-w,P.y)*(1.0-smoothstep(r.w+w,r.w+w+fw,P.y)),ix=smoothstep(r.x-w-fw,r.x-w,P.x)*(1.0-smoothstep(r.z+w,r.z+w+fw,P.x));' +
    'if(P.x<=r.x)t+=iy*uTx*(1.0-smoothstep(0.0,w,r.x-P.x));if(P.x>=r.z)t-=iy*uTx*(1.0-smoothstep(0.0,w,P.x-r.z));' +
    'if(P.y<=r.y)t+=ix*uTy*(1.0-smoothstep(0.0,w,r.y-P.y));if(P.y>=r.w)t-=ix*uTy*(1.0-smoothstep(0.0,w,P.y-r.w));}' +
    'return t*st;}' +
    /* Oberflächen: Rauschen aus ganzzahligem Hash (stabil, kein Flimmern), Putz, Klinker im Läuferverband, Naturstein, Holz, Alu */
    'float hash(vec2 p){uvec2 q=uvec2(ivec2(floor(p)));uint h=q.x*1597334677u^q.y*3812015801u;h=(h^(h>>16))*2246822519u;h^=h>>13;return float(h)*(1.0/4294967296.0);}' +
    'float rausch(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);}' +
    /* Sichtbarkeit eines Musters der Periode groesse: ab einem Viertel der Periode je Bildpunkt ausblenden, bei der Hälfte weg
       (Nyquist); später gezeichnete Muster würfeln bei jeder Bewegung neu und flimmern */
    'float sicht(vec2 P,float groesse){float w=length(gFw);return 1.0-smoothstep(groesse*0.25,groesse*0.5,w);}' +
    'vec3 putz(vec2 P,vec3 c,float k,float st){float a=sicht(P,1.2*k),b=sicht(P,4.0*k);float n=(rausch(P/(1.2*k))-0.5)*a*0.55+(rausch(P/(4.0*k)+7.3)-0.5)*b+(rausch(P/(22.0*k)+3.1)-0.5)*0.6;return c*(1.0+st*n);}' +
    /* Klinker im Grundton b (uArtC aus app.js, Farbwahl am Zahnrad): je Stein etwas heller oder dunkler und etwas wärmer oder kühler,
       vereinzelt dunkler gebrannt, zum Rand hin dunkler; die Fuge hellgrau, bei hellen Steinen etwas dunkler als der Stein, damit der
       Verband lesbar bleibt. Gerechnet ab der Fugenmitte: beide Kanten jeder Fuge sind geglättet, Stein und Reihe wechseln mitten in
       der Fuge (vorher sprang die Kante am Fugenanfang innerhalb eines Bildpunkts) */
    'vec3 klinker(vec2 P,vec3 b,float k){float C=81.0*k,L=250.0*k,j=10.0*k;float yy=P.y-0.5*j;float r=floor(yy/C);float x=P.x+mod(r,2.0)*L*0.5-0.5*j;float s=floor(x/L);' +
    'vec2 q=vec2(x-s*L,yy-r*C);vec2 dq=min(q,vec2(L,C)-q);vec2 aq=max(gFw*0.7,vec2(1e-4));' +
    /* Fuge je Achse: geglättetes Profil, bei Fugen schmaler als ein Bildpunkt nach ihrer Fläche gewichtet (sonst zu kräftig und flimmernd) */
    'vec2 ab=vec2(1.0)-smoothstep(vec2(0.5*j)-aq,vec2(0.5*j)+aq,dq);vec2 dk=clamp(vec2(j)/(2.0*aq),0.0,1.0);float m=max(ab.x*dk.x,ab.y*dk.y);' +
    'float v=hash(vec2(s,r)*1.37+0.5),v2=hash(vec2(s,r)*2.71+3.3);vec3 ton=mix(vec3(0.95,1.0,1.05),vec3(1.05,0.99,0.93),v2)*(v2>0.965?0.8:1.0);' +
    'vec3 st=b*ton*mix(0.82,1.12,v)*(0.93+0.12*rausch(P/(9.0*k)));float e=min(dq.x,dq.y)-0.5*j;st*=mix(0.84,1.0,smoothstep(0.0,6.0*k,e));' +
    'float hell=smoothstep(0.55,0.72,(b.r+b.g+b.b)/3.0);vec3 fuge=mix(vec3(0.74,0.7,0.65),b*0.84,hell);vec3 mo=fuge*(0.92+0.1*rausch(P/(2.5*k)));vec3 c=mix(st,mo,m);vec3 mittel=mix(b*0.97,fuge,0.2);return mix(mittel,c,sicht(P,C));}' +
    /* Naturstein: feste Korngröße; Körner feiner als ein Bildpunkt gehen in einen etwas dunkleren Mittelton über, statt bei jeder
       Bewegung neu zu würfeln */
    'vec3 granit(vec2 P,vec3 c,float k){float g=0.8*k;float a=sicht(P,2.0*g),a3=sicht(P,4.4*g);float n1=rausch(P/g),n2=rausch(P/(g*1.3)+17.0),n3=rausch(P/(g*2.2)+5.0),n4=rausch(P/(12.0*k)+3.0);' +
    'c*=0.93+0.12*n4;c=mix(c,c*0.78,mix(0.1,smoothstep(0.55,0.75,n3),a3)*0.5);c=mix(c,vec3(0.2,0.19,0.18),mix(0.05,smoothstep(0.8,0.9,n1),a)*0.6);c=mix(c,vec3(0.96,0.95,0.94),mix(0.05,smoothstep(0.8,0.9,n2),a)*0.5);return c;}' +
    'vec3 holz(vec2 P,vec3 c,float k,bool senk){vec2 q=senk?P.yx:P;float u=q.y/k;float wp=rausch(vec2(q.x/(90.0*k),u/9.0))*7.0+rausch(vec2(q.x/(22.0*k),u/3.0))*1.5;' +
    'float g=fract((u+wp)/6.5);float lin=smoothstep(0.0,0.22,g)*(1.0-smoothstep(0.45,1.0,g));float fein=rausch(vec2(q.x/(4.0*k),u*1.5));float streif=rausch(vec2(q.x/(160.0*k),u/14.0));' +
    'float sh=sicht(P,6.5*k);vec3 r=c*mix(0.9,1.1,streif)*mix(1.0,mix(0.76,1.06,lin)*(0.94+0.12*fein),sh);return r;}' +
    'vec3 bretter(vec2 P,vec3 c,float k){float B=146.0*k,j=6.0*k;float xx=P.x-0.5*j;float b=floor(xx/B);float x=xx-b*B;float dx=min(x,B-x);float aa=max(gFw.x*0.7,1e-4);float fuge=(1.0-smoothstep(0.5*j-aa,0.5*j+aa,dx))*clamp(j/(2.0*aa),0.0,1.0);' +
    'vec3 h=holz(vec2(P.x,P.y+hash(vec2(b,3.0))*900.0*k),c*(0.9+0.2*hash(vec2(b,1.0))),k,true);return mix(h,c*0.45,fuge*sicht(P,B));}' +
    'vec3 alu(vec2 P,vec3 c,float k){float n=rausch(vec2(P.x/(40.0*k),P.y/(0.6*k)))*sicht(P,0.6*k);return c*(0.96+0.08*n);}' +
    'uniform highp sampler2DShadow uSM;uniform mat4 uLVP;uniform vec3 uSh;' +
    'const vec2 PD[12]=vec2[12](vec2(-0.326,-0.406),vec2(-0.840,-0.074),vec2(-0.696,0.457),vec2(-0.203,0.621),vec2(0.962,-0.195),vec2(0.473,-0.480),vec2(0.519,0.767),vec2(0.185,-0.893),vec2(0.507,0.064),vec2(0.896,0.412),vec2(-0.322,-0.933),vec2(-0.792,-0.598));' +
    'float schatten(vec3 w,vec3 n,vec3 l){if(uSh.x<0.5)return 1.0;vec3 nl=dot(n,l)<0.0?-n:n;vec4 q=uLVP*vec4(w+nl*uSh.z,1.0);vec3 p=q.xyz/q.w*0.5+0.5;' +
    'if(p.x<0.0||p.x>1.0||p.y<0.0||p.y>1.0||p.z>1.0)return 1.0;vec2 t=uSh.y/vec2(textureSize(uSM,0));float s=0.0;for(int i=0;i<12;i++)s+=textureLod(uSM,vec3(p.xy+PD[i]*t,p.z-0.0015),0.0);' +
    'float rd=min(min(p.x,1.0-p.x),min(p.y,1.0-p.y));return mix(1.0,s/12.0,smoothstep(0.0,0.1,rd));}' +
    'out vec4 o;' +
    /* Profilstufen (uPr.x: 1 Flügel innen, 2 Flügel außen, 3 Blendrahmen innen, 4 Blendrahmen außen, 5 Glas, 6 Pfosten innen; uPr.y px je mm, uPr.z Stärke):
       Dichtung, Glasleiste mit Fase, Fuge, Schattenfuge am Überschlag, Schlagschatten des Flügels auf dem Blendrahmen, Abstandhalter im Glasrand.
       Linien unter einem Pixel werden über die Kantenglättung (aa) schwächer statt zu flimmern */
    'vec3 gPN=vec3(0.0);float gPG=0.0;' +
    'float bnd(float d,float a,float b,float aa){return smoothstep(a-aa,a+aa,d)*(1.0-smoothstep(b-aa,b+aa,d));}' +
    'float schlag(float di,vec2 o,vec3 L,float s,float aa){vec2 l=vec2(dot(L,uTx),dot(L,uTy));float q=-dot(o,normalize(l+1e-5))*length(l);if(q<=0.0)return 0.0;float w=8.0*s*q/max(abs(dot(L,cross(uTx,uTy))),0.25);return 0.32*(1.0-smoothstep(0.0,max(w,aa),di));}' +
    'vec4 profil(vec2 P,vec4 c){int m=int(uPr.x+0.5);if(m<=0)return c;float s=uPr.y;float aa=max(length(gFw)*0.7,1e-4);' +
    'if(m==5){float d=min(min(P.x,P.y),min(uWH.x-P.x,uWH.y-P.y));float w=11.0*s;float k=1.0-smoothstep(w-aa,w+aa,d);float kd=1.0-smoothstep(2.8*s-aa,2.8*s+aa,d);float lk=bnd(d,w-1.4*s,w,aa);vec3 f=mix(uPrC*(1.0+0.6*lk),vec3(0.085,0.09,0.095),kd);vec4 a=vec4(f,1.0)*k*uPr.z;gPG=k;return a+c*(1.0-a.a);}' +
    'if(m==6){float dl=P.x,dr=uWH.x-P.x;float di=min(dl,dr);vec2 o=dl<dr?vec2(1.0,0.0):vec2(-1.0,0.0);float f=1.0-0.5*(1.0-smoothstep(1.2*s-aa,1.2*s+aa,di));f*=1.0-schlag(di,o,uL1,s,aa);c.rgb*=f;return c;}' +
    'vec4 r=uBevI;if(r.z<=r.x)return c;float dx=max(r.x-P.x,P.x-r.z),dy=max(r.y-P.y,P.y-r.w);float di=max(dx,dy);if(di<0.0)return c;' +
    'float da=min(min(P.x,P.y),min(uWH.x-P.x,uWH.y-P.y));vec2 e=dx>dy?vec2(P.x<r.x?1.0:-1.0,0.0):vec2(0.0,P.y<r.y?1.0:-1.0);vec3 E=e.x*uTx+e.y*uTy;vec3 rgb=c.rgb;' +
    'const vec3 DICHT=vec3(0.085,0.09,0.095);' +
    'if(m==1){float gz=1.0-smoothstep(19.0*s-aa,19.0*s+aa,di);gPN+=E*0.5*gz*(1.0-smoothstep(2.0*s,19.0*s,di));rgb*=1.0-0.42*bnd(di,19.0*s,20.2*s,aa);' +
    'rgb*=1.0-0.45*(1.0-smoothstep(1.0*s-aa,1.0*s+aa,da));}' +
    'else if(m==2){gPN+=E*0.38*(1.0-smoothstep(13.0*s-aa,13.0*s+aa,di));rgb*=1.0-0.3*bnd(di,13.0*s,13.8*s,aa);rgb*=1.0-0.4*(1.0-smoothstep(1.0*s-aa,1.0*s+aa,da));}' +
    'else if(m==3){rgb*=1.0-0.5*(1.0-smoothstep(1.3*s-aa,1.3*s+aa,di));rgb*=1.0-schlag(di,-e,uL1,s,aa);}' +
    'else if(m==4){float kd=1.0-smoothstep(1.6*s-aa,1.6*s+aa,di);rgb=mix(rgb,DICHT*c.a,kd);rgb*=1.0-schlag(di,-e,uL2,s,aa);}' +
    'c.rgb=rgb;return c;}' +
    /* weiche Schulter: Weiß bleibt unter 242, nichts brennt aus (designrichtung 3.4) */
    'vec3 tm(vec3 x){float l=dot(x,vec3(0.2126,0.7152,0.0722));if(l<=0.88)return x;float m=0.88+0.075*(1.0-exp(-(l-0.88)/0.075));return min(x*(m/l),vec3(0.985));}' +
    'vec4 verlauf(int s0,int n,float t,float aa){vec4 c=uSC[s0];for(int i=1;i<16;i++){if(i>=n)break;float a=uSP[s0+i-1],b=uSP[s0+i];float w=max(b-a,aa);float lo=(a+b)*0.5-w*0.5;c=mix(c,uSC[s0+i],clamp((t-lo)/w,0.0,1.0));}return c;}' +
    'vec4 lage(int i,vec2 P){vec4 A=uLA[i],B=uLB[i],C=uLC[i];int fl=int(A.x+0.5);bool rad=(fl&1)==1,rep=(fl&2)==2,einmal=(fl&4)==4;int s0=int(A.y+0.5),n=int(A.z+0.5);' +
    'vec2 Q=P-C.xy;vec2 box=uWH;if(C.z>0.0){box=C.zw;if(einmal){if(Q.x<0.0||Q.y<0.0||Q.x>box.x||Q.y>box.y)return vec4(0.0);}else Q=mod(Q,box);}' +
    'float t,aa;if(rad){vec2 d=Q-B.xy;t=length(vec2(d.x,d.y*B.w));aa=(abs(d.x)*gFw.x+abs(d.y)*B.w*B.w*gFw.y)/max(t,1e-4);}else{t=dot(Q-box*0.5,B.xy)+B.z*0.5;aa=abs(B.x)*gFw.x+abs(B.y)*gFw.y;}aa=max(aa,1e-4);' +
    'if(rep&&A.w>0.0){float f0=uSP[s0];float per=A.w;if(per<aa*2.0)return uLM[i];t=f0+mod(t-f0,per);vec4 c=verlauf(s0,n,t,aa);float dw=min(t-f0,f0+per-t);' +
    'c=mix(mix(uSC[s0],uSC[s0+n-1],0.5),c,smoothstep(0.0,aa,dw));return mix(uLM[i],c,smoothstep(aa*2.0,aa*4.0,per));}' +
    'return verlauf(s0,n,t,aa);}' +
    'void main(){gFw=fwidth(vP);vec3 N=normalize(mix(uN,uN2,clamp(uNA>0.5?vP.y/max(uWH.y,1e-3):vP.x/max(uWH.x,1e-3),0.0,1.0)));vec3 V=normalize(uEye-vW);float fs=dot(N,V);' +
    '\n#ifdef SCHNITT\nif(uSide>0.5&&fs<0.0)discard;if(uSide<-0.5&&fs>0.0)discard;\n#endif\n' +
    'vec2 P=vP;vec4 c=uBase;for(int i=4;i>=0;i--){if(i>=uNL)continue;vec4 l=lage(i,P);c=l+c*(1.0-l.a);}' +
    'int art=int(uArt.x+0.5);if(art>0&&c.a>0.0){float k=uArt.y;vec3 b=art>=2?uArtC:c.rgb/c.a;vec3 r=b;vec2 Q=P+uArtO;' +
    'if(art==1)r=putz(Q,b,k,uArt.w);else if(art==2)r=klinker(Q,b,k);else if(art==3)r=granit(Q,b,k);else if(art==5)r=alu(Q,b,k);else if(art==6)r=bretter(Q,b,k);else if(art==7)r=alu(Q,c.rgb/max(c.a,1e-3),k);' +
    'else if(art==4){bool senk=uArt.z>1.5;if(uBand.z>uBand.x){float dt=P.y/max(uBand.y,1e-3),db=(uWH.y-P.y)/max(uWH.y-uBand.w,1e-3),dl=P.x/max(uBand.x,1e-3),dr=(uWH.x-P.x)/max(uWH.x-uBand.z,1e-3);senk=min(dl,dr)<min(dt,db);}r=holz(P,b,k,senk);}' +
    'c.rgb=r*c.a;}' +
    'float aaP=max(length(gFw)*0.7,1e-3);' +
    'if(uFx.x>0.0){float d=min(min(P.x,P.y),min(uWH.x-P.x,uWH.y-P.y));vec4 k=uIn*clamp(uFx.x/max(2.0*aaP,1e-3),0.0,1.0)*(1.0-smoothstep(uFx.x-aaP,uFx.x+aaP,d));c=k+c*(1.0-k.a);}' +
    'if(uFx.y>0.0){vec2 h=uWH*0.5;vec2 q=abs(P-h)-(h-uFx.y);float sd=length(max(q,0.0))+min(max(q.x,q.y),0.0)-uFx.y;c*=1.0-smoothstep(-aaP,aaP,sd);}' +
    'c=profil(P,c);c=uTint*c.a+c*(1.0-uTint.a);' +
    /* Verschattung: je Kante ein Band (uAo, bis vier), oder (uAoR.y) rund um ein Rechteck (uAo[0] = Loch, uAo[1].x = Stärke): weich auch über die
       Ecken, keine Linie in Verlängerung der Lochkante (Kontaktschatten um die Maueröffnung und die Rahmenöffnung) */
    'float ao=1.0;if(uAoR.y>0.5){vec4 rb=uAo[0];vec2 ce=(rb.xy+rb.zw)*0.5,hs=(rb.zw-rb.xy)*0.5;vec2 qq=abs(P-ce)-hs;float dd=length(max(qq,0.0));float f=1.0-clamp(dd/uAoR.x,0.0,1.0);ao*=1.0-uAo[1].x*f*f;if(uAo[1].y>0.0){float de=min(min(P.x,P.y),min(uWH.x-P.x,uWH.y-P.y));float g=1.0-clamp(de/uAo[1].z,0.0,1.0);ao*=1.0-uAo[1].y*g*g;}}' +
    'else{for(int i=0;i<4;i++){vec4 a=uAo[i];if(a.w<=0.0)continue;float q=a.x<0.5?P.x:P.y;float d=(q-a.y)*a.z;if(d<-1.0)continue;d=max(d,0.0);float r=uAoR.x;float f=1.0-clamp(d/r,0.0,1.0);ao*=1.0-a.w*f*f;}}' +
    'if(uFade.y>0.0)c*=1.0-smoothstep(uFade.x,uFade.y,P.y);' +
    'c*=uOp;\n#ifdef SCHNITT\nif(uFx.z>0.0){if(c.a<uFx.z)discard;}\n#endif\n' +
    /* Relief (uRelief: Teilung px, Neigung, Versatz): je Teilung eine gewölbte Lamelle des Rollladenpanzers, von außen (Rückseite der Fläche) konvex, oben zum Licht geneigt, unten weg, von innen konkav */
    'if(uLi.x>0.5){if(fs<0.0)N=-N;N=normalize(N+kante(vP)+gPN);if(uRelief.x>0.0){float ph=fract((vP.y+uRelief.z)/uRelief.x);N=normalize(N+uTy*uRelief.y*sicht(vP,uRelief.x)*(2.0*ph-1.0)*(fs<0.0?1.0:-1.0));}float d1=max(dot(N,uL1),0.0),d2=max(dot(N,uL2),0.0);vec3 amb=mix(uGnd,uSky,0.5-0.5*N.y);' +
    'if(uSh.x>1.5){if(d2>0.0)d2*=schatten(vW,N,uL2);}else if(d1>0.0)d1*=schatten(vW,N,uL1);' +
    'vec3 li=(amb+uC1*d1+uC2*d2)*ao;vec3 rgb=c.rgb*li;' +
    'if(uLi.y>0.0){vec3 H1=normalize(uL1+V),H2=normalize(uL2+V);float sp=pow(max(dot(N,H1),0.0),uLi.z)*step(0.0,dot(N,uL1))+pow(max(dot(N,H2),0.0),uLi.z)*step(0.0,dot(N,uL2));rgb+=vec3(uLi.y*sp)*c.a;}' +
    'if(uLi.w>0.5){float cf=clamp(abs(fs),0.0,1.0),F=0.06+0.94*pow(1.0-cf,5.0);vec3 R=reflect(-V,N);float up=-R.y+0.9*(0.42-vP.y/max(uWH.y,1.0));' +
    'vec3 sky=mix(vec3(0.9,0.93,0.96),vec3(0.55,0.67,0.84),smoothstep(0.0,0.6,up)),gnd=mix(vec3(0.56,0.56,0.53),vec3(0.3,0.29,0.27),smoothstep(0.0,0.3,-up));vec3 env=mix(gnd,sky,smoothstep(-0.1,0.12,up));' +
    /* von außen: dahinter der dunkle Raum, das Glas spiegelt den Himmel; von innen bleibt der Blick hinaus hell */
    'if(fs<0.0){float da=max(c.a,0.94);rgb=mix(rgb,vec3(0.11,0.12,0.13)*da,0.72);c.a=da;F=max(F,0.2);}' +
    'else{rgb=mix(rgb,c.rgb*0.98,0.75*(1.0-gPG));}rgb=rgb*(1.0-F)+env*F*c.a;}' +
    'if(c.a>0.0)rgb=tm(rgb/c.a)*c.a;' +
    'c.rgb=rgb;}else c.rgb*=ao;' +
    'o=c;}';

  const VS_S = '#version 300 es\nlayout(location=0) in vec2 aP;uniform mat4 uM;uniform mat4 uLVP;uniform float uDz;void main(){gl_Position=uLVP*uM*vec4(aP,uDz,1.0);}';
  const FS_S = '#version 300 es\nprecision mediump float;out vec4 o;void main(){o=vec4(1.0);}';
  function programm(gl, vs, fs, namen) {
    const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs || VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs || FS(true))); gl.bindAttribLocation(p, 0, 'aP'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; (namen || ['uM', 'uVP', 'uDz', 'uWH', 'uBase', 'uNL', 'uLA', 'uLB', 'uLC', 'uLM', 'uSC', 'uSP', 'uIn', 'uFx', 'uOp', 'uN', 'uEye', 'uLi', 'uSide', 'uL1', 'uC1', 'uL2', 'uC2', 'uSky', 'uGnd', 'uAo', 'uAoR', 'uTint', 'uN2', 'uSM', 'uLVP', 'uSh', 'uFade', 'uArt', 'uArtC', 'uBand', 'uBev', 'uBevI', 'uTx', 'uTy', 'uNA', 'uArtO', 'uRelief', 'uPr', 'uPrC']).forEach((k) => { u[k] = gl.getUniformLocation(p, k); });
    return { p: p, u: u };
  }

  /* ---------- Leinwände: wenige WebGL-Zusammenhänge, die zwischen Bühnen wandern ---------- */
  const POOL = [];
  let OK = null;
  /* ein verlorener Zusammenhang (Grafikchip zurückgesetzt, zu viele Leinwände) zeichnet nichts mehr: nie wiederverwenden */
  const lebt = (L) => !!L && !L.verloren && !L.kaputt && !L.gl.isContextLost();
  /* Stufe der Bildqualität in Bewegung (Regler in bild()): gilt als Start für alle weiteren Bühnen, erholt sich aber wieder.
     Ein fehlgeschlagener Selbsttest schaltet für die Sitzung aufs CSS-Modell, Langsamkeit nie */
  let GSTUFE = 0;
  /* Pixeldichte je Stufe in Bewegung: 0 scharf (bis 2), 1 etwas gröber, 2 gröber und ohne Schatten. Ein stehendes Bild wird einmal
     in voller Pixeldichte des Geräts gezeichnet (bis 3, höchstens 1,3 Millionen Bildpunkte), mit Schatten */
  const STUFE_DPR = [2, 1.5, 1.25], RUHE_DPR = 3, RUHE_PX = 1.3e6;
  function ausPool() { while (POOL.length) { const L = POOL.pop(); if (lebt(L)) return L; } return null; }
  /* Ohne Grafikchip (Software-WebGL) bleibt das CSS-Modell: dort dauert ein Bild Hunderte Millisekunden.
     ?gl=voll erzwingt WebGL trotzdem (Bildvergleiche und Prüfung der Bühne) */
  const VOLL = /[?&]gl=voll/.test(location.search);
  /* ?gl=info: kleine Anzeige in der Bühne (Grafikchip, Tiefenpuffer, Kantenglättung, Pixeldichte, Stufe, Bildzeit), zum Nachsehen
     am eigenen Telefon */
  const INFO = /[?&]gl=info/.test(location.search);
  function infoZeigen(stage, B, now) {
    if (!INFO || now - (B.infoT || 0) < 400) return;
    B.infoT = now;
    let e = stage.querySelector('.w3d-glinfo');
    if (!e) { e = document.createElement('div'); e.className = 'w3d-glinfo'; e.setAttribute('aria-hidden', 'true'); e.style.cssText = 'position:absolute;left:8px;bottom:8px;z-index:9;padding:6px 8px;border-radius:8px;background:rgba(22,22,22,.82);color:#f2efe8;font:13px/1.35 Inter,system-ui,sans-serif;pointer-events:none;white-space:pre'; stage.appendChild(e); }
    const gl = B.L.gl, x = gl.getExtension('WEBGL_debug_renderer_info'), a = gl.getContextAttributes() || {};
    if (!B.L.chip) B.L.chip = String(x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).slice(0, 44);
    e.textContent = B.L.chip + '\nTiefe ' + gl.getParameter(gl.DEPTH_BITS) + ' Bit · MSAA ' + gl.getParameter(gl.SAMPLES) + (a.antialias ? '' : ' (aus)') + '\nPixeldichte ' + (B.L.cv.width / Math.max(1, B.cw)).toFixed(2) + ' von ' + (window.devicePixelRatio || 1).toFixed(2) + ' · Stufe ' + B.stufe + (B.scharf ? ' (scharf)' : '') + '\nBild ' + Math.round(B.dt || 0) + ' ms · Leinwand ' + B.L.cv.width + '×' + B.L.cv.height;
  }
  function software(gl) {
    try { const x = gl.getExtension('WEBGL_debug_renderer_info'), r = String(x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)); return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(r); } catch (e) { return false; }
  }
  function neueLeinwand() {
    const cv = document.createElement('canvas'); cv.className = 'w3d-gl'; cv.setAttribute('aria-hidden', 'true');
    /* ohne Grafikchip liefert der Browser mit failIfMajorPerformanceCaveat keinen Zusammenhang (zweites Merkmal neben dem Namen) */
    /* stencil: true, obwohl ungenutzt: dann bekommt die Leinwand fast überall einen 24-Bit-Tiefenpuffer (gepackt mit der Schablone) statt 16 Bit */
    let gl = null;
    try { gl = cv.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true, depth: true, stencil: true, failIfMajorPerformanceCaveat: !VOLL }); } catch (e) { gl = null; }
    if (!gl) return null;
    if (!VOLL && software(gl)) { const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); return null; }
    const L = { cv: cv, gl: gl, verloren: false };
    try { einrichten(L); } catch (e) { if (window.console) console.warn('3-D-Bühne: WebGL nicht nutzbar', e); const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); return null; }
    /* verloren: sofort das CSS-Modell; zurück: wieder WebGL, außer der Regler oder der Selbsttest hat die Bühne abgeschaltet */
    cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); L.verloren = true; const st = cv.parentNode; if (st && st.classList) zumCss(st); });
    cv.addEventListener('webglcontextrestored', () => {
      try { einrichten(L); L.verloren = false; L.geprueft = false; } catch (e) { return; }
      const st = cv.parentNode; if (st && st._b3 && !st._b3.aus) { st.classList.add('gl'); st._b3.schattenNeu = true; anstoss(st); }
    });
    return L;
  }
  function einrichten(L) {
    const gl = L.gl;
    L.pr = programm(gl); L.pr0 = programm(gl, VS, FS(false));
    L.ps = programm(gl, VS_S, FS_S, ['uM', 'uLVP', 'uDz']);
    /* Schattenkarte: Tiefe aus Sicht der Sonne, mit Vergleich beim Lesen (weiche Kanten aus 12 Proben) */
    const GR = 1024;
    L.sm = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, L.sm);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, GR, GR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    L.fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, L.fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, L.sm, 0);
    gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE);
    L.smOk = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; L.smGr = GR;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    L.buf = gl.createBuffer(); L.cap = 0;
    L.vao = gl.createVertexArray(); gl.bindVertexArray(L.vao); gl.bindBuffer(gl.ARRAY_BUFFER, L.buf); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
  }
  function unterstuetzt() {
    if (OK !== null) return OK;
    const L = neueLeinwand(); OK = !!L;
    if (L && software(L.gl) && !VOLL) { OK = false; const x = L.gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); return OK; }
    if (L) POOL.push(L);
    return OK;
  }

  /* ---------- Bühnen, Schleife ---------- */
  const BUEHNEN = new Set();
  let raf = 0;
  function anstoss(stage) { if (stage && stage._b3) stage._b3.neu = true; if (!raf) raf = requestAnimationFrame(bild); }
  /* Neue Bühne an der Stelle einer alten (andere Struktur, z. B. zwei statt drei Flügel): Leinwand, Kamera, Schwingen und der
     Stand jeder Fläche gehen über, so verwandelt sich das Modell, statt neu aufzutauchen; neue Flächen blenden ein */
  function erben(alt, stage, B) {
    const A = alt._b3, now = performance.now(), karte = new Map();
    alt.querySelectorAll('[data-r]').forEach((e) => karte.set(e.getAttribute('data-r'), e));
    B.cam = A.cam; B.schwing = A.schwing; B.zuletzt = A.zuletzt;
    /* weniger Bewegung: nichts verwandelt sich, das neue Modell steht sofort da */
    if (ruhig() || stage.classList.contains('no-anim') || stage.classList.contains('ohne-erbe')) return; // ohne-erbe: der Start lässt das neue Element hereinhüpfen
    /* Maßlinien sind DOM über der Leinwand: erst nach der Verwandlung einblenden, sonst stehen sie schon am Ziel */
    stage.classList.add('gl-erbe'); clearTimeout(stage._erbeT); stage._erbeT = setTimeout(() => stage.classList.remove('gl-erbe'), 720);
    stage.querySelectorAll('.w3d-world [data-r]').forEach((e) => {
      const o = karte.get(e.getAttribute('data-r'));
      if (!o) { if (!e.closest('.w3d-dim')) e._wop = { ziel: 0, von: 0, jetzt: 0, t0: now }; return; }
      Object.keys(o).forEach((k) => { if ((k.indexOf('_t') === 0 || k.indexOf('_w') === 0) && o[k] && typeof o[k] === 'object' && 'jetzt' in o[k]) e[k] = Object.assign({}, o[k], { erbe: true }); });
    });
  }
  function an(stage) {
    if (!stage || !unterstuetzt()) return false;
    let alt = null;
    /* nur eine Bühne beerben, die render() eben ersetzt hat (_abgang), nicht eine von einem früheren Bildschirm */
    const jetzt = performance.now();
    BUEHNEN.forEach((st) => { if (!st.isConnected && st.id === stage.id && st !== stage && st._b3 && !st._b3.aus && lebt(st._b3.L) && st._abgang && jetzt - st._abgang < 1000) alt = st; });
    BUEHNEN.forEach((st) => { if (!st.isConnected && st !== alt) freigeben(st); });
    let B = stage._b3;
    if (B && (B.aus || !lebt(B.L))) { zumCss(stage); return false; }
    if (!B) {
      let L = null;
      if (alt) { L = alt._b3.L; }
      L = L || ausPool() || neueLeinwand();
      if (!L) return false;
      B = stage._b3 = { L: L, neu: true, cam: null, stufe: GSTUFE, schwing: { t: 0, a: 0, b: 0, k: 0 }, sicht: true, zuletzt: 0, picks: [], items: null };
      if (alt) { erben(alt, stage, B); const A = alt._b3; BUEHNEN.delete(alt); if (A.mo) A.mo.disconnect(); if (A.io) A.io.disconnect(); if (A.ro) A.ro.disconnect(); alt._b3 = null; }
      stage.insertBefore(L.cv, stage.querySelector('.w3d-cam'));
      stage.classList.add('gl');
      BUEHNEN.add(stage);
      /* Neu gelesen wird nur, wenn sich das Modell ändert: Flächen in .w3d-world (ohne Maßlinien), die Bühne selbst (außer Kamera)
         oder ein neues Modell. Knöpfe, Hinweis, Maßfeld und Schilder neben dem Modell lösten sonst bei jeder Bewegung ein volles
         Neulesen samt Schattenkarte aus (Verschieben im Zoom, Drehen beim Messen) */
      const modell = (n) => n.nodeType === 1 && (n.matches('.w3d-cam, .w3d-sway, .w3d-world') || !!n.querySelector('.w3d-world'));
      B.mo = new MutationObserver((rs) => {
        let neu = false;
        const welt = stage.querySelector('.w3d-world');
        for (const r of rs) {
          const t = r.target; if (t === B.camEl || t === B.swayEl || t === L.cv) continue;
          if (t === stage) {
            if (r.type === 'attributes') { if (nurKamera(r, stage)) continue; neu = true; break; }
            if (Array.prototype.some.call(r.addedNodes, modell) || Array.prototype.some.call(r.removedNodes, modell)) { neu = true; break; }
            continue;
          }
          if (!welt || !welt.contains(t) || (t.closest && t.closest('.w3d-dim'))) continue;
          neu = true; break;
        }
        if (neu) B.neu = true;
        if (!raf) raf = requestAnimationFrame(bild);
      });
      B.mo.observe(stage, { subtree: true, attributes: true, attributeFilter: ['style', 'class'], attributeOldValue: true, childList: true });
      if (window.IntersectionObserver) { B.io = new IntersectionObserver((es) => { es.forEach((e) => { B.sicht = e.isIntersecting; }); if (B.sicht) anstoss(stage); }); B.io.observe(stage); }
      /* Größe und Pixeldichte (Zoom, anderer Bildschirm): neu zeichnen, die Leinwand passt sich in zeichnen() an */
      if (window.ResizeObserver) { B.ro = new ResizeObserver(() => { if (!raf) raf = requestAnimationFrame(bild); }); try { B.ro.observe(stage, { box: 'device-pixel-content-box' }); } catch (e) { B.ro.observe(stage); } }
    } else if (B.L.cv.parentNode !== stage) stage.insertBefore(B.L.cv, stage.querySelector('.w3d-cam'));
    /* wiederverwendete Bühne: render() setzt die Klassen neu */
    stage.classList.add('gl');
    anstoss(stage);
    return true;
  }
  /* zurück zum CSS-Modell: Klasse weg, Kamera und Schwingen wieder dem CSS überlassen */
  /* Änderung nur an der Kamera: Stil der Bühne ohne --rx/--ry gleich, Klassen ohne Ziehen, Leben und Beschäftigt gleich */
  const ohneKam = (v) => String(v || '').replace(/--(r[xy]|pan[xy])\s*:[^;]*;?/g, '').replace(/\s+/g, ' ').trim();
  const NUR_KAM = { 'is-drag': 1, 'is-live': 1, 'is-busy': 1, 'is-zoom': 1, 'mit-eins': 1, 'is-pinch': 1, 'is-zooming': 1, 'is-zoomanim': 1 };
  const ohneKl = (v) => String(v || '').split(/\s+/).filter((k) => k && !NUR_KAM[k]).sort().join(' ');
  function nurKamera(r, stage) {
    if (r.attributeName === 'style') return ohneKam(r.oldValue) === ohneKam(stage.getAttribute('style'));
    if (r.attributeName === 'class') return ohneKl(r.oldValue) === ohneKl(stage.className);
    return false;
  }
  function zumCss(stage) {
    stage.classList.remove('gl');
    ['.w3d-cam', '.w3d-sway'].forEach((s2) => { const e = stage.querySelector(s2); if (e) { e.style.transform = ''; e._t = null; } });
  }
  function freigeben(stage) {
    const B = stage._b3; if (!B) return;
    BUEHNEN.delete(stage); if (B.mo) B.mo.disconnect(); if (B.io) B.io.disconnect(); if (B.ro) B.ro.disconnect();
    if (B.L.cv.parentNode) B.L.cv.parentNode.removeChild(B.L.cv);
    /* im Vorrat ohne großen Bildspeicher */
    if (lebt(B.L) && POOL.length < 3) { B.L.cv.width = 1; B.L.cv.height = 1; POOL.push(B.L); } else { const x = B.L.gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }
    stage._b3 = null; zumCss(stage);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) BUEHNEN.forEach(anstoss); });
  function bild(now) {
    raf = 0;
    let weiter = false;
    BUEHNEN.forEach((stage) => {
      if (!stage.isConnected) { freigeben(stage); return; }
      const B = stage._b3; if (!B || B.aus) return;
      if (!lebt(B.L)) { if (!B.L.verloren) { B.L.verloren = true; zumCss(stage); } return; }
      if (document.hidden || !B.sicht) return;
      /* Nur das Schwingen läuft: halbe Bildrate genügt (auf langsamen Geräten weniger) */
      if (!B.neu && B.nurSchwingen && now - B.zuletzt < (B.stufe ? 50 : 30)) { weiter = true; return; }
      /* Regler: Bilder einer laufenden Bewegung (Ziehen, Zoomen, Übergang) dauern zu lange, 20 über 50 ms hintereinander: in Bewegung
         eine Stufe gröber (Pixeldichte 1,5, dann 1,25 ohne Schatten). 90 schnelle Bilder (unter 30 ms) holen eine Stufe zurück.
         Nur das Schwingen zählt nicht: ist es langsam, hört es auf. Pausen (Tab im Hintergrund) zählen nicht. Steht das Bild,
         wird es einmal scharf gezeichnet (B.scharf), so wirkt eine grobe Stufe nur, solange sich etwas bewegt */
      if (B.fort && !B.neu && !VOLL) {
        const dt = now - B.zuletzt;
        if (dt < 2000) {
          if (B.nurSchwingen) { B.langsamS = dt > 70 ? (B.langsamS || 0) + 1 : 0; if (B.langsamS > 24) B.schwing.aus = true; }
          else {
            B.langsam = dt > 50 ? (B.langsam || 0) + 1 : 0; B.schnell = dt < 30 ? (B.schnell || 0) + 1 : 0;
            if (B.langsam >= 20 && B.stufe < 2) { B.langsam = 0; B.stufe++; GSTUFE = B.stufe; }
            if (B.schnell >= 90 && B.stufe > 0) { B.schnell = 0; B.stufe--; GSTUFE = B.stufe; }
          }
        }
      }
      const lauf = zeichnen(stage, B, now);
      if (B.zuletzt && B.fort) B.dt = now - B.zuletzt;
      B.neu = false; B.zuletzt = now; B.fort = !!lauf;
      infoZeigen(stage, B, now);
      if (lauf) { weiter = true; B.scharf = false; } else if (!B.scharf && (B.stufe > 0 || (window.devicePixelRatio || 1) > STUFE_DPR[0])) { B.scharf = true; weiter = true; }
    });
    if (weiter && !raf) raf = requestAnimationFrame(bild);
  }

  /* ---------- Übergänge ---------- */
  function rotListe(r) { const o = []; String(r || '').replace(/(rotate[XYZ])\((-?[\d.e]+)deg\)/g, (m, a, d) => { o.push([a, parseFloat(d)]); return m; }); return o; }
  function umrissMischen(a, b, t) {
    if (!a || !b || a.t !== b.t) return b;
    const pm = (p, q) => (p && q && p.length === q.length ? p.map((x, i) => [lerp(x[0], q[i][0], t), lerp(x[1], q[i][1], t)]) : q);
    if (b.t === 'hole') return { t: 'hole', r: a.r.map((v, i) => lerp(v, b.r[i], t)) };
    if (b.t === 'ring') return { t: 'ring', o: pm(a.o, b.o), i: pm(a.i, b.i) };
    return { t: b.t, p: pm(a.p, b.p) };
  }
  function flaecheMischen(a, b, t) {
    const r = a._rl && b._rl && a._rl.length === b._rl.length && a._rl.every((x, i) => x[0] === b._rl[i][0]) ? b._rl.map((x, i) => [x[0], lerp(a._rl[i][1], x[1], t)]) : b._rl;
    return { W: lerp(a.W, b.W, t), H: lerp(a.H, b.H, t), x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t), o: b.o, _rl: r, c: umrissMischen(a.c, b.c, t) };
  }
  /* Ziel (spec) mit Übergang zt = { d: Dauer ms, k: Kurve, v: Verzögerung ms }; n = sofort. Der Übergang behält die Zeiten, mit
     denen er begann (wie CSS: eine später entfernte Klasse wie is-fahrt verkürzt keine laufende Fahrt) */
  function spur(el, feld, ziel, now, zt, mischen, B) {
    const k = '_t' + feld;
    let s = el[k];
    if (!s) { el[k] = { ziel: ziel, von: null, jetzt: ziel, t0: now, zt: zt }; return ziel; }
    if (s.ziel !== ziel) { s.von = !s.erbe && ((ziel && ziel.n) || B.sofort) ? null : s.jetzt; s.ziel = ziel; s.t0 = now; s.erbe = false; s.zt = zt; }
    if (!s.von || !ziel) { s.jetzt = ziel; return ziel; }
    const z = s.zt || T_FORM, f = (now - s.t0 - (z.v || 0)) / z.d;
    if (f >= 1) { s.von = null; s.jetzt = ziel; return ziel; }
    B.laeuft = true;
    s.jetzt = mischen(s.von, ziel, z.k(Math.max(0, f)));
    return s.jetzt;
  }
  const zahlMischen = (a, b, t) => lerp(a, b, t);
  function wert(el, feld, ziel, now, dauer, kurve, B) {
    const k = '_w' + feld;
    let s = el[k];
    if (!s) { el[k] = { ziel: ziel, von: ziel, t0: now, jetzt: ziel }; return ziel; }
    if (s.ziel !== ziel) { s.von = B.sofort && !s.erbe ? ziel : s.jetzt; s.ziel = ziel; s.t0 = now; s.erbe = false; }
    if (s.von === ziel) { s.jetzt = ziel; return ziel; }
    const f = (now - s.t0) / dauer;
    if (f >= 1) { s.von = ziel; s.jetzt = ziel; return ziel; }
    B.laeuft = true;
    s.jetzt = lerp(s.von, ziel, kurve(Math.max(0, f)));
    return s.jetzt;
  }

  /* ---------- Dreiecke aus dem Umriss (örtliche Pixel der Fläche) ---------- */
  function rechteck(o, x1, y1, x2, y2) { if (x2 - x1 <= 0 || y2 - y1 <= 0) return; o.push(x1, y1, x2, y1, x2, y2, x1, y1, x2, y2, x1, y2); }
  /* Lückenlos: jede Kante gehört ganz zu genau zwei Dreiecken (keine T-Stöße, sonst blitzen Pixel in Verlängerung der Kanten) */
  function dreiecke(c, W, H, ext) {
    const o = [], e = typeof ext === 'object' && ext ? ext : { x: ext || 0, o: ext || 0, u: ext || 0 };
    const x0 = -e.x, y0 = -e.o, x1 = W + e.x, y1 = H + e.u;
    const quad = (a, b, cc, d) => o.push(a[0], a[1], b[0], b[1], cc[0], cc[1], a[0], a[1], cc[0], cc[1], d[0], d[1]);
    const ring = (A, I) => { const n = Math.min(A.length, I.length); for (let k = 0; k < n; k++) { const j = (k + 1) % n; quad(A[k], A[j], I[j], I[k]); } };
    if (!c) { quad([x0, y0], [x1, y0], [x1, y1], [x0, y1]); return o; }
    if (c.t === 'hole') {
      const r = c.r, a = Math.max(r[0], x0), b = Math.max(r[1], y0), cc = Math.min(r[2], x1), d = Math.min(r[3], y1);
      if (cc - a <= 0 || d - b <= 0) { quad([x0, y0], [x1, y0], [x1, y1], [x0, y1]); return o; }
      ring([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], [[a, b], [cc, b], [cc, d], [a, d]]);
      return o;
    }
    /* Formen: genau die Fläche, die clip-path (evenodd) füllt; Formschnitte haben flache Läufe und Spitzen ohne Fläche */
    if (c.t === 'ring') { const A = sauber(c.o), I = sauber(c.i); if (A.length < 3) return o; ohr(I.length >= 3 ? brueckeLoch(A, I) : A, o); return o; }
    if (c.t === 'poly') { const A = sauber(c.p); if (A.length >= 3) ohr(A, o); return o; }
    if (c.t === 'wand') {
      /* Kasten mit konvexer Öffnung: über und unter der Öffnung senkrecht auf den Rand gezogen, links und rechts Bänder,
         die an jedem Punkt der Öffnung auf ihrer Kante unterteilt sind */
      const p = c.p, n = p.length; let li = 0, re = 0;
      p.forEach((q, i) => { if (q[0] < p[li][0]) li = i; if (q[0] > p[re][0]) re = i; });
      const kette = (von, bis) => { const k = []; for (let i = von; ; i = (i + 1) % n) { k.push(p[i]); if (i === bis) break; } return k; };
      let A = kette(li, re), Bk = kette(re, li).reverse();
      if (A.reduce((s2, q) => s2 + q[1], 0) / A.length > Bk.reduce((s2, q) => s2 + q[1], 0) / Bk.length) { const t = A; A = Bk; Bk = t; }
      for (let k = 0; k < A.length - 1; k++) { const a = A[k], b = A[k + 1]; quad([a[0], y0], [b[0], y0], b, a); }
      for (let k = 0; k < Bk.length - 1; k++) { const a = Bk[k], b = Bk[k + 1]; quad(a, b, [b[0], y1], [a[0], y1]); }
      const seite = (xs, xa, links) => {
        const ys = [y0, y1]; p.forEach((q) => { if (Math.abs(q[0] - xs) < 1e-6) ys.push(q[1]); }); ys.sort((u, v) => u - v);
        for (let k = 0; k < ys.length - 1; k++) { if (ys[k + 1] - ys[k] <= 0) continue; if (links) quad([xa, ys[k]], [xs, ys[k]], [xs, ys[k + 1]], [xa, ys[k + 1]]); else quad([xs, ys[k]], [xa, ys[k]], [xa, ys[k + 1]], [xs, ys[k + 1]]); }
      };
      seite(p[li][0], x0, true); seite(p[re][0], x1, false);
      return o;
    }
    quad([x0, y0], [x1, y0], [x1, y1], [x0, y1]); return o;
  }
  /* ---------- Vielecke: säubern, Loch anbinden, in Ohren zerlegen, an konvexem Umriss abschneiden ---------- */
  const flaeche2 = (p) => { let A = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; A += a[0] * b[1] - b[0] * a[1]; } return A / 2; };
  const kreuz = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  /* doppelte Punkte und Umkehrspitzen (der Umriss läuft auf derselben Linie zurück) entfernen */
  function sauber(p) {
    let q = [];
    p.forEach((v) => { const l = q[q.length - 1]; if (!l || Math.abs(l[0] - v[0]) > 1e-4 || Math.abs(l[1] - v[1]) > 1e-4) q.push(v); });
    while (q.length > 1 && Math.abs(q[0][0] - q[q.length - 1][0]) < 1e-4 && Math.abs(q[0][1] - q[q.length - 1][1]) < 1e-4) q.pop();
    for (let weiter = true, n = 0; weiter && q.length > 3 && n < 200; n++) {
      weiter = false;
      for (let i = 0; i < q.length && q.length > 3; i++) {
        const a = q[(i - 1 + q.length) % q.length], b = q[i], c = q[(i + 1) % q.length];
        const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1];
        if (Math.abs(ux * vy - uy * vx) <= 1e-6 * (Math.hypot(ux, uy) * Math.hypot(vx, vy) + 1e-9) && ux * vx + uy * vy <= 0) { q.splice(i, 1); weiter = true; i--; }
      }
    }
    return q;
  }
  const schneidet = (a, b, c, d) => { const d1 = kreuz(c, d, a), d2 = kreuz(c, d, b), d3 = kreuz(a, b, c), d4 = kreuz(a, b, d); return ((d1 > 1e-9 && d2 < -1e-9) || (d1 < -1e-9 && d2 > 1e-9)) && ((d3 > 1e-9 && d4 < -1e-9) || (d3 < -1e-9 && d4 > 1e-9)); };
  /* Loch über eine Brücke zum nächsten sichtbaren Außenpunkt in den Umriss einfügen (ein Vieleck ohne Loch) */
  function brueckeLoch(A, I) {
    A = flaeche2(A) < 0 ? A.slice().reverse() : A.slice(); I = flaeche2(I) > 0 ? I.slice().reverse() : I.slice();
    let best = null;
    for (let h = 0; h < I.length; h++) for (let a = 0; a < A.length; a++) {
      const d = Math.hypot(A[a][0] - I[h][0], A[a][1] - I[h][1]); if (best && d >= best.d) continue;
      let frei = true;
      for (let k = 0; k < A.length && frei; k++) { const p = A[k], q = A[(k + 1) % A.length]; if (k === a || (k + 1) % A.length === a) continue; if (schneidet(I[h], A[a], p, q)) frei = false; }
      for (let k = 0; k < I.length && frei; k++) { const p = I[k], q = I[(k + 1) % I.length]; if (k === h || (k + 1) % I.length === h) continue; if (schneidet(I[h], A[a], p, q)) frei = false; }
      if (frei) best = { a: a, h: h, d: d };
    }
    if (!best) return A;
    const o = A.slice(0, best.a + 1);
    for (let k = 0; k <= I.length; k++) o.push(I[(best.h + k) % I.length]);
    o.push(A[best.a]);
    return o.concat(A.slice(best.a + 1));
  }
  /* Ohren abschneiden; Brückenpunkte kommen doppelt vor und zählen nicht als „innen“ */
  function ohr(p, o) {
    let q = flaeche2(p) < 0 ? p.slice().reverse() : p.slice();
    const gleich = (u, v) => Math.abs(u[0] - v[0]) < 1e-6 && Math.abs(u[1] - v[1]) < 1e-6;
    let schutz = q.length * q.length + 10;
    while (q.length > 3 && schutz-- > 0) {
      let ab = false;
      for (let i = 0; i < q.length; i++) {
        const a = q[(i - 1 + q.length) % q.length], b = q[i], c = q[(i + 1) % q.length];
        if (kreuz(a, b, c) <= 1e-9) continue;
        let leer = true;
        for (let k = 0; k < q.length && leer; k++) {
          const v = q[k]; if (gleich(v, a) || gleich(v, b) || gleich(v, c)) continue;
          if (kreuz(a, b, v) >= -1e-9 && kreuz(b, c, v) >= -1e-9 && kreuz(c, a, v) >= -1e-9) leer = false;
        }
        if (!leer) continue;
        o.push(a[0], a[1], b[0], b[1], c[0], c[1]); q.splice(i, 1); ab = true; break;
      }
      /* nur noch flache Ohren (Rundung): den flachsten Punkt entfernen */
      if (!ab) { let m = 0, mv = Infinity; for (let i = 0; i < q.length; i++) { const v = Math.abs(kreuz(q[(i - 1 + q.length) % q.length], q[i], q[(i + 1) % q.length])); if (v < mv) { mv = v; m = i; } } q.splice(m, 1); }
    }
    if (q.length === 3 && kreuz(q[0], q[1], q[2]) > 1e-9) o.push(q[0][0], q[0][1], q[1][0], q[1][1], q[2][0], q[2][1]);
  }
  /* Sutherland–Hodgman: Vieleck an einem konvexen Umriss abschneiden */
  function klipp(p, K) {
    const sg = flaeche2(K) >= 0 ? 1 : -1;
    let o = p;
    for (let k = 0; k < K.length && o.length; k++) {
      const a = K[k], b = K[(k + 1) % K.length], ein = o, n = [];
      const innen = (v) => sg * kreuz(a, b, v) >= -1e-9;
      for (let i = 0; i < ein.length; i++) {
        const P = ein[i], Q = ein[(i + 1) % ein.length], iP = innen(P), iQ = innen(Q);
        if (iP) n.push(P);
        if (iP !== iQ) { const dp = kreuz(a, b, P), dq = kreuz(a, b, Q), t = dp / (dp - dq); n.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]); }
      }
      o = n;
    }
    return o;
  }
  /* Dreiecksliste (x, y, …) am konvexen Umriss K abschneiden */
  function klippDreiecke(tri, K) {
    const o = [];
    for (let i = 0; i + 5 < tri.length; i += 6) {
      const p = klipp([[tri[i], tri[i + 1]], [tri[i + 2], tri[i + 3]], [tri[i + 4], tri[i + 5]]], K);
      for (let k = 1; k + 1 < p.length; k++) o.push(p[0][0], p[0][1], p[k][0], p[k][1], p[k + 1][0], p[k + 1][1]);
    }
    return o;
  }
  /* Wandöffnung um einen Hauch kleiner, Laibung um einen Hauch tiefer: so überlappen sich die Kanten statt zu stoßen. Unten liegt
     die Fensterbank genau auf der Lochkante: dort wird das Loch um den Hauch weiter, sonst steht ein Wandstreifen als Grat auf der
     Bank (von oben ein flimmernder Strich) */
  const HAUCH = 0.6;
  function enger(c, bank) {
    if (!c) return c;
    if (c.t === 'hole') return { t: 'hole', r: [c.r[0] + HAUCH, c.r[1] + HAUCH, c.r[2] - HAUCH, c.r[3] + (bank ? HAUCH : -HAUCH)] };
    if (c.t === 'wand') {
      let cx = 0, cy = 0, yu = -Infinity; c.p.forEach((q) => { cx += q[0]; cy += q[1]; yu = Math.max(yu, q[1]); }); cx /= c.p.length; cy /= c.p.length;
      return { t: 'wand', p: c.p.map((q) => { const dx = cx - q[0], dy = cy - q[1], l = Math.hypot(dx, dy) || 1; return bank && q[1] > yu - 0.01 ? [q[0] + dx / l * HAUCH, q[1] + HAUCH] : [q[0] + dx / l * HAUCH, q[1] + dy / l * HAUCH]; }) };
    }
    return c;
  }
  /* Teile in der Rahmenöffnung liegen in einer Ebene mit ihren Nachbarn (Flügel neben Pfosten, Oberlicht am Blendrahmen).
     Stoßen sie nur Kante an Kante, blitzt durch Rundungsfehler der Hintergrund als Punktlinie durch. Darum ragt jedes Teil
     einen Hauch über seine Nachbarn und liegt eine Stufe davor: Blendrahmen 0, Ober- und Unterlicht 1, Kämpfer 2, Pfosten 3, Flügel 4 */
  const stufe = (role) => (/^sf-(in|out)-/.test(role) ? 4 : /^mulb?-/.test(role) ? 3 : /^kfu?b?$/.test(role) ? 2 : /^(ol|ul)-(front|back)$/.test(role) ? 1 : 0);
  function aufweiten(p, k) {
    const n = p.length; if (n < 3) return p;
    let A = 0; for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; A += a[0] * b[1] - b[0] * a[1]; }
    const sg = A >= 0 ? 1 : -1, nr = [];
    for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); nr.push(l > 1e-6 ? [sg * dy / l, -sg * dx / l] : null); }
    return p.map((q, i) => {
      let m1 = nr[(i - 1 + n) % n], m2 = nr[i]; if (!m1) m1 = m2; if (!m2) m2 = m1; if (!m1) return q;
      const d = 1 + m1[0] * m2[0] + m1[1] * m2[1]; if (d < 0.2) return q;
      return [q[0] + (m1[0] + m2[0]) / d * k, q[1] + (m1[1] + m2[1]) / d * k];
    });
  }
  /* Formen: der Umriss von Flügel und Oberlicht ist anders abgetastet als der Rahmen (Sehnen bis gut 1 px daneben), daher weiter */
  function aufgeweitet(c) {
    if (c && c.t === 'ring') return { t: 'ring', o: aufweiten(sauber(c.o), 2 * HAUCH), i: c.i };
    if (c && c.t === 'poly') return { t: 'poly', p: aufweiten(sauber(c.p), 2 * HAUCH) };
    return c;
  }
  /* Fuge: Außenrand von der Laibung abgerückt, damit er nie mit ihr um dieselben Pixel ringt */
  function abgerueckt(c, W, H) {
    if (!c) return { tri: dreiecke(null, W, H, { x: -HAUCH, o: -HAUCH, u: -HAUCH }) };
    if (c.t === 'hole') return { tri: dreiecke(c, W, H, { x: -HAUCH, o: -HAUCH, u: -HAUCH }) };
    if (c.t === 'ring') { const o = c.o.map((q, k) => { const i = c.i[k] || q, dx = i[0] - q[0], dy = i[1] - q[1], l = Math.hypot(dx, dy); return l > HAUCH * 2 ? [q[0] + dx / l * HAUCH, q[1] + dy / l * HAUCH] : q; }); return { tri: dreiecke({ t: 'ring', o: o, i: c.i }, W, H, 0) }; }
    return { tri: dreiecke(c, W, H, 0) };
  }
  /* Linienzug als Band (Symbole, Auswahlring): Breite b in örtlichen Pixeln, gestrichelt mit [an, aus] */
  function band(o, pts, b, zu, strich) {
    const h = b / 2, n = pts.length, m = zu ? n : n - 1;
    const seg = (a, c) => {
      const dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy); if (l < 1e-6) return;
      const nx = -dy / l * h, ny = dx / l * h, ex = dx / l * h, ey = dy / l * h;
      const s = (p, q) => { const ax = p[0] - ex, ay = p[1] - ey, bx = q[0] + ex, by = q[1] + ey; o.push(ax + nx, ay + ny, bx + nx, by + ny, bx - nx, by - ny, ax + nx, ay + ny, bx - nx, by - ny, ax - nx, ay - ny); };
      if (!strich) { s(a, c); return; }
      let t = 0; const per = strich[0] + strich[1];
      while (t < l) { const e = Math.min(l, t + strich[0]); s([a[0] + dx * t / l, a[1] + dy * t / l], [a[0] + dx * e / l, a[1] + dy * e / l]); t += per; }
    };
    for (let k = 0; k < m; k++) seg(pts[k], pts[(k + 1) % n]);
  }
  /* SVG-Pfad der Öffnungssymbole (M, L, H, V; absolut) */
  function pfade(svg, W, H) {
    const o = [];
    svg.querySelectorAll('path').forEach((pa) => {
      const d = pa.getAttribute('d') || '', da = pa.getAttribute('stroke-dasharray'), pts = [];
      let x = 0, y = 0;
      d.replace(/([MLHV])([^MLHV]*)/g, (m, c, a) => {
        const v = a.trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);
        if (c === 'M' || c === 'L') { for (let i = 0; i + 1 < v.length; i += 2) { if (c === 'M' && i === 0 && pts.length) { o.push({ p: pts.splice(0), da: da }); } x = v[i]; y = v[i + 1]; pts.push([x * W / 100, y * H / 100]); } }
        else if (c === 'H') { x = v[0]; pts.push([x * W / 100, y * H / 100]); }
        else if (c === 'V') { y = v[0]; pts.push([x * W / 100, y * H / 100]); }
        return m;
      });
      if (pts.length) o.push({ p: pts, da: da });
    });
    return o;
  }

  /* ---------- Stoffe: Hintergrund je Fläche, Kante (inset box-shadow), Rundung, Glanz ---------- */
  /* Putz als Grundfarbe; Licht und Verschattung machen die Tiefe (das CSS-Modell malte sie in Verläufe) */
  const PUTZ = 'linear-gradient(180deg, #ece7df, #e3ddd3)';
  const KLASSE = {
    'w3d-wall-in': 'radial-gradient(ellipse at 50% 42%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, .06) 100%), linear-gradient(180deg, #e7dfd2, #ddd4c6)',
    'w3d-rev': PUTZ, 'w3d-rs': PUTZ,
    'w3d-fuge': 'linear-gradient(180deg, #8e8578, #7f7669)',
    'w3d-glass': 'linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .42) 34%, transparent 50%), linear-gradient(135deg, rgba(205, 225, 245, .62) 0%, rgba(160, 196, 230, .52) 48%, rgba(226, 238, 250, .68) 100%)',
    /* Türen: hinter dem Glas liegt die Terrasse; leichter getönt, damit man sie durch die Scheibe sieht */
    'glas-tuer': 'linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .34) 34%, transparent 50%), linear-gradient(135deg, rgba(205, 225, 245, .32) 0%, rgba(160, 196, 230, .24) 48%, rgba(226, 238, 250, .38) 100%)',
    'glas-sonne': 'linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .42) 33%, transparent 48%), linear-gradient(135deg, rgba(118, 146, 170, .78) 0%, rgba(84, 112, 140, .72) 48%, rgba(146, 170, 192, .78) 100%)',
    'w3d-scheibe': 'linear-gradient(135deg, rgba(225, 238, 250, .1), rgba(195, 218, 240, .06))', 'scheibe-sicht': 'rgba(225, 235, 245, .3)',
    'w3d-pilz': 'radial-gradient(circle at 35% 30%, #ffffff 0 18%, #c9ced3 40%, #7d838a 78%)',
    'w3d-roll': 'linear-gradient(180deg, #ededeb, #d2d2cf)', 'w3d-roll-b': '#c9c9c6', 'w3d-roll-t': '#f1f1ef', 'w3d-roll-s': '#d9d9d6',
    'w3d-schw': 'linear-gradient(180deg, #d9dde1, #aeb4ba)', 'w3d-schw-t': 'repeating-linear-gradient(90deg, rgba(255, 255, 255, .18) 0 1px, transparent 1px 4px), linear-gradient(180deg, #e3e6e9, #c3c8cd)',
    'w3d-floor-in': 'repeating-linear-gradient(90deg, rgba(0, 0, 0, .16) 0 1px, transparent 1px 34px), linear-gradient(180deg, #5b4b3b, #4a3c2f)',
    /* Terrasse heller als im CSS-Modell: durch die Tür sieht man Tageslicht statt einer dunklen Fläche */
    'w3d-floor-out': 'repeating-linear-gradient(90deg, rgba(60, 56, 50, .22) 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, rgba(60, 56, 50, .22) 0 1px, transparent 1px 48px), linear-gradient(180deg, #a19c93, #918c83)',
    'w3d-mesh': 'repeating-linear-gradient(0deg, rgba(20, 20, 20, .16) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(20, 20, 20, .16) 0 1px, transparent 1px 4px)',
    /* Extraklar: kaum Grünstich, heller; Vogelschutz: feines Punktraster auf der Außenseite */
    'glas-klar': 'linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .46) 34%, transparent 50%), linear-gradient(135deg, rgba(222, 236, 250, .5) 0%, rgba(188, 214, 240, .4) 48%, rgba(236, 244, 252, .56) 100%)',
    'glas-vogel': 'radial-gradient(circle, rgba(255, 255, 255, .5) 0 1px, transparent 1.4px) 0 0 / 9px 9px, linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .42) 34%, transparent 50%), linear-gradient(135deg, rgba(205, 225, 245, .62) 0%, rgba(160, 196, 230, .52) 48%, rgba(226, 238, 250, .68) 100%)',
    'schloss': 'radial-gradient(circle at 50% 50%, #e9ecef 0 22%, #3a3e43 26%)'
    /* Oberlichtöffner, Bedienung innen, Aufzugbänder, Stopfen, Druckknopf und Schließzylinder: Farbe inline aus app.js (_bg) */
  };
  /* Messen im Raum (.raum-licht, app.css): dunkle Wand und Laibung, das Glas hell vom Tageslicht; die Tiefe macht das Licht */
  const RAUM = {
    'w3d-wall-in': 'linear-gradient(180deg, #141414, #161615 50%, #141414)', // so dunkel wie der Grund: die Bühne hat keine Kante
    putz: 'linear-gradient(180deg, #3a3936, #2e2d2b)',
    'w3d-fuge': 'linear-gradient(180deg, #4a4741, #3e3b36)',
    glas: 'linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .3) 34%, transparent 50%), linear-gradient(160deg, rgba(238, 237, 230, .97) 0%, rgba(221, 219, 209, .96) 58%, rgba(199, 196, 184, .95) 100%)',
    'glas-tuer': 'linear-gradient(104deg, transparent 18%, rgba(255, 255, 255, .26) 34%, transparent 50%), linear-gradient(160deg, rgba(238, 237, 230, .5) 0%, rgba(221, 219, 209, .44) 58%, rgba(199, 196, 184, .5) 100%)',
    'w3d-floor-in': 'repeating-linear-gradient(90deg, rgba(0, 0, 0, .2) 0 1px, transparent 1px 34px), linear-gradient(180deg, #2c2722, #221e1a)'
  };
  /* Kante innen wie box-shadow: inset 0 0 0 Bpx Farbe */
  const KANTE = { 'w3d-frame': [1, 'rgba(0, 0, 0, .16)'], 'w3d-side': [1, 'rgba(0, 0, 0, .14)'], 'w3d-glass': [1, 'rgba(0, 0, 0, .2)'], 'w3d-scheibe': [1.5, 'rgba(55, 62, 70, .42)'], 'w3d-sill': [1, 'rgba(0, 0, 0, .08)'], 'w3d-roll': [1, 'rgba(0, 0, 0, .2)'], 'w3d-behang': [1, 'rgba(0, 0, 0, .18)'], 'w3d-behang-u': [1, 'rgba(0, 0, 0, .25)'], 'w3d-innen': [1, 'rgba(0, 0, 0, .1)'], 'w3d-innen-k': [1, 'rgba(0, 0, 0, .18)'], 'w3d-paneel': [1, 'rgba(0, 0, 0, .18)'], 'w3d-schw': [1, 'rgba(0, 0, 0, .22)'], 'w3d-mesh': [1.5, 'rgba(85, 88, 92, 1)'], 'w3d-leiste': [1, 'rgba(0, 0, 0, .12)'], 'w3d-solar': [1, 'rgba(0, 0, 0, .45)'], 'w3d-klappladen': [1, 'rgba(0, 0, 0, .28)'], 'w3d-band': [1, 'rgba(0, 0, 0, .22)'], 'w3d-handle': [1, 'rgba(0, 0, 0, .2)'], 'w3d-griffa': [1, 'rgba(0, 0, 0, .2)'], 'w3d-pilz': [1, 'rgba(20, 20, 20, .45)'], 'schloss': [1, 'rgba(0, 0, 0, .4)'],
    /* Teile aus dem CSS-Modell (S3): Lamellen, Führungsschienen, Aufzugbänder, Rosette, Oberlichtöffner, Bedienung, Kleinteile am Griff */
    'w3d-lam': [1, 'rgba(0, 0, 0, .22)'], 'w3d-fs': [1, 'rgba(0, 0, 0, .24)'], 'w3d-aufzug': [0.5, 'rgba(0, 0, 0, .25)'], 'w3d-ros': [1, 'rgba(0, 0, 0, .3)'], 'w3d-olr': [0.5, 'rgba(0, 0, 0, .3)'], 'w3d-olh': [1, 'rgba(0, 0, 0, .3)'],
    'w3d-an-wickler': [1, 'rgba(0, 0, 0, .22)'], 'w3d-an-gurt': [0.5, 'rgba(0, 0, 0, .15)'], 'w3d-an-stange': [0.5, 'rgba(0, 0, 0, .35)'], 'w3d-an-kurbel': [0.5, 'rgba(0, 0, 0, .35)'], 'w3d-an-taster': [1, 'rgba(0, 0, 0, .25)'], 'w3d-an-wippe': [1, 'rgba(0, 0, 0, .18)'], 'w3d-an-funk': [0.8, 'rgba(255, 255, 255, 1)'],
    'w3d-hknopf': [1, 'rgba(0, 0, 0, .4)'], 'w3d-hschloss': [1, 'rgba(0, 0, 0, .4)'], 'w3d-stopfen': [0.5, 'rgba(0, 0, 0, .3)'] };
  const GLANZ = { 'w3d-solar': [0.45, 60], 'w3d-band': [0.26, 24], alu: [0.22, 22], granit: [0.14, 30], 'w3d-glass': [0.55, 70], 'w3d-scheibe': [0.25, 70], 'w3d-handle': [0.32, 26], 'w3d-griffa': [0.32, 26], 'w3d-pilz': [0.4, 30], 'schloss': [0.4, 30], 'w3d-schw': [0.18, 18], 'w3d-schw-t': [0.18, 18], 'w3d-sill': [0.08, 16], 'w3d-roll': [0.1, 16], 'w3d-frame': [0.16, 40], 'w3d-side': [0.1, 30],
    /* Sonnenschutz: Aluminium der Lamellen, Schienen und Endschiene glänzt deutlicher, der Panzer matt */
    'w3d-lam': [0.3, 26], 'w3d-fs': [0.2, 22], 'w3d-behang-u': [0.2, 20], 'w3d-behang': [0.1, 16], 'w3d-aufzug': [0.03, 8], 'w3d-ros': [0.32, 26], 'w3d-olr': [0.3, 24], 'w3d-olh': [0.32, 26], 'w3d-an-stange': [0.3, 24], 'w3d-an-kurbel': [0.3, 24],
    'w3d-an-wickler': [0.08, 14], 'w3d-an-taster': [0.08, 14], 'w3d-an-wippe': [0.1, 16], 'w3d-hknopf': [0.4, 30], 'w3d-hschloss': [0.4, 30], 'w3d-stopfen': [0.1, 14] };
  /* Kantenrundung je Klasse: Breite in mm (negativ: Anteil der kurzen Seite), Stärke */
  const RUNDUNG = { 'w3d-leiste': [4, 0.5], 'w3d-band': [-0.45, 0.9], 'w3d-klappladen': [6, 0.5], 'w3d-frame': [12, 0.85], 'w3d-sill': [8, 0.6], 'w3d-roll': [10, 0.55], 'w3d-schw': [6, 0.5], 'w3d-behang-u': [5, 0.6], 'w3d-innen-k': [6, 0.5], 'w3d-handle': [-0.45, 1], 'w3d-griffa': [-0.45, 1],
    'w3d-lam': [-0.3, 0.6], 'w3d-fs': [-0.3, 0.7], 'w3d-ros': [-0.4, 0.9], 'w3d-olr': [-0.45, 0.9], 'w3d-olh': [-0.45, 1], 'w3d-an-stange': [-0.45, 0.9], 'w3d-an-kurbel': [-0.45, 0.9], 'w3d-an-wickler': [-0.2, 0.6], 'w3d-an-taster': [-0.15, 0.5], 'w3d-an-wippe': [-0.1, 0.5], 'w3d-stopfen': [-0.3, 0.6] };
  const ERSTE = (el, liste) => { for (const k of liste) if (el.classList.contains(k)) return k; return ''; };
  const KLASSEN_BG = ['w3d-wall-in', 'w3d-rev', 'w3d-rs', 'w3d-fuge', 'w3d-glass', 'w3d-scheibe', 'w3d-pilz', 'w3d-roll-b', 'w3d-roll-t', 'w3d-roll-s', 'w3d-roll', 'w3d-schw-t', 'w3d-schw', 'w3d-floor-in', 'w3d-floor-out', 'w3d-mesh'];
  const KLASSEN_KANTE = ['w3d-kordel', 'w3d-glass', 'w3d-scheibe', 'w3d-mesh', 'w3d-paneel', 'w3d-side', 'w3d-frame', 'w3d-sill', 'w3d-roll', 'w3d-behang-u', 'w3d-behang', 'w3d-innen-k', 'w3d-innen', 'w3d-schw', 'w3d-handle', 'w3d-griffa', 'w3d-pilz', 'w3d-leiste', 'w3d-solar', 'w3d-klappladen', 'w3d-band',
    'w3d-lam', 'w3d-fs', 'w3d-aufzug', 'w3d-ros', 'w3d-olr', 'w3d-olh', 'w3d-an-wickler', 'w3d-an-gurt', 'w3d-an-stange', 'w3d-an-kurbel', 'w3d-an-taster', 'w3d-an-wippe', 'w3d-an-funk', 'w3d-hknopf', 'w3d-hschloss', 'w3d-stopfen'];
  const KLASSEN_GLANZ = ['w3d-glass', 'w3d-scheibe', 'w3d-handle', 'w3d-griffa', 'w3d-pilz', 'w3d-schw-t', 'w3d-schw', 'w3d-sill', 'w3d-roll', 'w3d-side', 'w3d-frame', 'w3d-solar', 'w3d-band',
    'w3d-lam', 'w3d-fs', 'w3d-behang-u', 'w3d-behang', 'w3d-aufzug', 'w3d-ros', 'w3d-olr', 'w3d-olh', 'w3d-an-stange', 'w3d-an-kurbel', 'w3d-an-wickler', 'w3d-an-taster', 'w3d-an-wippe', 'w3d-hknopf', 'w3d-hschloss', 'w3d-stopfen'];
  const STOFF = new Map();
  /* Oberflächen: Code im Shader, Stärke; Holz, Klinker und Stein ersetzen das CSS-Muster durch eine eigene Struktur in dessen Mittelfarbe */
  /* alub: gebürstetes Aluminium auf dem eigenen Verlauf der Fläche (Lamellen, Schienen, Kasten des Sonnenschutzes), alu ersetzt den Verlauf durch die Mittelfarbe */
  const ART = { putz: [1, 0.07], putzwand: [1, 0.07], putzfein: [1, 0.045], klinker: [2, 1], granit: [3, 1], holz: [4, 1], alu: [5, 1], holzfassade: [6, 1], alub: [7, 1] };
  function mittelfarbe(b) {
    if (!b.schichten.length) return b.basis.slice(0, 3);
    const L = b.schichten[b.schichten.length - 1], f = [0, 0, 0]; L.stops.forEach((x) => { for (let q = 0; q < 3; q++) f[q] += x.c[q] / L.stops.length; });
    return f;
  }
  function stoff(bg, kante, glanz, extra) {
    const key = bg + '|' + (kante || '') + '|' + (glanz || '') + '|' + (extra || '');
    let s = STOFF.get(key); if (s) return s;
    const K = kante ? KANTE[kante] : null, G = glanz ? (GLANZ[extra] || GLANZ[glanz]) : null, A = ART[extra];
    s = { bg: hintergrund(bg), kante: K ? [K[0], vormul(farbe(K[1]))] : null, glanz: G || GLANZ[extra] || [0, 1], art: A || null, rundung: RUNDUNG[kante] || null };
    if (A) s.artFarbe = mittelfarbe(s.bg);
    const U = s.bg.schichten[s.bg.schichten.length - 1]; s.luecke = s.bg.basis[3] < 0.5 && !!U && U.stops.some((x) => x.c[3] < 0.5);
    if (STOFF.size > 600) STOFF.clear();
    STOFF.set(key, s); return s;
  }
  /* Abwandlungen eines Stoffs: Profilform (Rundung der Kanten), Oberfläche (Glanz, feine Struktur), Kantenfarbe je Fläche */
  const PROFIL = { kantig: [0.45, 0.6], softline: [1.6, 1], stil: [2.2, 1.15] };
  /* metall: Eisenglimmer (DB 701 bis 703), eloxal: gebürstetes, eloxiertes Aluminium (Sonderfarben aus dem Farbblatt, app.js SONDER_OBERFL) */
  const OBERFL = { matt: { glanz: [0.012, 8] }, glatt: { glanz: [0.1, 22] }, struktur: { art: [1, 0.035] }, holz: { art: [1, 0.06], glanz: [0.02, 10] }, metall: { glanz: [0.3, 30], art: [1, 0.02] }, eloxal: { glanz: [0.26, 24], art: [5, 1] } };
  const VARIANTE = new WeakMap();
  function variante(st, pf, of, kf, ac) {
    const key = (pf || '') + '|' + (of || '') + '|' + (kf || '') + '|' + (ac || '');
    let m = VARIANTE.get(st); if (!m) { m = new Map(); VARIANTE.set(st, m); }
    let v = m.get(key); if (v) return v;
    v = Object.assign({}, st);
    if (pf && st.rundung && PROFIL[pf]) v.rundung = [st.rundung[0] * PROFIL[pf][0], st.rundung[1] * PROFIL[pf][1]];
    const O = OBERFL[of];
    if (O) { if (O.glanz) v.glanz = O.glanz; if (O.art && !st.art) { v.art = O.art; v.artFarbe = mittelfarbe(st.bg); } }
    if (kf && st.kante) v.kante = [st.kante[0], vormul(farbe(kf))];
    /* Grundton der Struktur (Klinker, Holzfassade) aus app.js (_artC) statt der Mittelfarbe des Hintergrunds */
    if (ac && v.art) { const f = farbe(ac); if (f) v.artFarbe = f.slice(0, 3); }
    m.set(key, v); return v;
  }
  /* Hintergrund einer Fläche: was app.js geschrieben hat (roh), sonst der Klassenwert */
  function flaecheStoff(el, stage) {
    const ist = (k) => el.classList.contains(k), raum = stage.classList.contains('raum-licht'), putz = raum ? RAUM.putz : PUTZ;
    let bg = '';
    if (ist('w3d-glass') && raum && !stage.classList.contains('glas-sicht') && !stage.classList.contains('glas-sonne')) bg = stage.querySelector('[data-r="floor-out"]') ? RAUM['glas-tuer'] : RAUM.glas;
    else if (ist('w3d-glass')) { const sc = stage.classList; bg = sc.contains('glas-sicht') ? (stage._orn || KLASSE['w3d-glass']) : sc.contains('glas-sonne') ? KLASSE['glas-sonne'] : sc.contains('glas-vogel') ? KLASSE['glas-vogel'] : sc.contains('glas-klar') ? KLASSE['glas-klar'] : stage.querySelector('[data-r="floor-out"]') ? KLASSE['glas-tuer'] : KLASSE['w3d-glass']; }
    else if (ist('w3d-scheibe')) bg = stage.classList.contains('glas-sicht') ? KLASSE['scheibe-sicht'] : KLASSE['w3d-scheibe'];
    else if (ist('w3d-rev') && !ist('w3d-rs')) bg = el._bg && el.getAttribute('data-r') === 'rev-b' ? el._bg : putz;
    else if (ist('w3d-rs')) bg = el._bgc === 'transparent' ? (el._bgi || 'transparent') : putz;
    else if (el._bg) bg = el._bg;
    else if (el._bgc) bg = el._bgc;
    else { const k = ERSTE(el, KLASSEN_BG); bg = k ? (raum && RAUM[k]) || KLASSE[k] : 'transparent'; }
    const role = el.getAttribute('data-r') || '';
    const art = el._art || (role === 'wall-in' ? 'putzwand' : ist('w3d-rev') ? (ist('w3d-rs') && el._bgc === 'transparent' ? '' : 'putzfein') : '');
    const kk = ERSTE(el, KLASSEN_KANTE), st = stoff(bg, kk, ERSTE(el, KLASSEN_GLANZ), art);
    const pf = kk === 'w3d-frame' ? stage._profil : '', of = kk === 'w3d-frame' || kk === 'w3d-side' ? el._oberfl || stage._oberfl : '';
    const ac = el._artC || '';
    return pf || of || el._kante || ac ? variante(st, pf, of, el._kante, ac) : st;
  }

  /* ---------- Szene lesen ---------- */
  /* transform-origin der Fläche (0 0, 50% 50% oder beliebig in % und px, z. B. die Kurbel um ihr Ende) */
  const ursprung = (o, W, H) => {
    if (!o || o === '0 0') return [0, 0]; if (o === '50% 50%') return [W / 2, H / 2];
    const v = String(o).trim().split(/\s+/), l = (t, L) => (/%$/.test(t) ? parseFloat(t) / 100 * L : parseFloat(t) || 0);
    return [l(v[0] || '0', W), l(v[1] || '50%', H)];
  };
  function flaecheMatrix(f) {
    const u = ursprung(f.o, f.W, f.H), ox = u[0], oy = u[1];
    let m = mul(T(ox, oy, 0), T(f.x, f.y, f.z));
    (f._rl || []).forEach((r) => { m = mul(m, ROT[r[0]](r[1])); });
    return mul(m, T(-ox, -oy, 0));
  }
  function spec(f) { if (f && !f._rl) f._rl = rotListe(f.r); return f; }
  const deckt = (el) => { const o = el.style.opacity; return o === '' ? 1 : parseFloat(o); };
  const istAn = (el) => el.classList;
  function lesen(stage, B, now) {
    const items = [], picks = [], world = stage.querySelector('.w3d-world');
    if (!world) return { items: items, picks: picks };
    const demo = stage.classList.contains('is-vorf') || stage.classList.contains('is-demo');
    const sym = stage.classList.contains('show-sym') ? 1 : 0;
    /* Übergänge wie in app.css: Zoom per Knopf kurz (is-zoomanim, geht vor), Lamellen wenden 0,6 s (is-wende), sonst 0,7 s.
       Das Fahren des Sonnenschutzes legt app.js bildweise und ohne Übergang (is-fahrt, _f.n), damit Endschiene und Lamellen zusammenbleiben */
    const sc = stage.classList, zoomAnim = sc.contains('is-zoomanim'), fahrt = sc.contains('is-fahrt'), wende = sc.contains('is-wende'), TF = zoomAnim ? T_ZOOM : T_FORM;
    const SOFORT = { d: 1, k: E_IO, v: 0 };
    const zeit = (c) => {
      if (zoomAnim || (!fahrt && !wende)) return TF;
      const lam = c.contains('w3d-lam');
      if (fahrt && (lam || c.contains('w3d-aufzug') || c.contains('w3d-behang') || c.contains('w3d-behang-u') || c.contains('w3d-stopfen') || c.contains('w3d-innen') || c.contains('w3d-innen-u'))) return SOFORT;
      if (wende && (lam || c.contains('w3d-aufzug'))) return T_WENDE;
      return TF;
    };
    const geh = (box, M, op, sash) => {
      for (const el of box.children) {
        const c = istAn(el);
        if (c.contains('w3d-dim') || c.contains('w3d-sym')) continue;
        if (c.contains('w3d-el')) { geh(el, M, op * wert(el, 'op', c.contains('is-hidden') ? 0 : 1, now, 600, E_EASE, B), sash); continue; }
        if (c.contains('w3d-sash')) {
          const s = el._s; if (!s) continue;
          const z = spur(el, 's', s, now, TF, (a, b, t) => ({ w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), tx: lerp(a.tx, b.tx, t), ty: lerp(a.ty, b.ty, t), tz: lerp(a.tz, b.tz, t), ox: lerp(a.ox, b.ox, t), oy: lerp(a.oy, b.oy, t) }), B);
          let Ms = mul(M, T(z.tx, z.ty, z.tz));
          if (demo || el.style.animation) {
            const cs = getComputedStyle(el), A = cssM(cs.transform);
            if (A) { const o = cssO(cs.transformOrigin); Ms = mul(Ms, mul(T(o[0], o[1], o[2]), mul(A, T(-o[0], -o[1], -o[2])))); B.laeuft = true; }
          }
          picks.push({ i: +el.getAttribute('data-sash'), M: Ms, w: z.w, h: z.h });
          geh(el, Ms, op, el);
          if (sash === null && c.contains('is-sel')) { /* Ring: unten bei w3d-selring */ }
          continue;
        }
        if (c.contains('w3d-handle')) { griff(el, M, op, sash); continue; }
        if (c.contains('w3d-griffa')) {
          const g = el._g; if (!g) continue;
          const z = spur(el, 'g', g, now, TF, (a, b, t) => ({ w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), tx: lerp(a.tx, b.tx, t), ty: lerp(a.ty, b.ty, t), tz: lerp(a.tz, b.tz, t), op: b.op }), B);
          const o2 = op * wert(el, 'op', g.op, now, 300, E_EASE, B); if (o2 <= 0.003) continue;
          /* Griff außen: Körper von der Außenseite des Flügels (5 px dahinter) bis kurz vor die Griffebene */
          const Mg = mul(M, T(z.tx, z.ty, z.tz));
          koerper(el, Mg, z.w, z.h, stoff(el._bg || '#c9ccd0', 'w3d-griffa', 'w3d-griffa'), o2, Math.min(4, z.w / 2, z.h / 2), 4.6, -1);
          /* Schließzylinder außen: eigene Fläche (app.js), vor der Griffebene */
          teile(el, Mg, o2, -1.6);
          continue;
        }
        if (c.contains('w3d-selring')) { ring(el, M, op, sash); continue; }
        if (c.contains('w3d-f')) flaeche(el, M, op, sash);
      }
    };
    const flaeche = (el, M, op, sash) => {
      const c = el.classList, f0 = spec(el._f); if (!f0) return;
      const f = spur(el, 'f', f0, now, zeit(c, el), flaecheMischen, B);
      if (f.W <= 0.01 || f.H <= 0.01) return;
      let o = op * wert(el, 'op', deckt(el), now, 400, E_EASE, B);
      let Mf = mul(M, flaecheMatrix(f));
      if (c.contains('w3d-pilz')) {
        const an = c.contains('is-on');
        if (!an) { el._pz = 0; return; }
        if (!el._pz) el._pz = now + (parseFloat(el.style.getPropertyValue('--i')) || 0) * 45 + (B.sofort ? -1000 : 0);
        const k = Math.max(0, Math.min(1, (now - el._pz) / 320)); if (k < 1) B.laeuft = true;
        const e = E_POP(k); o *= Math.min(1, E_EASE(k) * 1.4);
        Mf = mul(Mf, mul(T(f.W / 2, f.H / 2, 0), mul(S(0.2 + 0.8 * e), T(-f.W / 2, -f.H / 2, 0))));
      }
      if (o <= 0.003) return;
      const role = el.getAttribute('data-r') || '', wand = role === 'wall-in' || role === 'wall-out', boden = c.contains('w3d-floor');
      /* Wand ohne Ende; Böden nur nach vorn (innen in den Raum, außen auf die Terrasse) und zur Seite */
      /* Laibung in die Ecken hinein verlängert (verdeckt von der Nachbarfläche), nie vor die Wandebenen */
      const ecke = role === 'rev-t' || role === 'rev-b' ? { x: HAUCH, o: 0, u: 0 } : role === 'rev-l' || role === 'rev-r' ? { x: 0, o: HAUCH, u: HAUCH } : 0;
      /* Terrasse: begrenzt und zum Ende hin ausgeblendet, sonst wird der Blick durch die Tür dunkel; lang genug, dass sie auch
         herausgezoomt (bis 0,5) erst weit vorn ausläuft und keine Fassade unter dem Boden zu sehen ist */
      const terrasse = role === 'floor-out';
      const vor = stufe(role);
      const tri = role === 'fuge' ? abgerueckt(f.c, f.W, f.H).tri : vor ? dreiecke(aufgeweitet(f.c), f.W, f.H, HAUCH) : dreiecke(wand ? enger(f.c, stage._v && stage._v.bank) : f.c, f.W, f.H, wand ? WEIT : terrasse ? { x: WEIT, o: 0, u: f.H * 14 } : boden ? { x: WEIT, o: 0, u: WEIT } : ecke);
      if (c.contains('w3d-band') && el._tief > 0.3) { koerper(el, Mf, f.W, f.H, flaecheStoff(el, stage), o, Math.min(f.W, f.H) * 0.3, -el._tief, 0); return; }
      const ao = aoFuer(role, f, stage);
      const glas = c.contains('w3d-glass') && !c.contains('w3d-paneel'), glasGel = c.contains('w3d-gel-glas'), luecke = !glasGel && (c.contains('w3d-gitter') || (c.contains('w3d-gel') && !c.contains('w3d-gel-h')));
      const lage = role === 'floor-out' || role === 'wall-out' || role.indexOf('sa-') === 0 ? 2 : role === 'floor-in' || role.indexOf('sill-') === 0 ? 1 : 0;
      /* seite: nur von vorn sichtbar wie backface-visibility: hidden (Blende des Aufsatzkastens nur von außen) */
      const vorn = role === 'floor-in' || el.style.backfaceVisibility === 'hidden';
      const it = { el: el, role: role, c: f.c, lage: lage, seite: vorn ? 1 : role === 'floor-out' ? -1 : 0, M: Mf, W: f.W, H: f.H, tri: tri, st: flaecheStoff(el, stage), op: o, fade: terrasse ? [f.H * 3, f.H * 15] : null, wirftNicht: role === 'rev-b' || (role.indexOf('rs-') === 0 && el._bgc === 'transparent') || boden || luecke, rund: c.contains('w3d-pilz') ? Math.min(f.W, f.H) / 2 : el._rund ? Math.min(el._rund, f.W / 2, f.H / 2) : 0, glas: glas, durch: glas || terrasse || glasGel || c.contains('w3d-scheibe') || c.contains('w3d-mesh') || c.contains('w3d-sicht-u'), hinten: wand ? 1 : c.contains('w3d-rev') || c.contains('w3d-rs') ? 2 : 0, vor: vor, nachgeben: /^(el-side-|sfe-)/.test(role), ao: ao && ao.k, aoR: ao && ao.r, aoRect: !!(ao && ao.rect), relief: el._relief || null };
      /* Lamellen mit C-Profil: die Normale neigt sich über die Höhe der Lamelle (_bieg Grad je Kante), so fängt die Wölbung Licht */
      if (el._bieg) { const nb = (g) => { const m = mul(Mf, RX(g)), a = ap(m, 0, 0, 1), z0 = ap(m, 0, 0, 0); return norm([a[0] - z0[0], a[1] - z0[1], a[2] - z0[2]]); }; it.n1 = nb(-el._bieg); it.n2 = nb(el._bieg); it.nAchse = 1; }
      items.push(it);
      const pr = !DBG.ohneFalz && falzPartner(role); if (pr) falz(el, pr, Mf, f, o, !sash);
      if (glas) glasKinder(el, Mf, f, op, sash);
      if (glas && sash) { if (sash.classList.contains('demo-F')) glanz(el, Mf, f, op, sash); else sash._glc = ''; }
    };
    /* Falz: die Innenkante zwischen Vorder- und Rückfläche eines Profils schließen, vorn in der Innenfarbe, hinten in der
       Außenfarbe, beim Flügel dazwischen der Abstandhalter. Ohne ihn sieht man schräg durch den Spalt auf die Rückseite der
       Außenfläche: eine Linie in der Außenfarbe an jeder Glaskante. Rahmenteile liegen einen Hauch im Profil, damit sie
       nicht mit den Kanten der Flügel in einer Ebene flimmern */
    const falz = (el, pr, Mf, f, o, rahmen) => {
      const b = el.parentNode && el.parentNode.querySelector('[data-r="' + pr + '"]'); if (!b || !b._f) return;
      const fb = b._tf ? b._tf.jetzt : b._f, t = f.z - fb.z; if (!(t > 0.5)) return;
      const c = f.c, wege = [], role = el.getAttribute('data-r');
      if (c && c.t === 'hole') { const r = c.r; wege.push({ p: [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]], loch: true }); }
      else if (c && c.t === 'ring' && c.i) wege.push({ p: c.i, loch: true });
      else if (c && c.t === 'poly' && c.p) wege.push({ p: c.p, loch: false });
      else if (!c && role.indexOf('mul-') === 0) wege.push({ p: [[0, f.H], [0, 0]], m: [1, 0] }, { p: [[f.W, 0], [f.W, f.H]], m: [-1, 0] });
      else if (!c) wege.push({ p: [[0, 0], [f.W, 0]], m: [0, 1] }, { p: [[f.W, f.H], [0, f.H]], m: [0, -1] });
      const zwei = stage.getAttribute('data-scheiben') === '2', fl = pr.indexOf('sf-out-') === 0;
      const stI = stoff(el._sol || '#f4f4f2', '', 'w3d-side', el._art || ''), stA = stoff(b._sol || el._sol || '#f4f4f2', '', 'w3d-side', b._art || '');
      const lagen = fl ? [[0, zwei ? 0.38 : 0.3, stI], [zwei ? 0.38 : 0.3, zwei ? 0.62 : 0.7, stoff(stage._ah || '#4b4f55', '', 'w3d-side', '')], [zwei ? 0.62 : 0.7, 1, stA]] : [[0, 0.5, stI], [0.5, 1, stA]];
      const k = HAUCH / 2, e = 0.4;
      wege.forEach((w) => {
        const zu = !w.m, p = zu ? gerade(sauber(w.p)) : w.p, n = p.length; if (n < 2) return;
        let A = 0; if (zu) for (let i = 0; i < n; i++) { const a = p[i], q = p[(i + 1) % n]; A += a[0] * q[1] - q[0] * a[1]; }
        const sg = (A >= 0 ? 1 : -1) * (w.loch ? 1 : -1), reihe = [];
        for (let i = 0; i < (zu ? n : n - 1); i++) {
          const a = p[i], q = p[(i + 1) % n], dx = q[0] - a[0], dy = q[1] - a[1], L = Math.hypot(dx, dy); if (L < 0.05) continue;
          const ux = dx / L, uy = dy / L, m = w.m || [sg * uy, -sg * ux], W = L + 2 * e;
          const M0 = mul(Mf, mul(T(a[0] + m[0] * k - ux * e, a[1] + m[1] * k - uy * e, 0), RZ(Math.atan2(dy, dx) / RAD))), grp = [];
          lagen.forEach((l) => { const H = (l[1] - l[0]) * t; if (H <= 0.05) return; const it = { el: el, role: 'falz', M: mul(M0, mul(T(0, 0, -l[0] * t), RX(-90))), W: W, H: H, tri: dreiecke(null, W, H, 0), st: l[2], op: o }; items.push(it); grp.push(it); });
          if (grp.length) reihe.push(grp);
        }
        /* Bögen: Normalen an den Stößen mitteln, damit die Falzfläche glatt schattiert ist */
        if (zu && reihe.length > 4) {
          const N = reihe.map((g) => { const a = ap(g[0].M, 0, 0, 1), z = ap(g[0].M, 0, 0, 0); return norm([a[0] - z[0], a[1] - z[1], a[2] - z[2]]); }), r = reihe.length;
          const nah = (a, m) => a[0] * m[0] + a[1] * m[1] + a[2] * m[2] > 0.82;
          reihe.forEach((g, i) => { const v = N[(i - 1 + r) % r], h = N[(i + 1) % r], m = N[i], n1 = nah(v, m) ? norm([v[0] + m[0], v[1] + m[1], v[2] + m[2]]) : m, n2 = nah(h, m) ? norm([h[0] + m[0], h[1] + m[1], h[2] + m[2]]) : m; g.forEach((it) => { it.n1 = n1; it.n2 = n2; }); });
        }
      });
    };
    const griff = (el, M, op, sash) => {
      const h = el._h; if (!h) return;
      const z = spur(el, 'h', h, now, TF, (a, b, t) => ({ w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), tx: lerp(a.tx, b.tx, t), ty: lerp(a.ty, b.ty, t), tz: lerp(a.tz, b.tz, t), ox: lerp(a.ox, b.ox, t), oy: lerp(a.oy, b.oy, t) }), B);
      /* fest: Festfeld ohne Bediengriff (die Faltwand ohne Gehflügel trägt am freien Ende einen, mit-griff) */
      const fest = !!sash && sash.classList.contains('is-fixed') && !sash.classList.contains('mit-griff');
      const o = op * wert(el, 'op', fest || el._aus ? 0 : 1, now, 300, E_EASE, B), k = wert(el, 'sk', fest ? 0.5 : 1, now, 700, E_FORM, B);
      if (o <= 0.003) return;
      let A = null;
      if (demo) { const cs = getComputedStyle(el); A = cssM(cs.transform); if (A) { const oo = cssO(cs.transformOrigin); A = mul(T(oo[0], oo[1], oo[2]), mul(A, T(-oo[0], -oo[1], -oo[2]))); B.laeuft = true; } }
      let Mh = mul(M, mul(T(z.tx, z.ty, z.tz), mul(T(z.ox, z.oy, 0), mul(S(k), T(-z.ox, -z.oy, 0)))));
      if (A) Mh = mul(Mh, A);
      /* der Hebel steht vom Flügel ab: Körper vom Flügelrahmen (z = -tz) bis gut einen Millimeter vor die Griffebene */
      koerper(el, Mh, z.w, z.h, stoff(el._bg || '#f4f4f2', 'w3d-handle', 'w3d-handle'), o, Math.min(3, z.w / 2, z.h / 2), -z.tz + 0.4, 1);
      /* Druckknopf und Schließzylinder: eigene Flächen im Griff (app.js, an der Achse), dicht vor dem Hebel; drehen mit ihm */
      teile(el, Mh, o, 1.6);
    };
    /* Kleinteile auf einem Körper (Griff, Griff außen): Kinder mit Fläche, Lage im Körper, um dz davor */
    const teile = (box, M, op, dz) => {
      for (const k of box.children) {
        if (!k.classList.contains('w3d-f') || !k._f) continue;
        const f = spur(k, 'f', spec(k._f), now, TF, flaecheMischen, B), o = op * wert(k, 'op', deckt(k), now, 300, E_EASE, B);
        if (o <= 0.003 || f.W <= 0.01 || f.H <= 0.01) continue;
        items.push({ el: k, role: k.getAttribute('data-r') || '', M: mul(M, mul(T(0, 0, dz), flaecheMatrix(f))), W: f.W, H: f.H, tri: dreiecke(null, f.W, f.H, 0), st: flaecheStoff(k, stage), op: o, rund: k._rund ? Math.min(k._rund, f.W / 2, f.H / 2) : 0, art: 'teil' });
      }
    };
    /* Griffe als Körper: Vorderseite plus vier Seiten bis auf den Flügel (z von z0 bis z1 im Griffraum) */
    const koerper = (el, M, W, H, st, o, rund, z0, z1) => {
      const t = Math.abs(z1 - z0), zA = Math.max(z0, z1), role = el.getAttribute('data-r') || ''; if (W <= 0 || H <= 0) return;
      items.push({ el: el, role: role, M: mul(M, T(0, 0, z1)), W: W, H: H, tri: dreiecke(null, W, H, 0), st: st, op: o, rund: rund, art: 'teil' });
      if (t <= 0.2) return;
      const seite = (Ms, w, h) => items.push({ el: el, role: role, M: Ms, W: w, H: h, tri: dreiecke(null, w, h, 0), st: st, op: o, rund: 0, art: 'teil' });
      const e = Math.min(rund, W / 2, H / 2) * 0.6;
      seite(mul(M, mul(T(0, e, zA), RY(90))), t, H - 2 * e); seite(mul(M, mul(T(W, e, zA), RY(90))), t, H - 2 * e);
      seite(mul(M, mul(T(e, 0, zA), RX(-90))), W - 2 * e, t); seite(mul(M, mul(T(e, H, zA), RX(-90))), W - 2 * e, t);
    };
    const ring = (el, M, op, sash) => {
      if (!sash || !sash.classList.contains('is-sel')) { el._ra = 0; return; }
      const f = spec(el._f); if (!f) return;
      if (!el._ra) el._ra = now + (B.sofort ? -1000 : 0);
      const k = Math.min(1, (now - el._ra) / 250); if (k < 1) B.laeuft = true;
      const tri = [], pg = el.querySelector('polygon');
      if (pg) { const p = (pg.getAttribute('points') || '').trim().split(/\s+/).map((q) => q.split(',').map(parseFloat)).filter((q) => q.length === 2 && !isNaN(q[0])); band(tri, p, 3, true, null); }
      else dreiecke({ t: 'hole', r: [3, 3, f.W - 3, f.H - 3] }, f.W, f.H, 0).forEach((v) => tri.push(v));
      items.push({ el: el, M: mul(M, flaecheMatrix(f)), W: f.W, H: f.H, tri: tri, st: stoff('#8fd694', '', '', 'ring'), op: op * E_OUT(k), rund: 0, art: 'oben', unbeleuchtet: true, vor: 5 });
    };
    const glasKinder = (glas, Mg, f, op, sash) => {
      /* geformtes Glas: Sprossen und Symbole enden am Umriss (im CSS-Modell schneidet clip-path die Kinder ab) */
      const K = f.c && f.c.t === 'poly' ? sauber(f.c.p) : null;
      /* Sprossen: innen und außen je eine Seite, mit ihrer Farbe (aufgesetzt nur auf einer Seite) */
      glas.querySelectorAll('.w3d-bar').forEach((be) => {
        const b = be._b; if (!b) return;
        const p = wert(be, 'p', b.p, now, 250, E_EASE, B), bw = wert(be, 'bw', b.bw, now, 300, E_EASE, B);
        const r = b.d === 'v' ? [p * f.W - bw / 2, 0, bw, f.H] : [0, p * f.H - bw / 2, f.W, bw];
        const Mb = mul(Mg, T(r[0], r[1], 0)), sel = be.classList.contains('is-sel');
        [[be._bi, 1, 0.7, be._art], [be._bo, -1, -0.7, be._arto]].forEach((s) => {
          const bg = s[0] || '#ffffff'; if (/^transparent$/.test(bg.trim())) return;
          items.push({ el: be, M: Mb, W: r[2], H: r[3], tri: K ? klippDreiecke(dreiecke(null, r[2], r[3], 0), K.map((q) => [q[0] - r[0], q[1] - r[1]])) : dreiecke(null, r[2], r[3], 0), st: stoff(bg, 'w3d-frame', 'w3d-frame', s[3] || ''), op: op, rund: 0, art: 'teil', seite: s[1], dz: s[2], senk: b.d === 'v' });
        });
        if (sel) { const tri = []; band(tri, [[-1.2, -1.2], [r[2] + 1.2, -1.2], [r[2] + 1.2, r[3] + 1.2], [-1.2, r[3] + 1.2]], 2.5, true, null); items.push({ el: be, M: Mb, W: r[2], H: r[3], tri: tri, st: stoff('#8fd694', '', '', 'ring'), op: op, rund: 0, art: 'oben', unbeleuchtet: true, dz: 1 }); }
      });
      /* Öffnungssymbole */
      const sv = glas.querySelector('.w3d-sym');
      const o = op * wert(glas, 'sym', sym, now, 350, E_EASE, B);
      if (sv && o > 0.003) {
        const key = (sv.getAttribute('data-k') || sv.innerHTML.length) + '|' + Math.round(f.W) + '|' + Math.round(f.H);
        const kk = key + (K ? '|' + K.length + '|' + K.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ') : '');
        if (sv._k !== kk) { const tri = []; pfade(sv, f.W, f.H).forEach((l) => { const da = l.da ? l.da.split(/[\s,]+/).map(parseFloat) : null; band(tri, l.p, 1.3, false, da && da.length >= 2 ? da : null); }); sv._k = kk; sv._tri = K ? klippDreiecke(tri, K) : tri; }
        /* einmal: überlappende Strichenden nicht doppelt decken */
        if (sv._tri.length) items.push({ el: sv, M: Mg, W: f.W, H: f.H, tri: sv._tri, st: stoff('rgba(29, 29, 31, .5)', '', '', 'sym'), op: o, rund: 0, art: 'oben', unbeleuchtet: true, dz: 0.8, einmal: true });
      }
    };
    const glanz = (glas, Mg, f, op, sash) => {
      /* Fest: ein Glanz läuft übers Glas (wie .w3d-glass::after) */
      const an = sash._gl0 && now - sash._gl0 < 1100 ? sash._gl0 : (sash._glc !== sash.className ? (sash._gl0 = now) : sash._gl0);
      sash._glc = sash.className;
      const k = Math.min(1, (now - an) / 1000); if (k >= 1) return;
      B.laeuft = true;
      const e = E_OUT(k), x = lerp(1.3, -0.3, e), a = e < 0.12 ? e / 0.12 * 0.95 : e < 0.82 ? 0.95 : (1 - e) / 0.18 * 0.95;
      const bg = 'linear-gradient(105deg, transparent 26%, rgba(255, 255, 255, .55) 38%, #fff 46%, rgba(255, 255, 255, .7) 52%, transparent 66%) ' + ((f.W - 2.6 * f.W) * x).toFixed(2) + 'px 0px / ' + (2.6 * f.W).toFixed(2) + 'px ' + f.H.toFixed(2) + 'px no-repeat';
      items.push({ el: glas, M: Mg, W: f.W, H: f.H, tri: dreiecke(f.c, f.W, f.H, 0), st: stoff(bg, '', '', 'glanz'), op: op * a, rund: 0, art: 'oben', unbeleuchtet: true, dz: 0.4 });
    };
    geh(world, I4(), 1, null);
    return { items: items, picks: picks };
  }
  /* Weiche Verschattung in Innenecken: Laibung zum Rahmen und zu den Nachbarflächen, Fensterbank zum Rahmen */
  /* Punkte auf einer Geraden weglassen (Formen liefern auch gerade Kanten in vielen Stücken) */
  function gerade(p) {
    const n = p.length, o = []; if (n < 4) return p;
    for (let i = 0; i < n; i++) {
      const a = p[(i - 1 + n) % n], b = p[i], c = p[(i + 1) % n], ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1], lu = Math.hypot(ux, uy), lv = Math.hypot(vx, vy);
      if (lu < 0.05) continue;
      if (lv >= 0.05 && Math.abs(ux * vy - uy * vx) < 0.002 * lu * lv && ux * vx + uy * vy > 0) continue;
      o.push(b);
    }
    return o.length >= 3 ? o : p;
  }
  const FALZ = { 'el-front': 'el-back', 'ol-front': 'ol-back', 'ul-front': 'ul-back', kf: 'kfb', kfu: 'kfub' };
  const falzPartner = (role) => FALZ[role] || (role.indexOf('sf-in-') === 0 ? 'sf-out-' + role.slice(6) : role.indexOf('mul-') === 0 ? 'mulb-' + role.slice(4) : '');
  function aoFuer(role, f, stage) {
    const v = stage._v; if (!v) return null;
    const d = v.d, fd = v.fd, r = Math.max(4, fd * 0.9), dF = d + 1 + HAUCH, s = v.s || 0.2, loch = f.c && f.c.t === 'hole' ? f.c.r : null;
    let k = null, rr = r, rect = false;
    if (role === 'rev-t' || role === 'rev-b') k = [[0, 0, 1, 0.24], [0, f.W, -1, 0.24], [1, dF, -1, 0.3], [1, d + fd, 1, 0.3]];
    else if (role === 'rev-l' || role === 'rev-r') k = [[1, 0, 1, 0.24], [1, f.H, -1, 0.24], [0, dF, -1, 0.3], [0, d + fd, 1, 0.3]];
    else if (role.indexOf('rs-') === 0) k = [[1, dF, -1, 0.3], [1, d + fd, 1, 0.3]];
    else if (role === 'sill-t') k = [[1, f.H, -1, 0.32]];
    else if (role === 'sa-t1') k = [[1, 0, 1, 0.32]];
    /* Kontaktschatten (eine Stufe mehr Tiefe): der Falz des Flügels auf dem Glas (oben am stärksten), das Flügelprofil auf dem Blendrahmen
       rund um dessen Öffnung, die Laibung auf der Wand rund um die Maueröffnung; alles weich, nichts hyperrealistisch */
    else if (role.indexOf('glass-') === 0 || role === 'ol-glass' || role === 'ul-glass') { k = [[0, 0, 1, 0.26], [0, f.W, -1, 0.26], [1, 0, 1, 0.36], [1, f.H, -1, 0.16]]; rr = Math.max(3, 34 * s); }
    else if (loch && (role === 'el-front' || role === 'el-back' || role === 'ol-front' || role === 'ol-back' || role === 'ul-front' || role === 'ul-back')) { k = [[loch[0], loch[1], loch[2], loch[3]], [0.16, /^el-/.test(role) ? 0.3 : 0, Math.max(2.5, 40 * s), 0]]; rr = Math.max(2, 24 * s); rect = true; }
    else if (loch && (role === 'wall-in' || role === 'wall-out')) { k = [[loch[0], loch[1], loch[2], loch[3]], [0.13, 0, 0, 0]]; rr = Math.max(4, 90 * s); rect = true; }
    return k ? { k: k, r: rr, rect: rect } : null;
  }

  /* ---------- Licht ---------- */
  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  /* Sonne innen von rechts oben vorn, außen von links oben; eine dem Betrachter zugewandte Wand kommt auf ihre Farbe,
     Fensterbänke etwas heller, der Sturz im Schatten, die Laibungen je Seite verschieden */
  const L1 = norm([0.45, -0.5, 0.74]), L2 = norm([-0.42, -0.52, -0.74]);
  const C1 = [0.6, 0.58, 0.55], C2 = [0.6, 0.58, 0.55], SKY = [0.57, 0.6, 0.66], GND = [0.52, 0.48, 0.44];

  /* ---------- Zeichnen ---------- */
  /* Kamera wie .w3d-cam in app.css: Verschiebung (--panx, --pany; Zoom) vor der Drehung (--rx, --ry). Sie gleitet wie dort: 0,9 s,
     per Zoom-Knopf 0,38 s (is-zoomanim), sofort beim Ziehen, mit zwei Fingern, mit dem Rad (is-zooming) und ohne Bewegung */
  function kamera(stage, B, now) {
    const sty = stage.style, sc = stage.classList, wert1 = (k) => parseFloat(sty.getPropertyValue(k)) || 0;
    const zk = [wert1('--rx'), wert1('--ry'), wert1('--panx'), wert1('--pany')];
    const drag = sc.contains('is-drag'), sofort = drag || B.sofort || sc.contains('is-pinch') || sc.contains('is-zooming');
    let K = B.cam;
    if (!K || !K.z || sofort) K = B.cam = { rx: zk[0], ry: zk[1], px: zk[2], py: zk[3], z: zk, v: zk, t0: now - 2000, d: 900, k: E_CAM };
    if (zk.some((x, i) => x !== K.z[i])) { const kurz = sc.contains('is-zoomanim'); K.v = [K.rx, K.ry, K.px, K.py]; K.z = zk; K.t0 = now; K.d = kurz ? 380 : 900; K.k = kurz ? E_ZOOM : E_CAM; }
    const f = Math.min(1, (now - K.t0) / K.d), e = K.k(f);
    K.rx = lerp(K.v[0], K.z[0], e); K.ry = lerp(K.v[1], K.z[1], e); K.px = lerp(K.v[2], K.z[2], e); K.py = lerp(K.v[3], K.z[3], e);
    if (f < 1) B.laeuft = true;
    /* Schwingen wie @keyframes w3dsway (9 s hin und zurück), angehalten statt zurückgesetzt; nicht bei weniger Bewegung,
       nicht gezoomt (app.css: is-zoom, is-pinch) und nicht auf Geräten, die schon heruntergestuft sind. Es zeigt nur, dass das
       Modell räumlich ist: einmal hin und zurück (18 s), nach der ersten Berührung gar nicht mehr; dann steht das Bild still, ohne
       dass Kanten und feine Muster dauernd kriechen. W.aus geht mit dem Schwingen auf die nächste Bühne über */
    const W = B.schwing, dt = B.zuletzt ? Math.min(100, now - B.zuletzt) : 0;
    if (drag) W.aus = true;
    const live = sc.contains('is-live') && !sc.contains('is-zoom') && !sc.contains('is-pinch') && !ruhig() && B.stufe < 2 && !W.aus && !W.fertig, pause = drag || sc.contains('is-busy') || sc.contains('is-vorf') || sc.contains('is-demo');
    if (live && !pause) { W.t += dt; W.echt = (W.echt || 0) + (B.zuletzt ? Math.min(1000, now - B.zuletzt) : 0); if (W.t >= 18000 || W.echt >= 18000) W.fertig = true; }
    B.schwingt = live && !pause;
    /* ein- und ausblenden statt springen; angehalten (Ziehen, Vorführung) nur, solange sich die Kamera dabei bewegt: dann geht das
       Auslaufen in der Bewegung unter, und ein stehendes Bild bleibt stehen */
    const ziel = live ? 1 : 0, kamBewegt = !!B.kamAlt && zk.some((x, i) => x !== B.kamAlt[i]); B.kamAlt = zk;
    if (B.sofort) W.k = ziel; else if (W.k !== ziel && (!pause || kamBewegt)) { W.k = ziel > W.k ? Math.min(1, W.k + dt / 700) : Math.max(0, W.k - dt / (W.fertig ? 1400 : 500)); B.laeuft = true; }
    const u = (W.t / 9000) % 2, p = E_SCHWING(u < 1 ? u : 2 - u), k = E_EASE(W.k);
    W.a = k * (-3 + 6 * p); W.b = k * (1 - 2 * p);
    return K;
  }
  function zeichnen(stage, B, now) {
    const L = B.L, gl = L.gl, cv = L.cv;
    B.laeuft = false; B.sofort = stage.classList.contains('no-anim') || ruhig() || !B.zuletzt;
    const cw = stage.clientWidth, ch = stage.clientHeight; if (!cw || !ch) return false;
    B.st = B.scharf ? 0 : B.stufe;
    const geraet = window.devicePixelRatio || 1, dpr = B.scharf ? Math.min(geraet, RUHE_DPR, Math.max(STUFE_DPR[0], Math.sqrt(RUHE_PX / (cw * ch)))) : Math.min(geraet, STUFE_DPR[B.st]);
    const pw = Math.round(cw * dpr), ph = Math.round(ch * dpr);
    if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
    const K = kamera(stage, B, now), camLauf = B.laeuft; B.laeuft = false;
    B.camEl = stage.querySelector('.w3d-cam'); B.swayEl = stage.querySelector('.w3d-sway');
    const ct = 'translate(' + K.px.toFixed(2) + 'px, ' + K.py.toFixed(2) + 'px) rotateX(' + K.rx.toFixed(3) + 'deg) rotateY(' + K.ry.toFixed(3) + 'deg)', stt = 'rotateY(' + B.schwing.a.toFixed(3) + 'deg) rotateX(' + B.schwing.b.toFixed(3) + 'deg)';
    if (B.camEl && B.camEl._t !== ct) { B.camEl._t = ct; B.camEl.style.transform = ct; }
    if (B.swayEl && B.swayEl._t !== stt) { B.swayEl._t = stt; B.swayEl.style.transform = stt; }
    /* Ansicht: Mitte der Bühne samt Versatz für die Maßübersicht (--dimx, --dimy wie left/top der .w3d-cam), Verschiebung, Kamera,
       Schwingen; Projektion wie perspective: 1300px mit Ursprung 50 % 46 % */
    const dx = parseFloat(stage.style.getPropertyValue('--dimx')) || 0, dy = parseFloat(stage.style.getPropertyValue('--dimy')) || 0;
    const V = mul(T(cw / 2 + dx + K.px, ch / 2 + dy + K.py, 0), mul(RX(K.rx), mul(RY(K.ry), mul(RY(B.schwing.a), RX(B.schwing.b)))));
    const p = PERSP, ox = cw / 2, oy = ch * OY, A = (FERN + NAH) / (FERN - NAH), Bz = 2 * NAH * FERN / (NAH - FERN);
    const P = new Float32Array([2 * p / cw, 0, 0, 0, 0, -2 * p / ch, 0, 0, -(2 * ox / cw - 1), -(1 - 2 * oy / ch), -A, -1, -(2 * p / cw) * ox + (2 * ox / cw - 1) * p, (2 * p / ch) * oy + (1 - 2 * oy / ch) * p, A * p + Bz, p]);
    const VP = mul(P, V);
    B.VP = VP; B.V = V; B.cw = cw; B.ch = ch;
    /* Auge in Weltkoordinaten: (ox, oy, p) zurück durch V */
    const inv = invert(V), eye = ap(inv, ox, oy, p);
    /* Szene: neu lesen, wenn sich etwas geändert hat oder etwas läuft; sonst nur die Kamera */
    if (B.neu || !B.items || B.inhaltLaeuft) {
      const r = lesen(stage, B, now);
      B.items = r.items; B.picks = r.picks; B.inhaltLaeuft = B.laeuft;
      glatt(B.items);
      packen(B); B.schattenNeu = true;
    }
    const lauf = camLauf || B.inhaltLaeuft || B.schwingt;
    B.nurSchwingen = B.schwingt && !B.inhaltLaeuft && !camLauf;
    /* Schatten: von der Seite, die man sieht; neu nur, wenn sich die Szene geändert hat oder die Seite wechselt */
    const aussen = Math.cos((K.ry + B.schwing.a) * RAD) * Math.cos(K.rx * RAD) < 0, seite = aussen ? 2 : 1;
    if (L.smOk && stage._v && (B.schattenNeu || B.schattenSeite !== seite)) { schattenMalen(B, seite, stage._v); B.schattenSeite = seite; B.schattenNeu = false; }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, pw, ph);
    gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const pr = L.pr, u = pr.u; gl.bindVertexArray(L.vao);
    MASSSTAB = stage._v && stage._v.s ? stage._v.s : 0.2;
    { const f = farbe(stage._ah || '#4d545c'); AH_FARBE = f ? f.slice(0, 3) : [0.3, 0.32, 0.34]; }
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, L.sm);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const items = B.items, offen = [], durch = [], oben = [];
    items.forEach((it) => { if (DBG.ohne && DBG.ohne.test(it.role || '')) return; if (it.art === 'oben') oben.push(it); else if (it.durch || it.op < 0.999) durch.push(it); else offen.push(it); });
    /* undurchsichtig, von vorn nach hinten: Tiefe schreiben; was ausgeschnitten ist (runde Ecken, Muster mit Lücken, Sprossen je
       Seite), verwirft fast durchsichtige Pixel im eigenen Programm; Wand und Laibung geben bei gleicher Ebene nach */
    const ex = eye[0] / eye[3], ey = eye[1] / eye[3], ez = eye[2] / eye[3];
    offen.forEach((it) => { const c = ap(it.M, it.W / 2, it.H / 2, 0); it.abst = Math.hypot(c[0] - ex, c[1] - ey, c[2] - ez); it.schnitt = !!(it.seite || it.rund || it.wirftNicht || it.art === 'teil' || (it.st && it.st.luecke)); });
    offen.sort((a, b) => a.abst - b.abst);
    gl.depthMask(true); gl.enable(gl.POLYGON_OFFSET_FILL);
    [false, true].forEach((cut) => {
      const pp = cut ? L.pr : L.pr0, uu = pp.u;
      gl.useProgram(pp.p); global(gl, uu, B, VP, eye, L, seite);
      /* Versätze in festen Einheiten (Wand, Teile in der Rahmenöffnung): mit einem Faktor auf die Neigung entschied sonst der Blickwinkel,
         wer gewinnt (der Flügel schnitt den Griffkörper ab, die Wand schob sich hinter die Kastenblende). Nur die Laibung, die man von oben
         fast genau von der Kante sieht, gibt mit der Neigung nach, sonst blitzt ihre Vorderkante durch die Wand; die Rahmenseiten (el-side,
         nur durch die Fuge zu sehen) und die Flügelkanten geben ebenso nach, damit sie nicht durch die Laibung scheinen */
      offen.forEach((it) => { if (it.schnitt !== cut) return; if (it.hinten === 2) gl.polygonOffset(1, 6); else if (it.hinten) gl.polygonOffset(0, 3); else if (it.vor) gl.polygonOffset(0, -2 * it.vor); else if (it.nachgeben) gl.polygonOffset(1, 2); else gl.polygonOffset(0, 0); malen(gl, uu, it, 0.5); });
    });
    gl.polygonOffset(0, 0); gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.useProgram(pr.p);
    /* durchsichtig: von hinten nach vorn, ohne Tiefe zu schreiben */
    /* parallele Glasebenen: die vom Auge weiter entfernte zuerst (Abstand zur Ebene, nicht zur Mitte) */
    durch.forEach((it) => { const o0 = ap(it.M, 0, 0, it.dz || 0), n = ap(it.M, 0, 0, 1), nx = n[0] - it.M[12], ny = n[1] - it.M[13], nz = n[2] - it.M[14], l = Math.hypot(nx, ny, nz) || 1; it.tief = it.role === 'floor-out' ? 1e9 : Math.abs(((eye[0] / eye[3] - o0[0]) * nx + (eye[1] / eye[3] - o0[1]) * ny + (eye[2] / eye[3] - o0[2]) * nz) / l); });
    durch.sort((a, b) => b.tief - a.tief);
    gl.depthMask(false); global(gl, u, B, VP, eye, L, seite);
    durch.forEach((it) => malen(gl, u, it, 0));
    /* der Auswahlring liegt auf dem Flügel, der um stufe 4 nach vorn gezogen ist: einen Schritt mehr */
    oben.forEach((it) => { if (it.einmal) return; if (it.vor) { gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(-it.vor, -2 * it.vor); } malen(gl, u, it, 0); if (it.vor) gl.disable(gl.POLYGON_OFFSET_FILL); });
    /* Symbole: Tiefe schreiben und nur „davor“ zulassen, so deckt jede Stelle einmal (Stöße, Kreuzungen) */
    gl.depthMask(true); gl.depthFunc(gl.LESS);
    oben.forEach((it) => { if (it.einmal) malen(gl, u, it, 0); });
    gl.depthFunc(gl.LEQUAL);
    /* Selbsttest beim ersten Bild mit Wand: oben links ist dann Wand (hell, deckend). Ist dort nichts oder Schwarz, zeichnet der
       Grafiktreiber falsch: dann lieber das CSS-Modell */
    /* nur bei 1:1: gezoomt kann oben links Glas oder die Terrasse liegen. Bühnen ohne Wand (das schwebende Element in Schritt 1,
       o.frei) haben oben links nichts: dort nicht prüfen, sondern auf der nächsten Bühne mit Wand, sonst schaltete ein richtiges
       Bild WebGL für die ganze Sitzung ab */
    const raum = stage.classList.contains('raum-licht'), wand = raum || !!(B.items && B.items.some((x) => (x.role === 'wall-in' || x.role === 'wall-out') && x.op > 0.9));
    if (!L.geprueft && wand && !stage.classList.contains('is-zoom') && !stage.classList.contains('is-pinch')) {
      L.geprueft = true;
      /* Im dunklen Raum (.raum-licht) reicht die Wand nicht bis in die Ecke: dort zählt die Mitte (Glas oder Rahmen, deckend und nicht schwarz) */
      const px = new Uint8Array(4);
      gl.readPixels(Math.round(pw * (raum ? 0.5 : 0.04)), Math.round(ph * (raum ? 0.5 : 0.96)), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      if (px[3] < (raum ? 200 : 250) || px[0] + px[1] + px[2] < (raum ? 20 : 60)) { if (window.console) console.warn('3-D-Bühne: Selbsttest fehlgeschlagen, CSS-Modell', Array.from(px)); L.kaputt = true; OK = false; B.aus = true; zumCss(stage); return false; }
    }
    return lauf;
  }
  const SH = [0, 1, 0.6];
  function global(gl, u, B, VP, eye, L, seite) {
    gl.uniform1i(u.uSM, 0);
    if (B.LVP) gl.uniformMatrix4fv(u.uLVP, false, B.LVP);
    SH[0] = L.smOk && B.LVP && B.st < 2 && !DBG.ohneSchatten ? seite : 0; SH[1] = B.smWeich || 1; SH[2] = B.smVers || 0.6;
    gl.uniform3f(u.uSh, SH[0], SH[1], SH[2]);
    gl.uniformMatrix4fv(u.uVP, false, VP); gl.uniform3f(u.uEye, eye[0] / eye[3], eye[1] / eye[3], eye[2] / eye[3]);
    gl.uniform3fv(u.uL1, L1); gl.uniform3fv(u.uC1, C1); gl.uniform3fv(u.uL2, L2); gl.uniform3fv(u.uC2, C2); gl.uniform3fv(u.uSky, SKY); gl.uniform3fv(u.uGnd, GND);
  }
  function invert(m) {
    const a = m, o = new Float32Array(16);
    const b00 = a[0] * a[5] - a[1] * a[4], b01 = a[0] * a[6] - a[2] * a[4], b02 = a[0] * a[7] - a[3] * a[4], b03 = a[1] * a[6] - a[2] * a[5], b04 = a[1] * a[7] - a[3] * a[5], b05 = a[2] * a[7] - a[3] * a[6];
    const b06 = a[8] * a[13] - a[9] * a[12], b07 = a[8] * a[14] - a[10] * a[12], b08 = a[8] * a[15] - a[11] * a[12], b09 = a[9] * a[14] - a[10] * a[13], b10 = a[9] * a[15] - a[11] * a[13], b11 = a[10] * a[15] - a[11] * a[14];
    let d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06; if (!d) return I4(); d = 1 / d;
    o[0] = (a[5] * b11 - a[6] * b10 + a[7] * b09) * d; o[1] = (a[2] * b10 - a[1] * b11 - a[3] * b09) * d; o[2] = (a[13] * b05 - a[14] * b04 + a[15] * b03) * d; o[3] = (a[10] * b04 - a[9] * b05 - a[11] * b03) * d;
    o[4] = (a[6] * b08 - a[4] * b11 - a[7] * b07) * d; o[5] = (a[0] * b11 - a[2] * b08 + a[3] * b07) * d; o[6] = (a[14] * b02 - a[12] * b05 - a[15] * b01) * d; o[7] = (a[8] * b05 - a[10] * b02 + a[11] * b01) * d;
    o[8] = (a[4] * b10 - a[5] * b08 + a[7] * b06) * d; o[9] = (a[1] * b08 - a[0] * b10 - a[3] * b06) * d; o[10] = (a[12] * b04 - a[13] * b02 + a[15] * b00) * d; o[11] = (a[9] * b02 - a[8] * b04 - a[11] * b00) * d;
    o[12] = (a[5] * b07 - a[4] * b09 - a[6] * b06) * d; o[13] = (a[0] * b09 - a[1] * b07 + a[2] * b06) * d; o[14] = (a[13] * b01 - a[12] * b03 - a[14] * b00) * d; o[15] = (a[8] * b03 - a[9] * b01 + a[10] * b00) * d;
    return o;
  }
  /* Laibung aus Streifen (Formen): Normalen an den Stoßkanten gemittelt, damit Bögen glatt schattiert sind */
  function glatt(items) {
    const rs = items.filter((it) => it.role && it.role.indexOf('rs-') === 0 && it.W > 0.05).sort((a, b) => +a.role.slice(3) - +b.role.slice(3));
    const nrm = (it) => { const a = ap(it.M, 0, 0, 1), b = ap(it.M, 0, 0, 0); return norm([a[0] - b[0], a[1] - b[1], a[2] - b[2]]); };
    const N = rs.map(nrm), n = rs.length;
    rs.forEach((it, k) => {
      const v = N[(k - 1 + n) % n], h = N[(k + 1) % n], m = N[k], nah = (a) => a[0] * m[0] + a[1] * m[1] + a[2] * m[2] > 0.82;
      it.n1 = nah(v) ? norm([v[0] + m[0], v[1] + m[1], v[2] + m[2]]) : m; it.n2 = nah(h) ? norm([h[0] + m[0], h[1] + m[1], h[2] + m[2]]) : m;
    });
  }
  /* Schattenkarte aus Sicht der sichtbaren Sonne: Kasten um die Öffnung, alles Undurchsichtige wirft Schatten */
  function schattenMalen(B, seite, v) {
    const L = B.L, gl = L.gl, l = seite === 2 ? L2 : L1;
    const R = Math.max(80, Math.hypot(v.moW || 300, v.moH || 300) * 0.62 + v.T * 1.2), c = [0, 0, -v.T / 2];
    const up = Math.abs(l[1]) > 0.95 ? [0, 0, 1] : [0, -1, 0];
    const z = l, x = norm([up[1] * z[2] - up[2] * z[1], up[2] * z[0] - up[0] * z[2], up[0] * z[1] - up[1] * z[0]]), y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
    const e = [c[0] + z[0] * R * 3, c[1] + z[1] * R * 3, c[2] + z[2] * R * 3], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const Vl = new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]);
    const n = 1, f = R * 6, O = new Float32Array([1 / R, 0, 0, 0, 0, 1 / R, 0, 0, 0, 0, -2 / (f - n), 0, 0, 0, -(f + n) / (f - n), 1]);
    B.LVP = mul(O, Vl);
    /* Weichheit: etwa 3 px Halbschatten, Versatz entlang der Normalen gegen Schattenakne */
    const texel = 2 * R / L.smGr; B.smWeich = Math.max(1, 3 / texel); B.smVers = Math.max(0.4, texel * 1.5);
    gl.bindFramebuffer(gl.FRAMEBUFFER, L.fbo); gl.viewport(0, 0, L.smGr, L.smGr);
    gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.disable(gl.BLEND); gl.colorMask(false, false, false, false);
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(2, 4);
    gl.useProgram(L.ps.p); gl.bindVertexArray(L.vao); gl.uniformMatrix4fv(L.ps.u.uLVP, false, B.LVP);
    B.items.forEach((it) => {
      if (!it.zahl || it.art === 'oben' || it.durch || it.op < 0.5 || it.wirftNicht) return;
      gl.uniformMatrix4fv(L.ps.u.uM, false, it.M); gl.uniform1f(L.ps.u.uDz, it.dz || 0);
      gl.drawArrays(gl.TRIANGLES, it.erst, it.zahl);
    });
    gl.disable(gl.POLYGON_OFFSET_FILL); gl.colorMask(true, true, true, true); gl.enable(gl.BLEND);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  /* alle Dreiecke in einen Puffer */
  function packen(B) {
    const gl = B.L.gl; let n = 0;
    B.items.forEach((it) => { n += it.tri.length; });
    const d = new Float32Array(n); let k = 0;
    B.items.forEach((it) => { it.erst = k / 2; it.zahl = it.tri.length / 2; d.set(it.tri, k); k += it.tri.length; });
    gl.bindBuffer(gl.ARRAY_BUFFER, B.L.buf);
    if (n > B.L.cap) { B.L.cap = Math.ceil(n * 1.5); gl.bufferData(gl.ARRAY_BUFFER, B.L.cap * 4, gl.DYNAMIC_DRAW); }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, d);
  }
  let MASSSTAB = 0.2, AH_FARBE = [0.3, 0.32, 0.34];
  /* Hintergrund-Schichten einer Fläche als Uniform-Daten (Verläufe, Wiederholung, Lage, Mittelwert feiner Muster) */
  function schichten(bg, W, H) {
    const LA = new Float32Array(20), LB = new Float32Array(20), LC = new Float32Array(20), LM = new Float32Array(20), SC = new Float32Array(48 * 4), SP = new Float32Array(48);
    let s = 0, nl = 0;
    for (let i = 0; i < bg.schichten.length && nl < 5; i++) {
      const Ls = bg.schichten[i]; let tw = 0, th = 0, px0 = 0, py0 = 0;
      if (Ls.groesse) { tw = Ls.groesse[0].u === '%' ? Ls.groesse[0].v / 100 * W : Ls.groesse[0].v; th = Ls.groesse[1].u === '%' ? Ls.groesse[1].v / 100 * H : Ls.groesse[1].v; }
      if (Ls.lage) { const lx = Ls.lage[0], ly = Ls.lage[1]; px0 = lx.u === '%' ? (W - (tw || W)) * lx.v / 100 : lx.v; py0 = ly.u === '%' ? (H - (th || H)) * ly.v / 100 : ly.v; }
      const r = aufloesen(Ls, tw || W, th || H), n = Math.min(Ls.stops.length, 16, 48 - s); if (n < 1) break;
      for (let j = 0; j < n; j++) { const c = vormul(Ls.stops[j].c); SC.set(c, (s + j) * 4); SP[s + j] = r.p[j]; }
      const per = Ls.rep ? r.p[n - 1] - r.p[0] : 0;
      /* Mittelwert für Muster feiner als ein Pixel */
      const m = [0, 0, 0, 0]; let wsum = 0;
      for (let j = 1; j < n; j++) { const w = r.p[j] - r.p[j - 1]; if (w <= 0) continue; const a = SC.subarray((s + j - 1) * 4, (s + j) * 4), b = SC.subarray((s + j) * 4, (s + j + 1) * 4); for (let q = 0; q < 4; q++) m[q] += (a[q] + b[q]) / 2 * w; wsum += w; }
      if (wsum > 0) for (let q = 0; q < 4; q++) m[q] /= wsum; else m.splice(0, 4, ...SC.subarray(s * 4, s * 4 + 4));
      LA.set([(Ls.rad ? 1 : 0) + (Ls.rep ? 2 : 0) + (Ls.einmal ? 4 : 0), s, n, per], nl * 4);
      LB.set(Ls.rad ? [r.cx, r.cy, 1, r.ky] : [r.dx, r.dy, r.Lg, 0], nl * 4);
      LC.set([px0, py0, tw, th], nl * 4);
      LM.set(m, nl * 4);
      s += n; nl++;
    }
    return { nl: nl, LA: LA, LB: LB, LC: LC, LM: LM, SC: SC, SP: SP };
  }
  const AO = new Float32Array(16);
  function malen(gl, u, it, schnitt) {
    if (!it.zahl) return;
    const st = it.st, bg = st.bg, W = it.W, H = it.H;
    gl.uniformMatrix4fv(u.uM, false, it.M);
    const nz = ap(it.M, 0, 0, 1), n0 = ap(it.M, 0, 0, 0); gl.uniform3f(u.uN, nz[0] - n0[0], nz[1] - n0[1], nz[2] - n0[2]);
    if (it.n2) gl.uniform3fv(u.uN2, it.n2); else gl.uniform3f(u.uN2, nz[0] - n0[0], nz[1] - n0[1], nz[2] - n0[2]);
    if (it.n1) gl.uniform3fv(u.uN, it.n1);
    gl.uniform1f(u.uNA, it.nAchse || 0);
    gl.uniform1f(u.uDz, it.dz || 0); gl.uniform2f(u.uWH, W, H);
    gl.uniform4fv(u.uBase, vormul(bg.basis));
    /* Schichten: einmal je gelesener Fläche aufgelöst, danach nur noch übergeben (beim Drehen ändert sich nur die Kamera) */
    const sch = it._sch || (it._sch = schichten(bg, W, H));
    gl.uniform1i(u.uNL, sch.nl);
    if (sch.nl) { gl.uniform4fv(u.uLA, sch.LA); gl.uniform4fv(u.uLB, sch.LB); gl.uniform4fv(u.uLC, sch.LC); gl.uniform4fv(u.uLM, sch.LM); gl.uniform4fv(u.uSC, sch.SC); gl.uniform1fv(u.uSP, sch.SP); }
    /* Formen (Bogen, Kreis, Schräge): Kantenlinie und Rundung folgen dem Rechteck der Fläche, nicht dem Umriss; dort weglassen,
       sonst steht am Scheitel und am Fuß ein kurzer Strich */
    const fc = it.c !== undefined ? it.c : it.el && it.el._f && it.el._f.c, form = !!(fc && (fc.t === 'ring' || fc.t === 'poly')), kt = form ? null : st.kante;
    if (kt) gl.uniform4fv(u.uIn, kt[1]); else gl.uniform4f(u.uIn, 0, 0, 0, 0);
    gl.uniform4f(u.uFx, kt ? kt[0] : 0, it.rund || 0, schnitt, 0);
    gl.uniform1f(u.uOp, it.op);
    gl.uniform4f(u.uLi, it.unbeleuchtet ? 0 : 1, st.glanz[0], st.glanz[1], it.glas ? 1 : 0);
    gl.uniform1f(u.uSide, it.seite || 0);
    gl.uniform3f(u.uSh, it.lage && SH[0] && it.lage !== SH[0] ? 0 : SH[0], SH[1], SH[2]);
    gl.uniform4f(u.uTint, 0, 0, 0, 0);
    const tx = ap(it.M, 1, 0, 0), ty = ap(it.M, 0, 1, 0), lx = Math.hypot(tx[0] - n0[0], tx[1] - n0[1], tx[2] - n0[2]) || 1, ly = Math.hypot(ty[0] - n0[0], ty[1] - n0[1], ty[2] - n0[2]) || 1;
    gl.uniform3f(u.uTx, (tx[0] - n0[0]) / lx, (tx[1] - n0[1]) / lx, (tx[2] - n0[2]) / lx); gl.uniform3f(u.uTy, (ty[0] - n0[0]) / ly, (ty[1] - n0[1]) / ly, (ty[2] - n0[2]) / ly);
    if (st.rundung && !it.unbeleuchtet && !form) {
      const rw = st.rundung[0] < 0 ? -st.rundung[0] * Math.min(W, H) : Math.max(1.2, Math.min(4.5, st.rundung[0] * MASSSTAB)), c = fc;
      gl.uniform4f(u.uBev, Math.min(rw, W / 2, H / 2), st.rundung[1], 0, 0);
      if (c && c.t === 'hole') gl.uniform4f(u.uBevI, c.r[0], c.r[1], c.r[2], c.r[3]); else gl.uniform4f(u.uBevI, 0, 0, 0, 0);
    } else { gl.uniform4f(u.uBev, 0, 0, 0, 0); gl.uniform4f(u.uBevI, 0, 0, 0, 0); }
    if (it.fade) gl.uniform2f(u.uFade, it.fade[0], it.fade[1]); else gl.uniform2f(u.uFade, 0, 0);
    if (st.art && !DBG.ohneArt) {
      const k = Math.max(0.02, MASSSTAB), f = st.artFarbe;
      gl.uniform4f(u.uArt, st.art[0], k, it.senk ? 2 : it.W >= it.H ? 1 : 2, st.art[1]); gl.uniform3f(u.uArtC, f[0], f[1], f[2]);
      /* Muster an das der Nachbarfläche anschließen (Blende des Aufsatzkastens in der Fassade): Versatz in örtlichen Pixeln */
      const ao = it.el && it.el._artVers; gl.uniform2f(u.uArtO, ao ? ao[0] : 0, ao ? ao[1] : 0);
      const c = fc; if (c && c.t === 'hole' && st.art[0] === 4) gl.uniform4f(u.uBand, c.r[0], c.r[1], c.r[2], c.r[3]); else gl.uniform4f(u.uBand, 0, 0, 0, 0);
    } else gl.uniform4f(u.uArt, 0, 0, 0, 0);
    AO.fill(0); if (it.ao) it.ao.forEach((a, i) => { if (i < 4) AO.set(a, i * 4); });
    gl.uniform4fv(u.uAo, AO); gl.uniform2f(u.uAoR, it.aoR || 1, it.aoRect ? 1 : 0);
    if (it.relief) gl.uniform4f(u.uRelief, it.relief[0], it.relief[1], it.relief[2] || 0, 0); else gl.uniform4f(u.uRelief, 0, 0, 0, 0);
    /* Profilstufen (Prototyp): Flügel innen/außen, Blendrahmen innen/außen, Pfosten, Abstandhalter im Glasrand */
    const ro = it.role || '', pm = form || it.unbeleuchtet ? 0 : /^sf-in-/.test(ro) ? 1 : /^sf-out-/.test(ro) ? 2 : /^(el|ol|ul)-front$/.test(ro) ? 3 : /^(el|ol|ul)-back$/.test(ro) ? 4 : it.glas && /^(glass-|ol-glass|ul-glass)/.test(ro) ? 5 : /^mul-/.test(ro) ? 6 : 0;
    gl.uniform4f(u.uPr, pm, MASSSTAB, pm === 5 ? 0.92 : 1, 0);
    if (pm === 5) { const ah = AH_FARBE; gl.uniform3f(u.uPrC, ah[0], ah[1], ah[2]); } else gl.uniform3f(u.uPrC, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, it.erst, it.zahl);
  }

  /* ---------- Treffer: welcher Flügel liegt unter dem Finger ---------- */
  function treffer(stage, cx, cy) {
    const B = stage && stage._b3; if (!B || !B.VP || !B.picks) return -1;
    const r = stage.getBoundingClientRect(), x = cx - r.left, y = cy - r.top;
    let best = -1, tief = Infinity;
    B.picks.forEach((pk) => {
      const M = mul(B.VP, pk.M), q = [[0, 0], [pk.w, 0], [pk.w, pk.h], [0, pk.h]].map((c) => { const v = ap(M, c[0], c[1], 0); return [(v[0] / v[3] + 1) / 2 * B.cw, (1 - v[1] / v[3]) / 2 * B.ch, v[3]]; });
      if (q.some((v) => v[2] <= 0)) return;
      let innen = true, vz = 0;
      for (let k = 0; k < 4; k++) { const a = q[k], b = q[(k + 1) % 4], z = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]); if (!vz) vz = Math.sign(z); else if (z && Math.sign(z) !== vz) { innen = false; break; } }
      const d = (q[0][2] + q[2][2]) / 2;
      if (innen && d < tief) { tief = d; best = pk.i; }
    });
    return best;
  }

  /* Für die Prüfung (scripts/pruefen.mjs, Abschnitt 20): sofort zeichnen und die Pixel lesen, Lage von Flächen auf dem Schirm */
  function bildschirm(B, M, x, y) { const v = ap(mul(B.VP, M), x, y, 0); return [(v[0] / v[3] + 1) / 2 * B.cw, (1 - v[1] / v[3]) / 2 * B.ch]; }
  const pruef = {
    /* ein Bild zeichnen, ohne auf den Grafikchip zu warten (Zeitmessung der Arbeit im Hauptfaden) */
    zeit(stage) { const B = stage && stage._b3; if (!B || B.aus) return; B.neu = true; zeichnen(stage, B, performance.now()); },
    pixel(stage) {
      const B = stage && stage._b3; if (!B || B.aus) return null;
      B.neu = true; zeichnen(stage, B, performance.now()); B.neu = true;
      const gl = B.L.gl, w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      return { w: w, h: h, px: px, k: w / B.cw };
    },
    /* Umriss der Maueröffnung auf dem Schirm (Pixel der Bühne) */
    oeffnung(stage, aussen) {
      const B = stage && stage._b3; if (!B || !B.items) return null;
      const it = B.items.find((x) => x.role === (aussen ? 'wall-out' : 'wall-in')); if (!it) return null;
      const c = it.el._f && it.el._f.c; if (!c) return null;
      const pts = c.t === 'hole' ? [[c.r[0], c.r[1]], [c.r[2], c.r[1]], [c.r[2], c.r[3]], [c.r[0], c.r[3]]] : c.p;
      return pts.map((q) => bildschirm(B, it.M, q[0], q[1]));
    },
    /* Mitte eines Flügels auf dem Schirm */
    fluegel(stage, i) {
      const B = stage && stage._b3; if (!B || !B.picks) return null;
      const pk = B.picks.find((x) => x.i === i); return pk ? bildschirm(B, pk.M, pk.w / 2, pk.h / 2) : null;
    },
    rollen(stage) { const B = stage && stage._b3; return B && B.items ? B.items.map((x) => x.role || '') : []; },
    /* gezeichnete Griffe (innen handle-i, außen ga-i, Kleinteile hk-i, hs-i): Rolle → Mitte auf dem Schirm */
    griffe(stage) {
      const B = stage && stage._b3, o = {}; if (!B || !B.items) return o;
      B.items.forEach((x) => { if (/^(handle|ga|hk|hs|gas)-/.test(x.role || '') && !o[x.role]) o[x.role] = bildschirm(B, x.M, x.W / 2, x.H / 2); });
      return o;
    },
    /* Mitte einer Fläche auf dem Schirm (Pixel der Bühne) */
    mitte(stage, role) { const B = stage && stage._b3, it = B && B.items ? B.items.find((x) => x.role === role) : null; return it ? bildschirm(B, it.M, it.W / 2, it.H / 2) : null; },
    /* abgeschaltet (Selbsttest, Regler) oder aktiv */
    aus(stage) { const B = stage && stage._b3; return !B || !!B.aus; },
    /* Deckkraft des Stoffs einer Fläche (0: ohne Farbe, die Fläche stanzt ein Loch in die Szene) */
    deckt(stage, role) {
      const B = stage && stage._b3, it = B && B.items ? B.items.find((x) => x.role === role) : null; if (!it) return null;
      const b = it.st.bg; let a = b.basis[3]; b.schichten.forEach((L) => L.stops.forEach((x) => { a = Math.max(a, x.c[3]); }));
      return a;
    },
    matrix(stage, role) { const B = stage && stage._b3, it = B && B.items ? B.items.find((x) => x.role === role) : null; return it ? Array.from(it.M) : null; },
    ohne(re, ohneArt) { DBG.ohne = re || null; DBG.ohneArt = !!ohneArt; }
  };
  return { DBG: DBG, pruef: pruef, an: an, anstoss: anstoss, treffer: treffer, aktiv: (stage) => !!(stage && stage._b3 && !stage._b3.aus), unterstuetzt: unterstuetzt };
})();

/* Firmenfarbe prüfen (Regeln aus docs/profis/konfigurator-landing-vorschau/VORLAGE.md, „Farbe prüfen“) und die Vorlage mit sechs
   Testfarben fotografieren. Ändert keine Datei. Aufruf (Vorschau unter http://localhost:8790/lokal.html, siehe huelle.sh):
   node docs/profis/werkzeuge/konfigurator-landing-farbprobe.mjs <ausgabe-präfix> */
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [,, OUT] = process.argv;
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0); };
const kontrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const farbton = (hex) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), c = mx - mn; if (!c) return { h: 0, s: 0 }; let h = mx === r ? ((g - b) / c) % 6 : mx === g ? (b - r) / c + 2 : (r - g) / c + 4; return { h: (h * 60 + 360) % 360, s: c / mx }; };
export function regeln(hex) {
  const auf = kontrast(hex, '#07090a') >= kontrast(hex, '#ffffff') ? '#07090a' : '#ffffff';
  const hell = lum(hex) > .3, licht = lum(hex) < .08 ? `color-mix(in srgb, ${hex} 55%, #fff)` : hell ? `color-mix(in srgb, ${hex} 70%, #07090a)` : hex;
  const { h, s } = farbton(hex), rot = s > .45 && (h < 40 || h > 340);
  return { '--firma': hex, '--firma-tief': `color-mix(in srgb, ${hex} ${hell ? 30 : 40}%, #07090a)`, '--auf-firma': auf, '--firma-licht': licht, '--hinweis': rot ? '#a8a4a9' : '#f88962', kontrast: kontrast(hex, auf).toFixed(1) };
}
const FARBEN = [['Gold', '#e3b75a', 'B', 'Fensterbau Brandt'], ['Rot', '#c8102e', 'H', 'Holzbau Hansen'], ['Dunkelblau', '#0b2a5b', 'K', 'Kröger Fenster'], ['Grün', '#1f7a3d', 'W', 'Weber Bauelemente'], ['fast Schwarz', '#1a1a1a', 'S', 'Schulz Fensterbau'], ['Gelb', '#f2b705', 'G', 'Glaserei Gelbe']];
if (OUT) {
  const b = await chromium.launch(); const tab = [];
  for (const [name, hex, ini, firma] of FARBEN) {
    const r = regeln(hex); tab.push(`${name} ${hex}: Schrift ${r['--auf-firma']} (${r.kontrast}:1), Leuchten ${r['--firma-licht'] === hex ? 'Farbe selbst' : 'aufgehellt'}, Hinweis ${r['--hinweis']}`);
    for (const [w, h, n, y] of [[390, 844, 'tel', 0], [390, 844, 'tel2', 1641]]) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      await p.goto('http://localhost:8790/lokal.html', { waitUntil: 'networkidle' });
      await p.evaluate(([r, ini, firma]) => {
        document.querySelector('.ez').style.cssText = Object.entries(r).filter(([k]) => k.startsWith('--')).map(([k, v]) => `${k}:${v}`).join(';');
        document.querySelectorAll('[data-vorlage="firma.zeichen"]').forEach(e => { e.textContent = ini; });
        const slug = firma.toLowerCase().replace(/ö/g, 'oe').replace(/\s+/g, '-');
        document.querySelectorAll('[data-vorlage="firma.adresse"] b').forEach(e => { e.textContent = slug; });
        const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t; while ((t = walk.nextNode())) if (t.nodeValue.includes('Muster Fensterbau')) t.nodeValue = t.nodeValue.replaceAll('Muster Fensterbau', firma);
      }, [r, ini, firma]);
      await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(2600);
      await p.screenshot({ path: `${OUT}-${name.replace(' ', '-')}-${n}.png` }); await p.close();
    }
  }
  await b.close(); console.log(tab.join('\n'));
}

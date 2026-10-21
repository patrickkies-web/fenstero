// eeziframes · Highlights: Story-Video aus einem KI-Video und dem Screen bauen.
//
//   node marketing/highlights/video.mjs h03          Video videos/h03.mp4  ->  out/h03.mp4 (1080 × 1920, H.264, mit Ton)
//   STANDBILD=1 node marketing/highlights/video.mjs h03   Standbild bilder/<slot>.png neu aus dem ersten Bild des Videos
//   STANDBILD=0 ...                                         bilder/ nicht anfassen (die Bildfassung behält ihr Foto)
//
// Nur fürs Video gelten data-video-fp (Ausschnitt) und data-video-voll (bis wohin voll sichtbar, z. B. 78%) am <img>;
// ohne sie gelten data-fp und die Ausblendung des Screens.
// Das Video läuft im Foto-Bereich des Screens (gleicher Ausschnitt wie das Foto: data-fp am <img>, sonst 50% 0%) und blendet
// mit derselben Maske wie das Foto weich in den Grund #161616 aus. Schrift, Chips und alles andere liegen als scharfe, ruhende
// Ebene darüber; die KI animiert also nie Buchstaben. Fehlt bilder/<slot>.png, wird es aus dem ersten Videobild erzeugt; damit
// rendert render.mjs dieselbe Story auch als Bild (out/<id>.png), falls doch ein Foto gepostet wird.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const require = createRequire('/opt/node-tools/x.js');
const { chromium } = require('playwright-core');

const HIER = dirname(fileURLToPath(import.meta.url));
const W = 1080, H = 1920, GRUND = '0x161616';
const id = process.argv[2];
if (!id) { console.error('Nutzung: node marketing/highlights/video.mjs <screen-id>, z. B. h03'); process.exit(2); }
const screen = join(HIER, 'screens', id + '.html'), video = join(HIER, 'videos', id + '.mp4');
if (!existsSync(screen) || !existsSync(video)) { console.error('Fehlt: ' + (existsSync(screen) ? video : screen)); process.exit(1); }

const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', video]).toString());
const vs = probe.streams.find((s) => s.codec_type === 'video'), mitTon = probe.streams.some((s) => s.codec_type === 'audio');
const [fz, fn] = vs.r_frame_rate.split('/').map(Number), fps = Math.round(fz / (fn || 1)) || 24;

const tmp = join(HIER, 'out', '.video-' + id);
mkdirSync(tmp, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(screen).href, { waitUntil: 'load' });
const slot = await page.$eval('.ef-foto > img[data-slot]', (el) => el.getAttribute('data-slot'));
const standbild = process.env.STANDBILD === '0' ? join(tmp, 'standbild.png') : join(HIER, 'bilder', slot + '.png');
if (!existsSync(standbild) || process.env.STANDBILD === '1' || process.env.STANDBILD === '0') {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', video, '-frames:v', '1', standbild]);
  if (process.env.STANDBILD !== '0') console.log('Standbild ' + slot + '.png aus dem ersten Videobild');
}
/* Slot wie render.mjs auflösen, dann warten */
const lage = await page.evaluate(async (url) => {
  const im = document.querySelector('.ef-foto > img[data-slot]'), fig = im.closest('.ef-foto');
  fig.style.setProperty('--ef-fp', im.getAttribute('data-video-fp') || im.getAttribute('data-fp') || '50% 0%');
  if (im.getAttribute('data-video-voll')) fig.style.setProperty('--ef-foto-voll', im.getAttribute('data-video-voll'));
  im.src = url; await im.decode(); await document.fonts.ready;
  await Promise.all([...document.images].map((b) => b.decode().catch(() => {})));
  const r = im.getBoundingClientRect(), [px, py] = getComputedStyle(im).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  return { x: r.left, y: r.top, w: r.width, h: r.height, px, py, nw: im.naturalWidth, nh: im.naturalHeight };
}, pathToFileURL(standbild).href);

/* Ebene 1: alles außer dem Foto, Grund durchsichtig */
const ohneFoto = await page.addStyleTag({ content: 'html, body, .ef-buehne { background: transparent !important } .ef-foto > img { visibility: hidden }' });
await page.screenshot({ path: join(tmp, 'ebene.png'), omitBackground: true });
await ohneFoto.evaluate((el) => el.remove());
/* Ebene 2: Maske des Fotos (weißes Bild mit derselben Ausblendung auf Schwarz) */
await page.addStyleTag({ content: 'html, body, .ef-buehne { background: #000 !important } body * { visibility: hidden } .ef-foto, .ef-foto > img { visibility: visible }' });
await page.evaluate(async () => {
  const im = document.querySelector('.ef-foto > img[data-slot]'), c = document.createElement('canvas');
  c.width = im.naturalWidth; c.height = im.naturalHeight;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  im.src = c.toDataURL('image/png'); await im.decode();
});
await page.screenshot({ path: join(tmp, 'maske.png') });
await browser.close();

/* Video wie object-fit: cover in den Foto-Bereich setzen */
const s = Math.max(lage.w / vs.width, lage.h / vs.height);
const sw = Math.round(vs.width * s / 2) * 2, sh = Math.round(vs.height * s / 2) * 2;
const fw = Math.round(lage.w), fh = Math.round(lage.h);
const ox = Math.round((sw - fw) * lage.px), oy = Math.round((sh - fh) * lage.py);
const filter = [
  `[0:v]scale=${sw}:${sh}:flags=lanczos,crop=${fw}:${fh}:${ox}:${oy},pad=${W}:${H}:${Math.round(lage.x)}:${Math.round(lage.y)}:color=black,format=rgba[v]`,
  '[1:v]format=gray[m]', '[v][m]alphamerge[va]',
  `color=c=${GRUND}:s=${W}x${H}:r=${fps}[bg]`,
  '[bg][va]overlay=shortest=1[b]', '[b][2:v]overlay=shortest=1,format=yuv420p[out]',
].join(';');
const ziel = join(HIER, 'out', id + '.mp4');
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', video, '-loop', '1', '-i', join(tmp, 'maske.png'), '-loop', '1', '-i', join(tmp, 'ebene.png'),
  '-filter_complex', filter, '-map', '[out]', ...(mitTon ? ['-map', '0:a', '-c:a', 'aac', '-b:a', '160k'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', '-r', String(fps), '-shortest', '-movflags', '+faststart', ziel], { stdio: 'inherit' });
rmSync(tmp, { recursive: true, force: true });
console.log(id + ' -> out/' + id + '.mp4 (' + W + ' × ' + H + ', ' + fps + ' fps' + (mitTon ? ', mit Ton' : '') + '; Video ' + vs.width + ' × ' + vs.height + ' skaliert auf ' + sw + ' × ' + sh + ', Ausschnitt ab y ' + oy + ')');

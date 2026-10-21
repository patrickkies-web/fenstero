// eeziframes · einen Befehl mit eigenem, kurzlebigem Testserver ausführen (wie die Prüfsuite es macht).
// Nutzung: node scripts/mit-server.mjs <port> <befehl> [argumente …]
//   z. B.  node scripts/mit-server.mjs 8911 env PW_PFAD=/opt/node-tools NUR=3 node scripts/pruefen.mjs
// Startet scripts/dev-server.mjs als Kindprozess (KI_ATTRAPPE=1, ohne DATEN_ATTRAPPE), wartet bis der Port mit 200 antwortet,
// führt den Befehl mit SERVER_PORT=<port> und BASE=http://localhost:<port> aus (die Prüfsuite liest BASE) und beendet den Server danach,
// auch bei Fehlern. Jeder Agent nimmt einen eigenen Port, damit sich Läufe nicht stören.
import cp from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [port, befehl, ...rest] = process.argv.slice(2);
if (!port || !befehl) { console.error('Nutzung: mit-server.mjs <port> <befehl> [argumente …]'); process.exit(2); }

const server = cp.spawn(process.execPath, [path.join(WURZEL, 'scripts/dev-server.mjs')], {
  cwd: WURZEL, env: { ...process.env, PORT: String(port), KI_ATTRAPPE: '1' }, stdio: ['ignore', 'ignore', 'pipe'],
});
let fehler = '';
server.stderr.on('data', (d) => { fehler += d; });
const beenden = () => { try { server.kill('SIGTERM'); } catch (e) { /* schon beendet */ } };
process.on('exit', beenden);
process.on('SIGINT', () => { beenden(); process.exit(130); });

const bereit = async () => {
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch('http://localhost:' + port + '/'); if (r.status === 200) return true; } catch (e) { /* noch nicht da */ }
    if (server.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
};
if (!(await bereit())) { console.error('Server auf Port ' + port + ' kam nicht hoch.\n' + fehler); beenden(); process.exit(1); }
const kind = cp.spawn(befehl, rest, { cwd: process.cwd(), stdio: 'inherit', env: { ...process.env, SERVER_PORT: String(port), BASE: process.env.BASE || 'http://localhost:' + port } });
kind.on('exit', (code) => { beenden(); process.exit(code == null ? 1 : code); });

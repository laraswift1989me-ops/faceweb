/**
 * SwiftEarn Frontend — GitHub Webhook Server (ESM)
 * Runs on the frontend server (port 9001, internal only).
 * Nginx proxies POST /webhook → http://127.0.0.1:9001
 */

import http        from 'http';
import crypto      from 'crypto';
import { execFile } from 'child_process';
import path        from 'path';
import fs          from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────
const PORT     = parseInt(process.env.WEBHOOK_PORT   || '9001', 10);
const SECRET   = process.env.WEBHOOK_SECRET          || '';
const BRANCH   = process.env.WEBHOOK_BRANCH          || 'refs/heads/main';
const SCRIPT   = process.env.WEBHOOK_SCRIPT          || path.join(__dirname, 'deploy-frontend.sh');
const LOG_FILE = process.env.WEBHOOK_LOG             || path.join(__dirname, 'logs', 'deploy-frontend.log');

if (!SECRET) {
    console.error('[webhook] WEBHOOK_SECRET is not set — refusing to start.');
    process.exit(1);
}

fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

// ── Server ────────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
    if (req.method !== 'POST') {
        res.writeHead(405).end('Method Not Allowed');
        return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        // 1. Verify HMAC-SHA256 signature
        const sigHeader = req.headers['x-hub-signature-256'] || '';
        const expected  = 'sha256=' + crypto.createHmac('sha256', SECRET).update(body).digest('hex');

        if (!sigHeader || !crypto.timingSafeEqual(
            Buffer.from(expected),
            Buffer.from(sigHeader.padEnd(expected.length))
        )) {
            log('WARN  signature mismatch — request rejected');
            res.writeHead(403).end('Forbidden');
            return;
        }

        // 2. Parse payload
        let payload;
        try { payload = JSON.parse(body); }
        catch { res.writeHead(400).end('Bad Request'); return; }

        // 3. Only deploy on push to main
        if (payload.ref !== BRANCH) {
            log(`INFO  ignored push to ${payload.ref} (not ${BRANCH})`);
            res.writeHead(200).end('Ignored');
            return;
        }

        // 4. Respond immediately, then run deploy in background
        res.writeHead(200).end('OK');

        const pusher = payload.pusher?.name ?? 'unknown';
        const commit = payload.head_commit?.id?.slice(0, 8) ?? 'unknown';
        log(`INFO  deploying — pusher=${pusher} commit=${commit}`);

        const logStream = fs.openSync(LOG_FILE, 'a');

        execFile('bash', [SCRIPT], { stdio: ['ignore', logStream, logStream] }, (err) => {
            fs.closeSync(logStream);
            if (err) {
                log(`ERROR deploy script exited with code ${err.code}: ${err.message}`);
            } else {
                log(`INFO  deploy finished successfully`);
            }
        });
    });
});

server.listen(PORT, '127.0.0.1', () => {
    log(`INFO  webhook server listening on 127.0.0.1:${PORT}`);
});

function log(msg) {
    const ts   = new Date().toISOString();
    const line = `[${ts}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + '\n');
}

#!/usr/bin/env node
/* ==========================================================================
 * WalletOS — zero-dependency static dev server
 * --------------------------------------------------------------------------
 *   npm run dev            → http://localhost:4173
 *   PORT=8080 npm run dev  → http://localhost:8080
 *
 * Why a hand-rolled server instead of `npx serve`? WalletOS ships no build
 * step and no dependencies, so development should be the same: `node` only.
 * It also sends the no-store headers a service-worker-backed app needs, so
 * you never debug a stale bundle.
 * ========================================================================== */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../', import.meta.url)));
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

/** Resolve a request path to a file inside ROOT, or null if it escapes. */
function safePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null;
  }
  if (decoded.endsWith('/')) decoded += 'index.html';
  const target = resolve(join(ROOT, normalize(decoded)));
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;
  return target;
}

async function resolveFile(target) {
  const info = await stat(target).catch(() => null);
  if (!info) return null;
  if (info.isFile()) return target;
  return resolveFile(join(target, 'index.html')).catch(() => null);
}

const BASE_HEADERS = {
  'Cache-Control': 'no-store, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...BASE_HEADERS, ...headers });
  res.end(body);
}

function sendFile(req, res, file, type) {
  res.writeHead(200, { ...BASE_HEADERS, 'Content-Type': type, 'Service-Worker-Allowed': '/' });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file)
    .on('error', () => {
      // Headers may already be flushed; best effort.
      res.end();
    })
    .pipe(res);
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed\n', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  const target = safePath(req.url || '/');
  if (!target) return send(res, 400, 'Bad Request\n', { 'Content-Type': 'text/plain; charset=utf-8' });

  const file = await resolveFile(target);
  if (!file) {
    // Unknown deep link → the SPA shell, which is how icon/start_url land.
    const shell = await resolveFile(join(ROOT, 'index.html'));
    if (!shell) {
      return send(res, 404, 'Not Found\n', { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    return sendFile(req, res, shell, MIME['.html']);
  }

  sendFile(req, res, file, MIME[extname(file).toLowerCase()] || 'application/octet-stream');
});

server.listen(PORT, HOST, () => {
  console.log(`\n  WalletOS dev server`);
  console.log(`  → local:   http://localhost:${PORT}`);
  console.log(`  → network: http://${HOST}:${PORT}`);
  console.log(`  serving:   ${ROOT}\n`);
});

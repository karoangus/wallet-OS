/* ==========================================================================
 * WalletOS — Service Worker
 * ==========================================================================
 * Offline-first shell for a fully local finance app.
 *
 * Strategy (v2):
 *   • Navigations      → network-first (with a short timeout) so a new
 *                        deployment actually reaches returning users, falling
 *                        back to the cached shell, then to offline.html.
 *   • Same-origin GET  → stale-while-revalidate (instant, self-healing).
 *   • Google Fonts     → cache-first in a dedicated, size-capped cache.
 *   • Everything else  → passthrough (never fails the request because of us).
 *
 * Updates: the shell no longer pins a single immortal cache. The version
 * below is the only thing you need to bump (or let the app ask for
 * SKIP_WAITING, which this worker honours immediately).
 * ========================================================================== */

const VERSION = '2.0.0';

const SHELL_CACHE = `walletos-shell-${VERSION}`;
const RUNTIME_CACHE = `walletos-runtime-${VERSION}`;
const FONT_CACHE = `walletos-fonts-${VERSION}`;
const KEEP = [SHELL_CACHE, RUNTIME_CACHE, FONT_CACHE];

/** How long we wait for the network before serving a cached navigation. */
const NAV_TIMEOUT = 2500;

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/** Files that must exist for the app to boot offline. */
const SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

const MAX_FONT_ENTRIES = 40;
const MAX_RUNTIME_ENTRIES = 80;

const absolute = (path) => new URL(path, self.location).href;

/* -------------------------------------------------------------------------- */
/* Install / activate                                                          */
/* -------------------------------------------------------------------------- */

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // add() one-by-one: a single missing/404 asset must not abort the whole
      // install (the old addAll() behaviour left users with no service worker).
      await Promise.all(
        SHELL.map(async (path) => {
          try {
            await cache.add(new Request(absolute(path), { cache: 'reload' }));
          } catch (err) {
            console.warn('[WOS][SW] precache skipped:', path, err);
          }
        })
      );
      // Deliberately NOT calling skipWaiting() here: an update waits until the
      // user accepts it in the UI (or closes every tab). Auto-activating would
      // silently reload open tabs and throw away a half-filled transaction.
      // Navigations are network-first, so new content still loads immediately.
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !KEEP.includes(key)).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

/** Let the page promote a waiting worker without a manual hard-reload. */
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'CLEAR_CACHES') {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .then(() => self.skipWaiting())
    );
  }
});

/* -------------------------------------------------------------------------- */
/* Fetch routing                                                               */
/* -------------------------------------------------------------------------- */

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request, FONT_CACHE, MAX_FONT_ENTRIES));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Cross-origin: don't interfere.
});

async function handleNavigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await withTimeout(fetch(request), NAV_TIMEOUT);
    if (response && response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = (await caches.match(request)) || (await cache.match(absolute('./index.html')));
    if (cached) return cached;
    const offline = await cache.match(absolute('./offline.html'));
    if (offline) return offline;
    return new Response(offlineFallbackHtml(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      trimCache(cacheName, maxEntries);
    }
    return response;
  } catch (err) {
    return (
      (await caches.match(request)) ||
      new Response('', { status: 504, statusText: 'Offline' })
    );
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response && response.ok && response.type === 'basic') {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES);
      }
      return response;
    })
    .catch(() => null);

  if (cached) return cached;

  const response = await network;
  if (response) return response;
  return new Response('', { status: 504, statusText: 'Offline' });
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('network-timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function trimCache(cacheName, maxEntries) {
  if (!maxEntries) return;
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
}

function offlineFallbackHtml() {
  return `<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WalletOS — آفلاین</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080B14;color:#EDF1FB;font-family:'Vazirmatn',system-ui,sans-serif">
<div style="text-align:center;padding:24px">
  <div style="font-size:17px;font-weight:800">شما آفلاین هستید</div>
  <div style="margin-top:8px;font-size:13px;color:#8D96B8">داده‌های شما روی همین دستگاه ذخیره شده و امن است.</div>
  <button onclick="location.reload()" style="margin-top:20px;padding:11px 22px;border:0;border-radius:13px;background:#3E7BFA;color:#0A0E1A;font-weight:800;cursor:pointer">تلاش دوباره</button>
</div></body></html>`;
}

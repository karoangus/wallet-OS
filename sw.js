// WalletOS Service Worker — Full Offline Cache
// این فایل توسط GitHub Actions بعد از build آپدیت می‌شه

const CACHE_VERSION = "walletos-v1";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;
const ALL_CACHES = [SHELL_CACHE, ASSETS_CACHE];

// فایل‌های اصلی اپ — بعد از build توسط workflow آپدیت می‌شن
const SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-192.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32.png",
  "/icons/favicon-16.png",
];

// ==================== INSTALL ====================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("[SW] Install cache failed:", err);
        self.skipWaiting();
      })
  );
});

// ==================== ACTIVATE ====================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !ALL_CACHES.includes(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ==================== FETCH ====================
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // فقط http/https — از chrome-extension و غیره بگذر
  if (!url.protocol.startsWith("http")) return;

  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    // اپ‌شل: Cache First — اگه توی کش نبود از شبکه بگیر و کش کن
    event.respondWith(cacheFirst(req, SHELL_CACHE));
  } else {
    // فونت‌ها (Vazirmatn) و هر چیز خارجی: Stale-While-Revalidate
    event.respondWith(staleWhileRevalidate(req, ASSETS_CACHE));
  }
});

// ==================== STRATEGIES ====================

async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    // اگه آفلاین بود و توی کش نبود — صفحه‌ی اصلی رو برگردون (SPA fallback)
    const fallback = await caches.match("/index.html");
    return fallback || new Response("آفلاین هستید", { status: 503 });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  const networkPromise = fetch(req).then((res) => {
    if (res && res.status === 200) cache.put(req, res.clone());
    return res;
  }).catch(() => null);

  return cached || await networkPromise || new Response("", { status: 503 });
}

// ==================== MESSAGES ====================
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data?.type === "GET_VERSION") {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

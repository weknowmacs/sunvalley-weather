// Sun Valley Weather service worker — offline shell + network-first for code.
const CACHE = 'svw-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './manifest.webmanifest',
  './favicon.svg',
  './hero-cam.jpg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Live NWS / USGS data: always network, fall back to cache if offline.
  if (url.hostname.endsWith('weather.gov') || url.hostname.endsWith('waterservices.usgs.gov')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  // Code & markup: network-first so new deploys always win; cache only when offline.
  const isCode = sameOrigin && /\.(css|js|html?|webmanifest)$/.test(url.pathname);
  const isNav = sameOrigin && (url.pathname === '/' || url.pathname === '/index.html');
  if (isCode || isNav) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Images & other static assets: cache-first, refresh in background.
  e.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached)
    )
  );
});

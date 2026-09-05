// Legacy cleanup service worker.
// Unregisters itself and deletes all caches on activate, so the site always
// loads fresh from the network with no service worker interfering.
self.addEventListener('install', (e) => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
      .catch(() => {})
  );
});

// While this worker briefly controls a page, always hit the network.
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

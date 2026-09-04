/* Monsaraz Castle guide — service worker v2026.09.04 */
const VERSION = 'monsaraz-guide-v1';
const OFFLINE_FALLBACK = '/pt';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(['/pt', '/icons/icon.svg']))
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // App shell: network-first, offline fallback to the default-locale home page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(OFFLINE_FALLBACK, copy)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match(OFFLINE_FALLBACK).then((cached) => cached || caches.match('/'))
        )
    );
    return;
  }

  // Static assets: cache-first, then network and populate cache for later visits.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response.ok && (url.pathname.startsWith('/gallery/') || url.pathname.startsWith('/icons/'))) {
              const copy = response.clone();
              caches.open(VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return response;
          })
          .catch(() => cached)
    )
  );
});

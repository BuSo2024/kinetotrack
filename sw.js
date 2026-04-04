const CACHE_NAME = "kinetotrack-v1";

const urlsToCache = [
  "/kinetotrack/",
  "/kinetotrack/index.html",
  "/kinetotrack/manifest.json",
  "/kinetotrack/icons/icon-192.png",
  "/kinetotrack/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

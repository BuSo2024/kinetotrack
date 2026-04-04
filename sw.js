// KinetoTrack Service Worker v1
const CACHE_NAME = 'kinetotrack-v1';

// Fișiere de cache pentru offline
const ASSETS = [
  '/kinetotrack/',
  '/kinetotrack/index.html',
  '/kinetotrack/manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js'
];

// Instalare — cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activare — curăță cache vechi
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback cache
self.addEventListener('fetch', event => {
  // Firebase și API calls — nu le cache-uim
  if (event.request.url.includes('firebasedatabase') ||
      event.request.url.includes('googleapis.com/identitytoolkit') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Salvează în cache o copie proaspătă
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Offline — returnează din cache
        return caches.match(event.request)
          .then(cached => cached || caches.match('/kinetotrack/'));
      })
  );
});

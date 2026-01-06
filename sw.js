
const CACHE_NAME = 'anglerpro-v1';
const ASSETS = [
  './',
  './index.html',
  './index.tsx',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // For API calls, try network first
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(fetch(event.request).catch(() => {
      // Return a basic offline response if the API fails and we are offline
      return new Response(JSON.stringify({ error: "Offline" }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }));
    return;
  }

  // For assets, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

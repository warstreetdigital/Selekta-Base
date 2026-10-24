// Selekta Base PWA Service Worker (Cloudflare Pages Static Edition)
const CACHE_NAME = 'selektabase-v6-static';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/explore',
  '/explore.html',
  '/event',
  '/event.html',
  '/tickets',
  '/tickets.html',
  '/checkout',
  '/checkout.html',
  '/account',
  '/account.html',
  '/organiser',
  '/organiser.html',
  '/scan',
  '/scan.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Selekta Base SW] Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Selekta Base SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For HTML navigation requests: Network first, fall back to matching cached page or index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (!url.pathname.endsWith('.html')) {
          const withHtml = await caches.match(url.pathname + '.html');
          if (withHtml) return withHtml;
        } else {
          const withoutHtml = await caches.match(url.pathname.replace(/\.html$/, ''));
          if (withoutHtml) return withoutHtml;
        }
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Handle local origin requests
  if (url.origin === self.location.origin) {
    // Never intercept Vite internal scripts or node_modules
    if (url.pathname.startsWith('/@') || url.pathname.includes('node_modules')) {
      return;
    }

    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const contentType = networkResponse.headers.get('content-type') || '';
            const isHtml = contentType.includes('text/html');
            const isScriptOrStyle = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');

            // CRITICAL: Never cache an HTML fallback response for a .js or .css request
            if (!(isScriptOrStyle && isHtml)) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clone);
              });
            }
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});

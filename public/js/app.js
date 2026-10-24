// Selekta Base PWA Client Initialization Script
(function() {
  // Register Service Worker if supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('[Selekta Base PWA] Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.warn('[Selekta Base PWA] Service Worker registration failed:', error);
        });
    });
  }

  // Monitor connectivity state
  window.addEventListener('online', () => {
    document.dispatchEvent(new CustomEvent('selectabase:connection', { detail: { online: true } }));
  });

  window.addEventListener('offline', () => {
    document.dispatchEvent(new CustomEvent('selectabase:connection', { detail: { online: false } }));
  });
})();

const CACHE_NAME = 'go-away-v4'; // 升級版本號強制更新
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/MORITAD.ttf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    )).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 💡 關鍵修正：如果是 Supabase API，絕對不走快取，直接連網
  if (url.hostname.includes('supabase.co')) {
    return; // 放行，交給瀏覽器正常連網處理
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // 只有靜態檔案才存入快取
        if (event.request.method === 'GET' && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
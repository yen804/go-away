const CACHE_NAME = 'go-away-v5';
// 💡 注意：如果你部署在根目錄，路徑開頭建議都加 /
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/MORITAD.ttf'
];

self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 使用 map 逐一加入，避免其中一個檔案失敗導致全部失敗
      return Promise.all(
        PRECACHE_ASSETS.map(url => {
          return cache.add(url).catch(err => console.error(`快取失敗的檔案: ${url}`, err));
        })
      );
    }).then(() => self.skipWaiting())
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
  // 放行 Supabase API
  if (url.hostname.includes('supabase.co')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((response) => {
        if (event.request.method === 'GET' && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      });
    }).catch(() => caches.match('/index.html'))
  );
});
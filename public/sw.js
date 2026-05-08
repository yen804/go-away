const CACHE_NAME = 'go-away-v3';
// 這裡列出 App 啟動必須要有的檔案
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/MORITAD.ttf' // <--- 加入這一行
];

// 1. 安裝階段：強行下載必要資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. 啟動階段：清理舊版本，接管所有頁面
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => clients.claim())
  );
});

// 3. 攔截階段：優先從快取拿資料，沒快取才走網路
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // 命中快取，秒開！
      }
      return fetch(event.request).then((networkResponse) => {
        // 順便把新抓到的資料存進快取（例如你新加的圖片）
        if (event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // 萬一徹底斷網且沒快取，保底回傳 index.html
      return caches.match('/index.html');
    })
  );
});
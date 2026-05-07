const CACHE_NAME = 'go-away-cache-v1';

// 安裝階段：立刻取得控制權
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 啟動階段：清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 攔截請求：如果沒網路，就從快取拿；有網路，就去抓並存進快取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // 只快取正常的 GET 請求
          if (event.request.method === 'GET') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    }).catch(() => {
      // 真的完全沒網路且沒快取時，顯示 index.html
      return caches.match('./index.html');
    })
  );
});
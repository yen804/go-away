const CACHE_NAME = 'go-away-v2';

// 1. 安裝時立刻跳過等待
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. 啟動時立刻取得控制權
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. 核心邏輯：攔截請求
self.addEventListener('fetch', (event) => {
  // 只處理導航請求（開啟頁面）或是 GET 請求
  if (event.request.mode === 'navigate' || event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 當 fetch 失敗（即斷網）時，嘗試從快取中找
        return caches.match(event.request).then((response) => {
          // 如果快取有就給快取，沒有就強制給 index.html
          return response || caches.match('/index.html');
        });
      })
    );
  }
});
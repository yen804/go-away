const CACHE_NAME = 'travel-v1';
const ASSETS = [
  './',
  './index.html',
  // 如果你有外部的 CSS 或 JS 檔案，請把路徑加在這裡，例如：
  // './style.css',
  // './script.js'
];

// 安裝時快取資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 沒網路時，從快取抓資料
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
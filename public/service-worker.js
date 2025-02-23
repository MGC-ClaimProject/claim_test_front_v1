// service-worker.js

const CACHE_NAME = 'my-cache-v1';
const URLs_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/main.js',
  '/assets/styles.css',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
];

// 설치 이벤트: 필요한 파일을 캐시에 추가
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLs_TO_CACHE);
    })
  );
});

// 활성화 이벤트: 이전 캐시 삭제
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetch 이벤트: 네트워크 요청을 캐시된 파일로 응답
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

const CACHE_NAME = 'quark-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // لو عندك أي ملفات CSS أو صور محلية تقدر تضيفها هنا
];

// تسجيل الملفات في الكاش أثناء التثبيت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// جلب الملفات من الكاش لو مفيش نت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // رجع الملف من الكاش
        }
        return fetch(event.request); // جيب من السيرفر لو مش في الكاش
      }
    )
  );
});

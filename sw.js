// اسم الكاش متغير دائماً بناءً على الوقت لضمان عدم تطابقه
const CACHE_NAME = 'quark-zero-cache-' + new Date().getTime();

// التثبيت الفوري وتخطي الانتظار
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// التفعيل وتدمير أي كاش مخزن سابقاً على جهاز الطالب
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    console.log('🗑️ جاري تدمير الكاش القديم:', cache);
                    return caches.delete(cache);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// استراتيجية Network Only: اطلب من السيرفر مباشرة وتجاهل الكاش نهائياً
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request, { cache: 'no-store' }) // إجبار الطلب يتجاهل كاش المتصفح كمان
            .catch(() => {
                // في حالة انقطاع الإنترنت
                return new Response('أنت غير متصل بالإنترنت يا بطل. مفيش كاش متاح عشان إنت طالب تلغيه!', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
                });
            })
    );
});

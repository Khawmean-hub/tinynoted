// Service Worker
const cacheName = "my-pwa-shell-v1.0";
const filesToCache = [
    "/",
    "index.html",
    "linkView.html",
    "./js/pwa/index.js",
    "./css/index.css",
    "./css/skin.min.css",
    "./css/stack_overflow_skin.css",
    "./css/toast.css",
    '/manifest.json',
    './assets/icons/icon.png',
];

self.addEventListener("install", e => {
    console.log("[ServiceWorker] - Install");
    e.waitUntil((async () => {
            const cache = await caches.open(cacheName);
            console.log("[ServiceWorker] - Caching app shell");
            await cache.addAll(filesToCache);
        })());
});

self.addEventListener('fetch', e => {
    e.respondWith((async () => {
        const resource = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        
        return resource || fetch(e.request);
    })());
});

self.addEventListener("activate", e => {
    e.waitUntil((async () => {
        const keyList = await caches.keys();
        await Promise.all(
            keyList.map(key => {
                console.log(key);
                if (key !== cacheName) {
                    console.log("[ServiceWorker] - Removing old cache", key);
                    return caches.delete(key);
                }
            })
        );
    })());
    e.waitUntil(self.clients.claim());
});
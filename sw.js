const CACHE = "jimmy-isidro-v3.2.0";
const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./app.js", "./config.js", "./data.js", "./manifest.webmanifest",
  "./assets/images/logo.webp", "./assets/images/jimmy-portada-frontal.webp", "./assets/images/jimmy-portada-frontal-desktop.webp",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/icons/apple-touch-icon.png"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const clone = res.clone(); caches.open(CACHE).then(cache => cache.put(req, clone)); return res;
  }).catch(() => caches.match("./index.html"))));
});

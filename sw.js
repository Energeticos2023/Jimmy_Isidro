const CACHE = "jimmy-isidro-v5.0.3";
const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./app.js", "./config.js", "./data.js",
  "./manifest.webmanifest",
  "./assets/fonts/archivo.woff2",
  "./assets/images/logo.webp", "./assets/images/jimmy-portada-frontal.webp",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/icons/apple-touch-icon.png"
];
self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
    .then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(req, clone));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});

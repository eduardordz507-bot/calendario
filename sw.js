/* Service worker: cachea el shell de la app para que abra rápido y offline.
   Sube VERSION cuando cambies archivos para forzar actualización. */
const VERSION = "cal-v1";
const SHELL = [
  "./",
  "./index.html",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Solo manejamos archivos propios (mismo origen). Firebase y fuentes van directo a la red.
  if (url.origin !== location.origin || e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) {
        // Revalida en segundo plano.
        fetch(e.request).then((res) => {
          if (res && res.ok) caches.open(VERSION).then((c) => c.put(e.request, res.clone()));
        }).catch(() => {});
        return hit;
      }
      return fetch(e.request).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

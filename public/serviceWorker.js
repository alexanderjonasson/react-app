const CACHE_NAME = "warhammer-pwa-v3";
const APP_SHELL = ["/", "/index.html", "/manifest.json", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.mode === "navigate") {
    event.respondWith(navigateHandler(request));
    return;
  }

  const url = new URL(request.url);
  if (
    url.origin === "http://localhost:5000" &&
    url.pathname.startsWith("/api/")
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.method === "GET") {
    event.respondWith(cacheFirst(request));
  }
});

async function navigateHandler(request) {
  try {
    const res = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match("/offline.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const res = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, res.clone());
  return res;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const res = await fetch(request);
    cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  }
}

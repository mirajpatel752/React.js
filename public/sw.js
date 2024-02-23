const cacheData = "appV1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      return cache.addAll([
        "/static/js/bundle.js",
        "/static/js/main.chunk.js",
        "/static/js/0.chunk.js",
        "/index.html",
        "/",
        "/users",
        "/profile",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log(navigator.onLine)
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // No cache hit - fetch from network
        return fetch(event.request);
      })
    );
  }
});

const ADMIN_CACHE = "seel-admin-v1";
const OFFLINE_URL = "/admin/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ADMIN_CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/admin", "/admin/login"]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== ADMIN_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/admin") && !url.pathname.startsWith("/api")) return;
  if (req.method !== "GET") return;

  // Admin API: network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(ADMIN_CACHE).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Admin pages: network-first, fallback to offline shell
  event.respondWith(
    fetch(req)
      .then((res) => {
        const clone = res.clone();
        caches.open(ADMIN_CACHE).then((cache) => cache.put(req, clone));
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        const offline = await caches.match(OFFLINE_URL);
        return (
          offline ||
          new Response("No connection", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        );
      })
  );
});


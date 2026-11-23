// This site has no service worker. This file exists only to remove the one an
// older app on this domain installed: browsers that still have it fetch this
// file on their next visit, then this version clears its caches, unregisters
// itself and reloads the open tabs from the network.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: "window" });
      tabs.forEach((tab) => tab.navigate(tab.url));
    })(),
  );
});

// public/sw.js

let manifest = [];
try {
  manifest = self.__WB_MANIFEST || [];
} catch (e) {
  console.warn("No manifest found:", e);
}

if (manifest.length > 0) {
  try {
    importScripts(
      "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
    );
    if (workbox) {
      workbox.precaching.precacheAndRoute(manifest);
    }
  } catch (error) {
    console.warn("Workbox precaching skipped:", error);
  }
}

// Install - skip waiting immediately
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  self.skipWaiting();
});

// Activate - claim clients immediately
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.includes("paraplug")) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});

// Handle skip waiting message (important for mobile)
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data);
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Push notification handler
self.addEventListener("push", function (event) {
  console.log("[SW] Push received");
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: "New notification",
      body: event.data?.text() || "You have a notification",
    };
  }

  const title = data.title || "Notification";
  const options = {
    body: data.body,
    icon: data.icon || "/images/logo-192-192.png",
    badge: data.badge || "/images/logo-192-192.png",
    data: { url: data.url || "/" },
    tag: data.tag,
    // Add these for better mobile support
    vibrate: [200, 100, 200],
    requireInteraction: false, // Auto-dismiss on mobile
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Notification clicked");
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Check for existing window
        for (const client of windowClients) {
          if (client.url.includes(new URL(url).pathname) && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

console.log("[SW] Service Worker loaded");

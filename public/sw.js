// public/sw.js
import { precacheAndRoute } from "workbox-precaching";

// Declare the manifest - next-pwa will inject it
const manifest = self.__WB_MANIFEST || [];

// Precache with error handling
if (manifest.length > 0) {
  try {
    precacheAndRoute(manifest, {
      ignoreURLParametersMatching: [/.*/],
    });
  } catch (error) {
    console.warn("Precaching failed, continuing anyway:", error);
  }
}

// Install event - force activation
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event - take control
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(clients.claim());
});

// Push notification handler
self.addEventListener("push", function (event) {
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
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Skip waiting on message
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

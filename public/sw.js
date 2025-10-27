import { precacheAndRoute } from "workbox-precaching";
precacheAndRoute(self.__WB_MANIFEST || []);
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

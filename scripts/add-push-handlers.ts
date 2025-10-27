import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swPath = path.join(__dirname, '../public/sw.js');

const pushHandlers = `
// Push notification handlers
self.addEventListener("push", function (event) {
  console.log("[SW] Push received");
  let data = {};
  try {
    data = event.data?.json() || {};
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
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
`;

try {
  if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    if (!swContent.includes('Push notification handlers')) {
      swContent += pushHandlers;
      fs.writeFileSync(swPath, swContent);
      console.log('✅ Push handlers added to service worker');
    } else {
      console.log('ℹ️  Push handlers already present in service worker');
    }
  } else {
    console.log('⚠️  Service worker file not found at:', swPath);
  }
} catch (error) {
  console.error('❌ Error adding push handlers:', error);
  process.exit(1);
}
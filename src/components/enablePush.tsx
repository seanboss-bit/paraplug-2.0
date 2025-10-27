"use client";
import api from "../request"; // your centralized axios instance

export async function subscribeAdminToPush() {
  // Step 1 — Check browser support
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push not supported in this browser");
  }

  // Step 2 — Get VAPID public key from your backend
  const { data } = await api.get("/push/vapidPublicKey");
  const publicKey = data.publicKey;

  // Step 3 — Register service worker (next-pwa likely already handles this)
  const registration =
    (await navigator.serviceWorker.register("/sw.js")) ||
    (await navigator.serviceWorker.ready);

  // Step 4 — Ask browser for permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  // Step 5 — Subscribe browser to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  // Step 6 — Send subscription to backend (saves it under adminId)
  await api.post("/push/subscribe", { subscription });

  return subscription;
}

// Helper to convert base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

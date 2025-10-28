"use client";
import api from "../request"; // your centralized axios instance

// Detect iOS
function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

// Detect if running as PWA
function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

export async function subscribeAdminToPush() {
  // Step 1 — Check browser support
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications not supported in this browser");
  }

  // iOS Safari limitations
  if (isIOS() && !isStandalone()) {
    throw new Error(
      "On iOS, please add this site to your home screen first to enable notifications"
    );
  }

  try {
    console.log("[Push] Starting subscription process...");

    // Step 2 — Get VAPID public key from backend
    const { data } = await api.get("/push/vapidPublicKey");
    const publicKey = data.publicKey;
    console.log("[Push] VAPID key received");

    // Step 3 — Get or register service worker
    let registration = await navigator.serviceWorker.getRegistration("/");

    if (!registration) {
      console.log(
        "[Push] No registration found, registering service worker..."
      );
      registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // Important for iOS
      });
      console.log("[Push] Service worker registered");
    }

    // Step 4 — Wait for service worker to be active (critical on mobile)
    if (!registration.active) {
      console.log("[Push] Waiting for service worker to activate...");

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(
            new Error("Service worker activation timeout after 15 seconds")
          );
        }, 15000); // Longer timeout for mobile

        const checkState = (worker: ServiceWorker | null) => {
          if (!worker) {
            clearTimeout(timeout);
            reject(new Error("No service worker found"));
            return;
          }

          if (worker.state === "activated") {
            clearTimeout(timeout);
            resolve();
          } else {
            worker.addEventListener("statechange", function handler() {
              if (this.state === "activated") {
                this.removeEventListener("statechange", handler);
                clearTimeout(timeout);
                resolve();
              } else if (this.state === "redundant") {
                this.removeEventListener("statechange", handler);
                clearTimeout(timeout);
                reject(new Error("Service worker became redundant"));
              }
            });
          }
        };

        if (registration.installing) {
          checkState(registration.installing);
        } else if (registration.waiting) {
          // Force waiting worker to activate
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          checkState(registration.waiting);
        } else if (registration.active) {
          clearTimeout(timeout);
          resolve();
        } else {
          // Wait for service worker ready as fallback
          navigator.serviceWorker.ready.then(() => {
            clearTimeout(timeout);
            resolve();
          });
        }
      });
    }

    console.log("[Push] Service worker is active:", registration.active);

    // Step 5 — Request notification permission
    console.log("[Push] Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("[Push] Permission status:", permission);

    if (permission !== "granted") {
      throw new Error("Notification permission was denied");
    }

    // Step 6 — Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    console.log(
      "[Push] Existing subscription:",
      subscription ? "found" : "not found"
    );

    // Step 7 — Create new subscription if needed
    if (!subscription) {
      console.log("[Push] Creating new push subscription...");

      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        console.log("[Push] Subscription created successfully");
      } catch (subError) {
        console.error("[Push] Subscription creation failed:", subError);

        // Additional debugging for mobile
        if (subError instanceof DOMException) {
          if (subError.name === "NotAllowedError") {
            throw new Error("Notification permission was denied or revoked");
          } else if (subError.name === "AbortError") {
            throw new Error(
              "Service worker is not active yet. Please try again."
            );
          }
        }
        throw subError;
      }
    }

    // Step 8 — Send subscription to backend with metadata
    console.log("[Push] Sending subscription to backend...");

    const subscriptionData = subscription.toJSON();

    await api.post("/push/subscribe", {
      subscription: {
        endpoint: subscriptionData.endpoint,
        keys: subscriptionData.keys,
      },
      userAgent: navigator.userAgent,
      expirationTime: subscription.expirationTime || null,
    });

    console.log("[Push] Subscription saved to backend successfully");

    return subscription;
  } catch (error) {
    console.error("[Push] Subscription failed:", error);

    // User-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes("iOS")) {
        throw error; // Already user-friendly
      } else if (error.message.includes("not supported")) {
        throw new Error(
          "Push notifications are not supported on this browser. Try Chrome or Firefox on Android, or Safari on iOS (added to home screen)."
        );
      }
    }

    throw error;
  }
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

// Optional: Function to check if notifications are supported
export function areNotificationsSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Optional: Function to check notification permission status
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

// Optional: Function to check current subscription status
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration("/");
    if (!registration) return null;

    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("[Push] Failed to get current subscription:", error);
    return null;
  }
}

// Optional: Function to unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.getRegistration("/");
    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return false;

    const unsubscribed = await subscription.unsubscribe();

    if (unsubscribed) {
      // Notify backend to remove subscription
      await api.post("/push/unsubscribe", {
        endpoint: subscription.endpoint,
      });
      console.log("[Push] Unsubscribed successfully");
    }

    return unsubscribed;
  } catch (error) {
    console.error("[Push] Unsubscribe failed:", error);
    return false;
  }
}

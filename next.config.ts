import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Fixed: was NEXT_PUBLIC_NODE_ENV
  scope: "/", // Add explicit scope for mobile
  sw: "sw.js", // Ensure it's served from root
  buildExcludes: [/app-build-manifest\.json$/, /middleware-manifest\.json$/], // Exclude problematic manifests
  // Minimal runtime caching to avoid issues
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "paraplug.org",
      "images.stockx.com",
      "res.cloudinary.com",
      "upload.wikimedia.org",
      "images.unsplash.com",
      "cdn.dribbble.com",
      "static-00.iconduck.com",
      "media.istockphoto.com",
    ],
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(nextConfig as any);

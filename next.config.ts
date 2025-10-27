import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  // Use your custom service worker
  swSrc: "public/sw.js",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  buildExcludes: [/app-build-manifest\.json$/],
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

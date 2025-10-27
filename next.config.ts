import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  swSrc: "public/sw.js",
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

// ✅ Type-safe export
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(nextConfig as any);

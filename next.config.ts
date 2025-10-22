import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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

export default nextConfig;

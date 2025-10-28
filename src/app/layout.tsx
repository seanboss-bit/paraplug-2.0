import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClientProvider } from "@/providers/ClientProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Paraplug Store - Nike and Jordan Sneaker Store",
  description: "Nike and Jordan Sneaker Store",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/para.png",
    shortcut: "/images/para.png",
    apple: "/images/para.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#130206" />
      <meta name="background-color" content="#ffffff" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="white-translucent"
      />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Paraplug" />
      <body className={`${poppins.className} antialiased`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
